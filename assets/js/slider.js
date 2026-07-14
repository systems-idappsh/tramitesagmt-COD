/**
 * slider.js
 * Slider horizontal genérico con auto-avance, dots y pausa en interacción.
 * No está conectado al hero de Home en esta versión: el diseño aprobado
 * usa una sola imagen fija (ver CHANGELOG). Queda disponible para banners
 * o testimonios futuros — se activa solo si existe `[data-slider]` en la
 * página.
 *
 * Marcado esperado:
 *   <div data-slider data-slider-interval="4000">
 *     <div data-slider-track>
 *       <div class="slide">...</div>
 *       <div class="slide">...</div>
 *     </div>
 *     <div data-slider-dots></div>
 *   </div>
 */
(function () {
  "use strict";

  function createSlider(root) {
    var track = root.querySelector("[data-slider-track]");
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    if (!track || slides.length < 2) return;

    var dotsWrap = root.querySelector("[data-slider-dots]");
    var interval = parseInt(root.getAttribute("data-slider-interval"), 10) || 4000;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var index = 0;
    var timer = null;

    function render() {
      track.style.transform = "translateX(calc(-" + index * 100 + "% - " + index + "rem))";
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
          dot.setAttribute("aria-current", i === index ? "true" : "false");
        });
      }
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }

    function next() {
      goTo(index + 1);
    }

    function start() {
      if (reduceMotion || timer) return;
      timer = window.setInterval(next, interval);
    }

    function stop() {
      window.clearInterval(timer);
      timer = null;
    }

    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Ir a la diapositiva " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
          stop();
          start();
        });
        dotsWrap.appendChild(dot);
      });
    }

    root.addEventListener("pointerenter", stop);
    root.addEventListener("pointerleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    render();
    start();
  }

  function init() {
    document.querySelectorAll("[data-slider]").forEach(createSlider);
  }

  document.addEventListener("sagmt:layout-ready", init);
  if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
