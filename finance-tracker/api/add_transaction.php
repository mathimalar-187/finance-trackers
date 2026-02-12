<?php
header('Content-Type: application/json');
require_once 'db.php';

session_start();

$description = $_POST['description'] ?? '';
$amount = $_POST['amount'] ?? 0;
$type = $_POST['type'] ?? '';
$date = $_POST['date'] ?? '';
$user_id = $_POST['user_id'] ?? 1; // Default to user 1 if not provided

try {
    $stmt = $pdo->prepare("INSERT INTO transactions (user_id, description, amount, type, date) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $description, $amount, $type, $date]);
    
    $new_id = $pdo->lastInsertId();
    
    $stmt = $pdo->prepare("SELECT * FROM transactions WHERE id = ?");
    $stmt->execute([$new_id]);
    $new_transaction = $stmt->fetch();
    
    echo json_encode(['success' => true, 'data' => $new_transaction]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>