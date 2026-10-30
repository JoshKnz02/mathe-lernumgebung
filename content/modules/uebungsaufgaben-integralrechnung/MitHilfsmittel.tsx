import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { BE, Teile } from '@/components/Teilaufgaben';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_A8, BILD_A9, BILD_A9_WASSER, BILD_A10, BILD_A11, BILD_A11_FAHRZEUG, BILD_A12, BILD_A12_I } from './Bilder';
import { A10, A11, A12, A8, A9 } from './daten';

const TOL = 0.01;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl mit Komma an, auf zwei Nachkommastellen gerundet, ohne Einheit. Das Rechnen mit dem Taschenrechner ist erlaubt, Brüche und exakte Werte sind nicht verlangt. Rechne in den Zwischenschritten mit mehr Stellen, als du am Ende angibst.
    </Hinweis>
  );
}

/** Aufgabe 8: Exponentialfunktion, Fläche bis zur Grenze u, endlicher Flächeninhalt. */
function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Fläche unter einer Exponentialkurve"
      felder={[
        { id: 'a2', name: 'Flächeninhalt A von 2', beschriftung: <>Flächeninhalt <Formel tex="A(2)" /></>, erwartet: A8.A2, toleranz: TOL },
        { id: 'grenz', name: 'Grenzwert des Flächeninhalts', beschriftung: <>Grenzwert von <Formel tex="A(u)" /></>, erwartet: A8.grenz, toleranz: TOL },
        { id: 'u', name: 'Wert von u für neunzig Prozent', beschriftung: <><Formel tex="u" /></>, erwartet: A8.u, toleranz: TOL },
      ]}
      hilfen={[
        <>Eine Stammfunktion von <Formel tex={t`6\,\mathrm{e}^{-x/2}`} /> ist <Formel tex={t`-12\,\mathrm{e}^{-x/2}`} nach="." /> Prüfe sie durch Ableiten (Modul <Modulverweis modul="stammfunktionen">Stammfunktionen bestimmen</Modulverweis>).</>,
        <>Für <Formel tex="u\to\infty" /> geht <Formel tex={t`\mathrm{e}^{-u/2}`} /> gegen 0. Das Schaubild nähert sich der x-Achse so schnell, dass der Flächeninhalt nicht über alle Grenzen wächst.</>,
        <>Neunzig Prozent von 12 sind 10,8. Löse <Formel tex={t`12\left(1-\mathrm{e}^{-u/2}\right)=10{,}8`} /> mit dem natürlichen Logarithmus.</>,
      ]}
      loesung={[
        <>
          a: Eine Stammfunktion von <Formel tex="f" /> ist <Formel tex={t`F(x)=-12\,\mathrm{e}^{-x/2}`} nach="." /> Damit ist
          <Formel anzeige tex={t`A(u)=F(u)-F(0)`} />
          <Formel anzeige tex={t`{}=12-12\,\mathrm{e}^{-u/2}`} />
          <Formel anzeige tex={t`{}=12\left(1-\mathrm{e}^{-u/2}\right)`} nach="." />
          Für <Formel tex="u=2" /> ist <Formel tex={t`A(2)=12\,(1-\mathrm{e}^{-1})\approx 7{,}59`} nach="." />
          <FlaechenFigur daten={BILD_A8} unter={<>Die Fläche bis <Formel tex="u=4" nach="." /> Für <Formel tex="u=2" /> reicht sie nur bis zur Hälfte davon.</>} />
        </>,
        <>
          b: Für wachsendes <Formel tex="u" /> wird <Formel tex={t`\mathrm{e}^{-u/2}`} /> beliebig klein, aber nie null. Deshalb ist <Formel tex="A(u)" /> immer kleiner als 12 und nähert sich 12:
          <Formel anzeige tex={t`\lim_{u\to\infty}A(u)=12`} nach="." />
          Die nach rechts unbegrenzte Fläche hat also den endlichen Inhalt 12.
        </>,
        <>
          c: Aus <Formel tex={t`12\left(1-\mathrm{e}^{-u/2}\right)=10{,}8`} /> folgt <Formel tex={t`\mathrm{e}^{-u/2}=0{,}1`} nach="." /> Mit dem natürlichen Logarithmus ist
          <Formel anzeige tex={t`-\frac{u}{2}=\ln 0{,}1`} />
          <Formel anzeige tex={t`u=2\ln 10\approx 4{,}61`} nach="." />
        </>,
      ]}
    >
      <p>
        Gegeben ist die Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=6\,\mathrm{e}^{-x/2}`} /> für <Formel tex={t`x\ge 0`} nach="." /> Für <Formel tex="u>0" /> schließen <Formel tex="K_f" nach="," /> die Koordinatenachsen und die Gerade <Formel tex="x=u" /> eine Fläche mit dem Inhalt <Formel tex="A(u)" /> ein.
      </p>
      <Teile>
        <li>
          Berechnen Sie <Formel tex="A(2)" nach="." /> Zeigen Sie dazu zuerst, dass <Formel tex={t`A(u)=12\left(1-\mathrm{e}^{-u/2}\right)`} /> gilt. <BE n={4} />
        </li>
        <li>
          Begründen Sie, dass <Formel tex="A(u)" /> für alle <Formel tex="u>0" /> kleiner als eine feste Zahl bleibt, und geben Sie diese Zahl an. <BE n={3} />
        </li>
        <li>
          Bestimmen Sie <Formel tex="u" /> so, dass <Formel tex="A(u)" /> neunzig Prozent dieser Zahl beträgt. <BE n={3} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A8} unter={<>Das Schaubild von <Formel tex="f" /> mit der Fläche bis <Formel tex="u=4" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 9: Behälter als Rotationskörper, Volumen, Füllhöhe, Oberfläche des Wassers. */
function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Ein Behälter und sein Füllstand"
      felder={[
        { id: 'v', name: 'Volumen des Behälters in Kubikzentimetern', beschriftung: <>Volumen in <Formel tex={t`\text{cm}^3`} /></>, erwartet: A9.gesamt, toleranz: TOL },
        { id: 'h', name: 'Füllhöhe in Zentimetern', beschriftung: <>Füllhöhe in cm</>, erwartet: A9.h, toleranz: TOL },
        { id: 'a', name: 'Flächeninhalt der Wasseroberfläche in Quadratzentimetern', beschriftung: <>Oberfläche in <Formel tex={t`\text{cm}^2`} /></>, erwartet: A9.A8, toleranz: TOL },
      ]}
      hilfen={[
        <>Das Volumen eines Rotationskörpers um die x-Achse ist <Formel tex={t`V=\pi\int_{a}^{b}\bigl(q(x)\bigr)^2\,\mathrm{d}x`} nach="." /> Hier ist <Formel tex={t`q(x)^2=x+4`} nach="." /> (Modul <Modulverweis modul="rotationsvolumen">Rotationsvolumen</Modulverweis>).</>,
        <>Das Wasservolumen bis zur Höhe <Formel tex="h" /> ist <Formel tex={t`\pi\int_{0}^{h}(x+4)\,\mathrm{d}x=\pi\left(\frac{1}{2}h^2+4h\right)`} nach="." /> Setze es gleich 200 und löse die quadratische Gleichung.</>,
        <>Die Wasseroberfläche in der Höhe <Formel tex="h" /> ist eine Kreisscheibe mit dem Radius <Formel tex="q(h)" nach="." /></>,
      ]}
      loesung={[
        <>
          a: Der Behälter entsteht durch Rotation der Fläche unter <Formel tex="K_q" /> um die x-Achse. Mit <Formel tex={t`q(x)^2=x+4`} /> ist
          <Formel anzeige tex={t`V=\pi\int_{0}^{12}(x+4)\,\mathrm{d}x`} />
          <Formel anzeige tex={t`{}=\pi\left[\frac{1}{2}x^2+4x\right]_0^{12}`} />
          <Formel anzeige tex={t`{}=\pi\,(72+48)=120\pi`} />
          <Formel anzeige tex={t`{}\approx 376{,}99`} nach="." />
          Der Behälter fasst etwa 377 Kubikzentimeter.
          <FlaechenFigur daten={BILD_A9} unter={<>Die Seitenansicht des Behälters, der Radius wächst von 2 auf 4.</>} />
        </>,
        <>
          b: Das Wasservolumen bis zur Höhe <Formel tex="h" /> ist <Formel tex={t`V(h)=\pi\left(\frac{1}{2}h^2+4h\right)`} nach="." /> Aus <Formel tex={t`V(h)=200`} /> folgt
          <Formel anzeige tex={t`h^2+8h-\frac{400}{\pi}=0`} nach="." />
          Die positive Lösung ist
          <Formel anzeige tex={t`h=-4+\sqrt{16+\frac{400}{\pi}}`} />
          <Formel anzeige tex={t`{}\approx 7{,}97`} nach="." />
          Das Wasser steht etwa 7,97 Zentimeter hoch.
          <FlaechenFigur daten={BILD_A9_WASSER} unter={<>Das Wasser (blau) steht bis <Formel tex="h\approx 7{,}97" /> hoch, darüber ist der Behälter leer (gelb).</>} />
        </>,
        <>
          c: Die Oberfläche bei <Formel tex="h=8" /> ist ein Kreis mit dem Radius <Formel tex={t`q(8)=\sqrt{12}`} nach="." /> Sein Flächeninhalt ist
          <Formel anzeige tex={t`\pi\cdot q(8)^2=\pi\cdot 12=12\pi`} />
          <Formel anzeige tex={t`{}\approx 37{,}70`} nach="." />
        </>,
      ]}
    >
      <p>
        Ein Behälter steht aufrecht. Seine Wand entsteht, wenn das Schaubild <Formel tex="K_q" /> der Funktion <Formel tex="q" /> mit <Formel tex={t`q(x)=\sqrt{x+4}`} /> für <Formel tex={t`0\le x\le 12`} /> um die x-Achse rotiert. Dabei ist <Formel tex="x" /> die Höhe über dem Boden, eine Längeneinheit entspricht 1 cm.
      </p>
      <Teile>
        <li>
          Berechnen Sie das Volumen des Behälters. <BE n={4} />
        </li>
        <li>
          Bestimmen Sie die Füllhöhe, wenn der Behälter mit 200 Kubikzentimeter Wasser gefüllt wird. <BE n={4} />
        </li>
        <li>
          Berechnen Sie den Flächeninhalt der Wasseroberfläche bei der Füllhöhe 8 Zentimeter. <BE n={2} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A9} unter={<>Die Seitenansicht des Behälters.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 10: Zuflussrate und Bestand, Maximum der Rate, Zeitpunkt für eine Menge. */
function Aufgabe10() {
  return (
    <Aufgabe
      nummer="10"
      titel="Zufluss in einen Tank"
      felder={[
        { id: 'tmax', name: 'Zeitpunkt der größten Rate in Minuten', beschriftung: <>Zeitpunkt in min</>, erwartet: A10.tmax, toleranz: TOL },
        { id: 'rmax', name: 'größte Rate in Litern pro Minute', beschriftung: <>größte Rate</>, erwartet: A10.rmax, toleranz: TOL },
        { id: 'menge', name: 'Wassermenge in den ersten zehn Minuten in Litern', beschriftung: <>Menge in 10 min</>, erwartet: A10.menge10, toleranz: TOL },
        { id: 't1000', name: 'Zeitpunkt, zu dem 1000 Liter zugeflossen sind, in Minuten', beschriftung: <>Zeitpunkt für 1000 l</>, erwartet: A10.t1000, toleranz: TOL },
      ]}
      hilfen={[
        <>Die größte Rate liegt am Hochpunkt von <Formel tex="K_r" nach="." /> Leite mit der Produktregel ab: <Formel tex={t`r'(t)=100\,\mathrm{e}^{-t/4}\left(1-\frac{t}{4}\right)`} nach="." /></>,
        <>Die zugeflossene Menge ist das Integral der Rate. Mit <Formel tex={t`G(t)=1600-100\,(4t+16)\,\mathrm{e}^{-t/4}`} /> gilt <Formel tex={t`G'(t)=r(t)`} /> und <Formel tex="G(0)=0" nach="." /> Die Menge bis zur Zeit <Formel tex="t" /> ist also <Formel tex="G(t)" nach="." /></>,
        <>Löse <Formel tex={t`G(t)=1000`} /> mit dem Taschenrechner (Schnittpunkt der Schaubilder von <Formel tex="G" /> und <Formel tex="y=1000" nach=")." /></>,
      ]}
      loesung={[
        <>
          a: Mit <Formel tex={t`r'(t)=100\,\mathrm{e}^{-t/4}\left(1-\frac{t}{4}\right)`} /> ist <Formel tex={t`r'(t)=0`} /> für <Formel tex="t=4" nach="." /> Davor ist <Formel tex="r'" /> positiv, danach negativ, es ist ein Hochpunkt. Dort ist
          <Formel anzeige tex={t`r(4)=400\,\mathrm{e}^{-1}`} />
          <Formel anzeige tex={t`{}\approx 147{,}15`} nach="." />
          Nach 4 Minuten fließen mit etwa 147,15 Litern pro Minute am meisten zu.
        </>,
        <>
          b: Die Menge in den ersten zehn Minuten ist
          <Formel anzeige tex={t`\int_{0}^{10}r(t)\,\mathrm{d}t=G(10)-G(0)`} />
          <Formel anzeige tex={t`{}=1600-5600\,\mathrm{e}^{-2{,}5}`} />
          <Formel anzeige tex={t`{}\approx 1140{,}32`} nach="." />
          Es fließen etwa 1140,32 Liter zu.
          <FlaechenFigur daten={BILD_A10} unter={<>Die Fläche unter dem Schaubild von <Formel tex="r" /> von 0 bis 10 Minuten hat den Inhalt 1140,32 und ist die Wassermenge.</>} />
        </>,
        <>
          c: Die Gleichung <Formel tex={t`G(t)=1000`} /> bedeutet <Formel tex={t`(4t+16)\,\mathrm{e}^{-t/4}=6`} nach="." /> Der Taschenrechner liefert im Intervall <Formel tex="[0;\,20]" /> die Lösung
          <Formel anzeige tex={t`t\approx 8{,}47`} nach="." />
          Nach etwa 8,47 Minuten sind 1000 Liter zugeflossen.
        </>,
      ]}
    >
      <p>
        In einen Tank fließt Wasser. Die momentane Zuflussrate wird für <Formel tex={t`0\le t\le 20`} /> durch <Formel tex={t`r(t)=100\,t\,\mathrm{e}^{-t/4}`} /> beschrieben. Dabei ist <Formel tex="t" /> die Zeit in Minuten seit Beginn des Zuflusses und <Formel tex="r(t)" /> die Rate in Litern pro Minute. Zu Beginn ist der Tank leer.
      </p>
      <Teile>
        <li>
          Bestimmen Sie den Zeitpunkt, zu dem die Rate am größten ist, und diese Rate. <BE n={4} />
        </li>
        <li>
          Berechnen Sie die Wassermenge, die in den ersten zehn Minuten zufließt. <BE n={3} />
        </li>
        <li>
          Ermitteln Sie den Zeitpunkt, zu dem 1000 Liter zugeflossen sind. <BE n={3} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A10} unter={<>Das Schaubild der Zuflussrate <Formel tex="r" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 11: Querschnittsfläche, Volumen und größte Fahrzeughöhe in einem Tunnel. */
function Aufgabe11() {
  return (
    <Aufgabe
      nummer="11"
      titel="Querschnitt eines Tunnels"
      felder={[
        { id: 'a', name: 'Querschnittsfläche in Quadratmetern', beschriftung: <>Querschnitt in <Formel tex={t`\text{m}^2`} /></>, erwartet: A11.flaeche, toleranz: TOL },
        { id: 'v', name: 'Volumen des Tunnels in Kubikmetern', beschriftung: <>Volumen in <Formel tex={t`\text{m}^3`} /></>, erwartet: A11.volumen, toleranz: TOL },
        { id: 'h', name: 'größte Höhe des Fahrzeugs in Metern', beschriftung: <>größte Höhe in m</>, erwartet: A11.hoehe, toleranz: TOL },
      ]}
      hilfen={[
        <>Die Fläche liegt zwischen der Parabel und der x-Achse von <Formel tex="-5" /> bis <Formel tex="5" nach="." /> Wegen der Symmetrie darfst du von 0 bis 5 rechnen und verdoppeln.</>,
        <>Das Volumen eines Körpers mit gleichem Querschnitt ist Querschnittsfläche mal Länge.</>,
        <>Ein Fahrzeug der Breite 4 m, das mittig fährt, reicht von <Formel tex="x=-2" /> bis <Formel tex="x=2" nach="." /> Die Höhe ist durch die Parabel an den Rändern des Fahrzeugs begrenzt.</>,
      ]}
      loesung={[
        <>
          a: Mit der Stammfunktion <Formel tex={t`P(x)=5x-\frac{1}{15}x^3`} /> von <Formel tex="p" /> ist
          <Formel anzeige tex={t`A=P(5)-P(-5)`} />
          <Formel anzeige tex={t`{}=2\left(25-\frac{25}{3}\right)`} />
          <Formel anzeige tex={t`{}=\frac{100}{3}\approx 33{,}33`} nach="." />
          Die Querschnittsfläche beträgt etwa 33,33 Quadratmeter.
          <FlaechenFigur daten={BILD_A11} unter={<>Der Querschnitt des Tunnels, die Fläche hat den Inhalt <Formel tex={t`\frac{100}{3}`} nach="." /></>} />
        </>,
        <>
          b: Das Volumen ist Querschnittsfläche mal Länge:
          <Formel anzeige tex={t`V=\frac{100}{3}\cdot 120=4000`} nach="." />
          Der Tunnel hat ein Volumen von 4000 Kubikmetern.
        </>,
        <>
          c: Das Fahrzeug reicht von <Formel tex="x=-2" /> bis <Formel tex="x=2" nach="." /> An den Rändern ist die Tunnelhöhe <Formel tex={t`p(2)=5-0{,}2\cdot 4=4{,}2`} nach="." /> Das Fahrzeug darf höchstens 4,2 Meter hoch sein.
          <FlaechenFigur daten={BILD_A11_FAHRZEUG} unter={<>Die oberen Ecken des Rechtecks liegen auf der Parabel.</>} />
        </>,
      ]}
    >
      <p>
        Der Querschnitt eines geraden Tunnels wird durch die Fläche zwischen der x-Achse und dem Schaubild von <Formel tex={t`p(x)=5-0{,}2x^2`} /> für <Formel tex={t`-5\le x\le 5`} /> beschrieben. Eine Längeneinheit entspricht einem Meter. Der Tunnel ist 120 Meter lang.
      </p>
      <Teile>
        <li>
          Berechnen Sie den Inhalt der Querschnittsfläche. <BE n={3} />
        </li>
        <li>
          Berechnen Sie das Volumen des Tunnels. <BE n={1} />
        </li>
        <li>
          Bestimmen Sie die größte Höhe, die ein Fahrzeug mit rechteckigem Querschnitt der Breite 4 Meter haben darf, das mittig durch den Tunnel fährt. <BE n={2} />
        </li>
      </Teile>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A11} unter={<>Der Querschnitt des Tunnels.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 12: Aussagen am Schaubild von g und seiner Integralfunktion. */
function Frage12() {
  return (
    <Auswahlfrage
      nummer="12"
      titel="Aussagen zu Schaubild und Integralfunktion"
      optionen={platziere(
        [
          opt('a', <><Formel tex={t`\int_{-3}^{3}g(x)\,\mathrm{d}x>0`} /></>, false, <>Die Flächenstücke zwischen 1 und 3 und zwischen <Formel tex="-3" /> und <Formel tex="-1" /> liegen unterhalb der x-Achse und sind zusammen größer als das Stück zwischen <Formel tex="-1" /> und <Formel tex="1" nach="." /> Das Integral ist negativ, nämlich <Formel tex="-1{,}44" nach="." /></>),
          opt('b', <>Die Integralfunktion <Formel tex={t`I(x)=\int_{0}^{x}g(t)\,\mathrm{d}t`} /> ist auf <Formel tex="[0;\,3]" /> streng monoton wachsend.</>, false, <>Wegen <Formel tex="I'=g" /> wächst <Formel tex="I" /> nur dort, wo <Formel tex="g" /> positiv ist. Zwischen 1 und 3 ist <Formel tex="g" /> negativ, dort fällt <Formel tex="I" nach="." /></>),
          opt('c', <><Formel tex="I" /> hat an der Stelle <Formel tex="x=3" /> einen Hochpunkt.</>, false, <>Bei <Formel tex="x=3" /> wechselt <Formel tex="g" /> von negativen zu positiven Werten. Damit wechselt <Formel tex="I'" /> von <Formel tex="-" /> nach <Formel tex="+" nach="," /> das ist ein Tiefpunkt, kein Hochpunkt.</>),
          opt('d', <>Die Ableitung <Formel tex="g'" /> hat im Intervall <Formel tex="]-3;\,3[" /> genau drei Nullstellen.</>, true, <>Richtig. Das Schaubild hat in <Formel tex="]-3;\,3[" /> einen Hochpunkt bei <Formel tex="x=0" /> und zwei Tiefpunkte, einen links und einen rechts davon. An jedem ist die Tangente waagerecht.</>),
        ],
        3,
      )}
      erklaerung={
        <>
          Es ist <Formel tex={t`g(x)=0{,}05\,(x^2-9)(x^2-1)`} /> und damit <Formel tex={t`g'(x)=0{,}2\,x\,(x^2-5)`} nach="." /> Die Nullstellen von <Formel tex="g'" /> sind <Formel tex="x=0" /> und <Formel tex={t`x=\pm\sqrt{5}\approx\pm 2{,}24`} nach="," /> alle drei liegen in <Formel tex="]-3;\,3[" nach="." /> Die anderen Aussagen gelten nicht: <Formel tex={t`\int_{-3}^{3}g(x)\,\mathrm{d}x=-1{,}44`} nach="," /> und <Formel tex="I" /> fällt von <Formel tex="x=1" /> bis <Formel tex="x=3" nach="," /> weil <Formel tex={t`I'=g<0`} /> dort gilt. Bei <Formel tex="x=3" /> hat <Formel tex="I" /> deshalb einen Tiefpunkt, <Formel tex={t`I(3)=-0{,}72`} nach="."/>
          <FlaechenFigur daten={BILD_A12_I} unter={<>Das Schaubild von <Formel tex="I" nach=":" /> Hochpunkt bei <Formel tex="x=1" nach="," /> Tiefpunkt bei <Formel tex="x=3" nach="." /></>} />
        </>
      }
    >
      <p>
        Die Abbildung zeigt das Schaubild <Formel tex="K_g" /> einer Funktion <Formel tex="g" /> im Bereich <Formel tex={t`-4\le x\le 4`} nach="." /> Es ist symmetrisch zur y-Achse und schneidet die x-Achse bei <Formel tex="-3" nach="," /> <Formel tex="-1" nach="," /> <Formel tex="1" /> und <Formel tex="3" nach="." /> Die Integralfunktion <Formel tex="I" /> ist definiert durch <Formel tex={t`I(x)=\int_{0}^{x}g(t)\,\mathrm{d}t`} nach="." /> Welche der folgenden Aussagen ist wahr?
      </p>
      <FlaechenFigur daten={BILD_A12} unter={<>Das Schaubild von <Formel tex="g" nach="." /></>} />
    </Auswahlfrage>
  );
}

export function MitHilfsmittel() {
  return (
    <Abschnitt id="mit-hilfsmittel" titel="Mit Hilfsmittel">
      <p>
        Fünf längere Aufgaben, meist mit einem Sachzusammenhang. Der Taschenrechner ist erlaubt. Aufgabe 12 ist eine Auswahlfrage.
      </p>
      <Eingabehinweis />
      <Aufgabe8 />
      <Aufgabe9 />
      <Aufgabe10 />
      <Aufgabe11 />
      <Frage12 />
    </Abschnitt>
  );
}
