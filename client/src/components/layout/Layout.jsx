/* Estructura general: menú lateral + fondo oscuro (móvil) + contenido */
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import BotonMenu from "./BotonMenu.jsx";

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname } = useLocation();
  const cerrar = () => setMenuAbierto(false);

  // Al cambiar de página: cerrar menú y volver arriba
  useEffect(() => {
    setMenuAbierto(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  // Con el menú abierto: bloquear scroll del fondo y cerrar con Esc
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    const tecla = (e) => e.key === "Escape" && setMenuAbierto(false);
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [menuAbierto]);

  return (
    <div className="min-h-screen">
      <Sidebar abierto={menuAbierto} onCerrar={cerrar} />

      <div
        onClick={cerrar}
        className={`fixed inset-0 z-30 bg-[rgba(11,40,64,.35)] transition-opacity lg:hidden ${
          menuAbierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <BotonMenu onClick={() => setMenuAbierto((v) => !v)} />

      <main className="px-4 pt-20 pb-16 sm:px-6 lg:ml-62.5 lg:pr-10 lg:pl-0 lg:pt-10 2xl:pr-14 2xl:pl-0">
        <div className="mx-auto w-full max-w-295 min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}