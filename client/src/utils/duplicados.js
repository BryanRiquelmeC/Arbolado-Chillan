/* =============================================================
   Árboles del censo importados dos veces (p. ej. una vez sin
   ID_Arbol y otra con ID). Se reconocen por: misma manzana,
   misma dirección, misma especie y misma hora de registro.
   ============================================================= */
const norm = (t) =>
  String(t || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/** Huella de un árbol del censo (vacía si no hay datos suficientes) */
export function huellaCenso(r) {
  if (r._tipo !== "censo" || !r.direccion) return "";
  const minuto = (r._creado || r.fecha || "").slice(0, 16); // AAAA-MM-DDTHH:MM
  return [norm(r.manzana), norm(r.direccion), norm(r.especie), minuto].join("|");
}

/** Grupos de duplicados: [{ conservar, sobran: [...] }] */
export function buscarDuplicados(registros) {
  const grupos = new Map();
  for (const r of registros) {
    const h = huellaCenso(r);
    if (!h) continue;
    grupos.set(h, [...(grupos.get(h) || []), r]);
  }
  return [...grupos.values()]
    .filter((g) => g.length > 1)
    .map((g) => {
      // Se conserva el que tiene ID_Arbol; a igualdad, el más completo
      const puntaje = (r) =>
        (r.id_arbol ? 100 : 0) + (r.fotos?.length || 0) * 5 + (r.estado ? 5 : 0) + Object.keys(r).length / 100;
      const orden = [...g].sort((a, b) => puntaje(b) - puntaje(a));
      return { conservar: orden[0], sobran: orden.slice(1) };
    });
}

/** Une los datos de los duplicados en el que se conserva (no se pierden fotos ni estado) */
export function unirDuplicados({ conservar, sobran }) {
  const vacio = (v) => v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length);
  const r = { ...conservar };
  for (const otro of sobran) {
    for (const [k, v] of Object.entries(otro)) if (vacio(r[k]) && !vacio(v)) r[k] = v;
    // Fotos de ambos, sin repetir
    if (otro.fotos?.length) {
      const ya = new Set((r.fotos || []).map((f) => f.img));
      r.fotos = [...(r.fotos || []), ...otro.fotos.filter((f) => !ya.has(f.img))];
    }
  }
  return r;
}
