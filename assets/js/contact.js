/**
 * contact.js
 * - Refuerza rel="noopener noreferrer" en cualquier enlace target="_blank"
 *   (defensivo: evita que un enlace nuevo quede sin la protección).
 * - Copiar al portapapeles para teléfono/correo (`[data-copy]`), con
 *   confirmación accesible vía aria-live.
 */
(function () {
  "use strict";

  function hardenExternalLinks(root) {
    root.querySelectorAll('a[target="_blank"]').forEach(function (a) {
      var rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
      ["noopener", "noreferrer"].forEach(function (token) {
        if (rel.indexOf(token) === -1) rel.push(token);
      });
      a.setAttribute("rel", rel.join(" "));
    });
  }

  function ensureLiveRegion() {
    var el = document.getElementById("copy-status");
    if (el) return el;
    el = document.createElement("p");
    el.id = "copy-status";
    el.className = "sr-only";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
    return el;
  }

  function setupCopyButtons(root) {
    var live = ensureLiveRegion();
    root.querySelectorAll("[data-copy]").forEach(function (el) {
      if (el.dataset.copyBound) return;
      el.dataset.copyBound = "1";
      el.addEventListener("click", function (evt) {
        var value = el.getAttribute("data-copy");
        if (!value || !navigator.clipboard) return;
        evt.preventDefault();
        navigator.clipboard
          .writeText(value)
          .then(function () {
            live.textContent = "Copiado: " + value;
          })
          .catch(function () {
            live.textContent = "No se pudo copiar. Selecciona el texto manualmente.";
          });
      });
    });
  }

  function init(root) {
    hardenExternalLinks(root);
    setupCopyButtons(root);
  }

  document.addEventListener("sagmt:layout-ready", function () {
    init(document);
  });
  document.addEventListener("DOMContentLoaded", function () {
    init(document);
  });
})();
