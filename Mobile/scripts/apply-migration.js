/* eslint-env node */
const fs = require('fs');
const path = require('path');

console.log('=== MIGRATION SQL ===\n');
console.log('Please run the following SQL in your Supabase SQL Editor:\n');
console.log('---\n');

const migrationPath = path.join(
  process.cwd(),
  'supabase',
  'migrations',
  '20251113060000_add_stays_contact_info.sql'
);
const sql = fs.readFileSync(migrationPath, 'utf8');

console.log(sql);
console.log('\n---\n');
console.log('After running the SQL, execute: node scripts/check-db-data.js to verify');
console.log('\n=== END ===');
