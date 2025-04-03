<?php
session_start();
$servername = "localhost";
$username   = "root";
$password   = "";
$database   = "travelvibe";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$user_id = $_SESSION['user_id'];

// If it's a GET request, return user details including profilePic if available
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $userData = [
        "name"      => isset($_SESSION['user_name']) ? $_SESSION['user_name'] : "",
        "email"     => isset($_SESSION['user_email']) ? $_SESSION['user_email'] : "",
        "phone"     => isset($_SESSION['user_phone']) ? $_SESSION['user_phone'] : "",
        "profile_picture"=> isset($_SESSION['profile_picture']) ? $_SESSION['profile_picture'] : ""
    ];
    echo json_encode($userData);
    exit();
}

// If it's a POST request, update user details (and profilePic if provided)
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name  = $_POST['name'];
    $phone = $_POST['phone'];
    $profile_picture = isset($_POST['profile_picture']) ? $_POST['profile_picture'] : null;

    if ($profile_picture !== null) {
        $sql = "UPDATE users SET name = ?, phone = ?, profile_picture = ? WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
            exit();
        }
        $stmt->bind_param("sssi", $name, $phone, $profile_picture, $user_id);
    } else {
        $sql = "UPDATE users SET name = ?, phone = ? WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
            exit();
        }
        $stmt->bind_param("ssi", $name, $phone, $user_id);
    }

    if ($stmt->execute()) {
        // Update session data with new details
        $_SESSION['user_name']  = $name;
        $_SESSION['user_phone'] = $phone;
        if ($profile_picture !== null) {
            $_SESSION['profile_picture'] = $profile_picture;
        }
        echo json_encode(["success" => "Profile updated successfully"]);
    } else {
        echo json_encode(["error" => "Failed to update profile: " . $stmt->error]);
    }

    $stmt->close();
    exit();
}

$conn->close();
?>
