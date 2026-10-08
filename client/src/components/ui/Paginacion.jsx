/* Paginación con primera, anterior, números, siguiente y última */
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

function Boton({ a, deshabilitado, activo, children, etiqueta, onCambiar }) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      disabled={deshabilitado}
      onClick={() => onCambiar(a)}
      className={`inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-[9px] border-[1.5px] px-3 text-[14.5px] font-semibold transition disabled:cursor-default disabled:opacity-40 ${
        activo
          ? "border-c2 bg-c2 text-white"
          : "border-[#cfe3f2] bg-white text-c1 hover:enabled:border-c2 hover:enabled:bg-c4"
      }`}
    >
      {children}
    </button>
  );
}

export default function Paginacion({ pagina, paginas, onCambiar }) {
  if (paginas <= 1) return null;
  const desde = Math.max(1, Math.min(pagina - 2, paginas - 4));
  const numeros = Array.from({ length: Math.min(5, paginas) }, (_, i) => desde + i);

  return (
    <nav aria-label="Paginación" className="my-5 flex flex-wrap items-center justify-center gap-2">
      <Boton onCambiar={onCambiar} a={1} deshabilitado={pagina === 1} etiqueta="Primera página">
        <ChevronsLeft size={17} />
      </Boton>
      <Boton onCambiar={onCambiar} a={pagina - 1} deshabilitado={pagina === 1} etiqueta="Anterior">
        <ChevronLeft size={17} />
        <span className="hidden sm:inline">Anterior</span>
      </Boton>
      {numeros.map((n) => (
        <Boton onCambiar={onCambiar} key={n} a={n} activo={n === pagina}>
          {n}
        </Boton>
      ))}
      <Boton
        onCambiar={onCambiar}
        a={pagina + 1}
        deshabilitado={pagina === paginas}
        etiqueta="Siguiente"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight size={17} />
      </Boton>
      <Boton
        onCambiar={onCambiar}
        a={paginas}
        deshabilitado={pagina === paginas}
        etiqueta="Última página"
      >
        <ChevronsRight size={17} />
      </Boton>
      <span className="w-full text-center text-[13.5px] text-suave sm:ml-2 sm:w-auto">
        Página {pagina} de {paginas}
      </span>
    </nav>
  );
}
