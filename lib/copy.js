export const COPY = {
  es: {
    tickets: "Entradas", buyTickets: "Comprar entradas",
    eyebrow: "Fiestas privadas · Todo el mundo",
    heroA: "Calienta", heroB: "que sales.",
    heroSub: "Jarana Para Todos lidera la organización de eventos diurnos desde Covid. Buen rollo, exclusividad y comidas que se alargan hasta el amanecer.",
    ticketNote: "Pago seguro · Venta oficial en",
    scroll: "Desliza",
    aboutLabel: "La marca",
    aboutTitle: "Una productora, no un promotor.",
    aboutP1: "Producimos fiestas privadas para un público top. Producción propia, discreción absoluta y una lista de invitados que se cuida. Cada Jarana es única e irrepetible, con secret locations que se desvelan horas antes de que empiece la fiesta.",
        creds: ["Amistad, felicidad y diversión", "Licencias, seguros y aforo en regla en cada ubicación", "Equipo de producción, sonido y seguridad", "Acuerdos permanentes con venues asociados"],
    stats: [{ v: "2021", k: "Primera edición" }, { v: "15", k: "Ciudades" }, { v: "+100", k: "Producciones" }, { v: "6", k: "Países" }, { v: "+35.000", k: "Emails en BBDD" }, { v: "+60.000", k: "Asistentes" }],
    pressLabel: "Prensa y partners",
    merchLabel: "Merchandising",
    merchTitle: "Llévate la Jarana puesta.",
    merchNote: "Piezas de edición limitada para la comunidad jaranera.",
    merch: [
      { k: "cascos", t: "Cascos", d: "Serie numerada, rotulada a mano. Uno por invitado en las ediciones con ruta.", meta: "Edición 2024 · Agotada" },
      { k: "camisetas", t: "Camisetas", d: "Algodón pesado, serigrafía a dos tintas. Primera tirada en producción.", meta: "Próximamente" },
      { k: "carnet", t: "Carnet Jaranero", d: "Acreditación anual del círculo. Nominal, con número de socio.", meta: "Temporada 2025" },
      { k: "cromos", t: "Cromos", d: "Colección de arquetipos de la fiesta. Se reparten en mano durante la noche.", meta: null }
    ],
    merchSoon: "Foto pendiente",
    merchChars: "personajes",
    merchSee: "Ver más",
    igLabel: "Ahora mismo",
    igSync: "Síguenos para no perderte la próxima Jarana",
    igFollow: "Seguir",
    footNote: "Producción de eventos privados. Reservas de mesas por WhatsApp o correo.",
    footContact: "Contacto", footSocial: "Redes", footLegal: "Legal",
    legalTerms: "Términos y condiciones", legalNotice: "Aviso legal", legalPrivacy: "Protección de datos",
    footRights: "Todos los derechos reservados",
    wa: "WhatsApp"
  },
  en: {
    tickets: "Tickets", buyTickets: "Buy tickets",
    eyebrow: "Private parties · Worldwide",
    heroA: "Calienta", heroB: "que sales.",
    heroSub: "Jarana Para Todos has led daytime event production since Covid. Good vibes, exclusivity and lunches that run on until sunrise.",
    ticketNote: "Secure payment · Official sale on",
    scroll: "Scroll",
    aboutLabel: "The brand",
    aboutTitle: "A production house, not a promoter.",
    aboutP1: "We produce private parties for a top crowd. In-house production, absolute discretion and a guest list we look after. Every Jarana is unique and unrepeatable, with secret locations revealed hours before the party starts.",
        creds: ["Friendship, happiness and fun", "Licences, insurance and capacity in order at every location", "In-house production, sound and security team", "Standing agreements with partner venues"],
    stats: [{ v: "2021", k: "First edition" }, { v: "15", k: "Cities" }, { v: "+100", k: "Productions" }, { v: "6", k: "Countries" }, { v: "+35,000", k: "Emails on file" }, { v: "+60,000", k: "Attendees" }],
    pressLabel: "Press & partners",
    merchLabel: "Merch",
    merchTitle: "Take the Jarana with you.",
    merchNote: "Limited edition pieces for the Jarana crowd.",
    merch: [
      { k: "cascos", t: "Helmets", d: "Numbered series, hand lettered. One per guest on the ride editions.", meta: "2024 edition · Sold out" },
      { k: "camisetas", t: "T-shirts", d: "Heavy cotton, two-colour screen print. First run in production.", meta: "Coming soon" },
      { k: "carnet", t: "Jaranero card", d: "The circle's annual pass. Named, with member number.", meta: "2025 season" },
      { k: "cromos", t: "Trading cards", d: "A collection of party archetypes. Handed out during the night.", meta: null }
    ],
    merchSoon: "Photo pending",
    merchChars: "characters",
    merchSee: "See more",
    igLabel: "Right now",
    igSync: "Follow us so you don't miss the next Jarana",
    igFollow: "Follow",
    footNote: "Private event production. Table reservations by WhatsApp or email.",
    footContact: "Contact", footSocial: "Follow us", footLegal: "Legal",
    legalTerms: "Terms & conditions", legalNotice: "Legal notice", legalPrivacy: "Data protection",
    footRights: "All rights reserved",
    wa: "WhatsApp"
  }
};

export const CITIES = [
  "Bali", "Baqueira", "Barcelona", "Buenos Aires", "Cerdaña", "Comillas",
  "La Habana", "London", "Madrid", "Mallorca", "Rio de Janeiro"
];

export const PARTNERS = [
  "Castizo",
  "Costa Este",
  "Isabellas",
  "Larrumba",
  "Pantea",
  "Los Reyes del Mango",
  "Luz de Gas",
  "Mar Salada",
  "Mestizo",
  "Tragaluz",
  "Trocadero",
  "Ulu Cliff",
  "Yarini",
  "Vermont"
];

// Fotos del merchandising, alojadas en Cloudinary. Se guarda solo la parte
// final de la URL: cldThumb() y cldFull() le anteponen la transformacion,
// asi las mismas fotos sirven miniatura ligera y version grande.
const CLD = "https://res.cloudinary.com/djqtkbyez/image/upload/";

/** Miniatura sin recortar: la pieza debe verse entera. ~50-100 KB. */
export const cldThumb = (id) => CLD + "f_auto,q_auto,w_800/" + id;
/** Version grande para la galeria, sin recortar. */
export const cldFull = (id) => CLD + "f_auto,q_auto,w_1400/" + id;

// Piezas cuya portada apila sus fotos en vertical. El carnet son dos
// horizontales (anverso y dorso) que juntas componen un vertical.
// Logos de partners. Clave = nombre exacto en PARTNERS; los que aun no lo
// tienen siguen saliendo como texto en el carrusel.
// "h" es la altura a la que se dibuja. No vale una sola para todos: un
// logo apaisado (Trocadero, 6:1) y uno cuadrado de dos lineas (Larrumba,
// 1:1) necesitan alturas muy distintas para que sus letras se lean igual
// de grandes. Se afina a ojo al anadir cada uno.
export const PARTNER_LOGOS = {
  "Trocadero": { id: "v1788685169/logo-trocadero-1-e1721164864173_vkhllc.webp", h: 26 },
  "Tragaluz":  { id: "v1788685680/image_1_tqqrax.png", h: 38 },
  "Larrumba":  { id: "v1788686294/image_2_dscnab.png", h: 48 }
};

/** Logo normalizado a 120px de alto: asi todos ocupan lo mismo en la fila. */
export const cldLogo = (id) => CLD + "c_fit,h_120,f_auto,q_auto/" + id;

export const MERCH_APILADAS = ["carnet"];

export const MERCH_MEDIA = {
  carnet: [
    "v1788606223/01_front_patito_szgbmg.png",
    "v1788606223/02_dorso_fecha_patito_wjqhuo.png"
  ],
  cascos: [
    "v1788606232/35a73c60-401f-4e2f-80f6-559bb15b4d0a_oenucr.jpg",
    "v1788606233/WhatsApp_Image_2024-01-30_at_12.54.28_az3vog.jpg",
    "v1788606233/WhatsApp_Image_2024-01-02_at_10.35.53_j7veoe.jpg",
    "v1788606233/WhatsApp_Image_2024-01-30_at_08.07.40_lbyeir.jpg",
    "v1788606235/WhatsApp_Image_2024-01-31_at_19.24.27_h2zeyj.jpg"
  ],
  cromos: [
    "v1788606244/Julio.iglesias_jfaikr.png",
    "v1788606242/Ana.PAtricia.Boti%CC%81n_rycvrl.png",
    "v1788606243/Bob.Marley_owqypa.png",
    "v1788606243/David.Guetta_av8tgx.png",
    "v1788606243/Don.Rafael_Nadal_a8gh2p.png",
    "v1788606244/Gloto%CC%81n_wmzyov.png",
    "v1788606244/Jaranito_qpbna2.png",
    "v1788606245/Ratatouille_lbqjdu.png",
    "v1788606245/Richy.Rich_hms3sx.png",
    "v1788606246/Teres.Calcuta_tiw5mk.png"
  ],
  // Aun sin fotos: la celda se queda como hueco pendiente.
  camisetas: []
};
