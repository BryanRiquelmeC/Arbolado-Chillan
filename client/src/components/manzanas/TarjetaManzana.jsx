/* Resumen de una manzana: al hacer clic se abre el detalle (registros y reportes) */
import { FileDown, Plus, TreeDeciduous } from "lucide-react";
import Boton from "../ui/Boton.jsx";
import Pastilla from "../ui/Pastilla.jsx";
import BarraAvance from "./BarraAvance.jsx";
import { TIPOS, claseUrgencia, contar, especieDe, urgenciaDe } from "../../utils/registros.js";

function Grupo({ titulo, children }) {
  return (
    <div>
      <p className="etiqueta mb-1.5 text-xs">{titulo}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export default function TarjetaManzana({ manzana, registros, onInforme, onAgregar, onPrevia }) {
  const porTipo = Object.entries(TIPOS)
    .map(([k, t]) => [t, registros.filter((r) => r._tipo === k).length])
    .filter(([, n]) => n);
  const urgencias = contar(registros.map(urgenciaDe));

  const teclado = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPrevia();
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-borde bg-white shadow-sm transition-[translate,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-c2/30 hover:shadow-[0_8px_18px_-8px_rgba(11,92,143,0.18)]">
      {/* Zona clickeable: abre el detalle de la manzana */}
      <div
        role="button"
        tabIndex={0}
        onClick={onPrevia}
        onKeyDown={teclado}
        title="Ver registros de la manzana"
        className="flex flex-1 cursor-pointer flex-col outline-none focus-visible:ring-2 focus-visible:ring-c2"
      >
        <header className="flex items-center justify-between bg-gradient-to-br from-c1 to-c2 px-5 py-4 text-white">
          <div>
            <h4 className="text-lg font-bold transition-[translate] duration-300 group-hover:translate-x-0.5">Manzana {manzana}</h4>
            <span className="text-[13px] opacity-90">
              {registros.length} registro{registros.length === 1 ? "" : "s"}
            </span>
          </div>
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/20 transition-[background-color,scale,box-shadow] duration-300 group-hover:scale-105 group-hover:bg-white/28 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.25)]">
            <TreeDeciduous size={24} />
          </span>
        </header>

        <div className="flex flex-1 flex-col gap-3.5 px-5 py-4 text-sm">
          <BarraAvance registros={registros} />
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
          {urgencias.length > 0 && (
            <Grupo titulo="Urgencia de intervención">
              {urgencias.map(([u, c]) => (
                <Pastilla key={u} className={claseUrgencia(u)}>
                  {u} · {c}
                </Pastilla>
              ))}
            </Grupo>
          )}
        </div>
      </div>

      <footer className="flex flex-wrap gap-2 border-t border-borde bg-c5 px-5 py-3.5">
        <Boton tamano="sm" icono={Plus} className="flex-1" onClick={onAgregar}>
          Agregar árbol
        </Boton>
        <Boton tamano="sm" variante="primario" icono={FileDown} className="flex-1" onClick={onInforme}>
          Informe PDF
        </Boton>
      </footer>
    </article>
  );
}
