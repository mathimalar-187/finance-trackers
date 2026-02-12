<?php
require_once 'api/db.php';

// Create users with correct password hash for 'password'
$users = [
    ['admin', 'admin@test.com', 'admin'],
    ['manager', 'manager@test.com', 'manager'], 
    ['user', 'user@test.com', 'user'],
    ['final', 'final@test.com', 'final']
];

try {
    $pdo->exec("DELETE FROM users");
    
    foreach ($users as $userData) {
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $userData[0], 
            $userData[1], 
            password_hash('password', PASSWORD_DEFAULT), 
            $userData[2]
        ]);
    }
    
    echo "Setup complete! Login with:<br>";
    echo "admin/password<br>";
    echo "manager/password<br>";
    echo "user/password<br>";
    echo "final/password<br>";
    echo "<a href='login.html'>Login</a>";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>