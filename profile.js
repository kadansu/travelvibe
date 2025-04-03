document.addEventListener("DOMContentLoaded", function () { 
    // Fetch user details from profile.php with credentials
    fetch("profile.php", { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("You are not logged in!");
                window.location.href = "login.html"; // Redirect to login if needed
            } else {
                // Fill in profile data
                document.getElementById("name").value = data.name;
                document.getElementById("email").value = data.email;
                document.getElementById("phone").value = data.phone;

                // Display profile image (if available)
                let profileImage = document.getElementById("profileImage");
                if (data.profilePic) {
                    profileImage.src = data.profilePic;  // Set the profile image from the server
                } else {
                    // Fallback to localStorage if no profile picture from server
                    let savedProfilePic = localStorage.getItem("profilePic");
                    if (savedProfilePic) {
                        profileImage.src = savedProfilePic;
                    }
                }
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
    // Get the current profile picture from localStorage (if uploaded)
    let profilePic = localStorage.getItem("profilePic") || "";

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
            // Store the image data in localStorage so it persists on refresh
            localStorage.setItem("profilePic", e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}
