/* Manzana abierta: resumen + buscador, filtros, registros paginados (20)
   y acciones PDF · Ver · Editar · Eliminar en cada uno */
import { FileDown, X } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Boton from "../ui/Boton.jsx";
import Campo from "../form/Campo.jsx";
import Pastilla from "../ui/Pastilla.jsx";
import BarraAvance from "./BarraAvance.jsx";
import Paginacion from "../ui/Paginacion.jsx";
import ListaRegistros from "../registros/ListaRegistros.jsx";
import ContadorResultados from "../registros/ContadorResultados.jsx";
import { useFiltrosRegistros } from "../../hooks/useFiltrosRegistros.js";
import { TIPOS, claseUrgencia, contar, especieDe, urgenciaDe } from "../../utils/registros.js";

function Bloque({ titulo, children }) {
  return (
    <section className="mt-5">
      <h4 className="mb-2 text-[13px] font-bold tracking-wide text-c2 uppercase">{titulo}</h4>
      {children}
    </section>
  );
}

export default function ModalInformeManzana({ manzana, registros, acciones, onCerrar, onDescargar }) {
  const vista = useFiltrosRegistros(registros);
  const { filtros, setFiltro } = vista;

  const porTipo = Object.entries(TIPOS)
    .map(([k, t]) => [t, registros.filter((r) => r._tipo === k).length])
    .filter(([, n]) => n);

  return (
    <Modal
      abierto
      ancho="max-w-6xl"
      titulo={`Manzana ${manzana}`}
      subtitulo={`${registros.length} registro${registros.length === 1 ? "" : "s"}`}
      onCerrar={onCerrar}
      pie={
        <>
          <Boton onClick={onCerrar}>Cerrar</Boton>
          <Boton variante="primario" icono={FileDown} onClick={onDescargar} disabled={!registros.length}>
            Informe PDF de la manzana
          </Boton>
        </>
      }
    >
      {/* Avance del trabajo */}
      <div className="rounded-xl border border-borde bg-white p-4">
        <BarraAvance registros={registros} detalle />
      </div>

      {/* Resumen */}
      <div className="grid gap-x-8 sm:grid-cols-2">
        <div>
          <Bloque titulo="Tipo">
            <div className="flex flex-wrap gap-1.5">
              {porTipo.map(([t, n]) => (
                <Pastilla key={t.nombre} className={t.clase}>
                  {t.nombre} {n}
                </Pastilla>
              ))}
            </div>
          </Bloque>
          <Bloque titulo="Urgencia de intervención">
            <div className="flex flex-wrap gap-1.5">
              {contar(registros.map(urgenciaDe)).map(([u, c]) => (
                <Pastilla key={u} className={claseUrgencia(u)}>
                  {u} · {c}
                </Pastilla>
              ))}
            </div>
          </Bloque>
        </div>
        <Bloque titulo="Especies">
          <div className="flex flex-wrap gap-1.5">
            {contar(registros.map(especieDe)).map(([e, c]) => (
              <Pastilla key={e}>
                {e} · {c}
              </Pastilla>
            ))}
          </div>
        </Bloque>
      </div>

      {/* Buscador y filtros */}
      <section className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-borde bg-c5 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.3fr_1.2fr_1fr_auto]">
        <Campo etiqueta="Buscar">
          <input
            type="search"
            className="campo"
            placeholder="Dirección, especie, urgencia o código…"
            value={filtros.q}
            onChange={(e) => setFiltro("q", e.target.value)}
          />
        </Campo>
        <Campo etiqueta="Tipo">
          <select className="campo" value={filtros.tipo} onChange={(e) => setFiltro("tipo", e.target.value)}>
            <option value="">Todos</option>
            <option value="croquis">Extracción y plantación</option>
            <option value="encuesta">Matriz VTA</option>
            <option value="censo">Censo</option>
          </select>
        </Campo>
        <Campo etiqueta="Urgencia">
          <select className="campo" value={filtros.urgencia} onChange={(e) => setFiltro("urgencia", e.target.value)}>
            <option value="">Todas</option>
            {vista.opciones.urgencias.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Estado">
          <select className="campo" value={filtros.estado} onChange={(e) => setFiltro("estado", e.target.value)}>
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="proceso">En proceso</option>
            <option value="terminado">Terminado</option>
            <option value="sigue:Listo para destoconar">→ Listo para destoconar</option>
            <option value="sigue:Listo para plantar">→ Listo para plantar</option>
          </select>
        </Campo>
        <Campo etiqueta="Orden">
          <select className="campo" value={filtros.orden} onChange={(e) => setFiltro("orden", e.target.value)}>
            <option value="new">Más recientes</option>
            <option value="old">Más antiguos</option>
            <option value="dir">Dirección A-Z</option>
          </select>
        </Campo>
        <div className="flex items-end">
          <Boton tamano="sm" icono={X} className="w-full py-2.75" onClick={vista.limpiarFiltros}>
            Limpiar
          </Boton>
        </div>
      </section>

      {/* Registros paginados */}
      <div className="mt-4">
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
          vacio={registros.length ? "Ningún registro coincide" : "Esta manzana no tiene registros"}
        />
        <Paginacion pagina={vista.pagina} paginas={vista.paginas} onCambiar={vista.setPagina} />
      </div>
    </Modal>
  );
}
