import { useEffect, useState } from "react";
import { DynamicBackground } from "./components/DynamicBackground";

type Lang = "fa" | "en";

const TELEGRAM = "https://t.me/Texa_Support";

const copy = {
  fa: {
    dir: "rtl" as const,
    message: "هنوز شروع به کار نکرده‌ایم",
    sub: "چیزی ارزشمند در دل سکوت شکل می‌گیرد.",
    cta: "ارتباط در تلگرام",
    other: "EN",
  },
  en: {
    dir: "ltr" as const,
    message: "We haven't started yet",
    sub: "Something worth waiting for is quietly taking shape.",
    cta: "Message on Telegram",
    other: "فا",
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
        <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
          <span className="font-display text-[11px] tracking-[0.55em] text-gold/70">TEXA</span>
          <button
            onClick={() => setLang(lang === "fa" ? "en" : "fa")}
            className="rounded-full border border-gold/20 px-4 py-1.5 text-[11px] tracking-[0.18em] text-gold-light/80 backdrop-blur-sm transition hover:border-gold/50 hover:bg-gold/10"
          >
            {t.other}
          </button>
        </header>

        {/* Spacer keeps the eagle's head and eye fully visible */}
        <div className="flex-1" aria-hidden />

        <main className="relative z-20 mx-auto flex w-full max-w-xl flex-col items-center px-6 pb-10 text-center sm:px-10 sm:pb-12">
          <h1
            className="animate-rise gold-text text-[1.85rem] font-extrabold leading-snug sm:text-4xl md:text-[2.75rem]"
            style={{
              animationDelay: "0.12s",
              fontFamily: lang === "en" ? "var(--font-display)" : undefined,
              letterSpacing: lang === "en" ? "0.02em" : undefined,
            }}
          >
            {t.message}
          </h1>

          <div className="animate-rise mt-5 flex items-center gap-3" style={{ animationDelay: "0.28s" }}>
            <span className="divider-line w-10 sm:w-16" />
            <span className="h-1.5 w-1.5 rotate-45 border border-gold/60" />
            <span className="divider-line w-10 sm:w-16" />
          </div>

          <p
            className="animate-rise mt-5 max-w-sm text-sm leading-7 text-[#efe7d4]/55 sm:text-[15px]"
            style={{ animationDelay: "0.4s" }}
          >
            {t.sub}
          </p>

          <a
            href={TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold animate-rise mt-8 inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-sm font-bold tracking-wide"
            style={{ animationDelay: "0.55s" }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M21.9 4.3a1.2 1.2 0 0 0-1.2-.2L2.9 11c-.9.3-.9 1.6 0 1.9l4.5 1.4 1.7 5.3c.2.6.9.8 1.4.4l2.5-2.1 4.6 3.4c.6.4 1.4.1 1.6-.6l3.1-15.1c.1-.4 0-.8-.4-1zM9.6 13.9l8.1-5-6.2 6.3-.3 3-1.6-4.3z" />
            </svg>
            {t.cta}
          </a>
        </main>

        <footer className="relative z-20 px-6 pb-5 text-center text-[10px] tracking-[0.22em] text-[#efe7d4]/25">
          © {new Date().getFullYear()}
        </footer>
      </DynamicBackground>
    </div>
  );
}
