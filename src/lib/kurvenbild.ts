import { BLAU, ORANGE, SCHWARZ, type MessKurve, type MessPunkt, type MessStrecke, type MessbildDaten } from '@/components/Messbild';
import { beschriftungsLage, type Hindernis } from '@/lib/beschriftung';
import { piText, zahlText } from '@/lib/zahlen';

/**
 * Schaubild von K_f mit beschrifteten Punkten, blau gestrichelten Geraden und Textalternative (gemeinsam genutzt von mehreren Modulen).
 * Farben: K_f orange, Geraden blau gestrichelt, Hilfsstrecken schwarz gestrichelt. Die Beschriftungen der Punkte (N, H, T, W, Sy, R, P, Q)
 * setzt `beschriftungsLage` auf eine freie Seite des Punkts, nie auf das Schaubild.
 */

type Fn = (x: number) => number;
export type Bereich = [number, number, number, number];
const PI = Math.PI;

/** Ein beschrifteter Punkt: Text im Bild und Wort für die Textalternative. */
export interface Marke {
  x: number;
  y: number;
  /** Kurzer Text im Bild. Die Wörter der Textalternative stehen in `WORT`, für andere Buchstaben gilt „Punkt X“. */
  text: string;
  /** Offener Punkt: Der Wert wird nicht angenommen (zum Beispiel Rand außerhalb des Definitionsbereichs). */
  offen?: boolean;
  /** Der Punkt wird gezeichnet, aber im Bild nicht beschriftet (zum Beispiel, wenn auf keiner Seite genug Platz ist). Die Textalternative nennt ihn trotzdem. */
  ohneText?: boolean;
}
const WORT: Record<string, string> = {
  N: 'Nullstelle N',
  H: 'Hochpunkt H',
  T: 'Tiefpunkt T',
  W: 'Wendepunkt W',
  Sy: 'Schnittpunkt Sy mit der y-Achse',
  R: 'Randpunkt R',
  P: 'Punkt P',
  Q: 'Punkt Q',
};
const xWort = (x: number, pi?: boolean) =>
  (pi ? piText(x) : zahlText(x))
    .replace('−', 'minus ')
    .replace('π', ' Pi ')
    .replace('/', ' durch ')
    .replace(/\s+/g, ' ')
    .trim();

export interface Gerade {
  f: Fn;
  /** Worte für die Textalternative, zum Beispiel „Asymptote y gleich 2“. */
  sprech: string;
}

export interface Spec {
  sprech: string;
  /** Ersetzt den ersten Satz der Textalternative („Schaubild K f von f(x) gleich …“), zum Beispiel für Zielfunktionen. */
  titel?: string;
  /** Das Schaubild. Fehlt es, zeigt das Bild nur Punkte, Geraden und Strecken (zum Beispiel eine Skizze). */
  f?: Fn;
  bereich: Bereich;
  teilung: number;
  yTeilung: number;
  pi?: boolean;
  von?: number;
  bis?: number;
  punkte?: Marke[];
  geraden?: Gerade[];
  /** Strecken zwischen zwei Punkten (zum Beispiel von P nach Q), schwarz gestrichelt. */
  strecken?: MessStrecke[];
  /** Auch senkrechte Strecken sind Hindernisse für Beschriftungen (Standard: nein, wie in den älteren Modulen). */
  senkrechteMeiden?: boolean;
  zusatz?: string;
}

/** Schaubild von K_f mit beschrifteten Punkten, blau gestrichelten Geraden und Textalternative. */
export function kurvenBild(s: Spec): MessbildDaten {
  const geraden = s.geraden ?? [];
  // Alle Linien, auf denen eine Beschriftung nicht stehen darf: das Schaubild, die Geraden und die gestrichelten Strecken (nicht senkrechte)
  const hindernisse: Hindernis[] = [
    ...(s.f ? [{ f: s.f, ...(s.von !== undefined ? { von: s.von } : {}), ...(s.bis !== undefined ? { bis: s.bis } : {}) }] : []),
    ...geraden.map((g): Hindernis => ({ f: g.f })),
    ...(s.strecken ?? [])
      .filter((st) => st.von[0] !== st.bis[0])
      .map((st): Hindernis => ({
        f: (x) => st.von[1] + ((st.bis[1] - st.von[1]) / (st.bis[0] - st.von[0])) * (x - st.von[0]),
        von: Math.min(st.von[0], st.bis[0]),
        bis: Math.max(st.von[0], st.bis[0]),
      })),
    // Senkrechte Strecken: viele Stützpunkte bei derselben Stelle x
    ...(s.senkrechteMeiden
      ? (s.strecken ?? [])
          .filter((st) => st.von[0] === st.bis[0])
          .flatMap((st) => Array.from({ length: 25 }, (_, i): Hindernis => ({ f: () => st.von[1] + ((st.bis[1] - st.von[1]) * i) / 24, von: st.von[0] - 1e-9, bis: st.von[0] + 1e-9 })))
      : []),
  ];
  const punkte: MessPunkt[] = (s.punkte ?? []).map((p) => ({ x: p.x, y: p.y, farbe: ORANGE, ...(p.ohneText ? {} : { text: p.text }), ...(p.offen ? { offen: true } : {}), lage: beschriftungsLage({ x: p.x, y: p.y }, s.bereich, hindernisse, false, true, { x: s.teilung, y: s.yTeilung }) }));
  const kurven: MessKurve[] = [
    ...(s.f ? [{ f: s.f, farbe: ORANGE, ...(s.von !== undefined ? { von: s.von } : {}), ...(s.bis !== undefined ? { bis: s.bis } : {}) }] : []),
    ...geraden.map((g): MessKurve => ({ f: g.f, farbe: BLAU, gestrichelt: true })),
  ];
  const liste = (s.punkte ?? []).map((p) => `${WORT[p.text] ?? `Punkt ${p.text}`}${p.offen ? ' (offen)' : ''} bei x gleich ${xWort(p.x, s.pi)}`).join(', ');
  return {
    kurven,
    punkte,
    ...(s.strecken ? { strecken: s.strecken } : {}),
    bereich: s.bereich,
    teilung: s.teilung,
    yTeilung: s.yTeilung,
    xBeschriftung: s.pi ? 'pi' : 'zahl',
    beschreibung: `${s.titel ?? `Schaubild K f von f(x) gleich ${s.sprech}`}.${liste ? ` Markiert sind: ${liste}.` : ''}${geraden.length ? ` Blau gestrichelt: ${geraden.map((g) => g.sprech).join(', ')}.` : ''}${s.zusatz ? ` ${s.zusatz}` : ''}`,
  };
}

export const marken = (typ: string, f: Fn, xs: number[]): Marke[] => xs.map((x) => ({ x, y: f(x), text: typ }));
export const hilfsstrecke = (von: [number, number], bis: [number, number]): MessStrecke => ({ von, bis, farbe: SCHWARZ, gestrichelt: true });
