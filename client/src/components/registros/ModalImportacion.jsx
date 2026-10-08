/* Vista previa antes de importar una planilla Excel */
import { FileSpreadsheet } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Boton from "../ui/Boton.jsx";

export default function ModalImportacion({ importacion, onCancelar, onConfirmar }) {
  if (!importacion) return null;
  const { archivo, lista, nuevos, porManzana } = importacion;

  return (
    <Modal
      abierto
      titulo="Importar planilla"
      subtitulo={archivo}
      onCerrar={onCancelar}
      pie={
        <>
          <Boton onClick={onCancelar}>Cancelar</Boton>
          <Boton variante="primario" icono={FileSpreadsheet} onClick={onConfirmar}>
            Importar {lista.length} registros
          </Boton>
        </>
      }
    >
      <p className="my-3 text-[15px]">
        Se encontraron <b>{lista.length}</b> árboles: <b>{nuevos}</b> nuevos y{" "}
        <b>{lista.length - nuevos}</b> que se actualizarán (mismo ID_Arbol, no se duplican).
      </p>
      <h4 className="mt-4 mb-1 text-[13px] font-bold tracking-wide text-c2 uppercase">
        Por manzana
      </h4>
      {porManzana.map(([m, c]) => (
        <dl key={m} className="flex justify-between border-b border-borde py-2 text-[14.5px]">
          <dt className="font-bold text-c1">Manzana {m}</dt>
          <dd>{c} árboles</dd>
        </dl>
      ))}
    </Modal>
  );
}
