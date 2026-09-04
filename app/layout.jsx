import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jaranaparatodos.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Jarana Para Todos · Fiestas privadas",
  description:
    "Productora de fiestas privadas para un círculo internacional. Producción propia, discreción absoluta y una lista de invitados que se cuida.",
  openGraph: {
    title: "Jarana Para Todos",
    description: "Una noche. Cualquier ciudad del mundo.",
    images: ["/assets/logo-color.png"],
    type: "website"
  },
  icons: { icon: "/assets/globe-color.png" }
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#08090a" };

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
      <body>{children}</body>
    </html>
  );
}
