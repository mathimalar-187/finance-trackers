<?php
require_once 'api/db.php';

echo "<h2>Database Connection Test</h2>";

try {
    // Test PDO connection
    $stmt = $pdo->query("SELECT 1");
    echo "<p style='color: green;'>✓ PDO Connection successful</p>";
    
    // Check if users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✓ Users table exists</p>";
        
        // Check admin user
        $stmt = $pdo->prepare("SELECT username, role FROM users WHERE username = 'admin'");
        $stmt->execute();
        $admin = $stmt->fetch();
        
        if ($admin) {
            echo "<p style='color: green;'>✓ Admin user exists: " . $admin['username'] . " (" . $admin['role'] . ")</p>";
        } else {
            echo "<p style='color: red;'>✗ Admin user not found</p>";
        }
        
        // Check manager user
        $stmt = $pdo->prepare("SELECT username, role FROM users WHERE username = 'manager'");
        $stmt->execute();
        $manager = $stmt->fetch();
        
        if ($manager) {
            echo "<p style='color: green;'>✓ Manager user exists: " . $manager['username'] . " (" . $manager['role'] . ")</p>";
        } else {
            echo "<p style='color: red;'>✗ Manager user not found</p>";
        }
    } else {
        echo "<p style='color: red;'>✗ Users table does not exist</p>";
    }
    $stmt = $pdo->prepare("SELECT username, role FROM users WHERE username = 'final'");
        $stmt->execute();
        $final = $stmt->fetch();
        
        if ($final) {
            echo "<p style='color: green;'>✓ final user exists: " . $final['username'] . " (" . $final['role'] . ")</p>";
        } else {
            echo "<p style='color: red;'>✗ final user not found</p>";
        }
    
    // Check transactions table
    $stmt = $pdo->query("SHOW TABLES LIKE 'transactions'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✓ Transactions table exists</p>";
    } else {
        echo "<p style='color: red;'>✗ Transactions table does not exist</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Error: " . $e->getMessage() . "</p>";
}

echo "<br><h3>Next Steps:</h3>";
echo "<ol>";
echo "<li>If tables don't exist, run the setup.sql file in your MySQL database</li>";
echo "<li>Default admin login: username='admin', password='admin'</li>";
echo "<li>Default manager login: username='manager', password='manager'</li>";
echo "<li>Default user login: username='user', password='user'</li>";
echo "<li>Default final login: username='final', password='final'</li>";
echo "<li>Access the app at <a href='login.html'>login.html</a></li>";
echo "</ol>";
?>