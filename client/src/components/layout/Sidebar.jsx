/* Menú lateral: marca, navegación y cerrar sesión */
import { ClipboardList, Folder, House, LayoutGrid, LogOut, Ruler } from "lucide-react";
import MarcaApp from "./MarcaApp.jsx";
import ItemMenu from "./ItemMenu.jsx";
import { sesion } from "../../services/api.js";

export const MENU = [
  { a: "/", icono: House, titulo: "Inicio", sub: "Resumen general" },
  { a: "/croquis", icono: Ruler, titulo: "Croquis", sub: "Extracción y plantación" },
  {
    a: "/matriz-vta",
    icono: ClipboardList,
    titulo: "Matriz VTA",
    sub: "Evaluación visual del árbol"
  },
  { a: "/manzanas", icono: LayoutGrid, titulo: "Manzanas", sub: "Árboles por manzana" },
  { a: "/registros", icono: Folder, titulo: "Registros", sub: "Gestión y reportes" }
];

export default function Sidebar({ abierto, onCerrar }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-70 flex-col overflow-y-auto border-r border-borde bg-white px-3.5 py-5 transition-[translate,box-shadow] duration-300 ease-out lg:w-62.5 lg:translate-x-0 lg:shadow-[2px_0_14px_rgba(11,92,143,.05)] ${
        abierto
          ? "translate-x-0 shadow-[6px_0_30px_rgba(11,40,64,.18)]"
          : "-translate-x-full shadow-none"
      }`}
    >
      <MarcaApp onCerrar={onCerrar} />

      <nav className="flex flex-col gap-1.5">
        {MENU.map((item) => (
          <ItemMenu key={item.a} {...item} onClick={onCerrar} />
        ))}
      </nav>
      
      <button
        type="button"
        onClick={sesion.cerrar}
        className="mt-auto flex cursor-pointer items-center gap-3 rounded-xl border border-[#fde2e2] bg-[#fff1f1] px-3.5 py-3 text-[15px] font-semibold text-[#d92d20] shadow-sm transition hover:bg-[#ffe4e4]"
      >
        <LogOut size={20} strokeWidth={2.4} /> Cerrar sesión
      </button>

      <p className="mt-3 text-center text-[12px] text-suave">
        by <b className="font-semibold text-tinta">Victor Bryan Riquelme Cabrera</b>
      </p>
    </aside>
  );
}