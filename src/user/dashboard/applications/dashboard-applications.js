// ==========================
// Sidebar Toggle
// ==========================
const toggleBtn = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuIcon = document.getElementById("menu-icon");

if (toggleBtn && sidebar && overlay && menuIcon) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");

    if (sidebar.classList.contains("-translate-x-full")) {
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
    } else {
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-times");
    }
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
    menuIcon.classList.remove("fa-times");
    menuIcon.classList.add("fa-bars");
  });
}

// ==========================
// Dark Mode Toggle
// ==========================
const darkToggle = document.getElementById("dark-toggle");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  });
}
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

// ==========================
// Dummy Data
// ==========================
const userApplications = JSON.parse(localStorage.getItem("applications")) || [];
const rounds = JSON.parse(localStorage.getItem("applicationRounds")) || [];
const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

// ==========================
// Transform Applications
// ==========================
// ==========================
// Transform Applications
// ==========================
function transformApplications(apps, rounds, jobs) {
  return apps.map((app) => {
    const job = jobs.find((j) => j.id === app.jobId) || {};
    const appRounds = rounds
      .filter((r) => r.applicationId == app.id)
      .sort((a, b) => a.roundNumber - b.roundNumber);

    const completed = appRounds
      .filter((r) => ["pass", "fail"].includes(r.status?.toLowerCase()))
      .map((r) => r.roundName);

    // ✅ Fix: determine current stage properly
    let currentRound;
    if (completed.length === 0) {
      currentRound = null; // no rounds started
    } else if (completed.length === appRounds.length) {
      currentRound = "Completed"; // all rounds finished
    } else {
      currentRound = appRounds.find((r) => !completed.includes(r.roundName))?.roundName || null;
    }

    return {
      title: job.title || "",
      company: job.company || "Unknown",
      location: job.location || "",
      category: job.category || "",
      applied: app.appliedAt
        ? new Date(app.appliedAt).toLocaleDateString()
        : "",
      status: app.status || "In Progress",
      currentRound,
      rounds: appRounds.map((r) => r.roundName),
      completed,
    };
  });
}

const applications = transformApplications(userApplications, rounds, jobs);

// ==========================
// DOM Elements
// ==========================
const appsContainer = document.getElementById("applicationsList");
const searchInput = document.getElementById("searchInput");
const locationFilters = document.querySelectorAll(".filter-location");
const statusFilter = document.getElementById("statusFilter");
const pagination = document.getElementById("pagination");

let currentPage = 1;
const perPage = 2;

// ==========================
// Render Applications
// ==========================
function renderApplications(list, page = 1) {
  if (!appsContainer) return;
  appsContainer.innerHTML = "";
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = list.slice(start, end);

  paginated.forEach((app, index) => {
    const completedCount = app.completed.length;
    const total = app.rounds.length;

    const div = document.createElement("div");
    div.className =
      "bg-white dark:bg-neutral-mid shadow rounded-lg p-6 hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 animate-fadeIn";
    div.style.animationDelay = `${index * 100}ms`;

    let progressSection = "";
    if (completedCount > 0) {
      progressSection = `
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">Progress</span>
          <span class="text-sm">${completedCount}/${total}</span>
        </div>
        <div class="w-full bg-gray-200 rounded h-2 mb-2">
          <div class="bg-primary h-2 rounded" style="width: ${
            (completedCount / total) * 100
          }%"></div>
        </div>
      `;
    } else {
      progressSection = `
        <div class="flex items-center gap-2 text-sm text-blue-600">
          <i class="fas fa-circle-notch fa-spin"></i>
          <span>Waiting on ${app.rounds[0] || "Round 1"}</span>
        </div>
      `;
    }

    div.innerHTML = `
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-primary">${app.title}</h3>
        <div class="flex items-center gap-2">
          <span class="px-2 py-1 text-xs rounded ${
            app.status === "Accepted"
              ? "bg-green-100 text-green-600"
              : app.status === "Rejected"
              ? "bg-red-100 text-red-600"
              : app.status === "In Progress"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-100 text-gray-600"
          }">${app.status}</span>
          <button class="view-btn text-blue-500 hover:text-blue-700"><i class="fas fa-eye"></i></button>
        </div>
      </div>
      <p class="text-sm text-gray-600"> ${app.location} • ${app.category}</p>
      <p class="text-xs text-gray-500 mb-3">Applied ${app.applied}</p>

      <div class="bg-gray-50 dark:bg-neutral-dark p-4 rounded-lg">
        ${progressSection}
        <p class="text-sm mt-2">Current Stage: <span class="font-medium text-primary">${
          app.currentRound || "Not Started"
        }</span></p>
        <div class="flex flex-wrap gap-3 mt-3 text-sm">
          ${app.rounds
            .map((r) => {
              if (app.completed.includes(r)) {
                return `<span class="flex items-center text-green-600"><i class="fas fa-check-circle mr-1"></i>${r}</span>`;
              } else if (r === app.currentRound) {
                return `<span class="flex items-center text-blue-600 font-medium"><i class="fas fa-spinner mr-1 animate-spin"></i>${r}</span>`;
              } else {
                return `<span class="flex items-center text-gray-400"><i class="fas fa-circle mr-1 text-xs"></i>${r}</span>`;
              }
            })
            .join("")}
        </div>
      </div>
    `;

    div.querySelector(".view-btn").addEventListener("click", () => openModal(app));
    appsContainer.appendChild(div);
  });
}

// ==========================
// Pagination
// ==========================
function renderPagination(list) {
  if (!pagination) return;
  pagination.innerHTML = "";
  const totalPages = Math.ceil(list.length / perPage);

  if (totalPages <= 1) return;

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = `<i class="fas fa-chevron-left"></i>`;
  prevBtn.className =
    "px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      applyFilters();
    }
  });
  pagination.appendChild(prevBtn);

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className =
      "px-3 py-1 rounded " +
      (i === currentPage
        ? "bg-primary text-white"
        : "bg-gray-200 hover:bg-gray-300");
    btn.addEventListener("click", () => {
      currentPage = i;
      applyFilters();
    });
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = `<i class="fas fa-chevron-right"></i>`;
  nextBtn.className =
    "px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      applyFilters();
    }
  });
  pagination.appendChild(nextBtn);
}

// ==========================
// Filters & Search
// ==========================
function applyFilters() {
  let filtered = [...applications];

  const searchVal = searchInput?.value.toLowerCase() || "";
  if (searchVal) {
    filtered = filtered.filter(
      (app) =>
        app.title.toLowerCase().includes(searchVal) ||
        app.company.toLowerCase().includes(searchVal) ||
        app.location.toLowerCase().includes(searchVal)
    );
  }

  const selectedLocations = Array.from(locationFilters)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);
  if (selectedLocations.length > 0) {
    filtered = filtered.filter((app) =>
      selectedLocations.includes(app.location)
    );
  }

  const selectedStatus = statusFilter?.value || "";
  if (selectedStatus) {
    filtered = filtered.filter((app) => app.status === selectedStatus);
  }

  renderApplications(filtered, currentPage);
  renderPagination(filtered);
}

// ==========================
// Modal
// ==========================
const modal = document.getElementById("appModal");
const closeModalBtn = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalCompany = document.getElementById("modalCompany");
const modalLocation = document.getElementById("modalLocation");
const modalCategory = document.getElementById("modalCategory");
const modalApplied = document.getElementById("modalApplied");
const modalRounds = document.getElementById("modalRounds");

function openModal(app) {
  if (!modal) return;
  modalTitle.textContent = app.title;
  modalCompany.textContent = app.company;
  modalLocation.textContent = app.location;
  modalCategory.textContent = app.category;
  modalApplied.textContent = `Applied: ${app.applied}`;
  modalRounds.innerHTML = app.rounds
    .map((r) => {
      if (app.completed.includes(r)) {
        return `<li class="text-green-600"><i class="fas fa-check-circle mr-1"></i>${r}</li>`;
      } else if (r === app.currentRound) {
        return `<li class="text-blue-600 font-medium"><i class="fas fa-spinner mr-1 animate-spin"></i>${r}</li>`;
      } else {
        return `<li class="text-gray-400"><i class="fas fa-circle mr-1 text-xs"></i>${r}</li>`;
      }
    })
    .join("");
  modal.classList.remove("hidden");
}
closeModalBtn?.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

// ==========================
// Init
// ==========================
searchInput?.addEventListener("input", () => {
  currentPage = 1;
  applyFilters();
});
locationFilters.forEach((cb) =>
  cb.addEventListener("change", () => {
    currentPage = 1;
    applyFilters();
  })
);
statusFilter?.addEventListener("change", () => {
  currentPage = 1;
  applyFilters();
});

// Initial load
applyFilters();
