/* =============================================================
   Matriz VTA: respuestas legibles y cálculos biomecánicos
   (Guía de campo VTA – Método de Claus Mattheck)
   ============================================================= */

/* ---------- Respuestas ---------- */

/** Claves donde se guarda cada foto de una pregunta: p41, p41_2, p41_3… (sin límite; cada una es un texto) */
const claveFoto = (p, i) => (i === 0 ? p.id : `${p.id}_${i + 1}`);
const extrasFoto = (r, p) =>
  Object.keys(r)
    .map((k) => +(k.match(new RegExp(`^${p.id}_(\\d+)$`)) || [])[1])
    .filter((n) => n >= 2)
    .sort((a, b) => a - b);

/** Todas las fotos de una pregunta, en orden */
export const fotosDe = (r, p) => [r[p.id], ...extrasFoto(r, p).map((n) => r[`${p.id}_${n}`])].filter(Boolean);

/** Guarda la lista de fotos y limpia las claves que sobran (al quitar una foto) */
export function guardarFotos(r, p, lista, set) {
  lista.forEach((img, i) => set(claveFoto(p, i), img));
  const usadas = Math.max(lista.length, 1);
  if (!lista.length) set(p.id, "");
  extrasFoto(r, p).filter((n) => n > usadas).forEach((n) => set(`${p.id}_${n}`, ""));
}

/** ¿Está marcada la casilla "Otros"? (registros antiguos guardaban "Otros" como respuesta) */
export const otrosMarcado = (r, id) => Boolean(r[id + "_otros"]) || r[id] === "Otros";

/** Texto de una respuesta: opción + sub-opción + "Otros: …" (para detalle, PDF y censo) */
export function respuestaVTA(r, p) {
  const v = r[p.id];
  const partes = [];
  if (v && v !== "Otros") {
    let t = String(v);
    if (p.sub) {
      // Pregunta con sub-opciones (Interferencia eléctrica): "Sí (Domiciliaria, Alumbrado público)" o "No"
      t = t.split(":")[0].trim();
      if (t === p.sub.si && r[p.sub.campo]) t += ` (${r[p.sub.campo]})`;
    }
    partes.push(t);
  }
  if (p.otros && otrosMarcado(r, p.id)) partes.push(r[p.id + "_otro"] ? `Otros: ${r[p.id + "_otro"]}` : "Otros");
  return partes.join("  ·  ");
}

/* ---------- Cálculos biomecánicos ---------- */

/** Presión del viento q (kg/m²) */
export const VIENTOS = [
  { valor: "12", texto: "Viento fuerte (50 km/h) · 12 kg/m²" },
  { valor: "23", texto: "Temporal (70 km/h) · 23 kg/m²" },
  { valor: "38", texto: "Temporal fuerte (90 km/h) · 38 kg/m²" }
];

/** Clasificaciones que el evaluador puede confirmar o cambiar */
export const CLASES_ESBELTEZ = [
  { valor: "Muy estable", texto: "Muy estable (H/D < 50)", tono: "ok" },
  { valor: "Normal", texto: "Normal (H/D 50–80)", tono: "medio" },
  { valor: "Alto riesgo", texto: "Alto riesgo de caída o rotura (H/D > 80)", tono: "peligro" }
];
export const CLASES_PARED = [
  { valor: "Seguro", texto: "Seguro (t/R ≥ 0,33)", tono: "ok" },
  { valor: "Alerta de colapso", texto: "Alerta de colapso por cavidad (t/R < 0,33)", tono: "peligro" }
];

const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
};
const redondear = (n, d = 2) => (n === null ? null : Math.round(n * 10 ** d) / 10 ** d);

/**
 * Todos los cálculos a partir de lo ingresado.
 * Usa la Altura (p5, m) y el DAP (p7, cm) ya respondidos en la Matriz.
 */
export function calculosVTA(d) {
  const H = num(d.p5); // m
  const dapCm = num(d.p7);
  const D = dapCm ? dapCm / 100 : null; // m

  // 1) Esbeltez H/D
  const esbeltez = H && D ? H / D : null;
  const esbSugerida =
    esbeltez === null ? "" : esbeltez < 50 ? "Muy estable" : esbeltez <= 80 ? "Normal" : "Alto riesgo";

  // 3) Ancho promedio de copa = ((N + S) + (E + O)) / 2
  const [n, s, e, o] = ["vta_copa_n", "vta_copa_s", "vta_copa_e", "vta_copa_o"].map((k) => num(d[k]));
  const anchoCopa = n && s && e && o ? (n + s + (e + o)) / 2 : null;

  // 2) Fuerza del viento F = q × A × Cd, con A = alto de copa × ancho × 0,8
  const altoCopa = num(d.vta_alto_copa);
  const area = altoCopa && anchoCopa ? altoCopa * anchoCopa * 0.8 : null;
  const q = num(d.vta_q);
  const cd = num(d.vta_cd);
  const fuerza = q && area && cd ? q * area * cd : null; // kg (kilogramo-fuerza)

  // Momento M = F × h (brazo: del cuello a la mitad de la copa)
  const brazoSugerido = H && altoCopa ? Math.max(H - altoCopa / 2, 0) : null;
  const brazo = num(d.vta_brazo) ?? brazoSugerido;
  const momento = fuerza && brazo ? fuerza * brazo : null; // kg·m

  // 4) Pared residual t / R (R por defecto = DAP / 2)
  const t = num(d.vta_t);
  const R = num(d.vta_r) ?? (dapCm ? dapCm / 2 : null);
  const pared = t && R ? t / R : null;
  const paredSugerida = pared === null ? "" : pared >= 0.33 ? "Seguro" : "Alerta de colapso";

  return {
    H, dapCm,
    esbeltez: redondear(esbeltez, 1),
    esbSugerida,
    esbClase: d.vta_esb_clase || esbSugerida,
    anchoCopa: redondear(anchoCopa),
    altoCopa,
    area: redondear(area),
    q, cd,
    fuerza: redondear(fuerza, 1),
    brazo: redondear(brazo),
    brazoSugerido: redondear(brazoSugerido),
    momento: redondear(momento, 1),
    t, R: redondear(R, 1),
    pared: redondear(pared),
    paredSugerida,
    paredClase: d.vta_pared_clase || paredSugerida
  };
}

const fmt = (n, u = "") => (n === null || n === undefined ? "—" : `${String(n).replace(".", ",")}${u}`);

/** Texto completo de una clasificación, sin símbolos que el PDF no puede dibujar (≥) */
const textoClase = (clases, valor) =>
  (clases.find((c) => c.valor === valor)?.texto || valor || "").replace("≥", ">=").replace("–", "-");

/** Filas [etiqueta, valor] para el detalle y el PDF (solo lo que tenga datos) */
export function filasCalculos(r) {
  const c = calculosVTA(r);
  const filas = [
    ["Esbeltez (H/D)", c.esbeltez !== null ? fmt(c.esbeltez) : ""],
    ["Clasificación de esbeltez", textoClase(CLASES_ESBELTEZ, c.esbClase)],
    ["Ancho promedio de copa", c.anchoCopa !== null ? fmt(c.anchoCopa, " m") : ""],
    ["Área de copa (A = alto x ancho x 0,8)", c.area !== null ? fmt(c.area, " m2") : ""],
    ["Fuerza del viento (F = q x A x Cd)", c.fuerza !== null ? `${fmt(c.fuerza, " kg")}  (q ${fmt(c.q)} kg/m2, Cd ${fmt(c.cd)})` : ""],
    ["Momento de flexión (M = F x h)", c.momento !== null ? `${fmt(c.momento, " kg·m")}  (h ${fmt(c.brazo, " m")})` : ""],
    ["Pared residual (t/R)", c.pared !== null ? `${fmt(c.pared)}  (t ${fmt(c.t, " cm")} / R ${fmt(c.R, " cm")})` : ""],
    ["Clasificación pared residual", textoClase(CLASES_PARED, c.paredClase)]
  ];
  return filas.filter(([, v]) => v);
}
