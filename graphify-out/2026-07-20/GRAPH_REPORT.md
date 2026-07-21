# Graph Report - PORTAFOLIO  (2026-07-20)

## Corpus Check
- 65 files · ~95,651 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 411 nodes · 696 edges · 38 communities (32 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a66c522`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Facet Page Components
- Dev Dependencies
- App TypeScript Config
- App Routing & A11y Tests
- Worker TypeScript Config
- Package Manifest
- Node/Vite TS Config
- vexp File Manifest
- Signal Hero Animation
- Núcleo Demo Logic
- Copilot Worker API
- CV Work Experience
- Design System & Deploy
- Test Suite Overview
- CV Skills Profile
- vexp Tool Suite
- Copilot Design Rationale
- Worker Rate-Limit Rationale
- vexp Guard Hook
- Content & System Prompt
- Accessibility Audit
- Viaje De Petición Diagram
- Root TS Config
- Favicon Branding Motif
- Vite Env Types
- SignalTrace.tsx
- vexp context tools <!-- vexp v2.2.3 -->
- App.tsx
- a11y-contrast.spec.ts
- prerender.mjs
- navigation.spec.ts
- gen-og-image.mjs

## God Nodes (most connected - your core abstractions)
1. `useT()` - 30 edges
2. `TESTING.md — Pruebas del portafolio` - 21 edges
3. `compilerOptions` - 19 edges
4. `compilerOptions` - 17 edges
5. `compilerOptions` - 16 edges
6. `LocalizedText` - 15 edges
7. `ui` - 14 edges
8. `isPending()` - 13 edges
9. `scripts` - 12 edges
10. `file_hashes` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Residencia Profesional — Nautylab (ene-jun 2026)` --semantically_similar_to--> `Proyecto: integracion-gemini`  [INFERRED] [semantically similar]
  public/cv.pdf → TESTING.md
- `Encargado de Turno — Tienda de Conveniencia (2017-2019)` --semantically_similar_to--> `Experiencia IT: liderazgo-operativo`  [INFERRED] [semantically similar]
  public/cv.pdf → TESTING.md
- `Proyecto: copiloto-ia` --semantically_similar_to--> `Copiloto IA (widget de chat con Claude)`  [INFERRED] [semantically similar]
  TESTING.md → README.md
- `Rechazo de inyección de rol system (HTTP 400)` --semantically_similar_to--> `Límites del Worker: 15 msgs/sesión, 1000 chars/msg, 512 tokens salida, solo roles user/assistant`  [INFERRED] [semantically similar]
  TESTING.md → README.md
- `Límite de sesión: HTTP 429 en el mensaje 16` --semantically_similar_to--> `Límites del Worker: 15 msgs/sesión, 1000 chars/msg, 512 tokens salida, solo roles user/assistant`  [INFERRED] [semantically similar]
  TESTING.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **vexp MCP Tool Suite** — _claude_claude_vexp, _claude_claude_run_pipeline, _claude_claude_get_skeleton, _claude_claude_index_status, _claude_claude_expand_vexp_ref [EXTRACTED 1.00]
- **Worker Rate-Limit & Validation Enforcement** — readme_session_limits_rationale, testing_session_limit_429, testing_role_injection_reject, worker_validate_module [INFERRED 0.85]
- **Nautylab AI Integration Case Study** — public_cv_nautylab, testing_project_nautylab, testing_project_integracion_gemini, public_cv_skills_ai [INFERRED 0.75]

## Communities (38 total, 6 thin omitted)

### Community 0 - "Facet Page Components"
Cohesion: 0.11
Nodes (38): cargarConversacion(), ChatDock(), Msg, Layout(), signalNav, FeaturedProject(), Props, ProjectCard() (+30 more)

### Community 1 - "Dev Dependencies"
Cohesion: 0.06
Nodes (33): axe-core, @cloudflare/workers-types, jsdom, devDependencies, axe-core, @cloudflare/workers-types, jsdom, @playwright/test (+25 more)

### Community 2 - "App TypeScript Config"
Cohesion: 0.07
Nodes (26): DOM, DOM.Iterable, src, @testing-library/jest-dom, vitest/globals, compilerOptions, allowImportingTsExtensions, jsx (+18 more)

### Community 3 - "App Routing & A11y Tests"
Cohesion: 0.16
Nodes (21): Props, AboutContent, AboutStory, Experience, experienceByRole(), LandingContent, LandingEvidence, LandingService (+13 more)

### Community 4 - "Worker TypeScript Config"
Cohesion: 0.09
Nodes (22): @cloudflare/workers-types, src/data, worker, compilerOptions, allowImportingTsExtensions, lib, module, moduleDetection (+14 more)

### Community 5 - "Package Manifest"
Cohesion: 0.08
Nodes (23): dependencies, react, react-dom, react-router-dom, name, private, scripts, build (+15 more)

### Community 6 - "Node/Vite TS Config"
Cohesion: 0.10
Nodes (19): ES2023, vite.config.ts, compilerOptions, allowImportingTsExtensions, lib, module, moduleDetection, moduleResolution (+11 more)

### Community 7 - "vexp File Manifest"
Cohesion: 0.10
Nodes (19): file_hashes, .claude/CLAUDE.md, .claude/hooks/vexp-guard.sh, src/App.tsx, src/components/Layout.tsx, src/data/content.ts, src/main.tsx, src/pages/FacetPage.tsx (+11 more)

### Community 8 - "Signal Hero Animation"
Cohesion: 0.19
Nodes (17): landing, roles, Locale, LOCALES, applyHead(), meta(), upsert(), useHeadMeta() (+9 more)

### Community 9 - "Núcleo Demo Logic"
Cohesion: 0.18
Nodes (10): Activo, ACTIVOS_INICIALES, badge, CICLO, EntradaAuditoria, Estado, hora(), LineaConsola (+2 more)

### Community 10 - "Copilot Worker API"
Cohesion: 0.23
Nodes (11): corsHeaders(), Env, fetch(), geminiUrl(), jsonResponse(), toGeminiContents(), ChatMessage, fail() (+3 more)

### Community 11 - "CV Work Experience"
Cohesion: 0.18
Nodes (11): Skill de voz 'Cuenta Cuentos' — Amazon Alexa (Innovatec 2025), Soporte Técnico — Ayuntamiento de Playas de Rosarito (2020-2021), Dominick Ibarra Acedo (CV), Instituto Tecnológico de Tijuana — Ing. Sistemas Computacionales, Servicios IT Independientes (Freelance, 2025–Presente), Gestor de Inventario (Angular, 2022), Encargado de Turno — Tienda de Conveniencia (2017-2019), Experiencia IT: ayuntamiento (+3 more)

### Community 12 - "Design System & Deploy"
Cohesion: 0.20
Nodes (10): Google Fonts: Space Grotesk, IBM Plex Sans, IBM Plex Mono, index.html — shell HTML de la app, robots.txt: Allow all user-agents, API key solo en el servidor (secret del Worker, nunca en el bundle cliente), Despliegue: Cloudflare Pages (sitio) + Cloudflare Worker (copiloto) vía wrangler, Portafolio — Dominick Ibarra Acedo, Tech stack: Vite + React 19 + TypeScript + Tailwind CSS v4 + Cloudflare, src/main.tsx (entry point) (+2 more)

### Community 13 - "Test Suite Overview"
Cohesion: 0.22
Nodes (10): Núcleo (Angular · .NET · SQL Server) — gestión de activos IT multi-cliente, npm test — 62 pruebas (Vitest + Testing Library + axe-core), App.test.tsx, NucleoDemo.test.tsx, ScreenshotFrame.test.tsx, SignalTrace.test.tsx, TESTING.md — Pruebas del portafolio, Huecos conocidos para Fase 6 (E2E Playwright, regresión visual, axe en navegador real) (+2 more)

### Community 14 - "CV Skills Profile"
Cohesion: 0.29
Nodes (7): Residencia Profesional — Nautylab (ene-jun 2026), Perfil profesional: Ingeniero en Sistemas bilingüe, Habilidades: IA & Automatización (Gemini 2.5 Flash, streaming SSE, Python), Habilidades: Servicios & Infraestructura IT (redes, C#/.NET, SQL Server), Habilidades: Desarrollo Web (React 19, Angular, TS, Vite, Radix UI, WCAG 2.1), Proyecto: integracion-gemini, Proyecto: nautylab

### Community 16 - "vexp Tool Suite"
Cohesion: 0.33
Nodes (6): expand_vexp_ref tool, get_skeleton tool, index_status tool, PreToolUse hook blocking Grep/Glob when vexp daemon running, run_pipeline tool, vexp (Context-Aware AI Coding pipeline)

### Community 17 - "Copilot Design Rationale"
Cohesion: 0.50
Nodes (5): Copiloto IA (widget de chat con Claude), Grounding: system prompt generado desde content.ts, sin invención, Streaming SSE de Claude canalizado directo al widget sin re-parseo, ChatDock.test.tsx, Proyecto: copiloto-ia

### Community 18 - "Worker Rate-Limit Rationale"
Cohesion: 0.50
Nodes (5): Límites del Worker: 15 msgs/sesión, 1000 chars/msg, 512 tokens salida, solo roles user/assistant, workerValidate.test.ts, Rechazo de inyección de rol system (HTTP 400), Límite de sesión: HTTP 429 en el mensaje 16, worker/validate.ts (módulo puro de validación)

### Community 19 - "vexp Guard Hook"
Cohesion: 0.83
Nodes (3): vexp-guard.sh script, vexp_allow(), vexp_deny()

### Community 20 - "Content & System Prompt"
Cohesion: 0.50
Nodes (4): content.ts (fuente única de verdad), content.test.ts, systemPrompt.ts (system prompt del copiloto), systemPrompt.test.ts

### Community 21 - "Accessibility Audit"
Cohesion: 0.67
Nodes (3): a11y.test.tsx, Auditoría de accesibilidad axe-core, WCAG 2.1 AA — cumplimiento de contraste

### Community 22 - "Viaje De Petición Diagram"
Cohesion: 0.18
Nodes (10): Advanced Parameters, MANDATORY: use vexp pipeline - do NOT grep or glob the codebase, Multi-Repo Workspaces, Other MCP tools (use only when run_pipeline is insufficient), Primary Tool, Query shape (do this), Smart Features (automatic - no action needed), Subagent / Explore / Plan mode (+2 more)

### Community 28 - "SignalTrace.tsx"
Cohesion: 0.31
Nodes (7): Props, Branch, branches, ORIGIN, Props, SignalTrace(), RoleId

### Community 29 - "vexp context tools <!-- vexp v2.2.3 -->"
Cohesion: 0.25
Nodes (7): Agentic search, Available MCP tools, Multi-Repo, Query shape (do this), Smart Features, vexp context tools <!-- vexp v2.2.3 -->, Workflow

### Community 31 - "a11y-contrast.spec.ts"
Cohesion: 0.40
Nodes (4): AXE_PATH, require, ROUTES, WIDTHS

### Community 32 - "prerender.mjs"
Cohesion: 0.50
Nodes (4): distDir, main(), outFile(), root

## Knowledge Gaps
- **175 isolated node(s):** `.claude/CLAUDE.md`, `.claude/hooks/vexp-guard.sh`, `src/App.tsx`, `src/components/Layout.tsx`, `src/data/content.ts` (+170 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Package Manifest`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `useT()` connect `Facet Page Components` to `Núcleo Demo Logic`, `App Routing & A11y Tests`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `TESTING.md — Pruebas del portafolio` connect `Test Suite Overview` to `CV Work Experience`, `Design System & Deploy`, `CV Skills Profile`, `Copilot Design Rationale`, `Worker Rate-Limit Rationale`, `Content & System Prompt`, `Accessibility Audit`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `.claude/CLAUDE.md`, `.claude/hooks/vexp-guard.sh`, `src/App.tsx` to the rest of the system?**
  _175 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Facet Page Components` be split into smaller, more focused modules?**
  _Cohesion score 0.11412429378531073 - nodes in this community are weakly interconnected._
- **Should `Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `App TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._