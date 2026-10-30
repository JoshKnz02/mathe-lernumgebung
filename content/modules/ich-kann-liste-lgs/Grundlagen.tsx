import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K2, K3 } from './werte';

/** Bereich Grundlagen: Aussagen 1 bis 3. */
export function Grundlagen() {
  return (
    <Abschnitt id="grundlagen" titel="Grundlagen">
      <p>Hier geht es um das Erkennen linearer Systeme und um das Lösen von Systemen mit zwei Unbekannten.</p>
      <Eingabehinweis />

      <Punkt id="linear-nichtlinear">
        <Kontrollfrage
          aussage="linear-nichtlinear"
          nummer="K1"
          titel="Welches System ist linear?"
          optionen={platziere(
            [
              opt('a', <Formel tex={t`\left\{\begin{array}{l}3x-y=4\\x+2y=6\end{array}\right.`} />, true, <>Richtig.</>),
              opt('b', <Formel tex={t`\left\{\begin{array}{l}x\cdot y=6\\x-y=1\end{array}\right.`} />, false, <>In der ersten Gleichung werden die Unbekannten <Formel tex="x" /> und <Formel tex="y" /> miteinander multipliziert. In einem linearen System kommen sie nur einzeln vor und werden mit Zahlen multipliziert.</>),
              opt('c', <Formel tex={t`\left\{\begin{array}{l}x^2+y=5\\x+y=3\end{array}\right.`} />, false, <>Die Unbekannte <Formel tex="x" /> kommt in der ersten Gleichung in der zweiten Potenz vor. In einem linearen System steht jede Unbekannte nur in der ersten Potenz.</>),
              opt('d', <Formel tex={t`\left\{\begin{array}{l}\frac{1}{x}+y=2\\x-y=0\end{array}\right.`} />, false, <>Die Unbekannte <Formel tex="x" /> steht im Nenner. Das ist keine Multiplikation mit einer Zahl, das System ist nicht linear.</>),
            ],
            2,
          )}
          erklaerung={
            <p>
              Jede Gleichung eines linearen Systems mit zwei Unbekannten hat die Form <Formel tex={t`a\,x+b\,y=c`} /> mit Zahlen <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" nach="." /> Nur das System mit <Formel tex={t`3x-y=4`} /> und <Formel tex={t`x+2y=6`} /> hat in beiden Gleichungen diese Form (Modul <Modulverweis modul="gauss-algorithmus">Gauß-Algorithmus</Modulverweis>).
            </p>
          }
        >
          <p>Eines der vier Gleichungssysteme ist linear. Wähle es aus.</p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="nichtlinear-loesen">
        <Kontrolle
          aussage="nichtlinear-loesen"
          nummer="K2"
          titel="Ein einfaches nichtlineares System"
          felder={[
            { id: 'x1', name: 'kleinere x-Koordinate der ersten Lösung', beschriftung: <><Formel tex="x_1" /></>, erwartet: K2.x1 },
            { id: 'y1', name: 'y-Koordinate der ersten Lösung', beschriftung: <><Formel tex="y_1" /></>, erwartet: K2.y1 },
            { id: 'x2', name: 'größere x-Koordinate der zweiten Lösung', beschriftung: <><Formel tex="x_2" /></>, erwartet: K2.x2 },
            { id: 'y2', name: 'y-Koordinate der zweiten Lösung', beschriftung: <><Formel tex="y_2" /></>, erwartet: K2.y2 },
          ]}
          hilfen={[
            <>Löse die lineare Gleichung nach einer Unbekannten auf und setze das Ergebnis in die andere Gleichung ein (Einsetzungsverfahren).</>,
            <>Aus <Formel tex={t`x-y=1`} /> folgt <Formel tex={t`y=x-1`} nach="." /> Eingesetzt in <Formel tex={t`x\cdot y=12`} /> entsteht eine quadratische Gleichung in <Formel tex="x" nach="." /></>,
          ]}
          loesung={[
            <>
              Aus der zweiten Gleichung folgt <Formel tex={t`y=x-1`} nach="." /> Eingesetzt in die erste: <Formel tex={t`x(x-1)=12`} nach="," /> also <Formel tex={t`x^2-x-12=0`} nach="." />
            </>,
            <>
              Mit der Lösungsformel: <Formel tex={t`x=\frac{1}{2}\pm\sqrt{\frac{1}{4}+12}=\frac{1}{2}\pm\frac{7}{2}`} nach="," /> also <Formel tex="x_1=-3" /> und <Formel tex="x_2=4" nach="." /> Mit <Formel tex={t`y=x-1`} /> ist <Formel tex="y_1=-4" /> und <Formel tex="y_2=3" nach="." />
            </>,
            <>
              Probe: <Formel tex={t`(-3)\cdot(-4)=12`} /> und <Formel tex={t`-3-(-4)=1`} nach=";" /> <Formel tex={t`4\cdot 3=12`} /> und <Formel tex={t`4-3=1`} nach="." /> Die Lösungsmenge ist <Formel tex={t`L=\{(-3;\,-4),\ (4;\,3)\}`} nach="." />
            </>,
          ]}
        >
          <p>
            Löse das Gleichungssystem. Es hat zwei Lösungen <Formel tex={t`(x_1\mid y_1)`} /> und <Formel tex={t`(x_2\mid y_2)`} nach="," /> bei denen <Formel tex={t`x_1<x_2`} /> gilt.
          </p>
          <Formel anzeige tex={t`\begin{aligned}x\cdot y&=12\\x-y&=1\end{aligned}`} nach="." />
        </Kontrolle>
      </Punkt>

      <Punkt id="zwei-unbekannte">
        <Kontrolle
          aussage="zwei-unbekannte"
          teil="a"
          nummer="K3a"
          titel="Zwei Unbekannte, Teil a"
          felder={[
            { id: 'x', name: 'Lösung x', beschriftung: <Formel tex="x" />, erwartet: K3.a.x },
            { id: 'y', name: 'Lösung y', beschriftung: <Formel tex="y" />, erwartet: K3.a.y },
          ]}
          hilfen={[
            <>Die Koeffizienten von <Formel tex="y" /> sind 2 und <Formel tex="-2" nach="." /> Welches Verfahren bietet sich an?</>,
            <>Addiere die beiden Gleichungen (Additionsverfahren). Dann fällt <Formel tex="y" /> weg.</>,
          ]}
          loesung={[
            <>
              Addition der Gleichungen: <Formel tex={t`3x+5x+2y-2y=13+11`} nach="," /> also <Formel tex="8x=24" /> und <Formel tex="x=3" nach="." />
            </>,
            <>
              Einsetzen in die erste Gleichung: <Formel tex={t`9+2y=13`} nach="," /> also <Formel tex="y=2" nach="." /> Probe in der zweiten: <Formel tex={t`15-4=11`} nach="." /> <Formel tex={t`L=\{(3;\,2)\}`} nach="." />
            </>,
          ]}
        >
          <p>Löse das Gleichungssystem mit einem Verfahren deiner Wahl.</p>
          <Formel anzeige tex={t`\begin{aligned}3x+2y&=13\\5x-2y&=11\end{aligned}`} nach="." />
        </Kontrolle>
        <Kontrolle
          aussage="zwei-unbekannte"
          teil="b"
          nummer="K3b"
          titel="Zwei Unbekannte, Teil b"
          felder={[
            { id: 'x', name: 'Lösung x', beschriftung: <Formel tex="x" />, erwartet: K3.b.x },
            { id: 'y', name: 'Lösung y', beschriftung: <Formel tex="y" />, erwartet: K3.b.y },
          ]}
          hilfen={[
            <>Eine Gleichung ist schon nach <Formel tex="y" /> aufgelöst. Welches Verfahren passt dazu?</>,
            <>Setze <Formel tex={t`y=2x-5`} /> in die zweite Gleichung ein (Einsetzungsverfahren).</>,
          ]}
          loesung={[
            <>
              Einsetzen: <Formel tex={t`3x+(2x-5)=15`} nach="," /> also <Formel tex="5x=20" /> und <Formel tex="x=4" nach="." />
            </>,
            <>
              Dann ist <Formel tex={t`y=2\cdot 4-5=3`} nach="." /> Probe in der zweiten Gleichung: <Formel tex={t`12+3=15`} nach="." /> <Formel tex={t`L=\{(4;\,3)\}`} nach="." />
            </>,
          ]}
        >
          <p>Löse das Gleichungssystem mit einem Verfahren deiner Wahl.</p>
          <Formel anzeige tex={t`\begin{aligned}y&=2x-5\\3x+y&=15\end{aligned}`} nach="." />
        </Kontrolle>
      </Punkt>
    </Abschnitt>
  );
}
