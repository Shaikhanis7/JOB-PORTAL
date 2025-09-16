feather.replace();

// Password toggle
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (input.type === "password") {
      input.type = "text";
      icon.dataset.icon = "eye-off";
    } else {
      input.type = "password";
      icon.dataset.icon = "eye";
    }
    feather.replace();
  });
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

//Form Handling
const form = document.getElementById("signup-form");
const fields = {
  fullName: document.getElementById("fullName"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  confirm: document.getElementById("confirm-password"),
};
const errors = {
  fullName: document.getElementById("error-fullName"),
  email: document.getElementById("error-email"),
  password: document.getElementById("error-password"),
  confirm: document.getElementById("error-confirm"),
};

// ✅ Notyf instance
const notyf = new Notyf({
  duration: 3000,
  position: { x: "right", y: "top" },
  ripple: true
});

// Validation rules
const validate = {
  fullName: (val) => val ? "" : "Full Name is required.",
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Enter a valid email.",
  password: (val) => val.length >= 6 ? "" : "Password must be at least 6 characters.",
  confirm: (val) => val === fields.password.value ? "" : "Passwords do not match.",
};

// Live validation
Object.keys(fields).forEach((key) => {
  fields[key].addEventListener("input", () => {
    const message = validate[key](fields[key].value.trim());
    errors[key].textContent = message;
    errors[key].classList.toggle("hidden", !message);
    fields[key].classList.toggle("border-red-500", !!message);
  });
});

// On submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;

  Object.keys(fields).forEach((key) => {
    const message = validate[key](fields[key].value.trim());
    errors[key].textContent = message;
    errors[key].classList.toggle("hidden", !message);
    fields[key].classList.toggle("border-red-500", !!message);
    if (message) isValid = false;
  });

  if (!isValid) {
    notyf.error("⚠️ Please fix the errors above");
    return;
  }

  // ✅ Check if user with this email already exists
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const emailExists = users.some((u) => u.email === fields.email.value.trim());

  if (emailExists) {
    notyf.error("❌ User already exists with this email");
    return;
  }

  // Create user
  const user = {
    id: Date.now().toString(),
    fullName: fields.fullName.value.trim(),
    email: fields.email.value.trim(),
    password: fields.password.value.trim(),
    role: "user",
  };

  // Save to users array in localStorage
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  notyf.success("🎉 Account created successfully!");

  form.reset();
});

