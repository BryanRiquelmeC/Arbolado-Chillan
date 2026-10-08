/* =============================================================
   Cálculos y dibujo (SVG) del perfil transversal.
   La misma función se usa en pantalla y en el PDF.
   ============================================================= */

const num = (v) => parseFloat(v) || 0;

/** Valores derivados del formulario */
export function calcularCroquis(d) {
  const anchos = [d.vereda_izq, d.plata_izq, d.calzada, d.plata_der, d.vereda_der].map(num);
  const total = anchos.reduce((a, b) => a + b, 0);
  const cables = d.cables === "Sí";
  let postes = Array.isArray(d.postes) ? d.postes : [];
  // Compatibilidad con registros antiguos que usaban "ubic_red"
  if (!postes.length && d.ubic_red)
    postes = [/Der/.test(d.ubic_red) ? "Platabanda der." : "Platabanda izq."];
  const posteIzq = cables && postes.includes("Platabanda izq.");
  const posteDer = cables && postes.includes("Platabanda der.");
  const alturas = [
    posteIzq && num(d.altura_cables_izq),
    posteDer && num(d.altura_cables_der)
  ].filter(Boolean);
  return {
    anchos,
    total,
    cables,
    posteIzq,
    posteDer,
    alturaMinima: alturas.length ? Math.min(...alturas).toFixed(2) : ""
  };
}

/** SVG del corte transversal como texto */
export function croquisSvg(d) {
  const { anchos, total, posteIzq, posteDer } = calcularCroquis(d);
  const W = 900;
  const x0 = 50;
  const porDefecto = [2, 1.9, 7.8, 1.9, 2.1];
  const usar = total > 0 ? anchos.map((v, i) => v || porDefecto[i] * 0.15) : porDefecto;
  const suma = usar.reduce((a, b) => a + b, 0);
  const ws = usar.map((v) => (v / suma) * W);
  const xs = [];
  ws.reduce((x, w) => (xs.push(x), x + w), x0);

  const yS = 190; // nivel de vereda
  const yC = 212; // nivel de calzada
  const nombres = ["VEREDA", "PLATABANDA", "CALZADA", "PLATABANDA", "VEREDA"];
  const idxArbol = {
    "Vereda izq.": 0,
    "Platabanda izq.": 1,
    "Platabanda der.": 3,
    "Vereda der.": 4
  }[d.ubic_arbol];

  let s = `<style>text{font-family:Segoe UI,Arial,sans-serif}</style>
  <line x1="${x0}" y1="30" x2="${x0}" y2="250" stroke="#5d7a92" stroke-dasharray="4 4"/>
  <line x1="${x0 + W}" y1="30" x2="${x0 + W}" y2="250" stroke="#5d7a92" stroke-dasharray="4 4"/>
  <text x="${x0}" y="22" font-size="11" fill="#5d7a92">LÍMITE OFICIAL (IZQ.)</text>
  <text x="${x0 + W}" y="22" font-size="11" fill="#5d7a92" text-anchor="end">LÍMITE OFICIAL (DER.)</text>
  <line x1="${x0}" y1="48" x2="${x0 + W}" y2="48" stroke="#0b5c8f"/>
  <rect x="${x0 + W / 2 - 110}" y="38" width="220" height="20" rx="4" fill="#d9eefb"/>
  <text x="${x0 + W / 2}" y="52" font-size="12" fill="#0b5c8f" text-anchor="middle" font-weight="700">ANCHO TOTAL: ${total.toFixed(2)} m</text>
  <path d="M${x0} ${yS} H${xs[2]} V${yC} H${xs[3]} V${yS} H${x0 + W}" fill="none" stroke="#16324a" stroke-width="3"/>
  <path d="M${xs[2]} ${yC} Q${xs[2] + ws[2] / 2} ${yC - 14} ${xs[3]} ${yC}" fill="none" stroke="#5bb4ea" stroke-width="1.5"/>`;

  // Postes y cables
  const alto = (v) => Math.min(120, Math.max(50, num(v) * 22 || 95));
  const poste = (px, h, izquierda, v) => `
    <line x1="${px}" y1="${yS}" x2="${px}" y2="${yS - h}" stroke="#16324a" stroke-width="4"/>
    <line x1="${px - 10}" y1="${yS - h}" x2="${px + 10}" y2="${yS - h}" stroke="#16324a" stroke-width="3"/>
    <circle cx="${px - 10}" cy="${yS - h}" r="3" fill="#16324a"/><circle cx="${px + 10}" cy="${yS - h}" r="3" fill="#16324a"/>
    <text x="${px + (izquierda ? 14 : -14)}" y="${yS - h + 16}" font-size="11" fill="#0b5c8f" font-weight="700" text-anchor="${izquierda ? "start" : "end"}">${v ? num(v).toFixed(2) + " m" : ""}</text>`;
  const xI = xs[1] + ws[1] / 2;
  const xD = xs[3] + ws[3] / 2;
  const hI = alto(d.altura_cables_izq);
  const hD = alto(d.altura_cables_der);
  const cable = (x1, y1, x2, y2) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#16324a" stroke-dasharray="6 4"/>`;
  if (posteIzq && posteDer) {
    s +=
      cable(xI, yS - hI, xD, yS - hD) +
      poste(xI, hI, true, d.altura_cables_izq) +
      poste(xD, hD, false, d.altura_cables_der);
  } else if (posteIzq) {
    s += cable(xI, yS - hI, x0 + W, yS - hI) + poste(xI, hI, true, d.altura_cables_izq);
  } else if (posteDer) {
    s += cable(x0, yS - hD, xD, yS - hD) + poste(xD, hD, false, d.altura_cables_der);
  }

  // Árbol
  if (idxArbol !== undefined) {
    const corrido = (idxArbol === 1 && posteIzq) || (idxArbol === 3 && posteDer) ? 30 : 0;
    const tx = xs[idxArbol] + ws[idxArbol] / 2 + corrido;
    s += `<rect x="${tx - 4}" y="${yS - 60}" width="8" height="60" fill="#7a5230"/>
    <circle cx="${tx}" cy="${yS - 82}" r="34" fill="#1f9d6b" opacity=".85"/>
    <text x="${tx}" y="${yS - 78}" font-size="10" fill="#fff" text-anchor="middle">${d.dap ? "DAP " + d.dap : ""}</text>`;
  }

  // Nombres y cotas
  ws.forEach((w, i) => {
    const cx = xs[i] + w / 2;
    s += `<text x="${cx}" y="${i === 2 ? yS - 20 : yS - 8}" font-size="${w < 70 ? 9 : 12}" fill="#16324a" text-anchor="middle" font-weight="600">${nombres[i]}</text>
    <line x1="${xs[i]}" y1="265" x2="${xs[i] + w}" y2="265" stroke="#1e88c9"/>
    <line x1="${xs[i]}" y1="258" x2="${xs[i]}" y2="272" stroke="#1e88c9"/>
    <text x="${cx}" y="288" font-size="12" fill="#0b5c8f" text-anchor="middle" font-weight="700">${anchos[i] ? anchos[i].toFixed(2) + " m" : "— m"}</text>`;
  });
  s += `<line x1="${x0 + W}" y1="258" x2="${x0 + W}" y2="272" stroke="#1e88c9"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300">${s}</svg>`;
}

/** Convierte el SVG en imagen PNG (para el PDF) */
export async function croquisPng(d) {
  const img = new Image();
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(croquisSvg(d));
  await img.decode();
  const c = document.createElement("canvas");
  c.width = 2000;
  c.height = 600;
  const g = c.getContext("2d");
  g.fillStyle = "#fff";
  g.fillRect(0, 0, c.width, c.height);
  g.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/png");
}
