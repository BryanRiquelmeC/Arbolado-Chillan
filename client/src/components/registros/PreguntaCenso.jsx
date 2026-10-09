/* Pregunta VTA en el censo como lista desplegable (compacta para tablet).
   Guarda el mismo texto completo que la Matriz VTA, pero muestra solo
   el título de la opción: "BIO-00 (Sano / Sin Agente Biótico Visible)". */
import Campo from "../form/Campo.jsx";
import { Numero, Texto } from "../form/Controles.jsx";

/** "BIO-00 (Sano…): Árbol sin presencia…" → "BIO-00 (Sano…)" */
const corto = (o) => o.split(/:\s/)[0].trim();

export default function PreguntaCenso({ p, d, set }) {
  const etiqueta = p.label;

  if (p.type === "number") {
    return (
      <Campo etiqueta={etiqueta} ayuda={p.hint} className="justify-between">
        <Numero unidad={p.unit} valor={d[p.id]} onCambiar={(v) => set(p.id, v)} />
      </Campo>
    );
  }

  const opciones = p.opts || [];
  const elegida = opciones.find((o) => o === d[p.id]);
  return (
    <Campo etiqueta={etiqueta} ancho>
      <select
        className="campo"
        value={d[p.id] ?? ""}
        onChange={(e) => {
          set(p.id, e.target.value);
          if (e.target.value !== "Otros") set(p.id + "_otro", "");
        }}
      >
        <option value="">—</option>
        {opciones.map((o) => (
          <option key={o} value={o}>
            {corto(o)}
          </option>
        ))}
        {p.otros && <option value="Otros">Otros…</option>}
      </select>
      {/* Descripción de la opción elegida, para confirmar */}
      {elegida && elegida.includes(": ") && (
        <p className="mt-1.5 text-[12.5px] leading-snug text-suave">{elegida.split(/:\s/).slice(1).join(": ")}</p>
      )}
      {d[p.id] === "Otros" && (
        <div className="mt-2">
          <Texto valor={d[p.id + "_otro"]} onCambiar={(v) => set(p.id + "_otro", v)} placeholder="Especifique…" />
        </div>
      )}
    </Campo>
  );
}
