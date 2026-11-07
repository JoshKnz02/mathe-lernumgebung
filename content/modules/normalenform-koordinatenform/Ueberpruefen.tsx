import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import type { Ebene } from '@/lib/ebene';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { aufgNormalenvektor } from './Bilder';
import { A_AUSWAHL, A_AUSWAHL_PARAMETER, A_NORMALENVEKTOR, A_PARAMETER_A, A_PUNKT_NORMAL, A_RUECK, A_UMWANDELN } from './daten';
import { gleichungE, gleichungESchmal, koordinatenformTeX, kreuzSpalte, kreuzSpalteKurz, punktTeX, spalte } from './rechenhilfen';

const sp = spalte;
const koordFelder = (praefix: string, werte: number[], wort: string): Feld[] =>
  werte.map((x, i) => ({ id: `${praefix}${i + 1}`, name: `${i + 1}. Koordinate von ${wort}`, beschriftung: <>{i + 1}. Koordinate</>, erwartet: x }));
const eg = (e: Ebene) => t`${gleichungE(e)}`;
const kf = (k: { n: number[]; d: number }) => <Formel tex={koordinatenformTeX(k.n, k.d, 'E')} />;

export function Ueberpruefen() {
  const nv = A_NORMALENVEKTOR;
  const um = A_UMWANDELN;
  const pn = A_PUNKT_NORMAL;
  const au = A_AUSWAHL;
  const pa = A_PARAMETER_A;
  const rk = A_RUECK;
  const ap = A_AUSWAHL_PARAMETER;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Das Vektorprodukt und seine Probe stehen im Modul <Modulverweis modul="vektorprodukt">Vektorprodukt</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">
        Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen. Bei Koordinatenformen verwendest du den Normalenvektor <Formel tex={t`\vec{n}=\vec{u}\times\vec{v}`} /> ohne zu kürzen.
      </Hinweis>

      <Aufgabe
        nummer={1}
        titel="Einen Normalenvektor bestimmen"
        felder={koordFelder('n', nv.n, 'n')}
        hilfen={[
          <>Ein Normalenvektor steht senkrecht auf beiden Spannvektoren. Du bekommst ihn mit dem Vektorprodukt der Spannvektoren.</>,
          <>Rechne <Formel tex={t`\vec{n}=\vec{u}\times\vec{v}`} /> Zeile für Zeile. Mache danach die Probe mit beiden Skalarprodukten.</>,
        ]}
        loesung={[
          <>
            <Umbruchformel
              tex={t`\vec{n}=${sp(nv.e.u)}\times${sp(nv.e.v)}=${kreuzSpalte(nv.e.u, nv.e.v)}=${sp(nv.n)}`}
              schmal={t`\begin{gathered}\vec{n}\\{}=${kreuzSpalteKurz(nv.e.u, nv.e.v)}\\{}=${sp(nv.n)}\end{gathered}`}
            />
          </>,
          <>
            Probe mit beiden Skalarprodukten:
            <Umbruchformel tex={t`\vec{n}\cdot\vec{u}=2-2+0=0`} schmal={t`\begin{gathered}\vec{n}\cdot\vec{u}\\{}=2-2+0\\{}=0\end{gathered}`} />
            <Umbruchformel tex={t`\vec{n}\cdot\vec{v}=2+0-2=0`} schmal={t`\begin{gathered}\vec{n}\cdot\vec{v}\\{}=2+0-2\\{}=0\end{gathered}`} />
          </>,
        ]}
      >
        <p>
          Bestimme einen Normalenvektor der Ebene <Formel tex={gleichungE(nv.e)} nach="." />
        </p>
        <KontrollFigur spec={aufgNormalenvektor} unter={<>Die Ebene mit einem Normalenvektor (schwarz) in <Formel tex="P" nach="." /> Ein zu langer Pfeil wird auf das Koordinatensystem gekürzt.</>} />
      </Aufgabe>

      <Aufgabe
        nummer={2}
        titel="Von der Parameterform zur Koordinatenform"
        felder={[
          { id: 'a', name: 'Koeffizient a', beschriftung: <Formel tex="a" />, erwartet: um.n[0]! },
          { id: 'b', name: 'Koeffizient b', beschriftung: <Formel tex="b" />, erwartet: um.n[1]! },
          { id: 'c', name: 'Koeffizient c', beschriftung: <Formel tex="c" />, erwartet: um.n[2]! },
          { id: 'd', name: 'Zahl d', beschriftung: <Formel tex="d" />, erwartet: um.d },
        ]}
        hilfen={[
          <>Bestimme zuerst einen Normalenvektor <Formel tex={t`\vec{n}=\vec{u}\times\vec{v}`} nach="." /> Seine Koordinaten sind <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" nach="." /></>,
          <>Die Zahl <Formel tex="d" /> ist das Skalarprodukt von <Formel tex={t`\vec{n}`} /> mit dem Stützvektor.</>,
        ]}
        loesung={[
          <>
            Normalenvektor:
            <Umbruchformel
              tex={t`\vec{n}=${kreuzSpalte(um.e.u, um.e.v)}=${sp(um.n)}`}
              schmal={t`\begin{gathered}\vec{n}\\{}=${kreuzSpalteKurz(um.e.u, um.e.v)}\\{}=${sp(um.n)}\end{gathered}`}
            />
          </>,
          <>
            Die Zahl <Formel tex="d" nach=":" />
            <Umbruchformel tex={t`d=\vec{n}\cdot\vec{p}=-1\cdot 1+2\cdot 0+2\cdot 2=${um.d}`} schmal={t`\begin{gathered}d=\vec{n}\cdot\vec{p}\\{}=-1+0+4\\{}=${um.d}\end{gathered}`} />
          </>,
          <>
            Die Koordinatenform lautet <Formel tex={koordinatenformTeX(um.n, um.d, 'E')} nach="." />
          </>,
        ]}
      >
        <p>
          Bestimme die Koordinatenform <Formel tex={t`ax_1+bx_2+cx_3=d`} /> der Ebene <Formel tex={gleichungE(um.e)} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={3}
        titel="Aus Punkt und Normalenvektor"
        felder={[{ id: 'd', name: 'Zahl d', beschriftung: <Formel tex="d" />, erwartet: pn.d }]}
        hilfen={[
          <>Die Koeffizienten sind die Koordinaten des Normalenvektors. Es fehlt nur die Zahl <Formel tex="d" nach="." /></>,
          <>Es gilt <Formel tex={t`d=\vec{n}\cdot\vec{p}`} nach="." /></>,
        ]}
        loesung={[
          <>
            <Umbruchformel tex={t`d=${sp(pn.n)}\cdot${sp(pn.P)}=2\cdot 3+1\cdot(-1)+(-2)\cdot 2`} schmal={t`\begin{gathered}d=\vec{n}\cdot\vec{p}\\{}=6-1-4\\{}=${pn.d}\end{gathered}`} />
          </>,
          <>
            Die Koordinatenform lautet <Formel tex={koordinatenformTeX(pn.n, pn.d, 'E')} nach="." />
          </>,
        ]}
      >
        <p>
          Die Ebene <Formel tex="E" /> geht durch <Formel tex={punktTeX('P', pn.P)} /> und steht senkrecht auf <Formel tex={t`\vec{n}=${sp(pn.n)}`} nach="." /> Die Koordinatenform lautet <Formel tex={t`2x_1+x_2-2x_3=d`} nach="." /> Bestimme <Formel tex="d" nach="." />
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="4"
        titel="Welche Gleichung beschreibt dieselbe Ebene?"
        optionen={platziere(
          [
            opt('a', <Formel tex={koordinatenformTeX(au.richtig.n, au.richtig.d)} />, true, <>Richtig. Die ganze Gleichung wurde mit <Formel tex="-2" /> multipliziert, also auch die Zahl <Formel tex="d" nach="." /> Das ist dieselbe Ebene.</>),
            opt('b', <Formel tex={koordinatenformTeX(au.dNichtMit.n, au.dNichtMit.d)} />, false, <>Der Normalenvektor wurde verdoppelt, aber <Formel tex="d" /> nicht mit. Ein Punkt der Ebene wie <Formel tex={punktTeX('', [3, 0, 0])} /> erfüllt <Formel tex="4\cdot 3=12" nach="," /> nicht <Formel tex="6" nach="." /></>),
            opt('c', <Formel tex={koordinatenformTeX(au.dFalsch.n, au.dFalsch.d)} />, false, <>Der Normalenvektor ist derselbe, aber <Formel tex="d" /> hat das falsche Vorzeichen. Das ist eine andere, verschobene Ebene, der Punkt <Formel tex={punktTeX('', [3, 0, 0])} /> liegt nicht in ihr.</>),
            opt('d', <Formel tex={koordinatenformTeX(au.vertauscht.n, au.vertauscht.d)} />, false, <>Die Koeffizienten sind vertauscht. Der Normalenvektor <Formel tex={t`${sp(au.vertauscht.n)}`} /> ist kein Vielfaches von <Formel tex={t`${sp(au.gegeben.n)}`} nach="," /> die Ebene ist anders geneigt.</>),
          ],
          2,
        )}
        erklaerung={<>Zwei Koordinatenformen beschreiben dieselbe Ebene, wenn die eine ein Vielfaches der anderen ist, die Zahl <Formel tex="d" /> eingeschlossen. Ein Punkt der Ebene dient als Probe.</>}
      >
        <p>
          Gegeben ist <Formel tex={koordinatenformTeX(au.gegeben.n, au.gegeben.d, 'E')} nach="." /> Welche Gleichung beschreibt dieselbe Ebene?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={5}
        titel="Ein Punkt mit Parameter"
        felder={[{ id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: pa.a }]}
        hilfen={[
          <>Der Punkt liegt in der Ebene, wenn seine Koordinaten die Gleichung erfüllen. Setze <Formel tex={t`Q(a\,|\,2\,|\,2)`} /> in die Koordinatenform ein.</>,
          <>Du erhältst eine Gleichung mit der einen Unbekannten <Formel tex="a" nach="." /></>,
        ]}
        loesung={[
          <>
            Einsetzen:
            <Umbruchformel tex={t`2a-2+6=6`} schmal={t`\begin{gathered}2a-2+6=6\end{gathered}`} />
          </>,
          <>
            Auflösen:
            <Umbruchformel tex={t`2a+4=6\Rightarrow a=${pa.a}`} schmal={t`\begin{gathered}2a+4=6\\{}\Rightarrow a=${pa.a}\end{gathered}`} />
          </>,
        ]}
      >
        <p>
          Der Punkt <Formel tex={t`Q(a\,|\,2\,|\,2)`} /> liegt in der Ebene <Formel tex={koordinatenformTeX(pa.n, pa.d, 'E')} nach="." /> Bestimme <Formel tex="a" nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={6}
        titel="Von der Koordinatenform zur Parameterform"
        felder={[...koordFelder('u', rk.u, 'u'), ...koordFelder('v', rk.v, 'v')]}
        hilfen={[
          <>Setze <Formel tex={t`x_2=r`} /> und <Formel tex={t`x_3=s`} /> und löse die Gleichung nach <Formel tex="x_1" /> auf.</>,
          <>Die Spannvektoren sind die Vektoren vor <Formel tex="r" /> und vor <Formel tex="s" nach="." /></>,
        ]}
        loesung={[
          <>
            Auflösen nach <Formel tex="x_1" nach=":" />
            <Umbruchformel tex={t`x_1=6-2r+s`} schmal={t`\begin{gathered}x_1=6-2r+s\end{gathered}`} />
          </>,
          <>
            Zusammengefasst:
            <Umbruchformel tex={eg({ p: [rk.d, 0, 0], u: rk.u, v: rk.v })} schmal={t`${gleichungESchmal({ p: [rk.d, 0, 0], u: rk.u, v: rk.v })}`} />
          </>,
          <>
            Probe mit <Formel tex={t`(r\,|\,s)=(1\,|\,1)`} nach=":" /> <Formel tex={punktTeX('', [5, 1, 1])} /> erfüllt <Formel tex={t`5+2\cdot 1-1=6`} nach="." />
          </>,
        ]}
      >
        <p>
          Gegeben ist <Formel tex={koordinatenformTeX(rk.n, rk.d, 'E')} nach="." /> Setze <Formel tex={t`x_2=r`} /> und <Formel tex={t`x_3=s`} /> und bestimme die Spannvektoren der Parameterform <Formel tex={t`E:\ \vec{x}=\begin{pmatrix}6\\0\\0\end{pmatrix}+r\cdot\vec{u}+s\cdot\vec{v}`} nach="." />
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="7"
        titel="Welche Parameterform gehört zur Koordinatenform?"
        optionen={platziere(
          [
            opt('a', <Formel tex={eg(ap.richtig)} />, true, <>Richtig. Der Stützpunkt erfüllt die Koordinatenform (<Formel tex="0+0-(-6)=6" nach=")," /> und beide Spannvektoren sind senkrecht zu <Formel tex={t`\vec{n}`} nach=":" /> <Formel tex={t`1-1=0`} /> und <Formel tex={t`-2+2=0`} nach="." /></>),
            opt('b', <Formel tex={eg(ap.nichtSenkrecht)} />, false, <>Der zweite Spannvektor ist nicht senkrecht zu <Formel tex={t`\vec{n}=${sp(ap.n)}`} nach=":" /> <Formel tex={t`2+2=4\ne 0`} nach="." /> Er zeigt aus der Ebene heraus.</>),
            opt('c', <Formel tex={eg(ap.punktFalsch)} />, false, <>Die Spannvektoren stimmen, aber der Stützpunkt liegt nicht in der Ebene: <Formel tex="0+0-6=-6\ne 6" nach="." /></>),
            opt('d', <Formel tex={eg(ap.kollinear)} />, false, <>Der zweite Spannvektor ist ein Vielfaches des ersten: <Formel tex={t`${sp(ap.kollinear.v)}=-2\cdot${sp(ap.kollinear.u)}`} nach="." /> Die Gleichung beschreibt nur eine Gerade.</>),
          ],
          0,
        )}
        erklaerung={<>Eine Parameterform gehört zur Koordinatenform, wenn der Stützpunkt die Gleichung erfüllt und beide Spannvektoren senkrecht zum Normalenvektor stehen und keine Vielfachen voneinander sind.</>}
      >
        <p>
          Welche Parameterform gehört zu <Formel tex={koordinatenformTeX(ap.n, ap.d, 'E')} nach="?" />
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="8"
        titel="Welche Aussage über den Normalenvektor stimmt?"
        optionen={platziere(
          [
            opt('a', <>Jedes von null verschiedene Vielfache eines Normalenvektors ist wieder ein Normalenvektor derselben Ebene.</>, true, <>Richtig. Ein Vielfaches zeigt in dieselbe oder die entgegengesetzte Richtung und steht daher ebenfalls senkrecht auf der Ebene.</>),
            opt('b', <>Eine Ebene hat genau einen Normalenvektor.</>, false, <>Es gibt unendlich viele Normalenvektoren, die sich nur durch einen Faktor unterscheiden.</>),
            opt('c', <>Der Normalenvektor liegt in der Ebene.</>, false, <>Er steht senkrecht auf der Ebene, nicht in ihr. In der Ebene liegen die Spannvektoren.</>),
            opt('d', <>Der Normalenvektor ist ein Vielfaches eines Spannvektors.</>, false, <>Dann wäre er nicht senkrecht zu diesem Spannvektor. Das Skalarprodukt mit einem Spannvektor ist aber 0.</>),
          ],
          1,
        )}
        erklaerung={<>Ein Normalenvektor ist nicht der Nullvektor und steht senkrecht auf beiden Spannvektoren. Mit ihm sind auch alle seine Vielfachen (außer dem Nullvektor) Normalenvektoren.</>}
      >
        <p>Welche Aussage über Normalenvektoren einer Ebene stimmt?</p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
