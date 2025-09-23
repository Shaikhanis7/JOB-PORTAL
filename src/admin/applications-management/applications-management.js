// ==========================
// Sidebar Toggle
// ==========================
const toggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuIcon = document.getElementById('menu-icon');

// Toggle sidebar open/close
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full'); // Slide sidebar in/out
  overlay.classList.toggle('hidden');            // Show/hide background overlay
  menuIcon.classList.toggle('fa-bars');          // Switch hamburger icon
  menuIcon.classList.toggle('fa-xmark');         // Switch close (X) icon
});

// Close sidebar when clicking overlay
overlay.addEventListener('click', () => {
  sidebar.classList.add('-translate-x-full'); // Hide sidebar
  overlay.classList.add('hidden');            // Hide overlay
  menuIcon.classList.add('fa-bars');
  menuIcon.classList.remove('fa-xmark');
});

// ==========================
// Dark Mode Toggle
// ==========================
document.getElementById('dark-toggle').addEventListener('click', () => {
  document.documentElement.classList.toggle('dark'); // Toggle Tailwind's dark mode
});



// -------- Load LocalStorage --------
const currentUser = JSON.parse(localStorage.getItem("currentUser")); 
const applications = JSON.parse(localStorage.getItem("applications")) || [];
const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
const rounds = JSON.parse(localStorage.getItem("rounds")) || [];

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const dateFilter = document.getElementById("dateFilter");
const applicationsList = document.getElementById("applicationsList");

// -------- Render Function --------
function renderApplications() {
  applicationsList.innerHTML = "";

  let filtered = applications.filter(app => app.userId === currentUser.id);

  // Apply filters
  const keyword = searchInput.value.toLowerCase();
  if (keyword) {
    filtered = filtered.filter(app =>
      app.name.toLowerCase().includes(keyword) ||
      app.email.toLowerCase().includes(keyword)
    );
  }

  if (statusFilter.value) {
    filtered = filtered.filter(app => app.status === statusFilter.value);
  }

  if (dateFilter.value) {
    filtered = filtered.filter(app =>
      app.appliedAt.slice(0, 10) === dateFilter.value
    );
  }

  // Render Cards
  filtered.forEach(app => {
    const job = jobs.find(j => j.id === app.jobId);
    if (!job) return;

    const jobRounds = rounds.filter(r => r.jobId === job.id);

    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-neutral-dark rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition cursor-pointer";

    card.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 class="text-lg font-semibold text-primary">${job.title}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">${job.location || "N/A"} · ${job.jobType || "N/A"}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Applied on: ${new Date(app.appliedAt).toLocaleDateString()}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-sm font-medium 
          ${app.status === "Applied" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : ""}
          ${app.status === "In Progress" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" : ""}
          ${app.status === "Rejected" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : ""}">
          ${app.status}
        </span>
      </div>

      <!-- Hidden details -->
      <div class="details hidden mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p><strong>Description:</strong> ${job.description || "N/A"}</p>
        <p><strong>Category:</strong> ${job.category || "N/A"}</p>
        <p><strong>Responsibilities:</strong> ${job.responsibilities || "N/A"}</p>
        <p><strong>Skills:</strong> ${job.skills?.join(", ") || "N/A"}</p>
        <p><strong>Experience:</strong> ${job.experience || "N/A"}</p>
        <p><strong>Positions:</strong> ${job.positions || "N/A"}</p>
        <p><strong>Rounds:</strong></p>
        <ul class="list-disc ml-5">
          ${jobRounds.map(r => `<li>${r.roundName}</li>`).join("") || "<li>No rounds defined</li>"}
        </ul>
      </div>
    `;

    // Toggle expand
    card.addEventListener("click", () => {
      const details = card.querySelector(".details");
      details.classList.toggle("hidden");
    });

    applicationsList.appendChild(card);
  });

  if (filtered.length === 0) {
    applicationsList.innerHTML =
      `<p class="text-gray-500 dark:text-gray-400">No applications found.</p>`;
  }
}

// -------- Event Listeners --------
searchInput.addEventListener("input", renderApplications);
statusFilter.addEventListener("change", renderApplications);
dateFilter.addEventListener("change", renderApplications);

// -------- Initial Render --------
renderApplications();
