/* Configuración de Vite: React + Tailwind + PWA (funciona sin internet) */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

/* Ruta donde se publica la app:
   · npm run dev   → "/"           (http://localhost:5173/)
   · npm run build → "/arbolado/"  (https://proyectos.municipalidadchillan.cl/arbolado/) */
export default defineConfig(({ command, mode }) => {
  // El proxy apunta al mismo puerto que usa Express (PORT del .env, o 3001)
  const puertoApi = loadEnv(mode, process.cwd(), "").PORT || 3001;
  const base = process.env.VITE_BASE || (command === "build" ? "/arbolado/" : "/");
  return {
  base,
  root: "client",
  build: { outDir: "dist", emptyOutDir: true, chunkSizeWarningLimit: 1500 },
  server: {
    port: 5173,
    // En desarrollo, /api va al servidor Express local
    proxy: { "/api": `http://localhost:${puertoApi}` }
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "Arbolado Urbano · Registro de Campo",
        short_name: "Arbolado",
        description: "Censo Arbolado Urbano 2026 – Croquis de perfil vial y Matriz VTA",
        lang: "es-CL",
        theme_color: "#0b5c8f",
        background_color: "#f2f9fe",
        display: "standalone",
        start_url: base,
        scope: base, // el service worker controla solo /arbolado/, no todo el dominio
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallbackDenylist: [/\/api\//]
      }
    })
  ]
};
});
