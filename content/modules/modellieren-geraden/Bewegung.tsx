import { Abschnitt } from '@/components/Abschnitt';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { abstandZurZeit, begegnung, geschwindigkeit, kleinsterAbstand, minutenSekunden, ort, type Bewegung } from '@/lib/bewegung';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { t } from '@/lib/modulhilfen';
import { betrag } from '@/lib/vektor';
import { RAUM_BAHNEN, RAUM_FLUG } from './Bilder';
import { BEWEGUNGSLABOR, HUBSCHRAUBER, S_BEWEGUNG } from './daten';
import { Bewegungslabor } from './Labor';
import { bahnGleichung, betragZeilen, geschwindigkeitZeilen, gl, glSchmal, ortZeilen, rund2, stunden, zeitGleichung } from './rechenhilfen';

export function BewegungAbschnitt() {
  const h = HUBSCHRAUBER;
  const L = BEWEGUNGSLABOR;
  const r: Bewegung = { ...L.R, tempo: L.tempoStart };
  const vH = geschwindigkeit(h);
  const be = begegnung(h, r);
  const kA = kleinsterAbstand(h, r);
  const mH = minutenSekunden(be.zeiten!.t1);
  const mR = minutenSekunden(be.zeiten!.t2);
  const diffSek = Math.round((be.zeiten!.t1 - be.zeiten!.t2) * 3600);
  const mitU = ort({ ...h, tempo: betrag(h.richtung) }, 0.05);
  const bH = bahnGleichung(h, 'g');
  const bR = bahnGleichung(r, 'h');
  const rk: Bewegung = { ...L.R, tempo: L.tempoKollision };
  const kK = begegnung(h, rk);
  return (
    <Abschnitt id="bewegung" titel="Entdecken: Bewegung">
      <h3>Vermutung 1: Geschwindigkeit aus Richtung und Tempo</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Der Hubschrauber <Formel tex="H" /> startet in <Formel tex={punktTeX('P', h.start)} nach="," /> fliegt in Richtung <Formel tex={t`\vec{u}=${spalte(h.richtung)}`} /> mit <Formel tex={t`60\,\frac{\text{km}}{\text{h}}`} nach="." /> Berechne die Länge von <Formel tex={t`\vec{u}`} nach="." /> Stelle die Bewegungsgleichung <Formel tex={t`g:\ \vec{x}=\vec{p}+t\cdot\vec{v}`} /> auf, sodass <Formel tex="t" /> die Zeit in Stunden ist. Wo ist <Formel tex="H" /> nach 3 Minuten? Wie weit ist er dann geflogen? Was passiert, wenn du <Formel tex={t`\vec{u}`} /> direkt als Geschwindigkeitsvektor verwendest?
          </p>
          <Beobachtung bild={<Figur spec={RAUM_FLUG} unter={<>Die Bahn <Formel tex="g" nach="," /> der Startpunkt <Formel tex="P" /> und der Ort <Formel tex={punktTeX('Q', S_BEWEGUNG)} /> nach 3 Minuten. Die rosa Strecke <Formel tex="PQ" /> ist 3 Kilometer lang.</>} />}>
            <Umbruchformel {...betragZeilen(h.richtung)} />
            <p>
              Mit <Formel tex={t`\vec{u}`} /> als Geschwindigkeitsvektor wäre das Tempo <Formel tex={t`|\vec{u}|=3\,\frac{\text{km}}{\text{h}}`} nach="." /> Nach 3 Minuten wäre <Formel tex="H" /> erst bei <Formel tex={punktTeX('X', mitU)} nach="," /> nur <Formel tex={t`0{,}15`} /> Kilometer weit. Der Geschwindigkeitsvektor muss in dieselbe Richtung zeigen, aber die Länge <Formel tex={t`60`} /> haben. Dafür teilst du <Formel tex={t`\vec{u}`} /> durch seine Länge (das gibt Länge 1) und multiplizierst mit dem Tempo:
            </p>
            <Umbruchformel {...geschwindigkeitZeilen(h)} />
            <p>
              Die Bewegungsgleichung ist
            </p>
            <Umbruchformel tex={gl(bH.g, 'g', 't')} schmal={glSchmal(bH.g, 'g', 't')} />
            <p>
              Nach 3 Minuten, also <Formel tex={t`t=0{,}05`} nach="," /> ist <Formel tex="H" /> im Punkt
            </p>
            <Umbruchformel {...ortZeilen(h.start, 0.05, vH, 'X', stunden(0.05))} />
            <p>
              Er hat die Strecke <Formel tex={t`60\cdot 0{,}05=3`} /> Kilometer zurückgelegt. Vermutung: Der Geschwindigkeitsvektor ist das Tempo mal der Einheitsvektor der Flugrichtung, <Formel tex={t`\vec{v}=w\cdot\frac{\vec{u}}{|\vec{u}|}`} nach="," /> und sein Betrag ist genau das Tempo <Formel tex="w" nach="." />
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Vermutung 2: Kollision oder nur Schnittpunkt der Bahnen?</h3>
      <ol className="auftraege">
        <li>
          <p>
            Der Rettungshubschrauber <Formel tex="R" /> startet in <Formel tex={punktTeX('R_0', r.start)} nach="," /> fliegt in Richtung <Formel tex={t`\vec{u}_R=${spalte(r.richtung)}`} /> mit <Formel tex={t`${r.tempo}\,\frac{\text{km}}{\text{h}}`} nach="." /> Seine Bahn <Formel tex="h" /> und die Bahn <Formel tex="g" /> von <Formel tex="H" /> aus Vermutung 1 schneiden sich im Punkt <Formel tex={punktTeX('S', S_BEWEGUNG)} nach="." /> Zu welcher Zeit erreicht <Formel tex="H" /> den Punkt <Formel tex="S" nach="," /> zu welcher <Formel tex="R" nach="?" /> Kommt es zu einer Kollision? Was brauchst du dafür außer dem Schnittpunkt der Bahnen?
          </p>
          <Beobachtung bild={<Figur spec={RAUM_BAHNEN} unter={<>Die Bahnen <Formel tex="g" /> (schwarz) und <Formel tex="h" /> (orange) schneiden sich in <Formel tex="S" nach="." /> <Formel tex={t`H_0`} /> und <Formel tex={t`R_0`} /> sind die Startpunkte.</>} />}>
            <p>
              Geschwindigkeit von <Formel tex="R" nach=":" />
            </p>
            <Umbruchformel {...geschwindigkeitZeilen(r)} />
            <p>
              <Formel tex="H" /> erreicht <Formel tex="S" /> bei
            </p>
            <Umbruchformel {...zeitGleichung(h, [...S_BEWEGUNG], 't')} />
            <p>
              also nach <Formel tex={t`0{,}05`} /> Stunden, das sind <Formel tex={t`${mH.minuten}`} /> Minuten. <Formel tex="R" /> erreicht <Formel tex="S" /> bei
            </p>
            <Umbruchformel {...zeitGleichung(r, [...S_BEWEGUNG], 't')} />
            <p>
              also nach <Formel tex={t`${stunden(be.zeiten!.t2)}`} /> Stunden, das sind <Formel tex={t`${mR.minuten}`} /> Minuten. Die Zeiten sind verschieden: <Formel tex="R" /> ist <Formel tex={t`${diffSek}`} /> Sekunden früher in <Formel tex="S" nach="," /> wenn <Formel tex="H" /> eintrifft, ist <Formel tex="R" /> schon weitergeflogen. Es gibt keine Kollision. Vermutung: Der Schnittpunkt der Bahnen genügt nicht, für eine Kollision müssen beide den Punkt zur <em>selben</em> Zeit erreichen. Für eine Bahn schneidest du mit zwei Parametern (siehe <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>), für eine Kollision gilt dasselbe <Formel tex="t" /> für beide Objekte.
            </p>
          </Beobachtung>
        </li>
      </ol>

      <h3>Das Bewegungslabor</h3>
      <p>
        Der Hubschrauber <Formel tex="H" /> fliegt wie oben. Das Tempo des Rettungshubschraubers <Formel tex="R" /> und die Zeit <Formel tex="t" /> stellst du mit den Reglern ein. Den Abstand, die Abstandskurve und den Schnittpunkt der Bahnen mit den Ankunftszeiten blendest du ein, wenn du eine Vermutung hast. Liegt ein Punkt außerhalb des gezeichneten Koordinatensystems, wird er nicht gezeichnet, die Rechnung gilt trotzdem.
      </p>
      <Bewegungslabor />
      <p>Untersuche:</p>
      <ol className="auftraege">
        <li>
          <p>
            Stelle das Tempo von <Formel tex="R" /> so ein, dass es zu einer Kollision kommt. Welches Tempo ist das? Was gilt dann für die Zeiten, zu denen <Formel tex="H" /> und <Formel tex="R" /> den Schnittpunkt <Formel tex="S" /> erreichen?
          </p>
          <Beobachtung>
            Bei <Formel tex={t`${L.tempoKollision}\,\frac{\text{km}}{\text{h}}`} /> erreichen beide den Punkt <Formel tex="S" /> nach <Formel tex={t`${minutenSekunden(kK.zeiten!.t1).minuten}`} /> Minuten, der Abstand ist dort 0. Der Weg von <Formel tex={t`R_0`} /> nach <Formel tex="S" /> ist 3 Kilometer lang, <Formel tex="R" /> braucht also <Formel tex={t`\frac{3}{w_R}`} /> Stunden und <Formel tex="H" /> braucht <Formel tex={t`0{,}05`} /> Stunden. Beide Zeiten sind genau dann gleich, wenn <Formel tex={t`w_R=60\,\frac{\text{km}}{\text{h}}`} /> ist. Vermutung: Eine Kollision ist ein Sonderfall, bei dem sich die Bahnen schneiden und die Zeiten gleich sind. Bei jedem anderen Tempo schneiden sich die Bahnen weiterhin, es gibt aber keine Kollision.
          </Beobachtung>
        </li>
        <li>
          <p>
            Stelle das Tempo auf <Formel tex={t`${r.tempo}\,\frac{\text{km}}{\text{h}}`} /> und blende die Abstandskurve ein. Wie groß ist der Abstand zu Beginn, wann ist er am kleinsten und wie groß ist er dann? Ist er 0, obwohl sich die Bahnen schneiden? Welche Form hat die Kurve von <Formel tex={t`d(t)^2`} nach="?"/>
          </p>
          <Beobachtung>
            Zu Beginn ist der Abstand <Formel tex={t`d(0)=\sqrt{18}\approx ${rund2(abstandZurZeit(h, r, 0))}\,\text{km}`} nach="." /> Er wird kleiner, ist nach etwa <Formel tex={t`${rund2(kA.t * 60)}\,\text{min}`} /> am kleinsten mit <Formel tex={t`d\approx ${rund2(kA.d)}\,\text{km}`} nach="," /> und wird danach wieder größer. Der kleinste Abstand ist nicht 0, obwohl sich die Bahnen schneiden: Der Abstand der Bahnen (der Geraden) ist 0, der Abstand der Hubschrauber zur selben Zeit nicht. Das Quadrat <Formel tex={t`d(t)^2`} /> ist ein Term der Form <Formel tex={t`a\,t^2+b\,t+c`} nach="," /> seine Kurve ist eine nach oben geöffnete Parabel. Vermutung: Du findest den kleinsten Abstand am Scheitel dieser Parabel, rechnerisch mit der Ableitung (siehe <Modulverweis modul="optimierung">Optimierung</Modulverweis> und <Modulverweis modul="abstaende-geraden">Abstand Punkt und Gerade, paralleler Geraden</Modulverweis>). Weil nur <Formel tex={t`t\ge 0`} /> gilt, liegt der kleinste Wert am Rand <Formel tex={t`t=0`} nach="," /> wenn der Scheitel bei negativem <Formel tex="t" /> liegt.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}
