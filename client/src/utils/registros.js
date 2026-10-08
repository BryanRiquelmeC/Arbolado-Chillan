/* =============================================================
   Utilidades comunes para los 3 tipos de registro
   (croquis · Matriz VTA · censo importado)
   ============================================================= */

export const TIPOS = {
  croquis: { nombre: "Croquis", clase: "bg-[#e3f1fb] text-c1" },
  encuesta: { nombre: "Matriz VTA", clase: "bg-[#e2f5ec] text-ok" },
  censo: { nombre: "Censo", clase: "bg-[#fdf0dc] text-alerta" }
};

/** Manzana del registro */
export const manzanaDe = (r) => String((r._tipo === "encuesta" ? r.p1 : r.manzana) || "").trim();

/** Especie del registro */
export const especieDe = (r) => {
  if (r._tipo === "censo") return r.especie || "";
  if (r.p3 === "Otros") return r.p3_otro || "Otros";
  return r.p3 || "";
};

/** Urgencia resumida */
export const urgenciaDe = (r) =>
  r._tipo === "censo" ? r.urgencia || "" : (r.p32 || "").split(" (")[0];

/** Fecha AAAA-MM-DD */
export const fechaDe = (r) => (r.fecha || r._creado || "").slice(0, 10);

/** Título visible */
export const tituloDe = (r) =>
  r.direccion || (r.id_arbol ? `Árbol ${r.id_arbol}` : "Sin dirección");


/** Texto para el buscador: solo dirección, manzana, especie y código */
export const textoDe = (r) =>
  [
    r.direccion,          // dirección (croquis, Matriz VTA y censo)
    manzanaDe(r),         // manzana
    especieDe(r),         // especie
    r.id_arbol,           // código del árbol (censo)
    r.registro            // código antiguo del croquis, si existe
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

/** Color según urgencia */
export const claseUrgencia = (u) =>
  /EMERGENCIA/.test(u)
    ? "bg-[#fde2e2] text-[#a32020]"
    : /URGENTE/.test(u)
      ? "bg-[#fdf0dc] text-alerta"
      : /PROGRAMABLE/.test(u)
        ? "bg-[#e3f1fb] text-c1"
        : u
          ? "bg-[#e2f5ec] text-ok"
          : "bg-c4 text-c1";

/** Cuenta valores y los ordena de mayor a menor: [[valor, cantidad]] */
export const contar = (lista) =>
  Object.entries(
    lista.reduce((o, v) => {
      if (v) o[v] = (o[v] || 0) + 1;
      return o;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

/** Comparación natural ("2" < "10") */
export const comparar = (a, b) => String(a).localeCompare(String(b), "es", { numeric: true });

/** Agrupa registros por manzana, ordenadas */
export function agruparPorManzana(registros) {
  const g = {};
  for (const r of registros) (g[manzanaDe(r) || "Sin manzana"] ??= []).push(r);
  return Object.entries(g).sort((a, b) => comparar(a[0], b[0]));
}

/** Formato de fecha y hora chilena */
export const fechaHora = (iso) =>
  iso ? new Date(iso).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" }) : "—";

/** Id único corto */
export const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/** Valor legible para fichas y PDF */
export const legible = (v) => (Array.isArray(v) ? v.join(", ") : v || "—");

/** Datos principales de un árbol del censo importado: [[etiqueta, valor]] */
export function fichaCenso(r) {
  return [
    ["ID Árbol", r.id_arbol],
    ["N° de árbol", r.n_arbol],
    ["Manzana", r.manzana],
    ["Dirección", r.direccion],
    ["GPS", r.gps],
    ["Especie", r.especie],
    ["Fecha de registro", r.fecha ? new Date(r.fecha + "T12:00").toLocaleDateString("es-CL") : ""],
    ["Urgencia", r.urgencia],
    ["Recomendación técnica", r.recomendacion]
  ];
}

/** Nombre del dispositivo que guarda el registro */
export const dispositivo = () =>
  /Android/.test(navigator.userAgent) ? "Android" : navigator.platform || "";
