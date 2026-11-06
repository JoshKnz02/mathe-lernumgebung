import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { NULL_KOORDINATE, spurpunkte, type Gerade, type Koordinatenebene } from '@/lib/gerade';
import { bruch, punktBruchTeX, punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { aufgSpur, aufgZeichnen } from './Bilder';
import { A_ANZAHL, A_DEZIMAL, A_DRITTER, A_IN_EBENE, A_LASER, A_PARALLEL, A_PARAMETER, A_PARAMETER_EBENE, A_SPUR, A_URSPRUNG, A_ZEICHNEN, A_ZUORDNUNG, SPUR_TEX } from './daten';

const sp = (v: number[]) => spalte(v);
/** Gleichung einer Geraden in TeX, einzeilig und in zwei Zeilen. */
const gl = (g: Gerade, name = 'g') => t`${name}:\ \vec{x}=${sp(g.p)}+t\cdot${sp(g.u)}`;
const glSchmal = (g: Gerade, name = 'g') => t`\begin{gathered}${name}:\ \vec{x}=${sp(g.p)}\\{}+t\cdot${sp(g.u)}\end{gathered}`;
/** p + u · t als TeX ohne Faktor 1: 1 + t, 2 − t, 3t. */
const lin = (pi: number, ui: number): string => {
  const faktor = Math.abs(ui) === 1 ? '' : String(Math.abs(ui));
  return pi === 0 ? `${ui < 0 ? '-' : ''}${faktor}t` : `${pi}${ui < 0 ? '-' : '+'}${faktor}t`;
};
/** Lösungsschritt für einen Spurpunkt in vier kurzen Zeilen. */
const spurSchritt = (g: Gerade, e: Koordinatenebene) => {
  const i = NULL_KOORDINATE[e];
  const s = spurpunkte(g).find((q) => q.ebene === e)!;
  const kopf = `x_${i + 1}=0`;
  const gleichung = `${lin(g.p[i]!, g.u[i]!)}=0`;
  const par = `t=${bruch(s.t)}`;
  const punkt = punktBruchTeX(SPUR_TEX[e], s.punkt);
  return <Umbruchformel tex={t`${kopf}:\ ${gleichung}\Rightarrow ${par},\ \ ${punkt}`} schmal={t`\begin{gathered}${kopf}\\${gleichung}\\{}\Rightarrow ${par}\\${punkt}\end{gathered}`} />;
};
const feldZahl = (id: string, name: string, beschriftung: string, erwartet: number): Feld => ({ id, name, beschriftung: <Formel tex={beschriftung} />, erwartet });
const S12 = SPUR_TEX.e12;
const S13 = SPUR_TEX.e13;
const S23 = SPUR_TEX.e23;
const x = (i: number) => `x_${i}`;

export function Ueberpruefen() {
  const sa = A_SPUR;
  const de = A_DEZIMAL;
  const an = A_ANZAHL;
  const dr = A_DRITTER;
  const ze = A_ZEICHNEN;
  const zu = A_ZUORDNUNG;
  const pa = A_PARALLEL;
  const ur = A_URSPRUNG;
  const pr = A_PARAMETER;
  const pe = A_PARAMETER_EBENE;
  const la = A_LASER;
  const ie = A_IN_EBENE;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten. Das Aufstellen und Prüfen von Geradengleichungen steht im Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">
        Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma.
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Die drei Spurpunkte berechnen"
        felder={[
          feldZahl('a1', '1. Koordinate von S12', `${S12}:\\ ${x(1)}`, sa.S12[0]),
          feldZahl('a2', '2. Koordinate von S12', `${S12}:\\ ${x(2)}`, sa.S12[1]),
          feldZahl('b1', '1. Koordinate von S13', `${S13}:\\ ${x(1)}`, sa.S13[0]),
          feldZahl('b3', '3. Koordinate von S13', `${S13}:\\ ${x(3)}`, sa.S13[2]),
          feldZahl('c2', '2. Koordinate von S23', `${S23}:\\ ${x(2)}`, sa.S23[1]),
          feldZahl('c3', '3. Koordinate von S23', `${S23}:\\ ${x(3)}`, sa.S23[2]),
        ]}
        hilfen={[<>Für <Formel tex={S12} /> setzt du <Formel tex="x_3=0" />, für <Formel tex={S13} /> setzt du <Formel tex="x_2=0" /> und für <Formel tex={S23} /> setzt du <Formel tex="x_1=0" nach="." /></>, <>Löse jeweils nach <Formel tex="t" /> auf und setze <Formel tex="t" /> in die Gleichung ein. Die Koordinate, die du gleich 0 gesetzt hast, muss im Ergebnis 0 sein.</>]}
        loesung={[
          <>{spurSchritt(sa.g, 'e12')}</>,
          <>{spurSchritt(sa.g, 'e13')}</>,
          <>{spurSchritt(sa.g, 'e23')}</>,
        ]}
      >
        <p>
          Berechne die drei Spurpunkte von <Formel tex={gl(sa.g)} nach="." /> Gib je zwei Koordinaten an, die dritte ist 0.
        </p>
        <KontrollFigur spec={aufgSpur} unter={<>Die Gerade mit ihren drei Spurpunkten <Formel tex={punktTeX(S12, sa.S12)} nach="," /> <Formel tex={punktTeX(S13, sa.S13)} /> und <Formel tex={punktTeX(S23, sa.S23)} nach="." /></>} />
      </Aufgabe>

      <Aufgabe
        nummer={2}
        titel="Ein Spurpunkt mit Dezimalzahlen"
        felder={[feldZahl('x1', '1. Koordinate von S13', `${S13}:\\ ${x(1)}`, de.S13[0]!), feldZahl('x3', '3. Koordinate von S13', `${S13}:\\ ${x(3)}`, de.S13[2]!)]}
        hilfen={[<>Setze <Formel tex="x_2=0" />. Die zweite Koordinate der Geraden ist <Formel tex="1+2t" nach="." /></>, <>Du erhältst einen Bruch für <Formel tex="t" nach="." /> Setze ihn in die erste und dritte Koordinate ein und gib das Ergebnis als Dezimalzahl an.</>]}
        loesung={[
          <>{spurSchritt(de.g, 'e13')}</>,
          <>
            Als Dezimalzahlen:
            <Umbruchformel tex={t`S_{13}(-0{,}5\,|\,0\,|\,1{,}5)`} schmal={t`\begin{gathered}S_{13}(-0{,}5\,|\,0\\{}\,|\,1{,}5)\end{gathered}`} />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={gl(de.g)} nach="." /> Berechne den Spurpunkt <Formel tex={S13} /> in der <Formel tex="x_1x_3" />-Ebene und gib die erste und die dritte Koordinate an.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Welche Spurpunkte gibt es?"
        optionen={platziere(
          [
            opt('a', <>Zwei Spurpunkte, <Formel tex={S12} /> und <Formel tex={S13} nach="." /> Die Gerade ist parallel zur <Formel tex="x_2x_3" />-Ebene.</>, true, <>Richtig. Die erste Koordinate des Richtungsvektors ist 0 und die des Stützvektors ist 2: Es ist immer <Formel tex="x_1=2" nach="," /> die Gerade erreicht die <Formel tex="x_2x_3" />-Ebene nie. Die anderen Spurpunkte sind <Formel tex={punktTeX(S12, [2, -2, 0])} /> und <Formel tex={punktTeX(S13, [2, 0, -2])} nach="." /></>),
            opt('b', <>Drei Spurpunkte, denn jede Gerade durchstößt alle drei Koordinatenebenen.</>, false, <>Nicht jede Gerade durchstößt alle drei Ebenen. Hier ist die erste Koordinate des Richtungsvektors 0, also bleibt <Formel tex="x_1=2" /> immer gleich. Die Gerade erreicht die <Formel tex="x_2x_3" />-Ebene (<Formel tex="x_1=0" />) nie.</>),
            opt('c', <>Zwei Spurpunkte, <Formel tex={S13} /> und <Formel tex={S23} nach="." /></>, false, <>Einen Spurpunkt <Formel tex={S23} /> gibt es nicht: Dafür müsste <Formel tex="x_1=2+0\cdot t=0" /> werden, das ist nie der Fall. Dafür gibt es <Formel tex={S12} nach="." /></>),
            opt('d', <>Einen Spurpunkt, den Ursprung.</>, false, <>Die Gerade geht nicht durch den Ursprung: Der Stützvektor <Formel tex={t`${sp(an.g.p)}`} /> ist kein Vielfaches des Richtungsvektors <Formel tex={t`${sp(an.g.u)}`} nach="." /></>),
          ],
          2,
        )}
        erklaerung={<>Du setzt für jede Ebene die Koordinate gleich 0. Bei <Formel tex="x_1=2+0\cdot t" /> hat die Gleichung <Formel tex="2=0" /> keine Lösung. Ist eine Koordinate des Richtungsvektors 0 und die gleiche des Stützvektors nicht, gibt es in dieser Ebene keinen Spurpunkt.</>}
      >
        <p>
          Welche Aussage über die Spurpunkte von <Formel tex={gl(an.g)} /> stimmt?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={4}
        titel="Den dritten Spurpunkt bestimmen"
        felder={[feldZahl('y', '2. Koordinate von S23', `${S23}:\\ ${x(2)}`, dr.S23[1]), feldZahl('z', '3. Koordinate von S23', `${S23}:\\ ${x(3)}`, dr.S23[2])]}
        hilfen={[<>Der Richtungsvektor ist der Verbindungsvektor <Formel tex={t`\overrightarrow{S_{12}S_{13}}`} nach="." /> Kürze ihn, wenn du magst.</>, <>Stelle die Gleichung mit dem Stützpunkt <Formel tex={S12} /> auf und setze die erste Koordinate gleich 0.</>]}
        loesung={[
          <>
            <Umbruchformel tex={t`\overrightarrow{S_{12}S_{13}}=${sp([6, -3, -3])}=3\cdot${sp(dr.u)}`} schmal={t`\begin{gathered}\overrightarrow{S_{12}S_{13}}\\{}=${sp([6, -3, -3])}\\{}=3\cdot${sp(dr.u)}\end{gathered}`} />
          </>,
          <>
            Gleichung:
            <Umbruchformel tex={t`g:\ \vec{x}=${sp(dr.S12)}+t\cdot${sp(dr.u)}`} schmal={glSchmal({ p: [...dr.S12], u: dr.u })} />
          </>,
          <>
            Erste Koordinate:
            <Umbruchformel tex={t`-2+2t=0\Rightarrow t=1`} schmal={t`\begin{gathered}-2+2t=0\\{}\Rightarrow t=1\end{gathered}`} />
            Der Punkt ist <Formel tex={punktTeX(S23, dr.S23)} nach="." />
          </>,
        ]}
      >
        <p>
          Eine Gerade <Formel tex="g" /> hat die Spurpunkte <Formel tex={punktTeX(S12, dr.S12)} /> und <Formel tex={punktTeX(S13, dr.S13)} nach="." /> Bestimme den Spurpunkt <Formel tex={S23} /> in der <Formel tex="x_2x_3" />-Ebene und gib die zweite und dritte Koordinate an.
        </p>
      </Aufgabe>

      <Zeichenaufgabe
        nummer="5"
        titel="Eine Gerade mit Spurpunkten zeichnen"
        hilfe={
          <>
            Berechne die drei Spurpunkte: <Formel tex={punktTeX(S12, ze.S12)} nach="," /> <Formel tex={punktTeX(S13, ze.S13)} /> und <Formel tex={punktTeX(S23, ze.S23)} nach="." /> Trage sie im Schrägbild ein (jede Einheit auf der <Formel tex="x_1" />-Achse ist eine Kästchendiagonale nach links unten) und verbinde sie mit einer Linie. Verlängere die Linie über die äußeren Spurpunkte hinaus.
          </>
        }
        kontrolle={<KontrollFigur spec={aufgZeichnen} unter={<>Die Gerade mit ihren drei Spurpunkten in den Koordinatenebenen.</>} />}
      >
        <p>
          Zeichne im Heft ein Schrägbild des Koordinatensystems (2 Kästchen je Einheit auf der <Formel tex="x_2" />- und der <Formel tex="x_3" />-Achse, eine Kästchendiagonale auf der <Formel tex="x_1" />-Achse). Berechne die Spurpunkte von <Formel tex={gl(ze.g)} /> und zeichne die Gerade mit ihrer Hilfe. Prüfe danach mit dem Kontrollschaubild.
        </p>
      </Zeichenaufgabe>

      <Aufgabe
        nummer={6}
        titel="Besondere Lage erkennen"
        felder={zu.geraden.map((_, i) => ({ id: `g${i + 1}`, name: `Nummer der Beschreibung für g${i + 1}`, beschriftung: <Formel tex={`g_${i + 1}`} />, erwartet: zu.loesung[i]! }))}
        hilfen={[
          <>Prüfe zuerst die Geraden, die nur zu einer Beschreibung passen. Eine Gerade kann zu mehreren Beschreibungen passen.</>,
          <>Jede Beschreibung kommt genau einmal vor. Ordnest du eine Gerade zu, scheidet diese Beschreibung für die anderen aus.</>,
        ]}
        loesung={[
          <>
            <Formel tex="g_1" nach=":" /> <Formel tex="u_1=0" /> und <Formel tex="p_1=2\ne 0" nach="," /> also parallel zur <Formel tex="x_2x_3" />-Ebene: Nummer 5. <Formel tex="g_2" nach=":" /> <Formel tex="u_3=0" /> und <Formel tex="p_3=0" nach="," /> sie liegt in der <Formel tex="x_1x_2" />-Ebene: Nummer 8.
          </>,
          <>
            <Formel tex="g_3" nach=":" /> Der Stützvektor ist der Nullvektor, sie geht durch den Ursprung: Nummer 1. <Formel tex="g_4" nach=":" /> Sie liegt auf der <Formel tex="x_3" />-Achse: Nummer 7. Sie geht auch durch den Ursprung und liegt in der <Formel tex="x_1x_3" />-Ebene, aber diese Beschreibungen gehören zu anderen Geraden.
          </>,
          <>
            <Formel tex="g_5" nach=":" /> <Formel tex={t`\vec{u}=(1\,|\,0\,|\,0)`} nach="," /> <Formel tex="p_3=0" nach="," /> sie ist parallel zur <Formel tex="x_1" />-Achse und liegt in der <Formel tex="x_1x_2" />-Ebene: Nummer 3.
          </>,
          <>
            <Formel tex="g_6" nach=":" /> <Formel tex="u_2=0" /> und <Formel tex="p_2=0" nach="," /> sie liegt in der <Formel tex="x_1x_3" />-Ebene: Nummer 2. <Formel tex="g_7" nach=":" /> <Formel tex="u_2=0" /> und <Formel tex="p_2=3\ne 0" nach="," /> also parallel zur <Formel tex="x_1x_3" />-Ebene: Nummer 6. <Formel tex="g_8" nach=":" /> <Formel tex="\vec{u}" /> zeigt in Richtung der <Formel tex="x_2" />-Achse, <Formel tex="p_1=0" nach="," /> sie liegt in der <Formel tex="x_2x_3" />-Ebene: Nummer 4.
          </>,
        ]}
      >
        <p>Ordne jeder Geraden <Formel tex="g_1" /> bis <Formel tex="g_8" /> die passende Beschreibung 1 bis 8 zu. Verwende jede Beschreibung genau einmal. Manche Geraden passen zu mehreren Beschreibungen, dann entscheidet, welche Beschreibung sonst übrig bliebe. „Parallel“ heißt ohne gemeinsamen Punkt. Trage in jedes Feld die Nummer der Beschreibung ein.</p>
        <ol className="auftraege" aria-label="Beschreibungen 1 bis 8">
          {zu.beschreibungen.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ol>
        <ul className="liste-ohne-zahl" aria-label="Geraden g1 bis g8">
          {zu.geraden.map((g, i) => (
            <li key={i}>
              <Formel tex={gl(g, `g_${i + 1}`)} nach="," />
            </li>
          ))}
        </ul>
      </Aufgabe>

      <Auswahlfrage
        nummer="7"
        titel="Parallel oder in der Ebene?"
        optionen={platziere(
          [
            opt('a', <>Sie ist parallel zur <Formel tex="x_1x_2" />-Ebene.</>, true, <>Richtig. Es ist <Formel tex="u_3=0" nach="," /> also bleibt <Formel tex="x_3" /> gleich. Weil <Formel tex="p_3=3\ne 0" /> ist, bleibt die Gerade in der Höhe 3 und erreicht die Ebene nie.</>),
            opt('b', <>Sie liegt in der <Formel tex="x_1x_2" />-Ebene.</>, false, <>Die dritte Koordinate des Richtungsvektors ist 0, deshalb ändert sich <Formel tex="x_3" /> nicht. Sie ist aber <Formel tex="3" /> und nicht 0: Die Gerade liegt in der Höhe 3, nicht in der Ebene.</>),
            opt('c', <>Sie durchstößt die <Formel tex="x_1x_2" />-Ebene in genau einem Spurpunkt.</>, false, <>Für einen Spurpunkt müsste <Formel tex="x_3=3+0\cdot t=0" /> gelten. Das ist für kein <Formel tex="t" /> der Fall.</>),
            opt('d', <>Sie ist parallel zur <Formel tex="x_3" />-Achse.</>, false, <>Dazu müsste der Richtungsvektor ein Vielfaches von <Formel tex={t`(0\,|\,0\,|\,1)`} /> sein, also in den ersten beiden Koordinaten 0 haben. Hier ist es umgekehrt: Nur die dritte Koordinate ist 0.</>),
          ],
          0,
        )}
        erklaerung={<>Eine 0 im Richtungsvektor heißt: Diese Koordinate ändert sich nicht. Ist sie im Stützvektor 0, liegt die Gerade in der zugehörigen Ebene, sonst ist sie parallel dazu.</>}
      >
        <p>
          Welche Aussage über <Formel tex={gl(pa.g)} /> stimmt?
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="8"
        titel="Welche Gerade geht durch den Ursprung?"
        optionen={platziere(
          [
            opt('a', <Formel tex={gl(ur.richtig)} />, true, <>Richtig. Der Stützvektor ist <Formel tex={t`-2\cdot\vec{u}`} nach="." /> Für <Formel tex="t=2" /> erhältst du <Formel tex={t`(-2+2\cdot 1\,|\,4+2\cdot(-2)\,|\,-6+2\cdot 3)=(0\,|\,0\,|\,0)`} nach="." /></>),
            opt('b', <Formel tex={gl(ur.nichtVielfach)} />, false, <>Für <Formel tex="t=2" /> passen die ersten beiden Koordinaten, die dritte nicht: <Formel tex="-6+2\cdot 4=2\ne 0" nach="." /> Der Stützvektor ist kein Vielfaches des Richtungsvektors.</>),
            opt('c', <Formel tex={gl(ur.summe)} />, false, <>Die erste Koordinate verlangt <Formel tex={t`t=-\frac{1}{2}`} nach="," /> die dritte <Formel tex={t`t=-\frac{4}{5}`} nach="." /> Die beiden Werte sind verschieden, der Stützvektor ist kein Vielfaches des Richtungsvektors.</>),
            opt('d', <Formel tex={gl(ur.achsenparallel)} />, false, <>Die Gerade ist parallel zur <Formel tex="x_3" />-Achse, liegt aber nicht auf ihr: Die erste Koordinate ist immer 3, der Ursprung hat 0.</>),
          ],
          1,
        )}
        erklaerung={<>Eine Gerade geht durch den Ursprung, wenn der Stützvektor ein Vielfaches des Richtungsvektors ist. Dann gibt es ein <Formel tex="t" /> mit <Formel tex={t`\vec{p}+t\cdot\vec{u}=\vec{0}`} nach="." /></>}
      >
        <p>Welche der Geraden geht durch den Ursprung?</p>
      </Auswahlfrage>

      <Aufgabe
        nummer={9}
        titel="Parallel mit einem Parameter"
        felder={[{ id: 'a', name: 'Wert a', beschriftung: <>Wert <Formel tex="a" /></>, erwartet: pr.a }]}
        hilfen={[<>Für die Parallelität zur <Formel tex="x_1x_3" />-Ebene muss die zweite Koordinate des Richtungsvektors 0 sein.</>, <>Prüfe danach, ob die zweite Koordinate des Stützvektors nicht 0 ist, sonst liegt die Gerade in der Ebene.</>]}
        loesung={[
          <>
            Zweite Koordinate des Richtungsvektors:
            <Umbruchformel tex={t`2a-4=0\Rightarrow a=2`} schmal={t`\begin{gathered}2a-4=0\\{}\Rightarrow a=2\end{gathered}`} />
          </>,
          <>
            Der Stützvektor hat die zweite Koordinate 3, und <Formel tex="3\ne 0" nach="." /> Für <Formel tex="a=2" /> ist <Formel tex={t`\vec{u}=(2\,|\,0\,|\,1)`} /> und die Gerade ist parallel zur <Formel tex="x_1x_3" />-Ebene.
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={t`g:\ \vec{x}=${sp(pr.p)}+t\cdot\begin{pmatrix}a\\2a-4\\1\end{pmatrix}`} nach="." /> Für welchen Wert von <Formel tex="a" /> ist <Formel tex="g" /> parallel zur <Formel tex="x_1x_3" />-Ebene (ohne gemeinsamen Punkt)?
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="10"
        titel="Parallel oder in der Ebene, jetzt mit Parameter"
        optionen={platziere(
          [
            opt('a', <>Für kein <Formel tex="a" nach="." /></>, true, <>Richtig. Die zweite Koordinate des Richtungsvektors ist nur für <Formel tex="a=2" /> gleich 0. Dann ist aber auch die zweite Koordinate des Stützvektors 0, und <Formel tex="g" /> liegt in der <Formel tex="x_1x_3" />-Ebene. Für alle anderen <Formel tex="a" /> gibt es einen Spurpunkt <Formel tex={S13} nach="." /></>),
            opt('b', <>Für <Formel tex="a=2" nach="." /></>, false, <>Für <Formel tex="a=2" /> ist <Formel tex="u_2=0" nach="." /> Da aber <Formel tex="p_2=0" /> ist, liegt <Formel tex="g" /> in der Ebene. In der Ebene liegen und parallel zu ihr sein sind zwei verschiedene Lagen.</>),
            opt('c', <>Für <Formel tex="a=0" nach="." /></>, false, <>Für <Formel tex="a=0" /> ist <Formel tex={t`\vec{u}=(0\,|\,-4\,|\,1)`} nach="." /> Die erste Koordinate ist 0 und <Formel tex="p_1=2\ne 0" nach="," /> also ist <Formel tex="g" /> parallel zur <Formel tex="x_2x_3" />-Ebene, nicht zur <Formel tex="x_1x_3" />-Ebene.</>),
            opt('d', <>Für jedes <Formel tex="a" nach="." /></>, false, <>Für <Formel tex="a\ne 2" /> ist <Formel tex="u_2\ne 0" nach="," /> die Gerade durchstößt die <Formel tex="x_1x_3" />-Ebene.</>),
          ],
          3,
        )}
        erklaerung={<>Parallel zur <Formel tex="x_1x_3" />-Ebene heißt: <Formel tex="u_2=0" /> und <Formel tex="p_2\ne 0" nach="." /> Hier ist <Formel tex="p_2=0" nach="," /> also gibt es keinen Wert von <Formel tex="a" /> mit echter Parallelität.</>}
      >
        <p>
          Gegeben ist <Formel tex={t`g:\ \vec{x}=${sp(pe.p)}+t\cdot\begin{pmatrix}a\\2a-4\\1\end{pmatrix}`} nach="." /> Für welche Werte von <Formel tex="a" /> ist <Formel tex="g" /> parallel zur <Formel tex="x_1x_3" />-Ebene (ohne gemeinsamen Punkt)?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={11}
        titel="Der Laserstrahl und der Boden"
        felder={[feldZahl('x1', '1. Koordinate des Auftreffpunkts', 'x_1', la.S12[0]!), feldZahl('x2', '2. Koordinate des Auftreffpunkts', 'x_2', la.S12[1]!)]}
        hilfen={[<>Der Boden ist die <Formel tex="x_1x_2" />-Ebene. Der Auftreffpunkt ist der Spurpunkt <Formel tex={S12} nach="." /></>, <>Setze <Formel tex="x_3=0" /> und berechne <Formel tex="t" nach="." /></>]}
        loesung={[
          <>{spurSchritt(la.g, 'e12')}</>,
          <>
            Der Strahl trifft den Boden im Punkt <Formel tex={punktTeX('S_{12}', la.S12)} nach="," /> also 5 m östlich und 7 m nördlich des Ursprungs, wenn <Formel tex="x_1" /> nach Osten und <Formel tex="x_2" /> nach Norden zeigt.
          </>,
        ]}
      >
        <p>
          Ein Laserstrahl verläuft auf der Geraden <Formel tex={gl(la.g)} /> (Einheit Meter, die <Formel tex="x_1x_2" />-Ebene ist der Boden). Wo trifft er auf den Boden? Gib die Koordinaten <Formel tex="x_1" /> und <Formel tex="x_2" /> des Auftreffpunkts an.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="12"
        titel="Eine Gerade in der Koordinatenebene"
        optionen={platziere(
          [
            opt('a', <>Zwei Spurpunkte, <Formel tex={punktTeX(S13, ie.S13)} /> und <Formel tex={t`S_{23}(0\,|\,\frac{5}{2}\,|\,0)`} nach="." /></>, true, <>Richtig. Die Gerade liegt in der <Formel tex="x_1x_2" />-Ebene, dort gibt es keinen einzelnen Spurpunkt. Mit der <Formel tex="x_1x_3" />-Ebene (<Formel tex="x_2=0" />) schneidet sie sich für <Formel tex="t=2" /> und mit der <Formel tex="x_2x_3" />-Ebene (<Formel tex="x_1=0" />) für <Formel tex={t`t=-\frac{1}{2}`} nach="." /> Beide Spurpunkte liegen auf Koordinatenachsen.</>),
            opt('b', <>Drei Spurpunkte.</>, false, <>Ein Spurpunkt <Formel tex={S12} /> würde einen einzelnen Durchstoßpunkt mit der <Formel tex="x_1x_2" />-Ebene brauchen. Die Gerade liegt aber ganz in dieser Ebene, alle ihre Punkte sind gemeinsame Punkte. Nach der Vereinbarung gibt es dort keinen Spurpunkt.</>),
            opt('c', <>Keinen Spurpunkt.</>, false, <>Die Gerade schneidet die beiden anderen Koordinatenebenen jeweils in einem Punkt: für <Formel tex="x_2=0" /> bei <Formel tex="t=2" /> und für <Formel tex="x_1=0" /> bei <Formel tex={t`t=-\frac{1}{2}`} nach="." /></>),
            opt('d', <>Unendlich viele Spurpunkte.</>, false, <>Mit der <Formel tex="x_1x_2" />-Ebene hat die Gerade zwar unendlich viele gemeinsame Punkte, aber das sind keine Spurpunkte. Ein Spurpunkt ist ein einzelner Durchstoßpunkt.</>),
          ],
          1,
        )}
        erklaerung={<>Liegt eine Gerade in einer Koordinatenebene, gibt es dort keinen Spurpunkt. Mit den anderen beiden Ebenen schneidet sie sich in je einem Punkt, solange die zugehörigen Koordinaten des Richtungsvektors nicht 0 sind. Beide Punkte liegen auf Koordinatenachsen.</>}
      >
        <p>
          Wie viele Spurpunkte hat <Formel tex={gl(ie.g)} /> nach der Vereinbarung dieses Moduls (in einer Ebene, in der die Gerade liegt, gibt es keinen Spurpunkt)?
        </p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
