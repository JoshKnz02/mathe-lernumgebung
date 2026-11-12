import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { RAUM_ABSCHNITT, RAUM_ERKLAEREN, RAUM_QUADRAT, RAUM_SPURGERADE, RAUM_STREIFEN, RAUM_URSPRUNG } from './Bilder';
import { ABSCHNITT, BEISPIEL as B, PARALLEL as P, URSPRUNG as U } from './daten';
import { Ebenenlabor, Zeichenlabor } from './Labor';
import { achsenabschnittsformTeX, koordinatenformTeX, punktTeX, spalte, spurGleichungTeX, spurZeilen } from './rechenhilfen';

const S = (name: string, v: number[]) => <Formel tex={punktTeX(name, v)} />;

export function Entdecken() {
  const zl = (k: { n: number[]; d: number }, i: number) => {
    const z = spurZeilen(k, i);
    return <Umbruchformel key={i} tex={z.tex} schmal={z.schmal} />;
  };
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Wie berechnest du Spurpunkte?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Die Ebene aus dem Abschnitt „Erklären“ hat die Gleichung <Formel tex={koordinatenformTeX(B.k.n, B.k.d, 'E')} nach="." /> Ihre Spurpunkte sind {S('S_1', B.s[0]!)}, {S('S_2', B.s[1]!)} und {S('S_3', B.s[2]!)}. Prüfe mit der Punktprobe, dass sie in <Formel tex="E" /> liegen. Welche gemeinsame Eigenschaft haben alle Punkte auf der <Formel tex="x_1" />-Achse (und ebenso auf der <Formel tex="x_2" />- und der <Formel tex="x_3" />-Achse)? Wie kannst du damit die Spurpunkte allein aus der Gleichung berechnen, ohne Zeichnung? Probiere es im Ebenenlabor aus.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_ERKLAEREN}
                unter={
                  <>
                    Die Spurpunkte der Ebene <Formel tex="E" nach=":" /> Sie liegen jeweils auf einer Koordinatenachse.
                  </>
                }
              />
            }
          >
            <p>
              Auf der <Formel tex="x_1" />-Achse sind <Formel tex="x_2=0" /> und <Formel tex="x_3=0" nach="," /> nur <Formel tex="x_1" /> ändert sich. Punkte der <Formel tex="x_1" />-Achse sind zum Beispiel <Formel tex={punktTeX('', [3, 0, 0])} nach="," /> <Formel tex={punktTeX('', [-2, 0, 0])} /> und <Formel tex={punktTeX('', [1.5, 0, 0])} nach="." /> Für die <Formel tex="x_2" />-Achse gilt <Formel tex="x_1=0" /> und <Formel tex="x_3=0" nach="," /> für die <Formel tex="x_3" />-Achse <Formel tex="x_1=0" /> und <Formel tex="x_2=0" nach="." />
            </p>
            <p>Ein Spurpunkt liegt auf der Achse und in der Ebene. Setze deshalb die beiden anderen Koordinaten gleich 0 und löse die entstehende Gleichung:</p>
            {[0, 1, 2].map((i) => zl(B.k, i))}
            <p>
              Das sind genau die Spurpunkte aus dem Bild. Vermutung: Für den Spurpunkt auf einer Achse setzt du in der Koordinatenform die beiden anderen Koordinaten gleich 0 und löst nach der übrigen Koordinate auf. Die Punktprobe bestätigt es, zum Beispiel für <Formel tex={t`S_1`} nach=":" /> <Formel tex={t`6\cdot 2+4\cdot 0+3\cdot 0=12`} nach="." />
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Ebenenlabor</h3>
      <p>
        Stelle die Koeffizienten <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> und die Zahl <Formel tex="d" /> der Koordinatenform <Formel tex={t`ax_1+bx_2+cx_3=d`} /> ein. Die Spurpunkte und die Spurgeraden blendest du ein, wenn du eine Vermutung hast. Ebenen im Raum zeigt das Labor nur im Raum. Über dem Bild wählst du zwischen Schrägbild und räumlicher Ansicht. Spurpunkte außerhalb des gezeichneten Bereichs (Koordinaten von −4 bis 4) werden nur berechnet.
      </p>
      <Ebenenlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> auf Werte ungleich 0 und <Formel tex="d" /> auf einen Wert ungleich 0. Verändere nur <Formel tex="a" nach="." /> Wie bewegt sich der Spurpunkt <Formel tex={t`S_1`} nach="?" /> Was passiert, wenn <Formel tex="a" /> das Vorzeichen wechselt?
          </p>
          <Beobachtung>
            Für den Spurpunkt <Formel tex={t`S_1`} /> gilt <Formel tex={t`ax_1=d`} nach="," /> also <Formel tex={t`x_1=\frac{d}{a}`} nach="." /> Wird <Formel tex="a" /> größer, rückt <Formel tex={t`S_1`} /> näher an den Ursprung. Wechselt <Formel tex="a" /> das Vorzeichen, springt <Formel tex={t`S_1`} /> auf die andere Seite des Ursprungs. Für <Formel tex={t`S_2`} /> und <Formel tex={t`S_3`} /> gilt dasselbe mit <Formel tex="b" /> und <Formel tex="c" nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Warum liegt eine Spurgerade in der Koordinatenebene?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Die Spurgerade <Formel tex={t`s_{12}`} /> verbindet <Formel tex={t`S_1`} /> und <Formel tex={t`S_2`} nach="." /> Sie ist die Schnittgerade von <Formel tex="E" /> mit der <Formel tex="x_1x_2" />-Ebene. Erkläre, warum <Formel tex={t`s_{12}`} /> in der <Formel tex="x_1x_2" />-Ebene liegt. Was gilt für die dritte Koordinate aller Punkte der <Formel tex="x_1x_2" />-Ebene? Welche Gleichung bleibt von <Formel tex="E" nach="," /> wenn du diese Koordinate in die Gleichung einsetzt?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_SPURGERADE}
                unter={
                  <>
                    Die Spurgerade <Formel tex={t`s_{12}`} /> (blau) liegt in der <Formel tex="x_1x_2" />-Ebene (hellblau) und in der Ebene <Formel tex="E" nach="." /> Von den anderen Spurgeraden sind nur die grauen Ränder des Spurdreiecks gezeichnet.
                  </>
                }
              />
            }
          >
            <p>
              Alle Punkte der <Formel tex="x_1x_2" />-Ebene haben <Formel tex="x_3=0" nach="." /> <Formel tex={t`S_1`} /> und <Formel tex={t`S_2`} /> haben beide <Formel tex="x_3=0" nach="," /> auf dem Weg von <Formel tex={t`S_1`} /> nach <Formel tex={t`S_2`} /> ändert sich die dritte Koordinate nicht. Also hat jeder Punkt der Verbindungsgeraden <Formel tex="x_3=0" /> und liegt in der <Formel tex="x_1x_2" />-Ebene. Gleichzeitig liegt die Gerade in <Formel tex="E" nach="," /> weil <Formel tex={t`S_1`} /> und <Formel tex={t`S_2`} /> in <Formel tex="E" /> liegen. Sie ist also die Schnittgerade <Formel tex={t`s_{12}`} nach="." />
            </p>
            <p>
              Setzt du <Formel tex="x_3=0" /> in die Gleichung von <Formel tex="E" /> ein, bleibt <Formel tex={spurGleichungTeX(B.k, 'e12')} nach="." /> Das ist die Gleichung der Spurgeraden in der <Formel tex="x_1x_2" />-Ebene. Als Geradengleichung im Raum aus den Spurpunkten: <Formel tex={t`s_{12}:\ \vec{x}=${spalte(B.s[0]!)}+t\cdot${spalte([-2, 3, 0])}`} nach="." />
            </p>
          </Beobachtung>
        </li>
      </ol>
      <p>
        Blende im Ebenenlabor die Spurgeraden ein. Welche Gleichung bleibt in der <Formel tex="x_2x_3" />-Ebene? Wie hängt sie mit der Gleichung von <Formel tex="E" /> zusammen?
      </p>
      <Beobachtung>
        In der <Formel tex="x_2x_3" />-Ebene ist <Formel tex="x_1=0" nach="." /> Von der Gleichung von <Formel tex="E" /> bleiben nur die Glieder mit <Formel tex="x_2" /> und <Formel tex="x_3" /> und die Zahl <Formel tex="d" nach="." /> Die Gleichung der Spurgeraden entsteht also, indem du die Koordinate gleich 0 setzt, die in der Koordinatenebene 0 ist.
      </Beobachtung>

      <h3>Vermutung 3: Wie zeichnet man eine Ebene?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Schreibe eine Anleitung „In vier Schritten eine Ebene zeichnen“. Sie soll auch dann funktionieren, wenn die Ebene in Parameterform gegeben ist. Du kannst die Schritte im Zeichenlabor unten ausprobieren und mit deiner Nachbarin oder deinem Nachbarn vergleichen.
          </p>
          <details className="beobachtung">
            <summary>Sprachhilfe für die Anleitung</summary>
            <div>
              <p>Eine gute Anleitung ist nach der Reihenfolge der Schritte aufgebaut und in der Befehlsform geschrieben.</p>
              <ul>
                <li>Zuerst …, dann …, anschließend …, zum Schluss …</li>
                <li>Verben: umwandeln, berechnen, gleich null setzen, einzeichnen, beschriften, verbinden, schraffieren.</li>
                <li>
                  Beispiele: „Setze <Formel tex="x_2=0" /> und <Formel tex="x_3=0" nach="." />“ oder „Verbinde die Spurpunkte mit dem Lineal.“
                </li>
              </ul>
            </div>
          </details>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_ERKLAEREN}
                unter={<>Das Ergebnis der vier Schritte für die Ebene aus dem Abschnitt „Erklären“.</>}
              />
            }
          >
            <ol>
              <li>
                <strong>Schritt 1:</strong> Liegt die Ebene in Parameterform vor, bestimme die Koordinatenform: <Formel tex={t`\vec{n}=\vec{u}\times\vec{v}`} /> (Vektorprodukt (Kreuzprodukt) der Spannvektoren) und <Formel tex={t`d=\vec{n}\cdot\vec{p}`} nach="." />
              </li>
              <li>
                <strong>Schritt 2:</strong> Berechne die Spurpunkte: Setze jeweils zwei Koordinaten gleich 0 und löse nach der dritten auf.
              </li>
              <li>
                <strong>Schritt 3:</strong> Zeichne die Spurpunkte auf den Achsen ein und beschrifte sie.
              </li>
              <li>
                <strong>Schritt 4:</strong> Verbinde die Spurpunkte mit dem Lineal (das sind Teile der Spurgeraden <Formel tex={t`s_{12}`} nach="," /> <Formel tex={t`s_{13}`} /> und <Formel tex={t`s_{23}`} nach=")" /> und schraffiere das Spurdreieck.
              </li>
            </ol>
            <p>
              Wichtig: Das Spurdreieck ist nur ein Ausschnitt der Ebene, denn die Ebene ist unbegrenzt und setzt sich über die Spurgeraden hinaus fort.
            </p>
          </Beobachtung>
        </li>
      </ol>
      <h3>Das Zeichenlabor</h3>
      <p>Wähle eine Ebene und gehe mit „Weiter“ Schritt für Schritt vor. Überlege vor jedem Schritt, was jetzt zu tun ist. Das Labor zeigt, wie der Ausschnitt entsteht.</p>
      <Zeichenlabor />

      <h3>Vermutung 4: Was geschieht, wenn ein Spurpunkt fehlt?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={koordinatenformTeX(P.achse.k.n, P.achse.k.d, 'E_a')} /> und <Formel tex={koordinatenformTeX(P.ebene.k.n, P.ebene.k.d, 'E_b')} nach="." /> Berechne für jede Ebene die Spurpunkte. Was fällt dir auf? Erkläre, was bei der Rechnung geschieht und was das geometrisch bedeutet. Wie verlaufen die Spurgeraden, wenn ein Spurpunkt fehlt? Überlege zuerst, dann probiere es im Ebenenlabor aus (setze zum Beispiel <Formel tex="b=0" nach=")." />
          </p>
          <Beobachtung
            bild={
              <>
                <Figur
                  spec={RAUM_STREIFEN}
                  unter={
                    <>
                      <Formel tex={t`E_a`} nach=":" /> Die Ebene ist parallel zur <Formel tex="x_2" />-Achse. Die Spurgeraden <Formel tex={t`s_{12}`} /> und <Formel tex={t`s_{23}`} /> sind parallel zur <Formel tex="x_2" />-Achse, der Ausschnitt ist ein Streifen (Parallelogramm).
                    </>
                  }
                />
                <Figur
                  spec={RAUM_QUADRAT}
                  unter={
                    <>
                      <Formel tex={t`E_b`} nach=":" /> Die Ebene ist parallel zur <Formel tex="x_1x_2" />-Ebene. Es gibt nur den Spurpunkt <Formel tex={t`S_3`} nach="," /> die Spurgeraden <Formel tex={t`s_{13}`} /> und <Formel tex={t`s_{23}`} /> sind parallel zu den Achsen.
                    </>
                  }
                />
              </>
            }
          >
            <p>
              Für <Formel tex={t`E_a`} nach=":" />
            </p>
            {[0, 1, 2].map((i) => zl(P.achse.k, i))}
            <p>
              Bei <Formel tex={t`S_2`} /> bleibt <Formel tex="0=6" nach="." /> Das ist eine falsche Aussage: Die Gleichung hat keine Lösung, es gibt keinen Punkt auf der <Formel tex="x_2" />-Achse, der in <Formel tex={t`E_a`} /> liegt. Die Ebene schneidet die <Formel tex="x_2" />-Achse nie, sie ist parallel zu ihr. Die Variable <Formel tex="x_2" /> fehlt in der Gleichung, <Formel tex="x_2" /> darf also beliebig sein: Zu jedem Punkt der Ebene liegt die ganze Parallele zur <Formel tex="x_2" />-Achse in der Ebene. Deshalb verläuft <Formel tex={t`s_{13}`} /> durch <Formel tex={t`S_1`} /> und <Formel tex={t`S_3`} nach="," /> und <Formel tex={t`s_{12}`} /> und <Formel tex={t`s_{23}`} /> sind die Parallelen zur <Formel tex="x_2" />-Achse durch <Formel tex={t`S_1`} /> und <Formel tex={t`S_3`} nach="." />
            </p>
            <p>
              Für <Formel tex={t`E_b`} nach=":" /> Bei <Formel tex={t`S_1`} /> und <Formel tex={t`S_2`} /> bleibt <Formel tex="0=3" nach="." /> Zwei Variablen fehlen, die Ebene ist parallel zur <Formel tex="x_1x_2" />-Ebene, drei Einheiten darüber. Es gibt nur den Spurpunkt <Formel tex={t`S_3`} /> und keine Spurgerade <Formel tex={t`s_{12}`} nach="." />
            </p>
            <p>
              Vermutung: Fehlt eine Variable und ist <Formel tex="d" /> nicht 0, ist die Ebene parallel zu der Achse, deren Variable fehlt (zwei Spurpunkte). Fehlen zwei Variablen und ist <Formel tex="d" /> nicht 0, ist sie parallel zu der Koordinatenebene, die von den beiden zugehörigen Achsen aufgespannt wird (ein Spurpunkt).
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 5: Was ist anders, wenn d gleich 0 ist?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben ist <Formel tex={koordinatenformTeX(U.k.n, U.k.d, 'E_c')} nach="." /> Berechne die Spurpunkte. Warum reichen sie hier nicht zum Zeichnen? Finde einen anderen Weg, einen Ausschnitt der Ebene zu zeichnen. Stelle im Ebenenlabor <Formel tex="d=0" /> ein und beobachte die Spurpunkte.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_URSPRUNG}
                unter={
                  <>
                    <Formel tex={t`E_c`} nach=":" /> Alle drei Spurgeraden gehen durch den Ursprung. Auf jeder liegt ein Punkt (<Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" nach=")." /> Das Dreieck <Formel tex={t`ABC`} /> enthält den Ursprung.
                  </>
                }
              />
            }
          >
            <p>
              Setzt du auf jeder Achse die beiden anderen Koordinaten gleich 0, bleibt immer eine Gleichung mit der Lösung 0:
            </p>
            {[0, 1, 2].map((i) => zl(U.k, i))}
            <p>
              Alle drei Spurpunkte sind der Ursprung <Formel tex="O" nach="." /> Ein einziger Punkt legt keine Ebene fest. Suche weitere Punkte in den Koordinatenebenen: In der <Formel tex="x_1x_2" />-Ebene ist <Formel tex="x_3=0" nach="," /> es bleibt <Formel tex="2x_1+x_2=0" nach="." /> Ein Punkt ist {S('A', U.punkte.s12)}. Genauso findest du in der <Formel tex="x_1x_3" />-Ebene {S('B', U.punkte.s13)} und in der <Formel tex="x_2x_3" />-Ebene {S('C', U.punkte.s23)}.
            </p>
            <p>
              Die Spurgerade <Formel tex={t`s_{12}`} /> geht durch <Formel tex="O" /> und <Formel tex="A" nach="," /> und entsprechend <Formel tex={t`s_{13}`} /> durch <Formel tex="O" /> und <Formel tex="B" /> und <Formel tex={t`s_{23}`} /> durch <Formel tex="O" /> und <Formel tex="C" nach="." /> Als Ausschnitt zeichnest du das Dreieck <Formel tex={t`ABC`} nach="." /> Wähle die Punkte so, dass der Ursprung im Dreieck liegt (nicht alle drei auf derselben Seite des Ursprungs).
            </p>
            <p>
              Vermutung: Ist <Formel tex="d=0" nach="," /> geht die Ebene durch den Ursprung. Die Spurpunkte reichen dann nicht, du brauchst weitere Punkte auf den Spurgeraden.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 6: Wie erhältst du die Gleichung aus den Spurpunkten?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Eine Ebene hat die Spurpunkte {S('S_1', [ABSCHNITT.s[0]!, 0, 0])}, {S('S_2', [0, ABSCHNITT.s[1]!, 0])} und {S('S_3', [0, 0, ABSCHNITT.s[2]!])}. Bestimme eine Koordinatenform. Zeige dann: Auch <Formel tex={achsenabschnittsformTeX(3, 2, 4)} /> beschreibt diese Ebene. Erkläre, warum man an dieser Form die Spurpunkte sofort ablesen kann.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_ABSCHNITT}
                unter={<>Die Ebene mit den Spurpunkten <Formel tex={t`S_1`} nach="," /> <Formel tex={t`S_2`} /> und <Formel tex={t`S_3`} nach="." /></>}
              />
            }
          >
            <p>
              Ansatz <Formel tex={t`ax_1+bx_2+cx_3=d`} nach="." /> Aus <Formel tex={t`S_1`} /> folgt <Formel tex={t`3a=d`} nach="," /> aus <Formel tex={t`S_2`} /> folgt <Formel tex={t`2b=d`} /> und aus <Formel tex={t`S_3`} /> folgt <Formel tex={t`4c=d`} nach="." /> Wähle <Formel tex="d" /> geschickt, nämlich als kleinstes gemeinsames Vielfaches von 3, 2 und 4, also <Formel tex="d=12" nach="." /> Dann ist <Formel tex="a=4" nach="," /> <Formel tex="b=6" /> und <Formel tex="c=3" nach="." /> Die Koordinatenform ist <Formel tex={koordinatenformTeX(ABSCHNITT.k.n, ABSCHNITT.k.d)} nach="." />
            </p>
            <p>
              Multiplizierst du <Formel tex={achsenabschnittsformTeX(3, 2, 4)} /> mit dem Hauptnenner 12, erhältst du dieselbe Gleichung. Die Form <Formel tex={t`\frac{x_1}{a}+\frac{x_2}{b}+\frac{x_3}{c}=1`} /> heißt <strong>Achsenabschnittsform</strong>. Setzt du darin <Formel tex="x_2=0" /> und <Formel tex="x_3=0" nach="," /> bleibt <Formel tex={t`\frac{x_1}{a}=1`} nach="," /> also <Formel tex="x_1=a" nach="." /> Die Zahlen <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> sind die Achsenabschnitte, die Koordinaten der Spurpunkte. Die Form gibt es nur, wenn <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> nicht 0 sind, die Ebene also drei Spurpunkte hat.
            </p>
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
