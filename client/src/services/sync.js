/* =============================================================
   Sincronización tablet ⇄ servidor Express

   1. Sube eliminaciones pendientes.
   2. Sube registros nuevos/modificados (lotes pequeños por las fotos).
   3. Pide la lista liviana (id + fecha) y descarga SOLO lo que cambió.
   4. Quita de la tablet lo que se eliminó desde otra tablet.
   ============================================================= */
import { api } from "./api.js";
import * as db from "./db.js";

const LOTE_SUBIDA = 3; // registros por envío (con fotos pueden pesar)
const LOTE_BAJADA = 50;

/**
 * @param {Array} locales  registros actuales de la tablet
 * @returns {Promise<Array>} registros actualizados después de sincronizar
 */
export async function sincronizar(locales) {
  const salud = await api.salud();
  if (!salud.nube) throw Object.assign(new Error("Servidor no disponible"), { sinNube: true });

  let lista = [...locales];

  // 1) Eliminaciones
  const borrados = db.borradosPendientes();
  if (borrados.length) {
    await api.eliminar(borrados);
    db.setBorradosPendientes([]);
  }

  // 2) Subida
  const pendientes = lista.filter((r) => r._pend);
  for (let i = 0; i < pendientes.length; i += LOTE_SUBIDA) {
    const lote = pendientes.slice(i, i + LOTE_SUBIDA);
    await api.guardar(lote.map(({ _pend, ...r }) => r));
    const listos = lote.map((r) => ({ ...r, _pend: false }));
    await db.guardarVarios(listos);
    const ids = new Set(listos.map((r) => r._id));
    lista = lista.map((r) => (ids.has(r._id) ? { ...r, _pend: false } : r));
  }

  // 3) Bajada incremental
  const indice = await api.indice();
  const enNube = new Set(indice.map((f) => f.id));
  const porId = new Map(lista.map((r) => [r._id, r]));
  const ocultos = new Set(db.ocultos());
  const faltan = indice
    .filter((f) => {
      if (ocultos.has(f.id)) return false; // borrado solo en este dispositivo
      const loc = porId.get(f.id);
      if (!loc) return true;
      if (loc._pend) return false;
      return new Date(f.actualizado) > new Date(loc._actualizado || 0);
    })
    .map((f) => f.id);

  for (let i = 0; i < faltan.length; i += LOTE_BAJADA) {
    const nuevos = (await api.obtener(faltan.slice(i, i + LOTE_BAJADA))).map((r) => ({
      ...r,
      _pend: false
    }));
    await db.guardarVarios(nuevos);
    nuevos.forEach((r) => porId.set(r._id, r));
  }

  // 4) Eliminados en otra tablet
  for (const r of [...porId.values()]) {
    if (!r._pend && !enNube.has(r._id)) {
      porId.delete(r._id);
      await db.eliminar(r._id);
    }
  }

  return [...porId.values()];
}
