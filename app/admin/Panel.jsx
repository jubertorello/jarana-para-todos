"use client";

import { useState } from "react";

const CAMPOS = [
  {
    k: "entradas",
    etiqueta: "Botón de entradas",
    ayuda: "A dónde lleva el botón ENTRADAS de la cabecera y de la portada.",
    marcador: "https://site.fourvenues.com/es/jarana"
  },
  {
    k: "whatsapp",
    etiqueta: "Número de WhatsApp",
    ayuda: "Con prefijo de país y sin el signo +. Es el del botón flotante y el de reservas.",
    marcador: "34613064564"
  },
  {
    k: "whatsappGrupo",
    etiqueta: "Grupo de WhatsApp",
    ayuda: "El enlace de invitación al grupo. Se copia desde WhatsApp, en Invitar por enlace.",
    marcador: "https://chat.whatsapp.com/..."
  }
];

export default function Panel({ inicial }) {
  const [clave, setClave] = useState("");
  const [dentro, setDentro] = useState(false);
  const [datos, setDatos] = useState(inicial);
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function llama(cuerpo) {
    setCargando(true);
    setEstado(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cuerpo, clave })
      });
      const json = await res.json();
      if (!res.ok) {
        setEstado({ tipo: "mal", texto: json.error || "Algo ha fallado." });
        return null;
      }
      return json;
    } catch {
      setEstado({ tipo: "mal", texto: "No se ha podido conectar." });
      return null;
    } finally {
      setCargando(false);
    }
  }

  async function entrar(e) {
    e.preventDefault();
    const json = await llama({ soloEntrar: true });
    if (json) {
      setDatos(json.ajustes);
      setDentro(true);
    }
  }

  async function guardar(e) {
    e.preventDefault();
    const json = await llama(datos);
    if (json) {
      setEstado({
        tipo: "bien",
        texto: "Guardado. La web se actualiza sola en un minuto más o menos."
      });
    }
  }

  const set = (k) => (e) =>
    setDatos({ ...datos, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  if (!dentro) {
    return (
      <main className="adm">
        <form className="adm-caja" onSubmit={entrar}>
          <h1>Panel de Jarana</h1>
          <p className="adm-sub">Para editar los enlaces de la web.</p>
          <label>
            <span>Contraseña</span>
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoFocus
              autoComplete="current-password"
            />
          </label>
          {estado ? <p className={"adm-aviso " + estado.tipo}>{estado.texto}</p> : null}
          <button type="submit" disabled={cargando || !clave}>
            {cargando ? "Comprobando…" : "Entrar"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="adm">
      <form className="adm-caja adm-ancha" onSubmit={guardar}>
        <h1>Panel de Jarana</h1>
        <p className="adm-sub">
          Los cambios se publican solos. Tardan un minuto en verse en la web.
        </p>

        {CAMPOS.map((c) => (
          <label key={c.k}>
            <span>{c.etiqueta}</span>
            <input
              type="text"
              value={datos[c.k] || ""}
              onChange={set(c.k)}
              placeholder={c.marcador}
              spellCheck="false"
            />
            <em>{c.ayuda}</em>
          </label>
        ))}

        {estado ? <p className={"adm-aviso " + estado.tipo}>{estado.texto}</p> : null}

        <button type="submit" disabled={cargando}>
          {cargando ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>
    </main>
  );
}
