import type { ReactNode } from 'react';
import { Formel } from '@/components/Formel';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';

/** Kurzformen für Punkte und Spalten in TeX. */
export const P = (name: string, p: number[]): string => punktTeX(name, p);
export const sp = (v: number[]): string => spalte(v);

/** Feld für die Koordinate eines Punkts, zum Beispiel „erste Koordinate von S“. */
const WORT = ['erste', 'zweite', 'dritte'];
export function koord(id: string, name: string, index: number, erwartet: number, toleranz?: number) {
  return {
    id,
    name: `${WORT[index - 1]} Koordinate von ${name}`,
    beschriftung: (
      <>
        Koordinate <Formel tex={`${name.toLowerCase().replace('′', "'")}_${index}`} /> von <Formel tex={name.replace('′', "'")} />
      </>
    ),
    erwartet,
    ...(toleranz ? { toleranz } : {}),
  };
}

/** Feld mit beliebiger Beschriftung. */
export function feld(id: string, name: string, beschriftung: ReactNode, erwartet: number, toleranz?: number) {
  return { id, name, beschriftung, erwartet, ...(toleranz ? { toleranz } : {}) };
}

/** Rechenkette `a = b = c`: einzeilig auf breiten Fenstern, in schmalen Boxen eine Zeile je Glied, Umbrüche nur vor dem Gleichheitszeichen. */
export function Kette({ z }: { z: string[] }) {
  return <Umbruchformel tex={z.join('=')} schmal={`\\begin{gathered}${z.map((x, i) => (i === 0 ? x : `{}=${x}`)).join('\\\\')}\\end{gathered}`} />;
}

/** Mehrere zusammengehörige Gleichungen (zum Beispiel I, II, III): einzeilig mit Abstand, schmal untereinander. */
export function Liste({ z }: { z: string[] }) {
  return <Umbruchformel tex={z.join(',\\ \\ ')} schmal={`\\begin{gathered}${z.join('\\\\')}\\end{gathered}`} />;
}

/** Eine Gerade `g: x = p + t · u` (darf in schmalen Boxen vor „+ t · u“ brechen). */
export function GeradeFormel({ name = 'g', p, u, par = 't' }: { name?: string; p: number[]; u: number[]; par?: string }) {
  return (
    <Umbruchformel
      tex={`${name}:\\ \\vec{x}=${sp(p)}+${par}\\cdot${sp(u)}`}
      schmal={`\\begin{gathered}${name}:\\ \\vec{x}=${sp(p)}\\\\{}+${par}\\cdot${sp(u)}\\end{gathered}`}
    />
  );
}

/** Feld für die von 0 verschiedene Koordinate des Spurpunkts S_nr auf der x_nr-Achse. */
export function spur(id: string, nr: number, erwartet: number) {
  return feld(
    id,
    `Koordinate x${nr} von Spurpunkt S${nr}`,
    <>
      Koordinate <Formel tex={`x_${nr}`} /> von <Formel tex={`S_${nr}`} />
    </>,
    erwartet,
  );
}
