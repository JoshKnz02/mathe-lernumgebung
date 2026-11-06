import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { gleichsetzSystem, projektionVektor, winkelKoordinatenebene, type Gerade } from '@/lib/gerade';
import { punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t, zt } from '@/lib/modulhilfen';
import { betrag, verbindungsvektor, winkel } from '@/lib/vektor';
import { aufgProj, aufgSeilbahn, aufgZeichnen, aufgZwei } from './Bilder';
import { A_AUSWAHL, A_NULL, A_PARAM1, A_PARAM2, A_PROJ, A_SCHNITT, A_SEILBAHN, A_SENKRECHT, A_ZEICHNEN, A_ZWEI } from './daten';
import { alphaZeilen, betragZeilen, EBENE_TEX, EBENE_TEXT, gl, glSchmal, gradTeX, phiZeilen, projektionGleichung, projektionsRechnung, rund2, sinusRechnung, skalarZeilen, wurzelTeX, type Zeilen } from './rechenhilfen';

const Z = ({ z }: { z: Zeilen }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;
const G = ({ g, name = 'g', par = 't' }: { g: Gerade; name?: string; par?: string }) => <Umbruchformel tex={gl(g, name, par)} schmal={glSchmal(g, name, par)} />;
const PK = (name: string, p: number[]) => punktTeX(name, p);
const feldZahl = (id: string, name: string, beschriftung: string, erwartet: number, toleranz?: number): Feld => ({ id, name, beschriftung: <Formel tex={beschriftung} />, erwartet, ...(toleranz ? { toleranz } : {}) });
const winkelFeld = (id: string, name: string, beschriftung: string, erwartet: number): Feld => feldZahl(id, name, beschriftung, erwartet, 0.01);
const dez = (x: number) => zt(Math.round(x * 100) / 100);
/** Eine Zeile mit einer Gleichung (einzeilig und schmal gleich). */
const Eq = ({ tex }: { tex: string }) => <Umbruchformel tex={tex} schmal={tex} />;
/** Gleichung a · t + b · s = c als TeX (Koeffizient 0 entfällt). */
function gleichungTeX(a: number, b: number, c: number): string {
  const teile: string[] = [];
  const term = (k: number, v: string) => {
    if (k === 0) return;
    const betragK = Math.abs(k) === 1 ? '' : String(Math.abs(k));
    teile.push(`${teile.length === 0 ? (k < 0 ? '-' : '') : k < 0 ? '-' : '+'}${betragK}${v}`);
  };
  term(a, 't');
  term(b, 's');
  return `${teile.join('')}=${zt(c)}`;
}

export function Ueberpruefen() {
  const z = A_ZWEI;
  const sc = A_SCHNITT;
  const au = A_AUSWAHL;
  const pr = A_PROJ;
  const se = A_SENKRECHT;
  const nu = A_NULL;
  const p1 = A_PARAM1;
  const p2 = A_PARAM2;
  const sb = A_SEILBAHN;
  const ze = A_ZEICHNEN;
  const sbU = verbindungsvektor(sb.T, sb.B);
  const gleichungen = gleichsetzSystem(sc.g, sc.h);
  const nullFalsch = nu.daneben.map((v) => winkelKoordinatenebene(v, 'e12'));

  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten. Stelle den Taschenrechner auf Gradmaß (DEG). Das Skalarprodukt steht im Modul <Modulverweis modul="skalarprodukt-orthogonalitaet">Skalarprodukt, Orthogonalität und Winkel</Modulverweis>, das Lösen des Gleichungssystems für einen Schnittpunkt im Modul <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma. Winkel gibst du in Grad auf zwei Nachkommastellen gerundet an, ohne das Gradzeichen.</Hinweis>

      <Auswahlfrage
        nummer="1"
        titel="Warum steht im Zähler der Betrag?"
        optionen={platziere(
          [
            opt('a', <>Damit immer der kleinere der beiden Winkel zwischen den Geraden herauskommt, der Winkel zwischen <Formel tex="0^{\circ}" /> und <Formel tex="90^{\circ}" nach="."/></>, true, <>Richtig. Ein negatives Skalarprodukt gehört zu einem stumpfen Winkel <Formel tex={t`\varphi`} nach="." /> Der Schnittwinkel ist dann <Formel tex={t`180^{\circ}-\varphi`} nach="," /> und genau den liefert der Betrag.</>),
            opt('b', <>Damit der Winkel nicht negativ wird.</>, false, <>Der Winkel zwischen zwei Vektoren ist nie negativ, er liegt immer zwischen <Formel tex="0^{\circ}" /> und <Formel tex="180^{\circ}" nach="." /> Der Betrag ändert etwas anderes: Er macht aus einem stumpfen Winkel den spitzen Nebenwinkel.</>),
            opt('c', <>Damit die Länge der Richtungsvektoren keine Rolle spielt.</>, false, <>Das leistet der Nenner <Formel tex={t`|\vec{u}|\cdot|\vec{v}|`} nach="," /> denn durch ihn kürzt sich die Länge heraus. Der Betrag im Zähler betrifft das Vorzeichen.</>),
            opt('d', <>Damit die Stützvektoren der Geraden nicht eingehen.</>, false, <>Die Stützvektoren kommen in der Formel gar nicht vor, auch ohne Betrag nicht. Nur die Richtungsvektoren gehen ein.</>),
          ],
          1,
        )}
        erklaerung={<>Die beiden Richtungsvektoren können je in die eine oder andere Richtung der Geraden zeigen. Der Schnittwinkel soll davon nicht abhängen, deshalb wird das Vorzeichen des Skalarprodukts weggelassen.</>}
      >
        <p>
          Der Schnittwinkel zweier Geraden mit den Richtungsvektoren <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} /> ist <Formel tex={t`\alpha=\cos^{-1}\frac{|\vec{u}\cdot\vec{v}|}{|\vec{u}|\cdot|\vec{v}|}`} nach="." /> Warum steht im Zähler der Betrag?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={2}
        titel="Schnittwinkel zweier Geraden"
        felder={[feldZahl('sk', 'Skalarprodukt von u und v', t`\vec{u}\cdot\vec{v}`, z.sk), winkelFeld('phi', 'Winkel phi zwischen u und v in Grad', '\\varphi', z.phi), winkelFeld('alpha', 'Schnittwinkel alpha in Grad', '\\alpha', z.alpha)]}
        hilfen={[
          <>Lies die Richtungsvektoren <Formel tex={t`\vec{u}`} /> und <Formel tex={t`\vec{v}`} /> aus den Gleichungen ab. Der Schnittpunkt <Formel tex="S" /> wird nicht gebraucht.</>,
          <>Der Winkel <Formel tex={t`\varphi`} /> folgt aus <Formel tex={t`\cos\varphi=\frac{\vec{u}\cdot\vec{v}}{|\vec{u}|\cdot|\vec{v}|}`} nach="." /> Ist er größer als <Formel tex="90^{\circ}" nach="," /> ist der Schnittwinkel der Nebenwinkel.</>,
        ]}
        loesung={[
          <>Richtungsvektoren <Formel tex={t`\vec{u}=${spalte(z.g.u)}`} /> und <Formel tex={t`\vec{v}=${spalte(z.h.u)}`} nach="." /> Skalarprodukt:<Z z={skalarZeilen(z.g.u, z.h.u)} /></>,
          <>Beträge:<Z z={betragZeilen(z.g.u, '\\vec{u}')} /><Z z={betragZeilen(z.h.u, '\\vec{v}')} /></>,
          <>Winkel zwischen den Vektoren:<Z z={phiZeilen(z.g.u, z.h.u)} /></>,
          <>
            Das Skalarprodukt ist negativ, der Winkel <Formel tex={t`\varphi`} /> ist stumpf. Der Schnittwinkel ist der kleinere Winkel, <Formel tex={t`180^{\circ}-${rund2(z.phi)}^{\circ}`} nach="." /> Mit dem Betrag rechnest du direkt:<Z z={alphaZeilen(z.g.u, z.h.u)} />
          </>,
        ]}
      >
        <p>Gegeben sind die Geraden</p>
        <G g={z.g} />
        <G g={z.h} name="h" par="s" />
        <p>
          Sie schneiden sich im Punkt <Formel tex={PK('S', z.S)} nach="." /> Berechne das Skalarprodukt der Richtungsvektoren, den Winkel <Formel tex={t`\varphi`} /> zwischen ihnen und den Schnittwinkel <Formel tex={t`\alpha`} /> der Geraden.
        </p>
        <KontrollFigur spec={aufgZwei} unter={<>Die Geraden <Formel tex="g" /> und <Formel tex="h" /> mit dem Schnittpunkt <Formel tex={PK('S', z.S)} /> und dem Schnittwinkel <Formel tex={t`\alpha`} nach="."/></>} />
      </Aufgabe>

      <Aufgabe
        nummer={3}
        titel="Schnittpunkt und Schnittwinkel"
        felder={[feldZahl('t', 'Parameter t des Schnittpunkts auf g', 't', sc.t), feldZahl('s', 'Parameter s des Schnittpunkts auf h', 's', sc.s), winkelFeld('alpha', 'Schnittwinkel alpha in Grad', '\\alpha', sc.alpha)]}
        hilfen={[
          <>Setze die rechten Seiten der Geradengleichungen gleich. Du erhältst drei Gleichungen für <Formel tex="t" /> und <Formel tex="s" nach="." /> Zwei davon genügen zum Lösen, die dritte ist die Probe (siehe <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>).</>,
          <>Für den Winkel brauchst du nur die Richtungsvektoren, nicht den Schnittpunkt.</>,
        ]}
        loesung={[
          <>
            Gleichsetzen ergibt drei Gleichungen:
            {gleichungen.map((q, i) => (
              <Eq key={i} tex={`\\text{${['I', 'II', 'III'][i]}:}\\ ${gleichungTeX(q.a, q.b, q.c)}`} />
            ))}
          </>,
          <>
            Gleichung II gibt <Formel tex={t`s=${sc.s}`} nach="." /> In Gleichung I eingesetzt ergibt sich <Formel tex={t`t=${sc.t}`} nach="." /> Probe mit Gleichung III: <Formel tex={t`3\cdot ${sc.t}+2\cdot(${sc.s})=1`} nach="." /> Der Schnittpunkt ist <Formel tex={PK('S', sc.S)} nach="." />
          </>,
          <>
            Skalarprodukt und Beträge:<Z z={skalarZeilen(sc.g.u, sc.h.u)} />
            <Z z={betragZeilen(sc.g.u, '\\vec{u}')} />
            <Z z={betragZeilen(sc.h.u, '\\vec{v}')} />
          </>,
          <>
            Schnittwinkel:<Z z={alphaZeilen(sc.g.u, sc.h.u)} />
          </>,
        ]}
      >
        <p>Gegeben sind</p>
        <G g={sc.g} />
        <G g={sc.h} name="h" par="s" />
        <p>
          Die Geraden schneiden sich. Bestimme die Parameter <Formel tex="t" /> und <Formel tex="s" /> des Schnittpunkts und den Schnittwinkel <Formel tex={t`\alpha`} nach="."/>
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="4"
        titel="Welcher Winkel ist der Schnittwinkel?"
        optionen={platziere(
          [
            opt('a', <>Der Schnittwinkel ist <Formel tex={t`${gradTeX(au.alpha)}`} nach="." /></>, true, <>Richtig. Der Winkel <Formel tex={t`\varphi=${gradTeX(au.phi)}`} /> ist stumpf, der Schnittwinkel ist der kleinere Winkel <Formel tex={t`180^{\circ}-${gradTeX(au.phi)}=${gradTeX(au.alpha)}`} nach="." /></>),
            opt('b', <>Der Schnittwinkel ist <Formel tex={t`${gradTeX(au.phi)}`} nach="." /></>, false, <>Das ist der Winkel zwischen den Richtungsvektoren. Er ist stumpf, der Schnittwinkel ist aber der kleinere der beiden Winkel zwischen den Geraden.</>),
            opt('c', <>Der Schnittwinkel ist <Formel tex={t`${gradTeX(90 - au.alpha)}`} nach="." /></>, false, <>Das ist die Ergänzung von <Formel tex={t`${gradTeX(au.alpha)}`} /> auf <Formel tex="90^{\circ}" nach="." /> Der Nebenwinkel zu <Formel tex={t`${gradTeX(au.phi)}`} /> ergänzt sich dagegen zu <Formel tex="180^{\circ}" nach="." /></>),
            opt('d', <>Der Schnittwinkel ist <Formel tex={t`${gradTeX(360 - au.phi)}`} nach="." /></>, false, <>Ein Winkel zwischen Geraden ist nie größer als <Formel tex="90^{\circ}" nach="." /> Ein Wert über <Formel tex="180^{\circ}" /> kommt beim Winkel zwischen zwei Vektoren nicht vor.</>),
          ],
          0,
        )}
        erklaerung={<>Nimmst du den Winkel zwischen den Richtungsvektoren, kann er stumpf sein. Für den Schnittwinkel wählst du den spitzen Nebenwinkel: Ist <Formel tex={t`\varphi>90^{\circ}`} nach="," /> ist <Formel tex={t`\alpha=180^{\circ}-\varphi`} nach="." /></>}
      >
        <p>
          Zwei Geraden schneiden sich. Ihre Richtungsvektoren sind <Formel tex={t`\vec{u}=${spalte(au.u)}`} /> und <Formel tex={t`\vec{v}=${spalte(au.v)}`} nach="." /> Eine Schülerin findet <Formel tex={t`\cos\varphi=-\frac{7}{9}`} /> und <Formel tex={t`\varphi\approx ${gradTeX(au.phi)}`} nach="." /> Welcher Winkel ist der Schnittwinkel der Geraden?
        </p>
      </Auswahlfrage>

      <Auswahlfrage
        nummer="5"
        titel="Für welche Geraden gibt es einen Schnittwinkel?"
        optionen={platziere(
          [
            opt('a', <>Die Geraden schneiden sich in einem Punkt.</>, true, <>Richtig. Ein Schnittwinkel ist der Winkel im Schnittpunkt. Es gibt ihn bei Geraden, die sich in genau einem Punkt schneiden.</>),
            opt('b', <>Die Geraden sind identisch.</>, false, <>Identische Geraden haben alle Punkte gemeinsam, aber keinen einzelnen Schnittpunkt. Die Richtungsvektoren sind Vielfache, der Winkel der Richtungen ist <Formel tex="0^{\circ}" nach="." /> Von einem Schnittwinkel spricht man nicht.</>),
            opt('c', <>Die Geraden sind parallel.</>, false, <>Parallele Geraden haben keinen gemeinsamen Punkt. Der Winkel der Richtungsvektoren ist <Formel tex="0^{\circ}" nach="," /> einen Schnittwinkel gibt es nicht.</>),
            opt('d', <>Die Geraden sind windschief.</>, false, <>Windschiefe Geraden haben keinen gemeinsamen Punkt. Du kannst den Winkel zwischen den Richtungsvektoren berechnen, ein Schnittwinkel ist es aber nicht, weil sich die Geraden nicht schneiden.</>),
          ],
          0,
        )}
        erklaerung={<>Den Schnittwinkel gibt es nur bei Geraden, die sich in einem Punkt schneiden. Die Lage der Geraden bestimmst du vorher (siehe <Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>).</>}
      >
        <p>Für welche Lage zweier Geraden <Formel tex="g" /> und <Formel tex="h" /> gibt es einen Schnittwinkel?</p>
      </Auswahlfrage>

      <Aufgabe
        nummer={6}
        titel="Winkel mit Koordinatenebenen über die Projektion"
        felder={[winkelFeld('a12', 'Winkel mit der Ebene x1 x2 in Grad', '\\alpha_{12}', pr.e12), winkelFeld('a13', 'Winkel mit der Ebene x1 x3 in Grad', '\\alpha_{13}', pr.e13)]}
        hilfen={[
          <>Projiziere den Richtungsvektor in die Ebene: Die Koordinate, die im Namen der Ebene nicht vorkommt, wird 0.</>,
          <>Berechne den Winkel zwischen <Formel tex={t`\vec{u}`} /> und dem Projektionsvektor mit der Formel für den Schnittwinkel. Der Stützvektor wird nicht gebraucht.</>,
        ]}
        loesung={[
          <>
            <Formel tex="x_1x_2" />-Ebene, die 3. Koordinate wird 0:<Eq tex={projektionGleichung(pr.g.u, 'e12')} />
            <Z z={projektionsRechnung(pr.g.u, 'e12').produkt} />
          </>,
          <>
            Betrag und Winkel:<Z z={betragZeilen(pr.g.u.map((c, i) => (i === 2 ? 0 : c)), "\\vec{u}_{12}")} />
            <Z z={projektionsRechnung(pr.g.u, 'e12').winkel} />
          </>,
          <>
            <Formel tex="x_1x_3" />-Ebene, die 2. Koordinate wird 0:<Eq tex={projektionGleichung(pr.g.u, 'e13')} />
            <Z z={projektionsRechnung(pr.g.u, 'e13').produkt} />
          </>,
          <>
            Betrag und Winkel:<Z z={betragZeilen(pr.g.u.map((c, i) => (i === 1 ? 0 : c)), "\\vec{u}_{13}")} />
            <Z z={projektionsRechnung(pr.g.u, 'e13').winkel} />
          </>,
        ]}
      >
        <p>Gegeben ist die Gerade</p>
        <G g={pr.g} />
        <p>
          Sie geht durch den Punkt <Formel tex={PK('S_{13}', pr.S)} /> der <Formel tex="x_1x_3" />-Ebene. Berechne mit der Projektion des Richtungsvektors den Winkel von <Formel tex="g" /> mit der <Formel tex="x_1x_2" />-Ebene und mit der <Formel tex="x_1x_3" />-Ebene.
        </p>
        <KontrollFigur spec={aufgProj} unter={<>Die Gerade <Formel tex="g" /> und ihre Projektion <Formel tex="g'" /> in die <Formel tex="x_1x_3" />-Ebene mit dem Winkel <Formel tex={t`\alpha_{13}`} nach="."/></>} />
      </Aufgabe>

      <Aufgabe
        nummer={7}
        titel="Winkel mit Koordinatenebenen über einen senkrechten Vektor"
        felder={[winkelFeld('a12', 'Winkel mit der Ebene x1 x2 in Grad', '\\alpha_{12}', se.e12), winkelFeld('a13', 'Winkel mit der Ebene x1 x3 in Grad', '\\alpha_{13}', se.e13), winkelFeld('a23', 'Winkel mit der Ebene x2 x3 in Grad', '\\alpha_{23}', se.e23)]}
        hilfen={[
          <>Für die Ebene gilt <Formel tex={t`\sin\alpha=\frac{|u_i|}{|\vec{u}|}`} nach="," /> wobei <Formel tex={t`u_i`} /> die Koordinate ist, die in der Ebene 0 ist. Bei der <Formel tex="x_1x_2" />-Ebene ist das die 3. Koordinate.</>,
          <>Berechne zuerst <Formel tex={t`|\vec{u}|`} nach="." /> Rechne dann mit <Formel tex={t`\sin^{-1}`} nach="." /> Der Taschenrechner steht auf Gradmaß.</>,
        ]}
        loesung={[
          <>
            Länge des Richtungsvektors:<Z z={betragZeilen(se.g.u, '\\vec{u}')} />
          </>,
          <>
            <Formel tex="x_1x_2" />-Ebene mit <Formel tex={t`|u_3|`} nach=":" /><Z z={sinusRechnung(se.g.u, 'e12').zeilen} />
          </>,
          <>
            <Formel tex="x_1x_3" />-Ebene mit <Formel tex={t`|u_2|`} nach=":" /><Z z={sinusRechnung(se.g.u, 'e13').zeilen} />
          </>,
          <>
            <Formel tex="x_2x_3" />-Ebene mit <Formel tex={t`|u_1|`} nach=":" /><Z z={sinusRechnung(se.g.u, 'e23').zeilen} />
            Die Beträge der 1. und der 3. Koordinate sind gleich, deshalb sind die Winkel mit der <Formel tex="x_1x_2" />-Ebene und der <Formel tex="x_2x_3" />-Ebene gleich groß.
          </>,
        ]}
      >
        <p>Gegeben ist die Gerade</p>
        <G g={se.g} />
        <p>Berechne den Winkel von <Formel tex="g" /> mit jeder der drei Koordinatenebenen, ohne den Richtungsvektor zu projizieren. Warum sind zwei der drei Winkel gleich groß?</p>
      </Aufgabe>

      <Auswahlfrage
        nummer="8"
        titel="Winkel 0° mit der Ebene"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`\vec{u}=${spalte(nu.richtig)}`} />, true, <>Richtig. Die 3. Koordinate ist 0, der Vektor liegt parallel zur <Formel tex="x_1x_2" />-Ebene. Seine Projektion ist er selbst, der Winkel ist <Formel tex="0^{\circ}" nach="." /></>),
            opt('b', <Formel tex={t`\vec{u}=${spalte(nu.daneben[0]!)}`} />, false, <>Hier sind die ersten beiden Koordinaten 0, die Gerade steht senkrecht auf der <Formel tex="x_1x_2" />-Ebene. Der Winkel ist <Formel tex="90^{\circ}" nach="." /></>),
            opt('c', <Formel tex={t`\vec{u}=${spalte(nu.daneben[1]!)}`} />, false, <>Die 3. Koordinate ist nicht 0, die Gerade steigt an. Der Winkel mit der Ebene ist <Formel tex={t`\approx ${gradTeX(nullFalsch[1]!)}`} nach="." /> Das ist klein, aber nicht 0.</>),
            opt('d', <Formel tex={t`\vec{u}=${spalte(nu.daneben[2]!)}`} />, false, <>Die Projektion ist <Formel tex={t`${spalte([1, 1, 0])}`} nach="," /> der Winkel ist <Formel tex={t`\approx ${gradTeX(nullFalsch[2]!)}`} nach="." /></>),
          ],
          2,
        )}
        erklaerung={<>Eine Gerade hat den Winkel 0° mit einer Koordinatenebene, wenn die Koordinate ihres Richtungsvektors gleich 0 ist, die in der Ebene 0 ist. Dann ist sie parallel zur Ebene oder liegt in ihr. Senkrecht steht sie, wenn nur diese Koordinate ungleich 0 ist.</>}
      >
        <p>
          Welcher dieser Richtungsvektoren gehört zu einer Geraden, die mit der <Formel tex="x_1x_2" />-Ebene den Winkel <Formel tex="0^{\circ}" /> bildet?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={9}
        titel="Senkrechte Geraden mit Parameter"
        felder={[feldZahl('a', 'Parameter a', 'a', p1.a)]}
        hilfen={[
          <>Die Geraden schneiden sich für jedes <Formel tex="a" /> in <Formel tex="S" nach="." /> Sie stehen senkrecht aufeinander, wenn der Schnittwinkel <Formel tex={t`90^{\circ}`} /> ist, also <Formel tex={t`\cos\alpha=0`} nach="." /></>,
          <>Das ist der Fall, wenn das Skalarprodukt der Richtungsvektoren 0 ist. Stelle es mit <Formel tex="a" /> auf und löse die Gleichung.</>,
        ]}
        loesung={[
          <>
            Skalarprodukt:
            <Z z={{
              tex: t`\vec{u}\cdot\vec{v}=2\cdot a+a\cdot(-3)+1\cdot 2=2a-3a+2=2-a`,
              schmal: t`\begin{gathered}2\cdot a=2a\\a\cdot(-3)=-3a\\1\cdot 2=2\\\vec{u}\cdot\vec{v}\\{}=2a-3a+2\\{}=2-a\end{gathered}`,
            }} />
          </>,
          <>
            Der Schnittwinkel ist <Formel tex="90^{\circ}" nach="," /> wenn das Skalarprodukt 0 ist:
            <Z z={{ tex: t`2-a=0\ \Rightarrow\ a=2`, schmal: t`\begin{gathered}2-a=0\\{}\Rightarrow a=2\end{gathered}` }} />
          </>,
          <>
            Probe mit <Formel tex={t`a=2`} nach=":" /> <Formel tex={t`\vec{u}=${spalte([2, 2, 1])}`} /> und <Formel tex={t`\vec{v}=${spalte([2, -3, 2])}`} nach="," /> das Skalarprodukt ist <Formel tex={t`4-6+2=0`} nach="." />
          </>,
        ]}
      >
        <p>
          Die Geraden <Formel tex={t`g:\ \vec{x}=${spalte(p1.S)}+t\cdot \begin{pmatrix}2\\a\\1\end{pmatrix}`} /> und <Formel tex={t`h:\ \vec{x}=${spalte(p1.S)}+s\cdot \begin{pmatrix}a\\-3\\2\end{pmatrix}`} /> gehen beide durch den Punkt <Formel tex={PK('S', p1.S)} nach="." /> Bestimme <Formel tex="a" /> so, dass sich die Geraden senkrecht schneiden.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={10}
        titel="Winkel von 45° mit der Ebene"
        felder={[feldZahl('a', 'Parameter a, a größer als 0', 'a', p2.a)]}
        hilfen={[
          <>Die Gerade soll mit der <Formel tex="x_1x_2" />-Ebene den Winkel <Formel tex="45^{\circ}" /> bilden. Verwende <Formel tex={t`\sin\alpha=\frac{|u_3|}{|\vec{u}|}`} nach="." /></>,
          <>Es ist <Formel tex={t`\sin 45^{\circ}=\frac{\sqrt{2}}{2}`} nach="." /> Quadriere beide Seiten der Gleichung, damit die Wurzel verschwindet.</>,
        ]}
        loesung={[
          <>
            Richtungsvektor <Formel tex={t`\vec{u}=\begin{pmatrix}3\\4\\a\end{pmatrix}`} nach="," /> es ist <Formel tex={t`|\vec{u}|=\sqrt{25+a^2}`} nach="."/>
            <Z z={{ tex: t`\sin 45^{\circ}=\frac{a}{\sqrt{25+a^2}}`, schmal: t`\begin{gathered}\sin 45^{\circ}\\{}=\frac{a}{\sqrt{25+a^2}}\end{gathered}` }} />
          </>,
          <>
            Quadrieren mit <Formel tex={t`\sin^2 45^{\circ}=\frac{1}{2}`} nach=":" />
            <Z z={{ tex: t`\frac{1}{2}=\frac{a^2}{25+a^2}`, schmal: t`\begin{gathered}\frac{1}{2}\\{}=\frac{a^2}{25+a^2}\end{gathered}` }} />
          </>,
          <>
            Auflösen:
            <Z z={{ tex: t`25+a^2=2a^2,\ \ a^2=25`, schmal: t`\begin{gathered}25+a^2=2a^2\\a^2=25\end{gathered}` }} />
            Wegen <Formel tex={t`a>0`} /> ist <Formel tex={t`a=5`} nach="." /> Probe: <Formel tex={t`\sin\alpha=\frac{5}{\sqrt{50}}=\frac{\sqrt{2}}{2}`} nach="." />
          </>,
        ]}
      >
        <p>Gegeben ist die Gerade</p>
        <Eq tex={t`g:\ \vec{x}=${spalte(p2.g.p)}+t\cdot \begin{pmatrix}3\\4\\a\end{pmatrix}`} />
        <p>
          mit einem Parameter <Formel tex={t`a>0`} nach="." /> Bestimme <Formel tex="a" /> so, dass <Formel tex="g" /> mit der <Formel tex="x_1x_2" />-Ebene den Winkel <Formel tex="45^{\circ}" /> bildet.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={11}
        titel="Die Seilbahn"
        felder={[winkelFeld('alpha', 'Winkel zum Boden in Grad', '\\alpha', sb.alpha), feldZahl('l', 'Länge des Seils in Metern, gerundet', 'l', sb.laenge, 0.5)]}
        hilfen={[
          <>Der Boden ist die <Formel tex="x_1x_2" />-Ebene. Das Seil liegt auf der Geraden durch <Formel tex="T" /> und <Formel tex="B" nach="." /> Bestimme den Richtungsvektor <Formel tex={t`\overrightarrow{TB}`} nach="." /></>,
          <>Der Winkel zum Boden ist der Winkel mit der <Formel tex="x_1x_2" />-Ebene. Die Länge des Seils ist der Betrag von <Formel tex={t`\overrightarrow{TB}`} nach="." /> Eine Längeneinheit sind 100 Meter.</>,
        ]}
        loesung={[
          <>
            Richtungsvektor:<Eq tex={t`\overrightarrow{TB}=${spalte(sbU)}`} />
          </>,
          <>
            Länge:<Z z={betragZeilen(sbU, '\\overrightarrow{TB}')} />
            Das sind <Formel tex={t`${rund2(betrag(sbU))}\cdot 100\approx ${Math.round(betrag(sbU) * 100)}`} /> Meter.
          </>,
          <>
            Winkel zum Boden mit der 3. Koordinate:<Z z={sinusRechnung(sbU, 'e12').zeilen} />
          </>,
        ]}
      >
        <p>
          Die Seilbahn fährt von der Talstation <Formel tex={PK('T', sb.T)} /> zur Bergstation <Formel tex={PK('B', sb.B)} nach="." /> Eine Längeneinheit entspricht 100 Meter, der Boden ist die <Formel tex="x_1x_2" />-Ebene. Das Seil ist geradlinig. Berechne den Winkel, den das Seil mit dem Boden bildet, und die Länge des Seils auf Meter genau.
        </p>
        <KontrollFigur spec={aufgSeilbahn} unter={<>Das Seil von <Formel tex="T" /> nach <Formel tex="B" nach="," /> seine Projektion auf den Boden und das Lot von <Formel tex="B" /> zum Boden mit dem Winkel <Formel tex={t`\alpha`} nach="." /></>} />
      </Aufgabe>

      <Zeichenaufgabe
        nummer="12"
        titel="Gerade und Projektion zeichnen"
        hilfe={
          <>
            <p>
              Der Richtungsvektor ist <Formel tex={t`\vec{u}=${spalte(ze.g.u)}`} nach="." /> Die Projektion in die <Formel tex="x_1x_2" />-Ebene hat den Richtungsvektor <Formel tex={t`\vec{u}_{12}=${spalte(projektionVektor(ze.g.u, 'e12'))}`} nach="." /> Beide Geraden gehen durch <Formel tex={PK('S_{12}', ze.S)} nach="." />
            </p>
            <Z z={sinusRechnung(ze.g.u, 'e12').zeilen} />
            <p>
              Zeichne <Formel tex="g" /> durch den Spurpunkt, <Formel tex="g'" /> durch denselben Punkt in der Ebene und markiere den Winkel <Formel tex={t`\alpha`} /> zwischen beiden. Wähle dafür auf <Formel tex="g" /> einen zweiten Punkt, zum Beispiel für <Formel tex={t`t=\frac{1}{2}`} nach="," /> und zeichne sein Lot auf die Ebene.
            </p>
          </>
        }
        kontrolle={<KontrollFigur spec={aufgZeichnen} unter={<>Die Gerade <Formel tex="g" /> durch <Formel tex={PK('S_{12}', ze.S)} nach="," /> ihre Projektion <Formel tex="g'" /> und der Winkel <Formel tex={t`\alpha\approx ${gradTeX(ze.alpha)}`} nach="." /></>} />}
      >
        <p>Gegeben ist die Gerade</p>
        <G g={ze.g} />
        <p>
          Sie geht durch den Punkt <Formel tex={PK('S_{12}', ze.S)} /> der <Formel tex="x_1x_2" />-Ebene. Zeichne <Formel tex="g" /> und ihre senkrechte Projektion <Formel tex="g'" /> in die <Formel tex="x_1x_2" />-Ebene in ein Schrägbild (2 Kästchen je Einheit auf der <Formel tex="x_2" />- und der <Formel tex="x_3" />-Achse, eine Kästchendiagonale auf der <Formel tex="x_1" />-Achse). Markiere den Winkel <Formel tex={t`\alpha`} /> zwischen <Formel tex="g" /> und <Formel tex="g'" /> und berechne ihn. Prüfe danach mit dem Kontrollschaubild.
        </p>
      </Zeichenaufgabe>
    </Abschnitt>
  );
}
