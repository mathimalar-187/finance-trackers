<?php
// Generate correct password hash for admin123
$password = 'admin123';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "<h2>Password Hash Generator</h2>";
echo "<p>Password: <strong>$password</strong></p>";
echo "<p>Hash: <strong>$hash</strong></p>";
echo "<br>";
echo "<p>Copy this hash and update the setup.sql file:</p>";
echo "<textarea style='width: 100%; height: 100px;'>INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES
('admin', 'admin@finance.com', '$hash', 'admin');</textarea>";
?>