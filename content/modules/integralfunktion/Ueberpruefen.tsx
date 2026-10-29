import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import {
  BILD_ABLESEN_F,
  BILD_ABLESEN_I,
  BILD_HS_I,
  BILD_KAND_A,
  BILD_KAND_B,
  BILD_KAND_C,
  BILD_KAND_D,
  BILD_KNICK_F,
  BILD_KNICK_I,
  BILD_NULL_F,
  BILD_NULL_H,
  BILD_TABELLE_F,
  BILD_TABELLE_I,
  BILD_TANK_I,
  BILD_TANK_RATE,
  BILD_ZUORDNUNG_F,
} from './Bilder';
import { ABLESEN, GRENZE, HAUPTSATZ, TABELLE_I, TANK, ZAHLEN } from './daten';

const TOL = 0.01;
const mal = t`\frac{\ell}{\text{min}}`;
const integral = (von: string, bis: string, f: string, v = 't') => t`\int_{${von}}^{${bis}} ${f}\,\mathrm{d}${v}`;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>1,5</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{1}{4}`} nach=")" /> ein, ohne Einheit. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert.
    </Hinweis>
  );
}

function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Werte einer Integralfunktion"
      felder={[
        { id: 'x-4', name: 'I Null von minus 4', beschriftung: <><Formel tex={t`I_0(-4)`} /></>, erwartet: TABELLE_I.werte[0]! },
        { id: 'x-2', name: 'I Null von minus 2', beschriftung: <><Formel tex={t`I_0(-2)`} /></>, erwartet: TABELLE_I.werte[1]! },
        { id: 'x2', name: 'I Null von 2', beschriftung: <><Formel tex={t`I_0(2)`} /></>, erwartet: TABELLE_I.werte[2]! },
        { id: 'x4', name: 'I Null von 4', beschriftung: <><Formel tex={t`I_0(4)`} /></>, erwartet: TABELLE_I.werte[3]! },
        { id: 'x6', name: 'I Null von 6', beschriftung: <><Formel tex={t`I_0(6)`} /></>, erwartet: TABELLE_I.werte[4]! },
      ]}
      hilfen={[
        <>Zerlege die Fläche zwischen <Formel tex="K_f" /> und der x-Achse in Dreiecke und Trapeze. Flächen oberhalb der x-Achse zählen positiv, Flächen unterhalb negativ.</>,
        <>Für <Formel tex="x<0" /> liegt die obere Grenze links von der unteren, die Grenzen sind vertauscht: <Formel tex={t`I_0(x)=-\int_{x}^{0} f(t)\,\mathrm{d}t`} nach="." /></>,
        <>Die Funktionswerte sind <Formel tex="f(-4)=-3" nach="," /> <Formel tex="f(-2)=-2" nach="," /> <Formel tex="f(0)=-1" nach="," /> <Formel tex="f(2)=0" nach="," /> <Formel tex="f(4)=1" /> und <Formel tex="f(6)=2" nach="." /></>,
      ]}
      loesung={[
        <>
          Von <Formel tex="0" /> bis <Formel tex="2" /> liegt ein Dreieck mit Breite <Formel tex="2" /> und Höhe <Formel tex="1" /> unterhalb der x-Achse. Sein Inhalt ist <Formel tex="1" nach="," /> es zählt negativ: <Formel tex={t`I_0(2)=-1`} nach="." /> Von <Formel tex="2" /> bis <Formel tex="4" /> kommt ein Dreieck mit dem Inhalt <Formel tex="1" /> oberhalb dazu: <Formel tex={t`I_0(4)=-1+1=0`} nach="." /> Von <Formel tex="2" /> bis <Formel tex="6" /> ist das Dreieck oberhalb <Formel tex={t`\frac{1}{2}\cdot 4\cdot 2=4`} nach="," /> also <Formel tex={t`I_0(6)=-1+4=3`} nach="."/>
        </>,
        <>
          Für <Formel tex="x=-2" /> liegt zwischen <Formel tex="-2" /> und <Formel tex="0" /> ein Trapez mit den Höhen <Formel tex="2" /> und <Formel tex="1" /> unter der x-Achse. Sein Inhalt ist <Formel tex={t`\frac{2+1}{2}\cdot 2=3`} nach="," /> das Integral von <Formel tex="-2" /> bis <Formel tex="0" /> ist <Formel tex="-3" nach="." /> Mit vertauschten Grenzen ist <Formel tex={t`I_0(-2)=-(-3)=3`} nach="." /> Für <Formel tex="x=-4" /> ist das Trapez <Formel tex={t`\frac{3+1}{2}\cdot 4=8`} nach="," /> also <Formel tex={t`I_0(-4)=8`} nach="." />
          <Bild daten={BILD_TABELLE_I} unter={<>Orange: <Formel tex={t`I_0`} nach="," /> blau gestrichelt: <Formel tex="f" nach="." /> Die Punkte sind die Werte der Aufgabe. Der Tiefpunkt von <Formel tex={t`I_0`} /> liegt bei <Formel tex="x=2" nach="," /> der Nullstelle von <Formel tex="f" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=0{,}5x-1`} /> und die Integralfunktion <Formel tex={t`I_0(x)=\int_{0}^{x} f(t)\,\mathrm{d}t`} nach="." /> Bestimme die Werte <Formel tex={t`I_0(-4)`} nach="," /> <Formel tex={t`I_0(-2)`} nach="," /> <Formel tex={t`I_0(2)`} nach="," /> <Formel tex={t`I_0(4)`} /> und <Formel tex={t`I_0(6)`} nach="." />
      </p>
      <Bild daten={BILD_TABELLE_F} unter={<>Schaubild von <Formel tex="f" nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_TABELLE_I} unter={<>Die Integralfunktion <Formel tex={t`I_0`} /> (orange) mit den gesuchten Punkten.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Die untere Grenze wechseln"
      felder={[
        { id: 'i46', name: 'I Vier von 6', beschriftung: <><Formel tex={t`I_4(6)`} /></>, erwartet: GRENZE.i46 },
        { id: 'i4m1', name: 'I Vier von minus 1', beschriftung: <><Formel tex={t`I_4(-1)`} /></>, erwartet: GRENZE.i4m1 },
        { id: 'i42', name: 'I Vier von 2', beschriftung: <><Formel tex={t`I_4(2)`} /></>, erwartet: GRENZE.i42 },
        { id: 'integral', name: 'Integral von minus 1 bis 4', beschriftung: <><Formel tex={integral('-1', '4', 'f(t)')} /></>, erwartet: GRENZE.integral },
        { id: 'im16', name: 'I minus 1 von 6', beschriftung: <><Formel tex={t`I_{-1}(6)`} /></>, erwartet: GRENZE.im16 },
      ]}
      hilfen={[
        <>Für zwei untere Grenzen <Formel tex="a" /> und <Formel tex="b" /> gilt <Formel tex={t`I_b(x)=I_a(x)-I_a(b)`} nach="." /> Das folgt aus der Zerlegung <Formel tex={t`\int_{a}^{x}=\int_{a}^{b}+\int_{b}^{x}`} nach="." /></>,
        <>Die Integralfunktion <Formel tex={t`I_2`} /> hat bei <Formel tex="x=2" /> den Wert <Formel tex="0" nach="." /></>,
        <>Das Integral von <Formel tex="-1" /> bis <Formel tex="4" /> ist <Formel tex={t`I_2(4)-I_2(-1)`} nach="." /></>,
      ]}
      loesung={[
        <>Mit <Formel tex={t`I_b(x)=I_2(x)-I_2(b)`} /> und <Formel tex={t`I_2(4)=-3`} /> gilt <Formel tex={t`I_4(6)=I_2(6)-I_2(4)=1-(-3)=4`} nach="," /> <Formel tex={t`I_4(-1)=5-(-3)=8`} /> und <Formel tex={t`I_4(2)=0-(-3)=3`} nach="." /></>,
        <>Zerlegen: <Formel tex={t`I_2(4)=\int_{2}^{-1}+\int_{-1}^{4}`} /> bzw. <Formel tex={integral('-1', '4', 'f(t)') + t`=I_2(4)-I_2(-1)=-3-5=-8`} nach="." /></>,
        <>Für die untere Grenze <Formel tex="-1" /> gilt <Formel tex={t`I_{-1}(6)=I_2(6)-I_2(-1)=1-5=-4`} nach="." /> Alle Schaubilder dieser Integralfunktionen sind in y-Richtung gegeneinander verschoben.</>,
      ]}
    >
      <p>
        Von einer stetigen Funktion <Formel tex="f" /> kennst du nur drei Werte der Integralfunktion zur unteren Grenze <Formel tex="2" nach=":" /> <Formel tex={t`I_2(-1)=5`} nach="," /> <Formel tex={t`I_2(4)=-3`} /> und <Formel tex={t`I_2(6)=1`} nach="." /> Bestimme daraus <Formel tex={t`I_4(6)`} nach="," /> <Formel tex={t`I_4(-1)`} nach="," /> <Formel tex={t`I_4(2)`} nach="," /> <Formel tex={integral('-1', '4', 'f(t)')} /> und <Formel tex={t`I_{-1}(6)`} nach="." />
      </p>
    </Aufgabe>
  );
}

function Frage3() {
  const optionen = [
    opt('a', <>Schaubild A</>, false, <>Dieses Schaubild hat den Wert <Formel tex="0" /> bei <Formel tex="x=-1" nach="," /> aber bei <Formel tex="x=2" /> den Wert <Formel tex="-4{,}5" nach="." /> Es gehört zur unteren Grenze <Formel tex="-1" nach="." /> Gesucht ist die Nullstelle bei der unteren Grenze <Formel tex="2" nach="." /></>),
    opt('b', <>Schaubild B</>, true, <>Richtig.</>),
    opt('c', <>Schaubild C</>, false, <>Auch hier ist der Wert bei <Formel tex="x=2" /> gleich <Formel tex="0" nach="." /> Rechts von <Formel tex="x=2" /> ist <Formel tex="f" /> aber positiv, also muss die Integralfunktion dort steigen. Schaubild C fällt. Die Steigung von <Formel tex={t`I_2`} /> ist <Formel tex="f(x)" nach="," /> nicht <Formel tex="-f(x)" nach="." /></>),
    opt('d', <>Schaubild D</>, false, <>Die Form stimmt, es ist eine Stammfunktion von <Formel tex="f" nach="." /> Bei <Formel tex="x=2" /> ist der Wert aber nicht <Formel tex="0" nach="," /> sondern etwa <Formel tex="-3{,}3" nach="." /> Eine Integralfunktion zur unteren Grenze <Formel tex="2" /> hat dort die Nullstelle.</>),
  ];
  return (
    <Auswahlfrage
      nummer="3"
      titel="Welches Schaubild ist die Integralfunktion?"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            Die Integralfunktion <Formel tex={t`I_2`} /> hat bei <Formel tex="x=2" /> den Wert <Formel tex="0" nach="." /> Ihre Steigung ist <Formel tex="f(x)" nach="." /> Rechts von <Formel tex="x=2" /> ist <Formel tex="f" /> positiv, also steigt sie dort. Links davon ist <Formel tex="f" /> zwischen <Formel tex="-1" /> und <Formel tex="2" /> negativ, sie fällt bis <Formel tex="x=2" nach="." /> Bei <Formel tex="x=2" /> hat <Formel tex={t`I_2`} /> einen Tiefpunkt auf der x-Achse. Nur Schaubild B erfüllt beides.
          </p>
          <Bild daten={BILD_KAND_B} unter={<>Schaubild B mit dem Tiefpunkt auf der x-Achse bei <Formel tex="x=2" nach="." /></>} />
        </>
      }
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=x^2-x-2`} nach="." /> Welches der Schaubilder A bis D gehört zur Integralfunktion <Formel tex={t`I_2`} /> von <Formel tex="f" nach="?" />
      </p>
      <Bild daten={BILD_ZUORDNUNG_F} unter={<>Schaubild von <Formel tex="f" nach="." /></>} />
      <Bild daten={BILD_KAND_A} unter={<>Schaubild A</>} />
      <Bild daten={BILD_KAND_B} unter={<>Schaubild B</>} />
      <Bild daten={BILD_KAND_C} unter={<>Schaubild C</>} />
      <Bild daten={BILD_KAND_D} unter={<>Schaubild D</>} />
    </Auswahlfrage>
  );
}

function Frage4() {
  const optionen = [
    opt('ja', <>Ja, denn jede Stammfunktion von <Formel tex="f" /> ist eine Integralfunktion von <Formel tex="f" nach="." /></>, false, <>Das stimmt nicht. Eine Integralfunktion ist eine Stammfunktion mit einer Nullstelle bei der unteren Grenze. Eine Stammfunktion ohne Nullstelle ist keine Integralfunktion.</>),
    opt('nein-ursprung', <>Nein, denn <Formel tex="K_h" /> geht nicht durch den Ursprung.</>, false, <>Eine Integralfunktion muss nicht durch den Ursprung gehen. Sie hat nur bei ihrer unteren Grenze <Formel tex="a" /> den Wert <Formel tex="0" nach="," /> und das kann jede Stelle sein.</>),
    opt('null', <>Ja, mit der unteren Grenze <Formel tex="a=0" nach="," /> denn bei <Formel tex="x=0" /> hat <Formel tex="K_h" /> den Wert <Formel tex="1" nach="." /></>, false, <>Für <Formel tex="a=0" /> müsste <Formel tex={t`I_0(0)=0`} /> sein. Hier ist <Formel tex={t`h(0)=1`} nach="." /></>),
    opt('nein', <>Nein, denn <Formel tex="K_h" /> hat keine Nullstelle, jede Integralfunktion hat aber bei ihrer unteren Grenze eine.</>, true, <>Richtig.</>),
  ];
  return (
    <Auswahlfrage
      nummer="4"
      titel="Kann eine Stammfunktion eine Integralfunktion sein?"
      optionen={platziere(optionen, 3)}
      erklaerung={
        <>
          <p>
            Für die Integralfunktion <Formel tex={t`I_a`} /> gilt <Formel tex={t`I_a(a)=\int_{a}^{a} f(t)\,\mathrm{d}t=0`} nach="." /> Sie hat also bei <Formel tex="a" /> eine Nullstelle. <Formel tex="K_h" /> liegt ganz oberhalb der x-Achse, der kleinste Wert ist <Formel tex="0{,}75" nach="." /> Es gibt keine Stelle <Formel tex="a" /> mit <Formel tex="h(a)=0" nach="." /> Also ist <Formel tex="h" /> eine Stammfunktion von <Formel tex="f" nach="," /> aber keine Integralfunktion.
          </p>
          <Bild daten={BILD_NULL_H} unter={<>Die Stammfunktion <Formel tex="h" /> hat keine Nullstelle.</>} />
        </>
      }
    >
      <p>
        <Formel tex="K_h" /> (blau, gestrichelt) ist das Schaubild einer Stammfunktion <Formel tex="h" /> von <Formel tex="f" /> (orange). Kann <Formel tex="K_h" /> das Schaubild einer Integralfunktion von <Formel tex="f" /> sein?
      </p>
      <Bild daten={BILD_NULL_F} unter={<>Schaubild von <Formel tex="f" nach="." /></>} />
      <Bild daten={BILD_NULL_H} unter={<>Schaubild von <Formel tex="h" nach="." /></>} />
    </Auswahlfrage>
  );
}

function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Bestand im Tank"
      felder={[
        { id: 't', name: 'Zeitpunkt des größten Bestands in Minuten', beschriftung: <>Zeitpunkt in min</>, erwartet: TANK.tMax },
        { id: 'bmax', name: 'größter Bestand in Litern', beschriftung: <>größter Bestand in <Formel tex={t`\ell`} /></>, erwartet: TANK.bMax },
        { id: 'b10', name: 'Bestand nach 10 Minuten in Litern', beschriftung: <>Bestand bei <Formel tex="t=10" /> in <Formel tex={t`\ell`} /></>, erwartet: TANK.b10 },
        { id: 'aend', name: 'Wert von I Null von 10 in Litern', beschriftung: <><Formel tex={t`I_0(10)`} /> in <Formel tex={t`\ell`} /></>, erwartet: TANK.aenderung },
      ]}
      hilfen={[
        <>Der Bestand steigt, solange die Rate positiv ist, und fällt, solange sie negativ ist. Am größten ist er dort, wo die Rate von positiv nach negativ wechselt.</>,
        <>Die Rate fällt zwischen <Formel tex="t=2" /> und <Formel tex="t=6" /> geradlinig von <Formel tex="6" /> auf <Formel tex="-2" nach="." /> Berechne ihre Nullstelle. Bestimme dann die Flächen von <Formel tex="0" /> bis zu dieser Stelle.</>,
        <>Es gilt <Formel tex={t`B(t)=150+I_0(t)`} nach="." /></>,
      ]}
      loesung={[
        <>Zwischen <Formel tex="t=2" /> und <Formel tex="t=6" /> fällt die Rate in <Formel tex="4" /> Minuten um <Formel tex="8" nach="," /> also um <Formel tex="2" /> pro Minute. Von <Formel tex="6" /> bis <Formel tex="0" /> braucht sie <Formel tex={t`\frac{6}{2}=3`} /> Minuten, die Nullstelle liegt bei <Formel tex="t=2+3=5" nach="." /> Dort wechselt die Rate von positiv nach negativ, der Bestand ist am größten.</>,
        <>Fläche von <Formel tex="0" /> bis <Formel tex="2" nach=":" /> Rechteck <Formel tex={t`2\cdot 6=12`} nach="." /> Von <Formel tex="2" /> bis <Formel tex="5" nach=":" /> Dreieck <Formel tex={t`\frac{1}{2}\cdot 3\cdot 6=9`} nach="." /> Also <Formel tex={t`I_0(5)=21`} /> und <Formel tex={t`B(5)=150+21=171`} nach="." /></>,
        <>
          Von <Formel tex="5" /> bis <Formel tex="6" /> kommt ein Dreieck unterhalb dazu: <Formel tex={t`-\frac{1}{2}\cdot 1\cdot 2=-1`} nach="." /> Von <Formel tex="6" /> bis <Formel tex="10" nach=":" /> Rechteck <Formel tex={t`-4\cdot 2=-8`} nach="." /> Dann ist <Formel tex={t`I_0(10)=21-1-8=12`} /> und <Formel tex={t`B(10)=150+12=162`} nach="." />
          <Bild daten={BILD_TANK_I} unter={<>Die Integralfunktion <Formel tex={t`I_0`} /> mit dem Hochpunkt bei <Formel tex="t=5" /> und dem Wert <Formel tex="21" nach="." /> Der Bestand ist <Formel tex={t`150+I_0(t)`} nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Ein Tank enthält zu Beginn <Formel tex={t`150\,\ell`} nach="." /> Das Schaubild zeigt die Änderungsrate des Bestands in <Formel tex={mal} nach="." /> Die Rate ist in den ersten zwei Minuten konstant, fällt dann gleichmäßig bis <Formel tex="t=6" /> auf <Formel tex="-2" /> und bleibt bis <Formel tex="t=10" /> konstant. Die Bestandsfunktion ist <Formel tex={t`B(t)=150+I_0(t)`} nach="." /> Bestimme den Zeitpunkt des größten Bestands, den größten Bestand, den Bestand bei <Formel tex="t=10" /> und den Wert <Formel tex={t`I_0(10)`} nach="." />
      </p>
      <FlaechenFigur daten={BILD_TANK_RATE} unter={<>Änderungsrate des Tanks in <Formel tex={mal} nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_TANK_I} unter={<>Die Integralfunktion <Formel tex={t`I_0`} nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Eigenschaften ablesen, ohne zu rechnen"
      felder={[
        { id: 'm2', name: 'Steigung von I a an der Stelle 2', beschriftung: <>Steigung bei <Formel tex="x=2" /></>, erwartet: ABLESEN.i2 },
        { id: 'm4', name: 'Steigung von I a an der Stelle 4', beschriftung: <>Steigung bei <Formel tex="x=4" /></>, erwartet: ABLESEN.i4 },
        { id: 'hoch', name: 'Stelle des Hochpunkts', beschriftung: <>Stelle des Hochpunkts</>, erwartet: ABLESEN.hoch },
        { id: 'tief', name: 'Stelle des Tiefpunkts', beschriftung: <>Stelle des Tiefpunkts</>, erwartet: ABLESEN.tief },
        { id: 'wende', name: 'Stelle des Wendepunkts', beschriftung: <>Stelle des Wendepunkts</>, erwartet: ABLESEN.wende },
        { id: 'steil', name: 'größte Steigung', beschriftung: <>größte Steigung</>, erwartet: ABLESEN.steil },
      ]}
      hilfen={[
        <>Für jede Integralfunktion gilt <Formel tex={t`I_a'(x)=f(x)`} nach="." /> Die Steigung von <Formel tex={t`I_a`} /> an einer Stelle ist also der Funktionswert von <Formel tex="f" nach="." /></>,
        <>Ein Hochpunkt von <Formel tex={t`I_a`} /> liegt dort, wo <Formel tex="f" /> von positiv nach negativ wechselt, ein Tiefpunkt dort, wo <Formel tex="f" /> von negativ nach positiv wechselt.</>,
        <>Die Steigung von <Formel tex={t`I_a`} /> ist am größten, wo <Formel tex="f" /> seinen größten Wert annimmt. Dort hat <Formel tex={t`I_a`} /> den Wendepunkt.</>,
      ]}
      loesung={[
        <>Aus dem Schaubild liest du <Formel tex="f(2)=3" /> und <Formel tex="f(4)=-5" /> ab. Also hat <Formel tex={t`I_a`} /> bei <Formel tex="x=2" /> die Steigung <Formel tex="3" /> und bei <Formel tex="x=4" /> die Steigung <Formel tex="-5" nach="." /></>,
        <>Die Nullstellen von <Formel tex="f" /> liegen bei <Formel tex="x=-1" /> (von negativ nach positiv) und <Formel tex="x=3" /> (von positiv nach negativ). Also hat <Formel tex={t`I_a`} /> bei <Formel tex="x=-1" /> den Tiefpunkt und bei <Formel tex="x=3" /> den Hochpunkt.</>,
        <>
          <Formel tex="f" /> hat bei <Formel tex="x=1" /> den Hochpunkt mit dem Wert <Formel tex="4" nach="." /> Dort ist das Schaubild von <Formel tex={t`I_a`} /> am steilsten, der Wendepunkt liegt bei <Formel tex="x=1" /> und die größte Steigung ist <Formel tex="4" nach="." />
          <Bild daten={BILD_ABLESEN_I} unter={<>Eine Integralfunktion von <Formel tex="f" nach="," /> hier zur unteren Grenze <Formel tex="0" nach="." /> Die untere Grenze ändert nur die Höhe, nicht die Stellen.</>} />
        </>,
      ]}
    >
      <p>
        Von einer Funktion <Formel tex="f" /> ist nur das Schaubild gegeben. <Formel tex={t`I_a`} /> ist eine Integralfunktion von <Formel tex="f" /> (die untere Grenze <Formel tex="a" /> ist nicht bekannt, sie wird nicht gebraucht). Bestimme die Steigung von <Formel tex={t`K_{I_a}`} /> bei <Formel tex="x=2" /> und <Formel tex="x=4" nach="," /> die Stellen von Hochpunkt, Tiefpunkt und Wendepunkt von <Formel tex={t`K_{I_a}`} /> und die größte Steigung von <Formel tex={t`K_{I_a}`} nach="." />
      </p>
      <Bild daten={BILD_ABLESEN_F} unter={<>Schaubild von <Formel tex="f" nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_ABLESEN_I} unter={<>Eine Integralfunktion von <Formel tex="f" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage7() {
  const optionen = [
    opt('a', <Formel tex={integral('1', '3', 'f(t)')} />, false, <>Die Grenzen sind feste Zahlen. Das Integral ist eine Zahl, hier <Formel tex="10" nach="." /></>),
    opt('c', <Formel tex={integral('0', '2', 'f(x)', 'x')} />, false, <>Auch hier sind beide Grenzen Zahlen. Das Integral ist eine Zahl, hier <Formel tex="0" nach="." /> Der Name der Integrationsvariablen ändert daran nichts.</>),
    opt('b', <Formel tex={integral('1', 'x', 'f(t)')} />, true, <>Richtig.</>),
    opt('d', <Formel tex={integral('-1', '1', 'f(t)')} />, false, <>Beide Grenzen sind Zahlen. Das Integral ist eine Zahl, hier <Formel tex="2" nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="7"
      titel="Zahl oder Funktion?"
      optionen={optionen}
      erklaerung={
        <p>
          Ein bestimmtes Integral mit zwei festen Grenzen ist eine <strong>Zahl</strong>: <Formel tex={integral('1', '3', 'f(t)') + '=10'} nach="," /> <Formel tex={integral('0', '2', 'f(x)', 'x') + '=0'} nach="," /> <Formel tex={integral('-1', '1', 'f(t)') + '=2'} nach="." /> Nur wenn eine Grenze die Variable <Formel tex="x" /> ist, entsteht eine <strong>Funktion</strong> von <Formel tex="x" nach="." /> Zu jedem <Formel tex="x" /> gehört dann ein anderer Wert, zum Beispiel <Formel tex={t`I_1(3)=10`} /> und <Formel tex={t`I_1(1)=0`} nach="." />
        </p>
      }
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=3x^2-4x`} nach="." /> Welcher der folgenden Ausdrücke steht für eine <em>Funktion</em> von <Formel tex="x" nach="," /> nicht für eine Zahl?
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Mit dem Hauptsatz rechnen"
      felder={[
        { id: 'i13', name: 'Integral von 1 bis 3', beschriftung: <><Formel tex={integral('1', '3', 'f(x)', 'x')} /></>, erwartet: HAUPTSATZ.i13 },
        { id: 'c', name: 'Zahl c in I Eins von x gleich x hoch drei minus zwei x Quadrat plus c', beschriftung: <><Formel tex="c" /></>, erwartet: HAUPTSATZ.c },
        { id: 'im1', name: 'I Eins von minus 1', beschriftung: <><Formel tex={t`I_1(-1)`} /></>, erwartet: HAUPTSATZ.i1m1 },
        { id: 'b', name: 'Stelle b größer als 1 mit I Eins von b gleich 0', beschriftung: <><Formel tex="b" /> mit <Formel tex={t`b>1`} /> und <Formel tex={t`I_1(b)=0`} /></>, erwartet: HAUPTSATZ.nullstelle, toleranz: TOL },
      ]}
      hilfen={[
        <>Der zweite Hauptsatz sagt <Formel tex={integral('a', 'b', 'f(x)', 'x') + '=F(b)-F(a)'} nach="." /> Setze die Werte von <Formel tex="F" /> ein.</>,
        <>Es gilt <Formel tex={t`I_1(x)=F(x)-F(1)`} nach="." /> Berechne <Formel tex="F(1)" nach="." /></>,
        <>Löse <Formel tex={t`x^3-2x^2+1=0`} nach="." /> Eine Lösung kennst du schon, denn <Formel tex={t`I_1(1)=0`} nach="." /> Spalte den Faktor <Formel tex="(x-1)" /> ab und löse die quadratische Gleichung.</>,
      ]}
      loesung={[
        <>
          Probe: <Formel tex={t`F'(x)=3x^2-4x=f(x)`} nach="." /> Dann ist
          <Formel anzeige tex={t`\int_{1}^{3} f(x)\,\mathrm{d}x=F(3)-F(1)`} />
          <Formel anzeige tex={t`{}=(27-18)-(1-2)=10`} nach="." />
        </>,
        <>Es ist <Formel tex={t`F(1)=1-2=-1`} nach="," /> also <Formel tex={t`I_1(x)=F(x)-F(1)=x^3-2x^2+1`} nach="." /> Daher ist <Formel tex="c=1" nach="." /> Außerdem ist <Formel tex={t`I_1(-1)=-1-2+1=-2`} nach="." /></>,
        <>
          Aus <Formel tex={t`x^3-2x^2+1=(x-1)(x^2-x-1)=0`} /> folgen <Formel tex="x=1" /> und <Formel tex={t`x^2-x-1=0`} nach="." /> Die Lösungen der quadratischen Gleichung sind <Formel tex={t`x=\frac{1\pm\sqrt{5}}{2}`} nach="," /> also etwa <Formel tex="1{,}618" /> und <Formel tex="-0{,}618" nach="." /> Mit <Formel tex={t`b>1`} /> ist <Formel tex={t`b=\frac{1+\sqrt{5}}{2}\approx 1{,}62`} nach="." />
          <Bild daten={BILD_HS_I} unter={<>Die Integralfunktion <Formel tex={t`I_1`} /> mit den Nullstellen bei <Formel tex="x=1" /> und <Formel tex="x\approx 1{,}62" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=3x^2-4x`} nach="." /> Die Funktion <Formel tex={t`F(x)=x^3-2x^2`} /> ist eine Stammfunktion von <Formel tex="f" nach="." /> Bestimme <Formel tex={integral('1', '3', 'f(x)', 'x')} nach="." /> Die Integralfunktion zur unteren Grenze <Formel tex="1" /> lässt sich als <Formel tex={t`I_1(x)=x^3-2x^2+c`} /> schreiben: Bestimme <Formel tex="c" /> und den Wert <Formel tex={t`I_1(-1)`} nach="." /> Bestimme außerdem die Stelle <Formel tex="b" /> mit <Formel tex={t`b>1`} nach="," /> für die <Formel tex={t`I_1(b)=0`} /> gilt.
      </p>
    </Aufgabe>
  );
}

function Frage9() {
  const optionen = [
    opt('knick', <><Formel tex={t`I_a`} /> hat bei <Formel tex="x=0" /> ebenfalls einen Knick, weil <Formel tex="f" /> dort einen Knick hat.</>, false, <>Die Steigung von <Formel tex={t`I_a`} /> ist <Formel tex="f(x)" nach="." /> Bei <Formel tex="x=0" /> ist <Formel tex="f" /> stetig, die Steigung ändert sich also nicht sprunghaft. <Formel tex={t`K_{I_a}`} /> verläuft dort glatt. Nur die Krümmung ändert sich an dieser Stelle schlagartig.</>),
    opt('hauptsatz', <>Der Hauptsatz ist hier nicht anwendbar, weil <Formel tex="f" /> bei <Formel tex="x=0" /> nicht differenzierbar ist. Es gibt keine Tangente.</>, false, <>Der Hauptsatz verlangt nur, dass <Formel tex="f" /> <em>stetig</em> ist, nicht dass sie differenzierbar ist. Ein Knick stört nicht.</>),
    opt('richtig', <><Formel tex={t`I_a`} /> ist bei <Formel tex="x=0" /> differenzierbar mit <Formel tex={t`I_a'(0)=f(0)=2`} nach="." /></>, true, <>Richtig.</>),
    opt('f-strich', <><Formel tex={t`I_a'(0)`} /> gibt es nicht, weil <Formel tex={t`f'(0)`} /> nicht existiert.</>, false, <>Das verwechselt <Formel tex="f" /> mit <Formel tex={t`f'`} nach="." /> Die Ableitung von <Formel tex={t`I_a`} /> ist <Formel tex="f" nach="," /> nicht <Formel tex={t`f'`} nach="." /> Sie existiert, weil <Formel tex="f" /> stetig ist.</>),
  ];
  return (
    <Auswahlfrage
      nummer="9"
      titel="Knick in f, was folgt für I?"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Der erste Hauptsatz verlangt, dass <Formel tex="f" /> stetig ist. Das Schaubild der Funktion hat einen Knick, ist aber stetig. Deshalb ist <Formel tex={t`I_a`} /> an jeder Stelle differenzierbar mit <Formel tex={t`I_a'(x)=f(x)`} nach="." /> Bei <Formel tex="x=0" /> ist die Steigung von <Formel tex={t`K_{I_a}`} /> gleich <Formel tex="f(0)=2" nach="." /> Hätte <Formel tex="f" /> dagegen einen <em>Sprung</em>, hätte <Formel tex={t`K_{I_a}`} /> dort einen Knick.
          </p>
          <Bild daten={BILD_KNICK_I} unter={<>Die Integralfunktion zur unteren Grenze <Formel tex="-2" /> hat keinen Knick.</>} />
        </>
      }
    >
      <p>
        Die Funktion <Formel tex="f" /> ist stetig und hat bei <Formel tex="x=0" /> einen Knick, es ist <Formel tex="f(0)=2" nach="." /> <Formel tex={t`I_a`} /> ist eine Integralfunktion von <Formel tex="f" nach="." /> Welche Aussage über <Formel tex={t`I_a`} /> an der Stelle <Formel tex="x=0" /> ist richtig?
      </p>
      <Bild daten={BILD_KNICK_F} unter={<>Schaubild von <Formel tex="f" /> mit einem Knick bei <Formel tex="x=0" nach="." /></>} />
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Die Aufgaben 1 und 2 üben die Integralfunktion als Funktion, 3 und 4 die Schaubilder, 5 den Bestand, 6 den Zusammenhang zwischen <Formel tex="f" /> und <Formel tex={t`I_a`} nach="," /> 7 die Schreibweise, 8 den Hauptsatz und 9 die Stetigkeit.
      </p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Aufgabe2 />
      <Frage3 />
      <Frage4 />
      <Aufgabe5 />
      <Aufgabe6 />
      <Frage7 />
      <Aufgabe8 />
      <Frage9 />
    </Abschnitt>
  );
}
