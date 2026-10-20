/* =============================================================
   Croquis · Datos del árbol (campos definidos en config/croquis.js)
   Agrupados en bloques simples: Testigo · Tronco y copa ·
   Proyección de copa (en cruz, como se mide) · Inclinación · Otras
   ============================================================= */
import { TreeDeciduous } from "lucide-react";
import Tarjeta from "../ui/Tarjeta.jsx";
import Campo from "../form/Campo.jsx";
import { Lista, Numero } from "../form/Controles.jsx";
import { DATOS_ARBOL } from "../../config/croquis.js";

const GRUPOS = ["Testigo", "Tronco y copa", "Proyección de copa", "Inclinación", "Otras medidas"];
const de = (grupo) => DATOS_ARBOL.filter((c) => c.grupo === grupo);
const porId = (id) => DATOS_ARBOL.find((c) => c.id === id);

const PUNTO = { ok: "bg-[#17663a]", medio: "bg-[#c99a00]", peligro: "bg-[#b42318]" };

/** Un campo numérico o de lista */
function Dato({ c, d, set, etiqueta }) {
  return (
    <Campo etiqueta={etiqueta || c.label} campo={c.id}>
      {c.opciones ? (
        <Lista opciones={c.opciones} valor={d[c.id]} onCambiar={(v) => set(c.id, v)} />
      ) : (
        <Numero unidad={c.unidad} valor={d[c.id]} onCambiar={(v) => set(c.id, v)} placeholder={c.ej} />
      )}
    </Campo>
  );
}

/** Estado del testigo: lista desplegable; debajo, la descripción de lo elegido */
function EstadoTestigo({ c, d, set }) {
  const elegido = c.estados.find((e) => e.valor === d[c.id]);
  return (
    <Campo etiqueta={c.label} campo={c.id}>
      <Lista vacio="— Seleccione —" opciones={c.estados.map((e) => e.valor)} valor={d[c.id]} onCambiar={(v) => set(c.id, v)} />
      {elegido && (
        <span className="flex items-center gap-2 text-[12.5px] text-suave">
          <span className={`size-2.5 flex-none rounded-full ${PUNTO[elegido.tono]}`} />
          {elegido.ayuda}
        </span>
      )}
    </Campo>
  );
}

/** Proyección de copa en cruz: Norte arriba, Sur abajo, Poniente a la izquierda, Oriente a la derecha */
function CruzCopa({ d, set }) {
  const campo = (id) => {
    const c = porId(id);
    return <Dato c={c} d={d} set={set} etiqueta={c.corto} />;
  };
  return (
    <div className="col-span-full mx-auto grid w-full max-w-140 grid-cols-3 items-center gap-x-3 gap-y-2">
      <span />
      {campo("copa_n")}
      <span />
      {campo("copa_o")}
      <span className="flex justify-center text-c2">
        <TreeDeciduous size={34} />
      </span>
      {campo("copa_e")}
      <span />
      {campo("copa_s")}
      <span />
    </div>
  );
}

export default function SeccionDatosArbol({ d, set }) {
  return (
    <Tarjeta icono={TreeDeciduous} titulo="Datos del árbol">
      <div className="flex flex-col gap-6">
        {GRUPOS.map((g) => (
          <section key={g} className="flex flex-col gap-3">
            <h4 className="border-b border-borde pb-1.5 text-[13px] font-bold tracking-wide text-c2 uppercase">{g}</h4>
            <div className="grilla">
              {g === "Proyección de copa" ? (
                <CruzCopa d={d} set={set} />
              ) : (
                de(g).map((c) =>
                  c.estados ? <EstadoTestigo key={c.id} c={c} d={d} set={set} /> : <Dato key={c.id} c={c} d={d} set={set} />
                )
              )}
            </div>
          </section>
        ))}
      </div>
    </Tarjeta>
  );
}
