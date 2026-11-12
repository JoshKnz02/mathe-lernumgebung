import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { abstandPunktEbene } from '@/lib/abstandebene';
import { abstandMitWert, formelZeilen, formTeX, spiegelZeilen, weg1 } from '@/lib/abstandebenehilfen';
import { skalarZeilen } from '@/lib/ebenenhilfen';
import { punktBruchTeX, punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_EBENEN, RAUM_GERADE, RAUM_LOT, RAUM_SPIEGEL } from './Bilder';
import { BEISPIEL, E, EBENE_F, GERADE } from './daten';

const Z = ({ z }: { z: { tex: string; schmal: string } }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;

export function Wege() {
  const q = BEISPIEL.Q;
  const r = abstandPunktEbene(E, q);
  const w = weg1(E, q);
  const f = formelZeilen(E, q);
  const sz = spiegelZeilen(E, q);
  const rp = abstandPunktEbene(E, GERADE.p);
  const fe = formelZeilen(E, [4, 0, 0]);
  const fg = formelZeilen(E, GERADE.p);
  const nu = skalarZeilen(E.n, GERADE.u);
  const np = skalarZeilen(E.n, GERADE.p);
  return (
    <Abschnitt id="wege" titel="Zwei Wege">
      <p>
        Den Abstand eines Punkts von einer Ebene berechnest du auf zwei Wegen. Beide führen zum selben Ergebnis. Als Beispiel dienen die Ebene <Formel tex={formTeX(E)} /> und der Punkt <Formel tex={punktTeX('Q', q)} /> aus dem Abschnitt „Erklären“. Ist die Ebene in Parameterform gegeben, bestimmst du zuerst die Koordinatenform: Der Normalenvektor ist das Vektorprodukt (Kreuzprodukt) der Spannvektoren, die rechte Seite folgt aus dem Stützvektor (siehe <Modulverweis modul="normalenform-koordinatenform">Normalenform und Koordinatenform</Modulverweis>).
      </p>

      <h3>Weg 1: Lotgerade und Lotfußpunkt</h3>
      <p>
        Im Abschnitt „Entdecken“ hast du gesehen: Das Lot hat die Richtung des Normalenvektors <Formel tex={t`\vec{n}`} nach="." /> Der Lotfußpunkt ist der Schnittpunkt der Lotgeraden mit der Ebene. Das ist eine Geradenprobe (siehe <Modulverweis modul="gerade-und-ebene">Gerade und Ebene: gegenseitige Lage</Modulverweis>).
      </p>
      <ol>
        <li>Die Lotgerade aufstellen: Stützpunkt <Formel tex="Q" nach="," /> Richtungsvektor <Formel tex={t`\vec{n}`} nach="." /></li>
        <li>Die Geradenprobe mit der Ebene ausführen und nach <Formel tex="t" /> auflösen. Das ergibt <Formel tex={t`t_0`} nach="." /></li>
        <li>Mit <Formel tex={t`t_0`} /> den Lotfußpunkt <Formel tex="F" /> berechnen.</li>
        <li>Den Abstand berechnen: <Formel tex={t`d=|t_0|\cdot|\vec{n}|`} /> (oder als Länge von <Formel tex="FQ" nach=")." /></li>
      </ol>
      <Umbruchformel tex={w.lotgerade} schmal={w.lotgeradeSchmal} />
      <p>Geradenprobe, die Koordinaten in die Ebenengleichung eingesetzt:</p>
      <Z z={w.probe} />
      <p>
        Aus <Formel tex={w.probe.gleichung} /> folgt <Formel tex={t`t_0=${w.t}`} nach="." /> Lotfußpunkt:
      </p>
      <Z z={w.fuss} />
      <p>Betrag des Normalenvektors und Abstand:</p>
      <Z z={w.norm} />
      <Z z={w.abstand} />
      <Figur spec={RAUM_LOT} unter={<>Das Lot von <Formel tex="Q" /> auf die Ebene: Der Lotfußpunkt ist <Formel tex={punktBruchTeX('F', r.F)} nach="," /> der Abstand ist <Formel tex={t`d=${abstandMitWert(r.z, r.nn)}`} nach="." /></>} />

      <h3>Weg 2: Die Abstandsformel</h3>
      <p>
        Löst du die Geradenprobe allgemein nach <Formel tex={t`t_0`} /> auf, erhältst du eine Formel. Für die Lotgerade <Formel tex={t`\vec{x}=\vec{q}+t\cdot\vec{n}`} /> und die Ebene <Formel tex={t`\vec{n}\cdot\vec{x}=b`} /> gilt:
      </p>
      <Umbruchformel tex={t`(\vec{n}\cdot\vec{n})\,t+\vec{n}\cdot\vec{q}=b\ \Rightarrow\ t_0=\frac{b-\vec{n}\cdot\vec{q}}{\vec{n}\cdot\vec{n}}`} schmal={t`\begin{gathered}(\vec{n}\cdot\vec{n})\,t+\vec{n}\cdot\vec{q}=b\\t_0=\frac{b-\vec{n}\cdot\vec{q}}{\vec{n}\cdot\vec{n}}\end{gathered}`} />
      <p>
        Mit <Formel tex={t`\vec{n}\cdot\vec{n}=|\vec{n}|^2`} /> folgt <Formel tex={t`d=|t_0|\cdot|\vec{n}|=\frac{|b-\vec{n}\cdot\vec{q}|}{|\vec{n}|}`} nach="." /> Das ist die <strong>Abstandsformel</strong>. Für <Formel tex={t`Q(q_1\,|\,q_2\,|\,q_3)`} /> und <Formel tex={t`E:\ n_1x_1+n_2x_2+n_3x_3=b`} /> heißt sie:
      </p>
      <Umbruchformel tex={f.allgemein} schmal={f.allgemeinSchmal} />
      <p>
        Dabei ist <Formel tex={t`\vec{n}\cdot\vec{q}=n_1q_1+n_2q_2+n_3q_3`} /> und <Formel tex={t`|\vec{n}|=\sqrt{n_1^2+n_2^2+n_3^2}`} nach="." />
      </p>
      <Hinweis titel="Hinweis zur Schreibweise in Büchern">
        Schreibt man die Ebene als <Formel tex={t`n_1x_1+n_2x_2+n_3x_3-b=0`} nach="," /> steht im Zähler der Term links vom Gleichheitszeichen mit den Koordinaten von <Formel tex="Q" /> an Stelle von <Formel tex={t`x_1`} nach="," /> <Formel tex={t`x_2`} /> und <Formel tex={t`x_3`} nach="." /> Teilt man die Gleichung durch <Formel tex={t`|\vec{n}|`} nach="," /> spricht man von der Hesse'schen Normalform. Du brauchst den Namen nicht, die Formel genügt.
      </Hinweis>
      <p>Beispiel mit den Zahlen von oben:</p>
      <Z z={f.zeilen} />
      <Hinweis titel="Was Weg 2 nicht liefert">
        Die Abstandsformel gibt nur den Abstand, nicht den Lotfußpunkt. Den Lotfußpunkt, die Höhe des Lotfußpunkts und den Spiegelpunkt bekommst du über Weg 1.
      </Hinweis>

      <h3>Welcher Weg wann?</h3>
      <ul className="liste-ohne-zahl" aria-label="Die zwei Wege im Vergleich">
        <li><strong>Weg 1</strong> liefert den Lotfußpunkt und den Abstand. Du brauchst ihn immer, wenn der Lotfußpunkt, seine Höhe oder der Spiegelpunkt gefragt ist.</li>
        <li><strong>Weg 2</strong> ist am kürzesten, wenn nur der Abstand gefragt ist. Er liefert keinen Lotfußpunkt.</li>
      </ul>

      <h3>Abstand Gerade und Ebene</h3>
      <p>
        Der Abstand ist nur bei echt parallelen Objekten größer als 0. Die Berechnung hat drei Schritte:
      </p>
      <ol>
        <li>Prüfen, ob <Formel tex="g" /> echt parallel zu <Formel tex="E" /> ist. Dazu rechnest du <Formel tex={t`\vec{n}\cdot\vec{u}`} nach=":" /> Ist es 0, ist <Formel tex="g" /> echt parallel zu <Formel tex="E" /> oder liegt in <Formel tex="E" nach="." /> Ob der Stützpunkt in <Formel tex="E" /> liegt, entscheidet (siehe <Modulverweis modul="gerade-und-ebene">Gerade und Ebene: gegenseitige Lage</Modulverweis>).</li>
        <li>Den Stützpunkt <Formel tex="P" /> von <Formel tex="g" /> als Punkt wählen.</li>
        <li>Den Abstand von <Formel tex="P" /> zur Ebene mit Weg 1 oder Weg 2 berechnen.</li>
      </ol>
      <p>
        Beispiel: <Formel tex={t`g:\ \vec{x}=${spalte(GERADE.p)}+s\cdot${spalte(GERADE.u)}`} /> und <Formel tex={formTeX(E)} nach="." /> Für den Richtungsvektor und den Stützpunkt:
      </p>
      <Z z={{ tex: `\\vec{n}\\cdot\\vec{u}=${nu.tex}`, schmal: nu.schmal }} />
      <Z z={{ tex: `\\vec{n}\\cdot\\vec{p}=${np.tex}`, schmal: np.schmal }} />
      <p>
        Es ist <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach="," /> und <Formel tex={t`8\ne 2`} nach="," /> der Stützpunkt liegt nicht in <Formel tex="E" nach="." /> Also ist <Formel tex="g" /> echt parallel zu <Formel tex="E" nach="." /> Abstand von <Formel tex={punktTeX('P', GERADE.p)} nach=":" />
      </p>
      <Z z={fg.zeilen} />
      <Figur spec={RAUM_GERADE} unter={<>Der Abstand der Geraden <Formel tex="g" /> von der Ebene <Formel tex="E" nach=":" /> <Formel tex={t`d=${abstandMitWert(rp.z, rp.nn)}`} nach="." /></>} />

      <h3>Abstand paralleler Ebenen</h3>
      <ol>
        <li>Prüfen, ob die Ebenen echt parallel sind: Die Normalenvektoren müssen Vielfache sein (siehe <Modulverweis modul="zwei-ebenen">Zwei Ebenen: gegenseitige Lage</Modulverweis>). Sind die Gleichungen mit demselben Faktor auch rechts Vielfache, sind die Ebenen identisch.</li>
        <li>Einen Punkt der zweiten Ebene <Formel tex="F" /> bestimmen, zum Beispiel indem du zwei Koordinaten 0 setzt.</li>
        <li>Den Abstand dieses Punkts von der ersten Ebene <Formel tex="E" /> berechnen.</li>
      </ol>
      <p>
        Beispiel: <Formel tex={formTeX(E)} /> und <Formel tex={formTeX(EBENE_F, 'F')} nach="." /> Die Normalenvektoren sind gleich, die rechten Seiten verschieden (<Formel tex={t`8\ne 2`} nach="):" /> Die Ebenen sind echt parallel. Mit <Formel tex={t`x_2=0`} /> und <Formel tex={t`x_3=0`} /> folgt in <Formel tex="F" nach=":" /> <Formel tex={t`2x_1=8`} nach="," /> also <Formel tex={t`x_1=4`} nach="." /> Der Punkt <Formel tex={punktTeX('P', [4, 0, 0])} /> liegt in <Formel tex="F" nach="." /> Sein Abstand von <Formel tex="E" nach=":" />
      </p>
      <Z z={fe.zeilen} />
      <Figur spec={RAUM_EBENEN} unter={<>Der Abstand der parallelen Ebenen <Formel tex="E" /> und <Formel tex="F" nach=":" /> <Formel tex={t`d=${abstandMitWert(6, 9)}`} nach="." /></>} />
      <Hinweis titel="Achtung">
        Haben die Ebenen verschiedene Normalenvektoren, die Vielfache sind (zum Beispiel <Formel tex={t`x_1+2x_2+2x_3=2`} /> und <Formel tex={t`2x_1+4x_2+4x_3=16`} nach=")," /> darfst du die rechten Seiten nicht direkt vergleichen. Teile die zweite Gleichung zuerst durch den Faktor (hier durch 2) oder rechne mit einem Punkt von <Formel tex="F" nach="." />
      </Hinweis>

      <h3>Spiegelung an einer Ebene</h3>
      <p>
        Der Spiegelpunkt <Formel tex={t`Q'`} /> liegt auf der Lotgeraden durch <Formel tex="Q" nach="," /> auf der anderen Seite der Ebene und genauso weit von ihr entfernt. So gehst du vor:
      </p>
      <ol>
        <li>Die Lotgerade durch <Formel tex="Q" /> aufstellen, <Formel tex={t`t_0`} /> und den Lotfußpunkt <Formel tex="F" /> bestimmen (Weg 1).</li>
        <li>Den Spiegelpunkt berechnen: <Formel tex={t`\overrightarrow{OQ'}=\overrightarrow{OQ}+2t_0\cdot\vec{n}`} /> oder, wenn <Formel tex="F" /> schon bekannt ist, <Formel tex={t`\overrightarrow{OQ'}=2\cdot\overrightarrow{OF}-\overrightarrow{OQ}`} nach="." /></li>
      </ol>
      <p>Mit <Formel tex={t`t_0=${w.t}`} /> aus Weg 1:</p>
      <Z z={{ tex: sz.tex, schmal: sz.schmal }} />
      <Figur spec={RAUM_SPIEGEL} unter={<>Der Spiegelpunkt <Formel tex={punktBruchTeX("Q'", sz.punkt)} /> von <Formel tex={punktTeX('Q', q)} /> an der Ebene <Formel tex="E" nach="." /></>} />
    </Abschnitt>
  );
}
