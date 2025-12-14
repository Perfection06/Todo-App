<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . "/../db.php";

$sql = "SELECT * FROM task WHERE completed = 0 ORDER BY created_at DESC";
$result = $conn->query($sql);

$tasks = [];

while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode($tasks);

$conn->close();
?>