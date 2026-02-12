<?php
echo "<h2>🔍 Login System Diagnostics</h2>";

// Check if database connection works
try {
    require_once 'api/db.php';
    echo "<p style='color: green;'>✓ Database connection successful</p>";
    
    // Check users table
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $userCount = $stmt->fetch()['count'];
    echo "<p style='color: green;'>✓ Users table exists with {$userCount} users</p>";
    
    // List all users
    $stmt = $pdo->query("SELECT username, role FROM users ORDER BY role, username");
    $users = $stmt->fetchAll();
    
    echo "<h3>Available Users:</h3>";
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th style='padding: 8px;'>Username</th><th style='padding: 8px;'>Role</th><th style='padding: 8px;'>Test Login</th></tr>";
    
    foreach ($users as $user) {
        echo "<tr>";
        echo "<td style='padding: 8px;'>{$user['username']}</td>";
        echo "<td style='padding: 8px;'>{$user['role']}</td>";
        echo "<td style='padding: 8px;'><button onclick=\"testLogin('{$user['username']}')\">Test</button></td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // Check transactions table
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM transactions");
    $transactionCount = $stmt->fetch()['count'];
    echo "<p style='color: green;'>✓ Transactions table exists with {$transactionCount} transactions</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database error: " . $e->getMessage() . "</p>";
    echo "<p><strong>Solution:</strong> Run <a href='fix-login.php'>fix-login.php</a> to set up the database</p>";
}

// Check if login API is accessible
echo "<h3>API Test:</h3>";
echo "<div id='api-test'>";
echo "<button onclick='testAPI()'>Test Login API</button>";
echo "<div id='api-result'></div>";
echo "</div>";

echo "<br><div style='background: #fff3cd; padding: 15px; border-radius: 5px; border: 1px solid #ffeaa7;'>";
echo "<h3>🛠️ Quick Fixes:</h3>";
echo "<ul>";
echo "<li><a href='fix-login.php'>Run Database Setup</a> - Creates tables and users</li>";
echo "<li><a href='test-db.php'>Test Database Connection</a> - Verify database is working</li>";
echo "<li><a href='login.html'>Go to Login Page</a> - Try logging in</li>";
echo "</ul>";
echo "</div>";
?>

<script>
function testLogin(username) {
    const password = username; // Default password same as username
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    fetch('api/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`✓ Login successful for ${username}!`);
        } else {
            alert(`❌ Login failed for ${username}: ${data.message}`);
        }
    })
    .catch(error => {
        alert(`❌ Network error: ${error.message}`);
    });
}

function testAPI() {
    const resultDiv = document.getElementById('api-result');
    resultDiv.innerHTML = 'Testing...';
    
    fetch('api/login.php', {
        method: 'POST',
        body: new FormData()
    })
    .then(response => {
        if (response.ok) {
            resultDiv.innerHTML = '<p style="color: green;">✓ Login API is accessible</p>';
        } else {
            resultDiv.innerHTML = '<p style="color: red;">❌ API returned error: ' + response.status + '</p>';
        }
    })
    .catch(error => {
        resultDiv.innerHTML = '<p style="color: red;">❌ Cannot reach API: ' + error.message + '</p>';
    });
}
</script>