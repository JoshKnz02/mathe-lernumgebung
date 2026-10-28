import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Bild } from '@/components/Messbild';
import { t } from '@/lib/modulhilfen';
import { zahlTex } from '@/lib/zahlen';
import {
  BILD_DOSE_ZIEL,
  BILD_PARA_ZIEL,
  BILD_RAND_ZIEL,
  BILD_SCHACHTEL_PROBE,
  BILD_SCHACHTEL_TANGENTE,
  BILD_SCHACHTEL_ZIEL,
} from './Bilder';
import { DOSE_PROBEN, RAND_PROBEN, SCHACHTEL_FEIN, SCHACHTEL_WERTE } from './daten';
import { Optimierungslabor } from './Optimierungslabor';

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Aus einem rechteckigen Blatt (24 cm lang, 15 cm breit) werden an allen vier Ecken Quadrate der Seitenlänge <Formel tex="x" /> ausgeschnitten. Dann klappst du die Seiten hoch: Es entsteht eine Schachtel ohne Deckel mit der Höhe <Formel tex="x" nach="." /> Wird das Volumen größer, wenn du größere Ecken ausschneidest, oder kleiner? Berechne Länge, Breite, Höhe und Volumen für <Formel tex="x=1" nach="," /> <Formel tex="x=3" /> und <Formel tex="x=5" nach="." />
          </p>
          <Beobachtung
            bild={<Bild daten={BILD_SCHACHTEL_PROBE} unter={<>Das Volumen in Abhängigkeit von <Formel tex="x" nach="." /> Die drei Proben <Formel tex="P_1" nach="," /> <Formel tex="P_2" /> und <Formel tex="P_3" /> liegen auf einer Kurve, die erst steigt und dann fällt.</>} />}
          >
            <table className="tabelle tabelle-kompakt tabelle-breit">
              <caption>Die drei Schachteln (Maße in cm, Volumen in cm³)</caption>
              <thead>
                <tr>
                  <th scope="col"><Formel tex="x" /></th>
                  <th scope="col">Länge</th>
                  <th scope="col">Breite</th>
                  <th scope="col">Höhe</th>
                  <th scope="col">Volumen</th>
                </tr>
              </thead>
              <tbody>
                {SCHACHTEL_WERTE.map((w) => (
                  <tr key={w.x}>
                    <td>{w.x}</td>
                    <td>{w.laenge}</td>
                    <td>{w.breite}</td>
                    <td>{w.hoehe}</td>
                    <td>{w.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Das Volumen steigt von 286 auf 486 und sinkt dann auf 350. Größere Ecken sind also nicht immer besser: Bei kleinem <Formel tex="x" /> ist die Schachtel lang, breit und flach, bei großem <Formel tex="x" /> hoch, aber schmal. Das größte Volumen liegt irgendwo dazwischen, in der Nähe von <Formel tex="x=3" nach="." />
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Ein Rechteck liegt unter einem Schaubild. Sein Flächeninhalt <Formel tex="A" /> hängt von der Stelle <Formel tex="u" /> ab, mit <Formel tex={t`0\le u\le 9`} nach="." /> Bei <Formel tex="u=4" /> hat die Zielfunktion einen Hochpunkt mit <Formel tex="A(4)=50" nach="." /> Vermute: Ist das der größte Flächeninhalt? Es ist <Formel tex={t`A(u)=(9-u)\left(\tfrac14u^2+6\right)`} nach="." /> Berechne zur Probe <Formel tex="A(0)" /> und <Formel tex="A(9)" nach="." />
          </p>
          <Beobachtung>
            <p>
              Es ist <Formel tex={t`A(0)=9\cdot 6=${RAND_PROBEN.a0}`} /> und <Formel tex={t`A(9)=0`} nach="." /> Der Flächeninhalt <Formel tex={t`A(0)=${RAND_PROBEN.a0}`} /> ist größer als <Formel tex={t`A(4)=${RAND_PROBEN.a4}`} nach="." /> Der Hochpunkt ist hier also <strong>nicht</strong> der größte Wert der Zielfunktion. Warum das so ist, siehst du im dritten Labor.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Eine zylindrische Dose soll 330 cm³ fassen. Man kann sie hoch und schmal oder flach und breit bauen. Für welche Form wird der Materialverbrauch am kleinsten, also die Oberfläche: eher schmal, eher breit oder dazwischen? Welchen Zusammenhang zwischen Höhe und Durchmesser vermutest du?
          </p>
          <Beobachtung
            bild={<Bild daten={BILD_DOSE_ZIEL} unter={<>Die Oberfläche <Formel tex="O" /> in Abhängigkeit vom Radius <Formel tex="r" nach="." /> Nach links und nach rechts steigt das Schaubild, dazwischen liegt ein Tiefpunkt <Formel tex="T" nach="." /></>} />}
          >
            <table className="tabelle tabelle-kompakt tabelle-breit">
              <caption>Vier Dosen mit 330 cm³ (Maße in cm, Oberfläche in cm²)</caption>
              <thead>
                <tr>
                  <th scope="col"><Formel tex="r" /></th>
                  <th scope="col">Höhe</th>
                  <th scope="col">Oberfläche</th>
                </tr>
              </thead>
              <tbody>
                {DOSE_PROBEN.map((w) => (
                  <tr key={w.r}>
                    <td>{w.r}</td>
                    <td>{String(w.h).replace('.', ',')}</td>
                    <td>{String(w.o).replace('.', ',')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Sehr schmale und sehr flache Dosen brauchen viel Material. Das Minimum liegt zwischen <Formel tex="r=3" /> und <Formel tex="r=5" nach="." /> Wie die Höhe dort zum Durchmesser steht, findest du im vierten Labor.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 1: Die Schachtel</h3>
      <p>
        Mit dem Regler änderst du <Formel tex="x" nach="." /> Links siehst du das Blatt mit den ausgeschnittenen Ecken (grau) und den Faltlinien (blau gestrichelt), rechts entsteht Punkt für Punkt das Schaubild der Zielfunktion <Formel tex="V" nach="." /> Mit „Wert merken“ legst du einen Punkt ab. Die Schalter blenden das Schaubild, die Tangente, die Randwerte und die Stellen mit <Formel tex="V'=0" /> ein.
      </p>
      <Optimierungslabor situation="schachtel" />
      <ol className="auftraege">
        <li>
          <p>
            <strong>Ausprobieren.</strong> Stelle <Formel tex="x=1" nach="," /> <Formel tex="x=3" /> und <Formel tex="x=5" /> ein und merke dir die Werte. Vergleiche mit deiner Rechnung von oben. Suche dann in Schritten von 0,25 den Wert von <Formel tex="x" nach="," /> bei dem das Volumen am größten ist.
          </p>
          <Beobachtung>
            <p>
              Bei <Formel tex="x=3" /> ist <Formel tex={t`V=486`} /> (in cm³). Die Nachbarwerte sind kleiner: <Formel tex={t`V(2{,}75)\approx ${zahlTex(SCHACHTEL_FEIN.links)}`} /> und <Formel tex={t`V(3{,}25)\approx ${zahlTex(SCHACHTEL_FEIN.rechts)}`} nach="." /> In Schritten von 0,25 ist <Formel tex="x=3" /> also die beste Wahl. Ob es zwischen den Schritten noch etwas Besseres gibt, kannst du so nicht sicher sagen. Dafür braucht man die Ableitung.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Das Modell aufstellen.</strong> Gib Länge, Breite und Höhe der Schachtel in Abhängigkeit von <Formel tex="x" /> an und stelle einen Term für das Volumen <Formel tex="V(x)" /> auf. Welche Werte darf <Formel tex="x" /> annehmen, damit eine Schachtel entsteht? Blende die Zielfunktion ein und prüfe, ob deine gemerkten Punkte auf dem Schaubild liegen.
          </p>
          <Beobachtung>
            <p>
              Die Länge ist <Formel tex="24-2x" nach="," /> die Breite <Formel tex="15-2x" /> und die Höhe <Formel tex="x" nach="." /> Also ist
            </p>
            <Formel anzeige tex={t`V(x)=x\cdot(24-2x)\cdot(15-2x)=4x^3-78x^2+360x`} />
            <p>
              Alle Maße müssen positiv sein: <Formel tex="x>0" /> und <Formel tex="15-2x>0" nach="," /> also <Formel tex="x<7{,}5" nach="." /> Die Breite ist die kürzere Seite und begrenzt <Formel tex="x" nach="." /> Der Definitionsbereich ist <Formel tex={t`D=]0;\,7{,}5[`} nach="." />
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Das Maximum bestimmen.</strong> Blende die Tangente ein und fahre mit dem Regler über das Schaubild. Wie verändert sich die Steigung der Tangente? Wo ist sie null? Berechne dann <Formel tex="V'(x)" /> und löse <Formel tex="V'(x)=0" nach="." /> Warum gibt es zwei Lösungen, im Labor aber nur eine Stelle? Weise nach, dass bei <Formel tex="x=3" /> ein Maximum vorliegt.
          </p>
          <Beobachtung bild={<Bild daten={BILD_SCHACHTEL_TANGENTE} unter={<>Im Hochpunkt <Formel tex="H" /> ist die Tangente waagerecht (blau gestrichelt), ihre Steigung ist 0.</>} />}>
            <p>
              Die Steigung ist links von <Formel tex="x=3" /> positiv, bei <Formel tex="x=3" /> null und rechts davon negativ. Es ist <Formel tex={t`V'(x)=12x^2-156x+360=12(x^2-13x+30)=12(x-3)(x-10)`} nach="." /> Die Lösungen sind <Formel tex="x=3" /> und <Formel tex="x=10" nach="." /> Die Stelle <Formel tex="x=10" /> liegt nicht im Definitionsbereich <Formel tex={t`]0;\,7{,}5[`} nach="," /> denn das Blatt ist nur 15 cm breit. Wegen <Formel tex="V''(x)=24x-156" /> ist <Formel tex="V''(3)=-84<0" nach="," /> bei <Formel tex="x=3" /> liegt also ein Hochpunkt.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Das Ergebnis deuten.</strong> Warum ist das Volumen bei sehr kleinem und bei fast größtem <Formel tex="x" /> klein? Blende die Randwerte ein: Welche Werte hat <Formel tex="V" /> am Rand? Gehören die Randpunkte zum Definitionsbereich? Ist der Hochpunkt der größte Wert im ganzen Definitionsbereich?
          </p>
          <Beobachtung bild={<Bild daten={BILD_SCHACHTEL_ZIEL} unter={<>Der Hochpunkt <Formel tex="H" /> liegt weit über den beiden offenen Randpunkten (weiß).</>} />}>
            <p>
              Für <Formel tex={String.raw`x\to 0`} /> wird die Schachtel flach: <Formel tex={t`V\to 0`} nach="." /> Für <Formel tex={String.raw`x\to 7{,}5`} /> wird sie schmal: <Formel tex={t`V\to 0`} nach="." /> Die Randpunkte gehören nicht zum Definitionsbereich, denn für <Formel tex="x=0" /> oder <Formel tex="x=7{,}5" /> gibt es keine Schachtel. Sie sind offen markiert. Der Hochpunkt hat mit <Formel tex="V(3)=486" /> einen viel größeren Wert als alle Werte am Rand. Weil <Formel tex="V" /> zwischen den Rändern nur diese eine Stelle mit <Formel tex="V'=0" /> hat, ist er der größte Wert im ganzen Definitionsbereich. Die Schachtel mit dem größten Volumen ist 18 cm lang, 9 cm breit und 3 cm hoch und fasst 486 cm³.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 2: Ein Minimum</h3>
      <p>
        In ein Rechteck ABCD (12 lang, 8 hoch) wird ein Parallelogramm EFGH gelegt. Der Punkt E liegt auf der unteren Seite im Abstand <Formel tex="x" /> von A. Von dort aus geht es rundherum im Abstand <Formel tex="x" nach=":" /> F liegt im Abstand <Formel tex="x" /> von B, G im Abstand <Formel tex="x" /> von C und H im Abstand <Formel tex="x" /> von D. Gesucht ist das Parallelogramm mit dem kleinsten Flächeninhalt.
      </p>
      <Optimierungslabor situation="parallelogramm" />
      <ol className="auftraege">
        <li>
          <p>
            Das Parallelogramm ist das Rechteck ohne vier Dreiecke. Stelle den Flächeninhalt <Formel tex="A(x)" /> auf, bestimme das Minimum und prüfe es im Labor. Welche Werte darf <Formel tex="x" /> annehmen? Gehören die Randwerte <Formel tex="x=0" /> und <Formel tex="x=8" /> zum Definitionsbereich?
          </p>
          <Beobachtung bild={<Bild daten={BILD_PARA_ZIEL} unter={<>Die Zielfunktion <Formel tex="A" nach="." /> Der Tiefpunkt <Formel tex="T" /> liegt bei <Formel tex="x=5" nach="." /> Die Randpunkte <Formel tex="R" /> gehören zum Definitionsbereich.</>} />}>
            <p>
              Die Dreiecke bei A und C haben die Katheten <Formel tex="x" /> und <Formel tex="8-x" nach="," /> die bei B und D die Katheten <Formel tex="x" /> und <Formel tex="12-x" nach="." /> Also ist
            </p>
            <Formel anzeige tex={t`A(x)=96-x(8-x)-x(12-x)=2x^2-20x+96`} />
            <p>
              Mit <Formel tex="A'(x)=4x-20=0" /> folgt <Formel tex="x=5" nach="." /> Wegen <Formel tex="A''(x)=4>0" /> ist es ein Tiefpunkt, <Formel tex="A(5)=46" nach="." /> Der Punkt F liegt auf der Seite BC, deshalb ist <Formel tex={t`0\le x\le 8`} nach="." /> Für <Formel tex="x=0" /> fällt das Parallelogramm mit dem Rechteck zusammen (<Formel tex="A(0)=96" nach=")" />, für <Formel tex="x=8" /> geht F nach C (<Formel tex="A(8)=64" nach=")" />. Beide Figuren gibt es wirklich, deshalb gehören die Randwerte zum Definitionsbereich, der Rand ist abgeschlossen: <Formel tex={t`D=[0;\,8]`} nach="." /> Beide Randwerte sind größer als 46, das Minimum liegt bei <Formel tex="x=5" nach="." />
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Die Mitte des Definitionsbereichs ist <Formel tex="x=4" nach="." /> Warum liegt das Minimum nicht dort, sondern bei <Formel tex="x=5" nach="?" />
          </p>
          <Beobachtung>
            <p>
              Das Rechteck ist nicht quadratisch. Die Dreiecke an den kurzen Seiten haben die Fläche <Formel tex="\tfrac12x(8-x)" nach="," /> die an den langen Seiten <Formel tex="\tfrac12x(12-x)" nach="." /> Zusammen wird die Fläche der vier Dreiecke bei <Formel tex="x=5" /> am größten. Das zeigt auch die Scheitelform <Formel tex="A(x)=2(x-5)^2+46" nach="." /> Die Parabel ist symmetrisch zu <Formel tex="x=5" nach="," /> nicht zur Mitte des Definitionsbereichs. Eine Vermutung aus der Anschauung muss man mit der Rechnung prüfen.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 3: Der Rand</h3>
      <p>
        Der Punkt Q läuft auf dem Schaubild <Formel tex="K_f" /> von <Formel tex={t`f(x)=\tfrac14x^2+6`} nach="." /> Der Punkt R liegt unter Q auf der x-Achse, B hat die Koordinaten <Formel tex={t`(9\,|\,0)`} nach="," /> und P liegt über B in der Höhe von Q. Das Rechteck RBPQ hat den Flächeninhalt <Formel tex={t`A(u)=(9-u)\left(\tfrac14u^2+6\right)`} nach="," /> wenn Q die Koordinaten <Formel tex={t`(u\,|\,f(u))`} /> hat.
      </p>
      <Optimierungslabor situation="rand" />
      <ol className="auftraege">
        <li>
          <p>
            Verschiebe Q in Schritten von 0,25 und merke dir die Werte. Wo vermutest du den größten Flächeninhalt? Blende danach die Zielfunktion, die Stellen mit <Formel tex="A'=0" /> und die Randwerte ein. Berechne <Formel tex="A'(u)" /> und löse <Formel tex="A'(u)=0" nach="." />
          </p>
          <Beobachtung bild={<Bild daten={BILD_RAND_ZIEL} unter={<>Die Zielfunktion <Formel tex="A" nach="." /> Der Hochpunkt <Formel tex="H" /> liegt bei <Formel tex="u=4" nach="," /> der Randpunkt <Formel tex="R" /> bei <Formel tex="u=0" /> liegt höher.</>} />}>
            <p>
              Es ist <Formel tex={t`A'(u)=-\tfrac34u^2+\tfrac92u-6=-\tfrac34(u-2)(u-4)`} nach="." /> Die Stellen mit <Formel tex="A'=0" /> sind <Formel tex="u=2" /> (Tiefpunkt, <Formel tex="A(2)=49" nach=")" /> und <Formel tex="u=4" /> (Hochpunkt, <Formel tex="A(4)=50" nach=")" />. Am Rand ist <Formel tex="A(0)=54" /> und <Formel tex="A(9)=0" nach="." /> Der größte Flächeninhalt ist <Formel tex={t`A(0)=54`} nach="," /> er liegt am Rand und nicht beim Hochpunkt.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Bei <Formel tex="u=0" /> ist die Ableitung <Formel tex="A'(0)=-6" nach="," /> nicht null. Trotzdem ist dort der größte Wert. Was folgt daraus für Schritt 5 der Strategie, den Vergleich mit den Randwerten? Formuliere eine Regel, wie du die Stelle des größten Werts sicher findest.
          </p>
          <Beobachtung>
            <p>
              Ein größter oder kleinster Wert auf einem Intervall kann an einer Stelle mit <Formel tex="A'=0" /> liegen oder an einem Rand des Intervalls. Am Rand muss die Ableitung nicht null sein, weil das Schaubild dort einfach endet. Deshalb gilt: Alle Stellen mit <Formel tex="A'=0" /> im Definitionsbereich und die Randwerte aufschreiben und die Funktionswerte vergleichen. Der größte (bzw. kleinste) dieser Werte ist das globale Maximum (bzw. Minimum).
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Was bedeutet <Formel tex="u=0" /> in der Figur? Wie sieht das Rechteck dann aus? Gehört der Rand zum Definitionsbereich?
          </p>
          <Beobachtung>
            <p>
              Bei <Formel tex="u=0" /> liegt Q auf der y-Achse. Das Rechteck ist 9 breit und 6 hoch, es existiert. Der Rand gehört deshalb zum Definitionsbereich <Formel tex={t`[0;\,9]`} nach="," /> und der Wert 54 wird wirklich angenommen. Bei <Formel tex="u=9" /> hat das Rechteck die Breite 0, der Wert 0 ist trotzdem der kleinste Flächeninhalt der Zielfunktion.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 4: Die Nebenbedingung</h3>
      <p>
        Die Dose ist ein Zylinder mit dem Radius <Formel tex="r" /> und der Höhe <Formel tex="h" nach="." /> Das Volumen ist mit 330 cm³ fest vorgegeben. Das ist die Nebenbedingung: Sie verbindet <Formel tex="r" /> und <Formel tex="h" nach="." /> Mit dem Regler änderst du <Formel tex="r" nach="." /> Die Höhe berechnet das Labor aus der Nebenbedingung. Links siehst du die Seitenansicht der Dose.
      </p>
      <Optimierungslabor situation="dose" />
      <ol className="auftraege">
        <li>
          <p>
            Wie verändert sich die Höhe, wenn der Radius größer wird? Stelle einen Term für die Oberfläche <Formel tex="O" /> mit <Formel tex="r" /> und <Formel tex="h" /> auf (Boden, Deckel, Mantel) und schreibe ihn mit der Nebenbedingung als Funktion von <Formel tex="r" /> allein.
          </p>
          <Beobachtung>
            <p>
              Aus <Formel tex={t`V=\pi r^2h=330`} /> folgt <Formel tex={t`h=\dfrac{330}{\pi r^2}`} nach="." /> Eine breitere Dose ist niedriger. Die Oberfläche besteht aus Boden und Deckel mit je <Formel tex={t`\pi r^2`} /> und dem Mantel mit <Formel tex={t`2\pi r h`} nach=":" />
            </p>
            <Formel anzeige tex={t`O(r)=2\pi r^2+2\pi r\cdot\dfrac{330}{\pi r^2}=2\pi r^2+\dfrac{660}{r}`} />
          </Beobachtung>
        </li>
        <li>
          <p>
            Finde das Minimum: Blende die Zielfunktion und die Stellen mit <Formel tex="O'=0" /> ein und rechne <Formel tex="O'(r)=0" nach="." /> Notiere die Höhe an dieser Stelle und vergleiche sie mit dem Durchmesser <Formel tex="2r" nach="." />
          </p>
          <Beobachtung>
            <p>
              Es ist <Formel tex={t`O'(r)=4\pi r-\dfrac{660}{r^2}=0`} nach="," /> also <Formel tex={t`r^3=\dfrac{165}{\pi}`} nach="," /> <Formel tex={t`r\approx 3{,}74`} nach="." /> Die Höhe ist dort <Formel tex={t`h=\dfrac{330}{\pi\cdot 3{,}74^2}\approx 7{,}5`} nach="," /> also etwa so groß wie der Durchmesser <Formel tex={t`2r\approx 7{,}5`} nach="." /> Das gilt für jedes Volumen: Aus <Formel tex="O'(r)=0" /> folgt <Formel tex={t`V=2\pi r^3`} nach="," /> und damit <Formel tex={t`h=\dfrac{V}{\pi r^2}=2r`} nach="." /> Die Dose mit dem kleinsten Materialverbrauch ist so hoch wie breit.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Hier gibt es keine Randwerte zum Vergleichen. Was geschieht mit <Formel tex="O" /> für sehr kleines und für sehr großes <Formel tex="r" nach="?" /> Warum ist die Stelle mit <Formel tex="O'=0" /> trotzdem das globale Minimum?
          </p>
          <Beobachtung>
            <p>
              Der Definitionsbereich ist <Formel tex={t`]0;\,\infty[`} nach="." /> Für <Formel tex={String.raw`r\to 0`} /> wird die Dose zur hohen Nadel, der Mantel <Formel tex={t`\frac{660}{r}`} /> wird beliebig groß. Für <Formel tex={String.raw`r\to\infty`} /> wird sie zur flachen Scheibe, <Formel tex={t`2\pi r^2`} /> wird beliebig groß. An beiden Rändern wächst <Formel tex="O" /> über alle Grenzen. Weil <Formel tex="O'" /> nur eine Nullstelle hat, fällt <Formel tex="O" /> links davon und steigt rechts davon. Der Tiefpunkt ist deshalb der kleinste Wert im ganzen Definitionsbereich.
            </p>
          </Beobachtung>
        </li>
        <li>
          <p>
            Eine übliche 0,33-l-Getränkedose ist deutlich höher als breit. Nenne Gründe, warum sie nicht die Form mit dem kleinsten Materialverbrauch hat.
          </p>
          <Beobachtung>
            <p>
              Der Materialverbrauch ist nur eine Zielgröße von mehreren. Eine hohe, schmale Dose liegt besser in der Hand, lässt sich im Regal und im Getränkeautomaten gut stapeln, und die Deckel und Böden haben bei der Herstellung und beim Verschließen eigene Anforderungen. Das mathematische Modell zeigt die minimale Oberfläche, die tatsächliche Form ist eine Abwägung mehrerer Größen.
            </p>
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
