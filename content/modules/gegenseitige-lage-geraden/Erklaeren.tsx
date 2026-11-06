import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { lageZweier } from '@/lib/gerade';
import { punktTeX } from '@/lib/geradenhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_ERKLAEREN, RAUM_LAGE_IDENTISCH, RAUM_LAGE_PARALLEL, RAUM_LAGE_SCHNEIDEND, RAUM_LAGE_WINDSCHIEF } from './Bilder';
import { ERKLAEREN } from './daten';
import { gl, glSchmal, gleichsetzBlock, loesungsweg, schnittpunktRechnung, systemBlock } from './rechenhilfen';

export function Erklaeren() {
  const e = ERKLAEREN;
  const w = loesungsweg(e.g, e.h);
  const S = lageZweier(e.g, e.h).schnittpunkt!;
  const sr = schnittpunktRechnung(e.g, w.t, 'S', punktTeX('S', S));
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Zwei Geraden im Raum können sich schneiden, nebeneinander herlaufen, aufeinanderliegen oder aneinander vorbeigehen. Wie du eine Gerade mit einer Parametergleichung beschreibst und prüfst, ob ein Punkt auf ihr liegt, steht im Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>. Hier geht es darum, wie zwei Geraden zueinander liegen.
      </p>

      <h3>Die vier Lagen</h3>
      <p>Zwei Geraden <Formel tex="g" /> und <Formel tex="h" /> haben im Raum genau eine von vier Lagen zueinander. In den Bildern ist <Formel tex="g" /> schwarz und <Formel tex="h" /> orange, beide durchgezogen und mit g und h beschriftet.</p>
      <p><strong>Identisch</strong>: <Formel tex="g" /> und <Formel tex="h" /> sind dieselbe Gerade, alle ihre Punkte sind gemeinsame Punkte. Die Gleichungen können trotzdem verschieden aussehen (siehe „mehrere Gleichungen für dieselbe Gerade“ im Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>).</p>
      <Figur spec={RAUM_LAGE_IDENTISCH} unter={<>Identische Geraden: Die orange Gerade <Formel tex="h" /> ist dick gezeichnet und liegt genau unter der schwarzen Geraden <Formel tex="g" nach="." /></>} />
      <p><strong>Parallel</strong>: <Formel tex="g" /> und <Formel tex="h" /> verlaufen in dieselbe Richtung und haben keinen gemeinsamen Punkt.</p>
      <Figur spec={RAUM_LAGE_PARALLEL} unter={<>Parallele Geraden: gleiche Richtung, die Geraden sind gegeneinander verschoben.</>} />
      <p><strong>Schneiden sich in einem Punkt</strong>: <Formel tex="g" /> und <Formel tex="h" /> haben genau einen gemeinsamen Punkt, den <strong>Schnittpunkt</strong> <Formel tex="S" nach="." /></p>
      <Figur spec={RAUM_LAGE_SCHNEIDEND} unter={<>Sich schneidende Geraden. Der Schnittpunkt ist als Punkt markiert.</>} />
      <p><strong>Windschief</strong>: <Formel tex="g" /> und <Formel tex="h" /> haben keinen gemeinsamen Punkt und verlaufen nicht in dieselbe Richtung. Sie gehen aneinander vorbei, ähnlich wie eine Straße und eine Brücke darüber, die nicht in dieselbe Richtung führt.</p>
      <Figur spec={RAUM_LAGE_WINDSCHIEF} unter={<>Windschiefe Geraden: Sie schneiden sich nicht und sind nicht parallel. Über dem Bild kannst du zur räumlichen Ansicht wechseln und das Bild drehen.</>} />
      <Hinweis titel="Vereinbarung">
        „Parallel“ heißt wie bei einer Geraden und einer Koordinatenebene im Modul <Modulverweis modul="spurpunkte-besondere-lage">Spurpunkte und besondere Lage</Modulverweis>: ohne gemeinsamen Punkt. Identische Geraden nennen wir „identisch“ und nicht „parallel“. So trennt es auch der Bildungsplan. Dann gehört jedes Paar von Geraden zu genau einer der vier Lagen.
      </Hinweis>
      <p>Wie du die Lage erkennst, findest du im Abschnitt „Entdecken“ heraus. Dafür brauchst du zuerst das Gleichsetzen, mit dem du gemeinsame Punkte suchst.</p>

      <h3>Zwei Geraden mit zwei Parametern</h3>
      <p>
        Die beiden Geraden schreiben wir <Formel tex={t`g:\ \vec{x}=\vec{p}+t\cdot\vec{u}`} /> und <Formel tex={t`h:\ \vec{x}=\vec{q}+s\cdot\vec{v}`} nach="." /> Die Stützvektoren sind <Formel tex={t`\vec{p}`} /> und <Formel tex={t`\vec{q}`} nach="," /> die Richtungsvektoren <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} nach="." /> Die Geraden bekommen <strong>verschiedene Parameter</strong>, <Formel tex="t" /> für <Formel tex="g" /> und <Formel tex="s" /> für <Formel tex="h" nach="." /> Ein gemeinsamer Punkt gehört auf <Formel tex="g" /> meist zu einem anderen Parameterwert als auf <Formel tex="h" nach="." /> Mit demselben Parameter in beiden Gleichungen würdest du nur Punkte finden, die beide Geraden beim gleichen Parameterwert erreichen.
      </p>

      <h3>Gemeinsame Punkte durch Gleichsetzen</h3>
      <p>
        Ein gemeinsamer Punkt liegt auf <Formel tex="g" /> und auf <Formel tex="h" nach="." /> Es muss also Werte <Formel tex="t" /> und <Formel tex="s" /> geben mit
      </p>
      <Formel anzeige tex={t`\vec{p}+t\cdot\vec{u}=\vec{q}+s\cdot\vec{v}`} />
      <p>
        Das ist eine Gleichung für Vektoren und steht für drei Gleichungen, eine für jede Koordinate. Unbekannt sind nur <Formel tex="t" /> und <Formel tex="s" nach="." /> Es sind also drei Gleichungen für zwei Unbekannte, ein überbestimmtes Gleichungssystem. Zur Lösbarkeit solcher Systeme siehe das Modul <Modulverweis modul="loesbarkeit-lgs">Lösbarkeit linearer Gleichungssysteme</Modulverweis>, zum Lösen das Modul <Modulverweis modul="gauss-algorithmus">Gauß-Algorithmus</Modulverweis>. Hier lösen wir durch Einsetzen.
      </p>
      <ol>
        <li>Gleichsetzen und nach Koordinaten aufschreiben (drei Gleichungen).</li>
        <li>Zwei der Gleichungen nach <Formel tex="t" /> und <Formel tex="s" /> lösen.</li>
        <li>Die Werte in die dritte Gleichung einsetzen (Probe).</li>
        <li>Zum Schnittpunkt <Formel tex="t" /> in <Formel tex="g" /> einsetzen (oder <Formel tex="s" /> in <Formel tex="h" nach=")." /></li>
      </ol>

      <h3>Beispiel</h3>
      <p>Gegeben sind die beiden Geraden</p>
      <Umbruchformel tex={gl(e.g)} schmal={glSchmal(e.g)} />
      <Umbruchformel tex={gl(e.h, 'h', 's')} schmal={glSchmal(e.h, 'h', 's')} />
      <p><strong>1. Gleichsetzen</strong>, Koordinate für Koordinate:</p>
      <Formel anzeige tex={gleichsetzBlock(e.g, e.h)} />
      <p>Alle <Formel tex="t" /> und <Formel tex="s" /> auf die linke Seite, die Zahlen auf die rechte:</p>
      <Formel anzeige tex={systemBlock(e.g, e.h)} />
      <p><strong>2. Zwei Gleichungen lösen.</strong> Gleichung <Formel tex={`${['\\mathrm{I}', '\\mathrm{II}', '\\mathrm{III}'][w.gewaehlt.zeile]}`} /> wird nach <Formel tex={w.gewaehlt.var} /> umgestellt und in die andere Gleichung eingesetzt:</p>
      <Formel anzeige tex={`\\begin{gathered}${w.umgestellt}\\\\${w.eingesetzt.eingesetzt}\\\\${w.eingesetzt.zusammen}\\\\${w.eingesetzt.ergebnis}\\\\${w.ersteUnbekannte}\\end{gathered}`} />
      <p><strong>3. Probe mit der dritten Gleichung</strong> (<Formel tex={t`\mathrm{III}`} nach=")." /> Links steht <Formel tex={t`p_3+t\cdot u_3`} nach="," /> rechts <Formel tex={t`q_3+s\cdot v_3`} nach=":" /></p>
      <Formel anzeige tex={`\\begin{gathered}${w.probe.links}\\\\${w.probe.rechts}\\end{gathered}`} />
      <p>Beide Seiten sind gleich, die dritte Gleichung ist erfüllt.</p>
      <p><strong>4. Schnittpunkt.</strong> Mit <Formel tex={`t=${w.t}`} /> in <Formel tex="g" nach=":" /></p>
      <Umbruchformel tex={`${sr.tex},\\ \\ ${punktTeX('S', S)}`} schmal={sr.schmal} />
      <p>Zur Kontrolle liefert <Formel tex={`s=${w.s}`} /> in <Formel tex="h" /> denselben Punkt.</p>
      <Figur
        spec={RAUM_ERKLAEREN}
        unter={<>Die Geraden <Formel tex="g" /> und <Formel tex="h" /> mit ihren Stützpunkten <Formel tex={punktTeX('P', e.g.p)} /> und <Formel tex={punktTeX('Q', e.h.p)} /> schneiden sich im Punkt <Formel tex={punktTeX('S', S)} nach="." /></>}
      />
      <p>Was geschieht, wenn sich die Gleichungen nicht erfüllen lassen, und woran du die anderen Lagen erkennst, findest du im Abschnitt „Entdecken“ heraus.</p>
    </Abschnitt>
  );
}
