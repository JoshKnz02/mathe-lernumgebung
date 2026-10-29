import { useState } from 'react';
import { FLAECHE_BLAU } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { dynamischeKurve } from '@/lib/dynkurve';
import { zahlTeX } from '@/lib/flaeche';
import { integral, rundeIntegral } from '@/lib/integral';
import { kegel, kegelstumpf, kugel, quadrat, zylinder } from '@/lib/rotation';
import { alsListen, silhouette } from '@/lib/rotationsbild';
import { piText, piTex } from '@/lib/zahlen';
import { KOERPER, type Koerper } from './daten';

const find = (id: string) => KOERPER.find((k) => k.id === id)!;
const STIL = { highlight: false, fixed: true };

interface Zustand {
  k: Koerper;
  a: number;
  b: number;
}

/** Stelle als TeX: Vielfache von π bei der Sinusfunktion, sonst Dezimalzahl. */
const stelleTeX = (k: Koerper, x: number) => (k.trig ? piTex(x) : zahlTeX(x, 3));
const stelleText = (k: Koerper, x: number) => (k.trig ? piText(x).replace('π', 'Pi') : String(Math.round(x * 1000) / 1000).replace('.', ',').replace('-', 'minus '));
const wertTeX = (x: number) => zahlTeX(rundeIntegral(x), 3);

export interface Vergleich {
  name: string;
  /** Rechnung der Elementargeometrie als TeX. */
  tex: string;
  wert: number;
}

const r = (x: number) => zahlTeX(x, 3);

/** Passende Formel der Elementargeometrie zum Körper (Zylinder, Kegel, Kegelstumpf, Kugel, Halbkugel) oder null. */
export function vergleichsformel(k: Koerper, a: number, b: number): Vergleich | null {
  const h = b - a;
  if (h < 1e-9) return null;
  if (k.id === 'zylinder') return { name: 'Zylinder', tex: String.raw`\pi\cdot ${r(k.f(a))}^2\cdot ${r(h)}`, wert: zylinder(Math.abs(k.f(a)), h) };
  if (k.id === 'kegel' || k.id === 'kegel-unten') {
    const R = Math.abs(k.f(b));
    const kl = Math.abs(k.f(a));
    if (a === 0) return { name: 'Kegel', tex: String.raw`\frac{1}{3}\pi\cdot ${r(R)}^2\cdot ${r(h)}`, wert: kegel(R, h) };
    return { name: 'Kegelstumpf', tex: String.raw`\frac{\pi\cdot ${r(h)}}{3}\left(${r(R)}^2+${r(R)}\cdot ${r(kl)}+${r(kl)}^2\right)`, wert: kegelstumpf(R, kl, h) };
  }
  if (k.id === 'kugel') {
    if (a === -3 && b === 3) return { name: 'Kugel', tex: String.raw`\frac{4}{3}\pi\cdot 3^3`, wert: kugel(3) };
    if ((a === 0 && b === 3) || (a === -3 && b === 0)) return { name: 'Halbkugel', tex: String.raw`\frac{2}{3}\pi\cdot 3^3`, wert: kugel(3) / 2 };
  }
  return null;
}

/** Alle Werte, die das Labor zu f und den Grenzen a < b anzeigt: ∫f², V = π · ∫f² und die Formel der Elementargeometrie. */
export function volumenZeilen(k: Koerper, a: number, b: number) {
  const q = integral(quadrat(k.f), a, b);
  return { q, v: Math.PI * q, vergleich: vergleichsformel(k, a, b) };
}

/** Alle Zeichenketten der Tabelle (TeX), damit die Tests sie für alle Reglerstellen darstellen können. */
export function tabelleTeX(k: Koerper, a: number, b: number) {
  const z = volumenZeilen(k, a, b);
  const A = stelleTeX(k, a);
  const B = stelleTeX(k, b);
  return {
    werte: z,
    qTeX: [String.raw`\int_{${A}}^{${B}} f(x)^2\,\mathrm{d}x`, `=${wertTeX(z.q)}`] as [string, string],
    vTeX: [String.raw`V=\pi\cdot\int_{${A}}^{${B}} f(x)^2\,\mathrm{d}x`, `=${wertTeX(z.v)}`] as [string, string],
    vergleichTeX: z.vergleich ? ([z.vergleich.tex, `=${wertTeX(z.vergleich.wert)}`] as [string, string]) : null,
  };
}

function Zeichnung({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const k = zustand.k;
  const [, , ymin, ymax] = k.bereich;
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
        const koerper = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 1, fillColor: FLAECHE_BLAU, fillOpacity: 0.32 }, () => {
          const { k: kk, a, b: bb } = lies();
          const p = silhouette(kk.f, a, bb);
          return alsListen([...p, p[0]!]);
        });
        b.create('functiongraph', [(x: number) => lies().k.f(x)], { ...STIL, strokeColor: ORANGE, strokeWidth: 3.5 });
        b.create('functiongraph', [(x: number) => -lies().k.f(x)], { ...STIL, strokeColor: ORANGE, strokeWidth: 2, dash: 3 });
        const senkrecht = (x: () => number, farbe: string) => b.create('segment', [[x, ymin], [x, ymax]], { ...STIL, strokeColor: farbe, strokeWidth: 2 });
        const text = (x: () => number, s: string, farbe: string) => b.create('text', [x, ymax - (ymax - ymin) * 0.13, s], { ...STIL, strokeColor: farbe, anchorX: 'left', anchorY: 'top', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text', offset: [6, 0] });
        senkrecht(() => lies().a, BLAU);
        senkrecht(() => lies().b, SCHWARZ);
        text(() => lies().a, 'a', BLAU);
        text(() => lies().b, 'b', SCHWARZ);
        return () => koerper.update();
      }}
    />
  );
}

/**
 * Labor zum Rotationsvolumen: Die Fläche zwischen K_f und der x-Achse von a bis b rotiert um die x-Achse. Die Tabelle zeigt das Integral von f²,
 * das Volumen V gleich π mal dem Integral und, wenn der Körper ein Zylinder, Kegel, Kegelstumpf, eine Kugel oder Halbkugel ist, den Wert der Formel der Elementargeometrie.
 */
export function Volumenlabor() {
  const [kId, setKId] = useState<Koerper['id']>('kegel');
  const [ia, setIa] = useState(find('kegel').start[0]);
  const [ib, setIb] = useState(find('kegel').start[1]);

  const k = find(kId);
  const kl = (i: number) => Math.min(Math.max(i, k.imin), k.imax);
  const ka = Math.min(kl(ia), kl(ib) - 1);
  const kb = Math.max(kl(ib), ka + 1);
  const a = ka * k.schritt;
  const b = kb * k.schritt;
  const zustand: Zustand = { k, a, b };

  const tab = tabelleTeX(k, a, b);
  const { v } = tab.werte;
  const beschreibung = `Seitenansicht des Körpers zur Funktion f(x) gleich ${k.sprech} von a gleich ${stelleText(k, a)} bis b gleich ${stelleText(k, b)}. Oben liegt das Schaubild, unten sein Spiegelbild. Das Volumen ist ${String(rundeIntegral(v)).replace('.', ',')} Volumeneinheiten.`;

  const wechsle = (id: Koerper['id']) => {
    const neu = find(id);
    setKId(id);
    setIa(neu.start[0]);
    setIb(neu.start[1]);
  };

  return (
    <div className="labor">
      <Zeichnung zustand={zustand} beschreibung={beschreibung} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /> und ihr Spiegelbild (gestrichelt)</li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_BLAU }} aria-hidden="true" /> Seitenansicht des Körpers</li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Grenzen <Formel tex="a" /> (blau) und <Formel tex="b" /> (schwarz)</li>
      </ul>

      <table className="tabelle tabelle-kompakt">
        <caption>
          Werte für <Formel tex={`f(x)=${k.tex}`} />
        </caption>
        <tbody aria-live="polite">
          <tr>
            <th scope="row"><Formel tex={tab.qTeX[0]} /></th>
            <td><Formel tex={tab.qTeX[1]} /></td>
          </tr>
          <tr>
            <th scope="row"><Formel tex={tab.vTeX[0]} /></th>
            <td><Formel tex={tab.vTeX[1]} /></td>
          </tr>
          {tab.vergleichTeX && (
            <tr>
              <th scope="row">
                {tab.werte.vergleich!.name}: <Formel tex={tab.vergleichTeX[0]} />
              </th>
              <td><Formel tex={tab.vergleichTeX[1]} /></td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="klein">Die Werte bestimmt das Labor numerisch aus sehr schmalen Streifen. Sie sind im Test gegen von Hand bestimmte Werte und gegen die Formeln der Elementargeometrie geprüft. Alle Volumina in Volumeneinheiten (VE).</p>

      <div className="labor-bedienung">
        <div>
          <fieldset className="schalter-gruppe">
            <legend>Funktion <Formel tex="f" /></legend>
            <div className="schnellwahl">
              {KOERPER.map((x) => (
                <button key={x.id} type="button" className="chip" aria-pressed={kId === x.id} aria-label={`${x.name}, f gleich ${x.sprech}`} onClick={() => wechsle(x.id)}>
                  <Formel tex={x.tex} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="regler-gruppe">
          <Regler name="Untere Grenze a" beschriftung={<Formel tex="a" />} wert={ka} min={k.imin} max={k.imax - 1} step={1} onChange={(i) => setIa(Math.min(i, kb - 1))} anzeige={<Formel tex={stelleTeX(k, a)} />} />
          <Regler name="Obere Grenze b" beschriftung={<Formel tex="b" />} wert={kb} min={k.imin + 1} max={k.imax} step={1} onChange={(i) => setIb(Math.max(i, ka + 1))} anzeige={<Formel tex={stelleTeX(k, b)} />} />
        </div>
      </div>

      <div className="labor-knoepfe">
        <span className="klein" />
        <button type="button" className="knopf-zweit" onClick={() => wechsle('kegel')}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
