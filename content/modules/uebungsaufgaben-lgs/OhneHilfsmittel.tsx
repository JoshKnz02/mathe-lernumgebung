import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { BE, Teile } from '@/components/Teilaufgaben';
import { t } from '@/lib/modulhilfen';
import { BildA6 } from './Bilder';
import { A1, A2, A3, A4, A5, A6 } from './daten';

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl, als Dezimalzahl mit Komma oder als Bruch ein, zum Beispiel <code>2</code>, <code>-1,5</code> oder <Formel tex="\frac{3}{4}" nach="," /> ohne Einheit. Die Felder prüfen nur Ergebnisse. Begründungen und Rechenwege schreibst du in dein Heft, den Lösungsweg vergleichst du danach. Bei Lösungen mit Parameter <Formel tex="t" /> sind die Zahlen vor und bei <Formel tex="t" /> gesucht, die Aufgabe sagt, welche Unbekannte der Parameter ist.
    </Hinweis>
  );
}

const STUFE1 = t`\left(\begin{array}{rrr|r}1&2&1&5\\0&-1&-1&-2\\0&0&k^2-k-2&k^2-4\end{array}\right)`;

/** Aufgabe 1: Fallunterscheidung bei einem Parameter in der dritten Gleichung. */
function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Eine Schar von Gleichungssystemen"
      felder={[
        { id: 'keine', name: 'Wert von k, für den es keine Lösung gibt', beschriftung: <>Keine Lösung für <Formel tex="k" /></>, erwartet: A1.keine },
        { id: 'unendlich', name: 'Wert von k, für den es unendlich viele Lösungen gibt', beschriftung: <>Unendlich viele für <Formel tex="k" /></>, erwartet: A1.unendlich },
        { id: 'x', name: 'Lösung x für k gleich 0', beschriftung: <><Formel tex="x" /> für <Formel tex="k=0" /></>, erwartet: A1.k0[0]! },
        { id: 'y', name: 'Lösung y für k gleich 0', beschriftung: <><Formel tex="y" /> für <Formel tex="k=0" /></>, erwartet: A1.k0[1]! },
        { id: 'z', name: 'Lösung z für k gleich 0', beschriftung: <><Formel tex="z" /> für <Formel tex="k=0" /></>, erwartet: A1.k0[2]! },
        { id: 'x0', name: 'Zahl ohne t in x', beschriftung: <><Formel tex="x" /> ohne <Formel tex="t" /></>, erwartet: A1.k2.x[0]! },
        { id: 'xt', name: 'Zahl vor t in x', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="x" /></>, erwartet: A1.k2.x[1]! },
        { id: 'y0', name: 'Zahl ohne t in y', beschriftung: <><Formel tex="y" /> ohne <Formel tex="t" /></>, erwartet: A1.k2.y[0]! },
        { id: 'yt', name: 'Zahl vor t in y', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="y" /></>, erwartet: A1.k2.y[1]! },
      ]}
      hilfen={[
        <>Bringe das System mit dem <Modulverweis modul="gauss-algorithmus">Gauß-Algorithmus</Modulverweis> in Stufenform. Der Parameter <Formel tex="k" /> steht nur in der dritten Gleichung.</>,
        <>Nach <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} nach="," /> <Formel tex={t`Z_3\to Z_3-3\cdot Z_1`} /> und <Formel tex={t`Z_3\to Z_3-Z_2`} /> lautet die letzte Zeile <Formel tex={t`(k^2-k-2)\,z=k^2-4`} nach="." /> Zerlege beide Seiten in Faktoren.</>,
        <>Der Faktor vor <Formel tex="z" /> wird 0 für zwei Werte von <Formel tex="k" nach="." /> Prüfe für jeden Wert, ob die rechte Seite ebenfalls 0 ist (unendlich viele Lösungen) oder nicht (keine Lösung). Siehe <Modulverweis modul="loesbarkeit-lgs" abschnitt="zusammenfassung">Lösbarkeit linearer Gleichungssysteme</Modulverweis>.</>,
      ]}
      loesung={[
        <>
          a: Mit <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} nach="," /> <Formel tex={t`Z_3\to Z_3-3\cdot Z_1`} /> und <Formel tex={t`Z_3\to Z_3-Z_2`} /> entsteht
          <Formel anzeige tex={STUFE1} nach="." />
          Es ist <Formel tex={t`k^2-k-2=(k-2)(k+1)`} /> und <Formel tex={t`k^2-4=(k-2)(k+2)`} nach="." /> Die letzte Zeile lautet also
          <Formel anzeige tex={t`(k-2)(k+1)\,z=(k-2)(k+2)`} nach="." />
        </>,
        <>
          Für <Formel tex={t`k\neq 2`} /> und <Formel tex={t`k\neq -1`} /> darfst du teilen: <Formel tex={t`z=\frac{k+2}{k+1}`} nach="." /> Dann sind auch <Formel tex="y" /> und <Formel tex="x" /> eindeutig bestimmt, das System ist eindeutig lösbar.
          Für <Formel tex="k=2" /> lautet die Zeile <Formel tex="0=0" nach="." /> Es bleiben zwei Pivots für drei Unbekannte: unendlich viele Lösungen.
          Für <Formel tex="k=-1" /> lautet sie <Formel tex={t`0\cdot z=(-3)\cdot 1=-3`} nach="," /> also <Formel tex="0=-3" nach="." /> Das ist ein Widerspruch: keine Lösung.
        </>,
        <>
          b: Für <Formel tex="k=0" /> ist <Formel tex={t`z=\frac{2}{1}=2`} nach="." /> Aus Zeile 2 folgt <Formel tex={t`-y-2=-2`} nach="," /> also <Formel tex="y=0" nach="." /> Aus Zeile 1 folgt <Formel tex={t`x+0+2=5`} nach="," /> also <Formel tex="x=3" nach="." /> Probe in Gleichung III mit <Formel tex="k=0" nach=":" /> <Formel tex={t`3\cdot 3+5\cdot 0+0\cdot 2=9`} nach="." /> Die Lösungsmenge ist <Formel tex={t`L=\{(3;\,0;\,2)\}`} nach="." />
        </>,
        <>
          c: Für <Formel tex="k=2" /> setzt du <Formel tex="z=t" nach="." /> Zeile 2 gibt <Formel tex={t`-y-t=-2`} nach="," /> also <Formel tex={t`y=2-t`} nach="." /> Zeile 1 gibt <Formel tex={t`x+2(2-t)+t=5`} nach="," /> also <Formel tex={t`x=1+t`} nach="." />
          <Formel anzeige tex={t`L=\{(1+t;\,2-t;\,t)\mid t\in\mathbb{R}\}`} nach="," />
          <Formel anzeige tex={t`\vec{x}=\begin{pmatrix}1\\2\\0\end{pmatrix}+t\begin{pmatrix}1\\-1\\1\end{pmatrix}`} nach="." />
        </>,
      ]}
    >
      <p>
        Für jede reelle Zahl <Formel tex="k" /> ist das folgende Gleichungssystem gegeben:
      </p>
      <Formel anzeige tex={t`\begin{aligned}\text{I}\quad x+2y+z&=5\\\text{II}\quad 2x+3y+z&=8\\\text{III}\quad 3x+5y+(k^2-k)\,z&=k^2+9\end{aligned}`} nach="." />
      <Teile>
        <li>
          Untersuchen Sie, für welche Werte von <Formel tex="k" /> das System genau eine Lösung, keine Lösung oder unendlich viele Lösungen hat. <BE n={4} />
        </li>
        <li>
          Bestimmen Sie die Lösung des Systems für <Formel tex="k=0" nach="." /> <BE n={2} />
        </li>
        <li>
          Bestimmen Sie für den Wert von <Formel tex="k" nach="," /> für den es unendlich viele Lösungen gibt, die Lösungsmenge. Setzen Sie <Formel tex="z=t" nach="." /> <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 2: Lösungen in nichtnegativen ganzen Zahlen. */
function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Eintrittskarten"
      felder={[
        { id: 'x0', name: 'Zahl ohne t in x', beschriftung: <><Formel tex="x" /> ohne <Formel tex="t" /></>, erwartet: A2.x[0]! },
        { id: 'xt', name: 'Zahl vor t in x', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="x" /></>, erwartet: A2.x[1]! },
        { id: 'y0', name: 'Zahl ohne t in y', beschriftung: <><Formel tex="y" /> ohne <Formel tex="t" /></>, erwartet: A2.y[0]! },
        { id: 'yt', name: 'Zahl vor t in y', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="y" /></>, erwartet: A2.y[1]! },
        { id: 'anzahl', name: 'Anzahl der Lösungen in nichtnegativen ganzen Zahlen', beschriftung: <>Anzahl der Möglichkeiten</>, erwartet: A2.anzahl },
        { id: 'xmax', name: 'größte mögliche Anzahl von Karten zu 2 Euro', beschriftung: <>Größte Zahl <Formel tex="x" /></>, erwartet: A2.xGroesst },
      ]}
      hilfen={[
        <>Jede Gleichung gehört zu einer Aussage im Text: Die Zahl der Karten und die Einnahmen. Zwei Gleichungen für drei Unbekannte: Eine Unbekannte bleibt frei und wird zum Parameter.</>,
        <>Ziehe vom Doppelten der ersten Gleichung die zweite ab, um <Formel tex="x" /> zu eliminieren, und löse nach <Formel tex="y" /> auf. Setze <Formel tex="z=t" nach="." /></>,
        <>Gesucht sind ganze Zahlen mit <Formel tex={t`x\ge 0`} nach="," /> <Formel tex={t`y\ge 0`} /> und <Formel tex={t`z\ge 0`} nach="." /> Welche Werte von <Formel tex="t" /> bleiben übrig? Siehe <Modulverweis modul="loesbarkeit-lgs">Lösbarkeit linearer Gleichungssysteme</Modulverweis>.</>,
      ]}
      loesung={[
        <>
          a: Die Gleichungen lauten
          <Formel anzeige tex={t`\begin{aligned}x+y+z&=14\\2x+3y+5z&=37\end{aligned}`} nach="." />
          Mit <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} /> folgt <Formel tex={t`y+3z=9`} nach="." /> Mit <Formel tex="z=t" /> ist <Formel tex={t`y=9-3t`} nach="." /> Aus der ersten Gleichung folgt <Formel tex={t`x=14-(9-3t)-t=5+2t`} nach="." />
          <Formel anzeige tex={t`L=\{(5+2t;\,9-3t;\,t)\mid t\in\mathbb{R}\}`} nach="." />
        </>,
        <>
          b: Es muss <Formel tex={t`z=t\ge 0`} /> gelten, <Formel tex={t`y=9-3t\ge 0`} /> verlangt <Formel tex={t`t\le 3`} nach="," /> und <Formel tex={t`x=5+2t\ge 0`} /> ist dann immer erfüllt. Die Zahl <Formel tex="t" /> muss ganz sein, also ist <Formel tex={t`t\in\{0;\,1;\,2;\,3\}`} nach="." />
        </>,
        <>
          Die Lösungen sind
          <Formel anzeige tex={t`(5;\,9;\,0),\ (7;\,6;\,1),`} />
          <Formel anzeige tex={t`(9;\,3;\,2),\ (11;\,0;\,3)`} nach="." />
          Es gibt <strong>4</strong> Möglichkeiten. Die meisten Karten zu 2 Euro sind es für <Formel tex="t=3" nach=":" /> <Formel tex="x=11" nach="." /> Probe für <Formel tex="(7;\,6;\,1)" nach=":" /> <Formel tex={t`7+6+1=14`} /> und <Formel tex={t`14+18+5=37`} nach="." />
        </>,
      ]}
    >
      <p>
        Ein Verein verkauft bei einem Fest insgesamt 14 Eintrittskarten in drei Preisstufen: <Formel tex="x" /> Karten zu 2 €, <Formel tex="y" /> Karten zu 3 € und <Formel tex="z" /> Karten zu 5 €. Die Einnahmen betragen 37 €.
      </p>
      <Teile>
        <li>
          Bestimmen Sie die Lösungsmenge in <Formel tex={t`\mathbb{R}`} nach="." /> Stellen Sie dazu ein Gleichungssystem für <Formel tex="x" nach="," /> <Formel tex="y" /> und <Formel tex="z" /> auf und setzen Sie <Formel tex="z=t" nach="." /> <BE n={3} />
        </li>
        <li>
          Ermitteln Sie alle Lösungen, bei denen <Formel tex="x" nach="," /> <Formel tex="y" /> und <Formel tex="z" /> nichtnegative ganze Zahlen sind. Geben Sie die Anzahl der Möglichkeiten und die größte mögliche Zahl <Formel tex="x" /> an. <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 3: Parameter in Koeffizient und rechter Seite, Begründung der Fälle. */
function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Ein Parameter in der letzten Gleichung"
      felder={[
        { id: 'x', name: 'Lösung x für a gleich 1', beschriftung: <><Formel tex="x" /> für <Formel tex="a=1" /></>, erwartet: A3.a1[0]! },
        { id: 'y', name: 'Lösung y für a gleich 1', beschriftung: <><Formel tex="y" /> für <Formel tex="a=1" /></>, erwartet: A3.a1[1]! },
        { id: 'z', name: 'Lösung z für a gleich 1', beschriftung: <><Formel tex="z" /> für <Formel tex="a=1" /></>, erwartet: A3.a1[2]! },
        { id: 'x0', name: 'Zahl ohne t in x für a gleich 2', beschriftung: <><Formel tex="x" /> ohne <Formel tex="t" /></>, erwartet: A3.a2.x[0]! },
        { id: 'xt', name: 'Zahl vor t in x für a gleich 2', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="x" /></>, erwartet: A3.a2.x[1]! },
        { id: 'y0', name: 'Zahl ohne t in y für a gleich 2', beschriftung: <><Formel tex="y" /> ohne <Formel tex="t" /></>, erwartet: A3.a2.y[0]! },
        { id: 'yt', name: 'Zahl vor t in y für a gleich 2', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="y" /></>, erwartet: A3.a2.y[1]! },
      ]}
      hilfen={[
        <>Das System steht schon in Stufenform. Beginne bei Gleichung III, dort kommt nur <Formel tex="z" /> vor, und setze von unten nach oben ein.</>,
        <>Für Teil b: Zerlege <Formel tex={t`a^2-2a`} /> und <Formel tex={t`a^2-4`} /> in Faktoren. Wann wird der Faktor vor <Formel tex="z" /> gleich 0?</>,
        <>Ist der Faktor vor <Formel tex="z" /> gleich 0, hängt es von der rechten Seite ab: Steht dort ebenfalls 0, ist <Formel tex="z" /> frei, sonst ist die Gleichung ein Widerspruch.</>,
      ]}
      loesung={[
        <>
          a: Für <Formel tex="a=1" /> lautet III <Formel tex={t`(1-2)\,z=1-4`} nach="," /> also <Formel tex="-z=-3" /> und <Formel tex="z=3" nach="." /> Aus II folgt <Formel tex={t`y-6=1`} nach="," /> also <Formel tex="y=7" nach="." /> Aus I folgt <Formel tex={t`x+7=1`} nach="," /> also <Formel tex="x=-6" nach="." /> Probe in II: <Formel tex={t`7-2\cdot 3=1`} nach="." />
        </>,
        <>
          b: Es ist <Formel tex={t`a^2-2a=a(a-2)`} /> und <Formel tex={t`a^2-4=(a-2)(a+2)`} nach="." /> Gleichung III lautet
          <Formel anzeige tex={t`a(a-2)\,z=(a-2)(a+2)`} nach="." />
          Der Faktor vor <Formel tex="z" /> ist 0 für <Formel tex="a=0" /> und für <Formel tex="a=2" nach="." />
        </>,
        <>
          Für <Formel tex="a=0" /> lautet III <Formel tex={t`0\cdot z=-4`} nach="." /> Das ist für kein <Formel tex="z" /> erfüllt, das System hat keine Lösung.
          Für <Formel tex="a=2" /> lautet III <Formel tex={t`0\cdot z=0`} nach="." /> Dann ist <Formel tex="z" /> frei wählbar und aus II und I folgen <Formel tex="y" /> und <Formel tex="x" nach="." /> Das System hat unendlich viele Lösungen.
          Für alle anderen <Formel tex="a" /> ist <Formel tex={t`z=\frac{a+2}{a}`} nach="," /> und II und I legen <Formel tex="y" /> und <Formel tex="x" /> fest: genau eine Lösung. Es gibt also genau einen Wert ohne Lösung (<Formel tex="a=0" nach=")" /> und genau einen mit unendlich vielen Lösungen (<Formel tex="a=2" nach=")." />
        </>,
        <>
          c: Für <Formel tex="a=2" /> setzt du <Formel tex="z=t" nach="." /> Aus II folgt <Formel tex={t`y=1+2t`} nach="." /> Aus I folgt <Formel tex={t`x=2-y=1-2t`} nach="." />
          <Formel anzeige tex={t`L=\{(1-2t;\,1+2t;\,t)\mid t\in\mathbb{R}\}`} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben ist für jede reelle Zahl <Formel tex="a" /> das Gleichungssystem
      </p>
      <Formel anzeige tex={t`\begin{aligned}\text{I}\quad x+y&=a\\\text{II}\quad y-2z&=1\\\text{III}\quad (a^2-2a)\,z&=a^2-4\end{aligned}`} nach="." />
      <Teile>
        <li>
          Bestimmen Sie die Lösung des Systems für <Formel tex="a=1" nach="." /> <BE n={2} />
        </li>
        <li>
          Begründen Sie: Es gibt genau einen Wert von <Formel tex="a" nach="," /> für den das System keine Lösung hat, und genau einen Wert von <Formel tex="a" nach="," /> für den es unendlich viele Lösungen hat. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie für den Wert von <Formel tex="a" nach="," /> für den es unendlich viele Lösungen gibt, die Lösungsmenge. Setzen Sie <Formel tex="z=t" nach="." /> <BE n={2} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 4: Anzahl der Lösungen in Abhängigkeit von c, nie unendlich viele. */
function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Anzahl der Lösungen"
      felder={[
        { id: 'keine', name: 'Wert von c, für den es keine Lösung gibt', beschriftung: <>Keine Lösung für <Formel tex="c" /></>, erwartet: A4.keine },
        { id: 'x', name: 'Lösung x für c gleich 2', beschriftung: <><Formel tex="x" /> für <Formel tex="c=2" /></>, erwartet: A4.c2[0]! },
        { id: 'y', name: 'Lösung y für c gleich 2', beschriftung: <><Formel tex="y" /> für <Formel tex="c=2" /></>, erwartet: A4.c2[1]! },
        { id: 'z', name: 'Lösung z für c gleich 2', beschriftung: <><Formel tex="z" /> für <Formel tex="c=2" /></>, erwartet: A4.c2[2]! },
      ]}
      hilfen={[
        <>Löse die Gleichungen I und II nach <Formel tex="y" /> und <Formel tex="z" /> auf und drücke beide durch <Formel tex="x" /> aus. Setze das Ergebnis in III ein.</>,
        <>Es entsteht eine Gleichung der Form <Formel tex={t`(\dots)\cdot x=\dots`} nach="." /> Für welchen Wert von <Formel tex="c" /> verschwindet der Faktor vor <Formel tex="x" nach="?" /></>,
        <>Ein Wert von <Formel tex="c" /> macht die Gleichung zum Widerspruch. Für alle anderen kannst du durch den Faktor teilen. Kommt die Zahl der Lösungen unendlich vor? Prüfe, ob die rechte Seite von <Formel tex="c" /> abhängt.</>,
      ]}
      loesung={[
        <>
          a: Aus I folgt <Formel tex={t`y=2-x`} nach="." /> Aus II folgt <Formel tex={t`z=3-y=1+x`} nach="." /> Eingesetzt in III:
          <Formel anzeige tex={t`c\,x+(1+x)=4`} />
          <Formel anzeige tex={t`(c+1)\,x=3`} nach="." />
        </>,
        <>
          Für <Formel tex="c=-1" /> lautet die Gleichung <Formel tex={t`0\cdot x=3`} nach="." /> Das ist ein Widerspruch: keine Lösung. Für <Formel tex={t`c\neq -1`} /> ist <Formel tex={t`x=\frac{3}{c+1}`} nach="," /> und <Formel tex="y" /> und <Formel tex="z" /> folgen daraus: genau eine Lösung. Die rechte Seite 3 hängt nicht von <Formel tex="c" /> ab, deshalb gibt es nie unendlich viele Lösungen.
        </>,
        <>
          b: Für <Formel tex="c=2" /> ist <Formel tex={t`3x=3`} nach="," /> also <Formel tex="x=1" nach="." /> Dann ist <Formel tex="y=2-1=1" /> und <Formel tex="z=1+1=2" nach="." /> Probe in III: <Formel tex={t`2\cdot 1+2=4`} nach="." /> <Formel tex={t`L=\{(1;\,1;\,2)\}`} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben ist für jede reelle Zahl <Formel tex="c" /> das Gleichungssystem
      </p>
      <Formel anzeige tex={t`\begin{aligned}\text{I}\quad x+y&=2\\\text{II}\quad y+z&=3\\\text{III}\quad c\,x+z&=4\end{aligned}`} nach="." />
      <Teile>
        <li>
          Untersuchen Sie in Abhängigkeit von <Formel tex="c" /> die Anzahl der Lösungen des Systems. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie die Lösung für <Formel tex="c=2" nach="." /> <BE n={2} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 5: zwei Gleichungen, eine dritte mit Parameter. */
function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Eine zusätzliche Gleichung"
      felder={[
        { id: 'a', name: 'Wert von a, für den es unendlich viele Lösungen gibt', beschriftung: <>Wert von <Formel tex="a" /></>, erwartet: A5.a },
        { id: 'x0', name: 'Zahl ohne t in x', beschriftung: <><Formel tex="x" /> ohne <Formel tex="t" /></>, erwartet: A5.x[0]! },
        { id: 'xt', name: 'Zahl vor t in x', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="x" /></>, erwartet: A5.x[1]! },
      ]}
      hilfen={[
        <>Vergleiche die Zahlen vor <Formel tex="x" nach="," /> <Formel tex="y" /> und <Formel tex="z" /> in Gleichung III mit denen in I und II. Lässt sich III aus I und II zusammensetzen?</>,
        <>Es ist <Formel tex={t`(3;\,1;\,2)=(1;\,2;\,-1)+(2;\,-1;\,3)`} nach="." /> Bilde die Summe der beiden ersten Gleichungen und vergleiche sie mit III.</>,
        <>Ist III die Summe von I und II, ist sie für <Formel tex="a=3+6" /> überflüssig und sonst ein Widerspruch. Eine zusätzliche Gleichung kann aus zwei Gleichungen mit unendlich vielen Lösungen nur dann genau eine Lösung machen, wenn sie unabhängig ist.</>,
      ]}
      loesung={[
        <>
          a: Einsetzen in I: <Formel tex={t`2+2\cdot 1-1=3`} nach="." /> Einsetzen in II: <Formel tex={t`2\cdot 2-1+3\cdot 1=6`} nach="." /> Beide Gleichungen sind erfüllt.
        </>,
        <>
          b: Addiert man I und II, erhält man die linke Seite <Formel tex={t`3x+y+2z`} /> und die rechte Seite <Formel tex={t`3+6=9`} nach="." /> Das ist die linke Seite von III. Also gilt für ein <Formel tex="(x;\,y;\,z)" nach=":" /> Erfüllt es I und II, so ist <Formel tex={t`3x+y+2z=9`} nach="." />
          <Formel anzeige tex={t`\text{III}-\text{I}-\text{II}\ \Rightarrow\ 0=a-9`} nach="." />
        </>,
        <>
          Für <Formel tex="a=9" /> ist III überflüssig, das System hat dieselben Lösungen wie I und II, und das sind unendlich viele. Für <Formel tex={t`a\neq 9`} /> ergibt sich <Formel tex={t`0=a-9\neq 0`} nach="," /> ein Widerspruch: keine Lösung. Es gibt also keinen Wert von <Formel tex="a" nach="," /> für den das System genau eine Lösung hat. Die Aussage ist <strong>falsch</strong>.
        </>,
        <>
          c: Wie in Teil b gilt <Formel tex="a=9" nach="." /> Für I und II ergibt <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} nach=":" /> <Formel tex={t`-5y+5z=0`} nach="," /> also <Formel tex="y=z" nach="." /> Mit <Formel tex="z=t" /> ist <Formel tex={t`x=3-2t+t=3-t`} nach="." />
          <Formel anzeige tex={t`L=\{(3-t;\,t;\,t)\mid t\in\mathbb{R}\}`} nach="." />
          Probe mit <Formel tex="t=1" nach=":" /> <Formel tex={t`(2;\,1;\,1)`} nach="," /> das ist die Lösung aus Teil a.
        </>,
      ]}
    >
      <p>
        Gegeben ist das lineare Gleichungssystem
      </p>
      <Formel anzeige tex={t`\begin{aligned}\text{I}\quad x+2y-z&=3\\\text{II}\quad 2x-y+3z&=6\end{aligned}`} nach="." />
      <Teile>
        <li>
          Zeigen Sie, dass <Formel tex="x=2" nach="," /> <Formel tex="y=1" /> und <Formel tex="z=1" /> eine Lösung dieses Systems ist. <BE n={1} />
        </li>
        <li>
          Das System wird um die Gleichung <Formel tex={t`\text{III}\quad 3x+y+2z=a`} /> mit <Formel tex={t`a\in\mathbb{R}`} /> ergänzt. Beurteilen Sie die folgende Aussage: Es gibt einen Wert von <Formel tex="a" nach="," /> für den das aus I, II und III bestehende System genau eine Lösung hat. <BE n={4} />
        </li>
        <li>
          Bestimmen Sie den Wert von <Formel tex="a" nach="," /> für den das aus I, II und III bestehende System unendlich viele Lösungen hat, und geben Sie die Lösungsmenge an. Setzen Sie <Formel tex="z=t" nach="." /> <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 6: zwei Gleichungen mit zwei Unbekannten, grafische Darstellung. */
function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Grafische Darstellung zweier Gleichungen"
      felder={[
        { id: 'y', name: 'Lösung y für x gleich minus 2', beschriftung: <><Formel tex="y" /> für <Formel tex="x=-2" /></>, erwartet: A6.punkt[1]! },
        { id: 'a', name: 'Wert von a', beschriftung: <><Formel tex="a" /></>, erwartet: A6.a },
        { id: 'b', name: 'Wert von b', beschriftung: <><Formel tex="b" /></>, erwartet: A6.b },
      ]}
      hilfen={[
        <>Löse die Gleichungen nach <Formel tex="y" /> auf, um die Geraden zu zeichnen. Vergleiche die beiden Geraden: Was fällt dir auf?</>,
        <>Gleichung II ist das Dreifache von Gleichung I. Für Teil b: <Formel tex={t`a\,x+8y=b`} /> muss ein Vielfaches von I sein. Mit welchem Faktor erhält man die 8 vor <Formel tex="y" nach="?" /></>,
        <>Der Faktor ist 4. Multipliziere alle Zahlen von I mit 4 und lies <Formel tex="a" /> und <Formel tex="b" /> ab. Ist die rechte Seite verschieden, sind die Geraden parallel und es gibt keine gemeinsamen Punkte.</>,
      ]}
      loesung={[
        <>
          a: Aus I folgt <Formel tex={t`y=2-\frac{1}{2}x`} nach="." /> Gleichung II ist das Dreifache von I, sie beschreibt dieselbe Gerade. Die Lösungsmenge sind alle Punkte dieser Geraden. Für <Formel tex="x=-2" /> ist <Formel tex={t`y=2+1=3`} nach="." /> Die Lösung ist <Formel tex={t`(-2;\,3)`} nach="." />
          <BildA6 />
        </>,
        <>
          b: Für unendlich viele Lösungen muss II* ein Vielfaches von I sein. Von 2 vor <Formel tex="y" /> in I zu 8 vor <Formel tex="y" /> in II* ist es der Faktor 4. Also ist II* gleich <Formel tex={t`4x+8y=16`} nach="," /> und damit <Formel tex="a=4" /> und <Formel tex="b=16" nach="." />
        </>,
        <>
          c: Für <Formel tex="a=4" /> und <Formel tex="b=20" /> lautet II* <Formel tex={t`4x+8y=20`} nach="," /> also <Formel tex={t`x+2y=5`} nach="." /> Zusammen mit I (<Formel tex={t`x+2y=4`} nach=")" /> ergäbe das <Formel tex="4=5" nach="." /> Ein Widerspruch: Beide Geraden sind parallel, haben aber verschiedene Achsenabschnitte (<Formel tex="2" /> und <Formel tex={t`\frac{5}{2}`} nach=")." /> Das System hat keine Lösung.
        </>,
      ]}
    >
      <p>
        Das Gleichungssystem
      </p>
      <Formel anzeige tex={t`\begin{aligned}\text{I}\quad x+2y&=4\\\text{II}\quad 3x+6y&=12\end{aligned}`} />
      <p>
        mit <Formel tex={t`x,y\in\mathbb{R}`} /> hat unendlich viele Lösungen.
      </p>
      <Teile>
        <li>
          Zeichnen Sie die Lösungsmenge in ein Koordinatensystem und geben Sie die Lösung mit <Formel tex="x=-2" /> an. <BE n={3} />
        </li>
        <li>
          Die Gleichung II wird ersetzt durch <Formel tex={t`\text{II}^*\quad a\,x+8y=b`} /> mit <Formel tex={t`a,b\in\mathbb{R}`} nach="." /> Bestimmen Sie <Formel tex="a" /> und <Formel tex="b" /> so, dass das aus I und II* bestehende System unendlich viele Lösungen hat. <BE n={2} />
        </li>
        <li>
          Begründen Sie, dass das aus I und II* bestehende System für <Formel tex="a=4" /> und <Formel tex="b=20" /> keine Lösung hat. <BE n={2} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <BildA6 />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

export function OhneHilfsmittel() {
  return (
    <Abschnitt id="ohne-hilfsmittel" titel="Ohne Hilfsmittel">
      <Eingabehinweis />
      <Aufgabe1 />
      <Aufgabe2 />
      <Aufgabe3 />
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
    </Abschnitt>
  );
}
