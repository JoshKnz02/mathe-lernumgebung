import type { Board, GeometryElement } from 'jsxgraph';
import { useMemo, useState } from 'react';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { DOSE, PARALLELOGRAMM, RAND, SCHACHTEL, SITUATIONEN, randpunkte, type Situation, type SituationId } from '@/lib/optimierung';
import { zahlText, zahlTex } from '@/lib/zahlen';

const stil = { highlight: false, fixed: true };
const GELB = '#E69F00';
const MAX_MERKEN = 12;

/** Fenster, Teilung und Beschreibung der Figur je Situation. */
const FIGUR: Record<SituationId, { fenster: [number, number, number, number]; x: number; y: number; sprech: string }> = {
  schachtel: { fenster: [-1, 25, -1, 16], x: 3, y: 3, sprech: 'Blatt 24 mal 15 Zentimeter mit vier Eckquadraten der Seitenlänge x' },
  parallelogramm: { fenster: [-1, 14, -1, 9], x: 2, y: 2, sprech: 'Rechteck 12 mal 8 mit einbeschriebenem Parallelogramm' },
  rand: { fenster: [-1, 10, -2, 28], x: 1, y: 4, sprech: 'Schaubild K f mit Rechteck R B P Q' },
  dose: { fenster: [-30, 30, -4, 36], x: 10, y: 10, sprech: 'Seitenansicht einer Dose' },
};

interface Zustand {
  s: Situation;
  u: number;
  kurve: boolean;
  tangente: boolean;
  rand: boolean;
  stellen: boolean;
  gemerkt: number[];
}

const punkt = (b: Board, x: number | (() => number), y: number | (() => number)) => b.create('point', [x, y], { ...stil, withLabel: false, visible: false, size: 1 }) as GeometryElement;
const flaeche = (b: Board, ecken: GeometryElement[], farbe: string, deckung: number, rand = farbe, dash = 0) =>
  b.create('polygon', ecken, { ...stil, vertices: { visible: false }, borders: { ...stil, strokeColor: rand, strokeWidth: 2, dash }, fillColor: farbe, fillOpacity: deckung });

/** Zeichnet die Figur der Situation, abhängig von der Stelle u. */
function baueFigur(b: Board, lies: () => Zustand) {
  const u = () => lies().u;
  const id = lies().s.id;
  if (id === 'schachtel') {
    const { laenge: L, breite: B } = SCHACHTEL;
    flaeche(b, [punkt(b, 0, 0), punkt(b, L, 0), punkt(b, L, B), punkt(b, 0, B)], '#ffffff', 0, SCHWARZ);
    for (const [ex, ey] of [[0, 0], [1, 0], [1, 1], [0, 1]] as const) {
      const x0 = () => (ex ? L - u() : 0);
      const y0 = () => (ey ? B - u() : 0);
      flaeche(b, [punkt(b, x0, y0), punkt(b, () => x0() + u(), y0), punkt(b, () => x0() + u(), () => y0() + u()), punkt(b, x0, () => y0() + u())], '#9aa5b1', 0.6, '#5b6773');
    }
    flaeche(b, [punkt(b, u, u), punkt(b, () => L - u(), u), punkt(b, () => L - u(), () => B - u()), punkt(b, u, () => B - u())], '#ffffff', 0, BLAU, 2);
  } else if (id === 'parallelogramm') {
    const { laenge: L, hoehe: H } = PARALLELOGRAMM;
    flaeche(b, [punkt(b, 0, 0), punkt(b, L, 0), punkt(b, L, H), punkt(b, 0, H)], '#ffffff', 0, SCHWARZ);
    flaeche(b, [punkt(b, u, 0), punkt(b, L, u), punkt(b, () => L - u(), H), punkt(b, 0, () => H - u())], ORANGE, 0.3, ORANGE);
  } else if (id === 'rand') {
    b.create('functiongraph', [RAND.f, 0, RAND.b], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5 });
    const q = punkt(b, u, () => RAND.f(u()));
    flaeche(b, [punkt(b, u, 0), punkt(b, RAND.b, 0), punkt(b, RAND.b, () => RAND.f(u())), q], BLAU, 0.25, BLAU);
    b.create('point', [u, () => RAND.f(u())], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: ORANGE, fillColor: ORANGE });
  } else {
    const h = () => DOSE.volumen / (Math.PI * u() * u());
    flaeche(b, [punkt(b, () => -u(), 0), punkt(b, u, 0), punkt(b, u, h), punkt(b, () => -u(), h)], ORANGE, 0.25, ORANGE);
  }
}

/** Die Elemente der Zielfunktion: Schaubild, aktueller Punkt, Tangente, gemerkte Punkte, Randwerte und Stellen mit Z′ = 0. */
function baueZielfunktion(b: Board, lies: () => Zustand) {
  const s0 = lies().s;
  const [xmin, xmax] = s0.fenster;
  const von = Math.max(Number.isFinite(s0.von) ? s0.von : xmin, s0.id === 'dose' ? s0.reglerMin : xmin);
  const bis = Math.min(Number.isFinite(s0.bis) ? s0.bis : xmax, xmax);
  const kurve = b.create('functiongraph', [s0.z, von, bis], { ...stil, strokeColor: ORANGE, strokeWidth: 3.5, visible: false });
  const t = b.create('functiongraph', [(x: number) => lies().s.z(lies().u) + lies().s.dz(lies().u) * (x - lies().u)], { ...stil, strokeColor: BLAU, strokeWidth: 2, dash: 3, visible: false });
  b.create('point', [() => lies().u, () => lies().s.z(lies().u)], { ...stil, withLabel: false, face: 'o', size: 6, strokeColor: '#ffffff', fillColor: BLAU });
  const merk = Array.from({ length: MAX_MERKEN }, (_, i) => b.create('point', [() => lies().gemerkt[i] ?? NaN, () => (lies().gemerkt[i] === undefined ? NaN : lies().s.z(lies().gemerkt[i]!))], { ...stil, withLabel: false, face: 'o', size: 4, strokeColor: SCHWARZ, fillColor: SCHWARZ, visible: false }));
  const rp = randpunkte(s0).map((p) => b.create('point', [p.x, p.y], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: SCHWARZ, fillColor: p.offen ? '#ffffff' : SCHWARZ, strokeWidth: p.offen ? 2 : 1, visible: false }));
  const st = s0.stellen.map((x) => b.create('point', [x, s0.z(x)], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: GELB, fillColor: GELB, visible: false }));
  return (z: Zustand) => {
    kurve.setAttribute({ visible: z.kurve });
    t.setAttribute({ visible: z.tangente });
    merk.forEach((p, i) => p.setAttribute({ visible: i < z.gemerkt.length }));
    rp.forEach((p) => p.setAttribute({ visible: z.rand }));
    st.forEach((p) => p.setAttribute({ visible: z.stellen }));
  };
}

const zeile = (x: number, e: string) => `${zahlText(x)} ${e}`;

/**
 * Labor zum Optimieren: Eine Figur mit einer veränderlichen Größe (Regler), die Zielfunktion als Schaubild, auf Wunsch Tangente, Randwerte und die Stellen mit
 * Z′ = 0. „Wert merken“ legt Punkte der Zielfunktion ab, aus denen sich die Lernenden das Schaubild selbst erschließen können.
 * Zielfunktion, Ableitung und besondere Stellen sind von Hand bestimmt (src/lib/optimierung.ts) und im Test unabhängig geprüft.
 */
export function Optimierungslabor({ situation }: { situation: SituationId }) {
  const s = SITUATIONEN[situation];
  const fig = FIGUR[situation];
  const [u, setU] = useState(s.start);
  const [kurve, setKurve] = useState(false);
  const [tangente, setTangente] = useState(false);
  const [rand, setRand] = useState(false);
  const [stellen, setStellen] = useState(false);
  const [gemerkt, setGemerkt] = useState<number[]>([]);
  const z: Zustand = { s, u, kurve, tangente, rand, stellen, gemerkt };
  const masse = useMemo(() => s.masse(u), [s, u]);
  const wert = s.z(u);
  const steigung = s.dz(u);
  const merken = () => setGemerkt((g) => (g.includes(u) || g.length >= MAX_MERKEN ? g : [...g, u].sort((a, b) => a - b)));
  const zuruecksetzen = () => { setU(s.start); setKurve(false); setTangente(false); setRand(false); setStellen(false); setGemerkt([]); };
  const rp = randpunkte(s);

  const beschreibungFigur = `Figur: ${fig.sprech}. Eingestellt ist ${s.variable} gleich ${zahlText(u)}. ${masse.map((m) => `${m.name} ${zahlText(m.wert)} ${m.einheit}`).join(', ')}.`;
  const beschreibungZiel = `Schaubild der Zielfunktion ${s.zielTex} in Abhängigkeit von ${s.variable}. Der blaue Punkt liegt bei ${s.variable} gleich ${zahlText(u)} und hat die Höhe ${zahlText(wert)}.${kurve ? ' Das Schaubild ist eingeblendet.' : ' Das Schaubild ist ausgeblendet.'}${gemerkt.length ? ` ${gemerkt.length} Werte sind gemerkt.` : ''}${rand ? ' Die Randwerte sind markiert.' : ''}${stellen ? ' Die Stellen mit Ableitung null sind markiert.' : ''}`;

  return (
    <div className="labor">
      <div className="bilder-paar">
        <figure className="bild">
          <Zeichenbrett bereich={fig.fenster} xTeilung={fig.x} yTeilung={fig.y} xBeschriftung="zahl" className="brett-3zu2" beschreibung={beschreibungFigur} zustand={z} aufbau={baueFigur} />
          <figcaption>Figur: <Formel tex={`${s.variable}=${zahlTex(u)}`} nach="." /></figcaption>
        </figure>
        <figure className="bild">
          <Zeichenbrett bereich={s.fenster} xTeilung={s.teilung.x} yTeilung={s.teilung.y} xBeschriftung="zahl" className="brett-3zu2" beschreibung={beschreibungZiel} zustand={z} aufbau={baueZielfunktion} />
          <figcaption>Zielfunktion <Formel tex={`${s.zielTex}(${s.variable})`} nach="." /></figcaption>
        </figure>
      </div>
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> aktuelle Stelle</li>
        {kurve && <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Schaubild von <Formel tex={s.zielTex} /></li>}
        {tangente && <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Tangente</li>}
        {rand && rp.length > 0 && <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Randwerte (offen: nicht erreicht)</li>}
        {stellen && <li><span className="legende-farbe" style={{ background: GELB }} aria-hidden="true" /> Stellen mit <Formel tex={`${s.zielTex}'=0`} /></li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <table className="tabelle tabelle-kompakt">
          <caption>Größen bei <Formel tex={`${s.variable}=${zahlTex(u)}`} /></caption>
          <thead>
            <tr><th scope="col">Größe</th><th scope="col">Wert</th></tr>
          </thead>
          <tbody>
            {masse.map((m) => (
              <tr key={m.name}><th scope="row">{m.name}</th><td>{zeile(m.wert, m.einheit)}</td></tr>
            ))}
            {tangente && <tr><th scope="row">Steigung der Tangente</th><td><Formel tex={`${s.zielTex}'(${zahlTex(u)})=${zahlTex(steigung)}`} /></td></tr>}
          </tbody>
        </table>
        {gemerkt.length > 0 && (
          <table className="tabelle tabelle-kompakt">
            <caption>Gemerkte Werte</caption>
            <thead>
              <tr><th scope="col"><Formel tex={s.variable} /></th><th scope="col"><Formel tex={s.zielTex} /> in {s.einheit}</th></tr>
            </thead>
            <tbody>
              {gemerkt.map((g) => (
                <tr key={g}><td>{zahlText(g)}</td><td>{zahlText(s.z(g))}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        {rand && (
          <p>
            {rp.length > 0 ? (
              <>Randwerte: {rp.map((p, i) => (
                <span key={i}><Formel tex={`${s.zielTex}(${zahlTex(p.x)})=${zahlTex(p.y)}`} nach={i === rp.length - 1 ? '' : ','} /> {p.offen ? '(Rand gehört nicht zum Definitionsbereich)' : ''}{i < rp.length - 1 ? ' ' : ''}</span>
              ))}</>
            ) : (
              <>Am Rand des Definitionsbereichs wächst <Formel tex={s.zielTex} /> über alle Grenzen: Für <Formel tex={`${s.variable}\\to 0`} /> und für <Formel tex={`${s.variable}\\to\\infty`} /> werden die Werte beliebig groß.</>
            )}
          </p>
        )}
        {stellen && (
          <p>
            <Formel tex={`${s.zielTex}'(${s.variable})=0`} /> bei {s.stellen.map((x, i) => (
              <span key={x}><Formel tex={`${s.variable}=${zahlTex(x)}`} nach={i === s.stellen.length - 1 ? '' : ','} /> (<Formel tex={`${s.zielTex}=${zahlTex(s.z(x))}`} nach=")" />{i < s.stellen.length - 1 ? ', ' : ''}</span>
            ))}.
          </p>
        )}
      </div>

      <div className="labor-bedienung">
        <div>
          <div className="regler-gruppe">
            <Regler name={`Stelle ${s.variable}`} beschriftung={<Formel tex={s.variable} />} wert={u} min={s.reglerMin} max={s.reglerMax} step={s.schritt} onChange={setU} anzeige={<Formel tex={zahlTex(u)} />} />
          </div>
          <div className="aufgabe-knoepfe">
            <button type="button" className="knopf-zweit" onClick={merken}>Wert merken</button>
            <button type="button" className="knopf-zweit" onClick={() => setGemerkt([])} disabled={gemerkt.length === 0}>Gemerkte Werte löschen</button>
          </div>
        </div>
        <div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={kurve} onChange={(e) => setKurve(e.target.checked)} /> Zielfunktion zeichnen</label>
            <label className="schalter"><input type="checkbox" checked={tangente} onChange={(e) => setTangente(e.target.checked)} /> Tangente zeigen</label>
            <label className="schalter"><input type="checkbox" checked={rand} onChange={(e) => setRand(e.target.checked)} /> Randwerte zeigen</label>
            <label className="schalter"><input type="checkbox" checked={stellen} onChange={(e) => setStellen(e.target.checked)} /> {`Stellen mit ${s.zielTex}′ = 0`}</label>
          </fieldset>
        </div>
      </div>
      <div className="labor-knoepfe">
        <span className="klein">Die Zielfunktionen und ihre Ableitungen sind von Hand bestimmt und im Test gegen numerische Verfahren geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={zuruecksetzen}>Zurücksetzen</button>
      </div>
    </div>
  );
}
