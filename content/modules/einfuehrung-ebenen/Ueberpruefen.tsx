import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktprobe, type Ebene } from '@/lib/ebene';
import { ZEILE_NAME } from '@/lib/ebenenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { aufgDreiPunkte, aufgZeichnen } from './Bilder';
import { A_AUSWAHL, A_AUSWAHL_PUNKTE, A_DIESELBE, A_DREI_PUNKTE, A_EBENE, A_KEINE_EBENE, A_KOLLINEAR, A_PARAMETER_A, A_PUNKT, A_PUNKT_IN_E, A_ZEICHNEN } from './daten';
import { bruch, gleichungE, gleichungESchmal, koordinatenGleichung, punktRechnungE, punktTeX } from './rechenhilfen';

const sp = (v: number[]) => spalte(v);
const koordFelder = (praefix: string, werte: number[], wort: string): Feld[] =>
  werte.map((x, i) => ({ id: `${praefix}${i + 1}`, name: `${i + 1}. Koordinate von ${wort}`, beschriftung: <>{i + 1}. Koordinate</>, erwartet: x }));
const gl = (e: Ebene) => t`${gleichungE(e)}`;
const glSchmal = (e: Ebene) => t`${gleichungESchmal(e)}`;
const gleichungenTeX = (e: Ebene, x: (number | string)[]) => `\\begin{gathered}${[0, 1, 2].map((i) => `\\text{${ZEILE_NAME[i]}:}\\quad ${koordinatenGleichung(e, i, x[i]!)}`).join('\\\\')}\\end{gathered}`;
const gleichungen = (e: Ebene, x: (number | string)[]) => <Umbruchformel tex={gleichungenTeX(e, x)} schmal={gleichungenTeX(e, x)} />;
const plus = (a: number[], b: number[]) => a.map((x, i) => x + b[i]!);
const mal = (k: number, v: number[]) => v.map((x) => x * k);

/** Rückmeldung zu einem Punkt, der nicht in E liegt (oder liegt): welche Gleichungen r und s festlegen und was die dritte ergibt. */
function probeText(e: Ebene, x: number[]) {
  const pp = punktprobe(e, x)!;
  const [i, j] = pp.paar;
  return (
    <>
      Aus den Gleichungen {ZEILE_NAME[i!]} und {ZEILE_NAME[j!]} folgt <Formel tex={`r=${bruch(pp.r)}`} nach="," /> <Formel tex={`s=${bruch(pp.s)}`} nach="." /> In Gleichung {ZEILE_NAME[pp.rest]} ergibt die linke Seite dann <Formel tex={bruch(pp.ergibt)} nach="," /> verlangt ist <Formel tex={bruch(pp.verlangt)} nach="." />{' '}
      {pp.liegtIn ? 'Alle drei Gleichungen sind erfüllt.' : 'Die Gleichung ist nicht erfüllt.'}
    </>
  );
}

export function Ueberpruefen() {
  const pu = A_PUNKT;
  const dp = A_DREI_PUNKTE;
  const au = A_AUSWAHL;
  const ee = A_EBENE;
  const qe = A_PUNKT_IN_E;
  const ap = A_AUSWAHL_PUNKTE;
  const pa = A_PARAMETER_A;
  const ko = A_KOLLINEAR;
  const ke = A_KEINE_EBENE;
  const di = A_DIESELBE;
  const ze = A_ZEICHNEN;
  const orts = plus(au.A, au.ortsvektoren.u);
  const vz = plus(au.A, au.vorzeichen.v);
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten. Das Rechnen mit Verbindungsvektoren steht im Modul <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>, das Lösen der Gleichungen für <Formel tex="r" /> und <Formel tex="s" /> kennst du aus den Modulen zu <Modulverweis modul="gauss-algorithmus">linearen Gleichungssystemen</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">
        Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma.
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Einen Punkt der Ebene berechnen"
        felder={koordFelder('x', pu.X, 'X')}
        hilfen={[
          <>Setze die Zahlen für <Formel tex="r" /> und <Formel tex="s" /> in die Gleichung ein.</>,
          <>Rechne jede Koordinate einzeln: <Formel tex="x_i=p_i+r\cdot u_i+s\cdot v_i" nach="." /> Negative Zahlen stehen in Klammern.</>,
        ]}
        loesung={[
          <>
            Einsetzen von <Formel tex={t`r=${pu.r}`} /> und <Formel tex={t`s=${pu.s}`} nach=":" />
            <Umbruchformel tex={punktRechnungE(pu.e, pu.r, pu.s).tex} schmal={punktRechnungE(pu.e, pu.r, pu.s).schmal} />
          </>,
          <>Der Punkt hat die Koordinaten <Formel tex={punktTeX('X', pu.X)} nach="." /></>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={gl(pu.e)} nach="." /> Bestimme den Punkt <Formel tex="X" /> der Ebene für <Formel tex={t`r=${pu.r}`} /> und <Formel tex={t`s=${pu.s}`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={2}
        titel="Spannvektoren aus drei Punkten"
        felder={[...koordFelder('u', dp.u, 'AB'), ...koordFelder('v', dp.v, 'AC')]}
        hilfen={[
          <>Die Spannvektoren sind Verbindungsvektoren, die von <Formel tex="A" /> aus zu <Formel tex="B" /> und zu <Formel tex="C" /> führen: Zielpunkt minus Ausgangspunkt.</>,
          <>Subtrahiere Koordinate für Koordinate, zum Beispiel für <Formel tex={t`\overrightarrow{AB}`} nach=":" /> erste Koordinate von <Formel tex="B" /> minus erste Koordinate von <Formel tex="A" nach="." /></>,
        ]}
        loesung={[
          <>
            <Umbruchformel
              tex={t`\overrightarrow{AB}=\begin{pmatrix}1-(-1)\\-2-0\\1-1\end{pmatrix}=${sp(dp.u)}`}
              schmal={t`\begin{gathered}\overrightarrow{AB}\\{}=\begin{pmatrix}1-(-1)\\-2-0\\1-1\end{pmatrix}\\{}=${sp(dp.u)}\end{gathered}`}
            />
          </>,
          <>
            <Umbruchformel
              tex={t`\overrightarrow{AC}=\begin{pmatrix}-1-(-1)\\-3-0\\2-1\end{pmatrix}=${sp(dp.v)}`}
              schmal={t`\begin{gathered}\overrightarrow{AC}\\{}=\begin{pmatrix}-1-(-1)\\-3-0\\2-1\end{pmatrix}\\{}=${sp(dp.v)}\end{gathered}`}
            />
          </>,
          <>
            Mit dem Stützpunkt <Formel tex="A" /> lautet die Gleichung
            <Umbruchformel tex={gl({ p: dp.A, u: dp.u, v: dp.v })} schmal={glSchmal({ p: dp.A, u: dp.u, v: dp.v })} />
          </>,
        ]}
      >
        <p>
          Eine Ebene geht durch <Formel tex={punktTeX('A', dp.A)} nach="," /> <Formel tex={punktTeX('B', dp.B)} /> und <Formel tex={punktTeX('C', dp.C)} nach="." /> Bestimme die Spannvektoren <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="." /> Schreibe danach im Heft die Gleichung der Ebene mit dem Stützpunkt <Formel tex="A" /> auf.
        </p>
        <KontrollFigur spec={aufgDreiPunkte} unter={<>Die Ebene durch <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" nach="." /> Die Spannvektoren <Formel tex={t`\overrightarrow{AB}`} /> (blau) und <Formel tex={t`\overrightarrow{AC}`} /> (rosa) beginnen in <Formel tex="A" nach="." /></>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Welche Gleichung beschreibt die Ebene?"
        optionen={platziere(
          [
            opt('a', <Formel tex={gl(au.richtig)} />, true, <>Richtig. Der Stützpunkt <Formel tex={punktTeX('A', au.A)} /> liegt in der Ebene, und <Formel tex={t`\overrightarrow{AB}=${sp(au.ab)}`} /> und <Formel tex={t`\overrightarrow{AC}=${sp(au.ac)}`} /> führen von <Formel tex="A" /> zu <Formel tex="B" /> und zu <Formel tex="C" nach="." /> Sie sind keine Vielfachen voneinander.</>),
            opt('b', <Formel tex={gl(au.ortsvektoren)} />, false, <>Hier sind die Ortsvektoren von <Formel tex="B" /> und <Formel tex="C" /> als Spannvektoren genommen worden. Sie zeigen vom Ursprung zu den Punkten, nicht innerhalb der Ebene von <Formel tex="A" /> aus weg. Die Probe zeigt es: Für <Formel tex={t`r=1`} /> und <Formel tex={t`s=0`} /> erhältst du <Formel tex={punktTeX('', orts)} nach="," /> nicht <Formel tex="B" nach="." /></>),
            opt('c', <Formel tex={gl(au.kollinear)} />, false, <>Hier ist der zweite Spannvektor das Doppelte des ersten: <Formel tex={t`${sp(au.kollinear.v)}=2\cdot${sp(au.ab)}`} nach="." /> Die Spannvektoren sind Vielfache voneinander, die Gleichung beschreibt nur eine Gerade, und <Formel tex="C" /> liegt nicht darauf.</>),
            opt('d', <Formel tex={gl(au.vorzeichen)} />, false, <>Der zweite Spannvektor hat in der zweiten Koordinate einen Vorzeichenfehler: <Formel tex="2-1=1" nach="," /> nicht <Formel tex="-1" nach="." /> Die Probe zeigt es: Für <Formel tex={t`r=0`} /> und <Formel tex={t`s=1`} /> erhältst du <Formel tex={punktTeX('', vz)} nach="," /> nicht <Formel tex="C" nach="." /></>),
          ],
          1,
        )}
        erklaerung={
          <>
            Die Spannvektoren sind Verbindungsvektoren von <Formel tex="A" /> zu den beiden anderen Punkten, <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} nach="." /> Die Probe mit <Formel tex={t`(r\,|\,s)=(1\,|\,0)`} /> und <Formel tex={t`(0\,|\,1)`} /> zeigt, ob <Formel tex="B" /> und <Formel tex="C" /> herauskommen.
          </>
        }
      >
        <p>
          Welche Gleichung beschreibt die Ebene durch <Formel tex={punktTeX('A', au.A)} nach="," /> <Formel tex={punktTeX('B', au.B)} /> und <Formel tex={punktTeX('C', au.C)} nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={4}
        titel="Liegt der Punkt in der Ebene?"
        felder={[
          { id: 'r', name: 'Parameter r', beschriftung: <Formel tex="r" />, erwartet: qe.r },
          { id: 's', name: 'Parameter s', beschriftung: <Formel tex="s" />, erwartet: qe.s },
        ]}
        hilfen={[
          <>Setze den Punkt für <Formel tex={t`\vec{x}`} /> ein. Das gibt drei Gleichungen für <Formel tex="r" /> und <Formel tex="s" nach="." /></>,
          <>Die erste Gleichung enthält nur <Formel tex="r" nach="," /> weil die erste Koordinate des zweiten Spannvektors 0 ist. Löse sie zuerst und berechne dann <Formel tex="s" /> aus einer anderen Gleichung.</>,
          <>Setze die Werte zuletzt in die dritte Gleichung ein. Nur wenn sie stimmt, liegt der Punkt in der Ebene.</>,
        ]}
        loesung={[
          <>
            Die Punktprobe liefert drei Gleichungen:
            {gleichungen(ee, qe.Q)}
          </>,
          <>
            Gleichung I enthält nur <Formel tex="r" nach=":" />
            <Umbruchformel tex={t`1+2r=-1\Rightarrow r=-1`} schmal={t`\begin{gathered}1+2r=-1\\{}\Rightarrow r=-1\end{gathered}`} />
          </>,
          <>
            Gleichung II liefert <Formel tex="s" nach=":" />
            <Umbruchformel tex={t`2-(-1)+s=5\Rightarrow s=2`} schmal={t`\begin{gathered}2-(-1)+s=5\\{}\Rightarrow s=2\end{gathered}`} />
          </>,
          <>
            Probe in Gleichung III:
            <Umbruchformel tex={t`-1+2\cdot 2=3`} schmal={t`\begin{gathered}-1+2\cdot 2\\{}=3\end{gathered}`} />
            Die Gleichung stimmt, also liegt <Formel tex="Q" /> in <Formel tex="E" nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={gl(ee)} nach="." /> Der Punkt <Formel tex={punktTeX('Q', qe.Q)} /> liegt in <Formel tex="E" nach="." /> Bestimme die Parameter <Formel tex="r" /> und <Formel tex="s" nach="," /> die zu <Formel tex="Q" /> gehören.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="5"
        titel="Welcher Punkt liegt in der Ebene?"
        optionen={platziere(
          ap.punkte.map((x, i) =>
            i === ap.auf
              ? opt(`p${i}`, <Formel tex={punktTeX('', x)} />, true, <>Richtig. {probeText(ee, x)}</>)
              : opt(`p${i}`, <Formel tex={punktTeX('', x)} />, false, <>{probeText(ee, x)} Der Punkt liegt nicht in der Ebene.</>),
          ),
          3,
        )}
        erklaerung={
          <>
            Für jeden Punkt legen zwei Koordinatengleichungen <Formel tex="r" /> und <Formel tex="s" /> fest, die dritte entscheidet. Nur beim Punkt <Formel tex={punktTeX('', ap.punkte[ap.auf]!)} /> sind alle drei Gleichungen für dieselben <Formel tex="r" /> und <Formel tex="s" /> erfüllt, nämlich für <Formel tex={t`r=1`} /> und <Formel tex={t`s=1`} nach="." />
          </>
        }
      >
        <p>
          Gegeben ist <Formel tex={gl(ee)} nach="." /> Welcher der Punkte liegt in <Formel tex="E" nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={6}
        titel="Ein Punkt mit Parameter"
        felder={[{ id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: pa.a }]}
        hilfen={[
          <>Setze den Punkt <Formel tex={t`Q(-1\,|\,a\,|\,5)`} /> ein. Das gibt drei Gleichungen für <Formel tex="r" nach="," /> <Formel tex="s" /> und <Formel tex="a" nach="." />
          </>,
          <>Die Gleichungen I und III enthalten kein <Formel tex="a" nach="." /> Berechne daraus <Formel tex="r" /> und <Formel tex="s" nach="," /> setze beide in Gleichung II ein und löse nach <Formel tex="a" nach="." /></>,
        ]}
        loesung={[
          <>
            Die Gleichungen mit <Formel tex="Q" nach=":" />
            {gleichungen(ee, [-1, 'a', 5])}
          </>,
          <>
            Gleichung I:
            <Umbruchformel tex={t`1+2r=-1\Rightarrow r=-1`} schmal={t`\begin{gathered}1+2r=-1\\{}\Rightarrow r=-1\end{gathered}`} />
          </>,
          <>
            Gleichung III mit <Formel tex={t`r=-1`} nach=":" />
            <Umbruchformel tex={t`-1+2s=5\Rightarrow s=3`} schmal={t`\begin{gathered}-1+2s=5\\{}\Rightarrow s=3\end{gathered}`} />
          </>,
          <>
            Gleichung II:
            <Umbruchformel tex={t`a=2-(-1)+3=6`} schmal={t`\begin{gathered}a=2-(-1)+3\\{}=6\end{gathered}`} />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={gl(ee)} nach="." /> Der Punkt <Formel tex={t`Q(-1\,|\,a\,|\,5)`} /> liegt in <Formel tex="E" nach="." /> Bestimme <Formel tex="a" nach="." />
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="7"
        titel="Reichen ein Punkt und zwei Vektoren?"
        optionen={platziere(
          [
            opt('a', <>Nein. Es gilt <Formel tex={t`\vec{b}=-2\cdot\vec{a}`} nach="," /> die Vektoren sind Vielfache voneinander. Die Gleichung beschreibt nur eine Gerade durch <Formel tex="D" nach="." /></>, true, <>Richtig. Ein Vielfaches des ersten Vektors führt nur auf der Geraden durch <Formel tex="D" /> entlang. Eine zweite Richtung fehlt.</>),
            opt('b', <>Ja, denn beide Vektoren sind vom Nullvektor verschieden.</>, false, <>Das genügt nicht. Die Vektoren müssen außerdem keine Vielfachen voneinander sein. Hier ist <Formel tex={t`${sp(ko.b)}=${ko.k}\cdot${sp(ko.a)}`} nach="." /></>),
            opt('c', <>Ja, denn ein Punkt und zwei Vektoren legen immer eine Ebene fest.</>, false, <>Nur zwei Vektoren, die nicht kollinear sind, legen mit dem Punkt eine Ebene fest. Sind sie Vielfache voneinander, bleibt eine Gerade übrig.</>),
            opt('d', <>Nein, denn <Formel tex="D" /> ist nicht der Ursprung.</>, false, <>Als Stützpunkt darfst du jeden Punkt der Ebene verwenden, er muss nicht der Ursprung sein. Das Problem liegt bei den Vektoren: Sie sind Vielfache voneinander.</>),
          ],
          2,
        )}
        erklaerung={
          <>
            Die Gleichung <Formel tex={t`\vec{x}=\vec{d}+r\cdot\vec{a}+s\cdot\vec{b}`} /> beschreibt eine Ebene, wenn <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} /> nicht der Nullvektor sind und keine Vielfachen voneinander. Mit <Formel tex={t`\vec{b}=-2\cdot\vec{a}`} /> wird daraus <Formel tex={t`\vec{x}=\vec{d}+(r-2s)\cdot\vec{a}`} nach="," /> eine Gerade.
          </>
        }
      >
        <p>
          Gegeben sind der Punkt <Formel tex={punktTeX('D', ko.D)} /> und die Vektoren <Formel tex={t`\vec{a}=${sp(ko.a)}`} /> und <Formel tex={t`\vec{b}=${sp(ko.b)}`} nach="." /> Kannst du damit eine Ebene durch <Formel tex="D" /> beschreiben?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={8}
        titel="Wann entsteht keine Ebene?"
        felder={[{ id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: ke.a }]}
        hilfen={[
          <>Es entsteht keine Ebene, wenn die Spannvektoren Vielfache voneinander sind: <Formel tex={t`\vec{v}=k\cdot\vec{u}`} nach="." /></>,
          <>Bestimme <Formel tex="k" /> aus einer Koordinate ohne <Formel tex="a" nach="," /> und berechne dann <Formel tex="a" nach="." /></>,
        ]}
        loesung={[
          <>
            Erste Koordinate:
            <Umbruchformel tex={t`2=k\cdot 1\Rightarrow k=2`} schmal={t`\begin{gathered}2=k\cdot 1\\{}\Rightarrow k=2\end{gathered}`} />
          </>,
          <>
            Zweite Koordinate:
            <Umbruchformel tex={t`4=2\cdot a\Rightarrow a=2`} schmal={t`\begin{gathered}4=2\cdot a\\{}\Rightarrow a=2\end{gathered}`} />
          </>,
          <>
            Dritte Koordinate zur Kontrolle:
            <Umbruchformel tex={t`4=2\cdot 2`} schmal={t`\begin{gathered}4=2\cdot 2\end{gathered}`} />
            Für <Formel tex="a=2" /> ist <Formel tex={t`\vec{v}=2\cdot\vec{u}`} nach="," /> die Gleichung beschreibt dann nur eine Gerade. Für jedes andere <Formel tex="a" /> beschreibt sie eine Ebene.
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={t`E_a:\ \vec{x}=${sp(ke.p)}+r\cdot\begin{pmatrix}1\\a\\2\end{pmatrix}+s\cdot${sp(ke.v)}`} nach="." /> Für genau einen Wert von <Formel tex="a" /> beschreibt die Gleichung keine Ebene. Bestimme diesen Wert.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="9"
        titel="Dieselbe Ebene?"
        optionen={platziere(
          [
            opt('a', <Formel tex={gl(di.richtig)} />, true, <>Richtig. Der Stützpunkt <Formel tex={punktTeX('', di.richtig.p)} /> gehört zu <Formel tex={t`(r\,|\,s)=(1\,|\,1)`} /> in <Formel tex="E" nach="." /> Die Spannvektoren sind <Formel tex={t`\vec{u}-\vec{v}`} /> und <Formel tex={t`-2\cdot\vec{v}`} nach="." /> Beide liegen in <Formel tex="E" nach="," /> und sie sind keine Vielfachen voneinander.</>),
            opt('b', <Formel tex={gl(di.spannfalsch)} />, false, <>Der Stützpunkt stimmt, aber der Spannvektor <Formel tex={t`${sp(di.spannfalsch.v)}`} /> liegt nicht in <Formel tex="E" nach="." /> Die Probe mit dem Punkt <Formel tex={punktTeX('', plus(di.e.p, di.spannfalsch.v))} /> zeigt es. {probeText(di.e, plus(di.e.p, di.spannfalsch.v))}</>),
            opt('c', <Formel tex={gl(di.punktfalsch)} />, false, <>Die Spannvektoren stimmen, aber der Stützpunkt <Formel tex={punktTeX('', di.punktfalsch.p)} /> liegt nicht in <Formel tex="E" nach="." /> {probeText(di.e, di.punktfalsch.p)} Die Ebene ist parallel verschoben.</>),
            opt('d', <Formel tex={gl(di.kollinear)} />, false, <>Hier ist <Formel tex={t`\vec{v}=3\cdot\vec{u}`} nach="." /> Die Spannvektoren sind Vielfache voneinander, die Gleichung beschreibt nur eine Gerade.</>),
          ],
          0,
        )}
        erklaerung={
          <>
            Zwei Gleichungen beschreiben dieselbe Ebene, wenn der Stützpunkt der zweiten in der ersten liegt und beide Spannvektoren der zweiten in der ersten liegen und keine Vielfachen voneinander sind.
          </>
        }
      >
        <p>
          Gegeben ist <Formel tex={gl(di.e)} nach="." /> Welche Gleichung beschreibt dieselbe Ebene?
        </p>
      </Auswahlfrage>

      <Zeichenaufgabe
        nummer="10"
        titel="Eine Ebene im Schrägbild zeichnen"
        hilfe={
          <>
            Die Spannvektoren sind
            <Umbruchformel tex={t`\overrightarrow{AB}=${sp(ze.u)}`} schmal={t`\begin{gathered}\overrightarrow{AB}\\{}=${sp(ze.u)}\end{gathered}`} />
            <Umbruchformel tex={t`\overrightarrow{AC}=${sp(ze.v)}`} schmal={t`\begin{gathered}\overrightarrow{AC}\\{}=${sp(ze.v)}\end{gathered}`} />
            Der vierte Eckpunkt <Formel tex="D" /> entsteht, wenn du von <Formel tex="A" /> erst <Formel tex={t`\overrightarrow{AB}`} /> und dann <Formel tex={t`\overrightarrow{AC}`} /> gehst:
            <Umbruchformel tex={t`\overrightarrow{OD}=${sp(ze.A)}+${sp(ze.u)}+${sp(ze.v)}=${sp(ze.D)}`} schmal={t`\begin{gathered}\overrightarrow{OD}=${sp(ze.A)}+${sp(ze.u)}+${sp(ze.v)}\\{}=${sp(ze.D)}\end{gathered}`} />
            Also ist <Formel tex={punktTeX('D', ze.D)} nach="." /> Zeichne die vier Punkte wie in den Modulen zum Raum (jede Einheit auf der <Formel tex="x_1" />-Achse ist eine Kästchendiagonale nach links unten) und verbinde sie der Reihe nach <Formel tex="A" nach="," /> <Formel tex="B" nach="," /> <Formel tex="D" nach="," /> <Formel tex="C" nach="." /> Das Parallelogramm ist nur ein Stück der Ebene, sie reicht in alle Richtungen weiter.
          </>
        }
        kontrolle={<KontrollFigur spec={aufgZeichnen} unter={<>Das Parallelogramm <Formel tex="ABDC" /> mit den Spannvektoren <Formel tex={t`\overrightarrow{AB}`} /> (blau) und <Formel tex={t`\overrightarrow{AC}`} /> (rosa).</>} />}
      >
        <p>
          Eine Ebene geht durch <Formel tex={punktTeX('A', ze.A)} nach="," /> <Formel tex={punktTeX('B', ze.B)} /> und <Formel tex={punktTeX('C', ze.C)} nach="." /> Zeichne im Heft ein Schrägbild des Koordinatensystems (2 Kästchen je Einheit auf der <Formel tex="x_2" />- und der <Formel tex="x_3" />-Achse, eine Kästchendiagonale auf der <Formel tex="x_1" />-Achse). Trage die Punkte ein, bestimme den Punkt <Formel tex="D" /> so, dass <Formel tex="ABDC" /> ein Parallelogramm ist, und zeichne es. Prüfe danach mit dem Kontrollschaubild.
        </p>
      </Zeichenaufgabe>
    </Abschnitt>
  );
}
