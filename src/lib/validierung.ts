import {
  PRINZIP_WERTE,
  STATUS_WERTE,
  type Abschnitt,
  type Inhalt,
  type Kurs,
  type ModulMeta,
  type RohInhalt,
  type Thema,
} from './typen.ts';

export const ID_MUSTER = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export interface Ergebnis {
  fehler: string[];
  inhalt: Inhalt;
}

export class InhaltsFehler extends Error {
  readonly fehler: string[];
  constructor(fehler: string[]) {
    super(`Ungültige Inhalte (${fehler.length} Fehler):\n- ${fehler.join('\n- ')}`);
    this.name = 'InhaltsFehler';
    this.fehler = fehler;
  }
}

type Objekt = Record<string, unknown>;

const istObjekt = (x: unknown): x is Objekt => typeof x === 'object' && x !== null && !Array.isArray(x);
const istText = (x: unknown): x is string => typeof x === 'string' && x.trim() !== '';
const istTextListe = (x: unknown): x is string[] => Array.isArray(x) && x.every((e) => typeof e === 'string');

function doppelte(werte: string[]): string[] {
  return werte.filter((w, i) => werte.indexOf(w) !== i).filter((w, i, a) => a.indexOf(w) === i);
}

function pruefeThemen(roh: RohInhalt['themen'], fehler: string[]): Thema[] {
  const d = roh.daten;
  if (!istObjekt(d) || !Array.isArray(d.themen)) {
    fehler.push(`${roh.datei}: Erwartet wird ein Objekt mit der Liste "themen".`);
    return [];
  }
  const themen: Thema[] = [];
  d.themen.forEach((t: unknown, i: number) => {
    const ort = `${roh.datei}, Eintrag ${i + 1}`;
    if (!istObjekt(t)) return void fehler.push(`${ort}: Kein Objekt.`);
    if (!istText(t.id) || !ID_MUSTER.test(t.id))
      return void fehler.push(`${ort}: "id" fehlt oder ist ungültig (erlaubt: Kleinbuchstaben, Ziffern, Bindestriche).`);
    if (!istText(t.titel)) fehler.push(`${ort} (${t.id}): "titel" fehlt.`);
    if (t.beschreibung !== undefined && typeof t.beschreibung !== 'string')
      fehler.push(`${ort} (${t.id}): "beschreibung" muss ein Text sein.`);
    themen.push({
      id: t.id,
      titel: istText(t.titel) ? t.titel : t.id,
      ...(typeof t.beschreibung === 'string' ? { beschreibung: t.beschreibung } : {}),
    });
  });
  for (const id of doppelte(themen.map((t) => t.id))) fehler.push(`${roh.datei}: Thema-ID "${id}" kommt mehrfach vor.`);
  return themen;
}

function pruefeModule(roh: RohInhalt['module'], themenIds: Set<string>, fehler: string[]): ModulMeta[] {
  const module: ModulMeta[] = [];
  for (const m of roh) {
    const ort = m.datei;
    const d = m.daten;
    if (!istObjekt(d)) {
      fehler.push(`${ort}: Kein Objekt.`);
      continue;
    }
    if (!istText(d.id) || !ID_MUSTER.test(d.id)) {
      fehler.push(`${ort}: "id" fehlt oder ist ungültig.`);
      continue;
    }
    if (d.id !== m.ordner) fehler.push(`${ort}: "id" (${d.id}) muss dem Ordnernamen (${m.ordner}) entsprechen.`);
    if (!m.hatIndex) fehler.push(`${ort}: Die Datei index.tsx fehlt im Modulordner.`);
    if (!istText(d.titel)) fehler.push(`${ort}: "titel" fehlt.`);
    if (!istText(d.thema) || !themenIds.has(d.thema)) fehler.push(`${ort}: Thema "${String(d.thema)}" existiert nicht in content/themen.json.`);
    if (typeof d.status !== 'string' || !(STATUS_WERTE as readonly string[]).includes(d.status))
      fehler.push(`${ort}: "status" muss "entwurf" oder "freigegeben" sein.`);
    if (!istText(d.beschreibung)) fehler.push(`${ort}: "beschreibung" fehlt.`);
    if (d.bpe !== undefined && !istTextListe(d.bpe)) fehler.push(`${ort}: "bpe" muss eine Liste von Texten sein.`);
    if (d.prinzipien !== undefined && !(istTextListe(d.prinzipien) && d.prinzipien.every((p) => (PRINZIP_WERTE as readonly string[]).includes(p))))
      fehler.push(`${ort}: "prinzipien" darf nur "erklaeren", "entdecken", "ueberpruefen" enthalten.`);
    let abschnitte: Abschnitt[] | undefined;
    if (d.abschnitte !== undefined) {
      if (!Array.isArray(d.abschnitte) || d.abschnitte.length === 0) fehler.push(`${ort}: "abschnitte" muss eine nicht leere Liste sein.`);
      else {
        abschnitte = [];
        d.abschnitte.forEach((a: unknown, i: number) => {
          if (!istObjekt(a) || !istText(a.id) || !ID_MUSTER.test(a.id) || !istText(a.titel))
            return void fehler.push(`${ort}: Abschnitt ${i + 1} braucht "id" (Kleinbuchstaben, Ziffern, Bindestriche) und "titel".`);
          abschnitte!.push({ id: a.id, titel: a.titel });
        });
        for (const id of doppelte(abschnitte.map((a) => a.id))) fehler.push(`${ort}: Abschnitts-ID "${id}" kommt mehrfach vor.`);
      }
    }
    module.push({
      id: d.id,
      titel: istText(d.titel) ? d.titel : d.id,
      thema: String(d.thema),
      status: d.status === 'freigegeben' ? 'freigegeben' : 'entwurf',
      beschreibung: typeof d.beschreibung === 'string' ? d.beschreibung : '',
      ...(istTextListe(d.bpe) ? { bpe: d.bpe } : {}),
      ...(istTextListe(d.prinzipien) ? { prinzipien: d.prinzipien as ModulMeta['prinzipien'] } : {}),
      ...(abschnitte && abschnitte.length > 0 ? { abschnitte } : {}),
    });
  }
  for (const id of doppelte(module.map((m) => m.id))) fehler.push(`Modul-ID "${id}" kommt mehrfach vor.`);
  return module;
}

function pruefeKurse(
  roh: RohInhalt['kurse'],
  themen: Thema[],
  module: ModulMeta[],
  produktion: boolean,
  fehler: string[],
): Kurs[] {
  const themenIds = new Set(themen.map((t) => t.id));
  const modulMap = new Map(module.map((m) => [m.id, m]));
  const kurse: Kurs[] = [];
  for (const k of roh) {
    const ort = k.datei;
    const d = k.daten;
    if (!istObjekt(d)) {
      fehler.push(`${ort}: Kein Objekt.`);
      continue;
    }
    const dateiId = ort.replace(/^.*\//, '').replace(/\.json$/, '');
    if (!istText(d.id) || !ID_MUSTER.test(d.id)) {
      fehler.push(`${ort}: "id" fehlt oder ist ungültig.`);
      continue;
    }
    if (d.id !== dateiId) fehler.push(`${ort}: "id" (${d.id}) muss dem Dateinamen (${dateiId}) entsprechen.`);
    if (!istText(d.titel)) fehler.push(`${ort}: "titel" fehlt.`);
    if (d.beschreibung !== undefined && typeof d.beschreibung !== 'string') fehler.push(`${ort}: "beschreibung" muss ein Text sein.`);
    if (!istTextListe(d.themen) || !istTextListe(d.module)) {
      fehler.push(`${ort}: "themen" und "module" müssen Listen von IDs sein.`);
      continue;
    }
    for (const id of doppelte(d.themen)) fehler.push(`${ort}: Thema "${id}" ist mehrfach aufgeführt.`);
    for (const id of doppelte(d.module)) fehler.push(`${ort}: Modul "${id}" ist mehrfach aufgeführt.`);
    for (const t of d.themen) if (!themenIds.has(t)) fehler.push(`${ort}: Thema "${t}" existiert nicht.`);
    for (const id of d.module) {
      const m = modulMap.get(id);
      if (!m) {
        fehler.push(`${ort}: Modul "${id}" existiert nicht.`);
        continue;
      }
      if (produktion && m.status !== 'freigegeben')
        fehler.push(`${ort}: Modul "${id}" ist ein Entwurf und darf in einem veröffentlichten Kurs nicht freigegeben sein.`);
      if (!d.themen.includes(m.thema))
        fehler.push(`${ort}: Modul "${id}" gehört zum Thema "${m.thema}", das in diesem Kurs nicht sichtbar ist.`);
    }
    for (const t of d.themen)
      if (themenIds.has(t) && !d.module.some((id) => modulMap.get(id)?.thema === t))
        fehler.push(`${ort}: Thema "${t}" ist sichtbar, enthält aber kein freigegebenes Modul.`);
    const aktuell = d.aktuellesModul;
    if (aktuell !== null && typeof aktuell !== 'string') fehler.push(`${ort}: "aktuellesModul" muss eine Modul-ID oder null sein.`);
    else if (typeof aktuell === 'string' && !d.module.includes(aktuell))
      fehler.push(`${ort}: "aktuellesModul" (${aktuell}) muss in der Modulliste des Kurses enthalten sein.`);
    kurse.push({
      id: d.id,
      titel: istText(d.titel) ? d.titel : d.id,
      ...(typeof d.beschreibung === 'string' ? { beschreibung: d.beschreibung } : {}),
      themen: d.themen,
      module: d.module,
      aktuellesModul: typeof aktuell === 'string' ? aktuell : null,
    });
  }
  for (const id of doppelte(kurse.map((k) => k.id))) fehler.push(`Kurs-ID "${id}" kommt mehrfach vor.`);
  return kurse;
}

/**
 * Prüft alle Inhalte auf Struktur und Verweise.
 * produktion = true: Verweist ein Kurs auf einen Entwurf, ist das ein Fehler.
 */
export function pruefeInhalte(roh: RohInhalt, optionen: { produktion: boolean }): Ergebnis {
  const fehler: string[] = [];
  const themen = pruefeThemen(roh.themen, fehler);
  const module = pruefeModule(roh.module, new Set(themen.map((t) => t.id)), fehler);
  const kurse = pruefeKurse(roh.kurse, themen, module, optionen.produktion, fehler);
  return { fehler, inhalt: { themen, module, kurse } };
}

/** Wie pruefeInhalte, wirft aber bei Fehlern. */
export function pruefeOderWirf(roh: RohInhalt, optionen: { produktion: boolean }): Inhalt {
  const { fehler, inhalt } = pruefeInhalte(roh, optionen);
  if (fehler.length > 0) throw new InhaltsFehler(fehler);
  return inhalt;
}
