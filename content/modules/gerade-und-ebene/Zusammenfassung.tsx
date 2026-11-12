import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { RAUM_G } from './Bilder';
import { E, FAELLE as F } from './daten';
import { geradeZeilen, geradenprobeZeilen, gl, koordinatenformTeX, punktTeX, spalte } from './rechenhilfen';

export function Zusammenfassung() {
  const z = geradenprobeZeilen(F.g, E);
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Die drei Fälle und die Geradenprobe</h3>
      <Hinweis art="merksatz" titel="Lage von Gerade und Ebene">
        Eine Gerade und eine Ebene <Formel tex="E" /> haben genau einen gemeinsamen Punkt (die Gerade <Formel tex="g" /> schneidet <Formel tex="E" nach=";" /> der Punkt heißt <strong>Durchstoßpunkt</strong> <Formel tex="S" nach="),"/> keinen gemeinsamen Punkt (die Gerade <Formel tex="h" /> ist <strong>echt parallel</strong> zu <Formel tex="E" nach=")" /> oder alle Punkte gemeinsam (die Gerade <Formel tex="k" /> liegt in <Formel tex="E" nach=")." />
      </Hinweis>
      <Hinweis art="merksatz" titel="Geradenprobe">
        Setze die Koordinaten <Formel tex={t`x_i=p_i+t\,u_i`} /> der Geraden in die Koordinatenform <Formel tex={t`n_1x_1+n_2x_2+n_3x_3=d`} /> ein (liegt die Ebene in Parameterform vor, bestimme zuerst die Koordinatenform mit dem Vektorprodukt (Kreuzprodukt)). Es entsteht <Formel tex={t`(\vec{n}\cdot\vec{u})\,t+\vec{n}\cdot\vec{p}=d`} nach="." /> Löse die Gleichung nach <Formel tex="t" nach=":" />
        <ul>
          <li>Genau eine Lösung <Formel tex="t" nach=":" /> <Formel tex="g" /> schneidet <Formel tex="E" nach="." /> Setze <Formel tex="t" /> in die Geradengleichung ein und du erhältst den Durchstoßpunkt.</li>
          <li>Eine falsche Aussage (zum Beispiel <Formel tex="1=2" nach=")" />: <Formel tex="g" /> ist echt parallel zu <Formel tex="E" nach="." /></li>
          <li>Eine wahre Aussage (zum Beispiel <Formel tex="2=2" nach=")" />: <Formel tex="g" /> liegt in <Formel tex="E" nach="." /></li>
        </ul>
      </Hinweis>
      <Hinweis art="merksatz" titel="Schnelltest mit dem Skalarprodukt">
        <Formel tex={t`\vec{n}\cdot\vec{u}\ne 0`} nach=":" /> <Formel tex="g" /> schneidet <Formel tex="E" nach="." /> <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach=":" /> <Formel tex="g" /> ist echt parallel zu <Formel tex="E" /> oder liegt in <Formel tex="E" nach="." /> Dann entscheidet die Punktprobe mit dem Stützpunkt: <Formel tex={t`\vec{n}\cdot\vec{p}=d`} /> heißt „liegt in“, sonst „echt parallel“.
      </Hinweis>
      <Hinweis art="merksatz" titel="Gleichsetzen und Orthogonalität">
        Setzt du die Parameterform der Ebene und die Gerade gleich, entsteht ein Gleichungssystem für <Formel tex="r" nach="," /> <Formel tex="s" /> und <Formel tex="t" nach=":" /> genau eine Lösung heißt schneidet, keine Lösung (Widerspruchszeile) heißt echt parallel, unendlich viele Lösungen heißt liegt in. Das ist aufwendiger als die Geradenprobe. Eine Gerade steht senkrecht auf <Formel tex="E" nach="," /> wenn <Formel tex={t`\vec{u}`} /> ein Vielfaches von <Formel tex={t`\vec{n}`} /> ist. Sie schneidet <Formel tex="E" /> dann immer.
      </Hinweis>
      <Hinweis art="merksatz" titel="Geraden und Ebenen mit gegebener Lage angeben">
        Für „echt parallel“ oder „liegt in“ wählst du <Formel tex={t`\vec{u}`} /> mit <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach="." /> Der Stützpunkt entscheidet. Für „schneidet“ wählst du <Formel tex={t`\vec{u}`} /> mit <Formel tex={t`\vec{n}\cdot\vec{u}\ne 0`} nach="." /> Steckt ein Parameter in der Ebene, bestimmst du ihn aus <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> und prüfst dann den Stützpunkt.
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben sind <Formel tex={koordinatenformTeX(E.n, E.d, 'E')} /> und <Formel tex={gl(F.g)} nach="." /> Zeilenweise:
      </p>
      <Umbruchformel tex={geradeZeilen(F.g).join(t`,\quad `)} schmal={t`\begin{gathered}${geradeZeilen(F.g).join('\\\\')}\end{gathered}`} />
      <p>Einsetzen, ausmultiplizieren, zusammenfassen:</p>
      <Umbruchformel tex={z.tex} schmal={z.schmal} />
      <p>
        Aus <Formel tex={z.gleichung} /> folgt <Formel tex={t`t=${F.t}`} nach="." /> Der Durchstoßpunkt ist <Formel tex={punktTeX('S', F.S)} nach="," /> denn <Formel tex={t`\overrightarrow{OS}=${spalte(F.g.p)}+${F.t}\cdot${spalte(F.g.u)}=${spalte(F.S)}`} nach="." />
      </p>
      <Figur spec={RAUM_G} unter={<>Die Gerade <Formel tex="g" /> durch <Formel tex="P" /> durchstößt die Ebene in <Formel tex="S" nach="." /></>} />
      <Hinweis titel="Häufige Fehler">
        Bei der Geradenprobe die Klammern beim Einsetzen vergessen (vor allem bei negativen Koeffizienten). Aus dem Wegfall von <Formel tex="t" /> auf „liegt in“ schließen, ohne die verbleibende Aussage zu prüfen. Nur den Stützpunkt in die Ebene einsetzen und daraus auf „liegt in“ schließen. Bei einer Ebene in Parameterform die Koordinatenform nicht bestimmen und die Parameter <Formel tex="r" /> und <Formel tex="s" /> mit dem Parameter <Formel tex="t" /> der Geraden verwechseln.
      </Hinweis>
    </Abschnitt>
  );
}
