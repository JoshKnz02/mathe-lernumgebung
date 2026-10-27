import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { Rechenkette } from '@/components/Rechenkette';
import { KETTEN_BEISPIELE } from '@/lib/regeln';
import { t, zt } from '@/lib/modulhilfen';
import { BILD_LN, BILD_SIN2, BILD_XEXP } from './Bilder';
import { PRODUKT_TABELLE } from './daten';
import { Kettenlabor } from './Kettenlabor';
import { ProduktRechteck } from './ProduktRechteck';
import { Produktlabor } from './Produktlabor';

const r4 = (x: number) => zt(Math.round(x * 10000) / 10000);
const hoch4 = (v: number) => v ** 4;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Die Funktion <Formel tex={t`f(x)=x^2\cdot x^3`} /> kannst du vereinfachen und mit der Potenzregel ableiten. Ist die Ableitung des Produkts gleich dem Produkt der Ableitungen, also <Formel tex={t`(x^2)'\cdot(x^3)'`} nach="?" />
          </p>
          <Beobachtung>
            Es ist <Formel tex="x^2\cdot x^3=x^5" /> mit der Ableitung <Formel tex="5x^4" nach="." /> Das Produkt der Ableitungen ist <Formel tex={t`2x\cdot 3x^2=6x^3`} nach="." /> Die beiden Terme sind verschieden. Ein Produkt wird nicht faktorweise abgeleitet.
          </Beobachtung>
        </li>
        <li>
          <p>
            Das Schaubild von <Formel tex={t`\sin(2x)`} /> entsteht aus dem von <Formel tex={t`\sin x`} /> durch Stauchen in x-Richtung auf die Hälfte. Wie ändern sich dadurch die Steigungen? Wie lautet dann die Ableitung von <Formel tex={t`\sin(2x)`} nach="?" />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_SIN2}
                unter={
                  <>
                    Blau: <Formel tex={t`\sin x`} nach="," /> orange: <Formel tex={t`\sin(2x)`} nach="," /> schwarz gestrichelt: Tangente an <Formel tex={t`\sin(2x)`} /> im Ursprung mit der Steigung 2.
                  </>
                }
              />
            }
          >
            Das Schaubild schwingt doppelt so schnell. Alle Steigungen sind doppelt so groß. Im Ursprung ist die Steigung 2 statt 1. Das passt zu <Formel tex={t`(\sin(2x))'=2\cos(2x)`} nach="." /> Die Ableitung hat den Faktor 2 zusätzlich, den die innere Funktion <Formel tex="2x" /> liefert.
          </Beobachtung>
        </li>
      </ol>

      <h3>Die Produktregel</h3>
      <p>
        In der Tabelle wurde jedes Produkt <Formel tex={t`f=u\cdot v`} /> zuerst ausmultipliziert und dann mit den bekannten Regeln abgeleitet.
      </p>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Produkte und ihre Ableitungen</caption>
        <thead>
          <tr>
            <th scope="col"><Formel tex="u(x)" /></th>
            <th scope="col"><Formel tex="u'(x)" /></th>
            <th scope="col"><Formel tex="v(x)" /></th>
            <th scope="col"><Formel tex="v'(x)" /></th>
            <th scope="col"><Formel tex={t`f(x)=u(x)\cdot v(x)`} /></th>
            <th scope="col"><Formel tex="f'(x)" /></th>
          </tr>
        </thead>
        <tbody>
          {PRODUKT_TABELLE.map((z, i) => (
            <tr key={i}>
              <td><Formel tex={z.utex} /></td>
              <td><Formel tex={z.dutex} /></td>
              <td><Formel tex={z.vtex} /></td>
              <td><Formel tex={z.dvtex} /></td>
              <td><Formel tex={z.ftex} /></td>
              <td><Formel tex={z.dftex} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <ol className="auftraege">
        <li>
          <p>
            Ist <Formel tex="f'" /> das Produkt <Formel tex={t`u'\cdot v'`} nach="?" /> Prüfe es an mindestens zwei Zeilen.
          </p>
          <Beobachtung>
            Nein. In der zweiten Zeile ist <Formel tex={t`u'\cdot v'=2x\cdot 3x^2=6x^3`} nach="," /> aber <Formel tex="f'(x)=5x^4" nach="." /> In der ersten Zeile ist <Formel tex={t`u'\cdot v'=1\cdot 2x=2x`} nach="," /> aber <Formel tex="f'(x)=3x^2+3" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Finde eine Rechenvorschrift, die aus <Formel tex="u" nach="," /> <Formel tex="u'" nach="," /> <Formel tex="v" /> und <Formel tex="v'" /> die Ableitung <Formel tex="f'" /> erzeugt. Probiere an der zweiten Zeile, in der <Formel tex="u=x^2" /> und <Formel tex="v=x^3" /> ist. Tipp: Es kommen zwei Summanden vor.
          </p>
          <Beobachtung
            bild={
              <figure className="bild">
                <ProduktRechteck />
                <figcaption>
                  Ein Rechteck mit den Seiten <Formel tex="u" /> und <Formel tex="v" nach="." /> Wächst <Formel tex="x" /> ein wenig, wächst <Formel tex="u" /> um <Formel tex={t`\Delta u`} /> und <Formel tex="v" /> um <Formel tex={t`\Delta v`} nach="." /> Die Fläche nimmt um <Formel tex={t`\Delta u\cdot v`} /> (blau) und <Formel tex={t`u\cdot\Delta v`} /> (grün) zu. Das graue Eckstück <Formel tex={t`\Delta u\cdot\Delta v`} /> ist so klein, dass es beim Grenzübergang wegfällt.
                </figcaption>
              </figure>
            }
          >
            Es ist <Formel tex={t`u'\cdot v+u\cdot v'=2x\cdot x^3+x^2\cdot 3x^2=2x^4+3x^4=5x^4`} nach="." /> Das stimmt mit <Formel tex="f'(x)=5x^4" /> überein. Die Zeile 1 passt auch: <Formel tex={t`1\cdot(x^2+3)+x\cdot 2x=3x^2+3`} nach="." /> Es gilt die <strong>Produktregel</strong>
            <Formel anzeige tex={t`(u\cdot v)'=u'\cdot v+u\cdot v'`} nach="." />
            Das Rechteck zeigt, warum: Die Fläche <Formel tex={t`u\cdot v`} /> wächst um zwei Streifen. Der Zuwachs von <Formel tex="u" /> wird mit <Formel tex="v" /> multipliziert, der von <Formel tex="v" /> mit <Formel tex="u" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Prüfe die Produktregel an Produkten, die du nicht ausmultiplizieren kannst. Wähle im Labor <Formel tex={t`x\cdot e^x`} /> und <Formel tex="x_0=1" nach="." /> Welche Rechnung stimmt mit der gemessenen Steigung überein?
          </p>
        </li>
      </ol>
      <Produktlabor />
      <Beobachtung
        bild={
          <Bild
            daten={BILD_XEXP}
            unter={
              <>
                Orange: <Formel tex="x\cdot e^x" nach="," /> blau gestrichelt: Tangente im Punkt <Formel tex="P(1\,|\,e)" /> mit der Steigung <Formel tex="2e" nach="," /> grün gestrichelt: die falsche Rechnung mit der Steigung <Formel tex="e" nach="." />
              </>
            }
          />
        }
      >
        Mit <Formel tex="u(x)=x" /> und <Formel tex="v(x)=e^x" /> ist <Formel tex={t`u'\cdot v+u\cdot v'=1\cdot e^x+x\cdot e^x=(1+x)e^x`} nach="." /> Bei <Formel tex="x=1" /> ist das <Formel tex="2e\approx 5{,}44" nach="." /> Das faktorweise Ableiten gäbe <Formel tex={t`1\cdot e^1=e\approx 2{,}72`} nach="," /> die Hälfte, und die gestrichelte grüne Gerade wäre keine Tangente. Die Produktregel stimmt in allen Beispielen des Labors mit der gemessenen Steigung überein.
      </Beobachtung>

      <h3>Die Kettenregel</h3>
      <p>
        In der Tabelle stehen verkettete Funktionen <Formel tex="f(x)=u(v(x))" /> mit ihren Ableitungen. Die Ableitungen wurden mit einem Rechner bestimmt.
      </p>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Verkettungen und ihre Ableitungen</caption>
        <thead>
          <tr>
            <th scope="col"><Formel tex="f(x)" /></th>
            <th scope="col"><Formel tex="u(v)" /></th>
            <th scope="col"><Formel tex="u'(v)" /></th>
            <th scope="col"><Formel tex="v(x)" /></th>
            <th scope="col"><Formel tex="v'(x)" /></th>
            <th scope="col"><Formel tex="f'(x)" /></th>
          </tr>
        </thead>
        <tbody>
          {KETTEN_BEISPIELE.map((k) => (
            <tr key={k.id}>
              <td><Formel tex={k.fTex} /></td>
              <td><Formel tex={k.uTex} /></td>
              <td><Formel tex={k.duTex} /></td>
              <td><Formel tex={k.vTex} /></td>
              <td><Formel tex={k.dvTex} /></td>
              <td><Formel tex={k.dfTex} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <ol className="auftraege">
        <li>
          <p>
            Analysiere die Tabelle. Wie entsteht <Formel tex="f'(x)" /> aus <Formel tex="u'(v)" /> und <Formel tex="v'(x)" nach="?" /> Formuliere die Regel zuerst in Worten.
          </p>
          <Beobachtung>
            In jeder Zeile ist <Formel tex="f'(x)" /> das Produkt aus der Ableitung der äußeren Funktion, an der Stelle <Formel tex="v(x)" /> genommen, und der Ableitung der inneren Funktion. Zum Beispiel <Formel tex={t`(e^{3x})'=e^{3x}\cdot 3`} /> und <Formel tex={t`\bigl((2x+1)^4\bigr)'=4(2x+1)^3\cdot 2=8(2x+1)^3`} nach="." /> Es gilt die <strong>Kettenregel</strong>
            <Formel anzeige tex={t`f'(x)=u'(v(x))\cdot v'(x)`} nach="." />
            Merkregel: <strong>äußere Ableitung mal innere Ableitung</strong>. Beim Einsetzen von <Formel tex="v(x)" /> in <Formel tex="u'" /> bleibt der Term der inneren Funktion unverändert.
          </Beobachtung>
        </li>
        <li>
          <p>
            Warum werden die Ableitungen multipliziert und nicht addiert? Überlege am Beispiel <Formel tex="f(x)=(2x+1)^4" /> an der Stelle <Formel tex="x=1" nach="." /> Ändert sich <Formel tex="x" /> ein wenig, ändert sich zuerst <Formel tex="v" /> und dann <Formel tex="u" nach="." />
          </p>
          <Beobachtung
            bild={
              <>
                <Rechenkette
                  eingabe={<Formel tex="x=1" />}
                  schritte={[
                    { name: <Formel tex="v" />, vorschrift: <Formel tex="v(x)=2x+1" />, ergebnis: <Formel tex="3" /> },
                    { name: <Formel tex="u" />, vorschrift: <Formel tex="u(v)=v^4" />, ergebnis: <Formel tex="81" /> },
                  ]}
                  beschreibung="Für x gleich 1 ist v gleich 3 und u von v gleich 81."
                />
                <Rechenkette
                  eingabe={<Formel tex="x=1{,}001" />}
                  schritte={[
                    { name: <Formel tex="v" />, vorschrift: <Formel tex="v(x)=2x+1" />, ergebnis: <Formel tex="3{,}002" /> },
                    { name: <Formel tex="u" />, vorschrift: <Formel tex="u(v)=v^4" />, ergebnis: <Formel tex={r4(hoch4(3.002))} /> },
                  ]}
                  beschreibung={`Für x gleich 1,001 ist v gleich 3,002 und u von v gleich ${r4(hoch4(3.002))}.`}
                />
              </>
            }
          >
            Wächst <Formel tex="x" /> um <Formel tex="0{,}001" nach="," /> wächst <Formel tex="v" /> um <Formel tex="2\cdot 0{,}001=0{,}002" /> (Faktor <Formel tex="v'=2" nach=")." /> Dieser Zuwachs wirkt auf <Formel tex="u" /> weiter: <Formel tex="u" /> wächst um etwa <Formel tex={t`u'(3)\cdot 0{,}002=108\cdot 0{,}002=0{,}216`} nach="," /> tatsächlich um <Formel tex={r4(hoch4(3.002) - 81)} nach="." /> Zusammen wächst <Formel tex="u" /> etwa um <Formel tex={t`108\cdot 2=216`} /> mal so viel wie <Formel tex="x" nach="." /> Die Änderungsraten werden multipliziert.
          </Beobachtung>
        </li>
        <li>
          <p>
            Prüfe die Regel mit dem Labor. Der Vergleich zeigt auch, was passiert, wenn man nur die äußere oder nur die innere Ableitung nimmt.
          </p>
        </li>
      </ol>
      <Kettenlabor />
      <ol className="auftraege">
        <li>
          <p>
            <strong>Kette in der Kette.</strong> Bei <Formel tex="f(x)=(1-e^{-x})^2" /> ist die innere Funktion <Formel tex="v(x)=1-e^{-x}" /> selbst verkettet. Wie bestimmst du <Formel tex="v'(x)" nach="?" />
          </p>
          <Beobachtung>
            Für <Formel tex="v(x)=1-e^{-x}" /> ist <Formel tex="e^{-x}" /> eine Verkettung mit der inneren Funktion <Formel tex="-x" /> und der Ableitung <Formel tex="-1" nach="." /> Also ist <Formel tex={t`(e^{-x})'=e^{-x}\cdot(-1)=-e^{-x}`} /> und <Formel tex={t`v'(x)=-(-e^{-x})=e^{-x}`} nach="." /> Mit <Formel tex="u'(v)=2v" /> folgt
            <Formel anzeige tex={t`f'(x)=2(1-e^{-x})\cdot e^{-x}`} nach="." />
            Die Kettenregel kann mehrmals nacheinander angewendet werden, von außen nach innen.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Ableitung des natürlichen Logarithmus.</strong> Es gilt <Formel tex="e^{\ln x}=x" /> für <Formel tex="x>0" nach="." /> Leite beide Seiten ab, die linke mit der Kettenregel. Was folgt für <Formel tex={t`(\ln x)'`} nach="?" />
          </p>
          <Beobachtung
            bild={
              <Bild
                daten={BILD_LN}
                unter={
                  <>
                    Orange: <Formel tex={t`\ln x`} nach="," /> grün: <Formel tex={t`\frac{1}{x}`} nach="," /> blau gestrichelt: Tangente im Punkt <Formel tex={t`P(2\,|\,\ln 2)`} /> mit der Steigung <Formel tex={t`\frac{1}{2}`} nach="." />
                  </>
                }
              />
            }
          >
            Die äußere Funktion ist <Formel tex="e^v" /> mit <Formel tex="v=\ln x" nach="." /> Die Kettenregel gibt <Formel tex={t`(e^{\ln x})'=e^{\ln x}\cdot(\ln x)'`} nach="." /> Die rechte Seite <Formel tex="x" /> hat die Ableitung <Formel tex="1" nach="." /> Also ist <Formel tex={t`e^{\ln x}\cdot(\ln x)'=1`} nach="," /> und wegen <Formel tex="e^{\ln x}=x" /> folgt
            <Formel anzeige tex={t`(\ln x)'=\frac{1}{x}`} nach="." />
            Bei <Formel tex="x=2" /> ist die Steigung <Formel tex={t`\frac{1}{2}`} nach="," /> wie im Schaubild.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Brüche.</strong> Wie kannst du <Formel tex={t`f(x)=\frac{x^2}{x+1}`} /> ableiten, wenn du nur Produkt- und Kettenregel kennst? Tipp: Schreibe den Bruch als Produkt.
          </p>
          <Beobachtung>
            Es ist <Formel tex={t`f(x)=x^2\cdot(x+1)^{-1}`} nach="." /> Für den zweiten Faktor gilt nach der Kettenregel <Formel tex={t`\bigl((x+1)^{-1}\bigr)'=-(x+1)^{-2}\cdot 1`} nach="." /> Mit der Produktregel folgt
            <Formel anzeige tex={t`f'(x)=2x\cdot(x+1)^{-1}+x^2\cdot\bigl(-(x+1)^{-2}\bigr)=\frac{2x(x+1)-x^2}{(x+1)^2}=\frac{x^2+2x}{(x+1)^2}`} nach="." />
            Brüche lassen sich so als Kombination von Produkt- und Kettenregel ableiten.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
