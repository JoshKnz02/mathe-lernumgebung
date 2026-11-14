import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur } from '@/components/Raumfigur';
import { BE, Teile } from '@/components/Teilaufgaben';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { raumLaser, raumSolar } from './Bilder';
import { A7, A8 } from './daten';
import { Kette, Liste, P, feld, koord, sp, spur } from './hilfen';

const TOL = 0.01;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl mit Komma ein, ohne Einheit. Winkel gibst du in Grad an, der Taschenrechner steht auf Gradmaß (DEG). Bei den Taschenrechneraufgaben genügt die Rundung auf zwei Nachkommastellen, Brüche wie <Formel tex={t`\frac{1}{6}`} /> sind ebenfalls erlaubt. Rechne mit den ungerundeten Zwischenergebnissen weiter, damit sich die Rundungen nicht aufschaukeln.
    </Hinweis>
  );
}

/** Aufgabe 7: Laserstrahl und Decke x₃ = 2: Durchstoßpunkt, Winkel, Spiegelpunkt, reflektierter Strahl, Weg. */
function Aufgabe7() {
  const d = A7;
  return (
    <Aufgabe
      nummer="7"
      titel="Laserstrahl an der Decke"
      felder={[
        koord('p1', 'P', 1, d.P[0]),
        koord('p2', 'P', 2, d.P[1]),
        koord('p3', 'P', 3, d.P[2]),
        feld('w', 'Winkel in Grad', <>Winkel <Formel tex="\alpha" /> in Grad</>, d.winkel, TOL),
        koord('l1', 'L′', 1, d.Ls[0]),
        koord('l2', 'L′', 2, d.Ls[1]),
        koord('l3', 'L′', 3, d.Ls[2]),
        koord('r1', 'R', 1, d.Fl[0]),
        koord('r2', 'R', 2, d.Fl[1]),
        feld('weg', 'Weglänge in Metern', <>Weglänge in Metern</>, d.weg, TOL),
      ]}
      hilfen={[
        <>
          Die Decke ist die Ebene <Formel tex={t`x_3=2`} nach="." /> Ein Punkt der Geraden liegt in ihr, wenn seine dritte Koordinate 2 ist. Setze die dritte Koordinatengleichung der Geraden gleich 2 (<Modulverweis modul="gerade-und-ebene">Gerade und Ebene: gegenseitige Lage</Modulverweis>).
        </>,
        <>
          Der Winkel einer Geraden mit der Decke ist derselbe wie ihr Winkel mit der <Formel tex={t`x_1x_2`} />-Ebene, denn die Decke ist parallel zur <Formel tex={t`x_1x_2`} />-Ebene (<Modulverweis modul="schnittwinkel-geraden">Schnittwinkel von Geraden und Winkel zu den Koordinatenebenen</Modulverweis>). Mit dem Taschenrechner auf Gradmaß: <Formel tex={t`\sin\alpha=\dfrac{|u_3|}{|\vec{u}|}`} nach="." />
        </>,
        <>
          Beim Spiegeln an der Ebene <Formel tex={t`x_3=2`} /> bleiben die ersten zwei Koordinaten, und der Abstand zur Decke bleibt erhalten, liegt aber auf der anderen Seite (<Modulverweis modul="abstaende-ebenen">Abstände zu Ebenen</Modulverweis>).
        </>,
        <>
          Der reflektierte Strahl ist die Gerade durch <Formel tex={t`L'`} /> und <Formel tex="P" nach="." /> Sie trifft den Boden, wenn die dritte Koordinate 0 ist. Der Weg des Lichts besteht aus den Strecken <Formel tex={t`\overline{LP}`} /> und <Formel tex={t`\overline{PR}`} nach="." />
        </>,
      ]}
      loesung={[
        <>
          a: Der Strahl ist <Formel tex={t`g:\ \vec{x}=${sp(d.L)}+t\cdot${sp(d.u)}`} nach="." /> Die dritte Koordinate ist <Formel tex={t`2t`} nach="." /> Aus <Formel tex={t`2t=2`} /> folgt <Formel tex={t`t=1`} nach="." />
          <Umbruchformel
            tex={t`\overrightarrow{OP}=${sp(d.L)}+1\cdot${sp(d.u)}=${sp(d.P)}`}
            schmal={t`\begin{gathered}\overrightarrow{OP}\\{}=${sp(d.L)}+1\cdot${sp(d.u)}\\{}=${sp(d.P)}\end{gathered}`}
          />
          Der Auftreffpunkt ist <Formel tex={P('P', d.P)} nach="." />
        </>,
        <>
          b: Es ist <Formel tex={t`|\vec{u}|=\sqrt{1+1+4}=\sqrt{6}`} nach="." /> Damit gilt
          <Umbruchformel
            tex={t`\sin\alpha=\frac{2}{\sqrt{6}}\ \Rightarrow\ \alpha\approx 54{,}74^{\circ}`}
            schmal={t`\begin{gathered}\sin\alpha=\frac{2}{\sqrt{6}}\\\alpha\approx 54{,}74^{\circ}\end{gathered}`}
          />
        </>,
        <>
          c: Der Lotfußpunkt von <Formel tex="L" /> auf die Decke ist <Formel tex={t`(3\,|\,-3\,|\,2)`} nach="." /> Der Abstand von <Formel tex="L" /> zur Decke ist 2, also liegt <Formel tex={t`L'`} /> 2 über der Decke:
          <Formel tex={P("L'", d.Ls)} anzeige />
        </>,
        <>
          d: Die Richtung des reflektierten Strahls ist
          <Umbruchformel
            tex={t`\overrightarrow{L'P}=${sp(d.P)}-${sp(d.Ls)}=${sp(d.u2)}`}
            schmal={t`\begin{gathered}\overrightarrow{L'P}\\{}=${sp(d.P)}-${sp(d.Ls)}\\{}=${sp(d.u2)}\end{gathered}`}
          />
          Die Gerade <Formel tex={t`h:\ \vec{x}=${sp(d.Ls)}+k\cdot${sp(d.u2)}`} /> hat die dritte Koordinate <Formel tex={t`4-2k`} nach="." /> Sie ist 0 für <Formel tex={t`k=2`} nach="." />
          <Umbruchformel
            tex={t`\overrightarrow{OR}=${sp(d.Ls)}+2\cdot${sp(d.u2)}=${sp(d.Fl)}`}
            schmal={t`\begin{gathered}\overrightarrow{OR}\\{}=${sp(d.Ls)}+2\cdot${sp(d.u2)}\\{}=${sp(d.Fl)}\end{gathered}`}
          />
          Der Strahl trifft den Boden im Punkt <Formel tex={P('R', d.Fl)} nach="." />
        </>,
        <>
          e: Die Strecke <Formel tex={t`\overline{LP}`} /> hat die Länge <Formel tex={t`1\cdot|\vec{u}|=\sqrt{6}`} nach="." /> Die Strecke <Formel tex={t`\overline{PR}`} /> hat den Verbindungsvektor <Formel tex={t`${sp(d.u2)}`} /> und die Länge <Formel tex={t`\sqrt{1+1+4}=\sqrt{6}`} nach="." /> Der Weg des Lichts ist
          <Kette z={[t`\sqrt{6}+\sqrt{6}`, t`2\sqrt{6}`, t`4{,}90`]} />
          Das Licht legt etwa 4,90 m zurück.
        </>,
      ]}
    >
      <p>
        In einem Raum liegt der Boden in der <Formel tex={t`x_1x_2`} />-Ebene und die Decke in der Ebene <Formel tex={t`x_3=2`} nach="." /> Eine Längeneinheit entspricht 1 m. Ein Laser steht auf dem Boden im Punkt <Formel tex={P('L', d.L)} nach="." /> Sein Strahl verläuft in Richtung <Formel tex={t`\vec{u}=${sp(d.u)}`} nach="." /> Trifft er die Decke im Punkt <Formel tex="P" nach="," /> wird er so reflektiert, als käme er vom Spiegelpunkt <Formel tex={t`L'`} /> von <Formel tex="L" /> an der Decke und liefe durch <Formel tex="P" /> weiter nach unten.
      </p>
      <Figur spec={raumLaser(false)} unter={<>Der Laser <Formel tex="L" /> auf dem Boden, die Decke (grün) und der Strahl (orange), noch vor der Decke gezeichnet.</>} />
      <Teile>
        <li>
          Bestimmen Sie die Koordinaten des Punkts <Formel tex="P" nach="," /> in dem der Strahl die Decke trifft. <BE n={2} />
        </li>
        <li>
          Berechnen Sie den Winkel <Formel tex="\alpha" nach="," /> unter dem der Strahl die Decke trifft. <BE n={3} />
        </li>
        <li>
          Geben Sie die Koordinaten des Spiegelpunkts <Formel tex={t`L'`} /> an. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie die Koordinaten des Punkts <Formel tex="R" nach="," /> in dem der reflektierte Strahl den Boden trifft. Geben Sie die ersten beiden Koordinaten an. <BE n={3} />
        </li>
        <li>
          Berechnen Sie die Länge des Wegs, den das Licht von <Formel tex="L" /> über <Formel tex="P" /> bis <Formel tex="R" /> zurücklegt, in Metern. <BE n={2} />
        </li>
      </Teile>
      <KontrollFigur spec={raumLaser(true)} unter={<>Der Strahl trifft die Decke in <Formel tex="P" nach="." /> Der reflektierte Strahl (rosa) läuft von <Formel tex="P" /> zum Boden in <Formel tex="R" nach="." /> Er liegt auf der Geraden durch <Formel tex={t`L'`} /> und <Formel tex="P" /> (grau, gestrichelt).</>} />
    </Aufgabe>
  );
}

/** Aufgabe 8: Solaranlage in einer Ebene E durch drei Punkte, Spurpunkte, Abstand und Lotfußpunkt einer Messdrohne. */
function Aufgabe8() {
  const d = A8;
  return (
    <Aufgabe
      nummer="8"
      titel="Solaranlage und Messdrohne"
      felder={[
        feld('n1', 'Koeffizient von x1', <>Koeffizient von <Formel tex="x_1" /></>, d.n[0]!),
        feld('n2', 'Koeffizient von x2', <>Koeffizient von <Formel tex="x_2" /></>, d.n[1]!),
        feld('n3', 'Koeffizient von x3', <>Koeffizient von <Formel tex="x_3" /></>, d.n[2]!),
        feld('b', 'rechte Seite der Gleichung', <>rechte Seite <Formel tex="b" /></>, d.d),
        spur('s1', 1, d.S1[0]!),
        spur('s2', 2, d.S2[1]!),
        spur('s3', 3, d.S3[2]!),
        feld('a', 'Abstand in Metern', <>Abstand von <Formel tex="Q" /> zu <Formel tex="E" /> in Metern</>, d.abstand, TOL),
        koord('f1', 'F', 1, d.F[0], TOL),
        koord('f2', 'F', 2, d.F[1], TOL),
        koord('f3', 'F', 3, d.F[2], TOL),
      ]}
      hilfen={[
        <>
          Zwei Spannvektoren sind <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="." /> Ihr Vektorprodukt (Kreuzprodukt) ist ein Normalenvektor (<Modulverweis modul="normalenform-koordinatenform">Normalenform und Koordinatenform</Modulverweis>). Kürze ihn auf teilerfremde ganze Zahlen mit positiver erster Koordinate. Die rechte Seite folgt durch Einsetzen eines Punkts.
        </>,
        <>
          Setze für jeden Spurpunkt zwei Koordinaten gleich 0 (<Modulverweis modul="zeichnerische-darstellung-ebenen">Zeichnerische Darstellung von Ebenen</Modulverweis>).
        </>,
        <>
          Die Abstandsformel lautet <Formel tex={t`d=\dfrac{|\vec{n}\cdot\vec{q}-b|}{|\vec{n}|}`} nach="." /> Rechne mit dem gekürzten Normalenvektor (<Modulverweis modul="abstaende-ebenen">Abstände zu Ebenen</Modulverweis>).
        </>,
        <>
          Die Lotgerade durch <Formel tex="Q" /> hat den Normalenvektor als Richtungsvektor. Bestimme ihren Schnittpunkt mit <Formel tex="E" /> durch die Geradenprobe. Du darfst dein Ergebnis als Bruch eingeben.
        </>,
      ]}
      loesung={[
        <>
          a: Die Spannvektoren sind
          <Liste z={[t`\overrightarrow{AB}=${sp([3, -3, 0])}`, t`\overrightarrow{AC}=${sp([5, 1, -3])}`]} />
          und das Vektorprodukt (Kreuzprodukt) ist
          <Umbruchformel
            tex={t`\overrightarrow{AB}\times\overrightarrow{AC}=${sp(d.kreuz)}=9\cdot${sp(d.n)}`}
            schmal={t`\begin{gathered}\overrightarrow{AB}\times\overrightarrow{AC}\\{}=${sp(d.kreuz)}\\{}=9\cdot${sp(d.n)}\end{gathered}`}
          />
          Mit <Formel tex={t`\vec{n}=${sp(d.n)}`} /> und dem Punkt <Formel tex={P('A', d.A)} /> ist
          <Kette z={[t`b`, t`1\cdot(-3)+1\cdot 1+2\cdot 3`, t`4`]} />
          Die Koordinatengleichung ist <Formel tex={t`E:\ x_1+x_2+2x_3=4`} nach="." /> Probe mit <Formel tex={P('B', d.B)} nach=":" /> <Formel tex={t`0-2+6=4`} nach="." /> Probe mit <Formel tex={P('C', d.C)} nach=":" /> <Formel tex={t`2+2+0=4`} nach="."/>
        </>,
        <>
          b: Auf der <Formel tex={t`x_1`} />-Achse gilt <Formel tex={t`x_1=4`} nach="," /> auf der <Formel tex={t`x_2`} />-Achse <Formel tex={t`x_2=4`} nach="," /> auf der <Formel tex={t`x_3`} />-Achse <Formel tex={t`2x_3=4`} /> und damit <Formel tex={t`x_3=2`} nach="." />
          <Liste z={[P('S_1', d.S1), P('S_2', d.S2), P('S_3', d.S3)]} />
        </>,
        <>
          c: Es ist <Formel tex={t`|\vec{n}|=\sqrt{1+1+4}=\sqrt{6}`} /> und <Formel tex={t`\vec{n}\cdot\vec{q}=1+2+6=9`} nach="." /> Damit gilt
          <Umbruchformel
            tex={t`d=\frac{|9-4|}{\sqrt{6}}=\frac{5}{\sqrt{6}}\approx 2{,}04`}
            schmal={t`\begin{gathered}d=\frac{|9-4|}{\sqrt{6}}\\{}=\frac{5}{\sqrt{6}}\\{}\approx 2{,}04\end{gathered}`}
          />
          Die Drohne ist etwa 2,04 m von der Ebene entfernt.
        </>,
        <>
          d: Die Lotgerade ist <Formel tex={t`\vec{x}=${sp(d.Q)}+t\cdot${sp(d.n)}`} nach="." /> Die Geradenprobe in <Formel tex="E" /> liefert
          <Kette z={[t`(1+t)+(2+t)+2(3+2t)`, t`1+t+2+t+6+4t`, t`9+6t`, t`4`]} />
          Aus <Formel tex={t`9+6t=4`} /> folgt <Formel tex={t`t=-\frac{5}{6}`} nach="." />
        </>,
        <>
          Der Lotfußpunkt ist
          <Umbruchformel
            tex={t`\overrightarrow{OF}=${sp(d.Q)}-\frac{5}{6}\cdot${sp(d.n)}=\begin{pmatrix}\frac{1}{6}\\\frac{7}{6}\\\frac{4}{3}\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OF}\\{}=${sp(d.Q)}-\frac{5}{6}\cdot${sp(d.n)}\\{}=\begin{pmatrix}\frac{1}{6}\\\frac{7}{6}\\\frac{4}{3}\end{pmatrix}\end{gathered}`}
          />
          also <Formel tex={t`F(0{,}17\,|\,1{,}17\,|\,1{,}33)`} nach="." /> Probe in <Formel tex="E" nach=":" /> <Formel tex={t`\frac{1}{6}+\frac{7}{6}+\frac{8}{3}=4`} nach="." />
        </>,
      ]}
    >
      <p>
        Eine ebene Solaranlage ist durch die Eckpunkte <Formel tex={P('A', d.A)} nach="," /> <Formel tex={P('B', d.B)} /> und <Formel tex={P('C', d.C)} /> festgelegt und liegt in der Ebene <Formel tex="E" nach="." /> Eine Längeneinheit entspricht 1 m, die <Formel tex={t`x_3`} />-Achse zeigt nach oben. Eine Messdrohne hält im Punkt <Formel tex={P('Q', d.Q)} /> still.
      </p>
      <Figur spec={raumSolar(false)} unter={<>Die Ebene <Formel tex="E" /> (grau) mit den Punkten <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> und die Messdrohne <Formel tex="Q" nach="." /></>} />
      <Teile>
        <li>
          Bestimmen Sie eine Koordinatengleichung von <Formel tex="E" nach="." /> Die Koeffizienten sollen teilerfremde ganze Zahlen sein, der Koeffizient von <Formel tex="x_1" /> positiv. <BE n={3} />
        </li>
        <li>
          Berechnen Sie die Koordinaten der Spurpunkte von <Formel tex="E" nach="." /> Geben Sie von jedem Spurpunkt die Koordinate an, die nicht 0 ist. <BE n={2} />
        </li>
        <li>
          Berechnen Sie den Abstand der Drohne von der Anlage. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie die Koordinaten des Punkts <Formel tex="F" /> der Ebene <Formel tex="E" nach="," /> der der Drohne am nächsten liegt. <BE n={3} />
        </li>
      </Teile>
      <KontrollFigur spec={raumSolar(true)} unter={<>Die rosa Strecke steht senkrecht auf <Formel tex="E" nach="." /> Sie verbindet <Formel tex="Q" /> mit dem Lotfußpunkt <Formel tex="F" nach="," /> ihre Länge ist der gesuchte Abstand.</>} />
    </Aufgabe>
  );
}

export function MitHilfsmittel() {
  return (
    <Abschnitt id="mit-hilfsmittel" titel="Mit Hilfsmittel">
      <p>
        Zwei längere Aufgaben im Stil des Prüfungsteils B mit Taschenrechner und 12 beziehungsweise 10 Bewertungseinheiten. Jede hat einen Sachzusammenhang und ein Bild, im Aufgabentext ohne und im aufklappbaren Kontrollbild mit den Lösungen.
      </p>
      <Eingabehinweis />
      <Aufgabe7 />
      <Aufgabe8 />
    </Abschnitt>
  );
}
