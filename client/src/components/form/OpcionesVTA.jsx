/* =============================================================
   Opciones de la Matriz VTA: código en negrita + descripción.
   Tocar la opción marcada la desmarca. Incluye "Otros:" con texto.
   ============================================================= */

/** Separa "BIO-01 (Leve…): descripción" en título y descripción */
function partes(o) {
  const m = o.match(/^(.+?\)|[^:]+):\s*(.*)$/);
  return m ? [m[1], m[2]] : [o, ""];
}

/** Una opción (definida fuera para que el texto de "Otros" no pierda el foco) */
function Opcion({ nombre, activo, onAlternar, children }) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl border-[1.5px] px-4 py-3 transition ${
        activo
          ? "border-2 border-c2 bg-c4 shadow-[0_0_0_3px_rgba(30,136,201,.12)]"
          : "border-[#cfe3f2] bg-white hover:border-c3 hover:bg-c5"
      }`}
    >
      <input
        type="radio"
        name={nombre}
        checked={activo}
        onChange={() => {}}
        onClick={onAlternar}
        className="mt-0.5 size-4.75 flex-none accent-c2"
      />
      {children}
    </label>
  );
}

export default function OpcionesVTA({ nombre, opciones, otros, valor, otro, onCambiar, onOtro }) {
  return (
    <div className="flex flex-col gap-2.5">
      {opciones.map((o) => {
        const [titulo, desc] = partes(o);
        return (
          <Opcion
            key={o}
            nombre={nombre}
            activo={valor === o}
            onAlternar={() => onCambiar(valor === o ? "" : o)}
          >
            <span className="flex min-w-0 flex-col gap-1">
              <b className="text-[15px] text-c1">{titulo}</b>
              {desc && (
                <span className="text-[14.5px] leading-relaxed font-medium text-[#2b4a63]">
                  {desc}
                </span>
              )}
            </span>
          </Opcion>
        );
      })}
      {otros && (
        <Opcion
          nombre={nombre}
          activo={valor === "Otros"}
          onAlternar={(e) =>
            e.target.type === "radio" && onCambiar(valor === "Otros" ? "" : "Otros")
          }
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <b className="text-[15px] text-c1">Otros:</b>
            <input
              type="text"
              className="campo flex-1 py-2"
              placeholder="Especifique…"
              value={otro ?? ""}
              onChange={(e) => {
                onOtro(e.target.value);
                if (valor !== "Otros") onCambiar("Otros");
              }}
            />
          </span>
        </Opcion>
      )}
    </div>
  );
}
