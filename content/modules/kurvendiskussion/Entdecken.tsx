import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { Dreierbild } from '@/components/Paarbild';
import { t } from '@/lib/modulhilfen';
import { BILD_VIER_FAELLE, DREI_FALLEND_W, DREI_FUENF, DREI_KUBISCH, DREI_KUBISCH_W, DREI_SATTEL, DREI_V1, DREI_V3, DREI_VIER } from './Bilder';
import { Kurvenlabor } from './Kurvenlabor';

const KF = <Formel tex="K_f" />;
const KDF = <Formel tex="K_{f'}" />;
const KDDF = <Formel tex="K_{f''}" />;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            In einer Linkskurve nimmt die Steigung der Tangente zu: <Formel tex="f'" /> steigt. Du kennst die Regel für das Vorzeichen der Ableitung bei einem steigenden Schaubild. Wende sie auf die Funktion <Formel tex="f'" /> an statt auf <Formel tex="f" nach="." /> Welches Vorzeichen hat <Formel tex="f''" /> dort, wo {KF} linksgekrümmt ist, und welches dort, wo {KF} rechtsgekrümmt ist?
          </p>
          <Beobachtung
            bild={
              <Dreierbild
                daten={DREI_V1}
                unter={
                  <>
                    Oben <Formel tex="K_f" nach="," /> in der Mitte <Formel tex="K_{f'}" nach="," /> unten <Formel tex="K_{f''}" nach="." /> Auf der x-Achse von {KDF} und {KDDF} sind die Bereiche blau markiert, in denen der Wert positiv ist, und schwarz, in denen er negativ ist. {KF} ist rechts von <Formel tex="x=1" /> linksgekrümmt, dort liegt {KDDF} oberhalb der x-Achse.
                  </>
                }
              />
            }
          >
            Die Regel lautet: Wo ein Schaubild steigt, ist seine Ableitung positiv. Auf <Formel tex="f'" /> angewendet heißt das: Wo {KDF} steigt, ist die Ableitung von <Formel tex="f'" nach="," /> also <Formel tex="f''" nach="," /> positiv. In einem linksgekrümmten Bereich steigt <Formel tex="f'" nach="," /> dort gilt <Formel tex="f''(x)>0" nach="." /> Entsprechend fällt <Formel tex="f'" /> in einem rechtsgekrümmten Bereich, dort gilt <Formel tex="f''(x)<0" nach="." /> Das Schaubild {KDDF} liegt also oberhalb der x-Achse, wo {KF} linksgekrümmt ist, und unterhalb, wo {KF} rechtsgekrümmt ist.
          </Beobachtung>
        </li>
        <li>
          <p>
            Ein Schaubild fällt und ist dabei linksgekrümmt: Ist das möglich? Es gibt vier Kombinationen aus steigend oder fallend und linksgekrümmt oder rechtsgekrümmt. Kommen alle vier vor? Ein Hinweis: Auch eine negative Steigung kann zunehmen, zum Beispiel von <Formel tex="-3" /> auf <Formel tex="-1" nach="." />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_VIER_FAELLE}
                unter={
                  <>
                    Das Schaubild {KF} mit vier nummerierten Punkten. In jedem Punkt trifft eine andere Kombination aus Monotonie und Krümmung zu.
                  </>
                }
              />
            }
          >
            <p>Alle vier Kombinationen kommen vor:</p>
            <table className="tabelle tabelle-kompakt tabelle-breit">
              <thead>
                <tr>
                  <th scope="col">Punkt</th>
                  <th scope="col">Tangente</th>
                  <th scope="col">Vorzeichen</th>
                  <th scope="col">Krümmung</th>
                  <th scope="col">Vorzeichen</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>steigt</td><td><Formel tex="f'>0" /></td><td>rechtsgekrümmt</td><td><Formel tex="f''<0" /></td></tr>
                <tr><td>2</td><td>fällt</td><td><Formel tex="f'<0" /></td><td>rechtsgekrümmt</td><td><Formel tex="f''<0" /></td></tr>
                <tr><td>3</td><td>fällt</td><td><Formel tex="f'<0" /></td><td>linksgekrümmt</td><td><Formel tex="f''>0" /></td></tr>
                <tr><td>4</td><td>steigt</td><td><Formel tex="f'>0" /></td><td>linksgekrümmt</td><td><Formel tex="f''>0" /></td></tr>
              </tbody>
            </table>
            <p>
              Monotonie und Krümmung sind zwei verschiedene Eigenschaften. Die Monotonie zeigt das Vorzeichen von <Formel tex="f'" nach="," /> die Krümmung das Vorzeichen von <Formel tex="f''" nach="." /> Im Punkt 3 fällt {KF} und ist trotzdem linksgekrümmt: Die Steigung nimmt zu, sie bleibt aber negativ.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Aus dem Modul <Modulverweis modul="grafisches-differenzieren" abschnitt="entdecken">Grafisches Differenzieren</Modulverweis> weißt du: Bei einer Wendestelle von {KF} hat {KDF} einen Extrempunkt, dort ist die Tangente an {KDF} waagerecht. Was folgt daraus für <Formel tex="f''" /> an einer Wendestelle? Gilt auch die Umkehrung, hat {KF} also bei jeder Nullstelle von <Formel tex="f''" /> eine Wendestelle? Untersuche <Formel tex={t`f(x)=\frac{1}{12}x^4`} nach="." />
          </p>
          <Beobachtung
            bild={
              <Dreierbild
                daten={DREI_V3}
                unter={
                  <>
                    Oben {KF} mit dem Tiefpunkt <Formel tex="T" /> im Ursprung, in der Mitte {KDF} mit einer Nullstelle bei <Formel tex="T" nach="," /> unten {KDDF} als Parabel, die bei <Formel tex="T" /> die x-Achse berührt und sonst positiv bleibt.
                  </>
                }
              />
            }
          >
            <p>
              Die Tangente an {KDF} hat die Steigung <Formel tex="f''" nach="." /> An einem Extrempunkt von {KDF} ist sie waagerecht, also gilt an jeder Wendestelle <Formel tex="f''(x)=0" nach="." />
            </p>
            <p>
              Die Umkehrung gilt nicht. Für <Formel tex={t`f(x)=\frac{1}{12}x^4`} /> ist <Formel tex="f''(x)=x^2" nach="." /> Das ist bei <Formel tex="x=0" /> null, links und rechts davon aber positiv. {KF} ist auf beiden Seiten linksgekrümmt, bei <Formel tex="x=0" /> liegt ein Tiefpunkt und keine Wendestelle. Die Bedingung <Formel tex="f''(x)=0" /> ist also <strong>notwendig</strong> für eine Wendestelle, aber nicht <strong>hinreichend</strong>.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Kurvenlabor</h3>
      <p>
        Oben siehst du {KF} mit der Tangente an der Stelle <Formel tex="x_0" nach="," /> in der Mitte {KDF} mit dem Punkt bei <Formel tex="x_0" /> und der Tangente an {KDF} und unten {KDDF} mit dem Punkt bei <Formel tex="x_0" nach="." /> Die Tangente an {KDF} hat die Steigung <Formel tex="f''(x_0)" nach="." /> Die Tabelle zeigt die Vorzeichen von <Formel tex="f'" /> und <Formel tex="f''" /> links und rechts von <Formel tex="x_0" /> und die Werte bei <Formel tex="x_0" nach="." /> Mit den Knöpfen unter „Zu einer Stelle springen“ stellst du <Formel tex="x_0" /> genau auf die Stellen ein, an denen <Formel tex="f'" /> oder <Formel tex="f''" /> null ist.
      </p>
      <Kurvenlabor />
      <ol className="auftraege">
        <li>
          <p>
            Wähle <Formel tex={t`\frac{1}{2}x^3-\frac{3}{2}x^2+2`} nach="." /> Fahre <Formel tex="x_0" /> von links nach rechts. An welchen Stellen wechselt <Formel tex="f'" /> das Vorzeichen, an welchen <Formel tex="f''" nach="?" /> Was geschieht dort mit <Formel tex="K_f" nach="?" /> Welches Vorzeichen hat <Formel tex="f''" /> an der Stelle des Hochpunkts, welches an der des Tiefpunkts?
          </p>
          <Beobachtung
            bild={
              <Dreierbild
                daten={DREI_KUBISCH}
                unter={
                  <>
                    Hochpunkt <Formel tex="H" nach="," /> Wendepunkt <Formel tex="W" /> und Tiefpunkt <Formel tex="T" nach="." /> Die Buchstaben zeigen, welche Punkte in den drei Schaubildern zusammengehören.
                  </>
                }
              />
            }
          >
            <p>
              <Formel tex="f'" /> wechselt bei <Formel tex="x=0" /> von plus nach minus: Hochpunkt <Formel tex={t`H(0\,|\,2)`} nach="." /> Bei <Formel tex="x=2" /> wechselt <Formel tex="f'" /> von minus nach plus: Tiefpunkt <Formel tex={t`T(2\,|\,0)`} nach="." /> An beiden Stellen ist <Formel tex="f'(x)=0" nach="," /> die Tangente ist waagerecht.
            </p>
            <p>
              <Formel tex="f''" /> wechselt bei <Formel tex="x=1" /> von minus nach plus: {KF} wechselt von einer Rechtskurve in eine Linkskurve, bei <Formel tex={t`W(1\,|\,1)`} /> liegt ein Wendepunkt. Dort ist die Tangente nicht waagerecht, es ist <Formel tex={t`f'(1)=-\frac{3}{2}`} nach="." />
            </p>
            <p>
              Im Hochpunkt ist <Formel tex="f''(0)=-3" /> negativ, im Tiefpunkt ist <Formel tex="f''(2)=3" /> positiv. Das passt zur Anschauung: Ein Hochpunkt ist der Gipfel einer Rechtskurve, ein Tiefpunkt der tiefste Punkt einer Linkskurve.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle nacheinander <Formel tex={t`\frac{1}{2}x^3-\frac{3}{2}x^2+2`} /> und <Formel tex={t`-\frac{1}{2}x^3+\frac{3}{2}x^2-2`} nach="." /> Bei welcher der beiden Funktionen hat {KF} an der Wendestelle die kleinste Steigung, bei welcher die größte? Woran erkennst du das an {KDF} und an der Tabelle?
          </p>
          <Beobachtung
            bild={
              <>
                <Dreierbild daten={DREI_KUBISCH_W} unter={<>Die Funktion mit <Formel tex={t`+\frac{1}{2}x^3`} nach=":" /> {KDF} hat bei <Formel tex="W" /> einen Tiefpunkt.</>} />
                <Dreierbild daten={DREI_FALLEND_W} unter={<>Die Funktion mit <Formel tex={t`-\frac{1}{2}x^3`} nach=":" /> {KDF} hat bei <Formel tex="W" /> einen Hochpunkt.</>} />
              </>
            }
          >
            <p>
              Beide Funktionen haben ihre Wendestelle bei <Formel tex="x=1" nach="." /> Dort hat {KDF} einen Extrempunkt, und <Formel tex="f''" /> wechselt das Vorzeichen. Bei <Formel tex={t`+\frac{1}{2}x^3`} /> wechselt <Formel tex="f''" /> von minus nach plus: <Formel tex="f'" /> fällt zuerst und steigt danach, {KDF} hat einen Tiefpunkt. Die Steigung <Formel tex={t`f'(1)=-\frac{3}{2}`} /> ist die <strong>kleinste Steigung</strong>. Bei <Formel tex={t`-\frac{1}{2}x^3`} /> wechselt <Formel tex="f''" /> von plus nach minus, {KDF} hat einen Hochpunkt, und <Formel tex={t`f'(1)=\frac{3}{2}`} /> ist die <strong>größte Steigung</strong>.
            </p>
            <p>
              Eine Wendestelle ist also eine Stelle mit größter oder kleinster Steigung in ihrer Umgebung. Ob die Steigung dort im ganzen Schaubild die größte oder kleinste ist, musst du gesondert prüfen. Hier ist {KDF} eine Parabel: Bei <Formel tex={t`+\frac{1}{2}x^3`} /> ist <Formel tex={t`-\frac{3}{2}`} /> die kleinste Steigung überhaupt, eine größte Steigung gibt es nicht.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle <Formel tex={t`\frac{1}{12}x^4-\frac{1}{3}x^3`} nach="." /> Springe nacheinander zu den Stellen <Formel tex="x_0=0" nach="," /> <Formel tex="x_0=2" /> und <Formel tex="x_0=3" nach="." /> Notiere jeweils <Formel tex="f'" nach="," /> <Formel tex="f''" /> und <Formel tex="f'''" /> bei <Formel tex="x_0" /> und die Vorzeichen links und rechts. Wo liegt ein Extrempunkt, wo ein Wendepunkt? Was ist bei <Formel tex="x_0=0" /> besonders?
          </p>
          <Beobachtung
            bild={
              <Dreierbild
                daten={DREI_SATTEL}
                unter={
                  <>
                    Sattelstelle <Formel tex="S" nach="," /> Wendestelle <Formel tex="W" /> und Tiefpunkt <Formel tex="T" nach="." /> Bei <Formel tex="S" /> berührt {KDF} die x-Achse von unten, {KDDF} schneidet sie.
                  </>
                }
              />
            }
          >
            <ul className="liste">
              <li>
                <Formel tex="x=0" nach=":" /> <Formel tex="f'(0)=0" nach="," /> aber <Formel tex="f'" /> ist links und rechts negativ. Es gibt keinen Vorzeichenwechsel, also keinen Extrempunkt. <Formel tex="f''(0)=0" /> und <Formel tex="f''" /> wechselt von plus nach minus: Hier liegt ein Wendepunkt <Formel tex={t`W(0\,|\,0)`} nach="." /> Weil die Tangente zugleich waagerecht ist, ist es ein <strong>Sattelpunkt</strong>. Es ist <Formel tex="f'''(0)=-2" nach="." />
              </li>
              <li>
                <Formel tex="x=2" nach=":" /> <Formel tex={t`f'(2)=-\frac{4}{3}`} /> ist nicht null. <Formel tex="f''" /> wechselt von minus nach plus, <Formel tex="f'''(2)=2" nach="." /> Wendepunkt <Formel tex={t`W(2\,|\,-\frac{4}{3})`} nach="," /> aber kein Sattelpunkt.
              </li>
              <li>
                <Formel tex="x=3" nach=":" /> <Formel tex="f'" /> wechselt von minus nach plus, <Formel tex="f''(3)=3" /> ist positiv. Tiefpunkt <Formel tex={t`T(3\,|\,-\frac{9}{4})`} nach="." />
              </li>
            </ul>
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle nacheinander <Formel tex={t`\frac{1}{12}x^4`} /> und <Formel tex={t`\frac{1}{20}x^5`} nach="," /> springe jeweils zu <Formel tex="x_0=0" /> und vergleiche. Was haben beide Funktionen bei <Formel tex="x_0=0" /> gemeinsam? Wie unterscheiden sich die Vorzeichen links und rechts? Kannst du allein mit den Werten von <Formel tex="f'" nach="," /> <Formel tex="f''" /> und <Formel tex="f'''" /> bei <Formel tex="x_0" /> entscheiden, welche Art von Stelle vorliegt?
          </p>
          <Beobachtung
            bild={
              <>
                <Dreierbild daten={DREI_VIER} unter={<>Die Funktion <Formel tex={t`\frac{1}{12}x^4`} nach=":" /> Tiefpunkt <Formel tex="T" nach="," /> {KDDF} bleibt positiv.</>} />
                <Dreierbild daten={DREI_FUENF} unter={<>Die Funktion <Formel tex={t`\frac{1}{20}x^5`} nach=":" /> Sattelstelle <Formel tex="S" nach="," /> {KDDF} wechselt das Vorzeichen.</>} />
              </>
            }
          >
            <p>
              Bei beiden Funktionen gilt <Formel tex="f'(0)=0" nach="," /> <Formel tex="f''(0)=0" /> und <Formel tex="f'''(0)=0" nach="." /> Die Werte bei <Formel tex="x_0=0" /> sind gleich, die Stellen sind es nicht.
            </p>
            <ul className="liste">
              <li>
                <Formel tex={t`f(x)=\frac{1}{12}x^4`} nach=":" /> <Formel tex="f'" /> wechselt von minus nach plus, es liegt ein Tiefpunkt vor. <Formel tex="f''(x)=x^2" /> bleibt links und rechts positiv, es gibt keine Wendestelle.
              </li>
              <li>
                <Formel tex={t`f(x)=\frac{1}{20}x^5`} nach=":" /> <Formel tex="f'" /> bleibt positiv, es gibt keinen Extrempunkt. <Formel tex="f''(x)=x^3" /> wechselt von minus nach plus, es liegt ein Wendepunkt mit waagerechter Tangente vor, also ein Sattelpunkt. Dabei ist <Formel tex="f'''(0)=0" nach="." />
              </li>
            </ul>
            <p>
              Ist <Formel tex="f''(x_0)=0" /> an einer Stelle mit waagerechter Tangente, entscheiden die Werte nichts: Dann musst du das Vorzeichen von <Formel tex="f'" /> links und rechts prüfen. Ebenso reicht <Formel tex="f'''(x_0)=0" /> nicht, um eine Wendestelle auszuschließen: Dann prüfst du das Vorzeichen von <Formel tex="f''" nach="." /> Ist dagegen <Formel tex="f'''(x_0)\ne 0" nach="," /> weißt du sofort, dass <Formel tex="f''" /> das Vorzeichen wechselt. Nötig ist das aber nicht, wie <Formel tex={t`\frac{1}{20}x^5`} /> zeigt.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Die Beobachtungen durch Rechnung bestätigen</h3>
      <ol className="auftraege">
        <li>
          <p>
            Untersuche <Formel tex={t`f(x)=\frac{1}{12}x^4-\frac{1}{3}x^3`} /> ohne das Labor: Bestimme die Monotonie- und Krümmungsbereiche und alle Extrem-, Wende- und Sattelpunkte, jeweils mit Nachweis. Schreibe jeden Schritt auf, bevor du die Beobachtung öffnest.
          </p>
          <Beobachtung
            bild={
              <Dreierbild
                daten={DREI_SATTEL}
                unter={
                  <>
                    Dieselbe Funktion wie im Labor: Sattelpunkt <Formel tex="S" nach="," /> Wendepunkt <Formel tex="W" /> und Tiefpunkt <Formel tex="T" nach="." />
                  </>
                }
              />
            }
          >
            <ol className="liste">
              <li>
                <strong>Ableitungen:</strong> <Formel tex={t`f'(x)=\frac{1}{3}x^3-x^2=\frac{1}{3}x^2(x-3)`} nach="," /> <Formel tex={t`f''(x)=x^2-2x=x(x-2)`} nach="," /> <Formel tex="f'''(x)=2x-2" nach="." />
              </li>
              <li>
                <strong>Monotonie:</strong> <Formel tex="f'(x)=0" /> liefert <Formel tex="x=0" /> (doppelte Nullstelle) und <Formel tex="x=3" nach="." /> Testwerte: <Formel tex={t`f'(-1)=-\frac{4}{3}<0`} nach="," /> <Formel tex={t`f'(1)=-\frac{2}{3}<0`} nach="," /> <Formel tex={t`f'(4)=\frac{16}{3}>0`} nach="." /> {KF} ist auf <Formel tex={t`]-\infty;\,3[`} /> streng monoton fallend und auf <Formel tex={t`]3;\,\infty[`} /> streng monoton steigend.
              </li>
              <li>
                <strong>Extrempunkte:</strong> Notwendig ist <Formel tex="f'(x)=0" nach="," /> die Kandidaten sind <Formel tex="x=0" /> und <Formel tex="x=3" nach="." /> Bei <Formel tex="x=3" /> wechselt <Formel tex="f'" /> von minus nach plus, außerdem ist <Formel tex="f''(3)=3>0" nach="." /> Tiefpunkt <Formel tex={t`T(3\,|\,-\frac{9}{4})`} nach="." /> Bei <Formel tex="x=0" /> ist <Formel tex="f''(0)=0" nach="," /> der Test mit <Formel tex="f''" /> entscheidet nicht. Dort wechselt <Formel tex="f'" /> das Vorzeichen nicht: kein Extrempunkt.
              </li>
              <li>
                <strong>Krümmung:</strong> <Formel tex="f''(x)=0" /> liefert <Formel tex="x=0" /> und <Formel tex="x=2" nach="." /> Testwerte: <Formel tex="f''(-1)=3>0" nach="," /> <Formel tex="f''(1)=-1<0" nach="," /> <Formel tex="f''(3)=3>0" nach="." /> {KF} ist auf <Formel tex={t`]-\infty;\,0[`} /> und auf <Formel tex={t`]2;\,\infty[`} /> linksgekrümmt, auf <Formel tex={t`]0;\,2[`} /> rechtsgekrümmt.
              </li>
              <li>
                <strong>Wendepunkte:</strong> Notwendig ist <Formel tex="f''(x)=0" nach="," /> die Kandidaten sind <Formel tex="x=0" /> und <Formel tex="x=2" nach="." /> <Formel tex="f''" /> wechselt bei <Formel tex="x=0" /> von plus nach minus und bei <Formel tex="x=2" /> von minus nach plus, außerdem ist <Formel tex="f'''(0)=-2\ne 0" /> und <Formel tex="f'''(2)=2\ne 0" nach="." /> Wendepunkte <Formel tex={t`W_1(0\,|\,0)`} /> und <Formel tex={t`W_2(2\,|\,-\frac{4}{3})`} nach="." /> Wegen <Formel tex="f'(0)=0" /> ist <Formel tex="W_1" /> ein Sattelpunkt, wegen <Formel tex={t`f'(2)=-\frac{4}{3}\ne 0`} /> ist <Formel tex="W_2" /> keiner.
              </li>
              <li>
                <strong>Steigung:</strong> An den Wendestellen hat <Formel tex="f'" /> Extremstellen: bei <Formel tex="x=0" /> den lokal größten Wert <Formel tex="f'(0)=0" nach="," /> bei <Formel tex="x=2" /> den lokal kleinsten Wert <Formel tex={t`f'(2)=-\frac{4}{3}`} nach="." />
              </li>
            </ol>
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
