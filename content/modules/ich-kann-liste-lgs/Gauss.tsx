import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Matrixfolge } from '@/components/Matrixfolge';
import { Modulverweis } from '@/components/Modulverweis';
import { folge, gaussSchritte, gleichungenTeX } from '@/lib/lgs';
import { t } from '@/lib/modulhilfen';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Punkt } from './Punkt';
import { K4 } from './werte';

/** Bereich Gauß-Algorithmus: Aussage 4. */
export function Gauss() {
  return (
    <Abschnitt id="gauss" titel="Gauß-Algorithmus">
      <p>Hier geht es um das systematische Lösen eines Systems mit drei Unbekannten.</p>
      <Eingabehinweis />

      <Punkt id="gauss">
        <Kontrolle
          aussage="gauss"
          nummer="K4"
          titel="Gauß-Algorithmus"
          felder={[
            { id: 'x1', name: 'Lösung x1', beschriftung: <Formel tex="x_1" />, erwartet: K4.loesung[0]! },
            { id: 'x2', name: 'Lösung x2', beschriftung: <Formel tex="x_2" />, erwartet: K4.loesung[1]! },
            { id: 'x3', name: 'Lösung x3', beschriftung: <Formel tex="x_3" />, erwartet: K4.loesung[2]! },
          ]}
          hilfen={[
            <>Schreibe die erweiterte Koeffizientenmatrix auf und erzeuge Nullen unterhalb der Hauptdiagonalen (Modul <Modulverweis modul="gauss-algorithmus">Gauß-Algorithmus</Modulverweis>).</>,
            <>Das Pivot der ersten Spalte ist die 2. Mit <Formel tex={t`Z_2\to 2\cdot Z_2-Z_1`} /> und <Formel tex={t`Z_3\to 2\cdot Z_3-3\cdot Z_1`} /> entstehen die Nullen darunter.</>,
          ]}
          loesung={[
            <>
              Die Matrix wird in Stufenform gebracht:
              <Matrixfolge
                zeilen={folge(K4.matrix, gaussSchritte(K4.matrix).map((s) => s.umformung))}
                beschreibung="Gauß-Algorithmus für die Kontrollaufgabe, am Ende stehen drei Pivots"
                unter={<>Blau: Pivot, orange: erzeugte Null.</>}
              />
            </>,
            <>
              Die letzte Zeile bedeutet <Formel tex={t`40x_3=120`} nach="," /> also <Formel tex="x_3=3" nach="." /> Aus Zeile 2 folgt <Formel tex={t`-7x_2+5\cdot 3=1`} nach="," /> also <Formel tex="x_2=2" nach="." /> Aus Zeile 1 folgt <Formel tex={t`2x_1+2-3=1`} nach="," /> also <Formel tex="x_1=1" nach="." />
            </>,
            <>
              Probe im Ausgangssystem: <Formel tex={t`2+2-3=1`} nach="," /> <Formel tex={t`1-6+6=1`} /> und <Formel tex={t`3+4+3=10`} nach="." /> Die Lösungsmenge ist <Formel tex={t`L=\{(1;\,2;\,3)\}`} nach="." />
            </>,
          ]}
        >
          <p>Löse das Gleichungssystem mit dem Gauß-Algorithmus und gib den Lösungsvektor an.</p>
          <Formel anzeige tex={gleichungenTeX(K4.matrix)} nach="." />
        </Kontrolle>
      </Punkt>
    </Abschnitt>
  );
}
