/* Almacenamiento en PostgreSQL (misma interfaz que archivoJson.js) */
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
  // ssl: { rejectUnauthorized: false }, // activar solo si el servidor exige SSL
});

const manzanaDe = (r) => {
  const m = r._tipo === "encuesta" ? r.p1 : r.manzana;
  return m === undefined || m === null || String(m).trim() === "" ? null : String(m).trim();
};
const especieDe = (r) =>
  (r._tipo === "encuesta" ? (r.p3 === "Otros" ? r.p3_otro : r.p3) : r.especie) || null;
const urgenciaDe = (r) =>
  (r._tipo === "encuesta" ? String(r.p32 || "").split(" (")[0] : r.urgencia) || null;

export async function indice() {
  const { rows } = await pool.query("SELECT id, actualizado FROM registros");
  return rows.map((f) => ({ id: f.id, actualizado: f.actualizado.toISOString() }));
}

export async function obtener(ids) {
  const { rows } = await pool.query("SELECT datos FROM registros WHERE id = ANY($1)", [ids]);
  return rows.map((f) => f.datos);
}

export async function guardar(lista) {
  const cliente = await pool.connect();
  try {
    await cliente.query("BEGIN");
    for (const r of lista) {
      const mz = manzanaDe(r);

      // La manzana debe existir antes del registro (llave foránea fk_registros_manzana)
      if (mz) {
        await cliente.query(
          "INSERT INTO manzanas (numero) VALUES ($1) ON CONFLICT (numero) DO NOTHING",
          [mz]
        );
      }

      await cliente.query(
        `INSERT INTO registros
           (id, tipo, manzana, direccion, especie, urgencia, creado, actualizado, datos)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           tipo = EXCLUDED.tipo, manzana = EXCLUDED.manzana,
           direccion = EXCLUDED.direccion, especie = EXCLUDED.especie,
           urgencia = EXCLUDED.urgencia, actualizado = EXCLUDED.actualizado,
           datos = EXCLUDED.datos
         WHERE registros.actualizado <= EXCLUDED.actualizado`,
        [
          r._id, r._tipo, mz, r.direccion || null, especieDe(r), urgenciaDe(r),
          r._creado || r._actualizado, r._actualizado || new Date().toISOString(), r
        ]
      );
    }
    await cliente.query("COMMIT");
    return { guardados: lista.length };
  } catch (e) {
    await cliente.query("ROLLBACK");
    throw e;
  } finally {
    cliente.release();
  }
}

export async function eliminar(ids) {
  const { rowCount } = await pool.query("DELETE FROM registros WHERE id = ANY($1)", [ids]);
  return { eliminados: rowCount };
}

export async function resumenManzanas() {
  const { rows } = await pool.query(`
    SELECT COALESCE(manzana, 'Sin manzana') AS manzana,
           COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE tipo = 'croquis')::int  AS croquis,
           COUNT(*) FILTER (WHERE tipo = 'encuesta')::int AS encuestas,
           COUNT(*) FILTER (WHERE tipo = 'censo')::int    AS censo
    FROM registros GROUP BY 1 ORDER BY 1`);
  return rows;
}