import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { spalte, wortKoordinaten } from '@/lib/laborhilfen';
import { t, zt } from '@/lib/modulhilfen';
import { RAUM_GRENZE, type Punkt3, type RaumBildSpec, type RaumLinie, type RaumPunkt } from '@/lib/schraegbild';
import { betrag, skalarprodukt, vektorprodukt, vielfaches, winkel, type Vek } from '@/lib/vektor';
import { BLAU, LABOR_GRENZE, LABOR_START, ORANGE, ROSA, SCHWARZ } from './daten';

const rund2 = (x: number) => Math.round(x * 100) / 100;
const O: Punkt3 = [0, 0, 0];
const nullvektor = (v: Vek) => v.every((x) => x === 0);

/**
 * Faktor, mit dem die Pfeile der Vektorprodukte im Bild gezeichnet werden. Bei Reglern von −2 bis 2 liegen die Koordinaten von a × b zwischen −8 und 8.
 * Liegt eine Koordinate über der Grenze des Koordinatensystems im Bild, wird der Pfeil auf die Hälfte verkürzt (dann liegt er zwischen −4 und 4).
 */
export const bildFaktor = (n: Vek): number => (Math.max(...n.map(Math.abs)) > RAUM_GRENZE ? 0.5 : 1);

/** Bild des Labors: a orange, b blau (breiter darunter), a × b rosa, auf Wunsch b × a schwarz. Das Nullvektor-Produkt hat keinen Pfeil. */
export function produktBild(a: Vek, b: Vek, tausch: boolean): RaumBildSpec {
  const n = vektorprodukt(a, b);
  const m = vektorprodukt(b, a);
  const f = bildFaktor(n);
  const nBild = vielfaches(f, n) as Punkt3;
  const mBild = vielfaches(f, m) as Punkt3;
  const kein = nullvektor(n);
  const punkte: RaumPunkt[] = [{ name: 'O', p: O, ohneText: true }, { name: 'A', p: a as Punkt3 }, { name: 'B', p: b as Punkt3 }];
  const linien: RaumLinie[] = [{ von: O, bis: b as Punkt3, farbe: BLAU, breite: 4.5, pfeil: true }, { von: O, bis: a as Punkt3, farbe: ORANGE, pfeil: true }];
  if (!kein) {
    punkte.push({ name: 'N', p: nBild });
    linien.push({ von: O, bis: nBild, farbe: ROSA, pfeil: true });
    if (tausch) {
      punkte.push({ name: 'M', p: mBild });
      linien.push({ von: O, bis: mBild, farbe: SCHWARZ, pfeil: true });
    }
  }
  const halb = f < 1 ? ' Die Pfeile der Vektorprodukte sind im Bild auf die Hälfte verkürzt gezeichnet.' : '';
  return {
    sprech: `Schrägbild. Vom Ursprung aus führt der orange Pfeil zum Punkt A bei ${wortKoordinaten(a)}, der blaue, dickere Pfeil zum Punkt B bei ${wortKoordinaten(b)}. ${
      kein ? 'Das Vektorprodukt (Kreuzprodukt) ist der Nullvektor, es gibt keinen Pfeil dazu.' : `Der rosa Pfeil zum Punkt N zeigt das Vektorprodukt (Kreuzprodukt) a mal b${tausch ? ', der schwarze Pfeil zum Punkt M das Vektorprodukt (Kreuzprodukt) b mal a' : ''}.${halb}`
    }`,
    punkte,
    linien,
  };
}

/**
 * Labor zum Vektorprodukt (Kreuzprodukt) (nur im Raum): a und b werden mit Reglern von −2 bis 2 eingestellt. Das Bild zeigt a, b und a × b.
 * Zahlen (Rechnung, Probe), das vertauschte Produkt und der Betrag lassen sich einblenden.
 */
export function Vektorproduktlabor() {
  const [a, setA] = useState<number[]>(LABOR_START.a);
  const [b, setB] = useState<number[]>(LABOR_START.b);
  const [rechnung, setRechnung] = useState(false);
  const [tausch, setTausch] = useState(false);
  const [betragAn, setBetragAn] = useState(false);
  const n = vektorprodukt(a, b);
  const m = vektorprodukt(b, a);
  const kein = nullvektor(n);
  const f = bildFaktor(n);
  const w = winkel(a, b);
  const na = betrag(a);
  const nb = betrag(b);
  const nn = betrag(n);
  return (
    <div className="labor">
      <Raumbild spec={produktBild(a, b, tausch)} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeil des Vektors <Formel tex={t`\vec{a}`} /> vom Ursprung nach <Formel tex="A" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Pfeil des Vektors <Formel tex={t`\vec{b}`} /> vom Ursprung nach <Formel tex="B" /> (breiter darunter gezeichnet)</li>
        <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> Pfeil des Vektorprodukts (Kreuzprodukt) <Formel tex={t`\vec{a}\times\vec{b}`} /> vom Ursprung nach <Formel tex="N" /></li>
        {tausch && <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Pfeil des Vektorprodukts (Kreuzprodukt) <Formel tex={t`\vec{b}\times\vec{a}`} /> vom Ursprung nach <Formel tex="M" /></li>}
      </ul>
      {f < 1 && !kein && <p className="klein">Die Pfeile der Vektorprodukte sind hier auf die Hälfte verkürzt gezeichnet, damit sie ins Koordinatensystem passen. Die Richtung ist richtig.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('a', 'a', a, LABOR_GRENZE, setA)}</div>
        <div className="regler-gruppe">{koordinatenRegler('b', 'b', b, LABOR_GRENZE, setB)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Rechnung und Probe zeigen</label>
          <label className="schalter"><input type="checkbox" checked={tausch} onChange={(e) => setTausch(e.target.checked)} /> Auch b × a zeigen</label>
          <label className="schalter"><input type="checkbox" checked={betragAn} onChange={(e) => setBetragAn(e.target.checked)} /> Betrag prüfen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\vec{a}=${spalte(a)},\quad \vec{b}=${spalte(b)}`} />
        {rechnung && (
          <>
            {kein ? <p className="klein">Das Vektorprodukt (Kreuzprodukt) ist der Nullvektor. Es gibt keinen Pfeil, der auf beiden Vektoren senkrecht steht.</p> : null}
            <Formel anzeige tex={t`\vec{a}\times\vec{b}=${spalte(n)}`} />
            <Formel anzeige tex={t`(\vec{a}\times\vec{b})\cdot\vec{a}=${zt(skalarprodukt(n, a))}`} />
            <Formel anzeige tex={t`(\vec{a}\times\vec{b})\cdot\vec{b}=${zt(skalarprodukt(n, b))}`} />
          </>
        )}
        {tausch && rechnung && <Formel anzeige tex={t`\vec{b}\times\vec{a}=${spalte(m)}`} />}
        {betragAn &&
          (w === null ? (
            <p className="klein">Ein Vektor ist der Nullvektor. Es gibt keinen Winkel, das Vektorprodukt (Kreuzprodukt) ist der Nullvektor.</p>
          ) : (
            <>
              <Formel anzeige tex={t`|\vec{a}|\approx ${zt(rund2(na))},\quad |\vec{b}|\approx ${zt(rund2(nb))}`} />
              <Formel anzeige tex={t`\alpha\approx ${zt(rund2(w))}^{\circ}`} />
              <Formel anzeige tex={t`|\vec{a}|\cdot|\vec{b}|\cdot\sin\alpha\approx ${zt(rund2(na * nb * Math.sin((w * Math.PI) / 180)))}`} />
              <Formel anzeige tex={t`|\vec{a}\times\vec{b}|\approx ${zt(rund2(nn))}`} />
            </>
          ))}
      </div>
    </div>
  );
}
