/* Configuración de Vite: React + Tailwind + PWA (funciona sin internet) */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
// HTTPS en red local (para GPS/cámara desde otros equipos):
// 1) npm install -D @vitejs/plugin-basic-ssl   2) descomente esta línea y basicSsl() abajo
// import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  root: "client",
  build: { outDir: "dist", emptyOutDir: true, chunkSizeWarningLimit: 1500 },
  server: {
    host: true, // acepta conexiones desde otros equipos de la red (usar la IP del PC)
    port: 5173,
    // En desarrollo, /api va al servidor Express local
    proxy: { "/api": "http://localhost:3001" }
  },
  plugins: [
    react(),
    tailwindcss(),
    // basicSsl(),
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
        start_url: "/",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallbackDenylist: [/^\/api/]
      }
    })
  ]
});