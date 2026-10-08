/* Croquis · Perfil transversal: dibujo en vivo + anchos en el orden del plano */
import { ArrowLeft, ArrowRight, Ruler } from "lucide-react";
import Tarjeta from "../ui/Tarjeta.jsx";
import Campo from "../form/Campo.jsx";
import { Lista } from "../form/Controles.jsx";
import DibujoCroquis from "./DibujoCroquis.jsx";
import ColumnaPerfil from "./ColumnaPerfil.jsx";
import { PERFIL, UBICACIONES_ARBOL } from "../../config/croquis.js";

export default function SeccionPerfil({ d, set, calculo }) {
  return (
    <Tarjeta icono={Ruler} titulo="Perfil transversal (anchos)">
      <DibujoCroquis datos={d} />

      <div className="mt-4 mb-2 flex justify-between text-[12.5px] font-bold tracking-wide text-suave uppercase">
        <span className="flex items-center gap-1">
          <ArrowLeft size={15} /> Límite oficial izq.
        </span>
        <span className="flex items-center gap-1">
          Límite oficial der. <ArrowRight size={15} />
        </span>
      </div>

      {/* Escritorio: 5 columnas en fila · Tablet: calzada a lo ancho · Teléfono: una debajo de otra */}
      <div className="grid grid-cols-1 overflow-hidden rounded-xl border-[1.5px] border-[#cfe3f2] sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.6fr_1fr_1fr]">
        {PERFIL.map((col) => (
          <ColumnaPerfil key={col.id} columna={col} d={d} set={set} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div className="rounded-lg bg-c4 px-4 py-2.5 font-bold text-c1">
          Ancho total entre líneas oficiales: {calculo.total.toFixed(2)} m
        </div>
        <Campo etiqueta="Ubicación del árbol" className="w-full sm:w-64">
          <Lista
            opciones={UBICACIONES_ARBOL}
            valor={d.ubic_arbol}
            onCambiar={(v) => set("ubic_arbol", v)}
          />
        </Campo>
      </div>
    </Tarjeta>
  );
}
