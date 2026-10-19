/* Croquis: crear o abrir la Matriz VTA del mismo árbol y ver avisos */
import { ClipboardCheck, ClipboardPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tarjeta from "../ui/Tarjeta.jsx";
import Boton from "../ui/Boton.jsx";
import AlertasPunto from "./AlertasPunto.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { alertasPunto, datosDesdeCroquis, vinculadoDe } from "../../utils/vinculo.js";

export default function VinculoMatriz({ d }) {
  const { registros } = useApp();
  const navegar = useNavigate();
  const guardado = registros.find((r) => r._id === d._id);
  const matriz = guardado ? vinculadoDe(guardado, registros) : null;

  return (
    <Tarjeta icono={ClipboardCheck} titulo="Evaluación del árbol (Matriz VTA)">
      {!guardado ? (
        <p className="text-[13.5px] text-suave">
          Guarde el croquis para poder evaluar el árbol con la Matriz VTA. Quedarán vinculados y el PDF saldrá
          combinado.
        </p>
      ) : matriz ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[14px] text-c1">Este croquis ya tiene su Matriz VTA vinculada.</span>
            <Boton
              tamano="sm"
              variante="primario"
              icono={ClipboardCheck}
              onClick={() => navegar("/matriz-vta", { state: { registro: matriz } })}
            >
              Abrir Matriz VTA
            </Boton>
          </div>
          <AlertasPunto alertas={alertasPunto({ ...guardado, ...d }, matriz)} mostrarOk />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[14px] text-[#2b4a63]">
            Evalúe este árbol: la Matriz se abre con manzana, dirección, GPS, DAP y copa ya completos.
          </span>
          <Boton
            variante="primario"
            icono={ClipboardPlus}
            onClick={() => navegar("/matriz-vta", { state: { nuevo: datosDesdeCroquis({ ...guardado, ...d }) } })}
          >
            Evaluar árbol (Matriz VTA)
          </Boton>
        </div>
      )}
    </Tarjeta>
  );
}
