import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { formelZeilen, formTeX, weg1 } from '@/lib/abstandebenehilfen';
import { punktTeX, skalarZeilen } from '@/lib/ebenenhilfen';
import { punktBruchTeX } from '@/lib/geradenhilfen';
import { dreiecksflaecheZeilen, kreuzZeilen, skalarKurz, spannvektorZeilen, volumenZeilen } from '@/lib/koerperhilfen';
import { quader } from '@/lib/koerper';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { verbindungsvektor } from '@/lib/vektor';
import { RAUM_PYRAMIDE, RAUM_QUADER, RAUM_ZWEI_SPITZEN, dP } from './Bilder';
import { PYRAMIDE, QUADER, SPITZE2 } from './daten';
import { Pyramidenlabor } from './Labor';

type Z = { tex: string; schmal: string };
const Zeilen = ({ z }: { z: Z }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;
const AB = '\\overrightarrow{AB}';
const AD = '\\overrightarrow{AD}';
const AE = '\\overrightarrow{AE}';
const AC = '\\overrightarrow{AC}';

export function Entdecken() {
  const q = quader(QUADER.A, QUADER.B, QUADER.D, QUADER.E);
  const ab = q.u;
  const ad = q.v;
  const ae = q.w;
  const [A, B, C, S] = [PYRAMIDE.A, PYRAMIDE.B, PYRAMIDE.C, PYRAMIDE.S];
  const ab3 = verbindungsvektor(A, B);
  const ac3 = verbindungsvektor(A, C);
  const kreuz = kreuzZeilen(ab3, ac3, AB, AC);
  const flaeche = dreiecksflaecheZeilen(dP.nn);
  const betragN = { tex: t`|\vec{n}|=\sqrt{(-8)^2+(-8)^2+4^2}=\sqrt{144}=12`, schmal: t`\begin{gathered}|\vec{n}|^2=64+64+16\\{}=144\\|\vec{n}|=12\end{gathered}` };
  const f = formelZeilen(dP.form, S);
  const w = weg1(dP.form, S);
  const vol = volumenZeilen(dP);
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Ein Quader aus vier Ecken</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Von einem Quader sind die Ecken <Formel tex={punktTeX('A', QUADER.A)} nach="," /> <Formel tex={punktTeX('B', QUADER.B)} nach="," /> <Formel tex={punktTeX('D', QUADER.D)} /> und <Formel tex={punktTeX('E', QUADER.E)} /> gegeben, im Bild steht er mit allen Ecken. Wie findest du die Ecke <Formel tex="C" /> und die Ecken der Deckfläche? Woran erkennst du, dass die Kanten bei <Formel tex="A" /> senkrecht aufeinander stehen? Wie berechnest du daraus das Volumen?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_QUADER}
                unter={
                  <>
                    Der Quader mit <Formel tex={t`G=\sqrt{6}`} nach="," /> <Formel tex={t`h=\sqrt{6}`} /> und <Formel tex={t`V=6`} nach="." /> Die Ecke <Formel tex="C" /> erreichst du von <Formel tex="B" /> aus mit dem Vektor <Formel tex={AD} nach="," /> die Deckfläche liegt um <Formel tex={AE} /> über der Grundfläche.
                  </>
                }
              />
            }
          >
            <p>
              Die Kanten sind Verbindungsvektoren: <Formel tex={t`${AB}=${spalte(ab)}`} nach="," /> <Formel tex={t`${AD}=${spalte(ad)}`} /> und <Formel tex={t`${AE}=${spalte(ae)}`} nach="." /> Die Ecke <Formel tex="C" /> liegt gegenüber von <Formel tex="A" /> in der Grundfläche: <Formel tex={t`\overrightarrow{OC}=\overrightarrow{OB}+${AD}=${spalte(q.ecken[2]!)}`} nach="." /> Die Deckfläche entsteht, wenn du jede Ecke der Grundfläche um <Formel tex={AE} /> verschiebst.
            </p>
            <p>Die Kanten stehen senkrecht aufeinander, wenn die Skalarprodukte 0 sind:</p>
            <Zeilen z={skalarKurz(ab, ad, AB, AD)} />
            <Zeilen z={skalarKurz(ab, ae, AB, AE)} />
            <Zeilen z={skalarKurz(ad, ae, AD, AE)} />
            <p>Die Kantenlängen sind die Beträge der Kantenvektoren, die Grundfläche das Produkt der Längen von <Formel tex={AB} /> und <Formel tex={AD} nach=":" /></p>
            <Zeilen z={{ tex: t`G=|${AB}|\cdot|${AD}|=\sqrt{2}\cdot\sqrt{3}=\sqrt{6}`, schmal: t`\begin{gathered}G=|${AB}|\cdot|${AD}|\\{}=\sqrt{2}\cdot\sqrt{3}\\{}=\sqrt{6}\end{gathered}` }} />
            <p>
              Die Höhe ist <Formel tex={t`h=|${AE}|=\sqrt{6}`} nach="." /> Also ist <Formel tex={t`V=G\cdot h=\sqrt{6}\cdot\sqrt{6}=6`} nach="." />
            </p>
            <p>
              Vermutung: Die übrigen Ecken erhältst du durch Addieren der Kantenvektoren. Es ist ein Quader, wenn die drei Skalarprodukte der Kantenvektoren an einer Ecke 0 sind. Das Volumen ist das Produkt der drei Kantenlängen.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Wovon hängt das Volumen einer Pyramide ab?</h3>
      <p>
        Im Pyramidenlabor bleibt das Dreieck <Formel tex="ABC" /> in seiner Ebene <Formel tex="E" nach="." /> Du verschiebst die Spitze <Formel tex="S" nach=":" /> mit <Formel tex="a" /> und <Formel tex="b" /> parallel zur Grundebene, mit <Formel tex="c" /> senkrecht zu ihr. Die Höhe und die Werte blendest du ein, wenn du eine Vermutung hast. Das Labor zeigt Pyramiden nur im Raum. Über dem Bild wählst du zwischen Schrägbild und räumlicher Ansicht.
      </p>
      <Pyramidenlabor />
      <ol className="auftraege">
        <li>
          <p>
            Was passiert mit dem Volumen, wenn du die Spitze parallel zur Grundebene verschiebst? Was passiert, wenn du sie senkrecht zur Grundebene verschiebst, also die Höhe veränderst? Was bedeutet das für die Größe, die das Volumen bestimmt?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_ZWEI_SPITZEN}
                unter={
                  <>
                    Die Spitzen <Formel tex={punktTeX('S', S)} /> und <Formel tex={punktTeX('S_2', SPITZE2)} /> liegen in einer Ebene parallel zur Grundebene, beide Pyramiden haben dieselbe Höhe 3 und dasselbe Volumen.
                  </>
                }
              />
            }
          >
            <p>
              Verschiebst du <Formel tex="S" /> parallel zur Grundebene, ändert sich das Volumen nicht, denn die Höhe <Formel tex="h" /> bleibt gleich, nur der Höhenfußpunkt wandert mit. Die Pyramide kann dabei sehr schief werden. Verschiebst du <Formel tex="S" /> senkrecht zur Grundebene, ändert sich die Höhe, und das Volumen ändert sich im selben Verhältnis: Doppelte Höhe ergibt doppeltes Volumen. Bei <Formel tex={t`c=0`} /> liegt <Formel tex="S" /> in der Grundebene, die Höhe und das Volumen sind 0.
            </p>
            <p>
              Vermutung: Das Volumen einer Pyramide hängt nur von der Grundfläche <Formel tex="G" /> und der Höhe <Formel tex="h" /> ab. Wo die Spitze über der Grundebene liegt, spielt keine Rolle, nur ihr Abstand zur Grundebene.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Wie berechnest du die Grundfläche?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Das Dreieck <Formel tex="ABC" /> mit <Formel tex={punktTeX('A', A)} nach="," /> <Formel tex={punktTeX('B', B)} /> und <Formel tex={punktTeX('C', C)} /> ist die Grundfläche. Die beiden Spannvektoren <Formel tex={AB} /> und <Formel tex={AC} /> gehen von <Formel tex="A" /> aus. Überlege, wie du aus ihnen den Flächeninhalt bestimmen kannst. Das Vektorprodukt (Kreuzprodukt) hilft dir.
          </p>
          <Beobachtung>
            <Zeilen z={spannvektorZeilen(A, B, 'A', 'B')} />
            <Zeilen z={spannvektorZeilen(A, C, 'A', 'C')} />
            <p>Das Vektorprodukt (Kreuzprodukt) ist der Normalenvektor der Grundebene:</p>
            <Zeilen z={kreuz} />
            <p>
              Sein Betrag ist der Flächeninhalt des Parallelogramms, das <Formel tex={AB} /> und <Formel tex={AC} /> aufspannen, das Dreieck hat die Hälfte davon:
            </p>
            <Zeilen z={betragN} />
            <Zeilen z={flaeche} />
            <p>
              Vermutung: Für ein Dreieck gilt <Formel tex={t`G=\frac{1}{2}\cdot|\overrightarrow{AB}\times\overrightarrow{AC}|`} nach="," /> für ein Parallelogramm <Formel tex={t`G=|\overrightarrow{AB}\times\overrightarrow{AD}|`} nach="." /> Bei einem Rechteck sind <Formel tex={AB} /> und <Formel tex={AD} /> senkrecht, es genügt <Formel tex={t`G=|${AB}|\cdot|${AD}|`} nach="." /> Ein allgemeines Viereck zerlegst du in zwei Dreiecke und addierst ihre Flächeninhalte.
            </p>
            <p>Die Herleitung über den Sinus steht in der Vertiefung des Moduls <Modulverweis modul="vektorprodukt" abschnitt="vertiefung">Das Vektorprodukt</Modulverweis> (Kreuzprodukt).</p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 4: Wie berechnest du die Höhe?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Die Höhe ist der Abstand der Spitze <Formel tex={punktTeX('S', S)} /> von der Grundebene. Stelle die Koordinatenform der Grundebene auf (der Normalenvektor ist schon bekannt) und bestimme den Abstand von <Formel tex="S" nach="." /> Wo liegt der Höhenfußpunkt? Berechne dann das Volumen.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PYRAMIDE}
                unter={
                  <>
                    Die Höhe <Formel tex="SF" /> (orange) steht senkrecht auf der Grundebene, der Höhenfußpunkt <Formel tex={punktBruchTeX('F', dP.F)} /> liegt im Dreieck <Formel tex="ABC" nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Mit <Formel tex={t`\vec{n}=${spalte(dP.n)}`} /> und dem Punkt <Formel tex="A" /> ist <Formel tex={t`b=\vec{n}\cdot\overrightarrow{OA}=${skalarZeilen(dP.n, A).tex}`} nach="." /> Die Grundebene hat die Koordinatenform <Formel tex={formTeX(dP.form)} nach="." /> Teilst du durch <Formel tex="-4" nach="," /> ergibt sich <Formel tex={formTeX({ n: [2, 2, -1], d: dP.form.d / -4 }, '')} nach="." /> Der Abstand von <Formel tex="S" /> zur Ebene ist die Höhe (Weg 2 aus dem Modul <Modulverweis modul="abstaende-ebenen">Abstände zu Ebenen</Modulverweis>):
            </p>
            <Zeilen z={f.zeilen} />
            <p>
              Mit dem Weg 1 (Lotgerade durch <Formel tex="S" /> mit dem Richtungsvektor <Formel tex={t`\vec{n}`} nach=")" /> erhältst du den Höhenfußpunkt <Formel tex={punktBruchTeX('F', dP.F)} nach="." /> Die Höhe ist die Länge der Strecke <Formel tex="SF" nach=":" /> <Formel tex={t`h=|t_0|\cdot|\vec{n}|=${w.t.startsWith('-') ? w.t.slice(1) : w.t}\cdot 12=3`} nach="." /> Zusammen mit der Grundfläche aus Vermutung 3 folgt das Volumen:
            </p>
            <Zeilen z={vol} />
            <p>
              Vermutung: Die Höhe ist der Abstand der Spitze von der Grundebene (Koordinatenform aus <Formel tex={t`\vec{n}=\overrightarrow{AB}\times\overrightarrow{AC}`} /> und <Formel tex={t`b=\vec{n}\cdot\overrightarrow{OA}`} nach=")." /> Der Höhenfußpunkt muss dabei nicht im Dreieck liegen, das Volumen hängt nur von <Formel tex="G" /> und <Formel tex="h" /> ab.
            </p>
          </Beobachtung>
        </li>
      </ol>
      <Hinweis titel="Hinweis zum Parallelogramm">
        Hat die Grundfläche vier Ecken, reichen zur Grundebene drei von ihnen. Bei einem Parallelogramm <Formel tex="ABCD" /> ist der Flächeninhalt der Betrag von <Formel tex={t`${AB}\times${AD}`} nach="," /> bei einem Rechteck das Produkt der Kantenlängen. Ein Beispiel: für <Formel tex={t`\overrightarrow{AB}=\begin{pmatrix}2\\1\\0\end{pmatrix}`} /> und <Formel tex={t`\overrightarrow{AD}=\begin{pmatrix}-1\\2\\0\end{pmatrix}`} /> ist <Formel tex={t`G=\sqrt{5}\cdot\sqrt{5}=5`} nach="." />
      </Hinweis>
    </Abschnitt>
  );
}
