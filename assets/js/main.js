/**
 * main.js
 * Punto de entrada único. El resto de módulos ya se auto-inicializan
 * escuchando `DOMContentLoaded` / `sagmt:layout-ready`; este archivo solo
 * deja constancia del arranque y expone un namespace de versión.
 */
(function () {
  "use strict";

  window.SAGMT = window.SAGMT || {};
  window.SAGMT.version = "1.0.0";

  function updateFooterYear() {
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function boot() {
    var flow = window.SAGMT && window.SAGMT.flow;
    if (flow) flow.log("main", "SAGMT boot", { version: window.SAGMT.version });
    updateFooterYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  document.addEventListener("sagmt:layout-ready", updateFooterYear);
})();
