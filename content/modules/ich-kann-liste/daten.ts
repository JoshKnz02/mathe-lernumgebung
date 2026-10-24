import { loesungen } from '@/lib/gleichungen';
import { bereiche } from '@/lib/modell';
import { markantePunkte, type MarkanterPunkt } from '@/lib/markante';
import { kennwerte, wert, wertTrig, type SinusParameter } from '@/lib/sinus';
import type { Gleichung } from '@/lib/gleichungen';

const PI = Math.PI;
const rad = (grad: number) => (grad * PI) / 180;
const deg = (x: number) => (x * 180) / PI;

/* ---------- Aussagen der Ich-Kann-Liste ---------- */

export type Gruppe = 'einheitskreis' | 'schaubild' | 'gleichungen' | 'anwendungen';

export const GRUPPEN: { id: Gruppe; titel: string }[] = [
  { id: 'einheitskreis', titel: 'Einheitskreis' },
  { id: 'schaubild', titel: 'Schaubild und Term' },
  { id: 'gleichungen', titel: 'Gleichungen' },
  { id: 'anwendungen', titel: 'Anwendungen' },
];

/** Kurzbezeichnung der Module, auf die verwiesen wird. Die IDs entsprechen den Ordnern in content/modules. */
export const MODULE = {
  'einheitskreis-sinus-kosinus': 'Einheitskreis, Sinus und Kosinus',
  'lage-im-koordinatensystem': 'Lage im Koordinatensystem',
  'markante-punkte': 'Markante Punkte',
  'trigonometrische-gleichungen': 'Trigonometrische Gleichungen',
  modellierungsaufgaben: 'Modellierungs- und Anwendungsaufgaben',
} as const;
export type ModulId = keyof typeof MODULE;

/** Titel der Abschnitte, auf die verwiesen wird (wie in den meta.json der Module). */
export const ABSCHNITT_TITEL: Record<string, string> = {
  erklaeren: 'Erklären',
  entdecken: 'Entdecken',
  ueberpruefen: 'Überprüfen',
  zusammenfassung: 'Zusammenfassung',
  vorgehen: 'Vorgehen',
  modellieren: 'Modellieren',
  gemischt: 'Gemischte Aufgaben',
};

export interface Verweis {
  modul: ModulId;
  /** ID eines Abschnitts des Zielmoduls. */
  abschnitt: string;
}

export interface Aussage {
  /** Stabile ID, auch Schlüssel der Selbsteinschätzung. */
  id: string;
  /** Nummer wie auf der Ich-Kann-Liste der Lehrkraft, "!" für die Transferaufgabe, 14 bis 17 für Ergänzungen nach dem Bildungsplan. */
  nr: string;
  gruppe: Gruppe;
  /** Satzende nach "Ich kann …", ohne Formeln (reiner Text). */
  text: string;
  bpe: string[];
  /** Nicht Teil der Liste der Lehrkraft, sondern nach dem Bildungsplan ergänzt. */
  ergaenzt?: boolean;
  verweise: Verweis[];
  /** Kennungen der Teile der Kontrollaufgabe, leer ohne Kontrollaufgabe. */
  teile: string[];
}

const M1 = 'einheitskreis-sinus-kosinus';
const M2 = 'lage-im-koordinatensystem';
const M3 = 'markante-punkte';
const M4 = 'trigonometrische-gleichungen';
const M5 = 'modellierungsaufgaben';

export const AUSSAGEN: Aussage[] = [
  { id: 'wert-einheitskreis', nr: '1', gruppe: 'einheitskreis', text: 'die Werte von Sinus und Kosinus eines Winkels am Einheitskreis ablesen.', bpe: ['10.1'], verweise: [{ modul: M1, abschnitt: 'erklaeren' }], teile: ['1'] },
  { id: 'winkel-einheitskreis', nr: '2', gruppe: 'einheitskreis', text: 'mit dem Einheitskreis die Gleichungen sin(α) = b und cos(α) = b lösen und zwei mögliche Winkel angeben.', bpe: ['10.1', '10.5'], verweise: [{ modul: M1, abschnitt: 'entdecken' }, { modul: M4, abschnitt: 'erklaeren' }], teile: ['1'] },
  { id: 'bogenmass', nr: '3', gruppe: 'einheitskreis', text: 'Winkel ins Bogenmaß umrechnen und umgekehrt.', bpe: ['10.1'], verweise: [{ modul: M1, abschnitt: 'erklaeren' }], teile: ['1'] },
  { id: 'grundkurven', nr: '4', gruppe: 'einheitskreis', text: 'die Schaubilder der Sinus- und der Kosinusfunktion ohne Hilfsmittel skizzieren und ihre Eigenschaften nennen.', bpe: ['10.1'], verweise: [{ modul: M1, abschnitt: 'zusammenfassung' }], teile: ['1'] },

  { id: 'lage-ablesen', nr: '5', gruppe: 'schaubild', text: 'Verschiebung und Streckung eines Schaubilds im Bild und im Term ablesen und in die jeweils andere Darstellung übertragen.', bpe: ['10.2', '10.4'], verweise: [{ modul: M2, abschnitt: 'erklaeren' }, { modul: M2, abschnitt: 'ueberpruefen' }], teile: ['a', 'b'] },
  { id: 'amplitude-periode', nr: '6', gruppe: 'schaubild', text: 'Amplitude und Periode im Schaubild und im Term ablesen.', bpe: ['10.3'], verweise: [{ modul: M2, abschnitt: 'erklaeren' }], teile: ['1'] },
  { id: 'markante-punkte', nr: '7', gruppe: 'schaubild', text: 'besondere Punkte (Hochpunkte, Tiefpunkte, Wendepunkte) aus dem Term ablesen.', bpe: ['10.3'], verweise: [{ modul: M3, abschnitt: 'zusammenfassung' }], teile: ['1'] },
  { id: 'symmetrie', nr: '8', gruppe: 'schaubild', text: 'Symmetrieachsen und Symmetriezentren von Sinus- und Kosinuskurven bestimmen.', bpe: ['10.1', '10.3'], verweise: [{ modul: M1, abschnitt: 'ueberpruefen' }, { modul: M3, abschnitt: 'zusammenfassung' }], teile: ['1'] },
  { id: 'reihenfolge', nr: '14', gruppe: 'schaubild', text: 'bei einer Transformation die Reihenfolge der Schritte beachten und Spiegelungen erkennen.', bpe: ['10.2'], ergaenzt: true, verweise: [{ modul: M2, abschnitt: 'zusammenfassung' }], teile: ['1'] },

  { id: 'gleichung-exakt', nr: '9', gruppe: 'gleichungen', text: 'einfache trigonometrische Gleichungen auch ohne Hilfsmittel lösen.', bpe: ['10.5'], verweise: [{ modul: M4, abschnitt: 'erklaeren' }], teile: ['1'] },
  { id: 'gleichung-wtr', nr: '10', gruppe: 'gleichungen', text: 'einfache trigonometrische Gleichungen mit dem Taschenrechner lösen.', bpe: ['10.5'], verweise: [{ modul: M4, abschnitt: 'erklaeren' }], teile: ['1'] },
  { id: 'substitution', nr: '11', gruppe: 'gleichungen', text: 'trigonometrische Gleichungen mit Substitution lösen.', bpe: ['10.5'], verweise: [{ modul: M4, abschnitt: 'ueberpruefen' }], teile: ['1'] },
  { id: 'alle-loesungen', nr: '15', gruppe: 'gleichungen', text: 'alle Lösungen einer trigonometrischen Gleichung ohne Intervall mit k ∈ ℤ angeben.', bpe: ['10.5'], ergaenzt: true, verweise: [{ modul: M4, abschnitt: 'zusammenfassung' }], teile: ['1'] },
  { id: 'parameter', nr: '16', gruppe: 'gleichungen', text: 'die Anzahl der Lösungen einer Gleichung mit Parameter bestimmen und Lösungen als Schnittstellen deuten.', bpe: ['10.5'], ergaenzt: true, verweise: [{ modul: M4, abschnitt: 'entdecken' }], teile: ['1'] },

  { id: 'modell-aufstellen', nr: '12', gruppe: 'anwendungen', text: 'den Term einer trigonometrischen Modellfunktion in Anwendungsaufgaben bestimmen.', bpe: ['10.4', '10.6'], verweise: [{ modul: M5, abschnitt: 'vorgehen' }], teile: ['1'] },
  { id: 'modell-anwenden', nr: '13', gruppe: 'anwendungen', text: 'das mathematische Modell anwenden, um Aussagen zu formulieren.', bpe: ['10.5', '10.6'], verweise: [{ modul: M5, abschnitt: 'modellieren' }], teile: ['1'] },
  { id: 'modell-deuten', nr: '17', gruppe: 'anwendungen', text: 'die Kennwerte einer Modellfunktion im Sachzusammenhang deuten.', bpe: ['10.6'], ergaenzt: true, verweise: [{ modul: M5, abschnitt: 'zusammenfassung' }], teile: ['1'] },
  { id: 'komplex', nr: '!', gruppe: 'anwendungen', text: 'das Gelernte auf komplexere und anwendungsbezogene Aufgaben anwenden.', bpe: ['10.5', '10.6'], verweise: [{ modul: M5, abschnitt: 'gemischt' }], teile: [] },
];

export const aussage = (id: string): Aussage => {
  const a = AUSSAGEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Aussage: ${id}`);
  return a;
};

/* ---------- Kontrollaufgaben (eigene Werte, nicht die der Arbeitsblätter) ---------- */

/** Toleranz für Dezimalwerte mit zwei Nachkommastellen. */
export const TOL2 = 0.01;

/** K1: Werte am Einheitskreis, ein Winkel in Grad und einer im Bogenmaß. */
export const K1 = {
  grad: 50,
  x: (5 * PI) / 6,
  sinGrad: Math.sin(rad(50)),
  cosGrad: Math.cos(rad(50)),
  sinX: Math.sin((5 * PI) / 6),
  cosX: Math.cos((5 * PI) / 6),
};

/** K2: zwei Winkel in [0°; 360°[ zu sin(α) = 0,6 und cos(α) = −0,3 (Gradmaß). */
export const K2 = (() => {
  const s = 0.6;
  const c = -0.3;
  const a1 = deg(Math.asin(s));
  const b1 = deg(Math.acos(c));
  return { s, c, sin: [a1, 180 - a1] as const, cos: [b1, 360 - b1] as const, toleranz: 0.05 };
})();

/** K3: Umrechnung zwischen Grad- und Bogenmaß. */
export const K3 = { grad: 105, bogen: (7 * PI) / 12, x: (5 * PI) / 9, gradVonX: deg((5 * PI) / 9) };

/** K4: Sinuskurve rechts der y-Achse, zweiter Tiefpunkt und Nullstellen im offenen Intervall ]0; 3π[. */
export const K4 = { tiefpunkt: { x: (7 * PI) / 2, y: -1 }, nullstellen: [PI, 2 * PI] as const, intervall: [0, 3 * PI] as const };

/** K5a: Kosinusfunktion mit a > 0 und 0 ≤ c < p, aus dem Schaubild abzulesen. */
export const K5A: SinusParameter = { a: 2, b: PI / 2, c: 1, d: 1 };
/** K5b: g(x) = −3 sin(2(x − 1)) + 4. */
export const K5B: SinusParameter = { a: -3, b: 2, c: 1, d: 4 };

/** K6: Amplitude, Periode und Wertebereich von f(x) = 2,5 sin(π/3 (x + 2)) − 1. */
export const K6 = (() => {
  const p: SinusParameter = { a: 2.5, b: PI / 3, c: -2, d: -1 };
  const k = kennwerte(p);
  return { p, amplitude: k.amplitude, periode: k.periode as number, minimum: k.minimum, maximum: k.maximum };
})();

/** Ersten Punkt der gewünschten Art rechts der y-Achse (x > 0). */
const ersterRechts = (punkte: MarkanterPunkt[], art: (p: MarkanterPunkt) => boolean) => punkte.filter((q) => q.x > 1e-9 && art(q)).sort((p, q) => p.x - q.x)[0]!;

/** K7: f(x) = −2 cos(π/2 (x − 0,5)) + 1, erste markante Punkte rechts der y-Achse. */
export const K7 = (() => {
  const p: SinusParameter = { a: -2, b: PI / 2, c: 0.5, d: 1 };
  const punkte = markantePunkte(p, 'cos', -6, 12);
  return {
    p,
    hp: ersterRechts(punkte, (q) => q.art === 'hochpunkt'),
    tp: ersterRechts(punkte, (q) => q.art === 'tiefpunkt'),
    wp: ersterRechts(punkte, (q) => q.art.startsWith('wendepunkt')),
  };
})();

/** K8: f(x) = −2 sin(π/2 (x + 0,5)) + 3. Symmetrieachsen liegen bei Extrempunkten, Symmetriezentren bei Wendepunkten. */
export const K8 = (() => {
  const p: SinusParameter = { a: -2, b: PI / 2, c: -0.5, d: 3 };
  const punkte = markantePunkte(p, 'sin', -6, 12);
  const extrem = ersterRechts(punkte, (q) => q.art === 'hochpunkt' || q.art === 'tiefpunkt');
  const wende = ersterRechts(punkte, (q) => q.art.startsWith('wendepunkt'));
  return { p, achse: extrem.x, zentrumX: wende.x, zentrumY: wende.y };
})();

/** K9: exakte Lösungen in [0; π/2]: 2 sin(x) − √3 = 0 und 6 cos(x) − 3√2 = 0. */
export const K9 = { a: PI / 3, b: PI / 4 };

const gl = (funktion: 'sin' | 'cos', a: number, d: number, e: number, intervall: [number, number], b = 1, c = 0): Gleichung => ({ funktion, a, b, c, d, e, intervall });

/** K10: Lösungen mit dem Taschenrechner. 5 cos(x) + 1 = 4 in [−1; 6] und 8 sin(x) + 1 = 6 in [0; 7]. */
export const K10A = gl('cos', 5, 1, 4, [-1, 6]);
export const K10B = gl('sin', 8, 1, 6, [0, 7]);
export const K10_E = {
  a: loesungen('cos', (4 - 1) / 5, 1, 0, -1, 6).map((l) => l.x),
  b: loesungen('sin', (6 - 1) / 8, 1, 0, 0, 7).map((l) => l.x),
};

/** K11: 4 sin(3(x − 0,5)) + 1 = 3 in [0; 3]. */
export const K11 = gl('sin', 4, 1, 3, [0, 3], 3, 0.5);
export const K11_E = (() => {
  const s = (3 - 1) / 4;
  const l = loesungen('sin', s, 3, 0.5, 0, 3);
  return { s, z1: Math.asin(s), z2: PI - Math.asin(s), periode: (2 * PI) / 3, x: l.map((q) => q.x) };
})();

/** K15: cos(x) = −1/2 in ℝ, Lösungen x = ±2π/3 + k · 2π. */
export const K15 = { s: -0.5, z1: Math.acos(-0.5) };

/** K16: Anzahl der Lösungen von 0 = t · sin(x) + 3 in [0; 2π] für drei Werte von t. */
export const K16 = (() => {
  const ts = [2, 3, 5] as const;
  return { ts, anzahl: ts.map((t) => loesungen('sin', -3 / t, 1, 0, 0, 2 * PI).length) };
})();

/** K12: Monatsmittel des Wasserstands, Modell f(x) = 1,4 cos(π/6 (x − 8)) + 3,2 (Kosinus mit a > 0, 0 ≤ c < 12). */
export const K12_TABELLE = [2.0, 1.8, 2.0, 2.5, 3.2, 3.9, 4.4, 4.6, 4.4, 3.9, 3.2, 2.5] as const;
export const MONATE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as const;
export const K12: SinusParameter = { a: 1.4, b: PI / 6, c: 8, d: 3.2 };

/** K13: Anwendung des Modells K12. f(4,5) und die Zeit mit Wasserstand über 4 m. */
export const K13 = (() => {
  const g = gl('cos', K12.a, K12.d, 4, [0, 12], K12.b, K12.c);
  const b = bereiche(g, 'ueber')[0]!;
  return { gleichung: g, x45: wertTrig(K12, 4.5, 'cos'), von: b.von, bis: b.bis, dauer: b.bis - b.von, s: (4 - K12.d) / K12.a };
})();

/** K17: Riesenrad, h(t) = −20 cos(π/4 · t) + 25 mit t in Minuten, h in Metern. */
export const K17: SinusParameter = { a: -20, b: PI / 4, c: 0, d: 25 };
export const K17_E = (() => {
  const k = kennwerte(K17);
  return { periode: k.periode as number, hoechste: k.maximum, tiefste: k.minimum, durchmesser: 2 * k.amplitude, mitte: k.ruhelage };
})();

/** Funktionswert der Kosinusfunktion zu einem Parametersatz, für Bilder. */
export const cosF = (p: SinusParameter) => (x: number) => wertTrig(p, x, 'cos');
export const sinF = (p: SinusParameter) => (x: number) => wert(p, x);
