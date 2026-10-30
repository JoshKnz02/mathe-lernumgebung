import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Matrixfolge } from '@/components/Matrixfolge';
import { Modulverweis } from '@/components/Modulverweis';
import { BE, Teile } from '@/components/Teilaufgaben';
import { folge, gaussSchritte, type Matrix } from '@/lib/lgs';
import { t } from '@/lib/modulhilfen';
import { Verkehrsknoten } from './Bilder';
import { A7, A8 } from './daten';

const TOL = 0.01;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl mit Komma ein, ohne Einheit. Bei den Taschenrechneraufgaben genügt die Rundung auf zwei Nachkommastellen. Rechne mit den ungerundeten Zwischenergebnissen weiter.
    </Hinweis>
  );
}

/** Matrix der Düngemischung in Prozent: Gesamtmenge, Stickstoff, Phosphor. */
const MISCH: Matrix = [[1, 1, 1, A7.gesamt], [...A7.anteil.N, A7.ziel.N * 100], [...A7.anteil.P, A7.ziel.P * 100]];

/** Aufgabe 7: Düngemischung, LGS aufstellen und lösen. */
function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Düngemischung"
      felder={[
        { id: 'a', name: 'Menge der Sorte A in Kilogramm', beschriftung: <>Sorte A in kg</>, erwartet: A7.loesung[0]!, toleranz: TOL },
        { id: 'b', name: 'Menge der Sorte B in Kilogramm', beschriftung: <>Sorte B in kg</>, erwartet: A7.loesung[1]!, toleranz: TOL },
        { id: 'c', name: 'Menge der Sorte C in Kilogramm', beschriftung: <>Sorte C in kg</>, erwartet: A7.loesung[2]!, toleranz: TOL },
        { id: 'p', name: 'Phosphormenge einer Mischung aus A und B in Kilogramm', beschriftung: <>Phosphor in kg ohne C</>, erwartet: A7.zweiSorten.P, toleranz: TOL },
      ]}
      hilfen={[
        <>Wähle Unbekannte: <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> sind die Mengen in kg. Drei Bedingungen ergeben drei Gleichungen: Gesamtmenge, Stickstoff, Phosphor. Anteile in Prozent rechnest du als Dezimalzahl.</>,
        <>Löse mit dem <Modulverweis modul="gauss-algorithmus">Gauß-Algorithmus</Modulverweis> oder mit dem Taschenrechner. Prüfe, ob das System eindeutig lösbar ist.</>,
        <>Teil b: Setze <Formel tex="c=0" nach="." /> Zwei Unbekannte, zwei Gleichungen (Gesamtmenge und Stickstoff). Berechne danach die Phosphormenge dieser Mischung und vergleiche mit dem Ziel.</>,
      ]}
      loesung={[
        <>
          a: Die Bedingungen lauten
          <Formel anzeige tex={t`\begin{aligned}a+b+c&=100\\0{,}20a+0{,}10b+0{,}05c&=12{,}5\\0{,}05a+0{,}10b+0{,}15c&=9{,}5\end{aligned}`} nach="." />
          Mit 100 multipliziert stehen in der zweiten und dritten Gleichung ganze Zahlen. Die Matrix wird mit dem Gauß-Algorithmus umgeformt:
          <Matrixfolge zeilen={folge(MISCH, gaussSchritte(MISCH).map((s) => s.umformung))} beschreibung="Gauß-Algorithmus für die Düngemischung, am Ende stehen drei Pivots" unter={<>Die Zahlen der Gleichungen mit 100 multipliziert. Am Ende stehen drei Pivots.</>} />
        </>,
        <>
          Die Lösung ist <Formel tex={t`a=40`} nach="," /> <Formel tex={t`b=30`} /> und <Formel tex={t`c=30`} nach="." /> Probe: <Formel tex={t`40+30+30=100`} nach="," /> <Formel tex={t`0{,}2\cdot 40+0{,}1\cdot 30+0{,}05\cdot 30=12{,}5`} /> und <Formel tex={t`0{,}05\cdot 40+0{,}1\cdot 30+0{,}15\cdot 30=9{,}5`} nach="." /> Es sind 40 kg der Sorte A und je 30 kg der Sorten B und C.
        </>,
        <>
          b: Für <Formel tex="c=0" /> gilt <Formel tex={t`a+b=100`} /> und <Formel tex={t`0{,}2a+0{,}1b=12{,}5`} nach="." /> Aus der ersten folgt <Formel tex={t`b=100-a`} nach="," /> eingesetzt <Formel tex={t`0{,}1a+10=12{,}5`} nach="," /> also <Formel tex="a=25" /> und <Formel tex="b=75" nach="." /> Die Phosphormenge ist <Formel tex={t`0{,}05\cdot 25+0{,}1\cdot 75=1{,}25+7{,}5=8{,}75`} nach="." /> Es sind 8,75 kg Phosphor.
        </>,
        <>
          c: Eine Mischung aus A und B mit 12,5 kg Stickstoff enthält nur 8,75 kg Phosphor, das Ziel sind 9,5 kg. Beide Ziele sind also ohne Sorte C nicht zu erreichen. Das System aus drei Gleichungen mit <Formel tex="c=0" /> hat keine Lösung. Die Sorte C wird gebraucht, weil sie mehr Phosphor als Stickstoff liefert.
        </>,
      ]}
    >
      <p>
        Ein Gartenbaubetrieb mischt aus drei Düngersorten A, B und C genau 100 kg Dünger. Die Mischung soll 12,5 kg Stickstoff (N) und 9,5 kg Phosphor (P) enthalten. Die Sorten enthalten (in Prozent der Masse):
      </p>
      <ul>
        <li>Sorte A: 20 % Stickstoff, 5 % Phosphor,</li>
        <li>Sorte B: 10 % Stickstoff, 10 % Phosphor,</li>
        <li>Sorte C: 5 % Stickstoff, 15 % Phosphor.</li>
      </ul>
      <Teile>
        <li>
          Bestimmen Sie, wie viel kg von jeder Sorte gemischt werden müssen. Stellen Sie dazu ein Gleichungssystem auf. <BE n={4} />
        </li>
        <li>
          Berechnen Sie, wie viel kg Phosphor eine Mischung aus nur den Sorten A und B mit 100 kg Gesamtmasse und 12,5 kg Stickstoff enthält, falls die Sorte C ausfällt. <BE n={3} />
        </li>
        <li>
          Beurteilen Sie anhand von Teil b, ob das Ziel ohne Sorte C erreichbar ist. <BE n={2} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

/** Aufgabe 8: Verkehrsfluss, Lösungsmenge mit Parameter im Sachzusammenhang. */
function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Verkehrsknoten"
      felder={[
        { id: 'x0', name: 'Zahl ohne t in x', beschriftung: <><Formel tex="x" /> ohne <Formel tex="t" /></>, erwartet: A8.x0 },
        { id: 'z0', name: 'Zahl ohne t in z', beschriftung: <><Formel tex="z" /> ohne <Formel tex="t" /></>, erwartet: A8.z0 },
        { id: 'tmax', name: 'größtmögliche Zahl der Fahrzeuge auf der Verbindung y', beschriftung: <>Größtes mögliches <Formel tex="y" /></>, erwartet: A8.tMax },
        { id: 'zmin', name: 'kleinste Zahl der Fahrzeuge auf z bei Baustelle', beschriftung: <>Kleinstes <Formel tex="z" /></>, erwartet: A8.zMin },
        { id: 'zmax', name: 'größte Zahl der Fahrzeuge auf z bei Baustelle', beschriftung: <>Größtes <Formel tex="z" /></>, erwartet: A8.zMax },
      ]}
      hilfen={[
        <>An jedem Knoten fließt so viel hinein, wie hinausfließt. Das ergibt je eine Gleichung für <Formel tex="K_1" /> und <Formel tex="K_2" nach="." /> Zwei Gleichungen für drei Unbekannte: Eine Unbekannte wird zum Parameter.</>,
        <>Setze <Formel tex="y=t" nach="." /> Aus <Formel tex={t`K_1`} /> folgt <Formel tex="x" nach="," /> aus <Formel tex="K_2" /> folgt <Formel tex="z" nach="." /> Die Zahlen der Fahrzeuge dürfen nicht negativ sein.</>,
        <>Bei der Baustelle ist <Formel tex="t" /> nach oben beschränkt. Welcher Wert von <Formel tex="z" /> gehört zum kleinsten und welcher zum größten erlaubten <Formel tex="t" nach="?" /></>,
      ]}
      loesung={[
        <>
          a: In <Formel tex="K_1" /> fließen 640 Fahrzeuge pro Stunde ein, es fließen <Formel tex="x" /> und <Formel tex="y" /> hinaus. In <Formel tex="K_2" /> fließen <Formel tex="y" /> und 480 hinein, es fließt <Formel tex="z" /> hinaus:
          <Formel anzeige tex={t`\begin{aligned}x+y&=640\\y+480&=z\end{aligned}`} nach="." />
          Mit <Formel tex="y=t" /> ist
          <Formel anzeige tex={t`x=640-t`} />
          <Formel anzeige tex={t`z=480+t`} nach="." />
          <Formel anzeige tex={t`L=\{(640-t;\,t;\,480+t)\mid t\in\mathbb{R}\}`} nach="." />
        </>,
        <>
          b: Es muss <Formel tex={t`x=640-t\ge 0`} /> gelten, also <Formel tex={t`t\le 640`} nach="." /> Außerdem <Formel tex={t`t\ge 0`} nach="." /> Das größtmögliche <Formel tex="y" /> ist also 640: Dann fließt der ganze Verkehr von <Formel tex="K_1" /> nach <Formel tex="K_2" nach="," /> und <Formel tex="x" /> ist 0.
        </>,
        <>
          c: Mit der Baustelle ist <Formel tex={t`0\le t\le 150`} nach="." /> Dann ist <Formel tex={t`z=480+t`} /> zwischen <Formel tex={t`480+0=480`} /> und <Formel tex={t`480+150=630`} nach="." /> Es sind also mindestens 480 und höchstens 630 Fahrzeuge pro Stunde auf <Formel tex="z" nach="." /> Probe für <Formel tex="t=150" nach=":" /> <Formel tex={t`x=490`} nach="," /> <Formel tex={t`490+150=640`} /> und <Formel tex={t`150+480=630`} nach="." />
        </>,
      ]}
    >
      <p>
        An zwei Kreuzungen <Formel tex="K_1" /> und <Formel tex="K_2" /> fließt der Verkehr nach der Skizze. In <Formel tex="K_1" /> fahren pro Stunde 640 Fahrzeuge ein, in <Formel tex="K_2" /> zusätzlich 480 Fahrzeuge. Es fahren <Formel tex="x" /> Fahrzeuge pro Stunde von <Formel tex="K_1" /> nach rechts, <Formel tex="y" /> Fahrzeuge pro Stunde von <Formel tex="K_1" /> nach <Formel tex="K_2" /> und <Formel tex="z" /> Fahrzeuge pro Stunde aus <Formel tex="K_2" /> nach rechts. An jeder Kreuzung fahren genauso viele Fahrzeuge hinaus wie hinein.
      </p>
      <Verkehrsknoten />
      <Teile>
        <li>
          Bestimmen Sie die Lösungsmenge in Abhängigkeit von <Formel tex="y=t" nach="." /> Stellen Sie dazu ein Gleichungssystem für <Formel tex="x" nach="," /> <Formel tex="y" /> und <Formel tex="z" /> auf. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie die größtmögliche Zahl <Formel tex="y" /> im Sachzusammenhang. <BE n={2} />
        </li>
        <li>
          Bestimmen Sie die kleinste und die größte mögliche Zahl <Formel tex="z" nach="," /> wenn wegen einer Baustelle auf der Verbindung von <Formel tex="K_1" /> nach <Formel tex="K_2" /> höchstens 150 Fahrzeuge pro Stunde fahren. <BE n={3} />
        </li>
      </Teile>
    </Aufgabe>
  );
}

export function MitHilfsmittel() {
  return (
    <Abschnitt id="mit-hilfsmittel" titel="Mit Hilfsmittel">
      <Eingabehinweis />
      <Aufgabe7 />
      <Aufgabe8 />
    </Abschnitt>
  );
}
