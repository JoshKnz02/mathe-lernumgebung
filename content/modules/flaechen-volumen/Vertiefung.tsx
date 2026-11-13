import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur, KontrollFigur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktTeX } from '@/lib/ebenenhilfen';
import { kreuzZeilen, spatZeilen, volumenSpatZeilen } from '@/lib/koerperhilfen';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { verbindungsvektor } from '@/lib/vektor';
import { RAUM_VEKTOREN, aufg14, dP } from './Bilder';
import { A14, A4, PYRAMIDE } from './daten';

type Z = { tex: string; schmal: string };
const Zeilen = ({ z }: { z: Z }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;
const AB = '\\overrightarrow{AB}';
const AC = '\\overrightarrow{AC}';
const AS = '\\overrightarrow{AS}';
const feld = (id: string, name: string, beschriftung: React.ReactNode, erwartet: number, toleranz?: number): Feld => ({ id, name, beschriftung, erwartet, ...(toleranz ? { toleranz } : {}) });

export function Vertiefung() {
  const ab = verbindungsvektor(PYRAMIDE.A, PYRAMIDE.B);
  const ac = verbindungsvektor(PYRAMIDE.A, PYRAMIDE.C);
  const as = verbindungsvektor(PYRAMIDE.A, PYRAMIDE.S);
  const sp = spatZeilen(ab, ac, as);
  const ab4 = verbindungsvektor(A4.A, A4.B);
  const ac4 = verbindungsvektor(A4.A, A4.C);
  const as4 = verbindungsvektor(A4.A, A4.S);
  const s4 = spatZeilen(ab4, ac4, as4);
  const ab14 = verbindungsvektor(A14.A, A14.B);
  const ac14 = verbindungsvektor(A14.A, A14.C);
  const as14 = verbindungsvektor(A14.A, A14.S);
  const s14 = spatZeilen(ab14, ac14, as14);
  return (
    <Abschnitt id="vertiefung" titel="Vertiefung: Spatprodukt">
      <Hinweis titel="Vertiefung">
        Dieser Abschnitt geht über den Bildungsplan hinaus. Der Bildungsplan nennt für das Volumen nur Quader und Pyramide (BPE 16.6). Das Spatprodukt kürzt die vier Schritte aus dem Erklären zu einer einzigen Rechnung ab. Du kannst jede Pyramide auch mit dem Vorgehen aus dem Abschnitt „Entdecken“ berechnen, es ist die Rechnung, die im Bildungsplan vorkommt.
      </Hinweis>

      <h3>Vermutung 5: Das Volumen direkt aus drei Vektoren</h3>
      <p>
        In Aufgabe 6 ist die Wurzel aus 99 in der Grundfläche und in der Höhe vorgekommen und hat sich beim Volumen weggekürzt. Das ist kein Zufall: <Formel tex="G" /> und <Formel tex="h" /> enthalten beide den Betrag des Normalenvektors <Formel tex={t`\vec{n}`} nach="." />
      </p>
      <ol className="auftraege">
        <li>
          <p>
            Die drei Vektoren <Formel tex={AB} nach="," /> <Formel tex={AC} /> und <Formel tex={AS} /> beginnen alle in <Formel tex="A" nach="." /> Die Grundfläche ist <Formel tex={t`G=\frac{1}{2}\cdot|\vec{n}|`} /> mit <Formel tex={t`\vec{n}=${AB}\times${AC}`} nach="." /> Die Höhe ist der Abstand von <Formel tex="S" /> zur Grundebene durch <Formel tex="A" /> mit dem Normalenvektor <Formel tex={t`\vec{n}`} nach="." /> Setze beides in <Formel tex={t`V=\frac{1}{3}\cdot G\cdot h`} /> ein. Was fällt auf? Prüfe das Ergebnis für die Pyramide aus dem Abschnitt „Entdecken“.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_VEKTOREN}
                unter={
                  <>
                    Die drei Vektoren <Formel tex={AB} /> (blau), <Formel tex={AC} /> (rosa) und <Formel tex={AS} /> (schwarz) aus der Ecke <Formel tex="A" nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Die Höhe ist der Abstand von <Formel tex="S" /> zur Ebene durch <Formel tex="A" /> mit dem Normalenvektor <Formel tex={t`\vec{n}`} nach=":" /> <Formel tex={t`h=\frac{|\vec{n}\cdot${AS}|}{|\vec{n}|}`} nach="." /> Eingesetzt:
            </p>
            <Zeilen z={{ tex: t`V=\frac{1}{3}\cdot\frac{1}{2}\cdot|\vec{n}|\cdot\frac{|\vec{n}\cdot${AS}|}{|\vec{n}|}=\frac{1}{6}\cdot|\vec{n}\cdot${AS}|`, schmal: t`\begin{gathered}V=\frac{1}{3}\cdot\frac{1}{2}\cdot|\vec{n}|\cdot\frac{|\vec{n}\cdot${AS}|}{|\vec{n}|}\\{}=\frac{1}{6}\cdot|\vec{n}\cdot${AS}|\end{gathered}` }} />
            <p>
              Der Betrag <Formel tex={t`|\vec{n}|`} /> kürzt sich weg, es bleibt nur eine Zahl: das Skalarprodukt von <Formel tex={t`\vec{n}`} /> mit <Formel tex={AS} nach="." /> Für die Pyramide aus dem Abschnitt „Entdecken“ ist <Formel tex={t`\vec{n}=${spalte(dP.n)}`} /> und <Formel tex={t`${AS}=${spalte(as)}`} nach=":" />
            </p>
            <Zeilen z={{ tex: t`\vec{n}\cdot${AS}=${sp.skalar.tex}`, schmal: sp.skalar.schmal }} />
            <p>
              Also ist <Formel tex={t`V=\frac{1}{6}\cdot|${sp.wert}|=6`} nach="," /> dasselbe Ergebnis wie mit Grundfläche und Höhe.
            </p>
            <p>
              Vermutung: Das Volumen einer Pyramide mit Dreiecksgrundfläche (ein Tetraeder) ist ein Sechstel des Betrags von <Formel tex={t`(${AB}\times${AC})\cdot${AS}`} nach="." />
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Spatprodukt</h3>
      <p>
        Drei Vektoren <Formel tex={t`\vec{a}`} nach="," /> <Formel tex={t`\vec{b}`} /> und <Formel tex={t`\vec{c}`} /> aus einer Ecke spannen einen <strong>Spat</strong> auf, einen schiefen Quader (ein Parallelepiped). Die Zahl <Formel tex={t`(\vec{a}\times\vec{b})\cdot\vec{c}`} /> heißt <strong>Spatprodukt</strong>.
      </p>
      <Hinweis art="merksatz" titel="Spatprodukt und Volumen">
        <p>
          Das Volumen des Spats ist <Formel tex={t`V=|(\vec{a}\times\vec{b})\cdot\vec{c}|`} nach="," /> denn <Formel tex={t`|\vec{a}\times\vec{b}|`} /> ist die Grundfläche und <Formel tex={t`\frac{|(\vec{a}\times\vec{b})\cdot\vec{c}|}{|\vec{a}\times\vec{b}|}`} /> die Höhe. Mit <Formel tex={AB} nach="," /> <Formel tex={AC} /> und <Formel tex={AS} /> gilt für das Volumen der Pyramiden:
        </p>
        <ul>
          <li>Pyramide mit der Parallelogramm-Grundfläche aus <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} nach=":" /> <Formel tex={t`V=\frac{1}{3}\cdot|(\vec{a}\times\vec{b})\cdot\vec{c}|`} nach="."/></li>
          <li>Pyramide mit der Dreiecks-Grundfläche (Tetraeder): <Formel tex={t`V=\frac{1}{6}\cdot|(\vec{a}\times\vec{b})\cdot\vec{c}|`} nach="."/></li>
        </ul>
        Das Vorzeichen des Spatprodukts hängt von der Reihenfolge der Vektoren ab, deshalb steht der Betrag. Der Faktor <Formel tex={t`\frac{1}{3}`} /> gilt für eine Parallelogramm-Grundfläche, nicht für jedes Viereck. Beim Tetraeder kommt die Halbierung der Grundfläche hinzu: <Formel tex={t`\frac{1}{6}=\frac{1}{3}\cdot\frac{1}{2}`} nach="." />
      </Hinweis>
      <p>
        Die Höhe ergibt sich aus der Abstandsformel (Modul <Modulverweis modul="abstaende-ebenen">Abstände zu Ebenen</Modulverweis>) mit der Ebene durch den Anfangspunkt, die zu <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} /> parallel ist, und dem Normalenvektor <Formel tex={t`\vec{a}\times\vec{b}`} nach="." /> Beim Spat bleibt das Spatprodukt, beim Tetraeder und der Pyramide kommt der Faktor dazu.
      </p>

      <Aufgabe
        nummer={13}
        titel="Dieselbe Pyramide mit dem Spatprodukt"
        felder={[feld('s', 'Spatprodukt', <>Spatprodukt</>, 18), feld('v', 'Volumen V in Volumeneinheiten', <>Volumen <Formel tex="V" /></>, A4.V)]}
        hilfen={[
          <>Nimm die Vektoren <Formel tex={AB} nach="," /> <Formel tex={AC} /> und <Formel tex={AS} /> aus der Ecke <Formel tex="A" nach="." /> Den Normalenvektor <Formel tex={t`\overrightarrow{AB}\times\overrightarrow{AC}`} /> hast du aus Aufgabe 4.</>,
          <>Das Spatprodukt ist das Skalarprodukt von <Formel tex={t`\vec{n}`} /> mit <Formel tex={AS} nach="." /> Das Volumen der Pyramide mit Dreiecksgrundfläche ist ein Sechstel des Betrags.</>,
        ]}
        loesung={[
          <>Normalenvektor aus Aufgabe 4: <Zeilen z={kreuzZeilen(ab4, ac4, AB, AC)} /></>,
          <>Der Vektor zur Spitze ist <Formel tex={t`${AS}=${spalte(as4)}`} nach="." /> Spatprodukt: <Zeilen z={{ tex: t`\vec{n}\cdot${AS}=${s4.skalar.tex}`, schmal: s4.skalar.schmal }} /></>,
          <>Volumen: <Zeilen z={volumenSpatZeilen(s4.wert, 6)} /> Das stimmt mit dem Ergebnis aus Aufgabe 6 überein, ohne Wurzeln und ohne die Höhe.</>,
        ]}
      >
        <p>
          Berechne das Volumen der Pyramide aus den Aufgaben 4 bis 6 noch einmal, jetzt mit dem Spatprodukt <Formel tex={t`(${AB}\times${AC})\cdot${AS}`} nach="." /> Vergleiche mit Aufgabe 6.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={14}
        titel="Ein Tetraeder"
        felder={[feld('s', 'Spatprodukt', <>Spatprodukt</>, A14.spat), feld('v', 'Volumen V in Volumeneinheiten', <>Volumen <Formel tex="V" /></>, Math.round(A14.V * 100) / 100, 0.01)]}
        hilfen={[
          <>Bestimme die Vektoren <Formel tex={AB} nach="," /> <Formel tex={AC} /> und <Formel tex={AS} nach="." /> Berechne zuerst <Formel tex={t`${AB}\times${AC}`} nach="," /> danach das Skalarprodukt mit <Formel tex={AS} nach="." /></>,
          <>Ein Tetraeder hat ein Sechstel des Volumens des Spats.</>,
        ]}
        loesung={[
          <>Vektoren: <Formel tex={t`${AB}=${spalte(ab14)}`} nach="," /> <Formel tex={t`${AC}=${spalte(ac14)}`} /> und <Formel tex={t`${AS}=${spalte(as14)}`} nach="." /></>,
          <>Kreuzprodukt: <Zeilen z={s14.kreuz} /></>,
          <>Spatprodukt: <Zeilen z={{ tex: t`(${AB}\times${AC})\cdot${AS}=${s14.skalar.tex}`, schmal: s14.skalar.schmal }} /></>,
          <>Volumen: <Zeilen z={volumenSpatZeilen(s14.wert, 6)} /></>,
        ]}
      >
        <p>
          Das Tetraeder hat die Ecken <Formel tex={punktTeX('A', A14.A)} nach="," /> <Formel tex={punktTeX('B', A14.B)} nach="," /> <Formel tex={punktTeX('C', A14.C)} /> und <Formel tex={punktTeX('S', A14.S)} nach="." /> Berechne sein Volumen mit dem Spatprodukt.
        </p>
        <KontrollFigur spec={aufg14} unter={<>Das Tetraeder mit der Grundfläche <Formel tex="ABC" /> (blau) und der Spitze <Formel tex="S" nach="." /></>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="15"
        titel="Welcher Faktor gehört zum Volumen?"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`V=15`} />, true, <>Richtig. Die Grundfläche ist ein Parallelogramm, deshalb gilt <Formel tex={t`V=\frac{1}{3}\cdot|-45|=15`} nach="." /></>),
            opt('b', <Formel tex={t`V=45`} />, false, <>Das ist das Volumen des Spats. Die Pyramide hat nur ein Drittel davon.</>),
            opt('c', <Formel tex={t`V=7{,}5`} />, false, <>Hier wurde der Faktor <Formel tex={t`\frac{1}{6}`} /> für das Tetraeder benutzt. Er gilt für eine Dreiecksgrundfläche, nicht für ein Parallelogramm.</>),
            opt('d', <Formel tex={t`V=-15`} />, false, <>Ein Volumen ist nie negativ. Das Vorzeichen des Spatprodukts hängt nur von der Reihenfolge der Vektoren ab, deshalb steht der Betrag.</>),
          ],
          2,
        )}
        erklaerung={<>Bei einer Pyramide über dem Parallelogramm <Formel tex="ABCD" /> ist <Formel tex={t`V=\frac{1}{3}\cdot|(${AB}\times\overrightarrow{AD})\cdot${AS}|`} nach="." /> Eine Pyramide über dem Dreieck <Formel tex="ABD" /> hätte nur die Hälfte, nämlich 7,5 VE.</>}
      >
        <p>
          Eine Pyramide hat das Parallelogramm <Formel tex="ABCD" /> als Grundfläche und die Spitze <Formel tex="S" nach="." /> Das Spatprodukt <Formel tex={t`(\overrightarrow{AB}\times\overrightarrow{AD})\cdot${AS}`} /> hat den Wert −45. Welches Volumen hat die Pyramide?
        </p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
