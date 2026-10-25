import type { GeometryElement } from 'jsxgraph';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { findeUmkehr, parameterBereich, schnittstellenWaagerechte, wertU, type UmkehrFunktion } from '@/lib/umkehr';
import { FARBE_F, FARBE_GERADE, FARBE_INV } from './daten';

export const UMKEHR_BEREICH: [number, number, number, number] = [-6, 6, -6, 6];
const MAX_SCHNITT = 12;

export interface Hilfslinie {
  art: 'x' | 'y';
  wert: number;
}

export interface UmkehrZeichnungProps {
  /** ID der Funktion aus dem Katalog. */
  f: string;
  /** Stelle x₀ für den Punkt P und seinen Spiegelpunkt P′ (null: kein Punkt). */
  x0?: number | null;
  /** Höhe c der waagerechten Geraden y = c (null: keine Gerade). */
  c?: number | null;
  /** Spiegelbild von K_f an y = x anzeigen. */
  spiegel?: boolean;
  /** Zusätzliche gestrichelte Hilfslinien, zum Beispiel Asymptoten. */
  hilfslinien?: Hilfslinie[];
  bereich?: [number, number, number, number];
  teilung?: number;
  beschreibung: string;
  className?: string;
}

interface Zustand {
  u: UmkehrFunktion;
  x0: number | null;
  c: number | null;
  spiegel: boolean;
  schnitt: number[];
  hilfslinien: Hilfslinie[];
}

/** Punkt P und Spiegelpunkt P′, nur wenn x₀ zum Definitionsbereich gehört. */
export function spiegelpaar(u: UmkehrFunktion, x0: number | null) {
  if (x0 === null) return null;
  const y = wertU(u, x0);
  return Number.isNaN(y) || !Number.isFinite(y) ? null : { p: { x: x0, y }, q: { x: y, y: x0 } };
}

/**
 * Schaubild von f, Spiegelachse y = x und Spiegelbild von K_f. Das Spiegelbild wird als Kurve (f(t) | t) gezeichnet und ist deshalb auch dann zu sehen,
 * wenn f nicht umkehrbar ist (dann ist es kein Schaubild einer Funktion). Optional: Punkt mit Spiegelpunkt und waagerechte Gerade mit Schnittpunkten.
 */
export function UmkehrZeichnung({ f, x0 = null, c = null, spiegel = true, hilfslinien = [], bereich = UMKEHR_BEREICH, teilung = 2, beschreibung, className = 'brett-quadrat bild-schmal' }: UmkehrZeichnungProps) {
  const u = findeUmkehr(f);
  const zustand: Zustand = { u, x0, c, spiegel, schnitt: c === null ? [] : schnittstellenWaagerechte(u, c, bereich[0], bereich[1]), hilfslinien };
  return (
    <Zeichenbrett
      bereich={bereich}
      xTeilung={teilung}
      yTeilung={teilung}
      xBeschriftung="zahl"
      className={className}
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(brett, lies) => {
        const stil = { highlight: false, fixed: true };
        brett.create('line', [[0, 0], [1, 1]], { ...stil, strokeColor: FARBEN.vergleich, strokeWidth: 2, dash: 3 });
        const hilfen = Array.from({ length: 4 }, (_, i) => {
          const h = () => lies().hilfslinien[i];
          const y = (art: 'x' | 'y', w: number) => (art === 'y' ? w : 0);
          return brett.create(
            'line',
            [
              [() => (h()?.art === 'y' ? 0 : (h()?.wert ?? 0)), () => y(h()?.art ?? 'y', h()?.wert ?? 0)],
              [() => (h()?.art === 'y' ? 1 : (h()?.wert ?? 0)), () => (h()?.art === 'y' ? (h()?.wert ?? 0) : 1)],
            ],
            { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 1, dash: 2, visible: false },
          ) as GeometryElement;
        });
        const kurvenSpiegel = brett.create(
          'curve',
          [(t: number) => wertU(lies().u, t), (t: number) => t, () => parameterBereich(lies().u, bereich[1] + 3)[0], () => parameterBereich(lies().u, bereich[1] + 3)[1]],
          { ...stil, strokeColor: FARBE_INV, strokeWidth: 3.5, numberPointsHigh: 600 },
        ) as GeometryElement;
        brett.create('functiongraph', [(x: number) => wertU(lies().u, x)], { ...stil, strokeColor: FARBE_F, strokeWidth: 3.5 });
        const gerade = brett.create('line', [[0, () => lies().c ?? 0], [1, () => lies().c ?? 0]], { ...stil, strokeColor: FARBE_GERADE, strokeWidth: 1.5, dash: 1, visible: false }) as GeometryElement;
        const schnittpunkte = Array.from({ length: MAX_SCHNITT }, (_, i) =>
          brett.create('point', [() => lies().schnitt[i] ?? 0, () => lies().c ?? 0], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: '#fff', fillColor: FARBE_GERADE, visible: false }) as GeometryElement,
        );
        const pP = brett.create('point', [() => spiegelpaar(lies().u, lies().x0)?.p.x ?? 0, () => spiegelpaar(lies().u, lies().x0)?.p.y ?? 0], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: FARBE_F, visible: false }) as GeometryElement;
        const pQ = brett.create('point', [() => spiegelpaar(lies().u, lies().x0)?.q.x ?? 0, () => spiegelpaar(lies().u, lies().x0)?.q.y ?? 0], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: FARBE_INV, visible: false }) as GeometryElement;
        const verbindung = brett.create('segment', [[() => spiegelpaar(lies().u, lies().x0)?.p.x ?? 0, () => spiegelpaar(lies().u, lies().x0)?.p.y ?? 0], [() => spiegelpaar(lies().u, lies().x0)?.q.x ?? 0, () => spiegelpaar(lies().u, lies().x0)?.q.y ?? 0]], { ...stil, strokeColor: FARBEN.neutral, strokeWidth: 1.5, dash: 2, visible: false }) as GeometryElement;
        return (z: Zustand) => {
          kurvenSpiegel.setAttribute({ visible: z.spiegel });
          const paar = spiegelpaar(z.u, z.x0);
          for (const e of [pP, pQ, verbindung]) e.setAttribute({ visible: paar !== null });
          gerade.setAttribute({ visible: z.c !== null });
          schnittpunkte.forEach((p, i) => p.setAttribute({ visible: z.c !== null && i < z.schnitt.length }));
          hilfen.forEach((l, i) => l.setAttribute({ visible: Boolean(z.hilfslinien[i]) }));
        };
      }}
    />
  );
}
