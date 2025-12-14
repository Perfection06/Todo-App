<?php
require_once __DIR__ . "/../db.php";


$data = json_decode(file_get_contents("php://input"));

$title = $data->title ?? "";
$description = $data->description ?? "";

$stmt = $conn->prepare("INSERT INTO task (title, description) VALUES (?, ?)");
$stmt->bind_param("ss", $title, $description);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
