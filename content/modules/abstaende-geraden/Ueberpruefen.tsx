import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { geradenpunkt, lot, type Gerade } from '@/lib/gerade';
import { bruch, punktTeX } from '@/lib/geradenhilfen';
import { klammer, spalte } from '@/lib/laborhilfen';
import { opt, platziere, t, zt } from '@/lib/modulhilfen';
import { betrag, faktor, skalarprodukt, vektorprodukt, verbindungsvektor } from '@/lib/vektor';
import { aufgParallel, aufgWeg1, aufgZeichnen } from './Bilder';
import { A_AUF, A_BALLON, A_IDENTISCH, A_KABEL, A_PARALLEL1, A_PARALLEL2, A_PARAMETER, A_STUETZ, A_WEG1, A_WEG2, A_WEG3, A_ZEICHNEN } from './daten';
import { fqZeilen, gl, glSchmal, kreuzFormel, laufenderPunktSpalte, lotfussRechnung, rund2, rundN, vielfachFormel, weg1Zeilen, weg2Zeilen, weg3Zeilen, wurzelTeX, xqSpalte, zeilenFormel } from './rechenhilfen';
import { abstandsfunktion } from '@/lib/gerade';

const sp = (v: number[]) => spalte(v);
const Z = ({ z }: { z: { tex: string; schmal: string } }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;
const G = ({ g, name = 'g', par = 't' }: { g: Gerade; name?: string; par?: string }) => <Umbruchformel tex={gl(g, name, par)} schmal={glSchmal(g, name, par)} />;
const PK = (name: string, p: number[]) => punktTeX(name, p);
const feldZahl = (id: string, name: string, beschriftung: string, erwartet: number, toleranz?: number): Feld => ({ id, name, beschriftung: <Formel tex={beschriftung} />, erwartet, ...(toleranz ? { toleranz } : {}) });
const dez = (x: number) => zt(Math.round(x * 100) / 100);
const PQ = '\\overrightarrow{PQ}';
/** Lotfußpunkt als Rechnung in kurzen Zeilen (drei Zeilen und der Punkt). */
const FRechnung = ({ g, par, F }: { g: Gerade; par: number; F: number[] }) => <Formel anzeige tex={lotfussRechnung(g, par, F)} />;

export function Ueberpruefen() {
  const w1 = A_WEG1;
  const l1 = lot(w1.g, w1.Q);
  const w3 = A_WEG3;
  const w2 = A_WEG2;
  const st = A_STUETZ;
  const ls = lot(st.g, st.Q);
  const auf = A_AUF;
  const p1 = A_PARALLEL1;
  const lp1 = lot(p1.g, p1.h.p);
  const p2 = A_PARALLEL2;
  const lp2 = lot(p2.g, p2.h.p);
  const id = A_IDENTISCH;
  const pa = A_PARAMETER;
  const ba = A_BALLON;
  const ka = A_KABEL;
  const ze = A_ZEICHNEN;
  const lz = lot(ze.g, ze.Q);
  const k1 = faktor(p1.g.u, p1.h.u)!;
  const k2 = faktor(p2.g.u, p2.h.u)!;
  const abf = abstandsfunktion(w2.g, w2.Q);
  const stuetz = Math.round(betrag(verbindungsvektor(st.g.p, st.Q)) ** 2);
  const dX3 = Math.round(betrag(verbindungsvektor(geradenpunkt(st.g, st.t3), st.Q)) ** 2);
  const ballon = weg3Zeilen(ba.g, ba.Q, 3);
  const dLE = Math.sqrt(ballon.d2);
  const kabel = weg3Zeilen(ka.g, ka.h.p);
  const idStuetz = Math.round(betrag(verbindungsvektor(id.g.p, id.h.p)) ** 2);
  const nah = auf.daneben.map((x) => lot(auf.g, x));
  const aFq = [pa.a - pa.F[0]!, 3 - pa.F[1]!, 1 - pa.F[2]!];
  const uPa = pa.g.u;

  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten. Die drei Wege stehen im Abschnitt „Drei Wege“, das Vektorprodukt im Modul <Modulverweis modul="vektorprodukt">Das Vektorprodukt</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma und auf zwei Nachkommastellen gerundet.</Hinweis>

      <Auswahlfrage
        nummer="1"
        titel="Was ist der Abstand Punkt und Gerade?"
        optionen={platziere(
          [
            opt('a', <>Die Länge der kürzesten Strecke von <Formel tex="Q" /> zu einem Punkt von <Formel tex="g" nach="." /></>, true, <>Richtig. Der Abstand ist die kürzeste Entfernung zu den Punkten von <Formel tex="g" nach="." /> Diese Strecke ist das Lot, ihr Fußpunkt <Formel tex="F" /> ist der Lotfußpunkt.</>),
            opt('b', <>Der Abstand von <Formel tex="Q" /> zum Stützpunkt <Formel tex="P" /> von <Formel tex="g" nach="." /></>, false, <>Der Stützpunkt ist nur ein Punkt von <Formel tex="g" nach="." /> Sein Abstand zu <Formel tex="Q" /> ist im Allgemeinen größer als der Abstand zur Geraden, es gibt Punkte von <Formel tex="g" nach="," /> die näher an <Formel tex="Q" /> liegen.</>),
            opt('c', <>Der Abstand von <Formel tex="Q" /> zu einem beliebigen Punkt von <Formel tex="g" nach="," /> zum Beispiel für <Formel tex="t=1" nach="." /></>, false, <>Jeder Punkt von <Formel tex="g" /> liefert einen anderen Abstand. Der Abstand zur Geraden ist der kleinste dieser Werte, nicht irgendeiner.</>),
            opt('d', <>Der Betrag des Richtungsvektors <Formel tex={t`|\vec{u}|`} nach="." /></>, false, <>Der Betrag von <Formel tex={t`\vec{u}`} /> ist die Länge des Richtungsvektors und hängt nicht von <Formel tex="Q" /> ab. Der Abstand ändert sich aber, wenn du <Formel tex="Q" /> verschiebst.</>),
          ],
          2,
        )}
        erklaerung={<>Der Abstand eines Punkts von einer Geraden ist die kürzeste Entfernung zu den Punkten der Geraden. Sie ist die Länge des Lots.</>}
      >
        <p>
          Gegeben sind eine Gerade <Formel tex="g" /> und ein Punkt <Formel tex="Q" /> außerhalb von <Formel tex="g" nach="." /> Was ist der Abstand von <Formel tex="Q" /> zur Geraden <Formel tex="g" nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={2}
        titel="Der Lotfußpunkt mit dem Skalarprodukt"
        felder={[
          feldZahl('t', 'Parameter t des Lotfußpunkts', 't_0', w1.t),
          feldZahl('f1', '1. Koordinate von F', 'F:\\ x_1', w1.F[0]),
          feldZahl('f2', '2. Koordinate von F', 'F:\\ x_2', w1.F[1]),
          feldZahl('f3', '3. Koordinate von F', 'F:\\ x_3', w1.F[2]),
          feldZahl('d2', 'Quadrat des Abstands', 'd^2', w1.d2),
        ]}
        hilfen={[
          <>Stelle den laufenden Punkt <Formel tex={t`X(t)`} /> und den Vektor <Formel tex={t`\overrightarrow{XQ}`} /> auf. Beim Lotfußpunkt ist <Formel tex={t`\overrightarrow{XQ}\cdot\vec{u}=0`} nach="." /></>,
          <>Löse die Gleichung nach <Formel tex="t" nach="," /> setze <Formel tex="t" /> in <Formel tex="g" /> ein und berechne <Formel tex={t`d^2=|\overrightarrow{FQ}|^2`} nach="." /></>,
        ]}
        loesung={[
          <>
            Laufender Punkt und Vektor:
            <Umbruchformel tex={t`\overrightarrow{XQ}=${xqSpalte(w1.g, w1.Q)}`} schmal={t`\begin{gathered}\overrightarrow{XQ}\\{}=${xqSpalte(w1.g, w1.Q)}\end{gathered}`} />
          </>,
          <>
            Skalarprodukt gleich 0:
            <Z z={weg1Zeilen(w1.g, w1.Q).skalar} />
            <Z z={weg1Zeilen(w1.g, w1.Q).gleichung} />
          </>,
          <>
            Lotfußpunkt:
            <FRechnung g={w1.g} par={l1.t} F={l1.F} />
          </>,
          <>
            Abstand:
            <Z z={fqZeilen(w1.g, w1.Q)} />
          </>,
        ]}
      >
        <p>Gegeben sind</p>
        <G g={w1.g} />
        <p>
          und der Punkt <Formel tex={PK('Q', w1.Q)} nach="." /> Bestimme den Parameter <Formel tex={t`t_0`} /> und die Koordinaten des Lotfußpunkts <Formel tex="F" /> mit der Bedingung <Formel tex={t`\overrightarrow{XQ}\cdot\vec{u}=0`} nach="." /> Gib außerdem das Quadrat des Abstands <Formel tex={t`d^2`} /> an.
        </p>
        <KontrollFigur spec={aufgWeg1} unter={<>Die Gerade <Formel tex="g" nach="," /> der Punkt <Formel tex="Q" /> und das Lot <Formel tex="FQ" /> mit <Formel tex={PK('F', w1.F)} nach="." /></>} />
      </Aufgabe>

      <Aufgabe
        nummer={3}
        titel="Der Abstand mit dem Vektorprodukt"
        felder={[
          feldZahl('k1', '1. Koordinate von u × PQ', 'x_1', w3.kreuz[0]!),
          feldZahl('k2', '2. Koordinate von u × PQ', 'x_2', w3.kreuz[1]!),
          feldZahl('k3', '3. Koordinate von u × PQ', 'x_3', w3.kreuz[2]!),
          feldZahl('d', 'Abstand d auf zwei Nachkommastellen', 'd', w3.d, 0.01),
        ]}
        hilfen={[
          <>Der Stützpunkt <Formel tex="P" /> hat den Ortsvektor <Formel tex={t`${sp(w3.g.p)}`} nach="." /> Berechne <Formel tex={t`\overrightarrow{PQ}=\vec{q}-\vec{p}`} /> und dann das Vektorprodukt <Formel tex={t`\vec{u}\times\overrightarrow{PQ}`} nach="." /></>,
          <>Der Abstand ist <Formel tex={t`d=\frac{|\vec{u}\times\overrightarrow{PQ}|}{|\vec{u}|}`} nach="." /> Rechne mit dem Taschenrechner auf zwei Nachkommastellen.</>,
        ]}
        loesung={[
          <>
            Verbindungsvektor:
            <Umbruchformel tex={t`${PQ}=${sp(verbindungsvektor(w3.g.p, w3.Q))}`} schmal={t`\begin{gathered}${PQ}\\{}=${sp(verbindungsvektor(w3.g.p, w3.Q))}\end{gathered}`} />
          </>,
          <>
            Vektorprodukt:
            <Z z={kreuzFormel(w3.g, w3.Q)} />
            <Z z={weg3Zeilen(w3.g, w3.Q).kreuz} />
          </>,
          <>
            Abstand:
            <Z z={weg3Zeilen(w3.g, w3.Q).abstand} />
          </>,
        ]}
      >
        <p>Gegeben sind</p>
        <G g={w3.g} />
        <p>
          und der Punkt <Formel tex={PK('Q', w3.Q)} nach="." /> Berechne den Abstand von <Formel tex="Q" /> zu <Formel tex="g" /> mit der Formel. Gib die drei Koordinaten von <Formel tex={t`\vec{u}\times\overrightarrow{PQ}`} /> und den Abstand an.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={4}
        titel="Den Abstand minimieren"
        felder={[
          feldZahl('a', 'Faktor a von t²', 'a', abf.a),
          feldZahl('b', 'Faktor b von t', 'b', abf.b),
          feldZahl('c', 'Zahl c', 'c', abf.c),
          feldZahl('t', 'Stelle t des kleinsten Werts', 't_0', w2.t),
          feldZahl('d', 'Abstand d', 'd', w2.d),
        ]}
        hilfen={[
          <>Der Vektor <Formel tex={t`\overrightarrow{XQ}`} /> hat drei Koordinaten mit <Formel tex="t" nach="." /> Quadriere sie und addiere. Du erhältst <Formel tex={t`D(t)=a\,t^2+b\,t+c`} nach="." /></>,
          <>Der kleinste Wert von <Formel tex="D" /> liegt dort, wo <Formel tex="D'(t)=0" /> ist. Der Abstand ist die Wurzel aus dem kleinsten Wert.</>,
        ]}
        loesung={[
          <>
            Quadrat des Abstands:
            <Z z={weg2Zeilen(w2.g, w2.Q).aufstellen} />
            <Z z={weg2Zeilen(w2.g, w2.Q).minimum} />
          </>,
          <>
            Der kleinste Wert von <Formel tex="D" /> ist <Formel tex={t`${w2.d * w2.d}`} nach="." /> Damit ist <Formel tex={t`d=${wurzelTeX(w2.d * w2.d)}=${w2.d}`} nach="." />
          </>,
        ]}
      >
        <p>Gegeben sind</p>
        <G g={w2.g} />
        <p>
          und der Punkt <Formel tex={PK('Q', w2.Q)} nach="." /> Stelle <Formel tex={t`D(t)=|\overrightarrow{XQ}|^2`} /> in der Form <Formel tex={t`a\,t^2+b\,t+c`} /> auf, bestimme die Stelle <Formel tex={t`t_0`} /> des kleinsten Werts und den Abstand <Formel tex="d" nach="." />
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="5"
        titel="Welcher Wert ist der Abstand?"
        optionen={platziere(
          [
            opt('a', <>Der Abstand ist <Formel tex={t`${wurzelTeX(ls.d2)}\approx ${rund2(ls.d)}`} nach="." /></>, true, <>Richtig. Der Lotfußpunkt liegt bei <Formel tex={t`t_0=${ls.t}`} nach="." /> <Formel tex={t`\overrightarrow{FQ}`} /> steht senkrecht auf <Formel tex={t`\vec{u}`} nach="," /> der Abstand ist <Formel tex={t`|\overrightarrow{FQ}|=${wurzelTeX(ls.d2)}`} nach="." /></>),
            opt('b', <>Der Abstand ist <Formel tex={t`${wurzelTeX(stuetz)}\approx ${rund2(Math.sqrt(stuetz))}`} nach="." /></>, false, <>Das ist der Abstand von <Formel tex="Q" /> zum Stützpunkt <Formel tex="P" nach="." /> Der Stützpunkt ist nur ein Punkt von <Formel tex="g" nach="," /> ein anderer Punkt liegt näher an <Formel tex="Q" nach="." /></>),
            opt('c', <>Der Abstand ist <Formel tex={t`${wurzelTeX(dX3)}\approx ${rund2(Math.sqrt(dX3))}`} nach="." /></>, false, <>Das ist der Abstand von <Formel tex="Q" /> zu dem Punkt <Formel tex={t`g(${st.t3})`} nach="." /> Der Abstand zur Geraden ist der kleinste Abstand zu allen Punkten von <Formel tex="g" nach="," /> nicht der zu einem frei gewählten Punkt.</>),
            opt('d', <>Der Abstand ist <Formel tex={t`${rund2(betrag(st.g.u))}`} nach="." /></>, false, <>Das ist der Betrag <Formel tex={t`|\vec{u}|`} /> des Richtungsvektors. Er sagt nichts darüber aus, wo <Formel tex="Q" /> liegt.</>),
          ],
          0,
        )}
        erklaerung={<>Der Abstand wird nur vom Lotfußpunkt bestimmt: Der Vektor <Formel tex={t`\overrightarrow{FQ}`} /> steht senkrecht auf <Formel tex={t`\vec{u}`} nach="." /> Jeder andere Punkt von <Formel tex="g" /> ist weiter von <Formel tex="Q" /> entfernt.</>}
      >
        <p>Gegeben sind</p>
        <G g={st.g} />
        <p>
          und <Formel tex={PK('Q', st.Q)} nach="." /> Eine Schülerin findet vier Zahlen. Welche ist der Abstand von <Formel tex="Q" /> zu <Formel tex="g" nach="?" />
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="6"
        titel="Welcher Punkt hat den Abstand 0?"
        optionen={platziere(
          [
            opt('a', <Formel tex={PK('', auf.auf)} />, true, <>Richtig. Für <Formel tex="t=2" /> ergibt die Gleichung genau diesen Punkt, <Formel tex={t`${sp(geradenpunkt(auf.g, 2))}`} nach="." /> Er liegt auf <Formel tex="g" nach="," /> sein Abstand zur Geraden ist 0.</>),
            ...auf.daneben.map((x, i) => opt(`b${i}`, <Formel tex={PK('', x)} />, false, <>Dieser Punkt liegt nicht auf <Formel tex="g" nach="." /> Sein Lotfußpunkt ist <Formel tex={PK('F', nah[i]!.F)} /> und der Abstand ist <Formel tex={t`d\approx ${rund2(nah[i]!.d)}`} nach="," /> nicht 0.</>)),
          ],
          3,
        )}
        erklaerung={<>Der Abstand ist 0 genau für die Punkte der Geraden. Du erkennst sie an der Punktprobe: Ein Wert <Formel tex="t" /> muss alle drei Koordinaten erfüllen (siehe <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>).</>}
      >
        <p>Gegeben ist</p>
        <G g={auf.g} />
        <p>Für welchen der Punkte ist der Abstand zu <Formel tex="g" /> gleich 0?</p>
      </Auswahlfrage>

      <Aufgabe
        nummer={7}
        titel="Abstand paralleler Geraden"
        felder={[feldZahl('k', 'Faktor k mit v = k mal u', 'k', k1), feldZahl('t', 'Parameter t des Lotfußpunkts', 't_0', lp1.t), feldZahl('d2', 'Quadrat des Abstands', 'd^2', lp1.d2)]}
        hilfen={[
          <>Prüfe zuerst, ob die Richtungsvektoren Vielfache sind: <Formel tex={t`\vec{v}=k\cdot\vec{u}`} nach="." /> Dann sind die Geraden parallel oder identisch.</>,
          <>Wähle den Stützpunkt <Formel tex="Q" /> von <Formel tex="h" /> und berechne seinen Abstand zu <Formel tex="g" /> mit dem Lotfußpunkt.</>,
        ]}
        loesung={[
          <>
            Richtungsvektoren, <Formel tex={t`\vec{v}=k\cdot\vec{u}`} nach=":" />
            <Z z={vielfachFormel(p1.h.u, p1.g.u, k1)} />
            Die Geraden sind parallel. <Formel tex={PK('Q', p1.h.p)} /> liegt nicht auf <Formel tex="g" nach="," /> denn der Abstand ist größer als 0.
          </>,
          <>
            Lotfußpunkt von <Formel tex="Q" /> auf <Formel tex="g" nach=":" />
            <Z z={weg1Zeilen(p1.g, p1.h.p).skalar} />
            <Z z={weg1Zeilen(p1.g, p1.h.p).gleichung} />
          </>,
          <>
            Abstand:
            <FRechnung g={p1.g} par={lp1.t} F={lp1.F} />
            <Z z={fqZeilen(p1.g, p1.h.p)} />
          </>,
        ]}
      >
        <p>Gegeben sind</p>
        <G g={p1.g} />
        <G g={p1.h} name="h" par="s" />
        <p>
          Zeige, dass <Formel tex="g" /> und <Formel tex="h" /> parallel sind, und berechne den Abstand der Geraden. Gib den Faktor <Formel tex="k" nach="," /> den Parameter <Formel tex={t`t_0`} /> des Lotfußpunkts und das Quadrat des Abstands an.
        </p>
        <KontrollFigur spec={aufgParallel} unter={<>Die parallelen Geraden <Formel tex="g" /> und <Formel tex="h" /> mit dem Lot <Formel tex="FQ" nach="." /></>} />
      </Aufgabe>

      <Aufgabe
        nummer={8}
        titel="Parallele Geraden mit positivem Vielfachen"
        felder={[feldZahl('t', 'Parameter t des Lotfußpunkts', 't_0', lp2.t), feldZahl('d', 'Abstand d', 'd', p2.d)]}
        hilfen={[
          <>Der Stützpunkt von <Formel tex="h" /> ist <Formel tex={PK('Q', p2.h.p)} nach="." /> Berechne seinen Lotfußpunkt auf <Formel tex="g" nach="." /></>,
          <>Die Bedingung <Formel tex={t`\overrightarrow{XQ}\cdot\vec{u}=0`} /> liefert <Formel tex="t_0" nach="." /> Der Abstand ist die Länge von <Formel tex={t`\overrightarrow{FQ}`} nach="." /></>,
        ]}
        loesung={[
          <>
            Es ist <Formel tex={t`\vec{v}=${k2}\cdot\vec{u}`} nach="," /> die Geraden sind parallel.
            <Z z={weg1Zeilen(p2.g, p2.h.p).skalar} />
            <Z z={weg1Zeilen(p2.g, p2.h.p).gleichung} />
          </>,
          <>
            Abstand:
            <FRechnung g={p2.g} par={lp2.t} F={lp2.F} />
            <Z z={fqZeilen(p2.g, p2.h.p)} />
          </>,
        ]}
      >
        <p>Gegeben sind die parallelen Geraden</p>
        <G g={p2.g} />
        <G g={p2.h} name="h" par="s" />
        <p>
          Berechne den Abstand von <Formel tex="g" /> und <Formel tex="h" nach="." /> Gib den Parameter <Formel tex={t`t_0`} /> des Lotfußpunkts von <Formel tex="Q" /> und den Abstand <Formel tex="d" /> an.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="9"
        titel="Abstand von Geraden mit demselben Punkt"
        optionen={platziere(
          [
            opt('a', <>Der Abstand ist 0, die Geraden sind identisch.</>, true, <>Richtig. Die Richtungsvektoren sind Vielfache (<Formel tex={t`\vec{v}=3\cdot\vec{u}`} nach=")" /> und der Stützpunkt <Formel tex={PK('Q', id.h.p)} /> liegt auf <Formel tex="g" nach="," /> denn <Formel tex={t`${sp(geradenpunkt(id.g, 2))}`} /> ist <Formel tex="g(2)" nach="." /> Identische Geraden haben den Abstand 0.</>),
            opt('b', <>Der Abstand ist <Formel tex={t`${wurzelTeX(idStuetz)}\approx ${rund2(Math.sqrt(idStuetz))}`} nach="," /> der Abstand der Stützpunkte.</>, false, <>Der Abstand der Stützpunkte ist hier zwar <Formel tex={t`${wurzelTeX(idStuetz)}`} nach="," /> aber er ist nicht der Abstand der Geraden. <Formel tex="Q" /> liegt auf <Formel tex="g" nach="," /> es gibt Punkte beider Geraden, die zusammenfallen.</>),
            opt('c', <>Es gibt keinen Abstand, weil die Geraden nicht parallel sind.</>, false, <>Die Richtungsvektoren sind Vielfache, die Geraden sind also parallel oder identisch. Hier sind sie identisch, der Abstand ist 0.</>),
            opt('d', <>Der Abstand ist <Formel tex={t`${rund2(betrag(id.g.u))}`} nach="," /> der Betrag von <Formel tex={t`\vec{u}`} nach="." /></>, false, <>Der Betrag von <Formel tex={t`\vec{u}`} /> ist die Länge des Richtungsvektors und sagt nichts über den Abstand der Geraden.</>),
          ],
          1,
        )}
        erklaerung={<>Bei Vielfachen als Richtungsvektoren prüfst du mit der Punktprobe, ob <Formel tex="Q" /> auf <Formel tex="g" /> liegt. Wenn ja, sind die Geraden identisch und der Abstand ist 0.</>}
      >
        <p>Gegeben sind</p>
        <G g={id.g} />
        <G g={id.h} name="h" par="s" />
        <p>Welche Aussage über den Abstand von <Formel tex="g" /> und <Formel tex="h" /> stimmt?</p>
      </Auswahlfrage>

      <Aufgabe
        nummer={10}
        titel="Ein Parameter im Punkt"
        felder={[{ id: 'a', name: 'Wert a', beschriftung: <>Wert <Formel tex="a" /></>, erwartet: pa.a }]}
        hilfen={[
          <>Der Lotfußpunkt ist <Formel tex={t`F=g(${pa.t})`} nach="." /> Berechne seine Koordinaten.</>,
          <>Der Vektor <Formel tex={t`\overrightarrow{FQ}`} /> muss senkrecht auf <Formel tex={t`\vec{u}`} /> stehen: <Formel tex={t`\overrightarrow{FQ}\cdot\vec{u}=0`} nach="." /> Daraus folgt eine Gleichung für <Formel tex="a" nach="." /></>,
        ]}
        loesung={[
          <>
            Lotfußpunkt:
            <FRechnung g={pa.g} par={pa.t} F={pa.F} />
          </>,
          <>
            Vektor <Formel tex={t`\overrightarrow{FQ}=\overrightarrow{OQ}-\overrightarrow{OF}`} nach=":" />
            <Umbruchformel tex={t`\overrightarrow{FQ}=\begin{pmatrix}a-2\\1\\-1\end{pmatrix}`} schmal={t`\begin{gathered}\overrightarrow{FQ}\\{}=\begin{pmatrix}a-2\\1\\-1\end{pmatrix}\end{gathered}`} />
          </>,
          <>
            Skalarprodukt gleich 0:
            <Z
              z={zeilenFormel(
                [`(a-2)\\cdot ${klammer(uPa[0]!)}+1\\cdot ${klammer(uPa[1]!)}+(-1)\\cdot ${klammer(uPa[2]!)}=${bruch(2)}a-2`, `${bruch(2)}a-2=0`, `a=${pa.a}`],
                [`(a-2)\\cdot ${klammer(uPa[0]!)}`, `{}+1\\cdot ${klammer(uPa[1]!)}`, `{}+(-1)\\cdot ${klammer(uPa[2]!)}`, `{}=2a-2`, `2a-2=0`, `a=${pa.a}`],
              )}
            />
            Für <Formel tex={t`a=${pa.a}`} /> ist <Formel tex={PK('Q', [pa.a, 3, 1])} /> der Punkt mit dem Lotfußpunkt <Formel tex={PK('F', pa.F)} nach="." />
          </>,
        ]}
      >
        <p>Gegeben sind</p>
        <G g={pa.g} />
        <p>
          und der Punkt <Formel tex={t`Q(a\,|\,3\,|\,1)`} nach="." /> Der Lotfußpunkt von <Formel tex="Q" /> auf <Formel tex="g" /> ist <Formel tex={t`F=g(${pa.t})`} nach="." /> Bestimme <Formel tex="a" nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={11}
        titel="Der Messballon und die Leitung"
        felder={[
          feldZahl('dm', 'Abstand des Mittelpunkts zur Leitung in Metern', 'd_{\\text{M}}\\text{ in m}', ba.dMeter, 0.01),
          feldZahl('ob', 'Abstand der Ballonoberfläche zur Leitung in Metern', 'd_{\\text{O}}\\text{ in m}', ba.oberflaeche, 0.01),
        ]}
        hilfen={[
          <>Berechne den Abstand von <Formel tex="Q" /> zu <Formel tex="g" /> in Längeneinheiten, zum Beispiel mit der Formel <Formel tex={t`d=\frac{|\vec{u}\times\overrightarrow{PQ}|}{|\vec{u}|}`} nach="." /> Eine Längeneinheit sind {ba.einheit} Meter.</>,
          <>Der Abstand der Ballonoberfläche ist der Abstand des Mittelpunkts minus der Radius {String(ba.radius).replace('.', ',')} Meter.</>,
        ]}
        loesung={[
          <>
            Verbindungsvektor und Vektorprodukt:
            <Z z={zeilenFormel([`${PQ}=${sp(verbindungsvektor(ba.g.p, ba.Q))}`], [`${PQ}`, `{}=${sp(verbindungsvektor(ba.g.p, ba.Q))}`])} />
            <Z z={ballon.kreuz} />
          </>,
          <>
            Abstand in Längeneinheiten und in Metern:
            <Z z={ballon.abstand} />
            <Z z={zeilenFormel([`${rundN(dLE, 3)}\\cdot ${ba.einheit}\\approx ${rund2(dLE * ba.einheit)}\\text{ m}`], [`${rundN(dLE, 3)}\\cdot ${ba.einheit}`, `{}\\approx ${rund2(dLE * ba.einheit)}\\text{ m}`])} />
          </>,
          <>
            Abstand der Oberfläche:
            <Z z={zeilenFormel([`${dez(dLE * ba.einheit)}-${zt(ba.radius)}=${dez(dLE * ba.einheit - ba.radius)}\\text{ m}`], [`${dez(dLE * ba.einheit)}-${zt(ba.radius)}`, `{}=${dez(dLE * ba.einheit - ba.radius)}\\text{ m}`])} />
            Der geforderte Mindestabstand von {ba.mindest} Metern wird {dLE * ba.einheit - ba.radius < ba.mindest ? 'unterschritten' : 'eingehalten'}.
          </>,
        ]}
      >
        <p>
          Eine Hochspannungsleitung verläuft auf der Geraden <Formel tex="g" nach=":" />
        </p>
        <G g={ba.g} />
        <p>
          Ein Messballon (Kugel mit Radius {String(ba.radius).replace('.', ',')} Meter) schwebt mit dem Mittelpunkt <Formel tex={PK('Q', ba.Q)} nach="." /> Eine Längeneinheit entspricht {ba.einheit} Metern. Berechne den Abstand des Mittelpunkts und den der Ballonoberfläche zur Leitung. Der Mindestabstand zur Leitung beträgt {ba.mindest} Meter. Wird er eingehalten?
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={12}
        titel="Zwei parallele Kabel"
        felder={[feldZahl('d', 'Abstand der Kabel in Metern', 'd\\text{ in m}', ka.d, 0.01)]}
        hilfen={[
          <>Prüfe, ob die Richtungsvektoren Vielfache sind. Dann ist der Abstand der Abstand des Stützpunkts von <Formel tex="h" /> zur Geraden <Formel tex="g" nach="." /></>,
          <>Nimm <Formel tex={PK('Q', ka.h.p)} /> und rechne zum Beispiel mit <Formel tex={t`d=\frac{|\vec{u}\times\overrightarrow{PQ}|}{|\vec{u}|}`} nach="." /> Eine Längeneinheit ist ein Meter.</>,
        ]}
        loesung={[
          <>
            Richtungsvektoren:
            <Z z={vielfachFormel(ka.h.u, ka.g.u, faktor(ka.g.u, ka.h.u)!)} />
            Die Kabel sind parallel.
          </>,
          <>
            Vektorprodukt mit <Formel tex={t`${PQ}=${sp(verbindungsvektor(ka.g.p, ka.h.p))}`} nach=":" />
            <Z z={kabel.kreuz} />
          </>,
          <>
            Abstand:
            <Z z={kabel.abstand} />
          </>,
        ]}
      >
        <p>Zwei Kabel einer Brücke verlaufen auf den Geraden</p>
        <G g={ka.g} />
        <G g={ka.h} name="h" par="s" />
        <p>Eine Längeneinheit entspricht einem Meter. Wie weit sind die Kabel voneinander entfernt?</p>
      </Aufgabe>

      <Zeichenaufgabe
        nummer="13"
        titel="Das Lot zeichnen"
        hilfe={
          <>
            <p>
              Stelle <Formel tex={t`\overrightarrow{XQ}`} /> auf und löse <Formel tex={t`\overrightarrow{XQ}\cdot\vec{u}=0`} nach="." />
            </p>
            <Z z={weg1Zeilen(ze.g, ze.Q).skalar} />
            <Z z={weg1Zeilen(ze.g, ze.Q).gleichung} />
            <p>Der Lotfußpunkt ist <Formel tex={PK('F', ze.F)} nach="." /> Trage <Formel tex="g" nach="," /> <Formel tex="Q" /> und <Formel tex="F" /> im Schrägbild ein und verbinde <Formel tex="F" /> mit <Formel tex="Q" nach="." /></p>
            <Z z={fqZeilen(ze.g, ze.Q)} />
          </>
        }
        kontrolle={<KontrollFigur spec={aufgZeichnen} unter={<>Die Gerade <Formel tex="g" nach="," /> der Punkt <Formel tex="Q" /> und das Lot <Formel tex="FQ" nach="." /> Der Abstand ist <Formel tex={t`d=${wurzelTeX(lz.d2)}\approx ${rund2(lz.d)}`} nach="." /></>} />}
      >
        <p>Gegeben sind</p>
        <G g={ze.g} />
        <p>
          und der Punkt <Formel tex={PK('Q', ze.Q)} nach="." /> Berechne den Lotfußpunkt <Formel tex="F" /> und zeichne die Gerade <Formel tex="g" nach="," /> den Punkt <Formel tex="Q" /> und das Lot <Formel tex="FQ" /> in ein Schrägbild (2 Kästchen je Einheit auf der <Formel tex="x_2" />- und der <Formel tex="x_3" />-Achse, eine Kästchendiagonale auf der <Formel tex="x_1" />-Achse). Prüfe danach mit dem Kontrollschaubild.
        </p>
      </Zeichenaufgabe>

      <Auswahlfrage
        nummer="14"
        titel="Welcher Weg liefert den Lotfußpunkt?"
        optionen={platziere(
          [
            opt('a', <>Weg 1 (Skalarprodukt) und Weg 2 (Minimieren), nicht aber Weg 3 (Vektorprodukt).</>, true, <>Richtig. Bei Weg 1 und Weg 2 erhältst du den Parameter <Formel tex={t`t_0`} nach="," /> daraus folgt <Formel tex="F" nach="." /> Die Formel mit dem Vektorprodukt gibt nur die Zahl <Formel tex="d" nach="," /> ohne den Punkt.</>),
            opt('b', <>Nur Weg 3 (Vektorprodukt).</>, false, <>Gerade das Gegenteil: Weg 3 liefert nur den Abstand <Formel tex="d" nach="," /> keinen Parameter <Formel tex="t" nach="," /> aus dem du <Formel tex="F" /> berechnen könntest.</>),
            opt('c', <>Alle drei Wege.</>, false, <>Weg 3 liefert nur die Länge des Lots. Für <Formel tex="F" /> brauchst du den Parameter <Formel tex={t`t_0`} nach="," /> den nur Weg 1 und Weg 2 berechnen.</>),
            opt('d', <>Kein Weg, der Lotfußpunkt wird nur gezeichnet.</>, false, <>Der Lotfußpunkt ist berechenbar: Mit <Formel tex={t`t_0`} /> aus Weg 1 oder Weg 2 setzt du in die Geradengleichung ein.</>),
          ],
          0,
        )}
        erklaerung={<>Weg 1 und Weg 2 berechnen den Parameter des Lotfußpunkts, daraus ergibt sich <Formel tex="F" nach="." /> Weg 3 ist die kürzeste Rechnung, wenn nur der Abstand gefragt ist.</>}
      >
        <p>
          Du sollst nicht nur den Abstand von <Formel tex="Q" /> zu <Formel tex="g" nach="," /> sondern auch den Lotfußpunkt <Formel tex="F" /> bestimmen. Mit welchem der drei Wege aus dem Abschnitt „Drei Wege“ ist das möglich?
        </p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
