import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { lot } from '@/lib/gerade';
import { punktRechnung, punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { betrag, verbindungsvektor } from '@/lib/vektor';
import { RAUM_BEISPIEL, RAUM_PARALLEL, RAUM_WEG3 } from './Bilder';
import { BEISPIEL, PARALLEL } from './daten';
import { fqZeilen, gl, glSchmal, kreuzRechnungen, laufenderPunktSpalte, rund2, weg1Zeilen, weg2Zeilen, weg3Zeilen, wurzelTeX, xqSpalte, zeilenFormel } from './rechenhilfen';

const Zeilen = ({ z }: { z: { tex: string; schmal: string } }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;

export function Wege() {
  const b = BEISPIEL;
  const l = lot(b.g, b.Q);
  const w1 = weg1Zeilen(b.g, b.Q);
  const fq = fqZeilen(b.g, b.Q);
  const w3 = weg3Zeilen(b.g, b.Q);
  const pq = verbindungsvektor(b.g.p, b.Q);
  const pr = punktRechnung(b.g, l.t, '\\overrightarrow{OF}');
  const p = PARALLEL;
  const lp = lot(p.g, p.h.p);
  const fqp = fqZeilen(p.g, p.h.p);
  const w1p = weg1Zeilen(p.g, p.h.p);
  const k = p.h.u[0]! / p.g.u[0]!;
  const dStuetz2 = Math.round(betrag(verbindungsvektor(p.g.p, p.h.p)) ** 2);
  return (
    <Abschnitt id="wege" titel="Drei Wege">
      <p>
        Hier berechnest du den Abstand eines Punkts von einer Geraden auf drei Wegen. Alle drei führen zum selben Ergebnis. Als Beispiel dienen die Gerade und der Punkt aus dem Abschnitt „Erklären“:
      </p>
      <Umbruchformel tex={gl(b.g)} schmal={glSchmal(b.g)} />
      <p>und <Formel tex={punktTeX('Q', b.Q)} nach="." /></p>

      <h3>Weg 1: Laufender Punkt und Orthogonalität</h3>
      <p>
        Im Abschnitt „Entdecken“ hast du gesehen: Beim kleinsten Abstand steht <Formel tex={t`\overrightarrow{XQ}`} /> senkrecht auf <Formel tex={t`\vec{u}`} nach="." /> Mit dem Skalarprodukt (siehe <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>) heißt das <Formel tex={t`\overrightarrow{XQ}\cdot\vec{u}=0`} nach="." />
      </p>
      <ol>
        <li>Laufenden Punkt <Formel tex={t`X(t)`} /> und den Vektor <Formel tex={t`\overrightarrow{XQ}`} /> aufstellen.</li>
        <li>Das Skalarprodukt <Formel tex={t`\overrightarrow{XQ}\cdot\vec{u}`} /> gleich 0 setzen und nach <Formel tex="t" /> lösen.</li>
        <li>Mit diesem <Formel tex="t" /> den Lotfußpunkt <Formel tex="F" /> berechnen.</li>
        <li>Den Abstand <Formel tex={t`d=|\overrightarrow{FQ}|`} /> berechnen.</li>
      </ol>
      <Umbruchformel
        tex={t`\overrightarrow{OX}=${laufenderPunktSpalte(b.g)},\ \ \overrightarrow{XQ}=${xqSpalte(b.g, b.Q)}`}
        schmal={t`\begin{gathered}\overrightarrow{OX}=${laufenderPunktSpalte(b.g)}\\\overrightarrow{XQ}=${xqSpalte(b.g, b.Q)}\end{gathered}`}
      />
      <Zeilen z={w1.skalar} />
      <Zeilen z={w1.gleichung} />
      <p>Lotfußpunkt mit <Formel tex={t`t_0=${l.t}`} nach=":" /></p>
      <Umbruchformel tex={`${pr.tex},\\ \\ ${punktTeX('F', l.F)}`} schmal={pr.schmal.replace(/\\end\{gathered\}$/, `\\\\${punktTeX('F', l.F)}\\end{gathered}`)} />
      <p>Abstand:</p>
      <Zeilen z={fq} />
      <Figur spec={RAUM_BEISPIEL} unter={<>Das Lot von <Formel tex="Q" /> auf <Formel tex="g" nach=":" /> <Formel tex="F" /> liegt bei <Formel tex={t`t_0=${l.t}`} nach="," /> der Abstand ist <Formel tex={t`d=${wurzelTeX(l.d2)}\approx ${rund2(l.d)}`} nach="." /></>} />

      <h3>Weg 2: Abstand minimieren</h3>
      <p>
        Der Abstand von <Formel tex="Q" /> zum laufenden Punkt ist <Formel tex={t`|\overrightarrow{XQ}|`} nach="." /> Die Wurzel ist umso kleiner, je kleiner der Term unter der Wurzel ist. Es genügt deshalb, das Quadrat <Formel tex={t`D(t)=|\overrightarrow{XQ}|^2`} /> zu minimieren. Das ist eine nach oben geöffnete Parabel, ihr kleinster Wert liegt am Scheitel. Du findest ihn mit der Ableitung (siehe <Modulverweis modul="optimierung">Optimierung</Modulverweis>).
      </p>
      <Zeilen z={weg2Zeilen(b.g, b.Q)} />
      <p>
        Der kleinste Wert ist <Formel tex={t`D(${l.t})=${l.d2}`} nach="," /> der Abstand also <Formel tex={t`d=${wurzelTeX(l.d2)}\approx ${rund2(l.d)}`} nach="." /> Den Lotfußpunkt erhältst du mit <Formel tex={t`t_0=${l.t}`} /> wie in Weg 1.
      </p>

      <h3>Weg 3: Formel mit dem Vektorprodukt</h3>
      <p>
        Der Vektor <Formel tex={t`\overrightarrow{PQ}`} /> und der Richtungsvektor <Formel tex={t`\vec{u}`} /> spannen ein Parallelogramm auf. Sein Flächeninhalt ist <Formel tex={t`|\vec{u}\times\overrightarrow{PQ}|`} /> (siehe die Vertiefung im Modul <Modulverweis modul="vektorprodukt">Das Vektorprodukt</Modulverweis>). Er ist auch Grundseite mal Höhe, also <Formel tex={t`|\vec{u}|\cdot d`} nach=":" /> Die Höhe über der Seite auf <Formel tex="g" /> ist der gesuchte Abstand.
      </p>
      <Umbruchformel tex={t`|\vec{u}\times\overrightarrow{PQ}|=|\vec{u}|\cdot d\ \Rightarrow\ d=\frac{|\vec{u}\times\overrightarrow{PQ}|}{|\vec{u}|}`} schmal={t`\begin{gathered}|\vec{u}\times\overrightarrow{PQ}|=|\vec{u}|\cdot d\\d=\frac{|\vec{u}\times\overrightarrow{PQ}|}{|\vec{u}|}\end{gathered}`} />
      <Figur spec={RAUM_WEG3} unter={<>Das Parallelogramm aus <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\overrightarrow{PQ}`} /> (rosa) mit der Höhe <Formel tex="d" /> (orange) über der Seite auf <Formel tex="g" nach="." /></>} />
      <p>
        <Formel tex={t`\overrightarrow{PQ}=${spalte(pq)}`} nach="." /> Das Vektorprodukt rechnest du Koordinate für Koordinate:
      </p>
      <Zeilen z={zeilenFormel(kreuzRechnungen(b.g, b.Q))} />
      <Zeilen z={w3.kreuz} />
      <Zeilen z={w3.abstand} />
      <Hinweis titel="Was Weg 3 nicht liefert">
        Die Formel gibt nur den Abstand. Den Lotfußpunkt bekommst du über Weg 1 oder Weg 2.
      </Hinweis>

      <h3>Welcher Weg wann?</h3>
      <ul className="liste-ohne-zahl" aria-label="Die drei Wege im Vergleich">
        <li><strong>Weg 1</strong> liefert den Lotfußpunkt und den Abstand. Du brauchst nur das Skalarprodukt und eine einfache Gleichung für <Formel tex="t" nach="." /></li>
        <li><strong>Weg 2</strong> liefert ebenfalls beides. Er passt, wenn du Abstände als Extremwertaufgabe sehen willst, und er ist die Grundlage für den kleinsten Abstand bewegter Objekte.</li>
        <li><strong>Weg 3</strong> ist am kürzesten, wenn nur der Abstand gefragt ist. Er liefert keinen Lotfußpunkt.</li>
      </ul>

      <h3>Abstand paralleler Geraden</h3>
      <p>
        Im Abschnitt „Entdecken“ hast du gesehen: Alle Punkte von <Formel tex="h" /> haben denselben Abstand zu <Formel tex="g" nach="." /> Der Abstand paralleler Geraden ist deshalb der Abstand eines Punkts von <Formel tex="h" /> zur Geraden <Formel tex="g" nach="." />
      </p>
      <ol>
        <li>Prüfen, ob die Geraden parallel sind (Richtungsvektoren Vielfache, siehe <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>). Liegt der Stützpunkt von <Formel tex="h" /> auf <Formel tex="g" nach="," /> sind die Geraden identisch und der Abstand ist 0.</li>
        <li>Den Stützpunkt <Formel tex="Q" /> von <Formel tex="h" /> als Punkt wählen.</li>
        <li>Den Abstand von <Formel tex="Q" /> zu <Formel tex="g" /> mit einem der drei Wege berechnen.</li>
      </ol>
      <p>Beispiel:</p>
      <Umbruchformel tex={gl(p.g)} schmal={glSchmal(p.g)} />
      <Umbruchformel tex={gl(p.h, 'h', 's')} schmal={glSchmal(p.h, 'h', 's')} />
      <p>
        Es ist <Formel tex={t`\vec{v}=${k}\cdot\vec{u}`} nach="," /> die Geraden sind parallel. Der Stützpunkt <Formel tex={punktTeX('Q', p.h.p)} /> liegt nicht auf <Formel tex="g" nach="." /> Weg 1 für <Formel tex="Q" nach=":" />
      </p>
      <Zeilen z={w1p.skalar} />
      <Zeilen z={w1p.gleichung} />
      <Zeilen z={fqp} />
      <Figur spec={RAUM_PARALLEL} unter={<>Der Abstand der parallelen Geraden <Formel tex="g" /> und <Formel tex="h" nach=":" /> <Formel tex={t`d=${wurzelTeX(lp.d2)}\approx ${rund2(lp.d)}`} nach="." /></>} />
      <Hinweis titel="Achtung">
        Der Abstand der Stützpunkte <Formel tex="P" /> und <Formel tex="Q" /> ist hier <Formel tex={t`${wurzelTeX(dStuetz2)}\approx ${rund2(Math.sqrt(dStuetz2))}`} nach="." /> Er ist nicht der Abstand der Geraden, denn die Verbindung der Stützpunkte steht nicht senkrecht auf den Geraden.
      </Hinweis>
    </Abschnitt>
  );
}
