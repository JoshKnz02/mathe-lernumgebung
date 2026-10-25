import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Rechenkette } from '@/components/Rechenkette';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { zahlTex, zahlText } from '@/lib/zahlen';
import { FARBE_UV, OELFLECK } from './daten';

const BEREICH: [number, number, number, number] = [-6.5, 6.5, -6.5, 6.5];

/**
 * Zweistufige Rechnung am Beispiel Ölfleck: Aus der Zeit t wird zuerst der Radius r(t) berechnet (Zwischenergebnis),
 * aus dem Radius dann die Fläche A(r). Das Schaubild zeigt den Fleck, der Regler verändert t.
 */
export function Oelfleck() {
  const [t, setT] = useState(4);
  const r = OELFLECK.r(t);
  const A = OELFLECK.A(r);
  return (
    <div className="labor">
      <Zeichenbrett
        bereich={BEREICH}
        xTeilung={2}
        yTeilung={2}
        xBeschriftung="zahl"
        className="brett-quadrat bild-schmal"
        beschreibung={`Kreisförmiger Ölfleck um den Ursprung nach ${zahlText(t)} Stunden mit dem Radius ${zahlText(r)} Metern und der Fläche ${zahlText(A)} Quadratmetern.`}
        zustand={{ r }}
        aufbau={(brett, lies) => {
          brett.create('circle', [[0, 0], () => lies().r], { highlight: false, fixed: true, strokeColor: FARBE_UV, strokeWidth: 3, fillColor: FARBE_UV, fillOpacity: 0.15 });
          brett.create('segment', [[0, 0], [() => lies().r, 0]], { highlight: false, fixed: true, strokeColor: '#D55E00', strokeWidth: 4 });
        }}
      />
      <Regler name="Zeit t in Stunden" beschriftung={<Formel tex="t" />} wert={t} min={0} max={9} step={0.5} onChange={setT} anzeige={<Formel tex={zahlTex(t)} />} />
      <Rechenkette
        eingabe={<Formel tex={`t=${zahlTex(t)}`} />}
        schritte={[
          { name: <Formel tex="r" />, vorschrift: <Formel tex={String.raw`r(t)=2+0{,}5\,t`} />, ergebnis: <Formel tex={`r=${zahlTex(r)}`} /> },
          { name: <Formel tex="A" />, vorschrift: <Formel tex={String.raw`A(r)=\pi\,r^2`} />, ergebnis: <Formel tex={`A\\approx ${zahlTex(A)}`} /> },
        ]}
        beschreibung={`Nach ${zahlText(t)} Stunden ist der Radius ${zahlText(r)} Meter und die Fläche etwa ${zahlText(A)} Quadratmeter.`}
      />
    </div>
  );
}
