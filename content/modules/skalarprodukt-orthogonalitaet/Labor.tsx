import { useState } from 'react';
import { Dimensionswahl, koordinatenRegler, type Dimension } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Laborbrett, type LaborPfeil, type LaborZustand } from '@/components/Laborbrett';
import { Raumbild } from '@/components/Raumbild';
import { klammer, spalte, wortKoordinaten } from '@/lib/laborhilfen';
import { t, zt } from '@/lib/modulhilfen';
import type { Punkt3, RaumBildSpec } from '@/lib/schraegbild';
import { betrag, skalarprodukt, winkel, type Vek } from '@/lib/vektor';
import type { Punkt2 } from '@/lib/vektorbild';
import { BLAU, LABOR_GRENZE_EBENE, LABOR_GRENZE_RAUM, ORANGE, WINKEL_START } from './daten';

const rund2 = (x: number) => Math.round(x * 100) / 100;
const O2: Punkt2 = [0, 0];
const O3: Punkt3 = [0, 0, 0];
const pf = (bis: Punkt2, farbe: string, breite: number): LaborPfeil => ({ von: O2, bis, farbe, breite, sichtbar: true });

/** Winkel als TeX mit Dezimalkomma und Gradzeichen. */
export const winkelTeX = (w: number): string => `${zt(rund2(w) + 0)}^{\\circ}`;

export function winkelZustand2(a: Vek, b: Vek): LaborZustand {
  return { pfeile: [pf(b as Punkt2, BLAU, 4.5), pf(a as Punkt2, ORANGE, 2.5)], punkte: [{ name: 'O', p: O2 }, { name: 'A', p: a as Punkt2 }, { name: 'B', p: b as Punkt2 }] };
}
export function winkelBild3(a: Vek, b: Vek): RaumBildSpec {
  return {
    sprech: `Schrägbild mit dem Ursprung O. Der orange Pfeil führt von O zum Punkt A bei ${wortKoordinaten(a)}, der blaue, dickere Pfeil zum Punkt B bei ${wortKoordinaten(b)}.`,
    punkte: [{ name: 'O', p: O3 }, { name: 'A', p: a as Punkt3 }, { name: 'B', p: b as Punkt3 }],
    linien: [{ von: O3, bis: b as Punkt3, farbe: BLAU, breite: 4.5, pfeil: true }, { von: O3, bis: a as Punkt3, farbe: ORANGE, pfeil: true }],
  };
}

/**
 * Labor zu Skalarprodukt und Winkel: Zwei Vektoren a und b werden mit Reglern eingestellt, in der Ebene oder im Raum. Das Bild zeigt beide Pfeile vom Ursprung.
 * Unter dem Bild stehen das Skalarprodukt und der Winkel. Die Rechnung mit den Beträgen und dem Kosinus lässt sich einblenden.
 */
export function Winkellabor() {
  const [dim, setDim] = useState<Dimension>(2);
  const [a2, setA2] = useState<number[]>(WINKEL_START.a2);
  const [b2, setB2] = useState<number[]>(WINKEL_START.b2);
  const [a3, setA3] = useState<number[]>(WINKEL_START.a3);
  const [b3, setB3] = useState<number[]>(WINKEL_START.b3);
  const [rechnung, setRechnung] = useState(false);
  const a = dim === 2 ? a2 : a3;
  const b = dim === 2 ? b2 : b3;
  const g = dim === 2 ? LABOR_GRENZE_EBENE : LABOR_GRENZE_RAUM;
  const sp = skalarprodukt(a, b);
  const w = winkel(a, b);
  const na = betrag(a);
  const nb = betrag(b);
  const beschreibung = `Koordinatensystem mit dem Ursprung O. Der orange Pfeil führt von O zum Punkt A bei ${wortKoordinaten(a)}, der blaue, dickere Pfeil zum Punkt B bei ${wortKoordinaten(b)}. Das Skalarprodukt ist ${wortKoordinaten([sp])}${w === null ? '. Ein Vektor ist der Nullvektor, der Winkel ist nicht definiert.' : `, der Winkel beträgt etwa ${wortKoordinaten([rund2(w)])} Grad.`}`;
  return (
    <div className="labor">
      <Dimensionswahl wert={dim} onChange={setDim} />
      {dim === 2 ? <Laborbrett zustand={winkelZustand2(a, b)} beschreibung={beschreibung} /> : <Raumbild spec={winkelBild3(a, b)} />}
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeil des Vektors <Formel tex={t`\vec{a}`} /> von <Formel tex="O" /> nach <Formel tex="A" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Pfeil des Vektors <Formel tex={t`\vec{b}`} /> von <Formel tex="O" /> nach <Formel tex="B" /> (breiter darunter gezeichnet)</li>
      </ul>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('a', 'a', a, g, dim === 2 ? setA2 : setA3)}</div>
        <div className="regler-gruppe">{koordinatenRegler('b', 'b', b, g, dim === 2 ? setB2 : setB3)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Rechnung einblenden</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\vec{a}=${spalte(a)},\quad \vec{b}=${spalte(b)}`} />
        <Formel anzeige tex={t`\vec{a}\cdot\vec{b}=${zt(sp)}`} />
        {w === null ? <p className="klein">Ein Vektor ist der Nullvektor, der Winkel ist nicht definiert.</p> : <Formel anzeige tex={t`\alpha\approx ${winkelTeX(w)}`} />}
        {rechnung && (
          <>
            <Formel anzeige tex={t`\begin{aligned}\vec{a}\cdot\vec{b}&=${a.map((x, i) => `${klammer(x)}\\cdot ${klammer(b[i]!)}`).join('+')}\\&=${zt(sp)}\end{aligned}`} />
            {w !== null && (
              <>
                <Formel anzeige tex={t`|\vec{a}|\approx ${zt(rund2(na))},\quad |\vec{b}|\approx ${zt(rund2(nb))}`} />
                <Formel anzeige tex={t`\cos\alpha=\frac{\vec{a}\cdot\vec{b}}{|\vec{a}|\cdot|\vec{b}|}\approx ${zt(Math.round((sp / (na * nb)) * 1000) / 1000)}`} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
