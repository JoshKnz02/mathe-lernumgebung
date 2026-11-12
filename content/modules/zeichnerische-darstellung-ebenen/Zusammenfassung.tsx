import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { RAUM_ERKLAEREN } from './Bilder';
import { ABSCHNITT, BEISPIEL as B } from './daten';
import { achsenabschnittsformTeX, koordinatenformTeX, punktTeX, spalte, spurGleichungTeX, spurZeilen } from './rechenhilfen';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Spurpunkte, Spurgeraden und Ausschnitt</h3>
      <Hinweis art="merksatz" titel="Spurpunkte und Spurgeraden">
        Ein <strong>Spurpunkt</strong> ist ein Schnittpunkt der Ebene mit einer Koordinatenachse (<Formel tex={t`S_1`} nach="," /> <Formel tex={t`S_2`} nach="," /> <Formel tex={t`S_3`} nach=")." /> Du berechnest ihn aus der Koordinatenform, indem du die beiden anderen Koordinaten gleich 0 setzt und nach der übrigen Koordinate auflöst. Eine <strong>Spurgerade</strong> ist die Schnittgerade der Ebene mit einer Koordinatenebene (<Formel tex={t`s_{12}`} nach="," /> <Formel tex={t`s_{13}`} nach="," /> <Formel tex={t`s_{23}`} nach=")." /> Ihre Gleichung in der Koordinatenebene entsteht, indem du die Koordinate gleich 0 setzt, die dort 0 ist. Das <strong>Spurdreieck</strong> aus den drei Spurpunkten ist ein Ausschnitt der Ebene, die Ebene selbst ist unbegrenzt.
      </Hinweis>
      <Hinweis art="merksatz" titel="Eine Ebene zeichnen, in vier Schritten">
        <ol>
          <li>Liegt die Ebene in Parameterform vor, bestimme die Koordinatenform: <Formel tex={t`\vec{n}=\vec{u}\times\vec{v}`} /> (Vektorprodukt (Kreuzprodukt)) und <Formel tex={t`d=\vec{n}\cdot\vec{p}`} nach="." /></li>
          <li>Berechne die Spurpunkte (je zwei Koordinaten gleich 0 setzen).</li>
          <li>Zeichne die Spurpunkte auf den Achsen ein und beschrifte sie.</li>
          <li>Verbinde die Spurpunkte mit dem Lineal (Spurgeraden) und schraffiere das Spurdreieck.</li>
        </ol>
      </Hinweis>

      <h3>Besondere Lage im Koordinatensystem</h3>
      <Hinweis art="merksatz" titel="Lage an der Gleichung ablesen">
        Die Lage lässt sich aus der Koordinatenform <Formel tex={t`ax_1+bx_2+cx_3=d`} /> ablesen:
        <ul>
          <li>Alle drei Variablen kommen vor und <Formel tex="d\ne 0" nach=":" /> drei Spurpunkte, die Ebene schneidet alle drei Achsen. Ausschnitt: Spurdreieck.</li>
          <li>Eine Variable fehlt und <Formel tex="d\ne 0" nach=":" /> zwei Spurpunkte, die Ebene ist parallel zu der Achse, deren Variable fehlt. Die Spurgeraden durch die beiden Spurpunkte sind parallel zu dieser Achse, der Ausschnitt ist ein Streifen.</li>
          <li>Zwei Variablen fehlen und <Formel tex="d\ne 0" nach=":" /> ein Spurpunkt, die Ebene ist parallel zu der Koordinatenebene, die von den Achsen der fehlenden Variablen aufgespannt wird. Zwei Spurgeraden, die parallel zu Achsen sind, der Ausschnitt ist ein Rechteck.</li>
          <li><Formel tex="d=0" nach=":" /> Die Ebene geht durch den Ursprung. Sind alle drei Variablen vorhanden, fallen die Spurpunkte im Ursprung zusammen, dann zeichnest du ein Dreieck mit je einem Punkt auf jeder Spurgerade, das den Ursprung enthält. Fehlt eine Variable, enthält die Ebene die zugehörige Achse.</li>
        </ul>
        Eine falsche Aussage wie <Formel tex="0=6" /> bei der Berechnung eines Spurpunkts heißt: Auf dieser Achse gibt es keinen Punkt der Ebene, die Ebene ist parallel zu ihr.
      </Hinweis>
      <Hinweis art="merksatz" titel="Achsenabschnittsform">
        Hat die Ebene die drei Spurpunkte <Formel tex={t`S_1(a\,|\,0\,|\,0)`} nach="," /> <Formel tex={t`S_2(0\,|\,b\,|\,0)`} /> und <Formel tex={t`S_3(0\,|\,0\,|\,c)`} nach="," /> lautet eine Gleichung <Formel tex={t`\frac{x_1}{a}+\frac{x_2}{b}+\frac{x_3}{c}=1`} nach="." /> Die Zahlen <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> heißen Achsenabschnitte. Multiplizierst du mit dem Hauptnenner (dem kleinsten gemeinsamen Vielfachen der Beträge), erhältst du die Koordinatenform, zum Beispiel aus <Formel tex={achsenabschnittsformTeX(ABSCHNITT.s[0]!, ABSCHNITT.s[1]!, ABSCHNITT.s[2]!)} /> mit 12 die Gleichung <Formel tex={koordinatenformTeX(ABSCHNITT.k.n, ABSCHNITT.k.d)} nach="." />
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben ist <Formel tex={koordinatenformTeX(B.k.n, B.k.d, 'E')} nach="." /> Die Spurpunkte:
      </p>
      {[0, 1, 2].map((i) => {
        const z = spurZeilen(B.k, i);
        return <Umbruchformel key={i} tex={z.tex} schmal={z.schmal} />;
      })}
      <p>
        Die Spurgerade in der <Formel tex="x_1x_2" />-Ebene ist <Formel tex={t`s_{12}`} nach=":" /> Mit <Formel tex="x_3=0" /> bleibt <Formel tex={spurGleichungTeX(B.k, 'e12')} nach="." /> Sie geht durch <Formel tex={t`S_1`} /> und <Formel tex={t`S_2`} nach=":" />
      </p>
      <Umbruchformel tex={t`s_{12}:\ \vec{x}=${spalte(B.s[0]!)}+t\cdot${spalte([-2, 3, 0])}`} schmal={t`\begin{gathered}s_{12}:\ \vec{x}=${spalte(B.s[0]!)}\\{}+t\cdot${spalte([-2, 3, 0])}\end{gathered}`} />
      <p>
        Gezeichnet werden die Punkte <Formel tex={punktTeX('S_1', B.s[0]!)} nach="," /> <Formel tex={punktTeX('S_2', B.s[1]!)} /> und <Formel tex={punktTeX('S_3', B.s[2]!)} /> und ihre Verbindungsstrecken, das Spurdreieck wird schraffiert.
      </p>
      <Figur spec={RAUM_ERKLAEREN} unter={<>Die Ebene mit Spurpunkten, Spurgeraden und Spurdreieck. Das Dreieck ist nur ein Ausschnitt der Ebene.</>} />
      <Hinweis titel="Häufige Fehler">
        Beim Berechnen der Spurpunkte nur eine Koordinate gleich 0 setzen. Das Vorzeichen eines Achsenabschnitts vergessen und den Spurpunkt auf der falschen Seite des Ursprungs zeichnen. Die Koeffizienten der Gleichung mit den Koordinaten der Spurpunkte verwechseln. Ein Spurpunkt fehlt, und es wird versucht, trotzdem ein Dreieck zu zeichnen. Bei Ebenen durch den Ursprung nur den Ursprung einzeichnen. Das Spurdreieck für die ganze Ebene halten.
      </Hinweis>
    </Abschnitt>
  );
}
