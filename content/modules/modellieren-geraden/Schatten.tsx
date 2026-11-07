import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { parallelSchatten, zentralSchatten } from '@/lib/projektion';
import { RAUM_PARALLEL, RAUM_ZENTRAL } from './Bilder';
import { SCHATTEN } from './daten';
import { Schattenlabor } from './Labor';
import { lxZeile, parallelZeilen, zentralZeilen } from './rechenhilfen';

const NAMEN_E = ['P', 'Q', 'R'];

export function SchattenAbschnitt() {
  const P: number[] = SCHATTEN.ecken[0]!;
  const Q: number[] = SCHATTEN.ecken[1]!;
  const R: number[] = SCHATTEN.ecken[2]!;
  const v = SCHATTEN.v;
  const L = SCHATTEN.L;
  const par = [P, Q, R].map((x) => parallelSchatten(x, v, 'e12'));
  const zen = [P, Q, R].map((x) => zentralSchatten(x, L, 'e12'));
  // ein Punkt unter dem Boden
  const unten = [1, 1, -2];
  const falsch = zentralSchatten(unten, L, 'e12');
  const hoehe = [P, Q, R].map((x) => x[2]!);
  const hoechste = NAMEN_E.filter((_, i) => hoehe[i] === Math.max(...hoehe));
  const niedrigste = NAMEN_E[hoehe.indexOf(Math.min(...hoehe))]!;
  const first = SCHATTEN.haus.laenge;
  const laengeFirst = `${first} Einheiten`;
  const laengeZentral = `${first * zen[0]!.parameter!} Einheiten`;
  return (
    <Abschnitt id="schatten" titel="Entdecken: Schatten">
      <h3>Vermutung 1: Schatten bei parallelem Licht</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Die Sonne scheint mit der Richtung <Formel tex={t`\vec{v}=${spalte(v)}`} nach="." /> Bestimme den Schattenpunkt <Formel tex="P'" /> der vorderen Dachspitze <Formel tex={punktTeX('P', P)} /> des Hauses auf dem Boden <Formel tex="x_3=0" nach="." /> Welche Gleichung musst du lösen? Welchen Wert hat der Parameter <Formel tex="t" nach="?" /> Wie liegen die Schattenpunkte <Formel tex="Q'" /> der hinteren Dachspitze und <Formel tex="R'" /> der Traufecke, und was fällt an der Verschiebung der Punkte auf? Was gilt für den Schatten des Firsts <Formel tex="PQ" nach="?" />
          </p>
          <Beobachtung bild={<Figur spec={RAUM_PARALLEL} unter={<>Das Haus (schwarz), die Sonnenstrahlen (orange) und der Schatten auf dem Boden (rosa, gestrichelt).</>} />}>
            <Umbruchformel {...parallelZeilen(P, v, "P'")} />
            <p>
              Für die anderen Punkte ergibt sich ebenso
            </p>
            <Umbruchformel {...parallelZeilen(Q, v, "Q'")} />
            <Umbruchformel {...parallelZeilen(R, v, "R'")} />
            <p>
              Der Schattenpunkt ist der Schnittpunkt des Lichtstrahls mit dem Boden. Du setzt dafür die 3. Koordinate des Strahls gleich 0 und erhältst den Parameter <Formel tex="t" nach="." /> Er ist positiv (<Formel tex={t`t=${par[0]!.parameter}`} nach="," /> <Formel tex={t`t=${par[1]!.parameter}`} /> und <Formel tex={t`t=${par[2]!.parameter}`} nach=")," /> weil die Strahlen vom Haus nach unten zum Boden laufen. Die Dachspitzen {hoechste.map((n) => n).join(' und ')} sind doppelt so hoch wie die Traufecke <Formel tex={niedrigste} nach="," /> ihr Parameter ist doppelt so groß und sie werden doppelt so weit verschoben. Der First <Formel tex="PQ" /> ist {laengeFirst} lang und liegt parallel zum Boden. Sein Schatten <Formel tex={t`P'Q'`} /> ist ebenfalls {laengeFirst} lang und parallel zu <Formel tex="PQ" nach="." /> Vermutung: Bei parallelem Licht ist <Formel tex={t`t=\frac{x_3}{-v_3}`} nach="," /> die Verschiebung wächst mit der Höhe des Punkts, ein Gegenstand wirft bei Sonnenlicht einen Schatten in seiner Größe, und <Formel tex="t" /> muss positiv sein, damit der Strahl von der Ecke nach unten zum Boden führt.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Schatten bei einer punktförmigen Lichtquelle</h3>
      <ol className="auftraege">
        <li>
          <p>
            Die Straßenlaterne steht in <Formel tex={punktTeX('L', L)} nach="." /> Der Strahl durch <Formel tex={punktTeX('P', P)} /> ist <Formel tex={t`g:\ \vec{x}=\vec{l}+s\cdot\overrightarrow{LP}`} nach="." /> Zu welchem Parameter <Formel tex="s" /> gehört der Punkt <Formel tex="P" nach="," /> zu welchem der Schattenpunkt <Formel tex="P''" nach="?" /> Vergleiche beide Werte. Welche Werte von <Formel tex="s" /> führen zu einem Schatten auf dem Boden, welche nicht? Was passiert mit einem Punkt, der unter dem Boden liegt, zum Beispiel <Formel tex={punktTeX('X', unten)} nach="?" />
          </p>
          <Beobachtung bild={<Figur spec={RAUM_ZENTRAL} unter={<>Die Laterne <Formel tex="L" nach="," /> die Strahlen (orange) und der Schatten des Hauses auf dem Boden (rosa, gestrichelt).</>} />}>
            <p>
              Mit <Formel tex={lxZeile(L, P, 'P')} /> ist der Punkt <Formel tex="P" /> bei <Formel tex="s=1" nach="." /> Für den Boden gilt
            </p>
            <Umbruchformel {...zentralZeilen(P, L, "P''")} />
            <p>
              Der Parameter <Formel tex={t`s=${bruchText(zen[0]!.parameter!)}`} /> ist größer als 1: Der Schattenpunkt liegt auf dem Strahl <em>hinter</em> <Formel tex="P" nach="," /> von der Lampe aus gesehen. Für <Formel tex="Q" /> und <Formel tex="R" /> gilt ebenso
            </p>
            <Umbruchformel {...zentralZeilen(Q, L, "Q''")} />
            <Umbruchformel {...zentralZeilen(R, L, "R''")} />
            <p>
              Der Punkt <Formel tex={punktTeX('X', unten)} /> liegt unter dem Boden. Rechnerisch trifft der Strahl den Boden bei <Formel tex={t`s=${bruchText(falsch.parameter!)}`} nach="," /> das ist kleiner als 1: Der Boden liegt dann zwischen Lampe und Punkt, das Licht erreicht den Boden vor dem Punkt, ein Schatten des Punkts auf dem Boden entsteht nicht. Der Schatten des Firsts <Formel tex={t`P''Q''`} /> ist <Formel tex={t`${bruchText(zen[0]!.parameter!)}`} />-mal so lang wie der First, nämlich {laengeZentral}, und parallel zu ihm. Vermutung: Der Schnittpunkt des Strahls mit dem Boden ist nur dann der Schattenpunkt, wenn <Formel tex={t`s\ge 1`} /> gilt, wenn er also hinter dem Gegenstand liegt. Bei der Laterne ist der Schatten größer als der Gegenstand, bei der Sonne gleich groß.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Schattenlabor</h3>
      <p>
        Das Haus steht auf dem Boden <Formel tex="x_3=0" nach="." /> Du wählst paralleles Licht (Sonne) oder eine punktförmige Lichtquelle (Laterne) und stellst die Lichtrichtung bzw. den Ort der Lampe mit den Reglern ein. Die Lichtstrahlen, den Schatten und die berechneten Schattenpunkte blendest du ein, wenn du eine Vermutung hast. Punkte, die nicht im gezeichneten Koordinatensystem liegen, werden nicht gezeichnet, die Rechnung gilt trotzdem.
      </p>
      <Schattenlabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Wähle paralleles Licht und verändere die Lichtrichtung. Welche der Punkte <Formel tex="P" nach="," /> <Formel tex="Q" /> und <Formel tex="R" /> wandern am weitesten? Wann wird der Schatten größer, wann kleiner? Was passiert, wenn <Formel tex="v_3" /> betragsmäßig größer wird?
          </p>
          <Beobachtung>
            Die Dachspitzen {hoechste.join(' und ')} haben die größte Höhe (<Formel tex="x_3=2" nach=")" /> und werden bei jeder Lichtrichtung am weitesten verschoben, genau doppelt so weit wie die Traufecke <Formel tex={niedrigste} nach="." /> Bei größerem Betrag von <Formel tex="v_3" /> sind die Parameter <Formel tex={t`t=\frac{x_3}{-v_3}`} /> kleiner, alle Schattenpunkte rücken näher an die Stelle unter den Ecken heran, der Schatten liegt dichter am Haus. Ändert sich <Formel tex="v_1" nach="," /> verschiebt sich der Schatten in Richtung der <Formel tex="x_1" />-Achse, ändert sich <Formel tex="v_2" nach="," /> in Richtung der <Formel tex="x_2" />-Achse.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle die punktförmige Lichtquelle. Verschiebe die Lampe nach oben und nach unten. Wann ist der Schatten groß, wann klein? Wann gibt es für einzelne Punkte keinen Schatten?
          </p>
          <Beobachtung>
            Je tiefer die Lampe über dem Dach steht, desto größer ist der Schatten, denn die Strahlen laufen weiter auseinander. Steht sie sehr hoch (<Formel tex="L_3" /> groß), ähnelt der Schatten mehr dem Schatten bei parallelem Licht von oben. Ist <Formel tex={t`L_3`} /> nicht größer als die Höhe eines Punkts, gibt es für diesen Punkt keinen Schatten auf dem Boden: Der Strahl läuft dann parallel zum Boden (bei gleicher Höhe <Formel tex="x_3" nach=")" /> oder der Boden liegt nicht hinter dem Punkt (<Formel tex={t`s<1`} nach=")." /> Vermutung: Ein Schatten auf dem Boden entsteht nur für Punkte, die zwischen der Lampe und dem Boden liegen.
          </Beobachtung>
        </li>
        <li>
          <p>
            Wähle paralleles Licht und stelle <Formel tex="v_3" /> auf 0 und dann auf positive Werte. Was passiert mit den Lichtstrahlen und dem Schatten? Was bedeutet das für die Gleichung <Formel tex={t`x_3+t\cdot v_3=0`} nach="?" />
          </p>
          <Beobachtung>
            Bei <Formel tex={t`v_3=0`} /> läuft das Licht waagerecht, alle Strahlen bleiben auf ihrer Höhe und treffen den Boden nie: Die Gleichung <Formel tex={t`x_3+t\cdot 0=0`} /> hat keine Lösung, es gibt keinen Schatten. Bei <Formel tex={t`v_3>0`} /> läuft das Licht nach oben. Die Gleichung hat zwar eine Lösung, aber ein <em>negatives</em> <Formel tex="t" nach="," /> der Schnittpunkt liegt entgegen der Lichtrichtung unter dem Haus, dort kommt kein Licht des Hauses an. Vermutung: Ein Schatten auf dem Boden entsteht nur, wenn <Formel tex={t`v_3<0`} /> gilt, und dann ist <Formel tex={t`t=\frac{x_3}{-v_3}\ge 0`} nach="." />
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

