/* Matriz VTA: vincular con el croquis del mismo punto, copiar sus datos y ver avisos */
import { Link2, Map, Unlink, Download } from "lucide-react";
import Tarjeta from "../ui/Tarjeta.jsx";
import Boton from "../ui/Boton.jsx";
import AlertasPunto from "./AlertasPunto.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { NOMBRES_COPIA, alertasPunto, datosDesdeCroquis } from "../../utils/vinculo.js";
import { manzanaDe, tituloDe } from "../../utils/registros.js";

const etiqueta = (c) =>
  `${tituloDe(c)} · Manzana ${c.manzana || "—"} · ${new Date(c._creado).toLocaleDateString("es-CL")}`;

export default function VinculoCroquis({ d, set }) {
  const { registros, toast } = useApp();
  const croquis = registros.filter((r) => r._tipo === "croquis");
  const vinculado = croquis.find((c) => c._id === d.croquis_id) || null;
  // Primero los de la misma manzana
  const mz = String(d.p1 || "").trim();
  const ordenados = [...croquis].sort(
    (a, b) => (manzanaDe(b) === mz) - (manzanaDe(a) === mz) || String(b._creado).localeCompare(String(a._creado))
  );

  /** Copia del croquis solo los campos que la Matriz aún tiene vacíos */
  function copiar(c) {
    const copiados = Object.entries(datosDesdeCroquis(c)).filter(([k]) => k !== "croquis_id" && !String(d[k] ?? "").trim());
    copiados.forEach(([k, v]) => set(k, v));
    toast(
      copiados.length
        ? `Copiado del croquis: ${copiados.map(([k]) => NOMBRES_COPIA[k]).join(", ")}`
        : "No había campos vacíos para completar"
    );
  }

  return (
    <Tarjeta icono={Link2} titulo="Croquis del punto (opcional)">
      <p className="mb-3 text-[13.5px] text-[#2b4a63]">
        Vincule esta evaluación con el croquis de perfil vial del mismo árbol: el PDF saldrá combinado y la app
        avisará si algún dato no coincide.
      </p>
      <div className="flex flex-col gap-3">
        <select
          className="campo"
          value={d.croquis_id || ""}
          onChange={(e) => {
            const c = croquis.find((x) => x._id === e.target.value);
            set("croquis_id", e.target.value);
            if (c) copiar(c);
          }}
        >
          <option value="">— Sin croquis vinculado —</option>
          {ordenados.map((c) => (
            <option key={c._id} value={c._id}>
              {etiqueta(c)}
            </option>
          ))}
        </select>

        {vinculado && (
          <>
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-c4 px-4 py-2.5 text-[13.5px] text-c1">
              <Map size={17} />
              <b>Vinculado:</b> {etiqueta(vinculado)}
              <span className="ml-auto flex flex-wrap gap-2">
                <Boton tamano="sm" icono={Download} onClick={() => copiar(vinculado)}>
                  Completar con datos del croquis
                </Boton>
                <Boton tamano="sm" icono={Unlink} onClick={() => set("croquis_id", "")}>
                  Desvincular
                </Boton>
              </span>
            </div>
            <AlertasPunto alertas={alertasPunto(vinculado, d)} mostrarOk />
          </>
        )}
      </div>
    </Tarjeta>
  );
}
