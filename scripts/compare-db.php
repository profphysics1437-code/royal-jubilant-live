<?php
/**
 * COMPARE LOCAL vs HOSTINGER — what's actually in MySQL
 * Run: php compare-db.php
 */

$MYSQL_HOST = 'localhost';
$MYSQL_DB   = 'u432212399_rjcom';
$MYSQL_USER = 'u432212399_adminrjcom';
$MYSQL_PASS = 'Admin@2026@#';

echo "═══════════════════════════════════════════════════════\n";
echo "  HOSTINGER MYSQL — FULL DATABASE CHECK\n";
echo "═══════════════════════════════════════════════════════\n\n";

$conn = new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB);
if ($conn->connect_error) {
    die("FAIL: " . $conn->connect_error . "\n");
}

// ─── 1. List all tables ───
echo "[1] ALL TABLES IN MYSQL:\n";
$r = $conn->query("SHOW TABLES");
$tables = [];
while ($row = $r->fetch_array()) {
    $tables[] = $row[0];
}
if (empty($tables)) {
    echo "   ⚠️  NO TABLES in MySQL database!\n";
    echo "   This means Prisma never pushed schema.\n";
} else {
    foreach ($tables as $t) {
        $count = $conn->query("SELECT COUNT(*) as c FROM `$t`")->fetch_assoc()['c'];
        echo "   - $t: $count rows\n";
    }
}
echo "\n";

// ─── 2. Properties ───
if (in_array('Property', $tables)) {
    echo "[2] ALL PROPERTIES IN MYSQL:\n";
    $r = $conn->query("SELECT reference, title, reraNumber, status, published, isLatest FROM Property ORDER BY createdAt DESC");
    if ($r && $r->num_rows > 0) {
        while ($row = $r->fetch_assoc()) {
            echo "   - " . $row['reference'] . " | " . substr($row['title'], 0, 40) . " | RERA: " . ($row['reraNumber'] ?: 'NULL') . " | " . $row['status'] . " | Pub:" . $row['published'] . " | Latest:" . $row['isLatest'] . "\n";
        }
    } else {
        echo "   ⚠️  NO PROPERTIES in MySQL!\n";
    }
    echo "\n";
}

// ─── 3. Users ───
if (in_array('User', $tables)) {
    echo "[3] USERS:\n";
    $r = $conn->query("SELECT email, role FROM User");
    while ($row = $r->fetch_assoc()) {
        echo "   - " . $row['email'] . " (" . $row['role'] . ")\n";
    }
    echo "\n";
}

// ─── 4. Agents ───
if (in_array('Agent', $tables)) {
    echo "[4] AGENTS:\n";
    $r = $conn->query("SELECT name, email FROM Agent");
    while ($row = $r->fetch_assoc()) {
        echo "   - " . $row['name'] . " (" . $row['email'] . ")\n";
    }
    echo "\n";
}

// ─── 5. Menu Items ───
if (in_array('MenuItem', $tables)) {
    echo "[5] MENU ITEMS:\n";
    $r = $conn->query("SELECT label, view, parentId, `order` FROM MenuItem WHERE menu='main' ORDER BY `order`");
    while ($row = $r->fetch_assoc()) {
        echo "   - " . $row['label'] . " (view:" . ($row['view'] ?: '-') . ", parent:" . ($row['parentId'] ?: 'TOP') . ", order:" . $row['order'] . ")\n";
    }
    echo "\n";
}

$conn->close();

echo "═══════════════════════════════════════════════════════\n";
echo "  CHECK COMPLETE — send this output to AI\n";
echo "═══════════════════════════════════════════════════════\n";
