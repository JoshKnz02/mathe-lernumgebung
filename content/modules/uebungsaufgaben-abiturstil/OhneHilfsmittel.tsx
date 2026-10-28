import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import {
  BILD_A1_F, BILD_A1_R, BILD_A2_F, BILD_A2_G1, BILD_A2_G2, BILD_A3_ABLEITUNG, BILD_A3_F, BILD_A3_I, BILD_A3_II, BILD_A3_III, BILD_A4_F, BILD_A4_KOS, BILD_A5_K3, BILD_A5_KM3, BILD_A6_A, BILD_A6_RECHTECK,
} from './Bilder';
import { BE, Teile } from './Teile';

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl, als Dezimalzahl mit Komma oder als Bruch ein, zum Beispiel <code>2</code>, <code>-1,5</code> oder <code>3/4</code>, ohne Einheit. Vielfache von π schreibst du als <code>3pi/2</code>. Die Felder prüfen nur Ergebnisse. Begründungen und Rechenwege schreibst du in dein Heft, den Lösungsweg vergleichst du danach.
    </Hinweis>
  );
}

/** Aufgabe 1: Änderungsraten und Ableitung einer Exponentialfunktion. */
function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Feinstaub und Zugriffsrate"
      felder={[
        { id: 'mittel', name: 'mittlere Änderungsrate in Mikrogramm pro Kubikmeter und Stunde', beschriftung: <>mittlere Änderungsrate</>, erwartet: -16 },
        { id: 'zeit', name: 'Zeitpunkt in Stunden nach 6 Uhr', beschriftung: <>Zeitpunkt <Formel tex="t" /> in Stunden</>, erwartet: 5 },
        { id: 'ab', name: 'Zeitpunkt, ab dem die Rate fällt, in Stunden', beschriftung: <>Zeitpunkt, ab dem <Formel tex="r" /> fällt</>, erwartet: 5 },
      ]}
      hilfen={[
        <>Die mittlere Änderungsrate ist die Steigung der Sekante durch zwei Punkte des Schaubilds, die momentane Änderungsrate die Steigung der Tangente (Modul <Modulverweis modul="aenderungsraten">Änderungsraten</Modulverweis>).</>,
        <>Für a rechnest du <Formel tex={t`\frac{F(4)-F(0)}{4-0}`} nach="." /> Für b leitest du <Formel tex="F" /> ab und setzt <Formel tex={t`F'(t)=-4`} nach="." /></>,
        <>Für c wendest du die Produktregel und die Kettenregel an (Modul <Modulverweis modul="produkt-kettenregel">Produktregel und Kettenregel</Modulverweis>). Für d untersuchst du das Vorzeichen von <Formel tex="r'" nach="." /></>,
      ]}
      loesung={[
        <>
          a: Die mittlere Änderungsrate ist die Steigung der Sekante durch <Formel tex={t`P(0\,|\,100)`} /> und <Formel tex={t`Q(4\,|\,36)`} nach=":" />
          <Formel anzeige tex={t`\frac{F(4)-F(0)}{4-0}=\frac{36-100}{4}=-16`} />
          Die Konzentration nimmt in den ersten vier Stunden im Mittel um 16 Mikrogramm pro Kubikmeter und Stunde ab.
        </>,
        <>
          b: Die momentane Änderungsrate ist <Formel tex={t`F'(t)=4t-24`} nach="." /> Aus <Formel tex={t`F'(t)=-4`} /> folgt <Formel tex={t`4t-24=-4`} nach="," /> also <Formel tex="t=5" nach="." /> Fünf Stunden nach 6 Uhr, also um 11 Uhr, hat die Tangente die Steigung <Formel tex="-4" nach="." />
          <Bild daten={BILD_A1_F} unter={<>Die Sekante durch <Formel tex="P" /> und <Formel tex="Q" /> (schwarz) hat die Steigung <Formel tex="-16" nach="," /> die Tangente in <Formel tex="R" /> (blau) die Steigung <Formel tex="-4" nach="." /></>} />
        </>,
        <>
          c: Mit der Produktregel und der Kettenregel (innere Ableitung <Formel tex="-0{,}2" nach=")" /> ist
          <Formel anzeige tex={t`r'(t)=3\cdot e^{-0{,}2t}+3t\cdot(-0{,}2)\,e^{-0{,}2t}=3\,(1-0{,}2t)\,e^{-0{,}2t}`} />
          Das ist der angegebene Term.
        </>,
        <>
          d: Der Faktor <Formel tex={t`e^{-0{,}2t}`} /> ist immer positiv. Das Vorzeichen von <Formel tex="r'" /> hängt nur von <Formel tex={t`1-0{,}2t`} /> ab. Es ist <Formel tex={t`1-0{,}2t=0`} /> für <Formel tex="t=5" nach="." /> Für <Formel tex="t<5" /> ist <Formel tex="r'(t)>0" /> (die Rate steigt), für <Formel tex="t>5" /> ist <Formel tex="r'(t)<0" /> (die Rate fällt). Ab <Formel tex="t=5" /> fällt die Rate, dort liegt ihr größter Wert.
          <Bild daten={BILD_A1_R} unter={<>Die Rate <Formel tex="r" /> steigt bis zum Hochpunkt <Formel tex="H" /> bei <Formel tex="t=5" /> und fällt danach.</>} />
        </>,
      ]}
    >
      <p>
        An einer Messstation wird zwölf Stunden lang die Feinstaubkonzentration gemessen. Sie kann in Mikrogramm pro Kubikmeter zum Zeitpunkt <Formel tex="t" /> (in Stunden nach 6 Uhr) durch <Formel tex={t`F(t)=2t^2-24t+100`} /> mit <Formel tex={t`0\le t\le 12`} /> beschrieben werden.
      </p>
      <Teile>
        <li>
          Bestimmen Sie die mittlere Änderungsrate der Konzentration in den ersten vier Stunden. <BE n={3} />
        </li>
        <li>
          Ermitteln Sie den Zeitpunkt, zu dem sich die Konzentration momentan mit <Formel tex="-4" /> Mikrogramm pro Kubikmeter und Stunde ändert. <BE n={2} />
        </li>
      </Teile>
      <p>
        Die Zugriffe auf einen Online-Artikel werden durch die Rate <Formel tex={t`r(t)=3t\cdot e^{-0{,}2t}`} /> beschrieben. Dabei ist <Formel tex="t" /> die Zeit in Stunden seit der Veröffentlichung und <Formel tex="r(t)" /> die Rate in der Einheit „Tausend Zugriffe pro Stunde“.
      </p>
      <Teile ab={3}>
        <li>
          Zeigen Sie, dass <Formel tex={t`3\,(1-0{,}2t)\,e^{-0{,}2t}`} /> ein Term der ersten Ableitungsfunktion von <Formel tex="r" /> ist. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie den Zeitpunkt, ab dem die Rate fällt. <BE n={1} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A1_F} unter={<>Das Schaubild von <Formel tex="F" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 2: Tangente an die Kosinusfunktion, Wertemenge, Tangente an K_g. */
function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Kosinusfunktion und Hyperbel"
      felder={[
        { id: 'm', name: 'Steigung der Tangente', beschriftung: <>Steigung <Formel tex="m" /></>, erwartet: 3 },
        { id: 'y', name: 'Funktionswert f von Pi halbe', beschriftung: <><Formel tex={t`f\left(\tfrac{\pi}{2}\right)`} /></>, erwartet: 4 },
        { id: 'min', name: 'kleinster Funktionswert von f', beschriftung: <>kleinster Wert von <Formel tex="f" /></>, erwartet: 1 },
        { id: 'max', name: 'größter Funktionswert von f', beschriftung: <>größter Wert von <Formel tex="f" /></>, erwartet: 7 },
        { id: 'p', name: 'Wert von p', beschriftung: <><Formel tex="p" /></>, erwartet: 2 },
        { id: 'u', name: 'x-Koordinate von Q', beschriftung: <><Formel tex="u" /></>, erwartet: 4 },
        { id: 'gu', name: 'y-Koordinate von Q', beschriftung: <><Formel tex="g(u)" /></>, erwartet: 0.5 },
      ]}
      hilfen={[
        <>Für a brauchst du die Ableitung von <Formel tex={t`f(x)=4-3\cos x`} /> und den Funktionswert an der Stelle <Formel tex={t`\frac{\pi}{2}`} nach="." /> Die Tangente hat die Form <Formel tex={t`y=m\,(x-x_0)+f(x_0)`} nach="." /></>,
        <>Für b: Der Kosinus liegt immer zwischen <Formel tex="-1" /> und <Formel tex="1" nach="." /> Setze beide Grenzen in <Formel tex="f" /> ein.</>,
        <>Für c: Die Schnittpunkte liegen wegen der Symmetrie bei <Formel tex={t`x=-2`} /> und <Formel tex="x=2" nach="." /> Für d: Schreibe <Formel tex={t`g(x)=8x^{-2}`} /> und leite ab. Dann setzt du <Formel tex={t`g'(u)=-\frac14`} nach="." /></>,
      ]}
      loesung={[
        <>
          a: <Formel tex={t`f'(x)=3\sin x`} nach="." /> An der Stelle <Formel tex={t`x_0=\frac{\pi}{2}`} /> ist <Formel tex={t`f\left(\tfrac{\pi}{2}\right)=4-3\cdot 0=4`} /> und <Formel tex={t`f'\left(\tfrac{\pi}{2}\right)=3\cdot 1=3`} nach="." /> Die Tangente ist
          <Formel anzeige tex={t`y=3\left(x-\tfrac{\pi}{2}\right)+4=3x-\tfrac{3\pi}{2}+4`} />
          <Bild daten={BILD_A2_F} unter={<>Die Tangente (blau gestrichelt) im Punkt <Formel tex={t`P\left(\tfrac{\pi}{2}\,|\,4\right)`} /> hat die Steigung <Formel tex="3" nach="." /></>} />
        </>,
        <>
          b: Es ist <Formel tex={t`-1\le\cos x\le 1`} nach="." /> Für <Formel tex={t`\cos x=1`} /> ist <Formel tex={t`f(x)=4-3=1`} nach="," /> für <Formel tex={t`\cos x=-1`} /> ist <Formel tex={t`f(x)=4+3=7`} nach="." /> Die Wertemenge ist <Formel tex={t`W=[1;\,7]`} nach="." />
        </>,
        <>
          c: Wegen der Symmetrie liegen die Schnittpunkte bei <Formel tex={t`x=-2`} /> und <Formel tex="x=2" nach="," /> denn ihr Abstand ist 4. Also ist <Formel tex={t`p=g(2)=\frac{8}{4}=2`} nach="." />
          <Bild daten={BILD_A2_G1} unter={<>Die Gerade <Formel tex="y=2" /> (blau gestrichelt) schneidet <Formel tex={t`K_g`} /> in <Formel tex="A" /> und <Formel tex="B" /> im Abstand 4.</>} />
        </>,
        <>
          d: <Formel tex={t`g(x)=8x^{-2}`} /> hat die Ableitung <Formel tex={t`g'(x)=-16x^{-3}=-\frac{16}{x^3}`} nach="." /> Aus <Formel tex={t`g'(u)=-\frac14`} /> folgt <Formel tex={t`\frac{16}{u^3}=\frac14`} nach="," /> also <Formel tex={t`u^3=64`} /> und <Formel tex="u=4" nach="." /> Es ist <Formel tex={t`g(4)=\frac{8}{16}=\frac12`} nach="." /> Also <Formel tex={t`Q\left(4\,|\,\tfrac12\right)`} nach="." />
          <Bild daten={BILD_A2_G2} unter={<>Die Tangente (blau gestrichelt) in <Formel tex="Q" /> hat die Steigung <Formel tex={t`-\tfrac14`} nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist die in <Formel tex={t`\mathbb{R}`} /> definierte Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=4-3\cos x`} nach="." /> Ihr Schaubild ist <Formel tex="K_f" nach="." />
      </p>
      <Teile>
        <li>
          Bestimmen Sie die Gleichung der Tangente an <Formel tex="K_f" /> im Punkt <Formel tex={t`P\left(\tfrac{\pi}{2}\,|\,f\left(\tfrac{\pi}{2}\right)\right)`} nach="." /> <BE n={3} />
        </li>
        <li>
          Geben Sie die Wertemenge von <Formel tex="f" /> an. <BE n={2} />
        </li>
      </Teile>
      <p>
        Gegeben ist die in <Formel tex={t`\mathbb{R}\setminus\{0\}`} /> definierte Funktion <Formel tex="g" /> mit <Formel tex={t`g(x)=\frac{8}{x^2}`} nach="." /> Das Schaubild <Formel tex="K_g" /> ist symmetrisch bezüglich der y-Achse.
      </p>
      <Teile ab={3}>
        <li>
          Berechnen Sie den Wert von <Formel tex="p" nach="," /> für den die Gerade <Formel tex="y=p" /> das Schaubild <Formel tex="K_g" /> in zwei Punkten mit dem Abstand 4 schneidet. <BE n={2} />
        </li>
        <li>
          Berechnen Sie die Koordinaten des Punkts <Formel tex="Q(u\,|\,g(u))" /> mit <Formel tex="u>0" nach="," /> in dem die Tangente an <Formel tex="K_g" /> die Steigung <Formel tex={t`-\frac14`} /> hat. <BE n={3} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A2_F} unter={<>Das Schaubild von <Formel tex="f" /> mit der Tangente.</>} />
        <Bild daten={BILD_A2_G1} unter={<>Das Schaubild von <Formel tex="g" /> mit der Geraden <Formel tex="y=p" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 3, Teil a: Welches Schaubild gehört zur Ableitungsfunktion? */
function Frage3a() {
  const optionen = [
    opt('I', <>Schaubild I</>, true, <>Richtig.</>),
    opt('II', <>Schaubild II</>, false, <>Schaubild II ist an der x-Achse gespiegelt: Links von <Formel tex="x=0" /> wäre <Formel tex="f'" /> dort negativ. Das Schaubild von <Formel tex="f" /> steigt aber links von <Formel tex="x=0" /> (es läuft zum Hochpunkt hinauf), also muss <Formel tex="f'" /> dort positiv sein.</>),
    opt('III', <>Schaubild III</>, false, <>Schaubild III hat die Nullstellen bei <Formel tex="x=-2" /> und <Formel tex="x=0" nach="." /> Das Schaubild von <Formel tex="f" /> hat aber waagerechte Tangenten bei <Formel tex="x=0" /> und <Formel tex="x=2" nach="." /> Bei <Formel tex="x=2" /> müsste <Formel tex="f'" /> eine Nullstelle haben, III hat dort den Wert 24.</>),
    opt('keins', <>Keins der drei Schaubilder</>, false, <>Schaubild I passt: Es hat Nullstellen genau bei den Stellen mit waagerechter Tangente von <Formel tex="K_f" /> und ist dazwischen negativ, wo <Formel tex="K_f" /> fällt.</>),
  ];
  return (
    <Auswahlfrage
      nummer="3a"
      titel="Welches Schaubild gehört zur Ableitungsfunktion?"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            Das Schaubild <Formel tex="K_f" /> hat bei <Formel tex="x=0" /> einen Hochpunkt und bei <Formel tex="x=2" /> einen Tiefpunkt. Dort ist die Tangente waagerecht, also <Formel tex="f'(0)=0" /> und <Formel tex="f'(2)=0" nach="." /> Links von 0 steigt <Formel tex="K_f" nach="," /> also ist <Formel tex="f'>0" nach="." /> Zwischen 0 und 2 fällt <Formel tex="K_f" nach="," /> also ist <Formel tex="f'<0" nach="." /> Rechts von 2 steigt <Formel tex="K_f" /> wieder, <Formel tex="f'>0" nach="." /> Das trifft nur auf Schaubild I zu, es ist die nach oben geöffnete Parabel mit den Nullstellen 0 und 2 (<Formel tex={t`f'(x)=3x^2-6x`} nach=")." />
          </p>
          <Bild daten={BILD_A3_ABLEITUNG} unter={<>Das Schaubild von <Formel tex="f'" /> (grün) mit den Nullstellen <Formel tex="N" nach="." /></>} />
        </>
      }
    >
      <p>
        Die Abbildung zeigt das Schaubild <Formel tex="K_f" /> der Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=x^3-3x^2`} nach="." /> Eines der Schaubilder I, II und III gehört zur ersten Ableitungsfunktion <Formel tex="f'" /> von <Formel tex="f" nach="." /> Wähle es aus. Du solltest begründen können, warum die beiden anderen nicht infrage kommen. <BE n={3} />
      </p>
      <Bild daten={BILD_A3_F} unter={<>Das Schaubild <Formel tex="K_f" /> von <Formel tex="f" /> mit Hochpunkt <Formel tex="H" /> und Tiefpunkt <Formel tex="T" nach="." /></>} />
      <Bild daten={BILD_A3_I} unter={<>Schaubild I</>} />
      <Bild daten={BILD_A3_II} unter={<>Schaubild II</>} />
      <Bild daten={BILD_A3_III} unter={<>Schaubild III</>} />
    </Auswahlfrage>
  );
}

/** Aufgabe 3, Teil b: Eigenschaft des Schaubilds der Ableitungsfunktion. */
function Frage3b() {
  const optionen = [
    opt('wechsel', <>Es hat bei <Formel tex="x=0" /> eine Nullstelle mit Vorzeichenwechsel von plus nach minus.</>, true, <>Richtig.</>),
    opt('tief', <>Es hat bei <Formel tex="x=0" /> eine Nullstelle mit Vorzeichenwechsel von minus nach plus.</>, false, <>Ein Wechsel von minus nach plus bedeutet, dass <Formel tex="K_f" /> von fallend zu steigend wechselt. Das wäre ein Tiefpunkt. Bei einem Hochpunkt steigt <Formel tex="K_f" /> zuerst (<Formel tex="f'>0" nach=")" /> und fällt danach (<Formel tex="f'<0" nach=")." /></>),
    opt('hoch', <>Es hat bei <Formel tex="x=0" /> einen Hochpunkt.</>, false, <>Ein Hochpunkt von <Formel tex="K_{f'}" /> würde zu einer Wendestelle von <Formel tex="K_f" /> gehören, nicht zu einem Hochpunkt. Bei <Formel tex="x=0" /> hat <Formel tex="K_{f'}" /> eine Nullstelle, keinen Hochpunkt.</>),
    opt('oben', <>Es verläuft bei <Formel tex="x=0" /> oberhalb der x-Achse.</>, false, <>Oberhalb der x-Achse heißt <Formel tex="f'(0)>0" nach="," /> also eine steigende Tangente. Ein Hochpunkt hat aber die waagerechte Tangente <Formel tex="f'(0)=0" nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="3b"
      titel="Hochpunkt am Schaubild der Ableitungsfunktion erkennen"
      optionen={platziere(optionen, 0)}
      erklaerung={
        <>
          <p>
            An einem Hochpunkt ist die Tangente waagerecht, also <Formel tex="f'(0)=0" nach="." /> Links davon steigt <Formel tex="K_f" /> (<Formel tex="f'>0" nach=")," /> rechts davon fällt es (<Formel tex="f'<0" nach=")." /> Das Schaubild <Formel tex="K_{f'}" /> schneidet die x-Achse bei <Formel tex="x=0" /> also von oben nach unten: Vorzeichenwechsel von plus nach minus (siehe Modul <Modulverweis modul="grafisches-differenzieren">Grafisches Differenzieren</Modulverweis>).
          </p>
          <Bild daten={BILD_A3_F} unter={<>Oben <Formel tex="K_f" /> mit dem Hochpunkt <Formel tex="H" nach="," /> darunter im selben Bereich <Formel tex="K_{f'}" /> mit der Nullstelle bei <Formel tex="x=0" nach="." /></>} />
          <Bild daten={BILD_A3_ABLEITUNG} unter={<>Das Schaubild von <Formel tex="f'" /> (grün) wechselt bei <Formel tex="x=0" /> von plus nach minus.</>} />
        </>
      }
    >
      <p>
        Beschreiben Sie die Eigenschaft von <Formel tex="K_{f'}" nach="," /> aus der sich folgern lässt, dass <Formel tex="K_f" /> bei <Formel tex="x=0" /> einen Hochpunkt hat. Wähle die richtige Beschreibung. <BE n={2} />
      </p>
    </Auswahlfrage>
  );
}

/** Aufgabe 4: Funktionsterm vierten Grades mit Symmetrie, Kosinusfunktion. */
function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Funktionsterme bestimmen"
      felder={[
        { id: 'a', name: 'Koeffizient a von x hoch vier', beschriftung: <><Formel tex="a" /></>, erwartet: 0.25 },
        { id: 'b', name: 'Koeffizient b von x Quadrat', beschriftung: <><Formel tex="b" /></>, erwartet: -2 },
        { id: 'c', name: 'Konstante c', beschriftung: <><Formel tex="c" /></>, erwartet: 5 },
        { id: 'bk', name: 'Parameter b der Kosinusfunktion', beschriftung: <><Formel tex="b" /> (Kosinus)</>, erwartet: Math.PI / 2 },
        { id: 'ak', name: 'Parameter a der Kosinusfunktion', beschriftung: <><Formel tex="a" /> (Kosinus)</>, erwartet: 3 },
        { id: 'dk', name: 'Parameter d der Kosinusfunktion', beschriftung: <><Formel tex="d" /> (Kosinus)</>, erwartet: 2 },
        { id: 'steig', name: 'Steigung an der Stelle 3', beschriftung: <>Steigung bei <Formel tex="x=3" /></>, erwartet: 1.5 * Math.PI },
      ]}
      hilfen={[
        <>Für a: Ist das Schaubild symmetrisch zur y-Achse, kommen im Ansatz nur gerade Hochzahlen vor: <Formel tex={t`f(x)=ax^4+bx^2+c`} nach="." /> Der Tiefpunkt liefert zwei Bedingungen: <Formel tex="f(2)=1" /> und <Formel tex="f'(2)=0" nach="." /></>,
        <>Der Schnittpunkt mit der y-Achse liefert <Formel tex="c" nach="." /> Aus <Formel tex="f'(2)=0" /> folgt <Formel tex="b" /> in Abhängigkeit von <Formel tex="a" nach="." /> Setze das in <Formel tex="f(2)=1" /> ein (Modul <Modulverweis modul="funktionsterme-aufstellen">Aufstellen von Funktionstermen</Modulverweis>).</>,
        <>Für b: Der Ansatz ist <Formel tex={t`f(x)=a\cos(bx)+d`} nach="." /> Die Periode ist <Formel tex={t`\frac{2\pi}{b}`} nach="." /> Im Wendepunkt hat die Funktion den Wert der Ruhelage <Formel tex="d" nach="." /> Die Steigung bestimmst du mit der Ableitung.</>,
      ]}
      loesung={[
        <>
          a: Ansatz mit gerader Symmetrie: <Formel tex={t`f(x)=ax^4+bx^2+c`} /> mit <Formel tex={t`f'(x)=4ax^3+2bx`} nach="." /> Aus <Formel tex={t`f(0)=5`} /> folgt <Formel tex="c=5" nach="." />
        </>,
        <>
          Aus <Formel tex="f(2)=1" /> folgt <Formel tex={t`16a+4b+5=1`} nach="," /> also <Formel tex={t`4a+b=-1`} nach="." /> Aus <Formel tex="f'(2)=0" /> folgt <Formel tex={t`32a+4b=0`} nach="," /> also <Formel tex="b=-8a" nach="." /> Eingesetzt: <Formel tex={t`4a-8a=-1`} nach="," /> also <Formel tex={t`a=\tfrac14`} /> und <Formel tex="b=-2" nach="." /> Der Term ist <Formel tex={t`f(x)=\tfrac14x^4-2x^2+5`} nach="." /> Probe: <Formel tex={t`f''(x)=3x^2-4`} nach="," /> <Formel tex={t`f''(2)=8>0`} nach="," /> also ein Tiefpunkt.
          <Bild daten={BILD_A4_F} unter={<>Das Schaubild von <Formel tex={t`f(x)=\tfrac14x^4-2x^2+5`} /> mit dem Hochpunkt <Formel tex="H" /> und den Tiefpunkten <Formel tex="T" nach="." /></>} />
        </>,
        <>
          b: Die Periode ist 4, also <Formel tex={t`\frac{2\pi}{b}=4`} /> und <Formel tex={t`b=\frac{\pi}{2}`} nach="." /> Im Wendepunkt <Formel tex={t`(1\,|\,2)`} /> liegt das Schaubild auf der Ruhelage, <Formel tex="d=2" nach="." />
        </>,
        <>
          Der Tiefpunkt <Formel tex={t`(2\,|\,-1)`} /> liefert <Formel tex={t`a\cos(\pi)+2=-a+2=-1`} nach="," /> also <Formel tex="a=3" nach="." /> Der Term ist <Formel tex={t`f(x)=3\cos\left(\tfrac{\pi}{2}x\right)+2`} nach="." />
        </>,
        <>
          Ableitung: <Formel tex={t`f'(x)=-3\cdot\tfrac{\pi}{2}\sin\left(\tfrac{\pi}{2}x\right)`} nach="." /> An der Stelle 3 ist <Formel tex={t`\sin\left(\tfrac{3\pi}{2}\right)=-1`} nach="," /> also <Formel tex={t`f'(3)=-\tfrac{3\pi}{2}\cdot(-1)=\tfrac{3\pi}{2}`} nach="." /> Bei <Formel tex="x=3" /> liegt der zweite Wendepunkt, dort ist das Schaubild am steilsten.
          <Bild daten={BILD_A4_KOS} unter={<>Das Schaubild von <Formel tex="f" /> mit dem Tiefpunkt <Formel tex="T" /> und den Wendepunkten <Formel tex="W" nach="." /> Die Tangente (blau gestrichelt) bei <Formel tex="x=3" /> hat die Steigung <Formel tex={t`\tfrac{3\pi}{2}`} nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild einer ganzrationalen Funktion <Formel tex="f" /> vierten Grades ist symmetrisch zur y-Achse, schneidet die y-Achse im Punkt <Formel tex={t`(0\,|\,5)`} /> und hat im Punkt <Formel tex={t`T(2\,|\,1)`} /> einen Tiefpunkt.
      </p>
      <Teile>
        <li>
          Bestimmen Sie die Koeffizienten <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> in <Formel tex={t`f(x)=ax^4+bx^2+c`} nach="." /> <BE n={4} />
        </li>
      </Teile>
      <p>
        Eine Kosinusfunktion <Formel tex="f" /> mit <Formel tex={t`f(x)=a\cos(bx)+d`} /> und <Formel tex="b>0" /> hat die Periode 4. Der Punkt <Formel tex={t`(2\,|\,-1)`} /> ist ein Tiefpunkt, der Punkt <Formel tex={t`(1\,|\,2)`} /> ein Wendepunkt ihres Schaubilds.
      </p>
      <Teile ab={2}>
        <li>
          Bestimmen Sie <Formel tex="b" nach="," /> <Formel tex="a" /> und <Formel tex="d" /> und die Steigung des Schaubilds an der Stelle 3. <BE n={5} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A4_F} unter={<>Das Schaubild von <Formel tex="f" /> aus Teil a.</>} />
        <Bild daten={BILD_A4_KOS} unter={<>Das Schaubild der Kosinusfunktion aus Teil b.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 5: Funktionenschar mit Symmetrie und Wendetangente. */
function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Eine Funktionenschar"
      felder={[
        { id: 'k1', name: 'kleinerer Wert von k', beschriftung: <>kleinerer Wert von <Formel tex="k" /></>, erwartet: -3 },
        { id: 'k2', name: 'größerer Wert von k', beschriftung: <>größerer Wert von <Formel tex="k" /></>, erwartet: 3 },
      ]}
      hilfen={[
        <>Für a: Punktsymmetrie zum Ursprung bedeutet <Formel tex="f(-x)=-f(x)" nach="." /> Setze <Formel tex="k=0" /> ein und prüfe die Bedingung.</>,
        <>Für b: Die Wendestelle liegt dort, wo <Formel tex="f_k''" /> eine Nullstelle mit Vorzeichenwechsel hat. Rechne mit <Formel tex="k" /> als Zahl und löse <Formel tex={t`f_k''(x)=0`} /> nach <Formel tex="x" /> auf.</>,
        <>Setze die Wendestelle in <Formel tex={t`f_k'`} /> ein. Du erhältst einen Term in <Formel tex="k" nach="," /> den du gleich 1 setzt. Es gibt zwei Lösungen.</>,
      ]}
      loesung={[
        <>
          a: Für <Formel tex="k=0" /> ist <Formel tex={t`f_0(x)=x^3+4x`} nach="." /> Es gilt
          <Formel anzeige tex={t`f_0(-x)=(-x)^3+4(-x)=-x^3-4x=-f_0(x)`} />
          Das Schaubild von <Formel tex="f_0" /> ist daher punktsymmetrisch zum Ursprung.
        </>,
        <>
          b: Die Ableitungen sind <Formel tex={t`f_k'(x)=3x^2-2kx+4`} /> und <Formel tex={t`f_k''(x)=6x-2k`} nach="." /> Aus <Formel tex={t`6x-2k=0`} /> folgt <Formel tex={t`x=\tfrac{k}{3}`} nach="." /> Wegen <Formel tex={t`f_k'''(x)=6\ne 0`} /> ist das eine Wendestelle.
        </>,
        <>
          Steigung der Wendetangente:
          <Formel anzeige tex={t`f_k'\left(\tfrac{k}{3}\right)=3\cdot\tfrac{k^2}{9}-2k\cdot\tfrac{k}{3}+4=\tfrac{k^2}{3}-\tfrac{2k^2}{3}+4=4-\tfrac{k^2}{3}`} />
          Aus <Formel tex={t`4-\tfrac{k^2}{3}=1`} /> folgt <Formel tex={t`k^2=9`} nach="," /> also <Formel tex="k=-3" /> oder <Formel tex="k=3" nach="." />
        </>,
        <>
          Probe: Für <Formel tex="k=3" /> liegt der Wendepunkt bei <Formel tex={t`W(1\,|\,2)`} nach="," /> die Wendetangente ist <Formel tex="y=x+1" nach="." /> Für <Formel tex="k=-3" /> liegt er bei <Formel tex={t`W(-1\,|\,-2)`} nach="," /> die Wendetangente ist <Formel tex="y=x-1" nach="." />
          <Bild daten={BILD_A5_K3} unter={<>Das Schaubild von <Formel tex="f_3" /> mit dem Wendepunkt <Formel tex="W" /> und der Wendetangente (blau gestrichelt).</>} />
          <Bild daten={BILD_A5_KM3} unter={<>Das Schaubild von <Formel tex="f_{-3}" /> mit dem Wendepunkt <Formel tex="W" /> und der Wendetangente (blau gestrichelt).</>} />
        </>,
      ]}
    >
      <p>
        Für jedes <Formel tex={t`k\in\mathbb{R}`} /> ist die Funktion <Formel tex={t`f_k`} /> gegeben durch <Formel tex={t`f_k(x)=x^3-kx^2+4x`} nach="." /> Das Schaubild von <Formel tex={t`f_k`} /> ist <Formel tex={t`K_k`} nach="." />
      </p>
      <Teile>
        <li>
          Begründen Sie, dass <Formel tex={t`K_0`} /> punktsymmetrisch zum Ursprung ist. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie alle Werte von <Formel tex="k" nach="," /> für die die Wendetangente von <Formel tex={t`K_k`} /> die Steigung 1 hat. <BE n={4} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A5_K3} unter={<>Das Schaubild für <Formel tex="k=3" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 6: Verkettung aus Werten und Rechteck unter einer Parabel. */
function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Verkettung und Rechteck"
      felder={[
        { id: 'm', name: 'Steigung der Tangente', beschriftung: <>Steigung <Formel tex="m" /></>, erwartet: -6 },
        { id: 'n', name: 'y-Achsenabschnitt der Tangente', beschriftung: <><Formel tex="n" /></>, erwartet: 16 },
        { id: 'u', name: 'Stelle u des größten Flächeninhalts', beschriftung: <><Formel tex="u" /></>, erwartet: 2 },
        { id: 'A', name: 'größter Flächeninhalt', beschriftung: <>größter Flächeninhalt</>, erwartet: 16 },
      ]}
      hilfen={[
        <>Für a: Die Tangente an <Formel tex="K_h" /> bei <Formel tex="x=2" /> braucht <Formel tex="h(2)" /> und <Formel tex="h'(2)" nach="." /> Setze in <Formel tex="h(x)=g(f(x))" /> ein und leite mit der Kettenregel ab (Modul <Modulverweis modul="produkt-kettenregel">Produktregel und Kettenregel</Modulverweis>).</>,
        <>Für b: Die Seiten des Rechtecks sind <Formel tex="u" /> und <Formel tex="f(u)" nach="." /> Stelle den Flächeninhalt als Funktion von <Formel tex="u" /> auf.</>,
        <>Bestimme die Nullstelle von <Formel tex="A'" /> und vergleiche mit den Rändern des Definitionsbereichs (Modul <Modulverweis modul="optimierung">Optimierung</Modulverweis>).</>,
      ]}
      loesung={[
        <>
          a: Es ist <Formel tex={t`h(2)=g(f(2))=g(-1)=4`} nach="." /> Die Kettenregel liefert <Formel tex={t`h'(x)=g'(f(x))\cdot f'(x)`} nach="," /> also <Formel tex={t`h'(2)=g'(-1)\cdot f'(2)=(-2)\cdot 3=-6`} nach="." />
        </>,
        <>
          Tangente: <Formel tex={t`y=-6\,(x-2)+4=-6x+16`} nach="." /> Also <Formel tex="m=-6" /> und <Formel tex="n=16" nach="." />
        </>,
        <>
          b: Das Rechteck hat die Breite <Formel tex="u" /> und die Höhe <Formel tex={t`f(u)=12-u^2`} nach="." /> Flächeninhalt:
          <Formel anzeige tex={t`A(u)=u\,(12-u^2)=12u-u^3,\quad 0<u<\sqrt{12}`} />
          <Bild daten={BILD_A6_RECHTECK} unter={<>Das Rechteck mit den Ecken <Formel tex="O" nach="," /> <Formel tex="P" nach="," /> <Formel tex="Q" /> und <Formel tex="R" /> für <Formel tex="u=2" nach="." /></>} />
        </>,
        <>
          <Formel tex={t`A'(u)=12-3u^2`} /> ist null für <Formel tex="u^2=4" nach="," /> also <Formel tex="u=2" /> (negative Werte liegen nicht im Definitionsbereich). Wegen <Formel tex={t`A''(u)=-6u`} /> ist <Formel tex={t`A''(2)=-12<0`} nach="," /> es ist ein Hochpunkt. An den Rändern ist <Formel tex="A=0" nach="." /> Der größte Flächeninhalt ist <Formel tex={t`A(2)=12\cdot 2-8=16`} nach="." />
          <Bild daten={BILD_A6_A} unter={<>Die Zielfunktion <Formel tex="A" /> mit dem Hochpunkt <Formel tex="H" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Von zwei differenzierbaren Funktionen <Formel tex="f" /> und <Formel tex="g" /> sind folgende Werte bekannt: <Formel tex="f(2)=-1" nach="," /> <Formel tex="f'(2)=3" nach="," /> <Formel tex="g(-1)=4" /> und <Formel tex={t`g'(-1)=-2`} nach="." /> Die Funktion <Formel tex="h" /> ist gegeben durch <Formel tex="h(x)=g(f(x))" nach="." />
      </p>
      <Teile>
        <li>
          Bestimmen Sie eine Gleichung der Tangente an das Schaubild von <Formel tex="h" /> im Punkt <Formel tex="(2\,|\,h(2))" nach="." /> Gib die Steigung <Formel tex="m" /> und den y-Achsenabschnitt <Formel tex="n" /> von <Formel tex="y=mx+n" /> an. <BE n={3} />
        </li>
      </Teile>
      <p>
        Gegeben ist die Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=12-x^2`} nach="." /> Für <Formel tex={t`0<u<\sqrt{12}`} /> liegt ein Rechteck unter dem Schaubild <Formel tex="K_f" nach="." /> Es hat die Ecken <Formel tex="O(0\,|\,0)" nach="," /> <Formel tex="P(u\,|\,0)" nach="," /> <Formel tex="Q(u\,|\,f(u))" /> und <Formel tex="R(0\,|\,f(u))" nach="." />
      </p>
      <Teile ab={2}>
        <li>
          Zeigen Sie, dass der Flächeninhalt des Rechtecks durch <Formel tex={t`A(u)=12u-u^3`} /> beschrieben wird. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie <Formel tex="u" /> so, dass der Flächeninhalt am größten ist, und geben Sie ihn an. <BE n={3} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <Bild daten={BILD_A6_RECHTECK} unter={<>Das Schaubild von <Formel tex="f" /> mit dem Rechteck.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

export function OhneHilfsmittel() {
  return (
    <Abschnitt id="ohne-hilfsmittel" titel="Ohne Hilfsmittel">
      <p>
        Diese sechs Aufgaben löst du ohne Taschenrechner, mit exakten Werten. Die Bewertungseinheiten (BE) hinter den Teilaufgaben zeigen, wie umfangreich die Teilaufgabe ist. Hilfen und Lösungsweg kannst du schrittweise aufdecken.
      </p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Aufgabe2 />
      <Frage3a />
      <Frage3b />
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
    </Abschnitt>
  );
}
