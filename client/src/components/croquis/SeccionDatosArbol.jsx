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
const de = (grupo) => DATOS_ARBOL.filter((c) => c.grupo === grupo && !c.oculto && !c.cuatro);
const CUATRO = DATOS_ARBOL.filter((c) => c.cuatro);
const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return n > 0 ? n : null;
};
const f1 = (n) => n.toLocaleString("es-CL", { maximumFractionDigits: 1 });
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
    <div className="col-span-full mx-auto grid w-full max-w-[560px] grid-cols-3 items-center gap-x-3 gap-y-2">
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

/** Los 4 testigos (uno por orientación) + resumen: menor y promedio */
function CuatroTestigos({ d, set }) {
  const medidos = CUATRO.map((c) => ({ ...c, v: num(d[c.id]) })).filter((c) => c.v);
  const menor = medidos.length ? medidos.reduce((a, b) => (b.v < a.v ? b : a)) : null;
  const promedio = medidos.length ? medidos.reduce((a, b) => a + b.v, 0) / medidos.length : null;
  // Criterio Mattheck: pared sana / radio < 0,33 → riesgo de colapso (radio = DAP / 2)
  const radio = num(d.dap) ? num(d.dap) / 2 : null;
  const pared = menor && radio ? menor.v / radio : null;
  const riesgo = pared !== null && pared < 0.33;
  return (
    <div className="col-span-full flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-[#2b4a63]">Testigos · uno por orientación</span>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {CUATRO.map((c) => {
          const v = num(d[c.id]);
          const rojo = radio && v && v / radio < 0.33;
          return (
            <div key={c.id} className={rojo ? "rounded-lg ring-2 ring-[#b42318] ring-offset-2" : ""}>
              <Dato c={c} d={d} set={set} etiqueta={rojo ? `${c.corto} · riesgoso` : c.corto} />
            </div>
          );
        })}
      </div>
      {medidos.length > 0 && (
        <div
          className={`flex flex-col gap-1 rounded-xl border px-3 py-2 text-[13px] ${
            riesgo
              ? "border-[#b42318] bg-[#fdecea] text-[#7a1c14]"
              : pared !== null
                ? "border-[#17663a] bg-[#dff3e6] text-[#14532d]"
                : medidos.length < 4
                ? "border-[#f2d28b] bg-[#fff8e6] text-[#7a5300]"
                : "border-[#cfe3f2] bg-c5 text-[#2b4a63]"
          }`}
        >
          <span>
            {medidos.length < 4 && <b>{medidos.length} de 4 testigos. </b>}
            Menor: <b>{f1(menor.v)} cm</b> ({menor.corto})
            {medidos.length > 1 && <> · Promedio: {f1(promedio)} cm</>}
          </span>
          {pared !== null ? (
            <span>
              Pared residual (menor / radio {f1(radio)} cm): <b>{pared.toLocaleString("es-CL", { maximumFractionDigits: 2 })}</b>
              {" · "}
              <b>{riesgo ? "⚠ Riesgo de colapso por cavidad (menor a 0,33)" : "Pared suficiente (0,33 o más)"}</b>
            </span>
          ) : (
            <span>Ingrese el DAP para calcular si la pared es riesgosa.</span>
          )}
          {medidos.length < 4 && <span>Para una observación más objetiva, mida los 4.</span>}
        </div>
      )}
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
              {g === "Testigo" && <CuatroTestigos d={d} set={set} />}
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
