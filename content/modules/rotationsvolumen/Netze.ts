import { koerperGlatt, koerperHohl, koerperScheiben, type Flaeche3 } from '@/lib/koerper3d';
import { scheiben } from '@/lib/rotation';
import { radiusInnen } from '@/lib/rotationsbild';
import { AUFGABE8, AUFGABE9, BEISPIEL, HUELSE, KOERPER } from './daten';

/** Netze der dreidimensionalen Ansichten. Sie werden erst beim ersten Aufruf gebaut und danach wiederverwendet. */
const speicher = new Map<string, Flaeche3[]>();
const einmal = (schluessel: string, bau: () => Flaeche3[]) => {
  if (!speicher.has(schluessel)) speicher.set(schluessel, bau());
  return speicher.get(schluessel)!;
};
const koerper = (id: string) => KOERPER.find((k) => k.id === id)!;

/** Erklären: drei Zylinder von innen zu f(x) = 0,5x + 1 auf [0; 3]. */
export const netzBeispielScheiben = () => einmal('beispiel-scheiben', () => koerperScheiben(scheiben(BEISPIEL.f, BEISPIEL.a, BEISPIEL.b, BEISPIEL.n).z, radiusInnen));
/** Zusammenfassung: der glatte Körper zu f(x) = 0,5x + 1. */
export const netzBeispiel = () => einmal('beispiel', () => koerperGlatt(BEISPIEL.f, BEISPIEL.a, BEISPIEL.b, 24));
/** Entdecken, Vermutung 1. */
export const netzZylinder = () => einmal('zylinder', () => koerperGlatt(koerper('zylinder').f, 0, 3, 6));
export const netzKegel = () => einmal('kegel', () => koerperGlatt(koerper('kegel').f, 0, 6, 12));
export const netzKugel = () => einmal('kugel', () => koerperGlatt(koerper('kugel').f, -3, 3, 48));
/** Zusammenfassung: Hülse (durchgehend hohl), Überprüfen: Vase und Becher (mit Boden). */
export const netzHuelse = () => einmal('huelse', () => koerperHohl(() => HUELSE.R, () => HUELSE.r, HUELSE.a, HUELSE.b, HUELSE.a, 8));
export const netzVase = () => einmal('vase', () => koerperGlatt(AUFGABE8.f, AUFGABE8.a, AUFGABE8.b, 40));
export const netzBecher = () => einmal('becher', () => koerperHohl(AUFGABE9.f, AUFGABE9.g, AUFGABE9.a, AUFGABE9.b, AUFGABE9.c, 40));
