<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Database connection
$host = 'localhost';
$dbname = 'finance_tracker';
$username = 'root';
$password = 'mysql';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Validate input
$id = $_POST['id'] ?? '';
$description = $_POST['description'] ?? '';
$amount = $_POST['amount'] ?? '';
$type = $_POST['type'] ?? '';
$date = $_POST['date'] ?? '';

if (empty($id) || empty($description) || empty($amount) || empty($type) || empty($date)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

if (!is_numeric($amount) || $amount <= 0) {
    echo json_encode(['success' => false, 'message' => 'Amount must be a positive number']);
    exit;
}

if (!in_array($type, ['income', 'expense'])) {
    echo json_encode(['success' => false, 'message' => 'Type must be income or expense']);
    exit;
}

try {
    // Update the transaction
    $stmt = $pdo->prepare("UPDATE transactions SET description = ?, amount = ?, type = ?, date = ? WHERE id = ?");
    $stmt->execute([$description, $amount, $type, $date, $id]);
    
    if ($stmt->rowCount() > 0) {
        // Fetch the updated transaction
        $stmt = $pdo->prepare("SELECT * FROM transactions WHERE id = ?");
        $stmt->execute([$id]);
        $transaction = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Transaction updated successfully',
            'data' => $transaction
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Transaction not found or no changes made']);
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>