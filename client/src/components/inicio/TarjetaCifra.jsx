/* Cifra destacada del inicio (p. ej. "309 Registros totales") */
export default function TarjetaCifra({ valor, texto, destacada = false, className = "" }) {
  return (
    <div
      className={`flex flex-col justify-center rounded-2xl border border-borde border-t-4 px-4 py-4 text-center shadow-sm sm:py-5 ${
        destacada ? "border-t-c1 bg-linear-to-br from-c1 to-c2 text-white" : "border-t-c2 bg-white"
      } ${className}`}
    >
      <b
        className={`block text-[28px] leading-tight tracking-tight tabular-nums sm:text-[32px] ${
          destacada ? "text-white" : "text-c1"
        }`}
      >
        {Number(valor).toLocaleString("es-CL")}
      </b>
      <span className={`mt-1 block text-[13px] leading-snug ${destacada ? "text-white/85" : "text-suave"}`}>
        {texto}
      </span>
    </div>
  );
}
