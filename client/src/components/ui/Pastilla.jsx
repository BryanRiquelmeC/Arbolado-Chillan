/* Etiqueta redondeada pequeña (tipo de registro, especie, urgencia)
   envolver: el texto largo baja a otra línea en vez de cortarse (queda dentro de la tarjeta) */
export default function Pastilla({ className = "bg-c4 text-c1", envolver = false, children }) {
  const ajuste = envolver
    ? "max-w-full whitespace-normal break-words rounded-xl text-left leading-snug"
    : "whitespace-nowrap";
  return <span className={`pastilla ${ajuste} ${className}`}>{children}</span>;
}
