# Changelog

## [1.0.0] — Construcción completa

### Added
- 6 páginas HTML completas: `index`, `servicios` (8 secciones ancladas), `contacto`, `redes`, `aviso-privacidad`, `terminos-condiciones`.
- Sistema de componentes reutilizables vía `fetch()`: `header` (incluye `nav` anidado), `footer`, `whatsapp-float`, `cta-contact`.
- `Service Cards Coverflow Carousel` (`service-carousel.js` + `components.css`): tarjeta activa centrada/destacada, navegación por flechas, teclado, arrastre táctil/mouse y dots.
- CSS fluido: `clamp()` para tipografía y espaciado, `grid auto-fit/minmax` para tarjetas y footer, container queries reales en `contact-grid` y `service-index`.
- JS modular: `main`, `layout-loader`, `navigation`, `contact`, `analytics-events`, `service-carousel`, `slider` (disponible, no conectado), `console-flow`.
- SEO/PWA completos: `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `browserconfig.xml`, favicon multi-formato, íconos PWA generados desde el logo real del cliente, Open Graph + Twitter Card, JSON-LD (`Organization`, `WebSite`, `FAQPage`, `BreadcrumbList`, `WebPage`) inline por página.
- Assets reales: logo, imagen de hero (WebP + variante mobile), imagen Open Graph — generados desde los archivos subidos por el cliente (`originalAGMT.png`, `img1_cliente_quiere.jpg`).
- Documentación en `docs/`: `SEO.md`, `PWA.md`, `LEGAL.md`, `CONTENT_FLOW.md`.

### Fixed (respecto a huecos detectados en auditoría previa)
- `apple-touch-icon.png`, `android-chrome-192x192.png` y `android-chrome-512x512.png` ahora existen y están enlazados (antes rotos).
- `components/nav.html` ahora existe como archivo separado, incluido anidado dentro de `header.html`.
- El JSON-LD de `assets/data/schema/*.json` ahora tiene una copia funcional inyectada inline en cada página (los buscadores no ejecutan `fetch()` para datos estructurados).

### Known limitations (documentadas, no ocultas)
- `GTM-XXXXXXX` es un placeholder — pendiente ID real.
- `local-business.json` no está inyectado en ninguna página: falta dirección física confirmada.
- El mapa de `contacto.html` usa "México" como ubicación temporal.
- El dominio usado en canonical/OG/sitemap es `https://dominio.com/` — reemplazar antes de publicar.
