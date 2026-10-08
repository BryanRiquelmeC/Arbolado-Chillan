/* Cambiar el estado del trabajo de un árbol: Pendiente · En proceso · Terminado */
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Clock, Save } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Boton from "../ui/Boton.jsx";
import Campo from "../form/Campo.jsx";
import CampoFotos from "../form/CampoFotos.jsx";
import { ESTADOS, RESULTADOS, estadoDe } from "../../config/seguimiento.js";
import { tituloDe, manzanaDe } from "../../utils/registros.js";

const ICONOS = { pendiente: Circle, proceso: Clock, terminado: CheckCircle2 };
const hoy = () => new Date().toISOString().slice(0, 10);

export default function ModalSeguimiento({ registro, onCerrar, onGuardar }) {
  const [d, setD] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (registro) {
      setD({
        estado: estadoDe(registro),
        resultado: registro.resultado || "",
        fecha_inicio: registro.fecha_inicio || "",
        fecha_termino: registro.fecha_termino || "",
        nota_seguimiento: registro.nota_seguimiento || "",
        fotos_seguimiento: registro.fotos_seguimiento || []
      });
      setError("");
    }
  }, [registro]);

  if (!registro || !d) return null;
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));

  function elegirEstado(e) {
    setD((x) => ({
      ...x,
      estado: e,
      fecha_inicio: e !== "pendiente" && !x.fecha_inicio ? hoy() : x.fecha_inicio,
      fecha_termino: e === "terminado" ? x.fecha_termino || hoy() : ""
    }));
  }

  function guardar() {
    if (d.estado === "terminado" && !d.resultado) return setError("Indique qué quedó listo al terminar");
    const r = {
      ...registro,
      ...d,
      resultado: d.estado === "terminado" ? d.resultado : "",
      historial: [
        ...(registro.historial || []),
        {
          fecha: new Date().toISOString(),
          estado: d.estado,
          resultado: d.estado === "terminado" ? d.resultado : "",
          nota: d.nota_seguimiento
        }
      ]
    };
    onGuardar(r);
  }

  return (
    <Modal
      abierto
      titulo="Estado del trabajo"
      subtitulo={`${tituloDe(registro)} · Manzana ${manzanaDe(registro) || "—"}`}
      onCerrar={onCerrar}
      pie={
        <>
          <Boton onClick={onCerrar}>Cancelar</Boton>
          <Boton variante="primario" icono={Save} onClick={guardar}>
            Guardar estado
          </Boton>
        </>
      }
    >
      {/* Estado */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {Object.entries(ESTADOS).map(([k, e]) => {
          const Icono = ICONOS[k];
          const activo = d.estado === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => elegirEstado(k)}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-bold transition ${
                activo ? `${e.clase} border-current` : "border-borde bg-white text-suave hover:border-c2/40"
              }`}
            >
              <Icono size={18} />
              {e.nombre}
            </button>
          );
        })}
      </div>

      {/* Resultado al terminar */}
      {d.estado === "terminado" && (
        <>
          <h3 className="mt-6 mb-2 text-sm font-bold text-c1">¿Qué quedó listo? *</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {RESULTADOS.map((x) => {
              const activo = d.resultado === x.valor;
              return (
                <button
                  key={x.valor}
                  type="button"
                  onClick={() => set("resultado", x.valor)}
                  className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-left transition ${
                    activo ? "border-[#17663a] bg-[#dff3e6]" : "border-borde bg-white hover:border-c2/40"
                  }`}
                >
                  <b className={activo ? "text-[#17663a]" : "text-c1"}>{x.valor}</b>
                  <span className="block text-[13px] text-suave">{x.detalle}</span>
                  <span className="mt-1 block text-[12.5px] font-semibold text-c2">→ {x.sigue}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Fechas y nota */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {d.estado !== "pendiente" && (
          <Campo etiqueta="Fecha de inicio">
            <input type="date" className="campo" value={d.fecha_inicio} onChange={(e) => set("fecha_inicio", e.target.value)} />
          </Campo>
        )}
        {d.estado === "terminado" && (
          <Campo etiqueta="Fecha de término">
            <input type="date" className="campo" value={d.fecha_termino} onChange={(e) => set("fecha_termino", e.target.value)} />
          </Campo>
        )}
        <Campo etiqueta="Nota (opcional)" className="sm:col-span-2">
          <textarea
            rows={2}
            className="campo"
            value={d.nota_seguimiento}
            onChange={(e) => set("nota_seguimiento", e.target.value)}
            placeholder="Ej: cuadrilla 2, se retiró con grúa…"
          />
        </Campo>
      </div>

      {d.estado !== "pendiente" && (
        <>
          <h3 className="mt-6 mb-3 text-sm font-bold text-c1">
            Fotos del trabajo (opcional{d.fotos_seguimiento.length ? ` · ${d.fotos_seguimiento.length}` : ""})
          </h3>
          <CampoFotos
            valor={d.fotos_seguimiento}
            onCambiar={(v) => set("fotos_seguimiento", v)}
            sugerencia={d.estado === "terminado" ? "Después" : "Durante el trabajo"}
          />
        </>
      )}

      {error && <p className="mt-4 text-sm font-semibold text-[#b42318]">{error}</p>}
    </Modal>
  );
}
