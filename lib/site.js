// Datos del sitio usados por metadatos, sitemap y datos estructurados.
//
// SITE_URL debe ser el dominio que SIRVE la web, no el que se quiera tener:
// las etiquetas canonical y el sitemap le dicen a Google "esta es la
// direccion buena", y apuntar a un dominio que no responde perjudica el
// posicionamiento. Hoy jaranaparatodos.com no resuelve, asi que el valor
// por defecto es el de Vercel. Cuando el dominio este conectado, basta con
// cambiar NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://jarana-para-todos.vercel.app"
).replace(/\/$/, "");

export const SITE = {
  nombre: "Jarana Para Todos",
  empresa: "TMM TRIANGLE4LIFE SL",
  cif: "B72926397",
  email: process.env.NEXT_PUBLIC_EMAIL || "hola@jaranaparatodos.com",
  telefono: "+34613064564",
  direccion: {
    calle: "Calle Conde de Peñalver 7, 2 Izq",
    cp: "28006",
    ciudad: "Madrid",
    pais: "ES"
  },
  redes: [
    "https://instagram.com/jarana_para_todos",
    "https://open.spotify.com/user/31al7dfx35rglpgvuvb5qtgxif5q",
    "https://www.youtube.com/@JaranaParaTodos"
  ]
};

export const PAGINAS = [
  { ruta: "/", prioridad: 1.0, frecuencia: "weekly" },
  { ruta: "/terminos", prioridad: 0.3, frecuencia: "yearly" },
  { ruta: "/aviso-legal", prioridad: 0.3, frecuencia: "yearly" },
  { ruta: "/privacidad", prioridad: 0.3, frecuencia: "yearly" }
];
