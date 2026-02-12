<?php
require_once 'api/db.php';

echo "<h2>Login System Test</h2>";

// Check if users table exists and has data
try {
    $stmt = $pdo->query("SELECT username, role FROM users");
    $users = $stmt->fetchAll();
    
    echo "<h3>Available Users:</h3>";
    foreach ($users as $user) {
        echo "- {$user['username']} ({$user['role']})<br>";
    }
    
    // Test password verification
    echo "<h3>Password Test:</h3>";
    $testUser = $pdo->prepare("SELECT password FROM users WHERE username = 'manager'");
    $testUser->execute();
    $result = $testUser->fetch();
    
    if ($result) {
        $isPlainText = ($result['password'] === 'manager');
        echo "Manager password is " . ($isPlainText ? "PLAIN TEXT (needs fixing)" : "HASHED (secure)") . "<br>";
        
        if ($isPlainText) {
            echo "<br><strong style='color: red;'>⚠️ Run fix-passwords.php to secure the passwords!</strong><br>";
        } else {
            echo "<br><strong style='color: green;'>✅ Passwords are properly hashed</strong><br>";
        }
    }
    
} catch (Exception $e) {
    echo "Database error: " . $e->getMessage();
}
?>