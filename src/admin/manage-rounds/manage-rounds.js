// ========================== Sidebar Toggle ==========================
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuIcon = document.getElementById('menu-icon');

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

  // ========================== Dark Mode ==========================
  document.getElementById('dark-toggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });

  // ========================== Data ==========================
  let applicationRounds = JSON.parse(localStorage.getItem("applicationRounds")) || [
    {
      id: "1",
      email: "leo@dass.com",
      name: "Leo Dass",
      jobTitle: "Full Stack Developer",
      location: "Chennai",
      roundName: "Technical",
      roundOrder: 1,
      marks: 34,
      thresholdMark: 32,
      status: "Pending"
    }
  ];
  function saveData() {
    localStorage.setItem("applicationRounds", JSON.stringify(applicationRounds));
  }
  function showToast(msg, type="success") {
    Toastify({
      text: msg,
      duration: 2000,
      gravity: "top",
      position: "center",
      style: {
        background: type === "error" ? "#DC3545" : "#28A745"
      }
    }).showToast();
  }

  // ========================== Filters ==========================
  const jobFilter = document.getElementById("jobFilter");
  const locationFilter = document.getElementById("locationFilter");
  const roundFilter = document.getElementById("roundFilter");
  const statusFilter = document.getElementById("statusFilter");

  function renderFilters() {
    let jobs = [...new Set(applicationRounds.map(r => r.jobTitle))];
    let locations = [...new Set(applicationRounds.map(r => r.location))];
    let rounds = [...new Set(applicationRounds.map(r => r.roundName))];

    jobFilter.innerHTML = `<option value="">Filter by Job</option>` + jobs.map(j => `<option>${j}</option>`).join("");
    locationFilter.innerHTML = `<option value="">Filter by Location</option>` + locations.map(l => `<option>${l}</option>`).join("");
    roundFilter.innerHTML = `<option value="">Filter by Round</option>` + rounds.map(r => `<option>${r}</option>`).join("");
  }

  // ========================== Table & Pagination ==========================
  let currentPage = 1;
  const rowsPerPage = 5;

  function getFilteredData() {
    return applicationRounds.filter(r => {
      return (!jobFilter.value || r.jobTitle === jobFilter.value) &&
             (!locationFilter.value || r.location === locationFilter.value) &&
             (!roundFilter.value || r.roundName === roundFilter.value) &&
             (!statusFilter.value || r.status === statusFilter.value);
    });
  }

  function renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    let filtered = getFilteredData();
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginated = filtered.slice(start, end);

    paginated.forEach(r => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-gray-100 dark:hover:bg-neutral-800";
      tr.innerHTML = `
        <td class="p-3 border">${r.name}</td>
        <td class="p-3 border">${r.email}</td>
        <td class="p-3 border">${r.jobTitle}</td>
        <td class="p-3 border">${r.roundName}</td>
        <td class="p-3 border">
          <input type="number" class="w-20 p-1 border rounded text-center bg-transparent"
            value="${r.marks ?? ''}" data-id="${r.id}"/>
        </td>
        <td class="p-3 border">${r.thresholdMark ?? '-'}</td>
        <td class="p-3 border ${r.status === 'Pass' ? 'text-green-600 font-semibold' : (r.status === 'Fail' ? 'text-red-600 font-semibold' : 'text-yellow-600 font-semibold')}">${r.status ?? 'Pending'}</td>
        <td class="p-3 border text-center">
          <button onclick="updateMark('${r.id}')" class="text-purple-600 hover:text-purple-800">
            <i class="fa-solid fa-upload"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    renderPagination(filtered.length);
  }

  function renderPagination(total) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    let totalPages = Math.ceil(total / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      let btn = document.createElement("button");
      btn.innerText = i;
      btn.className = `px-3 py-1 border rounded ${i === currentPage ? 'bg-primary text-white' : ''}`;
      btn.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });
      pagination.appendChild(btn);
    }
  }

  // ========================== Mark Update ==========================
function updateMark(id) {
  const input = document.querySelector(`input[data-id="${id}"]`);
  const round = applicationRounds.find(r => r.id === id);

  if (!round) return;

  const candidateRounds = applicationRounds
    .filter(r => r.email === round.email && r.jobTitle === round.jobTitle)
    .sort((a, b) => a.roundOrder - b.roundOrder);

  const currentIndex = candidateRounds.findIndex(r => r.id === id);

  // ✅ Check if previous rounds are passed
  if (currentIndex > 0) {
    const prevRounds = candidateRounds.slice(0, currentIndex);
    const failedPrev = prevRounds.find(r => r.status !== "Pass");

    if (failedPrev) {
      showToast(
        `Cannot update ${round.roundName}. Previous round "${failedPrev.roundName}" is not Pass.`,
        "error"
      );
      return;
    }
  }

  // ✅ Check if any future round is already "Pass"
  const futureRounds = candidateRounds.slice(currentIndex + 1);
  const passedFuture = futureRounds.find(r => r.status === "Pass");

  if (passedFuture) {
    showToast(
      `Cannot update ${round.roundName}. A later round "${passedFuture.roundName}" is already marked as Pass.`,
      "error"
    );
    return;
  }

  // ✅ Now allow updating
  round.marks = parseInt(input.value) || null;

  if (round.marks === null || round.thresholdMark === undefined) {
    round.status = "Pending";
  } else {
    round.status = round.marks >= round.thresholdMark ? "Pass" : "Fail";
  }

  if (round.applicationId) {
  updateApplicationStatus(round.applicationId);
}

  saveData();
  renderTable();
  showToast("Mark updated");
}


  // ========================== Threshold ==========================
 function applyThreshold() {
  const val = parseInt(document.getElementById("thresholdInput").value);
  if (isNaN(val)) {
    showToast("Please enter a valid threshold", "error");
    return;
  }


   
   if (jobFilter.value=="" || locationFilter.value =="" || roundFilter.value=="") {
    showToast("Please apply a all filters before setting threshold", "error");
    return;
  }

  // Get the filtered dataset just like renderTable()
  let filtered = applicationRounds.filter(r => {
    return (!jobFilter.value || r.jobTitle === jobFilter.value) &&
           (!locationFilter.value || r.location === locationFilter.value) &&
           (!roundFilter.value || r.roundName === roundFilter.value)
  });

  if (filtered.length === 0) {
    showToast("No filtered records to apply threshold", "error");
    return;
  }

  // Apply threshold ONLY to filtered rows
  filtered.forEach(r => {
    r.thresholdMark = val;
    if (r.marks !== null) {
      r.status = r.marks >= val ? "Pass" : "Fail";
    }
  });

  saveData();
  renderTable();
  showToast("Threshold applied to filtered records");
}


  // ========================== Excel Upload ==========================
  function handleBulkUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let errorCount = 0;

    rows.forEach(row => {
      let round = applicationRounds.find(
        r => r.email === row.Email && r.name === row.Name
      );

      if (!round) return; // Skip if not found

      // Save prior state
      const prevMarks = round.marks;
      const prevStatus = round.status;

      // Get all rounds of candidate
      const candidateRounds = applicationRounds
        .filter(r => r.email === round.email && r.jobTitle === round.jobTitle)
        .sort((a, b) => a.roundOrder - b.roundOrder);

      const currentIndex = candidateRounds.findIndex(r => r.id === round.id);

      // Check if previous rounds are Pass
      if (currentIndex > 0) {
        const prevRounds = candidateRounds.slice(0, currentIndex);
        const failedPrev = prevRounds.find(r => r.status !== "Pass");

        if (failedPrev) {
          // Revert to prior state
          round.marks = prevMarks;
          round.status = prevStatus;

          showToast(
            `Upload error → ${round.name} (${round.email}), Round: ${round.roundName}. Reason: Previous round "${failedPrev.roundName}" not Pass.`,
            "error"
          );
          errorCount++;
          return;
        }
      }

      // Apply marks update
      round.marks = parseInt(row.Marks) || null;
      if (round.marks === null || round.thresholdMark === undefined) {
        round.status = "Pending";
      } else {
        round.status = round.marks >= round.thresholdMark ? "Pass" : "Fail";
      }
    });

    saveData();
    renderTable();

    if (errorCount > 0) {
      showToast(`${errorCount} record(s) failed to update. Check logs.`, "error");
    } else {
      showToast("Excel uploaded & applied");
    }

    e.target.value = ""; // Reset input
  };

  reader.readAsArrayBuffer(file);
}
  // ========================== Excel Download ==========================
  function downloadExcel() {
    let filtered = getFilteredData();
    if (filtered.length === 0) {
      showToast("No records for filter", "error");
      return;
    }
    let data = filtered.map(r => ({
      Name: r.name,
      Email: r.email,
      Job: r.jobTitle,
      Round: r.roundName,
      Marks: r.marks ?? "",
      Threshold: r.thresholdMark ?? "",
      Status: r.status
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    XLSX.writeFile(wb, "filtered_application_rounds.xlsx");
  }

  // ========================== Init ==========================
  renderFilters();
  renderTable();
  [jobFilter, locationFilter, roundFilter, statusFilter].forEach(f => {
    f.addEventListener("change", () => { currentPage = 1; renderTable(); });
  });


  //Update Application Status


  function updateApplicationStatus(applicationId) {
  let applications = JSON.parse(localStorage.getItem("applications")) || [];

  // find the application
  let app = applications.find(a => a.id === applicationId);
  if (!app) return;

  // get all rounds for this application
  let rounds = applicationRounds
    .filter(r => r.applicationId === applicationId)
    .sort((a, b) => a.Number - b.Number);

  if (rounds.length === 0) return;

  // check final round
  let lastRound = rounds[rounds.length - 1];
  if (lastRound.status === "Pass") {
    app.status = "Selected";  // or "Pass"
  } else if (rounds.some(r => r.status === "Fail")) {
    app.status = "Rejected";  // fail in any round
  } else {
    app.status = "In Progress";
  }

  // save back
  localStorage.setItem("applications", JSON.stringify(applications));
}
