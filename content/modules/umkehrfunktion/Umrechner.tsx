import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Rechenkette } from '@/components/Rechenkette';
import { Regler } from '@/components/Regler';
import { zahlTex, zahlText } from '@/lib/zahlen';
import { TEMPERATUR } from './daten';

/**
 * Hin und zurück am Beispiel Celsius und Fahrenheit: Der Weg von Celsius zu Fahrenheit besteht aus zwei Rechenschritten.
 * Zurück geht man dieselben Schritte rückwärts, jeweils mit der Gegenoperation.
 */
export function Umrechner() {
  const [c, setC] = useState(20);
  const f = TEMPERATUR.F(c);
  const zwischen = 1.8 * c;
  return (
    <div className="labor">
      <Regler name="Temperatur in Grad Celsius" beschriftung={<Formel tex="C" />} wert={c} min={-40} max={100} step={5} onChange={setC} anzeige={<Formel tex={`${zahlTex(c)}\\,^\\circ\\text{C}`} />} />
      <p><strong>Hin:</strong> von Celsius nach Fahrenheit</p>
      <Rechenkette
        eingabe={<Formel tex={`C=${zahlTex(c)}`} />}
        schritte={[
          { name: <>mal 1,8</>, vorschrift: <Formel tex={String.raw`\cdot 1{,}8`} />, ergebnis: <Formel tex={zahlTex(zwischen)} /> },
          { name: <>plus 32</>, vorschrift: <Formel tex="+32" />, ergebnis: <Formel tex={`F=${zahlTex(f)}`} /> },
        ]}
        beschreibung={`${zahlText(c)} Grad Celsius mal 1,8 ergibt ${zahlText(zwischen)}, plus 32 ergibt ${zahlText(f)} Grad Fahrenheit.`}
      />
      <p><strong>Zurück:</strong> von Fahrenheit nach Celsius, die Schritte rückwärts mit der Gegenoperation</p>
      <Rechenkette
        eingabe={<Formel tex={`F=${zahlTex(f)}`} />}
        schritte={[
          { name: <>minus 32</>, vorschrift: <Formel tex="-32" />, ergebnis: <Formel tex={zahlTex(zwischen)} /> },
          { name: <>geteilt durch 1,8</>, vorschrift: <Formel tex={String.raw`:\,1{,}8`} />, ergebnis: <Formel tex={`C=${zahlTex(c)}`} /> },
        ]}
        beschreibung={`${zahlText(f)} Grad Fahrenheit minus 32 ergibt ${zahlText(zwischen)}, geteilt durch 1,8 ergibt ${zahlText(c)} Grad Celsius.`}
      />
    </div>
  );
}
