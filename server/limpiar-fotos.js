/* =============================================================
   Limpieza de fotos duplicadas en MinIO
   Borra del bucket las fotos que NINGÚN registro usa (copias que
   se subieron de más antes de la corrección).

   1) Revisar sin borrar nada:   node server/limpiar-fotos.js
   2) Borrar de verdad:          node server/limpiar-fotos.js --borrar
   ============================================================= */
import "dotenv/config";
import * as repo from "./repositorios/index.js";
import { borrarFotos, listarFotos } from "./servicios/minio.js";

const BORRAR = process.argv.includes("--borrar");

// 1) Rutas de fotos que sí usan los registros
const ids = (await repo.indice()).map((f) => f.id);
const usadas = new Set();
for (let i = 0; i < ids.length; i += 200) {
  for (const r of await repo.obtener(ids.slice(i, i + 200))) {
    JSON.stringify(r).replace(/\/api\/fotos\/([^"\\]+)/g, (_, ruta) => usadas.add(ruta));
  }
}

// 2) Fotos en MinIO que nadie usa
const todas = await listarFotos();
const sobran = todas.filter((n) => !usadas.has(n));

console.log(`Registros revisados: ${ids.length}`);
console.log(`Fotos en MinIO: ${todas.length} · en uso: ${todas.length - sobran.length} · sin uso: ${sobran.length}`);
sobran.slice(0, 30).forEach((n) => console.log("  sobra →", n));
if (sobran.length > 30) console.log(`  … y ${sobran.length - 30} más`);

if (!sobran.length) console.log("Nada que limpiar ✔");
else if (BORRAR) {
  for (let i = 0; i < sobran.length; i += 500) await borrarFotos(sobran.slice(i, i + 500));
  console.log(`Borradas ${sobran.length} fotos sin uso ✔`);
} else console.log('\nNo se borró nada. Para borrar:  node server/limpiar-fotos.js --borrar');
process.exit(0);
