/* Piezas que muestra cada registro en la tabla y en las tarjetas */
import Pastilla from "../ui/Pastilla.jsx";
import Resaltar from "./Resaltar.jsx";
import { TIPOS, especieDe, tituloDe, urgenciaDe } from "../../utils/registros.js";

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
        <>
          {" "}
          · <b className="text-c1">{u}</b>
        </>
      )}
    </>
  );
}
