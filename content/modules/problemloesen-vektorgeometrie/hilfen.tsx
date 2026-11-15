import type { ReactNode } from 'react';
import { Formel } from '@/components/Formel';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { punktTeX } from '@/lib/ebenenhilfen';

export const P = (name: string, p: number[]): string => punktTeX(name, p);
export const sp = (v: number[]): string => spalte(v);

/** Feld mit beliebiger Beschriftung. */
export function feld(id: string, name: string, beschriftung: ReactNode, erwartet: number, toleranz?: number) {
  return { id, name, beschriftung, erwartet, ...(toleranz ? { toleranz } : {}) };
}

/** Rechenkette `a = b = c`: einzeilig auf breiten Fenstern, in schmalen Boxen eine Zeile je Glied (Umbrüche nur vor dem Gleichheitszeichen). */
export function Kette({ z }: { z: string[] }) {
  return <Umbruchformel tex={z.join('=')} schmal={`\\begin{gathered}${z.map((x, i) => (i === 0 ? x : `{}=${x}`)).join('\\\\')}\\end{gathered}`} />;
}

/** Mehrere zusammengehörige Zeilen: einzeilig mit Abstand, schmal untereinander. */
export function Liste({ z }: { z: string[] }) {
  return <Umbruchformel tex={z.join(',\\ \\ ')} schmal={`\\begin{gathered}${z.join('\\\\')}\\end{gathered}`} />;
}

/** Ein Punkt im Fließtext. */
export const Pkt = ({ name, p, nach }: { name: string; p: number[]; nach?: string }) => <Formel tex={P(name, p)} {...(nach ? { nach } : {})} />;

/** Eine Gerade `g: x = p + t · u` (darf in schmalen Boxen vor „+ t · u“ brechen). */
export function GeradeFormel({ name = 'g', p, u, par = 't' }: { name?: string; p: number[]; u: number[]; par?: string }) {
  return (
    <Umbruchformel
      tex={`${name}:\\ \\vec{x}=${sp(p)}+${par}\\cdot${sp(u)}`}
      schmal={`\\begin{gathered}${name}:\\ \\vec{x}=${sp(p)}\\\\{}+${par}\\cdot${sp(u)}\\end{gathered}`}
    />
  );
}
