import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { AufKlick } from '@/components/AufKlick';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage, type Option } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { Hinweis } from '@/components/Hinweis';
import { FARBEN } from '@/components/Zeichenbrett';
import { termSinus, wertTrig } from '@/lib/sinus';
import { piTex, zahlTex } from '@/lib/zahlen';
import { E10, E4, E5, E6, E7, H8, INTERVALL_AB, INTERVALL_C, NORMAL, P10, P4, P5, P6, P8, P8_KOSINUS, P9, T8 } from './daten';
import { Markantelabor } from './Markantelabor';
import { PunkteSchaubild } from './PunkteSchaubild';

const PI = Math.PI;
const neg = (s: string) => (s.startsWith('-') ? `{${s}}` : s);
const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });
const mit = { immerKlammer: true } as const;
const TERM6 = String.raw`g(x)=\tfrac{1}{3}\cos\bigl(4\,(x-\pi)\bigr)`;

function Beobachtung({ children }: { children: ReactNode }) {
  return (
    <details className="beobachtung">
      <summary>Beobachtung vergleichen</summary>
      <div>{children}</div>
    </details>
  );
}

export default function Modul() {
  return (
    <>
      <Abschnitt id="erklaeren" titel="Erklären">
        <h3>Wozu markante Punkte?</h3>
        <p>
          Kennst du die Hochpunkte, Tiefpunkte und Wendepunkte eines Schaubilds, kannst du es schnell skizzieren. Umgekehrt kannst du aus diesen Punkten die Funktionsgleichung aufstellen. In diesem Modul lernst du, wie du diese Punkte findest und was sie bedeuten.
        </p>

        <h3>Begriffe und Schreibweise</h3>
        <ul className="liste">
          <li>
            Ein <strong>Hochpunkt</strong> (HP) ist ein Punkt des Schaubilds, der höher liegt als alle Punkte in seiner Nähe. Ein <strong>Tiefpunkt</strong> (TP) liegt tiefer als alle Punkte in seiner Nähe. Hoch- und Tiefpunkte heißen zusammen <strong>Extrempunkte</strong>.
          </li>
          <li>
            Ein <strong>Wendepunkt</strong> (WP) ist ein Punkt, an dem das Schaubild von einer Linkskurve in eine Rechtskurve übergeht oder umgekehrt. Bei einem <strong>aufsteigenden</strong> Wendepunkt steigt das Schaubild, bei einem <strong>absteigenden</strong> fällt es.
          </li>
          <li>
            <strong>Markante Punkte</strong> sind die Hochpunkte, Tiefpunkte und Wendepunkte zusammen.
          </li>
          <li>
            Die x-Koordinaten schreiben wir <Formel tex="x_{\text{HP}}" nach="," /> <Formel tex="x_{\text{TP}}" /> und <Formel tex="x_{\text{WP}}" nach="." /> Die größte und die kleinste y-Koordinate heißen <Formel tex="y_{\max}" /> und <Formel tex="y_{\min}" nach="." /> Ein Hochpunkt hat also die Koordinaten <Formel tex="H(x_{\text{HP}}\,|\,y_{\max})" nach="." />
          </li>
        </ul>

        <h3>Wiederholung aus dem letzten Modul</h3>
        <p>
          Für die allgemeine Sinusfunktion <Formel tex="g(x)=a\cdot\sin\bigl(b\,(x-c)\bigr)+d" /> und die allgemeine Kosinusfunktion <Formel tex="g(x)=a\cdot\cos\bigl(b\,(x-c)\bigr)+d" /> gilt: Die Ruhelage ist <Formel tex="y=d" nach="," /> die Amplitude ist <Formel tex="|a|" nach="," /> der Wertebereich ist <Formel tex="[d-|a|;\,d+|a|]" /> und die Periode ist <Formel tex="p=\tfrac{2\pi}{b}" nach="." /> In diesem Modul ist immer <Formel tex="b>0" nach="." /> <Formel tex="K_f" /> bezeichnet das Schaubild von <Formel tex="f" nach="." />
        </p>
      </Abschnitt>

      <Abschnitt id="entdecken" titel="Entdecken">
        <h3>Vermutung</h3>
        <p>
          Überlege, bevor du das Labor benutzt. Du kennst die Schaubilder von <Formel tex="\sin(x)" /> und <Formel tex="\cos(x)" /> aus dem ersten Modul. Notiere für eine Periode von <Formel tex="x=0" /> bis <Formel tex="x=2\pi" nach=":" />
        </p>
        <ul className="liste">
          <li>Wo liegen bei <Formel tex="\sin(x)" /> die Hochpunkte, Tiefpunkte und Wendepunkte und welche y-Werte haben sie?</li>
          <li>Wo liegen sie bei <Formel tex="\cos(x)" nach="?" /></li>
          <li>Welchen Bruchteil der Periode <Formel tex="p=2\pi" /> macht jede dieser x-Koordinaten aus?</li>
        </ul>
        <Beobachtung>
          <Formel tex="\sin(x)" nach=":" /> Wendepunkte bei <Formel tex="0" nach="," /> <Formel tex="\pi" /> und <Formel tex="2\pi" /> (y-Wert 0), Hochpunkt bei <Formel tex="\tfrac{\pi}{2}=\tfrac{1}{4}p" /> (y-Wert 1), Tiefpunkt bei <Formel tex="\tfrac{3\pi}{2}=\tfrac{3}{4}p" /> (y-Wert <Formel tex="-1" nach=")." /> <Formel tex="\cos(x)" nach=":" /> Hochpunkt bei <Formel tex="0" nach="," /> Tiefpunkt bei <Formel tex="\pi=\tfrac{1}{2}p" nach="," /> Wendepunkte bei <Formel tex="\tfrac{\pi}{2}=\tfrac{1}{4}p" /> und <Formel tex="\tfrac{3\pi}{2}=\tfrac{3}{4}p" nach="." />
        </Beobachtung>

        <h3>Labor</h3>
        <p>
          Verändere die Parameter und beobachte, wo die markanten Punkte liegen. Die Tabelle unter dem Schaubild nennt die markanten Punkte einer Periode, beginnend bei <Formel tex="x=c" nach="." />
        </p>
        <Markantelabor />

        <h3>Untersuchungsaufträge</h3>
        <p>Beantworte die Fragen zuerst mit dem Labor. Danach kannst du deine Beobachtung vergleichen.</p>
        <ol className="auftraege">
          <li>
            <p>
              Wähle die normale Sinusfunktion. Lies die x-Koordinaten der Wendepunkte, des Hochpunkts und des Tiefpunkts ab. Wie weit liegen aufeinanderfolgende Wendepunkte auseinander, wie weit aufeinanderfolgende Hochpunkte? Wie viele Hochpunkte gibt es insgesamt?
            </p>
            <Beobachtung>
              Wendepunkte liegen bei <Formel tex="0,\ \pi,\ 2\pi,\ \dots" nach="," /> also im Abstand <Formel tex="\pi=\tfrac{p}{2}" nach="." /> Hochpunkte liegen bei <Formel tex="\tfrac{\pi}{2},\ \tfrac{5\pi}{2},\ \dots" nach="," /> also im Abstand <Formel tex="p=2\pi" nach="." /> Es gibt unendlich viele: Man erhält weitere Hoch- und Tiefpunkte, indem man ganzzahlige Vielfache von <Formel tex="p" /> addiert oder subtrahiert, weitere Wendepunkte mit ganzzahligen Vielfachen von <Formel tex="\tfrac{p}{2}" nach="." />
            </Beobachtung>
          </li>
          <li>
            <p>
              Verändere <Formel tex="a" /> und <Formel tex="d" /> und achte auf die y-Koordinaten der Wendepunkte, Hochpunkte und Tiefpunkte. Wie hängen sie von <Formel tex="a" /> und <Formel tex="d" /> ab?
            </p>
            <Beobachtung>
              Die Wendepunkte liegen auf der Ruhelage: <Formel tex="y_{\text{WP}}=d" nach="." /> Die Hochpunkte haben die y-Koordinate <Formel tex="y_{\max}=d+|a|" nach="," /> die Tiefpunkte <Formel tex="y_{\min}=d-|a|" nach="." />
            </Beobachtung>
          </li>
          <li>
            <p>
              Stelle <Formel tex="c" /> auf verschiedene Werte (Sinus mit <Formel tex="a>0" nach=")." /> Wo liegt der Wendepunkt in der ersten Zeile der Tabelle? Wie verschieben sich die anderen Punkte?
            </p>
            <Beobachtung>
              Ein Wendepunkt liegt bei <Formel tex="x_{\text{WP}}=c" nach="," /> aufsteigend für <Formel tex="a>0" nach="." /> Alle markanten Punkte verschieben sich um <Formel tex="c" /> in x-Richtung.
            </Beobachtung>
          </li>
          <li>
            <p>
              Verändere <Formel tex="b" /> und lies die Periode ab. Um wie viel liegt der erste Hochpunkt rechts von <Formel tex="c" nach="?" /> Vergleiche mit <Formel tex="p" nach="." /> Wie weit liegen allgemein zwei aufeinanderfolgende markante Punkte auseinander?
            </p>
            <Beobachtung>
              Der erste Hochpunkt liegt bei <Formel tex="x_{\text{HP}}=c+\tfrac{1}{4}p" nach="," /> der Tiefpunkt bei <Formel tex="x_{\text{TP}}=c+\tfrac{3}{4}p" nach="." /> Zwischen zwei aufeinanderfolgenden markanten Punkten liegt immer eine Viertelperiode <Formel tex="\tfrac{p}{4}" nach="." /> Die Reihenfolge beim Sinus ist Wendepunkt, Hochpunkt, Wendepunkt, Tiefpunkt.
            </Beobachtung>
          </li>
          <li>
            <p>
              Stelle <Formel tex="a" /> auf einen negativen Wert. Was ändert sich in der Tabelle? Welche Art hat der Punkt bei <Formel tex="x=c" /> jetzt?
            </p>
            <Beobachtung>
              Hoch- und Tiefpunkte sind vertauscht: Der Tiefpunkt liegt jetzt bei <Formel tex="c+\tfrac{1}{4}p" /> und der Hochpunkt bei <Formel tex="c+\tfrac{3}{4}p" nach="." /> Der Wendepunkt bei <Formel tex="x=c" /> ist absteigend. Die y-Koordinaten bleiben <Formel tex="d\pm|a|" nach="." />
            </Beobachtung>
          </li>
          <li>
            <p>
              Wechsle zum Kosinus. Wo liegt bei <Formel tex="a>0" /> der Punkt mit <Formel tex="x=c" nach="?" /> Wo liegen die Wendepunkte? Was ändert sich für <Formel tex="a<0" nach="?" />
            </p>
            <Beobachtung>
              Beim Kosinus liegt bei <Formel tex="x_{\text{HP}}=c" /> ein Hochpunkt, der Tiefpunkt bei <Formel tex="c+\tfrac{1}{2}p" /> und die Wendepunkte bei <Formel tex="c+\tfrac{1}{4}p" /> und <Formel tex="c+\tfrac{3}{4}p" nach="." /> Auch hier folgen die Punkte im Abstand <Formel tex="\tfrac{p}{4}" nach="," /> die Reihenfolge ist Hochpunkt, Wendepunkt, Tiefpunkt, Wendepunkt. Für <Formel tex="a<0" /> liegt bei <Formel tex="x=c" /> ein Tiefpunkt.
            </Beobachtung>
          </li>
        </ol>
      </Abschnitt>

      <Abschnitt id="ueberpruefen" titel="Überprüfen">
        <p>
          Gib Zahlen als Dezimalzahl (<code>0,87</code>), als Bruch (<code>1/4</code>) oder als Vielfaches von <Formel tex="\pi" /> (<code>pi/4</code> oder <code>π/4</code>) ein. Dezimalzahlen werden auf zwei Nachkommastellen genau akzeptiert.
        </p>

        <h3>Die normalen Funktionen</h3>
        <Aufgabe
          nummer={1}
          titel="Normale Sinusfunktion"
          felder={[
            { id: 'p', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: NORMAL.periode, toleranz: 0.01 },
            { id: 'xWP', name: 'x-Koordinate eines Wendepunkts', beschriftung: <><Formel tex="x_{\text{WP}}" /></>, erwartet: NORMAL.sinus.xWP },
            { id: 'xHP', name: 'x-Koordinate des Hochpunkts', beschriftung: <><Formel tex="x_{\text{HP}}" /></>, erwartet: NORMAL.sinus.xHP, toleranz: 0.01 },
            { id: 'xTP', name: 'x-Koordinate des Tiefpunkts', beschriftung: <><Formel tex="x_{\text{TP}}" /></>, erwartet: NORMAL.sinus.xTP, toleranz: 0.01 },
            { id: 'aHP', name: 'Hochpunkt als Bruchteil der Periode', beschriftung: <><Formel tex="x_{\text{HP}}=\ ?\cdot p" /></>, erwartet: NORMAL.sinus.anteilHP },
            { id: 'aTP', name: 'Tiefpunkt als Bruchteil der Periode', beschriftung: <><Formel tex="x_{\text{TP}}=\ ?\cdot p" /></>, erwartet: NORMAL.sinus.anteilTP },
          ]}
          hilfen={[
            <>Denke an das Schaubild von <Formel tex="\sin(x)" /> für <Formel tex="0\le x\le 2\pi" nach="." /> Es beginnt im Ursprung.</>,
            <>Der Hochpunkt kommt nach einem Viertel der Periode, der Tiefpunkt nach drei Vierteln.</>,
          ]}
          loesung={[
            <>Die Periode ist <Formel tex="p=2\pi" nach="." /> Ein Wendepunkt liegt bei <Formel tex="x_{\text{WP}}=0" nach="." /></>,
            <>Der Hochpunkt liegt bei <Formel tex={String.raw`x_{\text{HP}}=\frac{\pi}{2}=\frac{1}{4}\cdot p`} nach="," /> der Tiefpunkt bei <Formel tex={String.raw`x_{\text{TP}}=\frac{3\pi}{2}=\frac{3}{4}\cdot p`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme für <Formel tex="f(x)=\sin(x)" /> die Periode und die markanten Punkte. Gib jeweils die kleinste Stelle <Formel tex="x\ge 0" /> an und schreibe die Hoch- und Tiefpunkte als Bruchteil der Periode.
          </p>
        </Aufgabe>

        <Aufgabe
          nummer={2}
          titel="Normale Kosinusfunktion"
          felder={[
            { id: 'xHP', name: 'x-Koordinate des Hochpunkts', beschriftung: <><Formel tex="x_{\text{HP}}" /></>, erwartet: NORMAL.kosinus.xHP },
            { id: 'xTP', name: 'x-Koordinate des Tiefpunkts', beschriftung: <><Formel tex="x_{\text{TP}}" /></>, erwartet: NORMAL.kosinus.xTP, toleranz: 0.01 },
            { id: 'aTP', name: 'Tiefpunkt als Bruchteil der Periode', beschriftung: <><Formel tex="x_{\text{TP}}=\ ?\cdot p" /></>, erwartet: NORMAL.kosinus.anteilTP },
            { id: 'xWP', name: 'x-Koordinate eines Wendepunkts', beschriftung: <><Formel tex="x_{\text{WP}}" /></>, erwartet: NORMAL.kosinus.xWP, toleranz: 0.01 },
            { id: 'aWP', name: 'Wendepunkt als Bruchteil der Periode', beschriftung: <><Formel tex="x_{\text{WP}}=\ ?\cdot p" /></>, erwartet: NORMAL.kosinus.anteilWP },
          ]}
          hilfen={[
            <>Die Kosinuskurve beginnt bei <Formel tex="x=0" /> auf dem höchsten Wert 1.</>,
            <>Der Tiefpunkt liegt in der Mitte der Periode, die Wendepunkte bei einem und bei drei Vierteln.</>,
          ]}
          loesung={[
            <>Der Hochpunkt liegt bei <Formel tex={String.raw`x_{\text{HP}}=0`} nach="." /></>,
            <>Der Tiefpunkt liegt bei <Formel tex={String.raw`x_{\text{TP}}=\pi=\frac{1}{2}\cdot p`} nach="," /> der erste Wendepunkt rechts von 0 bei <Formel tex={String.raw`x_{\text{WP}}=\frac{\pi}{2}=\frac{1}{4}\cdot p`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme für <Formel tex="f(x)=\cos(x)" /> die markanten Punkte. Gib jeweils die kleinste Stelle <Formel tex="x\ge 0" /> an und schreibe Tiefpunkt und Wendepunkt als Bruchteil der Periode.
          </p>
        </Aufgabe>

        <h3>Die Regeln verstehen</h3>
        <Auswahlfrage
          nummer="3a"
          titel="Art des Punkts bei x = c"
          optionen={[
            opt('a', 'Aufsteigender Wendepunkt', false, <>Das gilt für <Formel tex="a>0" nach="." /> Hier ist <Formel tex="a=-2<0" nach="." /></>),
            opt('b', 'Absteigender Wendepunkt', true, <>Richtig. Beim Sinus liegt bei <Formel tex="x=c" /> ein Wendepunkt, wegen <Formel tex="a<0" /> absteigend.</>),
            opt('c', 'Hochpunkt', false, <>Ein Hochpunkt läge beim Sinus erst eine Viertelperiode weiter, bei <Formel tex="c+\tfrac{1}{4}p" /> (oder bei <Formel tex="c+\tfrac{3}{4}p" /> für <Formel tex="a<0" nach=")." /></>),
            opt('d', 'Tiefpunkt', false, <>Ein Tiefpunkt läge beim Sinus erst eine Viertelperiode weiter, nicht bei <Formel tex="x=c" nach="." /></>),
          ]}
          erklaerung={<>Beim Sinus ist <Formel tex="x=c" /> die Stelle, an der das Argument <Formel tex="b\,(x-c)" /> gleich 0 ist, und <Formel tex="\sin(0)=0" nach="." /> Dort liegt ein Wendepunkt auf der Ruhelage. Für <Formel tex="a<0" /> ist das Schaubild gespiegelt, der Wendepunkt ist deshalb absteigend.</>}
        >
          <p>
            Welche Art Punkt liegt bei <Formel tex="g(x)=-2\sin\bigl(3\,(x-1)\bigr)+5" /> an der Stelle <Formel tex="x=1" nach="?" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="3b"
          titel="Art des Punkts bei x = c"
          optionen={[
            opt('a', 'Hochpunkt', false, <>Das gilt für <Formel tex="a>0" nach="." /> Hier ist <Formel tex="a=-0{,}5<0" nach="." /></>),
            opt('b', 'Tiefpunkt', true, <>Richtig. Beim Kosinus liegt bei <Formel tex="x=c" /> ein Extrempunkt, für <Formel tex="a<0" /> ein Tiefpunkt mit <Formel tex="y=d+a=0{,}5" nach="." /></>),
            opt('c', 'Aufsteigender Wendepunkt', false, <>Beim Kosinus liegen die Wendepunkte bei <Formel tex="c\pm\tfrac{1}{4}p" nach="," /> nicht bei <Formel tex="x=c" nach="." /></>),
            opt('d', 'Absteigender Wendepunkt', false, <>Beim Kosinus liegen die Wendepunkte bei <Formel tex="c\pm\tfrac{1}{4}p" nach="," /> nicht bei <Formel tex="x=c" nach="." /></>),
          ]}
          erklaerung={<>Beim Kosinus ist <Formel tex="\cos(0)=1" /> der größte Wert. Bei <Formel tex="x=c" /> liegt deshalb für <Formel tex="a>0" /> ein Hochpunkt und für <Formel tex="a<0" /> ein Tiefpunkt.</>}
        >
          <p>
            Welche Art Punkt liegt bei <Formel tex="g(x)=-0{,}5\cos\bigl(2\,(x-1)\bigr)+1" /> an der Stelle <Formel tex="x=1" nach="?" />
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="3c"
          titel="Abstand der markanten Punkte"
          optionen={[
            opt('a', <Formel tex="\tfrac{p}{2}" />, false, <>Das ist der Abstand zwischen zwei aufeinanderfolgenden Wendepunkten, nicht zum nächsten Hoch- oder Tiefpunkt.</>),
            opt('b', <Formel tex="\tfrac{p}{4}" />, true, <>Richtig. Zwischen zwei aufeinanderfolgenden markanten Punkten liegt immer eine Viertelperiode.</>),
            opt('c', <Formel tex="p" />, false, <>Nach einer ganzen Periode wiederholt sich der Verlauf. Dazwischen liegen noch drei weitere markante Punkte.</>),
            opt('d', <Formel tex="2p" />, false, <>Das wäre der Abstand über zwei ganze Perioden und viel zu groß.</>),
          ]}
          erklaerung={<>In einer Periode gibt es beim Sinus vier markante Punkte (zwei Wendepunkte, einen Hochpunkt, einen Tiefpunkt), die gleichmäßig verteilt sind: im Abstand <Formel tex="\tfrac{p}{4}" nach="." /></>}
        >
          <p>Eine Sinusfunktion hat die Periode <Formel tex="p" nach="." /> Wie weit liegt ein Wendepunkt vom nächsten Hoch- oder Tiefpunkt entfernt?</p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="3d"
          titel="y-Koordinate der Wendepunkte"
          optionen={[
            opt('a', <Formel tex="3" />, false, <>3 ist die Amplitude <Formel tex="|a|" nach="." /> Die Wendepunkte liegen nicht so weit von der Ruhelage entfernt, sondern auf ihr.</>),
            opt('b', <Formel tex="2" />, true, <>Richtig. Die Wendepunkte liegen auf der Ruhelage, also gilt <Formel tex="y_{\text{WP}}=d=2" nach="." /></>),
            opt('c', <Formel tex="5" />, false, <>5 ist <Formel tex="y_{\max}=d+|a|" nach="," /> die y-Koordinate der Hochpunkte.</>),
            opt('d', <Formel tex="-1" />, false, <>−1 ist <Formel tex="y_{\min}=d-|a|" nach="," /> die y-Koordinate der Tiefpunkte.</>),
          ]}
          erklaerung={<>Wendepunkte liegen auf der Ruhelage <Formel tex="y=d" nach="." /> Hier ist <Formel tex="d=2" nach="." /> Die Hochpunkte haben <Formel tex="y=5" nach="," /> die Tiefpunkte <Formel tex="y=-1" nach="." /></>}
        >
          <p>
            Welche y-Koordinate haben alle Wendepunkte von <Formel tex="g(x)=3\cos(x)+2" nach="?" />
          </p>
        </Auswahlfrage>

        <h3>Markante Punkte bestimmen</h3>
        <Aufgabe
          nummer={4}
          titel="Markante Punkte von a)"
          felder={[
            { id: 'p', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: E4.periode, toleranz: 0.01 },
            { id: 'xH', name: 'x-Koordinate des nächsten Hochpunkts', beschriftung: <><Formel tex="x_{\text{HP}}" /></>, erwartet: E4.xH, toleranz: 0.01 },
            { id: 'yH', name: 'y-Koordinate der Hochpunkte', beschriftung: <><Formel tex="y_{\max}" /></>, erwartet: E4.yH },
            { id: 'xT', name: 'x-Koordinate des nächsten Tiefpunkts', beschriftung: <><Formel tex="x_{\text{TP}}" /></>, erwartet: E4.xT, toleranz: 0.01 },
            { id: 'yT', name: 'y-Koordinate der Tiefpunkte', beschriftung: <><Formel tex="y_{\min}" /></>, erwartet: E4.yT },
            { id: 'yW', name: 'y-Koordinate der Wendepunkte', beschriftung: <><Formel tex="y_{\text{WP}}" /></>, erwartet: E4.yW },
          ]}
          hilfen={[
            <>Lies <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" /> ab und berechne <Formel tex={String.raw`p=\frac{2\pi}{b}`} nach="." /> Der Wendepunkt bei <Formel tex="x=c" /> ist aufsteigend, da <Formel tex="a>0" nach="." /></>,
            <>Hochpunkt: <Formel tex={String.raw`x_{\text{HP}}=c+\frac{1}{4}p`} nach="." /> Tiefpunkt: <Formel tex={String.raw`x_{\text{TP}}=c+\frac{3}{4}p`} nach="." /> Die y-Koordinaten sind <Formel tex="y_{\max}=d+|a|" nach="," /> <Formel tex="y_{\min}=d-|a|" /> und <Formel tex="y_{\text{WP}}=d" nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={`a=${zahlTex(P4.a)},\\ b=\\pi,\\ c=${zahlTex(P4.c)},\\ d=${zahlTex(P4.d)}`} nach="." /> Periode: <Formel tex={String.raw`p=\frac{2\pi}{\pi}=2`} nach="." /></>,
            <>Wendepunkt bei <Formel tex={`x_{\\text{WP}}=c=${zahlTex(P4.c)}`} nach="," /> aufsteigend wegen <Formel tex="a>0" nach="." /> Seine y-Koordinate ist <Formel tex={`d=${zahlTex(P4.d)}`} nach="." /></>,
            <>Hochpunkt: <Formel tex={`x_{\\text{HP}}=${zahlTex(P4.c)}+\\tfrac{1}{4}\\cdot 2=${zahlTex(E4.xH)}`} nach="," /> <Formel tex={`y_{\\max}=d+|a|=${zahlTex(P4.d)}+${zahlTex(P4.a)}=${zahlTex(E4.yH)}`} nach="." /></>,
            <>Tiefpunkt: <Formel tex={`x_{\\text{TP}}=${zahlTex(P4.c)}+\\tfrac{3}{4}\\cdot 2=${zahlTex(E4.xT)}`} nach="," /> <Formel tex={`y_{\\min}=d-|a|=${zahlTex(P4.d)}-${zahlTex(P4.a)}=${neg(zahlTex(E4.yT))}`} nach="." /></>,
          ]}
        >
          <p>
            a) <Formel tex={termSinus(P4, 'g', mit)} nach="." /> Der Wendepunkt <Formel tex="W_1" /> liegt bei <Formel tex="x=c" nach="." /> Bestimme die Periode, den nächsten Hochpunkt und den nächsten Tiefpunkt rechts von <Formel tex="W_1" /> sowie die y-Koordinate der Wendepunkte.
          </p>
          <AufKlick einblenden="Schaubild mit markanten Punkten einblenden" ausblenden="Schaubild ausblenden">
            <PunkteSchaubild
              p={P4}
              funktion="sin"
              bereich={[-0.5, 6.8, -2, 5]}
              xTeilung={0.5}
              yTeilung={1}
              xBeschriftung="zahl"
              intervall={INTERVALL_AB}
              beschreibung="Schaubild von g mit Ruhelage bei 1,5, Hochpunkten bei 4 und Tiefpunkten bei minus 1, im Intervall von 0 bis 2π. Markiert sind alle markanten Punkte."
            />
          </AufKlick>
        </Aufgabe>

        <Aufgabe
          nummer={5}
          titel="Markante Punkte von b)"
          felder={[
            { id: 'p', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: E5.periode, toleranz: 0.01 },
            { id: 'xT', name: 'x-Koordinate des nächsten Tiefpunkts', beschriftung: <><Formel tex="x_{\text{TP}}" /></>, erwartet: E5.xT, toleranz: 0.01 },
            { id: 'yT', name: 'y-Koordinate der Tiefpunkte', beschriftung: <><Formel tex="y_{\min}" /></>, erwartet: E5.yT },
            { id: 'xH', name: 'x-Koordinate des nächsten Hochpunkts', beschriftung: <><Formel tex="x_{\text{HP}}" /></>, erwartet: E5.xH, toleranz: 0.01 },
            { id: 'yH', name: 'y-Koordinate der Hochpunkte', beschriftung: <><Formel tex="y_{\max}" /></>, erwartet: E5.yH },
          ]}
          hilfen={[
            <>Hier ist <Formel tex="a<0" nach="." /> Dann sind Hoch- und Tiefpunkt vertauscht: Der Tiefpunkt liegt bei <Formel tex={String.raw`c+\frac{1}{4}p`} nach="," /> der Hochpunkt bei <Formel tex={String.raw`c+\frac{3}{4}p`} nach="." /></>,
            <>Berechne zuerst <Formel tex={String.raw`p=\frac{2\pi}{b}`} /> mit <Formel tex="b=2" nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={String.raw`a=-2,\ b=2,\ c=\frac{\pi}{2},\ d=0{,}5`} nach="." /> Periode: <Formel tex={String.raw`p=\frac{2\pi}{2}=\pi`} nach="." /></>,
            <>Wegen <Formel tex="a<0" /> ist der Wendepunkt bei <Formel tex={String.raw`x=\frac{\pi}{2}`} /> absteigend. Tiefpunkt: <Formel tex={String.raw`x_{\text{TP}}=\frac{\pi}{2}+\frac{1}{4}\pi=\frac{3\pi}{4}`} nach="," /> <Formel tex="y_{\min}=0{,}5-2=-1{,}5" nach="." /></>,
            <>Hochpunkt: <Formel tex={String.raw`x_{\text{HP}}=\frac{\pi}{2}+\frac{3}{4}\pi=\frac{5\pi}{4}`} nach="," /> <Formel tex="y_{\max}=0{,}5+2=2{,}5" nach="." /></>,
          ]}
        >
          <p>
            b) <Formel tex={termSinus(P5, 'f', mit)} nach="." /> Der Wendepunkt bei <Formel tex="x=c" /> ist der Ausgangspunkt. Bestimme die Periode sowie den nächsten Tiefpunkt und den nächsten Hochpunkt rechts davon.
          </p>
          <AufKlick einblenden="Schaubild mit markanten Punkten einblenden" ausblenden="Schaubild ausblenden">
            <PunkteSchaubild
              p={P5}
              funktion="sin"
              bereich={[-0.5, 6.8, -2.5, 3.5]}
              xTeilung={PI / 4}
              yTeilung={0.5}
              intervall={INTERVALL_AB}
              beschreibung="Schaubild von f mit Ruhelage bei 0,5, Hochpunkten bei 2,5 und Tiefpunkten bei minus 1,5, im Intervall von 0 bis 2π. Markiert sind alle markanten Punkte."
            />
          </AufKlick>
        </Aufgabe>

        <Aufgabe
          nummer={6}
          titel="Markante Punkte beim Kosinus"
          felder={[
            { id: 'p', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: E6.periode, toleranz: 0.01 },
            { id: 'yH', name: 'y-Koordinate der Hochpunkte', beschriftung: <><Formel tex="y_{\max}" /></>, erwartet: E6.yH, toleranz: 0.01 },
            { id: 'xT', name: 'x-Koordinate des Tiefpunkts links vom Hochpunkt', beschriftung: <><Formel tex="x_{\text{TP}}" /></>, erwartet: E6.xT, toleranz: 0.01 },
            { id: 'yT', name: 'y-Koordinate der Tiefpunkte', beschriftung: <><Formel tex="y_{\min}" /></>, erwartet: E6.yT, toleranz: 0.01 },
            { id: 'xW', name: 'x-Koordinate des Wendepunkts links vom Hochpunkt', beschriftung: <><Formel tex="x_{\text{WP}}" /></>, erwartet: E6.xW, toleranz: 0.01 },
            { id: 'yW', name: 'y-Koordinate der Wendepunkte', beschriftung: <><Formel tex="y_{\text{WP}}" /></>, erwartet: E6.yW },
          ]}
          hilfen={[
            <>Beim Kosinus mit <Formel tex="a>0" /> liegt bei <Formel tex="x=c" /> ein Hochpunkt. Der Tiefpunkt liegt eine halbe Periode entfernt, der Wendepunkt eine Viertelperiode.</>,
            <>Gesucht sind die Punkte <em>links</em> vom Hochpunkt: also <Formel tex={String.raw`c-\frac{1}{2}p`} /> und <Formel tex={String.raw`c-\frac{1}{4}p`} nach="." /> Hier ist <Formel tex="d=0" nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={String.raw`a=\frac{1}{3},\ b=4,\ c=\pi,\ d=0`} nach="." /> Periode: <Formel tex={String.raw`p=\frac{2\pi}{4}=\frac{\pi}{2}`} nach="." /> Hochpunkt bei <Formel tex="x=\pi" nach="," /> <Formel tex={String.raw`y_{\max}=\frac{1}{3}`} nach="." /></>,
            <>Tiefpunkt links davon: <Formel tex={String.raw`x_{\text{TP}}=\pi-\frac{1}{2}\cdot\frac{\pi}{2}=\frac{3\pi}{4}`} nach="," /> <Formel tex={String.raw`y_{\min}=-\frac{1}{3}`} nach="." /></>,
            <>Wendepunkt links davon: <Formel tex={String.raw`x_{\text{WP}}=\pi-\frac{1}{4}\cdot\frac{\pi}{2}=\frac{7\pi}{8}`} nach="," /> <Formel tex="y_{\text{WP}}=0" nach="." /> Er ist aufsteigend, weil er links von einem Hochpunkt liegt.</>,
          ]}
        >
          <p>
            <Formel tex={TERM6} nach="." /> Das Schaubild hat bei <Formel tex="x=\pi" /> einen Hochpunkt. Bestimme die Periode, <Formel tex="y_{\max}" /> und <Formel tex="y_{\min}" /> sowie den Tiefpunkt und den Wendepunkt direkt links vom Hochpunkt.
          </p>
          <AufKlick einblenden="Schaubild mit markanten Punkten einblenden" ausblenden="Schaubild ausblenden">
            <PunkteSchaubild
              p={P6}
              funktion="cos"
              bereich={[-PI / 2 - 0.3, PI + 0.3, -0.6, 0.6]}
              xTeilung={PI / 8}
              yTeilung={0.2}
              intervall={INTERVALL_C}
              beschreibung="Schaubild von g mit Hochpunkten bei y gleich ein Drittel und Tiefpunkten bei y gleich minus ein Drittel, im Intervall von minus π halbe bis π. Markiert sind alle markanten Punkte."
            />
          </AufKlick>
        </Aufgabe>

        <Aufgabe
          nummer={7}
          titel="Markante Punkte im Intervall zählen"
          felder={[
            { id: 'ahp', name: 'Anzahl Hochpunkte bei a', beschriftung: <>a) Hochpunkte</>, erwartet: E7.a.hp },
            { id: 'atp', name: 'Anzahl Tiefpunkte bei a', beschriftung: <>a) Tiefpunkte</>, erwartet: E7.a.tp },
            { id: 'awp', name: 'Anzahl Wendepunkte bei a', beschriftung: <>a) Wendepunkte</>, erwartet: E7.a.wp },
            { id: 'bhp', name: 'Anzahl Hochpunkte bei b', beschriftung: <>b) Hochpunkte</>, erwartet: E7.b.hp },
            { id: 'btp', name: 'Anzahl Tiefpunkte bei b', beschriftung: <>b) Tiefpunkte</>, erwartet: E7.b.tp },
            { id: 'bwp', name: 'Anzahl Wendepunkte bei b', beschriftung: <>b) Wendepunkte</>, erwartet: E7.b.wp },
            { id: 'chp', name: 'Anzahl Hochpunkte beim Kosinus', beschriftung: <>Kosinus: Hochpunkte</>, erwartet: E7.c.hp },
            { id: 'ctp', name: 'Anzahl Tiefpunkte beim Kosinus', beschriftung: <>Kosinus: Tiefpunkte</>, erwartet: E7.c.tp },
            { id: 'cwp', name: 'Anzahl Wendepunkte beim Kosinus', beschriftung: <>Kosinus: Wendepunkte</>, erwartet: E7.c.wp },
          ]}
          hilfen={[
            <>Gehe von einem bekannten Punkt aus in Schritten der Periode (Hoch- und Tiefpunkte) beziehungsweise der halben Periode (Wendepunkte) nach links und rechts, solange du im Intervall bleibst.</>,
            <>Randpunkte des Intervalls zählen mit, wenn dort ein markanter Punkt liegt, zum Beispiel ein Wendepunkt bei <Formel tex="x=0" /> oder <Formel tex="x=2\pi" nach="." /></>,
          ]}
          loesung={[
            <>a) Hochpunkte bei <Formel tex="x=1,\ 3,\ 5" nach="," /> Tiefpunkte bei <Formel tex="x=0,\ 2,\ 4,\ 6" nach="," /> Wendepunkte bei <Formel tex="x=0{,}5,\ 1{,}5,\ \dots,\ 5{,}5" nach="." /> Wegen <Formel tex="2\pi\approx 6{,}28" /> liegen alle diese Stellen im Intervall: <Formel tex={`${E7.a.hp}`} /> Hochpunkte, <Formel tex={`${E7.a.tp}`} /> Tiefpunkte, <Formel tex={`${E7.a.wp}`} /> Wendepunkte.</>,
            <>b) Wendepunkte bei <Formel tex={String.raw`0,\ \frac{\pi}{2},\ \pi,\ \frac{3\pi}{2},\ 2\pi`} nach="," /> Tiefpunkte bei <Formel tex={String.raw`\frac{3\pi}{4},\ \frac{7\pi}{4}`} nach="," /> Hochpunkte bei <Formel tex={String.raw`\frac{\pi}{4},\ \frac{5\pi}{4}`} nach=":" /> <Formel tex={`${E7.b.hp}`} /> Hochpunkte, <Formel tex={`${E7.b.tp}`} /> Tiefpunkte, <Formel tex={`${E7.b.wp}`} /> Wendepunkte.</>,
            <>Kosinus im Intervall <Formel tex={String.raw`\left[-\frac{\pi}{2};\,\pi\right]`} nach=":" /> Hochpunkte bei <Formel tex={String.raw`-\frac{\pi}{2},\ 0,\ \frac{\pi}{2},\ \pi`} nach="," /> Tiefpunkte bei <Formel tex={String.raw`-\frac{\pi}{4},\ \frac{\pi}{4},\ \frac{3\pi}{4}`} nach="," /> Wendepunkte bei <Formel tex={String.raw`-\frac{3\pi}{8},\ -\frac{\pi}{8},\ \frac{\pi}{8},\ \frac{3\pi}{8},\ \frac{5\pi}{8},\ \frac{7\pi}{8}`} nach=":" /> <Formel tex={`${E7.c.hp}`} /> Hochpunkte, <Formel tex={`${E7.c.tp}`} /> Tiefpunkte, <Formel tex={`${E7.c.wp}`} /> Wendepunkte.</>,
          ]}
        >
          <p>
            Wie viele Hochpunkte, Tiefpunkte und Wendepunkte haben die Schaubilder aus den Aufgaben 4, 5 und 6 in den angegebenen Intervallen? Für a) und b) gilt das Intervall <Formel tex={`[${INTERVALL_AB[0]};\\,2\\pi]`} nach="," /> für den Kosinus aus Aufgabe 6 das Intervall <Formel tex={String.raw`\left[-\frac{\pi}{2};\,\pi\right]`} nach="." /> Zähle auch Punkte am Rand des Intervalls mit.
          </p>
        </Aufgabe>

        <h3>Markante Punkte nutzen</h3>
        <Aufgabe
          nummer={8}
          titel="Funktionsgleichung aus Hoch- und Tiefpunkt"
          felder={[
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: P8.d },
            { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /> (mit <Formel tex="a>0" nach=")" /></>, erwartet: P8.a },
            { id: 'p', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: 2 * Math.PI / P8.b, toleranz: 0.01 },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: P8.b, toleranz: 0.01 },
            { id: 'c1', name: 'Parameter c1 beim Sinus', beschriftung: <><Formel tex="c_1" /> beim Sinus</>, erwartet: P8.c, toleranz: 0.01 },
            { id: 'c2', name: 'Parameter c2 beim Kosinus', beschriftung: <><Formel tex="c_2" /> beim Kosinus</>, erwartet: P8_KOSINUS.c, toleranz: 0.01 },
          ]}
          hilfen={[
            <>Die Ruhelage liegt in der Mitte zwischen <Formel tex="y_{\max}" /> und <Formel tex="y_{\min}" nach="." /> Die Amplitude ist der Abstand der Ruhelage zum Hochpunkt.</>,
            <>Zwischen einem Hochpunkt und dem nächsten Tiefpunkt liegt eine halbe Periode. Mit <Formel tex={String.raw`b=\frac{2\pi}{p}`} /> erhältst du <Formel tex="b" nach="." /></>,
            <>Beim Kosinus mit <Formel tex="a>0" /> ist <Formel tex="c" /> die x-Koordinate eines Hochpunkts. Beim Sinus liegt der Hochpunkt bei <Formel tex="c+\tfrac{1}{4}p" nach="," /> also ist <Formel tex={String.raw`c=x_{\text{HP}}-\frac{1}{4}p`} nach="." /> Wähle jeweils <Formel tex="0\le c<p" nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={String.raw`d=\frac{y_{\max}+y_{\min}}{2}=\frac{5+1}{2}=3`} /> und <Formel tex="a=5-3=2" nach="." /></>,
            <>Der Abstand von <Formel tex="H" /> zu <Formel tex="T" /> ist <Formel tex="5-2=3" nach="," /> das ist die halbe Periode. Also gilt <Formel tex="p=6" /> und <Formel tex={String.raw`b=\frac{2\pi}{6}=\frac{\pi}{3}`} nach="." /></>,
            <>Kosinus: Der Hochpunkt liegt bei <Formel tex="x=c" nach="," /> also <Formel tex="c_2=2" nach="." /> Sinus: <Formel tex={String.raw`c_1=2-\frac{1}{4}\cdot 6=0{,}5`} nach="." /></>,
            <>Ergebnis: <Formel tex={termSinus(P8, 'f_1', mit)} /> und <Formel tex={termSinus(P8_KOSINUS, 'g_1', { funktion: 'cos', ...mit })} nach="." /></>,
          ]}
        >
          <p>
            Das Schaubild einer Funktion <Formel tex="f(x)=a\cdot\sin\bigl(b\,(x-c_1)\bigr)+d" /> mit <Formel tex="a>0" /> und <Formel tex="b>0" /> hat den Hochpunkt <Formel tex={`H(${H8.x}\\,|\\,${H8.y})`} /> und rechts davon als nächsten Tiefpunkt <Formel tex={`T(${T8.x}\\,|\\,${T8.y})`} nach="." /> Dasselbe Schaubild gehört auch zu einer Kosinusfunktion <Formel tex="g(x)=a\cdot\cos\bigl(b\,(x-c_2)\bigr)+d" nach="." /> Bestimme <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="d" nach="," /> <Formel tex="c_1" /> und <Formel tex="c_2" nach="," /> jeweils mit <Formel tex="0\le c<p" nach="." />
          </p>
        </Aufgabe>

        <Aufgabe
          nummer={9}
          titel="Funktionsgleichung aus der Skizze"
          felder={[
            { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /> (mit <Formel tex="a>0" nach=")" /></>, erwartet: P9.a },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: P9.b, toleranz: 0.01 },
            { id: 'c', name: 'Parameter c', beschriftung: <><Formel tex="c" /> (mit <Formel tex="0\le c<p" nach=")" /></>, erwartet: P9.c },
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: P9.d },
          ]}
          hilfen={[
            <>Lies zuerst Hochpunkt, Tiefpunkt und einen aufsteigenden Wendepunkt ab. Aus <Formel tex="y_{\max}" /> und <Formel tex="y_{\min}" /> folgen <Formel tex="d" /> und <Formel tex="a" nach="." /></>,
            <>Die Periode ist der Abstand zweier benachbarter Hochpunkte oder das Doppelte des Abstands von Hochpunkt zu Tiefpunkt. Dann ist <Formel tex={String.raw`b=\frac{2\pi}{p}`} nach="." /> Der aufsteigende Wendepunkt liegt bei <Formel tex="x=c" nach="." /></>,
          ]}
          loesung={[
            <>Hochpunkt <Formel tex="(2\,|\,4)" nach="," /> Tiefpunkt <Formel tex="(4\,|\,1)" nach="." /> Also <Formel tex={String.raw`d=\frac{4+1}{2}=2{,}5`} /> und <Formel tex="a=4-2{,}5=1{,}5" nach="." /></>,
            <>Von Hochpunkt zu Tiefpunkt sind es <Formel tex="2" /> Einheiten, das ist die halbe Periode. Also <Formel tex="p=4" /> und <Formel tex={String.raw`b=\frac{2\pi}{4}=\frac{\pi}{2}`} nach="." /></>,
            <>Der erste aufsteigende Wendepunkt rechts von 0 liegt bei <Formel tex="(1\,|\,2{,}5)" nach="," /> also <Formel tex="c=1" nach="." /> Ergebnis: <Formel tex={termSinus(P9, 'f', mit)} nach="." /></>,
          ]}
        >
          <p>
            Das Schaubild gehört zu <Formel tex="f(x)=a\cdot\sin\bigl(b\,(x-c)\bigr)+d" /> mit <Formel tex="a>0" nach="," /> <Formel tex="b>0" /> und <Formel tex="0\le c<p" nach="." /> Bestimme <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" /> mithilfe der markanten Punkte.
          </p>
          <Funktionsgraph
            bereich={[-1.5, 7.5, -0.5, 5]}
            xTeilung={0.5}
            yTeilung={0.5}
            xBeschriftung="zahl"
            className="brett-3zu2"
            beschreibung="Schaubild einer periodischen Kurve mit Hochpunkten bei y gleich 4 an den Stellen x gleich 2 und 6, Tiefpunkten bei y gleich 1 an den Stellen x gleich 0 und 4. Bei x gleich 1 und x gleich 5 liegen aufsteigende Wendepunkte auf der Höhe y gleich 2,5."
            kurven={[{ f: (x) => wertTrig(P9, x, 'sin'), farbe: '#111827' }]}
          />
        </Aufgabe>

        <Aufgabe
          nummer={10}
          titel="Schaubild aus der Funktionsgleichung skizzieren"
          felder={[
            { id: 'p', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: E10.periode, toleranz: 0.01 },
            { id: 'xH', name: 'x-Koordinate des Hochpunkts', beschriftung: <><Formel tex="x_{\text{HP}}" /></>, erwartet: E10.xH },
            { id: 'yH', name: 'y-Koordinate des Hochpunkts', beschriftung: <><Formel tex="y_{\max}" /></>, erwartet: E10.yH },
            { id: 'xT', name: 'x-Koordinate des Tiefpunkts', beschriftung: <><Formel tex="x_{\text{TP}}" /></>, erwartet: E10.xT, toleranz: 0.01 },
            { id: 'yT', name: 'y-Koordinate des Tiefpunkts', beschriftung: <><Formel tex="y_{\min}" /></>, erwartet: E10.yT },
            { id: 'xW', name: 'x-Koordinate des Wendepunkts', beschriftung: <><Formel tex="x_{\text{WP}}" /></>, erwartet: E10.xW, toleranz: 0.01 },
            { id: 'yW', name: 'y-Koordinate des Wendepunkts', beschriftung: <><Formel tex="y_{\text{WP}}" /></>, erwartet: E10.yW },
          ]}
          hilfen={[
            <>Beim Kosinus mit <Formel tex="a>0" /> liegt bei <Formel tex="x=c" /> ein Hochpunkt. Von dort aus folgen im Abstand <Formel tex="\tfrac{p}{4}" /> ein Wendepunkt, ein Tiefpunkt und ein weiterer Wendepunkt.</>,
            <>Ruhelage <Formel tex="y=d" nach="," /> Hochpunkte bei <Formel tex="d+|a|" nach="," /> Tiefpunkte bei <Formel tex="d-|a|" nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={String.raw`a=3,\ b=\frac{\pi}{3},\ c=2,\ d=1`} nach="." /> Periode <Formel tex={String.raw`p=\frac{2\pi}{\pi/3}=6`} nach="," /> Viertelperiode <Formel tex="1{,}5" nach="." /></>,
            <>Hochpunkt bei <Formel tex="x=c=2" /> mit <Formel tex="y_{\max}=1+3=4" nach="." /> Wendepunkt bei <Formel tex="x=2+1{,}5=3{,}5" /> mit <Formel tex="y=d=1" nach="." /></>,
            <>Tiefpunkt bei <Formel tex="x=2+3=5" /> mit <Formel tex="y_{\min}=1-3=-2" nach="." /> Verbinde die Punkte zu einer Kosinuskurve.</>,
          ]}
        >
          <p>
            Skizziere das Schaubild von <Formel tex={termSinus(P10, 'g', { funktion: 'cos', ...mit })} /> auf Papier. Bestimme dazu zuerst den Hochpunkt bei <Formel tex="x=c" nach="," /> den Tiefpunkt rechts davon und den ersten Wendepunkt rechts vom Hochpunkt.
          </p>
          <AufKlick einblenden="Schaubild mit markanten Punkten einblenden" ausblenden="Schaubild ausblenden">
            <PunkteSchaubild
              p={P10}
              funktion="cos"
              bereich={[-1, 8, -3, 5]}
              xTeilung={0.5}
              yTeilung={1}
              xBeschriftung="zahl"
              beschreibung="Schaubild von g mit Ruhelage bei 1, Hochpunkten bei 4 an den Stellen x gleich 2 und 8, Tiefpunkt bei minus 2 an der Stelle x gleich 5. Markiert sind alle markanten Punkte."
            />
          </AufKlick>
        </Aufgabe>
      </Abschnitt>

      <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
        <h3>Die normalen Funktionen</h3>
        <table className="tabelle">
          <caption>Markante Punkte von sin(x) und cos(x) in einer Periode</caption>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col"><Formel tex="f(x)=\sin(x)" /></th>
              <th scope="col"><Formel tex="f(x)=\cos(x)" /></th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Periode</th><td><Formel tex="p=2\pi" /></td><td><Formel tex="p=2\pi" /></td></tr>
            <tr><th scope="row">Hochpunkt</th><td><Formel tex="x_{\text{HP}}=\tfrac{\pi}{2}=\tfrac{1}{4}p" /></td><td><Formel tex="x_{\text{HP}}=0" /></td></tr>
            <tr><th scope="row">Tiefpunkt</th><td><Formel tex="x_{\text{TP}}=\tfrac{3\pi}{2}=\tfrac{3}{4}p" /></td><td><Formel tex="x_{\text{TP}}=\pi=\tfrac{1}{2}p" /></td></tr>
            <tr><th scope="row">Wendepunkt</th><td><Formel tex="x_{\text{WP}}=0" /></td><td><Formel tex="x_{\text{WP}}=\pm\tfrac{\pi}{2}=\pm\tfrac{1}{4}p" /></td></tr>
            <tr><th scope="row">weitere Hoch- und Tiefpunkte</th><td colSpan={2}>ganzzahlige Vielfache der Periode <Formel tex="p=2\pi" /> addieren oder subtrahieren</td></tr>
            <tr><th scope="row">weitere Wendepunkte</th><td colSpan={2}>ganzzahlige Vielfache der halben Periode <Formel tex="\pi" /> addieren oder subtrahieren</td></tr>
          </tbody>
        </table>

        <h3>Die allgemeinen Funktionen (b &gt; 0)</h3>
        <Hinweis art="merksatz" titel="Allgemeine Sinusfunktion g(x) = a·sin(b(x−c)) + d">
          <ul className="liste">
            <li>Periode <Formel tex={String.raw`p=\frac{2\pi}{b}`} nach="." /></li>
            <li>
              <strong>Wendepunkte:</strong> <Formel tex="x_{\text{WP}}=c" nach="," /> aufsteigend für <Formel tex="a>0" nach="," /> absteigend für <Formel tex="a<0" nach="." /> Weitere erhält man durch ganzzahlige Vielfache der halben Periode <Formel tex={String.raw`\frac{p}{2}=\frac{\pi}{b}`} nach="." /> Es gilt <Formel tex="y_{\text{WP}}=d" nach="." />
            </li>
            <li>
              <strong>Für <Formel tex="a>0" nach=":" /></strong> Hochpunkt bei <Formel tex={String.raw`x_{\text{HP}}=c+\frac{1}{4}p`} nach="," /> Tiefpunkt bei <Formel tex={String.raw`x_{\text{TP}}=c+\frac{3}{4}p`} nach="." />
            </li>
            <li>
              <strong>Für <Formel tex="a<0" /> ist es umgekehrt:</strong> Tiefpunkt bei <Formel tex={String.raw`x_{\text{TP}}=c+\frac{1}{4}p`} nach="," /> Hochpunkt bei <Formel tex={String.raw`x_{\text{HP}}=c+\frac{3}{4}p`} nach="." />
            </li>
            <li>Weitere Hoch- und Tiefpunkte erhält man durch ganzzahlige Vielfache der Periode <Formel tex="p" nach="." /> Es gilt <Formel tex="y_{\max}=d+|a|" /> und <Formel tex="y_{\min}=d-|a|" nach="." /></li>
          </ul>
        </Hinweis>
        <Hinweis art="merksatz" titel="Allgemeine Kosinusfunktion g(x) = a·cos(b(x−c)) + d">
          <ul className="liste">
            <li>Periode <Formel tex={String.raw`p=\frac{2\pi}{b}`} nach="." /></li>
            <li>
              <strong>Für <Formel tex="a>0" nach=":" /></strong> Hochpunkt bei <Formel tex="x_{\text{HP}}=c" nach="," /> Tiefpunkt bei <Formel tex={String.raw`x_{\text{TP}}=c\pm\frac{1}{2}p`} nach="." />
            </li>
            <li>
              <strong>Für <Formel tex="a<0" /> ist es umgekehrt:</strong> Tiefpunkt bei <Formel tex="x_{\text{TP}}=c" nach="," /> Hochpunkt bei <Formel tex={String.raw`x_{\text{HP}}=c\pm\frac{1}{2}p`} nach="." />
            </li>
            <li>
              <strong>Wendepunkte:</strong> <Formel tex={String.raw`x_{\text{WP}}=c\pm\frac{1}{4}p`} nach="." /> Weitere Wendepunkte erhält man durch ganzzahlige Vielfache der halben Periode. Es gilt <Formel tex="y_{\text{WP}}=d" nach="." />
            </li>
            <li>Weitere Hoch- und Tiefpunkte erhält man wie beim Sinus durch ganzzahlige Vielfache der Periode.</li>
          </ul>
        </Hinweis>
        <Hinweis titel="Eine Merkhilfe: die Viertelperiode">
          Aufeinanderfolgende markante Punkte liegen immer im Abstand einer Viertelperiode <Formel tex="\tfrac{p}{4}" nach="." /> Beim Sinus mit <Formel tex="a>0" /> folgen ab <Formel tex="x=c" /> die Punkte Wendepunkt, Hochpunkt, Wendepunkt, Tiefpunkt. Beim Kosinus mit <Formel tex="a>0" /> sind es Hochpunkt, Wendepunkt, Tiefpunkt, Wendepunkt. Für <Formel tex="a<0" /> sind Hoch- und Tiefpunkte vertauscht.
        </Hinweis>

        <h3>Markante Punkte im Intervall bestimmen</h3>
        <ol className="liste">
          <li>Periode <Formel tex={String.raw`p=\frac{2\pi}{b}`} /> und Viertelperiode <Formel tex={String.raw`\frac{p}{4}`} /> berechnen.</li>
          <li>Eine bekannte Stelle bestimmen: beim Sinus der Wendepunkt bei <Formel tex="x=c" nach="," /> beim Kosinus der Extrempunkt bei <Formel tex="x=c" nach="." /> Die Art ergibt sich aus dem Vorzeichen von <Formel tex="a" nach="." /></li>
          <li>Weitere Punkte im Abstand <Formel tex={String.raw`\frac{p}{4}`} /> nach links und rechts bestimmen, ihre Art ergibt sich aus der Reihenfolge.</li>
          <li>y-Koordinaten bestimmen: Wendepunkte <Formel tex="d" nach="," /> Hochpunkte <Formel tex="d+|a|" nach="," /> Tiefpunkte <Formel tex="d-|a|" nach="." /></li>
          <li>Nur Punkte im Intervall behalten, Randpunkte eingeschlossen, und von links nach rechts notieren, zum Beispiel <Formel tex="H_1(1\,|\,4),\ H_2(3\,|\,4)" nach="." /></li>
        </ol>

        <h3>Funktionsgleichung aus markanten Punkten aufstellen</h3>
        <ol className="liste">
          <li><Formel tex={String.raw`d=\frac{y_{\max}+y_{\min}}{2}`} /> und <Formel tex={String.raw`|a|=\frac{y_{\max}-y_{\min}}{2}`} nach="." /></li>
          <li>Die Periode <Formel tex="p" /> aus dem Abstand zweier benachbarter Hochpunkte (oder Tiefpunkte) oder aus dem doppelten Abstand von Hochpunkt zu Tiefpunkt bestimmen. Dann ist <Formel tex={String.raw`b=\frac{2\pi}{p}`} nach="." /></li>
          <li>
            <Formel tex="c" /> aus einem bekannten Punkt bestimmen: beim Sinus <Formel tex="c=x_{\text{WP}}" /> (aufsteigend) oder <Formel tex={String.raw`c=x_{\text{HP}}-\frac{1}{4}p`} nach="," /> beim Kosinus <Formel tex="c=x_{\text{HP}}" nach="." />
          </li>
          <li>Das Vorzeichen von <Formel tex="a" /> folgt aus der Art des Punkts bei <Formel tex="x=c" nach="." /> Es gibt unendlich viele passende Terme, denn man kann <Formel tex="c" /> um ganze Perioden verschieben und zwischen Sinus und Kosinus wechseln.</li>
        </ol>

        <h3>Schaubild aus der Funktionsgleichung skizzieren</h3>
        <p>
          Zeichne die Ruhelage <Formel tex="y=d" /> und die Geraden <Formel tex="y=d\pm|a|" nach="." /> Trage die markanten Punkte einer Periode ab <Formel tex="x=c" /> im Abstand <Formel tex={String.raw`\frac{p}{4}`} /> ein und verbinde sie zu einer glatten Kurve. Setze das Muster nach links und rechts fort.
        </p>
      </Abschnitt>
    </>
  );
}
