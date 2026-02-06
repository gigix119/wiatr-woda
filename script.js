// Footer year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Mobile menu
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
  toggle.setAttribute("aria-expanded", "false");
  menu.classList.remove("is-open");

  toggle.addEventListener("click", () => {
    const isOpen = toggle.classList.contains("is-active");
    if (isOpen) closeMenu();
    else openMenu();
  });

  menu.addEventListener("click", (e) => {
    if (e.target.matches("a")) closeMenu();
  });

  document.addEventListener("click", (e) => {
    const clickedInside = menu.contains(e.target) || toggle.contains(e.target);
    if (!clickedInside) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 820) closeMenu();
  });
}

// Smooth scroll with sticky header offset (dla hash linków)
function getHeaderOffset() {
  const header = document.querySelector(".topbar");
  return header ? header.getBoundingClientRect().height + 10 : 80;
}

function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top, behavior: "smooth" });
}

document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;

  const hash = a.getAttribute("href");
  if (!hash || hash === "#") return;

  const target = document.querySelector(hash);
  if (!target) return;

  e.preventDefault();
  closeMenu();
  scrollToHash(hash);
  history.pushState(null, "", hash);
});

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

// LIGHTBOX (Galeria)
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const galleryItems = document.querySelectorAll(".gallery__item");

function openLightbox(src, alt="") {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

galleryItems.forEach(btn => {
  btn.addEventListener("click", () => {
    const full = btn.getAttribute("data-full");
    const img = btn.querySelector("img");
    openLightbox(full, img ? img.alt : "");
  });
});

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
}

// CAROUSEL (oferta)
document.querySelectorAll("[data-carousel]").forEach(carousel => {
  const track = carousel.querySelector(".carousel__track");
  const slides = carousel.querySelectorAll(".carousel__slide");
  const prevBtn = carousel.querySelector(".carousel__btn--prev");
  const nextBtn = carousel.querySelector(".carousel__btn--next");
  const dotsWrap = carousel.querySelector(".carousel__dots");
  let idx = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel__dot" + (i === 0 ? " is-active" : "");
    dot.type = "button";
    dot.setAttribute("aria-label", `Zdjęcie ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(i) {
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dotsWrap.querySelectorAll(".carousel__dot").forEach((d, j) => {
      d.classList.toggle("is-active", j === idx);
    });
  }

  prevBtn.addEventListener("click", () => goTo(idx - 1));
  nextBtn.addEventListener("click", () => goTo(idx + 1));

  // Swipe support
  let startX = 0;
  carousel.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(idx + (diff > 0 ? 1 : -1));
  });
});

// Formularz — walidacja + mailto (bez backendu)
const form = document.getElementById("contactForm");
const toast = document.getElementById("formToast");

function setError(field, msg) {
  const wrap = field.closest(".field");
  if (!wrap) return;
  const err = wrap.querySelector(".field__error");
  if (err) err.textContent = msg || "";
}

function clearErrors() {
  form?.querySelectorAll(".field__error").forEach(e => e.textContent = "");
}

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("is-open");
  setTimeout(() => toast.classList.remove("is-open"), 6000);
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const from = String(fd.get("from") || "").trim();
    const to = String(fd.get("to") || "").trim();
    const message = String(fd.get("message") || "").trim();

    let ok = true;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (name.length < 2) { ok = false; setError(form.elements.name, "Podaj imię i nazwisko (min. 2 znaki)."); }
    if (phone.length < 7) { ok = false; setError(form.elements.phone, "Podaj poprawny numer telefonu."); }
    if (!emailOk) { ok = false; setError(form.elements.email, "Podaj poprawny adres e-mail."); }
    if (!from) { ok = false; setError(form.elements.from, "Wybierz datę przyjazdu."); }
    if (!to) { ok = false; setError(form.elements.to, "Wybierz datę wyjazdu."); }
    if (message.length < 10) { ok = false; setError(form.elements.message, "Wiadomość musi mieć min. 10 znaków."); }

    if (from && to) {
      const d1 = new Date(from);
      const d2 = new Date(to);
      if (d2 <= d1) {
        ok = false;
        setError(form.elements.to, "Data wyjazdu musi być po dacie przyjazdu.");
      }
    }

    if (!ok) {
      showToast("Uzupełnij poprawnie formularz 🙂");
      return;
    }

    // mailto fallback (działa bez backendu)
    const subject = encodeURIComponent("Zapytanie o rezerwację – Wiatr & Woda Dębki");
    const body = encodeURIComponent(
`Imię i nazwisko: ${name}
Telefon: ${phone}
E-mail: ${email}
Data przyjazdu: ${from}
Data wyjazdu: ${to}

Wiadomość:
${message}`
    );

    // Podmień na właściwy e-mail:
    const toEmail = "wiatr.woda.debki@gmail.com";
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;

    showToast("Otwieram Twoją aplikację pocztową…");
    form.reset();
  });
}
