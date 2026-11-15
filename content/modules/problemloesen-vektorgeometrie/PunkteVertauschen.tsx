import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Teile } from '@/components/Teilaufgaben';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { opt } from '@/lib/modulhilfen';
import { abstandZuM, seitenlaengen, umlaufAb } from '@/lib/permutation';
import { permutationBild } from './Bilder';
import { P, Q, REFLEXION, T, ZAEHLEN_GLEICH } from './daten';
import { Ebenenansicht } from './Ebenenansicht';
import { Kette, Liste, Pkt, feld, sp, P as pt } from './hilfen';
import { Permutationslabor } from './Labor';
import { Zahlenstrahl } from './Zahlenstrahl';

const u = umlaufAb(P);
const eck = (i: number) => pt('', u[i]!);
const N = (i: number) => `P_{${i + 1}}`;
const dPM = abstandZuM(P);
const sP = seitenlaengen(P);
const rund = (x: number) => String(Math.round(x * 100) / 100).replace('.', '{,}');

/** Aufgabe 1: Punkte zählen (sechs bei drei verschiedenen Koordinaten, drei bei zwei gleichen). */
function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Punkte zählen"
      felder={[
        feld('n1', 'Anzahl der Punkte bei P', <>Anzahl der Punkte bei <Formel tex="P" /></>, 6),
        feld('n2', 'Anzahl der Punkte bei R', <>Anzahl der Punkte bei <Formel tex="R" /></>, 3),
      ]}
      hilfen={[
        <>Die erste Koordinate kann <Formel tex="-1" nach="," /> <Formel tex="0" /> oder <Formel tex="4" /> sein. Für jede dieser Wahlen bleiben zwei Zahlen, die du auf die beiden übrigen Stellen verteilst.</>,
        <>Bei <Formel tex="R" /> sind zwei Zahlen gleich. Vertauschst du die beiden Zweien, entsteht derselbe Punkt. Es kommt nur darauf an, an welcher Stelle die <Formel tex="5" /> steht.</>,
      ]}
      loesung={[
        <>
          Gehe systematisch vor und lege zuerst die erste Koordinate fest. Mit <Formel tex="-1" /> an erster Stelle entstehen
          <Liste z={[pt('', [-1, 0, 4]), pt('', [-1, 4, 0])]} />
          mit <Formel tex="0" /> an erster Stelle
          <Liste z={[pt('', [0, -1, 4]), pt('', [0, 4, -1])]} />
          und mit <Formel tex="4" /> an erster Stelle
          <Liste z={[pt('', [4, -1, 0]), pt('', [4, 0, -1])]} />
          Das sind <Formel tex={t`3\cdot 2=6`} /> verschiedene Punkte, <Formel tex="P" /> selbst ist der erste.
        </>,
        <>
          Bei <Pkt name="R" p={[...ZAEHLEN_GLEICH]} /> entscheidet nur die Stelle der <Formel tex="5" nach=":" />
          <Liste z={[pt('', [2, 2, 5]), pt('', [2, 5, 2]), pt('', [5, 2, 2])]} />
          Es entstehen drei Punkte.
        </>,
      ]}
    >
      <p>
        Vertausche die Koordinaten von <Pkt name="P" p={[...P]} /> in jeder möglichen Reihenfolge. Gehe systematisch vor: Lege zuerst fest, welche Zahl an erster Stelle steht, und vertausche dann die beiden anderen. Wie viele verschiedene Punkte entstehen, <Formel tex="P" /> selbst mitgezählt? Wie viele sind es bei <Pkt name="R" p={[...ZAEHLEN_GLEICH]} nach="?" />
      </p>
    </Aufgabe>
  );
}

/** Aufgabe 8: Nachrechnen am Punkt P (Koordinatensumme, Abstand zu M, Seitenlängen, Winkel). */
function Aufgabe8() {
  const m = [1, 1, 1];
  return (
    <Aufgabe
      nummer="8"
      titel="Am Beispiel nachrechnen"
      felder={[
        feld('s', 'Koordinatensumme', <>Koordinatensumme <Formel tex="s" /></>, 3),
        feld('d', 'Abstand von P eins zu M', <>Abstand <Formel tex={t`|\overrightarrow{MP_1}|`} /></>, dPM, 0.01),
        feld('l12', 'Länge der Seite P eins P zwei', <>Länge <Formel tex={t`|\overrightarrow{P_1P_2}|`} /></>, sP[0]!, 0.01),
        feld('l23', 'Länge der Seite P zwei P drei', <>Länge <Formel tex={t`|\overrightarrow{P_2P_3}|`} /></>, sP[1]!, 0.01),
        feld('w', 'Innenwinkel an P eins in Grad', <>Winkel in Grad</>, 120, 0.1),
      ]}
      hilfen={[
        <>Die Koordinatensumme addierst du für einen Punkt, danach vergleichst du mit den anderen. Den Abstand zweier Punkte berechnest du als Betrag ihres Verbindungsvektors (<Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>).</>,
        <>Der Winkel an <Formel tex={N(0)} /> liegt zwischen den beiden Pfeilen, die dort beginnen, also <Formel tex={t`\overrightarrow{P_1P_6}`} /> und <Formel tex={t`\overrightarrow{P_1P_2}`} nach="." /> Er folgt aus dem Skalarprodukt (<Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>), der Taschenrechner steht auf Gradmaß.</>,
      ]}
      loesung={[
        <>
          a: Für <Formel tex={N(0)} /> gilt
          <Kette z={[t`s`, t`-1+0+4`, t`3`]} />
          Bei <Formel tex={N(1)} /> ist es <Formel tex={t`0+(-1)+4=3`} nach="," /> bei <Formel tex={N(2)} /> ist es <Formel tex={t`4+(-1)+0=3`} nach="." /> Bei allen sechs Punkten steht dieselbe Summe, weil dieselben drei Zahlen addiert werden.
        </>,
        <>
          b: Mit <Pkt name="M" p={m} /> ist
          <Kette z={[t`\overrightarrow{MP_1}`, sp([-2, -1, 3])]} />
          Der Betrag ist
          <Kette z={[t`|\overrightarrow{MP_1}|`, t`\sqrt{4+1+9}`, t`\sqrt{14}`]} />
          Das sind etwa <Formel tex={rund(dPM)} nach="." /> Bei <Formel tex={N(1)} /> ist <Formel tex={t`\overrightarrow{MP_2}=${sp([-1, -2, 3])}`} /> und der Betrag <Formel tex={t`\sqrt{1+4+9}=\sqrt{14}`} nach="," /> derselbe Wert.
        </>,
        <>
          c: Die beiden ersten Seiten sind
          <Liste z={[t`\overrightarrow{P_1P_2}=${sp([1, -1, 0])}`, t`\overrightarrow{P_2P_3}=${sp([4, 0, -4])}`]} />
          Ihre Längen sind
          <Liste z={[t`|\overrightarrow{P_1P_2}|=\sqrt{2}`, t`|\overrightarrow{P_2P_3}|=\sqrt{32}`]} />
          also etwa <Formel tex={rund(sP[0]!)} /> und <Formel tex={rund(sP[1]!)} nach="." /> Die Seiten sind verschieden lang, das Sechseck ist für <Formel tex="P" /> nicht regelmäßig.
        </>,
        <>
          d: Die beiden Pfeile bei <Formel tex={N(0)} /> sind
          <Liste z={[t`\overrightarrow{P_1P_2}=${sp([1, -1, 0])}`, t`\overrightarrow{P_1P_6}=${sp([0, 4, -4])}`]} />
          Das Skalarprodukt ist <Formel tex={t`0-4+0=-4`} nach="," /> die Längen sind <Formel tex={t`\sqrt{2}`} /> und <Formel tex={t`\sqrt{32}`} nach="." />
          <Kette z={[t`\cos\varphi`, t`\frac{-4}{\sqrt{2}\cdot\sqrt{32}}`, t`\frac{-4}{8}`, t`-\frac{1}{2}`]} />
          Mit <Formel tex={t`\cos^{-1}`} /> folgt <Formel tex={t`\varphi=120^{\circ}`} nach="." /> Das passt zu den Winkeln im Labor.
        </>,
      ]}
    >
      <p>
        Die sechs Punkte, die aus <Formel tex="P" /> entstehen, heißen in der Reihenfolge auf dem Kreis <Pkt name="P_1" p={[...u[0]!]} nach="," /> <Pkt name="P_2" p={[...u[1]!]} nach="," /> <Pkt name="P_3" p={[...u[2]!]} nach="," /> <Pkt name="P_4" p={[...u[3]!]} nach="," /> <Pkt name="P_5" p={[...u[4]!]} /> und <Pkt name="P_6" p={[...u[5]!]} nach="." /> Der Punkt <Pkt name="M" p={[1, 1, 1]} /> ist der Mittelpunkt, den das Labor gezeigt hat.
      </p>
      <Teile>
        <li>Berechne die Koordinatensumme von <Formel tex={N(0)} /> und vergleiche mit <Formel tex={N(1)} /> und <Formel tex={N(2)} nach="." /></li>
        <li>Berechne den Abstand von <Formel tex={N(0)} /> zu <Formel tex="M" nach="." /></li>
        <li>Berechne die Längen der Seiten <Formel tex={t`\overline{P_1P_2}`} /> und <Formel tex={t`\overline{P_2P_3}`} nach="." /></li>
        <li>Berechne den Innenwinkel des Sechsecks bei <Formel tex={N(0)} nach="." /></li>
      </Teile>
      <KontrollFigur spec={permutationBild(P, { figur: true, mittelpunkt: true })} unter={<>Das Sechseck mit dem Mittelpunkt <Formel tex="M" /> und den gestrichelten Strecken zu den sechs Punkten, alle sind gleich lang. Die Seiten <Formel tex={t`\overline{P_1P_2}`} /> und <Formel tex={t`\overline{P_2P_3}`} /> sind verschieden lang.</>} />
    </Aufgabe>
  );
}

/** Aufgabe 10: Für welche z ist das Sechseck regelmäßig. */
function Aufgabe10() {
  const { a, b, z } = REFLEXION;
  return (
    <Aufgabe
      nummer="10"
      titel="Wann ist das Sechseck regelmäßig?"
      felder={[
        feld('z1', 'kleinster Wert von z', <>kleinster Wert von <Formel tex="z" /></>, z[0]),
        feld('z2', 'mittlerer Wert von z', <>mittlerer Wert von <Formel tex="z" /></>, z[1]),
        feld('z3', 'größter Wert von z', <>größter Wert von <Formel tex="z" /></>, z[2]),
      ]}
      hilfen={[
        <>Das Sechseck ist regelmäßig, wenn die drei Zahlen der Größe nach gleiche Abstände haben. Eine der drei Zahlen ist dann der Mittelwert der beiden anderen.</>,
        <>Unterscheide, welche der drei Zahlen <Formel tex="2" nach="," /> <Formel tex="5" /> und <Formel tex="z" /> in der Mitte steht.</>,
      ]}
      loesung={[
        <>
          Fall 1: <Formel tex="z" /> steht in der Mitte, zwischen <Formel tex="2" /> und <Formel tex="5" nach="." />
          <Kette z={[t`z`, t`\frac{2+5}{2}`, t`\frac{7}{2}`]} />
        </>,
        <>
          Fall 2: <Formel tex="2" /> steht in der Mitte, also <Formel tex="z" /> links von <Formel tex="2" nach="." />
          <Kette z={[t`2`, t`\frac{5+z}{2}`]} />
          Aus <Formel tex={t`4=5+z`} /> folgt <Formel tex={t`z=-1`} nach="." />
        </>,
        <>
          Fall 3: <Formel tex="5" /> steht in der Mitte, also <Formel tex="z" /> rechts von <Formel tex="5" nach="." />
          <Kette z={[t`5`, t`\frac{2+z}{2}`]} />
          Aus <Formel tex={t`10=2+z`} /> folgt <Formel tex={t`z=8`} nach="." /> Das Sechseck ist also für <Formel tex={t`z=-1`} nach="," /> <Formel tex={t`z=\frac{7}{2}`} /> und <Formel tex={t`z=8`} /> regelmäßig.
          <Zahlenstrahl a={a} b={b} z={z} text="Drei Zahlenstrahlen mit den Zahlen 2, 5 und z. Für z gleich minus 1, 3,5 und 8 haben die drei Zahlen jeweils zwei gleich große Abstände nebeneinander, 3 und 3 beziehungsweise 1,5 und 1,5." />
        </>,
      ]}
    >
      <p>
        Der Punkt <Formel tex={t`U(2\,|\,5\,|\,z)`} /> hat eine unbekannte dritte Koordinate. Für welche Werte von <Formel tex="z" /> ist das Sechseck, das aus <Formel tex="U" /> entsteht, regelmäßig? Gib die drei Werte der Größe nach an.
      </p>
    </Aufgabe>
  );
}

/** Zwei gegenüberliegende Seitenvektoren als Vielfache eines Vektors: breit in einer Zeile, schmal in vier kurzen Zeilen (Umbruch vor dem Gleichheitszeichen). */
function PaarSeiten({ a, fa, va, b, fb, vb }: { a: string; fa: string; va: number[]; b: string; fb: string; vb: number[] }) {
  return (
    <Umbruchformel
      tex={`${a}=(${fa})\\cdot${sp(va)},\\ \\ ${b}=(${fb})\\cdot${sp(vb)}`}
      schmal={`{\\small\\begin{gathered}${a}\\\\{}=(${fa})\\cdot${sp(va)}\\\\${b}\\\\{}=(${fb})\\cdot${sp(vb)}\\end{gathered}}`}
    />
  );
}

/** Die fünf Vermutungen als Auswahlfragen (immer, manchmal, nie). */
function Vermutungen() {
  const imm = 'immer richtig';
  const man = 'manchmal richtig, je nach Koordinaten';
  const nie = 'nie richtig';
  return (
    <>
      <Auswahlfrage
        nummer="3"
        titel="Eine gemeinsame Ebene"
        optionen={[
          opt('a', imm, true, <>Richtig. Alle sechs Punkte haben dieselben drei Zahlen als Koordinaten, nur in anderer Reihenfolge, also dieselbe Koordinatensumme.</>),
          opt('b', man, false, <>Das hängt nicht von den Koordinaten ab. Im Labor ist die Ebene bei jeder Wahl von <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> zu sehen, auch wenn sie sich verschiebt.</>),
          opt('c', nie, false, <>Doch: Im Labor liegen die Punkte bei jeder Wahl in der grauen Ebene, die du mit „Ebene zeigen“ einblendest.</>),
        ]}
        erklaerung={
          <>
            Die Koordinatensumme <Formel tex={t`s=a+b+c`} /> ist bei allen sechs Punkten gleich. Jeder Punkt erfüllt deshalb die Gleichung <Formel tex={t`x_1+x_2+x_3=s`} nach="," /> und das ist die Gleichung einer Ebene mit dem Normalenvektor <Formel tex={t`\vec{n}=${sp([1, 1, 1])}`} nach="." />
            <Figur spec={permutationBild(P, { figur: true, ebene: true })} unter={<>Die sechs Punkte zu <Formel tex={t`P(-1\,|\,0\,|\,4)`} /> liegen in der Ebene <Formel tex={t`x_1+x_2+x_3=3`} nach="." /></>} />
          </>
        }
      >
        <p>Gemeint sind immer drei verschiedene Koordinaten. Vermutung: Alle sechs Punkte liegen in einer gemeinsamen Ebene. Diese Vermutung ist …</p>
      </Auswahlfrage>
      <Auswahlfrage
        nummer="4"
        titel="Derselbe Abstand zu einem Punkt"
        optionen={[
          opt('a', imm, true, <>Richtig. Es gibt einen Punkt <Formel tex="M" nach="," /> zu dem alle sechs Punkte denselben Abstand haben. Wie er liegt, siehst du in der Erklärung.</>),
          opt('b', man, false, <>Probiere im Labor mit „Mittelpunkt M zeigen“ mehrere Werte aus: Die gestrichelten Strecken zu den sechs Punkten sind bei jeder Wahl gleich lang.</>),
          opt('c', nie, false, <>Im Labor sind die gestrichelten Strecken von <Formel tex="M" /> zu den Punkten bei jeder Wahl gleich lang, auch wenn sich ihre Länge ändert.</>),
        ]}
        erklaerung={
          <>
            Der Punkt ist <Formel tex={t`M(m\,|\,m\,|\,m)`} /> mit <Formel tex={t`m=\frac{a+b+c}{3}`} nach="." /> Er liegt auf der Raumdiagonalen (alle Punkte mit drei gleichen Koordinaten) und in der Ebene, denn <Formel tex={t`m+m+m=a+b+c`} nach="." /> Der Abstand von <Formel tex="M" /> zu einem der sechs Punkte setzt sich aus denselben drei Quadraten <Formel tex={t`(a-m)^2`} nach="," /> <Formel tex={t`(b-m)^2`} /> und <Formel tex={t`(c-m)^2`} /> zusammen, nur in anderer Reihenfolge. Also ist er überall gleich, die sechs Punkte liegen auf einem Kreis um <Formel tex="M" nach="." />
            <Figur spec={permutationBild(P, { figur: true, mittelpunkt: true })} unter={<>Für <Formel tex={t`P(-1\,|\,0\,|\,4)`} /> ist <Formel tex={t`M(1\,|\,1\,|\,1)`} /> und der Abstand überall <Formel tex={t`\sqrt{14}\approx ${rund(dPM)}`} nach="." /></>} />
          </>
        }
      >
        <p>Vermutung: Alle sechs Punkte haben denselben Abstand von einem gemeinsamen Punkt. Diese Vermutung ist …</p>
      </Auswahlfrage>
      <Auswahlfrage
        nummer="5"
        titel="Ein regelmäßiges Sechseck"
        optionen={[
          opt('a', imm, false, <>Im Labor findest du Koordinaten, bei denen die Seiten abwechselnd lang und kurz sind, zum Beispiel bei <Formel tex={t`P(-1\,|\,0\,|\,4)`} nach="." /> Dann ist das Sechseck nicht regelmäßig.</>),
          opt('b', man, true, <>Richtig. Es gibt Koordinaten mit lauter gleich langen Seiten und solche, bei denen die Seiten abwechselnd kurz und lang sind.</>),
          opt('c', nie, false, <>Im Labor gibt es Koordinaten, bei denen alle Seiten gleich lang sind, zum Beispiel <Formel tex={t`(-2\,|\,1\,|\,4)`} nach="." /></>),
        ]}
        erklaerung={
          <>
            Ordnet man die Koordinaten der Größe nach als <Formel tex={t`a<b<c`} nach="," /> sind die Seiten abwechselnd <Formel tex={t`\sqrt{2}\cdot(b-a)`} /> und <Formel tex={t`\sqrt{2}\cdot(c-b)`} nach="." /> Sie sind genau dann gleich lang, wenn <Formel tex={t`b-a=c-b`} /> gilt, also wenn <Formel tex="b" /> der Mittelwert von <Formel tex="a" /> und <Formel tex="c" /> ist. Bei <Formel tex={t`(-1\,|\,0\,|\,4)`} /> sind die Abstände <Formel tex="1" /> und <Formel tex="4" nach="," /> bei <Formel tex={t`(-2\,|\,1\,|\,4)`} /> beide <Formel tex="3" nach="." />
            <Figur spec={permutationBild(P, { figur: true })} unter={<>Zu <Formel tex={t`P(-1\,|\,0\,|\,4)`} /> gehören die Seitenlängen <Formel tex={t`\sqrt{2}`} /> und <Formel tex={t`4\sqrt{2}`} nach="." /> Das Sechseck ist nicht regelmäßig.</>} />
            <Figur spec={permutationBild(Q, { figur: true })} unter={<>Zu <Formel tex={t`(-2\,|\,1\,|\,4)`} /> gehört <Formel tex={t`3\sqrt{2}`} /> für alle Seiten. Das Sechseck ist regelmäßig.</>} />
          </>
        }
      >
        <p>Vermutung: Das Sechseck ist regelmäßig, alle Seiten sind also gleich lang. Diese Vermutung ist …</p>
      </Auswahlfrage>
      <Auswahlfrage
        nummer="6"
        titel="Gegenüberliegende Seiten"
        optionen={[
          opt('a', imm, true, <>Richtig. Auch bei einem Sechseck, das nicht regelmäßig ist, sind gegenüberliegende Seiten parallel, sie sind nur verschieden lang.</>),
          opt('b', man, false, <>Es kommt nicht auf die Koordinaten an. Schau dir im Labor ein Sechseck an, das nicht regelmäßig ist: Gegenüberliegende Seiten sind trotzdem parallel.</>),
          opt('c', nie, false, <>Im Labor liegen gegenüberliegende Seiten bei jeder Wahl parallel, auch wenn sie verschieden lang sind.</>),
        ]}
        erklaerung={
          <>
            Gegenüberliegende Seiten haben im Bild dieselbe Farbe. Bei <Formel tex={t`P(-1\,|\,0\,|\,4)`} /> ist <Formel tex={t`\overrightarrow{P_1P_2}=${sp([1, -1, 0])}`} /> und die gegenüberliegende Seite <Formel tex={t`\overrightarrow{P_4P_5}=${sp([-4, 4, 0])}=-4\cdot${sp([1, -1, 0])}`} nach="." /> Die beiden Vektoren sind Vielfache voneinander, die Seiten sind also parallel. Warum das immer gilt, begründest du in Aufgabe 9.
            <Figur spec={permutationBild(P, { figur: true, gegenseiten: true })} unter={<>Gegenüberliegende Seiten haben dieselbe Farbe und sind parallel, aber verschieden lang.</>} />
            <Ebenenansicht p={P} gegenseiten text="Das Sechseck von oben auf die Ebene gesehen, längentreu. Gegenüberliegende Seiten haben dieselbe Farbe in Orange, Blau und Rosa und sind parallel." />
          </>
        }
      >
        <p>Vermutung: Gegenüberliegende Seiten des Sechsecks sind parallel. Diese Vermutung ist …</p>
      </Auswahlfrage>
      <Auswahlfrage
        nummer="7"
        titel="Ein rechter Winkel"
        optionen={[
          opt('a', imm, false, <>Im Labor sind die Innenwinkel bei jeder Wahl gleich groß, nämlich <Formel tex={t`120^{\circ}`} nach="," /> kein rechter Winkel ist dabei.</>),
          opt('b', man, false, <>Die Innenwinkel hängen nicht von den Koordinaten ab. Im Labor stehen sie bei jeder Wahl auf <Formel tex={t`120^{\circ}`} nach="." /></>),
          opt('c', nie, true, <>Richtig. Alle Innenwinkel betragen <Formel tex={t`120^{\circ}`} nach="," /> unabhängig von den Koordinaten.</>),
        ]}
        erklaerung={
          <>
            Das Sechseck ist immer gleichwinklig, jeder Innenwinkel beträgt <Formel tex={t`120^{\circ}`} nach="." /> Das gilt auch dann, wenn die Seiten abwechselnd verschieden lang sind. In Aufgabe 8 rechnest du den Winkel an einem Beispiel nach, in Aufgabe 9 begründest du ihn.
            <Ebenenansicht p={P} text="Das Sechseck von oben auf die Ebene gesehen, längentreu. Es hat sechs gleich große Innenwinkel, abwechselnd lange und kurze Seiten." />
          </>
        }
      >
        <p>Vermutung: Das Sechseck hat einen rechten Winkel. Diese Vermutung ist …</p>
      </Auswahlfrage>
    </>
  );
}

/** Aufgabe 9: Begründung für beliebige Koordinaten (Ebene, Kreis, Seiten und Winkel). */
function Aufgabe9() {
  return (
    <Zeichenaufgabe
      nummer="9"
      titel="Gilt das für beliebige Punkte?"
      hilfe={
        <>
          <p>
            a: Jeder der sechs Punkte hat die drei Zahlen <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> als Koordinaten, nur in anderer Reihenfolge. Die Summe ist deshalb bei allen <Formel tex={t`s=a+b+c`} nach="." /> Jeder Punkt erfüllt also
          </p>
          <Kette z={[t`x_1+x_2+x_3`, t`s`]} />
          <p>
            Das ist eine Ebene mit dem Normalenvektor <Formel tex={t`\vec{n}=${sp([1, 1, 1])}`} nach="." />
          </p>
          <p>
            b: Sei <Formel tex={t`m=\frac{a+b+c}{3}`} /> und <Formel tex={t`M(m\,|\,m\,|\,m)`} nach="." /> Es gilt <Formel tex={t`m+m+m=s`} nach="," /> also liegt <Formel tex="M" /> in der Ebene. Für einen der sechs Punkte <Formel tex={t`X(x_1\,|\,x_2\,|\,x_3)`} /> ist das Quadrat des Abstands <Formel tex={t`|\overrightarrow{MX}|^2`} /> die Summe der drei Quadrate <Formel tex={t`(x_1-m)^2`} nach="," /> <Formel tex={t`(x_2-m)^2`} /> und <Formel tex={t`(x_3-m)^2`} nach="." />
          </p>
          <p>
            In der Summe stehen immer dieselben Summanden <Formel tex={t`(a-m)^2`} nach="," /> <Formel tex={t`(b-m)^2`} /> und <Formel tex={t`(c-m)^2`} nach="," /> nur in anderer Reihenfolge. Der Abstand zu <Formel tex="M" /> ist also bei allen sechs Punkten gleich. In der Ebene haben sie denselben Abstand zu <Formel tex="M" nach="," /> sie liegen auf einem Kreis um <Formel tex="M" nach="." />
          </p>
          <p>
            c: Ordne die Koordinaten so, dass <Formel tex={t`a<b<c`} /> gilt. Die Punkte in der Reihenfolge auf dem Kreis sind <Formel tex={t`P_1(a\,|\,b\,|\,c)`} nach="," /> <Formel tex={t`P_2(b\,|\,a\,|\,c)`} nach="," /> <Formel tex={t`P_3(c\,|\,a\,|\,b)`} nach="," /> <Formel tex={t`P_4(c\,|\,b\,|\,a)`} nach="," /> <Formel tex={t`P_5(b\,|\,c\,|\,a)`} /> und <Formel tex={t`P_6(a\,|\,c\,|\,b)`} nach="." /> Die Seitenvektoren sind
          </p>
          <PaarSeiten a={t`\overrightarrow{P_1P_2}`} fa={t`b-a`} va={[1, -1, 0]} b={t`\overrightarrow{P_4P_5}`} fb={t`c-b`} vb={[-1, 1, 0]} />
          <PaarSeiten a={t`\overrightarrow{P_2P_3}`} fa={t`c-b`} va={[1, 0, -1]} b={t`\overrightarrow{P_5P_6}`} fb={t`b-a`} vb={[-1, 0, 1]} />
          <PaarSeiten a={t`\overrightarrow{P_3P_4}`} fa={t`b-a`} va={[0, 1, -1]} b={t`\overrightarrow{P_6P_1}`} fb={t`c-b`} vb={[0, -1, 1]} />
          <p>
            Je zwei gegenüberliegende Seiten stehen oben zusammen. Sie sind Vielfache desselben Vektors, also parallel. Die Längen sind abwechselnd <Formel tex={t`\sqrt{2}\cdot(b-a)`} /> und <Formel tex={t`\sqrt{2}\cdot(c-b)`} nach="." /> Zwei aufeinanderfolgende Richtungen wie <Formel tex={sp([1, -1, 0])} /> und <Formel tex={sp([1, 0, -1])} /> haben das Skalarprodukt <Formel tex="1" /> und die Längen <Formel tex={t`\sqrt{2}`} nach="," /> also ist <Formel tex={t`\cos\varphi=\frac{1}{2}`} /> und <Formel tex={t`\varphi=60^{\circ}`} nach="." /> Der Weg knickt an jeder Ecke um <Formel tex={t`60^{\circ}`} /> ab, der Innenwinkel ist <Formel tex={t`180^{\circ}-60^{\circ}=120^{\circ}`} nach="." /> Das Sechseck ist regelmäßig, wenn <Formel tex={t`b-a=c-b`} /> gilt, also <Formel tex={t`b=\frac{a+c}{2}`} nach="."/>
          </p>
        </>
      }
      kontrolle={<KontrollFigur spec={permutationBild(P, { figur: true, gegenseiten: true, ebene: true })} unter={<>Die sechs Punkte liegen in der Ebene <Formel tex={t`x_1+x_2+x_3=3`} nach="." /> Gegenüberliegende Seiten haben dieselbe Farbe und sind parallel.</>} />}
    >
      <p>
        Bisher hast du Beispiele untersucht. Begründe für beliebige Zahlen <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> mit <Formel tex={t`a<b<c`} nach="," /> dass die sechs Punkte, die aus <Formel tex={t`P(a\,|\,b\,|\,c)`} /> entstehen, die Beobachtungen aus dem Labor erfüllen. Frage dich dabei, was beim Vertauschen gleich bleibt.
      </p>
      <Teile>
        <li>Zeige, dass alle sechs Punkte in einer gemeinsamen Ebene liegen.</li>
        <li>Zeige, dass alle sechs Punkte denselben Abstand zu <Formel tex={t`M(m\,|\,m\,|\,m)`} /> mit <Formel tex={t`m=\frac{a+b+c}{3}`} /> haben.</li>
        <li>Begründe, dass gegenüberliegende Seiten parallel sind und alle Innenwinkel <Formel tex={t`120^{\circ}`} /> betragen.</li>
      </Teile>
    </Zeichenaufgabe>
  );
}

/** Aufgabe 11: Sonderfall mit zwei gleichen Koordinaten. */
function Aufgabe11() {
  return (
    <Auswahlfrage
      nummer="11"
      titel="Sonderfall: zwei gleiche Koordinaten"
      optionen={[
        opt('a', 'ein Sechseck', false, <>Bei zwei gleichen Koordinaten entstehen nur drei verschiedene Punkte, wie in Aufgabe 1. Drei Punkte bilden kein Sechseck.</>),
        opt('b', 'ein gleichseitiges Dreieck', true, <>Richtig. Es entstehen drei Punkte, die alle gleich weit voneinander entfernt sind.</>),
        opt('c', 'ein Dreieck, das nicht gleichseitig ist', false, <>Alle drei Seiten sind gleich lang, wie die Rechnung in der Erklärung zeigt.</>),
        opt('d', 'eine Strecke', false, <>Die drei Punkte liegen nicht auf einer Geraden. Ihre Abstände zueinander sind alle gleich groß und größer als null, bei Punkten auf einer Geraden wäre ein Abstand die Summe der beiden anderen.</>),
      ]}
      erklaerung={
        <>
          Es entstehen <Pkt name="T_1" p={[1, 1, 4]} nach="," /> <Pkt name="T_2" p={[1, 4, 1]} /> und <Pkt name="T_3" p={[4, 1, 1]} nach="." /> Je zwei Punkte unterscheiden sich in zwei Koordinaten um <Formel tex="3" nach="," /> ihr Abstand ist
          <Kette z={[t`\sqrt{0+9+9}`, t`\sqrt{18}`]} />
          Alle drei Seiten sind also <Formel tex={t`\sqrt{18}=3\sqrt{2}`} /> lang. Die Punkte liegen wieder in der Ebene <Formel tex={t`x_1+x_2+x_3=6`} nach="." />
          <Figur spec={permutationBild(T, { figur: true, ebene: true })} unter={<>Aus <Formel tex={t`T(1\,|\,1\,|\,4)`} /> entsteht ein gleichseitiges Dreieck in der Ebene <Formel tex={t`x_1+x_2+x_3=6`} nach="." /></>} />
        </>
      }
    >
      <p>
        Die Koordinaten von <Pkt name="T" p={[...T]} /> werden auf alle möglichen Arten vertauscht. Welche Figur entsteht, wenn man die entstehenden Punkte verbindet?
      </p>
    </Auswahlfrage>
  );
}

export function PunkteVertauschen() {
  return (
    <Abschnitt id="punkte-vertauschen" titel="Punkte vertauschen">
      <Hinweis titel="Die Problemaufgabe">
        <p>
          Der Punkt <Pkt name="P" p={[...P]} /> hat die Koordinaten <Formel tex="-1" nach="," /> <Formel tex="0" /> und <Formel tex="4" nach="." /> Vertauscht man diese drei Zahlen auf alle möglichen Arten, entstehen neue Punkte, zum Beispiel <Formel tex={t`(0\,|\,-1\,|\,4)`} nach="." /> Untersuche, wie diese Punkte im Raum zueinander liegen. Formuliere Vermutungen und überprüfe sie. Gilt das, was du findest, auch für andere Punkte?
        </p>
      </Hinweis>

      <h3>Schritt 1: Verstehen und Beispiele sammeln</h3>
      <Aufgabe1 />
      <Zeichenaufgabe
        nummer="2"
        titel="Die Punkte zeichnen"
        hilfe={
          <>
            <p>
              Ein Punkt <Formel tex={t`(p_1\,|\,p_2\,|\,p_3)`} /> liegt im Schrägbild bei <Formel tex={t`X=p_2-\frac{p_1}{2}`} /> und <Formel tex={t`Y=p_3-\frac{p_1}{2}`} nach="," /> wie im Modul <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis> beschrieben. Für <Formel tex={N(0)} /> ist
            </p>
            <Liste z={[t`X=0-\frac{-1}{2}=\frac{1}{2}`, t`Y=4-\frac{-1}{2}=\frac{9}{2}`]} />
            <p>
              Die sechs Punkte wirken wie die Ecken eines flachen Sechsecks. Ob das stimmt, ist die erste Vermutung im nächsten Schritt.
            </p>
          </>
        }
        kontrolle={<KontrollFigur spec={permutationBild(P)} unter={<>Die sechs Punkte, die beim Vertauschen der Koordinaten von <Formel tex="P" /> entstehen. <Formel tex={N(0)} /> ist <Formel tex="P" /> selbst.</>} />}
      >
        <p>
          Zeichne die sechs Punkte aus Aufgabe 1 in ein Schrägbild des Koordinatensystems und beschrifte sie. Beschreibe, was dir an ihrer Lage auffällt.
        </p>
      </Zeichenaufgabe>

      <h3>Schritt 2: Vermutungen aufstellen</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere dir zwei oder drei Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Wie liegen die sechs Punkte im Raum zueinander? Denke an eine Ebene, an Abstände zu einem gemeinsamen Punkt und an die Form der Figur, wenn du die Punkte der Reihe nach verbindest. Wann könnte die Figur ein regelmäßiges Sechseck sein?
          </p>
          <Beobachtung
            bild={<Figur spec={permutationBild(P, { figur: true, ebene: true })} unter={<>Erwartet werden Aussagen wie: Die Punkte liegen in einer Ebene, sie haben denselben Abstand von einem Punkt, sie bilden ein Sechseck, und nur bei besonderen Koordinaten sind alle Seiten gleich lang. Ob das stimmt, prüfst du im Labor.</>} />}
          >
            <p>
              Deine Vermutungen sollten sich auf die Lage in einer Ebene, auf gleiche Abstände und auf die Form des Sechsecks beziehen. Im Labor kannst du alle überprüfen.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Schritt 3: Im Labor untersuchen</h3>
      <p>
        Stelle mit den Reglern verschiedene Werte für <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> ein und schalte die Ebene und den Mittelpunkt dazu. Achte auf die Koordinatensumme, den Abstand zu <Formel tex="M" /> und die Seitenlängen. Wähle auch Werte, bei denen zwei Koordinaten gleich sind. Finde Werte, bei denen das Sechseck regelmäßig ist, und beschreibe, was sie gemeinsam haben.
      </p>
      <Permutationslabor />

      <h3>Schritt 4: Vermutungen prüfen</h3>
      <p>
        Ordne die Vermutungen ein. Entscheide jeweils, ob sie immer, manchmal oder nie richtig sind. Gemeint sind immer drei verschiedene Koordinaten.
      </p>
      <Vermutungen />

      <h3>Schritt 5: Rechnerisch überprüfen</h3>
      <p>
        Das Labor zeigt viele Fälle, es ersetzt aber keine Rechnung. Rechne die Beobachtungen für den Punkt <Formel tex="P" /> nach. Gib Dezimalzahlen mit zwei Nachkommastellen an.
      </p>
      <Aufgabe8 />

      <h3>Schritt 6: Gilt das für beliebige Punkte?</h3>
      <Aufgabe9 />

      <h3>Schritt 7: Sonderfälle und Rückblick</h3>
      <Aufgabe10 />
      <Aufgabe11 />
      <Hinweis titel="Rückblick">
        <ul>
          <li>Welche Strategie hat dir am meisten geholfen: Beispiele sammeln, die Skizze, das Labor oder die Rechnung?</li>
          <li>Welche Vermutung hast du anfangs anders eingeschätzt als die Überprüfung?</li>
          <li>Bei welchen Punkten gilt das Ergebnis nicht oder nur eingeschränkt, und warum?</li>
        </ul>
      </Hinweis>
      <Hinweis titel="Weiter denken">
        <ul>
          <li>Was ändert sich, wenn du zusätzlich die Vorzeichen der Koordinaten wechseln darfst?</li>
          <li>Wie liegen die Punkte in der Ebene, die aus <Formel tex={t`(a\,|\,b)`} /> durch Vertauschen der beiden Koordinaten entstehen?</li>
        </ul>
        <p>Das Modul gibt dazu keine Lösung vor. Besprich deine Ergebnisse in der Gruppe oder mit deiner Lehrkraft.</p>
      </Hinweis>
    </Abschnitt>
  );
}
