import { useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { FLAECHE_BLAU, FLAECHE_ROSA } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { ORANGE, BLAU, SCHWARZ } from '@/components/Messbild';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { bestand, bilanz, ersatzrate, formen, rateBei, ratePunkte, sprungstellen } from '@/lib/flaeche';
import { zahl } from '@/lib/flaeche';
import { SZENARIEN, type Szenario } from './daten';

/** Zahl als TeX (Komma in geschweiften Klammern, echtes Minus). */
const tx = (x: number, n = 1) => zahl(x, n).replace(',', '{,}').replace('−', '-');

/** Alle Formeln der Anzeige des Labors für Szenario sz, Zeit t und Anfangsbestand b0 (der Test prüft sie für alle Reglerstellen). */
export function laborFormeln(sz: Szenario, t: number, b0: number) {
  const fl = bilanz(sz.stuecke, sz.stuecke[0]!.t0, t);
  const rate = rateBei(sz.stuecke, t);
  return {
    zeit: `t=${tx(t)}\\,\\text{${sz.zeitEinheit}}`,
    rate: `${tx(rate)}\\,${sz.rateTeX}`,
    flaeche: `${tx(fl)}\\,${sz.mengeTeX}`,
    bestand: `${tx(b0)}${fl < 0 ? '-' : '+'}${tx(Math.abs(fl))}=${tx(b0 + fl)}\\,${sz.mengeTeX}`,
    anfang: `${tx(b0)}\\,${sz.mengeTeX}`,
    ersatz: `${tx(ersatzrate(sz.stuecke), 2)}\\,${sz.rateTeX}`,
  };
}

interface Zustand {
  sz: Szenario;
  t: number;
  b0: number;
  steigung: boolean;
  ersatz: boolean;
}

const STIL = { highlight: false, fixed: true };

/** Kurze Achsentitel direkt an den Achsen. */
const TITEL: Record<Szenario['id'], { x: string; rate: string; bestand: string }> = {
  becken: { x: 't in min', rate: 'Rate in ℓ/min', bestand: 'Menge in ℓ' },
  tank: { x: 't in h', rate: 'Rate in m³/h', bestand: 'Menge in m³' },
};

/** Obere Zeichnung: Schaubild der Rate, Fläche von Beginn bis t, senkrechte Linie und Punkt bei t, optional das Rechteck der Ersatzrate. */
function RateBrett({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const sz = zustand.sz;
  return (
    <Zeichenbrett
      bereich={sz.bereichRate}
      xTeilung={sz.teilung}
      yTeilung={sz.yTeilungRate}
      xBeschriftung="zahl"
      className="brett-3zu2"
      xTitel={TITEL[sz.id].x}
      yTitel={TITEL[sz.id].rate}
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
                const formenVon = (i: number, art: 'pos' | 'neg') => {
          const { sz: s, t } = lies();
          const p = s.stuecke[i]!;
          const f = formen(p, p.t0, Math.min(t, p.t1));
          return f[art];
        };
        const polys = sz.stuecke.flatMap((_, i) =>
          (['pos', 'neg'] as const).map((art) => {
            const ecke = (k: number): [() => number, () => number] => [() => formenVon(i, art)?.[k]?.[0] ?? 0, () => formenVon(i, art)?.[k]?.[1] ?? 0];
            const poly = b.create('polygon', [ecke(0), ecke(1), ecke(2), ecke(3)], {
              ...STIL,
              vertices: { visible: false, fixed: true, highlight: false },
              borders: { strokeColor: '#ffffff', strokeWidth: 1, highlight: false, fixed: true },
              fillColor: art === 'pos' ? FLAECHE_BLAU : FLAECHE_ROSA,
              fillOpacity: 0.32,
              hasInnerPoints: false,
            }) as GeometryElement;
            return { poly, i, art };
          }),
        );
        const punkte = ratePunkte(sz.stuecke);
        b.create('curve', [punkte.map((p) => p[0]), punkte.map((p) => p[1])], { ...STIL, strokeColor: ORANGE, strokeWidth: 3.5 });
        const rechteck = b.create('polygon', [[sz.stuecke[0]!.t0, 0], [sz.stuecke[0]!.t0, () => ersatzrate(lies().sz.stuecke)], [sz.stuecke[sz.stuecke.length - 1]!.t1, () => ersatzrate(lies().sz.stuecke)], [sz.stuecke[sz.stuecke.length - 1]!.t1, 0]], {
          ...STIL,
          vertices: { visible: false, fixed: true, highlight: false },
          borders: { strokeColor: SCHWARZ, strokeWidth: 2, dash: 3, highlight: false, fixed: true },
          fillOpacity: 0,
          fillColor: '#ffffff',
          hasInnerPoints: false,
          visible: false,
        }) as GeometryElement;
        b.create('segment', [[() => lies().t, 0], [() => lies().t, () => rateBei(lies().sz.stuecke, lies().t)]], { ...STIL, strokeColor: BLAU, strokeWidth: 2, dash: 2 });
        b.create('point', [() => lies().t, () => rateBei(lies().sz.stuecke, lies().t)], { ...STIL, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
        return (z: Zustand) => {
          for (const { poly, i, art } of polys) poly.setAttribute({ visible: formenVon(i, art) !== null && z.t > z.sz.stuecke[i]!.t0 });
          rechteck.setAttribute({ visible: z.ersatz });
        };
      }}
    />
  );
}

/** Untere Zeichnung: Bestandskurve, Punkt bei t, optional die Tangente mit der Steigung der Rate. */
function BestandBrett({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const sz = zustand.sz;
  return (
    <Zeichenbrett
      bereich={sz.bereichBestand}
      xTeilung={sz.teilung}
      yTeilung={sz.yTeilungBestand}
      xBeschriftung="zahl"
      className="brett-3zu2"
      xTitel={TITEL[sz.id].x}
      yTitel={TITEL[sz.id].bestand}
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const [xmin, xmax] = sz.bereichBestand;
        const t0 = sz.stuecke[0]!.t0;
        const t1 = sz.stuecke[sz.stuecke.length - 1]!.t1;
        const wert = (t: number) => bestand(lies().sz.stuecke, lies().b0, t);
        b.create('functiongraph', [wert, t0, t1], { ...STIL, strokeColor: ORANGE, strokeWidth: 3.5 });
        const breite = (xmax - xmin) * 0.12;
        const tang = b.create('segment', [[() => lies().t - breite, () => wert(lies().t) - rateBei(lies().sz.stuecke, lies().t) * breite], [() => lies().t + breite, () => wert(lies().t) + rateBei(lies().sz.stuecke, lies().t) * breite]], { ...STIL, strokeColor: SCHWARZ, strokeWidth: 2, dash: 3, visible: false }) as GeometryElement;
        b.create('point', [() => lies().t, () => wert(lies().t)], { ...STIL, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
        return (z: Zustand) => {
          const sprung = sprungstellen(z.sz.stuecke).some((s) => Math.abs(s - z.t) < 1e-9);
          tang.setAttribute({ visible: z.steigung && !sprung });
        };
      }}
    />
  );
}

/**
 * Labor zur Bestandsrekonstruktion: oben die Änderungsrate mit der Fläche von Beginn bis t, unten der zugehörige Bestand.
 * Zur Wahl stehen ein Becken (nur Zufluss) und ein Wasserspeicher (Zu- und Abfluss). Optional werden die Steigung der Bestandskurve
 * und ein Rechteck mit der Ersatzrate gezeigt.
 */
export function Bestandslabor() {
  const [id, setId] = useState<Szenario['id']>('becken');
  const sz = SZENARIEN.find((s) => s.id === id)!;
  const [t, setT] = useState(0);
  const [b0, setB0] = useState(sz.b0Start);
  const [steigung, setSteigung] = useState(false);
  const [ersatz, setErsatz] = useState(false);

  const tEnde = sz.stuecke[sz.stuecke.length - 1]!.t1;
  const tAkt = Math.min(t, tEnde);
  const fl = bilanz(sz.stuecke, sz.stuecke[0]!.t0, tAkt);
  const rate = rateBei(sz.stuecke, tAkt);
  const sprung = sprungstellen(sz.stuecke).some((s) => Math.abs(s - tAkt) < 1e-9);
  const zustand: Zustand = { sz, t: tAkt, b0, steigung, ersatz };
  const formeln = laborFormeln(sz, tAkt, b0);
  const ratenText = `Schaubild der ${sz.rateName} über der ${sz.zeitName}. Der markierte Punkt liegt bei t gleich ${zahl(tAkt)} mit der Rate ${zahl(rate)}. Die Fläche zwischen dem Schaubild und der Zeitachse von 0 bis t beträgt ${zahl(fl)}.${ersatz ? ` Gestrichelt ist das Rechteck der Ersatzrate ${zahl(ersatzrate(sz.stuecke), 2)} eingezeichnet.` : ''}`;
  const bestandText = `Schaubild des Bestands (${sz.bestandName}) über der ${sz.zeitName} bei Anfangsbestand ${b0}. Zur Zeit ${zahl(tAkt)} beträgt der Bestand ${zahl(b0 + fl)}.${steigung && !sprung ? ` Die gestrichelte Tangente hat die Steigung ${zahl(rate)}.` : ''}`;

  const wechsle = (neu: Szenario['id']) => {
    const s = SZENARIEN.find((x) => x.id === neu)!;
    setId(neu);
    setT(0);
    setB0(s.b0Start);
    setSteigung(false);
    setErsatz(false);
  };

  return (
    <div className="labor">
      <RateBrett zustand={zustand} beschreibung={ratenText} />
      <BestandBrett zustand={zustand} beschreibung={bestandText} />

      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> oben: Rate, unten: Bestand</li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_BLAU }} aria-hidden="true" /> Fläche oberhalb der Zeitachse</li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_ROSA }} aria-hidden="true" /> Fläche unterhalb der Zeitachse</li>
        {steigung && <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Tangente an die Bestandskurve</li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <p>
          Zeit: <Formel tex={formeln.zeit} nach="." /> Rate: <Formel tex={formeln.rate} nach="." />
        </p>
        <p>
          Fläche von <Formel tex="0" /> bis <Formel tex="t" nach=":" /> <Formel tex={formeln.flaeche} nach="." />
        </p>
        <p>
          Bestand: <Formel tex={formeln.bestand} nach="." />
        </p>
        {sprung && <p className="klein">An dieser Stelle springt die Rate. Die Bestandskurve hat dort einen Knick, eine Steigung gibt es nicht.</p>}
        {ersatz && (
          <p>
            Höhe des gestrichelten Rechtecks: <Formel tex={formeln.ersatz} nach="." />
          </p>
        )}
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Situation</legend>
          <div className="schnellwahl">
            {SZENARIEN.map((s) => (
              <button key={s.id} type="button" className="chip" aria-pressed={id === s.id} onClick={() => wechsle(s.id)}>
                {s.name}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <div className="regler-gruppe">
            <Regler name={`Zeit t in ${sz.zeitEinheit}`} beschriftung={<Formel tex="t" />} wert={tAkt} min={sz.stuecke[0]!.t0} max={tEnde} step={0.5} onChange={setT} anzeige={<Formel tex={`${tx(tAkt)}\\,\\text{${sz.zeitEinheit}}`} />} />
            <Regler name={`Anfangsbestand in ${sz.mengeEinheit}`} beschriftung={<Formel tex="B_0" />} wert={b0} min={sz.b0Min} max={sz.b0Max} step={10} onChange={setB0} anzeige={<Formel tex={formeln.anfang} />} />
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={steigung} onChange={(e) => setSteigung(e.target.checked)} /> Steigung anzeigen</label>
            <label className="schalter"><input type="checkbox" checked={ersatz} onChange={(e) => setErsatz(e.target.checked)} /> Ersatzrate anzeigen</label>
          </fieldset>
        </div>
      </div>

      <div className="labor-knoepfe">
        <span className="klein">Die Flächen sind aus Rechtecken, Trapezen und Dreiecken gerechnet und im Test gegen eine unabhängige Rechnung geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => wechsle('becken')}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
