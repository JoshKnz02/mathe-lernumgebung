import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { t, zt } from '@/lib/modulhilfen';
import type { Punkt3, RaumBildSpec } from '@/lib/schraegbild';
import { faktor, gegenvektor, summe, vielfaches, type Vek } from '@/lib/vektor';
import type { Punkt2 } from '@/lib/vektorbild';
import { ADD_START, BLAU, KOLL_LABOR, LABOR_GRENZE_EBENE, LABOR_GRENZE_RAUM, ORANGE, ROSA, VIEL_START } from './daten';
import { Laborbrett, type LaborPfeil, type LaborZustand } from './Laborbrett';

export type Dimension = 2 | 3;
const O2: Punkt2 = [0, 0];
const O3: Punkt3 = [0, 0, 0];

/** Spalte in TeX, Dezimalzahlen mit Komma. */
export const spalte = (v: Vek): string => `\\begin{pmatrix}${v.map(zt).join('\\\\')}\\end{pmatrix}`;
const klammer = (x: number) => (x < 0 ? `(${zt(x)})` : zt(x));
const wortZahl = (x: number) => String(x).replace('.', ',').replace('-', 'minus ');
const wortKoordinaten = (v: Vek) => v.map(wortZahl).join(', ');

const pf2 = (von: Punkt2, bis: Punkt2, farbe: string, breite = 2.5): LaborPfeil => ({ von, bis, farbe, breite, sichtbar: true });

/** Schalter zwischen Ebene (zwei Koordinaten) und Raum (drei Koordinaten). */
export function Dimensionswahl({ wert, onChange }: { wert: Dimension; onChange: (d: Dimension) => void }) {
  const knopf = (d: Dimension, text: string, hilfe: string) => (
    <button type="button" className="chip" aria-pressed={wert === d} aria-label={hilfe} onClick={() => onChange(d)}>
      {text}
    </button>
  );
  return (
    <div className="darstellungswahl" role="group" aria-label="Ebene oder Raum wählen">
      <span className="darstellungswahl-name">Vektoren in:</span>
      {knopf(2, 'Ebene', 'Vektoren in der Ebene mit zwei Koordinaten')}
      {knopf(3, 'Raum', 'Vektoren im Raum mit drei Koordinaten')}
    </div>
  );
}

/** Regler für die Koordinaten eines Vektors. */
function koordinatenRegler(name: string, tex: string, v: number[], grenze: number, set: (v: number[]) => void) {
  return v.map((x, i) => (
    <Regler
      key={`${name}${i}`}
      name={`Koordinate ${i + 1} von ${name}`}
      beschriftung={<Formel tex={`${tex}_${i + 1}`} />}
      wert={x}
      min={-grenze}
      max={grenze}
      step={1}
      onChange={(w) => set(v.map((y, j) => (j === i ? w : y)))}
      anzeige={<Formel tex={String(x)} />}
    />
  ));
}

/* ---------- Additionslabor ---------- */

export interface AdditionsDaten {
  erster: Vek;
  zweiter: Vek;
  ersteFarbe: string;
  zweiteFarbe: string;
  ergebnis: Vek;
}
/** Die beiden Wege des Labors: a und b (bei Differenz −b), auf Wunsch in vertauschter Reihenfolge. Das Ergebnis ist in beiden Reihenfolgen gleich. */
export function additionsDaten(a: Vek, b: Vek, minus: boolean, getauscht: boolean): AdditionsDaten {
  const zweitesB = minus ? gegenvektor(b) : b;
  return {
    erster: getauscht ? zweitesB : a,
    zweiter: getauscht ? a : zweitesB,
    ersteFarbe: getauscht ? BLAU : ORANGE,
    zweiteFarbe: getauscht ? ORANGE : BLAU,
    ergebnis: summe(a, zweitesB),
  };
}
export function additionsZustand2(a: Vek, b: Vek, minus: boolean, getauscht: boolean): LaborZustand {
  const d = additionsDaten(a, b, minus, getauscht);
  const p = d.erster as Punkt2;
  const z = d.ergebnis as Punkt2;
  // Die Summe wird breiter darunter gezeichnet, damit sie auch bei parallelen Pfeilen sichtbar bleibt.
  return { pfeile: [pf2(O2, z, ROSA, 5), pf2(O2, p, d.ersteFarbe), pf2(p, z, d.zweiteFarbe)], punkte: [{ name: 'O', p: O2 }, { name: 'P', p }, { name: 'Z', p: z }] };
}
export function additionsBild3(a: Vek, b: Vek, minus: boolean, getauscht: boolean): RaumBildSpec {
  const d = additionsDaten(a, b, minus, getauscht);
  const p = d.erster as Punkt3;
  const z = d.ergebnis as Punkt3;
  return {
    sprech: `Schrägbild mit dem Ursprung O, dem Punkt P bei ${wortKoordinaten(p)} und dem Punkt Z bei ${wortKoordinaten(z)}. Der erste Pfeil führt von O nach P, der zweite von P nach Z, der rosa Pfeil direkt von O nach Z.`,
    punkte: [{ name: 'O', p: O3 }, { name: 'P', p }, { name: 'Z', p: z }],
    linien: [{ von: O3, bis: z, farbe: ROSA, breite: 5, pfeil: true }, { von: O3, bis: p, farbe: d.ersteFarbe, pfeil: true }, { von: p, bis: z, farbe: d.zweiteFarbe, pfeil: true }],
  };
}

/**
 * Labor zur Addition und Subtraktion: Zwei Vektoren a und b werden mit Reglern eingestellt, in der Ebene oder im Raum. Das Bild zeigt die Pfeile
 * aneinandergesetzt und die Summe. Auf Wunsch wird b abgezogen oder die Reihenfolge vertauscht. Die Rechnung lässt sich einblenden.
 */
export function Additionslabor() {
  const [dim, setDim] = useState<Dimension>(2);
  const [a2, setA2] = useState<number[]>(ADD_START.a2);
  const [b2, setB2] = useState<number[]>(ADD_START.b2);
  const [a3, setA3] = useState<number[]>(ADD_START.a3);
  const [b3, setB3] = useState<number[]>(ADD_START.b3);
  const [minus, setMinus] = useState(false);
  const [getauscht, setGetauscht] = useState(false);
  const [rechnung, setRechnung] = useState(false);
  const a = dim === 2 ? a2 : a3;
  const b = dim === 2 ? b2 : b3;
  const g = dim === 2 ? LABOR_GRENZE_EBENE : LABOR_GRENZE_RAUM;
  const d = additionsDaten(a, b, minus, getauscht);
  const op = minus ? '-' : '+';
  const z = additionsZustand2(a, b, minus, getauscht);
  const beschreibung = `Koordinatensystem mit dem Ursprung O, dem Punkt P bei ${wortKoordinaten(d.erster)} und dem Punkt Z bei ${wortKoordinaten(d.ergebnis)}. Der erste Pfeil führt von O nach P, der zweite von P nach Z, der rosa Pfeil direkt von O nach Z.`;
  return (
    <div className="labor">
      <Dimensionswahl wert={dim} onChange={setDim} />
      {dim === 2 ? <Laborbrett zustand={z} beschreibung={beschreibung} /> : <Raumbild spec={additionsBild3(a, b, minus, getauscht)} />}
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeil des Vektors <Formel tex={t`\vec{a}`} /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Pfeil des Vektors <Formel tex={minus ? t`-\vec{b}` : t`\vec{b}`} /></li>
        <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> Pfeil direkt von <Formel tex="O" /> nach <Formel tex="Z" /> (breiter darunter gezeichnet)</li>
      </ul>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('a', 'a', a, g, dim === 2 ? setA2 : setA3)}</div>
        <div className="regler-gruppe">{koordinatenRegler('b', 'b', b, g, dim === 2 ? setB2 : setB3)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={minus} onChange={(e) => setMinus(e.target.checked)} /> <Formel tex={t`\vec{b}`} /> abziehen</label>
          <label className="schalter"><input type="checkbox" checked={getauscht} onChange={(e) => setGetauscht(e.target.checked)} /> Reihenfolge der Pfeile vertauschen</label>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Rechnung einblenden</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\vec{a}=${spalte(a)},\quad \vec{b}=${spalte(b)}`} />
        <Formel anzeige tex={t`\vec{a}${op}\vec{b}=${spalte(d.ergebnis)}`} />
        {rechnung && (
          <Formel
            anzeige
            tex={t`\begin{aligned}\vec{a}${op}\vec{b}&=${spalte(a)}${op}${spalte(b)}\\&=\begin{pmatrix}${a.map((x, i) => `${klammer(x)}${op}${klammer(b[i]!)}`).join('\\\\')}\end{pmatrix}\\&=${spalte(d.ergebnis)}\end{aligned}`}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Vielfachenlabor und Kollinearitätslabor: zwei Pfeile vom Ursprung ---------- */

/** Zwei Pfeile vom Ursprung: a (orange) und b (blau, dicker darunter gezeichnet, damit er bei gleicher Richtung sichtbar bleibt). */
export function zweiPfeileZustand2(a: Vek, b: Vek, nameB: string): LaborZustand {
  return { pfeile: [pf2(O2, b as Punkt2, BLAU, 5), pf2(O2, a as Punkt2, ORANGE)], punkte: [{ name: 'O', p: O2 }, { name: 'P', p: a as Punkt2 }, { name: nameB, p: b as Punkt2 }] };
}
export function zweiPfeileBild3(a: Vek, b: Vek, nameB: string, sprechB: string): RaumBildSpec {
  return {
    sprech: `Schrägbild mit dem Ursprung O. Der orange Pfeil führt von O nach P bei ${wortKoordinaten(a)}, der blaue, dickere Pfeil von O nach ${nameB} bei ${wortKoordinaten(b)}. ${sprechB}`,
    punkte: [{ name: 'O', p: O3 }, { name: 'P', p: a as Punkt3 }, { name: nameB, p: b as Punkt3 }],
    linien: [{ von: O3, bis: b as Punkt3, farbe: BLAU, breite: 5, pfeil: true }, { von: O3, bis: a as Punkt3, farbe: ORANGE, pfeil: true }],
  };
}

/**
 * Labor zu Vielfachen: Der Vektor a und die Zahl r lassen sich einstellen. Das Bild zeigt a (orange) und r · a (blau, breiter darunter gezeichnet).
 */
export function Vielfachenlabor() {
  const [dim, setDim] = useState<Dimension>(2);
  const [a2, setA2] = useState<number[]>(VIEL_START.a2);
  const [a3, setA3] = useState<number[]>(VIEL_START.a3);
  const [r, setR] = useState(VIEL_START.r);
  const [rechnung, setRechnung] = useState(false);
  const a = dim === 2 ? a2 : a3;
  const g = dim === 2 ? LABOR_GRENZE_EBENE : LABOR_GRENZE_RAUM;
  const ra = vielfaches(r, a);
  const beschreibung = `Koordinatensystem mit dem Ursprung O. Der orange Pfeil führt von O nach P bei ${wortKoordinaten(a)}, der blaue, dickere Pfeil von O nach Q bei ${wortKoordinaten(ra)}. Der Faktor ist ${wortZahl(r)}.`;
  return (
    <div className="labor">
      <Dimensionswahl wert={dim} onChange={setDim} />
      {dim === 2 ? <Laborbrett zustand={zweiPfeileZustand2(a, ra, 'Q')} beschreibung={beschreibung} /> : <Raumbild spec={zweiPfeileBild3(a, ra, 'Q', `Der Faktor ist ${wortZahl(r)}.`)} />}
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeil des Vektors <Formel tex={t`\vec{a}`} /> von <Formel tex="O" /> nach <Formel tex="P" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Pfeil des Vektors <Formel tex={t`r\cdot\vec{a}`} /> von <Formel tex="O" /> nach <Formel tex="Q" /> (breiter darunter gezeichnet)</li>
      </ul>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('a', 'a', a, g, dim === 2 ? setA2 : setA3)}</div>
        <div className="regler-gruppe">
          <Regler name="Faktor r" beschriftung={<Formel tex="r" />} wert={r} min={-2} max={2} step={0.5} onChange={setR} anzeige={<Formel tex={zt(r)} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Rechnung einblenden</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\vec{a}=${spalte(a)},\quad r=${zt(r)}`} />
        <Formel anzeige tex={t`r\cdot\vec{a}=${spalte(ra)}`} />
        {rechnung && <Formel anzeige tex={t`\begin{aligned}r\cdot\vec{a}&=${klammer(r)}\cdot${spalte(a)}\\&=\begin{pmatrix}${a.map((x) => `${klammer(r)}\\cdot ${klammer(x)}`).join('\\\\')}\end{pmatrix}\\&=${spalte(ra)}\end{aligned}`} />}
      </div>
    </div>
  );
}

/**
 * Labor zur Kollinearität: Der Vektor a ist fest, die Koordinaten von b werden eingestellt. Das Bild zeigt beide Pfeile vom Ursprung. Auf Wunsch
 * erscheinen die Quotienten der Koordinaten und die Antwort, ob b ein Vielfaches von a ist.
 */
export function Kollinearitaetslabor() {
  const [dim, setDim] = useState<Dimension>(2);
  const [b2, setB2] = useState<number[]>(KOLL_LABOR.b2);
  const [b3, setB3] = useState<number[]>(KOLL_LABOR.b3);
  const [rechnung, setRechnung] = useState(false);
  const a: Vek = dim === 2 ? KOLL_LABOR.a2 : KOLL_LABOR.a3;
  const b = dim === 2 ? b2 : b3;
  const r = faktor(a, b);
  const beschreibung = `Koordinatensystem mit dem Ursprung O. Der orange Pfeil führt von O nach P bei ${wortKoordinaten(a)}, der blaue, dickere Pfeil von O nach Q bei ${wortKoordinaten(b)}.`;
  return (
    <div className="labor">
      <Dimensionswahl wert={dim} onChange={setDim} />
      {dim === 2 ? <Laborbrett zustand={zweiPfeileZustand2(a, b, 'Q')} beschreibung={beschreibung} /> : <Raumbild spec={zweiPfeileBild3(a, b, 'Q', '')} />}
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeil des festen Vektors <Formel tex={t`\vec{a}`} /> von <Formel tex="O" /> nach <Formel tex="P" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Pfeil des Vektors <Formel tex={t`\vec{b}`} /> von <Formel tex="O" /> nach <Formel tex="Q" /> (breiter darunter gezeichnet)</li>
      </ul>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('b', 'b', b, KOLL_LABOR.grenze, dim === 2 ? setB2 : setB3)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Rechnung einblenden</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\vec{a}=${spalte(a)},\quad \vec{b}=${spalte(b)}`} />
        {rechnung && (
          <>
            <Formel anzeige tex={t`\begin{aligned}${b.map((x, i) => `b_${i + 1}:a_${i + 1}&=${zt(x)}:${klammer(a[i]!)}=${zt(x / a[i]!)}`).join('\\\\')}\end{aligned}`} />
            <p className="klein">
              {r === null ? (
                <>Die Quotienten sind nicht alle gleich. <Formel tex={t`\vec{b}`} /> ist kein Vielfaches von <Formel tex={t`\vec{a}`} nach="." /> Die beiden Pfeile liegen nicht auf einer Geraden durch <Formel tex="O" nach="." /></>
              ) : (
                <>Die Quotienten sind alle gleich <Formel tex={zt(r)} nach="." /> Es gilt <Formel tex={t`\vec{b}=${zt(r)}\cdot\vec{a}`} nach="," /> die Pfeile liegen auf einer Geraden durch <Formel tex="O" nach="." /></>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
