/* Descarga de archivos: respaldo JSON y exportación CSV */

const hoy = () => new Date().toISOString().slice(0, 10);

export function descargar(contenido, nombre, tipo) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Respaldo completo (incluye fotos) */
export function descargarRespaldo(registros) {
  descargar(
    JSON.stringify(registros, null, 1),
    `respaldo_arbolado_${hoy()}.json`,
    "application/json"
  );
}

/** Lee un respaldo JSON y devuelve la lista de registros */
export async function leerRespaldo(archivo) {
  const lista = JSON.parse(await archivo.text());
  if (!Array.isArray(lista)) throw new Error("Archivo de respaldo no válido");
  return lista.filter((r) => r && r._id);
}

/** Marca para que Excel abra el CSV con tildes correctas */
const BOM = String.fromCharCode(0xfeff);

/** Todos los registros en CSV (separado por ; para Excel en español; sin fotos) */
export function descargarCsv(registros) {
  const claves = [...new Set(registros.flatMap(Object.keys))].filter(
    (k) =>
      k !== "_pend" && !registros.some((r) => typeof r[k] === "string" && r[k].startsWith("data:"))
  );
  const celda = (v) =>
    `"${String(Array.isArray(v) ? v.join(", ") : (v ?? "")).replace(/"/g, '""')}"`;
  const filas = [
    claves.join(";"),
    ...registros.map((r) => claves.map((k) => celda(r[k])).join(";"))
  ];
  descargar(BOM + filas.join("\n"), `registros_arbolado_${hoy()}.csv`, "text/csv");
}
