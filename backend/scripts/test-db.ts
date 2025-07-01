// Simple script to test database connection and basic queries
import { drizzle } from 'drizzle-orm/d1';
import { sql } from 'drizzle-orm';

// This is a test script that would be run with `wrangler d1 execute`
// To run: npx wrangler d1 execute ispinfo-db --file=./scripts/test-db.ts

// Test database connection
console.log('Testing database connection...');

// Count records in each table
const tables = ['asn_blocks', 'city_blocks', 'city_locations'];

for (const table of tables) {
  try {
    const result = await db.prepare(`SELECT COUNT(*) as count FROM ${table}`).first();
    console.log(`Table ${table}: ${result?.count} records`);
  } catch (error) {
    console.error(`Error querying table ${table}:`, error);
  }
}

// Test a sample IP lookup (Google's DNS)
const testIp = '8.8.8.8';
console.log(`\nTesting IP lookup for: ${testIp}`);

// Convert IP to number
const ipToNum = (ip: string): number => {
  return ip.split('.').reduce((acc, octet, index) => {
    return acc + parseInt(octet) * Math.pow(256, 3 - index);
  }, 0);
};

const ipNum = ipToNum(testIp);
console.log(`IP ${testIp} as number: ${ipNum}`);

// Test ASN lookup
try {
  const asnResult = await db.prepare(
    `SELECT asn, as_organization 
     FROM asn_blocks 
     WHERE start_ip_num <= ? AND end_ip_num >= ?`
  ).bind(ipNum, ipNum).first();
  
  console.log('ASN Lookup Result:', asnResult);
} catch (error) {
  console.error('Error in ASN lookup:', error);
}

// Test City lookup
try {
  const cityResult = await db.prepare(
    `SELECT * FROM city_blocks 
     WHERE start_ip_num <= ? AND end_ip_num >= ?`
  ).bind(ipNum, ipNum).first();
  
  console.log('City Lookup Result:', cityResult);
  
  if (cityResult?.geoname_id) {
    const locationResult = await db.prepare(
      `SELECT * FROM city_locations WHERE geoname_id = ?`
    ).bind(cityResult.geoname_id).first();
    
    console.log('Location Details:', locationResult);
  }
} catch (error) {
  console.error('Error in city lookup:', error);
}
