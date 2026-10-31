import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { Raumbild } from '@/components/Raumbild';
import { ABBILDUNG_TEX, ABBILDUNG_WORT, hilfsweg, projektion, spiegle, type Abbildung, type EbenenArt, type Punkt3, type ProjektionsEbene, type RaumBildSpec } from '@/lib/schraegbild';
import { punktMitKomma } from './Punktlabor';
import { BLAU, GRENZE, ORANGE, SPIEGELLABOR_START } from './daten';

/** Die Wahl im Labor: Spiegelung an einer Ebene, Achse oder am Ursprung, oder senkrechte Projektion auf eine Koordinatenebene. */
export type Wahl = { art: 'spiegeln'; an: Abbildung } | { art: 'projizieren'; auf: ProjektionsEbene };

/** „an der x1x2-Ebene“, „am Ursprung“ (für Beschriftungen und Textalternativen). */
export const anWort = (a: Abbildung) => (a === 'o' ? 'am Ursprung' : `an der ${ABBILDUNG_WORT[a]}`);

const SPIEGELN: Abbildung[] = ['e12', 'e13', 'e23', 'a1', 'a2', 'a3', 'o'];
const PROJIZIEREN: ProjektionsEbene[] = ['e12', 'e13', 'e23'];

/** Der Bildpunkt P' zur Wahl. */
export const bildpunktZurWahl = (p: Punkt3, w: Wahl): Punkt3 => (w.art === 'spiegeln' ? spiegle(p, w.an) : projektion(p, w.auf));

/** Das Bild des Spiegellabors: P, P′, die Verbindung und die gewählte Ebene bzw. Achse. */
export function spiegellaborSpec(p: Punkt3, w: Wahl): RaumBildSpec {
  const q = bildpunktZurWahl(p, w);
  const ebene: EbenenArt | null = w.art === 'projizieren' ? w.auf : w.an === 'e12' || w.an === 'e13' || w.an === 'e23' ? w.an : null;
  const achse = w.art === 'spiegeln' && (w.an === 'a1' || w.an === 'a2' || w.an === 'a3') ? w.an : null;
  const g = GRENZE + 1;
  const achsenLinie = achse ? [{ von: (achse === 'a1' ? [-g, 0, 0] : achse === 'a2' ? [0, -g, 0] : [0, 0, -g]) as Punkt3, bis: (achse === 'a1' ? [g, 0, 0] : achse === 'a2' ? [0, g, 0] : [0, 0, g]) as Punkt3, farbe: BLAU, breite: 4 }] : [];
  const wort = w.art === 'spiegeln' ? `Spiegelung ${anWort(w.an)}` : `senkrechte Projektion auf die ${ABBILDUNG_WORT[w.auf]}`;
  return {
    sprech: `Schrägbild mit dem Punkt P bei ${p.join(', ')} und dem Bildpunkt P Strich bei ${q.join(', ')} (${wort}). Gestrichelt ist die Verbindung von P zu P Strich.`.replace(/-(\d)/g, 'minus $1'),
    punkte: [{ name: 'P', p }, ...(q.some((x, i) => x !== p[i]) ? [{ name: "P'", p: q, farbe: ORANGE }] : [])],
    linien: [...achsenLinie, ...(q.some((x, i) => x !== p[i]) ? [{ von: p, bis: q, farbe: ORANGE, gestrichelt: true }] : []), ...hilfsweg(p, '#9aa5b5')],
    ebenen: ebene ? [ebene] : [],
  };
}

/**
 * Labor zu Spiegelung und senkrechter Projektion: P wird mit drei Reglern eingestellt, dann wählt man die Spiegelung (an einer Koordinatenebene,
 * einer Koordinatenachse oder am Ursprung) oder die senkrechte Projektion auf eine Koordinatenebene. Das Schrägbild zeigt P, den Bildpunkt P′ und die Ebene bzw. Achse.
 */
export function Spiegellabor() {
  const [p, setP] = useState<Punkt3>(SPIEGELLABOR_START);
  const [w, setW] = useState<Wahl>({ art: 'spiegeln', an: 'e12' });
  const q = bildpunktZurWahl(p, w);
  const setze = (i: number, x: number) => setP((v) => v.map((y, j) => (j === i ? x : y)) as Punkt3);
  const aktiv = (x: Wahl) => JSON.stringify(x) === JSON.stringify(w);
  return (
    <div className="labor">
      <Raumbild spec={spiegellaborSpec(p, w)} />
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          {[0, 1, 2].map((i) => (
            <Regler key={i} name={`Koordinate p${i + 1}`} beschriftung={<Formel tex={`p_${i + 1}`} />} wert={p[i]!} min={-GRENZE} max={GRENZE} step={1} onChange={(x) => setze(i, x)} anzeige={<Formel tex={String(p[i])} />} />
          ))}
        </div>
        <fieldset className="schalter-gruppe">
          <legend>Spiegeln an</legend>
          <div className="schnellwahl">
            {SPIEGELN.map((a) => (
              <button key={a} type="button" className="chip" aria-pressed={aktiv({ art: 'spiegeln', an: a })} aria-label={`Spiegelung ${anWort(a)}`} onClick={() => setW({ art: 'spiegeln', an: a })}>
                <Formel tex={ABBILDUNG_TEX[a]} />
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="schalter-gruppe">
          <legend>Senkrecht projizieren auf</legend>
          <div className="schnellwahl">
            {PROJIZIEREN.map((e) => (
              <button key={e} type="button" className="chip" aria-pressed={aktiv({ art: 'projizieren', auf: e })} aria-label={`Projektion auf die ${ABBILDUNG_WORT[e]}`} onClick={() => setW({ art: 'projizieren', auf: e })}>
                <Formel tex={ABBILDUNG_TEX[e]} />
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Bildpunkt <Formel tex="P'" /> und Verbindung von <Formel tex="P" /> aus</li>
        <li><span className="legende-farbe" style={{ background: '#9aa5b5' }} aria-hidden="true" /> Weg zu <Formel tex="P" /></li>
      </ul>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={punktMitKomma('P', p)} />
        <Formel anzeige tex={punktMitKomma("P'", q)} />
      </div>
    </div>
  );
}
