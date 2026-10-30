import type { Aussage } from '@/lib/ichkann';

/* ---------- Bereiche, Module und Aussagen der Ich-Kann-Liste Integralrechnung ---------- */

export const GRUPPEN = [
  { id: 'stammfunktionen', titel: 'Stammfunktionen' },
  { id: 'gesamtaenderung', titel: 'Gesamtänderung' },
  { id: 'integral', titel: 'Bestimmtes Integral' },
  { id: 'integralfunktion', titel: 'Integralfunktion' },
  { id: 'flaechen', titel: 'Flächen und Volumen' },
  { id: 'mittelwert', titel: 'Mittelwert und Anwendung' },
] as const;
export type Gruppe = (typeof GRUPPEN)[number]['id'];

/** Kurzbezeichnung der Module, auf die verwiesen wird. Die IDs entsprechen den Ordnern in content/modules. */
export const MODULE: Record<string, string> = {
  'integral-hinfuehrung': 'Hinführung zur Integralrechnung',
  'bestimmtes-integral': 'Das bestimmte Integral',
  integralfunktion: 'Die Integralfunktion und der Hauptsatz',
  stammfunktionen: 'Stammfunktionen bestimmen',
  'flaeche-kurve-x-achse': 'Flächeninhalt zwischen Kurve und x-Achse',
  'flaeche-zwischen-kurven': 'Flächeninhalt zwischen zwei Kurven',
  rotationsvolumen: 'Rotationsvolumen',
  mittelwert: 'Mittelwert einer Funktion',
  'uebungsaufgaben-integralrechnung': 'Übungsaufgaben Integralrechnung im Abiturstil',
  'venn-integralrechnung': 'Venn-Diagramme zur Integralrechnung',
};

/** Titel der Abschnitte, auf die verwiesen wird (wie in den meta.json der Module). */
export const ABSCHNITT_TITEL: Record<string, string> = {
  erklaeren: 'Erklären',
  entdecken: 'Entdecken',
  ueberpruefen: 'Überprüfen',
  zusammenfassung: 'Zusammenfassung',
  hinweise: 'Aufbau und Operatoren',
  'ohne-hilfsmittel': 'Ohne Hilfsmittel',
  'mit-hilfsmittel': 'Mit Hilfsmittel',
  vorgehen: 'Vorgehen',
  'diagramm-1': 'Diagramm 1',
  'diagramm-2': 'Diagramm 2',
};

const HF = 'integral-hinfuehrung';
const BI = 'bestimmtes-integral';
const IF = 'integralfunktion';
const SF = 'stammfunktionen';
const FA = 'flaeche-kurve-x-achse';
const FK = 'flaeche-zwischen-kurven';
const RV = 'rotationsvolumen';
const UI = 'uebungsaufgaben-integralrechnung';
const VI = 'venn-integralrechnung';
const MW = 'mittelwert';

const v = (modul: string, ...abschnitte: string[]) => abschnitte.map((abschnitt) => ({ modul, abschnitt }));

/**
 * Die Aussagen der Ich-Kann-Liste der Lehrkraft (Nr. 1 bis 17), Wortlaut leicht gekürzt, ohne Formeln.
 * Die Aussagen 18 bis 20 und die Aussage „!“ sind nach dem Bildungsplan ergänzt (19 und 20 zum Mittelwert, einem Wahlgebiet des Bildungsplans).
 */
export const AUSSAGEN: Aussage[] = [
  { id: 'stammfunktion-potenz', nr: '1', gruppe: 'stammfunktionen', text: 'eine Stammfunktion einer gegebenen Potenzfunktion angeben.', bpe: ['12.4'], verweise: [...v(SF, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'stammfunktion-exp', nr: '2', gruppe: 'stammfunktionen', text: 'eine Stammfunktion einer gegebenen Exponentialfunktion angeben.', bpe: ['12.4'], verweise: [...v(SF, 'erklaeren', 'zusammenfassung')], teile: ['1'] },
  { id: 'stammfunktion-trig', nr: '3', gruppe: 'stammfunktionen', text: 'eine Stammfunktion einer gegebenen trigonometrischen Funktion angeben.', bpe: ['12.4'], verweise: [...v(SF, 'erklaeren', 'zusammenfassung')], teile: ['1'] },
  { id: 'unbestimmtes-integral', nr: '4', gruppe: 'stammfunktionen', text: 'das unbestimmte Integral einer gegebenen Funktion angeben.', bpe: ['12.4'], verweise: [...v(SF, 'erklaeren', 'zusammenfassung')], teile: ['1'] },
  { id: 'stammfunktion-durch-punkt', nr: '5', gruppe: 'stammfunktionen', text: 'die Stammfunktion einer Funktion, die durch einen gegebenen Punkt verläuft, bestimmen.', bpe: ['12.4', '13.2'], verweise: [...v(SF, 'entdecken', 'ueberpruefen')], teile: ['1'] },

  { id: 'gesamtaenderung', nr: '6', gruppe: 'gesamtaenderung', text: 'den Zusammenhang zwischen dem Integral und der Gesamtänderung einer Größe erkennen und beschreiben.', bpe: ['13.1'], verweise: [...v(HF, 'erklaeren', 'zusammenfassung'), ...v(BI, 'zusammenfassung')], teile: ['1'] },
  { id: 'gesamtaenderung-grafisch', nr: '7', gruppe: 'gesamtaenderung', text: 'die Gesamtänderung einer Größe grafisch näherungsweise bestimmen.', bpe: ['13.1'], verweise: [...v(HF, 'entdecken', 'ueberpruefen')], teile: ['1'] },

  { id: 'integral-berechnen', nr: '8', gruppe: 'integral', text: 'das bestimmte Integral mithilfe einer Stammfunktion berechnen.', bpe: ['13.1', '13.2'], verweise: [...v(BI, 'erklaeren', 'ueberpruefen'), ...v(SF, 'ueberpruefen')], teile: ['1'] },
  { id: 'flaechenbilanz', nr: '9', gruppe: 'integral', text: 'das bestimmte Integral als Flächenbilanz oder Flächeninhalt anschaulich interpretieren.', bpe: ['13.1'], verweise: [...v(BI, 'entdecken', 'zusammenfassung'), ...v(FA, 'erklaeren')], teile: ['1'] },
  { id: 'vorzeichen-integral', nr: '10', gruppe: 'integral', text: 'anhand einer Skizze erläutern, ob ein bestimmtes Integral größer, kleiner oder gleich null ist.', bpe: ['13.1'], verweise: [...v(BI, 'entdecken', 'ueberpruefen'), ...v(VI, 'diagramm-2')], teile: ['a', 'b'] },

  { id: 'integralfunktion-bilden', nr: '11', gruppe: 'integralfunktion', text: 'eine Integralfunktion zu einer gegebenen unteren Grenze bestimmen.', bpe: ['13.2'], verweise: [...v(IF, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'stammfunktion-integralfunktion', nr: '12', gruppe: 'integralfunktion', text: 'den Zusammenhang zwischen Stammfunktion und Integralfunktion erklären.', bpe: ['13.2'], verweise: [...v(IF, 'entdecken', 'zusammenfassung'), ...v(SF, 'zusammenfassung')], teile: ['1'] },
  { id: 'integralfunktion-skizzieren', nr: '13', gruppe: 'integralfunktion', text: 'das Schaubild einer bestimmten Integralfunktion skizzieren.', bpe: ['13.2'], verweise: [...v(IF, 'entdecken', 'ueberpruefen')], teile: ['1'] },
  { id: 'schaubilder-zusammenhang', nr: '14', gruppe: 'integralfunktion', text: 'Zusammenhänge zwischen den Schaubildern einer Funktion und ihrer Stammfunktionen bzw. einer bestimmten Integralfunktion erkennen.', bpe: ['13.2'], verweise: [...v(IF, 'entdecken', 'ueberpruefen'), ...v(UI, 'ohne-hilfsmittel', 'mit-hilfsmittel')], teile: ['1'] },

  { id: 'flaeche-x-achse', nr: '15', gruppe: 'flaechen', text: 'den vom Schaubild einer Funktion und der x-Achse eingeschlossenen Flächeninhalt auf einem gegebenen Intervall mithilfe der Integralrechnung bestimmen.', bpe: ['13.3'], verweise: [...v(FA, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'flaeche-zwischen-kurven', nr: '16', gruppe: 'flaechen', text: 'den Flächeninhalt zwischen zwei Schaubildern mithilfe der Integralrechnung bestimmen.', bpe: ['13.3'], verweise: [...v(FK, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'rotationsvolumen', nr: '17', gruppe: 'flaechen', text: 'das Volumen eines Rotationskörpers mithilfe der Integralrechnung bestimmen.', bpe: ['13.3'], verweise: [...v(RV, 'erklaeren', 'zusammenfassung')], teile: ['1'] },
  { id: 'grenze-gesucht', nr: '18', gruppe: 'flaechen', text: 'Integrationsgrenzen bestimmen, wenn der Wert des Integrals oder der Flächeninhalt gegeben ist.', bpe: ['13.2', '13.3'], ergaenzt: true, verweise: [...v(IF, 'ueberpruefen'), ...v(FA, 'entdecken', 'ueberpruefen'), ...v(UI, 'ohne-hilfsmittel')], teile: ['1'] },
  { id: 'mittelwert-berechnen', nr: '19', gruppe: 'mittelwert', text: 'den Mittelwert einer Funktion auf einem Intervall berechnen und als Höhe eines Rechtecks mit gleichem Flächeninhalt deuten.', bpe: ['13.1', '22.1'], ergaenzt: true, verweise: [...v(MW, 'erklaeren', 'entdecken', 'zusammenfassung')], teile: ['1'] },
  { id: 'mittelwert-anwenden', nr: '20', gruppe: 'mittelwert', text: 'den Mittelwert in Sachaufgaben anwenden und vom Mittelwert der Randwerte unterscheiden.', bpe: ['13.1', '22.1'], ergaenzt: true, verweise: [...v(MW, 'ueberpruefen', 'zusammenfassung'), ...v(HF, 'zusammenfassung')], teile: ['1'] },
  { id: 'transfer', nr: '!', gruppe: 'mittelwert', text: 'die obigen mathematischen Fähigkeiten auf komplexere und anwendungsbezogene Aufgaben anwenden.', bpe: ['13.1', '13.2', '13.3'], ergaenzt: true, verweise: [...v(UI, 'ohne-hilfsmittel', 'mit-hilfsmittel'), ...v(VI, 'diagramm-1')], teile: [] },
];

export const aussage = (id: string): Aussage => {
  const a = AUSSAGEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Aussage: ${id}`);
  return a;
};
