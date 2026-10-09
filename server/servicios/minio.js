/* =============================================================
   Fotos en MinIO (bucket "arbolado")
   La app sigue tomando/cargando fotos en el dispositivo (data URL).
   Al guardar, el servidor las sube a MinIO ordenadas así:

     arbolado/
       manzana-27/
         censo/27-EP-08-045/foto-01.jpg
         matriz-vta/itata-652_ab12cd/p41-detalle.jpg
         croquis/arauco-171_9f3e01/foto-01.jpg
       sin-manzana/...

   y en PostgreSQL queda solo la ruta: "/api/fotos/manzana-27/censo/…jpg"
   ============================================================= */
import "dotenv/config";
import { Client } from "minio";
import { randomBytes } from "node:crypto";

/* Acepta los nombres que entregó TI (MINIO_ENDPOINT, MINIO_ACCESS_KEY…)
   y también los anteriores (MINIO_HOST, MINIO_USUARIO…) */
const env = (...nombres) => nombres.map((n) => process.env[n]).find((v) => v !== undefined && v !== "");

const CONFIG = {
  host: env("MINIO_ENDPOINT", "MINIO_HOST"),
  puerto: Number(env("MINIO_PORT", "MINIO_PUERTO") || 9000),
  ssl: env("MINIO_USE_SSL", "MINIO_SSL") === "true",
  usuario: env("MINIO_ACCESS_KEY", "MINIO_USUARIO"),
  clave: env("MINIO_SECRET_KEY", "MINIO_CLAVE")
};
const BUCKET = env("MINIO_BUCKET") || "arbolado";
const activo = Boolean(CONFIG.host && CONFIG.usuario && CONFIG.clave);

const minio = activo
  ? new Client({
      endPoint: CONFIG.host,
      port: CONFIG.puerto,
      useSSL: CONFIG.ssl,
      accessKey: CONFIG.usuario,
      secretKey: CONFIG.clave
    })
  : null;

const CARPETA_TIPO = { censo: "censo", encuesta: "matriz-vta", croquis: "croquis" };

/** Texto apto para nombre de carpeta: "Itata 652" → "itata-652" */
const limpio = (t) =>
  String(t || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 50);

/** Carpeta del registro dentro del bucket */
function carpetaDe(r) {
  const mz = limpio(r.manzana || r.p1);
  const manzana = mz ? `manzana-${mz}` : "sin-manzana";
  const tipo = CARPETA_TIPO[r._tipo] || "otros";
  const nombre = r.id_arbol
    ? limpio(r.id_arbol)
    : `${limpio(r.direccion) || "sin-direccion"}_${limpio(r._id).slice(-6)}`;
  return `${manzana}/${tipo}/${nombre}`;
}

/** Revisa la conexión al iniciar (no crea el bucket: debe existir) */
export async function revisarMinio() {
  if (!activo) return console.log("[minio] sin configurar: las fotos quedan en PostgreSQL");
  try {
    const existe = await minio.bucketExists(BUCKET);
    console.log(existe ? `[minio] conectado · bucket "${BUCKET}"` : `[minio] ¡no existe el bucket "${BUCKET}"!`);
  } catch (e) {
    console.error(`[minio] no se pudo conectar a ${CONFIG.host}:${CONFIG.puerto} →`, e.message);
    if (CONFIG.puerto === 9001)
      console.error("[minio] ojo: 9001 suele ser la consola web; la API normalmente es el 9000");
  }
}

/** Sube una data URL y devuelve la ruta pública; si ya era ruta, la deja igual */
async function subir(img, ruta) {
  if (typeof img !== "string" || !img.startsWith("data:image")) return img;
  const [cabecera, base64] = img.split(",");
  const tipo = cabecera.match(/data:(.*?);/)?.[1] || "image/jpeg";
  const ext = tipo.includes("png") ? "png" : "jpg";
  const nombre = `${ruta}-${randomBytes(3).toString("hex")}.${ext}`;
  await minio.putObject(BUCKET, nombre, Buffer.from(base64, "base64"), undefined, {
    "Content-Type": tipo
  });
  return `/api/fotos/${nombre}`;
}

/**
 * Reemplaza todas las fotos del registro (data URL) por rutas de MinIO.
 * Si MinIO no está configurado o falla, el registro se guarda igual con
 * las fotos dentro (no se pierde nada) y se reintenta en el próximo guardado.
 */
export async function subirFotosDe(r) {
  if (!activo) return r;
  const base = carpetaDe(r);
  try {
    // Listas de fotos: fotos (croquis/censo) y fotos_seguimiento (estado del trabajo)
    for (const [campo, prefijo] of [["fotos", "foto"], ["fotos_seguimiento", "trabajo"]]) {
      if (!Array.isArray(r[campo])) continue;
      r[campo] = await Promise.all(
        r[campo].map(async (f, i) => ({
          ...f,
          img: await subir(f.img, `${base}/${prefijo}-${String(i + 1).padStart(2, "0")}`)
        }))
      );
    }
    // Fotos sueltas de la Matriz VTA (preguntas tipo foto: p23, p41…)
    for (const [k, v] of Object.entries(r)) {
      if (typeof v === "string" && v.startsWith("data:image")) r[k] = await subir(v, `${base}/${k}`);
    }
  } catch (e) {
    console.error("[minio] no se pudieron subir fotos de", r._id, "→", e.message);
  }
  return r;
}

/** GET /api/fotos/<ruta> → entrega la imagen desde MinIO */
export async function enviarFoto(nombre, res) {
  if (!activo) return res.status(404).end();
  try {
    const info = await minio.statObject(BUCKET, nombre);
    res.set("Content-Type", info.metaData?.["content-type"] || "image/jpeg");
    res.set("Cache-Control", "private, max-age=31536000, immutable");
    (await minio.getObject(BUCKET, nombre)).pipe(res);
  } catch {
    res.status(404).end();
  }
}
