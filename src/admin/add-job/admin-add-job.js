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


createJobForm.querySelectorAll("input, select, textarea").forEach((input, i, arr) => {
  input.addEventListener("keydown", (e) => {
      if (input.id === "skill-input") return;  
      if(input.id==="round-input") return;
    if (e.key === "Enter") {
      e.preventDefault(); 
    if (i < arr.length - 1) {
        arr[i + 1].focus();
      } else {
        createJobForm.requestSubmit();
      }
    }
  });
});

// ==========================
// Skills Handling (Dynamic tags)
// ==========================
const skillInput = document.getElementById("skill-input");
const addSkillBtn = document.getElementById("add-skill-btn");
const skillsContainer = document.getElementById("skills-container");

let skills = [];


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
            <span>Rounds: ${job.rounds.length || "-"}</span>
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

function toggleJobStatus(id)
{
   const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const job = jobs.find(j => j.id === id);

  if (job.closedAt) {
    Toastify({
      text: "Job cannot be reopened",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "red",
    }).showToast();
  } else {
    // Close the job
    job.closedAt = new Date().toISOString();
    Toastify({
      text: "Job closed successfully",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#ffc107",
    }).showToast();
  }

  // Save back to storage
  localStorage.setItem("jobs", JSON.stringify(jobs));

  // Refresh UI
  renderJobs();
}
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

  // Remove existing edit forms
  document.querySelectorAll(".edit-form-container").forEach(f => f.remove());

  // Find job card
  const jobCard = [...jobsContainer.children].find(card =>
    card.querySelector(`.edit-job[data-id="${id}"]`)
  );

  // Create edit form container
  const editFormContainer = document.createElement("div");
  editFormContainer.className = "edit-form-container mt-4 bg-white dark:bg-neutral-dark p-6 rounded-lg shadow-lg";
  jobCard.appendChild(editFormContainer);

  // Form HTML
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
  <label class="block font-medium text-gray-700 dark:text-white mb-1">Location</label>
  <div class="flex gap-2">
    <select name="location" class="job-location-select flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none">
      <!-- options will be populated dynamically -->
    </select>
    <button type="button" class="add-location-btn px-3 py-2 bg-secondary text-white rounded-lg hover:bg-blue-500 transition">
      <i class="fas fa-plus"></i>
    </button>
  </div>
  <!-- Hidden Add Location Input -->
  <div class="new-location-box hidden mt-2 flex gap-2">
    <input type="text" class="new-location-input flex-1 p-2 border rounded-lg bg-white dark:bg-neutral-mid text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none" placeholder="Enter new location"/>
    <button type="button" class="save-location-btn px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">Save</button>
  </div>
</div>

      <div class="col-span-1">
        <select name="jobType"
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-mid text-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none">
          <option value="Full-time" ${job.jobType === "Full-time" ? "selected" : ""}>Full-time</option>
          <option value="Part-time" ${job.jobType === "Part-time" ? "selected" : ""}>Part-time</option>
          <option value="Internship" ${job.jobType === "Internship" ? "selected" : ""}>Internship</option>
        </select>
      </div>
      <div class="col-span-1 md:col-span-2">
        <div id="edit-rounds-container"></div>
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

  // ======================
  // Skills handling
  // ======================
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
  skillInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkillBtn.click();
    }
  });

  // Cancel edit
  editFormContainer.querySelector(".cancel-edit").addEventListener("click", () => {
    editFormContainer.remove();
  });

  // ======================
  // Rounds handling
  // ======================
  const editRoundsContainerEl = editFormContainer.querySelector("#edit-rounds-container");
  const roundInputWrapper = document.createElement("div");
  roundInputWrapper.className = "mt-2";
  roundInputWrapper.innerHTML = `
    <div class="flex flex-col sm:flex-row gap-2">
      <input type="number" id="edit-round-count" min="1" placeholder="No. of rounds"
        class="flex-1 p-3 border rounded-lg bg-white dark:bg-neutral-mid text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"/>
      <button type="button" id="confirm-edit-round-count" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition w-full sm:w-auto">
        Confirm
      </button>
    </div>
   <div id="edit-round-input-area" class="hidden flex flex-col sm:flex-row gap-2 mt-2 items-center">
  <input type="text" id="edit-round-input" placeholder="Enter round name"
    class="flex-1 p-3 border rounded-lg bg-white dark:bg-neutral-mid text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"/>
  <button type="button" id="add-edit-round-btn" class="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white hover:bg-blue-600 transition">
    <i class="fas fa-plus"></i>
  </button>
  <p id="round-limit-msg" class="text-sm text-gray-500 dark:text-gray-400 mt-0 ml-3">You have reached the max rounds limit.</p>
</div>

  `;

  // Append wrapper directly inside the rounds container
  editRoundsContainerEl.appendChild(roundInputWrapper);

  let editRounds = (JSON.parse(localStorage.getItem("rounds")) || []).filter(r => r.jobId === id);
  let maxRounds = editRounds.length || 0;

  function renderEditRounds() {
    editRoundsContainerEl.innerHTML = "";
    editRoundsContainerEl.appendChild(roundInputWrapper);
    editRounds.sort((a,b) => a.sequence - b.sequence);
    editRounds.forEach((r,index) => {
      const chip = document.createElement("span");
      chip.className = "inline-flex items-center px-3 py-1 bg-primary text-white rounded-full text-sm font-medium space-x-2 my-2";
      chip.innerHTML = `
        <span>${index + 1}. ${r.roundName}</span>
        <button type="button" class="ml-2 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">&times;</button>
      `;
      chip.querySelector("button").addEventListener("click", () => {
        editRounds = editRounds.filter(er => er.roundId !== r.roundId);
        maxRounds = editRounds.length;
        renderEditRounds();
      });
      editRoundsContainerEl.appendChild(chip);
    });

    // Append the round input wrapper below chips
    
  }
  renderEditRounds();

  const editRoundCount = editFormContainer.querySelector("#edit-round-count");
  const confirmEditRoundCount = editFormContainer.querySelector("#confirm-edit-round-count");
  const editRoundInputArea = editFormContainer.querySelector("#edit-round-input-area");
  const addEditRoundBtn = editFormContainer.querySelector("#add-edit-round-btn");
  const editRoundInput = editFormContainer.querySelector("#edit-round-input");

  confirmEditRoundCount.addEventListener("click", () => {
    const val = parseInt(editRoundCount.value);
    if(val > 0){
      maxRounds = val;
      editRoundInputArea.classList.remove("hidden");
      editRoundInput.focus();
      document.getElementById("round-limit-msg")?.remove();
    }
  });

  addEditRoundBtn.addEventListener("click", () => {
    const val = editRoundInput.value.trim();
    if(!val) return;
    if(editRounds.length >= maxRounds){
      if(!document.getElementById("round-limit-msg")){
        const msg = document.createElement("p");
        msg.id = "round-limit-msg";
        msg.className = "text-sm text-gray-500 dark:text-gray-400 mt-1";
        msg.innerText = "You have reached the max rounds limit.";
        editRoundInputArea.appendChild(msg);
      }
      return;
    }
    editRounds.push({
      roundId:  Date.now(),
      jobId: id,
      roundName: val,
      sequence: editRounds.length + 1
    });
    editRoundInput.value = "";
    renderEditRounds();
  });

  editRoundInput.addEventListener("keypress", e => {
    if(e.key === "Enter"){
      e.preventDefault();
      addEditRoundBtn.click();
    }
  });

  // ======================
  // Save Changes
  // ======================
  editFormContainer.querySelector(".edit-job-form").addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    job.title = formData.get("title");
    job.category = formData.get("category");
    job.description = formData.get("description");
    job.responsibilities = formData.get("responsibilities");
    job.location = formData.get("location");
    job.jobType = formData.get("jobType");
    job.positions = formData.get("positions");
    job.experience = formData.get("experience");
    job.skills = editSkills;

    // Update rounds sequence & local storage
    editRounds.forEach((r,index) => r.sequence = index+1);
    let allRounds = JSON.parse(localStorage.getItem("rounds")) || [];
    allRounds = allRounds.filter(r => r.jobId !== id).concat(editRounds);
    localStorage.setItem("rounds", JSON.stringify(allRounds));

    // Update job in localStorage
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

    editFormContainer.remove();
  });
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





let tempRounds = [];

  let roundLimit = 0;

  const roundInput = document.getElementById("round-input");
  const addRoundBtn = document.getElementById("add-round-btn");
  const roundsContainer = document.getElementById("rounds-container");
  const roundInputArea = document.getElementById("round-input-area");
  const roundLimitMsg = document.getElementById("round-limit-msg");

  // Confirm number of rounds
  document.getElementById("confirm-round-count").addEventListener("click", () => {
    const count = parseInt(document.getElementById("round-count").value);

    if (isNaN(count) || count <= 0) {
      alert("Please enter a valid number of rounds!");
      return;
    }

    roundLimit = count;
    tempRounds = []; // reset
    roundsContainer.innerHTML = "";
    roundInputArea.classList.remove("hidden");
    roundLimitMsg.textContent = `You can add up to ${roundLimit} rounds.`;
  });

  // Add round (by button or Enter key)
  function addRound() {
    if (tempRounds.length >= roundLimit) {
      roundLimitMsg.textContent = `You already added ${roundLimit} rounds.`;
      return;
    }

    const roundName = roundInput.value.trim();
    if (!roundName) return;

    const roundId = Date.now().toString();

    tempRounds.push({ roundId, roundName });

    const chip = document.createElement("span");
    chip.className =
      "px-3 py-1 bg-primary text-white rounded-full text-sm flex items-center space-x-2";
    chip.innerHTML = `${tempRounds.length}. ${roundName} 
      <button type="button" class="ml-2 text-white hover:text-gray-200" data-id="${roundId}">&times;</button>`;

    roundsContainer.appendChild(chip);
    roundInput.value = "";
  }

  addRoundBtn.addEventListener("click", addRound);

  // Enter key adds round
  roundInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRound();
    }
  });

  // Remove round
  roundsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const roundId = e.target.getAttribute("data-id");
      tempRounds = tempRounds.filter((r) => r.roundId !== roundId);
      e.target.parentElement.remove();
    }
  });

let rounds = JSON.parse(localStorage.getItem("rounds")) || [];

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
   rounds: tempRounds.map(r => r.roundId),
    positions: document.getElementById("job-positions").value,
    experience: document.getElementById("job-experience").value,
    createdAt: now,
    openedAt: now,
    closedAt: null
  };

  // Save job in localStorage
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
   tempRounds.forEach((r, index) => {
      rounds.push({
        roundId: r.roundId,
        jobId:job.id,
        roundName: r.roundName,
        sequence: index + 1,
      });
    });

  jobs.push(job);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  localStorage.setItem("rounds", JSON.stringify(rounds));

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
  tempRounds=[]
});


// ==========================
// Initial render
// ==========================
filterAndRenderJobs();


// ==========================
// Manage Locations
// ==========================
const locationSelect = document.getElementById("job-location");
const addLocationBtn = document.getElementById("add-location-btn");
const newLocationBox = document.getElementById("new-location-box");
const newLocationInput = document.getElementById("new-location-input");
const saveLocationBtn = document.getElementById("save-location-btn");

// Default locations
let defaultLocations = ["Chennai", "Coimbatore", "Bangalore", "Hyderabad"];

// Load saved + default locations
function loadLocations() {
  let savedLocations = JSON.parse(localStorage.getItem("locations")) || [];
  let allLocations = [...new Set([...defaultLocations, ...savedLocations])];

  locationSelect.innerHTML = `<option value="" disabled selected>Select Location</option>`;
  allLocations.forEach(loc => {
    let opt = document.createElement("option");
    opt.value = loc;
    opt.textContent = loc;
    locationSelect.appendChild(opt);
  });
}

// Show input box for new location
addLocationBtn.addEventListener("click", () => {
  newLocationBox.classList.toggle("hidden");
  newLocationInput.focus();
});

// Save new location
saveLocationBtn.addEventListener("click", () => {
  let newLoc = newLocationInput.value.trim();
  if (newLoc) {
    let savedLocations = JSON.parse(localStorage.getItem("locations")) || [];
    if (!savedLocations.includes(newLoc)) {
      savedLocations.push(newLoc);
      localStorage.setItem("locations", JSON.stringify(savedLocations));
      Toastify({
        text: `Location "${newLoc}" added successfully!`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#28a745",
      }).showToast();
    }
    newLocationInput.value = "";
    newLocationBox.classList.add("hidden");
    loadLocations();
    locationSelect.value = newLoc; // auto-select new location
  }
});

// Initialize dropdown
loadLocations();


function setupEditLocationDropdown(editForm, job) {
  const locationSelect = editForm.querySelector(".job-location-select");
  const addLocationBtn = editForm.querySelector(".add-location-btn");
  const newLocationBox = editForm.querySelector(".new-location-box");
  const newLocationInput = editForm.querySelector(".new-location-input");
  const saveLocationBtn = editForm.querySelector(".save-location-btn");

  let defaultLocations = ["Chennai", "Coimbatore", "Bangalore", "Hyderabad"];

  function loadLocations() {
    let savedLocations = JSON.parse(localStorage.getItem("locations")) || [];
    let allLocations = [...new Set([...defaultLocations, ...savedLocations])];

    locationSelect.innerHTML = `<option value="" disabled>Select Location</option>`;
    allLocations.forEach(loc => {
      let opt = document.createElement("option");
      opt.value = loc;
      opt.textContent = loc;
      if (job.location === loc) opt.selected = true; // auto-select job's location
      locationSelect.appendChild(opt);
    });
  }

  // Show input box
  addLocationBtn.addEventListener("click", () => {
    newLocationBox.classList.toggle("hidden");
    newLocationInput.focus();
  });

  // Save new location
  saveLocationBtn.addEventListener("click", () => {
    let newLoc = newLocationInput.value.trim();
    if (newLoc) {
      let savedLocations = JSON.parse(localStorage.getItem("locations")) || [];
      if (!savedLocations.includes(newLoc)) {
        savedLocations.push(newLoc);
        localStorage.setItem("locations", JSON.stringify(savedLocations));
        Toastify({
          text: `Location "${newLoc}" added successfully!`,
          duration: 3000,
          gravity: "bottom",
          position: "right",
          backgroundColor: "#28a745",
        }).showToast();
      }
      newLocationInput.value = "";
      newLocationBox.classList.add("hidden");
      loadLocations();
      locationSelect.value = newLoc; // auto-select new location
    }
  });

  loadLocations();
}

