import type { Aussage } from '@/lib/ichkann';

/* ---------- Bereiche, Module und Aussagen der Ich-Kann-Liste Lineare Gleichungssysteme ---------- */

export const GRUPPEN = [
  { id: 'grundlagen', titel: 'Grundlagen' },
  { id: 'gauss', titel: 'Gauß-Algorithmus' },
  { id: 'loesbarkeit', titel: 'Lösbarkeit und Lösungsmenge' },
  { id: 'anwendung', titel: 'Anwendungen' },
] as const;
export type Gruppe = (typeof GRUPPEN)[number]['id'];

/** Kurzbezeichnung der Module, auf die verwiesen wird. Die IDs entsprechen den Ordnern in content/modules. */
export const MODULE: Record<string, string> = {
  'gauss-algorithmus': 'Gauß-Algorithmus',
  'loesbarkeit-lgs': 'Lösbarkeit linearer Gleichungssysteme',
  'uebungsaufgaben-lgs': 'Übungsaufgaben Lineare Gleichungssysteme im Abiturstil',
  'funktionsterme-aufstellen': 'Aufstellen von Funktionstermen',
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
};

const GA = 'gauss-algorithmus';
const LB = 'loesbarkeit-lgs';
const UL = 'uebungsaufgaben-lgs';
const FT = 'funktionsterme-aufstellen';

const v = (modul: string, ...abschnitte: string[]) => abschnitte.map((abschnitt) => ({ modul, abschnitt }));

/**
 * Die Aussagen der Ich-Kann-Liste der Lehrkraft (Nr. 1 bis 10), Wortlaut leicht gekürzt, ohne Formeln.
 * Die Aussage 11 (ein Parameter im System) und die Aussage „!“ sind nach dem Bildungsplan ergänzt.
 */
export const AUSSAGEN: Aussage[] = [
  { id: 'linear-nichtlinear', nr: '1', gruppe: 'grundlagen', text: 'ein lineares Gleichungssystem (LGS) von einem nichtlinearen unterscheiden.', bpe: ['18.1'], verweise: [...v(GA, 'erklaeren')], teile: ['1'] },
  { id: 'nichtlinear-loesen', nr: '2', gruppe: 'grundlagen', text: 'auch einfache nichtlineare Gleichungssysteme lösen.', bpe: ['18.1'], verweise: [...v(GA, 'erklaeren')], teile: ['1'] },
  { id: 'zwei-unbekannte', nr: '3', gruppe: 'grundlagen', text: 'LGS mit zwei Unbekannten mit verschiedenen Verfahren lösen.', bpe: ['18.1'], verweise: [...v(GA, 'erklaeren'), ...v(LB, 'erklaeren')], teile: ['a', 'b'] },

  { id: 'gauss', nr: '4', gruppe: 'gauss', text: 'ein LGS mit drei und mehr Unbekannten mit dem Gaußschen Eliminationsverfahren lösen.', bpe: ['18.1'], verweise: [...v(GA, 'erklaeren', 'ueberpruefen', 'zusammenfassung'), ...v(UL, 'ohne-hilfsmittel')], teile: ['1'] },

  { id: 'dreiecksform', nr: '5', gruppe: 'loesbarkeit', text: 'an der Dreiecksform eines LGS erkennen, ob es eindeutig, mehrdeutig oder nicht lösbar ist.', bpe: ['18.1'], verweise: [...v(LB, 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'loesungsmenge', nr: '6', gruppe: 'loesbarkeit', text: 'die Lösung beziehungsweise den Lösungsvektor eines mehrdeutig lösbaren LGS angeben.', bpe: ['18.1'], verweise: [...v(LB, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'parameter', nr: '11', gruppe: 'loesbarkeit', text: 'ein LGS mit einem Parameter untersuchen: für welche Werte es keine, genau eine oder unendlich viele Lösungen hat.', bpe: ['18.1'], ergaenzt: true, verweise: [...v(LB, 'entdecken', 'zusammenfassung'), ...v(UL, 'ohne-hilfsmittel')], teile: ['1'] },

  { id: 'anwendung', nr: '7', gruppe: 'anwendung', text: 'Variablen geeignet festlegen und Gleichungen aufstellen, um Anwendungsaufgaben mithilfe eines LGS zu lösen.', bpe: ['18.1'], verweise: [...v(GA, 'ueberpruefen'), ...v(UL, 'mit-hilfsmittel')], teile: ['1'] },
  { id: 'mischung', nr: '8', gruppe: 'anwendung', text: 'mithilfe eines LGS Anwendungsaufgaben aus dem Bereich „Mischungsrechnen“ lösen.', bpe: ['18.1'], verweise: [...v(UL, 'mit-hilfsmittel'), ...v(GA, 'ueberpruefen')], teile: ['1'] },
  { id: 'reaktionsgleichung', nr: '9', gruppe: 'anwendung', text: 'mithilfe eines LGS Reaktionsgleichungen zur Stoffumwandlung in der Chemie bestimmen.', bpe: ['18.1'], verweise: [...v(LB, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'funktionsterm', nr: '10', gruppe: 'anwendung', text: 'mithilfe eines LGS den Funktionsterm von Funktionen bestimmen (Kurvenanpassung).', bpe: ['18.1', '3.3', '4.4'], verweise: [...v(FT, 'erklaeren', 'ueberpruefen'), ...v(GA, 'erklaeren')], teile: ['1'] },
  { id: 'transfer', nr: '!', gruppe: 'anwendung', text: 'die obigen mathematischen Fähigkeiten auf komplexere und anwendungsbezogene Aufgaben anwenden.', bpe: ['18.1'], ergaenzt: true, verweise: [...v(UL, 'ohne-hilfsmittel', 'mit-hilfsmittel')], teile: [] },
];

export const aussage = (id: string): Aussage => {
  const a = AUSSAGEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Aussage: ${id}`);
  return a;
};
