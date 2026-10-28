import { Aufklappen } from '@/components/Aufklappen';
import { Formel } from '@/components/Formel';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { Hinweis } from '@/components/Hinweis';
import { Schachtelerkundung } from './Schachtelerkundung';
import { Wertetabelle } from './Wertetabelle';
import { Wurferkundung } from './Wurferkundung';

const tex = String.raw;

const milchtuete = (x: number) => (4 * x + 0.7) * (1000 / (x * x) + x + 1.4);

export default function Modul() {
  return (
    <>
      <p className="einleitung">
        Viele Probleme fragen nach dem Besten: am meisten Volumen, am wenigsten Material, die größte Weite. Du lernst ein Vorgehen kennen, mit dem
        sich solche Aufgaben in sechs Schritten lösen lassen, und wendest es auf verschiedene Situationen an.
      </p>

      <h2>1 Einstieg: Die optimale Schachtel</h2>
      <p>
        Aus einem rechteckigen Blatt Papier (30 cm × 21 cm) soll eine oben offene Schachtel entstehen. Dazu werden an allen vier Ecken Quadrate der
        Seitenlänge <Formel tex="x" /> ausgeschnitten, die Seitenflächen werden hochgeklappt. Die Länge <Formel tex="x" /> ist die Höhe der
        Schachtel. <strong>Für welches x wird das Volumen maximal?</strong>
      </p>

      <h3>Ausprobieren und vermuten</h3>
      <p>Berechne für drei Werte von x die Maße und das Volumen und prüfe deine Eingaben.</p>
      <Wertetabelle />

      <h3>Erkunden</h3>
      <p>Verändere x und beobachte, wie sich das Netz und das Volumen verändern. Notiere deine Vermutung für den besten Wert von x.</p>
      <Schachtelerkundung />

      <h2>2 Ein mathematisches Modell aufstellen</h2>
      <p>
        Nach dem Falten gilt für die Maße der Schachtel (in cm): Höhe <Formel tex="x" />, Länge <Formel tex="30-2x" />, Breite <Formel tex="21-2x" />.
        Das Volumen hängt also nur von x ab:
      </p>
      <Formel anzeige tex={tex`V(x)=x\cdot(30-2x)\cdot(21-2x)=4x^3-102x^2+630x`} />
      <p>
        Damit eine Schachtel entsteht, muss <Formel tex="x>0" /> gelten. Außerdem müssen Länge und Breite positiv bleiben, also{' '}
        <Formel tex={tex`21-2x>0`} />, das heißt <Formel tex={tex`x<10{,}5`} />. Als Definitionsbereich der Zielfunktion verwenden wir{' '}
        <Formel tex={tex`D=\,]0;\,10{,}5[`} />.
      </p>

      <h2>3 Mit Differentialrechnung optimieren</h2>
      <p>Bestimme nun den Wert von x, bei dem das Volumen maximal wird, und begründe, dass tatsächlich ein Maximum vorliegt. Gib auch die Maße der optimalen Schachtel an.</p>
      <Aufklappen titel="Lösung: Extremstelle bestimmen">
        <p>Notwendige Bedingung für ein Extremum: <Formel tex={tex`V'(x)=0`} />.</p>
        <Formel anzeige tex={tex`V'(x)=12x^2-204x+630=0 \;\Longleftrightarrow\; 2x^2-34x+105=0`} />
        <Formel anzeige tex={tex`x_{1,2}=\frac{34\pm\sqrt{1156-840}}{4}=\frac{17\pm\sqrt{79}}{2}`} />
        <p>
          Es ergibt sich <Formel tex={tex`x_1=\frac{17-\sqrt{79}}{2}\approx 4{,}06`} /> und <Formel tex={tex`x_2\approx 12{,}94`} />. Der Wert{' '}
          <Formel tex="x_2" /> liegt nicht im Definitionsbereich und entfällt.
        </p>
        <p>Hinreichende Bedingung: Wegen</p>
        <Formel anzeige tex={tex`V''(x)=24x-204,\qquad V''(x_1)=-12\sqrt{79}<0`} />
        <p>liegt bei <Formel tex="x_1" /> ein Hochpunkt vor.</p>
        <p>
          Randwerte: <Formel tex={tex`V(0)=0`} /> und <Formel tex={tex`V(10{,}5)=0`} />, aber <Formel tex={tex`V(x_1)\approx 1144{,}17`} />. Das lokale
          Maximum ist also auch das globale Maximum auf D.
        </p>
        <p>
          Ergebnis: Bei einer Höhe von etwa 4,06 cm hat die Schachtel das größte Volumen von etwa 1144 cm³. Sie ist dann etwa 21,89 cm lang und 12,89
          cm breit.
        </p>
      </Aufklappen>

      <h3>Das Ergebnis deuten</h3>
      <p>Warum ist das Volumen sowohl bei sehr kleinen als auch bei sehr großen Ausschnitten gering? Vergleiche dein Ergebnis mit deiner Vermutung.</p>
      <Aufklappen titel="Hinweis zur Deutung">
        <p>
          Sehr kleine Ausschnitte ergeben eine sehr niedrige Schachtel, sehr große Ausschnitte eine sehr schmale Grundfläche. In beiden Fällen ist ein Faktor
          des Produkts fast null. Das Maximum liegt dazwischen, weil sich hier die wachsende Höhe und die schrumpfende Grundfläche am besten ausgleichen.
        </p>
      </Aufklappen>

      <h2>4 Die Strategie</h2>
      <Hinweis art="merksatz" titel="Extremwertaufgaben in sechs Schritten">
        <ol className="liste">
          <li><strong>Zielgröße beschreiben:</strong> Was soll maximal oder minimal werden? Stelle dafür einen Term auf.</li>
          <li><strong>Nebenbedingungen suchen:</strong> Welche Zusammenhänge verbinden die vorkommenden Größen?</li>
          <li><strong>Zielfunktion bestimmen:</strong> Eliminiere Größen mithilfe der Nebenbedingungen, sodass nur noch eine Variable übrig bleibt. Lege den Definitionsbereich fest.</li>
          <li><strong>Extrema untersuchen:</strong> Löse <Formel tex="f'(x)=0" /> und prüfe mit <Formel tex={tex`f''`} /> oder einem Vorzeichenwechsel von <Formel tex="f'" />.</li>
          <li><strong>Randwerte vergleichen:</strong> Ein lokales Extremum muss nicht das globale sein. Vergleiche mit den Funktionswerten am Rand des Definitionsbereichs oder mit Grenzwerten.</li>
          <li><strong>Ergebnis deuten:</strong> Beantworte die Frage im Sachzusammenhang und prüfe, ob das Ergebnis sinnvoll ist.</li>
        </ol>
      </Hinweis>
      <p>
        Bei der Schachtel entsprechen die Schritte 1 bis 3 dem Abschnitt „Modell“, die Schritte 4 bis 6 dem Abschnitt „Optimieren“. Beim Aufstellen der
        Zielfunktion ist der Definitionsbereich keine Formalie: Er legt fest, welche Randwerte in Schritt 5 zu prüfen sind.
      </p>

      <h2>5 Üben</h2>
      <p>Bearbeite die Aufgaben nach der Sechs-Schritte-Strategie. Die Lösungen sind eingeklappt, schaue erst nach, wenn du ein Ergebnis hast.</p>

      <h3>Aufgabe 1: Rechteck unter einer Parabel</h3>
      <p>
        Gegeben ist <Formel tex={tex`f(x)=-x^2+9`} />. Die Punkte <Formel tex={tex`A(-u\,|\,0)`} />, <Formel tex={tex`B(u\,|\,0)`} />,{' '}
        <Formel tex={tex`C(u\,|\,f(u))`} /> und <Formel tex={tex`D(-u\,|\,f(u))`} /> mit <Formel tex={tex`0\le u\le 3`} /> bilden ein Rechteck.
      </p>
      <ol type="a" className="liste">
        <li>Für welchen exakten Wert von u wird der Flächeninhalt des Rechtecks maximal? Wie groß ist er?</li>
        <li>Für welchen exakten Wert von u wird der Umfang maximal? Wie groß ist er?</li>
      </ol>
      <Aufklappen titel="Lösung">
        <p>
          a) Zielfunktion: <Formel tex={tex`A(u)=2u\,(9-u^2)=18u-2u^3`} /> auf <Formel tex={tex`[0;3]`} />. Aus <Formel tex={tex`A'(u)=18-6u^2=0`} />{' '}
          folgt <Formel tex={tex`u=\sqrt{3}`} />, wegen <Formel tex={tex`A''(u)=-12u<0`} /> ein Hochpunkt. Randwerte: <Formel tex={tex`A(0)=A(3)=0`} />.
          Maximaler Flächeninhalt: <Formel tex={tex`A(\sqrt{3})=12\sqrt{3}\approx 20{,}78`} />.
        </p>
        <p>
          b) Zielfunktion: <Formel tex={tex`U(u)=2\,\bigl(2u+9-u^2\bigr)=-2u^2+4u+18`} />. Aus <Formel tex={tex`U'(u)=-4u+4=0`} /> folgt{' '}
          <Formel tex={tex`u=1`} />, wegen <Formel tex={tex`U''(u)=-4<0`} /> ein Hochpunkt. Randwerte: <Formel tex={tex`U(0)=18`} />,{' '}
          <Formel tex={tex`U(3)=12`} />. Maximaler Umfang: <Formel tex={tex`U(1)=20`} />.
        </p>
        <p>Flächeninhalt und Umfang werden bei unterschiedlichen Rechtecken maximal. Die Wahl der Zielgröße bestimmt die Lösung.</p>
      </Aufklappen>

      <h3>Aufgabe 2: Rechtecke und Zylinder unter einer glockenförmigen Kurve</h3>
      <p>
        Zwischen dem Graphen von <Formel tex={tex`f(x)=\frac{1}{x^2+1}`} /> und der x-Achse liegen Rechtecke, die symmetrisch zur y-Achse sind. Zwei
        Eckpunkte liegen auf der x-Achse, zwei auf dem Graphen.
      </p>
      <ol type="a" className="liste">
        <li>Welches Rechteck hat den größten Flächeninhalt?</li>
        <li>Lässt man die Rechtecke um die y-Achse rotieren, entstehen Zylinder. Welcher Zylinder hat das größte Volumen?</li>
        <li>Variiere die Aufgabe: Untersuche dieselben Fragen für eine andere gerade Funktion, zum Beispiel <Formel tex={tex`g(x)=4-x^2`} /> oder <Formel tex={tex`h(x)=\mathrm{e}^{-x^2}`} />.</li>
      </ol>
      <Aufklappen titel="Lösung zu a) und b)">
        <p>
          a) Das Rechteck mit den Eckpunkten <Formel tex={tex`(\pm u\,|\,0)`} /> und <Formel tex={tex`(\pm u\,|\,f(u))`} /> mit <Formel tex={tex`u>0`} /> hat den
          Flächeninhalt <Formel tex={tex`A(u)=\dfrac{2u}{u^2+1}`} />. Es gilt
        </p>
        <Formel anzeige tex={tex`A'(u)=\frac{2\,(u^2+1)-2u\cdot 2u}{(u^2+1)^2}=\frac{2\,(1-u^2)}{(u^2+1)^2}`} />
        <p>
          Die Nullstelle im Definitionsbereich ist <Formel tex="u=1" />. Dort wechselt <Formel tex="A'" /> das Vorzeichen von plus nach minus: Hochpunkt.
          Am Rand gilt <Formel tex={tex`A(u)\to 0`} /> für <Formel tex={tex`u\to 0`} /> und für <Formel tex={tex`u\to\infty`} />. Das Rechteck mit{' '}
          <Formel tex="u=1" /> (Breite 2, Höhe 0,5) hat den größten Flächeninhalt <Formel tex="A(1)=1" />.
        </p>
        <p>
          b) Der Zylinder hat den Radius u und die Höhe <Formel tex="f(u)" />, also
        </p>
        <Formel anzeige tex={tex`V(u)=\pi u^2\cdot\frac{1}{u^2+1}=\pi\left(1-\frac{1}{u^2+1}\right),\qquad V'(u)=\frac{2\pi u}{(u^2+1)^2}>0`} />
        <p>
          Die Zielfunktion ist für <Formel tex="u>0" /> streng monoton wachsend und bleibt unter <Formel tex={tex`\pi`} />, ohne diesen Wert zu erreichen.
          Es gibt <strong>keinen</strong> Zylinder mit größtem Volumen. Der Definitionsbereich ist nach oben offen, und die Randbetrachtung (Grenzwert für{' '}
          <Formel tex={tex`u\to\infty`} />) zeigt, dass kein Maximum angenommen wird. Eine Aufgabe darf also auch ohne Lösung bleiben.
        </p>
      </Aufklappen>

      <h3>Aufgabe 3: Der optimale Abwurfwinkel</h3>
      <p>
        Beim Kugelstoßen oder Weitwurf kann man die Flugbahn ohne Luftwiderstand und ohne Abwurfhöhe als Parabel beschreiben. Bei einer Abwurfgeschwindigkeit
        von <Formel tex={tex`v=10\,\frac{\text{m}}{\text{s}}`} /> und dem Abwurfwinkel <Formel tex={tex`\alpha`} /> gilt
      </p>
      <Formel anzeige tex={tex`f(x)=\tan(\alpha)\cdot x-\frac{5}{100\cdot\cos^2(\alpha)}\cdot x^2`} />
      <p>mit der Weite x und der Höhe <Formel tex="f(x)" /> in Metern.</p>
      <Wurferkundung />
      <ol type="a" className="liste">
        <li>Beobachte mit dem Regler, wie sich die Wurfweite verändert. Bei welchem Winkel vermutest du die größte Weite?</li>
        <li>Gib die Wurfweite W in Abhängigkeit von <Formel tex={tex`\alpha`} /> an. Die Wurfweite ist die zweite Nullstelle von f.</li>
        <li>Berechne den Winkel mit der größten Wurfweite.</li>
      </ol>
      <Aufklappen titel="Lösung">
        <p>
          b) Aus <Formel tex="f(x)=0" /> folgt durch Ausklammern <Formel tex={tex`x\cdot\Bigl(\tan(\alpha)-\dfrac{5}{100\cos^2(\alpha)}\,x\Bigr)=0`} />. Die Lösung{' '}
          <Formel tex="x_1=0" /> ist der Abwurfpunkt, die zweite Lösung ist die Wurfweite:
        </p>
        <Formel anzeige tex={tex`W(\alpha)=20\tan(\alpha)\cos^2(\alpha)=20\sin(\alpha)\cos(\alpha)=10\sin(2\alpha),\qquad D=\,]0^\circ;90^\circ[`} />
        <p>
          c) <Formel tex={tex`W'(\alpha)=20\cos(2\alpha)=0`} /> ergibt im Definitionsbereich <Formel tex={tex`\alpha=45^\circ`} />. Wegen{' '}
          <Formel tex={tex`W''(\alpha)=-40\sin(2\alpha)<0`} /> ist das ein Hochpunkt. Der Funktionswert ist <Formel tex={tex`W(45^\circ)=10`} />, an den Rändern
          des Definitionsbereichs geht W gegen 0. Bei <Formel tex={tex`45^\circ`} /> wird die größte Weite von 10 m erreicht.
        </p>
        <p>
          Gerechnet wird im Bogenmaß: <Formel tex={tex`\alpha=\pi/4`} /> entspricht <Formel tex={tex`45^\circ`} />.
        </p>
        <p>Das Modell vernachlässigt die Abwurfhöhe. Bei realen Würfen und Stößen mit Abwurfhöhe liegt der beste Winkel etwas unter 45°.</p>
      </Aufklappen>

      <h3>Aufgabe 4: Die optimale Milchtüte</h3>
      <p>
        Milchtüten haben die Form einer quadratischen Säule und werden aus einem rechteckigen Stück Pappe gefaltet und verklebt. Für den Entwurf gilt:
        An drei Seiten werden 0,7 cm Rand zum Kleben benötigt, der Boden ist quadratisch mit der Kantenlänge x, das Volumen beträgt 1 Liter. Die Höhe der
        Tüte heißt h (alle Längen in cm).
      </p>
      <p>Das Schnittmuster hat die Maße</p>
      <Formel anzeige tex={tex`\text{Breite}=4x+0{,}7,\qquad \text{Höhe des Zuschnitts}=h+x+1{,}4`} />
      <ol type="a" className="liste">
        <li>Bestimme den Flächeninhalt der verwendeten Pappe in Abhängigkeit von der Grundkantenlänge x.</li>
        <li>Ist eine reale Milchtüte mit x ≈ 7,2 cm und h ≈ 19,8 cm hinsichtlich des Materialverbrauchs optimiert?</li>
      </ol>
      <Aufklappen titel="Lösung zu a)">
        <p>Zielgröße: Flächeninhalt der Pappe <Formel tex={tex`A=(4x+0{,}7)\,(h+x+1{,}4)`} />.</p>
        <p>Nebenbedingung: <Formel tex={tex`V=x^2\cdot h=1000`} />, also <Formel tex={tex`h=\dfrac{1000}{x^2}`} />.</p>
        <p>Zielfunktion mit <Formel tex={tex`D=\,]0;\infty[`} />:</p>
        <Formel anzeige tex={tex`A(x)=(4x+0{,}7)\left(\frac{1000}{x^2}+x+1{,}4\right)=4x^2+6{,}3x+0{,}98+\frac{4000}{x}+\frac{700}{x^2}`} />
      </Aufklappen>
      <Aufklappen titel="Lösung zu b)">
        <p>
          Die Gleichung <Formel tex={tex`A'(x)=8x+6{,}3-\dfrac{4000}{x^2}-\dfrac{1400}{x^3}=0`} /> lässt sich nicht bequem von Hand lösen. Mit dem
          Taschenrechner oder einem Funktionsplotter ergibt sich <Formel tex={tex`x\approx 7{,}8`} /> mit <Formel tex={tex`A(7{,}8)\approx 817{,}8`} />. Dann
          ist <Formel tex={tex`h=\dfrac{1000}{7{,}8^2}\approx 16{,}4`} />.
        </p>
        <Funktionsgraph
          f={milchtuete}
          von={3}
          bis={16}
          xMin={3}
          xMax={16}
          yMin={800}
          yMax={1500}
          xSchritt={1}
          ySchritt={100}
          xName="x in cm"
          yName="A in cm²"
          punkte={[{ x: 7.8, y: milchtuete(7.8), hervorgehoben: true, beschriftung: 'Tiefpunkt (7,8 | 817,8)' }]}
          beschreibung="Graph des Pappenverbrauchs A in Abhängigkeit von der Grundkantenlänge x mit einem Tiefpunkt bei etwa 7,8 Zentimetern und 817,8 Quadratzentimetern. Links und rechts davon steigt der Graph an."
        />
        <p>
          Randverhalten: Für <Formel tex={tex`x\to 0`} /> und für <Formel tex={tex`x\to\infty`} /> gilt <Formel tex={tex`A(x)\to\infty`} />. Der Tiefpunkt
          ist daher das globale Minimum.
        </p>
        <p>
          Die reale Tüte (7,2 cm, 19,8 cm) braucht <Formel tex={tex`(4\cdot 7{,}2+0{,}7)(19{,}8+7{,}2+1{,}4)=837{,}8`} /> cm² Pappe, also etwa 2 % mehr als das
          Minimum von etwa 817,8 cm². Hinsichtlich des Materialverbrauchs ist sie nicht optimiert. Im Modell fehlen aber weitere Gesichtspunkte wie
          Stabilität, Handlichkeit und Verpackung im Regal, die die reale Form erklären können.
        </p>
      </Aufklappen>

      <h2>6 Zum Weiterdenken</h2>
      <ul className="liste">
        <li>Warum reicht in Schritt 4 allein die Bedingung <Formel tex="f'(x)=0" /> nicht aus, um ein Maximum zu belegen?</li>
        <li>An welcher Stelle der Strategie ist der Definitionsbereich entscheidend? Nenne ein Beispiel aus diesem Modul, in dem er das Ergebnis verändert.</li>
        <li>Erfinde eine Extremwertaufgabe, die mit denselben sechs Schritten lösbar ist, und tausche sie mit einer Mitschülerin oder einem Mitschüler.</li>
      </ul>
    </>
  );
}
