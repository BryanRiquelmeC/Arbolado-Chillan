/* Lleva la pantalla a un campo del formulario ([data-campo="…"]), lo resalta y pone el cursor */
/** Desplaza la pantalla hasta el campo, lo resalta un momento y pone el cursor en él */
export function irACampo(campo) {
  const el = document.querySelector(`[data-campo="${campo}"]`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("campo-falta");
  setTimeout(() => el.classList.remove("campo-falta"), 2600);
  const control = el.querySelector("input:not([type=hidden]):not([type=radio]):not([type=checkbox]), select, textarea");
  setTimeout(() => control?.focus({ preventScroll: true }), 450);
}

