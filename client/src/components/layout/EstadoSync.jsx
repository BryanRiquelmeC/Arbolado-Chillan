/* Estado de sincronización con el servidor + botón "Sincronizar ahora" */
import { RefreshCw } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { fechaHora } from "../../utils/registros.js";
import Boton from "../ui/Boton.jsx";

const ESTADOS = {
  local: ["bg-[#9fb3c4]", "Solo en este dispositivo", "Servidor no disponible"],
  sincronizando: ["bg-[#ffd166]", "Sincronizando…", ""],
  sinconexion: ["bg-[#ff8a8a]", "Sin conexión", "Datos guardados en la tablet"],
  error: ["bg-[#ff8a8a]", "Error al sincronizar", "Se reintentará automáticamente"],
  ok: ["bg-[#3ddc97]", "Sincronizado", ""]
};

export default function EstadoSync() {
  const { sync, sincronizarAhora } = useApp();
  let [punto, titulo, detalle] = ESTADOS[sync.estado] || ESTADOS.local;
  if (sync.estado === "ok" && sync.pendientes) {
    punto = "bg-[#ffd166]";
    titulo = `${sync.pendientes} pendiente(s) de subir`;
  }
  if (!detalle && sync.ultima) detalle = "Última: " + fechaHora(sync.ultima);

  return (
    <div className="mt-4 rounded-xl border border-[#cfe3f2] bg-c5 p-3 text-[12.5px]">
      <b className="flex items-center gap-2 text-[13px]">
        <span className={`size-2 rounded-full ${punto}`} />
        {titulo}
      </b>
      {detalle && <p className="mt-0.5 text-suave">{detalle}</p>}
      <Boton
        variante="primario"
        className="mt-2 w-full py-2 text-[13px]"
        onClick={() => sincronizarAhora(true)}
      >
        <RefreshCw size={15} className={sync.estado === "sincronizando" ? "gira" : ""} />
        Sincronizar ahora
      </Boton>
    </div>
  );
}
