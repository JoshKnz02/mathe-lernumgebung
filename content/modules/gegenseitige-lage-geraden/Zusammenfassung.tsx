import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { lageZweier } from '@/lib/gerade';
import { punktTeX } from '@/lib/geradenhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_ZUSAMMENFASSUNG } from './Bilder';
import { ZUSAMMENFASSUNG } from './daten';
import { gl, glSchmal, loesungsweg, schnittpunktRechnung, systemZeilen } from './rechenhilfen';

/** Mehrere kurze Zeilen: auf breiten Fenstern in einer Zeile, schmal untereinander. */
const Zeilen = ({ z }: { z: string[] }) => <Umbruchformel tex={z.join(',\\ \\ ')} schmal={`\\begin{gathered}${z.join('\\\\')}\\end{gathered}`} />;

export function Zusammenfassung() {
  const z = ZUSAMMENFASSUNG;
  const w = loesungsweg(z.g, z.h);
  const S = lageZweier(z.g, z.h).schnittpunkt!;
  const k = z.h.u[0]! / z.g.u[0]!;
  const sr = schnittpunktRechnung(z.g, w.t, 'S', punktTeX('S', S));
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Die vier Lagen</h3>
      <Hinweis art="merksatz" titel="Lage zweier Geraden im Raum">
        <ul className="liste-ohne-zahl" aria-label="Die vier Lagen und ihre Kennzeichen">
          <li><strong>identisch</strong>: Die Richtungsvektoren sind Vielfache und der Stützpunkt von <Formel tex="h" /> liegt auf <Formel tex="g" nach="." /> Alle Punkte sind gemeinsam, das Gleichungssystem hat unendlich viele Lösungen.</li>
          <li><strong>parallel</strong>: Die Richtungsvektoren sind Vielfache, der Stützpunkt von <Formel tex="h" /> liegt nicht auf <Formel tex="g" nach="." /> Es gibt keinen gemeinsamen Punkt, das System hat keine Lösung.</li>
          <li><strong>schneiden sich in einem Punkt</strong>: Die Richtungsvektoren sind keine Vielfachen, das System hat genau eine Lösung. Sie liefert den Schnittpunkt.</li>
          <li><strong>windschief</strong>: Die Richtungsvektoren sind keine Vielfachen, das System hat keine Lösung. Es gibt keinen gemeinsamen Punkt und die Geraden sind nicht parallel.</li>
        </ul>
        „Parallel“ heißt ohne gemeinsamen Punkt, identische Geraden sind nicht parallel. Windschiefe Geraden gibt es nur im Raum, in einer Ebene schneiden sich Geraden, die nicht parallel und nicht identisch sind.
      </Hinweis>
      <Hinweis art="merksatz" titel="So bestimmst du die Lage">
        <ol>
          <li>Vergleiche die Richtungsvektoren: Ist <Formel tex={t`\vec{v}`} /> ein Vielfaches von <Formel tex={t`\vec{u}`} nach="?" /></li>
          <li>Wenn ja: Punktprobe mit dem Stützpunkt <Formel tex="Q" /> von <Formel tex="h" nach=":" /> Ein <Formel tex="t" /> muss alle drei Koordinaten erfüllen. Liegt <Formel tex="Q" /> auf <Formel tex="g" nach="," /> sind die Geraden identisch, sonst parallel. Die Punktprobe steht im Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>.</li>
          <li>Wenn nein: Gleichsetzen mit verschiedenen Parametern <Formel tex="t" /> und <Formel tex="s" nach="." /> Zwei der drei Gleichungen lösen, die dritte prüfen. Zum Lösen und zur Lösbarkeit siehe <Modulverweis modul="gauss-algorithmus">Gauß-Algorithmus</Modulverweis> und <Modulverweis modul="loesbarkeit-lgs">Lösbarkeit linearer Gleichungssysteme</Modulverweis>.</li>
          <li>Ist die dritte Gleichung erfüllt, schneiden sich die Geraden. Den Schnittpunkt erhältst du mit <Formel tex="t" /> in <Formel tex="g" /> (Kontrolle: <Formel tex="s" /> in <Formel tex="h" nach=")." /> Sonst sind die Geraden windschief.</li>
        </ol>
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>Gegeben sind</p>
      <Umbruchformel tex={gl(z.g)} schmal={glSchmal(z.g)} />
      <Umbruchformel tex={gl(z.h, 'h', 's')} schmal={glSchmal(z.h, 'h', 's')} />
      <p>
        <strong>Richtungsvektoren:</strong> Die ersten Koordinaten (<Formel tex={`${z.g.u[0]}`} /> und <Formel tex={`${z.h.u[0]}`} nach=")" /> würden den Faktor <Formel tex={`k=${k}`} /> verlangen. Dann müsste die zweite Koordinate von <Formel tex={t`\vec{v}`} /> gleich <Formel tex={`${k * z.g.u[1]!}`} /> sein, sie ist aber <Formel tex={`${z.h.u[1]}`} nach="." /> Die Richtungsvektoren sind keine Vielfachen.
      </p>
      <p><strong>Gleichsetzen:</strong></p>
      <Zeilen z={w.zeilen} />
      <p><strong>Lösen</strong> durch Einsetzen:</p>
      <Zeilen z={[w.umgestellt, w.eingesetzt.eingesetzt, w.eingesetzt.zusammen, w.eingesetzt.ergebnis, w.ersteUnbekannte]} />
      <p><strong>Probe</strong> mit der dritten Gleichung:</p>
      <Zeilen z={[w.probe.links, w.probe.rechts]} />
      <p>Beide Seiten sind gleich: Die Geraden <strong>schneiden sich</strong>. <strong>Schnittpunkt</strong> mit <Formel tex={`t=${w.t}`} /> in <Formel tex="g" nach=":" /></p>
      <Umbruchformel tex={`${sr.tex},\\ \\ ${punktTeX('S', S)}`} schmal={sr.schmal} />
      <Figur
        spec={RAUM_ZUSAMMENFASSUNG}
        unter={<>Die Geraden <Formel tex="g" /> und <Formel tex="h" /> mit den Stützpunkten <Formel tex={punktTeX('P', z.g.p)} /> und <Formel tex={punktTeX('Q', z.h.p)} /> schneiden sich im Punkt <Formel tex={punktTeX('S', S)} nach="." /></>}
      />
      <p>Hätte die dritte Gleichung nicht gestimmt, wären die Geraden windschief gewesen.</p>

      <h3>Aufgaben mit Parameter und mit vorgegebener Lage</h3>
      <Hinweis art="merksatz" titel="Ein Parameter a in einer Geraden">
        <strong>Parallel</strong>: Die Richtungsvektoren als Vielfache ansetzen, <Formel tex={t`\vec{u}=k\cdot\vec{v}`} nach="," /> <Formel tex="k" /> aus einer Koordinate ohne <Formel tex="a" /> bestimmen, danach <Formel tex="a" nach="." /> Dann mit der Punktprobe prüfen, ob die Geraden parallel oder identisch sind. <strong>Schneiden sich</strong>: Die zwei Gleichungen ohne <Formel tex="a" /> lösen, die Werte für <Formel tex="t" /> und <Formel tex="s" /> in die dritte Gleichung einsetzen und daraus <Formel tex="a" /> bestimmen. Für jeden anderen Wert sind die Geraden windschief, sofern die Richtungsvektoren keine Vielfachen sind.
      </Hinweis>
      <Hinweis art="merksatz" titel="Gerade mit vorgegebener Lage angeben">
        <ul className="liste-ohne-zahl" aria-label="Geraden mit vorgegebener Lage angeben">
          <li><strong>parallel</strong> zu <Formel tex="g" nach=":" /> Richtungsvektor von <Formel tex="g" /> (oder ein Vielfaches), Stützpunkt nicht auf <Formel tex="g" nach="." /></li>
          <li><strong>identisch</strong> mit <Formel tex="g" nach=":" /> Richtungsvektor ein Vielfaches, Stützpunkt ein Punkt von <Formel tex="g" nach="." /></li>
          <li><strong>schneidet</strong> <Formel tex="g" /> in <Formel tex="S" nach=":" /> Stützpunkt <Formel tex="S" nach="," /> Richtungsvektor kein Vielfaches von <Formel tex={t`\vec{u}`} nach="." /></li>
          <li><strong>windschief</strong> zu <Formel tex="g" nach=":" /> Richtungsvektor kein Vielfaches, Stützpunkt so gewählt, dass das Gleichungssystem keine Lösung hat. Die Probe zeigt es.</li>
        </ul>
      </Hinweis>
      <Hinweis titel="Häufige Fehler">
        In beiden Geraden denselben Parameter verwenden. Nur zwei der drei Gleichungen prüfen und daraus auf einen Schnittpunkt schließen. Bei Vielfachen als Richtungsvektoren „parallel“ sagen, ohne die Punktprobe zu machen (die Geraden können identisch sein). „Keine Lösung“ mit „windschief“ gleichsetzen, ohne die Richtungsvektoren zu prüfen (die Geraden können parallel sein). Den Parameter <Formel tex="s" /> in <Formel tex="g" /> einsetzen oder <Formel tex="t" /> in <Formel tex="h" nach="." /> Bei der Punktprobe nur eine oder zwei Koordinaten prüfen.
      </Hinweis>
    </Abschnitt>
  );
}
