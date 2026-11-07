import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { ebeneAusPunktUndGerade } from '@/lib/ebene';
import { t } from '@/lib/modulhilfen';
import { RAUM_ERKLAEREN } from './Bilder';
import { ERKLAEREN } from './daten';
import { gl, gleichungE, gleichungESchmal, glSchmal, punktTeX, spalte, verbindungSpalte } from './rechenhilfen';

export function Erklaeren() {
  const e = ERKLAEREN;
  const eb = ebeneAusPunktUndGerade(e.g, e.Q)!;
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <p>
        Im Modul <Modulverweis modul="einfuehrung-ebenen">Einführung in Ebenen im Raum</Modulverweis> hast du die Parameterform <Formel tex={t`E:\ \vec{x}=\vec{p}+r\cdot\vec{u}+s\cdot\vec{v}`} /> kennengelernt und eine Ebene aus drei Punkten aufgestellt. Eine Ebene lässt sich auch aus anderen Angaben festlegen, zum Beispiel aus einer Geraden und einem Punkt oder aus zwei Geraden. Immer suchst du einen Stützpunkt und zwei Spannvektoren, die nicht der Nullvektor und keine Vielfachen voneinander sind. Gerade, Richtungsvektor und Verbindungsvektor kennst du aus <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis> und <Modulverweis modul="rechnen-mit-vektoren">Rechnen mit Vektoren</Modulverweis>.
      </p>

      <h3>Eine Ebene aus einer Geraden und einem Punkt</h3>
      <p>
        Gegeben sind die Gerade <Formel tex={gl(e.g)} /> und ein Punkt <Formel tex="Q" nach="," /> der nicht auf <Formel tex="g" /> liegt. Alle Punkte von <Formel tex="g" /> liegen in der gesuchten Ebene. Deshalb gilt:
      </p>
      <ul className="liste-ohne-zahl" aria-label="Das Vorgehen bei Punkt und Gerade">
        <li>Der Stützpunkt <Formel tex="P" /> der Geraden ist ein Punkt der Ebene und wird ihr Stützpunkt.</li>
        <li>Der Richtungsvektor <Formel tex={t`\vec{u}`} /> der Geraden ist der erste Spannvektor, denn die Gerade verläuft in der Ebene.</li>
        <li>Der Verbindungsvektor <Formel tex={t`\overrightarrow{PQ}`} /> vom Stützpunkt zum Punkt <Formel tex="Q" /> ist der zweite Spannvektor.</li>
      </ul>
      <Umbruchformel
        tex={t`E:\ \vec{x}=\vec{p}+r\cdot\vec{u}+s\cdot\overrightarrow{PQ}`}
        schmal={t`\begin{gathered}E:\ \vec{x}=\vec{p}\\{}+r\cdot\vec{u}\\{}+s\cdot\overrightarrow{PQ}\end{gathered}`}
      />
      <p>
        Beispiel: Die Gerade <Formel tex={gl(e.g)} /> hat den Stützpunkt <Formel tex={punktTeX('P', e.g.p)} nach="." /> Der Punkt <Formel tex={punktTeX('Q', e.Q)} /> liegt nicht auf <Formel tex="g" nach="." /> Der zweite Spannvektor ist
      </p>
      <Umbruchformel
        tex={t`\overrightarrow{PQ}=${verbindungSpalte(e.g.p, e.Q)}=${spalte(e.v)}`}
        schmal={t`\begin{gathered}\overrightarrow{PQ}\\{}=${verbindungSpalte(e.g.p, e.Q)}\\{}=${spalte(e.v)}\end{gathered}`}
      />
      <p>Die Gleichung der Ebene lautet</p>
      <Umbruchformel tex={gleichungE(eb)} schmal={gleichungESchmal(eb)} />
      <Figur
        spec={RAUM_ERKLAEREN}
        unter={
          <>
            Die Gerade <Formel tex="g" /> (schwarz), der Punkt <Formel tex="Q" /> und die Ebene durch beide. Stützvektor orange, Richtungsvektor <Formel tex={t`\vec{u}`} /> blau (er liegt auf <Formel tex="g" nach=")," /> Verbindungsvektor <Formel tex={t`\overrightarrow{PQ}`} /> rosa. Über dem Bild kannst du zwischen Schrägbild und räumlicher Ansicht umschalten.
          </>
        }
      />
      <p>
        Die Probe: Für <Formel tex={t`(r\,|\,s)=(0\,|\,1)`} /> muss <Formel tex="Q" /> herauskommen, für <Formel tex={t`(r\,|\,s)=(1\,|\,0)`} /> der Punkt <Formel tex={t`g(1)`} /> der Geraden.
      </p>

      <h3>Eine Ebene aus zwei Geraden</h3>
      <p>
        Liegen zwei Geraden <Formel tex="g" /> und <Formel tex="h" /> in einer gemeinsamen Ebene, legen sie diese Ebene fest. Wann das der Fall ist und welche Spannvektoren du dann wählst, findest du im Abschnitt „Entdecken“ heraus. Die Lage zweier Geraden bestimmst du wie im Modul <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>.
      </p>
      <Hinweis titel="Schreibweise">
        Die Gerade <Formel tex="g" /> hat den Stützpunkt <Formel tex="P" nach="," /> den Richtungsvektor <Formel tex={t`\vec{u}`} /> und den Parameter <Formel tex="t" nach="." /> Die Gerade <Formel tex="h" /> hat den Stützpunkt <Formel tex="Q" nach="," /> den Richtungsvektor <Formel tex={t`\vec{w}`} /> und den Parameter <Formel tex="k" nach="." /> (In den Modulen zu den Geraden heißen sie <Formel tex={t`\vec{v}`} /> und <Formel tex="s" nach="." /> Hier wäre <Formel tex="s" /> mit dem zweiten Parameter der Ebene zu verwechseln.) Die Ebene hat die Parameter <Formel tex="r" /> und <Formel tex="s" nach="." /> In vielen Büchern und auf manchen Blättern heißen die Parameter der Ebene <Formel tex="t" /> und <Formel tex="s" nach="." />
      </Hinweis>
    </Abschnitt>
  );
}
