document.addEventListener("DOMContentLoaded", function () { 
    // Fetch user details from profile.php with credentials
    fetch("profile.php", { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("You are not logged in!");
                window.location.href = "login.html"; // Redirect to login
            } else {
                document.getElementById("name").value = data.name;
                document.getElementById("email").value = data.email;
                document.getElementById("phone").value = data.phone;
            }
        })
        .catch(error => console.error("Error loading profile:", error));
});

// Enable editing of profile fields
function enableEdit() {
    document.getElementById("name").disabled = false;
    document.getElementById("phone").disabled = false;
    document.getElementById("editBtn").style.display = "none"; // Hide Edit button
    document.getElementById("saveBtn").style.display = "inline-block"; // Show Save button
}

// Update profile details in the database
function updateProfile() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;

    // Check if there's a profile picture uploaded
    let profilePic = localStorage.getItem("profilePic");  // Get the current profile picture from localStorage

    // Send the profile data along with the profile picture to the server
    fetch("profile.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&profilePic=${encodeURIComponent(profilePic)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Profile updated successfully!");
            location.reload(); // Reload page to reflect changes
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => console.error("Error updating profile:", error));
}

// Upload profile picture
function uploadProfilePic() {
    let fileInput = document.getElementById("uploadImage");
    let profileImage = document.getElementById("profileImage");

    if (fileInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function (e) {
            // Set the profile image source to the selected file
            profileImage.src = e.target.result;

            // Store the image data in localStorage
            localStorage.setItem("profilePic", e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// Add Travel Destination to Wishlist
function addDestination() {
    let destination = document.getElementById("destinationInput").value;
    if (destination === "") {
        alert("Please enter a destination!");
        return;
    }

    let wishlist = document.getElementById("wishlistItems");
    let listItem = document.createElement("li");
    listItem.textContent = destination;
    
    wishlist.appendChild(listItem);
    document.getElementById("destinationInput").value = "";
}

document.addEventListener("DOMContentLoaded", function () {
    fetchWishlist();
});

// Fetch wishlist from the database
function fetchWishlist() {
    fetch("wishlist.php", { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            let wishlist = document.getElementById("wishlistItems");
            wishlist.innerHTML = ""; // Clear existing list

            data.forEach(destination => {
                let listItem = document.createElement("li");
                listItem.textContent = destination.name;
                let removeBtn = document.createElement("button");
                removeBtn.textContent = "Remove";
                removeBtn.onclick = () => removeDestination(destination.id);

                listItem.appendChild(removeBtn);
                wishlist.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching wishlist:", error));
}
function logout() {
    fetch("logout.php", { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "login.html"; // Redirect to login page on success
            } else {
                alert("Logout failed: " + data.error);
            }
        })
        .catch(error => console.error("Error logging out:", error));
}
// Add destination to wishlist
function addDestination() {
    let destination = document.getElementById("destinationInput").value;
    if (destination === "") {
        alert("Please enter a destination!");
        return;
    }

    fetch("wishlist.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `destination=${encodeURIComponent(destination)}`
    })
    .then(response => response.text()) // First, get raw response
    .then(text => {
        console.log("Raw response:", text); // Debugging step
        try {
            let data = JSON.parse(text); // Attempt to parse as JSON
            if (data.success) {
                fetchWishlist(); // Reload wishlist
                document.getElementById("destinationInput").value = ""; // Clear input
            } else {
                alert("Error: " + data.error);
            }
        } catch (e) {
            console.error("Invalid JSON response:", text); // Log invalid JSON
        }
    })
    .catch(error => console.error("Error adding destination:", error));
}

// Remove destination from wishlist
function removeDestination(id) {
    fetch("wishlist.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `delete_id=${id}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchWishlist(); // Reload wishlist
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => console.error("Error removing destination:", error));
}
