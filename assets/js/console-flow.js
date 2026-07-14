/**
 * console-flow.js
 * Registro interno del flujo técnico del sitio. No hace nada visible al
 * usuario; solo deja trazas en consola cuando el modo debug está activo,
 * útil para diagnosticar carga de componentes, slider y carrusel en vivo.
 *
 * Activación: agregar ?debug=1 a la URL, o `localStorage.setItem('sagmt:debug','1')`.
 */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var debugOn = params.get("debug") === "1" || window.localStorage.getItem("sagmt:debug") === "1";

  function log(scope, message, data) {
    if (!debugOn) return;
    if (data !== undefined) {
      console.log("[SAGMT:" + scope + "]", message, data);
    } else {
      console.log("[SAGMT:" + scope + "]", message);
    }
  }

  window.SAGMT = window.SAGMT || {};
  window.SAGMT.flow = { log: log, debugOn: debugOn };

  log("flow", "console-flow activo", { page: window.location.pathname });
})();
