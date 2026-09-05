import LegalPage from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Política de protección de datos · Jarana Para Todos",
  robots: { index: true, follow: true }
};

export default function Page() {
  return <LegalPage titulo="Política de protección de datos" bloques={LEGAL.privacidad} />;
}
