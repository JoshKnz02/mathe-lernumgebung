import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_BEISPIEL, BILD_V2 } from './Bilder';

export function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz" titel="Mittelwert einer Funktion">
        <p>
          Der Mittelwert von <Formel tex="f" /> auf <Formel tex="[a;\,b]" /> ist
        </p>
        <Formel anzeige tex={t`m=\frac{1}{b-a}\int_{a}^{b} f(x)\,\mathrm{d}x`} nach="." />
        <ul>
          <li><strong>Rechteck:</strong> <Formel tex="m" /> ist die Höhe des Rechtecks über <Formel tex="[a;\,b]" nach="," /> das denselben orientierten Flächeninhalt hat wie die Fläche unter <Formel tex="K_f" nach="." /> Es gilt <Formel tex={t`m\cdot(b-a)=\int_a^b f(x)\,\mathrm{d}x`} nach="." /></li>
          <li><strong>Ausgleich:</strong> Die Flächen zwischen <Formel tex="K_f" /> und der Geraden <Formel tex="y=m" /> oberhalb und unterhalb sind zusammen gleich groß, das Integral von <Formel tex="f(x)-m" /> ist 0.</li>
          <li><strong>Stelle mit dem Mittelwert:</strong> Ist <Formel tex="f" /> ohne Sprung (Knicke sind erlaubt), nimmt <Formel tex="f" /> den Wert <Formel tex="m" /> an mindestens einer Stelle im Intervall an. Das heißt <strong>Mittelwertsatz der Integralrechnung</strong>.</li>
          <li><strong>Vorzeichen:</strong> <Formel tex="m" /> hat das Vorzeichen des Integrals. Es kann negativ oder 0 sein, auch wenn <Formel tex="f" /> nicht überall 0 ist.</li>
        </ul>
      </Hinweis>

      <h3>Ein vollständiges Beispiel</h3>
      <p>
        Bestimme den Mittelwert von <Formel tex={t`f(x)=\mathrm{e}^{0{,}5x}`} /> auf <Formel tex="[0;\,4]" /> und die Stelle, an der <Formel tex="f" /> ihn annimmt.
      </p>
      <ol>
        <li>
          <strong>Stammfunktion.</strong> <Formel tex={t`F(x)=2\,\mathrm{e}^{0{,}5x}`} nach="," /> denn der Faktor <Formel tex="0{,}5" /> der inneren Funktion wird durch <Formel tex="2" /> ausgeglichen.
        </li>
        <li>
          <strong>Integral.</strong> <Formel tex={t`F(4)=2\,\mathrm{e}^{2}`} /> und <Formel tex={t`F(0)=2`} nach="." /> Also ist
          <Formel anzeige tex={t`\int_0^4 f(x)\,\mathrm{d}x=2\,\mathrm{e}^2-2`} />
          <Formel anzeige tex={t`{}\approx 12{,}78`} nach="." />
        </li>
        <li>
          <strong>Durch die Länge teilen.</strong> Das Intervall hat die Länge 4.
          <Formel anzeige tex={t`m=\frac{2\,\mathrm{e}^2-2}{4}`} />
          <Formel anzeige tex={t`{}=\frac{\mathrm{e}^2-1}{2}`} />
          <Formel anzeige tex={t`{}\approx 3{,}19`} nach="." />
        </li>
        <li>
          <strong>Stelle.</strong> <Formel tex={t`\mathrm{e}^{0{,}5x}=3{,}19`} /> führt mit dem natürlichen Logarithmus auf <Formel tex={t`0{,}5x=\ln 3{,}19\approx 1{,}16`} /> und damit auf <Formel tex={t`x\approx 2{,}32`} nach="." /> Die Stelle liegt im Intervall <Formel tex="[0;\,4]" nach="." />
        </li>
      </ol>
      <FlaechenFigur
        daten={BILD_BEISPIEL}
        unter={
          <>
            Die Fläche unter <Formel tex="K_f" /> und das Rechteck der Höhe <Formel tex={t`m\approx 3{,}19`} /> haben beide den Inhalt <Formel tex={t`\approx 12{,}78`} nach="." />
          </>
        }
      />

      <h3>Mittelwert und Ableitung</h3>
      <p>
        Für den Mittelwert der Ableitung gilt
        <Formel anzeige tex={t`\frac{1}{b-a}\int_a^b f'(x)\,\mathrm{d}x`} />
        <Formel anzeige tex={t`{}=\frac{f(b)-f(a)}{b-a}`} nach="." />
        Der Mittelwert von <Formel tex="f'" /> ist also die durchschnittliche Änderungsrate von <Formel tex="f" /> (Modul <Modulverweis modul="aenderungsraten">Von der mittleren zur momentanen Änderungsrate</Modulverweis>). Beispiel: <Formel tex={t`f(x)=x^3`} /> auf <Formel tex="[0;\,2]" nach="." /> Die durchschnittliche Änderungsrate ist <Formel tex={t`\frac{8-0}{2}=4`} nach="." /> Der Mittelwert von <Formel tex={t`f'(x)=3x^2`} /> ist <Formel tex={t`\frac{1}{2}\int_0^2 3x^2\,\mathrm{d}x=\frac{1}{2}\cdot 8=4`} nach="," /> dasselbe Ergebnis, diesmal über das Integral. Der Wert 4 wird bei <Formel tex={t`x=\sqrt{\frac{4}{3}}\approx 1{,}15`} /> angenommen.
      </p>

      <h3>Ausgleich und Stelle im Schaubild</h3>
      <FlaechenFigur
        daten={BILD_V2}
        unter={
          <>
            Bei <Formel tex={t`f(x)=\frac{1}{4}x^2`} /> auf <Formel tex="[0;\,4]" /> ist <Formel tex={t`m=\frac{4}{3}`} nach="." /> Die rosa und die blaue Fläche haben beide den Inhalt 2,05, und <Formel tex="K_f" /> trifft die Gerade bei <Formel tex={t`x\approx 2{,}31`} nach="." />
          </>
        }
      />

      <h3>Typische Fehler</h3>
      <ul>
        <li><strong>Nicht durch die Länge geteilt:</strong> Das Integral allein ist der Inhalt der Fläche (mit Vorzeichen), nicht der Mittelwert. Beim Mittelwert kommt der Faktor <Formel tex={t`\frac{1}{b-a}`} /> dazu.</li>
        <li><strong>Mittelwert der Randwerte statt der Funktion:</strong> <Formel tex={t`\frac{f(a)+f(b)}{2}`} /> stimmt nur bei Geraden. Bei gekrümmten Schaubildern muss integriert werden.</li>
        <li><strong>Raten ohne Gewichtung gemittelt:</strong> Dauern zwei Raten verschieden lang, zählt die längere stärker. Der Mittelwert ist die Gesamtmenge geteilt durch die Gesamtdauer.</li>
        <li><strong>Mittelwert mit Flächeninhalt verwechselt:</strong> Der Mittelwert rechnet mit dem Integral, Stücke unterhalb der x-Achse zählen negativ. Er kann deshalb 0 oder negativ sein.</li>
        <li><strong>Stelle außerhalb des Intervalls:</strong> Bei <Formel tex="f(x)=m" /> gehören nur Lösungen in <Formel tex="[a;\,b]" /> zur Aufgabe.</li>
      </ul>
    </Abschnitt>
  );
}
