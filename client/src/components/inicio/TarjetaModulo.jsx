/* Acceso a un módulo desde el inicio */
import { Link } from "react-router-dom";

export default function TarjetaModulo({ a, icono: Icono, titulo, texto }) {
  return (
    <Link
      to={a}
      className="flex flex-col items-center rounded-2xl border border-borde bg-white px-6 py-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-c2"
    >
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-c4 text-c2">
        <Icono size={26} />
      </span>
      <h4 className="mb-2 font-bold text-c1">{titulo}</h4>
      <p className="text-[13.5px] leading-relaxed text-suave">{texto}</p>
    </Link>
  );
}
