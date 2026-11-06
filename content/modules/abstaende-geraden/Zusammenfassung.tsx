import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { lot } from '@/lib/gerade';
import { punktTeX } from '@/lib/geradenhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_BEISPIEL } from './Bilder';
import { BEISPIEL } from './daten';
import { fqZeilen, gl, glSchmal, lotfussRechnung, rund2, weg1Zeilen, weg3Zeilen, wurzelTeX } from './rechenhilfen';

const Z = ({ z }: { z: { tex: string; schmal: string } }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;

export function Zusammenfassung() {
  const b = BEISPIEL;
  const l = lot(b.g, b.Q);
  const w1 = weg1Zeilen(b.g, b.Q);
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Abstand Punkt und Gerade</h3>
      <Hinweis art="merksatz" titel="Abstand und Lotfußpunkt">
        Der Abstand <Formel tex="d" /> eines Punkts <Formel tex="Q" /> von der Geraden <Formel tex={t`g:\ \vec{x}=\vec{p}+t\cdot\vec{u}`} /> ist die kürzeste Entfernung von <Formel tex="Q" /> zu den Punkten von <Formel tex="g" nach="." /> Der Punkt von <Formel tex="g" nach="," /> der <Formel tex="Q" /> am nächsten liegt, ist der Lotfußpunkt <Formel tex="F" nach="." /> Es gilt <Formel tex={t`d=|\overrightarrow{FQ}|`} nach="," /> und <Formel tex={t`\overrightarrow{FQ}`} /> steht senkrecht auf <Formel tex={t`\vec{u}`} nach="," /> das heißt <Formel tex={t`\overrightarrow{FQ}\cdot\vec{u}=0`} nach="." /> Der Abstand zum Stützpunkt <Formel tex="P" /> ist im Allgemeinen größer, er ist nicht der Abstand zur Geraden.
      </Hinweis>
      <Hinweis art="merksatz" titel="Die drei Wege">
        <ul className="liste-ohne-zahl" aria-label="Die drei Wege zum Abstand">
          <li><strong>Weg 1 (Orthogonalität):</strong> laufender Punkt <Formel tex={t`X(t)`} nach="," /> <Formel tex={t`\overrightarrow{XQ}\cdot\vec{u}=0`} /> nach <Formel tex="t" /> lösen, <Formel tex="F" /> berechnen, <Formel tex={t`d=|\overrightarrow{FQ}|`} nach="." /> Das Ergebnis für <Formel tex="t" /> ist <Formel tex={t`t_0=\frac{(\vec{q}-\vec{p})\cdot\vec{u}}{\vec{u}\cdot\vec{u}}`} nach="." /></li>
          <li><strong>Weg 2 (Minimieren):</strong> <Formel tex={t`D(t)=|\overrightarrow{XQ}|^2`} /> aufstellen, den Scheitel mit <Formel tex="D'(t)=0" /> bestimmen, <Formel tex={t`d=\sqrt{D(t_0)}`} nach="." /></li>
          <li><strong>Weg 3 (Vektorprodukt):</strong> <Formel tex={t`d=\frac{|\vec{u}\times\overrightarrow{PQ}|}{|\vec{u}|}`} nach="." /> Sie gibt nur den Abstand, nicht den Lotfußpunkt.</li>
        </ul>
        Das Vektorprodukt steht im Modul <Modulverweis modul="vektorprodukt">Das Vektorprodukt</Modulverweis>, das Skalarprodukt im Modul <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>.
      </Hinweis>

      <h3>Abstand paralleler Geraden</h3>
      <Hinweis art="merksatz" titel="Abstand paralleler Geraden">
        Sind die Richtungsvektoren Vielfache und liegt der Stützpunkt <Formel tex="Q" /> von <Formel tex="h" /> nicht auf <Formel tex="g" nach="," /> sind die Geraden parallel. Jeder Punkt von <Formel tex="h" /> hat denselben Abstand zu <Formel tex="g" nach="." /> Der Abstand der Geraden ist deshalb der Abstand von <Formel tex="Q" /> zu <Formel tex="g" nach="," /> berechnet mit einem der drei Wege. Liegt <Formel tex="Q" /> auf <Formel tex="g" nach="," /> sind die Geraden identisch und der Abstand ist 0. Der Abstand der Stützpunkte ist nur dann der Abstand der Geraden, wenn ihre Verbindung senkrecht auf den Geraden steht.
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>Gegeben sind</p>
      <Umbruchformel tex={gl(b.g)} schmal={glSchmal(b.g)} />
      <p>
        und der Punkt <Formel tex={punktTeX('Q', b.Q)} nach="." /> Weg 1:
      </p>
      <Z z={w1.skalar} />
      <Z z={w1.gleichung} />
      <p>Lotfußpunkt:</p>
      <Formel anzeige tex={lotfussRechnung(b.g, l.t, l.F)} />
      <Z z={fqZeilen(b.g, b.Q)} />
      <Figur spec={RAUM_BEISPIEL} unter={<>Das Lot <Formel tex="FQ" /> (orange) ist kürzer als die Strecke <Formel tex="XQ" /> (rosa) zu einem anderen Punkt von <Formel tex="g" nach="." /></>} />
      <p>Kontrolle mit Weg 3:</p>
      <Z z={weg3Zeilen(b.g, b.Q).abstand} />
      <p>
        Beide Wege liefern <Formel tex={t`d=${wurzelTeX(l.d2)}\approx ${rund2(l.d)}`} nach="." />
      </p>

      <Hinweis titel="Häufige Fehler">
        Den Abstand zum Stützpunkt oder zu einem beliebigen Punkt von <Formel tex="g" /> als Abstand zur Geraden nehmen. Beim Aufstellen von <Formel tex={t`\overrightarrow{XQ}`} /> Zielpunkt und Ausgangspunkt vertauschen (das Skalarprodukt ändert nur das Vorzeichen, der Betrag nicht). Beim Abstand paralleler Geraden den Abstand der Stützpunkte nehmen. Bei Weg 3 das Vektorprodukt mit dem falschen Verbindungsvektor bilden (es muss <Formel tex={t`\overrightarrow{PQ}`} /> vom Stützpunkt zum gegebenen Punkt sein) oder durch <Formel tex={t`|\vec{u}|`} /> zu teilen vergessen. Beim Minimieren die Wurzel mit ableiten, statt <Formel tex="D" /> zu minimieren. Identische Geraden nicht erkennen.
      </Hinweis>
    </Abschnitt>
  );
}
