/**
 * navigation.js
 * Menú móvil (toggle + cierre por click-afuera/Escape/enlace) y botón
 * "volver" para las secciones de servicios.
 * Se re-ejecuta cuando layout-loader termina de inyectar el header.
 */
(function () {
  "use strict";

  function setupNavToggle(root) {
    var toggle = root.querySelector("[data-nav-toggle]");
    var nav = root.querySelector("[data-site-nav]");
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function open() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      isOpen ? close() : open();
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      close();
    });
  }

  function setupBackButtons() {
    document.querySelectorAll("[data-back]").forEach(function (btn) {
      if (btn.dataset.backBound) return;
      btn.dataset.backBound = "1";
      btn.addEventListener("click", function (e) {
        var fallback = btn.getAttribute("data-back") || "index.html";
        if (window.history.length > 1 && document.referrer.indexOf(window.location.origin) === 0) {
          e.preventDefault();
          window.history.back();
        } else {
          window.location.href = fallback;
        }
      });
    });
  }

  document.addEventListener("sagmt:layout-ready", function () {
    setupNavToggle(document);
    setupBackButtons();
  });

  // Si el header ya está inline (sin layout-loader) se activa directo.
  if (document.querySelector("[data-nav-toggle]")) {
    setupNavToggle(document);
  }
  setupBackButtons();
})();
