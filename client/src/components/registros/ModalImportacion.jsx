/* Vista previa antes de importar una planilla Excel:
   cuántos árboles nuevos trae cada manzana y cuáles son */
import { FileSpreadsheet, Sparkles } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Boton from "../ui/Boton.jsx";
import Pastilla from "../ui/Pastilla.jsx";

export default function ModalImportacion({ importacion, onCancelar, onConfirmar }) {
  if (!importacion) return null;
  const { archivo, lista, nuevos, porManzana } = importacion;
  const actualizados = lista.length - nuevos;
  const conNuevos = porManzana.filter((g) => g.nuevos.length);

  return (
    <Modal
      abierto
      titulo="Importar planilla"
      subtitulo={archivo}
      onCerrar={onCancelar}
      pie={
        <>
          <Boton onClick={onCancelar}>Cancelar</Boton>
          {nuevos > 0 && actualizados > 0 && (
            <Boton icono={Sparkles} onClick={() => onConfirmar(true)}>
              Solo los {nuevos} nuevos
            </Boton>
          )}
          <Boton variante="primario" icono={FileSpreadsheet} onClick={() => onConfirmar(false)}>
            Importar {lista.length} registros
          </Boton>
        </>
      }
    >
      <p className="my-3 text-[15px]">
        Se encontraron <b>{lista.length}</b> árboles: <b className="text-[#17663a]">{nuevos} nuevos</b> y{" "}
        <b>{actualizados}</b> que ya existen y se actualizarán (no se duplican; se conservan sus fotos y estado).
      </p>

      {/* Árboles nuevos por manzana */}
      <h4 className="mt-5 mb-2 text-[13px] font-bold tracking-wide text-c2 uppercase">
        Árboles nuevos por manzana {conNuevos.length ? `(${conNuevos.length})` : ""}
      </h4>
      {!conNuevos.length && <p className="text-[14px] text-suave">No hay árboles nuevos: solo actualizaciones.</p>}
      {conNuevos.map((g) => (
        <details key={g.manzana} className="border-b border-borde py-2 text-[14.5px]">
          <summary className="flex cursor-pointer items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-bold text-c1">
              Manzana {g.manzana}
              {g.manzanaNueva && <Pastilla className="bg-[#dff3e6] text-[#17663a]">Manzana nueva</Pastilla>}
            </span>
            <span>
              <b className="text-[#17663a]">+{g.nuevos.length}</b>
              {g.actualizados > 0 && <span className="text-suave"> · {g.actualizados} actualizados</span>}
            </span>
          </summary>
          <ul className="mt-2 mb-1 flex flex-col gap-1 pl-3 text-[13px] text-[#2b4a63]">
            {g.nuevos.map((r) => (
              <li key={r._id}>
                <b>{r.id_arbol || `N° ${r.n_arbol || "—"}`}</b>
                {r.especie && ` · ${r.especie}`}
                {r.direccion && <span className="text-suave"> · {r.direccion}</span>}
              </li>
            ))}
          </ul>
        </details>
      ))}

      {/* Manzanas que solo se actualizan */}
      {porManzana.some((g) => !g.nuevos.length) && (
        <>
          <h4 className="mt-5 mb-2 text-[13px] font-bold tracking-wide text-c2 uppercase">Solo actualizaciones</h4>
          <p className="text-[13.5px] text-suave">
            {porManzana
              .filter((g) => !g.nuevos.length)
              .map((g) => `Manzana ${g.manzana} (${g.actualizados})`)
              .join(" · ")}
          </p>
        </>
      )}
    </Modal>
  );
}
