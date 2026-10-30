import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { ORANGE, SCHWARZ } from '@/components/Messbild';
import { Regler } from '@/components/Regler';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { t } from '@/lib/modulhilfen';
import { punktTeX, spaltenTeX, zielpunkt } from '@/lib/vektor';
import { achsenLinien, labelMitte, lageFuerPunkt, type Linie, type Punkt2 } from '@/lib/vektorbild';
import { PFEIL_BEREICH, PFEIL_GRENZE, PFEIL_STARTS, PFEIL_START_VEKTOR } from './daten';

const stil = { highlight: false, fixed: true };

/** Linien, auf denen die Beschriftungen nicht stehen dürfen: Achsen und alle drei Pfeile. */
const linien = (v: number[]): Linie[] => [...achsenLinien(PFEIL_BEREICH), ...PFEIL_STARTS.map((s): Linie => ({ von: s.p, bis: zielpunkt(s.p, v) as Punkt2 }))];

/**
 * Labor zur Pfeilklasse: Der Vektor wird mit zwei Reglern eingestellt. Von drei festen Ausgangspunkten führt jeweils ein Pfeil mit diesem Vektor zum Zielpunkt.
 * So lässt sich sehen, was alle Pfeile eines Vektors gemeinsam haben. Die Rechnung für die Zielpunkte lässt sich auf Wunsch einblenden.
 */
export function Pfeillabor() {
  const [v, setV] = useState<number[]>(PFEIL_START_VEKTOR);
  const [rechnung, setRechnung] = useState(false);
  const ziele = PFEIL_STARTS.map((s) => zielpunkt(s.p, v) as Punkt2);
  const beschreibung = `Koordinatensystem mit drei orangen Pfeilen, die alle zum Vektor mit den Koordinaten ${v[0]} und ${v[1]} gehören. Sie beginnen in S1 bei ${PFEIL_STARTS[0]!.p.join(' und ')}, S2 bei ${PFEIL_STARTS[1]!.p.join(' und ')} und S3 bei ${PFEIL_STARTS[2]!.p.join(' und ')}. Die Zielpunkte sind Z1 bei ${ziele[0]!.join(' und ')}, Z2 bei ${ziele[1]!.join(' und ')} und Z3 bei ${ziele[2]!.join(' und ')}.`.replace(/-(\d)/g, 'minus $1');

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={PFEIL_BEREICH}
        xTeilung={1}
        yTeilung={1}
        xBeschriftung="zahl"
        className="brett-quadrat"
        xTitel="x"
        yTitel="y"
        beschreibung={beschreibung}
        zustand={v}
        aufbau={(b, lies) => {
          const [xmin, xmax, ymin, ymax] = PFEIL_BEREICH;
          PFEIL_STARTS.forEach((s) => {
            b.create('segment', [[s.p[0], s.p[1]], [() => s.p[0] + lies()[0]!, () => s.p[1] + lies()[1]!]], { ...stil, strokeColor: ORANGE, strokeWidth: 2.5, lastArrow: { type: 2, size: 6 } });
            b.create('point', [s.p[0], s.p[1]], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: SCHWARZ, fillColor: SCHWARZ });
            b.create('point', [() => s.p[0] + lies()[0]!, () => s.p[1] + lies()[1]!], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: SCHWARZ, fillColor: SCHWARZ });
          });
          // Beschriftungen auf freien Seiten, rechnerisch gewählt (nie auf einem Pfeil oder einer Achse, nicht aufeinander)
          const lagen = (vv: number[]) => {
            const o = { bereich: PFEIL_BEREICH, teilung: 1, linien: linien(vv), belegt: [] as [number, number][] };
            const alle: { name: string; p: Punkt2 }[] = [
              ...PFEIL_STARTS.map((s) => ({ name: s.name, p: s.p })),
              ...PFEIL_STARTS.map((s, i) => ({ name: `Z${i + 1}`, p: [s.p[0] + vv[0]!, s.p[1] + vv[1]!] as Punkt2 })),
            ];
            return alle.map((a) => {
              const l = lageFuerPunkt(a.p, o);
              const m = labelMitte(l, a.p, PFEIL_BEREICH);
              o.belegt.push(m);
              return { ...a, m };
            });
          };
          ['S1', 'S2', 'S3', 'Z1', 'Z2', 'Z3'].forEach((name, i) =>
            b.create('text', [() => xmin + lagen(lies())[i]!.m[0] * (xmax - xmin), () => ymin + lagen(lies())[i]!.m[1] * (ymax - ymin), name.length === 2 ? `${name[0]}${name[1]}` : name], { ...stil, strokeColor: SCHWARZ, anchorX: 'middle', anchorY: 'middle', fontSize: 14, cssClass: 'bild-text', highlightCssClass: 'bild-text' }),
          );
        }}
      />
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> Pfeile des Vektors <Formel tex={t`\vec{a}`} /> von <Formel tex="S_1" nach="," /> <Formel tex="S_2" /> und <Formel tex="S_3" /> aus</li>
      </ul>

      <div className="labor-bedienung">
        <div className="regler-gruppe">
          <Regler name="x-Koordinate des Vektors" beschriftung="x-Koordinate" wert={v[0]!} min={-PFEIL_GRENZE} max={PFEIL_GRENZE} step={1} onChange={(x) => setV([x, v[1]!])} anzeige={<Formel tex={String(v[0])} />} />
          <Regler name="y-Koordinate des Vektors" beschriftung="y-Koordinate" wert={v[1]!} min={-PFEIL_GRENZE} max={PFEIL_GRENZE} step={1} onChange={(y) => setV([v[0]!, y])} anzeige={<Formel tex={String(v[1])} />} />
        </div>
        <fieldset className="schalter-gruppe">
          <legend className="nur-lesegeraet">Anzeige</legend>
          <label className="schalter"><input type="checkbox" checked={rechnung} onChange={(e) => setRechnung(e.target.checked)} /> Zielpunkte berechnen</label>
        </fieldset>
      </div>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={t`\vec{a}=${spaltenTeX(v)}`} />
        <ul className="liste-ohne-zahl">
          {PFEIL_STARTS.map((s, i) => (
            <li key={s.name}>
              <Formel tex={`${punktTeX(`S_${i + 1}`, s.p)}`} /> führt zu <Formel tex={`${punktTeX(`Z_${i + 1}`, ziele[i]!)}`} nach="." />
              {rechnung && (
                <Formel anzeige tex={t`Z_${i + 1}=(${s.p[0]}+${v[0]! < 0 ? `(${v[0]})` : v[0]}\,|\,${s.p[1]}+${v[1]! < 0 ? `(${v[1]})` : v[1]})`} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
