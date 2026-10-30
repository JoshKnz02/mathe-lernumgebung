import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Matrixfolge } from '@/components/Matrixfolge';
import { loeseAllgemein, loesungsmengeTeX, matrixTeX, type Matrix } from '@/lib/lgs';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { Folge, stufenBild } from './Bilder';
import { AUFGABE5, AUFGABE6, AUFGABE7, AUFGABE8, AUFGABE9, AUFGABE10, AUFGABE11, AUFGABE12, FRAGEN } from './daten';

type Art = 'unloesbar' | 'eindeutig' | 'mehrdeutig';
const ID: Record<Art, string> = { eindeutig: 'e', unloesbar: 'u', mehrdeutig: 'm' };
const NAME: Record<Art, string> = { eindeutig: 'eindeutig lösbar', unloesbar: 'nicht lösbar', mehrdeutig: 'mehrdeutig lösbar' };
const Lsg = ({ m, form = 'tupel' }: { m: Matrix; form?: 'tupel' | 'summe' }) => <Formel anzeige tex={loesungsmengeTeX(loeseAllgemein(m), form)} nach="." />;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl, Dezimalzahl (<code>2,5</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{5}{2}`} nach=")" /> ein, ohne Einheit. Die Aufgaben 1 bis 4 und 6 sind Auswahlfragen. Bei Lösungen mit Parameter sind die Zahlen vor und bei <Formel tex="t" /> gesucht, die Aufgabe sagt, welche Unbekannte der Parameter ist.
    </Hinweis>
  );
}

interface FallProps {
  nr: string;
  titel: string;
  matrix: Matrix;
  art: Art;
  stelle: number;
  text: ReactNode;
  rueck: Partial<Record<Art, ReactNode>>;
  erklaerung: ReactNode;
  /** Die Matrix steht schon in Stufenform: ein Bild mit Auswertung statt des Gauß-Verlaufs. */
  stufe?: boolean;
}

/** Auswahlfrage mit den drei Fällen als Antworten. */
function Fall({ nr, titel, matrix, art, stelle, text, rueck, erklaerung, stufe = true }: FallProps) {
  const arten: Art[] = ['eindeutig', 'unloesbar', 'mehrdeutig'];
  const optionen = arten.map((a) => opt(ID[a], <>{NAME[a]}</>, a === art, a === art ? <>Richtig, das System ist {NAME[a]}.</> : rueck[a]));
  return (
    <Auswahlfrage
      nummer={nr}
      titel={titel}
      optionen={platziere(optionen, stelle)}
      erklaerung={
        <>
          {erklaerung}
          {stufe ? (
            <Matrixfolge zeilen={stufenBild(matrix)} beschreibung="Die Matrix in Stufenform mit Auswertung" unter={<>Blau: Pivot, grün: Nullzeile, rosa: Widerspruchszeile.</>} />
          ) : (
            <Folge m={matrix} beschreibung="Gauß-Algorithmus bis zur Stufenform mit Auswertung" unter={<>Blau: Pivot, grün: Nullzeile, rosa: Widerspruchszeile.</>} />
          )}
          <Lsg m={matrix} />
        </>
      }
    >
      {text}
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  const a5 = AUFGABE5;
  const a7 = AUFGABE7;
  const a8 = AUFGABE8;
  const a11 = AUFGABE11;
  const a12 = AUFGABE12;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <Eingabehinweis />

      <Fall
        nr="1"
        titel="Fall erkennen"
        matrix={FRAGEN[0]!.matrix}
        art="eindeutig"
        stelle={1}
        text={
          <>
            <p>Die Matrix steht in Stufenform. Welcher Fall liegt vor?</p>
            <Formel anzeige tex={matrixTeX(FRAGEN[0]!.matrix)} nach="." />
          </>
        }
        rueck={{
          unloesbar: <>Eine Widerspruchszeile hätte links lauter Nullen und rechts eine Zahl ungleich 0. Hier hat jede Zeile mindestens einen Koeffizienten ungleich 0, es gibt keinen Widerspruch.</>,
          mehrdeutig: <>Mehrdeutig wäre das System, wenn eine Unbekannte frei bliebe. Hier hat jede der drei Unbekannten ein Pivot (2, 3 und <Formel tex="-4" nach=")" /> und es gibt drei Zeilen für drei Unbekannte.</>,
        }}
        erklaerung={
          <p>
            Es gibt keine Widerspruchszeile, und drei Pivots stehen drei Unbekannten gegenüber. Rückwärts folgt <Formel tex="x_3=2" nach="," /> <Formel tex="x_2=1" /> und <Formel tex="x_1=2" nach="." />
          </p>
        }
      />
      <Fall
        nr="2"
        titel="Fall erkennen"
        matrix={FRAGEN[1]!.matrix}
        art="unloesbar"
        stelle={2}
        text={
          <>
            <p>Welcher Fall liegt hier vor?</p>
            <Formel anzeige tex={matrixTeX(FRAGEN[1]!.matrix)} nach="." />
          </>
        }
        rueck={{
          eindeutig: <>Drei Zeilen für drei Unbekannte genügen nicht. Du musst auch die letzte Zeile ansehen: Sie lautet <Formel tex="0=5" /> und ist für keine Zahlen erfüllt.</>,
          mehrdeutig: <>Eine Zeile mit lauter Nullen links macht ein System nur mehrdeutig, wenn rechts auch 0 steht. Hier steht rechts 5, das ist ein Widerspruch und keine freie Unbekannte.</>,
        }}
        erklaerung={
          <p>
            Die letzte Zeile bedeutet <Formel tex={t`0x_1+0x_2+0x_3=5`} nach="," /> also <Formel tex="0=5" nach="." /> Das ist eine Widerspruchszeile, die Lösungsmenge ist leer.
          </p>
        }
      />
      <Fall
        nr="3"
        titel="Fall erkennen"
        matrix={FRAGEN[2]!.matrix}
        art="mehrdeutig"
        stelle={0}
        text={
          <>
            <p>Welcher Fall liegt hier vor?</p>
            <Formel anzeige tex={matrixTeX(FRAGEN[2]!.matrix)} nach="." />
          </>
        }
        rueck={{
          unloesbar: <>Die Zeile <Formel tex="0=0" /> ist kein Widerspruch, sie ist immer wahr. Ein Widerspruch wäre <Formel tex="0=c" /> mit <Formel tex="c\neq 0" nach="." /></>,
          eindeutig: <>Es bleiben nur zwei Zeilen mit Koeffizienten, aber es gibt drei Unbekannte. Eine Unbekannte, hier <Formel tex="x_3" nach="," /> bleibt frei, deshalb ist die Lösung nicht eindeutig.</>,
        }}
        erklaerung={
          <p>
            Es gibt keine Widerspruchszeile, aber nur zwei Pivots für drei Unbekannte. Mit <Formel tex="x_3=t" /> folgen <Formel tex={t`x_2=3+2t`} /> und <Formel tex="x_1=6" nach="." /> Auch <Formel tex="x_1" /> hängt nicht von <Formel tex="t" /> ab, das ist erlaubt.
          </p>
        }
      />
      <Fall
        nr="4"
        titel="Erst die Stufenform herstellen"
        matrix={FRAGEN[3]!.matrix}
        art="mehrdeutig"
        stelle={1}
        stufe={false}
        text={
          <>
            <p>Die Matrix sieht fast wie eine Stufenform aus. Welcher Fall liegt vor?</p>
            <Formel anzeige tex={matrixTeX(FRAGEN[3]!.matrix)} nach="." />
          </>
        }
        rueck={{
          eindeutig: <>Alle drei Zeilen haben Koeffizienten, aber die Matrix ist noch keine Stufenform: Zeile 2 und Zeile 3 haben ihr Pivot in derselben Spalte. Erst nach <Formel tex={t`Z_3\to Z_3-2\cdot Z_2`} /> siehst du, was bleibt.</>,
          unloesbar: <>Entscheide erst nach dem Umformen. Mit <Formel tex={t`Z_3\to Z_3-2\cdot Z_2`} /> wird die rechte Seite zu <Formel tex={t`12-2\cdot 6=0`} nach="," /> es entsteht <Formel tex="0=0" /> und kein Widerspruch.</>,
        }}
        erklaerung={
          <p>
            Die Spalte von <Formel tex="x_2" /> hat kein Pivot. Mit <Formel tex={t`Z_3\to Z_3-2\cdot Z_2`} /> entsteht eine Nullzeile. Es bleiben zwei Pivots für drei Unbekannte, <Formel tex={t`x_2=t`} /> ist frei und <Formel tex="x_3=2" nach="." /> Eine Matrix mit lauter Zeilen ungleich 0 ist also nicht automatisch eindeutig lösbar.
          </p>
        }
      />

      <Aufgabe
        nummer={5}
        titel="Lösung mit einem Parameter"
        felder={[
          { id: 'a', name: 'Zahl ohne t in x1', beschriftung: <><Formel tex="x_1" nach="" /> ohne <Formel tex="t" /></>, erwartet: a5.werte.a },
          { id: 'b', name: 'Zahl vor t in x1', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="x_1" /></>, erwartet: a5.werte.b },
          { id: 'c', name: 'Zahl ohne t in x2', beschriftung: <><Formel tex="x_2" /> ohne <Formel tex="t" /></>, erwartet: a5.werte.c },
          { id: 'd', name: 'Zahl vor t in x2', beschriftung: <>Zahl vor <Formel tex="t" /> in <Formel tex="x_2" /></>, erwartet: a5.werte.d },
        ]}
        hilfen={[
          <>Die letzte Zeile ist <Formel tex="0=0" nach="." /> Die Unbekannte <Formel tex="x_3" /> ist frei, setze <Formel tex="x_3=t" nach="." /></>,
          <>Löse die zweite Zeile nach <Formel tex="x_2" /> auf, setze das Ergebnis in die erste Zeile ein und löse nach <Formel tex="x_1" /> auf.</>,
        ]}
        loesung={[
          <>
            Auswertung der Matrix:
            <Matrixfolge zeilen={stufenBild(a5.matrix)} beschreibung="Matrix in Stufenform mit einer Nullzeile" unter={<>Blau: Pivot, grün: Nullzeile.</>} />
            Die Zeile 3 ist <Formel tex="0=0" nach="," /> es bleiben zwei Pivots für drei Unbekannte. Du setzt <Formel tex="x_3=t" nach="." />
          </>,
          <>
            Zeile 2: <Formel tex={t`3x_2-3t=9`} nach="," /> also <Formel tex={t`x_2=3+t`} nach="." />
          </>,
          <>
            Zeile 1: <Formel tex={t`x_1-2(3+t)+3t=4`} nach="," /> also <Formel tex={t`x_1=10-t`} nach="." />
            <Lsg m={a5.matrix} />
          </>,
        ]}
      >
        <p>
          Die Matrix steht in Stufenform. Setze <Formel tex="x_3=t" /> und gib <Formel tex={t`x_1=a+b\cdot t`} /> und <Formel tex={t`x_2=c+d\cdot t`} /> an.
        </p>
        <Formel anzeige tex={matrixTeX(a5.matrix)} nach="." />
      </Aufgabe>

      <Fall
        nr="6"
        titel="Erst umformen, dann entscheiden"
        matrix={AUFGABE6.matrix}
        art="unloesbar"
        stelle={2}
        stufe={false}
        text={
          <>
            <p>Welcher Fall liegt bei diesem System vor?</p>
            <Formel anzeige tex={t`\begin{aligned}x_1+2x_2-x_3&=3\\2x_1+x_2+x_3&=4\\3x_1+3x_2&=9\end{aligned}`} nach="." />
          </>
        }
        rueck={{
          eindeutig: <>Gleich viele Gleichungen wie Unbekannte genügen nicht für eine eindeutige Lösung. Nach <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} nach="," /> <Formel tex={t`Z_3\to Z_3-3\cdot Z_1`} /> und <Formel tex={t`Z_3\to Z_3-Z_2`} /> steht in der letzten Zeile <Formel tex="0=2" nach="." /></>,
          mehrdeutig: <>Mehrdeutig wäre das System bei einer Zeile <Formel tex="0=0" nach="." /> Die letzte Zeile lautet aber <Formel tex="0=2" nach="," /> rechts steht nicht 0. Das ist ein Widerspruch und keine freie Unbekannte.</>,
        }}
        erklaerung={
          <p>
            Du bringst die Matrix mit dem Gauß-Algorithmus in Stufenform. Die Zeile 3 wird dabei zur Widerspruchszeile <Formel tex="0=2" nach="." /> Man sieht es auch an den Zeilen: Die Summe der linken Seiten von <Formel tex="Z_1" /> und <Formel tex="Z_2" /> ist <Formel tex={t`3x_1+3x_2`} nach="," /> die der rechten Seiten ist 7, in <Formel tex="Z_3" /> steht aber 9.
          </p>
        }
      />

      <Aufgabe
        nummer={7}
        titel="Vektorschreibweise der Lösungsmenge"
        felder={[
          { id: 's1', name: 'erster Eintrag des Stützvektors', beschriftung: <>Stützvektor, <Formel tex="x_1" /></>, erwartet: a7.stuetz[0]! },
          { id: 's2', name: 'zweiter Eintrag des Stützvektors', beschriftung: <>Stützvektor, <Formel tex="x_2" /></>, erwartet: a7.stuetz[1]! },
          { id: 'r1', name: 'erster Eintrag des Richtungsvektors', beschriftung: <>Richtungsvektor, <Formel tex="x_1" /></>, erwartet: a7.richtung[0]! },
          { id: 'r2', name: 'zweiter Eintrag des Richtungsvektors', beschriftung: <>Richtungsvektor, <Formel tex="x_2" /></>, erwartet: a7.richtung[1]! },
        ]}
        hilfen={[
          <>Setze <Formel tex="x_3=t" /> und löse von unten nach oben. Der Stützvektor gehört zu <Formel tex="t=0" nach="," /> der Richtungsvektor enthält die Zahlen vor <Formel tex="t" nach="." /></>,
          <>Die Lösung hat die Form <Formel tex={t`\vec{x}=\begin{pmatrix}a\\b\\0\end{pmatrix}+t\begin{pmatrix}c\\d\\1\end{pmatrix}`} nach="." /> Gesucht sind <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" nach="." /></>,
        ]}
        loesung={[
          <>
            Die Nullzeile liefert keine Bedingung. Du setzt <Formel tex="x_3=t" nach="." />
            <Matrixfolge zeilen={stufenBild(a7.matrix)} beschreibung="Matrix in Stufenform mit einer Nullzeile" unter={<>Blau: Pivot, grün: Nullzeile.</>} />
          </>,
          <>
            Zeile 2: <Formel tex={t`2x_2+4t=2`} nach="," /> also <Formel tex={t`x_2=1-2t`} nach="." /> Zeile 1: <Formel tex={t`x_1+(1-2t)-t=3`} nach="," /> also <Formel tex={t`x_1=2+3t`} nach="." />
          </>,
          <>
            Stützvektor für <Formel tex="t=0" nach=":" /> <Formel tex={t`(2;\,1;\,0)`} nach="." /> Richtungsvektor: die Zahlen vor <Formel tex="t" nach=":" /> <Formel tex={t`(3;\,-2;\,1)`} nach="." />
            <Lsg m={a7.matrix} form="summe" />
          </>,
        ]}
      >
        <p>
          Gib die Lösungsmenge in der Form Stützvektor plus <Formel tex="t" /> mal Richtungsvektor an, mit <Formel tex="x_3=t" nach="." /> Die dritte Zahl des Stützvektors ist 0, die des Richtungsvektors 1.
        </p>
        <Formel anzeige tex={matrixTeX(a7.matrix)} nach="." />
      </Aufgabe>

      <Aufgabe
        nummer={8}
        titel="Zwei Parameter"
        felder={[
          { id: 'c', name: 'Zahl ohne Parameter in x1', beschriftung: <><Formel tex="x_1" /> ohne Parameter</>, erwartet: a8.werte.c },
          { id: 'a', name: 'Zahl vor s in x1', beschriftung: <>Zahl vor <Formel tex="s" /></>, erwartet: a8.werte.a },
          { id: 'b', name: 'Zahl vor t in x1', beschriftung: <>Zahl vor <Formel tex="t" /></>, erwartet: a8.werte.b },
        ]}
        hilfen={[
          <>Bringe die Matrix mit dem Gauß-Algorithmus in Stufenform. Wie viele Zeilen mit Koeffizienten bleiben?</>,
          <>Es bleibt eine Gleichung. Setze <Formel tex="x_2=s" /> und <Formel tex="x_3=t" /> und löse nach <Formel tex="x_1" /> auf.</>,
        ]}
        loesung={[
          <>
            <Folge m={a8.matrix} beschreibung="Gauß-Algorithmus, zwei Zeilen werden zu Nullzeilen" unter={<>Zwei Nullzeilen (grün), ein Pivot (blau).</>} />
            Es bleibt eine Gleichung für drei Unbekannte, zwei Unbekannte sind frei.
          </>,
          <>
            Die Gleichung lautet <Formel tex={t`x_1-3x_2+2x_3=5`} nach="." /> Mit <Formel tex="x_2=s" /> und <Formel tex="x_3=t" /> folgt <Formel tex={t`x_1=5+3s-2t`} nach="." />
            <Lsg m={a8.matrix} />
          </>,
        ]}
      >
        <p>
          Löse das System. Setze <Formel tex="x_2=s" /> und <Formel tex="x_3=t" /> und gib <Formel tex={t`x_1=c+a\cdot s+b\cdot t`} /> an.
        </p>
        <Formel anzeige tex={matrixTeX(a8.matrix)} nach="." />
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Welcher Wert des Parameters?"
        felder={[{ id: 'p', name: 'Wert von p, für den das System lösbar ist', beschriftung: <><Formel tex="p" /></>, erwartet: AUFGABE9.p }]}
        hilfen={[
          <>Erzeuge Nullen mit <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} /> und <Formel tex={t`Z_3\to Z_3-Z_1`} nach="." /> Achte darauf, welche Zeile zur Zeile mit lauter Nullen links wird.</>,
          <>Die Zeile mit Nullen links lautet <Formel tex="0=\dots" nach="." /> Sie darf kein Widerspruch sein.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} /> ergibt <Formel tex={t`0=p-4`} nach="." /> <Formel tex={t`Z_3\to Z_3-Z_1`} /> ergibt <Formel tex={t`2x_2-2x_3=-2`} nach="." />
          </>,
          <>
            Nach dem Tausch von <Formel tex="Z_2" /> und <Formel tex="Z_3" /> steht die Stufenform da:
            <Formel anzeige tex={AUFGABE9.stufeTeX} nach="." />
            Für <Formel tex={t`p\neq 4`} /> lautet die letzte Zeile <Formel tex={t`0=p-4`} /> mit rechts einer Zahl ungleich 0, das System ist nicht lösbar.
          </>,
          <>
            Für <Formel tex="p=4" /> ist die letzte Zeile <Formel tex="0=0" nach="." /> Es bleiben zwei Pivots für drei Unbekannte, das System ist mehrdeutig lösbar. Mit <Formel tex="x_3=t" /> folgt <Formel tex={t`L=\{(1;\,t-1;\,t)\mid t\in\mathbb{R}\}`} nach="." />
          </>,
        ]}
      >
        <p>
          Für welchen Wert von <Formel tex="p" /> ist das System lösbar? Für alle anderen Werte hat es keine Lösung.
        </p>
        <Formel anzeige tex={t`\begin{aligned}x_1-x_2+x_3&=2\\2x_1-2x_2+2x_3&=p\\x_1+x_2-x_3&=0\end{aligned}`} nach="." />
      </Aufgabe>

      <Aufgabe
        nummer={10}
        titel="Fallunterscheidung mit einem Parameter"
        felder={[
          { id: 'p', name: 'Wert von p, für den das System nicht eindeutig lösbar ist', beschriftung: <>Besonderer Wert von <Formel tex="p" /></>, erwartet: AUFGABE10.p },
          { id: 'x3', name: 'Wert von x3 für alle anderen p', beschriftung: <><Formel tex="x_3" /> für alle anderen <Formel tex="p" /></>, erwartet: AUFGABE10.x3 },
        ]}
        hilfen={[
          <>Erzeuge Nullen unter dem Pivot der ersten Spalte, dann unter dem Pivot der zweiten Spalte. Die letzte Zeile enthält <Formel tex="p" nach="." /></>,
          <>Die letzte Zeile hat die Form <Formel tex={t`(\dots)\cdot x_3=\dots`} nach="." /> Für welchen Wert von <Formel tex="p" /> ist der Faktor vor <Formel tex="x_3" /> gleich 0? Für alle anderen Werte darfst du durch ihn teilen.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} nach="," /> <Formel tex={t`Z_3\to Z_3-Z_1`} /> und <Formel tex={t`Z_3\to Z_3+Z_2`} /> ergeben:
            <Formel anzeige tex={AUFGABE10.stufeTeX} nach="." />
          </>,
          <>
            Die letzte Zeile lautet <Formel tex={t`(p-2)x_3=p-2`} nach="." /> Für <Formel tex={t`p\neq 2`} /> teilst du durch <Formel tex="p-2" /> und erhältst <Formel tex="x_3=1" nach="." /> Das System ist dann eindeutig lösbar.
          </>,
          <>
            Für <Formel tex="p=2" /> lautet die letzte Zeile <Formel tex="0=0" nach="." /> Das System ist mehrdeutig lösbar, nicht eindeutig. Der besondere Wert ist also <Formel tex="p=2" nach="." />
          </>,
        ]}
      >
        <p>
          Für genau einen Wert von <Formel tex="p" /> ist das System nicht eindeutig lösbar. Gib diesen Wert an, und gib an, welchen Wert <Formel tex="x_3" /> für alle anderen <Formel tex="p" /> hat.
        </p>
        <Formel anzeige tex={t`\begin{aligned}x_1+x_2+x_3&=2\\2x_1-x_2+x_3&=1\\x_1+4x_2+px_3&=p+3\end{aligned}`} nach="." />
      </Aufgabe>

      <Aufgabe
        nummer={11}
        titel="Zwei Schreibweisen, eine Lösungsmenge"
        felder={[
          { id: 'a', name: 'Zahl a im Zusammenhang t gleich a plus b mal s', beschriftung: <><Formel tex="a" /></>, erwartet: a11.a },
          { id: 'b', name: 'Zahl b im Zusammenhang t gleich a plus b mal s', beschriftung: <><Formel tex="b" /></>, erwartet: a11.b },
        ]}
        hilfen={[
          <>In <Formel tex="L_1" /> ist <Formel tex={t`x_3=s`} nach="," /> in <Formel tex="L_2" /> ist <Formel tex={t`x_2=t`} nach="." /> Beide beschreiben dasselbe Element, wenn die Einträge übereinstimmen.</>,
          <>Vergleiche die zweiten Einträge: <Formel tex={t`4-s`} /> in <Formel tex="L_1" /> und <Formel tex="t" /> in <Formel tex="L_2" nach="." /></>,
        ]}
        loesung={[
          <>
            Zweiter Eintrag: <Formel tex={t`4-s=t`} nach="." /> Also ist <Formel tex={t`t=4-s`} nach="," /> das heißt <Formel tex="a=4" /> und <Formel tex="b=-1" nach="." />
          </>,
          <>
            Probe: Setzt du <Formel tex={t`t=4-s`} /> in <Formel tex="L_2" /> ein, erhältst du <Formel tex={t`(9-2(4-s);\,4-s;\,4-(4-s))=(1+2s;\,4-s;\,s)`} nach="." /> Das ist <Formel tex="L_1" nach="." /> Jedes Element von <Formel tex="L_1" /> kommt mit <Formel tex="s=4-t" /> auch in <Formel tex="L_2" /> vor. Also gilt <Formel tex="L_1=L_2" nach="." />
          </>,
        ]}
      >
        <p>
          Zwei Lernende lösen dasselbe System. Die eine setzt <Formel tex="x_3=s" nach="," /> der andere <Formel tex="x_2=t" nach="." />
        </p>
        <Formel anzeige tex={t`L_1=\{(1+2s;\,4-s;\,s)\mid s\in\mathbb{R}\}`} nach="," />
        <Formel anzeige tex={t`L_2=\{(9-2t;\,t;\,4-t)\mid t\in\mathbb{R}\}`} nach="." />
        <p>
          Zeige, dass <Formel tex="L_1=L_2" /> gilt. Gib dazu den Zusammenhang <Formel tex={t`t=a+b\cdot s`} /> an.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={12}
        titel="Gleichungssystem zu einer Lösungsmenge"
        felder={[
          { id: 'a', name: 'Zahl a vor x3 in der ersten Gleichung', beschriftung: <><Formel tex="a" /></>, erwartet: a12.werte.a },
          { id: 'b', name: 'rechte Seite b der ersten Gleichung', beschriftung: <><Formel tex="b" /></>, erwartet: a12.werte.b },
          { id: 'c', name: 'Zahl c vor x3 in der zweiten Gleichung', beschriftung: <><Formel tex="c" /></>, erwartet: a12.werte.c },
          { id: 'd', name: 'rechte Seite d der zweiten Gleichung', beschriftung: <><Formel tex="d" /></>, erwartet: a12.werte.d },
        ]}
        hilfen={[
          <>Die Lösungen haben <Formel tex="x_3=r" nach="." /> Drücke <Formel tex="x_1" /> und <Formel tex="x_2" /> durch <Formel tex="x_3" /> aus.</>,
          <>Aus <Formel tex={t`x_1=3-r`} /> mit <Formel tex="r=x_3" /> folgt <Formel tex={t`x_1+x_3=3`} nach="." /> Mache dasselbe mit <Formel tex="x_2" nach="." /></>,
        ]}
        loesung={[
          <>
            Mit <Formel tex={t`r=x_3`} /> gilt <Formel tex={t`x_1=3-x_3`} nach="," /> also <Formel tex={t`x_1+x_3=3`} nach="." /> Das sind <Formel tex="a=1" /> und <Formel tex="b=3" nach="." />
          </>,
          <>
            Aus <Formel tex={t`x_2=1+2x_3`} /> folgt <Formel tex={t`x_2-2x_3=1`} nach="." /> Das sind <Formel tex="c=-2" /> und <Formel tex="d=1" nach="." />
          </>,
          <>
            Probe mit <Formel tex="r=1" nach=":" /> <Formel tex={t`(2;\,3;\,1)`} nach="." /> Es ist <Formel tex="2+1=3" /> und <Formel tex="3-2\cdot 1=1" nach="." />
          </>,
        ]}
      >
        <p>
          Gesucht ist ein Gleichungssystem aus zwei Gleichungen der Form <Formel tex={t`x_1+a\cdot x_3=b`} /> und <Formel tex={t`x_2+c\cdot x_3=d`} nach="," /> das die Lösungsmenge
        </p>
        <Formel anzeige tex={t`L=\{(3-r;\,1+2r;\,r)\mid r\in\mathbb{R}\}`} />
        <p>hat.</p>
      </Aufgabe>
    </Abschnitt>
  );
}
