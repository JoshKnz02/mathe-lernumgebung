import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Dreierbild } from '@/components/Paarbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import {
  BILDER_SCHAR,
  BILD_BECKEN_AUFGABE,
  BILD_BECKEN_DV,
  BILD_BECKEN_V,
  BILD_F4,
  BILD_F5,
  BILD_ZUORD,
  DREI_A1,
  DREI_A2,
  DREI_A3,
  DREI_A9,
  DREI_F4,
  DREI_F5,
  DREI_KUBISCH,
  DREI_KUBISCH_W,
  DREI_VIER,
  DREI_ZUORDNUNG,
} from './Bilder';
import { A1, A2, A3, A9, BECKEN, F5 } from './daten';

const KF = <Formel tex="K_f" />;
const KDF = <Formel tex="K_{f'}" />;
const KDDF = <Formel tex="K_{f''}" />;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl oder als Dezimalzahl mit Komma ein, zum Beispiel <code>2</code> oder <code>-1,5</code>, ohne Einheit. Negative Zahlen schreibst du mit Minuszeichen. Wo die Aufgabe es verlangt, rundest du auf zwei Nachkommastellen. Bei den Auswahlfragen wählst du genau eine Antwort aus.
    </Hinweis>
  );
}

/** Niveaustufe 1, Aufgabe 1: Extrem- und Wendepunkt einer Funktion dritten Grades. */
function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Extrempunkte und Wendepunkt einer Funktion dritten Grades"
      felder={[
        { id: 'h', name: 'x-Koordinate des Hochpunkts', beschriftung: <>Hochpunkt: <Formel tex="x" /></>, erwartet: A1.hoch },
        { id: 't', name: 'x-Koordinate des Tiefpunkts', beschriftung: <>Tiefpunkt: <Formel tex="x" /></>, erwartet: A1.tief },
        { id: 'yt', name: 'y-Koordinate des Tiefpunkts', beschriftung: <>Tiefpunkt: <Formel tex="y" /></>, erwartet: A1.yTief },
        { id: 'w', name: 'x-Koordinate des Wendepunkts', beschriftung: <>Wendepunkt: <Formel tex="x" /></>, erwartet: A1.wende },
        { id: 'yw', name: 'y-Koordinate des Wendepunkts', beschriftung: <>Wendepunkt: <Formel tex="y" /></>, erwartet: A1.yWende },
        { id: 'm', name: 'kleinste Steigung', beschriftung: <>kleinste Steigung von {KF}</>, erwartet: A1.steigungWende },
      ]}
      hilfen={[
        <>Bilde <Formel tex="f'" nach="," /> <Formel tex="f''" /> und <Formel tex="f'''" nach="." /> Löse <Formel tex="f'(x)=0" /> für die Extremstellen und <Formel tex="f''(x)=0" /> für die Wendestelle. Das sind die Kandidaten.</>,
        <>Weise jeden Kandidaten nach: Setze die Extremstellen in <Formel tex="f''" /> ein. Ist <Formel tex="f''" /> negativ, liegt ein Hochpunkt vor, ist <Formel tex="f''" /> positiv, ein Tiefpunkt. Die Wendestelle weist du mit <Formel tex={t`f'''(x)\ne 0`} /> nach.</>,
        <>Die y-Koordinaten berechnest du mit <Formel tex="f" nach="." /> Die kleinste Steigung ist ein Wert von <Formel tex="f'" nach="," /> und zwar an der Wendestelle, weil {KDF} eine nach oben geöffnete Parabel ist.</>,
      ]}
      loesung={[
        <>Die Ableitungen sind <Formel tex={t`f'(x)=\frac{3}{4}x^2-3x=\frac{3}{4}x(x-4)`} nach="," /> <Formel tex={t`f''(x)=\frac{3}{2}x-3`} /> und <Formel tex={t`f'''(x)=\frac{3}{2}`} nach="." /></>,
        <>Extremstellen: <Formel tex="f'(x)=0" /> liefert <Formel tex="x=0" /> und <Formel tex="x=4" nach="." /> Wegen <Formel tex="f''(0)=-3<0" /> liegt bei <Formel tex="x=0" /> ein Hochpunkt, wegen <Formel tex="f''(4)=3>0" /> bei <Formel tex="x=4" /> ein Tiefpunkt. Mit <Formel tex="f(0)=0" /> und <Formel tex="f(4)=16-24=-8" /> ist <Formel tex={t`H(0\,|\,0)`} /> und <Formel tex={t`T(4\,|\,-8)`} nach="." /></>,
        <>Wendestelle: <Formel tex="f''(x)=0" /> liefert <Formel tex="x=2" nach="." /> Wegen <Formel tex={t`f'''(2)=\frac{3}{2}\ne 0`} /> ist es eine Wendestelle. Mit <Formel tex="f(2)=2-6=-4" /> ist <Formel tex={t`W(2\,|\,-4)`} nach="." /></>,
        <>
          Steigung: <Formel tex="f'(2)=3-6=-3" nach="." /> {KDF} ist eine nach oben geöffnete Parabel mit dem Tiefpunkt bei <Formel tex="x=2" nach="," /> also ist <Formel tex="-3" /> die kleinste Steigung von {KF} überhaupt.
          <Dreierbild daten={DREI_A1} unter={<>Oben {KF} mit <Formel tex="H" nach="," /> <Formel tex="W" /> und <Formel tex="T" nach="," /> in der Mitte {KDF} mit dem Tiefpunkt bei <Formel tex="W" nach="," /> unten {KDDF} mit der Nullstelle bei <Formel tex="x=2" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=\frac{1}{4}x^3-\frac{3}{2}x^2`} nach="." /> Bestimme den Hochpunkt, den Tiefpunkt und den Wendepunkt von {KF} und weise sie nach. Wie groß ist die kleinste Steigung von <Formel tex="K_f" nach="?" />
      </p>
      <Kontrollschaubild>
        <Dreierbild daten={DREI_A1} unter={<>Oben {KF} mit den Punkten <Formel tex="H" nach="," /> <Formel tex="W" /> und <Formel tex="T" nach="," /> darunter {KDF} und {KDDF} mit den zusammengehörigen Punkten.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Niveaustufe 1, Aufgabe 2: Monotonie, Krümmung, Wendepunkte mit gerundeten Werten. */
function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Monotonie und Krümmung untersuchen"
      felder={[
        { id: 'a', name: 'Grenze des ersten Bereichs, in dem K f fällt', beschriftung: <>Grenze <Formel tex="a" /></>, erwartet: A2.fallendBis },
        { id: 'k', name: 'Wert der zweiten Ableitung an der Stelle 0', beschriftung: <><Formel tex="f''(0)" /></>, erwartet: A2.ddfBei0 },
        { id: 'w', name: 'positive Wendestelle auf zwei Nachkommastellen', beschriftung: <>positive Wendestelle</>, erwartet: A2.wende, toleranz: 0.005 },
        { id: 'yw', name: 'y-Koordinate der Wendepunkte auf zwei Nachkommastellen', beschriftung: <><Formel tex="y" />-Koordinate der Wendepunkte</>, erwartet: A2.yWende, toleranz: 0.005 },
      ]}
      hilfen={[
        <>Bilde <Formel tex="f'" /> und klammere aus: <Formel tex={t`f'(x)=\frac{1}{2}x^3-2x=\frac{1}{2}x(x-2)(x+2)`} nach="." /> Bestimme die Vorzeichen von <Formel tex="f'" /> in den Bereichen zwischen den Nullstellen.</>,
        <>Für die Krümmung brauchst du <Formel tex={t`f''(x)=\frac{3}{2}x^2-2`} nach="." /> Die Gleichung <Formel tex="f''(x)=0" /> hat zwei Lösungen, eine positive und eine negative.</>,
        <>Setze die positive Wendestelle in <Formel tex="f" /> ein, nicht in <Formel tex="f'" nach="." /> Runde erst am Ende und rechne mit dem genauen Wert <Formel tex={t`\frac{2}{\sqrt{3}}`} nach="." /></>,
      ]}
      loesung={[
        <>Monotonie: <Formel tex={t`f'(x)=\frac{1}{2}x(x-2)(x+2)`} /> hat die Nullstellen <Formel tex="x=-2" nach="," /> <Formel tex="x=0" /> und <Formel tex="x=2" nach="." /> Testwerte: <Formel tex="f'(-3)=-7{,}5<0" nach="," /> <Formel tex="f'(-1)=1{,}5>0" nach="," /> <Formel tex="f'(1)=-1{,}5<0" nach="," /> <Formel tex="f'(3)=7{,}5>0" nach="." /> {KF} fällt also auf <Formel tex={t`]-\infty;\,-2[`} /> und auf <Formel tex={t`]0;\,2[`} nach="," /> es steigt auf <Formel tex={t`]-2;\,0[`} /> und auf <Formel tex={t`]2;\,\infty[`} nach="." /> Es ist <Formel tex="a=-2" nach="." /></>,
        <>Extrempunkte: <Formel tex="f''(0)=-2<0" nach="," /> also liegt bei <Formel tex="x=0" /> ein Hochpunkt <Formel tex={t`H(0\,|\,0)`} nach="." /> Wegen <Formel tex="f''(\pm 2)=4>0" /> liegen bei <Formel tex="x=\pm 2" /> Tiefpunkte <Formel tex={t`T(\pm 2\,|\,-2)`} nach="."/></>,
        <>
          Krümmung: <Formel tex="f''(x)=0" /> liefert <Formel tex={t`x^2=\frac{4}{3}`} /> und damit <Formel tex={t`x=\pm\frac{2}{\sqrt{3}}\approx\pm 1{,}15`} nach="." /> Für <Formel tex="x<-1{,}15" /> und <Formel tex="x>1{,}15" /> ist <Formel tex="f''" /> positiv ({KF} linksgekrümmt), dazwischen negativ ({KF} rechtsgekrümmt). <Formel tex="f''" /> wechselt das Vorzeichen, außerdem ist <Formel tex="f'''(x)=3x\ne 0" nach="." /> Es sind also Wendestellen. Mit <Formel tex={t`f\left(\frac{2}{\sqrt{3}}\right)=\frac{2}{9}-\frac{4}{3}=-\frac{10}{9}\approx -1{,}11`} /> liegen die Wendepunkte bei <Formel tex={t`W(\pm 1{,}15\,|\,-1{,}11)`} nach="."/>
          <Dreierbild daten={DREI_A2} unter={<>Auf der x-Achse von {KDF} und {KDDF} sind die Bereiche mit positivem Wert blau und die mit negativem Wert schwarz markiert. {KF} ist symmetrisch zur y-Achse.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=\frac{1}{8}x^4-x^2`} nach="." /> Untersuche {KF} auf Monotonie, Krümmung und besondere Punkte. Gib an: Auf <Formel tex={t`]-\infty;\,a[`} /> fällt {KF} streng monoton, wie groß ist <Formel tex="a" nach="?" /> Welchen Wert hat <Formel tex="f''(0)" nach="?" /> Wo liegt die positive Wendestelle und wie groß ist die <Formel tex="y" />-Koordinate der Wendepunkte, jeweils auf zwei Nachkommastellen gerundet?
      </p>
      <Kontrollschaubild>
        <Dreierbild daten={DREI_A2} unter={<>Oben {KF} mit zwei Tiefpunkten, einem Hochpunkt und zwei Wendepunkten, darunter {KDF} und <Formel tex="K_{f''}" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Niveaustufe 1, Aufgabe 3: Sattelpunkt. */
function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Sattelpunkt"
      felder={[
        { id: 'n', name: 'Anzahl der Extrempunkte', beschriftung: <>Anzahl der Extrempunkte</>, erwartet: A3.extrempunkte },
        { id: 'x', name: 'x-Koordinate des Sattelpunkts', beschriftung: <>Sattelpunkt: <Formel tex="x" /></>, erwartet: A3.xSattel },
        { id: 'y', name: 'y-Koordinate des Sattelpunkts', beschriftung: <>Sattelpunkt: <Formel tex="y" /></>, erwartet: A3.ySattel },
      ]}
      hilfen={[
        <>Bilde <Formel tex="f'" /> und klammere 3 aus. Die Klammer ist eine binomische Formel. Prüfe, ob <Formel tex="f'" /> an der Nullstelle das Vorzeichen wechselt.</>,
        <>Für einen Wendepunkt brauchst du <Formel tex="f''(x)=0" /> und den Nachweis mit <Formel tex="f'''" /> oder dem Vorzeichenwechsel von <Formel tex="f''" nach="." /> Ein Sattelpunkt ist ein Wendepunkt, an dem zusätzlich <Formel tex="f'(x_0)=0" /> gilt.</>,
        <>Du kannst auch umformen: <Formel tex="f(x)=(x-2)^3+3" nach="." /> Das ist die Funktion <Formel tex="x^3" nach="," /> um 2 nach rechts und 3 nach oben verschoben.</>,
      ]}
      loesung={[
        <>Extrempunkte: <Formel tex={t`f'(x)=3x^2-12x+12=3(x-2)^2`} nach="." /> Die einzige Nullstelle ist <Formel tex="x=2" nach="." /> Dort wechselt <Formel tex="f'" /> das Vorzeichen nicht, denn <Formel tex={t`f'(x)\ge 0`} /> gilt überall. Es gibt keine Extrempunkte, {KF} steigt streng monoton.</>,
        <>Wendepunkt: <Formel tex="f''(x)=6x-12=6(x-2)" /> hat die Nullstelle <Formel tex="x=2" nach="," /> und es ist <Formel tex="f'''(2)=6\ne 0" nach="." /> Mit <Formel tex="f(2)=8-24+24-5=3" /> liegt der Wendepunkt bei <Formel tex={t`W(2\,|\,3)`} nach="." /></>,
        <>
          Wegen <Formel tex="f'(2)=0" /> ist die Tangente im Wendepunkt waagerecht: <Formel tex={t`S(2\,|\,3)`} /> ist ein (aufsteigender) Sattelpunkt.
          <Dreierbild daten={DREI_A3} unter={<>Bei <Formel tex="S" /> berührt {KDF} die x-Achse von oben, {KDDF} schneidet sie von minus nach plus. {KF} hat die Form von <Formel tex="x^3" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex="f(x)=x^3-6x^2+12x-5" nach="." /> Hat {KF} Extrempunkte? Gibt es einen Sattelpunkt? Gib die Anzahl der Extrempunkte und die Koordinaten des Sattelpunkts an.
      </p>
      <Kontrollschaubild>
        <Dreierbild daten={DREI_A3} unter={<>Oben <Formel tex="K_f" nach="," /> darunter {KDF} und <Formel tex="K_{f''}" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Niveaustufe 2, Frage 4: Aussagen über f aus dem Schaubild von f′. */
function Frage4() {
  const optionen = [
    opt(
      'w',
      <><Formel tex="K_f" /> hat bei <Formel tex="x=-1" /> einen Wendepunkt, denn <Formel tex="K_{f'}" /> hat dort einen Hochpunkt.</>,
      true,
      <>Richtig.</>,
    ),
    opt(
      't1',
      <><Formel tex="K_f" /> hat bei <Formel tex="x=1" /> einen Tiefpunkt, denn <Formel tex="K_{f'}" /> berührt dort die x-Achse.</>,
      false,
      <><Formel tex="K_{f'}" /> berührt die x-Achse bei <Formel tex="x=1" /> von oben, wechselt aber das Vorzeichen nicht. Für einen Tiefpunkt von <Formel tex="K_f" /> müsste <Formel tex="f'" /> von minus nach plus wechseln. <Formel tex="K_f" /> hat bei <Formel tex="x=1" /> eine waagerechte Tangente und steigt davor und danach: eine Sattelstelle.</>,
    ),
    opt(
      'm',
      <><Formel tex="K_f" /> ist auf <Formel tex={t`]-\infty;\,-2[`} /> streng monoton steigend.</>,
      false,
      <>Links von <Formel tex="x=-2" /> liegt <Formel tex="K_{f'}" /> unterhalb der x-Achse, dort ist <Formel tex="f'(x)<0" nach="." /> <Formel tex="K_f" /> fällt dort.</>,
    ),
    opt(
      'k',
      <><Formel tex="K_f" /> ist für <Formel tex="x>-1" /> linksgekrümmt, denn dort ist <Formel tex="f'" /> positiv.</>,
      false,
      <>Dass <Formel tex="f'" /> positiv ist, sagt nur, dass <Formel tex="K_f" /> steigt. Die Krümmung zeigt, ob <Formel tex="K_{f'}" /> steigt oder fällt: Zwischen <Formel tex="x=-1" /> und <Formel tex="x=1" /> fällt <Formel tex="K_{f'}" nach="," /> dort ist <Formel tex="K_f" /> rechtsgekrümmt. Erst rechts von <Formel tex="x=1" /> steigt <Formel tex="K_{f'}" /> wieder.</>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="4"
      titel="Aussagen über f aus dem Schaubild von f′"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            <Formel tex="K_{f'}" /> hat bei <Formel tex="x=-2" /> eine Nullstelle mit Vorzeichenwechsel von minus nach plus: <Formel tex="K_f" /> hat dort einen Tiefpunkt. Bei <Formel tex="x=-1" /> hat <Formel tex="K_{f'}" /> einen Hochpunkt, <Formel tex="f''" /> wechselt dort von plus nach minus: <Formel tex="K_f" /> wechselt von einer Linkskurve in eine Rechtskurve, es liegt ein Wendepunkt vor. Bei <Formel tex="x=1" /> berührt <Formel tex="K_{f'}" /> die x-Achse ohne Vorzeichenwechsel: <Formel tex="K_f" /> hat dort eine aufsteigende Sattelstelle, keinen Extrempunkt.
          </p>
          <Dreierbild daten={DREI_F4} unter={<>Oben <Formel tex="K_f" /> mit <Formel tex="T" nach="," /> <Formel tex="W" /> und <Formel tex="S" nach="," /> in der Mitte das gegebene <Formel tex="K_{f'}" /> und unten <Formel tex="K_{f''}" /> mit den Bereichen auf der x-Achse.</>} />
        </>
      }
    >
      <p>
        Das Schaubild zeigt <Formel tex="K_{f'}" /> der Ableitungsfunktion einer Funktion <Formel tex="f" nach="." /> Welche Aussage über <Formel tex="K_f" /> ist richtig?
      </p>
      <Bild daten={BILD_F4} unter={<>Das Schaubild <Formel tex="K_{f'}" /> mit Nullstellen bei <Formel tex="x=-2" /> und <Formel tex="x=1" /> und einem Hochpunkt bei <Formel tex="x=-1" nach="." /></>} />
    </Auswahlfrage>
  );
}

/** Niveaustufe 2, Aufgabe 5: Wendestellen aus dem Schaubild von f″. */
function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Wendestellen aus dem Schaubild von f″"
      felder={[
        { id: 'n0', name: 'Anzahl der Nullstellen von f zweistrich', beschriftung: <>Nullstellen von <Formel tex="f''" /></>, erwartet: F5.anzahlNullstellen },
        { id: 'nw', name: 'Anzahl der Wendestellen von K f', beschriftung: <>Wendestellen von {KF}</>, erwartet: F5.anzahlWendestellen },
        { id: 'a', name: 'rechte Grenze a des Bereichs, in dem K f rechtsgekrümmt ist', beschriftung: <>größtes mögliches <Formel tex="a" /></>, erwartet: F5.rechtsBis },
      ]}
      hilfen={[
        <>Zähle die Stellen, an denen {KDDF} die x-Achse trifft. Prüfe an jeder, ob {KDDF} das Vorzeichen wechselt oder die Achse nur berührt.</>,
        <>Eine Wendestelle braucht einen Vorzeichenwechsel von <Formel tex="f''" nach="." /> {KF} ist rechtsgekrümmt, wo <Formel tex="f''" /> negativ ist. Eine einzelne Berührstelle unterbricht das nicht, denn <Formel tex="f'" /> fällt dort weiter.</>,
      ]}
      loesung={[
        <>{KDDF} trifft die x-Achse bei <Formel tex="x=-2" nach="," /> <Formel tex="x=0" /> und <Formel tex="x=3" nach="." /> Das sind drei Nullstellen von <Formel tex="f''" nach="." /></>,
        <>Bei <Formel tex="x=-2" /> wechselt <Formel tex="f''" /> von plus nach minus, bei <Formel tex="x=3" /> von minus nach plus: Dort hat {KF} Wendestellen. Bei <Formel tex="x=0" /> berührt {KDDF} die x-Achse von unten, ohne das Vorzeichen zu wechseln. Das sind zwei Wendestellen.</>,
        <>
          <Formel tex="f''" /> ist auf <Formel tex={t`]-2;\,0[`} /> und auf <Formel tex={t`]0;\,3[`} /> negativ und bei <Formel tex="x=0" /> null. <Formel tex="f'" /> fällt auch durch <Formel tex="x=0" /> hindurch, also ist {KF} auf <Formel tex={t`]-2;\,3[`} /> rechtsgekrümmt: <Formel tex="a=3" nach="." />
          <Dreierbild daten={DREI_F5} unter={<>Unten das gegebene {KDDF} mit den Bereichen auf der x-Achse (schwarz: <Formel tex="f''" /> negativ, {KF} rechtsgekrümmt), darüber {KDF} und {KF} mit den Wendepunkten <Formel tex="W" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Das Schaubild zeigt {KDDF} der zweiten Ableitung einer Funktion <Formel tex="f" nach="." /> Wie viele Nullstellen hat <Formel tex="f''" nach="?" /> Wie viele Wendestellen hat <Formel tex="K_f" nach="?" /> Auf <Formel tex={t`]-2;\,a[`} /> ist {KF} rechtsgekrümmt: Wie groß ist <Formel tex="a" /> höchstens?
      </p>
      <Bild daten={BILD_F5} unter={<>Das Schaubild {KDDF} mit Nullstellen bei <Formel tex="x=-2" nach="," /> <Formel tex="x=0" /> und <Formel tex="x=3" nach="." /></>} />
      <Kontrollschaubild>
        <Dreierbild daten={DREI_F5} unter={<>Unten {KDDF} mit Bereichen, darüber {KDF} und {KF} mit den Wendepunkten <Formel tex="W" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Niveaustufe 2, Frage 6: f, f′ und f″ zuordnen, ein Schaubild gehört zu keiner der Funktionen. */
function Frage6() {
  const optionen = [
    opt('richtig', <><Formel tex="f" nach=":" /> <Formel tex="C" nach="," /> <Formel tex="f'" nach=":" /> <Formel tex="A" nach="," /> <Formel tex="f''" nach=":" /> <Formel tex="D" /></>, true, <>Richtig.</>),
    opt(
      'b',
      <><Formel tex="f" nach=":" /> <Formel tex="C" nach="," /> <Formel tex="f'" nach=":" /> <Formel tex="B" nach="," /> <Formel tex="f''" nach=":" /> <Formel tex="D" /></>,
      false,
      <><Formel tex="B" /> sieht aus wie <Formel tex="A" nach="," /> ist aber nach oben verschoben. <Formel tex="C" /> hat bei <Formel tex="x=0" /> einen Hochpunkt, dort müsste <Formel tex="f'" /> eine Nullstelle haben. <Formel tex="B" /> ist bei <Formel tex="x=0" /> aber nicht null, <Formel tex="A" /> schon.</>,
    ),
    opt(
      'a',
      <><Formel tex="f" nach=":" /> <Formel tex="A" nach="," /> <Formel tex="f'" nach=":" /> <Formel tex="D" nach="," /> <Formel tex="f''" nach=":" /> <Formel tex="C" /></>,
      false,
      <>Der erste Schritt stimmt: Die Ableitung von <Formel tex="A" /> ist eine Parabel wie <Formel tex="D" nach="." /> Die zweite Ableitung wäre dann aber eine Gerade, und <Formel tex="C" /> ist keine Gerade. Beim Ableiten sinkt der Grad um 1.</>,
    ),
    opt(
      'd',
      <><Formel tex="f" nach=":" /> <Formel tex="D" nach="," /> <Formel tex="f'" nach=":" /> <Formel tex="A" nach="," /> <Formel tex="f''" nach=":" /> <Formel tex="C" /></>,
      false,
      <><Formel tex="D" /> ist eine Parabel. Ihre Ableitung ist eine Gerade, nicht das Schaubild <Formel tex="A" nach="." /> Außerdem hat <Formel tex="D" /> nur eine waagerechte Tangente, <Formel tex="A" /> aber drei Nullstellen.</>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="6"
      titel="f, f′ und f″ zuordnen"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            <Formel tex="C" /> ist w-förmig und hat drei waagerechte Tangenten bei <Formel tex="x=0" /> und <Formel tex={t`x=\pm\sqrt{3}`} nach="." /> An diesen Stellen muss <Formel tex="f'" /> Nullstellen mit Vorzeichenwechsel haben. Das erfüllt nur <Formel tex="A" nach="," /> also ist <Formel tex="C" /> das Schaubild von <Formel tex="f" /> und <Formel tex="A" /> das von <Formel tex="f'" nach="." /> <Formel tex="A" /> hat Extrempunkte bei <Formel tex="x=\pm 1" nach="," /> dort muss <Formel tex="f''" /> Nullstellen mit Vorzeichenwechsel haben. Das ist <Formel tex="D" nach="." /> Das Schaubild <Formel tex="B" /> gehört zu keiner der drei Funktionen.
          </p>
          <Dreierbild daten={DREI_ZUORDNUNG} unter={<>Oben <Formel tex="C" /> als <Formel tex="K_f" nach="," /> in der Mitte <Formel tex="A" /> als <Formel tex="K_{f'}" nach="," /> unten <Formel tex="D" /> als {KDDF} mit den zusammengehörigen Punkten <Formel tex="T" nach="," /> <Formel tex="H" /> und <Formel tex="W" nach="." /></>} />
        </>
      }
    >
      <p>
        Drei der vier Schaubilder <Formel tex="A" /> bis <Formel tex="D" /> gehören zu einer Funktion <Formel tex="f" nach="," /> ihrer ersten Ableitung <Formel tex="f'" /> und ihrer zweiten Ableitung <Formel tex="f''" nach="." /> Eines gehört zu keiner dieser Funktionen. Welche Zuordnung stimmt?
      </p>
      <div className="bilder-paar">
        {(['A', 'B', 'C', 'D'] as const).map((b) => (
          <Bild key={b} daten={BILD_ZUORD[b]!} unter={<>Das Schaubild <Formel tex={b} nach="." /></>} />
        ))}
      </div>
    </Auswahlfrage>
  );
}

/** Niveaustufe 2, Frage 7: Argumentieren, f″(x₀) = 0 genügt nicht für einen Wendepunkt. */
function Frage7() {
  const optionen = [
    opt(
      'gegen',
      <>Falsch. Bei <Formel tex={t`f(x)=\frac{1}{12}x^4`} /> ist <Formel tex="f''(x)=x^2" /> bei <Formel tex="x_0=0" /> null, aber <Formel tex="f''" /> wechselt dort das Vorzeichen nicht. {KF} ist auf beiden Seiten linksgekrümmt.</>,
      true,
      <>Richtig.</>,
    ),
    opt(
      'wahr',
      <>Wahr, denn an jeder Wendestelle ist <Formel tex="f''" /> null. Also ist jede Nullstelle von <Formel tex="f''" /> eine Wendestelle.</>,
      false,
      <>Das ist eine Verwechslung von notwendig und hinreichend. Aus „an jeder Wendestelle ist <Formel tex="f''=0" />“ folgt nicht die Umkehrung. Nullstellen von <Formel tex="f''" /> sind nur Kandidaten.</>,
    ),
    opt(
      'waagerecht',
      <>Falsch, denn an einem Wendepunkt müsste zusätzlich <Formel tex="f'(x_0)=0" /> gelten.</>,
      false,
      <>Das gilt nur für Sattelpunkte. Die Funktion <Formel tex={t`\frac{1}{2}x^3-\frac{3}{2}x^2+2`} /> hat bei <Formel tex="x_0=1" /> einen Wendepunkt, dort ist <Formel tex={t`f'(1)=-\frac{3}{2}`} nach="." /> Die Tangente ist nicht waagerecht.</>,
    ),
    opt(
      'k',
      <>Wahr, denn <Formel tex="f''(x_0)=0" /> heißt, dass {KDF} bei <Formel tex="x_0" /> eine waagerechte Tangente hat, und dort liegt immer ein Extrempunkt von <Formel tex="K_{f'}" nach="." /></>,
      false,
      <>Auch bei {KDF} ist eine waagerechte Tangente nur ein Kandidat. Bei <Formel tex={t`f(x)=\frac{1}{12}x^4`} /> ist <Formel tex={t`f'(x)=\frac{1}{3}x^3`} nach="," /> und {KDF} hat im Ursprung eine waagerechte Tangente, aber keinen Extrempunkt.</>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="7"
      titel="Wahr oder falsch? Argumentieren mit f″"
      optionen={platziere(optionen, 3)}
      erklaerung={
        <>
          <p>
            Die Bedingung <Formel tex="f''(x_0)=0" /> ist notwendig für eine Wendestelle, aber nicht hinreichend. Für <Formel tex={t`f(x)=\frac{1}{12}x^4`} /> ist <Formel tex="f''(x)=x^2" /> bei <Formel tex="x_0=0" /> null und links und rechts positiv. Es gibt keinen Vorzeichenwechsel, also keine Wendestelle. Bei <Formel tex="x_0=0" /> liegt ein Tiefpunkt.
          </p>
          <Dreierbild daten={DREI_VIER} unter={<>Oben {KF} mit dem Tiefpunkt <Formel tex="T" nach="," /> unten {KDDF} als Parabel, die bei <Formel tex="T" /> die x-Achse berührt und sonst positiv bleibt.</>} />
          <p>
            Ein Wendepunkt braucht keine waagerechte Tangente. Nur ein Sattelpunkt hat sie. Das zeigt die Funktion <Formel tex={t`\frac{1}{2}x^3-\frac{3}{2}x^2+2`} /> mit dem Wendepunkt <Formel tex={t`W(1\,|\,1)`} nach=":" /> Dort ist {KDF} nicht null, sondern hat seinen Tiefpunkt bei <Formel tex={t`-\frac{3}{2}`} nach="."/>
          </p>
          <Dreierbild daten={DREI_KUBISCH_W} unter={<>Oben {KF} mit dem Wendepunkt <Formel tex="W" nach="," /> in der Mitte {KDF} mit dem Tiefpunkt bei <Formel tex="W" nach="," /> unten {KDDF} mit der Nullstelle bei <Formel tex="x=1" nach="." /></>} />
        </>
      }
    >
      <p>
        Behauptung: Wenn <Formel tex="f''(x_0)=0" /> gilt, hat {KF} an der Stelle <Formel tex="x_0" /> einen Wendepunkt. Welche Antwort ist richtig?
      </p>
    </Auswahlfrage>
  );
}

/** Niveaustufe 2, Aufgabe 8: Anwendung, größte Zuflussrate. */
function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Wann nimmt die Wassermenge am schnellsten zu?"
      felder={[
        { id: 't', name: 'Zeitpunkt der größten Zuflussrate in Stunden', beschriftung: <>Zeitpunkt in Stunden</>, erwartet: BECKEN.tSchnell },
        { id: 'r', name: 'größte Zuflussrate in Kubikmetern pro Stunde', beschriftung: <>größte Zuflussrate in <Formel tex={t`\mathrm{m}^3/\mathrm{h}`} /></>, erwartet: BECKEN.zufluss },
        { id: 'v', name: 'Wassermenge zu diesem Zeitpunkt in Kubikmetern', beschriftung: <>Wassermenge in <Formel tex={t`\mathrm{m}^3`} /></>, erwartet: BECKEN.mengeDann },
        { id: 'e', name: 'Zuflussrate nach 6 Stunden in Kubikmetern pro Stunde', beschriftung: <>Zuflussrate nach 6 Stunden in <Formel tex={t`\mathrm{m}^3/\mathrm{h}`} /></>, erwartet: BECKEN.zuflussEnde },
      ]}
      hilfen={[
        <>Die Zuflussrate ist die Ableitung <Formel tex="V'(t)" nach="." /> Sie ist am größten, wo <Formel tex="V'" /> ihren größten Wert hat. Das ist eine Wendestelle von <Formel tex="V" nach="." /></>,
        <>Löse <Formel tex="V''(t)=0" /> und prüfe mit <Formel tex="V'''" nach="," /> ob <Formel tex="V'" /> dort ein Maximum hat. Vergleiche mit den Randwerten <Formel tex="V'(0)" /> und <Formel tex="V'(6)" nach="." /></>,
        <>Die Wassermenge zum Zeitpunkt <Formel tex="t" /> berechnest du mit <Formel tex="V" nach="," /> die Zuflussrate mit <Formel tex="V'" nach="." /></>,
      ]}
      loesung={[
        <>Ableitungen: <Formel tex={t`V'(t)=-\frac{1}{4}t^2+\frac{3}{2}t=\frac{1}{4}t(6-t)`} nach="," /> <Formel tex={t`V''(t)=-\frac{1}{2}t+\frac{3}{2}`} /> und <Formel tex={t`V'''(t)=-\frac{1}{2}`} nach="." /></>,
        <><Formel tex="V''(t)=0" /> liefert <Formel tex="t=3" nach="." /> Wegen <Formel tex="V'''(3)=-\frac{1}{2}<0" /> hat <Formel tex="V'" /> bei <Formel tex="t=3" /> ein Maximum. Die Randwerte sind <Formel tex="V'(0)=0" /> und <Formel tex="V'(6)=0" nach="," /> also kleiner. Die Menge nimmt nach drei Stunden am schnellsten zu.</>,
        <>
          Die größte Zuflussrate ist <Formel tex={t`V'(3)=-\frac{9}{4}+\frac{9}{2}=\frac{9}{4}=2{,}25`} /> Kubikmeter pro Stunde. Die Wassermenge ist dann <Formel tex={t`V(3)=-\frac{27}{12}+\frac{27}{4}=4{,}5`} /> Kubikmeter. Nach 6 Stunden ist <Formel tex="V'(6)=0" nach="," /> es fließt nichts mehr zu, die Menge beträgt <Formel tex="V(6)=9" /> Kubikmeter.
          <div className="bilder-paar">
            <Bild daten={BILD_BECKEN_V} unter={<>Die Wassermenge <Formel tex="V" /> mit dem Wendepunkt <Formel tex="W" /> und seiner Tangente (Steigung 2,25).</>} />
            <Bild daten={BILD_BECKEN_DV} unter={<>Die Zuflussrate <Formel tex="V'" /> mit dem Hochpunkt <Formel tex="H" /> bei <Formel tex="t=3" nach="." /></>} />
          </div>
        </>,
      ]}
    >
      <p>
        Ein Becken wird mit Wasser gefüllt. Die Wassermenge in Kubikmetern nach <Formel tex="t" /> Stunden beschreibt für <Formel tex={t`0\le t\le 6`} /> die Funktion <Formel tex={t`V(t)=-\frac{1}{12}t^3+\frac{3}{4}t^2`} nach="." /> Die Zuflussrate ist die Änderungsrate der Wassermenge. Wann ist die Zuflussrate am größten? Wie groß ist sie, und wie viel Wasser ist dann im Becken? Wie groß ist die Zuflussrate nach 6 Stunden?
      </p>
      <Bild daten={BILD_BECKEN_AUFGABE} unter={<>Die Wassermenge <Formel tex="V" /> in Kubikmetern über der Zeit <Formel tex="t" /> in Stunden.</>} />
      <Kontrollschaubild>
        <div className="bilder-paar">
          <Bild daten={BILD_BECKEN_V} unter={<>Die Wassermenge <Formel tex="V" /> mit dem Wendepunkt <Formel tex="W" /> und seiner Tangente.</>} />
          <Bild daten={BILD_BECKEN_DV} unter={<>Die Zuflussrate <Formel tex="V'" nach="." /></>} />
        </div>
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Niveaustufe 3, Aufgabe 9: Parameter bestimmen. */
function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Parameter bestimmen"
      felder={[
        { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: A9.a },
        { id: 'b', name: 'Parameter b', beschriftung: <><Formel tex="b" /></>, erwartet: A9.b },
        { id: 'y', name: 'y-Koordinate des Extrempunkts bei x gleich minus 1', beschriftung: <>Extrempunkt: <Formel tex="y" /></>, erwartet: A9.yHoch },
      ]}
      hilfen={[
        <>Übersetze jede Angabe in eine Gleichung: Eine Wendestelle bei <Formel tex="x=1" /> bedeutet <Formel tex="f''(1)=0" nach="," /> eine Extremstelle bei <Formel tex="x=-1" /> bedeutet <Formel tex="f'(-1)=0" nach="." /></>,
        <>Es ist <Formel tex="f'(x)=3x^2+2ax+b" /> und <Formel tex="f''(x)=6x+2a" nach="." /> Aus <Formel tex="f''(1)=0" /> erhältst du <Formel tex="a" nach="," /> danach aus <Formel tex="f'(-1)=0" /> den Wert <Formel tex="b" nach="." /></>,
        <>Mache am Ende die Probe: Wechselt <Formel tex="f'" /> bei <Formel tex="x=-1" /> das Vorzeichen, und wechselt <Formel tex="f''" /> bei <Formel tex="x=1" /> das Vorzeichen? Erst dann sind die Angaben erfüllt.</>,
      ]}
      loesung={[
        <><Formel tex="f''(1)=6+2a=0" /> liefert <Formel tex="a=-3" nach="." /></>,
        <><Formel tex="f'(-1)=3-2a+b=3+6+b=0" /> liefert <Formel tex="b=-9" nach="." /></>,
        <>Probe: <Formel tex="f(x)=x^3-3x^2-9x" /> hat <Formel tex="f'(x)=3x^2-6x-9=3(x+1)(x-3)" nach="." /> Bei <Formel tex="x=-1" /> wechselt <Formel tex="f'" /> von plus nach minus: Hochpunkt. <Formel tex="f''(x)=6x-6" /> wechselt bei <Formel tex="x=1" /> das Vorzeichen: Wendepunkt.</>,
        <>
          Mit <Formel tex="f(-1)=-1-3+9=5" /> ist der Hochpunkt <Formel tex={t`H(-1\,|\,5)`} nach="." /> Der Wendepunkt ist <Formel tex={t`W(1\,|\,-11)`} nach="," /> der Tiefpunkt <Formel tex={t`T(3\,|\,-27)`} nach="."/>
          <Dreierbild daten={DREI_A9} unter={<>Oben {KF} mit <Formel tex="H" nach="," /> <Formel tex="W" /> und <Formel tex="T" nach="," /> darunter {KDF} und {KDDF} mit den Bereichen auf der x-Achse.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex="f(x)=x^3+ax^2+bx" /> mit <Formel tex={t`a,\,b\in\mathbb{R}`} nach="." /> Das Schaubild {KF} hat bei <Formel tex="x=1" /> einen Wendepunkt und bei <Formel tex="x=-1" /> einen Extrempunkt. Bestimme <Formel tex="a" /> und <Formel tex="b" nach="." /> Wie groß ist die <Formel tex="y" />-Koordinate des Extrempunkts bei <Formel tex="x=-1" nach="?" />
      </p>
      <Kontrollschaubild>
        <Dreierbild daten={DREI_A9} unter={<>Oben {KF} mit Hochpunkt, Wendepunkt und Tiefpunkt, darunter {KDF} und <Formel tex="K_{f''}" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Niveaustufe 3, Frage 10: Parameter t, Fallunterscheidung. */
function Frage10() {
  const optionen = [
    opt('pos', <>Nur für <Formel tex="t>0" nach="." /></>, true, <>Richtig.</>),
    opt(
      'nichtneg',
      <>Für <Formel tex={t`t\ge 0`} nach="." /></>,
      false,
      <>Für <Formel tex="t=0" /> ist <Formel tex="f_0'(x)=3x^2" nach="." /> Das ist nie negativ, <Formel tex="f_0'" /> wechselt das Vorzeichen nicht. {KF} hat im Ursprung eine waagerechte Tangente und einen Sattelpunkt, aber keinen Extrempunkt.</>,
    ),
    opt(
      'neg',
      <>Nur für <Formel tex="t<0" nach="." /></>,
      false,
      <>Für <Formel tex="t<0" /> ist <Formel tex="3x^2-3t" /> eine Summe aus einem nichtnegativen und einem positiven Wert, also immer positiv. <Formel tex="f_t'" /> hat dann keine Nullstelle, das Schaubild steigt überall.</>,
    ),
    opt(
      'alle',
      <>Für jeden Wert von <Formel tex="t" nach="." /></>,
      false,
      <>Für <Formel tex={t`t\le 0`} /> hat <Formel tex="f_t'" /> keine Nullstelle mit Vorzeichenwechsel: bei <Formel tex="t=0" /> nur eine Berührstelle, bei <Formel tex="t<0" /> gar keine Nullstelle. Zwei Extremstellen <Formel tex={t`x=\pm\sqrt{t}`} /> gibt es nur für <Formel tex="t>0" nach="." /></>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="10"
      titel="Extrempunkte einer Funktionenschar"
      optionen={platziere(optionen, 0)}
      erklaerung={
        <>
          <p>
            Es ist <Formel tex="f_t'(x)=3x^2-3t=3(x^2-t)" nach="." /> Für <Formel tex="t>0" /> hat <Formel tex="f_t'" /> die zwei Nullstellen <Formel tex={t`x=\pm\sqrt{t}`} /> mit Vorzeichenwechsel: ein Hochpunkt bei <Formel tex={t`x=-\sqrt{t}`} /> und ein Tiefpunkt bei <Formel tex={t`x=\sqrt{t}`} nach="." /> Für <Formel tex="t=0" /> ist <Formel tex="f_0'(x)=3x^2" /> mit einer Nullstelle ohne Vorzeichenwechsel, für <Formel tex="t<0" /> gibt es keine Nullstelle.
          </p>
          <div className="bilder-paar">
            {BILDER_SCHAR.map((b) => (
              <Bild key={b.t} daten={b.daten} unter={<>Das Schaubild für <Formel tex={`t=${b.t}`} nach="." /></>} />
            ))}
          </div>
        </>
      }
    >
      <p>
        Gegeben ist die Funktionenschar <Formel tex="f_t(x)=x^3-3tx" /> mit <Formel tex={t`t\in\mathbb{R}`} nach="." /> Für welche Werte von <Formel tex="t" /> hat das Schaubild von <Formel tex="f_t" /> Extrempunkte?
      </p>
    </Auswahlfrage>
  );
}

/** Niveaustufe 3, Frage 11: Beweisen, jede Funktion dritten Grades hat genau einen Wendepunkt. */
function Frage11() {
  const optionen = [
    opt(
      'ok',
      <><Formel tex="f''(x)=6ax+2b" /> ist linear mit der einzigen Nullstelle <Formel tex={t`x=-\frac{b}{3a}`} nach="." /> Wegen <Formel tex={t`f'''(x)=6a\ne 0`} /> wechselt <Formel tex="f''" /> dort das Vorzeichen. Also gibt es genau einen Wendepunkt.</>,
      true,
      <>Richtig.</>,
    ),
    opt(
      'unvollstaendig',
      <><Formel tex="f''(x)=6ax+2b" /> hat genau eine Nullstelle <Formel tex={t`x=-\frac{b}{3a}`} nach="." /> Also gibt es genau einen Wendepunkt.</>,
      false,
      <>Die Nullstelle von <Formel tex="f''" /> ist nur ein Kandidat, die notwendige Bedingung. Es fehlt der Nachweis, dass <Formel tex="f''" /> dort das Vorzeichen wechselt, zum Beispiel mit <Formel tex={t`f'''(x)=6a\ne 0`} nach="." /></>,
    ),
    opt(
      'ableitung',
      <><Formel tex="f'(x)=3ax^2+2bx+c" /> hat höchstens zwei Nullstellen. An diesen Stellen liegen die Wendepunkte.</>,
      false,
      <>Nullstellen von <Formel tex="f'" /> sind Kandidaten für Extremstellen, nicht für Wendestellen. Die Wendestellen findest du mit <Formel tex="f''" nach="." /></>,
    ),
    opt(
      'konstant',
      <><Formel tex={t`f'''(x)=6a`} /> ist konstant und nie null. Also hat {KF} keinen Wendepunkt.</>,
      false,
      <>Die Bedingung <Formel tex={t`f'''(x_0)\ne 0`} /> ist die hinreichende Bedingung, wenn <Formel tex="f''(x_0)=0" /> gilt. Weil <Formel tex="f'''" /> nie null ist, ist jede Nullstelle von <Formel tex="f''" /> ein Wendepunkt, und <Formel tex="f''" /> hat eine.</>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="11"
      titel="Beweisen: Wendepunkt einer Funktion dritten Grades"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Ein vollständiger Nachweis braucht beide Teile: die notwendige Bedingung <Formel tex="f''(x)=0" /> liefert genau einen Kandidaten, weil <Formel tex="f''" /> linear ist. Die hinreichende Bedingung <Formel tex={t`f'''(x)\ne 0`} /> zeigt, dass <Formel tex="f''" /> dort das Vorzeichen wechselt. Beim Beispiel zeigt {KDDF} eine Gerade, die die x-Achse genau einmal schneidet.
          </p>
          <Dreierbild daten={DREI_KUBISCH} unter={<>Eine Funktion dritten Grades: {KDDF} ist eine Gerade mit genau einer Nullstelle, dort hat {KF} den Wendepunkt <Formel tex="W" nach="." /></>} />
        </>
      }
    >
      <p>
        Behauptung: Jede ganzrationale Funktion dritten Grades <Formel tex={t`f(x)=ax^3+bx^2+cx+d`} /> mit <Formel tex={t`a\ne 0`} /> hat genau einen Wendepunkt. Welche Begründung ist richtig und vollständig?
      </p>
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Die Aufgaben sind wie auf dem Arbeitsblatt in drei Niveaustufen geordnet. Hilfen und Lösungsweg kannst du schrittweise aufdecken, bei vielen Aufgaben gibt es ein Schaubild zur Kontrolle. In den Schaubildern steht {KF} oben, {KDF} in der Mitte und {KDDF} unten.
      </p>
      <Eingabehinweis />

      <h3>Niveaustufe 1: Rezeptaufgaben</h3>
      <Aufgabe1 />
      <Aufgabe2 />
      <Aufgabe3 />

      <h3>Niveaustufe 2: Argumentieren, Zuordnen und Anwenden</h3>
      <Frage4 />
      <Aufgabe5 />
      <Frage6 />
      <Frage7 />
      <Aufgabe8 />

      <h3>Niveaustufe 3: Parameter bestimmen und beweisen</h3>
      <Aufgabe9 />
      <Frage10 />
      <Frage11 />
    </Abschnitt>
  );
}
