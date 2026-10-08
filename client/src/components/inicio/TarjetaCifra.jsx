/* Cifra destacada del inicio (p. ej. "309 Registros totales") */
export default function TarjetaCifra({ valor, texto }) {
  return (
    <div className="rounded-2xl border border-borde border-t-4 border-t-c2 bg-white px-4 py-5 text-center shadow-sm">
      <b className="block text-[32px] leading-tight tracking-tight text-c1">{valor}</b>
      <span className="mt-1 block text-[13px] text-suave">{texto}</span>
    </div>
  );
}
