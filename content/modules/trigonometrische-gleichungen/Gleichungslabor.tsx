import { useId, useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { grundloesungen, loesungen, type Grundfunktion, type Loesung } from '@/lib/gleichungen';
import { termSinus } from '@/lib/sinus';
import { piTex, zahlTex, zahlText } from '@/lib/zahlen';
import { INTERVALLE, LABOR_START, REGLER, SCHNELLWAHL } from './daten';
import { GERADE_FARBE, INTERVALL_FARBE, LOESUNG_STIL } from './Loesungsschaubild';

const PI = Math.PI;
/** Rand links und rechts vom Intervall: Lösungen knapp außerhalb bleiben als blasse Punkte sichtbar. */
const RAND = PI / 2;
/** Genug Plätze für alle Lösungen im Bereich bei b = 4 (Periode π/2, höchstens 11 Lösungen je Art bei 5π Breite). */
const PLAETZE = 15;
const MAX_ZEILEN = 12;
const EPS = 1e-9;

interface Zustand {
  funktion: Grundfunktion;
  s: number;
  b: number;
  c: number;
  von: number;
  bis: number;
  /** Alle Lösungen im sichtbaren Bereich (auch außerhalb des gewählten Intervalls). */
  liste: Loesung[];
}

/** Wert exakt als Vielfaches von π, falls möglich, und gerundet, z. B. \tfrac{\pi}{6}\approx 0{,}52. */
function wertTex(x: number): string {
  const exakt = piTex(x);
  const gerundet = zahlTex(x);
  return exakt === gerundet ? gerundet : `${exakt}\\approx ${gerundet}`;
}

/** Zelle mit exaktem Wert und darunter dem gerundeten Wert, damit die Tabelle auch am Handy ohne Seitwärtsrollen passt. */
function WertZelle({ x }: { x: number }) {
  const exakt = piTex(x);
  const gerundet = zahlTex(x);
  if (exakt === gerundet) return <Formel tex={gerundet} />;
  return (
    <>
      <Formel tex={exakt} />
      <span className="gerundet">
        <Formel tex={`\\approx ${gerundet}`} />
      </span>
    </>
  );
}

interface GleichungslaborProps {
  /** false: nur sin(x) = r bzw. cos(x) = r. true: zusätzlich Streckung b und Verschiebung c im Argument. */
  mitParametern: boolean;
}

/** Labor für Gleichungen sin(b(x − c)) = r und cos(b(x − c)) = r: Schaubild, Gerade y = r, alle Lösungen in einem Intervall. */
export function Gleichungslabor({ mitParametern }: GleichungslaborProps) {
  const gruppe = useId();
  const [funktion, setFunktion] = useState<Grundfunktion>(LABOR_START.funktion);
  const [s, setS] = useState(LABOR_START.s);
  const [b, setB] = useState(LABOR_START.b);
  const [c, setC] = useState(LABOR_START.c);
  const [intervallNr, setIntervallNr] = useState(LABOR_START.intervall);
  const intervall = INTERVALLE[intervallNr]!;
  const zuruecksetzen = () => {
    setFunktion(LABOR_START.funktion);
    setS(LABOR_START.s);
    setB(LABOR_START.b);
    setC(LABOR_START.c);
    setIntervallNr(LABOR_START.intervall);
  };

  const bereich: [number, number, number, number] = [intervall.von - RAND, intervall.bis + RAND, -1.7, 1.7];
  const liste = loesungen(funktion, s, b, c, bereich[0], bereich[1]);
  const imIntervall = liste.filter((l) => l.x >= intervall.von - EPS && l.x <= intervall.bis + EPS);
  const zustand: Zustand = { funktion, s, b, c, von: intervall.von, bis: intervall.bis, liste };
  const g = grundloesungen(funktion, s);
  const name = mitParametern ? 'z' : 'x';
  const trig = funktion === 'sin' ? String.raw`\sin` : String.raw`\cos`;

  const linkeSeite = mitParametern
    ? termSinus({ a: 1, b, c, d: 0 }, 'g', { funktion, klammer: 'eckig', immerKlammer: true }).replace(/^g\(x\)=/, '')
    : `${trig}(x)`;
  const gleichung = `${linkeSeite}=${zahlTex(s)}`;
  const taschenrechner = g
    ? `${name}_1=${trig}^{-1}(${zahlTex(s)})=${wertTex(g.z1)}`
    : `${trig}^{-1}(${zahlTex(s)})\\text{ ist nicht definiert}`;

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={bereich}
        xTeilung={PI / 2}
        yTeilung={0.5}
        className="brett-3zu2"
        beschreibung={`Schaubild von ${funktion === 'sin' ? 'Sinus' : 'Kosinus'} ${mitParametern ? `mit b = ${zahlText(b)} und c = ${zahlText(c)} ` : ''}und die waagerechte Gerade y = ${zahlText(s)}. Im Intervall ${intervall.text} gibt es ${imIntervall.length} Lösungen. Sie stehen auch in der Tabelle unter dem Schaubild.`}
        zustand={zustand}
        aufbau={(brett, lies) => {
          const stil = { highlight: false, fixed: true };
          brett.create(
            'functiongraph',
            [(x: number) => (lies().funktion === 'sin' ? Math.sin : Math.cos)(lies().b * (x - lies().c))],
            { ...stil, strokeColor: FARBEN.akzent, strokeWidth: 3 },
          );
          brett.create('line', [[0, () => lies().s], [1, () => lies().s]], { ...stil, strokeColor: GERADE_FARBE, strokeWidth: 2 });
          brett.create('segment', [[() => lies().von, 0], [() => lies().bis, 0]], { ...stil, strokeColor: INTERVALL_FARBE, strokeWidth: 7, strokeOpacity: 0.5 });
          brett.create('line', [[() => lies().von, 0], [() => lies().von, 1]], { ...stil, strokeColor: INTERVALL_FARBE, strokeWidth: 2, dash: 2 });
          brett.create('line', [[() => lies().bis, 0], [() => lies().bis, 1]], { ...stil, strokeColor: INTERVALL_FARBE, strokeWidth: 2, dash: 2 });
          // Je Lösungsart ein eigener Vorrat an Punkten mit festem Zeichen, damit sich nur Sichtbarkeit und Blässe ändern.
          const von = (art: 1 | 2) => (z: Zustand) => z.liste.filter((l) => l.art === art);
          const vorrat = ([1, 2] as const).map((art) => {
            const stilArt = LOESUNG_STIL[art];
            const lote: GeometryElement[] = [];
            const punkte: GeometryElement[] = [];
            for (let i = 0; i < PLAETZE; i++) {
              const x = () => von(art)(lies())[i]?.x ?? 0;
              lote.push(brett.create('segment', [[x, 0], [x, () => lies().s]], { ...stil, strokeColor: GERADE_FARBE, strokeWidth: 1, dash: 2 }) as GeometryElement);
              punkte.push(
                brett.create('point', [x, () => lies().s], { ...stil, withLabel: false, face: stilArt.face, size: 6, strokeColor: stilArt.farbe, fillColor: stilArt.farbe }) as GeometryElement,
              );
            }
            return { art, lote, punkte };
          });
          return (z: Zustand) => {
            for (const { art, lote, punkte } of vorrat) {
              const liste = von(art)(z);
              for (let i = 0; i < PLAETZE; i++) {
                const l = liste[i];
                const innen = l !== undefined && l.x >= z.von - EPS && l.x <= z.bis + EPS;
                lote[i]!.setAttribute({ visible: innen });
                // Lösungen außerhalb des gewählten Intervalls werden blass gezeigt.
                punkte[i]!.setAttribute({ visible: l !== undefined, fillOpacity: innen ? 1 : 0.25, strokeOpacity: innen ? 1 : 0.25 });
              }
            }
          };
        }}
      />

      <ul className="legende" aria-label="Legende">
        <li><span className="symbol" style={{ color: LOESUNG_STIL[1].farbe }} aria-hidden="true">{LOESUNG_STIL[1].symbol}</span> Typ 1: enthält den Taschenrechnerwert <Formel tex={`${name}_1`} /></li>
        <li><span className="symbol" style={{ color: LOESUNG_STIL[2].farbe }} aria-hidden="true">{LOESUNG_STIL[2].symbol}</span> Typ 2: die übrigen Lösungen</li>
        <li><span className="legende-farbe" style={{ background: INTERVALL_FARBE }} aria-hidden="true" /> Intervall <Formel tex={intervall.tex} nach="," /> blasse Punkte liegen außerhalb</li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={gleichung} />
      </div>

      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <fieldset className="funktionswahl">
            <legend>Funktion</legend>
            <label><input type="radio" name={`${gruppe}-funktion`} checked={funktion === 'sin'} onChange={() => setFunktion('sin')} /> Sinus</label>
            <label><input type="radio" name={`${gruppe}-funktion`} checked={funktion === 'cos'} onChange={() => setFunktion('cos')} /> Kosinus</label>
          </fieldset>
          <Regler name="Rechte Seite r" beschriftung={<Formel tex="r" />} wert={s} {...REGLER.s} onChange={setS} anzeige={<Formel tex={zahlTex(s)} />} />
          {mitParametern && (
            <>
              <Regler name="Parameter b" beschriftung={<Formel tex="b" />} wert={b} {...REGLER.b} onChange={setB} anzeige={<Formel tex={zahlTex(b)} />} />
              <Regler name="Parameter c" beschriftung={<Formel tex="c" />} wert={c} {...REGLER.c} onChange={setC} anzeige={<Formel tex={piTex(c)} />} />
              <p className="klein">Hier ist immer <Formel tex="b>0" nach="." /></p>
            </>
          )}
          <fieldset className="funktionswahl">
            <legend>Intervall</legend>
            {INTERVALLE.map((iv, i) => (
              <label key={iv.text}><input type="radio" name={`${gruppe}-intervall`} checked={intervallNr === i} onChange={() => setIntervallNr(i)} /> <Formel tex={iv.tex} /></label>
            ))}
          </fieldset>
        </div>
        <dl className="kennwerte" aria-label="Kennwerte der Gleichung" aria-live="polite">
          <div>
            <dt>Taschenrechner (Bogenmaß)</dt>
            <dd><Formel tex={taschenrechner} /></dd>
          </div>
          <div>
            <dt>Anzahl der Lösungen im Intervall</dt>
            <dd>{imIntervall.length}</dd>
          </div>
          {mitParametern && (
            <div>
              <dt>Periode</dt>
              <dd><Formel tex={`p=\\frac{2\\pi}{b}=${piTex((2 * PI) / b)}`} /></dd>
            </div>
          )}
        </dl>
      </div>

      <div className="schnellwahl" role="group" aria-label="Exakte Werte für r">
        {SCHNELLWAHL.map((w) => (
          <button key={w.text} type="button" className="chip" aria-label={`r gleich ${w.text}`} aria-pressed={Math.abs(s - w.s) < EPS} onClick={() => setS(w.s)}>
            <Formel tex={w.tex} />
          </button>
        ))}
      </div>

      <table className="tabelle tabelle-kompakt">
        <caption>Die Lösungen im Intervall <Formel tex={intervall.tex} nach="," /> von links nach rechts</caption>
        <thead>
          <tr>
            <th scope="col">Nr.</th>
            <th scope="col"><Formel tex="x" /></th>
            {mitParametern && <th scope="col"><Formel tex="z=b\,(x-c)" /></th>}
            <th scope="col">Typ</th>
          </tr>
        </thead>
        <tbody>
          {imIntervall.length === 0 ? (
            <tr><td colSpan={mitParametern ? 4 : 3}>Im Intervall gibt es keine Lösung.</td></tr>
          ) : (
            imIntervall.slice(0, MAX_ZEILEN).map((l, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td><WertZelle x={l.x} /></td>
                {mitParametern && <td><WertZelle x={l.z} /></td>}
                <td><span className="symbol" style={{ color: LOESUNG_STIL[l.art].farbe }} aria-hidden="true">{LOESUNG_STIL[l.art].symbol}</span> {l.art}<span className="nur-lesegeraet"> ({LOESUNG_STIL[l.art].name})</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {imIntervall.length > MAX_ZEILEN && <p className="klein">Die Tabelle zeigt die ersten {MAX_ZEILEN} von {imIntervall.length} Lösungen. Alle Lösungen siehst du im Schaubild.</p>}

      <div className="labor-knoepfe">
        <span />
        <button type="button" className="knopf-zweit" onClick={zuruecksetzen}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
