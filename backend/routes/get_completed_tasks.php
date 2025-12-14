<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . "/../db.php";

$sql = "SELECT * FROM task WHERE completed = 1 ORDER BY created_at DESC";
$result = $conn->query($sql);

$tasks = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
}

echo json_encode($tasks);

$conn->close();
?>