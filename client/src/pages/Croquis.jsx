/* Croquis de perfil vial (corte transversal) */
import PageHeader from "../components/ui/PageHeader.jsx";
import BarraAcciones from "../components/form/BarraAcciones.jsx";
import SeccionIdentificacion from "../components/croquis/SeccionIdentificacion.jsx";
import SeccionRedElectrica from "../components/croquis/SeccionRedElectrica.jsx";
import SeccionPerfil from "../components/croquis/SeccionPerfil.jsx";
import SeccionDatosArbol from "../components/croquis/SeccionDatosArbol.jsx";
import SeccionNotas from "../components/croquis/SeccionNotas.jsx";
import { useFormulario } from "../hooks/useFormulario.js";
import { useGuardarFormulario } from "../hooks/useGuardarFormulario.jsx";
import { calcularCroquis } from "../utils/croquis.js";

const valoresIniciales = () => ({ fecha: new Date().toISOString().slice(0, 10) });

export default function Croquis() {
  const form = useFormulario(valoresIniciales);
  const { datos: d, set } = form;
  const calculo = calcularCroquis(d);

  const { guardar, limpiar, guardando } = useGuardarFormulario({
    tipo: "croquis",
    form,
    nombre: "el croquis",
    validar: (x) => (!x.direccion?.trim() ? "Complete la dirección" : null),
    preparar: (x) => ({
      ...x,
      ancho_total: calculo.total.toFixed(2),
      altura_cables: calculo.alturaMinima,
      // Sin cables no se guardan postes ni alturas
      ...(calculo.cables ? {} : { postes: [], altura_cables_izq: "", altura_cables_der: "" })
    })
  });

  const props = { d, set, calculo };

  return (
    <>
      <PageHeader
        titulo="Extracción y plantación de árboles"
        subtitulo="Los campos con * son obligatorios"
      />
      <SeccionIdentificacion {...props} />
      <SeccionRedElectrica {...props} />
      <SeccionPerfil {...props} />
      <SeccionDatosArbol {...props} />
      <SeccionNotas {...props} />
      <BarraAcciones onLimpiar={limpiar} onGuardar={guardar} guardando={guardando} />
    </>
  );
}
