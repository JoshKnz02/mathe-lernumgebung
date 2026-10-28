import type { Board } from 'jsxgraph';
import { useMemo, useState } from 'react';
import { Formel } from '@/components/Formel';
import { ORANGE } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { VERSATZ, beschriftungsLage, type BeschriftungsLage } from '@/lib/beschriftung';
import { scharAnzahl, scharF, scharStellen, type ScharTyp } from '@/lib/diskussion';
import { zahlText, zahlTex } from '@/lib/zahlen';

export const SCHAR_FENSTER: [number, number, number, number] = [-3, 3, -10, 12];
export const SCHAR_TEILUNG = { x: 1, y: 2 };
const MAX_PUNKTE = 7;
const stil = { highlight: false, fixed: true };
const NAME: Record<ScharTyp, string> = { N: 'Nullstelle', H: 'Hochpunkt', T: 'Tiefpunkt', W: 'Wendepunkt' };

export interface Marke {
  typ: ScharTyp;
  x: number;
  y: number;
  /** Mittelpunkt der Beschriftung. */
  tx: number;
  ty: number;
  lage: BeschriftungsLage;
}
/** Die besonderen Stellen von K_{f_a} mit der Mitte ihrer Beschriftung, auf einer freien Seite des Punkts (siehe lib/beschriftung.ts). */
export function scharMarken(a: number): Marke[] {
  const [xmin, xmax, ymin, ymax] = SCHAR_FENSTER;
  const f = scharF(a);
  return scharStellen(a).map((s) => {
    const lage = beschriftungsLage({ x: s.x, y: s.y }, SCHAR_FENSTER, [{ f }], false, true, SCHAR_TEILUNG);
    const [vx, vy] = VERSATZ[lage];
    return { ...s, lage, tx: s.x + vx * (xmax - xmin), ty: s.y + vy * (ymax - ymin) };
  });
}

interface Zustand {
  a: number;
  markieren: boolean;
  marken: Marke[];
}

/**
 * Labor zur Funktionenschar f_a(x) = x⁴ − 2a·x² (Forschungsaufgabe): Der Parameter a lässt sich verändern, die besonderen Punkte werden markiert und auf Wunsch
 * aufgelistet und gezählt. Die Punkte sind von Hand bestimmt (src/lib/diskussion.ts) und im Test unabhängig geprüft. Die Beschriftungen setzt `beschriftungsLage`
 * auf eine freie Seite des Punkts.
 */
export function Scharlabor({ start = 1 }: { start?: number }) {
  const [a, setA] = useState(start);
  const [markieren, setMarkieren] = useState(false);
  const [auflisten, setAuflisten] = useState(false);
  const stellen = useMemo(() => scharStellen(a), [a]);
  const marken = useMemo<Marke[]>(() => scharMarken(a), [a]);
  const anzahl = scharAnzahl(a);
  const z: Zustand = { a, markieren, marken };

  const baue = (b: Board, lies: () => Zustand) => {
    b.create('functiongraph', [(t: number) => scharF(lies().a)(t)], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
    const paare = Array.from({ length: MAX_PUNKTE }, (_, i) => {
      const punkt = b.create('point', [() => lies().marken[i]?.x ?? NaN, () => lies().marken[i]?.y ?? NaN], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: ORANGE, fillColor: ORANGE, visible: false });
      const text = b.create('text', [() => lies().marken[i]?.tx ?? NaN, () => lies().marken[i]?.ty ?? NaN, () => lies().marken[i]?.typ ?? ''], {
        ...stil,
        strokeColor: ORANGE,
        anchorX: 'middle',
        anchorY: 'middle',
        fontSize: 14,
        cssClass: 'bild-text',
        highlightCssClass: 'bild-text',
        visible: false,
      });
      return [punkt, text] as const;
    });
    return (zz: Zustand) =>
      paare.forEach(([punkt, text], i) => {
        const sichtbar = zz.markieren && i < zz.marken.length;
        punkt.setAttribute({ visible: sichtbar });
        text.setAttribute({ visible: sichtbar });
      });
  };

  const koeffizient = (c: number) => (c === 1 ? '' : zahlTex(c));
  const termTex = (w: number) => `x^4${w === 0 ? '' : `${w < 0 ? '+' : '-'}${koeffizient(Math.abs(2 * w))}x^2`}`;
  const punktTex = (m: { typ: ScharTyp; x: number; y: number }) => `${m.typ}\\left(${zahlTex(m.x)}\\,\\middle|\\,${zahlTex(m.y)}\\right)`;
  const beschreibung = `Schaubild K f a von f a (x) gleich x hoch 4 minus ${zahlText(2 * a)} x Quadrat für a gleich ${zahlText(a)}.${markieren ? ` Markiert sind ${stellen.map((s) => `${NAME[s.typ]} bei x gleich ${zahlText(s.x).replace('−', 'minus ')}`).join(', ')}.` : ''}`;
  return (
    <div className="labor">
      <Zeichenbrett bereich={SCHAR_FENSTER} xTeilung={SCHAR_TEILUNG.x} yTeilung={SCHAR_TEILUNG.y} xBeschriftung="zahl" className="brett-3zu2" beschreibung={beschreibung} zustand={z} aufbau={baue} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_{f_a}" /></li>
        {markieren && <li>N Nullstelle, H Hochpunkt, T Tiefpunkt, W Wendepunkt</li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f_a(x)=x^4-2ax^2`} />
        <p>
          Für <Formel tex={`a=${zahlTex(a)}`} /> ist <Formel tex={`f_{${zahlTex(a)}}(x)=${termTex(a)}`} nach="." />
        </p>
        {auflisten && (
          <>
            <table className="tabelle tabelle-kompakt tabelle-breit">
              <caption>Anzahl der Stellen bei <Formel tex={`a=${zahlTex(a)}`} /></caption>
              <thead>
                <tr>
                  <th scope="col">Nullstellen</th>
                  <th scope="col">Extrempunkte</th>
                  <th scope="col">Wendepunkte</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>{anzahl.nullstellen}</td><td>{anzahl.extrempunkte}</td><td>{anzahl.wendepunkte}</td></tr>
              </tbody>
            </table>
            <ul className="liste">
              {stellen.map((s, i) => (
                <li key={i}>
                  {NAME[s.typ]} <Formel tex={punktTex(s)} nach={i === stellen.length - 1 ? '.' : ';'} />
                </li>
              ))}
            </ul>
            <p className="klein">Werte auf zwei Nachkommastellen gerundet. Im Ursprung fallen bei <Formel tex="a>0" /> Hochpunkt und Nullstelle zusammen, bei <Formel tex={String.raw`a\le 0`} /> Tiefpunkt und Nullstelle.</p>
          </>
        )}
      </div>

      <div className="labor-bedienung">
        <div>
          <div className="regler-gruppe">
            <Regler name="Parameter a" beschriftung={<Formel tex="a" />} wert={a} min={-2} max={3} step={0.5} onChange={setA} anzeige={<Formel tex={zahlTex(a)} />} />
          </div>
        </div>
        <div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={markieren} onChange={(e) => setMarkieren(e.target.checked)} /> besondere Punkte markieren</label>
            <label className="schalter"><input type="checkbox" checked={auflisten} onChange={(e) => setAuflisten(e.target.checked)} /> Punkte auflisten und zählen</label>
          </fieldset>
        </div>
      </div>
      <div className="labor-knoepfe">
        <span className="klein">Die Punkte sind von Hand bestimmt und im Test gegen numerische Verfahren geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => { setA(start); setMarkieren(false); setAuflisten(false); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}
