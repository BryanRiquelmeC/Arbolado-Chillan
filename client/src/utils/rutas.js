/* =============================================================
   Rutas según dónde esté publicada la app
   · En el PC (npm run dev):   BASE = "/"
   · En el servidor:           BASE = "/arbolado/"  (proyectos.municipalidadchillan.cl/arbolado/)
   Todo lo que va al servidor (API y fotos) debe pasar por aquí.
   ============================================================= */
export const BASE = import.meta.env.BASE_URL; // lo define Vite según "base"
const PREFIJO = BASE.replace(/\/$/, ""); // "" o "/arbolado"

/** "/api/registros" , "/arbolado/api/registros" */
export const rutaApi = (ruta) => PREFIJO + ruta;

/** Fotos guardadas en MinIO ("/api/fotos/…"): agrega el prefijo, URL quedan igual. */
export const urlFoto = (src) =>
  typeof src === "string" && src.startsWith("/api/") ? rutaApi(src) : src;
