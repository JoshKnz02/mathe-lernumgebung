import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { ebeneAusGeraden } from '@/lib/ebene';
import { t } from '@/lib/modulhilfen';
import { RAUM_AUF_GERADE, RAUM_PARALLEL, RAUM_SCHNEIDEND, RAUM_WINDSCHIEF } from './Bilder';
import { AUF_GERADE, PARALLEL, SCHNEIDEND, WINDSCHIEF } from './daten';
import { Geradenlabor, Punktlabor } from './Labor';
import { gl, gleichungE, gleichungESchmal, glSchmal, punktTeX, spalte } from './rechenhilfen';

const paarGl = (p: { g: Parameters<typeof gl>[0]; h: Parameters<typeof gl>[0] }) => (
  <>
    <Umbruchformel tex={gl(p.g, 'g', 't')} schmal={glSchmal(p.g, 'g', 't')} />
    <Umbruchformel tex={gl(p.h, 'h', 'k')} schmal={glSchmal(p.h, 'h', 'k')} />
  </>
);

export function Entdecken() {
  const s = ebeneAusGeraden(SCHNEIDEND.g, SCHNEIDEND.h).ebene!;
  const pa = ebeneAusGeraden(PARALLEL.g, PARALLEL.h).ebene!;
  const a = AUF_GERADE;
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Wann liegen zwei Geraden in einer Ebene?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Zwei Geraden <Formel tex="g" /> und <Formel tex="h" /> können sich schneiden, parallel sein oder windschief sein (siehe <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>). Bei welchen dieser Lagen gibt es eine Ebene, die beide Geraden enthält? Welche Spannvektoren wählst du dann? Gib dir im Geradenlabor Beispiele vor.
          </p>
          <Beobachtung
            bild={
              <>
                <Figur spec={RAUM_SCHNEIDEND} unter={<>Sich schneidende Geraden <Formel tex="g" /> und <Formel tex="h" /> mit der Ebene, die beide enthält.</>} />
                <Figur spec={RAUM_PARALLEL} unter={<>Parallele Geraden mit der Ebene, die beide enthält. Der rosa Pfeil führt von <Formel tex="P" /> auf <Formel tex="g" /> zu <Formel tex="Q" /> auf <Formel tex="h" nach="." /></>} />
                <Figur spec={RAUM_WINDSCHIEF} unter={<>Windschiefe Geraden: Eine Ebene, die beide enthält, gibt es nicht.</>} />
              </>
            }
          >
            <p>
              <strong>Sie schneiden sich.</strong> Beide Richtungsvektoren liegen in der Ebene, denn die Geraden verlaufen in ihr, und sie sind keine Vielfachen voneinander. Du nimmst den Stützpunkt von <Formel tex="g" /> und die beiden Richtungsvektoren als Spannvektoren. Für
            </p>
            {paarGl(SCHNEIDEND)}
            <p>erhältst du</p>
            <Umbruchformel tex={gleichungE(s)} schmal={gleichungESchmal(s)} />
            <p>
              <strong>Sie sind parallel und verschieden.</strong> Die Richtungsvektoren sind Vielfache voneinander und geben nur eine Richtung. Die zweite Richtung liefert der Verbindungsvektor <Formel tex={t`\overrightarrow{PQ}`} /> der beiden Stützpunkte, denn <Formel tex="P" /> liegt auf <Formel tex="g" /> und <Formel tex="Q" /> auf <Formel tex="h" nach="." /> Für
            </p>
            {paarGl(PARALLEL)}
            <p>
              ist <Formel tex={t`\overrightarrow{PQ}=${spalte(pa.v)}`} /> und
            </p>
            <Umbruchformel tex={gleichungE(pa)} schmal={gleichungESchmal(pa)} />
            <p>
              <strong>Sie sind windschief.</strong> Zwei Geraden in einer Ebene schneiden sich oder sind parallel, eine dritte Möglichkeit gibt es in einer Ebene nicht. Windschiefe Geraden sind weder das eine noch das andere, also liegen sie in keiner gemeinsamen Ebene. <strong>Sind sie identisch,</strong> liegen sie in unendlich vielen Ebenen, die Ebene ist dann nicht eindeutig festgelegt. Vermutung: Zwei Geraden legen genau dann eine Ebene fest, wenn sie sich in einem Punkt schneiden oder parallel und verschieden sind.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Geradenlabor</h3>
      <p>
        Die Gerade <Formel tex="g" /> ist fest. Stelle die Gerade <Formel tex="h" /> mit dem Stützvektor <Formel tex={t`\vec{q}`} /> und dem Richtungsvektor <Formel tex={t`\vec{w}`} /> ein. Die Lage und die Ebene blendest du ein, wenn du eine Vermutung hast. Ebenen im Raum zeigt das Labor nur im Raum. Über dem Bild wählst du zwischen Schrägbild und räumlicher Ansicht.
      </p>
      <Geradenlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Verändere <Formel tex={t`\vec{q}`} /> und <Formel tex={t`\vec{w}`} /> so, dass <Formel tex="h" /> die Gerade <Formel tex="g" /> schneidet, dann so, dass <Formel tex="h" /> zu <Formel tex="g" /> parallel ist. Wann erscheint eine Ebene?
          </p>
          <Beobachtung>
            Eine Ebene erscheint, wenn sich die Geraden schneiden oder parallel und verschieden sind. Bei windschiefen Geraden erscheint keine. Ein zu <Formel tex="g" /> paralleler Richtungsvektor ist zum Beispiel <Formel tex={t`\vec{w}=${spalte([-1, -2, 1])}`} nach="." /> Mit dem Stützpunkt <Formel tex={punktTeX('', [2, -1, 2])} /> liegt <Formel tex="h" /> dann neben <Formel tex="g" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Stelle <Formel tex="h" /> so ein, dass sie dieselbe Gerade wie <Formel tex="g" /> beschreibt (zum Beispiel mit dem Stützpunkt <Formel tex={punktTeX('', [0, 1, 0])} /> und einem Vielfachen des Richtungsvektors von <Formel tex="g" nach=")." /> Was zeigt das Labor, und warum?
          </p>
          <Beobachtung>
            Bei identischen Geraden gibt es keine eindeutige Ebene: Durch eine Gerade gehen unendlich viele Ebenen, und für jede gilt, dass beide Geraden in ihr liegen.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Reicht eine Gerade mit einem Punkt immer?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Eine Gerade <Formel tex="g" /> und ein Punkt <Formel tex="X" /> sind gegeben. Der Punkt liegt auf <Formel tex="g" nach="." /> Wie viele Ebenen enthalten <Formel tex="g" /> und <Formel tex="X" nach="?" /> Was geschieht mit dem Verfahren aus dem Abschnitt „Erklären“?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_AUF_GERADE}
                unter={
                  <>
                    Die Gerade <Formel tex="g" /> mit dem Punkt <Formel tex="X" /> auf ihr und zwei verschiedene Ebenen, die <Formel tex="g" /> enthalten (grau und orange berandet).
                  </>
                }
              />
            }
          >
            <p>
              Der Punkt <Formel tex={punktTeX('X', a.X)} /> liegt auf <Formel tex="g" nach="," /> denn er gehört zu <Formel tex="t=3" nach="." /> Der Verbindungsvektor <Formel tex={t`\overrightarrow{PX}`} /> ist dann ein Vielfaches des Richtungsvektors, nämlich das Dreifache. Er liefert keine zweite Richtung, die Spannvektoren sind kollinear und es entsteht nur die Gerade. Jeder Vektor, der nicht parallel zu <Formel tex="g" /> ist, ergibt mit <Formel tex={t`\vec{u}`} /> eine Ebene durch <Formel tex="g" nach="." /> Im Bild enthalten zum Beispiel der zweite Spannvektor <Formel tex={t`${spalte(a.v1)}`} /> und <Formel tex={t`${spalte(a.v2)}`} nach="," /> beide zusammen mit dem Richtungsvektor von <Formel tex="g" /> eine Ebene durch <Formel tex="g" nach="." /> Vermutung: Liegt der Punkt auf der Geraden, gibt es unendlich viele Ebenen. Nur ein Punkt außerhalb der Geraden legt mit ihr genau eine Ebene fest.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Punktlabor</h3>
      <p>
        Die Gerade <Formel tex="g" /> ist fest. Stelle mit den Reglern den Punkt <Formel tex="X" /> ein. Die Ebene blendest du ein, wenn du eine Vermutung hast.
      </p>
      <Punktlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle <Formel tex="X" /> auf den Punkt <Formel tex={punktTeX('', [0, 1, 0])} nach="," /> der auf <Formel tex="g" /> liegt. Verändere dann nur <Formel tex="x_3" /> um 1. Was zeigt das Labor jeweils?
          </p>
          <Beobachtung>
            Auf <Formel tex="g" /> gibt es keine eindeutige Ebene. Nach der Änderung liegt der Punkt neben <Formel tex="g" nach="," /> und das Labor zeigt genau eine Ebene.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
