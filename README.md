# TRÁMITES AGMT — Sitio web

Sitio web modular, estático (HTML/CSS/JS vanilla, sin frameworks ni build step), para TRÁMITES AGMT: asesoría y gestión de visas, pasaportes y trámites internacionales.

## Estructura

```
agmt-web/
├── index.html, servicios.html, contacto.html, redes.html
├── aviso-privacidad.html, terminos-condiciones.html
├── robots.txt, sitemap.xml, manifest.webmanifest, browserconfig.xml
├── assets/
│   ├── css/        base.css, layout.css, components.css, pages.css, responsive.css
│   ├── js/         main.js, layout-loader.js, navigation.js, contact.js,
│   │                analytics-events.js, service-carousel.js, slider.js, console-flow.js
│   ├── img/        hero/, brand/, og/  (services/ y social/ sin uso: los íconos
│   │                de servicio y redes son SVG inline, no fotografías)
│   ├── icons/       favicon.ico/.svg, apple-touch-icon, android-chrome 192/512, mask-icon
│   └── data/schema/ organization.json, website.json, local-business.json,
│                     services.json, faq.json, breadcrumbs.json  (fuente documental
│                     del JSON-LD; el JSON-LD real va inline en cada <head>)
├── components/      header.html, nav.html, footer.html, whatsapp-float.html, cta-contact.html
└── docs/            SEO.md, PWA.md, LEGAL.md, CONTENT_FLOW.md
```

## Cómo ejecutarlo

Los componentes se cargan con `fetch()` (`layout-loader.js`), así que el sitio **debe servirse por HTTP**, no abrirse con `file://`.

```bash
cd agmt-web
python3 -m http.server 4173
# abrir http://127.0.0.1:4173/
```

O súbelo tal cual a GitHub Pages / Netlify / cualquier hosting estático.

## Datos oficiales usados

- WhatsApp / llamada: `+51 977 786 260`
- Correo oficial: `tramitesagmt@gmail.com` · Correo administrativo: `contacto.sagmt@gmail.com`
- Redes: Facebook, Instagram, X, TikTok (`@tramitesagmtl`), YouTube — todas enlazadas en `redes.html` y en el footer.

## Decisiones de diseño relevantes

- **Responsive fluido, no por bloques**: tipografía y espaciado con `clamp()`, grids con `auto-fit`/`minmax()`, y container queries reales en `contact-grid` y `service-index` (`responsive.css`). El único cambio de *estructura* (no de escala) ocurre en el header (menú móvil) y en el hero/about, que pasan de dos columnas a una cuando ya no caben cómodas.
- **Service Cards Coverflow Carousel**: tarjeta activa centrada y destacada, sin apilado tipo lista en móvil. Ver `service-carousel.js` + clases `.service-*` en `components.css`.
- **Sin slider de imágenes en el hero**: el diseño aprobado por el cliente usa una sola imagen fija (`img1_cliente_quiere.webp`). `slider.js` existe y funciona, pero no está conectado a ninguna página; queda disponible para testimonios o banners futuros.
- **Íconos de servicio y redes**: SVG inline dibujados para este proyecto (línea, 24×24), no fotografías de stock ni logos de terceros reproducidos — evita problemas de licencias y mantiene consistencia visual.

## Pendiente real antes de producción

| Pendiente | Dónde |
|---|---|
| ID real de Google Tag Manager (hoy `GTM-XXXXXXX`) | `<head>` de las 6 páginas |
| Dominio final (hoy `https://dominio.com/`) | canonical, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt` |
| Dirección física real para el mapa y `LocalBusiness` | `contacto.html` (iframe) + `assets/data/schema/local-business.json` |
| Aprobación legal de aviso de privacidad / términos | `docs/LEGAL.md` |
| Imágenes finales de campaña (si se quiere reemplazar la actual) | `assets/img/hero/` |

Ninguno de estos pendientes rompe el sitio: todo funciona hoy con datos reales confirmados por el cliente (contacto, redes) y placeholders explícitamente documentados donde el dato aún no existe (dominio, GTM ID, dirección).
