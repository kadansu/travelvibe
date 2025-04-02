function validateLogin(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    let errorMessage = "";

    if (!email) {
        errorMessage += "Please enter your email.\n";
    }

    if (!password) {
        errorMessage += "Please enter your password.\n";
    } else {
        if (password.length < 8) {
            errorMessage += "Password must be at least 8 characters long.\n";
        }
        if (!/[A-Z]/.test(password)) {
            errorMessage += "Password must contain at least one uppercase letter.\n";
        }
    }

    if (errorMessage) {
        alert(errorMessage);
        return;
    }

    // Send login request to PHP script with credentials included
    fetch("login.php", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent and received
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Login successful!");
            // Redirect to profile page after login
            window.location.href = "userprofile.html";
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => console.error("Login error:", error));
}
