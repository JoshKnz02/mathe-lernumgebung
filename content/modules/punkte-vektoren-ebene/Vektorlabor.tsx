import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { t } from '@/lib/modulhilfen';
import { gegenvektor, spaltenTeX, verbindungsvektor } from '@/lib/vektor';
import { achsenLinien, labelMitte, lageFuerPunkt, type Linie, type Punkt2 } from '@/lib/vektorbild';
import { LABOR_BEREICH, LABOR_PUNKT_START } from './daten';

interface Zustand {
  p: Punkt2;
  t: Punkt2;
}

const stil = { highlight: false, fixed: true };
const zahlTex = (x: number) => String(x);
/** Klammer um negative Zahlen in der Rechnung: 2 − (−4). */
const klammer = (x: number) => (x < 0 ? `(${x})` : String(x));

/** Wegbeschreibung in Worten, wie auf den Arbeitsblättern: in bzw. entgegen der Richtung der Achse. */
export function wegWort(d: number, achse: 'x' | 'y'): string {
  if (d === 0) return `keine Änderung in Richtung der ${achse}-Achse`;
  return `${Math.abs(d)} ${Math.abs(d) === 1 ? 'Einheit' : 'Einheiten'} ${d > 0 ? 'in' : 'entgegen der'} Richtung der ${achse}-Achse`;
}

/** Linien, auf denen die Beschriftungen von P und T nicht stehen dürfen: Achsen, beide Pfeile und der Weg am Raster. */
function linien(z: Zustand): Linie[] {
  const ecke: Punkt2 = [z.t[0], z.p[1]];
  return [...achsenLinien(LABOR_BEREICH), { von: z.p, bis: z.t }, { von: z.p, bis: ecke }, { von: ecke, bis: z.t }];
}

/**
 * Labor zum Vektor von P nach T: Die Koordinaten von P und T lassen sich mit Reglern einstellen. Das Schaubild zeigt den Weg am Raster,
 * den Pfeil von P nach T (orange) und den Gegenvektor (blau, leicht versetzt). Die Rechnung lässt sich auf Wunsch einblenden,
 * damit zuerst die eigene Vermutung geprüft werden kann.
 */
export function Vektorlabor() {
  const [p, setP] = useState<Punkt2>(LABOR_PUNKT_START.p);
  const [tt, setT] = useState<Punkt2>(LABOR_PUNKT_START.t);
  const [rechnung, setRechnung] = useState(false);
  const z: Zustand = { p, t: tt };
  const pt = verbindungsvektor(p, tt) as Punkt2;
  const tp = gegenvektor(pt);
  const beschreibung = `Koordinatensystem mit den Punkten P bei ${p[0]} und ${p[1]} und T bei ${tt[0]} und ${tt[1]}. Der orange Pfeil führt von P nach T, der blaue Pfeil von T nach P. Der Vektor von P nach T hat die Koordinaten ${pt[0]} und ${pt[1]}.`.replace(/-(\d)/g, 'minus $1');

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={LABOR_BEREICH}
        xTeilung={1}
        yTeilung={1}
        xBeschriftung="zahl"
        className="brett-quadrat"
        xTitel="x"
        yTitel="y"
        beschreibung={beschreibung}
        zustand={z}
        aufbau={(b, lies) => {
          const [xmin, xmax, ymin, ymax] = LABOR_BEREICH;
          const ecke = () => [lies().t[0], lies().p[1]] as Punkt2;
          const versatz = (): Punkt2 => {
            const [px, py] = lies().p;
            const [qx, qy] = lies().t;
            const len = Math.hypot(qx - px, qy - py);
            return len === 0 ? [0, 0] : [(-(qy - py) / len) * 0.18, ((qx - px) / len) * 0.18];
          };
          b.create('segment', [() => [lies().p[0], lies().p[1]], () => ecke()], { ...stil, strokeColor: SCHWARZ, strokeWidth: 1.5, dash: 2 });
          b.create('segment', [() => ecke(), () => [lies().t[0], lies().t[1]]], { ...stil, strokeColor: SCHWARZ, strokeWidth: 1.5, dash: 2 });
          b.create('segment', [() => [lies().p[0], lies().p[1]], () => [lies().t[0], lies().t[1]]], { ...stil, strokeColor: ORANGE, strokeWidth: 2.5, lastArrow: { type: 2, size: 6 } });
          b.create('segment', [() => [lies().t[0] + versatz()[0], lies().t[1] + versatz()[1]], () => [lies().p[0] + versatz()[0], lies().p[1] + versatz()[1]]], { ...stil, strokeColor: BLAU, strokeWidth: 2.5, lastArrow: { type: 2, size: 6 } });
          for (const k of ['p', 't'] as const) b.create('point', [() => lies()[k][0], () => lies()[k][1]], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: SCHWARZ, fillColor: SCHWARZ });
          // Beschriftungen: Die Mitte liegt auf der gewählten freien Seite, die Wahl ist rechnerisch (nie auf einem Pfeil, Weg oder einer Achse).
          // Die Berechnung läuft nur einmal je Einstellung, weil JSXGraph die Koordinaten bei jeder Aktualisierung mehrfach abfragt.
          let letzterSchluessel = '';
          let letzte = { p: [0, 0] as [number, number], t: [0, 0] as [number, number] };
          const lagen = (zz: Zustand) => {
            const schluessel = `${zz.p},${zz.t}`;
            if (schluessel === letzterSchluessel) return letzte;
            const o = { bereich: LABOR_BEREICH, teilung: 1, linien: linien(zz), belegt: [] as [number, number][] };
            const lp = lageFuerPunkt(zz.p, o);
            o.belegt.push(labelMitte(lp, zz.p, LABOR_BEREICH));
            const lt = lageFuerPunkt(zz.t, o);
            letzte = { p: labelMitte(lp, zz.p, LABOR_BEREICH), t: labelMitte(lt, zz.t, LABOR_BEREICH) };
            letzterSchluessel = schluessel;
            return letzte;
          };
          for (const [k, name, farbe] of [['p', 'P', SCHWARZ], ['t', 'T', SCHWARZ]] as const)
            b.create('text', [() => xmin + lagen(lies())[k][0] * (xmax - xmin), () => ymin + lagen(lies())[k][1] * (ymax - ymin), name], { ...stil, strokeColor: farbe, anchorX: 'middle', anchorY: 'middle', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' });
        }}
      />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeil von <Formel tex="P" /> nach <Formel tex="T" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Pfeil von <Formel tex="T" /> nach <Formel tex="P" /> (leicht versetzt gezeichnet)</li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Weg am Raster</li>
      </ul>

      <div className="labor-bedienung">
        <div>
          <div className="regler-gruppe">
            <Regler name="x-Koordinate von P" beschriftung={<Formel tex="x_P" />} wert={p[0]} min={-5} max={5} step={1} onChange={(x) => setP([x, p[1]])} anzeige={<Formel tex={zahlTex(p[0])} />} />
            <Regler name="y-Koordinate von P" beschriftung={<Formel tex="y_P" />} wert={p[1]} min={-5} max={5} step={1} onChange={(y) => setP([p[0], y])} anzeige={<Formel tex={zahlTex(p[1])} />} />
          </div>
        </div>
        <div>
          <div className="regler-gruppe">
            <Regler name="x-Koordinate von T" beschriftung={<Formel tex="x_T" />} wert={tt[0]} min={-5} max={5} step={1} onChange={(x) => setT([x, tt[1]])} anzeige={<Formel tex={zahlTex(tt[0])} />} />
            <Regler name="y-Koordinate von T" beschriftung={<Formel tex="y_T" />} wert={tt[1]} min={-5} max={5} step={1} onChange={(y) => setT([tt[0], y])} anzeige={<Formel tex={zahlTex(tt[1])} />} />
          </div>
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Rechnung einblenden</label>
        </fieldset>
      </div>

      <div className="labor-gleichung" aria-live="polite">
        <p className="klein">
          Der Weg von <Formel tex="P" /> nach <Formel tex="T" nach=":" /> {wegWort(pt[0], 'x')} und {wegWort(pt[1], 'y')}.
        </p>
        <Formel anzeige tex={t`\overrightarrow{PT}=${spaltenTeX(pt)}`} />
        <Formel anzeige tex={t`\overrightarrow{TP}=${spaltenTeX(tp)}`} />
        {rechnung && (
          <>
            <Formel anzeige tex={t`\begin{aligned}\overrightarrow{PT}&=\begin{pmatrix}${klammer(tt[0])}-${klammer(p[0])}\\${klammer(tt[1])}-${klammer(p[1])}\end{pmatrix}\\&=${spaltenTeX(pt)}\end{aligned}`} />
            <Formel anzeige tex={t`\begin{aligned}\overrightarrow{TP}&=\begin{pmatrix}${klammer(p[0])}-${klammer(tt[0])}\\${klammer(p[1])}-${klammer(tt[1])}\end{pmatrix}\\&=${spaltenTeX(tp)}\end{aligned}`} />
          </>
        )}
      </div>
    </div>
  );
}
