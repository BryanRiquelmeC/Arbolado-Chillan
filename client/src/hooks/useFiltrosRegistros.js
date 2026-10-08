/* =============================================================
   Filtros, orden y paginación de la página Registros
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
import { estadoDe, siguienteDe } from "../config/seguimiento.js";

export const POR_PAGINA = 20;

export const FILTROS_VACIOS = {
  q: "",
  tipo: "",
  manzana: "",
  especie: "",
  urgencia: "",
  estado: "",
  desde: "",
  hasta: "",
  orden: "new"
};

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

  /** Valores disponibles en las listas desplegables */
  const opciones = useMemo(
    () => ({
      manzanas: unicos(registros.map(manzanaDe)),
      especies: unicos(registros.map(especieDe)),
      urgencias: unicos(registros.map(urgenciaDe))
    }),
    [registros]
  );

  const q = filtros.q.trim().toLowerCase();
  // Sin tildes y todas las palabras deben coincidir ("mantencion ciclica" encuentra "MANTENCIÓN CÍCLICA")
  const palabras = q.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/).filter(Boolean);

  const filtrados = useMemo(() => {
    const f = filtros;
    let lista = registros.filter(
      (r) =>
        (!f.tipo || r._tipo === f.tipo) &&
        (!f.manzana || manzanaDe(r) === f.manzana) &&
        (!f.especie || especieDe(r) === f.especie) &&
        (!f.urgencia || urgenciaDe(r) === f.urgencia) &&
        (!f.estado ||
          (f.estado.startsWith("sigue:") ? siguienteDe(r) === f.estado.slice(6) : estadoDe(r) === f.estado)) &&
        (!f.desde || fechaDe(r) >= f.desde) &&
        (!f.hasta || fechaDe(r) <= f.hasta) &&
        (!palabras.length || palabras.every((p) => textoDe(r).includes(p)))
    );
    if (f.orden === "old") lista = [...lista].reverse();
    if (f.orden === "dir") lista = [...lista].sort((a, b) => comparar(tituloDe(a), tituloDe(b)));
    if (f.orden === "mz") lista = [...lista].sort((a, b) => comparar(manzanaDe(a), manzanaDe(b)));
    return lista;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registros, filtros, q]);

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
