/* =============================================================
   GPS: coordenadas precisas + calle y número
   1. Toma varias lecturas y se queda con la más precisa
      (se detiene antes si logra ±15 m o menos).
   2. Con internet, obtiene calle, número y ciudad (OpenStreetMap).
   ============================================================= */

export const PRECISION_OBJETIVO = 15; // metros
export const ESPERA_MAXIMA = 12000; // milisegundos

/** Lee la mejor posición posible en ESPERA_MAXIMA ms */
export function leerPosicion() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(new Error("Este dispositivo no tiene GPS disponible"));
    let mejor = null;
    const terminar = () => {
      navigator.geolocation.clearWatch(vigia);
      clearTimeout(reloj);
      mejor ? resolve(mejor) : reject(new Error("No se pudo obtener la ubicación"));
    };
    const vigia = navigator.geolocation.watchPosition(
      (p) => {
        if (!mejor || p.coords.accuracy < mejor.coords.accuracy) mejor = p;
        if (p.coords.accuracy <= PRECISION_OBJETIVO) terminar();
      },
      (err) => {
        if (err.code === 1) {
          navigator.geolocation.clearWatch(vigia);
          clearTimeout(reloj);
          reject(
            new Error(
              "Permiso de ubicación denegado. Actívelo en Chrome → Configuración del sitio."
            )
          );
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: ESPERA_MAXIMA }
    );
    const reloj = setTimeout(terminar, ESPERA_MAXIMA);
  });
}

/** Coordenadas → { calle, numero, ciudad, texto } */
export async function buscarDireccion(lat, lon) {
  const url =
    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1" +
    `&accept-language=es&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Servicio de direcciones no disponible");
  const a = (await res.json()).address || {};
  const calle = a.road || a.pedestrian || a.footway || a.residential || a.path || "";
  const numero = a.house_number || "";
  const ciudad = a.city || a.town || a.village || a.municipality || "";
  const linea = calle && (numero ? `${calle} ${numero}` : calle);
  return { calle, numero, ciudad, texto: [linea, ciudad].filter(Boolean).join(", ") };
}
