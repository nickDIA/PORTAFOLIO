/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dominio canónico del sitio para canonical/OG (default: producción en Pages). */
  readonly VITE_SITE_URL?: string;
}
