/* Punto de entrada de React */
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { sesion } from "./services/api.js";
import "./index.css";

function Raiz() {
  const [conSesion, setConSesion] = useState(!!sesion.token());
  if (!conSesion) return <Login onEntrar={() => setConSesion(true)} />;
  return (
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Raiz />
  </StrictMode>
);