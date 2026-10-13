/* =============================================================
   Borradores automáticos (en la tablet, IndexedDB)
   Lo que se va escribiendo en un formulario se guarda solo, para
   no perderlo si se toca Volver, se cierra la app o se acaba la batería.
   ============================================================= */
import { openDB } from "idb";

let conexion;
const abrir = () =>
  (conexion ??= openDB("arbolado_borradores", 1, {
    upgrade(db) {
      db.createObjectStore("borradores");
    }
  }));

/** { datos, fecha, titulo } o undefined */
export async function leerBorrador(clave) {
  try {
    return await (await abrir()).get("borradores", clave);
  } catch {
    return undefined;
  }
}

export async function guardarBorrador(clave, datos, titulo = "") {
  try {
    await (await abrir()).put("borradores", { datos, titulo, fecha: new Date().toISOString() }, clave);
  } catch {
    /* sin espacio o sin soporte: no es crítico */
  }
}

export async function borrarBorrador(clave) {
  try {
    await (await abrir()).delete("borradores", clave);
  } catch {
    /* nada */
  }
}

/** "hace 5 min", "hace 2 h", "ayer"… */
export function haceCuanto(iso) {
  const min = Math.round((Date.now() - new Date(iso)) / 60000);
  if (min < 1) return "recién";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  return h < 48 ? "ayer" : new Date(iso).toLocaleDateString("es-CL");
}
