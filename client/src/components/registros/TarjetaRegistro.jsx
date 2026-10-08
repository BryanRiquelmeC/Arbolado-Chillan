/* Un registro como tarjeta (tablet y teléfono) */
import AccionesRegistro from "./AccionesRegistro.jsx";
import Resaltar from "./Resaltar.jsx";
import { DetalleBreve, DireccionRegistro, TipoRegistro } from "./CeldasRegistro.jsx";
import { fechaHora, manzanaDe } from "../../utils/registros.js";

function Dato({ etiqueta, ancho, children }) {
  return (
    <div className={`min-w-0 wrap-break-word ${ancho ? "sm:col-span-2" : ""}`}>
      <p className="text-[11.5px] font-bold tracking-wide text-suave uppercase">{etiqueta}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export default function TarjetaRegistro({ r, q, acciones }) {
  return (
    <article className="grid grid-cols-1 gap-3 rounded-2xl border border-borde bg-white p-4 shadow-sm sm:grid-cols-2">
      <Dato etiqueta="Fecha">{fechaHora(r._actualizado || r._creado)}</Dato>
      <Dato etiqueta="Tipo">
        <TipoRegistro r={r} />
      </Dato>
      <Dato etiqueta="Dirección" ancho>
        <DireccionRegistro r={r} q={q} />
      </Dato>
      <Dato etiqueta="Manzana">
        <Resaltar texto={manzanaDe(r)} q={q} />
      </Dato>
      <Dato etiqueta="Detalle" ancho>
        <DetalleBreve r={r} q={q} />
      </Dato>
      <div className="border-t border-[#edf2f7] pt-3 sm:col-span-2">
        <AccionesRegistro r={r} {...acciones} />
      </div>
    </article>
  );
}
