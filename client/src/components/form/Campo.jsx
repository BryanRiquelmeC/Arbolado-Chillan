/* Contenedor de un campo: etiqueta + control + ayuda opcional */
export default function Campo({
  etiqueta,
  requerido,
  ayuda,
  ancho = false,
  accion,
  className = "",
  children
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${ancho ? "col-span-full" : ""} ${className}`}>
      {(etiqueta || accion) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {etiqueta && (
            <span className="etiqueta">
              {etiqueta} {requerido && <span className="text-peligro">*</span>}
            </span>
          )}
          {accion}
        </div>
      )}
      {ayuda && <p className="rounded-lg bg-c4 px-3 py-2 text-[14px] text-[#2b4a63]">{ayuda}</p>}
      {children}
    </div>
  );
}
