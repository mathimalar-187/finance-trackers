<?php
header('Content-Type: application/json');
require_once 'db.php';

// Get POST data
 $id = $_POST['id'];

// Prepare and bind
 $stmt = $conn->prepare("DELETE FROM transactions WHERE id = ?");
 $stmt->bind_param("i", $id);

// Execute and check
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $stmt->error]);
}

 $stmt->close();
 $conn->close();
?>