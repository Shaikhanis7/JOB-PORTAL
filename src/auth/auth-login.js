const form = document.getElementById("login-form");
const emailField = document.getElementById("login-email");
const passwordField = document.getElementById("login-password");

// ✅ Notyf instance
const notyf = new Notyf({
  duration: 3000,
  position: { x: "right", y: "top" },
  ripple: true
});

// Password toggle
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = document.getElementById("login-password");

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailField.value.trim();
  const password = passwordField.value.trim();

  if(email==="admin@gmail.com" && password=="123456")
  {
    notyf.success(`🎉 Welcome Admin`);
    const adminUser = { email, role: "admin", fullName: "Admin" };

    // Save session info in sessionStorage
    sessionStorage.setItem("currentUser", JSON.stringify(adminUser));
    sessionStorage.setItem("isLoggedIn", "true");
     setTimeout(() => {
    window.location.href = "../../index.html";
  }, 1000);
}
  else
  {

  // Get all users
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Find user with matching credentials
  const foundUser = users.find(u => u.email === email && u.password === password);

  if (!foundUser) {
    notyf.error("❌ Invalid email or password");
    return;
  }

 
  localStorage.setItem("currentUser", JSON.stringify(foundUser));
  sessionStorage.setItem("currentUser", JSON.stringify(foundUser));
  sessionStorage.setItem("isLoggedIn", "true");

  notyf.success(`🎉 Welcome back, ${foundUser.fullName}!`);

  // Redirect to dashboard (example)
  setTimeout(() => {
    window.location.href = "../../index.html";
  }, 1000);
}
});




    const backBtn = document.getElementById("back");

backBtn.addEventListener("click", () => {
  window.location.href = "../../index.html"; // Change this to your homepage path
});
