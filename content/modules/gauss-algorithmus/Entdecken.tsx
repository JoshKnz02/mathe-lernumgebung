import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Matrixfolge } from '@/components/Matrixfolge';
import { bruch, folge, tupelTeX } from '@/lib/lgs';
import { t } from '@/lib/modulhilfen';
import { BEISPIEL1, ENTDECKEN_ERSETZE, ENTDECKEN_NULL, ENTDECKEN_TAUSCH, ENTDECKEN_ZWEITE_LOESUNG } from './daten';
import { Zeilenlabor } from './Zeilenlabor';

const LOESUNG = tupelTeX(BEISPIEL1.loesung.map((x) => bruch(x)));
const ZWEITE = tupelTeX(ENTDECKEN_ZWEITE_LOESUNG.map((x) => bruch(x)));

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutungen</h3>
      <p>
        Das System aus Beispiel 1 hat die Lösung <Formel tex={LOESUNG} nach="." /> Überlege zuerst, bevor du die Beobachtungen vergleichst. Notiere deine Vermutungen.
      </p>
      <ol className="auftraege">
        <li>
          <p>
            Du vertauschst in Beispiel 1 die Zeilen <Formel tex="Z_1" /> und <Formel tex="Z_3" nach="." /> Ändert sich dadurch die Lösung? Prüfe es mit der Probe an den neuen Zeilen.
          </p>
          <Beobachtung
            bild={
              <Matrixfolge
                zeilen={folge(BEISPIEL1.start, ENTDECKEN_TAUSCH)}
                beschreibung="Ausgangsmatrix und die Matrix nach dem Tausch der ersten und dritten Zeile"
                unter={<>Die Gleichungen stehen nur in anderer Reihenfolge. Die Zahlen <Formel tex="x_1=2" nach="," /> <Formel tex="x_2=1" /> und <Formel tex="x_3=3" /> erfüllen jede Zeile wie vorher.</>}
              />
            }
          >
            Die Lösung bleibt dieselbe. Ein Gleichungssystem ist eine Sammlung von Bedingungen, ihre Reihenfolge spielt keine Rolle. Zum Beispiel gilt für die neue erste Zeile <Formel tex={t`-2\cdot 2+5\cdot 1+3\cdot 3=10`} nach="." /> Du darfst Zeilen also tauschen, vor allem dann, wenn das Pivot sonst 0 wäre.
          </Beobachtung>
        </li>
        <li>
          <p>
            Du ersetzt in Beispiel 1 die Zeile <Formel tex="Z_2" /> durch <Formel tex={t`Z_2+3\cdot Z_1`} nach="." /> Die neue Zeile sieht ganz anders aus. Erfüllt <Formel tex={LOESUNG} /> sie trotzdem noch?
          </p>
          <Beobachtung
            bild={
              <Matrixfolge
                zeilen={folge(BEISPIEL1.start, ENTDECKEN_ERSETZE)}
                beschreibung="Ausgangsmatrix und die Matrix nach dem Ersetzen der zweiten Zeile durch die zweite Zeile plus das Dreifache der ersten"
                unter={<>Die neue zweite Zeile ist <Formel tex={t`(10,\,0,\,-1\mid 17)`} nach="." /> Eingesetzt: <Formel tex={t`10\cdot 2+0\cdot 1-1\cdot 3=17`} nach="." /></>}
              />
            }
          >
            Ja. Die neue Zeile lautet <Formel tex={t`10x_1-x_3=17`} nach="." /> Mit <Formel tex="x_1=2" /> und <Formel tex="x_3=3" /> ist <Formel tex={t`20-3=17`} nach="." /> Das gilt immer: Wenn <Formel tex="Z_1" /> und <Formel tex="Z_2" /> für eine Lösung stimmen, stimmt auch jede Summe von Vielfachen der beiden. Zusätzlich fällt auf, dass die Zeile eine Null enthält. Mit solchen Umformungen erzeugst du gezielt Nullen.
          </Beobachtung>
        </li>
        <li>
          <p>
            Du multiplizierst <Formel tex="Z_2" /> mit 0. Das sieht nach einer Umformung wie jede andere aus. Warum verlangt der Merksatz bei der Multiplikation <Formel tex="k\neq 0" nach="?" />
          </p>
          <Beobachtung
            bild={
              <Matrixfolge
                zeilen={[{ matrix: BEISPIEL1.start }, { vermerkTeX: t`Z_2\to 0\cdot Z_2`, matrix: ENTDECKEN_NULL }]}
                beschreibung="Ausgangsmatrix und die Matrix nach dem Multiplizieren der zweiten Zeile mit 0, die zweite Zeile besteht nur aus Nullen"
                unter={<>Die zweite Zeile lautet jetzt <Formel tex="0=0" nach="." /> Die Gleichung stellt keine Bedingung mehr.</>}
              />
            }
          >
            Aus <Formel tex="Z_2" /> wird die Zeile <Formel tex="0=0" nach="." /> Sie ist immer wahr und sagt nichts mehr aus. Dadurch bekommt das System zusätzliche Lösungen. Zum Beispiel erfüllt <Formel tex={ZWEITE} /> die Zeilen <Formel tex="Z_1" /> und <Formel tex="Z_3" nach="," /> aber das ursprüngliche System nicht, denn in <Formel tex="Z_2" /> ergibt sich <Formel tex={t`4\cdot 0-3\cdot 2+2\cdot 0=-6\neq 11`} nach="." /> Die Lösungsmenge hat sich also geändert. Deshalb muss bei <Formel tex="a" /> und <Formel tex="k" /> immer gelten: ungleich 0.
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor</h3>
      <p>
        Wähle ein System und forme es Schritt für Schritt um. Das Ziel ist die Stufenform. Wähle dazu die Umformung, trage die Zeilen und die Faktoren ein und klicke auf „Ausführen“. Unter der Matrix siehst du bei jedem Schritt, ob die bekannte Lösung die Zeilen noch erfüllt. Wenn du nicht weiterkommst, hilft der Tipp. Nicht erlaubte Umformungen führt das Labor nicht aus und sagt dir, warum.
      </p>
      <Zeilenlabor />

      <h3>Aufträge</h3>
      <ol className="auftraege">
        <li>Wähle System A und bringe es in Stufenform. Notiere jeden Rechenvermerk. Wie viele Schritte brauchst du mindestens?</li>
        <li>Wähle System C. Warum geht es nicht ohne einen Zeilentausch? Probiere zuerst <Formel tex={t`Z_2\to Z_2-3\cdot Z_1`} nach="." /> Was fällt dir auf?</li>
        <li>Beobachte in jedem System die Probe nach jedem Schritt. Wann kann sie kippen? Probiere dazu eine Umformung mit dem Faktor 0 aus und lies die Meldung.</li>
        <li>Wähle System B und erzeuge die Nullen zuerst in der zweiten, dann in der dritten Zeile. Unterscheiden sich die Stufenformen von der ersten Variante? Bleibt die Lösung dieselbe?</li>
      </ol>
    </Abschnitt>
  );
}
