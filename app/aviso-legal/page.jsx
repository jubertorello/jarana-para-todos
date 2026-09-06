import LegalPage from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Aviso legal",
  description: "Titularidad del sitio, condiciones de uso, propiedad intelectual y legislación aplicable. TMM TRIANGLE4LIFE SL.",
  alternates: { canonical: "/aviso-legal" },
  openGraph: { title: "Aviso legal · Jarana Para Todos", description: "Titularidad del sitio, condiciones de uso, propiedad intelectual y legislación aplicable. TMM TRIANGLE4LIFE SL.", url: "/aviso-legal" }
};

export default function Page() {
  return <LegalPage titulo="Aviso legal" bloques={LEGAL.aviso} />;
}
