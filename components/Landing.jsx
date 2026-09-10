"use client";

import { useEffect, useRef, useState } from "react";
import {
  COPY, CITIES, PARTNERS, PARTNER_LOGOS, MERCH_MEDIA, MERCH_APILADAS, MOSAICO,
  cldThumb, cldFull, cldLogo
} from "@/lib/copy";

const TICKET_URL = process.env.NEXT_PUBLIC_TICKET_URL || "https://site.fourvenues.com/es/jarana";
const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP || "34613064564").replace(/[^0-9]/g, "");
const HANDLE = process.env.NEXT_PUBLIC_IG_HANDLE || "@jarana_para_todos";
const IG_URL = "https://instagram.com/" + HANDLE.replace("@", "");
const WA_URL = "https://wa.me/" + WHATSAPP;
// Grupo de WhatsApp. Mientras no exista el enlace del grupo, apunta al chat
// directo para que el boton no quede muerto.
const WA_GRUPO = process.env.NEXT_PUBLIC_WHATSAPP_GRUPO || WA_URL;
const SPOTIFY_URL =
  process.env.NEXT_PUBLIC_SPOTIFY_URL ||
  "https://open.spotify.com/user/31al7dfx35rglpgvuvb5qtgxif5q";
const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@JaranaParaTodos";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "hola@jaranaparatodos.com";
const PLATFORM = "Fourvenues";
const CLD_VIDEO = "https://res.cloudinary.com/rmrm61ee/video/upload/";
// Sin tope de bitrate: br_900k dejaba el metraje de fiesta borroso. Y a
// 1920px Cloudinary no ahorra nada (11,99 frente a 11,98 MB), porque el
// original ya viene bien codificado; el unico ahorro real es bajar ancho.
// Por eso se sirven dos versiones y decide el navegador: en movil, donde
// la pantalla es estrecha y los datos caros, una mas ligera; en pantallas
// grandes una que no se vea estirada.
// En movil el hero es vertical y el video se recorta por altura, asi que lo
// que manda no es el ancho sino los pixeles verticales: a w_1100 solo hay
// 618px de alto y habria que estirarlos hasta los 844 de la pantalla.
// w_1400 deja 787, practicamente sin estirar, por 1,3 MB mas.
const VIDEO_ANCHO = (id) => CLD_VIDEO + "w_1600,q_auto,f_auto:video/" + id + ".mp4";
const VIDEO_MOVIL = (id) => CLD_VIDEO + "w_1400,q_auto,f_auto:video/" + id + ".mp4";
// Fotograma fijo para que se vea algo desde el primer momento.
const POSTER = (id) => CLD_VIDEO + "so_3,w_1280,f_jpg,q_auto/" + id + ".jpg";

const HERO_ID = "02_Jarana1";
const REEL_ID = "04_Jarana2";

/**
 * Reproduce el video en bucle y sin sonido, insistiendo si el navegador lo
 * frena. Solo actua cuando el video esta a la vista: el de "La marca" esta
 * muy por debajo del pliegue y, si arranca al cargar la pagina, se lleva
 * ancho de banda que necesita el del hero.
 */
const IconoInstagram = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="17.4" cy="6.6" r="1.25" fill="currentColor" />
  </svg>
);

const IconoWhatsApp = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-1.2-.4-2.7-1.3-3.9-2.6-1-1.1-1.7-2.3-2-3.2-.2-.7-.2-1.3 0-1.8.2-.5.6-.9.9-1.1.2-.2.5-.2.7-.2h.5c.2 0 .4 0 .6.4l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3 0 .6.3.5.7 1 1.2 1.4.5.4 1 .7 1.5.9.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.4 0 .3 0 .8-.1 1.1Z" />
  </svg>
);

/**
 * Carrusel con avance automatico, solo cuando la fila no cabe entera (es
 * decir, en movil). Se detiene en cuanto el usuario toca o pasa el raton,
 * y respeta prefers-reduced-motion.
 */
function useCarruselAuto() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = null;
    let parado = false;

    const cabeEntera = () => el.scrollWidth <= el.clientWidth + 4;
    const avanzar = () => {
      if (parado || cabeEntera()) return;
      const paso = el.firstElementChild ? el.firstElementChild.offsetWidth + 12 : 260;
      const fin = el.scrollWidth - el.clientWidth - 4;
      el.scrollTo({ left: el.scrollLeft >= fin ? 0 : el.scrollLeft + paso, behavior: "smooth" });
    };

    const parar = () => {
      parado = true;
      clearTimeout(reanudar.t);
      reanudar.t = setTimeout(() => { parado = false; }, 6000);
    };
    const reanudar = { t: null };

    timer = setInterval(avanzar, 3800);
    el.addEventListener("pointerdown", parar);
    el.addEventListener("mouseenter", parar);
    el.addEventListener("touchstart", parar, { passive: true });
    return () => {
      clearInterval(timer);
      clearTimeout(reanudar.t);
      el.removeEventListener("pointerdown", parar);
      el.removeEventListener("mouseenter", parar);
      el.removeEventListener("touchstart", parar);
    };
  }, []);
  return ref;
}

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
  const merchRef = useCarruselAuto();
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
          <img src="/assets/logo-white.webp" alt="Jarana Para Todos" />
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
          poster={POSTER(HERO_ID)}
          autoPlay loop muted playsInline preload="auto"
        >
          <source src={VIDEO_MOVIL(HERO_ID)} media="(max-width: 820px)" type="video/mp4" />
          <source src={VIDEO_ANCHO(HERO_ID)} type="video/mp4" />
        </video>
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


      <section id="comunidad" className="comunidad">
        <div className="com-in">
          <div className="com-head">
            <span className="eyebrow">01 &mdash; {t.comLabel}</span>
            <h2 className="titular">{t.comTitulo}</h2>
          </div>

          {/* Carrete horizontal: el 98% de la audiencia entra por movil */}
          <div className="ig-carrete" role="list">
            {posts.map((po) => (
              <a
                className="ig-cromo"
                href={po.url}
                target="_blank"
                rel="noopener"
                key={po.id}
                role="listitem"
              >
                {po.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={po.src} alt={po.alt} loading="lazy" />
                ) : (
                  <span>{po.label}</span>
                )}
              </a>
            ))}
          </div>

          <div className="com-accesos">
            <a className="com-acceso" href={IG_URL} target="_blank" rel="noopener">
              <i><IconoInstagram /></i>
              <span>
                <b>{t.comIgTitulo}</b>
                <em>{t.comIgPie}</em>
              </span>
              <u>{t.comIgCta}<i aria-hidden="true">&#8599;</i></u>
            </a>
            <a className="com-acceso" href={WA_GRUPO} target="_blank" rel="noopener">
              <i><IconoWhatsApp /></i>
              <span>
                <b>{t.comWaTitulo}</b>
                <em>{t.comWaPie}</em>
              </span>
              <u>{t.comWaCta}<i aria-hidden="true">&#8599;</i></u>
            </a>
          </div>
        </div>
      </section>

      <section id="casa" className="casa">
        <div className="col">
          <span className="eyebrow">02 &mdash; {t.aboutLabel}</span>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutP1}</p>
          <p>{t.aboutP2}</p>
          <p className="about-cierre">{t.aboutP3}</p>
        </div>

        <div className="col">
          <div className="reel">
            <video
              ref={reelRef}
              poster={POSTER(REEL_ID)}
              loop muted playsInline preload="none"
            >
              <source src={VIDEO_MOVIL(REEL_ID)} media="(max-width: 820px)" type="video/mp4" />
              <source src={VIDEO_ANCHO(REEL_ID)} type="video/mp4" />
            </video>
            <div className="veil" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-white.webp" alt="" />
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

      <section id="ventajas" className="ventajas">
        <div className="ven-in">
          <div className="ven-head">
            <span className="eyebrow">03 &mdash; {t.venLabel}</span>
            <h2 className="titular">{t.venTitulo}</h2>
          </div>

          <div className="mosaico">
            {MOSAICO.map((m, i) => (
              <figure className="mos-celda" key={i} style={{ gridArea: m.hueco }} data-pendiente={!m.id}>
                {m.id ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cldThumb(m.id)} alt="" loading="lazy" />
                ) : (
                  <span>{t.mosaicoPendiente}</span>
                )}
              </figure>
            ))}
          </div>

          <p className="ven-texto">{t.venTexto}</p>
        </div>

        <div className="ven-in ven-partners">
          <span className="eyebrow">{t.pressLabel}</span>
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

        <div className="ven-in">
          <div className="ven-fichas">
            <article className="ficha">
              <h3>{t.carnetTitulo}</h3>
              {/* Anverso y dorso, solo como muestra: no son pinchables */}
              <div className="ficha-fotos">
                {MERCH_MEDIA.carnet.map((f) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cldThumb(f)} alt="" key={f} loading="lazy" />
                ))}
              </div>
              <p>{t.carnetTexto}</p>
              <p className="ficha-extra">{t.carnetExtra}</p>
              <a className="btn-ficha" href={WA_URL} target="_blank" rel="noopener">
                {t.carnetCta}<i aria-hidden="true">&#8599;</i>
              </a>
            </article>
            <article className="ficha">
              <h3>{t.grupoTitulo}</h3>
              <p>{t.grupoTexto}</p>
              <p className="ficha-extra">{t.grupoExtra}</p>
              <a className="btn-ficha" href={WA_URL} target="_blank" rel="noopener">
                {t.grupoCta}<i aria-hidden="true">&#8599;</i>
              </a>
            </article>
          </div>
        </div>

        <div className="ven-in ven-merch">
          <div className="merch-head">
            <h3 className="ven-sub">{t.merchLabel}</h3>
            <h2 className="titular">{t.merchTitle}</h2>
            <p className="merch-note">{t.merchNote}</p>
          </div>
          <div className="merch-carrusel" ref={merchRef}>
            {t.merch.map((m) => {
              const fotos = MERCH_MEDIA[m.k] || [];
              const hay = fotos.length > 0;
              const apilada = MERCH_APILADAS.includes(m.k);
              // El pie de cromos sale del propio numero de fotos, para que
              // no pueda quedar desfasado si se anaden o quitan piezas.
              const meta = m.meta || (hay ? `${fotos.length} ${t.merchChars}` : null);
              return (
                <article className="merch-card" key={m.k}>
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
                      <h4>{m.t}</h4>
                      <i aria-hidden="true" />
                    </div>
                    <p>{m.d}</p>
                    {meta ? <span className="merch-meta">{meta}</span> : null}
                  </div>
                </article>
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
                <img src="/assets/globe-white.webp" alt="" />
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

    </>
  );
}
