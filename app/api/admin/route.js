import { timingSafeEqual } from "node:crypto";
import AJUSTES from "@/lib/ajustes.json";

/* Escribe en el repositorio, asi que no puede cachearse ni prerenderizarse. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REPO = "jubertorello/jarana-para-todos";
const FICHERO = "lib/ajustes.json";

/* Freno sencillo contra prueba y error. Vive en memoria, asi que no es
   infalible en serverless, pero corta de raiz el intento desde un sitio. */
const intentos = new Map();
const MAX = 8;
const VENTANA = 10 * 60 * 1000;

function demasiadosIntentos(ip) {
  const ahora = Date.now();
  const previo = intentos.get(ip);
  if (!previo || ahora - previo.desde > VENTANA) {
    intentos.set(ip, { desde: ahora, n: 1 });
    return false;
  }
  previo.n += 1;
  return previo.n > MAX;
}

/* Comparacion de tiempo constante: comparar con === filtra, por lo que tarda,
   cuantos caracteres se acertaron. */
function hayClaveConfigurada() {
  return Boolean((process.env.ADMIN_PASSWORD || "").trim());
}

function claveCorrecta(dada) {
  /* Se recortan los dos lados: al pegar la contrasena en Vercel es facil
     que se cuele un espacio o un salto de linea al final, y entonces esto
     rechazaba la contrasena buena sin que se viera por que. */
  const buena = (process.env.ADMIN_PASSWORD || "").trim();
  if (!buena || typeof dada !== "string") return false;
  const a = Buffer.from(dada.trim());
  const b = Buffer.from(buena);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function enlaceValido(url, dominios) {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return dominios.some((d) => u.hostname === d || u.hostname.endsWith("." + d));
  } catch {
    return false;
  }
}

function limpia(cuerpo) {
  const entradas = String(cuerpo.entradas || "").trim();
  const grupo = String(cuerpo.whatsappGrupo || "").trim();
  // Se queda solo con los digitos: da igual que lo escriban con +, espacios
  // o guiones.
  const movil = String(cuerpo.whatsapp || "").replace(/[^0-9]/g, "");

  if (!enlaceValido(entradas, ["fourvenues.com", "linktr.ee", "jaranaparatodos.com"])) {
    return { error: "El enlace de entradas no vale. Tiene que empezar por https y ser de Fourvenues, Linktree o jaranaparatodos.com." };
  }
  if (!enlaceValido(grupo, ["whatsapp.com", "wa.me"])) {
    return { error: "El enlace del grupo no vale. Tiene que ser una invitacion de chat.whatsapp.com." };
  }
  if (movil.length < 9 || movil.length > 15) {
    return { error: "El numero de WhatsApp no vale. Va con prefijo de pais y sin el signo +, por ejemplo 34613064564." };
  }
  return {
    ajustes: {
      entradas,
      whatsapp: movil,
      whatsappGrupo: grupo,
      actualizado: new Date().toISOString()
    }
  };
}

function cabecerasGitHub(token) {
  return {
    Authorization: "Bearer " + token,
    Accept: "application/vnd.github+json",
    "User-Agent": "jarana-admin"
  };
}

const API_FICHERO = `https://api.github.com/repos/${REPO}/contents/${FICHERO}`;

/* Lee los ajustes de GitHub, que es donde viven de verdad. No vale el
   import de arriba: ese se congela al compilar, y si el formulario se
   rellenaba con el, al guardar se pisaba el ultimo cambio con un valor
   viejo. */
async function ajustesDeGitHub(token) {
  if (!token) return null;
  try {
    const res = await fetch(API_FICHERO, {
      headers: cabecerasGitHub(token),
      cache: "no-store"
    });
    if (!res.ok) return null;
    const { content, sha } = await res.json();
    return { ajustes: JSON.parse(Buffer.from(content, "base64").toString("utf8")), sha };
  } catch {
    return null;
  }
}

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";

  let cuerpo;
  try {
    cuerpo = await req.json();
  } catch {
    return Response.json({ error: "Peticion mal formada." }, { status: 400 });
  }

  /* Avisar de que no hay contrasena puesta no es una filtracion: sin ella
     nadie puede entrar igualmente, y si no se distingue, parece que la
     contrasena esta mal cuando el problema es otro. */
  if (!hayClaveConfigurada()) {
    return Response.json(
      { error: "El panel no tiene contrasena configurada en Vercel (ADMIN_PASSWORD). Si acabas de crearla, haz Redeploy." },
      { status: 503 }
    );
  }

  if (demasiadosIntentos(ip)) {
    return Response.json({ error: "Demasiados intentos. Prueba dentro de un rato." }, { status: 429 });
  }
  if (!claveCorrecta(cuerpo.clave)) {
    return Response.json({ error: "Contrasena incorrecta." }, { status: 401 });
  }

  /* Solo comprobar la contrasena, para la pantalla de entrada. Se devuelven
     los ajustes recien leidos de GitHub, para que el formulario arranque con
     lo que hay de verdad y no con lo que habia al compilar. */
  if (cuerpo.soloEntrar) {
    const vivo = await ajustesDeGitHub(process.env.GITHUB_TOKEN_ADMIN);
    return Response.json({ ok: true, ajustes: vivo ? vivo.ajustes : AJUSTES });
  }

  const { error, ajustes } = limpia(cuerpo);
  if (error) return Response.json({ error }, { status: 400 });

  const token = process.env.GITHUB_TOKEN_ADMIN;
  if (!token) {
    return Response.json({ error: "Falta GITHUB_TOKEN_ADMIN en Vercel." }, { status: 500 });
  }

  const cabeceras = cabecerasGitHub(token);
  const api = API_FICHERO;

  /* Hace falta el sha del fichero actual: GitHub lo exige para sobrescribir
     y asi no se pisa un cambio hecho entre medias. */
  const actual = await ajustesDeGitHub(token);
  if (!actual) {
    return Response.json({ error: "No se pudo leer el fichero en GitHub." }, { status: 502 });
  }
  const sha = actual.sha;

  const guardado = await fetch(api, {
    method: "PUT",
    headers: { ...cabeceras, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Cambia los ajustes desde el panel",
      content: Buffer.from(JSON.stringify(ajustes, null, 2) + "\n").toString("base64"),
      sha
    })
  });
  if (!guardado.ok) {
    const detalle = await guardado.text().catch(() => "");
    return Response.json(
      { error: "GitHub rechazo el cambio. " + detalle.slice(0, 120) },
      { status: 502 }
    );
  }

  return Response.json({ ok: true, ajustes });
}
