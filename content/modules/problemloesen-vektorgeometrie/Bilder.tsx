import { ebeneAusKoordinatenform } from '@/lib/spurhilfen';
import { ebenenFlaeche } from '@/lib/ebenenbild';
import { gleichesBild, type Punkt3, type RaumBildSpec, type RaumLinie, type RaumPunkt } from '@/lib/schraegbild';
import { koordinatensumme, mittelpunkt, umlaufAb } from '@/lib/permutation';
import { wortKoordinaten } from '@/lib/laborhilfen';
import { BILD_P, BILD_PUNKT, BLAU, ORANGE, ROSA, SCHWARZ, bildGerade } from './daten';

const sp = (v: number[]) => wortKoordinaten(v);

export interface PermutationBildOptionen {
  /** Die Seiten verbinden (Sechseck bzw. Dreieck). */
  figur?: boolean;
  /** Die Ebene x₁ + x₂ + x₃ = s als graue Fläche. */
  ebene?: boolean;
  /** Der Mittelpunkt M mit gestrichelten Strecken zu allen Punkten. */
  mittelpunkt?: boolean;
  /** Die Raumdiagonale als orange Gerade (nur sinnvoll in der räumlichen Ansicht, im Schrägbild liegt sie auf dem Bild der x₁-Achse). */
  diagonale?: boolean;
  /** Gegenüberliegende Seiten in je einer Farbe (orange, blau, rosa) statt schwarz. */
  gegenseiten?: boolean;
}

/**
 * Raumbild zum Vertauschen der Koordinaten von P: die entstehenden Punkte P₁ bis P₆ (P₁ ist P selbst) in der Reihenfolge auf dem Kreis,
 * auf Wunsch mit Sechseck, Ebene, Mittelpunkt und Raumdiagonale.
 */
export function permutationBild(p: Punkt3, o: PermutationBildOptionen = {}): RaumBildSpec {
  const u = umlaufAb(p);
  const n = u.length;
  const s = koordinatensumme(p);
  const punkte: RaumPunkt[] = u.map((q, i) => ({ name: `P${i + 1}`, p: q }));
  const linien: RaumLinie[] = [];
  const farben = [ORANGE, BLAU, ROSA];
  if (o.figur && n >= 3) {
    for (let i = 0; i < n; i++) {
      const gegen = n === 6 && o.gegenseiten;
      linien.push({ von: u[i]!, bis: u[(i + 1) % n]!, farbe: gegen ? farben[i % 3]! : SCHWARZ, breite: gegen ? 3 : 2 });
    }
  }
  let flaechen: NonNullable<RaumBildSpec['flaechen']> = [];
  if (o.ebene && n >= 3) {
    const e = ebenenFlaeche(ebeneAusKoordinatenform({ n: [1, 1, 1], d: s }));
    flaechen = e.flaechen;
    linien.unshift(...e.linien);
  }
  const m = mittelpunkt(p);
  if (o.mittelpunkt) {
    punkte.push({ name: 'M', p: m });
    for (const q of u) linien.push({ von: m, bis: q, farbe: SCHWARZ, breite: 1.4, gestrichelt: true });
  }
  if (o.diagonale) linien.push({ von: [-4, -4, -4], bis: [4, 4, 4], farbe: ORANGE, breite: 2 });
  const beschr: string[] = [`Die ${n === 1 ? 'Koordinaten sind alle gleich, es entsteht nur ein Punkt' : `${n} Punkte, die beim Vertauschen der Koordinaten von P entstehen`}, P1 ist P selbst.`];
  if (o.figur && n >= 3) beschr.push(n === 6 ? 'Sie sind der Reihe nach zu einem Sechseck verbunden.' : 'Sie sind zu einem Dreieck verbunden.');
  if (o.gegenseiten && n === 6) beschr.push('Gegenüberliegende Seiten haben dieselbe Farbe, sie sind parallel.');
  if (o.ebene) beschr.push(`Die graue Fläche ist die Ebene x1 plus x2 plus x3 gleich ${sp([s])}.`);
  if (o.mittelpunkt) beschr.push(`Der Mittelpunkt M liegt bei ${sp(m)}, gestrichelte Strecken führen zu allen Punkten.`);
  if (o.diagonale) beschr.push('Die orange Gerade ist die Raumdiagonale, sie steht senkrecht auf der Ebene.');
  return { sprech: `Schrägbild. ${beschr.join(' ')}`, punkte, linien, flaechen, ebenenNamen: false, fein: true };
}

/**
 * Bild zur Schrägbild-Aufgabe: der Punkt P und weitere Punkte mit demselben Bild als offene Kreise (ohne Beschriftung). In der räumlichen Ansicht
 * liegen sie auf der orangen Geraden, im Schrägbild fallen sie zusammen und die Gerade würde zu einem Punkt (sie wird dort nicht gezeichnet).
 */
export function bildpunktBild(p: Punkt3, mitGerade: boolean, mitAnderen: boolean): RaumBildSpec {
  const andere = mitAnderen ? gleichesBild(p) : [];
  const linien: RaumLinie[] = mitGerade ? [{ von: bildGerade(-4), bis: bildGerade(4), farbe: ORANGE, breite: 2 }] : [];
  return {
    sprech: `Schrägbild mit dem Punkt P bei ${sp(p)}. Im Bild liegt er an der Stelle X gleich ${sp([BILD_PUNKT.X])}, Y gleich ${sp([BILD_PUNKT.Y])}.${andere.length ? ` Offene Kreise zeigen ${andere.length} weitere Punkte, die im Schrägbild an derselben Stelle liegen.` : ''}${mitGerade ? ' Die orange Gerade verbindet alle Punkte mit demselben Bild.' : ''}`,
    punkte: [{ name: 'P', p }, ...andere.map((q, i): RaumPunkt => ({ name: `Q${i + 1}`, p: q, offen: true, ohneText: true }))],
    linien,
    ebenenNamen: false,
    fein: true,
  };
}



