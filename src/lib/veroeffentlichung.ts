import type { Inhalt } from './typen.ts';

/**
 * Inhalte des öffentlichen Builds: Kurse mit nurVorschau entfallen. Es bleiben nur freigegebene Module, die in einem
 * dieser Kurse stehen, und nur deren Themenbereiche. Ein freigegebenes Modul wird also erst veröffentlicht, wenn ein veröffentlichter Kurs darauf verweist.
 */
export function inhaltFuerVeroeffentlichung(inhalt: Inhalt): Inhalt {
  const kurse = inhalt.kurse.filter((k) => !k.nurVorschau);
  const verwendet = new Set(kurse.flatMap((k) => k.module));
  const module = inhalt.module.filter((m) => m.status === 'freigegeben' && verwendet.has(m.id));
  const benutzteThemen = new Set(module.map((m) => m.thema));
  const themen = inhalt.themen.filter((t) => benutzteThemen.has(t.id));
  return { themen, module, kurse };
}
