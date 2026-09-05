import LegalPage from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Aviso legal · Jarana Para Todos",
  robots: { index: true, follow: true }
};

export default function Page() {
  return <LegalPage titulo="Aviso legal" bloques={LEGAL.aviso} />;
}
