import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { t } from '@/lib/modulhilfen';
import { BILD_V1_LINEAR, BILD_V1_PARABEL, BILD_V2, BILD_V4A, BILD_V4B } from './Bilder';
import { Mittelwertlabor } from './Mittelwertlabor';

export function Entdecken() {
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutungen</h3>
      <p>Überlege zuerst, bevor du das Labor benutzt. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Für <Formel tex={t`f(x)=0{,}5x+1`} /> auf <Formel tex="[0;\,4]" /> ist <Formel tex="f(0)=1" /> und <Formel tex="f(4)=3" nach="." /> Der Mittelwert der beiden Randwerte ist 2. Ist das auch der Mittelwert der Funktion? Und bei <Formel tex={t`f(x)=\frac{1}{4}x^2`} /> auf <Formel tex="[0;\,4]" /> mit den Randwerten 0 und 4?
          </p>
          <Beobachtung
            bild={
              <>
                <FlaechenFigur daten={BILD_V1_LINEAR} unter={<>Bei der Geraden liegt die Höhe des Mittelwerts (gestrichelt) genau zwischen den Randwerten 1 und 3: <Formel tex="m=2" nach="." /></>} />
                <FlaechenFigur daten={BILD_V1_PARABEL} unter={<>Bei der Parabel ist <Formel tex={t`m=\frac{4}{3}`} /> (schwarz gestrichelt), der Mittelwert der Randwerte ist 2 (blau gestrichelt).</>} />
              </>
            }
          >
            Bei der Geraden stimmen beide überein: <Formel tex="m=2" nach="." /> Bei der Parabel nicht: Der Mittelwert der Funktion ist <Formel tex={t`\frac{4}{3}`} nach="," /> der Mittelwert der Randwerte ist 2. Das Schaubild verläuft lange nahe an der x-Achse und steigt erst am Ende steil an. Im Labor prüfst du, bei welchen Funktionen die beiden Werte übereinstimmen.
          </Beobachtung>
        </li>
        <li>
          <p>
            Zeichne zu <Formel tex={t`f(x)=\frac{1}{4}x^2`} /> auf <Formel tex="[0;\,4]" /> die Gerade in der Höhe des Mittelwerts <Formel tex={t`m=\frac{4}{3}`} /> ein. Das Schaubild liegt links der Schnittstelle unter der Geraden, rechts davon über ihr. Was vermutest du über die Größe der beiden Flächen zwischen <Formel tex="K_f" /> und der Geraden?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V2}
                unter={
                  <>
                    Die rosa Fläche (<Formel tex="K_f" /> unter der Geraden) und die blaue Fläche (<Formel tex="K_f" /> über der Geraden) haben beide den Inhalt <Formel tex={t`2{,}05`} nach="." />
                  </>
                }
              />
            }
          >
            Die beiden Flächen sind gleich groß. Der Mittelwert gleicht aus: Was <Formel tex="K_f" /> über der Geraden zu viel hat, fehlt ihm darunter. Bildest du das Integral von <Formel tex="f(x)-m" nach="," /> kommt deshalb 0 heraus. Im Labor siehst du das in der Ansicht „Ausgleich“.
          </Beobachtung>
        </li>
        <li>
          <p>
            Nimmt die Funktion ihren Mittelwert irgendwo im Intervall auch wirklich an? Gibt es also eine Stelle <Formel tex="x" /> in <Formel tex="[a;\,b]" nach="," /> an der <Formel tex="f(x)=m" /> gilt? Überlege mit dem Ausgleich der Flächen aus Vermutung 2.
          </p>
          <Beobachtung
            bild={<FlaechenFigur daten={BILD_V2} unter={<>Das Schaubild schneidet die Gerade in der Höhe <Formel tex="m" /> bei <Formel tex={t`x\approx 2{,}31`} nach="." /></>} />}
          >
            Ja, wenn das Schaubild ohne Sprung durchläuft (Knicke sind erlaubt). Läge <Formel tex="K_f" /> ganz über der Geraden oder ganz darunter, könnten sich die Flächen nicht ausgleichen. Also muss <Formel tex="K_f" /> die Gerade mindestens einmal treffen. Mit einem Sprung ist es anders: Hat eine Funktion auf <Formel tex="[0;\,2[" /> den Wert 1 und auf <Formel tex="[2;\,4]" /> den Wert 3, ist <Formel tex="m=2" /> und der Wert 2 kommt nie vor. Im Labor siehst du die Stellen als schwarze Punkte.
          </Beobachtung>
        </li>
        <li>
          <p>
            Kann der Mittelwert einer Funktion null sein, obwohl die Funktion nicht überall null ist? Kann er negativ sein? Überlege am Schaubild von <Formel tex={t`f(x)=\sin x`} /> auf <Formel tex={t`[0;\,\pi]`} /> und auf <Formel tex={t`[0;\,2\pi]`} nach="." />
          </p>
          <Beobachtung
            bild={
              <>
                <FlaechenFigur daten={BILD_V4A} unter={<>Auf <Formel tex={t`[0;\,\pi]`} /> ist <Formel tex={t`m=\frac{2}{\pi}\approx 0{,}64`} nach="." /></>} />
                <FlaechenFigur daten={BILD_V4B} unter={<>Auf <Formel tex={t`[0;\,2\pi]`} /> heben sich die Flächen mit dem Inhalt 2 oberhalb und unterhalb auf, <Formel tex="m=0" nach="." /></>} />
              </>
            }
          >
            Ja. Der Mittelwert ist null, wenn sich die Flächen oberhalb und unterhalb der x-Achse aufheben, so wie beim Sinus über eine ganze Periode. Er ist negativ, wenn unterhalb mehr Fläche liegt als oberhalb. Der Mittelwert hat also das Vorzeichen des Integrals und ist kein Flächeninhalt. Im Labor prüfst du es mit <Formel tex={t`0{,}5x^2-2`} nach="." />
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor</h3>
      <p>
        Wähle eine Funktion und die Grenzen <Formel tex="a" /> und <Formel tex="b" nach="." /> In der Ansicht „Fläche und Rechteck“ siehst du die Fläche unter <Formel tex="K_f" /> und das Rechteck mit der Höhe <Formel tex="m" nach="." /> In der Ansicht „Ausgleich“ siehst du die Flächen zwischen <Formel tex="K_f" /> und der Geraden <Formel tex="y=m" nach="." />
      </p>
      <Mittelwertlabor />

      <h3>Aufträge</h3>
      <ol className="auftraege">
        <li>Wähle <Formel tex={t`0{,}5x+1`} nach="." /> Verändere <Formel tex="a" /> und <Formel tex="b" nach="." /> Vergleiche <Formel tex="m" /> mit dem Mittelwert der Randwerte. Was fällt dir auf?</li>
        <li>Wähle <Formel tex={t`0{,}25x^2`} /> und <Formel tex={t`\mathrm{e}^{0{,}5x}`} nach="." /> Stimmen <Formel tex="m" /> und der Mittelwert der Randwerte überein? Welcher Wert ist größer, und woran liegt das am Schaubild?</li>
        <li>Wähle die Ansicht „Ausgleich“ und die Funktion <Formel tex={t`0{,}5x^2-2`} /> mit den Grenzen <Formel tex="-3" /> und <Formel tex="3" nach="." /> Wie viele Stellen mit <Formel tex="f(x)=m" /> gibt es? Wie liegen die Flächen zueinander?</li>
        <li>Wähle <Formel tex={t`\sin x`} /> und die Grenzen 0 und <Formel tex="\pi" nach="," /> dann 0 und <Formel tex="2\pi" nach="." /> Vergleiche die Mittelwerte. Welche Grenzen führen zum Mittelwert 0?</li>
        <li>Wähle <Formel tex={t`0{,}25x^2`} /> und die Ansicht „Fläche und Rechteck“. Verdopple die Länge des Intervalls von 0 bis 2 auf 0 bis 4. Wie ändern sich das Integral, die Länge und der Mittelwert?</li>
      </ol>
    </Abschnitt>
  );
}
