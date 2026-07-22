<?php
/**
 * Add missing property to Hostinger MySQL
 * Run: php add-missing-property.php
 */

$MYSQL_HOST = 'localhost';
$MYSQL_DB   = 'u432212399_rjcom';
$MYSQL_USER = 'u432212399_adminrjcom';
$MYSQL_PASS = 'Admin@2026@#';

echo "═══════════════════════════════════════════════════════\n";
echo "  ADD MISSING PROPERTY TO HOSTINGER MYSQL\n";
echo "═══════════════════════════════════════════════════════\n\n";

$conn = new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB);
if ($conn->connect_error) {
    die("FAIL: " . $conn->connect_error . "\n");
}
echo "[1/2] Connected to MySQL\n\n";

// Check if property already exists
$ref = 'RJ-48545238';
$stmt = $conn->prepare("SELECT id FROM Property WHERE reference = ?");
$stmt->bind_param('s', $ref);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    echo "[2/2] Property $ref already exists in MySQL. Skipping.\n";
} else {
    $stmt->close();
    
    // Insert the property
    $id = 'cmra0hqtg0001pdnr70xieuyb';
    $title = '2BR Apartment with Marina View in JBR';
    $slug = '2br-apartment-marina-view-jbr';
    $reference = 'RJ-48545238';
    $status = 'rent';
    $type = 'Apartment';
    $community = 'JBR';
    $emirate = 'Dubai';
    $country = 'UAE';
    $bedrooms = 2;
    $bathrooms = 3;
    $area = 860;
    $areaUnit = 'sqft';
    $price = 123000;
    $rentFrequency = 'yearly';
    $noOfCheques = 1;
    $description = 'Beautiful 2-bedroom apartment with stunning Marina views in JBR. Fully furnished, ready to move in. Features floor-to-ceiling windows, modern kitchen, spacious living area, and access to building amenities including pool, gym, and direct beach access.';
    $reraNumber = '72312249216';
    $images = '["/uploads/properties/1783276720397-qsk5cada.webp","/uploads/properties/1783276720409-ls7mlkgp.webp","/uploads/properties/1783276720419-odh34xa5.webp","/uploads/properties/1783276720634-x79z546b.webp","/uploads/properties/1783276720707-7ko1ggoz.webp"]';
    $amenities = '["Pool","Gym","Beach Access","Parking","24/7 Security"]';
    $features = '["Marina View","Furnished","Floor-to-ceiling Windows","Modern Kitchen"]';
    $agentId = 'cmr5hml0c0005v8zxf74x9rnq';
    $published = 1;
    $isLatest = 1;
    $featured = 0;
    $isLuxury = 0;
    $views = 0;
    $furnished = 1;
    $completionStatus = 'Ready';
    
    $stmt = $conn->prepare("INSERT INTO Property (
        id, title, slug, reference, status, type, category, country, emirate, community,
        bedrooms, bathrooms, area, areaUnit, price, rentFrequency, noOfCheques,
        description, reraNumber, images, amenities, features,
        agentId, published, isLatest, featured, isLuxury, views, furnished, completionStatus,
        createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
    
    $category = 'residential';
    $stmt->bind_param(
        'ssssssssssiisisiisssssiii iiiis',
        $id, $title, $slug, $reference, $status, $type, $category, $country, $emirate, $community,
        $bedrooms, $bathrooms, $area, $areaUnit, $price, $rentFrequency, $noOfCheques,
        $description, $reraNumber, $images, $amenities, $features,
        $agentId, $published, $isLatest, $featured, $isLuxury, $views, $furnished, $completionStatus
    );
    
    if ($stmt->execute()) {
        echo "[2/2] Property inserted successfully!\n";
        echo "   ID: $id\n";
        echo "   Title: $title\n";
        echo "   Reference: $reference\n";
        echo "   RERA: $reraNumber\n";
        echo "   Status: $status\n";
        echo "   Price: AED $price/year\n";
    } else {
        echo "[FAIL] Insert failed: " . $stmt->error . "\n";
    }
}
$stmt->close();

// Also check the other property mentioned
echo "\n--- Checking other recent properties ---\n";
$refs = ['RJ-78947492', 'RJ-46611566', 'RJ-970066'];
foreach ($refs as $r) {
    $stmt = $conn->prepare("SELECT id, title FROM Property WHERE reference = ?");
    $stmt->bind_param('s', $r);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res && $res->num_rows > 0) {
        $row = $res->fetch_assoc();
        echo "  ✅ $r: " . substr($row['title'], 0, 40) . "\n";
    } else {
        echo "  ❌ $r: MISSING in MySQL\n";
    }
    $stmt->close();
}

$conn->close();

echo "\n═══════════════════════════════════════════════════════\n";
echo "  DONE\n";
echo "═══════════════════════════════════════════════════════\n";
