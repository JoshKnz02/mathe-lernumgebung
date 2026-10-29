import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { zahl } from '@/lib/flaeche';
import { t } from '@/lib/modulhilfen';
import { rotationsvolumen, scheiben } from '@/lib/rotation';
import { BILD_A1, BILD_A2, BILD_A3, BILD_A4, BILD_A5, BILD_A6, BILD_A7, BILD_A8, BILD_V1_KEGEL, BILD_V1_KUGEL, BILD_V1_ZYLINDER, BILD_V2, BILD_V3 } from './Bilder';
import { AUFTRAEGE, KOERPER, VERMUTUNG2 } from './daten';
import { Scheibenlabor } from './Scheibenlabor';
import { Volumenlabor } from './Volumenlabor';

const tz = (x: number, n = 2) => zahl(x, n).replace(',', '{,}').replace('−', '-');
const A = AUFTRAEGE;
const k = (id: string) => KOERPER.find((x) => x.id === id)!;
/** Zylinder von innen und außen bei n Scheiben, geteilt durch π. */
const sch = (id: string, n: number) => {
  const q = k(id);
  const s = scheiben(q.f, q.a0, q.b0, n);
  return { innen: s.innen, aussen: s.aussen, unterschied: s.aussen - s.innen, exakt: rotationsvolumen(q.f, q.a0, q.b0) };
};

export function Entdecken() {
  const kegel6 = sch('kegel', 6);
  const kegel12 = sch('kegel', 12);
  const kegel24 = sch('kegel', 24);
  const kugel24 = sch('kugel', 24);
  const kugel1000 = sch('kugel', 1000);
  const wurzel24 = sch('wurzel', 24);
  const wurzel1000 = sch('wurzel', 1000);
  return (
    <Abschnitt id="entdecken" titel="Entdecken">
      <h3>Vermutungen</h3>
      <p>Überlege zuerst, bevor du das Labor benutzt. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Die Fläche zwischen <Formel tex="K_f" /> und der x-Achse dreht sich um die x-Achse. Welcher Körper entsteht für <Formel tex={t`f(x)=2`} /> auf <Formel tex="[0;\,3]" nach="," /> für <Formel tex={t`f(x)=\frac{1}{2}x`} /> auf <Formel tex="[0;\,6]" /> und für <Formel tex={t`f(x)=\sqrt{9-x^2}`} /> auf <Formel tex="[-3;\,3]" nach="?" />
          </p>
          <Beobachtung
            bild={
              <>
                <FlaechenFigur daten={BILD_V1_ZYLINDER} unter={<>Ein Rechteck dreht sich zu einem Zylinder.</>} />
                <FlaechenFigur daten={BILD_V1_KEGEL} unter={<>Ein Dreieck dreht sich zu einem Kegel.</>} />
                <FlaechenFigur daten={BILD_V1_KUGEL} unter={<>Ein Halbkreis dreht sich zu einer Kugel.</>} />
              </>
            }
          >
            Eine waagerechte Strecke ergibt einen Zylinder, eine Ursprungsgerade einen Kegel und der Halbkreis über dem Durchmesser eine Kugel. Alle drei Volumen kennst du aus der Geometrie. Im Labor vergleichst du sie mit der Rechnung mit Scheiben.
          </Beobachtung>
        </li>
        <li>
          <p>
            Zwei Zylinder haben die Höhe <Formel tex={String(VERMUTUNG2.h)} nach="." /> Der eine hat den Radius <Formel tex={String(VERMUTUNG2.r1)} nach="," /> der andere den doppelten Radius <Formel tex={String(VERMUTUNG2.r2)} nach="." /> Wie verhalten sich ihre Volumina?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V2}
                unter={
                  <>
                    Der Zylinder mit dem Radius 1 (gelb) hat das Volumen <Formel tex={t`\pi\cdot 1^2\cdot 3=3\pi`} nach="," /> der mit dem Radius 2 (blau) das Volumen <Formel tex={t`\pi\cdot 2^2\cdot 3=12\pi`} nach="." />
                  </>
                }
              />
            }
          >
            Das Volumen wächst auf das Vierfache, nicht auf das Doppelte. Der Radius steht im Quadrat in der Formel <Formel tex={t`V=\pi r^2h`} nach="." /> Deshalb kommt im Labor nicht der Radius selbst vor, sondern sein Quadrat.
          </Beobachtung>
        </li>
        <li>
          <p>
            Die Gerade <Formel tex={t`f(x)=\frac{1}{2}x`} /> auf <Formel tex="[0;\,6]" /> erzeugt einen Kegel. Du spiegelst sie an der x-Achse, es ist dann <Formel tex={t`f(x)=-\frac{1}{2}x`} nach="." /> Die Fläche liegt jetzt unter der x-Achse. Entsteht ein anderer Körper?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_V3}
                unter={
                  <>
                    Das Schaubild liegt unter der x-Achse (orange), das Spiegelbild darüber (gestrichelt). Die Seitenansicht ist dieselbe wie beim Kegel.
                  </>
                }
              />
            }
          >
            Nein. Der Radius einer Scheibe ist der Abstand des Schaubilds von der x-Achse, und der hängt nicht vom Vorzeichen ab. Beim Drehen ergibt sich dieselbe Kegelform, nur ist die Fläche vorher auf der anderen Seite der x-Achse. Im Labor siehst du das in Auftrag 8.
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 1: Scheiben zählen</h3>
      <p>
        Wähle eine Funktion und stelle die Zahl <Formel tex="n" /> der Scheiben ein. Die Zeichnung zeigt <Formel tex="K_f" /> (orange) und ihr Spiegelbild, die Zylinder von innen (blau gefüllt) und die Zylinder von außen (gestrichelt umrandet). Die Tabelle zeigt für alle <Formel tex="n" /> die Volumina in Volumeneinheiten. Mit dem Schalter blendest du den Vergleichswert ein, den du in den Aufträgen deuten sollst.
      </p>
      <Scheibenlabor />

      <h3>Untersuchungsaufträge zu Labor 1</h3>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Zylinder.</strong> Wähle den Zylinder, <Formel tex={t`f(x)=2`} /> auf <Formel tex="[0;\,3]" nach="." /> Vergleiche die Zylinder von innen und von außen schon für <Formel tex="n=1" nach="." /> Blende den Vergleichswert ein. Was fällt dir auf?
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A1} unter={<>Alle Scheiben haben denselben Radius 2, innen und außen fallen zusammen.</>} />}>
            Innen und außen sind für jedes <Formel tex="n" /> gleich, nämlich <Formel tex={t`12\pi\approx ${tz(A[1].q * Math.PI)}`} nach="." /> Der Radius ist überall <Formel tex="2" nach="," /> die Scheiben sind genau der Körper. Das ist die Formel <Formel tex={t`\pi\cdot 2^2\cdot 3`} nach="." /> Der Vergleichswert ist derselbe.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Kegel.</strong> Wähle den Kegel, <Formel tex={t`f(x)=\frac{1}{2}x`} /> auf <Formel tex="[0;\,6]" nach="." /> Lies den Unterschied zwischen den Zylindern von außen und von innen für <Formel tex="n=6" nach="," /> <Formel tex="12" /> und <Formel tex="24" /> ab. Was passiert, wenn du <Formel tex="n" /> verdoppelst?
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A2} unter={<>Sechs Scheiben der Dicke 1. Zwischen der gefüllten und der gestrichelten Treppe liegt noch ein Rest.</>} />}>
            Der Unterschied ist <Formel tex={t`${tz(kegel6.unterschied)}`} nach="," /> dann <Formel tex={t`${tz(kegel12.unterschied)}`} /> und <Formel tex={t`${tz(kegel24.unterschied)}`} nach="." /> Er halbiert sich, wenn <Formel tex="n" /> sich verdoppelt, weil die Scheiben nur noch halb so dick sind. Das Volumen liegt immer zwischen innen und außen. Für große <Formel tex="n" /> laufen beide auf den Vergleichswert <Formel tex={t`18\pi\approx ${tz(A[2].q * Math.PI)}`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Kugel.</strong> Wähle die Kugel, <Formel tex={t`f(x)=\sqrt{9-x^2}`} /> auf <Formel tex="[-3;\,3]" nach="." /> Vergleiche für <Formel tex="n=24" /> und <Formel tex="n=1000" /> die Zylinder von innen und von außen mit dem Vergleichswert. Welchen Wert kennst du aus der Geometrie?
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A3} unter={<>Sechs Scheiben der Dicke 1. Die Kugel mit dem Radius 3 wird gut von Scheiben erfasst.</>} />}>
            Für <Formel tex="n=24" /> ist innen <Formel tex={t`${tz(kugel24.innen)}`} /> und außen <Formel tex={t`${tz(kugel24.aussen)}`} nach="," /> für <Formel tex="n=1000" /> sind es <Formel tex={t`${tz(kugel1000.innen, 3)}`} /> und <Formel tex={t`${tz(kugel1000.aussen, 3)}`} nach="." /> Der Vergleichswert ist <Formel tex={t`${tz(A[3].q * Math.PI)}`} nach="." /> Aus der Geometrie kennst du das Kugelvolumen <Formel tex={t`\frac{4}{3}\pi r^3=\frac{4}{3}\pi\cdot 3^3=36\pi`} nach="." /> Beide Werte stimmen überein.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Wurzelfunktion.</strong> Wähle die Wurzelfunktion, <Formel tex={t`f(x)=\sqrt{x}`} /> auf <Formel tex="[0;\,4]" nach="." /> Kennst du den Körper aus der Geometrie? Wie genau ist die Näherung für <Formel tex="n=24" /> und <Formel tex="n=1000" nach="?" />
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A4} unter={<>Sechs Scheiben der Dicke <Formel tex={t`\frac{2}{3}`} nach="." /> Am Anfang wächst der Radius steil.</>} />}>
            Der Körper ist keiner aus der Geometrie, es gibt dafür keine Formel der Schule. Für <Formel tex="n=24" /> liegen innen <Formel tex={t`${tz(wurzel24.innen)}`} /> und außen <Formel tex={t`${tz(wurzel24.aussen)}`} /> auseinander, für <Formel tex="n=1000" /> bei <Formel tex={t`${tz(wurzel1000.innen, 3)}`} /> und <Formel tex={t`${tz(wurzel1000.aussen, 3)}`} nach="." /> Der Vergleichswert ist <Formel tex={t`${tz(A[4].q * Math.PI, 3)}`} nach="." /> Das Verfahren mit Scheiben funktioniert auch ohne bekannte Formel.
          </Beobachtung>
        </li>
      </ol>

      <h3>Labor 2: Volumen mit Grenzen</h3>
      <p>
        Hier wählst du die Funktion und die Grenzen <Formel tex="a" /> und <Formel tex="b" /> frei. Die Tabelle zeigt das Integral von <Formel tex={t`f(x)^2`} nach="," /> das Volumen <Formel tex="V" /> und, wenn der Körper ein Zylinder, Kegel, Kegelstumpf, eine Kugel oder Halbkugel ist, den Wert der Formel aus der Geometrie.
      </p>
      <Volumenlabor />

      <h3>Untersuchungsaufträge zu Labor 2</h3>
      <ol className="auftraege">
        <li>
          <p>
            <strong>Kegel.</strong> Wähle <Formel tex={t`\frac{1}{2}x`} /> mit <Formel tex="a=0" /> und <Formel tex="b=6" nach="." /> Vergleiche <Formel tex="V" /> mit der Kegelformel <Formel tex={t`\frac{1}{3}\pi r^2h`} nach="." /> Welche Werte setzt du für <Formel tex="r" /> und <Formel tex="h" /> ein?
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A5} unter={<>Der Radius am rechten Ende ist 3, die Höhe 6.</>} />}>
            Das Integral von <Formel tex={t`f(x)^2`} /> ist <Formel tex={t`${tz(A[5].q)}`} nach="," /> also <Formel tex={t`V=18\pi`} nach="." /> Mit <Formel tex="r=3" /> und <Formel tex="h=6" /> gibt die Formel <Formel tex={t`\frac{1}{3}\pi\cdot 3^2\cdot 6=18\pi`} nach="." /> Der Radius ist <Formel tex="f(b)" nach="," /> die Höhe ist <Formel tex="b-a" nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Kegelstumpf.</strong> Setze für denselben Kegel <Formel tex="a=2" /> und <Formel tex="b=6" nach="." /> Welcher Körper entsteht? Lies <Formel tex="V" /> ab und vergleiche mit der Formel der Tabelle.
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A6} unter={<>Ein Kegelstumpf: Radius 1 am linken Ende, Radius 3 am rechten, Höhe 4.</>} />}>
            Es entsteht ein Kegelstumpf. Das Integral von <Formel tex={t`f(x)^2`} /> ist <Formel tex={t`\frac{52}{3}\approx ${tz(A[6].q)}`} nach="," /> also <Formel tex={t`V=\frac{52}{3}\pi\approx ${tz(A[6].q * Math.PI)}`} nach="." /> Mit <Formel tex="R=3" nach="," /> <Formel tex="r=1" /> und <Formel tex="h=4" /> gibt die Formel <Formel tex={t`\frac{\pi h}{3}\left(R^2+Rr+r^2\right)=\frac{4\pi}{3}\cdot 13=\frac{52}{3}\pi`} nach="." /> Der Stumpf ist der große Kegel ohne die kleine Spitze, auch die Rechnung zeigt das: Die Kegelformel für 0 bis 6 gibt <Formel tex="18\pi" nach="," /> die Spitze von 0 bis 2 gibt <Formel tex={t`\frac{2}{3}\pi`} nach="." />
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Kugel, Halbkugel, Kugelschicht.</strong> Wähle die Kugel mit <Formel tex="a=-3" /> und <Formel tex="b=3" nach="." /> Setze dann <Formel tex="a=0" /> und danach <Formel tex="a=1" /> mit <Formel tex="b=3" nach="." /> Was fällt dir bei <Formel tex="V" /> auf?
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A7} unter={<>Die ganze Kugel mit dem Radius 3. Bei <Formel tex="a=0" /> entsteht die rechte Hälfte.</>} />}>
            Für <Formel tex="[-3;\,3]" /> ist <Formel tex={t`V=36\pi`} nach="," /> für <Formel tex="[0;\,3]" /> genau die Hälfte, <Formel tex={t`18\pi`} nach="," /> eine Halbkugel. Für <Formel tex="[1;\,3]" /> ist <Formel tex={t`V=\frac{28}{3}\pi\approx ${tz(A[7].schicht * Math.PI)}`} nach="." /> Das ist eine Kugelkappe. Für sie gibt es in der Tabelle keine Formel, die Rechnung mit dem Integral funktioniert trotzdem.
          </Beobachtung>
        </li>
        <li>
          <p>
            <strong>Kegel nach unten.</strong> Die Schaltfläche „Kegel nach unten“ gehört zu <Formel tex={t`f(x)=-\frac{1}{2}x`} nach="." /> Wähle sie mit <Formel tex="a=0" /> und <Formel tex="b=6" nach="." /> Vergleiche das Integral von <Formel tex={t`f(x)^2`} /> und <Formel tex="V" /> mit dem Kegel nach oben.
          </p>
          <Beobachtung bild={<FlaechenFigur daten={BILD_A8} unter={<>Das Schaubild liegt unter der x-Achse, der Körper ist derselbe.</>} />}>
            Beide Werte sind gleich: <Formel tex={t`\int f(x)^2\,\mathrm{d}x=${tz(A[8].q)}`} /> und <Formel tex={t`V=18\pi`} nach="." /> Quadriert wird das Vorzeichen unwirksam, <Formel tex={t`\left(-\frac{1}{2}x\right)^2=\left(\frac{1}{2}x\right)^2`} nach="." /> Die Lage der Fläche zur x-Achse ändert das Volumen nicht.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
