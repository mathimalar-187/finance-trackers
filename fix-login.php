<?php
require_once 'api/db.php';

echo "<h2>🔧 Login System Fix</h2>";

try {
    // Check if users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() == 0) {
        echo "<p style='color: orange;'>⚠️ Users table doesn't exist. Creating...</p>";
        
        // Create users table
        $pdo->exec("CREATE TABLE users (
            id int(11) NOT NULL AUTO_INCREMENT,
            username varchar(50) NOT NULL UNIQUE,
            email varchar(100) NOT NULL,
            password varchar(255) NOT NULL,
            role enum('admin','manager','user','final') NOT NULL DEFAULT 'user',
            created_at timestamp NOT NULL DEFAULT current_timestamp(),
            PRIMARY KEY (id)
        )");
        echo "<p style='color: green;'>✓ Users table created</p>";
    }
    
    // Check if transactions table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'transactions'");
    if ($stmt->rowCount() == 0) {
        echo "<p style='color: orange;'>⚠️ Transactions table doesn't exist. Creating...</p>";
        
        // Create transactions table
        $pdo->exec("CREATE TABLE transactions (
            id int(11) NOT NULL AUTO_INCREMENT,
            user_id int(11) NOT NULL,
            description varchar(255) NOT NULL,
            amount decimal(10,2) NOT NULL,
            type enum('income','expense') NOT NULL,
            date date NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )");
        echo "<p style='color: green;'>✓ Transactions table created</p>";
    }
    
    // Clear existing users and create new ones with proper hashed passwords
    $pdo->exec("DELETE FROM users");
    
    $users = [
        ['admin', 'admin@test.com', 'admin', 'admin'],
        ['manager', 'manager@test.com', 'manager', 'manager'],
        ['user', 'user@test.com', 'user', 'user'],
        ['final', 'final@test.com', 'final', 'final']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
    
    foreach ($users as $userData) {
        $hashedPassword = password_hash($userData[2], PASSWORD_DEFAULT);
        $stmt->execute([$userData[0], $userData[1], $hashedPassword, $userData[3]]);
        echo "<p style='color: green;'>✓ Created user: {$userData[0]} (role: {$userData[3]})</p>";
    }
    
    echo "<br><div style='background: #d4edda; padding: 15px; border-radius: 5px; border: 1px solid #c3e6cb;'>";
    echo "<h3 style='color: #155724; margin-top: 0;'>🎉 Login System Fixed Successfully!</h3>";
    echo "<p><strong>Login Credentials:</strong></p>";
    echo "<ul>";
    echo "<li><strong>admin</strong> / admin (Admin role)</li>";
    echo "<li><strong>manager</strong> / manager (Manager role)</li>";
    echo "<li><strong>user</strong> / user (User role)</li>";
    echo "<li><strong>final</strong> / final (Final role)</li>";
    echo "</ul>";
    echo "<p><a href='login.html' style='background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;'>🚀 Go to Login Page</a></p>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
    echo "<p>Please check your database connection and try again.</p>";
}
?>