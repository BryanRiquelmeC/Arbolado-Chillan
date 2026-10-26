/* =============================================================
   Colores de riesgo (solo donde hay un criterio claro)
   ok = verde · medio = amarillo · peligro = rojo
   · Pared residual (t/R) · Esbeltez (H/D) · Urgencia de intervención
   · Estado del testigo (croquis)
   ============================================================= */
import { CLASES_ESBELTEZ, CLASES_PARED, calculosVTA } from "./vta.js";
import { ESTADOS_TESTIGO } from "../config/croquis.js";
import { categoriaUrgencia } from "./registros.js";

const tonoClase = (clases, valor) => clases.find((c) => c.valor === valor)?.tono || "";

/** Urgencia: emergencia en rojo; urgente y programable en amarillo; el resto en verde */
export function tonoUrgencia(texto) {
  const u = categoriaUrgencia(texto) || String(texto || "");
  if (!u) return "";
  if (u.startsWith("EMERGENCIA")) return "peligro";
  if (u.startsWith("URGENTE") || u.startsWith("PROGRAMABLE")) return "medio";
  return "ok";
}

/** Tono de una fila según su campo (id) o su etiqueta. "" = sin color */
export function tonoFila(r, { id = "", etiqueta = "" } = {}) {
  if (id === "p32") return tonoUrgencia(r.p32);
  if (id === "testigo_estado") return tonoClase(ESTADOS_TESTIGO, r.testigo_estado);
  if (/pared residual/i.test(etiqueta)) return tonoClase(CLASES_PARED, calculosVTA(r).paredClase);
  if (/esbeltez/i.test(etiqueta)) return tonoClase(CLASES_ESBELTEZ, calculosVTA(r).esbClase);
  return "";
}

/** Colores para jsPDF (texto y fondo) */
export const PDF_TONO = {
  ok: { texto: [23, 102, 58], fondo: [223, 243, 230] },
  medio: { texto: [138, 97, 0], fondo: [255, 244, 204] },
  peligro: { texto: [180, 35, 24], fondo: [253, 236, 234] }
};

/** Clases de Tailwind para la ficha */
export const CSS_TONO = {
  ok: "font-bold text-[#17663a]",
  medio: "font-bold text-[#8a6100]",
  peligro: "font-bold text-[#b42318]"
};
