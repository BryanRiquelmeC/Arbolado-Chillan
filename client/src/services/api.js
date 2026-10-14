import { rutaApi, BASE } from "../utils/rutas.js";

const CLAVE_TOKEN = "sesion";

export const sesion = {
  token: () => localStorage.getItem(CLAVE_TOKEN),
  guardar: (t) => localStorage.setItem(CLAVE_TOKEN, t),
  cerrar: () => {
    localStorage.removeItem(CLAVE_TOKEN);
    window.location.href = BASE; // "/arbolado/" en el servidor, "/" en el PC
  }
};

async function pedir(ruta, opciones = {}) {
  const res = await fetch(rutaApi("/api" + ruta), {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sesion.token() || ""}`,
      ...(opciones.headers || {})
    },
    body: opciones.body ? JSON.stringify(opciones.body) : undefined
  });
  const datos = await res.json().catch(() => ({}));
  if (res.status === 401 && ruta !== "/login") sesion.cerrar(); // sesión vencida
  if (!res.ok) throw new Error(datos.error || `Error ${res.status}`);
  return datos;
}

export const api = {
  login: (clave) => pedir("/login", { method: "POST", body: { clave } }),
  salud: () => pedir("/salud"),
  indice: () => pedir("/registros/indice"),
  obtener: (ids) => pedir("/registros/obtener", { method: "POST", body: { ids } }),
  guardar: (registros) => pedir("/registros", { method: "PUT", body: { registros } }),
  eliminar: (ids) => pedir("/registros", { method: "DELETE", body: { ids } })
};