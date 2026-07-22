<?php
/**
 * CHANGE ADMIN CREDENTIALS
 * 
 * Usage:
 *   php change-admin.php newemail@royaljubilant.ae newpassword123
 * 
 * Example:
 *   php change-admin.php admin@royaljubilant.ae MyNewPass2026
 *   php change-admin.php newadmin@royaljubilant.ae SecurePass123!
 */

$MYSQL_HOST = 'localhost';
$MYSQL_DB   = 'u432212399_rjcom';
$MYSQL_USER = 'u432212399_adminrjcom';
$MYSQL_PASS = 'Admin@2026@#';

// Get new credentials from command line
$newEmail = $argv[1] ?? null;
$newPassword = $argv[2] ?? null;

echo "═══════════════════════════════════════════════════════\n";
echo "  CHANGE ADMIN CREDENTIALS\n";
echo "═══════════════════════════════════════════════════════\n\n";

if (!$newEmail || !$newPassword) {
    echo "❌ Usage: php change-admin.php <email> <password>\n\n";
    echo "Examples:\n";
    echo "  php change-admin.php admin@royaljubilant.ae admin123\n";
    echo "  php change-admin.php newadmin@royaljubilant.ae MySecurePass2026\n";
    echo "  php change-admin.php ceo@royaljubilant.ae Royal@2026!\n";
    exit(1);
}

if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
    echo "❌ Invalid email format: $newEmail\n";
    exit(1);
}

if (strlen($newPassword) < 6) {
    echo "❌ Password too short (minimum 6 characters)\n";
    exit(1);
}

echo "New credentials:\n";
echo "  Email:    $newEmail\n";
echo "  Password: $newPassword\n\n";

// Generate bcrypt hash with $2b$ prefix (Node.js compatible)
echo "[1/3] Generating bcrypt hash...\n";
$phpHash = password_hash($newPassword, PASSWORD_BCRYPT);
$nodeHash = '$2b$' . substr($phpHash, 4);
echo "      Hash: " . substr($nodeHash, 0, 30) . "...\n\n";

// Connect to MySQL
echo "[2/3] Connecting to MySQL...\n";
$conn = new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB);
if ($conn->connect_error) {
    die("      ❌ FAIL: " . $conn->connect_error . "\n");
}
echo "      ✅ Connected\n\n";

// Update or create admin user
echo "[3/3] Updating admin user...\n";

// Check if user with new email exists
$stmt = $conn->prepare("SELECT id FROM User WHERE email = ?");
$stmt->bind_param('s', $newEmail);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    // Update existing user with new password
    $stmt->close();
    $stmt = $conn->prepare("UPDATE User SET passwordHash = ?, role = 'admin', name = 'Royal Jubilant Admin' WHERE email = ?");
    $stmt->bind_param('ss', $nodeHash, $newEmail);
    $stmt->execute();
    echo "      ✅ Updated existing user with new password\n";
} else {
    // Check if any admin exists — if yes, update their email; if no, create new
    $stmt->close();
    $stmt = $conn->prepare("SELECT id FROM User WHERE role = 'admin' LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        // Update existing admin's email and password
        $row = $result->fetch_assoc();
        $adminId = $row['id'];
        $stmt->close();
        $stmt = $conn->prepare("UPDATE User SET email = ?, passwordHash = ?, role = 'admin', name = 'Royal Jubilant Admin' WHERE id = ?");
        $stmt->bind_param('sss', $newEmail, $nodeHash, $adminId);
        $stmt->execute();
        echo "      ✅ Updated existing admin (ID: $adminId) with new email + password\n";
    } else {
        // Create new admin
        $stmt->close();
        $id = 'c' . bin2hex(random_bytes(12));
        $name = 'Royal Jubilant Admin';
        $stmt = $conn->prepare("INSERT INTO User (id, email, name, role, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, 'admin', ?, NOW(), NOW())");
        $stmt->bind_param('ssss', $id, $newEmail, $name, $nodeHash);
        $stmt->execute();
        echo "      ✅ Created new admin user (ID: $id)\n";
    }
}
$stmt->close();

// Verify
echo "\nVerifying...\n";
$stmt = $conn->prepare("SELECT id, email, role, LEFT(passwordHash, 4) as prefix FROM User WHERE email = ? AND role = 'admin'");
$stmt->bind_param('s', $newEmail);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    echo "      ID:     " . $row['id'] . "\n";
    echo "      Email:  " . $row['email'] . "\n";
    echo "      Role:   " . $row['role'] . "\n";
    echo "      Prefix: " . $row['prefix'] . " ✅\n";
} else {
    echo "      ❌ Verification failed!\n";
    exit(1);
}
$stmt->close();
$conn->close();

echo "\n═══════════════════════════════════════════════════════\n";
echo "  CREDENTIALS CHANGED!\n";
echo "═══════════════════════════════════════════════════════\n\n";
echo "Login with:\n";
echo "  URL:      https://www.royaljubilant.com/admin/login\n";
echo "  Email:    $newEmail\n";
echo "  Password: $newPassword\n\n";
echo "⚠️  Save these credentials somewhere safe!\n";
