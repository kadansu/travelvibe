<?php
session_start(); // Must be called before any output
include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and trim user input
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    
    // Check if required fields are provided
    if (empty($email) || empty($password)) {
        echo "<script>alert('Email and password are required!'); window.history.back();</script>";
        exit();
    }
    
    // Prepare a secure query to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    if (!$stmt) {
        echo "<script>alert('Failed to prepare statement.'); window.history.back();</script>";
        exit();
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Check if a user was found
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verify the provided password against the hashed password in the database
        if (password_verify($password, $user['password'])) {
            // Store user information in the session
            $_SESSION['user_id']    = $user['id'];
            $_SESSION['user_name']  = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_phone'] = $user['phone'];

            // Redirect to the user profile page
            header("Location: profile.html");
            exit();
        } else {
            echo "<script>alert('Incorrect password!'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('User not found!'); window.history.back();</script>";
    }
    
    $stmt->close();
}

$conn->close();
?>
