import { useState, type ReactNode } from 'react';
import { Formel } from '@/components/Formel';
import { BLAU, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { VennDiagramm, type VennMenge } from '@/components/VennDiagramm';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { dynamischeKurve } from '@/lib/dynkurve';
import { regionText, regionVon, type Mitglied, type Region } from '@/lib/venn';
import {
  MENGEN1, MENGEN2, NAMEN1, NAMEN2, LEER1, LEER2, eigenschaften1, eigenschaften2, integral1, integral2, kubik, minAbleitung1, quadrat, wechsel2,
  type Fn, type Koeffizienten, type Koeffizienten2,
} from './daten';

const STIL = { highlight: false, fixed: true };
const FLAECHE = '#9ec9ec';

/** Zahl als TeX mit Dezimalkomma, höchstens drei Nachkommastellen. */
export const zt = (x: number, n = 3) => {
  const r = Math.round(x * 10 ** n) / 10 ** n;
  return String(Object.is(r, -0) ? 0 : r).replace('.', '{,}');
};
const ja = (b: boolean) => (b ? 'ja' : 'nein');

/** Term von f als TeX: Glieder mit Koeffizient 0 entfallen. */
export function termTeX(glieder: [number, string][]): string {
  let aus = '';
  for (const [k, x] of glieder) {
    if (Math.abs(k) < 1e-12) continue;
    const betrag = Math.abs(k);
    const koeff = Math.abs(betrag - 1) < 1e-12 && x !== '' ? '' : zt(betrag);
    const teil = `${koeff}${x}`;
    aus += aus === '' ? `${k < 0 ? '-' : ''}${teil}` : ` ${k < 0 ? '-' : '+'} ${teil}`;
  }
  return aus === '' ? '0' : aus;
}

/** Bestandteile, die beide Labore gemeinsam haben. */
interface Rahmen {
  f: Fn;
  von: number;
  bis: number;
  bereich: [number, number, number, number];
  teilung: number;
  yTeilung: number;
  term: string;
  mitglied: Mitglied;
  mengen: [VennMenge, VennMenge, VennMenge];
  namen: [string, string, string];
  leer: Region[];
  /** Je Eigenschaft ein Satz mit der Prüfung. */
  zeilen: ReactNode[];
  beschreibung: string;
  regler: ReactNode;
  zuruecksetzen: () => void;
}

interface Zustand {
  f: Fn;
  von: number;
  bis: number;
}

function Zeichnung({ zustand, bereich, teilung, yTeilung, beschreibung }: { zustand: Zustand; bereich: [number, number, number, number]; teilung: number; yTeilung: number; beschreibung: string }) {
  const [, , ymin, ymax] = bereich;
  return (
    <Zeichenbrett
      bereich={bereich}
      xTeilung={teilung}
      yTeilung={yTeilung}
      xBeschriftung="zahl"
      className="brett-3zu2"
      xTitel="x"
      yTitel="y"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const flaeche = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 0, fillColor: FLAECHE, fillOpacity: 0.45 }, () => {
          const { f, von, bis } = lies();
          const xs = Array.from({ length: 121 }, (_, i) => von + ((bis - von) * i) / 120);
          return [[von, ...xs, bis], [0, ...xs.map((x) => Math.max(ymin, Math.min(ymax, f(x)))), 0]];
        });
        b.create('functiongraph', [(x: number) => lies().f(x)], { ...STIL, strokeColor: ORANGE, strokeWidth: 3.5 });
        const senkrecht = (x: () => number) => b.create('segment', [[x, ymin], [x, ymax]], { ...STIL, strokeColor: SCHWARZ, strokeWidth: 1.5, dash: 3 });
        senkrecht(() => lies().von);
        senkrecht(() => lies().bis);
        return () => flaeche.update();
      }}
    />
  );
}

function LaborRahmen({ f, von, bis, bereich, teilung, yTeilung, term, mitglied, mengen, namen, leer, zeilen, beschreibung, regler, zuruecksetzen }: Rahmen) {
  const region = regionVon(mitglied);
  return (
    <div className="labor">
      <Zeichnung zustand={{ f, von, bis }} bereich={bereich} teilung={teilung} yTeilung={yTeilung} beschreibung={`${beschreibung} Das Intervall von ${von} bis ${bis} ist durch zwei senkrechte gestrichelte Linien begrenzt, die Fläche zwischen Schaubild und x-Achse ist hellblau.`.replace(/-(\d)/g, 'minus $1')} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Grenzen des Intervalls</li>
      </ul>
      <p className="labor-gleichung" aria-live="polite">
        <Formel tex={`f(x)=${term}`} />
      </p>
      <div className="regler-gruppe">{regler}</div>
      <div aria-live="polite">
        <dl className="eigenschaften">
          {zeilen.map((z, i) => (
            <div key={i}>
              <dt>
                {mengen[i]!.kurz}: {namen[i]} ({ja(mitglied[i]!)})
              </dt>
              <dd>{z}</dd>
            </div>
          ))}
        </dl>
        <p>
          <strong>Region {region}:</strong> {regionText(region, namen)}.
        </p>
        <VennDiagramm mengen={mengen} markiert={region} leer={leer} />
      </div>
      <div className="labor-knoepfe">
        <span className="klein" />
        <button type="button" className="knopf-zweit" onClick={zuruecksetzen}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

const STUFE = 0.5;
const klemme = (x: number) => Math.min(3, Math.max(-3, x));

/** Labor 1: f(x) = p x³ + q x² + r x + s auf [−2; 2]. Zeilen und Region kommen aus `eigenschaften1`. */
export function Labor1() {
  const [k, setK] = useState<Koeffizienten>({ p: 1, q: 0, r: 0, s: 0 });
  const setze = (name: keyof Koeffizienten) => (w: number) => setK((alt) => ({ ...alt, [name]: klemme(w) }));
  const f = kubik(k);
  const mitglied = eigenschaften1(k);
  const I = integral1(k);
  const m = minAbleitung1(k);
  const gerade = Math.abs(k.q) < 1e-9 && Math.abs(k.s) < 1e-9;
  const term = termTeX([[k.p, 'x^3'], [k.q, 'x^2'], [k.r, 'x'], [k.s, '']]);
  const zeilen: ReactNode[] = [
    <>
      Die ungeraden Terme heben sich auf, es bleibt <Formel tex={`\\frac{16}{3}\\cdot ${zt(k.q)}+4\\cdot ${zt(k.s)}=${zt(I)}`} nach="." /> {mitglied[0] ? 'Das Integral von −2 bis 2 ist 0.' : 'Das Integral von −2 bis 2 ist nicht 0.'}
    </>,
    <>
      {gerade ? 'Es kommen nur ungerade Potenzen von x vor, also gilt f(−x) = −f(x).' : 'Es kommt ein x² oder ein konstanter Term vor, damit gilt f(−x) = −f(x) nicht für jedes x.'}
    </>,
    <>
      Der kleinste Wert von <Formel tex="f'" /> auf <Formel tex="[-2;\,2]" /> ist <Formel tex={zt(m)} nach="." /> {mitglied[2] ? 'Er ist nicht negativ, f steigt monoton.' : 'Er ist negativ, f fällt irgendwo.'}
    </>,
  ];
  return (
    <LaborRahmen
      f={f}
      von={-2}
      bis={2}
      bereich={[-3.2, 3.2, -14, 14]}
      teilung={1}
      yTeilung={2}
      term={term}
      mitglied={mitglied}
      mengen={MENGEN1}
      namen={NAMEN1}
      leer={LEER1}
      zeilen={zeilen}
      beschreibung="Schaubild von f, ein Polynom dritten Grades, im Bereich von minus 3 bis 3. Der Term steht über den Reglern."
      regler={(['p', 'q', 'r', 's'] as const).map((n) => (
        <Regler key={n} name={`Koeffizient ${n}`} beschriftung={<Formel tex={n} />} wert={k[n]} min={-3} max={3} step={STUFE} onChange={setze(n)} anzeige={<Formel tex={zt(k[n], 1)} />} />
      ))}
      zuruecksetzen={() => setK({ p: 1, q: 0, r: 0, s: 0 })}
    />
  );
}

/** Labor 2: f(x) = a x² + b x + c auf [0; 2]. */
export function Labor2() {
  const [k, setK] = useState<Koeffizienten2>({ a: 0, b: 1, c: 1 });
  const setze = (name: keyof Koeffizienten2) => (w: number) => setK((alt) => ({ ...alt, [name]: klemme(w) }));
  const f = quadrat(k);
  const mitglied = eigenschaften2(k);
  const I = integral2(k);
  const w = wechsel2(k);
  const term = termTeX([[k.a, 'x^2'], [k.b, 'x'], [k.c, '']]);
  const zeilen: ReactNode[] = [
    <>
      <Formel tex={`\\int_{0}^{2}f(x)\\,\\mathrm{d}x=\\frac{8}{3}\\cdot ${zt(k.a)}+2\\cdot ${zt(k.b)}+2\\cdot ${zt(k.c)}=${zt(I)}`} nach="." />
    </>,
    <>
      {w.length === 0 ? 'Im Inneren von ]0; 2[ wechselt f das Vorzeichen nicht.' : `Vorzeichenwechsel bei x = ${zt(w[0]!)}${w.length > 1 ? ` und x = ${zt(w[1]!)}` : ''}.`}
    </>,
    <>
      Die Ableitung ist <Formel tex={`f'(0)=${zt(k.b)}`} /> am linken Rand und <Formel tex={`f'(2)=${zt(4 * k.a + k.b)}`} /> am rechten. {mitglied[2] ? 'Keiner ist positiv und die Ableitung ist nicht überall 0, f fällt streng.' : 'Mindestens einer der Werte ist positiv oder die Ableitung ist überall 0, f fällt nicht auf dem ganzen Intervall streng.'}
    </>,
  ];
  return (
    <LaborRahmen
      f={f}
      von={0}
      bis={2}
      bereich={[-0.9, 3.4, -9, 9]}
      teilung={1}
      yTeilung={1}
      term={term}
      mitglied={mitglied}
      mengen={MENGEN2}
      namen={NAMEN2}
      leer={LEER2}
      zeilen={zeilen}
      beschreibung="Schaubild von f, ein Polynom zweiten Grades, im Bereich von minus 0,9 bis 3,4. Der Term steht über den Reglern."
      regler={(['a', 'b', 'c'] as const).map((n) => (
        <Regler key={n} name={`Koeffizient ${n}`} beschriftung={<Formel tex={n} />} wert={k[n]} min={-3} max={3} step={STUFE} onChange={setze(n)} anzeige={<Formel tex={zt(k[n], 1)} />} />
      ))}
      zuruecksetzen={() => setK({ a: 0, b: 1, c: 1 })}
    />
  );
}
