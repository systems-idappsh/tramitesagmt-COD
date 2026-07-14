/**
 * service-carousel.js
 * Coverflow: tarjeta activa centrada y destacada, laterales atenuadas.
 * Navegación por flechas, teclado, arrastre táctil/mouse y dots.
 * Se activa solo si existe `[data-service-carousel]` en la página.
 */
(function () {
  "use strict";

  var SELECTORS = {
    root: "[data-service-carousel]",
    viewport: "[data-service-viewport]",
    track: "[data-service-track]",
    card: "[data-service-card]",
    prev: "[data-service-prev]",
    next: "[data-service-next]",
    dots: "[data-service-dots]",
    status: "[data-service-status]",
  };

  var DRAG_THRESHOLD_RATIO = 0.16;
  var MOBILE_BREAKPOINT = 640;

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function ServiceCarousel(root) {
    this.root = root;
    this.viewport = root.querySelector(SELECTORS.viewport);
    this.track = root.querySelector(SELECTORS.track);
    this.cards = Array.prototype.slice.call(root.querySelectorAll(SELECTORS.card));
    this.prevBtn = root.querySelector(SELECTORS.prev);
    this.nextBtn = root.querySelector(SELECTORS.next);
    this.dotsWrap = root.parentElement.querySelector(SELECTORS.dots);
    this.statusEl = root.parentElement.querySelector(SELECTORS.status);

    if (!this.viewport || !this.track || this.cards.length === 0) return;

    this.activeIndex = 0;
    this.cardWidth = 200;
    this.cardHeight = 300;
    this.step = 140;
    this.maxVisible = 2;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragDeltaX = 0;

    this._onResize = this._onResize.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    this._buildDots();
    this._bindEvents();
    this._measure();
    this._render(false);
  }

  ServiceCarousel.prototype._measure = function () {
    var w = this.viewport.clientWidth || window.innerWidth;
    var isMobile = w < MOBILE_BREAKPOINT;

    if (isMobile) {
      this.cardWidth = Math.round(Math.min(280, w * 0.72));
      this.step = Math.round(this.cardWidth * 0.9);
      this.maxVisible = 1;
    } else {
      this.cardWidth = Math.round(Math.min(230, Math.max(180, w * 0.16)));
      this.step = Math.round(this.cardWidth * 0.72);
      this.maxVisible = 2;
    }
    this.cardHeight = Math.round(this.cardWidth * 1.42);

    this.root.style.setProperty("--svc-card-w", this.cardWidth + "px");
    this.root.style.setProperty("--svc-card-h", this.cardHeight + "px");
  };

  ServiceCarousel.prototype._render = function (animate) {
    var reduce = reducedMotion();
    var self = this;

    this.cards.forEach(function (card, i) {
      var diff = i - self.activeIndex;
      var abs = Math.abs(diff);
      var isActive = diff === 0;
      var visible = abs <= self.maxVisible + 1;

      var tx = diff * self.step;
      var scale = isActive ? 1 : Math.max(0.72, 1 - abs * 0.14);
      var opacity = !visible ? 0 : isActive ? 1 : Math.max(0.3, 1 - abs * 0.34);

      card.style.transitionDuration = !animate || reduce ? "0.01ms" : "";
      card.style.transform = "translate(-50%, -50%) translateX(" + tx + "px) scale(" + scale + ")";
      card.style.opacity = String(opacity);
      card.style.zIndex = String(100 - abs);
      card.style.pointerEvents = abs > self.maxVisible ? "none" : "auto";
      card.classList.toggle("is-active", isActive);

      var link = card.querySelector(".service-card__link");
      if (link) {
        link.setAttribute("tabindex", isActive ? "0" : "-1");
        link.setAttribute("aria-hidden", isActive ? "false" : "true");
      }
    });

    this._updateDots();
    this._updateNavState();
    this._announce();
  };

  ServiceCarousel.prototype.goTo = function (index, animate) {
    var clamped = Math.max(0, Math.min(this.cards.length - 1, index));
    this.activeIndex = clamped;
    this._render(animate !== false);
  };

  ServiceCarousel.prototype.next = function () {
    this.goTo(this.activeIndex + 1);
  };

  ServiceCarousel.prototype.prev = function () {
    this.goTo(this.activeIndex - 1);
  };

  ServiceCarousel.prototype._updateNavState = function () {
    if (this.prevBtn) this.prevBtn.disabled = this.activeIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.activeIndex === this.cards.length - 1;
  };

  ServiceCarousel.prototype._announce = function () {
    if (!this.statusEl) return;
    var active = this.cards[this.activeIndex];
    var title = active && active.querySelector(".service-card__title");
    if (title) {
      this.statusEl.textContent =
        "Mostrando servicio " + (this.activeIndex + 1) + " de " + this.cards.length + ": " + title.textContent.trim();
    }
  };

  ServiceCarousel.prototype._buildDots = function () {
    if (!this.dotsWrap) return;
    this.dotsWrap.innerHTML = "";
    var self = this;
    this.dots = this.cards.map(function (card, i) {
      var titleEl = card.querySelector(".service-card__title");
      var label = titleEl ? titleEl.textContent.trim() : "Servicio " + (i + 1);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "service-dot";
      btn.setAttribute("aria-label", "Ir a " + label);
      btn.addEventListener("click", function () {
        self.goTo(i);
      });
      self.dotsWrap.appendChild(btn);
      return btn;
    });
  };

  ServiceCarousel.prototype._updateDots = function () {
    if (!this.dots) return;
    var self = this;
    this.dots.forEach(function (dot, i) {
      var active = i === self.activeIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
  };

  ServiceCarousel.prototype._bindEvents = function () {
    var self = this;
    if (this.prevBtn) this.prevBtn.addEventListener("click", function () { self.prev(); });
    if (this.nextBtn) this.nextBtn.addEventListener("click", function () { self.next(); });

    this.viewport.addEventListener("keydown", this._onKeydown);
    this.viewport.addEventListener("pointerdown", this._onPointerDown);
    window.addEventListener("pointermove", this._onPointerMove, { passive: true });
    window.addEventListener("pointerup", this._onPointerUp);
    window.addEventListener("pointercancel", this._onPointerUp);

    this.cards.forEach(function (card, i) {
      var link = card.querySelector(".service-card__link");
      if (!link) return;
      link.addEventListener("click", function (event) {
        if (self.isDragging) {
          event.preventDefault();
          return;
        }
        if (i !== self.activeIndex) {
          event.preventDefault();
          self.goTo(i);
        }
      });
    });

    if ("ResizeObserver" in window) {
      this._resizeObserver = new ResizeObserver(function () { self._onResize(); });
      this._resizeObserver.observe(this.viewport);
    } else {
      window.addEventListener("resize", this._onResize);
    }
  };

  ServiceCarousel.prototype._onResize = function () {
    var self = this;
    if (this._resizeRaf) cancelAnimationFrame(this._resizeRaf);
    this._resizeRaf = requestAnimationFrame(function () {
      self._measure();
      self._render(false);
    });
  };

  ServiceCarousel.prototype._onKeydown = function (event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.prev();
    } else if (event.key === "Home") {
      event.preventDefault();
      this.goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      this.goTo(this.cards.length - 1);
    }
  };

  ServiceCarousel.prototype._onPointerDown = function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragDeltaX = 0;
    this.viewport.classList.add("is-dragging");
  };

  ServiceCarousel.prototype._onPointerMove = function (event) {
    if (!this.isDragging) return;
    this.dragDeltaX = event.clientX - this.dragStartX;
  };

  ServiceCarousel.prototype._onPointerUp = function () {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.viewport.classList.remove("is-dragging");

    var threshold = this.cardWidth * DRAG_THRESHOLD_RATIO;
    if (this.dragDeltaX <= -threshold) {
      this.next();
    } else if (this.dragDeltaX >= threshold) {
      this.prev();
    } else {
      this._render(true);
    }
    this.dragDeltaX = 0;
  };

  function init() {
    document.querySelectorAll(SELECTORS.root).forEach(function (root) {
      if (root.dataset.svcInit) return;
      root.dataset.svcInit = "1";
      new ServiceCarousel(root);
    });
  }

  document.addEventListener("sagmt:layout-ready", init);
  if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }

  window.SAGMT = window.SAGMT || {};
  window.SAGMT.ServiceCarousel = ServiceCarousel;
})();
