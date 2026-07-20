import { about } from "../data/content";
import { useT } from "../i18n/locale";
import { ui } from "../i18n/ui";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const storyDelays = ["0.1s", "0.2s", "0.3s", "0.4s", "0.5s"];

export default function SobreMi() {
  const t = useT();
  useDocumentTitle(t(about.title));

  return (
    <div className="space-y-16">
      <header className="fade-up max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted">
          {t(ui.about.eyebrow)}
        </p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
          {t(about.title)}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-text-muted leading-relaxed">
          {t(about.intro)}
        </p>
      </header>

      <section aria-label={t(ui.about.storiesLabel)} className="space-y-6">
        {about.stories.map((story, i) => (
          <article
            key={story.id}
            className="fade-up rounded-lg bg-surface p-6 sm:p-8"
            style={{ animationDelay: storyDelays[i % storyDelays.length] }}
          >
            <h2 className="font-display text-xl font-semibold">
              {t(story.heading)}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-text-muted">
              {t(story.body)}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
