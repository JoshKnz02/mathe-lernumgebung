import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { skalarTermTeX } from '@/lib/ebenenhilfen';
import { skalarprodukt } from '@/lib/vektor';
import { RAUM_PARALLEL } from './Bilder';
import { ERKLAEREN, PARALLEL } from './daten';
import { Normalenlabor, Punktlabor } from './Labor';
import { koordinatenformTeX, punktTeX, skalarZeilen, spalte } from './rechenhilfen';

export function Entdecken() {
  const e = ERKLAEREN;
  const P = PARALLEL;
  const wR = skalarprodukt(e.n, P.R);
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Was legen n und d fest?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben ist die Ebene <Formel tex={koordinatenformTeX(e.n, e.d, 'E')} nach="." /> Eine zweite Ebene hat dieselben Koeffizienten, aber auf der rechten Seite die Zahl <Formel tex={t`d=${P.d2}`} nach="." /> Wie liegen die beiden Ebenen zueinander? Was geschieht, wenn du die ganze Gleichung der ersten Ebene mit 2 multiplizierst? Probiere es im Normalenlabor aus.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PARALLEL}
                unter={
                  <>
                    Zwei Ebenen mit demselben Normalenvektor <Formel tex={t`\vec{n}`} /> (schwarz): <Formel tex="E" /> durch <Formel tex="P" /> (grau) und eine zweite Ebene durch <Formel tex="R" /> (oranger Rand). Sie sind gegeneinander verschoben.
                  </>
                }
              />
            }
          >
            <p>
              Die Koeffizienten <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> sind ein Normalenvektor und legen fest, wie die Ebene im Raum geneigt ist. Mit demselben Normalenvektor sind beide Ebenen gleich geneigt. Die Zahl <Formel tex="d" /> verschiebt die Ebene in Richtung des Normalenvektors, die beiden Ebenen liegen nebeneinander und schneiden sich nicht. Zum Beispiel liegt <Formel tex={punktTeX('R', P.R)} /> in der zweiten Ebene, denn <Formel tex={t`${skalarTermTeX(e.n, P.R)}=${wR}`} nach="." />
            </p>
            <p>
              Multiplizierst du die ganze Gleichung mit 2, erhältst du <Formel tex={koordinatenformTeX([4, 4, -2], -10)} nach="." /> Das ist dieselbe Ebene, denn jeder Punkt, der die erste Gleichung erfüllt, erfüllt auch die zweite. Der Normalenvektor <Formel tex={t`${spalte([4, 4, -2])}`} /> ist ein Vielfaches des ersten. Vermutung: Jedes von null verschiedene Vielfache eines Normalenvektors ist wieder ein Normalenvektor der Ebene, und die Koordinatenform ist nur bis auf einen Faktor festgelegt.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Normalenlabor</h3>
      <p>
        Stelle den Normalenvektor <Formel tex={t`\vec{n}`} /> und den Punkt <Formel tex="P" /> ein. Die Ebene durch <Formel tex="P" /> senkrecht zu <Formel tex={t`\vec{n}`} /> und ihre Koordinatenform blendest du ein, wenn du eine Vermutung hast. Ebenen im Raum zeigt das Labor nur im Raum. Über dem Bild wählst du zwischen Schrägbild und räumlicher Ansicht. Ein Normalenvektor, der aus dem gezeichneten Koordinatensystem herausführt, wird gekürzt gezeichnet.
      </p>
      <Normalenlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Verdopple <Formel tex={t`\vec{n}`} /> (zum Beispiel <Formel tex={t`\vec{n}=${spalte([2, 2, 2])}`} nach=")." /> Was geschieht mit der Ebene, was mit der Zahl <Formel tex="d" nach="?" />
          </p>
          <Beobachtung>
            Die Ebene bleibt an derselben Stelle, denn der Normalenvektor zeigt nur länger in dieselbe Richtung. Die Zahl <Formel tex="d" /> verdoppelt sich mit, die Koordinatenform ist ein Vielfaches der vorherigen.
          </Beobachtung>
        </li>
        <li>
          <p>
            Verschiebe <Formel tex="P" /> in der Ebene und dann aus der Ebene heraus. Wie ändert sich <Formel tex="d" nach="?" />
          </p>
          <Beobachtung>
            Verschiebst du <Formel tex="P" /> innerhalb der Ebene, bleibt <Formel tex="d" /> gleich, denn <Formel tex={t`\vec{n}\cdot\vec{p}`} /> hängt nicht davon ab, welchen Punkt der Ebene du nimmst. Verlässt <Formel tex="P" /> die Ebene, entsteht eine andere Ebene mit einem anderen <Formel tex="d" nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Wie funktioniert die Punktprobe in Koordinatenform?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Liegen <Formel tex={punktTeX('Y', e.X)} /> und <Formel tex={punktTeX('Z', [1, 0, 1])} /> in der Ebene <Formel tex={koordinatenformTeX(e.n, e.d, 'E')} nach="?" /> Wie kannst du das prüfen, ohne die Parameter <Formel tex="r" /> und <Formel tex="s" /> zu bestimmen? Stelle die Punkte im Punktprobe-Labor ein.
          </p>
          <Beobachtung>
            <p>
              Ein Punkt liegt in der Ebene, wenn seine Koordinaten die Gleichung erfüllen. Für <Formel tex="Y" nach=":" />
            </p>
            <Umbruchformel tex={skalarZeilen(e.n, e.X).tex} schmal={skalarZeilen(e.n, e.X).schmal} />
            <p>
              Das ist <Formel tex={t`d=${e.d}`} nach="," /> also liegt <Formel tex="Y" /> in <Formel tex="E" nach="." /> Für <Formel tex="Z" nach=":" />
            </p>
            <Umbruchformel tex={skalarZeilen(e.n, [1, 0, 1]).tex} schmal={skalarZeilen(e.n, [1, 0, 1]).schmal} />
            <p>
              Das ist nicht <Formel tex={t`d=${e.d}`} nach="," /> also liegt <Formel tex="Z" /> nicht in <Formel tex="E" nach="." /> Vermutung: Ein Punkt liegt genau dann in der Ebene, wenn das Skalarprodukt <Formel tex={t`\vec{n}\cdot\vec{x}`} /> gleich <Formel tex="d" /> ist. In der Parameterform musstest du dafür ein Gleichungssystem lösen, in der Koordinatenform genügt Einsetzen.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Punktprobe-Labor</h3>
      <p>
        Stelle mit den Reglern einen Punkt <Formel tex="X" /> ein. Die Punktprobe blendest du ein, wenn du eine Vermutung hast.
      </p>
      <Punktlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle einen Punkt der Ebene ein (zum Beispiel <Formel tex={punktTeX('', e.X)} nach=")." /> Ändere dann <Formel tex="x_3" /> um 1. Wie ändert sich das Ergebnis des Skalarprodukts?
          </p>
          <Beobachtung>
            Das Ergebnis ändert sich um den Koeffizienten von <Formel tex="x_3" nach="," /> hier um <Formel tex="-1" nach="." /> Es ist dann nicht mehr <Formel tex="d" nach="," /> der Punkt liegt nicht mehr in der Ebene.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
