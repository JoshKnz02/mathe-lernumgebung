import { SCHWARZ } from '@/components/Messbild';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { labelMitte, lageFuerPunkt, achsenLinien, type Bereich, type Linie, type Punkt2 } from '@/lib/vektorbild';

/** Zeichenfläche der Labore in der Ebene: x₁ und x₂ von −8 bis 8. */
export const LABOR_BEREICH: Bereich = [-8, 8, -8, 8];

export interface LaborPfeil {
  von: Punkt2;
  bis: Punkt2;
  farbe: string;
  breite: number;
  sichtbar: boolean;
}
export interface LaborPunkt {
  name: string;
  p: Punkt2;
}
/** Zustand des Bildes: Die Zahl der Pfeile und Punkte ist je Labor fest, nur Lage und Sichtbarkeit ändern sich. Pfeile weiter vorn werden zuerst gezeichnet. */
export interface LaborZustand {
  pfeile: LaborPfeil[];
  punkte: LaborPunkt[];
}

/**
 * Mittelpunkte der Beschriftungen aller Punkte in Bruchteilen von Breite und Höhe. Die Seite wird rechnerisch gewählt: nie auf einem sichtbaren Pfeil
 * oder einer Achse, und jede schon gesetzte Beschriftung gilt als besetzt.
 */
export function laborLagen(z: LaborZustand): [number, number][] {
  const linien: Linie[] = [...achsenLinien(LABOR_BEREICH), ...z.pfeile.filter((a) => a.sichtbar).map((a): Linie => ({ von: a.von, bis: a.bis }))];
  const o = { bereich: LABOR_BEREICH, teilung: 1, linien, belegt: [] as [number, number][] };
  return z.punkte.map((pt) => {
    const lage = lageFuerPunkt(pt.p, o);
    const m = labelMitte(lage, pt.p, LABOR_BEREICH);
    o.belegt.push(m);
    return m;
  });
}

const stil = { highlight: false, fixed: true };

/** Bild eines Labors in der Ebene mit Pfeilen und beschrifteten Punkten, die sich mit dem Zustand ändern. */
export function Laborbrett({ zustand, beschreibung }: { zustand: LaborZustand; beschreibung: string }) {
  return (
    <Zeichenbrett
      bereich={LABOR_BEREICH}
      xTeilung={1}
      yTeilung={1}
      xBeschriftung="zahl"
      className="brett-quadrat"
      xTitel="x₁"
      yTitel="x₂"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const [xmin, xmax, ymin, ymax] = LABOR_BEREICH;
        const z0 = lies();
        const segmente = z0.pfeile.map((_, i) =>
          b.create('segment', [() => lies().pfeile[i]!.von, () => lies().pfeile[i]!.bis], { ...stil, strokeColor: z0.pfeile[i]!.farbe, strokeWidth: z0.pfeile[i]!.breite, lastArrow: { type: 2, size: 6 } }),
        );
        z0.punkte.forEach((_, i) => b.create('point', [() => lies().punkte[i]!.p[0], () => lies().punkte[i]!.p[1]], { ...stil, withLabel: false, face: 'o', size: 4, strokeColor: SCHWARZ, fillColor: SCHWARZ }));
        // Die Lagen der Beschriftungen werden je Einstellung einmal berechnet, weil JSXGraph die Koordinaten bei jeder Aktualisierung mehrfach abfragt.
        let schluessel = '';
        let lagen: [number, number][] = [];
        const lagenVon = (z: LaborZustand) => {
          const s = JSON.stringify([z.pfeile.map((a) => [a.von, a.bis, a.sichtbar]), z.punkte.map((p) => p.p)]);
          if (s !== schluessel) {
            lagen = laborLagen(z);
            schluessel = s;
          }
          return lagen;
        };
        z0.punkte.forEach((pt, i) =>
          b.create('text', [() => xmin + lagenVon(lies())[i]![0] * (xmax - xmin), () => ymin + lagenVon(lies())[i]![1] * (ymax - ymin), pt.name], { ...stil, strokeColor: SCHWARZ, anchorX: 'middle', anchorY: 'middle', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' }),
        );
        return (z: LaborZustand) => {
          segmente.forEach((s, i) => s.setAttribute({ visible: z.pfeile[i]!.sichtbar }));
        };
      }}
    />
  );
}
