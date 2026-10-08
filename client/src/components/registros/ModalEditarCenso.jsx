/* Crear o editar un registro de tipo censo (manual o importado desde Excel) */
import { useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Boton from "../ui/Boton.jsx";
import Campo from "../form/Campo.jsx";
import CampoFotos from "../form/CampoFotos.jsx";

const URGENCIAS = [
  "",
  "EMERGENCIA (Inmediata)",
  "URGENTE (Corto plazo)",
  "PROGRAMABLE (30-90 días)",
  "MANTENCIÓN CÍCLICA",
  "MONITOREO",
  "SIN INTERVENCIÓN",
  "RETIRO DE TOCÓN / ELIMINAR"
];

const hoy = () => new Date().toISOString().slice(0, 10);
const slug = (t) =>
  String(t)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

/** Registro vacío para un árbol nuevo (opcionalmente en una manzana) */
export function nuevoCenso(manzana = "") {
  return {
    _nuevo: true,
    _tipo: "censo",
    _origen: "Ingreso manual",
    manzana,
    fecha: hoy(),
    campos: []
  };
}

export default function ModalEditarCenso({ registro, registros = [], onCerrar, onGuardar }) {
  const [d, setD] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (registro) {
      setD({ ...registro, campos: (registro.campos || []).map((c) => [...c]) });
      setError("");
    }
  }, [registro]);

  if (!registro || !d) return null;
  const nuevo = !!d._nuevo;

  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  const setCampo = (i, pos, v) =>
    setD((x) => ({
      ...x,
      campos: x.campos.map((c, j) => (j === i ? (pos === 0 ? [v, c[1]] : [c[0], v]) : c))
    }));
  const agregarCampo = () => setD((x) => ({ ...x, campos: [...x.campos, ["", ""]] }));
  const quitarCampo = (i) => setD((x) => ({ ...x, campos: x.campos.filter((_, j) => j !== i) }));

  function guardar() {
    if (!String(d.manzana || "").trim()) return setError("Indique la manzana");
    if (!String(d.especie || "").trim() && !String(d.direccion || "").trim())
      return setError("Indique al menos la especie o la dirección");

    // eslint-disable-next-line no-unused-vars
    const { _nuevo, ...r } = d;
    r.manzana = String(r.manzana).trim();
    r.campos = r.campos.filter(([k, v]) => String(k).trim() && String(v).trim());

    if (nuevo) {
      // N° correlativo dentro de la manzana y un ID tipo "47-Fresn-037"
      const enMz = registros.filter((x) => String(x.manzana) === r.manzana);
      const n = r.n_arbol || Math.max(0, ...enMz.map((x) => +x.n_arbol || 0)) + 1;
      const esp = (r.especie || "Arbol").replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ]/g, "").slice(0, 5);
      let id = r.id_arbol?.trim() || `${r.manzana}-${esp}-${String(n).padStart(3, "0")}`;
      const ocupados = new Set(registros.map((x) => x._id));
      let k = 2;
      while (ocupados.has("censo-" + slug(id))) id = `${id}-${k++}`;
      Object.assign(r, {
        _id: "censo-" + slug(id),
        _creado: new Date().toISOString(),
        id_arbol: id,
        n_arbol: String(n)
      });
    }
    onGuardar(r);
  }

  const urgencias = URGENCIAS.includes(d.urgencia ?? "") ? URGENCIAS : [...URGENCIAS, d.urgencia];

  return (
    <Modal
      abierto
      titulo={nuevo ? "Nuevo árbol (censo)" : "Editar registro del censo"}
      subtitulo={nuevo ? "Se agregará a la manzana indicada" : `ID ${d.id_arbol || d._id}`}
      onCerrar={onCerrar}
      pie={
        <>
          <Boton onClick={onCerrar}>Cancelar</Boton>
          <Boton variante="primario" icono={Save} onClick={guardar}>
            {nuevo ? "Guardar árbol" : "Guardar cambios"}
          </Boton>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Campo etiqueta="Manzana" requerido>
          <input className="campo" value={d.manzana ?? ""} onChange={(e) => set("manzana", e.target.value)} placeholder="Ej: 47" />
        </Campo>
        <Campo etiqueta="N° de árbol">
          <input className="campo" value={d.n_arbol ?? ""} onChange={(e) => set("n_arbol", e.target.value)} placeholder={nuevo ? "Automático" : ""} />
        </Campo>
        {nuevo && (
          <Campo etiqueta="ID del árbol (opcional)" className="sm:col-span-2">
            <input className="campo" value={d.id_arbol ?? ""} onChange={(e) => set("id_arbol", e.target.value)} placeholder="Se genera solo, ej: 47-Fresn-048" />
          </Campo>
        )}
        <Campo etiqueta="Dirección" className="sm:col-span-2">
          <input className="campo" value={d.direccion ?? ""} onChange={(e) => set("direccion", e.target.value)} />
        </Campo>
        <Campo etiqueta="Especie" className="sm:col-span-2">
          <input className="campo" value={d.especie ?? ""} onChange={(e) => set("especie", e.target.value)} />
        </Campo>
        <Campo etiqueta="Urgencia">
          <select className="campo" value={d.urgencia ?? ""} onChange={(e) => set("urgencia", e.target.value)}>
            {urgencias.map((u) => (
              <option key={u} value={u}>
                {u || "—"}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Fecha">
          <input type="date" className="campo" value={d.fecha ?? ""} onChange={(e) => set("fecha", e.target.value)} />
        </Campo>
        <Campo etiqueta="Recomendación técnica" className="sm:col-span-2">
          <textarea rows={2} className="campo" value={d.recomendacion ?? ""} onChange={(e) => set("recomendacion", e.target.value)} />
        </Campo>
      </div>

      <h3 className="mt-6 mb-3 text-sm font-bold text-c1">
        Datos adicionales ({d.campos.length})
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {d.campos.map(([etiqueta, valor], i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto]">
            <input
              className="campo font-semibold sm:col-span-1"
              value={etiqueta}
              onChange={(e) => setCampo(i, 0, e.target.value)}
              placeholder="Dato (ej: DAP en cm)"
            />
            <textarea
              rows={String(valor).length > 80 ? 3 : 1}
              className="campo col-span-1 row-start-2 sm:row-start-auto"
              value={valor ?? ""}
              onChange={(e) => setCampo(i, 1, e.target.value)}
              placeholder="Valor"
            />
            <button
              type="button"
              onClick={() => quitarCampo(i)}
              aria-label="Quitar dato"
              className="row-span-2 flex size-11 cursor-pointer items-center justify-center self-start rounded-lg text-[#b42318] hover:bg-[#fff1f1] sm:row-span-1"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
      <Boton tamano="sm" icono={Plus} className="mt-3" onClick={agregarCampo}>
        Agregar dato
      </Boton>
            <h3 className="mt-6 mb-3 text-sm font-bold text-c1">
        Fotografías (opcional{d.fotos?.length ? ` · ${d.fotos.length}` : ""})
      </h3>
      <CampoFotos
        valor={d.fotos}
        onCambiar={(v) => set("fotos", v)}
        sugerencia={[d.manzana && `Manzana ${d.manzana}`, d.direccion].filter(Boolean).join(" · ")}
      />

      {error && <p className="mt-4 text-sm font-semibold text-[#b42318]">{error}</p>}
    </Modal>
  );
}
