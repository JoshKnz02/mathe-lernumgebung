import type { ReactNode } from 'react';
import type { Option } from '@/components/Auswahlfrage';

/** Kurzschreibweise für TeX-Zeichenketten ohne doppelte Rückstriche. */
export const t = String.raw;

/** Option einer Auswahlfrage. */
export const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });

/** Setzt die richtige Antwort an die Stelle k (0 = erste), damit sie nicht immer oben steht. Die Reihenfolge der übrigen bleibt. */
export function platziere(optionen: Option[], k: number): Option[] {
  const i = optionen.findIndex((o) => o.richtig);
  const rest = optionen.filter((_, j) => j !== i);
  return [...rest.slice(0, k), optionen[i]!, ...rest.slice(k)];
}

/** Zahl als TeX mit Dezimalkomma. */
export const zt = (x: number) => String(x).replace('.', '{,}');
