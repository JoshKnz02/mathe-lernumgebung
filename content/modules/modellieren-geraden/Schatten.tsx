import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { erstesZiel, parallelSchatten, zentralSchatten } from '@/lib/projektion';
import { betrag, verbindungsvektor } from '@/lib/vektor';
import { RAUM_PARALLEL, RAUM_ZENTRAL } from './Bilder';
import { SCHATTEN, WAND, hausPunkte } from './daten';
import { Schattenlabor } from './Labor';
import { lxZeile, parallelZeilen, zentralZeilen } from './rechenhilfen';

export function SchattenAbschnitt() {
  const H = hausPunkte(SCHATTEN.haus);
  const E: number[] = H.traufe[0]!;
  const F: number[] = H.traufe[1]!;
  const G: number[] = H.traufe[2]!;
  const I: number[] = H.I;
  const v = SCHATTEN.v;
  const J = SCHATTEN.J;
  const par = (x: number[]) => parallelSchatten(x, v, 'e13', WAND);
  const zen = (x: number[]) => zentralSchatten(x, J, 'e13', WAND);
  // Ein Punkt hinter der Wand (x₂ < −4) und eine Kante parallel zur Wand
  const hinter = [1, -7, 1];
  const ziel = (x: number[], art: 'parallel' | 'zentral') => erstesZiel(x, art === 'parallel' ? { art, v } : { art, J }, WAND)!;
  const falsch = zen(hinter);
  const kante = betrag(verbindungsvektor(E, F));
  const kanteParallel = betrag(verbindungsvektor(par(E).punkt!, par(F).punkt!));
  const kanteZentral = betrag(verbindungsvektor(zen(E).punkt!, zen(F).punkt!));
  const zahl = (x: number) => String(Math.round(x * 100) / 100).replace('.', '{,}');
  return (
    <Abschnitt id="schatten" titel="Entdecken: Schatten">
      <h3>Vermutung 1: Schatten bei parallelem Licht</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Die Sonne scheint mit der Richtung <Formel tex={t`\vec{v}=${spalte(v)}`} nach="." /> Bestimme den Schattenpunkt <Formel tex="I'" /> der Dachspitze <Formel tex={punktTeX('I', I)} /> auf der Wand <Formel tex={t`x_2=${WAND}`} nach="." /> Welche Gleichung musst du lösen? Welchen Wert hat der Parameter <Formel tex="t" nach="?" /> Wie liegen die Schattenpunkte <Formel tex="E'" /> der Traufecke <Formel tex={punktTeX('E', E)} /> und <Formel tex="G'" /> der Traufecke <Formel tex={punktTeX('G', G)} nach="," /> und was fällt auf? Was gilt für den Schatten der Kante <Formel tex="EF" nach="," /> die parallel zur Wand liegt? Was bedeutet es, wenn für die 3. Koordinate des Wandpunkts ein negativer Wert herauskommt?
          </p>
          <Beobachtung bild={<Figur spec={RAUM_PARALLEL} unter={<>Das Haus, die Sonnenstrahlen (orange, gestrichelt) und der Schatten (grau) auf der Wand und auf dem Boden.</>} />}>
            <Umbruchformel {...parallelZeilen(I, v, "I'", 1, WAND)} />
            <p>
              Für die Traufecke <Formel tex="E" /> ergibt sich ebenso
            </p>
            <Umbruchformel {...parallelZeilen(E, v, "E'", 1, WAND)} />
            <p>
              Bei der Traufecke <Formel tex="G" /> ist der Weg zur Wand länger:
            </p>
            <Umbruchformel {...parallelZeilen(G, v, "G_W", 1, WAND)} />
            <p>
              Der Wandpunkt <Formel tex={t`G_W`} /> hat die 3. Koordinate {zahl(par(G).punkt![2]!)}, er läge unter dem Boden. Das Licht hat den Boden also schon vorher erreicht. Der Schattenpunkt von <Formel tex="G" /> liegt auf dem Boden <Formel tex="x_3=0" nach=":" />
            </p>
            <Umbruchformel {...parallelZeilen(G, v, "G'", 2, 0)} />
            <p>
              Der Parameter <Formel tex="t" /> ist bei <Formel tex={t`G'`} /> kleiner (<Formel tex={t`t=${bruchText(ziel(G, 'parallel').parameter)}`} /> gegenüber <Formel tex={t`t=${bruchText(par(G).parameter!)}`} nach=")," /> der Strahl trifft zuerst den Boden. Der Schattenpunkt ist der Auftreffpunkt, der zum <em>kleineren</em> Parameter gehört. Für <Formel tex="E" /> und <Formel tex="I" /> trifft der Strahl zuerst die Wand (<Formel tex={t`t=${bruchText(par(E).parameter!)}`} /> und <Formel tex={t`t=${bruchText(par(I).parameter!)}`} nach=")." /> Je weiter ein Punkt von der Wand entfernt ist, desto größer ist <Formel tex="t" /> auf dem Weg zur Wand. Die Kante <Formel tex="EF" /> ist {zahl(kante)} Längeneinheiten lang und liegt parallel zur Wand. Ihr Schatten <Formel tex={t`E'F'`} /> ist {zahl(kanteParallel)} Längeneinheiten lang und parallel zu <Formel tex="EF" nach="." /> Vermutung: Bei parallelem Licht ist <Formel tex={t`t=\frac{${WAND}-x_2}{v_2}`} /> der Parameter für die Wand und <Formel tex={t`t=\frac{-x_3}{v_3}`} /> für den Boden. Der kleinere positive Wert entscheidet, Strecken parallel zur Wand behalten ihre Länge.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Schatten bei einer punktförmigen Lichtquelle</h3>
      <ol className="auftraege">
        <li>
          <p>
            Die Lampe steht in <Formel tex={punktTeX('J', J)} nach="." /> Der Strahl durch <Formel tex={punktTeX('I', I)} /> ist <Formel tex={t`g:\ \vec{x}=\vec{j}+s\cdot\overrightarrow{JI}`} nach="." /> Zu welchem Parameter <Formel tex="s" /> gehört der Punkt <Formel tex="I" nach="," /> zu welchem der Schattenpunkt <Formel tex={t`I''`} nach="?" /> Vergleiche beide Werte. Welche Werte von <Formel tex="s" /> führen zu einem Schatten auf der Wand, welche nicht? Was passiert mit einem Punkt, der hinter der Wand liegt, zum Beispiel <Formel tex={punktTeX('X', hinter)} nach="?" /> Wie lang ist der Schatten der Kante <Formel tex="EF" nach="?" />
          </p>
          <Beobachtung bild={<Figur spec={RAUM_ZENTRAL} unter={<>Die Lampe <Formel tex="J" nach="," /> die Strahlen (orange, gestrichelt) und der Schatten (grau) auf der Wand und auf dem Boden.</>} />}>
            <p>
              Mit <Formel tex={lxZeile(J, I, 'I').replace('\\overrightarrow{LI}', '\\overrightarrow{JI}')} /> ist der Punkt <Formel tex="I" /> bei <Formel tex="s=1" nach="." /> Für die Wand gilt
            </p>
            <Umbruchformel {...zentralZeilen(I, J, "I''", 1, WAND)} />
            <p>
              Der Parameter <Formel tex={t`s=${bruchText(zen(I).parameter!)}`} /> ist größer als 1: Der Schattenpunkt liegt auf dem Strahl <em>hinter</em> <Formel tex="I" nach="," /> von der Lampe aus gesehen. Für die Traufecken gilt ebenso
            </p>
            <Umbruchformel {...zentralZeilen(E, J, "E''", 1, WAND)} />
            <p>
              Bei <Formel tex="G" /> ergibt die Gleichung für die Wand
            </p>
            <Umbruchformel {...zentralZeilen(G, J, "G_W", 1, WAND)} />
            <p>
              Der Wandpunkt <Formel tex={t`G_W`} /> läge unter dem Boden (3. Koordinate {zahl(zen(G).punkt![2]!)}). Der Strahl trifft zuerst den Boden <Formel tex="x_3=0" nach=":" />
            </p>
            <Umbruchformel {...zentralZeilen(G, J, "G''", 2, 0)} />
            <p>
              Mit <Formel tex={t`s=${bruchText(ziel(G, 'zentral').parameter)}`} /> ist der Parameter kleiner als bei der Wand (<Formel tex={t`s=${bruchText(zen(G).parameter!)}`} nach=")." /> Der Punkt <Formel tex={punktTeX('X', hinter)} /> liegt hinter der Wand. Rechnerisch trifft der Strahl die Wand bei <Formel tex={t`s=${bruchText(falsch.parameter!)}`} nach="," /> das ist kleiner als 1: Die Wand liegt dann zwischen Lampe und Punkt, das Licht erreicht die Wand vor dem Punkt, ein Schatten des Punkts auf der Wand entsteht nicht. Die Kante <Formel tex="EF" /> parallel zur Wand ist {zahl(kante)} Längeneinheiten lang, ihr Schatten <Formel tex={t`E''F''`} /> ist {zahl(kanteZentral)} Längeneinheiten lang, also <Formel tex={t`s=${bruchText(zen(E).parameter!)}`} />-mal so lang. Vermutung: Der Schnittpunkt des Strahls mit einer Fläche ist nur dann der Schattenpunkt, wenn <Formel tex={t`s\ge 1`} /> gilt, wenn er also hinter dem Gegenstand liegt, und wenn er von beiden Flächen der erste ist. Bei der Lampe ist der Schatten größer als der Gegenstand, bei der Sonne gleich groß.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Schattenlabor</h3>
      <p>
        Das Haus steht vor der Wand <Formel tex={t`x_2=${WAND}`} nach="." /> Du wählst paralleles Licht (Sonne) oder eine punktförmige Lichtquelle (Lampe) und stellst die Lichtrichtung bzw. den Ort der Lampe mit den Reglern ein. Die Lichtstrahlen, den Schatten und die berechneten Schattenpunkte blendest du ein, wenn du eine Vermutung hast. Der Schatten wird gezeichnet, solange die Strahlen die Wand erreichen und der Schatten im Bild liegt. Trifft ein Strahl vor der Wand den Boden, liegt sein Schattenpunkt auf dem Boden.
      </p>
      <Schattenlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Wähle paralleles Licht und verändere die Lichtrichtung. Welche Punkte des Hauses wandern am weitesten? Wann wird der Schatten auf der Wand höher, wann niedriger? Was passiert, wenn <Formel tex="v_2" /> betragsmäßig größer wird?
          </p>
          <Beobachtung>
            Bei größerem Betrag von <Formel tex="v_2" /> sind die Parameter <Formel tex={t`t=\frac{${WAND}-x_2}{v_2}`} /> kleiner, die Strahlen sinken auf dem Weg zur Wand weniger, der Schatten auf der Wand wird höher und der Schatten auf dem Boden kürzer. Bei größerem Betrag von <Formel tex="v_3" /> sinken die Strahlen schneller: Mehr Strahlen treffen den Boden vor der Wand. Ändert sich <Formel tex="v_1" nach="," /> verschiebt sich der Schatten nach links oder rechts, ändert sich <Formel tex="v_3" nach="," /> nach oben oder unten.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle die punktförmige Lichtquelle. Verschiebe die Lampe näher ans Haus und weiter weg. Wann ist der Schatten groß, wann klein?
          </p>
          <Beobachtung>
            Je näher die Lampe am Haus steht, desto größer ist der Schatten, denn die Strahlen laufen weiter auseinander. Steht sie weit vom Haus entfernt, ähnelt der Schatten mehr dem Schatten bei parallelem Licht. Je tiefer die Lampe, desto mehr Strahlen treffen den Boden vor der Wand: Der Schatten auf der Wand wird kleiner und der Schatten auf dem Boden länger.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle paralleles Licht und stelle <Formel tex="v_2" /> auf 0 und dann auf positive Werte. Was passiert mit den Lichtstrahlen und dem Schatten? Was bedeutet das für die Gleichung <Formel tex={t`x_2+t\cdot v_2=${WAND}`} nach="?" />
          </p>
          <Beobachtung>
            Bei <Formel tex={t`v_2=0`} /> laufen die Strahlen parallel zur Wand und treffen sie nie: Die Gleichung <Formel tex={t`x_2+t\cdot 0=${WAND}`} /> hat keine Lösung, es gibt keinen Schatten auf der Wand. Bei <Formel tex={t`v_2>0`} /> laufen die Strahlen von der Wand weg. Die Gleichung hat zwar eine Lösung, aber ein <em>negatives</em> <Formel tex="t" nach="," /> der Schnittpunkt liegt entgegen der Lichtrichtung, dort kommt kein Licht des Hauses an. Vermutung: Ein Schatten auf der Wand entsteht nur, wenn <Formel tex={t`v_2<0`} /> gilt, und dann ist <Formel tex={t`t=\frac{${WAND}-x_2}{v_2}>0`} nach="." />
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

/** Zahl als TeX-Bruch (Nenner bis 12) oder Dezimalzahl mit Komma. */
function bruchText(x: number): string {
  for (let d = 1; d <= 12; d++) {
    const n = Math.round(x * d);
    if (Math.abs(x * d - n) < 1e-9) return d === 1 ? String(n) : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
  }
  return String(Math.round(x * 1000) / 1000).replace('.', '{,}');
}

