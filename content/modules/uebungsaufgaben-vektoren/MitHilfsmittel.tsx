import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur } from '@/components/Raumfigur';
import { BE, Teile } from '@/components/Teilaufgaben';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { punktTeX } from '@/lib/vektor';
import { raumSegel, raumTrapez } from './Bilder';
import { A7, A8 } from './daten';

const TOL = 0.01;
const sp = (v: number[]) => spalte(v);
const P = (name: string, p: number[]) => punktTeX(name, p);

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl mit Komma ein, ohne Einheit. Winkel gibst du in Grad an, der Taschenrechner steht auf Gradmaß (DEG). Bei den Taschenrechneraufgaben genügt die Rundung auf zwei Nachkommastellen. Rechne mit den ungerundeten Zwischenergebnissen weiter.
    </Hinweis>
  );
}

/** Aufgabe 7: Trapez in einem Quader. */
function Aufgabe7() {
  const d = A7;
  return (
    <Aufgabe
      nummer="7"
      titel="Trapez im Quader"
      felder={[
        { id: 'v', name: 'Faktor, mit dem IL das Vielfache von JK ist', beschriftung: <>Es gilt <Formel tex={t`\overrightarrow{IL}=k\cdot\overrightarrow{JK}`} nach=":" /> <Formel tex="k" /></>, erwartet: d.faktor },
        { id: 'w', name: 'Innenwinkel bei I in Grad', beschriftung: <>Innenwinkel bei <Formel tex="I" /> in Grad</>, erwartet: d.winkel, toleranz: TOL },
        { id: 'f', name: 'Flächeninhalt des Trapezes', beschriftung: <>Flächeninhalt in Flächeneinheiten</>, erwartet: d.flaeche, toleranz: TOL },
      ]}
      hilfen={[
        <>Bestimme zuerst, auf welchen Kanten die Punkte liegen, und zeichne die vier Verbindungsstrecken. Berechne danach die Vektoren <Formel tex={t`\overrightarrow{IJ}`} nach="," /> <Formel tex={t`\overrightarrow{JK}`} nach="," /> <Formel tex={t`\overrightarrow{KL}`} /> und <Formel tex={t`\overrightarrow{IL}`} nach="." /></>,
        <>Ein Trapez hat genau ein Paar paralleler Seiten (<Modulverweis modul="dreieck-vierecke-skalarprodukt">Dreieck und Vierecke mit Vektoren</Modulverweis>). Parallele Seiten erkennst du an kollinearen Vektoren. Die Schenkel sind die beiden anderen Seiten, ihre Längen vergleichst du über den Betrag.</>,
        <>Der Innenwinkel bei <Formel tex="I" /> liegt zwischen den Pfeilen <Formel tex={t`\overrightarrow{IJ}`} /> und <Formel tex={t`\overrightarrow{IL}`} nach="," /> die dort beginnen. Für die Fläche brauchst du die Höhe. In einem gleichschenkligen Trapez bildet sie mit einem Schenkel und dem Überstand <Formel tex={t`\frac{|IL|-|JK|}{2}`} /> ein rechtwinkliges Dreieck.</>,
      ]}
      loesung={[
        <>
          a: Der Punkt <Formel tex="I" /> liegt auf der Kante <Formel tex={t`\overline{EF}`} nach="," /> <Formel tex="J" /> auf <Formel tex={t`\overline{AB}`} nach="," /> <Formel tex="K" /> auf <Formel tex={t`\overline{BC}`} /> und <Formel tex="L" /> auf <Formel tex={t`\overline{FG}`} nach="." /> Das Viereck <Formel tex="IJKL" /> entsteht durch die Strecken <Formel tex="IJ" nach="," /> <Formel tex="JK" nach="," /> <Formel tex="KL" /> und <Formel tex="LI" nach="." /> Siehe das Kontrollbild.
        </>,
        <>
          b: Es ist <Formel tex={t`\overrightarrow{IL}=${sp([2, 2, 0])}`} /> und <Formel tex={t`\overrightarrow{JK}=${sp([1, 1, 0])}`} nach="." /> Wegen <Formel tex={t`\overrightarrow{IL}=2\cdot\overrightarrow{JK}`} /> sind die Seiten <Formel tex={t`\overline{IL}`} /> und <Formel tex={t`\overline{JK}`} /> parallel, und <Formel tex={t`\overline{IL}`} /> ist doppelt so lang wie <Formel tex={t`\overline{JK}`} nach="." />
          Für die anderen Seiten gilt <Formel tex={t`\overrightarrow{IJ}=${sp([1, 0, -3])}`} /> und <Formel tex={t`\overrightarrow{KL}=${sp([0, 1, 3])}`} nach="." /> Diese Vektoren sind keine Vielfachen voneinander, die Seiten sind nicht parallel. Es gibt also genau ein Paar paralleler Seiten, <Formel tex="IJKL" /> ist ein Trapez. Die Schenkel sind gleich lang:
          <Umbruchformel
            tex={t`|\overrightarrow{IJ}|=\sqrt{1+0+9}=\sqrt{10}=|\overrightarrow{KL}|`}
            schmal={t`\begin{gathered}|\overrightarrow{IJ}|\\{}=\sqrt{1+0+9}\\{}=\sqrt{10}\\{}=|\overrightarrow{KL}|\end{gathered}`}
          />
        </>,
        <>
          c: Mit <Formel tex={t`\overrightarrow{IJ}\cdot\overrightarrow{IL}=2+0+0=2`} /> und den Beträgen <Formel tex={t`|\overrightarrow{IJ}|=\sqrt{10}`} /> und <Formel tex={t`|\overrightarrow{IL}|=\sqrt{8}`} /> folgt
          <Umbruchformel
            tex={t`\cos\varphi=\frac{2}{\sqrt{10}\cdot\sqrt{8}}=\frac{2}{\sqrt{80}}\ \Rightarrow\ \varphi\approx 77{,}08^{\circ}`}
            schmal={t`\begin{gathered}\cos\varphi\\{}=\frac{2}{\sqrt{10}\cdot\sqrt{8}}\\{}=\frac{2}{\sqrt{80}}\\\varphi\approx 77{,}08^{\circ}\end{gathered}`}
          />
        </>,
        <>
          d: Die parallelen Seiten haben die Längen <Formel tex={t`|\overrightarrow{IL}|=2\sqrt{2}`} /> und <Formel tex={t`|\overrightarrow{JK}|=\sqrt{2}`} nach="." /> Der Überstand ist <Formel tex={t`\frac{2\sqrt{2}-\sqrt{2}}{2}=\frac{\sqrt{2}}{2}`} nach="." /> Für die Höhe <Formel tex="h" /> gilt im rechtwinkligen Dreieck mit dem Schenkel als Hypotenuse
          <Umbruchformel
            tex={t`h^2=10-\left(\frac{\sqrt{2}}{2}\right)^2=\frac{19}{2}`}
            schmal={t`\begin{gathered}h^2\\{}=10-\left(\frac{\sqrt{2}}{2}\right)^2\\{}=\frac{19}{2}\end{gathered}`}
          />
          Der Flächeninhalt ist
          <Umbruchformel
            tex={t`A=\frac{1}{2}\cdot(2\sqrt{2}+\sqrt{2})\cdot\sqrt{\frac{19}{2}}=\frac{3}{2}\sqrt{19}\approx 6{,}54`}
            schmal={t`\begin{gathered}A=\frac{1}{2}\cdot 3\sqrt{2}\\\quad\cdot\sqrt{\frac{19}{2}}\\{}=\frac{3}{2}\sqrt{19}\\{}\approx 6{,}54\end{gathered}`}
          />
        </>,
      ]}
    >
      <p>
        Ein Quader <Formel tex="ABCDEFGH" /> hat die Eckpunkte <Formel tex={P('A', d.A)} /> und <Formel tex={P('G', d.G)} nach="." /> Die Kante <Formel tex={t`\overline{AB}`} /> verläuft parallel zur <Formel tex={t`x_1`} />-Achse, die Kante <Formel tex={t`\overline{AD}`} /> parallel zur <Formel tex={t`x_2`} />-Achse und die Kante <Formel tex={t`\overline{AE}`} /> parallel zur <Formel tex={t`x_3`} />-Achse. Die Punkte <Formel tex={P('I', d.I)} nach="," /> <Formel tex={P('J', d.J)} nach="," /> <Formel tex={P('K', d.K)} /> und <Formel tex={P('L', d.L)} /> liegen jeweils auf einer Kante des Quaders.
      </p>
      <Figur spec={raumTrapez(false)} unter={<>Der Quader <Formel tex="ABCDEFGH" nach="." /> Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.</>} />
      <Teile>
        <li>
          Zeichnen Sie das Viereck <Formel tex="IJKL" /> in die Abbildung ein. <BE n={2} />
        </li>
        <li>
          Weisen Sie nach, dass <Formel tex="IJKL" /> ein Trapez ist, dessen Schenkel gleich lang sind, und bestimmen Sie das Verhältnis der Längen der parallelen Seiten. <BE n={4} />
        </li>
        <li>
          Berechnen Sie die Größe des Innenwinkels des Trapezes bei <Formel tex="I" nach="." /> <BE n={2} />
        </li>
        <li>
          Berechnen Sie den Flächeninhalt des Trapezes. <BE n={4} />
        </li>
      </Teile>
      <KontrollFigur spec={raumTrapez(true)} unter={<>Das Trapez <Formel tex="IJKL" /> im Quader (rosa). Die Seiten <Formel tex={t`\overline{IL}`} /> und <Formel tex={t`\overline{JK}`} /> sind parallel.</>} />
    </Aufgabe>
  );
}

/** Aufgabe 8: Sonnensegel mit Länge, Winkel, Teilung, senkrechtem Vektor und (Vertiefung) Flächeninhalt. */
function Aufgabe8() {
  const d = A8;
  return (
    <Aufgabe
      nummer="8"
      titel="Sonnensegel"
      felder={[
        { id: 'ab', name: 'Länge der Kante AB in Metern', beschriftung: <>Länge <Formel tex={t`|\overrightarrow{AB}|`} /> in m</>, erwartet: d.laengeAB, toleranz: TOL },
        { id: 'wc', name: 'Innenwinkel bei C in Grad', beschriftung: <>Innenwinkel bei <Formel tex="C" /> in Grad</>, erwartet: d.winkelC, toleranz: TOL },
        { id: 't1', name: 'erste Koordinate von T', beschriftung: <>Koordinate <Formel tex={t`t_1`} /> von <Formel tex="T" /></>, erwartet: d.T[0] },
        { id: 't2', name: 'zweite Koordinate von T', beschriftung: <>Koordinate <Formel tex={t`t_2`} /> von <Formel tex="T" /></>, erwartet: d.T[1] },
        { id: 't3', name: 'dritte Koordinate von T', beschriftung: <>Koordinate <Formel tex={t`t_3`} /> von <Formel tex="T" /></>, erwartet: d.T[2] },
        { id: 'tc', name: 'Länge der Leine TC in Metern', beschriftung: <>Länge der Leine in m</>, erwartet: d.laengeTC, toleranz: TOL },
        { id: 'h1', name: 'erste Koordinate des Richtungsvektors', beschriftung: <>1. Koordinate des Vektors</>, erwartet: d.senkrecht[0]! },
        { id: 'h2', name: 'zweite Koordinate des Richtungsvektors', beschriftung: <>2. Koordinate des Vektors</>, erwartet: d.senkrecht[1]! },
        { id: 'h3', name: 'dritte Koordinate des Richtungsvektors', beschriftung: <>3. Koordinate des Vektors</>, erwartet: d.senkrecht[2]! },
        { id: 'f', name: 'Flächeninhalt des Segels in Quadratmetern', beschriftung: <>Flächeninhalt in m²</>, erwartet: d.flaeche, toleranz: TOL },
      ]}
      hilfen={[
        <>Berechne zuerst die Verbindungsvektoren der Segelecken. Die Länge einer Kante ist der Betrag des Verbindungsvektors (<Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>). Den Innenwinkel bei <Formel tex="C" /> bestimmst du mit den Vektoren <Formel tex={t`\overrightarrow{CA}`} /> und <Formel tex={t`\overrightarrow{CB}`} nach="," /> die in <Formel tex="C" /> beginnen.</>,
        <>Teilt <Formel tex="T" /> die Strecke <Formel tex={t`\overline{AB}`} /> im Verhältnis <Formel tex={t`3:1`} nach="," /> so gilt <Formel tex={t`\overrightarrow{OT}=\overrightarrow{OA}+\frac{3}{4}\cdot\overrightarrow{AB}`} nach="." /></>,
        <>Ein Vektor, der auf zwei Vektoren senkrecht steht, ist ihr Vektorprodukt (Kreuzprodukt) (<Modulverweis modul="vektorprodukt">Das Vektorprodukt (Kreuzprodukt)</Modulverweis>). Kürze das Ergebnis durch den gemeinsamen Teiler. Mache die Probe mit dem Skalarprodukt.</>,
        <>Der Flächeninhalt des Dreiecks ist die Hälfte des Betrags von <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}`} nach="." /> Du hast das Vektorprodukt (Kreuzprodukt) aus Teilaufgabe c schon berechnet.</>,
      ]}
      loesung={[
        <>
          a: Es ist <Formel tex={t`\overrightarrow{AB}=${sp(d.ab)}`} nach="," /> also <Formel tex={t`|\overrightarrow{AB}|=\sqrt{16+16+0}=\sqrt{32}\approx 5{,}66`} nach="." /> Die Kante ist etwa 5,66 m lang. Für den Winkel bei <Formel tex="C" /> sind <Formel tex={t`\overrightarrow{CA}=${sp([3, -2, -1])}`} /> und <Formel tex={t`\overrightarrow{CB}=${sp([-1, 2, -1])}`} /> maßgeblich:
          <Umbruchformel
            tex={t`\cos\gamma=\frac{-3-4+1}{\sqrt{14}\cdot\sqrt{6}}=\frac{-6}{\sqrt{84}}\ \Rightarrow\ \gamma\approx 130{,}89^{\circ}`}
            schmal={t`\begin{gathered}\cos\gamma\\{}=\frac{-3-4+1}{\sqrt{14}\cdot\sqrt{6}}\\{}=\frac{-6}{\sqrt{84}}\\\gamma\approx 130{,}89^{\circ}\end{gathered}`}
          />
          Der Winkel ist stumpf, passend zum negativen Skalarprodukt.
        </>,
        <>
          b: Mit dem Teilverhältnis 3 zu 1 ist
          <Umbruchformel
            tex={t`\overrightarrow{OT}=${sp([1, -2, 3])}+\frac{3}{4}\cdot${sp(d.ab)}=${sp([-2, 1, 3])}`}
            schmal={t`\begin{gathered}\overrightarrow{OT}\\{}=${sp([1, -2, 3])}+\frac{3}{4}\cdot${sp(d.ab)}\\{}=${sp([-2, 1, 3])}\end{gathered}`}
          />
          also <Formel tex={P('T', d.T)} nach="." /> Es ist <Formel tex={t`\overrightarrow{TC}=${sp([0, -1, 1])}`} nach="," /> die Leine hat die Länge <Formel tex={t`\sqrt{2}\approx 1{,}41`} /> m.
        </>,
        <>
          c: Mit <Formel tex={t`\overrightarrow{AB}=${sp(d.ab)}`} /> und <Formel tex={t`\overrightarrow{AC}=${sp(d.ac)}`} /> ist
          <Umbruchformel
            tex={t`\overrightarrow{AB}\times\overrightarrow{AC}=${sp(d.n)}=4\cdot${sp(d.senkrecht)}`}
            schmal={t`\begin{gathered}\overrightarrow{AB}\times\overrightarrow{AC}\\{}=${sp(d.n)}\\{}=4\cdot${sp(d.senkrecht)}\end{gathered}`}
          />
          Der gekürzte Vektor <Formel tex={t`${sp(d.senkrecht)}`} /> gibt die Richtung des Haltearms an. Probe: <Formel tex={t`(1\,|\,1\,|\,1)\cdot\overrightarrow{AB}=-4+4+0=0`} /> und <Formel tex={t`(1\,|\,1\,|\,1)\cdot\overrightarrow{AC}=-3+2+1=0`} nach="." />
        </>,
        <>
          d (Vertiefung): Der Flächeninhalt ist
          <Umbruchformel
            tex={t`A=\frac{1}{2}\cdot|\overrightarrow{AB}\times\overrightarrow{AC}|=\frac{1}{2}\cdot\sqrt{48}=2\sqrt{3}\approx 3{,}46`}
            schmal={t`\begin{gathered}A=\frac{1}{2}\cdot\\|\overrightarrow{AB}\times\overrightarrow{AC}|\\{}=\frac{1}{2}\cdot\sqrt{48}\\{}=2\sqrt{3}\approx 3{,}46\end{gathered}`}
          />
          Das Segel hat einen Flächeninhalt von etwa 3,46 m².
        </>,
      ]}
    >
      <p>
        Über einer Terrasse wird ein dreieckiges Sonnensegel gespannt. Die Befestigungspunkte sind <Formel tex={P('A', d.A)} nach="," /> <Formel tex={P('B', d.B)} /> und <Formel tex={P('C', d.C)} /> (Längeneinheit 1 m, die <Formel tex={t`x_3`} />-Achse zeigt nach oben).
      </p>
      <Figur spec={raumSegel} unter={<>Das Segel <Formel tex="ABC" /> mit dem Punkt <Formel tex="T" /> auf der Kante <Formel tex={t`\overline{AB}`} /> und der Leine <Formel tex={t`\overline{TC}`} /> (blau).</>} />
      <Teile>
        <li>
          Berechnen Sie die Länge der Segelkante <Formel tex={t`\overline{AB}`} /> und die Größe des Innenwinkels des Segels bei <Formel tex="C" nach="." /> <BE n={3} />
        </li>
        <li>
          Der Punkt <Formel tex="T" /> teilt die Strecke <Formel tex={t`\overline{AB}`} /> im Verhältnis <Formel tex={t`\overline{AT}:\overline{TB}=3:1`} nach="." /> Von <Formel tex="T" /> wird eine Leine zum Punkt <Formel tex="C" /> gespannt. Bestimmen Sie die Koordinaten von <Formel tex="T" /> und die Länge der Leine. <BE n={3} />
        </li>
        <li>
          Ein gerader Haltearm soll senkrecht auf den Kanten <Formel tex={t`\overline{AB}`} /> und <Formel tex={t`\overline{AC}`} /> stehen. Bestimmen Sie einen Vektor mit ganzzahligen Koordinaten ohne gemeinsamen Teiler und mit positiver erster Koordinate, der die Richtung des Haltearms angibt. <BE n={2} />
        </li>
        <li>
          <strong>Vertiefung:</strong> Berechnen Sie den Flächeninhalt des Segels. <BE n={2} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

export function MitHilfsmittel() {
  return (
    <Abschnitt id="mit-hilfsmittel" titel="Mit Hilfsmittel">
      <p>
        Zwei längere Aufgaben mit Taschenrechner, eine mit einem Körper (12 BE) und eine mit einem Sachzusammenhang (10 BE). Die Taschenrechner stehen auf Gradmaß.
      </p>
      <Eingabehinweis />
      <Aufgabe7 />
      <Aufgabe8 />
    </Abschnitt>
  );
}
