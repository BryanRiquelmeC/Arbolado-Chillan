/* =============================================================
   Censo Arbolado Urbano 2026 - Matriz VTA
   Configuración de secciones y preguntas del formulario.
   Tipos: text · number · radio · select · gps · photo · textarea
   "otros: true" agrega la opción "Otros:" con texto libre.
   ============================================================= */
const ENCUESTA_COMPLETA = {
  titulo: "Censo Arbolado Urbano 2026 - Matriz VTA",
  intro:
    'Instrumento creado por Rodolfo Gazmuri Sánchez para el levantamiento de datos técnicos mediante la metodología de Evaluación Visual del Árbol (VTA - Visual Tree Assessment). Forma parte del Programa "Recambio y Arborización Arbolado Urbano" en el sector de las cuatro avenidas de Chillán, de acuerdo a las funciones asignadas en el Decreto N° 10.614 del 4 de octubre de 2025. Cada registro constituye una inspección visual detallada de la especie, destinada a evaluar su estado general, sanitario y estructural.',
  secciones: [
    {
      titulo: "Identificación del punto",
      icono: "pin",
      preguntas: [
        {
          n: "1",
          label: "Manzana",
          id: "p1",
          type: "text"
        },
        {
          n: "4",
          label: "Dirección y coordenadas GPS",
          id: "direccion",
          type: "gps"
        },
        {
          n: "2",
          label: "Estado del Punto de Inspección",
          opts: [
            "Árbol Existente en Pie: (El punto cuenta con un ejemplar vivo que debe ser evaluado).",
            "Sitio Eriazo / Alcorque Vacío: (El punto está libre y requiere análisis de factibilidad y reposición)."
          ],
          otros: true,
          id: "p2",
          type: "radio"
        },
        {
          n: "3",
          label: "Especies",
          opts: [
            "Abedul Betula pendula",
            "Acacia (Espino) Acacia caven",
            "Acer Blanco (Falso Plátano) Acer pseudoplatanus",
            "Acer Japonés Acer palmatum",
            "Acer Negundo Acer negundo",
            "Algarrobo Prosopis chilensis",
            "Castaño de Indias Aesculus hippocastanum",
            "Catalpa Catalpa bignonioides",
            "Cerezo (Ornamental/Frutal) Prunus avium",
            "Ciruelo de Jardín Prunus cerasifera",
            "Crespón Lagerstroemia indica",
            "Durazno Prunus persica",
            "Encina Quercus robur",
            "Eucalipto Eucaliptus globulus",
            "Fresno Fraxinus excelsior",
            "Jacarandá Jacaranda mimosifolia",
            "Laurel de Comer Laurus nobilis",
            "Liquidámbar Liquidambar styraciflua",
            "Lleuque (Nativo) Prumnopitys andina",
            "Maitén (Nativo) Maytenus boaria",
            "Melia (Paraíso) Melia azedarach",
            "Olmo Ulmus pumila",
            "Palmera Canaria Phoenix canariensis",
            "Pelu (Nativo) Sophora cassioides",
            "Pera / Peral Pyrus communis",
            "Peumo (Nativo) Cryptocarya alba",
            "Pimiento Schinus molle",
            "Pino Insigne Pinus radiata",
            "Plátano Oriental Platanus x hispanica",
            "Quillay (Nativo) Quillaja saponaria",
            "Roble (Nativo) Nothofagus obliqua",
            "Sauce Salix babylonica",
            "Tilo Tilia platyphyllos",
            "Tulipífero Liriodendron tulipifera",
            "Álamo Populus nigra"
          ],
          req: true,
          otros: true,
          id: "p3",
          type: "select"
        }
      ]
    },
    {
      titulo: "Dimensiones del árbol",
      icono: "ruler",
      preguntas: [
        {
          n: "5",
          label: "Altura del Árbol y Criterio de Gálibo",
          hint: "Dato obtenido en terreno mediante la aplicación TREES. Ingrese el valor numérico en metros (ej: 11.5).",
          id: "p5",
          type: "number",
          unit: "m"
        },
        {
          n: "6",
          label: "Altura de Inicio de Copa (Primera rama principal)",
          id: "p6",
          type: "number",
          unit: "m"
        },
        {
          n: "6a",
          label: "Radio Norte",
          id: "p6a",
          type: "number",
          unit: "m"
        },
        {
          n: "6b",
          label: "Radio Sur",
          id: "p6b",
          type: "number",
          unit: "m"
        },
        {
          n: "6c",
          label: "Radio Oriente",
          id: "p6c",
          type: "number",
          unit: "m"
        },
        {
          n: "6d",
          label: "Radio Poniente",
          id: "p6d",
          type: "number",
          unit: "m"
        },
        {
          n: "6e",
          label: "Diametro de Sombra",
          id: "p6e",
          type: "number",
          unit: "m"
        },
        {
          n: "7",
          label: "Diámetro (DAP) en cm",
          id: "p7",
          type: "number",
          unit: "cm"
        }
      ]
    },
    {
      titulo: "Estado sanitario y biomecánico",
      icono: "health",
      preguntas: [
        {
          n: "9",
          label: "Equilibrio de la Copa y Carga Excéntrica (Efecto Biomecánico)",
          opts: [
            "BIO-00 (Sano / Sin Agente Biótico Visible): Árbol sin presencia de plagas, patógenos ni signos de afectación biológica.",
            "BIO-01 (Leve - Insectos Defoliadores / Succionadores): Presencia de pulgones, conchuelas, escamas o fumagina sin afectación estructural de la copa.",
            "BIO-02 (Leve a Moderado - Hongos Foliares): Manchas foliares, oídio o roya que afectan la estética o la capacidad fotosintética temporal.",
            "BIO-03 (Moderado - Patógenos Corticales / Chancros): Lesiones activas en la corteza, chancros o exsudaciones/gomosis en fuste o ramas principales.",
            "BIO-04 (Critico - Taladradores / Insectos Xilófagos): Orificios de salida, galerías activas o presencia de aserrín en la base/fuste (daño biomecánico severo a la madera).",
            "BIO-05 (Critico - Hongos Lignícolas / Basidiomicetes): Presencia de cuerpos fructíferos (orejas de palo, carpóforos) en cuello o fuste; pudrición activa e irreversible de la madera."
          ],
          otros: true,
          id: "p9",
          type: "radio"
        },
        {
          n: "10",
          label: 'Dirección de la Inclinación (Análisis de la "Diana")',
          opts: [
            "DIR-00 (Sin Inclinación / Vertical): Árbol erecto; el centro de gravedad cae dentro de la base de sustentación sin proyección de caída preferencial.",
            "DIR-01 (Calzada / Flujo Vehicular): Inclinación orientada hacia la vía pública; riesgo directo de impacto sobre vehículos en tránsito o estacionados.",
            "DIR-02 (Vereda / Tránsito Peatonal): Inclinación orientada hacia la acera o paso peatonal; riesgo directo sobre transeúntes (alta o media frecuencia).",
            "DIR-03 (Propiedad Privada / Edificación): Inclinación hacia viviendas, techumbres, cierros perimetrales u homologados; riesgo de daño estructural.",
            "DIR-04 (Tendido Eléctrico / Redes Aéreas): Inclinación proyectada hacia líneas de media/baja tensión o telecomunicaciones; riesgo de corte de suministro o incendio.",
            "DIR-05 (Paralelo a la Vía / Zona Abierta): Inclinación en el sentido de la platabanda o hacia áreas verdes desiertas; bajo impacto sobre blancos principales.",
            "DIR-06 (Mobiliario Urbano / Bien Público): Inclinación dirigida hacia escaños, paraderos, luminarias públicas o máquinas de ejercicio."
          ],
          otros: true,
          id: "p10",
          type: "radio"
        },
        {
          n: "11",
          label:
            "Agente Biótico ( organismo vivo que causa daño o enfermedad al árbol. Se diferencia de los agentes abióticos (como la sequía, el frío, el exceso de sal o el daño por máquinas).",
          opts: [
            "BIO-00 (Sano / Sin Agente Biótico Visible): Árbol sin presencia de plagas, patógenos ni signos de afectación biológica.",
            "BIO-01 (Leve - Insectos Defoliadores / Succionadores): Presencia de pulgones, conchuelas, escamas o fumagina sin afectación estructural de la copa.",
            "BIO-02 (Leve a Moderado - Hongos Foliares): Manchas foliares, oídio o roya que afectan la estética o la capacidad fotosintética temporal.",
            "BIO-03 (Moderado - Patógenos Corticales / Chancros): Lesiones activas en la corteza, chancros o exsudaciones/gomosis en fuste o ramas principales.",
            "BIO-04 (Critico - Taladradores / Insectos Xilófagos): Orificios de salida, galerías activas o presencia de aserrín en la base/fuste (daño biomecánico severo a la madera).",
            "BIO-05 (Critico - Hongos Lignícolas / Basidiomicetes): Presencia de cuerpos fructíferos (orejas de palo, carpóforos) en cuello o fuste; pudrición activa e irreversible de la madera."
          ],
          otros: true,
          id: "p11",
          type: "radio"
        },
        {
          n: "12",
          label: "Oquedad en Tronco",
          opts: [
            "Ninguna / Superficial: Sin cavidades ni pérdida visible de madera estructural; corteza sana o daño epidérmico sin pudrición.",
            "OQU-01 (Leve / Monitoreo): Oquedad pequeña o pudrición localizada en fuste/ramas; compromiso menor al 30% de la sección transversal. Requiere seguimiento visual rutinario.",
            "OQU-02 (Moderado / Intervención Conservadora): Cavidad media en fuste o horqueta principal (30% a 40% de afectación); pared de madera sana remanente suficiente. Requiere reducción de copa para aliviar peso o limpieza de cavidad.",
            "OQU-03 (Severo / Riesgo Estructural - Tala/Remoción): Cavidad basal profunda, tronco hueco o pudrición que afecta >40% de la circunferencia (o grosor de pared sana <30% del radio del tronco). Exige tala o remoción prioritaria.",
            "No evaluable / Oquedad no visible: Presencia de cavidad sospechada pero obstruida por hiedra, agua acumulada o escombros."
          ],
          otros: true,
          id: "p12",
          type: "radio"
        },
        {
          n: "13",
          label: "Grietas Estructurales",
          opts: [
            "Ninguna / Fisura Epidérmica: Fuste íntegro; fisuras naturales del ritmo de crecimiento restringidas a la corteza muerta externa.",
            "GRI-01 (Leve / Monitoreo): Grieta superficial en la madera superficial o cicatriz sellada; sin separación activa del tejido cambial ni exudaciones.",
            "GRI-02 (Moderado / Intervención de Alivio): Grieta vertical longitudinal en fuste o ramificación codominante sin separación severa; evidencia de esfuerzo por carga estática. Requiere poda de alivio de peso y seguimiento.",
            "GRI-03 (Severo / Riesgo Alto - Remoción o Consolidación): Grieta profunda activa con apertura del tejido interior, pudrición interna asociada o grieta en V en horquilla principal. Compromiso mecánico grave del fuste.",
            "GRI-04 (Crítico / Falla Inminente - Intervención Urgente): Grietas transversales, radiales múltiples o fractura completa del fuste con desplazamiento. Riesgo de colapso mecánico inminente.",
            "No evaluable / Oculto: Fuste no visible por presencia de hiedras, protección plástica o interferencias físicas."
          ],
          otros: true,
          id: "p13",
          type: "radio"
        },
        {
          n: "14",
          label: "Estado del cuello del árbol.",
          opts: [
            "CUE-01 (Sano / Normal - Sin riesgo): Cuello integro, ensanchamiento basal bien desarrollado (Flare) y anclaje firme sin fisuras ni levantamiento de suelo.",
            "CUE-02 (Leve - Daño Mecánico / Herida Basal): Heridas por orilladoras, maquinaria o impactos vehiculares en la corteza basal; sin pudrición activa ni pérdida de sección transversal.",
            "CUE-03 (Moderado - Raíz Estrangulante / Anular): Presencia de raíces circundantes o anulares que comprimen el fuste basal o restringen el flujo vascular; sin pérdida de anclaje. Requiere evaluación de corte radicular.",
            "CUE-04 (Severo - Pudrición Basal / Cavidad en Cuello): Pudrición activa, hongos basales o cavidad en la zona de inserción de raíces principales (>30% de afectación o pared residual <30% del radio). Alto riesgo de pérdida de sustentación.",
            'CUE-05 (Crítico - Levantamiento / "Suelo Soplado" / Falla de Anclaje): Grietas circulares en el suelo, raíces basales fracturadas o levantamiento de la placa radicular por carga estática/viento. Exige remoción urgente de emergencia.',
            "No evaluable / Cuello enterrado o cubierto: Cuello sepultado por relleno de tierra, pavimento, adoquines o vegetación densa que impide la inspección visual directa."
          ],
          otros: true,
          id: "p14",
          type: "radio"
        },
        {
          n: "15",
          label: "Estado de la Corteza",
          opts: [
            "COR-01 (Sana / Normal): Corteza íntegra, con ritidoma continuo, sin lesiones, exudaciones ni patologías aparentes.",
            "COR-02 (Leve - Fisuras Naturales de Crecimiento): Grietas o escamado limitado al ritidoma externo por desarrollo diametral; sin exposición ni daño en la madera interna (xilema).",
            "COR-03 (Leve a Moderado - Daño Mecánico / Vandalismo): Heridas o descortezamiento por choques vehiculares, roce de maquinaria, herramientas u obras; sin pudrición activa.",
            "COR-04 (Moderado - Exudación / Gomosis / Resinosis): Salida activa o seca de savia, goma o resina; indicador de estrés hídrico, ataque de taladradores o patógenos vasculares.",
            "COR-05 (Severo - Chancro / Necrosis / Desprendimiento): Ámbitos hundidos, tejido muerto (cambium destruido) o placas de corteza desprendidas con exposición de madera podrida.",
            'COR-06 (Crítico - Corteza Incluida en Horqueta / Unión en "V"): Ingreso de corteza atrapada entre ramas codominantes o uniones de fuste estrechas; ausencia de unión leñosa que genera alto riesgo de desgarro por brazo de palanca.',
            "No evaluable / Oculta: Corteza no visible por presencia densa de plantas epífitas, hiedras, protectores de tronco o envoltorios."
          ],
          otros: true,
          id: "p15",
          type: "radio"
        },
        {
          n: "16",
          label: "Estado de las Hojas",
          opts: [
            "FOL-00 (Sano / Normal - Follaje Vigoroso): Follaje completo, denso y uniforme; coloración y tamaño foliar característicos de la especie.",
            "FOL-01 (Caducifolio sin Follaje - Latencia Normal): Ausencia de follaje por dormancia estacional/invernal normal; no constituye daño fitosanitario.",
            "FOL-02 (Leve - Clorosis Foliar / Internervial): Amarillamiento de hojas por déficit nutricional, compactación de suelo o estrés hídrico inicial.",
            "FOL-03 (Leve a Moderado - Plaga o Patógeno Visible): Presencia de insectos o patógenos (pulgones, escamas, oídio, fumagina, agallas) con infestación localizada.",
            "FOL-04 (Moderado - Necrosis Foliar / Borde o Parche): Tejido muerto (zonas secas o marrones) en bordes o ápices por golpe de calor, estrés hídrico o sales.",
            "FOL-05 (Severo - Microfilia / Hojas Anormalmente Pequeñas): Reducción generalizada del tamaño foliar; síntoma claro de declinación fisiológica o restricción radicular.",
            "FOL-06 (Severo - Defoliación Prematura / Copa Rala): Pérdida anómala de follaje fuera de estación; baja densidad de copa por pérdida de vigor o daño vascular.",
            "FOL-07 (Critico - Brotación Epicórmica / Chupones Masivos): Emisión abundante de brotes de emergencia en tronco o ramas tras estrés severo, desmoche o pérdida de copa."
          ],
          otros: true,
          id: "p16",
          type: "radio"
        }
      ]
    },
    {
      titulo: "Entorno y emplazamiento",
      icono: "building",
      preguntas: [
        {
          n: "17",
          label: "¿Qué hay bajo el árbol? (Marque el elemento de mayor riesgo / valor)",
          opts: [
            "OENT-00 (Área Libre / Vegetación - Bajo Riesgo): Suelo natural, césped o áreas verdes sin permanencia de personas ni bienes de valor.",
            "ENT-01 (Restricción / Vegetación Competitiva): Malezas altas, arbustos densos o alcorque cubierto que dificultan la inspección de cuello y raíces.",
            "ENT-02 (Acumulación de Residuos / Escombros): Depósito de escombros, microbasurales o restos de poda que ocultan la base del árbol y compactan la zona radicular.",
            "ENT-03 (Mobiliario Urbano y Recreativo): Escaños, juegos infantiles, máquinas de ejercicio, paraderos o señalética (zonas de permanencia peatonal).",
            "ENT-04 (Flujo Peatonal y Vehicular Constante): Veredas principales, ciclovías, calzadas de alto tránsito o zonas de estacionamiento rotativo.",
            "ENT-05 (Infraestructura Crítica y Redes): Medidores de agua/gas, luminarias públicas, cámaras de inspección, transformadores o red eléctrica/telecomunicaciones."
          ],
          otros: true,
          id: "p17",
          type: "radio"
        },
        {
          n: "18",
          label: "Tipo de Platabanda (Material de superficie)",
          opts: [
            "PLA-01 (Suelo Natural / Cobertura Vegetal - Superficie Permeable): Suelo orgánico, césped o mantillo sin compactar. Mantiene óptima infiltración hídrica e intercambio gaseoso para el desarrollo radicular.",
            "PLA-02 (Áridos / Grava / Maicillo - Superficie Semi-Permeable): Capa inerte suelta o semi-compactada. Permite infiltración moderada de agua y aire, pero puede acumular calor por radiación.",
            "PLA-03 (Suelo Natural Compactado / Sellado Superficial): Tierra desnuda endurecida por tránsito peatonal/vehicular constante. Reduce severamente la porosidad, frena la infiltración y restringe la respiración de las raíces.",
            "PLA-04 (Pavimento Continuo / Hormigón / Baldosa - Confinamiento Severo): Platabanda sellada completamente con material inerte impermeable. Provoca anoxia radicular y fuerza el levantamiento de aceras por crecimiento de raíces superficiales.",
            "PLA-05 (Adoquín / Bloque Intertrabado - Superficie Parcialmente Permeable): Pavimento articulado sobre cama de arena. Presenta infiltración reducida por juntas, pero genera menor restricción biomecánica que el hormigón continuo.",
            "PLA-06 (Sin Platabanda / Alcorque Inexistente): El árbol nace directamente desde la infraestructura continua sin delimitación de taza ni franja de tierra."
          ],
          otros: true,
          id: "p18",
          type: "radio"
        },
        {
          n: "19",
          label: "Estado de la Acera (Marque la condición más grave)",
          opts: [
            "ACE-01 (Sana / Normal): Pavimento íntegro, sin daños, fisuras ni deformaciones causadas por la actividad radicular.",
            "ACE-02 (Leve - Fisurada / Agrietada): Grietas o fisuras en la superficie sin desnivel apreciable; no representa riesgo de tropiezo peatonal.",
            "ACE-03 (Leve a Moderado - Levantada Leve): Desnivel menor a 5 cm en baldosas o soleras causado por raíces superficiales (riesgo de tropiezo leve).",
            "ACE-04 (Severo - Quebrada / Fracturada): Desnivel igual o mayor a 5 cm o pavimento destruido por raíces (urgencia alta por riesgo de caída).",
            "ACE-05 (Critico - Estrangulamiento / Inclusión de Cuello): El pavimento o solera comprime directamente la base del tronco o raíces primarias, afectando el flujo vascular.",
            "ACE-06 (Critico - Confinamiento / Sin Alcorque): Pavimento sella el 100% de la superficie sin dejar espacio de expansión ni infiltración para el árbol.",
            "No evaluable / Acera no existente: Sector sin pavimento (plazoleta, tierra suelta o platabanda completamente vegetal)."
          ],
          otros: true,
          id: "p19",
          type: "radio"
        },
        {
          n: "20",
          label: "Ancho de Platabanda (en metros)",
          hint: 'Ingrese solo el valor numérico en metros (ej: 0.6 o 1.5) utilizando punto para los decimales. No escriba texto ni la palabra "metros" para que el Excel pueda procesar los cálculos correctamente.',
          id: "p20",
          type: "number",
          unit: "m"
        },
        {
          n: "21",
          label: "Condición del Suelo y Área Radicular (Compactación y Estabilidad)",
          opts: [
            "PLA-01 (Inexistente / Sin Platabanda - 0 m): Árbol emplazado directamente sobre pavimento continuo o solera, sin alcorque ni franja vegetal visible.",
            "PLA-02 (Severamente Restringido - < 0.6 m): Espacio extremadamente estrecho. Genera conflicto radicular prematuro con la infraestructura vial o peatonal.",
            "PLA-03 (Restringido / Estrecho - 0.6 m a 1.0 m): Espacio limitado. Apto únicamente para especies de porte menor; induce levantamiento de aceras en árboles de porte mediano o grande.",
            "PLA-04 (Adecuado Moderado - 1.1 m a 2.0 m): Franja de dimensión intermedia. Permite el desarrollo de especies de porte mediano con un margen aceptable de estabilidad radicular.",
            "PLA-05 (Optimo / Amplio - > 2.0 m): Platabanda ancha o parque/plaza. Espacio ideal para la libre expansión del sistema radicular, anclaje biomecánico y desarrollo de grandes ejemplares.",
            "PLA-06 (Alcorque Individual / Taza Rígida): Espacio delimitado por marco de hormigón, metal o adoquín en acera sellada (especificar dimensiones en metros en observaciones)."
          ],
          otros: true,
          id: "p21",
          type: "radio"
        },
        {
          n: "22",
          label: "Especies sugeridas",
          opts: [
            "REP-01 (Mantener Especie Existente): La especie actual es técnicamente adecuada para el sitio; se sugiere reponer con un ejemplar joven de la misma especie en caso de tala.",
            "REP-02 (Ornamental / Porte Menor - < 6 m): Especie de bajo desarrollo coronario y sistema radicular no agresivo. Indicada para platabandas estrechas (< 1,0 m) o bajo tendido eléctrico denso.",
            "REP-03 (Nativo Silvoadaptable / Mediano a Grande): Especie perenne nativa (ej. Quillay, Peumo, Belloto, Pilo). Requiere platabanda ≥ 1,2 m y ausencia de interferencias aéreas severas.",
            "REP-04 (Caducifolio Mediano / Sombreado Estacional - 6 a 15 m): Especie de hoja caduca (ej. Liquidámbar, Acer, Fresno, Crespón). Apta para platabandas intermedias a amplias (1,2 m a 2,0 m).",
            "REP-05 (Árbol de Gran Porte / Estructura Mayor - > 15 m): Especie de gran desarrollo (ej. Castaño de Indias, Roble, Tulipero, Plátano Oriental). Apta exclusivamente para avenidas, bandejones centrales, parques o plazas con platabanda > 2,0 m.",
            "REP-06 (Anulación / Eliminar Taza o Punto de Plantación): No replantar. El emplazamiento no cumple con condiciones mínimas de biospacio, existe conflicto severo con infraestructura irremovible o visibilidad vial.",
            "No aplica / Conservar Árbol Actual: El ejemplar se encuentra en buenas condiciones estructurales y fitosanitarias; no requiere reposición ni sustitución."
          ],
          otros: true,
          id: "p22",
          type: "radio"
        },
        {
          n: "23",
          label: "Fotografía de Respaldo del Punto",
          id: "p23",
          type: "photo"
        }
      ]
    },
    {
      titulo: "Evaluación estructural",
      icono: "tree",
      preguntas: [
        {
          n: "24",
          label: "Defecto Estructural Principal (Inclinación, Grietas o Pudrición)",
          opts: [
            "DEF-00 (Sin Defectos Visibles): Ejemplar estables biomecánicamente; sin inclinación anómala, grietas activas ni cavidades críticas.",
            "DEF-01 (Leve - Inclinación / Copa Desequilibrada): Inclinación adaptativa (15 ) o desequilibrio de copa sin grietas basales ni soplado de suelo.",
            "DEF-02 (Leve - Fisura / Grieta Superficial): Fisura localizada en corteza o madera externa sin progresión ni evidencia de pudrición vascular.",
            "DEF-03 (Moderado - Pudrición Localizada / Oquedad Parcial): Cavidad o descomposición en fuste o ramas que afecta menos del 30% de la sección transversal (t/R > 0.35).",
            "DEF-04 (Severo - Grieta Longitudinal Profunda): Fractura o grieta por cortante que atraviesa el fuste principal, comprometiendo la integridad estructural.",
            "DEF-05 (Severo - Inclinación Moderada con Tensión): Inclinación corregida o activa (15° a 30°) con centro de gravedad desplazado sobre blanco de riesgo.",
            "DEF-06 (Critico - Inclinación Progresiva / Suelo Soplado): Inclinación severa (30°) acompañada de grietas en el suelo, raíces fracturadas o levantamiento basal (falla inminente de anclaje).",
            "DEF-07 (Critico - Cavidad Basal Abierta / Pared Residual Crítica): Pudrición o cavidad basal grave que afecta más del 30-40% del diámetro o deja una pared restante de madera sana t/R < 0.30.",
            "DEF-08 (Critico - Grietas Longitudinales y Radiales Múltiples): Fracturas estructurales severas en múltiples planos del fuste o uniones de ramas."
          ],
          otros: true,
          id: "p24",
          type: "radio"
        },
        {
          n: "25",
          label: "Tipo de Interferencia Eléctrica",
          opts: [
            "INT-00 (Ninguna / Sin Interferencia): Copa libre; no presenta contacto ni proximidad crítica con tendido aéreo en su radio de expansión.",
            "INT-01 (Bajo Riesgo - Telecomunicaciones / Corrientes Débiles): Ramas en contacto o envolviendo cables de fibra óptica, televisión o teléfono (bajo riesgo eléctrico, pero potencial fricción/daño a la red).",
            "INT-02 (Bajo a Moderado - Alumbrado Público): Ramas tapando la difusión luminosa de la luminaria vial o en contacto con el brazo de alumbrado (genera focos de inseguridad nocturna).",
            "INT-03 (Moderado - Baja Tensión / Red Domiciliaria 220V - 380V): Follaje o ramas en contacto directo con líneas preensambladas o desnudas de BT (requiere poda de despeje).",
            "INT-04 (Severo - Media Tensión / Red de Distribución 13.2kV - 23kV): Ramas invadiendo la franja de seguridad o tocando líneas de MT. Riesgo crítico de arco eléctrico/incendio; requiere coordinación previa con empresa eléctrica.",
            "INT-05 (Severo - Interferencia Mixta): Conflicto simultáneo con redes de Media/Baja Tensión y Alumbrado Público o Telecomunicaciones."
          ],
          otros: true,
          id: "p25",
          type: "radio"
        },
        {
          n: "26",
          label: "Vigor del Árbol (Condición actual)",
          opts: [
            "VIG-01 (Bueno / Vigoroso): Crecimiento apical y brotación acordes a la especie; extensión foliar completa, buena densidad de copa y ausencia de signos de declinación.",
            "VIG-02 (Moderado / Vigor Normal): Crecimiento esperable para la especie y entorno urbano; leve reducción de densidad foliar o brotación adaptativa sin daño estructural.",
            "VIG-03 (Escaso / En Declinación Leve): Crecimiento apical reducido, presencia de pequeñas ramas secas terminales (muerte descendente inicial) y follaje menos denso.",
            "VIG-04 (Severo / Declinación Avanzada): Pérdida masiva de vigor, presencia de microfilia, brotación epicórmica de emergencia (chupones) y brotes secos dominantes.",
            "VIG-05 (Critico / Árbol Decadente o Moribundo): Copa desvitalizada en más del 70%, muerte de ramas principales y colapso del sistema vascular.",
            "VIG-06 (Muerto / Árbol Seco): Sin presencia de masa foliar ni yemas activas en periodo vegetativo.",
            "No evaluable (Dormancia Invernal): Periodo de latencia en especies caducifolias; vigor no determinable por ausencia natural de follaje."
          ],
          otros: true,
          id: "p26",
          type: "radio"
        },
        {
          n: "27",
          label: "Evidencia de podas anteriores",
          opts: [
            "POD-00 (Sin Intervención / Estructura Natural): Árbol sin trazas de podas previas; conserva la arquitectura y dominancia apical propia de la especie.",
            "POD-01 (Correcta - Formación / Mantenimiento): Cortes técnicos adecuados con cicatrización correcta (callo de oclusión); respeta el cuello de la rama.",
            "POD-02 (Correcta - Levante de Copa / Despeje Aéreo): Eliminación técnica de ramas bajas para dar gálibo peatonal (≥ 2.5 m) o vehicular (≥ 4.5 m).",
            "POD-03 (Correcta - Despeje de Redes / Luminarias): Poda dirigida (tipo túnel o ventana) para liberar tendido eléctrico o campo de luz sin alterar la estabilidad.",
            'POD-04 (Inadecuada - Terciado / Desmoche Severo): Corte drástico de ramas principales o fuste ("percheros"). Genera pudrición interna y rebrote epicórmico masivo de alta propensión a la falla.',
            "POD-05 (Inadecuada - Mutilación por Terceros / Desbalance): Cortes desgarrados, desrame informal por vecinos o constructoras que descompensan la arquitectura de la copa",
            "POD-06 (Inadecuada - Descortezado / Mala Cicatrización): Cortes que dejaron muñones secos, desgarros de corteza en fuste o pudrición activa en los puntos de corte"
          ],
          otros: true,
          id: "p27",
          type: "radio"
        },
        {
          n: "28",
          label: "Desequilibrio de la estructura y condiciones de inclinación",
          opts: [
            "INC-00 (Vertical / Estable): Sin inclinación observable (0 a 5); centro de gravedad alineado sobre el eje basal sin desequilibrio en la copa.",
            "INC-01 (Leve - Adaptativa / Geotropismo): Inclinación leve (6° a15°) sin signos de deformación basal; copa con crecimiento compensatorio normal.",
            "INC-02 (Moderada - Desbalance de Copa): Inclinación de 16° a 30° o copa fuertemente asimétrica (pesos concentrados hacia la calzada o propiedad privada).",
            "INC-03 (Severa - Inclinación Crítica sin Daño Basal): Inclinación de 31° a 40° con centro de gravedad desplazado. Requiere reducción de peso o reequilibrio.",
            "INC-04 (Critica - Inclinación Progresiva / Soplado de Suelo): Inclinación 40° o inclinación activa acompañada de grietas en la base, raíces expuestas o levantamiento de suelo (riesgo inminente de vuelco)."
          ],
          otros: true,
          id: "p28",
          type: "radio"
        },
        {
          n: "29",
          label: "Grietas en la madera",
          opts: [
            "GRI-00 (Sin Defectos / Madera Íntegra): Fuste y ramas principales sin grietas ni fisuras visibles.",
            "GRI-01 (Leve - Fisura Superficial): Grieta limitada a la corteza o capa externa de la madera, sin signos de progresión, separación de fibras ni pudrición.",
            "GRI-02 (Moderado - Grieta Longitudinal Unilaterial): Grieta vertical evidente en un solo lado del fuste; afecta madera de albura pero no atraviesa la sección ni presenta separación activa.",
            "GRI-03 (Severo - Grieta Profunda / Cortante): Grieta vertical o transversal profunda en el fuste o unión de ramas; evidencia separación activa de fibras por tensión o torsión.",
            "GRI-04 (Critico - Grietas Múltiples y Radiales): Fracturas mecánicas estructurales en múltiples planos; riesgo inminente de colapso o falla de la sección."
          ],
          otros: true,
          id: "p29",
          type: "radio"
        },
        {
          n: "30",
          label: "Pudrición de la madera y oquedades",
          opts: [
            "PUD-00 (Sin Defectos Visibles / Madera Sana): Tronco e inserciones sin evidencia de cavidades, descomposición interna ni cuerpos fructíferos (carpóforos).",
            "PUD-01 (Leve - Pudrición Localizada / Superficial): Descomposición pequeña o superficial lejos de los puntos críticos de tensión (afecta <10% de la sección).",
            "PUD-02 (Moderado - Cavidad Parcial / Oquedad Media): Cavidad abierta o interna en fuste o cuello con pared restante de madera sana adecuada (t/R ≥ 0.35 o afecta entre 10% y 30% del diámetro).",
            "PUD-03 (Severo - Cavidad Basal / Pared Restante Delgada): Pudrición o oquedad crítica en la base/fuste que afecta >30% a 40% de la circunferencia o deja una pared de madera sana insuficiente (t/R < 0.30).",
            "PUD-04 (Critico - Tronco Hueco / Hongos Lignícolas Activos): Degradación interna severa (fuste predominantemente hueco) o presencia de carpóforos en la base/tronco (pérdida de la capacidad resistente estructural)."
          ],
          otros: true,
          id: "p30",
          type: "radio"
        },
        {
          n: "31",
          label: "Madera muerta (ramas secas)",
          opts: [
            "MUE-00 (Sin Presencia / Copa Sanable): Ausencia de ramas secas o presencia insignificante de ramillas menores (<2 cm) sin riesgo de caída.",
            "MUE-01 (Leve - Ramillas / Ramas Menores Secas): Presencia de ramaje seco distribuido en la periferia de la copa (2 a 5 cm de diámetro). Riesgo bajo sobre el área de caída.",
            "MUE-02 (Moderado - Ramas Secas de Mediano Calibre): Múltiples ramas muertas en copa o ramas principales secas de 5 a 15 cm de diámetro. Requiere limpieza de copa programada.",
            "MUE-03 (Severo - Rama Muerta Mayor de Gran Calibre): Presencia de una o más ramas estructurales muertas o fisuradas con diámetro >15 cm. Riesgo alto de impacto sobre el blanco.",
            'MUE-04 (Critico - Colapso Parcial de Copa / Rama Muerta Colgante): Ramas de gran volumen completamente muertas, desgajadas o atrapadas en la copa (ramas en "guillotina"). Riesgo de caída inminente.'
          ],
          otros: true,
          id: "p31",
          type: "radio"
        },
        {
          n: "33",
          label: "Tipo de unión de ramas principales",
          opts: [
            "UNI-00 (Rama Única / Sin Horquetas Principales): Ejemplar con un solo eje dominante (fuste monocotiledóneo o arquitectura excurrente) sin ramificaciones codominantes en el primer tercio.",
            'UNI-01 (Uso / Unión en "U" - Unión Fuerte): Inserción de ramas bien abierta y redondeada, con arruga de corteza hacia afuera. Presenta una alta resistencia mecánica y baja probabilidad de fallo.',
            'UNI-02 (Uso / Unión en "V" - Unión Débil): Ramas que crecen muy juntas en ángulo agudo. Los tejidos se presionan mutuamente en la base, generando un punto de tensión biomecánica.',
            'UNI-03 (Critico - Unión en "V" con Corteza Incluida): Presencia de corteza atrapada dentro de la unión en "V" (inclusión de ritidoma). Impide la unión leñosa continua; representa un alto riesgo de desgaje o colapso de la rama.',
            "UNI-04 (Severo - Multicaule / Codominancia Múltiple): Tres o más ramas principales naciendo del mismo punto de inserción (ramificación en cabellera o abanico). Genera competencia espacial y sobrecarga de peso en la base.",
            "UNI-05 (Critico - Grieta o Desgaje Activo en Horqueta): Presencia de fisura visible, separación de fibras o exudación de savia/pudrición justo en la intersección de las ramas principales."
          ],
          id: "p33",
          type: "radio"
        },
        {
          n: "34",
          label: "Grietas en Inserción de Ganchos (Ramas)",
          opts: [
            "INS-00 (Ninguna / Inserción Sólida): Inserción limpia e íntegra; la arruga de la corteza y la axila de la rama no presentan fisuras, grietas ni deformaciones.",
            "INS-01 (Leve - Fisura Superficial): Agrietamiento limitado a la corteza en el punto de contacto, sin separación leñosa ni exudación.",
            "INS-02 (Moderado - Grieta Longitudinal por Tensión): Fisura lineal visible en la base del gancho; indica sobrecarga por peso, momento de flexión o torsión.",
            "INS-03 (Severo - Exudación / Flujo Activo de Savia): Presencia de humedad, exudación o gomosis en la axila de la rama; síntoma claro de grieta interna oculta o falla mecánica activa.",
            "INS-04 (Critico - Oquedad / Pudrición en Inserción): Degradación del tejido leñoso en el punto de unión; madera blanda o cavidad abierta que compromete la resistencia del soporte.",
            "INS-05 (Critico - Desgaje Activo / Desprendimiento Inminente): Rama parcialmente separada del fuste o con fractura abierta visible (riesgo inminente de caída)."
          ],
          otros: true,
          id: "p34",
          type: "radio"
        },
        {
          n: "35",
          label: "Diámetro de la Rama o Gancho Afectado (cm).",
          opts: [
            "DIA-00 (No Aplica / Sin Ramas Afectadas): Ejemplar sin anomalías en ramificación o fuste monocotiledóneo sin ramas laterales en riesgo.",
            "DIA-01 (Pequeña - Menor a 10 cm): Rama delgada. En caso de desprendimiento, representa un riesgo bajo sobre personas o bienes (daño estético o leve).",
            "DIA-02 (Mediana - 10 cm a 25 cm): Rama de calibre medio con peso considerable. Representa un riesgo moderado/alto sobre vehículos, techumbres o peatones.",
            "DIA-03 (Grande - Mayor a 25 cm): Rama primaria o gancho estructural de gran volumen. Constituye un riesgo crítico con potencial de daño severo o fatalidad en caso de colapso.",
            "DIA-04 (Fuste / Tronco Principal Afectado): El defecto no está en un gancho lateral, sino directamente en la columna o tronco principal del árbol."
          ],
          otros: true,
          id: "p35",
          type: "radio"
        }
      ]
    },
    {
      titulo: "Diagnóstico y recomendación",
      icono: "check",
      preguntas: [
        {
          n: "36",
          label: "Observaciones del Especialista",
          opts: [
            "OBS-00 (Sin Acción / Estado Óptimo): Ejemplar sano y estructuralmente estable. No requiere intervención ni manejo correctivo inmediato.",
            "OBS-01 (Monitoreo / Inspección Periódica): Inclinación leve (<20°) o grieta/fisura superficial sin progresión. Mantener en evaluación técnica anual.",
            "OBS-02 (Poda Correctiva / Levante o Limpieza): Pudrición reducida o presencia de ramas muertas de menor/mediano calibre (5 a 15 cm). Programar poda de limpieza o equilibrio.",
            "OBS-03 (Poda de Seguridad / Reducción Severa): Rama muerta de gran tamaño (>15 cm) o interferencia crítica con líneas eléctricas. Intervención prioritaria para eliminar peso o riesgo directo sobre blanco.",
            "OBS-04 (Evaluación Avanzada / Equipamiento Especial): Unión con corteza incluida, vicios biomecánicos de alto riesgo o sospecha de oquedad interna. Requiere inspección con tomógrafo o resistógrafo.",
            "OBS-05 (Tala Programada / Reemplazo): Cavidad basal abierta que afecta >40% de la circunferencia (pared residual <30%), presencia de hongos lignícolas o inclinación moderada/alta sin estabilidad.",
            "OBS-06 (Tala Inmediata / Riesgo Crítico de Fallo): Inclinación activa (>40°) con soplado de suelo, o grietas longitudinales/radiales múltiples con separación de fibras. Falla severa inminente; requiere retiro urgente."
          ],
          otros: true,
          id: "p36",
          type: "radio"
        },
        {
          n: "37",
          label: "Tipo de registros",
          opts: [
            "REG-01 (Árbol Existente / Vivo): Ejemplar en pie que presenta actividad biológica activa (follaje, yemas o cámbium vivo).",
            "REG-02 (Árbol Muerto en Pie / Snag): Ejemplar completamente seco pero mantención de fuste o ramas. Representa riesgo directo por falla estructural sin recuperación.",
            "REG-03 (Tocón / Resto de Tala): Remanente de tronco cortado a nivel del suelo o alcorque. Requiere registro técnico para priorización de destoconado.",
            "REG-04 (Alcorque Vacío en Pavimento): Taza o espacio confinado en acera/pavimento sin ejemplar. Representa riesgo de tropiezo peatonal y punto potencial de replantación.",
            "REG-05 (Espacio Vacante para Plantación): Sitio disponible en platabanda de tierra o área verde apto técnicamente para la incorporación de un nuevo árbol.",
            "REG-06 (Emergencia / Árbol Caído o Desgajado): Ejemplar o rama principal que ya colapsó y se encuentra sobre el suelo, calzada o estructura privada/pública."
          ],
          otros: true,
          id: "p37",
          type: "radio"
        },
        {
          n: "38",
          label: "Conclusión y Recomendación / Acción",
          opts: [
            "CON-01 (Monitoreo Técnico / Vigilancia Periódica): Ejemplar estable. Se programa inspección o seguimiento VTA semestral o anual sin requerir acción física inmediata.",
            "CON-02 (Poda de Levante / Despeje de Gálibo): Poda técnica para despeje de gálibo peatonal/vehicular, liberación de luminarias o cables de baja tensión/telecomunicaciones.",
            "CON-03 (Poda de Reducción / Reequilibrio Biomecánico): Poda para rebajar centro de gravedad, reducir el efecto vela o compensar asimetría severa de la copa.",
            "CON-04 (Poda de Limpieza / Sanitaria): Retiro exclusivo de ramas secas, enfermas, desgajadas o con deformaciones críticas.",
            "CON-05 (Destoconación / Reparación de Superficie): Extracción del tocón existente mediante destoconadora o reparación y acondicionamiento del alcorque/platabanda.",
            "CON-06 (Extracción Inmediata / Tala Prioritaria): Retiro urgente del ejemplar por riesgo público inminente de fallo, daño irreparable o estado moribundo (Prioridad 1).",
            "CON-07 (Estudio de Alta Precisión / Diagnóstico Instrumental): Requiere evaluación complementaria no destructiva (resistografía o tomografía sónica) previo a dictamen de tala."
          ],
          otros: true,
          id: "p38",
          type: "radio"
        },
        {
          n: "39",
          label: "Nivel de Riesgo del Blanco (Exposición y Flujo)",
          opts: [
            "RIE-01 (Bajo - Uso Limitado / Ocupación Ocasiona < 25%): Áreas verdes sin estructuras, platabandas sin tránsito peatonal continuo o espacios donde el blanco está presente menos del 25% del tiempo.",
            "RIE-02 (Medio - Uso Frecuente / Ocupación Intermitente 25% - 75%): Veredas residenciales, estacionamientos de rotación, cierros perimetrales, señalética o luminarias públicas.",
            "RIE-03 (Alto - Uso Constante / Ocupación Continua > 75%): Calzadas principales de alto tránsito vehicular, viviendas habitadas adyacentes, paraderos de locomoción o zonas peatonales de flujo continuo.",
            "RIE-04 (Crítico / Vulnerabilidad Extrema): Accesos directos a recintos de salud, establecimientos educacionales, jardines infantiles o zonas de alta concentración masiva de personas."
          ],
          otros: true,
          id: "p39",
          type: "radio"
        },
        {
          n: "40",
          label: "Antecedentes de Reclamos y Medida de Mitigación Transitoria",
          opts: [
            "MIT-00 (Sin Antecedentes / Sin Medida): Registro sin reclamos comunitarios previos ni intervención de mitigación activa.",
            "MIT-01 (Reclamo Vecinal / Alerta Ciudadana): Solicitud o denuncia ingresada por canal municipal (OIRS/Oficina de Partes) por riesgo percibido o molestia urbana.",
            "MIT-02 (Conflicto Operativo / Redes de Servicios): Historial de interacción con líneas aéreas o servicios públicos con requerimiento formal de despeje.",
            "MIT-03 (Mitigación Precautoria / Delimitación de Riesgo): Área perimetrada transitoriamente mediante cinta de peligro, conos o señalización de advertencia peatonal.",
            "MIT-04 (Mitigación Biomecánica Transitoria): Poda de emergencia o alivio de peso ejecutada previamente, o instalación de sistemas de sustentación/apuntalamiento temporal.",
            "MIT-05 (Antecedente Crítico / Colapso Previo): Registro de fallas anteriores en el mismo ejemplar (desgaje previo de ramas principales o desprendimiento basal)."
          ],
          otros: true,
          id: "p40",
          type: "radio"
        },
        {
          n: "32",
          label: "Urgencia de Intervención",
          opts: [
            "URG-01 (EMERGENCIA / Inmediata - 24 a 48 hrs): Riesgo inminente de falla estructural o colapso (ej. soplado de suelo, grietas cortantes activas, madera muerta colgante grande o inclinación activa sobre blanco expuesto). Requiere aislamiento inmediato del área y tala/poda de seguridad urgente.",
            "URG-02 (URGENTE / Corto Plazo - < 15 días): Árbol con defectos estructurales graves (cavidades abiertas >40%, ramas secas mayores >15 cm o interferencia severa con media tensión). Requiere intervención técnica a la brevedad.",
            "URG-03 (PROGRAMABLE / Mediano Plazo - 30 a 90 días): Ejemplar estable con defectos leves a moderados (podas de formación, levante de gálibo, despeje de luminarias o limpieza de copa).",
            "URG-04 (MONITOREO / Sin Acción Inmediata): Ejemplar con anomalías o síntomas de declinación que no amenazan la estabilidad inmediata. Requiere seguimiento periódico (semestral/anual) según ficha VTA.",
            "URG-05 (SIN INTERVENCIÓN / Estado Óptimo): Árbol sano, equilibrado y bien emplazado. No requiere acciones de manejo arborícola."
          ],
          otros: true,
          req: true,
          id: "p32",
          type: "radio"
        },
        {
          n: "41",
          label: "Fotografía de Detalle del Defecto",
          id: "p41",
          type: "photo"
        }
      ]
    }
  ]
};

/* =============================================================
   VERSIÓN CORTA DE LA MATRIZ
   Preguntas que NO se muestran (quedan 20 de 41: solo las que
   determinan el riesgo y la decisión sobre el árbol).
   Para volver a mostrar una, bórrela de esta lista.
   Los registros antiguos conservan sus respuestas.
   ============================================================= */
export const PREGUNTAS_OCULTAS = [
  // Medidas que no cambian la decisión
  "p6", "p6a", "p6b", "p6c", "p6d", "p6e",
  // Estado sin riesgo estructural directo
  "p15", "p16",
  // Entorno / plantación (no define riesgo del árbol)
  "p18", "p19", "p20", "p21", "p22", "p23",
  // Repetidas o de detalle especializado
  "p24", "p27", "p28", "p29", "p30", "p33", "p34", "p35",
  // Cubiertas por Urgencia y Recomendación
  "p36", "p37", "p40"
];

/** Formulario que se usa en la app (sin las ocultas y renumerado 1, 2, 3…) */
let numero = 0;
export const ENCUESTA = {
  ...ENCUESTA_COMPLETA,
  secciones: ENCUESTA_COMPLETA.secciones
    .map((s) => ({
      ...s,
      preguntas: s.preguntas
        .filter((p) => !PREGUNTAS_OCULTAS.includes(p.id))
        .map((p) => ({ ...p, n: p.n ? String(++numero) : p.n }))
    }))
    .filter((s) => s.preguntas.length)
};

/** Todas las preguntas en una sola lista (útil para PDF y búsquedas) */
export const PREGUNTAS = ENCUESTA.secciones.flatMap((s) => s.preguntas);
