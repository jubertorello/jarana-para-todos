import LegalPage from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de compra de entradas, cambios de nombre, derecho de admisión y uso de imagen en los eventos de Jarana Para Todos.",
  alternates: { canonical: "/terminos" },
  openGraph: { title: "Términos y condiciones · Jarana Para Todos", description: "Condiciones de compra de entradas, cambios de nombre, derecho de admisión y uso de imagen en los eventos de Jarana Para Todos.", url: "/terminos" }
};

export default function Page() {
  return <LegalPage titulo="Términos y condiciones" bloques={LEGAL.terminos} />;
}
