import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Umbruchformel } from '@/components/Umbruchformel';
import { Bild } from '@/components/Messbild';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { BILD_MITTE, BILD_TEILUNG } from './Bilder';
import { ZUSAMMENFASSUNG } from './daten';

export function Zusammenfassung() {
  const z = ZUSAMMENFASSUNG;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Betrag, Einheitsvektor und Abstand</h3>
      <Hinweis art="merksatz" titel="Betrag eines Vektors">
        Der <strong>Betrag</strong> eines Vektors ist die Länge seiner Pfeile. Er wird aus den Koordinaten mit dem Satz des Pythagoras berechnet, in der Ebene und im Raum:
        <Formel anzeige tex={t`|\vec{a}|=\sqrt{a_1^2+a_2^2}`} />
        <Formel anzeige tex={t`|\vec{a}|=\sqrt{a_1^2+a_2^2+a_3^2}`} />
        Der Betrag ist nie negativ und nur beim Nullvektor 0. Ein Vektor und sein Gegenvektor haben denselben Betrag. Für ein Vielfaches gilt: Der Pfeil von <Formel tex={t`r\cdot\vec{a}`} /> ist so oft so lang wie der von <Formel tex={t`\vec{a}`} nach="," /> wie der Betrag von <Formel tex="r" /> angibt.
      </Hinweis>
      <Hinweis art="merksatz" titel="Einheitsvektor">
        Ein Vektor mit dem Betrag 1 heißt Einheitsvektor. Für <Formel tex={t`\vec{a}\neq\vec{0}`} /> ist
        <Formel anzeige tex={t`\vec{e}=\frac{1}{|\vec{a}|}\cdot\vec{a}`} />
        der Einheitsvektor in Richtung von <Formel tex={t`\vec{a}`} nach="." /> Multipliziert man ihn mit einer Zahl <Formel tex="L" nach="," /> entsteht ein Vektor der Länge <Formel tex="L" /> in derselben Richtung. Der Nullvektor hat keinen Einheitsvektor.
      </Hinweis>
      <Hinweis art="merksatz" titel="Abstand zweier Punkte und Länge einer Strecke">
        Der Abstand der Punkte <Formel tex="A" /> und <Formel tex="B" /> ist gleich der Länge der Strecke <Formel tex="AB" /> und gleich dem Betrag des Verbindungsvektors. Mit <Formel tex={t`d_i=b_i-a_i`} /> für die Koordinaten von <Formel tex={t`\overrightarrow{AB}`} /> gilt im Raum:
        <Umbruchformel tex={t`|\overrightarrow{AB}|=\sqrt{d_1^2+d_2^2+d_3^2}`} schmal={t`\begin{gathered}|\overrightarrow{AB}|=\\\sqrt{d_1^2+d_2^2+d_3^2}\end{gathered}`} />
        In der Ebene fällt <Formel tex="d_3" /> weg.
        Es gilt <Formel tex={t`|\overrightarrow{AB}|=|\overrightarrow{BA}|`} nach="." />
      </Hinweis>

      <h3>Mittelpunkt und Teilung einer Strecke</h3>
      <Hinweis art="merksatz" titel="Mittelpunkt">
        Der Mittelpunkt <Formel tex="M" /> der Strecke <Formel tex="AB" /> hat den Ortsvektor
        <Umbruchformel tex={t`\overrightarrow{OM}=\overrightarrow{OA}+\frac{1}{2}\cdot\overrightarrow{AB}=\frac{1}{2}\cdot(\vec{a}+\vec{b})`} schmal={t`\begin{aligned}\overrightarrow{OM}&=\overrightarrow{OA}+\frac{1}{2}\cdot\overrightarrow{AB}\\&=\frac{1}{2}\cdot(\vec{a}+\vec{b})\end{aligned}`} />
        Jede Koordinate von <Formel tex="M" /> ist der Mittelwert der entsprechenden Koordinaten von <Formel tex="A" /> und <Formel tex="B" nach="." />
      </Hinweis>
      <Hinweis art="merksatz" titel="Teilung im Verhältnis m : n">
        Der Punkt <Formel tex="T" /> teilt die Strecke <Formel tex="AB" /> im Verhältnis <Formel tex="m:n" nach="," /> wenn <Formel tex="AT:TB=m:n" /> gilt. Dann ist <Formel tex={t`\overrightarrow{AT}`} /> der Bruchteil <Formel tex={t`\frac{m}{m+n}`} /> von <Formel tex={t`\overrightarrow{AB}`} nach=":" />
        <Umbruchformel tex={t`\overrightarrow{OT}=\overrightarrow{OA}+\frac{m}{m+n}\cdot\overrightarrow{AB}`} schmal={t`\begin{aligned}\overrightarrow{OT}&=\overrightarrow{OA}\\&\quad+\frac{m}{m+n}\cdot\overrightarrow{AB}\end{aligned}`} />
        Der Bruchteil vergleicht die Teilstrecke mit der ganzen Strecke, das Verhältnis vergleicht die beiden Teilstrecken. Das Verhältnis <Formel tex="1:1" /> ergibt den Mittelpunkt.
      </Hinweis>
      <Bild
        daten={BILD_MITTE}
        unter={
          <>
            Mittelpunkt: Der blaue Pfeil von <Formel tex="A" /> nach <Formel tex="M" /> ist die Hälfte des orangen Pfeils von <Formel tex="A" /> nach <Formel tex="B" nach="." /> Der rosa Pfeil ist der Ortsvektor von <Formel tex="M" nach="." />
          </>
        }
      />
      <Bild
        daten={BILD_TEILUNG}
        unter={
          <>
            Teilung im Verhältnis <Formel tex="2:3" nach=":" /> Der orange Pfeil ist <Formel tex={t`\frac{2}{5}`} /> der Strecke, der blaue <Formel tex={t`\frac{3}{5}`} nach="." />
          </>
        }
      />

      <h3>Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben sind <Formel tex={t`A(1\,|\,-2\,|\,0)`} /> und <Formel tex={t`B(6\,|\,8\,|\,10)`} nach="." /> Der Verbindungsvektor ist
      </p>
      <Umbruchformel tex={t`\overrightarrow{AB}=\begin{pmatrix}6-1\\8-(-2)\\10-0\end{pmatrix}=${spalte(z.ab)}`} schmal={t`\begin{aligned}\overrightarrow{AB}&=\begin{pmatrix}6-1\\8-(-2)\\10-0\end{pmatrix}\\&=${spalte(z.ab)}\end{aligned}`} />
      <p>Der Betrag, also der Abstand von <Formel tex="A" /> und <Formel tex="B" nach=":" /></p>
      <Umbruchformel tex={t`|\overrightarrow{AB}|=\sqrt{5^2+10^2+10^2}=\sqrt{225}=15`} schmal={t`\begin{aligned}|\overrightarrow{AB}|&=\sqrt{5^2+10^2+10^2}\\&=\sqrt{225}=15\end{aligned}`} />
      <p>
        Der Einheitsvektor in Richtung von <Formel tex={t`\overrightarrow{AB}`} /> ist <Formel tex={t`\frac{1}{15}\cdot\begin{pmatrix}5\\10\\10\end{pmatrix}=\begin{pmatrix}\frac{1}{3}\\\frac{2}{3}\\\frac{2}{3}\end{pmatrix}`} nach="." /> Der Mittelpunkt hat den Ortsvektor
      </p>
      <Umbruchformel tex={t`\overrightarrow{OM}=\frac{1}{2}\begin{pmatrix}1+6\\-2+8\\0+10\end{pmatrix}=\begin{pmatrix}3{,}5\\3\\5\end{pmatrix}`} schmal={t`\begin{aligned}\overrightarrow{OM}&=\frac{1}{2}\begin{pmatrix}1+6\\-2+8\\0+10\end{pmatrix}\\&=\begin{pmatrix}3{,}5\\3\\5\end{pmatrix}\end{aligned}`} />
      <p>
        Der Punkt <Formel tex="T" /> teilt die Strecke im Verhältnis <Formel tex="2:3" nach="." /> Es gilt <Formel tex={t`\overrightarrow{AT}=\frac{2}{5}\cdot\overrightarrow{AB}=\begin{pmatrix}2\\4\\4\end{pmatrix}`} nach="," /> also <Formel tex={t`T(1+2\,|\,-2+4\,|\,0+4)=T(3\,|\,2\,|\,4)`} nach="." /> Zur Probe: <Formel tex={t`|\overrightarrow{AT}|=\sqrt{4+16+16}=6`} /> und <Formel tex={t`|\overrightarrow{TB}|=|\begin{pmatrix}3\\6\\6\end{pmatrix}|=9`} nach="," /> und es gilt <Formel tex="6:9=2:3" nach="." />
      </p>

      <h3>Begriffe im Überblick</h3>
      <ul className="liste-ohne-zahl" aria-label="Die wichtigsten Begriffe">
        <li><strong>Betrag:</strong> Länge der Pfeile eines Vektors, <Formel tex={t`|\vec{a}|`} nach="." /></li>
        <li><strong>Einheitsvektor:</strong> Vektor mit Betrag 1.</li>
        <li><strong>Abstand:</strong> Länge der Strecke zwischen zwei Punkten, Betrag des Verbindungsvektors.</li>
        <li><strong>Mittelpunkt:</strong> Teilpunkt im Verhältnis <Formel tex="1:1" nach="." /></li>
        <li><strong>Teilverhältnis:</strong> Verhältnis der Längen der beiden Teilstrecken, <Formel tex="AT:TB=m:n" nach="." /></li>
      </ul>

      <Hinweis titel="Häufige Fehler">
        <ul className="liste">
          <li>Beim Betrag die Wurzel vergessen oder nur die Summe der Koordinaten gebildet: <Formel tex={t`|\vec{a}|=\sqrt{a_1^2+a_2^2+a_3^2}`} nach="." /></li>
          <li>Vorzeichen: Koordinaten werden quadriert, <Formel tex="(-3)^2=9" nach="," /> nicht <Formel tex="-9" nach="." /></li>
          <li>Im Raum die dritte Koordinate vergessen.</li>
          <li>Verhältnis und Anteil verwechselt: Beim Verhältnis <Formel tex="2:3" /> ist <Formel tex={t`\overrightarrow{AT}`} /> der Bruchteil <Formel tex={t`\frac{2}{5}`} nach="," /> nicht <Formel tex={t`\frac{2}{3}`} nach="." /></li>
          <li>Den Mittelpunkt als Vektor von <Formel tex="A" /> aus gerechnet, statt als Ortsvektor: <Formel tex={t`\frac{1}{2}\overrightarrow{AB}`} /> ist nicht der Ortsvektor von <Formel tex="M" nach="." /></li>
        </ul>
      </Hinweis>
    </Abschnitt>
  );
}
