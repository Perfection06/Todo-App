<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . "/../db.php";

$sql = "SELECT COUNT(*) as uncompleted_count FROM task WHERE completed = 0";
$result = $conn->query($sql);

$row = $result->fetch_assoc();

echo json_encode([
    "uncompleted_count" => $row['uncompleted_count']
]);

$conn->close();
?>