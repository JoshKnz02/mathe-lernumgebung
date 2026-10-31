import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import type { Punkt3 } from '@/lib/schraegbild';
import { aufgAblesen, aufgGleichesBild, aufgQuader, aufgZeichnen } from './Bilder';
import {
  A_ABLESEN,
  A_GEGEN,
  A_GLEICHES_BILD,
  A_ORT,
  A_PROJEKTION,
  A_QUADER,
  A_SPIEGELN,
  A_START,
  A_UMKEHR,
  A_VEKTOR,
  A_ZEICHNEN,
  A_ZIEL,
} from './daten';
import { Figur, KontrollFigur, Zeichenaufgabe } from './Figur';

const spalte = (v: number[]) => t`\begin{pmatrix}${v[0]}\\${v[1]}\\${v[2]}\end{pmatrix}`;
const Spalte = ({ v }: { v: number[] }) => <Formel tex={spalte(v)} />;
/** Punkt als TeX mit Strichen, zum Beispiel P(4 | −1 | 3). */
const pt = (name: string, p: number[]) => `${name}(${p.join('\\,|\\,')})`;
const P = ({ name, p, nach }: { name: string; p: number[]; nach?: string }) => (nach ? <Formel tex={pt(name, p)} nach={nach} /> : <Formel tex={pt(name, p)} />);
/** Felder für die drei Koordinaten eines Punkts. */
const felderPunkt = (name: string, p: Punkt3, wort: string) =>
  [0, 1, 2].map((i) => ({ id: `${name}${i + 1}`, name: `${i + 1}. Koordinate von ${wort}`, beschriftung: <Formel tex={`${name}{:}\\,x_${i + 1}`} />, erwartet: p[i]! }));
const felderVektor = (id: string, v: number[], wort: string) =>
  [0, 1, 2].map((i) => ({ id: `${id}${i + 1}`, name: `${i + 1}. Koordinate von ${wort}`, beschriftung: <>{i + 1}. Koordinate</>, erwartet: v[i]! }));

export function Ueberpruefen() {
  const sp = A_SPIEGELN;
  const pr = A_PROJEKTION;
  const q = A_QUADER;
  const v = A_VEKTOR;
  const z = A_ZIEL;
  const s = A_START;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Schaubild kannst du dir das Schaubild zur Kontrolle einblenden, nachdem du selbst gezeichnet oder gerechnet hast.
      </p>
      <Hinweis titel="Eingabe">
        Bei Punkten und Vektoren trägst du jede Koordinate in ein eigenes Feld ein, die erste Koordinate zuerst. Negative Zahlen schreibst du mit Minuszeichen, zum Beispiel −3.
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Koordinaten im Schrägbild ablesen"
        felder={[
          { id: 'p1', name: '1. Koordinate von P', beschriftung: <Formel tex="p_1" />, erwartet: A_ABLESEN.p[0] },
          { id: 'p2', name: '2. Koordinate von P', beschriftung: <Formel tex="p_2" />, erwartet: A_ABLESEN.p[1] },
          { id: 'p3', name: '3. Koordinate von P', beschriftung: <Formel tex="p_3" />, erwartet: A_ABLESEN.p[2] },
        ]}
        hilfen={[
          <>Folge dem gestrichelten Weg vom Ursprung zu <Formel tex="P" nach="." /> Das erste Stück führt entlang der <Formel tex="x_1" />-Achse. Liegt es auf der Seite nach links unten oder nach rechts oben?</>,
          <>Das zweite Stück verläuft parallel zur <Formel tex="x_2" />-Achse, das dritte parallel zur <Formel tex="x_3" />-Achse. Zähle die Einheiten und achte auf die Richtung.</>,
        ]}
        loesung={[
          <>Das erste Stück führt vom Ursprung 2 Einheiten auf der <Formel tex="x_1" />-Achse nach rechts oben, also entgegen der Richtung der Achse: <Formel tex="p_1=-2" nach="." /></>,
          <>Das zweite Stück führt 2 Einheiten parallel zur <Formel tex="x_2" />-Achse nach rechts: <Formel tex="p_2=2" nach="." /> Das dritte führt 3 Einheiten nach oben: <Formel tex="p_3=3" nach="." /></>,
          <>Also gilt <Formel tex={t`P(-2\,|\,2\,|\,3)`} nach="." /></>,
        ]}
      >
        <p>
          Im Schrägbild ist der Punkt <Formel tex="P" /> mit dem Weg vom Ursprung eingezeichnet. Lies die Koordinaten von <Formel tex="P" /> ab.
        </p>
        <Figur spec={aufgAblesen(false)} unter={<>Der Punkt <Formel tex="P" /> mit dem gestrichelten Weg vom Ursprung.</>} />
        <KontrollFigur spec={aufgAblesen(true)} unter={<>Der Weg führt über <Formel tex="A" /> und <Formel tex="B" /> zu <Formel tex="P" nach="." /></>} />
      </Aufgabe>

      <Zeichenaufgabe
        nummer="2"
        titel="Punkt im Schrägbild zeichnen"
        hilfe={
          <>
            Gehe vom Ursprung 2 Einheiten entlang der <Formel tex="x_1" />-Achse (eine Kästchendiagonale je Einheit, nach links unten), dann 3 Einheiten entgegen der Richtung der <Formel tex="x_2" />-Achse (6 Kästchen nach links) und zuletzt 2 Einheiten entgegen der Richtung der <Formel tex="x_3" />-Achse (4 Kästchen nach unten).
          </>
        }
        kontrolle={<KontrollFigur spec={aufgZeichnen} unter={<>Der Punkt <P name="Q" p={A_ZEICHNEN.q} nach="." /> Der gestrichelte Weg zeigt, wie man ihn zeichnet.</>} />}
      >
        <p>
          Zeichne im Heft ein Schrägbild des Koordinatensystems (2 Kästchen je Einheit auf der <Formel tex="x_2" />- und der <Formel tex="x_3" />-Achse, eine Kästchendiagonale auf der <Formel tex="x_1" />-Achse) und trage den Punkt <P name="Q" p={A_ZEICHNEN.q} /> ein. Zeichne den Weg vom Ursprung mit ein. Prüfe danach mit dem Kontrollschaubild.
        </p>
      </Zeichenaufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Dieselbe Stelle im Schrägbild"
        optionen={platziere(
          [
            opt('a', <P name="B" p={A_GLEICHES_BILD.richtig} />, true, <>Richtig. Zu <Formel tex={t`A(1\,|\,1\,|\,1)`} /> gehört der Punkt <Formel tex={t`(1+2s\,|\,1+s\,|\,1+s)`} nach="," /> für <Formel tex="s=1" /> ist das <Formel tex={t`B(3\,|\,2\,|\,2)`} nach="." /></>),
            opt('b', <P name="B" p={A_GLEICHES_BILD.falsch[0]!} />, false, <>Hier ist <Formel tex="p_1" /> um 2 größer, aber <Formel tex="p_2" /> und <Formel tex="p_3" /> sind gleich geblieben. Dann hat der Punkt im Bild nicht dieselbe Stelle: Die zwei Einheiten auf der verkürzten <Formel tex="x_1" />-Achse verschieben ihn um 1 nach links und 1 nach unten, das wird nicht ausgeglichen.</>),
            opt('c', <P name="B" p={A_GLEICHES_BILD.falsch[1]!} />, false, <>Hier ist jede Koordinate um 1 größer. Eine Einheit in <Formel tex="x_1" />-Richtung verschiebt den Punkt im Bild um eine halbe Einheit nach links und nach unten, je ein Schritt in <Formel tex="x_2" />- und <Formel tex="x_3" />-Richtung um eine ganze Einheit nach rechts und nach oben. Das gleicht sich nicht aus, es bleibt eine halbe Einheit nach rechts und nach oben. Es bräuchte 2 Einheiten in <Formel tex="x_1" />-Richtung.</>),
            opt('d', <P name="B" p={A_GLEICHES_BILD.falsch[2]!} />, false, <>Hier sind alle Koordinaten um 2 größer. Die 2 Einheiten in <Formel tex="x_1" />-Richtung verschieben den Punkt im Bild um 1 nach links und 1 nach unten, die 2 Schritte in <Formel tex="x_2" />- und <Formel tex="x_3" />-Richtung um 2 nach rechts und 2 nach oben. Es bleibt eine Verschiebung um 1 nach rechts und 1 nach oben, also dieselbe Stelle nicht.</>),
          ],
          1,
        )}
        erklaerung={
          <>
            Im Bild liegt ein Punkt bei <Formel tex={t`(p_2-\tfrac{p_1}{2}\,|\,p_3-\tfrac{p_1}{2})`} nach="." /> Wird <Formel tex="p_1" /> um 2 größer, verschiebt sich das Bild um 1 nach links und 1 nach unten. Das gleichen ein Schritt nach rechts (<Formel tex="p_2" /> um 1 größer) und ein Schritt nach oben (<Formel tex="p_3" /> um 1 größer) wieder aus.
            <Figur spec={aufgGleichesBild} unter={<>Die Punkte <Formel tex={t`A(1\,|\,1\,|\,1)`} /> und <Formel tex={t`B(3\,|\,2\,|\,2)`} /> liegen im Bild an derselben Stelle.</>} />
          </>
        }
      >
        <p>
          Der Punkt <Formel tex={t`A(1\,|\,1\,|\,1)`} /> liegt im Schrägbild an einer bestimmten Stelle. Welcher andere Punkt liegt im Schrägbild an derselben Stelle?
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="4"
        titel="Oktant bestimmen"
        optionen={platziere(
          [
            opt('a', <>Oktant VI</>, true, <>Richtig: <Formel tex="p_1<0" nach="," /> <Formel tex="p_2>0" /> und <Formel tex="p_3<0" /> gehören zum Oktanten VI.</>),
            opt('b', <>Oktant II</>, false, <>Der Oktant II hat <Formel tex="p_1<0" nach="," /> <Formel tex="p_2>0" /> und <Formel tex="p_3>0" nach="." /> Die dritte Koordinate von <Formel tex="P" /> ist aber negativ. Dann liegt der Punkt unter der <Formel tex="x_1x_2" />-Ebene, bei V bis VIII.</>),
            opt('c', <>Oktant VII</>, false, <>Der Oktant VII hat alle drei Koordinaten negativ. Bei <Formel tex="P" /> ist aber <Formel tex="p_2=3" /> positiv.</>),
            opt('d', <>Oktant VIII</>, false, <>Der Oktant VIII hat <Formel tex="p_1>0" nach="," /> <Formel tex="p_2<0" /> und <Formel tex="p_3<0" nach="." /> Bei <Formel tex="P" /> sind die Vorzeichen von <Formel tex="p_1" /> und <Formel tex="p_2" /> genau umgekehrt.</>),
          ],
          0,
        )}
        erklaerung={
          <>
            Du liest die Vorzeichen ab: <Formel tex={t`(-\,|\,+\,|\,-)`} nach="." /> Die Oktanten V bis VIII liegen unter der <Formel tex="x_1x_2" />-Ebene. Dort gilt <Formel tex={t`(+\,|\,+\,|\,-)`} /> für V, <Formel tex={t`(-\,|\,+\,|\,-)`} /> für VI, <Formel tex={t`(-\,|\,-\,|\,-)`} /> für VII und <Formel tex={t`(+\,|\,-\,|\,-)`} /> für VIII.
          </>
        }
      >
        <p>
          In welchem Oktanten liegt der Punkt <P name="P" p={[-2, 3, -1]} nach="?" />
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="5"
        titel="Besondere Lage"
        optionen={platziere(
          [
            opt('a', <>Die <Formel tex="x_2" />-Koordinate ist 0.</>, true, <>Richtig. Die <Formel tex="x_1x_3" />-Ebene enthält die <Formel tex="x_1" />-Achse und die <Formel tex="x_3" />-Achse, also nur Punkte ohne Anteil in <Formel tex="x_2" />-Richtung.</>),
            opt('b', <>Die <Formel tex="x_1" />-Koordinate ist 0.</>, false, <>Das gilt für die <Formel tex="x_2x_3" />-Ebene. Dort liegen Punkte, die man nur in <Formel tex="x_2" />- und <Formel tex="x_3" />-Richtung erreicht.</>),
            opt('c', <>Die <Formel tex="x_3" />-Koordinate ist 0.</>, false, <>Das gilt für die <Formel tex="x_1x_2" />-Ebene. Dort liegen Punkte, die man nur in <Formel tex="x_1" />- und <Formel tex="x_2" />-Richtung erreicht.</>),
            opt('d', <>Die <Formel tex="x_1" />-Koordinate und die <Formel tex="x_3" />-Koordinate sind 0.</>, false, <>Dann liegt der Punkt auf der <Formel tex="x_2" />-Achse, also auf einer Geraden und nicht in der ganzen Ebene. In der <Formel tex="x_1x_3" />-Ebene darf <Formel tex="x_1" /> und <Formel tex="x_3" /> beliebig sein.</>),
          ],
          2,
        )}
        erklaerung={<>Die Ebene wird von der <Formel tex="x_1" />-Achse und der <Formel tex="x_3" />-Achse aufgespannt. Alle ihre Punkte haben die Form <Formel tex={t`(p_1\,|\,0\,|\,p_3)`} nach="." /></>}
      >
        <p>
          Welche Aussage gilt für alle Punkte der <Formel tex="x_1x_3" />-Ebene?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={6}
        titel="Spiegeln"
        felder={[
          ...felderPunkt('A', sp.e12, 'A').map((f) => ({ ...f, id: `e${f.id}` })),
          ...felderPunkt('B', sp.a2, 'B').map((f) => ({ ...f, id: `a${f.id}` })),
        ]}
        hilfen={[
          <>Die Koordinaten, die im Namen der Ebene oder Achse vorkommen, bleiben gleich, alle übrigen wechseln das Vorzeichen.</>,
          <>Bei der <Formel tex="x_1x_2" />-Ebene bleiben <Formel tex="p_1" /> und <Formel tex="p_2" /> und <Formel tex="p_3" /> wechselt. Bei der <Formel tex="x_2" />-Achse bleibt nur <Formel tex="p_2" nach="." /></>,
        ]}
        loesung={[
          <>
            An der <Formel tex="x_1x_2" />-Ebene bleiben <Formel tex="p_1" /> und <Formel tex="p_2" nach="," /> <Formel tex="p_3" /> wechselt das Vorzeichen: <Formel tex={t`A(4\,|\,-1\,|\,-3)`} nach="." />
          </>,
          <>
            An der <Formel tex="x_2" />-Achse bleibt <Formel tex="p_2" nach="," /> <Formel tex="p_1" /> und <Formel tex="p_3" /> wechseln das Vorzeichen: <Formel tex={t`B(-4\,|\,-1\,|\,-3)`} nach="." />
          </>,
        ]}
      >
        <p>
          Der Punkt <P name="P" p={sp.p} /> wird gespiegelt. Bestimme die Koordinaten des Spiegelpunkts <Formel tex="A" /> an der <Formel tex="x_1x_2" />-Ebene und des Spiegelpunkts <Formel tex="B" /> an der <Formel tex="x_2" />-Achse.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={7}
        titel="Senkrechte Projektion"
        felder={[
          ...felderPunkt('F', pr.e13, 'F').map((f) => ({ ...f, id: `f${f.id}` })),
          ...felderPunkt('G', pr.e12, 'G').map((f) => ({ ...f, id: `g${f.id}` })),
        ]}
        hilfen={[
          <>Bei der senkrechten Projektion auf eine Koordinatenebene bleiben die beiden Koordinaten der Ebene gleich.</>,
          <>Die dritte Koordinate wird 0, denn alle Punkte der Ebene haben dort die Koordinate 0.</>,
        ]}
        loesung={[
          <>
            Auf die <Formel tex="x_1x_3" />-Ebene: <Formel tex="p_2" /> wird 0, also <Formel tex={t`F(-2\,|\,0\,|\,3)`} nach="." />
          </>,
          <>
            Auf die <Formel tex="x_1x_2" />-Ebene: <Formel tex="p_3" /> wird 0, also <Formel tex={t`G(-2\,|\,5\,|\,0)`} nach="." />
          </>,
        ]}
      >
        <p>
          Der Punkt <P name="Q" p={pr.q} /> wird senkrecht auf die Koordinatenebenen projiziert. Bestimme den Fußpunkt <Formel tex="F" /> auf der <Formel tex="x_1x_3" />-Ebene und den Fußpunkt <Formel tex="G" /> auf der <Formel tex="x_1x_2" />-Ebene.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={8}
        titel="Vom Spiegelpunkt zurück"
        felder={felderPunkt('P', A_UMKEHR.p, 'P')}
        hilfen={[
          <>Eine Spiegelung ist umkehrbar: Spiegelt man den Spiegelpunkt noch einmal an derselben Ebene, erhält man den Ausgangspunkt.</>,
          <>An der <Formel tex="x_1x_3" />-Ebene wechselt die <Formel tex="x_2" />-Koordinate das Vorzeichen, die anderen bleiben gleich.</>,
        ]}
        loesung={[
          <>Der Spiegelpunkt <Formel tex={t`P'(3\,|\,4\,|\,-2)`} /> entsteht aus <Formel tex="P" /> durch Vorzeichenwechsel der <Formel tex="x_2" />-Koordinate.</>,
          <>Also wechselt die <Formel tex="x_2" />-Koordinate zurück: <Formel tex={t`P(3\,|\,-4\,|\,-2)`} nach="." /></>,
        ]}
      >
        <p>
          Der Punkt <Formel tex="P" /> wird an der <Formel tex="x_1x_3" />-Ebene gespiegelt und ergibt <P name="P'" p={A_UMKEHR.spiegel} nach="." /> Bestimme die Koordinaten von <Formel tex="P" nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Quader"
        felder={[...felderPunkt('F', q.f, 'F').map((f) => ({ ...f, id: `f${f.id}` })), ...felderPunkt('G', q.g, 'G').map((f) => ({ ...f, id: `g${f.id}` }))]}
        hilfen={[
          <>Die Kanten des Quaders verlaufen parallel zu den Koordinatenachsen. Überlege, welche Koordinaten <Formel tex="F" /> und <Formel tex="G" /> mit <Formel tex="A" nach="," /> <Formel tex="C" /> und <Formel tex="D" /> gemeinsam haben.</>,
          <>Die obere Fläche liegt in der Höhe von <Formel tex="D" nach="." /> <Formel tex="F" /> liegt über <Formel tex="B" nach="," /> <Formel tex="G" /> über <Formel tex="C" nach="." /> <Formel tex="B" /> hat die <Formel tex="x_1" />-Koordinate von <Formel tex="A" /> und die <Formel tex="x_2" />-Koordinate von <Formel tex="C" nach="." /></>,
        ]}
        loesung={[
          <>Die Ecke <Formel tex="B" /> hat die <Formel tex="x_1" />-Koordinate von <Formel tex="A" /> und die <Formel tex="x_2" />-Koordinate von <Formel tex="C" nach=":" /> <Formel tex={t`B(4\,|\,3\,|\,0)`} nach="." /></>,
          <><Formel tex="F" /> liegt über <Formel tex="B" /> in der Höhe 3: <Formel tex={t`F(4\,|\,3\,|\,3)`} nach="." /> <Formel tex="G" /> liegt über <Formel tex="C" nach=":" /> <Formel tex={t`G(0\,|\,3\,|\,3)`} nach="." /></>,
        ]}
      >
        <p>
          Der Quader <Formel tex="OABCDEFG" /> hat die Ecken <Formel tex={t`O(0\,|\,0\,|\,0)`} nach="," /> <Formel tex={t`A(4\,|\,0\,|\,0)`} nach="," /> <Formel tex={t`C(0\,|\,3\,|\,0)`} /> und <Formel tex={t`D(0\,|\,0\,|\,3)`} nach="." /> Dabei liegen <Formel tex="O" nach="," /> <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> in der <Formel tex="x_1x_2" />-Ebene, <Formel tex="E" nach="," /> <Formel tex="F" /> und <Formel tex="G" /> liegen über <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" nach="." /> Bestimme die Koordinaten der Ecken <Formel tex="F" /> und <Formel tex="G" nach="." />
        </p>
        <Figur spec={aufgQuader(false)} unter={<>Der Quader mit den Ecken <Formel tex="O" nach="," /> <Formel tex="A" nach="," /> <Formel tex="C" /> und <Formel tex="D" nach="." /></>} />
        <KontrollFigur spec={aufgQuader(true)} unter={<>Der Quader mit allen Ecken, <Formel tex="F" /> und <Formel tex="G" /> sind orange.</>} />
      </Aufgabe>

      <Aufgabe
        nummer={10}
        titel="Vektor im Raum"
        felder={felderVektor('ab', v.ab, 'AB')}
        hilfen={[
          <>Wie in der Ebene rechnest du Zielpunkt minus Ausgangspunkt, jetzt bei drei Koordinaten, jede für sich.</>,
          <>Setze negative Zahlen in der Rechnung in Klammern.</>,
        ]}
        loesung={[
          <>
            <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}4-1\\2-(-3)\\-1-2\end{pmatrix}`} nach="," />
          </>,
          <>
            also <Formel tex={t`\overrightarrow{AB}=${spalte(v.ab)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind <P name="A" p={v.a} /> und <P name="B" p={v.b} nach="." /> Bestimme die Koordinaten des Vektors <Formel tex={t`\overrightarrow{AB}`} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={11}
        titel="Zielpunkt im Raum"
        felder={felderPunkt('B', z.b, 'B')}
        hilfen={[<>Addiere die Koordinaten des Vektors zu den Koordinaten des Ausgangspunkts.</>, <>Rechne jede Koordinate einzeln und achte auf die Vorzeichen.</>]}
        loesung={[
          <>
            <Formel tex={t`B(2+(-4)\,|\,-1+2\,|\,3+5)=B(-2\,|\,1\,|\,8)`} nach="." />
          </>,
          <>
            Probe: <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}-2-2\\1-(-1)\\8-3\end{pmatrix}=${spalte(z.v)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind <P name="A" p={z.a} /> und <Formel tex={t`\overrightarrow{AB}=${spalte(z.v)}`} nach="." /> Bestimme die Koordinaten des Zielpunkts <Formel tex="B" nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={12}
        titel="Ausgangspunkt im Raum"
        felder={felderPunkt('A', s.a, 'A')}
        hilfen={[<>Jetzt ist der Zielpunkt bekannt. Du gehst den Weg rückwärts, also subtrahierst du.</>, <>Ziehe die Koordinaten des Vektors von den Koordinaten von <Formel tex="B" /> ab.</>]}
        loesung={[
          <>
            <Formel tex={t`A(-3-2\,|\,1-(-4)\,|\,-2-3)=A(-5\,|\,5\,|\,-5)`} nach="." />
          </>,
          <>
            Probe: <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}-3-(-5)\\1-5\\-2-(-5)\end{pmatrix}=${spalte(s.v)}`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind <P name="B" p={s.b} /> und <Formel tex={t`\overrightarrow{AB}=${spalte(s.v)}`} nach="." /> Bestimme die Koordinaten des Ausgangspunkts <Formel tex="A" nach="." />
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="13"
        titel="Der Ortsvektor"
        optionen={platziere(
          [
            opt('a', <Spalte v={A_ORT.p} />, true, <>Richtig: Der Ortsvektor führt vom Ursprung zum Punkt, seine Koordinaten sind die Koordinaten des Punkts.</>),
            opt('b', <Spalte v={A_ORT.p.map((x) => -x)} />, false, <>Das ist der Gegenvektor, also der Vektor von <Formel tex="P" /> zum Ursprung, <Formel tex={t`\overrightarrow{PO}`} nach="." /> Der Ortsvektor <Formel tex={t`\overrightarrow{OP}`} /> führt vom Ursprung zu <Formel tex="P" nach="." /></>),
            opt('c', <Spalte v={[4, 3, 1]} />, false, <>Hier hat nur die zweite Koordinate das Vorzeichen gewechselt. Zielpunkt minus Ausgangspunkt ergibt <Formel tex={t`-3-0=-3`} nach="." /></>),
            opt('d', <Spalte v={[0, 0, 0]} />, false, <>Das ist der Nullvektor. Er wäre der Ortsvektor des Ursprungs selbst. <Formel tex="P" /> ist aber nicht der Ursprung.</>),
          ],
          3,
        )}
        erklaerung={<>Ausgangspunkt ist der Ursprung <Formel tex={t`O(0\,|\,0\,|\,0)`} nach="," /> Zielpunkt ist <Formel tex="P" nach="." /> Zielpunkt minus Ausgangspunkt ergibt in jeder Koordinate die Koordinate von <Formel tex="P" /> selbst.</>}
      >
        <p>
          Wie lautet der Ortsvektor <Formel tex={t`\overrightarrow{OP}`} /> des Punktes <P name="P" p={A_ORT.p} nach="?" />
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="14"
        titel="Der Nullvektor"
        optionen={platziere(
          [
            opt('a', <>Die Punkte <Formel tex="A" /> und <Formel tex="B" /> sind derselbe Punkt.</>, true, <>Richtig. Dann ist Zielpunkt minus Ausgangspunkt in jeder Koordinate 0.</>),
            opt('b', <>Der Punkt <Formel tex="A" /> ist der Ursprung.</>, false, <>Dann ist <Formel tex={t`\overrightarrow{AB}`} /> der Ortsvektor von <Formel tex="B" nach="," /> und der ist nur der Nullvektor, wenn auch <Formel tex="B" /> der Ursprung ist.</>),
            opt('c', <>Die Punkte <Formel tex="A" /> und <Formel tex="B" /> liegen auf derselben Koordinatenachse.</>, false, <>Auch dann sind <Formel tex="A" /> und <Formel tex="B" /> meist verschieden, zum Beispiel <Formel tex={t`A(1\,|\,0\,|\,0)`} /> und <Formel tex={t`B(4\,|\,0\,|\,0)`} nach="." /> Der Vektor ist dann <Formel tex={t`\begin{pmatrix}3\\0\\0\end{pmatrix}`} nach="." /></>),
            opt('d', <>Die Summe der Koordinaten von <Formel tex="A" /> und <Formel tex="B" /> ist 0.</>, false, <>Dann sind <Formel tex="A" /> und <Formel tex="B" /> Spiegelpunkte am Ursprung, zum Beispiel <Formel tex={t`A(1\,|\,2\,|\,3)`} /> und <Formel tex={t`B(-1\,|\,-2\,|\,-3)`} nach="." /> Der Vektor ist dann nicht der Nullvektor.</>),
          ],
          1,
        )}
        erklaerung={<>Der Nullvektor <Formel tex={t`\begin{pmatrix}0\\0\\0\end{pmatrix}`} /> beschreibt eine Verschiebung, bei der sich nichts ändert. Er entsteht nur, wenn Ausgangs- und Zielpunkt zusammenfallen.</>}
      >
        <p>
          Für welche Punkte <Formel tex="A" /> und <Formel tex="B" /> ist <Formel tex={t`\overrightarrow{AB}`} /> der Nullvektor?
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="15"
        titel="Der Gegenvektor"
        optionen={platziere(
          [
            opt('a', <Spalte v={A_GEGEN.gegen} />, true, <>Richtig: Beim Gegenvektor wechseln alle drei Koordinaten das Vorzeichen.</>),
            opt('b', <Spalte v={[-7, -3, -2]} />, false, <>Hier hat die dritte Koordinate das Vorzeichen nicht gewechselt. Beim Gegenvektor wird jede Richtung umgekehrt, auch die <Formel tex="x_3" />-Richtung.</>),
            opt('c', <Spalte v={[7, 3, 2]} />, false, <>Hier hat nur die dritte Koordinate das Vorzeichen gewechselt. Beim Rückweg wird auch die <Formel tex="x_1" />- und die <Formel tex="x_2" />-Richtung umgekehrt.</>),
            opt('d', <Spalte v={[-2, 3, 7]} />, false, <>Die Koordinaten sind vertauscht. Das ist ein anderer Vektor. Beim Gegenvektor bleiben die Zahlen an ihrer Stelle, nur die Vorzeichen wechseln.</>),
          ],
          2,
        )}
        erklaerung={<>Der Rückweg macht jede Bewegung rückgängig. Aus <Formel tex={t`\begin{pmatrix}7\\3\\-2\end{pmatrix}`} /> wird deshalb <Formel tex={t`\begin{pmatrix}-7\\-3\\2\end{pmatrix}`} nach="." /></>}
      >
        <p>
          Wie lautet der Gegenvektor von <Formel tex={t`\vec{v}=${spalte(A_GEGEN.v)}`} nach="?" />
        </p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
