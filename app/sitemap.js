import { SITE_URL, PAGINAS } from "@/lib/site";

export default function sitemap() {
  const ahora = new Date();
  return PAGINAS.map((p) => ({
    url: SITE_URL + p.ruta,
    lastModified: ahora,
    changeFrequency: p.frecuencia,
    priority: p.prioridad
  }));
}
