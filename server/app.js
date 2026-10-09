/* =============================================================
   Aplicación Express: middlewares, rutas y manejo de errores
   ============================================================= */
import "dotenv/config";
import express from "express";
import cors from "cors";
import registros from "./routes/registros.js";
import { rutasAuth, requiereLogin } from "./auth.js";
import { enviarFoto, revisarMinio } from "./servicios/minio.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "25mb" })); // los registros pueden incluir fotos

/** Estado del servidor (la app lo usa para saber si puede sincronizar) */
app.get("/api/salud", (req, res) => res.json({ ok: true, nube: true }));

app.use("/api", rutasAuth);
app.get("/api/fotos/*ruta", (req, res) => enviarFoto([].concat(req.params.ruta).join("/"), res));
app.use("/api/registros", requiereLogin, registros);

/** Ruta inexistente dentro de /api */
app.use("/api", (req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

/** Manejo central de errores */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.status) console.error("[api]", err);
  res.status(err.status || 500).json({ error: err.message || "Error interno" });
});

revisarMinio();
export default app;
