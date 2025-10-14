<?php
require_once 'api/db.php';

echo "<h2>Finance Tracker Setup</h2>";

try {
    // Read and execute the SQL setup file
    $sql = file_get_contents('setup.sql');
    
    // Split SQL into individual statements
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $pdo->exec($statement);
        }
    }
    
    echo "<p style='color: green;'>✓ Database setup completed successfully!</p>";
    echo "<p>Default users created:</p>";
    echo "<ul>";
    echo "<li><strong>Admin:</strong> username='admin', password='admin'</li>";
    echo "<li><strong>Manager:</strong> username='manager', password='manager'</li>";
    echo "<li><strong>User:</strong> username='user', password='user'</li>";
    echo "</ul>";
    echo "<p><a href='login.html'>Go to Login Page</a></p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Setup failed: " . $e->getMessage() . "</p>";
}
?>