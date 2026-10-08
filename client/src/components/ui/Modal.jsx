/* Ventana modal reutilizable (detalle, importación, confirmación) */
import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  abierto,
  titulo,
  subtitulo,
  onCerrar,
  pie,
  angosto = false,
  ancho = "",
  children
}) {
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(11,40,64,.45)] p-4"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`flex max-h-[92vh] w-full flex-col rounded-2xl bg-white shadow-2xl ${ancho || (angosto ? "max-w-md" : "max-w-3xl")}`}
      >
        <header
          className={`flex justify-between gap-3 px-6 py-5 ${angosto ? "" : "border-b-2 border-c4"}`}
        >
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-c1">{titulo}</h3>
            {subtitulo && <p className="mt-0.5 text-[13.5px] text-suave">{subtitulo}</p>}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex size-9 flex-none items-center justify-center rounded-lg border border-borde bg-c5 text-c1 hover:bg-c4"
          >
            <X size={18} />
          </button>
        </header>
        <div className="overflow-auto px-6 pb-4">{children}</div>
        {pie && (
          <footer
            className={`flex flex-wrap justify-end gap-2 px-6 py-4 ${angosto ? "" : "border-t border-borde"}`}
          >
            {pie}
          </footer>
        )}
      </div>
    </div>
  );
}
