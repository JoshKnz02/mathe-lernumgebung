import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Raumbild, useDarstellung } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { bruch, punktBruchTeX, rund2 } from '@/lib/geradenhilfen';
import { t as tex, zt } from '@/lib/modulhilfen';
import { abstandZuM, figurart, koordinatensumme, mittelpunkt, regelmaessig, seiteKurzLang, umlauf } from '@/lib/permutation';
import type { Punkt3, RaumBildSpec } from '@/lib/schraegbild';
import { bildGerade, BILD_PUNKT, LABOR_START, ORANGE } from './daten';
import { permutationBild } from './Bilder';

const WORT_ANZAHL: Record<number, string> = { 1: 'ein Punkt', 3: 'drei verschiedene Punkte', 6: 'sechs verschiedene Punkte' };

/** Die Zeilen unter dem Bild des Permutationslabors (als Daten, damit der Test sie ohne Browser prüfen kann). */
export function laborAussagen(p: Punkt3) {
  const art = figurart(p);
  const n = umlauf(p).length;
  const s = koordinatensumme(p);
  const m = mittelpunkt(p);
  const d = abstandZuM(p);
  const { a, b } = seiteKurzLang(p);
  return { art, n, s, m, d, kurz: a, lang: b, regelmaessig: regelmaessig(p) };
}

/**
 * Labor Punkte vertauschen: Die Koordinaten a, b, c von P werden mit Reglern eingestellt. Das Bild zeigt alle Punkte, die beim Vertauschen entstehen,
 * auf Wunsch das Sechseck, die Ebene, den Mittelpunkt M und die Raumdiagonale. Darunter stehen Koordinatensumme, Abstand zu M, Seitenlängen und Winkel.
 */
export function Permutationslabor() {
  const [p, setP] = useState<Punkt3>(LABOR_START);
  const [figur, setFigur] = useState(true);
  const [ebene, setEbene] = useState(false);
  const [mitte, setMitte] = useState(false);
  const [diagonale, setDiagonale] = useState(false);
  const raum = useDarstellung() === 'raum';
  const aussagen = laborAussagen(p);
  const spec: RaumBildSpec = permutationBild(p, { figur, ebene, mittelpunkt: mitte, diagonale: diagonale && raum });
  const setze = (i: number, x: number) => setP((q) => q.map((v, j) => (j === i ? x : v)) as Punkt3);
  const namen = ['a', 'b', 'c'];
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          {[0, 1, 2].map((i) => (
            <Regler key={i} name={`Koordinate ${namen[i]} von P`} beschriftung={<Formel tex={namen[i]!} />} wert={p[i]!} min={-4} max={4} step={1} onChange={(x) => setze(i, x)} anzeige={<Formel tex={zt(p[i]!)} />} />
          ))}
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={figur} onChange={(e) => setFigur(e.target.checked)} /> Seiten verbinden</label>
          <label className="schalter"><input type="checkbox" checked={ebene} onChange={(e) => setEbene(e.target.checked)} /> Ebene zeigen</label>
          <label className="schalter"><input type="checkbox" checked={mitte} onChange={(e) => setMitte(e.target.checked)} /> Mittelpunkt M zeigen</label>
          {raum && <label className="schalter"><input type="checkbox" checked={diagonale} onChange={(e) => setDiagonale(e.target.checked)} /> Raumdiagonale zeigen</label>}
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <p className="klein">
          Aus <Formel tex={tex`P(${p.map(zt).join('\\,|\\,')})`} /> entstehen {WORT_ANZAHL[aussagen.n]}. Ihre Koordinatensumme ist bei allen gleich: <Formel tex={tex`s=${p.map((x, i) => (i === 0 ? zt(x) : x < 0 ? `-${zt(-x)}` : `+${zt(x)}`)).join('')}=${zt(aussagen.s)}`} nach="." />
        </p>
        <p className="klein">
          Der Mittelpunkt ist <Formel tex={punktBruchTeX('M', aussagen.m)} nach="." />
          {aussagen.d > 0 ? <> Alle Punkte haben von ihm denselben Abstand, nämlich ungefähr <Formel tex={tex`${rund2(aussagen.d)}`} nach="." /></> : ' Der einzige Punkt fällt mit M zusammen.'}
        </p>
        {aussagen.art === 'sechseck' && (
          <p className="klein">
            {aussagen.regelmaessig ? (
              <>Alle Seiten sind gleich lang, nämlich ungefähr <Formel tex={tex`${rund2(aussagen.kurz)}`} nach="." /> Das Sechseck ist regelmäßig.</>
            ) : (
              <>Die Seiten sind abwechselnd ungefähr <Formel tex={tex`${rund2(aussagen.kurz)}`} /> und <Formel tex={tex`${rund2(aussagen.lang)}`} /> lang. Das Sechseck ist nicht regelmäßig.</>
            )}{' '}
            Alle Innenwinkel sind <Formel tex={tex`120^{\circ}`} nach="." />
          </p>
        )}
        {aussagen.art === 'dreieck' && (
          <p className="klein">
            Es entsteht ein gleichseitiges Dreieck mit der Seitenlänge ungefähr <Formel tex={tex`${rund2(aussagen.kurz || aussagen.lang)}`} nach="." />
          </p>
        )}
      </div>
    </div>
  );
}

/** Bild des Bildpunktlabors: der Punkt P(t | X + t : 2 | Y + t : 2), in der räumlichen Ansicht mit der Geraden aller Punkte, die im Schrägbild an dieselbe Stelle fallen. */
export function bildpunktlaborBild(t: number, mitGerade: boolean): RaumBildSpec {
  return {
    sprech: `Schrägbild. Der Punkt P bewegt sich mit der Koordinate x1 gleich ${zt(t).replace('{,}', ',').replace('-', 'minus ')}. Im Schrägbild bleibt er an derselben Stelle, X gleich minus 2 und Y gleich 2.${mitGerade ? ' Die orange Gerade zeigt alle Punkte im Raum, die dort dargestellt werden.' : ''}`,
    punkte: [{ name: 'P', p: bildGerade(t) }],
    linien: mitGerade ? [{ von: bildGerade(-4), bis: bildGerade(4), farbe: ORANGE, breite: 2 }] : [],
    ebenenNamen: false,
    fein: true,
  };
}

/**
 * Labor Ein Bildpunkt, viele Punkte: Der Regler verändert x₁, die Koordinaten x₂ und x₃ folgen so, dass der Punkt im Schrägbild an derselben Stelle bleibt.
 * In der räumlichen Ansicht wandert er auf einer Geraden.
 */
export function Bildpunktlabor() {
  const [t, setT] = useState(2);
  const raum = useDarstellung() === 'raum';
  const q = bildGerade(t);
  return (
    <div className="labor">
      <Raumbild spec={bildpunktlaborBild(t, raum)} />
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler name="Koordinate x1 des Punkts" beschriftung={<Formel tex="x_1" />} wert={t} min={-4} max={4} step={0.5} onChange={setT} anzeige={<Formel tex={zt(t)} />} />
        </div>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={tex`P(${q.map(zt).join('\\,|\\,')})`} />
        <p className="klein">
          Im Schrägbild liegt <Formel tex="P" /> immer an derselben Stelle <Formel tex={tex`(${BILD_PUNKT.X}\,|\,${BILD_PUNKT.Y})`} nach="." /> Wird <Formel tex="x_1" /> um <Formel tex={tex`${zt(t >= 0 ? 2 : 2)}`} /> größer, werden <Formel tex="x_2" /> und <Formel tex="x_3" /> um je <Formel tex="1" /> größer.
        </p>
        {!raum && <p className="klein">Wechsle auf „Räumlich (3D)“, dann siehst du, wie sich <Formel tex="P" /> im Raum bewegt.</p>}
      </div>
    </div>
  );
}
