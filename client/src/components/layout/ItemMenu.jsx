/* Opción del menú lateral: ícono + título + descripción */
import { NavLink } from "react-router-dom";

export default function ItemMenu({ a, icono: Icono, titulo, sub, onClick }) {
  return (
    <NavLink
      to={a}
      end={a === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-start gap-3.5 rounded-xl border px-3.5 py-3 transition ${
          isActive ? "border-[#bfdcf7] bg-[#eef6ff]" : "border-transparent hover:bg-[#f5f9fd]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icono
            size={22}
            className={`mt-px flex-none ${isActive ? "text-c1" : "text-[#6b7c8c]"}`}
          />
          <span className="flex flex-col">
            <b className={`text-[14px] font-semibold ${isActive ? "text-c1" : "text-[#1d2833]"}`}>{titulo}</b>
            <small className={`text-[12.5px] ${isActive ? "text-c2" : "text-[#6b7c8c]"}`}>
              {sub}
            </small>
          </span>
        </>
      )}
    </NavLink>
  );
}
