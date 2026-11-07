import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur } from '@/components/Raumfigur';
import { BE, Teile } from '@/components/Teilaufgaben';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktTeX } from '@/lib/geradenhilfen';
import { t } from '@/lib/modulhilfen';
import { raumDrohnen, raumMast, raumSeilbahn } from './Bilder';
import { A7, A8, A9 } from './daten';

const TOL = 0.01;
const P = (name: string, p: number[]) => punktTeX(name, p);

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl mit Komma ein, ohne Einheit. Winkel gibst du in Grad an, der Taschenrechner steht auf Gradmaß (DEG). Bei den Taschenrechneraufgaben genügt die Rundung auf zwei Nachkommastellen. Rechne mit den ungerundeten Zwischenergebnissen weiter, damit sich die Rundungen nicht aufschaukeln.
    </Hinweis>
  );
}

/** Aufgabe 7: zwei Drohnen, Geschwindigkeit, Schnittpunkt der Bahnen, Zeiten, kleinster Abstand. */
function Aufgabe7() {
  const d = A7;
  return (
    <Aufgabe
      nummer="7"
      titel="Zwei Drohnen"
      felder={[
        { id: 'v1', name: 'erste Koordinate des Geschwindigkeitsvektors von A', beschriftung: <>Koordinate <Formel tex="v_1" /> von <Formel tex={t`\vec{v}_A`} /></>, erwartet: d.A.v[0]! },
        { id: 'v2', name: 'zweite Koordinate des Geschwindigkeitsvektors von A', beschriftung: <>Koordinate <Formel tex="v_2" /> von <Formel tex={t`\vec{v}_A`} /></>, erwartet: d.A.v[1]! },
        { id: 'v3', name: 'dritte Koordinate des Geschwindigkeitsvektors von A', beschriftung: <>Koordinate <Formel tex="v_3" /> von <Formel tex={t`\vec{v}_A`} /></>, erwartet: d.A.v[2]! },
        { id: 'ta', name: 'Zeit der Drohne A bis S in Minuten', beschriftung: <>Zeit von <Formel tex="A" /> bis <Formel tex="S" /> in Minuten</>, erwartet: d.minutenA },
        { id: 'tb', name: 'Zeit der Drohne B bis S in Minuten', beschriftung: <>Zeit von <Formel tex="B" /> bis <Formel tex="S" /> in Minuten</>, erwartet: d.minutenB },
        { id: 't0', name: 'Zeit des kleinsten Abstands in Minuten', beschriftung: <>Zeit des kleinsten Abstands in Minuten</>, erwartet: d.minuten, toleranz: TOL },
        { id: 'd', name: 'kleinster Abstand in Kilometern', beschriftung: <>kleinster Abstand in Kilometern</>, erwartet: d.abstand, toleranz: TOL },
      ]}
      hilfen={[
        <>
          Der Geschwindigkeitsvektor zeigt in die Richtung des Richtungsvektors und hat als Betrag das Tempo: <Formel tex={t`\vec{v}=\text{Tempo}\cdot\dfrac{\vec{u}}{|\vec{u}|}`} nach="." /> Rechne in Kilometern und Stunden (<Modulverweis modul="modellieren-geraden">Modellieren mit Geraden: Bewegung und Schatten</Modulverweis>).
        </>,
        <>
          Für die Bahnen schreibst du Geradengleichungen mit zwei verschiedenen Parametern und setzt gleich (<Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>). Eine Kollision braucht zusätzlich dieselbe <em>Zeit</em> an demselben Ort.
        </>,
        <>
          Die Zeit bis <Formel tex="S" /> ist der Weg bis <Formel tex="S" /> geteilt durch das Tempo. Der Weg ist die Länge des Richtungsvektors mal der Parameterwert von <Formel tex="S" nach="." />
        </>,
        <>
          Der Abstand der Drohnen zur Zeit <Formel tex="t" /> ist die Länge von <Formel tex={t`\overrightarrow{BA}(t)=\vec{p}+t\cdot\vec{w}`} nach="." /> Untersuche das Quadrat <Formel tex={t`d(t)^2`} /> und bestimme das Minimum mit der Ableitung (<Modulverweis modul="optimierung">Optimierung</Modulverweis>).
        </>,
      ]}
      loesung={[
        <>
          a: Es ist <Formel tex={t`|\vec{u}_A|=\sqrt{4+1+4}=3`} nach="." /> Damit gilt
          <Umbruchformel
            tex={t`\vec{v}_A=\frac{60}{3}\cdot\begin{pmatrix}1\\-2\\2\end{pmatrix}=\begin{pmatrix}20\\-40\\40\end{pmatrix}\frac{\text{km}}{\text{h}}`}
            schmal={t`\begin{gathered}\vec{v}_A\\{}=\frac{60}{3}\cdot\begin{pmatrix}1\\-2\\2\end{pmatrix}\\{}=\begin{pmatrix}20\\-40\\40\end{pmatrix}\end{gathered}`}
          />
        </>,
        <>
          b: Die Bahnen sind <Formel tex={t`g:\ \vec{x}=\begin{pmatrix}-1\\3\\0\end{pmatrix}+r\cdot\begin{pmatrix}1\\-2\\2\end{pmatrix}`} /> und <Formel tex={t`h:\ \vec{x}=\begin{pmatrix}1\\3\\0\end{pmatrix}+s\cdot\begin{pmatrix}-1\\-2\\2\end{pmatrix}`} nach="." /> Gleichsetzen ergibt drei Gleichungen, die der Reihe nach I, II und III heißen:
          <Umbruchformel
            tex={t`\mathrm{I}:\ r-1=1-s,\ \ \mathrm{II}:\ 3-2r=3-2s,\ \ \mathrm{III}:\ 2r=2s`}
            schmal={t`\begin{gathered}r-1=1-s\\3-2r=3-2s\\2r=2s\end{gathered}`}
          />
          Aus III folgt <Formel tex={t`r=s`} nach="." /> Einsetzen in I ergibt <Formel tex={t`r-1=1-r`} /> und <Formel tex={t`r=1`} nach="." /> Gleichung II ist mit <Formel tex={t`r=s=1`} /> erfüllt: <Formel tex={t`1=1`} nach="." /> Die Bahnen schneiden sich im Punkt <Formel tex={P('S', d.S)} nach="," /> den man mit <Formel tex={t`r=1`} /> aus <Formel tex="g" /> und mit <Formel tex={t`s=1`} /> aus <Formel tex="h" /> erhält.
        </>,
        <>
          c: Der Weg von <Formel tex="A" /> bis <Formel tex="S" /> ist <Formel tex={t`1\cdot|\vec{u}_A|=3`} /> km, der von <Formel tex="B" /> bis <Formel tex="S" /> ist <Formel tex={t`1\cdot|\vec{u}_B|=3`} /> km. Die Zeiten sind
          <Umbruchformel
            tex={t`t_A=\frac{3}{60}\,\text{h}=3\,\text{min},\ \ t_B=\frac{3}{30}\,\text{h}=6\,\text{min}`}
            schmal={t`\begin{gathered}t_A=\frac{3}{60}\,\text{h}\\{}=3\,\text{min}\\t_B=\frac{3}{30}\,\text{h}\\{}=6\,\text{min}\end{gathered}`}
          />
          Die Drohnen sind nicht zur selben Zeit in <Formel tex="S" nach="." /> Es kommt in <Formel tex="S" /> nicht zur Kollision, obwohl sich die Bahnen schneiden.
        </>,
        <>
          d: Es ist <Formel tex={t`\vec{v}_B=\frac{30}{3}\cdot\begin{pmatrix}-1\\-2\\2\end{pmatrix}=\begin{pmatrix}-10\\-20\\20\end{pmatrix}`} nach="." /> Der Vektor von <Formel tex="B" /> zu <Formel tex="A" /> zur Zeit <Formel tex="t" /> (in Stunden) ist
          <Umbruchformel
            tex={t`\overrightarrow{BA}(t)=\begin{pmatrix}-2\\0\\0\end{pmatrix}+t\cdot\begin{pmatrix}30\\-20\\20\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{BA}(t)\\{}=\begin{pmatrix}-2\\0\\0\end{pmatrix}+t\cdot\begin{pmatrix}30\\-20\\20\end{pmatrix}\end{gathered}`}
          />
          Das Quadrat des Abstands ist die Summe der Koordinatenquadrate, <Formel tex={t`d(t)^2=a\,t^2+b\,t+c`} nach="." /> Mit <Formel tex={t`\vec{p}=\begin{pmatrix}-2\\0\\0\end{pmatrix}`} /> und <Formel tex={t`\vec{w}=\begin{pmatrix}30\\-20\\20\end{pmatrix}`} /> gilt <Formel tex={t`a=|\vec{w}|^2`} nach="," /> <Formel tex={t`b=2\,\vec{p}\cdot\vec{w}`} /> und <Formel tex={t`c=|\vec{p}|^2`} nach=":" />
          <Umbruchformel
            tex={t`d(t)^2=1700t^2-120t+4`}
            schmal={t`\begin{gathered}a=900+800\\{}=1700\\b=2\cdot(-60)\\{}=-120\\c=4\end{gathered}`}
          />
        </>,
        <>
          Die Ableitung <Formel tex={t`3400t-120`} /> ist 0 für <Formel tex={t`t=\frac{3}{85}\,\text{h}\approx 2{,}12\,\text{min}`} nach="." /> Der Wert des Quadrats ist dort
          <Umbruchformel
            tex={t`d^2=4-\frac{120^2}{4\cdot 1700}\approx 1{,}88`}
            schmal={t`\begin{gathered}d^2\\{}=4-\frac{120^2}{4\cdot 1700}\\{}\approx 1{,}88\end{gathered}`}
          />
          Der kleinste Abstand ist <Formel tex={t`d\approx 1{,}37`} /> km, nach etwa 2,12 Minuten.
        </>,
      ]}
    >
      <p>
        Zwei Drohnen <Formel tex="A" /> und <Formel tex="B" /> fliegen geradlinig mit gleichbleibender Geschwindigkeit. In einem Koordinatensystem (Längeneinheit 1 km, <Formel tex="x_3" /> ist die Höhe) starten sie zur selben Zeit. Die Drohne <Formel tex="A" /> startet im Punkt <Formel tex={P('A_0', d.A.start)} /> in der Richtung <Formel tex={t`\begin{pmatrix}1\\-2\\2\end{pmatrix}`} /> mit 60 km/h, die Drohne <Formel tex="B" /> startet im Punkt <Formel tex={P('B_0', d.B.start)} /> in der Richtung <Formel tex={t`\begin{pmatrix}-1\\-2\\2\end{pmatrix}`} /> mit 30 km/h.
      </p>
      <Figur spec={raumDrohnen(false)} unter={<>Die Flugbahnen der Drohne <Formel tex="A" /> (schwarz) und der Drohne <Formel tex="B" /> (orange), bis zur Höhe 4.</>} />
      <Teile>
        <li>
          Bestimmen Sie den Geschwindigkeitsvektor der Drohne <Formel tex="A" /> in km/h. <BE n={2} />
        </li>
        <li>
          Zeigen Sie, dass sich die Flugbahnen der beiden Drohnen im Punkt <Formel tex={P('S', d.S)} /> schneiden. <BE n={3} />
        </li>
        <li>
          Berechnen Sie, nach wie vielen Minuten jede Drohne den Punkt <Formel tex="S" /> erreicht, und beurteilen Sie, ob es dort zu einer Kollision kommt. <BE n={3} />
        </li>
        <li>
          Berechnen Sie den kleinsten Abstand der beiden Drohnen zur selben Zeit und den Zeitpunkt, zu dem er auftritt. <BE n={4} />
        </li>
      </Teile>
      <KontrollFigur spec={raumDrohnen(true)} unter={<>Die Bahnen schneiden sich im Punkt <Formel tex="S" nach="." /> Die Drohne <Formel tex="A" /> ist nach 3 Minuten dort, die Drohne <Formel tex="B" /> nach 6 Minuten.</>} />
    </Aufgabe>
  );
}

/** Aufgabe 8: Schatten eines Fahnenmasts auf Gartenmauer und Boden. */
function Aufgabe8() {
  const d = A8;
  return (
    <Aufgabe
      nummer="8"
      titel="Schatten eines Fahnenmasts"
      felder={[
        { id: 'x1', name: 'erste Koordinate von T Strich', beschriftung: <>Koordinate <Formel tex="t'_1" /> von <Formel tex="T'" /></>, erwartet: d.Ts[0], toleranz: TOL },
        { id: 'x2', name: 'zweite Koordinate von T Strich', beschriftung: <>Koordinate <Formel tex="t'_2" /> von <Formel tex="T'" /></>, erwartet: d.Ts[1] },
        { id: 'x3', name: 'dritte Koordinate von T Strich', beschriftung: <>Koordinate <Formel tex="t'_3" /> von <Formel tex="T'" /></>, erwartet: d.Ts[2], toleranz: TOL },
        { id: 'w', name: 'Winkel der Sonnenstrahlen zum Boden in Grad', beschriftung: <>Winkel zum Boden in Grad</>, erwartet: d.winkel, toleranz: TOL },
        { id: 'l', name: 'Länge des Schattens auf dem Boden in Metern', beschriftung: <>Länge des Bodenschattens in Metern</>, erwartet: d.schatten, toleranz: TOL },
      ]}
      hilfen={[
        <>
          Der Sonnenstrahl durch die Spitze <Formel tex="T" /> ist die Gerade <Formel tex={t`\vec{x}=\overrightarrow{OT}+t\cdot\vec{v}`} nach="." /> Der Schattenpunkt <Formel tex="T'" /> ist ihr Schnittpunkt mit der Ebene <Formel tex={t`x_2=4`} /> der Mauer (<Modulverweis modul="modellieren-geraden">Modellieren mit Geraden: Bewegung und Schatten</Modulverweis>).
        </>,
        <>
          Die Mauer ist nur ein Teil der Ebene: Der Schattenpunkt liegt auf ihr, wenn die erste Koordinate zwischen −2 und 3 und die dritte zwischen 0 und 1,2 liegt. Prüfe beide Bedingungen.
        </>,
        <>
          Der Winkel einer Geraden mit dem Boden folgt aus <Formel tex={t`\sin\alpha=\dfrac{|v_3|}{|\vec{v}|}`} nach="." /> Der Boden ist die <Formel tex={t`x_1x_2`} />-Ebene (<Modulverweis modul="schnittwinkel-geraden">Schnittwinkel von Geraden und Winkel zu den Koordinatenebenen</Modulverweis>).
        </>,
        <>
          Der Schatten auf dem Boden endet an der Mauer. Suche den Punkt des Masts in der Höhe <Formel tex="h" nach="," /> dessen Strahl den Boden genau bei <Formel tex={t`x_2=4`} /> trifft. Die Länge ist dann der Abstand zwischen <Formel tex="F" /> und diesem Bodenpunkt.
        </>,
      ]}
      loesung={[
        <>
          a: Der Sonnenstrahl durch <Formel tex="T" /> ist <Formel tex={t`\vec{x}=\begin{pmatrix}1\\-2\\3\end{pmatrix}+t\cdot\begin{pmatrix}1\\4\\-1\end{pmatrix}`} nach="." /> Die Mauer liegt in der Ebene <Formel tex={t`x_2=4`} nach=":" />
          <Umbruchformel tex={t`-2+4t=4\ \Rightarrow\ t=\frac{3}{2}`} schmal={t`\begin{gathered}-2+4t=4\\t=\frac{3}{2}\end{gathered}`} />
          <Umbruchformel
            tex={t`\overrightarrow{OT'}=\begin{pmatrix}1\\-2\\3\end{pmatrix}+\frac{3}{2}\cdot\begin{pmatrix}1\\4\\-1\end{pmatrix}=\begin{pmatrix}2{,}5\\4\\1{,}5\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OT'}\\{}=\begin{pmatrix}1\\-2\\3\end{pmatrix}+\frac{3}{2}\cdot\begin{pmatrix}1\\4\\-1\end{pmatrix}\\{}=\begin{pmatrix}2{,}5\\4\\1{,}5\end{pmatrix}\end{gathered}`}
          />
          Wegen <Formel tex={t`t>1`} /> liegt der Punkt hinter <Formel tex="T" nach="," /> er ist ein Schattenpunkt.
        </>,
        <>
          b: Für die Mauer gilt <Formel tex={t`-2\le x_1\le 3`} /> und <Formel tex={t`0\le x_3\le 1{,}2`} nach="." /> Die erste Koordinate <Formel tex={t`2{,}5`} /> erfüllt die Bedingung, die dritte Koordinate nicht: <Formel tex={t`1{,}5>1{,}2`} nach="." /> Der Schattenpunkt <Formel tex={P("T'", d.Ts)} /> liegt 0,3 m über der Mauerkante, also nicht auf der Mauer. Die Spitze des Masts wirft ihren Schatten über die Mauer hinweg.
        </>,
        <>
          c: Mit <Formel tex={t`\vec{v}=\begin{pmatrix}1\\4\\-1\end{pmatrix}`} /> ist <Formel tex={t`|\vec{v}|=\sqrt{1+16+1}=\sqrt{18}`} nach="." /> Damit gilt
          <Umbruchformel
            tex={t`\sin\alpha=\frac{|v_3|}{|\vec{v}|}=\frac{1}{\sqrt{18}}\ \Rightarrow\ \alpha\approx 13{,}63^{\circ}`}
            schmal={t`\begin{gathered}\sin\alpha\\{}=\frac{1}{\sqrt{18}}\\\alpha\approx 13{,}63^{\circ}\end{gathered}`}
          />
        </>,
        <>
          d: Ein Punkt <Formel tex={t`X(1\,|\,-2\,|\,h)`} /> des Masts hat den Strahl <Formel tex={t`X+t\cdot\vec{v}`} nach="." /> Die dritte Koordinate <Formel tex={t`h-t`} /> ist 0 für <Formel tex={t`t=h`} nach="." /> Der Bodenpunkt hat dann die zweite Koordinate
          <Umbruchformel tex={t`-2+4h=4\ \Rightarrow\ h=\frac{3}{2}`} schmal={t`\begin{gathered}-2+4h=4\\h=\frac{3}{2}\end{gathered}`} />
          Der Bodenschatten reicht also bis zum Punkt <Formel tex={t`W(2{,}5\,|\,4\,|\,0)`} nach="," /> dort steht die Mauer. Der Schatten darüber liegt an der Mauer. Es ist <Formel tex={t`\overrightarrow{FW}=\begin{pmatrix}1{,}5\\6\\0\end{pmatrix}`} /> und
          <Umbruchformel
            tex={t`|\overrightarrow{FW}|=\sqrt{2{,}25+36}\approx 6{,}18`}
            schmal={t`\begin{gathered}|\overrightarrow{FW}|\\{}=\sqrt{2{,}25+36}\\{}\approx 6{,}18\end{gathered}`}
          />
          Der Schatten auf dem Boden ist etwa 6,18 m lang.
        </>,
      ]}
    >
      <p>
        An einer Gartenmauer steht ein Fahnenmast. In einem Koordinatensystem (Längeneinheit 1 m, <Formel tex="x_3" /> ist die Höhe) hat der Mast den Fußpunkt <Formel tex={P('F', d.F)} /> und die Spitze <Formel tex={P('T', d.T)} nach="." /> Die Mauer ist 1,2 m hoch, liegt in der Ebene <Formel tex={t`x_2=4`} /> und reicht von <Formel tex={t`x_1=-2`} /> bis <Formel tex={t`x_1=3`} nach="." /> Sie schließt den ebenen Boden bei <Formel tex={t`x_2=4`} /> ab. Die Sonne scheint in der Richtung <Formel tex={t`\vec{v}=\begin{pmatrix}1\\4\\-1\end{pmatrix}`} nach="." />
      </p>
      <Figur spec={raumMast(false)} unter={<>Der Fahnenmast (schwarz), die Gartenmauer (grün) und der Sonnenstrahl durch die Spitze (orange, gestrichelt).</>} />
      <Teile>
        <li>
          Bestimmen Sie die Koordinaten des Punkts <Formel tex="T'" nach="," /> in dem der Sonnenstrahl durch <Formel tex="T" /> die Ebene <Formel tex={t`x_2=4`} /> trifft. <BE n={3} />
        </li>
        <li>
          Untersuchen Sie, ob der Punkt <Formel tex="T'" /> auf der Gartenmauer liegt. <BE n={2} />
        </li>
        <li>
          Berechnen Sie den Winkel, unter dem die Sonnenstrahlen auf den Boden treffen. <BE n={2} />
        </li>
        <li>
          Berechnen Sie die Länge des Schattens, den der Mast auf dem Boden wirft. <BE n={3} />
        </li>
      </Teile>
      <KontrollFigur spec={raumMast(true)} unter={<>Der Strahl trifft die Ebene der Mauer im Punkt <Formel tex="T'" nach="," /> über der Mauerkante. Der Schatten des Masts (grau, gestrichelt) läuft über den Boden bis zur Mauer.</>} />
    </Aufgabe>
  );
}

/** Aufgabe 9: Seilbahn, Länge, Steigungswinkel, Stützenhöhe, Abstand eines Aussichtspunkts. */
function Aufgabe9() {
  const d = A9;
  return (
    <Aufgabe
      nummer="9"
      titel="Seilbahn"
      felder={[
        { id: 'l', name: 'Länge des Seils in Metern', beschriftung: <>Länge des Seils in Metern</>, erwartet: d.laenge, toleranz: TOL },
        { id: 'w', name: 'Steigungswinkel in Grad', beschriftung: <>Steigungswinkel in Grad</>, erwartet: d.winkel, toleranz: TOL },
        { id: 'h', name: 'Höhe der Stütze in Metern', beschriftung: <>Höhe der Stütze in Metern</>, erwartet: d.stuetze },
        { id: 'a', name: 'Abstand des Aussichtspunkts vom Seil in Metern', beschriftung: <>Abstand von <Formel tex="Q" /> zum Seil in Metern</>, erwartet: d.abstand, toleranz: TOL },
      ]}
      hilfen={[
        <>
          Die Länge des Seils ist die Länge des Verbindungsvektors von <Formel tex="Ta" /> nach <Formel tex="Bs" nach="." /> Eine Längeneinheit sind 100 m (<Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>).
        </>,
        <>
          Der Steigungswinkel ist der Winkel des Seils mit dem Boden, der <Formel tex={t`x_1x_2`} />-Ebene: <Formel tex={t`\sin\alpha=\dfrac{|u_3|}{|\vec{u}|}`} nach="." /> Die Stütze steht senkrecht unter dem Seil: Suche den Punkt des Seils mit denselben Koordinaten <Formel tex={t`x_1`} /> und <Formel tex={t`x_2`} /> wie <Formel tex="P" nach="." />
        </>,
        <>
          Der kleinste Abstand von <Formel tex="Q" /> zum Seil ist der Abstand zum Lotfußpunkt <Formel tex="F" /> auf der Geraden durch <Formel tex="Ta" /> und <Formel tex="Bs" /> (<Modulverweis modul="abstaende-geraden">Abstand Punkt und Gerade, paralleler Geraden</Modulverweis>). Der Parameter von <Formel tex="F" /> folgt aus <Formel tex={t`\overrightarrow{QF}\cdot\vec{u}=0`} nach="." />
        </>,
        <>
          Alternativ nutzt du das Vektorprodukt: Der Abstand ist <Formel tex={t`\dfrac{|\overrightarrow{Ta\,Q}\times\vec{u}|}{|\vec{u}|}`} nach="." /> Beide Wege liefern dasselbe Ergebnis.
        </>,
      ]}
      loesung={[
        <>
          a: Der Verbindungsvektor ist <Formel tex={t`\vec{u}=\overrightarrow{Ta\,Bs}=\begin{pmatrix}-4\\0\\2\end{pmatrix}`} /> mit
          <Umbruchformel
            tex={t`|\vec{u}|=\sqrt{16+0+4}=\sqrt{20}\approx 4{,}472`}
            schmal={t`\begin{gathered}|\vec{u}|\\{}=\sqrt{16+0+4}\\{}=\sqrt{20}\\{}\approx 4{,}472\end{gathered}`}
          />
          Das Seil ist etwa 4,472 Längeneinheiten, also 447,21 m lang.
        </>,
        <>
          b: Mit <Formel tex={t`u_3=2`} /> gilt
          <Umbruchformel
            tex={t`\sin\alpha=\frac{2}{\sqrt{20}}\ \Rightarrow\ \alpha\approx 26{,}57^{\circ}`}
            schmal={t`\begin{gathered}\sin\alpha\\{}=\frac{2}{\sqrt{20}}\\\alpha\approx 26{,}57^{\circ}\end{gathered}`}
          />
        </>,
        <>
          c: Die Seilgerade ist <Formel tex={t`\vec{x}=\begin{pmatrix}3\\-3\\0\end{pmatrix}+t\cdot\begin{pmatrix}-4\\0\\2\end{pmatrix}`} nach="." /> Bei <Formel tex={t`x_1=1`} /> gilt <Formel tex={t`3-4t=1`} /> und <Formel tex={t`t=\frac{1}{2}`} nach="." /> Die zweite Koordinate ist dann <Formel tex={t`-3`} /> wie bei <Formel tex={P('P', d.P)} nach="." /> Die dritte Koordinate ist <Formel tex={t`2\cdot\frac{1}{2}=1`} nach="." /> Das Seil hat über <Formel tex="P" /> die Höhe 1 Längeneinheit, also 100 m.
        </>,
        <>
          d: Es ist <Formel tex={t`\vec{w}=\overrightarrow{Ta\,Q}=\begin{pmatrix}-2\\2\\2\end{pmatrix}`} nach="." /> Der Lotfußpunkt <Formel tex={t`F=Ta+t\cdot\vec{u}`} /> erfüllt <Formel tex={t`\overrightarrow{QF}\cdot\vec{u}=0`} nach=":" />
          <Umbruchformel
            tex={t`(\vec{w}-t\cdot\vec{u})\cdot\vec{u}=12-20t=0\ \Rightarrow\ t=\frac{3}{5}`}
            schmal={t`\begin{gathered}(\vec{w}-t\vec{u})\cdot\vec{u}\\{}=12-20t\\{}=0\\t=\frac{3}{5}\end{gathered}`}
          />
        </>,
        <>
          Damit ist <Formel tex={t`F(0{,}6\,|\,-3\,|\,1{,}2)`} /> und
          <Umbruchformel
            tex={t`|\overrightarrow{QF}|=\left|\begin{pmatrix}-0{,}4\\-2\\-0{,}8\end{pmatrix}\right|=\sqrt{4{,}8}\approx 2{,}19`}
            schmal={t`\begin{gathered}|\overrightarrow{QF}|\\{}=\sqrt{4{,}8}\\{}\approx 2{,}19\end{gathered}`}
          />
          Die Quadrate der Koordinaten ergeben 0,16, 4 und 0,64, zusammen 4,8. Der Abstand von <Formel tex="Q" /> zum Seil ist etwa 2,19 Längeneinheiten, also 219,09 m. Zur Probe mit dem Vektorprodukt: <Formel tex={t`\begin{pmatrix}-2\\2\\2\end{pmatrix}\times\begin{pmatrix}-4\\0\\2\end{pmatrix}=\begin{pmatrix}4\\-4\\8\end{pmatrix}`} /> hat die Länge <Formel tex={t`\sqrt{96}`} nach="," /> und <Formel tex={t`\sqrt{96}:\sqrt{20}\approx 2{,}19`} nach="." />
        </>,
      ]}
    >
      <p>
        Eine Seilbahn wird in einem Koordinatensystem (Längeneinheit 100 m, <Formel tex="x_3" /> ist die Höhe) durch eine Gerade beschrieben. Die Talstation liegt im Punkt <Formel tex={P('Ta', d.Ta)} nach="," /> die Bergstation im Punkt <Formel tex={P('Bs', d.Bs)} nach="." /> Ein Aussichtspunkt liegt im Punkt <Formel tex={P('Q', d.Q)} nach="." /> Unterwegs trägt eine Stütze das Seil, sie steht senkrecht auf dem Boden im Punkt <Formel tex={P('P', d.P)} nach="." />
      </p>
      <Figur spec={raumSeilbahn(false)} unter={<>Das Seil von der Talstation <Formel tex="Ta" /> zur Bergstation <Formel tex="Bs" /> und der Aussichtspunkt <Formel tex="Q" nach="." /></>} />
      <Teile>
        <li>
          Berechnen Sie die Länge des Seils in Metern. <BE n={2} />
        </li>
        <li>
          Berechnen Sie den Steigungswinkel des Seils gegenüber dem Boden. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie die Höhe der Stütze im Punkt <Formel tex="P" /> in Metern. <BE n={3} />
        </li>
        <li>
          Berechnen Sie den kleinsten Abstand des Aussichtspunkts <Formel tex="Q" /> vom Seil in Metern. <BE n={4} />
        </li>
      </Teile>
      <KontrollFigur spec={raumSeilbahn(true)} unter={<>Die Stütze (orange) steht in <Formel tex="P" /> senkrecht unter dem Seil. Die rosa Strecke <Formel tex={t`\overline{QF}`} /> steht senkrecht auf dem Seil, ihre Länge ist der gesuchte Abstand.</>} />
    </Aufgabe>
  );
}

export function MitHilfsmittel() {
  return (
    <Abschnitt id="mit-hilfsmittel" titel="Mit Hilfsmittel">
      <p>
        Drei längere Aufgaben mit Taschenrechner und je 10 bis 12 Bewertungseinheiten. Jede hat einen Sachzusammenhang und ein Bild, im Aufgabentext ohne und im aufklappbaren Kontrollbild mit den Lösungen.
      </p>
      <Eingabehinweis />
      <Aufgabe7 />
      <Aufgabe8 />
      <Aufgabe9 />
    </Abschnitt>
  );
}
