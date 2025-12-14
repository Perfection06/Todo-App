<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . "/../db.php";

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "Task ID required"]);
    exit;
}

$id = intval($_GET['id']);

// Get JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['title'])) {
    echo json_encode(["success" => false, "message" => "Title is required"]);
    exit;
}

$title = $input['title'];
$description = $input['description'] ?? '';

$sql = "UPDATE task SET title = ?, description = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $title, $description, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Task updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update task"]);
}

$stmt->close();
$conn->close();
?>