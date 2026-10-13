/* Árboles duplicados: muestra cuál se conserva y cuál se elimina, y los une */
import { Combine } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Boton from "../ui/Boton.jsx";

const fecha = (r) => (r._creado ? new Date(r._creado).toLocaleString("es-CL") : r.fecha || "—");

export default function ModalDuplicados({ grupos, uniendo, onCerrar, onUnir }) {
  if (!grupos) return null;
  const total = grupos.reduce((n, g) => n + g.sobran.length, 0);

  return (
    <Modal
      abierto
      ancho="max-w-3xl"
      titulo="Árboles duplicados"
      subtitulo={`${grupos.length} árboles aparecen repetidos · se eliminarán ${total} copias`}
      onCerrar={onCerrar}
      pie={
        <>
          <Boton onClick={onCerrar}>Cancelar</Boton>
          <Boton variante="primario" icono={Combine} onClick={onUnir} disabled={uniendo}>
            {uniendo ? "Uniendo…" : `Unir ${grupos.length} duplicados`}
          </Boton>
        </>
      }
    >
      <p className="my-3 text-[14.5px]">
        Se consideran duplicados los árboles con <b>misma manzana, dirección, especie y hora de registro</b>.
        Se conserva el que tiene <b>ID del árbol</b>; los datos, fotos y estado de la copia se pasan a él antes de
        eliminarla. Las copias eliminadas quedan en la <b>papelera</b> de la base de datos.
      </p>
      <div className="flex flex-col gap-2">
        {grupos.map(({ conservar, sobran }) => (
          <div key={conservar._id} className="rounded-xl border border-borde p-3 text-[13.5px]">
            <div className="font-bold text-c1">
              Manzana {conservar.manzana} · {conservar.direccion} · {conservar.especie || "—"}
            </div>
            <div className="mt-1 text-[#17663a]">
              ✔ Se conserva: <b>{conservar.id_arbol || conservar._id}</b> <span className="text-suave">({fecha(conservar)})</span>
            </div>
            {sobran.map((r) => (
              <div key={r._id} className="text-[#b42318]">
                ✕ Se elimina: <b>{r.id_arbol || "sin ID"}</b> <span className="text-suave">({fecha(r)})</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}
