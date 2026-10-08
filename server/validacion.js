/* Validación de los datos que llegan a la API */

const TIPOS_VALIDOS = new Set(["croquis", "encuesta", "censo"]);

/** Error con código HTTP */
export function errorHttp(estado, mensaje) {
  return Object.assign(new Error(mensaje), { status: estado });
}

/** Lista de ids de texto */
export function leerIds(body) {
  const ids = Array.isArray(body?.ids) ? body.ids.filter((x) => typeof x === "string") : [];
  if (!ids.length) throw errorHttp(400, "Debe enviar una lista 'ids'");
  return ids;
}

/** Lista de registros válidos (sin la marca interna _pend) */
export function leerRegistros(body) {
  const lista = Array.isArray(body?.registros) ? body.registros : [];
  if (!lista.length) throw errorHttp(400, "Debe enviar 'registros'");
  return lista.map((r) => {
    if (!r || typeof r !== "object" || !r._id || !TIPOS_VALIDOS.has(r._tipo)) {
      throw errorHttp(400, "Registro inválido: falta _id o _tipo");
    }
    const { _pend, ...limpio } = r;
    return limpio;
  });
}
