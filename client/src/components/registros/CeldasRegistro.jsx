/* Piezas que muestra cada registro en la tabla y en las tarjetas */
import Pastilla from "../ui/Pastilla.jsx";
import Resaltar from "./Resaltar.jsx";
import { TIPOS, claseUrgencia, especieDe, tituloDe, urgenciaDe } from "../../utils/registros.js";
import { claseEstado, nombreEstado, siguienteDe, terminado } from "../../config/seguimiento.js";
import { CheckCircle2, ChevronDown } from "lucide-react";

/** Estado del trabajo: Pendiente · En proceso · Terminado (+ lo que sigue) */
export function EstadoRegistro({ r, onClick }) {
  const contenido = (
    <>
      <Pastilla className={`${claseEstado(r)} ${onClick ? "ring-1 ring-current/25 transition group-hover/estado:ring-current/60" : ""}`}>
        {terminado(r) && <CheckCircle2 size={12} className="mr-1 inline -mt-0.5" />}
        {nombreEstado(r)}
        {onClick && <ChevronDown size={12} className="ml-1 inline -mt-0.5 opacity-70" />}
      </Pastilla>
      {siguienteDe(r) && (
        <span className="mt-1 block text-[12px] font-semibold text-[#17663a]">{siguienteDe(r)}</span>
      )}
    </>
  );
  return onClick ? (
    <button type="button" onClick={() => onClick(r)} title="Cambiar estado" className="group/estado cursor-pointer text-left">
      {contenido}
    </button>
  ) : (
    contenido
  );
}

/** Tipo: Croquis · Matriz VTA · Censo */
export function TipoRegistro({ r }) {
  const t = TIPOS[r._tipo] || { nombre: "—", clase: "" };
  return <Pastilla className={t.clase}>{t.nombre}</Pastilla>;
}

/** Dirección + ID del árbol */
export function DireccionRegistro({ r, q }) {
  return (
    <>
      <b>
        <Resaltar texto={tituloDe(r)} q={q} />
      </b>
      {r.id_arbol && r.direccion && <div className="text-[13px] text-[#2b4a63]">{r.id_arbol}</div>}
    </>
  );
}

/** Resumen: medidas (croquis) o especie y urgencia (VTA / censo) */
export function DetalleBreve({ r, q }) {
  if (r._tipo === "croquis") {
    return (
      <>
        Calzada <b className="text-c1">{r.calzada || "—"} m</b> · Total{" "}
        <b className="text-c1">{r.ancho_total || "—"} m</b>
        {r.dap && (
          <>
            {" "}
            · DAP <b className="text-c1">{r.dap} cm</b>
          </>
        )}
      </>
    );
  }
  const u = urgenciaDe(r);
  return (
    <>
      <Resaltar texto={especieDe(r)} q={q} />
      {u && (
        <div className="mt-1">
          <Pastilla className={claseUrgencia(u)}>
            <Resaltar texto={u} q={q} />
          </Pastilla>
        </div>
      )}
    </>
  );
}
