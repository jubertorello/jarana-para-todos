import SNAPSHOT from "./instagram-snapshot.json";

/* El feed de Behold tiene un limite de 1.200 consultas al mes en el plan
   gratuito. Pidiendolo cada 10 minutos se gastaban 4.320 al mes sin que
   entrara nadie, y al pasarse, Behold pausa la cuenta: deja de servir el
   listado Y las imagenes, asi que la seccion se quedaba vacia.
   Cada 12 horas salen unas 60 consultas al mes, un 5% del cupo. */
const CADA_12_HORAS = 43200;

/* Ultimo recurso. Solo deberia verse si nunca se ha guardado una copia. */
const HUECOS = Array.from({ length: 8 }, (_, i) => ({
  id: "stub-" + i,
  src: null,
  url: "https://instagram.com/jarana_para_todos",
  alt: "",
  label: "IG POST " + String(i + 1).padStart(2, "0")
}));

function normaliza(raw, limit) {
  return raw
    .slice(0, limit)
    .map((p, i) => ({
      id: p.id || "ig-" + i,
      src: p.sizes?.medium?.mediaUrl || p.thumbnailUrl || p.mediaUrl || p.src || null,
      url: p.permalink || p.url || "https://instagram.com/jarana_para_todos",
      alt: (p.prunedCaption || p.caption || p.alt || "Jarana Para Todos").slice(0, 90),
      label: ""
    }))
    .filter((p) => p.src);
}

/** Publicaciones de Instagram. Si Behold falla o esta pausado, tira de la
 *  copia guardada en el repo, cuyas fotos se sirven desde la propia web y
 *  no dependen de nadie. */
export async function getInstagramPosts(limit = 8) {
  const copia = normaliza(SNAPSHOT.posts || [], limit);
  const url = process.env.BEHOLD_FEED_URL;

  if (url) {
    try {
      const res = await fetch(url, { next: { revalidate: CADA_12_HORAS } });
      if (res.ok) {
        const data = await res.json();
        const raw = Array.isArray(data) ? data : data.posts || data.media || [];
        const vivos = normaliza(raw, limit);
        if (vivos.length) return vivos;
      }
    } catch {
      // da igual por que fallara: abajo esta la copia
    }
  }

  return copia.length ? copia : HUECOS.slice(0, limit);
}
