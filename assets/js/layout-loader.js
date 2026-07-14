/**
 * layout-loader.js
 * Inyecta los componentes compartidos (header, nav, footer, whatsapp-float,
 * cta-contact) en los placeholders `[data-include]` de cada página, y marca
 * el enlace de navegación activo.
 *
 * Requiere que el sitio se sirva por HTTP (GitHub Pages, servidor local,
 * etc.) — `fetch()` no funciona sobre `file://`.
 */
(function () {
  "use strict";

  var flow = (window.SAGMT && window.SAGMT.flow) || { log: function () {} };

  function markActiveNav(root) {
    var current = window.location.pathname.split("/").pop() || "index.html";
    root.querySelectorAll("[data-nav-link]").forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("#")[0];
      if (href === current || (current === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function includeOne(el) {
    var name = el.getAttribute("data-include");
    if (!name) return Promise.resolve();
    return fetch("components/" + name + ".html", { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        el.removeAttribute("data-include");
        flow.log("layout-loader", "componente cargado: " + name);
        document.dispatchEvent(new CustomEvent("sagmt:component-loaded", { detail: { name: name, el: el } }));
        // Includes anidados: un componente puede incluir otro (header -> nav).
        var nested = Array.prototype.slice.call(el.querySelectorAll("[data-include]"));
        return Promise.all(nested.map(includeOne));
      })
      .catch(function (err) {
        flow.log("layout-loader", "fallo al cargar " + name, err);
        el.innerHTML =
          '<p style="padding:1rem;text-align:center;color:#8a94ab;font-size:.85rem">' +
          "No se pudo cargar este componente (" + name + "). Verifica que el sitio se sirva por HTTP." +
          "</p>";
      });
  }

  function init() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));
    Promise.all(nodes.map(includeOne)).then(function () {
      markActiveNav(document);
      document.dispatchEvent(new CustomEvent("sagmt:layout-ready"));
      flow.log("layout-loader", "layout completo");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
