/* ============================================================
   PRERENDER — congela el <head> de cada ruta en HTML estático.
   ------------------------------------------------------------
   Corre después de `vite build` (ver script "build" en package.json,
   el mismo que ejecuta Cloudflare Pages). Para cada una de las 8
   rutas escribe dist/<ruta>/index.html con su título, descripción,
   canonical, Open Graph, Twitter Card y hreflang — para que los
   scrapers sociales, que NO ejecutan JS, vean el preview correcto
   por idioma. También emite dist/sitemap.xml.

   La fuente de las etiquetas es src/seo/meta.ts, el MISMO módulo
   que usa el hook de runtime — se carga aquí en Node vía la API de
   Vite (ssrLoadModule), sin necesidad de un navegador ni de
   dependencias extra.
   ============================================================ */

import { createServer } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");

const SEO_BLOCK = /<!-- SEO:start[\s\S]*?<!-- SEO:end -->/;
const HTML_LANG = /<html lang="[^"]*">/;

/** dist/index.html para "/", dist/<ruta>/index.html para el resto. */
function outFile(path) {
  return path === "/"
    ? join(distDir, "index.html")
    : join(distDir, path.replace(/^\//, ""), "index.html");
}

async function main() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "warn",
  });

  let ROUTES, headForPath, renderHeadTags, renderSitemap;
  try {
    ({ ROUTES, headForPath, renderHeadTags, renderSitemap } =
      await vite.ssrLoadModule("/src/seo/meta.ts"));
  } finally {
    await vite.close();
  }

  const template = await readFile(join(distDir, "index.html"), "utf-8");

  for (const path of ROUTES) {
    const head = headForPath(path);
    const html = template
      .replace(HTML_LANG, `<html lang="${head.lang}">`)
      .replace(
        SEO_BLOCK,
        `<!-- SEO:start (prerender) -->\n    ${renderHeadTags(head)}\n    <!-- SEO:end -->`,
      );

    const file = outFile(path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html, "utf-8");
    console.log(`  prerendered ${path} → ${file.slice(distDir.length + 1)}`);
  }

  await writeFile(join(distDir, "sitemap.xml"), renderSitemap(), "utf-8");
  console.log(`  sitemap.xml (${ROUTES.length} rutas)`);
  console.log(`✓ prerender: ${ROUTES.length} rutas`);
}

main().catch((err) => {
  console.error("✗ prerender falló:", err);
  process.exit(1);
});
