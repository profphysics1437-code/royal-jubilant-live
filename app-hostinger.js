const fs = require('fs');
const path = require('path');
process.env.DATABASE_URL = 'mysql://u432212399_adminrjcom:Royal%402026%40%23@localhost:3306/u432212399_rjcom';
process.env.NEXTAUTH_SECRET = 'CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=';
process.env.NEXTAUTH_URL = 'https://www.royaljubilant.com';
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3000';
console.log('[app] DB: MySQL');
const { execSync } = require('child_process');
try {
  execSync('npx next start -p ' + process.env.PORT, { stdio: 'inherit', env: process.env });
} catch (e) {
  var s = path.join(__dirname, '.next', 'standalone', 'server.js');
  if (fs.existsSync(s)) {
    var st = path.join(__dirname, '.next', 'static');
    var ss = path.join(__dirname, '.next', 'standalone', '.next', 'static');
    if (!fs.existsSync(ss) && fs.existsSync(st)) { fs.mkdirSync(path.dirname(ss), { recursive: true }); fs.cpSync(st, ss, { recursive: true }); }
    var p = path.join(__dirname, 'public');
    var sp = path.join(__dirname, '.next', 'standalone', 'public');
    if (!fs.existsSync(sp) && fs.existsSync(p)) { fs.cpSync(p, sp, { recursive: true }); }
    require(s);
  } else { process.exit(1); }
}
