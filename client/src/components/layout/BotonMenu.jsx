/* Botón hamburguesa fijo (tablet y teléfono): siempre visible al hacer scroll */
import { Menu } from "lucide-react";

export default function BotonMenu({ onClick }) {
  return (
    <button
      type="button"
      aria-label="Abrir menú"
      onClick={onClick}
      className="fixed top-3.5 left-3.5 z-20 flex size-12 items-center justify-center rounded-xl bg-c1 text-white shadow-[0_4px_14px_rgba(11,61,94,.25)] lg:hidden"
    >
      <Menu size={24} />
    </button>
  );
}
