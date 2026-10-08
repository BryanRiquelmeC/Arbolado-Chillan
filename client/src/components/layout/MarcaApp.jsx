/* Logo y nombre de la app (parte superior del menú) */
import { TreeDeciduous, X } from "lucide-react";

export default function MarcaApp({ onCerrar }) {
  return (
    <div className="relative mb-2 flex flex-col items-center gap-3 border-b border-[#edf2f7] px-2 pt-2 pb-5 text-center">
      {/* Ícono grande */}
      <span className="flex size-22 items-center justify-center rounded-2xl bg-linear-to-br from-c1 to-c2 text-white shadow-md">
        <TreeDeciduous size={44} />
      </span>

      {/* Nombre y descripción */}
      <div>
        <h1 className="text-xl leading-tight font-bold text-[#1d2833]">Arbolado Chillán</h1>
        <p className="mt-1 text-[15px] text-[#4a5a6a]">Plataforma de análisis</p>
      </div>

      {/* X para cerrar el menú (solo tablet y teléfono), en la esquina */}
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar menú"
        className="absolute top-0 right-0 flex size-12 items-center justify-center rounded-xl border border-[#cfe3f2] bg-white text-c1 shadow-sm lg:hidden"
      >
        <X size={26} strokeWidth={2.4} />
      </button>
    </div>
  );
}