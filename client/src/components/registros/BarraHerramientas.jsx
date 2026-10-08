/* Botón superior de Registros: Importar Excel */
import { FileSpreadsheet } from "lucide-react";
import { BotonArchivo } from "../ui/Boton.jsx";

export default function BarraHerramientas({ onImportarExcel }) {
  return (
    <BotonArchivo
      variante="primario"
      icono={FileSpreadsheet}
      accept=".xlsx,.xls,.csv"
      onArchivo={onImportarExcel}
      className="flex-1 sm:flex-none"
    >
      Importar Excel
    </BotonArchivo>
  );
}