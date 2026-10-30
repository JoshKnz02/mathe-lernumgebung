export type Status = 'entwurf' | 'freigegeben';
export type Prinzip = 'erklaeren' | 'entdecken' | 'ueberpruefen';

export const STATUS_WERTE: readonly Status[] = ['entwurf', 'freigegeben'];
export const PRINZIP_WERTE: readonly Prinzip[] = ['erklaeren', 'entdecken', 'ueberpruefen'];

/** Themenbereich, unabhängig von einzelnen Kursen (content/themen.json). Die Reihenfolge in der Datei ist die Standardreihenfolge. */
export interface Thema {
  id: string;
  titel: string;
  beschreibung?: string;
  /** Optional: Gliederung des Themenbereichs in Unterbereiche (zum Beispiel Vektoren, Geraden, Ebenen). Module nennen ihren Unterbereich in meta.json. */
  unterbereiche?: Unterbereich[];
}

/** Unterbereich eines Themenbereichs (content/themen.json). Die Reihenfolge in der Datei ist die Reihenfolge der Darstellung. */
export interface Unterbereich {
  id: string;
  titel: string;
  beschreibung?: string;
}

/** Abschnitt eines Moduls (z. B. Erklären, Entdecken). Wird im Untermenü und in der Abschnittsleiste angeboten. */
export interface Abschnitt {
  id: string;
  titel: string;
}

/** Metadaten eines Lernmoduls (content/modules/<id>/meta.json). */
export interface ModulMeta {
  id: string;
  titel: string;
  thema: string;
  /** Optional: ID eines Unterbereichs des Themenbereichs. Module ohne Unterbereich in einem gegliederten Themenbereich stehen am Ende als Abschluss (zum Beispiel die Ich-Kann-Liste). */
  unterbereich?: string;
  status: Status;
  beschreibung: string;
  /** Bezug zum Bildungsplan, z. B. "3.2.1 (1)". Nur Metadaten, keine Darstellung. */
  bpe?: string[];
  prinzipien?: Prinzip[];
  /** Optional: Aufteilung des Moduls in Abschnitte. Das Modul zeigt jeweils nur einen Abschnitt (Baustein Abschnitt). */
  abschnitte?: Abschnitt[];
}

/**
 * Kurskonfiguration (courses/<id>.json).
 * themen: sichtbare Themenbereiche in Anzeigereihenfolge.
 * module: freigegebene Module in Anzeigereihenfolge (Gruppierung nach Thema erfolgt über meta.thema).
 */
export interface Kurs {
  id: string;
  titel: string;
  beschreibung?: string;
  themen: string[];
  module: string[];
  aktuellesModul: string | null;
  /** true: Kurs erscheint nur in Vorschau und Entwicklung (z. B. Testkurse), nie im öffentlichen Build. */
  nurVorschau?: boolean;
}

export interface Inhalt {
  themen: Thema[];
  module: ModulMeta[];
  kurse: Kurs[];
}

/** Rohdaten, wie sie vom Dateisystem gelesen werden (vor der Validierung). */
export interface RohInhalt {
  themen: { datei: string; daten: unknown };
  module: { ordner: string; datei: string; daten: unknown; hatIndex: boolean }[];
  kurse: { datei: string; daten: unknown }[];
}
