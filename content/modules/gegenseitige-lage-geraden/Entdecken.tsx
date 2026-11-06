import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktTeX } from '@/lib/geradenhilfen';
import { t } from '@/lib/modulhilfen';
import { faktor } from '@/lib/vektor';
import { RAUM_PARALLEL, RAUM_WINDSCHIEF } from './Bilder';
import { IDENTISCH, LABOR_G, PARALLEL, WINDSCHIEF } from './daten';
import { Gleichsetzlabor, Lagelabor } from './Labor';
import { ORDNUNG, gl, glSchmal, loesungsweg, punktprobe, systemBlock } from './rechenhilfen';
import { spalte } from '@/lib/laborhilfen';

/** Gleichung beider Geraden als zwei kurze Zeilen (g und h). */
const Beide = ({ g, h }: { g: Parameters<typeof gl>[0]; h: Parameters<typeof gl>[0] }) => (
  <>
    <Umbruchformel tex={gl(g)} schmal={glSchmal(g)} />
    <Umbruchformel tex={gl(h, 'h', 's')} schmal={glSchmal(h, 'h', 's')} />
  </>
);

export function Entdecken() {
  const par = PARALLEL;
  const ide = IDENTISCH;
  const win = WINDSCHIEF;
  const kPar = faktor(par.g.u, par.h.u)!;
  const kIde = faktor(ide.g.u, ide.h.u)!;
  const probePar = punktprobe(par.g, par.h.p);
  const probeIde = punktprobe(ide.g, ide.h.p);
  const ww = loesungsweg(win.g, win.h);
  const koord = (k: number) => ORDNUNG[k];
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Wann sind zwei Geraden parallel oder identisch?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>Gegeben sind</p>
          <Beide g={par.g} h={par.h} />
          <p>
            Vergleiche die Richtungsvektoren <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} nach="." /> Liegt der Stützpunkt <Formel tex="Q" /> von <Formel tex="h" /> auf <Formel tex="g" nach="?" /> Wie viele gemeinsame Punkte haben die Geraden?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PARALLEL}
                unter={
                  <>
                    <Formel tex="g" /> (schwarz) und <Formel tex="h" /> (blau) verlaufen in dieselbe Richtung, <Formel tex="Q" /> liegt nicht auf <Formel tex="g" nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Die Richtungsvektoren sind Vielfache voneinander: <Formel tex={t`\vec{v}=${kPar}\cdot\vec{u}`} nach="." /> Die Geraden haben also dieselbe Richtung. Für die Punktprobe mit <Formel tex={punktTeX('Q', par.h.p)} /> setzen wir die {koord(0)} Koordinate gleich: <Formel tex={t`${par.g.p[0]}+t\cdot ${par.g.u[0]}=${par.h.p[0]}`} /> ergibt <Formel tex={t`t=${probePar.t}`} nach="." /> Für diesen Parameter liegt auf <Formel tex="g" /> der Punkt <Formel tex={punktTeX('', probePar.punkt)} nach="." /> Die {koord(probePar.abweichung)} Koordinate stimmt aber nicht mit <Formel tex="Q" /> überein. <Formel tex="Q" /> liegt nicht auf <Formel tex="g" nach="," /> die Geraden haben keinen gemeinsamen Punkt: Sie sind parallel.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>Jetzt hat <Formel tex="h" /> einen anderen Stützpunkt und einen anderen Richtungsvektor, <Formel tex="g" /> bleibt gleich:</p>
          <Beide g={ide.g} h={ide.h} />
          <p>
            Vergleiche wieder die Richtungsvektoren und prüfe, ob <Formel tex="Q" /> auf <Formel tex="g" /> liegt. Was folgt für die Lage der Geraden? Wie unterscheiden sich die beiden Fälle?
          </p>
          <Beobachtung>
            <p>
              Wieder sind die Richtungsvektoren Vielfache: <Formel tex={t`\vec{v}=${kIde}\cdot\vec{u}`} nach="." /> Die Punktprobe mit <Formel tex={punktTeX('Q', ide.h.p)} /> liefert <Formel tex={t`t=${probeIde.t}`} nach="," /> und <Formel tex={punktTeX('', probeIde.punkt)} /> ist genau <Formel tex="Q" nach="." /> <Formel tex="Q" /> liegt auf <Formel tex="g" nach="." /> Zwei Geraden mit derselben Richtung, die einen gemeinsamen Punkt haben, haben alle Punkte gemeinsam: Sie sind identisch.
            </p>
            <p>
              Vermutung: Sind die Richtungsvektoren Vielfache voneinander, sind die Geraden parallel oder identisch. Welche der beiden Lagen es ist, entscheidet die Punktprobe mit dem Stützpunkt <Formel tex="Q" nach="." /> Die Punktprobe steht im Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Lagelabor</h3>
      <p>
        Die Gerade <Formel tex="g" /> ist fest. Stelle mit den Reglern den Stützvektor <Formel tex={t`\vec{q}`} /> und den Richtungsvektor <Formel tex={t`\vec{v}`} /> der Geraden <Formel tex="h" /> ein. Die Lage und den Vergleich der Richtungsvektoren blendest du ein, wenn du eine Vermutung hast. Liegt ein Schnittpunkt außerhalb des gezeichneten Koordinatensystems, wird er nicht gezeichnet.
      </p>
      <Lagelabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle <Formel tex="h" /> so ein, dass die Geraden identisch sind, dann so, dass sie parallel sind. Was gilt dafür jeweils für <Formel tex={t`\vec{v}`} /> und <Formel tex="Q" nach="?" /> Gelingt es dir, die Geraden schneidend und windschief einzustellen? Woran siehst du es im Bild, woran sicher?
          </p>
          <Beobachtung>
            <p>
              Bei <Formel tex={t`\vec{u}=${spalte(LABOR_G.u)}`} /> sind identische und parallele Geraden nur möglich, wenn <Formel tex={t`\vec{v}`} /> ein Vielfaches von <Formel tex={t`\vec{u}`} /> ist, zum Beispiel <Formel tex={t`${spalte([-1, -2, 1])}`} /> oder <Formel tex={t`${spalte([2, 4, -2])}`} nach="." /> Liegt <Formel tex="Q" /> auf <Formel tex="g" nach="," /> sind die Geraden identisch, sonst parallel.
            </p>
            <p>
              Ist <Formel tex={t`\vec{v}`} /> kein Vielfaches von <Formel tex={t`\vec{u}`} nach="," /> sind die Geraden nicht parallel. Ob sie sich schneiden oder windschief sind, lässt sich im Bild nur schwer erkennen, denn es zeigt eine Ansicht des Raums. Dafür brauchst du das Gleichsetzen, das die nächste Vermutung untersucht. Im Bild hilft die räumliche Ansicht, wenn du sie drehst.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Wie viele gemeinsame Punkte können zwei Geraden haben? Gibt es Einstellungen mit genau zwei gemeinsamen Punkten?
          </p>
          <Beobachtung>
            Zwei Geraden haben keinen gemeinsamen Punkt (parallel oder windschief), genau einen (sie schneiden sich) oder alle Punkte (identisch). Genau zwei gemeinsame Punkte gibt es nie: Durch zwei verschiedene Punkte geht nur eine Gerade. Haben <Formel tex="g" /> und <Formel tex="h" /> zwei verschiedene Punkte gemeinsam, sind beide Geraden die Gerade durch diese zwei Punkte, also identisch.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Wann schneiden sich zwei Geraden, wann sind sie windschief?</h3>
      <ol className="auftraege">
        <li>
          <p>Gegeben sind</p>
          <Beide g={win.g} h={win.h} />
          <p>
            Die Richtungsvektoren sind keine Vielfachen. Setze gleich und löse zwei Gleichungen nach <Formel tex="t" /> und <Formel tex="s" nach="." /> Setze die Werte dann in die dritte Gleichung ein. Was fällt auf? Was bedeutet das für die Geraden?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_WINDSCHIEF}
                unter={
                  <>
                    <Formel tex="g" /> (schwarz) und <Formel tex="h" /> (blau) mit den Stützpunkten <Formel tex={punktTeX('P', win.g.p)} /> und <Formel tex={punktTeX('Q', win.h.p)} nach="." /> Sie gehen aneinander vorbei, auch wenn es im Schrägbild so aussieht, als würden sie sich kreuzen. Dreh die räumliche Ansicht.
                  </>
                }
              />
            }
          >
            <p>Gleichsetzen und nach Koordinaten sortiert:</p>
            <Formel anzeige tex={systemBlock(win.g, win.h)} />
            <p>Die ersten beiden Gleichungen liefern</p>
            <Formel anzeige tex={t`\begin{gathered}${ww.umgestellt}\\${ww.eingesetzt.eingesetzt}\\${ww.eingesetzt.ergebnis}\\${ww.ersteUnbekannte}\end{gathered}`} />
            <p>Probe mit der dritten Gleichung:</p>
            <Formel anzeige tex={t`\begin{gathered}${ww.probe.links}\\${ww.probe.rechts}\end{gathered}`} />
            <p>
              Die Seiten sind verschieden, die dritte Gleichung ist nicht erfüllt. Das System hat keine Lösung: Die Geraden haben keinen gemeinsamen Punkt. Weil die Richtungsvektoren keine Vielfachen sind, sind sie auch nicht parallel. Die Geraden sind windschief. Vermutung: Ist <Formel tex={t`\vec{v}`} /> kein Vielfaches von <Formel tex={t`\vec{u}`} nach="," /> entscheidet das Gleichungssystem: mit Lösung schneiden sich die Geraden, ohne Lösung sind sie windschief.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Gleichsetzlabor</h3>
      <p>
        Es ist dieselbe feste Gerade <Formel tex="g" nach="." /> Du stellst <Formel tex="h" /> ein. Unter den Reglern steht das Gleichungssystem für <Formel tex="t" /> und <Formel tex="s" nach="." /> Die Anzahl seiner Lösungen und die Lage blendest du ein, wenn du eine Vermutung hast.
      </p>
      <Gleichsetzlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Wie viele Lösungen hat das System bei den vier Lagen? Bei welchen Lagen ist die Anzahl gleich? Woran unterscheidest du diese Lagen dann?
          </p>
          <Beobachtung>
            <ul className="liste-ohne-zahl" aria-label="Lösungen des Systems und Lage">
              <li><strong>Genau eine Lösung</strong>: Die Geraden schneiden sich. Mit <Formel tex="t" /> in <Formel tex="g" /> (oder <Formel tex="s" /> in <Formel tex="h" nach=")" /> erhältst du den Schnittpunkt.</li>
              <li><strong>Keine Lösung</strong>: Die Geraden haben keinen gemeinsamen Punkt, sie sind parallel oder windschief. Das System allein unterscheidet das nicht. Ist <Formel tex={t`\vec{v}`} /> ein Vielfaches von <Formel tex={t`\vec{u}`} nach="," /> sind sie parallel, sonst windschief.</li>
              <li><strong>Unendlich viele Lösungen</strong>: Die Geraden sind identisch, die Gleichungen des Systems sind Vielfache voneinander.</li>
            </ul>
          </Beobachtung>
        </li>
        <li>
          <p>
            Gibt es windschiefe Geraden in der Ebene? Überlege mit Geraden, bei denen alle dritten Koordinaten 0 sind, die also in der <Formel tex="x_1x_2" />-Ebene liegen.
          </p>
          <Beobachtung>
            Sind alle dritten Koordinaten 0, lautet die dritte Gleichung <Formel tex="0=0" nach="." /> Sie ist immer erfüllt, es bleiben zwei Gleichungen für zwei Unbekannte. Sind die Richtungsvektoren keine Vielfachen, haben diese zwei Gleichungen genau eine Lösung: Die Geraden schneiden sich. Windschief können zwei Geraden in einer Ebene also nicht sein, in der Ebene gibt es nur schneiden, parallel und identisch. Windschiefe Geraden gibt es nur im Raum.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
