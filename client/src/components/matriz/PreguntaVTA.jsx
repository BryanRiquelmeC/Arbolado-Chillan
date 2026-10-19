/* Una pregunta de la Matriz VTA: elige el control según su tipo */
import Campo from "../form/Campo.jsx";
import CampoGps from "../form/CampoGps.jsx";
import CampoFoto from "../form/CampoFoto.jsx";
import OpcionesVTA from "../form/OpcionesVTA.jsx";
import CalculosVTA from "./CalculosVTA.jsx";
import { fotosDe, guardarFotos, otrosMarcado } from "../../utils/vta.js";
import { BotonQuitar, Lista, Numero, Texto } from "../form/Controles.jsx";

const ANCHO_COMPLETO = ["radio", "photo", "textarea", "gps", "select"];

function Control({ p, d, set }) {
  switch (p.type) {
    case "number":
      return <Numero unidad={p.unit} valor={d[p.id]} onCambiar={(v) => set(p.id, v)} />;
    case "gps":
      return <CampoGps nombre={p.id} datos={d} set={set} requerido={p.req} />;
    case "photo":
      return (
        <CampoFoto
          valores={fotosDe(d, p)}
          multiple={p.multiple}
          onCambiar={(lista) => guardarFotos(d, p, lista, set)}
        />
      );
    case "textarea":
      return (
        <textarea
          className="campo min-h-24"
          value={d[p.id] ?? ""}
          onChange={(e) => set(p.id, e.target.value)}
          placeholder={p.placeholder}
        />
      );
    case "select":
      return (
        <>
          <Lista
            vacio="— Seleccione —"
            opciones={[...p.opts, ...(p.otros ? ["Otros"] : [])]}
            valor={d[p.id]}
            onCambiar={(v) => set(p.id, v)}
          />
          {p.otros && d[p.id] === "Otros" && (
            <Texto
              valor={d[p.id + "_otro"]}
              onCambiar={(v) => set(p.id + "_otro", v)}
              placeholder="Especifique…"
            />
          )}
        </>
      );
    case "radio":
      return (
        <OpcionesVTA
          nombre={p.id}
          opciones={p.opts}
          otros={p.otros}
          valor={d[p.id]}
          otrosActivo={otrosMarcado(d, p.id)}
          otro={d[p.id + "_otro"]}
          sub={p.sub}
          subValor={p.sub ? d[p.sub.campo] : ""}
          onCambiar={(v) => {
            if (d[p.id] === "Otros") set(p.id + "_otros", true); // registro antiguo: conservar su "Otros"
            set(p.id, v);
          }}
          onOtrosActivo={(on) => {
            set(p.id + "_otros", on);
            if (!on) {
              set(p.id + "_otro", "");
              if (d[p.id] === "Otros") set(p.id, "");
            }
          }}
          onOtro={(v) => set(p.id + "_otro", v)}
          onSub={(v) => p.sub && set(p.sub.campo, v)}
        />
      );
    default:
      return <Texto valor={d[p.id]} onCambiar={(v) => set(p.id, v)} />;
  }
}

export default function PreguntaVTA({ p, d, set }) {
  if (p.type === "calculos") return <CalculosVTA d={d} set={set} />;
  const ancho = ANCHO_COMPLETO.includes(p.type);
  const conQuitar = p.type === "radio" || p.type === "select";

  return (
    <Campo
      etiqueta={`${p.n ? p.n + ". " : ""}${p.label}`}
      requerido={p.req}
      ayuda={p.hint}
      ancho={ancho}
      className={ancho ? "border-b border-dashed border-borde pb-5 last:border-b-0 last:pb-0" : ""}
      accion={
        conQuitar && (
          <BotonQuitar
            visible={Boolean(d[p.id]) || otrosMarcado(d, p.id)}
            onClick={() => {
              set(p.id, "");
              set(p.id + "_otro", "");
              set(p.id + "_otros", false);
              if (p.sub) set(p.sub.campo, "");
            }}
          />
        )
      }
    >
      <Control p={p} d={d} set={set} />
    </Campo>
  );
}
