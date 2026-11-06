/**
 * Rechenhilfen für Bewegung und Schatten: Rechnungen als TeX, einzeilig und in kurzen Zeilen für schmale Fenster. Zeilenumbrüche stehen nur vor einem Gleichheitszeichen
 * (Vorgabe der Lehrkraft, 07.11.2026), eine Vektorzeile bleibt in einer Zeile. Alle Rechnungen im Text entstehen aus den Zahlen in `daten.ts`.
 */
import { bahn, geschwindigkeit, type Bewegung } from '@/lib/bewegung';
import { bruch, linTeX, wurzelTeX, type Zeilen } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { zt } from '@/lib/modulhilfen';
import { betrag } from '@/lib/vektor';

export { betragZeilen, gl, glSchmal, linTeX, polyTeX, rund2, rundN, wurzelTeX, zeilenFormel, type Zeilen } from '@/lib/geradenhilfen';

/** Spalte mit Brüchen statt Dezimalzahlen (Nenner bis 12), zum Beispiel für 11/3. */
export const spalteBruch = (v: number[]): string => `\\begin{pmatrix}${v.map((x) => bruch(Math.round(x * 1e9) / 1e9)).join('\\\\')}\\end{pmatrix}`;

/** Zeitdauer in Stunden als TeX mit Komma (0,05). */
export const stunden = (t: number): string => zt(Math.round(t * 1e6) / 1e6);

/** Geschwindigkeitsvektor aus Richtung und Tempo: Faktor Tempo durch |u|, dann v. Der Faktor ist ein Bruch oder eine ganze Zahl. */
export function geschwindigkeitZeilen(b: Bewegung): Zeilen {
  const n = betrag(b.richtung);
  const nq = Math.round(n * n);
  const v = geschwindigkeit(b);
  const faktor = `\\frac{${b.tempo}}{${wurzelTeX(nq)}}`;
  const k = b.tempo / n;
  const kurz = Number.isInteger(k) ? String(k) : bruch(k);
  return {
    tex: `\\vec{v}=${faktor}\\cdot${spalte(b.richtung)}=${kurz}\\cdot${spalte(b.richtung)}=${spalte(v)}`,
    schmal: `\\begin{gathered}${['\\vec{v}', `{}=${faktor}\\cdot${spalte(b.richtung)}`, `{}=${kurz}\\cdot${spalte(b.richtung)}`, `{}=${spalte(v)}`].join('\\\\')}\\end{gathered}`,
  };
}

/** Bahn einer Bewegung als Gleichung g: x = p + t · v (v ist der Geschwindigkeitsvektor). */
export const bahnGleichung = (b: Bewegung, name = 'g'): { g: { p: number[]; u: number[] }; name: string } => ({ g: bahn(b), name });

/** Punkt zum Parameter par: name = p + par · v = Ergebnis (drei Zeilen, die Vektorzeile bleibt zusammen). Das Ergebnis darf Brüche haben. */
export function ortZeilen(p: number[], par: number, v: number[], name: string, parTeX = stunden(par)): Zeilen {
  const erg = p.map((c, i) => c + par * v[i]!);
  const mitte = `${spalte(p)}+${parTeX}\\cdot${spalte(v)}`;
  const ergebnis = erg.every((x) => Number.isInteger(Math.round(x * 1e9) / 1e9)) ? spalte(erg.map((x) => Math.round(x * 1e9) / 1e9)) : spalteBruch(erg);
  return {
    tex: `${name}=${mitte}=${ergebnis}`,
    schmal: `\\begin{gathered}${[name, `{}=${mitte}`, `{}=${ergebnis}`].join('\\\\')}\\end{gathered}`,
  };
}

/** Gleichung Koordinate i: p_i + t · v_i = Zahl, als TeX mit einem Parameter (Standard t). */
export const koordGleichung = (p: number, v: number, rechts: number | string, par = 't'): string => `${linTeX(p, v, par)}=${typeof rechts === 'number' ? bruch(rechts) : rechts}`;

/**
 * Zeit, zu der ein Objekt den Punkt x auf seiner Bahn erreicht: Gleichung der ersten Koordinate mit v_i ≠ 0, dann der Wert (in Stunden und in Minuten).
 */
export function zeitGleichung(b: Bewegung, x: number[], par = 't'): Zeilen {
  const v = geschwindigkeit(b);
  const i = v.findIndex((c) => Math.abs(c) > 1e-9);
  const t = (x[i]! - b.start[i]!) / v[i]!;
  const g = `${linTeX(b.start[i]!, v[i]!, par)}=${bruch(x[i]!)}`;
  const erg = `${par}=${bruch(Math.round(t * 1e9) / 1e9)}`;
  return { tex: `${g},\\ \\ ${erg}`, schmal: `\\begin{gathered}${[g, `${erg}`].join('\\\\')}\\end{gathered}` };
}

/** Gleichungen für „zur selben Zeit am selben Ort“, je Koordinate p₁ᵢ + t · v₁ᵢ = p₂ᵢ + t · v₂ᵢ, danach ((v₁ᵢ − v₂ᵢ) · t = p₂ᵢ − p₁ᵢ). */
export function kollisionsGleichungen(b1: Bewegung, b2: Bewegung): string[] {
  const v1 = geschwindigkeit(b1);
  const v2 = geschwindigkeit(b2);
  return b1.start.map((p1, i) => `${linTeX(p1, v1[i]!, 't')}=${linTeX(b2.start[i]!, v2[i]!, 't')}`);
}
/** Dieselben Gleichungen nach t sortiert: a t = c. */
export function kollisionsGleichungenSortiert(b1: Bewegung, b2: Bewegung): string[] {
  const v1 = geschwindigkeit(b1);
  const v2 = geschwindigkeit(b2);
  return b1.start.map((p1, i) => {
    const a = v1[i]! - v2[i]!;
    const c = b2.start[i]! - p1;
    return `${Math.abs(a) < 1e-9 ? '0' : `${a < 0 ? '-' : ''}${Math.abs(a) === 1 ? '' : Math.abs(a)}t`}=${bruch(c)}`;
  });
}

/** Zerlegung eines Abstandsquadrats d(t)² in die drei Quadrate der Koordinaten und das zusammengefasste Polynom (jeder Schritt eine eigene Gleichung). */
export function abstandsfunktionZeilen(b1: Bewegung, b2: Bewegung, poly: string): Zeilen {
  const v1 = geschwindigkeit(b1);
  const v2 = geschwindigkeit(b2);
  const dp = b2.start.map((c, i) => c - b1.start[i]!);
  const dv = v2.map((c, i) => c - v1[i]!);
  const terme = dp.map((c, i) => linTeX(c, dv[i]!, 't'));
  const quadrate = terme.map((tt) => `(${tt})^2`);
  return {
    tex: `f(t)=d(t)^2=${quadrate.join('+')}=${poly}`,
    schmal: `\\begin{gathered}${['f(t)=d(t)^2', `{}=${quadrate.join('+')}`, `{}=${poly}`].join('\\\\')}\\end{gathered}`,
  };
}

/** Vektor von Objekt 1 zu Objekt 2 zur Zeit t: Δp + t · Δv als eine Zeile. */
export function abstandsvektor(b1: Bewegung, b2: Bewegung): Zeilen {
  const v1 = geschwindigkeit(b1);
  const v2 = geschwindigkeit(b2);
  const dp = b2.start.map((c, i) => c - b1.start[i]!);
  const dv = v2.map((c, i) => c - v1[i]!);
  const tex = `\\overrightarrow{X_1X_2}(t)=${spalte(dp)}+t\\cdot${spalte(dv)}`;
  return { tex, schmal: `\\begin{gathered}${['\\overrightarrow{X_1X_2}(t)', `{}=${spalte(dp)}+t\\cdot${spalte(dv)}`].join('\\\\')}\\end{gathered}` };
}

/** Minimum: Ableitung, Nullstelle, Minimum. */
export function minimumZeilen(a: number, b: number, c: number): Zeilen {
  const tm = -b / (2 * a);
  const dm = a * tm * tm + b * tm + c;
  const ableitung = `f'(t)=${linTeX(b, 2 * a, 't')}`;
  const stelle = `t=${bruch(Math.round(tm * 1e9) / 1e9)}`;
  const wert = `f\\left(${bruch(Math.round(tm * 1e9) / 1e9)}\\right)=${bruch(Math.round(dm * 1e9) / 1e9)}`;
  return {
    tex: `${ableitung},\\ \\ f'(t)=0\\Rightarrow ${stelle},\\ \\ ${wert}`,
    schmal: `\\begin{gathered}${["f'(t)", `{}=${linTeX(b, 2 * a, 't')}`, "f'(t)=0", `{}\\Rightarrow ${stelle}`, wert].join('\\\\')}\\end{gathered}`,
  };
}

/* ---------- Schatten ---------- */

/** Parallelprojektion eines Punkts X in eine Koordinatenebene (Index i der Koordinate, die 0 ist, Standard 1 für x₂ = 0): Gleichung dieser Koordinate, Parameter, Schattenpunkt. */
export function parallelZeilen(X: number[], v: number[], schattenName: string, i = 1): Zeilen {
  const gl = `${linTeX(X[i]!, v[i]!, 't')}=0`;
  const t = -X[i]! / v[i]!;
  const tt = bruch(Math.round(t * 1e9) / 1e9);
  const erg = X.map((c, i) => c + t * v[i]!);
  const erg2 = erg.every((x) => Number.isInteger(Math.round(x * 1e9) / 1e9)) ? spalte(erg.map((x) => Math.round(x * 1e9) / 1e9)) : spalteBruch(erg);
  const rechnung = `${spalte(X)}+${tt}\\cdot${spalte(v)}`;
  return {
    tex: `${gl},\\ \\ t=${tt},\\ \\ ${schattenName}=${rechnung}=${erg2}`,
    schmal: `\\begin{gathered}${[gl, `t=${tt}`, `${schattenName}`, `{}=${rechnung}`, `{}=${erg2}`].join('\\\\')}\\end{gathered}`,
  };
}

/** Zentralprojektion eines Punkts X von L in die Ebene x₂ = 0: Strahl L + s · LX, Gleichung der 2. Koordinate, Parameter, Schattenpunkt. */
export function zentralZeilen(X: number[], L: number[], schattenName: string): Zeilen {
  const lx = X.map((c, i) => c - L[i]!);
  const gl = `${linTeX(L[1]!, lx[1]!, 's')}=0`;
  const s = -L[1]! / lx[1]!;
  const ss = bruch(Math.round(s * 1e9) / 1e9);
  const erg = L.map((c, i) => c + s * lx[i]!);
  const erg2 = erg.every((x) => Number.isInteger(Math.round(x * 1e9) / 1e9)) ? spalte(erg.map((x) => Math.round(x * 1e9) / 1e9)) : spalteBruch(erg);
  const rechnung = `${spalte(L)}+${ss}\\cdot${spalte(lx)}`;
  return {
    tex: `${gl},\\ \\ s=${ss},\\ \\ ${schattenName}=${rechnung}=${erg2}`,
    schmal: `\\begin{gathered}${[gl, `s=${ss}`, `${schattenName}`, `{}=${rechnung}`, `{}=${erg2}`].join('\\\\')}\\end{gathered}`,
  };
}

/** Verbindungsvektor LX = X − L als Zeile. */
export const lxZeile = (L: number[], X: number[], name: string): string => `\\overrightarrow{L${name}}=${spalte(X.map((c, i) => c - L[i]!))}`;
