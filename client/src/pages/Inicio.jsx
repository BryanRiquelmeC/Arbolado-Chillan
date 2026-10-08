/* Página de inicio: cifras y accesos a cada módulo */
import { ClipboardList, Folder, LayoutGrid, Ruler } from "lucide-react";
import PageHeader from "../components/ui/PageHeader.jsx";
import TarjetaCifra from "../components/inicio/TarjetaCifra.jsx";
import TarjetaModulo from "../components/inicio/TarjetaModulo.jsx";
import { useApp } from "../context/AppContext.jsx";
import { manzanaDe } from "../utils/registros.js";

const MODULOS = [
  {
    a: "/croquis",
    icono: Ruler,
    titulo: "Extracción y plantación de árboles",
    texto:
      "Perfil transversal de la calle: anchos de vereda, platabanda y calzada, dónde plantar y qué especie, red eléctrica, datos del árbol y fotos."
  },
  {
    a: "/matriz-vta",
    icono: ClipboardList,
    titulo: "Formulario de evaluación",
    texto:
      "Matriz VTA (Evaluación Visual del Árbol): 20 preguntas clave para decidir sobre el árbol, con defectos, riesgo, urgencia, GPS y foto."
  },
  {
    a: "/manzanas",
    icono: LayoutGrid,
    titulo: "Manzanas",
    texto:
      "Árboles agrupados por manzana: resumen de especies y urgencias, agregar árboles nuevos e informe PDF por manzana."
  },
  {
    a: "/registros",
    icono: Folder,
    titulo: "Registros y reportes",
    texto:
      "Buscar por dirección, manzana, especie o código; crear, editar y eliminar árboles, agregar fotos, importar Excel y descargar PDF."
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

      <div className="mb-7 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {cifras.map(([texto, valor]) => (
          <TarjetaCifra key={texto} texto={texto} valor={valor} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {MODULOS.map((m) => (
          <TarjetaModulo key={m.a} {...m} />
        ))}
      </div>
    </>
  );
}
