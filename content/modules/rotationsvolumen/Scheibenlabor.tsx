import { useMemo, useState } from 'react';
import { FLAECHE_BLAU } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { dynamischeKurve } from '@/lib/dynkurve';
import { zahl } from '@/lib/flaeche';
import { rotationsvolumen, scheiben, type Scheiben } from '@/lib/rotation';
import { alsListen, ellipsen, radiusAussen, radiusInnen, trennstriche, umriss } from '@/lib/rotationsbild';
import { piText } from '@/lib/zahlen';
import { KOERPER, type Koerper } from './daten';

const FUNKTIONEN = KOERPER.filter((k) => !k.nurRechner);
const STIL = { highlight: false, fixed: true };
/** Trennstriche und Stirnflächen sind nur bei wenigen Scheiben zu erkennen. */
const MAX_TRENN = 50;
const MAX_ELLIPSE = 24;

interface Zustand {
  k: Koerper;
  s: Scheiben;
}

const LEER: [number[], number[]] = [[NaN], [NaN]];

function Zeichnung({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const k = zustand.k;
  const kx = 0.04 * (k.bereich[1] - k.bereich[0]);
  return (
    <Zeichenbrett
      bereich={k.bereich}
      xTeilung={k.teilung}
      yTeilung={k.yTeilung}
      xBeschriftung={k.trig ? 'pi' : 'zahl'}
      className="brett-3zu2"
      xTitel="x"
      yTitel="y"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const innen = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 1.5, fillColor: FLAECHE_BLAU, fillOpacity: 0.32 }, () => alsListen(umriss(lies().s.z, radiusInnen)));
        const aussen = dynamischeKurve(b, { strokeColor: SCHWARZ, strokeWidth: 2, dash: 3 }, () => alsListen(umriss(lies().s.z, radiusAussen)));
        const trenn = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 1 }, () => (lies().s.z.length <= MAX_TRENN ? alsListen(trennstriche(lies().s.z, radiusInnen)) : LEER));
        const stirn = dynamischeKurve(b, { strokeColor: SCHWARZ, strokeWidth: 1 }, () => (lies().s.z.length <= MAX_ELLIPSE ? alsListen(ellipsen(lies().s.z, radiusInnen, kx)) : LEER));
        b.create('functiongraph', [(x: number) => lies().k.f(x), k.a0, k.b0], { ...STIL, strokeColor: ORANGE, strokeWidth: 3.5 });
        b.create('functiongraph', [(x: number) => -lies().k.f(x), k.a0, k.b0], { ...STIL, strokeColor: ORANGE, strokeWidth: 2, dash: 3 });
        return () => {
          for (const c of [innen, aussen, trenn, stirn]) c.update();
        };
      }}
    />
  );
}

const tz = (x: number, n = 3) => zahl(x, n).replace(',', '{,}').replace('−', '-');

/**
 * Labor zu den Zylinderscheiben: Der Körper entsteht aus n Scheiben der Dicke (b − a)/n. Gefüllt sind die Zylinder von innen, gestrichelt umrandet die von außen.
 * Die Tabelle zeigt die Volumina für alle Stufen. Auf Wunsch erscheint der Vergleichswert π mal das Integral von f².
 */
export function Scheibenlabor() {
  const [id, setId] = useState<Koerper['id']>('zylinder');
  const [stufe, setStufe] = useState(2);
  const [vergleich, setVergleich] = useState(false);
  const k = FUNKTIONEN.find((x) => x.id === id)!;
  const alle = useMemo(() => k.stufen.map((n) => scheiben(k.f, k.a0, k.b0, n)), [k]);
  const i = Math.min(stufe, k.stufen.length - 1);
  const n = k.stufen[i]!;
  const s = alle[i]!;
  const dicke = (k.b0 - k.a0) / n;
  const exakt = rotationsvolumen(k.f, k.a0, k.b0);
  const stelle = (x: number) => (k.trig ? piText(x).replace('π', 'Pi') : String(x).replace('.', ',').replace('-', 'minus '));
  const zustand: Zustand = { k, s };
  const beschreibung = `Seitenansicht des Körpers zur Funktion f(x) gleich ${k.sprech} von ${stelle(k.a0)} bis ${stelle(k.b0)}, zerlegt in ${n} Zylinderscheiben der Dicke ${zahl(dicke, 3)}. Das Volumen der Zylinder von innen ist ${zahl(s.innen, 3)}, das der Zylinder von außen ${zahl(s.aussen, 3)}.`;

  const wechsle = (neu: Koerper['id']) => {
    setId(neu);
    setStufe(2);
  };

  return (
    <div className="labor">
      <Zeichnung zustand={zustand} beschreibung={beschreibung} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /> und ihr Spiegelbild (gestrichelt)</li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Zylinder von innen (kleinster Radius je Scheibe)</li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Zylinder von außen (größter Radius, gestrichelt)</li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${k.tex}`} />
        <p>
          Scheiben: <Formel tex={`n=${n}`} nach="," /> Dicke: <Formel tex={tz(dicke)} nach="." />
        </p>
        <p>
          Zylinder von innen: <Formel tex={tz(s.innen)} nach="." />
        </p>
        <p>
          Zylinder von außen: <Formel tex={tz(s.aussen)} nach="." />
        </p>
        <p>
          Unterschied: <Formel tex={tz(s.aussen - s.innen)} nach="." />
        </p>
        {vergleich && (
          <p>
            Vergleichswert <Formel tex={String.raw`\pi\cdot\int f(x)^2\,\mathrm{d}x`} nach=":" /> <Formel tex={tz(exakt)} nach="." />
          </p>
        )}
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Funktion <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {FUNKTIONEN.map((x) => (
              <button key={x.id} type="button" className="chip" aria-pressed={id === x.id} aria-label={`${x.name}, f gleich ${x.sprech}`} onClick={() => wechsle(x.id)}>
                {x.name}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <div className="regler-gruppe">
            <Regler name="Anzahl n der Scheiben" beschriftung={<Formel tex="n" />} wert={i} min={0} max={k.stufen.length - 1} step={1} onChange={setStufe} anzeige={<Formel tex={`${n}`} />} />
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={vergleich} onChange={(e) => setVergleich(e.target.checked)} /> Vergleichswert zeigen</label>
          </fieldset>
        </div>
      </div>

      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Volumen der Zylinder bei wachsender Scheibenzahl</caption>
        <thead>
          <tr>
            <th scope="col"><Formel tex="n" /></th>
            <th scope="col">Dicke</th>
            <th scope="col">innen</th>
            <th scope="col">außen</th>
            <th scope="col">Unter-<br />schied</th>
          </tr>
        </thead>
        <tbody>
          {k.stufen.map((m, j) => {
            const t = alle[j]!;
            return (
              <tr key={m} aria-current={j === i ? 'true' : undefined} style={j === i ? { background: 'var(--akzent-hell)', fontWeight: 600 } : undefined}>
                <th scope="row">{m}</th>
                <td>{zahl((k.b0 - k.a0) / m, 3)}</td>
                <td>{zahl(t.innen, 3)}</td>
                <td>{zahl(t.aussen, 3)}</td>
                <td>{zahl(t.aussen - t.innen, 3)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="labor-knoepfe">
        <span className="klein">Die Radien sind aus dem Verlauf von f bestimmt und im Test gegen eine Rechnung von Hand geprüft. Alle Volumina in Volumeneinheiten (VE).</span>
        <button type="button" className="knopf-zweit" onClick={() => { wechsle('zylinder'); setVergleich(false); }}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
