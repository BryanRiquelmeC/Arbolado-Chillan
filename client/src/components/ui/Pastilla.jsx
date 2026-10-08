/* Etiqueta redondeada pequeña (tipo de registro, especie, urgencia) */
export default function Pastilla({ className = "bg-c4 text-c1", children }) {
  return <span className={`pastilla whitespace-nowrap ${className}`}>{children}</span>;
}
