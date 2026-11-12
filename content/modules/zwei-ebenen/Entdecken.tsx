import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { stufenform } from '@/lib/geradeebene';
import { matrixTeX } from '@/lib/lgs';
import { t } from '@/lib/modulhilfen';
import { gleichsetzMatrixEE } from '@/lib/zweiebenen';
import { RAUM_PARALLEL, RAUM_SCHNEIDEN } from './Bilder';
import { E, E_PARAM, F, F_PARAM, G, G_PARAM, H, H_PARAM, PARAMETER as Pa, SCHNITT } from './daten';
import { Zweiebenenlabor } from './Labor';
import { ebenenprobeZeilen, gl, koordinatenformTeX, spalte } from './rechenhilfen';

const probe = (k: { n: number[]; d: number }) => {
  const z = ebenenprobeZeilen(E_PARAM, k);
  return <Umbruchformel tex={z.tex} schmal={z.schmal} />;
};
const klein = (m: number[][]) => <Formel anzeige tex={`{${m[0]!.length >= 5 ? '\\scriptsize' : '\\footnotesize'} ${matrixTeX(m)}}`} />;
const gauss = (name: string, k: { n: number[]; d: number }) => {
  const m = [[...E.n, E.d], [...k.n, k.d]];
  return (
    <div key={name}>
      <p>
        Für <Formel tex={name} nach=":" />
      </p>
      {klein(m)}
      <p className="klein">Zeilenstufenform:</p>
      {klein(stufenform(m))}
    </div>
  );
};
const gleichsetzen = (name: string, f: typeof F_PARAM) => {
  const m = gleichsetzMatrixEE(E_PARAM, f);
  return (
    <div key={name}>
      <p>
        Für <Formel tex={name} nach=":" />
      </p>
      {klein(m)}
      <p className="klein">Zeilenstufenform:</p>
      {klein(stufenform(m))}
    </div>
  );
};

export function Entdecken() {
  const zf = ebenenprobeZeilen(E_PARAM, F);
  const zg = ebenenprobeZeilen(E_PARAM, G);
  const zh = ebenenprobeZeilen(E_PARAM, H);
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung 1: Was bedeutet das Ergebnis der Ebenenprobe?</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben ist <Formel tex={t`E:\ \vec{x}=${spalte(E_PARAM.p)}+r\cdot${spalte(E_PARAM.u)}+s\cdot${spalte(E_PARAM.v)}`} nach="." /> Führe die Ebenenprobe mit <Formel tex={koordinatenformTeX(F.n, F.d, 'F')} nach="," /> <Formel tex={koordinatenformTeX(G.n, G.d, 'G')} /> und <Formel tex={koordinatenformTeX(H.n, H.d, 'H')} /> durch. Was ergibt sich jeweils für die Gleichung mit <Formel tex="r" /> und <Formel tex="s" nach="?" /> Was bedeutet das für die Lage der Ebenen? Probiere es im Zweiebenenlabor aus.
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_SCHNEIDEN}
                unter={
                  <>
                    <Formel tex="E" /> und <Formel tex="F" /> schneiden sich in <Formel tex="s" nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Für <Formel tex="F" nach=":" />
            </p>
            {probe(F)}
            <p>
              Es bleibt <Formel tex={zf.gleichung} nach="." /> Das ist eine Gleichung mit zwei Unbekannten, sie hat unendlich viele Lösungen: Du kannst <Formel tex="s" /> beliebig wählen, und <Formel tex="r" /> hängt von <Formel tex="s" /> ab, hier <Formel tex="r=-s" nach="." /> Setzt du das in die Parameterform von <Formel tex="E" /> ein, erhältst du die gemeinsamen Punkte:
            </p>
            <Umbruchformel
              tex={t`\vec{x}=${spalte(E_PARAM.p)}-s\cdot${spalte(E_PARAM.u)}+s\cdot${spalte(E_PARAM.v)}=${spalte(SCHNITT.p)}+s\cdot${spalte(SCHNITT.u)}`}
              schmal={t`\begin{gathered}\vec{x}=${spalte(E_PARAM.p)}-s\cdot${spalte(E_PARAM.u)}\\{}+s\cdot${spalte(E_PARAM.v)}\\{}=${spalte(SCHNITT.p)}+s\cdot${spalte(SCHNITT.u)}\end{gathered}`}
            />
            <p>
              Das ist die Gleichung der Schnittgeraden: <Formel tex={gl(SCHNITT, 's', 's')} nach="." /> Die Ebenen schneiden sich.
            </p>
            <p>
              Für <Formel tex="G" nach=":" />
            </p>
            {probe(G)}
            <p>
              Es bleibt <Formel tex={zg.gleichung} nach="." /> Das ist eine falsche Aussage, für alle <Formel tex="r" /> und <Formel tex="s" nach="." /> Kein Punkt von <Formel tex="E" /> liegt in <Formel tex="G" nach="." /> Die Ebenen sind echt parallel.
            </p>
            <p>
              Für <Formel tex="H" nach=":" />
            </p>
            {probe(H)}
            <p>
              Es bleibt <Formel tex={zh.gleichung} nach="." /> Das ist eine wahre Aussage, für alle <Formel tex="r" /> und <Formel tex="s" nach="." /> Jeder Punkt von <Formel tex="E" /> liegt in <Formel tex="H" nach="." /> Die Ebenen sind identisch.
            </p>
            <p>
              Vermutung: Ergibt die Ebenenprobe eine Gleichung, in der <Formel tex="r" /> oder <Formel tex="s" /> vorkommt, schneiden sich die Ebenen. Löse nach einer Unbekannten auf und setze in die Parameterform ein, das gibt die Schnittgerade. Fallen beide weg und die Aussage ist falsch, sind die Ebenen echt parallel. Ist die Aussage wahr, sind sie identisch.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Zweiebenenlabor</h3>
      <p>
        Die Ebene <Formel tex="E" /> bleibt fest. Stelle die Koeffizienten <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> und die Zahl <Formel tex="d" /> der zweiten Ebene <Formel tex="F" /> ein. Die Normalenvektoren und die Lage blendest du ein, wenn du eine Vermutung hast. Ebenen zeigt das Labor nur im Raum. Über dem Bild wählst du zwischen Schrägbild und räumlicher Ansicht.
      </p>
      <Zweiebenenlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle <Formel tex="F" /> so ein, dass die Ebenen echt parallel sind. Verändere dann nur <Formel tex="d" nach="." /> Wann sind die Ebenen identisch? Welche Rolle spielen die Normalenvektoren?
          </p>
          <Beobachtung>
            Sind die Normalenvektoren Vielfache voneinander, sind die Ebenen parallel oder identisch. Verändert man nur <Formel tex="d" nach="," /> wird die Ebene verschoben: Sie ist echt parallel zu <Formel tex="E" nach="," /> außer für einen einzigen Wert von <Formel tex="d" nach="," /> bei dem sie auf <Formel tex="E" /> liegt. Für <Formel tex={t`\vec{n}_F=\vec{n}_E`} /> ist das <Formel tex={t`d=${E.d}`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Was verraten die Normalenvektoren?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Vergleiche im Labor die Normalenvektoren der Ebenen, die sich schneiden, die echt parallel sind und die identisch sind. Was fällt dir auf? Wie kannst du die drei Fälle allein aus den Normalenvektoren und den Zahlen <Formel tex="d" /> unterscheiden?
          </p>
          <Beobachtung
            bild={
              <Figur
                spec={RAUM_PARALLEL}
                unter={
                  <>
                    <Formel tex="E" /> und <Formel tex="G" /> haben denselben Normalenvektor, aber verschiedene Zahlen <Formel tex="d" nach="." />
                  </>
                }
              />
            }
          >
            <p>
              Bei sich schneidenden Ebenen sind die Normalenvektoren keine Vielfachen voneinander, zum Beispiel <Formel tex={t`\vec{n}_E=${spalte(E.n)}`} /> und <Formel tex={t`\vec{n}_F=${spalte(F.n)}`} nach="." /> Die Ebenen sind dann verschieden geneigt und schneiden sich in einer Geraden. Bei <Formel tex="G" /> ist <Formel tex={t`\vec{n}_G=\vec{n}_E`} nach="," /> bei <Formel tex="H" /> ist <Formel tex={t`\vec{n}_H=-2\cdot\vec{n}_E`} nach="." /> Die Ebenen sind gleich geneigt, also parallel oder identisch. Ob sie auch auf derselben Stelle liegen, entscheidet die Zahl <Formel tex="d" nach=":" /> Bei <Formel tex="H" /> ist <Formel tex={t`d_H=-2\cdot d_E`} nach="," /> bei <Formel tex="G" /> ist <Formel tex={t`d_G\ne d_E`} nach="." /> Eine Punktprobe mit einem Punkt von <Formel tex="E" /> in der Gleichung der anderen Ebene entscheidet ebenso.
            </p>
            <p>
              Vermutung (Schnelltest): Normalenvektoren keine Vielfachen heißt schneiden. Normalenvektoren Vielfache heißt parallel oder identisch, und dass auch <Formel tex="d" /> mit demselben Faktor vervielfacht wird, heißt identisch.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 3: Was zeigt die Zeilenstufenform bei zwei Koordinatenformen?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Jede Koordinatenform ist eine Gleichung für <Formel tex="x_1" nach="," /> <Formel tex="x_2" /> und <Formel tex="x_3" nach="." /> Stelle für <Formel tex="E" /> und <Formel tex="F" /> (dann <Formel tex="E" /> und <Formel tex="G" nach="," /> <Formel tex="E" /> und <Formel tex="H" nach=")" /> die erweiterte Koeffizientenmatrix auf und bringe sie auf Zeilenstufenform. Woran erkennst du die drei Fälle? Wie bestimmst du die Schnittgerade?
          </p>
          <Beobachtung>
            {gauss('E,F', F)}
            <p>
              Zwei Zeilen mit je einem Pivot: Das System hat unendlich viele Lösungen mit <strong>einer</strong> freien Unbekannten. Aus der zweiten Zeile folgt <Formel tex="x_2=0" nach="." /> Setze die freie Unbekannte <Formel tex="x_3=t" nach="," /> dann folgt aus der ersten Zeile <Formel tex={t`2x_1+2t=2`} nach="," /> also <Formel tex={t`x_1=1-t`} nach=":" /> <Formel tex={gl(SCHNITT, 's')} nach="." /> Die Ebenen schneiden sich.
            </p>
            {gauss('E,G', G)}
            <p>
              Die letzte Zeile heißt <Formel tex={t`0=-1`} nach="," /> ein Widerspruch: keine Lösung. Die Ebenen sind echt parallel.
            </p>
            {gauss('E,H', H)}
            <p>
              Die zweite Zeile besteht nur aus Nullen, es bleibt eine Gleichung für drei Unbekannte: zwei freie Unbekannte, jeder Punkt von <Formel tex="E" /> ist Lösung. Die Ebenen sind identisch.
            </p>
            <p>
              Vermutung: Genau eine freie Unbekannte (zwei Pivots) heißt Schnittgerade, ein Widerspruch heißt echt parallel, zwei freie Unbekannte (eine Nullzeile) heißt identisch. Einen einzelnen gemeinsamen Punkt, also keine freie Unbekannte, gibt es bei zwei Ebenen nie.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 4: Was erkennst du beim Gleichsetzen zweier Parameterformen?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Zwei Ebenen in Parameterform gleichzusetzen führt auf drei Gleichungen für die vier Unbekannten <Formel tex={t`r_1`} nach="," /> <Formel tex={t`s_1`} nach="," /> <Formel tex={t`r_2`} /> und <Formel tex={t`s_2`} nach="." /> Das ist aufwendiger als die Ebenenprobe und wird nicht empfohlen, hilft aber beim Verstehen. Die Parameterformen von <Formel tex="F" nach="," /> <Formel tex="G" /> und <Formel tex="H" /> stehen in der Beobachtung. Wie viele freie Unbekannte erwartest du in den drei Fällen?
          </p>
          <Beobachtung>
            <p>
              <Formel tex={t`E:\ \vec{x}=${spalte(E_PARAM.p)}+r_1\cdot${spalte(E_PARAM.u)}+s_1\cdot${spalte(E_PARAM.v)}`} nach="." /> Die Matrizen haben die Spalten <Formel tex={t`r_1`} nach="," /> <Formel tex={t`s_1`} nach="," /> <Formel tex={t`r_2`} nach="," /> <Formel tex={t`s_2`} /> und rechts die Differenz der Stützvektoren.
            </p>
            <Umbruchformel tex={t`F:\ \vec{x}=${spalte(F_PARAM.p)}+r_2\cdot${spalte(F_PARAM.u)}+s_2\cdot${spalte(F_PARAM.v)}`} schmal={t`\begin{gathered}F:\ \vec{x}=${spalte(F_PARAM.p)}\\{}+r_2\cdot${spalte(F_PARAM.u)}\\{}+s_2\cdot${spalte(F_PARAM.v)}\end{gathered}`} />
            {gleichsetzen('E,F', F_PARAM)}
            <p>Drei Zeilen haben einen Pivot, bei vier Unbekannten bleibt genau eine Spalte ohne Pivot: eine freie Unbekannte, Schnittgerade.</p>
            <Umbruchformel tex={t`G:\ \vec{x}=${spalte(G_PARAM.p)}+r_2\cdot${spalte(G_PARAM.u)}+s_2\cdot${spalte(G_PARAM.v)}`} schmal={t`\begin{gathered}G:\ \vec{x}=${spalte(G_PARAM.p)}\\{}+r_2\cdot${spalte(G_PARAM.u)}\\{}+s_2\cdot${spalte(G_PARAM.v)}\end{gathered}`} />
            {gleichsetzen('E,G', G_PARAM)}
            <p>Die letzte Zeile ist ein Widerspruch: keine Lösung, echt parallel.</p>
            <Umbruchformel tex={t`H:\ \vec{x}=${spalte(H_PARAM.p)}+r_2\cdot${spalte(H_PARAM.u)}+s_2\cdot${spalte(H_PARAM.v)}`} schmal={t`\begin{gathered}H:\ \vec{x}=${spalte(H_PARAM.p)}\\{}+r_2\cdot${spalte(H_PARAM.u)}\\{}+s_2\cdot${spalte(H_PARAM.v)}\end{gathered}`} />
            {gleichsetzen('E,H', H_PARAM)}
            <p>Die Zeilenstufenform hat zwei Pivots und eine Nullzeile: Zwei Spalten haben keinen Pivot, es gibt zwei freie Unbekannte, die Ebenen sind identisch.</p>
            <p>
              Vermutung: Eine freie Unbekannte heißt Schnittgerade, ein Widerspruch heißt echt parallel, zwei freie Unbekannte heißen identisch. Eine eindeutige Lösung gibt es bei zwei Ebenen nie.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 5: Ebenen mit gegebener Lage angeben</h3>
      <ol className="auftraege">
        <li>
          <p>
            Gegeben sind <Formel tex={koordinatenformTeX(E.n, E.d, 'E')} /> und <Formel tex={t`F_a:\ a\,x_1-2x_2+4x_3=${Pa.d}`} nach="." /> Für welchen Wert von <Formel tex="a" /> sind die Ebenen parallel oder identisch? Welche Lage haben sie dann? Wie gibst du eine Ebene an, die zu <Formel tex="E" /> echt parallel ist und durch einen Punkt <Formel tex="P" /> geht, der nicht in <Formel tex="E" /> liegt?
          </p>
          <Beobachtung>
            <p>
              Der Normalenvektor von <Formel tex={t`F_a`} /> ist <Formel tex={t`\vec{n}=(a\,|\,-2\,|\,4)`} nach="." /> Er muss ein Vielfaches von <Formel tex={t`\vec{n}_E=${spalte(E.n)}`} /> sein. Die zweite Koordinate <Formel tex="-2" /> ist das <Formel tex="2" />-Fache von <Formel tex="-1" nach="," /> der Faktor ist also 2, und dann ist <Formel tex={t`a=2\cdot 2=${Pa.a}`} nach="." /> Die dritte Koordinate passt: <Formel tex={t`2\cdot 2=4`} nach="." />
            </p>
            <p>
              Für <Formel tex={t`a=${Pa.a}`} /> prüfst du die Zahl <Formel tex="d" nach=":" /> <Formel tex={t`2\cdot ${E.d}=${2 * E.d}`} nach="," /> und das ist die rechte Seite von <Formel tex={t`F_a`} nach="." /> Also sind die Ebenen identisch. Für jeden anderen Wert von <Formel tex="a" /> schneiden sie sich.
            </p>
            <p>
              Eine echt parallele Ebene durch <Formel tex="P" /> bekommst du mit demselben Normalenvektor <Formel tex={t`\vec{n}_E`} nach="," /> nur die Zahl <Formel tex="d" /> wird neu bestimmt: <Formel tex={t`d=\vec{n}_E\cdot\vec{p}`} nach="." /> Strategie: Für „parallel“ oder „identisch“ wählst du denselben Normalenvektor oder ein Vielfaches, und die Zahl <Formel tex="d" /> entscheidet. Für „schneiden“ wählst du einen Normalenvektor, der kein Vielfaches ist. Steckt ein Parameter in der Gleichung, bestimmst du ihn aus der Bedingung, dass die Normalenvektoren Vielfache sind, und prüfst dann <Formel tex="d" nach="." />
            </p>
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
