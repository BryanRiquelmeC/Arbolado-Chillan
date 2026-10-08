/* Croquis · Red eléctrica (postes izq./der.) y tránsito */
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import Tarjeta from "../ui/Tarjeta.jsx";
import Campo from "../form/Campo.jsx";
import { Chips, Numero } from "../form/Controles.jsx";
import { FLUJOS } from "../../config/croquis.js";

const LADOS = [
  { valor: "Platabanda izq.", texto: "Platabanda izquierda", icono: <ArrowLeft size={16} /> },
  {
    valor: "Platabanda der.",
    texto: (
      <>
        Platabanda derecha <ArrowRight size={16} />
      </>
    )
  }
];

export default function SeccionRedElectrica({ d, set, calculo }) {
  return (
    <Tarjeta icono={Zap} titulo="Red eléctrica y tránsito">
      <div className="grilla">
        <Campo etiqueta="Cables eléctricos aéreos">
          <Chips valor={d.cables} onCambiar={(v) => set("cables", v)} opciones={["Sí", "No"]} />
        </Campo>

        {calculo.cables && (
          <Campo etiqueta="Postes / red ubicados en (puede marcar ambos)" className="sm:col-span-2">
            <Chips multiple valor={d.postes} onCambiar={(v) => set("postes", v)} opciones={LADOS} />
          </Campo>
        )}
        {calculo.posteIzq && (
          <Campo etiqueta="Altura mín. cables – lado izq.">
            <Numero
              unidad="m"
              valor={d.altura_cables_izq}
              onCambiar={(v) => set("altura_cables_izq", v)}
              placeholder="4.10"
            />
          </Campo>
        )}
        {calculo.posteDer && (
          <Campo etiqueta="Altura mín. cables – lado der.">
            <Numero
              unidad="m"
              valor={d.altura_cables_der}
              onCambiar={(v) => set("altura_cables_der", v)}
              placeholder="4.10"
            />
          </Campo>
        )}

        <Campo etiqueta="Sentido del tránsito">
          <Chips
            valor={d.sentido}
            onCambiar={(v) => set("sentido", v)}
            opciones={["Unidireccional", "Bidireccional"]}
          />
        </Campo>
        <Campo etiqueta="Dirección del flujo" className="sm:col-span-2">
          <Chips valor={d.flujo} onCambiar={(v) => set("flujo", v)} opciones={FLUJOS} />
        </Campo>
      </div>
    </Tarjeta>
  );
}
