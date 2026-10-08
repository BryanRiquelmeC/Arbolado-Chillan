/* Buscador y filtros de la página Registros */
import { X } from "lucide-react";
import Campo from "../form/Campo.jsx";
import { Lista } from "../form/Controles.jsx";
import Boton from "../ui/Boton.jsx";

export default function FiltrosRegistros({ filtros, setFiltro, opciones, onLimpiar }) {
  return (
    <section className="tarjeta grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Campo etiqueta="Buscar en todos los datos" className="col-span-full">
        <input
          type="search"
          className="campo"
          placeholder="Dirección, manzana, especie o código…"
          value={filtros.q}
          onChange={(e) => setFiltro("q", e.target.value)}
        />
      </Campo>

      <Campo etiqueta="Tipo">
        <select
          className="campo"
          value={filtros.tipo}
          onChange={(e) => setFiltro("tipo", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="croquis">Croquis perfil vial</option>
          <option value="encuesta">Matriz VTA</option>
          <option value="censo">Censo importado</option>
        </select>
      </Campo>

      <Campo etiqueta="Manzana">
        <Lista
          vacio="Todas"
          opciones={opciones.manzanas}
          valor={filtros.manzana}
          onCambiar={(v) => setFiltro("manzana", v)}
        />
      </Campo>

      <Campo etiqueta="Orden">
        <select
          className="campo"
          value={filtros.orden}
          onChange={(e) => setFiltro("orden", e.target.value)}
        >
          <option value="new">Más recientes</option>
          <option value="old">Más antiguos</option>
          <option value="dir">Dirección A–Z</option>
          <option value="mz">Manzana</option>
        </select>
      </Campo>

      <div className="flex items-end">
        <Boton tamano="sm" icono={X} className="w-full py-2.75" onClick={onLimpiar}>
          Limpiar filtros
        </Boton>
      </div>
    </section>
  );
}