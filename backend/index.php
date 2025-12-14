<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$fullUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$path = str_replace("/todo_app/backend", "", $fullUri);

if ($path === "/tasks") {
    require __DIR__ . "/routes/get_tasks.php";
    exit;
}

if ($path === "/tasks/uncompleted") {
    require __DIR__ . "/routes/uncompleted.php";
    exit;
}

if ($path === "/tasks/completed") {
    require __DIR__ . "/routes/get_completed_tasks.php";
    exit;
}

if ($path === "/tasks/count") {
    require __DIR__ . "/routes/count.php";
    exit;
}

if ($path === "/tasks/create") {
    require __DIR__ . "/routes/create_task.php";
    exit;
}

if (preg_match("#^/tasks/complete/(\d+)$#", $path, $matches)) {
    $_GET['id'] = $matches[1];
    require __DIR__ . "/routes/complete_task.php";
    exit;
}

if (preg_match("#^/tasks/delete/(\d+)$#", $path, $matches)) {
    $_GET['id'] = $matches[1];
    require __DIR__ . "/routes/delete.php";
    exit;
}

if (preg_match("#^/tasks/update/(\d+)$#", $path, $matches)) {
    $_GET['id'] = $matches[1];
    require __DIR__ . "/routes/update_task.php";
    exit;
}

echo json_encode(["message" => "API is running"]);