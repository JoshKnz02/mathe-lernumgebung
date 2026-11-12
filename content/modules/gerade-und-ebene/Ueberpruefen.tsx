import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { gleichsetzMatrix, stufenform } from '@/lib/geradeebene';
import { matrixTeX } from '@/lib/lgs';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { aufg1, aufg3, aufg7, aufg8, aufg9, aufg11 } from './Bilder';
import { A1, A2, A3, A4, A5, A6, A7, A8, A9, A11 } from './daten';
import { geradeZeilen, geradenprobeZeilen, gl, koordinatenformTeX, kreuzSpalte, kreuzSpalteKurz, punktTeX, skalarZeilen, spalte } from './rechenhilfen';

type G = { p: number[]; u: number[] };
type KF = { n: number[]; d: number };
const gF = (g: G, name = 'g') => <Formel tex={gl(g, name)} />;
const probe = (g: G, k: KF) => {
  const z = geradenprobeZeilen(g, k);
  return <Umbruchformel tex={z.tex} schmal={z.schmal} />;
};
const zeilen = (g: G) => <Umbruchformel tex={geradeZeilen(g).join(t`,\quad `)} schmal={t`\begin{gathered}${geradeZeilen(g).join('\\\\')}\end{gathered}`} />;
const os = (g: G, par: number, S: number[]) => (
  <Umbruchformel tex={t`\overrightarrow{OS}=${spalte(g.p)}+${par < 0 ? `(${par})` : par}\cdot${spalte(g.u)}=${spalte(S)}`} schmal={t`\begin{gathered}\overrightarrow{OS}\\{}=${spalte(g.p)}+${par < 0 ? `(${par})` : par}\cdot${spalte(g.u)}\\{}=${spalte(S)}\end{gathered}`} />
);
const sFelder = (S: number[]): Feld[] => S.map((x, i) => ({ id: `s${i + 1}`, name: `${i + 1}. Koordinate des Durchstoßpunkts`, beschriftung: <>{i + 1}. Koordinate von <Formel tex="S" /></>, erwartet: x }));

export function Ueberpruefen() {
  const a4m = gleichsetzMatrix(A4.e, A5.g);
  const a4s = stufenform(a4m);
  const z4 = geradenprobeZeilen(A4.g, A4.k);
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Das Vektorprodukt (Kreuzprodukt) steht im Modul <Modulverweis modul="vektorprodukt">Das Vektorprodukt</Modulverweis> (Kreuzprodukt), das Gleichsetzen als Gleichungssystem im Modul <Modulverweis modul="loesbarkeit-lgs">Lösbarkeit linearer Gleichungssysteme</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen.</Hinweis>

      <Aufgabe
        nummer={1}
        titel="Den Durchstoßpunkt bestimmen"
        felder={sFelder(A1.S)}
        hilfen={[
          <>Schreibe die Gerade zeilenweise und setze die drei Ausdrücke in die Ebenengleichung ein.</>,
          <>Löse die entstehende Gleichung nach <Formel tex="t" /> auf und setze <Formel tex="t" /> in die Geradengleichung ein.</>,
        ]}
        loesung={[
          <>Zeilenweise: {zeilen(A1.g)}</>,
          <>Einsetzen in die Ebenengleichung: {probe(A1.g, A1.k)}</>,
          <>
            Aus <Formel tex={geradenprobeZeilen(A1.g, A1.k).gleichung} /> folgt <Formel tex={t`t=${A1.t}`} nach="." /> Durchstoßpunkt: {os(A1.g, A1.t, A1.S)}
          </>,
        ]}
      >
        <p>
          Die Gerade <Formel tex={gl(A1.g)} /> schneidet die Ebene <Formel tex={koordinatenformTeX(A1.k.n, A1.k.d, 'E')} nach="." /> Bestimme den Durchstoßpunkt <Formel tex="S" nach="." />
        </p>
        <KontrollFigur spec={aufg1} unter={<>Die Gerade <Formel tex="g" /> durchstößt die Ebene in <Formel tex="S" nach="." /></>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="2"
        titel="Die Lage aus der Geradenprobe lesen"
        optionen={platziere(
          [
            opt('a', <>g ist echt parallel zu E.</>, true, <>Richtig. Die Gleichung <Formel tex={geradenprobeZeilen(A2.g, A2.k).gleichung} /> ist eine falsche Aussage, für jedes <Formel tex="t" nach="." /> Es gibt keinen gemeinsamen Punkt.</>),
            opt('b', <>g liegt in E, weil t in der Gleichung wegfällt.</>, false, <>Dass <Formel tex="t" /> wegfällt, heißt nur <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach="." /> Ob die Gerade in <Formel tex="E" /> liegt, entscheidet die verbleibende Aussage: Hier ist sie falsch, die Gerade liegt also nicht in <Formel tex="E" nach="." /></>),
            opt('c', <>g schneidet E in genau einem Punkt.</>, false, <>Eine Gleichung ohne <Formel tex="t" /> hat keine eindeutige Lösung für <Formel tex="t" nach="." /> Es gibt keinen Durchstoßpunkt.</>),
            opt('d', <>Die Lage lässt sich nicht bestimmen, weil sich t nicht berechnen lässt.</>, false, <>Gerade dass die Gleichung für jedes <Formel tex="t" /> falsch ist, sagt etwas aus: Die Gerade hat keinen Punkt mit der Ebene gemeinsam.</>),
          ],
          0,
        )}
        erklaerung={<>Bei einer Geradenprobe ohne <Formel tex="t" /> entscheidet, ob die verbleibende Aussage wahr oder falsch ist: wahr heißt „liegt in“, falsch heißt „echt parallel“.</>}
      >
        <p>
          Die Gerade <Formel tex={gl(A2.g)} /> und die Ebene <Formel tex={koordinatenformTeX(A2.k.n, A2.k.d, 'E')} /> führen auf die Gleichung der Geradenprobe <Formel tex={geradenprobeZeilen(A2.g, A2.k).gleichung} nach="." /> Welche Aussage über die Lage stimmt?
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="3"
        titel="Welche Gerade liegt in E?"
        optionen={platziere(
          [
            opt('a', gF(A3.g1, 'g_1'), true, <>Richtig. <Formel tex={t`\vec{n}\cdot\vec{u}=${skalarZeilen(A3.k.n, A3.g1.u).tex}`} /> und der Stützpunkt liegt in <Formel tex="E" nach=":" /> <Formel tex={t`${skalarZeilen(A3.k.n, A3.g1.p).tex}=2`} nach="." /></>),
            opt('b', gF(A3.g2, 'g_2'), false, <>Der Stützpunkt liegt in <Formel tex="E" nach="," /> aber <Formel tex={t`\vec{n}\cdot\vec{u}=${skalarZeilen(A3.k.n, A3.g2.u).tex}\ne 0`} nach="." /> Die Gerade durchstößt die Ebene in <Formel tex="P" nach="." /></>),
            opt('c', gF(A3.g3, 'g_3'), false, <><Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach="," /> aber der Stützpunkt liegt nicht in <Formel tex="E" nach=":" /> <Formel tex={t`${skalarZeilen(A3.k.n, A3.g3.p).tex}\ne 2`} nach="." /> Die Gerade ist echt parallel.</>),
            opt('d', gF(A3.g4, 'g_4'), false, <><Formel tex={t`\vec{n}\cdot\vec{u}=${skalarZeilen(A3.k.n, A3.g4.u).tex}\ne 0`} nach="," /> die Gerade schneidet die Ebene und liegt nicht in ihr.</>),
          ],
          2,
        )}
        erklaerung={
          <>
            <p>Eine Gerade liegt in <Formel tex="E" nach="," /> wenn <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> gilt und der Stützpunkt in <Formel tex="E" /> liegt. Beides muss stimmen.</p>
            <Figur spec={aufg3} unter={<><Formel tex={t`g_1`} /> (schwarz) liegt in <Formel tex="E" nach="," /> <Formel tex={t`g_2`} /> (orange) hat denselben Stützpunkt und durchstößt <Formel tex="E" nach="." /></>} />
          </>
        }
      >
        <p>
          Welche der Geraden liegt in der Ebene <Formel tex={koordinatenformTeX(A3.k.n, A3.k.d, 'E')} nach="?" />
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={4}
        titel="Die Ebene in Parameterform"
        felder={sFelder(A4.S)}
        hilfen={[
          <>Bestimme zuerst die Koordinatenform: Normalenvektor mit dem Vektorprodukt (Kreuzprodukt), dann <Formel tex={t`d=\vec{n}\cdot\vec{p}`} nach="." /></>,
          <>Mit der Koordinatenform führst du die Geradenprobe aus und berechnest den Durchstoßpunkt wie sonst.</>,
        ]}
        loesung={[
          <>
            Normalenvektor:
            <Umbruchformel tex={t`\vec{n}=${kreuzSpalte(A4.e.u, A4.e.v)}=${spalte(A4.k.n)}`} schmal={t`\begin{gathered}\vec{n}\\{}=${kreuzSpalteKurz(A4.e.u, A4.e.v)}\\{}=${spalte(A4.k.n)}\end{gathered}`} />
          </>,
          <>
            Mit dem Stützvektor <Formel tex={t`d=\vec{n}\cdot\vec{p}`} nach=":" />
            <Umbruchformel tex={skalarZeilen(A4.k.n, A4.e.p).tex} schmal={skalarZeilen(A4.k.n, A4.e.p).schmal} />
            Die Koordinatenform ist <Formel tex={koordinatenformTeX(A4.k.n, A4.k.d, 'E')} nach="." />
          </>,
          <>Geradenprobe: {zeilen(A4.g)}{probe(A4.g, A4.k)}</>,
          <>
            Aus <Formel tex={z4.gleichung} /> folgt <Formel tex={t`t=${A4.t}`} nach="." /> Durchstoßpunkt: {os(A4.g, A4.t, A4.S)}
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`E:\ \vec{x}=${spalte(A4.e.p)}+r\cdot${spalte(A4.e.u)}+s\cdot${spalte(A4.e.v)}`} /> und <Formel tex={gl(A4.g)} nach="." /> Die Gerade schneidet die Ebene. Bestimme den Durchstoßpunkt <Formel tex="S" nach="." />
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="5"
        titel="Gleichsetzen deuten"
        optionen={platziere(
          [
            opt('a', <>Das System hat genau eine Lösung: g schneidet E.</>, false, <>Dann hätte jede Spalte der Matrix einen Pivot und es gäbe keine Zeile mit lauter Nullen links. Hier steht links in der letzten Zeile nur 0.</>),
            opt('b', <>Das System hat keine Lösung: g ist echt parallel zu E.</>, true, <>Richtig. Die letzte Zeile heißt <Formel tex={t`0\cdot r+0\cdot s+0\cdot t=${a4s[2]![3]}`} nach="," /> das ist ein Widerspruch. Es gibt keinen gemeinsamen Punkt.</>),
            opt('c', <>Das System hat unendlich viele Lösungen: g liegt in E.</>, false, <>Unendlich viele Lösungen gäbe es bei einer Nullzeile mit <Formel tex="0" /> auf der rechten Seite. Hier steht rechts <Formel tex={String(a4s[2]![3])} nach="." /></>),
            opt('d', <>Das System hat nur die Lösung r = s = t = 0: g geht durch den Stützpunkt von E.</>, false, <>Eine Zeile mit lauter Nullen links und einer Zahl ungleich 0 rechts hat keine Lösung. Es gibt auch keine Lösung mit r = s = t = 0.</>),
          ],
          1,
        )}
        erklaerung={<>Beim Gleichsetzen zeigt eine Zeile <Formel tex={t`0\ 0\ 0\ |\ c`} /> mit <Formel tex={t`c\ne 0`} /> einen Widerspruch: keine Lösung, echt parallel. Eine Nullzeile mit <Formel tex="c=0" /> heißt unendlich viele Lösungen, drei Pivots heißen genau eine Lösung.</>}
      >
        <p>
          Die Ebene <Formel tex={t`E:\ \vec{x}=${spalte(A4.e.p)}+r\cdot${spalte(A4.e.u)}+s\cdot${spalte(A4.e.v)}`} /> und die Gerade <Formel tex={gl(A5.g, 'h')} /> werden gleichgesetzt. Das Gleichungssystem für <Formel tex="r" nach="," /> <Formel tex="s" /> und <Formel tex="t" /> hat die Zeilenstufenform
        </p>
        <Formel anzeige tex={matrixTeX(a4s)} />
        <p>Welche Aussage stimmt?</p>
      </Auswahlfrage>

      <Aufgabe
        nummer={6}
        titel="Ein Parameter in der Ebenengleichung"
        felder={[{ id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: A6.a }]}
        hilfen={[
          <>Die Gerade verläuft parallel zur Ebene, wenn <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> gilt. Der Normalenvektor enthält den Parameter <Formel tex="a" nach="." /></>,
          <>Berechne <Formel tex={t`\vec{n}\cdot\vec{u}`} /> mit <Formel tex={t`\vec{n}=(a\,|\,1\,|\,-1)`} /> und setze das Ergebnis gleich 0.</>,
        ]}
        loesung={[
          <>
            Bedingung <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach=":" />
            <Umbruchformel tex={t`a\cdot 1+1\cdot 2+(-1)\cdot 3=0`} schmal={t`\begin{gathered}a+2-3=0\\a-1=0\\a=${A6.a}\end{gathered}`} />
          </>,
          <>
            Der Stützpunkt <Formel tex={punktTeX('P', A6.P)} /> liegt nicht in der Ebene: <Formel tex={t`1\cdot 0+0-0=0\ne 3`} nach="." /> Also ist <Formel tex="g" /> für <Formel tex={t`a=${A6.a}`} /> echt parallel zu <Formel tex={t`E_a`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`E_a:\ a\,x_1+x_2-x_3=${A6.d}`} /> und <Formel tex={t`g:\ \vec{x}=${spalte(A6.P)}+t\cdot${spalte(A6.u)}`} nach="." /> Für welchen Wert von <Formel tex="a" /> ist <Formel tex="g" /> echt parallel zu <Formel tex={t`E_a`} nach="?" />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={7}
        titel="Senkrecht auf die Ebene"
        felder={sFelder(A7.S)}
        hilfen={[
          <>Die Gerade steht senkrecht auf der Ebene, ihr Richtungsvektor ist also der Normalenvektor <Formel tex={t`\vec{n}`} nach="." /></>,
          <>Stelle <Formel tex={t`\vec{x}=\vec{p}+t\cdot\vec{n}`} /> auf und führe die Geradenprobe aus.</>,
        ]}
        loesung={[
          <>Richtungsvektor: <Formel tex={t`\vec{n}=${spalte(A7.k.n)}`} nach="." /> {zeilen({ p: A7.P, u: A7.k.n })}</>,
          <>Geradenprobe: {probe({ p: A7.P, u: A7.k.n }, A7.k)}</>,
          <>
            Aus <Formel tex={geradenprobeZeilen({ p: A7.P, u: A7.k.n }, A7.k).gleichung} /> folgt <Formel tex={t`t=${A7.t}`} nach="." /> {os({ p: A7.P, u: A7.k.n }, A7.t, A7.S)}
          </>,
        ]}
      >
        <p>
          Die Gerade <Formel tex="g" /> geht durch <Formel tex={punktTeX('P', A7.P)} /> und steht senkrecht auf der Ebene <Formel tex={koordinatenformTeX(A7.k.n, A7.k.d, 'E')} nach="." /> In welchem Punkt <Formel tex="S" /> durchstößt <Formel tex="g" /> die Ebene?
        </p>
        <KontrollFigur spec={aufg7} unter={<>Die Gerade <Formel tex="g" /> steht senkrecht auf der Ebene und durchstößt sie in <Formel tex="S" nach="." /></>} />
      </Aufgabe>

      <Zeichenaufgabe
        nummer="8"
        titel="Geraden mit gegebener Lage angeben"
        hilfe={
          <>
            <p>
              Der Normalenvektor ist <Formel tex={t`\vec{n}=${spalte(A8.k.n)}`} nach="." /> Der Punkt <Formel tex={punktTeX('P', A8.P)} /> liegt nicht in <Formel tex="E" nach=":" /> <Formel tex={t`${skalarZeilen(A8.k.n, A8.P).tex}=3\ne 2`} nach="." />
            </p>
            <p>
              Echt parallel: Wähle <Formel tex={t`\vec{u}`} /> mit <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach="," /> zum Beispiel <Formel tex={t`\vec{u}=${spalte(A8.par.u)}`} nach="." /> Probe: <Formel tex={t`${skalarZeilen(A8.k.n, A8.par.u).tex}`} nach="." /> Da <Formel tex="P" /> nicht in <Formel tex="E" /> liegt, ist <Formel tex={gl(A8.par)} /> echt parallel zu <Formel tex="E" nach="." />
            </p>
            <p>
              Schneidend: Wähle <Formel tex={t`\vec{u}`} /> mit <Formel tex={t`\vec{n}\cdot\vec{u}\ne 0`} nach="," /> zum Beispiel <Formel tex={t`\vec{u}=${spalte(A8.schn.u)}`} nach="." /> Probe: <Formel tex={t`${skalarZeilen(A8.k.n, A8.schn.u).tex}`} nach="." /> Die Geradenprobe liefert <Formel tex={geradenprobeZeilen(A8.schn, A8.k).gleichung} nach="," /> also <Formel tex={t`t=${A8.t}`} /> und <Formel tex={punktTeX('S', A8.S)} nach="." />
            </p>
          </>
        }
        kontrolle={<KontrollFigur spec={aufg8} unter={<>Durch <Formel tex="P" /> gehen <Formel tex="g" /> (schwarz, echt parallel zu <Formel tex="E" nach=")" /> und <Formel tex="h" /> (orange, durchstößt <Formel tex="E" /> in <Formel tex="S" nach=")." /></>} />}
      >
        <p>
          Gegeben sind die Ebene <Formel tex={koordinatenformTeX(A8.k.n, A8.k.d, 'E')} /> und der Punkt <Formel tex={punktTeX('P', A8.P)} nach="." /> Gib eine Gerade durch <Formel tex="P" /> an, die echt parallel zu <Formel tex="E" /> ist, und eine Gerade durch <Formel tex="P" nach="," /> die <Formel tex="E" /> schneidet. Weise die Lage jeweils nach. Gibt es jeweils nur eine Lösung? Begründe.
        </p>
      </Zeichenaufgabe>

      <Aufgabe
        nummer={9}
        titel="Ein Lichtstrahl trifft eine Wand"
        felder={sFelder(A9.S)}
        hilfen={[
          <>Der Lichtstrahl ist die Gerade durch <Formel tex="A" /> mit dem Richtungsvektor. Die Wand liegt in der Ebene <Formel tex="E" nach="." /> Gesucht ist ihr Durchstoßpunkt.</>,
          <>Führe die Geradenprobe aus, löse nach <Formel tex="t" /> auf und setze <Formel tex="t" /> in die Geradengleichung ein.</>,
        ]}
        loesung={[
          <>Zeilenweise: {zeilen(A9.g)}</>,
          <>Geradenprobe: {probe(A9.g, A9.k)}</>,
          <>
            Aus <Formel tex={geradenprobeZeilen(A9.g, A9.k).gleichung} /> folgt <Formel tex={t`t=${A9.t}`} nach="." /> Auftreffpunkt: {os(A9.g, A9.t, A9.S)}
          </>,
        ]}
      >
        <p>
          Von einem Laserpointer im Punkt <Formel tex={punktTeX('A', A9.g.p)} /> verläuft ein Strahl in Richtung <Formel tex={t`\vec{u}=${spalte(A9.g.u)}`} nach="." /> Eine Glaswand liegt in der Ebene <Formel tex={koordinatenformTeX(A9.k.n, A9.k.d, 'E')} nach="." /> (Eine Einheit entspricht einem Meter, der Strahl ist unbegrenzt angenommen.) In welchem Punkt <Formel tex="S" /> trifft der Strahl die Wand?
        </p>
        <KontrollFigur spec={aufg9} unter={<>Der Strahl durch <Formel tex="A" /> trifft die Wand in <Formel tex="S" nach="." /></>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="10"
        titel="Was folgt aus n · u = 0?"
        optionen={platziere(
          [
            opt('a', <>g schneidet E in genau einem Punkt.</>, false, <>Bei <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> fällt <Formel tex="t" /> aus der Gleichung der Geradenprobe weg. Es gibt keinen eindeutigen Parameter, also keinen Durchstoßpunkt.</>),
            opt('b', <>g liegt in E.</>, false, <>Das kann sein, ist aber nicht sicher: Es kommt darauf an, ob der Stützpunkt in <Formel tex="E" /> liegt.</>),
            opt('c', <>g ist echt parallel zu E oder liegt in E, der Stützpunkt entscheidet.</>, true, <>Richtig. <Formel tex={t`\vec{u}`} /> steht senkrecht auf <Formel tex={t`\vec{n}`} nach="." /> Liegt der Stützpunkt in <Formel tex="E" nach="," /> liegt die Gerade in <Formel tex="E" nach="," /> sonst ist sie echt parallel.</>),
            opt('d', <>g steht senkrecht auf E.</>, false, <>Senkrecht auf <Formel tex="E" /> steht <Formel tex="g" nach="," /> wenn <Formel tex={t`\vec{u}`} /> ein Vielfaches von <Formel tex={t`\vec{n}`} /> ist. Bei <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> ist <Formel tex={t`\vec{u}`} /> gerade senkrecht zu <Formel tex={t`\vec{n}`} nach="." /></>),
          ],
          3,
        )}
        erklaerung={<>Das Skalarprodukt <Formel tex={t`\vec{n}\cdot\vec{u}`} /> steht vor <Formel tex="t" /> in der Gleichung der Geradenprobe. Ist es 0, entscheidet die Punktprobe mit dem Stützpunkt.</>}
      >
        <p>
          Bei einer Geraden <Formel tex="g" /> und einer Ebene <Formel tex="E" /> mit Normalenvektor <Formel tex={t`\vec{n}`} /> gilt <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach="." /> Welche Aussage über die Lage stimmt?
        </p>
      </Auswahlfrage>

      <Zeichenaufgabe
        nummer="11"
        titel="Stellung nehmen"
        hilfe={
          <>
            <p>
              Tim hat nicht recht. Ein Gegenbeispiel genügt: In <Formel tex={koordinatenformTeX(A11.k.n, A11.k.d, 'E')} /> liegt <Formel tex={punktTeX('P', A11.g.p)} nach="," /> denn <Formel tex={t`${skalarZeilen(A11.k.n, A11.g.p).tex}=2`} nach="." /> Die Gerade <Formel tex={gl(A11.g)} /> hat aber <Formel tex={t`\vec{n}\cdot\vec{u}=${skalarZeilen(A11.k.n, A11.g.u).tex}\ne 0`} nach="," /> sie durchstößt <Formel tex="E" /> in <Formel tex="P" /> und liegt nicht in <Formel tex="E" nach="." />
            </p>
            <p>Richtig ist: Liegt <Formel tex="g" /> in <Formel tex="E" nach="," /> dann liegt der Stützpunkt in <Formel tex="E" nach="." /> Umgekehrt genügt das nicht, es muss auch <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> gelten.</p>
          </>
        }
        kontrolle={<KontrollFigur spec={aufg11} unter={<>Die Gerade <Formel tex="g" /> geht durch den Punkt <Formel tex="P" /> der Ebene, liegt aber nicht in der Ebene.</>} />}
      >
        <p>
          Tim behauptet: „Wenn der Stützpunkt einer Geraden <Formel tex="g" /> in der Ebene <Formel tex="E" /> liegt, dann liegt die ganze Gerade in <Formel tex="E" nach=".“" /> Nimm Stellung und gib ein Gegenbeispiel an, wenn Tim nicht recht hat.
        </p>
      </Zeichenaufgabe>
    </Abschnitt>
  );
}
