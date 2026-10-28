import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { SYMMETRIE_FUNKTIONEN, SYMMETRIE_WORT } from '@/lib/diskussion';
import { t } from '@/lib/modulhilfen';
import { BILD_HOCH, BILD_REGEL_GERADE, BILD_REGEL_UNGERADE, bildVerhalten, scharBild } from './Bilder';
import { SYMMETRIE_REGEL, VERMUTUNG_HOCH, VIER_FAELLE } from './daten';
import { Scharlabor } from './Scharlabor';
import { Symmetrielabor } from './Symmetrielabor';
import { Verhaltenslabor } from './Verhaltenslabor';
import { Verhaltenstabelle } from './Verhaltenstabelle';

const KF = <Formel tex="K_f" />;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Eine ganzrationale Funktion besteht aus mehreren Summanden, zum Beispiel <Formel tex={t`f(x)=x^3-20x^2`} nach="." /> Was entscheidet darüber, wie sich <Formel tex="f(x)" /> für sehr große <Formel tex="x" /> verhält: alle Summanden gemeinsam, der erste oder der mit der höchsten Hochzahl? Rechne <Formel tex="f(10)" nach="," /> <Formel tex="f(100)" /> und <Formel tex="f(1000)" /> aus und vergleiche die beiden Summanden.
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_HOCH}
                unter={
                  <>
                    <Formel tex={t`f(x)=x^3-20x^2`} nach=":" /> Zuerst fällt {KF} unter die x-Achse, weil <Formel tex="20x^2" /> größer ist als <Formel tex="x^3" nach="." /> Ab <Formel tex="x=20" /> gewinnt <Formel tex="x^3" nach="," /> und das Schaubild steigt immer steiler.
                  </>
                }
              />
            }
          >
            <table className="tabelle tabelle-kompakt tabelle-breit">
              <caption>Die beiden Summanden von <Formel tex={t`f(x)=x^3-20x^2`} /></caption>
              <thead>
                <tr>
                  <th scope="col"><Formel tex="x" /></th>
                  <th scope="col"><Formel tex="x^3" /></th>
                  <th scope="col"><Formel tex="20x^2" /></th>
                  <th scope="col"><Formel tex="f(x)" /></th>
                </tr>
              </thead>
              <tbody>
                {VERMUTUNG_HOCH.werte.map((w) => (
                  <tr key={w.x}>
                    <td><Formel tex={String(w.x)} /></td>
                    <td><Formel tex={String(w.hoch)} /></td>
                    <td><Formel tex={String(w.klein)} /></td>
                    <td><Formel tex={String(w.f)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Bei <Formel tex="x=10" /> ist <Formel tex="20x^2" /> noch größer, <Formel tex="f(10)" /> ist negativ. Bei <Formel tex="x=100" /> hat <Formel tex="x^3" /> schon den größeren Wert, bei <Formel tex="x=1000" /> ist es das Fünfzigfache von <Formel tex="20x^2" nach="." /> Für sehr große <Formel tex="|x|" /> bestimmt allein der Summand mit der höchsten Hochzahl das Verhalten. Die übrigen Summanden werden unwichtig, auch wenn sie bei kleinen <Formel tex="x" /> überwiegen.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Eine ganzrationale Funktion hat nur Summanden der Form <Formel tex="a\cdot x^n" nach="," /> auch eine Zahl wie 1 zählt dazu, denn <Formel tex="1=1\cdot x^0" nach="." /> Welche Hochzahlen dürfen vorkommen, damit {KF} symmetrisch zur y-Achse ist? Welche, damit es symmetrisch zum Ursprung ist? Prüfe es an <Formel tex={t`x^4-3x^2+1`} nach="," /> <Formel tex={t`x^5-2x^3+x`} nach="," /> <Formel tex={t`x^3+x^2`} nach="," /> <Formel tex={t`x^3+1`} /> und <Formel tex={t`x^4+x`} nach="." /> Rechne dazu <Formel tex="f(-x)" /> aus.
          </p>
          <Beobachtung
            bild={
              <div className="bilder-paar">
                <Bild daten={BILD_REGEL_GERADE} unter={<>Nur gerade Hochzahlen (4, 2 und 0): symmetrisch zur y-Achse.</>} />
                <Bild daten={BILD_REGEL_UNGERADE} unter={<>Nur ungerade Hochzahlen (5, 3 und 1): symmetrisch zum Ursprung.</>} />
              </div>
            }
          >
            <ul className="liste">
              <li><Formel tex={SYMMETRIE_REGEL[0]!.tex} nach=":" /> Hochzahlen 4, 2 und 0, alle gerade. Symmetrisch zur y-Achse.</li>
              <li><Formel tex={SYMMETRIE_REGEL[1]!.tex} nach=":" /> Hochzahlen 5, 3 und 1, alle ungerade. Symmetrisch zum Ursprung.</li>
              <li><Formel tex={SYMMETRIE_REGEL[2]!.tex} nach=":" /> Hochzahlen 3 und 2, gemischt. Keine Symmetrie.</li>
              <li><Formel tex={SYMMETRIE_REGEL[3]!.tex} nach=":" /> Hochzahlen 3 und 0, denn die Zahl hat die gerade Hochzahl 0. Keine Symmetrie.</li>
              <li><Formel tex={SYMMETRIE_REGEL[4]!.tex} nach=":" /> Hochzahlen 4 und 1, gemischt. Keine Symmetrie.</li>
            </ul>
            <p>
              Beim Einsetzen von <Formel tex="-x" /> bleibt <Formel tex="x^n" /> gleich, wenn <Formel tex="n" /> gerade ist, und wechselt das Vorzeichen, wenn <Formel tex="n" /> ungerade ist. Kommen nur gerade Hochzahlen vor, ist <Formel tex="f(-x)=f(x)" nach="." /> Kommen nur ungerade Hochzahlen vor, ist <Formel tex="f(-x)=-f(x)" nach="." /> Bei gemischten Hochzahlen gilt keines von beiden. Eine Zahl ohne <Formel tex="x" /> hat die gerade Hochzahl 0 und verhindert deshalb die Symmetrie zum Ursprung.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Labor zum globalen Verhalten</h3>
      <p>
        Wähle eine Funktion und überlege, wie sich <Formel tex="f(x)" /> für <Formel tex={String.raw`x\to\infty`} /> und für <Formel tex={String.raw`x\to-\infty`} /> verhält. Die Tabelle zeigt die Funktionswerte bei <Formel tex="x=-100" nach="," /> <Formel tex="-10" nach="," /> <Formel tex="10" /> und <Formel tex="100" nach="." /> Notiere deine Vermutung. Danach kannst du das Verhalten in Worten mit Begründung und die Asymptoten einblenden.
      </p>
      <Verhaltenslabor />
      <ol className="auftraege">
        <li>
          <p>
            Wähle nacheinander die vier ganzrationalen Funktionen (die ersten vier). Wie verhält sich <Formel tex="f(x)" /> nach rechts und nach links? Wovon hängt es ab? Achte auf die Hochzahl des Summanden mit der höchsten Hochzahl und auf sein Vorzeichen.
          </p>
          <Beobachtung
            bild={
              <div className="bilder-paar">
                {['grad4-plus', 'grad3-plus', 'grad4-minus', 'grad5-minus'].map((id, i) => (
                  <Bild key={id} daten={bildVerhalten(id)} unter={<>Das Schaubild verläuft {VIER_FAELLE[i]!.verlauf}.</>} />
                ))}
              </div>
            }
          >
            <p>
              Der Summand mit der höchsten Hochzahl heißt Leitglied, sein Faktor der <strong>Leitkoeffizient</strong> <Formel tex="a_n" nach="." /> Zwei Dinge entscheiden: ob der <strong>Grad</strong> <Formel tex="n" /> gerade oder ungerade ist und ob <Formel tex="a_n" /> positiv oder negativ ist.
            </p>
            <Verhaltenstabelle />
            <p>
              Bei geradem Grad enden beide Seiten in dieselbe Richtung, bei ungeradem Grad in entgegengesetzte Richtungen. Der Leitkoeffizient legt fest, ob die rechte Seite nach oben (positiv) oder nach unten (negativ) geht. Ganzrationale Funktionen haben keine Asymptoten und sind nie periodisch.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle nacheinander die vier Funktionen mit <Formel tex="e^x" /> oder <Formel tex="e^{-x}" nach="." /> Blende die Asymptoten ein, nachdem du dich festgelegt hast. Wo gibt es eine Asymptote, nach rechts oder nach links? Ist sie waagerecht oder schief? Was geschieht in die andere Richtung? Welcher Teil des Terms gewinnt bei <Formel tex={t`x\cdot e^{-x}`} /> und bei <Formel tex={t`x^2\cdot e^{x}`} nach="?" />
          </p>
          <Beobachtung
            bild={
              <div className="bilder-paar">
                {['exp-waagerecht', 'x-mal-exp', 'exp-schief', 'x-quadrat-exp'].map((id) => (
                  <Bild key={id} daten={bildVerhalten(id)} unter={<>Mit den Asymptoten (blau gestrichelt).</>} />
                ))}
              </div>
            }
          >
            <ul className="liste">
              <li><Formel tex={t`3-2e^x`} nach=":" /> Für <Formel tex={String.raw`x\to-\infty`} /> geht <Formel tex="e^x" /> gegen 0, also <Formel tex="f(x)\to 3" nach="." /> Waagerechte Asymptote <Formel tex="y=3" /> nach links. Nach rechts geht <Formel tex={String.raw`f(x)\to-\infty`} nach="." /></li>
              <li><Formel tex={t`x\cdot e^{-x}`} nach=":" /> Für <Formel tex={String.raw`x\to\infty`} /> wird <Formel tex="e^{-x}" /> viel schneller klein, als <Formel tex="x" /> wächst: <Formel tex="f(x)\to 0" nach="." /> Waagerechte Asymptote <Formel tex="y=0" /> nach rechts. Nach links geht <Formel tex={String.raw`f(x)\to-\infty`} nach="." /></li>
              <li><Formel tex={t`e^{-x}+2x-1`} nach=":" /> Für <Formel tex={String.raw`x\to\infty`} /> verschwindet <Formel tex="e^{-x}" nach="," /> es bleibt <Formel tex="2x-1" nach="." /> Schiefe Asymptote <Formel tex="y=2x-1" /> nach rechts. Nach links geht <Formel tex={String.raw`f(x)\to\infty`} nach="," /> weil <Formel tex="e^{-x}" /> dort riesig wird.</li>
              <li><Formel tex={t`x^2\cdot e^{x}`} nach=":" /> Für <Formel tex={String.raw`x\to-\infty`} /> geht <Formel tex="e^x" /> schneller gegen 0, als <Formel tex="x^2" /> wächst: <Formel tex="f(x)\to 0" nach="." /> Waagerechte Asymptote <Formel tex="y=0" /> nach links. Nach rechts geht <Formel tex={String.raw`f(x)\to\infty`} nach="." /></li>
            </ul>
            <p>
              Merke: <Formel tex="e^x" /> geht für <Formel tex={String.raw`x\to-\infty`} /> gegen 0, <Formel tex="e^{-x}" /> geht für <Formel tex={String.raw`x\to\infty`} /> gegen 0. In einem Produkt aus einer Potenz von <Formel tex="x" /> und einer solchen e-Funktion gewinnt die e-Funktion. Eine Asymptote gibt es oft nur auf einer Seite, beide Richtungen müssen getrennt untersucht werden. Die Tabelle des Labors zeigt das nur an Beispielen, die Regeln musst du kennen.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle die beiden Funktionen mit dem Sinus. Hat <Formel tex={String.raw`2\sin x`} /> einen Grenzwert, hat es eine Asymptote? Bei <Formel tex={t`x+2\sin x`} nach=":" /> Ist die Gerade <Formel tex="y=x" /> eine Asymptote? Schaue dir dafür den Abstand zwischen <Formel tex="f(x)" /> und <Formel tex="x" /> an.
          </p>
          <Beobachtung
            bild={
              <div className="bilder-paar">
                <Bild daten={bildVerhalten('sinus')} unter={<>Die Werte pendeln zwischen <Formel tex="-2" /> und <Formel tex="2" nach="." /></>} />
                <Bild daten={bildVerhalten('sinus-plus-x')} unter={<>Das Schaubild schwingt um die Gerade <Formel tex="y=x" nach="." /></>} />
              </div>
            }
          >
            <ul className="liste">
              <li><Formel tex={String.raw`2\sin x`} nach=":" /> Die Werte pendeln für immer zwischen <Formel tex="-2" /> und <Formel tex="2" nach="." /> Sie nähern sich keiner Zahl. Es gibt keinen Grenzwert und keine Asymptote.</li>
              <li><Formel tex={t`x+2\sin x`} nach=":" /> Der Abstand zu <Formel tex="y=x" /> ist <Formel tex={String.raw`|2\sin x|`} nach="." /> Er wird immer wieder 2 und nie dauerhaft klein. Also ist <Formel tex="y=x" /> <strong>keine</strong> Asymptote, obwohl <Formel tex="f(x)\to\infty" /> für <Formel tex={String.raw`x\to\infty`} /> und <Formel tex={String.raw`f(x)\to-\infty`} /> für <Formel tex={String.raw`x\to-\infty`} /> gilt.</li>
            </ul>
            <p>
              Ein Summand mit Sinus oder Kosinus bleibt immer im Bereich zwischen seinem größten und kleinsten Wert. Ist noch ein wachsender Summand dabei, bestimmt der das Verhalten. Das Schaubild verläuft dann wellenförmig, es steigt aber nicht überall. Ohne wachsenden Summand entsteht ein periodisches Schaubild ohne Grenzwert.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Labor zur Symmetrie</h3>
      <p>
        Wähle eine Funktion und blende die Spiegelbilder ein. Das Spiegelbild an der y-Achse gehört zur Funktion <Formel tex="f(-x)" nach="," /> das Spiegelbild am Ursprung zu <Formel tex="-f(-x)" nach="." /> Fällt ein Spiegelbild mit {KF} zusammen, liegt die Symmetrie vor. Mit dem Regler vergleichst du <Formel tex="f(x_0)" nach="," /> <Formel tex="f(-x_0)" /> und <Formel tex="-f(x_0)" nach="." /> Symmetrie von Summen und Produkten kennst du aus dem Modul <Modulverweis modul="summe-produkt-funktionen">Summe, Produkt und Verknüpfungen</Modulverweis>.
      </p>
      <Symmetrielabor />
      <ol className="auftraege">
        <li>
          <p>
            Prüfe alle neun Funktionen. Welche sind symmetrisch zur y-Achse, welche zum Ursprung, welche zu keinem von beiden? Wann gilt bei <Formel tex={t`x\cdot e^{-x^2}`} /> die Symmetrie, obwohl nur der Faktor <Formel tex="e^{-x^2}" /> eine Gerade ist? Was fällt bei <Formel tex="e^x" /> und <Formel tex={t`e^x+e^{-x}`} /> auf?
          </p>
          <Beobachtung>
            <table className="tabelle tabelle-kompakt">
              <caption>Symmetrie der Funktionen im Labor</caption>
              <thead>
                <tr>
                  <th scope="col">Funktion</th>
                  <th scope="col">Symmetrie</th>
                </tr>
              </thead>
              <tbody>
                {SYMMETRIE_FUNKTIONEN.map((s) => (
                  <tr key={s.id}>
                    <td><Formel tex={s.tex} /></td>
                    <td>{SYMMETRIE_WORT[s.symmetrie]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="liste">
              <li>Kosinus ist gerade, Sinus ist ungerade. Das siehst du an ihren Schaubildern.</li>
              <li><Formel tex={t`x\cdot e^{-x^2}`} nach=":" /> Der Faktor <Formel tex="x" /> ist ungerade, der Faktor <Formel tex="e^{-x^2}" /> ist gerade, denn <Formel tex="(-x)^2=x^2" nach="." /> Zusammen ist das Produkt ungerade.</li>
              <li><Formel tex={t`e^x+e^{-x}`} nach=":" /> Beim Einsetzen von <Formel tex="-x" /> vertauschen die beiden Summanden ihre Rollen, die Summe bleibt gleich. <Formel tex="e^x" /> allein hat keine Symmetrie: Für <Formel tex="x\ne 0" /> ist <Formel tex={t`e^{-x}\ne e^x`} nach="," /> und wegen <Formel tex="e^x>0" /> ist auch <Formel tex={t`e^{-x}\ne -e^x`} nach="." /></li>
              <li>Die Funktion <Formel tex={t`x^3+1`} /> hat keine Symmetrie zum Ursprung, obwohl <Formel tex="x^3" /> sie hat: Die Zahl 1 hat die gerade Hochzahl 0.</li>
            </ul>
          </Beobachtung>
        </li>
      </ol>

      <h3>Forschungsaufgabe: eine Funktionenschar</h3>
      <p>
        Eine Funktion mit einem Parameter, zum Beispiel <Formel tex={t`f_a(x)=x^4-2ax^2`} nach="," /> beschreibt für jeden Wert von <Formel tex="a" /> eine eigene Funktion. Alle zusammen heißen <strong>Funktionenschar</strong>. Parameter kennst du aus dem Modul <Modulverweis modul="kurvendiskussion" abschnitt="ueberpruefen">Kurvendiskussion</Modulverweis>. Hier geht es darum, die Eigenschaften von <Formel tex="K_{f_a}" /> in Abhängigkeit von <Formel tex="a" /> zu finden. Verschiebe den Regler, markiere die besonderen Punkte und achte vor allem auf den Wechsel zwischen positiven und negativen Werten von <Formel tex="a" nach="." />
      </p>
      <Scharlabor />
      <ol className="auftraege">
        <li>
          <p>
            Sammle möglichst viele Eigenschaften: Symmetrie, Anzahl der Nullstellen, Extrempunkte und Wendepunkte, jeweils für <Formel tex="a>0" nach="," /> <Formel tex="a=0" /> und <Formel tex="a<0" nach="." /> Wie hängen die Koordinaten der Tiefpunkte und der Wendepunkte von <Formel tex="a" /> ab? Schreibe Vermutungen auf, bevor du die Beobachtung öffnest.
          </p>
          <Beobachtung
            bild={
              <div className="bilder-paar">
                <Bild daten={scharBild(2)} unter={<>Für <Formel tex="a=2" nach=":" /> drei Nullstellen, Hochpunkt, zwei Tiefpunkte und zwei Wendepunkte.</>} />
                <Bild daten={scharBild(0)} unter={<>Für <Formel tex="a=0" nach=":" /> nur ein Tiefpunkt im Ursprung, <Formel tex="f_0(x)=x^4" nach="." /></>} />
              </div>
            }
          >
            <p>
              Für jedes <Formel tex="a" /> ist {KF} symmetrisch zur y-Achse. Weiter gilt:
            </p>
            <ul className="liste">
              <li>
                <strong>Für <Formel tex="a>0" nach=":" /></strong> Drei Nullstellen <Formel tex="x=0" /> und <Formel tex={t`x=\pm\sqrt{2a}`} nach="." /> Extrempunkte: der Hochpunkt <Formel tex={t`H(0\,|\,0)`} /> und die Tiefpunkte <Formel tex={t`T\left(\pm\sqrt{a}\,\middle|\,-a^2\right)`} nach="." /> Zwei Wendepunkte <Formel tex={t`W\left(\pm\sqrt{\frac{a}{3}}\,\middle|\,-\frac{5}{9}a^2\right)`} nach="." />
              </li>
              <li>
                <strong>Für <Formel tex="a=0" nach=":" /></strong> Eine Nullstelle <Formel tex="x=0" nach="," /> der Tiefpunkt <Formel tex={t`T(0\,|\,0)`} /> und kein Wendepunkt.
              </li>
              <li>
                <strong>Für <Formel tex="a<0" nach=":" /></strong> Eine Nullstelle <Formel tex="x=0" nach="," /> der Tiefpunkt <Formel tex={t`T(0\,|\,0)`} /> und kein Wendepunkt.
              </li>
            </ul>
            <p>
              Die Fälle unterscheiden sich, weil <Formel tex="x^2=2a" /> und <Formel tex="x^2=a" /> nur für <Formel tex="a>0" /> Lösungen haben. Bei <Formel tex="a=0" /> ist <Formel tex="f_0(x)=x^4" nach="," /> der Ursprung ist ein Tiefpunkt, aber kein Wendepunkt. Alle Tiefpunkte für <Formel tex="a>0" /> liegen unter der x-Achse.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Weise deine Vermutungen jetzt rechnerisch nach, jeweils mit Fallunterscheidung nach dem Vorzeichen von <Formel tex="a" nach="." /> Schreibe jeden Schritt auf, bevor du die Beobachtung öffnest.
          </p>
          <Beobachtung bild={<Bild daten={scharBild(3)} unter={<>Für <Formel tex="a=3" nach=":" /> Nullstellen <Formel tex={t`\pm\sqrt{6}`} nach="," /> Tiefpunkte <Formel tex={t`T(\pm\sqrt{3}\,|\,-9)`} nach="," /> Wendepunkte <Formel tex={t`W(\pm 1\,|\,-5)`} nach="." /></>} />}>
            <ol className="liste">
              <li>
                <strong>Ableitungen:</strong> <Formel tex={t`f_a'(x)=4x^3-4ax=4x(x^2-a)`} nach="," /> <Formel tex={t`f_a''(x)=12x^2-4a`} nach="," /> <Formel tex={t`f_a'''(x)=24x`} nach="." />
              </li>
              <li>
                <strong>Symmetrie:</strong> <Formel tex={t`f_a(-x)=(-x)^4-2a(-x)^2=x^4-2ax^2=f_a(x)`} nach="." /> Für jedes <Formel tex="a" /> ist {KF} symmetrisch zur y-Achse.
              </li>
              <li>
                <strong>Nullstellen:</strong> <Formel tex={t`x^2(x^2-2a)=0`} /> liefert <Formel tex="x=0" /> oder <Formel tex="x^2=2a" nach="." /> Für <Formel tex="a>0" /> gibt es zusätzlich <Formel tex={t`x=\pm\sqrt{2a}`} nach="." /> Für <Formel tex={t`a\le 0`} /> hat <Formel tex="x^2=2a" /> keine weitere Lösung.
              </li>
              <li>
                <strong>Extrempunkte:</strong> <Formel tex="f_a'(x)=0" /> liefert <Formel tex="x=0" /> oder <Formel tex="x^2=a" nach="." /> Es ist <Formel tex="f_a''(0)=-4a" nach="." /> Für <Formel tex="a>0" /> ist das negativ: Hochpunkt <Formel tex={t`H(0\,|\,0)`} nach="." /> Für <Formel tex="a<0" /> ist es positiv: Tiefpunkt <Formel tex={t`T(0\,|\,0)`} nach="." /> Für <Formel tex="a=0" /> ist <Formel tex="f_0''(0)=0" nach="," /> der Test entscheidet nichts. Dort ist <Formel tex={t`f_0'(x)=4x^3`} nach="," /> das wechselt von minus nach plus: Tiefpunkt <Formel tex={t`T(0\,|\,0)`} nach="." /> Für <Formel tex="a>0" /> kommt <Formel tex={t`x=\pm\sqrt{a}`} /> hinzu mit <Formel tex={t`f_a''(\pm\sqrt{a})=12a-4a=8a>0`} nach="." /> Das sind Tiefpunkte <Formel tex={t`T(\pm\sqrt{a}\,|\,-a^2)`} nach="," /> denn <Formel tex={t`f_a(\sqrt{a})=a^2-2a\cdot a=-a^2`} nach="." />
              </li>
              <li>
                <strong>Wendepunkte:</strong> <Formel tex="f_a''(x)=0" /> liefert <Formel tex={t`x^2=\frac{a}{3}`} nach="." /> Für <Formel tex="a>0" /> sind das <Formel tex={t`x=\pm\sqrt{\frac{a}{3}}`} nach="," /> und <Formel tex={t`f_a'''(\pm\sqrt{\frac{a}{3}})\ne 0`} nach="." /> Mit <Formel tex={t`f_a\!\left(\sqrt{\frac{a}{3}}\right)=\frac{a^2}{9}-\frac{2a^2}{3}=-\frac{5}{9}a^2`} /> ergeben sich die Wendepunkte <Formel tex={t`W\!\left(\pm\sqrt{\frac{a}{3}}\,\middle|\,-\frac{5}{9}a^2\right)`} nach="." /> Für <Formel tex="a<0" /> hat <Formel tex="x^2=\frac{a}{3}" /> keine Lösung. Für <Formel tex="a=0" /> ist <Formel tex="f_0''(x)=12x^2" /> bei <Formel tex="x=0" /> null, aber links und rechts positiv: kein Wendepunkt.
              </li>
            </ol>
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
