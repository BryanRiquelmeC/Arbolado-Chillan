/* Estado de un formulario: datos, cambiar un campo, cargar y limpiar.
   "inicial" es una función que devuelve los valores por defecto. */
import { useCallback, useState } from "react";

export function useFormulario(inicial = () => ({})) {
  const [datos, setDatos] = useState(inicial);

  const set = useCallback((campo, valor) => setDatos((d) => ({ ...d, [campo]: valor })), []);
  const cargar = useCallback((registro) => setDatos({ ...registro }), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const limpiar = useCallback(() => setDatos(inicial()), []);

  return { datos, set, cargar, limpiar };
}
