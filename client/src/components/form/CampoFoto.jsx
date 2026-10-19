/* Foto desde la cámara o galería; se comprime antes de guardarla */
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { urlFoto } from "../../utils/rutas.js";

const LADO_MAXIMO = 900;
const CALIDAD = 0.65;

export function comprimir(archivo) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, LADO_MAXIMO / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * k;
      c.height = img.height * k;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", CALIDAD));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(archivo);
  });
}

/** camara=true abre la cámara trasera; sin camara abre la galería / archivos */
function BotonFoto({ icono: Icono, texto, camara = false, onElegir }) {
  return (
    <label className="btn btn-secundario w-fit cursor-pointer">
      <Icono size={17} /> {texto}
      <input
        type="file"
        accept="image/*"
        capture={camara ? "environment" : undefined}
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) onElegir(await comprimir(f));
          e.target.value = "";
        }}
      />
    </label>
  );
}

/**
 * Una foto, o varias sin límite (multiple).
 * valores: lista de fotos (data URL o "/api/fotos/…"); onCambiar recibe la lista nueva.
 */
export default function CampoFoto({ valores = [], multiple = false, onCambiar }) {
  const fotos = valores.filter(Boolean);
  const agregar = (img) => onCambiar(multiple ? [...fotos, img] : [img]);
  const quitar = (i) => onCambiar(fotos.filter((_, k) => k !== i));
  const hay = fotos.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Dos botones separados: cámara directa o elegir desde la galería */}
      <div className="flex flex-wrap gap-2">
        <BotonFoto
          icono={Camera}
          texto={hay ? (multiple ? "Tomar otra foto" : "Tomar otra foto") : "Tomar foto"}
          camara
          onElegir={agregar}
        />
        <BotonFoto
          icono={ImagePlus}
          texto={hay ? (multiple ? "Añadir otra foto" : "Cambiar desde galería") : "Añadir foto"}
          onElegir={agregar}
        />
      </div>
      {hay && (
        <div className="flex flex-wrap gap-3">
          {fotos.map((f, i) => (
            <div key={i} className="relative w-fit">
              <img
                src={urlFoto(f)}
                alt={`Fotografía ${i + 1}`}
                className="max-h-64 max-w-full rounded-xl border border-borde"
              />
              {multiple && fotos.length > 1 && (
                <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[12px] font-bold text-c1 shadow">
                  Foto {i + 1}
                </span>
              )}
              <button
                type="button"
                onClick={() => quitar(i)}
                aria-label="Quitar fotografía"
                className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-lg bg-white/90 text-peligro shadow"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
