// Resolves the absolute SQLite DB path and writes it to .env
// Run before server.js: node resolve-db-path.js && node server.js
const fs = require('fs');
const path = require('path');

const appDir = __dirname;
const dbPath = path.join(appDir, 'db', 'custom.db');
const dbUrl = `file:${dbPath}`;
const envPath = path.join(appDir, '.env');

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  if (/^DATABASE_URL=/m.test(envContent)) {
    envContent = envContent.replace(/^DATABASE_URL=.*/m, `DATABASE_URL=${dbUrl}`);
  } else {
    envContent += `\nDATABASE_URL=${dbUrl}\n`;
  }
} else {
  envContent = `DATABASE_URL=${dbUrl}\n`;
}
fs.writeFileSync(envPath, envContent);
console.log(`[resolve-db-path] DATABASE_URL=${dbUrl}`);
