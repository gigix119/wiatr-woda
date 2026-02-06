// Footer year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Mobile menu (class-based, bez inline styli)
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector("#navMenu");

function closeMenu() {
  if (!toggle || !menu) return;
  toggle.classList.remove("is-active");
  toggle.setAttribute("aria-expanded", "false");
  menu.classList.remove("is-open");
}

function openMenu() {
  if (!toggle || !menu) return;
  toggle.classList.add("is-active");
  toggle.setAttribute("aria-expanded", "true");
  menu.classList.add("is-open");
}

if (toggle && menu) {
  // start state
  toggle.setAttribute("aria-expanded", "false");
  menu.classList.remove("is-open");

  toggle.addEventListener("click", () => {
    const isOpen = toggle.classList.contains("is-active");
    if (isOpen) closeMenu();
    else openMenu();
  });

  // zamykanie po kliknięciu linka
  menu.addEventListener("click", (e) => {
    if (e.target.matches("a")) closeMenu();
  });

  // zamykanie po kliknięciu poza menu (UX)
  document.addEventListener("click", (e) => {
    const clickedInside = menu.contains(e.target) || toggle.contains(e.target);
    if (!clickedInside) closeMenu();
  });

  // ESC zamyka menu (UX)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // reset na desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 820) closeMenu();
  });
}

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
