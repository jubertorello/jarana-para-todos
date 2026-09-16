/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.behold.pictures" }
    ]
  },

  // Direcciones de la web anterior, que era WordPress. Google las tiene
  // indexadas y ahora darian 404. Con 301 Google traslada su posicionamiento
  // a la pagina nueva y quien llegue por un enlace viejo no se pierde.
  // /aviso-legal/ no hace falta: se llama igual y Next ya quita la barra.
  async redirects() {
    return [
      { source: "/proteccion-datos", destination: "/privacidad", permanent: true },
      // La politica de cookies desaparecio con la web nueva, que no usa
      // cookies. Lo mas cercano es la de privacidad.
      { source: "/politica-de-cookies", destination: "/privacidad", permanent: true }
    ];
  }
};
export default nextConfig;
