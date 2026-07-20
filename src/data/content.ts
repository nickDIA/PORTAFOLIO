import type { LocalizedText } from "../i18n/locale";

/* ============================================================
   CONTENT.TS — FUENTE ÚNICA DE VERDAD
   ------------------------------------------------------------
   Todo el contenido del portafolio vive aquí: la UI lo consume
   directamente y el system prompt del copiloto IA se genera a
   partir de este mismo objeto.

   ► Bilingüe: todo campo de prosa es LocalizedText ({ es, en }).
     Los campos que NO se traducen (nombres de tecnología, IDs,
     slugs, URLs) se quedan como string plano.
   ► Los placeholders restantes están marcados como [[TODO: ...]].
     Busca "[[TODO" para encontrar lo que falta por rellenar —
     se dejan idénticos en ambos idiomas (son notas para ti, no
     para el visitante).
   ► Las rutas de imágenes apuntan a /public — coloca ahí tus
     capturas y actualiza los nombres.
   ► OJO: periodos y algunos nombres son borradores plausibles —
     verifica fechas, cifras y nombres antes de publicar.
   ============================================================ */

/* ----------------------------- Tipos ----------------------------- */

export type RoleId = "web" | "it" | "ai";

export interface Role {
  id: RoleId;
  slug: string; // ruta de la página (misma en ambos idiomas, bajo /en)
  name: LocalizedText;
  /** Token Tailwind del color de señal (clase generada por @theme) */
  signalToken: "signal-web" | "signal-it" | "signal-ai";
  tagline: LocalizedText;
  description: LocalizedText;
}

export interface ProjectLink {
  label: LocalizedText;
  url: string;
}

export interface Screenshot {
  src: string; // ruta relativa a /public
  alt: LocalizedText; // texto alternativo — obligatorio por accesibilidad
  caption?: LocalizedText;
}

export interface Project {
  id: string;
  role: RoleId;
  name: LocalizedText;
  title: LocalizedText; // puesto/cargo en el proyecto, ej. "Desarrollador full-stack"
  period: LocalizedText; // ej. "2024 — 2025"
  summary: LocalizedText; // 1-2 frases para tarjetas
  description: LocalizedText; // párrafo largo para la página de detalle
  achievements: LocalizedText[]; // logros medibles, con evidencia
  tech: string[]; // nombres de tecnología — no se traducen
  screenshots: Screenshot[];
  links: ProjectLink[];
  /** true = proyecto central de su rol (se muestra primero y más grande) */
  featured: boolean;
}

export interface Experience {
  id: string;
  role: RoleId;
  organization: LocalizedText;
  title: LocalizedText; // puesto/cargo, ej. "Encargado de Turno"
  period: LocalizedText;
  description: LocalizedText;
  highlights: LocalizedText[];
}

export interface Profile {
  name: string; // nombre propio — no se traduce
  title: LocalizedText;
  tagline: LocalizedText;
  intro: LocalizedText;
  location: LocalizedText;
  contact: {
    email: string;
    github: string;
    linkedin: string;
    cvUrl: string; // ruta al PDF en /public — una sola versión general
    cvNote: LocalizedText;
  };
}

/* ----------------------------- Perfil ----------------------------- */

export const profile: Profile = {
  name: "Dominick Ibarra Acedo",
  title: { es: "Ingeniero en Sistemas", en: "Systems Engineer" },
  tagline: {
    es: "Construyo software que se puede tocar: interfaces accesibles, infraestructura que no se cae e IA integrada en productos reales.",
    en: "I build software you can touch: accessible interfaces, infrastructure that doesn't go down, and AI integrated into real products.",
  },
  intro: {
    es: "Me gusta el momento en que la tecnología deja de ser una promesa y se vuelve algo que funciona: una interfaz que cualquiera puede usar, una red que nadie nota porque nunca falla, un modelo de IA respondiendo dentro de un producto real. Trabajo en las tres capas — web, infraestructura e IA — porque los problemas reales nunca respetan una sola.",
    en: "I like the moment technology stops being a promise and becomes something that works: an interface anyone can use, a network nobody notices because it never fails, an AI model responding inside a real product. I work across all three layers — web, infrastructure, and AI — because real problems never respect just one.",
  },
  location: { es: "Tijuana, México", en: "Tijuana, Mexico" },
  contact: {
    email: "dominickomg@gmail.com",
    github: "https://github.com/nickDIA",
    linkedin: "https://www.linkedin.com/in/dominick-ia",
    cvUrl: "/cv.pdf",
    cvNote: {
      es: "Versiones adaptadas por rol disponibles bajo solicitud",
      en: "Role-tailored versions available on request",
    },
  },
};

/* ----------------------------- Roles ----------------------------- */

export const roles: Role[] = [
  {
    id: "web",
    slug: "/desarrollo-web",
    name: { es: "Desarrollo Web", en: "Web Development" },
    signalToken: "signal-web",
    tagline: {
      es: "Interfaces accesibles, rápidas y en tiempo real",
      en: "Accessible, fast, real-time interfaces",
    },
    description: {
      es: "Construyo aplicaciones web donde la accesibilidad no es un extra: React moderno, WCAG 2.1 desde el diseño, y streaming en tiempo real cuando la experiencia lo pide.",
      en: "I build web applications where accessibility isn't an afterthought: modern React, WCAG 2.1 from the design stage, and real-time streaming when the experience calls for it.",
    },
  },
  {
    id: "it",
    slug: "/servicios-it",
    name: { es: "Servicios IT", en: "IT Services" },
    signalToken: "signal-it",
    tagline: {
      es: "Infraestructura que nadie nota porque no falla",
      en: "Infrastructure nobody notices because it doesn't fail",
    },
    description: {
      es: "Soporte, redes e inventario en entornos reales — desde más de 300 equipos de un ayuntamiento hasta clientes freelance — con liderazgo operativo en piso, no solo en papel.",
      en: "Support, networking, and inventory in real environments — from 300+ machines at a city government office to freelance clients — with operational leadership on the floor, not just on paper.",
    },
  },
  {
    id: "ai",
    slug: "/ia-automatizacion",
    name: { es: "IA & Automatización", en: "AI & Automation" },
    signalToken: "signal-ai",
    tagline: {
      es: "IA integrada en productos, no solo en prompts",
      en: "AI integrated into products, not just prompts",
    },
    description: {
      es: "Integro modelos de lenguaje en aplicaciones reales: streaming SSE, prompt engineering aplicado, pipelines de generación y control de costos en producción.",
      en: "I integrate language models into real applications: SSE streaming, applied prompt engineering, generation pipelines, and cost control in production.",
    },
  },
];

/* ----------------------------- Proyectos ----------------------------- */

export const projects: Project[] = [
  /* ---------- Desarrollo Web ---------- */
  {
    id: "nautylab",
    role: "web",
    name: { es: "Nautylab", en: "Nautylab" },
    title: { es: "Desarrollador full-stack", en: "Full-stack Developer" },
    period: { es: "2024 — 2025", en: "2024 — 2025" }, // [[TODO: verificar periodo]]
    summary: {
      es: "Aplicación web con asistente de IA integrado: React 19, accesibilidad WCAG 2.1 y respuestas de Gemini en streaming en tiempo real.",
      en: "Web application with an integrated AI assistant: React 19, WCAG 2.1 accessibility, and real-time streaming responses from Gemini.",
    },
    description: {
      es: "Nautylab es mi proyecto web más completo: una aplicación React 19 con un asistente de IA embebido que responde en tiempo real vía streaming SSE. La construí con la accesibilidad como requisito de primera clase — 9 funcionalidades WCAG 2.1, de la navegación por teclado a la compatibilidad con lectores de pantalla — y un backend ligero en Cloudflare Workers que protege las llaves de API y canaliza el streaming de Gemini 2.5 Flash hacia el cliente.",
      en: "Nautylab is my most complete web project: a React 19 application with an embedded AI assistant that responds in real time via SSE streaming. I built it with accessibility as a first-class requirement — 9 WCAG 2.1 features, from keyboard navigation to screen reader compatibility — and a lightweight Cloudflare Workers backend that protects the API keys and streams Gemini 2.5 Flash to the client.",
    },
    achievements: [
      {
        es: "9 funcionalidades de accesibilidad WCAG 2.1 implementadas — navegable por teclado y compatible con lectores de pantalla",
        en: "9 WCAG 2.1 accessibility features implemented — keyboard-navigable and screen-reader compatible",
      },
      {
        es: "Integración de Gemini 2.5 Flash con streaming SSE en tiempo real",
        en: "Gemini 2.5 Flash integration with real-time SSE streaming",
      },
      {
        es: "Backend en Cloudflare Workers que mantiene las API keys fuera del cliente",
        en: "Cloudflare Workers backend that keeps API keys off the client",
      },
    ],
    tech: [
      "React 19",
      "Vite",
      "TypeScript",
      "WCAG 2.1",
      "Gemini 2.5 Flash",
      "SSE (Server-Sent Events)",
      "Cloudflare Workers AI",
    ],
    screenshots: [
      {
        src: "/screenshots/Nautylab1.png",
        alt: {
          es: "Lector de cuentos de Nautylab mostrando una historia ilustrada generada por IA, con narración paso a paso",
          en: "Nautylab's story reader showing an AI-generated illustrated story, with step-by-step narration",
        },
      },
      {
        src: "/screenshots/Nautylab2.png",
        alt: {
          es: "Chat del tutor de Español respondiendo la pregunta de un estudiante sobre qué es una sílaba",
          en: "Spanish tutor chat answering a student's question about what a syllable is",
        },
      },
      {
        src: "/screenshots/Nautylab3.png",
        alt: {
          es: "Asistente de creación de cuentos, en el paso de elegir el lugar de la aventura",
          en: "Story-creation wizard, at the step of choosing the adventure's setting",
        },
      },
      {
        src: "/screenshots/Nautylab4.png",
        alt: {
          es: "Resumen final del cuento generado, antes de crear la historia",
          en: "Final summary of the generated story, before creating it",
        },
      },
    ],
    /* Proyecto de residencia profesional — el código no es de mi propiedad,
       así que no hay repositorio ni demo pública que enlazar. */
    links: [],
    featured: true,
  },
  {
    id: "gestor-inventario",
    role: "web",
    name: { es: "Gestor de Inventario", en: "Inventory Manager" },
    title: { es: "Desarrollador", en: "Developer" },
    period: { es: "2024", en: "2024" }, // [[TODO: verificar periodo]]
    summary: {
      es: "Aplicación para dar de alta, mover y auditar productos de un inventario, con historial de movimientos.",
      en: "Application to register, move, and audit inventory products, with a movement history.",
    },
    description: {
      es: "Gestión de inventario con lo esencial bien hecho: altas, bajas, movimientos entre ubicaciones y un historial que responde la pregunta clave de cualquier inventario — qué cambió, cuándo, y quién lo hizo.",
      en: "Inventory management with the essentials done right: additions, removals, movements between locations, and a history that answers the key question of any inventory — what changed, when, and who did it.",
    },
    achievements: [
      {
        es: "Historial de movimientos consultable por producto",
        en: "Movement history queryable by product",
      },
      {
        es: "Búsqueda y filtrado pensados para catálogos que crecen",
        en: "Search and filtering designed for growing catalogs",
      },
    ],
    tech: ["[[TODO: tecnologías usadas]]"],
    screenshots: [
      {
        src: "/screenshots/inventario-1.png",
        alt: {
          es: "Listado de productos del gestor de inventario con su historial de movimientos",
          en: "Inventory manager's product list with its movement history",
        },
      },
    ],
    links: [
      {
        label: { es: "Repositorio", en: "Repository" },
        url: "[[TODO: URL del repo]]",
      },
    ],
    featured: false,
  },

  /* ---------- Servicios IT ---------- */
  {
    id: "nucleo",
    role: "it",
    name: { es: "Núcleo", en: "Núcleo" },
    title: {
      es: "Diseño y desarrollo del sistema",
      en: "System design and development",
    },
    period: { es: "2025 — presente", en: "2025 — present" }, // [[TODO: verificar periodo]]
    summary: {
      es: "Sistema de gestión de activos IT con auditoría transaccional: cada cambio de estado queda registrado con quién, cuándo y por qué — o se revierte completo.",
      en: "IT asset management system with transactional auditing: every status change is logged with who, when, and why — or it's fully reverted.",
    },
    description: {
      es: "Núcleo nace de una necesidad que viví gestionando inventario IT: los cambios de estado de los activos se pierden si la auditoría es opcional. Su corazón técnico es la transacción atómica — cada cambio de estado genera su entrada de auditoría (timestamp, motivo, técnico) en la misma transacción, y ante cualquier fallo ambos se revierten juntos. Nunca queda un cambio a medias. La demo interactiva de esta página simula ese comportamiento exacto en el frontend.",
      en: "Núcleo was born from a need I lived firsthand managing IT inventory: asset status changes get lost if auditing is optional. Its technical core is the atomic transaction — every status change generates its audit entry (timestamp, reason, technician) in the same transaction, and if anything fails, both revert together. A change is never left half-done. The interactive demo on this page simulates that exact behavior in the frontend.",
    },
    achievements: [
      {
        es: "Auditoría transaccional: cambio de estado y registro de auditoría atómicos — o ambos o ninguno",
        en: "Transactional auditing: status change and audit record are atomic — both or neither",
      },
      {
        es: "Guión visual 'El viaje de una petición' para explicar la arquitectura a perfiles no técnicos",
        en: "Visual script 'The journey of a request' to explain the architecture to non-technical audiences",
      },
    ],
    tech: ["[[TODO: tecnologías del backend real de Núcleo]]"],
    screenshots: [
      {
        src: "/screenshots/nucleo-1.png",
        alt: {
          es: "Panel de activos de Núcleo con su registro de auditoría",
          en: "Núcleo's asset panel with its audit log",
        },
      },
    ],
    links: [],
    featured: true,
  },

  /* ---------- IA & Automatización ---------- */
  {
    id: "copiloto-ia",
    role: "ai",
    name: { es: "Copiloto IA del portafolio", en: "Portfolio AI Copilot" },
    title: {
      es: "Diseño e implementación end-to-end",
      en: "End-to-end design and implementation",
    },
    period: { es: "2026", en: "2026" },
    summary: {
      es: "Asistente conversacional real (no mockup) embebido en este sitio, que responde sobre mi experiencia usando la API de Gemini — su system prompt se genera desde este mismo archivo de datos.",
      en: "A real conversational assistant (not a mockup) embedded in this site, which answers questions about my experience using the Gemini API — its system prompt is generated from this very data file.",
    },
    description: {
      es: "Cloudflare Worker como proxy a la API de Gemini: la API key vive como secret en el Worker y nunca toca el cliente. El system prompt se genera automáticamente desde este mismo archivo de datos (los placeholders sin rellenar se filtran), así las respuestas quedan ancladas a hechos verificables. Los límites — 15 mensajes por sesión, 512 tokens de salida, validación estricta del historial — se aplican en el servidor, no solo en la UI: control de costo y abuso desde el diseño. El streaming SSE de Gemini se canaliza directo al widget, que es un dock persistente accesible desde cualquier página del sitio.",
      en: "A Cloudflare Worker proxies the Gemini API: the API key lives as a Worker secret and never touches the client. The system prompt is generated automatically from this same data file (unfilled placeholders are filtered out), so answers stay anchored to verifiable facts. The limits — 15 messages per session, 512 output tokens, strict history validation — are enforced server-side, not just in the UI: cost and abuse control by design. Gemini's SSE stream is piped straight to the widget, a persistent dock accessible from any page on the site.",
    },
    achievements: [
      {
        es: "API key protegida en el Worker como secret — cero exposición en cliente",
        en: "API key protected in the Worker as a secret — zero client exposure",
      },
      {
        es: "Respuestas ancladas a datos reales vía system prompt generado desde content.ts",
        en: "Answers grounded in real data via a system prompt generated from content.ts",
      },
      {
        es: "Límites de uso (mensajes por sesión y tokens de salida) como decisión de ingeniería de costos",
        en: "Usage limits (messages per session and output tokens) as a cost-engineering decision",
      },
    ],
    tech: ["Gemini API (Google)", "Cloudflare Workers", "TypeScript", "SSE (Server-Sent Events)"],
    screenshots: [],
    links: [],
    featured: true,
  },
  {
    id: "integracion-gemini",
    role: "ai",
    name: {
      es: "Integración de Gemini en Nautylab",
      en: "Gemini Integration in Nautylab",
    },
    title: { es: "Desarrollador — integración de IA", en: "Developer — AI integration" },
    period: { es: "2025", en: "2025" }, // [[TODO: verificar periodo]]
    summary: {
      es: "Integración de Gemini 2.5 Flash con streaming SSE, prompt engineering aplicado y pipeline de generación de imágenes en dos etapas.",
      en: "Gemini 2.5 Flash integration with SSE streaming, applied prompt engineering, and a two-stage image generation pipeline.",
    },
    description: {
      es: "El asistente de Nautylab responde en tiempo real: cada token del modelo viaja por SSE desde un Cloudflare Worker hasta la interfaz, sin esperar la respuesta completa. El prompt engineering está aplicado a producto — instrucciones de sistema que anclan el tono y el alcance del asistente — y la generación de imágenes funciona en dos etapas: primero el modelo interpreta y refina la petición del usuario, y después la etapa de generación produce la imagen con ese prompt optimizado.",
      en: "Nautylab's assistant responds in real time: every token from the model travels over SSE from a Cloudflare Worker to the interface, without waiting for the full response. Prompt engineering is applied at the product level — system instructions that anchor the assistant's tone and scope — and image generation works in two stages: first the model interprets and refines the user's request, then the generation stage produces the image with that optimized prompt.",
    },
    achievements: [
      {
        es: "Streaming SSE de respuestas en tiempo real",
        en: "Real-time SSE response streaming",
      },
      {
        es: "Pipeline de generación de imágenes en dos etapas: refinamiento del prompt y generación",
        en: "Two-stage image generation pipeline: prompt refinement and generation",
      },
      {
        es: "Prompt engineering aplicado: el asistente mantiene tono y alcance definidos por instrucciones de sistema",
        en: "Applied prompt engineering: the assistant keeps a tone and scope defined by system instructions",
      },
    ],
    tech: ["Gemini 2.5 Flash", "SSE (Server-Sent Events)", "Prompt engineering", "Cloudflare Workers AI"],
    screenshots: [
      {
        src: "/screenshots/gemini-integracion-1.png",
        alt: {
          es: "Respuesta del asistente de Nautylab llegando en streaming, token a token",
          en: "Nautylab's assistant response arriving via streaming, token by token",
        },
      },
    ],
    links: [],
    featured: false,
  },
  {
    id: "alexa-skill",
    role: "ai",
    name: { es: "Skill de Alexa", en: "Alexa Skill" },
    title: { es: "Desarrollador", en: "Developer" },
    period: { es: "2024", en: "2024" }, // [[TODO: verificar periodo]]
    summary: {
      es: "Skill de voz para Alexa construida en Python: interacción conversacional de extremo a extremo, del enunciado del usuario a la respuesta hablada.",
      en: "A voice skill for Alexa built in Python: end-to-end conversational interaction, from the user's utterance to the spoken response.",
    },
    description: {
      es: "Una skill de Alexa desarrollada en Python con el Alexa Skills Kit: define intents, procesa los enunciados del usuario y construye respuestas habladas. Fue mi primer contacto con interfaces conversacionales — diseñar para voz obliga a pensar en el flujo del diálogo, no en pantallas.",
      en: "An Alexa skill built in Python with the Alexa Skills Kit: it defines intents, processes user utterances, and builds spoken responses. It was my first contact with conversational interfaces — designing for voice forces you to think in terms of dialogue flow, not screens.",
    },
    achievements: [
      {
        es: "Manejo de intents y slots para conversaciones de varios turnos",
        en: "Intent and slot handling for multi-turn conversations",
      },
    ],
    tech: ["Python", "Alexa Skills Kit", "Interacción por voz"],
    screenshots: [],
    links: [
      {
        label: { es: "Repositorio", en: "Repository" },
        url: "[[TODO: URL del repo, o elimina este enlace]]",
      },
    ],
    featured: false,
  },
];

/* ----------------------------- Experiencia ----------------------------- */

export const experience: Experience[] = [
  {
    id: "ayuntamiento",
    role: "it",
    organization: { es: "Ayuntamiento de Tijuana", en: "Ayuntamiento de Tijuana" }, // [[TODO: verificar nombre oficial]]
    title: { es: "Soporte técnico e inventario IT", en: "IT Support and Inventory" },
    period: { es: "2024 — 2025", en: "2024 — 2025" }, // [[TODO: verificar periodo]]
    description: {
      es: "Soporte técnico e inventario de más de 300 equipos de cómputo y su red: diagnóstico y reparación, altas y bajas de equipo, y mantenimiento del registro que permite saber dónde está cada activo y en qué estado.",
      en: "Technical support and inventory for 300+ computers and their network: diagnostics and repair, equipment additions and retirements, and maintaining the record that tracks where every asset is and its condition.",
    },
    highlights: [
      {
        es: "Inventario y soporte de más de 300 equipos de cómputo",
        en: "Inventory and support for 300+ computers",
      },
      {
        es: "Soporte de redes y atención directa a usuarios de distintas áreas",
        en: "Network support and direct assistance to users across departments",
      },
    ],
  },
  {
    id: "freelance-it",
    role: "it",
    organization: { es: "Freelance", en: "Freelance" },
    title: { es: "Técnico IT independiente", en: "Independent IT Technician" },
    period: { es: "2023 — presente", en: "2023 — present" }, // [[TODO: verificar periodo]]
    description: {
      es: "Servicios IT para pequeños negocios y particulares: armado y mantenimiento de equipos, instalación de redes, respaldo y recuperación de información, y asesoría para decidir qué comprar y qué reparar.",
      en: "IT services for small businesses and individuals: building and maintaining equipment, network installation, data backup and recovery, and advice on what to buy versus what to repair.",
    },
    highlights: [
      {
        es: "Clientes recurrentes gracias a trabajo confiable y explicaciones sin tecnicismos",
        en: "Repeat clients thanks to reliable work and jargon-free explanations",
      },
      {
        es: "Diagnósticos honestos: reparar cuando conviene, reemplazar cuando no",
        en: "Honest diagnostics: repair when it makes sense, replace when it doesn't",
      },
    ],
  },
  {
    id: "liderazgo-operativo",
    role: "it",
    organization: { es: "Sector retail", en: "Retail sector" }, // [[TODO: nombre de la empresa]]
    title: { es: "Encargado de Turno", en: "Shift Supervisor" },
    period: { es: "2023 — 2024", en: "2023 — 2024" }, // [[TODO: verificar periodo]]
    description: {
      es: "Liderazgo operativo con responsabilidad completa del turno: coordinación del personal, control de inventario y manejo de valores. Liderazgo en piso — resolver con la gente enfrente, no desde un escritorio.",
      en: "Operational leadership with full responsibility for the shift: staff coordination, inventory control, and cash handling. Leadership on the floor — solving problems face-to-face, not from a desk.",
    },
    highlights: [
      {
        es: "Coordinación del personal y de la operación diaria del turno",
        en: "Coordination of staff and daily shift operations",
      },
      {
        es: "Responsable de cortes de caja, inventario y manejo de valores",
        en: "Responsible for cash register reconciliation, inventory, and cash handling",
      },
    ],
  },
];

/* ----------------------------- Utilidades ----------------------------- */

/** true si el campo (ya resuelto a string) sigue siendo un placeholder [[TODO */
export const isPending = (value: string) => value.includes("[[TODO");

/** Proyectos de un rol, con el destacado primero. */
export function projectsByRole(role: RoleId): Project[] {
  return projects
    .filter((p) => p.role === role)
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}

/** Experiencia de un rol. */
export function experienceByRole(role: RoleId): Experience[] {
  return experience.filter((e) => e.role === role);
}
