import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { KontrollFigur } from '@/components/Raumfigur';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_AUSWAHL, aufgWinkelE, aufgWinkelR } from './Bilder';
import { A_ARBEIT, A_BETRAG, A_EXAKT, A_PARAMETER_E, A_PARAMETER_R, A_PRODUKT_E, A_PRODUKT_R, A_SELBST, A_SENKRECHT_E, A_SENKRECHT_R, A_VORZEICHEN, A_WINKEL_E, A_WINKEL_R } from './daten';

const sp = (v: number[]) => spalte(v);
const produktFelder = (praefix: string, ergebnisse: number[]): Feld[] =>
  ergebnisse.map((x, i) => ({ id: `${praefix}${i + 1}`, name: `Skalarprodukt ${i + 1}`, beschriftung: <>Skalarprodukt {String.fromCharCode(97 + i)})</>, erwartet: x }));
const zeile = (u: number[], v: number[]) => u.map((x, i) => `${x < 0 ? `(${x})` : x}\\cdot ${v[i]! < 0 ? `(${v[i]})` : v[i]}`).join('+');
const Paar = ({ u, v, nach }: { u: number[]; v: number[]; nach?: string }) => (nach ? <Formel tex={t`${sp(u)}\cdot${sp(v)}`} nach={nach} /> : <Formel tex={t`${sp(u)}\cdot${sp(v)}`} />);

export function Ueberpruefen() {
  const pe = A_PRODUKT_E;
  const pr = A_PRODUKT_R;
  const we = A_WINKEL_E;
  const wr = A_WINKEL_R;
  const se = A_SELBST;
  const be = A_BETRAG;
  const ar = A_ARBEIT;
  const ex = A_EXAKT;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gezeichnet oder gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten.
      </p>
      <Hinweis titel="Eingabe">
        Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma. Winkel gibst du in Grad auf zwei Nachkommastellen genau an, ohne Gradzeichen. Der Taschenrechner steht auf Gradmaß (DEG).
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Skalarprodukte in der Ebene"
        felder={produktFelder('p', pe.ergebnisse)}
        hilfen={[<>Multipliziere die oberen Koordinaten, multipliziere die unteren Koordinaten und addiere die beiden Produkte.</>, <>Achte auf die Vorzeichen: Minus mal minus ergibt plus.</>]}
        loesung={pe.paare.map((p, i) => (
          <>
            {String.fromCharCode(97 + i)}) <Formel tex={t`${sp(p[0]!)}\cdot${sp(p[1]!)}=${zeile(p[0]!, p[1]!)}=${pe.ergebnisse[i]}`} nach="." /> {pe.ergebnisse[i] === 0 ? <>Das Skalarprodukt ist 0, die Vektoren sind orthogonal.</> : null}
          </>
        ))}
      >
        <p>Berechne die Skalarprodukte:</p>
        <ul className="liste-ohne-zahl">
          {pe.paare.map((p, i) => (
            <li key={i}>{String.fromCharCode(97 + i)}) <Paar u={p[0]!} v={p[1]!} nach="," /></li>
          ))}
        </ul>
      </Aufgabe>

      <Aufgabe
        nummer={2}
        titel="Skalarprodukte im Raum"
        felder={produktFelder('p', pr.ergebnisse)}
        hilfen={[<>Im Raum kommt ein dritter Summand dazu: <Formel tex="a_1b_1+a_2b_2+a_3b_3" nach="." /></>]}
        loesung={pr.paare.map((p, i) => (
          <>
            {String.fromCharCode(97 + i)}) <Formel tex={t`${sp(p[0]!)}\cdot${sp(p[1]!)}=${zeile(p[0]!, p[1]!)}=${pr.ergebnisse[i]}`} nach="." />
          </>
        ))}
      >
        <p>Berechne die Skalarprodukte:</p>
        <ul className="liste-ohne-zahl">
          {pr.paare.map((p, i) => (
            <li key={i}>{String.fromCharCode(97 + i)}) <Paar u={p[0]!} v={p[1]!} nach="," /></li>
          ))}
        </ul>
      </Aufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Zahl oder Vektor?"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`5\cdot\vec{a}`} />, true, <>Richtig: Eine Zahl mal ein Vektor ergibt wieder einen Vektor (s-Multiplikation).</>),
            opt('b', <Formel tex={t`\vec{a}\cdot\vec{b}`} />, false, <>Das Skalarprodukt ist eine Zahl, kein Vektor. Aus zwei Vektoren wird eine einzige Zahl.</>),
            opt('c', <Formel tex={t`\vec{a}\cdot\vec{a}`} />, false, <>Auch das ist ein Skalarprodukt und damit eine Zahl, nämlich das Quadrat des Betrags.</>),
            opt('d', <Formel tex={t`|\vec{a}|`} />, false, <>Der Betrag ist die Länge des Vektors, also eine Zahl.</>),
          ],
          1,
        )}
        erklaerung={<>Nur die s-Multiplikation <Formel tex={t`r\cdot\vec{a}`} /> liefert einen Vektor. Das Skalarprodukt zweier Vektoren und der Betrag sind Zahlen.</>}
      >
        <p>Welcher Ausdruck ist ein Vektor?</p>
      </Auswahlfrage>

      <Aufgabe
        nummer={4}
        titel="Orthogonal in der Ebene"
        felder={[{ id: 'k', name: 'Zahl k', beschriftung: <Formel tex="k" />, erwartet: A_PARAMETER_E.k }]}
        hilfen={[<>Zwei Vektoren sind orthogonal, wenn ihr Skalarprodukt 0 ist. Stelle diese Gleichung auf.</>, <>Es gilt <Formel tex={t`6\cdot 4+k\cdot(-3)=0`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\begin{pmatrix}6\\k\end{pmatrix}\cdot\begin{pmatrix}4\\-3\end{pmatrix}=24-3k=0`} nach="," /> also <Formel tex="k=8" nach="." />
          </>,
          <>
            Probe: <Formel tex={t`\begin{pmatrix}6\\8\end{pmatrix}\cdot\begin{pmatrix}4\\-3\end{pmatrix}=24-24=0`} nach="." />
          </>,
        ]}
      >
        <p>
          Für welche Zahl <Formel tex="k" /> sind die Vektoren <Formel tex={t`\begin{pmatrix}6\\k\end{pmatrix}`} /> und <Formel tex={t`\begin{pmatrix}4\\-3\end{pmatrix}`} /> orthogonal?
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={5}
        titel="Orthogonal im Raum"
        felder={[{ id: 'k', name: 'Zahl k', beschriftung: <Formel tex="k" />, erwartet: A_PARAMETER_R.k }]}
        hilfen={[<>Setze das Skalarprodukt gleich 0 und löse die Gleichung nach <Formel tex="k" nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\begin{pmatrix}2\\-3\\k\end{pmatrix}\cdot\begin{pmatrix}6\\3\\3\end{pmatrix}=12-9+3k=3+3k=0`} nach="," /> also <Formel tex="k=-1" nach="." />
          </>,
        ]}
      >
        <p>
          Für welche Zahl <Formel tex="k" /> sind die Vektoren <Formel tex={t`\begin{pmatrix}2\\-3\\k\end{pmatrix}`} /> und <Formel tex={t`\begin{pmatrix}6\\3\\3\end{pmatrix}`} /> orthogonal?
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="6"
        titel="Welcher Vektor steht senkrecht?"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`${sp(A_SENKRECHT_E.richtig)}`} />, true, <>Richtig: <Formel tex={t`5\cdot 2+(-2)\cdot 5=0`} nach="." /></>),
            opt('b', <Formel tex={t`${sp(A_SENKRECHT_E.falsch[0]!)}`} />, false, <>Hier wurden die Koordinaten nur vertauscht, ohne ein Vorzeichen zu ändern: <Formel tex={t`5\cdot(-2)+(-2)\cdot 5=-20`} nach="." /></>),
            opt('c', <Formel tex={t`${sp(A_SENKRECHT_E.falsch[1]!)}`} />, false, <>Hier wurden die Koordinaten nicht vertauscht, nur ein Vorzeichen geändert: <Formel tex={t`5\cdot 5+(-2)\cdot 2=21`} nach="." /></>),
            opt('d', <Formel tex={t`${sp(A_SENKRECHT_E.falsch[2]!)}`} />, false, <>Hier wurde vertauscht, aber danach bei beiden Koordinaten das Vorzeichen geändert. Es darf nur bei einer Koordinate wechseln: <Formel tex={t`5\cdot 2+(-2)\cdot(-5)=20`} nach="." /></>),
          ],
          2,
        )}
        erklaerung={
          <>
            Vertausche die Koordinaten von <Formel tex={t`\vec{a}`} /> und ändere bei einer das Vorzeichen: aus <Formel tex={t`\begin{pmatrix}5\\-2\end{pmatrix}`} /> wird <Formel tex={t`\begin{pmatrix}2\\5\end{pmatrix}`} nach="." />
            <Bild daten={BILD_AUSWAHL} unter={<>Der Vektor <Formel tex={t`\vec{a}`} /> (orange) und der senkrechte Vektor (blau).</>} />
          </>
        }
      >
        <p>
          Welcher Vektor ist orthogonal zu <Formel tex={t`\vec{a}=${sp(A_SENKRECHT_E.a)}`} nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={7}
        titel="Senkrechte Vektoren im Raum"
        felder={[
          { id: 'n2', name: 'Zahl n zwei', beschriftung: <Formel tex="n_2" />, erwartet: A_SENKRECHT_R.n2 },
          { id: 'm3', name: 'Zahl m drei', beschriftung: <Formel tex="m_3" />, erwartet: A_SENKRECHT_R.m3 },
        ]}
        hilfen={[<>Stelle das Skalarprodukt mit <Formel tex={t`\vec{a}`} /> auf und setze es gleich 0. Es bleibt nur eine Unbekannte.</>]}
        loesung={[
          <>
            <Formel tex={t`\begin{pmatrix}2\\-1\\3\end{pmatrix}\cdot\begin{pmatrix}1\\n_2\\0\end{pmatrix}=2-n_2=0`} nach="," /> also <Formel tex="n_2=2" nach="." />
          </>,
          <>
            <Formel tex={t`\begin{pmatrix}2\\-1\\3\end{pmatrix}\cdot\begin{pmatrix}3\\0\\m_3\end{pmatrix}=6+3m_3=0`} nach="," /> also <Formel tex="m_3=-2" nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={t`\vec{a}=${sp(A_SENKRECHT_R.a)}`} nach="." /> Bestimme <Formel tex="n_2" /> so, dass <Formel tex={t`\vec{n}=\begin{pmatrix}1\\n_2\\0\end{pmatrix}`} /> orthogonal zu <Formel tex={t`\vec{a}`} /> ist, und <Formel tex="m_3" /> so, dass <Formel tex={t`\vec{m}=\begin{pmatrix}3\\0\\m_3\end{pmatrix}`} /> orthogonal zu <Formel tex={t`\vec{a}`} /> ist.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={8}
        titel="Winkel in der Ebene"
        felder={[
          { id: 'sp', name: 'Skalarprodukt', beschriftung: <>Skalarprodukt <Formel tex={t`\vec{a}\cdot\vec{b}`} /></>, erwartet: we.skalar },
          { id: 'w', name: 'Winkel in Grad', beschriftung: <>Winkel <Formel tex={t`\alpha`} /> in Grad</>, erwartet: we.winkel, toleranz: 0.01 },
        ]}
        hilfen={[<>Berechne zuerst das Skalarprodukt und die beiden Beträge. Setze dann in <Formel tex={t`\cos\alpha=\dfrac{\vec{a}\cdot\vec{b}}{|\vec{a}|\cdot|\vec{b}|}`} /> ein.</>, <>Mit dem Taschenrechner auf Gradmaß ergibt <Formel tex={t`\cos^{-1}`} /> den Winkel.</>]}
        loesung={[
          <>
            <Formel tex={t`\vec{a}\cdot\vec{b}=5\cdot 4+12\cdot(-3)=-16`} nach="," /> <Formel tex={t`|\vec{a}|=\sqrt{25+144}=13`} /> und <Formel tex={t`|\vec{b}|=\sqrt{16+9}=5`} nach="." />
          </>,
          <>
            <Formel tex={t`\cos\alpha=\dfrac{-16}{13\cdot 5}=-\dfrac{16}{65}`} nach="," /> also <Formel tex={t`\alpha=\cos^{-1}\left(-\dfrac{16}{65}\right)\approx 104{,}25^{\circ}`} nach="." /> Der Winkel ist stumpf, passend zum negativen Skalarprodukt.
          </>,
        ]}
      >
        <p>
          Berechne den Winkel zwischen <Formel tex={t`\vec{a}=${sp(we.a)}`} /> und <Formel tex={t`\vec{b}=${sp(we.b)}`} nach="." /> Gib auch das Skalarprodukt an.
        </p>
        <Bild daten={aufgWinkelE(false)} unter={<>Die beiden Vektoren als Pfeile vom Ursprung aus.</>} />
        <Kontrollschaubild>
          <Bild daten={aufgWinkelE(true)} unter={<>Die beiden Pfeile schließen einen stumpfen Winkel von etwa 104,25° ein.</>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Winkel im Raum"
        felder={[
          { id: 'sp', name: 'Skalarprodukt', beschriftung: <>Skalarprodukt <Formel tex={t`\vec{a}\cdot\vec{b}`} /></>, erwartet: wr.skalar },
          { id: 'w', name: 'Winkel in Grad', beschriftung: <>Winkel <Formel tex={t`\alpha`} /> in Grad</>, erwartet: wr.winkel, toleranz: 0.01 },
        ]}
        hilfen={[<>Der Betrag beider Vektoren ist eine ganze Zahl. Berechne das Skalarprodukt, dann den Kosinus.</>]}
        loesung={[
          <>
            <Formel tex={t`\vec{a}\cdot\vec{b}=2\cdot 0+(-1)\cdot 3+2\cdot 4=5`} nach="," /> <Formel tex={t`|\vec{a}|=\sqrt{9}=3`} /> und <Formel tex={t`|\vec{b}|=\sqrt{25}=5`} nach="." />
          </>,
          <>
            <Formel tex={t`\cos\alpha=\dfrac{5}{3\cdot 5}=\dfrac{1}{3}`} nach="," /> also <Formel tex={t`\alpha=\cos^{-1}\left(\dfrac{1}{3}\right)\approx 70{,}53^{\circ}`} nach="." />
          </>,
        ]}
      >
        <p>
          Berechne den Winkel zwischen <Formel tex={t`\vec{a}=${sp(wr.a)}`} /> und <Formel tex={t`\vec{b}=${sp(wr.b)}`} nach="." /> Gib auch das Skalarprodukt an.
        </p>
        <KontrollFigur spec={aufgWinkelR} unter={<>Die beiden Vektoren als Pfeile vom Ursprung aus. Der Winkel zwischen ihnen ist spitz, etwa 70,53°.</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="10"
        titel="Das Vorzeichen des Skalarprodukts"
        optionen={platziere(
          [
            opt('a', <>stumpf, also größer als 90° und höchstens 180°</>, true, <>Richtig: Ein negatives Skalarprodukt bedeutet <Formel tex={t`\cos\alpha<0`} nach="," /> also einen stumpfen Winkel.</>),
            opt('b', <>spitz, also kleiner als 90°</>, false, <>Ein spitzer Winkel gehört zu einem positiven Skalarprodukt, denn der Kosinus ist dann positiv.</>),
            opt('c', <>genau 90°</>, false, <>Bei einem rechten Winkel ist das Skalarprodukt genau 0, nicht negativ.</>),
            opt('d', <>Das lässt sich nicht sagen</>, false, <>Doch: Das Vorzeichen des Skalarprodukts ist das Vorzeichen von <Formel tex={t`\cos\alpha`} nach="," /> weil die Beträge positiv sind.</>),
          ],
          0,
        )}
        erklaerung={<>Aus <Formel tex={t`\vec{a}\cdot\vec{b}=|\vec{a}|\cdot|\vec{b}|\cdot\cos\alpha`} /> folgt: Das Skalarprodukt hat das Vorzeichen von <Formel tex={t`\cos\alpha`} nach="." /> Negativ bedeutet einen Winkel zwischen 90° und 180°.</>}
      >
        <p>
          Für zwei Vektoren ungleich dem Nullvektor gilt <Formel tex={t`\vec{a}\cdot\vec{b}=-5`} nach="." /> Was gilt für den Winkel zwischen ihnen?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={11}
        titel="Ein Winkel ohne Taschenrechner"
        felder={[{ id: 'w', name: 'Winkel in Grad', beschriftung: <>Winkel <Formel tex={t`\alpha`} /> in Grad</>, erwartet: ex.winkel, toleranz: 0.01 }]}
        hilfen={[<>Berechne <Formel tex={t`\cos\alpha`} nach="." /> Du erhältst einen Wert, den du aus der Mittelstufe kennst.</>]}
        loesung={[
          <>
            <Formel tex={t`\vec{a}\cdot\vec{b}=2\cdot 3+2\cdot 0=6`} nach="," /> <Formel tex={t`|\vec{a}|=\sqrt{8}=2\sqrt{2}`} /> und <Formel tex={t`|\vec{b}|=3`} nach="." />
          </>,
          <>
            <Formel tex={t`\cos\alpha=\dfrac{6}{2\sqrt{2}\cdot 3}=\dfrac{1}{\sqrt{2}}`} nach="," /> also <Formel tex={t`\alpha=45^{\circ}`} nach="." /> Das ist der Winkel, den die Diagonale eines Quadrats mit einer Seite bildet.
          </>,
        ]}
      >
        <p>
          Bestimme den Winkel zwischen <Formel tex={t`\vec{a}=${sp(ex.a)}`} /> und <Formel tex={t`\vec{b}=${sp(ex.b)}`} /> ohne Taschenrechner, exakt.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={12}
        titel="Der Betrag über das Skalarprodukt"
        felder={[
          { id: 'q', name: 'Skalarprodukt von a mit a', beschriftung: <>Skalarprodukt <Formel tex={t`\vec{a}\cdot\vec{a}`} /></>, erwartet: se.quadrat },
          { id: 'b', name: 'Betrag von a', beschriftung: <>Betrag <Formel tex={t`|\vec{a}|`} /></>, erwartet: se.betrag },
        ]}
        hilfen={[<>Es gilt <Formel tex={t`\vec{a}\cdot\vec{a}=|\vec{a}|^2`} nach="." /> Du brauchst also nur eine Wurzel.</>]}
        loesung={[
          <>
            <Formel tex={t`\vec{a}\cdot\vec{a}=2^2+(-3)^2+6^2=4+9+36=49`} nach="." />
          </>,
          <>
            Wegen <Formel tex={t`|\vec{a}|^2=\vec{a}\cdot\vec{a}`} /> ist <Formel tex={t`|\vec{a}|=\sqrt{49}=7`} nach="." /> Das stimmt mit der Formel aus dem Modul zum Betrag überein.
          </>,
        ]}
      >
        <p>
          Berechne für <Formel tex={t`\vec{a}=${sp(se.a)}`} /> das Skalarprodukt <Formel tex={t`\vec{a}\cdot\vec{a}`} /> und daraus den Betrag <Formel tex={t`|\vec{a}|`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={13}
        titel="Rechnungsbetrag"
        felder={[{ id: 'e', name: 'Rechnungsbetrag in Euro', beschriftung: <>Rechnungsbetrag in €</>, erwartet: be.betrag }]}
        hilfen={[<>Der Rechnungsbetrag ist das Skalarprodukt aus dem Bestellvektor und dem Preisvektor.</>]}
        loesung={[
          <>
            <Formel tex={t`${sp(be.menge)}\cdot\begin{pmatrix}0{,}85\\1{,}20\\2{,}40\end{pmatrix}=12\cdot 0{,}85+8\cdot 1{,}20+5\cdot 2{,}40`} nach="." />
          </>,
          <>
            <Formel tex={t`{}=10{,}20+9{,}60+12{,}00=31{,}80`} nach="." /> Die Bestellung kostet 31,80 €.
          </>,
        ]}
      >
        <p>
          Eine Bäckerei liefert 12 Brötchentüten, 8 Brote und 5 Kuchen. Der Bestellvektor ist <Formel tex={t`${sp(be.menge)}`} nach="," /> der Preisvektor in Euro <Formel tex={t`\begin{pmatrix}0{,}85\\1{,}20\\2{,}40\end{pmatrix}`} nach="." /> Wie hoch ist der Rechnungsbetrag?
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={14}
        titel="Physikalische Arbeit"
        felder={[{ id: 'w', name: 'Arbeit in Joule', beschriftung: <>Arbeit in J</>, erwartet: ar.arbeit }]}
        hilfen={[<>Die Arbeit ist das Skalarprodukt aus dem Kraftvektor und dem Wegvektor.</>]}
        loesung={[
          <>
            <Formel tex={t`W=\vec{F}\cdot\vec{s}=40\cdot 5+30\cdot(-2)=200-60=140`} nach="." /> Die Arbeit beträgt 140 J.
          </>,
        ]}
      >
        <p>
          Eine Kraft <Formel tex={t`\vec{F}=${sp(ar.kraft)}`} /> (in Newton) verschiebt einen Wagen um <Formel tex={t`\vec{s}=${sp(ar.weg)}`} /> (in Metern). Die physikalische Arbeit ist <Formel tex={t`W=\vec{F}\cdot\vec{s}`} nach="." /> Wie groß ist <Formel tex="W" /> in Joule?
        </p>
      </Aufgabe>
    </Abschnitt>
  );
}
