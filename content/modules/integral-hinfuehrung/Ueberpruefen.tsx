import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_AKKU, BILD_ERSATZ, BILD_FALLEND_BESTAND, BILD_FALLEND_RATE, BILD_PARABEL_4, BILD_PARZELLE, BILD_TONNE, BILD_WIND, BILD_ZUG } from './Bilder';
import { AKKU, ERSATZ, NAEHERUNG, PARZELLE, TONNE, WIND, ZUG } from './daten';
import { Bild } from '@/components/Messbild';

const lpm = t`\frac{\ell}{\text{min}}`;
const ms = t`\frac{\text{m}}{\text{s}}`;
const TOL2 = 0.01;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>12,75</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{1}{4}`} nach=")" /> ein, ohne Einheit. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert.
    </Hinweis>
  );
}

function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Windpark"
      felder={[
        { id: 'e1', name: 'Energie von 0 bis 3 Stunden in Megawattstunden', beschriftung: <>0 bis 3 h in MWh</>, erwartet: WIND.energien[0]! },
        { id: 'e2', name: 'Energie von 3 bis 5 Stunden in Megawattstunden', beschriftung: <>3 bis 5 h in MWh</>, erwartet: WIND.energien[1]! },
        { id: 'e3', name: 'Energie von 5 bis 9 Stunden in Megawattstunden', beschriftung: <>5 bis 9 h in MWh</>, erwartet: WIND.energien[2]! },
        { id: 'ges', name: 'Gesamtenergie in Megawattstunden', beschriftung: <>insgesamt in MWh</>, erwartet: WIND.summe },
      ]}
      hilfen={[
        <>Die Leistung ist die Änderungsrate der eingespeisten Energie. In jedem Abschnitt ist sie konstant: Energie gleich Leistung mal Dauer.</>,
        <>Die Dauer der Abschnitte ist 3 h, 2 h und 4 h. Die Einheit ist MW mal h gleich MWh.</>,
      ]}
      loesung={[
        <>Von 0 bis 3 h: <Formel tex={t`4\,\text{MW}\cdot 3\,\text{h}=12\,\text{MWh}`} nach="." /></>,
        <>Von 3 bis 5 h: <Formel tex={t`7\,\text{MW}\cdot 2\,\text{h}=14\,\text{MWh}`} nach="." /> Von 5 bis 9 h: <Formel tex={t`2\,\text{MW}\cdot 4\,\text{h}=8\,\text{MWh}`} nach="." /></>,
        <>
          Zusammen: <Formel tex={t`12+14+8=34\,\text{MWh}`} nach="." /> Die drei Rechtecke zwischen dem Schaubild der Leistung und der Zeitachse haben diese Inhalte.
          <FlaechenFigur daten={BILD_WIND} unter={<>Die Flächen <Formel tex="A_1" nach="," /> <Formel tex="A_2" /> und <Formel tex="A_3" /> sind die eingespeiste Energie.</>} />
        </>,
      ]}
    >
      <p>
        Ein Windpark speist 9 Stunden lang Strom ein. Seine Leistung beträgt von 0 bis 3 h <Formel tex={t`4\,\text{MW}`} nach="," /> von 3 bis 5 h <Formel tex={t`7\,\text{MW}`} /> und von 5 bis 9 h <Formel tex={t`2\,\text{MW}`} nach="." /> Berechne die eingespeiste Energie in den drei Abschnitten und insgesamt.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_WIND} unter={<>Leistung des Windparks in Megawatt.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Anfahrt eines Zuges"
      felder={[
        { id: 's1', name: 'Strecke während der Beschleunigung in Metern', beschriftung: <>Beschleunigung in m</>, erwartet: ZUG.wege[0]! },
        { id: 's2', name: 'Strecke mit gleichbleibender Geschwindigkeit in Metern', beschriftung: <>danach in m</>, erwartet: ZUG.wege[1]! },
        { id: 'ges', name: 'Gesamtstrecke in Metern', beschriftung: <>insgesamt in m</>, erwartet: ZUG.summe },
      ]}
      hilfen={[
        <>Die Geschwindigkeit ist die Änderungsrate des Wegs. Zerlege das Schaubild der Geschwindigkeit in ein Dreieck und ein Rechteck.</>,
        <>Während der Beschleunigung steigt die Geschwindigkeit gleichmäßig von 0 auf <Formel tex={t`24\,${ms}`} nach="." /> Der Mittelwert ist <Formel tex={t`12\,${ms}`} nach="." /></>,
      ]}
      loesung={[
        <>Beschleunigung: Dreieck mit Breite 12 s und Höhe <Formel tex={t`24\,${ms}`} nach="." /> <Formel tex={t`\frac{1}{2}\cdot 12\cdot 24=144`} nach="," /> also <Formel tex={t`144\,\text{m}`} nach="." /></>,
        <>Danach: Rechteck mit Breite 20 s und Höhe <Formel tex={t`24\,${ms}`} nach="." /> <Formel tex={t`24\cdot 20=480`} nach="," /> also <Formel tex={t`480\,\text{m}`} nach="." /></>,
        <>
          Zusammen <Formel tex={t`144+480=624\,\text{m}`} nach="." />
          <FlaechenFigur daten={BILD_ZUG} unter={<>Dreieck <Formel tex="A_1" /> und Rechteck <Formel tex="A_2" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Ein Zug beschleunigt aus dem Stand gleichmäßig in 12 Sekunden auf <Formel tex={t`24\,${ms}`} /> und fährt dann 20 Sekunden mit dieser Geschwindigkeit weiter. Bestimme die zurückgelegte Strecke während der Beschleunigung, danach und insgesamt.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_ZUG} unter={<>Geschwindigkeit des Zuges in Meter pro Sekunde.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Regentonne"
      felder={[
        { id: 'aend', name: 'zugeflossene Wassermenge in Litern', beschriftung: <>zugeflossen in l</>, erwartet: TONNE.aenderung },
        { id: 'ende', name: 'Wassermenge in der Tonne nach 30 Minuten in Litern', beschriftung: <>in der Tonne nach 30 min in l</>, erwartet: TONNE.ende },
      ]}
      hilfen={[
        <>Berechne zuerst die zugeflossene Menge, Rechteck und Trapez. Danach kommt der Anfangsbestand dazu.</>,
        <>Im zweiten Abschnitt fällt die Rate gleichmäßig von 3 auf 1. Verwende den Mittelwert der beiden Randwerte.</>,
      ]}
      loesung={[
        <>Erste 10 Minuten: <Formel tex={t`3\,${lpm}\cdot 10\,\text{min}=30\,\ell`} nach="." /></>,
        <>Danach 20 Minuten mit fallender Rate: <Formel tex={t`\frac{3+1}{2}\,${lpm}\cdot 20\,\text{min}=40\,\ell`} nach="." /> Zugeflossen sind <Formel tex={t`30+40=70\,\ell`} nach="." /></>,
        <>
          Bestand nach 30 Minuten: <Formel tex={t`35+70=105\,\ell`} nach="." />
          <FlaechenFigur daten={BILD_TONNE} unter={<>Rechteck <Formel tex="A_1" /> und Trapez <Formel tex="A_2" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        In einer Regentonne sind zu Beginn <Formel tex={t`35\,\ell`} nach="." /> In den ersten 10 Minuten fließen <Formel tex={t`3\,${lpm}`} /> zu, danach nimmt die Zuflussrate gleichmäßig auf <Formel tex={t`1\,${lpm}`} /> nach 30 Minuten ab. Bestimme, wie viel Wasser in den 30 Minuten zufließt und wie viel Wasser dann in der Tonne ist.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_TONNE} unter={<>Zuflussrate der Regentonne in Liter pro Minute.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Batteriespeicher"
      felder={[
        { id: 'aend', name: 'Änderung der gespeicherten Energie in Kilowattstunden', beschriftung: <>Änderung in kWh</>, erwartet: AKKU.aenderung },
        { id: 'ende', name: 'Energie im Speicher am Ende in Kilowattstunden', beschriftung: <>Energie am Ende in kWh</>, erwartet: AKKU.ende },
        { id: 'min', name: 'kleinste Energie im Speicher in Kilowattstunden', beschriftung: <>kleinste Energie in kWh</>, erwartet: AKKU.minimum },
      ]}
      hilfen={[
        <>Flächen oberhalb der Zeitachse zählen positiv, Flächen unterhalb negativ. Berechne die drei Flächen einzeln.</>,
        <>Für die kleinste Energie überlegst du, wann der Bestand aufhört zu sinken: Das ist, wenn die Leistung nicht mehr negativ ist.</>,
      ]}
      loesung={[
        <>Laden: <Formel tex={t`5\cdot 2=10`} nach="." /> Entladen: <Formel tex={t`-4\cdot 3=-12`} nach="." /> Laden: <Formel tex={t`2\cdot 2=4`} nach="." /></>,
        <>Änderung: <Formel tex={t`10-12+4=2\,\text{kWh}`} nach="." /> Energie am Ende: <Formel tex={t`12+2=14\,\text{kWh}`} nach="." /></>,
        <>
          Der Bestand sinkt, solange die Leistung negativ ist, also bis <Formel tex="t=5" nach="." /> Dort ist er <Formel tex={t`12+10-12=10\,\text{kWh}`} nach="." /> Danach steigt er wieder.
          <FlaechenFigur daten={BILD_AKKU} unter={<>Blau: Laden, rosa: Entladen.</>} />
        </>,
      ]}
    >
      <p>
        Ein Batteriespeicher enthält zu Beginn <Formel tex={t`12\,\text{kWh}`} nach="." /> Seine Leistung ist von 0 bis 2 h gleich <Formel tex={t`5\,\text{kW}`} /> (Laden), von 2 bis 5 h gleich <Formel tex={t`-4\,\text{kW}`} /> (Entladen) und von 5 bis 7 h gleich <Formel tex={t`2\,\text{kW}`} nach="." /> Bestimme die Änderung der gespeicherten Energie in den 7 Stunden, die Energie am Ende und die kleinste Energie im Speicher.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AKKU} unter={<>Leistung des Batteriespeichers in Kilowatt.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage5() {
  const optionen = [
    opt('energie', <>Die in diesen 4 Stunden abgegebene Wärmeenergie in kWh.</>, true, <>Richtig.</>),
    opt('mittel', <>Die mittlere Heizleistung in kW.</>, false, <>Die Einheit passt nicht: Die Fläche hat die Einheit kW mal h gleich kWh. Eine Leistung in kW erhältst du erst, wenn du die Fläche durch die Dauer teilst.</>),
    opt('maximal', <>Die größte Heizleistung in kW.</>, false, <>Die größte Leistung liest du als höchsten Punkt des Schaubilds ab, nicht als Flächeninhalt. Die Einheit der Fläche ist kWh.</>),
    opt('dauer', <>Die Dauer des Heizens in h.</>, false, <>Die Dauer ist die Breite der Fläche. Der Flächeninhalt entsteht aus Breite mal Höhe, hier Stunden mal Kilowatt.</>),
  ];
  return (
    <Auswahlfrage
      nummer="5"
      titel="Fläche deuten"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <p>
          Die Heizleistung ist die Änderungsrate der abgegebenen Energie. Die Fläche zwischen dem Schaubild und der Zeitachse ist Leistung mal Zeit, also <Formel tex={t`\text{kW}\cdot\text{h}=\text{kWh}`} nach="." /> Die Einheit der Fläche verrät, was sie bedeutet.
        </p>
      }
    >
      <p>
        Das Schaubild zeigt die Heizleistung einer Anlage in kW über der Uhrzeit. Was bedeutet der Flächeninhalt zwischen dem Schaubild und der Zeitachse von 8 Uhr bis 12 Uhr?
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Streifen unter einer Parabel"
      felder={[
        { id: 'u4', name: 'Untersumme mit 4 Streifen', beschriftung: <>Untersumme, <Formel tex="n=4" /></>, erwartet: NAEHERUNG.n4.unter },
        { id: 'o4', name: 'Obersumme mit 4 Streifen', beschriftung: <>Obersumme, <Formel tex="n=4" /></>, erwartet: NAEHERUNG.n4.ober },
        { id: 'u8', name: 'Untersumme mit 8 Streifen', beschriftung: <>Untersumme, <Formel tex="n=8" /></>, erwartet: NAEHERUNG.n8.unter, toleranz: TOL2 },
        { id: 'o8', name: 'Obersumme mit 8 Streifen', beschriftung: <>Obersumme, <Formel tex="n=8" /></>, erwartet: NAEHERUNG.n8.ober, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Die Funktion steigt auf dem ganzen Intervall. Der kleinste Wert eines Streifens liegt deshalb am linken Rand, der größte am rechten.</>,
        <>Bei 4 Streifen ist die Breite 1. Berechne <Formel tex="f(0)" nach="," /> <Formel tex="f(1)" nach="," /> <Formel tex="f(2)" nach="," /> <Formel tex="f(3)" /> und <Formel tex="f(4)" nach="." /></>,
        <>Bei 8 Streifen ist die Breite <Formel tex={t`\frac{1}{2}`} nach="." /> Du brauchst zusätzlich die Funktionswerte bei <Formel tex="0{,}5" nach="," /> <Formel tex="1{,}5" /> und so weiter.</>,
      ]}
      loesung={[
        <>Werte: <Formel tex="f(0)=1" nach="," /> <Formel tex="f(1)=1{,}5" nach="," /> <Formel tex="f(2)=3" nach="," /> <Formel tex="f(3)=5{,}5" nach="," /> <Formel tex="f(4)=9" nach="." /></>,
        <>Untersumme: <Formel tex={t`1\cdot(1+1{,}5+3+5{,}5)=11`} nach="." /> Obersumme: <Formel tex={t`1\cdot(1{,}5+3+5{,}5+9)=19`} nach="." /></>,
        <>Bei 8 Streifen der Breite <Formel tex="0{,}5" /> sind die linken Werte <Formel tex="1" nach="," /> <Formel tex="1{,}125" nach="," /> <Formel tex="1{,}5" nach="," /> <Formel tex="2{,}125" nach="," /> <Formel tex="3" nach="," /> <Formel tex="4{,}125" nach="," /> <Formel tex="5{,}5" /> und <Formel tex="7{,}125" nach="." /> Ihre Summe ist <Formel tex="25{,}5" nach="," /> mal <Formel tex="0{,}5" /> ergibt die Untersumme <Formel tex="12{,}75" nach="." /></>,
        <>
          Die rechten Werte sind jeweils der nächste Wert, am Ende kommt <Formel tex="9" /> dazu: Summe <Formel tex="33{,}5" nach="," /> mal <Formel tex="0{,}5" /> ergibt die Obersumme <Formel tex="16{,}75" nach="." /> Der Flächeninhalt liegt in beiden Fällen dazwischen, mit mehr Streifen enger.
          <FlaechenFigur daten={BILD_PARABEL_4(4, true, true)} unter={<>Vier Streifen: blau die Untersumme, gestrichelt die Obersumme.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=\frac{1}{2}x^2+1`} nach="." /> Bestimme die Untersumme und die Obersumme für die Fläche zwischen <Formel tex="K_f" /> und der x-Achse über dem Intervall <Formel tex="[0;\,4]" /> mit 4 und mit 8 Streifen gleicher Breite.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_PARABEL_4(4, true, true)} unter={<>Vier Streifen: blau die Untersumme, gestrichelt die Obersumme.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage7() {
  const optionen = [
    opt('naeher', <>Mit mehr Streifen liegen Untersumme und Obersumme näher beieinander, der Flächeninhalt liegt immer dazwischen.</>, true, <>Richtig.</>),
    opt('gleich', <>Untersumme und Obersumme sind bei jeder Funktion gleich groß.</>, false, <>Nur bei einer konstanten Funktion. Sonst gibt es in jedem Streifen verschiedene Funktionswerte, und die Obersumme ist größer.</>),
    opt('kleiner', <>Mit mehr Streifen wird die Untersumme immer kleiner.</>, false, <>Es ist umgekehrt: Mit schmaleren Streifen schmiegen sich die Rechtecke besser an. Die Untersumme wird größer, die Obersumme kleiner.</>),
    opt('genau', <>Die Untersumme ist immer genauer als die Obersumme.</>, false, <>Keine von beiden ist grundsätzlich besser. Beide weichen vom Flächeninhalt ab, auf verschiedenen Seiten.</>),
  ];
  return (
    <Auswahlfrage
      nummer="7"
      titel="Untersumme und Obersumme"
      optionen={platziere(optionen, 0)}
      erklaerung={
        <p>
          Die Rechtecke der Untersumme liegen in der Fläche, die der Obersumme überdecken sie. Der Flächeninhalt liegt also dazwischen. Verkleinert man die Streifenbreite, sinkt der Unterschied. Bei einer steigenden Funktion ist er Streifenbreite mal Höhenunterschied, er halbiert sich bei doppelter Streifenzahl.
        </p>
      }
    >
      <p>Welche Aussage über Untersumme und Obersumme einer Fläche mit gekrümmtem Rand ist richtig?</p>
    </Auswahlfrage>
  );
}

function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Parzelle vermessen"
      felder={[
        { id: 'a', name: 'Flächeninhalt der Parzelle in Quadratmetern', beschriftung: <>Flächeninhalt in m²</>, erwartet: PARZELLE.flaeche },
        { id: 'k', name: 'Kaufpreis in Euro', beschriftung: <>Kaufpreis in €</>, erwartet: PARZELLE.kosten },
      ]}
      hilfen={[
        <>Verbinde die Messpunkte geradlinig. Zwischen zwei Messstellen entsteht ein Trapez mit den Breiten als parallelen Seiten und dem Abstand 10 m als Höhe.</>,
        <>Das Trapez zwischen den Messstellen 0 und 10 hat den Flächeninhalt <Formel tex={t`\frac{14+20}{2}\cdot 10=170`} nach="." /></>,
      ]}
      loesung={[
        <>Die fünf Trapeze haben die Flächeninhalte <Formel tex="170" nach="," /> <Formel tex="230" nach="," /> <Formel tex="275" nach="," /> <Formel tex="265" /> und <Formel tex="200" nach="," /> jeweils in <Formel tex={t`\text{m}^2`} nach="." /></>,
        <>Zusammen <Formel tex={t`170+230+275+265+200=1140\,\text{m}^2`} nach="." /></>,
        <>
          Kaufpreis: <Formel tex={t`1140\cdot 85=96\,900`} /> Euro. Das Ergebnis ist eine Näherung, weil die Parzellengrenze zwischen den Messstellen nicht gerade sein muss.
          <FlaechenFigur daten={BILD_PARZELLE} unter={<>Fünf Trapeze zwischen den Messpunkten.</>} />
        </>,
      ]}
    >
      <p>
        Eine Parzelle wurde vermessen. Ihre Breite wurde im Abstand von 10 m gemessen:
      </p>
      <table className="tabelle tabelle-kompakt">
        <caption>Breite der Parzelle</caption>
        <thead>
          <tr>
            <th scope="col">Stelle in m</th>
            {PARZELLE.breiten.map((_, i) => <td key={i}>{i * 10}</td>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Breite in m</th>
            {PARZELLE.breiten.map((b, i) => <td key={i}>{b}</td>)}
          </tr>
        </tbody>
      </table>
      <p>
        Bestimme näherungsweise den Flächeninhalt der Parzelle, indem du die Messpunkte geradlinig verbindest und mit Trapezen rechnest. Berechne damit den Kaufpreis bei <Formel tex={t`85`} /> Euro pro Quadratmeter.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_PARZELLE} unter={<>Breite der Parzelle in Meter an den sechs Messstellen.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Mittlere Zuflussrate"
      felder={[
        { id: 'ges', name: 'insgesamt zugeflossene Menge in Litern', beschriftung: <>zugeflossen in l</>, erwartet: ERSATZ.summe },
        { id: 'rate', name: 'Ersatzrate in Litern pro Stunde', beschriftung: <>Ersatzrate in l/h</>, erwartet: ERSATZ.rate, toleranz: TOL2 },
      ]}
      hilfen={[
        <>Berechne zuerst die Menge in jedem der drei Abschnitte und addiere sie. Die Ersatzrate ist die Menge geteilt durch die Gesamtdauer.</>,
        <>Der Mittelwert der drei Raten, <Formel tex={t`\frac{10+20+5}{3}`} nach="," /> ist nicht richtig, weil die Abschnitte verschieden lang sind. Länger andauernde Raten zählen mehr.</>,
      ]}
      loesung={[
        <>Abschnitte: <Formel tex={t`10\cdot 2=20`} nach="," /> <Formel tex={t`20\cdot 4=80`} /> und <Formel tex={t`5\cdot 2=10`} nach="." /> Zusammen <Formel tex={t`110\,\ell`} nach="." /></>,
        <>
          Ersatzrate: <Formel tex={t`\frac{110}{8}=13{,}75`} nach="," /> also <Formel tex={t`13{,}75\,\frac{\ell}{\text{h}}`} nach="." /> Ein Rechteck der Höhe <Formel tex="13{,}75" /> und der Breite 8 hat denselben Flächeninhalt wie die drei Flächen zusammen.
          <FlaechenFigur daten={BILD_ERSATZ} unter={<>Gestrichelt: Rechteck der Ersatzrate.</>} />
        </>,
      ]}
    >
      <p>
        Die Zuflussrate eines Tanks beträgt von 0 bis 2 h <Formel tex={t`10\,\frac{\ell}{\text{h}}`} nach="," /> von 2 bis 6 h <Formel tex={t`20\,\frac{\ell}{\text{h}}`} /> und von 6 bis 8 h <Formel tex={t`5\,\frac{\ell}{\text{h}}`} nach="." /> Bestimme die insgesamt zugeflossene Menge. Bestimme außerdem die gleichbleibende Rate, mit der in 8 Stunden dieselbe Menge zugeflossen wäre.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_ERSATZ} unter={<>Zuflussrate des Tanks in Liter pro Stunde.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage10() {
  const optionen = [
    opt('rechteck', <>Bei konstanter Rate ist Rate mal Dauer die Änderung und zugleich der Flächeninhalt eines Rechtecks. Bei wechselnder Rate zerlegt man in Abschnitte und addiert.</>, true, <>Richtig.</>),
    opt('einheit', <>Weil die Einheit der Fläche immer dieselbe ist wie die Einheit des Bestands.</>, false, <>Das ist eine Folge, keine Begründung. Die Einheiten passen, weil Rate mal Zeit gerechnet wird. Der Grund liegt in dieser Rechnung.</>),
    opt('gross', <>Weil die Fläche größer wird, wenn die Rate größer ist.</>, false, <>Das stimmt, begründet aber nicht, dass der Flächeninhalt genau die Änderung ist. Dafür braucht man Rate mal Dauer.</>),
    opt('jeder', <>Weil jedes Schaubild eine Fläche zur Zeitachse hat.</>, false, <>Eine Fläche gibt es immer. Dass sie die Änderung des Bestands angibt, folgt erst aus der Rechnung Rate mal Dauer.</>),
  ];
  return (
    <Auswahlfrage
      nummer="10"
      titel="Begründen"
      optionen={platziere(optionen, 3)}
      erklaerung={
        <p>
          Eine Änderungsrate sagt, um wie viel sich der Bestand pro Zeiteinheit ändert. Bleibt sie konstant, multipliziert man sie mit der Dauer. Das ist die Rechtecksfläche zwischen dem Schaubild und der Zeitachse. Ändert sich die Rate, zerlegt man die Zeit in Abschnitte, in denen man mit Rechtecken, Trapezen oder Dreiecken rechnen kann, und addiert die Änderungen. Liegt eine Fläche unterhalb der Zeitachse, ist die Rate negativ und die Änderung auch.
        </p>
      }
    >
      <p>Welche Begründung erklärt, warum der Flächeninhalt zwischen dem Schaubild der Änderungsrate und der Zeitachse die Änderung des Bestands angibt?</p>
    </Auswahlfrage>
  );
}

function Frage11() {
  const optionen = [
    opt('langsamer', <>Das Becken füllt sich weiter, aber immer langsamer.</>, true, <>Richtig.</>),
    opt('leer', <>Das Becken leert sich, weil das Schaubild fällt.</>, false, <>Das Schaubild zeigt die Rate, nicht die Wassermenge. Die Rate bleibt positiv, also kommt Wasser dazu. Leer würde sich das Becken nur bei negativer Rate.</>),
    opt('schneller', <>Das Becken füllt sich immer schneller.</>, false, <>Die Rate fällt, es kommt also pro Minute weniger Wasser dazu als vorher.</>),
    opt('klein', <>Der Bestand am Ende ist kleiner als am Anfang.</>, false, <>Solange die Rate positiv ist, nimmt der Bestand zu. Er ist am Ende größer als am Anfang.</>),
  ];
  return (
    <Auswahlfrage
      nummer="11"
      titel="Fallende Rate"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Ein fallendes Schaubild der Zuflussrate bedeutet, dass pro Minute weniger Wasser zufließt. Da die Rate positiv bleibt, steigt der Bestand weiter, die Bestandskurve wird nur flacher.
          </p>
          <Bild
            daten={BILD_FALLEND_BESTAND}
            unter={<>Bestand bei fallender, aber positiver Zuflussrate: Die Kurve steigt immer, wird aber flacher.</>}
          />
        </>
      }
    >
      <p>
        Das Schaubild zeigt die Zuflussrate eines Beckens. Sie fällt von <Formel tex={t`20\,${lpm}`} /> auf <Formel tex={t`8\,${lpm}`} nach="," /> bleibt aber immer positiv. Welche Aussage über das Becken stimmt?
      </p>
      <FlaechenFigur daten={BILD_FALLEND_RATE} unter={<>Zuflussrate eines Beckens in Liter pro Minute.</>} />
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Die Aufgaben 1 bis 4 gehören zum Bestand aus der Änderungsrate, 5 bis 7 zu Flächen und Näherungen, 8 und 9 zu Anwendungen, 10 und 11 zum Begründen und Deuten.
      </p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Aufgabe2 />
      <Aufgabe3 />
      <Aufgabe4 />
      <Frage5 />
      <Aufgabe6 />
      <Frage7 />
      <Aufgabe8 />
      <Aufgabe9 />
      <Frage10 />
      <Frage11 />
    </Abschnitt>
  );
}
