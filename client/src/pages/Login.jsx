/* Pantalla de acceso: solo contraseña */
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn, TreeDeciduous } from "lucide-react";
import { api, sesion } from "../services/api.js";

export default function Login({ onEntrar }) {
  const [clave, setClave] = useState("");
  const [ver, setVer] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    if (!clave) return setError("Ingrese la contraseña");
    setCargando(true);
    setError("");
    try {
      const { token } = await api.login(clave);
      sesion.guardar(token);
      onEntrar();
    } catch (err) {
      setError(navigator.onLine ? err.message : "Sin conexión. Conéctese para ingresar.");
      setClave("");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#eaf5fd] to-white px-4">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-2xl border border-borde bg-white p-8 shadow-[0_10px_40px_rgba(11,92,143,.12)]"
      >
        <div className="mb-7 flex flex-col items-center text-center">
          <span className="mb-4 flex size-19 items-center justify-center rounded-2xl bg-linear-to-br from-c1 to-c2 text-white shadow-md">
            <TreeDeciduous size={40} />
          </span>
          <h1 className="text-xl font-bold text-[#1d2833]">Arbolado Chillán</h1>
          <p className="mt-1 text-[15px] text-[#4a5a6a]">Plataforma de análisis visual</p>
        </div>

        <label className="mb-2 block text-xs font-semibold tracking-wide text-[#4a5a6a] uppercase">
          Contraseña
        </label>
        <div className="relative">
          <LockKeyhole
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#6b7c8c]"
          />
          <input
            type={ver ? "text" : "password"}
            className="campo pr-11 pl-10"
            placeholder="Ingrese la contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoFocus
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setVer((v) => !v)}
            aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#6b7c8c] hover:bg-[#f0f6fb]"
          >
            {ver ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="btn btn-primario mt-6 w-full justify-center py-3 disabled:opacity-60"
        >
          <LogIn size={18} />
          {cargando ? "Verificando…" : "Ingresar"}
        </button>
      </form>
    </main>
  );
}