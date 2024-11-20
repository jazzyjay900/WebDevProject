document.addEventListener("DOMContentLoaded", () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const registrationForm = document.getElementById("registrationForm");

    if (registrationForm) {
        registrationForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent default form submission behavior

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (!username || !email || !password || !confirmPassword) {
                alert("All fields are required!");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters long.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            if (users.some((user) => user.email === email)) {
                alert("Email is already registered!");
                return;
            }

            users.push({ username, email, password });
            localStorage.setItem("users", JSON.stringify(users));

            alert("Registration successful!");
            localStorage.setItem("currentUserEmail", email);
            console.log("Redirecting to shopping cart...");
            window.location.href = "shoppingcart.html"; // Redirect
        });
    }
});
