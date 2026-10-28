import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import {
  BILD_A10_A, BILD_A10_TANGENTE, BILD_A11_90, BILD_A11_N, BILD_A11_WENDE, BILD_A12_K1, BILD_A12_K2, BILD_A12_K3, BILD_A12_PUNKTE, BILD_A12_SY, BILD_A12_WENDE, BILD_A7_C, BILD_A7_WENDE, BILD_A8_GRENZE, BILD_A8_RAMPE, BILD_A8_WENDE,
  BILD_A9_EXTREM, BILD_A9_F, BILD_A9_STEIGUNG, BILD_A9_WENDE,
} from './Bilder';
import { A10, A11, A12, A7, A8, A9 } from './daten';
import { BE, Teile } from './Teile';

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Du darfst den Taschenrechner benutzen, er steht auf Bogenmaß. Runde nur, wo die Aufgabe es verlangt, sonst auf zwei Nachkommastellen, und rechne mit ungerundeten Zwischenergebnissen. Gib Zahlen als Dezimalzahl mit Komma oder als Bruch ein, ohne Einheit. Die Felder prüfen nur Ergebnisse, Begründungen schreibst du in dein Heft.
    </Hinweis>
  );
}

/** Aufgabe 7: Wirkstoffkonzentration. */
function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Wirkstoff im Blut"
      felder={[
        { id: 'c2', name: 'Konzentration nach 2 Stunden', beschriftung: <><Formel tex="c(2)" /></>, erwartet: A7.c2, toleranz: 0.01 },
        { id: 'c10', name: 'Konzentration nach 10 Stunden', beschriftung: <><Formel tex="c(10)" /></>, erwartet: A7.c10, toleranz: 0.01 },
        { id: 'tmax', name: 'Zeitpunkt der höchsten Konzentration in Stunden', beschriftung: <>Zeitpunkt des Maximums</>, erwartet: A7.maxZeit },
        { id: 'cmax', name: 'höchste Konzentration', beschriftung: <>höchste Konzentration</>, erwartet: A7.maxWert, toleranz: 0.01 },
        { id: 'beginn', name: 'Beginn der Wirkung in Minuten', beschriftung: <>Beginn in Minuten</>, erwartet: A7.beginnMin },
        { id: 'ende', name: 'Ende der Wirkung in Minuten', beschriftung: <>Ende in Minuten</>, erwartet: A7.endeMin },
        { id: 'tw', name: 'Zeitpunkt der stärksten Abnahme in Stunden', beschriftung: <>Zeitpunkt der stärksten Abnahme</>, erwartet: A7.wendeZeit },
        { id: 'rate', name: 'momentane Änderungsrate zu diesem Zeitpunkt', beschriftung: <>Änderungsrate dort</>, erwartet: A7.wendeRate, toleranz: 0.01 },
        { id: 'mittel', name: 'mittlere Änderungsrate', beschriftung: <>mittlere Änderungsrate</>, erwartet: A7.mittel, toleranz: 0.01 },
      ]}
      hilfen={[
        <>Für a setzt du ein. Für b suchst du die Nullstelle der ersten Ableitung und prüfst, ob sie ein Hochpunkt ist (Modul <Modulverweis modul="kurvendiskussion">Kurvendiskussion</Modulverweis>).</>,
        <>Für c gibt es keine Lösung durch Umformen. Zeichne das Schaubild im Taschenrechner und bestimme die Schnittpunkte mit <Formel tex="y=8" nach="." /> Rechne die Stunden in Minuten um und runde so, dass die Konzentration in jeder genannten Minute mindestens 8 mg/l beträgt.</>,
        <>Für d: Die stärkste Abnahme ist der kleinste Wert von <Formel tex="c'" nach="." /> Das liegt an einer Stelle mit <Formel tex={t`c''(t)=0`} nach="." /> Vergleiche mit den Rändern. Für e brauchst du die Sekantensteigung zwischen zwei Zeitpunkten.</>,
      ]}
      loesung={[
        <>
          a: <Formel tex={t`c(2)=24\,e^{-0{,}8}\approx 10{,}78`} /> mg/l und <Formel tex={t`c(10)=120\,e^{-4}\approx 2{,}20`} /> mg/l.
        </>,
        <>
          b: Aus <Formel tex={t`c'(t)=12\,(1-0{,}4t)\,e^{-0{,}4t}=0`} /> folgt <Formel tex={t`1-0{,}4t=0`} nach="," /> also <Formel tex="t=2{,}5" nach="." /> Davor ist <Formel tex="c'>0" nach="," /> danach <Formel tex="c'<0" nach="." /> Es ist ein Hochpunkt, und wegen <Formel tex="c(0)=0" /> und <Formel tex={t`c(12)\approx 1{,}19`} /> der größte Wert. <Formel tex={t`c(2{,}5)=30\,e^{-1}\approx 11{,}04`} /> mg/l, nach 2,5 Stunden.
        </>,
        <>
          c: Die Gleichung <Formel tex={t`12t\,e^{-0{,}4t}=8`} /> löst du mit dem Taschenrechner: <Formel tex={t`t_1\approx 0{,}991`} /> und <Formel tex={t`t_2\approx 5{,}074`} nach="." /> In Minuten: <Formel tex={t`t_1\approx 59{,}46`} /> und <Formel tex={t`t_2\approx 304{,}44`} nach="." /> Die Wirkung beginnt aufgerundet nach 60 Minuten und endet abgerundet nach 304 Minuten.
          <Bild daten={BILD_A7_C} unter={<>Das Schaubild von <Formel tex="c" /> mit dem Hochpunkt <Formel tex="H" /> und den Schnittpunkten <Formel tex="P" /> und <Formel tex="Q" /> mit <Formel tex="y=8" nach="." /></>} />
        </>,
        <>
          d: Die stärkste Abnahme liegt dort, wo <Formel tex="c'" /> am kleinsten ist. Aus <Formel tex={t`c''(t)=12\,(0{,}16t-0{,}8)\,e^{-0{,}4t}=0`} /> folgt <Formel tex="t=5" nach="." /> Dort wechselt <Formel tex="c''" /> von minus nach plus, <Formel tex="c'" /> hat ein Minimum. Es ist <Formel tex={t`c'(5)=-12\,e^{-2}\approx -1{,}62`} nach="," /> am Rand ist <Formel tex="c'(0)=12" /> und <Formel tex={t`c'(12)\approx -0{,}38`} nach="." /> Nach 5 Stunden nimmt die Konzentration mit etwa 1,62 mg/l pro Stunde am stärksten ab.
          <Bild daten={BILD_A7_WENDE} unter={<>Im Wendepunkt <Formel tex="W" /> ist die Tangente (blau gestrichelt) am steilsten fallend.</>} />
        </>,
        <>
          e: <Formel anzeige tex={t`\frac{c(10)-c(2{,}5)}{10-2{,}5}=\frac{2{,}198-11{,}036}{7{,}5}\approx -1{,}18`} />
          Im Mittel nimmt die Konzentration zwischen dem Maximum und der zehnten Stunde um etwa 1,18 mg/l pro Stunde ab.
        </>,
      ]}
    >
      <p>
        Die Wirkstoffkonzentration im Blut wird nach der Einnahme eines Medikaments durch <Formel tex={t`c(t)=12t\cdot e^{-0{,}4t}`} /> mit <Formel tex={t`0\le t\le 12`} /> beschrieben. Dabei ist <Formel tex="t" /> die Zeit in Stunden seit der Einnahme und <Formel tex="c(t)" /> die Konzentration in Milligramm pro Liter. Für die Ableitungsfunktionen gilt <Formel tex={t`c'(t)=12\,(1-0{,}4t)\,e^{-0{,}4t}`} /> und <Formel tex={t`c''(t)=12\,(0{,}16t-0{,}8)\,e^{-0{,}4t}`} nach="." />
      </p>
      <Teile>
        <li>
          Berechnen Sie die Konzentration 2 Stunden und 10 Stunden nach der Einnahme. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie den Zeitpunkt der höchsten Konzentration und diese Konzentration. <BE n={4} />
        </li>
        <li>
          Das Medikament wirkt, solange die Konzentration mindestens 8 mg/l beträgt. Bestimmen Sie Beginn und Ende der Wirkung auf die Minute genau (Beginn aufrunden, Ende abrunden). <BE n={4} />
        </li>
        <li>
          Bestimmen Sie den Zeitpunkt, zu dem die Konzentration am stärksten abnimmt, und die momentane Änderungsrate zu diesem Zeitpunkt. <BE n={5} />
        </li>
        <li>
          Berechnen Sie die mittlere Änderungsrate der Konzentration vom Zeitpunkt der höchsten Konzentration bis 10 Stunden nach der Einnahme. <BE n={3} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A7_C} unter={<>Das Schaubild von <Formel tex="c" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 8: Rampe, Neigungswinkel. */
function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Eine Rampe im Skatepark"
      felder={[
        { id: 'dh', name: 'Höhenunterschied in Metern', beschriftung: <>Höhenunterschied</>, erwartet: A8.hoehe },
        { id: 'winkel', name: 'Winkel der Verbindungsgeraden in Grad, auf eine Nachkommastelle', beschriftung: <>Winkel in Grad</>, erwartet: A8.winkelMittel, toleranz: 0.1 },
        { id: 'xw', name: 'Stelle der größten Steilheit', beschriftung: <>steilste Stelle <Formel tex="x" /></>, erwartet: A8.wende, toleranz: 0.01 },
        { id: 'wmax', name: 'größter Neigungswinkel in Grad, auf eine Nachkommastelle', beschriftung: <>größter Winkel in Grad</>, erwartet: A8.winkelMax, toleranz: 0.1 },
        { id: 'von', name: 'Beginn des Bereichs über 70 Grad', beschriftung: <>von <Formel tex="x" /></>, erwartet: A8.von, toleranz: 0.01 },
        { id: 'bis', name: 'Ende des Bereichs über 70 Grad', beschriftung: <>bis <Formel tex="x" /></>, erwartet: A8.bis, toleranz: 0.01 },
      ]}
      hilfen={[
        <>Der Neigungswinkel <Formel tex={t`\alpha`} /> einer Geraden mit der Steigung <Formel tex="m" /> ist <Formel tex={t`\alpha=\tan^{-1}|m|`} /> (Modul <Modulverweis modul="tangenten">Tangenten</Modulverweis>). Für Kriterium I brauchst du die Steigung der Verbindungsgeraden von <Formel tex="A" /> nach <Formel tex="E" nach="." /></>,
        <>Für Kriterium II suchst du den größten Wert von <Formel tex="|f'|" /> im Bereich <Formel tex={t`0\le x\le 2`} nach="." /> Der kleinste Wert von <Formel tex="f'" /> liegt an einer Stelle mit <Formel tex="f''(x)=0" nach="." /> Vergleiche mit den Rändern.</>,
        <>Für d: Der Winkel ist größer als 70°, wenn <Formel tex={t`|f'(x)|>\tan 70^\circ`} /> gilt. Da <Formel tex="f'" /> hier negativ ist, löst du <Formel tex={t`f'(x)=-\tan 70^\circ`} /> mit dem Taschenrechner.</>,
      ]}
      loesung={[
        <>
          a: <Formel tex={t`f(0)=\tfrac14\cdot 16=4`} /> und <Formel tex={t`f(2)=0`} nach="." /> Der Höhenunterschied beträgt 4 m.
        </>,
        <>
          b: Die Verbindungsgerade von <Formel tex={t`A(0\,|\,4)`} /> nach <Formel tex={t`E(2\,|\,0)`} /> hat die Steigung <Formel tex={t`m=\frac{0-4}{2-0}=-2`} nach="." /> Der Winkel ist <Formel tex={t`\alpha=\tan^{-1}(2)\approx 63{,}4^\circ`} nach="." /> Das ist nicht größer als 65°, Kriterium I ist erfüllt.
          <Bild daten={BILD_A8_RAMPE} unter={<>Der Querschnitt der Rampe vom Anfang <Formel tex="A" /> bis zum Ende <Formel tex="E" /> mit der Verbindungsstrecke (schwarz gestrichelt).</>} />
        </>,
        <>
          c: Mit <Formel tex={t`f'(x)=x^3-4x`} /> und <Formel tex={t`f''(x)=3x^2-4`} /> folgt aus <Formel tex={t`f''(x)=0`} /> die Stelle <Formel tex={t`x=\tfrac{2}{\sqrt3}\approx 1{,}155`} nach="." /> Dort wechselt <Formel tex="f''" /> von minus nach plus, <Formel tex="f'" /> hat ein Minimum. Es ist <Formel tex={t`f'(1{,}155)\approx -3{,}079`} nach="." /> Am Rand ist <Formel tex="f'(0)=0" /> und <Formel tex="f'(2)=0" nach="." /> Die Rampe ist bei <Formel tex={t`x\approx 1{,}155`} /> am steilsten, mit dem Winkel <Formel tex={t`\tan^{-1}(3{,}079)\approx 72{,}0^\circ`} nach="." /> Das ist größer als 70°, Kriterium II ist nicht erfüllt.
          <Bild daten={BILD_A8_WENDE} unter={<>Im Wendepunkt <Formel tex="W" /> hat die Tangente (blau gestrichelt) die Steigung <Formel tex={t`-3{,}08`} nach="." /></>} />
        </>,
        <>
          d: Gesucht sind die Stellen mit <Formel tex={t`f'(x)<-\tan 70^\circ\approx -2{,}747`} nach="." /> Die Gleichung <Formel tex={t`x^3-4x=-2{,}747`} /> hat im Bereich von 0 bis 2 die Lösungen <Formel tex={t`x\approx 0{,}83`} /> und <Formel tex={t`x\approx 1{,}45`} nach="." /> Zwischen diesen Stellen ist die Rampe steiler als 70°, die Stellen selbst gehören nicht dazu.
          <Bild daten={BILD_A8_GRENZE} unter={<>In <Formel tex="P" /> und <Formel tex="Q" /> beträgt der Winkel genau 70° (die beiden Tangenten sind parallel), dazwischen ist die Rampe steiler.</>} />
        </>,
      ]}
    >
      <p>
        In einem Skatepark wird eine Rampe gebaut. Ihr Längsschnitt wird für <Formel tex={t`0\le x\le 2`} /> durch das Schaubild der Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=\tfrac14\,(x^2-4)^2`} /> beschrieben. Eine Längeneinheit entspricht einem Meter, die x-Achse ist der horizontale Boden. Anfang der Rampe ist <Formel tex={t`A(0\,|\,f(0))`} nach="," /> ihr Ende <Formel tex={t`E(2\,|\,f(2))`} nach="." /> Für die Ableitungsfunktionen gilt <Formel tex={t`f'(x)=x^3-4x`} /> und <Formel tex={t`f''(x)=3x^2-4`} nach="." /> Der Neigungswinkel an einer Stelle ist der Winkel zwischen der Tangente und der Horizontalen.
      </p>
      <Teile>
        <li>
          Berechnen Sie den Höhenunterschied zwischen dem Anfang und dem Ende der Rampe. <BE n={2} />
        </li>
      </Teile>
      <p>Für Rampen gelten folgende Sicherheitskriterien:</p>
      <p>
        <strong>I</strong> Der durch Anfang und Ende festgelegte Winkel gegenüber der Horizontalen darf 65° nicht überschreiten.
        <br />
        <strong>II</strong> Neigungswinkel über 70° sind an keinem Punkt der Rampe zulässig.
      </p>
      <Teile ab={2}>
        <li>
          Prüfen Sie rechnerisch, ob die Rampe das Kriterium I erfüllt. Gib den Winkel an. <BE n={3} />
        </li>
        <li>
          Untersuchen Sie rechnerisch, ob die Rampe das Kriterium II erfüllt. Gib die Stelle der größten Steilheit und den dortigen Winkel an. <BE n={5} />
        </li>
        <li>
          Bestimmen Sie den Bereich der Rampe, in dem der Neigungswinkel größer als 70° ist. <BE n={4} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A8_RAMPE} unter={<>Der Querschnitt der Rampe.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 9: kubische Funktion aus Nullstellen. */
function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Eine Funktion dritten Grades"
      felder={[
        { id: 'a3', name: 'Koeffizient von x hoch drei', beschriftung: <>Koeffizient von <Formel tex="x^3" /></>, erwartet: A9.koeff[0]! },
        { id: 'a2', name: 'Koeffizient von x Quadrat', beschriftung: <>Koeffizient von <Formel tex="x^2" /></>, erwartet: A9.koeff[1]! },
        { id: 'a1', name: 'Koeffizient von x', beschriftung: <>Koeffizient von <Formel tex="x" /></>, erwartet: A9.koeff[2]! },
        { id: 'a0', name: 'Konstante', beschriftung: <>Konstante</>, erwartet: A9.koeff[3]! },
        { id: 'xh', name: 'x-Koordinate des Hochpunkts', beschriftung: <>Hochpunkt: <Formel tex="x" /></>, erwartet: A9.hoch[0], toleranz: 0.01 },
        { id: 'yh', name: 'y-Koordinate des Hochpunkts', beschriftung: <>Hochpunkt: <Formel tex="y" /></>, erwartet: A9.hoch[1], toleranz: 0.01 },
        { id: 'xt', name: 'x-Koordinate des Tiefpunkts', beschriftung: <>Tiefpunkt: <Formel tex="x" /></>, erwartet: A9.tief[0], toleranz: 0.01 },
        { id: 'yt', name: 'y-Koordinate des Tiefpunkts', beschriftung: <>Tiefpunkt: <Formel tex="y" /></>, erwartet: A9.tief[1], toleranz: 0.01 },
        { id: 'xw', name: 'x-Koordinate des Wendepunkts', beschriftung: <>Wendepunkt: <Formel tex="x" /></>, erwartet: A9.wende[0], toleranz: 0.01 },
        { id: 'mw', name: 'Steigung der Wendetangente', beschriftung: <>Steigung der Wendetangente</>, erwartet: A9.wendeSteigung, toleranz: 0.01 },
        { id: 'x1', name: 'kleinere Stelle mit Steigung 3', beschriftung: <>kleinere Stelle <Formel tex="x" /></>, erwartet: A9.steigung3[0], toleranz: 0.01 },
        { id: 'x2', name: 'größere Stelle mit Steigung 3', beschriftung: <>größere Stelle <Formel tex="x" /></>, erwartet: A9.steigung3[1], toleranz: 0.01 },
      ]}
      hilfen={[
        <>Für a: Mit den drei Nullstellen schreibst du die Produktform auf. Der Punkt <Formel tex={t`(0\,|\,3)`} /> legt den Faktor fest (Modul <Modulverweis modul="funktionsterme-aufstellen">Aufstellen von Funktionstermen</Modulverweis>). Danach multiplizierst du aus.</>,
        <>Für b: Löse <Formel tex="f'(x)=0" /> mit der Lösungsformel. Ein Hochpunkt hat links einen steigenden, rechts einen fallenden Verlauf. Für c: Eine Wendestelle hat <Formel tex="f''(x)=0" nach="." /></>,
        <>Für d: Löse <Formel tex="f'(x)=3" /> und beachte, dass es zwei Lösungen gibt.</>,
      ]}
      loesung={[
        <>
          a: Die Nullstellen <Formel tex="-1" nach="," /> <Formel tex="2" /> und <Formel tex="6" /> sind einfach. Ansatz: <Formel tex={t`f(x)=a\,(x+1)(x-2)(x-6)`} nach="." /> Aus <Formel tex="f(0)=3" /> folgt <Formel tex={t`a\cdot 1\cdot(-2)\cdot(-6)=12a=3`} nach="," /> also <Formel tex={t`a=\tfrac14`} nach="." /> Ausmultipliziert: <Formel tex={t`(x+1)(x-2)(x-6)=x^3-7x^2+4x+12`} nach="," /> also
          <Formel anzeige tex={t`f(x)=\tfrac14x^3-\tfrac74x^2+x+3`} />
          Kontrolle: <Formel tex={t`f(3)=\tfrac14\cdot 4\cdot 1\cdot(-3)=-3`} nach="." />
          <Bild daten={BILD_A9_F} unter={<>Das Schaubild mit den Nullstellen <Formel tex="N" /> und dem Schnittpunkt <Formel tex="S_y" /> mit der y-Achse.</>} />
        </>,
        <>
          b: <Formel tex={t`f'(x)=\tfrac14\,(3x^2-14x+4)=0`} /> liefert <Formel tex={t`x=\frac{14\pm\sqrt{148}}{6}`} nach="," /> also <Formel tex={t`x_1\approx 0{,}31`} /> und <Formel tex={t`x_2\approx 4{,}36`} nach="." /> Die Parabel <Formel tex="f'" /> ist nach oben geöffnet: <Formel tex="f'" /> wechselt bei <Formel tex={t`x_1`} /> von plus nach minus (Hochpunkt) und bei <Formel tex={t`x_2`} /> von minus nach plus (Tiefpunkt). Mit <Formel tex={t`f(0{,}3057)\approx 3{,}15`} /> und <Formel tex={t`f(4{,}3609)\approx -5{,}19`} /> ist <Formel tex={t`H(0{,}31\,|\,3{,}15)`} /> und <Formel tex={t`T(4{,}36\,|\,-5{,}19)`} nach="." />
          <Bild daten={BILD_A9_EXTREM} unter={<>Hochpunkt <Formel tex="H" /> und Tiefpunkt <Formel tex="T" /> mit ihren waagerechten Tangenten.</>} />
        </>,
        <>
          c: <Formel tex={t`f''(x)=\tfrac14\,(6x-14)=0`} /> liefert <Formel tex={t`x=\tfrac73\approx 2{,}33`} nach="." /> Dort wechselt <Formel tex="f''" /> das Vorzeichen, es ist eine Wendestelle. Die Steigung der Wendetangente ist <Formel tex={t`f'\left(\tfrac73\right)=\tfrac14\left(\tfrac{49}{3}-\tfrac{98}{3}+4\right)=-\tfrac{37}{12}\approx -3{,}08`} nach="." />
          <Bild daten={BILD_A9_WENDE} unter={<>Der Wendepunkt <Formel tex="W" /> mit der Wendetangente (blau gestrichelt).</>} />
        </>,
        <>
          d: Aus <Formel tex={t`\tfrac14\,(3x^2-14x+4)=3`} /> folgt <Formel tex={t`3x^2-14x-8=0`} nach="," /> also <Formel tex={t`x=\frac{14\pm\sqrt{292}}{6}`} nach="." /> Die Lösungen sind <Formel tex={t`x_1\approx -0{,}51`} /> und <Formel tex={t`x_2\approx 5{,}18`} nach="." /> In beiden Punkten haben die Tangenten die Steigung 3 und sind parallel.
          <Bild daten={BILD_A9_STEIGUNG} unter={<>In <Formel tex="P" /> und <Formel tex="Q" /> beträgt die Steigung 3.</>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild <Formel tex="K_f" /> einer ganzrationalen Funktion <Formel tex="f" /> dritten Grades hat die Nullstellen <Formel tex="-1" nach="," /> <Formel tex="2" /> und <Formel tex="6" /> und schneidet die y-Achse im Punkt <Formel tex={t`(0\,|\,3)`} nach="." />
      </p>
      <Teile>
        <li>
          Bestimmen Sie einen Funktionsterm von <Formel tex="f" /> und gib die Koeffizienten von <Formel tex={t`f(x)=ax^3+bx^2+cx+d`} /> an. <BE n={4} /> (Zur Kontrolle: <Formel tex="f(3)=-3" nach=".)" />
        </li>
        <li>
          Bestimmen Sie die Koordinaten des Hochpunkts und des Tiefpunkts von <Formel tex="K_f" /> auf zwei Nachkommastellen. <BE n={4} />
        </li>
        <li>
          Das Schaubild hat genau einen Wendepunkt <Formel tex="W" nach="." /> Bestimmen Sie seine x-Koordinate und die Steigung der Wendetangente. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie die Stellen, an denen die Steigung von <Formel tex="K_f" /> den Wert 3 hat. <BE n={3} />
        </li>
      </Teile>
      <Bild daten={BILD_A9_F} unter={<>Das Schaubild <Formel tex="K_f" /> mit den Nullstellen und dem Schnittpunkt mit der y-Achse.</>} />
      <Kontrollschaubild>
        <Bild daten={BILD_A9_EXTREM} unter={<>Das Schaubild <Formel tex="K_f" /> mit Hochpunkt, Tiefpunkt und ihren waagerechten Tangenten.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 10: Tangente an e^(−x) und Dreieck mit den Achsen. */
function Aufgabe10() {
  return (
    <Aufgabe
      nummer="10"
      titel="Tangente und Dreieck"
      felder={[
        { id: 'm', name: 'Steigung der Tangente für u gleich 1', beschriftung: <>Steigung <Formel tex="m" /></>, erwartet: A10.m, toleranz: 0.01 },
        { id: 'n', name: 'y-Achsenabschnitt der Tangente für u gleich 1', beschriftung: <><Formel tex="n" /></>, erwartet: A10.n, toleranz: 0.01 },
        { id: 'u', name: 'Stelle u mit dem größten Flächeninhalt', beschriftung: <><Formel tex="u" /></>, erwartet: A10.uMax },
        { id: 'A', name: 'größter Flächeninhalt', beschriftung: <>größter Flächeninhalt</>, erwartet: A10.Amax, toleranz: 0.01 },
        { id: 'u2', name: 'zweite Stelle mit Flächeninhalt ein halb', beschriftung: <>zweite Stelle <Formel tex="u" /></>, erwartet: A10.halb, toleranz: 0.01 },
      ]}
      hilfen={[
        <>Für a: Die Tangente in <Formel tex="P(u\,|\,f(u))" /> ist <Formel tex={t`y=f'(u)\,(x-u)+f(u)`} nach="." /> Setze <Formel tex="u=1" /> und leite <Formel tex={t`f(x)=e^{-x}`} /> ab.</>,
        <>Für b: Setze in der Tangentengleichung <Formel tex="y=0" /> (Schnittpunkt <Formel tex="N" /> mit der x-Achse) und <Formel tex="x=0" /> (Schnittpunkt <Formel tex="S" /> mit der y-Achse). Das Dreieck <Formel tex="ONS" /> hat bei <Formel tex="O" /> einen rechten Winkel.</>,
        <>Für c: Setze <Formel tex="A'(u)=0" /> und vergleiche mit <Formel tex="A(0)" /> und dem Verhalten für große <Formel tex="u" nach="." /> Für d: Löse <Formel tex={t`A(u)=\tfrac12`} /> mit dem Taschenrechner.</>,
      ]}
      loesung={[
        <>
          a: <Formel tex={t`f'(x)=-e^{-x}`} nach="." /> Für <Formel tex="u=1" /> ist <Formel tex={t`f(1)=e^{-1}`} /> und <Formel tex={t`f'(1)=-e^{-1}`} nach="." /> Die Tangente ist
          <Formel anzeige tex={t`y=-e^{-1}(x-1)+e^{-1}=e^{-1}(2-x)`} />
          also <Formel tex={t`m=-e^{-1}\approx -0{,}37`} /> und <Formel tex={t`n=2e^{-1}\approx 0{,}74`} nach="." />
          <Bild daten={BILD_A10_TANGENTE} unter={<>Die Tangente (blau gestrichelt) in <Formel tex="P" /> schneidet die x-Achse in <Formel tex="N" /> bei <Formel tex="x=2" /> und die y-Achse in <Formel tex="S" /> bei <Formel tex={t`y\approx 0{,}74`} nach="." /></>} />
        </>,
        <>
          b: Für beliebiges <Formel tex="u" /> ist die Tangente <Formel tex={t`y=-e^{-u}(x-u)+e^{-u}=e^{-u}\,(1+u-x)`} nach="." /> Für <Formel tex="y=0" /> ist <Formel tex="x=1+u" nach="," /> also <Formel tex={t`N(1+u\,|\,0)`} nach="." /> Für <Formel tex="x=0" /> ist <Formel tex={t`y=(1+u)\,e^{-u}`} nach="," /> also <Formel tex={t`S\left(0\,|\,(1+u)e^{-u}\right)`} nach="." /> Das Dreieck hat die Katheten <Formel tex="1+u" /> und <Formel tex={t`(1+u)e^{-u}`} nach="," /> der Flächeninhalt ist
          <Formel anzeige tex={t`A(u)=\tfrac12\,(1+u)\cdot(1+u)\,e^{-u}=\tfrac12\,(1+u)^2\,e^{-u}`} />
        </>,
        <>
          c: Mit der Produktregel ist <Formel tex={t`A'(u)=\tfrac12\,(1-u^2)\,e^{-u}`} nach="." /> Aus <Formel tex="A'(u)=0" /> folgt <Formel tex="u=1" /> (<Formel tex="u=-1" /> liegt nicht im Bereich <Formel tex={t`u\ge 0`} nach=")." /> Für <Formel tex="u<1" /> ist <Formel tex="A'>0" nach="," /> für <Formel tex="u>1" /> ist <Formel tex="A'<0" nach="." /> Es ist ein Hochpunkt mit <Formel tex={t`A(1)=2e^{-1}\approx 0{,}74`} nach="." /> Am Rand ist <Formel tex="A(0)=0{,}5" nach="," /> und für <Formel tex={t`u\to\infty`} /> geht <Formel tex="A(u)" /> gegen 0. Der größte Flächeninhalt ist also etwa 0,74 bei <Formel tex="u=1" nach="." />
        </>,
        <>
          d: <Formel tex={t`A(0)=\tfrac12`} nach="." /> Die weitere Lösung von <Formel tex={t`\tfrac12(1+u)^2e^{-u}=\tfrac12`} /> findest du mit dem Taschenrechner als Schnittpunkt von <Formel tex="A" /> mit <Formel tex={t`y=\tfrac12`} nach=":" /> <Formel tex={t`u\approx 2{,}51`} nach="." />
          <Bild daten={BILD_A10_A} unter={<>Die Zielfunktion <Formel tex="A" /> mit dem Hochpunkt <Formel tex="H" /> und dem Schnittpunkt <Formel tex="P" /> mit der Geraden <Formel tex={t`A=\tfrac12`} nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist die Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=e^{-x}`} nach="." /> Für <Formel tex={t`u\ge 0`} /> ist <Formel tex="P(u\,|\,f(u))" /> ein Punkt von <Formel tex="K_f" nach="." /> Die Tangente an <Formel tex="K_f" /> in <Formel tex="P" /> schneidet die x-Achse in <Formel tex="N" /> und die y-Achse in <Formel tex="S" nach="." /> Zusammen mit dem Koordinatenursprung <Formel tex="O" /> bilden <Formel tex="N" /> und <Formel tex="S" /> ein Dreieck. Für die Ableitung von <Formel tex="A" /> gilt zur Kontrolle <Formel tex={t`A'(u)=\tfrac12\,(1-u^2)\,e^{-u}`} nach="." />
      </p>
      <Teile>
        <li>
          Bestimmen Sie für <Formel tex="u=1" /> eine Gleichung der Tangente. Gib <Formel tex="m" /> und <Formel tex="n" /> von <Formel tex="y=mx+n" /> auf zwei Nachkommastellen an. <BE n={3} />
        </li>
        <li>
          Zeigen Sie, dass der Flächeninhalt des Dreiecks <Formel tex="ONS" /> durch <Formel tex={t`A(u)=\tfrac12\,(1+u)^2\,e^{-u}`} /> beschrieben wird. <BE n={4} />
        </li>
        <li>
          Bestimmen Sie <Formel tex="u" /> so, dass der Flächeninhalt am größten ist, und geben Sie diesen an. <BE n={4} />
        </li>
        <li>
          Es gilt <Formel tex={t`A(0)=\tfrac12`} nach="." /> Bestimmen Sie den weiteren Wert von <Formel tex="u" nach="," /> für den der Flächeninhalt <Formel tex={t`\tfrac12`} /> beträgt. <BE n={3} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A10_TANGENTE} unter={<>Das Schaubild von <Formel tex="f" /> mit der Tangente für <Formel tex="u=1" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 11: logistisches Wachstum. */
function Aufgabe11() {
  return (
    <Aufgabe
      nummer="11"
      titel="Spielerzahl eines Videospiels"
      felder={[
        { id: 'N0', name: 'Spielerzahl zu Beginn in Tausend', beschriftung: <>Spielerzahl zu Beginn</>, erwartet: A11.N0 },
        { id: 'g', name: 'Grenzwert für t gegen unendlich', beschriftung: <>Grenzwert</>, erwartet: A11.grenze },
        { id: 'mittel', name: 'mittlere Änderungsrate in den ersten 4 Wochen', beschriftung: <>mittlere Änderungsrate</>, erwartet: A11.mittel, toleranz: 0.01 },
        { id: 'tw', name: 'Zeitpunkt der stärksten Zunahme in Wochen', beschriftung: <>Zeitpunkt der stärksten Zunahme</>, erwartet: A11.wendeZeit, toleranz: 0.01 },
        { id: 'rw', name: 'momentane Änderungsrate zu diesem Zeitpunkt', beschriftung: <>Änderungsrate dort</>, erwartet: A11.wendeRate, toleranz: 0.01 },
        { id: 't90', name: 'Zeitpunkt, zu dem 90 Tausend erreicht sind, in Wochen', beschriftung: <>Zeitpunkt für 90 Tausend</>, erwartet: A11.t90, toleranz: 0.01 },
      ]}
      hilfen={[
        <>Für a: Der Term <Formel tex={t`e^{-0{,}5t}`} /> wird für große <Formel tex="t" /> beliebig klein. Das bestimmt den Nenner. Für b brauchst du die Sekantensteigung (Modul <Modulverweis modul="aenderungsraten">Änderungsraten</Modulverweis>).</>,
        <>Für c: Die stärkste Zunahme ist der größte Wert von <Formel tex="N'" nach="." /> Bestimme das Maximum von <Formel tex="N'" /> mit dem Taschenrechner oder über die Wendestelle von <Formel tex="N" nach="." /></>,
        <>Für d: Setze <Formel tex={t`N(t)=90`} /> und forme nach <Formel tex={t`e^{-0{,}5t}`} /> um. Mit dem natürlichen Logarithmus löst du nach <Formel tex="t" /> auf (Modul <Modulverweis modul="umkehrfunktion">Umkehrfunktion</Modulverweis>).</>,
      ]}
      loesung={[
        <>
          a: <Formel tex={t`N(0)=\frac{100}{1+9}=10`} /> Tausend. Der Nenner <Formel tex={t`1+9e^{-0{,}5t}`} /> ist immer größer als 1, also ist <Formel tex={t`N(t)<100`} nach="." /> Für <Formel tex={t`t\to\infty`} /> geht <Formel tex={t`e^{-0{,}5t}`} /> gegen 0, der Nenner gegen 1: <Formel tex={t`\lim_{t\to\infty}N(t)=100`} nach="." /> Es werden sich nie mehr als 100 Tausend Spielende erreichen.
          <Bild daten={BILD_A11_N} unter={<>Das Schaubild von <Formel tex="N" /> nähert sich der Geraden <Formel tex="y=100" /> (blau gestrichelt) an.</>} />
        </>,
        <>
          b: <Formel tex={t`N(4)=\frac{100}{1+9e^{-2}}\approx 45{,}09`} nach="." /> Mittlere Änderungsrate:
          <Formel anzeige tex={t`\frac{N(4)-N(0)}{4-0}\approx\frac{45{,}09-10}{4}\approx 8{,}77`} />
          In den ersten vier Wochen kommen im Mittel etwa 8,77 Tausend Spielende pro Woche hinzu.
        </>,
        <>
          c: Für die Zunahme ist <Formel tex={t`N'(t)=\frac{450\,e^{-0{,}5t}}{(1+9e^{-0{,}5t})^2}`} /> maßgebend. Das Maximum von <Formel tex="N'" /> liegt bei <Formel tex={t`t\approx 4{,}39`} nach="." /> Dort ist <Formel tex={t`N(t)=50`} nach="," /> denn aus <Formel tex={t`9e^{-0{,}5t}=1`} /> folgt <Formel tex={t`t=2\ln 9\approx 4{,}39`} nach="." /> Die Rate dort ist <Formel tex={t`N'(4{,}39)=\frac{450\cdot\frac19}{4}=12{,}5`} nach="." /> Am stärksten nimmt die Spielerzahl nach etwa 4,4 Wochen zu, mit 12,5 Tausend pro Woche.
          <Bild daten={BILD_A11_WENDE} unter={<>Im Wendepunkt <Formel tex="W" /> ist die Tangente (blau gestrichelt) am steilsten.</>} />
        </>,
        <>
          d: <Formel tex={t`\frac{100}{1+9e^{-0{,}5t}}=90`} /> liefert <Formel tex={t`1+9e^{-0{,}5t}=\tfrac{10}{9}`} nach="," /> also <Formel tex={t`e^{-0{,}5t}=\tfrac{1}{81}`} nach="." /> Mit dem Logarithmus ist <Formel tex={t`-0{,}5t=-\ln 81`} nach="," /> also <Formel tex={t`t=2\ln 81\approx 8{,}79`} nach="." /> Nach etwa 8,8 Wochen sind 90 Tausend erreicht.
          <Bild daten={BILD_A11_90} unter={<>Im Punkt <Formel tex="P" /> erreicht das Schaubild die Gerade <Formel tex="y=90" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Die Zahl der Spielenden eines Videospiels (in Tausend) wird <Formel tex="t" /> Wochen nach der Veröffentlichung durch <Formel tex={t`N(t)=\frac{100}{1+9\,e^{-0{,}5t}}`} /> mit <Formel tex={t`t\ge 0`} /> beschrieben. Für die erste Ableitungsfunktion gilt <Formel tex={t`N'(t)=\frac{450\,e^{-0{,}5t}}{(1+9\,e^{-0{,}5t})^2}`} nach="." />
      </p>
      <Teile>
        <li>
          Geben Sie die Zahl der Spielenden zu Beginn an. Begründen Sie mit dem Funktionsterm, dass <Formel tex="N(t)" /> immer kleiner als 100 bleibt, und geben Sie den Grenzwert für <Formel tex={t`t\to\infty`} /> an. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie die mittlere Änderungsrate der Spielerzahl in den ersten vier Wochen. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie den Zeitpunkt, zu dem die Spielerzahl am stärksten zunimmt, und die momentane Änderungsrate zu diesem Zeitpunkt. <BE n={5} />
        </li>
        <li>
          Berechnen Sie, nach wie vielen Wochen 90 Tausend Spielende erreicht sind. <BE n={3} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A11_N} unter={<>Das Schaubild von <Formel tex="N" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 12, Teil a: Welches Schaubild passt? */
function Frage12a() {
  const optionen = [
    opt('K2', <>Schaubild K 2</>, true, <>Richtig.</>),
    opt('K1', <>Schaubild K 1</>, false, <>K 1 ist an der y-Achse gespiegelt. Es schneidet die y-Achse zwar bei 3, steigt dort aber. <Formel tex="K_f" /> hat wegen <Formel tex="f'(0)=-1" /> an dieser Stelle eine fallende Tangente. Außerdem liegt der Sattelpunkt von <Formel tex="K_f" /> links von der y-Achse, der Tiefpunkt rechts.</>),
    opt('K3', <>Schaubild K 3</>, false, <>K 3 schneidet die y-Achse bei 2, <Formel tex="f(0)=3" nach="." /> Außerdem hat K 3 zwei Tiefpunkte und einen Hochpunkt. <Formel tex="K_f" /> hat aber nur einen Tiefpunkt und einen Sattelpunkt.</>),
    opt('keins', <>Keins der drei Schaubilder</>, false, <>K 2 hat den Achsenabschnitt 3, fällt bei <Formel tex="x=0" /> und hat links einen Sattelpunkt, rechts einen Tiefpunkt. Das passt zu <Formel tex="f" nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="12a"
      titel="Welches Schaubild gehört zu f?"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Es ist <Formel tex="f(0)=3" nach="." /> Das schließt K 3 aus (dort 2). Aus <Formel tex={t`f'(x)=\tfrac12\,(x^3-3x-2)`} /> folgt <Formel tex="f'(0)=-1" nach="," /> das Schaubild fällt bei <Formel tex="x=0" nach="." /> Das schließt K 1 aus, K 1 steigt dort. K 2 fällt bei <Formel tex="x=0" /> und hat die waagerechten Tangenten bei <Formel tex="x=-1" /> und <Formel tex="x=2" nach="." />
          </p>
          <Bild daten={BILD_A12_PUNKTE} unter={<>Das Schaubild von <Formel tex="f" /> mit dem Sattelpunkt <Formel tex="S" /> und dem Tiefpunkt <Formel tex="T" nach="." /></>} />
        </>
      }
    >
      <p>
        Gegeben ist die in <Formel tex={t`\mathbb{R}`} /> definierte Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=\tfrac18x^4-\tfrac34x^2-x+3`} nach="." /> Ihr Schaubild ist <Formel tex="K_f" nach="." /> Eines der drei Schaubilder K 1, K 2 und K 3 gehört zu <Formel tex="K_f" nach="." /> Beurteilen Sie für jedes, ob es <Formel tex="K_f" /> sein kann, und wähle das passende aus. <BE n={6} />
      </p>
      <Bild daten={BILD_A12_K1} unter={<>Schaubild K 1</>} />
      <Bild daten={BILD_A12_K2} unter={<>Schaubild K 2</>} />
      <Bild daten={BILD_A12_K3} unter={<>Schaubild K 3</>} />
    </Auswahlfrage>
  );
}

/** Aufgabe 12, Teile b bis d: waagerechte Tangenten, Tangente an der y-Achse, Wendepunkt. */
function Aufgabe12b() {
  return (
    <Aufgabe
      nummer="12b"
      titel="Waagerechte Tangenten, Tangente und Wendepunkt"
      felder={[
        { id: 'xs', name: 'x-Koordinate des Sattelpunkts', beschriftung: <>Sattelpunkt: <Formel tex="x" /></>, erwartet: A12.sattel[0] },
        { id: 'ys', name: 'y-Koordinate des Sattelpunkts', beschriftung: <>Sattelpunkt: <Formel tex="y" /></>, erwartet: A12.sattel[1] },
        { id: 'xt', name: 'x-Koordinate des Tiefpunkts', beschriftung: <>Tiefpunkt: <Formel tex="x" /></>, erwartet: A12.tief[0] },
        { id: 'yt', name: 'y-Koordinate des Tiefpunkts', beschriftung: <>Tiefpunkt: <Formel tex="y" /></>, erwartet: A12.tief[1] },
        { id: 'm', name: 'Steigung der Tangente im Schnittpunkt mit der y-Achse', beschriftung: <>Steigung <Formel tex="m" /></>, erwartet: A12.steigungSy },
        { id: 'n', name: 'y-Achsenabschnitt der Tangente', beschriftung: <><Formel tex="n" /></>, erwartet: A12.sy },
        { id: 'xw', name: 'x-Koordinate des weiteren Wendepunkts', beschriftung: <>Wendepunkt: <Formel tex="x" /></>, erwartet: A12.wende[0] },
        { id: 'yw', name: 'y-Koordinate des weiteren Wendepunkts', beschriftung: <>Wendepunkt: <Formel tex="y" /></>, erwartet: A12.wende[1] },
        { id: 'mw', name: 'Steigung der Wendetangente', beschriftung: <>Steigung der Wendetangente</>, erwartet: A12.wendeSteigung },
      ]}
      hilfen={[
        <>Für b: Waagerechte Tangenten gibt es dort, wo <Formel tex="f'(x)=0" /> gilt. Eine der beiden Nullstellen von <Formel tex="f'" /> liegt bei <Formel tex="x=2" nach="." /> Teile <Formel tex="x^3-3x-2" /> durch <Formel tex="(x-2)" nach="." /></>,
        <>Für c: Die Tangente im Schnittpunkt mit der y-Achse braucht <Formel tex="f(0)" /> und <Formel tex="f'(0)" nach="." /> Für d: An einer Wendestelle ist <Formel tex="f''(x)=0" nach="." /> Zwei Stellen kommen infrage, eine davon ist schon der Sattelpunkt.</>,
        <>Ein Sattelpunkt ist ein Wendepunkt mit waagerechter Tangente (Modul <Modulverweis modul="kurvendiskussion">Kurvendiskussion</Modulverweis>). Der gesuchte Wendepunkt <Formel tex="W" /> hat eine Tangente mit einer anderen Steigung.</>,
      ]}
      loesung={[
        <>
          b: <Formel tex={t`f'(x)=\tfrac12\,(x^3-3x-2)=0`} nach="." /> Mit <Formel tex="x=2" /> als Lösung folgt <Formel tex={t`x^3-3x-2=(x-2)(x+1)^2`} nach="." /> Die Nullstellen sind <Formel tex="x=2" /> (einfach) und <Formel tex="x=-1" /> (doppelt). Bei <Formel tex="x=-1" /> ändert sich das Vorzeichen von <Formel tex="f'" /> nicht, es ist ein Sattelpunkt. Bei <Formel tex="x=2" /> wechselt es von minus nach plus, es ist ein Tiefpunkt. Mit <Formel tex={t`f(-1)=\tfrac{27}{8}`} /> und <Formel tex="f(2)=0" /> ist <Formel tex={t`S\left(-1\,|\,\tfrac{27}{8}\right)`} /> und <Formel tex={t`T(2\,|\,0)`} nach="." />
          <Bild daten={BILD_A12_PUNKTE} unter={<>Der Sattelpunkt <Formel tex="S" /> mit der waagerechten Tangente (blau gestrichelt). Die waagerechte Tangente im Tiefpunkt ist die x-Achse.</>} />
        </>,
        <>
          c: Es ist <Formel tex="f(0)=3" /> und <Formel tex={t`f'(0)=\tfrac12\cdot(-2)=-1`} nach="." /> Die Tangente ist <Formel tex="y=-x+3" nach="," /> also <Formel tex="m=-1" /> und <Formel tex="n=3" nach="." />
          <Bild daten={BILD_A12_SY} unter={<>Die Tangente (blau gestrichelt) im Schnittpunkt <Formel tex="S_y" /> mit der y-Achse.</>} />
        </>,
        <>
          d: <Formel tex={t`f''(x)=\tfrac12\,(3x^2-3)=0`} /> liefert <Formel tex="x=-1" /> und <Formel tex="x=1" nach="." /> Bei <Formel tex="x=-1" /> liegt der Sattelpunkt, der ein Wendepunkt mit waagerechter Tangente ist. Der weitere Wendepunkt liegt bei <Formel tex="x=1" nach="." /> Es ist <Formel tex={t`f(1)=\tfrac18-\tfrac34-1+3=\tfrac{11}{8}`} /> und <Formel tex={t`f'(1)=\tfrac12\,(1-3-2)=-2`} nach="." /> Also <Formel tex={t`W\left(1\,|\,\tfrac{11}{8}\right)`} /> und die Steigung der Wendetangente ist <Formel tex="-2" nach="." />
          <Bild daten={BILD_A12_WENDE} unter={<>Die Wendepunkte <Formel tex="S" /> und <Formel tex="W" /> mit der Wendetangente (blau gestrichelt) in <Formel tex="W" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Es geht weiter mit <Formel tex={t`f(x)=\tfrac18x^4-\tfrac34x^2-x+3`} nach="." /> Zur Kontrolle gilt <Formel tex={t`f'(x)=\tfrac12\,(x^3-3x-2)`} /> und <Formel tex={t`f''(x)=\tfrac32\,(x^2-1)`} nach="." />
      </p>
      <Teile ab={2}>
        <li>
          Berechnen Sie die Koordinaten aller Punkte, in denen <Formel tex="K_f" /> eine waagerechte Tangente hat. Geben Sie für jeden an, ob es ein Hoch-, Tief- oder Sattelpunkt ist. Gib den Sattelpunkt und den Tiefpunkt an. <BE n={5} />
        </li>
        <li>
          Bestimmen Sie eine Gleichung der Tangente an <Formel tex="K_f" /> im Schnittpunkt mit der y-Achse. <BE n={3} />
        </li>
        <li>
          Außer dem Sattelpunkt hat <Formel tex="K_f" /> einen weiteren Wendepunkt <Formel tex="W" nach="." /> Bestimmen Sie seine Koordinaten und die Steigung der Wendetangente. <BE n={4} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A12_PUNKTE} unter={<>Das Schaubild <Formel tex="K_f" /> mit dem Sattelpunkt und dem Tiefpunkt.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

export function MitHilfsmittel() {
  return (
    <Abschnitt id="mit-hilfsmittel" titel="Mit Hilfsmittel">
      <p>
        Diese sechs Aufgaben sind länger und stehen oft in einem Sachzusammenhang. Du darfst den Taschenrechner benutzen, Zwischenergebnisse rechnest du ungerundet weiter.
      </p>
      <Eingabehinweis />
      <Aufgabe7 />
      <Aufgabe8 />
      <Aufgabe9 />
      <Aufgabe10 />
      <Aufgabe11 />
      <Frage12a />
      <Aufgabe12b />
    </Abschnitt>
  );
}
