import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { ebeneAusGeraden, type Ebene } from '@/lib/ebene';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { aufgPunktGerade, aufgSchnitt, aufgZeichnen } from './Bilder';
import { A_AUSWAHL, A_AUSWAHL_GERADEN, A_KEINE_EINDEUTIG, A_PAARE, A_PARALLEL, A_PARAMETER_A, A_PUNKT_GERADE, A_SCHNITT, A_ZEICHNEN } from './daten';
import { gl, gleichungE, gleichungESchmal, glSchmal, punktTeX, spalte, termSpalte, verbindungSpalte } from './rechenhilfen';

const sp = spalte;
const koordFelder = (praefix: string, werte: number[], wort: string): Feld[] =>
  werte.map((x, i) => ({ id: `${praefix}${i + 1}`, name: `${i + 1}. Koordinate von ${wort}`, beschriftung: <>{i + 1}. Koordinate</>, erwartet: x }));
const eg = (e: Ebene) => t`${gleichungE(e)}`;
const egS = (e: Ebene) => t`${gleichungESchmal(e)}`;

export function Ueberpruefen() {
  const pg = A_PUNKT_GERADE;
  const au = A_AUSWAHL;
  const sc = A_SCHNITT;
  const ag = A_AUSWAHL_GERADEN;
  const pa = A_PARALLEL;
  const ke = A_KEINE_EINDEUTIG;
  const pr = A_PARAMETER_A;
  const ze = A_ZEICHNEN;
  const schnittEbene = ebeneAusGeraden(sc.paar.g, sc.paar.h).ebene!;
  const paarTeX = (p: { g: Parameters<typeof gl>[0]; h: Parameters<typeof gl>[0] }) => (
    <>
      <Formel tex={gl(p.g, 'g', 't')} nach="," /> <Formel tex={gl(p.h, 'h', 'k')} />
    </>
  );
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten. Die Parameterform und die Punktprobe stehen im Modul <Modulverweis modul="einfuehrung-ebenen">Einführung in Ebenen im Raum</Modulverweis>, das Lösen der Gleichungssysteme in <Modulverweis modul="gauss-algorithmus">Der Gauß-Algorithmus</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">
        Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma.
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Gerade und Punkt: der zweite Spannvektor"
        felder={koordFelder('v', pg.v, 'PQ')}
        hilfen={[
          <>Der Richtungsvektor der Geraden ist der erste Spannvektor. Der zweite Spannvektor führt vom Stützpunkt der Geraden zum Punkt <Formel tex="Q" nach="." /></>,
          <>Das ist der Verbindungsvektor <Formel tex={t`\overrightarrow{PQ}`} nach=":" /> Zielpunkt minus Ausgangspunkt.</>,
        ]}
        loesung={[
          <>
            <Umbruchformel
              tex={t`\overrightarrow{PQ}=${verbindungSpalte(pg.g.p, pg.Q)}=${sp(pg.v)}`}
              schmal={t`\begin{gathered}\overrightarrow{PQ}\\{}=${verbindungSpalte(pg.g.p, pg.Q)}\\{}=${sp(pg.v)}\end{gathered}`}
            />
          </>,
          <>
            Mit dem Stützpunkt <Formel tex="P" /> und dem Richtungsvektor von <Formel tex="g" /> lautet die Gleichung
            <Umbruchformel tex={eg({ p: pg.g.p, u: pg.g.u, v: pg.v })} schmal={egS({ p: pg.g.p, u: pg.g.u, v: pg.v })} />
          </>,
          <>
            Probe: Für <Formel tex={t`(r\,|\,s)=(0\,|\,1)`} /> erhältst du <Formel tex="Q" nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind die Gerade <Formel tex={gl(pg.g)} /> und der Punkt <Formel tex={punktTeX('Q', pg.Q)} nach="," /> der nicht auf <Formel tex="g" /> liegt. Bestimme den zweiten Spannvektor der Ebene, die <Formel tex="g" /> und <Formel tex="Q" /> enthält. Schreibe danach im Heft die Gleichung der Ebene auf.
        </p>
        <KontrollFigur spec={aufgPunktGerade} unter={<>Die Gerade <Formel tex="g" nach="," /> der Punkt <Formel tex="Q" /> und die Ebene durch beide. Der rosa Pfeil ist der zweite Spannvektor.</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="2"
        titel="Welche Gleichung beschreibt die Ebene durch g und Q?"
        optionen={platziere(
          [
            opt('a', <Formel tex={eg(au.richtig)} />, true, <>Richtig. Der Stützpunkt <Formel tex={punktTeX('P', au.g.p)} /> liegt auf <Formel tex="g" nach="," /> der erste Spannvektor ist der Richtungsvektor, der zweite der Verbindungsvektor <Formel tex={t`\overrightarrow{PQ}=${sp(au.richtig.v)}`} nach="." /></>),
            opt('b', <Formel tex={eg(au.ortsvektor)} />, false, <>Hier ist der Ortsvektor von <Formel tex="Q" /> als zweiter Spannvektor genommen worden. Er führt vom Ursprung zu <Formel tex="Q" nach="," /> nicht von <Formel tex="P" /> aus. Die Probe zeigt es: Für <Formel tex={t`(r\,|\,s)=(0\,|\,1)`} /> erhältst du <Formel tex={punktTeX('', [3, 4, -3])} nach="," /> nicht <Formel tex="Q" nach="." /></>),
            opt('c', <Formel tex={eg(au.kollinear)} />, false, <>Der zweite Spannvektor ist <Formel tex={t`-2`} /> mal der erste: <Formel tex={t`${sp(au.kollinear.v)}=-2\cdot${sp(au.g.u)}`} nach="." /> Die Spannvektoren sind kollinear, die Gleichung beschreibt nur die Gerade <Formel tex="g" nach="," /> und <Formel tex="Q" /> liegt nicht darauf.</>),
            opt('d', <Formel tex={eg(au.vorzeichen)} />, false, <>Der zweite Spannvektor hat in der dritten Koordinate einen Vorzeichenfehler: <Formel tex="-2-(-1)=-1" nach="," /> nicht 1. Die Probe zeigt es: Für <Formel tex={t`(r\,|\,s)=(0\,|\,1)`} /> erhältst du <Formel tex={punktTeX('', [3, 2, 0])} nach="," /> nicht <Formel tex="Q" nach="." /></>),
          ],
          1,
        )}
        erklaerung={
          <>
            Der Stützpunkt liegt auf <Formel tex="g" nach="," /> der erste Spannvektor ist der Richtungsvektor von <Formel tex="g" nach="," /> der zweite der Verbindungsvektor vom Stützpunkt zu <Formel tex="Q" nach="." /> Die Probe mit <Formel tex={t`(r\,|\,s)=(0\,|\,1)`} /> zeigt, ob <Formel tex="Q" /> herauskommt.
          </>
        }
      >
        <p>
          Gegeben sind <Formel tex={gl(au.g)} /> und der Punkt <Formel tex={punktTeX('Q', au.Q)} nach="," /> der nicht auf <Formel tex="g" /> liegt. Welche Gleichung beschreibt die Ebene, die <Formel tex="g" /> und <Formel tex="Q" /> enthält?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={3}
        titel="Sich schneidende Geraden"
        felder={koordFelder('s', sc.S, 'S')}
        hilfen={[
          <>Setze die beiden Geradengleichungen gleich und löse das Gleichungssystem (siehe <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>).</>,
          <>Du erhältst <Formel tex={t`t=${sc.t}`} /> und <Formel tex={t`k=${sc.s}`} nach="." /> Setze <Formel tex="t" /> in die Gleichung von <Formel tex="g" /> ein.</>,
        ]}
        loesung={[
          <>
            Das Gleichsetzen ergibt <Formel tex={t`t=${sc.t}`} /> und <Formel tex={t`k=${sc.s}`} nach="." />
          </>,
          <>
            Schnittpunkt:
            <Umbruchformel
              tex={t`\overrightarrow{OS}=${termSpalte(sc.paar.g, sc.t)}=${sp(sc.S)}`}
              schmal={t`\begin{gathered}\overrightarrow{OS}\\{}=${termSpalte(sc.paar.g, sc.t)}\\{}=${sp(sc.S)}\end{gathered}`}
            />
          </>,
          <>
            Probe mit <Formel tex="h" nach=":" />
            <Umbruchformel
              tex={t`\overrightarrow{OS}=${termSpalte(sc.paar.h, sc.s)}=${sp(sc.S)}`}
              schmal={t`\begin{gathered}\overrightarrow{OS}\\{}=${termSpalte(sc.paar.h, sc.s)}\\{}=${sp(sc.S)}\end{gathered}`}
            />
            Beide Geraden schneiden sich in <Formel tex={punktTeX('S', sc.S)} nach="," /> sie liegen also in einer gemeinsamen Ebene.
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={gl(sc.paar.g, 'g', 't')} /> und <Formel tex={gl(sc.paar.h, 'h', 'k')} nach="." /> Zeige, dass sich die Geraden schneiden, und bestimme den Schnittpunkt <Formel tex="S" nach="." />
        </p>
        <KontrollFigur spec={aufgSchnitt} unter={<>Die beiden Geraden und die Ebene, die beide enthält.</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="4"
        titel="Welche Gleichung beschreibt die Ebene durch g und h?"
        optionen={platziere(
          [
            opt('a', <Formel tex={eg(ag.richtig)} />, true, <>Richtig. Die Geraden aus Aufgabe 3 schneiden sich. Der Stützpunkt von <Formel tex="g" /> und die beiden Richtungsvektoren sind Spannvektoren, die keine Vielfachen voneinander sind.</>),
            opt('b', <Formel tex={eg(ag.ortsvektor)} />, false, <>Hier ist der Ortsvektor des Stützpunkts von <Formel tex="h" /> als zweiter Spannvektor genommen worden. Ein Ortsvektor führt vom Ursprung aus und liegt im Allgemeinen nicht in der Ebene.</>),
            opt('c', <Formel tex={eg(ag.kollinear)} />, false, <>Der zweite Spannvektor ist das Doppelte des ersten: <Formel tex={t`${sp(ag.kollinear.v)}=2\cdot${sp(ag.richtig.u)}`} nach="." /> Die Spannvektoren sind kollinear, es entsteht nur eine Gerade.</>),
            opt('d', <Formel tex={eg(ag.fehler)} />, false, <>Der zweite Spannvektor ist der Richtungsvektor von <Formel tex="h" /> mit einem Rechenfehler in der dritten Koordinate (3 statt 2). Der Vektor <Formel tex={t`${sp(ag.fehler.v)}`} /> liegt dann nicht in der Ebene. Als Spannvektor muss der Richtungsvektor <Formel tex={t`${sp(ag.richtig.v)}`} /> von <Formel tex="h" /> selbst stehen.</>),
          ],
          3,
        )}
        erklaerung={<>Bei sich schneidenden Geraden sind die beiden Richtungsvektoren die Spannvektoren, der Stützpunkt ist ein Punkt einer der beiden Geraden.</>}
      >
        <p>
          Gegeben sind die Geraden <Formel tex={gl(sc.paar.g, 'g', 't')} /> und <Formel tex={gl(sc.paar.h, 'h', 'k')} nach="," /> die sich schneiden. Welche Gleichung beschreibt die Ebene, die beide Geraden enthält?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={5}
        titel="Parallele Geraden: der zweite Spannvektor"
        felder={koordFelder('w', pa.HG, 'HG')}
        hilfen={[
          <>Die Richtungsvektoren sind Vielfache voneinander und liefern nur eine Richtung. Die zweite Richtung kommt von einem Verbindungsvektor zwischen den Geraden.</>,
          <>Nimm den Verbindungsvektor <Formel tex={t`\overrightarrow{HG}`} /> der beiden Stützpunkte <Formel tex="G" /> auf <Formel tex="g" /> und <Formel tex="H" /> auf <Formel tex="h" nach="." /></>,
        ]}
        loesung={[
          <>
            Es gilt <Formel tex={t`${sp(pa.paar.h.u)}=-2\cdot${sp(pa.paar.g.u)}`} nach="," /> die Geraden sind parallel. Der Punkt <Formel tex={punktTeX('H', pa.paar.h.p)} /> liegt nicht auf <Formel tex="g" nach="," /> sie sind verschieden.
          </>,
          <>
            <Umbruchformel
              tex={t`\overrightarrow{HG}=${verbindungSpalte(pa.paar.h.p, pa.paar.g.p)}=${sp(pa.HG)}`}
              schmal={t`\begin{gathered}\overrightarrow{HG}\\{}=${verbindungSpalte(pa.paar.h.p, pa.paar.g.p)}\\{}=${sp(pa.HG)}\end{gathered}`}
            />
          </>,
          <>
            Die Ebene hat zum Beispiel den Stützpunkt <Formel tex="G" nach="," /> den Richtungsvektor von <Formel tex="g" /> und <Formel tex={t`\overrightarrow{HG}`} /> als Spannvektoren. <Formel tex={t`\overrightarrow{HG}`} /> ist kein Vielfaches des Richtungsvektors, denn die zweiten Koordinaten passen nicht zu demselben Faktor.
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={gl(pa.paar.g, 'g', 't')} /> und <Formel tex={gl(pa.paar.h, 'h', 'k')} nach="." /> Die Geraden sind parallel und verschieden, <Formel tex={punktTeX('G', pa.paar.g.p)} /> liegt auf <Formel tex="g" /> und <Formel tex={punktTeX('H', pa.paar.h.p)} /> auf <Formel tex="h" nach="." /> Bestimme den Verbindungsvektor <Formel tex={t`\overrightarrow{HG}`} nach="," /> der neben dem Richtungsvektor von <Formel tex="g" /> als Spannvektor dienen kann.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="6"
        titel="Welche Geraden liegen in keiner gemeinsamen Ebene?"
        optionen={platziere(
          A_PAARE.paare.map((p, i) =>
            i === A_PAARE.windschief
              ? opt(`p${i}`, paarTeX(p), true, <>Richtig. Die Richtungsvektoren sind keine Vielfachen voneinander, und das Gleichungssystem zum Gleichsetzen hat keine Lösung. Die Geraden sind windschief.</>)
              : opt(
                  `p${i}`,
                  paarTeX(p),
                  false,
                  i === 0 ? <>Diese Geraden schneiden sich in <Formel tex={punktTeX('S', [2, 1, 1])} nach="," /> sie liegen in einer Ebene.</> : i === 2 ? <>Die Richtungsvektoren sind Vielfache voneinander und die Geraden verschieden: Sie sind parallel und liegen in einer Ebene.</> : <>Die Geraden sind identisch. Sie liegen in einer Ebene, sogar in unendlich vielen.</>,
                ),
          ),
          2,
        )}
        erklaerung={<>Nur windschiefe Geraden liegen in keiner gemeinsamen Ebene. Sich schneidende und parallele Geraden bestimmen eine Ebene, identische Geraden liegen in unendlich vielen.</>}
      >
        <p>Genau eines der Geradenpaare ist windschief. Welches?</p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="7"
        titel="Warum ist die Ebene nicht eindeutig?"
        optionen={platziere(
          [
            opt('a', <>Es gilt <Formel tex={t`\vec{u}=-\frac{1}{2}\cdot\vec{v}`} nach="," /> die Spannvektoren sind kollinear. Die Gleichung beschreibt nur eine Gerade durch <Formel tex="B" nach="," /> und durch eine Gerade gehen unendlich viele Ebenen.</>, true, <>Richtig. Ein Punkt und eine Richtung legen eine Gerade fest. Für eine Ebene fehlt eine zweite, nicht parallele Richtung oder ein Punkt außerhalb der Geraden.</>),
            opt('b', <>Der Punkt <Formel tex="B" /> ist nicht der Ursprung.</>, false, <>Der Stützpunkt darf jeder Punkt sein. Das Problem liegt bei den Vektoren.</>),
            opt('c', <>Eine Ebene braucht immer drei Vektoren.</>, false, <>Eine Ebene braucht zwei Spannvektoren, die keine Vielfachen voneinander sind, und einen Stützpunkt.</>),
            opt('d', <>Durch eine Gerade geht genau eine zweite Ebene.</>, false, <>Durch eine Gerade gehen unendlich viele Ebenen, wie sich eine Buchseite um die Buchkante drehen lässt.</>),
          ],
          0,
        )}
        erklaerung={<>Sind die Spannvektoren Vielfache voneinander, wirken die beiden Parameter wie einer und es entsteht eine Gerade. Dann ist die Ebene nicht festgelegt.</>}
      >
        <p>
          Gegeben sind der Punkt <Formel tex={punktTeX('B', ke.B)} /> und die Vektoren <Formel tex={t`\vec{v}=${sp(ke.v)}`} /> und <Formel tex={t`\vec{u}=${sp(ke.u)}`} nach="." /> Begründe, warum diese Angaben keine Ebene eindeutig festlegen.
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={8}
        titel="Ein Punkt mit Parameter"
        felder={[{ id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: pr.a }]}
        hilfen={[
          <>Stelle zuerst die Ebene durch <Formel tex="g" /> und <Formel tex="h" /> aus Aufgabe 3 auf. Die Spannvektoren sind die Richtungsvektoren.</>,
          <>Setze <Formel tex={t`Q(a\,|\,3\,|\,5)`} /> in die Gleichung ein. Die Gleichungen II und III enthalten kein <Formel tex="a" nach="." /> Berechne daraus <Formel tex="r" /> und <Formel tex="s" nach="," /> dann <Formel tex="a" /> aus Gleichung I.</>,
        ]}
        loesung={[
          <>
            Die Ebene:
            <Umbruchformel tex={eg(schnittEbene)} schmal={egS(schnittEbene)} />
          </>,
          <>
            Gleichungen II und III:
            <Umbruchformel tex={t`r+s=3,\ \ 2-r+2s=5`} schmal={t`\begin{gathered}r+s=3\\2-r+2s=5\end{gathered}`} />
            Aus der ersten folgt <Formel tex="r=3-s" nach="." /> In die zweite eingesetzt: <Formel tex="3s=6" nach="," /> also <Formel tex={t`s=${pr.s}`} /> und <Formel tex={t`r=${pr.r}`} nach="." />
          </>,
          <>
            Gleichung I:
            <Umbruchformel tex={t`a=-1+${pr.r}-${pr.s}=${pr.a}`} schmal={t`\begin{gathered}a=-1+${pr.r}-${pr.s}\\{}=${pr.a}\end{gathered}`} />
          </>,
        ]}
      >
        <p>
          Die Ebene <Formel tex="E" /> enthält die Geraden <Formel tex={gl(sc.paar.g, 'g', 't')} /> und <Formel tex={gl(sc.paar.h, 'h', 'k')} nach="." /> Der Punkt <Formel tex={t`Q(a\,|\,3\,|\,5)`} /> liegt in <Formel tex="E" nach="." /> Bestimme <Formel tex="a" nach="." />
        </p>
      </Aufgabe>

      <Zeichenaufgabe
        nummer="9"
        titel="Zwei parallele Geraden und ihre Ebene zeichnen"
        hilfe={
          <>
            Die Geraden sind parallel (gleicher Richtungsvektor) und verschieden. Der zweite Spannvektor ist
            <Umbruchformel tex={t`\overrightarrow{GH}=${sp(ze.v)}`} schmal={t`\begin{gathered}\overrightarrow{GH}\\{}=${sp(ze.v)}\end{gathered}`} />
            Zeichne die Punkte <Formel tex={punktTeX('G', ze.G)} /> und <Formel tex={punktTeX('H', ze.H)} /> wie in den Modulen zum Raum (jede Einheit auf der <Formel tex="x_1" />-Achse ist eine Kästchendiagonale nach links unten), dann beide Geraden durch diese Punkte mit dem Richtungsvektor <Formel tex={t`${sp(ze.paar.g.u)}`} nach="." /> Die Ebene ist der Streifen zwischen den Geraden und reicht über sie hinaus.
          </>
        }
        kontrolle={<KontrollFigur spec={aufgZeichnen} unter={<>Die parallelen Geraden <Formel tex="g" /> (schwarz) und <Formel tex="h" /> (orange) mit der Ebene, die beide enthält. Der rosa Pfeil ist der Verbindungsvektor <Formel tex={t`\overrightarrow{GH}`} nach="." /></>} />}
      >
        <p>
          Zeichne im Heft ein Schrägbild des Koordinatensystems (2 Kästchen je Einheit auf der <Formel tex="x_2" />- und der <Formel tex="x_3" />-Achse, eine Kästchendiagonale auf der <Formel tex="x_1" />-Achse). Trage die parallelen Geraden <Formel tex={gl(ze.paar.g, 'g', 't')} /> und <Formel tex={gl(ze.paar.h, 'h', 'k')} /> ein, bestimme den Verbindungsvektor <Formel tex={t`\overrightarrow{GH}`} /> und stelle die Gleichung der Ebene auf. Prüfe danach mit dem Kontrollschaubild.
        </p>
      </Zeichenaufgabe>
    </Abschnitt>
  );
}
