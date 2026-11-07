/** Gemeinsame Hilfen für Raumbilder mit Ebenen (Unterbereich Ebenen): Farben, Pfeile und die Ebene als grauer Ausschnitt im Koordinatensystem. */
import { ebeneImWuerfel, type Ebene } from './ebene';
import { vieleckBild } from './ebenenhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie } from './schraegbild';

export const O: Punkt3 = [0, 0, 0];
/** Farben: Stützvektor orange, erster Spannvektor blau, zweiter rosa, Wege schwarz gestrichelt, Ebenen grau. */
export const FARBE = { orange: '#D55E00', blau: '#0072B2', rosa: '#CC79A7', schwarz: '#222222', grau: '#8A8A8A', grauRand: '#555555' } as const;

export const pfeil = (von: Punkt3, bis: Punkt3, farbe: string, breite?: number): RaumLinie => ({ von, bis, farbe, pfeil: true, ...(breite ? { breite } : {}) });
export const plus3 = (a: number[], b: number[]): Punkt3 => a.map((x, i) => x + b[i]!) as Punkt3;

/** Der Teil der Ebene im Koordinatensystem als durchsichtige Fläche mit Rand. `randFarbe` und `deckkraft` erlauben eine zweite Ebene im selben Bild. */
export function ebenenFlaeche(e: Ebene, randFarbe: string = FARBE.grauRand, deckkraft = 0.3): { flaechen: NonNullable<RaumBildSpec['flaechen']>; linien: RaumLinie[] } {
  return vieleckBild(ebeneImWuerfel(e), FARBE.grau, randFarbe, deckkraft);
}
