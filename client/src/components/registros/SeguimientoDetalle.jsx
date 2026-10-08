/* Ficha: estado del trabajo, lo que sigue, fechas, nota, fotos e historial */
import Pastilla from "../ui/Pastilla.jsx";
import { ESTADOS, claseEstado, nombreEstado, siguienteDe, terminado } from "../../config/seguimiento.js";
import { fechaHora } from "../../utils/registros.js";

const fecha = (f) => (f ? f.split("-").reverse().join("-") : "—");

export default function SeguimientoDetalle({ registro: r }) {
  const historial = [...(r.historial || [])].reverse();
  return (
    <section
      className={`mb-2 rounded-xl border p-4 ${terminado(r) ? "border-[#bfe3cc] bg-[#f6fbf8]" : "border-borde bg-c5"}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-bold tracking-wide text-c2 uppercase">Seguimiento</span>
        <Pastilla className={claseEstado(r)}>{nombreEstado(r)}</Pastilla>
        {terminado(r) && r.resultado && <Pastilla className="bg-white text-c1">{r.resultado}</Pastilla>}
        {siguienteDe(r) && <b className="text-[13.5px] text-[#17663a]">→ {siguienteDe(r)}</b>}
      </div>

      {(r.fecha_inicio || r.fecha_termino || r.nota_seguimiento) && (
        <div className="mt-2 text-[13.5px] text-[#2b4a63]">
          {r.fecha_inicio && <>Inicio: <b>{fecha(r.fecha_inicio)}</b> </>}
          {r.fecha_termino && <>· Término: <b>{fecha(r.fecha_termino)}</b></>}
          {r.nota_seguimiento && <p className="mt-1">{r.nota_seguimiento}</p>}
        </div>
      )}

      {r.fotos_seguimiento?.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {r.fotos_seguimiento.map((f, i) => (
            <figure key={i} className="overflow-hidden rounded-lg border border-borde bg-white">
              <img src={f.img} alt={f.nota || `Foto ${i + 1}`} className="w-full" />
              {f.nota && <figcaption className="px-2 py-1 text-[12px]">{f.nota}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      {historial.length > 0 && (
        <details className="mt-3 text-[13px]">
          <summary className="cursor-pointer font-semibold text-c2">Historial ({historial.length})</summary>
          <ul className="mt-2 flex flex-col gap-1.5">
            {historial.map((h, i) => (
              <li key={i} className="text-[#2b4a63]">
                <span className="text-suave">{fechaHora(h.fecha)}</span> ·{" "}
                <b>{ESTADOS[h.estado]?.nombre || h.estado}</b>
                {h.resultado && ` · ${h.resultado}`}
                {h.nota && <span className="text-suave"> — {h.nota}</span>}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
