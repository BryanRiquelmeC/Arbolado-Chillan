/* Registros en tabla (pantallas grandes) */
import AccionesRegistro from "./AccionesRegistro.jsx";
import Resaltar from "./Resaltar.jsx";
import { DetalleBreve, DireccionRegistro, TipoRegistro } from "./CeldasRegistro.jsx";
import { fechaHora, manzanaDe } from "../../utils/registros.js";

const COLUMNAS = ["Fecha", "Tipo", "Dirección", "Manzana", "Detalle"];

export default function TablaRegistros({ registros, q, acciones }) {
  return (
    <div className="tarjeta hidden overflow-hidden p-0 sm:p-0 lg:block">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-c4 text-left text-xs tracking-wide text-c1 uppercase">
            {COLUMNAS.map((h) => (
              <th key={h} className="px-4 py-3.5">
                {h}
              </th>
            ))}
            <th className="px-4 py-3.5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <tr key={r._id} className="border-b border-borde last:border-0 hover:bg-c5">
              <td className="px-4 py-3.5">{fechaHora(r._actualizado || r._creado)}</td>
              <td className="px-4 py-3.5">
                <TipoRegistro r={r} />
              </td>
              <td className="px-4 py-3.5">
                <DireccionRegistro r={r} q={q} />
              </td>
              <td className="px-4 py-3.5">
                <Resaltar texto={manzanaDe(r)} q={q} />
              </td>
              <td className="px-4 py-3.5 text-[13px] text-[#2b4a63]">
                <DetalleBreve r={r} q={q} />
              </td>
              <td className="px-4 py-3.5">
                <AccionesRegistro r={r} {...acciones} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
