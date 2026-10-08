/* Ventana con la ficha completa de un registro */
import { FileDown, Pencil } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Boton from "../ui/Boton.jsx";
import DetalleRegistro from "./DetalleRegistro.jsx";
import { TIPOS, manzanaDe, tituloDe } from "../../utils/registros.js";

export default function ModalDetalle({ registro, onCerrar, onEditar, onPdf }) {
  if (!registro) return null;
  const tipo =
    registro._tipo === "croquis" ? "Croquis de perfil vial" : TIPOS[registro._tipo]?.nombre;

  return (
    <Modal
      abierto
      titulo={tituloDe(registro)}
      subtitulo={`${tipo} · Manzana ${manzanaDe(registro) || "—"}`}
      onCerrar={onCerrar}
      pie={
        <>
          <Boton onClick={onCerrar}>Cerrar</Boton>
          <Boton tamano="sm" icono={Pencil} onClick={() => onEditar(registro)}>
            Editar
          </Boton>
          <Boton variante="primario" icono={FileDown} onClick={() => onPdf(registro)}>
            Descargar PDF
          </Boton>
        </>
      }
    >
      <DetalleRegistro registro={registro} />
    </Modal>
  );
}
