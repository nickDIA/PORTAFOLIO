import { useRef, useState } from "react";
import { useLocale, useT } from "../../i18n/locale";
import { ui } from "../../i18n/ui";

/* ============================================================
   Demo interactiva de Núcleo — simulación de transacción atómica.

   Todo ocurre en React state (sin backend): al cambiar el estado
   de un activo, el cambio y su entrada de auditoría avanzan
   juntos por la transacción. Con "forzar error", el fallo llega
   a mitad de la transacción y AMBOS cambios se revierten juntos
   — la demostración en vivo del corazón técnico de Núcleo.

   Los fragmentos con forma de SQL (BEGIN TRANSACTION, UPDATE...,
   COMMIT) se dejan idénticos en ambos idiomas a propósito —
   representan código/salida de consola, no prosa.
   ============================================================ */

type Estado = "Operativo" | "En mantenimiento" | "De baja";

interface Activo {
  id: string;
  nombre: string;
  estado: Estado;
}

interface EntradaAuditoria {
  id: number;
  hora: string;
  activoId: string;
  de: Estado;
  a: Estado;
  tecnico: string;
  status: "pendiente" | "confirmada" | "revertida";
}

interface LineaConsola {
  id: number;
  text: string;
  tone: "info" | "ok" | "error";
}

const CICLO: Estado[] = ["Operativo", "En mantenimiento", "De baja"];

const siguienteEstado = (e: Estado): Estado =>
  CICLO[(CICLO.indexOf(e) + 1) % CICLO.length];

const TECNICO = "D. Ibarra";

const badge: Record<Estado, string> = {
  Operativo: "border-signal-ai/40 text-signal-ai",
  "En mantenimiento": "border-signal-it/40 text-signal-it",
  "De baja": "border-text-muted/40 text-text-muted",
};

const ACTIVOS_INICIALES: Activo[] = [
  { id: "ACT-014", nombre: "Laptop Dell Latitude 5420", estado: "Operativo" },
  { id: "ACT-027", nombre: "Impresora HP LaserJet M404", estado: "En mantenimiento" },
  { id: "ACT-033", nombre: "Switch Cisco Catalyst 2960", estado: "Operativo" },
];

const hora = (locale: string, msAtras = 0) =>
  new Date(Date.now() - msAtras).toLocaleTimeString(
    locale === "es" ? "es-MX" : "en-US",
    { hour12: false },
  );

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function NucleoDemo() {
  const t = useT();
  const locale = useLocale();
  const [activos, setActivos] = useState(ACTIVOS_INICIALES);
  const [auditoria, setAuditoria] = useState<EntradaAuditoria[]>(() => [
    {
      id: -1,
      hora: hora(locale, 8 * 60000),
      activoId: "ACT-027",
      de: "Operativo",
      a: "En mantenimiento",
      tecnico: TECNICO,
      status: "confirmada",
    },
  ]);
  const [consola, setConsola] = useState<LineaConsola[]>([]);
  const [running, setRunning] = useState(false);
  const [forzarError, setForzarError] = useState(false);
  const nextId = useRef(1);

  const log = (text: string, tone: LineaConsola["tone"] = "info") =>
    setConsola((c) => [...c, { id: nextId.current++, text, tone }]);

  async function transaccion(activo: Activo) {
    if (running) return;
    setRunning(true);
    setConsola([]);

    const de = activo.estado;
    const a = siguienteEstado(de);
    const fallara = forzarError;
    const entradaId = nextId.current++;

    log("BEGIN TRANSACTION");
    await sleep(500);

    /* 1. El estado del activo cambia — aún sin confirmar */
    setActivos((as) =>
      as.map((x) => (x.id === activo.id ? { ...x, estado: a } : x)),
    );
    log(`UPDATE activos SET estado='${a}' WHERE id='${activo.id}'  ✓`, "ok");
    await sleep(550);

    /* 2. La entrada de auditoría nace en la MISMA transacción */
    setAuditoria((au) => [
      {
        id: entradaId,
        hora: hora(locale),
        activoId: activo.id,
        de,
        a,
        tecnico: TECNICO,
        status: "pendiente",
      },
      ...au,
    ]);

    if (fallara) {
      log("INSERT INTO auditoria (activo, de, a, motivo, tecnico)  ✗", "error");
      await sleep(500);
      log(t(ui.nucleoDemo.logErrorSimulated), "error");
      await sleep(600);
      log(t(ui.nucleoDemo.logRollback));

      /* Rollback atómico: estado y auditoría se revierten JUNTOS */
      setActivos((as) =>
        as.map((x) => (x.id === activo.id ? { ...x, estado: de } : x)),
      );
      setAuditoria((au) =>
        au.map((e) => (e.id === entradaId ? { ...e, status: "revertida" } : e)),
      );
      await sleep(1600);
      setAuditoria((au) => au.filter((e) => e.id !== entradaId));
      log(t(ui.nucleoDemo.logAborted), "ok");
      setForzarError(false);
    } else {
      log("INSERT INTO auditoria (activo, de, a, motivo, tecnico)  ✓", "ok");
      await sleep(550);
      log("COMMIT  ✓", "ok");
      setAuditoria((au) =>
        au.map((e) => (e.id === entradaId ? { ...e, status: "confirmada" } : e)),
      );
    }

    setRunning(false);
  }

  return (
    <div className="rounded-lg border border-signal-it/30 bg-surface p-6 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-it">
        {t(ui.nucleoDemo.eyebrow)}
      </p>
      <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold tracking-tight">
        {t(ui.nucleoDemo.title)}
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
        {t(ui.nucleoDemo.introBefore)}{" "}
        <span className="font-mono text-danger">
          {t(ui.nucleoDemo.forceErrorTerm)}
        </span>{" "}
        {t(ui.nucleoDemo.introAfter)}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* ============ Columna izquierda: activos + control de error ============ */}
        <div className="space-y-6">
          <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted">
            {t(ui.nucleoDemo.assetsHeading)}
          </h4>
          <ul aria-label={t(ui.nucleoDemo.assetsListLabel)} className="space-y-3">
            {activos.map((activo) => (
              <li
                key={activo.id}
                className="rounded-lg border border-text/10 bg-ink p-4"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="font-mono text-xs text-text-muted">
                    {activo.id}
                  </span>
                  <span className="text-sm font-medium">{activo.nombre}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`rounded border px-2 py-0.5 font-mono text-xs ${badge[activo.estado]}`}
                  >
                    {t(ui.nucleoDemo.estado[activo.estado])}
                  </span>
                  <button
                    type="button"
                    onClick={() => transaccion(activo)}
                    disabled={running}
                    className="rounded border border-signal-it/40 px-3 py-1.5 font-mono text-xs text-signal-it transition-colors hover:bg-signal-it/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    → {t(ui.nucleoDemo.estado[siguienteEstado(activo.estado)])}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setForzarError((v) => !v)}
            disabled={running}
            aria-pressed={forzarError}
            className={`w-full rounded border px-4 py-2.5 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              forzarError
                ? "border-danger bg-danger/10 text-danger"
                : "border-text-muted/30 text-text-muted hover:border-danger/60 hover:text-danger"
            }`}
          >
            {forzarError
              ? t(ui.nucleoDemo.forceErrorOn)
              : t(ui.nucleoDemo.forceErrorOff)}
          </button>
        </div>

        {/* ============ Columna derecha: consola + auditoría ============ */}
        <div className="space-y-6">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted">
              {t(ui.nucleoDemo.consoleHeading)}
            </h4>
            <div
              role="log"
              aria-live="polite"
              aria-label={t(ui.nucleoDemo.consoleHeading)}
              className="mt-3 min-h-32 rounded-lg border border-text/10 bg-ink p-4 font-mono text-xs leading-relaxed"
            >
              {consola.length === 0 ? (
                <p className="text-text-muted">{t(ui.nucleoDemo.consoleWaiting)}</p>
              ) : (
                consola.map((l) => (
                  <p
                    key={l.id}
                    className={
                      l.tone === "ok"
                        ? "text-signal-ai"
                        : l.tone === "error"
                          ? "text-danger"
                          : "text-text"
                    }
                  >
                    {l.text}
                  </p>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted">
              {t(ui.nucleoDemo.auditHeading)}
            </h4>
            <ul
              aria-live="polite"
              aria-label={t(ui.nucleoDemo.auditHeading)}
              className="mt-3 space-y-3"
            >
              {auditoria.map((e) => (
                <li
                  key={e.id}
                  className={`rounded-lg border p-4 transition-opacity ${
                    e.status === "pendiente"
                      ? "border-dashed border-signal-it/40 opacity-70"
                      : e.status === "revertida"
                        ? "border-dashed border-danger/50 opacity-50"
                        : "border-text/10"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-text-muted">
                    <span>{e.hora}</span>
                    <span>{e.activoId}</span>
                    {e.status === "pendiente" && (
                      <span className="text-signal-it">
                        · {t(ui.nucleoDemo.unconfirmed)}
                      </span>
                    )}
                    {e.status === "revertida" && (
                      <span className="text-danger">
                        · {t(ui.nucleoDemo.revertedByRollback)}
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm ${e.status === "revertida" ? "line-through" : ""}`}
                  >
                    <span className="font-mono text-xs">
                      {t(ui.nucleoDemo.estado[e.de])}
                    </span>
                    <span aria-hidden="true" className="mx-2 text-signal-it">
                      →
                    </span>
                    <span className="font-mono text-xs">
                      {t(ui.nucleoDemo.estado[e.a])}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {t(ui.nucleoDemo.motivo[e.a])} · {e.tecnico}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
