/* =============================================================
   Importación de planillas Excel del censo (Google Forms → .xlsx)
   Convierte cada fila en un registro "censo", identificado por
   su ID_Arbol, ordenado por manzana. Reimportar el mismo archivo
   ACTUALIZA los registros: nunca los duplica.
   ============================================================= */
import * as XLSX from "xlsx";

export const Importar = {
  /* Columnas técnicas de Google/AutoCrat que no aportan al registro */
  OMITIR: [
    /^marca temporal$/i,
    /^columna \d+$/i,
    /^merged doc id/i,
    /^document merge status/i,
    /^link to merged doc/i,
    /^merged doc url/i,
    /^informe final/i,
    /^id_arbol$/i,
    /^n° de arbol$/i,
    /^manzana$/i,
    /direcci[oó]n y gps/i,
    /^linck de las fotos$/i
  ],

  limpiarEtiqueta(h) {
    let t = String(h)
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^"+|"+$/g, "")
      .trim();
    t = t.split(/:\s*"/)[0].replace(/"/g, "").trim(); // quita instrucciones largas entre comillas
    t = t.replace(/[\s;:]+\)?[\s;:]*$/, (m) => (m.includes(")") ? ")" : ""));
    if ((t.match(/\)/g) || []).length > (t.match(/\(/g) || []).length) t = t.replace(/\)\s*$/, "");
    if (t.length > 60 && t.includes(" (")) t = t.split(" (")[0]; // títulos con explicación larga
    return t.replace(/\s+/g, " ").trim();
  },
  limpiarValor(v) {
    if (v === null || v === undefined) return "";
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    let t = String(v).replace(/\p{Extended_Pictographic}|\uFE0F/gu, "").replace(/\s+/g, " ")
    if (/^#(NAME|REF|VALUE|N\/A|DIV\/0)/i.test(t)) return "";
    return t.replace(/\s*,\s*$/, "").trim();
  },
  /* Unifica las distintas redacciones de urgencia en categorías filtrables */
  urgencia(t) {
    const u = t.toUpperCase();
    if (!u || u === "0") return "";
    if (/EMERGENCIA|INMEDIATA|URG-01|R-1/.test(u)) return "EMERGENCIA (Inmediata)";
    if (/URGENTE|7 D[IÍ]AS|URG-02|R-2/.test(u)) return "URGENTE (Corto plazo)";
    if (/PROGRAMABLE|30-90|URG-03|R-3/.test(u)) return "PROGRAMABLE (30-90 días)";
    if (/MANTENCI[OÓ]N|C[IÍ]CLICA|R-4/.test(u)) return "MANTENCIÓN CÍCLICA";
    if (/MONITOREO|URG-04/.test(u)) return "MONITOREO";
    if (/NO REQUIERE|SIN INTERVENCI|URG-05/.test(u)) return "SIN INTERVENCIÓN";
    if (/TOC[OÓ]N|ELIMINAR/.test(u)) return "RETIRO DE TOCÓN / ELIMINAR";
    return "OTRA: " + t.split(/:\s/)[0];
  },
  slug(t) {
    return String(t)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
  },
  fechaISO(v) {
    if (v === null || v === undefined || v === "") return "";
    if (v instanceof Date && !isNaN(v)) return v.toISOString();
    if (typeof v === "number") return new Date(Math.round((v - 25569) * 864e5)).toISOString(); // serial Excel
    const d = new Date(v);
    return isNaN(d) ? "" : d.toISOString();
  },

  /* headers: fila de títulos · filas: arreglos de valores · archivo: nombre de origen */
  convertir(headers, filas, archivo = "") {
    const H = headers.map((h) => String(h ?? "").trim());
    const col = (re) => H.findIndex((h) => re.test(h));
    const c = {
      fecha: col(/^marca temporal$/i),
      manzana: col(/^manzana$/i),
      especie: col(/especie$/i),
      dir: col(/direcci[oó]n y gps/i),
      id: col(/^id_arbol$/i),
      n: col(/^n° de arbol$/i),
      urg: col(/urgencia de intervenci/i),
      rec: col(/^recomendacion_tecnica$/i),
      fotos: col(/^linck de las fotos$/i),
      inf: col(/merged doc url - plantilla/i),
      inf2: col(/merged doc url/i)
    };
    const val = (f, i) => (i < 0 ? "" : this.limpiarValor(f[i]));
    const regs = [];
    for (const f of filas) {
      if (!f || !f.some((v) => this.limpiarValor(v))) continue;
      const idArbol = val(f, c.id);
      if (!idArbol && !val(f, c.especie) && !val(f, c.dir)) continue;
      const manzana = (val(f, c.manzana).match(/\d+/) || ["Sin manzana"])[0];
      const fecha = this.fechaISO(c.fecha >= 0 ? f[c.fecha] : "");
      const campos = [];
      H.forEach((h, i) => {
        if (!h || this.OMITIR.some((re) => re.test(h))) return;
        const v = this.limpiarValor(f[i]);
        if (v && !/^https?:\/\//.test(v)) campos.push([this.limpiarEtiqueta(h), v]);
      });
      // "Dirección y GPS" puede venir como texto de la app de ubicación: separar calle y coordenadas
      const dirRaw = val(f, c.dir);
      const calle =
        (dirRaw.match(/Calle:\s*(.+?)\s+Ciudad:/i) || [])[1] ||
        (/Latitud:|https?:/i.test(dirRaw) ? "" : dirRaw);
      const gps = (dirRaw.match(/query=(-?\d+\.\d+),\s*(-?\d+\.\d+)/) || []).slice(1, 3).join(", ");
      const urgFull = val(f, c.urg);
      const clave = idArbol || `${manzana}-${val(f, c.n) || regs.length + 1}`;
      regs.push({
        _id: "censo-" + this.slug(clave),
        _tipo: "censo",
        _origen: archivo,
        _creado: fecha || new Date().toISOString(),
        _actualizado: fecha || new Date().toISOString(),
        id_arbol: idArbol,
        n_arbol: val(f, c.n),
        manzana,
        direccion: calle,
        gps,
        especie: val(f, c.especie).replace(/^EP-\d+\s+/i, ""),
        urgencia: this.urgencia(urgFull),
        urgencia_detalle: urgFull,
        recomendacion: val(f, c.rec),
        fecha: fecha.slice(0, 10),
        informe_url: val(f, c.inf) || val(f, c.inf2),
        fotos_url: /^https?:/.test(val(f, c.fotos)) ? val(f, c.fotos) : "",
        campos
      });
    }
    // orden: manzana → N° de árbol
    return regs.sort(
      (a, b) =>
        a.manzana.localeCompare(b.manzana, "es", { numeric: true }) ||
        (+a.n_arbol || 0) - (+b.n_arbol || 0)
    );
  },

  /* Lee un archivo .xlsx/.csv en el navegador (SheetJS) */
  async leerArchivo(file) {
    const wb = XLSX.read(await file.arrayBuffer(), { cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const m = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null });
    return this.convertir(m[0] || [], m.slice(1), file.name);
  }
};
