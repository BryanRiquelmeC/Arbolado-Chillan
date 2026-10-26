/* Matriz VTA · "Croquis de este árbol" (va justo después de la Manzana)
   1. Sin manzana pide escribirla.
   2. Con manzana tarjetas con los croquis de esa manzana; un toque vincula.
   3. Vinculado resumen del croquis, avisos y acciones (completar / cambiar / quitar).*/
import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Download, Map, RefreshCw, Search, Unlink } from "lucide-react";
import Boton from "../ui/Boton.jsx";
import AlertasPunto from "./AlertasPunto.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { NOMBRES_COPIA, alertasPunto, datosDesdeCroquis } from "../../utils/vinculo.js";
import { tituloDe } from "../../utils/registros.js";

const fecha = (c) => new Date(c._creado).toLocaleDateString("es-CL");
const norm = (v) => String(v || "").trim().toLowerCase();

/** Datos cortos para reconocer el croquis a simple vista */
function Resumen({ c }) {
  const datos = [
    c.manzana && `Manzana ${c.manzana}`,
    fecha(c),
    c.dap && `DAP ${c.dap} cm`,
    c.ancho_total && `Perfil ${c.ancho_total} m`,
    c.ubic_arbol
  ].filter(Boolean);
  return <span className="text-[13px] text-suave">{datos.join(" · ")}</span>;
}

export default function VinculoCroquis({ d, set }) {
  const { registros, toast } = useApp();
  const [verOtros, setVerOtros] = useState(false);
  const [cambiando, setCambiando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const croquis = registros
    .filter((r) => r._tipo === "croquis")
    .sort((a, b) => String(b._creado).localeCompare(String(a._creado)));
  const vinculado = croquis.find((c) => c._id === d.croquis_id) || null;
  const mz = norm(d.p1);
  const deLaManzana = croquis.filter((c) => mz && norm(c.manzana) === mz);
  const otros = croquis.filter((c) => !deLaManzana.includes(c));

  // Paginación de los croquis de la manzana: 5 por página
  const POR_PAGINA = 5;
  const [pagina, setPagina] = useState(1);
  const paginas = Math.max(1, Math.ceil(deLaManzana.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, paginas);
  const visibles = deLaManzana.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  // Al cambiar la manzana, volver a mostrar solo los de esa manzana
  useEffect(() => {
    setVerOtros(false);
    setBusqueda("");
    setPagina(1);
  }, [mz]);

  // Otras manzanas: buscador por dirección o manzana y máximo 5 resultados
  const MAX_OTROS = 5;
  const q = norm(busqueda);
  const otrosFiltrados = otros.filter((c) => !q || norm(`${c.direccion} ${c.manzana}`).includes(q));
  const otrosVisibles = otrosFiltrados.slice(0, MAX_OTROS);

  /** Copia del croquis solo los campos que la Matriz aún tiene vacíos */
  function copiar(c, avisar = true) {
    const copiados = Object.entries(datosDesdeCroquis(c)).filter(
      ([k]) => k !== "croquis_id" && !String(d[k] ?? "").trim()
    );
    copiados.forEach(([k, v]) => set(k, v));
    if (avisar)
      toast(
        copiados.length
          ? `Copiado del croquis: ${copiados.map(([k]) => NOMBRES_COPIA[k]).join(", ")}`
          : "No había campos vacíos para completar"
      );
  }

  function vincular(c) {
    set("croquis_id", c._id);
    copiar(c);
    setCambiando(false);
    setVerOtros(false);
  }

  /* ---------- Una tarjeta de croquis para elegir ---------- */
  const Opcion = ({ c }) => (
    <button
      type="button"
      onClick={() => vincular(c)}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border-[1.5px] border-[#cfe3f2] bg-white px-4 py-3 text-left transition hover:border-c2 hover:bg-c5"
    >
      <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-c4 text-c2">
        <Map size={18} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <b className="truncate text-[15px] text-c1">{tituloDe(c)}</b>
        <Resumen c={c} />
      </span>
      <span className="flex-none rounded-full border-[1.5px] border-c2 px-3 py-1 text-[13px] font-bold text-c2 transition group-hover:bg-c2 group-hover:text-white">
        Vincular
      </span>
    </button>
  );

  return (
    <div className="col-span-full flex flex-col gap-3 rounded-2xl border border-[#cfe3f2] bg-c5 p-4">
      <div>
        <span className="etiqueta">Croquis de este árbol (opcional)</span>
        <p className="mt-1 text-[13px] text-suave">
          Si al árbol se le hizo croquis de perfil vial, vincúlelo: los datos se completan solos y el PDF sale
          combinado.
        </p>
      </div>

      {/* ---------- 3) Ya vinculado ---------- */}
      {vinculado && !cambiando ? (
        <>
          <div className="flex flex-col gap-3 rounded-xl border-2 border-[#17663a] bg-white px-4 py-3 sm:flex-row sm:items-center">
            <span className="flex size-9 flex-none items-center justify-center rounded-full bg-[#dff3e6] text-[#17663a]">
              <Check size={20} strokeWidth={3} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[12px] font-bold tracking-wide text-[#17663a] uppercase">Vinculado</span>
              <b className="truncate text-[15px] text-c1">{tituloDe(vinculado)}</b>
              <Resumen c={vinculado} />
            </span>
            <span className="flex flex-wrap gap-2">
              <Boton tamano="sm" icono={Download} onClick={() => copiar(vinculado)}>
                Completar datos
              </Boton>
              <Boton tamano="sm" icono={RefreshCw} onClick={() => setCambiando(true)}>
                Cambiar
              </Boton>
              <Boton tamano="sm" variante="borrar" icono={Unlink} onClick={() => set("croquis_id", "")}>
                Quitar
              </Boton>
            </span>
          </div>
          <AlertasPunto alertas={alertasPunto(vinculado, d)} mostrarOk />
        </>
      ) : !mz ? (
        /* ---------- 1) Falta la manzana ---------- */
        <p className="rounded-xl border border-dashed border-[#cfe3f2] bg-white px-4 py-3 text-[13.5px] text-[#2b4a63]">
          ↑ Escriba primero la <b>manzana</b> para ver los croquis disponibles.
        </p>
      ) : (
        /* ---------- 2) Elegir croquis ---------- */
        <div className="flex flex-col gap-2">
          {deLaManzana.length ? (
            <>
              <span className="text-[13px] font-semibold text-c1">
                Croquis de la manzana {d.p1} ({deLaManzana.length})
                {paginas > 1 && (
                  <span className="font-normal text-suave">
                    {" "}
                    · mostrando {(paginaActual - 1) * POR_PAGINA + 1}–{Math.min(paginaActual * POR_PAGINA, deLaManzana.length)}
                  </span>
                )}
              </span>
              {visibles.map((c) => (
                <Opcion key={c._id} c={c} />
              ))}
            </>
          ) : (
            <p className="rounded-xl border border-dashed border-[#cfe3f2] bg-white px-4 py-3 text-[13.5px] text-[#2b4a63]">
              No hay croquis guardados en la manzana <b>{d.p1}</b>. Puede continuar la Matriz sin croquis.
            </p>
          )}

          {/* Fila inferior: otras manzanas (izquierda) · paginación (derecha) */}
          {(paginas > 1 || (otros.length > 0 && !verOtros)) && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              {otros.length > 0 && !verOtros ? (
                <button
                  type="button"
                  onClick={() => setVerOtros(true)}
                  className="w-fit cursor-pointer text-[13px] font-bold text-c2 underline"
                >
                  Ver croquis de otras manzanas ({otros.length})
                </button>
              ) : (
                <span />
              )}
              {paginas > 1 && (
                <nav className="flex items-center gap-1" aria-label="Páginas de croquis">
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() => setPagina(paginaActual - 1)}
                    aria-label="Anterior"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#cfe3f2] bg-white text-c2 disabled:cursor-default disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPagina(n)}
                      aria-current={n === paginaActual ? "page" : undefined}
                      className={`size-8 cursor-pointer rounded-lg border text-[13px] font-bold ${
                        n === paginaActual ? "border-c2 bg-c2 text-white" : "border-[#cfe3f2] bg-white text-c1 hover:border-c3"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={paginaActual === paginas}
                    onClick={() => setPagina(paginaActual + 1)}
                    aria-label="Siguiente"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#cfe3f2] bg-white text-c2 disabled:cursor-default disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </nav>
              )}
            </div>
          )}

          {otros.length > 0 && verOtros && (
              <div className="mt-1 flex flex-col gap-2 rounded-xl border border-[#cfe3f2] bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-c1">Buscar en otras manzanas ({otros.length})</span>
                  <button
                    type="button"
                    onClick={() => setVerOtros(false)}
                    className="cursor-pointer text-[13px] font-bold text-suave underline"
                  >
                    Ocultar
                  </button>
                </div>
                <label className="relative">
                  <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-suave" />
                  <input
                    className="campo pl-9"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Dirección o número de manzana…"
                    autoFocus
                  />
                </label>
                {otrosVisibles.map((c) => (
                  <Opcion key={c._id} c={c} />
                ))}
                {!otrosFiltrados.length && (
                  <p className="text-[13px] text-suave">Ningún croquis coincide con "{busqueda}".</p>
                )}
                {otrosFiltrados.length > MAX_OTROS && (
                  <p className="text-[12.5px] text-suave">
                    Mostrando {MAX_OTROS} de {otrosFiltrados.length}. Escriba la dirección para encontrar el que busca.
                  </p>
                )}
              </div>
          )}

          {cambiando && (
            <button
              type="button"
              onClick={() => setCambiando(false)}
              className="w-fit cursor-pointer text-[13px] font-bold text-suave underline"
            >
              Cancelar cambio
            </button>
          )}
        </div>
      )}
    </div>
  );
}
