/* =============================================================
   Cálculos biomecánicos de la Guía de campo VTA (Mattheck)
   1. Esbeltez H/D        3. Ancho promedio de copa
   2. Viento y momento    4. Pared residual t/R
   Los resultados se calculan solos; la clasificación se sugiere
   y el evaluador puede confirmarla o elegir otra con un clic.
   ============================================================= */
import { Calculator, Check } from "lucide-react";
import { Lista, Numero } from "../form/Controles.jsx";
import { CLASES_ESBELTEZ, CLASES_PARED, VIENTOS, calculosVTA } from "../../utils/vta.js";

const TONOS = {
  ok: "border-[#17663a] bg-[#dff3e6] text-[#17663a]",
  medio: "border-[#8a6100] bg-[#fff4cc] text-[#8a6100]",
  peligro: "border-[#b42318] bg-[#fde8e6] text-[#b42318]"
};

const fmt = (n, d = 2) =>
  n === null || n === undefined ? "—" : n.toLocaleString("es-CL", { maximumFractionDigits: d });

function Bloque({ numero, titulo, formula, children }) {
  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-2xl border border-borde bg-white p-4 shadow-sm">
      <header className="flex items-start gap-3">
        <span className="flex size-7 flex-none items-center justify-center rounded-full bg-c2 text-[13px] font-bold text-white">
          {numero}
        </span>
        <div className="min-w-0">
          <h4 className="text-[15px] font-bold text-c1">{titulo}</h4>
          <p className="font-mono text-[13px] text-c2">{formula}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Dato({ etiqueta, children }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[12.5px] font-semibold text-suave">{etiqueta}</span>
      {children}
    </label>
  );
}

function Resultado({ etiqueta, valor, unidad }) {
  return (
    <div className="flex items-baseline justify-between gap-3 rounded-xl bg-c4 px-3.5 py-2.5">
      <span className="text-[13px] font-semibold text-c1">{etiqueta}</span>
      <span className="text-right">
        <b className="text-[20px] text-[#0f3d5e]">{valor}</b>
        {unidad && valor !== "—" && <span className="ml-1 text-[13px] text-suave">{unidad}</span>}
      </span>
    </div>
  );
}

/** Botones de clasificación: marca la sugerida y permite elegir otra (tocar de nuevo vuelve a la sugerida) */
function Clasificacion({ clases, sugerida, elegida, onElegir }) {
  return (
    <div className="flex flex-col gap-1.5">
      {clases.map((c) => {
        const activa = (elegida || sugerida) === c.valor;
        return (
          <button
            key={c.valor}
            type="button"
            aria-pressed={activa}
            onClick={() => onElegir(elegida === c.valor ? "" : c.valor)}
            className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border-[1.5px] px-3 py-2 text-left text-[13.5px] font-semibold transition ${
              activa ? TONOS[c.tono] : "border-[#cfe3f2] bg-white text-[#2b4a63] hover:border-c3"
            }`}
          >
            <span className="flex items-center gap-2">
              {activa && <Check size={16} strokeWidth={3} />}
              {c.texto}
            </span>
            {sugerida === c.valor && (
              <span className="flex-none rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold uppercase">
                Sugerido
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function CalculosVTA({ d, set }) {
  const c = calculosVTA(d);
  const campo = (k, unidad, extra = {}) => (
    <Numero unidad={unidad} valor={d[k]} onCambiar={(v) => set(k, v)} {...extra} />
  );

  return (
    <div className="col-span-full flex flex-col gap-3 rounded-2xl border border-[#cfe3f2] bg-c5 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <Calculator size={20} className="text-c2" />
        <h3 className="text-[16px] font-bold text-[#0f3d5e]">Cálculos biomecánicos</h3>
        <span className="text-[12.5px] text-suave">· Guía de campo VTA (Mattheck)</span>
      </div>
      <p className="text-[13.5px] text-[#2b4a63]">
        Se usan la <b>altura</b> y el <b>DAP</b> ingresados arriba. Complete solo los datos que tenga: cada resultado se
        calcula al momento.
      </p>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* 1. Esbeltez */}
        <Bloque numero="1" titulo="Estabilidad global · Esbeltez" formula="Esbeltez = H / D">
          <p className="text-[13px] text-suave">
            H = {c.H ? `${fmt(c.H)} m` : "falta altura"} · D = {c.dapCm ? `${fmt(c.dapCm / 100)} m (${fmt(c.dapCm)} cm)` : "falta DAP"}
          </p>
          <Resultado etiqueta="H / D" valor={fmt(c.esbeltez, 1)} />
          <Clasificacion
            clases={CLASES_ESBELTEZ}
            sugerida={c.esbSugerida}
            elegida={d.vta_esb_clase}
            onElegir={(v) => set("vta_esb_clase", v)}
          />
        </Bloque>

        {/* 3. Ancho de copa (va antes del viento porque se usa en el área) */}
        <Bloque numero="2" titulo="Ancho promedio de copa" formula="((Norte + Sur) + (Este + Oeste)) / 2">
          <p className="text-[13px] text-suave">Mida desde el tronco hasta el borde de la copa en los 4 puntos cardinales.</p>
          <div className="grid grid-cols-2 gap-2">
            <Dato etiqueta="Norte">{campo("vta_copa_n", "m")}</Dato>
            <Dato etiqueta="Sur">{campo("vta_copa_s", "m")}</Dato>
            <Dato etiqueta="Este">{campo("vta_copa_e", "m")}</Dato>
            <Dato etiqueta="Oeste">{campo("vta_copa_o", "m")}</Dato>
          </div>
          <Resultado etiqueta="Ancho promedio" valor={fmt(c.anchoCopa)} unidad="m" />
        </Bloque>

        {/* 2. Viento y momento */}
        <Bloque numero="3" titulo="Fuerza del viento y momento" formula="F = q × A × Cd   ·   M = F × h">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Dato etiqueta="q · Presión del viento">
              <Lista
                vacio="— Seleccione —"
                opciones={VIENTOS.map((v) => v.texto)}
                valor={VIENTOS.find((v) => v.valor === d.vta_q)?.texto || ""}
                onCambiar={(t) => set("vta_q", VIENTOS.find((v) => v.texto === t)?.valor || "")}
              />
            </Dato>
            <Dato etiqueta="Cd · Flexibilidad (0,3 a 0,5)">
              {campo("vta_cd", "", { max: 1, placeholder: "0,4" })}
            </Dato>
            <Dato etiqueta="Alto de copa">{campo("vta_alto_copa", "m")}</Dato>
            <Dato etiqueta={`h · Brazo${c.brazoSugerido !== null ? ` (sugerido ${fmt(c.brazoSugerido)} m)` : ""}`}>
              {campo("vta_brazo", "m", { placeholder: c.brazoSugerido !== null ? String(c.brazoSugerido) : "" })}
            </Dato>
          </div>
          <p className="text-[12.5px] text-suave">
            A = alto × ancho de copa × 0,8 (descuenta las esquinas vacías). h = del cuello a la mitad de la copa; si lo
            deja vacío se usa el sugerido.
          </p>
          <Resultado etiqueta="Área de copa (A)" valor={fmt(c.area)} unidad="m²" />
          <Resultado etiqueta="Fuerza del viento (F)" valor={fmt(c.fuerza, 1)} unidad="kg" />
          <Resultado etiqueta="Momento de flexión (M)" valor={fmt(c.momento, 1)} unidad="kg·m" />
          <p className="text-[12.5px] text-suave">
            Los km/h solo sirven para elegir q. F se expresa en <b>kg</b>: es como si ese peso empujara la copa de lado.
            M (kg·m) es ese empuje multiplicado por el brazo: la palanca que soporta la base del tronco.
          </p>
        </Bloque>

        {/* 4. Pared residual */}
        <Bloque numero="4" titulo="Seguridad interna · Pared residual" formula="Pared residual = t / R">
          <div className="grid grid-cols-2 gap-2">
            <Dato etiqueta="t · Espesor de madera sana">{campo("vta_t", "cm")}</Dato>
            <Dato etiqueta={`R · Radio${c.dapCm ? ` (DAP/2 = ${fmt(c.dapCm / 2, 1)})` : ""}`}>
              {campo("vta_r", "cm", { placeholder: c.dapCm ? String(c.dapCm / 2) : "" })}
            </Dato>
          </div>
          <Resultado etiqueta="t / R" valor={fmt(c.pared)} />
          <Clasificacion
            clases={CLASES_PARED}
            sugerida={c.paredSugerida}
            elegida={d.vta_pared_clase}
            onElegir={(v) => set("vta_pared_clase", v)}
          />
        </Bloque>
      </div>
    </div>
  );
}
