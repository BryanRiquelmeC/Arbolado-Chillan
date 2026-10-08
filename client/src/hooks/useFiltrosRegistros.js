/* =============================================================
   Filtros, orden y paginación de la página Registros
   - Cada lista muestra solo opciones que existen con los demás filtros
   - El buscador ignora tildes/mayúsculas y exige TODAS las palabras
   ============================================================= */
import { useEffect, useMemo, useState } from "react";
import {
  comparar,
  especieDe,
  fechaDe,
  manzanaDe,
  textoDe,
  tituloDe,
  urgenciaDe
} from "../utils/registros.js";

export const POR_PAGINA = 20;

export const FILTROS_VACIOS = {
  q: "",
  tipo: "",
  manzana: "",
  especie: "",
  urgencia: "",
  desde: "",
  hasta: "",
  orden: "new"
};

/** Quita tildes y pasa a minúsculas: "Chillán" → "chillan" */
const normalizar = (t) =>
  String(t ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const unicos = (lista) => [...new Set(lista.filter(Boolean))].sort(comparar);

export function useFiltrosRegistros(registros, manzanaInicial = "") {
  const [filtros, setFiltros] = useState({ ...FILTROS_VACIOS, manzana: manzanaInicial });
  const [pagina, setPagina] = useState(1);

  // Si se llega desde "Manzanas → Ver registros"
  useEffect(() => {
    if (manzanaInicial) setFiltros({ ...FILTROS_VACIOS, manzana: manzanaInicial, orden: "dir" });
  }, [manzanaInicial]);

  const setFiltro = (campo, valor) => {
    setFiltros((f) => ({ ...f, [campo]: valor }));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_VACIOS);
    setPagina(1);
  };

  // Texto de búsqueda de cada registro (se calcula una sola vez)
  const textos = useMemo(
    () => new Map(registros.map((r) => [r, normalizar(textoDe(r))])),
    [registros]
  );

  const q = filtros.q.trim().toLowerCase(); // para resaltar coincidencias
  const palabras = normalizar(filtros.q).split(/\s+/).filter(Boolean);

  /** ¿El registro cumple todos los filtros? (menos el indicado en "ignorar") */
  const cumple = (r, ignorar = "") => {
    const f = filtros;
    return (
      (ignorar === "tipo" || !f.tipo || r._tipo === f.tipo) &&
      (ignorar === "manzana" || !f.manzana || manzanaDe(r) === f.manzana) &&
      (ignorar === "especie" || !f.especie || especieDe(r) === f.especie) &&
      (ignorar === "urgencia" || !f.urgencia || urgenciaDe(r) === f.urgencia) &&
      (!f.desde || fechaDe(r) >= f.desde) &&
      (!f.hasta || fechaDe(r) <= f.hasta) &&
      palabras.every((p) => textos.get(r).includes(p))
    );
  };

  /** Listas desplegables: solo valores que existen con los otros filtros */
  const opciones = useMemo(() => {
    const de = (campo, obtener) =>
      unicos([
        ...registros.filter((r) => cumple(r, campo)).map(obtener),
        filtros[campo] // mantener visible la opción ya elegida
      ]);
    return {
      manzanas: de("manzana", manzanaDe),
      especies: de("especie", especieDe),
      urgencias: de("urgencia", urgenciaDe)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registros, filtros, textos]);

  const filtrados = useMemo(() => {
    let lista = registros.filter((r) => cumple(r));
    const o = filtros.orden;
    if (o === "old") lista = [...lista].reverse();
    if (o === "dir") lista = [...lista].sort((a, b) => comparar(tituloDe(a), tituloDe(b)));
    if (o === "mz") lista = [...lista].sort((a, b) => comparar(manzanaDe(a), manzanaDe(b)));
    return lista;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registros, filtros, textos]);

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const actual = Math.min(pagina, paginas);
  const inicio = (actual - 1) * POR_PAGINA;

  return {
    filtros,
    setFiltro,
    limpiarFiltros,
    opciones,
    q,
    filtrados,
    visibles: filtrados.slice(inicio, inicio + POR_PAGINA),
    inicio,
    pagina: actual,
    paginas,
    setPagina
  };
}