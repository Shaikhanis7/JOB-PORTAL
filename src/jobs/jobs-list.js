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
    description:
      "Build and maintain scalable web apps using React and Node.js.",
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
    closedAt: null,
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
    closedAt: null,
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
    createdAt: new Date(Date.now() - 2 * 86400000), // 2 days ago
    openedAt: new Date(Date.now() - 2 * 86400000),
    closedAt: null,
  },
];

// Render jobs
const jobList = document.getElementById("job-list");

function renderJobs(list) {
  jobList.innerHTML = "";
  list.forEach((job) => {
    if (job.closedAt) return; // Only open jobs

    const newBadge = isNew(job.createdAt)
      ? `<span class="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">New</span>`
      : "";

    // Skill tags
    const skillTags = (Array.isArray(job.skills) ? job.skills : [])
      .map(
        (skill) =>
         `<span class="inline-flex items-center text-xs font-medium px-2 py-1 mr-2 mb-2 rounded-full border border-slate-100 bg-white/60 shadow-sm">${skill}</span>`
      )
      .join(" ");

    const card = document.createElement("div");
    card.className =
  "bg-white dark:bg-neutral-mid rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden transform hover:-translate-y-1 my-4 ";
card.innerHTML = `
<div class="flex flex-col py-4 transition-colors duration-300 hover:cursor-pointer group">
  
  <!-- Header: Title + New Badge + Actions -->
  <div class="flex items-center justify-between px-5 mb-4">
    <div class="flex items-center gap-3">
      <h2 class="text-xl font-semibold text-primary dark:text-white flex items-center gap-2">
        ${job.title}
        ${newBadge}
      </h2>
    </div>
    <div class="flex items-center gap-4">
      <button class="save-job text-gray-400 hover:text-primary transition" data-id="${job.id}">
        <i class="fa-regular fa-bookmark text-xl"></i>
      </button>
      <i class="fa-solid fa-chevron-down chevron text-gray-500 transition-transform duration-300 cursor-pointer"></i>
    </div>
  </div>

  <!-- Meta Info -->
  <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-300 px-5 mb-3">
    <span class="flex items-center gap-1"><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
    <span class="flex items-center gap-1"><i class="fa-regular fa-clock"></i> ${job.jobType}</span>
    <span class="flex items-center gap-1"><i class="fa-regular fa-calendar"></i> ${timeAgo(job.createdAt)}</span>
    <span class="flex items-center gap-1"><i class="fa-solid fa-users"></i> ${job.positions} pos</span>
  </div>

  <!-- Skills -->
  <div class="flex flex-wrap gap-2 mt-2 px-5">
    ${skillTags}
  </div>

  <!-- Applied Info -->
  <div class="flex items-center justify-start text-sm text-gray-500 dark:text-gray-300 mt-3 px-5">
    <span class="flex items-center gap-1"><i class="fa-solid fa-user-check"></i> ${job.applied || 0} Applied</span>
  </div>


 <!-- Expandable Details -->
<div class="job-details max-h-0 overflow-hidden transition-all duration-500 mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200 px-5">
  
  <div>
    <h4 class="font-semibold flex items-center gap-2 text-primary dark:text-secondary">
      <i class="fa-solid fa-file-lines"></i> Description
    </h4>
    <p class="mt-1">${job.description || "Not provided"}</p>
  </div>

  <div>
    <h4 class="font-semibold flex items-center gap-2 text-primary dark:text-secondary">
      <i class="fa-solid fa-clipboard-list"></i> Responsibilities
    </h4>
    <p class="mt-1">${job.responsibilities || "Not provided"}</p>
  </div>

  <div class="flex justify-between mt-4 w-full gap-3">
    <!-- Apply button on the left -->
    <button class="apply-btn bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-lg shadow-lg hover:from-secondary hover:to-primary transition-all duration-300 flex items-center gap-2 " data-job-id="${job.id}">
      <i class="fa-solid fa-paper-plane"></i> Apply Now
    </button>

    <!-- Share button on the right with blue gradient -->
    <button class="share-btn bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 transition-all duration-300">
      <i class="fa-solid fa-share-nodes"></i> Share
    </button>
  </div>

</div>
</div>
`;


    jobList.appendChild(card);

    // Apply button inside the card
    const applyBtn = card.querySelector(".apply-btn");
    applyBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card expand/collapse
      currentJobId = applyBtn.dataset.jobId;
      applyModal.classList.remove("hidden");

      // Prefill form fields
      document.getElementById("app-name").value = currentUser.fullName || "";
      document.getElementById("app-email").value = currentUser.email || "";
      document.getElementById("app-phone").value = currentUser.phone || "";
      document.getElementById("app-experience").value =
        currentUser.experience || "";
      document.getElementById("app-education").value =
        currentUser.education || "";

      // Resume preview
      const preview = document.getElementById("resume-preview");
      if (currentUser.resume) {
        preview.innerHTML = `Resume already uploaded: <a href="${currentUser.resume}" target="_blank">Preview</a>`;
      } else {
        preview.innerHTML = "";
      }

      // Reset step to step 1
      document
        .querySelectorAll(".step")
        .forEach((s, i) => s.classList.toggle("hidden", i !== 0));
    });

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
  localStorage.setItem(
    "theme",
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
}
const darkToggle = document.getElementById("dark-toggle");
if (localStorage.getItem("theme") === "dark")
  document.documentElement.classList.add("dark");
darkToggle.addEventListener("click", toggleDarkMode);

// Render Categories

function renderCategories(jobs) {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = ""; // Clear old radios

  // Extract unique categories
  const categories = [...new Set(jobs.map((job) => job.category))];

  categories.forEach((cat) => {
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
  let allLocations = [...new Set(jobs.map((job) => job.location))];

  function updateList(filterText = "") {
    locationContainer.innerHTML = "";
    allLocations
      .filter((loc) => loc.toLowerCase().includes(filterText.toLowerCase()))
      .forEach((loc) => {
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
renderCategories(jobs);
renderLocations(jobs);

// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuContent = document.getElementById("mobile-menu-content");
const closeMenu = document.getElementById("close-menu");

// Open menu

// === Filter State ===
let selectedCategory = null;
let selectedLocations = [];
let searchQuery = "";

// Apply filters to jobs
function applyFilters() {
  let filteredJobs = jobs.filter((job) => {
    // Category filter
    if (selectedCategory && job.category !== selectedCategory) return false;

    // Location filter
    if (
      selectedLocations.length > 0 &&
      !selectedLocations.includes(job.location)
    )
      return false;

    // Search filter (title + description + skills)
    if (searchQuery) {
      const text = (
        job.title +
        " " +
        job.description +
        " " +
        job.skills.join(" ")
      ).toLowerCase();
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

  const categories = [...new Set(jobs.map((job) => job.category))];

  // Add "All" option
  const allLabel = document.createElement("label");
  allLabel.className = "flex items-center space-x-2";
  allLabel.innerHTML = `
    <input type="radio" name="category" value="" class="filter-radio">
    <span>All</span>
  `;
  categoryContainer.appendChild(allLabel);

  categories.forEach((cat) => {
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

  let allLocations = [...new Set(jobs.map((job) => job.location))];

  function updateList(filterText = "") {
    locationContainer.innerHTML = "";
    allLocations
      .filter((loc) => loc.toLowerCase().includes(filterText.toLowerCase()))
      .forEach((loc) => {
        const label = document.createElement("label");
        label.className = "flex items-center space-x-2";

        label.innerHTML = `
          <input type="checkbox" value="${loc}" class="filter-location">
          <span>${loc}</span>
        `;
        locationContainer.appendChild(label);
      });

    // Add event listener for checkboxes
    locationContainer.querySelectorAll(".filter-location").forEach((cb) => {
      cb.addEventListener("change", () => {
        selectedLocations = Array.from(
          locationContainer.querySelectorAll(".filter-location:checked")
        ).map((cb) => cb.value);
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

applyModal = document.getElementById("apply-modal");
const applyModalContent = document.getElementById("apply-modal-content");
const closeApplyModal = document.getElementById("close-apply-modal");
const applicationForm = document.getElementById("application-form");
const nextBtn = document.querySelector(".next-step");
const prevBtn = document.querySelector(".prev-step");
const finishBtn = document.querySelector(".finish-step");
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
let currentJobId = null; 

// Close Modal
closeApplyModal.addEventListener("click", () => applyModal.classList.add("hidden"));
applyModal.addEventListener("click", (e) => {
  if (!applyModalContent.contains(e.target)) applyModal.classList.add("hidden");
});

// Stepper
const steps = document.querySelectorAll(".step");
const circles = document.querySelectorAll(".step-circle");
const lines = document.querySelectorAll(".step-line");
let currentStep = 0;

function updateStepUI() {
  steps.forEach((step, i) => step.classList.toggle("hidden", i !== currentStep));

  circles.forEach((circle, i) => {
    if (i <= currentStep) {
      circle.classList.add("bg-gradient-to-r","from-primary","to-secondary","text-white");
      circle.classList.remove("border-2","border-gray-300","bg-white","text-gray-600");
    } else {
      circle.classList.remove("bg-gradient-to-r","from-primary","to-secondary","text-white");
      circle.classList.add("border-2","border-gray-300","bg-white","text-gray-600");
    }
  });
  lines.forEach((line, i) => {
    if (i +1 <= currentStep ) {
      line.classList.add("bg-gradient-to-r","from-primary","to-secondary","text-white");
      // line.classList.remove("border-2","border-gray-300","bg-white","text-gray-600");
    } else {
      line.classList.remove("bg-gradient-to-r","from-primary","to-secondary","text-white");
      // line.classList.add("border-2","border-gray-300","bg-white","text-gray-600");
    }
  });




  // lines.forEach((line, i) => line.style.width = i < currentStep ? "100%" : "0%");
  prevBtn.disabled = currentStep === 0;
  nextBtn.classList.toggle("hidden", currentStep === steps.length - 1);
  finishBtn.classList.toggle("hidden", currentStep !== steps.length - 1);
}

// Step Validation
function validateStep(step) {
  if(step === 0){
    const name = document.getElementById("app-name").value.trim();
    const email = document.getElementById("app-email").value.trim();
    const phone = document.getElementById("app-phone").value.trim();
    const experience = document.getElementById("app-experience").value.trim();
    const education = document.getElementById("app-education").value;
    if(!name || !email || !phone || !experience || !education){alert("Please fill all fields"); return false;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alert("Invalid email"); return false;}
    if(!/^[0-9]{7,15}$/.test(phone)){alert("Invalid phone"); return false;}
  }
  if(step === 1){
    const checked = document.querySelectorAll("#skills-container input:checked");
    if(checked.length===0){alert("Select at least one skill"); return false;}
  }
  if(step === 2){
    const fileInput = document.getElementById("app-resume").files[0];
    if(!fileInput && !currentUser.resume){alert("Upload your resume"); return false;}
  }
  return true;
}

// Next / Prev
nextBtn.addEventListener("click", ()=>{
  if(!validateStep(currentStep)) return;
  if(currentStep<steps.length-1) currentStep++;
  updateStepUI();
});
prevBtn.addEventListener("click", ()=>{
  if(currentStep>0) currentStep--;
  updateStepUI();
});

// Resume Preview + Remove
const resumeInput = document.getElementById("app-resume");
const resumePreview = document.getElementById("resume-preview");

function showResumePreview(e){
  // e.stopPropagation();
  resumePreview.innerHTML = "";
  if(currentUser.resume){
    const container = document.createElement("div");
    container.className = "flex items-center gap-4";

    const link = document.createElement("a");
    link.href = currentUser.resume;
    link.target = "_blank";
    link.textContent = "Preview Resume";
    link.className = "text-blue-600 underline";

    const removeBtn = document.createElement("button");
    removeBtn.type="button";
    removeBtn.textContent="Remove";
    removeBtn.className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600";
    removeBtn.addEventListener("click", (e)=>{
      e.stopPropagation();
      currentUser.resume = null;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      resumeInput.value="";
      showResumePreview();
    });

    container.appendChild(link);
    container.appendChild(removeBtn);
    resumePreview.appendChild(container);
  }
}

resumeInput.addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  if(file.type!=="application/pdf"){ alert("Only PDF allowed"); resumeInput.value=""; return;}
  const reader = new FileReader();
  reader.onload = (ev)=>{
    currentUser.resume = ev.target.result;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    showResumePreview();
  };
  reader.readAsDataURL(file);
});

showResumePreview();

// Finish / Submit
finishBtn.addEventListener("click", (e)=>{
  e.preventDefault();
  if(!validateStep(currentStep)) return;

  const selectedSkills = Array.from(document.querySelectorAll("#skills-container input:checked")).map(i=>i.value);

  const application = {
    id: Date.now().toString(),
    userId: currentUser.id||"user-unknown",
    jobId: currentJobId,
    name: document.getElementById("app-name").value,
    email: document.getElementById("app-email").value,
    phone: document.getElementById("app-phone").value,
    experience: document.getElementById("app-experience").value,
    education: document.getElementById("app-education").value,
    skills:selectedSkills,
    resume:currentUser.resume,
    status:"Applied",
    appliedAt:new Date().toISOString(),
    roundIds:[]
  };

  const jobs = JSON.parse(localStorage.getItem("jobs")||"[]");
  const job = jobs.find(j=>j.id===currentJobId);
  const roundsTable = JSON.parse(localStorage.getItem("rounds")||"[]");
  let applicationRounds = JSON.parse(localStorage.getItem("applicationRounds")||"[]");

  if(job && Array.isArray(job.rounds)){
    job.rounds.forEach(rid=>{
      const roundData = roundsTable.find(r=>r.roundId===rid);
      if(!roundData) return;
      const roundRecordId = `${application.id}-${rid}`;
      applicationRounds.push({
        id:roundRecordId,
        applicationId:application.id,
        roundId:rid,
        name:application.name,
        jobTitle:job.title,
        email:application.email,
        roundName:roundData.roundName,
        roundNumber:roundData.sequence,
        marks:null,
        status:"Pending",
        thresholdMark:null,
        updatedAt:new Date().toISOString(),
        location:job.location
      });
      application.roundIds.push(roundRecordId);
    });
    localStorage.setItem("applicationRounds", JSON.stringify(applicationRounds));
  }

  const existingApplications = JSON.parse(localStorage.getItem("applications")||"[]");
  existingApplications.push(application);
  localStorage.setItem("applications", JSON.stringify(existingApplications));

  alert("Application submitted successfully!");
  applyModal.classList.add("hidden");
  applicationForm.reset();
  currentStep=0;
  updateStepUI();
  showResumePreview();
});

// Initialize
updateStepUI();