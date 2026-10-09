/* Un registro como tarjeta (tablet y teléfono) */
import AccionesRegistro from "./AccionesRegistro.jsx";
import Resaltar from "./Resaltar.jsx";
import { DetalleBreve, DireccionRegistro, EstadoRegistro, TipoRegistro } from "./CeldasRegistro.jsx";
import { terminado } from "../../config/seguimiento.js";
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
    <article className={`grid grid-cols-1 gap-3 rounded-2xl border p-4 shadow-sm sm:grid-cols-2 ${terminado(r) ? "border-[#bfe3cc] bg-[#f6fbf8]" : "border-borde bg-white"}`}>
      <Dato etiqueta="Fecha">{fechaHora(r._actualizado || r._creado)}</Dato>
      <Dato etiqueta="Tipo">
        <TipoRegistro r={r} />
      </Dato>
      <Dato etiqueta="Dirección" ancho>
        <div className={terminado(r) ? "text-suave line-through decoration-[#17663a]/60" : ""}>
          <DireccionRegistro r={r} q={q} />
        </div>
      </Dato>
      <Dato etiqueta="Manzana">
        <Resaltar texto={manzanaDe(r)} q={q} />
      </Dato>
      <Dato etiqueta="Detalle">
        <div className={terminado(r) ? "opacity-60" : ""}>
          <DetalleBreve r={r} q={q} />
        </div>
      </Dato>
      <Dato etiqueta="Estado">
        <EstadoRegistro r={r} onClick={acciones.onEstado} />
      </Dato>
      <div className="border-t border-[#edf2f7] pt-3 sm:col-span-2">
        <AccionesRegistro r={r} {...acciones} />
      </div>
    </article>
  );
}
