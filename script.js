// Mobile menu
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector("#navMenu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.style.display = isOpen ? "none" : "flex";
    menu.style.flexDirection = "column";
    menu.style.gap = "10px";
    menu.style.position = "absolute";
    menu.style.right = "12px";
    menu.style.top = "62px";
    menu.style.background = "white";
    menu.style.padding = "12px";
    menu.style.border = "1px solid rgba(14,23,38,0.08)";
    menu.style.borderRadius = "14px";
    menu.style.boxShadow = "0 16px 40px rgba(14,23,38,0.12)";
  });

  // close menu after click
  menu.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      toggle.setAttribute("aria-expanded", "false");
      menu.style.display = "none";
    }
  });

  // close menu on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 820) {
      toggle.setAttribute("aria-expanded", "false");
      menu.style.display = "flex";
      menu.style.position = "static";
      menu.style.padding = "0";
      menu.style.border = "0";
      menu.style.boxShadow = "none";
      menu.style.flexDirection = "row";
      menu.style.background = "transparent";
    } else {
      menu.style.display = "none";
    }
  });
}

// Footer year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Reveal on scroll (lekko + SEO-friendly)
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute("data-delay");
      if (delay) entry.target.style.transitionDelay = `${delay}s`;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => io.observe(el));
