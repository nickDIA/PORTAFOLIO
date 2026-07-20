import type { LocalizedText } from "./locale";

/* ============================================================
   Diccionario de texto de interfaz — todo lo que NO viene de
   content.ts (chrome de navegación, la demo de Núcleo, el
   copiloto, encabezados de sección). El contenido "real" del
   portafolio (perfil, roles, proyectos, experiencia) vive en
   content.ts como LocalizedText por campo.
   ============================================================ */

export const ui = {
  layout: {
    skipLink: { es: "Saltar al contenido", en: "Skip to content" },
    brand: { es: "Portafolio", en: "Portfolio" },
    navLabel: { es: "Navegación principal", en: "Main navigation" },
    footer: {
      es: "© 2026 — construido con React, TypeScript y Tailwind CSS",
      en: "© 2026 — built with React, TypeScript, and Tailwind CSS",
    },
  } satisfies Record<string, LocalizedText>,

  home: {
    presentationLabel: { es: "Presentación", en: "Introduction" },
    aboutHeading: { es: "Sobre mí", en: "About me" },
    contactHeading: { es: "Contacto", en: "Contact" },
    explore: { es: "explorar →", en: "explore →" },
    pending: { es: "pendiente", en: "pending" },
    downloadCv: { es: "Descargar CV", en: "Download Resume" },
    readMore: { es: "Leer más →", en: "Read more →" },
  } satisfies Record<string, LocalizedText>,

  about: {
    navLabel: { es: "Sobre mí", en: "About" },
    eyebrow: { es: "quién soy", en: "who I am" },
    storiesLabel: { es: "Historias", en: "Stories" },
  } satisfies Record<string, LocalizedText>,

  role: {
    label: { es: "rol", en: "role" },
  } satisfies Record<string, LocalizedText>,

  project: {
    featuredLabel: { es: "proyecto central", en: "featured project" },
    achievementsHeading: { es: "Logros", en: "Achievements" },
    supportOne: { es: "Proyecto de apoyo", en: "Supporting project" },
    supportMany: { es: "Proyectos de apoyo", en: "Supporting projects" },
    pendingScreenshot: {
      es: "[ captura pendiente ]",
      en: "[ screenshot pending ]",
    },
    linkPendingTitle: {
      es: "Enlace pendiente de configurar en content.ts",
      en: "Link pending — to be added in content.ts",
    },
    pendingSuffix: { es: "pendiente", en: "pending" },
  } satisfies Record<string, LocalizedText>,

  nucleoDemo: {
    eyebrow: { es: "demo interactiva", en: "interactive demo" },
    title: {
      es: "La transacción atómica, en vivo",
      en: "The atomic transaction, live",
    },
    introBefore: {
      es: "Cambia el estado de un activo: el cambio y su entrada de auditoría viajan en la misma transacción. Activa",
      en: "Change an asset's status: the change and its audit entry travel in the same transaction. Turn on",
    },
    forceErrorTerm: { es: "forzar error", en: "force error" },
    introAfter: {
      es: "y verás el rollback — ambos se revierten juntos, nunca queda un cambio a medias.",
      en: "and you'll see the rollback — both revert together, never a partial change.",
    },
    assetsHeading: { es: "Activos", en: "Assets" },
    assetsListLabel: { es: "Activos gestionados", en: "Managed assets" },
    forceErrorOff: {
      es: "forzar error en la siguiente transacción",
      en: "force an error on the next transaction",
    },
    forceErrorOn: {
      es: "⚠ forzar error: ACTIVADO — la siguiente transacción fallará",
      en: "⚠ force error: ON — the next transaction will fail",
    },
    consoleHeading: { es: "Consola de transacción", en: "Transaction console" },
    consoleWaiting: {
      es: "— esperando transacción —",
      en: "— waiting for transaction —",
    },
    auditHeading: { es: "Registro de auditoría", en: "Audit log" },
    unconfirmed: { es: "sin confirmar", en: "unconfirmed" },
    revertedByRollback: {
      es: "revertida por rollback",
      en: "reverted by rollback",
    },
    estado: {
      Operativo: { es: "Operativo", en: "Operational" },
      "En mantenimiento": { es: "En mantenimiento", en: "Under maintenance" },
      "De baja": { es: "De baja", en: "Decommissioned" },
    } satisfies Record<string, LocalizedText>,
    motivo: {
      Operativo: {
        es: "Reparación completada y verificada",
        en: "Repair completed and verified",
      },
      "En mantenimiento": {
        es: "Falla reportada por el usuario",
        en: "Failure reported by the user",
      },
      "De baja": {
        es: "Fin de vida útil",
        en: "End of useful life",
      },
    } satisfies Record<string, LocalizedText>,
    logErrorSimulated: {
      es: "ERROR simulado: conexión con la base de datos perdida",
      en: "Simulated error: database connection lost",
    },
    logRollback: {
      es: "ROLLBACK — revirtiendo ambos cambios…",
      en: "ROLLBACK — reverting both changes…",
    },
    logAborted: {
      es: "Transacción abortada — sin cambios parciales  ✓",
      en: "Transaction aborted — no partial changes  ✓",
    },
  },

  viajePeticion: {
    stagePeticion: { es: "petición", en: "request" },
    stageValidacion: { es: "validación", en: "validation" },
    stageTransaccion: { es: "transacción", en: "transaction" },
    stageRespuesta: { es: "respuesta", en: "response" },
    changeOfState: { es: "cambio de estado", en: "state change" },
    auditEntry: { es: "entrada de auditoría", en: "audit entry" },
    atomic: { es: "atómico", en: "atomic" },
    ariaLabel: {
      es: "Diagrama del viaje de una petición en Núcleo: la petición pasa por validación y llega a una transacción que escribe simultáneamente el cambio de estado y la entrada de auditoría; ambas convergen en la respuesta — se confirman juntas o se revierten juntas.",
      en: "Diagram of a request's journey through Núcleo: the request passes through validation and reaches a transaction that simultaneously writes the state change and the audit entry; both converge in the response — they commit together or roll back together.",
    },
    caption: {
      es: "El viaje de una petición — las dos escrituras se confirman juntas o se revierten juntas.",
      en: "The journey of a request — both writes commit together or roll back together.",
    },
  } satisfies Record<string, LocalizedText>,

  chatDock: {
    dockLabel: { es: "Copiloto IA", en: "AI Copilot" },
    subtitle: {
      es: "respuestas ancladas a los datos de este sitio",
      en: "answers grounded in this site's data",
    },
    closeAriaLabel: { es: "Cerrar copiloto", en: "Close copilot" },
    conversationAriaLabel: {
      es: "Conversación con el copiloto",
      en: "Conversation with the copilot",
    },
    intro: {
      es: "Pregúntame por la experiencia y los proyectos de Dominick — respondo solo con datos reales del portafolio.",
      en: "Ask me about Dominick's experience and projects — I answer only with real data from the portfolio.",
    },
    suggestions: [
      { es: "¿Qué es Nautylab?", en: "What is Nautylab?" },
      {
        es: "¿Qué experiencia tiene en IT?",
        en: "What IT experience does he have?",
      },
      {
        es: "¿Cómo ha integrado IA en sus proyectos?",
        en: "How has he integrated AI into his projects?",
      },
    ] satisfies LocalizedText[],
    inputLabel: { es: "Escribe tu pregunta", en: "Type your question" },
    respondingPlaceholder: { es: "respondiendo…", en: "responding…" },
    send: { es: "enviar", en: "send" },
    limitReached: {
      es: "Límite de la sesión alcanzado ({n} mensajes) — escríbeme por email para continuar.",
      en: "Session limit reached ({n} messages) — email me to continue.",
    },
    errorPrefix: {
      es: "El copiloto no pudo responder",
      en: "The copilot couldn't respond",
    },
    networkError: { es: "error de red", en: "network error" },
  } satisfies Record<string, LocalizedText | LocalizedText[]>,

  desarrolloWeb: {
    codeHeading: { es: "El código está abierto", en: "The code is open" },
    codeParagraph: {
      es: "Los repositorios públicos están en GitHub — la evidencia se puede leer, no solo mirar.",
      en: "Public repositories are on GitHub — the evidence can be read, not just looked at.",
    },
    githubPending: { es: "GitHub · pendiente", en: "GitHub · pending" },
    viewGithub: { es: "Ver GitHub ↗", en: "View GitHub ↗" },
  } satisfies Record<string, LocalizedText>,

  serviciosIT: {
    experienceHeading: { es: "Experiencia", en: "Experience" },
  } satisfies Record<string, LocalizedText>,

  iaAutomatizacion: {
    liveProofLabel: { es: "prueba viva", en: "live proof" },
    tryNowLabel: { es: "en vivo — pruébalo ahora", en: "live — try it now" },
    tryNowBefore: {
      es: "Abre el dock",
      en: "Open the",
    },
    tryNowAfter: {
      es: "en la esquina inferior derecha y pregúntale por mi experiencia: responde anclado a los datos de este sitio, con streaming en tiempo real.",
      en: "dock in the bottom-right corner and ask about my experience: it answers grounded in this site's data, with real-time streaming.",
    },
    engineeringDecisionsHeading: {
      es: "Decisiones de ingeniería",
      en: "Engineering decisions",
    },
    deepDiveLabel: { es: "deep-dive técnico", en: "technical deep-dive" },
    geminiIntegrationLabel: {
      es: "Integración de Gemini",
      en: "Gemini integration",
    },
  } satisfies Record<string, LocalizedText>,
} as const;
