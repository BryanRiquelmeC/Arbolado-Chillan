/* Rutas de la aplicación */
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Inicio from "./pages/Inicio.jsx";
import Croquis from "./pages/Croquis.jsx";
import MatrizVTA from "./pages/MatrizVTA.jsx";
import Manzanas from "./pages/Manzanas.jsx";


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="croquis" element={<Croquis />} />
        <Route path="matriz-vta" element={<MatrizVTA />} />
        <Route path="manzanas" element={<Manzanas />} />
        <Route path="registros" element={<Navigate to="/manzanas" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
