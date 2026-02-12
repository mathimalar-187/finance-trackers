<?php
require_once 'api/db.php';

// Update existing plain text passwords to hashed versions
$users = [
    ['username' => 'superadmin', 'password' => 'superadmin'],
    ['username' => 'admin', 'password' => 'admin'],
    ['username' => 'manager', 'password' => 'manager'],
    ['username' => 'user', 'password' => 'user'],
    ['username' => 'final', 'password' => 'final']
];

foreach ($users as $user) {
    $hashedPassword = password_hash($user['password'], PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = ?");
    $stmt->execute([$hashedPassword, $user['username']]);
    echo "Updated password for: " . $user['username'] . "<br>";
}

echo "<br><strong>All passwords have been hashed successfully!</strong><br>";
echo "<br>Login credentials:<br>";
echo "- superadmin / superadmin<br>";
echo "- admin / admin<br>";
echo "- manager / manager<br>";
echo "- user / user<br>";
echo "- final / final<br>";
?>