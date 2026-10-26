/* =============================================================
   Opciones de la Matriz VTA: título en negrita + descripción.
   · Tocar la opción marcada la desmarca.
   · "Otros:" es independiente: se puede marcar junto con una opción.
   · sub: al elegir la opción indicada (ej. "Sí") se despliegan
     sub-opciones (ej. Domiciliaria / Alumbrado público).
   ============================================================= */
import { Chips } from "./Controles.jsx";
import { mismaOpcion } from "../../utils/vta.js";

/** Separa "Leve…: descripción" en título y descripción */
function partes(o) {
  const m = o.match(/^(.+?\)|[^:]+):\s*(.*)$/);
  return m ? [m[1], m[2]] : [o, ""];
}

/** Una opción (definida fuera para que el texto de "Otros" no pierda el foco) */
function Opcion({ tipo = "radio", nombre, activo, onAlternar, children }) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl border-[1.5px] px-4 py-3 transition ${
        activo
          ? "border-2 border-c2 bg-c4 shadow-[0_0_0_3px_rgba(30,136,201,.12)]"
          : "border-[#cfe3f2] bg-white hover:border-c3 hover:bg-c5"
      }`}
    >
      <input
        type={tipo}
        name={tipo === "radio" ? nombre : undefined}
        checked={activo}
        onChange={() => {}}
        onClick={onAlternar}
        className="mt-0.5 size-[19px] flex-none accent-c2"
      />
      {children}
    </label>
  );
}

export default function OpcionesVTA({
  nombre,
  opciones,
  otros,
  obs,
  valor,
  otrosActivo,
  otro,
  sub,
  subValor,
  onCambiar,
  onOtrosActivo,
  onOtro,
  onSub
}) {
  const elegida = valor === "Otros" ? "" : valor; // registros antiguos guardaban "Otros" como respuesta
  // Sub-opciones guardadas como texto "Domiciliaria, Alumbrado público"
  const subLista = String(subValor || "").split(", ").filter(Boolean);

  return (
    <div className="flex flex-col gap-2.5">
      {opciones.map((o) => {
        const [titulo, desc] = partes(o);
        const activo = mismaOpcion(elegida, o); // registros antiguos guardaban la opción con código
        const conSub = sub && activo && o.startsWith(sub.si);
        return (
          <div key={o} className="flex flex-col gap-2">
            <Opcion
              nombre={nombre}
              activo={activo}
              onAlternar={() => {
                onCambiar(activo ? "" : o);
                if (sub && (activo || !o.startsWith(sub.si))) onSub(""); // limpiar sub-opción
              }}
            >
              <span className="flex min-w-0 flex-col gap-1">
                <b className="text-[15px] text-c1">{titulo}</b>
                {desc && (
                  <span className="text-[14.5px] leading-relaxed font-medium text-[#2b4a63]">{desc}</span>
                )}
              </span>
            </Opcion>
            {conSub && (
              <div className="ml-8 flex flex-col gap-2 rounded-xl border-l-4 border-c3 bg-c5 px-4 py-3">
                <span className="text-[13px] font-bold text-c1">{sub.titulo} (puede marcar ambas)</span>
                <Chips
                  multiple
                  opciones={sub.opciones}
                  valor={subLista}
                  onCambiar={(lista) => onSub(sub.opciones.filter((x) => lista.includes(x)).join(", "))}
                />
              </div>
            )}
          </div>
        );
      })}
      {obs && (
        <label className="flex flex-col gap-1.5 rounded-xl border border-[#cfe3f2] bg-white px-4 py-3">
          <b className="text-[15px] text-c1">Observación</b>
          <textarea
            className="campo min-h-20"
            placeholder="Escriba una observación sobre el punto (opcional)…"
            value={otro ?? ""}
            onChange={(e) => onOtro(e.target.value)}
          />
        </label>
      )}
      {otros && (
        <Opcion
          tipo="checkbox"
          activo={otrosActivo}
          onAlternar={(e) => e.target.type === "checkbox" && onOtrosActivo(!otrosActivo)}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <b className="text-[15px] text-c1">Otros:</b>
            <input
              type="text"
              className="campo flex-1 py-2"
              placeholder="Especifique… (se puede marcar junto con otra opción)"
              value={otro ?? ""}
              onChange={(e) => {
                onOtro(e.target.value);
                if (!otrosActivo) onOtrosActivo(true);
              }}
            />
          </span>
        </Opcion>
      )}
    </div>
  );
}
