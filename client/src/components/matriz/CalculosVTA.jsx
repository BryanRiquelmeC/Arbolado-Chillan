/* =============================================================
   Cálculos biomecánicos · Guía de campo VTA (Mattheck)
   Pensado para leerse de un vistazo:
   · Resumen arriba con los 3 resultados clave (color = riesgo).
   · 3 pasos con lenguaje simple: Estabilidad · Copa y viento · Tronco.
   · Lo técnico (q, Cd, brazo) va en "Ajustes" con valores por defecto.
   La clasificación se sugiere sola; el evaluador puede elegir otra.
   ============================================================= */
import { Calculator, Check, Ruler, TreeDeciduous, Wind } from "lucide-react";
import { Numero } from "../form/Controles.jsx";
import { irACampo } from "../../utils/irACampo.js";
import { CLASES_ESBELTEZ, CLASES_PARED, TESTIGOS_T, VIENTOS, calculosVTA } from "../../utils/vta.js";

const TONOS = {
  ok: { caja: "border-[#17663a] bg-[#dff3e6] text-[#17663a]", punto: "bg-[#17663a]" },
  medio: { caja: "border-[#8a6100] bg-[#fff4cc] text-[#8a6100]", punto: "bg-[#c99a00]" },
  peligro: { caja: "border-[#b42318] bg-[#fde8e6] text-[#b42318]", punto: "bg-[#b42318]" },
  nada: { caja: "border-[#cfe3f2] bg-white text-suave", punto: "bg-[#cfe3f2]" }
};

const fmt = (n, d = 2) =>
  n === null || n === undefined ? "—" : n.toLocaleString("es-CL", { maximumFractionDigits: d });
const tonoDe = (clases, valor) => clases.find((c) => c.valor === valor)?.tono || "nada";

/** Flexibilidad de la copa (Cd): la estima el evaluador mirando el árbol */
const FLEXIBILIDADES = [
  { valor: "0.3", texto: "0,3", nombre: "Flexible", señal: "Copa abierta" },
  { valor: "0.4", texto: "0,4", nombre: "Media", señal: "Densidad normal" },
  { valor: "0.5", texto: "0,5", nombre: "Rígida", señal: "Copa densa" }
];

/* ---------- Piezas ---------- */

/** Un resultado del resumen superior */
function Indicador({ titulo, valor, detalle, tono, falta = [] }) {
  const Tag = falta.length ? "button" : "div";
  return (
    <Tag
      type={falta.length ? "button" : undefined}
      onClick={falta.length ? () => irACampo(falta[0].campo) : undefined}
      title={falta.length ? "Ir al dato que falta" : undefined}
      className={`flex min-w-0 flex-col gap-0.5 rounded-xl border-2 px-3.5 py-2.5 text-left ${TONOS[tono].caja} ${
        falta.length ? "cursor-pointer border-dashed hover:border-c2" : ""
      }`}
    >
      <span className="text-[11.5px] font-bold tracking-wide uppercase opacity-80">{titulo}</span>
      <b className="text-[17px] leading-tight">{valor}</b>
      {detalle && <span className="text-[12.5px] font-medium opacity-90">{detalle}</span>}
      {falta.length > 0 && (
        <span className="text-[12.5px] font-bold text-c2 underline">Falta: {falta.map((f) => f.texto).join(", ")} →</span>
      )}
    </Tag>
  );
}

/** Aviso con los datos que faltan; cada uno lleva a su campo */
function Faltan({ items }) {
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-xl border border-[#f2d28b] bg-[#fff8e6] px-3 py-2 text-[13px] text-[#7a5300]">
      <b>Para calcular falta:</b>
      {items.map((f, i) => (
        <span key={f.campo}>
          <button
            type="button"
            onClick={() => irACampo(f.campo)}
            className="cursor-pointer font-bold text-c2 underline"
          >
            {f.texto}
          </button>
          {i < items.length - 1 ? "," : ""}
        </span>
      ))}
    </p>
  );
}

function Paso({ numero, icono: Icono, titulo, pregunta, children }) {
  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-2xl border border-borde bg-white p-4 shadow-sm">
      <header className="flex items-start gap-3">
        <span className="flex size-9 flex-none items-center justify-center rounded-xl bg-c4 text-c2">
          <Icono size={20} />
        </span>
        <div className="min-w-0">
          <h4 className="text-[15.5px] font-bold text-c1">
            {numero}. {titulo}
          </h4>
          <p className="text-[13px] text-suave">{pregunta}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Dato({ etiqueta, ayuda, campo, children }) {
  return (
    <label data-campo={campo} className="flex min-w-0 scroll-mt-24 flex-col gap-1 rounded-lg">
      <span className="text-[13px] font-semibold text-[#2b4a63]">{etiqueta}</span>
      {children}
      {ayuda && <span className="text-[12px] text-suave">{ayuda}</span>}
    </label>
  );
}

/** Resultado grande con su fórmula pequeña al lado */
function Resultado({ etiqueta, valor, unidad, formula }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-c4 px-3.5 py-2.5">
      <span className="flex min-w-0 flex-col">
        <span className="text-[13px] font-semibold text-c1">{etiqueta}</span>
        {formula && <span className="font-mono text-[11.5px] text-c2">{formula}</span>}
      </span>
      <span className="flex-none text-right">
        <b className="text-[20px] text-[#0f3d5e]">{valor}</b>
        {unidad && valor !== "—" && <span className="ml-1 text-[13px] text-suave">{unidad}</span>}
      </span>
    </div>
  );
}

/** Regla de colores tipo "medidor": zonas con su nombre, cortes numéricos y burbuja con el valor */
const SUAVE = { ok: "bg-[#2e8b57]", medio: "bg-[#e0a800]", peligro: "bg-[#c62f22]" };
const TEXTO = { ok: "text-[#17663a]", medio: "text-[#8a6100]", peligro: "text-[#b42318]" };

function Regla({ valor, max, cortes }) {
  if (valor === null || valor === undefined) return null;
  const pos = Math.min(Math.max(valor / max, 0), 1) * 100;
  const zona = cortes.find((c) => valor < c.hasta) || cortes[cortes.length - 1];
  let acumulado = 0;
  const limites = cortes.slice(0, -1).map((c) => ((acumulado += c.ancho), { pos: acumulado, valor: c.hasta }));
  const posBurbuja = Math.min(Math.max(pos, 6), 94); // que no se salga por los bordes

  return (
    <div className="flex flex-col pt-8 pb-1">
      <div className="relative">
        {/* Burbuja con el valor calculado */}
        <div className="absolute -top-8 flex -translate-x-1/2 flex-col items-center" style={{ left: `${posBurbuja}%` }}>
          <span className="rounded-md bg-[#0f3d5e] px-2 py-0.5 text-[12px] font-bold whitespace-nowrap text-white shadow">
            {fmt(valor, max > 1 ? 1 : 2)}
          </span>
          <span className="size-0 border-x-[5px] border-t-[5px] border-x-transparent border-t-[#0f3d5e]" />
        </div>

        {/* Barra por zonas, con separación entre ellas */}
        <div className="flex h-3 gap-[3px]">
          {cortes.map((c, i) => (
            <span
              key={c.hasta}
              className={`${SUAVE[c.tono]} ${i === 0 ? "rounded-l-full" : ""} ${i === cortes.length - 1 ? "rounded-r-full" : ""} ${
                c === zona ? "" : "opacity-35"
              } transition-opacity`}
              style={{ width: `${c.ancho}%` }}
            />
          ))}
        </div>

        {/* Punto sobre la barra en el valor exacto */}
        <span
          className="absolute top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#0f3d5e] shadow-md"
          style={{ left: `${pos}%` }}
        />
      </div>

      {/* Números de corte */}
      <div className="relative mt-1 h-4 text-[11px] font-semibold text-suave">
        {limites.map((l) => (
          <span key={l.valor} className="absolute -translate-x-1/2" style={{ left: `${l.pos}%` }}>
            {fmt(l.valor)}
          </span>
        ))}
      </div>

      {/* Nombre de cada zona */}
      <div className="flex gap-[3px] text-[11.5px] font-semibold">
        {cortes.map((c) => (
          <span
            key={c.hasta}
            className={`truncate text-center ${c === zona ? TEXTO[c.tono] : "text-[#9aaebf]"}`}
            style={{ width: `${c.ancho}%` }}
          >
            {c.etiqueta}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Clasificación: marca la sugerida; tocar otra la elige; tocar la elegida vuelve a la sugerida */
function Clasificacion({ clases, sugerida, elegida, onElegir }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-semibold text-suave">
        Clasificación {elegida ? "(elegida por el evaluador)" : sugerida ? "(sugerida según el cálculo)" : ""}
      </span>
      {clases.map((c) => {
        const activa = (elegida || sugerida) === c.valor;
        return (
          <button
            key={c.valor}
            type="button"
            aria-pressed={activa}
            onClick={() => onElegir(elegida === c.valor ? "" : c.valor)}
            className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border-[1.5px] px-3 py-2 text-left text-[13.5px] font-semibold transition ${
              activa ? TONOS[c.tono].caja : "border-[#cfe3f2] bg-white text-[#2b4a63] hover:border-c3"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`size-2.5 flex-none rounded-full ${TONOS[c.tono].punto}`} />
              {c.texto}
            </span>
            {activa && <Check size={16} strokeWidth={3} className="flex-none" />}
          </button>
        );
      })}
      {elegida && sugerida && elegida !== sugerida && (
        <p className="rounded-lg bg-[#fff8e6] px-3 py-2 text-[12.5px] text-[#7a5300]">
          El cálculo indica <b>{sugerida}</b>, pero se eligió <b>{elegida}</b> por criterio propio.
        </p>
      )}
    </div>
  );
}

/* ---------- Componente ---------- */

export default function CalculosVTA({ d, set }) {
  const c = calculosVTA(d);
  const campo = (k, unidad, extra = {}) => (
    <Numero unidad={unidad} valor={d[k]} onCambiar={(v) => set(k, v)} {...extra} />
  );
  // Lo que falta para calcular el viento (se muestra en vez de un resultado vacío)
  const primeraCopa = ["vta_copa_n", "vta_copa_o", "vta_copa_e", "vta_copa_s"].find((k) => !String(d[k] ?? "").trim());
  const faltaViento = [
    !c.anchoCopa && { texto: "las medidas de copa", campo: primeraCopa || "vta_copa_n" },
    !c.altoCopa && { texto: "el alto de la copa", campo: "vta_alto_copa" },
    !c.q && { texto: "el tipo de viento", campo: "vta_q" },
    !c.cd && { texto: "la flexibilidad (Cd)", campo: "vta_cd" },
    !c.brazo && { texto: "el brazo (h)", campo: "vta_brazo" }
  ].filter(Boolean);
  const faltaEsbeltez = [!c.H && { texto: "la altura", campo: "p5" }, !c.dapCm && { texto: "el DAP", campo: "p7" }].filter(Boolean);
  const faltaTronco = [!c.t && { texto: "la madera sana (t) de al menos un testigo", campo: "vta_t_n" }, !c.R && { texto: "el DAP o el radio", campo: "p7" }].filter(Boolean);

  return (
    <div className="col-span-full flex flex-col gap-4 rounded-2xl border border-[#cfe3f2] bg-c5 p-4 sm:p-5">
      {/* Encabezado */}
      <div className="flex flex-col gap-1">
        <h3 className="flex items-center gap-2 text-[16.5px] font-bold text-[#0f3d5e]">
          <Calculator size={20} className="text-c2" /> Cálculos biomecánicos
        </h3>
        <p className="text-[13.5px] text-[#2b4a63]">
          Se calculan solos con la <b>altura</b> y el <b>DAP</b> de arriba y los datos que agregue aquí. Todo es
          opcional.
        </p>
      </div>

      {/* Resumen de un vistazo */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Indicador
          titulo="Estabilidad (H/D)"
          valor={c.esbClase || "Faltan datos"}
          detalle={c.esbeltez !== null ? `Esbeltez ${fmt(c.esbeltez, 1)}` : ""}
          falta={c.esbeltez === null ? faltaEsbeltez : []}
          tono={tonoDe(CLASES_ESBELTEZ, c.esbClase)}
        />
        <Indicador
          titulo="Carga de viento"
          valor={c.momento !== null ? `${fmt(c.momento, 0)} kg·m` : "Faltan datos"}
          detalle={c.fuerza !== null ? `Empuje ${fmt(c.fuerza, 0)} kg` : ""}
          falta={c.momento === null ? faltaViento : []}
          tono="nada"
        />
        <Indicador
          titulo="Tronco (t/R)"
          valor={c.paredClase || "Faltan datos"}
          detalle={c.pared !== null ? `Pared residual ${fmt(c.pared)}` : ""}
          falta={c.pared === null ? faltaTronco : []}
          tono={tonoDe(CLASES_PARED, c.paredClase)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* 1. Estabilidad */}
        <Paso numero="1" icono={TreeDeciduous} titulo="Estabilidad" pregunta="¿El árbol es demasiado alto para su grosor?">
          <p className="text-[13px] text-[#2b4a63]">
            Altura <b>{c.H ? `${fmt(c.H)} m` : "—"}</b> ÷ diámetro{" "}
            <b>{c.dapCm ? `${fmt(c.dapCm / 100)} m` : "—"}</b>
          </p>
          <Resultado etiqueta="Esbeltez" formula="H / D" valor={fmt(c.esbeltez, 1)} />
          {faltaEsbeltez.length > 0 && <Faltan items={faltaEsbeltez} />}
          <Regla
            valor={c.esbeltez}
            max={100}
            cortes={[
              { hasta: 50, ancho: 50, tono: "ok", etiqueta: "Muy estable" },
              { hasta: 80, ancho: 30, tono: "medio", etiqueta: "Normal" },
              { hasta: Infinity, ancho: 20, tono: "peligro", etiqueta: "Alto riesgo" }
            ]}
          />
          <Clasificacion
            clases={CLASES_ESBELTEZ}
            sugerida={c.esbSugerida}
            elegida={d.vta_esb_clase}
            onElegir={(v) => set("vta_esb_clase", v)}
          />
        </Paso>

        {/* 2. Tronco (al lado de Estabilidad: son las dos clasificaciones) */}
        <Paso numero="2" icono={Ruler} titulo="Tronco hueco" pregunta="¿Queda suficiente madera sana en el tronco?">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-[#2b4a63]">Madera sana (t) · 4 testigos</span>
            <div className="grid grid-cols-2 gap-2">
              {TESTIGOS_T.map((x) => (
                <Dato key={x.campo} etiqueta={x.nombre} campo={x.campo}>
                  {campo(x.campo, "cm")}
                </Dato>
              ))}
            </div>
            <span className="text-[12px] text-suave">
              Espesor de la pared sana en cada testigo. Se usa el <b>menor</b>, porque la zona más delgada es la que puede
              colapsar.
            </span>
          </div>
          {c.testigos.length > 0 && (
            <p
              className={`rounded-xl border px-3 py-2 text-[13px] ${
                c.testigos.length < 4
                  ? "border-[#f2d28b] bg-[#fff8e6] text-[#7a5300]"
                  : "border-[#cfe3f2] bg-c5 text-[#2b4a63]"
              }`}
            >
              {c.testigos.length < 4 && <b>{c.testigos.length} de 4 testigos. </b>}
              Menor: <b>{fmt(c.t, 1)} cm</b> ({c.testigoMenor})
              {c.testigos.length > 1 && <> · Promedio: {fmt(c.tPromedio, 1)} cm</>}
              {c.testigos.length < 4 && " · Para un resultado más objetivo, mida los 4."}
            </p>
          )}
          <Dato etiqueta="Radio (R)" ayuda={c.dapCm ? `Si lo deja vacío: DAP/2 = ${fmt(c.dapCm / 2, 1)}` : "Mitad del diámetro"}>
            {campo("vta_r", "cm", { placeholder: c.dapCm ? String(c.dapCm / 2) : "" })}
          </Dato>
          <Resultado etiqueta="Pared residual" formula="t menor / R" valor={fmt(c.pared)} />
          {faltaTronco.length > 0 && <Faltan items={faltaTronco} />}
          <Regla
            valor={c.pared}
            max={1}
            cortes={[
              { hasta: 0.33, ancho: 33, tono: "peligro", etiqueta: "Alerta de colapso" },
              { hasta: Infinity, ancho: 67, tono: "ok", etiqueta: "Seguro" }
            ]}
          />
          <Clasificacion
            clases={CLASES_PARED}
            sugerida={c.paredSugerida}
            elegida={d.vta_pared_clase}
            onElegir={(v) => set("vta_pared_clase", v)}
          />
        </Paso>

        {/* 3. Copa y viento (ancho completo) */}
        <div className="lg:col-span-2">
          <Paso numero="3" icono={Wind} titulo="Copa y viento" pregunta="¿Cuánta fuerza hace el viento sobre la copa?">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Rosa de los vientos: igual que se mide en terreno */}
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold text-[#2b4a63]">
                  Radio de copa desde el tronco (m)
                </span>
                <div className="grid grid-cols-3 items-center gap-2">
                  <span />
                  <Dato etiqueta="Norte" campo="vta_copa_n">{campo("vta_copa_n", "m")}</Dato>
                  <span />
                  <Dato etiqueta="Poniente" campo="vta_copa_o">{campo("vta_copa_o", "m")}</Dato>
                  <span className="flex justify-center text-c2">
                    <TreeDeciduous size={30} />
                  </span>
                  <Dato etiqueta="Oriente" campo="vta_copa_e">{campo("vta_copa_e", "m")}</Dato>
                  <span />
                  <Dato etiqueta="Sur" campo="vta_copa_s">{campo("vta_copa_s", "m")}</Dato>
                  <span />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Dato etiqueta="Alto de la copa" ayuda="Desde la primera rama hasta la punta" campo="vta_alto_copa">
                  {campo("vta_alto_copa", "m")}
                </Dato>
                <Resultado etiqueta="Ancho promedio de copa" formula="((N+S)+(Or+P)) / 2" valor={fmt(c.anchoCopa)} unidad="m" />
                <Resultado etiqueta="Área de copa" formula="alto × ancho × 0,8" valor={fmt(c.area)} unidad="m²" />
                <Resultado etiqueta="Empuje del viento" formula="F = q × A × Cd" valor={fmt(c.fuerza, 0)} unidad="kg" />
                <Resultado etiqueta="Palanca en la base" formula="M = F × h" valor={fmt(c.momento, 0)} unidad="kg·m" />
              </div>
            </div>

            {/* Datos del viento: se eligen para cada árbol */}
            <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#cfe3f2] bg-c5 p-3 md:grid-cols-3">
              <div data-campo="vta_q" className="flex scroll-mt-24 flex-col gap-1.5 rounded-lg md:col-span-3">
                <span className="text-[13px] font-semibold text-[#2b4a63]">¿Con qué viento quiere evaluar el árbol?</span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {VIENTOS.map((v, i) => {
                    const activo = d.vta_q === v.valor;
                    return (
                      <button
                        key={v.valor}
                        type="button"
                        aria-pressed={activo}
                        onClick={() => set("vta_q", activo ? "" : v.valor)}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3 py-2 text-left transition ${
                          activo ? "border-c2 bg-c4 shadow-[0_0_0_3px_rgba(30,136,201,.12)]" : "border-[#cfe3f2] bg-white hover:border-c3"
                        }`}
                      >
                        {/* Velocidad destacada (igual que el valor de Cd) */}
                        <b className="flex h-8 w-11 flex-none flex-col items-center justify-center rounded-lg bg-c5 leading-none text-c2">
                          <span className="text-[13px]">{v.kmh}</span>
                          <span className="text-[9px] font-semibold">km/h</span>
                        </b>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <b className="text-[14px] leading-tight text-c1">{v.nombre}</b>
                          <span className="text-[11.5px] leading-snug text-suave">{v.señal}</span>
                        </span>
                        {activo && <Check size={16} strokeWidth={3} className="flex-none text-c2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div data-campo="vta_cd" className="flex scroll-mt-24 flex-col gap-1.5 rounded-lg md:col-span-3">
                <span className="text-[13px] font-semibold text-[#2b4a63]">¿Qué tan flexible es la copa? (Cd)</span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {FLEXIBILIDADES.map((f) => {
                    const activo = d.vta_cd === f.valor;
                    return (
                      <button
                        key={f.valor}
                        type="button"
                        aria-pressed={activo}
                        onClick={() => set("vta_cd", activo ? "" : f.valor)}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3 py-2 text-left transition ${
                          activo ? "border-c2 bg-c4 shadow-[0_0_0_3px_rgba(30,136,201,.12)]" : "border-[#cfe3f2] bg-white hover:border-c3"
                        }`}
                      >
                        <b className="flex size-8 flex-none items-center justify-center rounded-lg bg-c5 text-[13px] text-c2">
                          {f.texto}
                        </b>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <b className="text-[14px] leading-tight text-c1">{f.nombre}</b>
                          <span className="text-[11.5px] leading-snug text-suave">{f.señal}</span>
                        </span>
                        {activo && <Check size={16} strokeWidth={3} className="flex-none text-c2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Dato
                etiqueta="Brazo (h)"
                ayuda={
                  c.brazoSugerido !== null
                    ? `Del cuello a la mitad de la copa. Calculado: ${fmt(c.brazoSugerido)} m (altura − alto de copa/2)`
                    : "Del cuello a la mitad de la copa"
                }
               campo="vta_brazo">
                {campo("vta_brazo", "m", { placeholder: c.brazoSugerido !== null ? String(c.brazoSugerido) : "" })}
              </Dato>
            </div>

            {faltaViento.length > 0 ? (
              <Faltan items={faltaViento} />
            ) : (
              <p className="text-[12.5px] text-[#2b4a63]">
                El empuje equivale a ese peso empujando la copa de lado; la palanca es lo que soporta la base del tronco.
              </p>
            )}
          </Paso>
        </div>
      </div>
    </div>
  );
}
