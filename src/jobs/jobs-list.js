 function timeAgo(date) {
      const diffMs = Date.now() - new Date(date).getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);
      if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    }
    function isNew(date) {
      const diffMs = Date.now() - new Date(date).getTime();
      return diffMs < 24 * 60 * 60 * 1000;
    }

    // Load jobs from localStorage or fallback
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [
      {
    id: Date.now().toString(),
    title: "Full Stack Developer",
    description: "Build and maintain scalable web apps using React and Node.js.",
    category: "Software Engineer",
    skills: ["React", "Node.js", "MongoDB", "TailwindCSS"],
    responsibilities: "Develop UI components, REST APIs, and manage databases.",
    location: "Chennai",
    jobType: "Full-time",
    rounds: 3,
    positions: 2,
    experience: "2+ years",
    createdAt: new Date(),
    openedAt: new Date(),
    closedAt: null
  },
  {
    id: (Date.now() + 1).toString(),
    title: "Data Analyst",
    description: "Analyze datasets and prepare dashboards for insights.",
    category: "Analytics",
    skills: ["Python", "SQL", "Tableau"],
    responsibilities: "Work with data pipelines, dashboards, and reports.",
    location: "Bangalore",
    jobType: "Internship",
    rounds: 2,
    positions: 1,
    experience: "Fresher",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    openedAt: new Date(Date.now() - 86400000),
    closedAt: null
  },
  {
    id: (Date.now() + 2).toString(),
    title: "HR Specialist",
    description: "Handle recruitment processes and employee engagement.",
    category: "HR",
    skills: ["Recruitment", "Communication", "Onboarding"],
    responsibilities: "Source candidates, schedule interviews, and onboarding.",
    location: "Delhi",
    jobType: "Part-time",
    rounds: 1,
    positions: 1,
    experience: "1+ year",
    createdAt: new Date(Date.now() - 2*86400000), // 2 days ago
    openedAt: new Date(Date.now() - 2*86400000),
    closedAt: null
  }
    ];

    // Render jobs
    const jobList = document.getElementById("job-list");

    function renderJobs(list) {
  jobList.innerHTML = "";
  list.forEach(job => {
    if (job.closedAt) return; // Only open jobs

    const newBadge = isNew(job.createdAt)
      ? `<span class="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">New</span>`
      : "";

    // Skill tags
    const skillTags = (Array.isArray(job.skills) ? job.skills : [])
      .map(skill => `<span class="px-2 py-1 bg-blue-500 text-white rounded-md text-xs">${skill}</span>`)
      .join(" ");

    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-neutral-mid rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden transform hover:-translate-y-1 my-4 ";

    card.innerHTML = `
      <div class="flex flex-col py-2 transition-colors duration-300 hover:cursor-pointer">
        <div class="flex items-center justify-between px-5 mb-3">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-semibold text-primary">${job.title}</h2>
            ${newBadge}
          </div>
          <div class="flex items-center gap-4">
            <button class="save-job text-gray-400 hover:text-primary transition" data-id="${job.id}">
              <i class="fa-regular fa-bookmark text-xl"></i>
            </button>
            <i class="fa-solid fa-chevron-down chevron text-gray-500 transition-transform duration-300 cursor-pointer"></i>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-300 px-5">
          <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
          <span><i class="fa-solid fa-briefcase"></i> ${job.jobType}</span>
          <span><i class="fa-regular fa-clock"></i> ${timeAgo(job.createdAt)}</span>
          <span><i class="fa-solid fa-users"></i> ${job.positions} pos</span>
        </div>

        <!-- Skill tags -->
        <div class="flex flex-wrap gap-2 mt-2 px-5">
          ${skillTags}
        </div>

        <div class="flex flex-wrap gap-6 text-xs text-gray-500 dark:text-gray-300 mt-2 px-5">
          <span>Experience: ${job.experience || "-"}</span>
          <span>Rounds: ${job.rounds || "-"}</span>
        </div>

        <!-- Expandable -->
        <div class="job-details max-h-0 overflow-hidden transition-all duration-500 mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200 px-5">
          <div>
            <h4 class="font-semibold">Description</h4>
            <p>${job.description || "Not provided"}</p>
          </div>
          <div>
            <h4 class="font-semibold">Responsibilities</h4>
            <p>${job.responsibilities || "Not provided"}</p>
          </div>
          <div class="flex justify-start mt-4">
            <button class="apply-btn bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-secondary transition">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    `;

    jobList.appendChild(card);

    // Expand/collapse
    const chevron = card.querySelector(".chevron");
    const details = card.querySelector(".job-details");

    card.addEventListener("click", () => {
      details.classList.toggle("max-h-0");
      details.classList.toggle("max-h-96");
      chevron.classList.toggle("rotate-180");
    });

    // Save button logic
    const saveBtn = card.querySelector(".save-job");
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      saveBtn.classList.toggle("text-primary");
      saveBtn.querySelector("i").classList.toggle("fa-solid");
      saveBtn.querySelector("i").classList.toggle("fa-regular");
    });
  });
}



// Dark mode toggle
function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
}
const darkToggle = document.getElementById("dark-toggle");
if(localStorage.getItem("theme")==="dark") document.documentElement.classList.add("dark");
darkToggle.addEventListener("click", toggleDarkMode);



// Render Categories

function renderCategories(jobs) {
    const categoryContainer = document.getElementById("category-container");
    categoryContainer.innerHTML = ""; // Clear old radios
    
    // Extract unique categories
    const categories = [...new Set(jobs.map(job => job.category))];
    
    categories.forEach(cat => {
        const label = document.createElement("label");
        label.className = "flex items-center space-x-2";
        
        label.innerHTML = `
        <input type="radio" name="category" value="${cat}" class="filter-radio">
        <span>${cat}</span>
        `;
        
        categoryContainer.appendChild(label);
    });
}

function renderLocations(jobs) {
  const locationContainer = document.getElementById("location-options");
  const searchInput = document.getElementById("location-search");
  locationContainer.innerHTML = "";

  // Extract unique locations
  let allLocations = [...new Set(jobs.map(job => job.location))];

  function updateList(filterText = "") {
    locationContainer.innerHTML = "";
    allLocations
      .filter(loc => loc.toLowerCase().includes(filterText.toLowerCase()))
      .forEach(loc => {
        const label = document.createElement("label");
        label.className = "flex items-center space-x-2";

        label.innerHTML = `
          <input type="checkbox" value="${loc}" class="filter-location">
          <span>${loc}</span>
        `;
        locationContainer.appendChild(label);
      });
  }

  // Initial render
  updateList();

  // Search filter
  searchInput.addEventListener("input", (e) => {
    updateList(e.target.value);
  });
}



renderJobs(jobs);
renderCategories(jobs)
renderLocations(jobs);


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

// Close menu (via close button)
closeMenu.addEventListener("click", () => {
  mobileMenu.classList.add("opacity-0", "pointer-events-none");
  mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
  mobileMenuContent.classList.add("-translate-x-full");
  mobileMenuContent.classList.remove("translate-x-0");
});

// Close menu when clicking outside (overlay)
mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) {
    mobileMenu.classList.add("opacity-0", "pointer-events-none");
    mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
    mobileMenuContent.classList.add("-translate-x-full");
    mobileMenuContent.classList.remove("translate-x-0");
  }
});


// === Filter State ===
let selectedCategory = null;
let selectedLocations = [];
let searchQuery = "";

// Apply filters to jobs
function applyFilters() {
  let filteredJobs = jobs.filter(job => {
    // Category filter
    if (selectedCategory && job.category !== selectedCategory) return false;

    // Location filter
    if (selectedLocations.length > 0 && !selectedLocations.includes(job.location)) return false;

    // Search filter (title + description + skills)
    if (searchQuery) {
      const text = (job.title + " " + job.description + " " + job.skills.join(" ")).toLowerCase();
      if (!text.includes(searchQuery.toLowerCase())) return false;
    }

    return true;
  });

  renderJobs(filteredJobs);
}

// === Hook up Category Filters ===
function renderCategories(jobs) {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = "";

  const categories = [...new Set(jobs.map(job => job.category))];

  // Add "All" option
  const allLabel = document.createElement("label");
  allLabel.className = "flex items-center space-x-2";
  allLabel.innerHTML = `
    <input type="radio" name="category" value="" class="filter-radio">
    <span>All</span>
  `;
  categoryContainer.appendChild(allLabel);

  categories.forEach(cat => {
    const label = document.createElement("label");
    label.className = "flex items-center space-x-2";

    label.innerHTML = `
      <input type="radio" name="category" value="${cat}" class="filter-radio">
      <span>${cat}</span>
    `;
    categoryContainer.appendChild(label);
  });

  // Event listener
  categoryContainer.addEventListener("change", (e) => {
    selectedCategory = e.target.value || null;
    applyFilters();
  });
}

// === Hook up Location Filters ===
function renderLocations(jobs) {
  const locationContainer = document.getElementById("location-options");
  const searchInput = document.getElementById("location-search");
  locationContainer.innerHTML = "";

  let allLocations = [...new Set(jobs.map(job => job.location))];

  function updateList(filterText = "") {
    locationContainer.innerHTML = "";
    allLocations
      .filter(loc => loc.toLowerCase().includes(filterText.toLowerCase()))
      .forEach(loc => {
        const label = document.createElement("label");
        label.className = "flex items-center space-x-2";

        label.innerHTML = `
          <input type="checkbox" value="${loc}" class="filter-location">
          <span>${loc}</span>
        `;
        locationContainer.appendChild(label);
      });

    // Add event listener for checkboxes
    locationContainer.querySelectorAll(".filter-location").forEach(cb => {
      cb.addEventListener("change", () => {
        selectedLocations = Array.from(locationContainer.querySelectorAll(".filter-location:checked"))
                                .map(cb => cb.value);
        applyFilters();
      });
    });
  }

  updateList();

  // Search filter for locations
  searchInput.addEventListener("input", (e) => {
    updateList(e.target.value);
  });
}

const jobSearchInput = document.getElementById("job-search");

// === Hook up Search Bar ===
const jobSearchBtn = document.getElementById("job-search-btn");
if (jobSearchBtn) {
  jobSearchBtn.addEventListener("click", () => {
    searchQuery = jobSearchInput.value.trim();
    applyFilters();
  });
}



const signInBtn=document.getElementById("sign-in-btn")
signInBtn.addEventListener("click",()=>{
    window.location.href = "singnup.html";

})
const applyModal = document.getElementById("apply-modal");
const applyModalContent = document.getElementById("apply-modal-content");
const closeApplyModal = document.getElementById("close-apply-modal");
const applicationForm = document.getElementById("application-form");

let currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
let currentJobId = null;

// Open modal
document.querySelectorAll(".apply-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentJobId = btn.dataset.jobId;
    applyModal.classList.remove("hidden");

    // Prefill fields
    document.getElementById("app-name").value = currentUser.fullName || "";
    document.getElementById("app-email").value = currentUser.email || "";
    document.getElementById("app-phone").value = currentUser.phone || "";
    document.getElementById("app-experience").value = currentUser.experience || "";
    document.getElementById("app-education").value = currentUser.education || "";

    // Resume preview
    const preview = document.getElementById("resume-preview");
    if (currentUser.resume) {
      preview.innerHTML = `Resume already uploaded: <a href="${currentUser.resume}" target="_blank">Preview</a>`;
    } else {
      preview.innerHTML = "";
    }

    // Reset step
    document.querySelectorAll(".step").forEach((s, i) => s.classList.toggle("hidden", i !== 0));
  });
});

// Close modal
closeApplyModal.addEventListener("click", () => closeModal());
applyModal.addEventListener("click", e => {
  if (!applyModalContent.contains(e.target)) closeModal();
});

function closeModal() {
  applyModal.classList.add("hidden");
}

// Multi-step navigation
const steps = document.querySelectorAll(".step");
let currentStep = 0;
document.querySelectorAll(".next-step").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!validateStep(currentStep)) return; // Validate before next
    steps[currentStep].classList.add("hidden");
    currentStep++;
    steps[currentStep].classList.remove("hidden");
  });
});
document.querySelectorAll(".prev-step").forEach(btn => {
  btn.addEventListener("click", () => {
    steps[currentStep].classList.add("hidden");
    currentStep--;
    steps[currentStep].classList.remove("hidden");
  });
});

// Resume preview
document.getElementById("app-resume").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    currentUser.resume = ev.target.result;
    document.getElementById("resume-preview").innerHTML = `Resume uploaded: <a href="${currentUser.resume}" target="_blank">Preview</a>`;
  };
  reader.readAsDataURL(file);
});

// Validate step
function validateStep(step) {
  if (step === 0) {
    const name = document.getElementById("app-name").value.trim();
    const email = document.getElementById("app-email").value.trim();
    const phone = document.getElementById("app-phone").value.trim();
    const experience = document.getElementById("app-experience").value.trim();
    const education = document.getElementById("app-education").value;

    if (!name || !email || !phone || !experience || !education) {
      alert("Please fill all personal info fields.");
      return false;
    }
    // Basic email and phone validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { alert("Invalid email."); return false; }
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) { alert("Invalid phone."); return false; }
  }

  if (step === 1) {
    const skillsChecked = document.querySelectorAll("#skills-container input:checked");
    if (skillsChecked.length === 0) {
      alert("Please select at least one skill.");
      return false;
    }
  }

  if (step === 2) {
    if (!currentUser.resume) {
      alert("Please upload your resume.");
      return false;
    }
  }

  return true;
}

// Submit application
applicationForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!validateStep(2)) return;

  const selectedSkills = Array.from(document.querySelectorAll("#skills-container input:checked"))
    .map(inp => inp.value);

  const application = {
    id: Date.now().toString(),
    userId: currentUser.id || "user-unknown",
    jobId: currentJobId,
    name: document.getElementById("app-name").value,
    email: document.getElementById("app-email").value,
    phone: document.getElementById("app-phone").value,
    experience: document.getElementById("app-experience").value,
    education: document.getElementById("app-education").value,
    skills: selectedSkills,
    resume: currentUser.resume,
    status: "Applied",
    appliedAt: new Date().toISOString()
  };

  // Append to localStorage
  const existingApplications = JSON.parse(localStorage.getItem("applications") || "[]");
  existingApplications.push(application);
  localStorage.setItem("applications", JSON.stringify(existingApplications));

  alert("Application submitted successfully!");
  closeModal();
});
