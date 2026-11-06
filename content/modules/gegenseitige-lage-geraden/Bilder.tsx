import { imWuerfel, lageZweier, type Gerade } from '@/lib/gerade';
import { geradeLinie } from '@/lib/geradenhilfen';
import { wortKoordinaten } from '@/lib/laborhilfen';
import { bildpunkt, type EbenenArt, type Punkt3, type RaumBildSpec, type RaumLinie, type RaumPunkt } from '@/lib/schraegbild';
import { A_ACHSE, A_ANGEBEN, A_SCHNITT, BILD_IDENTISCH, BILD_PARALLEL, BLAU, ERKLAEREN, PARALLEL, ROSA, SCHWARZ, WINDSCHIEF, ZUSAMMENFASSUNG, type Paar } from './daten';

const ALLE_EBENEN: EbenenArt[] = ['e12', 'e13', 'e23'];
const nullpunkt = (p: number[]) => p.every((c) => c === 0);
const gleichOrt = (a: number[], b: number[]) => a.every((x, i) => x === b[i]);

/** Beschrifteter Punkt, im Ursprung ohne Buchstaben (dort laufen die Achsen zusammen). */
export const punkt = (name: string, p: number[]): RaumPunkt => (nullpunkt(p) ? { name, p: p as Punkt3, ohneText: true } : { name, p: p as Punkt3 });

/** Linien der beiden Geraden: g schwarz gestrichelt, h blau gestrichelt. Sind sie identisch, liegt h breit und durchgezogen unter g, damit beide sichtbar sind. */
export function paarLinien(g: Gerade, h: Gerade, identisch = false): RaumLinie[] {
  return identisch ? [...geradeLinie(h, BLAU, 5, false), ...geradeLinie(g, SCHWARZ)] : [...geradeLinie(g, SCHWARZ), ...geradeLinie(h, BLAU)];
}

/** Raumbild zweier Geraden. Punkte mit gleicher Lage wie ein früherer Punkt werden nicht doppelt gezeichnet. */
export function paarBild(p: Paar, o: { sprech: string; punkte?: RaumPunkt[]; linien?: RaumLinie[] }): RaumBildSpec {
  const identisch = lageZweier(p.g, p.h).art === 'identisch';
  const punkte: RaumPunkt[] = [];
  for (const q of o.punkte ?? []) if (!punkte.some((r) => gleichOrt(r.p, q.p))) punkte.push(q);
  return { sprech: o.sprech, punkte, linien: [...paarLinien(p.g, p.h, identisch), ...(o.linien ?? [])], ebenen: ALLE_EBENEN, ebenenNamen: false };
}

const LAGE_SATZ = { identisch: 'Die Geraden sind identisch.', parallel: 'Die Geraden sind parallel.', schneidend: 'Die Geraden schneiden sich in einem Punkt.', windschief: 'Die Geraden sind windschief.' } as const;
const SCHNITT_PUNKT = (S: number[]): RaumPunkt => ({ name: 'S', p: S as Punkt3, ohneText: true });

/* ---------- Erklären: die vier Lagen (ohne Beschriftung) ---------- */

export const RAUM_LAGE_IDENTISCH: RaumBildSpec = paarBild(BILD_IDENTISCH, {
  sprech: 'Schrägbild mit den drei Koordinatenebenen. Eine blau durchgezogene dicke Linie und eine schwarz gestrichelte Linie liegen genau aufeinander: Die beiden Geraden sind identisch.',
});
export const RAUM_LAGE_PARALLEL: RaumBildSpec = paarBild(BILD_PARALLEL, {
  sprech: 'Schrägbild mit den drei Koordinatenebenen. Eine schwarz gestrichelte und eine blau gestrichelte Gerade verlaufen in dieselbe Richtung, die blaue liegt neben der schwarzen. Sie haben keinen gemeinsamen Punkt.',
});
export const RAUM_LAGE_SCHNEIDEND: RaumBildSpec = paarBild(ERKLAEREN, {
  sprech: 'Schrägbild mit den drei Koordinatenebenen. Eine schwarz gestrichelte und eine blau gestrichelte Gerade kreuzen sich in einem Punkt, der als Punkt eingezeichnet ist.',
  punkte: [SCHNITT_PUNKT([1, 1, -3])],
});
export const RAUM_LAGE_WINDSCHIEF: RaumBildSpec = paarBild(WINDSCHIEF, {
  sprech: 'Schrägbild mit den drei Koordinatenebenen. Eine schwarz gestrichelte und eine blau gestrichelte Gerade verlaufen aneinander vorbei: Sie sind nicht parallel und haben keinen gemeinsamen Punkt.',
});

/* ---------- Erklären: Beispiel zum Gleichsetzen ---------- */

const sp = (n: number[]) => wortKoordinaten(n);
export const RAUM_ERKLAEREN: RaumBildSpec = paarBild(ERKLAEREN, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade g geht durch den Punkt P bei ${sp(ERKLAEREN.g.p)}, die blau gestrichelte Gerade h durch den Punkt Q bei ${sp(ERKLAEREN.h.p)}. Die beiden Geraden schneiden sich im Punkt S bei ${sp([1, 1, -3])}.`,
  punkte: [punkt('S', [1, 1, -3]), punkt('P', ERKLAEREN.g.p), punkt('Q', ERKLAEREN.h.p)],
});

/* ---------- Entdecken ---------- */

/** Vermutung 1: g und h sind parallel, beide Stützpunkte P und Q sind markiert. */
export const RAUM_PARALLEL: RaumBildSpec = paarBild(PARALLEL, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade g geht durch den Punkt P bei ${sp(PARALLEL.g.p)}, die blau gestrichelte Gerade h durch den Punkt Q bei ${sp(PARALLEL.h.p)}. Beide haben dieselbe Richtung, die Geraden sind parallel und haben keinen gemeinsamen Punkt.`,
  punkte: [punkt('P', PARALLEL.g.p), punkt('Q', PARALLEL.h.p)],
});
/** Vermutung 2: g und h sind windschief. */
export const RAUM_WINDSCHIEF: RaumBildSpec = paarBild(WINDSCHIEF, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade g geht durch den Punkt P bei ${sp(WINDSCHIEF.g.p)}, die blau gestrichelte Gerade h durch den Punkt Q bei ${sp(WINDSCHIEF.h.p)}. Die Geraden verlaufen aneinander vorbei: Sie sind nicht parallel und haben keinen gemeinsamen Punkt.`,
  punkte: [punkt('P', WINDSCHIEF.g.p), punkt('Q', WINDSCHIEF.h.p)],
});

/**
 * Bild des Labors: g fest (schwarz), h blau. Mit der Lage wird bei sich schneidenden Geraden der Schnittpunkt S eingezeichnet (liegt er außerhalb des
 * Koordinatensystems von −4 bis 4, wird er nicht gezeichnet).
 */
export function laborBild(g: Gerade, h: Gerade, zeigeLage: boolean): { spec: RaumBildSpec; schnittAusserhalb: boolean } {
  const l = lageZweier(g, h);
  const S = zeigeLage && l.art === 'schneidend' ? l.schnittpunkt! : null;
  const schnittAusserhalb = S !== null && !imWuerfel(S);
  // Fällt ein Punkt im Schrägbild auf die Stelle eines früheren Punkts (verschiedene Raumpunkte können dasselbe Bild haben), steht dort nur ein Buchstabe
  const punkte: RaumPunkt[] = [];
  for (const q of [...(S && !schnittAusserhalb ? [punkt('S', S)] : []), punkt('P', g.p), punkt('Q', h.p)]) {
    const belegt = punkte.some((r) => !r.ohneText && bildpunkt(r.p).join(',') === bildpunkt(q.p).join(','));
    punkte.push(belegt ? { ...q, ohneText: true } : q);
  }
  const lageText = zeigeLage ? ` ${LAGE_SATZ[l.art]}` : '';
  return {
    spec: paarBild({ g, h }, { sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade g geht durch den Punkt P bei ${sp(g.p)}, die blau gestrichelte Gerade h durch den Punkt Q bei ${sp(h.p)}.${lageText}`, punkte }),
    schnittAusserhalb,
  };
}

/** Labor ohne gültige Gerade h (Richtungsvektor ist der Nullvektor): nur g und die beiden Punkte P und Q. */
export function laborBildOhneH(g: Gerade, q: number[]): RaumBildSpec {
  return {
    sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade g geht durch den Punkt P bei ${sp(g.p)}. Der Punkt Q liegt bei ${sp(q)}. Der Richtungsvektor von h ist der Nullvektor, damit gibt es keine Gerade h.`,
    punkte: [punkt('P', g.p), ...(gleichOrt(g.p, q) ? [] : [punkt('Q', q)])],
    linien: geradeLinie(g, SCHWARZ),
    ebenen: ALLE_EBENEN,
    ebenenNamen: false,
  };
}

/* ---------- Aufgaben ---------- */

/** Aufgabe 5: die sich schneidenden Geraden mit Schnittpunkt S(1 | −3 | 1). */
export const aufgSchnitt: RaumBildSpec = paarBild(A_SCHNITT.paar, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade g und die blau gestrichelte Gerade h schneiden sich im Punkt S bei ${sp(A_SCHNITT.S)}. Markiert sind außerdem die Stützpunkte P bei ${sp(A_SCHNITT.paar.g.p)} und Q bei ${sp(A_SCHNITT.paar.h.p)}.`,
  punkte: [punkt('S', A_SCHNITT.S), punkt('P', A_SCHNITT.paar.g.p), punkt('Q', A_SCHNITT.paar.h.p)],
});

const AN = A_ANGEBEN;
const h12a: Gerade = { p: AN.R, u: AN.g.u };
const h12b: Gerade = { p: AN.S, u: AN.w };
/** Aufgabe 12: g (schwarz), die parallele Gerade durch R (blau) und die Gerade durch S mit anderer Richtung (rosa). */
export const aufgAngeben: RaumBildSpec = {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade g geht durch den Punkt S bei ${sp(AN.S)}. Die blau gestrichelte Gerade durch den Punkt R bei ${sp(AN.R)} hat dieselbe Richtung wie g und ist parallel zu g. Die rosa gestrichelte Gerade geht durch S in eine andere Richtung und schneidet g dort.`,
  punkte: [punkt('R', AN.R), punkt('S', AN.S)],
  linien: [...geradeLinie(AN.g, SCHWARZ), ...geradeLinie(h12a, BLAU), ...geradeLinie(h12b, ROSA)],
  ebenen: ALLE_EBENEN,
  ebenenNamen: false,
};
const h13: Gerade = { p: AN.X, u: AN.w };
/** Aufgabe 13: g (schwarz) und eine windschiefe Gerade (blau) durch den Punkt Q(3 | 0 | −3). */
export const aufgWindschief: RaumBildSpec = paarBild({ g: AN.g, h: h13 }, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade g geht durch den Punkt P bei ${sp(AN.g.p)}, die blau gestrichelte Gerade h durch den Punkt Q bei ${sp(AN.X)}. Die Geraden sind nicht parallel und haben keinen gemeinsamen Punkt.`,
  punkte: [punkt('P', AN.g.p), punkt('Q', AN.X)],
});
/** Aufgabe 14: g trifft die x₂-Achse im Punkt (0 | 3 | 0), der Punkt liegt auf einer Achse und bleibt deshalb ohne Beschriftung. */
export const aufgAchse: RaumBildSpec = {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade g trifft die x₂-Achse im markierten Punkt bei ${sp(A_ACHSE.S)}.`,
  punkte: [SCHNITT_PUNKT(A_ACHSE.S)],
  linien: geradeLinie(A_ACHSE.g, SCHWARZ),
  ebenen: ALLE_EBENEN,
  ebenenNamen: false,
};

/* ---------- Zusammenfassung ---------- */

export const RAUM_ZUSAMMENFASSUNG: RaumBildSpec = paarBild(ZUSAMMENFASSUNG, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade g und die blau gestrichelte Gerade h schneiden sich im Punkt S bei ${sp([-1, 3, 1])}. Markiert sind außerdem die Stützpunkte P bei ${sp(ZUSAMMENFASSUNG.g.p)} und Q bei ${sp(ZUSAMMENFASSUNG.h.p)}.`,
  punkte: [punkt('S', [-1, 3, 1]), punkt('P', ZUSAMMENFASSUNG.g.p), punkt('Q', ZUSAMMENFASSUNG.h.p)],
});
