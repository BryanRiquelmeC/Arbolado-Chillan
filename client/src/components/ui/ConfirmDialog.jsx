/* Confirmación "¿Está seguro?" con el estilo de la app */
import { Info, Trash2 } from "lucide-react";
import Modal from "./Modal.jsx";
import Boton from "./Boton.jsx";

export default function ConfirmDialog({ datos, onCerrar }) {
  const Icono = datos?.peligro ? Trash2 : Info;
  return (
    <Modal
      abierto={Boolean(datos)}
      angosto
      titulo={datos?.titulo}
      onCerrar={() => onCerrar(false)}
      pie={
        <>
          <Boton className="flex-1 sm:min-w-32 sm:flex-none" onClick={() => onCerrar(false)}>
            Cancelar
          </Boton>
          <Boton
            autoFocus
            variante={datos?.peligro ? "peligro" : "primario"}
            icono={Icono}
            className="flex-1 sm:min-w-32 sm:flex-none"
            onClick={() => onCerrar(true)}
          >
            {datos?.ok || "Confirmar"}
          </Boton>
        </>
      }
    >
      <div className="flex items-start gap-4 pt-1">
        <span
          className={`flex size-12 flex-none items-center justify-center rounded-xl ${
            datos?.peligro ? "bg-[#fde8e8] text-peligro" : "bg-c4 text-c2"
          }`}
        >
          <Icono size={24} />
        </span>
        <div className="text-[15px] leading-relaxed">{datos?.texto}</div>
      </div>
    </Modal>
  );
}
