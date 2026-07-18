/* ============================================================
   CONTENT.TS — FUENTE ÚNICA DE VERDAD
   ------------------------------------------------------------
   Todo el contenido del portafolio vive aquí: la UI lo consume
   directamente y el system prompt del copiloto IA se genera a
   partir de este mismo objeto.

   ► Los placeholders restantes están marcados como [[TODO: ...]].
     Busca "[[TODO" para encontrar lo que falta por rellenar.
   ► Las rutas de imágenes apuntan a /public — coloca ahí tus
     capturas y actualiza los nombres.
   ► OJO: periodos y algunos nombres son borradores plausibles —
     verifica fechas, cifras y nombres antes de publicar.
   ============================================================ */

/* ----------------------------- Tipos ----------------------------- */

export type RoleId = "web" | "it" | "ai";

export interface Role {
  id: RoleId;
  slug: string; // ruta de la página
  name: string;
  /** Token Tailwind del color de señal (clase generada por @theme) */
  signalToken: "signal-web" | "signal-it" | "signal-ai";
  tagline: string;
  description: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Screenshot {
  src: string; // ruta relativa a /public
  alt: string; // texto alternativo — obligatorio por accesibilidad
  caption?: string;
}

export interface Project {
  id: string;
  role: RoleId;
  name: string;
  title: string; // puesto/cargo en el proyecto, ej. "Desarrollador full-stack"
  period: string; // ej. "2024 — 2025"
  summary: string; // 1-2 frases para tarjetas
  description: string; // párrafo largo para la página de detalle
  achievements: string[]; // logros medibles, con evidencia
  tech: string[];
  screenshots: Screenshot[];
  links: ProjectLink[];
  /** true = proyecto central de su rol (se muestra primero y más grande) */
  featured: boolean;
}

export interface Experience {
  id: string;
  role: RoleId;
  organization: string;
  title: string; // puesto/cargo, ej. "Encargado de Turno"
  period: string;
  description: string;
  highlights: string[];
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  location: string;
  contact: {
    email: string;
    github: string;
    linkedin: string;
    cvUrl: string; // ruta al PDF en /public — una sola versión general
    cvNote: string; // ej. "versiones adaptadas disponibles bajo solicitud"
  };
}

/* ----------------------------- Perfil ----------------------------- */

export const profile: Profile = {
  name: "Dominick Ibarra Acedo",
  title: "Ingeniero en Sistemas",
  tagline:
    "Construyo software que se puede tocar: interfaces accesibles, infraestructura que no se cae e IA integrada en productos reales.",
  intro:
    "Me gusta el momento en que la tecnología deja de ser una promesa y se vuelve algo que funciona: una interfaz que cualquiera puede usar, una red que nadie nota porque nunca falla, un modelo de IA respondiendo dentro de un producto real. Trabajo en las tres capas — web, infraestructura e IA — porque los problemas reales nunca respetan una sola.",
  location: "Tijuana, México",
  contact: {
    email: "dominickomg@gmail.com",
    github: "https://github.com/nickDIA",
    linkedin: "https://www.linkedin.com/in/dominick-ia",
    cvUrl: "/cv.pdf",
    cvNote: "Versiones adaptadas por rol disponibles bajo solicitud",
  },
};

/* ----------------------------- Roles ----------------------------- */

export const roles: Role[] = [
  {
    id: "web",
    slug: "/desarrollo-web",
    name: "Desarrollo Web",
    signalToken: "signal-web",
    tagline: "Interfaces accesibles, rápidas y en tiempo real",
    description:
      "Construyo aplicaciones web donde la accesibilidad no es un extra: React moderno, WCAG 2.1 desde el diseño, y streaming en tiempo real cuando la experiencia lo pide.",
  },
  {
    id: "it",
    slug: "/servicios-it",
    name: "Servicios IT",
    signalToken: "signal-it",
    tagline: "Infraestructura que nadie nota porque no falla",
    description:
      "Soporte, redes e inventario en entornos reales — desde más de 300 equipos de un ayuntamiento hasta clientes freelance — con liderazgo operativo en piso, no solo en papel.",
  },
  {
    id: "ai",
    slug: "/ia-automatizacion",
    name: "IA & Automatización",
    signalToken: "signal-ai",
    tagline: "IA integrada en productos, no solo en prompts",
    description:
      "Integro modelos de lenguaje en aplicaciones reales: streaming SSE, prompt engineering aplicado, pipelines de generación y control de costos en producción.",
  },
];

/* ----------------------------- Proyectos ----------------------------- */

export const projects: Project[] = [
  /* ---------- Desarrollo Web ---------- */
  {
    id: "nautylab",
    role: "web",
    name: "Nautylab",
    title: "Desarrollador full-stack",
    period: "2024 — 2025", // [[TODO: verificar periodo]]
    summary:
      "Aplicación web con asistente de IA integrado: React 19, accesibilidad WCAG 2.1 y respuestas de Gemini en streaming en tiempo real.",
    description:
      "Nautylab es mi proyecto web más completo: una aplicación React 19 con un asistente de IA embebido que responde en tiempo real vía streaming SSE. La construí con la accesibilidad como requisito de primera clase — 9 funcionalidades WCAG 2.1, de la navegación por teclado a la compatibilidad con lectores de pantalla — y un backend ligero en Cloudflare Workers que protege las llaves de API y canaliza el streaming de Gemini 2.5 Flash hacia el cliente.",
    achievements: [
      "9 funcionalidades de accesibilidad WCAG 2.1 implementadas — navegable por teclado y compatible con lectores de pantalla",
      "Integración de Gemini 2.5 Flash con streaming SSE en tiempo real",
      "Backend en Cloudflare Workers que mantiene las API keys fuera del cliente",
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
        alt: "Lector de cuentos de Nautylab mostrando una historia ilustrada generada por IA, con narración paso a paso",
      },
      {
        src: "/screenshots/Nautylab2.png",
        alt: "Chat del tutor de Español respondiendo la pregunta de un estudiante sobre qué es una sílaba",
      },
      {
        src: "/screenshots/Nautylab3.png",
        alt: "Asistente de creación de cuentos, en el paso de elegir el lugar de la aventura",
      },
      {
        src: "/screenshots/Nautylab4.png",
        alt: "Resumen final del cuento generado, antes de crear la historia",
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
    name: "Gestor de Inventario",
    title: "Desarrollador",
    period: "2024", // [[TODO: verificar periodo]]
    summary:
      "Aplicación para dar de alta, mover y auditar productos de un inventario, con historial de movimientos.",
    description:
      "Gestión de inventario con lo esencial bien hecho: altas, bajas, movimientos entre ubicaciones y un historial que responde la pregunta clave de cualquier inventario — qué cambió, cuándo, y quién lo hizo.",
    achievements: [
      "Historial de movimientos consultable por producto",
      "Búsqueda y filtrado pensados para catálogos que crecen",
    ],
    tech: ["[[TODO: tecnologías usadas]]"],
    screenshots: [
      {
        src: "/screenshots/inventario-1.png",
        alt: "Listado de productos del gestor de inventario con su historial de movimientos",
      },
    ],
    links: [{ label: "Repositorio", url: "[[TODO: URL del repo]]" }],
    featured: false,
  },

  /* ---------- Servicios IT ---------- */
  {
    id: "nucleo",
    role: "it",
    name: "Núcleo",
    title: "Diseño y desarrollo del sistema",
    period: "2025 — presente", // [[TODO: verificar periodo]]
    summary:
      "Sistema de gestión de activos IT con auditoría transaccional: cada cambio de estado queda registrado con quién, cuándo y por qué — o se revierte completo.",
    description:
      "Núcleo nace de una necesidad que viví gestionando inventario IT: los cambios de estado de los activos se pierden si la auditoría es opcional. Su corazón técnico es la transacción atómica — cada cambio de estado genera su entrada de auditoría (timestamp, motivo, técnico) en la misma transacción, y ante cualquier fallo ambos se revierten juntos. Nunca queda un cambio a medias. La demo interactiva de esta página simula ese comportamiento exacto en el frontend.",
    achievements: [
      "Auditoría transaccional: cambio de estado y registro de auditoría atómicos — o ambos o ninguno",
      "Guión visual 'El viaje de una petición' para explicar la arquitectura a perfiles no técnicos",
    ],
    tech: ["[[TODO: tecnologías del backend real de Núcleo]]"],
    screenshots: [
      {
        src: "/screenshots/nucleo-1.png",
        alt: "Panel de activos de Núcleo con su registro de auditoría",
      },
    ],
    links: [],
    featured: true,
  },

  /* ---------- IA & Automatización ---------- */
  {
    id: "copiloto-ia",
    role: "ai",
    name: "Copiloto IA del portafolio",
    title: "Diseño e implementación end-to-end",
    period: "2026",
    summary:
      "Asistente conversacional real (no mockup) embebido en este sitio, que responde sobre mi experiencia usando la API de Gemini — su system prompt se genera desde este mismo archivo de datos.",
    description:
      "Cloudflare Worker como proxy a la API de Gemini: la API key vive como secret en el Worker y nunca toca el cliente. El system prompt se genera automáticamente desde este mismo archivo de datos (los placeholders sin rellenar se filtran), así las respuestas quedan ancladas a hechos verificables. Los límites — 15 mensajes por sesión, 512 tokens de salida, validación estricta del historial — se aplican en el servidor, no solo en la UI: control de costo y abuso desde el diseño. El streaming SSE de Gemini se canaliza directo al widget, que es un dock persistente accesible desde cualquier página del sitio.",
    achievements: [
      "API key protegida en el Worker como secret — cero exposición en cliente",
      "Respuestas ancladas a datos reales vía system prompt generado desde content.ts",
      "Límites de uso (mensajes por sesión y tokens de salida) como decisión de ingeniería de costos",
    ],
    tech: ["Gemini API (Google)", "Cloudflare Workers", "TypeScript", "SSE (Server-Sent Events)"],
    screenshots: [],
    links: [],
    featured: true,
  },
  {
    id: "integracion-gemini",
    role: "ai",
    name: "Integración de Gemini en Nautylab",
    title: "Desarrollador — integración de IA",
    period: "2025", // [[TODO: verificar periodo]]
    summary:
      "Integración de Gemini 2.5 Flash con streaming SSE, prompt engineering aplicado y pipeline de generación de imágenes en dos etapas.",
    description:
      "El asistente de Nautylab responde en tiempo real: cada token del modelo viaja por SSE desde un Cloudflare Worker hasta la interfaz, sin esperar la respuesta completa. El prompt engineering está aplicado a producto — instrucciones de sistema que anclan el tono y el alcance del asistente — y la generación de imágenes funciona en dos etapas: primero el modelo interpreta y refina la petición del usuario, y después la etapa de generación produce la imagen con ese prompt optimizado.",
    achievements: [
      "Streaming SSE de respuestas en tiempo real",
      "Pipeline de generación de imágenes en dos etapas: refinamiento del prompt y generación",
      "Prompt engineering aplicado: el asistente mantiene tono y alcance definidos por instrucciones de sistema",
    ],
    tech: ["Gemini 2.5 Flash", "SSE (Server-Sent Events)", "Prompt engineering", "Cloudflare Workers AI"],
    screenshots: [
      {
        src: "/screenshots/gemini-integracion-1.png",
        alt: "Respuesta del asistente de Nautylab llegando en streaming, token a token",
      },
    ],
    links: [],
    featured: false,
  },
  {
    id: "alexa-skill",
    role: "ai",
    name: "Skill de Alexa",
    title: "Desarrollador",
    period: "2024", // [[TODO: verificar periodo]]
    summary:
      "Skill de voz para Alexa construida en Python: interacción conversacional de extremo a extremo, del enunciado del usuario a la respuesta hablada.",
    description:
      "Una skill de Alexa desarrollada en Python con el Alexa Skills Kit: define intents, procesa los enunciados del usuario y construye respuestas habladas. Fue mi primer contacto con interfaces conversacionales — diseñar para voz obliga a pensar en el flujo del diálogo, no en pantallas.",
    achievements: [
      "Manejo de intents y slots para conversaciones de varios turnos",
    ],
    tech: ["Python", "Alexa Skills Kit", "Interacción por voz"],
    screenshots: [],
    links: [{ label: "Repositorio", url: "[[TODO: URL del repo, o elimina este enlace]]" }],
    featured: false,
  },
];

/* ----------------------------- Experiencia ----------------------------- */

export const experience: Experience[] = [
  {
    id: "ayuntamiento",
    role: "it",
    organization: "Ayuntamiento de Tijuana", // [[TODO: verificar nombre oficial]]
    title: "Soporte técnico e inventario IT",
    period: "2024 — 2025", // [[TODO: verificar periodo]]
    description:
      "Soporte técnico e inventario de más de 300 equipos de cómputo y su red: diagnóstico y reparación, altas y bajas de equipo, y mantenimiento del registro que permite saber dónde está cada activo y en qué estado.",
    highlights: [
      "Inventario y soporte de más de 300 equipos de cómputo",
      "Soporte de redes y atención directa a usuarios de distintas áreas",
    ],
  },
  {
    id: "freelance-it",
    role: "it",
    organization: "Freelance",
    title: "Técnico IT independiente",
    period: "2023 — presente", // [[TODO: verificar periodo]]
    description:
      "Servicios IT para pequeños negocios y particulares: armado y mantenimiento de equipos, instalación de redes, respaldo y recuperación de información, y asesoría para decidir qué comprar y qué reparar.",
    highlights: [
      "Clientes recurrentes gracias a trabajo confiable y explicaciones sin tecnicismos",
      "Diagnósticos honestos: reparar cuando conviene, reemplazar cuando no",
    ],
  },
  {
    id: "liderazgo-operativo",
    role: "it",
    organization: "Sector retail", // [[TODO: nombre de la empresa]]
    title: "Encargado de Turno",
    period: "2023 — 2024", // [[TODO: verificar periodo]]
    description:
      "Liderazgo operativo con responsabilidad completa del turno: coordinación del personal, control de inventario y manejo de valores. Liderazgo en piso — resolver con la gente enfrente, no desde un escritorio.",
    highlights: [
      "Coordinación del personal y de la operación diaria del turno",
      "Responsable de cortes de caja, inventario y manejo de valores",
    ],
  },
];

/* ----------------------------- Utilidades ----------------------------- */

/** true si el campo sigue siendo un placeholder [[TODO sin rellenar */
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
