/* =============================================================
   Dirección + botón GPS + coordenadas
   Guarda en: datos[nombre] (calle y número) y datos[nombre + "_gps"]
   ============================================================= */
import { useState } from "react";
import { LoaderCircle, MapPin } from "lucide-react";
import { buscarDireccion, leerPosicion } from "../../services/gps.js";
import { useApp } from "../../context/AppContext.jsx";

const COLORES = { ok: "text-ok", medio: "text-alerta", bajo: "text-peligro", "": "text-suave" };

export default function CampoGps({ nombre, datos, set, requerido }) {
  const { confirmar } = useApp();
  const [buscando, setBuscando] = useState(false);
  const [estado, setEstado] = useState({ texto: "", tipo: "" });
  const [auto, setAuto] = useState(false); // la dirección vino del GPS

  async function usarGps() {
    setBuscando(true);
    setEstado({ texto: "Buscando señal GPS… mantenga su dispositivo quieto unos segundos", tipo: "" });
    try {
      const p = await leerPosicion();
      const lat = p.coords.latitude.toFixed(6);
      const lon = p.coords.longitude.toFixed(6);
      const prec = Math.round(p.coords.accuracy);
      set(nombre + "_gps", `${lat}, ${lon}`);
      const calidad = prec <= 15 ? "ok" : prec <= 40 ? "medio" : "bajo";
      let texto = `Coordenadas registradas · precisión ±${prec} m${calidad === "bajo" ? " (baja: intente al aire libre)" : ""}`;

      if (!navigator.onLine) {
        return setEstado({
          texto: `${texto}. Sin internet: escriba la calle y número manualmente.`,
          tipo: calidad
        });
      }
      setEstado({ texto: `${texto}. Buscando calle…`, tipo: calidad });
      try {
        const d = await buscarDireccion(lat, lon);
        if (!d.texto)
          return setEstado({
            texto: `${texto}. No se encontró la calle: escríbala manualmente.`,
            tipo: "medio"
          });
        const actual = (datos[nombre] || "").trim();
        const reemplazar =
          !actual ||
          auto ||
          (await confirmar({
            titulo: "¿Reemplazar dirección?",
            texto: (
              <>
                El GPS encontró: <b>{d.texto}</b>
                <br />
                ¿Desea reemplazar la dirección escrita?
              </>
            ),
            ok: "Sí, reemplazar"
          }));
        if (reemplazar) {
          set(nombre, d.texto);
          setAuto(true);
        }
        if (!d.numero) texto += ". Revise el número de la casa: el mapa no lo indicó";
        setEstado({ texto: texto + ".", tipo: d.numero ? calidad : "medio" });
      } catch {
        setEstado({
          texto: `${texto}. No se pudo obtener la calle: escríbala manualmente.`,
          tipo: "medio"
        });
      }
    } catch (e) {
      setEstado({ texto: e.message, tipo: "bajo" });
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-w-0">
        <input
          type="text"
          required={requerido}
          className="campo rounded-r-none"
          placeholder="Calle y número"
          autoComplete="off"
          value={datos[nombre] ?? ""}
          onChange={(e) => {
            set(nombre, e.target.value);
            setAuto(false);
          }}
        />
        <button
          type="button"
          onClick={usarGps}
          disabled={buscando}
          className="btn btn-primario min-h-11.5 rounded-l-none px-4 whitespace-nowrap"
        >
          {buscando ? <LoaderCircle size={17} className="gira" /> : <MapPin size={17} />}
          GPS
        </button>
      </div>
      <div className="relative">
        <MapPin size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-suave" />
        <input
          type="text"
          inputMode="decimal"
          className="campo pl-9 text-[14px] tabular-nums"
          placeholder="Coordenadas (latitud, longitud)"
          value={datos[nombre + "_gps"] ?? ""}
          onChange={(e) => set(nombre + "_gps", e.target.value)}
        />
      </div>
      {estado.texto && (
        <p
          aria-live="polite"
          className={`flex items-start gap-1.5 text-[13px] leading-snug ${COLORES[estado.tipo]}`}
        >
          {buscando && <LoaderCircle size={15} className="gira mt-0.5 flex-none" />}
          {estado.texto}
        </p>
      )}
    </div>
  );
}
