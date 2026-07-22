/**
 * GENERATE FULL MIGRATION SCRIPT (PHP)
 * 
 * Reads all data from local SQLite and generates a single PHP script
 * that creates all tables + inserts all data into Hostinger MySQL.
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const sqliteUrl = 'file:' + path.join(__dirname, '..', 'db', 'custom.db');
const db = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });

async function main() {
  console.log('[1/3] Reading all data from SQLite...');
  
  const data = {};
  const models = [
    'user', 'agent', 'property', 'community', 'developer', 'blogPost',
    'testimonial', 'award', 'faq', 'heroSlide', 'video', 'siteSetting',
    'lead', 'appointment', 'message', 'notification',
    'crmNote', 'commission', 'newsletterSubscriber', 'valuationRequest',
    'mortgageEnquiry', 'auditLog', 'activityLog', 'mediaFile', 'popup',
    'seoMeta', 'menuItem', 'emailTemplate', 'landingPage', 'reportSnapshot',
    'location', 'propertyCategory', 'amenity', 'savedProperty', 'savedSearch',
    'storyEvent'
  ];
  
  for (const model of models) {
    try {
      const records = await db[model].findMany();
      data[model] = records;
      if (records.length > 0) {
        console.log(`  ${model}: ${records.length} records`);
      }
    } catch (e) {
      data[model] = [];
    }
  }
  
  console.log('\n[2/3] Generating PHP migration script...');
  
  let php = `<?php
/**
 * FULL DATABASE MIGRATION SCRIPT
 * Generated from local SQLite database
 * 
 * Creates ALL tables in MySQL and inserts ALL data.
 * 
 * Usage on Hostinger SSH:
 *   php migrate-full.php
 */

error_reporting(E_ERROR | E_PARSE);
set_time_limit(300);

$MYSQL_HOST = 'localhost';
$MYSQL_DB   = 'u432212399_rjcom';
$MYSQL_USER = 'u432212399_adminrjcom';
$MYSQL_PASS = 'Admin@2026@#';

// Helper: escape and quote string for SQL
function ep($s) {
  global $conn;
  return "'" . $conn->real_escape_string($s) . "'";
}

echo "═══════════════════════════════════════════════════════\\n";
echo "  FULL DATABASE MIGRATION\\n";
echo "═══════════════════════════════════════════════════════\\n\\n";

$conn = new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB);
if ($conn->connect_error) {
    die("FAIL: " . $conn->connect_error . "\\n");
}
echo "[1/3] Connected to MySQL\\n\\n";

// ─── CREATE TABLES ───
echo "[2/3] Creating tables...\\n";

$tables = [
`;

  // Add CREATE TABLE statements
  const tableSchemas = getTableSchemas();
  for (const [tableName, schema] of Object.entries(tableSchemas)) {
    php += `  '${tableName}' => '${schema}',\n`;
  }
  
  php += `];

foreach ($tables as $name => $ddl) {
    $conn->query("DROP TABLE IF EXISTS \`" . $name . "\`");
    if ($conn->query($ddl)) {
        echo "  + Created: " . $name . "\\n";
    } else {
        echo "  x Failed: " . $name . " - " . $conn->error . "\\n";
    }
}
echo "\\n";

// ─── INSERT DATA ───
echo "[3/3] Inserting data...\\n\\n";

`;

  // Generate INSERT statements for each model
  for (const [model, records] of Object.entries(data)) {
    if (records.length === 0) continue;
    
    const tableName = model.charAt(0).toUpperCase() + model.slice(1);
    
    php += `// ${tableName}: ${records.length} records\n`;
    php += `$count = 0;\n`;
    
    for (const record of records) {
      const keys = Object.keys(record);
      
      // Build PHP-safe escaped values
      const phpValues = keys.map(k => {
        const v = record[k];
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'boolean') return v ? '1' : '0';
        if (v instanceof Date) {
          const ds = v.toISOString().slice(0, 19).replace('T', ' ');
          const esc = ds.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
          return "ep('" + esc + "')";
        }
        if (typeof v === 'object') {
          const json = JSON.stringify(v);
          const esc = json.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
          return "ep('" + esc + "')";
        }
        // String value
        const s = String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return "ep('" + s + "')";
      });
      
      const escapedKeys = keys.map(k => '`' + k + '`').join(', ');
      // Use HEREDOC syntax to avoid $variable interpolation issues
      // String values in ep('...') may contain $ signs (bcrypt hashes)
      php += '$sql = \'INSERT INTO `' + tableName + '` (' + escapedKeys + ') VALUES (\' . implode(", ", [' + phpValues.join(', ') + ']) . \')\';\n';
      php += 'if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\\n"; }\n';
    }
    php += `echo "  ${tableName}: $count/${records.length} inserted\\n";\n\n`;
  }

  php += `
$conn->close();

echo "\\n═══════════════════════════════════════════════════════\\n";
echo "  MIGRATION COMPLETE!\\n";
echo "═══════════════════════════════════════════════════════\\n\\n";
echo "All tables created and data inserted.\\n";
echo "Live site should now show all properties, agents, menus, etc.\\n";
`;

  fs.writeFileSync(path.join(__dirname, 'migrate-full.php'), php);
  console.log(`\n[3/3] PHP script saved to: scripts/migrate-full.php`);
  console.log(`File size: ${fs.statSync(path.join(__dirname, 'migrate-full.php')).size} bytes`);
  
  await db.$disconnect();
}

function getTableSchemas() {
  return {
    'User': `CREATE TABLE IF NOT EXISTS \`User\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`email\` VARCHAR(255) NOT NULL UNIQUE,
      \`name\` VARCHAR(255),
      \`phone\` VARCHAR(255),
      \`role\` VARCHAR(50) NOT NULL DEFAULT "customer",
      \`passwordHash\` TEXT,
      \`avatarUrl\` TEXT,
      \`preferredLang\` VARCHAR(20),
      \`googleId\` VARCHAR(255),
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'Property': `CREATE TABLE IF NOT EXISTS \`Property\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`reference\` VARCHAR(255) NOT NULL UNIQUE,
      \`title\` VARCHAR(500) NOT NULL,
      \`slug\` VARCHAR(500) NOT NULL UNIQUE,
      \`status\` VARCHAR(50) NOT NULL,
      \`category\` VARCHAR(100),
      \`type\` VARCHAR(100) NOT NULL,
      \`country\` VARCHAR(100),
      \`emirate\` VARCHAR(100),
      \`community\` VARCHAR(255),
      \`subCommunity\` VARCHAR(255),
      \`locationAddress\` TEXT,
      \`locationLat\` VARCHAR(50),
      \`locationLng\` VARCHAR(50),
      \`bedrooms\` INT,
      \`bathrooms\` INT,
      \`area\` VARCHAR(50),
      \`areaUnit\` VARCHAR(20),
      \`plotSize\` VARCHAR(50),
      \`plotSizeUnit\` VARCHAR(20),
      \`completionStatus\` VARCHAR(100),
      \`completionDate\` VARCHAR(50),
      \`furnishingStatus\` VARCHAR(100),
      \`floorNumber\` INT,
      \`totalFloors\` INT,
      \`parking\` INT,
      \`price\` BIGINT,
      \`pricePerSqft\` VARCHAR(50),
      \`rentFrequency\` VARCHAR(50),
      \`noOfCheques\` INT,
      \`serviceCharge\` VARCHAR(100),
      \`priceNegotiable\` BOOLEAN DEFAULT 0,
      \`indoorFeatures\` TEXT,
      \`outdoorFeatures\` TEXT,
      \`buildingAmenities\` TEXT,
      \`nearbyLandmarks\` TEXT,
      \`viewFeatures\` TEXT,
      \`images\` TEXT,
      \`floorPlanUrl\` TEXT,
      \`videoUrl\` TEXT,
      \`virtualTourUrl\` TEXT,
      \`description\` TEXT,
      \`reraNumber\` VARCHAR(100),
      \`exclusiveListing\` BOOLEAN DEFAULT 0,
      \`developer\` VARCHAR(255),
      \`furnished\` BOOLEAN DEFAULT 0,
      \`amenities\` TEXT,
      \`features\` TEXT,
      \`paymentPlan\` TEXT,
      \`handoverYear\` VARCHAR(20),
      \`featured\` BOOLEAN DEFAULT 0,
      \`isLatest\` BOOLEAN DEFAULT 0,
      \`isLuxury\` BOOLEAN DEFAULT 0,
      \`published\` BOOLEAN DEFAULT 1,
      \`views\` INT DEFAULT 0,
      \`agentId\` VARCHAR(128),
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'Agent': `CREATE TABLE IF NOT EXISTS \`Agent\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`title\` VARCHAR(255),
      \`photo\` TEXT,
      \`phone\` VARCHAR(100),
      \`whatsapp\` VARCHAR(100),
      \`email\` VARCHAR(255),
      \`languages\` TEXT,
      \`specializations\` TEXT,
      \`communities\` TEXT,
      \`biography\` TEXT,
      \`awards\` TEXT,
      \`rating\` VARCHAR(10),
      \`reviewsCount\` INT DEFAULT 0,
      \`activeListings\` INT DEFAULT 0,
      \`soldProperties\` INT DEFAULT 0,
      \`experienceYears\` INT,
      \`linkedin\` TEXT,
      \`instagram\` TEXT,
      \`twitter\` TEXT,
      \`order\` INT DEFAULT 0,
      \`published\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'SiteSetting': `CREATE TABLE IF NOT EXISTS \`SiteSetting\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`key\` VARCHAR(255) NOT NULL UNIQUE,
      \`value\` TEXT,
      \`category\` VARCHAR(100),
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'MenuItem': `CREATE TABLE IF NOT EXISTS \`MenuItem\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`label\` VARCHAR(255) NOT NULL,
      \`url\` VARCHAR(500) DEFAULT "",
      \`view\` VARCHAR(255),
      \`desc\` TEXT,
      \`badge\` VARCHAR(100),
      \`parentId\` VARCHAR(128),
      \`order\` INT DEFAULT 0,
      \`icon\` VARCHAR(100),
      \`menu\` VARCHAR(50) DEFAULT "main",
      \`visible\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'Testimonial': `CREATE TABLE IF NOT EXISTS \`Testimonial\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`role\` VARCHAR(255),
      \`location\` VARCHAR(255),
      \`avatar\` TEXT,
      \`rating\` INT,
      \`quote\` TEXT,
      \`service\` VARCHAR(255),
      \`published\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'Community': `CREATE TABLE IF NOT EXISTS \`Community\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`shortName\` VARCHAR(255),
      \`hero\` TEXT,
      \`overview\` TEXT,
      \`lifestyle\` TEXT,
      \`averagePrice\` VARCHAR(100),
      \`pricePerSqft\` VARCHAR(100),
      \`roi\` VARCHAR(50),
      \`population\` VARCHAR(100),
      \`totalProperties\` INT,
      \`rating\` VARCHAR(10),
      \`highlights\` TEXT,
      \`schools\` TEXT,
      \`hospitals\` TEXT,
      \`transport\` TEXT,
      \`shopping\` TEXT,
      \`nearbyCommunities\` TEXT,
      \`stats\` TEXT,
      \`published\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'Developer': `CREATE TABLE IF NOT EXISTS \`Developer\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`logo\` TEXT,
      \`description\` TEXT,
      \`website\` TEXT,
      \`totalProjects\` INT,
      \`establishedYear\` INT,
      \`headquarters\` VARCHAR(255),
      \`published\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'BlogPost': `CREATE TABLE IF NOT EXISTS \`BlogPost\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`title\` VARCHAR(500) NOT NULL,
      \`slug\` VARCHAR(500) NOT NULL UNIQUE,
      \`excerpt\` TEXT,
      \`body\` TEXT,
      \`coverImage\` TEXT,
      \`category\` VARCHAR(100),
      \`tags\` TEXT,
      \`author\` VARCHAR(255),
      \`published\` BOOLEAN DEFAULT 1,
      \`publishedAt\` DATETIME(3),
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'Faq': `CREATE TABLE IF NOT EXISTS \`Faq\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`question\` TEXT NOT NULL,
      \`answer\` TEXT,
      \`category\` VARCHAR(100),
      \`order\` INT DEFAULT 0,
      \`published\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'Award': `CREATE TABLE IF NOT EXISTS \`Award\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`title\` VARCHAR(255) NOT NULL,
      \`organization\` VARCHAR(255),
      \`year\` VARCHAR(20),
      \`description\` TEXT,
      \`image\` TEXT,
      \`order\` INT DEFAULT 0,
      \`published\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'HeroSlide': `CREATE TABLE IF NOT EXISTS \`HeroSlide\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`heading1\` VARCHAR(500),
      \`heading2\` VARCHAR(500),
      \`heading3\` VARCHAR(500),
      \`subtitle\` TEXT,
      \`bgImage\` TEXT,
      \`order\` INT DEFAULT 0,
      \`published\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'Video': `CREATE TABLE IF NOT EXISTS \`Video\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`title\` VARCHAR(500) NOT NULL,
      \`advisor\` VARCHAR(255),
      \`role\` VARCHAR(255),
      \`category\` VARCHAR(100),
      \`duration\` VARCHAR(50),
      \`thumbnail\` TEXT,
      \`description\` TEXT,
      \`videoUrl\` TEXT,
      \`youtubeUrl\` TEXT,
      \`order\` INT DEFAULT 0,
      \`published\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'Lead': `CREATE TABLE IF NOT EXISTS \`Lead\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(255),
      \`email\` VARCHAR(255),
      \`phone\` VARCHAR(100),
      \`message\` TEXT,
      \`propertyId\` VARCHAR(128),
      \`agentId\` VARCHAR(128),
      \`userId\` VARCHAR(128),
      \`status\` VARCHAR(50) DEFAULT "new",
      \`source\` VARCHAR(100),
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'Popup': `CREATE TABLE IF NOT EXISTS \`Popup\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`title\` VARCHAR(255),
      \`content\` TEXT,
      \`type\` VARCHAR(100),
      \`trigger\` VARCHAR(100),
      \`delaySeconds\` INT DEFAULT 5,
      \`position\` VARCHAR(100),
      \`imageUrl\` TEXT,
      \`buttonText\` VARCHAR(255),
      \`buttonLink\` TEXT,
      \`startDate\` DATETIME(3),
      \`endDate\` DATETIME(3),
      \`active\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'SeoMeta': `CREATE TABLE IF NOT EXISTS \`SeoMeta\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`pageSlug\` VARCHAR(255) NOT NULL UNIQUE,
      \`metaTitle\` VARCHAR(500),
      \`metaDescription\` TEXT,
      \`ogImage\` TEXT,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    
    'StoryEvent': `CREATE TABLE IF NOT EXISTS \`StoryEvent\` (
      \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`title\` VARCHAR(500) NOT NULL,
      \`description\` TEXT,
      \`eventDate\` DATETIME(3),
      \`location\` VARCHAR(255),
      \`category\` VARCHAR(100) DEFAULT "milestone",
      \`images\` TEXT,
      \`videoUrl\` TEXT,
      \`highlighted\` BOOLEAN DEFAULT 0,
      \`order\` INT DEFAULT 0,
      \`published\` BOOLEAN DEFAULT 1,
      \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updatedAt\` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  };
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
