import Panel from "./Panel";
import AJUSTES from "@/lib/ajustes.json";

/* Fuera de Google y fuera del sitemap. */
export const metadata = {
  title: "Panel",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null }
};

export default function Page() {
  return <Panel inicial={AJUSTES} />;
}
