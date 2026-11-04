import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_ERKLAEREN } from './Bilder';
import { ERKLAEREN } from './daten';

const p = <Formel tex={t`\vec{p}`} />;
const u = <Formel tex={t`\vec{u}`} />;

export function Erklaeren() {
  const e = ERKLAEREN;
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        In der Ebene kennst du Geraden als Schaubilder von Funktionen der Form <Formel tex="y=mx+n" nach="." /> Im Raum gibt es für eine Gerade keine so einfache Gleichung, denn eine einzelne Gleichung mit <Formel tex="x_1" nach="," /> <Formel tex="x_2" /> und <Formel tex="x_3" /> beschreibt dort eine Fläche und keine Gerade. Stattdessen beschreibt man eine Gerade mit Vektoren. Wie Punkte, Ortsvektoren und Verbindungsvektoren im Raum funktionieren, steht im Modul <Modulverweis modul="punkte-vektoren-raum">Punkte und Vektoren im Raum</Modulverweis>, das Rechnen mit Vektoren im Modul <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>.
      </p>

      <h3>Eine Gerade im Raum festlegen</h3>
      <p>
        Eine Gerade ist durch einen Punkt und eine Richtung festgelegt: Du startest in einem Punkt und gehst in einer vorgegebenen Richtung geradeaus weiter. Den Startpunkt nennt man <strong>Stützpunkt</strong>, die Richtung gibt ein Vektor an.
      </p>

      <h3>Die Parametergleichung</h3>
      <p>Eine Gerade <Formel tex="g" /> im Raum hat die Gleichung</p>
      <Umbruchformel
        tex={t`g:\ \vec{x}=\vec{p}+t\cdot\vec{u},\quad t\in\mathbb{R}`}
        schmal={t`\begin{gathered}g:\ \vec{x}=\vec{p}+t\cdot\vec{u}\\t\in\mathbb{R}\end{gathered}`}
      />
      <p>Das Bild zeigt die Bedeutung der Buchstaben an einer Geraden durch die Punkte <Formel tex="A" /> und <Formel tex="B" nach="." /></p>
      <Figur
        spec={RAUM_ERKLAEREN}
        unter={
          <>
            Die Gerade <Formel tex="g" /> durch <Formel tex="A" /> und <Formel tex="B" nach="." /> Der Stützvektor ist orange, der Richtungsvektor blau. Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten und die räumliche Ansicht drehen.
          </>
        }
      />
      <ul className="liste-ohne-zahl" aria-label="Die Bestandteile der Geradengleichung">
        <li><Formel tex={t`\vec{x}`} nach=":" /> der Ortsvektor eines Punkts <Formel tex="X" /> der Geraden.</li>
        <li>{p}: der <strong>Stützvektor</strong> (im Bild orange), der Ortsvektor des Stützpunkts <Formel tex="P" nach="." /></li>
        <li>{u}: der <strong>Richtungsvektor</strong> (im Bild blau). Er gibt die Richtung der Geraden an und darf nicht der Nullvektor sein.</li>
        <li><Formel tex="t" nach=":" /> der <strong>Parameter</strong>, eine beliebige reelle Zahl. In vielen Büchern heißt er <Formel tex={t`\lambda`} nach="." /></li>
      </ul>
      <p>
        Für jede reelle Zahl <Formel tex="t" /> gehört ein Punkt zur Geraden. Die Gleichung heißt deshalb auch <strong>Parameterform</strong> oder Parametergleichung der Geraden.
      </p>

      <h3>Die Gleichung aus zwei Punkten aufstellen</h3>
      <p>
        Sind zwei verschiedene Punkte <Formel tex="A" /> und <Formel tex="B" /> der Geraden bekannt, gehst du so vor: Der Ortsvektor von <Formel tex="A" /> ist der Stützvektor, der Verbindungsvektor <Formel tex={t`\overrightarrow{AB}`} /> ist der Richtungsvektor.
      </p>
      <Umbruchformel
        tex={t`g:\ \vec{x}=\overrightarrow{OA}+t\cdot\overrightarrow{AB}`}
        schmal={t`\begin{gathered}g:\ \vec{x}=\overrightarrow{OA}\\{}+t\cdot\overrightarrow{AB}\end{gathered}`}
      />
      <p>
        Beispiel: Die Gerade <Formel tex="g" /> geht durch <Formel tex={t`A(${e.A.join('\\,|\\,')})`} /> und <Formel tex={t`B(${e.B.join('\\,|\\,')})`} nach="." /> Der Richtungsvektor ist
      </p>
      <Umbruchformel
        tex={t`\overrightarrow{AB}=\begin{pmatrix}3-2\\-1-(-2)\\1-3\end{pmatrix}=${spalte(e.u)}`}
        schmal={t`\begin{gathered}\overrightarrow{AB}\\{}=\begin{pmatrix}3-2\\-1-(-2)\\1-3\end{pmatrix}\\{}=${spalte(e.u)}\end{gathered}`}
      />
      <p>Mit dem Stützpunkt <Formel tex="A" /> lautet die Gleichung</p>
      <Umbruchformel
        tex={t`g:\ \vec{x}=${spalte(e.A)}+t\cdot${spalte(e.u)}`}
        schmal={t`\begin{gathered}g:\ \vec{x}=${spalte(e.A)}\\{}+t\cdot${spalte(e.u)}\end{gathered}`}
      />

      <h3>Einen Punkt der Geraden berechnen</h3>
      <p>
        Setzt du für <Formel tex="t" /> eine Zahl ein, erhältst du den Ortsvektor eines Punkts der Geraden. Für <Formel tex="t=2" /> ergibt sich bei der Geraden aus dem Beispiel
      </p>
      <Umbruchformel
        tex={t`\vec{x}=${spalte(e.A)}+2\cdot${spalte(e.u)}=\begin{pmatrix}2+2\\-2+2\\3-4\end{pmatrix}=${spalte(e.X)}`}
        schmal={t`\begin{gathered}\vec{x}=${spalte(e.A)}\\{}+2\cdot${spalte(e.u)}\\{}=\begin{pmatrix}2+2\\-2+2\\3-4\end{pmatrix}\\{}=${spalte(e.X)}\end{gathered}`}
      />
      <p>
        Der Punkt hat also die Koordinaten <Formel tex={t`X(${e.X.join('\\,|\\,')})`} nach="." />
      </p>
      <Hinweis titel="Schreibweise">
        Ein Punkt wird mit senkrechtem Strich geschrieben, <Formel tex={t`A(2\,|\,-2\,|\,3)`} nach="," /> ein Vektor als Spalte. Das <Formel tex={t`\vec{x}`} /> in der Geradengleichung ist ein Vektor, genauer der Ortsvektor eines beliebigen Punkts der Geraden. Beide Schreibweisen gehören zusammen: Der Punkt <Formel tex={t`A(2\,|\,-2\,|\,3)`} /> hat den Ortsvektor <Formel tex={t`\overrightarrow{OA}=${spalte(e.A)}`} nach="." />
      </Hinweis>
      <p>
        Was die Zahl <Formel tex="t" /> mit dem Punkt macht, wann ein gegebener Punkt zur Geraden gehört und ob es für eine Gerade nur eine Gleichung gibt, findest du im Abschnitt „Entdecken“ heraus.
      </p>
    </Abschnitt>
  );
}
