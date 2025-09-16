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

// ==========================
// Filter Dropdown
// ==========================



// ==========================
// Job Form Handling
// ==========================
const addJobBtn = document.getElementById("add-job-btn");
const jobForm = document.getElementById("job-form");
const cancelJobBtn = document.getElementById("cancel-job");
const createJobForm = document.getElementById("create-job-form");

// Show/Hide job form when "Add Job" clicked
addJobBtn.addEventListener("click", () => {
  jobForm.classList.toggle("hidden");
});

// Cancel button hides form + resets fields
cancelJobBtn.addEventListener("click", () => {
  jobForm.classList.add("hidden");
  createJobForm.reset();
  skills = []; // reset skill tags
  renderSkills();
});

// Handle job form submission
createJobForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const now = new Date().toISOString();

  // Build Job object
  const job = {
    id: Date.now().toString(),
    title: document.getElementById("job-title").value,
    description: document.getElementById("job-description").value,
    category: document.getElementById("job-category").value,
    skills: skills,
    responsibilities: document.getElementById("job-responsibilities").value,
    location: document.getElementById("job-location").value,
    jobType: document.getElementById("job-type").value,
    rounds: document.getElementById("job-rounds").value,
    positions: document.getElementById("job-positions").value,
    experience: document.getElementById("job-experience").value,
    createdAt: now,
    openedAt: now,
    closedAt: null
  };

  // Save job in localStorage
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  jobs.push(job);
  localStorage.setItem("jobs", JSON.stringify(jobs));

  // Toastify notification
  Toastify({
    text: "Job created successfully",
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    backgroundColor: "#28A745",
  }).showToast();

  // Reset form + hide
  createJobForm.reset();
  skills = [];
  renderSkills();
  jobForm.classList.add("hidden");
});

// ==========================
// Skills Handling (Dynamic tags)
// ==========================
const skillInput = document.getElementById("skill-input");
const addSkillBtn = document.getElementById("add-skill-btn");
const skillsContainer = document.getElementById("skills-container");

// Local array to hold skills
let skills = [];

// Add skill when button clicked
addSkillBtn.addEventListener("click", () => {
  const skill = skillInput.value.trim();
  if (skill && !skills.includes(skill)) {
    skills.push(skill);
    renderSkills();
    skillInput.value = "";
  }
});

// Allow pressing "Enter" to add skill
skillInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addSkillBtn.click();
  }
});

// Render skill tags dynamically
function renderSkills() {
  skillsContainer.innerHTML = "";
  skills.forEach((s, index) => {
    const tag = document.createElement("div");
    tag.className = "flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-full";

    tag.innerHTML = `
      <span>${s}</span>
      <button type="button" class="remove-skill text-white hover:text-gray-200">
        <i class="fas fa-times"></i>
      </button>
    `;

    tag.querySelector(".remove-skill").addEventListener("click", () => {
      skills.splice(index, 1);
      renderSkills();
    });

    skillsContainer.appendChild(tag);
  });
}

// ==========================
// Render Jobs
// ==========================
const jobsContainer = document.getElementById("jobs-container");

// ==========================
// Render Jobs (Updated to accept filtered array)
// ==========================
function renderJobs(jobsToRender = null) {
  const jobs = jobsToRender || JSON.parse(localStorage.getItem("jobs")) || [];
  jobsContainer.innerHTML = "";

  jobs.forEach(job => {
    const statusText = job.closedAt ? "Closed" : "Open";
    const toggleIcon = job.closedAt ? "fa-toggle-off text-red-500" : "fa-toggle-on text-green-500";

    const skillTags = (Array.isArray(job.skills) ? job.skills : [])
      .map(skill => `<span class="px-2 py-1 bg-blue-500 text-white rounded-md text-xs">${skill}</span>`)
      .join(" ");

    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-neutral-dark rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden transform hover:-translate-y-1 my-4";

    card.innerHTML = `
      <div class="flex flex-col md:flex-row py-2">
        <!-- Left Section -->
        <div class="flex-1 p-5 cursor-pointer transition-colors duration-300">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-semibold text-primary">${job.title}</h2>
              <span class="text-sm font-medium ${job.closedAt ? "text-red-500" : "text-green-500"}">
                ${statusText}
              </span>
            </div>
            <i class="fa-solid fa-chevron-down chevron text-gray-500 transition-transform duration-300"></i>
          </div>

          <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-300">
            <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
            <span><i class="fa-solid fa-briefcase"></i> ${job.jobType}</span>
            <span><i class="fa-regular fa-clock"></i> ${timeAgo(job.createdAt)}</span>
            <span><i class="fa-solid fa-users"></i> ${job.positions} pos</span>
          </div>

          <div class="flex flex-wrap gap-2 mt-2">${skillTags}</div>
          <div class="flex flex-wrap gap-6 text-xs text-gray-500 dark:text-gray-300 mt-2">
            <span>Experience: ${job.experience || "-"}</span>
            <span>Rounds: ${job.rounds || "-"}</span>
          </div>

          <div class="job-details max-h-0 overflow-hidden transition-all duration-500 mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <div>
              <h4 class="font-semibold">Description</h4>
              <p>${job.description || "Not provided"}</p>
            </div>
            <div>
              <h4 class="font-semibold">Responsibilities</h4>
              <p>${job.responsibilities || "Not provided"}</p>
            </div>
          </div>
        </div>

        <!-- Right Section: Icons -->
        <div class="w-full md:w-24 flex flex-row md:flex-col gap-3 p-0 justify-start md:justify-center items-center px-3">
          <button class="edit-job bg-primary dark:bg-secondary p-3 rounded-lg hover:scale-105 transition text-white shadow-md" data-id="${job.id}">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="toggle-job bg-gray-100 dark:bg-neutral-mid p-3 rounded-lg hover:scale-105 transition ${job.closedAt ? "text-red-500" : "text-green-500"} shadow-md" data-id="${job.id}">
            <i class="fa-solid ${toggleIcon}"></i>
          </button>
          <button class="delete-job bg-red-600 dark:bg-red-700 p-3 rounded-lg hover:scale-105 transition text-white shadow-md" data-id="${job.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;

    jobsContainer.appendChild(card);

    // Expand/collapse animation
    const leftSection = card.querySelector(".flex-1");
    const details = card.querySelector(".job-details");
    const chevron = card.querySelector(".chevron");

    leftSection.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      details.classList.toggle("max-h-0");
      details.classList.toggle("max-h-96");
      chevron.classList.toggle("rotate-180");
    });
  });

  attachEventListeners();
}




// ==========================
// Search Jobs (Check title/category/skills)
// ==========================
// searchBtn.addEventListener("click", () => {
//   const keyword = keywordInput.value.trim().toLowerCase();
//   const location = locationInput.value.trim().toLowerCase();

//   const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

//   const filteredJobs = jobs.filter(job => {
//     const titleMatch = job.title.toLowerCase().includes(keyword);
//     const categoryMatch = job.category.toLowerCase().includes(keyword);

//     // Skill match
//     const skillsMatch = Array.isArray(job.skills)
//       ? job.skills.some(skill => skill.toLowerCase().includes(keyword))
//       : false;

//     const locationMatch = job.location.toLowerCase().includes(location);

//     return (titleMatch || categoryMatch || skillsMatch) && locationMatch;
//   });

//   // Render filtered jobs
//   renderJobs(filteredJobs);
// });


function attachEventListeners() {
  document.querySelectorAll(".edit-job").forEach(btn =>
    btn.addEventListener("click", () => editJob(btn.dataset.id))
  );
  document.querySelectorAll(".toggle-job").forEach(btn =>
    btn.addEventListener("click", () => toggleJobStatus(btn.dataset.id))
  );
  document.querySelectorAll(".delete-job").forEach(btn =>
    btn.addEventListener("click", () => deleteJob(btn.dataset.id))
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

renderJobs();


function deleteJob(id) {
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  jobs = jobs.filter(job => job.id !== id);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  renderJobs();

  Toastify({
    text: "Job deleted successfully",
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    backgroundColor: "#DC3545",
  }).showToast();
}


function editJob(id) {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const job = jobs.find(j => j.id === id);
  if (!job) return;

  // Remove existing edit forms if any
  document.querySelectorAll(".edit-form-container").forEach(f => f.remove());

  // Find job card
  const jobCard = [...jobsContainer.children].find(card =>
    card.querySelector(`.edit-job[data-id="${id}"]`)
  );

  // Create edit form container
  const editFormContainer = document.createElement("div");
  editFormContainer.className = "edit-form-container mt-4 bg-white dark:bg-neutral-dark p-6 rounded-lg shadow-lg";
  jobCard.appendChild(editFormContainer);

  // Form HTML (same style as Add Job form)
  editFormContainer.innerHTML = `
    <h3 class="text-lg font-semibold mb-4">Edit Job</h3>
    <form class="grid grid-cols-1 md:grid-cols-2 gap-6 edit-job-form">
      <div class="col-span-1">
        <input type="text" name="title" value="${job.title}" placeholder="Enter Job Title" required
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div class="col-span-1">
        <input type="text" name="category" value="${job.category}" placeholder="Category"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div class="col-span-1 md:col-span-2">
        <textarea name="description" placeholder="Enter Job Description" required
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 h-28">${job.description}</textarea>
      </div>
      <div class="col-span-1 md:col-span-2 space-y-3">
        <label class="block font-medium text-gray-700 dark:text-white">Skills</label>
        <div class="flex items-center space-x-2">
          <input type="text" class="flex-1 p-3 border rounded-lg bg-white dark:bg-neutral-mid text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none skill-input" placeholder="Enter a skill"/>
          <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-blue-600 transition add-skill-btn">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="flex flex-wrap gap-2 skills-container"></div>
      </div>
      <div class="col-span-1 md:col-span-2">
        <textarea name="responsibilities" placeholder="Responsibilities"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 h-28">${job.responsibilities}</textarea>
      </div>
      <div class="col-span-1">
        <input type="text" name="location" value="${job.location}" placeholder="Location"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div class="col-span-1">
        <select name="jobType"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none">
          <option value="Full-time" ${job.jobType === "Full-time" ? "selected" : ""}>Full-time</option>
          <option value="Part-time" ${job.jobType === "Part-time" ? "selected" : ""}>Part-time</option>
          <option value="Internship" ${job.jobType === "Internship" ? "selected" : ""}>Internship</option>
        </select>
      </div>
      <div class="col-span-1">
        <input type="text" name="rounds" value="${job.rounds}" placeholder="Rounds"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div class="col-span-1">
        <input type="number" name="positions" value="${job.positions}" placeholder="Positions"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div class="col-span-1 md:col-span-2">
        <input type="text" name="experience" value="${job.experience}" placeholder="Experience"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
      <div class="col-span-1 md:col-span-2 flex justify-end space-x-3 pt-4">
        <button type="button" class="cancel-edit px-5 py-2 rounded-lg bg-gray-300 dark:bg-neutral-light dark:text-neutral-dark hover:bg-gray-400 dark:hover:bg-neutral-mid transition">Cancel</button>
        <button type="submit" class="px-6 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition shadow-md">Save Changes</button>
      </div>
    </form>
  `;

  // Skill handling
  const skillsContainer = editFormContainer.querySelector(".skills-container");
  let editSkills = [...job.skills];

  function renderEditSkills() {
    skillsContainer.innerHTML = "";
    editSkills.forEach((skill, index) => {
      const tag = document.createElement("div");
      tag.className = "flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-full";
      tag.innerHTML = `<span>${skill}</span><button type="button" class="remove-skill"><i class="fas fa-times"></i></button>`;
      tag.querySelector(".remove-skill").addEventListener("click", () => {
        editSkills.splice(index, 1);
        renderEditSkills();
      });
      skillsContainer.appendChild(tag);
    });
  }
  renderEditSkills();

  // Add skill button
  const addSkillBtn = editFormContainer.querySelector(".add-skill-btn");
  const skillInput = editFormContainer.querySelector(".skill-input");
  addSkillBtn.addEventListener("click", () => {
    const val = skillInput.value.trim();
    if (val && !editSkills.includes(val)) {
      editSkills.push(val);
      renderEditSkills();
      skillInput.value = "";
    }
  });
  skillInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkillBtn.click();
    }
  });

  // Cancel edit
  editFormContainer.querySelector(".cancel-edit").addEventListener("click", () => {
    editFormContainer.remove();
  });

  // Save changes
  editFormContainer.querySelector(".edit-job-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    job.title = formData.get("title");
    job.category = formData.get("category");
    job.description = formData.get("description");
    job.responsibilities = formData.get("responsibilities");
    job.location = formData.get("location");
    job.jobType = formData.get("jobType");
    job.rounds = formData.get("rounds");
    job.positions = formData.get("positions");
    job.experience = formData.get("experience");
    job.skills = editSkills;

    const allJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const jobIndex = allJobs.findIndex(j => j.id === id);
    allJobs[jobIndex] = job;
    localStorage.setItem("jobs", JSON.stringify(allJobs));
    renderJobs();

    Toastify({
      text: "Job updated successfully",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#28A745",
    }).showToast();
  });
}


function toggleJobStatus(jobId) {
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs = jobs.map(job => {
    if (job.id === jobId) {
      if (job.closedAt) {
        // If job is closed, open it
        job.closedAt = null;
        job.openedAt = new Date().toISOString();
      } else {
        // If job is open, close it
        job.closedAt = new Date().toISOString();
      }
    }
    return job;
  });

  localStorage.setItem("jobs", JSON.stringify(jobs));

  // Re-render jobs to reflect changes
  renderJobs();
}






// ==========================
// Search & Filter Elements
// ==========================
const keywordInput = document.getElementById("keyword-search");
const locationInput = document.getElementById("location-search");
const searchBtn = document.getElementById("search-btn");

const filterToggle = document.getElementById("filter-toggle");
const filterMenu = document.getElementById("filter-menu");
let currentFilterStatus = "all"; // Default: show all

// ==========================
// Toggle filter menu
// ==========================
filterToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  filterMenu.classList.toggle("hidden");
});

// Close filter menu when clicking outside
document.addEventListener("click", () => filterMenu.classList.add("hidden"));

// ==========================
// Filter buttons
// ==========================
filterMenu.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentFilterStatus = btn.getAttribute("data-status"); // open | closed | all
    filterMenu.classList.add("hidden");
    filterAndRenderJobs();
  });
});

// ==========================
// Search button
// ==========================
searchBtn.addEventListener("click", filterAndRenderJobs);

// Optional: Enter key triggers search
keywordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") filterAndRenderJobs();
});
locationInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") filterAndRenderJobs();
});

// ==========================
// Filter & Render Jobs Function
// ==========================
function filterAndRenderJobs() {
  const keyword = keywordInput.value.trim().toLowerCase();
  const location = locationInput.value.trim().toLowerCase();
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  // Filter by status
  if (currentFilterStatus === "open") jobs = jobs.filter(job => !job.closedAt);
  else if (currentFilterStatus === "closed") jobs = jobs.filter(job => job.closedAt);

  // Filter by keyword and location
  jobs = jobs.filter(job => {
    const inTitle = job.title.toLowerCase().includes(keyword);
    const inSkills = (job.skills || []).some(skill => skill.toLowerCase().includes(keyword));
    const inLocation = job.location.toLowerCase().includes(location);
    return (keyword === "" || inTitle || inSkills) && (location === "" || inLocation);
  });

   jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  renderJobs(jobs);
}

// ==========================
// Initial render
// ==========================
filterAndRenderJobs();

// =======================
// Rounds Management
// =======================

// Storage
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let rounds = JSON.parse(localStorage.getItem("rounds")) || [];

// Temp storage for rounds before saving
let tempRounds = [];

// Add Round
document.getElementById("add-round-btn").addEventListener("click", () => {
  const roundInput = document.getElementById("round-input");
  const roundName = roundInput.value.trim();

  if (roundName) {
    const roundId = "round_" + Date.now().toString();

    // Add to temp
    tempRounds.push({ roundId, roundName });

    // Render chip
    const chip = document.createElement("span");
    chip.className =
      "px-3 py-1 bg-primary text-white rounded-full text-sm flex items-center space-x-2";
    chip.innerHTML = `${roundName} 
      <button type="button" class="ml-2 text-white hover:text-gray-200" data-id="${roundId}">&times;</button>`;

    document.getElementById("rounds-container").appendChild(chip);

    // Clear input
    roundInput.value = "";
  }
});

// Remove Round
document.getElementById("rounds-container").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const roundId = e.target.getAttribute("data-id");
    tempRounds = tempRounds.filter((r) => r.roundId !== roundId);
    e.target.parentElement.remove();
  }
});

// =======================
// Job Form Submit
// =======================
document.getElementById("create-job-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const jobId = "job_" + Date.now().toString();
  const title = document.getElementById("job-title").value;
  const category = document.getElementById("job-category").value;
  const description = document.getElementById("job-description").value;
  const location = document.getElementById("job-location").value;
  const type = document.getElementById("job-type").value;
  const positions = document.getElementById("job-positions").value;
  const experience = document.getElementById("job-experience").value;

  // Create job object
  const newJob = {
    jobId,
    title,
    category,
    description,
    location,
    type,
    positions,
    experience,
    rounds: tempRounds.map(r => r.roundId), // only store round IDs
  };

  // Save rounds in global rounds array
  tempRounds.forEach((r, index) => {
    rounds.push({
      roundId: r.roundId,
      jobId,
      roundName: r.roundName,
      sequence: index + 1,
    });
  });

  // Save job
  jobs.push(newJob);

  // Persist to localStorage
  localStorage.setItem("jobs", JSON.stringify(jobs));
  localStorage.setItem("rounds", JSON.stringify(rounds));

  // Reset
  tempRounds = [];
  document.getElementById("rounds-container").innerHTML = "";
  document.getElementById("create-job-form").reset();

  // Toast
  Toastify({
    text: "Job & Rounds Saved Successfully ✅",
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "#265DF5",
  }).showToast();
});
