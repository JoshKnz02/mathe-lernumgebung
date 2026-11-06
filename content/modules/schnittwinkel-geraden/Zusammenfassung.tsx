import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { winkelKoordinatenebene } from '@/lib/gerade';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_EBENE, RAUM_SCHNITT } from './Bilder';
import { BEISPIEL, EBENE } from './daten';
import { alphaZeilen, betragZeilen, gl, glSchmal, gradTeX, phiZeilen, projektionGleichung, projektionsRechnung, sinusRechnung, skalarZeilen, type Zeilen } from './rechenhilfen';

const Z = ({ z }: { z: Zeilen }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;

export function Zusammenfassung() {
  const b = BEISPIEL;
  const e = EBENE;
  const u = e.g.u;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Schnittwinkel zweier Geraden</h3>
      <Hinweis art="merksatz" titel="Schnittwinkel zweier Geraden">
        Schneiden sich zwei Geraden <Formel tex="g" /> und <Formel tex="h" /> mit den Richtungsvektoren <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} nach="," /> ist ihr <strong>Schnittwinkel</strong> <Formel tex={t`\alpha`} /> der kleinere der beiden Winkel, die dort entstehen. Es gilt <Formel tex={t`0^{\circ}<\alpha\le 90^{\circ}`} /> und
        <Formel anzeige tex={t`\cos\alpha=\frac{|\vec{u}\cdot\vec{v}|}{|\vec{u}|\cdot|\vec{v}|}`} />
        Der Winkel <Formel tex={t`\alpha=\cos^{-1}\frac{|\vec{u}\cdot\vec{v}|}{|\vec{u}|\cdot|\vec{v}|}`} /> wird mit dem Taschenrechner auf Gradmaß (DEG) berechnet.
      </Hinweis>
      <Hinweis art="merksatz" titel="Was der Betrag bewirkt">
        Der Winkel <Formel tex={t`\varphi`} /> zwischen <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} /> hängt davon ab, in welche Richtung die Richtungsvektoren zeigen. Kehrst du <Formel tex={t`\vec{v}`} /> um, wird aus <Formel tex={t`\varphi`} /> der Winkel <Formel tex={t`180^{\circ}-\varphi`} nach="." /> Die Geraden bleiben dieselben. Ein negatives Skalarprodukt gehört zum stumpfen Winkel <Formel tex={t`\varphi`} nach="." /> Mit dem Betrag im Zähler erhältst du immer den spitzen (oder rechten) Winkel, also gilt <Formel tex={t`\alpha=\varphi`} /> für <Formel tex={t`\varphi\le 90^{\circ}`} /> und <Formel tex={t`\alpha=180^{\circ}-\varphi`} /> für <Formel tex={t`\varphi>90^{\circ}`} nach="." /> Die Stützvektoren der Geraden und die Länge der Richtungsvektoren ändern den Schnittwinkel nicht, nur die Richtung zählt. Der Schnittwinkel ist genau dann <Formel tex="90^{\circ}" nach="," /> wenn <Formel tex={t`\vec{u}\cdot\vec{v}=0`} /> gilt.
      </Hinweis>
      <Hinweis art="merksatz" titel="Wann es einen Schnittwinkel gibt">
        Ein Schnittwinkel gehört zu einem Schnittpunkt. Bei Geraden, die sich in einem Punkt schneiden, berechnest du ihn mit der Formel. Bei parallelen und identischen Geraden sind die Richtungsvektoren Vielfache, der Winkel der Richtungen ist <Formel tex="0^{\circ}" nach="," /> einen Schnittwinkel gibt es nicht. Bei windschiefen Geraden gibt es keinen Schnittpunkt, damit auch keinen Schnittwinkel. Die Lage bestimmst du vorher (siehe <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>).
      </Hinweis>

      <h3>Winkel einer Geraden mit einer Koordinatenebene</h3>
      <Hinweis art="merksatz" titel="Winkel mit einer Koordinatenebene">
        Der Winkel <Formel tex={t`\alpha`} /> einer Geraden <Formel tex="g" /> mit einer Koordinatenebene ist der Winkel zwischen <Formel tex="g" /> und ihrer senkrechten Projektion <Formel tex="g'" /> in die Ebene, <Formel tex={t`0^{\circ}\le\alpha\le 90^{\circ}`} nach="." /> Es gibt zwei Wege, beide nutzen nur den Richtungsvektor <Formel tex={t`\vec{u}`} nach=":" />
        <ul className="liste-ohne-zahl" aria-label="Die zwei Wege zum Winkel mit einer Koordinatenebene">
          <li><strong>Weg 1 (Projektion):</strong> Die Koordinate, die im Namen der Ebene nicht vorkommt, wird 0. Das ergibt <Formel tex={t`\vec{u}'`} nach="." /> Dann ist <Formel tex={t`\cos\alpha=\frac{\vec{u}\cdot\vec{u}'}{|\vec{u}|\cdot|\vec{u}'|}`} nach="." /></li>
          <li><strong>Weg 2 (senkrechter Vektor):</strong> <Formel tex={t`\sin\alpha=\frac{|u_i|}{|\vec{u}|}`} nach="," /> wobei <Formel tex={t`u_i`} /> die Koordinate ist, die in der Ebene 0 ist. Dort steht ein Vektor senkrecht auf der Ebene, zum Beispiel <Formel tex={t`\begin{pmatrix}0\\0\\1\end{pmatrix}`} /> bei der <Formel tex="x_1x_2" />-Ebene.</li>
        </ul>
        Ist die Koordinate <Formel tex={t`u_i`} /> gleich 0, liegt <Formel tex="g" /> in der Ebene oder parallel zu ihr, der Winkel ist <Formel tex="0^{\circ}" nach="." /> Ist <Formel tex={t`\vec{u}'`} /> der Nullvektor, steht <Formel tex="g" /> senkrecht auf der Ebene, der Winkel ist <Formel tex="90^{\circ}" nach="." /> Der Stützvektor spielt keine Rolle.
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg: zwei Geraden</h3>
      <p>Gegeben sind</p>
      <Umbruchformel tex={gl(b.g)} schmal={glSchmal(b.g)} />
      <Umbruchformel tex={gl(b.h, 'h', 's')} schmal={glSchmal(b.h, 'h', 's')} />
      <p>
        Die Geraden schneiden sich im Punkt <Formel tex={punktTeX('S', b.S)} nach="." /> Die Richtungsvektoren sind <Formel tex={t`\vec{u}=${spalte(b.g.u)}`} /> und <Formel tex={t`\vec{v}=${spalte(b.h.u)}`} nach="." /> Skalarprodukt und Beträge:
      </p>
      <Z z={skalarZeilen(b.g.u, b.h.u)} />
      <Z z={betragZeilen(b.g.u, '\\vec{u}')} />
      <Z z={betragZeilen(b.h.u, '\\vec{v}')} />
      <p>Der Winkel zwischen den Vektoren ist stumpf, weil das Skalarprodukt negativ ist:</p>
      <Z z={phiZeilen(b.g.u, b.h.u)} />
      <p>
        Der Schnittwinkel ist der kleinere Winkel, <Formel tex={t`180^{\circ}-${gradTeX(b.phi)}=${gradTeX(b.alpha)}`} nach="." /> Mit dem Betrag erhältst du ihn in einem Schritt:
      </p>
      <Z z={alphaZeilen(b.g.u, b.h.u)} />
      <Figur spec={RAUM_SCHNITT} unter={<>Die Geraden <Formel tex="g" /> und <Formel tex="h" /> mit dem Schnittpunkt <Formel tex={punktTeX('S', b.S)} /> und dem Schnittwinkel <Formel tex={t`\alpha\approx ${gradTeX(b.alpha)}`} nach="." /></>} />

      <h3>Ein Beispiel mit vollständigem Rechenweg: Gerade und Koordinatenebenen</h3>
      <p>
        Die Gerade <Formel tex={t`g:\ \vec{x}=${spalte(e.g.p)}+t\cdot ${spalte(u)}`} /> hat den Richtungsvektor <Formel tex={t`\vec{u}=${spalte(u)}`} nach="." /> Sie geht durch den Spurpunkt <Formel tex={punktTeX('S_{12}', e.S)} nach="." /> Mit der Länge <Formel tex={t`|\vec{u}|=7`} /> gilt:
      </p>
      <p>
        <Formel tex="x_1x_2" />-Ebene, Weg 1 (Projektion): Die 3. Koordinate wird 0.
      </p>
      <Umbruchformel tex={projektionGleichung(u, 'e12')} schmal={projektionGleichung(u, 'e12')} />
      <Z z={projektionsRechnung(u, 'e12').produkt} />
      <Z z={projektionsRechnung(u, 'e12').betrag} />
      <Z z={projektionsRechnung(u, 'e12').winkel} />
      <p>
        <Formel tex="x_1x_3" />-Ebene, Weg 2 (senkrechter Vektor): Die 2. Koordinate ist die, die in der Ebene 0 ist.
      </p>
      <Z z={sinusRechnung(u, 'e13').zeilen} />
      <p>
        <Formel tex="x_2x_3" />-Ebene, Weg 2: Die 1. Koordinate ist die, die in der Ebene 0 ist.
      </p>
      <Z z={sinusRechnung(u, 'e23').zeilen} />
      <p>
        Zur Kontrolle liefert Weg 2 für die <Formel tex="x_1x_2" />-Ebene <Formel tex={t`\sin\alpha=\frac{6}{7}`} nach="," /> also <Formel tex={t`${gradTeX(winkelKoordinatenebene(u, 'e12'))}`} /> wie Weg 1.
      </p>
      <Figur spec={RAUM_EBENE} unter={<>Die Gerade <Formel tex="g" /> und ihre Projektion <Formel tex="g'" /> in die <Formel tex="x_1x_2" />-Ebene mit dem Winkel <Formel tex={t`\alpha\approx ${gradTeX(e.winkel.e12)}`} nach="." /></>} />

      <Hinweis titel="Häufige Fehler">
        <ul className="liste-ohne-zahl" aria-label="Häufige Fehler">
          <li>Den Betrag im Zähler vergessen und bei negativem Skalarprodukt den stumpfen Winkel als Schnittwinkel angeben.</li>
          <li>Den Betrag um das ganze Skalarprodukt falsch setzen: Im Zähler steht <Formel tex={t`|\vec{u}\cdot\vec{v}|`} nach="," /> im Nenner das Produkt der beiden Beträge.</li>
          <li>Taschenrechner auf Bogenmaß statt Gradmaß: Dann erscheint zum Beispiel <Formel tex="1{,}11" /> statt <Formel tex={t`${gradTeX(b.alpha)}`} nach="." /></li>
          <li>Den Stützvektor in die Rechnung aufnehmen, obwohl nur die Richtungsvektoren zählen.</li>
          <li>Bei einer Koordinatenebene die falsche Koordinate 0 setzen: Es ist die Koordinate, die im Namen der Ebene nicht vorkommt.</li>
          <li>Bei Weg 2 den Kosinus statt des Sinus nehmen: Mit dem senkrechten Vektor ergibt <Formel tex={t`\frac{|u_i|}{|\vec{u}|}`} /> den Sinus des Winkels mit der Ebene, nicht den Kosinus.</li>
          <li>Für windschiefe oder parallele Geraden einen Schnittwinkel angeben, obwohl es keinen Schnittpunkt gibt.</li>
        </ul>
      </Hinweis>
    </Abschnitt>
  );
}
