import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_ASY_SCHIEF, BILD_ASY_WAAGERECHT, BILD_SYM_GERADE, BILD_SYM_UNGERADE } from './Bilder';

const KF = <Formel tex="K_f" />;

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Was eine ausführliche Kurvendiskussion ist</h3>
      <p>
        Bei einer ausführlichen Kurvendiskussion untersuchst du eine Funktion <Formel tex="f" /> Schritt für Schritt, bis du ihr Schaubild {KF} zeichnen kannst, ohne es vorher gesehen zu haben. Die Schritte kennst du zum Teil aus früheren Modulen. Hier werden sie zu einem festen Ablauf zusammengesetzt:
      </p>
      <ol className="liste">
        <li><strong>Ableitungen</strong> bilden: <Formel tex="f'" nach="," /> <Formel tex="f''" /> und <Formel tex="f'''" nach="." /></li>
        <li><strong>Globales Verhalten:</strong> Wie verhält sich <Formel tex="f(x)" /> für sehr große und sehr kleine <Formel tex="x" nach="?" /></li>
        <li><strong>Symmetrie</strong> zur y-Achse oder zum Ursprung.</li>
        <li><strong>Schnittpunkte mit den Achsen:</strong> Nullstellen und y-Achsenabschnitt.</li>
        <li><strong>Extrempunkte:</strong> Hochpunkte und Tiefpunkte.</li>
        <li><strong>Wendepunkte</strong> und, wenn gefragt, die Wendetangente.</li>
        <li><strong>Monotonie und Krümmung:</strong> In welchen Bereichen steigt oder fällt <Formel tex="K_f" nach="," /> wo ist es linksgekrümmt oder rechtsgekrümmt?</li>
        <li><strong>Schaubild zeichnen</strong> aus allen gefundenen Angaben.</li>
      </ol>
      <p>
        Die Schritte 5 bis 7 kennst du aus dem Modul <Modulverweis modul="kurvendiskussion">Kurvendiskussion</Modulverweis>: die notwendige und die hinreichende Bedingung für Extrem- und Wendepunkte sowie die Bereiche mit Vorzeichentabelle. Die Wendetangente bestimmst du wie eine Tangente im Modul <Modulverweis modul="tangenten">Tangenten</Modulverweis>. Neu sind das globale Verhalten, die Symmetrie, einige Werkzeuge für Nullstellen und das Zusammenspiel aller Schritte.
      </p>
      <Hinweis titel="Reihenfolge und Schreibweise">
        Die Reihenfolge ist üblich, aber nicht vorgeschrieben. Alle Punkte gibst du <strong>exakt</strong> an, also mit Brüchen, Wurzeln, <Formel tex={String.raw`\ln`} /> oder <Formel tex={String.raw`\pi`} nach="." /> Gerundete Werte brauchst du nur zum Zeichnen. Punkte schreibst du als <Formel tex={t`N(x\,|\,0)`} /> für eine Nullstelle, <Formel tex={t`S_y(0\,|\,f(0))`} /> für den y-Achsenabschnitt und mit H, T und W für Hochpunkt, Tiefpunkt und Wendepunkt. Man schreibt dafür auch HP, TP und WP.
      </Hinweis>

      <h3>Globales Verhalten und Asymptoten</h3>
      <p>
        Das <strong>globale Verhalten</strong> beschreibt, was mit <Formel tex="f(x)" /> geschieht, wenn <Formel tex="x" /> sehr groß wird oder sehr klein. Du untersuchst immer beide Richtungen. Die Schreibweise <Formel tex={String.raw`x\to\infty`} /> heißt: <Formel tex="x" /> wird größer als jede Zahl. <Formel tex={String.raw`x\to-\infty`} /> heißt: <Formel tex="x" /> wird kleiner als jede Zahl. Dazu gehören Aussagen wie:
      </p>
      <ul className="liste">
        <li><Formel tex={String.raw`f(x)\to\infty`} nach=":" /> Die Funktionswerte werden größer als jede Zahl.</li>
        <li><Formel tex={String.raw`f(x)\to-\infty`} nach=":" /> Die Funktionswerte werden kleiner als jede Zahl.</li>
        <li><Formel tex={String.raw`f(x)\to 3`} nach=":" /> Die Funktionswerte nähern sich der Zahl 3.</li>
        <li>Die Funktionswerte pendeln immer wieder hin und her, wie bei periodischen Funktionen: Sie nähern sich keiner Zahl.</li>
      </ul>
      <p>
        Nähern sich die Funktionswerte einer Zahl <Formel tex="c" nach="," /> verläuft {KF} immer näher an der waagerechten Geraden <Formel tex="y=c" nach="." /> Eine solche Gerade heißt <strong>waagerechte Asymptote</strong>. Allgemein ist eine <strong>Asymptote</strong> eine Gerade, deren Abstand zu {KF} beliebig klein wird. Ist sie nicht waagerecht, heißt sie <strong>schiefe Asymptote</strong> und hat die Gleichung <Formel tex="y=mx+n" nach="." /> Das Schaubild darf eine Asymptote durchaus schneiden. Wichtig ist nur, dass der Abstand bei <Formel tex={String.raw`x\to\infty`} /> oder <Formel tex={String.raw`x\to-\infty`} /> gegen 0 geht.
      </p>
      <div className="bilder-paar">
        <Bild daten={BILD_ASY_WAAGERECHT} unter={<>Waagerechte Asymptote <Formel tex="y=2" nach=":" /> Für <Formel tex={String.raw`x\to\infty`} /> nähert sich {KF} der blau gestrichelten Geraden.</>} />
        <Bild daten={BILD_ASY_SCHIEF} unter={<>Schiefe Asymptote <Formel tex="y=x+1" nach=":" /> Für <Formel tex={String.raw`x\to\infty`} /> wird der Abstand von {KF} zur blau gestrichelten Geraden beliebig klein.</>} />
      </div>
      <Hinweis titel="Die vier Quadranten">
        Die Quadranten werden gegen den Uhrzeigersinn nummeriert: I rechts oben, II links oben, III links unten, IV rechts unten. Beginnt {KF} links oben und endet rechts oben, sagt man kurz, das Schaubild verlaufe vom II. in den I. Quadranten. Welche Verläufe vorkommen, findest du im Abschnitt Entdecken heraus.
      </Hinweis>

      <h3>Symmetrie</h3>
      <p>
        Zwei Arten von Symmetrie werden bei der Kurvendiskussion geprüft. Beide beziehen sich auf die Punkte <Formel tex="x" /> und <Formel tex="-x" nach=":" />
      </p>
      <ul className="liste">
        <li>{KF} ist <strong>symmetrisch zur y-Achse</strong> (achsensymmetrisch), wenn <Formel tex="f(-x)=f(x)" /> für alle <Formel tex="x" /> gilt. Gegenüberliegende Punkte haben dieselbe Höhe. Solche Funktionen heißen <strong>gerade Funktionen</strong>.</li>
        <li>{KF} ist <strong>symmetrisch zum Ursprung</strong> (punktsymmetrisch), wenn <Formel tex="f(-x)=-f(x)" /> für alle <Formel tex="x" /> gilt. Gegenüberliegende Punkte haben entgegengesetzte Höhen und liegen mit dem Ursprung auf einer Geraden. Solche Funktionen heißen <strong>ungerade Funktionen</strong>.</li>
      </ul>
      <div className="bilder-paar">
        <Bild daten={BILD_SYM_GERADE} unter={<>Gerade Funktion: <Formel tex={t`P(2\,|\,-7)`} /> und <Formel tex={t`Q(-2\,|\,-7)`} /> liegen gleich hoch.</>} />
        <Bild daten={BILD_SYM_UNGERADE} unter={<>Ungerade Funktion: <Formel tex={t`P(1\,|\,5)`} /> und <Formel tex={t`Q(-1\,|\,-5)`} /> liegen auf einer Geraden durch den Ursprung.</>} />
      </div>
      <p>
        <strong>Nachweis:</strong> Du setzt <Formel tex="-x" /> in den Term ein, vereinfachst und vergleichst mit <Formel tex="f(x)" /> und <Formel tex="-f(x)" nach="." />
      </p>
      <ul className="liste">
        <li>
          <Formel tex={t`f(x)=x^4-6x^2+1`} nach=":" /> <Formel tex={t`f(-x)=(-x)^4-6(-x)^2+1=x^4-6x^2+1=f(x)`} nach="." /> Also ist {KF} symmetrisch zur y-Achse.
        </li>
        <li>
          <Formel tex={t`g(x)=x^3+4x`} nach=":" /> <Formel tex={t`g(-x)=(-x)^3+4(-x)=-x^3-4x=-g(x)`} nach="." /> Also ist <Formel tex="K_g" /> symmetrisch zum Ursprung.
        </li>
        <li>
          <Formel tex={t`k(x)=x^2+2x`} nach=":" /> Hier ist <Formel tex="k(1)=3" /> und <Formel tex="k(-1)=-1" nach="." /> Das ist weder <Formel tex="k(1)=3" /> noch <Formel tex="-k(1)=-3" nach="." /> Also hat <Formel tex="K_k" /> weder Symmetrie zur y-Achse noch zum Ursprung.
        </li>
      </ul>
      <p>
        Beim dritten Beispiel genügt ein einziges Zahlenpaar, um die Symmetrie zu widerlegen. Um sie nachzuweisen, reicht ein Zahlenpaar nicht: Du musst <Formel tex="f(-x)" /> für ein allgemeines <Formel tex="x" /> berechnen. Eine Funktion kann zu einer anderen Achse oder einem anderen Punkt symmetrisch sein. Gefragt ist hier aber immer nur die y-Achse und der Ursprung.
      </p>

      <h3>Schnittpunkte mit den Achsen</h3>
      <p>
        Der <strong>y-Achsenabschnitt</strong> ist <Formel tex="f(0)" nach="," /> der Schnittpunkt ist <Formel tex={t`S_y(0\,|\,f(0))`} nach="." /> Die <strong>Nullstellen</strong> sind die Lösungen von <Formel tex="f(x)=0" nach="." /> Je nach Funktionsterm helfen diese Werkzeuge:
      </p>
      <ul className="liste">
        <li>
          <strong>Ausklammern und Satz vom Nullprodukt.</strong> Das hilft, wenn jeder Summand <Formel tex="x" /> enthält. Ein Produkt ist null, wenn mindestens ein Faktor null ist. Beispiel: <Formel tex={t`x^3-4x=x(x-2)(x+2)=0`} /> hat die Lösungen <Formel tex="x=0" nach="," /> <Formel tex="x=2" /> und <Formel tex="x=-2" nach="." />
        </li>
        <li>
          <strong>Substitution.</strong> Das hilft, wenn nur <Formel tex="x^4" nach="," /> <Formel tex="x^2" /> und eine Zahl vorkommen. Du setzt <Formel tex="u=x^2" nach="." /> Beispiel: <Formel tex={t`x^4-10x^2+9=0`} /> wird zu <Formel tex={t`u^2-10u+9=0`} /> mit <Formel tex="u=1" /> oder <Formel tex="u=9" nach="." /> Zurück: <Formel tex="x^2=1" /> oder <Formel tex="x^2=9" nach="," /> also <Formel tex="x=\pm 1" /> oder <Formel tex="x=\pm 3" nach="." /> Ein negatives <Formel tex="u" /> liefert keine Lösung.
        </li>
        <li>
          <strong>Faktor <Formel tex="e^x" /> weglassen.</strong> Das hilft, wenn <Formel tex="e^x" /> als Faktor vorkommt, denn <Formel tex="e^x" /> ist nie null. Beispiel: <Formel tex={t`(x^2-3x)\,e^x=0`} /> bedeutet <Formel tex={t`x(x-3)=0`} nach="," /> also <Formel tex="x=0" /> oder <Formel tex="x=3" nach="." />
        </li>
        <li>
          <strong>Logarithmus.</strong> Das hilft bei einer Gleichung der Form <Formel tex="e^x=c" /> mit <Formel tex="c>0" nach="." /> Beispiel: <Formel tex="e^x=4" /> hat die Lösung <Formel tex={t`x=\ln 4`} nach="." /> Den Logarithmus kennst du aus dem Modul <Modulverweis modul="umkehrfunktion">Umkehrfunktion</Modulverweis>.
        </li>
        <li>
          <strong>Substitution <Formel tex="z" /> bei Sinus und Kosinus.</strong> Das Vorgehen kennst du aus dem Modul <Modulverweis modul="trigonometrische-gleichungen">Trigonometrische Gleichungen</Modulverweis>.
        </li>
      </ul>
      <p>
        Manche Gleichungen lassen sich mit keinem dieser Werkzeuge lösen, zum Beispiel <Formel tex={String.raw`\cos x=x`} nach="." /> Dann bleibt ein Argument, etwa über die Monotonie, oder das Ablesen aus dem Schaubild.
      </p>

      <h3>Das Schaubild zeichnen</h3>
      <ol className="liste">
        <li>Achsen wählen, sodass alle gefundenen Punkte hineinpassen.</li>
        <li>Alle Punkte eintragen: Nullstellen, <Formel tex="S_y" nach="," /> Extrempunkte und Wendepunkte.</li>
        <li>Asymptoten einzeichnen und das Verhalten für <Formel tex={String.raw`x\to\pm\infty`} /> an den Rändern beachten.</li>
        <li>Zwischen den Punkten eine <strong>Wertetabelle in kleinen Schritten</strong> anlegen, damit die Kurve zwischen den Punkten stimmt.</li>
        <li>Die Wendetangente einzeichnen, wenn sie berechnet wurde, und die Punkte zu einer glatten Kurve verbinden. In einem Hochpunkt und einem Tiefpunkt ist die Tangente waagerecht.</li>
      </ol>
    </Abschnitt>
  );
}
