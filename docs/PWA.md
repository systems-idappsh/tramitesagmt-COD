# PWA — TRÁMITES AGMT

## Archivos
- `manifest.webmanifest`: nombre, colores, `display: standalone`, íconos 192/512.
- `assets/icons/favicon.ico` (multi-tamaño 16/32/48/64), `favicon.svg`, `apple-touch-icon.png` (180×180, fondo navy sólido), `mask-icon.svg` (Safari pinned tab), `android-chrome-192x192.png`, `android-chrome-512x512.png`.
- `browserconfig.xml` para tiles de Windows/Edge.

Todos los íconos se generaron a partir del logo real del cliente (`originalAGMT.png`), no son placeholders.

## Theme color
`#071429` (navy de marca) en `<meta name="theme-color">`, `manifest.webmanifest` y `browserconfig.xml` — consistente en los tres lugares.

## Qué falta para "instalable" completo
El sitio cumple los requisitos técnicos de manifest + iconos, pero para que el navegador ofrezca "Agregar a pantalla de inicio" de forma confiable también se recomienda:
- Service worker con estrategia de caché (no incluido en esta versión: el sitio es informativo/contacto, no requiere uso offline).
- Servir sobre HTTPS en producción (GitHub Pages y la mayoría de hosts ya lo hacen por defecto).
