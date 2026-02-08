/* app.js — Menú móvil + reveal + smooth scroll + cuenta atrás (sin segundos) + botón fake */

(() => {
  // Menú móvil
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("[data-nav]");

  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("no-scroll", isOpen);
    });

    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  // Reveal
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
      );

      revealEls.forEach((el, i) => {
        el.style.setProperty("--d", `${Math.min(i * 60, 260)}ms`);
        io.observe(el);
      });

      // Fail-safe: muestra todo aunque el observer falle
      setTimeout(() => revealEls.forEach((el) => el.classList.add("is-visible")), 2000);
    }
  }

  // Header shadow
  const header = document.querySelector(".header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Smooth scroll con offset
  const headerEl = document.querySelector(".header");
  const headerH = () => (headerEl ? headerEl.getBoundingClientRect().height : 0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      e.preventDefault();

      const y = target.getBoundingClientRect().top + window.scrollY - headerH() - 10;
      window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
      history.pushState(null, "", id);
    });
  });

  // Cuenta atrás (sin segundos)
  const cd = document.querySelector(".countdown[data-date]");
  if (cd) {
    const target = new Date(cd.getAttribute("data-date"));
    const dd = cd.querySelector("[data-dd]");
    const hh = cd.querySelector("[data-hh]");
    const mm = cd.querySelector("[data-mm]");
    const pad = (n) => String(n).padStart(2, "0");

    const tick = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        dd.textContent = "0";
        hh.textContent = "00";
        mm.textContent = "00";
        return;
      }

      const sec = Math.floor(diff / 1000);
      const days = Math.floor(sec / 86400);
      const hours = Math.floor((sec % 86400) / 3600);
      const mins = Math.floor((sec % 3600) / 60);

      dd.textContent = String(days);
      hh.textContent = pad(hours);
      mm.textContent = pad(mins);
    };

    tick();
    setInterval(tick, 1000);
  }
})();
