import "./globals.css";

import { SITE_URL, SITE } from "@/lib/site";

const DESCRIPCION =
  "Productora de fiestas privadas y eventos diurnos. Producción propia, " +
  "discreción absoluta y secret locations en Madrid, Barcelona, Mallorca, " +
  "Bali, Buenos Aires y otras 10 ciudades.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jarana Para Todos · Productora de fiestas privadas",
    template: "%s · Jarana Para Todos"
  },
  description: DESCRIPCION,
  applicationName: SITE.nombre,
  authors: [{ name: SITE.empresa }],
  creator: SITE.empresa,
  publisher: SITE.empresa,
  keywords: [
    "fiestas privadas", "eventos privados", "productora de eventos",
    "eventos diurnos", "day party", "secret location", "Jarana Para Todos",
    "eventos Madrid", "eventos Barcelona", "fiestas exclusivas"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.nombre,
    locale: "es_ES",
    url: SITE_URL,
    title: "Jarana Para Todos · Productora de fiestas privadas",
    description: DESCRIPCION,
    images: [{ url: "/assets/og.png", width: 1200, height: 630, alt: SITE.nombre }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Jarana Para Todos · Productora de fiestas privadas",
    description: DESCRIPCION,
    images: ["/assets/og.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
  },
  icons: {
    icon: "/assets/globe-color.png",
    apple: "/assets/logo-color.png"
  },
  // Verificacion de Google Search Console. Next la escribe como
  // <meta name="google-site-verification"> dentro del <head>.
  verification: {
    google: "BlLUMf0qJE-fHikiiiZYNEZdNIdxsZX_oFAh2KcOSU0"
  }
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#08090a" };

/** Datos estructurados: le dicen a Google que esto es una empresa, no un blog. */
const DATOS = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.nombre,
  legalName: SITE.empresa,
  taxID: SITE.cif,
  url: SITE_URL,
  logo: SITE_URL + "/assets/logo-color.png",
  image: SITE_URL + "/assets/og.png",
  description: DESCRIPCION,
  email: SITE.email,
  telephone: SITE.telefono,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.direccion.calle,
    postalCode: SITE.direccion.cp,
    addressLocality: SITE.direccion.ciudad,
    addressCountry: SITE.direccion.pais
  },
  sameAs: SITE.redes,
  areaServed: [
    "Bali", "Baqueira", "Barcelona", "Buenos Aires", "Cerdaña", "Comillas",
    "La Habana", "London", "Madrid", "Mallorca", "Rio de Janeiro"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(DATOS) }}
        />
        {children}
      </body>
    </html>
  );
}
