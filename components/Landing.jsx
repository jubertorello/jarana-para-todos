"use client";

import { useEffect, useRef, useState } from "react";
import { COPY, CITIES, PARTNERS } from "@/lib/copy";

const TICKET_URL = process.env.NEXT_PUBLIC_TICKET_URL || "https://site.fourvenues.com/es/jarana";
const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP || "34600000000").replace(/[^0-9]/g, "");
const HANDLE = process.env.NEXT_PUBLIC_IG_HANDLE || "@jarana_para_todos";
const IG_URL = "https://instagram.com/" + HANDLE.replace("@", "");
const WA_URL = "https://wa.me/" + WHATSAPP;
const PLATFORM = "Fourvenues";
const HERO_VIDEO = "https://res.cloudinary.com/djqtkbyez/video/upload/f_auto:video,q_auto/v1788512282/04_Jarana2_pwdw0x.mp4";
const REEL_VIDEO = "https://res.cloudinary.com/djqtkbyez/video/upload/f_auto:video,q_auto/v1788512282/02_Jarana1_hhbxfv.mp4";

function useAutoplay() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    const go = () => {
      el.muted = true;
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    };
    go();
    el.addEventListener("loadedmetadata", go);
    el.addEventListener("canplay", go);
    const watch = setInterval(() => { if (el.paused) go(); }, 1500);
    window.addEventListener("pointerdown", go);
    document.addEventListener("visibilitychange", go);
    return () => {
      clearInterval(watch);
      window.removeEventListener("pointerdown", go);
      document.removeEventListener("visibilitychange", go);
    };
  }, []);
  return ref;
}

export default function Landing({ posts = [] }) {
  const [lang, setLang] = useState("es");
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useAutoplay();
  const reelRef = useAutoplay();

  useEffect(() => {
    const next = (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";
    setLang(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = COPY[lang];

  return (
    <>
      <header className="nav" data-scrolled={scrolled}>
        <a href="#top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-white.png" alt="Jarana Para Todos" />
        </a>
        <div className="nav-right">
          <button className="lang" onClick={() => setLang(lang === "es" ? "en" : "es")} aria-label="Idioma">
            <span className={lang === "es" ? "" : "off"}>ES</span>
            <span className="sep">/</span>
            <span className={lang === "en" ? "" : "off"}>EN</span>
          </button>
          <a className="btn-ticket-sm" href={TICKET_URL} target="_blank" rel="noopener">
            {t.tickets}
          </a>
        </div>
      </header>

      <section id="top" className="hero">
        <video ref={heroRef} src={HERO_VIDEO} autoPlay loop muted playsInline preload="auto" />
        <div className="veil-1" />
        <div className="veil-2" />
        <div className="hero-body">
          <div className="hero-kicker">
            <span />
            <span>{t.eyebrow}</span>
          </div>
          <h1>
            {t.heroA}
            <br />
            <span>{t.heroB}</span>
          </h1>
          <p className="hero-sub">{t.heroSub}</p>
          <div className="hero-cta">
            <a className="btn-ticket" href={TICKET_URL} target="_blank" rel="noopener">
              {t.buyTickets}
              <span className="arrow">&#8599;</span>
            </a>
            <span className="trust">
              <svg width="11" height="13" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                <rect x=".7" y="5.7" width="10.6" height="7.6" rx="1.6" stroke="rgba(244,243,240,.5)" strokeWidth="1.1" />
                <path d="M3.4 5.7V4a2.6 2.6 0 0 1 5.2 0v1.7" stroke="rgba(244,243,240,.5)" strokeWidth="1.1" />
              </svg>
              {t.ticketNote} <strong>{PLATFORM}</strong>
            </span>
          </div>
        </div>
        <div className="scroll-hint">
          <span>{t.scroll}</span>
          <span />
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((run) => (
            <div className="marquee-run" key={run} aria-hidden={run === 1 ? "true" : undefined}>
              {CITIES.map((c) => (
                <span key={c}>
                  {c}
                  <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="casa" className="casa">
        <div className="col">
          <span className="eyebrow">01 &mdash; {t.aboutLabel}</span>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutP1}</p>
          <p>{t.aboutP2}</p>
          <ul className="creds">
            {t.creds.map((cr) => (
              <li key={cr}>
                <b />
                <span>{cr}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col">
          <div className="reel">
            <video ref={reelRef} src={REEL_VIDEO} autoPlay loop muted playsInline preload="auto" />
            <div className="veil" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-white.png" alt="" />
          </div>
          <div className="stats">
            {t.stats.map((s) => (
              <div className="stat" key={s.k}>
                <b>{s.v}</b>
                <span>{s.k}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="press">
        <div className="press-in">
          <div className="press-head">
            <span className="eyebrow">02 &mdash; {t.pressLabel}</span>
            <span className="note">{t.pressNote}</span>
          </div>
          <div className="press-grid">
            {PARTNERS.map((p) => (
              <div className="slot" key={p}>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="instagram" className="ig">
        <div className="ig-head">
          <div className="col" style={{ gap: 20 }}>
            <span className="eyebrow">03 &mdash; {t.igLabel}</span>
            <h2 className="titular">{HANDLE}</h2>
            <span className="ig-live">
              <i />
              {t.igSync}
            </span>
          </div>
          <a className="btn-follow" href={IG_URL} target="_blank" rel="noopener">
            {t.igFollow} <span>&#8599;</span>
          </a>
        </div>
        <div className="ig-grid">
          {posts.map((po) => (
            <a className="ig-cell" href={po.url} target="_blank" rel="noopener" key={po.id}>
              {po.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={po.src} alt={po.alt} loading="lazy" />
              ) : (
                <span>{po.label}</span>
              )}
            </a>
          ))}
        </div>
      </section>

      <footer>
        <div className="foot-grid">
          <div className="col" style={{ gap: 26 }}>
            <div className="medal">
              <span className="halo" />
              <span className="ring" />
              <span className="sheen" />
              <span className="core">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/globe-white.png" alt="" />
              </span>
            </div>
            <p className="foot-note">{t.footNote}</p>
          </div>
          <div className="foot-col">
            <span>{t.footContact}</span>
            <a href="mailto:hola@jaranaparatodos.com">hola@jaranaparatodos.com</a>
            <a href={WA_URL} target="_blank" rel="noopener">WhatsApp</a>
            <a href={IG_URL} target="_blank" rel="noopener">Instagram</a>
          </div>
          <div className="foot-col">
            <span>{t.footLegal}</span>
            <a href="#">{t.legalTerms}</a>
            <a href="#">{t.legalPrivacy}</a>
            <a href="#">{t.legalCookies}</a>
          </div>
        </div>
        <div className="foot-base">
          <span>&copy; 2026 Jarana Para Todos</span>
          <span>{t.footRights}</span>
        </div>
      </footer>

      <a className="wa" href={WA_URL} target="_blank" rel="noopener" aria-label="WhatsApp">
        <i>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-1.2-.4-2.7-1.3-3.9-2.6-1-1.1-1.7-2.3-2-3.2-.2-.7-.2-1.3 0-1.8.2-.5.6-.9.9-1.1.2-.2.5-.2.7-.2h.5c.2 0 .4 0 .6.4l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3 0 .6.3.5.7 1 1.2 1.4.5.4 1 .7 1.5.9.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.4 0 .3 0 .8-.1 1.1Z" />
          </svg>
        </i>
        <b>{t.wa}</b>
      </a>
    </>
  );
}
