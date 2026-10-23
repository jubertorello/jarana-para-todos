/* Guarda una copia de las ultimas publicaciones de Instagram dentro del
 * repositorio: el listado en lib/instagram-snapshot.json y las fotos en
 * public/instagram/. Asi la seccion sigue viendose aunque Behold pause la
 * cuenta, porque entonces deja de servir tambien las imagenes.
 *
 *   node scripts/instagram-snapshot.mjs
 *
 * Gasta UNA consulta del cupo mensual de Behold (1.200 en el plan gratis).
 * Luego hay que subir los cambios con git.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname;
const DIR_FOTOS = join(RAIZ, "public", "instagram");
const DESTINO = join(RAIZ, "lib", "instagram-snapshot.json");
const CUANTAS = 8;

function leeEnv(clave) {
  if (process.env[clave]) return process.env[clave];
  try {
    const txt = readFileSync(join(RAIZ, ".env.local"), "utf8");
    const linea = txt.split("\n").find((l) => l.startsWith(clave + "="));
    return linea ? linea.slice(clave.length + 1).trim() : null;
  } catch {
    return null;
  }
}

const feed = leeEnv("BEHOLD_FEED_URL");
if (!feed) {
  console.error("Falta BEHOLD_FEED_URL (en .env.local o como variable).");
  process.exit(1);
}

const res = await fetch(feed);
if (!res.ok) {
  const cuerpo = await res.text().catch(() => "");
  console.error(`Behold respondio ${res.status}. No se toca la copia actual.`);
  if (cuerpo.includes("pausedByOverage")) {
    console.error("La cuenta esta pausada por superar el cupo. Se reactiva el dia 1.");
  }
  process.exit(1);
}

const data = await res.json();
const raw = (Array.isArray(data) ? data : data.posts || data.media || []).slice(0, CUANTAS);
if (!raw.length) {
  console.error("El feed no trae publicaciones. No se toca la copia actual.");
  process.exit(1);
}

mkdirSync(DIR_FOTOS, { recursive: true });

const posts = [];
for (const [i, p] of raw.entries()) {
  const origen = p.sizes?.medium?.mediaUrl || p.thumbnailUrl || p.mediaUrl;
  if (!origen) continue;
  const foto = await fetch(origen);
  if (!foto.ok) {
    console.error(`  foto ${i + 1}: no se pudo descargar (${foto.status})`);
    continue;
  }
  const tipo = foto.headers.get("content-type") || "";
  const ext = tipo.includes("png") ? "png" : tipo.includes("webp") ? "webp" : "jpg";
  const nombre = `${String(i + 1).padStart(2, "0")}.${ext}`;
  const bytes = Buffer.from(await foto.arrayBuffer());
  writeFileSync(join(DIR_FOTOS, nombre), bytes);
  posts.push({
    id: p.id || "ig-" + i,
    src: "/instagram/" + nombre,
    url: p.permalink || "https://instagram.com/jarana_para_todos",
    alt: (p.prunedCaption || p.caption || "Jarana Para Todos").slice(0, 90)
  });
  console.log(`  ${nombre}  ${Math.round(bytes.length / 1024)} KB`);
}

if (!posts.length) {
  console.error("No se descargo ninguna foto. No se toca la copia actual.");
  process.exit(1);
}

// Las sobrantes de una copia anterior mas larga
const vigentes = new Set(posts.map((p) => p.src.replace("/instagram/", "")));
for (const f of readdirSync(DIR_FOTOS)) {
  if (!vigentes.has(f)) unlinkSync(join(DIR_FOTOS, f));
}

writeFileSync(
  DESTINO,
  JSON.stringify({ actualizado: new Date().toISOString(), posts }, null, 2) + "\n"
);
console.log(`\nCopia guardada: ${posts.length} publicaciones.`);
console.log("Ahora hay que subirlo: git add -A && git commit && git push");
