/* Una sección de la Matriz VTA con todas sus preguntas */
import Tarjeta from "../ui/Tarjeta.jsx";
import PreguntaVTA from "./PreguntaVTA.jsx";
import { ICONOS_SECCION } from "../../config/iconos.js";

export default function SeccionVTA({ seccion, indice, d, set }) {
  return (
    <Tarjeta id={`seccion-${indice}`} icono={ICONOS_SECCION[seccion.icono]} titulo={seccion.titulo}>
      <div className="grilla">
        {seccion.preguntas.map((p) => (
          <PreguntaVTA key={p.id} p={p} d={d} set={set} />
        ))}
      </div>
    </Tarjeta>
  );
}
