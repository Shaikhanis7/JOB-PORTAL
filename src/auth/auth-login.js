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
     setTimeout(() => {
    window.location.href = "../admin/add-job/index.html";
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

  notyf.success(`🎉 Welcome back, ${foundUser.fullName}!`);

  // Redirect to dashboard (example)
  setTimeout(() => {
    window.location.href = "../user/dashboard/profile/index.html";
  }, 1000);
}
});

// Dark mode toggle
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
}
const darkToggle = document.getElementById("dark-toggle");
if (localStorage.getItem("theme") === "dark") document.documentElement.classList.add("dark");
darkToggle.addEventListener("click", toggleDarkMode);

// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuContent = document.getElementById("mobile-menu-content");
const closeMenu = document.getElementById("close-menu");

// Open menu
hamburger.addEventListener("click", () => {
  mobileMenu.classList.remove("opacity-0", "pointer-events-none");
  mobileMenu.classList.add("opacity-100", "pointer-events-auto");
  mobileMenuContent.classList.remove("-translate-x-full");
  mobileMenuContent.classList.add("translate-x-0");
});

// Close menu
closeMenu.addEventListener("click", () => {
  mobileMenu.classList.add("opacity-0", "pointer-events-none");
  mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
  mobileMenuContent.classList.add("-translate-x-full");
  mobileMenuContent.classList.remove("translate-x-0");
});

// Close menu when clicking overlay
mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) {
    mobileMenu.classList.add("opacity-0", "pointer-events-none");
    mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
    mobileMenuContent.classList.add("-translate-x-full");
    mobileMenuContent.classList.remove("translate-x-0");
  }
});



