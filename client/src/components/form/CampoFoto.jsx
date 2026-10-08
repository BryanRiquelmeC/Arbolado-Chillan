/* Foto desde la cámara o galería; se comprime antes de guardarla */
import { Camera, Trash2 } from "lucide-react";

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

export default function CampoFoto({ valor, onCambiar }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="btn btn-secundario w-fit">
        <Camera size={17} /> {valor ? "Cambiar fotografía" : "Tomar o subir fotografía"}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) onCambiar(await comprimir(f));
            e.target.value = "";
          }}
        />
      </label>
      {valor && (
        <div className="relative w-fit">
          <img
            src={valor}
            alt="Fotografía del registro"
            className="max-h-64 max-w-full rounded-xl border border-borde"
          />
          <button
            type="button"
            onClick={() => onCambiar("")}
            aria-label="Quitar fotografía"
            className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-lg bg-white/90 text-peligro shadow"
          >
            <Trash2 size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
