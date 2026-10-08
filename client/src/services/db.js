/* =============================================================
   Almacenamiento local en la tablet (IndexedDB)
   Todo se guarda primero aquí: la app funciona sin internet.
   ============================================================= */
import { openDB } from "idb";

const NOMBRE = "arbolado_urbano";
const TIENDA = "registros";

let conexion;
function abrir() {
  conexion ??= openDB(NOMBRE, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(TIENDA)) db.createObjectStore(TIENDA, { keyPath: "_id" });
    }
  });
  return conexion;
}

/** Pide al navegador no borrar los datos aunque falte espacio */
export async function pedirAlmacenamientoPersistente() {
  try {
    await navigator.storage?.persist?.();
  } catch {
    /* sin soporte: no es crítico */
  }
}

export async function leerTodos() {
  return (await abrir()).getAll(TIENDA);
}

export async function guardar(registro) {
  await (await abrir()).put(TIENDA, registro);
}

export async function guardarVarios(registros) {
  const tx = (await abrir()).transaction(TIENDA, "readwrite");
  await Promise.all([...registros.map((r) => tx.store.put(r)), tx.done]);
}

export async function eliminar(id) {
  await (await abrir()).delete(TIENDA, id);
}

/* Ids eliminados en la tablet que faltan por borrar en la nube */
const CLAVE_BORRADOS = "sync_borrados";

export function borradosPendientes() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_BORRADOS)) || [];
  } catch {
    return [];
  }
}

export function setBorradosPendientes(ids) {
  localStorage.setItem(CLAVE_BORRADOS, JSON.stringify(ids));
}

/* Registros borrados solo en este dispositivo (no se vuelven a descargar) */
export function ocultos() {
  try {
    return JSON.parse(localStorage.getItem("ocultos") || "[]");
  } catch {
    return [];
  }
}

export function ocultar(id) {
  localStorage.setItem("ocultos", JSON.stringify([...new Set([...ocultos(), id])]));
}