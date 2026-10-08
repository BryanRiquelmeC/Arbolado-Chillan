/* =============================================================
   Controles de formulario reutilizables
   · Texto, Numero (con unidad), Lista (select)
   · Chips (opción única o múltiple, se pueden desmarcar)
   · BotonQuitar (limpia la selección)
   ============================================================= */
import { X } from "lucide-react";

export function Texto({ valor, onCambiar, ...props }) {
  return (
    <input
      type="text"
      className="campo"
      value={valor ?? ""}
      onChange={(e) => onCambiar(e.target.value)}
      {...props}
    />
  );
}

export function Numero({ valor, onCambiar, unidad, ...props }) {
  return (
    <div className="flex min-w-0">
      <input
        type="number"
        step="any"
        min="0"
        inputMode="decimal"
        className={`campo ${unidad ? "rounded-r-none" : ""}`}
        value={valor ?? ""}
        onChange={(e) => onCambiar(e.target.value)}
        {...props}
      />
      {unidad && (
        <span className="flex items-center rounded-r-[10px] border-[1.5px] border-l-0 border-[#cfe3f2] bg-c4 px-3 text-[13px] font-semibold text-c1">
          {unidad}
        </span>
      )}
    </div>
  );
}

export function Lista({ valor, onCambiar, opciones, vacio = "—", ...props }) {
  return (
    <select
      className="campo"
      value={valor ?? ""}
      onChange={(e) => onCambiar(e.target.value)}
      {...props}
    >
      <option value="">{vacio}</option>
      {opciones.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

/**
 * Chips de selección.
 * multiple=false → valor texto (tocar de nuevo desmarca)
 * multiple=true  → valor arreglo
 */
export function Chips({ valor, onCambiar, opciones, multiple = false }) {
  const marcado = (o) =>
    multiple ? (valor || []).includes(o.valor ?? o) : valor === (o.valor ?? o);
  const alternar = (o) => {
    const v = o.valor ?? o;
    if (multiple) {
      const actual = valor || [];
      onCambiar(actual.includes(v) ? actual.filter((x) => x !== v) : [...actual, v]);
    } else onCambiar(valor === v ? "" : v);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => {
        const activo = marcado(o);
        return (
          <button
            key={o.valor ?? o}
            type="button"
            aria-pressed={activo}
            onClick={() => alternar(o)}
            className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1.5 text-[15px] font-semibold transition ${
              activo
                ? "border-c2 bg-c2 text-white"
                : "border-[#cfe3f2] bg-c5 text-tinta hover:border-c3"
            }`}
          >
            {o.icono}
            {o.texto ?? o}
          </button>
        );
      })}
    </div>
  );
}

export function BotonQuitar({ visible, onClick }) {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-borde px-3 py-1 text-[12.5px] font-semibold text-suave hover:border-peligro hover:text-peligro"
    >
      <X size={14} /> Quitar selección
    </button>
  );
}
