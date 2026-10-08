/* Avance del trabajo en una manzana: terminados / en proceso / pendientes */
import { estadoDe, siguienteDe } from "../../config/seguimiento.js";

export default function BarraAvance({ registros, detalle = false }) {
  const total = registros.length || 1;
  const n = { pendiente: 0, proceso: 0, terminado: 0 };
  registros.forEach((r) => n[estadoDe(r)]++);
  const plantar = registros.filter((r) => siguienteDe(r) === "Listo para plantar").length;
  const destoconar = registros.filter((r) => siguienteDe(r) === "Listo para destoconar").length;
  const pct = (x) => `${(x / total) * 100}%`;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-[12.5px]">
        <span className="font-semibold text-c1">
          {n.terminado} de {registros.length} terminados
        </span>
        <span className="text-suave">{Math.round((n.terminado / total) * 100)}%</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-[#eef1f4]">
        <div className="bg-[#2e9d5b] transition-[width]" style={{ width: pct(n.terminado) }} />
        <div className="bg-[#f2c230] transition-[width]" style={{ width: pct(n.proceso) }} />
      </div>
      {detalle && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-suave">
          <span><i className="mr-1 inline-block size-2 rounded-full bg-[#2e9d5b]" />Terminados {n.terminado}</span>
          <span><i className="mr-1 inline-block size-2 rounded-full bg-[#f2c230]" />En proceso {n.proceso}</span>
          <span><i className="mr-1 inline-block size-2 rounded-full bg-[#cfd6dd]" />Pendientes {n.pendiente}</span>
          {destoconar > 0 && <span className="font-semibold text-[#17663a]">Listos para destoconar {destoconar}</span>}
          {plantar > 0 && <span className="font-semibold text-[#17663a]">Listos para plantar {plantar}</span>}
        </div>
      )}
    </div>
  );
}
