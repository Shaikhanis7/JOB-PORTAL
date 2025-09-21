// ================= DYNAMIC DASHBOARD =================

// Seed sample data if localStorage is empty
function seedSampleData() {
  if (!localStorage.getItem("jobs")) {
    const sampleJobs = [
      { id: "101", title: "Frontend Developer", jobType: "Full-time" },
      { id: "102", title: "Backend Developer", jobType: "Part-time" },
      { id: "103", title: "UI/UX Designer", jobType: "Contract" },
      { id: "104", title: "Project Manager", jobType: "Full-time" }
    ];
    localStorage.setItem("jobs", JSON.stringify(sampleJobs));
  }

  if (!localStorage.getItem("applications")) {
    const sampleApplications = [
      { id: "1", jobId: "101", name: "Alice", status: "Applied", appliedAt: new Date() },
      { id: "2", jobId: "102", name: "Bob", status: "Hired", appliedAt: new Date(Date.now() - 3600*1000) },
      { id: "3", jobId: "103", name: "Charlie", status: "Rejected", appliedAt: new Date(Date.now() - 2*3600*1000) },
      { id: "4", jobId: "104", name: "Diana", status: "In Progress", appliedAt: new Date(Date.now() - 24*3600*1000) }
    ];
    localStorage.setItem("applications", JSON.stringify(sampleApplications));
  }
}

// ================= TOP STATS =================
// ================= TOP STATS =================
function createStatCard(title, value, iconClass, colorClass, gradientClass) {
  return `
    <div class="relative glow-border bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg 
                hover:shadow-2xl transition transform hover:-translate-y-2 duration-500 group overflow-hidden flex">
      
      <!-- Left gradient border -->
      <div class="w-1 rounded-l-2xl ${gradientClass} mr-4"></div>
      
      <div class="flex-1 flex items-center gap-4">
        <div class="p-4 rounded-xl ${colorClass} shadow-md group-hover:scale-110 transform transition">
          <i class="${iconClass} text-2xl"></i>
        </div>
        <div>
          <h3 class="text-gray-500 dark:text-gray-400 text-sm">${title}</h3>
          <p class="text-3xl font-bold text-gray-900 dark:text-white counter" data-target="${value}">0</p>
        </div>
      </div>
    </div>
  `;
}

function renderTopStats() {
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
  const applications = JSON.parse(localStorage.getItem("applications") || "[]");
  const hired = applications.filter(a => a.status === "Hired").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;

  const statsContainer = document.getElementById("top-stats");
  statsContainer.innerHTML = `
    ${createStatCard(
      "Total Jobs",
      jobs.length,
      "fa-solid fa-briefcase",
      "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
      "bg-gradient-to-b from-blue-400 to-blue-600"
    )}
    ${createStatCard(
      "Applicants",
      applications.length,
      "fa-solid fa-users",
      "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
      "bg-gradient-to-b from-green-400 to-green-600"
    )}
    ${createStatCard(
      "Hired",
      hired,
      "fa-solid fa-user-check",
      "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
      "bg-gradient-to-b from-purple-400 to-purple-600"
    )}
    ${createStatCard(
      "Rejected",
      rejected,
      "fa-solid fa-user-xmark",
      "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
      "bg-gradient-to-b from-red-400 to-red-600"
    )}
  `;
}


// ================= CHARTS =================
function renderCharts() {
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
  const applications = JSON.parse(localStorage.getItem("applications") || "[]");

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });

  const dailyApplications = last7Days.map(day =>
    applications.filter(a => new Date(a.appliedAt).toLocaleDateString("en-US", { weekday: "short" }) === day).length
  );

  const chartsContainer = document.getElementById("charts-container");
  chartsContainer.innerHTML = `
    <div class="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Applications Over Time</h3>
      <canvas id="lineChart" class="w-full h-64"></canvas>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
      <div class="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Job Types</h3>
        <canvas id="pieChart" class="w-full h-56"></canvas>
      </div>
      <div class="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Hiring Funnel</h3>
        <canvas id="barChart" class="w-full h-56"></canvas>
      </div>
    </div>
  `;

  // Line Chart
  new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: last7Days,
      datasets: [{
        label: "Applications",
        data: dailyApplications,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#2563eb",
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // Pie Chart
  const jobTypes = [...new Set(jobs.map(j => j.jobType))];
  const typeCounts = jobTypes.map(type => jobs.filter(j => j.jobType === type).length);
  new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: { labels: jobTypes, datasets:[{ data: typeCounts, backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6"], borderColor:"#fff", borderWidth:2 }] },
    options: { cutout: "65%" }
  });

  // Bar Chart
  const stages = ["Applied","Shortlisted","In Progress","Hired","Rejected"];
  const stageCounts = stages.map(stage => applications.filter(a => a.status === stage).length);
  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: { labels: stages, datasets:[{ data: stageCounts, backgroundColor:["#3b82f6","#06b6d4","#f59e0b","#10b981","#ef4444"], borderRadius:6 }] },
    options: { responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} }
  });
}

// ================= COUNTER =================
function initCounter() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let current = 0;
    const increment = Math.ceil(target / 100);
    const update = () => {
      current += increment;
      if(current < target){
        counter.innerText = current;
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }
    };
    update();
  });
}

// ================= RECENT ACTIVITIES =================
function renderRecentActivities() {
  const applications = JSON.parse(localStorage.getItem("applications") || "[]");
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");

  const container = document.getElementById("recent-activities");
  if (applications.length === 0) {
    container.innerHTML = `<p class="text-gray-400 dark:text-gray-500">No recent activities.</p>`;
    return;
  }

  const recent = applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  container.innerHTML = recent.map(app => {
    const job = jobs.find(j => j.id === app.jobId);
    const jobTitle = job ? job.title : "Job";
    const timeAgo = timeSince(new Date(app.appliedAt));

    return `
      <div class="flex items-start gap-3 group relative pl-4">
        <span class="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-l-xl"></span>
        <div class="bg-white dark:bg-neutral-700 rounded-xl p-3 shadow-sm w-full hover:shadow-md transition">
          <p><strong>${app.name || "Anonymous"}</strong> applied for 
             <span class="font-medium">${jobTitle}</span></p>
          <span class="text-xs text-gray-400 dark:text-gray-300">${timeAgo}</span>
        </div>
      </div>
    `;
  }).join("");
}

// Helper: human-readable time ago
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if(interval >= 1) return interval + " year" + (interval>1 ? "s":"") + " ago";
  interval = Math.floor(seconds / 2592000);
  if(interval >= 1) return interval + " month" + (interval>1 ? "s":"") + " ago";
  interval = Math.floor(seconds / 86400);
  if(interval >= 1) return interval + " day" + (interval>1 ? "s":"") + " ago";
  interval = Math.floor(seconds / 3600);
  if(interval >= 1) return interval + " hour" + (interval>1 ? "s":"") + " ago";
  interval = Math.floor(seconds / 60);
  if(interval >= 1) return interval + " minute" + (interval>1 ? "s":"") + " ago";
  return "Just now";
}

// ================= DARK MODE TOGGLE =================
function initDarkMode() {
  const toggleBtn = document.getElementById("dark-toggle");
  const html = document.documentElement;

  // Load preference from localStorage
  if(localStorage.getItem("theme") === "dark") {
    html.classList.add("dark");
  }

  toggleBtn.addEventListener("click", () => {
    html.classList.toggle("dark");
    const isDark = html.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  seedSampleData();        // auto-fill sample data if empty
  renderTopStats();
  renderCharts();
  renderRecentActivities();
  initCounter();
  initDarkMode();          // enable dark mode toggle
});
