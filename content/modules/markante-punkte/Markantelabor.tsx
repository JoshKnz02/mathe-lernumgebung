import { useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { markantePunkte, periode, type MarkanterPunkt, type PunktArt } from '@/lib/markante';
import { termSinus, wertTrig, type SinusParameter } from '@/lib/sinus';
import { piTex, zahlTex, zahlText } from '@/lib/zahlen';
import { REGLER, START, type Grundfunktion } from './daten';
import { PUNKT_STIL, stilFuer } from './PunkteSchaubild';

const PI = Math.PI;
const BEREICH: [number, number, number, number] = [-PI, 3 * PI, -6.5, 6.5];
/** Genug Plätze für alle Punkte im Bereich bei b = 4 (Viertelperiode π/8). */
const PLAETZE = { hochpunkt: 10, tiefpunkt: 10, wendepunkt: 18 } as const;

const ART_TEXT: Record<PunktArt, string> = {
  hochpunkt: 'Hochpunkt',
  tiefpunkt: 'Tiefpunkt',
  'wendepunkt-aufsteigend': 'Wendepunkt (aufsteigend)',
  'wendepunkt-absteigend': 'Wendepunkt (absteigend)',
};
const VIERTEL_TEX = ['c', 'c+\\tfrac{1}{4}p', 'c+\\tfrac{1}{2}p', 'c+\\tfrac{3}{4}p'];
const tex = (s: string) => (s.startsWith('-') ? `{${s}}` : s);

interface Zustand {
  p: SinusParameter;
  funktion: Grundfunktion;
  hp: MarkanterPunkt[];
  tp: MarkanterPunkt[];
  wp: MarkanterPunkt[];
  zeigeWendepunkte: boolean;
  zeigeExtrempunkte: boolean;
  zeigeLinien: boolean;
}

export function Markantelabor() {
  const [p, setP] = useState<SinusParameter>(START);
  const [funktion, setFunktion] = useState<Grundfunktion>('sin');
  const [zeigeWendepunkte, setWP] = useState(true);
  const [zeigeExtrempunkte, setEP] = useState(true);
  const [zeigeLinien, setLinien] = useState(true);
  const setze = (teil: Partial<SinusParameter>) => setP((q) => ({ ...q, ...teil }));

  const T = periode(p)!;
  const alle = markantePunkte(p, funktion, BEREICH[0], BEREICH[1]);
  const zustand: Zustand = {
    p,
    funktion,
    hp: alle.filter((m) => m.art === 'hochpunkt'),
    tp: alle.filter((m) => m.art === 'tiefpunkt'),
    wp: alle.filter((m) => m.art.startsWith('wendepunkt')),
    zeigeWendepunkte,
    zeigeExtrempunkte,
    zeigeLinien,
  };
  // Die vier markanten Punkte ab x = c, danach wiederholt sich der Ablauf.
  const periodePunkte = p.a === 0 ? [] : markantePunkte(p, funktion, p.c, p.c + (3 * T) / 4);
  const term = termSinus(p, 'g', { funktion, klammer: 'eckig' });

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={BEREICH}
        xTeilung={PI / 2}
        yTeilung={1}
        className="brett-3zu2"
        beschreibung={`Schaubild von g mit a = ${zahlText(p.a)}, b = ${zahlText(p.b)}, c = ${zahlText(p.c)} und d = ${zahlText(p.d)}. Markiert sind Hochpunkte, Tiefpunkte und Wendepunkte. Die Tabelle unter dem Schaubild nennt die markanten Punkte einer Periode.`}
        zustand={zustand}
        aufbau={(b, lies) => {
          const stil = { highlight: false, fixed: true };
          b.create('functiongraph', [(x: number) => wertTrig(lies().p, x, lies().funktion)], { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 3 });
          const waagerecht = (y: () => number, farbe: string) => b.create('line', [[0, y], [1, y]], { ...stil, strokeColor: farbe, strokeWidth: 1, dash: 2 });
          const linien = [
            waagerecht(() => lies().p.d, PUNKT_STIL.wendepunkt.farbe),
            waagerecht(() => lies().p.d + Math.abs(lies().p.a), PUNKT_STIL.hochpunkt.farbe),
            waagerecht(() => lies().p.d - Math.abs(lies().p.a), PUNKT_STIL.tiefpunkt.farbe),
          ];
          const pool = (art: 'hochpunkt' | 'tiefpunkt' | 'wendepunkt', liste: (z: Zustand) => MarkanterPunkt[]) =>
            Array.from({ length: PLAETZE[art] }, (_, i) =>
              (b.create('point', [() => liste(lies())[i]?.x ?? 0, () => liste(lies())[i]?.y ?? 0], {
                ...stil,
                withLabel: false,
                face: PUNKT_STIL[art].face,
                size: 6,
                strokeColor: PUNKT_STIL[art].farbe,
                fillColor: PUNKT_STIL[art].farbe,
              }) as GeometryElement),
            );
          const hp = pool('hochpunkt', (z) => z.hp);
          const tp = pool('tiefpunkt', (z) => z.tp);
          const wp = pool('wendepunkt', (z) => z.wp);
          return (z: Zustand) => {
            for (const e of linien) e.setAttribute({ visible: z.zeigeLinien });
            hp.forEach((e, i) => e.setAttribute({ visible: z.zeigeExtrempunkte && i < z.hp.length }));
            tp.forEach((e, i) => e.setAttribute({ visible: z.zeigeExtrempunkte && i < z.tp.length }));
            wp.forEach((e, i) => e.setAttribute({ visible: z.zeigeWendepunkte && i < z.wp.length }));
          };
        }}
      />

      <ul className="legende" aria-label="Legende">
        <li><span className="symbol" style={{ color: PUNKT_STIL.hochpunkt.farbe }} aria-hidden="true">▲</span> Hochpunkt (HP)</li>
        <li><span className="symbol" style={{ color: PUNKT_STIL.tiefpunkt.farbe }} aria-hidden="true">▼</span> Tiefpunkt (TP)</li>
        <li><span className="symbol" style={{ color: PUNKT_STIL.wendepunkt.farbe }} aria-hidden="true">◆</span> Wendepunkt (WP)</li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={term} />
      </div>

      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <fieldset className="funktionswahl">
            <legend>Funktion</legend>
            <label><input type="radio" name="markante-funktion" checked={funktion === 'sin'} onChange={() => setFunktion('sin')} /> Sinus</label>
            <label><input type="radio" name="markante-funktion" checked={funktion === 'cos'} onChange={() => setFunktion('cos')} /> Kosinus</label>
          </fieldset>
          <Regler name="Parameter a" beschriftung={<Formel tex="a" />} wert={p.a} {...REGLER.a} onChange={(a) => setze({ a })} anzeige={<Formel tex={zahlTex(p.a)} />} />
          <Regler name="Parameter b" beschriftung={<Formel tex="b" />} wert={p.b} {...REGLER.b} onChange={(b) => setze({ b })} anzeige={<Formel tex={piTex(p.b)} />} />
          <Regler name="Parameter c" beschriftung={<Formel tex="c" />} wert={p.c} {...REGLER.c} onChange={(c) => setze({ c })} anzeige={<Formel tex={piTex(p.c)} />} />
          <Regler name="Parameter d" beschriftung={<Formel tex="d" />} wert={p.d} {...REGLER.d} onChange={(d) => setze({ d })} anzeige={<Formel tex={zahlTex(p.d)} />} />
          <p className="klein">Hier ist immer <Formel tex="b>0" />.</p>
        </div>
        <dl className="kennwerte" aria-label="Kennwerte des Schaubilds" aria-live="polite">
          <div>
            <dt>Periode</dt>
            <dd><Formel tex={`p=\\frac{2\\pi}{b}=${piTex(T)}`} /></dd>
          </div>
          <div>
            <dt>Ruhelage</dt>
            <dd><Formel tex={`y=${zahlTex(p.d)}`} /></dd>
          </div>
          <div>
            <dt>Wertebereich</dt>
            <dd><Formel tex={p.a === 0 ? `W=\\{${zahlTex(p.d)}\\}` : `[${tex(zahlTex(p.d - Math.abs(p.a)))};\\,${tex(zahlTex(p.d + Math.abs(p.a)))}]`} /></dd>
          </div>
        </dl>
      </div>

      <div className="schnellwahl" role="group" aria-label="Normale Funktionen">
        <button type="button" className="chip" aria-pressed={funktion === 'sin' && p.a === 1 && p.b === 1 && p.c === 0 && p.d === 0} onClick={() => { setP(START); setFunktion('sin'); }}>
          Normale Sinusfunktion
        </button>
        <button type="button" className="chip" aria-pressed={funktion === 'cos' && p.a === 1 && p.b === 1 && p.c === 0 && p.d === 0} onClick={() => { setP(START); setFunktion('cos'); }}>
          Normale Kosinusfunktion
        </button>
      </div>

      <table className="tabelle tabelle-breit">
        <caption>Die markanten Punkte einer Periode ab <Formel tex="x=c" /></caption>
        <thead>
          <tr>
            <th scope="col">Stelle</th>
            <th scope="col"><Formel tex="x" /></th>
            <th scope="col"><Formel tex="y" /></th>
            <th scope="col">Art</th>
          </tr>
        </thead>
        <tbody>
          {periodePunkte.length === 0 ? (
            <tr><td colSpan={4}>Für <Formel tex="a=0" /> ist das Schaubild eine Gerade ohne markante Punkte.</td></tr>
          ) : (
            periodePunkte.map((m) => (
              <tr key={m.j}>
                <td><Formel tex={VIERTEL_TEX[m.j - periodePunkte[0]!.j] ?? 'c'} /></td>
                <td><Formel tex={piTex(m.x)} /></td>
                <td><Formel tex={zahlTex(m.y)} /></td>
                <td><span className="symbol" style={{ color: stilFuer(m).farbe }} aria-hidden="true">{m.art === 'hochpunkt' ? '▲' : m.art === 'tiefpunkt' ? '▼' : '◆'}</span> {ART_TEXT[m.art]}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="labor-knoepfe">
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={zeigeExtrempunkte} onChange={(e) => setEP(e.target.checked)} /> Hoch- und Tiefpunkte anzeigen</label>
          <label className="schalter"><input type="checkbox" checked={zeigeWendepunkte} onChange={(e) => setWP(e.target.checked)} /> Wendepunkte anzeigen</label>
          <label className="schalter"><input type="checkbox" checked={zeigeLinien} onChange={(e) => setLinien(e.target.checked)} /> Ruhelage und Wertebereich anzeigen</label>
        </fieldset>
        <button type="button" className="knopf-zweit" onClick={() => { setP(START); setFunktion('sin'); }}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
