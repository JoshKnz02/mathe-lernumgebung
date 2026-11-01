import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { BILD_VORZEICHEN, BILD_WINKEL } from './Bilder';
import { ZUSAMMENFASSUNG } from './daten';

export function Zusammenfassung() {
  const z = ZUSAMMENFASSUNG;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Skalarprodukt und Orthogonalität</h3>
      <Hinweis art="merksatz" titel="Skalarprodukt">
        Das Skalarprodukt zweier Vektoren ist die Summe der Produkte der entsprechenden Koordinaten. Das Ergebnis ist eine Zahl.
        <Umbruchformel tex={t`\vec{a}\cdot\vec{b}=a_1b_1+a_2b_2+a_3b_3`} schmal={t`\begin{aligned}\vec{a}\cdot\vec{b}&\\&=a_1b_1+a_2b_2\\&\quad+a_3b_3\end{aligned}`} />
        In der Ebene fällt der dritte Summand weg. Es gilt <Formel tex={t`\vec{a}\cdot\vec{b}=\vec{b}\cdot\vec{a}`} /> und <Formel tex={t`\vec{a}\cdot\vec{a}=|\vec{a}|^2`} nach="." /> Nicht verwechseln: Die s-Multiplikation <Formel tex={t`r\cdot\vec{a}`} /> ergibt einen Vektor.
      </Hinweis>
      <Hinweis art="merksatz" titel="Orthogonale Vektoren">
        Zwei Vektoren sind genau dann orthogonal (senkrecht), wenn ihr Skalarprodukt 0 ist:
        <Formel anzeige tex={t`\vec{a}\perp\vec{b}\ \Leftrightarrow\ \vec{a}\cdot\vec{b}=0`} />
        Sind beide Vektoren vom Nullvektor verschieden, beträgt ihr Winkel dann 90°. Der Nullvektor hat mit jedem Vektor das Skalarprodukt 0, mit ihm gibt es aber keinen Winkel.
      </Hinweis>
      <Hinweis art="merksatz" titel="Senkrechter Vektor">
        In der Ebene ist zu <Formel tex={t`\begin{pmatrix}x\\y\end{pmatrix}`} /> der Vektor <Formel tex={t`\begin{pmatrix}y\\-x\end{pmatrix}`} /> orthogonal. Im Raum gibt es unendlich viele senkrechte Vektoren. Du wählst zwei Koordinaten frei und bestimmst die dritte aus <Formel tex={t`a_1n_1+a_2n_2+a_3n_3=0`} nach="." />
      </Hinweis>

      <h3>Der Winkel zwischen zwei Vektoren</h3>
      <Hinweis art="merksatz" titel="Winkelformel">
        Für zwei Vektoren ungleich dem Nullvektor mit dem eingeschlossenen Winkel <Formel tex={t`\alpha`} /> zwischen <Formel tex="0^{\circ}" /> und <Formel tex="180^{\circ}" /> gilt
        <Formel anzeige tex={t`\cos\alpha=\frac{\vec{a}\cdot\vec{b}}{|\vec{a}|\cdot|\vec{b}|}`} />
        und damit <Formel tex={t`\alpha=\cos^{-1}\dfrac{\vec{a}\cdot\vec{b}}{|\vec{a}|\cdot|\vec{b}|}`} nach="." /> Rechenweg: Skalarprodukt bestimmen, beide Beträge berechnen, einsetzen, den Kosinus umkehren. Der Taschenrechner steht auf Gradmaß (DEG).
      </Hinweis>
      <Hinweis art="merksatz" titel="Vorzeichen des Skalarprodukts">
        Das Skalarprodukt hat das Vorzeichen von <Formel tex={t`\cos\alpha`} nach=":" /> Bei <Formel tex={t`\vec{a}\cdot\vec{b}>0`} /> ist der Winkel spitz (<Formel tex={t`0^{\circ}\le\alpha<90^{\circ}`} nach=")," /> bei <Formel tex={t`\vec{a}\cdot\vec{b}=0`} /> genau <Formel tex="90^{\circ}" nach="," /> bei <Formel tex={t`\vec{a}\cdot\vec{b}<0`} /> ist er stumpf (<Formel tex={t`90^{\circ}<\alpha\le 180^{\circ}`} nach=")." /> Bei <Formel tex={t`\alpha=0^{\circ}`} /> zeigen die Vektoren in dieselbe Richtung, bei <Formel tex={t`\alpha=180^{\circ}`} /> in entgegengesetzte.
      </Hinweis>
      <Bild
        daten={BILD_VORZEICHEN}
        unter={
          <>
            Der Vektor <Formel tex={t`\vec{a}`} /> (orange) mit einem Vektor mit spitzem Winkel (blau, Skalarprodukt 7), mit rechtem Winkel (rosa, Skalarprodukt 0) und mit stumpfem Winkel (schwarz, Skalarprodukt −10).
          </>
        }
      />
      <Bild
        daten={BILD_WINKEL}
        unter={
          <>
            Beispiel: <Formel tex={t`\cos\alpha=\frac{6}{2\sqrt{2}\cdot 3}=\frac{1}{\sqrt{2}}`} nach="," /> also <Formel tex={t`\alpha=45^{\circ}`} nach="." />
          </>
        }
      />

      <h3>Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gesucht ist der Winkel zwischen <Formel tex={t`\vec{a}=${spalte(z.a)}`} /> und <Formel tex={t`\vec{b}=${spalte(z.b)}`} nach="." /> Das Skalarprodukt ist
      </p>
      <Umbruchformel tex={t`\vec{a}\cdot\vec{b}=1\cdot 2+2\cdot 3+2\cdot 6=${z.skalar}`} schmal={t`\begin{aligned}\vec{a}\cdot\vec{b}&=1\cdot 2+2\cdot 3+2\cdot 6\\&=${z.skalar}\end{aligned}`} />
      <p>Die Beträge sind</p>
      <Umbruchformel tex={t`|\vec{a}|=\sqrt{1+4+4}=${z.betragA},\quad |\vec{b}|=\sqrt{4+9+36}=${z.betragB}`} schmal={t`\begin{aligned}|\vec{a}|&=\sqrt{1+4+4}=${z.betragA}\\|\vec{b}|&=\sqrt{4+9+36}=${z.betragB}\end{aligned}`} />
      <p>Damit folgt</p>
      <Umbruchformel tex={t`\cos\alpha=\frac{20}{3\cdot 7}=\frac{20}{21},\quad \alpha=\cos^{-1}\left(\frac{20}{21}\right)\approx 17{,}75^{\circ}`} schmal={t`\begin{aligned}\cos\alpha&=\frac{20}{3\cdot 7}=\frac{20}{21}\\\alpha&=\cos^{-1}\left(\frac{20}{21}\right)\\&\approx 17{,}75^{\circ}\end{aligned}`} />
      <p>Der Winkel ist spitz, passend zum positiven Skalarprodukt.</p>

      <h3>Anwendungen</h3>
      <ul className="liste-ohne-zahl" aria-label="Anwendungen des Skalarprodukts">
        <li><strong>Rechnungsbetrag:</strong> Bestellvektor mal Preisvektor, zum Beispiel <Formel tex={t`\begin{pmatrix}3\\2\\5\end{pmatrix}\cdot\begin{pmatrix}2{,}40\\1{,}10\\3{,}50\end{pmatrix}=26{,}90`} nach="." /></li>
        <li><strong>Arbeit:</strong> Kraftvektor mal Wegvektor, <Formel tex={t`W=\vec{F}\cdot\vec{s}`} nach="." /></li>
      </ul>

      <h3>Begriffe im Überblick</h3>
      <ul className="liste-ohne-zahl" aria-label="Die wichtigsten Begriffe">
        <li><strong>Skalarprodukt:</strong> Summe der Produkte der entsprechenden Koordinaten, eine Zahl.</li>
        <li><strong>Orthogonal:</strong> senkrecht, genau dann, wenn das Skalarprodukt 0 ist.</li>
        <li><strong>Eingeschlossener Winkel:</strong> Winkel zwischen den Pfeilen zweier Vektoren am selben Anfangspunkt, 0° bis 180°.</li>
        <li><strong>Skalar:</strong> eine Zahl im Unterschied zu einem Vektor.</li>
      </ul>

      <Hinweis titel="Häufige Fehler">
        <ul className="liste">
          <li>Skalarprodukt und s-Multiplikation verwechselt: Beim Skalarprodukt entsteht eine Zahl, bei <Formel tex={t`r\cdot\vec{a}`} /> ein Vektor.</li>
          <li>Beim Winkel die Beträge vergessen: <Formel tex={t`\cos\alpha`} /> ist der Quotient aus dem Skalarprodukt und dem Produkt der Beträge.</li>
          <li>Taschenrechner auf Bogenmaß statt Gradmaß: Dann erscheinen Winkel wie <Formel tex="0{,}3" /> statt <Formel tex="17{,}75^{\circ}" nach="." /></li>
          <li>Aus einem Skalarprodukt von 0 geschlossen, es gebe einen rechten Winkel, obwohl ein Vektor der Nullvektor ist.</li>
          <li>Bei einem negativen Skalarprodukt einen spitzen Winkel angegeben: Negativ bedeutet stumpf.</li>
        </ul>
      </Hinweis>
    </Abschnitt>
  );
}
