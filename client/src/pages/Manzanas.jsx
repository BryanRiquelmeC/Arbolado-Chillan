/* Manzanas: módulo principal de registros.
   · Arriba: Nuevo árbol e Importar Excel
   · Cada tarjeta abre su manzana con buscador, filtros, paginación (20)
     y acciones PDF · Ver · Editar · Eliminar */
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileSpreadsheet, Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader.jsx";
import Vacio from "../components/ui/Vacio.jsx";
import Boton, { BotonArchivo } from "../components/ui/Boton.jsx";
import TarjetaManzana from "../components/manzanas/TarjetaManzana.jsx";
import ModalInformeManzana from "../components/manzanas/ModalInformeManzana.jsx";
import ModalDetalle from "../components/registros/ModalDetalle.jsx";
import ModalEditarCenso, { nuevoCenso } from "../components/registros/ModalEditarCenso.jsx";
import ModalSeguimiento from "../components/registros/ModalSeguimiento.jsx";
import ModalDuplicados from "../components/manzanas/ModalDuplicados.jsx";
import { buscarDuplicados, huellaCenso, unirDuplicados } from "../utils/duplicados.js";
import { Combine } from "lucide-react";
import { nombreEstado, siguienteDe } from "../config/seguimiento.js";
import ModalImportacion from "../components/registros/ModalImportacion.jsx";
import { useApp } from "../context/AppContext.jsx";
import { pdfManzana, pdfRegistro } from "../services/pdf.js";
import { Importar } from "../services/importar.js";
import { agruparPorManzana, comparar, contar, manzanaDe, tituloDe } from "../utils/registros.js";

export default function Manzanas() {
  const { registros, guardarRegistro, guardarVarios, eliminarRegistro, toast, confirmar } = useApp();
  const navegar = useNavigate();
  // "Buscar manzana…" se recuerda al volver
  const [busqueda, setBusquedaEstado] = useState(() => {
    try {
      return sessionStorage.getItem("buscar-manzana") || "";
    } catch {
      return "";
    }
  });
  const setBusqueda = (v) => {
    setBusquedaEstado(v);
    try {
      sessionStorage.setItem("buscar-manzana", v);
    } catch {
      /* nada */
    }
  };
  // La manzana abierta va en la dirección (/manzanas?mz=92): así "Volver"
  // desde el croquis o la Matriz VTA regresa con la misma manzana abierta.
  const [params, setParams] = useSearchParams();
  const abierta = params.get("mz");
  const setAbierta = (m) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        m ? n.set("mz", m) : n.delete("mz");
        return n;
      },
      { replace: true }
    );
  const [verRegistro, setVerRegistro] = useState(null);
  const [editarCenso, setEditarCenso] = useState(null);
  const [importacion, setImportacion] = useState(null);
  const [verDuplicados, setVerDuplicados] = useState(false);
  const [uniendo, setUniendo] = useState(false);
  const duplicados = useMemo(() => buscarDuplicados(registros), [registros]);
  const [estadoDe, setEstadoDe] = useState(null); // registro cuyo estado se cambia

  const grupos = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return agruparPorManzana(registros).filter(([m]) => m.toLowerCase().includes(q));
  }, [registros, busqueda]);

  // Siempre al día: si se edita o elimina un registro, la lista cambia sola
  const deLaManzana = useMemo(
    () => (abierta ? registros.filter((r) => (manzanaDe(r) || "Sin manzana") === abierta) : []),
    [registros, abierta]
  );

  /* ---------- Acciones de cada registro ---------- */
  const acciones = {
    onVer: setVerRegistro,
    onEstado: (r) => {
      setVerRegistro(null);
      setEstadoDe(r);
    },
    onPdf: (r) => pdfRegistro(r, registros),
    onEditar: (r) => {
      setVerRegistro(null);
      if (r._tipo === "censo") return setEditarCenso(r);
      navegar(r._tipo === "croquis" ? "/croquis" : "/matriz-vta", { state: { registro: r } });
    },
    onEliminar: async (r) => {
      const si = await confirmar({
        titulo: "¿Eliminar registro?",
        texto: (
          <>
            Se eliminará <b>{tituloDe(r)}</b>. Esta acción no se puede deshacer.
          </>
        ),
        ok: "Sí, eliminar",
        peligro: true
      });
      if (!si) return;
      await eliminarRegistro(r._id);
      setVerRegistro(null);
      toast("Registro eliminado");
    }
  };

  /* ---------- Importar Excel ---------- */
  async function importarExcel(archivo) {
    try {
      toast("Leyendo planilla…");
      const leidos = await Importar.leerArchivo(archivo);
      if (!leidos.length) return toast("La planilla no tiene registros reconocibles");
      // Si un árbol ya existe con otro ID (p. ej. importado antes sin ID_Arbol),
      // se reconoce por manzana + dirección + especie + hora y se actualiza ese.
      const porId = new Set(registros.map((r) => r._id));
      const porHuella = new Map(registros.map((r) => [huellaCenso(r), r._id]).filter(([h]) => h));
      const lista = leidos.map((r) => {
        if (porId.has(r._id)) return r;
        const mismo = porHuella.get(huellaCenso(r));
        return mismo ? { ...r, _id: mismo } : r;
      });
      const existentes = new Set(registros.map((r) => r._id));
      const manzanasActuales = new Set(registros.map((r) => manzanaDe(r) || "Sin manzana"));
      // Por manzana: cuántos árboles nuevos y cuántos se actualizan
      const grupos = new Map();
      for (const r of lista) {
        const g = grupos.get(r.manzana) || { manzana: r.manzana, nuevos: [], actualizados: 0 };
        if (existentes.has(r._id)) g.actualizados++;
        else g.nuevos.push(r);
        grupos.set(r.manzana, g);
      }
      const porManzana = [...grupos.values()]
        .map((g) => ({ ...g, manzanaNueva: !manzanasActuales.has(g.manzana) }))
        .sort((a, b) => comparar(a.manzana, b.manzana));
      setImportacion({
        archivo: archivo.name,
        lista,
        nuevos: lista.filter((r) => !existentes.has(r._id)).length,
        porManzana
      });
    } catch (e) {
      console.error(e);
      toast("No se pudo leer el archivo");
    }
  }

  async function confirmarImportacion(soloNuevos = false) {
    // Si el árbol ya existe, se ACTUALIZA con lo del Excel pero se conserva
    // lo agregado en la app (fotos, estado del trabajo, respuestas VTA, GPS…)
    // y no se borran datos con celdas vacías del Excel.
    const existentes = new Map(registros.map((r) => [r._id, r]));
    const vacio = (v) => v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length);
    const origen = soloNuevos ? importacion.lista.filter((r) => !existentes.has(r._id)) : importacion.lista;
    const lista = origen.map((nuevo) => {
      const antes = existentes.get(nuevo._id);
      if (!antes) return nuevo;
      const unido = { ...antes };
      for (const [k, v] of Object.entries(nuevo)) if (!vacio(v) || vacio(antes[k])) unido[k] = v;
      unido._creado = antes._creado || nuevo._creado;
      return unido;
    });
    await guardarVarios(lista);
    toast(`${lista.length} registros importados ✔`);
    setImportacion(null);
  }

  return (
    <>
      <PageHeader
        titulo="Registros por manzana"
        subtitulo="Toque una manzana para buscar, ver, editar o eliminar sus registros"
      >
        <Boton
          variante="primario"
          icono={Plus}
          className="flex-1 sm:flex-none"
          onClick={() => setEditarCenso(nuevoCenso())}
        >
          Nuevo árbol
        </Boton>
        <BotonArchivo
          icono={FileSpreadsheet}
          accept=".xlsx,.xls,.csv"
          onArchivo={importarExcel}
          className="flex-1 sm:flex-none"
        >
          Importar Excel
        </BotonArchivo>
      </PageHeader>

      <input
        type="search"
        className="campo mb-5 w-full sm:w-72"
        placeholder="Buscar manzana…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {duplicados.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f2c230] bg-[#fff8db] px-4 py-3 text-[14px]">
          <span>
            <b>{duplicados.length}</b> árbol{duplicados.length === 1 ? "" : "es"} aparece{duplicados.length === 1 ? "" : "n"} duplicado
            {duplicados.length === 1 ? "" : "s"} (importados dos veces).
          </span>
          <Boton tamano="sm" icono={Combine} onClick={() => setVerDuplicados(true)}>
            Revisar y unir
          </Boton>
        </div>
      )}

      {!grupos.length && (
        <Vacio>
          {registros.length
            ? "Ninguna manzana coincide"
            : "Aún no hay registros. Importe un Excel o agregue un árbol."}
        </Vacio>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {grupos.map(([m, lista]) => (
          <TarjetaManzana
            key={m}
            manzana={m}
            registros={lista}
            onPrevia={() => setAbierta(m)}
            onInforme={() => pdfManzana(m, lista)}
            onAgregar={() => setEditarCenso(nuevoCenso(m === "Sin manzana" ? "" : m))}
          />
        ))}
      </div>

      {abierta && (
        <ModalInformeManzana
          key={abierta}
          manzana={abierta}
          registros={deLaManzana}
          acciones={acciones}
          onCerrar={() => setAbierta(null)}
          onDescargar={() => pdfManzana(abierta, deLaManzana)}
        />
      )}

      {/* Se abren encima de la manzana */}
      <ModalDetalle
        registro={verRegistro}
        onCerrar={() => setVerRegistro(null)}
        onEditar={acciones.onEditar}
        onPdf={acciones.onPdf}
      />
      <ModalEditarCenso
        registro={editarCenso}
        registros={registros}
        onCerrar={() => setEditarCenso(null)}
        onGuardar={async (r) => {
          await guardarRegistro(r);
          setEditarCenso(null);
          toast(editarCenso?._nuevo ? "Árbol agregado ✔" : "Cambios guardados ✔");
        }}
      />
      <ModalSeguimiento
        registro={estadoDe}
        onCerrar={() => setEstadoDe(null)}
        onGuardar={async (r) => {
          await guardarRegistro(r);
          setEstadoDe(null);
          toast(`${nombreEstado(r)}${siguienteDe(r) ? " · " + siguienteDe(r) : ""} ✔`);
        }}
      />
      <ModalDuplicados
        grupos={verDuplicados ? duplicados : null}
        uniendo={uniendo}
        onCerrar={() => setVerDuplicados(false)}
        onUnir={async () => {
          setUniendo(true);
          try {
            for (const g of duplicados) {
              await guardarRegistro(unirDuplicados(g));
              for (const r of g.sobran) await eliminarRegistro(r._id);
            }
            toast(`${duplicados.length} duplicados unidos ✔`);
            setVerDuplicados(false);
          } finally {
            setUniendo(false);
          }
        }}
      />
      <ModalImportacion
        importacion={importacion}
        onCancelar={() => setImportacion(null)}
        onConfirmar={confirmarImportacion}
      />
    </>
  );
}
