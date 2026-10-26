/* Ficha completa de un registro (croquis, Matriz VTA o censo) */
import { ENCUESTA } from "../../config/encuesta.js";
import { filasCalculos, fotosDe, respuestaVTA } from "../../utils/vta.js";
import { ETIQUETAS, GRUPOS } from "../../config/croquis.js";
import { paredTestigos } from "../../utils/croquis.js";
import { CSS_TONO, tonoFila } from "../../utils/colores.js";
import DibujoCroquis from "../croquis/DibujoCroquis.jsx";
import { fichaCenso, legible } from "../../utils/registros.js";
import { ICONOS_SECCION } from "../../config/iconos.js";
import { respuestasCensoVta } from "../../config/censoVta.js";
import { urlFoto } from "../../utils/rutas.js";

function Fila({ etiqueta, children }) {
  return (
    <dl className="grid grid-cols-1 gap-1 border-b border-borde py-2.5 text-[14.5px] sm:grid-cols-[minmax(150px,34%)_1fr] sm:gap-4">
      <dt className="font-bold text-c1">{etiqueta}</dt>
      <dd className="leading-relaxed break-words">{children}</dd>
    </dl>
  );
}

function Seccion({ icono: Icono, children }) {
  return (
    <h4 className="mt-5 mb-1 flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-c2 uppercase">
      {Icono && <Icono size={16} />}
      {children}
    </h4>
  );
}

function Enlace({ url, texto }) {
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-c2 underline"
    >
      {texto}
    </a>
  ) : (
    "—"
  );
}

export default function DetalleRegistro({ registro: r }) {
  if (r._tipo === "croquis") {
    return (
      <>
        <div className="mt-3">
          <DibujoCroquis datos={r} />
        </div>
        {GRUPOS.map(([titulo, ids]) => (
          <div key={titulo}>
            <Seccion>{titulo}</Seccion>
            {ids.map((id) => (
              <Fila key={id} etiqueta={ETIQUETAS[id] || id}>
                <span className={CSS_TONO[tonoFila(r, { id })] || ""}>{legible(r[id])}</span>
              </Fila>
            ))}
            {titulo === "Datos del árbol" &&
              paredTestigos(r)?.filas.map(([k, v]) => (
                <Fila key={k} etiqueta={k}>
                  <span className={v.includes("RIESGO") ? "font-bold text-[#b42318]" : v.includes("suficiente") ? "font-bold text-[#17663a]" : ""}>{v}</span>
                </Fila>
              ))}
          </div>
        ))}
        {r.fotos?.length > 0 && (
          <>
            <Seccion>Fotografías ({r.fotos.length})</Seccion>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {r.fotos.map((f, i) => (
                <figure key={i} className="overflow-hidden rounded-xl border border-borde">
                  <img src={urlFoto(f.img)} alt={f.nota || `Fotografía ${i + 1}`} className="w-full" />
                  {f.nota && <figcaption className="px-3 py-2 text-[13px]">{f.nota}</figcaption>}
                </figure>
              ))}
            </div>
          </>
        )}
      </>
    );
  }

  if (r._tipo === "censo") {
    return (
      <>
        <Seccion>Identificación</Seccion>
        {fichaCenso(r).map(([k, v]) => (
          <Fila key={k} etiqueta={k}>
            {v || "—"}
          </Fila>
        ))}
        <Fila etiqueta="Informe original">
          <Enlace url={r.informe_url} texto="Abrir informe PDF (Drive)" />
        </Fila>
        {r.fotos_url && (
          <Fila etiqueta="Fotografías">
            <Enlace url={r.fotos_url} texto="Abrir fotografías" />
          </Fila>
        )}
        {respuestasCensoVta(r).map(([titulo, filas]) => (
          <div key={titulo}>
            <Seccion>{titulo}</Seccion>
            {filas.map(([k, v]) => (
              <Fila key={k} etiqueta={k}>
                {v}
              </Fila>
            ))}
          </div>
        ))}
        {r.campos?.length > 0 && <Seccion>Evaluación completa ({r.campos.length} respuestas)</Seccion>}
        {(r.campos || []).map(([k, v], i) => (
          <Fila key={i} etiqueta={k}>
            {v}
          </Fila>
        ))}
        {r.fotos?.length > 0 && (
          <>
            <Seccion>Fotografías ({r.fotos.length})</Seccion>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {r.fotos.map((f, i) => (
                <figure key={i} className="overflow-hidden rounded-xl border border-borde">
                  <img src={urlFoto(f.img)} alt={f.nota || `Fotografía ${i + 1}`} className="w-full" />
                  {f.nota && <figcaption className="px-3 py-2 text-[13px]">{f.nota}</figcaption>}
                </figure>
              ))}
            </div>
          </>
        )}
      </>
    );
  }

  // Matriz VTA
  return ENCUESTA.secciones.map((s) => (
    <div key={s.titulo}>
      <Seccion icono={ICONOS_SECCION[s.icono]}>{s.titulo}</Seccion>
      {s.preguntas.map((p) => {
        let v = r[p.id];
        if (p.type === "photo") {
          return (
            <Fila key={p.id} etiqueta={`${p.n}. ${p.label}`}>
              {fotosDe(r, p).length ? (
                <div className="flex flex-wrap gap-2">
                  {fotosDe(r, p).map((f, i) => (
                    <img key={i} src={urlFoto(f)} alt="" className="max-h-64 max-w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                "—"
              )}
            </Fila>
          );
        }
        if (p.type === "vinculo") return null;
        if (p.type === "calculos") {
          return filasCalculos(r).map(([k, val]) => (
            <Fila key={k} etiqueta={k}>
              <span className={CSS_TONO[tonoFila(r, { etiqueta: k })] || ""}>{val}</span>
            </Fila>
          ));
        }
        if (p.type === "radio" || p.type === "select") v = respuestaVTA(r, p);
        if (p.type === "gps" && r[p.id + "_gps"]) v = `${v || ""} · GPS: ${r[p.id + "_gps"]}`;
        return (
          <Fila key={p.id} etiqueta={`${p.n ? p.n + ". " : ""}${p.label}`}>
            <span className={CSS_TONO[tonoFila(r, { id: p.id })] || ""}>
              {legible(v)}
              {v && p.unit ? ` ${p.unit}` : ""}
            </span>
          </Fila>
        );
      })}
    </div>
  ));
}
