/* Registros guardados: buscar, filtrar, ver, editar, eliminar, importar y exportar */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader.jsx";
import Paginacion from "../components/ui/Paginacion.jsx";
import BarraHerramientas from "../components/registros/BarraHerramientas.jsx";
import FiltrosRegistros from "../components/registros/FiltrosRegistros.jsx";
import ContadorResultados from "../components/registros/ContadorResultados.jsx";
import ListaRegistros from "../components/registros/ListaRegistros.jsx";
import ModalDetalle from "../components/registros/ModalDetalle.jsx";
import ModalImportacion from "../components/registros/ModalImportacion.jsx";
import ModalEditarCenso, { nuevoCenso } from "../components/registros/ModalEditarCenso.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useFiltrosRegistros } from "../hooks/useFiltrosRegistros.js";
import { pdfRegistro } from "../services/pdf.js";
import { Importar } from "../services/importar.js";
import { comparar, contar, tituloDe } from "../utils/registros.js";
import { Plus } from "lucide-react";
import Boton from "../components/ui/Boton.jsx";

export default function Registros() {
  const { registros, guardarRegistro, guardarVarios, eliminarRegistro, toast, confirmar } = useApp();
  const navegar = useNavigate();
  const [params, setParams] = useSearchParams();
  const vista = useFiltrosRegistros(registros, params.get("manzana") || "");
  const [verRegistro, setVerRegistro] = useState(null);
  const [importacion, setImportacion] = useState(null);
  const [editarCenso, setEditarCenso] = useState(null);

  // Desde "Manzanas → Agregar árbol" llega ?manzana=47&nuevo=1
  useEffect(() => {
    if (params.get("nuevo")) {
      setEditarCenso(nuevoCenso(params.get("manzana") || ""));
      params.delete("nuevo");
      setParams(params, { replace: true });
    }
  }, [params, setParams]);

  /* ---------- Acciones de cada registro ---------- */
  const acciones = {
    onVer: setVerRegistro,
    onPdf: (r) => pdfRegistro(r),
    onEditar: (r) => {
      if (r._tipo === "censo") {
        setVerRegistro(null);
        return setEditarCenso(r);
      }
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

  /* ---------- Importar / restaurar / exportar ---------- */
  async function importarExcel(archivo) {
    try {
      toast("Leyendo planilla…");
      const lista = await Importar.leerArchivo(archivo);
      if (!lista.length) return toast("La planilla no tiene registros reconocibles");
      const existentes = new Set(registros.map((r) => r._id));
      setImportacion({
        archivo: archivo.name,
        lista,
        nuevos: lista.filter((r) => !existentes.has(r._id)).length,
        porManzana: contar(lista.map((r) => r.manzana)).sort((a, b) => comparar(a[0], b[0]))
      });
    } catch (e) {
      console.error(e);
      toast("No se pudo leer el archivo");
    }
  }

  async function confirmarImportacion() {
    await guardarVarios(importacion.lista);
    toast(`${importacion.lista.length} registros importados ✔`);
    setImportacion(null);
  }

  return (
    <>
      <PageHeader
        titulo="Registros guardados"
        subtitulo="Croquis, Matriz VTA y censo almacenados en este dispositivo"
      >
        <Boton
          variante="primario"
          icono={Plus}
          className="flex-1 sm:flex-none"
          onClick={() => setEditarCenso(nuevoCenso(vista.filtros.manzana))}
        >
          Nuevo árbol
        </Boton>
        <BarraHerramientas
          
          onImportarExcel={importarExcel}
          
        />
      </PageHeader>

      <FiltrosRegistros
        filtros={vista.filtros}
        setFiltro={vista.setFiltro}
        opciones={vista.opciones}
        onLimpiar={vista.limpiarFiltros}
      />

      <ContadorResultados
        inicio={vista.inicio}
        visibles={vista.visibles.length}
        filtrados={vista.filtrados.length}
        total={registros.length}
      />

      <ListaRegistros
        registros={vista.visibles}
        q={vista.q}
        acciones={acciones}
        vacio={
          registros.length
            ? "Ningún registro coincide con los filtros"
            : "Aún no hay registros guardados"
        }
      />

      <Paginacion
        pagina={vista.pagina}
        paginas={vista.paginas}
        onCambiar={(p) => {
          vista.setPagina(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

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
      <ModalImportacion
        importacion={importacion}
        onCancelar={() => setImportacion(null)}
        onConfirmar={confirmarImportacion}
      />
    </>
  );
}
