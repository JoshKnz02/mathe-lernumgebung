import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Figur, KontrollFigur } from '@/components/Raumfigur';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import {
  BILD_AUSWAHL_INNEN,
  BILD_AUSWAHL_VIERECK,
  aufgDrachen,
  aufgDreieck,
  aufgParallelogramm,
  aufgRaumDreieck,
  aufgRaute,
  aufgRechteck,
  aufgRechtwinklig,
  aufgTrapez,
} from './Bilder';
import { A_DRACHEN, A_DREIECK, A_FLAECHE, A_PARALLELOGRAMM, A_RAUMDREIECK, A_RAUMWINKEL, A_RAUTE, A_RAUTENWINKEL, A_RECHTECK, A_RECHTWINKLIG, A_TRAPEZ } from './daten';

const sp = (v: number[]) => spalte(v);
const feldZahl = (id: string, name: string, beschriftung: React.ReactNode, erwartet: number, toleranz?: number): Feld => ({ id, name, beschriftung, erwartet, ...(toleranz ? { toleranz } : {}) });

export function Ueberpruefen() {
  const d = A_DREIECK;
  const r = A_RECHTWINKLIG;
  const rd = A_RAUMDREIECK;
  const p = A_PARALLELOGRAMM;
  const rt = A_RECHTECK;
  const ra = A_RAUTE;
  const tr = A_TRAPEZ;
  const dr = A_DRACHEN;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gezeichnet oder gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten.
      </p>
      <Hinweis titel="Eingabe">
        Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma. Längen und Winkel gibst du auf zwei Nachkommastellen genau an, Winkel in Grad ohne Gradzeichen. Der Taschenrechner steht auf Gradmaß (DEG).
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Seiten und Winkel eines Dreiecks"
        felder={[
          feldZahl('ab', 'Länge von A B', <>Länge <Formel tex={t`|\overrightarrow{AB}|`} /></>, d.ab),
          feldZahl('ac', 'Länge von A C', <>Länge <Formel tex={t`|\overrightarrow{AC}|`} /></>, d.ac),
          feldZahl('bc', 'Länge von B C', <>Länge <Formel tex={t`|\overrightarrow{BC}|`} /></>, d.bc, 0.01),
          feldZahl('al', 'Winkel bei A in Grad', <>Winkel <Formel tex={t`\alpha`} /> bei <Formel tex="A" /> in Grad</>, d.alpha, 0.01),
          feldZahl('be', 'Winkel bei B in Grad', <>Winkel <Formel tex={t`\beta`} /> bei <Formel tex="B" /> in Grad</>, d.beta, 0.01),
        ]}
        hilfen={[
          <>Berechne die Verbindungsvektoren <Formel tex={t`\overrightarrow{AB}`} nach="," /> <Formel tex={t`\overrightarrow{AC}`} /> und <Formel tex={t`\overrightarrow{BC}`} nach="." /> Ihre Beträge sind die Seitenlängen.</>,
          <>Für den Winkel bei <Formel tex="B" /> brauchst du <Formel tex={t`\overrightarrow{BA}`} /> und <Formel tex={t`\overrightarrow{BC}`} nach="," /> nicht <Formel tex={t`\overrightarrow{AB}`} nach="." /></>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=${sp([4, 3])}`} nach="," /> <Formel tex={t`\overrightarrow{AC}=${sp([-5, 0])}`} /> und <Formel tex={t`\overrightarrow{BC}=${sp([-9, -3])}`} nach="." /> Damit ist <Formel tex={t`|\overrightarrow{AB}|=\sqrt{25}=5`} nach="," /> <Formel tex={t`|\overrightarrow{AC}|=5`} /> und <Formel tex={t`|\overrightarrow{BC}|=\sqrt{90}\approx 9{,}49`} nach="." /> Das Dreieck ist gleichschenklig mit der Spitze <Formel tex="A" nach="." />
          </>,
          <>
            <Formel tex={t`\cos\alpha=\dfrac{4\cdot(-5)+3\cdot 0}{5\cdot 5}=-0{,}8`} nach="," /> also <Formel tex={t`\alpha\approx 143{,}13^{\circ}`} nach="." />
          </>,
          <>
            <Formel tex={t`\overrightarrow{BA}\cdot\overrightarrow{BC}=(-4)\cdot(-9)+(-3)\cdot(-3)=45`} nach="," /> also <Formel tex={t`\cos\beta=\dfrac{45}{5\cdot\sqrt{90}}\approx 0{,}9487`} /> und <Formel tex={t`\beta\approx 18{,}43^{\circ}`} nach="." /> Der Winkel bei <Formel tex="C" /> ist wegen des gleichschenkligen Dreiecks ebenfalls <Formel tex={t`18{,}43^{\circ}`} nach="." /> Probe: <Formel tex={t`143{,}13+2\cdot 18{,}43\approx 180`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben ist das Dreieck mit <Formel tex={t`A(1\,|\,1)`} nach="," /> <Formel tex={t`B(5\,|\,4)`} /> und <Formel tex={t`C(-4\,|\,1)`} nach="." /> Berechne die Seitenlängen und die Innenwinkel bei <Formel tex="A" /> und <Formel tex="B" nach="." />
        </p>
        <Bild daten={aufgDreieck(false)} unter={<>Die Ecken des Dreiecks.</>} />
        <Kontrollschaubild>
          <Bild daten={aufgDreieck(true)} unter={<>Das gleichschenklige Dreieck mit den Pfeilen <Formel tex={t`\overrightarrow{AB}`} /> (orange) und <Formel tex={t`\overrightarrow{AC}`} /> (blau) bei <Formel tex="A" nach="." /></>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Aufgabe
        nummer={2}
        titel="Ein rechtwinkliges Dreieck nachweisen"
        felder={[
          feldZahl('sa', 'Skalarprodukt bei A', <>Skalarprodukt bei <Formel tex="A" /></>, r.skalare[0]!),
          feldZahl('sb', 'Skalarprodukt bei B', <>Skalarprodukt bei <Formel tex="B" /></>, r.skalare[1]!),
          feldZahl('sc', 'Skalarprodukt bei C', <>Skalarprodukt bei <Formel tex="C" /></>, r.skalare[2]!),
          feldZahl('fl', 'Flächeninhalt', <>Flächeninhalt</>, r.flaeche),
        ]}
        hilfen={[
          <>Berechne an jeder Ecke das Skalarprodukt der beiden Seitenvektoren, die dort beginnen: <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AC}`} nach="," /> <Formel tex={t`\overrightarrow{BA}\cdot\overrightarrow{BC}`} /> und <Formel tex={t`\overrightarrow{CA}\cdot\overrightarrow{CB}`} nach="." /></>,
          <>Bei einem rechtwinkligen Dreieck sind die beiden Seiten am rechten Winkel die Katheten, der Flächeninhalt ist ihr Produkt geteilt durch 2.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AC}=${sp([4, -2])}\cdot${sp([5, 0])}=20`} nach="," /> <Formel tex={t`\overrightarrow{BA}\cdot\overrightarrow{BC}=${sp([-4, 2])}\cdot${sp([1, 2])}=-4+4=0`} /> und <Formel tex={t`\overrightarrow{CA}\cdot\overrightarrow{CB}=${sp([-5, 0])}\cdot${sp([-1, -2])}=5`} nach="." />
          </>,
          <>
            Nur bei <Formel tex="B" /> ist das Skalarprodukt 0: Das Dreieck ist rechtwinklig bei <Formel tex="B" nach="." /> Die Katheten sind <Formel tex={t`|\overrightarrow{BA}|=\sqrt{20}`} /> und <Formel tex={t`|\overrightarrow{BC}|=\sqrt{5}`} nach="," /> der Flächeninhalt ist <Formel tex={t`\frac{1}{2}\cdot\sqrt{20}\cdot\sqrt{5}=\frac{1}{2}\cdot 10=5`} nach="." />
          </>,
        ]}
      >
        <p>
          Zeige, dass das Dreieck mit <Formel tex={t`A(-1\,|\,2)`} nach="," /> <Formel tex={t`B(3\,|\,0)`} /> und <Formel tex={t`C(4\,|\,2)`} /> rechtwinklig ist, und berechne seinen Flächeninhalt.
        </p>
        <Bild daten={aufgRechtwinklig(false)} unter={<>Die Ecken des Dreiecks.</>} />
        <Kontrollschaubild>
          <Bild daten={aufgRechtwinklig(true)} unter={<>Bei <Formel tex="B" /> beginnen die Pfeile <Formel tex={t`\overrightarrow{BA}`} /> (orange) und <Formel tex={t`\overrightarrow{BC}`} /> (blau), sie stehen senkrecht aufeinander.</>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Welcher Winkel ist der Innenwinkel bei B?"
        optionen={platziere(
          [
            opt('a', <>Der Winkel zwischen <Formel tex={t`\overrightarrow{BA}`} /> und <Formel tex={t`\overrightarrow{BC}`} /></>, true, <>Richtig: Beide Pfeile beginnen in <Formel tex="B" /> und laufen entlang der Dreiecksseiten.</>),
            opt('b', <>Der Winkel zwischen <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{BC}`} /></>, false, <>Das ist der Außenwinkel bei <Formel tex="B" nach="." /> <Formel tex={t`\overrightarrow{AB}`} /> zeigt zu <Formel tex="B" /> hin, bei <Formel tex="B" /> angesetzt zeigt er von <Formel tex="A" /> weg. Hier ergibt sich <Formel tex={t`153{,}43^{\circ}`} /> statt <Formel tex={t`26{,}57^{\circ}`} nach="." /></>),
            opt('c', <>Der Winkel zwischen <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /></>, false, <>Das ist der Innenwinkel bei <Formel tex="A" nach="," /> nicht bei <Formel tex="B" nach="." /></>),
            opt('d', <>Der Winkel zwischen <Formel tex={t`\overrightarrow{CB}`} /> und <Formel tex={t`\overrightarrow{CA}`} /></>, false, <>Das ist der Innenwinkel bei <Formel tex="C" nach="." /></>),
          ],
          1,
        )}
        erklaerung={
          <>
            Der Innenwinkel an einer Ecke liegt zwischen den beiden Pfeilen, die dort beginnen. Bei <Formel tex="B" /> sind das <Formel tex={t`\overrightarrow{BA}`} /> und <Formel tex={t`\overrightarrow{BC}`} nach="." />
            <Bild daten={BILD_AUSWAHL_INNEN} unter={<>Der Innenwinkel bei <Formel tex="B" /> liegt zwischen den Pfeilen <Formel tex={t`\overrightarrow{BA}`} /> (orange) und <Formel tex={t`\overrightarrow{BC}`} /> (blau). Der gestrichelte Pfeil ist <Formel tex={t`\overrightarrow{AB}`} nach="." /></>} />
          </>
        }
      >
        <p>
          Im Dreieck <Formel tex="ABC" /> soll der Innenwinkel bei <Formel tex="B" /> berechnet werden. Welche Vektoren gehören dazu?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={4}
        titel="Ein Dreieck im Raum"
        felder={[
          feldZahl('ab', 'Länge von A B', <>Länge <Formel tex={t`|\overrightarrow{AB}|`} /></>, rd.ab),
          feldZahl('ac', 'Länge von A C', <>Länge <Formel tex={t`|\overrightarrow{AC}|`} /></>, rd.ac),
          feldZahl('sp', 'Skalarprodukt von A B und A C', <>Skalarprodukt <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AC}`} /></>, rd.skalar),
          feldZahl('bc', 'Länge von B C', <>Länge <Formel tex={t`|\overrightarrow{BC}|`} /></>, rd.bc, 0.01),
        ]}
        hilfen={[<>Berechne <Formel tex={t`\overrightarrow{AB}`} nach="," /> <Formel tex={t`\overrightarrow{AC}`} /> und <Formel tex={t`\overrightarrow{BC}`} nach="." /> Zwei gleich lange Seiten und ein Skalarprodukt von 0 sagen dir, um welches Dreieck es sich handelt.</>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=${sp([2, 1, 2])}`} nach="," /> <Formel tex={t`\overrightarrow{AC}=${sp([1, 2, -2])}`} /> und <Formel tex={t`\overrightarrow{BC}=${sp([-1, 1, -4])}`} nach="." />
          </>,
          <>
            <Formel tex={t`|\overrightarrow{AB}|=\sqrt{4+1+4}=3`} nach="," /> <Formel tex={t`|\overrightarrow{AC}|=\sqrt{1+4+4}=3`} /> und <Formel tex={t`|\overrightarrow{BC}|=\sqrt{1+1+16}=\sqrt{18}\approx 4{,}24`} nach="." /> Das Skalarprodukt ist <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AC}=2+2-4=0`} nach="." /> Das Dreieck ist gleichschenklig und rechtwinklig mit dem rechten Winkel bei <Formel tex="A" nach="." /> Zur Probe: <Formel tex={t`3^2+3^2=18=|\overrightarrow{BC}|^2`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben ist das Dreieck mit <Formel tex={t`A(-1\,|\,0\,|\,1)`} nach="," /> <Formel tex={t`B(1\,|\,1\,|\,3)`} /> und <Formel tex={t`C(0\,|\,2\,|\,-1)`} nach="." /> Berechne die Seitenlängen <Formel tex={t`|\overrightarrow{AB}|`} nach="," /> <Formel tex={t`|\overrightarrow{AC}|`} /> und <Formel tex={t`|\overrightarrow{BC}|`} /> sowie das Skalarprodukt <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AC}`} nach="." /> Um welche Art von Dreieck handelt es sich?
        </p>
        <Figur spec={aufgRaumDreieck(false)} unter={<>Die Ecken des Dreiecks.</>} />
        <KontrollFigur spec={aufgRaumDreieck(true)} unter={<>Das Dreieck mit den Pfeilen <Formel tex={t`\overrightarrow{AB}`} /> (orange) und <Formel tex={t`\overrightarrow{AC}`} /> (blau) bei <Formel tex="A" nach="." /></>} />
      </Aufgabe>

      <Aufgabe
        nummer={5}
        titel="Die Winkel im Raumdreieck"
        felder={[
          feldZahl('be', 'Winkel bei B in Grad', <>Winkel <Formel tex={t`\beta`} /> bei <Formel tex="B" /> in Grad</>, A_RAUMWINKEL.beta, 0.01),
          feldZahl('ga', 'Winkel bei C in Grad', <>Winkel <Formel tex={t`\gamma`} /> bei <Formel tex="C" /> in Grad</>, A_RAUMWINKEL.gamma, 0.01),
        ]}
        hilfen={[<>Für den Winkel bei <Formel tex="B" /> brauchst du <Formel tex={t`\overrightarrow{BA}`} /> und <Formel tex={t`\overrightarrow{BC}`} nach="." /> Als Probe muss die Winkelsumme 180° ergeben, bei <Formel tex="A" /> liegt der rechte Winkel.</>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{BA}\cdot\overrightarrow{BC}=${sp([-2, -1, -2])}\cdot${sp([-1, 1, -4])}=2-1+8=9`} nach="," /> also <Formel tex={t`\cos\beta=\dfrac{9}{3\cdot\sqrt{18}}=\dfrac{1}{\sqrt{2}}`} nach="," /> und <Formel tex={t`\beta=45^{\circ}`} nach="." />
          </>,
          <>
            Das Dreieck ist gleichschenklig und rechtwinklig, die beiden anderen Winkel sind gleich: <Formel tex={t`\gamma=\dfrac{180^{\circ}-90^{\circ}}{2}=45^{\circ}`} nach="." /> Das stimmt auch mit <Formel tex={t`\overrightarrow{CA}\cdot\overrightarrow{CB}=9`} /> überein.
          </>,
        ]}
      >
        <p>
          Berechne im Dreieck aus Aufgabe 4 die Innenwinkel bei <Formel tex="B" /> und <Formel tex="C" nach="." /> Prüfe mit der Winkelsumme.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={6}
        titel="Ein Parallelogramm nachweisen"
        felder={[
          feldZahl('ab1', 'Erste Koordinate von A B', <>1. Koordinate von <Formel tex={t`\overrightarrow{AB}`} /></>, p.ab[0]!),
          feldZahl('ab2', 'Zweite Koordinate von A B', <>2. Koordinate von <Formel tex={t`\overrightarrow{AB}`} /></>, p.ab[1]!),
          feldZahl('dc1', 'Erste Koordinate von D C', <>1. Koordinate von <Formel tex={t`\overrightarrow{DC}`} /></>, p.dc[0]!),
          feldZahl('dc2', 'Zweite Koordinate von D C', <>2. Koordinate von <Formel tex={t`\overrightarrow{DC}`} /></>, p.dc[1]!),
          feldZahl('sp', 'Skalarprodukt von A B und A D', <>Skalarprodukt <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}`} /></>, p.skalar),
          feldZahl('fl', 'Flächeninhalt', <>Flächeninhalt</>, p.flaeche, 0.01),
        ]}
        hilfen={[
          <>Bei einem Parallelogramm gilt <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} nach="." /></>,
          <>Für den Flächeninhalt brauchst du <Formel tex={t`|\overrightarrow{AB}|\cdot|\overrightarrow{AD}|\cdot\sin\alpha`} nach="." /> Den Winkel <Formel tex={t`\alpha`} /> erhältst du aus dem Skalarprodukt.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=${sp([5, 1])}`} /> und <Formel tex={t`\overrightarrow{DC}=\begin{pmatrix}5-0\\3-2\end{pmatrix}=${sp([5, 1])}`} nach="." /> Die Vektoren sind gleich, also ist <Formel tex="ABCD" /> ein Parallelogramm.
          </>,
          <>
            <Formel tex={t`\overrightarrow{AD}=${sp([2, 3])}`} nach="," /> <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=10+3=13\neq 0`} nach="," /> also ist es kein Rechteck. Mit <Formel tex={t`|\overrightarrow{AB}|=\sqrt{26}`} /> und <Formel tex={t`|\overrightarrow{AD}|=\sqrt{13}`} /> sind die benachbarten Seiten verschieden lang, es ist keine Raute.
          </>,
          <>
            <Formel tex={t`\cos\alpha=\dfrac{13}{\sqrt{26}\cdot\sqrt{13}}=\dfrac{1}{\sqrt{2}}`} nach="," /> also <Formel tex={t`\alpha=45^{\circ}`} nach="." /> Der Flächeninhalt ist <Formel tex={t`\sqrt{26}\cdot\sqrt{13}\cdot\sin 45^{\circ}=13\sqrt{2}\cdot\tfrac{1}{\sqrt{2}}=13`} nach="." />
          </>,
        ]}
      >
        <p>
          Zeige, dass <Formel tex={t`A(-2\,|\,-1)`} nach="," /> <Formel tex={t`B(3\,|\,0)`} nach="," /> <Formel tex={t`C(5\,|\,3)`} /> und <Formel tex={t`D(0\,|\,2)`} /> die Ecken eines Parallelogramms sind. Prüfe, ob es ein Rechteck ist, und berechne seinen Flächeninhalt.
        </p>
        <Bild daten={aufgParallelogramm(false)} unter={<>Die vier Ecken.</>} />
        <Kontrollschaubild>
          <Bild daten={aufgParallelogramm(true)} unter={<>Das Parallelogramm: Gleichfarbige Pfeile sind gleich.</>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Auswahlfrage
        nummer="7"
        titel="Welches Viereck ist es?"
        optionen={platziere(
          [
            opt('a', <>ein Parallelogramm, aber weder Rechteck noch Raute</>, true, <>Richtig: <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} nach="," /> aber <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=4\neq 0`} /> und <Formel tex={t`|\overrightarrow{AB}|=4\neq\sqrt{10}=|\overrightarrow{AD}|`} nach="." /></>),
            opt('b', <>ein Rechteck</>, false, <>Für ein Rechteck müsste <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=0`} /> gelten. Hier ist es <Formel tex={t`4\cdot 1+0\cdot 3=4`} nach="." /></>),
            opt('c', <>eine Raute</>, false, <>Für eine Raute müssten <Formel tex={t`|\overrightarrow{AB}|`} /> und <Formel tex={t`|\overrightarrow{AD}|`} /> gleich sein. Hier ist <Formel tex={t`|\overrightarrow{AB}|=4`} /> und <Formel tex={t`|\overrightarrow{AD}|=\sqrt{10}`} nach="." /></>),
            opt('d', <>ein Drachen</>, false, <>Ein Drachen braucht zwei Paare gleich langer benachbarter Seiten. Hier sind benachbarte Seiten verschieden lang, nur gegenüberliegende sind gleich.</>),
          ],
          0,
        )}
        erklaerung={
          <>
            Zuerst <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> prüfen (Parallelogramm), dann das Skalarprodukt <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}`} /> (Rechteck) und die Längen von <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AD}`} /> (Raute).
            <Bild daten={BILD_AUSWAHL_VIERECK} unter={<>Das Viereck: <Formel tex={t`\overrightarrow{AB}`} /> (orange) und <Formel tex={t`\overrightarrow{AD}`} /> (blau) sind verschieden lang und stehen nicht senkrecht aufeinander.</>} />
          </>
        }
      >
        <p>
          Welches Viereck bilden die Punkte <Formel tex={t`A(0\,|\,0)`} nach="," /> <Formel tex={t`B(4\,|\,0)`} nach="," /> <Formel tex={t`C(5\,|\,3)`} /> und <Formel tex={t`D(1\,|\,3)`} nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={8}
        titel="Ein Rechteck im Raum"
        felder={[
          feldZahl('dc1', 'Erste Koordinate von D C', <>1. Koordinate von <Formel tex={t`\overrightarrow{DC}`} /></>, rt.dc[0]!),
          feldZahl('dc2', 'Zweite Koordinate von D C', <>2. Koordinate von <Formel tex={t`\overrightarrow{DC}`} /></>, rt.dc[1]!),
          feldZahl('dc3', 'Dritte Koordinate von D C', <>3. Koordinate von <Formel tex={t`\overrightarrow{DC}`} /></>, rt.dc[2]!),
          feldZahl('sp', 'Skalarprodukt von A B und A D', <>Skalarprodukt <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}`} /></>, rt.skalar),
          feldZahl('fl', 'Flächeninhalt', <>Flächeninhalt (zwei Nachkommastellen)</>, rt.flaeche, 0.01),
        ]}
        hilfen={[<>Ein Rechteck ist ein Parallelogramm mit einem rechten Winkel. Prüfe <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> und das Skalarprodukt <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}`} nach="." /></>, <>Der Flächeninhalt eines Rechtecks ist das Produkt der Beträge von <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AD}`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=${sp([2, 1, 2])}`} nach="," /> <Formel tex={t`\overrightarrow{DC}=\begin{pmatrix}1-(-1)\\2-1\\1-(-1)\end{pmatrix}=${sp([2, 1, 2])}`} nach="." /> Also ist <Formel tex="ABCD" /> ein Parallelogramm.
          </>,
          <>
            <Formel tex={t`\overrightarrow{AD}=${sp([0, 2, -1])}`} nach="," /> <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=0+2-2=0`} nach="." /> Der Winkel bei <Formel tex="A" /> ist ein rechter Winkel, das Viereck ist ein Rechteck.
          </>,
          <>
            <Formel tex={t`|\overrightarrow{AB}|=3`} /> und <Formel tex={t`|\overrightarrow{AD}|=\sqrt{5}`} nach="," /> der Flächeninhalt ist <Formel tex={t`3\cdot\sqrt{5}\approx 6{,}71`} nach="." />
          </>,
        ]}
      >
        <p>
          Zeige, dass <Formel tex={t`A(-1\,|\,-1\,|\,0)`} nach="," /> <Formel tex={t`B(1\,|\,0\,|\,2)`} nach="," /> <Formel tex={t`C(1\,|\,2\,|\,1)`} /> und <Formel tex={t`D(-1\,|\,1\,|\,-1)`} /> die Ecken eines Rechtecks sind, und berechne seinen Flächeninhalt.
        </p>
        <Figur spec={aufgRechteck(false)} unter={<>Die vier Ecken.</>} />
        <KontrollFigur spec={aufgRechteck(true)} unter={<>Das Rechteck mit den Pfeilen <Formel tex={t`\overrightarrow{AB}`} /> (orange) und <Formel tex={t`\overrightarrow{AD}`} /> (blau) bei <Formel tex="A" nach="." /></>} />
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Ergänzung zur Raute"
        felder={[feldZahl('d1', 'Erste Koordinate von D', <>1. Koordinate von <Formel tex="D" /></>, ra.d[0]!), feldZahl('d2', 'Zweite Koordinate von D', <>2. Koordinate von <Formel tex="D" /></>, ra.d[1]!), feldZahl('dg', 'Skalarprodukt der Diagonalen', <>Skalarprodukt <Formel tex={t`\overrightarrow{AC}\cdot\overrightarrow{BD}`} /></>, 0)]}
        hilfen={[<>Prüfe zuerst <Formel tex={t`|\overrightarrow{AB}|`} /> und <Formel tex={t`|\overrightarrow{BC}|`} nach="." /> Für ein Parallelogramm gilt <Formel tex={t`\overrightarrow{AD}=\overrightarrow{BC}`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=${sp([3, 4])}`} /> und <Formel tex={t`\overrightarrow{BC}=${sp([5, 0])}`} /> haben beide den Betrag 5.
          </>,
          <>
            <Formel tex={t`\overrightarrow{AD}=\overrightarrow{BC}`} /> ergibt <Formel tex={t`D(-1+5\,|\,0+0)=D(4\,|\,0)`} nach="." /> Die benachbarten Seiten <Formel tex="AB" /> und <Formel tex="BC" /> sind gleich lang, das Parallelogramm ist also eine Raute.
          </>,
          <>
            Probe über die Diagonalen: <Formel tex={t`\overrightarrow{AC}\cdot\overrightarrow{BD}=${sp([8, 4])}\cdot${sp([2, -4])}=16-16=0`} nach="." /> Die Diagonalen einer Raute stehen senkrecht aufeinander.
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`A(-1\,|\,0)`} nach="," /> <Formel tex={t`B(2\,|\,4)`} /> und <Formel tex={t`C(7\,|\,4)`} nach="." /> Bestimme <Formel tex="D" /> so, dass <Formel tex="ABCD" /> eine Raute ist. Zeige, dass die Diagonalen senkrecht aufeinander stehen.
        </p>
        <Bild daten={aufgRaute(false)} unter={<>Die Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" nach="." /></>} />
        <Kontrollschaubild>
          <Bild daten={aufgRaute(true)} unter={<>Die Raute mit <Formel tex="D" /> und den Diagonalen (gestrichelt).</>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Aufgabe
        nummer={10}
        titel="Innenwinkel der Raute"
        felder={[feldZahl('al', 'Winkel bei A in Grad', <>Winkel <Formel tex={t`\alpha`} /> bei <Formel tex="A" /> in Grad</>, A_RAUTENWINKEL.alpha, 0.01), feldZahl('be', 'Winkel bei B in Grad', <>Winkel <Formel tex={t`\beta`} /> bei <Formel tex="B" /> in Grad</>, A_RAUTENWINKEL.beta, 0.01)]}
        hilfen={[<>Der Winkel bei <Formel tex="A" /> liegt zwischen <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AD}`} nach="." /> Benachbarte Winkel ergänzen sich in einem Parallelogramm zu 180°.</>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=${sp([3, 4])}`} /> und <Formel tex={t`\overrightarrow{AD}=${sp([5, 0])}`} nach="," /> also <Formel tex={t`\cos\alpha=\dfrac{15}{5\cdot 5}=0{,}6`} /> und <Formel tex={t`\alpha\approx 53{,}13^{\circ}`} nach="." />
          </>,
          <>
            Der Winkel bei <Formel tex="B" /> ergänzt <Formel tex={t`\alpha`} /> zu 180°: <Formel tex={t`\beta=180^{\circ}-53{,}13^{\circ}=126{,}87^{\circ}`} nach="." /> Zur Kontrolle <Formel tex={t`\overrightarrow{BA}\cdot\overrightarrow{BC}=${sp([-3, -4])}\cdot${sp([5, 0])}=-15`} nach="," /> also <Formel tex={t`\cos\beta=-0{,}6`} nach="." />
          </>,
        ]}
      >
        <p>
          Berechne die Innenwinkel bei <Formel tex="A" /> und <Formel tex="B" /> der Raute aus Aufgabe 9.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={11}
        titel="Ein Trapez"
        felder={[feldZahl('r', 'Faktor r', <>Faktor <Formel tex="r" /> mit <Formel tex={t`\overrightarrow{AB}=r\cdot\overrightarrow{DC}`} /></>, tr.r), feldZahl('al', 'Winkel bei A in Grad', <>Winkel <Formel tex={t`\alpha`} /> bei <Formel tex="A" /> in Grad</>, tr.alpha, 0.01)]}
        hilfen={[<>Zwei Seiten sind parallel, wenn ihre Vektoren kollinear sind. Bestimme den Faktor aus den Koordinaten.</>, <>Der Winkel bei <Formel tex="A" /> liegt zwischen <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AD}`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=${sp([6, 2])}`} /> und <Formel tex={t`\overrightarrow{DC}=${sp([3, 1])}`} nach="," /> also <Formel tex={t`\overrightarrow{AB}=2\cdot\overrightarrow{DC}`} nach="." /> Die Seiten <Formel tex="AB" /> und <Formel tex="DC" /> sind parallel.
          </>,
          <>
            <Formel tex={t`\overrightarrow{BC}=${sp([-2, 2])}`} /> und <Formel tex={t`\overrightarrow{AD}=${sp([1, 3])}`} /> sind nicht kollinear, denn <Formel tex={t`-2\cdot 3-2\cdot 1=-8\neq 0`} nach="." /> Also ist es ein Trapez und kein Parallelogramm.
          </>,
          <>
            <Formel tex={t`\cos\alpha=\dfrac{6\cdot 1+2\cdot 3}{\sqrt{40}\cdot\sqrt{10}}=\dfrac{12}{20}=0{,}6`} nach="," /> also <Formel tex={t`\alpha\approx 53{,}13^{\circ}`} nach="." />
          </>,
        ]}
      >
        <p>
          Zeige, dass das Viereck mit <Formel tex={t`A(-2\,|\,0)`} nach="," /> <Formel tex={t`B(4\,|\,2)`} nach="," /> <Formel tex={t`C(2\,|\,4)`} /> und <Formel tex={t`D(-1\,|\,3)`} /> ein Trapez, aber kein Parallelogramm ist. Gib an, mit welchem Faktor <Formel tex="r" /> <Formel tex={t`\overrightarrow{AB}=r\cdot\overrightarrow{DC}`} /> gilt, und berechne den Winkel bei <Formel tex="A" nach="." />
        </p>
        <Bild daten={aufgTrapez(false)} unter={<>Die vier Ecken.</>} />
        <Kontrollschaubild>
          <Bild daten={aufgTrapez(true)} unter={<>Das Trapez: <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{DC}`} /> (orange) sind parallel.</>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Aufgabe
        nummer={12}
        titel="Ein Drachen"
        felder={[
          feldZahl('la', 'Länge von A B', <>Länge <Formel tex={t`|\overrightarrow{AB}|`} /></>, dr.la, 0.01),
          feldZahl('lc', 'Länge von C B', <>Länge <Formel tex={t`|\overrightarrow{CB}|`} /></>, dr.lc, 0.01),
          feldZahl('dg', 'Skalarprodukt der Diagonalen', <>Skalarprodukt <Formel tex={t`\overrightarrow{AC}\cdot\overrightarrow{BD}`} /></>, 0),
        ]}
        hilfen={[<>Ein Drachen hat zwei Paare gleich langer benachbarter Seiten. Berechne <Formel tex={t`|\overrightarrow{AB}|`} nach="," /> <Formel tex={t`|\overrightarrow{AD}|`} nach="," /> <Formel tex={t`|\overrightarrow{CB}|`} /> und <Formel tex={t`|\overrightarrow{CD}|`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`|\overrightarrow{AB}|=\sqrt{4+1}=\sqrt{5}\approx 2{,}24`} /> und <Formel tex={t`|\overrightarrow{AD}|=\sqrt{4+1}=\sqrt{5}`} nach="." /> Ebenso <Formel tex={t`|\overrightarrow{CB}|=\sqrt{9+1}=\sqrt{10}\approx 3{,}16=|\overrightarrow{CD}|`} nach="." /> Zwei Paare benachbarter Seiten sind gleich lang, es ist ein Drachen.
          </>,
          <>
            <Formel tex={t`\overrightarrow{AC}\cdot\overrightarrow{BD}=${sp([5, 0])}\cdot${sp([0, -2])}=0`} nach="." /> Die Diagonalen stehen senkrecht aufeinander. Wegen <Formel tex={t`\overrightarrow{AB}\neq\overrightarrow{DC}`} /> ist es kein Parallelogramm.
          </>,
        ]}
      >
        <p>
          Zeige, dass das Viereck mit <Formel tex={t`A(0\,|\,0)`} nach="," /> <Formel tex={t`B(2\,|\,1)`} nach="," /> <Formel tex={t`C(5\,|\,0)`} /> und <Formel tex={t`D(2\,|\,-1)`} /> ein Drachen ist, und berechne das Skalarprodukt der Diagonalen.
        </p>
        <Bild daten={aufgDrachen(false)} unter={<>Die vier Ecken.</>} />
        <Kontrollschaubild>
          <Bild daten={aufgDrachen(true)} unter={<>Der Drachen mit seinen Diagonalen (gestrichelt).</>} />
        </Kontrollschaubild>
      </Aufgabe>

      <Aufgabe
        nummer={13}
        titel="Flächeninhalt eines Dreiecks"
        felder={[feldZahl('s', 'Sinus von alpha', <>Sinus von <Formel tex={t`\alpha`} /> (zwei Nachkommastellen)</>, A_FLAECHE.sinus, 0.01), feldZahl('fl', 'Flächeninhalt', <>Flächeninhalt</>, A_FLAECHE.flaeche, 0.01)]}
        hilfen={[<>Der Winkel bei <Formel tex="A" /> ist aus Aufgabe 1 bekannt, <Formel tex={t`\alpha\approx 143{,}13^{\circ}`} nach="." /></>, <>Es gilt <Formel tex={t`A=\frac{1}{2}\cdot|\overrightarrow{AB}|\cdot|\overrightarrow{AC}|\cdot\sin\alpha`} nach="." /></>]}
        loesung={[
          <>
            <Formel tex={t`\sin\alpha=\sin 143{,}13^{\circ}=0{,}6`} nach="." /> Das passt zu <Formel tex={t`\cos\alpha=-0{,}8`} /> wegen <Formel tex={t`0{,}6^2+0{,}8^2=1`} nach="." />
          </>,
          <>
            <Formel tex={t`A=\frac{1}{2}\cdot 5\cdot 5\cdot 0{,}6=7{,}5`} nach="." /> Zur Kontrolle: Die Seite <Formel tex="AC" /> liegt waagrecht und ist 5 lang, die Höhe von <Formel tex="B" /> ist 3, also <Formel tex={t`\frac{1}{2}\cdot 5\cdot 3=7{,}5`} nach="." />
          </>,
        ]}
      >
        <p>
          Berechne den Flächeninhalt des Dreiecks aus Aufgabe 1 mit der Formel <Formel tex={t`A=\frac{1}{2}\cdot|\overrightarrow{AB}|\cdot|\overrightarrow{AC}|\cdot\sin\alpha`} nach="." /> Gib auch <Formel tex={t`\sin\alpha`} /> an.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="14"
        titel="Wann ist ein Viereck ein Rechteck?"
        optionen={platziere(
          [
            opt('a', <><Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> und <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=0`} /></>, true, <>Richtig: Die erste Bedingung macht das Viereck zu einem Parallelogramm, die zweite fordert einen rechten Winkel.</>),
            opt('b', <><Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=0`} /> allein</>, false, <>Das sagt nur, dass der Winkel bei <Formel tex="A" /> ein rechter ist. Die anderen Winkel und Seiten können beliebig sein. Ein Drachen kann zum Beispiel einen rechten Winkel haben, ohne ein Rechteck zu sein.</>),
            opt('c', <>alle vier Seiten gleich lang</>, false, <>Das ist eine Raute. Eine Raute ist nur dann ein Rechteck, wenn sie auch einen rechten Winkel hat, also ein Quadrat ist.</>),
            opt('d', <>die Diagonalen <Formel tex="AC" /> und <Formel tex="BD" /> gleich lang</>, false, <>Bei einem Rechteck sind die Diagonalen gleich lang, aber das genügt nicht: Auch gleichschenklige Trapeze haben gleich lange Diagonalen.</>),
          ],
          2,
        )}
        erklaerung={<>Ein Rechteck ist ein Parallelogramm mit einem rechten Winkel. Du brauchst also die Vektorgleichung <Formel tex={t`\overrightarrow{AB}=\overrightarrow{DC}`} /> und das Skalarprodukt <Formel tex={t`\overrightarrow{AB}\cdot\overrightarrow{AD}=0`} nach="." /></>}
      >
        <p>
          Welche Bedingungen genügen, damit das Viereck <Formel tex="ABCD" /> ein Rechteck ist?
        </p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
