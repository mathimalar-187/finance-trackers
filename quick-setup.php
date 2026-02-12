<?php
require_once 'api/db.php';

try {
    // Clear and recreate users
    $pdo->exec("DELETE FROM users");
    
    // Create users with plain text passwords
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
    
    $stmt->execute(['admin', 'admin@test.com', 'admin', 'admin']);
    $stmt->execute(['manager', 'manager@test.com', 'manager', 'manager']);
    $stmt->execute(['user', 'user@test.com', 'user', 'user']);
     $stmt->execute(['final', 'finalr@test.com', 'final', 'final']);
    
    echo "✓ Users created successfully!<br><br>";
    echo "<strong>Login Credentials:</strong><br>";
    echo "Username: admin, Password: admin<br>";
    echo "Username: manager, Password: manager<br>";
    echo "Username: user, Password: user<br><br>";
      echo "Username: final, Password: final<br><br>";
    echo "<a href='login.html' style='background:#007bff;color:white;padding:10px;text-decoration:none;border-radius:5px;'>Go to Login Page</a>";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>