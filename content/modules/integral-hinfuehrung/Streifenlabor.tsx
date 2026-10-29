import { StreifenLabor, type StreifenFunktion } from '@/components/Streifenlabor';
import { PARABEL, UFER } from './daten';

export type { StreifenFunktion };

export const STREIFEN_FUNKTIONEN: StreifenFunktion[] = [
  { id: 'ufer', name: 'Grundstück', tex: String.raw`f(x)=12+2x-0{,}04x^2`, sprech: 'f(x) gleich 12 plus 2 x minus 0,04 x²', f: UFER.f, a: UFER.a, b: UFER.b, stufen: UFER.stufen, bereich: UFER.bereich, teilung: UFER.teilung, yTeilung: UFER.yTeilung, einheit: String.raw`\,\text{m}^2`, xTitel: 'x in m', yTitel: 'y in m' },
  { id: 'parabel', name: 'Parabel', tex: String.raw`f(x)=\frac{1}{2}x^2+1`, sprech: 'f(x) gleich x²/2 plus 1', f: PARABEL.f, a: PARABEL.a, b: PARABEL.b, stufen: PARABEL.stufen, bereich: PARABEL.bereich, teilung: PARABEL.teilung, yTeilung: PARABEL.yTeilung, einheit: '', xTitel: 'x', yTitel: 'y' },
];


/** Streifenlabor dieses Moduls: Grundstück (Startstufe 5 Streifen) und Parabel (4 Streifen). */
export const Streifenlabor = () => <StreifenLabor funktionen={STREIFEN_FUNKTIONEN} startStufen={[1, 2]} />;
