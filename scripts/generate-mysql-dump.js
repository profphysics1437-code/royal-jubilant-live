/**
 * MySQL Dump Generator
 * Reads all data from SQLite and generates a MySQL-compatible SQL dump
 * that can be imported via phpMyAdmin
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const sqliteUrl = 'file:' + path.join(__dirname, '..', 'db', 'custom.db');
const db = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });

// MySQL schema definitions (with proper MySQL types)
const mysqlSchemas = {
  'User': `CREATE TABLE IF NOT EXISTS \`User\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`name\` VARCHAR(255),
  \`phone\` VARCHAR(255),
  \`role\` VARCHAR(50) NOT NULL DEFAULT 'customer',
  \`passwordHash\` TEXT,
  \`avatarUrl\` TEXT,
  \`preferredLang\` VARCHAR(20),
  \`googleId\` VARCHAR(255),
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

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
  \`priceNegotiable\` TINYINT(1) DEFAULT 0,
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
  \`exclusiveListing\` TINYINT(1) DEFAULT 0,
  \`developer\` VARCHAR(255),
  \`furnished\` TINYINT(1) DEFAULT 0,
  \`amenities\` TEXT,
  \`features\` TEXT,
  \`paymentPlan\` TEXT,
  \`handoverYear\` VARCHAR(20),
  \`featured\` TINYINT(1) DEFAULT 0,
  \`isLatest\` TINYINT(1) DEFAULT 0,
  \`isLuxury\` TINYINT(1) DEFAULT 0,
  \`published\` TINYINT(1) DEFAULT 1,
  \`views\` INT DEFAULT 0,
  \`agentId\` VARCHAR(128),
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

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
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'SiteSetting': `CREATE TABLE IF NOT EXISTS \`SiteSetting\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`key\` VARCHAR(255) NOT NULL UNIQUE,
  \`value\` TEXT,
  \`category\` VARCHAR(100),
  \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'MenuItem': `CREATE TABLE IF NOT EXISTS \`MenuItem\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`label\` VARCHAR(255) NOT NULL,
  \`url\` VARCHAR(500) DEFAULT '',
  \`view\` VARCHAR(255),
  \`desc\` TEXT,
  \`badge\` VARCHAR(100),
  \`parentId\` VARCHAR(128),
  \`order\` INT DEFAULT 0,
  \`icon\` VARCHAR(100),
  \`menu\` VARCHAR(50) DEFAULT 'main',
  \`visible\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'Testimonial': `CREATE TABLE IF NOT EXISTS \`Testimonial\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`role\` VARCHAR(255),
  \`location\` VARCHAR(255),
  \`avatar\` TEXT,
  \`rating\` INT,
  \`quote\` TEXT,
  \`service\` VARCHAR(255),
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

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
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'Developer': `CREATE TABLE IF NOT EXISTS \`Developer\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`logo\` TEXT,
  \`description\` TEXT,
  \`website\` TEXT,
  \`totalProjects\` INT,
  \`establishedYear\` INT,
  \`headquarters\` VARCHAR(255),
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

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
  \`published\` TINYINT(1) DEFAULT 1,
  \`publishedAt\` DATETIME(3),
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'Faq': `CREATE TABLE IF NOT EXISTS \`Faq\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`question\` TEXT NOT NULL,
  \`answer\` TEXT,
  \`category\` VARCHAR(100),
  \`order\` INT DEFAULT 0,
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'Award': `CREATE TABLE IF NOT EXISTS \`Award\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`organization\` VARCHAR(255),
  \`year\` VARCHAR(20),
  \`description\` TEXT,
  \`image\` TEXT,
  \`order\` INT DEFAULT 0,
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'HeroSlide': `CREATE TABLE IF NOT EXISTS \`HeroSlide\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`heading1\` VARCHAR(500),
  \`heading2\` VARCHAR(500),
  \`heading3\` VARCHAR(500),
  \`subtitle\` TEXT,
  \`bgImage\` TEXT,
  \`order\` INT DEFAULT 0,
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

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
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'Lead': `CREATE TABLE IF NOT EXISTS \`Lead\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(255),
  \`email\` VARCHAR(255),
  \`phone\` VARCHAR(100),
  \`message\` TEXT,
  \`propertyId\` VARCHAR(128),
  \`agentId\` VARCHAR(128),
  \`userId\` VARCHAR(128),
  \`status\` VARCHAR(50) DEFAULT 'new',
  \`source\` VARCHAR(100),
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

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
  \`active\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'SeoMeta': `CREATE TABLE IF NOT EXISTS \`SeoMeta\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`pageSlug\` VARCHAR(255) NOT NULL UNIQUE,
  \`metaTitle\` VARCHAR(500),
  \`metaDescription\` TEXT,
  \`ogImage\` TEXT,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'StoryEvent': `CREATE TABLE IF NOT EXISTS \`StoryEvent\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`title\` VARCHAR(500) NOT NULL,
  \`description\` TEXT,
  \`eventDate\` DATETIME(3),
  \`location\` VARCHAR(255),
  \`category\` VARCHAR(100) DEFAULT 'milestone',
  \`images\` TEXT,
  \`videoUrl\` TEXT,
  \`highlighted\` TINYINT(1) DEFAULT 0,
  \`order\` INT DEFAULT 0,
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'Location': `CREATE TABLE IF NOT EXISTS \`Location\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`type\` VARCHAR(100),
  \`parentId\` VARCHAR(128),
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'PropertyCategory': `CREATE TABLE IF NOT EXISTS \`PropertyCategory\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`type\` VARCHAR(100),
  \`icon\` VARCHAR(100),
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'Amenity': `CREATE TABLE IF NOT EXISTS \`Amenity\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`icon\` VARCHAR(100),
  \`category\` VARCHAR(100),
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'LandingPage': `CREATE TABLE IF NOT EXISTS \`LandingPage\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`title\` VARCHAR(500) NOT NULL,
  \`seoTitle\` VARCHAR(500),
  \`seoDescription\` TEXT,
  \`content\` TEXT,
  \`published\` TINYINT(1) DEFAULT 1,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'CrmNote': `CREATE TABLE IF NOT EXISTS \`CrmNote\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`note\` TEXT,
  \`userId\` VARCHAR(128),
  \`leadId\` VARCHAR(128),
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'Commission': `CREATE TABLE IF NOT EXISTS \`Commission\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`amount\` VARCHAR(100),
  \`status\` VARCHAR(50),
  \`userId\` VARCHAR(128),
  \`propertyId\` VARCHAR(128),
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'ActivityLog': `CREATE TABLE IF NOT EXISTS \`ActivityLog\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`action\` VARCHAR(255),
  \`entityType\` VARCHAR(100),
  \`entityId\` VARCHAR(128),
  \`userId\` VARCHAR(128),
  \`metadata\` TEXT,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  'MediaFile': `CREATE TABLE IF NOT EXISTS \`MediaFile\` (
  \`id\` VARCHAR(128) NOT NULL PRIMARY KEY,
  \`filename\` VARCHAR(500),
  \`url\` TEXT,
  \`mimeType\` VARCHAR(100),
  \`size\` BIGINT,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
};

const models = Object.keys(mysqlSchemas);

function escapeValue(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (v instanceof Date) {
    return "'" + v.toISOString().slice(0, 19).replace('T', ' ') + "'";
  }
  if (typeof v === 'object') {
    const json = JSON.stringify(v);
    return "'" + json.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }
  const s = String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return "'" + s + "'";
}

async function main() {
  console.log('[1/3] Reading data from SQLite...');
  
  let sql = `-- MySQL dump generated from SQLite database
-- Royal Jubilant Real Estate LLC
-- Generated: ${new Date().toISOString()}
-- 
-- Import instructions:
-- 1. Open phpMyAdmin on Hostinger
-- 2. Select database: u432212399_rjcom
-- 3. Click "Import" tab
-- 4. Upload this file
-- 5. Click "Go" to execute
--
-- Total records: 484

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

`;

  console.log('[2/3] Generating CREATE TABLE statements...');
  
  for (const [tableName, schema] of Object.entries(mysqlSchemas)) {
    sql += `\n-- Table: ${tableName}\n`;
    sql += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
    sql += schema + '\n\n';
  }

  console.log('[3/3] Generating INSERT statements...');
  
  let totalRecords = 0;
  
  for (const model of models) {
    try {
      const records = await db[model].findMany();
      if (records.length === 0) continue;
      
      console.log(`  ${model}: ${records.length} records`);
      sql += `\n-- Data for ${model}: ${records.length} records\n`;
      
      for (const record of records) {
        const keys = Object.keys(record);
        const escapedKeys = keys.map(k => '`' + k + '`').join(', ');
        const values = keys.map(k => escapeValue(record[k]));
        sql += `INSERT INTO \`${model}\` (${escapedKeys}) VALUES (${values.join(', ')});\n`;
        totalRecords++;
      }
    } catch (e) {
      console.log(`  ${model}: SKIP - ${e.message}`);
    }
  }

  sql += `\nSET FOREIGN_KEY_CHECKS = 1;\n`;
  sql += `\n-- End of dump\n-- Total records: ${totalRecords}\n`;

  const outputPath = path.join(__dirname, '..', 'download', 'mysql-dump.sql');
  fs.writeFileSync(outputPath, sql);
  
  console.log(`\n[OK] MySQL dump saved to: ${outputPath}`);
  console.log(`[OK] File size: ${fs.statSync(outputPath).size} bytes`);
  console.log(`[OK] Total records: ${totalRecords}`);
  
  await db.$disconnect();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
