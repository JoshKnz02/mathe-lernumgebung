import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { formelZeilen, formTeX, weg1 } from '@/lib/abstandebenehilfen';
import { punktTeX, skalarZeilen } from '@/lib/ebenenhilfen';
import { betragZeilen, punktBruchTeX } from '@/lib/geradenhilfen';
import { pyramideDreieck, quader } from '@/lib/koerper';
import { dreiecksflaecheZeilen, kreuzZeilen, skalarKurz, spannvektorZeilen, volumenZeilen } from '@/lib/koerperhilfen';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { verbindungsvektor, vektorprodukt } from '@/lib/vektor';
import { RAUM_HOEHE_KANTE, RAUM_ZWEI_SPITZEN, aufg1, aufg2, aufg5, aufg8, aufg9 } from './Bilder';
import { A1, A12, A2, A3, A4, A7, A8, A9, PYRAMIDE, SPITZE2 } from './daten';

type Z = { tex: string; schmal: string };
const Zeilen = ({ z }: { z: Z }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;
const AB = '\\overrightarrow{AB}';
const AC = '\\overrightarrow{AC}';
const AD = '\\overrightarrow{AD}';
const AE = '\\overrightarrow{AE}';
const AS = '\\overrightarrow{AS}';
const koordFelder = (praefix: string, punkt: string, werte: number[], toleranz?: number): Feld[] =>
  werte.map((x, i) => ({ id: `${praefix}${i + 1}`, name: `${i + 1}. Koordinate von ${punkt}`, beschriftung: <>{i + 1}. Koordinate von <Formel tex={punkt} /></>, erwartet: x, ...(toleranz ? { toleranz } : {}) }));
const feld = (id: string, name: string, beschriftung: React.ReactNode, erwartet: number, toleranz?: number): Feld => ({ id, name, beschriftung, erwartet, ...(toleranz ? { toleranz } : {}) });

export function Ueberpruefen() {
  /* Aufgabe 1 */
  const q1 = quader(A1.A, A1.B, A1.D, A1.E);
  const oc = q1.ecken[2]!;
  const og = q1.ecken[6]!;
  /* Aufgabe 2 */
  const ab2 = verbindungsvektor(A2.A, A2.B);
  const ad2 = verbindungsvektor(A2.A, A2.D);
  /* Aufgaben 4 bis 6 */
  const p4 = pyramideDreieck(A4.A, A4.B, A4.C, A4.S);
  const ab4 = verbindungsvektor(A4.A, A4.B);
  const ac4 = verbindungsvektor(A4.A, A4.C);
  const w5 = weg1(p4.form, A4.S);
  const vol4 = volumenZeilen(p4);
  /* Aufgabe 8 */
  const q8 = quader(A8.A, A8.B, A8.D, A8.E);
  /* Aufgabe 9 */
  const ab9 = verbindungsvektor(A2.A, A2.B);
  const as9 = verbindungsvektor(A2.A, A2.S);
  const n9 = vektorprodukt(ab9, as9);
  const nn9 = n9.reduce((s, c) => s + c * c, 0);
  /* Aufgabe 12 */
  const p2 = pyramideDreieck(PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C, SPITZE2);
  const f2 = formelZeilen(p2.form, SPITZE2);
  const pP = pyramideDreieck(PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C, PYRAMIDE.S);

  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Abstandsformel steht im Modul <Modulverweis modul="abstaende-ebenen">Abstände zu Ebenen</Modulverweis>, das Vektorprodukt (Kreuzprodukt) im Modul <Modulverweis modul="vektorprodukt">Das Vektorprodukt</Modulverweis> (Kreuzprodukt).
      </p>
      <Hinweis titel="Eingabe">Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, einen Bruch kannst du mit Schrägstrich eingeben. Bei Aufgaben mit Taschenrechner genügen zwei Nachkommastellen, bei exakten Werten zählt der genaue Wert. Längen, Flächen und Volumen stehen in LE, FE und VE.</Hinweis>

      <Aufgabe
        nummer={1}
        titel="Ein Quader aus vier Ecken"
        felder={[...koordFelder('g', 'G', A1.Gp), feld('v', 'Volumen V in Volumeneinheiten', <>Volumen <Formel tex="V" /></>, A1.V)]}
        hilfen={[
          <>Die Kanten an <Formel tex="A" /> sind die Verbindungsvektoren <Formel tex={AB} nach="," /> <Formel tex={AD} /> und <Formel tex={AE} nach="." /> Die Ecke <Formel tex="G" /> erreichst du von <Formel tex="A" /> aus über alle drei Vektoren.</>,
          <>Das Volumen ist das Produkt der drei Kantenlängen. Prüfe vorher, ob die Kanten senkrecht aufeinander stehen.</>,
        ]}
        loesung={[
          <>Kantenvektoren: <Zeilen z={spannvektorZeilen(A1.A, A1.B, 'A', 'B')} /><Zeilen z={spannvektorZeilen(A1.A, A1.D, 'A', 'D')} /><Zeilen z={spannvektorZeilen(A1.A, A1.E, 'A', 'E')} /></>,
          <>Die Kanten stehen senkrecht aufeinander: <Zeilen z={skalarKurz(q1.u, q1.v, AB, AD)} /><Zeilen z={skalarKurz(q1.u, q1.w, AB, AE)} /><Zeilen z={skalarKurz(q1.v, q1.w, AD, AE)} /></>,
          <>Die Ecke <Formel tex="C" /> liegt bei <Formel tex={t`\overrightarrow{OB}+${AD}`} nach=":" /> <Zeilen z={{ tex: t`\overrightarrow{OC}=${spalte(A1.B)}+${spalte(q1.v)}=${spalte(oc)}`, schmal: t`\begin{gathered}\overrightarrow{OC}\\{\scriptsize {}=${spalte(A1.B)}+${spalte(q1.v)}}\\{}=${spalte(oc)}\end{gathered}` }} /></>,
          <>Die Ecke <Formel tex="G" /> liegt über <Formel tex="C" nach=":" /> <Zeilen z={{ tex: t`\overrightarrow{OG}=${spalte(oc)}+${spalte(q1.w)}=${spalte(og)}`, schmal: t`\begin{gathered}\overrightarrow{OG}\\{\small {}=${spalte(oc)}+${spalte(q1.w)}}\\{}=${spalte(og)}\end{gathered}` }} /></>,
          <>Grundfläche, Höhe und Volumen: <Zeilen z={{ tex: t`G=\sqrt{3}\cdot\sqrt{2}=\sqrt{6}`, schmal: t`\begin{gathered}G=\sqrt{3}\cdot\sqrt{2}\\{}=\sqrt{6}\end{gathered}` }} /><Zeilen z={{ tex: t`V=G\cdot h=\sqrt{6}\cdot\sqrt{6}=6`, schmal: t`\begin{gathered}V=G\cdot h\\{}=\sqrt{6}\cdot\sqrt{6}\\{}=6\end{gathered}` }} /></>,
        ]}
      >
        <p>
          Von einem Quader <Formel tex="ABCDEFGH" /> (Grundfläche <Formel tex="ABCD" nach=")" /> sind <Formel tex={punktTeX('A', A1.A)} nach="," /> <Formel tex={punktTeX('B', A1.B)} nach="," /> <Formel tex={punktTeX('D', A1.D)} /> und <Formel tex={punktTeX('E', A1.E)} /> gegeben. Zeige, dass die Kanten bei <Formel tex="A" /> senkrecht aufeinander stehen (im Heft), bestimme die Koordinaten der Ecke <Formel tex="G" /> und das Volumen des Quaders.
        </p>
        <KontrollFigur spec={aufg1} unter={<>Der Quader mit der Grundfläche <Formel tex="ABCD" /> (blau).</>} />
      </Aufgabe>

      <Aufgabe
        nummer={2}
        titel="Pyramide über einem Rechteck"
        felder={[feld('g', 'Grundfläche G in Flächeneinheiten', <>Grundfläche <Formel tex="G" /></>, A2.G), feld('h', 'Höhe h in Längeneinheiten', <>Höhe <Formel tex="h" /></>, A2.h), feld('v', 'Volumen V in Volumeneinheiten', <>Volumen <Formel tex="V" /></>, A2.V)]}
        hilfen={[
          <>Das Viereck <Formel tex="ABCD" /> ist ein Rechteck: Zeige mit einem Skalarprodukt, dass <Formel tex={AB} /> und <Formel tex={AD} /> senkrecht aufeinander stehen. Die Grundfläche ist das Produkt der Seitenlängen.</>,
          <>Alle vier Ecken haben dieselbe <Formel tex={t`x_3`} />-Koordinate, die Grundebene ist also die Ebene <Formel tex={t`x_3=1`} nach="," /> parallel zur <Formel tex={t`x_1x_2`} />-Ebene. Die Höhe ist der Abstand der Spitze von dieser Ebene.</>,
        ]}
        loesung={[
          <>Seitenvektoren: <Zeilen z={spannvektorZeilen(A2.A, A2.B, 'A', 'B')} /><Zeilen z={spannvektorZeilen(A2.A, A2.D, 'A', 'D')} /></>,
          <>Senkrecht: <Zeilen z={skalarKurz(ab2, ad2, AB, AD)} /></>,
          <>Grundfläche: <Zeilen z={{ tex: t`G=|${AB}|\cdot|${AD}|=\sqrt{10}\cdot\sqrt{10}=10`, schmal: t`\begin{gathered}G=|${AB}|\cdot|${AD}|\\{}=\sqrt{10}\cdot\sqrt{10}\\{}=10\end{gathered}` }} /></>,
          <>Die Grundebene hat die Gleichung <Formel tex={t`x_3=1`} nach="," /> die Spitze liegt bei <Formel tex={t`x_3=4`} nach="," /> also ist <Formel tex={t`h=4-1=3`} nach="." /></>,
          <>Volumen: <Zeilen z={{ tex: t`V=\frac{1}{3}\cdot G\cdot h=\frac{1}{3}\cdot 10\cdot 3=10`, schmal: t`\begin{gathered}V=\frac{1}{3}\cdot G\cdot h\\{}=\frac{1}{3}\cdot 10\cdot 3\\{}=10\end{gathered}` }} /></>,
        ]}
      >
        <p>
          Die Punkte <Formel tex={punktTeX('A', A2.A)} nach="," /> <Formel tex={punktTeX('B', A2.B)} nach="," /> <Formel tex={punktTeX('C', A2.C)} /> und <Formel tex={punktTeX('D', A2.D)} /> bilden ein Rechteck <Formel tex="ABCD" nach="." /> Es ist die Grundfläche einer Pyramide mit der Spitze <Formel tex={punktTeX('S', A2.S)} nach="." /> Bestimme die Grundfläche, die Höhe und das Volumen der Pyramide.
        </p>
        <KontrollFigur spec={aufg2} unter={<>Die Pyramide mit der rechteckigen Grundfläche in der Ebene <Formel tex={t`x_3=1`} /> und ihrer Höhe (orange).</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Grundfläche aus dem Kreuzprodukt"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`G=3{,}5`} />, true, <>Richtig. Das Dreieck hat die Hälfte des Parallelogramms: <Formel tex={t`G=\frac{1}{2}\cdot 7=3{,}5`} nach="." /></>),
            opt('b', <Formel tex={t`G=7`} />, false, <>Das ist der Flächeninhalt des Parallelogramms, das <Formel tex={AB} /> und <Formel tex={AC} /> aufspannen. Das Dreieck hat nur die Hälfte.</>),
            opt('c', <Formel tex={t`G=24{,}5`} />, false, <>Hier wurde <Formel tex={t`|\vec{n}|^2=49`} /> halbiert. Der Flächeninhalt ist der Betrag selbst, nicht sein Quadrat.</>),
            opt('d', <Formel tex={t`G=5{,}5`} />, false, <>Hier wurden die Beträge der Koordinaten addiert, <Formel tex={t`2+6+3=11`} nach="," /> und halbiert. Der Betrag eines Vektors ist die Wurzel aus der Summe der Quadrate: <Formel tex={t`\sqrt{4+36+9}=7`} nach="." /></>),
          ],
          2,
        )}
        erklaerung={<>Der Betrag von <Formel tex={t`\vec{n}=${spalte(A3.n)}`} /> ist <Formel tex={t`\sqrt{2^2+(-6)^2+3^2}=\sqrt{49}=7`} nach="." /> Das ist der Flächeninhalt des Parallelogramms aus <Formel tex={AB} /> und <Formel tex={AC} nach="," /> das Dreieck <Formel tex="ABC" /> hat die Hälfte.</>}
      >
        <p>
          Für ein Dreieck <Formel tex="ABC" /> ist <Formel tex={t`\vec{n}=\overrightarrow{AB}\times\overrightarrow{AC}=${spalte(A3.n)}`} nach="." /> Welche Grundfläche hat das Dreieck?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={4}
        titel="Pyramide, Teil a: die Grundebene"
        felder={[...[1, 2, 3].map((i) => feld(`n${i}`, `${i}. Koordinate des Normalenvektors`, <>{i}. Koordinate von <Formel tex={t`\vec{n}`} /></>, p4.n[i - 1]!)), feld('b', 'Rechte Seite b der Koordinatenform', <>Rechte Seite <Formel tex="b" /></>, A4.b)]}
        hilfen={[
          <>Bestimme die Spannvektoren <Formel tex={AB} /> und <Formel tex={AC} nach="." /> Der Normalenvektor der Grundebene ist ihr Vektorprodukt (Kreuzprodukt), ungekürzt.</>,
          <>Die rechte Seite ist <Formel tex={t`b=\vec{n}\cdot\overrightarrow{OA}`} nach="." /> Als Probe setzt du <Formel tex="B" /> und <Formel tex="C" /> in die Gleichung ein.</>,
        ]}
        loesung={[
          <>Spannvektoren: <Zeilen z={spannvektorZeilen(A4.A, A4.B, 'A', 'B')} /><Zeilen z={spannvektorZeilen(A4.A, A4.C, 'A', 'C')} /></>,
          <>Normalenvektor: <Zeilen z={kreuzZeilen(ab4, ac4, AB, AC)} /></>,
          <>Rechte Seite: <Zeilen z={{ tex: t`b=\vec{n}\cdot\overrightarrow{OA}=${skalarZeilen(p4.n, A4.A).tex}`, schmal: t`\begin{gathered}b=\vec{n}\cdot\overrightarrow{OA}\\{}=${skalarZeilen(p4.n, A4.A).tex}\end{gathered}` }} /> Die Koordinatenform ist <Formel tex={formTeX(p4.form)} nach="." /></>,
          <>Probe mit <Formel tex="B" nach=":" /> <Zeilen z={{ tex: skalarZeilen(p4.n, A4.B).tex, schmal: skalarZeilen(p4.n, A4.B).tex }} /> und mit <Formel tex="C" nach=":" /> <Zeilen z={{ tex: skalarZeilen(p4.n, A4.C).tex, schmal: skalarZeilen(p4.n, A4.C).tex }} /> Beide Punkte liegen in der Ebene.</>,
        ]}
      >
        <p>
          Das Dreieck mit <Formel tex={punktTeX('A', A4.A)} nach="," /> <Formel tex={punktTeX('B', A4.B)} /> und <Formel tex={punktTeX('C', A4.C)} /> ist die Grundfläche einer Pyramide mit der Spitze <Formel tex={punktTeX('S', A4.S)} nach="." /> Stelle die Koordinatenform <Formel tex={t`E:\ n_1x_1+n_2x_2+n_3x_3=b`} /> der Grundebene auf. Verwende dabei den ungekürzten Normalenvektor <Formel tex={t`\vec{n}=\overrightarrow{AB}\times\overrightarrow{AC}`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={5}
        titel="Pyramide, Teil b: die Höhe"
        felder={[...koordFelder('f', 'F', A4.F, 0.01), feld('h', 'Höhe h in Längeneinheiten', <>Höhe <Formel tex="h" /></>, A4.h, 0.01)]}
        hilfen={[
          <>Die Höhe ist der Abstand von <Formel tex="S" /> zur Grundebene. Der Höhenfußpunkt <Formel tex="F" /> ist der Lotfußpunkt.</>,
          <>Stelle die Lotgerade durch <Formel tex="S" /> mit dem Richtungsvektor <Formel tex={t`\vec{n}`} /> auf, führe die Geradenprobe aus und setze <Formel tex={t`t_0`} /> in die Gerade ein.</>,
          <>Die Höhe ist <Formel tex={t`h=|t_0|\cdot|\vec{n}|`} nach="." /> Du darfst auch Brüche eingeben.</>,
        ]}
        loesung={[
          <>Lotgerade durch <Formel tex="S" nach=":" /> <Umbruchformel tex={w5.lotgerade} schmal={w5.lotgeradeSchmal} /></>,
          <>Geradenprobe: <Zeilen z={w5.probe.tex.length > 50 ? { tex: w5.probe.schmal, schmal: w5.probe.schmal } : w5.probe} /> Aus <Formel tex={w5.probe.gleichung} /> folgt <Formel tex={t`t_0=${w5.t}`} nach="." /></>,
          <>Höhenfußpunkt: <Zeilen z={w5.fuss} /> Also <Formel tex={punktBruchTeX('F', p4.F)} nach="." /></>,
          <>Höhe: <Zeilen z={w5.norm} /><Zeilen z={w5.abstand} /></>,
        ]}
      >
        <p>
          Bestimme für die Pyramide aus Teil a den Höhenfußpunkt <Formel tex="F" /> der Spitze <Formel tex={punktTeX('S', A4.S)} /> auf der Grundebene <Formel tex={formTeX(p4.form)} /> und die Höhe <Formel tex="h" nach="." /> Runde auf zwei Nachkommastellen.
        </p>
        <KontrollFigur spec={aufg5} unter={<>Die Pyramide mit der Höhe <Formel tex="SF" /> (orange), die senkrecht auf der Grundebene steht.</>} />
      </Aufgabe>

      <Aufgabe
        nummer={6}
        titel="Pyramide, Teil c: Grundfläche und Volumen"
        felder={[feld('g', 'Grundfläche G in Flächeneinheiten', <>Grundfläche <Formel tex="G" /></>, A4.G, 0.01), feld('v', 'Volumen V in Volumeneinheiten', <>Volumen <Formel tex="V" /></>, A4.V, 0.01)]}
        hilfen={[
          <>Die Grundfläche ist ein Dreieck: Sie ist die Hälfte des Betrags des Normalenvektors aus Teil a.</>,
          <>Das Volumen ist <Formel tex={t`V=\frac{1}{3}\cdot G\cdot h`} nach="." /> Rechne mit den exakten Werten und runde erst das Ergebnis.</>,
        ]}
        loesung={[
          <>Betrag des Normalenvektors: <Zeilen z={betragZeilen(p4.n, '\\vec{n}')} /></>,
          <>Grundfläche: <Zeilen z={dreiecksflaecheZeilen(p4.nn)} /></>,
          <>Volumen mit den exakten Werten von <Formel tex="G" /> und <Formel tex="h" nach=":" /> <Zeilen z={vol4} /> Die Wurzeln kürzen sich, denn <Formel tex={t`\frac{\sqrt{99}}{2}\cdot\frac{18}{\sqrt{99}}=9`} nach="," /> und <Formel tex={t`\frac{1}{3}\cdot 9=3`} nach="." /></>,
        ]}
      >
        <p>
          Bestimme für die Pyramide aus den Teilen a und b die Grundfläche <Formel tex="G" /> und das Volumen <Formel tex="V" nach="." /> Runde <Formel tex="G" /> auf zwei Nachkommastellen. Das Volumen ist eine ganze Zahl.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={7}
        titel="Welche Spitze gehört zu diesem Volumen?"
        felder={[feld('a1', 'Größerer Wert von a', <>Größerer Wert von <Formel tex="a" /></>, A7.a1), feld('a2', 'Kleinerer Wert von a', <>Kleinerer Wert von <Formel tex="a" /></>, A7.a2)]}
        hilfen={[
          <>Das Rechteck liegt in der <Formel tex={t`x_1x_2`} />-Ebene, die Höhe ist <Formel tex={t`h=|a|`} nach="." /> Berechne zuerst die Grundfläche.</>,
          <>Setze <Formel tex={t`V=\frac{1}{3}\cdot G\cdot|a|`} /> gleich 5. Der Betrag liefert zwei Lösungen: Die Spitze kann über oder unter der Grundebene liegen.</>,
        ]}
        loesung={[
          <>Seitenvektoren: <Zeilen z={spannvektorZeilen(A7.A, A7.B, 'A', 'B')} /><Zeilen z={spannvektorZeilen(A7.A, A7.D, 'A', 'D')} /></>,
          <>Die Vektoren sind senkrecht: <Zeilen z={skalarKurz(verbindungsvektor(A7.A, A7.B), verbindungsvektor(A7.A, A7.D), AB, AD)} /> Also ist <Formel tex={t`G=\sqrt{5}\cdot\sqrt{5}=5`} nach="." /></>,
          <>Die Höhe ist <Formel tex={t`h=|a|`} nach="." /> Aus dem Volumen folgt <Zeilen z={{ tex: t`\frac{1}{3}\cdot 5\cdot|a|=5`, schmal: t`\begin{gathered}\frac{1}{3}\cdot 5\cdot|a|=5\\|a|=3\end{gathered}` }} /> Die Lösungen sind <Formel tex={t`a=3`} /> und <Formel tex={t`a=-3`} nach="." /></>,
        ]}
      >
        <p>
          Die Punkte <Formel tex={punktTeX('A', A7.A)} nach="," /> <Formel tex={punktTeX('B', A7.B)} nach="," /> <Formel tex={punktTeX('C', A7.C)} /> und <Formel tex={punktTeX('D', A7.D)} /> bilden ein Rechteck. Es ist die Grundfläche der Pyramide <Formel tex={t`ABCDS_a`} /> mit der Spitze <Formel tex={t`S_a(2\,|\,1\,|\,a)`} nach="." /> Für welche Werte von <Formel tex="a" /> hat die Pyramide das Volumen 5 VE?
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={8}
        titel="Ein Geräteschuppen aus Quader und Pyramide"
        felder={[feld('q', 'Volumen des Quaders in Kubikmetern', <>Volumen des Quaders</>, A8.vQuader), feld('d', 'Volumen des Dachs in Kubikmetern', <>Volumen des Dachs</>, Math.round(A8.vDach * 100) / 100, 0.01), feld('g', 'Gesamtvolumen in Kubikmetern', <>Gesamtvolumen</>, Math.round(A8.vGesamt * 100) / 100, 0.01)]}
        hilfen={[
          <>Der Quader hat die Grundfläche <Formel tex="ABCD" /> und die Höhe <Formel tex={t`|${AE}|`} nach="." /> Das Dach ist eine Pyramide, deren Grundfläche die Deckfläche <Formel tex="EFGH" /> des Quaders ist.</>,
          <>Die Deckfläche liegt in der Ebene <Formel tex={t`x_3=3`} nach="." /> Die Höhe des Dachs ist der Abstand der Spitze von dieser Ebene.</>,
        ]}
        loesung={[
          <>Kantenvektoren: <Zeilen z={spannvektorZeilen(A8.A, A8.B, 'A', 'B')} /><Zeilen z={spannvektorZeilen(A8.A, A8.D, 'A', 'D')} /><Zeilen z={spannvektorZeilen(A8.A, A8.E, 'A', 'E')} /></>,
          <>Die Grundfläche ist <Formel tex={t`G=\sqrt{5}\cdot\sqrt{5}=5`} nach="," /> die Höhe des Quaders <Formel tex={t`|${AE}|=2`} nach="." /> Quader: <Formel tex={t`V=5\cdot 2=10`} nach="." /></>,
          <>Dach: Die Deckfläche ist genauso groß wie die Grundfläche, <Formel tex={t`G=5`} nach="." /> Die Spitze liegt bei <Formel tex={t`x_3=4`} nach="," /> die Deckfläche bei <Formel tex={t`x_3=3`} nach="," /> also ist <Formel tex={t`h=1`} nach="." /> <Zeilen z={{ tex: t`V=\frac{1}{3}\cdot 5\cdot 1=\frac{5}{3}\approx 1{,}67`, schmal: t`\begin{gathered}V=\frac{1}{3}\cdot 5\cdot 1\\{}=\frac{5}{3}\\{}\approx 1{,}67\end{gathered}` }} /></>,
          <>Gesamtvolumen: <Zeilen z={{ tex: t`V=10+\frac{5}{3}=\frac{35}{3}\approx 11{,}67`, schmal: t`\begin{gathered}V=10+\frac{5}{3}\\{}=\frac{35}{3}\\{}\approx 11{,}67\end{gathered}` }} /></>,
        ]}
      >
        <p>
          Ein Geräteschuppen besteht aus einem Quader <Formel tex="ABCDEFGH" /> und einem Pyramidendach <Formel tex="EFGHS" nach="." /> Es ist <Formel tex={punktTeX('A', A8.A)} nach="," /> <Formel tex={punktTeX('B', A8.B)} nach="," /> <Formel tex={punktTeX('D', A8.D)} nach="," /> <Formel tex={punktTeX('E', A8.E)} /> und die Dachspitze <Formel tex={punktTeX('S', A8.S)} nach="." /> Eine Längeneinheit entspricht einem Meter, die <Formel tex={t`x_3`} />-Achse zeigt nach oben. Bestimme das Volumen des Quaders, das Volumen des Dachs und das Gesamtvolumen. Runde auf zwei Nachkommastellen.
        </p>
        <KontrollFigur spec={aufg8} unter={<>Der Schuppen: Quader mit der Grundfläche <Formel tex="ABCD" /> (blau) und das Dach mit den rosa Kanten.</>} />
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Eine Seitenfläche der Pyramide"
        felder={[feld('f', 'Flächeninhalt in Flächeneinheiten', <>Flächeninhalt der Seitenfläche</>, A9.flaeche, 0.01)]}
        hilfen={[
          <>Die Seitenfläche <Formel tex="ABS" /> ist ein Dreieck. Bestimme die Spannvektoren <Formel tex={AB} /> und <Formel tex={AS} nach="." /></>,
          <>Der Flächeninhalt ist die Hälfte des Betrags des Vektorprodukts (Kreuzprodukt) <Formel tex={t`${AB}\times${AS}`} nach="." /></>,
        ]}
        loesung={[
          <>Spannvektoren: <Zeilen z={spannvektorZeilen(A2.A, A2.B, 'A', 'B')} /><Zeilen z={spannvektorZeilen(A2.A, A2.S, 'A', 'S')} /></>,
          <>Kreuzprodukt: <Zeilen z={kreuzZeilen(ab9, as9, AB, AS)} /></>,
          <>Flächeninhalt: <Zeilen z={dreiecksflaecheZeilen(nn9)} /></>,
        ]}
      >
        <p>
          Die Pyramide hat die Grundfläche <Formel tex={punktTeX('A', A2.A)} nach="," /> <Formel tex={punktTeX('B', A2.B)} nach="," /> <Formel tex={punktTeX('C', A2.C)} nach="," /> <Formel tex={punktTeX('D', A2.D)} /> und die Spitze <Formel tex={punktTeX('S', A2.S)} nach="." /> Die Seitenfläche <Formel tex="ABS" /> soll gestrichen werden. Berechne ihren Flächeninhalt in Flächeneinheiten.
        </p>
        <KontrollFigur spec={aufg9} unter={<>Die Seitenfläche <Formel tex="ABS" /> (rosa).</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="10"
        titel="Was ist die Höhe einer Pyramide?"
        optionen={platziere(
          [
            opt('a', <>Der Abstand der Spitze von der Grundebene, also die Länge des Lots von der Spitze auf die Grundebene.</>, true, <>Richtig. Die Höhe misst den senkrechten Abstand der Spitze zur Ebene der Grundfläche.</>),
            opt('b', <>Die Länge einer Kante von der Spitze zu einer Ecke der Grundfläche.</>, false, <>Eine solche Kante verläuft schräg zur Grundebene und ist länger als die Höhe, im Bild die rosa Kante <Formel tex="SA" nach="." /> Nur wenn die Kante senkrecht auf der Grundebene steht, ist sie die Höhe.</>),
            opt('c', <>Der Höhenfußpunkt liegt immer im Inneren der Grundfläche, sonst ist es keine Pyramide.</>, false, <>Auch eine schiefe Pyramide ist eine Pyramide. Ihr Höhenfußpunkt kann am Rand oder außerhalb der Grundfläche liegen. Das Volumen hängt nur von <Formel tex="G" /> und <Formel tex="h" /> ab.</>),
            opt('d', <>Die <Formel tex={t`x_3`} />-Koordinate der Spitze.</>, false, <>Das gilt nur, wenn die Grundebene die <Formel tex={t`x_1x_2`} />-Ebene ist (<Formel tex={t`x_3=0`} nach=")." /> Bei einer anderen Grundebene brauchst du den Abstand von der Ebene.</>),
          ],
          1,
        )}
        erklaerung={
          <>
            Die Höhe ist der Abstand der Spitze von der Grundebene und steht senkrecht auf ihr. Berechnen kannst du sie mit der Abstandsformel für Punkt und Ebene.
            <KontrollFigur spec={RAUM_HOEHE_KANTE} unter={<>Die orange Höhe <Formel tex="SF" /> ist kürzer als die rosa Kante <Formel tex="SA" nach="." /></>} />
          </>
        }
      >
        <p>Welche Aussage über die Höhe <Formel tex="h" /> einer Pyramide ist richtig?</p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="11"
        titel="Alle Kanten verdoppeln"
        optionen={platziere(
          [
            opt('a', <>Das Volumen wird achtmal so groß.</>, true, <>Richtig. Die Grundfläche wird viermal so groß, die Höhe doppelt so groß, das Volumen also <Formel tex={t`4\cdot 2=8`} />-mal so groß.</>),
            opt('b', <>Das Volumen wird doppelt so groß.</>, false, <>Doppelt so groß wird nur die Höhe oder nur die Kantenlänge. Das Volumen hängt von Grundfläche und Höhe ab, beide wachsen.</>),
            opt('c', <>Das Volumen wird viermal so groß.</>, false, <>Viermal so groß wird die Grundfläche. Die Höhe wird dabei auch doppelt so groß, das ist noch nicht berücksichtigt.</>),
            opt('d', <>Das Volumen wird sechsmal so groß.</>, false, <>Hier wurden die Faktoren addiert, <Formel tex={t`4+2=6`} nach="." /> Die Faktoren der Grundfläche und der Höhe werden multipliziert.</>),
          ],
          2,
        )}
        erklaerung={<>Bei einer Streckung aller Längen mit dem Faktor 2 wächst jede Länge auf das Doppelte, jede Fläche auf das Vierfache und jedes Volumen auf das Achtfache. Für <Formel tex={t`V=\frac{1}{3}\cdot G\cdot h`} /> gilt: <Formel tex={t`G\to 4G`} nach="," /> <Formel tex={t`h\to 2h`} nach="," /> also <Formel tex={t`V\to 8V`} nach="." /></>}
      >
        <p>Bei einer Pyramide werden alle Kantenlängen verdoppelt. Wie ändert sich das Volumen?</p>
      </Auswahlfrage>

      <Zeichenaufgabe
        nummer="12"
        titel="Stellung nehmen: zwei Pyramiden, ein Volumen?"
        hilfe={
          <>
            <p>
              Die Aussage stimmt. Das Volumen hängt nur von der Grundfläche und der Höhe ab. Beide Pyramiden haben dieselbe Grundfläche <Formel tex={t`G=${pP.G}`} nach="." /> Die Höhe ist der Abstand der Spitze von der Grundebene (<Formel tex={formTeX(pP.form)} nach="):" />
            </p>
            <Zeilen z={formelZeilen(pP.form, PYRAMIDE.S).zeilen} />
            <Zeilen z={f2.zeilen} />
            <p>
              Beide Spitzen haben die Höhe <Formel tex={t`h=3`} nach="," /> weil ihre Verbindung <Formel tex={t`\overrightarrow{SS_2}=\begin{pmatrix}1\\-1\\0\end{pmatrix}`} /> in der Grundebene verläuft: Sie ist senkrecht zum Normalenvektor (<Formel tex={t`2\cdot 1+2\cdot(-1)-1\cdot 0=0`} nach=")." /> Also gilt für beide <Formel tex={t`V=\frac{1}{3}\cdot 6\cdot 3=${A12.V}`} nach="." /> Die zweite Pyramide ist nur schiefer: Ihr Höhenfußpunkt liegt nicht mehr an derselben Stelle.
            </p>
          </>
        }
        kontrolle={<KontrollFigur spec={RAUM_ZWEI_SPITZEN} unter={<>Zwei Pyramiden über demselben Dreieck <Formel tex="ABC" nach="." /> Die Spitzen <Formel tex="S" /> und <Formel tex={t`S_2`} /> liegen in einer Ebene parallel zur Grundebene.</>} />}
      >
        <p>
          Jonas sagt: „Zwei Pyramiden über demselben Dreieck haben dasselbe Volumen, wenn ihre Spitzen in einer Ebene liegen, die zur Grundebene parallel ist. Das gilt auch, wenn eine der beiden Pyramiden viel schiefer ist.“ Nimm Stellung, ohne die Volumen auszurechnen. Prüfe deine Antwort danach an den Spitzen <Formel tex={punktTeX('S', PYRAMIDE.S)} /> und <Formel tex={punktTeX('S_2', SPITZE2)} /> über dem Dreieck <Formel tex={punktTeX('A', PYRAMIDE.A)} nach="," /> <Formel tex={punktTeX('B', PYRAMIDE.B)} /> und <Formel tex={punktTeX('C', PYRAMIDE.C)} nach="." />
        </p>
      </Zeichenaufgabe>
    </Abschnitt>
  );
}
