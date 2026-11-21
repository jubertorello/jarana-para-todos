import Panel from "./Panel";
import AJUSTES from "@/lib/ajustes.json";

/* Nunca estatica: si se congela, el formulario arranca con valores viejos
   y al guardar se pisa el ultimo cambio. */
export const dynamic = "force-dynamic";

/* Fuera de Google y fuera del sitemap. */
export const metadata = {
  title: "Panel",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null }
};

export default function Page() {
  return <Panel inicial={AJUSTES} />;
}
