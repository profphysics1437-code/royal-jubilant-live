<?php
/**
 * FIX ADMIN PASSWORD HASH (one-shot fix)
 * 
 * ROOT CAUSE: PHP's password_hash() generates $2y$ prefix.
 * Node.js bcryptjs needs $2b$ prefix for reliable verification.
 * This script generates the hash using bcryptjs (same lib app uses).
 *
 * Usage:
 *   curl -O https://raw.githubusercontent.com/profphysics1437-code/royal-jubilant-live/main/scripts/fix-hash.php
 *   php fix-hash.php
 */

$MYSQL_HOST = 'localhost';
$MYSQL_DB   = 'u432212399_rjcom';
$MYSQL_USER = 'u432212399_adminrjcom';
$MYSQL_PASS = 'Admin@2026@#';
$ADMIN_EMAIL = 'admin@royaljubilant.ae';
$ADMIN_PASSWORD = 'admin123';
$NODE_BIN = '/opt/alt/alt-nodejs22/root/bin/node';
$NPM_BIN = '/opt/alt/alt-nodejs22/root/bin/npm';
$APP_DIR = __DIR__ . '/.builds/last-source';

echo "═══════════════════════════════════════════════════════\n";
echo "  FIX ADMIN PASSWORD HASH (bcryptjs format)\n";
echo "═══════════════════════════════════════════════════════\n\n";

// ─── 1. Check bcryptjs ───
echo "[1/4] Checking bcryptjs...\n";
$bcryptPath = $APP_DIR . '/node_modules/bcryptjs';
if (!file_exists($bcryptPath)) {
    echo "      Installing bcryptjs...\n";
    chdir($APP_DIR);
    exec("$NPM_BIN install bcryptjs --no-save --ignore-scripts 2>&1", $out, $ret);
    if ($ret !== 0) {
        echo "      FAIL: Could not install bcryptjs\n";
        exit(1);
    }
}
echo "      OK - bcryptjs available\n\n";

// ─── 2. Generate hash using bcryptjs (same lib Node app uses) ───
echo "[2/4] Generating bcrypt hash via bcryptjs...\n";
$jsCode = "console.log(require('" . $bcryptPath . "').hashSync('" . $ADMIN_PASSWORD . "', 10))";
$escaped = escapeshellarg($jsCode);
$hash = trim(shell_exec("cd $APP_DIR && $NODE_BIN -e $escaped 2>&1"));

if (empty($hash) || strpos($hash, '$2') !== 0) {
    echo "      FAIL: Could not generate hash\n";
    echo "      Output: $hash\n";
    exit(1);
}
$prefix = substr($hash, 0, 4);
echo "      Hash: " . substr($hash, 0, 30) . "...\n";
echo "      Prefix: $prefix (Node.js format ✅)\n\n";

// ─── 3. Connect to MySQL ───
echo "[3/4] Connecting to MySQL...\n";
$conn = new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB);
if ($conn->connect_error) {
    die("      FAIL: " . $conn->connect_error . "\n");
}
echo "      Connected ✅\n\n";

// ─── 4. Update admin user with bcryptjs-compatible hash ───
echo "[4/4] Updating admin user...\n";
$stmt = $conn->prepare("SELECT id FROM User WHERE email = ?");
$stmt->bind_param('s', $ADMIN_EMAIL);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    // Update existing
    $stmt->close();
    $stmt = $conn->prepare("UPDATE User SET passwordHash = ?, role = 'admin' WHERE email = ?");
    $stmt->bind_param('ss', $hash, $ADMIN_EMAIL);
    $stmt->execute();
    echo "      OK: Updated existing admin user\n";
} else {
    // Create new
    $stmt->close();
    $id = 'c' . bin2hex(random_bytes(12));
    $name = 'Royal Jubilant Admin';
    $stmt = $conn->prepare("INSERT INTO User (id, email, name, role, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, 'admin', ?, NOW(), NOW())");
    $stmt->bind_param('ssss', $id, $ADMIN_EMAIL, $name, $hash);
    $stmt->execute();
    echo "      OK: Created new admin user (ID: $id)\n";
}
$stmt->close();
$conn->close();

echo "\n═══════════════════════════════════════════════════════\n";
echo "  DONE! Hash now uses bcryptjs format (\$2b\$)\n";
echo "═══════════════════════════════════════════════════════\n\n";
echo "Try logging in NOW:\n";
echo "  URL: https://www.royaljubilant.com/admin/login\n";
echo "  Email: $ADMIN_EMAIL\n";
echo "  Password: $ADMIN_PASSWORD\n";
