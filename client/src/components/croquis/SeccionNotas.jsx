/* Croquis · Notas de campo y fotografías opcionales */
import { NotebookPen } from "lucide-react";
import Tarjeta from "../ui/Tarjeta.jsx";
import CampoFotos from "../form/CampoFotos.jsx";

export default function SeccionNotas({ d, set }) {
  return (
    <Tarjeta icono={NotebookPen} titulo="Notas de campo / observaciones">
      <textarea
        className="campo min-h-24 resize-y"
        placeholder="Observaciones adicionales…"
        value={d.notas ?? ""}
        onChange={(e) => set("notas", e.target.value)}
      />
      <h3 className="mt-5 mb-3 text-sm font-bold text-c1">
        Fotografías (opcional{d.fotos?.length ? ` · ${d.fotos.length}` : ""})
      </h3>
      <CampoFotos
        valor={d.fotos}
        onCambiar={(v) => set("fotos", v)}
        sugerencia={[d.manzana && `Manzana ${d.manzana}`, d.direccion].filter(Boolean).join(" · ")}
      />
    </Tarjeta>
  );
}