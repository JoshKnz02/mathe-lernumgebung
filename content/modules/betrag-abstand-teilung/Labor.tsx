import { useState } from 'react';
import { Dimensionswahl, koordinatenRegler, type Dimension } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Laborbrett, type LaborPfeil, type LaborZustand } from '@/components/Laborbrett';
import { Raumbild } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { klammer, spalte, wortKoordinaten } from '@/lib/laborhilfen';
import { t, zt } from '@/lib/modulhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie } from '@/lib/schraegbild';
import { abstand, betrag, einheitsvektor, summe, teilpunkt, verbindungsvektor, type Vek } from '@/lib/vektor';
import type { Punkt2 } from '@/lib/vektorbild';
import { ABSTAND_START, BLAU, LABOR_GRENZE_EBENE, LABOR_GRENZE_RAUM, ORANGE, SCHWARZ, TEILUNG_START } from './daten';

const rund2 = (x: number) => Math.round(x * 100) / 100;
const istGanz = (x: number) => Math.abs(x - Math.round(x)) < 1e-9;

/** Zahl in TeX: ganze Zahlen und Zahlen mit höchstens zwei Nachkommastellen exakt, sonst auf zwei Stellen gerundet mit Hinweis. */
export function zahlTeX(x: number): { tex: string; exakt: boolean } {
  const r = rund2(x);
  return { tex: zt(r + 0), exakt: Math.abs(r - x) < 1e-9 };
}
/** Betrag als TeX: Wurzel aus der Summe der Quadrate, ganzzahlig oder gerundet. */
export function betragTeX(v: Vek): string {
  const s = v.reduce((q, x) => q + x * x, 0);
  const b = betrag(v);
  return istGanz(b) ? `\\sqrt{${s}}=${Math.round(b)}` : `\\sqrt{${s}}\\approx ${zt(rund2(b))}`;
}

const pf = (von: Punkt2, bis: Punkt2, farbe: string, extra: Partial<LaborPfeil> = {}): LaborPfeil => ({ von, bis, farbe, breite: 2.5, sichtbar: true, ...extra });

/* ---------- Abstandslabor ---------- */

export function abstandZustand2(a: Vek, b: Vek, einheit: boolean): LaborZustand {
  const A = a as Punkt2;
  const B = b as Punkt2;
  const ecke: Punkt2 = [B[0], A[1]];
  const v = verbindungsvektor(a, b);
  const e = betrag(v) > 0 ? (einheitsvektor(v) as Punkt2) : ([0, 0] as Punkt2);
  return {
    pfeile: [
      pf(A, ecke, SCHWARZ, { gestrichelt: true, ohneSpitze: true, breite: 1.5 }),
      pf(ecke, B, SCHWARZ, { gestrichelt: true, ohneSpitze: true, breite: 1.5 }),
      pf(A, B, ORANGE),
      pf(A, [A[0] + e[0], A[1] + e[1]], BLAU, { sichtbar: einheit && betrag(v) > 0, breite: 3.5 }),
    ],
    punkte: [{ name: 'A', p: A }, { name: 'B', p: B }],
  };
}
export function abstandBild3(a: Vek, b: Vek, einheit: boolean): RaumBildSpec {
  const A = a as Punkt3;
  const B = b as Punkt3;
  const e1: Punkt3 = [B[0], A[1], A[2]];
  const e2: Punkt3 = [B[0], B[1], A[2]];
  const v = verbindungsvektor(a, b);
  const strich = (von: Punkt3, bis: Punkt3): RaumLinie => ({ von, bis, farbe: SCHWARZ, gestrichelt: true });
  const linien: RaumLinie[] = [strich(A, e1), strich(e1, e2), strich(e2, B), { von: A, bis: B, farbe: ORANGE, pfeil: true }];
  if (einheit && betrag(v) > 0) linien.push({ von: A, bis: summe(a, einheitsvektor(v)) as Punkt3, farbe: BLAU, breite: 3.5, pfeil: true });
  return {
    sprech: `Schrägbild mit den Punkten A bei ${wortKoordinaten(A)} und B bei ${wortKoordinaten(B)}. Der orange Pfeil führt von A nach B, der gestrichelte Weg führt in drei Schritten parallel zu den Achsen von A nach B.${einheit ? ' Der blaue Pfeil ist der Einheitsvektor von A aus.' : ''}`,
    punkte: [{ name: 'A', p: A }, { name: 'B', p: B }],
    linien,
  };
}

/**
 * Labor zu Betrag und Abstand: Die Punkte A und B werden mit Reglern eingestellt, in der Ebene oder im Raum. Das Bild zeigt den Pfeil von A nach B und den Weg
 * parallel zu den Achsen (Hilfsdreieck bzw. Quader). Auf Wunsch erscheint der Einheitsvektor und die Rechnung.
 */
export function Abstandslabor() {
  const [dim, setDim] = useState<Dimension>(2);
  const [a2, setA2] = useState<number[]>(ABSTAND_START.a2);
  const [b2, setB2] = useState<number[]>(ABSTAND_START.b2);
  const [a3, setA3] = useState<number[]>(ABSTAND_START.a3);
  const [b3, setB3] = useState<number[]>(ABSTAND_START.b3);
  const [einheit, setEinheit] = useState(false);
  const [rechnung, setRechnung] = useState(false);
  const a = dim === 2 ? a2 : a3;
  const b = dim === 2 ? b2 : b3;
  const g = dim === 2 ? LABOR_GRENZE_EBENE : LABOR_GRENZE_RAUM;
  const v = verbindungsvektor(a, b);
  const d = abstand(a, b);
  const nullvektor = d === 0;
  const e = nullvektor ? null : einheitsvektor(v);
  const beschreibung = `Koordinatensystem mit den Punkten A bei ${wortKoordinaten(a)} und B bei ${wortKoordinaten(b)}. Der orange Pfeil führt von A nach B, gestrichelt ist der Weg parallel zu den Achsen.${einheit ? ' Der blaue Pfeil ist der Einheitsvektor.' : ''}`;
  return (
    <div className="labor">
      <Dimensionswahl wert={dim} onChange={setDim} />
      {dim === 2 ? <Laborbrett zustand={abstandZustand2(a, b, einheit)} beschreibung={beschreibung} /> : <Raumbild spec={abstandBild3(a, b, einheit)} />}
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeil von <Formel tex="A" /> nach <Formel tex="B" /></li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Weg parallel zu den Achsen (gestrichelt)</li>
        {einheit && <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Einheitsvektor von <Formel tex="A" /> aus</li>}
      </ul>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('A', 'a', a, g, dim === 2 ? setA2 : setA3, 'Koordinate')}</div>
        <div className="regler-gruppe">{koordinatenRegler('B', 'b', b, g, dim === 2 ? setB2 : setB3, 'Koordinate')}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={einheit} onChange={(x) => setEinheit(x.target.checked)} /> Einheitsvektor zeigen</label>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(x) => setRechnung(x.target.checked)} /> Rechnung einblenden</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\overrightarrow{AB}=${spalte(v)}`} />
        <Formel anzeige tex={t`|\overrightarrow{AB}|\approx ${zt(rund2(d))}`} />
        {einheit && e && <Formel anzeige tex={t`\vec{e}\approx\begin{pmatrix}${e.map((x) => zt(rund2(x))).join('\\\\')}\end{pmatrix}`} />}
        {einheit && !e && <p className="klein">Der Nullvektor hat keinen Einheitsvektor, weil man nicht durch den Betrag 0 teilen kann.</p>}
        {rechnung && (
          <Formel anzeige tex={t`\begin{aligned}|\overrightarrow{AB}|&=\sqrt{${v.map((x) => `${klammer(x)}^2`).join('+')}}\\&=${betragTeX(v)}\end{aligned}`} />
        )}
        {rechnung && einheit && e && <Formel anzeige tex={t`\vec{e}=\frac{1}{|\overrightarrow{AB}|}\cdot\overrightarrow{AB}`} />}
      </div>
    </div>
  );
}

/* ---------- Teilungslabor ---------- */

export function teilungZustand2(a: Vek, b: Vek, m: number, n: number): LaborZustand {
  const A = a as Punkt2;
  const B = b as Punkt2;
  const T = teilpunkt(a, b, m, n) as Punkt2;
  return { pfeile: [pf(A, T, ORANGE, { breite: 3 }), pf(T, B, BLAU, { breite: 3 })], punkte: [{ name: 'A', p: A }, { name: 'T', p: T }, { name: 'B', p: B }] };
}
export function teilungBild3(a: Vek, b: Vek, m: number, n: number): RaumBildSpec {
  const A = a as Punkt3;
  const B = b as Punkt3;
  const T = teilpunkt(a, b, m, n) as Punkt3;
  return {
    sprech: `Schrägbild mit den Punkten A bei ${wortKoordinaten(A)}, B bei ${wortKoordinaten(B)} und dem Teilpunkt T bei ${wortKoordinaten(T)}. Der orange Pfeil führt von A nach T, der blaue von T nach B. Das Verhältnis der Längen ist ${m} zu ${n}.`,
    punkte: [{ name: 'A', p: A }, { name: 'T', p: T }, { name: 'B', p: B }],
    linien: [{ von: A, bis: T, farbe: ORANGE, pfeil: true }, { von: T, bis: B, farbe: BLAU, pfeil: true }],
  };
}

/**
 * Labor zur Teilung einer Strecke: A, B und das Verhältnis m : n werden eingestellt. T teilt die Strecke AB so, dass AT : TB = m : n gilt.
 * Das Bild zeigt die beiden Teilstrecken als Pfeile, unter dem Bild stehen der Anteil und die Koordinaten von T.
 */
export function Teilungslabor() {
  const [dim, setDim] = useState<Dimension>(2);
  const [a2, setA2] = useState<number[]>(TEILUNG_START.a2);
  const [b2, setB2] = useState<number[]>(TEILUNG_START.b2);
  const [a3, setA3] = useState<number[]>(TEILUNG_START.a3);
  const [b3, setB3] = useState<number[]>(TEILUNG_START.b3);
  const [m, setM] = useState(TEILUNG_START.m);
  const [n, setN] = useState(TEILUNG_START.n);
  const [rechnung, setRechnung] = useState(false);
  const a = dim === 2 ? a2 : a3;
  const b = dim === 2 ? b2 : b3;
  const g = dim === 2 ? LABOR_GRENZE_EBENE : LABOR_GRENZE_RAUM;
  const T = teilpunkt(a, b, m, n);
  const ab = verbindungsvektor(a, b);
  const zahlen = T.map(zahlTeX);
  const exakt = zahlen.every((z) => z.exakt);
  const beschreibung = `Koordinatensystem mit den Punkten A bei ${wortKoordinaten(a)}, B bei ${wortKoordinaten(b)} und dem Teilpunkt T bei ${wortKoordinaten(T.map(rund2))}. Der orange Pfeil führt von A nach T, der blaue von T nach B. Das Verhältnis ist ${m} zu ${n}.`;
  return (
    <div className="labor">
      <Dimensionswahl wert={dim} onChange={setDim} />
      {dim === 2 ? <Laborbrett zustand={teilungZustand2(a, b, m, n)} beschreibung={beschreibung} /> : <Raumbild spec={teilungBild3(a, b, m, n)} />}
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeil von <Formel tex="A" /> nach <Formel tex="T" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Pfeil von <Formel tex="T" /> nach <Formel tex="B" /></li>
      </ul>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('A', 'a', a, g, dim === 2 ? setA2 : setA3, 'Koordinate')}</div>
        <div className="regler-gruppe">{koordinatenRegler('B', 'b', b, g, dim === 2 ? setB2 : setB3, 'Koordinate')}</div>
        <div className="regler-gruppe">
          <Regler name="Verhältniszahl m" beschriftung={<Formel tex="m" />} wert={m} min={1} max={5} step={1} onChange={setM} anzeige={<Formel tex={String(m)} />} />
          <Regler name="Verhältniszahl n" beschriftung={<Formel tex="n" />} wert={n} min={1} max={5} step={1} onChange={setN} anzeige={<Formel tex={String(n)} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(x) => setRechnung(x.target.checked)} /> Rechnung einblenden</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`AT:TB=${m}:${n}`} />
        <Formel anzeige tex={t`T${exakt ? '=' : '\\approx'}\left(${zahlen.map((z) => z.tex).join('\\,|\\,')}\right)`} />
        {rechnung && (
          <>
            <Formel anzeige tex={t`\overrightarrow{AT}=\frac{${m}}{${m + n}}\cdot\overrightarrow{AB}`} />
            <Formel anzeige tex={t`\begin{aligned}\overrightarrow{OT}&=\overrightarrow{OA}+\frac{${m}}{${m + n}}\cdot\overrightarrow{AB}\\&=${spalte(a)}+\frac{${m}}{${m + n}}\cdot${spalte(ab)}\end{aligned}`} />
          </>
        )}
      </div>
    </div>
  );
}
