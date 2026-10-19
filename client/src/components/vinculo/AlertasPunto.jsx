/* Avisos cuando el croquis y la Matriz VTA del mismo punto no coinciden */
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function AlertasPunto({ alertas, mostrarOk = false }) {
  if (!alertas.length) {
    return mostrarOk ? (
      <p className="flex items-center gap-2 text-[13.5px] font-semibold text-[#17663a]">
        <CheckCircle2 size={17} /> Croquis y Matriz coinciden: sin observaciones.
      </p>
    ) : null;
  }
  return (
    <ul className="flex flex-col gap-1.5 rounded-xl border border-[#f2d28b] bg-[#fff8e6] px-4 py-3">
      {alertas.map((a) => (
        <li key={a} className="flex items-start gap-2 text-[13.5px] text-[#7a5300]">
          <AlertTriangle size={17} className="mt-0.5 flex-none" />
          {a}
        </li>
      ))}
    </ul>
  );
}
