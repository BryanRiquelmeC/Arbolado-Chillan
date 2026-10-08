/* Resalta en amarillo el texto buscado */
export default function Resaltar({ texto, q }) {
  const t = texto || "—";
  const i = q ? t.toLowerCase().indexOf(q) : -1;
  if (i < 0) return t;
  return (
    <>
      {t.slice(0, i)}
      <mark className="rounded bg-[#fff1a8] px-0.5">{t.slice(i, i + q.length)}</mark>
      {t.slice(i + q.length)}
    </>
  );
}
