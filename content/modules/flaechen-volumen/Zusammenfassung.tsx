import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { formelZeilen, formTeX, weg1 } from '@/lib/abstandebenehilfen';
import { punktTeX } from '@/lib/ebenenhilfen';
import { betragZeilen, punktBruchTeX } from '@/lib/geradenhilfen';
import { dreiecksflaecheZeilen, kreuzZeilen, skalarKurz, spannvektorZeilen, volumenZeilen } from '@/lib/koerperhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { verbindungsvektor } from '@/lib/vektor';
import { RAUM_PYRAMIDE, dP } from './Bilder';
import { PYRAMIDE } from './daten';

type Z = { tex: string; schmal: string };
const Zeilen = ({ z }: { z: Z }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;
const AB = '\\overrightarrow{AB}';
const AC = '\\overrightarrow{AC}';
const AD = '\\overrightarrow{AD}';
const AS = '\\overrightarrow{AS}';

export function Zusammenfassung() {
  const [A, B, C, S] = [PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C, PYRAMIDE.S];
  const ab = verbindungsvektor(A, B);
  const ac = verbindungsvektor(A, C);
  const as = verbindungsvektor(A, S);
  const f = formelZeilen(dP.form, S);
  const w = weg1(dP.form, S);
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Quader</h3>
      <Hinweis art="merksatz" titel="Quader im Koordinatensystem">
        <p>
          Von den Ecken <Formel tex="A" nach="," /> <Formel tex="B" nach="," /> <Formel tex="D" /> und <Formel tex="E" /> aus erhältst du die übrigen Ecken durch Addieren der Kantenvektoren <Formel tex={AB} nach="," /> <Formel tex={AD} /> und <Formel tex={t`\overrightarrow{AE}`} nach="," /> zum Beispiel <Formel tex={t`\overrightarrow{OC}=\overrightarrow{OB}+${AD}`} nach="." /> Die Kanten an einer Ecke stehen senkrecht aufeinander, wenn ihre Skalarprodukte 0 sind. Das Volumen ist
        </p>
        <Umbruchformel tex={t`V=G\cdot h=|${AB}|\cdot|${AD}|\cdot|\overrightarrow{AE}|`} schmal={t`\begin{gathered}V=G\cdot h\\G=|${AB}|\cdot|${AD}|\\h=|\overrightarrow{AE}|\end{gathered}`} />
      </Hinweis>

      <h3>Grundfläche, Höhe und Volumen der Pyramide</h3>
      <Hinweis art="merksatz" titel="Grundfläche">
        <ul>
          <li>Dreieck <Formel tex="ABC" nach=":" /> <Formel tex={t`G=\frac{1}{2}\cdot|${AB}\times${AC}|`} nach="." /> Das gilt für jedes Dreieck. Nur bei einem rechten Winkel bei <Formel tex="A" /> ist es dasselbe wie <Formel tex={t`\frac{1}{2}\cdot|${AB}|\cdot|${AC}|`} nach="." /></li>
          <li>Parallelogramm <Formel tex="ABCD" nach=":" /> <Formel tex={t`G=|${AB}\times${AD}|`} nach="."/></li>
          <li>Rechteck <Formel tex="ABCD" nach=":" /> <Formel tex={t`G=|${AB}|\cdot|${AD}|`} nach="."/></li>
          <li>Allgemeines Viereck: in zwei Dreiecke zerlegen und die Flächeninhalte addieren.</li>
        </ul>
      </Hinweis>
      <Hinweis art="merksatz" titel="Höhe und Volumen">
        <p>
          Die Höhe <Formel tex="h" /> ist der Abstand der Spitze <Formel tex="S" /> von der Grundebene, der Höhenfußpunkt <Formel tex="F" /> ist der Lotfußpunkt. Er muss nicht in der Grundfläche liegen. Die Grundebene hat den Normalenvektor <Formel tex={t`\vec{n}=${AB}\times${AC}`} /> und die rechte Seite <Formel tex={t`b=\vec{n}\cdot\overrightarrow{OA}`} nach="." /> Das Volumen der Pyramide ist
        </p>
        <Formel anzeige tex={t`V=\frac{1}{3}\cdot G\cdot h`} nach="." />
        <p>
          Es hängt nur von <Formel tex="G" /> und <Formel tex="h" /> ab: Verschiebst du die Spitze parallel zur Grundebene, bleibt das Volumen gleich. Doppelte Höhe ergibt doppeltes Volumen.
        </p>
      </Hinweis>
      <Hinweis art="merksatz" titel="Vorgehen in vier Schritten">
        <ol>
          <li>Grundfläche <Formel tex="G" /> aus dem Betrag des Vektorprodukts (Kreuzprodukt) berechnen.</li>
          <li>Koordinatenform der Grundebene aus <Formel tex={t`\vec{n}`} /> und <Formel tex="A" /> aufstellen.</li>
          <li>Höhe <Formel tex="h" /> als Abstand von <Formel tex="S" /> zur Grundebene bestimmen (Lotgerade oder Abstandsformel).</li>
          <li>Volumen <Formel tex={t`V=\frac{1}{3}\cdot G\cdot h`} /> mit den exakten Werten berechnen, erst das Ergebnis runden.</li>
        </ol>
      </Hinweis>
      <h3>Zwei Wege zum Volumen</h3>
      <p>Das Volumen von Quader und Pyramide kannst du auf zwei Arten bestimmen.</p>
      <Hinweis art="merksatz" titel="Weg 1: Vorgehen in vier Schritten (Bildungsplan)">
        Grundfläche <Formel tex="G" /> und Höhe <Formel tex="h" /> einzeln bestimmen, danach <Formel tex={t`V=\frac{1}{3}\cdot G\cdot h`} /> bei der Pyramide bzw. <Formel tex={t`V=G\cdot h`} /> beim Quader. Dieser Weg funktioniert für jede Grundfläche, auch für Vierecke, die du in Dreiecke zerlegst.
      </Hinweis>
      <Hinweis art="merksatz" titel="Weg 2: Vertiefung, Spatprodukt">
        <p>
          Das Spatprodukt <Formel tex={t`(\vec{a}\times\vec{b})\cdot\vec{c}`} /> liefert das Volumen in einer Rechnung. Du setzt nur die drei Vektoren aus einer Ecke ein, Grundfläche und Höhe musst du nicht einzeln bestimmen:
        </p>
        <p>Quader:</p>
        <Umbruchformel tex={t`V=|(${AB}\times${AD})\cdot\overrightarrow{AE}|`} schmal={t`\begin{gathered}\vec{n}=${AB}\times${AD}\\V=|\vec{n}\cdot\overrightarrow{AE}|\end{gathered}`} />
        <p>Pyramide mit Parallelogrammgrundfläche:</p>
        <Umbruchformel tex={t`V=\frac{1}{3}\cdot|(${AB}\times${AD})\cdot${AS}|`} schmal={t`\begin{gathered}\vec{n}=${AB}\times${AD}\\V=\frac{1}{3}\cdot|\vec{n}\cdot${AS}|\end{gathered}`} />
        <p>Pyramide mit Dreiecksgrundfläche (Tetraeder):</p>
        <Umbruchformel tex={t`V=\frac{1}{6}\cdot|(${AB}\times${AC})\cdot${AS}|`} schmal={t`\begin{gathered}\vec{n}=${AB}\times${AC}\\V=\frac{1}{6}\cdot|\vec{n}\cdot${AS}|\end{gathered}`} />
        <p>Beide Wege liefern dasselbe Ergebnis. Weg 2 gehört nicht zum Bildungsplan und kürzt nur die Rechnung ab.</p>
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Die Pyramide hat die Grundfläche <Formel tex={t`${punktTeX('A', A)}`} nach="," /> <Formel tex={punktTeX('B', B)} /> und <Formel tex={punktTeX('C', C)} /> und die Spitze <Formel tex={punktTeX('S', S)} nach="." />
      </p>
      <Figur
        spec={RAUM_PYRAMIDE}
        unter={
          <>
            Die Pyramide mit der Grundebene <Formel tex="E" /> (grau) und der Höhe <Formel tex="SF" /> (orange).
          </>
        }
      />
      <p>Schritt 1: Grundfläche.</p>
      <Zeilen z={spannvektorZeilen(A, B, 'A', 'B')} />
      <Zeilen z={spannvektorZeilen(A, C, 'A', 'C')} />
      <Zeilen z={kreuzZeilen(ab, ac, AB, AC)} />
      <Zeilen z={betragZeilen(dP.n, '\\vec{n}')} />
      <Zeilen z={dreiecksflaecheZeilen(dP.nn)} />
      <p>
        Schritt 2: Grundebene. Die rechte Seite ist <Formel tex={t`b=\vec{n}\cdot\overrightarrow{OA}`} nach=":" />
      </p>
      <Zeilen z={skalarKurz(dP.n, A, 'b=\\vec{n}', '\\overrightarrow{OA}')} />
      <p>
        Also ist <Formel tex={formTeX(dP.form)} nach="." />
      </p>
      <p>Schritt 3: Höhe als Abstand von <Formel tex="S" /> zur Grundebene.</p>
      <Zeilen z={f.zeilen} />
      <p>
        Der Höhenfußpunkt ist <Formel tex={punktBruchTeX('F', dP.F)} nach="," /> denn <Formel tex={t`t_0=${w.t}`} nach="." />
      </p>
      <p>Schritt 4: Volumen.</p>
      <Zeilen z={volumenZeilen(dP)} />
      <p>
        Weg 2 (Vertiefung) mit denselben Vektoren: <Formel tex={t`${AS}=${spalte(as)}`} nach="." />
      </p>
      <Zeilen z={skalarKurz(dP.n, as, '\\vec{n}', AS)} />
      <Zeilen z={{ tex: t`V=\frac{1}{6}\cdot|${dP.spat}|=${dP.V}`, schmal: t`\begin{gathered}V=\frac{1}{6}\cdot|${dP.spat}|\\{}=${dP.V}\end{gathered}` }} />
      <p>Beide Wege ergeben <Formel tex={t`V=${dP.V}`} nach="." /></p>

      <h3>Häufige Fehler</h3>
      <ul>
        <li>Der Faktor <Formel tex={t`\frac{1}{3}`} /> fehlt, dann stimmt das Ergebnis für ein Prisma, nicht für die Pyramide.</li>
        <li>Beim Dreieck fehlt der Faktor <Formel tex={t`\frac{1}{2}`} nach="." /> Der Betrag des Vektorprodukts (Kreuzprodukt) ist der Flächeninhalt des Parallelogramms.</li>
        <li>Die Kante von der Spitze zu einer Ecke wird als Höhe genommen. Die Höhe steht senkrecht auf der Grundebene.</li>
        <li>Die <Formel tex={t`x_3`} />-Koordinate der Spitze wird als Höhe genommen, obwohl die Grundebene nicht die <Formel tex={t`x_1x_2`} />-Ebene ist.</li>
        <li>Mit gerundeten Zwischenwerten gerechnet, dann stimmt die letzte Stelle nicht. Die Wurzeln aus <Formel tex="G" /> und <Formel tex="h" /> kürzen sich oft weg.</li>
        <li>Ein Viereck, das kein Parallelogramm ist, wird mit einem einzigen Kreuzprodukt berechnet. Es muss in zwei Dreiecke zerlegt werden.</li>
      </ul>

      <h3>Weiterführend</h3>
      <p>
        Wie du den Abstand eines Punkts von einer Ebene bestimmst, steht im Modul <Modulverweis modul="abstaende-ebenen">Abstände zu Ebenen</Modulverweis>, das Kreuzprodukt im Modul <Modulverweis modul="vektorprodukt">Das Vektorprodukt</Modulverweis> (Kreuzprodukt), die Koordinatenform im Modul <Modulverweis modul="normalenform-koordinatenform">Normalenform und Koordinatenform</Modulverweis>.
      </p>
    </Abschnitt>
  );
}
