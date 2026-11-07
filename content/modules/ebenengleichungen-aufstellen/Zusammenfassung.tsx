import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { ebeneAusPunktUndGerade } from '@/lib/ebene';
import { t } from '@/lib/modulhilfen';
import { RAUM_ERKLAEREN } from './Bilder';
import { ZUSAMMENFASSUNG } from './daten';
import { gl, gleichungE, gleichungESchmal, punktTeX, spalte } from './rechenhilfen';

export function Zusammenfassung() {
  const z = ZUSAMMENFASSUNG;
  const eb = ebeneAusPunktUndGerade(z.g, z.Q)!;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Was eine Ebene festlegt</h3>
      <Hinweis art="merksatz" titel="Eine Ebene ist festgelegt durch">
        <ul>
          <li>drei Punkte, die nicht auf einer Geraden liegen (siehe <Modulverweis modul="einfuehrung-ebenen">Einführung in Ebenen im Raum</Modulverweis>),</li>
          <li>eine Gerade und einen Punkt, der nicht auf ihr liegt,</li>
          <li>zwei Geraden, die sich in einem Punkt schneiden,</li>
          <li>zwei Geraden, die parallel und verschieden sind.</li>
        </ul>
        Windschiefe Geraden liegen in keiner gemeinsamen Ebene. Identische Geraden und ein Punkt auf der Geraden legen keine eindeutige Ebene fest: Durch eine Gerade gehen unendlich viele Ebenen.
      </Hinweis>

      <h3>Vorgehen</h3>
      <Hinweis art="merksatz" titel="Gerade und Punkt">
        Stützpunkt ist der Stützpunkt <Formel tex="P" /> der Geraden. Erster Spannvektor ist der Richtungsvektor <Formel tex={t`\vec{u}`} /> der Geraden, zweiter Spannvektor ist der Verbindungsvektor <Formel tex={t`\overrightarrow{PQ}`} /> zum Punkt <Formel tex="Q" nach="." /> Zuerst prüfst du, dass <Formel tex="Q" /> nicht auf <Formel tex="g" /> liegt (Punktprobe der Geraden).
      </Hinweis>
      <Hinweis art="merksatz" titel="Zwei Geraden">
        Bestimme zuerst die Lage der Geraden. Schneiden sie sich, sind ihre beiden Richtungsvektoren die Spannvektoren (Stützpunkt von <Formel tex="g" nach=")." /> Sind sie parallel und verschieden, ist der erste Spannvektor der gemeinsame Richtungsvektor und der zweite der Verbindungsvektor <Formel tex={t`\overrightarrow{PQ}`} /> der Stützpunkte. Sind sie windschief, gibt es keine Ebene.
      </Hinweis>
      <Hinweis art="merksatz" titel="Probe">
        Die Spannvektoren dürfen keine Vielfachen voneinander sein. Der Stützpunkt und je ein weiterer Punkt jeder gegebenen Geraden müssen in der Ebene liegen (Punktprobe der Ebene).
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben sind <Formel tex={gl(z.g)} /> und <Formel tex={punktTeX('Q', z.Q)} nach="." /> Der Punkt <Formel tex="Q" /> liegt nicht auf <Formel tex="g" nach=":" /> Die erste Koordinate verlangt <Formel tex="t=0" nach="," /> die zweite Koordinate <Formel tex={t`-3+2t=0`} /> verlangt <Formel tex={t`t=\frac{3}{2}`} nach="." /> Es gibt kein gemeinsames <Formel tex="t" nach="." /> Der zweite Spannvektor ist <Formel tex={t`\overrightarrow{PQ}=${spalte(z.v)}`} nach="." /> Die Gleichung der Ebene:
      </p>
      <Umbruchformel tex={gleichungE(eb)} schmal={gleichungESchmal(eb)} />
      <Figur spec={RAUM_ERKLAEREN} unter={<>Die Gerade <Formel tex="g" nach="," /> der Punkt <Formel tex="Q" /> und die Ebene. Stützvektor orange, Richtungsvektor blau, Verbindungsvektor rosa.</>} />
      <Hinweis titel="Häufige Fehler">
        Den Ortsvektor von <Formel tex="Q" /> als Spannvektor nehmen. Nicht prüfen, ob der Punkt auf der Geraden liegt. Bei parallelen Geraden beide Richtungsvektoren als Spannvektoren nehmen (sie sind Vielfache). Bei windschiefen Geraden trotzdem eine Ebene angeben. Behaupten, dass identische Geraden eine eindeutige Ebene festlegen.
      </Hinweis>
    </Abschnitt>
  );
}
