<?php
/**
 * ROYAL JUBILANT — DIAGNOSTIC SCRIPT
 * Run: php diagnose.php
 * 
 * Checks:
 * 1. MySQL connection
 * 2. All tables in database
 * 3. Admin user record
 * 4. Password hash verification
 * 5. App files
 * 6. Schema provider
 */

$MYSQL_HOST = 'localhost';
$MYSQL_DB   = 'u432212399_rjcom';
$MYSQL_USER = 'u432212399_adminrjcom';
$MYSQL_PASS = 'Admin@2026@#';

$ADMIN_EMAIL = 'admin@royaljubilant.ae';
$ADMIN_PASSWORD = 'admin123';

echo "═══════════════════════════════════════════════════════\n";
echo "  ROYAL JUBILANT — DIAGNOSTIC\n";
echo "═══════════════════════════════════════════════════════\n\n";

// ─── 1. MySQL Connection ───
echo "[1] Testing MySQL connection...\n";
$conn = @new mysqli($MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB);
if ($conn->connect_error) {
    echo "    ❌ FAIL: " . $conn->connect_error . "\n";
    exit(1);
}
echo "    ✅ Connected\n\n";

// ─── 2. All Tables ───
echo "[2] Listing all tables in '$MYSQL_DB'...\n";
$r = $conn->query("SHOW TABLES");
$tables = [];
if ($r) {
    while ($row = $r->fetch_array()) {
        $tables[] = $row[0];
    }
}
if (empty($tables)) {
    echo "    ⚠️  NO TABLES FOUND in database!\n";
    echo "    This means Prisma hasn't pushed schema yet.\n\n";
} else {
    echo "    Found " . count($tables) . " tables:\n";
    foreach ($tables as $t) {
        echo "      - $t\n";
    }
    echo "\n";
}

// ─── 3. User Table Check ───
echo "[3] Checking User table...\n";
$userTable = null;
foreach (['User', 'user'] as $t) {
    $r = $conn->query("SHOW TABLES LIKE '$t'");
    if ($r && $r->num_rows > 0) {
        $userTable = $t;
        break;
    }
}

if (!$userTable) {
    echo "    ❌ User table does NOT exist!\n\n";
} else {
    echo "    ✅ User table found: $userTable\n";
    
    // Count users
    $r = $conn->query("SELECT COUNT(*) as cnt FROM `$userTable`");
    $cnt = $r ? $r->fetch_assoc()['cnt'] : 0;
    echo "    Total users: $cnt\n";
    
    // Count admins
    $stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM `$userTable` WHERE role = 'admin'");
    $stmt->execute();
    $r = $stmt->get_result();
    $adminCnt = $r ? $r->fetch_assoc()['cnt'] : 0;
    $stmt->close();
    echo "    Admin users: $adminCnt\n\n";
    
    // Show admin user details
    if ($adminCnt > 0) {
        echo "[4] Admin user record:\n";
        $stmt = $conn->prepare("SELECT id, email, name, role, passwordHash, createdAt FROM `$userTable` WHERE email = ?");
        $stmt->bind_param('s', $ADMIN_EMAIL);
        $stmt->execute();
        $r = $stmt->get_result();
        if ($row = $r->fetch_assoc()) {
            echo "    ID:        " . $row['id'] . "\n";
            echo "    Email:     " . $row['email'] . "\n";
            echo "    Name:      " . $row['name'] . "\n";
            echo "    Role:      " . $row['role'] . "\n";
            echo "    Hash:      " . substr($row['passwordHash'], 0, 40) . "...\n";
            echo "    Created:   " . $row['createdAt'] . "\n";
            
            // Verify password
            echo "\n[5] Password verification:\n";
            echo "    Testing password '$ADMIN_PASSWORD' against hash...\n";
            $ok = password_verify($ADMIN_PASSWORD, $row['passwordHash']);
            if ($ok) {
                echo "    ✅ Password MATCHES (PHP verification)\n";
            } else {
                echo "    ❌ Password does NOT match!\n";
            }
            
            // Check hash prefix
            $prefix = substr($row['passwordHash'], 0, 4);
            echo "    Hash prefix: $prefix\n";
            if ($prefix === '$2y$') {
                echo "    ℹ️  This is PHP-format hash. Node.js bcryptjs should support it.\n";
            } elseif ($prefix === '$2b$') {
                echo "    ℹ️  This is Node.js-format hash. Fully compatible.\n";
            } elseif ($prefix === '$2a$') {
                echo "    ℹ️  This is older bcrypt format. Should work.\n";
            } else {
                echo "    ⚠️  Unknown hash format!\n";
            }
        } else {
            echo "    ❌ Admin user with email $ADMIN_EMAIL NOT FOUND!\n";
        }
        $stmt->close();
    }
}

$conn->close();

// ─── 6. App Files Check ───
echo "\n[6] Checking app files in .builds/last-source/...\n";
$base = '.builds/last-source';
$files = [
    '.env' => 'Environment file',
    'app-hostinger.js' => 'App entry point',
    'package.json' => 'Package config',
    'prisma/schema.prisma' => 'Prisma schema',
    '.next' => 'Next.js build (directory)',
    'node_modules' => 'Dependencies (directory)',
];

foreach ($files as $f => $desc) {
    $path = "$base/$f";
    if (file_exists($path)) {
        $size = is_dir($path) ? '(dir)' : filesize($path) . ' bytes';
        echo "    ✅ $desc: exists ($size)\n";
    } else {
        echo "    ❌ $desc: MISSING\n";
    }
}

// ─── 7. Schema Provider ───
echo "\n[7] Prisma schema provider:\n";
$schema = file_get_contents("$base/prisma/schema.prisma");
if (preg_match('/provider\s*=\s*"(\w+)"/', $schema, $m)) {
    echo "    Provider: " . $m[1] . "\n";
    if ($m[1] === 'mysql') {
        echo "    ✅ Correct (MySQL)\n";
    } elseif ($m[1] === 'sqlite') {
        echo "    ⚠️  SQLite! App expects SQLite but DB is MySQL. THIS IS THE PROBLEM!\n";
    }
}

// ─── 8. .env content ───
echo "\n[8] .env file content:\n";
$env = file_get_contents("$base/.env");
echo $env . "\n";

// ─── 9. App Logs ───
echo "\n[9] Recent app logs (last 30 lines):\n";
$logDir = '.builds/logs';
if (is_dir($logDir)) {
    $logs = glob("$logDir/*.log");
    if (!empty($logs)) {
        $latest = end($logs);
        echo "    Latest log: $latest\n";
        $content = file_get_contents($latest);
        $lines = explode("\n", $content);
        $start = max(0, count($lines) - 30);
        for ($i = $start; $i < count($lines); $i++) {
            echo "    " . $lines[$i] . "\n";
        }
    } else {
        echo "    No log files found\n";
    }
} else {
    echo "    Log directory not found\n";
}

echo "\n═══════════════════════════════════════════════════════\n";
echo "  DIAGNOSTIC COMPLETE\n";
echo "═══════════════════════════════════════════════════════\n";
