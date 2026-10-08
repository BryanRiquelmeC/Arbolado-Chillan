/* Botones de cada registro: PDF · Ver · Editar · Eliminar */
import { Eye, FileDown, Pencil, Trash2 } from "lucide-react";
import Boton from "../ui/Boton.jsx";

export default function AccionesRegistro({ r, onVer, onPdf, onEditar, onEliminar }) {
  return (
    <div className="flex flex-wrap gap-2 lg:flex-nowrap lg:justify-end">
      <Boton tamano="sm" icono={FileDown} onClick={() => onPdf(r)}>
        PDF
      </Boton>
      <Boton tamano="sm" icono={Eye} onClick={() => onVer(r)}>
        Ver
      </Boton>
      <Boton tamano="sm" icono={Pencil} onClick={() => onEditar(r)}>
        Editar
      </Boton>
      <Boton
        tamano="sm"
        variante="borrar"
        icono={Trash2}
        aria-label="Eliminar"
        onClick={() => onEliminar(r)}
      />
    </div>
  );
}
