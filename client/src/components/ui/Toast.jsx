/* Aviso breve en la esquina inferior derecha */
import { useEffect, useState } from "react";

export default function Toast({ aviso }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!aviso) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [aviso]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 bottom-4 z-70 max-w-[calc(100vw-2rem)] rounded-xl bg-c1 px-5 py-3 text-white shadow-lg transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      {aviso?.texto}
    </div>
  );
}
