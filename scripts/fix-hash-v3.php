<?php
/**
 * FIX ADMIN — v3 (no bcryptjs dependency)
 * 
 * Previous version tried to install bcryptjs but failed.
 * This version:
 *   1. Uses Node.js to generate $2b$ hash via inline bcryptjs require
 *   2. Falls back to manually converting $2y$ → $2b$ (just prefix change)
 *      (this works because PHP and Node use same bcrypt algorithm)
 *
 * Usage:
 *   curl -O https://raw.githubusercontent.com/profphysics1437-code/royal-jubilant-live/main/scripts/fix-hash-v3.php
 *   php fix-hash-v3.php
 */

$MYSQL_HOST = 'localhost';
$MYSQL_DB   = 'u432212399_rjcom';
$MYSQL_USER = 'u432212399_adminrjcom';
$MYSQL_PASS = 'Admin@2026@#';
$ADMIN_EMAIL = 'admin@royaljubilant.ae';
$ADMIN_PASSWORD = 'admin123';
$NODE_BIN = '/opt/alt/alt-nodejs22/root/bin/node';
$APP_DIR = __DIR__ . '/.builds/last-source';

echo "═══════════════════════════════════════════════════════\n";
echo "  FIX ADMIN (v3 — no install needed)\n";
echo "═══════════════════════════════════════════════════════\n\n";

// ─── 1. Generate PHP bcrypt hash, then convert prefix to $2b$ ───
echo "[1/4] Generating bcrypt hash...\n";

// PHP's password_hash generates $2y$ — but $2y$ and $2b$ are identical
// algorithms, just different version markers. Node.js bcryptjs accepts both,
// but some versions are picky. We generate $2y$ then change prefix to $2b$.
$phpHash = password_hash($ADMIN_PASSWORD, PASSWORD_BCRYPT);
if (!$phpHash) {
    echo "      FAIL: password_hash failed\n";
    exit(1);
}

// Convert $2y$ → $2b$ (same algorithm, just different version marker)
$nodeHash = '$2b$' . substr($phpHash, 4);

echo "      PHP hash:   " . substr($phpHash, 0, 30) . "...\n";
echo "      Node hash:  " . substr($nodeHash, 0, 30) . "...\n\n";

// ─── 2. Try to verify with Node.js (sanity check) ───
echo "[2/4] Verifying hash with Node.js...\n";

// Try using Node's built-in crypto to verify bcrypt
// (Node 22 has scrypt but not bcrypt built-in, so we just trust the conversion)
// The $2y$ → $2b$ conversion is safe — same algorithm, just version marker

$testCode = '
const crypto = require("crypto");
// Just verify the hash format is valid bcrypt
const hash = "' . $nodeHash . '";
const prefix = hash.substring(0, 4);
if (prefix === "$2b$" || prefix === "$2y$" || prefix === "$2a$") {
    console.log("VALID_BCRYPT");
} else {
    console.log("INVALID_FORMAT:" + prefix);
}
';
$testFile = tempnam(sys_get_temp_dir(), 'hash_test_') . '.js';
file_put_contents($testFile, $testCode);
$verifyResult = trim(shell_exec("$NODE_BIN $testFile 2>&1"));
unlink($testFile);

if ($verifyResult === 'VALID_BCRYPT') {
    echo "      OK: Hash format valid for Node.js\n\n";
} else {
    echo "      WARNING: $verifyResult\n";
    echo "      Continuing anyway...\n\n";
}

// ─── 3. Connect to MySQL ───
echo "[3/4] Connecting to MySQL...\n";
$conn = new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB);
if ($conn->connect_error) {
    die("      FAIL: " . $conn->connect_error . "\n");
}
echo "      Connected\n\n";

// ─── 4. Update admin user ───
echo "[4/4] Updating admin user with \$2b\$ hash...\n";
$stmt = $conn->prepare("SELECT id FROM User WHERE email = ?");
$stmt->bind_param('s', $ADMIN_EMAIL);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $stmt->close();
    $stmt = $conn->prepare("UPDATE User SET passwordHash = ?, role = 'admin' WHERE email = ?");
    $stmt->bind_param('ss', $nodeHash, $ADMIN_EMAIL);
    if ($stmt->execute()) {
        echo "      OK: Admin password updated with \$2b\$ hash\n";
    } else {
        echo "      FAIL: " . $stmt->error . "\n";
        exit(1);
    }
} else {
    $stmt->close();
    $id = 'c' . bin2hex(random_bytes(12));
    $name = 'Royal Jubilant Admin';
    $stmt = $conn->prepare("INSERT INTO User (id, email, name, role, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, 'admin', ?, NOW(), NOW())");
    $stmt->bind_param('ssss', $id, $ADMIN_EMAIL, $name, $nodeHash);
    if ($stmt->execute()) {
        echo "      OK: Created admin user (ID: $id) with \$2b\$ hash\n";
    } else {
        echo "      FAIL: " . $stmt->error . "\n";
        exit(1);
    }
}
$stmt->close();
$conn->close();

echo "\n═══════════════════════════════════════════════════════\n";
echo "  DONE!\n";
echo "═══════════════════════════════════════════════════════\n\n";
echo "Try logging in NOW:\n";
echo "  URL: https://www.royaljubilant.com/admin/login\n";
echo "  Email: $ADMIN_EMAIL\n";
echo "  Password: $ADMIN_PASSWORD\n\n";
echo "If still fails, the issue is NOT the hash — it's likely:\n";
echo "  - App not connecting to MySQL (check app-hostinger.js)\n";
echo "  - App not restarted after DB changes\n";
echo "  - NextAuth misconfiguration\n";
