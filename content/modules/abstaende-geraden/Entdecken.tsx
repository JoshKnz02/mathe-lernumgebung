import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { geradenpunkt, lot } from '@/lib/gerade';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { betrag, verbindungsvektor } from '@/lib/vektor';
import { RAUM_BEISPIEL, RAUM_PARALLEL } from './Bilder';
import { BEISPIEL, PARALLEL } from './daten';
import { Lotfusslabor, Parallellabor } from './Labor';
import { gl, glSchmal, rund2, wurzelTeX } from './rechenhilfen';

export function Entdecken() {
  const b = BEISPIEL;
  const p = PARALLEL;
  const zeilen = [0, 1, 2, 3].map((tt) => {
    const X = geradenpunkt(b.g, tt);
    const d2 = Math.round(betrag(verbindungsvektor(X, b.Q)) ** 2);
    return { tt, X, d2, d: Math.sqrt(d2) };
  });
  const lp = lot(p.g, p.h.p);
  const X1 = geradenpunkt(p.h, 1);
  const l1 = lot(p.g, X1);
  const dStuetz2 = Math.round(betrag(verbindungsvektor(p.g.p, p.h.p)) ** 2);
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Wo auf der Geraden ist der Abstand am kleinsten?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>Gegeben sind</p>
          <Umbruchformel tex={gl(b.g)} schmal={glSchmal(b.g)} />
          <p>
            und der Punkt <Formel tex={punktTeX('Q', b.Q)} nach="." /> Berechne den Abstand <Formel tex={t`|\overrightarrow{XQ}|`} /> des Punkts <Formel tex="Q" /> zum Punkt <Formel tex={t`X=g(t)`} /> für <Formel tex={t`t=0`} nach="," /> <Formel tex="t=1" nach="," /> <Formel tex="t=2" /> und <Formel tex="t=3" nach="." /> Was fällt auf? Bei welchem <Formel tex="t" /> ist der Abstand am kleinsten?
          </p>
          <Beobachtung
            bild={<Figur spec={RAUM_BEISPIEL} unter={<>Der Punkt <Formel tex="Q" /> und die Strecken zu <Formel tex="g" nach=":" /> die orange Strecke zu <Formel tex="F" /> ist die kürzeste.</>} />}
          >
            <ul className="liste-ohne-zahl" aria-label="Abstände zu verschiedenen Punkten von g">
              {zeilen.map((z) => (
                <li key={z.tt}>
                  <Formel tex={t`t=${z.tt}`} nach=":" /> <Formel tex={punktTeX('X', z.X)} nach="," /> <Formel tex={t`|\overrightarrow{XQ}|=${wurzelTeX(z.d2)}\approx ${rund2(z.d)}`} nach="." />
                </li>
              ))}
            </ul>
            <p>
              Der Abstand wird zuerst kleiner, ist bei <Formel tex={t`t=${b.t0}`} /> am kleinsten (<Formel tex={t`${wurzelTeX(b.d2)}\approx ${rund2(Math.sqrt(b.d2))}`} nach=")" /> und wird danach wieder größer. Bei <Formel tex="t=1" /> und <Formel tex="t=3" /> ist er gleich groß, die Werte liegen symmetrisch zum kleinsten. Vermutung: Es gibt genau einen Punkt von <Formel tex="g" /> mit dem kleinsten Abstand, den Lotfußpunkt <Formel tex={punktTeX('F', b.F)} nach="." />
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Lotfußlabor</h3>
      <p>
        Die Gerade <Formel tex="g" /> ist fest. Stelle den Punkt <Formel tex="Q" /> und den Parameter <Formel tex="t" /> des Punkts <Formel tex="X" /> auf <Formel tex="g" /> mit den Reglern ein. Der Abstand, das Skalarprodukt und die Kurve blendest du ein, wenn du eine Vermutung hast, ebenso den Lotfußpunkt. Liegt ein Punkt außerhalb des gezeichneten Koordinatensystems, wird er nicht gezeichnet, die Rechnung gilt trotzdem.
      </p>
      <Lotfusslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle <Formel tex="t" /> so ein, dass der Abstand <Formel tex={t`|\overrightarrow{XQ}|`} /> am kleinsten ist. Was fällt beim Skalarprodukt <Formel tex={t`\overrightarrow{XQ}\cdot\vec{u}`} /> auf? Wie liegen die Strecke <Formel tex="FQ" /> und die Gerade <Formel tex="g" /> zueinander? Das Skalarprodukt steht im Modul <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>.
          </p>
          <Beobachtung>
            Beim kleinsten Abstand ist das Skalarprodukt <Formel tex={t`\overrightarrow{XQ}\cdot\vec{u}`} /> gleich 0: Der Vektor <Formel tex={t`\overrightarrow{FQ}`} /> steht senkrecht auf dem Richtungsvektor <Formel tex={t`\vec{u}`} nach="," /> die Strecke <Formel tex="FQ" /> steht also senkrecht auf <Formel tex="g" nach="." /> So eine senkrechte Strecke heißt auch Lot, daher der Name Lotfußpunkt: Der Punkt <Formel tex="F" /> ist der Fuß des Lots von <Formel tex="Q" /> auf <Formel tex="g" nach="." /> Vermutung: Der Abstand ist am kleinsten, wenn <Formel tex={t`\overrightarrow{XQ}\cdot\vec{u}=0`} /> gilt. Das gilt für jeden Punkt <Formel tex="Q" nach="," /> auch wenn du ihn verschiebst.
          </Beobachtung>
        </li>
        <li>
          <p>
            Verschiebe den Punkt <Formel tex="Q" nach="." /> Ändert sich der Wert <Formel tex={t`t_0`} nach="," /> bei dem der Abstand am kleinsten ist? Welche Form hat die Kurve von <Formel tex={t`D(t)=|\overrightarrow{XQ}|^2`} nach="?" /> Wo liegt der kleinste Wert?
          </p>
          <Beobachtung>
            Der Wert <Formel tex={t`t_0`} /> ändert sich mit <Formel tex="Q" nach="." /> Die Kurve ist immer eine nach oben geöffnete Parabel, der kleinste Wert liegt am Scheitel. Die Wurzel wird mit ihrem Inhalt größer und kleiner, deshalb liegt der kleinste Abstand an derselben Stelle wie der kleinste Wert von <Formel tex="D(t)" nach="." /> Vermutung: Du findest den Abstand auch, indem du <Formel tex="D(t)" /> am Scheitel auswertest, zum Beispiel mit der Ableitung (siehe <Modulverweis modul="optimierung">Optimierung</Modulverweis>).
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Abstand paralleler Geraden</h3>
      <ol className="auftraege">
        <li>
          <p>Gegeben sind die parallelen Geraden</p>
          <Umbruchformel tex={gl(p.g)} schmal={glSchmal(p.g)} />
          <Umbruchformel tex={gl(p.h, 'h', 's')} schmal={glSchmal(p.h, 'h', 's')} />
          <p>
            Berechne den Abstand des Stützpunkts <Formel tex={punktTeX('Q', p.h.p)} /> von <Formel tex="h" /> zur Geraden <Formel tex="g" nach="," /> dann den Abstand des Punkts <Formel tex={punktTeX('X', X1)} /> von <Formel tex="h" /> (für <Formel tex="s=1" nach=")" /> zu <Formel tex="g" nach="." /> Vergleiche beide Werte und den Abstand der Stützpunkte <Formel tex="P" /> und <Formel tex="Q" nach="." />
          </p>
          <Beobachtung bild={<Figur spec={RAUM_PARALLEL} unter={<>Zwei parallele Geraden: Das Lot von <Formel tex="Q" /> auf <Formel tex="g" /> hat die Länge des Abstands.</>} />}>
            <p>
              Für <Formel tex="Q" /> ist <Formel tex={t`d^2=${lp.d2}`} nach="," /> für <Formel tex="X" /> ebenfalls <Formel tex={t`d^2=${l1.d2}`} nach="." /> Beide Punkte von <Formel tex="h" /> haben denselben Abstand <Formel tex={t`d=${wurzelTeX(lp.d2)}\approx ${rund2(lp.d)}`} /> zu <Formel tex="g" nach="." /> Der Abstand der Stützpunkte ist dagegen <Formel tex={t`|\overrightarrow{PQ}|=${wurzelTeX(dStuetz2)}\approx ${rund2(Math.sqrt(dStuetz2))}`} nach="," /> also größer, denn die Verbindung der Stützpunkte steht nicht senkrecht auf den Geraden. Vermutung: Bei parallelen Geraden hat jeder Punkt von <Formel tex="h" /> denselben Abstand zu <Formel tex="g" nach="." /> Du berechnest deshalb den Abstand eines beliebigen Punkts von <Formel tex="h" /> zu <Formel tex="g" nach="," /> am einfachsten den des Stützpunkts.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Labor für parallele Geraden</h3>
      <p>
        Die Gerade <Formel tex="g" /> ist fest. Die Gerade <Formel tex="h" /> geht durch <Formel tex="Q" /> und hat den Richtungsvektor <Formel tex={t`k\cdot\vec{u}`} nach="." /> Ein Punkt <Formel tex="X" /> wandert mit dem Parameter <Formel tex="s" /> auf <Formel tex="h" nach="." /> Die Abstände und das Lot blendest du ein, wenn du eine Vermutung hast.
      </p>
      <Parallellabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Verändere <Formel tex="s" /> und beobachte den Abstand des Punkts <Formel tex="X" /> von <Formel tex="g" nach="." /> Verändere dann <Formel tex="Q" /> und <Formel tex="k" nach="." /> Was ändert den Abstand, was nicht?
          </p>
          <Beobachtung>
            Der Abstand ändert sich nicht, wenn nur <Formel tex="s" /> oder <Formel tex="k" /> verändert wird, denn <Formel tex="X" /> wandert auf <Formel tex="h" /> und <Formel tex="h" /> bleibt dieselbe Gerade. Der Abstand ändert sich nur, wenn die Gerade <Formel tex="h" /> verschoben wird, also mit <Formel tex="Q" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Vergleiche den Abstand der Geraden mit dem Abstand der Stützpunkte <Formel tex="P" /> und <Formel tex="Q" nach="." /> Wann sind beide Werte gleich? Was passiert, wenn <Formel tex="Q" /> auf <Formel tex="g" /> liegt?
          </p>
          <Beobachtung>
            Der Abstand der Stützpunkte ist mindestens so groß wie der Abstand der Geraden. Beide sind nur gleich, wenn die Verbindung <Formel tex={t`\overrightarrow{PQ}`} /> senkrecht auf den Geraden steht, dann ist <Formel tex="P" /> der Lotfußpunkt. Liegt <Formel tex="Q" /> auf <Formel tex="g" nach="," /> sind die Geraden identisch, der Abstand ist 0 und es gibt kein Lot.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
