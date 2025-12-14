<?php
require_once __DIR__ . "/../db.php";

$sql = "SELECT * FROM task ORDER BY created_at DESC";
$result = $conn->query($sql);

$tasks = [];

while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode($tasks);