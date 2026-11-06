import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Umbruchformel } from '@/components/Umbruchformel';
import { KOORDINATENEBENEN, projektionVektor, schnittwinkel, winkelKoordinatenebene, type Koordinatenebene } from '@/lib/gerade';
import { spalte } from '@/lib/laborhilfen';
import { t as tex, zt } from '@/lib/modulhilfen';
import { betrag, skalarprodukt, winkel } from '@/lib/vektor';
import { ebenenBild, zweiGeradenBild } from './Bilder';
import { ORANGE, PROJLABOR, ROSA, SCHNITTLABOR, SCHWARZ } from './daten';
import { EBENE_TEX, EBENE_TEXT, rund2 } from './rechenhilfen';

const wert = (x: number) => zt(Math.round(x * 100) / 100);
const nullvektor = (v: number[]) => v.every((x) => x === 0);
/** Eine Gerade mit der Richtung (u₁ | u₂ | u₃) hat im Schrägbild die Bildrichtung (u₂ − u₁/2 | u₃ − u₁/2). Ist sie 0, erscheint die Gerade als Punkt. */
const inBlickrichtung = (u: number[]) => Math.abs(u[1]! - u[0]! / 2) < 1e-9 && Math.abs(u[2]! - u[0]! / 2) < 1e-9;

/** Kosinuskurve für Winkel von 0° bis 180° mit dem Punkt für φ (rosa) und dem für den Schnittwinkel α (orange, gleicher Wert mit Betrag). */
export function Kosinuskurve({ phi, alpha }: { phi: number; alpha: number }) {
  const B = 320;
  const H = 170;
  const R = { l: 38, r: 14, o: 14, u: 28 };
  const px = (w: number) => R.l + (w / 180) * (B - R.l - R.r);
  const py = (c: number) => R.o + ((1 - c) / 2) * (H - R.o - R.u);
  const f = (w: number) => Math.cos((w * Math.PI) / 180);
  const punkte = Array.from({ length: 91 }, (_, i) => i * 2);
  const beschr = `Kosinuskurve für Winkel von 0 bis 180 Grad. Der rosa Punkt gehört zum Winkel φ gleich ${wert(phi)} Grad mit dem Kosinus ${wert(f(phi))}, der orange Punkt zum Schnittwinkel α gleich ${wert(alpha)} Grad mit dem Kosinus ${wert(f(alpha))}.`;
  return (
    <figure className="bild kurve-klein">
      <svg viewBox={`0 0 ${B} ${H}`} role="img" aria-label={beschr} style={{ width: '100%', height: 'auto', maxWidth: 420 }}>
        <line x1={R.l} y1={py(0)} x2={B - R.r + 6} y2={py(0)} stroke="#555" strokeWidth="1.2" />
        <line x1={R.l} y1={H - R.u + 4} x2={R.l} y2={R.o - 4} stroke="#555" strokeWidth="1.2" />
        {[0, 45, 90, 135, 180].map((w) => (
          <g key={w}>
            <line x1={px(w)} y1={py(0) - 3} x2={px(w)} y2={py(0) + 3} stroke="#555" />
            <text x={px(w)} y={H - R.u + 16} textAnchor="middle" fontSize="11" fill="#333">{`${w}°`}</text>
          </g>
        ))}
        {[1, -1].map((c) => (
          <g key={c}>
            <line x1={R.l - 3} y1={py(c)} x2={R.l + 3} y2={py(c)} stroke="#555" />
            <text x={R.l - 6} y={py(c) + 4} textAnchor="end" fontSize="11" fill="#333">{c}</text>
          </g>
        ))}
        <polyline fill="none" stroke={SCHWARZ} strokeWidth="2" points={punkte.map((w) => `${px(w).toFixed(1)},${py(f(w)).toFixed(1)}`).join(' ')} />
        <circle cx={px(alpha)} cy={py(f(alpha))} r="4.5" fill={ORANGE} />
        <circle cx={px(phi)} cy={py(f(phi))} r="4.5" fill={ROSA} />
        <text x={B - R.r + 8} y={py(0) - 6} textAnchor="end" fontSize="12" fill="#333">Winkel</text>
        <text x={R.l + 6} y={R.o + 8} fontSize="12" fill="#333">cos</text>
      </svg>
      <figcaption>Kosinus für Winkel von <Formel tex="0^{\circ}" /> bis <Formel tex="180^{\circ}" nach=":" /> der Punkt für <Formel tex="\varphi" /> rosa, der Punkt für <Formel tex="\alpha" /> orange.</figcaption>
    </figure>
  );
}

/** Schnittwinkellabor (nur im Raum): g ist fest, h geht durch den Schnittpunkt S und hat den einstellbaren Richtungsvektor v, der sich umkehren lässt. */
export function Schnittlabor() {
  const [v, setV] = useState<number[]>(SCHNITTLABOR.startV);
  const [um, setUm] = useState(false);
  const [bogen, setBogen] = useState(false);
  const [zahlen, setZahlen] = useState(false);
  const g = SCHNITTLABOR.g;
  const S = SCHNITTLABOR.S;
  const kein = nullvektor(v);
  const veff = kein ? SCHNITTLABOR.startV : um ? v.map((x) => -x + 0) : v;
  const h = { p: S as number[], u: veff };
  const phi = winkel(g.u, veff)!;
  const alpha = schnittwinkel(g.u, veff);
  const parallel = alpha < 1e-6;
  const sk = skalarprodukt(g.u, veff);
  const spec = zweiGeradenBild(g, h, S, bogen);
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> die feste Gerade <Formel tex="g" /></li>
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> die Gerade <Formel tex="h" /> durch <Formel tex="S" /></li>
        {bogen && !parallel && <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> der Schnittwinkel <Formel tex="\alpha" /></li>}
      </ul>
      <p className="klein">Koordinatenebenen (durchsichtig): <Formel tex="x_1x_2" /> hellblau, <Formel tex="x_1x_3" /> grün, <Formel tex="x_2x_3" /> gelborange.</p>
      {kein && <p className="klein">Der Richtungsvektor <Formel tex="\vec{v}" /> darf nicht der Nullvektor sein. Das Bild zeigt die Startwerte.</p>}
      {!kein && (inBlickrichtung(veff) || inBlickrichtung(g.u)) && <p className="klein">Eine Gerade zeigt im Schrägbild genau in Blickrichtung und erscheint als Punkt. Die räumliche Ansicht zeigt sie richtig.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">{koordinatenRegler('v', '\\vec{v}', v, SCHNITTLABOR.grenze, setV, 'Koordinate des Richtungsvektors')}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={um} onChange={(e) => setUm(e.target.checked)} /> Richtung von h umkehren</label>
          <label className="schalter"><input type="checkbox" checked={bogen} onChange={(e) => setBogen(e.target.checked)} /> Schnittwinkel markieren</label>
          <label className="schalter"><input type="checkbox" checked={zahlen} onChange={(e) => setZahlen(e.target.checked)} /> Winkel berechnen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Umbruchformel tex={tex`\vec{u}=${spalte(g.u)},\ \vec{v}=${spalte(veff)}`} schmal={tex`\begin{gathered}\vec{u}=${spalte(g.u)}\\\vec{v}=${spalte(veff)}\end{gathered}`} />
        {parallel && <p className="klein">Die Richtungsvektoren sind Vielfache voneinander. <Formel tex="g" /> und <Formel tex="h" /> gehen beide durch <Formel tex="S" nach="," /> sie sind identisch. Ein Schnittwinkel ist dafür nicht erklärt.</p>}
        {zahlen && !kein && (
          <>
            <p className="klein">
              Skalarprodukt <Formel tex={tex`\vec{u}\cdot\vec{v}=${zt(sk)}`} nach="." /> Winkel zwischen den Vektoren <Formel tex={tex`\varphi\approx ${wert(phi)}^{\circ}`} nach="." />
              {!parallel && <> Schnittwinkel <Formel tex={tex`\alpha\approx ${wert(alpha)}^{\circ}`} nach="." /></>}
            </p>
            <Kosinuskurve phi={phi} alpha={alpha} />
          </>
        )}
      </div>
    </div>
  );
}

/** Projektionslabor (nur im Raum): g geht durch den Punkt S der gewählten Koordinatenebene und hat den einstellbaren Richtungsvektor u. Die Projektion g′ und der Winkel α lassen sich einblenden. */
export function Projektionslabor() {
  const [u, setU] = useState<number[]>(PROJLABOR.startU);
  const [e, setE] = useState<Koordinatenebene>('e12');
  const [bogen, setBogen] = useState(false);
  const [zahlen, setZahlen] = useState(false);
  const kein = nullvektor(u);
  const ue = kein ? PROJLABOR.startU : u;
  const S = PROJLABOR.S[e];
  const pu = projektionVektor(ue, e);
  const { spec, ausserhalb, imEbene, senkrecht } = ebenenBild(S as number[], ue, e, { mitWinkel: bogen, mitLot: bogen });
  const alpha = winkelKoordinatenebene(ue, e);
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> die Gerade <Formel tex="g" /></li>
        {!imEbene && !senkrecht && <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> die Projektion <Formel tex="g'" /> in die Ebene</li>}
        {bogen && !imEbene && <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> das Lot auf die Ebene</li>}
      </ul>
      <p className="klein">Koordinatenebenen (durchsichtig): <Formel tex="x_1x_2" /> hellblau, <Formel tex="x_1x_3" /> grün, <Formel tex="x_2x_3" /> gelborange.</p>
      {kein && <p className="klein">Der Richtungsvektor <Formel tex="\vec{u}" /> darf nicht der Nullvektor sein. Das Bild zeigt die Startwerte.</p>}
      {!kein && inBlickrichtung(ue) && <p className="klein">Die Gerade <Formel tex="g" /> zeigt im Schrägbild genau in Blickrichtung und erscheint als Punkt. Die räumliche Ansicht zeigt sie richtig.</p>}
      {ausserhalb.length > 0 && <p className="klein">Das Lot ist nicht eingezeichnet, weil sein Punkt außerhalb des gezeichneten Koordinatensystems liegt. Die Rechnung gilt trotzdem.</p>}
      <div className="labor-bedienung">
        <div className="darstellungswahl" role="group" aria-label="Koordinatenebene wählen">
          <span className="darstellungswahl-name">Ebene:</span>
          {KOORDINATENEBENEN.map((k) => (
            <button key={k} type="button" className="chip" aria-pressed={e === k} aria-label={`Koordinatenebene ${EBENE_TEXT[k]}`} onClick={() => setE(k)}>
              {EBENE_TEXT[k]}
            </button>
          ))}
        </div>
        <div className="regler-gruppe">{koordinatenRegler('u', '\\vec{u}', u, PROJLABOR.grenze, setU, 'Koordinate des Richtungsvektors')}</div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={bogen} onChange={(e2) => setBogen(e2.target.checked)} /> Winkel markieren</label>
          <label className="schalter"><input type="checkbox" checked={zahlen} onChange={(e2) => setZahlen(e2.target.checked)} /> Winkel berechnen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <Umbruchformel tex={tex`g:\ \vec{p}=${spalte(S as number[])},\ \vec{u}=${spalte(ue)}`} schmal={tex`\begin{gathered}g:\ \vec{p}=${spalte(S as number[])}\\\vec{u}=${spalte(ue)}\end{gathered}`} />
        {zahlen && !kein && (
          <>
            <p className="klein">
              Projektion in die <Formel tex={EBENE_TEX[e]} />-Ebene: <Formel tex={tex`\vec{u}'=${spalte(pu)}`} nach="." />
              {imEbene && ' Die Gerade liegt in der Ebene, der Winkel ist 0°.'}
              {senkrecht && ' Der Projektionsvektor ist der Nullvektor, die Gerade steht senkrecht auf der Ebene.'}
            </p>
            <p className="klein">
              Winkel mit der Ebene <Formel tex={tex`\alpha\approx ${wert(alpha)}^{\circ}`} nach="." /> Länge von <Formel tex={tex`\vec{u}`} nach=":" /> <Formel tex={tex`|\vec{u}|\approx ${rund2(betrag(ue))}`} nach="." /> Länge des Projektionsvektors <Formel tex={tex`|\vec{u}'|\approx ${rund2(betrag(pu))}`} nach="." />
            </p>
          </>
        )}
      </div>
    </div>
  );
}
