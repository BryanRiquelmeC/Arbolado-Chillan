/* Acceso a un módulo desde el inicio: horizontal en móvil, vertical desde tablet */
import { Link } from "react-router-dom";

export default function TarjetaModulo({ a, icono: Icono, titulo, texto }) {
  return (
    <Link
      to={a}
      className="group flex h-full items-start gap-4 rounded-2xl border border-borde bg-white p-5 shadow-sm transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-c2/30 hover:shadow-[0_8px_18px_-8px_rgba(11,92,143,0.18)] md:flex-col md:items-center md:px-6 md:py-7 md:text-center"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-c4 text-c2 transition-colors group-hover:bg-c2 group-hover:text-white md:size-14">
        <Icono size={26} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col md:items-center">
        <h4 className="mb-1.5 font-bold text-c1">{titulo}</h4>
        <p className="text-[13.5px] leading-relaxed text-suave">{texto}</p>
      </div>
    </Link>
  );
}