# TESTING.md — Pruebas del portafolio

> Estado (2026-07-20): **108 pruebas unitarias/componente (Vitest) + 50 E2E (Playwright) · todas en verde** · build de producción limpio (incluye type-check del Worker y prerender de las 10 rutas) · CI en GitHub Actions en cada push/PR a `main` · sitio bilingüe (es/en) y copiloto en producción · SEO por idioma (Open Graph + hreflang) prerenderizado · página "Sobre mí" (`/sobre-mi`) con historias personales · **landing de clientes en `/`** (lenguaje no técnico, galería de evidencia, CTA WhatsApp→email).

## Cómo correr las pruebas

```bash
npm test          # suite completa (una pasada)
npm run test:watch  # modo watch durante desarrollo
npm run build     # type-check estricto + build de producción
```

Stack: **Vitest** (runner nativo de Vite) + **React Testing Library** + **jsdom** + **axe-core** (auditoría de accesibilidad).

## CI (GitHub Actions)

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) corre en cada push y pull request a `main` (y manualmente vía `workflow_dispatch`): `npm ci` → `npm run build` (type-check de app + node + Worker, más el build de Vite — el mismo comando que ejecuta Cloudflare Pages en producción) → `npm test`. El badge de estado está en el [README](README.md).

Es un gate de calidad, no el despliegue: Cloudflare Pages despliega por su propia integración de Git al hacer push a `main`, independiente de este workflow.

## Suite automatizada

### 1. `src/data/content.test.ts` — integridad de la fuente única de verdad (25 pruebas)

`content.ts` alimenta la UI hoy y el system prompt del copiloto. Estas pruebas protegen sus invariantes mientras se rellenan los `[[TODO`:

- Existen exactamente los 3 roles (`web`, `it`, `ai`) con slugs únicos y su token de señal correcto.
- IDs de proyecto únicos; todo proyecto y experiencia pertenece a un rol existente.
- **Exactamente un proyecto central (`featured`) por rol** — el layout lo asume.
- Los proyectos del brief existen: `nautylab`, `nucleo`, `copiloto-ia`, `integracion-gemini`, `alexa-skill`; la experiencia IT completa: `ayuntamiento`, `freelance-it`, `liderazgo-operativo`.
- Toda captura declara ruta bajo `/screenshots/` y un `alt` no vacío **en ambos idiomas**.
- `isPending` detecta placeholders; los datos ya confirmados (nombre, email) no lo son.
- **Bilingüe**: cada campo `LocalizedText` (perfil, roles, proyectos, experiencia) trae `es` y `en` no vacíos; los placeholders `[[TODO` quedan sincronizados entre ambos idiomas (nunca pendiente en uno y resuelto en el otro).
- **`about`** (historias de "Sobre mí"): título e intro de la página en ambos idiomas; cada historia trae `heading`/`body` en `es` y `en`; ids de historia únicos.
- **`landing`** (carta de presentación para clientes): exactamente un servicio por rol y en el mismo orden; hero/servicios/confianza/CTA bilingües; toda evidencia con rol válido, ruta bajo `/screenshots/`, alt bilingüe y `src` únicos; si el WhatsApp deja de ser `[[TODO`, debe ser solo dígitos con código de país (11–15).

### 2. `src/components/role/NucleoDemo.test.tsx` — la transacción atómica (5 pruebas)

Con timers reales (la secuencia temporizada ES el contenido de la demo):

| Prueba | Verifica |
|---|---|
| Estado inicial | 3 activos con estado, consola en espera, entrada semilla de auditoría |
| **Transacción exitosa** | Secuencia `BEGIN → UPDATE → INSERT → COMMIT` en consola; el estado cambia **y** la entrada de auditoría queda confirmada (sin "sin confirmar" residual) |
| Bloqueo de concurrencia | Todos los botones deshabilitados durante la transacción, rehabilitados al terminar |
| **Rollback atómico** | Con "forzar error": `ERROR simulado → ROLLBACK → sin cambios parciales`; el activo vuelve a su estado original, la entrada revertida desaparece, el conteo de auditoría queda intacto y el toggle se desarma solo |

### 3. `src/App.test.tsx` — routing, tematización y bilingüismo (23 pruebas)

- Landing en `/` (español) y `/en` (inglés): el `h1` en **lenguaje de cliente** ("Tecnología que trabaja para ti" / "Technology that works for you"), el nombre visible como firma, las 3 tarjetas de servicio enlazando a su página de rol con el prefijo correcto (conservan el nombre técnico como puente), contacto traducido.
- **CTA de la landing**: usa `wa.me` si hay número de WhatsApp; mientras siga `[[TODO`, cae a `mailto:` — verificado contra el estado real del dato, en el hero y en contacto.
- Contacto resiliente: el email real es enlace `mailto:`; los `[[TODO` se muestran como chips inertes, **nunca como enlaces rotos**.
- Por cada rol, en **ambos** árboles de rutas (`/desarrollo-web` y `/en/desarrollo-web`, etc.): renderiza su `h1` traducido, fija `--focus-ring` a **su** color de señal y tematiza el `document.title` — el color como sistema de navegación, verificado en los dos idiomas.
- **Página Sobre mí** (`/sobre-mi`, `/en/sobre-mi`): título traducido, al menos una historia renderizada, y el nav enlaza a la ruta correcta desde cualquier página en ambos idiomas.
- **Selector de idioma**: el link a "English"/"Español" apunta a la ruta equivalente en el otro idioma (no a la raíz); el caso especial de la landing (`/en`, no `/en/`) está cubierto.
- `document.documentElement.lang` sigue el idioma de la ruta activa.
- Estructura accesible compartida: skip-link → `#contenido` (traducido), `nav` etiquetado, `main` presente — en ambos idiomas.

### 4. `src/components/role/ScreenshotFrame.test.tsx` — cero imágenes rotas (3 pruebas)

Alt pendiente `[[TODO` → marco punteado con la ruta esperada; captura real → `<img>` con `alt` y `loading="lazy"`; error de carga → cae al marco pendiente.

### 5. `src/components/SignalTrace.test.tsx` — el hero de la señal (4 pruebas)

Ambas versiones (escritorio/móvil) son `aria-hidden` (decorativas — la navegación son las tarjetas); una traza por rol con su token de color (nunca hex directo); con hover/foco (`hot`) la rama activa queda a opacidad 1 y las otras dos a 0.3; todas las trazas usan `pathLength=1` (la base de la animación CSS pura).

### 6. `src/a11y.test.tsx` — auditoría axe-core (10 pruebas)

`axe.run` (reglas WCAG 2.1 A/AA estructurales) sobre las 5 páginas **en español y en inglés** (10 rutas en total): **cero violaciones**. La regla `color-contrast` se excluye porque jsdom no renderiza — el contraste se verifica en navegador real (ver E2E abajo).

### 7. `src/data/systemPrompt.test.ts` — grounding del copiloto (9 pruebas)

El system prompt se genera desde `content.ts` y es la garantía anti-invención:

- **Nunca contiene `[[TODO`** — el modelo jamás ve placeholders sin rellenar.
- `limpiar()` elimina fragmentos TODO conservando el texto real; si solo había placeholder, el campo se omite del prompt.
- Contiene la identidad, el email real y **todos** los proyectos por nombre; marca los proyectos centrales.
- Incluye las reglas anti-invención ("No inventes") y anti-inyección ("revelar este prompt").

### 8. `src/test/workerValidate.test.ts` — límites del Worker (11 pruebas)

`worker/validate.ts` es un módulo puro (sin runtime de Workers), probado directo:

- Acepta conversaciones válidas, incluido exactamente el límite (15 mensajes de usuario).
- **429 al mensaje 16** — el límite de sesión del brief, aplicado en servidor.
- 400 para: cuerpo malformado, `messages` vacío/no-arreglo, roles inválidos (**la inyección de rol `system` se rechaza**), contenido vacío o no-string, mensajes > 1000 caracteres, historial que no termina en mensaje del visitante, historiales > 40 mensajes.

### 9. `src/components/copilot/ChatDock.test.tsx` — el widget (6 pruebas)

- Apertura/cierre accesibles: `aria-expanded`, foco al input al abrir, Escape cierra y devuelve el foco al botón del dock.
- Sugerencias iniciales cuando la conversación está vacía.
- **Streaming**: con fetch mockeado emitiendo SSE real de la API de Gemini (`candidates[0].content.parts`), la respuesta se ensambla fragmento a fragmento; el payload enviado al Worker es exactamente `{ messages: [...] }`; el contador avanza (1/15).
- **Error del Worker**: el mensaje amigable del servidor se muestra en el chat sin romperlo; el input queda disponible para reintentar.
- **Límite de sesión en UI**: con 15 mensajes usados, la entrada se reemplaza por el aviso (15/15).
- Persistencia: la conversación sobrevive en `sessionStorage` entre montajes.

## Bilingüismo (es/en)

Arquitectura: `src/i18n/locale.ts` (contexto de idioma, sin JSX — lo importan tanto la app como `content.ts`/`systemPrompt.ts`, que el Worker también compila) + `src/i18n/ui.ts` (diccionario del chrome de interfaz que no vive en `content.ts`: la demo de Núcleo, el copiloto, encabezados de sección). Cada campo de prosa en `content.ts` es `LocalizedText = { es: string; en: string }`.

**Ruteo con rutas separadas por idioma** (`/en/desarrollo-web` vs `/desarrollo-web`), no un toggle con localStorage — decisión explícita: cada página tiene un link compartible en su idioma, sobrevive a recarga/incógnito, y permite mandarle a un reclutador angloparlante la URL exacta en inglés. El costo es duplicar el árbol de rutas en `App.tsx` (dos `<Route>` completos, cada uno envuelto en su `LocaleProvider`) y parametrizar los tests que antes solo cubrían español.

El **system prompt del copiloto se genera siempre desde el español canónico** (`systemPrompt.ts`): los hechos no cambian entre idiomas, y la regla 4 del prompt ya le pide al modelo responder en el idioma del visitante — traducir el prompt no añade grounding, solo duplicaría mantenimiento. El copiloto responde en inglés si le escriben en inglés, sin importar en qué idioma esté el sitio; solo el chrome del widget (botones, sugerencias, placeholders) sigue el idioma de la ruta.

Los fragmentos con forma de SQL en la consola de la demo de Núcleo (`BEGIN TRANSACTION`, `UPDATE...`, `COMMIT`) se dejan **idénticos en ambos idiomas** a propósito — representan código/salida de consola, no prosa.

## Contraste AA — verificación numérica de tokens

Calculado con la fórmula de luminancia relativa WCAG (mínimo AA texto normal: 4.5:1):

| Token | vs `--ink` #0B0D12 | vs `--surface` #12151C | AA |
|---|---|---|---|
| `--text` #E7E9F0 | 16.02 | 15.06 | ✅ |
| `--text-muted` #868DA8 | 5.91 | 5.77 | ✅ |
| `--signal-web` #5B8DEF | 6.02 | 5.65 | ✅ |
| `--signal-it` #E8A23D | 8.95 | 8.41 | ✅ |
| `--signal-ai` #4FD1C5 | 10.42 | 9.79 | ✅ |
| `--danger` #EF6A6A | 6.42 | 6.04 | ✅ |

**Regresión de Fase 6**: la auditoría axe en navegador real (ver E2E abajo) reveló que el `--text-muted` anterior (#7A8099) fallaba AA — 3.89–4.45:1 — cuando caía sobre los **paneles tenues de señal** (`bgSoft`, ej. `bg-signal-ai/…` computado a `#18282d`), no solo sobre `--ink`/`--surface`. jsdom no lo detecta porque no renderiza. Se subió a **#868DA8**, que clarea 4.5:1 sobre el panel tenue más claro (peor caso 4.63:1) y mejora sobre ink/surface. Como solo aumenta el contraste sobre fondos oscuros, ningún combo que ya pasaba regresa.

## Verificación manual en navegador (Fases 2–4)

Realizada sobre `npm run dev` en Chrome (panel integrado), documentada por fase:

- **Geometría del hero**: los 3 pads terminales de la traza alineados con el centro de su tarjeta — error medido: **0.01px** a 1280px de viewport.
- **Responsive**: a 375px el SVG de escritorio se oculta, aparece el conector vertical degradado, **sin overflow horizontal**.
- **Tematización por rol**: `--focus-ring` medido en runtime = `#e8a23d` en /servicios-it, `#4fd1c5` en /ia-automatizacion; `h1` en el color de señal correspondiente.
- **Demo de Núcleo E2E** (clics reales): transacción exitosa → badge actualizado + entrada de auditoría con timestamp real; rollback forzado → activo revertido a su estado exacto anterior, entrada eliminada, toggle desarmado.
- **Consola del navegador**: limpia (cero errores) en las 4 rutas.
- **Fuentes y tokens**: `body` computado = IBM Plex Sans sobre `rgb(11,13,18)`; trazas con `var(--color-signal-*)`.

## Cobertura de reduced-motion (por diseño, verificado en código)

Regla global colapsa animaciones de entrada a su estado final; los bucles infinitos (`trace-pulse`, `node-ring`) se **ocultan** explícitamente (un frame congelado sería ruido visual). El sitio queda completo y estático.

## Verificación en vivo del Worker (Fase 5)

Con `wrangler dev` local (sin API key) y `curl` directo al endpoint, más el pipeline completo desde la UI (widget → proxy de Vite → Worker):

| Petición | Respuesta verificada |
|---|---|
| 16 mensajes de usuario | **HTTP 429** — "Límite de sesión alcanzado (15 mensajes)…" |
| Rol `system` inyectado en el historial | **HTTP 400** — "Rol inválido: solo 'user' o 'assistant'." |
| Petición válida sin secret configurado | **HTTP 503** — mensaje claro de "no configurado" |
| Desde el widget (clic en sugerencia) | El error del Worker aparece como mensaje amigable en el chat, contador 1/15 |

El camino con API real (streaming de Gemini end-to-end) queda pendiente de la API key del usuario — el parseo SSE del cliente está cubierto por tests con stream mockeado en formato real de la API.

## Suite E2E (Playwright)

`e2e/` contiene 50 pruebas en navegador real (Chromium) que complementan la suite de Vitest — jsdom no renderiza de verdad, así que layout, contraste computado y el flujo completo por red del copiloto solo se pueden verificar aquí.

```bash
npm run test:e2e        # suite completa, headless
npm run test:e2e:ui     # modo interactivo (Playwright UI)
```

| Archivo | Qué prueba |
|---|---|
| `e2e/navigation.spec.ts` (10) | Landing en español e inglés con las 3 tarjetas de rol traducidas; por cada rol y cada idioma (6 rutas), el encabezado correcto y `--focus-ring` resuelto al hex exacto de su color de señal — verificado en un navegador real que sí computa CSS custom properties anidadas (jsdom no); la página Sobre mí accesible desde el nav en ambos idiomas; el selector de idioma conserva la página actual al cambiar; `<html lang>` sigue el idioma activo |
| `e2e/nucleo-demo.spec.ts` (3) | El mismo flujo de la demo transaccional verificado manualmente durante el desarrollo, ahora automatizado en español: COMMIT actualiza estado + auditoría; rollback forzado revierte ambos juntos y desarma el toggle; una pasada en inglés confirma que el flujo real por navegador no se rompe con el idioma |
| `e2e/copilot.spec.ts` (4) | Abrir el dock, enviar una pregunta y ver la respuesta streameada — con la red mockeada usando el formato SSE real de Gemini (CRLF, `\r\n\r\n`) como segunda línea de defensa contra la regresión de línea de comando descrita arriba; manejo de error del Worker; cierre con Escape devolviendo el foco; una pasada en `/en` confirma que el chrome del widget (botones, sugerencias) se traduce |
| `e2e/landing.spec.ts` (1) | **Cero imágenes rotas en la galería de evidencia** — disk-agnostic a propósito: las fotos pendientes usan rutas reales que aún no existen en `/public`, el servidor responde con el fallback SPA (200 + HTML, no 404), el `<img>` falla al decodificar y `ScreenshotFrame` cae al marco punteado. Cada figura debe estabilizarse en imagen cargada o marco pendiente, sin importar qué archivos existan el día que corra; al menos una real (Nautylab) debe cargar |
| `e2e/a11y-contrast.spec.ts` (30) | **Contraste WCAG AA en navegador real** (axe-core con solo la regla `color-contrast`) sobre las 10 rutas — lo que la suite de jsdom no puede computar; atrapó el fallo de `--text-muted` sobre los paneles de señal. Además, por cada ruta, **cero desbordamiento horizontal** a 375px (móvil) y 1280px (escritorio) — regresión de layout del inglés (textos más largos) sin diffs de píxeles, estable entre SO/CI |

Corre como job separado en CI (`e2e` en `.github/workflows/ci.yml`), en paralelo al de Vitest — instala Chromium y sube el reporte HTML como artefacto si algo falla.

**Sanity check aplicado**: antes de dar por buena la suite, rompí a propósito una aserción (`ring: "#000000"` en vez del hex real) y confirmé que el test falla con el mensaje esperado, no que pase en falso — misma disciplina que se usó para verificar el fix de CRLF.

## SEO por idioma (Fase 6)

`src/seo/meta.ts` es la fuente única del `<head>` por ruta (título, descripción, canonical, Open Graph, Twitter Card, hreflang es/en/x-default). La consumen DOS lados con el mismo cálculo:

- **En cliente**: el hook `useHeadMeta()` (en `Layout`) actualiza el `<head>` al navegar sin recarga — para Google, que sí ejecuta JS.
- **En build**: `scripts/prerender.mjs` congela esas etiquetas en HTML estático por ruta (`dist/<ruta>/index.html`) tras `vite build`, usando la API de Vite (`ssrLoadModule`) sin navegador ni dependencias nuevas. Necesario porque los scrapers sociales (Facebook, LinkedIn, WhatsApp) **no ejecutan JS** y solo verían el `index.html` base. También emite `dist/sitemap.xml` (referenciado en `robots.txt`) con las **10 rutas** (home + 3 roles + `/sobre-mi`, × es/en).

La imagen de previsualización de marca (`public/og-image.png`, 1200×630) se genera con `npm run og-image` (`scripts/gen-og-image.mjs`, reutiliza el Chromium de Playwright) — asset estático commiteado, fuera del build de producción. Invariantes cubiertas por `src/seo/meta.test.ts` (13 pruebas): 10 rutas únicas, título/descripción localizados (incluida la página Sobre mí), canonical/alternates absolutos y coherentes es↔en, y serialización HTML sin fugas de comillas.

## Landing de clientes (`/`)

La raíz dejó de ser el portafolio técnico: es la **carta de presentación para clientes** (empresas e individuos no técnicos). Decisiones:

- **Lenguaje de beneficio, no de ingeniería** — `landing` en `src/data/content.ts`: hero ("Tecnología que trabaja para ti"), 3 tarjetas de servicio en lenguaje cliente que conservan el nombre técnico del rol como puente hacia su página (donde vive la profundidad para reclutadores), galería de evidencia, bullets de confianza y el copiloto como demo viviente.
- **CTA WhatsApp con fallback** — `profile.contact.whatsapp` (solo dígitos con código de país); mientras siga `[[TODO`, ambos CTAs (hero y contacto) caen a `mailto:` automáticamente.
- **Galería rellenable sin código** — cada evidencia usa la ruta real esperada (`/screenshots/mantenimiento-1.jpg`, `redes-1.jpg`, `nucleo-1.png`, `inventario-1.png`, `gemini-integracion-1.png`); al soltar el archivo en `public/screenshots/` la foto aparece sola. Mientras tanto, `ScreenshotFrame` muestra el marco punteado con la ruta esperada.
- El **SEO de la home** (description/OG) usa `landing.hero.sub` — quien comparta el link con un cliente ve la oferta, no jerga técnica.

## Página "Sobre mí" (`/sobre-mi`, `/en/sobre-mi`)

Página dedicada — no una sección expandible del home — para mantener la convención ya establecida de un link compartible por idioma y encajar directo con la infraestructura de SEO de Fase 6 (ruteo, `useHeadMeta`, prerender). El home conserva un resumen corto de `profile.intro` con un link "Leer más →" hacia esta página. El contenido narrativo (`about` en `src/data/content.ts`) son historias personales concretas — no relleno genérico — cubiertas por `content.test.ts` (bilingüismo, ids únicos) y renderizadas sin theming de rol (sin color de señal, es contenido transversal a las tres capas).

## Lighthouse — pase manual (Fase 6, 2026-07-20)

Corrido contra el **build de producción** (`npm run build` → `vite preview`, HTML prerenderizado), en Chromium headless. Ejecución manual, no cableada a CI:

| Ruta | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` (home es) | 92 | 100 | 100 | 100 |
| `/ia-automatizacion` (rol, la más pesada) | 99 | 100 | 100 | 100 |

Métricas de la home: FCP 1.7s · **LCP 2.6s** · **TBT 0ms** · **CLS 0** · Speed Index 5.3s. Todo verde (≥90). Único aspecto mejorable: la hoja de estilos de Google Fonts es *render-blocking* (afecta LCP/Speed Index) — no se cambió porque las tipografías (Space Grotesk / IBM Plex) son decisión de diseño fija y volverlas no-bloqueantes puede causar FOUT en el primer paint; queda como palanca opcional a discreción del usuario.

## Huecos conocidos (pendientes)

- **Lighthouse en CI**: el pase es manual; cablearlo como job (`@lhci/cli` + presupuestos) queda como opción futura (dependencia + tiempo de CI).
- Los E2E de Playwright corren solo en Chromium — Firefox/WebKit quedan para cuando el proyecto lo justifique.
- Sin regresión visual por diffs de píxeles: se optó por aserciones de no-desbordamiento (estables entre SO) en vez de snapshots, que son frágiles entre Windows local y el CI en Linux.
