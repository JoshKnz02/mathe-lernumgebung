import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_A1, BILD_A2, BILD_A6, BILD_A7, BILD_V4B } from './Bilder';
import { AUFGABE1, AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE6, AUFGABE7 } from './daten';

const TOL = 0.01;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>5,09</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{64}{3}`} nach=")" /> ein, ohne Einheit. Bei den Aufgaben mit Taschenrechner genügt die Rundung auf zwei Nachkommastellen. Der Taschenrechner steht auf Bogenmaß.
    </Hinweis>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <Eingabehinweis />

      <Aufgabe
        nummer={1}
        titel="Mittelwert und Stellen"
        felder={[
          { id: 'm', name: 'Mittelwert von f auf dem Intervall von 1 bis 4', beschriftung: <>Mittelwert <Formel tex="m" /></>, erwartet: AUFGABE1.mittelwert },
          { id: 'x1', name: 'kleinere Stelle, an der f den Mittelwert annimmt', beschriftung: <>kleinere Stelle</>, erwartet: AUFGABE1.x1 },
          { id: 'x2', name: 'größere Stelle, an der f den Mittelwert annimmt', beschriftung: <>größere Stelle</>, erwartet: AUFGABE1.x2 },
        ]}
        hilfen={[
          <>Der Mittelwert ist das Integral geteilt durch die Länge des Intervalls. Bilde zuerst eine Stammfunktion, wie im Beispiel im Abschnitt Erklären.</>,
          <>Die Stellen mit <Formel tex={t`f(x)=m`} /> findest du, indem du die Gleichung <Formel tex={t`x^2-4x+5=m`} /> löst. Nur Stellen im Intervall zählen.</>,
        ]}
        loesung={[
          <>
            Eine Stammfunktion ist <Formel tex={t`F(x)=\frac{1}{3}x^3-2x^2+5x`} nach="." /> Es ist <Formel tex={t`F(4)=\frac{64}{3}-32+20=\frac{28}{3}`} /> und <Formel tex={t`F(1)=\frac{1}{3}-2+5=\frac{10}{3}`} nach="." />
            <Formel anzeige tex={t`\int_1^4 f(x)\,\mathrm{d}x`} />
            <Formel anzeige tex={t`{}=\frac{28}{3}-\frac{10}{3}`} />
            <Formel anzeige tex={t`{}=6`} nach="." />
          </>,
          <>
            Die Länge des Intervalls ist <Formel tex="4-1=3" nach="," /> also <Formel tex={t`m=\frac{6}{3}=2`} nach="." />
          </>,
          <>
            <Formel tex={t`x^2-4x+5=2`} /> führt auf <Formel tex={t`x^2-4x+3=0`} /> und damit auf <Formel tex={t`(x-1)(x-3)=0`} nach="." /> Beide Lösungen <Formel tex="x=1" /> und <Formel tex="x=3" /> liegen im Intervall <Formel tex="[1;\,4]" nach="." />
            <FlaechenFigur daten={BILD_A1} unter={<>Fläche unter <Formel tex="K_f" /> und Rechteck mit der Höhe 2. Das Schaubild trifft die Höhe 2 bei <Formel tex="x=1" /> und <Formel tex="x=3" nach="." /></>} />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={t`f(x)=x^2-4x+5`} nach="." /> Bestimme den Mittelwert <Formel tex="m" /> von <Formel tex="f" /> auf <Formel tex="[1;\,4]" /> und die beiden Stellen in diesem Intervall, an denen <Formel tex="f" /> den Wert <Formel tex="m" /> annimmt.
        </p>
      </Aufgabe>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A1} unter={<>Das Schaubild <Formel tex="K_f" /> mit der Fläche und dem Rechteck der Höhe <Formel tex="m" nach="." /></>} />
      </Kontrollschaubild>

      <Aufgabe
        nummer={2}
        titel="Mittlere Temperatur"
        felder={[
          { id: 'm', name: 'mittlere Temperatur in Grad Celsius', beschriftung: <>mittlere Temperatur in °C</>, erwartet: AUFGABE2.mittelwert },
          { id: 't1', name: 'erster Zeitpunkt mit der mittleren Temperatur, in Stunden auf zwei Nachkommastellen', beschriftung: <>erster Zeitpunkt in h</>, erwartet: AUFGABE2.t1, toleranz: TOL },
          { id: 't2', name: 'zweiter Zeitpunkt mit der mittleren Temperatur, in Stunden auf zwei Nachkommastellen', beschriftung: <>zweiter Zeitpunkt in h</>, erwartet: AUFGABE2.t2, toleranz: TOL },
        ]}
        hilfen={[
          <>Die mittlere Temperatur ist der Mittelwert von <Formel tex="T" /> auf dem Intervall <Formel tex="[0;\,12]" nach="." /> Gib sie in Grad Celsius an.</>,
          <>Für die Zeitpunkte löst du <Formel tex="T(t)=m" nach="." /> Bringe alles auf eine Seite, teile durch den Faktor vor <Formel tex={t`t^2`} /> und verwende die Lösungsformel.</>,
        ]}
        loesung={[
          <>
            Eine Stammfunktion von <Formel tex={t`T`} /> ist <Formel tex={t`F(t)=-\frac{1}{12}t^3+\frac{3}{2}t^2+8t`} nach="." /> Es ist <Formel tex="F(0)=0" /> und <Formel tex={t`F(12)=-144+216+96=168`} nach="." />
          </>,
          <>
            <Formel anzeige tex={t`m=\frac{168}{12}`} />
            <Formel anzeige tex={t`{}=14`} nach="." />
            Im Mittel waren es 14 °C.
          </>,
          <>
            <Formel tex={t`-\frac{1}{4}t^2+3t+8=14`} /> führt auf <Formel tex={t`t^2-12t+24=0`} nach="." /> Mit der Lösungsformel ist <Formel tex={t`t=6\pm\sqrt{12}`} nach="," /> also <Formel tex={t`t\approx 2{,}54`} /> und <Formel tex={t`t\approx 9{,}46`} nach="." />
            <FlaechenFigur daten={BILD_A2} unter={<>Die Temperatur (orange) und das Rechteck in Höhe des Mittelwerts 14 °C (gestrichelt). Beide Zeitpunkte liegen im Intervall.</>} />
          </>,
        ]}
      >
        <p>
          In einem Gewächshaus wird die Temperatur in Grad Celsius durch <Formel tex={t`T(t)=-\frac{1}{4}t^2+3t+8`} /> beschrieben, <Formel tex="t" /> ist die Zeit in Stunden mit <Formel tex={t`0\le t\le 12`} nach="." /> Bestimme die mittlere Temperatur in diesem Zeitraum und die beiden Zeitpunkte, zu denen genau die mittlere Temperatur herrscht.
        </p>
      </Aufgabe>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A2} unter={<>Die Temperatur über der Zeit und das Rechteck der Höhe <Formel tex="m" nach="." /></>} />
      </Kontrollschaubild>

      <Aufgabe
        nummer={3}
        titel="Gesuchte Grenze"
        felder={[{ id: 'b', name: 'obere Grenze b größer als 0', beschriftung: <><Formel tex="b" /></>, erwartet: AUFGABE3.b }]}
        hilfen={[
          <>Schreibe den Mittelwert von <Formel tex="f" /> auf <Formel tex="[0;\,b]" /> mit der unbekannten Grenze <Formel tex="b" /> auf und setze ihn gleich 7.</>,
          <>Das Integral von 0 bis <Formel tex="b" /> ist <Formel tex={t`b^2+b`} nach="." /> Teile durch die Länge <Formel tex="b" nach="." /></>,
        ]}
        loesung={[
          <>
            Eine Stammfunktion ist <Formel tex={t`F(x)=x^2+x`} nach="." /> Das Integral von 0 bis <Formel tex="b" /> ist <Formel tex={t`b^2+b`} nach="." />
          </>,
          <>
            <Formel anzeige tex={t`m=\frac{b^2+b}{b}`} />
            <Formel anzeige tex={t`{}=b+1`} nach="." />
            Aus <Formel tex={t`b+1=7`} /> folgt <Formel tex="b=6" nach="." /> Probe: <Formel tex={t`\int_0^6(2x+1)\,\mathrm{d}x=42`} nach="," /> und <Formel tex={t`\frac{42}{6}=7`} nach="." />
          </>,
        ]}
      >
        <p>
          Für welche obere Grenze <Formel tex="b>0" /> hat <Formel tex={t`f(x)=2x+1`} /> auf <Formel tex="[0;\,b]" /> den Mittelwert 7?
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={4}
        titel="Mittelwert des Sinus"
        felder={[
          { id: 'm1', name: 'Mittelwert auf dem Intervall von 0 bis Pi, auf zwei Nachkommastellen', beschriftung: <>auf <Formel tex={t`[0;\,\pi]`} /></>, erwartet: AUFGABE4.m1, toleranz: TOL },
          { id: 'm2', name: 'Mittelwert auf dem Intervall von 0 bis 2 Pi', beschriftung: <>auf <Formel tex={t`[0;\,2\pi]`} /></>, erwartet: AUFGABE4.m2 },
        ]}
        hilfen={[
          <>Eine Stammfunktion von <Formel tex={t`2\sin x`} /> ist <Formel tex={t`-2\cos x`} nach="." /> Teile das Integral durch die Länge des Intervalls.</>,
          <>Beim zweiten Intervall hilft das Schaubild: Die Flächen oberhalb und unterhalb der x-Achse sind gleich groß.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\int_0^{\pi}2\sin x\,\mathrm{d}x=-2\cos\pi+2\cos 0=4`} nach="." /> Die Länge ist <Formel tex="\pi" nach="," /> also <Formel tex={t`m=\frac{4}{\pi}\approx 1{,}27`} nach="." />
          </>,
          <>
            <Formel tex={t`\int_0^{2\pi}2\sin x\,\mathrm{d}x=-2\cos 2\pi+2\cos 0=0`} nach="," /> also <Formel tex="m=0" nach="." /> Die Fläche oberhalb (Inhalt 4) und die unterhalb (Inhalt 4) heben sich auf.
            <FlaechenFigur daten={BILD_V4B} unter={<>Bei <Formel tex={t`\sin x`} /> auf <Formel tex={t`[0;\,2\pi]`} /> heben sich die Flächen auf. Für <Formel tex={t`2\sin x`} /> gilt dasselbe mit doppelt so hohen Werten.</>} />
          </>,
        ]}
      >
        <p>
          Bestimme den Mittelwert von <Formel tex={t`f(x)=2\sin x`} /> auf <Formel tex={t`[0;\,\pi]`} /> und auf <Formel tex={t`[0;\,2\pi]`} nach="." /> Begründe das zweite Ergebnis am Schaubild.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="5"
        titel="Welche Aussage über den Mittelwert stimmt?"
        optionen={platziere(
          [
            opt('a', <>Der Mittelwert von <Formel tex="f" /> auf <Formel tex="[a;\,b]" /> ist immer <Formel tex={t`\frac{f(a)+f(b)}{2}`} nach="." /></>, false, <>Das gilt nur bei Geraden. Bei einer Parabel zum Beispiel weicht der Mittelwert der Funktion vom Mittelwert der Randwerte ab, weil das Schaubild gekrümmt ist und das Integral nicht nur von den Randwerten abhängt.</>),
            opt('b', <>Ist der Mittelwert 0, dann ist <Formel tex="f(x)=0" /> für alle <Formel tex="x" /> im Intervall.</>, false, <>Das stimmt nicht. Der Sinus hat über eine ganze Periode den Mittelwert 0, ohne dass er überall 0 wäre. Die Flächen oberhalb und unterhalb der x-Achse heben sich auf.</>),
            opt('c', <>Der Mittelwert ist die Höhe des Rechtecks über <Formel tex="[a;\,b]" nach="," /> das denselben orientierten Flächeninhalt hat wie die Fläche zwischen <Formel tex="K_f" /> und der x-Achse.</>, true, <>Richtig.</>),
            opt('d', <>Der Mittelwert ist immer der Flächeninhalt der Fläche zwischen <Formel tex="K_f" /> und der x-Achse geteilt durch <Formel tex="b-a" nach="." /></>, false, <>Der Flächeninhalt zählt alle Stücke positiv. Der Mittelwert dagegen rechnet mit dem Integral, in dem Stücke unterhalb der x-Achse negativ zählen. Liegt <Formel tex="K_f" /> unterhalb der x-Achse, ist der Mittelwert negativ, der Flächeninhalt nie.</>),
          ],
          2,
        )}
        erklaerung={
          <>
            <p>
              Aus <Formel tex={t`m=\frac{1}{b-a}\int_a^b f(x)\,\mathrm{d}x`} /> folgt <Formel tex={t`m\cdot(b-a)=\int_a^b f(x)\,\mathrm{d}x`} nach="." /> Links steht der Inhalt des Rechtecks mit der Höhe <Formel tex="m" nach="," /> rechts die Bilanz der Flächen unter <Formel tex="K_f" nach="." /> Beim Sinus über eine Periode heben sich die Flächen auf, der Mittelwert ist 0.
            </p>
            <FlaechenFigur daten={BILD_V4B} unter={<>Die Flächen oberhalb und unterhalb der x-Achse heben sich auf: Mittelwert 0, obwohl <Formel tex="f" /> nicht überall 0 ist.</>} />
          </>
        }
      >
        <p>Eine dieser Aussagen ist richtig. Welche?</p>
      </Auswahlfrage>

      <Aufgabe
        nummer={6}
        titel="Mittelwert der Ableitung"
        felder={[
          { id: 'rate', name: 'durchschnittliche Änderungsrate von f auf dem Intervall von 1 bis 4', beschriftung: <>durchschnittliche Änderungsrate von <Formel tex="f" /></>, erwartet: AUFGABE6.rate },
          { id: 'm', name: 'Mittelwert der Ableitung von f auf dem Intervall von 1 bis 4', beschriftung: <>Mittelwert von <Formel tex="f'" /></>, erwartet: AUFGABE6.mittelwert },
          { id: 'x', name: 'Stelle im Intervall, an der die Ableitung den Mittelwert annimmt, auf zwei Nachkommastellen', beschriftung: <>Stelle mit <Formel tex={t`f'(x)=m`} /></>, erwartet: AUFGABE6.stelle, toleranz: TOL },
        ]}
        hilfen={[
          <>Die durchschnittliche Änderungsrate ist <Formel tex={t`\frac{f(4)-f(1)}{4-1}`} nach="." /> Der Mittelwert von <Formel tex="f'" /> ist das Integral von <Formel tex="f'" /> geteilt durch die Länge des Intervalls.</>,
          <>Das Integral von <Formel tex="f'" /> kannst du mit der Stammfunktion <Formel tex="f" /> berechnen. Vergleiche danach beide Werte.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`f(4)=\frac{64}{3}-16=\frac{16}{3}`} /> und <Formel tex={t`f(1)=\frac{1}{3}-1=-\frac{2}{3}`} nach="." /> Die durchschnittliche Änderungsrate ist <Formel tex={t`\frac{\frac{16}{3}+\frac{2}{3}}{3}=\frac{6}{3}=2`} nach="." />
          </>,
          <>
            Es ist <Formel tex={t`f'(x)=x^2-2x`} nach="," /> und <Formel tex="f" /> ist eine Stammfunktion von <Formel tex="f'" nach="." /> Also <Formel tex={t`\int_1^4 f'(x)\,\mathrm{d}x=f(4)-f(1)=6`} nach="," /> und <Formel tex={t`m=\frac{6}{3}=2`} nach="." /> Beide Werte stimmen überein.
          </>,
          <>
            <Formel tex={t`x^2-2x=2`} /> führt auf <Formel tex={t`x^2-2x-2=0`} /> mit <Formel tex={t`x=1\pm\sqrt{3}`} nach="." /> Im Intervall liegt nur <Formel tex={t`x=1+\sqrt{3}\approx 2{,}73`} nach="." />
            <FlaechenFigur daten={BILD_A6} unter={<>Das Schaubild von <Formel tex="f'" /> (grün) und das Rechteck der Höhe 2 über <Formel tex="[1;\,4]" nach="." /></>} />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={t`f(x)=\frac{1}{3}x^3-x^2`} nach="." /> Bestimme die durchschnittliche Änderungsrate von <Formel tex="f" /> auf <Formel tex="[1;\,4]" /> und den Mittelwert von <Formel tex="f'" /> auf <Formel tex="[1;\,4]" nach="." /> Gib außerdem die Stelle im Intervall an, an der <Formel tex="f'" /> diesen Mittelwert annimmt.
        </p>
      </Aufgabe>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A6} unter={<>Das Schaubild von <Formel tex="f'" /> mit dem Rechteck der Höhe <Formel tex="m" nach="." /></>} />
      </Kontrollschaubild>

      <Aufgabe
        nummer={7}
        titel="Schwankende Rate bei verschieden langen Zeiträumen"
        felder={[
          { id: 'g', name: 'Gesamtmenge in Litern', beschriftung: <>Gesamtmenge in <Formel tex="\ell" /></>, erwartet: AUFGABE7.gesamt },
          { id: 'm', name: 'Mittelwert der Zuflussrate in Litern pro Stunde', beschriftung: <>Mittelwert in <Formel tex={t`\ell/\text{h}`} /></>, erwartet: AUFGABE7.mittelwert },
          { id: 's', name: 'Mittelwert der beiden Raten 10 und 4', beschriftung: <>Mittelwert von 10 und 4</>, erwartet: AUFGABE7.arithmetisch },
        ]}
        hilfen={[
          <>Die Gesamtmenge ist die Fläche unter dem Schaubild der Rate. Zerlege sie in zwei Rechtecke.</>,
          <>Der Mittelwert ist die Gesamtmenge geteilt durch die Dauer. Vergleiche ihn danach mit dem Mittelwert der beiden Zahlen 10 und 4, den du ohne Rücksicht auf die Dauer bildest.</>,
        ]}
        loesung={[
          <>
            Von 0 bis 2 Stunden: <Formel tex={t`2\cdot 10=20`} nach="." /> Von 2 bis 8 Stunden: <Formel tex={t`6\cdot 4=24`} nach="." /> Zusammen <Formel tex="44" /> Liter.
          </>,
          <>
            Die Dauer ist 8 Stunden: <Formel tex={t`m=\frac{44}{8}=5{,}5`} nach="." /> Der Mittelwert der beiden Raten wäre <Formel tex={t`\frac{10+4}{2}=7`} nach="." /> Das ist falsch, weil die Rate 10 nur 2 Stunden andauert und die Rate 4 sechs Stunden. Der Mittelwert der Funktion gewichtet nach der Dauer.
            <FlaechenFigur daten={BILD_A7} unter={<>Die Rate in Litern pro Stunde. Die gestrichelte Höhe 5,5 ist der Mittelwert, nicht 7.</>} />
          </>,
        ]}
      >
        <p>
          Ein Tank wird 2 Stunden lang mit der Rate 10 Liter pro Stunde und danach 6 Stunden lang mit der Rate 4 Liter pro Stunde gefüllt. Bestimme die Gesamtmenge, den Mittelwert der Zuflussrate über die 8 Stunden und zum Vergleich den Mittelwert der beiden Zahlen 10 und 4.
        </p>
      </Aufgabe>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A7} unter={<>Das Schaubild der Zuflussrate.</>} />
      </Kontrollschaubild>
    </Abschnitt>
  );
}
