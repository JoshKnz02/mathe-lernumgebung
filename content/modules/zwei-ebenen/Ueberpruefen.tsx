import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { stufenform } from '@/lib/geradeebene';
import { matrixTeX } from '@/lib/lgs';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { gleichsetzMatrixEE } from '@/lib/zweiebenen';
import { aufg7, aufg8, aufg9 } from './Bilder';
import { A1, A2, A3, A4, A5, A6, A7, A8, E } from './daten';
import { ebeneZeilen, ebenenprobeZeilen, koordinatenformTeX, spalte } from './rechenhilfen';

type KF = { n: number[]; d: number };
const kf = (k: KF, name = 'E') => koordinatenformTeX(k.n, k.d, name);
const klein = (m: number[][]) => <Formel anzeige tex={`{${m[0]!.length >= 5 ? '\\scriptsize' : '\\footnotesize'} ${matrixTeX(m)}}`} />;

export function Ueberpruefen() {
  const a1m = [[...A1.e.n, A1.e.d], [...A1.f.n, A1.f.d]];
  const a1s = stufenform(a1m);
  const a3z = ebenenprobeZeilen(A3.e, A3.f);
  const a6m = gleichsetzMatrixEE(A6.q1, A6.q2);
  const a6s = stufenform(a6m);
  const a8m = [[...A8.d1.n, A8.d1.d], [...A8.d2.n, A8.d2.d]];
  const a8s = stufenform(a8m);
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Lage einer Geraden zu einer Ebene steht im Modul <Modulverweis modul="gerade-und-ebene">Gerade und Ebene</Modulverweis>, das Gauß-Verfahren im Modul <Modulverweis modul="gauss-algorithmus">Gauß-Algorithmus</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen.</Hinweis>

      <Aufgabe
        nummer={1}
        titel="Die Schnittgerade bestimmen"
        felder={[
          { id: 'a', name: 'Zahl a', beschriftung: <Formel tex="a" />, erwartet: A1.ergebnis.a },
          { id: 'b', name: 'Zahl b', beschriftung: <Formel tex="b" />, erwartet: A1.ergebnis.b },
          { id: 'c', name: 'Zahl c', beschriftung: <Formel tex="c" />, erwartet: A1.ergebnis.c },
          { id: 'd', name: 'Zahl d', beschriftung: <Formel tex="d" />, erwartet: A1.ergebnis.d },
        ]}
        hilfen={[
          <>Stelle die erweiterte Koeffizientenmatrix auf und bringe sie auf Zeilenstufenform. Es bleibt eine freie Unbekannte: Setze <Formel tex={t`x_3=t`} nach="." /></>,
          <>Löse die zweite Zeile nach <Formel tex="x_2" /> auf und setze das Ergebnis in die erste Zeile ein, um <Formel tex="x_1" /> zu bekommen.</>,
        ]}
        loesung={[
          <>Matrix und Zeilenstufenform: {klein(a1m)}{klein(a1s)}</>,
          <>
            Zweite Zeile mit <Formel tex={t`x_3=t`} nach=":" />
            <Umbruchformel tex={t`x_2-3t=-1\Rightarrow x_2=-1+3t`} schmal={t`\begin{gathered}x_2-3t=-1\\x_2=-1+3t\end{gathered}`} />
          </>,
          <>
            Erste Zeile:
            <Umbruchformel tex={t`x_1+(-1+3t)+2t=4\Rightarrow x_1=5-5t`} schmal={t`\begin{gathered}x_1-1+3t+2t=4\\x_1+5t=5\\x_1=5-5t\end{gathered}`} />
          </>,
        ]}
      >
        <p>
          Die Ebenen <Formel tex={kf(A1.e, 'E_1')} /> und <Formel tex={kf(A1.f, 'F_1')} /> schneiden sich. Setze <Formel tex={t`x_3=t`} /> und schreibe die Schnittgerade in der Form <Formel tex={t`x_1=a+b\,t`} nach="," /> <Formel tex={t`x_2=c+d\,t`} nach="," /> <Formel tex={t`x_3=t`} nach="." /> Bestimme <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" nach="." />
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="2"
        titel="Die Lage aus den Gleichungen lesen"
        optionen={platziere(
          [
            opt('a', <>Die Ebenen sind echt parallel, weil die Normalenvektoren Vielfache voneinander sind.</>, false, <>Vielfache Normalenvektoren heißen parallel oder identisch. Hier ist auch <Formel tex="d" /> mit demselben Faktor vervielfacht: <Formel tex={t`-2\cdot 5=-10`} nach="." /> Die Ebenen liegen aufeinander.</>),
            opt('b', <>Die Ebenen schneiden sich in einer Geraden.</>, false, <>Dann dürften die Normalenvektoren keine Vielfachen sein. Hier ist <Formel tex={t`\vec{n}_F=-2\cdot\vec{n}_E`} nach="." /></>),
            opt('c', <>Die Ebenen sind identisch.</>, true, <>Richtig. <Formel tex={t`\vec{n}_F=-2\cdot\vec{n}_E`} /> und <Formel tex={t`d_F=-2\cdot d_E`} nach="." /> Die zweite Gleichung ist das <Formel tex="-2" />-Fache der ersten.</>),
            opt('d', <>Die Ebenen haben genau einen gemeinsamen Punkt.</>, false, <>Das gibt es bei zwei Ebenen nie: Entweder haben sie keinen, eine ganze Gerade oder alle Punkte gemeinsam.</>),
          ],
          2,
        )}
        erklaerung={<>Bei vielfachen Normalenvektoren vergleichst du <Formel tex="d" nach=":" /> Wird es mit demselben Faktor vervielfacht, sind die Ebenen identisch, sonst echt parallel.</>}
      >
        <p>
          Welche Aussage über <Formel tex={kf(A2.e, 'E')} /> und <Formel tex={kf(A2.f, 'F')} /> stimmt?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={3}
        titel="Die Ebenenprobe"
        felder={[
          { id: 'alpha', name: 'Zahl alpha', beschriftung: <Formel tex={t`\alpha`} />, erwartet: A3.alpha },
          { id: 'beta', name: 'Zahl beta', beschriftung: <Formel tex={t`\beta`} />, erwartet: A3.beta },
        ]}
        hilfen={[
          <>Schreibe die Parameterform zeilenweise und setze sie in die Koordinatenform von <Formel tex="F" /> ein.</>,
          <>Fasse zusammen und löse die Gleichung nach <Formel tex="r" /> auf. Es entsteht <Formel tex={t`r=\alpha+\beta\,s`} nach="." /></>,
        ]}
        loesung={[
          <>
            Zeilenweise:
            <Umbruchformel tex={ebeneZeilen(A3.e).join(t`,\quad `)} schmal={t`\begin{gathered}${ebeneZeilen(A3.e).join('\\\\')}\end{gathered}`} />
          </>,
          <>
            Einsetzen:
            <Umbruchformel tex={a3z.tex} schmal={a3z.schmal} />
          </>,
          <>
            Aus <Formel tex={a3z.gleichung} /> folgt <Formel tex={t`r=${A3.alpha}${A3.beta < 0 ? '-' : '+'}${Math.abs(A3.beta) === 1 ? '' : Math.abs(A3.beta)}s`} nach="." /> Die Ebenen schneiden sich.
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`E:\ \vec{x}=${spalte(A3.e.p)}+r\cdot${spalte(A3.e.u)}+s\cdot${spalte(A3.e.v)}`} /> und <Formel tex={kf(A3.f, 'F')} nach="." /> Die Ebenenprobe liefert eine Gleichung, die du nach <Formel tex="r" /> auflösen kannst. Schreibe sie als <Formel tex={t`r=\alpha+\beta\,s`} /> und bestimme <Formel tex={t`\alpha`} /> und <Formel tex={t`\beta`} nach="." />
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="4"
        titel="Parallel oder identisch?"
        optionen={platziere(
          [
            opt('a', <>Die Ebenen sind echt parallel.</>, true, <>Richtig. <Formel tex={t`\vec{n}_E=3\cdot\vec{n}_F`} nach="," /> aber <Formel tex={t`3\cdot 2=6\ne 9`} nach="." /> Die Zahl <Formel tex="d" /> passt nicht zum Faktor.</>),
            opt('b', <>Die Ebenen sind identisch, weil die Normalenvektoren Vielfache sind.</>, false, <>Vielfache Normalenvektoren reichen nicht, auch <Formel tex="d" /> muss mit demselben Faktor vervielfacht sein: <Formel tex={t`3\cdot 2=6`} nach="," /> nicht <Formel tex="9" nach="." /></>),
            opt('c', <>Die Ebenen schneiden sich in einer Geraden.</>, false, <>Bei vielfachen Normalenvektoren schneiden sich die Ebenen nie, sie sind gleich geneigt.</>),
            opt('d', <>Die Ebenen sind identisch, weil beide durch den Ursprung gehen.</>, false, <>Keine der beiden Ebenen geht durch den Ursprung, denn <Formel tex="d\ne 0" nach="." /></>),
          ],
          0,
        )}
        erklaerung={<>Ein Punkt von <Formel tex={t`F_4`} /> in <Formel tex={t`E_4`} /> eingesetzt entscheidet ebenfalls: <Formel tex={t`(2\,|\,0\,|\,0)`} /> liegt in <Formel tex={t`F_4`} nach="," /> aber <Formel tex={t`3\cdot 2=6\ne 9`} /> zeigt, dass er nicht in <Formel tex={t`E_4`} /> liegt.</>}
      >
        <p>
          Wie liegen <Formel tex={kf(A4.e, 'E_4')} /> und <Formel tex={kf(A4.f, 'F_4')} /> zueinander?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={5}
        titel="Ein Parameter in der Ebenengleichung"
        felder={[{ id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: A5.a }]}
        hilfen={[
          <>Die Ebenen sind parallel oder identisch, wenn die Normalenvektoren Vielfache voneinander sind. Vergleiche die Koordinaten von <Formel tex={t`(a\,|\,-2\,|\,4)`} /> mit <Formel tex={t`\vec{n}_E=(2\,|\,-1\,|\,2)`} nach="." /></>,
          <>Die Koordinaten ohne Parameter bestimmen den Faktor. Dann folgt <Formel tex="a" nach="." /></>,
        ]}
        loesung={[
          <>
            Faktor: <Formel tex={t`-2=2\cdot(-1)`} /> und <Formel tex={t`4=2\cdot 2`} nach="," /> also <Formel tex={t`\vec{n}_F=2\cdot\vec{n}_E`} nach="." />
          </>,
          <>
            Erste Koordinate: <Formel tex={t`a=2\cdot 2=${A5.a}`} nach="." />
          </>,
          <>
            Prüfe <Formel tex="d" nach=":" /> <Formel tex={t`2\cdot ${E.d}=4\ne ${A5.d}`} nach="." /> Die Ebenen sind echt parallel.
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={kf(E, 'E')} /> und <Formel tex={t`F_a:\ a\,x_1-2x_2+4x_3=${A5.d}`} nach="." /> Für welchen Wert von <Formel tex="a" /> sind die Ebenen echt parallel?
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="6"
        titel="Gleichsetzen deuten"
        optionen={platziere(
          [
            opt('a', <>Die Ebenen sind identisch.</>, false, <>Identisch wären sie bei zwei freien Unbekannten, also bei nur zwei Pivots. Hier hat jede der drei Zeilen einen Pivot.</>),
            opt('b', <>Die Ebenen sind echt parallel.</>, false, <>Echt parallel gäbe einen Widerspruch (<Formel tex={t`0\ 0\ 0\ 0\ |\ c`} /> mit <Formel tex={t`c\ne 0`} nach=")." /> Das steht hier nicht.</>),
            opt('c', <>Die Ebenen haben genau einen gemeinsamen Punkt.</>, false, <>Einen einzelnen gemeinsamen Punkt gibt es bei zwei Ebenen nie. Bei vier Unbekannten und drei Pivots bleibt eine Unbekannte frei.</>),
            opt('d', <>Die Ebenen schneiden sich in einer Geraden.</>, true, <>Richtig. Drei Pivots bei vier Unbekannten: eine freie Unbekannte, also unendlich viele Lösungen, die auf einer Geraden liegen.</>),
          ],
          3,
        )}
        erklaerung={<>Beim Gleichsetzen zweier Parameterformen entscheidet die Zahl der freien Unbekannten: eine heißt Schnittgerade, zwei heißen identisch, ein Widerspruch heißt echt parallel.</>}
      >
        <p>
          Die Ebenen <Formel tex={t`Q_1:\ \vec{x}=${spalte(A6.q1.p)}+r_1\cdot${spalte(A6.q1.u)}+s_1\cdot${spalte(A6.q1.v)}`} /> und <Formel tex={t`Q_2:\ \vec{x}=${spalte(A6.q2.p)}+r_2\cdot${spalte(A6.q2.u)}+s_2\cdot${spalte(A6.q2.v)}`} /> werden gleichgesetzt (Spalten <Formel tex={t`r_1`} nach="," /> <Formel tex={t`s_1`} nach="," /> <Formel tex={t`r_2`} nach="," /> <Formel tex={t`s_2`} nach=")." /> Die Zeilenstufenform lautet
        </p>
        {klein(a6s)}
        <p>Welche Aussage über die Lage stimmt?</p>
      </Auswahlfrage>

      <Zeichenaufgabe
        nummer="7"
        titel="Ebenen mit gegebener Lage angeben"
        hilfe={
          <>
            <p>
              Der Normalenvektor von <Formel tex="E" /> ist <Formel tex={t`\vec{n}=${spalte(E.n)}`} nach="." />
            </p>
            <p>
              Echt parallel durch <Formel tex={t`P(${A7.P.join('\\,|\\,')})`} nach=":" /> Gleicher Normalenvektor, <Formel tex={t`d=\vec{n}\cdot\vec{p}=2\cdot 1-1+2\cdot 2=${A7.par.d}`} nach="." /> Die Ebene <Formel tex={kf(A7.par, 'F')} /> ist echt parallel zu <Formel tex="E" nach="," /> denn <Formel tex={t`${A7.par.d}\ne ${E.d}`} nach="." />
            </p>
            <p>
              Identisch: Multipliziere die ganze Gleichung von <Formel tex="E" /> mit einer Zahl ungleich 0, zum Beispiel mit 3: <Formel tex={koordinatenformTeX([6, -3, 6], 6)} nach="." />
            </p>
            <p>
              Schneidend: Wähle einen Normalenvektor, der kein Vielfaches von <Formel tex={t`\vec{n}`} /> ist, zum Beispiel <Formel tex={t`(1\,|\,1\,|\,1)`} nach="," /> und eine beliebige Zahl <Formel tex="d" nach="," /> etwa <Formel tex={koordinatenformTeX([1, 1, 1], 1)} nach="." /> Es gibt unendlich viele Lösungen für „identisch“ (jedes Vielfache) und „schneidend“, aber nur eine für „echt parallel durch <Formel tex="P" nach="“." />
            </p>
          </>
        }
        kontrolle={<KontrollFigur oben spec={aufg7} unter={<>Die Ebene <Formel tex="E" /> (grau) und die echt parallele Ebene durch <Formel tex="P" /> (orange berandet).</>} />}
      >
        <p>
          Gegeben sind <Formel tex={kf(E, 'E')} /> und der Punkt <Formel tex={t`P(${A7.P.join('\\,|\\,')})`} nach="." /> Gib eine Ebene durch <Formel tex="P" /> an, die zu <Formel tex="E" /> echt parallel ist. Gib außerdem eine Ebene an, die zu <Formel tex="E" /> identisch ist, und eine, die <Formel tex="E" /> schneidet. Gibt es jeweils nur eine Lösung? Begründe.
        </p>
      </Zeichenaufgabe>

      <Aufgabe
        nummer={8}
        titel="Zwei Dachflächen"
        felder={A8.punkt.map((x, i) => ({ id: `p${i + 1}`, name: `${i + 1}. Koordinate des Punkts P`, beschriftung: <>{i + 1}. Koordinate von <Formel tex="P" /></>, erwartet: x }))}
        hilfen={[
          <>Der First ist die Schnittgerade der beiden Dachebenen. Stelle die Koeffizientenmatrix auf und bringe sie auf Zeilenstufenform.</>,
          <>Aus der zweiten Zeile folgt <Formel tex="x_2" nach="." /> Setze <Formel tex={t`x_3=2`} /> und berechne <Formel tex="x_1" nach="." /></>,
        ]}
        loesung={[
          <>Matrix und Zeilenstufenform: {klein(a8m)}{klein(a8s)}</>,
          <>
            Die zweite Zeile ergibt <Formel tex="x_2=0" nach="." /> Mit <Formel tex={t`x_3=2`} /> folgt aus der ersten Zeile
            <Umbruchformel tex={t`x_1+0+2\cdot 2=6\Rightarrow x_1=2`} schmal={t`\begin{gathered}x_1+0+4=6\\x_1=2\end{gathered}`} />
          </>,
          <>
            Der Punkt ist <Formel tex={t`P(${A8.punkt.join('\\,|\\,')})`} nach="." />
          </>,
        ]}
      >
        <p>
          Zwei Dachflächen eines Hauses liegen in den Ebenen <Formel tex={kf(A8.d1, 'D_1')} /> und <Formel tex={kf(A8.d2, 'D_2')} nach="." /> (Eine Einheit entspricht einem Meter.) Der First ist die Schnittgerade der beiden Ebenen. In welchem Punkt <Formel tex="P" /> des Firsts ist die Höhe <Formel tex={t`x_3=2`} nach="?" />
        </p>
        <KontrollFigur oben spec={aufg8} unter={<>Die Dachflächen <Formel tex={t`D_1`} /> (grau) und <Formel tex={t`D_2`} /> (orange berandet) mit dem First <Formel tex="s" /> und dem Punkt <Formel tex="P" nach="." /></>} />
      </Aufgabe>

      <Zeichenaufgabe
        nummer="9"
        titel="Stellung nehmen"
        hilfe={
          <>
            <p>
              Tim hat nicht recht. Ein Gegenbeispiel genügt: <Formel tex={kf(E, 'E')} /> und <Formel tex={t`H:\ ${koordinatenformTeX([-4, 2, -4], -4)}`} /> haben vielfache Normalenvektoren (<Formel tex={t`\vec{n}_H=-2\cdot\vec{n}_E`} nach=")." /> Aber <Formel tex={t`d_H=-4=-2\cdot 2=-2\cdot d_E`} nach="," /> die Ebenen sind identisch, nicht echt parallel.
            </p>
            <p>
              Richtig ist: Vielfache Normalenvektoren heißen parallel oder identisch. Nur wenn <Formel tex="d" /> nicht mit demselben Faktor vervielfacht wird, sind die Ebenen echt parallel.
            </p>
          </>
        }
        kontrolle={<KontrollFigur oben spec={aufg9} unter={<><Formel tex="E" /> und <Formel tex="H" /> haben vielfache Normalenvektoren und sind identisch.</>} />}
      >
        <p>
          Tim behauptet: „Wenn die Normalenvektoren zweier Ebenen Vielfache voneinander sind, dann sind die Ebenen echt parallel.“ Nimm Stellung und gib ein Gegenbeispiel an, wenn Tim nicht recht hat.
        </p>
        <details className="beobachtung">
          <summary>Sprachhilfe</summary>
          <div>
            <ul>
              <li>Tim hat (nicht) recht, denn …</li>
              <li>Richtig ist, dass … Aber daraus folgt nicht, dass …</li>
              <li>Ein Gegenbeispiel ist …</li>
            </ul>
          </div>
        </details>
      </Zeichenaufgabe>

      <Auswahlfrage
        nummer="10"
        titel="Gemeinsame Punkte zweier Ebenen"
        optionen={platziere(
          [
            opt('a', <>Zwei Ebenen können genau einen gemeinsamen Punkt haben.</>, false, <>Haben zwei Ebenen einen gemeinsamen Punkt, haben sie schon eine ganze Gerade gemeinsam (oder sind identisch). Beim Gleichsetzen bleibt immer mindestens eine Unbekannte frei.</>),
            opt('b', <>Zwei Ebenen haben keinen gemeinsamen Punkt, genau eine gemeinsame Gerade oder alle Punkte gemeinsam.</>, true, <>Richtig. Das sind die drei Fälle echt parallel, schneiden sich und identisch.</>),
            opt('c', <>Zwei Ebenen mit verschiedenen Normalenvektoren haben keinen gemeinsamen Punkt.</>, false, <>Gerade dann schneiden sie sich: Bei Normalenvektoren, die keine Vielfachen sind, gibt es immer eine Schnittgerade.</>),
            opt('d', <>Zwei Ebenen durch den Ursprung sind immer identisch.</>, false, <>Beide enthalten den Ursprung, schneiden sich also mindestens dort. Sind die Normalenvektoren keine Vielfachen, ist die Schnittgerade eine Gerade durch den Ursprung.</>),
          ],
          1,
        )}
        erklaerung={<>Zwei Ebenen im Raum haben nie einen einzelnen gemeinsamen Punkt, denn jede Ebenengleichung legt nur eine Bedingung fest und lässt eine Richtung frei.</>}
      >
        <p>Welche Aussage über die gemeinsamen Punkte zweier Ebenen im Raum stimmt?</p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
