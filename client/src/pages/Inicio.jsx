/* Página de inicio: cifras y accesos a cada módulo */
import { ClipboardList, LayoutGrid, Ruler } from "lucide-react";
import PageHeader from "../components/ui/PageHeader.jsx";
import TarjetaCifra from "../components/inicio/TarjetaCifra.jsx";
import TarjetaModulo from "../components/inicio/TarjetaModulo.jsx";
import { useApp } from "../context/AppContext.jsx";
import { manzanaDe } from "../utils/registros.js";

const MODULOS = [
  {
    a: "/croquis",
    icono: Ruler,
    titulo: "Croquis de perfil vial",
    texto:
      "Corte transversal de la calle: anchos de vereda, platabanda y calzada, materiales, alcorques y árboles a plantar."
  },
  {
    a: "/matriz-vta",
    icono: ClipboardList,
    titulo: "Formulario de evaluación",
    texto:
      "Censo Arbolado Urbano 2026 – Matriz VTA (Evaluación Visual del Árbol): 20 preguntas clave, con fotos y GPS."
  },
  {
    a: "/manzanas",
    icono: LayoutGrid,
    titulo: "Manzanas",
    texto:
      "Registros y reportes por manzana: buscar, agregar, editar, eliminar, importar Excel e informe PDF."
  }
];

export default function Inicio() {
  const { registros } = useApp();
  const cuenta = (tipo) => registros.filter((r) => r._tipo === tipo).length;

  const cifras = [
    ["Registros totales", registros.length],
    ["Croquis perfil vial", cuenta("croquis")],
    ["Matriz VTA", cuenta("encuesta")],
    ["Censo importado (Excel)", cuenta("censo")],
    ["Manzanas registradas", new Set(registros.map(manzanaDe).filter(Boolean)).size]
  ];

  return (
    <>
      <PageHeader
        titulo="Panel principal"
        subtitulo="Seleccione un módulo para comenzar un registro"
      />

      {/* Cifras: en móvil la principal ocupa todo el ancho y el resto va de a 2; desde lg, 5 en una fila */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {cifras.map(([texto, valor], i) => (
          <TarjetaCifra
            key={texto}
            texto={texto}
            valor={valor}
            destacada={i === 0}
            className={i === 0 ? "col-span-2 lg:col-span-1" : ""}
          />
        ))}
      </section>

      <h3 className="mb-3 text-sm font-bold tracking-wide text-suave uppercase">Módulos</h3>
      {/* Módulos: 1 columna en móvil, 3 desde tablet (sin huecos vacíos) */}
      <section className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {MODULOS.map((m) => (
          <TarjetaModulo key={m.a} {...m} />
        ))}
      </section>
    </>
  );
}
