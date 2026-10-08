/* =============================================================
   Acceso con contraseña única (sin usuario ni correo)
   La contraseña vive en .env (APP_CLAVE)
   ============================================================= */
import crypto from "node:crypto";
import { Router } from "express";

const DURACION_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

const firmar = (texto) =>
  crypto.createHmac("sha256", process.env.APP_SECRETO || "cambiar").update(texto).digest("hex");

const iguales = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/** Crea un token: vencimiento.firma */
function crearToken() {
  const vence = String(Date.now() + DURACION_MS);
  return `${vence}.${firmar(vence)}`;
}

function tokenValido(token = "") {
  const [vence, firma] = token.split(".");
  return vence && firma && iguales(firma, firmar(vence)) && Number(vence) > Date.now();
}

/* ---------- Rutas: POST /api/login ---------- */
export const rutasAuth = Router();

rutasAuth.post("/login", (req, res) => {
  const { clave } = req.body || {};
  if (!process.env.APP_CLAVE) return res.status(500).json({ error: "Falta APP_CLAVE en .env" });
  if (!clave || !iguales(clave, process.env.APP_CLAVE)) {
    // Pequeña pausa para dificultar intentos repetidos
    return setTimeout(() => res.status(401).json({ error: "Contraseña incorrecta" }), 800);
  }
  res.json({ token: crearToken() });
});

/* ---------- Protección de rutas ---------- */
export function requiereLogin(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (tokenValido(token)) return next();
  res.status(401).json({ error: "Sesión no válida" });
}