# SEO — TRÁMITES AGMT

## Implementado en cada página
- `<title>` y `<meta name="description">` únicos por página.
- `<link rel="canonical">` con dominio placeholder (`https://dominio.com/`).
- Open Graph completo (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:image:alt`) + `twitter:card summary_large_image`.
- Un solo `<h1>` por página, jerarquía `h2`/`h3` consistente.
- `lang="es"` en `<html>`.
- Imágenes con `alt` descriptivo (no genérico).
- URLs limpias, sin parámetros ni mayúsculas.
- `robots.txt` + `sitemap.xml` con las 6 páginas públicas.

## JSON-LD por página
| Página | Tipos incluidos |
|---|---|
| `index.html` | `Organization`, `WebSite` |
| `servicios.html` | `BreadcrumbList` |
| `contacto.html` | `FAQPage`, `BreadcrumbList` |
| `redes.html` | `BreadcrumbList` |
| `aviso-privacidad.html` / `terminos-condiciones.html` | `WebPage` |

Los archivos en `assets/data/schema/*.json` son la **fuente documental** de estos bloques (para mantenimiento y para una futura generación automática); el JSON-LD que realmente leen los buscadores está inyectado inline en el `<head>` de cada página, porque los motores de búsqueda no ejecutan `fetch()` de forma confiable para datos estructurados.

`local-business.json` existe como plantilla pero **no** está inyectado en ninguna página: falta la dirección real (`addressLocality`, `addressRegion`, `postalCode`, `streetAddress`). Publicar un `LocalBusiness` con dirección inventada sería peor que no publicarlo — se agrega en cuanto el cliente confirme la ubicación.

## SEO internacional
Contenido en español, `areaServed` en el `ContactPoint` de `Organization` cubre PE/MX/VE/US/CA. No se implementa `hreflang` porque el sitio es monolingüe; si se agrega una versión en inglés, ese es el momento de introducirlo.

## Pendiente real antes de producción
- Reemplazar `https://dominio.com/` por el dominio final en **todas** las páginas (canonical, OG, JSON-LD).
- Confirmar dirección física y activar `local-business.json` en `index.html` y `contacto.html`.
- Reemplazar `GTM-XXXXXXX` por el ID real de Google Tag Manager.
