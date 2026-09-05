import LegalPage from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Términos y condiciones · Jarana Para Todos",
  robots: { index: true, follow: true }
};

export default function Page() {
  return <LegalPage titulo="Términos y condiciones" bloques={LEGAL.terminos} />;
}
