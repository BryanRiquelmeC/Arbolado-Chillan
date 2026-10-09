/* =============================================================
   Croquis de perfil vial · definición de campos
   Edite aquí etiquetas, unidades y el orden de las secciones.
   ============================================================= */

export const MATERIALES = ["Tierra", "Césped", "Cemento", "Baldosa", "Ripio", "Alcorque", "Otro"];
/** Qué se proyecta en cada franja */
export const USOS_FRANJA = ["Plantar árbol", "Extraer árbol"];
/** Urgencia al marcar "Extraer árbol" (mismas categorías del censo) */
export const URGENCIAS_EXTRAER = [
  "EMERGENCIA (Inmediata)",
  "URGENTE (Corto plazo)",
  "PROGRAMABLE (30-90 días)",
  "MANTENCIÓN CÍCLICA",
  "MONITOREO",
  "RETIRO DE TOCÓN / ELIMINAR"
];
export const UBICACIONES_ARBOL = [
  "Vereda izq.",
  "Platabanda izq.",
  "Platabanda der.",
  "Vereda der."
];
export const ORIENTACIONES = ["N", "S", "O", "P", "NO", "NP", "SO", "SP"];
export const FLUJOS = ["O a P", "P a O", "N a S", "S a N"];
export const LADOS_POSTE = ["Platabanda izq.", "Platabanda der."];

/** Perfil transversal de izquierda a derecha (igual que el plano) */
export const PERFIL = [
  { id: "vereda_izq", titulo: "Vereda izq.", uso: "uso_vereda_izq", especie: "esp_vereda_izq", urgencia: "urg_vereda_izq" },
  { id: "plata_izq", titulo: "Platabanda izq.", material: "mat_plata_izq", uso: "uso_plata_izq", especie: "esp_plata_izq", urgencia: "urg_plata_izq" },
  { id: "calzada", titulo: "Calzada", sub: "de solera a solera" },
  { id: "plata_der", titulo: "Platabanda der.", material: "mat_plata_der", uso: "uso_plata_der", especie: "esp_plata_der", urgencia: "urg_plata_der" },
  { id: "vereda_der", titulo: "Vereda der.", uso: "uso_vereda_der", especie: "esp_vereda_der", urgencia: "urg_vereda_der" }
];

/** Datos del árbol (campos numéricos con unidad) */
export const DATOS_ARBOL = [
  { id: "testigo_diam", label: "Testigo – diámetro", unidad: "cm", ej: "6" },
  { id: "testigo_alt", label: "Testigo – altura medición", unidad: "m", ej: "1.30" },
  { id: "dap", label: "DAP", unidad: "cm", ej: "56" },
  { id: "altura_copa", label: "Altura de copa", unidad: "m", ej: "12.6" },
  { id: "distancia_d", label: "Distancia (D)", unidad: "m", ej: "1.8" },
  { id: "copa_n", label: "Proyección copa Norte", unidad: "m", ej: "3.5" },
  { id: "copa_s", label: "Proyección copa Sur", unidad: "m", ej: "3.05" },
  { id: "inclinacion", label: "Inclinación", unidad: "°", ej: "12" },
  { id: "orient_incl", label: "Orientación inclinación", opciones: ORIENTACIONES },
  { id: "alt_incl", label: "Altura punto de inclinación", unidad: "m", ej: "1.4" },
  { id: "base_ancho", label: "Ancho base / cuello", unidad: "cm", ej: "45" },
  { id: "raiz", label: "Profundidad / raíz", unidad: "cm", ej: "30" },
  { id: "med_tronco", label: "Medida tronco", unidad: "cm", ej: "31" },
  { id: "med_adic", label: "Medida adicional", unidad: "cm", ej: "8" }
];

/** Etiquetas para la ficha y el PDF */
export const ETIQUETAS = {
  direccion: "Dirección",
  direccion_gps: "Coordenadas GPS",
  manzana: "Manzana / Lote",
  fecha: "Fecha",
  km_inicial: "Km inicial",
  registro: "N° registro",
  cables: "Cables eléctricos aéreos",
  postes: "Postes / red ubicados en",
  altura_cables_izq: "Altura mín. cables lado izq. (m)",
  altura_cables_der: "Altura mín. cables lado der. (m)",
  altura_cables: "Altura mín. cables general (m)",
  sentido: "Sentido del tránsito",
  flujo: "Dirección del flujo",
  vereda_izq: "Vereda izq. (m)",
  uso_vereda_izq: "Vereda izq. · proyectar",
  esp_vereda_izq: "Vereda izq. · especie a plantar",
  esp_vereda_izq_otra: "Vereda izq. · otra especie",
  urg_vereda_izq: "Vereda izq. · urgencia de extracción",
  uso_plata_izq: "Platabanda izq. · proyectar",
  esp_plata_izq: "Platabanda izq. · especie a plantar",
  esp_plata_izq_otra: "Platabanda izq. · otra especie",
  urg_plata_izq: "Platabanda izq. · urgencia de extracción",
  uso_plata_der: "Platabanda der. · proyectar",
  esp_plata_der: "Platabanda der. · especie a plantar",
  esp_plata_der_otra: "Platabanda der. · otra especie",
  urg_plata_der: "Platabanda der. · urgencia de extracción",
  uso_vereda_der: "Vereda der. · proyectar",
  esp_vereda_der: "Vereda der. · especie a plantar",
  esp_vereda_der_otra: "Vereda der. · otra especie",
  urg_vereda_der: "Vereda der. · urgencia de extracción",
  plata_izq: "Platabanda izq. (m)",
  mat_plata_izq: "Material platabanda izq.",
  calzada: "Calzada solera a solera (m)",
  plata_der: "Platabanda der. (m)",
  mat_plata_der: "Material platabanda der.",
  vereda_der: "Vereda der. (m)",
  ancho_total: "Ancho total entre líneas oficiales (m)",
  ubic_arbol: "Ubicación del árbol",
  notas: "Notas de campo",
  ...Object.fromEntries(
    DATOS_ARBOL.map((c) => [c.id, c.unidad ? `${c.label} (${c.unidad})` : c.label])
  )
};

/** Secciones de la ficha y del PDF */
export const GRUPOS = [
  ["Identificación", ["direccion", "direccion_gps", "manzana", "fecha", "km_inicial", "registro"]],
  [
    "Red eléctrica y tránsito",
    [
      "cables",
      "postes",
      "altura_cables_izq",
      "altura_cables_der",
      "altura_cables",
      "sentido",
      "flujo"
    ]
  ],
  [
    "Perfil transversal · lado izquierdo",
    [
      "vereda_izq",
      "uso_vereda_izq",
      "esp_vereda_izq",
      "esp_vereda_izq_otra",
      "urg_vereda_izq",
      "plata_izq",
      "mat_plata_izq",
      "uso_plata_izq",
      "esp_plata_izq",
      "esp_plata_izq_otra",
      "urg_plata_izq"
    ]
  ],
  ["Calzada", ["calzada"]],
  [
    "Perfil transversal · lado derecho",
    [
      "plata_der",
      "mat_plata_der",
      "uso_plata_der",
      "esp_plata_der",
      "esp_plata_der_otra",
      "urg_plata_der",
      "vereda_der",
      "uso_vereda_der",
      "esp_vereda_der",
      "esp_vereda_der_otra",
      "urg_vereda_der"
    ]
  ],
  ["Medidas totales", ["ancho_total", "ubic_arbol"]],
  ["Datos del árbol", DATOS_ARBOL.map((c) => c.id)],
  ["Observaciones", ["notas"]]
];
