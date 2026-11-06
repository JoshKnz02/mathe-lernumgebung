import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { EBENE_GLEICHUNG, KOORDINATENEBENEN, NULL_KOORDINATE, lage, spurpunkte, verschiedeneSpurpunkte, type Koordinatenebene } from '@/lib/gerade';
import { bruch, punktBruchTeX } from '@/lib/geradenhilfen';
import { klammer, spalte, wortKoordinaten } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { EBENEN_NAME, type Punkt3, type RaumBildSpec } from '@/lib/schraegbild';
import type { Vek } from '@/lib/vektor';
import { spurBild } from './Bilder';
import { LABOR_GRENZE, LAGELABOR_START, SCHWARZ, SPURLABOR_START, SPUR_TEX } from './daten';

const nullvektor = (v: Vek) => v.every((x) => x === 0);
const ebeneName = (e: Koordinatenebene) => `${EBENEN_NAME[e]}-Ebene`;
const liste = (namen: string[], leer: string) => (namen.length ? namen.join(' und ') : leer);

/** Bild des Spurpunktelabors: die Gerade mit den Koordinatenebenen und dem Stützpunkt P, auf Wunsch mit den Spurpunkten. */
export function spurLaborBild(p: Vek, u: Vek, zeigeSpur: boolean): { spec: RaumBildSpec; ausserhalb: string[]; kein: boolean } {
  const kein = nullvektor(u);
  const P = { name: 'P', p: p as Punkt3 };
  const stuetz = nullvektor(p) ? { name: 'P', p: p as Punkt3, ohneText: true } : P;
  if (kein) return { spec: { sprech: `Schrägbild mit den drei Koordinatenebenen. Der Stützpunkt P liegt bei ${wortKoordinaten(p)}. Der Richtungsvektor ist der Nullvektor, damit gibt es keine Gerade.`, punkte: [stuetz], ebenen: ['e12', 'e13', 'e23'], ebenenNamen: false }, ausserhalb: [], kein };
  const g = { p, u };
  const { spec, ausserhalb } = spurBild(g, {
    spur: zeigeSpur,
    punkte: [stuetz],
    sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade geht durch den Stützpunkt P bei ${wortKoordinaten(p)}.${zeigeSpur ? ' Die Spurpunkte sind mit ihren Namen markiert.' : ''}`,
  });
  return { spec, ausserhalb, kein };
}

/** Eine Zeile der Rechnung des Spurpunktelabors für eine Ebene, als TeX. */
export function spurZeile(p: Vek, u: Vek, e: Koordinatenebene): string {
  const i = NULL_KOORDINATE[e];
  const x = `x_${i + 1}`;
  if (u[i] === 0) return t`\begin{gathered}${x}=${p[i]}+t\cdot 0=${p[i]}\end{gathered}`;
  const s = spurpunkte({ p, u }).find((q) => q.ebene === e)!;
  return t`\begin{gathered}${x}=0:\ ${p[i]}+${klammer(u[i]!)}\cdot t=0\\\Rightarrow t=${bruch(s.t)}\\${punktBruchTeX(SPUR_TEX[e], s.punkt)}\end{gathered}`;
}

/** Spurpunktelabor (nur im Raum): p und u werden eingestellt. Spurpunkte und Rechnung lassen sich einblenden. */
export function Spurpunktelabor() {
  const [p, setP] = useState<number[]>(SPURLABOR_START.p);
  const [u, setU] = useState<number[]>(SPURLABOR_START.u);
  const [spur, setSpur] = useState(false);
  const [rechnung, setRechnung] = useState(false);
  const { spec, ausserhalb, kein } = spurLaborBild(p, u, spur);
  const anzahl = kein ? 0 : verschiedeneSpurpunkte({ p, u }).length;
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <p className="klein">Koordinatenebenen (durchsichtig): <Formel tex="x_1x_2" /> hellblau, <Formel tex="x_1x_3" /> grün, <Formel tex="x_2x_3" /> gelborange.</p>
      {spur && ausserhalb.length > 0 && <p className="klein">Der Spurpunkt {ausserhalb.join(' und ')} liegt außerhalb des gezeichneten Koordinatensystems (eine Koordinate ist größer als 4 oder kleiner als −4). Er ist nicht eingezeichnet, die Rechnung gilt trotzdem.</p>}
      {kein && <p className="klein">Der Richtungsvektor darf nicht der Nullvektor sein. Mit ihm gibt es keine Gerade, nur den Punkt P.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('p', 'p', p, LABOR_GRENZE.p, setP)}</div>
        <div className="regler-gruppe">{koordinatenRegler('u', 'u', u, LABOR_GRENZE.u, setU)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={spur} onChange={(e) => setSpur(e.target.checked)} /> Spurpunkte einzeichnen</label>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Rechnung zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\vec{p}=${spalte(p)},\quad \vec{u}=${spalte(u)}`} />
        {rechnung && !kein && (
          <>
            {KOORDINATENEBENEN.map((e) => (
              <div key={e}>
                <p className="klein">{ebeneName(e)} ({EBENE_GLEICHUNG[e]}):</p>
                <Formel anzeige tex={spurZeile(p, u, e)} />
                {u[NULL_KOORDINATE[e]] === 0 && (
                  <p className="klein">{p[NULL_KOORDINATE[e]] === 0 ? `Die Koordinate bleibt immer 0: g liegt in der ${ebeneName(e)}, es gibt dort keinen einzelnen Spurpunkt.` : 'Die Koordinate bleibt immer gleich und ist nicht 0: g erreicht die Ebene nie, es gibt keinen Spurpunkt.'}</p>
                )}
              </div>
            ))}
            <p className="klein"><strong>Verschiedene Spurpunkte: {anzahl}.</strong></p>
          </>
        )}
      </div>
    </div>
  );
}

/** Bild des Lagelabors: die Gerade mit den Koordinatenebenen und dem Stützpunkt P. */
export function lageLaborBild(p: Vek, u: Vek): RaumBildSpec {
  const kein = nullvektor(u);
  const stuetz = nullvektor(p) ? { name: 'P', p: p as Punkt3, ohneText: true } : { name: 'P', p: p as Punkt3 };
  if (kein) return { sprech: `Schrägbild mit den drei Koordinatenebenen. Der Stützpunkt P liegt bei ${wortKoordinaten(p)}. Der Richtungsvektor ist der Nullvektor, damit gibt es keine Gerade.`, punkte: [stuetz], ebenen: ['e12', 'e13', 'e23'], ebenenNamen: false };
  return spurBild({ p, u }, { spur: false, punkte: [stuetz], sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade geht durch den Stützpunkt P bei ${wortKoordinaten(p)}.` }).spec;
}

/** Lagelabor (nur im Raum): p und u werden eingestellt, die besondere Lage lässt sich einblenden. */
export function Lagelabor() {
  const [p, setP] = useState<number[]>(LAGELABOR_START.p);
  const [u, setU] = useState<number[]>(LAGELABOR_START.u);
  const [zeigen, setZeigen] = useState(false);
  const kein = nullvektor(u);
  const l = kein ? null : lage({ p, u });
  return (
    <div className="labor">
      <Raumbild spec={lageLaborBild(p, u)} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> die Gerade <Formel tex="g" /> (gestrichelt) durch den Stützpunkt <Formel tex="P" /></li>
      </ul>
      <p className="klein">Koordinatenebenen (durchsichtig): <Formel tex="x_1x_2" /> hellblau, <Formel tex="x_1x_3" /> grün, <Formel tex="x_2x_3" /> gelborange.</p>
      {kein && <p className="klein">Der Richtungsvektor darf nicht der Nullvektor sein. Mit ihm gibt es keine Gerade, nur den Punkt P.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('p', 'p', p, LABOR_GRENZE.p, setP)}</div>
        <div className="regler-gruppe">{koordinatenRegler('u', 'u', u, LABOR_GRENZE.u, setU)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={zeigen} onChange={(e) => setZeigen(e.target.checked)} /> Lage anzeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\vec{p}=${spalte(p)},\quad \vec{u}=${spalte(u)}`} />
        {zeigen && l && (
          <ul className="liste-ohne-zahl" aria-label="Besondere Lage der Geraden">
            <li>Durch den Ursprung: {l.durchUrsprung ? 'ja' : 'nein'}.</li>
            <li>Auf einer Koordinatenachse: {l.aufAchse ? `ja, auf der x${'₁₂₃'[l.aufAchse - 1]}-Achse` : 'nein'}.</li>
            <li>Liegt in: {liste(l.inEbenen.map(ebeneName), 'keiner Koordinatenebene')}.</li>
            <li>Echt parallel zu: {liste(l.parallelEbenen.map(ebeneName), 'keiner Koordinatenebene')}.</li>
            <li>Parallel zu einer Koordinatenachse (ohne auf ihr zu liegen): {l.parallelAchse ? `ja, zur x${'₁₂₃'[l.parallelAchse - 1]}-Achse` : 'nein'}.</li>
          </ul>
        )}
      </div>
    </div>
  );
}
