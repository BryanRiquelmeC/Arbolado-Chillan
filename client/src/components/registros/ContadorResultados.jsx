/* "Mostrando 21–40 de 309" */
export default function ContadorResultados({ inicio, visibles, filtrados, total }) {
  return (
    <p className="mb-3 ml-1 text-[13.5px] text-suave">
      {filtrados
        ? `Mostrando ${inicio + 1}–${inicio + visibles} de ${filtrados} (total guardados: ${total})`
        : `0 de ${total} registros`}
    </p>
  );
}
