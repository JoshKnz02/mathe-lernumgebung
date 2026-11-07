import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Umbruchformel } from '@/components/Umbruchformel';
import { ebeneAusGeraden, ebeneAusPunktUndGerade } from '@/lib/ebene';
import { gleichungE, gleichungESchmal } from '@/lib/ebenenhilfen';
import { liegtAuf, LAGE_NAME, type Gerade } from '@/lib/gerade';
import { wortKoordinaten } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import type { Punkt3, RaumBildSpec } from '@/lib/schraegbild';
import { gl, glSchmal } from '@/lib/geradenhilfen';
import { geradenPaarBild, geradenLinien, punkt, punktGeradeBild } from './Bilder';
import { LABOR_G, LABOR_GRENZE, LABOR_START, PUNKT_START } from './daten';

const nullvektor = (v: number[]) => v.every((x) => x === 0);

/* ---------- Geradenlabor ---------- */

/** Bild des Geradenlabors: g fest (schwarz), h orange; mit der Auswertung auch die Ebene (nur bei Schnittpunkt oder parallelen Geraden). Ohne gültige Gerade h nur g. */
export function geradenLaborBild(g: Gerade, h: Gerade | null, auswerten: boolean): { spec: RaumBildSpec; art: string | null } {
  if (!h) {
    const { linien, namen } = geradenLinien(g, null, []);
    return { art: null, spec: { sprech: 'Schrägbild. Die schwarze Gerade g. Der Richtungsvektor von h ist der Nullvektor, damit gibt es keine Gerade h.', punkte: namen, linien, ebenenNamen: false, fein: true } };
  }
  const { spec, art } = geradenPaarBild({ g, h }, auswerten);
  return { spec, art };
}

/** Geradenlabor (nur im Raum): g ist fest, h wird mit Stützvektor q und Richtungsvektor w eingestellt. Lage und Ebene lassen sich einblenden. */
export function Geradenlabor() {
  const [q, setQ] = useState<number[]>(LABOR_START.q);
  const [w, setW] = useState<number[]>(LABOR_START.w);
  const [auswerten, setAuswerten] = useState(false);
  const kein = nullvektor(w);
  const h: Gerade | null = kein ? null : { p: q, u: w };
  const { spec } = geradenLaborBild(LABOR_G, h, auswerten);
  const erg = h ? ebeneAusGeraden(LABOR_G, h) : null;
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <p className="klein">
        Die feste Gerade <Formel tex={gl(LABOR_G)} nach="." /> Die Gerade <Formel tex="h" /> hat den Stützvektor <Formel tex={t`\vec{q}`} /> und den Richtungsvektor <Formel tex={t`\vec{w}`} nach="." />
      </p>
      {kein && <p className="klein">Der Richtungsvektor darf nicht der Nullvektor sein.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('q', 'q', q, LABOR_GRENZE.q, setQ)}</div>
        <div className="regler-gruppe">{koordinatenRegler('w', 'w', w, LABOR_GRENZE.w, setW)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={auswerten} onChange={(ev) => setAuswerten(ev.target.checked)} /> Lage und Ebene zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        {h && <Umbruchformel tex={gl(h, 'h', 'k')} schmal={glSchmal(h, 'h', 'k')} />}
        {auswerten && erg && (
          <>
            <p>
              Die Geraden {erg.art === 'schneidend' ? LAGE_NAME.schneidend : erg.art === 'parallel' ? 'sind parallel und verschieden' : erg.art === 'identisch' ? 'sind identisch' : 'sind windschief'}.{' '}
              {erg.ebene ? 'Beide Geraden liegen in genau einer Ebene. Eine Gleichung der Ebene:' : erg.art === 'identisch' ? 'Dieselbe Gerade liegt in unendlich vielen Ebenen, es gibt keine eindeutige Ebene.' : 'Es gibt keine Ebene, die beide Geraden enthält.'}
            </p>
            {erg.ebene && <Umbruchformel tex={gleichungE(erg.ebene)} schmal={gleichungESchmal(erg.ebene)} />}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Punktlabor ---------- */

/** Bild des Punktlabors: g fest, der Punkt X und (wenn X nicht auf g liegt) die Ebene durch g und X. */
export function punktLaborBild(x: number[], auswerten: boolean): RaumBildSpec {
  const g = LABOR_G;
  const gleichP = x.every((c, i) => c === g.p[i]);
  const e = ebeneAusPunktUndGerade(g, x);
  if (e && auswerten) {
    const b = punktGeradeBild(g, x as Punkt3);
    return b;
  }
  const punkte = [gleichP ? punkt('P', g.p) : punkt('X', x), ...(gleichP ? [] : [punkt('P', g.p)])];
  const { linien, namen } = geradenLinien(g, null, punkte);
  return { sprech: `Schrägbild. Die schwarze Gerade g geht durch den Punkt P bei ${wortKoordinaten(g.p)}. ${gleichP ? 'Der eingestellte Punkt X ist der Punkt P.' : `Der eingestellte Punkt X liegt bei ${wortKoordinaten(x)}.`}`, punkte: [...punkte, ...namen], linien, ebenenNamen: false, fein: true };
}

/** Punktlabor (nur im Raum): g ist fest, der Punkt X wird eingestellt. Die Ebene durch g und X lässt sich einblenden. */
export function Punktlabor() {
  const g = LABOR_G;
  const [x, setX] = useState<number[]>(PUNKT_START);
  const [auswerten, setAuswerten] = useState(false);
  const e = ebeneAusPunktUndGerade(g, x);
  return (
    <div className="labor">
      <Raumbild spec={punktLaborBild(x, auswerten)} />
      <p className="klein">
        Die feste Gerade <Formel tex={gl(g)} nach="." /> Der Punkt <Formel tex="X" /> wird eingestellt.
      </p>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('X', 'x', x, 4, setX)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={auswerten} onChange={(ev) => setAuswerten(ev.target.checked)} /> Ebene zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`X(${x.join('\\,|\\,')})`} />
        {auswerten && (
          <>
            <p>{e ? 'X liegt nicht auf g. Die Gerade und der Punkt legen genau eine Ebene fest. Eine Gleichung:' : liegtAuf(g, x) ? 'X liegt auf g. Dann gibt es unendlich viele Ebenen, die g enthalten, die Ebene ist nicht eindeutig festgelegt.' : ''}</p>
            {e && <Umbruchformel tex={gleichungE(e)} schmal={gleichungESchmal(e)} />}
          </>
        )}
      </div>
    </div>
  );
}
