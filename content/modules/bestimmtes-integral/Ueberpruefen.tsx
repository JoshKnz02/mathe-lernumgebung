import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { obersumme, streifen, untersumme, zahl } from '@/lib/flaeche';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_BESTAND_RICHTIG, BILD_COS_AUFGABE, BILD_KANDIDAT_A, BILD_KANDIDAT_B, BILD_KANDIDAT_C, BILD_SPEICHER_FLAECHEN, BILD_SPEICHER_RATE, BILD_SUMMEN_4, BILD_TABELLE_10, BILD_UNGERADE, BILD_ZICKZACK } from './Bilder';
import { KOSINUS, REGELN, SPEICHER, SUMMEN, TABELLE, UNGERADE, ZICKZACK, WEG } from './daten';

const TOL = 0.01;
const tz = (x: number, n = 3) => zahl(x, n).replace(',', '{,}').replace('−', '-');
const tw = (n: number) => {
  const z = streifen(TABELLE.f, 0, 5, n);
  return [untersumme(z), obersumme(z)] as const;
};
const mh = t`\frac{\text{m}^3}{\text{h}}`;
const integral = (von: string, bis: string, f: string) => t`\int_{${von}}^{${bis}} ${f}\,\mathrm{d}x`;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>8,91</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{1}{4}`} nach=")" /> ein, ohne Einheit. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert.
    </Hinweis>
  );
}

function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Summenschreibweise"
      felder={[
        { id: 'dx', name: 'Streifenbreite Delta x', beschriftung: <><Formel tex={t`\Delta x`} /></>, erwartet: SUMMEN.dx },
        { id: 'x2', name: 'Teilungsstelle x2', beschriftung: <><Formel tex={t`x_2`} /></>, erwartet: SUMMEN.x2 },
        { id: 'u', name: 'Untersumme U4', beschriftung: <><Formel tex={t`U_4`} /></>, erwartet: SUMMEN.unter, toleranz: TOL },
        { id: 'o', name: 'Obersumme O4', beschriftung: <><Formel tex={t`O_4`} /></>, erwartet: SUMMEN.ober, toleranz: TOL },
      ]}
      hilfen={[
        <>Die Streifenbreite ist <Formel tex={t`\Delta x=\frac{b-a}{n}`} nach="," /> die Teilungsstellen sind <Formel tex={t`x_i=a+i\cdot\Delta x`} nach="." /></>,
        <>Die Funktion steigt. Für die Untersumme nimmst du die Funktionswerte an den Stellen <Formel tex={t`x_0`} nach="," /> <Formel tex={t`x_1`} nach="," /> <Formel tex={t`x_2`} /> und <Formel tex={t`x_3`} nach="," /> für die Obersumme die an den Stellen <Formel tex={t`x_1`} /> bis <Formel tex={t`x_4`} nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`\Delta x=\frac{3-0}{4}=0{,}75`} nach="." /> Die Teilungsstellen sind <Formel tex="0" nach="," /> <Formel tex="0{,}75" nach="," /> <Formel tex="1{,}5" nach="," /> <Formel tex="2{,}25" /> und <Formel tex="3" nach="," /> also <Formel tex={t`x_2=1{,}5`} nach="." /></>,
        <>Funktionswerte: <Formel tex="f(0)=1" nach="," /> <Formel tex="f(0{,}75)=1{,}5625" nach="," /> <Formel tex="f(1{,}5)=3{,}25" nach="," /> <Formel tex="f(2{,}25)=6{,}0625" nach="," /> <Formel tex="f(3)=10" nach="." /></>,
        <>
          Für die Untersumme gilt <Formel tex={t`U_4=\sum_{i=1}^{4} f(x_{i-1})\cdot\Delta x`} nach="." /> Die Summe der Funktionswerte ist
          <Formel anzeige tex={t`1+1{,}5625`} />
          <Formel anzeige tex={t`{}+3{,}25+6{,}0625`} />
          <Formel anzeige tex={t`{}=11{,}875`} nach="," />
          also
          <Formel anzeige tex={t`U_4=11{,}875`} />
          <Formel anzeige tex={t`{}\cdot 0{,}75`} />
          <Formel anzeige tex={t`{}=8{,}90625`} nach="." />
          Für die Obersumme ist die Summe der Funktionswerte <Formel tex={t`1{,}5625+3{,}25+6{,}0625+10=20{,}875`} nach="," /> also
          <Formel anzeige tex={t`O_4=20{,}875`} />
          <Formel anzeige tex={t`{}\cdot 0{,}75`} />
          <Formel anzeige tex={t`{}=15{,}65625`} nach="." />
          Das Integral liegt zwischen beiden Werten.
          <FlaechenFigur daten={BILD_SUMMEN_4} unter={<>Vier Streifen: gefüllt die Untersumme, gestrichelt die Obersumme.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=x^2+1`} /> auf <Formel tex="[0;\,3]" nach="." /> Das Intervall wird in <Formel tex="n=4" /> gleich breite Streifen zerlegt. Bestimme die Streifenbreite <Formel tex={t`\Delta x`} nach="," /> die Teilungsstelle <Formel tex={t`x_2`} /> und die Summen <Formel tex={t`U_4`} /> und <Formel tex={t`O_4`} nach="." />
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_SUMMEN_4} unter={<>Vier Streifen von <Formel tex={t`f(x)=x^2+1`} nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe2() {
  const [u10, o10] = tw(10);
  const [u100, o100] = tw(100);
  const [u1000, o1000] = tw(1000);
  return (
    <Aufgabe
      nummer="2"
      titel="Vom Grenzwert zum Wert des Integrals"
      felder={[
        { id: 'wert', name: 'Wert des Integrals', beschriftung: <>Wert des Integrals</>, erwartet: TABELLE.exakt, toleranz: 0.05 },
        { id: 'diff', name: 'Unterschied O100 minus U100', beschriftung: <><Formel tex={t`O_{100}-U_{100}`} /></>, erwartet: TABELLE.unterschied100, toleranz: TOL },
        { id: 'n', name: 'kleinste Anzahl n der Streifen', beschriftung: <>kleinstes <Formel tex="n" /></>, erwartet: TABELLE.nGrenze },
      ]}
      hilfen={[
        <>Das Integral ist der gemeinsame Grenzwert von Untersumme und Obersumme. Lies ab, welcher Zahl die Werte in der Tabelle zustreben.</>,
        <>Bei einer steigenden Funktion gilt <Formel tex={t`O_n-U_n=\Delta x\cdot\bigl(f(b)-f(a)\bigr)`} nach="." /></>,
        <>Für den Unterschied bei <Formel tex="n=100" /> ist <Formel tex={t`\Delta x=0{,}05`} nach="." /> Für die letzte Frage löst du <Formel tex={t`\frac{5}{n}\cdot 7{,}5\le 0{,}01`} nach="." /></>,
      ]}
      loesung={[
        <>Die Tabellenwerte laufen auf <Formel tex="17{,}5" /> zu: Die Untersumme wächst von unten, die Obersumme sinkt von oben. Also ist <Formel tex={t`\int_{0}^{5}\left(0{,}3x^2+1\right)\mathrm{d}x=17{,}5`} nach="." /></>,
        <>Es gilt <Formel tex="f(5)-f(0)=8{,}5-1=7{,}5" /> und <Formel tex={t`\Delta x=\frac{5}{100}=0{,}05`} nach="," /> also <Formel tex={t`O_{100}-U_{100}=0{,}05\cdot 7{,}5=0{,}375`} nach="." /></>,
        <>
          Aus <Formel tex={t`\frac{5}{n}\cdot 7{,}5\le 0{,}01`} /> folgt <Formel tex={t`n\ge\frac{37{,}5}{0{,}01}=3750`} nach="." /> Das kleinste solche <Formel tex="n" /> ist <Formel tex="3750" nach="." />
          <FlaechenFigur daten={BILD_TABELLE_10} unter={<>Zehn Streifen zur Veranschaulichung.</>} />
        </>,
      ]}
    >
      <p>
        Für die steigende Funktion <Formel tex={t`h(x)=0{,}3x^2+1`} /> auf <Formel tex="[0;\,5]" /> zeigt die Tabelle die Untersumme und die Obersumme bei verschieden vielen Streifen.
      </p>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Untersumme und Obersumme von <Formel tex="h" /></caption>
        <thead>
          <tr>
            <th scope="col"><Formel tex="n" /></th>
            <th scope="col"><Formel tex={t`U_n`} /></th>
            <th scope="col"><Formel tex={t`O_n`} /></th>
          </tr>
        </thead>
        <tbody>
          <tr><th scope="row">10</th><td>{zahl(u10, 3)}</td><td>{zahl(o10, 3)}</td></tr>
          <tr><th scope="row">100</th><td>{zahl(u100, 3)}</td><td>{zahl(o100, 3)}</td></tr>
          <tr><th scope="row">1000</th><td>{zahl(u1000, 3)}</td><td>{zahl(o1000, 3)}</td></tr>
        </tbody>
      </table>
      <p>
        Bestimme den Wert des Integrals <Formel tex={t`\int_{0}^{5} h(x)\,\mathrm{d}x`} nach="." /> Berechne außerdem den Unterschied <Formel tex={t`O_{100}-U_{100}`} /> und bestimme die kleinste Anzahl <Formel tex="n" /> von Streifen, für die <Formel tex={t`O_n-U_n\le 0{,}01`} /> gilt.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_TABELLE_10} unter={<>Zehn Streifen von <Formel tex="h" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Integral und Flächeninhalt"
      felder={[
        { id: 'i1', name: 'Integral von 0 bis 6', beschriftung: <><Formel tex={integral('0', '6', 'f(x)')} /></>, erwartet: 9 },
        { id: 'i2', name: 'Integral von 6 bis 10', beschriftung: <><Formel tex={integral('6', '10', 'f(x)')} /></>, erwartet: -4 },
        { id: 'i3', name: 'Integral von 0 bis 10', beschriftung: <><Formel tex={integral('0', '10', 'f(x)')} /></>, erwartet: ZICKZACK.oben - ZICKZACK.unten },
        { id: 'i4', name: 'Integral von 10 bis 0', beschriftung: <><Formel tex={integral('10', '0', 'f(x)')} /></>, erwartet: -(ZICKZACK.oben - ZICKZACK.unten) },
        { id: 'fl', name: 'gesamter Flächeninhalt zwischen dem Schaubild und der x-Achse', beschriftung: <>Flächeninhalt</>, erwartet: ZICKZACK.oben + ZICKZACK.unten },
      ]}
      hilfen={[
        <>Flächen oberhalb der x-Achse zählen beim Integral positiv, Flächen unterhalb negativ. Der Flächeninhalt zählt alle Flächen positiv.</>,
        <>Beim Vertauschen der Grenzen ändert sich das Vorzeichen.</>,
      ]}
      loesung={[
        <><Formel tex={integral('0', '6', 'f(x)') + '=9'} nach="," /> denn die Fläche über der x-Achse hat den Inhalt <Formel tex="9" nach="." /> <Formel tex={integral('6', '10', 'f(x)') + '=-4'} nach="," /> denn die Fläche unter der x-Achse hat den Inhalt <Formel tex="4" nach="." /></>,
        <>Zerlegen: <Formel tex={integral('0', '10', 'f(x)') + '=9+(-4)=5'} nach="." /> Vertauschen: <Formel tex={integral('10', '0', 'f(x)') + '=-5'} nach="." /></>,
        <>
          Der Flächeninhalt zählt beide Flächen positiv: <Formel tex="9+4=13" nach="." />
          <FlaechenFigur daten={BILD_ZICKZACK} unter={<>Blau: Fläche über der x-Achse, rosa: Fläche darunter.</>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild einer stetigen Funktion <Formel tex="f" /> verläuft von <Formel tex="x=0" /> bis <Formel tex="x=10" nach="." /> Die Fläche <Formel tex={t`A_1`} /> zwischen <Formel tex="K_f" /> und der x-Achse liegt oberhalb der x-Achse und hat den Inhalt <Formel tex="9" nach="," /> die Fläche <Formel tex={t`A_2`} /> liegt unterhalb und hat den Inhalt <Formel tex="4" nach="." /> Bestimme die Werte der fünf Größen.
      </p>
      <FlaechenFigur daten={BILD_ZICKZACK} unter={<>Schaubild von <Formel tex="f" /> mit den Flächen <Formel tex={t`A_1`} /> und <Formel tex={t`A_2`} nach="." /> Die Grenze zwischen beiden liegt bei <Formel tex="x=6" nach="." /></>} />
    </Aufgabe>
  );
}

function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Mit Integralen rechnen"
      felder={[
        { id: 'a', name: 'Integral von f von 0 bis 5', beschriftung: <><Formel tex={integral('0', '5', 'f(x)')} /></>, erwartet: REGELN.i05 },
        { id: 'b', name: 'Integral von f von 5 bis 0', beschriftung: <><Formel tex={integral('5', '0', 'f(x)')} /></>, erwartet: -REGELN.i05 },
        { id: 'c', name: 'Integral von 2 f von 0 bis 5', beschriftung: <><Formel tex={integral('0', '5', '2f(x)')} /></>, erwartet: REGELN.zweif },
        { id: 'd', name: 'Integral von f plus g von 0 bis 5', beschriftung: <><Formel tex={integral('0', '5', '\\bigl(f(x)+g(x)\\bigr)')} /></>, erwartet: REGELN.summe },
        { id: 'e', name: 'Integral von 3 f minus g von 0 bis 5', beschriftung: <><Formel tex={integral('0', '5', '\\bigl(3f(x)-g(x)\\bigr)')} /></>, erwartet: REGELN.kombi },
        { id: 'f', name: 'Integral von f von 2 bis 2', beschriftung: <><Formel tex={integral('2', '2', 'f(x)')} /></>, erwartet: 0 },
      ]}
      hilfen={[
        <>Zerlege <Formel tex={integral('0', '5', 'f(x)')} /> an der Stelle <Formel tex="2" nach="." /></>,
        <>Konstante Faktoren darf man vor das Integral ziehen, Summen und Differenzen darf man gliedweise integrieren.</>,
      ]}
      loesung={[
        <>Zerlegen: <Formel tex={integral('0', '5', 'f(x)') + '=3+4{,}5=7{,}5'} nach="." /> Vertauschen: <Formel tex={integral('5', '0', 'f(x)') + '=-7{,}5'} nach="." /></>,
        <>Faktor: <Formel tex={integral('0', '5', '2f(x)') + '=2\\cdot 7{,}5=15'} nach="." /> Summe: <Formel tex={integral('0', '5', '\\bigl(f(x)+g(x)\\bigr)') + '=7{,}5+2=9{,}5'} nach="." /></>,
        <>Linearität: <Formel tex={integral('0', '5', '\\bigl(3f(x)-g(x)\\bigr)') + '=3\\cdot 7{,}5-2=20{,}5'} nach="." /> Gleiche Grenzen: <Formel tex={integral('2', '2', 'f(x)') + '=0'} nach="," /> weil die Fläche keine Breite hat.</>,
      ]}
    >
      <p>
        Von zwei stetigen Funktionen <Formel tex="f" /> und <Formel tex="g" /> ist bekannt: <Formel tex={integral('0', '2', 'f(x)') + '=3'} nach="," /> <Formel tex={integral('2', '5', 'f(x)') + '=4{,}5'} /> und <Formel tex={integral('0', '5', 'g(x)') + '=2'} nach="." /> Bestimme die Werte der sechs Integrale.
      </p>
    </Aufgabe>
  );
}

function Frage5() {
  const optionen = [
    opt('null', <><Formel tex="0" /></>, true, <>Richtig.</>),
    opt('zwoelf', <><Formel tex="12" /></>, false, <>Das wäre der Wert bei einer Funktion, deren Schaubild symmetrisch zur y-Achse ist. Hier liegt die linke Fläche aber unter der x-Achse und zählt negativ.</>),
    opt('sechs', <><Formel tex="6" /></>, false, <>Das ist nur der Wert der rechten Hälfte. Die linke Hälfte kommt noch dazu, und sie ist negativ.</>),
    opt('minus', <><Formel tex="-6" /></>, false, <>Das ist nur der Wert der linken Hälfte. Die rechte Hälfte mit <Formel tex="+6" /> kommt dazu.</>),
  ];
  return (
    <Auswahlfrage
      nummer="5"
      titel="Symmetrische Grenzen"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Ein punktsymmetrisches Schaubild hat links der y-Achse dieselbe Fläche wie rechts, nur unterhalb der x-Achse. Sie zählt negativ und hebt die rechte Fläche auf: <Formel tex={integral('-3', '3', 'f(x)') + '=-6+6=0'} nach="." />
          </p>
          <FlaechenFigur daten={BILD_UNGERADE} unter={<>Eine punktsymmetrische Funktion: links <Formel tex="-6" nach="," /> rechts <Formel tex="+6" nach="." /></>} />
        </>
      }
    >
      <p>
        Die Funktion <Formel tex="f" /> ist stetig und ihr Schaubild ist punktsymmetrisch zum Ursprung. Es gilt <Formel tex={integral('0', '3', 'f(x)') + `=${UNGERADE.i03}`} nach="." /> Welchen Wert hat <Formel tex={integral('-3', '3', 'f(x)')} nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Flächenbilanz beim Speicher"
      felder={[
        { id: 'bilanz', name: 'Bilanz von 0 bis 9 Stunden in Kubikmetern', beschriftung: <>Bilanz in <Formel tex={t`\text{m}^3`} /></>, erwartet: SPEICHER.bilanz },
        { id: 'ende', name: 'Wassermenge nach 9 Stunden in Kubikmetern', beschriftung: <>nach 9 h in <Formel tex={t`\text{m}^3`} /></>, erwartet: SPEICHER.ende },
        { id: 'min', name: 'kleinste Wassermenge in Kubikmetern', beschriftung: <>kleinste Menge in <Formel tex={t`\text{m}^3`} /></>, erwartet: SPEICHER.minimum },
      ]}
      hilfen={[
        <>Die Bilanz ist das Integral der Rate von 0 bis 9: Flächen oberhalb der Zeitachse zählen positiv, Flächen unterhalb negativ. Die Wassermenge am Ende ist Anfangsmenge plus Bilanz.</>,
        <>Zwischen 2 h und 4 h ändert die Rate ihr Vorzeichen. Zerlege dort an der Nullstelle der Rate bei 3 h in zwei Dreiecke.</>,
        <>Die Wassermenge nimmt ab, solange die Rate negativ ist. Sie ist am kleinsten, wo die Rate das Vorzeichen von minus nach plus wechselt.</>,
      ]}
      loesung={[
        <>Die Flächen: <Formel tex={t`-4\cdot 2=-8`} /> (0 bis 2 h), <Formel tex={t`-\frac{1}{2}\cdot 1\cdot 4=-2`} /> (2 bis 3 h), <Formel tex={t`+\frac{1}{2}\cdot 1\cdot 4=2`} /> (3 bis 4 h), <Formel tex={t`4\cdot 3=12`} /> (4 bis 7 h) und <Formel tex={t`\frac{1}{2}\cdot 2\cdot 4=4`} /> (7 bis 9 h).</>,
        <>Bilanz: <Formel tex={t`-8-2+2+12+4=8\,\text{m}^3`} nach="." /> Wassermenge nach 9 Stunden: <Formel tex={t`20+8=28\,\text{m}^3`} nach="." /></>,
        <>
          Die Rate wechselt bei 3 h von minus nach plus. Dort ist die Menge am kleinsten: <Formel tex={t`20-8-2=10\,\text{m}^3`} nach="." />
          <FlaechenFigur daten={BILD_SPEICHER_FLAECHEN} unter={<>Rosa: Abfluss, blau und gelb: Zufluss.</>} />
        </>,
      ]}
    >
      <p>
        Ein Wasserspeicher enthält zu Beginn <Formel tex={t`20\,\text{m}^3`} nach="." /> Das Schaubild zeigt die Änderungsrate in <Formel tex={mh} nach="," /> negative Werte bedeuten Abfluss. Bestimme die Flächenbilanz von 0 bis 9 Stunden, die Wassermenge nach 9 Stunden und die kleinste Wassermenge im Speicher.
      </p>
      <FlaechenFigur daten={BILD_SPEICHER_RATE} unter={<>Änderungsrate des Speichers: bis 2 h gleich <Formel tex={t`-4\,${mh}`} nach="," /> dann gleichmäßig steigend auf <Formel tex={t`4\,${mh}`} /> bei 4 h, bis 7 h konstant, danach gleichmäßig fallend auf <Formel tex="0" nach="." /></>} />
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_SPEICHER_FLAECHEN} unter={<>Die Flächen zwischen dem Schaubild und der Zeitachse.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage7() {
  const optionen = [
    opt('a', <>Schaubild A</>, false, <>Das ist die Rate selbst, nur um 20 nach oben verschoben. Das Schaubild des Bestands hat als Steigung die Rate. Bei negativer Rate muss der Bestand fallen, bei A bleibt die Kurve aber zunächst waagerecht.</>),
    opt('b', <>Schaubild B</>, false, <>Hier wird der Abfluss wie ein Zufluss gezählt: Die Kurve steigt ständig. Bei negativer Rate nimmt der Bestand aber ab, die Kurve muss dort fallen.</>),
    opt('c', <>Schaubild C</>, true, <>Richtig.</>),
    opt('d', <>Keines der drei Schaubilder</>, false, <>Eines der Schaubilder passt: Bei 0 bis 3 Stunden fällt der Bestand, weil die Rate negativ ist, danach steigt er.</>),
  ];
  return (
    <Auswahlfrage
      nummer="7"
      titel="Welcher Bestand gehört zur Rate?"
      optionen={optionen}
      erklaerung={
        <>
          <p>
            Der Bestand beginnt bei 20. Bis 2 Stunden fließen pro Stunde 4 Kubikmeter ab, er fällt auf 12. Zwischen 2 und 3 Stunden fällt er noch weiter auf 10, danach steigt er, bis 4 Stunden auf 12 und bis 7 Stunden auf 24. Danach wächst er langsamer auf 28. Die Steigung der Kurve ist überall die Rate. Der tiefste Punkt liegt dort, wo die Rate von negativ zu positiv wechselt.
          </p>
          <Bild daten={BILD_BESTAND_RICHTIG} unter={<>Der Bestand mit dem Tiefpunkt <Formel tex="T" /> bei 3 Stunden.</>} />
        </>
      }
    >
      <p>
        Der Speicher aus Aufgabe 6 enthält zu Beginn <Formel tex={t`20\,\text{m}^3`} nach="." /> Welches der drei Schaubilder zeigt die Wassermenge im Speicher über der Zeit?
      </p>
      <FlaechenFigur daten={BILD_SPEICHER_RATE} unter={<>Änderungsrate des Speichers in Kubikmeter pro Stunde.</>} />
      <Bild daten={BILD_KANDIDAT_A} unter={<>Schaubild A</>} />
      <Bild daten={BILD_KANDIDAT_B} unter={<>Schaubild B</>} />
      <Bild daten={BILD_KANDIDAT_C} unter={<>Schaubild C</>} />
    </Auswahlfrage>
  );
}

function Frage8() {
  const optionen = [
    opt('negativ', <>Unterhalb der x-Achse liegt mehr Fläche als oberhalb. Der gesamte Flächeninhalt ist mindestens <Formel tex="5" nach="." /></>, true, <>Richtig.</>),
    opt('unmoeglich', <>Das ist nicht möglich, denn ein Flächeninhalt ist nie negativ.</>, false, <>Das Integral ist kein Flächeninhalt, sondern der orientierte Flächeninhalt. Flächen unterhalb der x-Achse zählen negativ, deshalb kann der Wert negativ sein.</>),
    opt('minus', <>Der Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse beträgt <Formel tex="-5" nach="." /></>, false, <>Ein Flächeninhalt ist nie negativ. Der Wert des Integrals ist die Bilanz, der gesamte Flächeninhalt ist ihr Betrag oder größer.</>),
    opt('ueberall', <><Formel tex="f" /> ist auf <Formel tex="[1;\,4]" /> überall negativ.</>, false, <>Das muss nicht sein. <Formel tex="f" /> kann auch teilweise positiv sein, wenn die Flächen darunter überwiegen.</>),
  ];
  return (
    <Auswahlfrage
      nummer="8"
      titel="Negatives Integral"
      optionen={platziere(optionen, 1)}
      erklaerung={<p>Das Integral ist die Flächenbilanz: Fläche oberhalb minus Fläche unterhalb. Ist die Bilanz <Formel tex="-5" nach="," /> liegt unterhalb 5 mehr Fläche als oberhalb. Der gesamte Flächeninhalt ist dann mindestens 5 und genau 5, wenn <Formel tex="f" /> nirgends positiv ist.</p>}
    >
      <p>
        Für eine stetige Funktion <Formel tex="f" /> gilt <Formel tex={integral('1', '4', 'f(x)') + '=-5'} nach="." /> Welche Aussage ist richtig?
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Kosinus"
      felder={[
        { id: 'gesamt', name: 'Integral von 0 bis drei Pi halbe', beschriftung: <><Formel tex={integral('0', t`\frac{3\pi}{2}`, t`\cos x`)} /></>, erwartet: KOSINUS.gesamt },
        { id: 'rueck', name: 'Integral von drei Pi halbe bis 0', beschriftung: <><Formel tex={integral(t`\frac{3\pi}{2}`, '0', t`\cos x`)} /></>, erwartet: KOSINUS.rueck },
        { id: 'flaeche', name: 'Flächeninhalt zwischen dem Schaubild und der x-Achse von 0 bis drei Pi halbe', beschriftung: <>Flächeninhalt</>, erwartet: KOSINUS.flaeche },
      ]}
      hilfen={[
        <>Zerlege das Integral bei <Formel tex={t`\frac{\pi}{2}`} nach="." /> Für das zweite Stück ist der Wert gegeben.</>,
        <>Der Flächeninhalt zählt die Fläche unter der x-Achse positiv.</>,
      ]}
      loesung={[
        <>Zerlegen: <Formel tex={integral('0', t`\frac{3\pi}{2}`, t`\cos x`) + '=1+(-2)=-1'} nach="." /></>,
        <>Vertauschen: <Formel tex={integral(t`\frac{3\pi}{2}`, '0', t`\cos x`) + '=1'} nach="." /></>,
        <>
          Flächeninhalt: oben <Formel tex="1" nach="," /> unten <Formel tex="2" nach="," /> zusammen <Formel tex="1+2=3" nach="." />
          <FlaechenFigur daten={BILD_COS_AUFGABE} unter={<>Blau: Fläche über der x-Achse, rosa: Fläche darunter.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex={integral('0', t`\frac{\pi}{2}`, t`\cos x`) + '=1'} /> und <Formel tex={integral(t`\frac{\pi}{2}`, t`\frac{3\pi}{2}`, t`\cos x`) + '=-2'} nach="." /> Bestimme das Integral von <Formel tex={t`\cos x`} /> von <Formel tex="0" /> bis <Formel tex={t`\frac{3\pi}{2}`} nach="," /> das Integral mit vertauschten Grenzen und den Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse über diesem Intervall.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_COS_AUFGABE} unter={<>Schaubild von <Formel tex={t`\cos x`} /> von <Formel tex="0" /> bis <Formel tex={t`\frac{3\pi}{2}`} nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage10() {
  const optionen = [
    opt('strecke', <>Das Fahrzeug ist in den 10 Sekunden genau <Formel tex={t`12\,\text{m}`} /> weit gefahren.</>, false, <>Ein Integral einer Geschwindigkeit ist die Verschiebung, nicht die zurückgelegte Strecke. Die Strecke wäre nie negativ.</>),
    opt('mittel', <>Die mittlere Geschwindigkeit beträgt <Formel tex={t`-12\,\frac{\text{m}}{\text{s}}`} nach="." /></>, false, <>Die mittlere Geschwindigkeit ist die Verschiebung geteilt durch die Zeit, hier <Formel tex={t`\frac{-12}{10}=-1{,}2\,\frac{\text{m}}{\text{s}}`} nach="." /></>),
    opt('stand', <>Das Fahrzeug stand die ganze Zeit.</>, false, <>Stünde es, wäre die Geschwindigkeit immer <Formel tex="0" /> und das Integral <Formel tex="0" nach="." /></>),
    opt('verschiebung', <>Das Fahrzeug liegt nach 10 s <Formel tex={t`12\,\text{m}`} /> weiter hinten als am Anfang. Es kann in dieser Zeit mehr als 12 m gefahren sein.</>, true, <>Richtig.</>),
  ];
  return (
    <Auswahlfrage
      nummer="10"
      titel="Integral deuten"
      optionen={optionen}
      erklaerung={<p>Das Integral der Geschwindigkeit ist die Änderung der Position, also die Verschiebung. Der Wert <Formel tex={`${WEG.integral}`} /> bedeutet: Entgegen der positiven Richtung um 12 m verschoben. Wenn das Fahrzeug zwischendurch vorwärts und dann weiter rückwärts gefahren ist, ist die zurückgelegte Strecke größer als 12 m.</p>}
    >
      <p>
        Die Geschwindigkeit <Formel tex="v(t)" /> eines Fahrzeugs wird in <Formel tex={t`\frac{\text{m}}{\text{s}}`} /> angegeben, positiv bedeutet vorwärts. Es gilt <Formel tex={t`\int_{0}^{10} v(t)\,\mathrm{d}t=${WEG.integral}`} nach="." /> Welche Aussage ist richtig?
      </p>
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Die Aufgaben 1 und 2 gehören zur Summenschreibweise und zum Grenzwert, 3 bis 5 zur Flächenbilanz und zu den Rechenregeln, 6 bis 10 zur Anwendung und zum Deuten.
      </p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Aufgabe2 />
      <Aufgabe3 />
      <Aufgabe4 />
      <Frage5 />
      <Aufgabe6 />
      <Frage7 />
      <Frage8 />
      <Aufgabe9 />
      <Frage10 />
    </Abschnitt>
  );
}
