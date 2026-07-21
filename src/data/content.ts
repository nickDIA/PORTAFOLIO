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

export interface LandingService {
  /** Rol técnico al que traduce este servicio — hereda color de señal y ruta. */
  role: RoleId;
  /** Nombre del servicio en lenguaje de cliente (el técnico vive en roles[]). */
  label: LocalizedText;
  benefit: LocalizedText;
}

export interface LandingEvidence {
  /** Rol cuyo color de señal enmarca la foto. */
  role: RoleId;
  shot: Screenshot;
}

export interface LandingContent {
  hero: {
    eyebrow: LocalizedText;
    headline: LocalizedText;
    sub: LocalizedText;
  };
  services: LandingService[];
  evidenceHeading: LocalizedText;
  evidence: LandingEvidence[];
  trustHeading: LocalizedText;
  trust: LocalizedText[];
  copilotNote: LocalizedText;
  cta: {
    heading: LocalizedText;
    whatsappLabel: LocalizedText;
    emailLabel: LocalizedText;
    /** Mensaje precargado del link wa.me. */
    whatsappMessage: LocalizedText;
  };
}

export interface AboutStory {
  id: string;
  heading: LocalizedText;
  body: LocalizedText;
}

export interface AboutContent {
  title: LocalizedText;
  intro: LocalizedText;
  stories: AboutStory[];
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
    /** Solo dígitos con código de país (ej. 52664...). Alimenta el link wa.me del CTA. */
    whatsapp: string;
    cvUrl: string; // ruta al PDF en /public — una sola versión general
    cvNote: LocalizedText;
  };
}

/* ----------------------------- Perfil ----------------------------- */

export const profile: Profile = {
  name: "Dominick Ibarra Acedo",
  title: { es: "Ingeniero en Sistemas", en: "Systems Engineer" },
  tagline: {
    es: "Ingeniería con intención: datos que fluyen, transacciones sin cabos sueltos, interfaces que no excluyen a nadie — en las tres capas que un producto real necesita: web, redes e IA.",
    en: "Engineering with intention: data that flows, transactions that leave no loose ends, interfaces that exclude no one — across the three layers a real product needs: web, networking, and AI.",
  },
  intro: {
    es: "Quise hacer todo bien desde el inicio para no arrastrar deuda — terminé en parálisis por análisis. Aprendí lo contrario: solo haciendo las cosas se prepara mejor lo que sigue. Por eso trabajo en tres capas — web, redes e IA — con la misma disciplina en cada una.",
    en: "I wanted to get everything right from the start to avoid debt later — I ended up in analysis paralysis. I learned the opposite: only by doing the work do you prepare better for what comes next. That's why I work across three layers — web, networking, and AI — with the same discipline in each.",
  },
  location: { es: "Tijuana, México", en: "Tijuana, Mexico" },
  contact: {
    email: "dominickomg@gmail.com",
    github: "https://github.com/nickDIA",
    linkedin: "https://www.linkedin.com/in/dominick-ia",
    /* Mientras sea [[TODO, el CTA de la landing cae a email automáticamente. */
    whatsapp: "526611259411",
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

/* ----------------------------- Landing ----------------------------- */
/* La raíz (/) es la carta de presentación para CLIENTES — lenguaje de
   beneficio, no de ingeniería. La profundidad técnica para reclutadores
   vive en las páginas de rol, a un clic desde cada tarjeta de servicio.
   Las fotos de la galería usan la ruta REAL esperada: mientras el archivo
   no exista en /public, ScreenshotFrame muestra el marco pendiente con esa
   ruta; al soltar la foto ahí, aparece sola sin tocar código. */

export const landing: LandingContent = {
  hero: {
    eyebrow: {
      es: "Servicios de tecnología · Tijuana",
      en: "Technology services · Tijuana",
    },
    headline: {
      es: "Tecnología que trabaja para ti",
      en: "Technology that works for you",
    },
    sub: {
      es: "Páginas web, soporte de equipos y redes, y automatización con IA — para negocios y personas que necesitan que las cosas simplemente funcionen.",
      en: "Websites, computer and network support, and AI automation — for businesses and people who need things to simply work.",
    },
  },

  services: [
    {
      role: "web",
      label: { es: "Tu negocio en internet", en: "Your business online" },
      benefit: {
        es: "Páginas y aplicaciones web rápidas, que se ven bien en el celular y que cualquier persona puede usar.",
        en: "Fast websites and web applications that look great on a phone and anyone can use.",
      },
    },
    {
      role: "it",
      label: {
        es: "Equipos y redes que funcionan",
        en: "Computers and networks that work",
      },
      benefit: {
        es: "Mantenimiento, reparación, redes e inventario de equipo — para que la tecnología no detenga tu operación.",
        en: "Maintenance, repair, networking, and equipment inventory — so technology never stops your operation.",
      },
    },
    {
      role: "ai",
      label: { es: "Automatización e IA", en: "Automation & AI" },
      benefit: {
        es: "Procesos repetitivos que se hacen solos y asistentes de IA que responden por ti — menos errores, más tiempo.",
        en: "Repetitive processes that run themselves and AI assistants that answer for you — fewer errors, more time.",
      },
    },
  ],

  evidenceHeading: { es: "Trabajo real, no promesas", en: "Real work, not promises" },
  evidence: [
    {
      role: "it",
      shot: {
        src: "/screenshots/mantenimiento-1.jpg",
        alt: {
          es: "Mantenimiento y reparación de equipo de cómputo",
          en: "Computer equipment maintenance and repair",
        },
        caption: {
          es: "Mantenimiento y reparación — más de 300 equipos atendidos",
          en: "Maintenance and repair — 300+ machines serviced",
        },
      },
    },
    {
      role: "it",
      shot: {
        src: "/screenshots/nucleo-1.png",
        alt: {
          es: "Panel de activos de Núcleo con su registro de auditoría",
          en: "Núcleo's asset panel with its audit log",
        },
        caption: {
          es: "Núcleo: inventario que registra cada movimiento, sin errores",
          en: "Núcleo: inventory that logs every movement, error-free",
        },
      },
    },
    {
      role: "web",
      shot: {
        src: "/screenshots/Nautylab1.png",
        alt: {
          es: "Lector de cuentos de Nautylab mostrando una historia ilustrada generada por IA",
          en: "Nautylab's story reader showing an AI-generated illustrated story",
        },
        caption: {
          es: "Nautylab: aplicación web con asistente de IA integrado",
          en: "Nautylab: web application with a built-in AI assistant",
        },
      },
    },
    {
      role: "web",
      shot: {
        src: "/screenshots/inventario-1.png",
        alt: {
          es: "Listado de productos del gestor de inventario con su historial de movimientos",
          en: "Inventory manager's product list with its movement history",
        },
        caption: {
          es: "Gestor de inventario para catálogos que crecen",
          en: "Inventory manager for growing catalogs",
        },
      },
    },
    {
      role: "ai",
      shot: {
        /* Reutiliza una captura real de Nautylab (no hay una dedicada a
           "integración de Gemini" todavía) — el tutor de Español demuestra
           el mismo chat en tiempo real con Gemini, en contexto de aprendizaje. */
        src: "/screenshots/Nautylab2.png",
        alt: {
          es: "Chat del tutor de Español de Nautylab respondiendo la pregunta de un estudiante, con Gemini",
          en: "Nautylab's Spanish tutor chat answering a student's question, powered by Gemini",
        },
        caption: {
          es: "Asistente de IA que responde en tiempo real — integrado con Gemini",
          en: "AI assistant that responds in real time — powered by Gemini",
        },
      },
    },
  ],

  trustHeading: { es: "Cómo trabajo", en: "How I work" },
  trust: [
    {
      es: "Explico sin tecnicismos — siempre sabrás qué se hizo y por qué.",
      en: "I explain without jargon — you'll always know what was done and why.",
    },
    {
      es: "Diagnóstico honesto: reparar cuando conviene, reemplazar cuando no.",
      en: "Honest diagnostics: repair when it makes sense, replace when it doesn't.",
    },
    {
      es: "Trabajo documentado: cada cambio queda registrado.",
      en: "Documented work: every change is on record.",
    },
  ],

  copilotNote: {
    es: "¿Tienes dudas? Pregúntale a mi asistente de IA — está en la esquina inferior derecha. Es una muestra en vivo de lo que puedo construir para tu negocio.",
    en: "Questions? Ask my AI assistant — it's in the bottom-right corner. It's a live sample of what I can build for your business.",
  },

  cta: {
    heading: { es: "Cuéntame qué necesitas", en: "Tell me what you need" },
    whatsappLabel: { es: "Escríbeme por WhatsApp", en: "Message me on WhatsApp" },
    emailLabel: { es: "Escríbeme un correo", en: "Send me an email" },
    whatsappMessage: {
      es: "Hola Dominick, vi tu sitio y necesito ayuda con...",
      en: "Hi Dominick, I saw your site and I need help with...",
    },
  },
};

/* ----------------------------- Sobre mí ----------------------------- */

export const about: AboutContent = {
  title: { es: "Sobre mí", en: "About me" },
  intro: {
    es: "Esta página existe para lo que no cabe en una tarjeta de proyecto: cómo pienso, qué aprendí a la mala, y por qué trabajo en tres capas que a primera vista parecen distintas.",
    en: "This page exists for what doesn't fit on a project card: how I think, what I learned the hard way, and why I work across three layers that look unrelated at first glance.",
  },
  stories: [
    {
      id: "accion-vs-paralisis",
      heading: {
        es: "De la parálisis a hacer las cosas",
        en: "From analysis paralysis to actually building",
      },
      body: {
        es: "Durante un tiempo quise resolver todo bien desde el primer intento, para no arrastrar deuda técnica después. El resultado no fue calidad — fue parálisis por análisis: pasaba más tiempo planeando que construyendo. Con la práctica entendí lo contrario: solo haciendo las cosas aprendes qué preparar mejor para lo que sigue. Hoy prefiero una primera versión imperfecta que enseñe algo real, sobre un plan perfecto que nunca se ejecuta.",
        en: "For a while I wanted to get everything right on the first try, so I wouldn't carry technical debt later. The result wasn't quality — it was analysis paralysis: I spent more time planning than building. With practice I learned the opposite: only by doing the work do you learn what to prepare better for what's next. Today I'd rather ship an imperfect first version that teaches me something real than polish a perfect plan that never ships.",
      },
    },
    {
      id: "cuidado-por-error",
      heading: {
        es: "Lo que aprendí rompiendo equipos",
        en: "What breaking equipment taught me",
      },
      body: {
        es: "Haciendo mantenimiento de más de 300 equipos, rompí más de un detalle que no debía tocar. No fue el mejor momento, pero fue el más formativo: me enseñó a revisar dos veces antes de actuar, a documentar cada paso, y a tratar cualquier sistema en producción — sea una computadora física o una base de datos — con el mismo respeto. Esa disciplina no vino de un curso, vino de un error real.",
        en: "Doing maintenance on 300+ machines, I broke more than one thing I wasn't supposed to touch. It wasn't my best moment, but it was the most formative one: it taught me to check twice before acting, to document every step, and to treat any system in production — whether it's a physical machine or a database — with the same respect. That discipline didn't come from a course, it came from a real mistake.",
      },
    },
    {
      id: "integridad-antes-que-velocidad",
      heading: {
        es: "Integridad antes que velocidad",
        en: "Integrity before speed",
      },
      body: {
        es: "Con los sistemas que he construido entendí que un buen diseño de base de datos hace que todo el sistema fluya casi solo. También entendí por qué las transacciones atómicas importan: una petición a medias no debería dejar datos que no existen — o se confirma todo, o no se confirma nada. Y que el async no es solo una palabra de moda: es lo que permite atender varias peticiones a la base de datos sin que una bloquee a las demás. Nada de esto se nota desde afuera cuando funciona bien — y esa es la idea.",
        en: "Building real systems taught me that a well-designed database makes the whole system flow almost on its own. It also taught me why atomic transactions matter: a half-finished request shouldn't leave behind data that shouldn't exist — either everything commits, or nothing does. And that async isn't just a buzzword — it's what lets you serve multiple database requests without one blocking the rest. None of this is visible from the outside when it works well. That's the point.",
      },
    },
    {
      id: "disenar-para-que-se-sienta-bien",
      heading: {
        es: "Diseñar para que se sienta bien, no solo para que se vea bien",
        en: "Designing for how it feels, not just how it looks",
      },
      body: {
        es: "No busco solo que algo se vea bonito — busco que usarlo se sienta bien, que cada paso tenga una intención detrás y no esté ahí por relleno. Ahí entra la accesibilidad: no como un checklist al final, sino como la diferencia entre que alguien con una dificultad pueda usar la herramienta que necesita, o quede fuera de ella. Si un detalle no aporta a esa experiencia, no se queda.",
        en: "I don't just want something to look good — I want using it to feel good, with every step carrying an actual intention instead of existing as filler. That's where accessibility comes in: not as a checklist at the end, but as the difference between someone with a disability being able to use the tool they need, or being left out of it. If a detail doesn't serve that experience, it doesn't stay.",
      },
    },
    {
      id: "por-que-tres-capas",
      heading: {
        es: "Por qué trabajo en tres capas distintas",
        en: "Why I work across three different layers",
      },
      body: {
        es: "Las redes existen, para mí, para que la información llegue sin demoras — a un compañero de trabajo o a cualquier persona que la necesite, en una red local o en internet. La automatización existe para sacar del camino los procesos tediosos y repetitivos, y sobre todo los procesos críticos donde un error humano se puede prevenir. Y la IA es la herramienta más poderosa que he usado — pero solo vale si está al servicio de las personas, no al revés. Web, redes e IA no son intereses separados: son la misma idea de utilidad, aplicada en capas distintas.",
        en: "To me, networks exist so information reaches people without delay — a coworker or anyone who needs it, on a local network or the internet. Automation exists to get tedious, repetitive processes out of the way, and especially the critical ones where a human error can be prevented. And AI is the most powerful tool I've used — but it's only worth it if it serves people, not the other way around. Web, networking, and AI aren't separate interests: they're the same idea of usefulness, applied across different layers.",
      },
    },
  ],
};

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
