/* Botones fijos al final de un formulario: Limpiar · Guardar · Guardar y PDF */
import { FileDown, Save } from "lucide-react";
import Boton from "../ui/Boton.jsx";

export default function BarraAcciones({ onLimpiar, onGuardar, guardando }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap justify-end gap-3 bg-linear-to-b from-transparent to-c5 to-30% px-1 pt-6 pb-2">
      <Boton className="flex-1 sm:flex-none" onClick={onLimpiar}>
        Limpiar
      </Boton>
      <Boton
        icono={Save}
        className="flex-1 sm:flex-none"
        disabled={guardando}
        onClick={() => onGuardar(false)}
      >
        Guardar
      </Boton>
      <Boton
        variante="primario"
        icono={FileDown}
        className="w-full sm:w-auto"
        disabled={guardando}
        onClick={() => onGuardar(true)}
      >
        Guardar y generar PDF
      </Boton>
    </div>
  );
}
