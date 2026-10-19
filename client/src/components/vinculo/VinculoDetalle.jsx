/* Ficha: con qué registro está vinculado y avisos del punto */
import { Link2 } from "lucide-react";
import AlertasPunto from "./AlertasPunto.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { alertasPunto, puntoDe } from "../../utils/vinculo.js";
import { tituloDe } from "../../utils/registros.js";

export default function VinculoDetalle({ registro, onVer }) {
  const { registros } = useApp();
  if (!["croquis", "encuesta"].includes(registro._tipo)) return null;
  const { croquis, matriz } = puntoDe(registro, registros);
  const otro = registro._tipo === "croquis" ? matriz : croquis;
  if (!otro) return null;
  return (
    <section className="mb-2 flex flex-col gap-2 rounded-xl border border-borde bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 text-[13.5px] text-c1">
        <Link2 size={17} className="text-c2" />
        <b>Vinculado con {otro._tipo === "croquis" ? "el croquis" : "la Matriz VTA"}:</b> {tituloDe(otro)}
        {onVer && (
          <button type="button" onClick={() => onVer(otro)} className="cursor-pointer font-bold text-c2 underline">
            Ver
          </button>
        )}
      </div>
      <AlertasPunto alertas={alertasPunto(croquis, matriz)} />
    </section>
  );
}
