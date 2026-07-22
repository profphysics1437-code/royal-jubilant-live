<?php
/**
 * FIX ADMIN — v4 (SIMPLEST)
 * No Node.js calls, no installs, just PHP + MySQL
 * 
 * The trick: PHP's $2y$ hash works with Node.js bcryptjs.
 * The earlier $2y$ hash from recover-admin.php DID work with PHP verify.
 * The issue may have been something else. Let's try a fresh simple hash
 * and update the database.
 *
 * Usage:
 *   curl -O https://raw.githubusercontent.com/profphysics1437-code/royal-jubilant-live/main/scripts/fix-v4.php
 *   php fix-v4.php
 */

$MYSQL_HOST = 'localhost';
$MYSQL_DB   = 'u432212399_rjcom';
$MYSQL_USER = 'u432212399_adminrjcom';
$MYSQL_PASS = 'Admin@2026@#';
$ADMIN_EMAIL = 'admin@royaljubilant.ae';
$ADMIN_PASSWORD = 'admin123';

echo "═══════════════════════════════════════════════════════\n";
echo "  FIX ADMIN (v4 — simplest)\n";
echo "═══════════════════════════════════════════════════════\n\n";

// Generate hash
echo "[1/3] Generating hash...\n";
$hash = password_hash($ADMIN_PASSWORD, PASSWORD_BCRYPT);
$nodeHash = '$2b$' . substr($hash, 4);
echo "      Hash: " . substr($nodeHash, 0, 30) . "...\n\n";

// Connect to MySQL
echo "[2/3] Connecting to MySQL...\n";
$conn = new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB);
if ($conn->connect_error) {
    die("      FAIL: " . $conn->connect_error . "\n");
}
echo "      Connected\n\n";

// Update admin user
echo "[3/3] Updating admin user...\n";
$stmt = $conn->prepare("SELECT id FROM User WHERE email = ?");
$stmt->bind_param('s', $ADMIN_EMAIL);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $stmt->close();
    echo "      Found existing user ID: " . $row['id'] . "\n";
    $stmt = $conn->prepare("UPDATE User SET passwordHash = ?, role = 'admin', name = 'Royal Jubilant Admin' WHERE email = ?");
    $stmt->bind_param('ss', $nodeHash, $ADMIN_EMAIL);
    if ($stmt->execute()) {
        echo "      OK: Password updated\n";
    } else {
        echo "      FAIL: " . $stmt->error . "\n";
        exit(1);
    }
} else {
    $stmt->close();
    $id = 'c' . bin2hex(random_bytes(12));
    $name = 'Royal Jubilant Admin';
    echo "      Creating new admin user...\n";
    $stmt = $conn->prepare("INSERT INTO User (id, email, name, role, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, 'admin', ?, NOW(), NOW())");
    $stmt->bind_param('ssss', $id, $ADMIN_EMAIL, $name, $nodeHash);
    if ($stmt->execute()) {
        echo "      OK: Created (ID: $id)\n";
    } else {
        echo "      FAIL: " . $stmt->error . "\n";
        exit(1);
    }
}
$stmt->close();

// Verify
echo "\nVerifying...\n";
$stmt = $conn->prepare("SELECT id, email, role, LEFT(passwordHash, 4) as prefix FROM User WHERE email = ?");
$stmt->bind_param('s', $ADMIN_EMAIL);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    echo "      ID:     " . $row['id'] . "\n";
    echo "      Email:  " . $row['email'] . "\n";
    echo "      Role:   " . $row['role'] . "\n";
    echo "      Prefix: " . $row['prefix'] . "\n";
}
$stmt->close();
$conn->close();

echo "\n═══════════════════════════════════════════════════════\n";
echo "  DONE — try login now:\n";
echo "  https://www.royaljubilant.com/admin/login\n";
echo "  Email: $ADMIN_EMAIL\n";
echo "  Password: $ADMIN_PASSWORD\n";
echo "═══════════════════════════════════════════════════════\n";
