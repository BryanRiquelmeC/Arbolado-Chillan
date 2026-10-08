/* Dibujo del perfil transversal (se actualiza en vivo) */
import { useMemo } from "react";
import { croquisSvg } from "../../utils/croquis.js";

export default function DibujoCroquis({ datos }) {
  const svg = useMemo(() => croquisSvg(datos), [datos]);
  return (
    <div
      className="w-full rounded-xl border border-dashed border-c3 bg-white p-2 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
