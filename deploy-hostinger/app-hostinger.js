const fs=require('fs'),path=require('path');
const dbFile=path.join(__dirname,'db','custom.db');
if(!fs.existsSync(path.dirname(dbFile)))fs.mkdirSync(path.dirname(dbFile),{recursive:true});
process.env.DATABASE_URL=`file:${dbFile}`;
require('./server.js');
