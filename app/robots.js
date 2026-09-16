import { SITE_URL } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Los crawlers de IA de Meta. En septiembre de 2026 meta-externalagent
      // hizo mas de 250.000 peticiones en 12 horas pidiendo una y otra vez
      // la portada y cuatro imagenes, y casi agota el cupo de Edge Requests
      // del plan Hobby. El bloqueo de verdad esta en el firewall de Vercel
      // (AI Bots: Block); esto es el refuerzo por si alguien lo desactiva.
      //
      // Ojo: NO bloquear facebookexternalhit. Ese es el que genera la
      // vista previa del enlace al compartir la web en WhatsApp, Instagram
      // o Facebook.
      { userAgent: "meta-externalagent", disallow: "/" },
      { userAgent: "meta-webindexer", disallow: "/" }
    ],
    sitemap: SITE_URL + "/sitemap.xml",
    host: SITE_URL
  };
}
