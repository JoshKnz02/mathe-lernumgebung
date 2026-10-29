import { useState } from 'react';
import { FLAECHE_BLAU, FLAECHE_ROSA } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { BLAU, GRUEN, ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { dynamischeKurve } from '@/lib/dynkurve';
import { zahlTeX } from '@/lib/flaeche';
import { rundeIntegral } from '@/lib/integral';
import { beitragsFlaeche, rechteckZug, streifenKennwerte } from '@/lib/integralfunktion';
import { LABOR_FUNKTIONEN, STREIFEN_IDS, type LaborFunktion } from './daten';
import { kurveF, kurveI, stelleText, stelleTeX } from './Integralfunktionslabor';

const STIL = { highlight: false, fixed: true };
const FUNKTIONEN = LABOR_FUNKTIONEN.filter((f) => (STREIFEN_IDS as readonly string[]).includes(f.id));
const find = (id: LaborFunktion['id']) => FUNKTIONEN.find((f) => f.id === id)!;

/** Die Untergrenze a ist der Anfang des Definitionsbereichs (die Werte des Zuwachses hängen nicht von a ab). */
const anfang = (fn: LaborFunktion) => fn.imin * fn.schritt;
const ende = (fn: LaborFunktion) => fn.imax * fn.schritt;
const wertTeX = (x: number) => zahlTeX(rundeIntegral(x), 3);

/** Alle Anzeige-Formeln des Labors (der Test rendert sie für alle Reglerstellen). */
export function streifenFormeln(fn: LaborFunktion, x: number, h: number) {
  const k = streifenKennwerte(fn.f, fn.wert, x, h);
  const X = stelleTeX(fn, x);
  return {
    stelle: `x=${X}`,
    breite: `h=${zahlTeX(h, 2)}`,
    zuwachs: String.raw`I_a(x+h)-I_a(x)`,
    integral: String.raw`{}=\int_{x}^{x+h} f(t)\,\mathrm{d}t=${wertTeX(k.zuwachs)}`,
    quotient: String.raw`\frac{I_a(x+h)-I_a(x)}{h}`,
    quotientWert: String.raw`{}=${wertTeX(k.quotient)}`,
    f: `f(x)=${wertTeX(fn.f(x))}`,
    grenzen: String.raw`${wertTeX(k.klein)}\le ${wertTeX(k.quotient)}\le ${wertTeX(k.gross)}`,
    rechteck: String.raw`h\cdot f(x)=${wertTeX(k.rechteck)}`,
  };
}

interface Zustand {
  fn: LaborFunktion;
  x: number;
  h: number;
}

function Oben({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const fn = zustand.fn;
  const [, , ymin, ymax] = fn.bereichF;
  return (
    <Zeichenbrett
      bereich={fn.bereichF}
      xTeilung={fn.teilung}
      yTeilung={fn.yTeilungF}
      xBeschriftung={fn.trig ? 'pi' : 'zahl'}
      className="brett-3zu2"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const flaeche = (positiv: boolean) => () => beitragsFlaeche(lies().fn.f, lies().x, lies().x + lies().h, positiv);
        const oben = dynamischeKurve(b, { strokeColor: BLAU, strokeWidth: 0, fillColor: FLAECHE_BLAU, fillOpacity: 0.32 }, flaeche(true));
        const unten = dynamischeKurve(b, { strokeColor: '#CC79A7', strokeWidth: 0, fillColor: FLAECHE_ROSA, fillOpacity: 0.32 }, flaeche(false));
        const rechteck = dynamischeKurve(b, { strokeColor: SCHWARZ, strokeWidth: 2, dash: 3, fillColor: 'none' }, () => rechteckZug(lies().x, lies().x + lies().h, lies().fn.f(lies().x)));
        const kurve = dynamischeKurve(b, { strokeColor: ORANGE, strokeWidth: 3.5, fillColor: 'none' }, () => kurveF(lies().fn));
        const senkrecht = (x: () => number, farbe: string) => b.create('segment', [[x, ymin], [x, ymax]], { ...STIL, strokeColor: farbe, strokeWidth: 1.5, dash: 2 });
        senkrecht(() => lies().x, SCHWARZ);
        senkrecht(() => lies().x + lies().h, SCHWARZ);
        return () => {
          oben.update();
          unten.update();
          rechteck.update();
          kurve.update();
        };
      }}
    />
  );
}

function Unten({ zustand, beschreibung }: { zustand: Zustand; beschreibung: string }) {
  const fn = zustand.fn;
  return (
    <Zeichenbrett
      bereich={fn.bereichI}
      xTeilung={fn.teilung}
      yTeilung={fn.yTeilungI}
      xBeschriftung={fn.trig ? 'pi' : 'zahl'}
      className="brett-3zu2"
      beschreibung={beschreibung}
      zustand={zustand}
      aufbau={(b, lies) => {
        const a = () => anfang(lies().fn);
        const wert = (x: number) => lies().fn.wert(a(), x);
        const kurve = dynamischeKurve(b, { strokeColor: ORANGE, strokeWidth: 3.5, fillColor: 'none' }, () => kurveI(lies().fn, a()));
        const P: [() => number, () => number] = [() => lies().x, () => wert(lies().x)];
        const Q: [() => number, () => number] = [() => lies().x + lies().h, () => wert(lies().x + lies().h)];
        b.create('segment', [P, Q], { ...STIL, strokeColor: GRUEN, strokeWidth: 2.5 });
        b.create('point', P, { ...STIL, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: BLAU });
        b.create('point', Q, { ...STIL, withLabel: false, face: 'o', size: 6, strokeColor: '#fff', fillColor: SCHWARZ });
        return () => kurve.update();
      }}
    />
  );
}

/**
 * Labor zum Hauptsatz: oben der schmale Streifen der Breite h über der Stelle x (blau bzw. rosa) mit dem Rechteck der Höhe f(x) (gestrichelt),
 * unten die Integralfunktion mit der Sekante durch die Punkte bei x und x + h. Der Zuwachs von I_a ist die Fläche des Streifens, die Steigung der Sekante der Quotient.
 */
export function Differenzenlabor() {
  const [fId, setFId] = useState<LaborFunktion['id']>('quad');
  const [ix, setIx] = useState(6);
  const [h, setH] = useState(1);

  const fn = find(fId);
  const kl = (i: number) => Math.min(Math.max(i, fn.imin), fn.imax);
  const hh = Math.round(h * 100) / 100;
  const x = Math.min(kl(ix) * fn.schritt, ende(fn) - hh);
  const zustand: Zustand = { fn, x, h: hh };
  const F = streifenFormeln(fn, x, hh);
  const k = streifenKennwerte(fn.f, fn.wert, x, hh);
  const rund = (z: number) => String(rundeIntegral(z)).replace('.', ',');

  const oben = `Schaubild von f. Der Streifen über dem Intervall von x gleich ${stelleText(fn, x)} bis x plus h hat die Breite h gleich ${String(hh).replace('.', ',')} und die Fläche ${rund(k.zuwachs)}. Gestrichelt ist das Rechteck der Höhe f von x mit der Fläche ${rund(k.rechteck)} eingezeichnet.`;
  const unten = `Schaubild der Integralfunktion. Die grüne Sekante verbindet die Punkte bei x und x plus h. Ihre Steigung ist ${rund(k.quotient)}, der Wert von f an der Stelle x ist ${rund(fn.f(x))}.`;

  const wechsle = (id: LaborFunktion['id']) => {
    const neu = find(id);
    setFId(id);
    setIx(neu.id === 'quad' ? 6 : neu.trig ? 1 : 2);
    setH(1);
  };

  return (
    <div className="labor">
      <p className="achsentitel">y (senkrecht), x (waagerecht)</p>
      <Oben zustand={zustand} beschreibung={oben} />
      <p className="achsentitel">y (senkrecht), x (waagerecht)</p>
      <Unten zustand={zustand} beschreibung={unten} />

      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> oben <Formel tex="K_f" nach="," /> unten <Formel tex="K_{I_a}" /></li>
        <li><span className="legende-farbe" style={{ background: FLAECHE_BLAU }} aria-hidden="true" /> Streifen über dem Intervall von <Formel tex="x" /> bis <Formel tex="x+h" /> (rosa, wo <Formel tex="f" /> negativ ist)</li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> Rechteck der Höhe <Formel tex="f(x)" /> (gestrichelt)</li>
        <li><span className="legende-farbe" style={{ background: GRUEN }} aria-hidden="true" /> Sekante durch die Punkte bei <Formel tex="x" /> und <Formel tex="x+h" /></li>
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <p>
          <Formel tex={F.stelle} nach="," /> <Formel tex={F.breite} nach=":" />
        </p>
        <Formel anzeige tex={F.zuwachs} />
        <Formel anzeige tex={F.integral} nach="," />
        <Formel anzeige tex={F.rechteck} nach="," />
        <Formel anzeige tex={F.quotient} />
        <Formel anzeige tex={F.quotientWert} nach="," />
        <Formel anzeige tex={F.f} nach="." />
        <p>
          Der Quotient liegt zwischen dem kleinsten und dem größten Wert von <Formel tex="f" /> im Streifen:
        </p>
        <Formel anzeige tex={F.grenzen} nach="." />
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Funktion <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {FUNKTIONEN.map((x2) => (
              <button key={x2.id} type="button" className="chip" aria-pressed={fId === x2.id} aria-label={x2.sprech} onClick={() => wechsle(x2.id)}>
                <Formel tex={x2.tex} />
              </button>
            ))}
          </div>
        </fieldset>
        <div className="regler-gruppe">
          <Regler name="Stelle x" beschriftung={<Formel tex="x" />} wert={kl(ix)} min={fn.imin} max={fn.imax} step={1} onChange={setIx} anzeige={<Formel tex={stelleTeX(fn, x)} />} />
          <Regler name="Streifenbreite h" beschriftung={<Formel tex="h" />} wert={hh} min={0.05} max={1} step={0.05} onChange={setH} anzeige={<Formel tex={zahlTeX(hh, 2)} />} />
        </div>
      </div>

      <div className="labor-knoepfe">
        <span className="klein">Ziehe <Formel tex="h" /> nach links, um den Streifen schmaler zu machen.</span>
        <button type="button" className="knopf-zweit" onClick={() => wechsle('quad')}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
