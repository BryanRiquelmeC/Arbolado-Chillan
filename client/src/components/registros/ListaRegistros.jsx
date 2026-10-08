/* Lista de registros: tabla en escritorio, tarjetas en tablet y teléfono */
import Vacio from "../ui/Vacio.jsx";
import TablaRegistros from "./TablaRegistros.jsx";
import TarjetaRegistro from "./TarjetaRegistro.jsx";

export default function ListaRegistros({ registros, q, vacio, acciones }) {
  if (!registros.length) return <Vacio>{vacio}</Vacio>;

  return (
    <>
      <TablaRegistros registros={registros} q={q} acciones={acciones} />
      <div className="flex flex-col gap-3 lg:hidden">
        {registros.map((r) => (
          <TarjetaRegistro key={r._id} r={r} q={q} acciones={acciones} />
        ))}
      </div>
    </>
  );
}
