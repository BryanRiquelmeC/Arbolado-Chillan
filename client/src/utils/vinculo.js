/* =============================================================
   Vínculo Croquis ↔ Matriz VTA (un mismo punto / árbol)
   · La Matriz guarda croquis_id (el _id del croquis).
   · datosDesdeCroquis: lo que la Matriz puede tomar del croquis.
   · alertasPunto: avisos cuando croquis y Matriz no coinciden.
   ============================================================= */
import { categoriaUrgencia } from "./registros.js";

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
    vta_copa_s: c.copa_s
  };
  return Object.fromEntries(Object.entries(datos).filter(([, v]) => v !== undefined && v !== null && v !== ""));
}

/** Nombres legibles de lo que se copia (para el aviso) */
export const NOMBRES_COPIA = {
  p1: "Manzana",
  direccion: "Dirección",
  direccion_gps: "Coordenadas GPS",
  p7: "DAP",
  vta_copa_n: "Copa Norte",
  vta_copa_s: "Copa Sur"
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
  const reco = String(m.p38 || "");
  const sinAccion = ["MONITOREO", "SIN INTERVENCIÓN"].includes(urgencia) || reco.startsWith("CON-01");
  const extraerMatriz = reco.startsWith("CON-06") || urgencia === "EMERGENCIA (Inmediata)";

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

  const campoAncho = ANCHO_UBICACION[c.ubic_arbol];
  const ancho = campoAncho ? num(c[campoAncho]) : null;
  const altura = num(m.p5);
  if (ancho !== null && ancho < 1 && ((altura && altura > 12) || (dapM && dapM > 40)))
    alertas.push(
      `Espacio estrecho: ${c.ubic_arbol} de ${String(ancho).replace(".", ",")} m para un árbol de gran porte (posible conflicto de raíces con la infraestructura).`
    );

  return alertas;
}
