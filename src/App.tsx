import { useEffect, useState } from "react";
import { DynamicBackground } from "./components/DynamicBackground";

type Lang = "fa" | "en";

const TELEGRAM = "https://t.me/Texa_Support";

const copy = {
  fa: {
    dir: "rtl" as const,
    studio: "استودیو تکسا",
    eyebrow: "TEXA STUDIO",
    message: "هنوز شروع به کار نکرده‌ایم",
    sub: "چیزی ارزشمند در دل سکوت شکل می‌گیرد. به‌زودی با شما خواهیم بود.",
    cta: "ارتباط با ما در تلگرام",
    other: "English",
    rights: "تمامی حقوق برای استودیو تکسا محفوظ است.",
  },
  en: {
    dir: "ltr" as const,
    studio: "Texa Studio",
    eyebrow: "استودیو تکسا",
    message: "We haven't started yet",
    sub: "Something worth waiting for is quietly taking shape. We'll be with you soon.",
    cta: "Contact us on Telegram",
    other: "فارسی",
    rights: "All rights reserved to Texa Studio.",
  },
};

export default function App() {
  const [lang, setLang] = useState<Lang>("fa");
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = lang === "fa" ? "استودیو تکسا | Texa Studio" : "Texa Studio | استودیو تکسا";
  }, [lang, t]);

  return (
    <div dir={t.dir} className="grain relative min-h-screen bg-[#060608]">
      <DynamicBackground>
        {/* Header */}
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 sm:px-10">
          <span className="font-display text-xs tracking-[0.5em] text-gold/80">TEXA</span>
          <button
            onClick={() => setLang(lang === "fa" ? "en" : "fa")}
            className="rounded-full border border-gold/25 px-5 py-1.5 text-xs tracking-wide text-gold-light/90 backdrop-blur transition hover:border-gold hover:bg-gold/10"
          >
            {t.other}
          </button>
        </header>

        {/* Hero */}
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-16 pt-4 text-center sm:px-10">
          <span
            className="animate-rise font-display text-[11px] tracking-[0.55em] text-gold/60 sm:text-xs"
            style={{ animationDelay: "0.05s" }}
          >
            {t.eyebrow}
          </span>

          <h1
            className="animate-rise gold-text mt-6 text-5xl font-extrabold leading-[1.15] sm:text-6xl md:text-7xl"
            style={{
              animationDelay: "0.15s",
              fontFamily: lang === "en" ? "var(--font-display)" : undefined,
              letterSpacing: lang === "en" ? "0.03em" : undefined,
            }}
          >
            {t.studio}
          </h1>

          <div className="animate-rise mt-8 flex items-center gap-4" style={{ animationDelay: "0.3s" }}>
            <span className="divider-line w-14 sm:w-20" />
            <span className="h-1.5 w-1.5 rotate-45 border border-gold/70" />
            <span className="divider-line w-14 sm:w-20" />
          </div>

          <p
            className="animate-rise mt-8 text-lg font-medium text-[#f3dca3]/90 sm:text-xl"
            style={{ animationDelay: "0.4s" }}
          >
            {t.message}
          </p>
          <p
            className="animate-rise mt-4 max-w-md text-sm leading-7 text-[#efe7d4]/50 sm:text-base"
            style={{ animationDelay: "0.5s" }}
          >
            {t.sub}
          </p>

          <a
            href={TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold animate-rise group mt-12 inline-flex items-center gap-3 rounded-full px-9 py-4 text-sm font-bold tracking-wide sm:text-base"
            style={{ animationDelay: "0.6s" }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M21.9 4.3a1.2 1.2 0 0 0-1.2-.2L2.9 11c-.9.3-.9 1.6 0 1.9l4.5 1.4 1.7 5.3c.2.6.9.8 1.4.4l2.5-2.1 4.6 3.4c.6.4 1.4.1 1.6-.6l3.1-15.1c.1-.4 0-.8-.4-1zM9.6 13.9l8.1-5-6.2 6.3-.3 3-1.6-4.3z" />
            </svg>
            {t.cta}
          </a>

          <a
            href={TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="animate-rise mt-5 text-xs tracking-[0.2em] text-gold/50 transition hover:text-gold-light"
            style={{ animationDelay: "0.7s" }}
          >
            @Texa_Support
          </a>
        </main>

        {/* Footer */}
        <footer className="border-t border-gold/10 px-6 py-6 text-center text-[11px] text-[#efe7d4]/30">
          © {new Date().getFullYear()} {t.studio} — {t.rights}
        </footer>
      </DynamicBackground>
    </div>
  );
}
