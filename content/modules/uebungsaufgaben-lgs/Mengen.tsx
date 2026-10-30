import { Umbruchformel } from '@/components/Umbruchformel';

interface MengeProps {
  /** Einträge des Tupels als TeX, zum Beispiel ["1+t", "2-t", "t"]. */
  eintraege: string[];
  /** Bedingung an den Parameter als TeX, zum Beispiel "t\in\mathbb{R}". */
  bedingung: string;
}

/** Lösungsmenge L = {(…; …; …) | t ∈ ℝ} als abgesetzte Formel, auf schmalen Fenstern mit einem Eintrag je Zeile. */
export function Menge({ eintraege, bedingung }: MengeProps) {
  const letzte = eintraege[eintraege.length - 1]!;
  const tex = `L=\\{(${eintraege.join(';\\,')})\\mid ${bedingung}\\}`;
  const schmal = `\\begin{aligned}&L=\\{(${eintraege.slice(0, -1).map((e) => `${e};`).join('\\\\&\\quad ')}\\\\&\\quad ${letzte})\\\\&\\mid ${bedingung}\\}\\end{aligned}`;
  return <Umbruchformel tex={tex} schmal={schmal} />;
}
