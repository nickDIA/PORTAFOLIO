# TESTING.md — Pruebas del portafolio

> Estado al cierre de la Fase 5 (2026-07-15): **62 pruebas · 9 archivos · todas en verde** · build de producción limpio (incluye type-check del Worker).

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

### 1. `src/data/content.test.ts` — integridad de la fuente única de verdad (12 pruebas)

`content.ts` alimenta la UI hoy y el system prompt del copiloto en la Fase 5. Estas pruebas protegen sus invariantes mientras se rellenan los `[[TODO`:

- Existen exactamente las 3 facetas (`web`, `it`, `ai`) con slugs únicos y su token de señal correcto.
- IDs de proyecto únicos; todo proyecto y experiencia pertenece a una faceta existente.
- **Exactamente un proyecto central (`featured`) por faceta** — el layout lo asume.
- Los proyectos del brief existen: `nautylab`, `nucleo`, `copiloto-ia`, `integracion-gemini`, `alexa-skill`; la experiencia IT completa: `ayuntamiento`, `freelance-it`, `liderazgo-operativo`.
- Toda captura declara ruta bajo `/screenshots/` y un `alt` no vacío.
- `isPending` detecta placeholders; los datos ya confirmados (nombre, email) no lo son.

### 2. `src/components/facet/NucleoDemo.test.tsx` — la transacción atómica (5 pruebas)

Con timers reales (la secuencia temporizada ES el contenido de la demo):

| Prueba | Verifica |
|---|---|
| Estado inicial | 3 activos con estado, consola en espera, entrada semilla de auditoría |
| **Transacción exitosa** | Secuencia `BEGIN → UPDATE → INSERT → COMMIT` en consola; el estado cambia **y** la entrada de auditoría queda confirmada (sin "sin confirmar" residual) |
| Bloqueo de concurrencia | Todos los botones deshabilitados durante la transacción, rehabilitados al terminar |
| **Rollback atómico** | Con "forzar error": `ERROR simulado → ROLLBACK → sin cambios parciales`; el activo vuelve a su estado original, la entrada revertida desaparece, el conteo de auditoría queda intacto y el toggle se desarma solo |

### 3. `src/App.test.tsx` — routing y tematización (6 pruebas)

- Landing: nombre, las 3 tarjetas de faceta enlazando a su ruta, sección de contacto.
- Contacto resiliente: el email real es enlace `mailto:`; los `[[TODO` se muestran como chips inertes, **nunca como enlaces rotos**.
- Por cada faceta: renderiza su `h1`, fija `--focus-ring` a **su** color de señal y tematiza el `document.title` — el color como sistema de navegación, verificado.
- Estructura accesible compartida: skip-link → `#contenido`, `nav` etiquetado, `main` presente.

### 4. `src/components/facet/ScreenshotFrame.test.tsx` — cero imágenes rotas (3 pruebas)

Alt pendiente `[[TODO` → marco punteado con la ruta esperada; captura real → `<img>` con `alt` y `loading="lazy"`; error de carga → cae al marco pendiente.

### 5. `src/components/SignalTrace.test.tsx` — el hero de la señal (4 pruebas)

Ambas versiones (escritorio/móvil) son `aria-hidden` (decorativas — la navegación son las tarjetas); una traza por faceta con su token de color (nunca hex directo); con hover/foco (`hot`) la rama activa queda a opacidad 1 y las otras dos a 0.3; todas las trazas usan `pathLength=1` (la base de la animación CSS pura).

### 6. `src/a11y.test.tsx` — auditoría axe-core (4 pruebas)

`axe.run` (reglas WCAG 2.1 A/AA estructurales) sobre las 4 páginas: **cero violaciones**. La regla `color-contrast` se excluye porque jsdom no renderiza — el contraste se verifica numéricamente abajo.

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

## Contraste AA — verificación numérica de tokens

Calculado con la fórmula de luminancia relativa WCAG (mínimo AA texto normal: 4.5:1):

| Token | vs `--ink` #0B0D12 | vs `--surface` #12151C | AA |
|---|---|---|---|
| `--text` #E7E9F0 | 16.02 | 15.06 | ✅ |
| `--text-muted` #7A8099 | 4.97 | 4.68 | ✅ |
| `--signal-web` #5B8DEF | 6.02 | 5.65 | ✅ |
| `--signal-it` #E8A23D | 8.95 | 8.41 | ✅ |
| `--signal-ai` #4FD1C5 | 10.42 | 9.79 | ✅ |
| `--danger` #EF6A6A | 6.42 | 6.04 | ✅ |

## Verificación manual en navegador (Fases 2–4)

Realizada sobre `npm run dev` en Chrome (panel integrado), documentada por fase:

- **Geometría del hero**: los 3 pads terminales de la traza alineados con el centro de su tarjeta — error medido: **0.01px** a 1280px de viewport.
- **Responsive**: a 375px el SVG de escritorio se oculta, aparece el conector vertical degradado, **sin overflow horizontal**.
- **Tematización por faceta**: `--focus-ring` medido en runtime = `#e8a23d` en /servicios-it, `#4fd1c5` en /ia-automatizacion; `h1` en el color de señal correspondiente.
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

## Huecos conocidos (pendientes para Fase 6)

- Sin pruebas E2E en navegador real automatizadas (Playwright) — la verificación E2E fue manual documentada.
- Sin regresión visual (screenshots diff).
- La auditoría de contraste con axe en navegador real (no jsdom) queda para el pase final de accesibilidad de la Fase 6, junto con Lighthouse.
- Prueba del copiloto con la API real de Gemini (streaming end-to-end) en cuanto exista el secret.
