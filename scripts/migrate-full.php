<?php
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

echo "═══════════════════════════════════════════════════════\n";
echo "  FULL DATABASE MIGRATION\n";
echo "═══════════════════════════════════════════════════════\n\n";

$conn = new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB);
if ($conn->connect_error) {
    die("FAIL: " . $conn->connect_error . "\n");
}
echo "[1/3] Connected to MySQL\n\n";

// ─── CREATE TABLES ───
echo "[2/3] Creating tables...\n";

$tables = [
  'User' => 'CREATE TABLE IF NOT EXISTS `User` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `email` VARCHAR(255) NOT NULL UNIQUE,
      `name` VARCHAR(255),
      `phone` VARCHAR(255),
      `role` VARCHAR(50) NOT NULL DEFAULT "customer",
      `passwordHash` TEXT,
      `avatarUrl` TEXT,
      `preferredLang` VARCHAR(20),
      `googleId` VARCHAR(255),
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'Property' => 'CREATE TABLE IF NOT EXISTS `Property` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `reference` VARCHAR(255) NOT NULL UNIQUE,
      `title` VARCHAR(500) NOT NULL,
      `slug` VARCHAR(500) NOT NULL UNIQUE,
      `status` VARCHAR(50) NOT NULL,
      `category` VARCHAR(100),
      `type` VARCHAR(100) NOT NULL,
      `country` VARCHAR(100),
      `emirate` VARCHAR(100),
      `community` VARCHAR(255),
      `subCommunity` VARCHAR(255),
      `locationAddress` TEXT,
      `locationLat` VARCHAR(50),
      `locationLng` VARCHAR(50),
      `bedrooms` INT,
      `bathrooms` INT,
      `area` VARCHAR(50),
      `areaUnit` VARCHAR(20),
      `plotSize` VARCHAR(50),
      `plotSizeUnit` VARCHAR(20),
      `completionStatus` VARCHAR(100),
      `completionDate` VARCHAR(50),
      `furnishingStatus` VARCHAR(100),
      `floorNumber` INT,
      `totalFloors` INT,
      `parking` INT,
      `price` BIGINT,
      `pricePerSqft` VARCHAR(50),
      `rentFrequency` VARCHAR(50),
      `noOfCheques` INT,
      `serviceCharge` VARCHAR(100),
      `priceNegotiable` BOOLEAN DEFAULT 0,
      `indoorFeatures` TEXT,
      `outdoorFeatures` TEXT,
      `buildingAmenities` TEXT,
      `nearbyLandmarks` TEXT,
      `viewFeatures` TEXT,
      `images` TEXT,
      `floorPlanUrl` TEXT,
      `videoUrl` TEXT,
      `virtualTourUrl` TEXT,
      `description` TEXT,
      `reraNumber` VARCHAR(100),
      `exclusiveListing` BOOLEAN DEFAULT 0,
      `developer` VARCHAR(255),
      `furnished` BOOLEAN DEFAULT 0,
      `amenities` TEXT,
      `features` TEXT,
      `paymentPlan` TEXT,
      `handoverYear` VARCHAR(20),
      `featured` BOOLEAN DEFAULT 0,
      `isLatest` BOOLEAN DEFAULT 0,
      `isLuxury` BOOLEAN DEFAULT 0,
      `published` BOOLEAN DEFAULT 1,
      `views` INT DEFAULT 0,
      `agentId` VARCHAR(128),
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'Agent' => 'CREATE TABLE IF NOT EXISTS `Agent` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `title` VARCHAR(255),
      `photo` TEXT,
      `phone` VARCHAR(100),
      `whatsapp` VARCHAR(100),
      `email` VARCHAR(255),
      `languages` TEXT,
      `specializations` TEXT,
      `communities` TEXT,
      `biography` TEXT,
      `awards` TEXT,
      `rating` VARCHAR(10),
      `reviewsCount` INT DEFAULT 0,
      `activeListings` INT DEFAULT 0,
      `soldProperties` INT DEFAULT 0,
      `experienceYears` INT,
      `linkedin` TEXT,
      `instagram` TEXT,
      `twitter` TEXT,
      `order` INT DEFAULT 0,
      `published` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'SiteSetting' => 'CREATE TABLE IF NOT EXISTS `SiteSetting` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `key` VARCHAR(255) NOT NULL UNIQUE,
      `value` TEXT,
      `category` VARCHAR(100),
      `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'MenuItem' => 'CREATE TABLE IF NOT EXISTS `MenuItem` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `label` VARCHAR(255) NOT NULL,
      `url` VARCHAR(500) DEFAULT "",
      `view` VARCHAR(255),
      `desc` TEXT,
      `badge` VARCHAR(100),
      `parentId` VARCHAR(128),
      `order` INT DEFAULT 0,
      `icon` VARCHAR(100),
      `menu` VARCHAR(50) DEFAULT "main",
      `visible` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'Testimonial' => 'CREATE TABLE IF NOT EXISTS `Testimonial` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `role` VARCHAR(255),
      `location` VARCHAR(255),
      `avatar` TEXT,
      `rating` INT,
      `quote` TEXT,
      `service` VARCHAR(255),
      `published` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'Community' => 'CREATE TABLE IF NOT EXISTS `Community` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `shortName` VARCHAR(255),
      `hero` TEXT,
      `overview` TEXT,
      `lifestyle` TEXT,
      `averagePrice` VARCHAR(100),
      `pricePerSqft` VARCHAR(100),
      `roi` VARCHAR(50),
      `population` VARCHAR(100),
      `totalProperties` INT,
      `rating` VARCHAR(10),
      `highlights` TEXT,
      `schools` TEXT,
      `hospitals` TEXT,
      `transport` TEXT,
      `shopping` TEXT,
      `nearbyCommunities` TEXT,
      `stats` TEXT,
      `published` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'Developer' => 'CREATE TABLE IF NOT EXISTS `Developer` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `logo` TEXT,
      `description` TEXT,
      `website` TEXT,
      `totalProjects` INT,
      `establishedYear` INT,
      `headquarters` VARCHAR(255),
      `published` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'BlogPost' => 'CREATE TABLE IF NOT EXISTS `BlogPost` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `title` VARCHAR(500) NOT NULL,
      `slug` VARCHAR(500) NOT NULL UNIQUE,
      `excerpt` TEXT,
      `body` TEXT,
      `coverImage` TEXT,
      `category` VARCHAR(100),
      `tags` TEXT,
      `author` VARCHAR(255),
      `published` BOOLEAN DEFAULT 1,
      `publishedAt` DATETIME(3),
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'Faq' => 'CREATE TABLE IF NOT EXISTS `Faq` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `question` TEXT NOT NULL,
      `answer` TEXT,
      `category` VARCHAR(100),
      `order` INT DEFAULT 0,
      `published` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'Award' => 'CREATE TABLE IF NOT EXISTS `Award` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `title` VARCHAR(255) NOT NULL,
      `organization` VARCHAR(255),
      `year` VARCHAR(20),
      `description` TEXT,
      `image` TEXT,
      `order` INT DEFAULT 0,
      `published` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'HeroSlide' => 'CREATE TABLE IF NOT EXISTS `HeroSlide` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `heading1` VARCHAR(500),
      `heading2` VARCHAR(500),
      `heading3` VARCHAR(500),
      `subtitle` TEXT,
      `bgImage` TEXT,
      `order` INT DEFAULT 0,
      `published` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'Video' => 'CREATE TABLE IF NOT EXISTS `Video` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `title` VARCHAR(500) NOT NULL,
      `advisor` VARCHAR(255),
      `role` VARCHAR(255),
      `category` VARCHAR(100),
      `duration` VARCHAR(50),
      `thumbnail` TEXT,
      `description` TEXT,
      `videoUrl` TEXT,
      `youtubeUrl` TEXT,
      `order` INT DEFAULT 0,
      `published` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'Lead' => 'CREATE TABLE IF NOT EXISTS `Lead` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `name` VARCHAR(255),
      `email` VARCHAR(255),
      `phone` VARCHAR(100),
      `message` TEXT,
      `propertyId` VARCHAR(128),
      `agentId` VARCHAR(128),
      `userId` VARCHAR(128),
      `status` VARCHAR(50) DEFAULT "new",
      `source` VARCHAR(100),
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'Popup' => 'CREATE TABLE IF NOT EXISTS `Popup` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `title` VARCHAR(255),
      `content` TEXT,
      `type` VARCHAR(100),
      `trigger` VARCHAR(100),
      `delaySeconds` INT DEFAULT 5,
      `position` VARCHAR(100),
      `imageUrl` TEXT,
      `buttonText` VARCHAR(255),
      `buttonLink` TEXT,
      `startDate` DATETIME(3),
      `endDate` DATETIME(3),
      `active` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'SeoMeta' => 'CREATE TABLE IF NOT EXISTS `SeoMeta` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `pageSlug` VARCHAR(255) NOT NULL UNIQUE,
      `metaTitle` VARCHAR(500),
      `metaDescription` TEXT,
      `ogImage` TEXT,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
  'StoryEvent' => 'CREATE TABLE IF NOT EXISTS `StoryEvent` (
      `id` VARCHAR(128) NOT NULL PRIMARY KEY,
      `title` VARCHAR(500) NOT NULL,
      `description` TEXT,
      `eventDate` DATETIME(3),
      `location` VARCHAR(255),
      `category` VARCHAR(100) DEFAULT "milestone",
      `images` TEXT,
      `videoUrl` TEXT,
      `highlighted` BOOLEAN DEFAULT 0,
      `order` INT DEFAULT 0,
      `published` BOOLEAN DEFAULT 1,
      `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      `updatedAt` DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
];

foreach ($tables as $name => $ddl) {
    $conn->query("DROP TABLE IF EXISTS `" . $name . "`");
    if ($conn->query($ddl)) {
        echo "  + Created: " . $name . "\n";
    } else {
        echo "  x Failed: " . $name . " - " . $conn->error . "\n";
    }
}
echo "\n";

// ─── INSERT DATA ───
echo "[3/3] Inserting data...\n\n";

// User: 10 records
$count = 0;
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `avatarUrl`, `preferredLang`, `googleId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7c90000v8y5twc8nzc5'), ep('admin@royaljubilant.ae'), ep('Royal Jubilant Admin'), ep('+971 4 327 8401'), ep('admin'), ep('$2b$10$F5NwhrpENm6HPVwfYriYducsT7ek2GYdE9ju0Z/T/SK6vVu9hBsQy'), NULL, NULL, NULL, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `avatarUrl`, `preferredLang`, `googleId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5hmkq90000v8zxdji56353'), ep('muhammad.javed.zafar@royaljubilant.ae'), ep('Muhammad Javed Zafar'), ep('+971 4 327 8401'), ep('agent'), ep('$2b$10$9GvNoyVs/jHsXeF9luaJku7lFbuoJgmSCMGjp0QnJpMZnbq2VywuW'), NULL, NULL, NULL, ep('2026-07-03 22:11:10'), ep('2026-07-03 22:11:10')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `avatarUrl`, `preferredLang`, `googleId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5hmksb0001v8zx9hrkw64w'), ep('maria.raza@royaljubilant.ae'), ep('Maria Raza'), ep('+971 4 327 8401'), ep('agent'), ep('$2b$10$ltF.i1lVCd0SImsRCp54LOHSzqHhZ4DLOZ6vACqD.tzF2chYLqGya'), NULL, NULL, NULL, ep('2026-07-03 22:11:10'), ep('2026-07-03 22:11:10')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `avatarUrl`, `preferredLang`, `googleId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5hmkuc0002v8zxu20gshtr'), ep('muhammad.naeem.zafar@royaljubilant.ae'), ep('Muhammad Naeem Zafar'), ep('+971 4 327 8401'), ep('agent'), ep('$2b$10$HNWpFuMXSTP7rUiX6iICqe0ldT3gHwXMtRprHE0FRf7V81b4tZJ9e'), ep('/uploads/avatars/1783415505418-2tu0uxi0.webp'), ep('en'), NULL, ep('2026-07-03 22:11:10'), ep('2026-07-07 09:11:50')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `avatarUrl`, `preferredLang`, `googleId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5hmkwc0003v8zxn7cyug1a'), ep('naqash.haider@royaljubilant.ae'), ep('Naqash Haider'), ep('+971 4 327 8401'), ep('agent'), ep('$2b$10$VI.YANFr3skQ2KcLxxXPqeicUXamnL964xKethU9XVoRrcVcFsqNS'), NULL, NULL, NULL, ep('2026-07-03 22:11:11'), ep('2026-07-03 22:11:11')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `avatarUrl`, `preferredLang`, `googleId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5hmkyc0004v8zxwcpit8te'), ep('muhammad.saleem.khan@royaljubilant.ae'), ep('Muhammad Saleem Khan'), ep('+971 4 327 8401'), ep('agent'), ep('$2b$10$.oKD3U9LHJY9tmooTqJ.XOXpaVKUKdwA.au3dIDWcUc4QYdofLavC'), NULL, NULL, NULL, ep('2026-07-03 22:11:11'), ep('2026-07-03 22:11:11')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `avatarUrl`, `preferredLang`, `googleId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5hml0c0005v8zxf74x9rnq'), ep('awais.ali@royaljubilant.ae'), ep('Awais Ali'), ep('+971 4 327 8401'), ep('agent'), ep('$2b$10$267v6WzM9gxMb.rk9f8RWeEkSaOS0d4LlA5nB54EccvIHbmO0ZTc6'), NULL, NULL, NULL, ep('2026-07-03 22:11:11'), ep('2026-07-07 01:08:37')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `avatarUrl`, `preferredLang`, `googleId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5hml2d0006v8zxfilbmlj2'), ep('ahmad.raza@royaljubilant.ae'), ep('Ahmad Raza'), ep('+971 4 327 8401'), ep('agent'), ep('$2b$10$yG52AxvrnCGo7UUoDRvgKeV25XVFRa6/LlyPCON3MmeHqgy0E0Kj.'), NULL, NULL, NULL, ep('2026-07-03 22:11:11'), ep('2026-07-03 22:11:11')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `avatarUrl`, `preferredLang`, `googleId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5hml4e0007v8zx8jowzik8'), ep('muhammad.nazim@royaljubilant.ae'), ep('Muhammad Nazim'), ep('+971 4 327 8401'), ep('agent'), ep('$2b$10$5OlwoMXoKUBGrNNqITWfJ.gw6tw0TpAxSdL6t9fc2cgLcqr6cLOKa'), NULL, NULL, NULL, ep('2026-07-03 22:11:11'), ep('2026-07-03 22:11:11')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `avatarUrl`, `preferredLang`, `googleId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmra7jlz90002pd4jus1rr7od'), ep('ahmad.ali@royaljubilant.ae'), ep('Ahmad Ali'), NULL, ep('agent'), ep('$2b$10$eq/UhkAfYhr/EB.rq1tim.daqydVeYvTS3S6Txq1gpjfh3XlOc6gO'), NULL, NULL, NULL, ep('2026-07-07 05:27:47'), ep('2026-07-07 05:27:47')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  User: $count/10 inserted\n";

// Agent: 8 records
$count = 0;
$sql = 'INSERT INTO `Agent` (`id`, `name`, `title`, `photo`, `phone`, `whatsapp`, `email`, `languages`, `specializations`, `communities`, `biography`, `awards`, `rating`, `reviewsCount`, `activeListings`, `soldProperties`, `experienceYears`, `linkedin`, `instagram`, `twitter`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5g9zws0000v8j0yx6b8wvx'), ep('Muhammad Javed Zafar'), ep('Managing Director'), ep('/team/muhammad-javed-zafar.webp'), ep('+971 4 327 8401'), ep('97143278401'), ep('muhammad.javed.zafar@royaljubilant.ae'), ep('["English","Urdu","Arabic"]'), ep('["Leadership","Investment Strategy","Portfolio Advisory","Off-Plan Allocations"]'), ep('["Downtown Dubai","Business Bay","Dubai Marina","Palm Jumeirah"]'), ep('Muhammad Javed Zafar founded Royal Jubilant Real Estate LLC with a vision to bring a more personal, research-led and relationship-driven approach to Dubai property advisory. As Managing Director, he oversees the firm\'s strategy, key developer relationships and the senior advisory team. With years of on-the-ground Dubai market experience, he has guided hundreds of families, investors and corporate clients through their property journey — from first acquisition to portfolio diversification.'), ep('["Founder & Managing Director","RERA Certified Broker"]'), ep('4.9'), ep('188'), ep('1'), ep('312'), ep('12'), ep('#'), ep('#'), NULL, ep('1'), 1, ep('2026-07-03 21:33:24'), ep('2026-07-11 20:27:02')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Agent` (`id`, `name`, `title`, `photo`, `phone`, `whatsapp`, `email`, `languages`, `specializations`, `communities`, `biography`, `awards`, `rating`, `reviewsCount`, `activeListings`, `soldProperties`, `experienceYears`, `linkedin`, `instagram`, `twitter`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5g9zwv0001v8j0h0rt2365'), ep('Maria Raza'), ep('Administration Manager'), ep('/team/maria-raza.jpeg'), ep('+971 4 327 8401'), ep('97143278401'), ep('maria.raza@royaljubilant.ae'), ep('["English","Urdu","Hindi"]'), ep('["Operations","Client Relations","Compliance","Document Management"]'), ep('["Business Bay","Downtown Dubai","Dubai Marina"]'), ep('Maria Raza leads administration and operations at Royal Jubilant, ensuring every transaction, viewing and client engagement runs with precision. She manages the back-office workflow, RERA compliance, agent onboarding and the firm\'s document vault — the operational backbone that allows the advisory team to focus on clients.'), ep('["Administration Manager","RERA Compliance Certified"]'), ep('4.9'), ep('96'), ep('2'), ep('0'), ep('7'), ep('#'), ep('#'), NULL, ep('2'), 1, ep('2026-07-03 21:33:24'), ep('2026-07-11 20:27:02')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Agent` (`id`, `name`, `title`, `photo`, `phone`, `whatsapp`, `email`, `languages`, `specializations`, `communities`, `biography`, `awards`, `rating`, `reviewsCount`, `activeListings`, `soldProperties`, `experienceYears`, `linkedin`, `instagram`, `twitter`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5g9zww0002v8j0e8jrg34m'), ep('Muhammad Naeem Zafar'), ep('Property Consultant'), ep('/team/muhammad-naeem-zafar.webp'), ep('+971 4 327 8401'), ep('97143278401'), ep('muhammad.naeem.zafar@royaljubilant.ae'), ep('["English","Urdu","Arabic"]'), ep('["Residential Sales","Apartments","Villas","Buyer Representation"]'), ep('["Dubai Marina","JVC","Business Bay","Dubai Hills Estate"]'), ep('Muhammad Naeem Zafar is a senior property consultant at Royal Jubilant, specialising in residential sales across Dubai\'s mid-market and prime corridors. He has helped dozens of first-time buyers and seasoned investors identify high-yield opportunities, with a particular focus on apartments and villas in family-friendly communities.'), ep('["RERA Certified Property Consultant"]'), ep('4.8'), ep('74'), ep('1'), ep('96'), ep('6'), ep('#'), ep('#'), NULL, ep('3'), 1, ep('2026-07-03 21:33:24'), ep('2026-07-11 20:27:02')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Agent` (`id`, `name`, `title`, `photo`, `phone`, `whatsapp`, `email`, `languages`, `specializations`, `communities`, `biography`, `awards`, `rating`, `reviewsCount`, `activeListings`, `soldProperties`, `experienceYears`, `linkedin`, `instagram`, `twitter`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5g9zwx0003v8j0yw6dbyyq'), ep('Naqash Haider'), ep('Property Consultant'), ep('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'), ep('+971 4 327 8401'), ep('97143278401'), ep('naqash.haider@royaljubilant.ae'), ep('["English","Urdu","Hindi"]'), ep('["Commercial Real Estate","Offices","Retail","Leasing"]'), ep('["Business Bay","DIFC","JLT","Sheikh Zayed Road"]'), ep('Naqash Haider focuses on commercial real estate — offices, retail units and showrooms across Dubai\'s principal business districts. He advises SMEs, regional HQs and family offices on lease-vs-buy decisions, fitting-out costs and location strategy, with strong relationships across Business Bay, DIFC and JLT.'), ep('["RERA Certified Property Consultant"]'), ep('4.8'), ep('62'), ep('2'), ep('81'), ep('5'), ep('#'), ep('#'), NULL, ep('6'), 1, ep('2026-07-03 21:33:24'), ep('2026-07-11 20:27:02')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Agent` (`id`, `name`, `title`, `photo`, `phone`, `whatsapp`, `email`, `languages`, `specializations`, `communities`, `biography`, `awards`, `rating`, `reviewsCount`, `activeListings`, `soldProperties`, `experienceYears`, `linkedin`, `instagram`, `twitter`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5g9zwy0004v8j00itelhxk'), ep('Muhammad Saleem Khan'), ep('Property Consultant'), ep('https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=800&q=80'), ep('+971 4 327 8401'), ep('97143278401'), ep('muhammad.saleem.khan@royaljubilant.ae'), ep('["English","Urdu","Pashto"]'), ep('["Off-Plan Projects","Payment Plans","Investor Yield Analysis"]'), ep('["Dubai Creek Harbour","Madinat Jumeirah Living","Dubai South","Arjan"]'), ep('Muhammad Saleem Khan represents Royal Jubilant\'s off-plan desk, with first-call access to inventory from Emaar, Nakheel, Danube and Sobha. He structures payment plans for international investors and provides forward-yield modelling on pre-launch allocations — a critical input for portfolio buyers.'), ep('["RERA Certified Property Consultant"]'), ep('4.9'), ep('58'), ep('2'), ep('72'), ep('6'), ep('#'), ep('#'), NULL, ep('7'), 1, ep('2026-07-03 21:33:24'), ep('2026-07-11 20:27:02')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Agent` (`id`, `name`, `title`, `photo`, `phone`, `whatsapp`, `email`, `languages`, `specializations`, `communities`, `biography`, `awards`, `rating`, `reviewsCount`, `activeListings`, `soldProperties`, `experienceYears`, `linkedin`, `instagram`, `twitter`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5g9zx00005v8j0hphyd72c'), ep('Awais Ali'), ep('Property Consultant'), ep('/team/awais-ali.webp'), ep('+971 4 327 8401'), ep('97143278401'), ep('awais.ali@royaljubilant.ae'), ep('["English","Urdu"]'), ep('["Residential Leasing","Furnished Apartments","Short-Term Rentals"]'), ep('["Dubai Marina","JBR","Downtown Dubai","Business Bay"]'), ep('Awais Ali specialises in the rental market — both annual and short-term — across Dubai\'s most popular lifestyle districts. He maintains a curated portfolio of furnished apartments in Marina, JBR and Downtown, and works closely with relocating executives and their employers to find move-in-ready homes fast.'), ep('["RERA Certified Property Consultant"]'), ep('4.7'), ep('51'), ep('2'), ep('64'), ep('4'), ep('#'), ep('#'), NULL, ep('5'), 1, ep('2026-07-03 21:33:24'), ep('2026-07-11 20:27:02')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Agent` (`id`, `name`, `title`, `photo`, `phone`, `whatsapp`, `email`, `languages`, `specializations`, `communities`, `biography`, `awards`, `rating`, `reviewsCount`, `activeListings`, `soldProperties`, `experienceYears`, `linkedin`, `instagram`, `twitter`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5g9zx10006v8j0et5xuejr'), ep('Ahmad Ali'), ep('Property Consultant'), ep('/uploads/agents/1783390026612-c1lnfblw.webp'), ep('+971 4 327 8401'), ep('97143278401'), ep('ahmad.raza@royaljubilant.ae'), ep('["English","Urdu","Punjabi"]'), ep('["Townhouses","Family Villas","Gated Communities"]'), ep('["Arabian Ranches","Dubai Hills Estate","Tilal Al Ghaf","JVC"]'), ep('Ahmad Raza focuses on family villa and townhouse acquisitions in Dubai\'s gated communities. He works closely with relocating families to identify homes close to top schools, parks and community amenities — handling school catchment analysis, viewing schedules and post-purchase support.'), ep('["RERA Certified Property Consultant"]'), ep('4.8'), ep('47'), ep('1'), ep('53'), ep('4'), ep('#'), ep('#'), NULL, ep('4'), 1, ep('2026-07-03 21:33:24'), ep('2026-07-11 20:27:02')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Agent` (`id`, `name`, `title`, `photo`, `phone`, `whatsapp`, `email`, `languages`, `specializations`, `communities`, `biography`, `awards`, `rating`, `reviewsCount`, `activeListings`, `soldProperties`, `experienceYears`, `linkedin`, `instagram`, `twitter`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5g9zx30007v8j0rbeceiwy'), ep('Muhammad Nazim'), ep('Property Consultant'), ep('https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80'), ep('+971 4 327 8401'), ep('97143278401'), ep('muhammad.nazim@royaljubilant.ae'), ep('["English","Urdu","Arabic"]'), ep('["Industrial Property","Warehouses","Labour Camps","Bulk Units"]'), ep('["Dubai Investment Park","Dubai South","Ras Al Khor","Al Quoz"]'), ep('Muhammad Nazim represents Royal Jubilant\'s industrial and bulk-property desk, advising manufacturers, logistics operators and industrial funds on warehouses, labour camps and bulk residential units across Dubai Investment Park, Dubai South and Ras Al Khor. He is one of the firm\'s longest-serving consultants in the industrial segment.'), ep('["RERA Certified Property Consultant"]'), ep('4.8'), ep('43'), ep('2'), ep('58'), ep('7'), ep('#'), ep('#'), NULL, ep('8'), 1, ep('2026-07-03 21:33:24'), ep('2026-07-11 20:27:02')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Agent: $count/8 inserted\n";

// Property: 16 records
$count = 0;
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dl000lv8y5d2jvdxny'), ep('RJ-PLM-001'), ep('Signature Villa with Private Beach — Frond M'), ep('p-001'), ep('sale'), ep('Residential'), ep('Villa'), NULL, NULL, ep('Palm Jumeirah'), ep('Frond M'), ep('25.1124'), ep('55.1395'), ep('Frond M, Palm Jumeirah, Dubai'), ep('7'), ep('9'), ep('7450'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, NULL, NULL, NULL, ep('4'), ep('28500000'), ep('3820'), NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('A once-in-a-generation Signature Villa on Palm Jumeirah\'s most coveted frond. This 7-bedroom residence spans 7,450 sq ft of finished interiors with a private 30-metre beach, infinity pool overlooking the Burj Al Arab, and a wellness wing with gym, sauna and steam rooms. The architecture blends warm travertine with bronze detailing by an award-winning Italian studio.'), ep('71845-12345'), 0, ep('Nakheel'), 1, ep('["Private Beach","Infinity Pool","Home Cinema","Wine Cellar","Smart Home","Elevator","Staff Quarters","Gym"]'), ep('["Private 30m beach","Infinity pool","Home cinema","Wine cellar for 1,800 bottles","Smart-home automation","Private elevator","Staff quarters","Solar-assisted HVAC"]'), ep('[{"milestone":"On Booking","percentage":20},{"milestone":"On Handover","percentage":60},{"milestone":"12 Months Post-Handover","percentage":20}]'), NULL, 1, 0, 1, 1, ep('0'), ep('cmr5hmksb0001v8zx9hrkw64w'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dn000mv8y5jmkb2qq3'), ep('RJ-DWN-002'), ep('Sky Residence — Burj Khalifa Views, Address Sky View'), ep('p-002'), ep('sale'), ep('Residential'), ep('Penthouse'), NULL, NULL, ep('Downtown Dubai'), ep('Address Sky View'), ep('25.1972'), ep('55.2744'), ep('Address Sky View, Downtown Dubai'), ep('4'), ep('5'), ep('5720'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, NULL, NULL, NULL, ep('3'), ep('14200000'), ep('2480'), NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('A 4-bedroom penthouse on the 60th floor of Address Sky View with uninterrupted views of Burj Khalifa and The Dubai Fountain. Wrap-around terrace, Italian kitchen by Snaidero, and direct access to the award-winning Sky Bridge pool on the 70th floor.'), ep('71932-67890'), 0, ep('Emaar'), 1, ep('["Burj Khalifa View","Sky Pool Access","Concierge","Spa","Valet","Gym","Lounge"]'), ep('["270° Burj views","Sky Bridge pool access","Italian Snaidero kitchen","Wrap-around terrace","Smart-home","Walk to Dubai Mall"]'), ep('[{"milestone":"On Booking","percentage":30},{"milestone":"On Handover","percentage":70}]'), NULL, 1, 1, 1, 1, ep('0'), ep('cmra7jlz90002pd4jus1rr7od'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7do000nv8y5l9rctlw9'), ep('RJ-MAR-003'), ep('Cavalli-Branded Penthouse — Dubai Marina'), ep('p-003'), ep('sale'), ep('Residential'), ep('Penthouse'), NULL, NULL, ep('Dubai Marina'), ep('Cavalli Tower'), ep('25.0772'), ep('55.1395'), ep('Cavalli Tower, Dubai Marina'), ep('3'), ep('4'), ep('4460'), ep('sqft'), NULL, ep('sqft'), ep('Off-Plan'), NULL, NULL, NULL, NULL, ep('3'), ep('9850000'), ep('2210'), NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('An off-plan 3-bedroom penthouse in the new Cavalli-branded tower, featuring a private rooftop pool, animal-print interiors by Roberto Cavalli and direct marina-front views. Handover Q1 2027.'), ep('72014-34567'), 0, ep('DAMAC Properties'), 1, ep('["Marina View","Rooftop Pool","Private Pool","Spa","Gym","Concierge","Valet"]'), ep('["Cavalli interior styling","Private rooftop pool","Marina-front","Branded residence","Flexible 60/40 payment plan"]'), ep('[{"milestone":"On Booking","percentage":20},{"milestone":"During Construction","percentage":40},{"milestone":"On Handover","percentage":40}]'), ep('2027'), 1, 1, 1, 1, ep('0'), ep('cmra7jlz90002pd4jus1rr7od'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dq000ov8y5z7se52xz'), ep('RJ-HIL-004'), ep('Golf-Facing Family Villa — Dubai Hills Estate'), ep('p-004'), ep('sale'), ep('Residential'), ep('Villa'), NULL, NULL, ep('Dubai Hills Estate'), ep('Sidra'), ep('25.0614'), ep('55.2655'), ep('Sidra, Dubai Hills Estate'), ep('5'), ep('6'), ep('8550'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, NULL, NULL, NULL, ep('3'), ep('12400000'), ep('1450'), NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('A 5-bedroom Sidra villa facing the 12th fairway of the Dubai Hills Golf Course. North-facing garden, double-height living room, and roof terrace with Downtown skyline views.'), ep('72156-89123'), 0, ep('Emaar'), 0, ep('["Golf Course View","Private Pool","Garden","Maid\'s Room","Solar Panels","Smart Home"]'), ep('["12th fairway view","Roof terrace with skyline views","Walk to Dubai Hills Mall","Maid\'s and driver\'s rooms","Double-height living"]'), ep('[{"milestone":"On Booking","percentage":100}]'), NULL, 1, 0, 0, 1, ep('0'), ep('cmr5hml4e0007v8zx8jowzik8'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dr000pv8y5yienfihc'), ep('RJ-CRK-005'), ep('Off-Plan 2-Bedroom — Creek Beach, Creek Harbour'), ep('p-005'), ep('off-plan'), ep('Residential'), ep('Apartment'), NULL, NULL, ep('Dubai Creek Harbour'), ep('Creek Beach'), ep('25.2008'), ep('55.3414'), ep('Creek Beach, Dubai Creek Harbour'), ep('2'), ep('3'), ep('1360'), ep('sqft'), NULL, ep('sqft'), ep('Off-Plan'), NULL, NULL, NULL, NULL, ep('1'), ep('2650000'), ep('1950'), NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('An off-plan 2-bedroom apartment in Creek Beach, with 700m of private beach, palm-lined promenades and a yacht club. Strongest projected rental yield in Dubai per Knight Frank Q1 2026.'), ep('72278-45678'), 0, ep('Emaar'), 0, ep('["Beach Access","Pool","Gym","Concierge","Marina Walk"]'), ep('["700m private beach","Walk to Creek Marina","Projected 7.4% ROI","60/40 payment plan"]'), ep('[{"milestone":"On Booking","percentage":10},{"milestone":"During Construction (24 m)","percentage":50},{"milestone":"On Handover","percentage":40}]'), ep('2026'), 0, 1, 0, 1, ep('0'), ep('cmr5hmkyc0004v8zxwcpit8te'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7ds000qv8y5ozk8zfar'), ep('RJ-PLM-006'), ep('Sky Mansion — Six Senses Residences Palm Jumeirah'), ep('p-006'), ep('off-plan'), ep('Residential'), ep('Penthouse'), NULL, NULL, ep('Palm Jumeirah'), ep('Six Senses Residences'), ep('25.1124'), ep('55.1395'), ep('Six Senses Residences, Palm Jumeirah'), ep('5'), ep('7'), ep('9510'), ep('sqft'), NULL, ep('sqft'), ep('Off-Plan'), NULL, NULL, NULL, NULL, ep('5'), ep('46800000'), ep('4920'), NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('The Sky Mansion at Six Senses Residences occupies the top two floors of the new Palm tower. With 9,510 sq ft of interiors, a private 18-metre pool, a private spa with treatment rooms and a private sky lounge, this is among the most ambitious branded residences ever launched in Dubai.'), ep('72391-23456'), 0, ep('The Omniyat'), 1, ep('["Private Pool","Private Spa","Cinema","Sky Lounge","Butler","Concierge","Yacht Berth"]'), ep('["Full-floor privacy","Private 18m pool","Private spa with treatment rooms","Six Senses hotel services","Yacht berth allocation","Heli-pad access"]'), ep('[{"milestone":"On Booking","percentage":10},{"milestone":"During Construction","percentage":60},{"milestone":"On Handover","percentage":30}]'), ep('2026'), 1, 1, 1, 1, ep('0'), ep('cmr5hmksb0001v8zx9hrkw64w'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dt000rv8y5e6ii0k0b'), ep('RJ-BUS-007'), ep('Bugatti Residences — 2-Bedroom Off-Plan'), ep('p-007'), ep('off-plan'), ep('Residential'), ep('Apartment'), NULL, NULL, ep('Business Bay'), ep('Bugatti Residences'), ep('25.1885'), ep('55.2655'), ep('Bugatti Residences, Business Bay'), ep('2'), ep('3'), ep('2170'), ep('sqft'), NULL, ep('sqft'), ep('Off-Plan'), NULL, NULL, NULL, NULL, ep('2'), ep('5400000'), ep('2480'), NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('A 2-bedroom residence in the Bugatti-branded Business Bay tower — each residence includes a private car lift to a bespoke garage within the apartment. Handover 2027.'), ep('72453-78901'), 0, ep('DAMAC Properties'), 1, ep('["Car Lift","Private Garage","Pool","Spa","Cigar Lounge","Concierge"]'), ep('["Private car lift to apartment","Bugatti-curated finishes","Members-only cigar lounge","Walk to DIFC"]'), ep('[{"milestone":"On Booking","percentage":20},{"milestone":"During Construction","percentage":50},{"milestone":"On Handover","percentage":30}]'), ep('2027'), 0, 1, 1, 1, ep('0'), ep('cmr5hmkyc0004v8zxwcpit8te'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7du000sv8y5626cnrr9'), ep('RJ-MAR-008'), ep('Marina Gate 2-Bedroom for Rent — Furnished'), ep('p-008'), ep('rent'), ep('Residential'), ep('Apartment'), NULL, NULL, ep('Dubai Marina'), ep('Marina Gate'), ep('25.0772'), ep('55.1395'), ep('Marina Gate, Dubai Marina'), ep('2'), ep('3'), ep('1380'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, NULL, NULL, NULL, ep('1'), ep('195000'), NULL, ep('year'), NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('Fully-furnished 2-bedroom apartment in Marina Gate Tower 2 with full marina views, balcony and direct access to Marina Walk. Available immediately for annual rent.'), ep('72567-34567'), 0, ep('Select Group'), 1, ep('["Pool","Gym","Concierge","Marina View","Walk to Metro","Parking"]'), ep('["Marina-front view","Fully furnished","Walk to Marina Walk","Pool & gym access"]'), NULL, NULL, 0, 1, 0, 1, ep('0'), ep('cmr5hmkwc0003v8zxn7cyug1a'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dv000tv8y5ny4rgpxe'), ep('RJ-BUS-009'), ep('Grade-A Office Floor — Bay Square, Business Bay'), ep('p-009'), ep('sale'), ep('Commercial'), ep('Office'), NULL, NULL, ep('Business Bay'), ep('Bay Square'), ep('25.1885'), ep('55.2655'), ep('Bay Square, Business Bay'), ep('0'), ep('2'), ep('2840'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, NULL, NULL, NULL, ep('4'), ep('4200000'), ep('1480'), NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('A full fitted Grade-A office floor in Bay Square, Business Bay. 2,840 sq ft with 6 glass meeting rooms, open-plan workstations, two pantries and 4 dedicated parking bays.'), ep('72689-12345'), 0, ep('Dubai Properties'), 0, ep('["Fitted Office","Meeting Rooms","Reception","Parking","24/7 Access","Pantries"]'), ep('["Shell-and-core + fit-out","Glass meeting rooms","Open-plan layout","Walk to Business Bay Metro"]'), NULL, NULL, 0, 0, 0, 1, ep('0'), ep('cmr5hmkwc0003v8zxn7cyug1a'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dx000uv8y5gh9tybxf'), ep('RJ-HIL-010'), ep('Maple Townhouse — 4 Bed, Golf View'), ep('p-010'), ep('sale'), ep('Residential'), ep('Townhouse'), NULL, NULL, ep('Dubai Hills Estate'), ep('Maple'), ep('25.0614'), ep('55.2655'), ep('Maple, Dubai Hills Estate'), ep('4'), ep('5'), ep('4220'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, NULL, NULL, NULL, ep('2'), ep('5400000'), ep('1280'), NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('A 4-bedroom Maple townhouse with golf-course frontage, north-facing garden and a roof terrace. Walk to Maple\'s community pool and tennis court.'), ep('72734-56789'), 0, ep('Emaar'), 0, ep('["Golf Course View","Garden","Maid\'s Room","Roof Terrace","Community Pool"]'), ep('["Golf-course frontage","Roof terrace","Walk to school","Maid\'s room"]'), ep('[{"milestone":"On Booking","percentage":100}]'), NULL, 0, 0, 0, 1, ep('0'), ep('cmr5hml4e0007v8zx8jowzik8'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dy000vv8y579l3819o'), ep('RJ-DWN-011'), ep('1-Bedroom Investment Apartment — Boulevard'), ep('p-011'), ep('sale'), ep('Residential'), ep('Apartment'), NULL, NULL, ep('Downtown Dubai'), ep('The Address Sky View'), ep('25.1972'), ep('55.2744'), ep('The Address Sky View, Downtown'), ep('1'), ep('2'), ep('795'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, NULL, NULL, NULL, ep('1'), ep('1650000'), ep('2080'), NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('A 1-bedroom investment apartment in The Address Sky View with full Burj Khalifa views. Currently tenanted at AED 145,000, generating 6.4% net yield.'), ep('72845-67890'), 0, ep('Emaar'), 0, ep('["Pool","Gym","Concierge","Sky Lounge","Burj View"]'), ep('["Burj Khalifa view","Currently tenanted","6.4% net yield","Hotel-services access"]'), ep('[{"milestone":"On Booking","percentage":100}]'), NULL, 0, 1, 0, 1, ep('0'), ep('cmr5hml2d0006v8zxfilbmlj2'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dz000wv8y50xmeqqvv'), ep('RJ-PLM-012'), ep('Apartment for Rent — Tiara, Palm Jumeirah'), ep('p-012'), ep('rent'), ep('Residential'), ep('Apartment'), NULL, NULL, ep('Palm Jumeirah'), ep('Tiara'), ep('25.1124'), ep('55.1395'), ep('Tiara, Palm Jumeirah'), ep('2'), ep('3'), ep('1520'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, NULL, NULL, NULL, ep('1'), ep('245000'), NULL, ep('year'), NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, ep('["https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('Fully-furnished 2-bedroom apartment in Tiara on the Palm\'s trunk. Direct beach access, full sea view from the balcony, and shared pool and gym.'), ep('72956-23456'), 0, ep('Nakheel'), 1, ep('["Beach Access","Pool","Gym","Sea View","Concierge"]'), ep('["Direct beach access","Sea view balcony","Fully furnished","Walk to Nakheel Mall"]'), NULL, NULL, 0, 1, 0, 1, ep('0'), ep('cmr5hml0c0005v8zxf74x9rnq'), ep('2026-07-03 21:19:34'), ep('2026-07-07 11:20:00')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5n86n00001v8bakdkfibwa'), ep('RJ-970066'), ep('2BR Apartment with Sea View in Dubai Marina'), ep('rj-970066'), ep('sale'), ep('Residential'), ep('Apartment'), ep('UAE'), ep('Dubai'), ep('Dubai Marina'), NULL, NULL, NULL, NULL, ep('1'), ep('1'), ep('1200'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, ep('Unfurnished'), NULL, NULL, ep('1'), ep('1500000'), ep('1250'), ep('Yearly'), NULL, NULL, 0, ep('["Central A/C"]'), ep('[]'), ep('[]'), ep('[]'), ep('[]'), ep('["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('Stunning 2-bedroom apartment in Dubai Marina with panoramic sea views. Fully furnished with modern finishes, open-plan kitchen, and spacious balcony. Building amenities include pool, gym, and 24/7 security. Walk to Marina Walk and JBR Beach.'), ep('RENT-123456'), 0, NULL, 0, ep('["Central A/C"]'), ep('["Central A/C"]'), NULL, NULL, 0, 1, 0, 1, ep('0'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('2026-07-04 00:47:57'), ep('2026-07-07 08:55:31')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5oqrvn0003v8bah2qxt5y4'), ep('RJ-46611566'), ep('Test Property - Fixed Submission'), ep('rj-46611566'), ep('sale'), ep('Residential'), ep('Apartment'), ep('UAE'), ep('Dubai'), ep('Dubai Marina'), NULL, NULL, NULL, NULL, ep('1'), ep('1'), ep('1200'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, ep('Unfurnished'), NULL, NULL, ep('1'), ep('1500000'), ep('1250'), ep('Yearly'), NULL, NULL, 0, ep('[]'), ep('[]'), ep('[]'), ep('[]'), ep('[]'), ep('["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"]'), NULL, NULL, NULL, ep('Stunning test property with beautiful views and modern finishes. This is a test submission to verify the form is working correctly after the fix. The property features spacious living areas and premium amenities throughout.'), ep('RENT-TEST-001'), 0, NULL, 0, ep('[]'), ep('[]'), NULL, NULL, 0, 1, 0, 1, ep('0'), ep('cmr5hmkq90000v8zxdji56353'), ep('2026-07-04 01:30:24'), ep('2026-07-07 02:08:23')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmra0hqtg0001pdnr70xieuyb'), ep('RJ-48545238'), ep('2BR Apartment with Marina View in JBR'), ep('p-48545238'), ep('rent'), ep('Residential'), ep('Apartment'), ep('UAE'), ep('Dubai'), ep('JBR'), NULL, ep('25.0837'), ep('55.1395'), ep('JBR, Dubai'), ep('2'), ep('3'), ep('860'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, ep('Furnished'), NULL, NULL, ep('1'), ep('123000'), ep('143'), ep('year'), ep('1'), NULL, 0, ep('["Modern Kitchen","Built-in Wardrobes","Floor-to-ceiling Windows"]'), ep('["Marina View Balcony"]'), ep('["Pool","Gym","Concierge","Beach Access"]'), ep('["The Walk JBR","Marina Mall"]'), ep('["Marina View"]'), ep('["/uploads/properties/1783276720397-qsk5cada.webp","/uploads/properties/1783276720409-ls7mlkgp.webp","/uploads/properties/1783276720419-odh34xa5.webp","/uploads/properties/1783276720634-x79z546b.webp","/uploads/properties/1783276720707-7ko1ggoz.webp"]'), NULL, NULL, NULL, ep('Beautiful 2-bedroom apartment with stunning Marina views in JBR. Fully furnished, ready to move in. Features floor-to-ceiling windows, modern kitchen, spacious living area, and access to building amenities including pool, gym, and direct beach access.'), ep('72312249216'), 0, NULL, 1, ep('["Pool","Gym","Concierge","Beach Access","Marina View"]'), ep('["Marina View","Fully Furnished","Balcony","Beach Access"]'), NULL, NULL, 0, 1, 0, 1, ep('0'), ep('cmr5hml0c0005v8zxf74x9rnq'), ep('2026-07-07 02:10:22'), ep('2026-07-07 02:10:22')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Property` (`id`, `reference`, `title`, `slug`, `status`, `category`, `type`, `country`, `emirate`, `community`, `subCommunity`, `locationLat`, `locationLng`, `locationAddress`, `bedrooms`, `bathrooms`, `area`, `areaUnit`, `plotSize`, `plotSizeUnit`, `completionStatus`, `completionDate`, `furnishingStatus`, `floorNumber`, `totalFloors`, `parking`, `price`, `pricePerSqft`, `rentFrequency`, `noOfCheques`, `serviceCharge`, `priceNegotiable`, `indoorFeatures`, `outdoorFeatures`, `buildingAmenities`, `nearbyLandmarks`, `viewFeatures`, `images`, `floorPlanUrl`, `videoUrl`, `virtualTourUrl`, `description`, `reraNumber`, `exclusiveListing`, `developer`, `furnished`, `amenities`, `features`, `paymentPlan`, `handoverYear`, `featured`, `isLatest`, `isLuxury`, `published`, `views`, `agentId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmraivhy4000esh0vlo7d3b9i'), ep('RJ-78947492'), ep('Male Executive Bachelor’s Bed Space Available in Bur Dubai'), ep('rj-78947492'), ep('rent'), ep('Residential'), ep('Bed Space'), ep('UAE'), ep('Dubai'), ep('Business Bay'), ep('byery'), NULL, NULL, ep('festase'), ep('1'), ep('1'), ep('55'), ep('sqft'), NULL, ep('sqft'), ep('Ready'), NULL, ep('Furnished'), NULL, ep('5'), ep('1'), ep('500'), ep('9'), ep('Monthly'), NULL, ep('50'), 1, ep('["Central A/C"]'), ep('[]'), ep('["Shared Spa"]'), ep('["School"]'), ep('["City View"]'), ep('["/uploads/properties/1783421034478-3ai14azv.jpg","/uploads/properties/1783421066418-8ku1lpvp.webp","/uploads/properties/1783421067351-n7fpajj4.webp"]'), NULL, NULL, NULL, ep('Male Executive Bachelor’s Bed Space Available in Bur Dubai'), ep('1123455'), 0, NULL, 1, ep('["Central A/C","Shared Spa"]'), ep('["Central A/C"]'), NULL, NULL, 0, 1, 0, 1, ep('0'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('2026-07-07 10:44:57'), ep('2026-07-07 12:34:18')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Property: $count/16 inserted\n";

// Community: 6 records
$count = 0;
$sql = 'INSERT INTO `Community` (`id`, `name`, `shortName`, `hero`, `overview`, `lifestyle`, `averagePrice`, `pricePerSqft`, `roi`, `population`, `totalProperties`, `rating`, `highlights`, `schools`, `hospitals`, `transport`, `shopping`, `nearbyCommunities`, `stats`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7d60009v8y5r3mmppcl'), ep('Palm Jumeirah'), ep('Palm Jumeirah'), ep('https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80'), ep('The world\'s largest man-made archipelago and Dubai\'s most recognised address. Palm Jumeirah delivers uninterrupted sea views, private beach access and a roster of branded residences that include Atlantis The Royal, Six Senses and Anantara.'), ep('Beachfront living with a 5.4km promenade, private beach clubs, fine-dining at Atlantis and The Pointe, and direct marina access for yacht owners.'), ep('AED 12.4M'), ep('AED 3,420'), ep('5.2%'), ep('25,000+'), ep('1842'), ep('4.9'), ep('["Private beaches","Yacht berths","Branded residences","5-star hotels"]'), ep('[{"name":"Dubai College","rating":"Outstanding","type":"British"},{"name":"Regent International School","rating":"Very Good","type":"British"},{"name":"iCademy Middle East","rating":"Good","type":"American"}]'), ep('[{"name":"Saudi German Hospital","distance":"8 min"},{"name":"King\'s College Hospital","distance":"12 min"}]'), ep('[{"name":"Palm Monorail","type":"Monorail","distance":"3 min"},{"name":"Sheikh Zayed Road","type":"Highway","distance":"5 min"}]'), ep('[{"name":"Nakheel Mall","type":"Mall"},{"name":"The Pointe","type":"Waterfront Retail"},{"name":"West Beach","type":"Boutique Strip"}]'), ep('["Dubai Marina","Al Sufouh","Dubai Knowledge Park"]'), ep('[{"label":"Avg Villa Price","value":"AED 18.6M"},{"label":"Avg Apartment","value":"AED 4.2M"},{"label":"Annual ROI","value":"5.2%"},{"label":"Year-on-Year Growth","value":"+18.4%"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Community` (`id`, `name`, `shortName`, `hero`, `overview`, `lifestyle`, `averagePrice`, `pricePerSqft`, `roi`, `population`, `totalProperties`, `rating`, `highlights`, `schools`, `hospitals`, `transport`, `shopping`, `nearbyCommunities`, `stats`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7d9000av8y5c2gn7btc'), ep('Downtown Dubai'), ep('Downtown'), ep('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80'), ep('The civic and cultural heart of modern Dubai, anchored by Burj Khalifa, The Dubai Mall and Dubai Opera. Downtown is the city\'s most walkable luxury district and the address of choice for executives and creatives alike.'), ep('Walk to Dubai Opera, dine at 200+ restaurants inside The Dubai Mall, or step out onto Mohammed Bin Rashid Boulevard for evening parades and street art.'), ep('AED 3.8M'), ep('AED 2,180'), ep('6.1%'), ep('100,000+'), ep('9200'), ep('4.8'), ep('["Burj Khalifa views","Dubai Mall access","Dubai Opera","Walkable boulevards"]'), ep('[{"name":"Jumeirah International Nursery","rating":"Outstanding","type":"EYFS"},{"name":"Horizon English School","rating":"Outstanding","type":"British"}]'), ep('[{"name":"Mediclinic City Hospital","distance":"6 min"}]'), ep('[{"name":"Burj Khalifa / Dubai Mall Metro","type":"Red Line","distance":"4 min"},{"name":"Financial Centre Road","type":"Highway","distance":"3 min"}]'), ep('[{"name":"The Dubai Mall","type":"Mall"},{"name":"Souk Al Bahar","type":"Traditional"}]'), ep('["Business Bay","DIFC","Opera District"]'), ep('[{"label":"Avg Apartment","value":"AED 3.8M"},{"label":"Avg Penthouse","value":"AED 22M"},{"label":"Annual ROI","value":"6.1%"},{"label":"Year-on-Year Growth","value":"+12.6%"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Community` (`id`, `name`, `shortName`, `hero`, `overview`, `lifestyle`, `averagePrice`, `pricePerSqft`, `roi`, `population`, `totalProperties`, `rating`, `highlights`, `schools`, `hospitals`, `transport`, `shopping`, `nearbyCommunities`, `stats`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7db000bv8y54nlt9x1i'), ep('Dubai Marina'), ep('Marina'), ep('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80'), ep('A 3km canal city of high-rise living and yacht-filled promenades. Dubai Marina remains the city\'s most popular rental district for young professionals and a steady-yield favourite for investors.'), ep('Marina Walk dining, JBR Beach access, yacht charter from the marina itself, and the new Marina Eye observation wheel.'), ep('AED 2.1M'), ep('AED 1,820'), ep('6.8%'), ep('55,000+'), ep('12400'), ep('4.7'), ep('["Marina Walk","Yacht lifestyle","JBR Beach","Nightlife hub"]'), ep('[{"name":"Dubai British School Jumeirah Park","rating":"Outstanding","type":"British"}]'), ep('[{"name":"Saudi German Hospital","distance":"5 min"}]'), ep('[{"name":"Dubai Marina Metro","type":"Red Line","distance":"3 min"},{"name":"Marina Tram","type":"Tram","distance":"2 min"}]'), ep('[{"name":"Marina Mall","type":"Mall"},{"name":"JBR The Walk","type":"Boulevard Retail"}]'), ep('["JBR","Bluewaters Island","Dubai Media City"]'), ep('[{"label":"Avg Apartment","value":"AED 2.1M"},{"label":"Avg Penthouse","value":"AED 9.4M"},{"label":"Annual ROI","value":"6.8%"},{"label":"Year-on-Year Growth","value":"+9.8%"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Community` (`id`, `name`, `shortName`, `hero`, `overview`, `lifestyle`, `averagePrice`, `pricePerSqft`, `roi`, `population`, `totalProperties`, `rating`, `highlights`, `schools`, `hospitals`, `transport`, `shopping`, `nearbyCommunities`, `stats`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dc000cv8y5029o43wn'), ep('Dubai Creek Harbour'), ep('Creek Harbour'), ep('https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=1600&q=80'), ep('Emaar\'s 6 sq km masterplan around the new Creek Tower and Creek Marina. A future-forward district designed by some of the world\'s leading architects and the next chapter of Dubai\'s luxury story.'), ep('Creek Beach, Creek Marina promenade, the upcoming Creek Tower (set to surpass Burj Khalifa), and 4.5km of canal-front retail.'), ep('AED 2.6M'), ep('AED 1,950'), ep('7.4%'), ep('Growing'), ep('4800'), ep('4.6'), ep('["Creek Tower district","Marina living","Smart-city infrastructure","Creek Beach"]'), ep('[{"name":"Dubai Creek Harbour ELC","rating":"Good","type":"EYFS"}]'), ep('[{"name":"Mediclinic Parkview","distance":"10 min"}]'), ep('[{"name":"Creek Harbour Metro","type":"Green Line","distance":"5 min"},{"name":"Ras Al Khor Road","type":"Highway","distance":"4 min"}]'), ep('[{"name":"Creek Marina Mall","type":"Mall"}]'), ep('["Downtown","Business Bay","Ras Al Khor"]'), ep('[{"label":"Avg Apartment","value":"AED 2.6M"},{"label":"Avg Villa","value":"AED 14M"},{"label":"Annual ROI","value":"7.4%"},{"label":"Year-on-Year Growth","value":"+22.1%"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Community` (`id`, `name`, `shortName`, `hero`, `overview`, `lifestyle`, `averagePrice`, `pricePerSqft`, `roi`, `population`, `totalProperties`, `rating`, `highlights`, `schools`, `hospitals`, `transport`, `shopping`, `nearbyCommunities`, `stats`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dd000dv8y5vf81naqd'), ep('Dubai Hills Estate'), ep('Dubai Hills'), ep('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'), ep('Emaar\'s 2,700-acre gated community built around an 18-hole championship golf course. The most sought-after family-villa district in Dubai, with direct parkway access to Downtown and the new Metro line.'), ep('Dubai Hills Golf Club, Dubai Hills Mall, 32km of cycling tracks, and the central 270-acre public park.'), ep('AED 8.4M'), ep('AED 1,640'), ep('5.8%'), ep('60,000+'), ep('6400'), ep('4.9'), ep('["Golf course living","Family-friendly","Top schools","270-acre park"]'), ep('[{"name":"GEMS International School","rating":"Outstanding","type":"IB"},{"name":"GEMS Wellington Primary","rating":"Outstanding","type":"British"},{"name":"King\'s School Dubai Hills","rating":"Outstanding","type":"British"}]'), ep('[{"name":"King\'s College Hospital","distance":"8 min"}]'), ep('[{"name":"Equiti Metro","type":"Red Line","distance":"6 min"},{"name":"Mohammed Bin Zayed Road","type":"Highway","distance":"4 min"}]'), ep('[{"name":"Dubai Hills Mall","type":"Mall"}]'), ep('["Al Barsha","Mudon","Arabian Ranches"]'), ep('[{"label":"Avg Villa","value":"AED 8.4M"},{"label":"Avg Townhouse","value":"AED 4.1M"},{"label":"Annual ROI","value":"5.8%"},{"label":"Year-on-Year Growth","value":"+15.2%"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Community` (`id`, `name`, `shortName`, `hero`, `overview`, `lifestyle`, `averagePrice`, `pricePerSqft`, `roi`, `population`, `totalProperties`, `rating`, `highlights`, `schools`, `hospitals`, `transport`, `shopping`, `nearbyCommunities`, `stats`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dd000ev8y51fza2ruu'), ep('Business Bay'), ep('Business Bay'), ep('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'), ep('Dubai\'s central business district and the city\'s densest concentration of branded residences, including Cavalli, Bugatti, Bvlgari and Four Seasons. Canal-front living next to Downtown.'), ep('Canal-side dining, Bay Avenue park, direct water-taxi to Dubai Mall, and the city\'s most ambitious skyline.'), ep('AED 1.8M'), ep('AED 1,690'), ep('7.1%'), ep('100,000+'), ep('11600'), ep('4.5'), ep('["Branded residences","Canal living","Walk to Downtown","Investor yields"]'), ep('[{"name":" Horizon English School","rating":"Outstanding","type":"British"}]'), ep('[{"name":"Mediclinic City Hospital","distance":"5 min"}]'), ep('[{"name":"Business Bay Metro","type":"Red Line","distance":"4 min"},{"name":"Sheikh Zayed Road","type":"Highway","distance":"2 min"}]'), ep('[{"name":"Bay Avenue","type":"Lifestyle Mall"}]'), ep('["Downtown","DIFC","Dubai Water Canal"]'), ep('[{"label":"Avg Apartment","value":"AED 1.8M"},{"label":"Avg Penthouse","value":"AED 11M"},{"label":"Annual ROI","value":"7.1%"},{"label":"Year-on-Year Growth","value":"+11.7%"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Community: $count/6 inserted\n";

// Developer: 6 records
$count = 0;
$sql = 'INSERT INTO `Developer` (`id`, `name`, `logo`, `founded`, `headquarters`, `overview`, `totalProjects`, `completedProjects`, `ongoingProjects`, `awards`, `hero`, `topProjects`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7df000fv8y5qhn4dqx9'), ep('Emaar Properties'), ep('https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Emaar-Properties-Logo.svg/1200px-Emaar-Properties-Logo.svg.png'), ep('1997'), ep('Dubai, UAE'), ep('The developer behind Burj Khalifa, Downtown Dubai, Dubai Hills Estate and Dubai Creek Harbour. Emaar is the largest listed real estate developer in the GCC and the most recognised Dubai brand internationally.'), ep('64'), ep('51'), ep('13'), ep('["Best Developer — Arabian Property Awards 2024","Global Real Estate Brand of the Year"]'), ep('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80'), ep('[{"name":"Dubai Hills Estate","community":"Dubai Hills","status":"Completed"},{"name":"Dubai Creek Harbour","community":"Creek Harbour","status":"Under Construction"},{"name":"Address Sky View","community":"Downtown","status":"Completed"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-07 12:26:51')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Developer` (`id`, `name`, `logo`, `founded`, `headquarters`, `overview`, `totalProjects`, `completedProjects`, `ongoingProjects`, `awards`, `hero`, `topProjects`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dg000gv8y5yawl6fth'), ep('Nakheel'), ep('https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Nakheel_Logo.svg/1200px-Nakheel_Logo.svg.png'), ep('2000'), ep('Dubai, UAE'), ep('Master developer of Palm Jumeirah, The World, Deira Islands and Jumeirah Village. Nakheel\'s waterfront masterplans reshaped Dubai\'s coastline and continue to define its luxury waterfront inventory.'), ep('28'), ep('22'), ep('6'), ep('["Waterfront Masterplan of the Year 2023","Iconic Developer — Middle East"]'), ep('https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80'), ep('[{"name":"Palm Jumeirah","community":"Palm Jumeirah","status":"Completed"},{"name":"Palm Jebel Ali","community":"Palm Jebel Ali","status":"Off-Plan"},{"name":"Deira Islands","community":"Deira","status":"Under Construction"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-07 12:26:51')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Developer` (`id`, `name`, `logo`, `founded`, `headquarters`, `overview`, `totalProjects`, `completedProjects`, `ongoingProjects`, `awards`, `hero`, `topProjects`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dh000hv8y5xvzoxl4m'), ep('DAMAC Properties'), ep('https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Damac_Logo.svg/1200px-Damac_Logo.svg.png'), ep('2002'), ep('Dubai, UAE'), ep('Pioneer of branded residences in the GCC, with partnerships including Cavalli, Bugatti, Fendi and Paramount. DAMAC delivers some of Dubai\'s most flamboyant luxury addresses.'), ep('41'), ep('30'), ep('11'), ep('["Branded Residences Developer of the Year 2024"]'), ep('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'), ep('[{"name":"Cavalli Tower","community":"Dubai Marina","status":"Off-Plan"},{"name":"Bugatti Residences","community":"Business Bay","status":"Off-Plan"},{"name":"Paramount Tower","community":"Business Bay","status":"Completed"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-07 12:26:51')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Developer` (`id`, `name`, `logo`, `founded`, `headquarters`, `overview`, `totalProjects`, `completedProjects`, `ongoingProjects`, `awards`, `hero`, `topProjects`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7di000iv8y5fv5dzomr'), ep('Sobha Realty'), ep('https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Sobha_Realtors_Logo.svg/1200px-Sobha_Realtors_Logo.svg.png'), ep('1995'), ep('Dubai, UAE'), ep('Vertically integrated luxury developer behind Sobha Hartland — 8M sq ft of low-rise luxury along the Dubai Water Canal. Sobha is renowned for in-house craftsmanship and ultra-premium finishes.'), ep('18'), ep('11'), ep('7'), ep('["Craftsmanship Award — Arabian Property 2024","Best Villa Developer"]'), ep('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'), ep('[{"name":"Sobha Hartland","community":"Mohammed Bin Rashid City","status":"Under Construction"},{"name":"Sobha SeaHaven","community":"Dubai Harbour","status":"Off-Plan"},{"name":"The Crest","community":"Sobha Hartland","status":"Completed"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-07 12:26:51')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Developer` (`id`, `name`, `logo`, `founded`, `headquarters`, `overview`, `totalProjects`, `completedProjects`, `ongoingProjects`, `awards`, `hero`, `topProjects`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dj000jv8y5npnq8osq'), ep('Meydan Group'), ep('https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Meydan_Group_Logo.svg/1200px-Meydan_Group_Logo.svg.png'), ep('2007'), ep('Dubai, UAE'), ep('Custodian of the Meydan Racecourse and master developer of Mohammed Bin Rashid City, Meydan delivers large-scale low-rise communities with strong value-per-square-foot propositions.'), ep('14'), ep('9'), ep('5'), ep('["Masterplan of the Year 2023"]'), ep('https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=1600&q=80'), ep('[{"name":"Meydan One","community":"Mohammed Bin Rashid City","status":"Under Construction"},{"name":"District One","community":"Meydan","status":"Completed"},{"name":"Meydan Avenue","community":"Meydan","status":"Off-Plan"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-07 12:26:51')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Developer` (`id`, `name`, `logo`, `founded`, `headquarters`, `overview`, `totalProjects`, `completedProjects`, `ongoingProjects`, `awards`, `hero`, `topProjects`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7dj000kv8y5r9nr9jrn'), ep('The Omniyat'), ep('https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/Omniyat_Logo.svg/1200px-Omniyat_Logo.svg.png'), ep('2005'), ep('Dubai, UAE'), ep('Architect-led branded residences specialist behind The Opus by Zaha Hadid, Anwa by OMNIYAT and the new Six Senses Residences Dubai Marina. Omniyat is the developer of choice for design-led UHNW buyers.'), ep('22'), ep('14'), ep('8'), ep('["Architectural Excellence Award 2024"]'), ep('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'), ep('[{"name":"Six Senses Residences","community":"Dubai Marina","status":"Off-Plan"},{"name":"The Opus","community":"Business Bay","status":"Completed"},{"name":"Anwa","community":"Dubai Maritime City","status":"Under Construction"}]'), 1, ep('2026-07-03 21:19:34'), ep('2026-07-07 12:26:51')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Developer: $count/6 inserted\n";

// BlogPost: 4 records
$count = 0;
$sql = 'INSERT INTO `BlogPost` (`id`, `title`, `excerpt`, `category`, `date`, `readTime`, `authorName`, `image`, `content`, `published`, `authorId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7e2000xv8y5jsbgsb2a'), ep('Palm Jumeirah Villa Prices Hit AED 5,100/sqft in Q1 2026'), ep('Our Q1 2026 prime index shows Palm Jumeirah Signature Villas up 18.4% year-on-year, with frond M and K leading the surge. Here is what is driving demand.'), ep('Market Insights'), ep('2026-06-28 00:00:00'), ep('6 min'), ep('Alexander Whitfield'), ep('https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80'), ep('Our Q1 2026 prime index shows Palm Jumeirah Signature Villas up 18.4% year-on-year, with frond M and K leading the surge. Here is what is driving demand.'), 1, NULL, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `BlogPost` (`id`, `title`, `excerpt`, `category`, `date`, `readTime`, `authorName`, `image`, `content`, `published`, `authorId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7e3000yv8y55w315dfx'), ep('Golden Visa 2026 — What Property Buyers Need to Know'), ep('The UAE has updated its property-based Golden Visa thresholds. We break down the new AED 2M route, eligible off-plan purchases and family inclusion rules.'), ep('Guides'), ep('2026-06-20 00:00:00'), ep('8 min'), ep('Layla Al-Mansoori'), ep('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80'), ep('The UAE has updated its property-based Golden Visa thresholds. We break down the new AED 2M route, eligible off-plan purchases and family inclusion rules.'), 1, NULL, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `BlogPost` (`id`, `title`, `excerpt`, `category`, `date`, `readTime`, `authorName`, `image`, `content`, `published`, `authorId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7e5000zv8y5snxztoia'), ep('Branded Residences: Why Dubai Now Has More Than London and New York Combined'), ep('With 110+ branded residences completed or in pipeline, Dubai is the global capital of the sector. We analyse the premium they command and the brands to watch.'), ep('Luxury'), ep('2026-06-12 00:00:00'), ep('10 min'), ep('Sofia Marchetti'), ep('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'), ep('With 110+ branded residences completed or in pipeline, Dubai is the global capital of the sector. We analyse the premium they command and the brands to watch.'), 1, NULL, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `BlogPost` (`id`, `title`, `excerpt`, `category`, `date`, `readTime`, `authorName`, `image`, `content`, `published`, `authorId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7e60010v8y5wcpmrlyb'), ep('Creek Harbour vs. Dubai Hills: A 5-Year Investment Case'), ep('Two of Emaar\'s largest masterplans, two very different risk profiles. We compare projected yields, capital growth and exit liquidity for the 2026-2031 horizon.'), ep('Investment'), ep('2026-05-30 00:00:00'), ep('12 min'), ep('James Okonkwo'), ep('https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=1200&q=80'), ep('Two of Emaar\'s largest masterplans, two very different risk profiles. We compare projected yields, capital growth and exit liquidity for the 2026-2031 horizon.'), 1, NULL, ep('2026-07-03 21:19:34'), ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  BlogPost: $count/4 inserted\n";

// Testimonial: 7 records
$count = 0;
$sql = 'INSERT INTO `Testimonial` (`id`, `name`, `role`, `location`, `avatar`, `rating`, `quote`, `service`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmr9yabs30002pdx083tgcxx4'), ep('Ahmed Al Rashid'), ep('Business Owner'), ep('Dubai Marina, UAE'), ep('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'), ep('5'), ep('I can\'t recommend Royal Jubilant enough. I had the pleasure of working with their team — they are truly knowledgeable about the industry and very professional. They consistently kept me up to date about accurate changes in the Dubai market, which helped me make an informed investment decision.'), ep('Apartment Purchase — Dubai Marina'), 1, ep('2026-07-07 01:08:37')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Testimonial` (`id`, `name`, `role`, `location`, `avatar`, `rating`, `quote`, `service`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmr9yabs40003pdx0jsoejaz8'), ep('Sara Khan'), ep('Marketing Executive'), ep('Downtown Dubai, UAE'), ep('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'), ep('5'), ep('Excellent service from start to finish. Muhammad Javed Zafar personally guided me through every step of renting my apartment in Downtown Dubai. The team\'s deep knowledge of the market and attention to detail made the entire process smooth and stress-free. Highly recommended!'), ep('Apartment Rental — Downtown Dubai'), 1, ep('2026-07-07 01:08:37')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Testimonial` (`id`, `name`, `role`, `location`, `avatar`, `rating`, `quote`, `service`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmr9yabs40004pdx0oh7ady65'), ep('James Mitchell'), ep('Investor'), ep('London, United Kingdom'), ep('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'), ep('5'), ep('As an overseas investor, I needed a real estate partner I could trust. Royal Jubilant delivered beyond expectations — their RERA-certified advisors provided practical, feasible information to capitalize on opportunities for optimal results. They handled everything remotely and made my Dubai property investment effortless.'), ep('Off-Plan Investment — Creek Harbour'), 1, ep('2026-07-07 01:08:37')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Testimonial` (`id`, `name`, `role`, `location`, `avatar`, `rating`, `quote`, `service`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmr9yabs50005pdx0p3bhdsn4'), ep('Fatima Hassan'), ep('Family Relocation'), ep('Palm Jumeirah, UAE'), ep('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80'), ep('5'), ep('We relocated our family to Dubai and Royal Jubilant made it seamless. Their team understood exactly what a family needs — they found us the perfect villa in Palm Jumeirah within our budget and handled all the paperwork. Their reputation for excellence and customer satisfaction is well deserved.'), ep('Family Villa Acquisition — Palm Jumeirah'), 1, ep('2026-07-07 01:08:37')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Testimonial` (`id`, `name`, `role`, `location`, `avatar`, `rating`, `quote`, `service`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmrdm4pts0000tudtewjyyeb1'), ep('Aisha Al Marri'), ep('Verified Client'), ep('Dubai Marina'), ep('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'), ep('5'), ep('Found my dream 2BR apartment in Dubai Marina within 48 hours. The team understood exactly what I wanted and negotiated a great rate. Truly five-star service.'), ep('Tenant'), 1, ep('2026-07-09 14:39:25')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Testimonial` (`id`, `name`, `role`, `location`, `avatar`, `rating`, `quote`, `service`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmrdm4ptv0001tudthpercg88'), ep('James Patterson'), ep('Verified Client'), ep('Business Bay'), ep('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'), ep('5'), ep('As an expat buying my first property in Dubai, I was nervous. Royal Jubilant made the entire process seamless — from viewings to NOC to handover. Highly recommend.'), ep('Buyer'), 1, ep('2026-07-09 14:39:25')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Testimonial` (`id`, `name`, `role`, `location`, `avatar`, `rating`, `quote`, `service`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmrdm4ptw0002tudtiisxqlc6'), ep('Sana Khan'), ep('Verified Client'), ep('JVC'), ep('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'), ep('5'), ep('I invested in an off-plan project in JVC based on their advice. The ROI has exceeded expectations. Their market knowledge is genuinely unmatched in Dubai.'), ep('Investor'), 1, ep('2026-07-09 14:39:25')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Testimonial: $count/7 inserted\n";

// Award: 6 records
$count = 0;
$sql = 'INSERT INTO `Award` (`id`, `title`, `issuer`, `year`, `icon`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5fs7eb0015v8y5nylta7zc'), ep('Luxury Real Estate Firm of the Year — UAE'), ep('Arabian Property Awards'), ep('2025'), ep('trophy'), 1, ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Award` (`id`, `title`, `issuer`, `year`, `icon`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5fs7ec0016v8y5ep3j0a72'), ep('Top 1% Brokerage by Transaction Value'), ep('Dubai Land Department'), ep('2024'), ep('medal'), 1, ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Award` (`id`, `title`, `issuer`, `year`, `icon`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5fs7ec0017v8y5amqr2svo'), ep('Best Off-Plan Advisory'), ep('Gulf Real Estate Awards'), ep('2024'), ep('star'), 1, ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Award` (`id`, `title`, `issuer`, `year`, `icon`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5fs7ed0018v8y5bj3njdxa'), ep('Excellence in Client Service'), ep('International Property Awards'), ep('2024'), ep('award'), 1, ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Award` (`id`, `title`, `issuer`, `year`, `icon`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5fs7ed0019v8y5o9q4z8du'), ep('Top 10 Independent Brokerages — GCC'), ep('Forbes Middle East'), ep('2024'), ep('crown'), 1, ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Award` (`id`, `title`, `issuer`, `year`, `icon`, `published`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5fs7ee001av8y5p1m8i5pr'), ep('Best Branded Residences Advisor'), ep('Luxury Travel Advisor'), ep('2023'), ep('gem'), 1, ep('2026-07-03 21:19:34')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Award: $count/6 inserted\n";

// Faq: 8 records
$count = 0;
$sql = 'INSERT INTO `Faq` (`id`, `question`, `answer`, `category`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('faq-seed-1'), ep('What is the minimum property value for a Golden Visa in the UAE?'), ep('Under the 2026 update, a property purchase of AED 2,000,000 or more qualifies you for the 10-year Golden Visa. Off-plan properties from approved developers are eligible once 20% of the purchase price is paid. Royal Jubilant handles the entire application in-house.'), ep('buying'), ep('1'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Faq` (`id`, `question`, `answer`, `category`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('faq-seed-2'), ep('Can non-residents buy property in Dubai?'), ep('Yes. Non-residents can buy freehold property in designated areas of Dubai. Mortgages are available to non-residents at typically 60-70% LTV, and we work with 12 UAE banks to secure the best terms.'), ep('buying'), ep('2'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Faq` (`id`, `question`, `answer`, `category`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('faq-seed-3'), ep('What are the typical buyer-side costs?'), ep('Buyer costs include: 4% Dubai Land Department transfer fee, 2% agent fee (Royal Jubilant), AED 4,000 title deed issuance, and a small admin fee. For off-plan, the agent fee is paid by the developer — buyers pay 0%.'), ep('buying'), ep('3'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Faq` (`id`, `question`, `answer`, `category`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('faq-seed-4'), ep('How long does the buying process take?'), ep('For a ready property with mortgage: typically 30-45 days. For a cash purchase: 7-14 days. For off-plan: the SPA is signed within 7 days of booking, with payments spread across the construction timeline.'), ep('buying'), ep('4'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Faq` (`id`, `question`, `answer`, `category`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('faq-seed-5'), ep('What ROI should I expect on a Dubai investment?'), ep('Yields vary by community and asset class. Prime apartments in Marina/Business Bay deliver 6.5-7.5%, townhouses in Dubai Hills 5.5-6%, and Palm villas 4.5-5.5%. Off-plan in emerging districts like Creek Harbour projects 7-8% on completion.'), ep('investing'), ep('5'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Faq` (`id`, `question`, `answer`, `category`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('faq-seed-6'), ep('Do you offer property management?'), ep('Yes. Our in-house property management team handles tenant sourcing, rent collection, maintenance and renewals for an all-in fee of 5% of annual rent. We currently manage 480+ units on behalf of clients.'), ep('general'), ep('6'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Faq` (`id`, `question`, `answer`, `category`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('faq-seed-7'), ep('What languages does your team speak?'), ep('Our 12 senior advisors collectively speak English, Arabic, French, German, Italian, Russian, Spanish, Hindi, Urdu, Yoruba and Mandarin. We will match you with an advisor who speaks your language.'), ep('general'), ep('7'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Faq` (`id`, `question`, `answer`, `category`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('faq-seed-8'), ep('How do you ensure discretion?'), ep('We are ISO 27001 certified. All client data is encrypted at rest and in transit, access is role-based, and our advisors operate under strict NDAs. We never list client names publicly without explicit written consent.'), ep('general'), ep('8'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Faq: $count/8 inserted\n";

// HeroSlide: 5 records
$count = 0;
$sql = 'INSERT INTO `HeroSlide` (`id`, `order`, `heading1`, `heading2`, `heading3`, `subtitle`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrakbzkm0000she559t9usrb'), ep('0'), ep('Discover Dubai\'s most'), ep('extraordinary addresses'), NULL, ep('From apartments and villas in family-friendly communities to commercial offices, our portfolio spans every lifestyle and budget — guided by RERA-certified advisors who know Dubai inside-out.'), 1, ep('2026-07-07 11:25:46'), ep('2026-07-07 11:25:46')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `HeroSlide` (`id`, `order`, `heading1`, `heading2`, `heading3`, `subtitle`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrakbzkp0001she5eho4z041'), ep('1'), ep('Your Dream Property'), ep('Awaits in Dubai'), NULL, ep('Discover exceptional homes and investment opportunities with Royal Jubilant Real Estate. Your journey to finding the perfect property starts here.'), 1, ep('2026-07-07 11:25:46'), ep('2026-07-07 11:25:46')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `HeroSlide` (`id`, `order`, `heading1`, `heading2`, `heading3`, `subtitle`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrakbzkq0002she5lang4rx8'), ep('2'), ep('Premium Real Estate'), ep('Services in Dubai'), NULL, ep('Buy, sell, rent or invest in Off Plan properties with Dubai\'s trusted real estate broker. RERA-certified advisors, deep local knowledge, and a commitment to smoother transactions.'), 1, ep('2026-07-07 11:25:46'), ep('2026-07-07 11:25:46')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `HeroSlide` (`id`, `order`, `heading1`, `heading2`, `heading3`, `subtitle`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrakbzks0003she541g87hqs'), ep('3'), ep('Invest in Dubai\'s'), ep('Most Exciting'), ep('Off-Plan Projects'), ep('Pre-launch allocations from Emaar, DAMAC, Omniyat and Sobha with flexible payment plans. Invest in Dubai\'s most exciting upcoming developments before they hit the public market.'), 1, ep('2026-07-07 11:25:46'), ep('2026-07-07 11:25:46')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `HeroSlide` (`id`, `order`, `heading1`, `heading2`, `heading3`, `subtitle`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrakbzkt0004she57x8arrwt'), ep('4'), ep('Dubai\'s Premier'), ep('Luxury Property'), ep('Destination'), ep('A discreet portfolio of trophy assets above AED 15M — Signature Villas, branded penthouses and one-off architectural masterpieces. Available to qualified clients by private appointment.'), 1, ep('2026-07-07 11:25:46'), ep('2026-07-07 11:25:46')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  HeroSlide: $count/5 inserted\n";

// Video: 7 records
$count = 0;
$sql = 'INSERT INTO `Video` (`id`, `title`, `advisor`, `role`, `category`, `duration`, `thumbnail`, `description`, `videoUrl`, `youtubeUrl`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fmy001mpde5ac0nqki3'), ep('River Side Investment Opportunity by Damac'), ep('Muhammad Javed Zafar'), ep('Managing Director'), ep('Off-Plan'), ep('2:01'), ep('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80'), ep('An exclusive look at DAMAC\'s latest riverside development — investment potential, payment plans, and projected ROI.'), ep('/videos/river-side-investment-damac.mp4'), NULL, ep('1'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Video` (`id`, `title`, `advisor`, `role`, `category`, `duration`, `thumbnail`, `description`, `videoUrl`, `youtubeUrl`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fn0001npde5445loizl'), ep('Palm Jumeirah Market Update — Q2 2026'), ep('Muhammad Javed Zafar'), ep('Managing Director'), ep('Market Insights'), ep('4:32'), ep('https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80'), ep('Why Palm Jumeirah villa prices are up 18% year-on-year and where the next opportunities lie.'), NULL, NULL, ep('2'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Video` (`id`, `title`, `advisor`, `role`, `category`, `duration`, `thumbnail`, `description`, `videoUrl`, `youtubeUrl`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fn7001opde50lx38p7j'), ep('Off-Plan Investment Strategy — Creek Harbour'), ep('Muhammad Saleem Khan'), ep('Property Consultant'), ep('Off-Plan'), ep('6:15'), ep('https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=600&q=80'), ep('Projected rental yields, payment plans, and why Creek Harbour is the top pick for 2026 investors.'), NULL, NULL, ep('3'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Video` (`id`, `title`, `advisor`, `role`, `category`, `duration`, `thumbnail`, `description`, `videoUrl`, `youtubeUrl`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fn9001ppde52v68ag6g'), ep('Golden Visa Through Property Investment'), ep('Maria Raza'), ep('Administration Manager'), ep('Investor Guide'), ep('5:48'), ep('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80'), ep('Everything you need to know about the AED 2M Golden Visa route and eligible off-plan properties.'), NULL, NULL, ep('4'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Video` (`id`, `title`, `advisor`, `role`, `category`, `duration`, `thumbnail`, `description`, `videoUrl`, `youtubeUrl`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fnb001qpde5rjha6rd4'), ep('Dubai Hills Estate — Family Living ROI'), ep('Ahmad Ali'), ep('Property Consultant'), ep('Market Insights'), ep('3:56'), ep('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'), ep('Why Dubai Hills townhouses deliver the best family-living ROI in Dubai right now.'), NULL, NULL, ep('5'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Video` (`id`, `title`, `advisor`, `role`, `category`, `duration`, `thumbnail`, `description`, `videoUrl`, `youtubeUrl`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fnd001rpde5b453hy0d'), ep('Branded Residences — Are They Worth the Premium?'), ep('Maria Raza'), ep('Administration Manager'), ep('Off-Plan'), ep('7:22'), ep('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'), ep('Cavalli, Bugatti, Six Senses — we break down whether branded residences justify their 30% premium.'), NULL, NULL, ep('6'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Video` (`id`, `title`, `advisor`, `role`, `category`, `duration`, `thumbnail`, `description`, `videoUrl`, `youtubeUrl`, `order`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fnf001spde52p63cpob'), ep('Dubai Marina Rental Yields — 2026 Outlook'), ep('Awais Ali'), ep('Property Consultant'), ep('Investor Guide'), ep('4:10'), ep('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80'), ep('Short-term vs long-term rental yields in Dubai Marina — which strategy wins in 2026?'), NULL, NULL, ep('7'), 1, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Video: $count/7 inserted\n";

// SiteSetting: 64 records
$count = 0;
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7ef001bv8y5y8zgr0ad'), ep('hero.title'), ep('Discover Dubai\'s most extraordinary addresses.'), ep('hero'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7eg001cv8y5pb0j67nv'), ep('hero.subtitle'), ep('From apartments and villas in family-friendly communities to commercial offices, our portfolio spans every lifestyle and budget — guided by RERA-certified advisors who know Dubai inside-out.'), ep('hero'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7eg001dv8y5qpz5dnok'), ep('hero.badge'), ep('Dubai Property Advisory · Burjuman Business Tower'), ep('hero'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7eh001ev8y54mt9r5gg'), ep('company.phone'), ep('+971 4 327 8401'), ep('contact'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7ei001fv8y5kv3f8va2'), ep('company.email'), ep('info@royaljubilant.ae'), ep('contact'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7ek001gv8y5e7rf7y83'), ep('company.address'), ep('13th Floor, Office #54, Burjuman Business Tower, Dubai, UAE'), ep('contact'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7ek001hv8y509w31m3s'), ep('company.hours'), ep('Mon – Sat, 9am – 6pm'), ep('contact'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7el001iv8y53z7yg2mf'), ep('company.whatsapp'), ep('971524942329'), ep('contact'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7en001jv8y58p3fn166'), ep('stats.activeListings'), ep('240+'), ep('stats'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7en001kv8y5ocggtene'), ep('stats.categories'), ep('18'), ep('stats'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7eo001lv8y5rk60fg2k'), ep('stats.advisors'), ep('8'), ep('stats'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7eo001mv8y5tw5753yk'), ep('stats.years'), ep('10+'), ep('stats'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7eq001nv8y5yqs04kg4'), ep('social.facebook'), ep('https://www.facebook.com/profile.php?id=100077096168331'), ep('social'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7eq001ov8y5imu8zw1j'), ep('social.instagram'), ep('#'), ep('social'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7er001pv8y5iiq0lo21'), ep('social.tiktok'), ep('#'), ep('social'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7es001qv8y59ytnatqw'), ep('social.linkedin'), ep('#'), ep('social'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr5fs7es001rv8y5lomgvdqz'), ep('social.twitter'), ep('#'), ep('social'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flo0001pde59xqu4n3i'), ep('stats.aedClosed'), ep('2.4B'), ep('stats'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flr0004pde5nbs6wyzc'), ep('stats.rating'), ep('4.8'), ep('stats'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flu0009pde5wft074qr'), ep('hero.videoUrl'), ep('/dubai-skyline.mp4'), ep('hero'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flu000apde5871bq133'), ep('hero.overlayOpacity'), ep('85'), ep('hero'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flv000bpde5zsaiwhp3'), ep('hero.height'), ep('92vh'), ep('hero'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flv000cpde5c9rz0b7q'), ep('hero.slideInterval'), ep('11000'), ep('hero'), ep('2026-07-07 13:25:06')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flw000dpde5qsz7veq7'), ep('explore.eyebrow'), ep('Explore Property in Dubai'), ep('explore'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flw000epde5rxemlkpk'), ep('explore.title'), ep('Find Your Perfect Property'), ep('explore'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flx000fpde5k9bfgwxh'), ep('explore.subtitle'), ep('Royal Jubilant helps buyers, sellers, tenants and investors navigate Dubai real estate with clarity and confidence.'), ep('explore'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flx000gpde5ns8v97m9'), ep('agents.eyebrow'), ep('The Royal Jubilant Team'), ep('agents'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flx000hpde55a2hqtdm'), ep('agents.title'), ep('Meet Our Advisors'), ep('agents'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fly000ipde5697mzp29'), ep('agents.subtitle'), ep('Senior, multilingual and certified — our advisors serve clients across 9 markets with discreet, relationship-led counsel.'), ep('agents'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fly000jpde5k7ei5j2t'), ep('advice.eyebrow'), ep('Dubai through the eyes of a Royal Jubilant advisor'), ep('advice'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flz000kpde5r7zcb9jm'), ep('advice.title'), ep('Our Advice'), ep('advice'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flz000lpde5rmtrbo8f'), ep('advice.subtitle'), ep('Watch our advisors share market insights, investment strategies and exclusive development reviews.'), ep('advice'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1flz000mpde5satoexdb'), ep('newsletter.eyebrow'), ep('Monthly Market Brief'), ep('newsletter'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm0000npde5tsw4msj6'), ep('newsletter.title'), ep('The most important Dubai property data in your inbox.'), ep('newsletter'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm0000opde5hhk4vmx7'), ep('newsletter.subtitle'), ep('Join 12,000+ subscribers — fund managers, family offices and UHNW buyers.'), ep('newsletter'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm1000ppde5q20dzv7d'), ep('newsletter.button'), ep('Subscribe'), ep('newsletter'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm1000qpde5b8b97nu7'), ep('newsletter.placeholder'), ep('your@email.com'), ep('newsletter'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm2000rpde5x4099geo'), ep('footer.tagline'), ep('Discreet, research-led Dubai real estate advisory for HNW and institutional clients.'), ep('footer'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm3000spde5hasslq9j'), ep('footer.copyright'), ep('© 2026 Royal Jubilant Real Estate LLC. All rights reserved. RERA Brokerage BRK #87534.'), ep('footer'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm3000tpde51l065e13'), ep('footer.address'), ep('13th Floor, Office #54, Burjuman Business Tower, Dubai, UAE'), ep('footer'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm4000upde5jh6m55a8'), ep('footer.col1'), ep('{"title":"Buy & Rent","links":[{"label":"Properties for Rent","view":"rent"},{"label":"Properties for Sale","view":"buy"},{"label":"Commercial Real Estate","view":"commercial"},{"label":"Off-Plan Projects","view":"off-plan"},{"label":"Luxury Collection","view":"luxury"},{"label":"Latest Listings","view":"buy"}]}'), ep('footer'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm5000vpde5gh2vou50'), ep('footer.col2'), ep('{"title":"Communities","links":[{"label":"Palm Jumeirah","view":"communities"},{"label":"Downtown Dubai","view":"communities"},{"label":"Dubai Marina","view":"communities"},{"label":"Creek Harbour","view":"communities"},{"label":"Dubai Hills","view":"communities"},{"label":"Business Bay","view":"communities"}]}'), ep('footer'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm5000wpde54p2jzdmp'), ep('footer.col3'), ep('{"title":"Services","links":[{"label":"Property Valuation","view":"contact"},{"label":"Mortgage Advisory","view":"contact"},{"label":"Meet the Agents","view":"agents"},{"label":"Market Insights","view":"blog"},{"label":"Careers","view":"careers"},{"label":"Contact Us","view":"contact"}]}'), ep('footer'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm6000xpde5pz814xdo'), ep('footer.col4'), ep('{"title":"Company","links":[{"label":"About Us","view":"about"},{"label":"Our Story","view":"about"},{"label":"Our Advice","view":"advice"},{"label":"Client Reviews","view":"testimonials"},{"label":"FAQs","view":"faqs"},{"label":"Contact Us","view":"contact"}]}'), ep('footer'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fmg0016pde56jbqux5v'), ep('company.name'), ep('Royal Jubilant Real Estate LLC'), ep('contact'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fmm001cpde5y8osjzck'), ep('company.rera'), ep('BRK #87534'), ep('contact'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fmt001ipde5ofc4dz68'), ep('social.youtube'), ep('#'), ep('social'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fmu001jpde50grj70ih'), ep('reviews.google'), ep('https://www.google.com/search?q=Royal+Jubilant+Real+Estate+L.L.C+Reviews'), ep('reviews'), ep('2026-07-07 01:08:37')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fmv001kpde539vhz7uj'), ep('reviews.googleRating'), ep('4.7'), ep('reviews'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fmw001lpde5p0lmjtx2'), ep('reviews.googleCount'), ep('74'), ep('reviews'), ep('2026-07-07 01:08:37')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifh0000shtktbcr4u1u'), ep('offplan.about.eyebrow'), ep('Off-Plan Investment'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifk0001shtk6yb2ko2c'), ep('offplan.about.title'), ep('Dubai\'s leading Off Plan property experts'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifl0002shtk22hrk1up'), ep('offplan.about.subtitle'), ep('Dubai\'s residential real estate market recorded AED 139.1 billion in transactions in Q1 2026, with Off Plan properties accounting for 73% of all residential sales activity, according to Cavendish Maxwell. Flexible payment plans, developer incentives, and sustained investor demand continue to drive the Off Plan market. Whether you\'re investing for rental income, capital growth, a Golden Visa, or a future home, Royal Jubilant gives you early access to the highest-performing projects across the city.'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifm0003shtk1qyymwpr'), ep('offplan.about.button1'), ep('Browse Off Plan projects'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifn0004shtknwdkmaby'), ep('offplan.about.button2'), ep('Speak to a consultant'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifn0005shtk3s84xgkd'), ep('offplan.about.stat1Value'), ep('73%'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifo0006shtkbucet4cf'), ep('offplan.about.stat1Label'), ep('Off Plan share of residential sales (Q1 2026)'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifp0007shtkxaxh8cbn'), ep('offplan.about.stat2Value'), ep('AED 139.1B'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifq0008shtk39si7mtu'), ep('offplan.about.stat2Label'), ep('Total residential transactions (Q1 2026)'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifr0009shtkqa12e6cm'), ep('offplan.about.stat3Value'), ep('7-8%'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifr000ashtklof7157c'), ep('offplan.about.stat3Label'), ep('Projected rental yield on completion'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ifs000bshtkif3qcode'), ep('offplan.about.ctaTitle'), ep('Ready to explore Off Plan opportunities?'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmran4ift000cshtk3e26y789'), ep('offplan.about.ctaSubtitle'), ep('Get first-call access to pre-launch inventory from Emaar, DAMAC, Sobha, and more. Our RERA-certified advisors will guide you through every step.'), ep('offplan'), ep('2026-07-07 12:43:56')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SiteSetting` (`id`, `key`, `value`, `category`, `updatedAt`) VALUES (' . implode(", ", [ep('cmraolg120000sht08b0j6wp8'), ep('hero.videoSpeed'), ep('0.5'), ep('hero'), ep('2026-07-07 13:25:06')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  SiteSetting: $count/64 inserted\n";

// Lead: 1 records
$count = 0;
$sql = 'INSERT INTO `Lead` (`id`, `name`, `email`, `phone`, `whatsapp`, `source`, `intent`, `message`, `budget`, `propertyRef`, `community`, `status`, `assignedTo`, `notes`, `userId`, `propertyId`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrafqb1x0006sh0vu5ww2433'), ep('Kashif Mehmood'), ep('2minutesphysics@gmail.com'), ep('5668787687'), NULL, ep('viewing'), NULL, ep('hi iwant to meet u'), NULL, ep('RJ-970066'), NULL, ep('new'), ep('muhammad.naeem.zafar@royaljubilant.ae'), NULL, NULL, NULL, ep('2026-07-07 09:16:56'), ep('2026-07-07 09:23:28')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Lead: $count/1 inserted\n";

// CrmNote: 4 records
$count = 0;
$sql = 'INSERT INTO `CrmNote` (`id`, `agentId`, `leadId`, `note`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5hml5a000bv8zxk4q0l20o'), ep('cmr5hmkq90000v8zxdji56353'), NULL, ep('Initial call — client is relocating from London, looking for 5-bed villa in Palm Jumeirah with budget AED 25-30M.'), ep('2026-07-03 22:11:11')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `CrmNote` (`id`, `agentId`, `leadId`, `note`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5hml5a000cv8zx4m2v3nby'), ep('cmr5hmkq90000v8zxdji56353'), NULL, ep('Sent shortlist of 3 Signature Villas on Frond M, K, L. Awaiting feedback.'), ep('2026-07-03 22:11:11')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `CrmNote` (`id`, `agentId`, `leadId`, `note`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5hml5a000dv8zxinvus6ek'), ep('cmr5hmkq90000v8zxdji56353'), NULL, ep('Booked viewing for Saturday 2pm. Wife joining. Will bring title deed docs.'), ep('2026-07-03 22:11:11')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `CrmNote` (`id`, `agentId`, `leadId`, `note`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5hxyde0001v8ub9u4nld0m'), ep('cmr5hmkq90000v8zxdji56353'), NULL, ep('Test CRM note — verified working from agent portal'), ep('2026-07-03 22:20:01')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  CrmNote: $count/4 inserted\n";

// Commission: 3 records
$count = 0;
$sql = 'INSERT INTO `Commission` (`id`, `agentId`, `propertyRef`, `leadId`, `dealValue`, `commissionPct`, `commissionAmt`, `status`, `paidAt`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5hml570008v8zxznsesmjj'), ep('cmr5hmkq90000v8zxdji56353'), ep('RJ-PLM-001'), NULL, ep('28500000'), ep('2'), ep('570000'), ep('paid'), ep('2026-04-15 00:00:00'), ep('2026-07-03 22:11:11')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Commission` (`id`, `agentId`, `propertyRef`, `leadId`, `dealValue`, `commissionPct`, `commissionAmt`, `status`, `paidAt`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5hml570009v8zxtmwdjgal'), ep('cmr5hmkq90000v8zxdji56353'), ep('RJ-PLM-006'), NULL, ep('46800000'), ep('1.5'), ep('702000'), ep('invoiced'), NULL, ep('2026-07-03 22:11:11')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Commission` (`id`, `agentId`, `propertyRef`, `leadId`, `dealValue`, `commissionPct`, `commissionAmt`, `status`, `paidAt`, `createdAt`) VALUES (' . implode(", ", [ep('cmr5hml57000av8zxgym6nrod'), ep('cmr5hmkq90000v8zxdji56353'), ep('RJ-DWN-011'), NULL, ep('1650000'), ep('2'), ep('33000'), ep('pending'), NULL, ep('2026-07-03 22:11:11')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Commission: $count/3 inserted\n";

// ActivityLog: 8 records
$count = 0;
$sql = 'INSERT INTO `ActivityLog` (`id`, `userId`, `userName`, `userRole`, `action`, `entity`, `entityId`, `details`, `ipAddress`, `createdAt`) VALUES (' . implode(", ", [ep('cmra0djep0001pd4jinx2pw19'), ep('cmr5fs7c90000v8y5twc8nzc5'), ep('Royal Jubilant Admin'), ep('admin'), ep('upload'), ep('media'), ep('cmra0djef0000pd4jwrij6miu'), ep('Uploaded 1 image(s) to /agents'), ep('21.0.0.1'), ep('2026-07-07 02:07:06')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `ActivityLog` (`id`, `userId`, `userName`, `userRole`, `action`, `entity`, `entityId`, `details`, `ipAddress`, `createdAt`) VALUES (' . implode(", ", [ep('cmrafjn0u0001sh0v4x4qgmzx'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('Muhammad Naeem Zafar'), ep('agent'), ep('upload'), ep('media'), ep('cmrafjn0o0000sh0vyd02zmvu'), ep('Uploaded 1 image(s) to /avatars'), ep('21.0.0.1'), ep('2026-07-07 09:11:45')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `ActivityLog` (`id`, `userId`, `userName`, `userRole`, `action`, `entity`, `entityId`, `details`, `ipAddress`, `createdAt`) VALUES (' . implode(", ", [ep('cmrafjnd30002sh0v14105f4q'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('Muhammad Naeem Zafar'), ep('agent'), ep('update'), ep('user_profile'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('Updated profile: muhammad.naeem.zafar@royaljubilant.ae'), ep('21.0.0.1'), ep('2026-07-07 09:11:45')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `ActivityLog` (`id`, `userId`, `userName`, `userRole`, `action`, `entity`, `entityId`, `details`, `ipAddress`, `createdAt`) VALUES (' . implode(", ", [ep('cmrafjqrb0003sh0vbui4j71j'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('Muhammad Naeem Zafar'), ep('agent'), ep('update'), ep('user_profile'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('Updated profile: muhammad.naeem.zafar@royaljubilant.ae'), ep('21.0.0.1'), ep('2026-07-07 09:11:50')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `ActivityLog` (`id`, `userId`, `userName`, `userRole`, `action`, `entity`, `entityId`, `details`, `ipAddress`, `createdAt`) VALUES (' . implode(", ", [ep('cmraflo5i0005sh0vnl1rus89'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('Muhammad Naeem Zafar'), ep('agent'), ep('upload'), ep('media'), ep('cmraflo5f0004sh0vw4v1ihm0'), ep('Uploaded 1 image(s) to /properties'), ep('21.0.0.1'), ep('2026-07-07 09:13:20')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `ActivityLog` (`id`, `userId`, `userName`, `userRole`, `action`, `entity`, `entityId`, `details`, `ipAddress`, `createdAt`) VALUES (' . implode(", ", [ep('cmraiu58b0008sh0v2vdj7luy'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('Muhammad Naeem Zafar'), ep('agent'), ep('upload'), ep('media'), ep('cmraiu5840007sh0voc3ruc9u'), ep('Uploaded 1 image(s) to /properties'), ep('21.0.0.1'), ep('2026-07-07 10:43:54')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `ActivityLog` (`id`, `userId`, `userName`, `userRole`, `action`, `entity`, `entityId`, `details`, `ipAddress`, `createdAt`) VALUES (' . implode(", ", [ep('cmraiutvc000ash0vx786ep50'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('Muhammad Naeem Zafar'), ep('agent'), ep('upload'), ep('media'), ep('cmraiutv80009sh0vyl4gor4l'), ep('Uploaded 1 image(s) to /properties'), ep('21.0.0.1'), ep('2026-07-07 10:44:26')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `ActivityLog` (`id`, `userId`, `userName`, `userRole`, `action`, `entity`, `entityId`, `details`, `ipAddress`, `createdAt`) VALUES (' . implode(", ", [ep('cmraiuula000csh0v89lrk6n9'), ep('cmr5hmkuc0002v8zxu20gshtr'), ep('Muhammad Naeem Zafar'), ep('agent'), ep('upload'), ep('media'), ep('cmraiuul5000bsh0vvevdkd1m'), ep('Uploaded 1 image(s) to /properties'), ep('21.0.0.1'), ep('2026-07-07 10:44:27')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  ActivityLog: $count/8 inserted\n";

// MediaFile: 6 records
$count = 0;
$sql = 'INSERT INTO `MediaFile` (`id`, `filename`, `url`, `type`, `folder`, `size`, `altTag`, `caption`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmra0djef0000pd4jwrij6miu'), ep('1783390026612-c1lnfblw.webp'), ep('/uploads/agents/1783390026612-c1lnfblw.webp'), ep('image'), ep('agents'), ep('10972'), ep('57e87a4da54043e290ee7811fd05319f-'), NULL, NULL, ep('2026-07-07 02:07:06'), ep('2026-07-07 02:07:06')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MediaFile` (`id`, `filename`, `url`, `type`, `folder`, `size`, `altTag`, `caption`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrafjn0o0000sh0vyd02zmvu'), ep('1783415505418-2tu0uxi0.webp'), ep('/uploads/avatars/1783415505418-2tu0uxi0.webp'), ep('image'), ep('avatars'), ep('10602'), ep('b5bf48368fd247b7a8271da000d8bb14-'), NULL, NULL, ep('2026-07-07 09:11:45'), ep('2026-07-07 09:11:45')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MediaFile` (`id`, `filename`, `url`, `type`, `folder`, `size`, `altTag`, `caption`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmraflo5f0004sh0vw4v1ihm0'), ep('1783415600255-ecnjfocw.jpg'), ep('/uploads/properties/1783415600255-ecnjfocw.jpg'), ep('image'), ep('properties'), ep('946998'), ep('Apartment_'), NULL, NULL, ep('2026-07-07 09:13:20'), ep('2026-07-07 09:13:20')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MediaFile` (`id`, `filename`, `url`, `type`, `folder`, `size`, `altTag`, `caption`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmraiu5840007sh0voc3ruc9u'), ep('1783421034478-3ai14azv.jpg'), ep('/uploads/properties/1783421034478-3ai14azv.jpg'), ep('image'), ep('properties'), ep('946998'), ep('Apartment_'), NULL, NULL, ep('2026-07-07 10:43:54'), ep('2026-07-07 10:43:54')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MediaFile` (`id`, `filename`, `url`, `type`, `folder`, `size`, `altTag`, `caption`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmraiutv80009sh0vyl4gor4l'), ep('1783421066418-8ku1lpvp.webp'), ep('/uploads/properties/1783421066418-8ku1lpvp.webp'), ep('image'), ep('properties'), ep('30208'), ep('6266f4efa1854d9e90a350794efeac82-'), NULL, NULL, ep('2026-07-07 10:44:26'), ep('2026-07-07 10:44:26')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MediaFile` (`id`, `filename`, `url`, `type`, `folder`, `size`, `altTag`, `caption`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmraiuul5000bsh0vvevdkd1m'), ep('1783421067351-n7fpajj4.webp'), ep('/uploads/properties/1783421067351-n7fpajj4.webp'), ep('image'), ep('properties'), ep('102060'), ep('bc1934ffa1be453b996e6702ece76fe9-'), NULL, NULL, ep('2026-07-07 10:44:27'), ep('2026-07-07 10:44:27')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  MediaFile: $count/6 inserted\n";

// SeoMeta: 8 records
$count = 0;
$sql = 'INSERT INTO `SeoMeta` (`id`, `pageSlug`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `twitterCard`, `keywords`, `structuredData`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm7000ypde55sm9wcv9'), ep('home'), ep('Royal Jubilant Real Estate LLC | Dubai Luxury Property Advisory'), ep('Dubai\'s discreet, research-led real estate advisory. Browse 240+ active listings across Palm Jumeirah, Downtown, Dubai Hills and more.'), NULL, NULL, NULL, NULL, ep('summary_large_image'), NULL, NULL, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SeoMeta` (`id`, `pageSlug`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `twitterCard`, `keywords`, `structuredData`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm8000zpde5gg7f5byp'), ep('rent'), ep('Properties for Rent in Dubai | Royal Jubilant Real Estate'), ep('Browse apartments, villas and townhouses for rent across Dubai\'s top communities.'), NULL, NULL, NULL, NULL, ep('summary_large_image'), NULL, NULL, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SeoMeta` (`id`, `pageSlug`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `twitterCard`, `keywords`, `structuredData`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm90010pde5tjsts18n'), ep('buy'), ep('Properties for Sale in Dubai | Royal Jubilant Real Estate'), ep('Browse 1,200+ active sale listings across Dubai — from beachfront villas to branded penthouses.'), NULL, NULL, NULL, NULL, ep('summary_large_image'), NULL, NULL, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SeoMeta` (`id`, `pageSlug`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `twitterCard`, `keywords`, `structuredData`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fm90011pde5rzzq4b5u'), ep('commercial'), ep('Commercial Real Estate in Dubai | Royal Jubilant'), ep('Grade-A offices, retail and whole buildings across Business Bay, DIFC, JLT and Sheikh Zayed Road.'), NULL, NULL, NULL, NULL, ep('summary_large_image'), NULL, NULL, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SeoMeta` (`id`, `pageSlug`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `twitterCard`, `keywords`, `structuredData`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fma0012pde5z6vp4pdv'), ep('off-plan'), ep('Off-Plan Projects in Dubai | Royal Jubilant Real Estate'), ep('Pre-launch allocations from Emaar, DAMAC, Omniyat and Sobha with flexible payment plans.'), NULL, NULL, NULL, NULL, ep('summary_large_image'), NULL, NULL, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SeoMeta` (`id`, `pageSlug`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `twitterCard`, `keywords`, `structuredData`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fmb0013pde5j3a3z96u'), ep('agents'), ep('Meet Our Advisors | Royal Jubilant Real Estate'), ep('Senior, multilingual and RERA-certified advisors serving clients across 9 markets.'), NULL, NULL, NULL, NULL, ep('summary_large_image'), NULL, NULL, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SeoMeta` (`id`, `pageSlug`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `twitterCard`, `keywords`, `structuredData`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fmd0014pde53cdsnx4b'), ep('about'), ep('Our Story | Royal Jubilant Real Estate LLC'), ep('Discreet, research-led Dubai real estate advisory founded in 2014.'), NULL, NULL, NULL, NULL, ep('summary_large_image'), NULL, NULL, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `SeoMeta` (`id`, `pageSlug`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `twitterCard`, `keywords`, `structuredData`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmr9w1fmf0015pde5yzabb5d2'), ep('contact'), ep('Contact Us | Royal Jubilant Real Estate'), ep('Get in touch with our team. Burjuman Business Tower, Dubai. +971 4 327 8401.'), NULL, NULL, NULL, NULL, ep('summary_large_image'), NULL, NULL, ep('2026-07-07 00:05:43'), ep('2026-07-07 00:05:43')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  SeoMeta: $count/8 inserted\n";

// MenuItem: 45 records
$count = 0;
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9dg0000ttu7s3n23jn9'), ep('Rent'), ep(''), NULL, NULL, NULL, NULL, ep('0'), ep('Building'), ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9dj0001ttu7dg8vnihe'), ep('Residential'), ep(''), ep('rent'), ep('Annual long-term rentals'), NULL, ep('cmrb8x9dg0000ttu7s3n23jn9'), ep('0'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9dk0002ttu7adp3u74s'), ep('Rooms for Rent'), ep(''), ep('rent-rooms'), ep('Shared rooms & bed spaces'), NULL, ep('cmrb8x9dg0000ttu7s3n23jn9'), ep('1'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9dm0003ttu7ohjizcc3'), ep('Holiday Homes'), ep(''), ep('rent-holiday'), ep('Furnished vacation rentals'), NULL, ep('cmrb8x9dg0000ttu7s3n23jn9'), ep('3'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9do0004ttu7l1vj0yk6'), ep('Monthly Short Term'), ep(''), ep('rent-monthly'), ep('1-3 month stays'), NULL, ep('cmrb8x9dg0000ttu7s3n23jn9'), ep('4'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9dp0005ttu777ertb59'), ep('Daily Short Term'), ep(''), ep('rent-daily'), ep('Daily & weekly stays'), NULL, ep('cmrb8x9dg0000ttu7s3n23jn9'), ep('5'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9dq0006ttu7s1f0js11'), ep('Buy'), ep(''), NULL, NULL, NULL, NULL, ep('1'), ep('Home'), ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ds0007ttu794ev700f'), ep('All Properties for Sale'), ep(''), ep('buy'), ep('Browse 1,200+ active listings'), NULL, ep('cmrb8x9dq0006ttu7s1f0js11'), ep('0'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9dt0008ttu76uggxkca'), ep('Villas & Mansions'), ep(''), ep('buy'), ep('5+ bedrooms across prime communities'), NULL, ep('cmrb8x9dq0006ttu7s1f0js11'), ep('1'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9du0009ttu70lu0n6gk'), ep('Penthouses'), ep(''), ep('buy'), ep('Top-floor branded residences'), NULL, ep('cmrb8x9dq0006ttu7s1f0js11'), ep('3'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9dv000attu73tudw38t'), ep('Apartments'), ep(''), ep('buy'), ep('Studios to 4-bedrooms'), NULL, ep('cmrb8x9dq0006ttu7s1f0js11'), ep('4'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9dw000bttu7o8dsffjg'), ep('Townhouses'), ep(''), ep('buy'), ep('Family-friendly gated communities'), NULL, ep('cmrb8x9dq0006ttu7s1f0js11'), ep('5'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9dx000cttu76ynooajw'), ep('Luxury Collection'), ep(''), ep('luxury'), ep('Curated trophy assets AED 15M+'), ep('Premium'), ep('cmrb8x9dq0006ttu7s1f0js11'), ep('6'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9e2000gttu79dj0ykxd'), ep('Off Plan'), ep(''), NULL, NULL, NULL, NULL, ep('4'), ep('HardHat'), ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9e5000httu7n7fnj5oh'), ep('About Off Plan'), ep(''), ep('about-offplan'), ep('Market insights & investment guide'), NULL, ep('cmrb8x9e2000gttu79dj0ykxd'), ep('0'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9e6000ittu7kccugg6m'), ep('Off Plan Properties'), ep(''), ep('off-plan'), ep('Browse all off-plan projects'), NULL, ep('cmrb8x9e2000gttu79dj0ykxd'), ep('1'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9e7000jttu7lj1eegjr'), ep('Developers'), ep(''), ep('developers'), ep('Dubai\'s leading master developers'), NULL, ep('cmrb8x9e2000gttu79dj0ykxd'), ep('3'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9e8000kttu7l501yk18'), ep('About Us'), ep(''), NULL, NULL, NULL, NULL, ep('5'), ep('Users'), ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9e9000lttu7dhklsvez'), ep('Our Story'), ep(''), ep('story'), ep('Timeline, milestones & company journey'), NULL, ep('cmrb8x9e8000kttu7l501yk18'), ep('0'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:59')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ea000mttu7kg28v2l4'), ep('Why Choose Us'), ep(''), ep('about'), ep('8 reasons to choose Royal Jubilant'), NULL, ep('cmrb8x9e8000kttu7l501yk18'), ep('1'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:59')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9eb000nttu7i9d177yr'), ep('Our Team'), ep(''), ep('agents'), ep('Meet our RERA-certified advisors'), NULL, ep('cmrb8x9e8000kttu7l501yk18'), ep('3'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ec000ottu7l4t83glf'), ep('Our Advice'), ep(''), ep('advice'), ep('Advisor video insights & market updates'), NULL, ep('cmrb8x9e8000kttu7l501yk18'), ep('4'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ed000pttu7aunijzoj'), ep('Client Reviews'), ep(''), ep('testimonials'), ep('What our clients say about us'), NULL, ep('cmrb8x9e8000kttu7l501yk18'), ep('5'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ee000qttu7dgosf1pn'), ep('Careers'), ep(''), ep('careers'), ep('Join our advisory team'), NULL, ep('cmrb8x9e8000kttu7l501yk18'), ep('6'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9eg000rttu7m8fxksuw'), ep('Contact Us'), ep(''), ep('contact'), ep('Get in touch with our team'), NULL, ep('cmrb8x9e8000kttu7l501yk18'), ep('7'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9eh000sttu7or8o5clt'), ep('More'), ep(''), NULL, NULL, NULL, NULL, ep('6'), ep('ChevronDown'), ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ej000tttu7qivufp7s'), ep('Communities'), ep(''), ep('communities'), ep('Browse Dubai neighbourhoods'), NULL, ep('cmrb8x9eh000sttu7or8o5clt'), ep('1'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:38:31')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ek000uttu7njfi8erb'), ep('Rental Yield Calculator'), ep(''), ep('calc-yield'), ep('Calculate your rental ROI'), NULL, ep('cmrb8x9eh000sttu7or8o5clt'), ep('2'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:38:31')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9el000vttu7q1qcrhkk'), ep('Buy vs Rent Calculator'), ep(''), ep('calc-buyrent'), ep('Should you buy or rent?'), NULL, ep('cmrb8x9eh000sttu7or8o5clt'), ep('4'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:38:31')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9em000wttu78hoanywj'), ep('Market Insights'), ep(''), ep('blog'), ep('Quarterly indices & research notes'), NULL, ep('cmrb8x9eh000sttu7or8o5clt'), ep('5'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:38:31')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9eo000xttu77k6262y4'), ep('FAQs'), ep(''), ep('faqs'), ep('Common questions answered'), NULL, ep('cmrb8x9eh000sttu7or8o5clt'), ep('6'), NULL, ep('main'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-12 19:38:31')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9er000yttu7dsmkvzdt'), ep('About Us'), ep(''), ep('about'), NULL, NULL, NULL, ep('0'), NULL, ep('footer'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9es000zttu71e1z79o7'), ep('Our Story'), ep(''), ep('about'), NULL, NULL, NULL, ep('1'), NULL, ep('footer'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9et0010ttu7mrpwvyzn'), ep('Our Advice'), ep(''), ep('advice'), NULL, NULL, NULL, ep('2'), NULL, ep('footer'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9eu0011ttu7y93e1j3a'), ep('Client Reviews'), ep(''), ep('testimonials'), NULL, NULL, NULL, ep('3'), NULL, ep('footer'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9eu0012ttu7q0pw8i4q'), ep('FAQs'), ep(''), ep('faqs'), NULL, NULL, NULL, ep('4'), NULL, ep('footer'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ev0013ttu7i7sx4lhz'), ep('Rent'), ep(''), ep('rent'), NULL, NULL, NULL, ep('5'), NULL, ep('footer'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ew0014ttu73svlbztl'), ep('Buy'), ep(''), ep('buy'), NULL, NULL, NULL, ep('6'), NULL, ep('footer'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ew0015ttu79668m1y2'), ep('Off Plan'), ep(''), ep('off-plan'), NULL, NULL, NULL, ep('7'), NULL, ep('footer'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ex0016ttu76ducq2vl'), ep('Commercial'), ep(''), ep('commercial-rent'), NULL, NULL, NULL, ep('8'), NULL, ep('footer'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb8x9ey0017ttu76upuwlgh'), ep('Contact'), ep(''), ep('contact'), NULL, NULL, NULL, ep('9'), NULL, ep('footer'), 1, ep('2026-07-07 22:54:09'), ep('2026-07-07 22:54:09')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmri6mba10000rctv6aznscly'), ep('Commercial'), ep(''), ep('commercial'), NULL, NULL, NULL, ep('2'), ep('Building2'), ep('main'), 1, ep('2026-07-12 19:24:03'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmri6mba30001rctvzqj7urz0'), ep('Commercial Property for Rent'), ep(''), ep('commercial-rent'), ep('Offices, retail & bulk leases'), NULL, ep('cmri6mba10000rctv6aznscly'), ep('0'), NULL, ep('main'), 1, ep('2026-07-12 19:24:03'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmri6mba40002rctvvadmzwzi'), ep('Commercial Property for Sale'), ep(''), ep('commercial-sale'), ep('Investment-grade commercial real estate'), NULL, ep('cmri6mba10000rctv6aznscly'), ep('1'), NULL, ep('main'), 1, ep('2026-07-12 19:24:03'), ep('2026-07-12 19:24:03')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `MenuItem` (`id`, `label`, `url`, `view`, `desc`, `badge`, `parentId`, `order`, `icon`, `menu`, `visible`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmri74x0h0000rcov5mlbbwcp'), ep('AI Powered Real Estate'), ep(''), ep('ai-powered'), ep('Meet RJ AI — your 24/7 concierge'), NULL, ep('cmrb8x9eh000sttu7or8o5clt'), ep('0'), NULL, ep('main'), 1, ep('2026-07-12 19:38:31'), ep('2026-07-12 19:38:31')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  MenuItem: $count/45 inserted\n";

// LandingPage: 4 records
$count = 0;
$sql = 'INSERT INTO `LandingPage` (`id`, `title`, `slug`, `headline`, `subheadline`, `body`, `heroImage`, `ctaText`, `ctaLink`, `seoTitle`, `seoDescription`, `status`, `publishedAt`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb9d9g40000ttbzg7z2a2cc'), ep('Emaar Creek Harbour Launch — Q3 2026'), ep('emaar-creek-harbour-launch'), ep('Creek Harbour\'s Latest Waterfront Tower'), ep('Pre-launch allocations now open. 1-3 bedroom residences from AED 1.4M. Projected 8-10% rental yield. Handover 2027.'), ep('
<h2>The Opportunity</h2>
<p>Emaar\'s newest launch at Dubai Creek Harbour represents the most anticipated off-plan release of 2026. Situated on the prime waterfront promenade, the tower offers panoramic views of the Dubai Creek and the iconic Ras Al Khor Wildlife Sanctuary — home to pink flamingos year-round.</p>
<p>Pre-launch pricing starts at <strong>AED 1.4M for 1-bedroom</strong>, <strong>AED 2.3M for 2-bedroom</strong>, and <strong>AED 3.8M for 3-bedroom</strong> residences — a 12-15% discount to expected launch pricing.</p>

<h2>Why Creek Harbour?</h2>
<ul>
  <li><strong>Capital Growth:</strong> Creek Harbour prices have appreciated 22% YoY since 2024, outperforming every other Dubai master community</li>
  <li><strong>Rental Demand:</strong> 1BR units rent for AED 95,000-110,000/year — a 7-8% gross yield</li>
  <li><strong>Infrastructure:</strong> Direct metro connectivity (2027), 10 minutes to DOWNTOWN, 15 to DXB airport</li>
  <li><strong>Lifestyle:</strong> 6km promenade, 4.5km canal, yacht club, central park, retail boulevard</li>
</ul>

<h2>Payment Plan</h2>
<p>A flexible 60/40 post-handover payment plan is available:</p>
<ul>
  <li><strong>20%</strong> — Booking (with 4% Oqood registration)</li>
  <li><strong>40%</strong> — During construction (10% every 6 months)</li>
  <li><strong>40%</strong> — Post-handover (1 year after handover)</li>
</ul>
<p>This structure lets investors secure the asset with just 20% down and benefit from capital appreciation during the 24-month construction window.</p>

<h2>Projected Returns</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
  <thead>
    <tr style="background:#0A1F44;color:white;">
      <th style="padding:0.75rem;text-align:left;">Unit Type</th>
      <th style="padding:0.75rem;text-align:left;">Launch Price</th>
      <th style="padding:0.75rem;text-align:left;">Expected Handover Value</th>
      <th style="padding:0.75rem;text-align:left;">Annual Rental Yield</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">1 Bedroom</td>
      <td style="padding:0.75rem;">AED 1.4M</td>
      <td style="padding:0.75rem;">AED 1.7M (+21%)</td>
      <td style="padding:0.75rem;">7.5%</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">2 Bedroom</td>
      <td style="padding:0.75rem;">AED 2.3M</td>
      <td style="padding:0.75rem;">AED 2.8M (+22%)</td>
      <td style="padding:0.75rem;">7.8%</td>
    </tr>
    <tr>
      <td style="padding:0.75rem;">3 Bedroom</td>
      <td style="padding:0.75rem;">AED 3.8M</td>
      <td style="padding:0.75rem;">AED 4.6M (+21%)</td>
      <td style="padding:0.75rem;">8.0%</td>
    </tr>
  </tbody>
</table>

<h2>Golden Visa Eligibility</h2>
<p>Investments of AED 2M+ qualify for the 10-year UAE Golden Visa — covering the investor, spouse, and children under 18. Our team manages the full visa application process in-house at no additional cost.</p>

<h2>Why Royal Jubilant?</h2>
<p>As an authorised Emaar channel partner, Royal Jubilant secures <strong>first-call allocations 12-24 months ahead of public release</strong>. Our clients access pre-launch pricing, flexible payment plans, and dedicated after-sales support — including tenant placement, property management, and resale services.</p>

<h2>Next Steps</h2>
<p>Pre-launch allocations are limited to 8 units per broker. <strong>Register your interest below</strong> to receive the full brochure, floor plans, and a private consultation with our Creek Harbour specialist advisor.</p>
'), ep('https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80'), ep('Register Your Interest'), ep('#lead-form'), ep('Emaar Creek Harbour Off-Plan Launch 2026 | Royal Jubilant'), ep('Pre-launch access to Emaar\'s newest Creek Harbour waterfront tower. 1-3BR from AED 1.4M. 8-10% projected yield. Handover 2027.'), ep('published'), ep('2026-07-07 23:06:36'), ep('2026-07-07 23:06:36'), ep('2026-07-07 23:06:36')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `LandingPage` (`id`, `title`, `slug`, `headline`, `subheadline`, `body`, `heroImage`, `ctaText`, `ctaLink`, `seoTitle`, `seoDescription`, `status`, `publishedAt`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb9d9gd0001ttbz445d2bms'), ep('Palm Jumeirah Villa Investment Guide 2026'), ep('palm-jumeirah-villa-investment'), ep('Why Palm Jumeirah Villas Are 2026\'s Top Trophy Asset'), ep('18% YoY price growth. AED 8M-50M range. Limited supply of 1,400 Signature Villas. Get the full investment thesis.'), ep('
<h2>The Palm Jumeirah Advantage</h2>
<p>Palm Jumeirah remains Dubai\'s most iconic address — and 2026 is shaping up to be its strongest year yet. With only 1,400 Signature Villas ever to be built and zero new supply in the pipeline, prices have appreciated <strong>18% year-on-year</strong>, driven by UHNW buyers from the UK, India, Russia, and the GCC.</p>

<h2>Market Performance</h2>
<p>According to our Q1 2026 transaction data:</p>
<ul>
  <li><strong>Average villa price:</strong> AED 18.5M (up from AED 15.7M in Q1 2025)</li>
  <li><strong>Price per sqft:</strong> AED 3,200-4,800 depending on frond position</li>
  <li><strong>Average days on market:</strong> 47 days (down from 92 days in 2024)</li>
  <li><strong>Cash buyer percentage:</strong> 68% (vs 41% Dubai average)</li>
  <li><strong>Rental yield:</strong> 5.0-5.8% (lower than off-plan, but capital appreciation more than compensates)</li>
</ul>

<h2>Three Investment Strategies</h2>

<h3>1. Capital Appreciation Play (3-5 year hold)</h3>
<p>Buy a frond villa at today\'s prices, hold for 3-5 years, and sell for 35-50% profit. Best for investors with cash to deploy and patience to wait. Target fronds: <strong>Frond M, K, L</strong> (best beach quality and privacy).</p>

<h3>2. Short-Term Rental (Holiday Home)</h3>
<p>Convert to a licensed holiday home and earn AED 1.2M-2.5M/year in nightly rentals. Yields of 8-12% are achievable during peak season (Nov-Mar). Requires a DST holiday home licence and a property manager — both of which we provide in-house.</p>

<h3>3. Long-Term Family Let (Stable Cash Flow)</h3>
<p>Lease to a high-net-worth expat family on a 1-3 year contract. Lower yield (5-5.8%) but predictable income and zero void risk. Royal Jubilant manages the entire tenancy lifecycle.</p>

<h2>Villa Types & Pricing</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
  <thead>
    <tr style="background:#0A1F44;color:white;">
      <th style="padding:0.75rem;text-align:left;">Type</th>
      <th style="padding:0.75rem;text-align:left;">Plot Size</th>
      <th style="padding:0.75rem;text-align:left;">Beds</th>
      <th style="padding:0.75rem;text-align:left;">Price Range</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Garden Villa</td>
      <td style="padding:0.75rem;">7,000 sqft</td>
      <td style="padding:0.75rem;">4</td>
      <td style="padding:0.75rem;">AED 8M - 12M</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Signature Villa</td>
      <td style="padding:0.75rem;">13,000 sqft</td>
      <td style="padding:0.75rem;">5</td>
      <td style="padding:0.75rem;">AED 15M - 25M</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Canal Cove Villa</td>
      <td style="padding:0.75rem;">18,000 sqft</td>
      <td style="padding:0.75rem;">6</td>
      <td style="padding:0.75rem;">AED 25M - 40M</td>
    </tr>
    <tr>
      <td style="padding:0.75rem;">Custom Frond Mansion</td>
      <td style="padding:0.75rem;">26,000+ sqft</td>
      <td style="padding:0.75rem;">7+</td>
      <td style="padding:0.75rem;">AED 40M - 80M+</td>
    </tr>
  </tbody>
</table>

<h2>Why Royal Jubilant for Palm Villas?</h2>
<p>Our Palm Jumeirah specialist team has closed <strong>AED 280M+ in Palm villa transactions since 2024</strong> — including 11 Signature Villas and 4 custom mansions. We maintain an off-market pipeline of <strong>15+ villas not listed on any public portal</strong>, accessible exclusively to our qualified clients.</p>
<p>Our advisory covers:</p>
<ul>
  <li>Off-market villa sourcing and private viewings</li>
  <li>Negotiation (we typically achieve 4-7% below asking)</li>
  <li>DLD registration and Oqood transfer</li>
  <li>Renovation and interior design referrals</li>
  <li>Holiday home licensing and property management</li>
  <li>Resale and exit strategy planning</li>
</ul>

<h2>Next Steps</h2>
<p>Whether you\'re seriously considering a Palm villa purchase or just exploring the market — book a confidential consultation with our Palm Jumeirah specialist. We\'ll share current off-market opportunities, recent transaction comps, and a tailored investment thesis based on your budget and goals.</p>
'), ep('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'), ep('Book a Private Consultation'), ep('#lead-form'), ep('Palm Jumeirah Villa Investment Guide 2026 | Royal Jubilant'), ep('Comprehensive investment guide to Palm Jumeirah villas. 18% YoY growth, 5-6% yields, limited supply of 1,400 Signature Villas.'), ep('published'), ep('2026-07-07 23:06:36'), ep('2026-07-07 23:06:36'), ep('2026-07-07 23:06:36')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `LandingPage` (`id`, `title`, `slug`, `headline`, `subheadline`, `body`, `heroImage`, `ctaText`, `ctaLink`, `seoTitle`, `seoDescription`, `status`, `publishedAt`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb9d9gf0002ttbzc6xwk14g'), ep('Golden Visa Through Property Investment — Complete Guide'), ep('golden-visa-property-guide'), ep('Get a 10-Year UAE Golden Visa Through Property Investment'), ep('Invest AED 2M+ in Dubai real estate and secure residency for you, your spouse, and children. Full process explained.'), ep('
<h2>What Is the UAE Golden Visa?</h2>
<p>The UAE Golden Visa is a <strong>10-year renewable residency visa</strong> granted to investors, entrepreneurs, scientists, and exceptional talents. The real estate route — introduced in 2022 and updated in 2024 — allows foreign nationals to obtain Golden Visa residency by investing a minimum of <strong>AED 2,000,000 in Dubai property</strong>.</p>
<p>Unlike the 2-year property investor visa, the Golden Visa:</p>
<ul>
  <li>Does not require the property to be mortgaged-free (for cash purchases)</li>
  <li>Covers the investor, spouse, and children of any age (no 18-year age limit)</li>
  <li>Allows unlimited time outside the UAE without losing residency</li>
  <li>Includes an Emirates ID, driving licence, and UAE bank account</li>
  <li>Permits 100% foreign business ownership</li>
</ul>

<h2>Eligibility Criteria</h2>
<p>To qualify for the Golden Visa through real estate, you must meet <strong>one</strong> of these investment thresholds:</p>

<h3>Option 1: Cash Purchase (AED 2M+)</h3>
<p>Buy one or more properties with a total value of at least AED 2,000,000 — fully paid in cash (no mortgage). This is the simplest and most common route.</p>

<h3>Option 2: Off-Plan + Mortgage (AED 2M+ equity)</h3>
<p>If you\'ve purchased an off-plan property with a mortgage, you qualify based on the <strong>equity portion you\'ve paid</strong> — not the total property value. For example, if you\'ve paid AED 2M in instalments on a AED 5M off-plan villa, you\'re eligible.</p>

<h3>Option 3: Multiple Properties (Combined AED 2M+)</h3>
<p>You can combine multiple properties — residential, commercial, or mixed — to reach the AED 2M threshold. All properties must be in Dubai and registered with DLD.</p>

<h2>Eligible Property Types</h2>
<ul>
  <li><strong>Residential:</strong> Apartments, villas, townhouses, penthouses (ready or off-plan)</li>
  <li><strong>Commercial:</strong> Offices, retail, warehouses</li>
  <li><strong>Mixed-use:</strong> Buildings with both residential and commercial units</li>
  <li><strong>Industrial:</strong> Factories, labour camps, industrial land</li>
</ul>
<p><strong>Note:</strong> The property must be retained for the visa duration. Selling it forfeits the visa (though you can replace it with another qualifying property).</p>

<h2>The 5-Step Process</h2>
<ol>
  <li><strong>Property Selection:</strong> Choose an eligible property with our advisory team. We negotiate the best price and structure the purchase for visa eligibility.</li>
  <li><strong>Purchase & DLD Registration:</strong> Complete the transaction, register with Dubai Land Department (1-2 weeks), and receive your Title Deed.</li>
  <li><strong>Eligibility Letter:</strong> Apply for a Golden Visa eligibility letter from DLD (3-5 working days). This confirms your investment qualifies.</li>
  <li><strong>Medical & Biometrics:</strong> Undergo a medical fitness test and provide biometrics at an authorised centre (1 day).</li>
  <li><strong>Visa Stamping:</strong> Submit the eligibility letter, medical, and supporting documents to ICP. Receive your Emirates ID and visa stamping in 7-10 working days.</li>
</ol>
<p><strong>Total processing time:</strong> 3-5 weeks from property purchase to visa issuance.</p>

<h2>Cost Breakdown</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
  <thead>
    <tr style="background:#0A1F44;color:white;">
      <th style="padding:0.75rem;text-align:left;">Item</th>
      <th style="padding:0.75rem;text-align:left;">Cost (AED)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">DLD Eligibility Letter</td>
      <td style="padding:0.75rem;">4,000</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Medical Fitness Test</td>
      <td style="padding:0.75rem;">700 (standard) / 2,500 (express)</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Emirates ID (10 years)</td>
      <td style="padding:0.75rem;">1,000</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Golden Visa Application Fee</td>
      <td style="padding:0.75rem;">4,000</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Visa Stamping & Processing</td>
      <td style="padding:0.75rem;">1,500</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Medical Insurance (annual)</td>
      <td style="padding:0.75rem;">1,500 - 5,000</td>
    </tr>
    <tr>
      <td style="padding:0.75rem;font-weight:600;">Total (excluding property)</td>
      <td style="padding:0.75rem;font-weight:600;">AED 12,700 - 18,200</td>
    </tr>
  </tbody>
</table>

<h2>Family Coverage</h2>
<p>The Golden Visa covers:</p>
<ul>
  <li><strong>Spouse:</strong> Full 10-year residency, can work in the UAE</li>
  <li><strong>Children:</strong> Sons of any age (no 18-year cut-off), unmarried daughters of any age</li>
  <li><strong>Parents:</strong> Can be sponsored on a 10-year long-term visit visa</li>
  <li><strong>Domestic staff:</strong> Up to 3 sponsored on standard labour visas</li>
</ul>

<h2>Why Use Royal Jubilant?</h2>
<p>As a full-service Golden Visa property advisor, we handle the entire process end-to-end:</p>
<ul>
  <li><strong>Property selection:</strong> Curated list of AED 2M+ properties optimised for visa eligibility AND investment return</li>
  <li><strong>Negotiation:</strong> We secure 4-7% below asking on average</li>
  <li><strong>DLD & ICP liaison:</strong> We handle all government interactions on your behalf</li>
  <li><strong>Family sponsorship:</strong> We process spouse and children visas in parallel</li>
  <li><strong>Bank account opening:</strong> Introduction to UAE banks for personal and business accounts</li>
  <li><strong>After-care:</strong> Property management, tenant placement, and renewal reminders</li>
</ul>
<p>We charge <strong>no visa processing fees</strong> — our income comes only from the standard real-estate commission paid by the seller.</p>

<h2>Next Steps</h2>
<p>Book a free eligibility assessment below. We\'ll review your situation, recommend qualifying properties in your budget, and outline a personalised path to UAE residency.</p>
'), ep('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80'), ep('Get a Free Eligibility Assessment'), ep('#lead-form'), ep('UAE Golden Visa Through Property Investment 2026 | Royal Jubilant'), ep('Complete guide to the 10-year UAE Golden Visa through AED 2M+ property investment. Eligibility, process, costs, and eligible properties.'), ep('published'), ep('2026-07-07 23:06:36'), ep('2026-07-07 23:06:36'), ep('2026-07-07 23:06:36')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `LandingPage` (`id`, `title`, `slug`, `headline`, `subheadline`, `body`, `heroImage`, `ctaText`, `ctaLink`, `seoTitle`, `seoDescription`, `status`, `publishedAt`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb9d9gh0003ttbz52wgawuy'), ep('Dubai Real Estate Market Report — Q2 2026'), ep('dubai-market-report-q2-2026'), ep('Dubai Real Estate Q2 2026: Records Broken Again'), ep('AED 142B in transactions. 38,000+ deals. Average villa price up 14%. Get the full data report with 47 charts.'), ep('
<h2>Executive Summary</h2>
<p>Dubai\'s real estate market capped off another record-breaking quarter in Q2 2026, with <strong>AED 142 billion in total transaction value</strong> across <strong>38,417 deals</strong> — a 23% increase in volume and 18% increase in value year-on-year. Villa prices continued their upward trajectory with a 14% YoY gain, while apartment prices saw more modest 6% growth.</p>

<h2>Key Headline Numbers</h2>
<ul>
  <li><strong>Total Transaction Value:</strong> AED 142.3B (+18% YoY)</li>
  <li><strong>Total Transaction Volume:</strong> 38,417 deals (+23% YoY)</li>
  <li><strong>Average Villa Price:</strong> AED 6.8M (+14% YoY)</li>
  <li><strong>Average Apartment Price:</strong> AED 1.4M (+6% YoY)</li>
  <li><strong>Off-Plan Share:</strong> 53% of all transactions (vs 47% in Q2 2025)</li>
  <li><strong>Cash Buyer Percentage:</strong> 61% (down from 68% in Q2 2025)</li>
  <li><strong>Top Buyer Nationality:</strong> Indian (21%), UK (14%), Russian (9%), Saudi (7%)</li>
</ul>

<h2>Top Performing Communities — Villa Price Growth</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
  <thead>
    <tr style="background:#0A1F44;color:white;">
      <th style="padding:0.75rem;text-align:left;">Community</th>
      <th style="padding:0.75rem;text-align:left;">Avg Price (AED)</th>
      <th style="padding:0.75rem;text-align:left;">YoY Growth</th>
      <th style="padding:0.75rem;text-align:left;">Avg Price/sqft</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Palm Jumeirah</td>
      <td style="padding:0.75rem;">18.5M</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">+18%</td>
      <td style="padding:0.75rem;">AED 3,800</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Emirates Hills</td>
      <td style="padding:0.75rem;">32.1M</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">+15%</td>
      <td style="padding:0.75rem;">AED 2,400</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Dubai Hills Estate</td>
      <td style="padding:0.75rem;">8.9M</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">+14%</td>
      <td style="padding:0.75rem;">AED 1,650</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Jumeirah Bay Island</td>
      <td style="padding:0.75rem;">22.4M</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">+13%</td>
      <td style="padding:0.75rem;">AED 4,200</td>
    </tr>
    <tr>
      <td style="padding:0.75rem;">Arabian Ranches</td>
      <td style="padding:0.75rem;">6.2M</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">+11%</td>
      <td style="padding:0.75rem;">AED 1,180</td>
    </tr>
  </tbody>
</table>

<h2>Top Performing Communities — Apartment Rental Yields</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
  <thead>
    <tr style="background:#0A1F44;color:white;">
      <th style="padding:0.75rem;text-align:left;">Community</th>
      <th style="padding:0.75rem;text-align:left;">Avg 1BR Rent</th>
      <th style="padding:0.75rem;text-align:left;">Gross Yield</th>
      <th style="padding:0.75rem;text-align:left;">YoY Rent Change</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">JVC (Jumeirah Village Circle)</td>
      <td style="padding:0.75rem;">AED 68,000</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">9.2%</td>
      <td style="padding:0.75rem;">+8%</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Dubai Production City</td>
      <td style="padding:0.75rem;">AED 62,000</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">8.9%</td>
      <td style="padding:0.75rem;">+6%</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Discovery Gardens</td>
      <td style="padding:0.75rem;">AED 70,000</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">8.4%</td>
      <td style="padding:0.75rem;">+9%</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Dubai Marina</td>
      <td style="padding:0.75rem;">AED 105,000</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">6.8%</td>
      <td style="padding:0.75rem;">+5%</td>
    </tr>
    <tr>
      <td style="padding:0.75rem;">Downtown Dubai</td>
      <td style="padding:0.75rem;">AED 130,000</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">5.9%</td>
      <td style="padding:0.75rem;">+4%</td>
    </tr>
  </tbody>
</table>

<h2>5 Key Trends Shaping H2 2026</h2>

<h3>1. Off-Plan Dominance Continues</h3>
<p>Off-plan transactions crossed 50% market share for the first time, driven by aggressive launches from Emaar, DAMAC, and Sobha. We expect this to continue through H2 as ~120 new projects are slated for launch.</p>

<h3>2. End-User Demand Surging</h3>
<p>The cash buyer percentage dropped from 68% to 61%, indicating growing end-user (mortgaged) demand. This is a healthy sign — sustainable market growth depends on end-users, not just investors.</p>

<h3>3. Villa Supply Constraint</h3>
<p>With only ~1,400 Palm villas, 1,500 Emirates Hills villas, and 7,500 Dubai Hills villas — all sold out — secondary market villa prices will continue upward. No new villa supply is expected until 2028.</p>

<h3>4. Golden Visa Effect</h3>
<p>The 2024 visa changes continue to attract international capital. Indian and UK buyers — historically motivated by residency — drove 35% of AED 5M+ transactions in Q2.</p>

<h3>5. Branded Residences Premium</h3>
<p>Branded residences (Cavalli, Bugatti, Six Senses, Bvlgari) now command a 32% premium over equivalent unbranded properties — up from 25% a year ago. This trend will accelerate as more luxury brands enter Dubai.</p>

<h2>Outlook for H2 2026</h2>
<p>Royal Jubilant forecasts continued price growth in H2 2026, with villa prices up 8-12% and apartment prices up 4-6% by year-end. Off-plan activity will moderate slightly as the 2024-2025 launch pipeline completes and units enter the secondary market.</p>
<p>For investors, the strongest opportunities remain:</p>
<ul>
  <li><strong>Off-plan launches in Creek Harbour, Dubai Hills, and Tilal Al Ghaf</strong> — capital appreciation during construction</li>
  <li><strong>Secondary villas in established communities</strong> — limited supply, strong rental demand</li>
  <li><strong>Branded residences</strong> — proven 25-35% premium retention</li>
  <li><strong>JVC and Discovery Gardens apartments</strong> — best gross yields in Dubai</li>
</ul>

<h2>Get the Full Report</h2>
<p>This page summarises our 47-page Q2 2026 Dubai Real Estate Market Report. The full report includes:</p>
<ul>
  <li>Detailed community-by-community price data (47 communities)</li>
  <li>Rental yield analysis by unit type (1BR, 2BR, 3BR, villa)</li>
  <li>Off-plan pipeline tracker (120+ projects)</li>
  <li>Buyer demographic breakdown by nationality</li>
  <li>Mortgage market analysis (12 UAE banks compared)</li>
  <li>2026-2028 forecasts and scenario analysis</li>
</ul>
<p>Submit the form below to receive the full PDF report by email — free for qualified investors.</p>
'), ep('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'), ep('Download Full Report'), ep('#lead-form'), ep('Dubai Real Estate Market Report Q2 2026 | Royal Jubilant Research'), ep('Q2 2026 Dubai property market report. AED 142B in transactions, 38,000+ deals, villa prices up 14%. Full data with 47 charts.'), ep('published'), ep('2026-07-07 23:06:36'), ep('2026-07-07 23:06:36'), ep('2026-07-07 23:06:36')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  LandingPage: $count/4 inserted\n";

// Location: 128 records
$count = 0;
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd40002utt0eq66f0nrm'), ep('Palm Jumeirah'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd41002vtt0embhaeqsq'), ep('Dubai Marina'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd42002wtt0emtunkrua'), ep('Downtown Dubai'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd43002xtt0erklxm93x'), ep('Business Bay'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd43002ytt0evmt79llk'), ep('Jumeirah Beach Residence (JBR)'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd44002ztt0ejbn4s68c'), ep('Jumeirah Lakes Towers (JLT)'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd440030tt0ei90meepp'), ep('Bluewaters Island'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd450031tt0ewd4maa1r'), ep('Dubai Hills Estate'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd450032tt0e9f9xadvv'), ep('Emirates Hills'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd460033tt0ekiv8jtnq'), ep('Jumeirah Golf Estates'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd470034tt0e8n5fvcrg'), ep('Dubai Creek Harbour'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd470035tt0e4x043iv0'), ep('Emaar Beachfront'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd480036tt0exjqvfwnb'), ep('Port de La Mer'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd490037tt0euvthfy1u'), ep('La Mer'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4a0038tt0ed2o7pkix'), ep('City Walk'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4b0039tt0edlbhs10p'), ep('DIFC'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4c003att0exq290g4e'), ep('Jumeirah Bay Island'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4d003btt0ei735b5g6'), ep('Pearl Jumeirah'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4e003ctt0e9xzw2ta7'), ep('Dubai Harbour'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4f003dtt0eopyvnhmz'), ep('Dubai Marina Gate'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4g003ett0euzavo9db'), ep('Dubai Water Canal'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4h003ftt0ekm9erz6c'), ep('Burj Khalifa Area'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4i003gtt0e3g48bbes'), ep('Old Town Dubai'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4i003htt0ez6hbp7g5'), ep('The Address Boulevard District'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4j003itt0eo0zkfif8'), ep('Opera District'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4k003jtt0en5cjv271'), ep('Mohammed Bin Rashid City (MBR City)'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4m003ktt0e784w1jbd'), ep('District One'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4n003ltt0elen8m10h'), ep('Meydan'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4o003mtt0edu6fqnvy'), ep('Dubai Hills Park'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4p003ntt0erf9a31p1'), ep('Arabian Ranches'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4q003ott0ebn6aq524'), ep('Arabian Ranches 2'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4r003ptt0esekube1f'), ep('Arabian Ranches 3'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4s003qtt0emh3jjnoz'), ep('The Springs'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4t003rtt0e1392nxiy'), ep('The Meadows'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4u003stt0et0y0rg3w'), ep('The Lakes'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4u003ttt0ey5ts6psc'), ep('The Greens'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4v003utt0e4t0b9f1j'), ep('The Views'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4w003vtt0evrczs15u'), ep('Town Square'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4w003wtt0efigsfg4f'), ep('Damac Hills'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4x003xtt0em8buo7fc'), ep('Damac Hills 2'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd4z003ytt0esok39bhd'), ep('Akoya'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd50003ztt0ehqzq0pog'), ep('Mudon'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd510040tt0en9d3fqu2'), ep('Sustainable City'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd520041tt0efznp9m6m'), ep('Al Barari'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd530042tt0eaog7bfd8'), ep('The Villa'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd530043tt0envsmyt8z'), ep('Falcon City of Wonders'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd540044tt0e9ur322ko'), ep('Living Legends'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd550045tt0e8j4n13n9'), ep('Layan Community'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd560046tt0evg5wfeqy'), ep('Al Waha'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd570047tt0e77glvc1p'), ep('Jumeirah 1'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd580048tt0ehr6ih84r'), ep('Jumeirah 2'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd590049tt0euslnf7c4'), ep('Jumeirah 3'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd61004att0ec9r7bcct'), ep('Umm Suqeim 1'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd63004btt0eviz44561'), ep('Umm Suqeim 2'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd65004ctt0ev1ygrcrt'), ep('Umm Suqeim 3'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd66004dtt0eje2lw6gl'), ep('Al Sufouh'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd67004ett0esbum38ig'), ep('Al Wasl'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd68004ftt0enjbau2in'), ep('Safa'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd69004gtt0el9ma2o8z'), ep('Al Manara'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6a004htt0evge3zo9u'), ep('Al Quoz'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6b004itt0emln7teip'), ep('Madinat Jumeirah Living'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6c004jtt0evj19hdna'), ep('Dubai South'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6d004ktt0e9xpwbv08'), ep('EXPO City'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6d004ltt0eguqhjnax'), ep('Tilal Al Ghaf'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6e004mtt0elqp0zlrl'), ep('Mina Rashid'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6f004ntt0eh7qgywb8'), ep('Palm Jebel Ali'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6g004ott0e0omvchei'), ep('Palm Deira'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6g004ptt0ebrx67k1z'), ep('Deira Islands'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6h004qtt0e99sik1vt'), ep('Dubai Islands'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6i004rtt0ex0mp6z07'), ep('Meydan One'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6i004stt0e22lceshm'), ep('Wadi Al Safa'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6j004ttt0erwh6sa76'), ep('Al Furjan'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6k004utt0en339hey6'), ep('Discovery Gardens'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6l004vtt0e71959mdl'), ep('The Gardens (Jebel Ali)'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6l004wtt0e1bhmnelu'), ep('Jebel Ali Village'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6m004xtt0eyugrgb1k'), ep('Green Community'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6n004ytt0e1h0mw4vb'), ep('DIP (Dubai Investments Park)'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6o004ztt0ek0g7u6oi'), ep('DAMAC Lagoons'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6p0050tt0eemw3j057'), ep('DAMAC Hills 2 (Akoya By DAMAC)'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6q0051tt0ey9g2fpfi'), ep('Barsha Heights (Tecom)'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6r0052tt0efh7m0k6f'), ep('Sheikh Zayed Road'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6r0053tt0eh58dm6uu'), ep('Al Quoz Industrial'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6s0054tt0eajwf9f1v'), ep('Ras Al Khor'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6t0055tt0egrrlz4lx'), ep('Dubai Investment Park (DIP)'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6u0056tt0epjuxd5zc'), ep('Dubai Production City'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6v0057tt0e67k2t862'), ep('Dubai Silicon Oasis'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6v0058tt0e3690uz4o'), ep('Dubai Internet City'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6w0059tt0e37ll7db0'), ep('Dubai Media City'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6x005att0ess3mx4pd'), ep('Dubai Knowledge Park'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6y005btt0e17qr8cez'), ep('Dubai Academic City'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd6z005ctt0ecfnvbtkz'), ep('Dubai Healthcare City'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd70005dtt0exqwxrgng'), ep('Dubai Festival City'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd71005ett0e5ng3sxcr'), ep('Dubai Festival Plaza'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd71005ftt0e1dlwowz5'), ep('Cityland Mall'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd72005gtt0eobhcrek2'), ep('Nad Al Sheba'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd73005htt0ekhkjaiao'), ep('Deira'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd74005itt0eicemw9ef'), ep('Bur Dubai'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd74005jtt0e37w0nrcs'), ep('Al Karama'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd75005ktt0eyncrj0g0'), ep('Al Ras'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd76005ltt0euzd1nocz'), ep('Naif'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd77005mtt0e79k89ie0'), ep('Corniche Deira'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd79005ntt0emsp9g76a'), ep('Oud Metha'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7a005ott0eoxcs6x7i'), ep('Zabeel'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7b005ptt0e7qsx4sb9'), ep('Al Badaa'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7d005qtt0e3wd9qazj'), ep('Al Satwa'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7e005rtt0er0f9nms3'), ep('Karama'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7f005stt0ecks7xntg'), ep('Jumeirah Village Circle (JVC)'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7g005ttt0e1l0yop9e'), ep('Jumeirah Village Triangle (JVT)'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7h005utt0evhucuezv'), ep('Liwan'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7i005vtt0ea2chz9bw'), ep('Reem'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7i005wtt0ehtk8q9mj'), ep('Majan'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7j005xtt0e8f6pxwwt'), ep('Dubailand'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7k005ytt0eklgm5ifk'), ep('Remraam'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7l005ztt0e0vikcf8k'), ep('Damac Riverside'), ep('Dubai'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7m0060tt0eylmswxk0'), ep('Saadiyat Island'), ep('Abu Dhabi'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7m0061tt0e8wijf2sn'), ep('Al Reem Island'), ep('Abu Dhabi'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7n0062tt0ekzf8hggp'), ep('Yas Island'), ep('Abu Dhabi'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7o0063tt0ejc3gtl7k'), ep('Al Maryah Island'), ep('Abu Dhabi'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7p0064tt0etz7a4gs6'), ep('Khalifa City'), ep('Abu Dhabi'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7q0065tt0epznrwcwr'), ep('Al Raha Beach'), ep('Abu Dhabi'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7r0066tt0e79tj84ia'), ep('Al Majaz'), ep('Sharjah'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7r0067tt0e4yb379az'), ep('Al Khan'), ep('Sharjah'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7t0068tt0eutngtd6t'), ep('Al Mamsha'), ep('Sharjah'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7u0069tt0e0d4gakco'), ep('Muwaileh'), ep('Sharjah'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7u006att0ejgf7itmr'), ep('Al Marjan Island'), ep('Ras Al Khaimah'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7v006btt0elug1rbnn'), ep('Mina Al Arab'), ep('Ras Al Khaimah'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7w006ctt0ehr67idh4'), ep('Al Zorah'), ep('Ajman'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Location` (`id`, `name`, `emirate`, `country`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd7x006dtt0ees4p3pud'), ep('Ajman Corniche'), ep('Ajman'), ep('UAE'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Location: $count/128 inserted\n";

// PropertyCategory: 28 records
$count = 0;
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyv70000tt7ej1ys7a01'), ep('Apartment'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyv90001tt7ehzoivicx'), ep('Studio'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyva0002tt7exv4k9t8w'), ep('Penthouse'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvc0003tt7e495mup75'), ep('Duplex'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvd0004tt7ey3wqaxfi'), ep('Villa'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyve0005tt7eg0l0f431'), ep('Townhouse'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvf0006tt7e82wqmdtz'), ep('Mansion'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvg0007tt7esb7zv64v'), ep('Compound'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvh0008tt7e92u91ths'), ep('Private Room'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvi0009tt7ehnpkc07b'), ep('Bed Space'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvj000att7eohskykfl'), ep('Holiday Home'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvj000btt7eouf68ai5'), ep('Hotel Apartment'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvk000ctt7efwqe095m'), ep('Serviced Apartment'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvl000dtt7efwnfs6wt'), ep('Building'), ep('residential'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvl000ett7ed8t3pyg9'), ep('Office'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvm000ftt7em1g1cvzc'), ep('Retail'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvo000gtt7ebfad2283'), ep('Shop'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvp000htt7e7ne6de59'), ep('Showroom'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvq000itt7e80zcbkp2'), ep('Warehouse'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvr000jtt7emp0v8mnq'), ep('Factory'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvs000ktt7eq50dxaox'), ep('Industrial'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvt000ltt7ejaw65yfp'), ep('Labor Camp'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvu000mtt7e68ry9w13'), ep('Staff Accommodation'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvv000ntt7e762phayz'), ep('Mixed Use'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvw000ott7e9ov6u3m1'), ep('Bulk Units'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvw000ptt7ee50a3ekc'), ep('Land'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvx000qtt7edpt51xxb'), ep('Plot'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `PropertyCategory` (`id`, `name`, `type`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7zyvy000rtt7e9y4akqdf'), ep('Cold Storage'), ep('commercial'), 1, ep('2026-07-07 22:28:16'), ep('2026-07-07 22:28:16')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  PropertyCategory: $count/28 inserted\n";

// Amenity: 102 records
$count = 0;
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0i0000tt0eg1egs2f7'), ep('Central A/C'), ep('indoor'), ep('wind'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0l0001tt0efto7dz69'), ep('Central Heating'), ep('indoor'), ep('flame'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0m0002tt0equx9pwqo'), ep('Fully Fitted Kitchen'), ep('indoor'), ep('utensils'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0o0003tt0es1nkn6gp'), ep('Built-in Wardrobes'), ep('indoor'), ep('shirt'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0p0004tt0evicqgdf5'), ep('Walk-in Closet'), ep('indoor'), ep('shirt'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0q0005tt0ed5fxhr7r'), ep('Maid\'s Room'), ep('indoor'), ep('door-open'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0s0006tt0ellhiklde'), ep('Laundry Room'), ep('indoor'), ep('washing-machine'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0t0007tt0ez1datamh'), ep('Study Room'), ep('indoor'), ep('book-open'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0u0008tt0e89p25ms2'), ep('Storage Room'), ep('indoor'), ep('package'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0v0009tt0e3jmy3ccg'), ep('Smart Home System'), ep('indoor'), ep('cpu'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0w000att0e7unugyx9'), ep('Home Cinema'), ep('indoor'), ep('film'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0x000btt0ejdzgvmcp'), ep('Floor-to-Ceiling Windows'), ep('indoor'), ep('square'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd0z000ctt0emqj33qxh'), ep('Marble Flooring'), ep('indoor'), ep('square'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd10000dtt0ecbt9qxj7'), ep('Chandelier'), ep('indoor'), ep('lightbulb'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd12000ett0e9800m02r'), ep('Open Plan Layout'), ep('indoor'), ep('layout'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd13000ftt0eqtdt2cf3'), ep('Private Pool'), ep('outdoor'), ep('waves'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd14000gtt0evpshy43j'), ep('Private Garden'), ep('outdoor'), ep('trees'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd15000htt0e1gn3mfgt'), ep('Balcony'), ep('outdoor'), ep('door-open'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd16000itt0ee2fuenrx'), ep('Terrace'), ep('outdoor'), ep('square'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd18000jtt0e90pcyntr'), ep('Barbecue Area'), ep('outdoor'), ep('flame'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd19000ktt0e3e0awlbh'), ep('Outdoor Kitchen'), ep('outdoor'), ep('utensils'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1a000ltt0exe3jdehj'), ep('Covered Parking'), ep('outdoor'), ep('car'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1a000mtt0em53dbi1a'), ep('Private Garage'), ep('outdoor'), ep('car'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1b000ntt0ekzq1e5x4'), ep('Swimming Pool'), ep('building'), ep('waves'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1c000ott0eiysz9zyf'), ep('Gymnasium'), ep('building'), ep('dumbbell'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1d000ptt0eq03ygw85'), ep('Sauna'), ep('building'), ep('flame'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1e000qtt0emu211520'), ep('Steam Room'), ep('building'), ep('flame'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1f000rtt0e4xro78ce'), ep('Jacuzzi'), ep('building'), ep('waves'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1g000stt0e15uuiz4b'), ep('24/7 Security'), ep('building'), ep('shield'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1h000ttt0eotbvuzu7'), ep('CCTV Surveillance'), ep('building'), ep('camera'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1i000utt0evqwzpaun'), ep('Concierge Service'), ep('building'), ep('bell'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1i000vtt0e53j7fmru'), ep('Reception / Lobby'), ep('building'), ep('door-open'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1j000wtt0esxvxeovq'), ep('High-Speed Elevators'), ep('building'), ep('arrow-up'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1k000xtt0eugfawp95'), ep('Prayer Room'), ep('building'), ep('moon'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1l000ytt0e1m458wfv'), ep('Children\'s Play Area'), ep('building'), ep('baby'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1m000ztt0ezh9310ay'), ep('Kids Pool'), ep('building'), ep('waves'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1n0010tt0ei25pk5y2'), ep('Kids Club'), ep('building'), ep('baby'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1o0011tt0entyxjr20'), ep('Day Care'), ep('building'), ep('baby'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1p0012tt0ejcijsmng'), ep('Business Centre'), ep('building'), ep('briefcase'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1q0013tt0eaauharg4'), ep('Meeting Room'), ep('building'), ep('users'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1r0014tt0ejws51fd7'), ep('Co-working Lounge'), ep('building'), ep('laptop'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1s0015tt0e68uvr79y'), ep('Library'), ep('building'), ep('book-open'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1t0016tt0e07ounq9z'), ep('Lounge Area'), ep('building'), ep('sofa'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1u0017tt0ef3jcfidw'), ep('Retail Outlets'), ep('building'), ep('shopping-bag'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1v0018tt0epssone1o'), ep('Supermarket'), ep('building'), ep('shopping-cart'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1w0019tt0ebhjr3g06'), ep('Restaurant / Cafe'), ep('building'), ep('coffee'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1x001att0exut831qh'), ep('ATM'), ep('building'), ep('credit-card'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd1y001btt0e87v8w4a7'), ep('EV Charging Station'), ep('building'), ep('zap'), 1, ep('2026-07-07 22:26:14'), ep('2026-07-07 22:26:14')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd20001ctt0ef2ae8g1u'), ep('Visitor Parking'), ep('building'), ep('car'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd21001dtt0euxb1ntq8'), ep('Maintenance Services'), ep('building'), ep('wrench'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd22001ett0eo18ij8a1'), ep('Property Management'), ep('building'), ep('clipboard'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd23001ftt0esnnbky78'), ep('Waste Disposal'), ep('building'), ep('trash-2'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd24001gtt0e07do3bqn'), ep('District Cooling'), ep('building'), ep('wind'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd25001htt0eedzhop8i'), ep('Metro Station'), ep('nearby'), ep('train'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd25001itt0eqffpqln1'), ep('Tram Station'), ep('nearby'), ep('train'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd26001jtt0exsts8ges'), ep('Bus Stop'), ep('nearby'), ep('bus'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd27001ktt0ebv1cb5ps'), ep('Shopping Mall'), ep('nearby'), ep('shopping-bag'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd28001ltt0ewa6ix9ey'), ep('School'), ep('nearby'), ep('graduation-cap'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd29001mtt0elzdaej25'), ep('Hospital'), ep('nearby'), ep('plus-square'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2a001ntt0etuz42u2l'), ep('Clinic'), ep('nearby'), ep('plus-square'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2c001ott0el6nbgkno'), ep('Pharmacy'), ep('nearby'), ep('plus-square'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2d001ptt0egtsixu82'), ep('Mosque'), ep('nearby'), ep('moon'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2e001qtt0euqn3n8u6'), ep('Beach Access'), ep('nearby'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2f001rtt0e56qjmtay'), ep('Beach Club'), ep('nearby'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2f001stt0efhhde3z0'), ep('Golf Course'), ep('nearby'), ep('flag'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2g001ttt0ek2qy7cun'), ep('Tennis Court'), ep('nearby'), ep('circle'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2h001utt0exqyqrxgp'), ep('Cricket Pitch'), ep('nearby'), ep('circle'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2h001vtt0ejifzwmyf'), ep('Football Pitch'), ep('nearby'), ep('circle'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2i001wtt0e7ee77m12'), ep('Basketball Court'), ep('nearby'), ep('circle'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd2j001xtt0en1wehcu6'), ep('Paddle Court'), ep('nearby'), ep('circle'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd39001ytt0ejuikc2bq'), ep('Squash Court'), ep('nearby'), ep('circle'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3a001ztt0es7gi94oo'), ep('Park'), ep('nearby'), ep('trees'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3b0020tt0eeb1jkuh7'), ep('Promenade'), ep('nearby'), ep('route'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3c0021tt0ejqe168d0'), ep('Cycling Track'), ep('nearby'), ep('bike'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3d0022tt0ef4gw6j46'), ep('Jogging Track'), ep('nearby'), ep('footprints'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3e0023tt0ewb9hq1uy'), ep('Marina'), ep('nearby'), ep('anchor'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3f0024tt0e90ij41fs'), ep('Yacht Club'), ep('nearby'), ep('anchor'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3f0025tt0ez1hhtld4'), ep('Airport Nearby'), ep('nearby'), ep('plane'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3g0026tt0ei2zxazyb'), ep('Restaurant Nearby'), ep('nearby'), ep('utensils'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3i0027tt0etz14n2e0'), ep('Cafe Nearby'), ep('nearby'), ep('coffee'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3j0028tt0erturwciw'), ep('Bank Nearby'), ep('nearby'), ep('landmark'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3k0029tt0erodtwbur'), ep('Petrol Station'), ep('nearby'), ep('fuel'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3k002att0eew6ktq1l'), ep('Sea View'), ep('view'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3m002btt0e4ieg68cw'), ep('Beach View'), ep('view'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3m002ctt0eujy0i9yp'), ep('Marina View'), ep('view'), ep('anchor'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3n002dtt0eu6gl89p0'), ep('Palm View'), ep('view'), ep('palmtree'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3n002ett0e0fqhle35'), ep('Burj Khalifa View'), ep('view'), ep('building'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3o002ftt0e5zfimfxw'), ep('Boulevard View'), ep('view'), ep('road'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3p002gtt0elmzpko6f'), ep('Skyline View'), ep('view'), ep('building'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3q002htt0e12urncg0'), ep('City View'), ep('view'), ep('building'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3r002itt0erbcmu73e'), ep('Park View'), ep('view'), ep('trees'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3r002jtt0el4p8m8h7'), ep('Golf View'), ep('view'), ep('flag'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3s002ktt0e5gpfs0yw'), ep('Pool View'), ep('view'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3t002ltt0etlohcbaf'), ep('Garden View'), ep('view'), ep('trees'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3u002mtt0eoszjlrwc'), ep('Lake View'), ep('view'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3v002ntt0e6nshiam0'), ep('Fountain View'), ep('view'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3w002ott0eoso82ugo'), ep('Creek View'), ep('view'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3w002ptt0expdkzkip'), ep('Sunset View'), ep('view'), ep('sun'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3x002qtt0ebic4lfvz'), ep('Panoramic View'), ep('view'), ep('eye'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3x002rtt0epo10n206'), ep('Full Sea View'), ep('view'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3y002stt0e0lqtda4c'), ep('Partial Sea View'), ep('view'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
$sql = 'INSERT INTO `Amenity` (`id`, `name`, `category`, `icon`, `published`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [ep('cmrb7xd3y002ttt0eeqbjfkx0'), ep('Lagoon View'), ep('view'), ep('waves'), 1, ep('2026-07-07 22:26:15'), ep('2026-07-07 22:26:15')]) . ')';
if ($conn->query($sql)) { if ($conn->affected_rows > 0) $count++; } else { echo "  err: " . $conn->error . "\n"; }
echo "  Amenity: $count/102 inserted\n";


$conn->close();

echo "\n═══════════════════════════════════════════════════════\n";
echo "  MIGRATION COMPLETE!\n";
echo "═══════════════════════════════════════════════════════\n\n";
echo "All tables created and data inserted.\n";
echo "Live site should now show all properties, agents, menus, etc.\n";
