import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import {
  BILD_BREMS_KONTROLLE, BILD_BREMS_TANGENTE, BILD_BREMS_TANGENTEN, BILD_BREMS_VERGLEICH, BILD_KOSTEN, BILD_LUECKE_2, BILD_PFLANZE,
  BILD_SEKANTE_AUFGABE, BILD_SEKANTE_KONTROLLE, BILD_SEKANTE_RENN,
} from './Bilder';
import { BREMS, EXAKT, KOSTEN, NAEHERUNG, PFLANZE, RENN, SEKANTE, TOL2 } from './daten';

const ms = t`\frac{\text{m}}{\text{s}}`;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>0,87</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{1}{4}`} nach=")" /> ein, ohne Einheit. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert, wenn die Aufgabe nicht ausdrücklich ein exaktes Ergebnis verlangt.
    </Hinweis>
  );
}

function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Mittlere Geschwindigkeit des Rennwagens"
      felder={[
        { id: 'ds', name: 'Wegunterschied Delta s in Metern', beschriftung: <><Formel tex={t`\Delta s`} /> in m</>, erwartet: RENN.deltaS },
        { id: 'dt', name: 'Zeitunterschied Delta t in Sekunden', beschriftung: <><Formel tex={t`\Delta t`} /> in s</>, erwartet: RENN.deltaT },
        { id: 'v', name: 'mittlere Geschwindigkeit in Metern pro Sekunde', beschriftung: <><Formel tex={t`\bar v`} /> in <Formel tex={ms} /></>, erwartet: RENN.mittel },
        { id: 'kmh', name: 'mittlere Geschwindigkeit in Kilometern pro Stunde', beschriftung: <><Formel tex={t`\bar v`} /> in <Formel tex={t`\frac{\text{km}}{\text{h}}`} /></>, erwartet: RENN.kmh },
      ]}
      hilfen={[
        <>Die mittlere Geschwindigkeit ist die mittlere Änderungsrate des Wegs, also der Differenzenquotient <Formel tex={t`\frac{s(7)-s(3)}{7-3}`} nach="." /></>,
        <>Berechne <Formel tex="s(3)" /> und <Formel tex="s(7)" /> mit <Formel tex="s(t)=3t^2" nach="." /></>,
        <>Zum Umrechnen von <Formel tex={ms} /> in <Formel tex={t`\frac{\text{km}}{\text{h}}`} /> multiplizierst du mit <Formel tex="3{,}6" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex="s(3)=3\cdot 3^2=27" /> und <Formel tex="s(7)=3\cdot 7^2=147" nach="." /> Der Weg wächst um <Formel tex={t`\Delta s=147-27=120`} /> Meter, die Zeit um <Formel tex={t`\Delta t=7-3=4`} /> Sekunden.</>,
        <><Formel tex={t`\bar v=\frac{120}{4}=30\,${ms}`} nach="." /></>,
        <>
          <Formel tex={t`30\cdot 3{,}6=108\,\frac{\text{km}}{\text{h}}`} nach="." /> Die Steigung der Sekante durch <Formel tex="P(3\,|\,27)" /> und <Formel tex="Q(7\,|\,147)" /> ist die gesuchte Durchschnittsgeschwindigkeit.
          <Bild
            daten={BILD_SEKANTE_RENN}
            unter={<>Orange: <Formel tex="K_s" nach="," /> blau: Sekante, grün: Steigungsdreieck.</>}
          />
        </>,
      ]}
    >
      <p>
        Für den Rennwagen gilt <Formel tex="s(t)=3t^2" /> mit <Formel tex="t" /> in Sekunden und <Formel tex="s(t)" /> in Metern. Bestimme die mittlere Geschwindigkeit zwischen <Formel tex="t=3" /> und <Formel tex="t=7" /> in <Formel tex={ms} /> und in <Formel tex={t`\frac{\text{km}}{\text{h}}`} nach="." />
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_SEKANTE_RENN} unter={<>Orange: <Formel tex="K_s" nach="," /> blau: Sekante von <Formel tex="P(3\,|\,27)" /> nach <Formel tex="Q(7\,|\,147)" nach="," /> grün: Steigungsdreieck.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Wachstum einer Pflanze"
      felder={[
        { id: 'a', name: 'mittlere Änderungsrate von Tag 0 bis Tag 10', beschriftung: <>von Tag 0 bis 10 in cm pro Tag</>, erwartet: PFLANZE.mittel0bis10 },
        { id: 'b', name: 'mittlere Änderungsrate von Tag 5 bis Tag 15', beschriftung: <>von Tag 5 bis 15 in cm pro Tag</>, erwartet: PFLANZE.mittel5bis15 },
        { id: 'c', name: 'mittlere Änderungsrate von Tag 10 bis Tag 15', beschriftung: <>von Tag 10 bis 15 in cm pro Tag</>, erwartet: PFLANZE.mittel10bis15 },
      ]}
      hilfen={[
        <>Bilde jeweils die Höhenänderung geteilt durch die Zeitspanne.</>,
        <>Lies die Höhen in der Tabelle ab: nach 0, 5, 10 und 15 Tagen sind es 2, 6, 13 und 25 cm.</>,
      ]}
      loesung={[
        <>Von Tag 0 bis 10: <Formel tex={t`\frac{13-2}{10-0}=\frac{11}{10}=1{,}1`} nach="." /></>,
        <>Von Tag 5 bis 15: <Formel tex={t`\frac{25-6}{15-5}=\frac{19}{10}=1{,}9`} nach="." /></>,
        <>Von Tag 10 bis 15: <Formel tex={t`\frac{25-13}{15-10}=\frac{12}{5}=2{,}4`} nach="." /> Die Einheit ist cm pro Tag.</>,
      ]}
    >
      <p>Die Höhe einer Pflanze wurde gemessen:</p>
      <table className="tabelle tabelle-kompakt">
        <caption>Höhe der Pflanze</caption>
        <thead>
          <tr>
            <th scope="col">Zeit in Tagen</th>
            {PFLANZE.t.map((x) => <td key={x}>{x}</td>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Höhe in cm</th>
            {PFLANZE.h.map((x, i) => <td key={i}>{x}</td>)}
          </tr>
        </tbody>
      </table>
      <p>Bestimme die mittleren Änderungsraten der Höhe für die angegebenen Zeiträume.</p>
    </Aufgabe>
  );
}

function Frage3() {
  const optionen = [
    opt('schneller', <>Die Pflanze wächst im Lauf der Zeit immer schneller.</>, true, <>Richtig.</>),
    opt('gleich', <>Die Pflanze wächst gleichmäßig, jeden Tag um gleich viel.</>, false, <>Dann wären alle mittleren Änderungsraten gleich. Sie steigen aber von 1,1 über 1,9 auf 2,4 cm pro Tag.</>),
    opt('langsamer', <>Die Pflanze wächst immer langsamer.</>, false, <>Die mittlere Änderungsrate nimmt zu, nicht ab. Die Pflanze legt in der gleichen Zeit immer mehr Höhe zu.</>),
    opt('hoehe', <>Die Pflanze ist nach 15 Tagen am höchsten, deshalb wächst sie am schnellsten.</>, false, <>Die Höhe sagt nichts über die Geschwindigkeit des Wachstums. Entscheidend ist die Höhenänderung pro Tag, also die Änderungsrate.</>),
  ];
  return (
    <Auswahlfrage
      nummer="3"
      titel="Wachstum deuten"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Die Änderungsraten der drei Abschnitte sind <Formel tex={t`\frac{6-2}{5}=0{,}8`} nach="," /> <Formel tex={t`\frac{13-6}{5}=1{,}4`} /> und <Formel tex={t`\frac{25-13}{5}=2{,}4`} nach="." /> Sie nehmen zu. Im Schaubild sieht man das an den Strecken, die von links nach rechts steiler werden.
          </p>
          <Bild daten={BILD_PFLANZE} unter={<>Streckenzug durch die Messwerte. Die Steigung jeder Strecke ist die mittlere Änderungsrate im Abschnitt, die letzte (blau) ist am steilsten.</>} />
        </>
      }
    >
      <p>
        Die Höhe der Pflanze aus Aufgabe 2 wächst von 2 über 6 und 13 auf 25 cm. Was sagen die mittleren Änderungsraten über das Wachstum?
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Sekantensteigung am Schaubild"
      felder={[
        { id: 'dx', name: 'Delta x zwischen P und Q', beschriftung: <><Formel tex={t`\Delta x`} /></>, erwartet: SEKANTE.deltaX },
        { id: 'dy', name: 'Delta y zwischen P und Q', beschriftung: <><Formel tex={t`\Delta y`} /></>, erwartet: SEKANTE.deltaY },
        { id: 'm', name: 'Steigung der Sekante durch P und Q', beschriftung: <>Steigung <Formel tex="m" /> der Sekante</>, erwartet: SEKANTE.m },
      ]}
      hilfen={[
        <>Lies die Koordinaten von <Formel tex="P" /> und <Formel tex="Q" /> am Gitter ab. Beachte die Teilung der y-Achse.</>,
        <><Formel tex={t`\Delta x`} /> ist der Unterschied der x-Koordinaten, <Formel tex={t`\Delta y`} /> der Unterschied der y-Koordinaten.</>,
        <>Die Steigung ist <Formel tex={t`m=\frac{\Delta y}{\Delta x}`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex="P(2\,|\,2)" /> und <Formel tex="Q(6\,|\,18)" nach="." /></>,
        <><Formel tex={t`\Delta x=6-2=4`} /> und <Formel tex={t`\Delta y=18-2=16`} nach="." /></>,
        <>
          <Formel tex={t`m=\frac{16}{4}=4`} nach="." /> Im Mittel steigt das Schaubild zwischen <Formel tex="x=2" /> und <Formel tex="x=6" /> um 4 pro Einheit.
          <Bild daten={BILD_SEKANTE_KONTROLLE} unter={<>Blau: Sekante durch <Formel tex="P" /> und <Formel tex="Q" nach="," /> grün: Steigungsdreieck.</>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild gehört zu einer Funktion <Formel tex="f" nach="." /> Bestimme <Formel tex={t`\Delta x`} nach="," /> <Formel tex={t`\Delta y`} /> und die Steigung der Sekante durch <Formel tex="P" /> und <Formel tex="Q" nach="." />
      </p>
      <Bild daten={BILD_SEKANTE_AUFGABE} unter={<>Schaubild <Formel tex="K_f" /> mit den Punkten <Formel tex="P" /> und <Formel tex="Q" nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_SEKANTE_KONTROLLE} unter={<>Blau: Sekante durch <Formel tex="P" /> und <Formel tex="Q" nach="," /> grün: Steigungsdreieck.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe5() {
  const tg = BREMS.tangente;
  return (
    <Aufgabe
      nummer="5"
      titel="Tangentensteigung ablesen"
      felder={[
        { id: 'dt', name: 'Delta t zwischen A und B in Sekunden', beschriftung: <><Formel tex={t`\Delta t`} /> in s</>, erwartet: tg.deltaT },
        { id: 'ds', name: 'Delta s zwischen A und B in Metern', beschriftung: <><Formel tex={t`\Delta s`} /> in m</>, erwartet: tg.deltaS },
        { id: 'm', name: 'Steigung der Tangente in Metern pro Sekunde', beschriftung: <>Steigung der Tangente in <Formel tex={ms} /></>, erwartet: tg.m },
      ]}
      hilfen={[
        <>Die Tangente geht durch <Formel tex="A(2\,|\,48)" /> und <Formel tex="B(6\,|\,80)" nach="." /> Lies die Koordinaten am Gitter ab.</>,
        <>Bilde <Formel tex={t`\Delta t`} /> und <Formel tex={t`\Delta s`} /> aus den Koordinaten von <Formel tex="A" /> und <Formel tex="B" nach="." /></>,
        <>Die Steigung der Tangente ist <Formel tex={t`\frac{\Delta s}{\Delta t}`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`\Delta t=6-2=4`} /> und <Formel tex={t`\Delta s=80-48=32`} nach="." /></>,
        <>
          <Formel tex={t`m\approx\frac{32}{4}=8\,${ms}`} nach="." /> Das sind <Formel tex={t`8\cdot 3{,}6=28{,}8\,\frac{\text{km}}{\text{h}}`} nach="." /> Das Fahrzeug hat zum Zeitpunkt <Formel tex="t=4" /> diese Momentangeschwindigkeit.
          <Bild daten={BILD_BREMS_KONTROLLE} unter={<>Orange: <Formel tex="K_s" nach="," /> schwarz gestrichelt: Tangente, grün: Steigungsdreieck zwischen <Formel tex="A" /> und <Formel tex="B" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Ein Fahrzeug bremst. Für den Weg gilt <Formel tex="s(t)=24t-2t^2" /> mit <Formel tex="t" /> in Sekunden und <Formel tex="s" /> in Metern. Im Punkt <Formel tex="P(4\,|\,64)" /> ist die Tangente eingezeichnet. Bestimme mit dem Steigungsdreieck zwischen <Formel tex="A" /> und <Formel tex="B" /> die Momentangeschwindigkeit bei <Formel tex="t=4" nach="." />
      </p>
      <Bild daten={BILD_BREMS_TANGENTE} unter={<>Schaubild <Formel tex="K_s" /> mit der Tangente in <Formel tex="P" nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_BREMS_KONTROLLE} unter={<>Grün: Steigungsdreieck zwischen <Formel tex="A" /> und <Formel tex="B" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage6() {
  const optionen = [
    opt('moment', <>Zum Zeitpunkt <Formel tex="t=4" /> beträgt die Geschwindigkeit <Formel tex={t`8\,${ms}`} nach="." /></>, true, <>Richtig.</>),
    opt('weg', <>Nach 4 Sekunden hat das Fahrzeug 8 Meter zurückgelegt.</>, false, <>Das wäre der Funktionswert <Formel tex="s(4)" nach="." /> Der ist 64. Die Steigung gibt nicht den Weg an, sondern wie schnell er sich ändert.</>),
    opt('mittel', <>In den ersten 4 Sekunden fährt das Fahrzeug im Mittel <Formel tex={t`8\,${ms}`} nach="." /></>, false, <>Die mittlere Geschwindigkeit der ersten 4 Sekunden ist <Formel tex={t`\frac{64}{4}=16\,${ms}`} nach="." /> Die Tangentensteigung gehört zu einem Zeitpunkt, nicht zu einem Intervall.</>),
    opt('beschl', <>Das Fahrzeug bremst mit <Formel tex={t`8\,\frac{\text{m}}{\text{s}^2}`} nach="." /></>, false, <>Die Einheit passt nicht. Die Tangentensteigung ist eine Geschwindigkeit in <Formel tex={ms} nach="," /> keine Beschleunigung.</>),
  ];
  return (
    <Auswahlfrage
      nummer="6"
      titel="Tangentensteigung deuten"
      optionen={platziere(optionen, 0)}
      erklaerung={
        <>
          <p>
            Die Tangente gehört zu <strong>einem</strong> Zeitpunkt und gibt die Momentangeschwindigkeit an. Die Sekante von <Formel tex="O(0\,|\,0)" /> bis <Formel tex="P(4\,|\,64)" /> gehört zu einem Intervall und hat die Steigung <Formel tex="16" nach="." /> Das Fahrzeug bremst, deshalb ist die Momentangeschwindigkeit bei <Formel tex="t=4" /> kleiner als die mittlere Geschwindigkeit davor.
          </p>
          <Bild daten={BILD_BREMS_VERGLEICH} unter={<>Blau: Sekante von <Formel tex="O" /> nach <Formel tex="P" nach="," /> Steigung 16, schwarz gestrichelt: Tangente in <Formel tex="P" nach="," /> Steigung 8.</>} />
        </>
      }
    >
      <p>
        Beim Bremsvorgang aus Aufgabe 5 hat die Tangente im Punkt <Formel tex="P(4\,|\,64)" /> die Steigung <Formel tex="8" nach="." /> Was bedeutet das?
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe7() {
  const n = NAEHERUNG;
  return (
    <Aufgabe
      nummer="7"
      titel="Momentane Änderungsrate mit dem Taschenrechner nähern"
      felder={[
        { id: 'a', name: 'Differenzenquotient für h gleich 0,1', beschriftung: <>für <Formel tex="h=0{,}1" /></>, erwartet: n.d1, toleranz: TOL2 },
        { id: 'b', name: 'Differenzenquotient für h gleich 0,01', beschriftung: <>für <Formel tex="h=0{,}01" /></>, erwartet: n.d2, toleranz: TOL2 },
        { id: 'c', name: 'Differenzenquotient für h gleich 0,001', beschriftung: <>für <Formel tex="h=0{,}001" /></>, erwartet: n.d3, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Der Differenzenquotient für das Intervall von <Formel tex="2" /> bis <Formel tex="2+h" /> ist <Formel tex={t`\frac{f(2+h)-f(2)}{h}`} nach="." /></>,
        <>Mit <Formel tex="f(x)=x^3" /> ist <Formel tex="f(2)=8" nach="." /> Rechne für jedes <Formel tex="h" /> den Wert <Formel tex={t`f(2+h)`} /> mit dem Taschenrechner aus.</>,
      ]}
      loesung={[
        <><Formel tex={t`\frac{2{,}1^3-8}{0{,}1}=\frac{9{,}261-8}{0{,}1}=12{,}61`} nach="." /></>,
        <><Formel tex={t`\frac{2{,}01^3-8}{0{,}01}=\frac{8{,}120601-8}{0{,}01}\approx 12{,}06`} nach="." /></>,
        <>
          <Formel tex={t`\frac{2{,}001^3-8}{0{,}001}\approx 12{,}01`} nach="." /> Die Werte werden kleiner und nähern sich der Zahl <Formel tex="12" nach="." /> Das ist die momentane Änderungsrate bei <Formel tex="x_0=2" nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex="f(x)=x^3" nach="." /> Berechne die Differenzenquotienten <Formel tex={t`\frac{f(2+h)-f(2)}{h}`} /> für <Formel tex="h=0{,}1" nach="," /> <Formel tex="h=0{,}01" /> und <Formel tex="h=0{,}001" nach="." /> Gib sie auf zwei Nachkommastellen genau an. Gegen welche Zahl laufen die Werte?
      </p>
    </Aufgabe>
  );
}

function Frage8() {
  const optionen = [
    opt('kuerzen', <>Man vereinfacht den Differenzenquotienten für <Formel tex={t`x\ne x_0`} nach="," /> kürzt den Faktor <Formel tex="x-x_0" /> und setzt erst danach <Formel tex="x=x_0" /> ein.</>, true, <>Richtig.</>),
    opt('null', <>Man setzt gleich <Formel tex="x=x_0" /> ein. Das Ergebnis ist <Formel tex="0" nach="." /></>, false, <>Dann steht im Zähler und im Nenner <Formel tex="0" nach="." /> Der Ausdruck <Formel tex={t`\frac{0}{0}`} /> ist nicht definiert und nicht automatisch 0.</>),
    opt('unendlich', <>Man setzt <Formel tex="x=x_0" /> ein. Das Ergebnis ist unendlich, die Tangente ist senkrecht.</>, false, <>Die Division durch 0 ist nicht erlaubt und liefert nicht automatisch „unendlich“. Außerdem ist die Tangente an eine Parabel nie senkrecht.</>),
    opt('runden', <>Man nimmt <Formel tex="x" /> sehr nahe bei <Formel tex="x_0" nach="," /> zum Beispiel <Formel tex="x=x_0+0{,}0001" nach="," /> und rundet. Das genügt immer für ein exaktes Ergebnis.</>, false, <>Das gibt nur eine Näherung. Der exakte Wert entsteht erst durch Vereinfachen und den Grenzübergang.</>),
  ];
  return (
    <Auswahlfrage
      nummer="8"
      titel="Der Grenzübergang"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            Für <Formel tex="f(x)=x^2" /> und <Formel tex="x_0=2" /> ist <Formel tex={t`\frac{x^2-4}{x-2}=\frac{(x-2)(x+2)}{x-2}=x+2`} /> für <Formel tex={t`x\ne 2`} nach="." /> Der Grenzwert für <Formel tex={t`x\to 2`} /> ist <Formel tex="4" nach="." /> Das Schaubild des vereinfachten Terms ist eine Gerade, bei <Formel tex="x=2" /> hat sie eine Lücke. Der Grenzwert ist der Wert, dem die Gerade an der Lücke zustrebt.
          </p>
          <Bild daten={BILD_LUECKE_2} unter={<>Blau: <Formel tex="y=x+2" nach="." /> Bei <Formel tex="x=2" /> fehlt der Punkt <Formel tex="(2\,|\,4)" nach="." /></>} />
        </>
      }
    >
      <p>
        Der Differenzenquotient <Formel tex={t`\frac{f(x)-f(x_0)}{x-x_0}`} /> ist an der Stelle <Formel tex="x=x_0" /> nicht definiert. Wie berechnet man trotzdem die momentane Änderungsrate bei <Formel tex="x_0" nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Differenzialquotient exakt berechnen"
      felder={[
        { id: 'a', name: 'Ableitung von f an der Stelle 3', beschriftung: <><Formel tex="f'(3)" /></>, erwartet: EXAKT.an3 },
        { id: 'b', name: 'Ableitung von f an der Stelle 1', beschriftung: <><Formel tex="f'(1)" /></>, erwartet: EXAKT.an1 },
      ]}
      hilfen={[
        <>Schreibe den Differenzenquotienten <Formel tex={t`\frac{f(x)-f(3)}{x-3}`} /> hin. Es ist <Formel tex="f(3)=21" nach="." /></>,
        <>Zerlege den Zähler: <Formel tex={t`2x^2+x-21=2(x^2-9)+(x-3)`} nach="." /> Die Differenz <Formel tex="x^2-9" /> ist eine dritte binomische Formel.</>,
        <>Klammere <Formel tex="x-3" /> aus, kürze und bilde dann den Grenzwert für <Formel tex={t`x\to 3`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`\frac{f(x)-f(3)}{x-3}=\frac{2x^2+x-21}{x-3}=\frac{2(x-3)(x+3)+(x-3)}{x-3}`} nach="." /></>,
        <>Für <Formel tex={t`x\ne 3`} /> kann man <Formel tex="x-3" /> ausklammern und kürzen: <Formel tex="2(x+3)+1=2x+7" nach="." /></>,
        <>
          <Formel tex={t`f'(3)=\lim_{x\to 3}(2x+7)=13`} nach="." /> Für <Formel tex="x_0=1" /> geht es genauso: <Formel tex={t`\frac{2x^2+x-3}{x-1}=2x+3`} /> für <Formel tex={t`x\ne 1`} nach="," /> also <Formel tex="f'(1)=5" nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex="f(x)=2x^2+x" nach="." /> Bestimme die momentane Änderungsrate <Formel tex="f'(3)" /> und <Formel tex="f'(1)" /> exakt über den Grenzwert des Differenzenquotienten.
      </p>
    </Aufgabe>
  );
}

function Aufgabe10() {
  return (
    <Aufgabe
      nummer="10"
      titel="Geschwindigkeit beim Bremsen"
      felder={[
        { id: 'a', name: 'Geschwindigkeit zum Zeitpunkt 0 in Metern pro Sekunde', beschriftung: <><Formel tex="s'(0)" /> in <Formel tex={ms} /></>, erwartet: BREMS.v0 },
        { id: 'b', name: 'Geschwindigkeit zum Zeitpunkt 4 in Metern pro Sekunde', beschriftung: <><Formel tex="s'(4)" /> in <Formel tex={ms} /></>, erwartet: BREMS.v4 },
        { id: 'c', name: 'Zeitpunkt in Sekunden, zu dem das Fahrzeug steht', beschriftung: <>Stillstand bei <Formel tex="t_0" /> in s</>, erwartet: BREMS.stillstand },
      ]}
      hilfen={[
        <>Schreibe den Differenzenquotienten <Formel tex={t`\frac{s(t)-s(t_0)}{t-t_0}`} /> für eine beliebige Stelle <Formel tex="t_0" /> auf.</>,
        <>Der Zähler ist <Formel tex="24(t-t_0)-2(t^2-t_0^2)" nach="." /> Zerlege <Formel tex="t^2-t_0^2" /> mit der dritten binomischen Formel.</>,
        <>Nach dem Kürzen bleibt <Formel tex="24-2(t+t_0)" nach="." /> Bilde den Grenzwert für <Formel tex={t`t\to t_0`} nach="." /> Das Fahrzeug steht, wenn die Geschwindigkeit <Formel tex="0" /> ist.</>,
      ]}
      loesung={[
        <><Formel tex={t`\frac{s(t)-s(t_0)}{t-t_0}=\frac{24(t-t_0)-2(t-t_0)(t+t_0)}{t-t_0}=24-2(t+t_0)`} /> für <Formel tex={t`t\ne t_0`} nach="." /></>,
        <>Grenzübergang <Formel tex={t`t\to t_0`} nach=":" /> <Formel tex="s'(t_0)=24-4t_0" nach="." /> Damit ist <Formel tex={t`s'(0)=24\,${ms}`} /> und <Formel tex={t`s'(4)=24-16=8\,${ms}`} nach="." /></>,
        <>
          <Formel tex="s'(t_0)=0" /> gilt für <Formel tex="24-4t_0=0" nach="," /> also <Formel tex="t_0=6" nach="." /> Nach 6 Sekunden steht das Fahrzeug. Dort verläuft die Tangente waagerecht.
          <Bild
            daten={BILD_BREMS_TANGENTEN}
            unter={<>Orange: <Formel tex="K_s" nach="." /> Tangenten bei <Formel tex="t=0" /> (blau, Steigung 24), <Formel tex="t=4" /> (grün, Steigung 8) und <Formel tex="t=6" /> (schwarz, Steigung 0).</>}
          />
        </>,
      ]}
    >
      <p>
        Für den Bremsvorgang gilt <Formel tex="s(t)=24t-2t^2" /> mit <Formel tex="t" /> in Sekunden und <Formel tex="s" /> in Metern für <Formel tex={t`0\le t\le 6`} nach="." /> Bestimme den Term der Momentangeschwindigkeit <Formel tex="s'(t_0)" /> exakt, die Geschwindigkeiten bei <Formel tex="t=0" /> und <Formel tex="t=4" /> und den Zeitpunkt, zu dem das Fahrzeug steht.
      </p>
    </Aufgabe>
  );
}

function Aufgabe11() {
  return (
    <Aufgabe
      nummer="11"
      titel="Kosten und Grenzkosten"
      felder={[
        { id: 'a', name: 'mittlere Änderungsrate der Kosten von 10 bis 20 Mengeneinheiten in Euro pro Mengeneinheit', beschriftung: <>mittlere Änderungsrate von 10 bis 20 in € pro ME</>, erwartet: KOSTEN.mittel10bis20 },
        { id: 'b', name: 'momentane Änderungsrate der Kosten bei 10 Mengeneinheiten in Euro pro Mengeneinheit', beschriftung: <><Formel tex="K'(10)" /> in € pro ME</>, erwartet: KOSTEN.grenz10 },
        { id: 'c', name: 'Mehrkosten für die elfte Mengeneinheit in Euro', beschriftung: <><Formel tex="K(11)-K(10)" /> in €</>, erwartet: KOSTEN.elfte },
      ]}
      hilfen={[
        <>Die mittlere Änderungsrate ist <Formel tex={t`\frac{K(20)-K(10)}{20-10}`} nach="." /></>,
        <>Für die momentane Änderungsrate vereinfachst du <Formel tex={t`\frac{K(x)-K(10)}{x-10}`} nach="." /> Es ist <Formel tex="K(10)=110" nach="." /></>,
        <>Für die Mehrkosten der elften Mengeneinheit brauchst du <Formel tex="K(11)" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex="K(10)=110" /> und <Formel tex="K(20)=280" nach="." /> Mittlere Änderungsrate: <Formel tex={t`\frac{280-110}{10}=17`} nach="." /> Im Mittel kostet jede Mengeneinheit zwischen 10 und 20 zusätzlich 17 €.</>,
        <><Formel tex={t`\frac{K(x)-K(10)}{x-10}=\frac{0{,}5(x^2-100)+2(x-10)}{x-10}=0{,}5(x+10)+2`} /> für <Formel tex={t`x\ne 10`} nach="." /> Grenzwert für <Formel tex={t`x\to 10`} nach=":" /> <Formel tex="K'(10)=12" nach="." /></>,
        <>
          <Formel tex="K(11)=122{,}5" nach="," /> also <Formel tex="K(11)-K(10)=12{,}5" nach="." /> Die Grenzkosten <Formel tex="K'(10)=12" /> sind eine gute Näherung für die Mehrkosten der nächsten Mengeneinheit.
          <Bild daten={BILD_KOSTEN} unter={<>Orange: <Formel tex="K_K" nach="," /> blau: Sekante von <Formel tex="P" /> nach <Formel tex="Q" nach="," /> Steigung 17, schwarz gestrichelt: Tangente in <Formel tex="P" nach="," /> Steigung 12.</>} />
        </>,
      ]}
    >
      <p>
        Die Kosten für <Formel tex="x" /> Mengeneinheiten (ME) betragen <Formel tex="K(x)=0{,}5x^2+2x+40" /> Euro. Bestimme die mittlere Änderungsrate der Kosten zwischen 10 und 20 ME, die momentane Änderungsrate bei 10 ME (Grenzkosten) und die Mehrkosten der elften ME.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_KOSTEN} unter={<>Orange: <Formel tex="K_K" nach="," /> blau: Sekante von <Formel tex="P" /> nach <Formel tex="Q" nach="," /> schwarz gestrichelt: Tangente in <Formel tex="P" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>Hilfen und Lösungsweg kannst du schrittweise aufdecken. Bei den Aufgaben mit Schaubild gibt es eine Kontrolle.</p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Aufgabe2 />
      <Frage3 />
      <Aufgabe4 />
      <Aufgabe5 />
      <Frage6 />
      <Aufgabe7 />
      <Frage8 />
      <Aufgabe9 />
      <Aufgabe10 />
      <Aufgabe11 />
    </Abschnitt>
  );
}
