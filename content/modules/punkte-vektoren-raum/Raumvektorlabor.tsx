import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Schraegbild } from '@/components/Schraegbild';
import { t } from '@/lib/modulhilfen';
import { type Punkt3, type RaumBildSpec, type RaumLinie } from '@/lib/schraegbild';
import { gegenvektor, spaltenTeX, verbindungsvektor } from '@/lib/vektor';
import { punktMitKomma } from './Punktlabor';
import { GRENZE, ORANGE, ROSA, VEKTORLABOR_START } from './daten';

/** Das Bild des Vektorlabors: A, B, der Pfeil von A nach B, auf Wunsch der Weg in drei Schritten und der Ortsvektor von B. */
export function vektorlaborSpec(a: Punkt3, b: Punkt3, drei: boolean, orts: boolean): RaumBildSpec {
  const e1: Punkt3 = [b[0], a[1], a[2]];
  const e2: Punkt3 = [b[0], b[1], a[2]];
  const weg: RaumLinie[] = drei
    ? [
        { von: a, bis: e1, farbe: '#222222', gestrichelt: true },
        { von: e1, bis: e2, farbe: '#222222', gestrichelt: true },
        { von: e2, bis: b, farbe: '#222222', gestrichelt: true },
      ]
    : [];
  return {
    sprech: `Schrägbild mit den Punkten A bei ${a.join(', ')} und B bei ${b.join(', ')}. Der orange Pfeil führt von A nach B.${drei ? ' Der gestrichelte Weg führt in drei Schritten von A nach B, nacheinander parallel zur x1-Achse, zur x2-Achse und zur x3-Achse.' : ''}${orts ? ' Der rosa Pfeil führt vom Ursprung O nach B.' : ''}`.replace(/-(\d)/g, 'minus $1'),
    punkte: [{ name: 'A', p: a }, { name: 'B', p: b }, ...(orts ? [{ name: 'O', p: [0, 0, 0] as Punkt3 }] : [])],
    linien: [...weg, { von: a, bis: b, farbe: ORANGE, pfeil: true }, ...(orts ? [{ von: [0, 0, 0] as Punkt3, bis: b, farbe: ROSA, pfeil: true }] : [])],
  };
}

/**
 * Labor zum Vektor im Raum: Die Koordinaten von A und B werden mit Reglern eingestellt. Das Schrägbild zeigt den Pfeil von A nach B, auf Wunsch den Weg
 * in drei achsenparallelen Schritten und den Ortsvektor von B. Darunter stehen die Koordinaten von AB und BA, die Rechnung lässt sich einblenden.
 */
export function Raumvektorlabor() {
  const [a, setA] = useState<Punkt3>(VEKTORLABOR_START.a);
  const [b, setB] = useState<Punkt3>(VEKTORLABOR_START.b);
  const [drei, setDrei] = useState(false);
  const [orts, setOrts] = useState(false);
  const [rechnung, setRechnung] = useState(false);
  const ab = verbindungsvektor(a, b);
  const ba = gegenvektor(ab);
  const klammer = (x: number) => (x < 0 ? `(${x})` : String(x));
  const regler = (name: 'A' | 'B', v: Punkt3, set: (p: Punkt3) => void) =>
    [0, 1, 2].map((i) => (
      <Regler
        key={`${name}${i}`}
        name={`Koordinate ${i + 1} von ${name}`}
        beschriftung={<Formel tex={`${name.toLowerCase()}_${i + 1}`} />}
        wert={v[i]!}
        min={-GRENZE}
        max={GRENZE}
        step={1}
        onChange={(x) => set(v.map((y, j) => (j === i ? x : y)) as Punkt3)}
        anzeige={<Formel tex={String(v[i])} />}
      />
    ));
  return (
    <div className="labor">
      <Schraegbild spec={vektorlaborSpec(a, b, drei, orts)} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeil von <Formel tex="A" /> nach <Formel tex="B" /></li>
        <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> Ortsvektor von <Formel tex="B" /> (wenn eingeblendet)</li>
        <li><span className="legende-farbe" style={{ background: '#222222' }} aria-hidden="true" /> Weg in drei Schritten (wenn eingeblendet)</li>
      </ul>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{regler('A', a, setA)}</div>
        <div className="regler-gruppe">{regler('B', b, setB)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={drei} onChange={(e) => setDrei(e.target.checked)} /> Weg in drei Schritten</label>
          <label className="schalter"><input type="checkbox" checked={orts} onChange={(e) => setOrts(e.target.checked)} /> Ortsvektor von B</label>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Rechnung einblenden</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={punktMitKomma('A', a)} />
        <Formel anzeige tex={punktMitKomma('B', b)} />
        <Formel anzeige tex={t`\overrightarrow{AB}=${spaltenTeX(ab)}`} />
        <Formel anzeige tex={t`\overrightarrow{BA}=${spaltenTeX(ba)}`} />
        {orts && <Formel anzeige tex={t`\overrightarrow{OB}=${spaltenTeX(b)}`} />}
        {rechnung && (
          <Formel anzeige tex={t`\begin{aligned}\overrightarrow{AB}&=\begin{pmatrix}${klammer(b[0])}-${klammer(a[0])}\\${klammer(b[1])}-${klammer(a[1])}\\${klammer(b[2])}-${klammer(a[2])}\end{pmatrix}\\&=${spaltenTeX(ab)}\end{aligned}`} />
        )}
      </div>
    </div>
  );
}
