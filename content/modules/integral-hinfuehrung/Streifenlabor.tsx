import { useMemo, useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { FLAECHE_BLAU } from '@/components/Flaechenbild';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { obersumme, streifen, untersumme, zahl, type Streifen } from '@/lib/flaeche';
import { PARABEL, UFER } from './daten';

export interface StreifenFunktion {
  id: 'ufer' | 'parabel';
  name: string;
  /** Funktionsterm als TeX. */
  tex: string;
  sprech: string;
  f: (x: number) => number;
  a: number;
  b: number;
  stufen: number[];
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  /** Einheit der Fläche als TeX, leer ohne Einheit. */
  einheit: string;
  xTitel: string;
  yTitel: string;
}

export const STREIFEN_FUNKTIONEN: StreifenFunktion[] = [
  { id: 'ufer', name: 'Grundstück', tex: String.raw`f(x)=12+2x-0{,}04x^2`, sprech: 'f(x) gleich 12 plus 2 x minus 0,04 x²', f: UFER.f, a: UFER.a, b: UFER.b, stufen: UFER.stufen, bereich: UFER.bereich, teilung: UFER.teilung, yTeilung: UFER.yTeilung, einheit: String.raw`\,\text{m}^2`, xTitel: 'x in m', yTitel: 'y in m' },
  { id: 'parabel', name: 'Parabel', tex: String.raw`f(x)=\frac{1}{2}x^2+1`, sprech: 'f(x) gleich x²/2 plus 1', f: PARABEL.f, a: PARABEL.a, b: PARABEL.b, stufen: PARABEL.stufen, bereich: PARABEL.bereich, teilung: PARABEL.teilung, yTeilung: PARABEL.yTeilung, einheit: '', xTitel: 'x', yTitel: 'y' },
];

interface Zustand {
  fn: StreifenFunktion;
  z: Streifen[];
  unter: boolean;
  ober: boolean;
}

const STIL = { highlight: false, fixed: true };

/** Eckpunkte des Treppenzugs aus den Streifen (Höhe je Streifen über hoehe), mit Anfang und Ende auf der x-Achse. */
function treppe(z: Streifen[], hoehe: (s: Streifen) => number, schliessen: boolean): [number[], number[]] {
  const xs: number[] = [z[0]!.x0];
  const ys: number[] = [0];
  for (const s of z) {
    xs.push(s.x0, s.x1);
    ys.push(hoehe(s), hoehe(s));
  }
  xs.push(z[z.length - 1]!.x1);
  ys.push(0);
  if (schliessen) {
    xs.push(z[0]!.x0);
    ys.push(0);
  }
  return [xs, ys];
}

/** Senkrechte Trennlinien zwischen den Streifen (bis zur Höhe des niedrigeren Nachbarn), durch NaN unterbrochen. */
function trennlinien(z: Streifen[], hoehe: (s: Streifen) => number): [number[], number[]] {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 1; i < z.length; i++) {
    xs.push(z[i]!.x0, z[i]!.x0, NaN);
    ys.push(0, Math.min(hoehe(z[i - 1]!), hoehe(z[i]!)), NaN);
  }
  return [xs, ys];
}

function Zeichnung({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const fn = zustand.fn;
  return (
    <Zeichenbrett
      bereich={fn.bereich}
      xTeilung={fn.teilung}
      yTeilung={fn.yTeilung}
      xBeschriftung="zahl"
      className="brett-3zu2"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const [xmin, xmax, ymin, ymax] = fn.bereich;
        // Der Zustand wird beim Zeichnen gelesen: updateDataArray liest immer die aktuellen Streifen.
        const kurve = (opt: Record<string, unknown>, daten: () => [number[], number[]]) => {
          const c = b.create('curve', [[0], [0]], { ...STIL, ...opt }) as unknown as GeometryElement & { dataX: number[]; dataY: number[]; updateDataArray: () => void; needsRegularUpdate: boolean };
          c.needsRegularUpdate = true;
          c.updateDataArray = function () {
            const [x, y] = daten();
            this.dataX = x;
            this.dataY = y;
          };
          return c;
        };
        const unterFlaeche = kurve({ strokeColor: BLAU, strokeWidth: 1.5, fillColor: FLAECHE_BLAU, fillOpacity: 0.32 }, () => (lies().unter ? treppe(lies().z, (s) => s.unten, true) : [[NaN], [NaN]]));
        const unterLinien = kurve({ strokeColor: BLAU, strokeWidth: 1 }, () => (lies().unter ? trennlinien(lies().z, (s) => s.unten) : [[NaN], [NaN]]));
        const oberLinie = kurve({ strokeColor: SCHWARZ, strokeWidth: 2, dash: 3 }, () => (lies().ober ? treppe(lies().z, (s) => s.oben, false) : [[NaN], [NaN]]));
        const oberLinien = kurve({ strokeColor: SCHWARZ, strokeWidth: 1, dash: 3 }, () => (lies().ober ? trennlinien(lies().z, (s) => s.oben) : [[NaN], [NaN]]));
        b.create('functiongraph', [fn.f, fn.a, fn.b], { ...STIL, strokeColor: ORANGE, strokeWidth: 3.5 });
        b.create('segment', [[fn.a, 0], [fn.a, fn.f(fn.a)]], { ...STIL, strokeColor: ORANGE, strokeWidth: 2 });
        b.create('segment', [[fn.b, 0], [fn.b, fn.f(fn.b)]], { ...STIL, strokeColor: ORANGE, strokeWidth: 2 });
        return () => {
          for (const c of [unterFlaeche, unterLinien, oberLinie, oberLinien]) c.update();
        };
      }}
    />
  );
}

/**
 * Labor zur näherungsweisen Flächenbestimmung: Die Fläche wird in n gleich breite Streifen zerlegt, jeder Streifen durch ein Rechteck
 * ersetzt. Die Untersumme nimmt den kleinsten, die Obersumme den größten Funktionswert im Streifen. Die Tabelle zeigt alle Stufen.
 */
export function Streifenlabor() {
  const [fId, setFId] = useState<StreifenFunktion['id']>('ufer');
  const fn = STREIFEN_FUNKTIONEN.find((x) => x.id === fId)!;
  const [stufe, setStufe] = useState(1);
  const [unter, setUnter] = useState(true);
  const [ober, setOber] = useState(true);

  const alle = useMemo(() => fn.stufen.map((n) => streifen(fn.f, fn.a, fn.b, n)), [fn]);
  const i = Math.min(stufe, fn.stufen.length - 1);
  const n = fn.stufen[i]!;
  const z = alle[i]!;
  const u = untersumme(z);
  const o = obersumme(z);
  const breite = (fn.b - fn.a) / n;
  const tx = (x: number, k = 3) => zahl(x, k).replace(',', '{,}').replace('−', '-');
  const zustand: Zustand = { fn, z, unter, ober };
  const beschreibung = `Schaubild von ${fn.sprech} über dem Intervall von ${fn.a} bis ${fn.b}, zerlegt in ${n} Streifen der Breite ${zahl(breite, 3)}. ${unter ? `Untersumme ${zahl(u, 3)}. ` : ''}${ober ? `Obersumme ${zahl(o, 3)}.` : ''}`;

  const wechsle = (neu: StreifenFunktion['id']) => {
    setFId(neu);
    setStufe(neu === 'ufer' ? 1 : 2);
  };

  return (
    <div className="labor">
      <p className="achsentitel">{fn.yTitel} (senkrecht), {fn.xTitel} (waagerecht)</p>
      <Zeichnung zustand={zustand} beschreibung={beschreibung} />

      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Randlinie der Fläche</li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Untersumme (kleinster Wert im Streifen)</li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Obersumme (größter Wert im Streifen, gestrichelt)</li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={fn.tex} />
        <p>
          Streifen: <Formel tex={`n=${n}`} nach="," /> Breite: <Formel tex={`${tx(breite)}`} nach="." />
        </p>
        {unter && (
          <p>
            Untersumme: <Formel tex={`${tx(u)}${fn.einheit}`} nach="." />
          </p>
        )}
        {ober && (
          <p>
            Obersumme: <Formel tex={`${tx(o)}${fn.einheit}`} nach="." />
          </p>
        )}
        {unter && ober && (
          <p>
            Unterschied: <Formel tex={`${tx(o - u)}${fn.einheit}`} nach="." />
          </p>
        )}
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Funktion</legend>
          <div className="schnellwahl">
            {STREIFEN_FUNKTIONEN.map((x) => (
              <button key={x.id} type="button" className="chip" aria-pressed={fId === x.id} onClick={() => wechsle(x.id)}>
                {x.name}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <div className="regler-gruppe">
            <Regler name="Anzahl n der Streifen" beschriftung={<Formel tex="n" />} wert={i} min={0} max={fn.stufen.length - 1} step={1} onChange={setStufe} anzeige={<Formel tex={`${n}`} />} />
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={unter} onChange={(e) => setUnter(e.target.checked)} /> Untersumme zeigen</label>
            <label className="schalter"><input type="checkbox" checked={ober} onChange={(e) => setOber(e.target.checked)} /> Obersumme zeigen</label>
          </fieldset>
        </div>
      </div>

      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Untersumme und Obersumme bei wachsender Streifenzahl</caption>
        <thead>
          <tr>
            <th scope="col"><Formel tex="n" /></th>
            <th scope="col">Breite</th>
            <th scope="col">Unter-<br />summe</th>
            <th scope="col">Ober-<br />summe</th>
            <th scope="col">Unter-<br />schied</th>
          </tr>
        </thead>
        <tbody>
          {fn.stufen.map((m, k) => {
            const uu = untersumme(alle[k]!);
            const oo = obersumme(alle[k]!);
            return (
              <tr key={m} aria-current={k === i ? 'true' : undefined} style={k === i ? { background: 'var(--akzent-hell)', fontWeight: 600 } : undefined}>
                <th scope="row">{m}</th>
                <td>{zahl((fn.b - fn.a) / m, 3)}</td>
                <td>{zahl(uu, 3)}</td>
                <td>{zahl(oo, 3)}</td>
                <td>{zahl(oo - uu, 3)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="labor-knoepfe">
        <span className="klein">Kleinster und größter Wert je Streifen sind aus dem Verlauf bestimmt und im Test gegen eine Rechnung von Hand geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => { wechsle('ufer'); setUnter(true); setOber(true); }}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
