import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur } from '@/components/Raumfigur';
import { klammer, spalte } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { raumDach, raumDreieck } from './Bilder';
import { A_BERECHNEN, A_BETRAG, A_DACH, A_DREIECK, A_FEHLER, A_LAENGE, A_NULL, A_PARAMETER, A_PROBE, A_REIHENFOLGE, A_RICHTUNG } from './daten';

const sp = (v: number[]) => spalte(v);
const k = (x: number) => klammer(x);
/** Die drei Differenzen des Vektorprodukts mit eingesetzten Zahlen (Rechenweg), ohne das Ergebnis. */
const terme = (a: number[], b: number[]): string =>
  [
    `${k(a[1]!)}\\cdot ${k(b[2]!)}-${k(a[2]!)}\\cdot ${k(b[1]!)}`,
    `${k(a[2]!)}\\cdot ${k(b[0]!)}-${k(a[0]!)}\\cdot ${k(b[2]!)}`,
    `${k(a[0]!)}\\cdot ${k(b[1]!)}-${k(a[1]!)}\\cdot ${k(b[0]!)}`,
  ].join('\\\\');
/** Summe der Produkte der Koordinaten mit eingesetzten Zahlen (Probe). */
const zeile = (u: number[], v: number[]) => u.map((x, i) => `${k(x)}\\cdot ${k(v[i]!)}`).join('+');
const koordFelder = (praefix: string, werte: number[]): Feld[] =>
  werte.map((x, i) => ({ id: `${praefix}${i + 1}`, name: `${i + 1}. Koordinate`, beschriftung: <>{i + 1}. Koordinate</>, erwartet: x }));
const kreuz = <Formel tex={t`\vec{a}\times\vec{b}`} />;
const ba = <Formel tex={t`\vec{b}\times\vec{a}`} />;

export function Ueberpruefen() {
  const b1 = A_BERECHNEN;
  const f = A_FEHLER;
  const p = A_PROBE;
  const par = A_PARAMETER;
  const be = A_BETRAG;
  const la = A_LAENGE;
  const dr = A_DREIECK;
  const da = A_DACH;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten. Zu jedem Vektorprodukt gehört die Probe mit dem Skalarprodukt aus dem Modul <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">
        Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma. Winkel gibst du in Grad auf zwei Nachkommastellen genau an, ohne Gradzeichen. Der Taschenrechner steht auf Gradmaß (DEG).
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Das Vektorprodukt berechnen"
        felder={koordFelder('n', b1.n)}
        hilfen={[<>Nutze das Schema aus dem Abschnitt „Erklären“ oder die Formel <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}a_2b_3-a_3b_2\\a_3b_1-a_1b_3\\a_1b_2-a_2b_1\end{pmatrix}`} nach="." /></>, <>Achte auf die Vorzeichen: Minus mal minus ergibt plus. Die mittlere Koordinate ist <Formel tex={t`a_3b_1-a_1b_3`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}${terme(b1.a, b1.b)}\end{pmatrix}`} nach="." />
          </>,
          <>
            Also <Formel tex={t`\vec{a}\times\vec{b}=${sp(b1.n)}`} nach="." />
          </>,
          <>
            Probe mit dem Skalarprodukt: <Formel tex={t`${sp(b1.n)}\cdot${sp(b1.a)}=${zeile(b1.n, b1.a)}=0`} /> und <Formel tex={t`${sp(b1.n)}\cdot${sp(b1.b)}=${zeile(b1.n, b1.b)}=0`} nach="." />
          </>,
        ]}
      >
        <p>
          Berechne <Formel tex={t`\vec{a}\times\vec{b}`} /> für <Formel tex={t`\vec{a}=${sp(b1.a)}`} /> und <Formel tex={t`\vec{b}=${sp(b1.b)}`} nach="." /> Mache zur Kontrolle die Probe mit dem Skalarprodukt.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="2"
        titel="Welches Ergebnis ist richtig?"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`${sp(f.richtig)}`} />, true, <>Richtig. Zur Probe: <Formel tex={t`${sp(f.richtig)}\cdot${sp(f.a)}=${zeile(f.richtig, f.a)}=0`} /> und <Formel tex={t`${sp(f.richtig)}\cdot${sp(f.b)}=${zeile(f.richtig, f.b)}=0`} nach="." /></>),
            opt('b', <Formel tex={t`${sp(f.falsch[0]!)}`} />, false, <>Hier hat die mittlere Koordinate das falsche Vorzeichen. Richtig ist <Formel tex={t`a_3b_1-a_1b_3=2\cdot 2-1\cdot 0=4`} nach="." /> Die Probe zeigt den Fehler: <Formel tex={t`${sp(f.falsch[0]!)}\cdot${sp(f.b)}=${zeile(f.falsch[0]!, f.b)}=-8`} nach="," /> das Ergebnis müsste 0 sein.</>),
            opt('c', <Formel tex={t`${sp(f.falsch[1]!)}`} />, false, <>Das ist das Vektorprodukt in der anderen Reihenfolge, <Formel tex={t`\vec{b}\times\vec{a}`} nach="." /> Es ist der Gegenvektor des gesuchten Ergebnisses. Gefragt war <Formel tex={t`\vec{a}\times\vec{b}`} nach="." /></>),
            opt('d', <Formel tex={t`${sp(f.falsch[2]!)}`} />, false, <>Hier wurden die Koordinaten einzeln multipliziert (<Formel tex={t`1\cdot 2`} nach="," /> <Formel tex={t`0\cdot 1`} nach="," /> <Formel tex={t`2\cdot 0`} nach=")." /> Das ist nicht das Vektorprodukt. Die Probe zeigt es: <Formel tex={t`${sp(f.falsch[2]!)}\cdot${sp(f.a)}=${zeile(f.falsch[2]!, f.a)}=2`} nach="," /> das Ergebnis müsste 0 sein.</>),
          ],
          1,
        )}
        erklaerung={<>Mit dem Schema folgt <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}${terme(f.a, f.b)}\end{pmatrix}=${sp(f.richtig)}`} nach="." /> Mit der Probe über das Skalarprodukt erkennst du falsche Ergebnisse sofort.</>}
      >
        <p>
          Wie lautet <Formel tex={t`\vec{a}\times\vec{b}`} /> für <Formel tex={t`\vec{a}=${sp(f.a)}`} /> und <Formel tex={t`\vec{b}=${sp(f.b)}`} nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={3}
        titel="Die Probe findet einen Fehler"
        felder={[
          { id: 'pa', name: 'Skalarprodukt mit a', beschriftung: <>Skalarprodukt <Formel tex={t`\vec{c}\cdot\vec{a}`} /></>, erwartet: p.pa },
          { id: 'pb', name: 'Skalarprodukt mit b', beschriftung: <>Skalarprodukt <Formel tex={t`\vec{c}\cdot\vec{b}`} /></>, erwartet: p.pb },
          { id: 'n2', name: 'richtige 2. Koordinate', beschriftung: <>richtige 2. Koordinate</>, erwartet: p.richtig[1]! },
        ]}
        hilfen={[<>Berechne beide Skalarprodukte. Ein Vektorprodukt muss zu beiden Vektoren das Skalarprodukt 0 haben.</>, <>Die falsche Koordinate ist die mittlere. Sie ist <Formel tex={t`a_3b_1-a_1b_3`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\vec{c}\cdot\vec{a}=${zeile(p.falsch, p.a)}=${p.pa}`} nach="," /> das ist nicht 0. Das Ergebnis ist also falsch.
          </>,
          <>
            <Formel tex={t`\vec{c}\cdot\vec{b}=${zeile(p.falsch, p.b)}=${p.pb}`} nach="." /> Diese Probe allein hätte den Fehler nicht gezeigt, denn die mittlere Koordinate von <Formel tex={t`\vec{b}`} /> ist 0 und dadurch wird der Fehler in <Formel tex={t`\vec{c}`} /> mit 0 multipliziert. Prüfe deshalb immer beide Skalarprodukte.
          </>,
          <>
            Die mittlere Koordinate ist <Formel tex={t`a_3b_1-a_1b_3=${p.a[2]}\cdot ${p.b[0]}-${p.a[0]}\cdot ${p.b[2]}=${p.richtig[1]}`} nach="," /> richtig ist also <Formel tex={t`\vec{a}\times\vec{b}=${sp(p.richtig)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Jemand berechnet <Formel tex={t`\vec{a}\times\vec{b}`} /> für <Formel tex={t`\vec{a}=${sp(p.a)}`} /> und <Formel tex={t`\vec{b}=${sp(p.b)}`} /> und erhält <Formel tex={t`\vec{c}=${sp(p.falsch)}`} nach="." /> Prüfe mit dem Skalarprodukt, ob das stimmen kann, und gib die richtige mittlere Koordinate an.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={4}
        titel="Die Reihenfolge der Faktoren"
        felder={koordFelder('m', A_REIHENFOLGE.n)}
        hilfen={[<>Du musst nicht neu rechnen. Wie hängen <Formel tex={t`\vec{a}\times\vec{b}`} /> und <Formel tex={t`\vec{b}\times\vec{a}`} /> zusammen?</>]}
        loesung={[
          <>
            Es gilt <Formel tex={t`\vec{b}\times\vec{a}=-(\vec{a}\times\vec{b})=-${sp(b1.n)}=${sp(A_REIHENFOLGE.n)}`} nach="." />
          </>,
          <>
            Zur Kontrolle direkt gerechnet: <Formel tex={t`\vec{b}\times\vec{a}=\begin{pmatrix}${terme(b1.b, b1.a)}\end{pmatrix}=${sp(A_REIHENFOLGE.n)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Aus Aufgabe 1 kennst du <Formel tex={t`\vec{a}\times\vec{b}=${sp(b1.n)}`} nach="." /> Gib {ba} an.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="5"
        titel="Die Richtung des Vektorprodukts"
        optionen={platziere(
          [
            opt('a', <>entgegen der Richtung der <Formel tex="x_3" />-Achse</>, true, <>Richtig: <Formel tex={t`\vec{a}\times\vec{b}=${sp(A_RICHTUNG.n)}`} nach="." /> Mit der rechten Hand: Daumen in Richtung der <Formel tex="x_2" />-Achse, Zeigefinger in Richtung der <Formel tex="x_1" />-Achse, dann zeigt der Mittelfinger nach unten.</>),
            opt('b', <>in Richtung der <Formel tex="x_3" />-Achse</>, false, <>Das wäre das Ergebnis bei vertauschten Faktoren, <Formel tex={t`\vec{b}\times\vec{a}=\begin{pmatrix}0\\0\\6\end{pmatrix}`} nach="." /> Die Reihenfolge der Faktoren bestimmt die Richtung.</>),
            opt('c', <>in Richtung der <Formel tex="x_1" />-Achse</>, false, <>Der Vektor <Formel tex={t`\vec{b}`} /> liegt selbst auf der <Formel tex="x_1" />-Achse. Das Vektorprodukt steht aber senkrecht auf <Formel tex={t`\vec{b}`} nach="." /></>),
            opt('d', <>in Richtung der <Formel tex="x_2" />-Achse</>, false, <>Der Vektor <Formel tex={t`\vec{a}`} /> liegt selbst auf der <Formel tex="x_2" />-Achse. Das Vektorprodukt steht aber senkrecht auf <Formel tex={t`\vec{a}`} nach="." /></>),
          ],
          3,
        )}
        erklaerung={<>Es gilt <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}2\cdot 0-0\cdot 0\\0\cdot 3-0\cdot 0\\0\cdot 0-2\cdot 3\end{pmatrix}=${sp(A_RICHTUNG.n)}`} nach="." /> Das Vektorprodukt steht senkrecht auf beiden Achsen, bleibt also nur die <Formel tex="x_3" />-Achse. Ob es nach oben oder unten zeigt, legt die Rechte-Hand-Regel fest.</>}
      >
        <p>
          Es ist <Formel tex={t`\vec{a}=${sp(A_RICHTUNG.a)}`} /> und <Formel tex={t`\vec{b}=${sp(A_RICHTUNG.b)}`} nach="." /> In welche Richtung zeigt <Formel tex={t`\vec{a}\times\vec{b}`} nach="?" /> Das Koordinatensystem ist ein Rechtssystem.
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={6}
        titel="Ein Parameter für den Nullvektor"
        felder={[{ id: 'k', name: 'Zahl k', beschriftung: <Formel tex="k" />, erwartet: par.k }]}
        hilfen={[<>Das Vektorprodukt ist genau dann der Nullvektor, wenn die Vektoren kollinear sind, also <Formel tex={t`\vec{b}=r\cdot\vec{a}`} nach="." /></>, <>Bestimme <Formel tex="r" /> aus der ersten Koordinate. Prüfe, ob die zweite Koordinate dazu passt.</>]}
        loesung={[
          <>
            Aus der ersten Koordinate folgt <Formel tex={t`-6=r\cdot 2`} nach="," /> also <Formel tex="r=-3" nach="." /> Die zweite Koordinate passt: <Formel tex={t`3=(-3)\cdot(-1)`} nach="." />
          </>,
          <>
            Für die dritte Koordinate gilt <Formel tex={t`k=(-3)\cdot 4=-12`} nach="." />
          </>,
          <>
            Probe mit dem Vektorprodukt: <Formel tex={t`\begin{pmatrix}2\\-1\\4\end{pmatrix}\times\begin{pmatrix}-6\\3\\-12\end{pmatrix}=\begin{pmatrix}12-12\\-24+24\\6-6\end{pmatrix}=\begin{pmatrix}0\\0\\0\end{pmatrix}`} nach="." />
          </>,
        ]}
      >
        <p>
          Für welche Zahl <Formel tex="k" /> ist <Formel tex={t`\begin{pmatrix}2\\-1\\4\end{pmatrix}\times\begin{pmatrix}-6\\3\\k\end{pmatrix}`} /> der Nullvektor?
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="7"
        titel="Wann ist das Vektorprodukt der Nullvektor?"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`${sp(A_NULL.paare[0]!.a)}\ \text{und}\ ${sp(A_NULL.paare[0]!.b)}`} />, true, <>Richtig: <Formel tex={t`\vec{b}=-\dfrac{1}{2}\cdot\vec{a}`} nach="," /> die Vektoren sind kollinear, also ist das Vektorprodukt der Nullvektor.</>),
            opt('b', <Formel tex={t`${sp(A_NULL.paare[1]!.a)}\ \text{und}\ ${sp(A_NULL.paare[1]!.b)}`} />, false, <>Die ersten beiden Koordinaten würden den Faktor 2 verlangen, die dritte nicht (<Formel tex={t`2\cdot 3=6\neq 7`} nach=")." /> Die Vektoren sind nicht kollinear, es ist <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}2\\-1\\0\end{pmatrix}`} nach="." /></>),
            opt('c', <Formel tex={t`${sp(A_NULL.paare[2]!.a)}\ \text{und}\ ${sp(A_NULL.paare[2]!.b)}`} />, false, <>Hier ist das Skalarprodukt 0 (<Formel tex={t`-2+2+0=0`} nach="),"/> die Vektoren sind also orthogonal. Das Vektorprodukt ist dann nicht der Nullvektor, sondern <Formel tex={t`\begin{pmatrix}0\\0\\5\end{pmatrix}`} nach="." /></>),
            opt('d', <Formel tex={t`${sp(A_NULL.paare[3]!.a)}\ \text{und}\ ${sp(A_NULL.paare[3]!.b)}`} />, false, <>Die ersten beiden Koordinaten würden den Faktor 3 verlangen, die dritte nicht (<Formel tex={t`3\cdot 3=9\neq 12`} nach=")." /> Es ist <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}-6\\-3\\0\end{pmatrix}`} nach="." /></>),
          ],
          2,
        )}
        erklaerung={<>Das Vektorprodukt ist genau dann der Nullvektor, wenn die beiden Vektoren kollinear sind. Orthogonale Vektoren haben das Skalarprodukt 0, aber ein Vektorprodukt ungleich dem Nullvektor.</>}
      >
        <p>
          Bei welchem Paar ist <Formel tex={t`\vec{a}\times\vec{b}`} /> der Nullvektor?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={8}
        titel="Betrag und Winkel"
        felder={[
          { id: 'b', name: 'Betrag des Vektorprodukts', beschriftung: <>Betrag <Formel tex={t`|\vec{a}\times\vec{b}|`} /></>, erwartet: be.betrag, toleranz: 0.01 },
          { id: 'w', name: 'Winkel in Grad', beschriftung: <>Winkel <Formel tex={t`\alpha`} /> in Grad</>, erwartet: be.winkel, toleranz: 0.01 },
        ]}
        hilfen={[<>Berechne zuerst das Vektorprodukt und davon den Betrag. Den Winkel bestimmst du wie im Modul zum Skalarprodukt.</>, <>Zur Kontrolle gilt <Formel tex={t`|\vec{a}\times\vec{b}|=|\vec{a}|\cdot|\vec{b}|\cdot\sin\alpha`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}${terme(be.a, be.b)}\end{pmatrix}=${sp(be.n)}`} nach="," /> also <Formel tex={t`|\vec{a}\times\vec{b}|=\sqrt{1+1+9}=\sqrt{11}\approx 3{,}32`} nach="." />
          </>,
          <>
            <Formel tex={t`\vec{a}\cdot\vec{b}=2+2+1=5`} nach="," /> <Formel tex={t`|\vec{a}|=|\vec{b}|=\sqrt{6}`} nach="," /> also <Formel tex={t`\cos\alpha=\dfrac{5}{6}`} /> und <Formel tex={t`\alpha=\cos^{-1}\left(\dfrac{5}{6}\right)\approx 33{,}56^{\circ}`} nach="." />
          </>,
          <>
            Kontrolle mit der Betragsformel: <Formel tex={t`|\vec{a}|\cdot|\vec{b}|\cdot\sin\alpha=6\cdot\sin 33{,}56^{\circ}\approx 3{,}32`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`\vec{a}=${sp(be.a)}`} /> und <Formel tex={t`\vec{b}=${sp(be.b)}`} nach="." /> Berechne den Betrag von <Formel tex={t`\vec{a}\times\vec{b}`} /> und den Winkel zwischen <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Ein senkrechter Vektor mit vorgegebener Länge"
        felder={koordFelder('v', la.ergebnis)}
        hilfen={[<>Berechne zuerst <Formel tex={t`\vec{a}\times\vec{b}`} /> und dessen Betrag.</>, <>Mit einem Vielfachen <Formel tex={t`r\cdot\vec{n}`} /> erreichst du die gewünschte Länge. Den Faktor findest du wie bei einem Einheitsvektor, siehe das Modul <Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>. Bei zwei möglichen Vektoren wählst du den mit positiver erster Koordinate.</>]}
        loesung={[
          <>
            <Formel tex={t`\vec{n}=\vec{a}\times\vec{b}=\begin{pmatrix}${terme(la.a, la.b)}\end{pmatrix}=${sp(la.n)}`} nach="." />
          </>,
          <>
            <Formel tex={t`|\vec{n}|=\sqrt{36+36+9}=\sqrt{81}=9`} nach="." /> Für die Länge 6 brauchst du den Faktor <Formel tex={t`\dfrac{6}{9}=\dfrac{2}{3}`} nach="." />
          </>,
          <>
            <Formel tex={t`\dfrac{2}{3}\cdot${sp(la.n)}=\begin{pmatrix}-4\\4\\-2\end{pmatrix}`} nach="." /> Dieser Vektor hat eine negative erste Koordinate. Gesucht ist der Gegenvektor <Formel tex={t`${sp(la.ergebnis)}`} nach="." />
          </>,
          <>
            Probe: <Formel tex={t`${sp(la.ergebnis)}\cdot${sp(la.a)}=${zeile(la.ergebnis, la.a)}=0`} nach="," /> <Formel tex={t`${sp(la.ergebnis)}\cdot${sp(la.b)}=${zeile(la.ergebnis, la.b)}=0`} /> und <Formel tex={t`\sqrt{16+16+4}=6`} nach="." />
          </>,
        ]}
      >
        <p>
          Bestimme einen Vektor der Länge 6, der auf <Formel tex={t`\vec{a}=${sp(la.a)}`} /> und auf <Formel tex={t`\vec{b}=${sp(la.b)}`} /> senkrecht steht und dessen erste Koordinate positiv ist.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={10}
        titel="Senkrecht zu zwei Seiten eines Dreiecks"
        felder={koordFelder('s', dr.gekuerzt)}
        hilfen={[<>Berechne die Verbindungsvektoren <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="." /> Wie du sie bestimmst, steht im Modul <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis>.</>, <>Das Vektorprodukt der beiden Verbindungsvektoren steht senkrecht auf beiden. Teile durch den gemeinsamen Teiler, dann ist es ein Vektor mit kleinen Zahlen. Auch ein Vielfaches steht noch senkrecht.</>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=${sp(dr.ab)}`} /> und <Formel tex={t`\overrightarrow{AC}=${sp(dr.ac)}`} nach="." />
          </>,
          <>
            <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}=\begin{pmatrix}${terme(dr.ab, dr.ac)}\end{pmatrix}=${sp(dr.n)}`} nach="." />
          </>,
          <>
            Alle drei Koordinaten sind durch 2 teilbar. Der gekürzte Vektor <Formel tex={t`${sp(dr.gekuerzt)}`} /> hat eine positive erste Koordinate.
          </>,
          <>
            Probe: <Formel tex={t`${sp(dr.gekuerzt)}\cdot${sp(dr.ab)}=${zeile(dr.gekuerzt, dr.ab)}=0`} /> und <Formel tex={t`${sp(dr.gekuerzt)}\cdot${sp(dr.ac)}=${zeile(dr.gekuerzt, dr.ac)}=0`} nach="." />
          </>,
        ]}
      >
        <p>
          Ein Dreieck hat die Ecken <Formel tex={t`A(0\,|\,-1\,|\,2)`} nach="," /> <Formel tex={t`B(2\,|\,3\,|\,0)`} /> und <Formel tex={t`C(2\,|\,0\,|\,2)`} nach="." /> Bestimme den Vektor, der auf <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> senkrecht steht, ganzzahlige Koordinaten ohne gemeinsamen Teiler hat und dessen erste Koordinate positiv ist.
        </p>
        <KontrollFigur spec={raumDreieck} unter={<>Das Dreieck <Formel tex="ABC" /> und der gesuchte Vektor als rosa Pfeil ab der Ecke <Formel tex="A" nach="." /> Er steht senkrecht auf den Seiten <Formel tex={t`\overline{AB}`} /> und <Formel tex={t`\overline{AC}`} nach="." /></>} />
      </Aufgabe>

      <Aufgabe
        nummer={11}
        titel="Der Mast auf der Dachfläche"
        felder={koordFelder('d', da.gekuerzt)}
        hilfen={[<>Der Mast steht senkrecht auf beiden Kanten. Bestimme einen Vektor, der zu beiden Kantenvektoren senkrecht steht.</>, <>Das Vektorprodukt hat hier eine negative dritte Koordinate. Der Mast soll aber nach oben zeigen. Nimm deshalb den Gegenvektor und kürze.</>]}
        loesung={[
          <>
            <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}${terme(da.a, da.b)}\end{pmatrix}=${sp(da.n)}`} nach="." />
          </>,
          <>
            Die dritte Koordinate ist negativ, der Vektor zeigt nach unten. Der Gegenvektor <Formel tex={t`\begin{pmatrix}-4\\2\\4\end{pmatrix}`} /> zeigt nach oben. Gekürzt durch 2 ergibt das <Formel tex={t`${sp(da.gekuerzt)}`} nach="." />
          </>,
          <>
            Probe: <Formel tex={t`${sp(da.gekuerzt)}\cdot${sp(da.a)}=${zeile(da.gekuerzt, da.a)}=0`} /> und <Formel tex={t`${sp(da.gekuerzt)}\cdot${sp(da.b)}=${zeile(da.gekuerzt, da.b)}=0`} nach="." />
          </>,
        ]}
      >
        <p>
          Eine ebene Dachfläche hat eine Ecke im Ursprung (Längeneinheit 1 m, die <Formel tex="x_3" />-Achse zeigt nach oben). Von dort verlaufen zwei Kanten der Fläche in den Richtungen <Formel tex={t`\vec{a}=${sp(da.a)}`} /> und <Formel tex={t`\vec{b}=${sp(da.b)}`} nach="." /> Ein Mast soll senkrecht zur Dachfläche stehen. Bestimme seine Richtung als Vektor mit ganzzahligen Koordinaten ohne gemeinsamen Teiler, dessen dritte Koordinate positiv ist.
        </p>
        <KontrollFigur spec={raumDach} unter={<>Die Dachfläche (gestrichelt zum Parallelogramm ergänzt) mit den Kanten zu <Formel tex="Q" /> und <Formel tex="R" /> und der Richtung des Masts als rosa Pfeil zu <Formel tex="M" nach="." /></>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="12"
        titel="Was gilt immer?"
        optionen={platziere(
          [
            opt('a', <>Das Vektorprodukt steht senkrecht auf <Formel tex={t`\vec{a}`} /> und auf <Formel tex={t`\vec{b}`} nach="." /></>, true, <>Richtig. Das gilt für alle Vektoren im Raum. Ist das Vektorprodukt der Nullvektor, ist er zu jedem Vektor orthogonal.</>),
            opt('b', <Formel tex={t`\vec{a}\times\vec{b}=\vec{b}\times\vec{a}`} />, false, <>Das gilt nicht. Beim Vertauschen kehrt sich der Vektor um, <Formel tex={t`\vec{b}\times\vec{a}=-(\vec{a}\times\vec{b})`} nach="." /> Gleich sind beide nur, wenn sie der Nullvektor sind.</>),
            opt('c', <>Das Vektorprodukt ist eine Zahl.</>, false, <>Das Vektorprodukt ist ein Vektor. Eine Zahl ergibt das Skalarprodukt.</>),
            opt('d', <Formel tex={t`|\vec{a}\times\vec{b}|=|\vec{a}|\cdot|\vec{b}|`} />, false, <>Das gilt nur bei einem rechten Winkel. Allgemein kommt der Faktor <Formel tex={t`\sin\alpha`} /> dazu, und der ist kleiner als 1, wenn der Winkel nicht 90° beträgt.</>),
          ],
          0,
        )}
        erklaerung={<>Das Vektorprodukt hat drei sichere Eigenschaften: Es steht senkrecht auf beiden Vektoren, es ändert beim Vertauschen der Faktoren die Richtung, und es ist genau bei kollinearen Vektoren der Nullvektor.</>}
      >
        <p>
          Welche Aussage über das Vektorprodukt zweier Vektoren {kreuz} im Raum gilt immer?
        </p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
