import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { schnittwinkel, winkelKoordinatenebene } from '@/lib/gerade';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { betrag, skalarprodukt, vielfaches, winkel } from '@/lib/vektor';
import { RAUM_EBENE, RAUM_SCHNITT } from './Bilder';
import { BEISPIEL, EBENE } from './daten';
import { Projektionslabor, Schnittlabor } from './Labor';
import { alphaZeilen, gl, glSchmal, gradTeX, phiZeilen, rund2, zeilenFormel } from './rechenhilfen';

export function Entdecken() {
  const b = BEISPIEL;
  const u = b.g.u;
  const v = b.h.u;
  const minusV = vielfaches(-1, v);
  const phi = winkel(u, v)!;
  const phi2 = winkel(u, minusV)!;
  const vielfach = schnittwinkel(vielfaches(2, u), vielfaches(-3, v));
  const e = EBENE;
  const eu = e.g.u;
  const a12 = winkelKoordinatenebene(eu, 'e12');
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Der Schnittwinkel zweier Geraden</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>Gegeben sind die Geraden</p>
          <Umbruchformel tex={gl(b.g)} schmal={glSchmal(b.g)} />
          <Umbruchformel tex={gl(b.h, 'h', 's')} schmal={glSchmal(b.h, 'h', 's')} />
          <p>
            Sie schneiden sich im Punkt <Formel tex="S" nach="." /> Berechne den Winkel <Formel tex={t`\varphi`} /> zwischen den Richtungsvektoren <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} nach="." /> Berechne dann den Winkel zwischen <Formel tex={t`\vec{u}`} /> und <Formel tex={t`-\vec{v}`} nach="." /> Welcher Winkel ist der Schnittwinkel der Geraden? Wie kommst du aus dem Skalarprodukt direkt auf ihn?
          </p>
          <Beobachtung bild={<Figur spec={RAUM_SCHNITT} unter={<>Dieselben Geraden: Der rosa Bogen zeigt den Schnittwinkel <Formel tex={t`\alpha`} nach=","/> den kleineren der beiden Winkel.</>} />}>
            <Umbruchformel {...phiZeilen(u, v)} />
            <p>
              Mit <Formel tex={t`-\vec{v}=${spalte(minusV)}`} /> ist das Skalarprodukt <Formel tex={t`${skalarprodukt(u, minusV)}`} nach="," /> der Winkel ist
            </p>
            <Umbruchformel {...phiZeilen(u, minusV)} />
            <p>
              Die beiden Winkel <Formel tex={t`${rund2(phi)}^{\circ}`} /> und <Formel tex={t`${rund2(phi2)}^{\circ}`} /> ergänzen sich zu <Formel tex="180^{\circ}" nach="." /> Die Geraden sind dieselben, nur der Richtungsvektor <Formel tex={t`\vec{v}`} /> zeigt einmal in die eine und einmal in die andere Richtung. Der Schnittwinkel ist der kleinere der beiden Winkel, hier <Formel tex={t`\alpha\approx ${rund2(Math.min(phi, phi2))}^{\circ}`} nach="." /> Ein negatives Skalarprodukt liefert den stumpfen Winkel, du brauchst den spitzen. Vermutung: Du erhältst den Schnittwinkel direkt, wenn du das Skalarprodukt im Zähler ohne Vorzeichen nimmst, also mit dem Betrag.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Schnittwinkellabor</h3>
      <p>
        Die Gerade <Formel tex="g" /> ist fest. Die Gerade <Formel tex="h" /> geht durch den Schnittpunkt <Formel tex="S" /> und hat den Richtungsvektor <Formel tex={t`\vec{v}`} nach="," /> den du mit den Reglern einstellst. Die Richtung von <Formel tex="h" /> lässt sich umkehren. Den Schnittwinkel und die Rechnung blendest du ein, wenn du eine Vermutung hast.
      </p>
      <Schnittlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Kehre die Richtung von <Formel tex="h" /> um. Was ändert sich im Bild, was beim Winkel <Formel tex={t`\varphi`} nach="," /> was beim Schnittwinkel <Formel tex={t`\alpha`} nach="?" /> Wo liegen die beiden Punkte auf der Kosinuskurve?
          </p>
          <Beobachtung>
            Im Bild ändert sich nichts, <Formel tex="h" /> ist dieselbe Gerade. Der Winkel <Formel tex={t`\varphi`} /> wechselt zu <Formel tex={t`180^{\circ}-\varphi`} nach="," /> der Schnittwinkel <Formel tex={t`\alpha`} /> bleibt gleich. Auf der Kosinuskurve liegen die beiden Punkte bei <Formel tex={t`\varphi`} /> und <Formel tex={t`180^{\circ}-\varphi`} /> mit Kosinuswerten, die sich nur im Vorzeichen unterscheiden. Vermutung: Der Schnittwinkel hängt nicht davon ab, in welche der beiden Richtungen die Richtungsvektoren zeigen. Mit dem Betrag im Zähler trifft die Formel immer den Wert zwischen <Formel tex="0^{\circ}" /> und <Formel tex="90^{\circ}" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            Stelle <Formel tex={t`\vec{v}`} /> so ein, dass <Formel tex={t`\alpha=90^{\circ}`} /> ist, und so, dass <Formel tex={t`\alpha`} /> klein wird. Was gilt dann für das Skalarprodukt? Was passiert, wenn <Formel tex={t`\vec{v}`} /> ein Vielfaches von <Formel tex={t`\vec{u}`} /> ist?
          </p>
          <Beobachtung>
            Bei <Formel tex={t`\alpha=90^{\circ}`} /> ist das Skalarprodukt <Formel tex={t`\vec{u}\cdot\vec{v}=0`} nach="," /> die Richtungsvektoren sind orthogonal (siehe <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>). Je kleiner <Formel tex={t`|\vec{u}\cdot\vec{v}|`} /> im Verhältnis zu <Formel tex={t`|\vec{u}|\cdot|\vec{v}|`} /> ist, desto näher liegt <Formel tex={t`\alpha`} /> an <Formel tex="90^{\circ}" nach="," /> je größer, desto näher an <Formel tex="0^{\circ}" nach="." /> Ist <Formel tex={t`\vec{v}`} /> ein Vielfaches von <Formel tex={t`\vec{u}`} nach="," /> sind <Formel tex="g" /> und <Formel tex="h" /> hier identisch, es entsteht kein Winkel zwischen zwei verschiedenen Geraden. Vermutung: Der Schnittwinkel liegt zwischen <Formel tex="0^{\circ}" /> und <Formel tex="90^{\circ}" nach="," /> der Wert <Formel tex={t`0^{\circ}`} /> gehört nur zu parallelen oder identischen Geraden, die sich nicht in einem einzelnen Punkt schneiden.
          </Beobachtung>
        </li>
        <li>
          <p>
            Berechne den Schnittwinkel noch einmal mit den Richtungsvektoren <Formel tex={t`2\cdot\vec{u}=${spalte(vielfaches(2, u))}`} /> und <Formel tex={t`-3\cdot\vec{v}=${spalte(vielfaches(-3, v))}`} nach="." /> Ändert sich etwas? Wie wirken sich Stützvektoren und die Länge der Richtungsvektoren auf den Schnittwinkel aus?
          </p>
          <Beobachtung>
            <Umbruchformel {...alphaZeilen(vielfaches(2, u), vielfaches(-3, v))} />
            <p>
              Das Ergebnis ist <Formel tex={t`${gradTeX(vielfach)}`} /> wie vorher, der Schnittwinkel ändert sich nicht. Die Faktoren 2 und 3 kürzen sich im Bruch, das Vorzeichen fällt durch den Betrag weg. Die Stützvektoren kommen in der Rechnung gar nicht vor. Vermutung: Für den Schnittwinkel zählt nur die Richtung der Geraden, nicht ihre Lage und nicht die Länge der Richtungsvektoren.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Der Winkel einer Geraden mit einer Koordinatenebene</h3>
      <ol className="auftraege">
        <li>
          <p>
            Die Gerade <Formel tex={t`g:\ \vec{x}=${spalte(e.g.p)}+t\cdot ${spalte(eu)}`} /> liegt mit dem Spurpunkt <Formel tex="S_{12}" /> auf der <Formel tex="x_1x_2" />-Ebene. Berechne den Winkel <Formel tex={t`\alpha`} /> zwischen <Formel tex={t`\vec{u}`} /> und dem Projektionsvektor <Formel tex={t`\vec{u}_{12}`} nach="." /> Berechne dann den Quotienten <Formel tex={t`\frac{|u_3|}{|\vec{u}|}`} nach="," /> den Betrag der 3. Koordinate durch den Betrag von <Formel tex={t`\vec{u}`} nach="," /> und vergleiche ihn mit <Formel tex={t`\sin\alpha`} nach="." /> Was fällt auf?
          </p>
          <Beobachtung bild={<Figur spec={RAUM_EBENE} unter={<>Das Dreieck aus <Formel tex="S_{12}" nach="," /> <Formel tex="P" /> und <Formel tex="P'" /> ist rechtwinklig: Das Lot <Formel tex="PP'" /> steht senkrecht auf der Ebene.</>} />}>
            <p>
              Mit <Formel tex={t`\vec{u}_{12}=${spalte([eu[0]!, eu[1]!, 0])}`} /> ist <Formel tex={t`\vec{u}\cdot\vec{u}_{12}=${eu[0]! ** 2 + eu[1]! ** 2}`} nach="," /> <Formel tex={t`|\vec{u}_{12}|=\sqrt{${eu[0]! ** 2 + eu[1]! ** 2}}`} /> und <Formel tex={t`|\vec{u}|=${betrag(eu)}`} nach="," /> also <Formel tex={t`\cos\alpha=\frac{${eu[0]! ** 2 + eu[1]! ** 2}}{${betrag(eu)}\cdot\sqrt{${eu[0]! ** 2 + eu[1]! ** 2}}}`} /> und <Formel tex={t`\alpha\approx ${gradTeX(a12)}`} nach="." /> Der Quotient ist <Formel tex={t`\frac{|u_3|}{|\vec{u}|}=\frac{${Math.abs(eu[2]!)}}{${betrag(eu)}}\approx ${rund2(Math.abs(eu[2]!) / betrag(eu))}`} nach="," /> und <Formel tex={t`\sin ${gradTeX(a12)}\approx ${rund2(Math.sin((a12 * Math.PI) / 180))}`} nach="." /> Beide Werte stimmen überein. Im rechtwinkligen Dreieck aus <Formel tex="S_{12}" nach="," /> <Formel tex="P" /> und <Formel tex="P'" /> liegt die Strecke <Formel tex="PP'" /> (Länge <Formel tex={t`|u_3|`} nach=")" /> dem Winkel <Formel tex={t`\alpha`} /> gegenüber, die Hypotenuse hat die Länge <Formel tex={t`|\vec{u}|`} nach="." /> Vermutung: Es gilt <Formel tex={t`\sin\alpha=\frac{|u_3|}{|\vec{u}|}`} nach="." /> Die Koordinate, die in der Ebene 0 ist, gehört zu einem Vektor, der auf der Ebene senkrecht steht, hier <Formel tex={t`\begin{pmatrix}0\\0\\1\end{pmatrix}`} nach="." /> Dieser zweite Weg braucht keine Projektion.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Projektionslabor</h3>
      <p>
        Die Gerade <Formel tex="g" /> geht durch einen Punkt der gewählten Koordinatenebene und hat den Richtungsvektor <Formel tex={t`\vec{u}`} nach="," /> den du mit den Reglern einstellst. Die Projektion <Formel tex="g'" /> und der Winkel <Formel tex={t`\alpha`} /> lassen sich einblenden. Liegt ein Punkt außerhalb des gezeichneten Koordinatensystems, wird das Lot nicht gezeichnet, die Rechnung gilt trotzdem.
      </p>
      <Projektionslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Wähle die <Formel tex="x_1x_2" />-Ebene. Welche Werte kann <Formel tex={t`\alpha`} /> annehmen? Stelle <Formel tex={t`\vec{u}`} /> so ein, dass <Formel tex={t`\alpha=0^{\circ}`} /> und dass <Formel tex={t`\alpha=90^{\circ}`} /> ist. Woran erkennst du das an den Koordinaten von <Formel tex={t`\vec{u}`} nach="?" />
          </p>
          <Beobachtung>
            Der Winkel liegt zwischen <Formel tex="0^{\circ}" /> und <Formel tex="90^{\circ}" nach="." /> Er ist <Formel tex="0^{\circ}" nach="," /> wenn die 3. Koordinate von <Formel tex={t`\vec{u}`} /> gleich 0 ist: Dann ist <Formel tex={t`\vec{u}'=\vec{u}`} nach="," /> die Gerade liegt in der Ebene (hier geht sie durch einen Punkt der Ebene). Er ist <Formel tex="90^{\circ}" nach="," /> wenn die ersten beiden Koordinaten 0 sind: Dann ist <Formel tex={t`\vec{u}'`} /> der Nullvektor, die Gerade steht senkrecht auf der Ebene. Vermutung: Je größer der Betrag der Koordinate, die in der Ebene 0 ist, im Vergleich zu den beiden anderen, desto größer ist der Winkel.
          </Beobachtung>
        </li>
        <li>
          <p>
            Stelle <Formel tex={t`\vec{u}=${spalte(eu)}`} /> ein und wechsle zwischen den drei Koordinatenebenen. Mit welcher Ebene ist der Winkel am größten, mit welcher am kleinsten? Hängt das mit den Koordinaten von <Formel tex={t`\vec{u}`} /> zusammen?
          </p>
          <Beobachtung>
            <p>
              Die Winkel sind <Formel tex={t`${gradTeX(e.winkel.e12)}`} /> mit der <Formel tex="x_1x_2" />-Ebene, <Formel tex={t`${gradTeX(e.winkel.e13)}`} /> mit der <Formel tex="x_1x_3" />-Ebene und <Formel tex={t`${gradTeX(e.winkel.e23)}`} /> mit der <Formel tex="x_2x_3" />-Ebene. Am größten ist der Winkel mit der <Formel tex="x_1x_2" />-Ebene: Dort ist die Koordinate, die in der Ebene 0 ist, die 3. Koordinate und mit <Formel tex={t`|u_3|=6`} /> die betragsmäßig größte. Am kleinsten ist er mit der <Formel tex="x_1x_3" />-Ebene, dort ist es die 2. Koordinate mit <Formel tex={t`|u_2|=2`} nach="." /> Vermutung: Das passt zu <Formel tex={t`\sin\alpha=\frac{|u_i|}{|\vec{u}|}`} nach="," /> wobei <Formel tex={t`u_i`} /> die Koordinate ist, die in der Ebene 0 ist. Die Gerade ist gegen die Ebene am steilsten, gegen die die größte Koordinate senkrecht steht.
            </p>
            <Umbruchformel {...zeilenFormel([t`\sin\alpha_{12}=\frac{6}{7}`, t`\sin\alpha_{13}=\frac{2}{7}`, t`\sin\alpha_{23}=\frac{3}{7}`])} />
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
