<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . "/../db.php";

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid task ID"]);
    exit;
}

$sql = "DELETE FROM task WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Task deleted"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete task"]);
}

$stmt->close();
$conn->close();
?>