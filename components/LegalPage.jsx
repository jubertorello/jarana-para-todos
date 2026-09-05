import Link from "next/link";

/** Renderiza un documento legal a partir de los bloques extraidos del .docx. */
export default function LegalPage({ titulo, entradilla, bloques }) {
  return (
    <main className="legal">
      <header className="legal-head">
        <Link className="legal-back" href="/">
          <span aria-hidden="true">&#8592;</span> Volver
        </Link>
        <h1>{titulo}</h1>
        {entradilla ? <p className="legal-intro">{entradilla}</p> : null}
      </header>

      <div className="legal-body">
        {bloques.map((b, i) => {
          if (b.t === "h") return <h2 key={i}>{b.texto}</h2>;
          if (b.t === "li") return <p className="legal-li" key={i}><b />{b.texto}</p>;
          if (b.t === "tabla") {
            const [cab, ...filas] = b.filas;
            return (
              <div className="legal-tabla-wrap" key={i}>
                <table className="legal-tabla">
                  <thead>
                    <tr>{cab.map((c, j) => <th key={j}>{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filas.map((f, j) => (
                      <tr key={j}>
                        {f.map((c, k) => (
                          <td key={k}>
                            {c.split("\n").map((linea, l) => <span key={l}>{linea}</span>)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return <p key={i}>{b.texto}</p>;
        })}
      </div>

      <footer className="legal-foot">
        <Link href="/">Jarana Para Todos</Link>
        <span>TMM TRIANGLE4LIFE SL &middot; B72926397</span>
      </footer>
    </main>
  );
}
