import { Fragment } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { glSchmal, gl } from '@/lib/geradenhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { ausschnitt } from '@/lib/spur';
import { ebenenBild, kontrollBild, punkt } from './Bilder';
import { A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12 } from './daten';
import { gleichungE, koordinatenformTeX, kreuzSpalte, kreuzSpalteKurz, punktTeX, skalarZeilen, spalte, spurGleichungTeX, spurZeilen } from './rechenhilfen';

type KF = { n: number[]; d: number };
const kf = (k: KF, name = 'E') => <Formel tex={koordinatenformTeX(k.n, k.d, name)} />;
const kfNach = (k: KF, nach: string, name = 'E') => <Formel tex={koordinatenformTeX(k.n, k.d, name)} nach={nach} />;
const zeilen = (k: KF, i: number) => {
  const z = spurZeilen(k, i);
  return <Umbruchformel key={i} tex={z.tex} schmal={z.schmal} />;
};
const spurSchritt = (k: KF) => [0, 1, 2].map((i) => <Fragment key={i}>{zeilen(k, i)}</Fragment>);

export function Ueberpruefen() {
  const a3 = A3;
  const a4 = A4;
  const a9 = ausschnitt(A9.k)!;
  const a11 = A11;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gezeichnet oder gerechnet hast. Das Vektorprodukt (Kreuzprodukt) steht im Modul <Modulverweis modul="vektorprodukt">Das Vektorprodukt</Modulverweis> (Kreuzprodukt).
      </p>
      <Hinweis titel="Eingabe und Selbstkontrolle">
        Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen. Zeichnest du im Heft, kannst du die Ebene zur Kontrolle auch in ein 3D-Programm eingeben. Dort heißen die Achsen x, y und z statt <Formel tex="x_1" nach="," /> <Formel tex="x_2" /> und <Formel tex="x_3" nach="," /> und das Koordinatensystem erscheint in einer anderen Ansicht. Vergleiche deshalb die Spurpunkte, nicht das Bild.
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Spurpunkte berechnen"
        felder={[
          { id: 'x1', name: '1. Koordinate des Spurpunkts S1', beschriftung: <>Koordinate <Formel tex="x_1" /> von <Formel tex={t`S_1`} /></>, erwartet: A1.s[0]![0]! },
          { id: 'x2', name: '2. Koordinate des Spurpunkts S2', beschriftung: <>Koordinate <Formel tex="x_2" /> von <Formel tex={t`S_2`} /></>, erwartet: A1.s[1]![1]! },
          { id: 'x3', name: '3. Koordinate des Spurpunkts S3', beschriftung: <>Koordinate <Formel tex="x_3" /> von <Formel tex={t`S_3`} /></>, erwartet: A1.s[2]![2]! },
        ]}
        hilfen={[
          <>Der Spurpunkt <Formel tex={t`S_1`} /> liegt auf der <Formel tex="x_1" />-Achse. Was gilt für die beiden anderen Koordinaten aller Punkte auf dieser Achse?</>,
          <>Setze in der Gleichung <Formel tex="x_2=0" /> und <Formel tex="x_3=0" nach="." /> Es bleibt eine Gleichung mit einer Unbekannten. Gehe für <Formel tex={t`S_2`} /> und <Formel tex={t`S_3`} /> genauso vor.</>,
        ]}
        loesung={[...spurSchritt(A1.k), <>Die Spurpunkte sind <Formel tex={punktTeX('S_1', A1.s[0]!)} nach="," /> <Formel tex={punktTeX('S_2', A1.s[1]!)} /> und <Formel tex={punktTeX('S_3', A1.s[2]!)} nach="." /> Probe für <Formel tex={t`S_3`} nach=":" /> <Formel tex={t`-2\cdot(-3)=6`} nach="." /></>]}
      >
        <p>
          Bestimme die Spurpunkte der Ebene <Formel tex={koordinatenformTeX(A1.k.n, A1.k.d, 'E')} nach="." /> Trage jeweils die Koordinate auf der zugehörigen Achse ein.
        </p>
        <KontrollFigur spec={kontrollBild(A1.k)} unter={<>Die Ebene mit ihren Spurpunkten, Spurgeraden und dem Spurdreieck.</>} />
      </Aufgabe>

      <Zeichenaufgabe
        nummer="2"
        titel="Eine Ebene zeichnen (Vorzeichen beachten)"
        hilfe={
          <>
            <p>Berechne die Spurpunkte:</p>
            {spurSchritt(A2.k)}
            <p>
              Zeichne <Formel tex={punktTeX('S_1', A2.s[0]!)} /> auf der <Formel tex="x_1" />-Achse in der Gegenrichtung (schräg nach rechts oben), <Formel tex={punktTeX('S_2', A2.s[1]!)} /> und <Formel tex={punktTeX('S_3', A2.s[2]!)} /> wie gewohnt. Verbinde die Spurpunkte mit dem Lineal, beschrifte die Spurgeraden <Formel tex={t`s_{12}`} nach="," /> <Formel tex={t`s_{13}`} /> und <Formel tex={t`s_{23}`} /> und schraffiere das Spurdreieck.
            </p>
          </>
        }
        kontrolle={<KontrollFigur spec={kontrollBild(A2.k)} unter={<>Die Ebene mit dem Spurdreieck. <Formel tex={t`S_1`} /> liegt schräg nach rechts oben.</>} />}
      >
        <p>
          Zeichne die Ebene <Formel tex={koordinatenformTeX(A2.k.n, A2.k.d, 'E')} /> in ein Schrägbild des Koordinatensystems in dein Heft. Beschrifte die Spurpunkte und die Spurgeraden.
        </p>
      </Zeichenaufgabe>

      <Zeichenaufgabe
        nummer="3"
        titel="Eine Ebene in Parameterform zeichnen"
        hilfe={
          <>
            <p>Bestimme zuerst die Koordinatenform. Normalenvektor mit dem Vektorprodukt (Kreuzprodukt) der Spannvektoren:</p>
            <Umbruchformel
              tex={t`\vec{n}=${kreuzSpalte(a3.e.u, a3.e.v)}=${spalte(a3.k.n)}`}
              schmal={t`\begin{gathered}\vec{n}\\{}=${kreuzSpalteKurz(a3.e.u, a3.e.v)}\\{}=${spalte(a3.k.n)}\end{gathered}`}
            />
            <p>
              Dann <Formel tex={t`d=\vec{n}\cdot\vec{p}`} nach=":" />
            </p>
            <Umbruchformel tex={skalarZeilen(a3.k.n, a3.e.p).tex} schmal={skalarZeilen(a3.k.n, a3.e.p).schmal} />
            <p>
              Die Koordinatenform ist <Formel tex={koordinatenformTeX(a3.k.n, a3.k.d, 'E')} nach="." /> Du kannst sie durch 2 teilen, die Ebene bleibt dieselbe, zum Rechnen genügt aber auch die Form ohne Kürzen. Berechne damit die Spurpunkte:
            </p>
            {spurSchritt(a3.k)}
            <p>Zeichne die Spurpunkte, verbinde sie und schraffiere das Spurdreieck.</p>
          </>
        }
        kontrolle={<KontrollFigur spec={kontrollBild(a3.k)} unter={<>Die Ebene mit ihren Spurpunkten und dem Spurdreieck.</>} />}
      >
        <p>
          Zeichne die Ebene <Formel tex={gleichungE(a3.e)} /> in ein Schrägbild in dein Heft. Beschrifte die Spurpunkte und die Spurgeraden.
        </p>
      </Zeichenaufgabe>

      <Auswahlfrage
        nummer="4"
        titel="Welche Gleichung gehört zum Bild?"
        optionen={platziere(
          [
            opt('a', <Formel tex={koordinatenformTeX(a4.richtig.n, a4.richtig.d)} />, true, <>Richtig. Die Spurpunkte erfüllen die Gleichung: <Formel tex={t`4\cdot 3=12`} nach="," /> <Formel tex={t`3\cdot 4=12`} /> und <Formel tex={t`-6\cdot(-2)=12`} nach="." /></>),
            opt('b', <Formel tex={koordinatenformTeX(a4.abschnitte.n, a4.abschnitte.d)} />, false, <>Hier stehen die Koordinaten der Spurpunkte als Koeffizienten. Für <Formel tex={t`S_1`} /> gilt dann aber <Formel tex={t`3\cdot 3=9\ne 12`} nach="." /> Die Koeffizienten sind nicht die Koordinaten der Spurpunkte.</>),
            opt('c', <Formel tex={koordinatenformTeX(a4.vorzeichen.n, a4.vorzeichen.d)} />, false, <>Das Vorzeichen bei <Formel tex="x_3" /> stimmt nicht: <Formel tex={t`S_3`} /> hätte hier die Koordinate <Formel tex="2" nach="," /> im Bild liegt es bei <Formel tex="-2" nach="." /></>),
            opt('d', <Formel tex={koordinatenformTeX(a4.dFalsch.n, a4.dFalsch.d)} />, false, <>Mit <Formel tex="d=24" /> lägen die Spurpunkte doppelt so weit vom Ursprung entfernt, zum Beispiel <Formel tex={t`S_1(6\,|\,0\,|\,0)`} nach="." /></>),
          ],
          1,
        )}
        erklaerung={
          <>
            <p>Zu den Spurpunkten gehört die Gleichung, die alle drei Spurpunkte erfüllen. Die Probe mit den Spurpunkten entscheidet.</p>
            <Figur spec={kontrollBild(a4.richtig)} unter={<>Die Ebene <Formel tex={koordinatenformTeX(a4.richtig.n, a4.richtig.d, 'E')} /> mit ihren Spurpunkten.</>} />
          </>
        }
      >
        <p>
          Die Ebene <Formel tex="E" /> hat die Spurpunkte <Formel tex={punktTeX('S_1', a4.s[0]!)} nach="," /> <Formel tex={punktTeX('S_2', a4.s[1]!)} /> und <Formel tex={punktTeX('S_3', a4.s[2]!)} nach="." /> Welche Gleichung beschreibt <Formel tex="E" nach="?" />
        </p>
        <Figur spec={ebenenBild(a4.richtig, { flaeche: 'ausschnitt', spurpunkte: true, spurgeraden: true }).spec} unter={<>Die Ebene <Formel tex="E" /> mit ihrem Spurdreieck.</>} />
      </Auswahlfrage>

      <Aufgabe
        nummer={5}
        titel="Wenn ein Spurpunkt fehlt"
        felder={[
          { id: 'anzahl', name: 'Anzahl der Spurpunkte', beschriftung: <>Anzahl der Spurpunkte</>, erwartet: A5.anzahl },
          { id: 'x2', name: '2. Koordinate des Spurpunkts S2', beschriftung: <>Koordinate <Formel tex="x_2" /> von <Formel tex={t`S_2`} /></>, erwartet: A5.s2 },
          { id: 'x3', name: '3. Koordinate des Spurpunkts S3', beschriftung: <>Koordinate <Formel tex="x_3" /> von <Formel tex={t`S_3`} /></>, erwartet: A5.s3 },
        ]}
        hilfen={[
          <>Berechne wie gewohnt alle drei möglichen Spurpunkte, indem du auf jeder Achse die beiden anderen Koordinaten gleich 0 setzt.</>,
          <>Eine falsche Aussage wie <Formel tex="0=4" /> bedeutet: Auf dieser Achse gibt es keinen Punkt der Ebene, es gibt dort keinen Spurpunkt. Zähle nur die vorhandenen Spurpunkte.</>,
        ]}
        loesung={[
          ...spurSchritt(A5.k),
          <>Bei <Formel tex={t`S_1`} /> bleibt <Formel tex="0=4" nach="," /> das ist falsch: Es gibt keinen Spurpunkt auf der <Formel tex="x_1" />-Achse, die Ebene ist parallel zu ihr (<Formel tex="x_1" /> fehlt in der Gleichung). Es gibt zwei Spurpunkte, <Formel tex={punktTeX('S_2', [0, A5.s2, 0])} /> und <Formel tex={punktTeX('S_3', [0, 0, A5.s3])} nach="." /></>,
        ]}
      >
        <p>
          Bestimme die Spurpunkte der Ebene <Formel tex={koordinatenformTeX(A5.k.n, A5.k.d, 'E')} nach="." /> Wie viele Spurpunkte hat sie? Trage die Anzahl und die Koordinaten der vorhandenen Spurpunkte ein.
        </p>
        <KontrollFigur spec={kontrollBild(A5.k)} unter={<>Die Ebene mit den beiden Spurpunkten, sie ist parallel zur <Formel tex="x_1" />-Achse.</>} />
      </Aufgabe>

      <Zeichenaufgabe
        nummer="6"
        titel="Eine Ebene parallel zu einer Achse zeichnen"
        hilfe={
          <>
            <p>Berechne die Spurpunkte:</p>
            {spurSchritt(A6.k)}
            <p>
              Es fehlt <Formel tex={t`S_3`} nach="," /> die Ebene ist parallel zur <Formel tex="x_3" />-Achse. Verbinde <Formel tex={t`S_1`} /> und <Formel tex={t`S_2`} /> (das ist <Formel tex={t`s_{12}`} nach=")." /> Zeichne durch <Formel tex={t`S_1`} /> und durch <Formel tex={t`S_2`} /> jeweils eine Parallele zur <Formel tex="x_3" />-Achse (das sind <Formel tex={t`s_{13}`} /> und <Formel tex={t`s_{23}`} nach=")." /> Es entsteht ein Streifen (Parallelogramm) als Ausschnitt der Ebene.
            </p>
          </>
        }
        kontrolle={<KontrollFigur spec={kontrollBild(A6.k)} unter={<>Der Streifen als Ausschnitt der Ebene, die Spurgeraden <Formel tex={t`s_{13}`} /> und <Formel tex={t`s_{23}`} /> sind parallel zur <Formel tex="x_3" />-Achse.</>} />}
      >
        <p>
          Überlege, wie die Spurgeraden verlaufen, und zeichne dann die Ebene <Formel tex={koordinatenformTeX(A6.k.n, A6.k.d, 'E')} /> in dein Heft. Beschrifte die Spurpunkte und die Spurgeraden.
        </p>
      </Zeichenaufgabe>

      <Zeichenaufgabe
        nummer="7"
        titel="Eine Ebene parallel zu einer Koordinatenebene zeichnen"
        hilfe={
          <>
            <p>
              In <Formel tex={koordinatenformTeX(A7.k.n, A7.k.d)} /> fehlen <Formel tex="x_1" /> und <Formel tex="x_3" nach="." /> Die Ebene ist parallel zur <Formel tex="x_1x_3" />-Ebene. Es gibt nur den Spurpunkt <Formel tex={t`S_2`} nach=":" />
            </p>
            {zeilen(A7.k, 1)}
            <p>
              Durch <Formel tex={t`S_2`} /> verläuft in der <Formel tex="x_1x_2" />-Ebene die Spurgerade <Formel tex={t`s_{12}`} /> parallel zur <Formel tex="x_1" />-Achse und in der <Formel tex="x_2x_3" />-Ebene die Spurgerade <Formel tex={t`s_{23}`} /> parallel zur <Formel tex="x_3" />-Achse. Eine Spurgerade <Formel tex={t`s_{13}`} /> gibt es nicht. Als Ausschnitt zeichnest du ein Rechteck, dessen Seiten parallel zu diesen beiden Achsen sind.
            </p>
          </>
        }
        kontrolle={<KontrollFigur spec={kontrollBild(A7.k)} unter={<>Ein Ausschnitt der Ebene <Formel tex={koordinatenformTeX(A7.k.n, A7.k.d)} nach="." /> Die beiden Spurgeraden gehen durch <Formel tex={t`S_2`} nach="." /></>} />}
      >
        <p>
          Beschreibe die Lage der Ebene <Formel tex={koordinatenformTeX(A7.k.n, A7.k.d, 'E')} /> im Koordinatensystem und zeichne einen Ausschnitt in dein Heft.
        </p>
      </Zeichenaufgabe>

      <Auswahlfrage
        nummer="8"
        titel="Die Lage aus der Gleichung ablesen"
        optionen={platziere(
          [
            opt('a', <>E enthält die ganze <Formel tex="x_3" />-Achse und geht durch den Ursprung.</>, true, <>Richtig. <Formel tex="d=0" nach="," /> also liegt der Ursprung in <Formel tex="E" nach="." /> Die Variable <Formel tex="x_3" /> fehlt, für jeden Wert von <Formel tex="x_3" /> bleibt <Formel tex={t`3x_1-2x_2=0`} /> erfüllt, wenn <Formel tex="x_1=0" /> und <Formel tex="x_2=0" nach="." /> Die ganze <Formel tex="x_3" />-Achse liegt in <Formel tex="E" nach="." /></>),
            opt('b', <>E ist parallel zur <Formel tex="x_3" />-Achse und hat keinen Punkt mit ihr gemeinsam.</>, false, <>Parallel ohne gemeinsamen Punkt gibt es nur für <Formel tex="d\ne 0" nach="." /> Hier ist <Formel tex="d=0" nach="," /> die <Formel tex="x_3" />-Achse liegt sogar in der Ebene.</>),
            opt('c', <>E ist parallel zur <Formel tex="x_1x_2" />-Ebene.</>, false, <>Dann müssten <Formel tex="x_1" /> und <Formel tex="x_2" /> in der Gleichung fehlen. Hier fehlt nur <Formel tex="x_3" nach="." /></>),
            opt('d', <>E hat genau drei verschiedene Spurpunkte.</>, false, <>Die Spurpunkte <Formel tex={t`S_1`} /> und <Formel tex={t`S_2`} /> sind beide der Ursprung. Auf der <Formel tex="x_3" />-Achse gibt es keinen einzelnen Spurpunkt, denn dort liegen unendlich viele Punkte der Ebene.</>),
          ],
          3,
        )}
        erklaerung={
          <>
            <p>Fehlt eine Variable und ist <Formel tex="d=0" nach="," /> enthält die Ebene die zugehörige Achse. Bei <Formel tex="d\ne 0" /> wäre sie nur parallel zu ihr.</p>
            <Figur spec={kontrollBild(A8.k)} unter={<>Ein Ausschnitt der Ebene <Formel tex={koordinatenformTeX(A8.k.n, A8.k.d)} nach="." /> Die <Formel tex="x_3" />-Achse liegt in der Ebene.</>} />
          </>
        }
      >
        <p>
          Welche Aussage über die Lage der Ebene <Formel tex={koordinatenformTeX(A8.k.n, A8.k.d, 'E')} /> im Koordinatensystem stimmt?
        </p>
      </Auswahlfrage>

      <Zeichenaufgabe
        nummer="9"
        titel="Eine Ebene durch den Ursprung zeichnen"
        hilfe={
          <>
            <p>
              Berechne die Spurpunkte. Auf jeder Achse bleibt eine Gleichung mit der Lösung 0, alle drei Spurpunkte sind der Ursprung. Sie reichen nicht zum Zeichnen. Suche weitere Punkte in den Koordinatenebenen:
            </p>
            <p>
              <Formel tex="x_3=0" nach=":" /> <Formel tex={spurGleichungTeX(A9.k, 'e12')} nach="," /> zum Beispiel <Formel tex={punktTeX('A', a9.ecken[0]!)} nach="." /> <Formel tex="x_2=0" nach=":" /> <Formel tex={spurGleichungTeX(A9.k, 'e13')} nach="," /> zum Beispiel <Formel tex={punktTeX('B', a9.ecken[1]!)} nach="." /> <Formel tex="x_1=0" nach=":" /> <Formel tex={spurGleichungTeX(A9.k, 'e23')} nach="," /> zum Beispiel <Formel tex={punktTeX('C', a9.ecken[2]!)} nach="." />
            </p>
            <p>
              Die Spurgeraden gehen durch den Ursprung und diese Punkte. Zeichne das Dreieck <Formel tex={t`ABC`} nach="," /> wähle die Punkte dabei so, dass der Ursprung im Dreieck liegt, und schraffiere es.
            </p>
          </>
        }
        kontrolle={
          <KontrollFigur
            spec={ebenenBild(A9.k, { flaeche: 'ausschnitt', spurgeraden: true, extra: [punkt('A', a9.ecken[0]!), punkt('B', a9.ecken[1]!), punkt('C', a9.ecken[2]!)] }).spec}
            unter={<>Ein Ausschnitt der Ebene <Formel tex={koordinatenformTeX(A9.k.n, A9.k.d)} nach="." /> Die drei Spurgeraden gehen durch den Ursprung.</>}
          />
        }
      >
        <p>
          Zeichne die Ebene <Formel tex={koordinatenformTeX(A9.k.n, A9.k.d, 'E')} /> in ein Schrägbild in dein Heft. Erkläre, warum die Spurpunkte hier nicht zum Zeichnen ausreichen, und beschrifte die Spurgeraden.
        </p>
      </Zeichenaufgabe>

      <Aufgabe
        nummer={10}
        titel="Die Gleichung aus den Spurpunkten bestimmen"
        felder={[
          { id: 'a', name: 'Koeffizient a', beschriftung: <Formel tex="a" />, erwartet: A10.k.n[0]! },
          { id: 'b', name: 'Koeffizient b', beschriftung: <Formel tex="b" />, erwartet: A10.k.n[1]! },
          { id: 'c', name: 'Koeffizient c', beschriftung: <Formel tex="c" />, erwartet: A10.k.n[2]! },
          { id: 'd', name: 'Zahl d', beschriftung: <Formel tex="d" />, erwartet: A10.k.d },
        ]}
        hilfen={[
          <>Setze die Spurpunkte in den Ansatz <Formel tex={t`ax_1+bx_2+cx_3=d`} /> ein. Das gibt drei Gleichungen, jede mit einer Unbekannten und <Formel tex="d" nach="." /></>,
          <>Wähle <Formel tex="d" /> als kleinstes positives gemeinsames Vielfaches von 3, 2 und 6 (Beträge der Achsenabschnitte). Dann sind <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> ganze Zahlen.</>,
        ]}
        loesung={[
          <>
            Einsetzen:
            <Umbruchformel tex={t`3a=d,\quad -2b=d,\quad 6c=d`} schmal={t`\begin{gathered}3a=d\\-2b=d\\6c=d\end{gathered}`} />
          </>,
          <>
            Mit <Formel tex="d=6" /> (kleinstes gemeinsames Vielfaches von 3, 2 und 6):
            <Umbruchformel tex={t`a=2,\quad b=-3,\quad c=1`} schmal={t`\begin{gathered}a=2\\b=-3\\c=1\end{gathered}`} />
          </>,
          <>
            Die Koordinatenform lautet <Formel tex={koordinatenformTeX(A10.k.n, A10.k.d, 'E')} nach="." />
          </>,
        ]}
      >
        <p>
          Eine Ebene hat die Spurpunkte <Formel tex={punktTeX('S_1', [3, 0, 0])} nach="," /> <Formel tex={punktTeX('S_2', [0, -2, 0])} /> und <Formel tex={punktTeX('S_3', [0, 0, 6])} nach="." /> Bestimme <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> der Koordinatenform <Formel tex={t`ax_1+bx_2+cx_3=d`} /> mit der kleinsten positiven ganzen Zahl <Formel tex="d" nach="," /> für die alle Koeffizienten ganze Zahlen sind, und gib <Formel tex="d" /> an.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={11}
        titel="Die Gleichung einer Spurgerade aufstellen"
        felder={[1, 2, 3].map((i) => ({ id: `ab${i}`, name: `${i}. Koordinate von AB`, beschriftung: <>{i}. Koordinate von <Formel tex={t`\overrightarrow{AB}`} /></>, erwartet: a11.AB[i - 1]! }))}
        hilfen={[
          <>Berechne zuerst die beiden Spurpunkte <Formel tex={t`S_1`} /> und <Formel tex={t`S_3`} nach="." /> Die Spurgerade <Formel tex={t`s_{13}`} /> geht durch beide.</>,
          <>Der Richtungsvektor ist der Verbindungsvektor <Formel tex={t`\overrightarrow{AB}`} /> mit <Formel tex="A=S_1" /> und <Formel tex="B=S_3" nach="." /> Zielpunkt minus Ausgangspunkt.</>,
        ]}
        loesung={[
          <>
            Spurpunkte:
            {zeilen(a11.k, 0)}
            {zeilen(a11.k, 2)}
          </>,
          <>
            Verbindungsvektor:
            <Umbruchformel
              tex={t`\overrightarrow{AB}=${spalte(a11.B)}-${spalte(a11.A)}=${spalte(a11.AB)}`}
              schmal={t`\begin{gathered}\overrightarrow{AB}\\{}=${spalte(a11.B)}-${spalte(a11.A)}\\{}=${spalte(a11.AB)}\end{gathered}`}
            />
          </>,
          <>
            Gleichung:
            <Umbruchformel tex={gl({ p: a11.A, u: a11.AB }, 's_{13}')} schmal={glSchmal({ p: a11.A, u: a11.AB }, 's_{13}')} />
            Probe: Für <Formel tex="t=1" /> erhältst du <Formel tex={punktTeX('', [0, 0, 2])} nach="," /> den Spurpunkt <Formel tex={t`S_3`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={koordinatenformTeX(a11.k.n, a11.k.d, 'E')} nach="." /> Die Spurgerade <Formel tex={t`s_{13}`} /> soll durch <Formel tex="A=S_1" /> und <Formel tex="B=S_3" /> beschrieben werden: <Formel tex={t`s_{13}:\ \vec{x}=\overrightarrow{OA}+t\cdot\overrightarrow{AB}`} nach="." /> Bestimme den Richtungsvektor <Formel tex={t`\overrightarrow{AB}`} nach="." />
        </p>
      </Aufgabe>

      <Zeichenaufgabe
        nummer="12"
        titel="Stellung nehmen"
        hilfe={
          <>
            <p>Mia hat nicht recht. Ein Gegenbeispiel genügt, hier sind drei:</p>
            <ul>
              <li>
                <Formel tex={koordinatenformTeX(A12.eins.n, A12.eins.d, 'E_1')} nach=":" /> Es gibt nur den Spurpunkt <Formel tex={t`S_3(0\,|\,0\,|\,2)`} nach="," /> denn bei <Formel tex={t`S_1`} /> und <Formel tex={t`S_2`} /> bleibt <Formel tex="0=2" nach="." />
              </li>
              <li>
                <Formel tex={koordinatenformTeX(A12.zwei.n, A12.zwei.d, 'E_2')} nach=":" /> Es gibt zwei Spurpunkte, bei <Formel tex={t`S_2`} /> bleibt <Formel tex="0=6" nach="." />
              </li>
              <li>
                <Formel tex={koordinatenformTeX(A12.achse.n, A12.achse.d, 'E_3')} nach=":" /> <Formel tex={t`S_1`} /> und <Formel tex={t`S_2`} /> sind beide der Ursprung. Die ganze <Formel tex="x_3" />-Achse liegt in der Ebene, es gibt dort keinen einzelnen Spurpunkt.
              </li>
            </ul>
            <p>Richtig ist: Eine Ebene hat höchstens drei Spurpunkte, und nur wenn sie keine Achse enthält oder parallel zu ihr ist, schneidet sie alle drei Achsen in je einem Punkt.</p>
          </>
        }
        kontrolle={
          <Kontrollschaubild>
            <Figur spec={kontrollBild(A12.eins)} unter={<><Formel tex={koordinatenformTeX(A12.eins.n, A12.eins.d, 'E_1')} nach=":" /> Ein Spurpunkt.</>} />
            <Figur spec={kontrollBild(A12.achse)} unter={<><Formel tex={koordinatenformTeX(A12.achse.n, A12.achse.d, 'E_3')} nach=":" /> Die <Formel tex="x_3" />-Achse liegt in der Ebene.</>} />
          </Kontrollschaubild>
        }
      >
        <p>
          Mia behauptet: „Jede Ebene hat genau drei Spurpunkte.“ Nimm Stellung und gib Gegenbeispiele an, wenn Mia nicht recht hat.
        </p>
        <details className="beobachtung">
          <summary>Sprachhilfe</summary>
          <div>
            <ul>
              <li>Mia hat (nicht) recht, denn …</li>
              <li>Richtig ist, dass … Aber daraus folgt nicht, dass …</li>
              <li>Ein Gegenbeispiel ist …</li>
              <li>Eine falsche Aussage wie <Formel tex="0=2" /> bedeutet, dass …</li>
              <li>Zusammenfassend gilt: …</li>
            </ul>
          </div>
        </details>
      </Zeichenaufgabe>
    </Abschnitt>
  );
}
