/* =============================================================
   Botón reutilizable
   variante: primario | secundario | peligro | borrar
   tamano:   normal | sm
   icono:    componente de lucide-react (opcional)
   ============================================================= */
const VARIANTES = {
  primario: "btn-primario",
  secundario: "btn-secundario",
  peligro: "btn-peligro",
  borrar: "btn-borrar"
};

export default function Boton({
  variante = "secundario",
  tamano = "normal",
  icono: Icono,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={`btn ${VARIANTES[variante]} ${tamano === "sm" ? "btn-sm" : ""} ${className}`}
      {...props}
    >
      {Icono && <Icono size={tamano === "sm" ? 16 : 17} />}
      {children}
    </button>
  );
}

/** Mismo estilo que Boton, pero abre un selector de archivo */
export function BotonArchivo({
  variante = "secundario",
  icono: Icono,
  accept,
  onArchivo,
  className = "",
  children
}) {
  return (
    <label className={`btn btn-sm ${VARIANTES[variante]} ${className}`}>
      {Icono && <Icono size={16} />}
      {children}
      <input
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          e.target.value = "";
          if (archivo) onArchivo(archivo);
        }}
      />
    </label>
  );
}
