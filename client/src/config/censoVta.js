/* =============================================================
   Preguntas VTA que se llenan al agregar/editar un árbol del censo.
   Se toman de la Matriz VTA (mismas opciones y "Otros:") y se
   guardan en el registro con la misma clave (p5, p7, p9…).
   Para quitar o agregar una, edite esta lista.
   ============================================================= */
import { PREGUNTAS } from "./encuesta.js";

const SECCIONES = [
  ["Dimensiones del árbol", ["p5", "p7"]],
  ["Estado sanitario y biomecánico", ["p9", "p10", "p11", "p12", "p13", "p14"]],
  ["Entorno y emplazamiento", ["p17"]],
  ["Evaluación estructural", ["p25", "p26", "p31"]],
  ["Diagnóstico y recomendación", ["p38"]]
];

/** [{ titulo, preguntas:[…] }] numeradas desde el 5 (1–4 son manzana, dirección, especie…) */
let n = 4;
export const CENSO_VTA = SECCIONES.map(([titulo, ids]) => ({
  titulo,
  preguntas: ids
    .map((id) => PREGUNTAS.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => ({ ...p, n: String(++n), req: false }))
}));

/** Respuesta legible: "Otros: …" y unidades */
function valor(r, p) {
  let v = r[p.id];
  if (v === undefined || v === null || v === "") return "";
  if (v === "Otros" && r[p.id + "_otro"]) v = "Otros: " + r[p.id + "_otro"];
  if (p.unit) v = `${v} ${p.unit}`;
  return String(v);
}

/** Solo lo respondido, por sección: [[titulo, [[etiqueta, valor]]]] (para Ver y PDF) */
export function respuestasCensoVta(r) {
  return CENSO_VTA.map((s) => [
    s.titulo,
    s.preguntas.map((p) => [p.label, valor(r, p)]).filter(([, v]) => v)
  ]).filter(([, filas]) => filas.length);
}
