document.addEventListener("DOMContentLoaded", () => {
  // --- Elements ---
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
  let tempRounds = [];
  let roundLimit = 0;
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

  // --- Rounds ---
  const roundCountInput = document.getElementById("round-count");
  const confirmRoundBtn = document.getElementById("confirm-round-count");
  const roundInputArea = document.getElementById("round-input-area");
  const roundInput = document.getElementById("round-input");
  const addRoundBtn = document.getElementById("add-round-btn");
  const roundsContainer = document.getElementById("rounds-container");
  const roundLimitMsg = document.getElementById("round-limit-msg");

  confirmRoundBtn.addEventListener("click", ()=>{
    const count = parseInt(roundCountInput.value);
    if(isNaN(count)||count<=0){ Toastify({text:"Enter valid rounds",duration:2500,gravity:"bottom",position:"right",backgroundColor:"#DC3545"}).showToast(); return; }
    roundLimit=count; tempRounds=[]; roundsContainer.innerHTML=""; roundInputArea.classList.remove("hidden");
    roundLimitMsg.textContent=`You can add up to ${roundLimit} rounds.`;
  });

  const addRound = () => {
    if(tempRounds.length>=roundLimit){ roundLimitMsg.textContent=`You already added ${roundLimit} rounds.`; return; }
    const val=roundInput.value.trim(); if(!val) return;
    const roundId=Date.now().toString();
    tempRounds.push({roundId, roundName: val});
    const chip=document.createElement("span");
    chip.className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center space-x-2";
    chip.innerHTML=`${tempRounds.length}. ${val} <button type="button">&times;</button>`;
    chip.querySelector("button").addEventListener("click", ()=>{
      tempRounds=tempRounds.filter(r=>r.roundId!==roundId); chip.remove();
    });
    roundsContainer.appendChild(chip);
    roundInput.value="";
  };

  addRoundBtn.addEventListener("click", addRound);
  roundInput.addEventListener("keypress", e=>{ if(e.key==="Enter"){ e.preventDefault(); addRound(); }});

  // --- Form submit ---
  form.addEventListener("submit", e=>{
    e.preventDefault();
    if(!validateStep()) return;

    const now = new Date().toISOString();
    const job = {
      id: Date.now().toString(),
      title: document.getElementById("job-title").value,
      description: document.getElementById("job-description").value,
      category: document.getElementById("job-category")?.value,
      skills: skills,
      responsibilities: document.getElementById("job-responsibilities").value,
      location: document.getElementById("job-location")?.value,
      jobType: document.getElementById("job-type")?.value,
      rounds: tempRounds.map(r=>r.roundId),
      positions: document.getElementById("job-positions").value,
      experience: parseInt(document.getElementById("job-experience").value),
      createdAt: now,
      openedAt: now,
      closedAt: null
    };

    // Save job in localStorage
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs.push(job);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    // Save rounds fully in localStorage
    let roundsStorage = JSON.parse(localStorage.getItem("rounds")) || [];
    tempRounds.forEach((r,index)=>{
      roundsStorage.push({roundId:r.roundId, jobId:job.id, roundName:r.roundName, sequence:index+1});
    });
    localStorage.setItem("rounds", JSON.stringify(roundsStorage));

    Toastify({text:"Job saved successfully! Proceeding...",duration:3000,gravity:"bottom",position:"right",backgroundColor:"#28A745"}).showToast();

    resetForm();
    modal.classList.add("hidden");
  });

  const resetForm = ()=>{
    form.reset(); skills=[]; renderSkills(); tempRounds=[]; roundsContainer.innerHTML=""; roundInputArea.classList.add("hidden");
    currentStep=0; showStep(currentStep);
  };
});
