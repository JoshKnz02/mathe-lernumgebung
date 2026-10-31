import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { useDarstellung } from '@/components/Raumbild';
import { Raumbild } from '@/components/Raumbild';
import { zt } from '@/lib/modulhilfen';
import { gleichesBild, hilfsweg, lageText, type Punkt3, type RaumBildSpec } from '@/lib/schraegbild';
import { GRENZE, ORANGE, PUNKTLABOR_START } from './daten';

/** Ein Punkt als TeX mit Dezimalkomma, zum Beispiel P(3 | 2,5 | −1). */
export const punktMitKomma = (name: string, p: number[]) => `${name}(${p.map((x) => zt(x)).join('\\,|\\,')})`;

/** Das Bild des Punktlabors: der Punkt, auf Wunsch Hilfsweg, Koordinatenebenen und alle Punkte mit demselben Bild. */
export function punktlaborSpec(p: Punkt3, weg: boolean, ebenen: boolean, gleich: boolean): RaumBildSpec {
  const andere = gleich ? gleichesBild(p) : [];
  return {
    sprech: `Schrägbild mit dem Punkt P bei ${p.join(', ')}.${weg ? ' Gestrichelt ist der Weg vom Ursprung zu P eingezeichnet.' : ''}${ebenen ? ' Die drei Koordinatenebenen sind als durchsichtige Flächen eingeblendet.' : ''}${andere.length ? ` Offene Kreise zeigen ${andere.length} weitere Punkte, die im Bild an derselben Stelle liegen.` : ''}`.replace(/-(\d)/g, 'minus $1'),
    punkte: [{ name: 'P', p }, ...andere.map((q, i): { name: string; p: Punkt3; offen: true; ohneText: true } => ({ name: `Q${i + 1}`, p: q, offen: true, ohneText: true }))],
    linien: weg ? hilfsweg(p, ORANGE) : [],
    ebenen: ebenen ? ['e12', 'e13', 'e23'] : [],
  };
}

/**
 * Labor zum Koordinatensystem im Raum: Die drei Koordinaten von P werden mit Reglern eingestellt. Das Schrägbild zeigt den Punkt, auf Wunsch den Weg
 * vom Ursprung, die Koordinatenebenen und alle weiteren Punkte, die im Bild an derselben Stelle liegen. Darunter steht die Lage von P.
 */
export function Punktlabor() {
  const [p, setP] = useState<Punkt3>(PUNKTLABOR_START);
  const [weg, setWeg] = useState(true);
  const [ebenen, setEbenen] = useState(false);
  const [gleich, setGleich] = useState(false);
  const andere = gleich ? gleichesBild(p) : [];
  const raum = useDarstellung() === 'raum';
  const setze = (i: number, x: number) => setP((q) => q.map((v, j) => (j === i ? x : v)) as Punkt3);
  const regler = (i: number) => (
    <Regler key={i} name={`Koordinate p${i + 1}`} beschriftung={<Formel tex={`p_${i + 1}`} />} wert={p[i]!} min={-GRENZE} max={GRENZE} step={0.5} onChange={(x) => setze(i, x)} anzeige={<Formel tex={zt(p[i]!)} />} />
  );
  return (
    <div className="labor">
      <Raumbild spec={punktlaborSpec(p, weg, ebenen, gleich)} />
      <div className="labor-bedienung">
        <div className="regler-gruppe">{[0, 1, 2].map(regler)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={weg} onChange={(e) => setWeg(e.target.checked)} /> Weg zum Punkt</label>
          <label className="schalter"><input type="checkbox" checked={ebenen} onChange={(e) => setEbenen(e.target.checked)} /> Koordinatenebenen</label>
          <label className="schalter"><input type="checkbox" checked={gleich} onChange={(e) => setGleich(e.target.checked)} /> Gleiche Stelle im Schrägbild</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={punktMitKomma('P', p)} />
        <p className="klein">{lageText(p)}</p>
        {gleich && raum && andere.length > 0 && (
          <p className="klein">In der räumlichen Ansicht liegen die offenen Kreise auf einer Geraden durch <Formel tex="P" nach="." /> Drehe die Ansicht: Erst im Schrägbild fallen sie mit <Formel tex="P" /> zusammen.</p>
        )}
        {gleich && (
          <p className="klein">
            {andere.length === 0 ? 'Im Bereich von −4 bis 4 gibt es keinen weiteren Punkt an derselben Stelle im Schrägbild.' : 'Weitere Punkte an derselben Stelle im Schrägbild (offene Kreise):'}
          </p>
        )}
        {andere.length > 0 && (
          <ul className="liste-ohne-zahl">
            {andere.map((q) => (
              <li key={q.join(',')}>
                <Formel tex={punktMitKomma('Q', q)} nach="." />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
