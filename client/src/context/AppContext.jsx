/* =============================================================
   Estado global de la app
   · registros guardados en la tablet
   · sincronización con la nube
   · avisos (toast), confirmaciones y ventana de detalle
   ============================================================= */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import * as db from "../services/db.js";
import { sincronizar } from "../services/sync.js";
import Toast from "../components/ui/Toast.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";


/* true  = al eliminar se borra también en la base de datos
   false = al eliminar se borra SOLO en este dispositivo */
const BORRAR_EN_SERVIDOR = true;

const AppContext = createContext(null);
const CINCO_MIN = 5 * 60 * 1000;

const ordenar = (lista) =>
  [...lista].sort((a, b) =>
    (b._actualizado || b._creado || "").localeCompare(a._actualizado || a._creado || "")
  );

export function AppProvider({ children }) {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [sync, setSync] = useState({
    estado: "local", // local | ok | sincronizando | pendiente | sinconexion | error
    ultima: localStorage.getItem("sync_ultima") || ""
  });
  const [aviso, setAviso] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const registrosRef = useRef(registros);
  const ocupado = useRef(false);
  registrosRef.current = registros;

  /* ---------- Avisos y confirmaciones ---------- */
  const toast = useCallback((texto) => {
    setAviso({ texto, id: Date.now() });
  }, []);

  /** Uso: if (await confirmar({ titulo, texto, ok, peligro })) { ... } */
  const confirmar = useCallback(
    (opciones) => new Promise((resolve) => setConfirmacion({ ...opciones, resolve })),
    []
  );

  /* ---------- Sincronización ---------- */
  const sincronizarAhora = useCallback(
    async (manual = false) => {
      if (ocupado.current) return;
      if (!navigator.onLine) {
        setSync((s) => ({ ...s, estado: "sinconexion" }));
        if (manual) toast("Sin conexión: los datos quedan guardados en la tablet");
        return;
      }
      ocupado.current = true;
      setSync((s) => ({ ...s, estado: "sincronizando" }));
      try {
        const lista = await sincronizar(registrosRef.current);
        // Conserva lo guardado o eliminado en la tablet mientras se sincronizaba
        const mapa = new Map(lista.map((r) => [r._id, r]));
        for (const r of registrosRef.current) {
          const enLista = mapa.get(r._id);
          if (r._pend && (!enLista || (r._actualizado || "") > (enLista._actualizado || "")))
            mapa.set(r._id, r);
        }
        db.borradosPendientes().forEach((id) => mapa.delete(id));
        const final = ordenar([...mapa.values()]);
        registrosRef.current = final;
        setRegistros(final);
        const ultima = new Date().toISOString();
        localStorage.setItem("sync_ultima", ultima);
        setSync({ estado: "ok", ultima });
        if (manual) toast("Sincronización completa ✔");
      } catch (e) {
        setSync((s) => ({ ...s, estado: e.sinNube ? "local" : "error" }));
        if (manual)
          toast(
            e.sinNube ? "El servidor no está disponible" : "⚠ Error al sincronizar, se reintentará"
          );
        if (!e.sinNube) console.error(e);
      } finally {
        ocupado.current = false;
      }
    },
    [toast]
  );

  /* ---------- Carga inicial y sincronización periódica ---------- */
  useEffect(() => {
    let activo = true;
    (async () => {
      await db.pedirAlmacenamientoPersistente();
      const lista = await db.leerTodos();
      if (!activo) return;
      setRegistros(ordenar(lista));
      registrosRef.current = lista;
      setCargando(false);
      sincronizarAhora();
    })();

    const alVolver = () => !document.hidden && sincronizarAhora();
    const sinRed = () => setSync((s) => ({ ...s, estado: "sinconexion" }));
    const reloj = setInterval(alVolver, CINCO_MIN);
    window.addEventListener("online", alVolver);
    window.addEventListener("offline", sinRed);
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      activo = false;
      clearInterval(reloj);
      window.removeEventListener("online", alVolver);
      window.removeEventListener("offline", sinRed);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [sincronizarAhora]);

  /* ---------- Operaciones sobre registros ---------- */
  const guardarRegistro = useCallback(
    async (registro) => {
      const r = { ...registro, _pend: true, _actualizado: new Date().toISOString() };
      await db.guardar(r);
      setRegistros((l) => ordenar([r, ...l.filter((x) => x._id !== r._id)]));
      registrosRef.current = [r, ...registrosRef.current.filter((x) => x._id !== r._id)];
      sincronizarAhora();
      return r;
    },
    [sincronizarAhora]
  );

  const guardarVarios = useCallback(
    async (lista) => {
      const ahora = new Date().toISOString();
      const nuevos = lista.map((r) => ({
        ...r,
        _pend: true,
        _actualizado: r._actualizado || ahora
      }));
      await db.guardarVarios(nuevos);
      const ids = new Set(nuevos.map((r) => r._id));
      const total = ordenar([...nuevos, ...registrosRef.current.filter((x) => !ids.has(x._id))]);
      setRegistros(total);
      registrosRef.current = total;
      sincronizarAhora();
    },
    [sincronizarAhora]
  );

  const eliminarRegistro = useCallback(
    async (id) => {
      await db.eliminar(id);
      if (BORRAR_EN_SERVIDOR) {
        db.setBorradosPendientes([...db.borradosPendientes(), id]);
      } else {
        db.ocultar(id); // no volver a descargarlo
      }
      setRegistros((l) => l.filter((x) => x._id !== id));
      registrosRef.current = registrosRef.current.filter((x) => x._id !== id);
      sincronizarAhora();
    },
    [sincronizarAhora]
  );

  const pendientes = registros.filter((r) => r._pend).length + db.borradosPendientes().length;

  const valor = useMemo(
    () => ({
      registros,
      cargando,
      sync: { ...sync, pendientes },
      sincronizarAhora,
      guardarRegistro,
      guardarVarios,
      eliminarRegistro,
      toast,
      confirmar
    }),
    [
      registros,
      cargando,
      sync,
      pendientes,
      sincronizarAhora,
      guardarRegistro,
      guardarVarios,
      eliminarRegistro,
      toast,
      confirmar
    ]
  );

  return (
    <AppContext.Provider value={valor}>
      {children}
      <Toast aviso={aviso} />
      <ConfirmDialog
        datos={confirmacion}
        onCerrar={(respuesta) => {
          confirmacion?.resolve(respuesta);
          setConfirmacion(null);
        }}
      />
    </AppContext.Provider>
  );
}

/** Acceso al estado global desde cualquier componente */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
