/* Resumen de una manzana: tipos, especies, urgencias y acciones */
import { FileDown, Folder, Plus, TreeDeciduous } from "lucide-react";
import Boton from "../ui/Boton.jsx";
import Pastilla from "../ui/Pastilla.jsx";
import { TIPOS, claseUrgencia, contar, especieDe, urgenciaDe } from "../../utils/registros.js";

function Grupo({ titulo, children }) {
  return (
    <div>
      <p className="etiqueta mb-1.5 text-xs">{titulo}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export default function TarjetaManzana({ manzana, registros, onVer, onInforme, onAgregar }) {
  const porTipo = Object.entries(TIPOS)
    .map(([k, t]) => [t, registros.filter((r) => r._tipo === k).length])
    .filter(([, n]) => n);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-borde bg-white shadow-sm">
      <header className="flex items-center justify-between bg-linear-to-br from-c1 to-c2 px-5 py-4 text-white">
        <div>
          <h4 className="text-lg font-bold">Manzana {manzana}</h4>
          <span className="text-[13px] opacity-90">
            {registros.length} registro{registros.length === 1 ? "" : "s"}
          </span>
        </div>
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/20">
          <TreeDeciduous size={24} />
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-3.5 px-5 py-4 text-sm">
        <div className="flex flex-wrap gap-1.5">
          {porTipo.map(([t, n]) => (
            <Pastilla key={t.nombre} className={t.clase}>
              {t.nombre} {n}
            </Pastilla>
          ))}
        </div>
        <Grupo titulo="Especies principales">
          {contar(registros.map(especieDe))
            .slice(0, 4)
            .map(([e, c]) => (
              <Pastilla key={e}>
                {e} · {c}
              </Pastilla>
            ))}
        </Grupo>
        <Grupo titulo="Urgencia de intervención">
          {contar(registros.map(urgenciaDe)).map(([u, c]) => (
            <Pastilla key={u} className={claseUrgencia(u)}>
              {u} · {c}
            </Pastilla>
          ))}
        </Grupo>
      </div>

      <footer className="flex flex-wrap gap-2 border-t border-borde bg-c5 px-5 py-3.5">
        <Boton tamano="sm" icono={Plus} className="w-full" onClick={onAgregar}>
          Agregar árbol a esta manzana
        </Boton>
        <Boton tamano="sm" icono={Folder} className="flex-1" onClick={onVer}>
          Ver registros
        </Boton>
        <Boton
          tamano="sm"
          variante="primario"
          icono={FileDown}
          className="flex-1"
          onClick={onInforme}
        >
          Informe manzana
        </Boton>
      </footer>
    </article>
  );
}
