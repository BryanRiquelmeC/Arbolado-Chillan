/* Nota informativa con ícono */
import { Info } from "lucide-react";

export default function Nota({ children }) {
  return (
    <p className="flex items-start gap-2 text-[13px] text-suave">
      <Info size={16} className="mt-0.5 flex-none text-c2" />
      {children}
    </p>
  );
}
