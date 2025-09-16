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

document.getElementById('dark-toggle').addEventListener('click', () => {
  document.documentElement.classList.toggle('dark'); // Toggle Tailwind's dark mode
});

let currentUser = {
  id: "1757803562208", // add the id to match with users
  fullName: "User Name",
  email: "user@email.com",
  mobile: "+1 (555) 000-1111",
  dob: "1995-05-10",
  location: "New York",
  designation: "Software Engineer",
  department: "Engineering",
  experience: "2-3 years",
  profilePic: null
};

// Load users array from localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];

// ---------- Load User Data ----------
function loadUser() {
  // Load currentUser from localStorage
  const saved = localStorage.getItem("currentUser");
  if (saved) currentUser = JSON.parse(saved);

  // Avatar
  const avatar = document.getElementById("avatar");
  if (currentUser.profilePic) {
    avatar.innerHTML = `<img src="${currentUser.profilePic}" class="w-full h-full object-cover rounded-full">`;
    document.getElementById("uploadPic").value = ""; // reset file input
    document.querySelector("label[for='uploadPic']").classList.add("hidden"); // hide upload
    document.getElementById("removePic").classList.remove("hidden"); // show remove
  } else {
    const initials = currentUser.fullName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
    avatar.innerHTML = initials || "U";

    document.querySelector("label[for='uploadPic']").classList.remove("hidden"); // show upload
    document.getElementById("removePic").classList.add("hidden"); // hide remove
  }

  // Fill form fields
  document.getElementById("fullName").value = currentUser.fullName;
  document.getElementById("email").value = currentUser.email;
  document.getElementById("mobile").value = currentUser.mobile || "";
  document.getElementById("dob").value = currentUser.dob || "";
  document.getElementById("location").value = currentUser.location || "";
  document.getElementById("designation").value = currentUser.designation || "";
  document.getElementById("department").value = currentUser.department || "";
  document.getElementById("experience").value = currentUser.experience || "";
}

// ---------- Save User Data ----------
function saveUser() {
  // Save currentUser separately
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Update users array
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex(u => u.id === currentUser.id);

  if (index !== -1) {
    // Merge with existing user (keep password intact)
    users[index] = {
      ...users[index],
      ...currentUser
    };
  } else {
    // If user not present, push new
    users.push(currentUser);
  }

  localStorage.setItem("users", JSON.stringify(users));
}

// ---------- Manual Save Button ----------
document.getElementById("saveBtn").addEventListener("click", function () {
  currentUser.fullName = document.getElementById("fullName").value;
  currentUser.email = document.getElementById("email").value;
  currentUser.mobile = document.getElementById("mobile").value;
  currentUser.dob = document.getElementById("dob").value;
  currentUser.location = document.getElementById("location").value;
  currentUser.designation = document.getElementById("designation").value;
  currentUser.department = document.getElementById("department").value;
  currentUser.experience = document.getElementById("experience").value;

  saveUser();
  loadUser();
  alert("✅ Profile details saved!");
});

// ---------- Upload Profile Picture ----------
document.getElementById("uploadPic").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    currentUser.profilePic = reader.result;
    saveUser();
    loadUser();
  };
  reader.readAsDataURL(file);
});

// ---------- Remove Profile Picture ----------
document.getElementById("removePic").addEventListener("click", function () {
  currentUser.profilePic = null;
  saveUser();
  loadUser();
});

// ---------- Dark Mode Toggle ----------
document.getElementById('dark-toggle').addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

// Init
loadUser();


// ==========================
// Tab Navigation
// ==========================
const tabButtons = document.querySelectorAll("[data-tab]");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Hide all tabs
    tabContents.forEach(tab => tab.classList.add("hidden"));

    // Remove active bg
    tabButtons.forEach(b => b.classList.remove("bg-primary", "text-white"));

    // Show selected tab
    const target = btn.getAttribute("data-tab");
    document.getElementById(target).classList.remove("hidden");

    // Highlight button
    btn.classList.add("bg-primary", "text-white");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll("aside nav button[data-tab]");
  const tabContents = document.querySelectorAll(".tab-content");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Reset active styles
      navButtons.forEach(b => b.classList.remove("bg-primary", "text-white"));
      navButtons.forEach(b => b.classList.add("hover:bg-gray-200", "dark:hover:bg-neutral-light"));

      // Apply active style
      btn.classList.add("bg-primary", "text-white");
      btn.classList.remove("hover:bg-gray-200", "dark:hover:bg-neutral-light");

      // Hide all tabs
      tabContents.forEach(tab => tab.classList.add("hidden"));

      // Show the selected tab
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.remove("hidden");
    });
  });

  // Open first tab by default
  if (navButtons.length > 0) navButtons[0].click();
});



// ==========================
// Profile Summary Save
// ==========================
const summaryInput = document.getElementById("summaryInput");
const saveSummaryBtn = document.getElementById("saveSummary");
const summaryCount = document.getElementById("summaryCount");

// Load saved summary for current user
if (currentUser.profileSummary) {
  summaryInput.value = currentUser.profileSummary;
  summaryCount.textContent = `${summaryInput.value.length}/500 characters`;
}

// Live character count
summaryInput.addEventListener("input", () => {
  summaryCount.textContent = `${summaryInput.value.length}/500 characters`;
});

// Save summary
saveSummaryBtn.addEventListener("click", () => {
  const value = summaryInput.value.trim();

  if (!value) {
    alert("⚠️ Please enter your profile summary before saving");
    return;
  }

  // Save in currentUser object
  currentUser.profileSummary = value;

  // Persist to localStorage
  saveUser();

  alert("✅ Profile Summary saved!");
});



const educationContainer = document.getElementById("educationContainer");
const addEducationBtn = document.getElementById("addEducationBtn");
const saveEducationBtn = document.getElementById("saveEducationBtn");

// Ensure education exists
if (!currentUser.education) {
  currentUser.education = [];
} else {
  renderEducationForms(currentUser.education);
}

// Render all forms
function renderEducationForms(educationList) {
  educationContainer.innerHTML = "";
  educationList.forEach((edu, index) => {
    educationContainer.appendChild(createEducationForm(edu, index));
  });
}

// Create form block
function createEducationForm(data = {}, index) {
  const wrapper = document.createElement("div");
  wrapper.className =
    "border rounded-md p-4 mb-4 bg-gray-50 dark:bg-neutral-light relative";

  wrapper.innerHTML = `
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-semibold flex items-center gap-2">
        <i class="fas fa-book-open"></i> Education ${index + 1}
      </h3>
      <button type="button" class="text-red-500 hover:text-red-700 edu-delete">
        <i class="fas fa-trash"></i>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <select class="border rounded-md p-2 w-full edu-level">
        <option value="">Select education level</option>
        <option value="10th" ${data.level === "10th" ? "selected" : ""}>10th</option>
        <option value="12th" ${data.level === "12th" ? "selected" : ""}>12th</option>
        <option value="Graduation" ${data.level === "Graduation" ? "selected" : ""}>Graduation</option>
        <option value="Post-Graduation" ${data.level === "Post-Graduation" ? "selected" : ""}>Post-Graduation</option>
      </select>

      <input type="text" class="border rounded-md p-2 w-full edu-degree"
        placeholder="e.g. B.Tech, MBA" value="${data.degree || ""}" />

      <input type="text" class="border rounded-md p-2 w-full edu-specialization"
        placeholder="e.g. Computer Science" value="${data.specialization || ""}" />

      <input type="text" class="border rounded-md p-2 w-full edu-institution"
        placeholder="Enter institution name" value="${data.institution || ""}" />

      <input type="text" class="border rounded-md p-2 w-full edu-university"
        placeholder="Enter university/board name" value="${data.universityBoard || ""}" />

      <input type="number" class="border rounded-md p-2 w-full edu-year"
        placeholder="Year" value="${data.passingYear || ""}" />

      <select class="border rounded-md p-2 w-full edu-gradeType">
        <option value="Percentage" ${data.gradeType === "Percentage" ? "selected" : ""}>Percentage</option>
        <option value="CGPA" ${data.gradeType === "CGPA" ? "selected" : ""}>CGPA</option>
      </select>

      <input type="text" class="border rounded-md p-2 w-full edu-percentage"
        placeholder="e.g. 85.5" value="${data.percentage || ""}" />
    </div>
  `;

  // Delete button functionality
  wrapper.querySelector(".edu-delete").addEventListener("click", () => {
    wrapper.remove();
  });

  return wrapper;
}

// Add new form
addEducationBtn.addEventListener("click", () => {
  educationContainer.appendChild(
    createEducationForm({}, educationContainer.children.length)
  );
});

// Save data
saveEducationBtn.addEventListener("click", () => {
  const allForms = educationContainer.querySelectorAll("div.border");
  const newEducationList = [];

  allForms.forEach(form => {
    const edu = {
      level: form.querySelector(".edu-level").value,
      degree: form.querySelector(".edu-degree").value.trim(),
      specialization: form.querySelector(".edu-specialization").value.trim(),
      institution: form.querySelector(".edu-institution").value.trim(),
      universityBoard: form.querySelector(".edu-university").value.trim(),
      passingYear: form.querySelector(".edu-year").value.trim(),
      gradeType: form.querySelector(".edu-gradeType").value,
      percentage: form.querySelector(".edu-percentage").value.trim(),
    };

    // Only save if essential fields are filled
    if (edu.level && edu.degree && edu.institution && edu.passingYear) {
      newEducationList.push(edu);
    }
  });

  currentUser.education = newEducationList;
  saveUser();

  alert("✅ Education details saved!");
});


// ==========================
// Work Experience
// ==========================

// Ensure experience exists
if (!Array.isArray(currentUser.experiences)) {
  currentUser.experiences = [];
}

// Render experience cards
function renderExperience() {
  const container = document.getElementById("experienceContainer");
  container.innerHTML = "";

  currentUser.experiences.forEach((exp, index) => {
    const div = document.createElement("div");
    div.className = "border rounded-md p-4 shadow-sm relative bg-gray-50 dark:bg-neutral-light";

    div.innerHTML = `
      <!-- Delete -->
      <button class="absolute top-2 right-2 text-danger hover:text-red-700" onclick="deleteExperience(${index})">
        <i class="fas fa-trash"></i>
      </button>

      <h3 class="font-medium mb-4">Experience ${index + 1}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div>
          <label class="block text-sm font-medium">Job Title *</label>
          <input type="text" class="exp-input w-full border rounded-md p-2" data-field="jobTitle" value="${exp.jobTitle || ""}" placeholder="e.g. Software Engineer">
        </div>

        <div>
          <label class="block text-sm font-medium">Company Name *</label>
          <input type="text" class="exp-input w-full border rounded-md p-2" data-field="companyName" value="${exp.companyName || ""}" placeholder="Enter company name">
        </div>

        <div>
          <label class="block text-sm font-medium">Industry</label>
          <input type="text" class="exp-input w-full border rounded-md p-2" data-field="industry" value="${exp.industry || ""}" placeholder="e.g. IT, Finance">
        </div>

        <div>
          <label class="block text-sm font-medium">Job Type</label>
          <input type="text" class="exp-input w-full border rounded-md p-2" data-field="jobType" value="${exp.jobType || ""}" placeholder="e.g. Full-time">
        </div>

        <div>
          <label class="block text-sm font-medium">Location</label>
          <input type="text" class="exp-input w-full border rounded-md p-2" data-field="location" value="${exp.location || ""}" placeholder="City, State">
        </div>

        <div>
          <label class="block text-sm font-medium">Salary (LPA)</label>
          <input type="number" class="exp-input w-full border rounded-md p-2" data-field="salary" value="${exp.salary || ""}" placeholder="e.g. 6.5">
        </div>

        <div>
          <label class="block text-sm font-medium">Start Date *</label>
          <input type="date" class="exp-input w-full border rounded-md p-2" data-field="startDate" value="${exp.startDate || ""}">
        </div>

        <div>
          <label class="block text-sm font-medium">End Date</label>
          <input type="date" class="exp-input w-full border rounded-md p-2" data-field="endDate" value="${exp.endDate || ""}">
        </div>

        <div class="col-span-2">
          <label class="block text-sm font-medium">
            <input type="checkbox" class="exp-input mr-2" data-field="currentRole" ${exp.currentRole ? "checked" : ""}>
            I am currently working in this role
          </label>
        </div>

        <div class="col-span-2">
          <label class="block text-sm font-medium">Job Description</label>
          <textarea class="exp-input w-full border rounded-md p-2" data-field="description" placeholder="Describe your role">${exp.description || ""}</textarea>
        </div>

        <!-- Skills with tags -->
        <div class="col-span-2">
          <label class="block text-sm font-medium">Key Skills Used</label>
          <div class="flex gap-2">
            <input type="text" class="exp-skill-input flex-1 border rounded-md p-2" placeholder="e.g. React, Node.js">
            <button type="button" class="add-skill px-3 py-2 bg-primary text-white rounded-md hover:bg-blue-700">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="skill-tags flex flex-wrap gap-2 mt-2"></div>
        </div>

        <div class="col-span-2">
          <label class="block text-sm font-medium">Key Achievements</label>
          <textarea class="exp-input w-full border rounded-md p-2" data-field="achievements" placeholder="List your achievements">${exp.achievements || ""}</textarea>
        </div>
      </div>
    `;

    container.appendChild(div);

    // ----------- Skills logic -----------
    if (!Array.isArray(exp.skills)) exp.skills = [];
    const skillInput = div.querySelector(".exp-skill-input");
    const addSkillBtn = div.querySelector(".add-skill");
    const skillContainer = div.querySelector(".skill-tags");

    function renderSkills() {
      skillContainer.innerHTML = "";
      exp.skills.forEach((skill, sIndex) => {
        const tag = document.createElement("span");
        tag.className = "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2";
        tag.innerHTML = `
          ${skill}
          <button type="button" class="remove-skill text-blue-500 hover:text-red-500" data-index="${sIndex}">
            <i class="fas fa-times"></i>
          </button>
        `;
        skillContainer.appendChild(tag);
      });

      // Delete skill
      skillContainer.querySelectorAll(".remove-skill").forEach(btn => {
        btn.addEventListener("click", () => {
          const sIndex = btn.getAttribute("data-index");
          exp.skills.splice(sIndex, 1);
          renderSkills();
        });
      });
    }
    renderSkills();

    // Add skill (+ button)
    addSkillBtn.addEventListener("click", () => {
      const value = skillInput.value.trim();
      if (value && !exp.skills.includes(value)) {
        exp.skills.push(value);
        skillInput.value = "";
        renderSkills();
      }
    });

    // Add skill (Enter key)
    skillInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkillBtn.click();
      }
    });
  });
}

// Delete an experience
function deleteExperience(index) {
  currentUser.experiences.splice(index, 1);
  renderExperience();
}

// Add new experience
document.getElementById("addExperience").addEventListener("click", () => {
  currentUser.experiences.push({});
  renderExperience();
});

// Save all experience
// Save all experience
document.getElementById("saveExperience").addEventListener("click", () => {
  const expDivs = document.querySelectorAll("#experienceContainer > div");

  currentUser.experiences = Array.from(expDivs).map((div, index) => {
    const inputs = div.querySelectorAll(".exp-input");
    let obj = { ...currentUser.experiences[index] };

    inputs.forEach(inp => {
      if (inp.type === "checkbox") {
        obj[inp.dataset.field] = inp.checked;
      } else {
        obj[inp.dataset.field] = inp.value.trim();
      }
    });

    return obj;
  });

  saveUser();
  renderExperience();
  alert("✅ Experience details saved!");
});


// Initial render
renderExperience();

const resumeInput = document.getElementById("resumeUpload");
const resumeStatus = document.getElementById("resumeStatus");
const downloadResume = document.getElementById("downloadResume");
const previewResume = document.getElementById("previewResume");
const removeResume = document.getElementById("removeResume");

// Load from localStorage
if (currentUser.resume) {
  resumeStatus.textContent = `✅ Resume saved: ${currentUser.resumeName || "resume.pdf"}`;
  showResumeActions();
}

// Handle file selection
resumeInput.addEventListener("change", () => {
  const file = resumeInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      currentUser.resume = e.target.result; // Base64
      currentUser.resumeName = file.name;
      resumeStatus.textContent = `✅ Resume ready to save: ${file.name}`;
    };
    reader.readAsDataURL(file);
  }
});

// Save resume
document.getElementById("resumeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (currentUser.resume) {
    saveUser();
    alert("✅ Resume uploaded and saved successfully!");
    resumeStatus.textContent = `✅ Resume saved: ${currentUser.resumeName}`;
    showResumeActions();
  } else {
    alert("⚠️ Please select a resume file before saving.");
  }
});

previewResume.addEventListener("click", () => {
  if (currentUser.resume) {
    const win = window.open("", "_blank", "width=800,height=600");
    if (win) {
      win.document.body.style.margin = "0"; // cleaner fullscreen view
      win.document.body.style.height = "100vh";
      win.document.body.innerHTML = `
        <iframe src="${currentUser.resume}" 
                style="width:100%; height:100%; border:none;"></iframe>
      `;
    }
  }
});

// Remove resume
removeResume.addEventListener("click", () => {
  if (confirm("❌ Remove your saved resume?")) {
    delete currentUser.resume;
    delete currentUser.resumeName;
    saveUser();
    resumeInput.value = "";
    resumeStatus.textContent = "No resume uploaded yet.";
    hideResumeActions();
  }
});

// Helpers
function showResumeActions() {
  downloadResume.classList.remove("hidden");
  previewResume.classList.remove("hidden");
  removeResume.classList.remove("hidden");

  downloadResume.href = currentUser.resume;
  downloadResume.download = currentUser.resumeName || "resume.pdf";
}

function hideResumeActions() {
  downloadResume.classList.add("hidden");
  previewResume.classList.add("hidden");
  removeResume.classList.add("hidden");
}
