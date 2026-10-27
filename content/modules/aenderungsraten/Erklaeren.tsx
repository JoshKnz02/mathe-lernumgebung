import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { BILD_SEKANTE_RENN, BILD_TANGENTE_RENN } from './Bilder';
import { RENN } from './daten';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Änderungsraten im Alltag</h3>
      <p>
        Eine <strong>Änderungsrate</strong> sagt, wie schnell sich eine Größe ändert. Sie ist die Änderung der Größe geteilt durch die Zeit, in der die Änderung stattfindet, oder allgemein durch die Änderung der anderen Größe. Du kennst das von der Geschwindigkeit: Sie ist die Änderungsrate des zurückgelegten Wegs.
      </p>
      <table className="tabelle tabelle-kompakt">
        <caption>Größen und ihre Änderungsraten</caption>
        <thead>
          <tr>
            <th scope="col">Größe</th>
            <th scope="col">Änderungsrate</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Weg <Formel tex="s" /> in m</td><td>Geschwindigkeit in m/s</td></tr>
          <tr><td>Geschwindigkeit <Formel tex="v" /> in m/s</td><td>Beschleunigung in m/s²</td></tr>
          <tr><td>Höhe einer Pflanze in cm</td><td>Wachstumsgeschwindigkeit in cm pro Tag</td></tr>
          <tr><td>Kosten <Formel tex="K" /> in €</td><td>Grenzkosten in € pro Mengeneinheit</td></tr>
          <tr><td>Wassermenge in einem Becken in l</td><td>Zufluss in l pro Minute</td></tr>
          <tr><td>Temperatur eines Getränks in °C</td><td>Abkühlungsgeschwindigkeit in °C pro Minute</td></tr>
        </tbody>
      </table>
      <p>
        Man unterscheidet zwei Arten: die <strong>mittlere Änderungsrate</strong> auf einem Intervall und die <strong>momentane Änderungsrate</strong> zu einem bestimmten Zeitpunkt. Beim Auto entspricht das der Durchschnittsgeschwindigkeit auf einer Strecke und der Anzeige des Tachos in einem Augenblick.
      </p>

      <h3>Mittlere Änderungsrate</h3>
      <p>
        Ein Elektro-Rennwagen fährt aus dem Stand an. Für die ersten 8 Sekunden gilt näherungsweise <Formel tex="s(t)=3t^2" nach="," /> dabei ist <Formel tex="t" /> die Zeit in Sekunden und <Formel tex="s(t)" /> der zurückgelegte Weg in Metern. Welche Durchschnittsgeschwindigkeit hat der Wagen zwischen <Formel tex="t=3" /> und <Formel tex="t=7" nach="?" />
      </p>
      <p>
        Du legst durch die Punkte <Formel tex="P(3\,|\,27)" /> und <Formel tex="Q(7\,|\,147)" /> auf dem Schaubild eine Gerade, die <strong>Sekante</strong>. Ihre Steigung ist die mittlere Änderungsrate.
      </p>
      <Hinweis art="merksatz" titel="Mittlere Änderungsrate und Differenzenquotient">
        <p>
          Die <strong>mittlere Änderungsrate</strong> einer Funktion <Formel tex="f" /> zwischen den Stellen <Formel tex="x_0" /> und <Formel tex="x" /> ist die Steigung der Sekante durch <Formel tex="P(x_0\,|\,f(x_0))" /> und <Formel tex="Q(x\,|\,f(x))" nach=":" />
        </p>
        <Formel anzeige tex={t`\frac{\Delta y}{\Delta x}=\frac{f(x)-f(x_0)}{x-x_0}`} />
        <p>Dieser Bruch heißt <strong>Differenzenquotient</strong>.</p>
      </Hinweis>
      <Bild
        daten={BILD_SEKANTE_RENN}
        unter={
          <>
            Orange: <Formel tex="K_s" nach="," /> blau: die Sekante durch <Formel tex="P" /> und <Formel tex="Q" nach="," /> grün: das Steigungsdreieck mit <Formel tex={t`\Delta t=4`} /> und <Formel tex={t`\Delta s=120`} nach="." />
          </>
        }
      />
      <p>Für den Rennwagen ergibt sich:</p>
      <Formel anzeige tex={t`\bar v=\frac{\Delta s}{\Delta t}=\frac{s(7)-s(3)}{7-3}=\frac{147-27}{4}=30\,\frac{\text{m}}{\text{s}}`} nach="." />
      <p>
        Das sind <Formel tex={t`30\cdot 3{,}6=${RENN.kmh}\,\frac{\text{km}}{\text{h}}`} nach="." /> Die Einheit der Änderungsrate ist immer die Einheit des Funktionswerts geteilt durch die Einheit der Stelle.
      </p>

      <h3>Momentane Änderungsrate</h3>
      <p>
        Der Tacho zeigt nicht die Durchschnittsgeschwindigkeit, sondern die Geschwindigkeit in einem Augenblick, die <strong>Momentangeschwindigkeit</strong>. Sie ist die momentane Änderungsrate des Wegs. Am Schaubild ist sie die Steigung der <strong>Tangente</strong>, das ist die Gerade, die sich im Punkt <Formel tex="P" /> an das Schaubild anschmiegt.
      </p>
      <Hinweis titel="Zeichnerisch bestimmen">
        <ol className="liste">
          <li>Lege die Tangente im Punkt <Formel tex="P" /> an das Schaubild an.</li>
          <li>Wähle auf der Tangente einen zweiten gut ablesbaren Punkt <Formel tex="B" nach="." /></li>
          <li>Lies <Formel tex={t`\Delta t`} /> und <Formel tex={t`\Delta s`} /> ab und bilde den Quotienten.</li>
        </ol>
        Das Anlegen der Tangente ist ungenau. Das Ergebnis ist deshalb nur eine <strong>Näherung</strong>.
      </Hinweis>
      <Bild
        daten={BILD_TANGENTE_RENN}
        unter={
          <>
            Tangente in <Formel tex="P(3\,|\,27)" nach="." /> Auf ihr liegt <Formel tex="B(5\,|\,63)" nach="." /> Mit <Formel tex={t`\Delta t=2`} /> und <Formel tex={t`\Delta s=36`} /> ist die Steigung <Formel tex={t`\frac{36}{2}=18`} nach="," /> also etwa <Formel tex={t`18\,\frac{\text{m}}{\text{s}}`} nach="." />
          </>
        }
      />
      <p>
        Die Tangentensteigung ist damit die Momentangeschwindigkeit zum Zeitpunkt <Formel tex="t=3" nach="." /> Sie ist hier kleiner als die mittlere Geschwindigkeit von <Formel tex={t`30\,\frac{\text{m}}{\text{s}}`} /> auf dem Intervall <Formel tex="[3;\,7]" nach="." /> Warum das so ist und wie man die momentane Änderungsrate genau berechnet, findest du im nächsten Abschnitt heraus.
      </p>
    </Abschnitt>
  );
}
