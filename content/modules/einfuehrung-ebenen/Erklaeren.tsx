import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { verbindungSpalte } from '@/lib/geradenhilfen';
import { RAUM_ERKLAEREN } from './Bilder';
import { ERKLAEREN } from './daten';
import { gleichungE, gleichungESchmal, punktRechnungE, punktTeX } from './rechenhilfen';

export function Erklaeren() {
  const e = ERKLAEREN;
  const eb = { p: e.A, u: e.u, v: e.v };
  const x = punktRechnungE(eb, e.r, e.s);
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Eine Gerade im Raum ist durch einen Punkt und eine Richtung festgelegt, wie im Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis> beschrieben. Eine Ebene ist eine ebene, unbegrenzte Fläche, zum Beispiel wie eine Tischplatte, die du dir in alle Richtungen verlängert denkst. Um von einem Ausgangspunkt aus jeden Punkt einer solchen Fläche zu erreichen, reicht eine Richtung nicht. Du brauchst zwei Richtungen, mit denen du vor und zurück und zur Seite gehen kannst. Wie Punkte, Ortsvektoren und Verbindungsvektoren im Raum funktionieren, steht in den Modulen <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis> und <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>.
      </p>

      <h3>Eine Ebene festlegen</h3>
      <p>
        Eine Ebene ist durch einen Punkt und zwei Richtungen festgelegt: Du startest in einem Punkt, den du <strong>Stützpunkt</strong> nennst, und darfst dich in zwei Richtungen bewegen. Beide Richtungen gibt je ein Vektor an. Du gehst von deinem Stützpunkt aus einige Schritte in die erste Richtung und einige Schritte in die zweite Richtung. Wie viele, bestimmst du mit zwei Zahlen, die du unabhängig voneinander wählen darfst.
      </p>

      <h3>Die Parametergleichung</h3>
      <p>Eine Ebene <Formel tex="E" /> im Raum hat die Gleichung</p>
      <Umbruchformel
        tex={t`E:\ \vec{x}=\vec{p}+r\cdot\vec{u}+s\cdot\vec{v},\quad r,s\in\mathbb{R}`}
        schmal={t`\begin{gathered}E:\ \vec{x}=\vec{p}\\{}+r\cdot\vec{u}\\{}+s\cdot\vec{v}\\r,s\in\mathbb{R}\end{gathered}`}
      />
      <p>Das Bild zeigt die Bedeutung der Buchstaben an einer Ebene durch die Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" nach="." /></p>
      <Figur
        spec={RAUM_ERKLAEREN}
        unter={
          <>
            Die Ebene durch <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" nach="." /> Gezeichnet ist der Teil der Ebene im Koordinatensystem, die Ebene selbst ist unbegrenzt. Der Stützvektor ist orange, die beiden Spannvektoren sind blau und rosa. Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten und die räumliche Ansicht drehen.
          </>
        }
      />
      <ul className="liste-ohne-zahl" aria-label="Die Bestandteile der Ebenengleichung">
        <li><Formel tex={t`\vec{x}`} nach=":" /> der Ortsvektor eines Punkts <Formel tex="X" /> der Ebene.</li>
        <li><Formel tex={t`\vec{p}`} nach=":" /> der <strong>Stützvektor</strong> (im Bild orange), der Ortsvektor des Stützpunkts <Formel tex="P" nach="." /></li>
        <li><Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} nach=":" /> die beiden <strong>Spannvektoren</strong> (im Bild blau und rosa). Sie geben die beiden Richtungen an, in denen du dich bewegen darfst.</li>
        <li><Formel tex="r" /> und <Formel tex="s" nach=":" /> die beiden <strong>Parameter</strong>, beliebige reelle Zahlen. In vielen Büchern heißen sie <Formel tex={t`\lambda`} /> und <Formel tex={t`\mu`} nach="." /></li>
      </ul>
      <p>
        Die Spannvektoren dürfen nicht der Nullvektor sein, und keiner darf ein Vielfaches des anderen sein. Warum das nötig ist, findest du im Abschnitt „Entdecken“ heraus. Für jedes Paar <Formel tex={t`(r\,|\,s)`} /> gehört ein Punkt zur Ebene. Die Gleichung heißt deshalb <strong>Parameterform</strong> oder Parametergleichung der Ebene.
      </p>
      <Hinweis titel="Stützpunkt und Stützvektor">
        Der Stützpunkt <Formel tex="P" /> ist ein Punkt im Raum, geschrieben mit senkrechtem Strich, zum Beispiel <Formel tex={punktTeX('A', e.A)} nach="." /> Der Stützvektor <Formel tex={t`\vec{p}`} /> ist sein Ortsvektor, also der Pfeil vom Ursprung zu diesem Punkt, geschrieben als Spalte: <Formel tex={t`\overrightarrow{OA}=${spalte(e.A)}`} nach="." /> Beide haben dieselben Zahlen, aber der eine ist ein Ort und der andere eine Verschiebung vom Ursprung aus. In der Gleichung steht der Stützvektor, weil man mit Vektoren rechnet.
      </Hinweis>

      <h3>Die Gleichung aus drei Punkten aufstellen</h3>
      <p>
        Sind drei Punkte <Formel tex="A" nach="," /> <Formel tex="B" /> und <Formel tex="C" /> der Ebene bekannt, gehst du so vor: Der Ortsvektor von <Formel tex="A" /> ist der Stützvektor. Die Verbindungsvektoren <Formel tex={t`\overrightarrow{AB}`} /> und <Formel tex={t`\overrightarrow{AC}`} /> sind die beiden Spannvektoren, denn sie führen von <Formel tex="A" /> aus zu zwei weiteren Punkten der Ebene.
      </p>
      <Umbruchformel
        tex={t`E:\ \vec{x}=\overrightarrow{OA}+r\cdot\overrightarrow{AB}+s\cdot\overrightarrow{AC}`}
        schmal={t`\begin{gathered}E:\ \vec{x}=\overrightarrow{OA}\\{}+r\cdot\overrightarrow{AB}\\{}+s\cdot\overrightarrow{AC}\end{gathered}`}
      />
      <p>
        Beispiel: Die Ebene geht durch <Formel tex={punktTeX('A', e.A)} nach="," /> <Formel tex={punktTeX('B', e.B)} /> und <Formel tex={punktTeX('C', e.C)} nach="." /> Die Spannvektoren sind Zielpunkt minus Ausgangspunkt:
      </p>
      <Umbruchformel
        tex={t`\overrightarrow{AB}=${verbindungSpalte(e.A, e.B)}=${spalte(e.u)}`}
        schmal={t`\begin{gathered}\overrightarrow{AB}\\{}=${verbindungSpalte(e.A, e.B)}\\{}=${spalte(e.u)}\end{gathered}`}
      />
      <Umbruchformel
        tex={t`\overrightarrow{AC}=${verbindungSpalte(e.A, e.C)}=${spalte(e.v)}`}
        schmal={t`\begin{gathered}\overrightarrow{AC}\\{}=${verbindungSpalte(e.A, e.C)}\\{}=${spalte(e.v)}\end{gathered}`}
      />
      <p>Mit dem Stützpunkt <Formel tex="A" /> lautet die Gleichung</p>
      <Umbruchformel tex={gleichungE(eb)} schmal={gleichungESchmal(eb)} />

      <h3>Einen Punkt der Ebene berechnen</h3>
      <p>
        Setzt du für <Formel tex="r" /> und <Formel tex="s" /> Zahlen ein, erhältst du den Ortsvektor eines Punkts der Ebene. Für <Formel tex={t`r=${e.r}`} /> und <Formel tex={t`s=${e.s}`} /> ergibt sich bei der Ebene aus dem Beispiel
      </p>
      <Umbruchformel tex={x.tex} schmal={x.schmal} />
      <p>
        Der Punkt hat also die Koordinaten <Formel tex={punktTeX('X', e.X)} nach="." />
      </p>
      <Hinweis titel="Schreibweise">
        Ein Punkt wird mit senkrechtem Strich geschrieben, ein Vektor als Spalte. Das <Formel tex={t`\vec{x}`} /> in der Ebenengleichung ist ein Vektor, genauer der Ortsvektor eines beliebigen Punkts der Ebene.
      </Hinweis>
      <p>
        Was die Zahlen <Formel tex="r" /> und <Formel tex="s" /> mit dem Punkt machen, warum die Spannvektoren keine Vielfachen sein dürfen, wann ein gegebener Punkt zur Ebene gehört und ob es für eine Ebene nur eine Gleichung gibt, findest du im Abschnitt „Entdecken“ heraus.
      </p>
    </Abschnitt>
  );
}
