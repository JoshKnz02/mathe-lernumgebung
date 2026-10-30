import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { BE, Teile } from '@/components/Teilaufgaben';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_A1, BILD_A2, BILD_A2_LOESUNG, BILD_A3_I, BILD_A3_II, BILD_A3_III, BILD_A4, BILD_A5, BILD_A6, BILD_A7 } from './Bilder';
import { A1, A2, A4, A5, A6, A7 } from './daten';

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl, als Dezimalzahl mit Komma oder als Bruch ein, zum Beispiel <code>2</code>, <code>-1,5</code> oder <Formel tex="\frac{3}{4}" nach="," /> ohne Einheit. Die Felder prüfen nur Ergebnisse. Begründungen und Rechenwege schreibst du in dein Heft, den Lösungsweg vergleichst du danach.
    </Hinweis>
  );
}

/** Aufgabe 1: Funktionenschar, Stammfunktion durch einen Punkt, Wendepunkt jeder Stammfunktion. */
function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Funktionenschar und Stammfunktionen"
      felder={[
        { id: 'f2', name: 'Funktionswert F von 2', beschriftung: <><Formel tex="F_3(2)" /></>, erwartet: A1.F2 },
        { id: 'int', name: 'Wert des Integrals', beschriftung: <>Integral von <Formel tex="-1" /> bis <Formel tex="1" /></>, erwartet: A1.integral },
        { id: 'wy', name: 'y-Koordinate des Wendepunkts', beschriftung: <><Formel tex="y" />-Koordinate von <Formel tex="W" /></>, erwartet: A1.wendeY },
      ]}
      hilfen={[
        <>Eine Stammfunktion von <Formel tex={t`x^2-1`} /> ist <Formel tex={t`\frac{1}{3}x^3-x`} nach="." /> Die Konstante bestimmst du mit der Bedingung <Formel tex="F_a(0)=1" nach="." /></>,
        <>Das Integral ist <Formel tex={t`F_3(1)-F_3(-1)`} nach="." /> Die additive Konstante fällt dabei heraus.</>,
        <>Die zweite Ableitung von <Formel tex="F_a" /> ist die erste Ableitung von <Formel tex="f_a" nach="." /> Eine Wendestelle braucht <Formel tex="F_a''(x_W)=0" /> und einen Vorzeichenwechsel von <Formel tex="F_a''" /> (siehe <Modulverweis modul="kurvendiskussion">Kurvendiskussion</Modulverweis>).</>,
      ]}
      loesung={[
        <>
          a: Eine Stammfunktion ist <Formel tex={t`F_a(x)=a\left(\frac{1}{3}x^3-x\right)+c`} nach="." /> Aus <Formel tex={t`F_a(0)=c=1`} /> folgt <Formel tex={t`F_a(x)=a\left(\frac{1}{3}x^3-x\right)+1`} nach="." /> Für <Formel tex="a=3" /> ist
          <Formel anzeige tex={t`\frac{8}{3}-2=\frac{2}{3}`} nach="," />
          <Formel anzeige tex={t`F_3(2)=3\cdot\frac{2}{3}+1`} />
          <Formel anzeige tex={t`{}=3`} nach="." />
        </>,
        <>
          b: Mit <Formel tex={t`F_3(1)=3\left(\frac{1}{3}-1\right)+1=-1`} /> und <Formel tex={t`F_3(-1)=3\left(-\frac{1}{3}+1\right)+1=3`} /> ist
          <Formel anzeige tex={t`\int_{-1}^{1}f_3(x)\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=F_3(1)`} />
          <Formel anzeige tex={t`{}-F_3(-1)`} />
          <Formel anzeige tex={t`{}=-1-3=-4`} nach="." />
          Der Wert ist negativ, weil <Formel tex="K_{f_3}" /> zwischen <Formel tex="-1" /> und <Formel tex="1" /> unterhalb der x-Achse liegt.
        </>,
        <>
          c: Es ist <Formel tex={t`F_a'(x)=f_a(x)`} /> und damit <Formel tex={t`F_a''(x)=f_a'(x)=2ax`} nach="." /> Notwendig ist <Formel tex={t`F_a''(x)=0`} nach="," /> also <Formel tex="x=0" nach="." /> Wegen <Formel tex="a\ne 0" /> wechselt <Formel tex={t`2ax`} /> an der Stelle 0 das Vorzeichen. Das ist hinreichend. Jede Stammfunktion hat bei <Formel tex="x=0" /> eine Wendestelle. Für <Formel tex="F_a(0)=1" /> liegt der Wendepunkt bei <Formel tex={t`W(0\,|\,1)`} nach="." />
          <FlaechenFigur daten={BILD_A1} unter={<>Eine solche Stammfunktion für <Formel tex="a=1" nach=":" /> Der Wendepunkt <Formel tex={t`W(0\,|\,1)`} /> liegt auf der y-Achse, links davon ist das Schaubild rechtsgekrümmt, rechts linksgekrümmt.</>} />
        </>,
      ]}
    >
      <p>
        Für jede reelle Zahl <Formel tex="a\ne 0" /> ist die Funktion <Formel tex="f_a" /> gegeben durch <Formel tex={t`f_a(x)=a\,(x^2-1)`} nach="." />
      </p>
      <Teile>
        <li>
          Bestimmen Sie die Stammfunktion <Formel tex="F_a" /> von <Formel tex="f_a" /> mit <Formel tex="F_a(0)=1" nach="." /> Geben Sie <Formel tex="F_3(2)" /> an. <BE n={2} />
        </li>
        <li>
          Berechnen Sie für <Formel tex="a=3" /> den Wert des Integrals <Formel tex={t`\int_{-1}^{1}f_3(x)\,\mathrm{d}x`} nach="." /> <BE n={2} />
        </li>
        <li>
          Zeigen Sie, dass das Schaubild jeder Stammfunktion von <Formel tex="f_a" /> an der Stelle <Formel tex="x=0" /> einen Wendepunkt hat. Geben Sie die y-Koordinate dieses Wendepunkts für <Formel tex="F_a" /> aus Teil a an. <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 2: Integrale und Flächeninhalt am Schaubild einer ungeraden Funktion. */
function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Integral und Flächeninhalt am Schaubild"
      felder={[
        { id: 'i02', name: 'Integral von 0 bis 2', beschriftung: <>Integral von <Formel tex="0" /> bis <Formel tex="2" /></>, erwartet: A2.int02 },
        { id: 'i22', name: 'Integral von minus 2 bis 2', beschriftung: <>Integral von <Formel tex="-2" /> bis <Formel tex="2" /></>, erwartet: A2.int22 },
        { id: 'a', name: 'Inhalt der eingeschlossenen Fläche', beschriftung: <>Flächeninhalt <Formel tex="A" /></>, erwartet: A2.flaeche },
      ]}
      hilfen={[
        <>Eine Stammfunktion von <Formel tex={t`f(x)=\frac{1}{2}x^3-2x`} /> ist <Formel tex={t`F(x)=\frac{1}{8}x^4-x^2`} nach="." /></>,
        <>Das Schaubild ist punktsymmetrisch zum Ursprung (<Formel tex={t`f(-x)=-f(x)`} nach=")." /> Zwei Flächenstücke gleicher Größe liegen dann auf verschiedenen Seiten der x-Achse.</>,
        <>Der Flächeninhalt ist die Summe der Beträge der Teilintegrale, siehe <Modulverweis modul="flaeche-kurve-x-achse">Flächeninhalt zwischen Kurve und x-Achse</Modulverweis>.</>,
      ]}
      loesung={[
        <>
          a: Mit <Formel tex={t`F(x)=\frac{1}{8}x^4-x^2`} /> ist
          <Formel anzeige tex={t`\int_{0}^{2}f(x)\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=F(2)-F(0)`} />
          <Formel anzeige tex={t`{}=2-4=-2`} nach="." />
          Das Flächenstück zwischen 0 und 2 liegt unterhalb der x-Achse, deshalb ist der Wert negativ.
        </>,
        <>
          b: Das Schaubild ist punktsymmetrisch zum Ursprung. Das Stück von <Formel tex="-2" /> bis <Formel tex="0" /> ist das am Ursprung gespiegelte Stück von 0 bis 2, liegt also oberhalb der x-Achse und hat den Wert <Formel tex="+2" nach="." /> Zusammen ist
          <Formel anzeige tex={t`\int_{-2}^{2}f(x)\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=2+(-2)=0`} nach="." />
        </>,
        <>
          c: Die Flächeninhalte sind die Beträge der Teilintegrale:
          <Formel anzeige tex={t`A=|2|+|-2|`} />
          <Formel anzeige tex={t`{}=4`} nach="." />
          <FlaechenFigur daten={BILD_A2_LOESUNG} unter={<>Die beiden Flächenstücke sind gleich groß. Das Integral über beide ist <Formel tex="0" nach="," /> der Flächeninhalt <Formel tex="4" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Die Abbildung zeigt das Schaubild <Formel tex="K_f" /> der Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=\frac{1}{2}x^3-2x`} nach="." />
      </p>
      <FlaechenFigur daten={BILD_A2} unter={<>Das Schaubild von <Formel tex="f" /> mit den Nullstellen <Formel tex="-2" nach="," /> <Formel tex="0" /> und <Formel tex="2" nach="." /></>} />
      <Teile>
        <li>
          Berechnen Sie <Formel tex={t`\int_{0}^{2}f(x)\,\mathrm{d}x`} nach="." /> <BE n={2} />
        </li>
        <li>
          Begründen Sie mithilfe der Symmetrie von <Formel tex="K_f" nach="," /> dass <Formel tex={t`\int_{-2}^{2}f(x)\,\mathrm{d}x`} /> einen bestimmten Wert hat, und geben Sie ihn an. <BE n={2} />
        </li>
        <li>
          Berechnen Sie den Inhalt der Fläche, die <Formel tex="K_f" /> mit der x-Achse einschließt. <BE n={2} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 3: Zuordnung der Integralfunktion zu den drei Schaubildern. */
function Frage3() {
  return (
    <Auswahlfrage
      nummer="3"
      titel="Welches Schaubild gehört zur Integralfunktion?"
      optionen={platziere(
        [
          opt('a', <>Graph I</>, false, <>Graph I schneidet die y-Achse bei 1. Es muss aber <Formel tex={t`I(0)=\int_{0}^{0}f(t)\,\mathrm{d}t=0`} /> gelten, die Integralfunktion beginnt bei der unteren Grenze mit dem Wert 0.</>),
          opt('b', <>Graph III</>, false, <>Graph III hat Hochpunkte bei <Formel tex="x=\pm 2" nach="." /> Die Integralfunktion hat dort Tiefpunkte, weil <Formel tex="f" /> an diesen Stellen von negativen zu positiven Werten wechselt. Graph III ist die an der x-Achse gespiegelte Integralfunktion, seine Ableitung ist <Formel tex="-f" nach="." /></>),
          opt('c', <>keiner der drei Graphen</>, false, <>Graph II erfüllt beide Bedingungen, <Formel tex="I(0)=0" /> und <Formel tex={t`I'=f`} nach="." /> Einer der drei Graphen gehört dazu.</>),
          opt('d', <>Graph II</>, true, <>Richtig. Graph II verläuft durch den Ursprung und hat Tiefpunkte bei <Formel tex="x=\pm 2" /> sowie einen Hochpunkt bei <Formel tex="x=0" nach="." /> Genau dort ist <Formel tex={t`f`} /> null mit dem passenden Vorzeichenwechsel.</>),
        ],
        1,
      )}
      erklaerung={
        <>
          Die Integralfunktion <Formel tex={t`I(x)=\int_{0}^{x}f(t)\,\mathrm{d}t`} /> hat zwei Eigenschaften, an denen man sie erkennt: <Formel tex="I(0)=0" /> und <Formel tex={t`I'(x)=f(x)`} nach="." /> Damit sind alle Stellen mit <Formel tex={t`f(x)=0`} /> Extremstellen von <Formel tex="I" nach=":" /> bei <Formel tex="x=-2" /> wechselt <Formel tex="f" /> von <Formel tex="-" /> nach <Formel tex="+" nach="," /> das ist ein Tiefpunkt. Bei <Formel tex="x=0" /> wechselt <Formel tex="f" /> von <Formel tex="+" /> nach <Formel tex="-" nach="," /> das ist ein Hochpunkt. Bei <Formel tex="x=2" /> wechselt <Formel tex="f" /> von <Formel tex="-" /> nach <Formel tex="+" nach="." /> Das passt nur zu Graph II, mit <Formel tex={t`I(x)=\frac{1}{8}x^4-x^2`} nach="." />
          <FlaechenFigur daten={BILD_A3_II} unter={<>Graph II ist das Schaubild der Integralfunktion <Formel tex="I" nach="." /></>} />
        </>
      }
    >
      <p>
        Gegeben ist wieder die Funktion <Formel tex="f" /> aus Aufgabe 2 mit <Formel tex={t`f(x)=\frac{1}{2}x^3-2x`} nach="." /> Die Integralfunktion <Formel tex="I" /> ist definiert durch <Formel tex={t`I(x)=\int_{0}^{x}f(t)\,\mathrm{d}t`} nach="." /> Welcher der folgenden Graphen gehört zu <Formel tex="I" nach="?" />
      </p>
      <FlaechenFigur daten={BILD_A3_I} unter={<>Graph I.</>} />
      <FlaechenFigur daten={BILD_A3_II} unter={<>Graph II.</>} />
      <FlaechenFigur daten={BILD_A3_III} unter={<>Graph III.</>} />
    </Auswahlfrage>
  );
}

/** Aufgabe 4: Flächenverhältnis unabhängig vom Parameter, Parameter aus der Fläche. */
function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Flächenverhältnis bei einer Parabelschar"
      felder={[
        { id: 'a1', name: 'Flächeninhalt für a gleich 1', beschriftung: <>Flächeninhalt für <Formel tex="a=1" /></>, erwartet: A4.flaecheA1 },
        { id: 'v', name: 'Verhältnis der Flächeninhalte', beschriftung: <>Verhältnis</>, erwartet: A4.verhaeltnis },
        { id: 'a', name: 'Wert von a', beschriftung: <><Formel tex="a" /></>, erwartet: A4.a },
      ]}
      hilfen={[
        <>Die Nullstellen von <Formel tex="f_a" /> sind <Formel tex="-2" /> und <Formel tex="2" nach="." /> Eine Stammfunktion von <Formel tex={t`a\,(4-x^2)`} /> ist <Formel tex={t`a\left(4x-\frac{1}{3}x^3\right)`} nach="." /></>,
        <>Der Hochpunkt von <Formel tex="K_{f_a}" /> liegt bei <Formel tex={t`(0\,|\,4a)`} nach="." /> Das Rechteck hat die Breite 4 und die Höhe <Formel tex="4a" nach="." /></>,
        <>Für Teil c setzt du den Flächeninhalt in Abhängigkeit von <Formel tex="a" /> gleich 16 und löst nach <Formel tex="a" nach="." /></>,
      ]}
      loesung={[
        <>
          a: Mit <Formel tex={t`F(x)=4x-\frac{1}{3}x^3`} /> ist
          <Formel anzeige tex={t`\int_{-2}^{2}(4-x^2)\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=F(2)-F(-2)`} />
          <Formel anzeige tex={t`{}=\frac{16}{3}+\frac{16}{3}`} />
          <Formel anzeige tex={t`{}=\frac{32}{3}`} nach="." />
          Für <Formel tex="a=1" /> ist der Flächeninhalt <Formel tex={t`\frac{32}{3}`} nach="." />
        </>,
        <>
          b: Für beliebiges <Formel tex="a>0" /> ist der Flächeninhalt <Formel tex={t`A_a=a\cdot\frac{32}{3}`} nach="." /> Das Rechteck hat den Inhalt <Formel tex={t`4\cdot 4a=16a`} nach="." /> Das Verhältnis ist
          <Formel anzeige tex={t`\frac{A_a}{16a}=\frac{\frac{32}{3}a}{16a}=\frac{2}{3}`} nach="." />
          Der Faktor <Formel tex="a" /> kürzt sich, das Verhältnis ist von <Formel tex="a" /> unabhängig. Die Parabelfläche füllt zwei Drittel des Rechtecks.
          <FlaechenFigur daten={BILD_A4} unter={<>Für <Formel tex="a=1" nach=":" /> Die Fläche unter der Parabel (blau) füllt zwei Drittel des Rechtecks (gestrichelt).</>} />
        </>,
        <>
          c: Aus <Formel tex={t`\frac{32}{3}a=16`} /> folgt <Formel tex={t`a=16\cdot\frac{3}{32}=\frac{3}{2}`} nach="." />
        </>,
      ]}
    >
      <p>
        Für jede reelle Zahl <Formel tex="a>0" /> ist die Funktion <Formel tex="f_a" /> gegeben durch <Formel tex={t`f_a(x)=a\,(4-x^2)`} nach="." /> Das Schaubild <Formel tex="K_{f_a}" /> schließt mit der x-Achse eine Fläche ein. Das Rechteck <Formel tex={t`R_a`} /> hat die Ecken <Formel tex={t`(-2\,|\,0)`} nach="," /> <Formel tex={t`(2\,|\,0)`} nach="," /> <Formel tex={t`(2\,|\,4a)`} /> und <Formel tex={t`(-2\,|\,4a)`} nach="." />
      </p>
      <Teile>
        <li>
          Berechnen Sie für <Formel tex="a=1" /> den Inhalt der Fläche, die <Formel tex="K_{f_a}" /> mit der x-Achse einschließt. <BE n={2} />
        </li>
        <li>
          Zeigen Sie, dass das Verhältnis aus dem Inhalt dieser Fläche und dem Inhalt von <Formel tex="R_a" /> für jedes <Formel tex="a>0" /> gleich ist, und geben Sie es an. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie den Wert von <Formel tex="a" nach="," /> für den die eingeschlossene Fläche den Inhalt 16 hat. <BE n={1} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A4} unter={<>Die Parabel für <Formel tex="a=1" /> mit dem Rechteck.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 5: Parabel durch gegebene Nullstellen mit zwei gleich großen Flächenstücken. */
function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Zwei gleich große Flächenstücke"
      felder={[
        { id: 'k', name: 'Wert von k', beschriftung: <><Formel tex="k" /></>, erwartet: A5.k },
        { id: 'teil', name: 'Inhalt eines Flächenstücks', beschriftung: <>Inhalt eines Stücks</>, erwartet: A5.teil },
      ]}
      hilfen={[
        <>Beide Funktionen haben die Nullstellen 0 und 6. Die Parabel hat deshalb die Form <Formel tex={t`p(x)=k\,x\,(x-6)`} nach="." /></>,
        <>Gleich große Flächenstücke auf verschiedenen Seiten bedeuten: Die orientierten Teilintegrale heben sich auf, also <Formel tex={t`\int_{0}^{6}\bigl(f(x)-p(x)\bigr)\,\mathrm{d}x=0`} nach="." /> Es ist <Formel tex={t`\int_{0}^{6}f(x)\,\mathrm{d}x=-27`} /> und <Formel tex={t`\int_{0}^{6}p(x)\,\mathrm{d}x=-36k`} nach="." /></>,
        <>Für Teil b brauchst du die Schnittstelle in der Mitte. Löse <Formel tex={t`f(x)-p(x)=0`} nach="." /> Die Differenz hat den Faktor <Formel tex="x" nach="." /></>,
      ]}
      loesung={[
        <>
          a: Mit dem Ansatz <Formel tex={t`p(x)=k\,x\,(x-6)`} /> ist <Formel tex={t`\int_{0}^{6}p(x)\,\mathrm{d}x=k\left[\frac{1}{3}x^3-3x^2\right]_0^6=-36k`} nach="." /> Für <Formel tex="f" /> ist <Formel tex={t`\int_{0}^{6}f(x)\,\mathrm{d}x=\left[\frac{1}{16}x^4-\frac{1}{2}x^3\right]_0^6=81-108=-27`} nach="." />
        </>,
        <>
          Liegen die Flächenstücke auf verschiedenen Seiten, haben ihre Teilintegrale entgegengesetztes Vorzeichen und gleichen Betrag. Ihre Summe ist null:
          <Formel anzeige tex={t`-27-(-36k)`} />
          <Formel anzeige tex={t`{}=0`} />
          <Formel anzeige tex={t`{}\Leftrightarrow\ 36k=27`} />
          <Formel anzeige tex={t`{}\Leftrightarrow\ k=\frac{3}{4}`} nach="." />
          Also ist <Formel tex={t`p(x)=\frac{3}{4}x\,(x-6)`} nach="." />
        </>,
        <>
          b: Die Differenz ist <Formel tex={t`f(x)-p(x)=\frac{1}{4}x^3-\frac{9}{4}x^2+\frac{9}{2}x=\frac{1}{4}x\,(x-3)(x-6)`} nach="." /> Die Schaubilder schneiden sich bei 0, 3 und 6. Mit <Formel tex={t`D(x)=\frac{1}{16}x^4-\frac{3}{4}x^3+\frac{9}{4}x^2`} /> ist
          <Formel anzeige tex={t`\int_{0}^{3}`} />
          <Formel anzeige tex={t`{}\bigl(f(x)-p(x)\bigr)\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=D(3)-D(0)`} />
          <Formel anzeige tex={t`{}=\frac{81}{16}-\frac{81}{4}`} />
          <Formel anzeige tex={t`{}+\frac{81}{4}`} />
          <Formel anzeige tex={t`{}=\frac{81}{16}`} nach="." />
          Jedes Flächenstück hat den Inhalt <Formel tex={t`\frac{81}{16}\approx 5{,}06`} nach="." />
          <FlaechenFigur daten={BILD_A5} unter={<>Die beiden Flächenstücke zwischen <Formel tex="K_f" /> und <Formel tex="K_p" /> sind gleich groß, jedes hat den Inhalt <Formel tex={t`\frac{81}{16}`} nach="." /> Das Vorzeichen im Bild zeigt nur, welche Kurve oben liegt.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist die Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=\frac{1}{4}x^2\,(x-6)`} nach="." /> Eine Parabel <Formel tex="K_p" /> einer quadratischen Funktion <Formel tex="p" /> hat dieselben Nullstellen wie <Formel tex="f" nach="." /> Sie und <Formel tex="K_f" /> schließen im vierten Quadranten zwei gleich große Flächenstücke ein.
      </p>
      <Teile>
        <li>
          Ermitteln Sie eine Gleichung von <Formel tex="p" nach="." /> Geben Sie dazu den Faktor <Formel tex="k" /> in <Formel tex={t`p(x)=k\,x\,(x-6)`} /> an. <BE n={4} />
        </li>
        <li>
          Berechnen Sie den Inhalt eines der beiden Flächenstücke. <BE n={3} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A5} unter={<>Die Schaubilder von <Formel tex="f" /> und <Formel tex="p" /> mit den beiden Flächenstücken.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 6: Rate und Bestand ohne Hilfsmittel. */
function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Wasserstand in einem Becken"
      felder={[
        { id: 'tmin', name: 'Zeitpunkt der stärksten Abnahme in Stunden', beschriftung: <>Zeitpunkt in Stunden</>, erwartet: A6.tmin },
        { id: 'wmin', name: 'kleinste Rate', beschriftung: <>kleinste Rate</>, erwartet: A6.wmin },
        { id: 'zu', name: 'Zunahme in den ersten zwei Stunden', beschriftung: <>Zunahme in den ersten 2 h</>, erwartet: A6.zu },
        { id: 'aend', name: 'Änderung des Volumens in zehn Stunden', beschriftung: <>Änderung in 10 h</>, erwartet: A6.aend },
      ]}
      hilfen={[
        <>Die Rate <Formel tex="w" /> ist eine Parabel. Ihr kleinster Wert liegt am Scheitelpunkt. Du findest ihn mit <Formel tex={t`w'(t)=0`} nach="." /></>,
        <>Die Änderung des Volumens ist das Integral der Rate, <Formel tex={t`\int_{a}^{b}w(t)\,\mathrm{d}t`} nach="." /> Eine Stammfunktion von <Formel tex="w" /> ist <Formel tex={t`W(t)=\frac{1}{6}t^3-\frac{5}{2}t^2+8t`} nach="." /></>,
        <>Ein negativer Wert der Änderung bedeutet: Am Ende ist weniger Wasser im Becken als am Anfang.</>,
      ]}
      loesung={[
        <>
          a: Mit <Formel tex={t`w'(t)=t-5`} /> ist <Formel tex={t`w'(t)=0`} /> für <Formel tex="t=5" nach="." /> Dort ist <Formel tex={t`w(5)=12{,}5-25+8=-4{,}5`} nach="." /> Nach fünf Stunden nimmt das Wasservolumen mit <Formel tex="4{,}5" /> Kubikmetern pro Stunde am stärksten ab.
        </>,
        <>
          b: Die Rate ist von 0 bis 2 Stunden nicht negativ (<Formel tex={t`w(t)=\frac{1}{2}(t-2)(t-8)`} nach=")." /> Die Zunahme ist
          <Formel anzeige tex={t`\int_{0}^{2}w(t)\,\mathrm{d}t`} />
          <Formel anzeige tex={t`{}=W(2)-W(0)`} />
          <Formel anzeige tex={t`{}=\frac{4}{3}-10+16`} />
          <Formel anzeige tex={t`{}=\frac{22}{3}`} nach="." />
          Das Volumen wächst in den ersten zwei Stunden um <Formel tex={t`\frac{22}{3}\approx 7{,}33`} /> Kubikmeter.
        </>,
        <>
          c: Mit <Formel tex={t`W(10)=\frac{1000}{6}-250+80=-\frac{10}{3}`} /> ist
          <Formel anzeige tex={t`\int_{0}^{10}w(t)\,\mathrm{d}t`} />
          <Formel anzeige tex={t`{}=W(10)`} />
          <Formel anzeige tex={t`{}-W(0)`} />
          <Formel anzeige tex={t`{}=-\frac{10}{3}`} nach="." />
          Nach zehn Stunden sind <Formel tex={t`\frac{10}{3}\approx 3{,}33`} /> Kubikmeter weniger im Becken als zu Beginn. Die Zunahme am Anfang (<Formel tex="+7{,}33" nach=")" /> und am Ende (<Formel tex="+7{,}33" nach=")" /> wird von der Abnahme dazwischen (<Formel tex="-18" nach=")" /> überwogen.
          <FlaechenFigur daten={BILD_A6} unter={<>Die Integrale über die drei Abschnitte sind <Formel tex={t`\frac{22}{3}`} nach="," /> <Formel tex="-18" /> und <Formel tex={t`\frac{22}{3}`} nach="," /> ihre Summe ist <Formel tex={t`-\frac{10}{3}`} nach="." /></>} />
        </>,
      ]}
    >
      <p>
        In ein Becken fließt Wasser zu und ab. Die momentane Änderungsrate des Wasservolumens wird für <Formel tex={t`0\le t\le 10`} /> durch <Formel tex={t`w(t)=\frac{1}{2}t^2-5t+8`} /> beschrieben. Dabei ist <Formel tex="t" /> die Zeit in Stunden seit Beobachtungsbeginn und <Formel tex="w(t)" /> die Rate in Kubikmetern pro Stunde.
      </p>
      <Teile>
        <li>
          Bestimmen Sie den Zeitpunkt, zu dem das Volumen am stärksten abnimmt, und die zugehörige Rate. <BE n={3} />
        </li>
        <li>
          Berechnen Sie, um wie viel das Wasservolumen in den ersten zwei Stunden zunimmt. <BE n={2} />
        </li>
        <li>
          Berechnen Sie die Änderung des Volumens in den zehn Stunden und deuten Sie das Vorzeichen des Ergebnisses im Sachzusammenhang. <BE n={3} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A6} unter={<>Das Schaubild der Rate <Formel tex="w" /> mit den Teilflächen.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 7: Fläche zwischen Kurve und Gerade durch den Hochpunkt, Beträge der Teilintegrale. */
function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Kurve und Gerade durch den Hochpunkt"
      felder={[
        { id: 'x2', name: 'zweite Schnittstelle', beschriftung: <>zweite Schnittstelle</>, erwartet: A7.schnitt[1]! },
        { id: 'x3', name: 'dritte Schnittstelle', beschriftung: <>dritte Schnittstelle</>, erwartet: A7.schnitt[2]! },
        { id: 'a', name: 'Inhalt der eingeschlossenen Fläche', beschriftung: <>Flächeninhalt <Formel tex="A" /></>, erwartet: A7.flaeche },
      ]}
      hilfen={[
        <>Der Hochpunkt hat die Koordinaten <Formel tex={t`H(1\,|\,4)`} nach="." /> Die Gerade durch den Ursprung und <Formel tex="H" /> hat die Steigung 4.</>,
        <>Setze <Formel tex={t`f(x)=g(x)`} /> und klammere <Formel tex="x" /> aus. Danach bleibt eine quadratische Gleichung.</>,
        <>Zwischen 0 und 1 liegt <Formel tex="K_f" /> oben, zwischen 1 und 5 liegt <Formel tex="K_g" /> oben. Berechne beide Teilintegrale und addiere die Beträge.</>,
      ]}
      loesung={[
        <>
          a: Aus <Formel tex={t`f'(x)=3x^2-12x+9=3(x-1)(x-3)`} /> folgt, dass <Formel tex="K_f" /> bei <Formel tex="x=1" /> den Hochpunkt <Formel tex={t`H(1\,|\,4)`} /> hat. Die Gerade durch den Ursprung und <Formel tex="H" /> ist <Formel tex={t`g(x)=4x`} nach="." />
        </>,
        <>
          Aus <Formel tex={t`f(x)=g(x)`} /> folgt
          <Formel anzeige tex={t`x^3-6x^2`} />
          <Formel anzeige tex={t`{}+5x=0`} />
          <Formel anzeige tex={t`x\,(x-1)(x-5)`} />
          <Formel anzeige tex={t`{}=0`} nach="." />
          Die Schnittstellen sind 0, 1 und 5.
        </>,
        <>
          b: Mit <Formel tex={t`D(x)=\frac{1}{4}x^4-2x^3+\frac{5}{2}x^2`} /> als Stammfunktion von <Formel tex={t`f(x)-g(x)`} /> ist
          <Formel anzeige tex={t`\int_{0}^{1}(f-g)`} />
          <Formel anzeige tex={t`{}=D(1)-D(0)`} />
          <Formel anzeige tex={t`{}=\frac{3}{4}`} nach="," />
          <Formel anzeige tex={t`\int_{1}^{5}(f-g)`} />
          <Formel anzeige tex={t`{}=D(5)-D(1)`} />
          <Formel anzeige tex={t`{}=-\frac{125}{4}-\frac{3}{4}`} />
          <Formel anzeige tex={t`{}=-32`} nach="." />
          Der Flächeninhalt ist die Summe der Beträge:
          <Formel anzeige tex={t`A=\frac{3}{4}+32`} />
          <Formel anzeige tex={t`{}=\frac{131}{4}`} />
          <Formel anzeige tex={t`{}=32{,}75`} nach="." />
          <FlaechenFigur daten={BILD_A7} unter={<>Das kleine Stück (blau, <Formel tex="+0{,}75" nach=")" /> und das große Stück (rosa, <Formel tex="-32" nach=")" /> zwischen <Formel tex="K_f" /> und der Geraden.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist die Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=x^3-6x^2+9x`} nach="." /> Das Schaubild <Formel tex="K_f" /> hat bei <Formel tex={t`H(1\,|\,4)`} /> einen Hochpunkt. Die Gerade <Formel tex="g" /> verläuft durch den Ursprung und durch <Formel tex="H" nach="." />
      </p>
      <Teile>
        <li>
          Bestimmen Sie die Gleichung von <Formel tex="g" /> und die gemeinsamen Punkte von <Formel tex="K_f" /> und <Formel tex="g" nach="." /> Geben Sie die zweite und dritte Schnittstelle an (die erste ist 0). <BE n={3} />
        </li>
        <li>
          Berechnen Sie den Inhalt der Fläche, die <Formel tex="K_f" /> und <Formel tex="g" /> einschließen. <BE n={4} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A7} unter={<>Die Schaubilder von <Formel tex="f" /> und <Formel tex="g" /> mit den eingeschlossenen Stücken.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

export function OhneHilfsmittel() {
  return (
    <Abschnitt id="ohne-hilfsmittel" titel="Ohne Hilfsmittel">
      <p>
        Sieben kurze Aufgaben ohne Taschenrechner. Die Zahlen sind so gewählt, dass sich alles exakt von Hand rechnen lässt. Aufgabe 3 ist eine Auswahlfrage.
      </p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Aufgabe2 />
      <Frage3 />
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
      <Aufgabe7 />
    </Abschnitt>
  );
}
