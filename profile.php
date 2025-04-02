<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$database = "travelvibe";

// Connect to the database
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

// Check if user is logged in
// if (!isset($_SESSION['user_id'])) {
//     echo json_encode(["error" => "User not logged in"]);
//     exit();
// }

$user_id = $_SESSION['user_id'];

// If it's a GET request, return user details
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $userData = [
        "name" => $_SESSION['user_name'],
        "email" => $_SESSION['user_email'],
        "phone" => $_SESSION['user_phone']
    ];
    echo json_encode($userData);
}

// If it's a POST request, update user details
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST['name'];
    $phone = $_POST['phone'];

    $sql = "UPDATE users SET name=?, phone=? WHERE user_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $name, $phone, $user_id);

    if ($stmt->execute()) {
        // Update session data
        $_SESSION['user_name'] = $name;
        $_SESSION['user_phone'] = $phone;
        echo json_encode(["success" => "Profile updated successfully"]);
    } else {
        echo json_encode(["error" => "Failed to update profile"]);
    }

    $stmt->close();
}

$conn->close();
?>

