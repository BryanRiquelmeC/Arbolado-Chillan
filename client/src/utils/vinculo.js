/* =============================================================
   Vínculo Croquis ↔ Matriz VTA (un mismo punto / árbol)
   · La Matriz guarda croquis_id (el _id del croquis).
   · datosDesdeCroquis: lo que la Matriz puede tomar del croquis.
   · alertasPunto: avisos cuando croquis y Matriz no coinciden.
   ============================================================= */
import { categoriaUrgencia } from "./registros.js";
import { sinCodigo } from "./vta.js";
import { PREGUNTAS } from "../config/encuesta.js";

/** El registro vinculado al que se pasa (croquis → su Matriz, Matriz → su croquis) */
export function vinculadoDe(r, todos = []) {
  if (!r) return null;
  if (r._tipo === "encuesta") return r.croquis_id ? todos.find((x) => x._id === r.croquis_id) || null : null;
  if (r._tipo === "croquis") return todos.find((x) => x._tipo === "encuesta" && x.croquis_id === r._id) || null;
  return null;
}

/** { croquis, matriz } del punto (cualquiera puede faltar) */
export function puntoDe(r, todos = []) {
  const otro = vinculadoDe(r, todos);
  const par = [r, otro].filter(Boolean);
  return {
    croquis: par.find((x) => x._tipo === "croquis") || null,
    matriz: par.find((x) => x._tipo === "encuesta") || null
  };
}

const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** Datos del croquis que sirven en la Matriz VTA (clave de la Matriz → valor) */
export function datosDesdeCroquis(c) {
  if (!c) return {};
  const datos = {
    croquis_id: c._id,
    p1: c.manzana,
    direccion: c.direccion,
    direccion_gps: c.direccion_gps,
    p7: c.dap, // DAP (cm)
    vta_copa_n: c.copa_n, // proyección de copa (m)
    vta_copa_s: c.copa_s,
    vta_copa_e: c.copa_e, // Oriente = Este
    vta_copa_o: c.copa_o, // Poniente = Oeste
    // Testigos de madera sana (cm): misma medida en croquis y Matriz
    vta_t_n: c.testigo_n,
    vta_t_s: c.testigo_s,
    vta_t_e: c.testigo_e,
    vta_t_o: c.testigo_o,
    // Red eléctrica: "Sí" (con tipo de red) o "No"
    ...redDesdeCroquis(c)
  };
  return Object.fromEntries(Object.entries(datos).filter(([, v]) => v !== undefined && v !== null && v !== ""));
}

/** Cables del croquis → Interferencia eléctrica (p25) y tipo de red (p25_tipo) de la Matriz */
function redDesdeCroquis(c) {
  const p25 = PREGUNTAS.find((p) => p.id === "p25");
  if (!p25 || !["Sí", "No"].includes(c.cables)) return {};
  const opcion = p25.opts.find((o) => o.startsWith(c.cables + ":"));
  const tipos = (c.tipo_red || []).filter((t) => p25.sub.opciones.includes(t));
  return {
    p25: opcion,
    ...(c.cables === "Sí" && tipos.length
      ? { [p25.sub.campo]: p25.sub.opciones.filter((t) => tipos.includes(t)).join(", ") }
      : {})
  };
}

/** Nombres legibles de lo que se copia (para el aviso) */
export const NOMBRES_COPIA = {
  p1: "Manzana",
  direccion: "Dirección",
  direccion_gps: "Coordenadas GPS",
  p7: "DAP",
  vta_copa_n: "Copa Norte",
  vta_copa_s: "Copa Sur",
  vta_copa_e: "Copa Oriente",
  vta_copa_o: "Copa Poniente",
  vta_t_n: "Testigo Norte",
  vta_t_s: "Testigo Sur",
  vta_t_e: "Testigo Oriente",
  vta_t_o: "Testigo Poniente",
  p25: "Interferencia eléctrica",
  p25_tipo: "Tipo de red"
};

const USOS = ["uso_vereda_izq", "uso_plata_izq", "uso_plata_der", "uso_vereda_der"];
const ANCHO_UBICACION = {
  "Platabanda izq.": "plata_izq",
  "Platabanda der.": "plata_der",
  "Vereda izq.": "vereda_izq",
  "Vereda der.": "vereda_der"
};

/** Avisos cuando el croquis y la Matriz del mismo punto no coinciden */
export function alertasPunto(c, m) {
  if (!c || !m) return [];
  const alertas = [];
  const extraerCroquis = USOS.some((k) => c[k] === "Extraer árbol");
  const urgencia = categoriaUrgencia(m.p32);
  const reco = sinCodigo(m.p38).toUpperCase(); // acepta respuestas con y sin código
  const sinAccion = ["MONITOREO", "SIN INTERVENCIÓN"].includes(urgencia) || reco.startsWith("MONITOREO TÉCNICO");
  const extraerMatriz = reco.startsWith("EXTRACCIÓN INMEDIATA") || urgencia === "EMERGENCIA (Inmediata)";

  if (extraerCroquis && sinAccion)
    alertas.push("El croquis proyecta extraer el árbol, pero la Matriz VTA no recomienda intervención.");
  if (extraerMatriz && !extraerCroquis)
    alertas.push("La Matriz VTA indica extracción o emergencia, pero el croquis no proyecta extraer el árbol.");

  const cables = c.cables;
  const interf = String(m.p25 || "").split(":")[0].trim();
  if (cables === "No" && interf === "Sí")
    alertas.push("La Matriz indica interferencia eléctrica, pero el croquis registra que no hay cables aéreos.");
  if (cables === "Sí" && interf === "No")
    alertas.push("El croquis registra cables aéreos, pero la Matriz indica que no hay interferencia eléctrica.");

  const dapC = num(c.dap);
  const dapM = num(m.p7);
  if (dapC && dapM && Math.abs(dapC - dapM) / Math.max(dapC, dapM) > 0.15)
    alertas.push(`El DAP no coincide: croquis ${dapC} cm y Matriz ${dapM} cm.`);

  // Testigos: deben ser iguales en ambos registros
  for (const [kc, km, nombre] of [
    ["testigo_n", "vta_t_n", "Norte"],
    ["testigo_s", "vta_t_s", "Sur"],
    ["testigo_e", "vta_t_e", "Oriente"],
    ["testigo_o", "vta_t_o", "Poniente"]
  ]) {
    const tc = num(c[kc]);
    const tm = num(m[km]);
    if (tc && tm && tc !== tm) alertas.push(`El testigo ${nombre} no coincide: croquis ${tc} cm y Matriz ${tm} cm.`);
  }

  const campoAncho = ANCHO_UBICACION[c.ubic_arbol];
  const ancho = campoAncho ? num(c[campoAncho]) : null;
  const altura = num(m.p5);
  if (ancho !== null && ancho < 1 && ((altura && altura > 12) || (dapM && dapM > 40)))
    alertas.push(
      `Espacio estrecho: ${c.ubic_arbol} de ${String(ancho).replace(".", ",")} m para un árbol de gran porte (posible conflicto de raíces con la infraestructura).`
    );

  // Testigo con madera dañada, pero la Matriz no registra oquedad
  const testigoMalo = ["Madera podrida", "Madera molida"].includes(c.testigo_estado);
  if (testigoMalo && String(m.p12 || "").startsWith("Ninguna"))
    alertas.push(`El testigo del croquis indica "${c.testigo_estado}", pero la Matriz no registra oquedad en el tronco.`);

  return alertas;
}
