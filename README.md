# Portafolio — Dominick Ibarra Acedo

[![CI](https://github.com/nickDIA/PORTAFOLIO/actions/workflows/ci.yml/badge.svg)](https://github.com/nickDIA/PORTAFOLIO/actions/workflows/ci.yml)

Sitio profesional bilingüe (es/en): la raíz es una **landing para clientes** (servicios en lenguaje no técnico, galería de evidencia y CTA de contacto) y la profundidad técnica vive en tres páginas de rol — **Desarrollo Web · Servicios IT · IA & Automatización** — más una página [Sobre mí](https://portafolio-ccq.pages.dev/sobre-mi), una demo interactiva de transacción atómica (Núcleo) y un copiloto IA en vivo anclado a los datos del sitio.

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

Para que el copiloto responda con la API real de Gemini en local, crea un archivo `.dev.vars` en la raíz (ya está en `.gitignore`):

```
GEMINI_API_KEY=AIza...
```

> Sin la key, todo funciona igual salvo el copiloto, que responde con un mensaje claro de "no configurado". Genera la key en [Google AI Studio](https://aistudio.google.com/apikey); si la asocias a un proyecto de facturación, configura una alerta de presupuesto en Google Cloud Console.

## Contenido

Todo el contenido vive en [`src/data/content.ts`](src/data/content.ts) — única fuente de verdad que alimenta la UI **y** el system prompt del copiloto ([`src/data/systemPrompt.ts`](src/data/systemPrompt.ts)). Cada campo de prosa es bilingüe (`{ es, en }`); los campos por rellenar están marcados `[[TODO` en ambos idiomas (búscalos) — los fragmentos sin rellenar se filtran automáticamente del prompt y se muestran como "pendiente" en la UI, nunca como contenido roto.

Capturas de pantalla → `public/screenshots/` · CV → `public/cv.pdf`.

## Idiomas (es/en)

El español vive en las rutas sin prefijo (`/servicios-it`); el inglés bajo `/en` (`/en/servicios-it`) — cada página tiene un link propio compartible por idioma. La infraestructura vive en `src/i18n/`: `locale.ts` (contexto de idioma + `useT()`) y `ui.ts` (diccionario de texto de interfaz que no viene de `content.ts`). El copiloto responde en el idioma en que le escriban, independiente del idioma del sitio — su system prompt se genera siempre desde el español canónico.

## Pruebas

```bash
npm test             # 108 pruebas (Vitest + Testing Library + axe-core)
npm run test:e2e     # 50 pruebas E2E (Playwright, navegador real, es + en)
```

Detalle completo de cobertura y verificaciones manuales en [TESTING.md](TESTING.md).

## Despliegue

**Worker del copiloto:**

```bash
npx wrangler login
npx wrangler secret put GEMINI_API_KEY   # pega la key cuando la pida
npm run worker:deploy                     # → https://portafolio-copiloto.<subdominio>.workers.dev
```

**Sitio (Cloudflare Pages):** conecta el repo en el dashboard de Pages con build command `npm run build` y output `dist`. El build de producción apunta al Worker desplegado por defecto (ver `ENDPOINT` en `ChatDock.tsx`); para usar otra URL, define la variable de build `VITE_COPILOT_URL`. El CORS del Worker está restringido a `ALLOWED_ORIGIN` en `wrangler.jsonc` — actualízalo si cambias el dominio del sitio y redespliega el Worker.

## Decisiones de ingeniería del copiloto

- **API key solo en el servidor** — secret del Worker, jamás en el bundle del cliente.
- **Grounding**: el system prompt se genera desde `content.ts`; el copiloto no puede afirmar nada que el sitio no afirme.
- **Límites aplicados en el Worker** (el endpoint es público): 15 mensajes por sesión, 1000 caracteres por mensaje, 512 tokens de salida, solo roles `user`/`assistant` (la inyección de rol `system` se rechaza con 400).
- **Streaming SSE** de Gemini canalizado directo al widget, sin re-parseo en el Worker.
