<?php
/**
 * FINAL DIAGNOSIS — checks if Node app is running and responding
 * 
 * Usage: php final-check.php
 */

echo "═══════════════════════════════════════════════════════\n";
echo "  FINAL DIAGNOSIS\n";
echo "═══════════════════════════════════════════════════════\n\n";

// ─── 1. Check if port 3000 is listening ───
echo "[1/5] Checking if app is running on port 3000...\n";
$fp = @fsockopen('127.0.0.1', 3000, $errno, $errstr, 3);
if ($fp) {
    fclose($fp);
    echo "      ✅ Port 3000 is OPEN (app running)\n";
} else {
    echo "      ❌ Port 3000 CLOSED — app NOT running!\n";
    echo "      Error: $errstr ($errno)\n";
}
echo "\n";

// ─── 2. Try calling the app directly ───
echo "[2/5] Testing app via HTTP...\n";
$ch = curl_init('http://127.0.0.1:3000/api/auth/providers');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Host: localhost']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo "      ❌ CURL ERROR: $curlError\n";
} else {
    echo "      HTTP code: $httpCode\n";
    echo "      Response: " . substr($response, 0, 200) . "\n";
}
echo "\n";

// ─── 3. Test site-settings API (tests DB connection) ───
echo "[3/5] Testing /api/public/site-settings (tests DB)...\n";
$ch = curl_init('http://127.0.0.1:3000/api/public/site-settings');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Host: localhost']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo "      ❌ CURL ERROR: $curlError\n";
} else {
    echo "      HTTP code: $httpCode\n";
    if ($httpCode === 200) {
        echo "      ✅ DB connection working!\n";
        echo "      Response: " . substr($response, 0, 300) . "\n";
    } else {
        echo "      ❌ DB connection FAILED\n";
        echo "      Response: " . substr($response, 0, 300) . "\n";
    }
}
echo "\n";

// ─── 4. Test login endpoint directly ───
echo "[4/5] Testing NextAuth credentials endpoint...\n";

// First get CSRF token
$ch = curl_init('http://127.0.0.1:3000/api/auth/csrf');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Host: localhost']);
curl_setopt($ch, CURLOPT_COOKIEJAR, '/tmp/cookies_test.txt');
curl_setopt($ch, CURLOPT_COOKIEFILE, '/tmp/cookies_test.txt');
$csrfResponse = curl_exec($ch);
curl_close($ch);

$csrfData = json_decode($csrfResponse, true);
$csrfToken = $csrfData['csrfToken'] ?? '';

if (empty($csrfToken)) {
    echo "      ❌ Could not get CSRF token\n";
    echo "      Response: " . substr($csrfResponse, 0, 200) . "\n";
} else {
    echo "      Got CSRF token: " . substr($csrfToken, 0, 20) . "...\n";
    
    // Now try login
    $postData = http_build_query([
        'email' => 'admin@royaljubilant.ae',
        'password' => 'admin123',
        'portal' => 'admin',
        'csrfToken' => $csrfToken,
        'callbackUrl' => 'http://localhost:3000/admin',
        'json' => 'true'
    ]);
    
    $ch = curl_init('http://127.0.0.1:3000/api/auth/callback/credentials');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Host: localhost', 'Content-Type: application/x-www-form-urlencoded']);
    curl_setopt($ch, CURLOPT_COOKIEJAR, '/tmp/cookies_test.txt');
    curl_setopt($ch, CURLOPT_COOKIEFILE, '/tmp/cookies_test.txt');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    $loginResponse = curl_exec($ch);
    $loginCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "      Login HTTP code: $loginCode\n";
    echo "      Login response: " . substr($loginResponse, 0, 300) . "\n";
    
    // Check session
    $ch = curl_init('http://127.0.0.1:3000/api/auth/session');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Host: localhost']);
    curl_setopt($ch, CURLOPT_COOKIEJAR, '/tmp/cookies_test.txt');
    curl_setopt($ch, CURLOPT_COOKIEFILE, '/tmp/cookies_test.txt');
    $sessionResponse = curl_exec($ch);
    curl_close($ch);
    echo "      Session: " . substr($sessionResponse, 0, 300) . "\n";
}
echo "\n";

// ─── 5. Check app processes ───
echo "[5/5] Checking running processes...\n";
exec('ps aux | grep -E "node|next" | grep -v grep', $procs);
if (empty($procs)) {
    echo "      ❌ No Node.js processes running!\n";
} else {
    foreach ($procs as $p) {
        echo "      " . substr($p, 0, 150) . "\n";
    }
}
echo "\n";

// ─── 6. Check passenger config ───
echo "[6/5] Checking Passenger/app config...\n";
$passengerFile = __DIR__ . '/.htaccess';
if (file_exists($passengerFile)) {
    echo "      .htaccess content:\n";
    echo "      " . str_replace("\n", "\n      ", file_get_contents($passengerFile)) . "\n";
}

// Check for app config
$files = glob(__DIR__ . '/.builds/config/*');
if (!empty($files)) {
    foreach ($files as $f) {
        echo "      Config file: " . basename($f) . "\n";
        echo "      " . str_replace("\n", "\n      ", file_get_contents($f)) . "\n";
    }
}

@unlink('/tmp/cookies_test.txt');

echo "\n═══════════════════════════════════════════════════════\n";
echo "  DIAGNOSIS COMPLETE — send output to AI\n";
echo "═══════════════════════════════════════════════════════\n";
