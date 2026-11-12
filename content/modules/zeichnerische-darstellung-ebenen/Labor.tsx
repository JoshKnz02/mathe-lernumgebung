import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { Umbruchformel } from '@/components/Umbruchformel';
import { koordinatenformTeX, kreuzSpalte, kreuzSpalteKurz, skalarTermTeX } from '@/lib/ebenenhilfen';
import { skalarprodukt } from '@/lib/vektor';
import { KOORDINATENEBENEN } from '@/lib/gerade';
import { spurgerade, SPURGERADE_TEX, spurpunkteEbene, spurpunktAchse, ACHSE_NAME, EBENE_NAME } from '@/lib/spur';
import { EBENE_GLEICHUNG_TEX, spurGleichungTeX, spurRechnung } from '@/lib/spurhilfen';
import { t, zt } from '@/lib/modulhilfen';
import { spalte } from '@/lib/laborhilfen';
import { ebeneAusKoordinatenform } from '@/lib/spurhilfen';
import { ebeneImWuerfel } from '@/lib/ebene';
import { ebenenBild, zeichenBild } from './Bilder';
import { LABOR_GRENZE, LABOR_START, ZEICHEN } from './daten';
import { gleichungE } from './rechenhilfen';

const nullvektor = (n: number[]) => n.every((x) => x === 0);

/** Ergebnistext zu einem Spurpunkt (nach dem Schalter): Rechnung und Schluss. */
function SpurpunktZeile({ k, i }: { k: { n: number[]; d: number }; i: number }) {
  const s = spurpunktAchse(k, i);
  const r = spurRechnung(k, i);
  const achse = ACHSE_NAME[i]!;
  return (
    <li>
      <p>
        <strong>Auf der {achse}-Achse:</strong> <Formel tex={t`${r.bedingung}`} nach="." /> Es bleibt <Formel tex={r.zeilen[0]!} nach={s.art === 'punkt' && r.zeilen.length > 1 ? ',' : '.'} />
        {s.art === 'punkt' && r.zeilen.length > 1 && (
          <>
            {' '}also <Formel tex={r.zeilen[1]!} nach="." />
          </>
        )}
        {s.art === 'punkt' && (
          <>
            {' '}Spurpunkt <Formel tex={r.ergebnis!} nach="." />
            {s.punkt.some((c) => Math.abs(c) > 4) ? ' Er liegt außerhalb des gezeichneten Bereichs (Koordinaten bis 4).' : ''}
          </>
        )}
        {s.art === 'keiner' && ` Das ist eine falsche Aussage: Es gibt keinen Spurpunkt auf der ${achse}-Achse, die Ebene ist parallel zur ${achse}-Achse.`}
        {s.art === 'achseInEbene' && ` Das ist immer wahr: Die ganze ${achse}-Achse liegt in der Ebene, es gibt keinen einzelnen Spurpunkt auf ihr.`}
      </p>
    </li>
  );
}

/** Ebenenlabor (nur im Raum): a, b, c und d der Koordinatenform werden eingestellt, Spurpunkte und Spurgeraden lassen sich einblenden. */
export function Ebenenlabor() {
  const [n, setN] = useState<number[]>(LABOR_START.n);
  const [d, setD] = useState(LABOR_START.d);
  const [punkte, setPunkte] = useState(false);
  const [geraden, setGeraden] = useState(false);
  const kein = nullvektor(n);
  const k = { n, d };
  const { spec, hatFlaeche } = kein ? { spec: { sprech: 'Schrägbild des Koordinatensystems, es ist keine Ebene eingestellt.', ebenenNamen: false, fein: true }, hatFlaeche: false } : ebenenBild(k, { modus: 'labor', flaeche: 'wuerfel', spurpunkte: punkte, spurgeraden: geraden });
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          {(['a', 'b', 'c'] as const).map((name, i) => (
            <Regler key={name} name={`Koeffizient ${name}`} beschriftung={<Formel tex={name} />} wert={n[i]!} min={-LABOR_GRENZE.n} max={LABOR_GRENZE.n} step={1} onChange={(w) => setN(n.map((x, j) => (j === i ? w : x)))} anzeige={<Formel tex={zt(n[i]!)} />} />
          ))}
          <Regler name="Zahl d" beschriftung={<Formel tex="d" />} wert={d} min={-LABOR_GRENZE.d} max={LABOR_GRENZE.d} step={1} onChange={setD} anzeige={<Formel tex={zt(d)} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={punkte} onChange={(ev) => setPunkte(ev.target.checked)} /> Spurpunkte zeigen</label>
          <label className="schalter"><input type="checkbox" checked={geraden} onChange={(ev) => setGeraden(ev.target.checked)} /> Spurgeraden zeigen</label>
        </fieldset>
      </div>
      {kein && <p className="klein">Mindestens ein Koeffizient muss von null verschieden sein.</p>}
      {!kein && !hatFlaeche && ebeneImWuerfel(ebeneAusKoordinatenform(k)).length === 0 && <p className="klein">Die Ebene trifft den gezeichneten Bereich (Koordinaten von −4 bis 4) nicht.</p>}
      <div className="labor-gleichung" aria-live="polite">
        {!kein && <Formel anzeige tex={koordinatenformTeX(n, d, 'E')} />}
        {!kein && punkte && (
          <ul className="liste-ohne-zahl">
            {[0, 1, 2].map((i) => (
              <SpurpunktZeile key={i} k={k} i={i} />
            ))}
          </ul>
        )}
        {!kein && geraden && (
          <ul className="liste-ohne-zahl">
            {KOORDINATENEBENEN.map((e) => {
              const g = spurgerade(k, e);
              return (
                <li key={e}>
                  <p>
                    <strong>In der {EBENE_NAME[e]}</strong> <Formel tex={EBENE_GLEICHUNG_TEX[e]} nach=":" />{' '}
                    {g.art === 'gerade' && (
                      <>
                        Es bleibt <Formel tex={spurGleichungTeX(k, e)} nach="." /> Das ist die Spurgerade <Formel tex={SPURGERADE_TEX[e]} nach="." />
                      </>
                    )}
                    {g.art === 'keine' && 'Die Ebene ist parallel zu dieser Koordinatenebene, es gibt keine Spurgerade.'}
                    {g.art === 'identisch' && 'Die Ebene ist diese Koordinatenebene.'}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

const SCHRITTE = ['Koordinatenform bestimmen (falls nötig)', 'Spurpunkte berechnen', 'Spurpunkte einzeichnen', 'Spurgeraden zeichnen, Spurdreieck schraffieren'];

/** Zeichenlabor (nur im Raum): Eine Ebene wird in vier Schritten gezeichnet, jeder Schritt wird erst nach „Weiter“ gezeigt. */
export function Zeichenlabor() {
  const [i, setI] = useState(0);
  const [schritt, setSchritt] = useState(0);
  const b = ZEICHEN[i]!;
  const k = b.k;
  const sp = spurpunkteEbene(k);
  const nv = b.param ? { u: b.param.u, v: b.param.v, p: b.param.p } : null;
  return (
    <div className="labor">
      <Raumbild spec={zeichenBild(b, schritt)} />
      <div className="darstellungswahl" role="group" aria-label="Ebene wählen">
        <span className="darstellungswahl-name">Ebene:</span>
        {ZEICHEN.map((z, m) => (
          <button key={z.id} type="button" className="chip" aria-pressed={i === m} onClick={() => { setI(m); setSchritt(0); }}>
            {z.name}
          </button>
        ))}
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <p>Gegeben ist die Ebene</p>
        {b.param ? <Umbruchformel tex={gleichungE(b.param)} schmal={t`\begin{gathered}E:\ \vec{x}=${spalte(b.param.p)}\\{}+r\cdot${spalte(b.param.u)}\\{}+s\cdot${spalte(b.param.v)}\end{gathered}`} /> : <Formel anzeige tex={koordinatenformTeX(k.n, k.d, 'E')} />}
        <p className="klein">
          Schritt {schritt} von {SCHRITTE.length}
          {schritt > 0 && <>: {SCHRITTE[schritt - 1]}</>}
        </p>
        {schritt === 0 && <p>Zuerst ist nur das Koordinatensystem gezeichnet. Überlege, was du als Nächstes tun würdest, und gehe dann Schritt für Schritt weiter.</p>}
        {schritt === 1 && (
          <>
            {nv ? (
              <>
                <p>Die Spurpunkte lassen sich am einfachsten aus der Koordinatenform berechnen. Dafür brauchst du einen Normalenvektor (Vektorprodukt (Kreuzprodukt) der Spannvektoren) und die Zahl <Formel tex="d" nach="." /></p>
                <Umbruchformel tex={t`\vec{n}=${kreuzSpalte(nv.u, nv.v)}=${spalte(k.n)}`} schmal={t`\begin{gathered}\vec{n}\\{}=${kreuzSpalteKurz(nv.u, nv.v)}\\{}=${spalte(k.n)}\end{gathered}`} />
                <Umbruchformel tex={t`d=${skalarTermTeX(k.n, nv.p)}=${zt(skalarprodukt(k.n, nv.p))}`} schmal={t`\begin{gathered}d=\vec{n}\cdot\vec{p}\\{}=${zt(skalarprodukt(k.n, nv.p))}\end{gathered}`} />
                <Formel anzeige tex={koordinatenformTeX(k.n, k.d, 'E')} />
              </>
            ) : (
              <p>Die Ebene ist schon in Koordinatenform gegeben. Hier ist nichts umzuwandeln.</p>
            )}
          </>
        )}
        {schritt === 2 && (
          <>
            <p>Auf jeder Achse sind die beiden anderen Koordinaten null.</p>
            {[0, 1, 2].map((m) => {
              const r = spurRechnung(k, m);
              return (
                <Umbruchformel
                  key={m}
                  tex={t`${r.bedingung}:\ ${r.zeilen.join('\\ \\Rightarrow\\ ')}\ \Rightarrow\ ${r.ergebnis}`}
                  schmal={t`\begin{gathered}${r.bedingung}\\${r.zeilen.join('\\\\')}\\${r.ergebnis}\end{gathered}`}
                />
              );
            })}
          </>
        )}
        {schritt === 3 && <p>Trage die Spurpunkte <Formel tex={t`S_1`} nach="," /> <Formel tex={t`S_2`} /> und <Formel tex={t`S_3`} /> auf den Achsen ein (1 Einheit sind 2 Kästchen auf der <Formel tex="x_2" />- und <Formel tex="x_3" />-Achse, auf der <Formel tex="x_1" />-Achse eine Kästchendiagonale) und beschrifte sie.</p>}
        {schritt === 4 && (
          <>
            <p>Verbinde die Spurpunkte mit dem Lineal. Die Verbindungen sind Teile der Spurgeraden <Formel tex={t`s_{12}`} nach="," /> <Formel tex={t`s_{13}`} /> und <Formel tex={t`s_{23}`} nach="." /> Beschrifte sie.</p>
            <p>Schraffiere das Spurdreieck oder lege es farbig an. Es ist nur ein Ausschnitt der Ebene, denn die Ebene setzt sich in alle Richtungen fort.</p>
          </>
        )}
        {schritt >= 3 && <p className="klein">Spurpunkte: {sp.map((s) => s.name).join(', ')}.</p>}
      </div>
      <div className="labor-bedienung">
        <button type="button" className="knopf-zweit" disabled={schritt === 0} onClick={() => setSchritt((s) => Math.max(0, s - 1))}>
          Zurück
        </button>{' '}
        <button type="button" className="knopf" disabled={schritt === SCHRITTE.length} onClick={() => setSchritt((s) => Math.min(SCHRITTE.length, s + 1))}>
          Weiter
        </button>
      </div>
    </div>
  );
}
