import type { Inhalt, Kurs, ModulMeta, Thema } from './typen';

export interface ThemaMitModulen {
  thema: Thema;
  module: ModulMeta[];
}

export interface KursNavigation {
  kurs: Kurs;
  themen: ThemaMitModulen[];
  /** Aktuelles Unterrichtsthema (Modul), falls gesetzt und sichtbar. */
  aktuell: ModulMeta | null;
}

/**
 * Baut die Navigation für einen Kurs. Es erscheinen nur die im Kurs freigegebenen Themen und Module,
 * in der Reihenfolge der Kursdatei. Entwürfe werden nur mit entwuerfe = true angezeigt (Vorschau).
 */
export function baueNavigation(inhalt: Inhalt, kursId: string, optionen: { entwuerfe: boolean }): KursNavigation | null {
  const kurs = inhalt.kurse.find((k) => k.id === kursId);
  if (!kurs) return null;
  const sichtbar = (m: ModulMeta) => optionen.entwuerfe || m.status === 'freigegeben';
  const module = kurs.module
    .map((id) => inhalt.module.find((m) => m.id === id))
    .filter((m): m is ModulMeta => m !== undefined && sichtbar(m));
  const themen = kurs.themen
    .map((id) => inhalt.themen.find((t) => t.id === id))
    .filter((t): t is Thema => t !== undefined)
    .map((thema) => ({ thema, module: module.filter((m) => m.thema === thema.id) }))
    .filter((t) => t.module.length > 0);
  const aktuell = module.find((m) => m.id === kurs.aktuellesModul) ?? null;
  return { kurs, themen, aktuell };
}

export function alleModule(nav: KursNavigation): ModulMeta[] {
  return nav.themen.flatMap((t) => t.module);
}

export function findeNachbarn(nav: KursNavigation, modulId: string): { zurueck: ModulMeta | null; weiter: ModulMeta | null } {
  const liste = alleModule(nav);
  const i = liste.findIndex((m) => m.id === modulId);
  if (i < 0) return { zurueck: null, weiter: null };
  return { zurueck: liste[i - 1] ?? null, weiter: liste[i + 1] ?? null };
}

export function themaVonModul(inhalt: Inhalt, modul: ModulMeta): Thema | undefined {
  return inhalt.themen.find((t) => t.id === modul.thema);
}
