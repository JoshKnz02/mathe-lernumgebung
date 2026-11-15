import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { KontrollFigur } from '@/components/Raumfigur';
import { gleichungE, koordinatenformTeX } from '@/lib/ebenenhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { spalte } from '@/lib/laborhilfen';
import { BILD_K32 } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { EbenenZwei } from './EbenenZwei';
import { F, KF, P, V, koordFelder } from './hilfen';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K26, K27, K28, K29, K30, K31, K32, K33, K34, K35, K36, K37, K38, K41, K42, K43, K44, TOL2 } from './werte';

/** Gleichung einer Geraden als TeX: name: x = p + par · u. */
const gl = (name: string, p: number[], u: number[], par = 't') => `${name}:\\ \\vec{x}=${spalte(p)}+${par}\\cdot${spalte(u)}`;
/** Parameterform einer Ebene in kleiner Schrift (drei Spalten nebeneinander). */
const pf = (name: string, o: { p: number[]; u: number[]; v: number[] }) => `\\small ${gleichungE(o, name)}`;

/** Bereich Ebenen im Raum: Aussagen 26 bis 39 und die ergänzten Aussagen 41 bis 47 und „!“. */
export function Ebenen() {
  return (
    <Abschnitt id="ebenen" titel="Ebenen im Raum">
      <p>Hier geht es um Ebenengleichungen (Parameterform, Koordinatenform, Achsenabschnittsform), Spurpunkte und Spurgeraden, die Lage von Geraden und Ebenen, Abstände, Spiegelung, Volumen und das Problemlösen.</p>
      <Eingabehinweis />

      <Punkt id="parameterform">
        <Kontrollfrage
          aussage="parameterform"
          teil="a"
          nummer="K26a"
          titel="Parameterform aus drei Punkten, Teil a"
          optionen={platziere(
            [
              opt('a', <Formel tex={pf('E', K26.optionen.a)} />, true, <>Richtig.</>),
              opt('b', <Formel tex={pf('E', K26.optionen.b)} />, false, <>Hier sind die Summen der Ortsvektoren als Spannvektoren verwendet: <Formel tex={t`\overrightarrow{OA}+\overrightarrow{OB}`} /> und <Formel tex={t`\overrightarrow{OA}+\overrightarrow{OC}`} nach="." /> Die Spannvektoren müssen die Verbindungsvektoren <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> sein (Differenzen).</>),
              opt('c', <Formel tex={pf('E', K26.optionen.c)} />, false, <>Der zweite Spannvektor ist falsch: <Formel tex={t`\overrightarrow{AC}=(-1\,|\,3\,|\,1)`} nach="," /> hier steht in der ersten Zeile 1 statt <Formel tex="-1" nach="." /> Dann liegt <Formel tex="C" /> nicht in der Ebene.</>),
              opt('d', <Formel tex={pf('E', K26.optionen.d)} />, false, <>Als Spannvektoren sind hier Ortsvektoren der Punkte verwendet. Die Spannvektoren sind aber Verbindungsvektoren zwischen den Punkten, hier ausgehend vom Stützpunkt <Formel tex="B" nach="." /></>),
            ],
            2,
          )}
          erklaerung={
            <p>
              Für die Ebene durch drei Punkte nimmst du einen Punkt als Stützpunkt und die beiden Verbindungsvektoren zu den anderen Punkten als Spannvektoren: <Formel tex={t`\overrightarrow{AB}=(1\,|\,2\,|\,2)`} /> und <Formel tex={t`\overrightarrow{AC}=(-1\,|\,3\,|\,1)`} nach="." /> Die drei Punkte dürfen nicht auf einer Geraden liegen.
            </p>
          }
        >
          <p>
            Welche Parameterform beschreibt die Ebene durch die Punkte {P('A', K26.A, '')} {P('B', K26.B, '')} und {P('C', K26.C, '?')}
          </p>
        </Kontrollfrage>
        <Kontrolle
          aussage="parameterform"
          teil="b"
          nummer="K26b"
          titel="Parameterform aus Gerade und Punkt, Teil b"
          felder={koordFelder('v', 'zweiter Spannvektor', K26.zweiter, (i) => `v_${i + 1}`)}
          hilfen={[
            <>Als Stützvektor nimmst du den Stützvektor der Geraden, als ersten Spannvektor ihren Richtungsvektor. Der zweite Spannvektor verbindet einen Punkt der Geraden mit <Formel tex="P" nach="." /></>,
            <>Nimm als Punkt der Geraden den Stützpunkt: Der zweite Spannvektor geht von {P('G', K26.g.p, '')} nach <Formel tex="P" nach="." /></>,
          ]}
          loesung={[
            <>Der zweite Spannvektor ist <Formel tex={t`\overrightarrow{GP}=(3-1\,|\,4-0\,|\,5-2)`} nach="," /> also {V(K26.zweiter, '.')}</>,
            <>Die Ebene hat die Gleichung <Formel tex={pf('E', { p: K26.g.p, u: K26.g.u, v: K26.zweiter })} nach="." /> Die beiden Spannvektoren sind keine Vielfachen voneinander, <Formel tex="P" /> liegt also nicht auf der Geraden.</>,
          ]}
        >
          <p>
            Die Ebene <Formel tex="E" /> wird von der Geraden <Formel tex={gl('g', K26.g.p, K26.g.u)} /> und dem Punkt {P('P', K26.P, '')} aufgespannt. Als Stützvektor von <Formel tex="E" /> dient der Stützvektor von <Formel tex="g" nach="," /> als erster Spannvektor der Richtungsvektor von <Formel tex="g" nach="." /> Bestimme den zweiten Spannvektor, der vom Stützpunkt von <Formel tex="g" /> nach <Formel tex="P" /> führt.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="koordinatenform">
        <Kontrolle
          aussage="koordinatenform"
          teil="a"
          nummer="K27a"
          titel="Koordinatenform aus Punkt und Normalenvektor, Teil a"
          felder={[{ id: 'd', name: 'Zahl d auf der rechten Seite', beschriftung: <Formel tex="d" />, erwartet: K27.a.d }]}
          hilfen={[
            <>Die Koordinatenform lautet <Formel tex={t`n_1x_1+n_2x_2+n_3x_3=d`} nach="." /> Die Koeffizienten sind die Koordinaten des Normalenvektors.</>,
            <>Die Zahl <Formel tex="d" /> bekommst du, indem du den Punkt <Formel tex="P" /> einsetzt, also mit dem Skalarprodukt <Formel tex={t`\vec n\cdot\overrightarrow{OP}`} nach="." /></>,
          ]}
          loesung={[
            <>Die Gleichung lautet <Formel tex={t`2x_1-x_2+3x_3=d`} nach="." /></>,
            <>Einsetzen von {P('P', K27.a.P, '')}: <Formel tex={t`d=2\cdot 1-2+3\cdot(-1)=-3`} nach="." /> Also {KF(K27.a.n, K27.a.d, 'E', '.')}</>,
          ]}
        >
          <p>
            Die Ebene <Formel tex="E" /> verläuft durch den Punkt {P('P', K27.a.P, '')} und hat den Normalenvektor {V(K27.a.n, '.')} Ergänze die Koordinatenform <Formel tex={t`E:\ 2x_1-x_2+3x_3=d`} nach="." />
          </p>
        </Kontrolle>
        <Kontrolle
          aussage="koordinatenform"
          teil="b"
          nummer="K27b"
          titel="Koordinatenform aus drei Punkten, Teil b"
          felder={[...koordFelder('n', 'Normalenvektor', K27.b.n, (i) => `n_${i + 1}`), { id: 'd', name: 'Zahl d auf der rechten Seite', beschriftung: <Formel tex="d" />, erwartet: K27.b.d }]}
          hilfen={[
            <>Bestimme zwei Verbindungsvektoren und daraus mit dem Vektorprodukt (Kreuzprodukt) einen Normalenvektor. Kürze ihn auf ganze Zahlen ohne gemeinsamen Teiler und mache die erste Koordinate positiv.</>,
            <>Setze dann einen der Punkte in <Formel tex={t`n_1x_1+n_2x_2+n_3x_3=d`} /> ein, um <Formel tex="d" /> zu erhalten.</>,
          ]}
          loesung={[
            <><Formel tex={t`\overrightarrow{AB}=(2\,|\,0\,|\,1)`} /> und <Formel tex={t`\overrightarrow{AC}=(-1\,|\,1\,|\,2)`} nach="." /> Das Vektorprodukt (Kreuzprodukt) ist <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}=(-1\,|\,-5\,|\,2)`} nach="." /></>,
            <>Mit dem Faktor <Formel tex="-1" /> erhältst du {V(K27.b.n, '.')} Einsetzen von {P('A', K27.b.A, '')}: <Formel tex={t`d=1+5\cdot 2-2\cdot 0=11`} nach="." /> Also {KF(K27.b.n, K27.b.d, 'E', '.')}</>,
            <>Probe mit <Formel tex="B" nach=":" /> <Formel tex={t`3+10-2=11`} nach="." /> Probe mit <Formel tex="C" nach=":" /> <Formel tex={t`0+15-4=11`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme eine Koordinatenform der Ebene durch die Punkte {P('A', K27.b.A, '')} {P('B', K27.b.B, '')} und {P('C', K27.b.C, '.')} Gib den Normalenvektor mit ganzen Zahlen ohne gemeinsamen Teiler und positiver erster Koordinate an, dazu die Zahl <Formel tex="d" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="achsenabschnitte">
        <Kontrolle
          aussage="achsenabschnitte"
          nummer="K41"
          titel="Achsenabschnittsform"
          felder={koordFelder('n', 'Koeffizient', K41.n, (i) => `n_${i + 1}`)}
          hilfen={[
            <>Die Achsenabschnittsform einer Ebene mit den Achsenabschnitten <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> lautet <Formel tex={t`\frac{x_1}{a}+\frac{x_2}{b}+\frac{x_3}{c}=1`} nach="." /></>,
            <>Multipliziere die Gleichung mit dem kleinsten gemeinsamen Vielfachen der Beträge von <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" nach="," /> das ist hier 12, damit keine Brüche übrig bleiben.</>,
          ]}
          loesung={[
            <>Achsenabschnittsform: <Formel tex={t`\frac{x_1}{4}+\frac{x_2}{-2}+\frac{x_3}{3}=1`} nach="." /> Die Spurpunkte sind {P('S_1', [4, 0, 0], '')} {P('S_2', [0, -2, 0], '')} und {P('S_3', [0, 0, 3], '.')}</>,
            <>Mal 12: <Formel tex={t`3x_1-6x_2+4x_3=12`} nach="." /> Probe mit <Formel tex="S_2" nach=":" /> <Formel tex={t`-6\cdot(-2)=12`} nach="." /></>,
          ]}
        >
          <p>
            Eine Ebene schneidet die Koordinatenachsen bei <Formel tex={t`x_1=4`} nach="," /> bei <Formel tex={t`x_2=-2`} /> und bei <Formel tex={t`x_3=3`} nach="." /> Stelle ihre Gleichung in Achsenabschnittsform auf und multipliziere sie mit 12. Trage die Koeffizienten <Formel tex={t`n_1`} nach="," /> <Formel tex={t`n_2`} /> und <Formel tex={t`n_3`} /> der Gleichung <Formel tex={t`n_1x_1+n_2x_2+n_3x_3=12`} /> ein.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="formwechsel">
        <Kontrolle
          aussage="formwechsel"
          teil="a"
          nummer="K28a"
          titel="Von der Parameterform zur Koordinatenform, Teil a"
          felder={[
            { id: 'n1', name: 'Koeffizient von x1', beschriftung: <Formel tex="n_1" />, erwartet: K28.a.n[0]! },
            { id: 'n2', name: 'Koeffizient von x2', beschriftung: <Formel tex="n_2" />, erwartet: K28.a.n[1]! },
            { id: 'd', name: 'Zahl d auf der rechten Seite', beschriftung: <Formel tex="d" />, erwartet: K28.a.d },
          ]}
          hilfen={[
            <>Der Normalenvektor ist das Vektorprodukt (Kreuzprodukt) der beiden Spannvektoren. Seine Koordinaten sind die Koeffizienten der Koordinatenform.</>,
            <>Die Zahl <Formel tex="d" /> erhältst du, indem du den Stützvektor einsetzt: <Formel tex={t`d=\vec n\cdot\vec p`} nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={t`\vec n=\vec u\times\vec v=(1\,|\,2\,|\,0)\times(0\,|\,1\,|\,3)=(6\,|\,-3\,|\,1)`} nach="." /> Probe mit beiden Skalarprodukten: <Formel tex={t`6-6+0=0`} /> und <Formel tex={t`0-3+3=0`} nach="." /></>,
            <><Formel tex={t`d=\vec n\cdot\vec p=6\cdot 1-3\cdot 0+1\cdot 2=8`} nach="." /> Also {KF(K28.a.n, K28.a.d, 'E', '.')}</>,
          ]}
        >
          <p>
            Die Ebene <Formel tex={pf('E', K28.a)} /> soll in Koordinatenform <Formel tex={t`n_1x_1+n_2x_2+x_3=d`} /> angegeben werden. Bestimme <Formel tex={t`n_1`} nach="," /> <Formel tex={t`n_2`} /> und <Formel tex="d" nach="." />
          </p>
        </Kontrolle>
        <Kontrollfrage
          aussage="formwechsel"
          teil="b"
          nummer="K28b"
          titel="Von der Koordinatenform zur Parameterform, Teil b"
          optionen={platziere(
            [
              opt('a', <Formel tex={pf('F', K28.b.optionen.a)} />, false, <>Der zweite Spannvektor ist der Normalenvektor <Formel tex={t`(2\,|\,1\,|\,-1)`} nach="." /> Der Normalenvektor steht senkrecht auf der Ebene und kann kein Spannvektor sein: <Formel tex={t`\vec n\cdot\vec v=4+1+1=6\ne 0`} nach="." /></>),
              opt('b', <Formel tex={pf('F', K28.b.optionen.b)} />, false, <>Der Stützpunkt {P('Q', [1, 1, 1], '')} liegt nicht in <Formel tex="F" nach=":" /> <Formel tex={t`2+1-1=2\ne 4`} nach="." /></>),
              opt('c', <Formel tex={pf('F', K28.b.optionen.c)} />, true, <>Richtig.</>),
              opt('d', <Formel tex={pf('F', K28.b.optionen.d)} />, false, <>Der erste Spannvektor <Formel tex={t`(1\,|\,2\,|\,0)`} /> ist nicht orthogonal zu <Formel tex={t`\vec n`} nach=":" /> <Formel tex={t`2+2+0=4\ne 0`} nach="." /> Er liegt nicht in der Ebene.</>),
            ],
            3,
          )}
          erklaerung={
            <p>
              Von der Koordinatenform <Formel tex={t`2x_1+x_2-x_3=4`} /> zur Parameterform: Du brauchst einen Punkt der Ebene, zum Beispiel <Formel tex={t`(2\,|\,0\,|\,0)`} nach="," /> und zwei Vektoren, die zum Normalenvektor <Formel tex={t`(2\,|\,1\,|\,-1)`} /> orthogonal und keine Vielfachen voneinander sind. Das Skalarprodukt muss jeweils 0 sein: <Formel tex={t`2-2+0=0`} /> und <Formel tex={t`2+0-2=0`} nach="." />
            </p>
          }
        >
          <p>
            Welche Parameterform gehört zur Ebene <Formel tex={t`F:\ 2x_1+x_2-x_3=4`} nach="?" />
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="punktprobe-ebene">
        <Kontrollfrage
          aussage="punktprobe-ebene"
          nummer="K29"
          titel="Punkt in einer Ebene"
          optionen={platziere(
            [
              opt('a', <>nur in <Formel tex="E" /></>, true, <>Richtig.</>),
              opt('b', <>nur in <Formel tex="F" /></>, false, <>In <Formel tex="E" /> gilt: <Formel tex={t`2\cdot 3-1+0=5`} nach="." /> Der Punkt liegt in <Formel tex="E" nach="." /> In <Formel tex="F" /> passt die dritte Zeile nicht, der Punkt liegt dort nicht.</>),
              opt('c', <>in beiden Ebenen</>, false, <>In <Formel tex="F" /> liegt der Punkt nicht. Aus der ersten Zeile folgt <Formel tex="r=2" nach="," /> aus der zweiten <Formel tex="s=-4" nach="." /> Dann ist die dritte Zeile <Formel tex={t`2-(-4)=6`} nach="," /> es müsste aber <Formel tex="0" /> herauskommen.</>),
              opt('d', <>in keiner der beiden Ebenen</>, false, <>Die Punktprobe mit der Koordinatenform stimmt: <Formel tex={t`2\cdot 3-1+0=5`} nach="." /> Der Punkt liegt in <Formel tex="E" nach="." /></>),
            ],
            0,
          )}
          erklaerung={
            <p>
              Bei der Koordinatenform setzt du den Punkt ein und prüfst die Gleichung. Bei der Parameterform stellst du <Formel tex={t`\overrightarrow{OP}=\vec p+r\vec u+s\vec v`} /> als Gleichungssystem auf: Aus <Formel tex={t`\overrightarrow{FP}=(2\,|\,0\,|\,-2)`} /> folgt <Formel tex="r=2" /> und <Formel tex="s=-4" nach="," /> dann gilt die dritte Zeile nicht. Der Punkt liegt nur in <Formel tex="E" nach="." />
            </p>
          }
        >
          <p>
            Liegt der Punkt {P('P', K29.P, '')} in der Ebene <Formel tex={t`E:\ 2x_1-x_2+x_3=5`} nach="," /> in der Ebene <Formel tex={pf('F', K29.F)} /> oder in beiden?
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="punkt-im-vieleck">
        <Kontrolle
          aussage="punkt-im-vieleck"
          teil="a"
          nummer="K30a"
          titel="Punkt im Parallelogramm, Teil a"
          felder={[
            { id: 'r', name: 'Faktor r', beschriftung: <Formel tex="r" />, erwartet: K30.r },
            { id: 's', name: 'Faktor s', beschriftung: <Formel tex="s" />, erwartet: K30.s },
          ]}
          hilfen={[
            <>Stelle <Formel tex={t`\overrightarrow{AP}=r\cdot\overrightarrow{AB}+s\cdot\overrightarrow{AC}`} /> als Gleichungssystem auf.</>,
            <>Die zweite Zeile von <Formel tex={t`\overrightarrow{AB}`} /> ist 0, daher liefert sie sofort <Formel tex="s" nach="." /> Aus der ersten Zeile folgt dann <Formel tex="r" nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={t`\overrightarrow{AB}=(4\,|\,0\,|\,-4)`} nach="," /> <Formel tex={t`\overrightarrow{AC}=(2\,|\,4\,|\,2)`} nach="," /> <Formel tex={t`\overrightarrow{AP}=(4\,|\,2\,|\,-2)`} nach="." /></>,
            <>Zweite Zeile: <Formel tex={t`2=4s`} nach="," /> also <Formel tex={t`s=\frac{1}{2}`} nach="." /> Erste Zeile: <Formel tex={t`4=4r+2\cdot\frac{1}{2}`} nach="," /> also <Formel tex={t`r=\frac{3}{4}`} nach="." /></>,
            <>Probe mit der dritten Zeile: <Formel tex={t`\frac{3}{4}\cdot(-4)+\frac{1}{2}\cdot 2=-3+1=-2`} nach="." /> Sie stimmt.</>,
          ]}
        >
          <p>
            Gegeben sind {P('A', K30.A, '')} {P('B', K30.B, '')} {P('C', K30.C, '')} und {P('P', K30.P, '.')} Die vier Punkte liegen in einer Ebene. Bestimme <Formel tex="r" /> und <Formel tex="s" /> mit <Formel tex={t`\overrightarrow{OP}=\overrightarrow{OA}+r\cdot\overrightarrow{AB}+s\cdot\overrightarrow{AC}`} nach="." />
          </p>
        </Kontrolle>
        <Kontrollfrage
          aussage="punkt-im-vieleck"
          teil="b"
          nummer="K30b"
          titel="Punkt im Parallelogramm, Teil b"
          optionen={platziere(
            [
              opt('a', <>im Parallelogramm und im Dreieck</>, false, <>Für das Dreieck muss zusätzlich <Formel tex={t`r+s\le 1`} /> gelten. Hier ist <Formel tex={t`r+s=\frac{5}{4}`} nach="," /> der Punkt liegt außerhalb des Dreiecks.</>),
              opt('b', <>im Parallelogramm, aber nicht im Dreieck</>, true, <>Richtig.</>),
              opt('c', <>im Dreieck, aber nicht im Parallelogramm</>, false, <>Das Dreieck <Formel tex="ABC" /> ist die Hälfte des Parallelogramms und liegt ganz darin. Ein Punkt im Dreieck liegt also immer auch im Parallelogramm.</>),
              opt('d', <>weder im Parallelogramm noch im Dreieck</>, false, <>Für das Parallelogramm müssen <Formel tex="r" /> und <Formel tex="s" /> beide zwischen 0 und 1 liegen. Das ist hier der Fall: <Formel tex={t`r=\frac{3}{4}`} /> und <Formel tex={t`s=\frac{1}{2}`} nach="." /></>),
            ],
            3,
          )}
          erklaerung={
            <p>
              Ein Punkt <Formel tex={t`P=A+r\overrightarrow{AB}+s\overrightarrow{AC}`} /> liegt im Parallelogramm, wenn <Formel tex={t`0\le r\le 1`} /> und <Formel tex={t`0\le s\le 1`} /> gilt. Er liegt im Dreieck <Formel tex="ABC" nach="," /> wenn zusätzlich <Formel tex={t`r+s\le 1`} /> gilt. Mit <Formel tex={t`r=\frac{3}{4}`} /> und <Formel tex={t`s=\frac{1}{2}`} /> ist die erste Bedingung erfüllt, die zweite nicht (<Formel tex={t`\frac{5}{4}>1`} nach=")." />
            </p>
          }
        >
          <p>
            Liegt der Punkt <Formel tex="P" /> innerhalb des Parallelogramms, das von <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> aufgespannt wird, oder innerhalb des Dreiecks <Formel tex="ABC" nach="?" />
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="spurpunkte-ebene">
        <Kontrolle
          aussage="spurpunkte-ebene"
          nummer="K31"
          titel="Spurpunkte einer Ebene"
          felder={[
            { id: 's1', name: 'Spurpunkt S1, Koordinate x1', beschriftung: <Formel tex="S_1:\ x_1" />, erwartet: K31.x1 },
            { id: 's2', name: 'Spurpunkt S2, Koordinate x2', beschriftung: <Formel tex="S_2:\ x_2" />, erwartet: K31.x2 },
            { id: 's3', name: 'Spurpunkt S3, Koordinate x3', beschriftung: <Formel tex="S_3:\ x_3" />, erwartet: K31.x3 },
          ]}
          hilfen={[
            <>Die Spurpunkte einer Ebene sind ihre Schnittpunkte mit den Koordinatenachsen. Auf der <Formel tex="x_1" />-Achse sind <Formel tex={t`x_2=0`} /> und <Formel tex={t`x_3=0`} nach="." /></>,
            <>Setze in der Gleichung die beiden anderen Koordinaten gleich 0 und löse nach der verbleibenden auf.</>,
          ]}
          loesung={[
            <><Formel tex="S_1" nach=":" /> <Formel tex={t`2x_1=12`} nach="," /> also <Formel tex="x_1=6" nach="." /> <Formel tex="S_2" nach=":" /> <Formel tex={t`-3x_2=12`} nach="," /> also <Formel tex="x_2=-4" nach="." /></>,
            <><Formel tex="S_3" nach=":" /> <Formel tex={t`4x_3=12`} nach="," /> also <Formel tex="x_3=3" nach="." /> Die Spurpunkte sind {P('S_1', [6, 0, 0], '')} {P('S_2', [0, -4, 0], '')} und {P('S_3', [0, 0, 3], '.')}</>,
          ]}
        >
          <p>
            Bestimme die Spurpunkte der Ebene {KF(K31.k.n, K31.k.d, 'E', '.')} Die beiden Koordinaten, die 0 sind, musst du nicht eingeben.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="ebene-zeichnen">
        <Kontrollfrage
          aussage="ebene-zeichnen"
          nummer="K32"
          titel="Eine Ebene zeichnen"
          optionen={platziere(
            [
              opt('a', <>Die Spurpunkte sind {P('S_1', K32.S1)} {P('S_2', K32.S2)} und {P('S_3', K32.S3, '.')} Die Spurgerade <Formel tex="s_{12}" /> verbindet <Formel tex="S_1" /> mit <Formel tex="S_2" nach="," /> die Spurgerade <Formel tex="s_{13}" /> verbindet <Formel tex="S_1" /> mit <Formel tex="S_3" nach="," /> und <Formel tex="s_{23}" /> verbindet <Formel tex="S_2" /> mit <Formel tex="S_3" nach="." /></>, true, <>Richtig.</>),
              opt('b', <>Die Spurpunkte sind {P('S_1', [4, 0, 0])} {P('S_2', [0, 6, 0])} und {P('S_3', [0, 0, 3], '.')} Die Spurgeraden verbinden je zwei Spurpunkte.</>, false, <>Hier stehen die Koeffizienten 4, 6 und 3 als Koordinaten der Spurpunkte. Die Koordinate eines Spurpunkts ist aber <Formel tex={t`d`} /> geteilt durch den Koeffizienten, zum Beispiel <Formel tex={t`12:4=3`} nach="." /></>),
              opt('c', <>Die Spurpunkte sind {P('S_1', K32.S1)} {P('S_2', K32.S2)} und {P('S_3', K32.S3, '.')} Die Spurgerade <Formel tex="s_{12}" /> verbindet <Formel tex="S_1" /> mit <Formel tex="S_3" nach="." /></>, false, <>Die Spurgerade <Formel tex="s_{12}" /> liegt in der <Formel tex="x_1x_2" />-Ebene. <Formel tex="S_3" /> liegt auf der <Formel tex="x_3" />-Achse und gehört nicht zu dieser Ebene. Die Spurgerade <Formel tex="s_{12}" /> verbindet <Formel tex="S_1" /> und <Formel tex="S_2" nach="." /></>),
              opt('d', <>Die Spurpunkte sind {P('S_1', [12, 0, 0])} {P('S_2', [0, 12, 0])} und {P('S_3', [0, 0, 12], '.')} Die Spurgeraden verbinden je zwei Spurpunkte.</>, false, <>Hier ist die Zahl 12 auf der rechten Seite als Koordinate aller drei Spurpunkte eingesetzt. Du musst aber die Gleichung nach der jeweiligen Koordinate auflösen, zum Beispiel <Formel tex={t`4x_1=12`} nach="." /></>),
            ],
            1,
          )}
          erklaerung={
            <>
              <p>
                Für <Formel tex={t`4x_1=12`} /> mit <Formel tex={t`x_2=x_3=0`} /> ist <Formel tex="x_1=3" nach="." /> Ebenso <Formel tex={t`6x_2=12`} /> also <Formel tex="x_2=2" /> und <Formel tex={t`3x_3=12`} /> also <Formel tex="x_3=4" nach="." /> Du zeichnest die drei Spurpunkte auf den Achsen und verbindest je zwei von ihnen: Das sind die Spurgeraden, die Seiten des Spurdreiecks.
              </p>
              <KontrollFigur spec={BILD_K32} unter={<>Die Ebene mit den Spurpunkten <Formel tex="S_1" nach="," /> <Formel tex="S_2" /> und <Formel tex="S_3" nach="." /> Die Seiten des Dreiecks sind die Spurgeraden, blau in der <Formel tex="x_1x_2" />-Ebene, grün in der <Formel tex="x_1x_3" />-Ebene und gelb in der <Formel tex="x_2x_3" />-Ebene.</>} />
            </>
          }
        >
          <p>
            Du sollst die Ebene {KF(K32.k.n, K32.k.d, 'G')} im Schrägbild zeichnen. Was ist richtig?
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="spurgeraden">
        <Kontrolle
          aussage="spurgeraden"
          nummer="K42"
          titel="Spurgerade einer Ebene"
          felder={[
            { id: 'u1', name: 'Richtungsvektor, Koordinate x1', beschriftung: <Formel tex="u_1" />, erwartet: K42.u1 },
            { id: 'u2', name: 'Richtungsvektor, Koordinate x2', beschriftung: <Formel tex="u_2" />, erwartet: K42.u2 },
          ]}
          hilfen={[
            <>Die Spurgerade <Formel tex="s_{12}" /> ist die Schnittgerade der Ebene mit der <Formel tex="x_1x_2" />-Ebene. Dort ist <Formel tex={t`x_3=0`} nach="." /></>,
            <>Setzt du <Formel tex={t`x_3=0`} /> in die Koordinatenform ein, bleibt eine Gleichung in <Formel tex="x_1" /> und <Formel tex="x_2" nach="." /> Zwei Punkte dieser Geraden sind die Spurpunkte auf den Achsen <Formel tex="x_1" /> und <Formel tex="x_2" nach="." /></>,
          ]}
          loesung={[
            <>Mit <Formel tex={t`x_3=0`} /> entsteht <Formel tex={t`3x_1+2x_2=6`} nach="." /> Die Spurpunkte sind {P('S_1', [2, 0, 0], '')} und {P('S_2', [0, 3, 0], '.')}</>,
            <>Der Verbindungsvektor ist <Formel tex={t`\overrightarrow{S_2S_1}=(2\,|\,-3\,|\,0)`} nach="." /> Die Spurgerade ist <Formel tex={t`s_{12}:\ \vec x=(2\,|\,0\,|\,0)+t\cdot(2\,|\,-3\,|\,0)`} nach="." /></>,
          ]}
        >
          <p>
            Gegeben ist die Ebene {KF(K42.k.n, K42.k.d, 'H', '.')} Die Spurgerade <Formel tex="s_{12}" /> in der <Formel tex="x_1x_2" />-Ebene hat einen Richtungsvektor <Formel tex={t`(u_1\,|\,u_2\,|\,0)`} nach="." /> Bestimme ihn mit ganzen Zahlen ohne gemeinsamen Teiler und <Formel tex={t`u_1>0`} nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="besondere-lage-ebene">
        <Kontrollfrage
          aussage="besondere-lage-ebene"
          nummer="K33"
          titel="Besondere Lage einer Ebene"
          optionen={platziere(
            [
              opt('a', <Formel tex={koordinatenformTeX(K33.ebenen.a.n, K33.ebenen.a.d, 'E_1')} />, false, <>Diese Ebene ist parallel zur <Formel tex="x_3" />-Achse, weil <Formel tex={t`x_3`} /> nicht vorkommt. Sie enthält die Achse aber nicht: Der Punkt <Formel tex={t`(0\,|\,0\,|\,0)`} /> erfüllt <Formel tex={t`2x_1-x_2=4`} /> nicht.</>),
              opt('b', <Formel tex={koordinatenformTeX(K33.ebenen.b.n, K33.ebenen.b.d, 'E_2')} />, false, <>Die Ebene geht durch den Ursprung, weil <Formel tex={t`d=0`} /> ist. Weil aber alle drei Koeffizienten von null verschieden sind, enthält sie die <Formel tex="x_3" />-Achse nicht: Der Punkt <Formel tex={t`(0\,|\,0\,|\,1)`} /> erfüllt die Gleichung nicht.</>),
              opt('c', <Formel tex={koordinatenformTeX(K33.ebenen.c.n, K33.ebenen.c.d, 'E_3')} />, true, <>Richtig.</>),
              opt('d', <Formel tex={koordinatenformTeX(K33.ebenen.d.n, K33.ebenen.d.d, 'E_4')} />, false, <>Diese Ebene ist parallel zur <Formel tex="x_1x_2" />-Ebene im Abstand 2. Sie schneidet die <Formel tex="x_3" />-Achse im Punkt <Formel tex={t`(0\,|\,0\,|\,2)`} nach="," /> enthält sie aber nicht.</>),
            ],
            2,
          )}
          erklaerung={
            <p>
              Fehlt <Formel tex="x_3" /> in der Gleichung (<Formel tex="n_3=0" nach=")," /> ist die Ebene parallel zur <Formel tex="x_3" />-Achse. Ist zusätzlich <Formel tex="d=0" nach="," /> enthält sie die Achse. Das trifft nur auf <Formel tex={t`2x_1-x_2=0`} /> zu.
            </p>
          }
        >
          <p>
            Welche der vier Ebenen enthält die <Formel tex="x_3" />-Achse?
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="gerade-ebene">
        <Kontrolle
          aussage="gerade-ebene"
          teil="a"
          nummer="K34a"
          titel="Durchstoßpunkt, Teil a"
          felder={koordFelder('s', 'Durchstoßpunkt S', K34.a.S, (i) => `S_${i + 1}`)}
          hilfen={[
            <>Setze die Zeilen der Geradengleichung in die Koordinatenform ein (Geradenprobe). Es entsteht eine Gleichung für <Formel tex="t" nach="." /></>,
            <>Wenn die Gleichung genau eine Lösung hat, schneidet die Gerade die Ebene. Setze den Wert von <Formel tex="t" /> in die Geradengleichung ein.</>,
          ]}
          loesung={[
            <>Einsetzen von <Formel tex={t`x_1=t`} nach="," /> <Formel tex={t`x_2=2+t`} /> und <Formel tex={t`x_3=1+t`} nach=":" /> <Formel tex={t`2t+(2+t)-2(1+t)=6`} nach="." /> Vereinfacht: <Formel tex={t`t=6`} nach="." /></>,
            <>Der Durchstoßpunkt ist {P('S', K34.a.S, '.')} Probe in der Ebene: <Formel tex={t`12+8-14=6`} nach="." /></>,
          ]}
        >
          <p>
            Gegeben sind die Ebene {KF(K34.k.n, K34.k.d, 'E', '')} und die Gerade <Formel tex={gl('g', K34.a.p, K34.a.u)} nach="." /> Die Gerade schneidet die Ebene. Bestimme den Durchstoßpunkt <Formel tex="S" nach="." />
          </p>
        </Kontrolle>
        <Kontrollfrage
          aussage="gerade-ebene"
          teil="b"
          nummer="K34b"
          titel="Lage von Gerade und Ebene, Teil b"
          optionen={platziere(
            [
              opt('a', <>Die Gerade schneidet die Ebene in einem Punkt.</>, false, <>Das Skalarprodukt von Normalenvektor und Richtungsvektor ist <Formel tex={t`2+2-4=0`} nach="." /> Die Gerade verläuft parallel zur Ebene und kann sie nicht in einem Punkt schneiden.</>),
              opt('b', <>Die Gerade liegt in der Ebene.</>, false, <>Der Stützpunkt {P('P', K34.b.p, '')} liegt nicht in der Ebene: <Formel tex={t`2+2-0=4\ne 6`} nach="." /> Die Gerade hat also keinen Punkt mit der Ebene gemeinsam.</>),
              opt('c', <>Die Gerade ist echt parallel zur Ebene.</>, true, <>Richtig.</>),
              opt('d', <>Die Gerade steht senkrecht auf der Ebene.</>, false, <>Senkrecht wäre der Richtungsvektor ein Vielfaches des Normalenvektors. Hier sind <Formel tex={t`(1\,|\,2\,|\,2)`} /> und <Formel tex={t`(2\,|\,1\,|\,-2)`} /> keine Vielfachen, sie sind sogar orthogonal.</>),
            ],
            0,
          )}
          erklaerung={
            <p>
              Der Schnelltest: <Formel tex={t`\vec n\cdot\vec u=2\cdot 1+1\cdot 2+(-2)\cdot 2=0`} nach="." /> Die Gerade verläuft parallel zur Ebene. Dann entscheidet der Stützpunkt: <Formel tex={t`2+2=4`} /> ist nicht 6, er liegt nicht in der Ebene, die Gerade ist also echt parallel.
            </p>
          }
        >
          <p>
            Welche Lage hat die Gerade <Formel tex={gl('h', K34.b.p, K34.b.u)} /> zur Ebene <Formel tex="E" nach="?" />
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="orthogonal-gerade-ebene">
        <Kontrolle
          aussage="orthogonal-gerade-ebene"
          nummer="K43"
          titel="Gerade senkrecht zur Ebene"
          felder={[
            { id: 'a', name: 'Wert von a', beschriftung: <Formel tex="a" />, erwartet: K43.a },
            ...koordFelder('s', 'Durchstoßpunkt S', K43.S, (i) => `S_${i + 1}`),
          ]}
          hilfen={[
            <>Eine Gerade steht senkrecht auf einer Ebene, wenn ihr Richtungsvektor ein Vielfaches des Normalenvektors der Ebene ist.</>,
            <>Bestimme zuerst <Formel tex="a" nach="." /> Den Durchstoßpunkt findest du dann mit der Geradenprobe.</>,
          ]}
          loesung={[
            <>Der Normalenvektor ist {V(K43.k.n, '.')} Der Richtungsvektor <Formel tex={t`(a\,|\,-1\,|\,2)`} /> ist ein Vielfaches davon. Die beiden letzten Zeilen stimmen schon überein, also ist <Formel tex={t`a=2`} nach="." /></>,
            <>Geradenprobe mit <Formel tex={t`x_1=2t`} nach="," /> <Formel tex={t`x_2=2-t`} nach="," /> <Formel tex={t`x_3=-1+2t`} nach=":" /> <Formel tex={t`4t-(2-t)+2(-1+2t)=5`} nach="." /> Das ergibt <Formel tex={t`9t-4=5`} nach="," /> also <Formel tex="t=1" nach="." /></>,
            <>Der Durchstoßpunkt ist {P('S', K43.S, '.')} Weil <Formel tex="g" /> senkrecht auf <Formel tex="E" /> steht, ist der Abstand des Stützpunkts von der Ebene die Länge <Formel tex={t`|\overrightarrow{PS}|`} nach="," /> also <Formel tex={t`\sqrt{4+1+4}=3`} nach="." /></>,
          ]}
        >
          <p>
            Gegeben sind die Ebene {KF(K43.k.n, K43.k.d, 'E', '')} und die Gerade <Formel tex={t`g:\ \vec x=${spalte(K43.p)}+t\cdot\begin{pmatrix}a\\-1\\2\end{pmatrix}`} nach="." /> Für welchen Wert von <Formel tex="a" /> steht <Formel tex="g" /> senkrecht auf <Formel tex="E" nach="?" /> Bestimme für diesen Wert den Durchstoßpunkt <Formel tex="S" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="gegebene-lage-ebene">
        <Kontrolle
          aussage="gegebene-lage-ebene"
          nummer="K44"
          titel="Parallele Gerade mit Parameter"
          felder={[{ id: 'a', name: 'Wert von a', beschriftung: <Formel tex="a" />, erwartet: K44.a }]}
          hilfen={[
            <>Eine Gerade ist echt parallel zu einer Ebene, wenn der Richtungsvektor orthogonal zum Normalenvektor ist und der Stützpunkt nicht in der Ebene liegt.</>,
            <>Setze das Skalarprodukt von Normalenvektor und Richtungsvektor gleich 0 und löse nach <Formel tex="a" /> auf. Prüfe danach den Stützpunkt.</>,
          ]}
          loesung={[
            <><Formel tex={t`\vec n\cdot\vec u=1\cdot 4-2\cdot a+3\cdot 2=10-2a=0`} nach="," /> also <Formel tex="a=5" nach="." /></>,
            <>Stützpunkt {P('P', K44.p, '')} in die Ebene eingesetzt: <Formel tex={t`1-4+0=-3\ne 7`} nach="." /> Er liegt nicht in <Formel tex="E" nach="," /> die Gerade ist also echt parallel.</>,
          ]}
        >
          <p>
            Gegeben sind die Ebene {KF(K44.k.n, K44.k.d, 'E', '')} und die Gerade <Formel tex={t`g:\ \vec x=${spalte(K44.p)}+r\cdot\begin{pmatrix}4\\a\\2\end{pmatrix}`} nach="." /> Für welchen Wert von <Formel tex="a" /> ist <Formel tex="g" /> echt parallel zu <Formel tex="E" nach="?" />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="zwei-ebenen">
        <Kontrollfrage
          aussage="zwei-ebenen"
          teil="a"
          nummer="K35a"
          titel="Lage zweier Ebenen, Teil a"
          optionen={platziere(
            [
              opt('a', <>Die Ebenen sind identisch.</>, false, <>Identische Ebenen haben Normalenvektoren, die Vielfache voneinander sind. Hier sind <Formel tex={t`(1\,|\,1\,|\,2)`} /> und <Formel tex={t`(2\,|\,1\,|\,-1)`} /> keine Vielfachen.</>),
              opt('b', <>Die Ebenen sind echt parallel.</>, false, <>Parallele Ebenen haben Normalenvektoren, die Vielfache voneinander sind. Das ist hier nicht der Fall: Die erste Zeile liefert den Faktor 2, dann müsste die zweite Zeile <Formel tex={t`1\cdot 2=2`} /> sein, es steht dort aber 1.</>),
              opt('c', <>Die Ebenen schneiden sich in einer Geraden.</>, true, <>Richtig.</>),
              opt('d', <>Die Ebenen schneiden sich in einem Punkt.</>, false, <>Zwei Ebenen im Raum schneiden sich nie in nur einem Punkt: Entweder haben sie eine Gerade gemeinsam, keinen Punkt (parallel) oder alle Punkte (identisch).</>),
            ],
            3,
          )}
          erklaerung={
            <p>
              Die Normalenvektoren <Formel tex={t`(1\,|\,1\,|\,2)`} /> und <Formel tex={t`(2\,|\,1\,|\,-1)`} /> sind keine Vielfachen voneinander. Dann sind die Ebenen nicht parallel und schneiden sich in einer Geraden.
            </p>
          }
        >
          <p>
            Untersuche die gegenseitige Lage der Ebenen {KF(K35.a.E.n, K35.a.E.d, 'E', '')} und {KF(K35.a.F.n, K35.a.F.d, 'F', '.')}
          </p>
        </Kontrollfrage>
        <Kontrolle
          aussage="zwei-ebenen"
          teil="b"
          nummer="K35b"
          titel="Parallele Ebenen mit Parameter, Teil b"
          felder={[{ id: 'k', name: 'Wert von k', beschriftung: <Formel tex="k" />, erwartet: K35.b.k }]}
          hilfen={[
            <>Zwei Ebenen sind parallel, wenn die Normalenvektoren Vielfache voneinander sind. Bestimme den Faktor aus einer Zeile ohne Unbekannte.</>,
            <>Mit diesem Faktor findest du <Formel tex="k" nach="." /> Prüfe danach, dass die Ebenen nicht identisch sind: Dann muss auch die rechte Seite im selben Verhältnis stehen.</>,
          ]}
          loesung={[
            <>Die Normalenvektoren sind <Formel tex={t`(2\,|\,k\,|\,-4)`} /> und <Formel tex={t`(1\,|\,-3\,|\,-2)`} nach="." /> Die erste Zeile liefert den Faktor 2, die dritte Zeile bestätigt ihn: <Formel tex={t`2\cdot(-2)=-4`} nach="." /></>,
            <>Zweite Zeile: <Formel tex={t`k=2\cdot(-3)=-6`} nach="." /> Die rechten Seiten: <Formel tex={t`2\cdot 1=2\ne 3`} nach="." /> Die Ebenen sind echt parallel.</>,
          ]}
        >
          <p>
            Gegeben sind die Ebenen <Formel tex={t`E:\ 2x_1+kx_2-4x_3=3`} /> und {KF(K35.b.F.n, K35.b.F.d, 'F', '.')} Für welchen Wert von <Formel tex="k" /> sind <Formel tex="E" /> und <Formel tex="F" /> echt parallel?
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="abstand-punkt-ebene">
        <Kontrolle
          aussage="abstand-punkt-ebene"
          teil="a"
          nummer="K36a"
          titel="Abstand mit Lotfußpunkt, Teil a"
          felder={[...koordFelder('f', 'Lotfußpunkt F', K36.F, (i) => `F_${i + 1}`), { id: 'd', name: 'Abstand', beschriftung: <Formel tex="d" />, erwartet: K36.dQ }]}
          hilfen={[
            <>Stelle die Lotgerade durch <Formel tex="Q" /> mit dem Normalenvektor der Ebene als Richtungsvektor auf. Ihr Schnittpunkt mit der Ebene ist der Lotfußpunkt <Formel tex="F" nach="." /></>,
            <>Setze die Lotgerade in die Koordinatenform ein, löse nach <Formel tex="t" /> auf und berechne <Formel tex="F" nach="." /> Der Abstand ist die Länge von <Formel tex={t`\overrightarrow{QF}`} nach="." /></>,
          ]}
          loesung={[
            <>Lotgerade: <Formel tex={t`\vec x=(4\,|\,2\,|\,0)+t\cdot(2\,|\,2\,|\,-1)`} nach="." /> In der Ebene: <Formel tex={t`2(4+2t)+2(2+2t)-(-t)=3`} nach="," /> also <Formel tex={t`12+9t=3`} /> und <Formel tex="t=-1" nach="." /></>,
            <>Lotfußpunkt: {P('F', K36.F, '.')} Der Vektor <Formel tex={t`\overrightarrow{QF}`} /> ist {V([-2, -2, 1], '')} mit der Länge <Formel tex={t`\sqrt{4+4+1}=3`} nach="." /> Der Abstand ist <Formel tex="d=3" nach="." /></>,
          ]}
        >
          <p>
            Gegeben sind die Ebene {KF(K36.k.n, K36.k.d, 'E', '')} und der Punkt {P('Q', K36.Q, '.')} Bestimme mit dem Lotfußpunktverfahren den Lotfußpunkt <Formel tex="F" /> und den Abstand <Formel tex="d" /> des Punktes <Formel tex="Q" /> von der Ebene.
          </p>
        </Kontrolle>
        <Kontrolle
          aussage="abstand-punkt-ebene"
          teil="b"
          nummer="K36b"
          titel="Abstand mit der Abstandsformel, Teil b"
          felder={[{ id: 'd', name: 'Abstand', beschriftung: <Formel tex="d" />, erwartet: K36.dR, toleranz: TOL2 }]}
          hilfen={[
            <>Die Abstandsformel für die Koordinatenform lautet <Formel tex={t`d=\frac{|n_1q_1+n_2q_2+n_3q_3-b|}{|\vec n|}`} nach="," /> wobei <Formel tex="b" /> die rechte Seite der Ebenengleichung ist.</>,
            <>Berechne zuerst den Zähler und die Länge des Normalenvektors. Runde auf zwei Nachkommastellen.</>,
          ]}
          loesung={[
            <>Zähler: <Formel tex={t`|2\cdot 1+2\cdot(-2)-5-3|=|-10|=10`} nach="." /> Nenner: <Formel tex={t`|\vec n|=\sqrt{4+4+1}=3`} nach="." /></>,
            <>Abstand: <Formel tex={t`d=\frac{10}{3}\approx 3{,}33`} nach="." /></>,
          ]}
        >
          <p>
            Berechne mit der Abstandsformel den Abstand des Punktes {P('R', K36.R, '')} von der Ebene <Formel tex="E" /> von oben. Runde auf zwei Nachkommastellen.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="punkt-mit-abstand">
        <Kontrolle
          aussage="punkt-mit-abstand"
          nummer="K37"
          titel="Ein Punkt mit gegebenem Abstand zur Ebene"
          felder={koordFelder('q', 'Punkt Q', K37.Q, (i) => `Q_${i + 1}`)}
          hilfen={[
            <>Gehe vom Punkt <Formel tex="P" /> aus senkrecht von der Ebene weg, also in Richtung des Normalenvektors. Der Normalenvektor <Formel tex={t`\vec n`} /> hat hier die Länge 3.</>,
            <>Der Abstand ist 3, also genau eine Länge des Normalenvektors: <Formel tex={t`\overrightarrow{OQ}=\overrightarrow{OP}+t\cdot\vec n`} /> mit <Formel tex="t=1" nach="." /></>,
          ]}
          loesung={[
            <>Mit <Formel tex={t`|\vec n|=\sqrt{1+4+4}=3`} /> hat jeder Punkt <Formel tex={t`P+t\vec n`} /> den Abstand <Formel tex={t`3|t|`} /> von der Ebene. Für den Abstand 3 ist <Formel tex={t`t=\pm 1`} nach="." /></>,
            <>Mit <Formel tex="t=1" nach=":" /> {V(K37.P, '')} plus {V(K37.k.n, '')} gleich {V(K37.Q, '.')} Also {P('Q', K37.Q, '.')} Probe: <Formel tex={t`\frac{|2+8+4-5|}{3}=\frac{9}{3}=3`} nach="." /> (Mit <Formel tex={t`t=-1`} /> entsteht {P('Q', [0, 0, -2], '')} auf der anderen Seite der Ebene.)</>,
          ]}
        >
          <p>
            Der Punkt {P('P', K37.P, '')} liegt in der Ebene {KF(K37.k.n, K37.k.d, 'E', '.')} Bestimme den Punkt <Formel tex="Q" nach="," /> der vom Lot durch <Formel tex="P" /> in Richtung des Normalenvektors liegt und von <Formel tex="E" /> den Abstand 3 hat.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="spiegelung-ebene">
        <Kontrolle
          aussage="spiegelung-ebene"
          nummer="K38"
          titel="Spiegeln an einer Ebene"
          felder={koordFelder('s', "Spiegelpunkt Q'", K38.Q2, (i) => `Q'_${i + 1}`)}
          hilfen={[
            <>Bestimme den Lotfußpunkt <Formel tex="F" /> von <Formel tex="Q" /> auf der Ebene. Er ist der Mittelpunkt der Strecke von <Formel tex="Q" /> zum Spiegelpunkt <Formel tex={t`Q'`} nach="." /></>,
            <>Du gehst also von <Formel tex="Q" /> aus doppelt so weit wie bis zum Lotfußpunkt: <Formel tex={t`\overrightarrow{OQ'}=\overrightarrow{OQ}+2\cdot\overrightarrow{QF}`} nach="." /></>,
          ]}
          loesung={[
            <>Lotgerade: <Formel tex={t`\vec x=(3\,|\,1\,|\,2)+t\cdot(2\,|\,1\,|\,2)`} nach="." /> In der Ebene: <Formel tex={t`2(3+2t)+(1+t)+2(2+2t)=2`} nach="," /> also <Formel tex={t`11+9t=2`} /> und <Formel tex="t=-1" nach="." /></>,
            <>Lotfußpunkt: {P('F', [1, 0, 0], '.')} Spiegelpunkt mit <Formel tex={t`t=-2`} nach=":" /> {V(K38.Q, '')} minus {V([4, 2, 4], '')} gleich {V(K38.Q2, '.')} Also {P("Q'", K38.Q2, '.')}</>,
          ]}
        >
          <p>
            Spiegle den Punkt {P('Q', K38.Q, '')} an der Ebene {KF(K38.k.n, K38.k.d, 'E', '.')} Bestimme den Spiegelpunkt <Formel tex={t`Q'`} nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <EbenenZwei />
    </Abschnitt>
  );
}
