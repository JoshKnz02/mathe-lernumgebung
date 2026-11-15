import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur } from '@/components/Raumfigur';
import { useDarstellung } from '@/components/Raumbild';
import { opt, t } from '@/lib/modulhilfen';
import { bildpunktBild } from './Bilder';
import { BILD_P, BILD_PUNKT } from './daten';
import { Bildpunktlabor } from './Labor';
import { GeradeFormel, Kette, Liste, Pkt, feld, sp } from './hilfen';

/** Das Bild mit P und den weiteren Punkten, in der räumlichen Ansicht mit der Geraden. */
export function BildpunktFigur({ unter, gerade = true }: { unter: React.ReactNode; gerade?: boolean }) {
  const raum = useDarstellung() === 'raum';
  return <Figur spec={bildpunktBild(BILD_P, gerade && raum, true)} unter={unter} />;
}

function Aufgabe12() {
  return (
    <Aufgabe
      nummer="12"
      titel="Weitere Punkte mit demselben Bild"
      felder={[
        feld('b2', 'x zwei des Punkts mit x eins gleich 6', <>Punkt mit <Formel tex={t`x_1=6`} nach=":" /> Koordinate <Formel tex="x_2" /></>, 1),
        feld('b3', 'x drei des Punkts mit x eins gleich 6', <>Punkt mit <Formel tex={t`x_1=6`} nach=":" /> Koordinate <Formel tex="x_3" /></>, 5),
        feld('c2', 'x zwei des Punkts mit x eins gleich minus 2', <>Punkt mit <Formel tex={t`x_1=-2`} nach=":" /> Koordinate <Formel tex="x_2" /></>, -3),
        feld('c3', 'x drei des Punkts mit x eins gleich minus 2', <>Punkt mit <Formel tex={t`x_1=-2`} nach=":" /> Koordinate <Formel tex="x_3" /></>, 1),
      ]}
      hilfen={[
        <>Ein Punkt <Formel tex={t`(p_1\,|\,p_2\,|\,p_3)`} /> liegt im Schrägbild bei <Formel tex={t`X=p_2-\frac{p_1}{2}`} /> und <Formel tex={t`Y=p_3-\frac{p_1}{2}`} nach="." /> Diese beiden Werte sollen <Formel tex={t`-2`} /> und <Formel tex="2" /> bleiben.</>,
        <>Setze den vorgegebenen Wert für <Formel tex="x_1" /> in die beiden Gleichungen ein und löse sie nach <Formel tex="x_2" /> und <Formel tex="x_3" /> auf.</>,
      ]}
      loesung={[
        <>
          Für <Formel tex={t`x_1=6`} /> gilt
          <Liste z={[t`x_2-\frac{6}{2}=-2`, t`x_3-\frac{6}{2}=2`]} />
          also <Formel tex={t`x_2=1`} /> und <Formel tex={t`x_3=5`} nach="." /> Der Punkt ist <Pkt name="Q_1" p={[6, 1, 5]} nach="." />
        </>,
        <>
          Für <Formel tex={t`x_1=-2`} /> gilt
          <Liste z={[t`x_2-\frac{-2}{2}=-2`, t`x_3-\frac{-2}{2}=2`]} />
          also <Formel tex={t`x_2=-3`} /> und <Formel tex={t`x_3=1`} nach="." /> Der Punkt ist <Pkt name="Q_2" p={[-2, -3, 1]} nach="." /> Beide Punkte liegen im Schrägbild an derselben Stelle wie <Formel tex="P" nach="." />
        </>,
      ]}
    >
      <p>
        Im Schrägbild ist der Bildpunkt <Formel tex={t`B(${BILD_PUNKT.X}\,|\,${BILD_PUNKT.Y})`} /> markiert. Er stellt den Punkt <Pkt name="P" p={[...BILD_P]} /> dar. Das Schrägbild verwendet die Festlegung aus dem Modul <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis>: Die <Formel tex="x_2" />-Achse zeigt nach rechts, die <Formel tex="x_3" />-Achse nach oben, und eine Einheit auf der <Formel tex="x_1" />-Achse führt im Bild um <Formel tex={t`\frac{1}{2}`} /> nach links und um <Formel tex={t`\frac{1}{2}`} /> nach unten. Gesucht sind weitere Punkte, die durch denselben Bildpunkt <Formel tex="B" /> dargestellt werden. Bestimme die fehlenden Koordinaten.
      </p>
      <KontrollFigur spec={bildpunktBild(BILD_P, false, true)} unter={<>Der Punkt <Formel tex="P" /> und die offenen Kreise für die weiteren Punkte mit demselben Bild. Im Schrägbild fallen alle zusammen, in der räumlichen Ansicht liegen sie auf einer Geraden.</>} />
    </Aufgabe>
  );
}

function Aufgabe14() {
  return (
    <Aufgabe
      nummer="14"
      titel="Die Gerade aller Punkte mit demselben Bild"
      felder={[
        feld('u2', 'zweite Koordinate des Richtungsvektors', <>zweite Koordinate <Formel tex="u_2" /></>, 1),
        feld('u3', 'dritte Koordinate des Richtungsvektors', <>dritte Koordinate <Formel tex="u_3" /></>, 1),
      ]}
      hilfen={[
        <>Vergleiche zwei Punkte mit demselben Bild, zum Beispiel <Formel tex="P" /> und <Formel tex={t`Q_1`} nach="." /> Ihr Verbindungsvektor ist ein Richtungsvektor der gesuchten Geraden (<Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>).</>,
        <>Wenn <Formel tex="x_1" /> um <Formel tex="2" /> wächst, ändert sich <Formel tex="X" /> um <Formel tex={t`-1`} /> und <Formel tex="Y" /> um <Formel tex={t`-1`} nach="." /> Was muss mit <Formel tex="x_2" /> und <Formel tex="x_3" /> geschehen, damit sich im Bild nichts ändert?</>,
      ]}
      loesung={[
        <>
          Der Verbindungsvektor von <Formel tex="P" /> zu <Formel tex={t`Q_1`} /> entsteht, wenn du die Koordinaten von <Formel tex="P" /> von denen von <Formel tex={t`Q_1`} /> abziehst: <Formel tex={t`6-2=4`} nach="," /> <Formel tex={t`1-(-1)=2`} /> und <Formel tex={t`5-3=2`} nach="." />
          <Kette z={[t`\overrightarrow{PQ_1}`, sp([4, 2, 2]), t`2\cdot${sp([2, 1, 1])}`]} />
          Ein Richtungsvektor ist also <Formel tex={t`\vec{u}=${sp([2, 1, 1])}`} nach="." />
        </>,
        <>
          Warum das so sein muss: Wächst <Formel tex="x_1" /> um <Formel tex="2" nach="," /> verschiebt sich der Bildpunkt um <Formel tex={t`-1`} /> in <Formel tex="X" />-Richtung und um <Formel tex={t`-1`} /> in <Formel tex="Y" />-Richtung. Damit er an derselben Stelle bleibt, müssen <Formel tex="x_2" /> und <Formel tex="x_3" /> um je <Formel tex="1" /> wachsen. Alle Punkte mit demselben Bild liegen auf der Geraden
          <GeradeFormel p={[2, -1, 3]} u={[2, 1, 1]} par="s" />
          Diese Richtung gilt für jeden Bildpunkt, denn sie hängt nur von der Festlegung der <Formel tex="x_1" />-Achse im Schrägbild ab.
        </>,
      ]}
    >
      <p>
        Alle Punkte, die durch <Formel tex="B" /> dargestellt werden, liegen auf einer Geraden <Formel tex="g" /> durch <Formel tex="P" nach="." /> Ein Richtungsvektor von <Formel tex="g" /> hat die Form <Formel tex={t`\vec{u}=\begin{pmatrix}2\\u_2\\u_3\end{pmatrix}`} nach="." /> Bestimme <Formel tex="u_2" /> und <Formel tex="u_3" nach="." />
      </p>
    </Aufgabe>
  );
}

export function Bildpunkt() {
  return (
    <Abschnitt id="bildpunkt" titel="Ein Bildpunkt, viele Punkte">
      <p>
        Auf Papier kann man den Raum nur als Schrägbild zeichnen. Ein Punkt ist dann durch seinen Bildpunkt gegeben. Im Modul <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis> hast du gesehen, dass verschiedene Punkte im Schrägbild an derselben Stelle liegen können, dort für Punkte mit Koordinaten von <Formel tex="-4" /> bis <Formel tex="4" nach="." /> Hier gehst du der Frage nach, wie viele Punkte im Raum ein Bildpunkt darstellt und wo sie liegen.
      </p>
      <Hinweis titel="Die Problemaufgabe">
        <p>
          Der Bildpunkt <Formel tex={t`B(${BILD_PUNKT.X}\,|\,${BILD_PUNKT.Y})`} /> stellt im Schrägbild den Punkt <Pkt name="P" p={[...BILD_P]} /> dar. Untersuche, welche Punkte im Raum durch <Formel tex="B" /> dargestellt werden. Gib alle diese Punkte an.
        </p>
      </Hinweis>

      <h3>Schritt 1: Beispiele sammeln</h3>
      <Aufgabe12 />

      <h3>Schritt 2: Vermutung aufstellen</h3>
      <p>Überlege, bevor du weiterliest. Notiere deine Vermutung.</p>
      <ol className="auftraege">
        <li>
          <p>
            Wie viele Punkte im Raum werden durch <Formel tex="B" /> dargestellt? Wo liegen sie im Raum, wenn du alle zusammen betrachtest?
          </p>
          <Beobachtung bild={<BildpunktFigur unter={<>Die Punkte mit demselben Bild liegen im Raum hintereinander. Im Schrägbild fallen sie zusammen.</>} />}>
            <p>
              Erwartet wird: Es sind unendlich viele Punkte, denn zu jedem Wert von <Formel tex="x_1" /> gibt es einen passenden Punkt. Alle diese Punkte liegen im Raum auf einer Geraden, wie du im Labor siehst.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Schritt 3: Im Labor untersuchen</h3>
      <p>
        Verändere <Formel tex="x_1" /> mit dem Regler. Die Koordinaten <Formel tex="x_2" /> und <Formel tex="x_3" /> folgen so, dass der Punkt im Schrägbild an derselben Stelle bleibt. Wechsle dann auf die räumliche Ansicht und beobachte, wie sich der Punkt im Raum bewegt.
      </p>
      <Bildpunktlabor />

      <h3>Schritt 4: Auswerten</h3>
      <Auswahlfrage
        nummer="13"
        titel="Wie viele Punkte?"
        optionen={[
          opt('a', 'genau ein Punkt', false, <>Schon in Aufgabe 12 hast du außer <Formel tex="P" /> weitere Punkte mit demselben Bild gefunden.</>),
          opt('b', 'genau zwei Punkte', false, <>In Aufgabe 12 hast du mit <Formel tex="P" /> bereits drei Punkte, und für jeden Wert von <Formel tex="x_1" /> gibt es einen weiteren.</>),
          opt('c', 'unendlich viele Punkte, die auf einer Geraden liegen', true, <>Richtig. Für jeden Wert von <Formel tex="x_1" /> gibt es genau einen Punkt mit diesem Bild.</>),
          opt('d', 'unendlich viele Punkte, die in einer Ebene liegen, aber nicht auf einer Geraden', false, <>Die drei Punkte aus Aufgabe 12 liegen auf einer Geraden, ihre Verbindungsvektoren sind Vielfache voneinander.</>),
        ]}
        erklaerung={
          <>
            Zu jedem Wert von <Formel tex="x_1" /> gehört genau ein Punkt, der im Schrägbild bei <Formel tex="B" /> liegt, denn <Formel tex="x_2" /> und <Formel tex="x_3" /> sind dadurch festgelegt: <Formel tex={t`x_2=X+\frac{x_1}{2}`} /> und <Formel tex={t`x_3=Y+\frac{x_1}{2}`} nach="." /> Das sind unendlich viele Punkte, und sie liegen auf einer Geraden, weil <Formel tex="x_2" /> und <Formel tex="x_3" /> mit <Formel tex="x_1" /> gleichmäßig wachsen.
            <BildpunktFigur unter={<>In der räumlichen Ansicht liegen die Punkte mit demselben Bild auf der orangen Geraden, im Schrägbild fallen sie in einem Punkt zusammen.</>} />
          </>
        }
      >
        <p>Wie viele Punkte im Raum stellt der Bildpunkt <Formel tex="B" /> dar?</p>
      </Auswahlfrage>
      <Aufgabe14 />
      <Hinweis titel="Rückblick">
        <ul>
          <li>Welche Strategie hat dich zur Geraden geführt: Beispiele, das Labor oder die Rechnung?</li>
          <li>Was bedeutet das Ergebnis für eine Zeichnung im Heft? Woran erkennst du, welcher Punkt gemeint ist?</li>
        </ul>
      </Hinweis>
    </Abschnitt>
  );
}
