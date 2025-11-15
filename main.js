document.addEventListener("DOMContentLoaded", () => {

  const preloader = document.querySelector(".preloader");
  window.addEventListener("load", () => {
    preloader.classList.add("preloader-hidden");
    setTimeout(() => {
      if (preloader) {
        preloader.style.display = "none";
      }
    }, 500);
  });

  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
      "glare-prerender": false,
      "full-page-listening": false,
      gyroscope: true,
    });
  }

  const auroraBlobs = document.querySelectorAll("[data-aurora-blob]");
  window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    requestAnimationFrame(() => {
      auroraBlobs.forEach((blob, index) => {
        const divider = (index + 1) * 20;
        const moveX = (clientX - window.innerWidth / 2) / divider;
        const moveY = (clientY - window.innerHeight / 2) / divider;
        blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  });

  const cursorDot = document.querySelector("[data-cursor-dot]");
  const cursorOutline = document.querySelector("[data-cursor-outline]");
  let magneticElements = Array.from(
    document.querySelectorAll("[data-magnetic]")
  );
  const magneticRadius = 80;

  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate(
      { left: `${posX}px`, top: `${posY}px` },
      { duration: 500, fill: "forwards" }
    );

    magneticElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(elX - posX, 2) + Math.pow(elY - posY, 2)
      );
      if (distance < magneticRadius) {
        el.style.transform = `translate(${(posX - elX) * 0.4}px, ${
          (posY - elY) * 0.4
        }px)`;
      } else {
        el.style.transform = "translate(0, 0)";
      }
    });
  });

  const hoverables = document.querySelectorAll("[data-hoverable]");
  hoverables.forEach((el) => {
    el.addEventListener("mouseover", () => {
      cursorDot.classList.add("cursor-dot-interact");
      cursorOutline.classList.add("cursor-interact");
    });
    el.addEventListener("mouseout", () => {
      cursorDot.classList.remove("cursor-dot-interact");
      cursorOutline.classList.remove("cursor-interact");
    });
  });
  document.addEventListener("mouseout", () => {
    cursorDot.classList.add("cursor-hidden");
    cursorOutline.classList.add("cursor-hidden");
  });
  document.addEventListener("mouseover", () => {
    cursorDot.classList.remove("cursor-hidden");
    cursorOutline.classList.remove("cursor-hidden");
  });

  const scrollProgressBar = document.querySelector(".scroll-progress-bar");
  const scrollTopBtn = document.getElementById("progress-scroll-top");
  const progressCircleBar = document.getElementById("progress-circle-bar");
  const circumference = 2 * Math.PI * 15.9155;

  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight } = document.documentElement;
    const scrollableHeight = scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollableHeight) * 100;

    scrollProgressBar.style.width = `${scrollPercent}%`;

    if (scrollTop > 300) {
      scrollTopBtn.style.display = "block";
      const dashOffset =
        circumference - (scrollTop / scrollableHeight) * circumference;
      progressCircleBar.style.strokeDashoffset = dashOffset;
    } else {
      scrollTopBtn.style.display = "none";
    }
  });

  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");

  menuIcon.onclick = () => {
    menuIcon.querySelector("i").classList.toggle("fa-bars");
    menuIcon.querySelector("i").classList.toggle("fa-xmark");
    navbar.classList.toggle("active");
    const isExpanded = navbar.classList.contains("active");
    menuIcon.setAttribute("aria-expanded", isExpanded);
  };

  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("header nav a");
  const header = document.querySelector("header");

  window.onscroll = () => {
    let currentSectionId = "";
    sections.forEach((sec) => {
      const top = window.scrollY;
      const offset = sec.offsetTop - 150;
      if (top >= offset && top < offset + sec.offsetHeight) {
        currentSectionId = sec.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });

    header.classList.toggle("sticky", window.scrollY > 100);

    if (navbar.classList.contains("active")) {
      menuIcon.querySelector("i").classList.add("fa-bars");
      menuIcon.querySelector("i").classList.remove("fa-xmark");
      navbar.classList.remove("active");
      menuIcon.setAttribute("aria-expanded", "false");
    }
  };

  ScrollReveal({
    distance: "80px",
    duration: 2000,
    delay: 200,
    reset: false,
  });
  ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
  ScrollReveal().reveal(
    ".home-img-3d-wrapper, .services-container, .testimonial-slider, .contact-form, .github-stats-container, .hire-me-content",
    { origin: "bottom" }
  );
  ScrollReveal().reveal(".home-content h1, .about-img, .contact-info", {
    origin: "left",
  });
  ScrollReveal().reveal(
    ".home-content p, .about-content, .education-container, .portfolio-filter-buttons, .github-repos-container, .skills-container, .skills-toggle-buttons",
    {
      origin: "right",
    }
  );
  ScrollReveal().reveal(".portfolio-box, .stat-box", {
    interval: 150,
    origin: "bottom",
  });
  ScrollReveal().reveal(".social-media a", {
    origin: "bottom",
    interval: 150,
    delay: 400,
  });

  const skillsCanvas = document.getElementById("skills-canvas");
  if (skillsCanvas && skillsCanvas.getContext) {
    const ctx = skillsCanvas.getContext("2d");
    const container = document.getElementById("tag-cloud-container");

    let width = container.clientWidth;
    let height = container.clientHeight;
    skillsCanvas.width = width;
    skillsCanvas.height = height;

    let mouseX = width / 2;
    let mouseY = height / 2;

    const skills = [
      { text: "React", color: "#00E0FF" },
      { text: ".NET", color: "#FF00A8" },
      { text: "JavaScript", color: "#E0E0E0" },
      { text: "C#", color: "#00E0FF" },
      { text: "SQL Server", color: "#FF00A8" },
      { text: "HTML5", color: "#E0E0E0" },
      { text: "CSS3", color: "#00E0FF" },
      { text: "Git", color: "#FF00A8" },
      { text: "Figma", color: "#E0E0E0" },
      { text: "MongoDB", color: "#00E0FF" },
      { text: "Docker", color: "#FF00A8" },
      { text: "REST APIs", color: "#E0E0E0" },
      { text: "Web3", color: "#00E0FF" },
      { text: "Ethers.js", color: "#FF00A8" },
      { text: "Solidity", color: "#E0E0E0" },
    ];

    let tags = [];
    let radius = Math.min(width, height) * 0.4;

    function createTag(text, color) {
      const phi = Math.acos(-1 + (2 * Math.random() - 1));
      const theta = Math.sqrt(skills.length * Math.PI) * phi;

      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        text: text,
        color: color,
        phi: phi,
        theta: theta,
      };
    }

    function initializeTags() {
      tags = skills.map((skill) => createTag(skill.text, skill.color));
    }

    function updateTags() {
      const angleX = (mouseY - height / 2) * 0.0001;
      const angleY = (mouseX - width / 2) * 0.0001;

      tags.forEach((tag) => {
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y1 = tag.y * cosX - tag.z * sinX;
        const z1 = tag.z * cosX + tag.y * sinX;
        tag.y = y1;
        tag.z = z1;

        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = tag.x * cosY - tag.z * sinY;
        const z2 = tag.z * cosY + tag.x * sinY;
        tag.x = x1;
        tag.z = z2;
      });

      tags.sort((a, b) => b.z - a.z);
    }

    function drawTags() {
      ctx.clearRect(0, 0, width, height);

      tags.forEach((tag) => {
        const scale = (tag.z + radius) / (2 * radius);
        const alpha = (tag.z + radius) / (2 * radius) * 0.5 + 0.5;
        const fontSize = scale * 12 + 10;

        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = tag.color;
        ctx.globalAlpha = alpha;

        ctx.fillText(tag.text, tag.x + width / 2, tag.y + height / 2);
      });
    }

    function animate() {
      updateTags();
      drawTags();
      requestAnimationFrame(animate);
    }

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    window.addEventListener("resize", () => {
      width = container.clientWidth;
      height = container.clientHeight;
      skillsCanvas.width = width;
      skillsCanvas.height = height;
      radius = Math.min(width, height) * 0.4;
      mouseX = width / 2;
      mouseY = height / 2;
      initializeTags();
    });

    initializeTags();
    animate();
  } else {
    document.getElementById("tag-cloud-fallback").style.display = "flex";
    document.getElementById("tag-cloud-container").style.display = "none";
  }

  const creativeBtn = document.getElementById("skills-creative-btn");
  const structuredBtn = document.getElementById("skills-structured-btn");
  const cloudView = document.getElementById("tag-cloud-container");
  const gridView = document.getElementById("skills-grid-container");

  if (creativeBtn) {
    creativeBtn.addEventListener("click", () => {
      creativeBtn.classList.add("active");
      structuredBtn.classList.remove("active");
      gridView.classList.remove("active");
      cloudView.classList.add("active");
    });
  }

  if (structuredBtn) {
    structuredBtn.addEventListener("click", () => {
      structuredBtn.classList.add("active");
      creativeBtn.classList.remove("active");
      cloudView.classList.remove("active");
      gridView.classList.add("active");
    });
  }

  if (document.querySelector(".multiple-text")) {
    new Typed(".multiple-text", {
      strings: [
        "Backend Developer",
        "Frontend Developer",
        "Full-Stack Developer",
        "React Developer",
        "C# Developer",
        ".NET Developer",
      ],
      typeSpeed: 70,
      backSpeed: 70,
      backDelay: 1000,
      loop: true,
    });
  }

  const darkModeIconBtn = document.getElementById("darkMode-icon-btn");
  const darkModeIcon = document.getElementById("darkMode-icon");

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    darkModeIcon.classList.replace("fa-moon", "fa-sun");
    darkModeIconBtn.setAttribute("aria-label", "Toggle dark mode");
  }

  darkModeIconBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    darkModeIcon.classList.toggle("fa-moon", !isLight);
    darkModeIcon.classList.toggle("fa-sun", isLight);
    darkModeIconBtn.setAttribute(
      "aria-label",
      isLight ? "Toggle dark mode" : "Toggle light mode"
    );
    localStorage.setItem("theme", isLight ? "light" : "dark");
    darkModeIcon.classList.add("glow");
    setTimeout(() => darkModeIcon.classList.remove("glow"), 600);
  });

  const toggleButtons = document.querySelectorAll(".about-toggle-btn");
  const textContents = document.querySelectorAll(".about-text");
  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleButtons.forEach((btn) => btn.classList.remove("active"));
      textContents.forEach((text) => text.classList.remove("show"));
      button.classList.add("active");
      document
        .getElementById(button.dataset.target + "-text")
        .classList.add("show");
    });
  });

  const GITHUB_USER = "sunnyrebel286";
  const GITHUB_API_USER = `https://api.github.com/users/${GITHUB_USER}`;
  const GITHUB_API_REPOS = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`;
  const reposContainer = document.getElementById("github-repos-container");

  async function fetchGitHubStats() {
    try {
      const [userRes, repoRes] = await Promise.all([
        fetch(GITHUB_API_USER),
        fetch(GITHUB_API_REPOS),
      ]);
      if (!userRes.ok || !repoRes.ok)
        throw new Error(`API Error: ${userRes.status}`);

      const userData = await userRes.json();
      const repoData = await repoRes.json();

      document.getElementById("github-user-card").innerHTML = `
        <img src="${userData.avatar_url}" alt="${
        userData.name
      }" data-hoverable data-magnetic />
        <h3>${userData.name}</h3>
        <p>@${userData.login}</p>
        <p>${userData.bio || "Full-stack developer."}</p>
      `;

      document.getElementById("github-repo-count").textContent =
        userData.public_repos || "0";
      document.getElementById("github-follower-count").textContent =
        userData.followers || "0";

      const totalStars = repoData.reduce(
        (acc, repo) => acc + repo.stargazers_count,
        0
      );
      document.getElementById("github-stars-count").textContent = totalStars;

      reposContainer.innerHTML = "";
      const reposToDisplay = repoData.slice(0, 6);

      if (reposToDisplay.length === 0) {
        reposContainer.innerHTML = `<p style="text-align: center; color: var(--text-color-dark); grid-column: 1 / -1;">No repositories found.</p>`;
      }
      reposToDisplay.forEach((repo) => {
        const repoCard = document.createElement("div");
        repoCard.className = "github-repo-card glass-card";
        repoCard.dataset.hoverable = true;
        repoCard.innerHTML = `
          <h4><a href="${repo.html_url}" target="_blank" data-hoverable data-magnetic><i class="fa-solid fa-book-bookmark"></i> ${repo.name}</a></h4>
          <p>${repo.description || "No description provided."}</p>
          <div class="repo-footer">
            <span class="repo-lang">${repo.language || "N/A"}</span>
            <div class="repo-stats">
              <span title="Stars"><i class="fa-solid fa-star"></i> ${
                repo.stargazers_count
              }</span>
              <span title="Forks"><i class="fa-solid fa-code-fork"></i> ${
                repo.forks_count
              }</span>
            </div>
          </div>`;
        reposContainer.appendChild(repoCard);
      });
      reInitDynamicInteractions();
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      reposContainer.innerHTML = `
        <div class="github-error-card glass-card">
          <i class="fa-solid fa-circle-exclamation"></i>
          <h3>Failed to Load GitHub Stats</h3>
          <p>Could not fetch data from the GitHub API. This might be due to rate limiting or a network issue. Please try again later.</p>
        </div>`;
      [
        "github-repo-count",
        "github-follower-count",
        "github-stars-count",
      ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "N/A";
      });
    }
  }
  fetchGitHubStats();

  const searchInput = document.getElementById("github-search");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const repoCards = document.querySelectorAll(".github-repo-card");
    repoCards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();
      if (cardText.includes(searchTerm)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });

  const filterButtons = document.querySelectorAll(
    ".portfolio-filter-buttons .filter-btn"
  );
  const portfolioBoxes = document.querySelectorAll(".portfolio-box");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filterValue = button.getAttribute("data-filter");

      portfolioBoxes.forEach((box) => {
        const boxCategory = box.dataset.category;
        const shouldShow =
          filterValue === "all" || boxCategory === filterValue;

        if (shouldShow) {
          box.classList.remove("hide");
        } else {
          box.classList.add("hide");
        }
      });
    });
  });

  portfolioBoxes.forEach((box) => {
    const spotlight = box.querySelector(".portfolio-box-spotlight");
    if (spotlight) {
      box.addEventListener("mousemove", (e) => {
        const rect = box.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotlight.style.setProperty("--mouse-x", `${x}px`);
        spotlight.style.setProperty("--mouse-y", `${y}px`);
      });
    }
  });

  const portfolioModal = document.getElementById("portfolio-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalTechTags = document.getElementById("modal-tech-tags");
  const modalLiveLink = document.getElementById("modal-live-link");
  const modalRepoLink = document.getElementById("modal-repo-link");
  const modalFeatures = document.getElementById("modal-features");

  portfolioBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      const data = box.dataset;
      modalTitle.textContent = data.modalTitle;
      modalImg.src = data.modalImg;
      modalDesc.textContent = data.modalDesc;

      modalTechTags.innerHTML = "";
      data.modalTech.split("|").forEach((tag) => {
        modalTechTags.innerHTML += `<span>${tag}</span>`;
      });

      modalFeatures.innerHTML = "";
      if (data.modalFeatures) {
        data.modalFeatures.split("|").forEach((feature) => {
          modalFeatures.innerHTML += `<li>${feature}</li>`;
        });
      } else {
        modalFeatures.innerHTML = "<li>Details not available.</li>";
      }

      modalLiveLink.href = data.modalLive;
      data.modalLive !== "#"
        ? modalLiveLink.removeAttribute("disabled")
        : modalLiveLink.setAttribute("disabled", "true");
      modalRepoLink.href = data.modalRepo;
      data.modalRepo !== "#"
        ? modalRepoLink.removeAttribute("disabled")
        : modalRepoLink.setAttribute("disabled", "true");

      portfolioModal.classList.add("show");
    });
  });

  function closePortfolioModal() {
    portfolioModal.classList.remove("show");
  }
  modalCloseBtn.addEventListener("click", closePortfolioModal);
  portfolioModal.addEventListener("click", (e) => {
    if (e.target === portfolioModal) closePortfolioModal();
  });

  const seeMoreBtn = document.getElementById("journey-see-more");
  const hiddenJourneys = document.querySelectorAll(".journey-hidden");
  let isExpanded = false;

  if (seeMoreBtn) {
    seeMoreBtn.addEventListener("click", () => {
      isExpanded = !isExpanded;
      hiddenJourneys.forEach((box, index) => {
        if (isExpanded) {
          setTimeout(() => {
            box.style.display = "block";
            setTimeout(() => box.classList.add("show"), 10);
          }, index * 100);
        } else {
          box.classList.remove("show");
          setTimeout(() => (box.style.display = "none"), 400);
        }
      });
      seeMoreBtn.textContent = isExpanded ? "See Less" : "See More";
    });
  }

  if (document.querySelector(".testimonial-slider")) {
    new Swiper(".testimonial-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      autoplay: { delay: 5000, disableOnInteraction: false },
      breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } },
    });
  }

});
