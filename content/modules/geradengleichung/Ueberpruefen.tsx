import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { aufgRichtung, aufgZeichnen } from './Bilder';
import {
  A_AUSWAHL_PUNKTE,
  A_DIESELBE,
  A_DROHNE,
  A_GLEICHUNG,
  A_KEIN_A,
  A_PARAMETER_A,
  A_PARAMETER_T,
  A_PUNKT,
  A_PUNKTPROBE,
  A_RICHTUNG,
  A_ZEICHNEN,
  A_ZWEI_PARAMETER,
} from './daten';
import { punktRechnung, punktTeX } from './rechenhilfen';

const sp = (v: number[]) => spalte(v);
const koordFelder = (praefix: string, werte: number[], wort: string): Feld[] =>
  werte.map((x, i) => ({ id: `${praefix}${i + 1}`, name: `${i + 1}. Koordinate von ${wort}`, beschriftung: <>{i + 1}. Koordinate</>, erwartet: x }));
/** Gleichung einer Geraden in TeX. */
const gl = (p: number[], u: number[], par = 't') => t`\vec{x}=${sp(p)}+${par}\cdot${sp(u)}`;
const glSchmal = (p: number[], u: number[], name = 'g') => t`\begin{gathered}${name}:\ \vec{x}=${sp(p)}\\{}+t\cdot${sp(u)}\end{gathered}`;
const glBreit = (p: number[], u: number[], name = 'g') => t`${name}:\ \vec{x}=${sp(p)}+t\cdot${sp(u)}`;

export function Ueberpruefen() {
  const r = A_RICHTUNG;
  const gl2 = A_GLEICHUNG;
  const pu = A_PUNKT;
  const pt = A_PARAMETER_T;
  const zp = A_ZWEI_PARAMETER;
  const pp = A_PUNKTPROBE;
  const ap = A_AUSWAHL_PUNKTE;
  const pa = A_PARAMETER_A;
  const ka = A_KEIN_A;
  const di = A_DIESELBE;
  const dr = A_DROHNE;
  const ze = A_ZEICHNEN;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten. Das Rechnen mit Verbindungsvektoren steht im Modul <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">
        Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma.
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Den Richtungsvektor bestimmen"
        felder={koordFelder('u', r.u, 'AB')}
        hilfen={[
          <>Der Richtungsvektor ist der Verbindungsvektor von <Formel tex="A" /> nach <Formel tex="B" nach="." /> Zielpunkt minus Ausgangspunkt.</>,
          <>Subtrahiere Koordinate für Koordinate: erste Koordinate von <Formel tex="B" /> minus erste Koordinate von <Formel tex="A" nach="," /> und so weiter.</>,
        ]}
        loesung={[
          <>
            <Umbruchformel
              tex={t`\overrightarrow{AB}=\begin{pmatrix}1-3\\1-(-2)\\-1-1\end{pmatrix}=${sp(r.u)}`}
              schmal={t`\begin{gathered}\overrightarrow{AB}\\{}=\begin{pmatrix}1-3\\1-(-2)\\-1-1\end{pmatrix}\\{}=${sp(r.u)}\end{gathered}`}
            />
          </>,
          <>
            Mit dem Stützpunkt <Formel tex="A" /> lautet die Gleichung
            <Umbruchformel tex={glBreit(r.A, r.u)} schmal={glSchmal(r.A, r.u)} />
          </>,
          <>
            Probe: Für <Formel tex="t=1" /> muss der Punkt <Formel tex="B" /> herauskommen.
            <Umbruchformel tex={punktRechnung({ p: r.A, u: r.u }, 1).tex} schmal={punktRechnung({ p: r.A, u: r.u }, 1).schmal} />
          </>,
        ]}
      >
        <p>
          Die Gerade <Formel tex="g" /> geht durch <Formel tex={punktTeX('A', r.A)} /> und <Formel tex={punktTeX('B', r.B)} nach="." /> Bestimme den Richtungsvektor <Formel tex={t`\overrightarrow{AB}`} nach="." /> Schreibe danach im Heft die Gleichung von <Formel tex="g" /> mit dem Stützpunkt <Formel tex="A" /> auf.
        </p>
        <KontrollFigur spec={aufgRichtung} unter={<>Die Gerade durch <Formel tex="A" /> und <Formel tex="B" /> mit dem Richtungsvektor <Formel tex={t`\overrightarrow{AB}`} /> (blau).</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="2"
        titel="Welche Gleichung beschreibt die Gerade?"
        optionen={platziere(
          [
            opt('a', <Formel tex={gl(gl2.richtig.p, gl2.richtig.u)} />, true, <>Richtig. Der Stützpunkt <Formel tex={punktTeX('B', gl2.B)} /> gehört zur Geraden, und <Formel tex={t`\overrightarrow{BA}=${sp(gl2.richtig.u)}`} /> ist ein Richtungsvektor. Es ist <Formel tex={t`\overrightarrow{BA}=-\overrightarrow{AB}`} nach="," /> die Gleichung beschreibt also dieselbe Gerade wie die mit Stützpunkt <Formel tex="A" nach="." /></>),
            opt('b', <Formel tex={gl(gl2.ortsvektor.p, gl2.ortsvektor.u)} />, false, <>Hier ist der Ortsvektor von <Formel tex="B" /> als Richtungsvektor genommen worden. Er zeigt vom Ursprung nach <Formel tex="B" nach="." /> Die Richtung der Geraden gibt aber der Verbindungsvektor von <Formel tex="A" /> nach <Formel tex="B" /> an. Die Probe zeigt es: Für <Formel tex="t=1" /> erhältst du <Formel tex={t`(5\,|\,2\,|\,2)`} nach="," /> nicht <Formel tex="B" nach="." /></>),
            opt('c', <Formel tex={gl(gl2.summe.p, gl2.summe.u)} />, false, <>Hier wurden die Ortsvektoren von <Formel tex="A" /> und <Formel tex="B" /> addiert. Die Summe ist kein Richtungsvektor der Geraden. Die Probe zeigt es: Für <Formel tex="t=1" /> erhältst du <Formel tex={t`(6\,|\,4\,|\,1)`} nach="," /> nicht <Formel tex="B" nach="." /></>),
            opt('d', <Formel tex={gl(gl2.vorzeichen.p, gl2.vorzeichen.u)} />, false, <>Der Richtungsvektor hat in der zweiten Koordinate einen Vorzeichenfehler: <Formel tex="0-2=-2" nach="," /> nicht 2. Die Probe zeigt es: Für <Formel tex="t=1" /> erhältst du <Formel tex={t`(4\,|\,4\,|\,3)`} nach="," /> nicht <Formel tex="B" nach="." /></>),
          ],
          2,
        )}
        erklaerung={
          <>
            Der Richtungsvektor ist ein Verbindungsvektor der beiden Punkte, <Formel tex={t`\overrightarrow{AB}=${sp(gl2.ab)}`} /> oder sein Gegenvektor. Als Stützpunkt kannst du <Formel tex="A" /> oder <Formel tex="B" /> nehmen. Die Probe mit <Formel tex="t=1" /> zeigt jeweils, ob der zweite Punkt herauskommt.
          </>
        }
      >
        <p>
          Welche Gleichung beschreibt die Gerade durch <Formel tex={punktTeX('A', gl2.A)} /> und <Formel tex={punktTeX('B', gl2.B)} nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={3}
        titel="Einen Punkt zu einem Parameter berechnen"
        felder={koordFelder('x', pu.X, 'X')}
        hilfen={[<>Setze <Formel tex="t=-2" /> in die Gleichung ein. Eine negative Zahl schreibst du in Klammern.</>, <>Rechne jede Koordinate einzeln: Stützvektor plus <Formel tex="-2" /> mal Richtungsvektor.</>]}
        loesung={[
          <>
            <Umbruchformel tex={punktRechnung(pu.g, pu.t).tex} schmal={punktRechnung(pu.g, pu.t).schmal} />
          </>,
          <>
            Der Punkt ist <Formel tex={punktTeX('X', pu.X)} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={glBreit(pu.g.p, pu.g.u)} nach="." /> Berechne den Punkt <Formel tex="X" /> von <Formel tex="g" /> zum Parameter <Formel tex="t=-2" nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={4}
        titel="Parameter und Punkt bestimmen"
        felder={[
          { id: 't', name: 'Parameter t für R', beschriftung: <>a) Parameter <Formel tex="t" /></>, erwartet: pt.t },
          { id: 'x1', name: '1. Koordinate des Punkts', beschriftung: <>b) 1. Koordinate</>, erwartet: pt.punkt[0]! },
          { id: 'x2', name: '2. Koordinate des Punkts', beschriftung: <>b) 2. Koordinate</>, erwartet: pt.punkt[1]! },
        ]}
        hilfen={[
          <>a) Setze die erste Koordinate von <Formel tex="R" /> gleich der ersten Koordinate der Geraden und löse nach <Formel tex="t" nach="." /></>,
          <>b) Die dritte Gleichung enthält nur <Formel tex="t" nach="." /> Setze die dritte Koordinate gleich 7. Berechne mit dem Wert von <Formel tex="t" /> die übrigen Koordinaten.</>,
        ]}
        loesung={[
          <>
            a) Erste Koordinate:
            <Umbruchformel tex={t`-2=2-t\Rightarrow t=4`} schmal={t`\begin{gathered}-2=2-t\\{}\Rightarrow t=4\end{gathered}`} />
          </>,
          <>
            Probe mit der zweiten und dritten Koordinate:
            <Umbruchformel tex={t`-1+3\cdot 4=11,\ \ 3+2\cdot 4=11`} schmal={t`\begin{gathered}-1+3\cdot 4=11\\3+2\cdot 4=11\end{gathered}`} />
            Beide stimmen, <Formel tex="R" /> liegt auf <Formel tex="g" /> für <Formel tex="t=4" nach="." />
          </>,
          <>
            b) Dritte Koordinate:
            <Umbruchformel tex={t`3+2t=7\Rightarrow t=2`} schmal={t`\begin{gathered}3+2t=7\\{}\Rightarrow t=2\end{gathered}`} />
          </>,
          <>
            Die ersten beiden Koordinaten für <Formel tex="t=2" nach=":" />
            <Umbruchformel tex={t`\begin{pmatrix}2-2\\-1+3\cdot 2\end{pmatrix}=\begin{pmatrix}0\\5\end{pmatrix}`} schmal={t`\begin{gathered}\begin{pmatrix}2-2\\-1+6\end{pmatrix}\\{}=\begin{pmatrix}0\\5\end{pmatrix}\end{gathered}`} />
            Der Punkt ist <Formel tex={punktTeX('X', pt.punkt)} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben ist die Gerade <Formel tex="g" /> aus Aufgabe 3. a) Für welchen Wert von <Formel tex="t" /> erhältst du den Punkt <Formel tex={punktTeX('R', pt.R)} nach="?" /> b) Welcher Punkt von <Formel tex="g" /> hat die dritte Koordinate 7? Gib seine ersten beiden Koordinaten an.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={5}
        titel="Zwei Punkte zu zwei Parametern"
        felder={koordFelder('x', zp.X, 'X')}
        hilfen={[<>Der Richtungsvektor ist <Formel tex={t`\overrightarrow{AB}`} nach="." /> Stelle die Gleichung mit dem Stützpunkt <Formel tex="A" /> auf.</>, <>Setze <Formel tex="t=3" /> ein.</>]}
        loesung={[
          <>
            <Umbruchformel tex={t`\vec{u}=\overrightarrow{AB}=${sp(zp.u)}`} schmal={t`\begin{gathered}\vec{u}=\overrightarrow{AB}\\{}=${sp(zp.u)}\end{gathered}`} />
          </>,
          <>
            Die Gleichung ist
            <Umbruchformel tex={glBreit(zp.A, zp.u)} schmal={glSchmal(zp.A, zp.u)} />
          </>,
          <>
            Für <Formel tex="t=3" nach=":" />
            <Umbruchformel tex={punktRechnung({ p: zp.A, u: zp.u }, 3).tex} schmal={punktRechnung({ p: zp.A, u: zp.u }, 3).schmal} />
          </>,
        ]}
      >
        <p>
          Eine Gerade <Formel tex="g" /> geht für <Formel tex="t=0" /> durch <Formel tex={punktTeX('A', zp.A)} /> und für <Formel tex="t=1" /> durch <Formel tex={punktTeX('B', zp.B)} nach="." /> Welchen Punkt erhältst du für <Formel tex="t=3" nach="?" />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={6}
        titel="Punktprobe"
        felder={[
          { id: 't', name: 'Parameter t aus der ersten Gleichung', beschriftung: <>Parameter <Formel tex="t" /> aus der 1. Gleichung</>, erwartet: pp.t },
          { id: 'x3', name: '3. Koordinate des Punkts der Geraden für diesen Parameter', beschriftung: <>3. Koordinate von <Formel tex="g" /> für dieses <Formel tex="t" /></>, erwartet: pp.x3 },
        ]}
        hilfen={[<>Die erste Gleichung ist <Formel tex="5=1+2t" nach="." /></>, <>Setze den Wert von <Formel tex="t" /> in die dritte Zeile der Gleichung ein und vergleiche mit der dritten Koordinate von <Formel tex="C" nach="." /></>]}
        loesung={[
          <>
            Erste Koordinate:
            <Umbruchformel tex={t`5=1+2t\Rightarrow t=2`} schmal={t`\begin{gathered}5=1+2t\\{}\Rightarrow t=2\end{gathered}`} />
          </>,
          <>
            Zweite Koordinate:
            <Umbruchformel tex={t`2=0+2\cdot 1`} schmal={t`\begin{gathered}2=0+2\cdot 1\end{gathered}`} />
            Das stimmt.
          </>,
          <>
            Dritte Koordinate:
            <Umbruchformel tex={t`2+2\cdot(-1)=0`} schmal={t`\begin{gathered}2+2\cdot(-1)\\{}=0\end{gathered}`} />
            Aber <Formel tex="C" /> hat die dritte Koordinate 1, und <Formel tex="0\ne 1" nach="." /> <Formel tex="C" /> liegt nicht auf <Formel tex="g" nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={glBreit(pp.g.p, pp.g.u)} nach="." /> Prüfe, ob <Formel tex={punktTeX('C', pp.C)} /> auf <Formel tex="g" /> liegt. Berechne <Formel tex="t" /> aus der ersten Gleichung und vergleiche dann die dritte Koordinate.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="7"
        titel="Welche Punkte liegen auf der Geraden?"
        optionen={platziere(
          [
            opt('a', <>nur <Formel tex="P_1" /> und <Formel tex="P_4" /></>, true, <>Richtig. <Formel tex="P_2" /> hat die erste Koordinate 0 statt <Formel tex="-1" nach="," /> <Formel tex="P_3" /> scheitert an der dritten Koordinate.</>),
            opt('b', <>nur <Formel tex="P_1" /></>, false, <><Formel tex="P_4" /> liegt auch auf <Formel tex="g" nach=":" /> Für <Formel tex="t=-1" /> erhältst du <Formel tex={t`(-1\,|\,2-1\,|\,0-3)=(-1\,|\,1\,|\,-3)`} nach="." /> Auch ein negativer Parameter ist erlaubt.</>),
            opt('c', <><Formel tex="P_1" nach="," /> <Formel tex="P_3" /> und <Formel tex="P_4" /></>, false, <>Bei <Formel tex="P_3" /> liefert die zweite Gleichung <Formel tex="t=2" nach="," /> dann ist die dritte Koordinate der Geraden <Formel tex="3\cdot 2=6" nach="," /> aber <Formel tex="P_3" /> hat 5. Es genügt nicht, nur zwei Gleichungen zu prüfen.</>),
            opt('d', <><Formel tex="P_2" /> und <Formel tex="P_3" /></>, false, <><Formel tex="P_2" /> liegt nicht auf <Formel tex="g" nach=":" /> Die erste Koordinate aller Punkte von <Formel tex="g" /> ist <Formel tex="-1" nach="," /> weil der Richtungsvektor dort eine 0 hat. <Formel tex="P_2" /> hat 0. Auch <Formel tex="P_3" /> liegt nicht auf <Formel tex="g" nach="." /></>),
          ],
          0,
        )}
        erklaerung={
          <>
            Die erste Koordinate des Richtungsvektors ist 0, also gilt <Formel tex="x_1=-1" /> für alle Punkte der Geraden. Damit scheidet <Formel tex="P_2" /> aus. Für die übrigen Punkte gewinnst du <Formel tex="t" /> aus der zweiten Gleichung und prüfst die dritte: <Formel tex="P_1" nach=":" /> <Formel tex="t=3" /> und <Formel tex="3\cdot 3=9" nach="," /> stimmt. <Formel tex="P_3" nach=":" /> <Formel tex="t=2" /> und <Formel tex="3\cdot 2=6\ne 5" nach="." /> <Formel tex="P_4" nach=":" /> <Formel tex="t=-1" /> und <Formel tex="3\cdot(-1)=-3" nach="," /> stimmt.
          </>
        }
      >
        <p>
          Gegeben ist <Formel tex={glBreit(ap.g.p, ap.g.u)} nach="." /> Welche der Punkte <Formel tex={punktTeX('P_1', ap.punkte[0]!)} nach="," /> <Formel tex={punktTeX('P_2', ap.punkte[1]!)} nach="," /> <Formel tex={punktTeX('P_3', ap.punkte[2]!)} /> und <Formel tex={punktTeX('P_4', ap.punkte[3]!)} /> liegen auf <Formel tex="g" nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={8}
        titel="Eine Koordinate mit Parameter"
        felder={[
          { id: 't', name: 'Parameter t', beschriftung: <>Parameter <Formel tex="t" /></>, erwartet: pa.t },
          { id: 'a', name: 'Wert a', beschriftung: <>Wert <Formel tex="a" /></>, erwartet: pa.a },
        ]}
        hilfen={[<>Die zweite und die dritte Koordinate von <Formel tex="Q" /> enthalten kein <Formel tex="a" nach="." /> Gewinne <Formel tex="t" /> aus der zweiten Gleichung.</>, <>Prüfe mit der dritten Gleichung, ob <Formel tex="Q" /> überhaupt auf <Formel tex="g" /> liegen kann. Dann setzt du <Formel tex="t" /> in die erste Gleichung ein.</>]}
        loesung={[
          <>
            Zweite Koordinate:
            <Umbruchformel tex={t`2=0+t\Rightarrow t=2`} schmal={t`\begin{gathered}2=0+t\\{}\Rightarrow t=2\end{gathered}`} />
          </>,
          <>
            Dritte Koordinate zur Probe:
            <Umbruchformel tex={t`2-2=0`} schmal={t`\begin{gathered}2-2=0\end{gathered}`} />
            Das stimmt mit der dritten Koordinate 0 von <Formel tex="Q" /> überein.
          </>,
          <>
            Erste Koordinate:
            <Umbruchformel tex={t`a=1+2\cdot 2=5`} schmal={t`\begin{gathered}a=1+2\cdot 2\\{}=5\end{gathered}`} />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={glBreit(pa.g.p, pa.g.u)} nach="." /> Für welchen Wert von <Formel tex="a" /> liegt der Punkt <Formel tex={t`Q(a\,|\,2\,|\,0)`} /> auf <Formel tex="g" nach="?" /> Gib auch den zugehörigen Parameter <Formel tex="t" /> an.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="9"
        titel="Gibt es ein a?"
        optionen={platziere(
          [
            opt('a', <>Nein, es gibt kein <Formel tex="a" nach="." /></>, true, <>Richtig. Die zweite Gleichung <Formel tex="3=0+t" /> verlangt <Formel tex="t=3" nach="," /> die dritte <Formel tex="1=2-t" /> verlangt <Formel tex="t=1" nach="." /> Die Punkte von <Formel tex="g" /> mit der zweiten Koordinate 3 haben die dritte Koordinate <Formel tex="-1" nach="," /> nicht 1.</>),
            opt('b', <>Ja, <Formel tex="a=7" /></>, false, <>Hier wurde nur die zweite Gleichung benutzt: <Formel tex="t=3" /> und <Formel tex="a=1+2\cdot 3=7" nach="." /> Die dritte Gleichung <Formel tex="1=2-t" /> verlangt aber <Formel tex="t=1" nach="." /></>),
            opt('c', <>Ja, <Formel tex="a=3" /></>, false, <>Hier wurden die erste und die dritte Gleichung benutzt: <Formel tex="t=1" /> und <Formel tex="a=1+2\cdot 1=3" nach="." /> Die zweite Gleichung <Formel tex="3=0+t" /> verlangt aber <Formel tex="t=3" nach="." /></>),
            opt('d', <>Ja, <Formel tex="a" /> kann beliebig gewählt werden.</>, false, <>Die erste Gleichung ist nur eine von drei Bedingungen. Die zweite und die dritte Gleichung legen <Formel tex="t" /> fest, und sie widersprechen sich.</>),
          ],
          2,
        )}
        erklaerung={
          <>
            Die zweite und die dritte Koordinate enthalten kein <Formel tex="a" nach="," /> sie entscheiden zuerst, ob der Punkt überhaupt auf <Formel tex="g" /> liegen kann. Erst wenn beide dasselbe <Formel tex="t" /> liefern, berechnest du <Formel tex="a" /> aus der ersten Gleichung.
          </>
        }
      >
        <p>
          Für dieselbe Gerade <Formel tex={glBreit(pa.g.p, pa.g.u)} /> ist der Punkt <Formel tex={t`R(a\,|\,3\,|\,1)`} /> gegeben. Gibt es einen Wert <Formel tex="a" nach="," /> für den <Formel tex="R" /> auf <Formel tex="g" /> liegt?
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="10"
        titel="Dieselbe Gerade"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`h_1:\ ${gl(di.richtig.p, di.richtig.u, 's')}`} />, true, <>Richtig. Der Richtungsvektor ist <Formel tex={t`-2\cdot\vec{u}`} nach="," /> also ein Vielfaches. Der Stützpunkt <Formel tex={punktTeX('S', di.richtig.p)} /> liegt auf <Formel tex="g" nach=":" /> Für <Formel tex="t=2" /> erhältst du <Formel tex={t`(2-2\,|\,-1+6\,|\,3+4)`} nach="." /></>),
            opt('b', <Formel tex={t`h_2:\ ${gl(di.stuetzpunktAbseits.p, di.stuetzpunktAbseits.u, 's')}`} />, false, <>Der Richtungsvektor ist derselbe, aber der Stützpunkt liegt nicht auf <Formel tex="g" nach=":" /> Die erste Gleichung <Formel tex="3=2-t" /> liefert <Formel tex="t=-1" nach="," /> die zweite <Formel tex="-4=-1+3t" /> ebenfalls <Formel tex="t=-1" nach="," /> die dritte <Formel tex="2=3+2t" /> aber <Formel tex={t`t=-\tfrac{1}{2}`} nach="." /> Zwei von drei Gleichungen genügen nicht.</>),
            opt('c', <Formel tex={t`h_3:\ ${gl(di.andereRichtung.p, di.andereRichtung.u, 's')}`} />, false, <>Der Stützpunkt ist derselbe, aber der Richtungsvektor ist kein Vielfaches von <Formel tex={t`\vec{u}`} nach="." /> Der Faktor 1 passt zu den ersten beiden Koordinaten, die dritte Koordinate müsste dann 2 sein, ist aber 1. Es ist eine andere Gerade durch denselben Punkt.</>),
            opt('d', <Formel tex={t`h_4:\ ${gl(di.teilweise.p, di.teilweise.u, 's')}`} />, false, <>Der Stützpunkt <Formel tex={punktTeX('S', di.teilweise.p)} /> liegt auf <Formel tex="g" /> (für <Formel tex="t=4" nach=")," /> aber der Richtungsvektor ist kein Vielfaches von <Formel tex={t`\vec{u}`} nach=":" /> Der Faktor <Formel tex="-1" /> passt zu den ersten beiden Koordinaten, die dritte wäre <Formel tex="-2" /> und nicht <Formel tex="-4" nach="." /></>),
          ],
          1,
        )}
        erklaerung={
          <>
            Zwei Gleichungen beschreiben dieselbe Gerade, wenn beide Bedingungen gelten: Die Richtungsvektoren sind Vielfache voneinander, und der Stützpunkt der einen Gleichung liegt auf der anderen Geraden (Punktprobe mit allen drei Koordinaten).
          </>
        }
      >
        <p>
          Gegeben ist <Formel tex={glBreit(di.g.p, di.g.u)} nach="." /> Welche der Gleichungen beschreibt dieselbe Gerade?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={11}
        titel="Flugbahn einer Drohne"
        felder={[
          { id: 't', name: 'Parameter t für die Mastspitze', beschriftung: <>a) Parameter <Formel tex="t" /></>, erwartet: dr.tM },
          { id: 'h', name: 'Höhe in Metern', beschriftung: <>b) Höhe in m</>, erwartet: dr.hoehe * 100 },
        ]}
        hilfen={[<>a) Prüfe alle drei Koordinaten der Mastspitze mit demselben <Formel tex="t" nach="." /></>, <>b) Die erste Koordinate sagt, für welches <Formel tex="t" /> die Drohne bei <Formel tex="x_1=11" /> ist. Die dritte Koordinate ist dann die Höhe in Einheiten zu 100 m.</>]}
        loesung={[
          <>
            a) Erste Koordinate:
            <Umbruchformel tex={t`7=1+2t\Rightarrow t=3`} schmal={t`\begin{gathered}7=1+2t\\{}\Rightarrow t=3\end{gathered}`} />
          </>,
          <>
            Zweite und dritte Koordinate:
            <Umbruchformel tex={t`1+3=4,\ \ 0+3=3`} schmal={t`\begin{gathered}1+3=4\\0+3=3\end{gathered}`} />
            Beide stimmen mit <Formel tex={punktTeX('M', dr.M)} /> überein. Die Drohne fliegt für <Formel tex="t=3" /> durch die Mastspitze.
          </>,
          <>
            b) Erste Koordinate 11:
            <Umbruchformel tex={t`11=1+2t\Rightarrow t=5`} schmal={t`\begin{gathered}11=1+2t\\{}\Rightarrow t=5\end{gathered}`} />
          </>,
          <>
            Dritte Koordinate für <Formel tex="t=5" nach=":" />
            <Umbruchformel tex={t`x_3=0+5\cdot 1=5`} schmal={t`\begin{gathered}x_3=0+5\cdot 1\\{}=5\end{gathered}`} />
            Eine Einheit sind 100 m, die Höhe beträgt also 500 m.
          </>,
        ]}
      >
        <p>
          Eine Drohne fliegt geradlinig. Im Koordinatensystem (Einheit 100 m, <Formel tex="x_1" /> nach Osten, <Formel tex="x_2" /> nach Norden, <Formel tex="x_3" /> Höhe über dem Boden) beschreibt <Formel tex={glBreit(dr.g.p, dr.g.u)} /> ihre Flugbahn. Auf einem Hügel steht ein Mast mit der Spitze <Formel tex={punktTeX('M', dr.M)} nach="." /> a) Zeige, dass die Drohne durch die Mastspitze fliegt, und gib den Parameter <Formel tex="t" /> an. b) Wie hoch fliegt die Drohne über dem Boden, wenn <Formel tex="x_1=11" /> ist?
        </p>
      </Aufgabe>

      <Zeichenaufgabe
        nummer="12"
        titel="Eine Gerade im Schrägbild zeichnen"
        hilfe={
          <>
            Der Stützpunkt <Formel tex={punktTeX('P', ze.P)} /> ist der Punkt für <Formel tex="t=0" nach="." /> Der Punkt für <Formel tex="t=1" /> ist
            <Umbruchformel tex={t`\vec{x}=${sp(ze.g.p)}+${sp(ze.g.u)}=${sp(ze.Q)}`} schmal={t`\begin{gathered}\vec{x}=${sp(ze.g.p)}+${sp(ze.g.u)}\\{}=${sp(ze.Q)}\end{gathered}`} />
            also <Formel tex={punktTeX('Q', ze.Q)} nach="." /> Zeichne beide Punkte wie in den Modulen zum Raum (jede Einheit auf der <Formel tex="x_1" />-Achse ist eine Kästchendiagonale nach links unten) und verbinde sie mit einer Linie. Verlängere die Linie über beide Punkte hinaus, denn die Gerade ist unbegrenzt.
          </>
        }
        kontrolle={<KontrollFigur spec={aufgZeichnen} unter={<>Die Punkte <Formel tex="P" /> und <Formel tex="Q" /> und die Gerade <Formel tex="g" nach="." /> Der blaue Pfeil ist der Richtungsvektor.</>} />}
      >
        <p>
          Zeichne im Heft ein Schrägbild des Koordinatensystems (2 Kästchen je Einheit auf der <Formel tex="x_2" />- und der <Formel tex="x_3" />-Achse, eine Kästchendiagonale auf der <Formel tex="x_1" />-Achse). Zeichne die Gerade <Formel tex={glBreit(ze.g.p, ze.g.u)} nach="," /> indem du den Stützpunkt und den Punkt für <Formel tex="t=1" /> einträgst. Prüfe danach mit dem Kontrollschaubild.
        </p>
      </Zeichenaufgabe>

      <Auswahlfrage
        nummer="13"
        titel="Welche Aussage stimmt?"
        optionen={platziere(
          [
            opt('a', <>Der Richtungsvektor darf jeder Vektor außer dem Nullvektor sein.</>, true, <>Richtig. Mit dem Nullvektor wäre <Formel tex={t`\vec{p}+t\cdot\vec{0}=\vec{p}`} nach="," /> es gäbe nur den einen Punkt <Formel tex="P" nach="." /> Jeder andere Vektor legt eine Richtung fest.</>),
            opt('b', <>Eine Gerade hat genau eine Parametergleichung.</>, false, <>Stützpunkt und Richtungsvektor lassen sich verschieden wählen. Zu jeder Geraden gehören unendlich viele Gleichungen, wie in Aufgabe 10.</>),
            opt('c', <>Für <Formel tex="t=0" /> erhältst du den Ursprung.</>, false, <>Für <Formel tex="t=0" /> erhältst du den Stützpunkt <Formel tex="P" nach="," /> denn <Formel tex={t`\vec{x}=\vec{p}+0\cdot\vec{u}=\vec{p}`} nach="." /> Der Ursprung ist nur dann der Stützpunkt, wenn <Formel tex={t`\vec{p}=\vec{0}`} /> ist.</>),
            opt('d', <>Der Richtungsvektor muss die Länge 1 haben.</>, false, <>Jedes Vielfache eines Richtungsvektors (außer dem Nullvektor) ist wieder ein Richtungsvektor derselben Geraden. Die Länge 1 ist nicht nötig, ein Einheitsvektor ist nur eine mögliche Wahl.</>),
          ],
          0,
        )}
        erklaerung={<>Die Gleichung <Formel tex={t`\vec{x}=\vec{p}+t\cdot\vec{u}`} /> beschreibt eine Gerade, wenn <Formel tex={t`\vec{u}`} /> nicht der Nullvektor ist. Für <Formel tex="t=0" /> erhältst du den Stützpunkt, und Stützpunkt und Richtungsvektor sind nicht eindeutig.</>}
      >
        <p>
          Gegeben ist <Formel tex={t`g:\ \vec{x}=\vec{p}+t\cdot\vec{u}`} nach="." /> Welche Aussage stimmt?
        </p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
