

import { exec } from 'child_process';
import { createReadStream, writeFileSync, unlinkSync, readFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse';
import { promisify } from 'util';
import { tmpdir } from 'os';
import { join } from 'path';

const execAsync = promisify(exec);

// --- Configuration ---
const DB_NAME = 'ispinfo-db';
// Initial target batch size. This will dynamically decrease if SQLITE_TOOBIG errors occur.
const INITIAL_BATCH_SIZE = 1000;
// Minimum batch size to prevent excessively small batches or infinite loops.
const MIN_BATCH_SIZE = 100;
// State file for resumable imports
const STATE_FILE = './import-state.json';

// --- File Paths ---
const ASN_BLOCKS_FILE = './data/GeoLite2-ASN-Blocks-IPv4.csv';
const CITY_BLOCKS_FILE = './data/GeoLite2-City-Blocks-IPv4.csv';
const CITY_LOCATIONS_FILE = './data/GeoLite2-City-Locations-en.csv';

// --- State Management for Resumable Imports ---

/**
 * Reads the current import state from the state file.
 * @returns {object} The current state.
 */
function readState() {
  if (existsSync(STATE_FILE)) {
    const stateJson = readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(stateJson);
  }
  return {};
}

/**
 * Writes the current state to the state file.
 * @param {object} state - The state to save.
 */
function writeState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}


// --- Helper Functions ---

function ipToInt(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function cidrToIntRange(cidr) {
  const [ip, mask] = cidr.split('/');
  const start = ipToInt(ip);
  const end = start + (2 ** (32 - parseInt(mask, 10)) - 1);
  return { start, end };
}

async function executeSql(sql) {
  const tempFilePath = join(tmpdir(), `query-${Date.now()}-${Math.random()}.sql`);
  const command = `npx wrangler d1 execute ${DB_NAME} --file=${tempFilePath} --json`;
  try {
    writeFileSync(tempFilePath, sql);
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error(`Wrangler stderr: ${stderr}`);
      throw new Error('Wrangler reported an error.');
    }
    // Check for error in stdout JSON, as wrangler often puts errors there
    try {
      const result = JSON.parse(stdout);
      if (result.error) {
        throw new Error(result.error.text || 'Unknown Wrangler error');
      }
    } catch (jsonParseError) {
      // Not a JSON output, or not an error JSON. Continue.
    }
  } catch (error) {
    console.error(`Error executing SQL batch.`);
    console.error(`Command: ${command}`);
    console.error(`Error message: ${error.message}`);
    if (error.stdout) console.error(`Wrangler stdout: ${error.stdout}`);
    if (error.stderr) console.error(`Wrangler stderr: ${error.stderr}`);
    throw new Error('SQL execution failed.');
  } finally {
    try {
      unlinkSync(tempFilePath);
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
  }
}

async function insertBatch(table, columns, records) {
  if (records.length === 0) return;
  const values = records.map(record =>
    `(${record.map(val => (typeof val === 'string' ? `'${val.replace(/\'/g, "''")}'` : val)).join(',')})`
  ).join(',');
  const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES ${values};`;
  await executeSql(sql);
}

/**
 * Inserts records with dynamic batch size adjustment on SQLITE_TOOBIG errors.
 * @param {string} table - The table name.
 * @param {string[]} columns - The column names.
 * @param {any[][]} recordsToInsert - The records to insert.
 */
async function insertRecordsDynamically(table, columns, recordsToInsert) {
  let currentBatchSize = INITIAL_BATCH_SIZE; // Start with the configured batch size
  let records = [...recordsToInsert]; // Create a mutable copy

  while (records.length > 0) {
    if (currentBatchSize < MIN_BATCH_SIZE) {
      console.error(`Error: Batch size fell below minimum (${MIN_BATCH_SIZE}). Cannot insert remaining ${records.length} records.`);
      throw new Error('Batch size too small to proceed.');
    }

    const batch = records.splice(0, currentBatchSize); // Take a batch
    try {
      await insertBatch(table, columns, batch);
      // If successful, we can potentially increase currentBatchSize for future batches
      // within this same call, but for simplicity, let's just keep it.
      // The main loop will reset INITIAL_BATCH_SIZE for the next file.
    } catch (error) {
      if (error.message.includes('SQLITE_TOOBIG')) {
        console.warn(`  SQLITE_TOOBIG error with batch size ${currentBatchSize}. Halving and retrying...`);
        currentBatchSize = Math.max(MIN_BATCH_SIZE, Math.floor(currentBatchSize / 2));
        records = [...batch, ...records]; // Put the failed batch back to be re-processed with smaller size
      } else {
        throw error; // Re-throw other errors
      }
    }
  }
}

// --- Main Import Logic ---

async function processFile(filePath, columns, transform, state) {
  const fileState = state[filePath] || { processed_lines: 0, completed: false };

  if (fileState.completed) {
    console.log(`Skipping ${filePath}, already marked as completed.`);
    return;
  }

  console.log(`\nProcessing ${filePath} from line ${fileState.processed_lines + 1}...`);

  // +2 because csv-parse is 1-based and we skip the header row
  const startLine = fileState.processed_lines + 2;
  const parser = createReadStream(filePath).pipe(parse({ from_line: startLine }));

  let records = [];
  let totalCount = fileState.processed_lines;
  let processedInRun = 0;

  for await (const row of parser) {
    const transformedRow = transform(row);
    if (transformedRow) {
      records.push(transformedRow);
    }

    if (records.length >= INITIAL_BATCH_SIZE) {
      await insertRecordsDynamically(columns.table, columns.names, records);
      totalCount += records.length;
      processedInRun += records.length;
      records = [];
      // Update state for checkpointing
      state[filePath] = { ...fileState, processed_lines: totalCount };
      writeState(state);
      console.log(`  ...checkpoint at ${totalCount} records for ${filePath}`);
    }
  }

  if (records.length > 0) {
    await insertRecordsDynamically(columns.table, columns.names, records);
    totalCount += records.length;
    processedInRun += records.length;
  }

  // Final state update for the file
  state[filePath] = { processed_lines: totalCount, completed: true };
  writeState(state);

  console.log(`Finished processing ${filePath}. Inserted ${processedInRun} new records. Total for file: ${totalCount}.`);
}

async function main() {
  const freshStart = process.argv.includes('--fresh');
  let state = readState();

  if (freshStart) {
    console.log('Performing a fresh import. Clearing existing data and state...');
    await executeSql('DELETE FROM asn_blocks;');
    await executeSql('DELETE FROM city_blocks;');
    await executeSql('DELETE FROM city_locations;');
    state = {};
    if (existsSync(STATE_FILE)) {
      unlinkSync(STATE_FILE);
    }
    console.log('Existing data and state cleared.');
  }

  console.log('Starting GeoLite2 data import process...');

  const filesToProcess = [
    {
      path: ASN_BLOCKS_FILE,
      cols: { table: 'asn_blocks', names: ['start_ip_num', 'end_ip_num', 'asn', 'as_organization'] },
      transform: (row) => {
        const { start, end } = cidrToIntRange(row[0]);
        return [start, end, row[1], row[2]];
      }
    },
    {
      path: CITY_LOCATIONS_FILE,
      cols: { table: 'city_locations', names: ['geoname_id', 'locale_code', 'continent_code', 'continent_name', 'country_iso_code', 'country_name', 'city_name'] },
      transform: (row) => {
        if (row[1] !== 'en') return null;
        return [row[0], row[1], row[2], row[3], row[4], row[5], row[7]];
      }
    },
    {
      path: CITY_BLOCKS_FILE,
      cols: { table: 'city_blocks', names: ['start_ip_num', 'end_ip_num', 'geoname_id', 'postal_code', 'latitude', 'longitude'] },
      transform: (row) => {
        const { start, end } = cidrToIntRange(row[0]);
        return [start, end, row[1], row[3], row[4], row[5]];
      }
    }
  ];

  try {
    // Process files sequentially to avoid SQLITE_BUSY errors
    for (const file of filesToProcess) {
      await processFile(file.path, file.cols, file.transform, state);
    }
    console.log('\n✅ Data import completed successfully!');
  } catch (err) {
    console.error('\n❌ An error occurred during the import process:\n');
    console.error(err.message);
    console.error('The script was stopped. You can run it again to resume from the last checkpoint.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
