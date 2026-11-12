import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { abstandPunktEbene } from '@/lib/abstandebene';
import { abstandMitWert, formTeX, spalteBruch, weg1 } from '@/lib/abstandebenehilfen';
import { bruch, punktBruchTeX, punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { skalarprodukt, verbindungsvektor } from '@/lib/vektor';
import { RAUM_EBENEN, RAUM_GERADE, RAUM_LOT, RAUM_SPIEGEL } from './Bilder';
import { BEISPIEL, E, E_RICHTUNG, EBENE_F, GERADE } from './daten';
import { Lotlabor, Parallelenlabor } from './Labor';
import { spiegelZeilen } from '@/lib/abstandebenehilfen';

const null0 = (x: number) => Math.round(x * 1e9) / 1e9 + 0;

export function Entdecken() {
  const q = BEISPIEL.Q;
  const x = BEISPIEL.X;
  const r = abstandPunktEbene(E, q);
  const w = weg1(E, q);
  const fq = verbindungsvektor(r.F, q);
  const sz = spiegelZeilen(E, q);
  const rp = abstandPunktEbene(E, GERADE.p);
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Welche Strecke von Q zur Ebene ist die kürzeste?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Im Lotlabor ist die Ebene <Formel tex={formTeX(E)} /> gegeben. Verschiebe den Punkt <Formel tex="X" /> in der Ebene und beobachte die Länge der Strecke <Formel tex="XQ" nach="." /> Wo liegt <Formel tex="X" nach="," /> wenn die Strecke am kürzesten ist? Wie steht die kürzeste Strecke zur Ebene? Welche Richtung hat sie? Zeige dazu das Lot und die Längen an.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_LOT}
                unter={
                  <>
                    Das Lot <Formel tex="FQ" /> (orange) ist kürzer als jede andere Strecke von <Formel tex="Q" /> zu einem Punkt der Ebene, hier als <Formel tex="XQ" /> (rosa).
                  </>
                }
              />
            }
          >
            <p>
              Die Strecke <Formel tex="XQ" /> ist am kürzesten, wenn <Formel tex="X" /> der Lotfußpunkt <Formel tex="F" /> ist. Für <Formel tex={punktTeX('Q', q)} /> und <Formel tex={punktTeX('X', x)} /> ist <Formel tex={t`|\overrightarrow{XQ}|=\sqrt{5}\approx 2{,}24`} nach="," /> für den Lotfußpunkt <Formel tex={punktBruchTeX('F', r.F)} /> ist <Formel tex={t`|\overrightarrow{FQ}|=2`} nach="." />
            </p>
            <p>
              Das Lot steht senkrecht auf der Ebene: Es steht senkrecht auf jeder Richtung in <Formel tex="E" nach="." /> Zwei Richtungen in <Formel tex="E" /> sind <Formel tex={t`\vec{u}=${spalte(E_RICHTUNG.u)}`} /> und <Formel tex={t`\vec{v}=${spalte(E_RICHTUNG.v)}`} nach="." /> Mit <Formel tex={t`\overrightarrow{FQ}=${spalteBruch(fq)}`} /> sind die Skalarprodukte <Formel tex={t`\overrightarrow{FQ}\cdot\vec{u}=${null0(skalarprodukt(fq, E_RICHTUNG.u))}`} /> und <Formel tex={t`\overrightarrow{FQ}\cdot\vec{v}=${null0(skalarprodukt(fq, E_RICHTUNG.v))}`} nach="." /> Der Vektor <Formel tex={t`\overrightarrow{FQ}`} /> hat also die Richtung des Normalenvektors <Formel tex={t`\vec{n}=${spalte(E.n)}`} nach="," /> er ist ein Vielfaches von <Formel tex={t`\vec{n}`} nach="." />
            </p>
            <p>
              Vermutung: Der Abstand eines Punkts von einer Ebene ist die Länge des Lots. Das Lot ist die Strecke vom Punkt zum Lotfußpunkt, sie steht senkrecht auf der Ebene und hat die Richtung des Normalenvektors <Formel tex={t`\vec{n}`} nach="." />
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Lotlabor</h3>
      <p>
        Stelle den Punkt <Formel tex="Q" /> ein und verschiebe <Formel tex="X" /> mit den Reglern <Formel tex="a" /> und <Formel tex="b" /> in der Ebene. Das Lot, die Längen, die Rechnung mit <Formel tex={t`t_0`} /> und den Spiegelpunkt blendest du ein, wenn du eine Vermutung hast. Das Labor zeigt Ebenen nur im Raum. Über dem Bild wählst du zwischen Schrägbild und räumlicher Ansicht.
      </p>
      <Lotlabor />
      <p>Untersuche:</p>
      <ul>
        <li>Für welche Lage von <Formel tex="X" /> ist <Formel tex="XQ" /> am kürzesten? Ändert sich das, wenn du <Formel tex="Q" /> verschiebst?</li>
        <li>Was ändert sich am Abstand, wenn <Formel tex="Q" /> auf der anderen Seite der Ebene liegt?</li>
        <li>Welchen Abstand hat ein Punkt <Formel tex="Q" /> in der Ebene?</li>
      </ul>

      <h3>Vermutung 2: Wie berechnest du den Lotfußpunkt und den Abstand?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Das Lot hat die Richtung von <Formel tex={t`\vec{n}`} nach="." /> Stelle die Gerade <Formel tex="g" /> auf, die durch <Formel tex={punktTeX('Q', q)} /> geht und den Richtungsvektor <Formel tex={t`\vec{n}`} /> hat. Wo trifft sie die Ebene <Formel tex={formTeX(E)} nach="?" /> Welcher Punkt ist das? Wie hängen der Parameter <Formel tex="t" /> im Treffpunkt und der Abstand <Formel tex="d" /> zusammen? Rechne mit der Geradenprobe und prüfe im Lotlabor mit „Rechnung mit t₀ zeigen“.
          </p>
          <Beobachtung>
            <p>
              Die Gerade durch <Formel tex="Q" /> mit dem Richtungsvektor <Formel tex={t`\vec{n}`} nach=":" />
            </p>
            <Umbruchformel tex={w.lotgerade} schmal={w.lotgeradeSchmal} />
            <p>
              Die Geradenprobe liefert <Formel tex={t`t_0=${w.t}`} nach="." /> Eingesetzt:
            </p>
            <Umbruchformel {...w.fuss} />
            <p>
              Der Treffpunkt <Formel tex={punktBruchTeX('F', r.F)} /> ist der Lotfußpunkt. Der Vektor <Formel tex={t`\overrightarrow{QF}=t_0\cdot\vec{n}`} /> ist ein Vielfaches von <Formel tex={t`\vec{n}`} nach="," /> seine Länge ist <Formel tex={t`|t_0|\cdot|\vec{n}|`} nach="." /> Hier ist <Formel tex={t`|t_0|=${bruch(Math.abs(r.t))}`} /> und <Formel tex={t`|\vec{n}|=3`} nach="," /> also <Formel tex={t`d=${bruch(Math.abs(r.t))}\cdot 3=${abstandMitWert(r.z, r.nn)}`} nach="." />
            </p>
            <p>
              Vermutung: Du findest den Lotfußpunkt als Schnittpunkt der Lotgeraden (durch den Punkt, Richtungsvektor <Formel tex={t`\vec{n}`} nach=")" /> mit der Ebene. Der Abstand ist <Formel tex={t`d=|t_0|\cdot|\vec{n}|`} nach="." />
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Abstand einer Geraden und paralleler Ebenen</h3>
      <p>
        Die Gerade <Formel tex={t`g:\ \vec{x}=${spalte(GERADE.p)}+s\cdot${spalte(GERADE.u)}`} /> ist echt parallel zur Ebene <Formel tex={formTeX(E)} nach="." /> Im Parallelenlabor wandert der Punkt <Formel tex="X" /> auf <Formel tex="g" nach="." />
      </p>
      <Parallelenlabor />
      <ol className="auftraege">
        <li>
          <p>
            Wie ändert sich der Abstand von <Formel tex="X" /> zur Ebene, wenn <Formel tex="X" /> auf <Formel tex="g" /> wandert? Was heißt das für die Berechnung des Abstands der Geraden <Formel tex="g" /> von der Ebene <Formel tex="E" nach="?" />
          </p>
          <Beobachtung bild={<Figur spec={RAUM_GERADE} unter={<>Jeder Punkt der Geraden <Formel tex="g" /> hat denselben Abstand zur Ebene <Formel tex="E" nach="." /></>} />}>
            <p>
              Alle Punkte von <Formel tex="g" /> haben denselben Abstand zu <Formel tex="E" nach=":" /> hier <Formel tex={t`d=${abstandMitWert(rp.z, rp.nn)}`} nach="." /> Deshalb genügt ein Punkt von <Formel tex="g" /> zur Berechnung, am einfachsten der Stützpunkt. Der Abstand der Geraden von der Ebene ist der Abstand eines Punkts von <Formel tex="g" /> zur Ebene <Formel tex="E" nach="." />
            </p>
            <p>
              Schneidet <Formel tex="g" /> die Ebene oder liegt sie in ihr, gibt es einen gemeinsamen Punkt und der Abstand ist 0.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Die Ebene <Formel tex={formTeX(EBENE_F, 'F')} /> ist zu <Formel tex="E" /> parallel. Nimm einen Punkt <Formel tex="P" /> in <Formel tex="F" /> und bestimme seinen Abstand zu <Formel tex="E" nach="." /> Ändert sich der Abstand, wenn du einen anderen Punkt in <Formel tex="F" /> wählst? Wie kannst du den Abstand der Ebenen berechnen?
          </p>
          <Beobachtung bild={<Figur spec={RAUM_EBENEN} unter={<>Jeder Punkt der Ebene <Formel tex="F" /> hat denselben Abstand zur Ebene <Formel tex="E" nach="." /></>} />}>
            <p>
              Für <Formel tex={punktTeX('P', GERADE.p)} /> in <Formel tex="F" /> (denn <Formel tex={t`2\cdot 1-0+2\cdot 3=8`} nach=")" /> ist <Formel tex={t`d=${abstandMitWert(rp.z, rp.nn)}`} nach="." /> Jeder andere Punkt von <Formel tex="F" /> hat denselben Abstand zu <Formel tex="E" nach="," /> weil die Ebenen parallel sind. Der Abstand der Ebenen ist der Abstand eines Punkts von <Formel tex="F" /> zur Ebene <Formel tex="E" nach="." />
            </p>
            <p>
              Vermutung: Bei einer Geraden, die echt parallel zu <Formel tex="E" /> ist, und bei einer echt parallelen Ebene wählst du einen Punkt und berechnest dessen Abstand zur Ebene. Welcher Punkt es ist, spielt keine Rolle.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 4: Wo liegt der Spiegelpunkt?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Zeige im Lotlabor den Spiegelpunkt <Formel tex={t`Q'`} /> und das Lot an. Welche Lage hat der Lotfußpunkt <Formel tex="F" /> zu <Formel tex="Q" /> und <Formel tex={t`Q'`} nach="?" /> Wie kannst du <Formel tex={t`Q'`} /> mit der Lotgeraden berechnen?
          </p>
          <Beobachtung bild={<Figur spec={RAUM_SPIEGEL} unter={<>Der Lotfußpunkt <Formel tex="F" /> ist die Mitte der Strecke <Formel tex={t`QQ'`} nach="." /></>} />}>
            <p>
              Der Lotfußpunkt <Formel tex="F" /> liegt genau in der Mitte der Strecke <Formel tex={t`QQ'`} nach="," /> denn <Formel tex={t`Q'`} /> hat denselben Abstand zur Ebene wie <Formel tex="Q" /> und liegt auf der Lotgeraden. Von <Formel tex="Q" /> zu <Formel tex="F" /> geht man <Formel tex={t`t_0\cdot\vec{n}`} nach="," /> von <Formel tex="F" /> zu <Formel tex={t`Q'`} /> noch einmal genauso weit:
            </p>
            <Umbruchformel {...{ tex: sz.tex, schmal: sz.schmal }} />
            <p>
              Mit dem Lotfußpunkt als Mitte geht es auch so:
            </p>
            <Umbruchformel {...sz.viaF} />
            <p>
              Vermutung: Der Spiegelpunkt ist <Formel tex={t`\overrightarrow{OQ'}=\overrightarrow{OQ}+2t_0\cdot\vec{n}`} nach="." /> Gleichwertig ist <Formel tex={t`\overrightarrow{OQ'}=2\cdot\overrightarrow{OF}-\overrightarrow{OQ}`} nach="." />
            </p>
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
