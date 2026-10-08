/* Croquis · Identificación: dirección (GPS), manzana, fecha y km */
import { MapPin } from "lucide-react";
import Tarjeta from "../ui/Tarjeta.jsx";
import Campo from "../form/Campo.jsx";
import CampoGps from "../form/CampoGps.jsx";
import { Texto } from "../form/Controles.jsx";

export default function SeccionIdentificacion({ d, set }) {
  return (
    <Tarjeta icono={MapPin} titulo="Identificación">
      <div className="grilla">
        <Campo etiqueta="Dirección" requerido className="sm:col-span-2 lg:col-span-3">
          <CampoGps nombre="direccion" datos={d} set={set} requerido />
        </Campo>
        <Campo etiqueta="Manzana / Lote">
          <Texto valor={d.manzana} onCambiar={(v) => set("manzana", v)} placeholder="Ej: 92" />
        </Campo>
        <Campo etiqueta="Fecha">
          <input
            type="date"
            className="campo"
            value={d.fecha ?? ""}
            onChange={(e) => set("fecha", e.target.value)}
          />
        </Campo>
        <Campo etiqueta="Km inicial">
          <Texto
            valor={d.km_inicial}
            onCambiar={(v) => set("km_inicial", v)}
            placeholder="Ej: 7887"
          />
        </Campo>
      </div>
    </Tarjeta>
  );
}