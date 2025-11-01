/*================================= TOGGLE ICON NAVBAR ============================*/
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("fa-xmark");
  navbar.classList.toggle("active");
};

/*================================= SCROLL SECTION ACTIVE LINK ============================*/
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");


window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });

  /*================================= STICKY NAVBAR ============================*/
  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 100);

  /*================================= REMOVE TOGGLE ICON AND NAVBAR ============================*/
  menuIcon.classList.remove("fa-xmark");
  navbar.classList.remove("active");
};

/*================================= SCROLL REVEAL ============================*/
ScrollReveal({
  distance: "80px",
  duration: 2000,
  delay: 200,
});
ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
ScrollReveal().reveal(
  ".home-img, .services-container, .testimonial-slider, .contact-form",
  { origin: "bottom" }
);
ScrollReveal().reveal(
  ".home-content h1, .about-img, .skills-container, .contact-info",
  {
    origin: "left",
  }
);
ScrollReveal().reveal(
  ".home-content p, .about-content, .education-container, .portfolio-filter-buttons",
  {
    origin: "right",
  }
);
ScrollReveal().reveal(".portfolio-box", { interval: 200, origin: "bottom" });

/*================================= TYPED JS ============================*/
const typed = new Typed(".multiple-text", {
  strings: ["Backend Developer","Frontend Developer", "Web Developer", "React Developer","C# Developer",".Net Developer"],
  typeSpeed: 70,
  backSpeed: 70,
  backDelay: 1000,
  loop: true,
});

/*================================= DARK/LIGHT MODE WITH DYNAMIC GLOW EFFECT ============================*/
const darkModeIcon = document.getElementById("darkMode-icon");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  darkModeIcon.classList.replace("fa-moon", "fa-sun");
  darkModeIcon.dataset.glowColor = "#4db8ff"; // Cool blue in dark mode
} else {
  darkModeIcon.dataset.glowColor = "#fdd835"; // Warm golden in light mode
}

// Toggle dark/light mode
darkModeIcon.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    // Switch to sun (dark mode active)
    darkModeIcon.classList.replace("fa-moon", "fa-sun");
    darkModeIcon.dataset.glowColor = "#4db8ff"; // Blue glow
    localStorage.setItem("theme", "dark");
  } else {
    // Switch to moon (light mode active)
    darkModeIcon.classList.replace("fa-sun", "fa-moon");
    darkModeIcon.dataset.glowColor = "#fdd835"; // Golden glow
    localStorage.setItem("theme", "light");
  }

  // Add temporary glow animation
  darkModeIcon.classList.add("glow");
  setTimeout(() => darkModeIcon.classList.remove("glow"), 600);

  // Dynamically update CSS variable for glow color
function updateGlowColor() {
  document.documentElement.style.setProperty(
    "--icon-glow-color",
    darkModeIcon.dataset.glowColor
  );
}

// Observe changes when icon glow color changes
const observer = new MutationObserver(updateGlowColor);
observer.observe(darkModeIcon, { attributes: true, attributeFilter: ["data-glow-color"] });

// Run once initially
updateGlowColor();

});







/*================================= 'READ MORE' BUTTON ============================*/
document
  .getElementById("read-more-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    let moreText = document.getElementById("more-text");
    let btnText = this;

    if (
      moreText.style.display === "none" ||
      moreText.style.display === ""
    ) {
      moreText.style.display = "inline";
      btnText.innerHTML = "Read Less";
    } else {
      moreText.style.display = "none";
      btnText.innerHTML = "Read More";
    }
  });

/*================================= TESTIMONIAL CAROUSEL (SWIPER) ============================*/
var swiper = new Swiper(".testimonial-slider", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  grabCursor: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    // when window width is >= 768px
    768: {
      slidesPerView: 2,
    },
    // when window width is >= 992px
    992: {
      slidesPerView: 3,
    },
  },
});

/*================================= NEW: PORTFOLIO FILTER ============================*/
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioBoxes = document.querySelectorAll(".portfolio-box");

// Show all projects by default
portfolioBoxes.forEach((box) => box.classList.add("show"));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Set active button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    portfolioBoxes.forEach((box) => {
      const boxCategory = box.getAttribute("data-category");

      // Hide all boxes first
      box.classList.remove("show");

      // Show boxes that match the filter
      if (filterValue === "all" || boxCategory === filterValue) {
        // Use a small timeout to allow the 'hide' to register before 'show' for animation
        setTimeout(() => {
          box.classList.add("show");
        }, 10);
      }
    });
  });
});


/*================================= SEE MORE BUTTON (EDUCATION SECTION) ============================*/
const seeMoreBtn = document.getElementById("journey-see-more");
const hiddenJourneys = document.querySelectorAll(".journey-hidden");
let isExpanded = false;

if (seeMoreBtn) {
  seeMoreBtn.addEventListener("click", () => {
    hiddenJourneys.forEach((box) => {
      if (!isExpanded) {
        // Show with fade-in
        box.style.display = "block";
        setTimeout(() => box.classList.add("show"), 10);
      } else {
        // Hide with fade-out
        box.classList.remove("show");
        setTimeout(() => (box.style.display = "none"), 400);
      }
    });

    // Toggle button text
    seeMoreBtn.textContent = isExpanded ? "See More" : "See Less";
    isExpanded = !isExpanded;
  });
}



