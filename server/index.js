/* =============================================================
   Servidor
   · npm run dev  → API en http://localhost:3001 (Vite en 5173)
   · npm start    → API + app compilada (client/dist) en un solo puerto
   ============================================================= */
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import app from "./app.js";

const PUERTO = process.env.PORT || 3001;
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../client/dist");

app.use(express.static(dist));
app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(dist, "index.html")));

app.listen(PUERTO, () => console.log(`Arbolado Urbano en http://localhost:${PUERTO}`));
