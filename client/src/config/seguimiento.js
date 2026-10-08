/* =============================================================
   Seguimiento del trabajo en terreno de cada árbol
   Se guarda dentro del registro (columna JSONB "datos"):
     estado, resultado, fecha_inicio, fecha_termino,
     nota_seguimiento, fotos_seguimiento, historial[]
   ============================================================= */

export const ESTADOS = {
  pendiente: { nombre: "Pendiente", clase: "bg-[#eef1f4] text-[#4b5b6b]" },
  proceso: { nombre: "En proceso", clase: "bg-[#fff4cc] text-[#8a6100]" },
  terminado: { nombre: "Terminado", clase: "bg-[#dff3e6] text-[#17663a]" }
};

/** Qué quedó listo al terminar → y qué sigue */
export const RESULTADOS = [
  { valor: "Intervención realizada", sigue: "Sin trabajo pendiente", detalle: "Poda o mantención realizada" },
  { valor: "Árbol extraído", sigue: "Listo para destoconar", detalle: "Queda el tocón por retirar" },
  { valor: "Tocón retirado", sigue: "Listo para plantar", detalle: "El punto queda libre para un árbol nuevo" },
  { valor: "Árbol plantado", sigue: "Ciclo cerrado", detalle: "Se plantó un árbol nuevo" }
];

export const estadoDe = (r) => (ESTADOS[r?.estado] ? r.estado : "pendiente");
export const nombreEstado = (r) => ESTADOS[estadoDe(r)].nombre;
export const claseEstado = (r) => ESTADOS[estadoDe(r)].clase;
export const terminado = (r) => estadoDe(r) === "terminado";

/** "Listo para plantar", "Listo para destoconar"… (solo si está terminado) */
export const siguienteDe = (r) =>
  terminado(r) ? RESULTADOS.find((x) => x.valor === r.resultado)?.sigue || "" : "";

/** Texto corto para listas y PDF: "Terminado · Tocón retirado → Listo para plantar" */
export const resumenEstado = (r) =>
  [nombreEstado(r), terminado(r) && r.resultado, siguienteDe(r) && "→ " + siguienteDe(r)]
    .filter(Boolean)
    .join(" · ");
