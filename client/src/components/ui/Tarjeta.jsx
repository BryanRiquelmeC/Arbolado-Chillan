/* Tarjeta blanca con título e ícono */
export default function Tarjeta({ icono: Icono, titulo, children, className = "", id }) {
  return (
    <section id={id} className={`tarjeta scroll-mt-6 ${className}`}>
      {titulo && (
        <h3 className="tarjeta-titulo">
          {Icono && <Icono size={20} className="text-c2" />}
          {titulo}
        </h3>
      )}
      {children}
    </section>
  );
}
