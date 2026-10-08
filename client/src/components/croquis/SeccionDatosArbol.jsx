/* Croquis · Datos del árbol (campos definidos en config/croquis.js) */
import { TreeDeciduous } from "lucide-react";
import Tarjeta from "../ui/Tarjeta.jsx";
import Campo from "../form/Campo.jsx";
import { Lista, Numero } from "../form/Controles.jsx";
import { DATOS_ARBOL } from "../../config/croquis.js";

export default function SeccionDatosArbol({ d, set }) {
  return (
    <Tarjeta icono={TreeDeciduous} titulo="Datos del árbol">
      <div className="grilla">
        {DATOS_ARBOL.map((c) => (
          <Campo key={c.id} etiqueta={c.label}>
            {c.opciones ? (
              <Lista opciones={c.opciones} valor={d[c.id]} onCambiar={(v) => set(c.id, v)} />
            ) : (
              <Numero
                unidad={c.unidad}
                valor={d[c.id]}
                onCambiar={(v) => set(c.id, v)}
                placeholder={c.ej}
              />
            )}
          </Campo>
        ))}
      </div>
    </Tarjeta>
  );
}
