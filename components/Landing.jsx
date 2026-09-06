"use client";

import { useEffect, useRef, useState } from "react";
import {
  COPY, CITIES, PARTNERS, PARTNER_LOGOS, MERCH_MEDIA, MERCH_APILADAS,
  cldThumb, cldFull, cldLogo
} from "@/lib/copy";

const TICKET_URL = process.env.NEXT_PUBLIC_TICKET_URL || "https://site.fourvenues.com/es/jarana";
const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP || "34613064564").replace(/[^0-9]/g, "");
const HANDLE = process.env.NEXT_PUBLIC_IG_HANDLE || "@jarana_para_todos";
const IG_URL = "https://instagram.com/" + HANDLE.replace("@", "");
const WA_URL = "https://wa.me/" + WHATSAPP;
const SPOTIFY_URL =
  process.env.NEXT_PUBLIC_SPOTIFY_URL ||
  "https://open.spotify.com/user/31al7dfx35rglpgvuvb5qtgxif5q";
const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@JaranaParaTodos";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "hola@jaranaparatodos.com";
const PLATFORM = "Fourvenues";
const CLD_VIDEO = "https://res.cloudinary.com/djqtkbyez/video/upload/";
// Los originales son 1080p y pesan 12 MB cada uno: en 4G eran 21 segundos
// de pantalla negra. Cloudinary los recomprime al vuelo a 1280px, que en un
// video de fondo oscurecido al 62% no se distingue, y quedan en ~3,5 MB.
const VIDEO = (id) => CLD_VIDEO + "w_1280,q_auto:eco,br_900k,f_auto:video/" + id + ".mp4";
// Fotograma fijo para que se vea algo desde el primer momento.
const POSTER = (id) => CLD_VIDEO + "so_3,w_1280,f_jpg,q_auto/" + id + ".jpg";

const HERO_ID = "v1788512282/02_Jarana1_hhbxfv";
const REEL_ID = "v1788512282/04_Jarana2_pwdw0x";

/**
 * Reproduce el video en bucle y sin sonido, insistiendo si el navegador lo
 * frena. Solo actua cuando el video esta a la vista: el de "La marca" esta
 * muy por debajo del pliegue y, si arranca al cargar la pagina, se lleva
 * ancho de banda que necesita el del hero.
 */
function useAutoplay() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;

    let visible = false;
    let watch = null;
    const go = () => {
      if (!visible) return;
      el.muted = true;
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    };
    const arrancar = () => {
      if (watch) return;
      go();
      el.addEventListener("loadedmetadata", go);
      el.addEventListener("canplay", go);
      window.addEventListener("pointerdown", go);
      document.addEventListener("visibilitychange", go);
      watch = setInterval(() => { if (el.paused) go(); }, 1500);
    };
    const parar = () => {
      if (!watch) return;
      clearInterval(watch);
      watch = null;
      el.removeEventListener("loadedmetadata", go);
      el.removeEventListener("canplay", go);
      window.removeEventListener("pointerdown", go);
      document.removeEventListener("visibilitychange", go);
      el.pause();
    };

    // Si el navegador no soporta IntersectionObserver, se arranca sin mas:
    // vale mas gastar ancho de banda que dejar el video congelado.
    if (typeof IntersectionObserver === "undefined") {
      visible = true;
      arrancar();
      return () => parar();
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) arrancar();
        else parar();
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => { obs.disconnect(); parar(); };
  }, []);
  return ref;
}

export default function Landing({ posts = [] }) {
  const [lang, setLang] = useState("es");
  const [scrolled, setScrolled] = useState(false);
  const [galeria, setGaleria] = useState(null); // { k, t, fotos, i }
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


  useEffect(() => {
    if (!galeria) return;
    const onKey = (e) => {
      if (e.key === "Escape") setGaleria(null);
      if (e.key === "ArrowRight") setGaleria((g) => g && { ...g, i: (g.i + 1) % g.fotos.length });
      if (e.key === "ArrowLeft") setGaleria((g) => g && { ...g, i: (g.i - 1 + g.fotos.length) % g.fotos.length });
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [galeria]);

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
        <video
          ref={heroRef}
          src={VIDEO(HERO_ID)}
          poster={POSTER(HERO_ID)}
          autoPlay loop muted playsInline preload="auto"
        />
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
            <video
              ref={reelRef}
              src={VIDEO(REEL_ID)}
              poster={POSTER(REEL_ID)}
              loop muted playsInline preload="none"
            />
            <div className="veil" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-white.png" alt="" />
          </div>
        </div>

        <div className="stats">
          {t.stats.map((s) => (
            <div className="stat" key={s.k}>
              <b>{s.v}</b>
              <span>{s.k}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="instagram" className="ig">
        <div className="ig-in">
          <div className="ig-head">
            <div className="col" style={{ gap: 20 }}>
              <span className="eyebrow">02 &mdash; {t.igLabel}</span>
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
        </div>
      </section>

      <section className="press">
        <div className="press-in">
          <div className="press-head">
            <span className="eyebrow">03 &mdash; {t.pressLabel}</span>
          </div>
        </div>
        <div className="pmarquee">
          <div className="pmarquee-track">
            {[0, 1].map((run) => (
              <div className="pmarquee-run" key={run} aria-hidden={run === 1 ? "true" : undefined}>
                {PARTNERS.map((p) => (
                  <span key={p}>
                    {PARTNER_LOGOS[p] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cldLogo(PARTNER_LOGOS[p].id)}
                        alt={p}
                        loading="lazy"
                        style={{ "--h": PARTNER_LOGOS[p].h + "px" }}
                      />
                    ) : (
                      p
                    )}
                    <i />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="merch" className="merch">
        <div className="merch-in">
          <div className="merch-head">
            <span className="eyebrow">04 &mdash; {t.merchLabel}</span>
            <h2 className="titular">{t.merchTitle}</h2>
            <p className="merch-note">{t.merchNote}</p>
          </div>
          <div className="merch-grid">
            {t.merch.map((m) => {
              const fotos = MERCH_MEDIA[m.k] || [];
              const hay = fotos.length > 0;
              const Marco = hay ? "button" : "div";
              const apilada = MERCH_APILADAS.includes(m.k);
              // El pie de cromos sale del propio numero de fotos, para que no
              // pueda quedar desfasado si se anaden o quitan piezas.
              const meta = m.meta || (hay ? `${fotos.length} ${t.merchChars}` : null);
              return (
                <Marco
                  className="merch-card"
                  key={m.k}
                  type={hay ? "button" : undefined}
                  onClick={hay ? () => setGaleria({ k: m.k, t: m.t, fotos, i: 0 }) : undefined}
                  aria-label={hay ? `${m.t}: ver ${fotos.length} fotos` : undefined}
                >
                  <div className="merch-shot" data-pendiente={!hay} data-apilada={apilada || undefined}>
                    {hay ? (
                      apilada ? (
                        fotos.map((f, n) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={f} src={cldThumb(f)} alt={`${m.t} ${n + 1}`} loading="lazy" />
                        ))
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cldThumb(fotos[0])} alt={m.t} loading="lazy" />
                      )
                    ) : (
                      <span>
                        {t.merchSoon}
                        <i>900&times;1125</i>
                      </span>
                    )}
                  </div>
                  <div className="merch-txt">
                    <div className="merch-h">
                      <h3>{m.t}</h3>
                      <i aria-hidden="true" />
                    </div>
                    <p>{m.d}</p>
                    <div className="merch-pie">
                      {meta ? <span className="merch-meta">{meta}</span> : <span />}
                      {hay ? (
                        <span className="merch-ver">
                          {t.merchSee}
                          <i aria-hidden="true">&#8594;</i>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Marco>
              );
            })}
          </div>
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
            <a href={"mailto:" + EMAIL}>{EMAIL}</a>
            <a href={WA_URL} target="_blank" rel="noopener">WhatsApp</a>
          </div>
          <div className="foot-col">
            <span>{t.footSocial}</span>
            <a href={IG_URL} target="_blank" rel="noopener">Instagram</a>
            <a href={SPOTIFY_URL} target="_blank" rel="noopener">Spotify</a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener">YouTube</a>
          </div>
          <div className="foot-col">
            <span>{t.footLegal}</span>
            <a href="/terminos">{t.legalTerms}</a>
            <a href="/aviso-legal">{t.legalNotice}</a>
            <a href="/privacidad">{t.legalPrivacy}</a>
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

      {galeria ? (
        <div className="visor" role="dialog" aria-modal="true" aria-label={galeria.t} onClick={() => setGaleria(null)}>
          <button className="visor-x" type="button" aria-label="Cerrar" onClick={() => setGaleria(null)}>&times;</button>
          <div className="visor-in" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldFull(galeria.fotos[galeria.i])} alt={`${galeria.t} ${galeria.i + 1}`} />
            {galeria.fotos.length > 1 ? (
              <>
                <button
                  className="visor-nav prev" type="button" aria-label="Anterior"
                  onClick={() => setGaleria((g) => ({ ...g, i: (g.i - 1 + g.fotos.length) % g.fotos.length }))}
                >&#8249;</button>
                <button
                  className="visor-nav next" type="button" aria-label="Siguiente"
                  onClick={() => setGaleria((g) => ({ ...g, i: (g.i + 1) % g.fotos.length }))}
                >&#8250;</button>
              </>
            ) : null}
          </div>
          <div className="visor-pie">
            <span>{galeria.t}</span>
            <span>{galeria.i + 1} / {galeria.fotos.length}</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
