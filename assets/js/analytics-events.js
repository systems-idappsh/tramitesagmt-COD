/**
 * analytics-events.js
 * Empuja eventos a window.dataLayer para Google Tag Manager.
 *
 * Convención de marcado:
 *   data-ga-event="click_whatsapp"      (nombre de evento)
 *   data-ga-label="hero-cta"            (opcional, para distinguir origen)
 *
 * Eventos cubiertos por el marcado del sitio:
 *   click_whatsapp, click_call, click_email, click_service_card,
 *   click_social_facebook, click_social_instagram, click_social_tiktok,
 *   click_social_youtube, click_social_x, click_map, click_main_cta,
 *   submit_contact_form, scroll_to_section
 */
(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  function pushEvent(eventName, extra) {
    if (!eventName) return;
    var payload = Object.assign({ event: eventName, page_path: window.location.pathname }, extra || {});
    window.dataLayer.push(payload);
    var flow = window.SAGMT && window.SAGMT.flow;
    if (flow) flow.log("analytics", eventName, payload);
  }

  function bindClicks(root) {
    root.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-ga-event]");
      if (!trigger) return;
      pushEvent(trigger.getAttribute("data-ga-event"), {
        label: trigger.getAttribute("data-ga-label") || trigger.textContent.trim().slice(0, 60),
      });
    });
  }

  function bindFormSubmits(root) {
    root.querySelectorAll("form[data-ga-form]").forEach(function (form) {
      form.addEventListener("submit", function () {
        pushEvent(form.getAttribute("data-ga-form"));
      });
    });
  }

  function bindScrollSections(root) {
    var targets = root.querySelectorAll("[data-ga-section]");
    if (!targets.length || !("IntersectionObserver" in window)) return;
    var seen = new Set();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.getAttribute("data-ga-section");
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            pushEvent("scroll_to_section", { section: id });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    targets.forEach(function (t) {
      observer.observe(t);
    });
  }

  function init() {
    bindClicks(document);
    bindFormSubmits(document);
    bindScrollSections(document);
  }

  document.addEventListener("sagmt:layout-ready", init);
  if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }

  window.SAGMT = window.SAGMT || {};
  window.SAGMT.trackEvent = pushEvent;
})();
