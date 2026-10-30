import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Punkt } from './Punkt';
import { K11, K5, K6 } from './werte';

/** Bereich Lösbarkeit und Lösungsmenge: Aussagen 5, 6 und 11. */
export function Loesbarkeit() {
  return (
    <Abschnitt id="loesbarkeit" titel="Lösbarkeit und Lösungsmenge">
      <p>Hier geht es darum, an der Stufenform zu erkennen, wie viele Lösungen ein System hat, die Lösungen mit Parametern anzugeben und Systeme mit einem Parameter zu untersuchen.</p>
      <Eingabehinweis />

      <Punkt id="dreiecksform">
        <Kontrolle
          aussage="dreiecksform"
          nummer="K5"
          titel="Lösbarkeit an der Stufenform"
          felder={[
            { id: 'a', name: 'Wert von a, für den das System nicht eindeutig lösbar ist', beschriftung: <>Wert von <Formel tex="a" /></>, erwartet: K5.a },
            { id: 'b', name: 'Wert von b, für den das System dann mehrdeutig lösbar ist', beschriftung: <>Wert von <Formel tex="b" /></>, erwartet: K5.b },
          ]}
          hilfen={[
            <>Sieh dir die letzte Zeile an. Sie hat die Form <Formel tex={t`(\dots)\cdot x_3=\dots`} nach="." /> Wann gibt es genau eine Lösung für <Formel tex="x_3" nach="?" /></>,
            <>Der Faktor vor <Formel tex="x_3" /> ist <Formel tex="2a-6" nach="." /> Für welchen Wert von <Formel tex="a" /> ist er 0? Dann entscheidet die rechte Seite <Formel tex="b+1" nach="." /></>,
          ]}
          loesung={[
            <>
              Die letzte Zeile lautet <Formel tex={t`(2a-6)\,x_3=b+1`} nach="." /> Für <Formel tex={t`a\neq 3`} /> ist der Faktor ungleich 0, <Formel tex="x_3" /> ist festgelegt und das System ist eindeutig lösbar, für jedes <Formel tex="b" nach="." />
            </>,
            <>
              Für <Formel tex="a=3" /> lautet die letzte Zeile <Formel tex={t`0=b+1`} nach="." /> Ist <Formel tex={t`b\neq -1`} nach="," /> ist das ein Widerspruch: nicht lösbar. Ist <Formel tex="b=-1" nach="," /> lautet sie <Formel tex="0=0" nach="," /> es bleiben zwei Pivots für drei Unbekannte: mehrdeutig lösbar.
            </>,
          ]}
        >
          <p>Gegeben ist die Matrix in Stufenform mit den Parametern <Formel tex="a" /> und <Formel tex="b" nach=":" /></p>
          <Formel anzeige tex={t`\left(\begin{array}{rrr|r}1&-2&1&4\\0&3&a&6\\0&0&2a-6&b+1\end{array}\right)`} nach="." />
          <p>
            Für genau einen Wert von <Formel tex="a" /> ist das System nicht eindeutig lösbar. Gib ihn an und gib an, welchen Wert <Formel tex="b" /> dann haben muss, damit das System mehrdeutig lösbar ist. Für jeden anderen Wert von <Formel tex="b" /> ist es dann nicht lösbar.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="loesungsmenge">
        <Kontrolle
          aussage="loesungsmenge"
          nummer="K6"
          titel="Lösungsmenge angeben"
          felder={[
            { id: 'a1', name: 'Zahl ohne t in x1', beschriftung: <><Formel tex="x_1" /> ohne <Formel tex="t" /></>, erwartet: K6.x1[0]! },
            { id: 'b1', name: 'Zahl vor t in x1', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="x_1" /></>, erwartet: K6.x1[1]! },
            { id: 'a2', name: 'Zahl ohne t in x2', beschriftung: <><Formel tex="x_2" /> ohne <Formel tex="t" /></>, erwartet: K6.x2[0]! },
            { id: 'b2', name: 'Zahl vor t in x2', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="x_2" /></>, erwartet: K6.x2[1]! },
          ]}
          hilfen={[
            <>Zwei Gleichungen für drei Unbekannte: Eine Unbekannte bleibt frei und wird zum Parameter (Modul <Modulverweis modul="loesbarkeit-lgs">Lösbarkeit linearer Gleichungssysteme</Modulverweis>).</>,
            <>Setze <Formel tex="x_3=t" /> und löse von unten nach oben: erst <Formel tex="x_2" nach="," /> dann <Formel tex="x_1" nach="." /></>,
          ]}
          loesung={[
            <>
              Mit <Formel tex="x_3=t" /> folgt aus der zweiten Gleichung <Formel tex={t`x_2=5-3t`} nach="." />
            </>,
            <>
              Aus der ersten Gleichung folgt <Formel tex={t`x_1=4-2(5-3t)+t=-6+7t`} nach="." />
              <Umbruchformel
                tex={t`L=\{(-6+7t;\,5-3t;\,t)\mid t\in\mathbb{R}\}`}
                schmal={t`\begin{aligned}&L=\{(-6+7t;\\&\quad 5-3t;\\&\quad t)\\&\mid t\in\mathbb{R}\}\end{aligned}`}
              />
              In Vektorschreibweise:
              <Formel anzeige tex={t`\vec{x}=\begin{pmatrix}-6\\5\\0\end{pmatrix}+t\begin{pmatrix}7\\-3\\1\end{pmatrix}`} nach="." />
              Probe mit <Formel tex="t=1" nach=":" /> <Formel tex={t`(1;\,2;\,1)`} nach="," /> <Formel tex={t`1+4-1=4`} /> und <Formel tex={t`2+3=5`} nach="." />
            </>,
          ]}
        >
          <p>
            Bestimme die Lösungsmenge. Setze <Formel tex="x_3=t" /> und gib <Formel tex={t`x_1=a+b\cdot t`} /> und <Formel tex={t`x_2=c+d\cdot t`} /> an.
          </p>
          <Formel anzeige tex={t`\begin{aligned}x_1+2x_2-x_3&=4\\x_2+3x_3&=5\end{aligned}`} nach="." />
        </Kontrolle>
      </Punkt>

      <Punkt id="parameter">
        <Kontrolle
          aussage="parameter"
          nummer="K11"
          titel="Ein Parameter im System"
          felder={[
            { id: 'p', name: 'Wert von p, für den es keine Lösung gibt', beschriftung: <>Keine Lösung für <Formel tex="p" /></>, erwartet: K11.keine },
            { id: 'x', name: 'Lösung x für p gleich 1', beschriftung: <><Formel tex="x" /> für <Formel tex="p=1" /></>, erwartet: K11.p1[0]! },
            { id: 'y', name: 'Lösung y für p gleich 1', beschriftung: <><Formel tex="y" /> für <Formel tex="p=1" /></>, erwartet: K11.p1[1]! },
            { id: 'z', name: 'Lösung z für p gleich 1', beschriftung: <><Formel tex="z" /> für <Formel tex="p=1" /></>, erwartet: K11.p1[2]! },
          ]}
          hilfen={[
            <>Bringe das System mit dem Gauß-Algorithmus in Stufenform. Der Parameter steht nur in der dritten Gleichung.</>,
            <>Nach <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} nach="," /> <Formel tex={t`Z_3\to Z_3-3\cdot Z_1`} /> und <Formel tex={t`Z_3\to Z_3-Z_2`} /> lautet die letzte Zeile <Formel tex={t`p\,z=2`} nach="." /> Für welchen Wert von <Formel tex="p" /> ist das ein Widerspruch?</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} /> ergibt <Formel tex={t`-3y-3z=-6`} nach="." /> <Formel tex={t`Z_3\to Z_3-3\cdot Z_1`} /> ergibt <Formel tex={t`-3y+(p-3)z=-4`} nach="." /> Subtrahiert man die zweite von der dritten, bleibt <Formel anzeige tex={t`p\,z=2`} nach="." />
            </>,
            <>
              Für <Formel tex="p=0" /> lautet diese Zeile <Formel tex="0=2" nach="." /> Das ist ein Widerspruch: keine Lösung. Für jeden anderen Wert ist <Formel tex={t`z=\frac{2}{p}`} /> und das System eindeutig lösbar. Unendlich viele Lösungen gibt es für keinen Wert von <Formel tex="p" nach="." />
            </>,
            <>
              Für <Formel tex="p=1" /> ist <Formel tex="z=2" nach="." /> Aus <Formel tex={t`-3y-6=-6`} /> folgt <Formel tex="y=0" nach="," /> aus der ersten Gleichung <Formel tex={t`x+0+2=4`} /> und damit <Formel tex="x=2" nach="." /> Probe in der dritten Gleichung: <Formel tex={t`6+0+2=8`} nach="." /> <Formel tex={t`L=\{(2;\,0;\,2)\}`} nach="." />
            </>,
          ]}
        >
          <p>Gegeben ist für jede reelle Zahl <Formel tex="p" /> das Gleichungssystem</p>
          <Formel anzeige tex={t`\begin{aligned}x+2y+z&=4\\2x+y-z&=2\\3x+3y+p\,z&=8\end{aligned}`} nach="." />
          <p>
            Für genau einen Wert von <Formel tex="p" /> hat das System keine Lösung. Gib ihn an und bestimme die Lösung für <Formel tex="p=1" nach="." />
          </p>
        </Kontrolle>
      </Punkt>
    </Abschnitt>
  );
}
