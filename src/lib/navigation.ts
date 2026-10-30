import type { Inhalt, Kurs, ModulMeta, Thema, Unterbereich } from './typen';

export interface UnterbereichMitModulen {
  unterbereich: Unterbereich;
  module: ModulMeta[];
}

export interface ThemaMitModulen {
  thema: Thema;
  /** Alle sichtbaren Module des Themas in Anzeigereihenfolge: bei gegliederten Themen nach Unterbereichen, danach der Abschluss. */
  module: ModulMeta[];
  /** Unterbereiche mit mindestens einem sichtbaren Modul, in der Reihenfolge der themen.json. Leer bei Themen ohne Gliederung. */
  unterbereiche: UnterbereichMitModulen[];
  /** Bei gegliederten Themen die Module ohne Unterbereich (zum Beispiel die Ich-Kann-Liste), sonst leer. */
  abschluss: ModulMeta[];
}

/** Baut die Gliederung eines Themas aus seinen sichtbaren Modulen. Die Kursreihenfolge bleibt innerhalb jeder Gruppe erhalten. */
function gliedere(thema: Thema, module: ModulMeta[]): ThemaMitModulen {
  const unterbereiche = (thema.unterbereiche ?? [])
    .map((unterbereich) => ({ unterbereich, module: module.filter((m) => m.unterbereich === unterbereich.id) }))
    .filter((u) => u.module.length > 0);
  if (unterbereiche.length === 0) return { thema, module, unterbereiche: [], abschluss: [] };
  const abschluss = module.filter((m) => !unterbereiche.some((u) => u.module.includes(m)));
  return { thema, module: [...unterbereiche.flatMap((u) => u.module), ...abschluss], unterbereiche, abschluss };
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
    .map((thema) => gliedere(thema, module.filter((m) => m.thema === thema.id)))
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

/**
 * Bestimmt den angezeigten Abschnitt eines Moduls. Ohne Angabe ist es der erste Abschnitt, bei einer unbekannten Angabe null.
 * Module ohne Abschnitte liefern ebenfalls null.
 */
export function aktiverAbschnitt(modul: ModulMeta, gewuenscht?: string): string | null {
  const liste = modul.abschnitte;
  if (!liste || liste.length === 0) return null;
  if (gewuenscht === undefined) return liste[0]!.id;
  return liste.some((a) => a.id === gewuenscht) ? gewuenscht : null;
}

/**
 * Laufende Nummer eines Moduls im Kurs (ab 1): bei Themen ohne Gliederung innerhalb des Themenbereichs,
 * bei gegliederten Themen innerhalb des Unterbereichs. Der Abschluss eines gegliederten Themas hat keine Nummer.
 * Null, wenn das Modul nicht im Kurs steht.
 */
export function modulNummer(nav: KursNavigation, modulId: string): number | null {
  for (const t of nav.themen) {
    if (t.unterbereiche.length > 0) {
      for (const u of t.unterbereiche) {
        const i = u.module.findIndex((m) => m.id === modulId);
        if (i >= 0) return i + 1;
      }
      continue;
    }
    const i = t.module.findIndex((m) => m.id === modulId);
    if (i >= 0) return i + 1;
  }
  return null;
}

/** Unterbereich, zu dem ein Modul im Kurs gehört, sonst null (kein gegliedertes Thema oder Abschluss). */
export function unterbereichVonModul(nav: KursNavigation, modulId: string): Unterbereich | null {
  for (const t of nav.themen) for (const u of t.unterbereiche) if (u.module.some((m) => m.id === modulId)) return u.unterbereich;
  return null;
}

/** Titel mit Nummer im Kurs, z. B. "1. Vom Einheitskreis zu Sinus- und Kosinusfunktion". */
export function nummerierterTitel(nav: KursNavigation, modul: ModulMeta): string {
  const n = modulNummer(nav, modul.id);
  return n === null ? modul.titel : `${n}. ${modul.titel}`;
}
