import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { t } from '@/lib/modulhilfen';
import { PAAR_EXTREMA, PAAR_MONOTONIE, PAAR_SATTELAB, PAAR_SATTELAUF, PAAR_SINUS, PAAR_WENDE } from './Bilder';
import { Paarbild } from './Paarbild';
import { Spurlabor } from './Spurlabor';

const KF = <Formel tex="K_f" />;
const KDF = <Formel tex="K_{f'}" />;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            In einem Hochpunkt und in einem Tiefpunkt von {KF} ist die Tangente waagerecht. Welchen Wert hat dort <Formel tex="f'" nach="?" /> Wechselt <Formel tex="f'" /> in der Nähe das Vorzeichen? Wenn ja, in welcher Richtung beim Hochpunkt und in welcher beim Tiefpunkt?
          </p>
          <Beobachtung
            bild={
              <Paarbild
                daten={PAAR_EXTREMA}
                unter={
                  <>
                    Oben {KF} mit Hochpunkt <Formel tex="H" /> und Tiefpunkt <Formel tex="T" nach="," /> darunter <Formel tex="K_{f'}" nach="." /> Die Buchstaben zeigen, welche Punkte zusammengehören.
                  </>
                }
              />
            }
          >
            Die Tangente ist waagerecht, also ist <Formel tex="f'(x)=0" nach="." /> {KDF} hat dort eine Nullstelle. Vor einem Hochpunkt steigt <Formel tex="K_f" nach="," /> dort ist <Formel tex="f'>0" nach="." /> Nach dem Hochpunkt fällt <Formel tex="K_f" nach="," /> dort ist <Formel tex="f'<0" nach="." /> Bei einem Hochpunkt wechselt <Formel tex="f'" /> also das Vorzeichen von plus nach minus. Bei einem Tiefpunkt ist es umgekehrt: von minus nach plus.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wo {KF} steigt: Liegt {KDF} dort oberhalb oder unterhalb der x-Achse? Und wo {KF} fällt? Überlege auch, was an einer Stelle gelten könnte, an der {KF} steigt und trotzdem eine waagerechte Tangente hat.
          </p>
          <Beobachtung
            bild={
              <Paarbild
                daten={PAAR_MONOTONIE}
                unter={
                  <>
                    Auf der x-Achse sind die Bereiche blau markiert, in denen {KF} steigt, und schwarz, in denen {KF} fällt. Bei <Formel tex="S" /> hat {KF} eine waagerechte Tangente und steigt davor und danach.
                  </>
                }
              />
            }
          >
            Wo {KF} steigt, haben die Tangenten positive Steigung: {KDF} liegt oberhalb der x-Achse, es gilt <Formel tex={t`f'(x)\ge 0`} nach="." /> Wo {KF} fällt, ist die Steigung negativ: {KDF} liegt unterhalb der x-Achse, es gilt <Formel tex={t`f'(x)\le 0`} nach="." /> Das Gleichheitszeichen braucht man für Stellen wie <Formel tex="S" nach=":" /> Dort steigt {KF} weiter, die Tangente ist aber waagerecht, also ist <Formel tex="f'(x)=0" nach="." /> Gilt in einem Bereich sogar <Formel tex="f'(x)>0" nach="," /> ist {KF} dort streng monoton steigend.
          </Beobachtung>
        </li>
      </ol>

      <h3><Formel tex="K_{f'}" /> entsteht Schritt für Schritt</h3>
      <p>
        Im Labor verschiebst du die Tangente an {KF} (oben). Darunter entsteht links von der Stelle <Formel tex="x_0" /> das Schaubild {KDF} als Spur. Mit „ganzes Schaubild zeigen“ siehst du die ganze Kurve, mit „besondere Stellen markieren“ die Stellen <Formel tex="H" nach="," /> <Formel tex="T" nach="," /> <Formel tex="W" /> und <Formel tex="S" nach="." />
      </p>
      <Spurlabor />
      <ol className="auftraege">
        <li>
          <p>
            Wähle <Formel tex={t`\frac{1}{4}x^4-2x^2`} nach="." /> Das Schaubild {KF} hat zwei Wendestellen. Fahre mit der Tangente durch eine Wendestelle und beobachte, wie sich die Steigung ändert. Was ist an {KDF} bei den Wendestellen besonders?
          </p>
          <Beobachtung
            bild={
              <Paarbild
                daten={PAAR_WENDE}
                unter={
                  <>
                    Oben {KF} mit den Wendestellen <Formel tex="W" /> bei etwa <Formel tex={t`\pm 1{,}15`} nach="," /> darunter {KDF} mit je einem Extrempunkt dort.
                  </>
                }
              />
            }
          >
            <p>
              Bei den Wendestellen hat {KDF} einen Extrempunkt: bei <Formel tex={t`x\approx -1{,}15`} /> einen Hochpunkt, bei <Formel tex={t`x\approx 1{,}15`} /> einen Tiefpunkt. Die Wendestellen von {KF} sind die <strong>Extremstellen</strong> von <Formel tex="K_{f'}" nach="." />
            </p>
            <p>
              Das passt zur Krümmung: In einer Linkskurve wird die Steigung der Tangente größer, <Formel tex="f'" /> steigt. In einer Rechtskurve wird die Steigung kleiner, <Formel tex="f'" /> fällt. An der Wendestelle wechselt die Krümmung, dort ist die Steigung am größten oder am kleinsten. Eine Wendestelle ist also keine Nullstelle von <Formel tex="f'" nach="," /> sondern eine Stelle, an der {KDF} umkehrt.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle <Formel tex={t`\frac{1}{4}x^4-\frac{3}{2}x^2+2x`} nach="." /> Bei <Formel tex="x=1" /> hat {KF} eine waagerechte Tangente, aber keinen Extrempunkt. Was zeigt {KDF} dort, und wie unterscheidet sich das von der Stelle <Formel tex="x=-2" nach="?" /> Wähle danach die Funktion mit der absteigenden Sattelstelle und beschreibe, was sich ändert.
          </p>
          <Beobachtung
            bild={
              <div className="bilder-paar">
                <Paarbild daten={PAAR_SATTELAUF} unter={<>Aufsteigende Sattelstelle <Formel tex="S" /> bei <Formel tex="x=1" nach=":" /> {KDF} bleibt positiv.</>} />
                <Paarbild daten={PAAR_SATTELAB} unter={<>Absteigende Sattelstelle <Formel tex="S" /> bei <Formel tex="x=1" nach=":" /> {KDF} bleibt negativ.</>} />
              </div>
            }
          >
            <p>
              Bei der aufsteigenden Sattelstelle ist <Formel tex="f'(1)=0" nach="," /> aber <Formel tex="f'" /> bleibt links und rechts davon positiv. {KDF} berührt die x-Achse von oben: Es hat dort einen <strong>Tiefpunkt auf der x-Achse</strong>, eine Nullstelle ohne Vorzeichenwechsel. Bei der absteigenden Sattelstelle bleibt <Formel tex="f'" /> negativ, {KDF} hat einen <strong>Hochpunkt auf der x-Achse</strong>.
            </p>
            <p>
              Eine Nullstelle von <Formel tex="f'" /> allein reicht also nicht für einen Extrempunkt von <Formel tex="K_f" nach="." /> Entscheidend ist der <strong>Vorzeichenwechsel</strong>: Bei <Formel tex="x=-2" /> wechselt <Formel tex="f'" /> von minus nach plus, dort liegt ein Tiefpunkt von <Formel tex="K_f" nach="." />
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Prüfe deine Beobachtungen am Sinus. Wähle <Formel tex={t`\sin x`} nach="." /> Wo liegen die Hochpunkte, die Tiefpunkte und die Wendestellen von <Formel tex="K_f" nach="," /> und was zeigt {KDF} dort?
          </p>
          <Beobachtung
            bild={
              <Paarbild
                daten={PAAR_SINUS}
                unter={
                  <>
                    Oben der Sinus mit Hochpunkten, Tiefpunkten und Wendestellen, darunter <Formel tex="K_{f'}" nach="." /> Es ist der Kosinus.
                  </>
                }
              />
            }
          >
            Die Hochpunkte bei <Formel tex={t`-\frac{3\pi}{2}`} /> und <Formel tex={t`\frac{\pi}{2}`} /> sind Nullstellen des Kosinus mit Vorzeichenwechsel von plus nach minus. Die Tiefpunkte bei <Formel tex={t`-\frac{\pi}{2}`} /> und <Formel tex={t`\frac{3\pi}{2}`} /> sind Nullstellen mit Vorzeichenwechsel von minus nach plus. Bei den Wendestellen <Formel tex={t`-2\pi`} nach="," /> <Formel tex={t`-\pi`} nach="," /> <Formel tex="0" nach="," /> <Formel tex={t`\pi`} /> und <Formel tex={t`2\pi`} /> hat der Kosinus seine Hoch- und Tiefpunkte mit den Werten 1 und <Formel tex="-1" nach="." /> Die Regeln gelten also auch für den Sinus.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
