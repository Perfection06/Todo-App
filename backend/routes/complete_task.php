<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . "/../db.php";

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "Task ID required"]);
    exit;
}

$id = intval($_GET['id']);

$sql = "UPDATE task SET completed = 1 WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Task marked as complete"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to complete task"]);
}

$stmt->close();
$conn->close();
?>