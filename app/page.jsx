import Landing from "@/components/Landing";
import { getInstagramPosts } from "@/lib/instagram";
import { COPY } from "@/lib/copy";

export const metadata = { alternates: { canonical: "/" } };

export const revalidate = 600;

/* Las preguntas frecuentes, en el formato que Google entiende: con esto
   puede mostrarlas desplegadas en los resultados de busqueda. Se generan
   del castellano, que es el idioma por defecto de la pagina. */
const FAQ_DATOS = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: COPY.es.faq.map((f) => ({
    "@type": "Question",
    name: f.p,
    acceptedAnswer: { "@type": "Answer", text: f.r }
  }))
};

export default async function Page() {
  const posts = await getInstagramPosts(6);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_DATOS) }}
      />
      <Landing posts={posts} />
    </>
  );
}
