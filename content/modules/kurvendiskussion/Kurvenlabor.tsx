import type { Board } from 'jsxgraph';
import { useMemo, useState, type ReactNode } from 'react';
import { BLAU, GRUEN, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Formel } from '@/components/Formel';
import { ROSA, vorzeichenBereiche, type VorzeichenBereich } from '@/components/Paarbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { ankerUndVersatz, beschriftungsLage } from '@/lib/beschriftung';
import { BUCHSTABE } from '@/lib/grafisch';
import { KURVEN_FUNKTIONEN, findeKurve, kandidaten, kruemmungWort, pruefwerte, type KurvenFunktion, type Vorzeichen } from '@/lib/kurve';
import { piText, piTex, zahlText, zahlTex } from '@/lib/zahlen';

const MAX_STELLEN = 9;
const MAX_BALKEN = 6;
const stil = { highlight: false, fixed: true };

interface Zustand {
  fn: KurvenFunktion;
  x0: number;
  bereiche: boolean;
  marken: boolean;
  balkenDf: VorzeichenBereich[];
  balkenDdf: VorzeichenBereich[];
}

type Brett = 'f' | 'df' | 'ddf';
const FARBE: Record<Brett, string> = { f: ORANGE, df: GRUEN, ddf: ROSA };
const kurveVon = (fn: KurvenFunktion, b: Brett) => (b === 'f' ? fn.f : b === 'df' ? fn.df : fn.ddf);
const bereichVon = (fn: KurvenFunktion, b: Brett): [number, number, number, number] => [fn.x[0], fn.x[1], ...(b === 'f' ? fn.yF : b === 'df' ? fn.yDf : fn.yDdf)] as [number, number, number, number];

const SYMBOL: Record<Vorzeichen, string> = { plus: '+', minus: '−', null: '0' };
const WORT: Record<Vorzeichen, string> = { plus: 'positiv', minus: 'negativ', null: 'null' };

const KF = <Formel tex="K_f" />;

/**
 * Labor zum Zusammenhang von f, f′ und f″: Oben K_f mit der Tangente an der Stelle x₀, in der Mitte K_f′ mit dem Punkt (x₀ | f′(x₀)) und der Tangente
 * an K_f′ (ihre Steigung ist f″(x₀)), unten K_f″. Die Tabelle zeigt die Vorzeichen von f′ und f″ links und rechts von x₀ und die Werte bei x₀.
 * Auf Wunsch werden die Bereiche mit positivem und negativem Vorzeichen auf der x-Achse gefärbt und die besonderen Stellen (H, T, W, S) markiert.
 */
export function Kurvenlabor({ start = 'kubisch' }: { start?: string }) {
  const [id, setId] = useState(start);
  const [x0, setX0] = useState(findeKurve(start).xStart);
  const [bereiche, setBereiche] = useState(false);
  const [marken, setMarken] = useState(false);
  const fn = findeKurve(id);
  const x = Math.min(Math.max(x0, fn.xMin), fn.xMax);
  const balkenDf = useMemo(() => vorzeichenBereiche(fn.df, fn.nullenDf, fn.x[0], fn.x[1]), [fn]);
  const balkenDdf = useMemo(() => vorzeichenBereiche(fn.ddf, fn.nullenDdf, fn.x[0], fn.x[1]), [fn]);
  const z: Zustand = { fn, x0: x, bereiche, marken, balkenDf, balkenDdf };
  const p = pruefwerte(fn, x);
  const xTex = (v: number) => (fn.pi ? piTex(v) : zahlTex(v));
  const xText = (v: number) => (fn.pi ? piText(v) : zahlText(v));
  const m = p.bei.df;
  const k = kruemmungWort(p.bei.ddf);
  const wechsle = (neu: string) => {
    setId(neu);
    setX0(findeKurve(neu).xStart);
  };
  const xBeschriftung = fn.pi ? ('pi' as const) : ('zahl' as const);
  const stellenText = marken ? ' Die besonderen Stellen sind markiert.' : '';
  const bereicheText = bereiche ? ' Auf der x-Achse sind die Bereiche mit positivem Wert blau und die mit negativem Wert schwarz markiert.' : '';

  const baue = (welches: Brett) => (b: Board, lies: () => Zustand) => {
    const g = (t: number) => kurveVon(lies().fn, welches)(t);
    b.create('functiongraph', [g], { ...stil, strokeColor: FARBE[welches], strokeWidth: 3.5 });
    // Tangente: an K_f mit der Steigung f′(x₀), an K_f′ mit der Steigung f″(x₀)
    if (welches !== 'ddf') {
      const steigung = () => (welches === 'f' ? lies().fn.df(lies().x0) : lies().fn.ddf(lies().x0));
      b.create('functiongraph', [(t: number) => g(lies().x0) + steigung() * (t - lies().x0)], { ...stil, strokeColor: BLAU, strokeWidth: 2.5 });
    }
    b.create('segment', [[() => lies().x0, 0], [() => lies().x0, () => g(lies().x0)]], { ...stil, strokeColor: BLAU, strokeWidth: 1.5, dash: 2 });
    b.create('point', [() => lies().x0, () => g(lies().x0)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
    // Bereiche mit gleichem Vorzeichen auf der x-Achse (nur bei K_f′ und K_f″)
    const balken =
      welches === 'f'
        ? []
        : Array.from({ length: MAX_BALKEN }, (_, i) => {
            const von = () => (welches === 'df' ? lies().balkenDf : lies().balkenDdf)[i]?.von ?? NaN;
            const bis = () => (welches === 'df' ? lies().balkenDf : lies().balkenDdf)[i]?.bis ?? NaN;
            return b.create('segment', [[von, 0], [bis, 0]], { ...stil, strokeColor: BLAU, strokeWidth: 6, visible: false });
          });
    // Beschriftung der besonderen Stellen auf einer freien Seite des Punkts, nie auf dem Schaubild (lib/beschriftung.ts)
    const marker = Array.from({ length: MAX_STELLEN }, (_, i) => {
      const sx = () => lies().fn.stellen[i]?.x ?? NaN;
      const seg = b.create('segment', [[sx, 0], [sx, () => g(sx())]], { ...stil, strokeColor: SCHWARZ, strokeWidth: 1.5, dash: 2, visible: false });
      const fn0 = lies().fn;
      const bereich0 = bereichVon(fn0, welches);
      const st = fn0.stellen[i];
      const lage = st ? beschriftungsLage({ x: st.x, y: kurveVon(fn0, welches)(st.x) }, bereich0, [{ f: kurveVon(fn0, welches) }], true, true) : 'oben';
      const pos = ankerUndVersatz(lage, bereich0);
      const text = b.create('text', [() => sx() + pos.dx, () => g(sx()) + pos.dy, () => (lies().fn.stellen[i] ? BUCHSTABE[lies().fn.stellen[i]!.typ] : '')], {
        ...stil,
        strokeColor: SCHWARZ,
        anchorX: pos.anchorX,
        anchorY: pos.anchorY,
        fontSize: 14,
        cssClass: 'bild-text',
        highlightCssClass: 'bild-text',
        visible: false,
      });
      return [seg, text] as const;
    });
    return (zz: Zustand) => {
      marker.forEach(([seg, text], i) => {
        const sichtbar = zz.marken && i < zz.fn.stellen.length;
        seg.setAttribute({ visible: sichtbar });
        text.setAttribute({ visible: sichtbar });
      });
      balken.forEach((s, i) => {
        const bb = (welches === 'df' ? zz.balkenDf : zz.balkenDdf)[i];
        s.setAttribute({ visible: zz.bereiche && !!bb, strokeColor: bb?.positiv ? BLAU : SCHWARZ });
      });
    };
  };

  const brett = (welches: Brett, beschreibung: string): ReactNode => (
    <Zeichenbrett
      key={`${fn.id}-${welches}`}
      bereich={bereichVon(fn, welches)}
      xTeilung={fn.teilung}
      yTeilung={welches === 'f' ? fn.yTeilungF : welches === 'df' ? fn.yTeilungDf : fn.yTeilungDdf}
      xBeschriftung={xBeschriftung}
      className="brett-flach"
      beschreibung={beschreibung}
      zustand={z}
      aufbau={baue(welches)}
    />
  );

  const zelle = (v: Vorzeichen) => <td>{SYMBOL[v]}</td>;
  return (
    <div className="labor">
      {brett('f', `Schaubild K f von f(x) = ${fn.sprech} mit der Tangente im Punkt bei x gleich ${xText(x)}. Die Tangente hat die Steigung ${zahlText(m)}.${stellenText}`)}
      {brett('df', `Schaubild der Ableitungsfunktion K f Strich. Der Punkt bei x gleich ${xText(x)} hat die Höhe ${zahlText(m)}, die Tangente an K f Strich dort hat die Steigung ${zahlText(p.bei.ddf)}.${stellenText}${bereicheText}`)}
      {brett('ddf', `Schaubild K f Zweistrich der zweiten Ableitung. Der Punkt bei x gleich ${xText(x)} hat die Höhe ${zahlText(p.bei.ddf)}.${stellenText}${bereicheText}`)}
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> oben: <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: GRUEN }} aria-hidden="true" /> Mitte: <Formel tex="K_{f'}" /></li>
        <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> unten: <Formel tex="K_{f''}" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Tangente und Punkt bei <Formel tex="x_0" /></li>
      </ul>
      {bereiche && (
        <p className="klein">
          Auf der x-Achse von <Formel tex="K_{f'}" /> und <Formel tex="K_{f''}" /> sind die Bereiche blau markiert, in denen der Wert positiv ist, und schwarz, in denen er negativ ist.
        </p>
      )}

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${fn.tex}`} />
        <p>
          Stelle <Formel tex={`x_0=${xTex(x)}`} nach="." /> Es ist <Formel tex={`f'(x_0)=${zahlTex(m)}`} nach="," /> <Formel tex={`f''(x_0)=${zahlTex(p.bei.ddf)}`} /> und <Formel tex={`f'''(x_0)=${zahlTex(p.bei.dddf)}`} nach="." />{' '}
          {Math.abs(m) < 1e-6 ? <>Die Tangente an {KF} ist waagerecht.</> : m > 0 ? <>Die Tangente an {KF} steigt.</> : <>Die Tangente an {KF} fällt.</>}{' '}
          {k === 'links' && <>Die Tangente an <Formel tex="K_{f'}" /> steigt, {KF} ist linksgekrümmt.</>}
          {k === 'rechts' && <>Die Tangente an <Formel tex="K_{f'}" /> fällt, {KF} ist rechtsgekrümmt.</>}
          {k === 'null' && <>Die Tangente an <Formel tex="K_{f'}" /> ist waagerecht. Schau dir die Vorzeichen links und rechts an.</>}
        </p>
        <table className="tabelle tabelle-kompakt">
          <caption>Vorzeichen im Abstand {zahlText(p.abstand)} links und rechts von <Formel tex="x_0" /></caption>
          <thead>
            <tr>
              <th scope="col"><span className="nur-lesegeraet">Größe</span></th>
              <th scope="col">links</th>
              <th scope="col">bei <Formel tex="x_0" /></th>
              <th scope="col">rechts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><Formel tex="f'" /></th>
              {zelle(p.links.df)}
              <td><Formel tex={zahlTex(p.bei.df)} /></td>
              {zelle(p.rechts.df)}
            </tr>
            <tr>
              <th scope="row"><Formel tex="f''" /></th>
              {zelle(p.links.ddf)}
              <td><Formel tex={zahlTex(p.bei.ddf)} /></td>
              {zelle(p.rechts.ddf)}
            </tr>
          </tbody>
        </table>
        <p className="klein">
          Links von <Formel tex="x_0" /> ist <Formel tex="f'" /> {WORT[p.links.df]} und <Formel tex="f''" /> {WORT[p.links.ddf]}, rechts davon ist <Formel tex="f'" /> {WORT[p.rechts.df]} und <Formel tex="f''" /> {WORT[p.rechts.ddf]}.
        </p>
      </div>

      <div className="labor-bedienung">
        <div>
          <fieldset className="schalter-gruppe">
            <legend>Funktion <Formel tex="f" /></legend>
            <div className="schnellwahl">
              {KURVEN_FUNKTIONEN.map((a) => (
                <button key={a.id} type="button" className="chip" aria-pressed={id === a.id} aria-label={a.sprech} onClick={() => wechsle(a.id)}>
                  <Formel tex={a.tex} />
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="schalter-gruppe">
            <legend>Zu einer Stelle springen, an der <Formel tex="f'" /> oder <Formel tex="f''" /> null ist</legend>
            <div className="schnellwahl">
              {kandidaten(fn).map((kx) => (
                <button key={kx} type="button" className="chip" aria-pressed={Math.abs(kx - x) < 1e-9} aria-label={`Stelle ${xText(kx)}`} onClick={() => setX0(kx)}>
                  <Formel tex={`x_0=${xTex(kx)}`} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div>
          <div className="regler-gruppe">
            <Regler name="Stelle x0" beschriftung={<Formel tex="x_0" />} wert={x} min={fn.xMin} max={fn.xMax} step={fn.xSchritt} onChange={setX0} anzeige={<Formel tex={xTex(x)} />} />
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={bereiche} onChange={(e) => setBereiche(e.target.checked)} /> Vorzeichen auf der x-Achse färben</label>
            <label className="schalter"><input type="checkbox" checked={marken} onChange={(e) => setMarken(e.target.checked)} /> besondere Stellen markieren (H, T, W, S)</label>
          </fieldset>
        </div>
      </div>
      <div className="labor-knoepfe">
        <span className="klein">Die Ableitungen sind von Hand bestimmt und im Test gegen die numerische Ableitung geprüft. H: Hochpunkt, T: Tiefpunkt, W: Wendestelle, S: Sattelstelle.</span>
        <button type="button" className="knopf-zweit" onClick={() => { wechsle(start); setBereiche(false); setMarken(false); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}
