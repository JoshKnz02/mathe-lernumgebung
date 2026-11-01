import { useState } from 'react';
import { Dimensionswahl, koordinatenRegler, type Dimension } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Laborbrett, type LaborPfeil, type LaborZustand } from '@/components/Laborbrett';
import { Raumbild } from '@/components/Raumbild';
import { dreieck, viereck, type Viereckart } from '@/lib/figuren';
import { wortKoordinaten } from '@/lib/laborhilfen';
import { t, zt } from '@/lib/modulhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie } from '@/lib/schraegbild';
import type { Vek } from '@/lib/vektor';
import type { Punkt2 } from '@/lib/vektorbild';
import { BLAU, DREIECK_START, LABOR_GRENZE_EBENE, LABOR_GRENZE_RAUM, ORANGE, SCHWARZ, VIERECK_START } from './daten';

const rund2 = (x: number) => Math.round(x * 100) / 100;
/** Zahl mit Dezimalkomma auf zwei Stellen, ohne −0. */
export const zahl2 = (x: number): string => zt(rund2(x) + 0);
const seite2 = (von: Punkt2, bis: Punkt2, extra: Partial<LaborPfeil> = {}): LaborPfeil => ({ von, bis, farbe: SCHWARZ, breite: 1.8, sichtbar: true, ohneSpitze: true, ...extra });
const pfeil2 = (von: Punkt2, bis: Punkt2, farbe: string, breite = 3): LaborPfeil => ({ von, bis, farbe, breite, sichtbar: true });

/* ---------- Dreieckslabor ---------- */

export type Ecke = 0 | 1 | 2;
const NAMEN = ['A', 'B', 'C'];
/** An der gewählten Ecke beginnen die beiden Pfeile zu den anderen Ecken (z. B. bei B der Pfeil nach C und der Pfeil nach A). */
export const nachbarn = (e: Ecke): [Ecke, Ecke] => [((e + 1) % 3) as Ecke, ((e + 2) % 3) as Ecke];

export function dreieckZustand2(punkte: Vek[], ecke: Ecke): LaborZustand {
  const p = punkte as Punkt2[];
  const [n1, n2] = nachbarn(ecke);
  return {
    pfeile: [seite2(p[0]!, p[1]!), seite2(p[1]!, p[2]!), seite2(p[2]!, p[0]!), pfeil2(p[ecke]!, p[n1]!, ORANGE), pfeil2(p[ecke]!, p[n2]!, BLAU)],
    punkte: p.map((q, i) => ({ name: NAMEN[i]!, p: q })),
  };
}
export function dreieckBild3(punkte: Vek[], ecke: Ecke): RaumBildSpec {
  const p = punkte as Punkt3[];
  const [n1, n2] = nachbarn(ecke);
  const linien: RaumLinie[] = [
    { von: p[0]!, bis: p[1]!, farbe: SCHWARZ },
    { von: p[1]!, bis: p[2]!, farbe: SCHWARZ },
    { von: p[2]!, bis: p[0]!, farbe: SCHWARZ },
    { von: p[ecke]!, bis: p[n1]!, farbe: ORANGE, breite: 3.2, pfeil: true },
    { von: p[ecke]!, bis: p[n2]!, farbe: BLAU, breite: 3.2, pfeil: true },
  ];
  return {
    sprech: `Schrägbild des Dreiecks mit den Ecken A bei ${wortKoordinaten(p[0]!)}, B bei ${wortKoordinaten(p[1]!)} und C bei ${wortKoordinaten(p[2]!)}. An der Ecke ${NAMEN[ecke]} beginnen ein oranger und ein blauer Pfeil zu den beiden anderen Ecken.`,
    punkte: p.map((q, i) => ({ name: NAMEN[i]!, p: q })),
    linien,
  };
}

/**
 * Labor zum Dreieck: Die drei Ecken werden mit Reglern eingestellt, in der Ebene oder im Raum. Das Bild zeigt die Seiten und an der gewählten Ecke die beiden Pfeile
 * zu den Nachbarecken. Unter dem Bild stehen die Seitenlängen und die Innenwinkel. Auf Wunsch kommen die Eigenschaften des Dreiecks und die Rechnung des Winkels hinzu.
 */
export function Dreieckslabor() {
  const [dim, setDim] = useState<Dimension>(2);
  const [a2, setA2] = useState<number[]>(DREIECK_START.a2);
  const [b2, setB2] = useState<number[]>(DREIECK_START.b2);
  const [c2, setC2] = useState<number[]>(DREIECK_START.c2);
  const [a3, setA3] = useState<number[]>(DREIECK_START.a3);
  const [b3, setB3] = useState<number[]>(DREIECK_START.b3);
  const [c3, setC3] = useState<number[]>(DREIECK_START.c3);
  const [ecke, setEcke] = useState<Ecke>(0);
  const [eigenschaften, setEigenschaften] = useState(false);
  const p = dim === 2 ? [a2, b2, c2] : [a3, b3, c3];
  const g = dim === 2 ? LABOR_GRENZE_EBENE : LABOR_GRENZE_RAUM;
  const d = dreieck(p[0]!, p[1]!, p[2]!);
  const summe = d.winkel ? d.winkel[0] + d.winkel[1] + d.winkel[2] : null;
  const [n1, n2] = nachbarn(ecke);
  const beschreibung = `Dreieck mit den Ecken A bei ${wortKoordinaten(p[0]!)}, B bei ${wortKoordinaten(p[1]!)} und C bei ${wortKoordinaten(p[2]!)}. Gewählt ist die Ecke ${NAMEN[ecke]}: Von ihr führen ein oranger Pfeil zur Ecke ${NAMEN[n1]} und ein blauer Pfeil zur Ecke ${NAMEN[n2]}.`;
  const regler = (nr: number, name: string, setze: (v: number[]) => void) => <div key={name} className="regler-gruppe">{koordinatenRegler(name, name.toLowerCase(), p[nr]!, g, setze)}</div>;
  const setzer = [dim === 2 ? setA2 : setA3, dim === 2 ? setB2 : setB3, dim === 2 ? setC2 : setC3];
  return (
    <div className="labor">
      <Dimensionswahl wert={dim} onChange={setDim} />
      {dim === 2 ? <Laborbrett zustand={dreieckZustand2(p, ecke)} beschreibung={beschreibung} /> : <Raumbild spec={dreieckBild3(p, ecke)} />}
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Seiten des Dreiecks</li>
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeil von <Formel tex={NAMEN[ecke]!} /> nach <Formel tex={NAMEN[n1]!} /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Pfeil von <Formel tex={NAMEN[ecke]!} /> nach <Formel tex={NAMEN[n2]!} /></li>
      </ul>
      <div className="darstellungswahl" role="group" aria-label="Ecke wählen">
        <span className="darstellungswahl-name">Ecke:</span>
        {([0, 1, 2] as Ecke[]).map((e) => (
          <button key={e} type="button" className="chip" aria-pressed={ecke === e} aria-label={`Ecke ${NAMEN[e]} wählen`} onClick={() => setEcke(e)}>
            {NAMEN[e]}
          </button>
        ))}
      </div>
      <div className="labor-bedienung">
        {regler(0, 'A', setzer[0]!)}
        {regler(1, 'B', setzer[1]!)}
        {regler(2, 'C', setzer[2]!)}
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={eigenschaften} onChange={(e) => setEigenschaften(e.target.checked)} /> Eigenschaften nennen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`|\overrightarrow{AB}|\approx ${zahl2(d.seiten[2])}`} />
        <Formel anzeige tex={t`|\overrightarrow{AC}|\approx ${zahl2(d.seiten[1])}`} />
        <Formel anzeige tex={t`|\overrightarrow{BC}|\approx ${zahl2(d.seiten[0])}`} />
        {d.winkel === null ? (
          <p className="klein">Zwei Ecken fallen zusammen, ein Winkel ist nicht definiert.</p>
        ) : (
          <>
            <Formel anzeige tex={t`\alpha\approx ${zahl2(d.winkel[0])}^{\circ},\quad \beta\approx ${zahl2(d.winkel[1])}^{\circ}`} />
            <Formel anzeige tex={t`\gamma\approx ${zahl2(d.winkel[2])}^{\circ}`} />
            <Formel anzeige tex={t`\alpha+\beta+\gamma\approx ${zahl2(summe!)}^{\circ}`} />
          </>
        )}
        {eigenschaften && d.winkel !== null && (
          <p>
            {d.gleichseitig ? 'Das Dreieck ist gleichseitig.' : d.gleichschenklig ? 'Das Dreieck ist gleichschenklig.' : 'Das Dreieck hat drei verschieden lange Seiten.'}{' '}
            {d.rechterWinkel === null ? 'Es hat keinen rechten Winkel.' : `Der rechte Winkel liegt bei ${NAMEN[d.rechterWinkel]}.`}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Viereckslabor ---------- */

export const ART_NAME: Record<Viereckart, string> = {
  quadrat: 'Quadrat',
  rechteck: 'Rechteck',
  raute: 'Raute',
  parallelogramm: 'Parallelogramm',
  trapez: 'Trapez',
  drachen: 'Drachen',
  allgemein: 'allgemeines Viereck',
  ungueltig: 'kein Viereck (die Ecken liegen nicht so, dass ein Viereck ABCD entsteht)',
};

export function viereckZustand(punkte: Vek[], diagonalen: boolean): LaborZustand {
  const p = punkte as Punkt2[];
  return {
    pfeile: [
      seite2(p[0]!, p[1]!, { breite: 2.5 }),
      seite2(p[1]!, p[2]!, { breite: 2.5 }),
      seite2(p[2]!, p[3]!, { breite: 2.5 }),
      seite2(p[3]!, p[0]!, { breite: 2.5 }),
      seite2(p[0]!, p[2]!, { gestrichelt: true, sichtbar: diagonalen, farbe: BLAU }),
      seite2(p[1]!, p[3]!, { gestrichelt: true, sichtbar: diagonalen, farbe: ORANGE }),
    ],
    punkte: p.map((q, i) => ({ name: 'ABCD'[i]!, p: q })),
  };
}

/**
 * Labor zu Vierecken in der Ebene: Die vier Ecken werden mit Reglern eingestellt. Unter dem Bild stehen Seitenlängen und Innenwinkel, auf Wunsch die Diagonalen,
 * die Eigenschaften (parallele Seiten, gleiche Seiten, rechte Winkel, Diagonalen) und der Name des Vierecks. Im Raum gibt es dazu Aufgaben mit Bild.
 */
export function Viereckslabor() {
  const [a, setA] = useState<number[]>(VIERECK_START.a);
  const [b, setB] = useState<number[]>(VIERECK_START.b);
  const [c, setC] = useState<number[]>(VIERECK_START.c);
  const [d, setD] = useState<number[]>(VIERECK_START.d);
  const [diag, setDiag] = useState(false);
  const [eig, setEig] = useState(false);
  const [name, setName] = useState(false);
  const v = viereck(a, b, c, d);
  const g = LABOR_GRENZE_EBENE;
  const beschreibung = `Viereck mit den Ecken A bei ${wortKoordinaten(a)}, B bei ${wortKoordinaten(b)}, C bei ${wortKoordinaten(c)} und D bei ${wortKoordinaten(d)}.${diag ? ' Die Diagonalen sind gestrichelt eingezeichnet.' : ''}`;
  const ja = (x: boolean) => (x ? 'ja' : 'nein');
  return (
    <div className="labor">
      <Laborbrett zustand={viereckZustand([a, b, c, d], diag)} beschreibung={beschreibung} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Seiten des Vierecks</li>
        {diag && <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Diagonale <Formel tex="AC" /> (blau) und <Formel tex="BD" /> (orange)</li>}
      </ul>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('A', 'a', a, g, setA)}</div>
        <div className="regler-gruppe">{koordinatenRegler('B', 'b', b, g, setB)}</div>
        <div className="regler-gruppe">{koordinatenRegler('C', 'c', c, g, setC)}</div>
        <div className="regler-gruppe">{koordinatenRegler('D', 'd', d, g, setD)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={diag} onChange={(e) => setDiag(e.target.checked)} /> Diagonalen zeigen</label>
          <label className="schalter"><input type="checkbox" checked={eig} onChange={(e) => setEig(e.target.checked)} /> Eigenschaften nennen</label>
          <label className="schalter"><input type="checkbox" checked={name} onChange={(e) => setName(e.target.checked)} /> Namen nennen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`|AB|\approx ${zahl2(v.seiten[0])},\ |BC|\approx ${zahl2(v.seiten[1])}`} />
        <Formel anzeige tex={t`|CD|\approx ${zahl2(v.seiten[2])},\ |DA|\approx ${zahl2(v.seiten[3])}`} />
        {v.winkel !== null && <Formel anzeige tex={t`\alpha\approx ${zahl2(v.winkel[0])}^{\circ},\ \beta\approx ${zahl2(v.winkel[1])}^{\circ}`} />}
        {v.winkel !== null && <Formel anzeige tex={t`\gamma\approx ${zahl2(v.winkel[2])}^{\circ},\ \delta\approx ${zahl2(v.winkel[3])}^{\circ}`} />}
        {eig && (
          <ul className="liste-ohne-zahl" aria-label="Eigenschaften">
            <li>AB parallel zu DC: {ja(v.parallel[0])}</li>
            <li>BC parallel zu AD: {ja(v.parallel[1])}</li>
            <li>Alle vier Seiten gleich lang: {ja(v.vierGleich)}</li>
            <li>Vier rechte Winkel: {ja(v.rechtwinklig)}</li>
            <li>Diagonalen senkrecht: {ja(v.diagonalenSenkrecht)}</li>
            <li>Diagonalen gleich lang: {ja(v.diagonalenGleich)}</li>
          </ul>
        )}
        {name && <p>Das Viereck ist ein {ART_NAME[v.art]}.</p>}
      </div>
    </div>
  );
}
