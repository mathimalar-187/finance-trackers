<?php
header('Content-Type: application/json');
require_once 'db.php';

$all = $_GET['all'] ?? null;
$user_id = $_GET['user_id'] ?? 1;

try {
    if ($all) {
        // Return all transactions with user info for admin/manager
        $stmt = $pdo->prepare("SELECT t.*, u.username FROM transactions t JOIN users u ON t.user_id = u.id ORDER BY t.date DESC");
        $stmt->execute();
    } else {
        // Return transactions for specific user
        $stmt = $pdo->prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC");
        $stmt->execute([$user_id]);
    }
    
    $transactions = $stmt->fetchAll();
    echo json_encode($transactions);
} catch (Exception $e) {
    echo json_encode([]);
}
?>