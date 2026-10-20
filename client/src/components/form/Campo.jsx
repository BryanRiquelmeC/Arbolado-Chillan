/* Contenedor de un campo: etiqueta + control + ayuda opcional */
export default function Campo({
  etiqueta,
  requerido,
  ayuda,
  ancho = false,
  accion,
  campo, // clave del dato: permite ir a este campo cuando falta completarlo
  className = "",
  children
}) {
  return (
    <div
      data-campo={campo}
      className={`flex min-w-0 scroll-mt-24 flex-col gap-2 rounded-xl ${ancho ? "col-span-full" : ""} ${className}`}
    >
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
