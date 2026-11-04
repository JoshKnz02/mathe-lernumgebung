import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { Umbruchformel } from '@/components/Umbruchformel';
import { geradenpunkt, gleicheGerade, imWuerfel, koordinatenParameter, kuerzeImWuerfel, liegtAuf, type Gerade } from '@/lib/gerade';
import { klammer, spalte, wortKoordinaten, wortZahl } from '@/lib/laborhilfen';
import { t, zt } from '@/lib/modulhilfen';
import type { Punkt3, RaumBildSpec, RaumLinie, RaumPunkt } from '@/lib/schraegbild';
import { kollinear, summe, vielfaches, type Vek } from '@/lib/vektor';
import { geradeLinie, O } from './Bilder';
import { BLAU, GLEICHUNG, GLEICHUNG_GRENZE, GLEICHUNG_START, ORANGE, PARAMETER, PARAMETER_GRENZE, PUNKTPROBE, PUNKTPROBE_START, ROSA, SCHWARZ } from './daten';

const gleichOrt = (a: Vek, b: Vek) => a.every((x, i) => x === b[i]);
const nullvektor = (v: Vek) => v.every((x) => x === 0);
const rund = (x: number) => Math.round(x * 10000) / 10000;

/* ---------- Parameterlabor ---------- */

/**
 * Bild des Parameterlabors: der Stützpunkt P mit dem Stützvektor (orange), der Richtungsvektor in P (blau, breiter darunter), der Punkt X zum Parameter t
 * mit dem Pfeil t · u in P (rosa). Liegt X außerhalb des Koordinatensystems (über 4), wird er nicht gezeichnet. Auf Wunsch die Gerade (schwarz gestrichelt).
 */
export function parameterBild(p: Vek, u: Vek, par: number, zeigeGerade: boolean): { spec: RaumBildSpec; aussen: boolean; keinX: boolean } {
  const P = p as Punkt3;
  const kein = nullvektor(u);
  const X = geradenpunkt({ p, u }, par);
  const gleichP = gleichOrt(X, p);
  const aussen = !kein && !gleichP && !imWuerfel(X);
  const punkte: RaumPunkt[] = [];
  const linien: RaumLinie[] = [];
  if (zeigeGerade && !kein) linien.push(...geradeLinie({ p, u }));
  if (!kein) {
    const spitze = kuerzeImWuerfel(p, summe(p, u));
    linien.push({ von: P, bis: spitze.ende, farbe: BLAU, breite: 4.5, pfeil: true });
  }
  if (!nullvektor(p)) linien.push({ von: O, bis: P, farbe: ORANGE, pfeil: true });
  else punkte.push({ name: 'O', p: O, ohneText: true });
  punkte.push({ name: 'P', p: P });
  const zeigeX = !kein && !gleichP && !aussen;
  if (zeigeX) {
    punkte.push({ name: 'X', p: X as Punkt3 });
    linien.push({ von: P, bis: X as Punkt3, farbe: ROSA, pfeil: true });
  }
  const sprech = `Schrägbild. Der Stützpunkt P liegt bei ${wortKoordinaten(p)}, der orange Pfeil vom Ursprung zu P ist der Stützvektor. ${
    kein
      ? 'Der Richtungsvektor ist der Nullvektor, damit gibt es keine Gerade.'
      : `Der blaue Pfeil in P ist der Richtungsvektor.${zeigeGerade ? ' Die schwarz gestrichelte Gerade verläuft durch P in dieser Richtung.' : ''} ${
          gleichP ? 'Für t gleich 0 ist X der Stützpunkt P.' : aussen ? `Der Punkt X zum Parameter t gleich ${wortZahl(par)} liegt außerhalb des gezeichneten Koordinatensystems.` : `Der Punkt X zum Parameter t gleich ${wortZahl(par)} liegt bei ${wortKoordinaten(X)}, der rosa Pfeil in P führt zu ihm.`
        }`
  }`;
  return { spec: { sprech, punkte, linien }, aussen, keinX: !zeigeX };
}

/** Parameterlabor (nur im Raum): p, u und der Parameter t werden eingestellt. Gerade und Rechnung lassen sich einblenden. */
export function Parameterlabor() {
  const [p, setP] = useState<number[]>(PARAMETER.g.p);
  const [u, setU] = useState<number[]>(PARAMETER.g.u);
  const [par, setPar] = useState(1);
  const [gerade, setGerade] = useState(false);
  const [rechnung, setRechnung] = useState(false);
  const { spec, aussen } = parameterBild(p, u, par, gerade);
  const X = geradenpunkt({ p, u }, par);
  const kein = nullvektor(u);
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Stützvektor <Formel tex={t`\vec{p}`} /> vom Ursprung zum Stützpunkt <Formel tex="P" /></li>
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> Richtungsvektor <Formel tex={t`\vec{u}`} /> in <Formel tex="P" /> (breiter darunter gezeichnet)</li>
        <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> Pfeil <Formel tex={t`t\cdot\vec{u}`} /> in <Formel tex="P" /> zum Punkt <Formel tex="X" /></li>
        {gerade && <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> die Gerade <Formel tex="g" /> (gestrichelt)</li>}
      </ul>
      {aussen && <p className="klein">Der Punkt X liegt außerhalb des gezeichneten Koordinatensystems (eine Koordinate ist größer als 4 oder kleiner als −4). Er ist nicht eingezeichnet, die Rechnung gilt trotzdem.</p>}
      {kein && <p className="klein">Der Richtungsvektor darf nicht der Nullvektor sein. Mit ihm gibt es keine Gerade, nur den Punkt P.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('p', 'p', p, PARAMETER_GRENZE.p, setP)}</div>
        <div className="regler-gruppe">{koordinatenRegler('u', 'u', u, PARAMETER_GRENZE.u, setU)}</div>
        <div className="regler-gruppe">
          <Regler name="Parameter t" beschriftung={<Formel tex="t" />} wert={par} min={-PARAMETER_GRENZE.t} max={PARAMETER_GRENZE.t} step={0.5} onChange={setPar} anzeige={<Formel tex={zt(par)} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={gerade} onChange={(e) => setGerade(e.target.checked)} /> Gerade g einzeichnen</label>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Rechnung zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\vec{p}=${spalte(p)},\quad \vec{u}=${spalte(u)}`} />
        {rechnung && !kein && (
          <Umbruchformel
            tex={t`\vec{x}=\vec{p}+t\cdot\vec{u}=${spalte(p)}+${klammer(par)}\cdot${spalte(u)}=${spalte(X)}`}
            schmal={t`\begin{gathered}\vec{x}=${spalte(p)}\\{}+${klammer(par)}\cdot${spalte(u)}\\{}=${spalte(X)}\end{gathered}`}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Punktprobelabor ---------- */

/** Bild des Punktprobelabors: die feste Gerade g mit dem Stützpunkt P und der eingestellte Punkt X. */
export function punktprobeBild(x: Vek): RaumBildSpec {
  const g = PUNKTPROBE.g;
  const gleichP = gleichOrt(x, g.p);
  const punkte: RaumPunkt[] = [{ name: 'P', p: PUNKTPROBE.P }];
  if (!gleichP) punkte.push({ name: 'X', p: x as Punkt3 });
  return {
    sprech: `Schrägbild. Die schwarz gestrichelte Gerade g verläuft durch den Stützpunkt P bei ${wortKoordinaten(g.p)}. ${gleichP ? 'Der eingestellte Punkt X ist der Stützpunkt P.' : `Der eingestellte Punkt X liegt bei ${wortKoordinaten(x)}.`}`,
    punkte,
    linien: [...geradeLinie(g)],
  };
}

/** Punktprobelabor (nur im Raum): Ein Punkt X wird eingestellt. Die Punktprobe (drei Gleichungen) lässt sich einblenden. */
export function Punktprobelabor() {
  const g = PUNKTPROBE.g;
  const [x, setX] = useState<number[]>(PUNKTPROBE_START);
  const [probe, setProbe] = useState(false);
  const par = koordinatenParameter(g, x);
  const auf = liegtAuf(g, x);
  const ts = par.filter((v): v is number => v !== null);
  return (
    <div className="labor">
      <Raumbild spec={punktprobeBild(x)} />
      <p className="klein">
        Die Gerade <Formel tex={t`g:\ \vec{x}=${spalte(g.p)}+t\cdot${spalte(g.u)}`} nach="." /> Der Stützpunkt ist <Formel tex={t`P(${g.p.map(zt).join('\\,|\\,')})`} nach="." />
      </p>
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('X', 'x', x, 4, setX)}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={probe} onChange={(e) => setProbe(e.target.checked)} /> Punktprobe zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`X(${x.map(zt).join('\\,|\\,')})`} />
        {probe && (
          <>
            {x.map((xi, i) => (
              <Formel
                key={i}
                anzeige
                tex={
                  par[i] === null
                    ? t`x_${i + 1}:\ ${zt(xi)}=${zt(g.p[i]!)}\ ${xi === g.p[i] ? t`\text{(stimmt)}` : t`\text{(stimmt nicht)}`}`
                    : t`x_${i + 1}:\ ${zt(xi)}=${zt(g.p[i]!)}+t\cdot${klammer(g.u[i]!)}\Rightarrow t=${zt(rund(par[i]!))}`
                }
              />
            ))}
            <p className="klein">
              {auf
                ? <>X liegt auf g. Alle Gleichungen liefern denselben Wert <Formel tex={t`t=${zt(rund(ts[0] ?? 0))}`} nach="." /></>
                : <>X liegt nicht auf g. Die Gleichungen verlangen nicht denselben Wert von <Formel tex="t" nach="." /></>}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Gleichungslabor ---------- */

/** Stützpunkt Q und Richtungsvektor v der zweiten Gleichung h: Q = P + a · u + d · (0 | 0 | 1), v = k · u + e · (0 | 0 | 1). */
export function zweiteGleichung(a: number, k: number, d: number, e: number): Gerade {
  const g = GLEICHUNG.g;
  return { p: summe(summe(g.p, vielfaches(a, g.u)), [0, 0, d]), u: summe(vielfaches(k, g.u), [0, 0, e]) };
}

/** Bild des Gleichungslabors: g schwarz gestrichelt, h orange (liegt sie auf g, deckt sie g zu), der Richtungsvektor u von g blau in P, der von h rosa in Q. */
export function gleichungBild(a: number, k: number, d: number, e: number): { spec: RaumBildSpec; h: Gerade; keinH: boolean; gekuerzt: boolean } {
  const g = GLEICHUNG.g;
  const h = zweiteGleichung(a, k, d, e);
  const keinH = nullvektor(h.u);
  const Q = h.p as Punkt3;
  const gleichP = gleichOrt(Q, g.p);
  const punkte: RaumPunkt[] = [{ name: 'P', p: GLEICHUNG.P }];
  if (!gleichP) punkte.push({ name: 'Q', p: Q });
  const linien: RaumLinie[] = [...geradeLinie(g)];
  if (!keinH) linien.push(...geradeLinie(h, ORANGE, 2, false));
  const u = kuerzeImWuerfel(g.p, summe(g.p, g.u));
  linien.push({ von: GLEICHUNG.P, bis: u.ende, farbe: BLAU, breite: 4.5, pfeil: true });
  let gekuerzt = false;
  if (!keinH) {
    const v = kuerzeImWuerfel(h.p, summe(h.p, h.u));
    gekuerzt = v.gekuerzt;
    if (!gleichOrt(v.ende, h.p)) linien.push({ von: Q, bis: v.ende, farbe: ROSA, pfeil: true });
  }
  return {
    h,
    keinH,
    gekuerzt,
    spec: {
      sprech: `Schrägbild. Die schwarz gestrichelte Gerade g verläuft durch den Punkt P bei ${wortKoordinaten(g.p)}, der blaue Pfeil in P ist ihr Richtungsvektor. ${
        keinH ? 'Der Richtungsvektor der zweiten Gleichung ist der Nullvektor, damit gibt es keine zweite Gerade.' : `Die orange Gerade h hat den Stützpunkt Q bei ${wortKoordinaten(h.p)}, der rosa Pfeil in Q ist ihr Richtungsvektor.`
      }`,
      punkte,
      linien,
    },
  };
}

/** Gleichungslabor (nur im Raum): Eine zweite Gleichung h wird eingestellt und mit g verglichen. */
export function Gleichungslabor() {
  const g = GLEICHUNG.g;
  const [a, setA] = useState(GLEICHUNG_START.a);
  const [k, setK] = useState(GLEICHUNG_START.k);
  const [d, setD] = useState(GLEICHUNG_START.d);
  const [e, setE] = useState(GLEICHUNG_START.e);
  const [vergleich, setVergleich] = useState(false);
  const { spec, h, keinH, gekuerzt } = gleichungBild(a, k, d, e);
  const gleich = !keinH && gleicheGerade(g, h);
  const regler = (name: string, tex: string, wert: number, grenze: number, set: (w: number) => void, bez: string) => (
    <Regler name={bez} beschriftung={<Formel tex={tex} />} wert={wert} min={-grenze} max={grenze} step={1} onChange={set} anzeige={<Formel tex={String(wert)} />} />
  );
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> die Gerade <Formel tex="g" /> (gestrichelt) mit dem Richtungsvektor <Formel tex={t`\vec{u}`} /> in <Formel tex="P" /> (blau, breiter darunter)</li>
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> die Gerade <Formel tex="h" /> mit dem Stützpunkt <Formel tex="Q" /></li>
        <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> der Richtungsvektor <Formel tex={t`\vec{v}`} /> von <Formel tex="h" /> in <Formel tex="Q" /></li>
      </ul>
      {gekuerzt && <p className="klein">Der rosa Pfeil ist am Rand des Koordinatensystems abgeschnitten.</p>}
      {keinH && <p className="klein">Der Richtungsvektor von h darf nicht der Nullvektor sein. Mit ihm gibt es keine Gerade.</p>}
      <p className="klein">
        <Formel tex={t`g:\ \vec{x}=${spalte(g.p)}+t\cdot${spalte(g.u)}`} nach="." /> Der Stützpunkt von <Formel tex="h" /> ist <Formel tex={t`Q=P+a\cdot\vec{u}+d\cdot\begin{pmatrix}0\\0\\1\end{pmatrix}`} nach="," /> der Richtungsvektor ist <Formel tex={t`\vec{v}=k\cdot\vec{u}+e\cdot\begin{pmatrix}0\\0\\1\end{pmatrix}`} nach="." />
      </p>
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          {regler('a', 'a', a, GLEICHUNG_GRENZE.a, setA, 'Wert a für den Stützpunkt')}
          {regler('d', 'd', d, GLEICHUNG_GRENZE.d, setD, 'Verschiebung d des Stützpunkts')}
          {regler('k', 'k', k, GLEICHUNG_GRENZE.k, setK, 'Faktor k für den Richtungsvektor')}
          {regler('e', 'e', e, GLEICHUNG_GRENZE.e, setE, 'Veränderung e des Richtungsvektors')}
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={vergleich} onChange={(ev) => setVergleich(ev.target.checked)} /> Vergleich zeigen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        {!keinH && <Formel anzeige tex={t`h:\ \vec{x}=${spalte(h.p)}+s\cdot${spalte(h.u)}`} />}
        {vergleich && !keinH && (
          <>
            <p className="klein">
              Die Richtungsvektoren sind {kollinear(g.u, h.u) ? '' : 'keine '}Vielfachen voneinander. Der Stützpunkt <Formel tex="Q" /> liegt {liegtAuf(g, h.p) ? '' : 'nicht '}auf <Formel tex="g" nach="." />
            </p>
            <p className="klein">
              <strong>{gleich ? 'g und h beschreiben dieselbe Gerade.' : 'g und h sind verschiedene Geraden.'}</strong>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
