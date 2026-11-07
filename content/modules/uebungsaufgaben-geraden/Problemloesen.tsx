import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur } from '@/components/Raumfigur';
import { BE, Teile } from '@/components/Teilaufgaben';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktTeX } from '@/lib/geradenhilfen';
import { t } from '@/lib/modulhilfen';
import { raumDreieck } from './Bilder';
import { A10 } from './daten';

const P = (name: string, p: number[]) => punktTeX(name, p);

/** Aufgabe 10: Schwerpunkt im Dreieck, Seitenhalbierende als Geraden, erst am Beispiel, dann allgemein. */
function Aufgabe10() {
  const d = A10;
  return (
    <Aufgabe
      nummer="10"
      titel="Schwerpunkt im Dreieck"
      felder={[
        { id: 's1', name: 'erste Koordinate von S', beschriftung: <>Koordinate <Formel tex="s_1" /> von <Formel tex="S" /></>, erwartet: d.S[0] },
        { id: 's2', name: 'zweite Koordinate von S', beschriftung: <>Koordinate <Formel tex="s_2" /> von <Formel tex="S" /></>, erwartet: d.S[1] },
        { id: 's3', name: 'dritte Koordinate von S', beschriftung: <>Koordinate <Formel tex="s_3" /> von <Formel tex="S" /></>, erwartet: d.S[2] },
      ]}
      hilfen={[
        <>
          Eine Seitenhalbierende verbindet eine Ecke mit der Mitte der gegenüberliegenden Seite. Sie ist eine Gerade, deren Richtungsvektor du aus der Ecke und der Seitenmitte bekommst (<Modulverweis modul="geradengleichung">Geradengleichung</Modulverweis>). Ein Vielfaches des Richtungsvektors genügt, kürze Brüche.
        </>,
        <>
          Zwei Seitenhalbierende schneiden sich in einem Punkt. Setze die Geradengleichungen mit zwei verschiedenen Parametern gleich und löse das Gleichungssystem (<Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>).
        </>,
        <>
          Das Teilverhältnis liest du an den Parametern ab: Welche Streckenanteile gehören zu <Formel tex={t`\overrightarrow{AS}`} /> und <Formel tex={t`\overrightarrow{SM_a}`} nach="?" /> Für die allgemeine Rechnung nutzt du die Ortsvektoren <Formel tex={t`\vec{a}`} nach="," /> <Formel tex={t`\vec{b}`} /> und <Formel tex={t`\vec{c}`} /> der Ecken ohne Zahlen. Die Mitte der Strecke <Formel tex={t`\overline{BC}`} /> hat den Ortsvektor <Formel tex={t`\frac{1}{2}(\vec{b}+\vec{c})`} nach="." />
        </>,
      ]}
      loesung={[
        <>
          <strong>Schritt 1, Richtungsvektoren.</strong> a: Es ist <Formel tex={t`\overrightarrow{AM_a}=\begin{pmatrix}-1{,}5\\0\\3\end{pmatrix}=1{,}5\cdot\begin{pmatrix}-1\\0\\2\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{BM_b}=\begin{pmatrix}1{,}5\\-3\\-1{,}5\end{pmatrix}=1{,}5\cdot\begin{pmatrix}1\\-2\\-1\end{pmatrix}`} nach="." /> Damit sind
          <Umbruchformel
            tex={t`s_a:\ \vec{x}=\begin{pmatrix}3\\-1\\0\end{pmatrix}+\lambda\cdot\begin{pmatrix}-1\\0\\2\end{pmatrix}`}
            schmal={t`\begin{gathered}s_a:\ \vec{x}=\begin{pmatrix}3\\-1\\0\end{pmatrix}\\{}+\lambda\cdot\begin{pmatrix}-1\\0\\2\end{pmatrix}\end{gathered}`}
          />
          <Umbruchformel
            tex={t`s_b:\ \vec{x}=\begin{pmatrix}1\\1\\3\end{pmatrix}+\mu\cdot\begin{pmatrix}1\\-2\\-1\end{pmatrix}`}
            schmal={t`\begin{gathered}s_b:\ \vec{x}=\begin{pmatrix}1\\1\\3\end{pmatrix}\\{}+\mu\cdot\begin{pmatrix}1\\-2\\-1\end{pmatrix}\end{gathered}`}
          />
          die Seitenhalbierenden durch <Formel tex="A" /> und durch <Formel tex="B" nach="." />
        </>,
        <>
          <strong>Schritt 2, Schnittpunkt.</strong> Gleichsetzen ergibt drei Gleichungen, die der Reihe nach I, II und III heißen:
          <Umbruchformel
            tex={t`\mathrm{I}:\ 3-\lambda=1+\mu,\ \ \mathrm{II}:\ -1=1-2\mu,\ \ \mathrm{III}:\ 2\lambda=3-\mu`}
            schmal={t`\begin{gathered}3-\lambda=1+\mu\\-1=1-2\mu\\2\lambda=3-\mu\end{gathered}`}
          />
          Aus II folgt <Formel tex={t`\mu=1`} nach="," /> aus I folgt <Formel tex={t`\lambda=3-1-1=1`} nach="." /> Gleichung III ist erfüllt: <Formel tex={t`2=3-1`} nach="." /> Der Schnittpunkt ist
          <Umbruchformel
            tex={t`\overrightarrow{OS}=\begin{pmatrix}3\\-1\\0\end{pmatrix}+1\cdot\begin{pmatrix}-1\\0\\2\end{pmatrix}=\begin{pmatrix}2\\-1\\2\end{pmatrix}`}
            schmal={t`\begin{gathered}\overrightarrow{OS}\\{}=\begin{pmatrix}3\\-1\\0\end{pmatrix}+1\cdot\begin{pmatrix}-1\\0\\2\end{pmatrix}\\{}=\begin{pmatrix}2\\-1\\2\end{pmatrix}\end{gathered}`}
          />
          also <Formel tex={P('S', d.S)} nach="." />
        </>,
        <>
          <strong>Schritt 3, Teilverhältnis.</strong> b: Die Seitenmitte <Formel tex={t`M_a`} /> gehört zu <Formel tex={t`\lambda=1{,}5`} nach="," /> der Punkt <Formel tex="S" /> zu <Formel tex={t`\lambda=1`} nach="." /> Von <Formel tex="A" /> bis <Formel tex="S" /> ist es also <Formel tex={t`\frac{1}{1{,}5}=\frac{2}{3}`} /> des Wegs bis <Formel tex={t`M_a`} nach="," /> der Rest ist <Formel tex={t`\frac{1}{3}`} nach="." /> Rechnerisch:
          <Umbruchformel
            tex={t`\overrightarrow{AS}=\begin{pmatrix}-1\\0\\2\end{pmatrix}=2\cdot\begin{pmatrix}-0{,}5\\0\\1\end{pmatrix}=2\cdot\overrightarrow{SM_a}`}
            schmal={t`\begin{gathered}\overrightarrow{AS}\\{}=\begin{pmatrix}-1\\0\\2\end{pmatrix}\\{}=2\cdot\begin{pmatrix}-0{,}5\\0\\1\end{pmatrix}\\{}=2\cdot\overrightarrow{SM_a}\end{gathered}`}
          />
          Also gilt <Formel tex={t`\overline{AS}:\overline{SM_a}=2:1`} nach="." /> Für <Formel tex="B" /> gilt ebenso <Formel tex={t`\overrightarrow{BS}=\begin{pmatrix}1\\-2\\-1\end{pmatrix}=2\cdot\begin{pmatrix}0{,}5\\-1\\-0{,}5\end{pmatrix}=2\cdot\overrightarrow{SM_b}`} nach="," /> also <Formel tex={t`\overline{BS}:\overline{SM_b}=2:1`} nach="." />
        </>,
        <>
          <strong>Schritt 4, dritte Seitenhalbierende.</strong> c: Es ist <Formel tex={t`\overrightarrow{CM_c}=\begin{pmatrix}0\\3\\-1{,}5\end{pmatrix}=1{,}5\cdot\begin{pmatrix}0\\2\\-1\end{pmatrix}`} nach="." /> Die Seitenhalbierende durch <Formel tex="C" /> ist
          <Umbruchformel
            tex={t`s_c:\ \vec{x}=\begin{pmatrix}2\\-3\\3\end{pmatrix}+\nu\cdot\begin{pmatrix}0\\2\\-1\end{pmatrix}`}
            schmal={t`\begin{gathered}s_c:\ \vec{x}=\begin{pmatrix}2\\-3\\3\end{pmatrix}\\{}+\nu\cdot\begin{pmatrix}0\\2\\-1\end{pmatrix}\end{gathered}`}
          />
          Punktprobe mit <Formel tex={P('S', d.S)} nach=":" /> Die Gleichungen <Formel tex={t`2=2`} nach="," /> <Formel tex={t`-3+2\nu=-1`} /> und <Formel tex={t`3-\nu=2`} /> haben dieselbe Lösung <Formel tex={t`\nu=1`} nach="." /> Also liegt <Formel tex="S" /> auch auf <Formel tex={t`s_c`} nach="." />
        </>,
        <>
          <strong>Schritt 5, allgemein.</strong> d: Die Seitenhalbierende durch <Formel tex="A" /> ist <Formel tex={t`\vec{x}=\vec{a}+\lambda\cdot\left(\frac{1}{2}(\vec{b}+\vec{c})-\vec{a}\right)`} nach="." /> Mit dem Richtungsvektor <Formel tex={t`\vec{d}=\vec{m}_a-\vec{a}`} /> zur Seitenmitte <Formel tex={t`\vec{m}_a=\frac{1}{2}(\vec{b}+\vec{c})`} /> und <Formel tex={t`\lambda=\frac{2}{3}`} /> ergibt sich
          <Umbruchformel
            tex={t`\vec{s}=\vec{a}+\frac{2}{3}\vec{d}=\frac{\vec{a}+2\vec{m}_a}{3}=\frac{\vec{a}+\vec{b}+\vec{c}}{3}`}
            schmal={t`\begin{gathered}\vec{s}=\vec{a}+\frac{2}{3}\vec{d}\\{}=\frac{\vec{a}+2\vec{m}_a}{3}\\{}=\frac{\vec{a}+\vec{b}+\vec{c}}{3}\end{gathered}`}
          />
          Der Ausdruck ist symmetrisch in <Formel tex={t`\vec{a}`} nach="," /> <Formel tex={t`\vec{b}`} /> und <Formel tex={t`\vec{c}`} nach="." /> Dieselbe Rechnung für die Seitenhalbierenden durch <Formel tex="B" /> und <Formel tex="C" /> (jeweils mit dem Parameter <Formel tex={t`\frac{2}{3}`} nach=")" /> liefert denselben Punkt <Formel tex={t`\vec{s}=\frac{1}{3}(\vec{a}+\vec{b}+\vec{c})`} nach="." /> Er liegt auf allen drei Seitenhalbierenden und teilt jede im Verhältnis <Formel tex={t`\frac{2}{3}:\frac{1}{3}=2:1`} nach="," /> von der Ecke aus gesehen. Für das Beispiel: <Formel tex={t`\frac{1}{3}\left(\begin{pmatrix}3\\-1\\0\end{pmatrix}+\begin{pmatrix}1\\1\\3\end{pmatrix}+\begin{pmatrix}2\\-3\\3\end{pmatrix}\right)=\begin{pmatrix}2\\-1\\2\end{pmatrix}`} nach="." />
        </>,
      ]}
    >
      <p>
        Der <strong>Schwerpunkt</strong> eines Dreiecks ist der Punkt, in dem sich die drei Seitenhalbierenden schneiden. Eine Seitenhalbierende verbindet eine Ecke mit der Mitte der gegenüberliegenden Seite. Du untersuchst zuerst ein Dreieck mit Zahlen und zeigst danach, dass die Beobachtung für jedes Dreieck gilt. Das Dreieck <Formel tex="ABC" /> hat die Ecken <Formel tex={P('A', d.A)} nach="," /> <Formel tex={P('B', d.B)} /> und <Formel tex={P('C', d.C)} nach="." /> Die Mitten der Seiten <Formel tex={t`\overline{BC}`} nach="," /> <Formel tex={t`\overline{AC}`} /> und <Formel tex={t`\overline{AB}`} /> sind <Formel tex={P('M_a', d.Ma)} nach="," /> <Formel tex={P('M_b', d.Mb)} /> und <Formel tex={P('M_c', d.Mc)} nach="." />
      </p>
      <Figur spec={raumDreieck(false)} unter={<>Das Dreieck <Formel tex="ABC" /> mit den Seitenmitten <Formel tex={t`M_a`} nach="," /> <Formel tex={t`M_b`} /> und <Formel tex={t`M_c`} nach="." /></>} />
      <Teile>
        <li>
          Bestimmen Sie Gleichungen der Seitenhalbierenden <Formel tex={t`s_a`} /> durch <Formel tex="A" /> und <Formel tex={t`s_b`} /> durch <Formel tex="B" /> sowie die Koordinaten ihres Schnittpunkts <Formel tex="S" nach="." /> <BE n={4} />
        </li>
        <li>
          Weisen Sie nach, dass <Formel tex="S" /> jede der beiden Strecken <Formel tex={t`\overline{AM_a}`} /> und <Formel tex={t`\overline{BM_b}`} /> im Verhältnis 2:1 teilt, von der Ecke aus gesehen. <BE n={2} />
        </li>
        <li>
          Weisen Sie nach, dass auch die dritte Seitenhalbierende <Formel tex={t`s_c`} /> durch <Formel tex="C" /> durch den Punkt <Formel tex="S" /> verläuft. <BE n={2} />
        </li>
        <li>
          Zeigen Sie für ein beliebiges Dreieck mit den Ortsvektoren <Formel tex={t`\vec{a}`} nach="," /> <Formel tex={t`\vec{b}`} /> und <Formel tex={t`\vec{c}`} /> der Ecken, dass der Punkt mit dem Ortsvektor <Formel tex={t`\frac{1}{3}(\vec{a}+\vec{b}+\vec{c})`} /> auf allen drei Seitenhalbierenden liegt und sie im Verhältnis 2:1 teilt. <BE n={2} />
        </li>
      </Teile>
      <KontrollFigur spec={raumDreieck(true)} unter={<>Die drei Seitenhalbierenden <Formel tex={t`s_a`} /> (schwarz), <Formel tex={t`s_b`} /> (orange) und <Formel tex={t`s_c`} /> (rosa) schneiden sich im Schwerpunkt <Formel tex="S" nach="." /></>} />
    </Aufgabe>
  );
}

export function Problemloesen() {
  return (
    <Abschnitt id="problemloesen" titel="Problemlösen">
      <p>
        Eine Problemlöseaufgabe hat kein Schema, das du nur abarbeitest. Du gehst von einem Beispiel aus, entdeckst eine Eigenschaft und begründest sie dann allgemein. Die Hilfen und der Lösungsweg sind in fünf Schritte gegliedert.
      </p>
      <Hinweis titel="Vorgehen beim Problemlösen">
        Verschaffe dir zuerst einen Überblick (Skizze, Bezeichnungen), arbeite danach mit konkreten Zahlen, achte darauf, was sich wiederholt, und übertrage die Beobachtung zuletzt mit Buchstaben auf jeden Fall. Die Eingabefelder prüfen nur die Zahlen in Teilaufgabe a. Die übrigen Teilaufgaben schreibst du ins Heft.
      </Hinweis>
      <Aufgabe10 />
    </Abschnitt>
  );
}
