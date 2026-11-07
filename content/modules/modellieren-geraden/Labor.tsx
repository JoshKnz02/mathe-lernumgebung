import { useState } from 'react';
import { koordinatenRegler } from '@/components/Dimensionswahl';
import { Formel } from '@/components/Formel';
import { Raumbild } from '@/components/Raumbild';
import { Regler } from '@/components/Regler';
import { Umbruchformel } from '@/components/Umbruchformel';
import { abstandZurZeit, begegnung, kleinsterAbstand, minutenSekunden, ort, type Bewegung } from '@/lib/bewegung';
import { spalte } from '@/lib/laborhilfen';
import { t as tex, zt } from '@/lib/modulhilfen';
import { HAUS_NAMEN, bewegungsLaborBild, schattenLaborBild } from './Bilder';
import { BEWEGUNGSLABOR, ORANGE, ROSA, SCHATTENLABOR, SCHWARZ, WAND, X2_MIN } from './daten';

const wert = (x: number) => zt(Math.round(x * 100) / 100);
const wert3 = (x: number) => zt(Math.round(x * 1000) / 1000);

/** Kurve des Abstands d(t) der beiden Hubschrauber über t (in Minuten) mit der aktuellen Zeit (rosa) und dem kleinsten Abstand (orange). */
export function Abstandskurve({ r, tMin, zeigeMinimum }: { r: Bewegung; tMin: number; zeigeMinimum: boolean }) {
  const { H, tMaxMin } = BEWEGUNGSLABOR;
  const B = 320;
  const Hh = 160;
  const R = { l: 34, r: 14, o: 12, u: 26 };
  const zeiten = Array.from({ length: 81 }, (_, i) => (tMaxMin * i) / 80);
  const d = (m: number) => abstandZurZeit(H, r, m / 60);
  const ymax = Math.max(1, ...zeiten.map(d)) * 1.08;
  const px = (x: number) => R.l + (x / tMaxMin) * (B - R.l - R.r);
  const py = (y: number) => Hh - R.u - (y / ymax) * (Hh - R.u - R.o);
  const k = kleinsterAbstand(H, r);
  const kMin = k.t * 60;
  const zeigeK = zeigeMinimum && kMin <= tMaxMin;
  const beschr = `Kurve des Abstands d der beiden Hubschrauber für t von 0 bis ${tMaxMin} Minuten. Zur aktuellen Zeit ${wert(tMin)} Minuten ist der Abstand ${wert(d(tMin))} Kilometer.${zeigeMinimum ? ` Der kleinste Abstand für t ab 0 ist ${wert(k.d)} Kilometer bei ${wert(kMin)} Minuten.` : ''}`;
  return (
    <figure className="bild kurve-klein">
      <svg viewBox={`0 0 ${B} ${Hh}`} role="img" aria-label={beschr} style={{ width: '100%', height: 'auto', maxWidth: 420 }}>
        <line x1={R.l} y1={Hh - R.u} x2={B - R.r + 6} y2={Hh - R.u} stroke="#555" strokeWidth="1.2" />
        <line x1={R.l} y1={Hh - R.u} x2={R.l} y2={R.o - 4} stroke="#555" strokeWidth="1.2" />
        {[0, 1, 2, 3, 4].map((m) => (
          <g key={m}>
            <line x1={px(m)} y1={Hh - R.u} x2={px(m)} y2={Hh - R.u + 4} stroke="#555" />
            <text x={px(m)} y={Hh - R.u + 16} textAnchor="middle" fontSize="11" fill="#333">{m}</text>
          </g>
        ))}
        <text x={B - R.r + 8} y={Hh - R.u - 6} textAnchor="end" fontSize="12" fill="#333">t in min</text>
        <text x={R.l + 4} y={R.o + 4} fontSize="12" fill="#333">d in km</text>
        <polyline fill="none" stroke={SCHWARZ} strokeWidth="2" points={zeiten.map((m) => `${px(m).toFixed(1)},${py(d(m)).toFixed(1)}`).join(' ')} />
        <circle cx={px(tMin)} cy={py(d(tMin))} r="4" fill={ROSA} />
        {zeigeK && <circle cx={px(kMin)} cy={py(k.d)} r="4" fill={ORANGE} />}
      </svg>
      <figcaption>Der Abstand <Formel tex="d(t)" /> der beiden Hubschrauber in Abhängigkeit von <Formel tex="t" nach=":" /> die aktuelle Zeit rosa{zeigeMinimum ? ', der kleinste Abstand orange' : ''}.</figcaption>
    </figure>
  );
}

/** Bewegungslabor (nur im Raum): Das Tempo von R und die Zeit lassen sich einstellen. Abstand, Abstandskurve und Schnittpunkt mit den Ankunftszeiten blendet man ein. */
export function Bewegungslabor() {
  const L = BEWEGUNGSLABOR;
  const [tempo, setTempo] = useState(L.tempoStart);
  const [tMin, setTMin] = useState(L.tStartMin);
  const [abstand, setAbstand] = useState(false);
  const [kurve, setKurve] = useState(false);
  const [schnitt, setSchnitt] = useState(false);
  const r: Bewegung = { ...L.R, tempo };
  const t = tMin / 60;
  const d = abstandZurZeit(L.H, r, t);
  const be = begegnung(L.H, r);
  const { spec, ausserhalb } = bewegungsLaborBild(tempo, tMin, abstand, schnitt);
  const ms = (h: number) => {
    const m = minutenSekunden(h);
    return `${m.minuten}\\,\\text{min}\\ ${wert(m.sekunden)}\\,\\text{s}`;
  };
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> die Bahn <Formel tex="g" /> von <Formel tex="H" /></li>
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> die Bahn <Formel tex="h" /> von <Formel tex="R" /></li>
        {abstand && <li><span className="legende-farbe" style={{ background: ROSA }} aria-hidden="true" /> der Abstand von <Formel tex="H" /> und <Formel tex="R" /></li>}
      </ul>
      <p className="klein">Koordinatenebenen (durchsichtig): <Formel tex="x_1x_2" /> hellblau, <Formel tex="x_1x_3" /> grün, <Formel tex="x_2x_3" /> gelborange. Eine Längeneinheit ist ein Kilometer.</p>
      {ausserhalb.length > 0 && <p className="klein">Der Punkt {ausserhalb.join(' und ')} liegt außerhalb des gezeichneten Koordinatensystems (eine Koordinate ist größer als 4 oder kleiner als −4). Er ist nicht eingezeichnet, die Rechnung gilt trotzdem.</p>}
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler name="Tempo von R in Kilometern je Stunde" beschriftung={<Formel tex="w_R" />} wert={tempo} min={L.tempoMin} max={L.tempoMax} step={L.tempoSchritt} onChange={setTempo} anzeige={<Formel tex={tex`${tempo}\,\frac{\text{km}}{\text{h}}`} />} />
          <Regler name="Zeit t in Minuten" beschriftung={<Formel tex="t" />} wert={tMin} min={0} max={L.tMaxMin} step={0.1} onChange={setTMin} anzeige={<Formel tex={tex`${zt(tMin)}\,\text{min}`} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={abstand} onChange={(e) => setAbstand(e.target.checked)} /> Abstand zeigen</label>
          <label className="schalter"><input type="checkbox" checked={kurve} onChange={(e) => setKurve(e.target.checked)} /> Abstandskurve zeigen</label>
          <label className="schalter"><input type="checkbox" checked={schnitt} onChange={(e) => setSchnitt(e.target.checked)} /> Schnittpunkt und Zeiten</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        <p className="klein">Hubschrauber <Formel tex="H" /> hat das Tempo <Formel tex={tex`60\,\frac{\text{km}}{\text{h}}`} nach="," /> der Rettungshubschrauber <Formel tex="R" /> das Tempo <Formel tex={tex`w_R=${tempo}\,\frac{\text{km}}{\text{h}}`} nach="." /></p>
        {abstand && (
          <p className="klein">
            Abstand zur Zeit <Formel tex={tex`t=${zt(tMin)}\,\text{min}`} nach=":" /> <Formel tex={tex`d\approx ${wert(d)}\,\text{km}`} nach="." />
            {be.kollision && Math.abs(tMin / 60 - be.kollision.t) < 1e-9 && ' H und R sind am selben Ort: Kollision.'}
          </p>
        )}
        {schnitt && (
          <>
            <p className="klein">
              Die Bahnen schneiden sich im Punkt <Formel tex={tex`S\left(${BEWEGUNGSLABOR.S.join('\\,|\\,')}\right)`} nach="." /> <Formel tex="H" /> erreicht <Formel tex="S" /> nach <Formel tex={ms(be.zeiten!.t1)} nach="," /> <Formel tex="R" /> nach <Formel tex={ms(be.zeiten!.t2)} nach="." />
              {be.kollision ? ' Beide erreichen S zur selben Zeit: Kollision.' : ' Die Zeiten sind verschieden: keine Kollision.'}
            </p>
            <Umbruchformel tex={tex`\vec{v}_H=${spalte(ort(L.H, 1).map((c, i) => c - L.H.start[i]!))}`} schmal={tex`\begin{gathered}\vec{v}_H=${spalte(ort(L.H, 1).map((c, i) => c - L.H.start[i]!))}\end{gathered}`} />
          </>
        )}
        {kurve && <Abstandskurve r={r} tMin={tMin} zeigeMinimum={abstand} />}
      </div>
    </div>
  );
}

/** Schattenlabor (nur im Raum): Haus vor der Wand x₂ = −6. Lichtart, Richtung bzw. Lampe, Strahlen, Schatten und Schattenpunkte (Zahlen) lassen sich zuschalten. */
export function Schattenlabor() {
  const [art, setArt] = useState<'parallel' | 'zentral'>('parallel');
  const [v, setV] = useState<number[]>(SCHATTENLABOR.startV);
  const [J, setJ] = useState<number[]>(SCHATTENLABOR.startJ);
  const [strahlen, setStrahlen] = useState(false);
  const [schatten, setSchatten] = useState(false);
  const [zahlen, setZahlen] = useState(false);
  const { spec, ausserhalb, keinSchatten, ziele } = schattenLaborBild(art, v, J, strahlen, schatten);
  const reglerV = [
    { name: 'v1', tex: 'v_1', i: 0, min: -2, max: 2 },
    { name: 'v2', tex: 'v_2', i: 1, min: -4, max: 1 },
    { name: 'v3', tex: 'v_3', i: 2, min: -2, max: 0 },
  ];
  const reglerJ = [
    { tex: 'J_1', i: 0, min: -3, max: 3 },
    { tex: 'J_2', i: 1, min: 0, max: 4 },
    { tex: 'J_3', i: 2, min: 3, max: 4 },
  ];
  const strich = art === 'parallel' ? "'" : "''";
  return (
    <div className="labor">
      <Raumbild spec={spec} />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: SCHWARZ }} aria-hidden="true" /> das Haus (Gegenstand), Traufecke <Formel tex="E" /> und Dachspitze <Formel tex="I" /></li>
        {strahlen && <li><span className="legende-farbe" style={{ background: '#E69F00' }} aria-hidden="true" /> die Lichtstrahlen (gestrichelt)</li>}
        {schatten && <li><span className="legende-farbe" style={{ background: '#4B5563' }} aria-hidden="true" /> der Schatten auf der Wand und auf dem Boden</li>}
      </ul>
      <p className="klein">Die Wand ist die Ebene <Formel tex={tex`x_2=${WAND}`} /> (grün), der Boden die <Formel tex="x_1x_2" />-Ebene (hellblau, <Formel tex="x_3=0" nach=")." /> Die <Formel tex="x_2" />-Achse reicht bis <Formel tex={tex`${X2_MIN}`} nach="." /></p>
      {ausserhalb.includes('Schatten') && <p className="klein">Der Schatten wird nicht gezeichnet: Mindestens ein Strahl erreicht die Wand nicht, oder der Schatten liegt außerhalb des gezeichneten Bereichs. Die Rechnung gilt trotzdem.</p>}
      {keinSchatten.length > 0 && (schatten || strahlen || zahlen) && <p className="klein">Für {keinSchatten.join(', ')} gibt es keinen Schatten auf der Wand oder dem Boden: {art === 'parallel' ? 'Der Lichtstrahl läuft parallel zu beiden Flächen oder von ihnen weg.' : 'Weder Wand noch Boden liegen hinter dem Punkt, von der Lampe aus gesehen.'}</p>}
      <div className="darstellungswahl" role="group" aria-label="Lichtart wählen">
        <span className="darstellungswahl-name">Licht:</span>
        <button type="button" className="chip" aria-pressed={art === 'parallel'} aria-label="Paralleles Licht, zum Beispiel Sonnenlicht" onClick={() => setArt('parallel')}>Parallel</button>
        <button type="button" className="chip" aria-pressed={art === 'zentral'} aria-label="Punktförmige Lichtquelle" onClick={() => setArt('zentral')}>Punktförmig</button>
      </div>
      <div className="labor-bedienung">
        <div className="regler-gruppe">
          {art === 'parallel'
            ? reglerV.map((r) => (
                <Regler key={r.name} name={`${r.i + 1}. Koordinate der Lichtrichtung v`} beschriftung={<Formel tex={r.tex} />} wert={v[r.i]!} min={r.min} max={r.max} step={1} onChange={(w) => setV(v.map((y, j) => (j === r.i ? w : y)))} anzeige={<Formel tex={String(v[r.i])} />} />
              ))
            : reglerJ.map((r) => (
                <Regler key={r.tex} name={`${r.i + 1}. Koordinate der Lampe J`} beschriftung={<Formel tex={r.tex} />} wert={J[r.i]!} min={r.min} max={r.max} step={1} onChange={(w) => setJ(J.map((y, j) => (j === r.i ? w : y)))} anzeige={<Formel tex={String(J[r.i])} />} />
              ))}
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={strahlen} onChange={(e) => setStrahlen(e.target.checked)} /> Lichtstrahlen zeigen</label>
          <label className="schalter"><input type="checkbox" checked={schatten} onChange={(e) => setSchatten(e.target.checked)} /> Schatten zeigen</label>
          <label className="schalter"><input type="checkbox" checked={zahlen} onChange={(e) => setZahlen(e.target.checked)} /> Schattenpunkte berechnen</label>
        </fieldset>
      </div>
      <div className="labor-gleichung" aria-live="polite">
        {art === 'parallel' ? (
          <Umbruchformel tex={tex`\vec{v}=${spalte(v)}`} schmal={tex`\begin{gathered}\vec{v}=${spalte(v)}\end{gathered}`} />
        ) : (
          <Umbruchformel tex={tex`J(${J.map(zt).join('\\,|\\,')})`} schmal={tex`\begin{gathered}J(${J.map(zt).join('\\,|\\,')})\end{gathered}`} />
        )}
        {zahlen && (
          <ul className="liste-ohne-zahl" aria-label="Schattenpunkte">
            {ziele.map((x, i) => (
              <li key={HAUS_NAMEN[i]}>
                {x ? (
                  <>
                    <Formel tex={tex`${HAUS_NAMEN[i]}${strich}\approx\left(${wert(x.punkt[0]!)}\,|\,${wert(x.punkt[1]!)}\,|\,${wert(x.punkt[2]!)}\right)`} nach="," /> <Formel tex={tex`${art === 'parallel' ? 't' : 's'}\approx ${wert3(x.parameter)}`} nach="." /> {x.flaeche === 'Wand' ? 'Der Strahl trifft die Wand.' : 'Der Strahl trifft vorher den Boden.'}
                  </>
                ) : (
                  <>
                    <Formel tex={HAUS_NAMEN[i]!} /> hat keinen Schatten auf der Wand oder dem Boden.
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        {zahlen && art === 'zentral' && <p className="klein">Der Wert <Formel tex="s" /> ist der Parameter des Strahls <Formel tex={tex`J+s\cdot\overrightarrow{JX}`} nach="." /></p>}
      </div>
    </div>
  );
}
