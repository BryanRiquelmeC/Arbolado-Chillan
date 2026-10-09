/* Una franja del perfil (vereda, platabanda o calzada): ancho + material */
import { Chips, Lista, Numero, Texto } from "../form/Controles.jsx";
import { MATERIALES, URGENCIAS_EXTRAER, USOS_FRANJA } from "../../config/croquis.js";
import { PREGUNTAS } from "../../config/encuesta.js";

/** Mismas especies que la Matriz VTA (pregunta "Especies") */
const ESPECIES = [
  ...(PREGUNTAS.find((p) => p.id === "p3")?.opts || []).filter((e) => e !== "Otros"),
  "Otra"
];

export default function ColumnaPerfil({ columna, d, set }) {
  const esCalzada = columna.id === "calzada";
  const fondo = esCalzada
    ? "bg-c5 sm:col-span-2 xl:col-span-1"
    : columna.material
      ? "bg-[#f1f9f3]"
      : "bg-white";

  return (
    <div
      className={`flex min-w-0 flex-col gap-2 border-b-[1.5px] border-dashed border-[#cfe3f2] p-4 last:border-b-0 xl:border-r-[1.5px] xl:border-b-0 xl:last:border-r-0 ${fondo}`}
    >
      <div className="text-center text-sm font-bold text-c1">
        {columna.titulo}
        {columna.sub && (
          <small className="block text-[11.5px] font-medium text-suave">{columna.sub}</small>
        )}
      </div>
      <Numero
        unidad="m"
        valor={d[columna.id]}
        onCambiar={(v) => set(columna.id, v)}
        placeholder="0.00"
      />
      {columna.material && (
        <Lista
          vacio="Material…"
          opciones={MATERIALES}
          valor={d[columna.material]}
          onCambiar={(v) => set(columna.material, v)}
        />
      )}
      {columna.uso && (
        <div className="mt-1 border-t border-dashed border-[#cfe3f2] pt-2">
          <span className="mb-1.5 block text-center text-[11.5px] font-bold tracking-wide text-suave uppercase">
            Proyectar
          </span>
          <div className="flex justify-center">
            <Chips
              multiple
              opciones={USOS_FRANJA}
              valor={d[columna.uso]}
              onCambiar={(v) => {
                set(columna.uso, v);
                if (!v?.includes("Plantar árbol")) {
                  set(columna.especie, "");
                  set(columna.especie + "_otra", "");
                }
                if (!v?.includes("Extraer árbol")) set(columna.urgencia, "");
              }}
            />
          </div>
          {d[columna.uso]?.includes("Plantar árbol") && (
            <div className="mt-2">
              <Lista
                vacio="Especie a plantar…"
                opciones={ESPECIES}
                valor={d[columna.especie]}
                onCambiar={(v) => {
                  set(columna.especie, v);
                  if (v !== "Otra") set(columna.especie + "_otra", "");
                }}
              />
              {d[columna.especie] === "Otra" && (
                <div className="mt-2">
                  <Texto
                    valor={d[columna.especie + "_otra"]}
                    onCambiar={(v) => set(columna.especie + "_otra", v)}
                    placeholder="Escriba la especie…"
                  />
                </div>
              )}
            </div>
          )}
          {d[columna.uso]?.includes("Extraer árbol") && (
            <div className="mt-2">
              <Lista
                vacio="Urgencia de extracción…"
                opciones={URGENCIAS_EXTRAER}
                valor={d[columna.urgencia]}
                onCambiar={(v) => set(columna.urgencia, v)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
