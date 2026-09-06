import LegalPage from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

const DESC =
  "Cómo tratamos tus datos personales conforme al RGPD y la LOPDGDD: finalidades, base legal, plazos y ejercicio de derechos.";

export const metadata = {
  title: "Política de protección de datos",
  description: DESC,
  alternates: { canonical: "/privacidad" },
  openGraph: {
    title: "Política de protección de datos · Jarana Para Todos",
    description: DESC,
    url: "/privacidad"
  }
};

export default function Page() {
  return <LegalPage titulo="Política de protección de datos" bloques={LEGAL.privacidad} />;
}
