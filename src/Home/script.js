// ==================== Navbar ====================
const btn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const menu = document.getElementById('menu');
const navLinks = document.querySelectorAll('.nav-link');

btn.addEventListener('click', () => menu.classList.remove('translate-x-full'));
closeBtn.addEventListener('click', () => menu.classList.add('translate-x-full'));
navLinks.forEach(link => link.addEventListener('click', () => {
  navLinks.forEach(l => l.classList.remove('active'));
  link.classList.add('active');
}));

// ==================== Company Slider ====================
(async function () {
  const API_URL = "http://localhost:3001/slides";
  let slidesData = [];

  try {
    const res = await axios.get(API_URL);
    slidesData = res.data;
    if (!slidesData.length) throw new Error("No slides in JSON server");
  } catch (err) {
    console.warn("Falling back to default slides:", err);
    slidesData = [
      { image: "./slide2.jpg", text: "Welcome Job Seekers to <span class='text-blue-400 font-bold'>Genworx</span>. Explore amazing career opportunities and grow your professional journey with us." },
      { image: "./slider1.jpg", text: "Discover your potential at <span class='text-blue-400 font-bold'>Genworx</span>. Join our team and be a part of innovative projects and a collaborative environment." },
      { image: "./slide3.jpg", text: "Join the best team at <span class='text-blue-400 font-bold'>Genworx</span> and shape your future. Be part of a company that values talent, creativity, and growth." }
    ];
  }

  function createCompanySlider(containerId, slidesData) {
    const container = document.getElementById(containerId);
    container.classList.add("relative", "w-full", "h-[60vh]", "sm:h-[70vh]", "overflow-hidden");

    let current = 0;
    let typingTimeout;

    const prev = document.createElement("div");
    prev.className = "nav-chevron nav-left left-2 sm:left-4";
    prev.innerHTML = "&#10094;";
    container.appendChild(prev);

    const next = document.createElement("div");
    next.className = "nav-chevron nav-right right-2 sm:right-4";
    next.innerHTML = "&#10095;";
    container.appendChild(next);

    const slidesContainer = document.createElement("div");
    slidesContainer.className = "w-full h-full relative";
    container.appendChild(slidesContainer);

    const dotsContainer = document.createElement("div");
    dotsContainer.className = "dots flex justify-center absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 space-x-2 sm:space-x-3";
    container.appendChild(dotsContainer);

    slidesData.forEach((slide, index) => {
      const slideDiv = document.createElement("div");
      slideDiv.className = "slide w-full h-full" + (index === 0 ? " active" : "");
      slideDiv.innerHTML = `
        <img src="${slide.image}" alt="Slide ${index + 1}" class="w-full h-full object-cover">
        <div class="absolute bottom-16 sm:bottom-20 left-4 sm:left-8 text-white text-lg sm:text-2xl md:text-3xl font-medium max-w-[90%] sm:max-w-[70%] slide-text" style="text-shadow:2px 2px 6px rgba(0,0,0,0.7);"></div>
      `;
      slidesContainer.appendChild(slideDiv);

      const dot = document.createElement("span");
      dot.className = "dot h-3 w-3 sm:h-4 sm:w-4 " + (index === 0 ? "bg-blue-500" : "bg-gray-400");
      dot.addEventListener("click", () => showSlide(index));
      dotsContainer.appendChild(dot);
    });

    const slideElements = slidesContainer.querySelectorAll(".slide");
    const textElements = slidesContainer.querySelectorAll(".slide-text");
    const dots = dotsContainer.querySelectorAll("span");

    function typeHTMLText(el, html) {
      el.innerHTML = "";
      let index = 0;
      function typeNext() {
        if (index >= html.length) return;
        if (html[index] === "<") {
          const tagEnd = html.indexOf(">", index);
          el.innerHTML += html.slice(index, tagEnd + 1);
          index = tagEnd + 1;
        } else {
          el.innerHTML += html[index];
          index++;
        }
        typingTimeout = setTimeout(typeNext, 25);
      }
      typeNext();
    }

    function showSlide(index) {
      clearTimeout(typingTimeout);
      slideElements.forEach((s, i) => s.classList.toggle("active", i === index));
      dots.forEach((d, i) => {
        d.classList.toggle("bg-blue-500", i === index);
        d.classList.toggle("bg-gray-400", i !== index);
      });
      current = index;
      typeHTMLText(textElements[index], slidesData[index].text);
    }

    prev.addEventListener("click", () => showSlide(current === 0 ? slidesData.length - 1 : current - 1));
    next.addEventListener("click", () => showSlide(current === slidesData.length - 1 ? 0 : current + 1));

    setInterval(() => showSlide(current === slidesData.length - 1 ? 0 : current + 1), 6000);
    typeHTMLText(textElements[0], slidesData[0].text);
  }

  createCompanySlider("genworx-slider", slidesData);
})();

// ==================== Mobile Why Us Slider ====================
(function () {
  const slider = document.getElementById('whyusSlider');
  const dotsContainer = document.getElementById('whyusDots');
  const slides = Array.from(slider.children);
  let currentIndex = 0;
  let autoScrollInterval;

  function isMobile() { return window.innerWidth <= 768; }

  function initSlider() {
    if (isMobile()) {
      dotsContainer.innerHTML = '';
      slides.forEach((slide, i) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
      if(dotsContainer.children.length > 0) dotsContainer.children[0].classList.add('active');
      startAutoScroll();
    } else stopAutoScroll();
  }

  function goToSlide(index) {
    if(!isMobile()) return;
    slider.scrollTo({ left: index * slider.offsetWidth, behavior: 'smooth' });
    updateDots(index);
    currentIndex = index;
  }

  function updateDots(index) {
    Array.from(dotsContainer.children).forEach(dot => dot.classList.remove('active'));
    if(dotsContainer.children[index]) dotsContainer.children[index].classList.add('active');
  }

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      goToSlide(currentIndex);
    }, 4000);
  }

  function stopAutoScroll() {
    if(autoScrollInterval) clearInterval(autoScrollInterval);
  }

  window.addEventListener('resize', initSlider);
  document.addEventListener('DOMContentLoaded', initSlider);
})();

window.addEventListener('load', () => {
      const loader = document.getElementById('loader');
      loader.style.transition = 'opacity 0.5s ease';

      setTimeout(() => loader.remove(), 1500);

      // Show main content
      document.getElementById('content').style.display = 'block';
    });

    
    const jobs = [
      { "title": "Full Stack Developer", "location": "Chennai", "jobType": "Full-time", "skills": ["Java", "React", "Node.js"], "posted": "2 days ago", "applied": 24 },
      { "title": "Designer", "location": "Cuddalore", "jobType": "Part-time", "skills": ["Figma", "Photoshop"], "posted": "5 days ago", "applied": 12 },
      { "title": "Data Analyst", "location": "Chennai", "jobType": "Full-time", "skills": ["Power BI", "Tableau"], "posted": "1 day ago", "applied": 8 },
      { "title": "Product Manager", "location": "Bangalore", "jobType": "Full-time", "skills": ["Leadership", "Agile"], "posted": "3 days ago", "applied": 15 },
      { "title": "HR Associate", "location": "Mumbai", "jobType": "Full-time", "skills": ["Communication"], "posted": "4 days ago", "applied": 20 },
      { "title": "HR Associate", "location": "Mumbai", "jobType": "Full-time", "skills": ["Communication"], "posted": "4 days ago", "applied": 20 }
    ];

    const jobTypeBadge = (type) => {
      if (!type) return '';
      const map = {
        "Full-time": "bg-emerald-100 text-emerald-800",
        "Part-time": "bg-amber-100 text-amber-800",
        "Contract": "bg-indigo-100 text-indigo-800"
      };
      const classes = map[type] || "bg-slate-100 text-slate-800";
      return `<span class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${classes}">${type}</span>`;
    };

    function renderJobs(data) {
      const grid = document.getElementById('jobsGrid');
      const noJobs = document.getElementById('noJobs');
      grid.innerHTML = '';

      if (!data || data.length === 0) {
        noJobs.classList.remove('hidden');
        return;
      }
      noJobs.classList.add('hidden');

      data.forEach(job => {
        const skillsHtml = (job.skills || []).map(s => 
          `<span class="inline-flex items-center text-xs font-medium px-2 py-1 mr-2 mb-2 rounded-full border border-slate-100 bg-white/60 shadow-sm">${s}</span>`
        ).join('');

        const card = document.createElement('article');
        card.className = 'job-card bg-white/90 backdrop-blur-sm border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg flex flex-col h-full';

        card.innerHTML = `
          <header class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-base md:text-lg font-semibold leading-tight line-clamp-2">${escapeHtml(job.title)}</h3>
              <div class="mt-1 text-sm text-slate-500 flex items-center gap-3">
                <span class="flex items-center gap-2"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(job.location)}</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-clock"></i> ${escapeHtml(job.posted)}</span>
              </div>
            </div>
            <div class="text-right">
              ${jobTypeBadge(job.jobType)}
            </div>
          </header>

          <div class="mt-4 grow">
            <div class="text-sm text-slate-600 mb-3">Skills</div>
            <div class="flex flex-wrap -ml-1">${skillsHtml}</div>
          </div>

          <footer class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <div class="text-xs text-slate-500 flex items-center gap-4">
              <span class="flex items-center gap-1"><i class="fa-solid fa-user-check"></i> ${job.applied} Applied</span>
              <span class="flex items-center gap-1 cursor-pointer hover:text-slate-700"><i class="fa-solid fa-share-nodes"></i> Share</span>
            </div>
            <a href="#" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white shadow hover:bg-blue-700">
              <i class="fa-solid fa-paper-plane"></i> Apply Now
            </a>
          </footer>
        `;
        grid.appendChild(card);
      });
    }

    function escapeHtml(str) {
      if (typeof str !== 'string') return str ?? '';
      return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
    }

    renderJobs(jobs);
    window.updateJobsSection = (newJobsArray) => { renderJobs(newJobsArray); };



   const testimonialCards = document.querySelectorAll("#testimonialSlider .testimonial-card");
  const testimonialDotsContainer = document.getElementById("testimonialDots");
  let testimonialIndex = 0;

  // Create dots dynamically
  testimonialCards.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => showTestimonial(i));
    testimonialDotsContainer.appendChild(dot);
  });

  const testimonialDots = testimonialDotsContainer.querySelectorAll("span");

  function showTestimonial(index) {
    testimonialCards.forEach((_, i) => {
      testimonialDots[i].classList.remove("active");
    });
    testimonialDots[index].classList.add("active");

    // Mobile: slide effect
    if (window.innerWidth <= 768) {
      const slider = document.getElementById("testimonialSlider");
      slider.style.transform = `translateX(-${index * 100}%)`;
    }
  }

  // Auto-slide only on mobile
  if (window.innerWidth <= 768) {
    setInterval(() => {
      testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
      showTestimonial(testimonialIndex);
    }, 4000);
  }

  // Init
  showTestimonial(0);