# Arbolado Urbano · Registro de Campo

Censo Arbolado Urbano 2026 — Croquis de perfil vial y Matriz VTA.
**React + Tailwind CSS** (frontend por componentes) · **Express** (API).
Desarrollado por **Bryan**.

> La base de datos y el despliegue aún no están definidos. Mientras tanto, Express guarda
> los registros en `server/data/registros.json`. Cambiar a una base de datos real solo
> requiere un archivo nuevo en `server/repositorios/` (ver más abajo).

---

## Inicio rápido

```bash
npm install
npm run dev          # http://localhost:5173  (API en el puerto 3001)
```

Para producción en un solo puerto:

```bash
npm run build
npm start            # http://localhost:3001
```

Requisito: Node.js 20 o superior.

---

## Cómo funciona

```
Tablet (React) ──► IndexedDB (funciona sin internet)
      │
      └── con conexión ──► /api (Express) ──► repositorio (hoy: archivo JSON)
```

- Todo se guarda **primero en la tablet**; la app es instalable y funciona sin señal.
- Con conexión se sincroniza al guardar, al abrir la app y cada 5 min (solo con la app visible).
- La sincronización es **incremental**: solo viaja lo nuevo o modificado.

---

## Estructura

```
client/src/
├── main.jsx · App.jsx · index.css     Entrada, rutas y estilos (Tailwind @theme)
│
├── pages/                             Una página por ruta (solo arma componentes)
│   ├── Inicio.jsx
│   ├── Croquis.jsx
│   ├── MatrizVTA.jsx
│   ├── Manzanas.jsx
│   └── Registros.jsx
│
├── components/
│   ├── ui/          Piezas genéricas: Boton, Modal, ConfirmDialog, Toast, Tarjeta,
│   │                PageHeader, Paginacion, Pastilla, Vacio, Nota
│   ├── form/        Campo, Controles (Texto, Numero, Lista, Chips), OpcionesVTA,
│   │                CampoGps, CampoFoto, BarraAcciones
│   ├── layout/      Layout, Sidebar, MarcaApp, ItemMenu, EstadoSync, FirmaApp, BotonMenu
│   ├── inicio/      TarjetaCifra, TarjetaModulo
│   ├── croquis/     SeccionIdentificacion, SeccionRedElectrica, SeccionPerfil,
│   │                ColumnaPerfil, SeccionDatosArbol, SeccionNotas, DibujoCroquis
│   ├── matriz/      IntroVTA, NavegacionSecciones, SeccionVTA, PreguntaVTA
│   ├── manzanas/    TarjetaManzana
│   └── registros/   BarraHerramientas, FiltrosRegistros, ContadorResultados,
│                    ListaRegistros, TablaRegistros, TarjetaRegistro, AccionesRegistro,
│                    CeldasRegistro, Resaltar, ModalDetalle, DetalleRegistro, ModalImportacion
│
├── config/          Contenido editable: preguntas VTA, campos del croquis, íconos
├── context/         AppContext: registros, sincronización, avisos y confirmaciones
├── hooks/           useFormulario, useGuardarFormulario, useFiltrosRegistros
├── services/        Lógica sin interfaz: db (IndexedDB), api, sync, gps, pdf,
│                    importar (Excel), archivos (respaldo/CSV)
└── utils/           Funciones puras: croquis (SVG), registros

server/
├── index.js                 Arranque del servidor
├── app.js                   Express: middlewares, rutas, errores
├── routes/registros.js      Endpoints /api/registros
├── validacion.js            Validación de lo que llega a la API
├── repositorios/
│   ├── index.js             ← elige qué almacenamiento se usa
│   └── archivoJson.js       Almacenamiento provisorio en archivo JSON
└── data/registros.json      (se crea solo; no se sube a GitHub)
```

---

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/salud` | Estado del servidor |
| GET | `/api/registros/indice` | Lista liviana `[{ id, actualizado }]` |
| POST | `/api/registros/obtener` | `{ ids }` → registros completos |
| PUT | `/api/registros` | `{ registros }` crear/actualizar |
| DELETE | `/api/registros` | `{ ids }` eliminar |
| GET | `/api/registros/manzanas` | Resumen por manzana |

---

## Cambiar a una base de datos

1. Crear `server/repositorios/<nombre>.js` que exporte las mismas 5 funciones:
   `indice()`, `obtener(ids)`, `guardar(lista)`, `eliminar(ids)`, `resumenManzanas()`.
2. En `server/repositorios/index.js` cambiar:
   ```js
   export * from "./archivoJson.js";
   ```
   por el archivo nuevo. **El frontend no se toca.**
3. Para migrar los datos actuales: en la app, **Registros → Respaldo** y luego
   **Restaurar** con la nueva base activa (o leer `server/data/registros.json`).

---

## Datos iniciales del censo

En `datos/` (no se sube a GitHub):
- `censo_manzanas_23-29.json` → cargar en la app con **Registros → Restaurar** (309 árboles).
- `Manzana_24_original.xlsx` → planilla original (también se puede usar **Importar Excel**).

---

## Dónde cambiar cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Preguntas de la Matriz VTA | `client/src/config/encuesta.js` |
| Campos del croquis | `client/src/config/croquis.js` |
| Colores | `client/src/index.css` (`@theme`) |
| Opciones del menú | `client/src/components/layout/Sidebar.jsx` (`MENU`) |
| Estilo de los botones | `client/src/components/ui/Boton.jsx` |
| Formato de los PDF | `client/src/services/pdf.js` |
| Registros por página | `client/src/hooks/useFiltrosRegistros.js` (`POR_PAGINA`) |
| Precisión del GPS | `client/src/services/gps.js` |
| Dónde se guardan los datos | `server/repositorios/index.js` |

## Scripts

| Comando | Uso |
|---|---|
| `npm run dev` | Desarrollo: React (5173) + API (3001) con recarga automática |
| `npm run build` | Compila el frontend en `client/dist` |
| `npm start` | Servidor Express con la app compilada |
