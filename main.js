// Utility functions
const throttle = (func, limit = 16) => {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

const debounce = (func, delay = 250) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// Global cursor elements and desktop detection for re-initialization
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");
const isDesktop = window.matchMedia("(pointer: fine)").matches && 
                   window.innerWidth >= 768;


function reInitDynamicInteractions() {
  const newHoverables = document.querySelectorAll("[data-hoverable]:not([data-init])");
  newHoverables.forEach((el) => {
    el.dataset.init = "true";
    if (cursorDot && cursorOutline) {
      el.addEventListener("mouseenter", () => {
        cursorDot.classList.add("cursor-dot-interact");
        cursorOutline.classList.add("cursor-interact");
      });
      el.addEventListener("mouseleave", () => {
        cursorDot.classList.remove("cursor-dot-interact");
        cursorOutline.classList.remove("cursor-interact");
      });
    }
  });
}


// Preloader functionality
const preloader = document.querySelector(".preloader");
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (preloader) {
  const hidePreloader = () => {
    // Only hide if not already hidden
    if (preloader.classList.contains("preloader-hidden")) return;

    preloader.classList.add("preloader-hidden");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500); // Match CSS transition duration
  };
  
  // Check if document is already complete or interactive
  const checkLoadState = () => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
          hidePreloader();
      }
  };

  // Ensure preloader hides on full page load
  window.addEventListener("load", hidePreloader); 
  // Attempt to hide immediately if script loads after content is ready
  checkLoadState();
}

// Aurora background blobs (interactive background effect)
const auroraBlobs = document.querySelectorAll("[data-aurora-blob]");

if (!prefersReducedMotion && auroraBlobs.length) {
  const moveBlobs = throttle((e) => {
    const { clientX, clientY } = e;
    requestAnimationFrame(() => {
      auroraBlobs.forEach((blob, index) => {
        const divider = (index + 1) * 20; // Each blob moves slightly less
        const moveX = (clientX - window.innerWidth / 2) / divider;
        const moveY = (clientY - window.innerHeight / 2) / divider;
        blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }, 16); // Throttle to roughly 60fps

  window.addEventListener("mousemove", moveBlobs);
}

// Custom Cursor (dot and outline) and Magnetic Hover Effects
if (cursorDot && cursorOutline && isDesktop && !prefersReducedMotion) {
  const moveCursor = throttle((e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate(
      { left: `${posX}px`, top: `${posY}px` },
      { duration: 500, fill: "forwards" }
    );
  }, 16); // Throttle to roughly 60fps

  const magneticElements = document.querySelectorAll(
    '[data-hoverable][data-magnetic]:not(.services-card-container)'
  );
  const magneticRadius = 80; // Distance from element center to activate magnetic effect

  const magneticMove = throttle((e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Reset transform for service cards, as they have their own hover animation
    magneticElements.forEach((el) => {
      // Skip services-card-container as it handles its own transform
      if (el.classList.contains('services-card-container')) {
        el.style.transform = 'none'; 
        return;
      }
      
      const rect = el.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(elX - posX, 2) + Math.pow(elY - posY, 2)
      );
      
      if (distance < magneticRadius) {
        // Calculate a gentle pull effect
        el.style.transform = `translate(${(posX - elX) * 0.4}px, ${(posY - elY) * 0.4}px)`;
      } else {
        el.style.transform = "translate(0, 0)"; // Reset to original position
      }
    });
  }, 16);

  window.addEventListener("mousemove", magneticMove);
}

// Add/remove cursor interaction class for all data-hoverable elements
const hoverables = document.querySelectorAll("[data-hoverable]");
if (cursorDot && cursorOutline) {
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorDot.classList.add("cursor-dot-interact");
      cursorOutline.classList.add("cursor-interact");
    });
    el.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("cursor-dot-interact");
      cursorOutline.classList.remove("cursor-interact");
    });
  });
}


// Scroll progress bar and scroll-to-top button
const scrollProgressBar = document.querySelector(".scroll-progress-bar");
const scrollTopBtn = document.getElementById("progress-scroll-top");
const progressCircleBar = document.getElementById("progress-circle-bar");
const circumference = 2 * Math.PI * 15.9155; // Circumference for the SVG circle

const updateScrollProgress = throttle(() => {
  const { scrollTop, scrollHeight } = document.documentElement;
  const scrollableHeight = scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / scrollableHeight) * 100;

  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${scrollPercent}%`;
  }

  if (scrollTopBtn) {
    if (scrollTop > 300) { // Show button after scrolling down 300px
      scrollTopBtn.style.display = "block";
      if (progressCircleBar) {
        const dashOffset = circumference - (scrollTop / scrollableHeight) * circumference;
        progressCircleBar.style.strokeDashoffset = dashOffset;
      }
    } else {
      scrollTopBtn.style.display = "none";
    }
  }
}, 16); // Throttle to roughly 60fps

window.addEventListener("scroll", updateScrollProgress, { passive: true });

// Navbar Toggle (mobile menu)
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
if (menuIcon && navbar) {
  menuIcon.onclick = () => {
    const icon = menuIcon.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
    navbar.classList.toggle("active");
    const isExpanded = navbar.classList.contains("active");
    menuIcon.setAttribute("aria-expanded", isExpanded);
  };
}

// Active navigation link highlighting on scroll & sticky header
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a");
const header = document.querySelector("header");

const updateActiveNav = throttle(() => {
  let currentSectionId = "";
  const top = window.scrollY;
  
  sections.forEach((sec) => {
    const offset = sec.offsetTop - 150; // Adjust offset for header height
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

  if (header) {
    header.classList.toggle("sticky", window.scrollY > 100);
  }

  // Close mobile menu if open and scrolling (better UX)
  if (navbar && navbar.classList.contains("active") && menuIcon) {
    const icon = menuIcon.querySelector("i");
    icon.classList.add("fa-bars");
    icon.classList.remove("fa-xmark");
    navbar.classList.remove("active");
    menuIcon.setAttribute("aria-expanded", "false");
  }
}, 100); // Debounce for smoother updates

window.addEventListener("scroll", updateActiveNav, { passive: true });

// ScrollReveal Animations (if library is present and motion is not reduced)
if (window.ScrollReveal && !prefersReducedMotion) {
  ScrollReveal({
    distance: "80px",
    duration: 2000,
    delay: 200,
    reset: false, // Only animate once
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
    { origin: "right" }
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
}

// Vanilla-Tilt (3D Hover Effect for elements with data-tilt)
if (window.VanillaTilt && isDesktop && !prefersReducedMotion) {
  VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 15, // Max tilt rotation (degrees)
    speed: 400, // Speed of the tilt effect
    glare: true,
    "max-glare": 0.3,
    "glare-prerender": false, // No prerendering of the glare effect
    "full-page-listening": false, // Only listen to mouse movement over the element
    gyroscope: true, // Enable gyroscope on mobile devices
  });
}

// 3D Tag Cloud for Skills Section (Canvas-based)
const skillsCanvas = document.getElementById("skills-canvas");
const tagCloudContainer = document.getElementById("tag-cloud-container");
if (skillsCanvas && tagCloudContainer && !prefersReducedMotion) {
  const ctx = skillsCanvas.getContext("2d");

  function resizeCanvas() {
    const rect = tagCloudContainer.getBoundingClientRect();
    skillsCanvas.width = rect.width;
    skillsCanvas.height = rect.height;
  }

  resizeCanvas();
  window.addEventListener("resize", debounce(resizeCanvas, 250));

  const skills = [
    { text: "React", color: "#4DD0E1" },
    { text: ".NET", color: "#4CAF50" },
    { text: "JavaScript", color: "#A5D6A7" },
    { text: "C#", color: "#4DD0E1" },
    { text: "SQL Server", color: "#4CAF50" },
    { text: "HTML5", color: "#A5D6A7" },
    { text: "CSS3", color: "#4DD0E1" },
    { text: "Git", color: "#4CAF50" },
    { text: "Figma", color: "#A5D6A7" },
    { text: "MongoDB", color: "#4DD0E1" },
    { text: "Docker", color: "#4CAF50" },
    { text: "REST APIs", color: "#A5D6A7" },
    { text: "Web3", color: "#4DD0E1" },
    { text: "Ethers.js", color: "#4CAF50" },
    { text: "Solidity", color: "#A5D6A7" },
  ];

  let tags = [];
  let radius = 0;
  let mouseX = 0;
  let mouseY = 0;

  function createTag(text, color) {
    const phi = Math.acos(-1 + (2 * Math.random() - 1)); // For spherical distribution
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
    const rect = tagCloudContainer.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    radius = Math.min(width, height) * 0.4; // Responsive radius
    tags = skills.map((skill) => createTag(skill.text, skill.color));
    mouseX = width / 2; // Start in center
    mouseY = height / 2;
  }

  function updateTags() {
    // Simple rotation based on mouse position
    const angleX = (mouseY - skillsCanvas.height / 2) * 0.0001;
    const angleY = (mouseX - skillsCanvas.width / 2) * 0.0001;

    tags.forEach((tag) => {
      // Rotate around X-axis
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const y1 = tag.y * cosX - tag.z * sinX;
      const z1 = tag.z * cosX + tag.y * sinX;
      tag.y = y1;
      tag.z = z1;

      // Rotate around Y-axis
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x1 = tag.x * cosY - tag.z * sinY;
      const z2 = tag.z * cosY + tag.x * sinY;
      tag.x = x1;
      tag.z = z2;
    });

    tags.sort((a, b) => b.z - a.z); // Sort for correct depth rendering
  }

  function drawTags() {
    const rect = tagCloudContainer.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    tags.forEach((tag) => {
      // Scale and opacity based on depth (z-coordinate)
      const scale = (tag.z + radius) / (2 * radius); // 0.5 to 1.5 roughly
      const alpha = (tag.z + radius) / (2 * radius) * 0.5 + 0.5; // Fades with depth
      const fontSize = scale * 12 + 10; // Dynamic font size

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

  tagCloudContainer.addEventListener("mousemove", (e) => {
    const rect = tagCloudContainer.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  initializeTags();
  animate();
} else if (document.getElementById("tag-cloud-fallback")) {
  // Show fallback if canvas or motion is reduced
  document.getElementById("tag-cloud-fallback").style.display = "flex";
  document.getElementById("tag-cloud-container").style.display = "none";
}

// Skills section view toggle (Creative vs. Structured)
const creativeBtn = document.getElementById("skills-creative-btn");
const structuredBtn = document.getElementById("skills-structured-btn");
const cloudView = document.getElementById("tag-cloud-container");
const gridView = document.getElementById("skills-grid-container");

if (creativeBtn && structuredBtn && cloudView && gridView) {
  creativeBtn.addEventListener("click", () => {
    creativeBtn.classList.add("active");
    structuredBtn.classList.remove("active");
    gridView.classList.remove("active");
    cloudView.classList.add("active");
  });

  structuredBtn.addEventListener("click", () => {
    structuredBtn.classList.add("active");
    creativeBtn.classList.remove("active");
    cloudView.classList.remove("active");
    gridView.classList.add("active");
  });
}

// Typed.js (Dynamic text for home section)
if (window.Typed && document.querySelector(".multiple-text")) {
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

// Dark Mode Toggle
const darkModeIconBtn = document.getElementById("darkMode-icon-btn");
const darkModeIcon = document.getElementById("darkMode-icon");

if (darkModeIconBtn && darkModeIcon) {
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "light" || (!savedTheme && !prefersDark)) {
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
    
    // Add a glow effect for visual feedback
    darkModeIcon.classList.add("glow");
    setTimeout(() => darkModeIcon.classList.remove("glow"), 600);
  });
}

// About section toggle (Philosophy vs. Mission)
const toggleButtons = document.querySelectorAll(".about-toggle-btn");
const textContents = document.querySelectorAll(".about-text");

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleButtons.forEach((btn) => btn.classList.remove("active"));
    textContents.forEach((text) => text.classList.remove("show"));
    button.classList.add("active");
    
    const targetText = document.getElementById(
      button.dataset.target + "-text"
    );
    if (targetText) {
      targetText.classList.add("show");
    }
  });
});

// GitHub API Integration
const GITHUB_USER = "sunnyrebel286";
const GITHUB_API_USER = `https://api.github.com/users/${GITHUB_USER}`;
const GITHUB_API_REPOS = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`;
const reposContainer = document.getElementById("github-repos-container");

async function fetchGitHubStats() {
  try {
    // Fetch user data
    const userRes = await fetch(GITHUB_API_USER);
    if (!userRes.ok) {
      throw new Error(`User API Error: ${userRes.status} - ${userRes.statusText}`);
    }
    const userData = await userRes.json();
    
    // Fetch repositories data
    const repoRes = await fetch(GITHUB_API_REPOS);
    if (!repoRes.ok) {
        throw new Error(`Repo API Error: ${repoRes.status} - ${repoRes.statusText}`);
    }
    const repoData = await repoRes.json();


    // Update GitHub User Card
    const userCard = document.getElementById("github-user-card");
    if (userCard) {
      userCard.innerHTML = `
        <img src="${userData.avatar_url}" alt="${userData.name || userData.login}" data-hoverable data-magnetic />
        <h3>${userData.name || userData.login}</h3>
        <p>@${userData.login}</p>
        <p>${userData.bio || "Full-stack developer."}</p>
      `;
    }

    // Update GitHub Stats (Repos, Followers, Stars)
    ["github-repo-count", "github-follower-count", "github-stars-count"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        if (id === "github-stars-count") {
          const totalStars = repoData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
          el.textContent = totalStars;
        } else if (id === "github-repo-count") {
          el.textContent = userData.public_repos || "0";
        } else {
          el.textContent = userData.followers || "0";
        }
      }
    });

    // Populate Latest Repositories
    if (reposContainer) {
      reposContainer.innerHTML = ""; // Clear existing loaders/content
      const reposToDisplay = repoData.slice(0, 6); // Display up to 6 latest repos

      if (reposToDisplay.length === 0) {
        reposContainer.innerHTML = `
          <p style="text-align: center; color: var(--text-color-dark); grid-column: 1 / -1;">
            No repositories found.
          </p>
        `;
      } else {
        reposToDisplay.forEach((repo) => {
          const repoCard = document.createElement("div");
          repoCard.className = "github-repo-card glass-card";
          repoCard.dataset.hoverable = true; // For magnetic effect
          repoCard.innerHTML = `
            <h4>
              <a href="${repo.html_url}" target="_blank" data-hoverable data-magnetic rel="noreferrer">
                <i class="fa-solid fa-book-bookmark"></i> ${repo.name}
              </a>
            </h4>
            <p>${repo.description || "No description provided."}</p>
            <div class="repo-footer">
              <span class="repo-lang">${repo.language || "N/A"}</span>
              <div class="repo-stats">
                <span title="Stars"><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</span>
                <span title="Forks"><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</span>
              </div>
            </div>
          `;
          reposContainer.appendChild(repoCard);
        });
      }
    }

    reInitDynamicInteractions(); // Re-initialize hover effects for new elements

  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    if (reposContainer) {
      reposContainer.innerHTML = `
        <div class="github-error-card glass-card">
          <i class="fa-solid fa-circle-exclamation"></i>
          <h3>Failed to Load GitHub Stats</h3>
          <p>Could not fetch data from the GitHub API. This might be due to rate limiting or a network issue. Please try again later. Check the console for details.</p>
        </div>
      `;
    }
    // Set fallback values if API fails
    ["github-repo-count", "github-follower-count", "github-stars-count"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "N/A";
    });
  }
}

// Call GitHub stats fetch when the DOM is ready (or immediately if already ready)
document.addEventListener("DOMContentLoaded", () => {
    if (reposContainer) {
        fetchGitHubStats();
    }

    // Initialize all other event listeners and functionality once DOM is ready
    const hoverables = document.querySelectorAll("[data-hoverable]");
    if (cursorDot && cursorOutline) {
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursorDot.classList.add("cursor-dot-interact");
          cursorOutline.classList.add("cursor-interact");
        });
        el.addEventListener("mouseleave", () => {
          cursorDot.classList.remove("cursor-dot-interact");
          cursorOutline.classList.remove("cursor-interact");
        });
      });
    }

    // Initialize scroll and navigation checks
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    
    // Initialize mobile menu
    const menuIcon = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");
    if (menuIcon && navbar) {
        menuIcon.onclick = () => {
            const icon = menuIcon.querySelector("i");
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
            navbar.classList.toggle("active");
            const isExpanded = navbar.classList.contains("active");
            menuIcon.setAttribute("aria-expanded", isExpanded);
        };
    }
});


// GitHub Repository Search Functionality
const searchInput = document.getElementById("github-search");
if (searchInput && reposContainer) {
  searchInput.addEventListener("input", debounce(() => {
    const searchTerm = searchInput.value.toLowerCase();
    const repoCards = document.querySelectorAll(".github-repo-card");
    let found = false;
    repoCards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();
      if (cardText.includes(searchTerm)) {
          card.style.display = "flex";
          found = true;
      } else {
          card.style.display = "none";
      }
    });
    // Optionally show a "no results" message if needed, but keeping it simple for now.
  }, 300)); // Debounce search input
}

// Portfolio Section - Project Filtering
const filterButtons = document.querySelectorAll(".portfolio-filter-buttons .filter-btn");
const portfolioBoxes = document.querySelectorAll(".portfolio-box");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filterValue = button.getAttribute("data-filter");

    portfolioBoxes.forEach((box) => {
      const boxCategory = box.dataset.category;
      const shouldShow = filterValue === "all" || boxCategory === filterValue;

      if (shouldShow) {
        box.classList.remove("hide"); // Show element
      } else {
        box.classList.add("hide"); // Hide element
      }
    });
  });
});

// Portfolio Section - Project Card Spotlight Effect
portfolioBoxes.forEach((box) => {
  const spotlight = box.querySelector(".portfolio-box-spotlight");
  if (spotlight && isDesktop && !prefersReducedMotion) {
    box.addEventListener("mousemove", (e) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.setProperty("--mouse-x", `${x}px`);
      spotlight.style.setProperty("--mouse-y", `${y}px`);
    });
  }
});

// Portfolio Modal - Project Details Popup
const portfolioModal = document.getElementById("portfolio-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalElements = {
  img: document.getElementById("modal-img"),
  title: document.getElementById("modal-title"),
  desc: document.getElementById("modal-desc"),
  techTags: document.getElementById("modal-tech-tags"),
  features: document.getElementById("modal-features"),
  liveLink: document.getElementById("modal-live-link"),
  repoLink: document.getElementById("modal-repo-link"),
};

if (portfolioModal && portfolioBoxes.length) {
  portfolioBoxes.forEach((box) => {
    box.addEventListener("click", (e) => {
      e.preventDefault();
      const data = box.dataset; // Get all data- attributes

      // Populate modal with project data
      if (modalElements.title) modalElements.title.textContent = data.modalTitle || "Project";
      if (modalElements.img) modalElements.img.src = data.modalImg || "";
      if (modalElements.img) modalElements.img.alt = data.modalTitle || "Project preview";
      if (modalElements.desc) modalElements.desc.textContent = data.modalDesc || "";

      // Populate tech tags
      if (modalElements.techTags) {
        modalElements.techTags.innerHTML = "";
        if (data.modalTech) {
          data.modalTech.split("|").forEach((tag) => {
            const span = document.createElement("span");
            span.textContent = tag.trim();
            modalElements.techTags.appendChild(span);
          });
        }
      }

      // Populate features list
      if (modalElements.features) {
        modalElements.features.innerHTML = "";
        if (data.modalFeatures) {
          data.modalFeatures.split("|").forEach((feature) => {
            const li = document.createElement("li");
            li.textContent = feature.trim();
            modalElements.features.appendChild(li);
          });
        } else {
          modalElements.features.innerHTML = "<li>Details not available.</li>";
        }
      }

      // Set live demo and repo links
      if (modalElements.liveLink) {
        modalElements.liveLink.href = data.modalLive || "#";
        data.modalLive && data.modalLive !== "#" 
          ? modalElements.liveLink.removeAttribute("disabled")
          : modalElements.liveLink.setAttribute("disabled", "true");
      }
      if (modalElements.repoLink) {
        modalElements.repoLink.href = data.modalRepo || "#";
        data.modalRepo && data.modalRepo !== "#"
          ? modalElements.repoLink.removeAttribute("disabled")
          : modalElements.repoLink.setAttribute("disabled", "true");
      }

      portfolioModal.classList.add("show");
      portfolioModal.setAttribute("aria-hidden", "false");
    });
  });

  // Close modal function
  function closePortfolioModal() {
    portfolioModal.classList.remove("show");
    portfolioModal.setAttribute("aria-hidden", "true");
  }

  // Close button event listener
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closePortfolioModal);
  }

  // Close modal when clicking outside content
  if (portfolioModal) {
    portfolioModal.addEventListener("click", (e) => {
      if (e.target === portfolioModal) closePortfolioModal();
    });
  }

  // Close modal on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && portfolioModal.classList.contains("show")) {
      closePortfolioModal();
    }
  });
}

// Education section "See More" functionality
const seeMoreBtn = document.getElementById("journey-see-more");
const hiddenJourneys = document.querySelectorAll(".journey-hidden");
let isExpanded = false;

if (seeMoreBtn && hiddenJourneys.length) {
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

// Swiper Testimonials initialization
if (window.Swiper && document.querySelector(".testimonial-slider")) {
    new Swiper(".testimonial-slider", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        grabCursor: true,
        pagination: { el: ".swiper-pagination", clickable: true },
        autoplay: { delay: 5000, disableOnInteraction: false },
        breakpoints: { 
            768: { slidesPerView: 2 }, 
            992: { slidesPerView: 3 } 
        },
    });
}


// Handle window resize for responsive behavior
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    
    if (window.innerWidth < 768) {
      document.querySelectorAll(".cursor-dot, .cursor-outline").forEach(el => {
        el.style.display = "none";
      });
    }
    
    const skillsCanvas = document.getElementById("skills-canvas");
    if (skillsCanvas && skillsCanvas.getContext) {
      // Re-initialize skills canvas size on resize
      const tagCloudContainer = document.getElementById("tag-cloud-container");
      const rect = tagCloudContainer.getBoundingClientRect();
      skillsCanvas.width = rect.width;
      skillsCanvas.height = rect.height;
    }
  }, 250);
});


// Contact Form Submission (AJAX)
const contactForm = document.getElementById('form-main-element');
const submitButton = document.getElementById('contact-submit-btn');
const statusMessage = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!submitButton || !statusMessage) return;

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        statusMessage.className = 'status-message';
        statusMessage.textContent = '';
        
        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusMessage.classList.add('success');
                statusMessage.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message sent successfully!';
                contactForm.reset();
            } else {
                statusMessage.classList.add('error');
                statusMessage.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Oops! Something went wrong.';
            }
        } catch (error) {
            console.error("Form Submission Error:", error);
            statusMessage.classList.add('error');
            statusMessage.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Network error. Please try again.';
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    });
}
