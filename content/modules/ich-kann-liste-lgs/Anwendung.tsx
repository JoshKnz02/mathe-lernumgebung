import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Punkt } from './Punkt';
import { K10, K7, K8, K9, TOL } from './werte';

/** Bereich Anwendungen: Aussagen 7 bis 10 und „!“. */
export function Anwendung() {
  return (
    <Abschnitt id="anwendung" titel="Anwendungen">
      <p>Hier geht es um Aufgaben aus Sachzusammenhängen: Preise, Mischungen, chemische Reaktionen und die Bestimmung eines Funktionsterms.</p>
      <Eingabehinweis />

      <Punkt id="anwendung">
        <Kontrolle
          aussage="anwendung"
          nummer="K7"
          titel="Preise am Kiosk"
          felder={[
            { id: 'b', name: 'Preis einer Brezel in Euro', beschriftung: <>Brezel in €</>, erwartet: K7.preise[0]!, toleranz: TOL },
            { id: 'r', name: 'Preis eines Brötchens in Euro', beschriftung: <>Brötchen in €</>, erwartet: K7.preise[1]!, toleranz: TOL },
            { id: 'k', name: 'Preis eines Kuchenstücks in Euro', beschriftung: <>Kuchenstück in €</>, erwartet: K7.preise[2]!, toleranz: TOL },
          ]}
          hilfen={[
            <>Lege die Unbekannten fest: <Formel tex="b" /> ist der Preis einer Brezel, <Formel tex="r" /> der eines Brötchens und <Formel tex="k" /> der eines Kuchenstücks, alle in Euro. Jede Bestellung ergibt eine Gleichung.</>,
            <>Rechne in Cent, dann stehen nur ganze Zahlen im System. Löse mit dem <Modulverweis modul="gauss-algorithmus">Gauß-Algorithmus</Modulverweis>.</>,
          ]}
          loesung={[
            <>
              Festlegen der Variablen: <Formel tex="b" nach="," /> <Formel tex="r" /> und <Formel tex="k" /> sind die Preise in Cent. Die Bestellungen ergeben
              <Formel anzeige tex={t`\begin{aligned}2b+3r+k&=610\\b+4r+2k&=700\\3b+2r+2k&=780\end{aligned}`} nach="." />
            </>,
            <>
              Der Gauß-Algorithmus liefert <Formel tex="b=120" nach="," /> <Formel tex="r=80" /> und <Formel tex="k=130" nach="." /> Probe: <Formel tex={t`240+240+130=610`} nach="," /> <Formel tex={t`120+320+260=700`} /> und <Formel tex={t`360+160+260=780`} nach="." />
            </>,
            <>
              Antwort: Eine Brezel kostet 1,20 €, ein Brötchen 0,80 € und ein Kuchenstück 1,30 €.
            </>,
          ]}
        >
          <p>
            An einem Kiosk kosten 2 Brezeln, 3 Brötchen und 1 Kuchenstück zusammen 6,10 €, 1 Brezel, 4 Brötchen und 2 Kuchenstücke zusammen 7,00 € und 3 Brezeln, 2 Brötchen und 2 Kuchenstücke zusammen 7,80 €. Bestimme den Preis jeder Sorte.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="mischung">
        <Kontrolle
          aussage="mischung"
          nummer="K8"
          titel="Salzlösungen mischen"
          felder={[
            { id: 'a', name: 'Menge der Lösung A in Millilitern', beschriftung: <>Lösung A in ml</>, erwartet: K8.loesung[0]!, toleranz: TOL },
            { id: 'b', name: 'Menge der Lösung B in Millilitern', beschriftung: <>Lösung B in ml</>, erwartet: K8.loesung[1]!, toleranz: TOL },
            { id: 'c', name: 'Menge der Lösung C in Millilitern', beschriftung: <>Lösung C in ml</>, erwartet: K8.loesung[2]!, toleranz: TOL },
          ]}
          hilfen={[
            <>Drei Bedingungen ergeben drei Gleichungen: die Gesamtmenge, den Salzgehalt und den Zusammenhang zwischen <Formel tex="a" /> und <Formel tex="c" nach="." /></>,
            <>Die dritte Bedingung lautet <Formel tex={t`a=2c`} nach="." /> Setze sie in die beiden anderen Gleichungen ein, dann bleiben zwei Gleichungen für <Formel tex="b" /> und <Formel tex="c" nach="." /></>,
          ]}
          loesung={[
            <>
              Mit <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> in ml gilt
              <Umbruchformel
                tex={t`\begin{aligned}a+b+c&=100\\0{,}1a+0{,}3b+0{,}5c&=25\\a&=2c\end{aligned}`}
                schmal={t`\begin{aligned}a+b+c&=100\\0{,}1a+0{,}3b&\\{}+0{,}5c&=25\\a&=2c\end{aligned}`}
              />
            </>,
            <>
              Aus <Formel tex={t`a=2c`} /> folgt <Formel tex={t`b=100-3c`} nach="." /> Eingesetzt in die Salzgleichung: <Formel tex={t`0{,}2c+30-0{,}9c+0{,}5c=25`} nach="," /> also <Formel tex={t`30-0{,}2c=25`} /> und <Formel tex="c=25" nach="." /> Dann ist <Formel tex="a=50" /> und <Formel tex="b=25" nach="." />
            </>,
            <>
              Probe: <Formel tex={t`50+25+25=100`} /> und <Formel tex={t`5+7{,}5+12{,}5=25`} nach="." /> Es sind 50 ml der Lösung A, 25 ml der Lösung B und 25 ml der Lösung C.
            </>,
          ]}
        >
          <p>
            Ein Labor mischt aus drei Salzlösungen A, B und C genau 100 ml. Lösung A enthält 10 % Salz, Lösung B 30 % und Lösung C 50 %. Die Mischung soll 25 % Salz enthalten. Von Lösung A wird doppelt so viel genommen wie von Lösung C. Bestimme, wie viel ml von jeder Lösung gemischt werden.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="reaktionsgleichung">
        <Kontrolle
          aussage="reaktionsgleichung"
          nummer="K9"
          titel="Reaktionsgleichung"
          felder={[
            { id: 'x1', name: 'kleinste natürliche Zahl x1', beschriftung: <Formel tex="x_1" />, erwartet: K9.loesung[0]! },
            { id: 'x2', name: 'kleinste natürliche Zahl x2', beschriftung: <Formel tex="x_2" />, erwartet: K9.loesung[1]! },
            { id: 'x3', name: 'kleinste natürliche Zahl x3', beschriftung: <Formel tex="x_3" />, erwartet: K9.loesung[2]! },
            { id: 'x4', name: 'kleinste natürliche Zahl x4', beschriftung: <Formel tex="x_4" />, erwartet: K9.loesung[3]! },
          ]}
          hilfen={[
            <>Stelle für jedes Element eine Gleichung auf: Auf beiden Seiten muss gleich viele Atome stehen. Das gibt drei Gleichungen für vier Unbekannte.</>,
            <>Das System ist mehrdeutig lösbar (Modul <Modulverweis modul="loesbarkeit-lgs">Lösbarkeit linearer Gleichungssysteme</Modulverweis>). Setze <Formel tex="x_1=t" /> und drücke die anderen Unbekannten durch <Formel tex="t" /> aus. Wähle dann das kleinste <Formel tex="t" nach="," /> für das alle vier Zahlen natürlich sind.</>,
          ]}
          loesung={[
            <>
              Atome je Element: Kohlenstoff <Formel tex={t`2x_1=x_3`} nach="," /> Wasserstoff <Formel tex={t`6x_1=2x_4`} /> und Sauerstoff <Formel tex={t`x_1+2x_2=2x_3+x_4`} nach="." />
            </>,
            <>
              Mit <Formel tex="x_1=t" /> ist <Formel tex={t`x_3=2t`} /> und <Formel tex={t`x_4=3t`} nach="." /> Aus der Sauerstoffgleichung folgt <Formel tex={t`t+2x_2=4t+3t`} nach="," /> also <Formel tex={t`x_2=3t`} nach="." />
            </>,
            <>
              Die kleinste natürliche Lösung ist <Formel tex="t=1" nach=":" /> <Formel tex={t`(x_1;\,x_2;\,x_3;\,x_4)=(1;\,3;\,2;\,3)`} nach="." /> Die Reaktionsgleichung lautet <Formel tex={t`\mathrm{C_2H_6O}+3\,\mathrm{O_2}\to 2\,\mathrm{CO_2}+3\,\mathrm{H_2O}`} nach="." />
            </>,
          ]}
        >
          <p>
            Reaktionsgleichungen geben an, wie viele Moleküle der Ausgangsstoffe wie viele Moleküle der Endstoffe liefern. Ethanol verbrennt mit Sauerstoff zu Kohlenstoffdioxid und Wasser. Bestimme möglichst kleine natürliche Zahlen <Formel tex="x_1" nach="," /> <Formel tex="x_2" nach="," /> <Formel tex="x_3" /> und <Formel tex="x_4" nach="," /> für die Reaktion
          </p>
          <Umbruchformel
            tex={t`x_1\,\mathrm{C_2H_6O}+x_2\,\mathrm{O_2}\to x_3\,\mathrm{CO_2}+x_4\,\mathrm{H_2O}`}
            schmal={t`\begin{aligned}&x_1\,\mathrm{C_2H_6O}\\&{}+x_2\,\mathrm{O_2}\\&{}\to x_3\,\mathrm{CO_2}\\&{}+x_4\,\mathrm{H_2O}\end{aligned}`}
          />
        </Kontrolle>
      </Punkt>

      <Punkt id="funktionsterm">
        <Kontrolle
          aussage="funktionsterm"
          nummer="K10"
          titel="Funktionsterm bestimmen"
          felder={[
            { id: 'a', name: 'Koeffizient a', beschriftung: <Formel tex="a" />, erwartet: K10.a },
            { id: 'b', name: 'Koeffizient b', beschriftung: <Formel tex="b" />, erwartet: K10.b },
            { id: 'c', name: 'Koeffizient c', beschriftung: <Formel tex="c" />, erwartet: K10.c },
          ]}
          hilfen={[
            <>Wegen der Achsensymmetrie hat der Term nur gerade Hochzahlen: <Formel tex={t`f(x)=ax^4+bx^2+c`} nach="." /> Übersetze jede Angabe in eine Gleichung (Modul <Modulverweis modul="funktionsterme-aufstellen">Aufstellen von Funktionstermen</Modulverweis>).</>,
            <>Ein Punkt gibt <Formel tex="f(x)=y" nach="," /> ein Extrempunkt gibt <Formel tex="f'(x)=0" nach="." /> Die Ableitung ist <Formel tex={t`f'(x)=4ax^3+2bx`} nach="." /></>,
          ]}
          loesung={[
            <>
              Ansatz: <Formel tex={t`f(x)=ax^4+bx^2+c`} /> mit <Formel tex={t`f'(x)=4ax^3+2bx`} nach="." /> Die Bedingungen ergeben
              <Umbruchformel
                tex={t`\begin{aligned}f(0)=3:\quad c&=3\\f'(1)=0:\quad 4a+2b&=0\\f(2)=11:\quad 16a+4b+c&=11\end{aligned}`}
                schmal={t`\begin{aligned}&f(0)=3:\\&c=3\\&f'(1)=0:\\&4a+2b=0\\&f(2)=11:\\&16a+4b+c=11\end{aligned}`}
              />
            </>,
            <>
              Aus der zweiten Gleichung folgt <Formel tex={t`b=-2a`} nach="." /> Mit <Formel tex="c=3" /> in der dritten Gleichung: <Formel tex={t`16a-8a+3=11`} nach="," /> also <Formel tex="a=1" /> und <Formel tex="b=-2" nach="." />
            </>,
            <>
              Der Term ist <Formel tex={t`f(x)=x^4-2x^2+3`} nach="." /> Probe: <Formel tex={t`f(2)=16-8+3=11`} /> und <Formel tex={t`f'(1)=4-4=0`} nach="." />
            </>,
          ]}
        >
          <p>
            Das Schaubild einer ganzrationalen Funktion <Formel tex="f" /> vierten Grades ist symmetrisch zur y-Achse, geht durch <Formel tex={t`P(0\,|\,3)`} /> und <Formel tex={t`Q(2\,|\,11)`} /> und hat an der Stelle <Formel tex="x=1" /> einen Extrempunkt. Bestimme den Funktionsterm in der Form <Formel tex={t`f(x)=ax^4+bx^2+c`} nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="transfer" />
      <Hinweis titel="Zur letzten Aussage">
        Zur Aussage mit dem Ausrufezeichen gibt es keine Kontrollaufgabe. Aufgaben im Stil der Prüfung findest du im Modul <Modulverweis modul="uebungsaufgaben-lgs" abschnitt="ohne-hilfsmittel">Übungsaufgaben Lineare Gleichungssysteme im Abiturstil</Modulverweis>.
      </Hinweis>
    </Abschnitt>
  );
}
