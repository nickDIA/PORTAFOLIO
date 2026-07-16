# Portafolio — Dominick Ibarra Acedo

Portafolio profesional con tres facetas — **Desarrollo Web · Servicios IT · IA & Automatización** — que demuestra con evidencia real, no solo describe: demo interactiva de transacción atómica (Núcleo) y un copiloto IA en vivo anclado a los datos del sitio.

**Stack**: Vite + React 19 + TypeScript + Tailwind CSS v4 · Cloudflare Worker (copiloto) · Cloudflare Pages (despliegue).

## Desarrollo local

```bash
npm install
npm run dev          # sitio en http://localhost:5173
```

El copiloto necesita el Worker corriendo en paralelo:

```bash
npm run worker:dev   # Worker en http://localhost:8787 (Vite hace proxy de /api)
```

Para que el copiloto responda con la API real de Claude en local, crea un archivo `.dev.vars` en la raíz (ya está en `.gitignore`):

```
ANTHROPIC_API_KEY=sk-ant-...
```

> Sin la key, todo funciona igual salvo el copiloto, que responde con un mensaje claro de "no configurado". Usa una key dedicada a este proyecto con **límite de gasto configurado** en console.anthropic.com.

## Contenido

Todo el contenido vive en [`src/data/content.ts`](src/data/content.ts) — única fuente de verdad que alimenta la UI **y** el system prompt del copiloto ([`src/data/systemPrompt.ts`](src/data/systemPrompt.ts)). Los campos por rellenar están marcados `[[TODO` (búscalos); los fragmentos sin rellenar se filtran automáticamente del prompt y se muestran como "pendiente" en la UI, nunca como contenido roto.

Capturas de pantalla → `public/screenshots/` · CV → `public/cv.pdf`.

## Pruebas

```bash
npm test             # 62 pruebas (Vitest + Testing Library + axe-core)
```

Detalle completo de cobertura y verificaciones manuales en [TESTING.md](TESTING.md).

## Despliegue

**Worker del copiloto:**

```bash
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY   # pega la key cuando la pida
npm run worker:deploy                        # → https://portafolio-copiloto.<subdominio>.workers.dev
```

**Sitio (Cloudflare Pages):** conecta el repo en el dashboard de Pages con build command `npm run build` y output `dist`. Define la variable de build `VITE_COPILOT_URL` con la URL del Worker + `/api/chat`. Después, restringe CORS: en `wrangler.jsonc`, fija `ALLOWED_ORIGIN` al dominio del sitio y redespliega el Worker.

## Decisiones de ingeniería del copiloto

- **API key solo en el servidor** — secret del Worker, jamás en el bundle del cliente.
- **Grounding**: el system prompt se genera desde `content.ts`; el copiloto no puede afirmar nada que el sitio no afirme.
- **Límites aplicados en el Worker** (el endpoint es público): 15 mensajes por sesión, 1000 caracteres por mensaje, 512 tokens de salida, solo roles `user`/`assistant` (la inyección de rol `system` se rechaza con 400).
- **Streaming SSE** de Claude canalizado directo al widget, sin re-parseo en el Worker.
