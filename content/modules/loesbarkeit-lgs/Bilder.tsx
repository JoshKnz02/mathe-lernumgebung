import { Bild, BLAU, gerade, ORANGE, SCHWARZ, type MessbildDaten } from '@/components/Messbild';
import { Formel } from '@/components/Formel';
import { Matrixfolge } from '@/components/Matrixfolge';
import { folge, gaussSchritte, stufenMarke, type FolgeZeile, type Matrix } from '@/lib/lgs';
import { GERADEN, type Geradenfall } from './daten';

/** Matrizen nach jedem Gauß-Schritt, die letzte mit Auswertung (Pivot blau, Nullzeile grün, Widerspruchszeile rosa). */
export function folgeMitAuswertung(m: Matrix): FolgeZeile[] {
  const z = folge(m, gaussSchritte(m).map((s) => s.umformung));
  const letzte = z[z.length - 1]!;
  return [...z.slice(0, -1), { ...letzte, marke: stufenMarke(letzte.matrix) }];
}

/** Stufenform einer Matrix mit Auswertung als Bild (ohne die Schritte davor). */
export const stufenBild = (m: Matrix, beschriftung = 'Stufenform'): FolgeZeile[] => [{ matrix: m, beschriftung, marke: stufenMarke(m) }];

export function Folge({ m, beschreibung, unter }: { m: Matrix; beschreibung: string; unter: React.ReactNode }) {
  return <Matrixfolge zeilen={folgeMitAuswertung(m)} beschreibung={beschreibung} unter={unter} />;
}

const TEXT: Record<Geradenfall['id'], { unter: React.ReactNode; beschreibung: string }> = {
  eindeutig: {
    unter: (
      <>
        Die beiden Geraden schneiden sich in genau einem Punkt, <Formel tex={String.raw`(3\mid 1)`} nach="." /> Das System ist eindeutig lösbar.
      </>
    ),
    beschreibung: 'Zwei Geraden mit verschiedener Steigung schneiden sich in einem Punkt.',
  },
  unloesbar: {
    unter: <>Die beiden Geraden sind parallel und haben keinen gemeinsamen Punkt. Das System ist nicht lösbar.</>,
    beschreibung: 'Zwei verschiedene parallele Geraden ohne gemeinsamen Punkt.',
  },
  mehrdeutig: {
    unter: <>Beide Gleichungen beschreiben dieselbe Gerade. Jeder Punkt der Geraden ist eine Lösung, es gibt unendlich viele. Das System ist mehrdeutig lösbar.</>,
    beschreibung: 'Zwei Gleichungen, die dieselbe Gerade beschreiben, alle Punkte der Geraden sind Lösungen.',
  },
};

export function geradenDaten(f: Geradenfall): MessbildDaten {
  const [g1, g2] = f.geraden;
  return {
    kurven: [gerade(0, g1![1], g1![0], BLAU), gerade(0, g2![1], g2![0], SCHWARZ, true)],
    punkte: f.id === 'eindeutig' ? [{ x: 3, y: 1, farbe: ORANGE, text: 'S', lage: 'oben-rechts' }] : [],
    bereich: [-1, 6, -2, 6],
    teilung: 1,
    xTitel: 'x₁',
    yTitel: 'x₂',
    beschreibung: `${TEXT[f.id].beschreibung} Die Achsen sind x1 und x2.`,
  };
}

export function Geradenbild({ f }: { f: Geradenfall['id'] }) {
  const fall = GERADEN.find((g) => g.id === f)!;
  return <Bild daten={geradenDaten(fall)} unter={TEXT[f].unter} />;
}
