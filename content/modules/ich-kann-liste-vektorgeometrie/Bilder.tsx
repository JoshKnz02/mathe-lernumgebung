import { BLAU, ORANGE, SCHWARZ, type MessbildDaten } from '@/components/Messbild';
import { punkt } from '@/lib/geradenbild';
import { EBENEN_TEXTFARBE, quaderKanten, type RaumBildSpec } from '@/lib/schraegbild';
import { vektorBild } from '@/lib/vektorbild';
import { K1, K3, K32 } from './werte';

/** Aussage 1: Quader mit O und G, die Ecken F und B und der Vektor von F nach B (orange). */
export const BILD_K1: RaumBildSpec = {
  sprech: 'Schrägbild eines Quaders, dessen Kanten auf den Koordinatenachsen liegen, mit den Ecken O, F, B und G. Der orange Pfeil führt von F nach B.',
  punkte: [punkt('O', [0, 0, 0]), punkt('F', K1.F), punkt('B', K1.B), punkt('G', K1.G)],
  linien: [...quaderKanten([0, 0, 0], K1.G), { von: K1.F, bis: K1.B, farbe: ORANGE, breite: 3, pfeil: true }],
};

/** Aussage 3: c = 2a − b als 2a (blau) und dann −b (orange), das Ergebnis c (schwarz) vom Ursprung. */
export const BILD_K3: MessbildDaten = vektorBild({
  bereich: [-2, 6, -4, 4],
  className: 'brett-quadrat',
  xTitel: 'x₁',
  yTitel: 'x₂',
  sprech: 'Koordinatensystem mit Raster. Der blaue Pfeil 2a führt vom Ursprung nach rechts 4 und oben 2. An seine Spitze schließt der orange Pfeil minus b an, er führt 1 nach rechts und 3 nach unten. Der schwarze Pfeil c führt vom Ursprung zur Spitze des orangen Pfeils, 5 nach rechts und 1 nach unten.',
  pfeile: [
    { von: [0, 0], bis: [2 * K3.a[0]!, 2 * K3.a[1]!], farbe: BLAU, text: '2a' },
    { von: [2 * K3.a[0]!, 2 * K3.a[1]!], bis: [K3.c[0]!, K3.c[1]!], farbe: ORANGE, text: '−b' },
    { von: [0, 0], bis: [K3.c[0]!, K3.c[1]!], farbe: SCHWARZ, text: 'c' },
  ],
});

/** Aussage 32: Das Spurdreieck der Ebene mit den Spurpunkten und den drei Spurgeraden in den Farben ihrer Koordinatenebenen. */
export const BILD_K32: RaumBildSpec = {
  sprech: 'Schrägbild des Koordinatensystems mit einer grauen Dreiecksfläche. Ihre Ecken sind die Spurpunkte S1 auf der x1-Achse, S2 auf der x2-Achse und S3 auf der x3-Achse. Die Seiten des Dreiecks sind die Spurgeraden, jeweils in der Farbe ihrer Koordinatenebene.',
  punkte: [
    { name: 'S₁', p: K32.S1 },
    { name: 'S₂', p: K32.S2 },
    { name: 'S₃', p: K32.S3 },
  ],
  flaechen: [{ ecken: [K32.S1, K32.S2, K32.S3], farbe: '#8A8A8A', deckkraft: 0.3 }],
  linien: [
    { von: K32.S1, bis: K32.S2, farbe: EBENEN_TEXTFARBE.e12, breite: 3 },
    { von: K32.S1, bis: K32.S3, farbe: EBENEN_TEXTFARBE.e13, breite: 3 },
    { von: K32.S2, bis: K32.S3, farbe: EBENEN_TEXTFARBE.e23, breite: 3 },
  ],
};
