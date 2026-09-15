"use client";

import { useEffect, useRef, useState } from "react";
import {
  COPY, CITIES, PARTNERS, PARTNER_LOGOS, MERCH_MEDIA, MERCH_APILADAS, MERCH_TIRA, MOSAICO,
  cldThumb, cldFull, cldLogo
} from "@/lib/copy";

const TICKET_URL = process.env.NEXT_PUBLIC_TICKET_URL || "https://site.fourvenues.com/es/jarana";
const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP || "34613064564").replace(/[^0-9]/g, "");
const HANDLE = process.env.NEXT_PUBLIC_IG_HANDLE || "@jarana_para_todos";
const IG_URL = "https://instagram.com/" + HANDLE.replace("@", "");
const WA_URL = "https://wa.me/" + WHATSAPP;
// Grupo de WhatsApp. Mientras no exista el enlace del grupo, apunta al chat
// directo para que el boton no quede muerto.
// Invitacion al grupo. Sin los parametros que WhatsApp cuelga al
// compartir (s, p, mlu, ilr): son de seguimiento y el codigo es lo unico
// que hace falta.
const WA_GRUPO =
  process.env.NEXT_PUBLIC_WHATSAPP_GRUPO ||
  "https://chat.whatsapp.com/GTOB9TFMjhFGJXEEgcPmKN";
// Mensaje directo de Instagram
const IG_DM = "https://ig.me/m/" + HANDLE.replace("@", "");
const SPOTIFY_URL =
  process.env.NEXT_PUBLIC_SPOTIFY_URL ||
  "https://open.spotify.com/user/31al7dfx35rglpgvuvb5qtgxif5q";
const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@JaranaParaTodos";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "hola@jaranaparatodos.com";
const PLATFORM = "Fourvenues";
// Videos. Los tres viven en la cuenta secundaria de Cloudinary.
const CLD_VIDEO = "https://res.cloudinary.com/scihumn2/video/upload/";

// El hero tiene dos piezas distintas, no dos recortes de la misma: una
// apaisada para pantallas anchas y otra vertical para movil. Con eso
// desaparece el recorte que dejaba fuera el 73% del ancho en vertical.
const HERO_ANCHO_ID = "IMG_1882";
const HERO_MOVIL_ID =
  "AQNhs3Hp9IS8KkTwTckEu478TM-fsDihSmwP3Z-ZWbJULgDm4hnW8kH9rrfMoFDWshWxKATyBn6A0dDyPo9SskTsJjqGnkYaW2lWGx4";
const REEL_ID =
  "AQPzcEhG4JnuP34bgP9FHiO6959jkrK4ITFoczi42BXBuz4pkBgC5fYpVsRtgdERD1smyaXV_gpW0oTVCL-3Oo23ZKx3_l-_EVTOrjY";

// Los originales son de 720px de ancho, asi que pedirlos mas grandes solo
// agranda el archivo sin ganar nitidez: se sirven a su tamaño nativo, y el
// del reel se ajusta al ancho real de su hueco.
/* f_auto:video elige el formato por navegador: VP9 para Chrome y HEVC para
   Safari, que pesan bastante menos que el H.264 de toda la vida. Ojo con
   q_auto:eco, que parece mas agresivo pero fuerza H.264 y acaba sirviendo
   mas megas: el hero de movil pasaba de 6,8 a 9,9 MB. */
const VIDEO = (id, t) => CLD_VIDEO + (t || "q_auto,f_auto:video") + "/" + id + ".mp4";
const POSTER = (id) => CLD_VIDEO + "so_3,w_900,f_jpg,q_auto/" + id + ".jpg";

/* La frase de marca rotulada en Arsenica. El PNG viene en negro sobre blanco
   opaco, asi que e_trim le quita el margen y en CSS se invierte y se funde
   con el fondo (invert + screen), que deja el blanco limpio y sin halo. */
const FRASE_CIERRE =
  "https://res.cloudinary.com/scihumn2/image/upload/e_trim/w_900,f_auto,q_auto/v1789066965/Frase_-_Calienta.png";

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
const IconoSpotify = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.66.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const IconoYouTube = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);

/* Tira de merchandising: avanza sola, en bucle de verdad. El contenido va
   duplicado, asi que al pasar de la mitad se resta un ciclo entero: lo que
   queda delante es identico a lo que se venia viendo y el salto no se ve.
   Antes volvia al principio con un scroll animado y se notaba el rebobinado. */
function useCarruselAuto() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const VELOCIDAD = 26; // px por segundo
    const ESPERA = 4000;  // lo que se aparta despues de que toques la tira

    let raf = null;
    let ultimo = 0;
    let esperaHasta = 0;
    let pos = el.scrollLeft;
    let visible = true;

    // Un ciclo es la distancia entre una foto y su copia. No vale
    // scrollWidth/2: ahi entran el relleno lateral y hay un hueco menos que
    // fotos, asi que la mitad se queda corta y el bucle iria desfasando.
    const ciclo = () => {
      const n = el.children.length / 2;
      const a = el.children[0], b = el.children[n];
      return a && b ? b.offsetLeft - a.offsetLeft : 0;
    };

    const paso = (t) => {
      const c = ciclo();
      // Un cambio de pestana deja un salto enorme entre fotogramas: se
      // recorta para que la tira no pegue un aceleron al volver.
      const dt = Math.min((t - (ultimo || t)) / 1000, 0.1);
      ultimo = t;

      // El corte tiene que caer donde el contenido se repite, o sea en el
      // borde de la primera foto. En cero se ve el margen lateral vacio, que
      // a mitad del bucle no existe, y el salto canta.
      const base = el.children[0] ? el.children[0].offsetLeft : 0;
      if (c > 0) {
        if (t < esperaHasta) {
          // Manda el usuario: solo se cierra el bucle al pasarse de largo.
          pos = el.scrollLeft;
          if (pos >= base + c) { pos -= c; el.scrollLeft = pos; }
        } else if (c > el.clientWidth) {
          pos += VELOCIDAD * dt;
          if (pos >= base + c) pos -= c;
          el.scrollLeft = pos;
        }
      }
      raf = requestAnimationFrame(paso);
    };

    const arrancar = () => { if (raf == null) { ultimo = 0; raf = requestAnimationFrame(paso); } };
    const detener = () => { if (raf != null) { cancelAnimationFrame(raf); raf = null; } };

    const apartarse = () => {
      esperaHasta = performance.now() + ESPERA;
      // Ya sabe que se desliza, la pista sobra.
      el.dataset.tocado = "true";
    };

    // Fuera de pantalla no tiene sentido seguir moviendola.
    let obs = null;
    if (typeof IntersectionObserver !== "undefined") {
      obs = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) arrancar(); else detener();
      }, { threshold: 0 });
      obs.observe(el);
    } else {
      arrancar();
    }

    el.addEventListener("pointerdown", apartarse);
    el.addEventListener("wheel", apartarse, { passive: true });
    el.addEventListener("mouseenter", apartarse);
    el.addEventListener("touchstart", apartarse, { passive: true });

    return () => {
      detener();
      if (obs) obs.disconnect();
      el.removeEventListener("pointerdown", apartarse);
      el.removeEventListener("wheel", apartarse);
      el.removeEventListener("mouseenter", apartarse);
      el.removeEventListener("touchstart", apartarse);
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

/* Revela los bloques segun entran en pantalla. La clase que los oculta se
   pone desde aqui (js-rv en el <html>), asi que sin JS, sin
   IntersectionObserver o con el movimiento reducido la pagina se ve entera
   desde el primer momento. */
function useRevelar() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("js-rv");
    const piezas = Array.from(document.querySelectorAll(".rv"));

    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("rv-on");
          obs.unobserve(e.target);
        });
      },
      // Se dispara un poco antes de llegar al borde, para que el bloque
      // termine de entrar justo cuando lo estas mirando.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );
    piezas.forEach((el) => obs.observe(el));

    // Red de seguridad: si el observer no llega a disparar, lo que ya este
    // en pantalla se muestra igualmente.
    const red = setTimeout(() => {
      piezas.forEach((el) => {
        if (el.classList.contains("rv-on")) return;
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("rv-on");
      });
    }, 1400);

    return () => { clearTimeout(red); obs.disconnect(); };
  }, []);
}

export default function Landing({ posts = [] }) {
  const [lang, setLang] = useState("es");
  const [scrolled, setScrolled] = useState(false);
  const merchRef = useCarruselAuto();
  const heroRef = useAutoplay();
  const reelRef = useAutoplay();
  useRevelar();

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
          poster={POSTER(HERO_ANCHO_ID)}
          autoPlay loop muted playsInline preload="auto"
        >
          <source src={VIDEO(HERO_MOVIL_ID)} media="(max-width: 820px)" type="video/mp4" />
          <source src={VIDEO(HERO_ANCHO_ID)} type="video/mp4" />
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
          <div className="com-head rv">
            <span className="eyebrow"><b className="eyebrow-num">01</b> &mdash; {t.comLabel}</span>
            <h2 className="titular">{t.comTitulo}</h2>
          </div>

          {/* El acceso a Instagram encabeza el carrete, pegado a el, para que
              se entienda de un vistazo que las fotos vienen de ahi. */}
          <div className="com-ig rv" style={{ "--d": ".08s" }}>
            <a className="com-acceso com-acceso-ig" href={IG_URL} target="_blank" rel="noopener">
              <i><IconoInstagram /></i>
              <span>
                <b>{t.comIgTitulo}</b>
                <em>{t.comIgPie}</em>
              </span>
              <u>{t.comIgCta}<i aria-hidden="true">&#8599;</i></u>
            </a>
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
          </div>

          <a className="com-acceso rv" style={{ "--d": ".16s" }} href={WA_GRUPO} target="_blank" rel="noopener">
            <i><IconoWhatsApp /></i>
            <span>
              <b>{t.comWaTitulo}</b>
              <em>{t.comWaPie}</em>
            </span>
            <u>{t.comWaCta}<i aria-hidden="true">&#8599;</i></u>
          </a>
        </div>
      </section>

      <section id="casa" className="casa">
        <div className="col rv">
          <span className="eyebrow"><b className="eyebrow-num">02</b> &mdash; {t.aboutLabel}</span>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutP1}</p>
          <p>{t.aboutP2}</p>
          <p className="about-cierre">{t.aboutP3}</p>
        </div>

        <div className="col rv" style={{ "--d": ".1s" }}>
          <div className="reel">
            <video
              ref={reelRef}
              poster={POSTER(REEL_ID)}
              loop muted playsInline preload="none"
            >
              <source src={VIDEO(REEL_ID, "w_620,q_auto,f_auto:video")} type="video/mp4" />
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
          <div className="ven-head rv">
            <span className="eyebrow"><b className="eyebrow-num">03</b> &mdash; {t.venLabel}</span>
            <h2 className="titular">{t.venTitulo}</h2>
          </div>

          <div className="mosaico rv">
            {MOSAICO.map((m, i) => (
              <figure className="mos-celda" key={i} style={{ gridArea: m.hueco }} data-pendiente={!m.id}>
                {m.id ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cldThumb(m.id, m.w)}
                    alt={m.alt || ""}
                    loading="lazy"
                    style={m.pos ? { objectPosition: m.pos } : undefined}
                  />
                ) : (
                  <span>{t.mosaicoPendiente}</span>
                )}
              </figure>
            ))}
          </div>

          <p className="ven-texto rv">{t.venTexto}</p>
        </div>

        <div className="ven-in ven-partners">
          <span className="eyebrow">{t.pressLabel}</span>
        </div>
        <div className="pmarquee rv">
          <div className="pmarquee-track">
            {[0, 1].map((run) => (
              <div className="pmarquee-run" key={run} aria-hidden={run === 1 ? "true" : undefined}>
                {PARTNERS.map((p) => (
                  <span key={p}>
                    {PARTNER_LOGOS[p] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cldLogo(PARTNER_LOGOS[p].id, PARTNER_LOGOS[p].h)}
                        alt={p}
                        /* Sin lazy: la cinta no para, y un logo que aparece a
                           medio recorrido mide 0 hasta que carga y da un tiron
                           a toda la fila. */
                        loading="eager"
                        decoding="async"
                        style={{
                          "--h": PARTNER_LOGOS[p].h + "px",
                          "--ar": PARTNER_LOGOS[p].ar
                        }}
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
            <article className="ficha rv">
              <div className="ficha-txt">
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
              </div>
              <a className="btn-ficha" href={WA_URL} target="_blank" rel="noopener">
                {t.carnetCta}<i aria-hidden="true">&#8599;</i>
              </a>
            </article>
            <article className="ficha rv" style={{ "--d": ".1s" }}>
              <div className="ficha-txt">
                <h3>{t.grupoTitulo}</h3>
                <p>{t.grupoTexto}</p>
                <p className="ficha-extra">{t.grupoExtra}</p>
              </div>
              <a className="btn-ficha" href={WA_URL} target="_blank" rel="noopener">
                {t.grupoCta}<i aria-hidden="true">&#8599;</i>
              </a>
            </article>
          </div>
        </div>

        <div className="ven-in ven-merch">
          <div className="merch-head rv">
            <div className="merch-head-txt">
              <h3 className="ven-sub">{t.merchLabel}</h3>
              <p className="merch-desc">{t.merchDesc}</p>

            {/* Las tres piezas, como etiquetas. Camisetas no tiene fotos y
                sin esto no aparecia en ninguna parte del bloque. */}
              <ul className="merch-tags">
              {t.merch.map((m) => {
                const fotos = MERCH_MEDIA[m.k] || [];
                const estado = m.meta || (fotos.length && m.unidad ? `${fotos.length} ${m.unidad}` : null);
                return (
                  <li key={m.k}>
                    <b>{m.t}</b>
                    {estado ? <em>{estado}</em> : null}
                  </li>
                );
              })}
              </ul>
            </div>
            <a className="btn-ficha" href={WA_URL} target="_blank" rel="noopener">
              {t.merchCta}<i aria-hidden="true">&#8599;</i>
            </a>
          </div>

          {/* Tira con todas las fotos, pasando sola. Cada una conserva su
              formato (los cascos apaisados, los cromos verticales) y lleva
              la etiqueta de la pieza encima. No son pinchables. */}
          {/* Va dos veces: el bucle sin costura necesita que lo que viene
              detras sea identico a lo que se acaba de ver. */}
          <div className="merch-tira rv" ref={merchRef} style={{ "--d": ".08s" }}>
            {[0, 1].map((copia) =>
              MERCH_TIRA.map((f) => {
                const pieza = t.merch.find((m) => m.k === f.k);
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="merch-foto"
                    src={cldThumb(f.id)}
                    alt={copia === 0 ? pieza?.t || "" : ""}
                    aria-hidden={copia === 1 ? "true" : undefined}
                    key={copia + "-" + f.id}
                    loading="lazy"
                  />
                );
              })
            )}
          </div>
          <p className="merch-pista" aria-hidden="true">
            <span>{t.merchPista}</span>
            <i />
          </p>
        </div>
      </section>



      <section id="faq" className="faq">
        <div className="faq-in">
          <div className="faq-head rv">
            <span className="eyebrow"><b className="eyebrow-num">04</b> &mdash; {t.faqLabel}</span>
            <h2 className="titular">{t.faqTitulo}</h2>
          </div>
          <ul className="faq-lista rv">
            {t.faq.map((f) => (
              <li key={f.p}>
                <h3>{f.p}</h3>
                <p>{f.r}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="cierre" className="cierre">
        <div className="cierre-in">
          <span className="eyebrow"><b className="eyebrow-num">05</b> &mdash; {t.cierreLabel}</span>
          <h2 className="rv">{t.cierreTitulo}</h2>
          <p className="rv" style={{ "--d": ".08s" }}>{t.cierreTexto}</p>
          {/* La frase de marca cierra el circulo con el hero, rotulada */}
          <p className="cierre-frase rv" style={{ "--d": ".18s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FRASE_CIERRE} alt={t.heroA + " " + t.heroB} width="900" height="567" />
          </p>
        </div>
      </section>

      <footer>
        <div className="foot-grid">
          <div className="foot-marca">
            {/* La medalla giratoria, sin texto debajo */}
            <div className="medal">
              <span className="halo" />
              <span className="ring" />
              <span className="sheen" />
              <span className="core">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/globe-white.webp" alt="Jarana Para Todos" />
              </span>
            </div>
            <div className="foot-redes">
              <a href={IG_URL} target="_blank" rel="noopener" aria-label="Instagram">
                <IconoInstagram />
              </a>
              <a href={SPOTIFY_URL} target="_blank" rel="noopener" aria-label="Spotify">
                <IconoSpotify />
              </a>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener" aria-label="YouTube">
                <IconoYouTube />
              </a>
            </div>
          </div>

          <div className="foot-col">
            <span>{t.footContact}</span>
            <a href={"mailto:" + EMAIL}>{t.footMail}</a>
            <a href={WA_URL} target="_blank" rel="noopener">{t.footWa}</a>
            <a href={IG_DM} target="_blank" rel="noopener">{t.footDm}</a>
            <a href={WA_GRUPO} target="_blank" rel="noopener">{t.footGrupo}</a>
          </div>
        </div>

        <div className="foot-base">
          <span>&copy; 2026 Jarana Para Todos. {t.footRights}</span>
          {/* Los enlaces legales bajan al pie: el brief deja el footer en dos
              columnas y estos tienen que seguir siendo accesibles. */}
          <span className="foot-legal">
            <a href="/terminos">{t.legalTerms}</a>
            <a href="/aviso-legal">{t.legalNotice}</a>
            <a href="/privacidad">{t.legalPrivacy}</a>
          </span>
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
