/* Croquis · "Matriz VTA de este árbol" (al final del croquis)
   1. Sin guardar explica los 2 pasos (el botón se activa al guardar).
   2. Guardado botón para evaluar el árbol (Matriz nueva ya vinculada)o vincular una Matriz que ya existe en la manzana.
   3. Vinculado resumen de la Matriz, avisos y acciones (abrir / quitar).*/
import { useState } from "react";
import { Check, ClipboardCheck, ClipboardPlus, Lock, Unlink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tarjeta from "../ui/Tarjeta.jsx";
import Boton from "../ui/Boton.jsx";
import AlertasPunto from "./AlertasPunto.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { alertasPunto, datosDesdeCroquis, vinculadoDe } from "../../utils/vinculo.js";
import { tituloDe, urgenciaDe } from "../../utils/registros.js";

const norm = (v) => String(v || "").trim().toLowerCase();
const fecha = (r) => new Date(r._creado).toLocaleDateString("es-CL");

/** Datos cortos para reconocer la Matriz a simple vista */
function Resumen({ m }) {
  const datos = [m.p1 && `Manzana ${m.p1}`, fecha(m), m.p7 && `DAP ${m.p7} cm`, urgenciaDe(m)].filter(Boolean);
  return <span className="text-[13px] text-suave">{datos.join(" · ")}</span>;
}

export default function VinculoMatriz({ d }) {
  const { registros, guardarRegistro, toast, confirmar } = useApp();
  const navegar = useNavigate();
  const [verExistentes, setVerExistentes] = useState(false);

  const guardado = registros.find((r) => r._id === d._id) || null;
  const croquis = guardado ? { ...guardado, ...d } : d;
  const matriz = guardado ? vinculadoDe(guardado, registros) : null;

  // Matrices de la misma manzana que aún no tienen croquis
  const libres = registros.filter(
    (r) => r._tipo === "encuesta" && !r.croquis_id && norm(d.manzana) && norm(r.p1) === norm(d.manzana)
  );

  const nuevaMatriz = () => navegar("/matriz-vta", { state: { nuevo: datosDesdeCroquis(croquis) } });

  async function vincularExistente(m) {
    await guardarRegistro({ ...m, croquis_id: guardado._id });
    toast("Matriz VTA vinculada ✔");
    setVerExistentes(false);
  }

  async function quitar() {
    const si = await confirmar({
      titulo: "¿Quitar el vínculo?",
      texto: "El croquis y la Matriz VTA quedan como registros separados. No se borra ninguno.",
      ok: "Sí, quitar"
    });
    if (!si) return;
    await guardarRegistro({ ...matriz, croquis_id: "" });
    toast("Vínculo quitado");
  }

  return (
    <Tarjeta icono={ClipboardCheck} titulo="Evaular este árbol con Matriz VTA (opcional)">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#cfe3f2] bg-c5 p-4">
        {/* ---------- 3) Ya vinculado ---------- */}
        {matriz ? (
          <>
            <div className="flex flex-col gap-3 rounded-xl border-2 border-[#17663a] bg-white px-4 py-3 sm:flex-row sm:items-center">
              <span className="flex size-9 flex-none items-center justify-center rounded-full bg-[#dff3e6] text-[#17663a]">
                <Check size={20} strokeWidth={3} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[12px] font-bold tracking-wide text-[#17663a] uppercase">Vinculado</span>
                <b className="truncate text-[15px] text-c1">{tituloDe(matriz)}</b>
                <Resumen m={matriz} />
              </span>
              <span className="flex flex-wrap gap-2">
                <Boton
                  tamano="sm"
                  variante="primario"
                  icono={ClipboardCheck}
                  onClick={() => navegar("/matriz-vta", { state: { registro: matriz } })}
                >
                  Abrir Matriz
                </Boton>
                <Boton tamano="sm" variante="borrar" icono={Unlink} onClick={quitar}>
                  Quitar
                </Boton>
              </span>
            </div>
            <AlertasPunto alertas={alertasPunto(croquis, matriz)} mostrarOk />
          </>
        ) : !guardado ? (
          /* ---------- 1) Croquis sin guardar ---------- */
          <>
            <ol className="flex flex-col gap-2 text-[14px] text-[#2b4a63]">
              <li className="flex items-center gap-3">
                <span className="flex size-7 flex-none items-center justify-center rounded-full bg-c2 text-[13px] font-bold text-white">
                  1
                </span>
                <span>
                  <b>Guarde el croquis</b> con los botones de abajo.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-7 flex-none items-center justify-center rounded-full bg-[#cfe3f2] text-[13px] font-bold text-c1">
                  2
                </span>
                <span>
                  <b>Evalúe el árbol:</b> la Matriz VTA se abre ya vinculada, con manzana, dirección, GPS, DAP y copa
                  completos.
                </span>
              </li>
            </ol>
            <Boton icono={Lock} disabled className="w-fit opacity-60">
              Evaluar árbol (guarde primero)
            </Boton>
          </>
        ) : (
          /* ---------- 2) Guardado, sin Matriz ---------- */
          <>
            <p className="text-[14px] text-[#2b4a63]">
              Evalúe este árbol con la Matriz VTA. Se abrirá ya vinculada y con manzana, dirección, GPS, DAP y copa
              completos.
            </p>
            <Boton variante="primario" icono={ClipboardPlus} onClick={nuevaMatriz} className="w-fit">
              Evaluar árbol con Matriz VTA
            </Boton>

            {libres.length > 0 &&
              (verExistentes ? (
                <div className="flex flex-col gap-2 rounded-xl border border-[#cfe3f2] bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-c1">
                      Matrices de la manzana {d.manzana} sin croquis ({libres.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setVerExistentes(false)}
                      className="cursor-pointer text-[13px] font-bold text-suave underline"
                    >
                      Ocultar
                    </button>
                  </div>
                  {libres.slice(0, 5).map((m) => (
                    <button
                      key={m._id}
                      type="button"
                      onClick={() => vincularExistente(m)}
                      className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border-[1.5px] border-[#cfe3f2] bg-white px-4 py-3 text-left transition hover:border-c2 hover:bg-c5"
                    >
                      <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-c4 text-c2">
                        <ClipboardCheck size={18} />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <b className="truncate text-[15px] text-c1">{tituloDe(m)}</b>
                        <Resumen m={m} />
                      </span>
                      <span className="flex-none rounded-full border-[1.5px] border-c2 px-3 py-1 text-[13px] font-bold text-c2 transition group-hover:bg-c2 group-hover:text-white">
                        Vincular
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setVerExistentes(true)}
                  className="w-fit cursor-pointer text-[13px] font-bold text-c2 underline"
                >
                  ¿Ya hizo la Matriz? Vincular una existente de la manzana {d.manzana} ({libres.length})
                </button>
              ))}
          </>
        )}
      </div>
    </Tarjeta>
  );
}
