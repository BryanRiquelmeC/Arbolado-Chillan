/* =============================================================
   API de registros
   GET    /api/registros/indice    → [{ id, actualizado }]  (lista liviana)
   POST   /api/registros/obtener   → body { ids }       → [registro]
   PUT    /api/registros           → body { registros } (crear/actualizar)
   DELETE /api/registros           → body { ids }
   GET    /api/registros/manzanas  → resumen por manzana
   ============================================================= */
import { Router } from "express";
import * as repo from "../repositorios/index.js";
import { leerIds, leerRegistros } from "../validacion.js";

const router = Router();

/** Envuelve una función async y pasa los errores al manejador central */
const ruta = (fn) => (req, res, next) => fn(req, res).catch(next);

router.get(
  "/indice",
  ruta(async (req, res) => res.json(await repo.indice()))
);

router.post(
  "/obtener",
  ruta(async (req, res) => res.json(await repo.obtener(leerIds(req.body))))
);

router.put(
  "/",
  ruta(async (req, res) => res.json({ guardados: await repo.guardar(leerRegistros(req.body)) }))
);

router.delete(
  "/",
  ruta(async (req, res) => res.json({ eliminados: await repo.eliminar(leerIds(req.body)) }))
);

router.get(
  "/manzanas",
  ruta(async (req, res) => res.json(await repo.resumenManzanas()))
);

export default router;
