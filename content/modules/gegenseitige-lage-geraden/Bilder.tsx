import { geradeImWuerfel, imWuerfel, lageZweier, type Gerade } from '@/lib/gerade';
import { geradeLinie } from '@/lib/geradenhilfen';
import { wortKoordinaten } from '@/lib/laborhilfen';
import { bildpunkt, type EbenenArt, type Punkt3, type RaumBildSpec, type RaumLinie, type RaumPunkt } from '@/lib/schraegbild';
import { A_ACHSE, A_ANGEBEN, A_SCHNITT, BILD_IDENTISCH, BILD_PARALLEL, ORANGE, ERKLAEREN, PARALLEL, ROSA, SCHWARZ, WINDSCHIEF, ZUSAMMENFASSUNG, type Paar } from './daten';

const ERKLAEREN_S = lageZweier(ERKLAEREN.g, ERKLAEREN.h).schnittpunkt!;
const ALLE_EBENEN: EbenenArt[] = ['e12', 'e13', 'e23'];
const nullpunkt = (p: number[]) => p.every((c) => c === 0);
const gleichOrt = (a: number[], b: number[]) => a.every((x, i) => x === b[i]);

/** Beschrifteter Punkt, im Ursprung ohne Buchstaben (dort laufen die Achsen zusammen). */
export const punkt = (name: string, p: number[]): RaumPunkt => (nullpunkt(p) ? { name, p: p as Punkt3, ohneText: true } : { name, p: p as Punkt3 });

/** Linien der beiden Geraden: g schwarz, h orange, beide durchgezogen. Sind sie identisch, liegt h breit unter g, damit beide sichtbar sind. */
export function paarLinien(g: Gerade, h: Gerade, identisch = false): RaumLinie[] {
  return identisch ? [...geradeLinie(h, ORANGE, 5, false), ...geradeLinie(g, SCHWARZ, 3, false)] : [...geradeLinie(g, SCHWARZ, 3, false), ...geradeLinie(h, ORANGE, 3, false)];
}


/* ---------- Beschriftung der Geraden ---------- */

export interface BenannteLinie {
  g: Gerade;
  name: string;
  farbe: string;
}
type P2 = [number, number];
const abstandPunktStrecke = (p: P2, a: P2, b: P2): number => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  const u = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
  return Math.hypot(p[0] - (a[0] + u * dx), p[1] - (a[1] + u * dy));
};
const ACHSEN_BILD: [P2, P2][] = ([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Punkt3[]).map((e) => [bildpunkt(e.map((c) => -4 * c) as Punkt3), bildpunkt(e.map((c) => 4 * c) as Punkt3)]);
const VERSCHIEBUNGEN: Punkt3[] = [0.7, 1.1].flatMap((k) => ([[0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], [0.7, 0.7, 0], [0, 0.7, 0.7], [0, 0.7, -0.7], [0, -0.7, 0.7]] as Punkt3[]).map((v) => v.map((c) => c * k) as Punkt3));
const ANTEILE = Array.from({ length: 25 }, (_, i) => 0.02 + i * 0.04);

/**
 * Setzt den Namen jeder Geraden (g, h) als farbigen Text neben die Gerade: nahe an einem Ende des Teils im Koordinatensystem, seitlich versetzt, mit möglichst großem
 * Abstand zu allen Geraden, den Achsen, den Namen davor und den Punkten. Der Text wird als `nurText` gezeichnet.
 */
export function linienNamen(linien: BenannteLinie[], punkte: RaumPunkt[] = []): RaumPunkt[] {
  const segmente: [P2, P2][] = [];
  for (const l of linien) {
    const s = geradeImWuerfel(l.g);
    if (s) segmente.push([bildpunkt(s[0]), bildpunkt(s[1])]);
  }
  const andere: P2[] = punkte.filter((p) => !p.nurText).map((p) => bildpunkt(p.p));
  const text: RaumPunkt[] = [];
  for (const l of linien) {
    const s = geradeImWuerfel(l.g);
    if (!s) continue;
    let beste: { p: Punkt3; score: number } | null = null;
    for (const f of ANTEILE) {
      const basis = s[0].map((c, i) => c + f * (s[1][i]! - c));
      for (const v of VERSCHIEBUNGEN) {
        const c = basis.map((x, i) => x + v[i]!) as Punkt3;
        const b = bildpunkt(c);
        if (Math.abs(b[0]) > 6 || Math.abs(b[1]) > 6) continue;
        let score = Math.min(...segmente.map(([a1, b1]) => abstandPunktStrecke(b, a1, b1)), ...ACHSEN_BILD.map(([a1, b1]) => abstandPunktStrecke(b, a1, b1)), ...andere.map((q) => Math.hypot(q[0] - b[0], q[1] - b[1])), ...text.map((t) => Math.hypot(bildpunkt(t.p)[0] - b[0], bildpunkt(t.p)[1] - b[1])));
        score = Math.min(score, 1.6);
        if (!beste || score > beste.score) beste = { p: c, score };
      }
    }
    if (beste) text.push({ name: l.name, p: beste.p.map((x) => Math.round(x * 1e6) / 1e6) as Punkt3, nurText: true, farbe: l.farbe });
  }
  return text;
}

/** Raumbild zweier Geraden. Punkte mit gleicher Lage wie ein früherer Punkt werden nicht doppelt gezeichnet. */
export function paarBild(p: Paar, o: { sprech: string; punkte?: RaumPunkt[]; linien?: RaumLinie[] }): RaumBildSpec {
  const identisch = lageZweier(p.g, p.h).art === 'identisch';
  const punkte: RaumPunkt[] = [];
  for (const q of o.punkte ?? []) if (!punkte.some((r) => gleichOrt(r.p, q.p))) punkte.push(q);
  const benannt: BenannteLinie[] = identisch ? [{ g: p.g, name: 'g, h', farbe: SCHWARZ }] : [{ g: p.g, name: 'g', farbe: SCHWARZ }, { g: p.h, name: 'h', farbe: ORANGE }];
  return { sprech: o.sprech, punkte: [...punkte, ...linienNamen(benannt, punkte)], linien: [...paarLinien(p.g, p.h, identisch), ...(o.linien ?? [])], ebenen: ALLE_EBENEN, ebenenNamen: false };
}

const LAGE_SATZ = { identisch: 'Die Geraden sind identisch.', parallel: 'Die Geraden sind parallel.', schneidend: 'Die Geraden schneiden sich in einem Punkt.', windschief: 'Die Geraden sind windschief.' } as const;
const SCHNITT_PUNKT = (S: number[]): RaumPunkt => ({ name: 'S', p: S as Punkt3, ohneText: true });

/* ---------- Erklären: die vier Lagen (ohne Beschriftung) ---------- */

export const RAUM_LAGE_IDENTISCH: RaumBildSpec = paarBild(BILD_IDENTISCH, {
  sprech: 'Schrägbild mit den drei Koordinatenebenen. Eine dicke orange Linie und eine schwarze Linie liegen genau aufeinander: Die beiden Geraden sind identisch.',
});
export const RAUM_LAGE_PARALLEL: RaumBildSpec = paarBild(BILD_PARALLEL, {
  sprech: 'Schrägbild mit den drei Koordinatenebenen. Eine schwarze und eine orange Gerade verlaufen in dieselbe Richtung, die orange liegt neben der schwarzen. Sie haben keinen gemeinsamen Punkt.',
});
export const RAUM_LAGE_SCHNEIDEND: RaumBildSpec = paarBild(ERKLAEREN, {
  sprech: 'Schrägbild mit den drei Koordinatenebenen. Eine schwarze und eine orange Gerade kreuzen sich in einem Punkt, der als Punkt eingezeichnet ist.',
  punkte: [SCHNITT_PUNKT(ERKLAEREN_S)],
});
export const RAUM_LAGE_WINDSCHIEF: RaumBildSpec = paarBild(WINDSCHIEF, {
  sprech: 'Schrägbild mit den drei Koordinatenebenen. Eine schwarze und eine orange Gerade verlaufen aneinander vorbei: Sie sind nicht parallel und haben keinen gemeinsamen Punkt.',
});

/* ---------- Erklären: Beispiel zum Gleichsetzen ---------- */

const sp = (n: number[]) => wortKoordinaten(n);
export const RAUM_ERKLAEREN: RaumBildSpec = paarBild(ERKLAEREN, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g geht durch den Punkt P bei ${sp(ERKLAEREN.g.p)}, die orange Gerade h durch den Punkt Q bei ${sp(ERKLAEREN.h.p)}. Die beiden Geraden schneiden sich im Punkt S bei ${sp(ERKLAEREN_S)}.`,
  punkte: [punkt('S', ERKLAEREN_S), punkt('P', ERKLAEREN.g.p), punkt('Q', ERKLAEREN.h.p)],
});

/* ---------- Entdecken ---------- */

/** Vermutung 1: g und h sind parallel, beide Stützpunkte P und Q sind markiert. */
export const RAUM_PARALLEL: RaumBildSpec = paarBild(PARALLEL, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g geht durch den Punkt P bei ${sp(PARALLEL.g.p)}, die orange Gerade h durch den Punkt Q bei ${sp(PARALLEL.h.p)}. Beide haben dieselbe Richtung, die Geraden sind parallel und haben keinen gemeinsamen Punkt.`,
  punkte: [punkt('P', PARALLEL.g.p), punkt('Q', PARALLEL.h.p)],
});
/** Vermutung 2: g und h sind windschief. */
export const RAUM_WINDSCHIEF: RaumBildSpec = paarBild(WINDSCHIEF, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g geht durch den Punkt P bei ${sp(WINDSCHIEF.g.p)}, die orange Gerade h durch den Punkt Q bei ${sp(WINDSCHIEF.h.p)}. Die Geraden verlaufen aneinander vorbei: Sie sind nicht parallel und haben keinen gemeinsamen Punkt.`,
  punkte: [punkt('P', WINDSCHIEF.g.p), punkt('Q', WINDSCHIEF.h.p)],
});

/**
 * Bild des Labors: g fest (schwarz), h orange. Mit der Lage wird bei sich schneidenden Geraden der Schnittpunkt S eingezeichnet (liegt er außerhalb des
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
    spec: paarBild({ g, h }, { sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g geht durch den Punkt P bei ${sp(g.p)}, die orange Gerade h durch den Punkt Q bei ${sp(h.p)}.${lageText}`, punkte }),
    schnittAusserhalb,
  };
}

/** Labor ohne gültige Gerade h (Richtungsvektor ist der Nullvektor): nur g und die beiden Punkte P und Q. */
export function laborBildOhneH(g: Gerade, q: number[]): RaumBildSpec {
  return {
    sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g geht durch den Punkt P bei ${sp(g.p)}. Der Punkt Q liegt bei ${sp(q)}. Der Richtungsvektor von h ist der Nullvektor, damit gibt es keine Gerade h.`,
    punkte: [punkt('P', g.p), ...(gleichOrt(g.p, q) ? [] : [punkt('Q', q)]), ...linienNamen([{ g, name: 'g', farbe: SCHWARZ }], [punkt('P', g.p)])],
    linien: geradeLinie(g, SCHWARZ, 3, false),
    ebenen: ALLE_EBENEN,
    ebenenNamen: false,
  };
}

/* ---------- Aufgaben ---------- */

/** Aufgabe 5: die sich schneidenden Geraden mit Schnittpunkt S(1 | −3 | 1). */
export const aufgSchnitt: RaumBildSpec = paarBild(A_SCHNITT.paar, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g und die orange Gerade h schneiden sich im Punkt S bei ${sp(A_SCHNITT.S)}. Markiert sind außerdem die Stützpunkte P bei ${sp(A_SCHNITT.paar.g.p)} und Q bei ${sp(A_SCHNITT.paar.h.p)}.`,
  punkte: [punkt('S', A_SCHNITT.S), punkt('P', A_SCHNITT.paar.g.p), punkt('Q', A_SCHNITT.paar.h.p)],
});

const AN = A_ANGEBEN;
const h12a: Gerade = { p: AN.R, u: AN.g.u };
const h12b: Gerade = { p: AN.S, u: AN.w };
/** Aufgabe 12: g (schwarz), die parallele Gerade durch R (orange) und die Gerade durch S mit anderer Richtung (rosa). */
export const aufgAngeben: RaumBildSpec = {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g geht durch den Punkt S bei ${sp(AN.S)}. Die orange Gerade durch den Punkt R bei ${sp(AN.R)} hat dieselbe Richtung wie g und ist parallel zu g. Die rosa Gerade geht durch S in eine andere Richtung und schneidet g dort.`,
  punkte: [punkt('R', AN.R), punkt('S', AN.S), ...linienNamen([{ g: AN.g, name: 'g', farbe: SCHWARZ }, { g: h12a, name: 'h₁', farbe: ORANGE }, { g: h12b, name: 'h₂', farbe: ROSA }], [punkt('R', AN.R), punkt('S', AN.S)])],
  linien: [...geradeLinie(AN.g, SCHWARZ, 3, false), ...geradeLinie(h12a, ORANGE, 3, false), ...geradeLinie(h12b, ROSA, 3, false)],
  ebenen: ALLE_EBENEN,
  ebenenNamen: false,
};
const h13: Gerade = { p: AN.X, u: AN.w };
/** Aufgabe 13: g (schwarz) und eine windschiefe Gerade (orange) durch den Punkt Q(3 | 0 | −3). */
export const aufgWindschief: RaumBildSpec = paarBild({ g: AN.g, h: h13 }, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g geht durch den Punkt P bei ${sp(AN.g.p)}, die orange Gerade h durch den Punkt Q bei ${sp(AN.X)}. Die Geraden sind nicht parallel und haben keinen gemeinsamen Punkt.`,
  punkte: [punkt('P', AN.g.p), punkt('Q', AN.X)],
});
/** Aufgabe 14: g trifft die x₂-Achse im Punkt (0 | 3 | 0), der Punkt liegt auf einer Achse und bleibt deshalb ohne Beschriftung. */
export const aufgAchse: RaumBildSpec = {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g trifft die x₂-Achse im markierten Punkt bei ${sp(A_ACHSE.S)}.`,
  punkte: [SCHNITT_PUNKT(A_ACHSE.S), ...linienNamen([{ g: A_ACHSE.g, name: 'g', farbe: SCHWARZ }], [SCHNITT_PUNKT(A_ACHSE.S)])],
  linien: geradeLinie(A_ACHSE.g, SCHWARZ, 3, false),
  ebenen: ALLE_EBENEN,
  ebenenNamen: false,
};

/* ---------- Zusammenfassung ---------- */

export const RAUM_ZUSAMMENFASSUNG: RaumBildSpec = paarBild(ZUSAMMENFASSUNG, {
  sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarze Gerade g und die orange Gerade h schneiden sich im Punkt S bei ${sp([-1, 3, 1])}. Markiert sind außerdem die Stützpunkte P bei ${sp(ZUSAMMENFASSUNG.g.p)} und Q bei ${sp(ZUSAMMENFASSUNG.h.p)}.`,
  punkte: [punkt('S', [-1, 3, 1]), punkt('P', ZUSAMMENFASSUNG.g.p), punkt('Q', ZUSAMMENFASSUNG.h.p)],
});
