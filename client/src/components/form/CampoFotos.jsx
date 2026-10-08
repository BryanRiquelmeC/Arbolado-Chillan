/* Varias fotografías opcionales (cámara o galería), cada una con descripción */
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { comprimir } from "./CampoFoto.jsx";

export default function CampoFotos({ valor = [], onCambiar, sugerencia = "" }) {
  const fotos = Array.isArray(valor) ? valor : [];

  async function agregar(archivos) {
    const nuevas = [];
    for (const f of archivos) {
      nuevas.push({ img: await comprimir(f), nota: sugerencia, fecha: new Date().toISOString() });
    }
    onCambiar([...fotos, ...nuevas]);
  }

  const cambiarNota = (i, nota) => onCambiar(fotos.map((f, j) => (j === i ? { ...f, nota } : f)));
  const quitar = (i) => onCambiar(fotos.filter((_, j) => j !== i));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <label className="btn btn-secundario btn-sm cursor-pointer">
          <Camera size={16} /> Tomar foto
          <input
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={async (e) => {
              if (e.target.files?.length) await agregar([...e.target.files]);
              e.target.value = "";
            }}
          />
        </label>
        <label className="btn btn-secundario btn-sm cursor-pointer">
          <ImagePlus size={16} /> Añadir desde galería
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={async (e) => {
              if (e.target.files?.length) await agregar([...e.target.files]);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {fotos.length === 0 && (
        <p className="text-[13px] text-suave">Sin fotografías. Agregue solo si es necesario.</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fotos.map((f, i) => (
          <figure key={i} className="overflow-hidden rounded-xl border border-borde bg-white">
            <div className="relative">
              <img src={f.img} alt={f.nota || `Fotografía ${i + 1}`} className="h-44 w-full object-cover" />
              <button
                type="button"
                onClick={() => quitar(i)}
                aria-label="Quitar fotografía"
                className="absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white/90 text-peligro shadow"
              >
                <Trash2 size={17} />
              </button>
            </div>
            <input
              className="campo rounded-none border-0 border-t"
              value={f.nota ?? ""}
              onChange={(e) => cambiarNota(i, e.target.value)}
              placeholder="Descripción (ej: grieta en el fuste)"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
