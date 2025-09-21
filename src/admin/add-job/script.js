// ==========================
// Elements
// ==========================
const toggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuIcon = document.getElementById('menu-icon');
const darkToggle = document.getElementById('dark-toggle');
const jobsContainer = document.getElementById("jobs-container");
const keywordInput = document.getElementById("keyword-search");
const locationInput = document.getElementById("location-search");
const searchBtn = document.getElementById("search-btn");
const filterBtn = document.getElementById("filter-btn");
const filterOptions = document.getElementById("filter-options");
const filterText = document.getElementById("filter-text");
const addJobBtn = document.getElementById("add-job-btn");

let currentFilterStatus = "all";

// ==========================
// Sample Jobs (for testing)
// ==========================
if(!localStorage.getItem("jobs")) {
  const sampleJobs = [
    { id:"1", title:"Frontend Developer", location:"NY", jobType:"Full-Time", skills:["React","JS"], positions:3, createdAt:new Date().toISOString(), closedAt:null, description:"Build UI", responsibilities:"Develop features", experience:"2+ yrs", rounds:["HR","Tech"] },
    { id:"2", title:"Backend Developer", location:"LA", jobType:"Part-Time", skills:["Node","Express"], positions:2, createdAt:new Date().toISOString(), closedAt:null, description:"Server-side APIs", responsibilities:"Build API", experience:"3+ yrs", rounds:["Tech"] },
    { id:"3", title:"Data Scientist", location:"NY", jobType:"Full-Time", skills:["Python","ML"], positions:1, createdAt:new Date().toISOString(), closedAt:new Date().toISOString(), description:"Analyze data", responsibilities:"Modeling", experience:"4+ yrs", rounds:["HR","Tech","Manager"] }
  ];
  localStorage.setItem("jobs", JSON.stringify(sampleJobs));
}

// ==========================
// Sidebar Toggle
// ==========================
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
  menuIcon.classList.toggle('fa-bars');
  menuIcon.classList.toggle('fa-xmark');
});

overlay.addEventListener('click', () => {
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
  menuIcon.classList.add('fa-bars');
  menuIcon.classList.remove('fa-xmark');
});

// ==========================
// Dark Mode Toggle
// ==========================
darkToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

// ==========================
// Time Ago Helper
// ==========================
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// ==========================
// Render Jobs
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
            <span>Rounds: ${job.rounds?.length || "-"}</span>
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

  attachJobEventListeners();
}

// ==========================
// Attach Job Buttons Events
// ==========================
function attachJobEventListeners() {
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

// ==========================
// Delete Job
// ==========================
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

// ==========================
// Toggle Job Status
// ==========================
function toggleJobStatus(id) {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const job = jobs.find(j => j.id === id);
  if (!job) return;
  job.closedAt = job.closedAt ? null : new Date().toISOString();
  localStorage.setItem("jobs", JSON.stringify(jobs));
  renderJobs();
}

// ==========================
// Edit Job (simplified)
// ==========================
function editJob(id) {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const job = jobs.find(j => j.id === id);
  if (!job) return;

  // Open modal
  modal.classList.remove("hidden");

  // Prefill basic info
  document.getElementById("job-title").value = job.title;
  document.getElementById("job-description").value = job.description;
  document.getElementById("job-responsibilities").value = job.responsibilities;
  document.getElementById("job-positions").value = job.positions;
  document.getElementById("job-experience").value = job.experience;
  document.getElementById("job-type").value = job.jobType;

  // Prefill dynamic dropdowns
  populateSelect("job-category", categories);
  document.getElementById("job-category").value = job.category;
  populateSelect("job-location", locations);
  document.getElementById("job-location").value = job.location;

  // Prefill skills
  skills = [...job.skills];
  renderSkills();

  // Prefill rounds with roundId, jobId, sequence
  tempRounds = (job.rounds || []).map((r, i) => ({
    roundId: r.roundId || Date.now().toString() + i,
    jobId: job.id,
    roundName: r.roundName || r,
    sequence: i + 1
  }));
  roundLimit = Math.max(tempRounds.length, 1);
  roundInputArea.classList.remove("hidden");
  renderRounds();

  // Mark editing
  form.dataset.editingId = id;
}


// ==========================
// Search Only (keyword + location)
// ==========================
function searchJobs() {
  const keyword = keywordInput.value.trim().toLowerCase();
  const location = locationInput.value.trim().toLowerCase();

  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  const filteredJobs = jobs.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(keyword);
    const skillMatch = (job.skills || []).some(skill => skill.toLowerCase().includes(keyword));
    const locationMatch = job.location.toLowerCase().includes(location);

    return (keyword === "" || titleMatch || skillMatch) &&
           (location === "" || locationMatch);
  });

  filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  renderJobs(filteredJobs);
}

// ==========================
// Filter Only (status)
// ==========================
function filterJobsByStatus(status) {
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  const filteredJobs = jobs.filter(job => {
    if (status === "all") return true;
    if (status === "open") return !job.closedAt;
    if (status === "closed") return !!job.closedAt;
  });

  filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  renderJobs(filteredJobs);
}

// ==========================
// Events
// ==========================
searchBtn.addEventListener("click", searchJobs);
[keywordInput, locationInput].forEach(input => {
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") searchJobs();
  });
});

// Filter dropdown click
filterOptions.querySelectorAll("li").forEach(li => {
  li.addEventListener("click", () => {
    currentFilterStatus = li.dataset.status; // store current filter
    filterText.textContent = li.textContent;
    filterOptions.classList.add("hidden");
    filterJobsByStatus(currentFilterStatus);
  });
});




// ==========================
// Filter Dropdown Toggle
// ==========================
filterBtn.addEventListener("click", () => {
  filterOptions.classList.toggle("hidden");
});

// Hide dropdown if clicked outside
document.addEventListener("click", (e) => {
  if (!filterBtn.contains(e.target) && !filterOptions.contains(e.target)) {
    filterOptions.classList.add("hidden");
  }
});

// ==========================
// Filter Click
// ==========================
filterOptions.querySelectorAll("li").forEach(li => {
  li.addEventListener("click", () => {
    const status = li.dataset.status;
    filterBtn.querySelector("span")?.remove(); // optional: remove previous label if any
    filterJobsByStatus(status);
    filterOptions.classList.add("hidden"); // hide after selecting
  });
});


 const openBtn = document.getElementById("open-job-modal");
  const closeBtn = document.getElementById("close-job-modal");
  const modal = document.getElementById("job-modal");
  const form = document.getElementById("create-job-form");
  const steps = document.querySelectorAll(".step");
  const stepCircles = document.querySelectorAll(".step-circle");
  const prevBtn = document.querySelector(".prev-step");
  const nextBtn = document.querySelector(".next-step");
  const finishBtn = document.querySelector(".finish-step");

  // --- Dynamic dropdowns ---
  let categories = ["Engineering","Design","Marketing"];
  let locations = ["New York","San Francisco","Remote"];
  categories = JSON.parse(localStorage.getItem("jobCategories")) || categories;
locations = JSON.parse(localStorage.getItem("jobLocations")) || locations;

  let skills = [];
  let currentStep = 0;

  const populateSelect = (id, items) => {
    const select = document.getElementById(id);
    if(!select) return;
    select.innerHTML = "";
    items.forEach(i => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      select.appendChild(option);
    });
  };

  populateSelect("job-category", categories);
  populateSelect("job-location", locations);

  // --- Open/Close modal ---
  openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => { modal.classList.add("hidden"); resetForm(); });

  // --- Dynamic input for new category/location ---
  const switchToInput = (type) => {
  const wrapper = document.getElementById(type + "-wrapper");
  wrapper.innerHTML = `<input type="text" id="${type}-input" class="w-full p-3 border rounded-lg" placeholder="Enter new ${type}"/>`;

  const input = document.getElementById(type + "-input");
  input.focus();

  let saved = false;
  const save = () => {
    if(saved) return;
    saved = true;
    saveNewValue(type, input.value);
  };

  input.addEventListener("keydown", e => { if(e.key==="Enter"){ e.preventDefault(); save(); } });
  input.addEventListener("blur", save);
};


  const saveNewValue = (type, value) => {
  if(!value.trim()) return restoreSelect(type);

  if(type === "category" && !categories.includes(value)){
    categories.push(value);
    Toastify({
      text: `Category "${value}" added`,
      gravity: "bottom",
      position: "right",
      duration: 2500,
      backgroundColor: "#28A745"
    }).showToast();

    // Save categories to localStorage
    localStorage.setItem("jobCategories", JSON.stringify(categories));

    populateSelect("job-category", categories);
  }

  if(type === "location" && !locations.includes(value)){
    locations.push(value);
    Toastify({
      text: `Location "${value}" added`,
      gravity: "bottom",
      position: "right",
      duration: 2500,
      backgroundColor: "#28A745"
    }).showToast();

    // Save locations to localStorage
    localStorage.setItem("jobLocations", JSON.stringify(locations));

    populateSelect("job-location", locations);
  }

  restoreSelect(type);
};


  const restoreSelect = (type) => {
    const wrapper=document.getElementById(type+"-wrapper");
    wrapper.innerHTML=`<select id="job-${type}" class="w-full p-3 border rounded-lg"></select>`;
    populateSelect("job-"+type, type==="category"?categories:locations);
  };

  document.getElementById("add-category-btn").addEventListener("click", ()=>switchToInput("category"));
  document.getElementById("add-location-btn")?.addEventListener("click", ()=>switchToInput("location"));

  // --- Stepper ---
  const showStep = (index) => {
    steps.forEach((s,i)=> s.classList.toggle("hidden", i!==index));
    stepCircles.forEach((c,i)=>{
      c.classList.toggle("bg-blue-600", i===index);
      c.classList.toggle("text-white", i===index);
      c.classList.toggle("bg-white", i!==index);
      c.classList.toggle("text-gray-600", i!==index);
      c.classList.toggle("border-gray-300", i!==index);
    });
    prevBtn.classList.toggle("hidden", index===0);
    nextBtn.classList.toggle("hidden", index===steps.length-1);
    finishBtn.classList.toggle("hidden", index!==steps.length-1);
  };

  const validateStep = () => {
    let valid = true;
    if(currentStep===0){
      const title = document.getElementById("job-title").value.trim();
      const category = document.getElementById("job-category")?.value;
      const location = document.getElementById("job-location")?.value;
      if(!title || !category || !location){
        valid=false;
        Toastify({text:"Please fill all fields in Job Basics",duration:3000,gravity:"bottom",position:"right",backgroundColor:"#DC3545"}).showToast();
      }
    }
    if(currentStep===1){
      const description = document.getElementById("job-description").value.trim();
      if(!description || skills.length===0){
        valid=false;
        Toastify({text:"Add description and at least one skill",duration:3000,gravity:"bottom",position:"right",backgroundColor:"#DC3545"}).showToast();
      }
    }
    if(currentStep===2){
      const positions = document.getElementById("job-positions").value.trim();
      const experience = document.getElementById("job-experience").value.trim();
      if(tempRounds.length===0 || !positions || !experience || isNaN(parseInt(experience))){
        valid=false;
        Toastify({text:"Complete all rounds, positions and valid experience",duration:3000,gravity:"bottom",position:"right",backgroundColor:"#DC3545"}).showToast();
      }
    }
    return valid;
  };

  nextBtn.addEventListener("click", ()=>{ if(validateStep() && currentStep<steps.length-1){ currentStep++; showStep(currentStep); }});
  prevBtn.addEventListener("click", ()=>{ if(currentStep>0){ currentStep--; showStep(currentStep); }});
  showStep(currentStep);

  // --- Skills ---
  const skillInput = document.getElementById("skill-input");
  const addSkillBtn = document.getElementById("add-skill-btn");
  const skillsContainer = document.getElementById("skills-container");

  const renderSkills = () => {
    skillsContainer.innerHTML="";
    skills.forEach((s,i)=>{
      const tag = document.createElement("div");
      tag.className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-full";
      tag.innerHTML=`<span>${s}</span><button type="button">&times;</button>`;
      tag.querySelector("button").addEventListener("click", ()=>{ skills.splice(i,1); renderSkills(); });
      skillsContainer.appendChild(tag);
    });
  };

  addSkillBtn.addEventListener("click", ()=>{
    let val = skillInput.value.trim();
    if(val && !skills.includes(val)){ skills.push(val); renderSkills(); skillInput.value=""; }
  });
  skillInput.addEventListener("keypress", e=>{ if(e.key==="Enter"){ e.preventDefault(); addSkillBtn.click(); }});





// --- Round Handling ---
let tempRounds = []; // stores roundIds for editing
let roundLimit = 0;

const roundCountInput = document.getElementById("round-count");
const confirmRoundBtn = document.getElementById("confirm-round-count");
const roundInputArea = document.getElementById("round-input-area");
const addRoundInput = document.getElementById("add-round-input");
const addRoundBtn = document.getElementById("add-round-btn");
const roundsContainer = document.getElementById("rounds-container");
const roundLimitMsg = document.getElementById("round-limit-msg");

// Get rounds from localStorage
let rounds = JSON.parse(localStorage.getItem("rounds")) || [];

// Confirm number of rounds
confirmRoundBtn.addEventListener("click", () => {
  const count = parseInt(roundCountInput.value);
  if (isNaN(count) || count <= 0) {
    roundLimitMsg.textContent = "Enter a valid number of rounds";
    return;
  }
  tempRounds = []; // reset
  roundLimit = count;
  roundInputArea.classList.remove("hidden");
  roundLimitMsg.textContent = `Add ${roundLimit} round(s)`;
  roundsContainer.innerHTML = "";
  addRoundInput.value = "";
});

// Add a round
addRoundBtn.addEventListener("click", () => {
  const roundName = addRoundInput.value.trim();
  if (!roundName) return;

  if (tempRounds.length >= roundLimit) {
    roundLimitMsg.textContent = `Maximum of ${roundLimit} rounds reached`;
    return;
  }

  const roundObj = {
    roundId: Date.now().toString(),
    roundName,
    sequence: tempRounds.length + 1
  };

  // Save to localStorage rounds
  rounds.push(roundObj);
  localStorage.setItem("rounds", JSON.stringify(rounds));

  // Only store ID in tempRounds for the job
  tempRounds.push(roundObj.roundId);

  renderRounds();
  addRoundInput.value = "";
  roundLimitMsg.textContent = `${roundLimit - tempRounds.length} round(s) left`;
});

// Render rounds
function renderRounds() {
  roundsContainer.innerHTML = "";
  tempRounds.forEach((roundId, i) => {
    const roundObj = rounds.find(r => r.roundId === roundId);
    if (!roundObj) return;

    const div = document.createElement("div");
    div.className = "px-3 py-1 bg-blue-500 text-white rounded-full flex items-center gap-2";
    div.innerHTML = `<span>${roundObj.roundName}</span><button type="button">&times;</button>`;
    div.querySelector("button").addEventListener("click", () => {
      tempRounds.splice(i, 1);
      renderRounds();
      roundLimitMsg.textContent = `${roundLimit - tempRounds.length} round(s) left`;
    });
    roundsContainer.appendChild(div);
  });
}

// Prefill rounds for editing a job
function prefillRoundsForEdit(job) {
  editingJobId = job.id;
  tempRounds = job.rounds.map(r => r.roundId); // only store IDs
  roundLimit = Math.max(tempRounds.length, 1);
  roundInputArea.classList.remove("hidden");
  renderRounds();
}

// Validate rounds
function validateRoundsStep() {
  if (tempRounds.length === 0) {
    Toastify({
      text: "Add at least one round",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#DC3545"
    }).showToast();
    return false;
  }
  return true;
}

// Form submit
form.addEventListener("submit", e => {
  e.preventDefault();

  if (!validateRoundsStep()) return;

  const now = new Date().toISOString();
  const jobData = {
    title: document.getElementById("job-title").value,
    description: document.getElementById("job-description").value,
    category: document.getElementById("job-category")?.value,
    skills: skills,
    responsibilities: document.getElementById("job-responsibilities").value,
    location: document.getElementById("job-location")?.value,
    jobType: document.getElementById("job-type")?.value,
    rounds: tempRounds, // store only IDs
    positions: parseInt(document.getElementById("job-positions").value),
    experience: parseInt(document.getElementById("job-experience").value),
  };

  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  if (form.dataset.editingId) {
    const index = jobs.findIndex(j => j.id === form.dataset.editingId);
    if (index !== -1) jobs[index] = { ...jobs[index], ...jobData };
    delete form.dataset.editingId;
    Toastify({ text: "Job updated successfully", duration: 3000, gravity: "bottom", position: "right", backgroundColor: "#28A745" }).showToast();
  } else {
    jobs.push({
      id: Date.now().toString(),
      ...jobData,
      createdAt: now,
      closedAt: null,
      applications: [],
    });
    Toastify({ text: "Job added successfully", duration: 3000, gravity: "bottom", position: "right", backgroundColor: "#28A745" }).showToast();
  }

  localStorage.setItem("jobs", JSON.stringify(jobs));
  renderJobs();
  modal.classList.add("hidden");
  resetForm();
});

// Reset form
const resetForm = () => {
  form.reset();
  skills = [];
  renderSkills();
  tempRounds = [];
  roundsContainer.innerHTML = "";
  roundInputArea.classList.add("hidden");
  currentStep = 0;
  showStep(currentStep);
};



// ==========================
// Initial Render
// ==========================
renderJobs();
