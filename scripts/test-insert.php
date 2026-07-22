<?php
/**
 * TEST SINGLE INSERT — diagnose where script fails
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
set_time_limit(300);
ini_set('memory_limit', '512M');

$MYSQL_HOST = 'localhost';
$MYSQL_DB   = 'u432212399_rjcom';
$MYSQL_USER = 'u432212399_adminrjcom';
$MYSQL_PASS = 'Admin@2026@#';

function ep($s) {
  global $conn;
  return "'" . $conn->real_escape_string($s) . "'";
}

echo "Testing MySQL connection + single insert...\n\n";

$conn = new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB);
if ($conn->connect_error) {
    die("FAIL: " . $conn->connect_error . "\n");
}
echo "[OK] Connected\n\n";

// Check if User table exists
$r = $conn->query("SHOW TABLES LIKE 'User'");
echo "User table exists: " . ($r && $r->num_rows > 0 ? "YES" : "NO") . "\n";

// Try simple select
$r = $conn->query("SELECT COUNT(*) as c FROM User");
if ($r) {
    $row = $r->fetch_assoc();
    echo "Current User count: " . $row['c'] . "\n\n";
} else {
    echo "Select failed: " . $conn->error . "\n\n";
}

// Try single insert
echo "Testing single insert...\n";
$sql = 'INSERT INTO `User` (`id`, `email`, `name`, `phone`, `role`, `passwordHash`, `createdAt`, `updatedAt`) VALUES (' . implode(", ", [
  ep('test-001'),
  ep('test@example.com'),
  ep('Test User'),
  ep('+971 4 123 4567'),
  ep('admin'),
  ep('$2b$10$F5NwhrpENm6HPVwfYriYducsT7ek2GYdE9ju0Z/T/SK6vVu9hBsQy'),
  ep('2026-07-12 20:00:00'),
  ep('2026-07-12 20:00:00')
]) . ')';

echo "SQL: " . substr($sql, 0, 100) . "...\n";
if ($conn->query($sql)) {
    echo "[OK] Insert succeeded! affected_rows=" . $conn->affected_rows . "\n";
} else {
    echo "[FAIL] Insert failed: " . $conn->error . "\n";
}

// Clean up
$conn->query("DELETE FROM User WHERE id = 'test-001'");
echo "[OK] Test row deleted\n\n";

// Now check Property table
$r = $conn->query("SHOW TABLES LIKE 'Property'");
echo "Property table exists: " . ($r && $r->num_rows > 0 ? "YES" : "NO") . "\n";

$r = $conn->query("SELECT COUNT(*) as c FROM Property");
if ($r) {
    $row = $r->fetch_assoc();
    echo "Current Property count: " . $row['c'] . "\n";
} else {
    echo "Property select failed: " . $conn->error . "\n";
}

$conn->close();
echo "\nDone.\n";
