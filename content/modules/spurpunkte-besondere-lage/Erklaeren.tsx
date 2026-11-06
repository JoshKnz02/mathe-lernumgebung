import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_ERKLAEREN } from './Bilder';
import { ERKLAEREN, SPUR_TEX } from './daten';
import { spurZeile } from './Labor';

const S12 = <Formel tex={SPUR_TEX.e12} />;
const S13 = <Formel tex={SPUR_TEX.e13} />;
const S23 = <Formel tex={SPUR_TEX.e23} />;

export function Erklaeren() {
  const e = ERKLAEREN;
  const zeile = (eb: 'e12' | 'e13' | 'e23') => <Umbruchformel tex={spurZeile(e.g.p, e.g.u, eb).replace(/\\begin\{gathered\}|\\end\{gathered\}/g, '').replace(/\\\\/g, '\\ ,\\ ')} schmal={spurZeile(e.g.p, e.g.u, eb)} />;
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        In der Ebene hat eine Gerade Schnittpunkte mit den Koordinatenachsen. Im Raum durchstößt eine Gerade die Koordinatenebenen. Wie du eine Gerade im Raum mit einer Parametergleichung beschreibst, steht im Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>.
      </p>

      <h3>Spurpunkte</h3>
      <p>
        Ein <strong>Spurpunkt</strong> einer Geraden ist ein Punkt, in dem sie eine Koordinatenebene durchstößt (auch Durchstoßpunkt genannt). Es gibt drei Koordinatenebenen, also sind drei Spurpunkte gemeint:
      </p>
      <ul className="liste-ohne-zahl" aria-label="Die drei Spurpunkte">
        <li>{S12}: der Punkt in der <Formel tex="x_1x_2" />-Ebene, dort ist <Formel tex="x_3=0" nach="." /></li>
        <li>{S13}: der Punkt in der <Formel tex="x_1x_3" />-Ebene, dort ist <Formel tex="x_2=0" nach="." /></li>
        <li>{S23}: der Punkt in der <Formel tex="x_2x_3" />-Ebene, dort ist <Formel tex="x_1=0" nach="." /></li>
      </ul>
      <Hinweis titel="Vereinbarung">
        Liegt die Gerade ganz in einer Koordinatenebene, gibt es in dieser Ebene keinen einzelnen Spurpunkt, denn alle Punkte der Geraden liegen dort. Das kommt im Abschnitt „Entdecken“ vor.
      </Hinweis>

      <h3>Spurpunkte berechnen</h3>
      <p>
        Du setzt in der Gleichung die Koordinate, die in der Ebene 0 ist, gleich 0, löst nach <Formel tex="t" /> auf und setzt <Formel tex="t" /> in die Gleichung ein:
      </p>
      <ol>
        <li>Koordinate der Ebene gleich 0 setzen.</li>
        <li>Die Gleichung nach <Formel tex="t" /> auflösen.</li>
        <li>Diesen Wert in die Geradengleichung einsetzen. Das liefert den Spurpunkt.</li>
      </ol>
      <p>
        Beispiel: <Formel tex={t`g:\ \vec{x}=${spalte(e.g.p)}+t\cdot${spalte(e.g.u)}`} nach="." /> Die drei Spurpunkte:
      </p>
      <p><strong>{S12}</strong> in der <Formel tex="x_1x_2" />-Ebene:</p>
      {zeile('e12')}
      <p><strong>{S13}</strong> in der <Formel tex="x_1x_3" />-Ebene:</p>
      {zeile('e13')}
      <p><strong>{S23}</strong> in der <Formel tex="x_2x_3" />-Ebene:</p>
      {zeile('e23')}
      <Figur
        spec={RAUM_ERKLAEREN}
        unter={
          <>
            Die Gerade <Formel tex="g" /> durchstößt die Koordinatenebenen in <Formel tex={punktTeX('S_{12}', e.S12)} nach="," /> <Formel tex={punktTeX('S_{13}', e.S13)} /> und <Formel tex={punktTeX('S_{23}', e.S23)} nach="." /> Die Koordinatenebenen sind durchsichtig gezeichnet (<Formel tex="x_1x_2" /> hellblau, <Formel tex="x_1x_3" /> grün, <Formel tex="x_2x_3" /> gelborange). Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.
          </>
        }
      />

      <h3>Eine Gerade im Schrägbild zeichnen</h3>
      <p>
        Mit den Spurpunkten lässt sich eine Gerade im Schrägbild zeichnen: Trage die Spurpunkte ein, jeder liegt in seiner Koordinatenebene. Verbinde sie mit einer Linie und verlängere die Linie über die Spurpunkte hinaus, denn die Gerade ist unbegrenzt. Wie du Punkte im Schrägbild einträgst (eine Einheit auf der <Formel tex="x_1" />-Achse ist eine Kästchendiagonale nach links unten), steht im Modul <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis>.
      </p>

      <h3>Besondere Lage im Koordinatensystem</h3>
      <p>Für Geraden im Koordinatensystem gelten diese Bezeichnungen:</p>
      <ul className="liste-ohne-zahl" aria-label="Besondere Lagen">
        <li><strong>durch den Ursprung</strong>: Der Ursprung <Formel tex={t`O(0\,|\,0\,|\,0)`} /> liegt auf der Geraden.</li>
        <li><strong>auf einer Koordinatenachse</strong>: Die Gerade stimmt mit einer der drei Achsen überein.</li>
        <li><strong>in einer Koordinatenebene</strong>: Alle Punkte der Geraden liegen in der Ebene.</li>
        <li><strong>parallel zu einer Koordinatenebene</strong>: Die Gerade und die Ebene haben keinen gemeinsamen Punkt. Liegt die Gerade in der Ebene, heißt das nicht „parallel“. Das ist eine Vereinbarung, die auch der Bildungsplan macht, denn er trennt „liegt in“ und „parallel“.</li>
        <li><strong>parallel zu einer Koordinatenachse</strong>: Die Gerade hat die Richtung der Achse, liegt aber nicht auf ihr.</li>
      </ul>
      <p>
        Woran du diese Lagen an der Gleichung erkennst und wie viele Spurpunkte eine Gerade hat, findest du im Abschnitt „Entdecken“ heraus.
      </p>
    </Abschnitt>
  );
}
