import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_PRODUKT } from './Bilder';
import { ZUSAMMENFASSUNG } from './daten';

export function Zusammenfassung() {
  const z = ZUSAMMENFASSUNG;
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Das Vektorprodukt</h3>
      <Hinweis art="merksatz" titel="Rechenvorschrift">
        Das Vektorprodukt (Kreuzprodukt) zweier Vektoren mit drei Koordinaten ist wieder ein Vektor:
        <Umbruchformel
          tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}a_2b_3-a_3b_2\\a_3b_1-a_1b_3\\a_1b_2-a_2b_1\end{pmatrix}`}
          schmal={t`\begin{gathered}\vec{a}\times\vec{b}\\{}=\begin{pmatrix}a_2b_3-a_3b_2\\a_3b_1-a_1b_3\\a_1b_2-a_2b_1\end{pmatrix}\end{gathered}`}
        />
        Es gibt es nur im Raum. Mit dem Schema (Zeilen der Koordinaten, die beiden ersten Zeilen darunter wiederholt) vermeidest du Vorzeichenfehler. Nicht verwechseln: Das Skalarprodukt <Formel tex={t`\vec{a}\cdot\vec{b}`} /> ist eine Zahl, die s-Multiplikation <Formel tex={t`r\cdot\vec{a}`} /> und das Vektorprodukt sind Vektoren.
      </Hinweis>

      <h3>Eigenschaften</h3>
      <Hinweis art="merksatz" titel="Senkrecht auf beiden Vektoren">
        Das Vektorprodukt steht senkrecht auf <Formel tex={t`\vec{a}`} /> und auf <Formel tex={t`\vec{b}`} nach=":" />
        <Formel anzeige tex={t`(\vec{a}\times\vec{b})\cdot\vec{a}=0\quad\text{und}\quad(\vec{a}\times\vec{b})\cdot\vec{b}=0`} />
        Das gilt auch, wenn <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} /> nicht senkrecht aufeinander stehen. Die Probe mit dem Skalarprodukt prüft jedes Ergebnis, immer mit beiden Vektoren. Sind <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} /> nicht kollinear, sind alle Vektoren, die auf beiden senkrecht stehen, Vielfache des Vektorprodukts.
      </Hinweis>
      <Hinweis art="merksatz" titel="Reihenfolge und Richtung">
        Vertauschst du die Faktoren, kehrt sich der Vektor um:
        <Formel anzeige tex={t`\vec{b}\times\vec{a}=-(\vec{a}\times\vec{b})`} />
        Das Vektorprodukt ist also nicht kommutativ, sondern antikommutativ, und es gilt <Formel tex={t`\vec{a}\times\vec{a}=\vec{0}`} nach="." /> Welche der beiden senkrechten Richtungen gewählt wird, sagt die Rechte-Hand-Regel: Daumen in Richtung <Formel tex={t`\vec{a}`} nach="," /> Zeigefinger in Richtung <Formel tex={t`\vec{b}`} nach="," /> dann zeigt der Mittelfinger in Richtung <Formel tex={t`\vec{a}\times\vec{b}`} nach="." /> Das Koordinatensystem ist ein Rechtssystem, deshalb ist <Formel tex={t`\begin{pmatrix}1\\0\\0\end{pmatrix}\times\begin{pmatrix}0\\1\\0\end{pmatrix}=\begin{pmatrix}0\\0\\1\end{pmatrix}`} nach="." />
      </Hinweis>
      <Hinweis art="merksatz" titel="Betrag">
        Mit dem Winkel <Formel tex={t`\alpha`} /> zwischen <Formel tex={t`\vec{a}`} /> und <Formel tex={t`\vec{b}`} /> gilt
        <Formel anzeige tex={t`|\vec{a}\times\vec{b}|=|\vec{a}|\cdot|\vec{b}|\cdot\sin\alpha`} />
        Bei einem rechten Winkel ist der Betrag das Produkt der Beträge, bei <Formel tex={t`0^{\circ}`} /> und <Formel tex={t`180^{\circ}`} /> ist er 0.
      </Hinweis>
      <Hinweis art="merksatz" titel="Nullvektor und Kollinearität">
        <Formel anzeige tex={t`\vec{a}\times\vec{b}=\vec{0}\ \Leftrightarrow\ \vec{a}\text{ und }\vec{b}\text{ sind kollinear}`} />
        Kollinear heißt, dass ein Vektor ein Vielfaches des anderen ist (siehe <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>). Der Nullvektor zählt dazu. Nicht verwechseln: Das Skalarprodukt ist 0 bei senkrechten Vektoren, das Vektorprodukt ist der Nullvektor bei kollinearen.
      </Hinweis>
      <Figur
        spec={RAUM_PRODUKT}
        unter={
          <>
            Beispiel: <Formel tex={t`\vec{a}=\begin{pmatrix}1\\2\\0\end{pmatrix}`} /> (orange), <Formel tex={t`\vec{b}=\begin{pmatrix}0\\1\\2\end{pmatrix}`} /> (blau) und <Formel tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}4\\-2\\1\end{pmatrix}`} /> (rosa).
          </>
        }
      />

      <h3>Anwendung: ein senkrechter Vektor zu zwei Vektoren</h3>
      <p>
        Gesucht ist ein Vektor, der auf <Formel tex={t`\vec{a}=${spalte(z.a)}`} /> und auf <Formel tex={t`\vec{b}=${spalte(z.b)}`} /> senkrecht steht. Das Vektorprodukt liefert ihn:
      </p>
      <Umbruchformel
        tex={t`\vec{a}\times\vec{b}=\begin{pmatrix}3\cdot 4-(-1)\cdot 2\\(-1)\cdot(-1)-2\cdot 4\\2\cdot 2-3\cdot(-1)\end{pmatrix}=${spalte(z.n)}`}
        schmal={t`\begin{gathered}\vec{a}\times\vec{b}\\{}=\begin{pmatrix}3\cdot 4-(-1)\cdot 2\\(-1)\cdot(-1)-2\cdot 4\\2\cdot 2-3\cdot(-1)\end{pmatrix}\\{}=${spalte(z.n)}\end{gathered}`}
      />
      <p>Zur Probe berechnest du beide Skalarprodukte:</p>
      <Umbruchformel
        tex={t`${spalte(z.n)}\cdot${spalte(z.a)}=28-21-7=0,\quad ${spalte(z.n)}\cdot${spalte(z.b)}=-14-14+28=0`}
        schmal={t`\begin{gathered}${spalte(z.n)}\cdot${spalte(z.a)}\\{}=28-21-7=0\\${spalte(z.n)}\cdot${spalte(z.b)}\\{}=-14-14+28=0\end{gathered}`}
      />
      <p>
        Jedes Vielfache steht ebenfalls senkrecht. Alle Koordinaten sind durch 7 teilbar, der gekürzte Vektor <Formel tex={t`${spalte(z.gekuerzt)}`} /> steht ebenso senkrecht auf beiden. Soll der Vektor eine bestimmte Länge haben, wählst du das passende Vielfache, wie bei einem Einheitsvektor (siehe <Modulverweis modul="betrag-abstand-teilung">Betrag, Abstand und Teilung von Strecken</Modulverweis>). Das Vorzeichen bestimmst du nach der Aufgabe: Der Gegenvektor steht auch senkrecht.
      </p>
      <p>Verbindungsvektoren zwischen Punkten bestimmst du wie im Modul <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis>. Das Vektorprodukt zweier solcher Vektoren steht senkrecht auf beiden. Im Unterbereich Ebenen wird dieser Vektor wichtig.</p>

      <h3>Begriffe im Überblick</h3>
      <ul className="liste-ohne-zahl" aria-label="Die wichtigsten Begriffe">
        <li><strong>Vektorprodukt (Kreuzprodukt):</strong> Rechenvorschrift für zwei Vektoren mit drei Koordinaten, das Ergebnis ist ein Vektor.</li>
        <li><strong>Antikommutativ:</strong> Beim Vertauschen der Faktoren wechselt das Ergebnis das Vorzeichen.</li>
        <li><strong>Rechte-Hand-Regel:</strong> Daumen in Richtung des ersten, Zeigefinger in Richtung des zweiten Vektors, Mittelfinger in Richtung des Vektorprodukts.</li>
        <li><strong>Kollinear:</strong> Ein Vektor ist ein Vielfaches des anderen, ihre Pfeile liegen auf parallelen Geraden.</li>
        <li><strong>Probe:</strong> Das Skalarprodukt des Ergebnisses mit jedem der beiden Vektoren muss 0 sein.</li>
      </ul>

      <Hinweis titel="Häufige Fehler">
        <ul className="liste">
          <li>Vorzeichenfehler in der mittleren Koordinate: richtig ist <Formel tex={t`a_3b_1-a_1b_3`} nach="." /></li>
          <li>Die Koordinaten einzeln multipliziert, statt die Differenzen der Produkte zu bilden.</li>
          <li>Die Reihenfolge der Faktoren vertauscht und damit den Gegenvektor erhalten.</li>
          <li>Die Probe nur mit einem Vektor gemacht. Ein Fehler kann dabei unbemerkt bleiben, prüfe immer beide Skalarprodukte.</li>
          <li>Skalarprodukt und Vektorprodukt verwechselt: Das eine ist eine Zahl und 0 bei senkrechten Vektoren, das andere ist ein Vektor und der Nullvektor bei kollinearen.</li>
          <li>Das Vektorprodukt für Vektoren der Ebene berechnet. Es gibt es nur für Vektoren mit drei Koordinaten.</li>
        </ul>
      </Hinweis>
    </Abschnitt>
  );
}
