import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { AufKlick } from '@/components/AufKlick';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage, type Option } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { Hinweis } from '@/components/Hinweis';
import { uhrzeit } from '@/lib/modell';
import { wertTrig } from '@/lib/sinus';
import { zahlText, zahlTex } from '@/lib/zahlen';
import { Anpassungslabor } from './Anpassungslabor';
import {
  FA_GRENZE, FREIBURG, FREIBURG_E, G1, G1_E, GA_ABBILDUNGEN, HAFEN, HAFEN_E, JULIAN, LUNGE, LUNGE_E, MONATE, PREIS, PREIS_E,
  SONNE, SONNE_E, STUTTGART, STUTTGART_TABELLE,
} from './daten';
import { MODELLBILD, MODELLBILD_DATEN, Modellbild } from './Modellbild';
import { Parameterlabor } from './Parameterlabor';
import { Zeitschaubild } from './Zeitschaubild';

const PI = Math.PI;
const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });
/** Dezimalzahl mit drei Nachkommastellen in TeX, damit Zwischenschritte im Lösungsweg stimmig rechnen. */
const d3 = (v: number) => String(Math.round(v * 1000) / 1000).replace('.', '{,}');
const z2 = zahlTex;

/** Setzt die richtige Antwort an die Stelle k (0 = erste), damit sie nicht immer oben steht. Die Reihenfolge der übrigen bleibt. */
function platziere(optionen: Option[], k: number): Option[] {
  const i = optionen.findIndex((o) => o.richtig);
  const rest = optionen.filter((_, j) => j !== i);
  return [...rest.slice(0, k), optionen[i]!, ...rest.slice(k)];
}

function Bild({ children, bild }: { children: ReactNode; bild: ReactNode }) {
  return (
    <figure className="bild">
      {bild}
      <figcaption>{children}</figcaption>
    </figure>
  );
}

export default function Modul() {
  return (
    <>
      <Abschnitt id="vorgehen" titel="Vorgehen">
        <h3>Worum es geht</h3>
        <p>
          Viele Vorgänge wiederholen sich regelmäßig: Ebbe und Flut, das Atmen, die Temperatur im Verlauf eines Jahres oder saisonale Preise. Solche <strong>periodischen Vorgänge</strong> beschreibst du mit einer Sinus- oder Kosinusfunktion. In diesem Modul wendest du an, was du in den Modulen davor gelernt hast. Es kommt kein neuer Stoff dazu.
        </p>

        <h3>Schritt für Schritt</h3>
        <ol className="liste">
          <li>
            <strong>Situation verstehen.</strong> Was ist <Formel tex="x" /> (zum Beispiel die Zeit, in welcher Einheit?) und was ist <Formel tex="f(x)" />? Welche Angaben sind gegeben: größter Wert, kleinster Wert, Periode, die Stelle eines Hochpunkts?
          </li>
          <li>
            <strong>Funktionsterm aufstellen</strong> in der Form <Formel tex="f(x)=a\cdot\cos\bigl(b\,(x-c)\bigr)+d" /> oder mit Sinus. Die Tabelle unten zeigt, wie du <Formel tex="a" />, <Formel tex="b" />, <Formel tex="c" /> und <Formel tex="d" /> aus den Angaben bestimmst.
          </li>
          <li>
            <strong>Frage in Mathematik übersetzen.</strong> „Wann ist der Wert genau <Formel tex="k" />?“ ergibt die Gleichung <Formel tex="f(x)=k" />. „Wann ist der Wert größer (kleiner) als <Formel tex="k" />?“ ergibt eine Ungleichung. Du löst zuerst die Gleichung <Formel tex="f(x)=k" />. Die Skizze zeigt dir dann, auf welcher Seite der Lösungen die Ungleichung erfüllt ist.
          </li>
          <li>
            <strong>Gleichung lösen</strong> wie im Modul „Trigonometrische Gleichungen“: umformen, substituieren, <Formel tex="u_1" /> und <Formel tex="u_2" /> bestimmen, zurückrechnen, weitere Lösungen mit der Periode <Formel tex="p" /> und nur Lösungen im Definitionsbereich behalten.
          </li>
          <li>
            <strong>Im Zusammenhang antworten.</strong> Gib das Ergebnis mit Einheit in einem Antwortsatz an, zum Beispiel als Uhrzeit oder Datum. Prüfe, ob die Antwort zur Situation passt.
          </li>
        </ol>

        <h3>Funktionsterm aus den Angaben</h3>
        <table className="tabelle">
          <caption>So werden <Formel tex="a" />, <Formel tex="b" />, <Formel tex="c" /> und <Formel tex="d" /> bestimmt</caption>
          <thead>
            <tr>
              <th scope="col">Gesucht</th>
              <th scope="col">Rechnung</th>
              <th scope="col">Bedeutung</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row"><Formel tex="d" /></th><td><Formel tex={String.raw`d=\dfrac{y_{\max}+y_{\min}}{2}`} /></td><td>Ruhelage, Mitte zwischen größtem und kleinstem Wert</td></tr>
            <tr><th scope="row"><Formel tex="a" /></th><td><Formel tex={String.raw`|a|=\dfrac{y_{\max}-y_{\min}}{2}`} /></td><td>Abstand der Ruhelage zum größten Wert</td></tr>
            <tr><th scope="row"><Formel tex="b" /></th><td><Formel tex={String.raw`b=\dfrac{2\pi}{p}`} /></td><td>Je kürzer die Periode, desto größer <Formel tex="b" /></td></tr>
            <tr>
              <th scope="row"><Formel tex="c" /></th>
              <td>Kosinus, <Formel tex="a>0" />: <Formel tex="c=x_{\text{HP}}" /><br />Kosinus, <Formel tex="a<0" />: <Formel tex="c=x_{\text{TP}}" /><br />Sinus, <Formel tex="a>0" />: <Formel tex={String.raw`c=x_{\text{HP}}-\tfrac{p}{4}`} /></td>
              <td>Stelle des Referenzpunkts</td>
            </tr>
          </tbody>
        </table>
        <Hinweis titel="Denkhinweis zu b">
          Die Periode ist <Formel tex={String.raw`p=\tfrac{2\pi}{b}`} />. Ein großes <Formel tex="b" /> bedeutet also eine kurze Periode: <Formel tex="b=3" /> staucht das Schaubild in x-Richtung auf ein Drittel.
        </Hinweis>

        <Bild bild={<Modellbild />}>
          Beispiel: größter Wert {MODELLBILD_DATEN.ymax} bei <Formel tex={`x=${MODELLBILD_DATEN.xHoch}`} />, kleinster Wert {MODELLBILD_DATEN.ymin}, Periode {MODELLBILD_DATEN.periode}. Daraus folgt <Formel tex={`d=\\frac{10+2}{2}=${MODELLBILD.d}`} />, <Formel tex={`a=\\frac{10-2}{2}=${MODELLBILD.a}`} />, <Formel tex={`b=\\frac{2\\pi}{8}=\\frac{\\pi}{4}`} /> und <Formel tex={`c=${MODELLBILD.c}`} />, also <Formel tex={String.raw`f(x)=4\cos\!\left(\tfrac{\pi}{4}(x-1)\right)+6`} />.
        </Bild>

        <Hinweis titel="Gestufte Hilfen">
          Zu jeder Aufgabe im nächsten Abschnitt gibt es Hilfen, die du nacheinander aufdecken kannst. Versuche die Aufgabe zuerst allein. Decke immer nur so viel auf, wie du brauchst. Auch der Lösungsweg erscheint Schritt für Schritt.
        </Hinweis>
      </Abschnitt>

      <Abschnitt id="modellieren" titel="Modellieren">
        <p>
          Gib Zahlen als Dezimalzahl (<code>0,87</code>), als Bruch (<code>1/3</code>) oder als Vielfaches von <Formel tex="\pi" /> (<code>pi/6</code>) ein. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert, wo es nicht anders steht. Bei jeder Aufgabe kannst du am Ende ein Schaubild zur Kontrolle einblenden.
        </p>

        <h3>Gezeiten</h3>
        <Aufgabe
          nummer={1}
          titel="Wasserstand im Hafen"
          felder={[
            { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: HAFEN.a },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: HAFEN.b },
            { id: 'c', name: 'Parameter c', beschriftung: <Formel tex="c" />, erwartet: HAFEN.c },
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: HAFEN.d },
            { id: 'v1', name: 'Beginn des ersten Zeitraums in Minuten nach Mitternacht', beschriftung: <>Beginn Zeitraum 1 (min)</>, erwartet: HAFEN_E.min[0], toleranz: 1 },
            { id: 'e1', name: 'Ende des ersten Zeitraums in Minuten nach Mitternacht', beschriftung: <>Ende Zeitraum 1 (min)</>, erwartet: HAFEN_E.min[1], toleranz: 1 },
            { id: 'v2', name: 'Beginn des zweiten Zeitraums in Minuten nach Mitternacht', beschriftung: <>Beginn Zeitraum 2 (min)</>, erwartet: HAFEN_E.min[2], toleranz: 1 },
            { id: 'e2', name: 'Ende des zweiten Zeitraums in Minuten nach Mitternacht', beschriftung: <>Ende Zeitraum 2 (min)</>, erwartet: HAFEN_E.min[3], toleranz: 1 },
          ]}
          hilfen={[
            <>Aus dem größten Wert 11,6 und dem kleinsten Wert 5,4 erhältst du <Formel tex="d" /> (Mitte) und <Formel tex="a" /> (halber Unterschied). Um 2:00 Uhr liegt ein Hochpunkt, er ist der Referenzpunkt für den Kosinus mit <Formel tex="a>0" />.</>,
            <>Die Periode ist <Formel tex="p=12" /> (Stunden). Daraus folgt <Formel tex={String.raw`b=\tfrac{2\pi}{p}`} />. Der Ansatz ist <Formel tex="f(t)=a\cdot\cos\bigl(b\,(t-c)\bigr)+d" />.</>,
            <>Das Schiff kann einlaufen, solange <Formel tex="f(t)\ge 11" /> gilt. Löse zuerst <Formel tex="f(t)=11" />: umformen nach <Formel tex={String.raw`\cos(\dots)=\dots`} />, substituieren mit <Formel tex={String.raw`u=\tfrac{\pi}{6}(t-2)`} />, <Formel tex={String.raw`u_1=\cos^{-1}(\dots)`} /> und <Formel tex="u_2=-u_1" />.</>,
            <>Rechne mit <Formel tex={String.raw`t=\tfrac{6}{\pi}u+2`} /> zurück. Addiere die Periode 12, um die Lösungen für den zweiten Flutberg zu erhalten. Die Skizze zeigt: Zwischen den beiden Lösungen um jeden Hochpunkt ist der Wasserstand mindestens 11 m. Die Minuten erhältst du aus Dezimalstunden mal 60.</>,
          ]}
          loesung={[
            <><Formel tex={`d=\\dfrac{11{,}6+5{,}4}{2}=${z2(HAFEN.d)}`} />, <Formel tex={`a=\\dfrac{11{,}6-5{,}4}{2}=${z2(HAFEN.a)}`} />, <Formel tex={String.raw`b=\dfrac{2\pi}{12}=\dfrac{\pi}{6}`} />, <Formel tex="c=2" />. Also <Formel tex={String.raw`f(t)=3{,}1\cos\!\left(\tfrac{\pi}{6}(t-2)\right)+8{,}5`} />.</>,
            <>Gleichung <Formel tex="f(t)=11" />: <Formel tex={String.raw`3{,}1\cos(\dots)=2{,}5`} />, also <Formel tex={`\\cos(u)=\\tfrac{2{,}5}{3{,}1}=${d3(2.5 / 3.1)}`} /> mit <Formel tex={String.raw`u=\tfrac{\pi}{6}(t-2)`} />.</>,
            <><Formel tex={`u_1=\\cos^{-1}\\left(\\tfrac{2{,}5}{3{,}1}\\right)=${d3(Math.acos(2.5 / 3.1))}`} /> und <Formel tex={`u_2=-u_1=${d3(-Math.acos(2.5 / 3.1))}`} />.</>,
            <>Rücksubstitution <Formel tex={String.raw`t=\tfrac{6}{\pi}u+2`} />: <Formel tex={`t_1=${d3(HAFEN_E.bereiche[0]!.von)}`} /> und <Formel tex={`t_2=${d3(HAFEN_E.bereiche[0]!.bis)}`} />. Mit der Periode 12 folgen <Formel tex={`${d3(HAFEN_E.bereiche[1]!.von)}`} /> und <Formel tex={`${d3(HAFEN_E.bereiche[1]!.bis)}`} />. Alle liegen in <Formel tex="[0;\,24]" />.</>,
            <>Umrechnung in Minuten: <Formel tex={`${d3(HAFEN_E.bereiche[0]!.von)}\\cdot 60=${d3(HAFEN_E.bereiche[0]!.von * 60)}`} /> min und <Formel tex={`${d3(HAFEN_E.bereiche[0]!.bis)}\\cdot 60=${d3(HAFEN_E.bereiche[0]!.bis * 60)}`} /> min. Der Beginn wird auf {HAFEN_E.min[0]} min aufgerundet, das Ende auf {HAFEN_E.min[1]} min abgerundet, damit die Wassertiefe im ganzen Zeitraum reicht.</>,
            <>Antwort: Das Schiff kann an diesem Tag zwischen {uhrzeit(HAFEN_E.bereiche[0]!.von, 'auf')} Uhr und {uhrzeit(HAFEN_E.bereiche[0]!.bis, 'ab')} Uhr sowie zwischen {uhrzeit(HAFEN_E.bereiche[1]!.von, 'auf')} Uhr und {uhrzeit(HAFEN_E.bereiche[1]!.bis, 'ab')} Uhr den Hafen anlaufen.</>,
          ]}
        >
          <p>
            In einem Hafen schwankt der Wasserstand periodisch mit Ebbe und Flut. An einem bestimmten Tag wird um 2:00 Uhr morgens der höchste Wasserstand von 11,6 m gemessen. Später beträgt der niedrigste Wasserstand 5,4 m. Vereinfacht wiederholen sich Ebbe und Flut alle 12 Stunden (Zeit zwischen zwei Hochwassern).
          </p>
          <p>
            Ein Containerschiff benötigt eine Wassertiefe von mindestens 11 m. In welchen Zeiträumen kann es an diesem Tag den Hafen anlaufen? Dabei ist <Formel tex="t" /> die Zeit in Stunden nach Mitternacht mit <Formel tex="0\le t\le 24" />. Bestimme zuerst den Funktionsterm <Formel tex="f(t)=a\cdot\cos\bigl(b\,(t-c)\bigr)+d" />. Gib dann die Zeiträume auf die Minute genau an, als Minuten nach Mitternacht (zum Beispiel 1:30 Uhr = 90).
          </p>
          <AufKlick einblenden="Schaubild mit Zeiträumen einblenden" ausblenden="Schaubild ausblenden">
            <Zeitschaubild
              f={(t) => wertTrig(HAFEN, t, 'cos')}
              schwelle={11}
              bereich={[-1, 25, -1.5, 13.5]}
              xTeilung={2}
              yTeilung={2}
              markiert={HAFEN_E.bereiche}
              punkte={[
                { x: HAFEN_E.bereiche[0]!.von, y: 11, text: uhrzeit(HAFEN_E.bereiche[0]!.von, 'auf') },
                { x: HAFEN_E.bereiche[0]!.bis, y: 11, text: uhrzeit(HAFEN_E.bereiche[0]!.bis, 'ab') },
                { x: HAFEN_E.bereiche[1]!.von, y: 11, text: uhrzeit(HAFEN_E.bereiche[1]!.von, 'auf') },
                { x: HAFEN_E.bereiche[1]!.bis, y: 11, text: uhrzeit(HAFEN_E.bereiche[1]!.bis, 'ab') },
              ]}
              beschreibung="Schaubild des Wasserstands in Metern über der Zeit in Stunden von 0 bis 24 mit der Geraden y gleich 11. Die grün markierten Zeiträume liegen von 0:48 Uhr bis 3:12 Uhr und von 12:48 Uhr bis 15:12 Uhr, dort ist der Wasserstand mindestens 11 Meter."
            />
          </AufKlick>
        </Aufgabe>

        <h3>Atmung</h3>
        <Aufgabe
          nummer={2}
          titel="Luftvolumen in der Lunge"
          felder={[
            { id: 'min', name: 'Minimale Luftmenge in Litern', beschriftung: <>minimale Luftmenge (l)</>, erwartet: LUNGE_E.min },
            { id: 'p', name: 'Dauer eines Atemzugs in Sekunden', beschriftung: <>Dauer eines Atemzugs (s)</>, erwartet: LUNGE_E.periode },
            { id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: LUNGE.a },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: LUNGE.b },
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: LUNGE.d },
            { id: 'x1', name: 'Erster Zeitpunkt', beschriftung: <><Formel tex="x_1" /> (s)</>, erwartet: LUNGE_E.drei[0], toleranz: 0.01 },
            { id: 'x2', name: 'Zweiter Zeitpunkt', beschriftung: <><Formel tex="x_2" /> (s)</>, erwartet: LUNGE_E.drei[1], toleranz: 0.01 },
            { id: 'x3', name: 'Dritter Zeitpunkt', beschriftung: <><Formel tex="x_3" /> (s)</>, erwartet: LUNGE_E.drei[2], toleranz: 0.01 },
          ]}
          hilfen={[
            <>Welcher markante Punkt des Schaubilds liefert das kleinste Luftvolumen? Lies die y-Koordinate ab.</>,
            <>Die Periode ist der Abstand zweier benachbarter Tiefpunkte (oder Hochpunkte). Lies sie im Schaubild ab.</>,
            <>Ansatz <Formel tex="f(x)=a\cdot\cos(bx)+d" /> mit <Formel tex="x\ge 0" />. Betrag von <Formel tex="a" /> aus größtem und kleinstem Wert, <Formel tex="a<0" />, weil der Tiefpunkt auf der y-Achse als Referenzpunkt dient. <Formel tex={String.raw`b=\tfrac{2\pi}{p}`} /> und <Formel tex={String.raw`d=\tfrac{y_{\max}+y_{\min}}{2}`} />.</>,
            <>Gesucht sind Zeitpunkte mit <Formel tex={String.raw`f(x)=\tfrac{1}{2}y_{\max}`} />. Gleichung nach <Formel tex={String.raw`\cos(\dots)=\dots`} /> umformen, substituieren (<Formel tex="u=bx" />), <Formel tex="u_1" /> und <Formel tex="u_2=-u_1" /> bestimmen, zurückrechnen. Weitere Lösungen erhältst du erst nach der Rücksubstitution durch Addieren der Periode <Formel tex="p" />.</>,
          ]}
          loesung={[
            <>a) Der Tiefpunkt liefert die kleinste Luftmenge: <Formel tex="y_{\min}=1{,}5" /> Liter.</>,
            <>b) Zwei benachbarte Tiefpunkte liegen bei <Formel tex="x=0" /> und <Formel tex="x=5" />. Ein vollständiger Atemzug dauert <Formel tex="p=5" /> Sekunden.</>,
            <>c) <Formel tex={String.raw`|a|=\tfrac{4{,}5-1{,}5}{2}=1{,}5`} /> und <Formel tex="a=-1{,}5" /> (Referenzpunkt Tiefpunkt). <Formel tex={String.raw`b=\tfrac{2\pi}{5}`} />, <Formel tex={String.raw`d=\tfrac{4{,}5+1{,}5}{2}=3`} />. Also <Formel tex={String.raw`f(x)=-1{,}5\cos\!\left(\tfrac{2\pi}{5}x\right)+3`} />.</>,
            <>d) Die Hälfte von <Formel tex="4{,}5" /> ist <Formel tex="2{,}25" />. Aus <Formel tex={String.raw`-1{,}5\cos\!\left(\tfrac{2\pi}{5}x\right)+3=2{,}25`} /> folgt <Formel tex={String.raw`\cos\!\left(\tfrac{2\pi}{5}x\right)=\tfrac{1}{2}`} />.</>,
            <>Substitution <Formel tex={String.raw`u=\tfrac{2\pi}{5}x`} />: <Formel tex={String.raw`u_1=\cos^{-1}\!\left(\tfrac{1}{2}\right)=\tfrac{\pi}{3}`} /> und <Formel tex={String.raw`u_2=-\tfrac{\pi}{3}`} />. Rücksubstitution <Formel tex={String.raw`x=\tfrac{5}{2\pi}u`} />: <Formel tex={String.raw`x_1=\tfrac{5}{6}\approx 0{,}83`} /> und <Formel tex={String.raw`x_2=-\tfrac{5}{6}`} />.</>,
            <>Mit der Periode <Formel tex="p=5" />: <Formel tex={String.raw`x_2+5=\tfrac{25}{6}\approx 4{,}17`} /> und <Formel tex={String.raw`x_1+5=\tfrac{35}{6}\approx 5{,}83`} />. Der negative Wert <Formel tex={String.raw`-\tfrac{5}{6}`} /> gehört nicht zu <Formel tex="x\ge 0" />. Nach etwa 0,83 s, 4,17 s und 5,83 s enthält die Lunge jeweils die Hälfte des größten Luftvolumens.</>,
          ]}
        >
          <p>
            Das Diagramm zeigt den zeitlichen Verlauf des Luftvolumens in der Lunge. Dabei ist <Formel tex="x" /> die Zeit in Sekunden und <Formel tex="f(x)" /> das Luftvolumen in Litern.
          </p>
          <Zeitschaubild
            f={(x) => wertTrig(LUNGE, x, 'cos')}
            bereich={[-0.7, 13.5, -0.8, 5.2]}
            xTeilung={1}
            yTeilung={1}
            beschreibung="Diagramm des Luftvolumens in Litern über der Zeit in Sekunden. Das Schaubild beginnt im Tiefpunkt bei 1,5 Litern, hat bei 2,5 Sekunden einen Hochpunkt bei 4,5 Litern und den nächsten Tiefpunkt bei 5 Sekunden. Es wiederholt sich alle 5 Sekunden."
          />
          <ol className="auftraege">
            <li>Wie groß ist die minimale Luftmenge in der Lunge?</li>
            <li>Wie lange dauert ein vollständiger Atemzug?</li>
            <li>Bestimme einen Funktionsterm <Formel tex="f(x)=a\cdot\cos(bx)+d" /> für <Formel tex="x\ge 0" />.</li>
            <li>Bestimme die drei kleinsten Zeitpunkte <Formel tex="x\ge 0" />, zu denen die Lunge jeweils die Hälfte des größten Luftvolumens enthält.</li>
          </ol>
          <AufKlick einblenden="Schaubild mit den Zeitpunkten einblenden" ausblenden="Schaubild ausblenden">
            <Zeitschaubild
              f={(x) => wertTrig(LUNGE, x, 'cos')}
              schwelle={2.25}
              bereich={[-0.7, 13.5, -0.8, 5.2]}
              xTeilung={1}
              yTeilung={1}
              punkte={LUNGE_E.alle.map((x) => ({ x, y: 2.25, text: zahlText(x), textY: 0.3 }))}
              beschreibung="Schaubild des Luftvolumens mit der Geraden y gleich 2,25, der Hälfte des größten Volumens. Die Gerade schneidet das Schaubild bei etwa 0,83 Sekunden, 4,17 Sekunden, 5,83 Sekunden und 9,17 Sekunden."
            />
          </AufKlick>
        </Aufgabe>

        <h3>Preise</h3>
        <Aufgabe
          nummer={3}
          titel="Preisentwicklung"
          felder={[
            { id: 'tmin', name: 'Tag mit dem niedrigsten Preis', beschriftung: <>Tag <Formel tex="t" /> des niedrigsten Preises</>, erwartet: PREIS_E.tMin },
            { id: 'ymin', name: 'Niedrigster Preis in Euro', beschriftung: <>niedrigster Preis (€)</>, erwartet: PREIS_E.ymin },
            { id: 'tag', name: 'Tag im Monat', beschriftung: <>Datum: Tag</>, erwartet: PREIS_E.datumMin.tag },
            { id: 'monat', name: 'Monat als Zahl', beschriftung: <>Datum: Monat (Zahl)</>, erwartet: PREIS_E.datumMin.monat },
            { id: 't1', name: 'Erster Tag mit Preis gleich 175 Euro', beschriftung: <><Formel tex="t_1" /> bei <Formel tex="f(t)=175" /></>, erwartet: PREIS_E.von },
            { id: 't2', name: 'Zweiter Tag mit Preis gleich 175 Euro', beschriftung: <><Formel tex="t_2" /> bei <Formel tex="f(t)=175" /></>, erwartet: PREIS_E.bis },
            { id: 'm1', name: 'Erster Monat, in dem der Preis an allen Tagen unter 175 Euro liegt', beschriftung: <>erster Monat (Zahl)</>, erwartet: PREIS_E.monate[0]! },
            { id: 'm2', name: 'Letzter Monat, in dem der Preis an allen Tagen unter 175 Euro liegt', beschriftung: <>letzter Monat (Zahl)</>, erwartet: PREIS_E.monate[PREIS_E.monate.length - 1]! },
          ]}
          hilfen={[
            <>Erstelle eine Wertetabelle für <Formel tex="0\le t\le 360" /> mit Schrittweite 30. Oder bestimme die markanten Punkte: Der Hochpunkt liegt bei <Formel tex="t=0" />, weil der Kosinus nicht verschoben ist. Zum nächsten Hochpunkt gehört <Formel tex="p=360" />, der Tiefpunkt liegt eine halbe Periode nach dem Hochpunkt.</>,
            <>Die t-Koordinate des Tiefpunkts liefert den Tag. Wegen 30 Tagen je Monat gilt: Tag 30 ist der 30.1., Tag 31 der 1.2. und so weiter.</>,
            <>Löse <Formel tex="f(t)=175" />: umformen nach <Formel tex={String.raw`\cos(\dots)=\dots`} />, substituieren mit <Formel tex={String.raw`u=\tfrac{\pi}{180}t`} />, <Formel tex="u_2=-u_1" />, zurückrechnen mit <Formel tex={String.raw`t=\tfrac{180}{\pi}u`} />, die Periode 360 addieren.</>,
            <>Die Ungleichung <Formel tex="f(t)<175" /> liest du an der Skizze ab: zwischen den beiden Lösungen liegt der Tiefpunkt, dort ist der Preis kleiner. Der Preis soll an <em>allen</em> Tagen eines Monats unter 175 € liegen. Prüfe deshalb für jeden Monat den ersten und den letzten Tag. An den Lösungstagen selbst ist der Preis genau 175 €, nicht darunter.</>,
          ]}
          loesung={[
            <>a) Hochpunkt <Formel tex="H_1(0\,|\,250)" /> und <Formel tex="H_2(360\,|\,250)" /> (<Formel tex={String.raw`p=\tfrac{2\pi}{\pi/180}=360`} />). Tiefpunkt bei <Formel tex="t=\tfrac{p}{2}=180" /> mit <Formel tex="f(180)=50\cos(\pi)+200=150" />, also <Formel tex="T(180\,|\,150)" />. Wendepunkte bei <Formel tex="t=90" /> und <Formel tex="t=270" /> mit <Formel tex="y=200" />.</>,
            <>b) Der Preis ist am niedrigsten bei <Formel tex="t=180" />. Das ist der 30.06. (6 Monate mit je 30 Tagen) mit einem Preis von 150 €.</>,
            <>c) <Formel tex={String.raw`50\cos\!\left(\tfrac{\pi}{180}t\right)+200=175`} /> ergibt <Formel tex={String.raw`\cos\!\left(\tfrac{\pi}{180}t\right)=-\tfrac{1}{2}`} />.</>,
            <>Substitution <Formel tex={String.raw`u=\tfrac{\pi}{180}t`} />: <Formel tex={String.raw`u_1=\cos^{-1}\!\left(-\tfrac{1}{2}\right)=\tfrac{2\pi}{3}`} />, <Formel tex={String.raw`u_2=-\tfrac{2\pi}{3}`} />. Rücksubstitution <Formel tex={String.raw`t=\tfrac{180}{\pi}u`} />: <Formel tex="t_1=120" /> und <Formel tex="t_2=-120" />. Mit der Periode 360: <Formel tex="t_2+360=240" />.</>,
            <>Für <Formel tex="120<t<240" /> ist der Preis kleiner als 175 €. Das sind die Tage 121 (1. Mai) bis 239 (29. August). Bei <Formel tex="t=240" /> (30. August) ist der Preis genau 175 €, also nicht darunter.</>,
            <>Antwort: An allen Tagen liegt der Preis nur im Mai, Juni und Juli unter 175 €. Im August liegt der letzte Tag nicht mehr darunter.</>,
          ]}
        >
          <p>
            Ein Skihändler legt der Preisgestaltung für ein Paar Skier das Modell <Formel tex={String.raw`f(t)=50\cos\!\left(\tfrac{\pi}{180}t\right)+200`} /> mit <Formel tex="0\le t\le 360" /> zugrunde. Dabei ist <Formel tex="t" /> der Tag im laufenden Jahr, <Formel tex="t=1" /> ist der 1. Januar, und <Formel tex="f(t)" /> ist der Preis in Euro. Es wird angenommen, dass jeder Monat 30 Tage hat.
          </p>
          <ol className="auftraege">
            <li>Zeichne den Preisverlauf für ein Jahr (auf Papier, mit markanten Punkten). Das Kontrollschaubild kannst du einblenden.</li>
            <li>An welchem Tag (Datum) ist der Preis am niedrigsten? Wie hoch ist er dann?</li>
            <li>Ermittle von Hand die Monate, in denen der Preis an <em>allen</em> Tagen unter 175 € liegt. Gib dazu zuerst die beiden Tage an, an denen der Preis genau 175 € beträgt.</li>
          </ol>
          <AufKlick einblenden="Schaubild mit markanten Punkten einblenden" ausblenden="Schaubild ausblenden">
            <Zeitschaubild
              f={(t) => wertTrig(PREIS, t, 'cos')}
              schwelle={175}
              bereich={[-50, 410, -20, 300]}
              xTeilung={30}
              yTeilung={50}
              markiert={[{ von: PREIS_E.von, bis: PREIS_E.bis }]}
              punkte={[
                { x: 0, y: 250, art: 2, text: 'H₁(0 | 250)' },
                { x: 90, y: 200, art: 2 },
                { x: 180, y: 150, art: 2, text: 'T(180 | 150)', textUnten: true },
                { x: 270, y: 200, art: 2 },
                { x: 360, y: 250, art: 2, text: 'H₂(360 | 250)' },
                { x: PREIS_E.von, y: 175, text: 't₁ = 120' },
                { x: PREIS_E.bis, y: 175, text: 't₂ = 240' },
              ]}
              beschreibung="Schaubild des Preises in Euro über den Tagen 0 bis 360. Hochpunkte bei 0 und 360 mit Preis 250, Tiefpunkt bei 180 mit Preis 150. Die Gerade y gleich 175 schneidet das Schaubild bei Tag 120 und Tag 240, dazwischen ist der Preis niedriger."
            />
          </AufKlick>
        </Aufgabe>

        <h3>Temperaturen</h3>
        <Auswahlfrage
          nummer="4a"
          titel="Bedeutung der Parameter"
          optionen={platziere([
            opt('a', <>Der Wert <Formel tex="d" /> ist die mittlere Jahrestemperatur (Ruhelage), der Wert <Formel tex="|a|" /> ist die größte Abweichung davon im Jahr.</>, true, <>Richtig. Die Wendepunkte liegen auf der Ruhelage <Formel tex="y=d" />. Die Amplitude <Formel tex="|a|" /> gibt an, wie weit die Temperatur höchstens nach oben und unten von diesem Mittelwert abweicht.</>),
            opt('b', <>Der Wert <Formel tex="d" /> ist die höchste Temperatur im Jahr, der Wert <Formel tex="a" /> die niedrigste.</>, false, <>Die höchste Temperatur ist <Formel tex="y_{\max}=d+|a|" />, die niedrigste <Formel tex="y_{\min}=d-|a|" />. Weder <Formel tex="d" /> noch <Formel tex="a" /> allein sind diese Werte.</>),
            opt('c', <>Der Wert <Formel tex="d" /> gibt den Monat mit der höchsten Temperatur an.</>, false, <>Den Monat mit der höchsten Temperatur bestimmt die Verschiebung in x-Richtung <Formel tex="c" /> zusammen mit der Periode. Der Wert <Formel tex="d" /> ist eine Temperatur in °C.</>),
            opt('d', <>Der Wert <Formel tex="|a|" /> ist die Dauer eines Jahres.</>, false, <>Die Dauer eines Jahres ist die Periode <Formel tex="p=12" /> Monate. Sie bestimmt <Formel tex="b" />, nicht <Formel tex="a" />.</>),
          ], 2)}
          erklaerung={<>Beim Modell <Formel tex="g(x)=a\cdot\sin\bigl(b\,(x-c)\bigr)+d" /> ist <Formel tex="d" /> der Mittelwert der Temperatur im Jahr (Ruhelage) und <Formel tex="|a|" /> die Amplitude, die größte Abweichung von diesem Mittelwert.</>}
        >
          <p>
            Die Monatsmittelwerte der Lufttemperatur in Stuttgart (in °C) sind in der Tabelle angegeben. Der Temperaturverlauf soll durch eine Funktion <Formel tex="g(x)=a\cdot\sin\bigl(b\,(x-c)\bigr)+d" /> mit <Formel tex="x\in[0;\,12]" /> angenähert werden. Dabei entspricht <Formel tex="x=0{,}5" /> dem Januar, also <Formel tex="g(0{,}5)=-2{,}1" />. Welche Bedeutung haben <Formel tex="a" /> und <Formel tex="d" /> für den Temperaturverlauf?
          </p>
          <table className="tabelle">
            <caption>Mittlere Lufttemperatur in Stuttgart</caption>
            <thead>
              <tr>
                <th scope="col">Monat</th>
                {MONATE.map((m) => <th key={m} scope="col">{m}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">°C</th>
                {STUTTGART_TABELLE.map((t, i) => <td key={i}>{String(t).replace('.', ',').replace('-', '−')}</td>)}
              </tr>
            </tbody>
          </table>
        </Auswahlfrage>

        <Aufgabe
          nummer="4b"
          titel="Funktionsterm für Stuttgart"
          felder={[
            { id: 'a', name: 'Parameter a mit a größer 0', beschriftung: <><Formel tex="a" /> (mit <Formel tex="a>0" />)</>, erwartet: STUTTGART.a },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: STUTTGART.b },
            { id: 'c', name: 'Parameter c', beschriftung: <Formel tex="c" />, erwartet: STUTTGART.c },
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: STUTTGART.d },
          ]}
          hilfen={[
            <>Der größte Wert (Juli) und der kleinste Wert (Januar) stehen in der Tabelle. Daraus folgen <Formel tex="d" /> als Mitte und <Formel tex="|a|=\tfrac{y_{\max}-y_{\min}}{2}" />.</>,
            <>Eine Periode umfasst ein Jahr, also 12 Monate. Mit <Formel tex={String.raw`b=\tfrac{2\pi}{p}`} /> erhältst du <Formel tex="b" />.</>,
            <>Der Hochpunkt (Juli) liegt bei <Formel tex="x_{\text{HP}}=6{,}5" />. Beim Sinus ist <Formel tex="c" /> der aufsteigende Wendepunkt, eine Viertelperiode vor dem Hochpunkt: <Formel tex={String.raw`c=x_{\text{HP}}-\tfrac{p}{4}`} />. Du kannst auch die Mitte zwischen Tiefpunkt (Januar, <Formel tex="x=0{,}5" />) und Hochpunkt nehmen. Das klappt hier, weil beide eine halbe Periode auseinanderliegen.</>,
            <>Alternative mit GeoGebra: Die zwölf Punkte aus der Tabelle einfügen und den Befehl <code>Trendsin</code> verwenden. GeoGebra liefert den Term in der Form <Formel tex="a\cdot\sin(bx-c)+d" /> ohne innere Klammer. An diesem Term kannst du die Verschiebung nicht direkt ablesen.</>,
          ]}
          loesung={[
            <><Formel tex={`d=\\dfrac{17{,}5+(-2{,}1)}{2}=${z2(STUTTGART.d)}`} /> und <Formel tex={`|a|=\\dfrac{17{,}5-(-2{,}1)}{2}=${z2(STUTTGART.a)}`} />, also <Formel tex={`a=${z2(STUTTGART.a)}`} />.</>,
            <><Formel tex={String.raw`p=12`} />, also <Formel tex={String.raw`b=\dfrac{2\pi}{12}=\dfrac{\pi}{6}`} />.</>,
            <><Formel tex={`c=6{,}5-\\tfrac{12}{4}=${z2(STUTTGART.c)}`} />. Probe: Die Mitte zwischen <Formel tex="0{,}5" /> und <Formel tex="6{,}5" /> ist <Formel tex="3{,}5" />.</>,
            <>Ergebnis: <Formel tex={String.raw`g(x)=9{,}8\sin\!\left(\tfrac{\pi}{6}(x-3{,}5)\right)+7{,}7`} />. Das Modell weicht von den Monatsmittelwerten um höchstens 0,8 °C ab.</>,
          ]}
        >
          <p>
            Bestimme die Koeffizienten <Formel tex="a" /> (mit <Formel tex="a>0" />), <Formel tex="b" />, <Formel tex="c" /> und <Formel tex="d" /> für die Stuttgarter Temperaturen. Mit dem Labor kannst du dein Ergebnis auch ausprobieren: Verändere die Regler, bis die Kurve zu den Punkten passt, und rechne dann nach.
          </p>
          <Anpassungslabor />
        </Aufgabe>

        <Aufgabe
          nummer={5}
          titel="Temperaturen in Freiburg"
          felder={[
            { id: 'min', name: 'Niedrigste Tagestemperatur', beschriftung: <>niedrigste Temperatur (°C)</>, erwartet: FREIBURG_E.min, toleranz: 0.01 },
            { id: 'max', name: 'Höchste Tagestemperatur', beschriftung: <>höchste Temperatur (°C)</>, erwartet: FREIBURG_E.max, toleranz: 0.01 },
            { id: 'von', name: 'Beginn des Zeitraums über 20 Grad in Stunden nach Mitternacht', beschriftung: <>Beginn (Stunden)</>, erwartet: FREIBURG_E.von, toleranz: 0.02 },
            { id: 'bis', name: 'Ende des Zeitraums über 20 Grad in Stunden nach Mitternacht', beschriftung: <>Ende (Stunden)</>, erwartet: FREIBURG_E.bis, toleranz: 0.02 },
            { id: 'dauer', name: 'Dauer des Zeitraums in Stunden', beschriftung: <>Dauer (Stunden)</>, erwartet: FREIBURG_E.dauer, toleranz: 0.03 },
          ]}
          hilfen={[
            <>Die Temperatur schwankt um die Ruhelage <Formel tex="d" /> mit der Amplitude <Formel tex="|a|" />. Größter und kleinster Wert sind <Formel tex="d+|a|" /> und <Formel tex="d-|a|" />.</>,
            <>Gesucht ist der Zeitraum mit <Formel tex="f(x)>20" />. Löse zuerst <Formel tex="f(x)=20" />: umformen nach <Formel tex={String.raw`\sin(\dots)=\dots`} />, substituieren mit <Formel tex={String.raw`u=\tfrac{\pi}{12}(x-9{,}4)`} />.</>,
            <>Für den Sinus gilt <Formel tex={String.raw`u_2=\pi-u_1`} />. Rücksubstitution mit <Formel tex={String.raw`x=\tfrac{12}{\pi}u+9{,}4`} />. Zwischen den beiden Lösungen liegt der Hochpunkt, dort ist die Temperatur größer als 20 °C.</>,
          ]}
          loesung={[
            <>c) Die Temperatur schwankt zwischen <Formel tex="14{,}8-9{,}7=5{,}1" /> °C und <Formel tex="14{,}8+9{,}7=24{,}5" /> °C.</>,
            <>d) <Formel tex={String.raw`9{,}7\sin(u)+14{,}8=20`} /> ergibt <Formel tex={`\\sin(u)=\\dfrac{5{,}2}{9{,}7}=${d3(5.2 / 9.7)}`} /> mit <Formel tex={String.raw`u=\tfrac{\pi}{12}(x-9{,}4)`} />.</>,
            <><Formel tex={`u_1=\\sin^{-1}\\left(\\tfrac{5{,}2}{9{,}7}\\right)=${d3(Math.asin(5.2 / 9.7))}`} /> und <Formel tex={`u_2=\\pi-u_1=${d3(PI - Math.asin(5.2 / 9.7))}`} />.</>,
            <>Rücksubstitution <Formel tex={String.raw`x=\tfrac{12}{\pi}u+9{,}4`} />: <Formel tex={`x_1=${d3(FREIBURG_E.von)}`} /> und <Formel tex={`x_2=${d3(FREIBURG_E.bis)}`} />. Beide liegen in <Formel tex="[0;\,24]" />, die Periode 24 liefert keine weiteren Lösungen im Tag.</>,
            <>Antwort: Die Temperatur liegt zwischen etwa {uhrzeit(FREIBURG_E.von, 'nah')} Uhr und {uhrzeit(FREIBURG_E.bis, 'nah')} Uhr über 20 °C, das sind etwa <Formel tex={`${d3(FREIBURG_E.dauer)}`} /> Stunden.</>,
          ]}
        >
          <p>
            Die Lufttemperatur in °C in Freiburg während eines Tages kann näherungsweise durch die Funktion <Formel tex={String.raw`f(x)=9{,}7\cdot\sin\!\left(\tfrac{\pi}{12}(x-9{,}4)\right)+14{,}8`} /> mit <Formel tex="x\in[0;\,24]" /> beschrieben werden. Dabei ist <Formel tex="x" /> die Zeit in Stunden nach Mitternacht.
          </p>
          <ol className="auftraege">
            <li>Zwischen welchen Werten schwankt die Tagestemperatur?</li>
            <li>Berechne den Zeitraum, in dem die Lufttemperatur an diesem Tag über 20 °C liegt. Gib Beginn und Ende in Stunden nach Mitternacht an, auf zwei Nachkommastellen genau.</li>
          </ol>
          <AufKlick einblenden="Schaubild mit Zeitraum einblenden" ausblenden="Schaubild ausblenden">
            <Zeitschaubild
              f={(x) => wertTrig(FREIBURG, x, 'sin')}
              schwelle={20}
              bereich={[-1, 25, -2, 27]}
              xTeilung={2}
              yTeilung={5}
              markiert={[{ von: FREIBURG_E.von, bis: FREIBURG_E.bis }]}
              punkte={[
                { x: FREIBURG_E.von, y: 20, text: uhrzeit(FREIBURG_E.von) },
                { x: FREIBURG_E.bis, y: 20, text: uhrzeit(FREIBURG_E.bis) },
              ]}
              beschreibung="Schaubild der Temperatur in Grad Celsius über der Zeit in Stunden von 0 bis 24 mit der Geraden y gleich 20. Der grün markierte Zeitraum liegt von etwa 11:34 Uhr bis 19:14 Uhr, dort ist die Temperatur höher als 20 Grad."
            />
          </AufKlick>
        </Aufgabe>
      </Abschnitt>

      <Abschnitt id="gemischt" titel="Gemischte Aufgaben">
        <p>
          Diese Aufgaben sind im Stil von Abituraufgaben gestellt und verbinden alles aus dem Themenbereich: Transformationen, markante Punkte, Funktionsterm aufstellen, Gleichungen lösen und Parameter untersuchen. Hilfen und Lösungsweg gibt es wie bisher.
        </p>

        <h3>Transformationen</h3>
        <Auswahlfrage
          nummer="6a"
          titel="Entstehung des Schaubilds"
          optionen={platziere([
            opt('a', <>Streckung in x-Richtung mit dem Faktor <Formel tex={String.raw`\tfrac{2}{\pi}`} />, Verschiebung um 1 nach rechts, Streckung in y-Richtung mit dem Faktor 2, Verschiebung um 1 nach oben.</>, true, <>Richtig. Es gilt <Formel tex={String.raw`g(x)=2\sin\!\left(\tfrac{\pi}{2}(x-1)\right)+1`} />. Die Wirkung von <Formel tex={String.raw`b=\tfrac{\pi}{2}`} /> ist umgekehrt: Faktor <Formel tex={String.raw`\tfrac{1}{b}=\tfrac{2}{\pi}`} />.</>),
            opt('b', <>Streckung in x-Richtung mit dem Faktor <Formel tex={String.raw`\tfrac{\pi}{2}`} />, Verschiebung um 1 nach rechts, Streckung in y-Richtung mit dem Faktor 2, Verschiebung um 1 nach oben.</>, false, <>Der Faktor in x-Richtung ist <Formel tex={String.raw`\tfrac{1}{b}`} />, nicht <Formel tex="b" />. Mit <Formel tex={String.raw`b=\tfrac{\pi}{2}`} /> ist das <Formel tex={String.raw`\tfrac{2}{\pi}`} />. Die Periode wird <Formel tex="4" />, kürzer als <Formel tex="2\pi" />.</>),
            opt('c', <>Streckung in x-Richtung mit dem Faktor <Formel tex={String.raw`\tfrac{2}{\pi}`} />, Verschiebung um <Formel tex={String.raw`\tfrac{\pi}{2}`} /> nach rechts, Streckung in y-Richtung mit dem Faktor 2, Verschiebung um 1 nach oben.</>, false, <>Der Term im Argument ist <Formel tex={String.raw`\tfrac{\pi}{2}x-\tfrac{\pi}{2}=\tfrac{\pi}{2}(x-1)`} />. Die Verschiebung in x-Richtung ist also <Formel tex="c=1" />, nicht <Formel tex={String.raw`\tfrac{\pi}{2}`} />.</>),
            opt('d', <>Streckung in x-Richtung mit dem Faktor <Formel tex={String.raw`\tfrac{2}{\pi}`} />, Verschiebung um 1 nach rechts, Streckung in y-Richtung mit dem Faktor 2, Verschiebung um <Formel tex={String.raw`\tfrac{1}{2}`} /> nach oben.</>, false, <>Die eckige Klammer wird mit 2 multipliziert: <Formel tex={String.raw`2\left[\sin(\dots)+\tfrac{1}{2}\right]=2\sin(\dots)+1`} />. Die Verschiebung in y-Richtung ist <Formel tex="d=1" />.</>),
          ], 1)}
          erklaerung={<>Forme zuerst um: <Formel tex={String.raw`g(x)=2\left[\sin\!\left(\tfrac{\pi}{2}x-\tfrac{\pi}{2}\right)+\tfrac{1}{2}\right]=2\sin\!\left(\tfrac{\pi}{2}(x-1)\right)+1`} />. Dann liest du <Formel tex="a=2" />, <Formel tex={String.raw`b=\tfrac{\pi}{2}`} />, <Formel tex="c=1" /> und <Formel tex="d=1" /> ab. In dieser Reihenfolge entsteht das Schaubild aus der Sinuskurve.</>}
        >
          <p>
            Gegeben ist die Funktion <Formel tex={String.raw`g(x)=2\cdot\left[\sin\!\left(\tfrac{\pi}{2}x-\tfrac{\pi}{2}\right)+\tfrac{1}{2}\right]`} /> mit <Formel tex={String.raw`x\in\mathbb{R}`} />. <Formel tex="K_g" /> ist das Schaubild von <Formel tex="g" />. Wie entsteht <Formel tex="K_g" /> aus dem Schaubild von <Formel tex="y=\sin(x)" />?
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer="6b"
          titel="Periode und Wendepunkte"
          felder={[
            { id: 'p', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: G1_E.periode },
            { id: 'x1', name: 'x-Koordinate des ersten Wendepunkts', beschriftung: <><Formel tex="x_{\text{W1}}" /></>, erwartet: G1_E.w1.x },
            { id: 'y1', name: 'y-Koordinate des ersten Wendepunkts', beschriftung: <><Formel tex="y_{\text{W1}}" /></>, erwartet: G1_E.w1.y },
            { id: 'x2', name: 'x-Koordinate des zweiten Wendepunkts', beschriftung: <><Formel tex="x_{\text{W2}}" /></>, erwartet: G1_E.w2.x },
            { id: 'y2', name: 'y-Koordinate des zweiten Wendepunkts', beschriftung: <><Formel tex="y_{\text{W2}}" /></>, erwartet: G1_E.w2.y },
          ]}
          hilfen={[
            <>Forme <Formel tex="g" /> in die Form <Formel tex="a\cdot\sin\bigl(b\,(x-c)\bigr)+d" /> um. Dann ist die Periode <Formel tex={String.raw`p=\tfrac{2\pi}{b}`} />.</>,
            <>Beim Sinus liegt bei <Formel tex="x=c" /> ein Wendepunkt auf der Ruhelage <Formel tex="y=d" />. Zwischen zwei benachbarten Wendepunkten liegt eine halbe Periode.</>,
          ]}
          loesung={[
            <><Formel tex={String.raw`g(x)=2\sin\!\left(\tfrac{\pi}{2}(x-1)\right)+1`} />, also <Formel tex={String.raw`b=\tfrac{\pi}{2}`} /> und <Formel tex={String.raw`p=\tfrac{2\pi}{\pi/2}=4`} />.</>,
            <>Wendepunkt bei <Formel tex="x=c=1" /> mit <Formel tex="y=d=1" />: <Formel tex="W_1(1\,|\,1)" />. Der rechte Nachbar liegt eine halbe Periode weiter, bei <Formel tex="x=1+2=3" />: <Formel tex="W_2(3\,|\,1)" />.</>,
          ]}
        >
          <p>
            Gib für die Funktion <Formel tex="g" /> aus Aufgabe 6a ohne Rechnung am Taschenrechner die Periode an sowie die Koordinaten des Wendepunkts mit der kleinsten positiven x-Koordinate und seines rechten Nachbarwendepunkts.
          </p>
          <AufKlick einblenden="Schaubild mit Wendepunkten einblenden" ausblenden="Schaubild ausblenden">
            <Zeitschaubild
              f={(x) => wertTrig(G1, x, 'sin')}
              schwelle={1}
              bereich={[-2.5, 7.5, -2, 4]}
              xTeilung={1}
              yTeilung={1}
              punkte={[
                { x: 1, y: 1, art: 2, text: 'W₁(1 | 1)' },
                { x: 3, y: 1, art: 2, text: 'W₂(3 | 1)' },
              ]}
              beschreibung="Schaubild von g mit g von x gleich 2 mal Sinus von π halbe mal Klammer x minus 1 plus 1. Die Ruhelage ist y gleich 1. Die Wendepunkte W1 bei x gleich 1 und W2 bei x gleich 3 liegen auf der Ruhelage."
            />
          </AufKlick>
        </Aufgabe>

        <h3>Sonnenscheindauer</h3>
        <Aufgabe
          nummer={7}
          titel="Sonnenscheindauer im Jahr"
          felder={[
            { id: 'a', name: 'Parameter a', beschriftung: <><Formel tex="a" /></>, erwartet: SONNE.a },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: SONNE.b, toleranz: 0.0001 },
            { id: 'c', name: 'Parameter c', beschriftung: <Formel tex="c" />, erwartet: SONNE.c },
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: SONNE.d },
            { id: 'von', name: 'Erster Tag mit mehr als 14 Stunden Sonnenscheindauer', beschriftung: <>Beginn (Tag)</>, erwartet: SONNE_E.von, toleranz: 0.5 },
            { id: 'bis', name: 'Letzter Tag mit mehr als 14 Stunden Sonnenscheindauer', beschriftung: <>Ende (Tag)</>, erwartet: SONNE_E.bis, toleranz: 0.5 },
            { id: 'tage', name: 'Anzahl der Tage mit mehr als 14 Stunden Sonnenscheindauer', beschriftung: <>Anzahl der Tage</>, erwartet: SONNE_E.tage, toleranz: 1 },
          ]}
          hilfen={[
            <>Der längste Tag ist der 21.6., der kürzeste der 21.12. Zähle die Tage seit dem 1. Januar: bis zum 21.6. sind es <Formel tex="31+28+31+30+31+21" /> Tage. Aus größtem und kleinstem Wert erhältst du <Formel tex="d" /> und <Formel tex="a" />.</>,
            <>Ein Jahr hat 365 Tage, also <Formel tex="p=365" /> und <Formel tex={String.raw`b=\tfrac{2\pi}{365}`} />. Beim Kosinus mit <Formel tex="a>0" /> ist <Formel tex="c" /> die Stelle des Hochpunkts (längster Tag).</>,
            <>Für Teil 2: Löse <Formel tex="f(t)=14" /> mit der Substitution <Formel tex="u=b\,(t-c)" />. Mit <Formel tex="u_2=-u_1" /> erhältst du zwei Tage. Zwischen ihnen liegt der Hochpunkt, dort ist die Sonnenscheindauer größer als 14 Stunden.</>,
          ]}
          loesung={[
            <><Formel tex={String.raw`d=\tfrac{16{,}5+8}{2}=12{,}25`} /> und <Formel tex={String.raw`a=\tfrac{16{,}5-8}{2}=4{,}25`} />. Der 21.6. ist der Tag <Formel tex="t=172" />, also <Formel tex="c=172" />. Mit <Formel tex={String.raw`b=\tfrac{2\pi}{365}`} /> gilt <Formel tex={String.raw`f(t)=4{,}25\cos\!\left(\tfrac{2\pi}{365}(t-172)\right)+12{,}25`} />.</>,
            <>Probe: Der kürzeste Tag liegt eine halbe Periode später, bei <Formel tex="172+182{,}5=354{,}5" />. Das passt zum 21.12. (Tag 355).</>,
            <><Formel tex="f(t)=14" /> ergibt <Formel tex={`\\cos(u)=\\dfrac{14-12{,}25}{4{,}25}=${d3(1.75 / 4.25)}`} />, <Formel tex={`u_1=${d3(Math.acos(1.75 / 4.25))}`} /> und <Formel tex="u_2=-u_1" />. Mit <Formel tex={String.raw`t=\tfrac{365}{2\pi}u+172`} /> folgt <Formel tex={`t_1=${d3(SONNE_E.von)}`} /> und <Formel tex={`t_2=${d3(SONNE_E.bis)}`} />.</>,
            <>Antwort: Vom Tag 106 bis zum Tag 238, also an etwa <Formel tex={`${d3(SONNE_E.tage)}`} /> Tagen im Jahr, scheint die Sonne länger als 14 Stunden.</>,
          ]}
        >
          <p>
            Im Verlauf eines Jahres ändert sich wegen der geneigten Erdachse die astronomische Sonnenscheindauer, also die Zeitspanne zwischen Sonnenaufgang und Sonnenuntergang. In unseren Breiten ist die Sonne am 21.6. mit etwa 16,5 Stunden am längsten und am 21.12. mit etwa 8 Stunden am kürzesten zu sehen. Das Jahr hat 365 Tage, <Formel tex="t" /> zählt die Tage ab dem 1. Januar (<Formel tex="t=1" />). Der 21.6. ist der Tag 172.
          </p>
          <ol className="auftraege">
            <li>Gib einen geeigneten Funktionsterm <Formel tex="f(t)=a\cdot\cos\bigl(b\,(t-c)\bigr)+d" /> für die Sonnenscheindauer in Stunden an.</li>
            <li>An wie vielen Tagen im Jahr beträgt die Sonnenscheindauer mehr als 14 Stunden? Gib den ersten und den letzten Tag sowie die Anzahl der Tage an (auf ganze Tage gerundet).</li>
          </ol>
          <AufKlick einblenden="Schaubild einblenden" ausblenden="Schaubild ausblenden">
            <Zeitschaubild
              f={(t) => wertTrig(SONNE, t, 'cos')}
              schwelle={14}
              bereich={[-20, 385, -2, 19]}
              xTeilung={50}
              yTeilung={2}
              markiert={[{ von: SONNE_E.von, bis: SONNE_E.bis }]}
              punkte={[
                { x: 172, y: 16.5, art: 2, text: 'H(172 | 16,5)' },
                { x: SONNE_E.von, y: 14, text: '≈ 105' },
                { x: SONNE_E.bis, y: 14, text: '≈ 239' },
              ]}
              beschreibung="Schaubild der Sonnenscheindauer in Stunden über den Tagen 0 bis 365. Hochpunkt bei Tag 172 mit 16,5 Stunden. Die Gerade y gleich 14 schneidet das Schaubild bei etwa Tag 105 und Tag 239, dazwischen ist die Sonnenscheindauer länger als 14 Stunden."
            />
          </AufKlick>
        </Aufgabe>

        <h3>Gleichungen und exakte Werte</h3>
        <Auswahlfrage
          nummer="8a"
          titel="Julians Rechnung"
          optionen={platziere([
            opt('a', <>Julian darf nicht durch <Formel tex="x" /> teilen, denn <Formel tex="x" /> kann 0 sein. Dabei geht die Lösung <Formel tex="x=0" /> verloren.</>, true, <>Richtig. Beim Teilen durch <Formel tex="x" /> wird der Fall <Formel tex="x=0" /> nicht untersucht. Die Probe zeigt: <Formel tex="0\cdot\sin(0)=0" />, also ist <Formel tex="x=0" /> eine Lösung.</>),
            opt('b', <>Die Gleichung <Formel tex="\sin(x)=1" /> hat keine Lösung.</>, false, <>Doch, <Formel tex="\sin(x)=1" /> hat die Lösung <Formel tex={String.raw`x=\tfrac{\pi}{2}`} /> (und alle um Vielfache von <Formel tex="2\pi" /> verschobenen Werte).</>),
            opt('c', <>Die Lösung <Formel tex={String.raw`x=\tfrac{\pi}{2}`} /> liegt nicht im Intervall <Formel tex="[-1;\,2]" />.</>, false, <><Formel tex={String.raw`\tfrac{\pi}{2}\approx 1{,}57`} /> liegt zwischen −1 und 2, also im Intervall.</>),
            opt('d', <>Julian hätte durch <Formel tex="\sin(x)" /> teilen müssen.</>, false, <>Auch das Teilen durch <Formel tex="\sin(x)" /> würde Lösungen verlieren (dort, wo <Formel tex="\sin(x)=0" /> ist). Besser ist: alles auf eine Seite bringen und ausklammern.</>),
          ], 3)}
          erklaerung={<>Bei Produkten wie <Formel tex="x\cdot\sin(x)=x" /> bringst du alles auf eine Seite und klammerst aus: <Formel tex="x\,(\sin(x)-1)=0" />. Ein Produkt ist null, wenn ein Faktor null ist: <Formel tex="x=0" /> oder <Formel tex="\sin(x)=1" />.</>}
        >
          <p>
            Julian hat die Gleichung <Formel tex="x\cdot\sin(x)=x" /> für <Formel tex="x\in[-1;\,2]" /> so gelöst: Er teilt beide Seiten durch <Formel tex="x" /> und erhält <Formel tex="\sin(x)=1" />, daraus <Formel tex={String.raw`x=\tfrac{\pi}{2}`} />. Überprüfe Julians Lösungsvorschlag. Was ist falsch?
          </p>
        </Auswahlfrage>

        <Aufgabe
          nummer="8b"
          titel="Die Gleichung richtig lösen"
          felder={[
            { id: 'n', name: 'Anzahl der Lösungen', beschriftung: <>Anzahl der Lösungen</>, erwartet: JULIAN.loesungen.length },
            { id: 'x1', name: 'Kleinere Lösung', beschriftung: <>kleinere Lösung</>, erwartet: JULIAN.loesungen[0] },
            { id: 'x2', name: 'Größere Lösung', beschriftung: <>größere Lösung</>, erwartet: JULIAN.loesungen[1] },
          ]}
          hilfen={[
            <>Bringe alle Terme auf eine Seite: <Formel tex="x\cdot\sin(x)-x=0" />. Klammere <Formel tex="x" /> aus.</>,
            <>Ein Produkt ist null, wenn ein Faktor null ist. Löse beide Fälle und prüfe, ob die Lösungen im Intervall <Formel tex="[-1;\,2]" /> liegen.</>,
          ]}
          loesung={[
            <><Formel tex="x\,(\sin(x)-1)=0" />.</>,
            <>Fall 1: <Formel tex="x=0" />. Das liegt im Intervall. Fall 2: <Formel tex="\sin(x)=1" /> hat die Lösungen <Formel tex={String.raw`x=\tfrac{\pi}{2}+k\cdot 2\pi`} />. Im Intervall <Formel tex="[-1;\,2]" /> liegt nur <Formel tex={String.raw`\tfrac{\pi}{2}\approx 1{,}57`} /> (für <Formel tex="k=-1" /> wäre <Formel tex={String.raw`-\tfrac{3\pi}{2}\approx -4{,}71`} /> zu klein).</>,
            <><Formel tex={String.raw`L=\left\{0;\,\tfrac{\pi}{2}\right\}`} />, also zwei Lösungen.</>,
          ]}
        >
          <p>
            Löse <Formel tex="x\cdot\sin(x)=x" /> für <Formel tex="x\in[-1;\,2]" /> richtig. Gib die Anzahl der Lösungen und die Lösungen von links nach rechts an, exakt.
          </p>
        </Aufgabe>

        <Auswahlfrage
          nummer="9a"
          titel="Exakter Wert von sin(π/4)"
          optionen={platziere([
            opt('a', <Formel tex={String.raw`\tfrac{1}{2}\sqrt{2}`} />, true, <>Richtig. In der Tabelle der wichtigsten Werte gehört zu 45° das Bogenmaß <Formel tex={String.raw`\tfrac{\pi}{4}`} /> und <Formel tex={String.raw`\sin\!\left(\tfrac{\pi}{4}\right)=\tfrac{1}{2}\sqrt{2}`} />.</>),
            opt('b', <Formel tex={String.raw`\tfrac{1}{2}`} />, false, <>Das ist der Sinuswert für <Formel tex={String.raw`\tfrac{\pi}{6}`} /> (30°).</>),
            opt('c', <Formel tex={String.raw`\tfrac{1}{2}\sqrt{3}`} />, false, <>Das ist der Sinuswert für <Formel tex={String.raw`\tfrac{\pi}{3}`} /> (60°).</>),
            opt('d', <Formel tex="1" />, false, <>Das ist der Sinuswert für <Formel tex={String.raw`\tfrac{\pi}{2}`} /> (90°).</>),
          ], 1)}
          erklaerung={<>Beim Winkel 45° haben Sinus und Kosinus denselben Wert, <Formel tex={String.raw`\tfrac{1}{2}\sqrt{2}`} />.</>}
        >
          <p>Bestimme ohne Taschenrechner den exakten Wert von <Formel tex={String.raw`\sin\!\left(\tfrac{\pi}{4}\right)`} />.</p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="9b"
          titel="Exakter Wert von cos(5π/6)"
          optionen={platziere([
            opt('a', <Formel tex={String.raw`-\tfrac{1}{2}\sqrt{3}`} />, true, <>Richtig. <Formel tex={String.raw`\tfrac{5\pi}{6}=\pi-\tfrac{\pi}{6}`} /> liegt im zweiten Quadranten, dort ist der Kosinus negativ.</>),
            opt('b', <Formel tex={String.raw`\tfrac{1}{2}\sqrt{3}`} />, false, <>Der Betrag stimmt, aber das Vorzeichen nicht: Bei <Formel tex={String.raw`\tfrac{5\pi}{6}`} /> (150°) ist der Kosinus negativ.</>),
            opt('c', <Formel tex={String.raw`-\tfrac{1}{2}`} />, false, <>Das wäre der Kosinus von <Formel tex={String.raw`\tfrac{2\pi}{3}`} /> (120°).</>),
            opt('d', <Formel tex={String.raw`-\tfrac{1}{2}\sqrt{2}`} />, false, <>Das wäre der Kosinus von <Formel tex={String.raw`\tfrac{3\pi}{4}`} /> (135°).</>),
          ], 2)}
          erklaerung={
            <>
              Es gilt <Formel tex={String.raw`\cos(\pi-u)=-\cos(u)`} />. Mit <Formel tex={String.raw`u=\tfrac{\pi}{6}`} /> folgt <Formel tex={String.raw`\cos\!\left(\tfrac{5\pi}{6}\right)=-\cos\!\left(\tfrac{\pi}{6}\right)=-\tfrac{1}{2}\sqrt{3}`} />.
              <Zeitschaubild
                f={Math.cos}
                bereich={[-0.4, PI + 0.4, -1.3, 1.3]}
                xTeilung={PI / 6}
                yTeilung={0.5}
                xBeschriftung="pi"
                punkte={[
                  { x: PI / 6, y: Math.cos(PI / 6), text: '½√3' },
                  { x: (5 * PI) / 6, y: Math.cos((5 * PI) / 6), art: 2, text: '−½√3' },
                ]}
                beschreibung="Schaubild von Kosinus x von 0 bis π. Bei π sechstel liegt der Wert plus Wurzel 3 halbe, bei 5π sechstel der Wert minus Wurzel 3 halbe. Die beiden Punkte liegen gleich weit von der Mitte bei π halbe entfernt."
              />
            </>
          }
        >
          <p>Bestimme ohne Taschenrechner den exakten Wert von <Formel tex={String.raw`\cos\!\left(\tfrac{5\pi}{6}\right)`} />.</p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="9c"
          titel="Exakter Wert von cos(11π/3)"
          optionen={platziere([
            opt('a', <Formel tex={String.raw`\tfrac{1}{2}`} />, true, <>Richtig. <Formel tex={String.raw`\tfrac{11\pi}{3}=4\pi-\tfrac{\pi}{3}`} />, und der Kosinus hat die Periode <Formel tex="2\pi" />.</>),
            opt('b', <Formel tex={String.raw`-\tfrac{1}{2}`} />, false, <>Zerlege <Formel tex={String.raw`\tfrac{11\pi}{3}=4\pi-\tfrac{\pi}{3}`} />. Nach zwei vollen Perioden bleibt <Formel tex={String.raw`\cos\!\left(-\tfrac{\pi}{3}\right)=\cos\!\left(\tfrac{\pi}{3}\right)`} /> mit positivem Vorzeichen.</>),
            opt('c', <Formel tex={String.raw`\tfrac{1}{2}\sqrt{3}`} />, false, <>Das ist der Kosinus von <Formel tex={String.raw`\tfrac{\pi}{6}`} />, nicht von <Formel tex={String.raw`\tfrac{\pi}{3}`} />.</>),
            opt('d', <Formel tex={String.raw`-\tfrac{1}{2}\sqrt{3}`} />, false, <>Das ist der Kosinus von <Formel tex={String.raw`\tfrac{5\pi}{6}`} />.</>),
          ], 0)}
          erklaerung={
            <>
              Subtrahiere ganze Perioden: <Formel tex={String.raw`\tfrac{11\pi}{3}-4\pi=-\tfrac{\pi}{3}`} />. Weil der Kosinus achsensymmetrisch ist, gilt <Formel tex={String.raw`\cos\!\left(-\tfrac{\pi}{3}\right)=\cos\!\left(\tfrac{\pi}{3}\right)=\tfrac{1}{2}`} />.
              <Zeitschaubild
                f={Math.cos}
                bereich={[-1.5, 4 * PI + 0.5, -1.3, 1.3]}
                xTeilung={PI}
                yTeilung={0.5}
                xBeschriftung="pi"
                punkte={[
                  { x: -PI / 3, y: 0.5, text: '−π/3' },
                  { x: (11 * PI) / 3, y: 0.5, art: 2, text: '11π/3' },
                ]}
                beschreibung="Schaubild von Kosinus x von minus π drittel bis 4π. Bei minus π drittel und bei 11π drittel hat der Kosinus denselben Wert 0,5, denn die beiden Stellen unterscheiden sich um zwei Perioden."
              />
            </>
          }
        >
          <p>Bestimme ohne Taschenrechner den exakten Wert von <Formel tex={String.raw`\cos\!\left(\tfrac{11\pi}{3}\right)`} />.</p>
        </Auswahlfrage>

        <Aufgabe
          nummer="9d"
          titel="Sinusgleichung exakt"
          felder={[
            { id: 'x1', name: 'Kleinere Lösung', beschriftung: <><Formel tex="x_1" /></>, erwartet: (7 * PI) / 6 },
            { id: 'x2', name: 'Größere Lösung', beschriftung: <><Formel tex="x_2" /></>, erwartet: (11 * PI) / 6 },
          ]}
          hilfen={[
            <>Die Tabelle enthält nur Werte von 0 bis 1. Der Taschenrechner liefert <Formel tex={String.raw`x_1=\sin^{-1}\!\left(-\tfrac{1}{2}\right)=-\tfrac{\pi}{6}`} />. Dieser Wert liegt nicht in <Formel tex="[0;\,2\pi]" />.</>,
            <>Für die zweite Lösung gilt <Formel tex={String.raw`\pi-x_1`} />. Die erste Lösung im Intervall erhältst du durch Addieren von <Formel tex="2\pi" />.</>,
          ]}
          loesung={[
            <><Formel tex={String.raw`\sin^{-1}\!\left(-\tfrac{1}{2}\right)=-\tfrac{\pi}{6}`} />. Das liegt links von 0.</>,
            <><Formel tex={String.raw`\pi-\left(-\tfrac{\pi}{6}\right)=\tfrac{7\pi}{6}`} /> und <Formel tex={String.raw`-\tfrac{\pi}{6}+2\pi=\tfrac{11\pi}{6}`} />. <Formel tex={String.raw`L=\left\{\tfrac{7\pi}{6};\,\tfrac{11\pi}{6}\right\}`} />.</>,
          ]}
        >
          <p>
            Bestimme ohne Taschenrechner die exakten Lösungen von <Formel tex={String.raw`\sin(x)=-\tfrac{1}{2}`} /> im Intervall <Formel tex="[0;\,2\pi]" /> (die Aufgabe nennt kein Intervall, wir wählen eine Periode). Gib sie von links nach rechts an.
          </p>
          <AufKlick einblenden="Schaubild mit Lösungen einblenden" ausblenden="Schaubild ausblenden">
            <Zeitschaubild
              f={Math.sin}
              schwelle={-0.5}
              bereich={[-0.5, 2 * PI + 0.5, -1.4, 1.4]}
              xTeilung={PI / 6}
              yTeilung={0.5}
              xBeschriftung="pi"
              punkte={[
                { x: (7 * PI) / 6, y: -0.5, text: '7π/6' },
                { x: (11 * PI) / 6, y: -0.5, text: '11π/6' },
              ]}
              beschreibung="Schaubild von Sinus x im Intervall von 0 bis 2π mit der Geraden y gleich minus 0,5. Die Schnittstellen liegen bei 7π sechstel und 11π sechstel."
            />
          </AufKlick>
        </Aufgabe>

        <h3>Funktionen mit Parameter</h3>
        <Auswahlfrage
          nummer="10a"
          titel="Welche Abbildungen gehören zu g_a?"
          optionen={platziere([
            opt('a', 'Abbildung 1 und Abbildung 2', true, <>Richtig. Abbildung 1 gehört zu <Formel tex="a=2" />, Abbildung 2 zu <Formel tex="a=-1{,}5" />. Bei beiden liegen die Stellen <Formel tex={String.raw`x=\pm\pi`} /> bei <Formel tex="y=0" /> und die Periode ist <Formel tex="2\pi" />.</>),
            opt('b', 'Abbildung 1 und Abbildung 3', false, <>Abbildung 3 hat einen Tiefpunkt bei <Formel tex="x=0" /> mit <Formel tex="y=0" />. Bei <Formel tex="g_a" /> ist <Formel tex="g_a(0)=2a" />. Das ist nur 0 für <Formel tex="a=0" />, was ausgeschlossen ist.</>),
            opt('c', 'Abbildung 2 und Abbildung 4', false, <>Abbildung 4 hat die Periode <Formel tex="4\pi" />. Bei <Formel tex="g_a" /> ist sie <Formel tex="2\pi" />.</>),
            opt('d', 'Alle vier Abbildungen', false, <>Die Abbildungen 3 und 4 passen nicht: Abbildung 3 hat bei <Formel tex="x=0" /> den Wert 0, Abbildung 4 hat die falsche Periode.</>),
          ], 3)}
          erklaerung={<>Für <Formel tex={String.raw`g_a(x)=a+a\cos(x)=a\,(1+\cos(x))`} /> gilt: Periode <Formel tex="2\pi" />, <Formel tex="g_a(\pm\pi)=0" /> und <Formel tex="g_a(0)=2a" />. Für <Formel tex="a>0" /> liegen die Tiefpunkte bei <Formel tex={String.raw`x=\pm\pi`} /> auf der x-Achse, für <Formel tex="a<0" /> die Hochpunkte.</>}
        >
          <p>
            Für jedes <Formel tex="a\neq 0" /> ist die Funktion <Formel tex="g_a" /> gegeben durch <Formel tex={String.raw`g_a(x)=a+a\cdot\cos(x)`} /> mit <Formel tex={String.raw`x\in[-2\pi;\,2\pi]`} />. Prüfe, welche der folgenden Abbildungen zu einer Funktion <Formel tex="g_a" /> gehören können.
          </p>
          <div className="bilder-paar">
            {GA_ABBILDUNGEN.map((ab) => (
              <figure key={ab.nr} className="bild">
                <Funktionsgraph
                  kurven={[{ f: ab.f }]}
                  bereich={[-2 * PI - 0.4, 2 * PI + 0.4, ab.nr === 2 ? -3.6 : -0.8, ab.nr === 2 ? 0.8 : 6.8]}
                  xTeilung={PI / 2}
                  xBeschriftung="pi"
                  yTeilung={ab.nr === 2 ? 1 : 2}
                  className="brett-3zu2"
                  beschreibung={`Abbildung ${ab.nr}: Schaubild im Intervall von minus 2π bis 2π.`}
                />
                <figcaption>Abbildung {ab.nr}</figcaption>
              </figure>
            ))}
          </div>
        </Auswahlfrage>

        <Aufgabe
          nummer="10b"
          titel="Wert von a bestimmen"
          felder={[
            { id: 'a1', name: 'Wert von a für Abbildung 1', beschriftung: <><Formel tex="a" /> für Abbildung 1</>, erwartet: GA_ABBILDUNGEN[0].a },
            { id: 'a2', name: 'Wert von a für Abbildung 2', beschriftung: <><Formel tex="a" /> für Abbildung 2</>, erwartet: GA_ABBILDUNGEN[1].a },
          ]}
          hilfen={[
            <>Es gilt <Formel tex={String.raw`g_a(0)=a+a\cos(0)=2a`} />. Lies den Funktionswert bei <Formel tex="x=0" /> in der Abbildung ab.</>,
            <>Kontrolle: Bei <Formel tex={String.raw`x=\pm\pi`} /> muss der Funktionswert 0 sein.</>,
          ]}
          loesung={[
            <>Abbildung 1: <Formel tex="g_a(0)=4" />, also <Formel tex="2a=4" /> und <Formel tex="a=2" />.</>,
            <>Abbildung 2: <Formel tex="g_a(0)=-3" />, also <Formel tex="2a=-3" /> und <Formel tex="a=-1{,}5" />.</>,
          ]}
        >
          <p>Bestimme für die beiden passenden Abbildungen aus Aufgabe 10a jeweils den zugehörigen Wert von <Formel tex="a" />.</p>
        </Aufgabe>

        <Auswahlfrage
          nummer="11a"
          titel="Der Fall a = 1"
          optionen={platziere([
            opt('a', 'Nein, das Schaubild berührt die x-Achse im Punkt (π/2 | 0), liegt dort aber nicht oberhalb.', true, <>Richtig. Für <Formel tex="a=1" /> ist <Formel tex="f(x)=1-\sin(x)" /> und <Formel tex={String.raw`f\!\left(\tfrac{\pi}{2}\right)=0`} />. Der Punkt liegt wegen <Formel tex={String.raw`0<\tfrac{\pi}{2}<2\pi`} /> im Definitionsbereich. Dort ist das Schaubild nicht oberhalb der x-Achse.</>),
            opt('b', 'Ja, denn 1 − sin(x) ist nie negativ.', false, <>Es gilt zwar <Formel tex="1-\sin(x)\ge 0" />, aber „oberhalb“ heißt <Formel tex="f(x)>0" />. An der Stelle <Formel tex={String.raw`x=\tfrac{\pi}{2}`} /> ist <Formel tex="f(x)=0" />.</>),
            opt('c', 'Ja, denn der Punkt (π/2 | 0) gehört nicht zum Definitionsbereich.', false, <>Doch, <Formel tex={String.raw`\tfrac{\pi}{2}`} /> liegt im Intervall <Formel tex={String.raw`0<x<2\pi`} />. Nur die Randstellen 0 und <Formel tex="2\pi" /> gehören nicht dazu.</>),
            opt('d', 'Nein, das Schaubild verläuft für a = 1 überall unterhalb der x-Achse.', false, <>Der kleinste Funktionswert ist 0, kein negativer Wert. Das Schaubild liegt nicht unterhalb.</>),
          ], 1)}
          erklaerung={<>Der kleinste Wert von <Formel tex={String.raw`f(x)=\tfrac{1}{a}-a\sin(x)`} /> ist <Formel tex={String.raw`\tfrac{1}{a}-a`} />, er wird bei <Formel tex={String.raw`x=\tfrac{\pi}{2}`} /> angenommen. Für <Formel tex="a=1" /> ist er 0.</>}
        >
          <p>
            Für jedes positive reelle <Formel tex="a" /> ist die Funktion <Formel tex="f" /> gegeben durch <Formel tex={String.raw`f(x)=\tfrac{1}{a}-a\cdot\sin(x)`} /> mit <Formel tex={String.raw`0<x<2\pi`} />. Das Schaubild von <Formel tex="f" /> heißt <Formel tex="K" />. Probiere im Labor verschiedene Werte von <Formel tex="a" /> aus. Verläuft <Formel tex="K" /> für <Formel tex="a=1" /> oberhalb der x-Achse?
          </p>
          <Parameterlabor />
        </Auswahlfrage>

        <Aufgabe
          nummer="11b"
          titel="Für welche a oberhalb der x-Achse?"
          felder={[
            { id: 'grenze', name: 'Obere Grenze für a', beschriftung: <><Formel tex="K" /> liegt oberhalb für <Formel tex="a<" /></>, erwartet: FA_GRENZE },
            { id: 'wert', name: 'Kleinster Funktionswert für a gleich 0,5', beschriftung: <>kleinster Wert bei <Formel tex="a=0{,}5" /></>, erwartet: 1.5 },
          ]}
          hilfen={[
            <>Der kleinste Funktionswert entsteht, wenn <Formel tex="\sin(x)" /> am größten ist, also bei <Formel tex="\sin(x)=1" /> (<Formel tex={String.raw`x=\tfrac{\pi}{2}`} />). Er beträgt <Formel tex={String.raw`\tfrac{1}{a}-a`} />.</>,
            <>Das Schaubild liegt oberhalb der x-Achse, wenn der kleinste Wert größer als 0 ist: <Formel tex={String.raw`\tfrac{1}{a}-a>0`} />. Multipliziere mit <Formel tex="a>0" />.</>,
          ]}
          loesung={[
            <>Kleinster Wert: <Formel tex={String.raw`f\!\left(\tfrac{\pi}{2}\right)=\tfrac{1}{a}-a`} />. Für <Formel tex="a=0{,}5" /> ist das <Formel tex="2-0{,}5=1{,}5" />.</>,
            <><Formel tex={String.raw`\tfrac{1}{a}-a>0`} /> ergibt mit <Formel tex="a>0" /> die Ungleichung <Formel tex="1-a^2>0" />, also <Formel tex="a^2<1" /> und wegen <Formel tex="a>0" /> weiter <Formel tex="a<1" />.</>,
            <>Antwort: <Formel tex="K" /> verläuft oberhalb der x-Achse für <Formel tex="0<a<1" />.</>,
          ]}
        >
          <p>
            Für welche Werte von <Formel tex="a" /> verläuft <Formel tex="K" /> oberhalb der x-Achse? Gib die obere Grenze für <Formel tex="a" /> an. Bestimme außerdem den kleinsten Funktionswert für <Formel tex="a=0{,}5" />.
          </p>
        </Aufgabe>
      </Abschnitt>

      <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
        <h3>Vom Text zum Funktionsterm</h3>
        <Hinweis art="merksatz" titel="Modellieren mit Sinus und Kosinus">
          <ol className="liste">
            <li>Größen festlegen: Was ist <Formel tex="x" />, was ist <Formel tex="f(x)" />, welche Einheiten?</li>
            <li>
              Aus den Angaben bestimmen: <Formel tex={String.raw`d=\dfrac{y_{\max}+y_{\min}}{2}`} />, <Formel tex={String.raw`|a|=\dfrac{y_{\max}-y_{\min}}{2}`} />, <Formel tex={String.raw`b=\dfrac{2\pi}{p}`} />, <Formel tex="c" /> aus dem Referenzpunkt (Kosinus: Hochpunkt, bei <Formel tex="a<0" /> Tiefpunkt; Sinus: aufsteigender Wendepunkt).
            </li>
            <li>Frage übersetzen: genau <Formel tex="k" /> bedeutet <Formel tex="f(x)=k" />, größer oder kleiner als <Formel tex="k" /> bedeutet Ungleichung.</li>
            <li>Gleichung lösen: umformen, substituieren, Lösungen in einer Periode, Rücksubstitution, weitere Lösungen mit <Formel tex="p" />.</li>
            <li>Im Zusammenhang antworten: Einheit, Antwortsatz, Uhrzeit oder Datum, passende Rundung.</li>
          </ol>
        </Hinweis>

        <Bild
          bild={
            <Zeitschaubild
              f={(x) => wertTrig(MODELLBILD, x, 'cos')}
              schwelle={8}
              bereich={[-2.2, 12.4, -1.5, 13.5]}
              xTeilung={1}
              yTeilung={2}
              markiert={[{ von: 1 - 4 / 3, bis: 1 + 4 / 3 }, { von: 9 - 4 / 3, bis: 9 + 4 / 3 }]}
              punkte={[
                { x: 1 - 4 / 3, y: 8, text: 'x₁' },
                { x: 1 + 4 / 3, y: 8, text: 'x₂' },
              ]}
              beschreibung="Schaubild einer Kosinuskurve mit der Geraden y gleich 8. Die grün markierten Bereiche um die Hochpunkte sind die Stellen, an denen der Wert größer als 8 ist. Die Grenzen sind die Lösungen x1 und x2 der Gleichung f von x gleich 8."
            />
          }
        >
          Ungleichung <Formel tex="f(x)>k" /> (hier <Formel tex="k=8" />): Löse <Formel tex="f(x)=k" />. Die Lösungen sind die Grenzen. Zwischen den beiden Lösungen um einen Hochpunkt gilt <Formel tex="f(x)>k" />, um einen Tiefpunkt gilt <Formel tex="f(x)<k" />.
        </Bild>

        <h3>Wichtige Hinweise</h3>
        <ul className="liste">
          <li>
            <strong>Randwerte:</strong> Bei „unter“ oder „über“ gehören die Lösungsstellen selbst nicht dazu. Bei <Formel tex="f(t)<175" /> ist an den Lösungstagen der Preis genau 175. Prüfe bei „an allen Tagen“ den ersten und letzten Tag.
          </li>
          <li>
            <strong>Zeiten runden:</strong> Dezimalstunden mal 60 ergeben Minuten, zum Beispiel <Formel tex="0{,}79\,\text{h}\approx 47{,}5\,\text{min}" />. Beginn eines Zeitraums nach oben runden, Ende nach unten, damit die Bedingung im ganzen Zeitraum erfüllt ist.
          </li>
          <li>
            <strong>Annahmen nennen:</strong> Wenn eine Angabe fehlt (zum Beispiel die Periode), ist sie eine Annahme. Schreibe sie dazu.
          </li>
          <li>
            <strong>Alle Lösungen:</strong> Addiere die Periode erst nach der Rücksubstitution, und nur für Lösungen, die im Definitionsbereich liegen.
          </li>
          <li>
            <strong>Produkte nicht durch <Formel tex="x" /> teilen:</strong> Bringe alles auf eine Seite und klammere aus, damit keine Lösung verloren geht.
          </li>
        </ul>

        <h3>Typische Fehler</h3>
        <ul className="liste">
          <li>Die Periode <Formel tex="p" /> statt <Formel tex={String.raw`b=\tfrac{2\pi}{p}`} /> in den Term eingesetzt.</li>
          <li>Bei der Rücksubstitution nicht durch <Formel tex="b" /> geteilt oder <Formel tex="c" /> vergessen.</li>
          <li>Nur eine der beiden Lösungen einer Periode angegeben.</li>
          <li>Das Ergebnis nur als Zahl angegeben, ohne Einheit, Uhrzeit oder Antwortsatz.</li>
          <li>Der Taschenrechner steht auf Gradmaß (DEG) statt auf Bogenmaß (RAD).</li>
        </ul>

        <h3>Ausblick</h3>
        <p>
          Welche Fähigkeiten du nach diesem Themenbereich beherrschen solltest, fasst die Ich-kann-Liste zusammen. Sie bildet den Abschluss der trigonometrischen Funktionen.
        </p>
      </Abschnitt>
    </>
  );
}

