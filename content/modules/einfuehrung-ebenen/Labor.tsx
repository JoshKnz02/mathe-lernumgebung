import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { Umbruchformel } from '@/components/Umbruchformel';
import { ebeneImWuerfel, ebenenpunkt, gebilde, gleicheEbene, istEbene, liegtInEbene, punktprobe, type Ebene } from '@/lib/ebene';
import { gleichungE, gleichungESchmal, koordinatenGleichung, punktRechnungE, ZEILE_NAME } from '@/lib/ebenenhilfen';
import { geradeImWuerfel, imWuerfel, kuerzeImWuerfel } from '@/lib/gerade';
import { bruch } from '@/lib/geradenhilfen';
import { spalte, wortKoordinaten, wortZahl } from '@/lib/laborhilfen';
import { t, zt } from '@/lib/modulhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { summe, vielfaches, type Vek } from '@/lib/vektor';
import { ebenenFlaeche, gleichungBild, O, pfeil, punkt } from './Bilder';
import { BLAU, GLEICHUNG, GLEICHUNG_GRENZE, GLEICHUNG_START, GRAU, ORANGE, PARAMETER, PARAMETER_GRENZE, PUNKTPROBE, PUNKTPROBE_START, ROSA, SCHWARZ } from './daten';

const nullvektor = (v: Vek) => v.every((x) => x === 0);
const gleichOrt = (a: Vek, b: Vek) => a.every((x, i) => x === b[i]);

/* ---------- Parameterlabor ---------- */

/**
 * Bild des Parameterlabors: der Stützpunkt P mit dem Stützvektor (orange), die Spannvektoren u (blau) und v (rosa) in P (breiter gezeichnet), der Punkt X zu r und s und
 * der Weg von P in Richtung u (r-mal) und dann in Richtung v (s-mal), schwarz gestrichelt. Auf Wunsch die Ebene (grau) bzw. bei kollinearen Spannvektoren die Gerade (schwarz).
 * Liegt X außerhalb des Koordinatensystems (über 4), wird er nicht gezeichnet.
 */
export function parameterBild(p: Vek, u: Vek, v: Vek, r: number, s: number, zeigeEbene: boolean): { spec: RaumBildSpec; aussen: boolean; keinX: boolean } {
  const e: Ebene = { p, u, v };
  const art = gebilde(e);
  const P = p as Punkt3;
  const X = ebenenpunkt(e, r, s);
  const gleichP = gleichOrt(X, p);
  const aussen = !gleichP && !imWuerfel(X);
  const punkte: RaumPunkt[] = [];
  const linien: RaumLinie[] = [];
  let flaechen: NonNullable<RaumBildSpec['flaechen']> = [];
  if (zeigeEbene) {
    if (art === 'ebene') {
      const f = ebenenFlaeche(e);
      flaechen = f.flaechen;
      linien.push(...f.linien);
    } else if (art === 'gerade') {
      const g = geradeImWuerfel({ p, u: nullvektor(u) ? v : u });
      if (g) linien.push({ von: g[0], bis: g[1], farbe: SCHWARZ, breite: 2 });
    }
  }
  if (!nullvektor(p)) linien.push(pfeil(O, P, ORANGE));
  else punkte.push({ name: 'O', p: O, ohneText: true });
  if (!nullvektor(u)) linien.push(pfeil(P, kuerzeImWuerfel(p, summe(p, u)).ende, BLAU, 4.5));
  if (!nullvektor(v)) linien.push(pfeil(P, kuerzeImWuerfel(p, summe(p, v)).ende, ROSA, 4.5));
  const W = summe(p, vielfaches(r, u));
  const wegOk = !gleichP && !aussen && imWuerfel(W);
  if (wegOk) {
    if (!gleichOrt(W, p)) linien.push({ von: P, bis: W as Punkt3, farbe: SCHWARZ, gestrichelt: true, breite: 1.6 });
    if (!gleichOrt(W, X)) linien.push({ von: W as Punkt3, bis: X as Punkt3, farbe: SCHWARZ, gestrichelt: true, breite: 1.6 });
  }
  punkte.push(punkt('P', P));
  const zeigeX = !gleichP && !aussen;
  if (zeigeX) punkte.push(punkt('X', X));
  const wasMan = art === 'ebene' ? (zeigeEbene ? ' Die graue Fläche ist ein Ausschnitt der Ebene.' : '') : art === 'gerade' ? (zeigeEbene ? ' Die schwarze Linie ist die Gerade, auf der alle Punkte der Gleichung liegen.' : '') : '';
  const sprech = `Schrägbild. Der Stützpunkt P liegt bei ${wortKoordinaten(p)}, der orange Pfeil vom Ursprung zu P ist der Stützvektor. ${
    nullvektor(u) && nullvektor(v) ? 'Beide Spannvektoren sind der Nullvektor.' : 'Der blaue Pfeil in P ist der erste, der rosa Pfeil in P der zweite Spannvektor.'
  }${wasMan} ${
    gleichP ? 'Für r und s gleich 0 ist X der Stützpunkt P.' : aussen ? `Der Punkt X zu r gleich ${wortZahl(r)} und s gleich ${wortZahl(s)} liegt außerhalb des gezeichneten Koordinatensystems.` : `Der Punkt X zu r gleich ${wortZahl(r)} und s gleich ${wortZahl(s)} liegt bei ${wortKoordinaten(X)}${wegOk ? ', der gestrichelte Weg führt von P erst r-mal in Richtung des ersten, dann s-mal in Richtung des zweiten Spannvektors zu ihm' : ''}.`
  }`;
  return { spec: { sprech, punkte, linien, flaechen, ebenenNamen: false, fein: true }, aussen, keinX: !zeigeX };
}

const AUSWERTUNG: Record<ReturnType<typeof gebilde>, string> = {
  ebene: 'Die Spannvektoren sind keine Vielfachen voneinander: Die Gleichung beschreibt eine Ebene.',
  gerade: 'Die Spannvektoren sind Vielfache voneinander oder einer ist der Nullvektor: Die Gleichung beschreibt keine Ebene, sondern nur eine Gerade.',
  punkt: 'Beide Spannvektoren sind der Nullvektor: Die Gleichung beschreibt nur den Punkt P.',
};

/** Parameterlabor (nur im Raum): p, u, v, r und s werden eingestellt. Ebene und Rechnung lassen sich einblenden. */
export function Parameterlabor() {
  const [p, setP] = useState<number[]>(PARAMETER.e.p);
  const [u, setU] = useState<number[]>(PARAMETER.e.u);
  const [v, setV] = useState<number[]>(PARAMETER.e.v);
  const [r, setR] = useState(1);
  const [s, setS] = useState(1);
  const [ebene, setEbene] = useState(false);
  const [rechnung, setRechnung] = useState(false);
  const { spec, aussen } = parameterBild(p, u, v, r, s, ebene);
  const e: Ebene = { p, u, v };
  const art = gebilde(e);
  const rs = (name: string, wert: number, set: (w: number) => void) => (
    <Regler name={`Parameter ${name}`} beschriftung={<Formel tex={name} />} wert={wert} min={-PARAMETER_GRENZE.par} max={PARAMETER_GRENZE.par} step={0.5} onChange={set} anzeige={<Formel tex={zt(wert)} />} />
  );
  const x = punktRechnungE(e, r, s);
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Stützvektor <Formel tex={t`\vec{p}`} /> vom Ursprung zum Stützpunkt <Formel tex="P" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Spannvektor <Formel tex={t`\vec{u}`} /> in <Formel tex="P" /> (breiter darunter gezeichnet)</li>
        <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> Spannvektor <Formel tex={t`\vec{v}`} /> in <Formel tex="P" /> (breiter darunter gezeichnet)</li>
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> gestrichelt: der Weg von <Formel tex="P" /> zum Punkt <Formel tex="X" /></li>
        {ebene && <li><span className="legende-farbe" style={{ background: GRAU }} aria-hidden="true" /> die Ebene <Formel tex="E" /> (grau, ein Ausschnitt im Koordinatensystem)</li>}
      </ul>
      {aussen && <p className="klein">Der Punkt X liegt außerhalb des gezeichneten Koordinatensystems (eine Koordinate ist größer als 4 oder kleiner als −4). Er ist nicht eingezeichnet, die Rechnung gilt trotzdem.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('p', 'p', p, PARAMETER_GRENZE.p, setP)}</div>
        <div className="regler-gruppe">{koordinatenRegler('u', 'u', u, PARAMETER_GRENZE.u, setU)}</div>
        <div className="regler-gruppe">{koordinatenRegler('v', 'v', v, PARAMETER_GRENZE.v, setV)}</div>
        <div className="regler-gruppe">
          {rs('r', r, setR)}
          {rs('s', s, setS)}
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={ebene} onChange={(ev) => setEbene(ev.target.checked)} /> Ebene einzeichnen</label>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(ev) => setRechnung(ev.target.checked)} /> Rechnung und Auswertung</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\vec{p}=${spalte(p)},\quad \vec{u}=${spalte(u)},\quad \vec{v}=${spalte(v)}`} />
        {rechnung && (
          <>
            <Umbruchformel tex={x.tex} schmal={x.schmal} />
            <p>{AUSWERTUNG[art]}</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Punktprobelabor ---------- */

/** Bild des Punktprobelabors: die feste Ebene E (grau) mit dem Stützpunkt P und der eingestellte Punkt X. */
export function punktprobeBild(x: Vek): RaumBildSpec {
  const e = PUNKTPROBE.e;
  const gleichP = gleichOrt(x, e.p);
  const f = ebenenFlaeche(e);
  const punkte: RaumPunkt[] = [punkt('P', PUNKTPROBE.P)];
  if (!gleichP) punkte.push(punkt('X', x));
  return {
    sprech: `Schrägbild. Die graue Fläche ist ein Ausschnitt der Ebene E mit dem Stützpunkt P bei ${wortKoordinaten(e.p)}. ${gleichP ? 'Der eingestellte Punkt X ist der Stützpunkt P.' : `Der eingestellte Punkt X liegt bei ${wortKoordinaten(x)}.`}`,
    punkte,
    linien: f.linien,
    flaechen: f.flaechen,
    ebenenNamen: false,
    fein: true,
  };
}

/** Punktprobelabor (nur im Raum): Ein Punkt X wird eingestellt. Die Punktprobe (drei Gleichungen für r und s) lässt sich einblenden. */
export function Punktprobelabor() {
  const e = PUNKTPROBE.e;
  const [x, setX] = useState<number[]>(PUNKTPROBE_START);
  const [probe, setProbe] = useState(false);
  const pp = punktprobe(e, x)!;
  const gl = [0, 1, 2].map((i) => `\\text{${ZEILE_NAME[i]}:}\\quad ${koordinatenGleichung(e, i, x[i]!)}`);
  const [i, j] = pp.paar;
  const ergebnis = `${gl.join('\\\\')}`;
  return (
    <div className="labor">
      <Raumbild spec={punktprobeBild(x)} />
      <p className="klein">
        Die Ebene <Formel tex={gleichungE(e)} nach="." /> Der Stützpunkt ist <Formel tex={t`P(${e.p.map(zt).join('\\,|\\,')})`} nach="." />
      </p>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('X', 'x', x, 4, setX)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={probe} onChange={(ev) => setProbe(ev.target.checked)} /> Punktprobe zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`X(${x.map(zt).join('\\,|\\,')})`} />
        {probe && (
          <>
            <Umbruchformel tex={`\\begin{gathered}${ergebnis}\\end{gathered}`} schmal={`\\begin{gathered}${ergebnis}\\end{gathered}`} />
            <p>
              Aus den Gleichungen {ZEILE_NAME[i!]} und {ZEILE_NAME[j!]} folgt <Formel tex={`r=${bruch(pp.r)}`} nach="," /> <Formel tex={`s=${bruch(pp.s)}`} nach="." /> Setzt du diese Werte in Gleichung {ZEILE_NAME[pp.rest]} ein, ergibt die linke Seite <Formel tex={bruch(pp.ergibt)} nach="," /> verlangt ist <Formel tex={bruch(pp.verlangt)} nach="." />{' '}
              {pp.liegtIn ? <strong>Alle drei Gleichungen sind erfüllt: X liegt in E.</strong> : <strong>Die dritte Gleichung ist nicht erfüllt: X liegt nicht in E.</strong>}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Gleichungslabor ---------- */

/** Zweite Gleichung E′: Stützpunkt p + a · u + b · v (die 3. Koordinate um d verschoben), Spannvektoren k₁ · u + k₂ · v und k₃ · u + k₄ · v. */
export function zweiteGleichung(e: Ebene, a: number, b: number, k: number[], d: number): Ebene {
  const lk = (c1: number, c2: number) => summe(vielfaches(c1, e.u), vielfaches(c2, e.v));
  const p = ebenenpunkt(e, a, b);
  return { p: [p[0]!, p[1]!, p[2]! + d], u: lk(k[0]!, k[1]!), v: lk(k[2]!, k[3]!) };
}

/** Warum E′ dieselbe Ebene wie E beschreibt oder warum nicht. */
export function urteilGleichung(e: Ebene, f: Ebene): { gleich: boolean; text: string } {
  if (gleicheEbene(e, f)) return { gleich: true, text: 'Der Stützpunkt von E′ liegt in E, und die Spannvektoren von E′ liegen in E und sind keine Vielfachen voneinander: E′ beschreibt dieselbe Ebene wie E.' };
  if (!istEbene(f)) return { gleich: false, text: 'Die Spannvektoren von E′ sind Vielfache voneinander (oder einer ist der Nullvektor): E′ beschreibt keine Ebene, sondern nur eine Gerade oder einen Punkt.' };
  if (!liegtInEbene(e, f.p)) return { gleich: false, text: 'Der Stützpunkt von E′ liegt nicht in E: E′ ist eine andere Ebene.' };
  return { gleich: false, text: 'Mindestens ein Spannvektor von E′ liegt nicht in E: E′ ist eine andere Ebene, sie neigt sich anders.' };
}

/** Gleichungslabor (nur im Raum): E ist fest, E′ wird aus E abgeleitet. Das Urteil lässt sich einblenden. */
export function Gleichungslabor() {
  const e = GLEICHUNG.e;
  const [a, setA] = useState(GLEICHUNG_START.a);
  const [b, setB] = useState(GLEICHUNG_START.b);
  const [k, setK] = useState<number[]>(GLEICHUNG_START.k);
  const [d, setD] = useState(GLEICHUNG_START.d);
  const [urteil, setUrteil] = useState(false);
  const f = zweiteGleichung(e, a, b, k, d);
  const { spec, aussen } = gleichungBild(e, f);
  const u = urteilGleichung(e, f);
  const regler = (name: string, tex: string, wert: number, min: number, max: number, set: (w: number) => void) => (
    <Regler name={name} beschriftung={<Formel tex={tex} />} wert={wert} min={min} max={max} step={1} onChange={set} anzeige={<Formel tex={String(wert)} />} />
  );
  const gk = GLEICHUNG_GRENZE.k;
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: GRAU }} aria-hidden="true" /> die Ebene <Formel tex="E" /> (grau) mit <Formel tex={t`\vec{u}`} /> (blau) und <Formel tex={t`\vec{v}`} /> (rosa) in <Formel tex="P" /></li>
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> orange berandet: die Ebene <Formel tex={t`E'`} /> mit den Spannvektoren <Formel tex={t`\vec{u}'`} /> (schwarz) und <Formel tex={t`\vec{v}'`} /> (orange) in <Formel tex={t`P'`} /></li>
      </ul>
      {aussen && <p className="klein">Der Stützpunkt P′ liegt außerhalb des gezeichneten Koordinatensystems und ist nicht eingezeichnet.</p>}
      <p className="klein">
        Die feste Ebene <Formel tex={gleichungE(e)} nach="." /> Für <Formel tex={t`E'`} /> gilt <Formel tex={t`\vec{p}'=\vec{p}+a\cdot\vec{u}+b\cdot\vec{v}`} nach="," /> in der 3. Koordinate um <Formel tex="d" /> verschoben, <Formel tex={t`\vec{u}'=k_1\cdot\vec{u}+k_2\cdot\vec{v}`} /> und <Formel tex={t`\vec{v}'=k_3\cdot\vec{u}+k_4\cdot\vec{v}`} nach="." />
      </p>
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          {regler('Anteil a von u im Stützpunkt', 'a', a, -GLEICHUNG_GRENZE.a, GLEICHUNG_GRENZE.a, setA)}
          {regler('Anteil b von v im Stützpunkt', 'b', b, -GLEICHUNG_GRENZE.a, GLEICHUNG_GRENZE.a, setB)}
          {regler('Verschiebung d des Stützpunkts', 'd', d, -GLEICHUNG_GRENZE.d, GLEICHUNG_GRENZE.d, setD)}
        </div>
        <div className="regler-gruppe">
          {k.map((w, i) => regler(`Faktor k${i + 1} der Spannvektoren`, `k_${i + 1}`, w, -gk, gk, (n) => setK(k.map((y, j) => (j === i ? n : y)))))}
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={urteil} onChange={(ev) => setUrteil(ev.target.checked)} /> Urteil zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Umbruchformel tex={gleichungE(f, "E'", 'r', 's')} schmal={gleichungESchmal(f, "E'", 'r', 's')} />
        {urteil && <p>{u.text}</p>}
      </div>
    </div>
  );
}
