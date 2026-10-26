/* Pregunta VTA en el censo como lista desplegable (compacta para tablet).
   Guarda el mismo texto completo que la Matriz VTA, pero muestra solo
   el título de la opción: "BIO-00 (Sano / Sin Agente Biótico Visible)". */
import Campo from "../form/Campo.jsx";
import { Chips, Numero, Texto } from "../form/Controles.jsx";

/** "BIO-00 (Sano…): Árbol sin presencia…"  "BIO-00 (Sano…)" */
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
          if (p.sub && !e.target.value.startsWith(p.sub.si)) set(p.sub.campo, "");
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
      {/* Sub-opciones (ej. Interferencia eléctrica "Sí" → Domiciliaria / Alumbrado público) */}
      {p.sub && String(d[p.id] || "").startsWith(p.sub.si) && (
        <div className="mt-2 flex flex-col gap-1.5">
          <span className="text-[13px] font-bold text-c1">{p.sub.titulo}</span>
          <Chips
            multiple
            opciones={p.sub.opciones}
            valor={String(d[p.sub.campo] || "").split(", ").filter(Boolean)}
            onCambiar={(l) => set(p.sub.campo, p.sub.opciones.filter((x) => l.includes(x)).join(", "))}
          />
        </div>
      )}
      {d[p.id] === "Otros" && (
        <div className="mt-2">
          <Texto valor={d[p.id + "_otro"]} onCambiar={(v) => set(p.id + "_otro", v)} placeholder="Especifique…" />
        </div>
      )}
    </Campo>
  );
}
