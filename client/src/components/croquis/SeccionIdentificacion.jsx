/* Croquis · Identificación: dirección (GPS) en una fila; manzana y fecha en otra.
   Celular: todo en una columna · Tablet y PC: 2 columnas parejas en la segunda fila */
import { MapPin } from "lucide-react";
import Tarjeta from "../ui/Tarjeta.jsx";
import Campo from "../form/Campo.jsx";
import CampoGps from "../form/CampoGps.jsx";
import { Texto } from "../form/Controles.jsx";

export default function SeccionIdentificacion({ d, set }) {
  return (
    <Tarjeta icono={MapPin} titulo="Identificación">
      <div className="flex flex-col gap-5">
        <Campo etiqueta="Dirección" requerido campo="direccion">
          <CampoGps nombre="direccion" datos={d} set={set} requerido />
        </Campo>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <Campo etiqueta="Manzana / Lote" campo="manzana">
            <Texto valor={d.manzana} onCambiar={(v) => set("manzana", v)} placeholder="Ej: 92" />
          </Campo>
          <Campo etiqueta="Fecha" campo="fecha">
            <input
              type="date"
              className="campo"
              value={d.fecha ?? ""}
              onChange={(e) => set("fecha", e.target.value)}
            />
          </Campo>
        </div>
      </div>
    </Tarjeta>
  );
}
