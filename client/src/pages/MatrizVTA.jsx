/* Matriz VTA (Censo Arbolado Urbano 2026) — se construye desde config/encuesta.js */
import PageHeader from "../components/ui/PageHeader.jsx";
import BarraAcciones from "../components/form/BarraAcciones.jsx";
import SeccionVTA from "../components/matriz/SeccionVTA.jsx";
import { useFormulario } from "../hooks/useFormulario.js";
import { useGuardarFormulario } from "../hooks/useGuardarFormulario.jsx";
import { ENCUESTA, PREGUNTAS } from "../config/encuesta.js";

/** Devuelve el mensaje de la primera pregunta obligatoria sin responder */
function validar(datos) {
  const falta = PREGUNTAS.find((p) => p.req && !String(datos[p.id] ?? "").trim());
  return falta ? `Complete: ${falta.n}. ${falta.label}` : null;
}

export default function MatrizVTA() {
  const form = useFormulario();
  const { datos: d, set } = form;
  const { guardar, limpiar, guardando } = useGuardarFormulario({
    tipo: "encuesta",
    form,
    nombre: "la Matriz VTA",
    validar
  });

  return (
    <>
      <PageHeader titulo={ENCUESTA.titulo} subtitulo="Los campos con * son obligatorios" />
      {ENCUESTA.secciones.map((s, i) => (
        <SeccionVTA key={s.titulo} seccion={s} indice={i} d={d} set={set} />
      ))}
      <BarraAcciones onLimpiar={limpiar} onGuardar={guardar} guardando={guardando} />
    </>
  );
}
