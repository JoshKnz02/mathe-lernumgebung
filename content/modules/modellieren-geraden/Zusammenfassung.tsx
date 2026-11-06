import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { abstandsquadrat, begegnung, kleinsterAbstand, minutenSekunden, type Bewegung } from '@/lib/bewegung';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { RAUM_BAHNEN, RAUM_PARALLEL, RAUM_ZENTRAL } from './Bilder';
import { BEWEGUNGSLABOR, HUBSCHRAUBER, S_BEWEGUNG, SCHATTEN } from './daten';
import { abstandsfunktionZeilen, abstandsvektor, geschwindigkeitZeilen, minimumZeilen, parallelZeilen, polyTeX, rund2, stunden, zeitGleichung, zentralZeilen, type Zeilen } from './rechenhilfen';

const Z = ({ z }: { z: Zeilen }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;

export function Zusammenfassung() {
  const h = HUBSCHRAUBER;
  const r: Bewegung = { ...BEWEGUNGSLABOR.R, tempo: 90 };
  const be = begegnung(h, r);
  const q = abstandsquadrat(h, r);
  const k = kleinsterAbstand(h, r);
  const mR = minutenSekunden(be.zeiten!.t2);
  const ecken = SCHATTEN.ecken as number[][];
  const NAMEN = ['P', 'Q', 'R'];
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Bewegungen</h3>
      <Hinweis art="merksatz" titel="Bewegungsgleichung">
        Ein Objekt startet im Punkt <Formel tex="P" /> und fliegt geradlinig in Richtung <Formel tex={t`\vec{u}`} /> mit dem Tempo <Formel tex="w" nach="." /> Zur Zeit <Formel tex={t`t\ge 0`} /> (in Stunden ab Beobachtungsbeginn) ist es im Punkt
        <Formel anzeige tex={t`\vec{x}(t)=\vec{p}+t\cdot\vec{v}\quad\text{mit}\quad\vec{v}=w\cdot\frac{\vec{u}}{|\vec{u}|}`} />
        Der <strong>Geschwindigkeitsvektor</strong> <Formel tex={t`\vec{v}`} /> hat die Richtung von <Formel tex={t`\vec{u}`} /> und den Betrag <Formel tex="w" nach="," /> er sagt, wie sich das Objekt in einer Stunde verschiebt. Der Richtungsvektor <Formel tex={t`\vec{u}`} /> darf nur dann als Geschwindigkeitsvektor genommen werden, wenn <Formel tex={t`|\vec{u}|=w`} /> gilt. Die zurückgelegte Strecke ist <Formel tex={t`w\cdot t`} nach="." /> Die Bahn ist die Gerade, die Bewegung nur der Teil mit <Formel tex={t`t\ge 0`} nach="." />
      </Hinweis>
      <Hinweis art="merksatz" titel="Kollision, Schnittpunkt der Bahnen und Abstand">
        <ul className="liste-ohne-zahl" aria-label="Begegnung zweier Objekte">
          <li><strong>Kollision</strong> (Punktmodell): Beide Objekte sind zur selben Zeit am selben Ort, also <Formel tex={t`\vec{p}_1+t\cdot\vec{v}_1=\vec{p}_2+t\cdot\vec{v}_2`} /> mit <em>einem</em> <Formel tex="t" /> und <Formel tex={t`t\ge 0`} nach="." /> Alle drei Koordinatengleichungen müssen dasselbe <Formel tex="t" /> liefern.</li>
          <li><strong>Schnittpunkt der Bahnen</strong>: Die Geraden haben einen gemeinsamen Punkt, gerechnet mit zwei verschiedenen Parametern <Formel tex={t`t_1`} /> und <Formel tex={t`t_2`} nach="." /> Das sind die Zeiten, zu denen die Objekte den Punkt erreichen. Nur wenn <Formel tex={t`t_1=t_2`} /> gilt, kommt es zur Kollision.</li>
          <li><strong>Abstand zur selben Zeit</strong>: <Formel tex={t`d(t)=\left|\vec{p}_2-\vec{p}_1+t\cdot(\vec{v}_2-\vec{v}_1)\right|`} nach="." /> Das Quadrat <Formel tex={t`f(t)=d(t)^2=a\,t^2+b\,t+c`} /> ist eine Parabel (<Formel tex={t`a>0`} nach=")." /> Der kleinste Abstand steht am Scheitel <Formel tex={t`t_0=-\frac{b}{2a}`} nach=","/> wenn <Formel tex={t`t_0\ge 0`} /> ist, sonst am Rand bei <Formel tex={t`t=0`} nach="." /> Es ist <Formel tex={t`d_{\min}=\sqrt{f(t_0)}`} nach="." /> Er ist größer als 0, wenn es keine Kollision gibt, auch wenn sich die Bahnen schneiden.</li>
        </ul>
        Das Minimieren steht im Modul <Modulverweis modul="optimierung">Optimierung</Modulverweis>, der Abstand von Punkt und Gerade im Modul <Modulverweis modul="abstaende-geraden">Abstand Punkt und Gerade, paralleler Geraden</Modulverweis>.
      </Hinweis>

      <h3>Schatten</h3>
      <Hinweis art="merksatz" titel="Parallelprojektion">
        Bei parallelem Licht mit der Richtung <Formel tex={t`\vec{v}`} /> gehört zur Ecke <Formel tex="X" /> der Lichtstrahl <Formel tex={t`\vec{x}=\vec{x}_X+t\cdot\vec{v}`} nach="." /> Der Schattenpunkt <Formel tex="X'" /> auf der Wand <Formel tex="x_2=0" /> ist sein Schnittpunkt mit der Wand: <Formel tex={t`x_{X,2}+t\cdot v_2=0`} /> gibt <Formel tex={t`t=-\frac{x_{X,2}}{v_2}`} nach="." /> Es muss <Formel tex={t`t\ge 0`} /> gelten, sonst läuft der Strahl von der Wand weg. Ist <Formel tex={t`v_2=0`} nach="," /> läuft der Strahl parallel zur Wand, es gibt keinen Schatten.
      </Hinweis>
      <Hinweis art="merksatz" titel="Zentralprojektion">
        Bei einer punktförmigen Lichtquelle <Formel tex="L" /> gehört zur Ecke <Formel tex="X" /> der Strahl <Formel tex={t`\vec{x}=\vec{l}+s\cdot\overrightarrow{LX}`} nach="." /> Bei <Formel tex="s=1" /> ist man in <Formel tex="X" nach="." /> Der Schattenpunkt <Formel tex="X''" /> auf der Wand <Formel tex="x_2=0" /> gehört zu <Formel tex={t`s=\frac{-L_2}{X_2-L_2}`} nach="." /> Er liegt nur dann hinter <Formel tex="X" nach="," /> wenn <Formel tex={t`s\ge 1`} /> gilt. Bei <Formel tex={t`s<1`} /> liegt die Wand zwischen <Formel tex="L" /> und <Formel tex="X" nach="," /> es gibt keinen Schatten auf ihr. Je näher die Lampe am Gegenstand steht, desto größer ist der Schatten.
      </Hinweis>
      <Hinweis art="merksatz" titel="Wand und Boden sind begrenzt">
        Die Wand und der Boden sind in der Wirklichkeit nur Teile der Koordinatenebenen (zum Beispiel <Formel tex="x_2=0" /> mit <Formel tex={t`x_3\ge 0`} /> als Wand, <Formel tex="x_3=0" /> mit <Formel tex={t`x_2\ge 0`} /> als Boden). Der Lichtstrahl wirft seinen Schatten auf die Fläche, die er <em>zuerst</em> trifft, und nur wenn der Schnittpunkt im vorhandenen Teil der Fläche liegt. Ein rechnerischer Schnittpunkt außerhalb, zum Beispiel mit einer negativen Höhe <Formel tex={t`x_3<0`} nach="," /> ist kein Schatten auf der Wand.
      </Hinweis>

      <h3>Ein Beispiel mit vollständigem Rechenweg: zwei Hubschrauber</h3>
      <p>
        Der Hubschrauber <Formel tex="H" /> startet in <Formel tex={punktTeX('H_0', h.start)} /> in Richtung <Formel tex={t`\vec{u}_H=\begin{pmatrix}2\\-1\\2\end{pmatrix}`} /> mit <Formel tex={t`60\,\frac{\text{km}}{\text{h}}`} nach="," /> der Rettungshubschrauber <Formel tex="R" /> startet in <Formel tex={punktTeX('R_0', r.start)} /> in Richtung <Formel tex={t`\vec{u}_R=\begin{pmatrix}2\\2\\-1\end{pmatrix}`} /> mit <Formel tex={t`90\,\frac{\text{km}}{\text{h}}`} nach="." /> Die Bahnen schneiden sich in <Formel tex={punktTeX('S', S_BEWEGUNG)} nach="." /> Geschwindigkeitsvektoren:
      </p>
      <Z z={geschwindigkeitZeilen(h)} />
      <Z z={geschwindigkeitZeilen(r)} />
      <p>Wann erreichen sie <Formel tex="S" nach="?" /></p>
      <Z z={zeitGleichung(h, [...S_BEWEGUNG], 't_H')} />
      <Z z={zeitGleichung(r, [...S_BEWEGUNG], 't_R')} />
      <p>
        <Formel tex="H" /> braucht <Formel tex={t`0{,}05\,\text{h}=3\,\text{min}`} nach="," /> <Formel tex="R" /> braucht <Formel tex={t`${stunden(be.zeiten!.t2)}\,\text{h}=${mR.minuten}\,\text{min}`} nach="." /> Die Zeiten sind verschieden, es gibt keine Kollision. Kleinster Abstand zur selben Zeit:
      </p>
      <Z z={abstandsvektor(h, r)} />
      <Z z={abstandsfunktionZeilen(h, r, polyTeX(q.a, q.b, q.c))} />
      <Z z={minimumZeilen(q.a, q.b, q.c)} />
      <p>
        Der kleinste Abstand ist <Formel tex={t`d=\sqrt{f(t_0)}\approx ${rund2(k.d)}\,\text{km}`} /> nach <Formel tex={t`t_0\approx ${rund2(k.t * 60)}\,\text{min}`} nach="." /> Die Bahnen schneiden sich, die Hubschrauber kommen sich aber nie näher als etwa 830 Meter.
      </p>
      <Figur spec={RAUM_BAHNEN} unter={<>Die Bahnen <Formel tex="g" /> (schwarz) und <Formel tex="h" /> (orange) schneiden sich in <Formel tex="S" nach="." /></>} />

      <h3>Ein Beispiel mit vollständigem Rechenweg: Schatten der Werbetafel</h3>
      <p>
        Die Tafel hat die Ecken <Formel tex={punktTeX('P', ecken[0]!)} nach="," /> <Formel tex={punktTeX('Q', ecken[1]!)} /> und <Formel tex={punktTeX('R', ecken[2]!)} nach="." /> Die Wand ist <Formel tex="x_2=0" nach="." /> Sonnenlicht mit <Formel tex={t`\vec{v}=${spalte(SCHATTEN.v)}`} nach=":" />
      </p>
      {ecken.map((e, i) => (
        <Z key={`p${i}`} z={parallelZeilen(e, SCHATTEN.v, `${NAMEN[i]}'`)} />
      ))}
      <Figur spec={RAUM_PARALLEL} unter={<>Der Schatten <Formel tex={t`P'Q'R'`} /> bei Sonnenlicht (rosa).</>} />
      <p>
        Lampe in <Formel tex={punktTeX('L', SCHATTEN.L)} nach=":" />
      </p>
      {ecken.map((e, i) => (
        <Z key={`z${i}`} z={zentralZeilen(e, SCHATTEN.L, `${NAMEN[i]}''`)} />
      ))}
      <Figur spec={RAUM_ZENTRAL} unter={<>Der Schatten <Formel tex={t`P''Q''R''`} /> bei der Lampe (rosa). Alle Parameter sind größer als 1.</>} />

      <Hinweis titel="Häufige Fehler">
        <ul className="liste-ohne-zahl" aria-label="Häufige Fehler">
          <li>Den Richtungsvektor direkt als Geschwindigkeitsvektor verwenden, ohne auf das Tempo umzurechnen.</li>
          <li>Eine Kollision behaupten, weil sich die Bahnen schneiden, ohne die Zeiten zu vergleichen.</li>
          <li>Zeit und Tempo in verschiedenen Einheiten mischen (Minuten und Stunden, Meter und Kilometer).</li>
          <li>Beim kleinsten Abstand den Scheitel einsetzen, obwohl er bei negativem <Formel tex="t" /> liegt: Dann gilt der Wert bei <Formel tex={t`t=0`} nach="." /></li>
          <li>Mit der Wurzel ableiten statt mit dem Abstandsquadrat <Formel tex={t`d(t)^2`} nach="." /></li>
          <li>Einen Schnittpunkt mit der Koordinatenebene als Schatten nehmen, obwohl der Parameter negativ ist oder (bei der Lampe) kleiner als 1.</li>
          <li>Den Schatten auf der Wand angeben, obwohl der Punkt außerhalb der vorhandenen Wand oder unter dem Boden liegt.</li>
        </ul>
      </Hinweis>
    </Abschnitt>
  );
}
