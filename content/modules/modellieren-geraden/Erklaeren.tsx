import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_BAHN, RAUM_PARALLEL, RAUM_ZENTRAL } from './Bilder';
import { HUBSCHRAUBER, SCHATTEN, WAND, hausPunkte } from './daten';

export function Erklaeren() {
  const h = HUBSCHRAUBER;
  const H = hausPunkte(SCHATTEN.haus);
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Beim <strong>Modellieren</strong> wird eine Situation aus dem Alltag vereinfacht und mit Vektoren beschrieben: Ein Hubschrauber wird zu einem Punkt, ein Lichtstrahl zu einer Geraden. Du rechnest im Modell und deutest das Ergebnis danach wieder in der Situation. Dazu gehört auch die Frage, ob das Ergebnis dort überhaupt Sinn hat. In diesem Modul gibt es zwei Anwendungen: <strong>Bewegungen</strong> und <strong>Schatten</strong>. Die Geradengleichung kennst du aus dem Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>, die gegenseitige Lage von Geraden aus dem Modul <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>.
      </p>

      <h3>Bewegungen</h3>
      <p>
        Ein Hubschrauber <Formel tex="H" /> startet im Punkt <Formel tex="P" /> und fliegt geradlinig mit gleichbleibender Geschwindigkeit. Eine Längeneinheit entspricht einem Kilometer. Die <strong>Zeit</strong> <Formel tex="t" /> wird ab dem Beobachtungsbeginn in Stunden gemessen, es gilt <Formel tex={t`t\ge 0`} nach="." /> Zur Zeit <Formel tex="t" /> ist <Formel tex="H" /> im Punkt <Formel tex="X(t)" nach="." /> Der Hubschrauber wird dabei als Punkt betrachtet (<strong>Punktmodell</strong>).
      </p>
      <p>
        Beispiel: <Formel tex="H" /> startet in <Formel tex={punktTeX('P', h.start)} /> und fliegt mit dem <strong>Tempo</strong> <Formel tex={t`60\,\frac{\text{km}}{\text{h}}`} /> in die Richtung des Vektors <Formel tex={t`\vec{u}=${spalte(h.richtung)}`} nach="." /> Die <strong>Bahn</strong> von <Formel tex="H" /> ist die Gerade <Formel tex="g" /> durch <Formel tex="P" /> in Flugrichtung, die Bewegung selbst nur der Teil mit <Formel tex={t`t\ge 0`} nach="." />
      </p>
      <Figur spec={RAUM_BAHN} unter={<>Die Bahn <Formel tex="g" /> des Hubschraubers <Formel tex="H" /> ab dem Startpunkt <Formel tex={punktTeX('P', h.start)} nach="." /> Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.</>} />
      <p>
        Die <strong>Bewegungsgleichung</strong> hat die Form einer Geradengleichung, der Parameter ist die Zeit:
      </p>
      <Formel anzeige tex={t`g:\ \vec{x}=\vec{p}+t\cdot\vec{v}`} />
      <p>
        Der <strong>Geschwindigkeitsvektor</strong> <Formel tex={t`\vec{v}`} /> gibt an, um welchen Vektor sich <Formel tex="H" /> in einer Stunde verschiebt. Sein Betrag <Formel tex={t`|\vec{v}|`} /> ist das Tempo. Der Richtungsvektor <Formel tex={t`\vec{u}`} /> legt dagegen nur die Richtung fest.
      </p>
      <p>
        Fliegt ein zweiter Hubschrauber <Formel tex="R" /> auf einer anderen Bahn, kann man fragen:
      </p>
      <ul className="liste-ohne-zahl" aria-label="Fragen zu zwei Bewegungen">
        <li>Wo sind beide zur Zeit <Formel tex="t" nach="?" /></li>
        <li>Schneiden sich die beiden <strong>Bahnen</strong> (die Geraden haben einen gemeinsamen Punkt)?</li>
        <li>Kommt es zu einer <strong>Kollision</strong>? Im Punktmodell heißt das: Beide sind zur <em>selben Zeit</em> am <em>selben Ort</em>.</li>
        <li>Wie groß ist der <strong>Abstand zur selben Zeit</strong> <Formel tex="d(t)" nach="?" /> Das ist die Länge der Strecke zwischen den Orten <Formel tex={t`X_H(t)`} /> und <Formel tex={t`X_R(t)`} /> zur Zeit <Formel tex="t" nach="." /></li>
      </ul>
      <p>Welche dieser Fragen dasselbe meinen und welche nicht, findest du im Abschnitt „Entdecken: Bewegung“ heraus. Den Abstand eines Punkts von einer Geraden kennst du aus dem Modul <Modulverweis modul="abstaende-geraden">Abstand Punkt und Gerade, paralleler Geraden</Modulverweis>.</p>

      <h3>Schatten</h3>
      <p>
        Ein Schatten entsteht dort, wo ein Lichtstrahl, der an einem Gegenstand vorbeigeht, auf eine Fläche trifft. Wir betrachten ein Haus im Raum und den Schatten, den es auf eine senkrechte <strong>Wand</strong> und auf den <strong>Boden</strong> davor wirft. Im Modell sind die Ecken des Hauses Punkte, die Lichtstrahlen Geraden, der Boden ist die <Formel tex="x_1x_2" />-Ebene mit <Formel tex="x_3=0" /> und die Wand die Ebene <Formel tex={t`x_2=${WAND}`} nach="," /> parallel zur <Formel tex="x_1x_3" />-Ebene. Der Schattenpunkt eines Punkts ist der Schnittpunkt seines Lichtstrahls mit der Wand, wie bei einem Spurpunkt im Modul <Modulverweis modul="spurpunkte-besondere-lage">Spurpunkte und Besondere Lage</Modulverweis>. In den Bildern liegt der Schatten in zwei grauen Flächen (auf der Wand und auf dem Boden zwischen Haus und Wand), die Lichtstrahlen sind orange und gestrichelt. Es gibt zwei Arten von Licht:
      </p>
      <p>
        <strong>Paralleles Licht</strong> (Sonne): Alle Lichtstrahlen haben dieselbe Richtung <Formel tex={t`\vec{v}`} nach="." /> Der Strahl durch den Punkt <Formel tex="X" /> ist <Formel tex={t`g:\ \vec{x}=\vec{x}_X+t\cdot\vec{v}`} nach="." /> Der Schattenpunkt heißt <Formel tex="X'" nach="." /> Man spricht von <strong>Parallelprojektion</strong>.
      </p>
      <p>
        <strong>Punktförmige Lichtquelle</strong> (Lampe): Alle Strahlen gehen von der Lichtquelle <Formel tex="L" /> aus. Der Strahl durch <Formel tex="X" /> ist <Formel tex={t`g:\ \vec{x}=\vec{l}+s\cdot\overrightarrow{LX}`} nach="." /> Der Schattenpunkt heißt <Formel tex="X''" nach="." /> Man spricht von <strong>Zentralprojektion</strong>.
      </p>
      <p>
        Beispiel: Ein Haus ist ein Quader mit Pyramidendach, eine Längeneinheit sind 3 Meter. Die Grundfläche hat die Ecken <Formel tex={punktTeX('A', H.grund[0]!)} nach="," /> <Formel tex={punktTeX('B', H.grund[1]!)} nach="," /> <Formel tex={punktTeX('C', H.grund[2]!)} /> und <Formel tex={punktTeX('D', H.grund[3]!)} nach="," /> darüber liegen die Traufecken <Formel tex="E" nach="," /> <Formel tex="F" nach="," /> <Formel tex="G" /> und <Formel tex="H" /> in der Höhe 2, die Dachspitze ist <Formel tex={punktTeX('I', H.I)} nach="." /> Hinter dem Haus steht die Wand. Tagsüber kommt das Licht der Sonne mit der Richtung <Formel tex={t`\vec{v}=${spalte(SCHATTEN.v)}`} nach="," /> abends strahlt eine Lampe im Punkt <Formel tex={punktTeX('J', SCHATTEN.J)} nach="." /> Die Sonne ist so weit weg, dass ihre Strahlen alle dieselbe Richtung haben, die Lampe ist ein Punkt, von dem alle Strahlen ausgehen.
      </p>
      <Figur spec={RAUM_PARALLEL} unter={<>Paralleles Licht (Sonne): Die orangen Strahlen laufen durch die oberen Punkte des Hauses zur Wand. Der Schatten besteht aus zwei grauen Flächen, auf der Wand und auf dem Boden zwischen Haus und Wand. <Formel tex="E'" /> und <Formel tex="I'" /> sind die Schattenpunkte von <Formel tex="E" /> und <Formel tex="I" nach="." /> Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.</>} />
      <Figur spec={RAUM_ZENTRAL} unter={<>Punktförmige Lichtquelle (Lampe) <Formel tex="J" nach=":" /> Die orangen Strahlen gehen von <Formel tex="J" /> durch die oberen Punkte des Hauses zur Wand. <Formel tex={t`E''`} /> und <Formel tex={t`I''`} /> sind die Schattenpunkte von <Formel tex="E" /> und <Formel tex="I" nach="." /></>} />
      <p>Wie du die Schattenpunkte berechnest und wann ein Schnittpunkt wirklich ein Schatten ist, findest du im Abschnitt „Entdecken: Schatten“ heraus.</p>

      <Hinweis titel="Schreibweise">
        Die Zeit <Formel tex="t" /> ist immer in Stunden angegeben, das Tempo in <Formel tex={t`\frac{\text{km}}{\text{h}}`} nach="." /> Zur Umrechnung: 1 Minute ist <Formel tex={t`\frac{1}{60}`} /> Stunde, 3 Minuten sind <Formel tex={t`0{,}05`} /> Stunden. Bei zwei Bewegungen heißt die Bahn des ersten Objekts <Formel tex="g" /> und die des zweiten <Formel tex="h" nach="." /> Beide Bewegungsgleichungen verwenden dieselbe Zeit <Formel tex="t" nach="." /> Den Schattenpunkt von <Formel tex="X" /> bei Parallelprojektion schreibt man <Formel tex="X'" nach="," /> bei Zentralprojektion <Formel tex="X''" nach="." />
      </Hinweis>
    </Abschnitt>
  );
}
