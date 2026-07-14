# CONTENT_FLOW — TRÁMITES AGMT

## Flujo de navegación estratégico

```
Home → Servicio específico (#id) → WhatsApp
Home → Servicios → Servicio → Volver al listado / Página anterior
Home → WhatsApp / Llamada / Correo (directo, sin pasos intermedios)
Contacto → Mapa
Contacto → FAQ → WhatsApp
Redes → Red social oficial (nueva pestaña)
```

Sin ciclos sin propósito: ningún enlace regresa a una página general cuando podría llevar directo a la sección específica.

## Jerarquía de encabezados

| Página | H1 | H2 |
|---|---|---|
| `index.html` | Propuesta principal | Servicios principales · Confianza operativa · CTA de contacto |
| `servicios.html` | Servicios profesionales | Uno por cada uno de los 8 servicios |
| `contacto.html` | Contacta con TRÁMITES AGMT | Medios de contacto · Ubicación · Quiénes somos · Preguntas frecuentes |
| `redes.html` | Redes sociales oficiales | Uno por cada red (Facebook, Instagram, TikTok, YouTube, X) |
| Legales | Aviso de privacidad / Términos y condiciones | Secciones internas del documento |

## Componentes reutilizables (`components/`)
`header.html` (incluye `nav.html` anidado), `footer.html`, `whatsapp-float.html`, `cta-contact.html` — inyectados por `assets/js/layout-loader.js` vía `fetch()`. **El sitio debe servirse por HTTP** (GitHub Pages, `python -m http.server`, etc.); no funciona abriendo los archivos directo con `file://`.
