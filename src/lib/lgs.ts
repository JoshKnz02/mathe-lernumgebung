/**
 * Lineare Gleichungssysteme mit ganzzahligen Koeffizienten: Zeilenumformungen, Gauß-Algorithmus, Rückwärtseinsetzen.
 * Die erweiterte Koeffizientenmatrix ist eine Liste von Zeilen, die letzte Spalte ist die rechte Seite.
 * Die Umformungen erzeugen aus ganzen Zahlen wieder ganze Zahlen, Lösungen sind exakte Brüche.
 */

export type Matrix = number[][];

export interface Bruch {
  /** Zähler, trägt das Vorzeichen. */
  z: number;
  /** Nenner, immer größer als 0. */
  n: number;
}

const ggt = (a: number, b: number): number => (b === 0 ? Math.abs(a) : ggt(b, a % b));

export function bruch(z: number, n = 1): Bruch {
  if (n === 0) throw new Error('Nenner 0');
  const g = ggt(z, n) || 1;
  const s = n < 0 ? -1 : 1;
  // + 0 macht aus -0 eine 0.
  return { z: (s * z) / g + 0, n: (s * n) / g };
}
export const plus = (a: Bruch, b: Bruch) => bruch(a.z * b.n + b.z * a.n, a.n * b.n);
export const minus = (a: Bruch, b: Bruch) => bruch(a.z * b.n - b.z * a.n, a.n * b.n);
export const mal = (a: Bruch, b: Bruch) => bruch(a.z * b.z, a.n * b.n);
export const geteilt = (a: Bruch, b: Bruch) => bruch(a.z * b.n, a.n * b.z);
export const bruchWert = (a: Bruch) => a.z / a.n;
export const bruchGleich = (a: Bruch, b: Bruch) => a.z === b.z && a.n === b.n;

export type Umformung =
  /** Zeile i und Zeile j vertauschen. */
  | { art: 'tausch'; i: number; j: number }
  /** Zeile i mit k multiplizieren (k ≠ 0). */
  | { art: 'mal'; i: number; k: number }
  /** Zeile i durch d teilen (d ≠ 0, teilt alle Einträge). */
  | { art: 'teile'; i: number; d: number }
  /** Zeile i ersetzen durch a · Zeile i + b · Zeile j (a ≠ 0, i ≠ j). */
  | { art: 'ersetze'; i: number; a: number; j: number; b: number };

/** Kopie der Matrix. */
export const kopie = (m: Matrix): Matrix => m.map((z) => [...z]);

/** Prüft, ob die Umformung erlaubt ist, und nennt sonst den Grund. null: erlaubt. */
export function umformungsfehler(m: Matrix, u: Umformung): string | null {
  const ok = (i: number) => Number.isInteger(i) && i >= 0 && i < m.length;
  if (!ok(u.i)) return 'Diese Zeile gibt es nicht.';
  switch (u.art) {
    case 'tausch':
      if (!ok(u.j)) return 'Diese Zeile gibt es nicht.';
      return u.i === u.j ? 'Eine Zeile mit sich selbst zu vertauschen ändert nichts.' : null;
    case 'mal':
      return u.k === 0 || !Number.isInteger(u.k) ? 'Der Faktor muss eine ganze Zahl ungleich 0 sein.' : null;
    case 'teile':
      if (u.d === 0 || !Number.isInteger(u.d)) return 'Der Teiler muss eine ganze Zahl ungleich 0 sein.';
      return m[u.i]!.every((x) => x % u.d === 0) ? null : 'Der Teiler geht nicht in allen Einträgen der Zeile auf.';
    case 'ersetze':
      if (!ok(u.j)) return 'Diese Zeile gibt es nicht.';
      if (u.i === u.j) return 'Die andere Zeile muss eine andere sein als die ersetzte.';
      if (!Number.isInteger(u.a) || !Number.isInteger(u.b)) return 'Die Faktoren müssen ganze Zahlen sein.';
      return u.a === 0 ? 'Der Faktor der ersetzten Zeile darf nicht 0 sein, sonst geht ihre Information verloren.' : null;
  }
}

/** Wendet eine erlaubte Umformung an und gibt die neue Matrix zurück. Wirft bei einer nicht erlaubten Umformung. */
export function wende(m: Matrix, u: Umformung): Matrix {
  const fehler = umformungsfehler(m, u);
  if (fehler) throw new Error(fehler);
  const r = kopie(m);
  switch (u.art) {
    case 'tausch':
      [r[u.i], r[u.j]] = [r[u.j]!, r[u.i]!];
      break;
    case 'mal':
      r[u.i] = r[u.i]!.map((x) => x * u.k);
      break;
    case 'teile':
      r[u.i] = r[u.i]!.map((x) => x / u.d);
      break;
    case 'ersetze':
      r[u.i] = r[u.i]!.map((x, c) => u.a * x + u.b * r[u.j]![c]!);
      break;
  }
  return r;
}

/** Wendet mehrere Umformungen nacheinander an. */
export const wendeAn = (m: Matrix, us: Umformung[]): Matrix => us.reduce(wende, m);

/** Anzahl der führenden Nullen einer Zeile ohne rechte Seite, bei einer Nullzeile die Zahl der Unbekannten. */
const fuehrendeNullen = (zeile: number[]): number => {
  const koeff = zeile.slice(0, -1);
  const k = koeff.findIndex((x) => x !== 0);
  return k < 0 ? koeff.length : k;
};

/** Stufenform: Die führenden Nullen der Zeilen nehmen zu, bis nur noch Zeilen ohne Koeffizienten folgen. */
export function istStufenform(m: Matrix): boolean {
  let vorher = -1;
  for (const z of m) {
    const f = fuehrendeNullen(z);
    const n = z.length - 1;
    if (f === n) {
      vorher = n;
      continue;
    }
    if (vorher === n || f <= vorher) return false;
    vorher = f;
  }
  return true;
}

/** Zeile als Gleichung in TeX, zum Beispiel 2x_1 - x_2 + 3x_3 = 5. Fehlende Unbekannte (Koeffizient 0) entfallen. */
export function gleichungTeX(zeile: number[]): string {
  const n = zeile.length - 1;
  let s = '';
  for (let c = 0; c < n; c++) {
    const k = zeile[c]!;
    if (k === 0) continue;
    const betrag = Math.abs(k) === 1 ? '' : String(Math.abs(k));
    s += s === '' ? (k < 0 ? '-' : '') + betrag : (k < 0 ? '-' : '+') + betrag;
    s += `x_{${c + 1}}`;
  }
  return `${s === '' ? '0' : s}=${zeile[n]}`;
}

/**
 * Alle Gleichungen als ausgerichteter TeX-Block (Gleichheitszeichen untereinander).
 * Mit umbruch steht jede Gleichung in zwei Zeilen (die dritte Unbekannte in der zweiten), für schmale Breiten.
 */
export function gleichungenTeX(m: Matrix, umbruch = false): string {
  if (umbruch) {
    const zeilen = m.map((z) => {
      const n = z.length - 1;
      const terme: string[] = [];
      for (let c = 0; c < n; c++) {
        const k = z[c]!;
        if (k === 0) continue;
        const betrag = Math.abs(k) === 1 ? '' : String(Math.abs(k));
        terme.push(`${k < 0 ? '-' : '+'}${betrag}x_{${c + 1}}`);
      }
      const roh = terme.length ? terme : ['+0'];
      const erste = roh.slice(0, 2).join('').replace(/^\\+/, '');
      const rest = roh.slice(2).join('');
      return rest ? `&${erste}\\\\&{}${rest}=${z[n]}` : `&${erste}=${z[n]}`;
    });
    return `\\begin{aligned}${zeilen.join('\\\\[0.5em]')}\\end{aligned}`;
  }
  const zeilen = m.map((z) => {
    const g = gleichungTeX(z);
    const k = g.lastIndexOf('=');
    return `${g.slice(0, k)}&=${g.slice(k + 1)}`;
  });
  return `\\begin{aligned}${zeilen.join('\\\\')}\\end{aligned}`;
}

/** Bruch als TeX mit \frac und Vorzeichen vor dem Bruch. */
export function bruchTeX(b: Bruch): string {
  if (b.n === 1) return String(b.z);
  return `${b.z < 0 ? '-' : ''}\\frac{${Math.abs(b.z)}}{${b.n}}`;
}

/** Linearkombination als TeX, zum Beispiel 5\cdot Z_3+6\cdot Z_2. */
const zeilenName = (i: number) => `Z_{${i + 1}}`;
const term = (k: number, i: number, erster: boolean) => {
  const betrag = Math.abs(k);
  const text = betrag === 1 ? zeilenName(i) : `${betrag}\\cdot ${zeilenName(i)}`;
  if (erster) return k < 0 ? `-${text}` : text;
  return `${k < 0 ? '-' : '+'}${text}`;
};

/** Rechenvermerk einer Umformung als TeX, zum Beispiel Z_2 \to 3\cdot Z_1-2\cdot Z_2. */
export function umformungTeX(u: Umformung): string {
  switch (u.art) {
    case 'tausch':
      return `${zeilenName(u.i)}\\leftrightarrow ${zeilenName(u.j)}`;
    case 'mal':
      return `${zeilenName(u.i)}\\to ${term(u.k, u.i, true)}`;
    case 'teile':
      return `${zeilenName(u.i)}\\to ${zeilenName(u.i)}:${u.d < 0 ? `(${u.d})` : u.d}`;
    case 'ersetze':
      return `${zeilenName(u.i)}\\to ${term(u.a, u.i, true)}${term(u.b, u.j, false)}`;
  }
}

export interface MatrixMarke {
  /** Pivot-Einträge (blau, fett), Einträge als [Zeile, Spalte]. */
  pivot?: [number, number][];
  /** Hervorgehobene neue Nullen (orange). */
  nullen?: [number, number][];
  /** Zeilen der Form 0 = c mit c ungleich 0 (rosa). */
  widerspruch?: number[];
  /** Zeilen der Form 0 = 0 (grün). */
  leer?: number[];
}

/** Erweiterte Koeffizientenmatrix als TeX mit Trennstrich vor der rechten Seite und optionalen Markierungen. */
export function matrixTeX(m: Matrix, marke: MatrixMarke = {}): string {
  const n = m[0]!.length - 1;
  const gibt = (liste: [number, number][] | undefined, r: number, c: number) => liste?.some(([a, b]) => a === r && b === c) ?? false;
  const zeilen = m.map((z, r) =>
    z
      .map((x, c) => {
        if (marke.widerspruch?.includes(r)) return `\\textcolor{#CC79A7}{\\boldsymbol{${x}}}`;
        if (marke.leer?.includes(r)) return `\\textcolor{#009E73}{\\boldsymbol{${x}}}`;
        if (gibt(marke.pivot, r, c)) return `\\textcolor{#0072B2}{\\boldsymbol{${x}}}`;
        if (gibt(marke.nullen, r, c)) return `\\textcolor{#D55E00}{\\boldsymbol{${x}}}`;
        return String(x);
      })
      .join('&'),
  );
  return `\\left(\\begin{array}{${'r'.repeat(n)}|r}${zeilen.join('\\\\')}\\end{array}\\right)`;
}

export interface Schritt {
  umformung: Umformung;
  danach: Matrix;
}

/**
 * Gauß-Algorithmus nach dem Unterrichtsverfahren: Pivot suchen (bei 0 Zeilen tauschen), darunter mit
 * Zeile i → p·Zeile i − e·Pivotzeile eliminieren, dabei p und e durch ihren ggT kürzen.
 */
export function gaussSchritte(start: Matrix): Schritt[] {
  const schritte: Schritt[] = [];
  let m = kopie(start);
  const n = m[0]!.length - 1;
  let zeile = 0;
  for (let spalte = 0; spalte < n && zeile < m.length; spalte++) {
    if (m[zeile]![spalte] === 0) {
      const j = m.findIndex((z, r) => r > zeile && z[spalte] !== 0);
      if (j < 0) continue;
      const u: Umformung = { art: 'tausch', i: zeile, j };
      m = wende(m, u);
      schritte.push({ umformung: u, danach: m });
    }
    for (let r = zeile + 1; r < m.length; r++) {
      const e = m[r]![spalte]!;
      if (e === 0) continue;
      const p = m[zeile]![spalte]!;
      const g = ggt(p, e);
      const u: Umformung = { art: 'ersetze', i: r, a: p / g, j: zeile, b: -e / g };
      // Der Faktor der ersetzten Zeile soll positiv sein.
      if (u.a < 0) {
        u.a = -u.a;
        u.b = -u.b;
      }
      m = wende(m, u);
      schritte.push({ umformung: u, danach: m });
    }
    zeile++;
  }
  return schritte;
}

export type Loesung =
  | { art: 'eindeutig'; x: Bruch[] }
  | { art: 'unloesbar' }
  | { art: 'mehrdeutig'; freie: number };

/** Löst ein System in Stufenform: unlösbar bei Zeile 0 = c ≠ 0, sonst eindeutig oder mehrdeutig (Anzahl freier Unbekannter). */
export function loeseStufenform(m: Matrix): Loesung {
  const n = m[0]!.length - 1;
  if (m.some((z) => fuehrendeNullen(z) === n && z[n] !== 0)) return { art: 'unloesbar' };
  const zeilen = m.filter((z) => fuehrendeNullen(z) < n);
  if (zeilen.length < n) return { art: 'mehrdeutig', freie: n - zeilen.length };
  const x: Bruch[] = new Array(n);
  for (let r = n - 1; r >= 0; r--) {
    const z = zeilen[r]!;
    let rest = bruch(z[n]!);
    for (let c = r + 1; c < n; c++) rest = minus(rest, mal(bruch(z[c]!), x[c]!));
    x[r] = geteilt(rest, bruch(z[r]!));
  }
  return { art: 'eindeutig', x };
}

/** Löst ein System vollständig mit dem Gauß-Algorithmus. */
export function loese(m: Matrix): Loesung {
  const s = gaussSchritte(m);
  return loeseStufenform(s.length ? s[s.length - 1]!.danach : m);
}

/** Linke Seite einer Zeile mit eingesetzter Lösung. */
export function linkeSeite(zeile: number[], x: Bruch[]): Bruch {
  return x.reduce((summe, xi, c) => plus(summe, mal(bruch(zeile[c]!), xi)), bruch(0));
}

/** Probe: Die Lösung erfüllt jede Zeile der Matrix. */
export const erfuellt = (m: Matrix, x: Bruch[]): boolean => m.every((z) => bruchGleich(linkeSeite(z, x), bruch(z[z.length - 1]!)));

/** Ganze Lösung als TeX-Tupel, zum Beispiel (2;\,1;\,3). */
export const tupelTeX = (x: Bruch[]) => `(${x.map(bruchTeX).join(';\\,')})`;

/** Hilfsfunktion für Aufgaben: erweiterte Matrix aus Koeffizienten und bekannter Lösung (rechte Seite wird berechnet). */
export function mitLoesung(koeff: number[][], x: number[]): Matrix {
  return koeff.map((z) => [...z, z.reduce((s, k, c) => s + k * x[c]!, 0)]);
}

export interface FolgeZeile {
  /** Rechenvermerk als TeX, bei der Startmatrix nicht gesetzt. */
  vermerkTeX?: string;
  /** Text statt des Rechenvermerks (Standard bei der Startmatrix: „Ausgangsmatrix“). */
  beschriftung?: string;
  matrix: Matrix;
  marke?: MatrixMarke;
}

/**
 * Matrizen nach jeder Umformung samt Rechenvermerk und Markierung: Beim Ersetzen steht der Pivot (Eintrag der
 * anderen Zeile in der ersten Spalte mit Eintrag) in Blau, die dadurch erzeugte Null in Orange.
 */
export function folge(start: Matrix, us: Umformung[]): FolgeZeile[] {
  const ergebnis: FolgeZeile[] = [{ matrix: start }];
  let m = start;
  for (const u of us) {
    const vorher = m;
    m = wende(m, u);
    let marke: MatrixMarke | undefined;
    if (u.art === 'ersetze') {
      const spalte = vorher[u.j]!.findIndex((x) => x !== 0);
      marke = { pivot: [[u.j, spalte]], nullen: m[u.i]![spalte] === 0 ? [[u.i, spalte]] : [] };
    }
    ergebnis.push({ vermerkTeX: umformungTeX(u), matrix: m, marke });
  }
  return ergebnis;
}

/** Anzahl der führenden Nullen je Zeile (Zahl der Unbekannten bei einer Zeile ohne Koeffizienten). */
const fuehrend = fuehrendeNullen;

export interface Auswertung {
  /** Zeilen 0 = c mit c ungleich 0 (ab 0). */
  widerspruch: number[];
  /** Zeilen 0 = 0. */
  leer: number[];
  /** Pivot-Einträge [Zeile, Spalte] der Zeilen mit Koeffizienten. */
  pivots: [number, number][];
  /** Spalten (ab 0) ohne Pivot: die freien Unbekannten. */
  frei: number[];
}

/** Liest eine Matrix in Stufenform aus: Widerspruchszeilen, Nullzeilen, Pivots, freie Unbekannte. */
export function auswerte(stufe: Matrix): Auswertung {
  if (!istStufenform(stufe)) throw new Error('Die Matrix ist nicht in Stufenform');
  const n = stufe[0]!.length - 1;
  const widerspruch: number[] = [];
  const leer: number[] = [];
  const pivots: [number, number][] = [];
  stufe.forEach((z, r) => {
    const f = fuehrend(z);
    if (f === n) (z[n] === 0 ? leer : widerspruch).push(r);
    else pivots.push([r, f]);
  });
  const mitPivot = new Set(pivots.map(([, c]) => c));
  const frei = Array.from({ length: n }, (_, c) => c).filter((c) => !mitPivot.has(c));
  return { widerspruch, leer, pivots, frei };
}

/** Markierung für matrixTeX: Pivots blau, Widerspruchszeilen rosa, Nullzeilen grün. */
export function stufenMarke(stufe: Matrix): MatrixMarke {
  const a = auswerte(stufe);
  return { pivot: a.pivots, widerspruch: a.widerspruch, leer: a.leer };
}

export type Loesungsmenge =
  | { art: 'unloesbar'; widerspruch: number[] }
  | { art: 'eindeutig'; x: Bruch[] }
  /** x[j] = [konstanter Anteil, Koeffizient des 1. freien Parameters, ...] der Unbekannten j. */
  | { art: 'mehrdeutig'; frei: number[]; x: Bruch[][] };

/** Lösungsmenge eines Systems in Stufenform, bei freien Unbekannten mit Parametern (die freien Unbekannten sind die Parameter). */
export function loesungsmenge(stufe: Matrix): Loesungsmenge {
  const a = auswerte(stufe);
  if (a.widerspruch.length) return { art: 'unloesbar', widerspruch: a.widerspruch };
  const n = stufe[0]!.length - 1;
  const f = a.frei.length;
  const null0 = () => new Array<Bruch>(f + 1).fill(bruch(0));
  const x: Bruch[][] = Array.from({ length: n }, null0);
  a.frei.forEach((c, k) => {
    x[c]![k + 1] = bruch(1);
  });
  for (const [r, c] of [...a.pivots].reverse()) {
    const z = stufe[r]!;
    const summe = null0();
    summe[0] = bruch(z[n]!);
    for (let j = c + 1; j < n; j++) for (let k = 0; k <= f; k++) summe[k] = minus(summe[k]!, mal(bruch(z[j]!), x[j]![k]!));
    x[c] = summe.map((b) => geteilt(b, bruch(z[c]!)));
  }
  return f === 0 ? { art: 'eindeutig', x: x.map((v) => v[0]!) } : { art: 'mehrdeutig', frei: a.frei, x };
}

/** Löst ein beliebiges System (auch mit Nullzeilen, Widerspruch oder freien Unbekannten) mit dem Gauß-Algorithmus. */
export function loeseAllgemein(m: Matrix): Loesungsmenge {
  const s = gaussSchritte(m);
  return loesungsmenge(s.length ? s[s.length - 1]!.danach : m);
}

/** Namen der Parameter: t, bei zwei s und t, bei drei r, s und t. */
export const parameterNamen = (f: number): string[] => ['r', 's', 't'].slice(3 - f);

/** Affiner Ausdruck c₀ + c₁·t + ... als TeX, zum Beispiel 530-2t oder \frac{3}{2}t-1. */
export function affinTeX(a: Bruch[], namen: string[]): string {
  const teile: string[] = [];
  const bruchOhneVorzeichen = (b: Bruch) => (b.n === 1 ? String(Math.abs(b.z)) : `\\frac{${Math.abs(b.z)}}{${b.n}}`);
  const [c0, ...rest] = a;
  if (c0!.z !== 0) teile.push(bruchTeX(c0!));
  rest.forEach((b, k) => {
    if (b.z === 0) return;
    const betrag = b.n === 1 && Math.abs(b.z) === 1 ? '' : bruchOhneVorzeichen(b);
    teile.push(`${b.z < 0 ? '-' : teile.length ? '+' : ''}${betrag}${namen[k]}`);
  });
  return teile.join('') || '0';
}

const spalte = (zeilen: string[]) => `\\begin{pmatrix}${zeilen.join('\\\\')}\\end{pmatrix}`;

/** Lösungsmenge als TeX. Formen: tupel (L = {(…; …; …) | t ∈ ℝ}), vektor (Spaltenvektor mit Parametern in den Einträgen), summe (Stützvektor plus Parameter mal Richtungsvektor). */
export function loesungsmengeTeX(l: Loesungsmenge, form: 'tupel' | 'vektor' | 'summe' = 'tupel', umbruch = false): string {
  if (l.art === 'unloesbar') return 'L=\\emptyset';
  if (l.art === 'eindeutig') return `L=\\{${tupelTeX(l.x)}\\}`;
  const namen = parameterNamen(l.frei.length);
  const eintraege = l.x.map((a) => affinTeX(a, namen));
  const bedingung = `${namen.join(',\\,')}\\in\\mathbb{R}`;
  // Mehrzeilig für schmale Breiten: jeder Eintrag des Tupels in einer eigenen Zeile.
  if (form === 'tupel' && umbruch) return `\\begin{aligned}&L=\\{(${eintraege.slice(0, -1).map((e) => `${e};`).join('\\\\&\\quad ')}\\\\&\\quad ${eintraege[eintraege.length - 1]})\\\\&\\mid ${bedingung}\\}\\end{aligned}`;
  if (form === 'tupel') return `L=\\{(${eintraege.join(';\\,')})\\mid ${bedingung}\\}`;
  if (form === 'vektor') return `\\vec{x}=${spalte(eintraege)}\\quad(${bedingung})`;
  const stuetz = spalte(l.x.map((a) => bruchTeX(a[0]!)));
  const richtungen = namen.map((nm, k) => `${nm}${spalte(l.x.map((a) => bruchTeX(a[k + 1]!)))}`);
  return `\\vec{x}=${stuetz}+${richtungen.join('+')}`;
}
