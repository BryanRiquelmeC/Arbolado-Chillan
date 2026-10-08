/* Encabezado de cada página: título, subtítulo y acciones a la derecha */
export default function PageHeader({ titulo, subtitulo, children }) {
  return (
    <header className="mb-7 flex flex-col gap-4 border-b border-borde pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h2 className="text-[22px] font-bold tracking-tight wrap-break-word text-[#0f3d5e] sm:text-[26px]">
          {titulo}
        </h2>
        {subtitulo && <p className="mt-1 text-[14.5px] text-suave">{subtitulo}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </header>
  );
}
