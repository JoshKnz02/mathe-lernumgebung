import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { abstandsquadrat, abstandZurZeit, begegnung, geschwindigkeit, kleinsterAbstand, minutenSekunden, ort, type Bewegung } from '@/lib/bewegung';
import type { Gerade } from '@/lib/gerade';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t, zt } from '@/lib/modulhilfen';
import { parallelSchatten, zentralSchatten } from '@/lib/projektion';
import { aufgAbstand, aufgKollision, aufgMast, aufgParallel, aufgTetraeder, aufgWetter, aufgZeiten, aufgZentral } from './Bilder';
import { A_ABSTAND, A_KOLLISION, A_MAST, A_NEGATIV, A_PARALLEL, A_PARAMETER, A_TETRAEDER, A_WETTER, A_ZEITEN, A_ZEITEN_AUSWAHL, A_ZENTRAL } from './daten';
import { abstandsfunktionZeilen, abstandsvektor, bahnGleichung, betragZeilen, geschwindigkeitZeilen, gl, glSchmal, gleichungZeilen, kollisionsGleichungen, kollisionsGleichungenSortiert, koeffizientenZeilen, lxZeile, minimumZeilen, ortZeilen, parallelZeilen, polyTeX, rund2, spalteBruch, stunden, zeitGleichung, zentralZeilen, type Zeilen } from './rechenhilfen';

const Z = ({ z }: { z: Zeilen }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;
const Eq = ({ tex }: { tex: string }) => <Umbruchformel tex={tex} schmal={tex} />;
const G = ({ g, name = 'g', par = 't' }: { g: Gerade; name?: string; par?: string }) => <Umbruchformel tex={gl(g, name, par)} schmal={glSchmal(g, name, par)} />;
const PK = (name: string, p: number[]) => punktTeX(name, p);
const feldZahl = (id: string, name: string, beschriftung: string, erwartet: number, toleranz?: number): Feld => ({ id, name, beschriftung: <Formel tex={beschriftung} />, erwartet, ...(toleranz ? { toleranz } : {}) });
const KMH = '\\frac{\\text{km}}{\\text{h}}';
const dez = (x: number) => zt(Math.round(x * 100) / 100);
const ROEM = ['I', 'II', 'III'];
/** links = Rechnung = Ergebnis: einzeilig, schmal vor jedem Gleichheitszeichen geteilt. */
const gleichungZeilen3 = (links: string, rechnung: string, ergebnis: number): Zeilen => ({ tex: `${links}=${rechnung}=${ergebnis}`, schmal: `\\begin{gathered}${[links, `{}=${rechnung}`, `{}=${ergebnis}`].join('\\\\')}\\end{gathered}` });

export function Ueberpruefen() {
  const w = A_WETTER;
  const k = A_KOLLISION;
  const z = A_ZEITEN;
  const ab = A_ABSTAND;
  const ng = A_NEGATIV;
  const pa = A_PARALLEL;
  const ze = A_ZENTRAL;
  const pr = A_PARAMETER;
  const te = A_TETRAEDER;
  const ma = A_MAST;
  const vW = geschwindigkeit(w.b);
  const tW = w.minuten / 60;
  const beK = begegnung(k.h, k.ballon);
  const beZ = begegnung(z.a, z.b);
  const koeff = abstandsquadrat(ab.h, ab.ballon);
  const kA = kleinsterAbstand(ab.h, ab.ballon);
  const kN = kleinsterAbstand(ng.b1, ng.b2);
  const dN0 = abstandZurZeit(ng.b1, ng.b2, 0);
  const dNS = abstandZurZeit(ng.b1, ng.b2, kN.scheitel!);
  const sP = parallelSchatten(pa.ecken[0]!, pa.v, 'e13');
  const zS = ze.ecken.map((e) => zentralSchatten(e, ze.L, 'e13'));
  const sAuswahl = zentralSchatten(pr.X, pr.L, 'e13');
  const zNamen = ['P', 'Q', 'R'];
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten. Die Aufgaben 1 bis 7 gehören zu den Bewegungen, die Aufgaben 8 bis 12 zu den Schatten. Das Aufstellen von Geradengleichungen steht im Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>, das Minimieren im Modul <Modulverweis modul="optimierung">Optimierung</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma, Brüche wie 11/3 sind erlaubt. Zeiten und Längen gibst du in der Einheit an, die beim Feld steht.</Hinweis>

      <h3>Teil Bewegung</h3>

      <Auswahlfrage
        nummer="1"
        titel="Richtungsvektor und Geschwindigkeitsvektor"
        optionen={platziere(
          [
            opt('a', <>Der Betrag von <Formel tex={t`\vec{u}`} /> ist im Allgemeinen nicht das Tempo. Der Geschwindigkeitsvektor muss die Richtung von <Formel tex={t`\vec{u}`} /> haben und den Betrag <Formel tex="w" nach="." /></>, true, <>Richtig. Der Geschwindigkeitsvektor ist <Formel tex={t`\vec{v}=w\cdot\frac{\vec{u}}{|\vec{u}|}`} nach="." /> Nur wenn <Formel tex={t`|\vec{u}|=w`} /> ist, darf man <Formel tex={t`\vec{u}`} /> direkt nehmen.</>),
            opt('b', <>Weil <Formel tex={t`\vec{u}`} /> nur für Punkte gilt, nicht für Bewegungen.</>, false, <>Der Richtungsvektor ist ein Vektor wie jeder andere. Das Problem ist nicht, wofür er gilt, sondern wie lang er ist.</>),
            opt('c', <>Weil die Zeit dann in Sekunden gemessen werden müsste.</>, false, <>Die Einheit der Zeit ändert nichts daran, dass der Betrag von <Formel tex={t`\vec{u}`} /> nicht das Tempo ist. Sie muss zum Tempo passen, hier Stunden zu <Formel tex={t`\frac{\text{km}}{\text{h}}`} nach="." /></>),
            opt('d', <>Weil man <Formel tex={t`\vec{u}`} /> immer durch die Zeit <Formel tex="t" /> teilen muss.</>, false, <>Die Zeit kommt erst in der Bewegungsgleichung <Formel tex={t`\vec{x}=\vec{p}+t\cdot\vec{v}`} /> vor, nicht im Geschwindigkeitsvektor.</>),
          ],
          1,
        )}
        erklaerung={<>Der Richtungsvektor legt nur die Richtung fest, seine Länge ist beliebig. Der Geschwindigkeitsvektor hat dieselbe Richtung und die Länge des Tempos. Du erhältst ihn, indem du <Formel tex={t`\vec{u}`} /> auf die Länge 1 bringst und mit dem Tempo malnimmst.</>}
      >
        <p>
          Ein Objekt fliegt in Richtung <Formel tex={t`\vec{u}`} /> mit dem Tempo <Formel tex="w" nach="." /> Warum darf man <Formel tex={t`\vec{u}`} /> nicht einfach als Geschwindigkeitsvektor in die Bewegungsgleichung einsetzen?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={2}
        titel="Der Wetterballon"
        felder={[feldZahl('v1', '1. Koordinate von v', 'v_1', vW[0]!), feldZahl('v2', '2. Koordinate von v', 'v_2', vW[1]!), feldZahl('v3', '3. Koordinate von v', 'v_3', vW[2]!), feldZahl('q1', '1. Koordinate des Orts nach 5 Minuten', 'x_1', w.Q[0]), feldZahl('q2', '2. Koordinate des Orts nach 5 Minuten', 'x_2', w.Q[1]), feldZahl('q3', '3. Koordinate des Orts nach 5 Minuten', 'x_3', w.Q[2])]}
        hilfen={[
          <>Berechne zuerst die Länge von <Formel tex={t`\vec{u}`} nach="." /> Der Geschwindigkeitsvektor hat die Richtung von <Formel tex={t`\vec{u}`} /> und die Länge 36.</>,
          <>5 Minuten sind <Formel tex={t`\frac{1}{12}`} /> Stunde. Setze <Formel tex={t`t=\frac{1}{12}`} /> in die Bewegungsgleichung ein.</>,
        ]}
        loesung={[
          <>
            Länge der Richtung:<Z z={betragZeilen(w.b.richtung)} />
          </>,
          <>
            Geschwindigkeitsvektor:<Z z={geschwindigkeitZeilen(w.b)} />
          </>,
          <>
            Bewegungsgleichung:<G g={bahnGleichung(w.b).g} />
          </>,
          <>
            Nach 5 Minuten, <Formel tex={t`t=\frac{1}{12}`} nach=":" />
            <Z z={ortZeilen(w.b.start, tW, vW, 'Q', t`\frac{1}{12}`)} />
          </>,
        ]}
      >
        <p>
          Ein Wetterballon startet im Punkt <Formel tex={PK('P', w.b.start)} /> und treibt geradlinig in die Richtung <Formel tex={t`\vec{u}=${spalte(w.b.richtung)}`} /> mit dem Tempo <Formel tex={t`${w.b.tempo}\,${KMH}`} nach="." /> Eine Längeneinheit ist ein Kilometer, die Zeit <Formel tex="t" /> wird in Stunden gemessen. Bestimme den Geschwindigkeitsvektor <Formel tex={t`\vec{v}`} /> und den Ort des Ballons nach 5 Minuten.
        </p>
        <KontrollFigur spec={aufgWetter} unter={<>Die Bahn des Ballons mit dem Startpunkt <Formel tex="P" /> und dem Ort <Formel tex={PK('Q', w.Q)} /> nach 5 Minuten.</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Kollision oder nicht?"
        optionen={platziere(
          [
            opt('a', <>Es gibt keine Kollision: Objekt 2 ist {A_ZEITEN_AUSWAHL.t1 - A_ZEITEN_AUSWAHL.t2} Minuten früher in <Formel tex="S" /> als Objekt 1.</>, true, <>Richtig. Ein gemeinsamer Punkt der Bahnen genügt nicht. Für eine Kollision müssen beide zur selben Zeit in <Formel tex="S" /> sein.</>),
            opt('b', <>Es kommt in <Formel tex="S" /> zur Kollision, weil sich die Bahnen schneiden.</>, false, <>Die Bahnen schneiden sich, aber die Objekte sind zu verschiedenen Zeiten in <Formel tex="S" nach="." /> Wenn Objekt 1 ankommt, ist Objekt 2 schon weitergeflogen.</>),
            opt('c', <>Sie kollidieren nach {String((A_ZEITEN_AUSWAHL.t1 + A_ZEITEN_AUSWAHL.t2) / 2).replace('.', ',')} Minuten, dem Mittelwert der beiden Zeiten.</>, false, <>Ein Mittelwert der Zeiten hat keine Bedeutung. Zu dieser Zeit ist keines der beiden Objekte in <Formel tex="S" nach="." /></>),
            opt('d', <>Sie kollidieren nach {A_ZEITEN_AUSWAHL.t2} Minuten, weil Objekt 2 dann in <Formel tex="S" /> ist.</>, false, <>Nach {A_ZEITEN_AUSWAHL.t2} Minuten ist nur Objekt 2 in <Formel tex="S" nach="," /> Objekt 1 ist noch unterwegs. Dazu gehört ein zweites Objekt am selben Ort, es kommt aber erst später.</>),
          ],
          0,
        )}
        erklaerung={<>Eine Kollision im Punktmodell erfordert denselben Ort zur selben Zeit. Du rechnest mit einem gemeinsamen <Formel tex="t" /> für beide Objekte (Bewegungsgleichungen gleichsetzen) und prüfst zusätzlich <Formel tex={t`t\ge 0`} nach="." /></>}
      >
        <p>
          Die Bahnen zweier Objekte schneiden sich im Punkt <Formel tex="S" nach="." /> Objekt 1 erreicht <Formel tex="S" /> nach {A_ZEITEN_AUSWAHL.t1} Minuten, Objekt 2 nach {A_ZEITEN_AUSWAHL.t2} Minuten. Was gilt?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={4}
        titel="Treffen sich Hubschrauber und Ballon?"
        felder={[feldZahl('t', 'Zeit der Kollision in Stunden', 't', k.t), feldZahl('s1', '1. Koordinate des Treffpunkts', 'S_1', k.S[0]), feldZahl('s2', '2. Koordinate des Treffpunkts', 'S_2', k.S[1]), feldZahl('s3', '3. Koordinate des Treffpunkts', 'S_3', k.S[2])]}
        hilfen={[
          <>Bestimme beide Geschwindigkeitsvektoren. Eine Kollision liegt vor, wenn beide zur <em>selben</em> Zeit <Formel tex="t" /> am selben Ort sind, die Bewegungsgleichungen also für ein gemeinsames <Formel tex="t" /> übereinstimmen.</>,
          <>Setze die Bewegungsgleichungen koordinatenweise gleich und löse nach <Formel tex="t" nach="." /> Alle drei Gleichungen müssen dasselbe <Formel tex="t" /> liefern. Den Treffpunkt erhältst du durch Einsetzen.</>,
        ]}
        loesung={[
          <>
            Geschwindigkeitsvektoren, Hubschrauber:<Z z={geschwindigkeitZeilen(k.h)} />
            Ballon:<Z z={geschwindigkeitZeilen(k.ballon)} />
          </>,
          <>
            Gleichsetzen, Koordinate für Koordinate:
            {kollisionsGleichungen(k.h, k.ballon).map(([l, r], i) => (
              <Z key={i} z={gleichungZeilen(`\\text{${ROEM[i]}:}\\ ${l}`, r)} />
            ))}
          </>,
          <>
            Nach <Formel tex="t" /> sortiert:
            {kollisionsGleichungenSortiert(k.h, k.ballon).map(([l, r], i) => (
              <Z key={i} z={gleichungZeilen(`\\text{${ROEM[i]}:}\\ ${l}`, r)} />
            ))}
            Die Gleichungen I und II liefern beide <Formel tex={t`t=0{,}1`} nach="," /> die Gleichung III ist immer erfüllt. Es gibt also ein gemeinsames <Formel tex="t" nach="." />
          </>,
          <>
            Treffpunkt für <Formel tex={t`t=0{,}1`} /> Stunden (6 Minuten):
            <Z z={ortZeilen(k.h.start, k.t, geschwindigkeit(k.h), 'S', stunden(k.t))} />
            Zur Kontrolle mit dem Ballon:<Z z={ortZeilen(k.ballon.start, k.t, geschwindigkeit(k.ballon), 'S', stunden(k.t))} />
          </>,
        ]}
      >
        <p>
          Ein Hubschrauber startet im Punkt <Formel tex={PK('H_0', k.h.start)} /> und fliegt in Richtung <Formel tex={t`\vec{u}_H=${spalte(k.h.richtung)}`} /> mit <Formel tex={t`${k.h.tempo}\,${KMH}`} nach="." /> Gleichzeitig startet ein Heißluftballon im Punkt <Formel tex={PK('B_0', k.ballon.start)} /> und treibt in Richtung <Formel tex={t`\vec{u}_B=${spalte(k.ballon.richtung)}`} /> mit <Formel tex={t`${k.ballon.tempo}\,${KMH}`} nach="." /> Eine Längeneinheit ist ein Kilometer. Zeige, dass die beiden zusammenstoßen, und bestimme die Zeit in Stunden und den Treffpunkt.
        </p>
        <KontrollFigur spec={aufgKollision} unter={<>Die Bahnen von Hubschrauber (schwarz) und Ballon (orange) schneiden sich im Treffpunkt <Formel tex={PK('S', k.S)} nach="," /> den beide nach 6 Minuten erreichen.</>} />
      </Aufgabe>

      <Aufgabe
        nummer={5}
        titel="Zwei Bahnen, kein Zusammenstoß"
        felder={[feldZahl('ta', 'Zeit von Objekt 1 bis S in Minuten', 't_1', z.minutenA), feldZahl('tb', 'Zeit von Objekt 2 bis S in Minuten', 't_2', z.minutenB), feldZahl('dt', 'Zeitunterschied in Sekunden', '\\Delta t', z.differenzSekunden)]}
        hilfen={[
          <>Berechne die beiden Geschwindigkeitsvektoren. Bestimme dann für jedes Objekt, zu welcher Zeit es <Formel tex="S" /> erreicht (Gleichung der ersten Koordinate).</>,
          <>Rechne die Zeiten von Stunden in Minuten um (mal 60) und bilde die Differenz in Sekunden.</>,
        ]}
        loesung={[
          <>
            Geschwindigkeitsvektoren, Objekt 1:<Z z={geschwindigkeitZeilen(z.a)} />
            Objekt 2:<Z z={geschwindigkeitZeilen(z.b)} />
          </>,
          <>
            Objekt 1 erreicht <Formel tex="S" nach=":" />
            <Z z={zeitGleichung(z.a, [...z.S], 't_1')} />
          </>,
          <>
            Objekt 2 erreicht <Formel tex="S" nach=":" />
            <Z z={zeitGleichung(z.b, [...z.S], 't_2')} />
          </>,
          <>
            Umrechnung: <Formel tex={t`t_1=0{,}1\,\text{h}=6\,\text{min}`} nach="," /> <Formel tex={t`t_2=0{,}05\,\text{h}=3\,\text{min}`} nach="." /> Der Unterschied ist <Formel tex={t`3\,\text{min}=180\,\text{s}`} nach="." /> Die Zeiten sind verschieden, es gibt keine Kollision.
          </>,
        ]}
      >
        <p>
          Zwei Objekte starten gleichzeitig. Objekt 1 startet in <Formel tex={PK('P_1', z.a.start)} /> und fliegt in Richtung <Formel tex={t`\vec{u}_1=${spalte(z.a.richtung)}`} /> mit <Formel tex={t`${z.a.tempo}\,${KMH}`} nach="," /> Objekt 2 startet in <Formel tex={PK('P_2', z.b.start)} /> und fliegt in Richtung <Formel tex={t`\vec{u}_2=${spalte(z.b.richtung)}`} /> mit <Formel tex={t`${z.b.tempo}\,${KMH}`} nach="." /> Ihre Bahnen schneiden sich im Punkt <Formel tex={PK('S', z.S)} nach="." /> Wann erreicht jedes Objekt <Formel tex="S" nach="?" /> Wie groß ist der Zeitunterschied? Kommt es zu einer Kollision?
        </p>
        <KontrollFigur spec={aufgZeiten} unter={<>Die Bahnen von Objekt 1 (schwarz) und Objekt 2 (orange) schneiden sich in <Formel tex="S" nach="," /> die Objekte erreichen <Formel tex="S" /> nach 6 und nach 3 Minuten.</>} />
      </Aufgabe>

      <Aufgabe
        nummer={6}
        titel="Der kleinste Abstand"
        felder={[feldZahl('a', 'Faktor a von t²', 'a', koeff.a), feldZahl('b', 'Faktor b von t', 'b', koeff.b), feldZahl('c', 'Zahl c', 'c', koeff.c), feldZahl('tm', 'Zeit des kleinsten Abstands in Minuten', 't_0', ab.minuten), feldZahl('d', 'kleinster Abstand in Kilometern', 'd', ab.d)]}
        hilfen={[
          <>Der Vektor vom Hubschrauber zum Ballon zur Zeit <Formel tex="t" /> ist <Formel tex={t`\vec{p}_B+t\cdot\vec{v}_B-\vec{p}_H-t\cdot\vec{v}_H`} nach="." /> Sein Betragsquadrat ist <Formel tex={t`f(t)=d(t)^2=a\,t^2+b\,t+c`} nach="." /></>,
          <>Der kleinste Abstand liegt dort, wo <Formel tex="f" /> am kleinsten ist: <Formel tex="f'(t)=0" nach="." /> Rechne die Zeit von Stunden in Minuten um und ziehe am Ende die Wurzel.</>,
        ]}
        loesung={[
          <>
            Geschwindigkeitsvektoren, Hubschrauber:<Z z={geschwindigkeitZeilen(ab.h)} />
            Ballon:<Z z={geschwindigkeitZeilen(ab.ballon)} />
          </>,
          <>
            Vektor zwischen beiden:<Z z={abstandsvektor(ab.h, ab.ballon)} />
          </>,
          <>
            Mit <Formel tex={t`\Delta\vec{p}=\vec{p}_B-\vec{p}_H`} /> und <Formel tex={t`\Delta\vec{v}=\vec{v}_B-\vec{v}_H`} /> ist <Formel tex={t`f(t)=\left|\Delta\vec{p}+t\cdot\Delta\vec{v}\right|^2=a\,t^2+b\,t+c`} /> mit <Formel tex={t`a=|\Delta\vec{v}|^2`} nach="," /> <Formel tex={t`\frac{b}{2}=\Delta\vec{p}\cdot\Delta\vec{v}`} /> und <Formel tex={t`c=|\Delta\vec{p}|^2`} nach=":" />
            <Z z={koeffizientenZeilen(ab.h, ab.ballon).a} />
            <Z z={koeffizientenZeilen(ab.h, ab.ballon).b} />
            <Z z={koeffizientenZeilen(ab.h, ab.ballon).c} />
            Also <Formel tex={t`f(t)=${polyTeX(koeff.a, koeff.b, koeff.c)}`} nach="." />
          </>,
          <>
            Minimum:<Z z={minimumZeilen(koeff.a, koeff.b, koeff.c)} />
          </>,
          <>
            <Formel tex={t`t_0=\frac{1}{15}\,\text{h}=${ab.minuten}\,\text{min}`} nach="." /> Der kleinste Abstand ist <Formel tex={t`d=\sqrt{${ab.d ** 2}}=${ab.d}`} /> Kilometer.
          </>,
        ]}
      >
        <p>
          Ein Hubschrauber startet im Punkt <Formel tex={PK('H_0', ab.h.start)} /> und fliegt in Richtung <Formel tex={t`\vec{u}_H=${spalte(ab.h.richtung)}`} /> mit <Formel tex={t`${ab.h.tempo}\,${KMH}`} nach="." /> Zur gleichen Zeit startet ein Heißluftballon im Punkt <Formel tex={PK('B_0', ab.ballon.start)} /> und treibt in Richtung <Formel tex={t`\vec{u}_B=${spalte(ab.ballon.richtung)}`} /> mit <Formel tex={t`${ab.ballon.tempo}\,${KMH}`} nach="." /> Eine Längeneinheit ist ein Kilometer. Stelle das Quadrat des Abstands <Formel tex={t`f(t)=d(t)^2=a\,t^2+b\,t+c`} /> mit der Zeit <Formel tex="t" /> in Stunden auf und bestimme, wann die beiden sich am nächsten kommen (in Minuten) und wie groß der Abstand dann ist.
        </p>
        <KontrollFigur spec={aufgAbstand} unter={<>Die Orte <Formel tex="H" /> und <Formel tex="B" /> nach 4 Minuten, die rosa Strecke <Formel tex="HB" /> ist der kleinste Abstand von {ab.d} Kilometern.</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="7"
        titel="Der Scheitel liegt vor dem Beobachtungsbeginn"
        optionen={platziere(
          [
            opt('a', <>Der kleinste Abstand für <Formel tex={t`t\ge 0`} /> ist <Formel tex={t`\sqrt{11}\,\text{km}\approx ${dez(dN0)}\,\text{km}`} nach="." /></>, true, <>Richtig. Der Scheitel von <Formel tex={t`d(t)^2`} /> liegt bei <Formel tex={t`t=${zt(ng.scheitel)}`} /> Stunden, also vor dem Beobachtungsbeginn. Für <Formel tex={t`t\ge 0`} /> wächst der Abstand nur, der kleinste Wert steht am Rand bei <Formel tex={t`t=0`} nach="." /></>),
            opt('b', <>Der kleinste Abstand ist <Formel tex={t`\sqrt{2}\,\text{km}\approx ${dez(dNS)}\,\text{km}`} nach="." /></>, false, <>Das ist der Wert am Scheitel, bei <Formel tex={t`t=${zt(ng.scheitel)}`} nach="." /> Diese Zeit liegt vor dem Beobachtungsbeginn und gehört nicht zur Bewegung (<Formel tex={t`t\ge 0`} nach=")." /></>),
            opt('c', <>Der kleinste Abstand ist 3 Kilometer, der Abstand der 1. Koordinaten bei <Formel tex={t`t=0`} nach="." /></>, false, <>Der Abstand zur Zeit 0 ist <Formel tex={t`\sqrt{3^2+1^2+1^2}=\sqrt{11}`} nach="," /> nicht nur der Unterschied der 1. Koordinaten.</>),
            opt('d', <>Der kleinste Abstand ist 0, weil sich beide in dieselbe Richtung bewegen.</>, false, <>Die Bahnen sind parallel und haben den Abstand <Formel tex={t`\sqrt{2}`} nach="." /> Auch zur selben Zeit fallen die Orte nie zusammen.</>),
          ],
          2,
        )}
        erklaerung={<>Die Abstandsfunktion gilt nur für <Formel tex={t`t\ge 0`} nach="." /> Liegt der Scheitel bei negativem <Formel tex="t" nach="," /> ist der Abstand für <Formel tex={t`t\ge 0`} /> streng monoton wachsend, der kleinste Wert steht am Rand <Formel tex={t`t=0`} nach="." /></>}
      >
        <p>
          Ein Ballon startet im Punkt <Formel tex={PK('B_0', ng.b1.start)} /> und fliegt in Richtung <Formel tex={t`${spalte(ng.b1.richtung)}`} /> mit <Formel tex={t`${ng.b1.tempo}\,${KMH}`} nach="." /> Ein Hubschrauber startet im Punkt <Formel tex={PK('H_0', ng.b2.start)} /> und fliegt in dieselbe Richtung mit <Formel tex={t`${ng.b2.tempo}\,${KMH}`} nach="." /> Für den Abstand gilt <Formel tex={t`d(t)^2=(3+20t)^2+2`} nach="." /> Was ist der kleinste Abstand für <Formel tex={t`t\ge 0`} nach="?" />
        </p>
      </Auswahlfrage>

      <h3>Teil Schatten</h3>

      <Aufgabe
        nummer={8}
        titel="Schatten bei Sonnenlicht"
        felder={pa.schatten.flatMap((s, i) => [feldZahl(`x${i}`, `1. Koordinate von ${zNamen[i]}'`, `${zNamen[i]}'_1`, s[0]!), feldZahl(`z${i}`, `3. Koordinate von ${zNamen[i]}'`, `${zNamen[i]}'_3`, s[2]!)])}
        hilfen={[
          <>Der Lichtstrahl durch eine Ecke <Formel tex="X" /> ist <Formel tex={t`g:\ \vec{x}=\vec{x}_X+t\cdot\vec{v}`} nach="." /> Der Schattenpunkt liegt auf der Wand <Formel tex="x_2=0" nach="." /> Setze die 2. Koordinate gleich 0 und löse nach <Formel tex="t" nach="." /></>,
          <>Setze <Formel tex="t" /> in die 1. und 3. Koordinate ein. Prüfe, dass <Formel tex="t" /> nicht negativ ist.</>,
        ]}
        loesung={pa.ecken.map((e, i) => (
          <>
            Ecke <Formel tex={PK(zNamen[i]!, e)} nach=":" />
            <Z z={parallelZeilen(e, pa.v, `${zNamen[i]}'`)} />
          </>
        ))}
      >
        <p>
          Eine dreieckige Platte hat die Ecken <Formel tex={PK('P', pa.ecken[0]!)} nach="," /> <Formel tex={PK('Q', pa.ecken[1]!)} /> und <Formel tex={PK('R', pa.ecken[2]!)} nach="." /> Sie steht vor der Wand <Formel tex="x_2=0" nach="," /> eine Längeneinheit ist ein Meter. Die tiefstehende Sonne scheint in Richtung <Formel tex={t`\vec{v}=${spalte(pa.v)}`} nach="." /> Bestimme die Schattenpunkte <Formel tex="P'" nach="," /> <Formel tex="Q'" /> und <Formel tex="R'" /> auf der Wand. Die 2. Koordinate ist 0, gib jeweils die 1. und die 3. Koordinate an.
        </p>
        <KontrollFigur spec={aufgParallel} unter={<>Die Platte (schwarz), die Sonnenstrahlen (orange) und der Schatten auf der Wand (rosa). Für <Formel tex="P" /> ist <Formel tex={t`t=${sP.parameter}`} nach="." /></>} />
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Schatten bei einer Lampe"
        felder={ze.ecken.flatMap((e, i) => [feldZahl(`x${i}`, `1. Koordinate von ${zNamen[i]}''`, `${zNamen[i]}''_1`, zS[i]!.punkt![0]!, 0.01), feldZahl(`z${i}`, `3. Koordinate von ${zNamen[i]}''`, `${zNamen[i]}''_3`, zS[i]!.punkt![2]!, 0.01)])}
        hilfen={[
          <>Der Strahl von der Lampe <Formel tex="L" /> durch die Ecke <Formel tex="X" /> ist <Formel tex={t`g:\ \vec{x}=\vec{l}+s\cdot\overrightarrow{LX}`} nach="." /> Setze die 2. Koordinate gleich 0.</>,
          <>Der Wert von <Formel tex="s" /> muss größer als 1 sein (ab <Formel tex="s=1" /> ist man im Punkt <Formel tex="X" nach=")," /> sonst gibt es keinen Schatten. Die Brüche darfst du als Bruch oder Dezimalzahl auf zwei Stellen eingeben.</>,
        ]}
        loesung={ze.ecken.map((e, i) => (
          <>
            Ecke <Formel tex={PK(zNamen[i]!, e)} nach=":" /> mit <Formel tex={lxZeile(ze.L, e, zNamen[i]!)} nach="." />
            <Z z={zentralZeilen(e, ze.L, `${zNamen[i]}''`)} />
          </>
        ))}
      >
        <p>
          Dieselbe Platte mit den Ecken <Formel tex={PK('P', ze.ecken[0]!)} nach="," /> <Formel tex={PK('Q', ze.ecken[1]!)} /> und <Formel tex={PK('R', ze.ecken[2]!)} /> wird abends von einer Lampe im Punkt <Formel tex={PK('L', ze.L)} /> angestrahlt. Bestimme die Schattenpunkte <Formel tex="P''" nach="," /> <Formel tex="Q''" /> und <Formel tex="R''" /> auf der Wand <Formel tex="x_2=0" nach="." /> Gib jeweils die 1. und die 3. Koordinate an.
        </p>
        <KontrollFigur spec={aufgZentral} unter={<>Die Platte (schwarz), die Strahlen von der Lampe <Formel tex="L" /> (orange) und der Schatten auf der Wand (rosa). Der Schatten ist größer als der bei Sonnenlicht.</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="10"
        titel="Wann liegt ein Schattenpunkt vor?"
        optionen={platziere(
          [
            opt('a', <>Der Schnittpunkt gehört zu <Formel tex={t`s=\frac{3}{2}`} nach="." /> Das ist größer als 1, er liegt hinter <Formel tex="X" nach="," /> also ist es der Schattenpunkt.</>, true, <>Richtig. Bei <Formel tex="s=1" /> ist man in <Formel tex="X" nach="," /> bei <Formel tex={t`s=\frac{3}{2}`} /> weiter von der Lampe entfernt, in der Wand. Der Schattenpunkt ist <Formel tex={punktTeX("X''", sAuswahl.punkt!).replace('1.5', '1{,}5').replace('3.5', '3{,}5')} nach="." /></>),
            opt('b', <>Der Schnittpunkt gehört zu <Formel tex={t`s=\frac{3}{2}`} nach="." /> Das ist größer als 1, also liegt die Wand zwischen <Formel tex="L" /> und <Formel tex="X" /> und es gibt keinen Schatten.</>, false, <>Das ist verdreht. Bei <Formel tex={t`s>1`} /> liegt der Schnittpunkt <em>hinter</em> <Formel tex="X" nach="." /> Kein Schatten entsteht bei <Formel tex={t`s<1`} nach="," /> wenn die Wand vor <Formel tex="X" /> liegt.</>),
            opt('c', <>Ein Schattenpunkt gehört zu einem Wert <Formel tex={t`0<s<1`} /> auf dem Strahl.</>, false, <>Für <Formel tex={t`0<s<1`} /> liegt der Punkt auf dem Strahl zwischen <Formel tex="L" /> und <Formel tex="X" nach="." /> Der Schatten liegt dahinter, bei <Formel tex={t`s\ge 1`} nach="." /></>),
            opt('d', <>Der Schattenpunkt gehört zu <Formel tex="s=1" nach="." /></>, false, <>Bei <Formel tex="s=1" /> ist man im Punkt <Formel tex="X" /> selbst, der Schattenpunkt ist es nur, wenn <Formel tex="X" /> schon auf der Wand liegt.</>),
          ],
          3,
        )}
        erklaerung={<>Auf dem Strahl <Formel tex={t`\vec{x}=\vec{l}+s\cdot\overrightarrow{LX}`} /> gehört <Formel tex="s=1" /> zu <Formel tex="X" nach="." /> Ein Schattenpunkt auf der Wand liegt hinter <Formel tex="X" nach="," /> es muss also <Formel tex={t`s\ge 1`} /> gelten.</>}
      >
        <p>
          Eine Lampe steht in <Formel tex={PK('L', pr.L)} nach="." /> Der Punkt <Formel tex={PK('X', pr.X)} /> eines Gegenstands wirft einen Schatten auf die Wand <Formel tex="x_2=0" nach="." /> Der Strahl <Formel tex={t`\vec{x}=\vec{l}+s\cdot\overrightarrow{LX}`} /> trifft die Wand bei <Formel tex={t`s=\frac{3}{2}`} nach="." /> Welche Aussage stimmt?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={11}
        titel="Der Schatten eines Tetraeders"
        felder={[feldZahl('za', 'Höhe des Wandpunkts zu A', 'z_A', te.hoehen[0]!), feldZahl('zb', 'Höhe des Wandpunkts zu B', 'z_B', te.hoehen[1]!), feldZahl('zc', 'Höhe des Wandpunkts zu C', 'z_C', te.hoehen[2]!), feldZahl('zs', 'Höhe des Wandpunkts zu S', 'z_S', te.hoehen[3]!)]}
        hilfen={[
          <>Der Lichtstrahl durch eine Ecke <Formel tex="X" /> ist <Formel tex={t`\vec{x}=\vec{x}_X+t\cdot\vec{w}`} nach="." /> Er erreicht die Ebene <Formel tex="x_2=0" /> bei <Formel tex={t`t=x_2`} nach="." /> Setze dieses <Formel tex="t" /> in die 3. Koordinate ein und vereinfache zu <Formel tex={t`z=x_3-2\,x_2`} nach="." /></>,
          <>Die Wand gibt es nur für <Formel tex={t`x_3\ge 0`} nach="." /> Ist <Formel tex="z" /> negativ, liegt der rechnerische Wandpunkt unter dem Boden, der Strahl trifft vorher den Boden.</>,
        ]}
        loesung={[
          <>
            Strahl durch <Formel tex="X" nach=":" /><Eq tex={t`\vec{x}=\vec{x}_X+t\cdot ${spalte(te.w)}`} />
            Wand <Formel tex="x_2=0" nach=":" /><Z z={{ tex: t`x_2-t=0\ \Rightarrow\ t=x_2`, schmal: t`\begin{gathered}x_2-t=0\\t=x_2\end{gathered}` }} />
            Höhe des Wandpunkts:<Z z={{ tex: t`z=x_3-2\,t=x_3-2\,x_2`, schmal: t`\begin{gathered}z\\{}=x_3-2t\\{}=x_3-2x_2\end{gathered}` }} />
          </>,
          <>
            A, B und C liegen auf dem Boden, <Formel tex={t`x_3=0`} nach=":" />
            <Z z={gleichungZeilen3('z_A', `0-2\\cdot ${te.A[1]}`, te.hoehen[0]!)} />
            <Z z={gleichungZeilen3('z_B', `0-2\\cdot ${te.B[1]}`, te.hoehen[1]!)} />
            <Z z={gleichungZeilen3('z_C', `0-2\\cdot ${te.C[1]}`, te.hoehen[2]!)} />
          </>,
          <>
            Für die Spitze:<Z z={gleichungZeilen3('z_S', `${te.S[2]}-2\\cdot ${te.S[1]}`, te.hoehen[3]!)} />
            Nur <Formel tex="z_S" /> ist nicht negativ. Der Strahl durch <Formel tex="S" /> trifft die Wand für <Formel tex={t`t=${te.S[1]}`} nach=":" />
            <Z z={ortZeilen(te.S, te.S[1], te.w, "S'", String(te.S[1]))} />
          </>,
          <>
            A, B und C liegen auf dem Boden: Ihr Schatten ist der Punkt selbst. Der Schatten des Tetraeders liegt zum Teil auf dem Boden und nur die Spitze wirft einen Schattenpunkt auf die Wand, der Rest der Wand bleibt hell.
          </>,
        ]}
      >
        <p>
          Ein Tetraeder mit den Ecken <Formel tex={PK('A', te.A)} nach="," /> <Formel tex={PK('B', te.B)} nach="," /> <Formel tex={PK('C', te.C)} /> und der Spitze <Formel tex={PK('S', te.S)} /> steht auf dem Boden <Formel tex="x_3=0" nach="." /> Die Wand ist der Teil der Ebene <Formel tex="x_2=0" /> mit <Formel tex={t`x_3\ge 0`} nach="." /> Das Licht kommt in Richtung <Formel tex={t`\vec{w}=${spalte(te.w)}`} nach="." /> Eine Längeneinheit ist ein Meter. Bestimme für jede Ecke die Höhe <Formel tex="z" /> des Punkts, in dem der Lichtstrahl die Ebene <Formel tex="x_2=0" /> rechnerisch trifft. Welche Ecken werfen einen Schatten auf die Wand?
        </p>
        <KontrollFigur spec={aufgTetraeder} unter={<>Das Tetraeder auf dem Boden (blau) vor der Wand (grün). Nur der Strahl durch die Spitze <Formel tex="S" /> (orange) trifft die Wand, in <Formel tex={PK("S'", te.S1)} nach="." /></>} />
      </Aufgabe>

      <Zeichenaufgabe
        nummer="12"
        titel="Der Schatten eines Masts"
        hilfe={
          <>
            <p>
              Der Lichtstrahl durch die Spitze <Formel tex="T" /> ist <Formel tex={t`\vec{x}=${spalte(ma.T)}+t\cdot ${spalte(ma.w)}`} nach="." /> Der Boden ist die Ebene <Formel tex="x_3=0" nach="." />
            </p>
            <Z z={parallelZeilen(ma.T, ma.w, "T'", 2)} />
            <p>
              Der Schatten des Masts ist die Strecke von <Formel tex={PK('F', ma.F)} /> bis <Formel tex={PK("T'", ma.T0)} nach="." /> Trage den Mast, den Lichtstrahl durch <Formel tex="T" /> und den Schatten im Schrägbild ein. Der Schatten ist <Formel tex={t`\sqrt{8}\approx 2{,}83`} /> Meter lang.
            </p>
          </>
        }
        kontrolle={<KontrollFigur spec={aufgMast} unter={<>Der Mast (schwarz), der Lichtstrahl durch <Formel tex="T" /> (orange) und der Schatten auf dem Boden (rosa) mit <Formel tex={PK("T'", ma.T0)} nach="." /></>} />}
      >
        <p>
          Ein Fahnenmast steht im Fußpunkt <Formel tex={PK('F', ma.F)} nach="." /> Seine Spitze ist <Formel tex={PK('T', ma.T)} nach="." /> Das Licht kommt in Richtung <Formel tex={t`\vec{w}=${spalte(ma.w)}`} nach="." /> Eine Längeneinheit ist ein Meter, der Boden ist die <Formel tex="x_1x_2" />-Ebene. Berechne den Schattenpunkt <Formel tex="T'" /> der Spitze und zeichne den Mast und seinen Schatten in ein Schrägbild (2 Kästchen je Einheit auf der <Formel tex="x_2" />- und der <Formel tex="x_3" />-Achse, eine Kästchendiagonale auf der <Formel tex="x_1" />-Achse). Prüfe danach mit dem Kontrollschaubild.
        </p>
      </Zeichenaufgabe>
    </Abschnitt>
  );
}
