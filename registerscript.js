document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');

    // Input validation patterns
    const patterns = {
        fullName: /^[A-Za-z\s]+$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        // At least one lowercase, one uppercase, one digit, one special character, 8-20 characters
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        // Kenyan phone: starts with "254" followed by exactly 9 digits (total 12 characters)
        phone: /^254\d{9}$/
    };

    // Real-time validation for each input field
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
    });

    function validateField(input) {
        const field = input.id;
        let isValid = true;
        let errorMessage = "";

        switch (field) {
            case 'fullName':
                isValid = patterns.fullName.test(input.value);
                if (!isValid) {
                    errorMessage = "Please enter a valid name (letters and spaces only).";
                }
                break;
            case 'email':
                isValid = patterns.email.test(input.value);
                if (!isValid) {
                    errorMessage = "Please enter a valid email address.";
                }
                break;
            case 'password':
                isValid = patterns.password.test(input.value);
                if (!isValid) {
                    errorMessage = "Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
                }
                break;
            case 'confirmPassword':
                isValid = input.value === document.getElementById('password').value;
                if (!isValid) {
                    errorMessage = "Passwords do not match.";
                }
                break;
            case 'phone':
                isValid = patterns.phone.test(input.value);
                if (!isValid) {
                    errorMessage = "Phone number must start with 254 and be exactly 12 characters (e.g., 2547XXXXXXXX).";
                }
                break;
            case 'dob':
                isValid = input.value !== '';
                if (!isValid) {
                    errorMessage = "Please select your date of birth.";
                }
                break;
        }

        // Set border color based on validity
        input.style.borderColor = isValid ? 'green' : 'red';

        // Display error message inline
        let errorElement = document.getElementById(field + "Error");
        if (!errorElement) {
            errorElement = document.createElement("div");
            errorElement.id = field + "Error";
            errorElement.style.color = "red";
            errorElement.style.fontSize = "0.9em";
            // Insert error message after the input element
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = isValid ? "" : errorMessage;
        return isValid;
    }

    });
