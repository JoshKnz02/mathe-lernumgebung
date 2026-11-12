import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { abstandPunktEbene } from '@/lib/abstandebene';
import { abstandMitWert, formelZeilen, formTeX, spiegelZeilen, weg1 } from '@/lib/abstandebenehilfen';
import { punktBruchTeX, punktTeX } from '@/lib/geradenhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_LOT } from './Bilder';
import { BEISPIEL, E } from './daten';

const Z = ({ z }: { z: { tex: string; schmal: string } }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;

export function Zusammenfassung() {
  const q = BEISPIEL.Q;
  const r = abstandPunktEbene(E, q);
  const w = weg1(E, q);
  const f = formelZeilen(E, q);
  const s = spiegelZeilen(E, q);
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Abstand Punkt und Ebene</h3>
      <Hinweis art="merksatz" titel="Abstand, Lot und Lotfußpunkt">
        Der Abstand <Formel tex="d" /> eines Punkts <Formel tex="Q" /> von einer Ebene <Formel tex="E" /> ist die kürzeste Entfernung von <Formel tex="Q" /> zu den Punkten von <Formel tex="E" nach="." /> Sie ist die Länge des Lots. Das Lot ist die Strecke von <Formel tex="Q" /> zum Lotfußpunkt <Formel tex="F" nach="," /> sie steht senkrecht auf der Ebene und hat die Richtung des Normalenvektors <Formel tex={t`\vec{n}`} nach="." /> Liegt <Formel tex="Q" /> in der Ebene, ist <Formel tex={t`d=0`} nach="." />
      </Hinweis>
      <Hinweis art="merksatz" titel="Weg 1: Lotgerade">
        Stelle die Gerade durch <Formel tex="Q" /> mit dem Richtungsvektor <Formel tex={t`\vec{n}`} /> auf und schneide sie mit der Ebene (Geradenprobe, ergibt <Formel tex={t`t_0`} nach=")." /> Der Lotfußpunkt ist <Formel tex={t`\overrightarrow{OF}=\overrightarrow{OQ}+t_0\cdot\vec{n}`} nach="," /> der Abstand ist <Formel tex={t`d=|t_0|\cdot|\vec{n}|`} nach="." />
      </Hinweis>
      <Hinweis art="merksatz" titel="Weg 2: Abstandsformel">
        Für <Formel tex={t`E:\ n_1x_1+n_2x_2+n_3x_3=b`} /> und <Formel tex={t`Q(q_1\,|\,q_2\,|\,q_3)`} /> gilt <Umbruchformel tex={f.allgemein} schmal={f.allgemeinSchmal} />
        mit <Formel tex={t`\vec{n}\cdot\vec{q}=n_1q_1+n_2q_2+n_3q_3`} /> und <Formel tex={t`|\vec{n}|=\sqrt{n_1^2+n_2^2+n_3^2}`} nach="." />
        Der Zähler ist der Betrag des Terms <Formel tex={t`n_1q_1+n_2q_2+n_3q_3-b`} nach="," /> der Nenner der Betrag des Normalenvektors. Die Formel liefert nur den Abstand, nicht den Lotfußpunkt.
      </Hinweis>

      <h3>Gerade, parallele Ebenen und Spiegelung</h3>
      <Hinweis art="merksatz" titel="Abstand Gerade und Ebene">
        Nur bei einer Geraden, die echt parallel zur Ebene ist (<Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> und der Stützpunkt liegt nicht in <Formel tex="E" nach="),"/> ist der Abstand größer als 0. Er ist der Abstand eines beliebigen Punkts von <Formel tex="g" /> zur Ebene, am einfachsten des Stützpunkts. Schneidet <Formel tex="g" /> die Ebene oder liegt in ihr, ist der Abstand 0.
      </Hinweis>
      <Hinweis art="merksatz" titel="Abstand paralleler Ebenen">
        Zwei Ebenen sind echt parallel, wenn ihre Normalenvektoren Vielfache sind und die Ebenen nicht identisch sind. Ihr Abstand ist der Abstand eines beliebigen Punkts der einen Ebene zur anderen Ebene. Sind die Normalenvektoren Vielfache, aber nicht gleich, teilst du eine Gleichung zuerst durch den Faktor oder rechnest mit einem Punkt. Schneiden sich die Ebenen oder sind sie identisch, ist der Abstand 0.
      </Hinweis>
      <Hinweis art="merksatz" titel="Spiegelpunkt">
        Der Spiegelpunkt <Formel tex={t`Q'`} /> liegt auf der Lotgeraden durch <Formel tex="Q" /> so weit hinter der Ebene wie <Formel tex="Q" /> davor. Der Lotfußpunkt <Formel tex="F" /> ist die Mitte von <Formel tex={t`QQ'`} nach=":" /> <Formel tex={t`\overrightarrow{OQ'}=\overrightarrow{OQ}+2t_0\cdot\vec{n}=2\cdot\overrightarrow{OF}-\overrightarrow{OQ}`} nach="." />
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben sind <Formel tex={formTeX(E)} /> und <Formel tex={punktTeX('Q', q)} nach="." /> Weg 1: Die Lotgerade
      </p>
      <Umbruchformel tex={w.lotgerade} schmal={w.lotgeradeSchmal} />
      <p>führt in die Ebenengleichung eingesetzt zu:</p>
      <Z z={w.probe} />
      <p>
        Aus <Formel tex={w.probe.gleichung} /> folgt <Formel tex={t`t_0=${w.t}`} nach="." /> Lotfußpunkt:
      </p>
      <Z z={w.fuss} />
      <p>Mit <Formel tex={t`|\vec{n}|=3`} nach=":" /></p>
      <Z z={w.abstand} />
      <p>Weg 2 liefert denselben Abstand:</p>
      <Z z={f.zeilen} />
      <p>Spiegelpunkt:</p>
      <Z z={{ tex: s.tex, schmal: s.schmal }} />
      <Figur spec={RAUM_LOT} unter={<>Das Lot von <Formel tex="Q" /> auf die Ebene: Lotfußpunkt <Formel tex={punktBruchTeX('F', r.F)} nach="," /> Abstand <Formel tex={t`d=${abstandMitWert(r.z, r.nn)}`} nach="." /></>} />

      <h3>Abstände im Raum auf einen Blick</h3>
      <ul className="liste-ohne-zahl" aria-label="Übersicht der Abstände im Raum">
        <li>Punkt und Punkt: Betrag des Verbindungsvektors (<Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>).</li>
        <li>Punkt und Gerade, parallele Geraden: Lotfußpunkt über die Orthogonalität oder Formel mit dem Vektorprodukt (Kreuzprodukt) (<Modulverweis modul="abstaende-geraden">Abstand Punkt und Gerade, paralleler Geraden</Modulverweis>).</li>
        <li>Punkt und Ebene: Lotgerade (Weg 1) oder Abstandsformel (Weg 2).</li>
        <li>Gerade und Ebene: nur bei echt parallel, Abstand eines Punkts der Geraden zur Ebene.</li>
        <li>Parallele Ebenen: Abstand eines Punkts der einen Ebene zur anderen Ebene.</li>
      </ul>
      <Hinweis titel="Häufige Fehler">
        Den Betrag im Zähler vergessen, sodass der Abstand negativ wird. Die Division durch <Formel tex={t`|\vec{n}|`} /> vergessen oder durch <Formel tex={t`|\vec{n}|^2`} /> teilen. Bei <Formel tex={t`n_1x_1+n_2x_2+n_3x_3=b`} /> das Vorzeichen von <Formel tex="b" /> falsch einsetzen (es wird abgezogen). Bei parallelen Ebenen mit verschiedenen Normalenvektoren die rechten Seiten ohne Umrechnung voneinander abziehen. Bei einer Geraden den Abstand berechnen, ohne vorher zu prüfen, ob sie echt parallel zur Ebene ist. Den Lotfußpunkt mit dem Spiegelpunkt verwechseln (<Formel tex={t`t_0`} /> statt <Formel tex={t`2t_0`} nach=")." />
      </Hinweis>
    </Abschnitt>
  );
}
