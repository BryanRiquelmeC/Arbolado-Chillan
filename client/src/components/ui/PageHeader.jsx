/* Encabezado de cada página: Volver, título, subtítulo y acciones a la derecha */
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

/** ← Volver: a la pantalla anterior; si se entró directo, al Panel principal */
function BotonVolver() {
  const navegar = useNavigate();
  // React Router numera cada pantalla visitada (idx). Si hay una anterior
  // dentro de la app, vuelve exactamente a ella; si no, al Panel principal.
  const hayAnterior = (window.history.state?.idx ?? 0) > 0;
  return (
    <button
      type="button"
      onClick={() => (hayAnterior ? navegar(-1) : navegar("/"))}
      className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-c2 bg-white px-4 py-2 text-[15px] font-bold text-c2 shadow-sm transition-colors hover:bg-c2 hover:text-white active:scale-[.98]"
    >
      <ArrowLeft size={20} strokeWidth={2.5} />
      Volver
    </button>
  );
}

export default function PageHeader({ titulo, subtitulo, children, volver }) {
  const { pathname } = useLocation();
  const mostrarVolver = volver ?? pathname !== "/"; // en el Panel principal no hace falta

  return (
    <header className="mb-7 border-b border-borde pb-5">
      {mostrarVolver && <BotonVolver />}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-[22px] font-bold tracking-tight break-words text-[#0f3d5e] sm:text-[26px]">
            {titulo}
          </h2>
          {subtitulo && <p className="mt-1 text-[14.5px] text-suave">{subtitulo}</p>}
        </div>
        {children && <div className="flex flex-wrap gap-2">{children}</div>}
      </div>
    </header>
  );
}
