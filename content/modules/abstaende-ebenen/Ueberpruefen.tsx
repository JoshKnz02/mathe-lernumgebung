import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { abstandPunktEbene } from '@/lib/abstandebene';
import { abstandMitWert, formelZeilen, formTeX, spalteBruch, spiegelZeilen, weg1 } from '@/lib/abstandebenehilfen';
import { kreuzSpalte, kreuzSpalteKurz, skalarZeilen } from '@/lib/ebenenhilfen';
import { geradenprobeZeilen } from '@/lib/geradeebenehilfen';
import { bruch, gl, punktTeX } from '@/lib/geradenhilfen';
import { spalte } from '@/lib/laborhilfen';
import { opt, platziere, t, zt } from '@/lib/modulhilfen';
import { aufg1, aufg12, aufg5, aufg7, aufg8, aufg9 } from './Bilder';
import { A1, A10, A11, A12, A2, A3, A4, A5, A6, A7, A8, A9, E } from './daten';

type Z = { tex: string; schmal: string };
const Zeilen = ({ z }: { z: Z }) => <Umbruchformel tex={z.tex} schmal={z.schmal} />;
/** Lange Ketten der Geradenprobe stehen in den Lösungsschritten (feste, schmale Box) auch auf breiten Fenstern in kurzen Zeilen. */
const kurz = (z: Z): Z => (z.tex.length > 50 ? { tex: z.schmal, schmal: z.schmal } : z);
const koordFelder = (praefix: string, punkt: string, werte: number[], toleranz?: number): Feld[] =>
  werte.map((x, i) => ({ id: `${praefix}${i + 1}`, name: `${i + 1}. Koordinate von ${punkt}`, beschriftung: <>{i + 1}. Koordinate von <Formel tex={punkt} /></>, erwartet: x, ...(toleranz ? { toleranz } : {}) }));
const dFeld = (name = 'Abstand d', toleranz?: number): Feld => ({ id: 'd', name, beschriftung: <>Abstand <Formel tex="d" /></>, erwartet: 0, ...(toleranz ? { toleranz } : {}) });
const mitWert = (f: Feld, erwartet: number): Feld => ({ ...f, erwartet });

export function Ueberpruefen() {
  const w1 = weg1(A1.k, A1.Q);
  const f2 = formelZeilen(A2.k, A2.Q);
  const r3 = abstandPunktEbene(A3.k, A3.Q);
  const k4 = A4.k;
  const f4 = formelZeilen(k4, A4.Q);
  const w5 = weg1(A5.k, A5.Q);
  const r5 = abstandPunktEbene(A5.k, A5.Q);
  const nu7 = skalarZeilen(A7.k.n, A7.g.u);
  const np7 = skalarZeilen(A7.k.n, A7.g.p);
  const f7 = formelZeilen(A7.k, A7.g.p);
  const f8 = formelZeilen(A8.e, A8.Q);
  const w9 = weg1(A9.k, A9.Q);
  const s9 = spiegelZeilen(A9.k, A9.Q);
  const f11 = formelZeilen(A11.k, A11.M);
  const p12 = geradenprobeZeilen(A12.g, E);
  const nu = (g: { p: number[]; u: number[] }) => skalarZeilen(E.n, g.u).tex;
  const sk = (g: { p: number[]; u: number[] }) => skalarZeilen(E.n, g.p).tex;
  const w13 = weg1(E, [2, 2, 3]);
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Das Vektorprodukt (Kreuzprodukt) steht im Modul <Modulverweis modul="vektorprodukt">Das Vektorprodukt</Modulverweis> (Kreuzprodukt), die Geradenprobe im Modul <Modulverweis modul="gerade-und-ebene">Gerade und Ebene: gegenseitige Lage</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, einen Bruch kannst du mit Schrägstrich eingeben. Bei Aufgaben mit Taschenrechner genügen zwei Nachkommastellen. Die Längeneinheit ist, wenn nichts anderes steht, eine Längeneinheit (LE).</Hinweis>

      <Aufgabe
        nummer={1}
        titel="Lotfußpunkt und Abstand bestimmen"
        felder={[...koordFelder('f', 'F', A1.F), mitWert(dFeld(), A1.d)]}
        hilfen={[
          <>Die Lotgerade geht durch <Formel tex="Q" /> und hat den Normalenvektor der Ebene als Richtungsvektor.</>,
          <>Führe die Geradenprobe mit der Lotgeraden und der Ebene aus und löse nach <Formel tex="t" /> auf. Setze <Formel tex={t`t_0`} /> in die Lotgerade ein.</>,
          <>Der Abstand ist <Formel tex={t`d=|t_0|\cdot|\vec{n}|`} nach="." /></>,
        ]}
        loesung={[
          <>Lotgerade: <Umbruchformel tex={w1.lotgerade} schmal={w1.lotgeradeSchmal} /></>,
          <>Geradenprobe: <Zeilen z={kurz(w1.probe)} /></>,
          <>Aus <Formel tex={w1.probe.gleichung} /> folgt <Formel tex={t`t_0=${w1.t}`} nach="." /> Lotfußpunkt: <Zeilen z={w1.fuss} /></>,
          <>Abstand: <Zeilen z={w1.norm} /><Zeilen z={w1.abstand} /></>,
        ]}
      >
        <p>
          Gegeben sind die Ebene <Formel tex={formTeX(A1.k)} /> und der Punkt <Formel tex={punktTeX('Q', A1.Q)} nach="." /> Bestimme den Lotfußpunkt <Formel tex="F" /> von <Formel tex="Q" /> auf <Formel tex="E" /> und den Abstand <Formel tex="d" /> von <Formel tex="Q" /> zur Ebene.
        </p>
        <KontrollFigur spec={aufg1} unter={<>Das Lot von <Formel tex="Q" /> auf die Ebene mit dem Lotfußpunkt <Formel tex="F" nach="." /></>} />
      </Aufgabe>

      <Aufgabe
        nummer={2}
        titel="Abstand mit der Formel berechnen"
        felder={[mitWert(dFeld('Abstand d in Längeneinheiten', 0.01), A2.d)]}
        hilfen={[
          <>Setze die Koordinaten von <Formel tex="Q" /> in den Term <Formel tex={t`n_1x_1+n_2x_2+n_3x_3-b`} /> ein und bilde den Betrag.</>,
          <>Teile durch den Betrag des Normalenvektors <Formel tex={t`|\vec{n}|=\sqrt{n_1^2+n_2^2+n_3^2}`} nach="." /></>,
        ]}
        loesung={[<>Abstandsformel: <Zeilen z={f2.zeilen} /></>]}
      >
        <p>
          Gegeben sind <Formel tex={formTeX(A2.k)} /> und <Formel tex={punktTeX('Q', A2.Q)} nach="." /> Berechne den Abstand von <Formel tex="Q" /> zur Ebene <Formel tex="E" nach="." /> Runde auf zwei Nachkommastellen.
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Fehler in der Abstandsformel finden"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`d=${abstandMitWert(r3.z, r3.nn)}`} />, true, <>Richtig. Zähler: <Formel tex={t`|${r3.z}|=${Math.abs(r3.z)}`} nach="," /> Nenner: <Formel tex={t`|\vec{n}|=3`} nach="." /> Der Abstand ist <Formel tex={t`\frac{${Math.abs(r3.z)}}{3}`} nach="." /></>),
            opt('b', <Formel tex={t`d=-\frac{${Math.abs(r3.z)}}{3}`} />, false, <>Der Zähler <Formel tex={t`${r3.z}`} /> ist negativ. Der Betrag macht ihn positiv. Ein Abstand ist nie negativ.</>),
            opt('c', <Formel tex={t`d=${Math.abs(r3.z)}`} />, false, <>Hier fehlt die Division durch <Formel tex={t`|\vec{n}|=3`} nach="." /> Ohne sie ist das Ergebnis vom Betrag des Normalenvektors abhängig und nicht der Abstand.</>),
            opt('d', <Formel tex={t`d=\frac{${Math.abs(r3.z)}}{9}`} />, false, <>Hier wurde durch <Formel tex={t`|\vec{n}|^2=9`} /> geteilt. In der Formel steht <Formel tex={t`|\vec{n}|=\sqrt{n_1^2+n_2^2+n_3^2}`} nach="," /> die Wurzel gehört dazu.</>),
          ],
          1,
        )}
        erklaerung={<>Die Abstandsformel hat im Zähler den Betrag von <Formel tex={t`\vec{n}\cdot\vec{q}-b`} /> und im Nenner den Betrag <Formel tex={t`|\vec{n}|`} nach="." /> Zähler: <Formel tex={t`|${skalarZeilen(A3.k.n, A3.Q).tex}-${A3.k.d}|=|${r3.z}|`} nach="." /></>}
      >
        <p>
          Gegeben sind <Formel tex={formTeX(A3.k)} /> und <Formel tex={punktTeX('Q', A3.Q)} nach="." /> Welches Ergebnis ist der Abstand von <Formel tex="Q" /> zur Ebene?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={4}
        titel="Die Ebene in Parameterform"
        felder={[mitWert(dFeld('Abstand d in Längeneinheiten', 0.01), A4.d)]}
        hilfen={[
          <>Bestimme zuerst die Koordinatenform: Der Normalenvektor ist das Vektorprodukt (Kreuzprodukt) der Spannvektoren, die rechte Seite ist <Formel tex={t`b=\vec{n}\cdot\vec{p}`} nach="." /></>,
          <>Mit der Koordinatenform rechnest du den Abstand mit der Abstandsformel.</>,
        ]}
        loesung={[
          <>Normalenvektor: <Umbruchformel tex={t`\vec{n}=${kreuzSpalte(A4.u, A4.v)}=${spalte(k4.n)}`} schmal={t`\begin{gathered}\vec{n}\\{}=${kreuzSpalteKurz(A4.u, A4.v)}\\{}=${spalte(k4.n)}\end{gathered}`} /></>,
          <>Rechte Seite: <Zeilen z={skalarZeilen(k4.n, A4.p)} /> Die Koordinatenform ist <Formel tex={formTeX(k4)} nach="." /></>,
          <>Abstand: <Zeilen z={f4.zeilen} /></>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`E:\ \vec{x}=${spalte(A4.p)}+r\cdot${spalte(A4.u)}+s\cdot${spalte(A4.v)}`} /> und <Formel tex={punktTeX('Q', A4.Q)} nach="." /> Berechne den Abstand von <Formel tex="Q" /> zur Ebene <Formel tex="E" nach="." /> Runde auf zwei Nachkommastellen.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={5}
        titel="Drohne über einem Schrägdach"
        felder={[mitWert(dFeld('Abstand d in Metern'), A5.d), { id: 'h', name: 'Höhe des Lotfußpunkts in Metern', beschriftung: <>Höhe des Lotfußpunkts</>, erwartet: A5.h }]}
        hilfen={[
          <>Der Lotfußpunkt <Formel tex="F" /> ist der Punkt der Dachfläche, der der Drohne am nächsten liegt. Die Höhe ist seine <Formel tex={t`x_3`} />-Koordinate.</>,
          <>Bestimme <Formel tex="F" /> mit der Lotgeraden (Weg 1).</>,
        ]}
        loesung={[
          <>Lotgerade durch <Formel tex="Q" /> mit dem Richtungsvektor <Formel tex={t`\vec{n}`} nach=":" /> <Umbruchformel tex={w5.lotgerade} schmal={w5.lotgeradeSchmal} /></>,
          <>Geradenprobe: <Zeilen z={kurz(w5.probe)} /> Aus <Formel tex={w5.probe.gleichung} /> folgt <Formel tex={t`t_0=${w5.t}`} nach="." /></>,
          <>Lotfußpunkt: <Zeilen z={w5.fuss} /> Seine Höhe ist <Formel tex={t`x_3=${bruch(r5.F[2]!)}=${zt(r5.F[2]!)}`} nach="." /></>,
          <>Abstand: <Zeilen z={w5.abstand} /></>,
        ]}
      >
        <p>
          Eine Dachfläche liegt in der Ebene <Formel tex={formTeX(A5.k, 'E')} nach="." /> Eine Drohne schwebt im Punkt <Formel tex={punktTeX('Q', A5.Q)} nach="." /> Eine Längeneinheit entspricht einem Meter, die <Formel tex={t`x_3`} />-Achse zeigt nach oben. Bestimme den Abstand der Drohne von der Dachfläche und die Höhe des Lotfußpunkts über dem Boden.
        </p>
        <KontrollFigur spec={aufg5} unter={<>Die Drohne <Formel tex="Q" /> und der Lotfußpunkt <Formel tex="F" /> auf der Dachfläche.</>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="6"
        titel="Welche Gerade hat einen Abstand größer als 0?"
        optionen={platziere(
          [
            opt('a', <Formel tex={gl(A6.g3, 'g_3')} />, true, <>Richtig. <Formel tex={t`\vec{n}\cdot\vec{u}=${nu(A6.g3)}=0`} /> und der Stützpunkt liegt nicht in <Formel tex="E" nach=":" /> <Formel tex={t`${sk(A6.g3)}\ne 2`} nach="." /> Die Gerade ist echt parallel zu <Formel tex="E" /> und hat den Abstand <Formel tex={t`d=${abstandMitWert(2, 9)}`} nach="." /></>),
            opt('b', <Formel tex={gl(A6.g1, 'g_1')} />, false, <><Formel tex={t`\vec{n}\cdot\vec{u}=${nu(A6.g1)}=0`} /> und der Stützpunkt liegt in <Formel tex="E" nach=":" /> <Formel tex={t`${sk(A6.g1)}=2`} nach="." /> Die Gerade liegt in <Formel tex="E" nach="," /> der Abstand ist 0.</>),
            opt('c', <Formel tex={gl(A6.g2, 'g_2')} />, false, <><Formel tex={t`\vec{n}\cdot\vec{u}=${nu(A6.g2)}\ne 0`} nach="," /> die Gerade schneidet die Ebene. Sie hat einen gemeinsamen Punkt mit <Formel tex="E" nach="," /> der Abstand ist 0.</>),
            opt('d', <Formel tex={gl(A6.g4, 'g_4')} />, false, <><Formel tex={t`\vec{n}\cdot\vec{u}=${nu(A6.g4)}\ne 0`} nach="," /> die Gerade schneidet die Ebene, der Abstand ist 0. Ein Stützpunkt, der nicht in <Formel tex="E" /> liegt, ändert daran nichts, wenn die Gerade nicht parallel ist.</>),
          ],
          3,
        )}
        erklaerung={<>Nur eine echt parallele Gerade hat zur Ebene einen Abstand größer als 0. Sie ist an <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> und einem Stützpunkt außerhalb der Ebene zu erkennen. Schneidende Geraden und Geraden in der Ebene haben mit der Ebene einen Punkt gemeinsam, ihr Abstand ist 0.</>}
      >
        <p>
          Gegeben ist die Ebene <Formel tex={formTeX(E)} nach="." /> Welche der Geraden hat zu <Formel tex="E" /> einen Abstand größer als 0?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={7}
        titel="Abstand einer Geraden von einer Ebene"
        felder={[mitWert(dFeld('Abstand d in Längeneinheiten'), A7.d)]}
        hilfen={[
          <>Prüfe mit <Formel tex={t`\vec{n}\cdot\vec{u}`} nach="," /> ob die Gerade echt parallel zur Ebene ist, und mit dem Stützpunkt, ob sie nicht in der Ebene liegt.</>,
          <>Der Abstand der Geraden ist der Abstand des Stützpunkts von der Ebene.</>,
        ]}
        loesung={[
          <>Richtungsvektor: <Zeilen z={{ tex: `\\vec{n}\\cdot\\vec{u}=${nu7.tex}`, schmal: nu7.schmal }} /></>,
          <>Stützpunkt: <Zeilen z={{ tex: `\\vec{n}\\cdot\\vec{p}=${np7.tex}`, schmal: np7.schmal }} /> Wegen <Formel tex={t`\vec{n}\cdot\vec{u}=0`} /> und <Formel tex={t`11\ne 5`} /> ist <Formel tex="g" /> echt parallel zu <Formel tex="E" nach="." /></>,
          <>Abstand des Stützpunkts: <Zeilen z={f7.zeilen} /></>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={formTeX(A7.k)} /> und <Formel tex={gl(A7.g)} nach="." /> Die Gerade <Formel tex="g" /> ist echt parallel zu <Formel tex="E" nach="." /> Bestimme den Abstand von <Formel tex="g" /> und <Formel tex="E" nach="." />
        </p>
        <KontrollFigur spec={aufg7} unter={<>Die Gerade <Formel tex="g" /> und ihr Lot auf die Ebene.</>} />
      </Aufgabe>

      <Aufgabe
        nummer={8}
        titel="Abstand paralleler Ebenen"
        felder={[mitWert(dFeld('Abstand d in Längeneinheiten'), A8.d)]}
        hilfen={[
          <>Vergleiche die Normalenvektoren. Es ist <Formel tex={t`\vec{n}_F=2\cdot\vec{n}_E`} nach="." /> Teile die zweite Gleichung zuerst durch 2, um die rechten Seiten zu vergleichen.</>,
          <>Bestimme einen Punkt von <Formel tex="F" /> und berechne seinen Abstand von <Formel tex="E" nach="." /></>,
        ]}
        loesung={[
          <>Normalenvektoren: <Formel tex={t`${spalte(A8.f.n)}=2\cdot${spalte(A8.e.n)}`} nach="." /> Teilt man die Gleichung von <Formel tex="F" /> durch 2, entsteht <Formel tex={formTeX({ n: A8.e.n, d: A8.f.d / 2 }, 'F')} nach="." /> Die rechten Seiten sind <Formel tex={t`${A8.e.d}`} /> und <Formel tex={t`${A8.f.d / 2}`} nach="," /> verschieden: Die Ebenen sind echt parallel.</>,
          <>Punkt in <Formel tex="F" nach=":" /> <Formel tex={punktTeX('Q', A8.Q)} nach="," /> denn <Formel tex={t`${skalarZeilen(A8.f.n, A8.Q).tex}`} nach="." /></>,
          <>Abstand von <Formel tex="Q" /> zu <Formel tex="E" nach=":" /> <Zeilen z={f8.zeilen} /></>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={formTeX(A8.e)} /> und <Formel tex={formTeX(A8.f, 'F')} nach="." /> Zeige, dass die Ebenen echt parallel sind, und bestimme ihren Abstand.
        </p>
        <KontrollFigur spec={aufg8} unter={<>Die parallelen Ebenen <Formel tex="E" /> (grau) und <Formel tex="F" /> (orange berandet) mit dem Lot von <Formel tex="Q" nach="." /></>} />
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Spiegelung an einer Ebene"
        felder={koordFelder('q', "Q'", A9.Qs)}
        hilfen={[
          <>Bestimme zuerst den Lotfußpunkt <Formel tex="F" /> mit der Lotgeraden.</>,
          <>Der Lotfußpunkt ist die Mitte von <Formel tex={t`QQ'`} nach="." /> Also ist <Formel tex={t`\overrightarrow{OQ'}=2\cdot\overrightarrow{OF}-\overrightarrow{OQ}`} nach="." /></>,
        ]}
        loesung={[
          <>Lotgerade: <Umbruchformel tex={w9.lotgerade} schmal={w9.lotgeradeSchmal} /></>,
          <>Geradenprobe: <Zeilen z={kurz(w9.probe)} /> Aus <Formel tex={w9.probe.gleichung} /> folgt <Formel tex={t`t_0=${w9.t}`} nach="." /></>,
          <>Spiegelpunkt: <Zeilen z={{ tex: s9.tex, schmal: s9.schmal }} /> Zur Kontrolle: <Zeilen z={s9.viaF} /></>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={formTeX(A9.k)} /> und <Formel tex={punktTeX('Q', A9.Q)} nach="." /> Bestimme den Spiegelpunkt <Formel tex={t`Q'`} /> von <Formel tex="Q" /> an der Ebene <Formel tex="E" nach="." />
        </p>
        <KontrollFigur spec={aufg9} unter={<>Der Punkt <Formel tex="Q" /> und der Spiegelpunkt <Formel tex={t`Q'`} /> mit dem Lotfußpunkt <Formel tex="F" /> als Mitte.</>} />
      </Aufgabe>

      <Aufgabe
        nummer={10}
        titel="Einen Parameter bestimmen"
        felder={[
          { id: 'a1', name: 'kleinere Lösung für a', beschriftung: <>kleinere Lösung <Formel tex="a_1" /></>, erwartet: A10.a1 },
          { id: 'a2', name: 'größere Lösung für a', beschriftung: <>größere Lösung <Formel tex="a_2" /></>, erwartet: A10.a2 },
        ]}
        hilfen={[
          <>Berechne den Abstand von <Formel tex={t`Q(a\,|\,1\,|\,-1)`} /> zur Ebene mit der Abstandsformel. Im Zähler steht ein Term mit <Formel tex="a" nach="." /></>,
          <>Setze den Abstand gleich 1. Der Betrag liefert zwei Gleichungen.</>,
        ]}
        loesung={[
          <>Zähler: <Formel tex={t`|2\cdot a+(-1)\cdot 1+2\cdot(-1)-2|=|2a-5|`} nach="." /> Der Nenner ist <Formel tex={t`|\vec{n}|=3`} nach="." /></>,
          <>Gleichung: <Formel tex={t`\frac{|2a-5|}{3}=1`} nach="," /> also <Formel tex={t`|2a-5|=3`} nach="." /></>,
          <>Zwei Fälle: <Formel tex={t`2a-5=3`} /> ergibt <Formel tex={t`a=4`} nach="," /> und <Formel tex={t`2a-5=-3`} /> ergibt <Formel tex={t`a=1`} nach="." /> Beide Punkte liegen auf verschiedenen Seiten der Ebene: <Formel tex={t`Q(1\,|\,1\,|\,-1)`} /> und <Formel tex={t`Q(4\,|\,1\,|\,-1)`} nach="." /></>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={formTeX(E)} /> und der Punkt <Formel tex={t`Q(a\,|\,1\,|\,-1)`} nach="." /> Bestimme alle Werte von <Formel tex="a" nach="," /> für die <Formel tex="Q" /> von der Ebene <Formel tex="E" /> den Abstand 1 hat. Gib die kleinere Lösung zuerst an.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={11}
        titel="Messkugel an einer Wand"
        felder={[mitWert(dFeld('Abstand des Mittelpunkts in Metern'), A11.d), { id: 'k', name: 'Abstand der Kugeloberfläche von der Wand in Metern', beschriftung: <>Abstand der Kugel von der Wand</>, erwartet: A11.abstand }]}
        hilfen={[
          <>Der Abstand des Mittelpunkts <Formel tex="M" /> von der Wand ist der Abstand eines Punkts von einer Ebene.</>,
          <>Die Kugel ist näher an der Wand als ihr Mittelpunkt, und zwar um den Radius.</>,
        ]}
        loesung={[
          <>Abstand des Mittelpunkts: <Zeilen z={f11.zeilen} /></>,
          <>Die Kugeloberfläche ist um den Radius näher an der Wand: <Formel tex={t`3-1{,}2=1{,}8`} nach="." /> Die Kugel ist <Formel tex={t`1{,}8\ \text{m}`} /> von der Wand entfernt.</>,
        ]}
      >
        <p>
          Eine Wand liegt in der Ebene <Formel tex={formTeX(A11.k, 'E')} nach="." /> Eine Messkugel mit dem Mittelpunkt <Formel tex={punktTeX('M', A11.M)} /> und dem Radius <Formel tex={t`1{,}2\ \text{m}`} /> hängt davor. Eine Längeneinheit entspricht einem Meter. Bestimme den Abstand des Mittelpunkts von der Wand und den Abstand der Kugel von der Wand.
        </p>
      </Aufgabe>

      <Zeichenaufgabe
        nummer="12"
        titel="Stellung nehmen"
        kontrolle={<KontrollFigur spec={aufg12} unter={<>Die Gerade <Formel tex="g" /> durchstößt die Ebene im Punkt <Formel tex="S" nach="." /></>} />}
        hilfe={
          <>
            <p>
              Die Aussage stimmt nicht. Mit der Geradenprobe: <Zeilen z={p12} /> Aus <Formel tex={p12.gleichung} /> folgt <Formel tex={t`t=${A12.t}`} nach="." /> Die Gerade schneidet die Ebene im Punkt <Formel tex={punktTeX('S', A12.S)} nach="." /> Damit hat sie einen Punkt mit <Formel tex="E" /> gemeinsam und ihr Abstand ist 0, obwohl sie nicht in <Formel tex="E" /> liegt.
            </p>
            <p>Ein Abstand größer als 0 setzt voraus, dass die Gerade echt parallel zur Ebene ist.</p>
          </>
        }
      >
        <p>
          Mia sagt: „Die Gerade <Formel tex={gl(A12.g)} /> liegt nicht in der Ebene <Formel tex={formTeX(E)} nach="," /> also hat sie zu <Formel tex="E" /> einen Abstand größer als 0.“ Nimm Stellung zu Mias Aussage. Begründe mit einer Rechnung.
        </p>
      </Zeichenaufgabe>

      <Auswahlfrage
        nummer="13"
        titel="Die Rechnung zum Spiegelpunkt"
        optionen={platziere(
          [
            opt('a', <Formel tex={t`\overrightarrow{OQ'}=2\cdot\overrightarrow{OF}-\overrightarrow{OQ}`} />, true, <>Richtig. <Formel tex="F" /> ist die Mitte von <Formel tex={t`QQ'`} nach="," /> also <Formel tex={t`\overrightarrow{OF}=\frac{1}{2}\left(\overrightarrow{OQ}+\overrightarrow{OQ'}\right)`} nach="." /> Löse nach <Formel tex={t`\overrightarrow{OQ'}`} /> auf.</>),
            opt('b', <Formel tex={t`\overrightarrow{OQ'}=\overrightarrow{OQ}+t_0\cdot\vec{n}`} />, false, <>Das ist der Lotfußpunkt <Formel tex="F" nach="," /> der nur halb so weit geht. Der Spiegelpunkt braucht <Formel tex={t`2t_0`} nach="." /> Hier: <Formel tex={t`\overrightarrow{OF}=${spalteBruch(abstandPunktEbene(E, [2, 2, 3]).F)}`} nach="," /> nicht <Formel tex={t`Q'`} nach="." /></>),
            opt('c', <Formel tex={t`\overrightarrow{OQ'}=\overrightarrow{OQ}-2t_0\cdot\vec{n}`} />, false, <>Das Vorzeichen ist verkehrt. Von <Formel tex="Q" /> aus gelangt man mit <Formel tex={t`t_0\cdot\vec{n}`} /> zur Ebene und mit <Formel tex={t`2t_0\cdot\vec{n}`} /> auf die andere Seite. Mit <Formel tex={t`-2t_0`} /> läge der Punkt auf derselben Seite wie <Formel tex="Q" nach="," /> nur weiter weg. Hier ist <Formel tex={t`t_0=${w13.t}`} nach="." /></>),
            opt('d', <Formel tex={t`\overrightarrow{OQ'}=2\cdot\overrightarrow{OQ}-\overrightarrow{OF}`} />, false, <>Die Rollen von <Formel tex="Q" /> und <Formel tex="F" /> sind vertauscht. Das wäre der Punkt, der von <Formel tex="Q" /> so weit entfernt ist wie <Formel tex="F" nach="," /> aber auf der Seite von <Formel tex="Q" nach="." /></>),
          ],
          2,
        )}
        erklaerung={<>Der Spiegelpunkt liegt auf der Lotgeraden, so weit hinter der Ebene wie <Formel tex="Q" /> davor: <Formel tex={t`Q'=Q+2t_0\cdot\vec{n}=2F-Q`} nach="." /></>}
      >
        <p>
          <Formel tex="F" /> ist der Lotfußpunkt von <Formel tex="Q" /> auf die Ebene <Formel tex="E" /> und <Formel tex={t`t_0`} /> der Parameter von <Formel tex="F" /> auf der Lotgeraden durch <Formel tex="Q" nach="." /> Welche Gleichung liefert den Spiegelpunkt <Formel tex={t`Q'`} nach="?" />
        </p>
      </Auswahlfrage>
    </Abschnitt>
  );
}
