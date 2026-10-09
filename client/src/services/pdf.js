import { nombreEstado, siguienteDe, terminado } from "../config/seguimiento.js";
/* =============================================================
   Reportes PDF
   · pdfRegistro(r)   → croquis, Matriz VTA o censo (según tipo)
   · pdfManzana(m, l) → informe resumen de una manzana
   ============================================================= */
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { ENCUESTA } from "../config/encuesta.js";
import { ETIQUETAS, GRUPOS } from "../config/croquis.js";
import { croquisPng } from "../utils/croquis.js";
import { Importar } from "./importar.js";
import {
  TIPOS,
  comparar,
  contar,
  especieDe,
  fichaCenso,
  legible,
  tituloDe,
  urgenciaDe
} from "../utils/registros.js";

const AZUL = [30, 136, 201];
const FIRMA = { nombre: "Rodolfo Gazmuri Sánchez", cargo: "Certificado en Arbolado Urbano" };
const PIE = "by Victor Bryan Riquelme Cabrera";

/* ---------- Piezas comunes ---------- */

function documento(titulo, subtitulo) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(11, 92, 143);
  doc.rect(0, 0, W, 26, "F");
  doc.setFillColor(91, 180, 234);
  doc.rect(0, 26, W, 2, "F");
  doc.setTextColor(255);
  doc.setFont(undefined, "bold");
  doc.setFontSize(15);
  doc.text(titulo, 14, 13);
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  doc.text(subtitulo, 14, 20);
  return { doc, W };
}

function tabla(doc, y, cabecera, cuerpo, extra = {}) {
  autoTable(doc, {
    startY: y,
    head: [cabecera],
    body: cuerpo,
    theme: "grid",
    margin: { left: 14, right: 14 },
    headStyles: { fillColor: AZUL, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [242, 249, 254] },
    styles: { fontSize: 9, cellPadding: 2, lineColor: [207, 227, 242], overflow: "linebreak" },
    ...extra
  });
  return doc.lastAutoTable.finalY + 6;
}

const columnaClave = {
  columnStyles: { 0: { cellWidth: 68, fontStyle: "bold", textColor: [22, 50, 74] } }
};

function cerrar(doc, W, archivo, yFinal) {
  // La firma va debajo de lo último que se dibujó (tabla o fotos), nunca encima
  let y = (yFinal ?? doc.lastAutoTable?.finalY ?? 220) + 20;
  if (y > 250) {
    doc.addPage();
    y = 40;
  }
  doc.setDrawColor(11, 92, 143);
  doc.line(W - 90, y, W - 14, y);
  doc.setTextColor(22, 50, 74);
  doc.setFont(undefined, "bold");
  doc.setFontSize(10);
  doc.text(FIRMA.nombre, W - 52, y + 5, { align: "center" });
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  doc.text(FIRMA.cargo, W - 52, y + 10, { align: "center" });
  const paginas = doc.getNumberOfPages();
  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Página ${i} de ${paginas}`, W - 14, 272, { align: "right" });
    doc.text(PIE, 14, 272);
  }
  doc.save(archivo);
}

/* Fotos en grilla de 2 columnas, tamaño acotado (máx. 70 mm de alto) */
const FOTO = { columnas: 2, separacion: 6, altoMax: 70 };

function dibujarFotos(doc, W, y, lista) {
  if (!lista.length) return y;
  const anchoCelda = (W - 28 - FOTO.separacion * (FOTO.columnas - 1)) / FOTO.columnas;
  let fila = [];
  const pintarFila = () => {
    const medidas = fila.map(([, img]) => {
      const p = doc.getImageProperties(img);
      let ancho = anchoCelda;
      let alto = (ancho * p.height) / p.width;
      if (alto > FOTO.altoMax) {
        alto = FOTO.altoMax;
        ancho = (alto * p.width) / p.height;
      }
      return { ancho, alto };
    });
    const altoFila = Math.max(...medidas.map((m) => m.alto)) + 12;
    if (y + altoFila > 262) {
      doc.addPage();
      y = 20;
    }
    fila.forEach(([titulo, img], k) => {
      const x = 14 + k * (anchoCelda + FOTO.separacion);
      const { ancho, alto } = medidas[k];
      doc.setTextColor(11, 92, 143);
      doc.setFont(undefined, "bold");
      doc.setFontSize(8.5);
      const xImg = x + (anchoCelda - ancho) / 2; // foto centrada en su columna
      // Título centrado justo encima de la foto
      doc.text(titulo, xImg + ancho / 2, y + 4, { align: "center", maxWidth: anchoCelda });
      doc.addImage(img, "JPEG", xImg, y + 7, ancho, alto);
    });
    y += altoFila;
    fila = [];
  };
  for (const item of lista) {
    fila.push(item);
    if (fila.length === FOTO.columnas) pintarFila();
  }
  if (fila.length) pintarFila();
  return y;
}

/** Fotografías opcionales al final del PDF (croquis y censo) */
function fotosPdf(doc, W, y, fotos = []) {
  return dibujarFotos(
    doc,
    W,
    y,
    fotos.filter((f) => f?.img).map((f, i) => [`Fotografía ${i + 1}${f.nota ? ": " + f.nota : ""}`, f.img])
  );
}

const nombreArchivo = (t) => Importar.slug(t || "sin_direccion").replace(/-/g, "_");
const subtitulo = (r) =>
  `Registro ${r._id.toUpperCase()}  ·  ${new Date(r._creado).toLocaleString("es-CL")}`;

/* ---------- Por tipo ---------- */

async function pdfCroquis(r) {
  const { doc, W } = documento("CROQUIS DE PERFIL VIAL (CORTE TRANSVERSAL)", subtitulo(r));
  const png = await croquisPng(r);
  const ancho = W - 28;
  doc.addImage(png, "PNG", 14, 34, ancho, ancho * 0.3);
  let y = 34 + ancho * 0.3 + 6;
  for (const [titulo, ids] of GRUPOS) {
    y = tabla(
      doc,
      y,
      [titulo, ""],
      ids.map((id) => [ETIQUETAS[id] || id, legible(r[id])]),
      columnaClave
    );
  }
  y = fotosPdf(doc, W, y, r.fotos);
  cerrar(doc, W, `croquis_${nombreArchivo(r.direccion)}_${r._id}.pdf`, y);
}

function pdfEncuesta(r) {
  const { doc, W } = documento(ENCUESTA.titulo.toUpperCase(), subtitulo(r));
  const fotos = [];
  const valor = (p) => {
    let v = r[p.id];
    if (p.type === "photo") {
      if (v) fotos.push([`${p.n}. ${p.label}`, v]);
      return v ? "Ver fotografía adjunta" : "—";
    }
    if (v === "Otros" && r[p.id + "_otro"]) v = "Otros: " + r[p.id + "_otro"];
    if (p.type === "gps" && r[p.id + "_gps"]) v = (v || "") + "  ·  GPS: " + r[p.id + "_gps"];
    return legible(v);
  };
  let y = 36;
  for (const s of ENCUESTA.secciones) {
    const cuerpo = s.preguntas.map((p) => [
      `${p.n ? p.n + ". " : ""}${p.label}${p.unit ? ` (${p.unit})` : ""}`,
      valor(p)
    ]);
    y = tabla(doc, y, [s.titulo, ""], cuerpo, columnaClave);
  }
  y = dibujarFotos(doc, W, y, fotos);
  cerrar(doc, W, `matriz_vta_${nombreArchivo(r.direccion)}_${r._id}.pdf`, y);
}

function pdfCenso(r) {
  const { doc, W } = documento(
    "INFORME VTA – CENSO ARBOLADO URBANO 2026",
    `ID ${r.id_arbol || r._id}  ·  Manzana ${r.manzana}  ·  ${r.fecha || ""}`
  );
  let y = tabla(
    doc,
    36,
    ["Identificación", ""],
    fichaCenso(r).map(([k, v]) => [k, v || "—"]),
    columnaClave
  );
  if (r.informe_url || r.fotos_url) {
    y = tabla(
      doc,
      y,
      ["Enlaces", ""],
      [
        ["Informe original", r.informe_url || "—"],
        ["Fotografías", r.fotos_url || "—"]
      ],
      columnaClave
    );
  }
  y = tabla(doc, y, ["Evaluación completa", ""], r.campos || [], columnaClave);
  y = fotosPdf(doc, W, y, r.fotos);
  cerrar(doc, W, `censo_mz${r.manzana}_${Importar.slug(r.id_arbol || r._id)}.pdf`, y);
}

/** Foto guardada en MinIO ("/api/fotos/…") → data URL (jsPDF solo acepta data URL) */
async function aDataUrl(src) {
  if (typeof src !== "string" || !src.startsWith("/api/fotos/")) return src;
  try {
    const blob = await (await fetch(src)).blob();
    return await new Promise((ok) => {
      const lector = new FileReader();
      lector.onload = () => ok(lector.result);
      lector.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/** Copia del registro con todas sus fotos listas para el PDF */
async function conFotosLocales(r) {
  const c = { ...r };
  for (const campo of ["fotos", "fotos_seguimiento"]) {
    if (Array.isArray(c[campo]))
      c[campo] = (await Promise.all(c[campo].map(async (f) => ({ ...f, img: await aDataUrl(f.img) })))).filter((f) => f.img);
  }
  for (const [k, v] of Object.entries(c)) {
    if (typeof v === "string" && v.startsWith("/api/fotos/")) c[k] = await aDataUrl(v);
  }
  return c;
}

/** PDF de un registro según su tipo */
export async function pdfRegistro(registro) {
  const r = await conFotosLocales(registro);
  if (r._tipo === "croquis") return pdfCroquis(r);
  if (r._tipo === "censo") return pdfCenso(r);
  return pdfEncuesta(r);
}

/** Informe resumen de una manzana */
export function pdfManzana(manzana, registros) {
  const lista = [...registros].sort(
    (a, b) => (+a.n_arbol || 0) - (+b.n_arbol || 0) || comparar(tituloDe(a), tituloDe(b))
  );
  const { doc, W } = documento(
    `INFORME MANZANA ${String(manzana).toUpperCase()}`,
    `Censo Arbolado Urbano 2026  ·  ${lista.length} registros  ·  Emitido ${new Date().toLocaleDateString("es-CL")}`
  );
  const cantidad = { columnStyles: { 1: { cellWidth: 30, halign: "center" } } };
  let y = tabla(
    doc,
    36,
    ["Resumen", "Cantidad"],
    [
      ...Object.entries(TIPOS)
        .map(([k, t]) => [t.nombre, lista.filter((r) => r._tipo === k).length])
        .filter((x) => x[1]),
      ...contar(lista.map(urgenciaDe)).map(([u, c]) => ["Urgencia: " + u, c]),
      ...contar(lista.map(nombreEstado)).map(([e, c]) => ["Estado: " + e, c]),
      ...contar(lista.map(siguienteDe)).map(([e, c]) => [e, c])
    ],
    cantidad
  );
  y = tabla(doc, y, ["Especie", "N° árboles"], contar(lista.map(especieDe)), cantidad);
  tabla(
    doc,
    y,
    ["N°", "ID / Dirección", "Tipo", "Especie", "Urgencia", "Estado"],
    lista.map((r, i) => [
      r.n_arbol || i + 1,
      [r.id_arbol, r.direccion].filter(Boolean).join("\n") || "—",
      TIPOS[r._tipo]?.nombre || "",
      especieDe(r) || "—",
      urgenciaDe(r) || "—",
      [nombreEstado(r), r.resultado && terminado(r) ? r.resultado : "", siguienteDe(r)].filter(Boolean).join("\n")
    ]),
    {
      styles: { fontSize: 8, cellPadding: 1.8, lineColor: [207, 227, 242] },
      columnStyles: { 0: { cellWidth: 12, halign: "center" }, 2: { cellWidth: 22 } }
    }
  );
  cerrar(doc, W, `informe_manzana_${Importar.slug(String(manzana))}.pdf`);
}
