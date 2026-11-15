import { Formel } from '@/components/Formel';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { koordinatenformTeX } from '@/lib/ebenenhilfen';
import type { Feld } from '@/components/Aufgabe';

/** Kurzschreibweisen für Formeln im Text. Ein Satzzeichen danach steht im Parameter `nach`, damit es an der Formel hängen bleibt. */
export const F = (tex: string, nach?: string) => <Formel tex={tex} {...(nach ? { nach } : {})} />;
/** Punkt wie A(1 | 2 | 3). */
export const P = (name: string, v: number[], nach?: string) => F(punktTeX(name, v), nach);
/** Vektor als Spalte. */
export const V = (v: number[], nach?: string) => F(spalte(v), nach);
/** Koordinatenform wie 2x_1 − x_2 + 3x_3 = 5. */
export const KF = (n: number[], d: number, name = '', nach?: string) => F(koordinatenformTeX(n, d, name), nach);

/** Feld mit den Koordinaten x₁, x₂, x₃ eines Punkts oder Vektors, IDs `<präfix>1` bis `<präfix>3`. */
export function koordFelder(praefix: string, name: string, erwartet: number[], beschriftung: (i: number) => string = (i) => `x_${i + 1}`, toleranz?: number): Feld[] {
  return erwartet.map((e, i) => ({
    id: `${praefix}${i + 1}`,
    name: `${name} ${['x1', 'x2', 'x3'][i]}`,
    beschriftung: <Formel tex={beschriftung(i)} />,
    erwartet: e,
    ...(toleranz !== undefined ? { toleranz } : {}),
  }));
}
