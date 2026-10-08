/* =============================================================
   Lógica común de Croquis y Matriz VTA:
   cargar un registro para editar, guardar, PDF opcional y limpiar.
   ============================================================= */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { pdfRegistro } from "../services/pdf.js";
import { dispositivo, nuevoId } from "../utils/registros.js";

export function useGuardarFormulario({ tipo, form, validar, preparar = (d) => d, nombre }) {
  const { guardarRegistro, toast, confirmar } = useApp();
  const { state } = useLocation();
  const navegar = useNavigate();
  const [guardando, setGuardando] = useState(false);

  const { cargar } = form;

  // Si se llegó con "Editar", cargar ese registro
  useEffect(() => {
    if (state?.registro?._tipo === tipo) {
      cargar(state.registro);
      navegar(".", { replace: true, state: null });
    }
  }, [state, tipo, cargar, navegar]);

  async function guardar(conPdf) {
    const error = validar?.(form.datos);
    if (error) return toast(error);
    setGuardando(true);
    try {
      const registro = await guardarRegistro(
        preparar({
          ...form.datos,
          _id: form.datos._id || nuevoId(),
          _tipo: tipo,
          _creado: form.datos._creado || new Date().toISOString(),
          _dispositivo: dispositivo()
        })
      );
      form.set("_id", registro._id);
      form.set("_creado", registro._creado);
      toast("Registro guardado ✔");
      if (conPdf) await pdfRegistro(registro);
    } catch (e) {
      console.error(e);
      toast("⚠ No se pudo guardar en el dispositivo");
    } finally {
      setGuardando(false);
    }
  }

  async function limpiar() {
    const si = await confirmar({
      titulo: "¿Limpiar formulario?",
      texto: (
        <>
          Se borrarán todos los datos escritos en {nombre}, incluidas fotos y coordenadas.
          <br />
          <b>Los registros ya guardados no se eliminan.</b>
        </>
      ),
      ok: "Sí, limpiar",
      peligro: true
    });
    if (!si) return;
    form.limpiar();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Formulario limpio");
  }

  return { guardar, limpiar, guardando };
}
