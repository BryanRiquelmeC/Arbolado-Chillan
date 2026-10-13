/* =============================================================
   Borrador automático de un formulario
   · Guarda lo escrito cada ~1,5 s (solo si cambió algo)
   · Al abrir, si hay un borrador pendiente, pregunta si continuar
   · borrar(): llamar al guardar o al descartar
   ============================================================= */
import { useCallback, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { borrarBorrador, guardarBorrador, haceCuanto, leerBorrador } from "../services/borradores.js";

/** Quita lo vacío ("", [], {}, null, false) para comparar solo lo que el usuario escribió.
    Así un formulario sin tocar no cuenta como borrador, aunque los campos se
    inicialicen solos al abrir la página. */
function limpio(v) {
  if (Array.isArray(v)) {
    const a = v.map(limpio).filter((x) => x !== undefined);
    return a.length ? a : undefined;
  }
  if (v && typeof v === "object") {
    const o = {};
    for (const k of Object.keys(v).sort()) {
      const x = limpio(v[k]);
      if (x !== undefined) o[k] = x;
    }
    return Object.keys(o).length ? o : undefined;
  }
  if (v === "" || v === null || v === undefined || v === false) return undefined;
  return v;
}

const firma = (d) => {
  try {
    return JSON.stringify(limpio(d) ?? {});
  } catch {
    return "";
  }
};


export function useBorrador({ clave, datos, cargar, base, titulo, activo = true }) {
  const { confirmar } = useApp();
  const listo = useRef(false); // no autoguardar antes de revisar si había borrador
  const referencia = useRef(firma(base));

  // 1) Al abrir: ¿había un borrador?
  useEffect(() => {
    if (!activo || !clave) return;
    let vigente = true;
    listo.current = false;
    referencia.current = firma(base);
    (async () => {
      const b = await leerBorrador(clave);
      if (!vigente) return;
      // Borrador vacío o igual a lo inicial: se descarta sin preguntar
      if (b && firma(b.datos) === referencia.current) await borrarBorrador(clave);
      else if (b) {
        const seguir = await confirmar({
          titulo: "Hay un borrador sin guardar",
          texto: (
            <>
              {b.titulo ? <b>{b.titulo}</b> : "Un formulario"} · {haceCuanto(b.fecha)}
              <br />
              ¿Desea continuar donde quedó?
            </>
          ),
          ok: "Continuar",
          cancelar: "Descartar"
        });
        if (!vigente) return;
        if (seguir === true) cargar(b.datos);
        else if (seguir === false) await borrarBorrador(clave); // "Descartar"
        // con la X se deja guardado para decidir después
      }
      listo.current = true;
    })();
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, activo]);

  // 2) Autoguardado
  useEffect(() => {
    if (!activo || !clave || !listo.current) return;
    const actual = firma(datos);
    // Sin cambios reales respecto de lo inicial: no hay borrador que guardar
    if (actual === referencia.current) {
      const t = setTimeout(() => borrarBorrador(clave), 1500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => guardarBorrador(clave, datos, titulo), 1500);
    return () => clearTimeout(t);
  }, [datos, clave, activo, titulo]);

  /** Borra el borrador (al guardar o descartar) y toma los datos actuales como "limpios" */
  const borrar = useCallback(
    async (nuevosDatos) => {
      if (nuevosDatos !== undefined) referencia.current = firma(nuevosDatos);
      await borrarBorrador(clave);
    },
    [clave]
  );

  return { borrar };
}
