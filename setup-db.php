<?php
require_once 'api/db.php';

// Create users table
$pdo->exec("DROP TABLE IF EXISTS transactions");
$pdo->exec("DROP TABLE IF EXISTS users");

$pdo->exec("CREATE TABLE users (
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(50) NOT NULL UNIQUE,
    email varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    role enum('admin','manager','user','final') NOT NULL DEFAULT 'user',
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (id)
)");

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

// Insert users with correct password hash
$users = [
    ['admin', 'admin@test.com', 'password', 'admin'],
    ['manager', 'manager@test.com', 'password', 'manager'],
    ['user', 'user@test.com', 'password', 'user'],
     ['final', 'finalr@test.com', 'password', 'final']
];

foreach ($users as $userData) {
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $userData[0], 
        $userData[1], 
        password_hash($userData[2], PASSWORD_DEFAULT), 
        $userData[3]
    ]);
}

echo "Database setup complete!<br>";
echo "Login credentials:<br>";
echo "admin/password<br>";
echo "manager/password<br>";
echo "user/password<br>";
echo "final/password<br>";
echo "<br><a href='login.html'>Go to Login</a>";
?>