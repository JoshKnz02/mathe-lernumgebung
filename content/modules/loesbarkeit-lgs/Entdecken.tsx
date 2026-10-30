import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Matrixfolge } from '@/components/Matrixfolge';
import { gaussSchritte, gleichungenTeX, stufenMarke } from '@/lib/lgs';
import { t } from '@/lib/modulhilfen';
import { Folge } from './Bilder';
import { AKTION, AKTION_V3_MOEGLICHKEITEN, LABOR_FAELLE, PARAMETER_SYSTEME } from './daten';
import { Loesbarkeitslabor } from './Loesbarkeitslabor';
import { Parameterlabor } from './Parameterlabor';

const [V1, V2, V3] = AKTION.map((a) => a.matrix) as [(typeof AKTION)[0]['matrix'], (typeof AKTION)[0]['matrix'], (typeof AKTION)[0]['matrix']];
const stufe = (m: typeof V1) => {
  const s = gaussSchritte(m);
  return s[s.length - 1]!.danach;
};
const PA = PARAMETER_SYSTEME[0]!;

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Eine Sonderaktion</h3>
      <p>
        Ein Sportgeschäft will sein Lager räumen und packt drei Pakete <Formel tex="P_1" nach="," /> <Formel tex="P_2" /> und <Formel tex="P_3" nach="." /> Die Zahl der Pakete nennst du <Formel tex="x_1" nach="," /> <Formel tex="x_2" /> und <Formel tex="x_3" nach="." /> Jedes Paket enthält Trinkflaschen, Handtücher und Bälle:
      </p>
      <ul>
        <li><Formel tex="P_1" nach=":" /> 3 Trinkflaschen, 1 Handtuch, Bälle (siehe unten)</li>
        <li><Formel tex="P_2" nach=":" /> 1 Trinkflasche, 2 Handtücher, Bälle</li>
        <li><Formel tex="P_3" nach=":" /> keine Trinkflasche, 2 Handtücher, Bälle</li>
      </ul>
      <p>
        Im Lager liegen 420 Trinkflaschen und 600 Handtücher. Alles soll in Pakete gepackt werden. Bei den Bällen gibt es drei Vorschläge:
      </p>
      <ul>
        <li><strong>Vorschlag 1:</strong> <Formel tex="P_1" /> mit 7 Bällen, <Formel tex="P_2" /> mit 4, <Formel tex="P_3" /> mit 2. Im Lager liegen 1500 Bälle.</li>
        <li><strong>Vorschlag 2:</strong> <Formel tex="P_1" /> mit 2 Bällen, <Formel tex="P_2" /> mit 5, <Formel tex="P_3" /> mit 3. Im Lager liegen 1190 Bälle.</li>
        <li><strong>Vorschlag 3:</strong> <Formel tex="P_1" /> mit 7 Bällen, <Formel tex="P_2" /> mit 4, <Formel tex="P_3" /> mit 2. Im Lager liegen 1440 Bälle.</li>
      </ul>
      <p>
        Das erste System gehört zum ersten Vorschlag. Die Zeilen sind Trinkflaschen, Handtücher und Bälle:
      </p>
      <Formel anzeige tex={gleichungenTeX(V1)} nach="." />

      <h3>Vermutungen</h3>
      <p>Überlege zuerst, bevor du die Beobachtungen vergleichst. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle für jeden Vorschlag das Gleichungssystem auf. Du löst sie mit dem Gauß-Algorithmus. Haben alle drei Systeme genau eine Lösung? Achte beim ersten und dritten Vorschlag auf die Zahlen in den Zeilen: Was fällt dir auf?
          </p>
          <Beobachtung
            bild={
              <>
                <Folge m={V1} beschreibung="Gauß-Algorithmus beim ersten Vorschlag, am Ende steht eine Zeile 0 gleich 180" unter={<>Vorschlag 1: Die letzte Zeile lautet <Formel tex="0=180" nach="." /></>} />
                <Folge m={V3} beschreibung="Gauß-Algorithmus beim dritten Vorschlag, am Ende steht eine Zeile 0 gleich 0" unter={<>Vorschlag 3: Die letzte Zeile lautet <Formel tex="0=0" nach="." /></>} />
              </>
            }
          >
            Nein, nicht alle. Beim ersten und dritten Vorschlag sind die Zahlen der Ball-Zeile <Formel tex={t`7;\,4;\,2`} /> gleich, es ist <Formel tex={t`2\cdot(3;\,1;\,0)+(1;\,2;\,2)=(7;\,4;\,2)`} nach="." /> Die Bälle-Gleichung ist also aus den beiden anderen zusammengesetzt. Wenn das Lager dazu passt, ist sie überflüssig, sonst widerspricht sie den anderen. Dafür müsste bei den Bällen <Formel tex={t`2\cdot 420+600=1440`} /> stehen.
          </Beobachtung>
        </li>
        <li>
          <p>
            Beim ersten Vorschlag liegen 1500 Bälle im Lager. Was erwartest du am Ende des Gauß-Algorithmus? Kann das Geschäft damit sein Lager vollständig räumen?
          </p>
          <Beobachtung
            bild={
              <Matrixfolge
                zeilen={[{ matrix: stufe(V1), beschriftung: 'Stufenform zum ersten Vorschlag', marke: stufenMarke(stufe(V1)) }]}
                beschreibung="Stufenform zum ersten Vorschlag mit einer Widerspruchszeile"
                unter={<>Die letzte Zeile (rosa) bedeutet <Formel tex={t`0x_1+0x_2+0x_3=180`} nach="." /></>}
              />
            }
          >
            Die letzte Zeile lautet <Formel tex="0=180" nach="." /> Diese Gleichung ist für keine Zahlen <Formel tex="x_1" nach="," /> <Formel tex="x_2" nach="," /> <Formel tex="x_3" /> erfüllt, denn die linke Seite ist immer 0. Eine solche Zeile heißt <strong>Widerspruchszeile</strong>. Das System hat keine Lösung, <Formel tex={t`L=\emptyset`} nach="." /> Das Geschäft kann sein Lager mit diesen Paketen nicht vollständig räumen: Es bleiben immer Artikel übrig, oder es fehlen Artikel.
          </Beobachtung>
        </li>
        <li>
          <p>
            Beim dritten Vorschlag liegen 1440 Bälle im Lager, die Pakete sind dieselben wie im ersten Vorschlag. Was erwartest du jetzt? Wie viele Möglichkeiten hat das Geschäft?
          </p>
          <Beobachtung
            bild={
              <Matrixfolge
                zeilen={[{ matrix: stufe(V3), beschriftung: 'Stufenform zum dritten Vorschlag', marke: stufenMarke(stufe(V3)) }]}
                beschreibung="Stufenform zum dritten Vorschlag mit einer Zeile aus lauter Nullen"
                unter={<>Die letzte Zeile (grün) ist <Formel tex="0=0" nach="." /> Die dritte Unbekannte hat kein Pivot.</>}
              />
            }
          >
            Die letzte Zeile lautet <Formel tex="0=0" nach="." /> Sie ist immer wahr und liefert keine Bedingung. Es bleiben zwei Gleichungen für drei Unbekannte, eine Unbekannte ist frei. Mit <Formel tex={t`x_3=t`} /> erhältst du unendlich viele Lösungen. Weil die Zahl der Pakete eine ganze Zahl sein muss, die nicht negativ ist, bleiben im Sachzusammenhang {AKTION_V3_MOEGLICHKEITEN} Möglichkeiten. Du prüfst es in der Aufgabe unten.
          </Beobachtung>
        </li>
        <li>
          <p>
            Beim zweiten Vorschlag haben die Ball-Zahlen keinen Zusammenhang mit den anderen Zeilen. Was erwartest du?
          </p>
          <Beobachtung
            bild={<Folge m={V2} beschreibung="Gauß-Algorithmus beim zweiten Vorschlag, am Ende steht eine Zeile mit nur einer Unbekannten" unter={<>Vorschlag 2: Die letzte Zeile enthält nur noch <Formel tex="x_3" nach="." /></>} />}
          >
            Die letzte Zeile lautet <Formel tex={t`-33x_3=-4290`} nach="," /> also <Formel tex="x_3=130" nach="." /> Rückwärts folgen <Formel tex="x_2=120" /> und <Formel tex="x_1=100" nach="." /> Das System ist eindeutig lösbar, das Geschäft hat genau eine Möglichkeit: <Formel tex={t`L=\{(100;\,120;\,130)\}`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Woran erkennst du an der Stufenform, ob ein System keine, genau eine oder unendlich viele Lösungen hat? Formuliere eine Regel für Zeilen mit lauter Nullen links vom Strich und für die Zahl der Pivots im Vergleich zur Zahl der Unbekannten.
          </p>
          <Beobachtung>
            Du schaust zuerst, ob es eine Widerspruchszeile gibt, also eine Zeile <Formel tex="0=c" /> mit <Formel tex="c\neq 0" nach="." /> Dann ist das System nicht lösbar. Gibt es keine, zählst du die Zeilen mit Koeffizienten (die Pivots). Ist die Zahl so groß wie die Zahl der Unbekannten, ist das System eindeutig lösbar. Ist sie kleiner, bleiben Unbekannte frei und das System ist mehrdeutig lösbar. Die Zahl der freien Unbekannten ist dann Zahl der Unbekannten minus Zahl der Pivots. Die Regel steht in der Zusammenfassung.
          </Beobachtung>
        </li>
        <li>
          <p>
            Kann ein System mit nur zwei Gleichungen und drei Unbekannten eindeutig lösbar sein? Kann ein System mit vier Gleichungen und drei Unbekannten eindeutig lösbar sein? Probiere die Systeme „Zwei Gleichungen“ und „Vier Gleichungen“ im Labor aus.
          </p>
          <Beobachtung
            bild={
              <Folge m={LABOR_FAELLE.find((f) => f.id === 'vier')!.matrix} beschreibung="Gauß-Algorithmus bei vier Gleichungen und drei Unbekannten, am Ende steht eine Nullzeile und das System ist trotzdem eindeutig lösbar" unter={<>Vier Gleichungen: Die vierte Zeile wird zur Nullzeile, drei Pivots bleiben.</>} />
            }
          >
            Bei zwei Gleichungen gibt es höchstens zwei Pivots, aber drei Unbekannte. Also bleibt mindestens eine Unbekannte frei: Das System ist nie eindeutig lösbar, es ist mehrdeutig lösbar oder nicht lösbar. Bei vier Gleichungen kann es eindeutig lösbar sein. Die überzählige Gleichung wird zur Nullzeile <Formel tex="0=0" nach="," /> trotzdem hat jede Unbekannte ein Pivot. Eine Nullzeile allein heißt also noch nicht, dass es unendlich viele Lösungen gibt.
          </Beobachtung>
        </li>
        <li>
          <p>
            Im System A steht der Parameter <Formel tex="p" nach="." /> Für manche Werte von <Formel tex="p" /> ändert sich das Lösungsverhalten. Welche Werte vermutest du?
          </p>
          <Formel anzeige tex={PA.gleichungenTeX} nach="." />
          <Beobachtung
            bild={
              <Matrixfolge
                zeilen={[{ matrix: [[1, 1, 1, 6], [0, -2, 1, -1], [0, 0, 0, -6]], beschriftung: 'Stufenform für p = 1', marke: stufenMarke([[1, 1, 1, 6], [0, -2, 1, -1], [0, 0, 0, -6]]) }]}
                beschreibung="Stufenform des Systems A für p gleich 1 mit einer Widerspruchszeile"
                unter={<>Für <Formel tex="p=1" /> lautet die letzte Zeile <Formel tex="0=-6" nach="." /></>}
              />
            }
          >
            Nach drei Schritten lautet die letzte Zeile <Formel tex={t`(p-1)x_3=-6`} nach="." /> Für <Formel tex="p=1" /> ist das <Formel tex="0=-6" nach="," /> ein Widerspruch: nicht lösbar. Für jedes andere <Formel tex="p" /> kannst du durch <Formel tex="p-1" /> teilen, es folgt <Formel tex={t`x_3=\frac{-6}{p-1}`} /> und das System ist eindeutig lösbar. Genau ein Wert von <Formel tex="p" /> ist besonders. Im Parameterlabor siehst du es.
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor: Die drei Fälle</h3>
      <p>
        Wähle ein System. Du führst den Gauß-Algorithmus Schritt für Schritt aus. Wenn die Stufenform erreicht ist, überlege, welcher Fall vorliegt, und lass dir dann die Auswertung zeigen.
      </p>
      <Loesbarkeitslabor />

      <h3>Labor: Ein Parameter im Gleichungssystem</h3>
      <p>
        Wähle ein System und stelle <Formel tex="p" /> mit dem Regler ein. Das Labor zeigt für jeden Wert die Stufenform, den Fall und die Lösungsmenge. Blende danach die Rechnung mit <Formel tex="p" /> ein.
      </p>
      <Parameterlabor />

      <h3>Aufträge</h3>
      <ol className="auftraege">
        <li>Wähle im ersten Labor „Vorschlag 3“ und „x₁ fehlt“. Welche Unbekannte ist jeweils frei? Wie viele Parameter brauchst du?</li>
        <li>Wähle „Vier Gleichungen“. Warum gibt es trotz der Nullzeile genau eine Lösung?</li>
        <li>Stelle im Parameterlabor bei jedem System alle Werte von <Formel tex="p" /> ein. Für welche <Formel tex="p" /> ändert sich der Fall? Gibt es ein System, das für kein <Formel tex="p" /> eindeutig lösbar ist?</li>
        <li>Vergleiche System A und System B. Beide haben dieselben Zeilen bis auf die rechte Seite von Zeile 3. Warum ist System A für <Formel tex="p=1" /> nicht lösbar, System B aber mehrdeutig lösbar?</li>
      </ol>
      <p className="klein">
        Zu System C: Die Rechnung mit <Formel tex="p" /> enthält den Schritt <Formel tex={t`Z_3\to Z_3+(p-1)\cdot Z_2`} nach="." /> Hier wird die Zeile <Formel tex="Z_3" /> mit dem Faktor 1 ersetzt und ein Vielfaches von <Formel tex="Z_2" /> addiert. Das ist für jeden Wert von <Formel tex="p" /> erlaubt, auch für <Formel tex="p=1" nach="." />
      </p>
    </Abschnitt>
  );
}
