const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building TypeScript...');
try {
  // Create dist directory if it doesn't exist
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // Compile TypeScript
  execSync('npx tsc', { stdio: 'inherit' });
  
  // Copy any necessary files
  if (fs.existsSync('package.json')) {
    fs.copyFileSync('package.json', 'dist/package.json');
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
