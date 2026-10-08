/* Árboles agrupados por manzana, con resumen e informe PDF */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader.jsx";
import Vacio from "../components/ui/Vacio.jsx";
import TarjetaManzana from "../components/manzanas/TarjetaManzana.jsx";
import { useApp } from "../context/AppContext.jsx";
import { pdfManzana } from "../services/pdf.js";
import { agruparPorManzana } from "../utils/registros.js";

export default function Manzanas() {
  const { registros } = useApp();
  const navegar = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const grupos = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return agruparPorManzana(registros).filter(([m]) => m.toLowerCase().includes(q));
  }, [registros, busqueda]);

  return (
    <>
      <PageHeader
        titulo="Registros por manzana"
        subtitulo="Árboles agrupados por manzana con su resumen técnico"
      >
        <input
          type="search"
          className="campo w-full sm:w-64"
          placeholder="Buscar manzana…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </PageHeader>

      {!grupos.length && (
        <Vacio>
          {registros.length
            ? "Ninguna manzana coincide"
            : "Aún no hay registros. Importe un Excel o complete un formulario."}
        </Vacio>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {grupos.map(([m, lista]) => (
          <TarjetaManzana
            key={m}
            manzana={m}
            registros={lista}
            onVer={() => navegar(`/registros?manzana=${encodeURIComponent(m)}`)}
            onInforme={() => pdfManzana(m, lista)}
            onAgregar={() => navegar(`/registros?manzana=${encodeURIComponent(m)}&nuevo=1`)}
          />
        ))}
      </div>
    </>
  );
}
