import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { gleichsetzMatrix, stufenform } from '@/lib/geradeebene';
import { matrixTeX } from '@/lib/lgs';
import { t } from '@/lib/modulhilfen';
import { RAUM_FAELLE, RAUM_PARALLEL_IN, RAUM_SENKRECHT } from './Bilder';
import { E, E_PARAM, FAELLE as F, PARAMETER as Pa, SENKRECHT as Sk } from './daten';
import { Geradenlabor } from './Labor';
import { geradenprobeZeilen, gl, glSchmal, koordinatenformTeX, punktTeX, skalarZeilen, spalte } from './rechenhilfen';

const probe = (g: { p: number[]; u: number[] }) => {
  const z = geradenprobeZeilen(g, E);
  return <Umbruchformel tex={z.tex} schmal={z.schmal} />;
};

export function Entdecken() {
  const zk = geradenprobeZeilen(F.k, E);
  const zh = geradenprobeZeilen(F.h, E);
  const zs = geradenprobeZeilen(Sk.g, E);
  const fall = (name: string, g: { p: number[]; u: number[] }) => {
    const m = gleichsetzMatrix(E_PARAM, g);
    return (
      <div key={name}>
        <p>
          Für <Formel tex={name} nach=":" />
        </p>
        <Formel anzeige tex={t`{\small ${matrixTeX(m)}}`} />
        <p className="klein">Zeilenstufenform:</p>
        <Formel anzeige tex={t`{\small ${matrixTeX(stufenform(m))}}`} />
      </div>
    );
  };
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Was bedeutet das Ergebnis der Geradenprobe?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={koordinatenformTeX(E.n, E.d, 'E')} nach="," /> <Formel tex={gl(F.g)} nach="," /> <Formel tex={gl(F.h, 'h')} /> und <Formel tex={gl(F.k, 'k')} nach="." /> Führe für jede Gerade die Geradenprobe durch. Was ergibt sich jeweils für die Gleichung? Was bedeutet das für die Lage der Geraden zur Ebene? Wie erkennst du am Ergebnis die drei Fälle? Probiere es im Geradenlabor aus.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_FAELLE}
                unter={
                  <>
                    <Formel tex="g" /> schneidet <Formel tex="E" /> in <Formel tex="S" nach="," /> <Formel tex="h" /> ist echt parallel zu <Formel tex="E" nach="," /> <Formel tex="k" /> liegt in <Formel tex="E" nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Für <Formel tex="g" nach=":" /> Es ergibt sich <Formel tex={geradenprobeZeilen(F.g, E).gleichung} nach="." /> Diese Gleichung hat genau eine Lösung, <Formel tex={t`t=${F.t}`} nach="." /> Setzt du <Formel tex={t`t=${F.t}`} /> in die Geradengleichung ein, erhältst du den Durchstoßpunkt:
            </p>
            <Umbruchformel
              tex={t`\overrightarrow{OS}=${spalte(F.g.p)}+${F.t}\cdot${spalte(F.g.u)}=${spalte(F.S)}`}
              schmal={t`\begin{gathered}\overrightarrow{OS}\\{}=${spalte(F.g.p)}+${F.t}\cdot${spalte(F.g.u)}\\{}=${spalte(F.S)}\end{gathered}`}
            />
            <p>
              Für <Formel tex="h" nach=":" />
            </p>
            {probe(F.h)}
            <p>
              Die Gleichung <Formel tex={zh.gleichung} /> ist eine falsche Aussage, für jedes <Formel tex="t" nach="." /> Es gibt keinen Punkt von <Formel tex="h" nach="," /> der in <Formel tex="E" /> liegt: <Formel tex="h" /> ist echt parallel zu <Formel tex="E" nach="." />
            </p>
            <p>
              Für <Formel tex="k" nach=":" />
            </p>
            {probe(F.k)}
            <p>
              Die Gleichung <Formel tex={zk.gleichung} /> ist eine wahre Aussage, für jedes <Formel tex="t" nach="." /> Jeder Punkt von <Formel tex="k" /> liegt in <Formel tex="E" nach=":" /> <Formel tex="k" /> liegt in <Formel tex="E" nach="." />
            </p>
            <p>
              Vermutung: Löst du die Gleichung der Geradenprobe nach <Formel tex="t" /> auf und bekommst genau einen Wert, schneidet die Gerade die Ebene (Durchstoßpunkt mit diesem <Formel tex="t" nach=")." /> Ergibt sich eine falsche Aussage, ist die Gerade echt parallel zur Ebene. Ergibt sich eine wahre Aussage, liegt die Gerade in der Ebene.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Geradenlabor</h3>
      <p>
        Stelle den Stützpunkt <Formel tex="P" /> und den Richtungsvektor <Formel tex={t`\vec{u}`} /> einer Geraden <Formel tex="g" /> ein. Die Ebene <Formel tex="E" /> bleibt fest. Die Geradenprobe und das Skalarprodukt <Formel tex={t`\vec{n}\cdot\vec{u}`} /> blendest du ein, wenn du eine Vermutung hast. Geraden und Ebenen zeigt das Labor nur im Raum. Über dem Bild wählst du zwischen Schrägbild und räumlicher Ansicht.
      </p>
      <Geradenlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle eine Gerade ein, die <Formel tex="E" /> schneidet. Verschiebe <Formel tex="P" /> so, dass die Gerade dieselbe bleibt (um ein Vielfaches von <Formel tex={t`\vec{u}`} nach=")." /> Was geschieht mit dem Durchstoßpunkt und mit der Gleichung der Geradenprobe?
          </p>
          <Beobachtung>
            Der Durchstoßpunkt bleibt derselbe, denn die Gerade ändert sich nicht. Nur der Parameter <Formel tex="t" /> des Durchstoßpunkts ändert sich, weil der Stützpunkt ein anderer ist. Der Faktor von <Formel tex="t" /> in der Gleichung der Geradenprobe bleibt gleich.
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Was verrät das Skalarprodukt n · u?</h3>
      <ol className="auftraege">
        <li>
          <p>
            In der Gleichung der Geradenprobe steht vor <Formel tex="t" /> eine Zahl. Berechne sie für <Formel tex="g" nach="," /> <Formel tex="h" /> und <Formel tex="k" nach="." /> Wie hängt sie mit dem Normalenvektor <Formel tex={t`\vec{n}=${spalte(E.n)}`} /> und dem Richtungsvektor <Formel tex={t`\vec{u}`} /> zusammen? Was bedeutet es für die Lage, wenn sie 0 ist? Blende im Geradenlabor <Formel tex={t`\vec{n}\cdot\vec{u}`} /> ein.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PARALLEL_IN}
                unter={
                  <>
                    <Formel tex="h" /> (schwarz) ist echt parallel zu <Formel tex="E" nach="," /> <Formel tex="k" /> (orange) liegt in <Formel tex="E" nach="." /> Bei beiden steht der Richtungsvektor senkrecht auf dem Normalenvektor.
                  </>
                }
              />
            }
          >
            <p>
              Die Zahl vor <Formel tex="t" /> ist das Skalarprodukt <Formel tex={t`\vec{n}\cdot\vec{u}`} nach=":" /> Beim Einsetzen kommt jeder Richtungsvektoranteil <Formel tex={t`u_i`} /> mit dem Koeffizienten <Formel tex={t`n_i`} /> vor <Formel tex="t" nach="." /> Für <Formel tex="g" /> ist <Formel tex={t`\vec{n}\cdot\vec{u}=${skalarZeilen(E.n, F.g.u).tex}`} nach="," /> für <Formel tex="h" /> ist <Formel tex={t`\vec{n}\cdot\vec{u}=${skalarZeilen(E.n, F.h.u).tex}`} /> und für <Formel tex="k" /> ist <Formel tex={t`\vec{n}\cdot\vec{u}=${skalarZeilen(E.n, F.k.u).tex}`} nach="." />
            </p>
            <p>
              Ist <Formel tex={t`\vec{n}\cdot\vec{u}\ne 0`} nach="," /> fällt <Formel tex="t" /> nicht weg: Die Gleichung hat genau eine Lösung und die Gerade schneidet die Ebene. Ist <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach="," /> steht <Formel tex={t`\vec{u}`} /> senkrecht auf <Formel tex={t`\vec{n}`} nach="." /> Die Gerade verläuft dann in einer Richtung, die in der Ebene liegen könnte: Sie ist echt parallel zu <Formel tex="E" /> oder liegt in <Formel tex="E" nach="." /> Welcher der beiden Fälle vorliegt, entscheidet der Stützpunkt <Formel tex="P" nach=":" /> Liegt <Formel tex="P" /> in der Ebene (<Formel tex={t`\vec{n}\cdot\vec{p}=d`} nach="),"/> liegt <Formel tex="g" /> in <Formel tex="E" nach="," /> sonst ist <Formel tex="g" /> echt parallel zu <Formel tex="E" nach="." />
            </p>
            <p>
              Vermutung (Schnelltest): <Formel tex={t`\vec{n}\cdot\vec{u}\ne 0`} /> heißt schneidet, <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> heißt echt parallel oder liegt in, und die Punktprobe mit <Formel tex="P" /> entscheidet.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Was erkennst du beim Gleichsetzen?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Die Ebene ist auch in Parameterform gegeben: <Formel tex={t`E:\ \vec{x}=${spalte(E_PARAM.p)}+r\cdot${spalte(E_PARAM.u)}+s\cdot${spalte(E_PARAM.v)}`} nach="." /> Setzt du die Gleichung von <Formel tex="E" /> mit der von <Formel tex="g" /> gleich, entsteht ein lineares Gleichungssystem für <Formel tex="r" nach="," /> <Formel tex="s" /> und <Formel tex="t" nach="." /> Stelle es auf (Spalten <Formel tex="r" nach="," /> <Formel tex="s" nach="," /> <Formel tex="t" nach=")" /> und überlege, woran du in der Zeilenstufenform die drei Fälle erkennst. Das Verfahren ist aufwendiger als die Geradenprobe, hilft aber beim Verstehen.
          </p>
          <Beobachtung>
            <p>
              Aus <Formel tex={t`\vec{p}_E+r\cdot\vec{u}+s\cdot\vec{v}=\vec{p}_g+t\cdot\vec{w}`} /> wird <Formel tex={t`r\cdot\vec{u}+s\cdot\vec{v}-t\cdot\vec{w}=\vec{p}_g-\vec{p}_E`} nach="." /> Die erweiterte Koeffizientenmatrix hat die Spalten <Formel tex={t`\vec{u}`} nach="," /> <Formel tex={t`\vec{v}`} /> und <Formel tex={t`-\vec{w}`} /> und rechts die Differenz der Stützvektoren. Zuerst die Matrix, darunter die Zeilenstufenform (Spalten <Formel tex="r" nach="," /> <Formel tex="s" nach="," /> <Formel tex="t" nach=")."/>
            </p>
            {fall('g', F.g)}
            <p>Die letzte Zeile bestimmt <Formel tex="t" /> eindeutig, das System hat genau eine Lösung: <Formel tex="g" /> schneidet <Formel tex="E" nach="." /></p>
            {fall('h', F.h)}
            <p>Die letzte Zeile ist ein Widerspruch (0 gleich eine Zahl ungleich 0), das System hat keine Lösung: <Formel tex="h" /> ist echt parallel zu <Formel tex="E" nach="." /></p>
            {fall('k', F.k)}
            <p>Die letzte Zeile besteht nur aus Nullen, das System hat unendlich viele Lösungen (eine Unbekannte ist frei wählbar): <Formel tex="k" /> liegt in <Formel tex="E" nach="." /></p>
            <p>
              Vermutung: Genau eine Lösung heißt schneidet, keine Lösung heißt echt parallel, unendlich viele Lösungen heißt liegt in. Das passt zu den drei Ergebnissen der Geradenprobe.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 4: Wann steht eine Gerade senkrecht auf der Ebene?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Eine Gerade <Formel tex="g" /> geht durch <Formel tex={punktTeX('P', Sk.P)} /> und steht senkrecht auf <Formel tex={koordinatenformTeX(E.n, E.d, 'E')} nach="." /> Wie liegt ihr Richtungsvektor zum Normalenvektor? Wie bestimmst du den Durchstoßpunkt?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_SENKRECHT}
                unter={
                  <>
                    Die Gerade <Formel tex="g" /> steht senkrecht auf <Formel tex="E" /> und durchstößt sie in <Formel tex="S" nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Der Normalenvektor <Formel tex={t`\vec{n}`} /> steht senkrecht auf der Ebene. Eine Gerade, die senkrecht auf der Ebene steht, hat also dieselbe Richtung: Ihr Richtungsvektor ist ein Vielfaches von <Formel tex={t`\vec{n}`} nach="." /> Man kann <Formel tex={t`\vec{u}=\vec{n}`} /> wählen:
            </p>
            <Umbruchformel tex={gl(Sk.g)} schmal={glSchmal(Sk.g)} />
            <p>
              Eine solche Gerade schneidet die Ebene immer, denn <Formel tex={t`\vec{n}\cdot\vec{n}\ne 0`} nach="." /> Den Durchstoßpunkt bestimmst du mit der Geradenprobe:
            </p>
            <Umbruchformel tex={zs.tex} schmal={zs.schmal} />
            <p>
              Aus <Formel tex={zs.gleichung} /> folgt <Formel tex={t`t=${Sk.t}`} nach="," /> und <Formel tex={punktTeX('S', Sk.S)} nach="." /> Vermutung: Eine Gerade steht senkrecht auf <Formel tex="E" nach="," /> wenn ihr Richtungsvektor ein Vielfaches des Normalenvektors ist.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 5: Geraden und Ebenen mit gegebener Lage angeben</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={t`E_b:\ x_1+b\,x_2+2x_3=4`} /> und die Gerade <Formel tex={t`g:\ \vec{x}=${spalte(Pa.P)}+t\cdot${spalte(Pa.u)}`} nach="." /> Für welchen Wert von <Formel tex="b" /> ist <Formel tex="g" /> parallel zu <Formel tex={t`E_b`} nach="?" /> Liegt <Formel tex="g" /> dann in <Formel tex={t`E_b`} /> oder ist sie echt parallel? Wie würdest du eine Gerade durch <Formel tex={punktTeX('Q', Pa.P0)} /> angeben, die echt parallel zu <Formel tex={t`E_b`} /> ist?
          </p>
          <Beobachtung>
            <p>
              Der Normalenvektor ist <Formel tex={t`\vec{n}=(1\,|\,b\,|\,2)`} nach="." /> Die Gerade verläuft parallel zur Ebene oder in ihr, wenn <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> gilt:
            </p>
            <Umbruchformel tex={t`1\cdot 2+b\cdot 1+2\cdot(-2)=0`} schmal={t`\begin{gathered}2+b-4=0\\b-2=0\\b=2\end{gathered}`} />
            <p>
              Für <Formel tex="b=2" /> prüfst du den Stützpunkt: <Formel tex={t`1\cdot 2+2\cdot 1+2\cdot 0=4`} nach="." /> Das ist die rechte Seite, <Formel tex="P" /> liegt in <Formel tex={t`E_b`} nach="," /> also liegt <Formel tex="g" /> in <Formel tex={t`E_b`} nach="." /> Für jeden anderen Wert von <Formel tex="b" /> schneidet <Formel tex="g" /> die Ebene.
            </p>
            <p>
              Eine echt parallele Gerade durch <Formel tex={punktTeX('Q', Pa.P0)} /> (der Punkt liegt nicht in <Formel tex={t`E_b`} nach=")" /> bekommst du mit demselben Richtungsvektor: <Formel tex={t`\vec{x}=${spalte(Pa.P0)}+t\cdot${spalte(Pa.u)}`} nach="." /> Strategie: Für „echt parallel“ oder „liegt in“ wählst du einen Richtungsvektor mit <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach="." /> Der Stützpunkt entscheidet, ob die Gerade in der Ebene liegt oder nicht. Für „schneidet“ wählst du einen Richtungsvektor mit <Formel tex={t`\vec{n}\cdot\vec{u}\ne 0`} nach="." /> Enthält die Ebenengleichung einen Parameter, bestimmst du ihn aus der Bedingung <Formel tex={t`\vec{n}\cdot\vec{u}=0`} nach="." />
            </p>
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
