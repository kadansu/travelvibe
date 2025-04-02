<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$database = "travelvibe";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$destination_name = $_POST['destination_name'] ?? null;
$action = $_POST['action'] ?? null;

// Validate inputs
if (empty($destination_name) || !in_array($action, ['add', 'remove'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit();
}

// Retrieve destination_id based on destination_name
$sql = "SELECT id FROM destinations WHERE name = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $destination_name);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Destination not found"]);
    exit();
}

$row = $result->fetch_assoc();
$destination_id = $row['id'];

if ($action === 'add') {
    // Insert into wishlist
    $sql = "INSERT INTO wishlist (user_id, destination_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $user_id, $destination_id);
    if ($stmt->execute()) {
        echo json_encode(["success" => "Destination added to wishlist"]);
    } else {
        echo json_encode(["error" => "Failed to add destination to wishlist"]);
    }
} elseif ($action === 'remove') {
    // Remove from wishlist
    $sql = "DELETE FROM wishlist WHERE user_id = ? AND destination_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $user_id, $destination_id);
    if ($stmt->execute()) {
        echo json_encode(["success" => "Destination removed from wishlist"]);
    } else {
        echo json_encode(["error" => "Failed to remove destination from wishlist"]);
    }
}

$stmt->close();
$conn->close();
?>
