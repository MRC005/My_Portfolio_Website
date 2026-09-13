/* Small bits of behaviour: mobile menu, scroll reveal, active nav link.
   No dependencies. Everything degrades to a working page without it. */

(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");

  function closeMenu() {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // tapping a link, or hitting Escape, closes it again
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---------- hairline under the nav once you've scrolled ---------- */
  var nav = document.getElementById("nav");

  var navAnchors = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );

  function clearActive() {
    navAnchors.forEach(function (a) {
      a.classList.remove("is-active");
    });
  }

  function onScroll() {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 8);
    // back up in the hero, no section is current — don't leave one lit up
    if (window.scrollY < 200) clearActive();
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- reveal sections as they arrive ----------
     The content must never depend on this working. Anything already on screen
     is shown straight away, and if the observer hasn't reported in within two
     seconds we assume it isn't going to and just show everything. */
  var targets = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function show(el) {
    el.classList.add("is-in");
  }

  function showAll() {
    targets.forEach(show);
  }

  if (reduced || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    // whatever is already in view shouldn't wait for a callback
    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) show(el);
    });

    var observerWorks = false;
    var io = new IntersectionObserver(
      function (entries) {
        observerWorks = true;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    targets.forEach(function (el) {
      io.observe(el);
    });

    window.setTimeout(function () {
      if (!observerWorks) {
        io.disconnect();
        showAll();
      }
    }, 2000);
  }

  /* ---------- which section am I in ---------- */
  var sections = navAnchors
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navAnchors.forEach(function (a) {
            a.classList.toggle(
              "is-active",
              a.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }
})();
