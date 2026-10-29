import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_AUFGABE2, BILD_AUFGABE3, BILD_AUFGABE4, BILD_AUFGABE5, BILD_AUFGABE6A, BILD_AUFGABE6B, BILD_AUFGABE7, BILD_F1, BILD_F8 } from './Bilder';
import { AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE5, AUFGABE6, AUFGABE7 } from './daten';

const TOL = 0.01;
const integral = (von: string, bis: string, f = 'f(x)') => t`\int_{${von}}^{${bis}} ${f}\,\mathrm{d}x`;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>5,09</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{64}{3}`} nach=")" /> ein, ohne Einheit. Vielfache von <Formel tex="\pi" /> schreibst du mit dem Zeichen <Formel tex="\pi" /> oder als <code>pi</code>. Bei den Aufgaben mit Taschenrechner genügt die Rundung auf zwei Nachkommastellen.
    </Hinweis>
  );
}

function Frage1() {
  return (
    <Auswahlfrage
      nummer="1"
      titel="Welcher Ausdruck gibt den Flächeninhalt an?"
      optionen={platziere(
        [
          opt('a', <Formel tex={integral('0', '3')} />, false, <>Das ist das Integral von 0 bis 3. Der Teil von <Formel tex="K_f" /> rechts von 2 liegt unterhalb der x-Achse und zählt dort negativ. Das Integral ist also kleiner als der Flächeninhalt.</>),
          opt('b', <Formel tex={t`${integral('0', '2')}+${integral('2', '3')}`} />, false, <>Das Intervall ist hier zwar an der Nullstelle geteilt, die Teile werden aber mit ihren Vorzeichen addiert. Das ergibt wieder das Integral von 0 bis 3 und nicht den Flächeninhalt.</>),
          opt('c', <Formel tex={t`${integral('0', '2')}-${integral('2', '3')}`} />, true, <>Richtig. Das Integral von 2 bis 3 ist negativ, mit dem Minuszeichen davor wird sein Betrag addiert.</>),
          opt('d', <Formel tex={t`${integral('2', '0')}+${integral('2', '3')}`} />, false, <>Hier sind die Vorzeichen vertauscht: Der erste Teil ist negativ, der zweite auch. Der Ausdruck ergibt den Flächeninhalt mit einem Minuszeichen.</>),
        ],
        2,
      )}
      erklaerung={
        <>
          <Formel tex={t`f(x)=8-2x^2`} /> hat die Nullstelle 2. Auf <Formel tex="[0;\,2]" /> ist <Formel tex="f" /> positiv, auf <Formel tex="[2;\,3]" /> negativ. Der Flächeninhalt ist
          <Formel anzeige tex={t`A=${integral('0', '2')}`} />
          <Formel anzeige tex={t`{}-${integral('2', '3')}`} />
          <Formel anzeige tex={t`{}=\frac{32}{3}+\frac{14}{3}`} />
          <Formel anzeige tex={t`{}=\frac{46}{3}`} nach="." />
          <FlaechenFigur daten={BILD_F1} unter={<>Die Zahlen im Bild sind die Integrale der beiden Teile. Der Flächeninhalt ist die Summe ihrer Beträge.</>} />
        </>
      }
    >
      <p>
        <Formel tex={t`f(x)=8-2x^2`} /> hat die Nullstelle <Formel tex="x=2" nach="." /> Gesucht ist der Flächeninhalt <Formel tex="A" /> der Fläche, die <Formel tex="K_f" /> mit der x-Achse und den Geraden <Formel tex="x=0" /> und <Formel tex="x=3" /> einschließt. Welcher Ausdruck ist richtig?
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Mehrere Nullstellen"
      felder={[
        { id: 'n1', name: 'kleinste Nullstelle', beschriftung: <>kleinste Nullstelle</>, erwartet: AUFGABE2.nullstellen[0]! },
        { id: 'n2', name: 'mittlere Nullstelle', beschriftung: <>mittlere Nullstelle</>, erwartet: AUFGABE2.nullstellen[1]! },
        { id: 'n3', name: 'größte Nullstelle', beschriftung: <>größte Nullstelle</>, erwartet: AUFGABE2.nullstellen[2]! },
        { id: 'integral', name: 'Wert des Integrals von 0 bis 5', beschriftung: <>Wert des Integrals</>, erwartet: AUFGABE2.integral },
        { id: 'flaeche', name: 'Flächeninhalt', beschriftung: <>Flächeninhalt</>, erwartet: AUFGABE2.flaeche },
      ]}
      hilfen={[
        <>Klammere <Formel tex="x" /> aus und löse die übrig bleibende quadratische Gleichung.</>,
        <>Eine Stammfunktion ist <Formel tex={t`F(x)=\frac{1}{4}x^4-2x^3+\frac{5}{2}x^2`} nach="." /> Prüfe sie durch Ableiten.</>,
        <>Das Schaubild verläuft zwischen 0 und 1 oberhalb der x-Achse und zwischen 1 und 5 unterhalb. Berechne die beiden Integrale getrennt und addiere ihre Beträge.</>,
      ]}
      loesung={[
        <>
          Ausklammern: <Formel tex={t`f(x)=x\left(x^2-6x+5\right)=x(x-1)(x-5)`} nach="." /> Die Nullstellen sind <Formel tex="0" nach="," /> <Formel tex="1" /> und <Formel tex="5" nach="." />
        </>,
        <>
          Stammfunktion: <Formel tex={t`F(x)=\frac{1}{4}x^4-2x^3+\frac{5}{2}x^2`} nach="." /> Es gilt <Formel tex="F(0)=0" nach="," /> <Formel tex={t`F(1)=\frac{1}{4}-2+\frac{5}{2}=\frac{3}{4}`} /> und <Formel tex={t`F(5)=\frac{625}{4}-250+\frac{125}{2}=-\frac{125}{4}`} nach="." />
        </>,
        <>
          Das Integral von 0 bis 5 ist <Formel tex={t`F(5)-F(0)=-\frac{125}{4}=-31{,}25`} nach="." />
        </>,
        <>
          Teile an den Nullstellen: <Formel tex={t`${integral('0', '1')}=F(1)-F(0)=\frac{3}{4}`} /> (oberhalb) und <Formel tex={t`${integral('1', '5')}=F(5)-F(1)=-\frac{125}{4}-\frac{3}{4}=-32`} /> (unterhalb).
          <Formel anzeige tex={t`A=\frac{3}{4}+32`} />
          <Formel anzeige tex={t`{}=\frac{131}{4}`} />
          <Formel anzeige tex={t`{}=32{,}75`} nach="." />
          Das Integral allein ist nicht der Flächeninhalt, weil der große Teil unterhalb der x-Achse negativ zählt.
          <FlaechenFigur daten={BILD_AUFGABE2} unter={<>Zwei Teilflächen: <Formel tex="0{,}75" /> oberhalb, <Formel tex="32" /> unterhalb der x-Achse.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=x^3-6x^2+5x`} nach="." /> Bestimme die Nullstellen von <Formel tex="f" nach="," /> berechne das Integral <Formel tex={integral('0', '5')} /> und bestimme den Flächeninhalt der Fläche, die <Formel tex="K_f" /> mit der x-Achse einschließt.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE2} unter={<>Das Schaubild von <Formel tex="f" /> mit den Teilflächen.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Sinusfunktion auf einem Intervall"
      felder={[
        { id: 'null', name: 'Nullstelle im Inneren des Intervalls', beschriftung: <>Nullstelle im Intervall</>, erwartet: AUFGABE3.nullstelle },
        { id: 'integral', name: 'Wert des Integrals', beschriftung: <>Wert des Integrals</>, erwartet: AUFGABE3.integral },
        { id: 'flaeche', name: 'Flächeninhalt', beschriftung: <>Flächeninhalt</>, erwartet: AUFGABE3.flaeche },
      ]}
      hilfen={[
        <>Auf <Formel tex={t`\left]0;\,\frac{3\pi}{2}\right[`} /> hat der Sinus genau eine Nullstelle.</>,
        <>Eine Stammfunktion von <Formel tex={t`2\sin x`} /> ist <Formel tex={t`-2\cos x`} nach="." /> Es gilt <Formel tex="\cos 0=1" nach="," /> <Formel tex="\cos\pi=-1" /> und <Formel tex={t`\cos\frac{3\pi}{2}=0`} nach="." /></>,
      ]}
      loesung={[
        <>
          <Formel tex={t`\sin x=0`} /> hat im Intervall die Lösung <Formel tex="x=\pi" nach="." /> Bis dahin liegt <Formel tex="K_f" /> oberhalb, danach unterhalb der x-Achse.
        </>,
        <>
          Mit <Formel tex={t`F(x)=-2\cos x`} /> gilt <Formel tex="F(0)=-2" nach="," /> <Formel tex={t`F(\pi)=2`} /> und <Formel tex={t`F\!\left(\frac{3\pi}{2}\right)=0`} nach="." />
        </>,
        <>
          <Formel tex={t`${integral('0', '\\pi')}=F(\\pi)-F(0)=2-(-2)=4`} nach="," /> <Formel tex={t`${integral('\\pi', '\\frac{3\\pi}{2}')}=0-2=-2`} nach="." /> Das Integral ist <Formel tex="4+(-2)=2" nach="." />
        </>,
        <>
          Der Flächeninhalt ist <Formel tex="A=4+2=6" nach="." />
          <FlaechenFigur daten={BILD_AUFGABE3} unter={<>Die Teile <Formel tex="+4" /> und <Formel tex="-2" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=2\sin x`} nach="." /> Die Fläche wird von <Formel tex="K_f" /> der x-Achse und den Geraden <Formel tex="x=0" /> und <Formel tex={t`x=\frac{3\pi}{2}`} /> begrenzt. Bestimme die Nullstelle von <Formel tex="f" /> in diesem Intervall, berechne das Integral über das Intervall und bestimme den Flächeninhalt.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE3} unter={<>Das Schaubild von <Formel tex={t`f(x)=2\sin x`} /> mit den Teilflächen.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Fläche im ersten Quadranten"
      felder={[
        { id: 'u', name: 'Nullstelle von f', beschriftung: <>Nullstelle <Formel tex="u" /></>, erwartet: AUFGABE4.nullstelle, toleranz: TOL },
        { id: 'A', name: 'Flächeninhalt', beschriftung: <>Flächeninhalt <Formel tex="A" /></>, erwartet: AUFGABE4.flaeche, toleranz: TOL },
      ]}
      hilfen={[
        <>Die Fläche reicht von <Formel tex="x=0" /> bis zur ersten Nullstelle rechts davon. Löse <Formel tex={t`4-\mathrm{e}^{x/2}=0`} nach="." /></>,
        <>Aus <Formel tex={t`\mathrm{e}^{x/2}=4`} /> folgt <Formel tex={t`\frac{x}{2}=\ln 4`} nach="." /> Eine Stammfunktion von <Formel tex={t`f`} /> ist <Formel tex={t`F(x)=4x-2\mathrm{e}^{x/2}`} nach="." /> Prüfe sie durch Ableiten.</>,
      ]}
      loesung={[
        <>
          <Formel tex={t`4-\mathrm{e}^{x/2}=0`} /> gibt <Formel tex={t`\mathrm{e}^{x/2}=4`} nach="," /> also <Formel tex={t`x=2\ln 4\approx ${String(AUFGABE4.nullstelle.toFixed(2)).replace('.', '{,}')}`} nach="." />
        </>,
        <>
          Für <Formel tex="0\le x\le u" /> ist <Formel tex="f(x)\ge 0" nach="." /> Mit <Formel tex={t`F(x)=4x-2\mathrm{e}^{x/2}`} /> gilt <Formel tex="F(0)=-2" /> und <Formel tex={t`F(u)=8\ln 4-2\cdot 4=8\ln 4-8`} nach="," /> denn <Formel tex={t`\mathrm{e}^{u/2}=4`} nach="." />
        </>,
        <>
          <Formel anzeige tex={t`A=F(u)-F(0)`} />
          <Formel anzeige tex={t`{}=8\ln 4-8+2`} />
          <Formel anzeige tex={t`{}=8\ln 4-6`} />
          <Formel anzeige tex={t`{}\approx ${String(AUFGABE4.flaeche.toFixed(2)).replace('.', '{,}')}`} nach="." />
          <FlaechenFigur daten={BILD_AUFGABE4} unter={<>Die gefärbte Fläche reicht von der y-Achse bis zur Nullstelle.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=4-\mathrm{e}^{x/2}`} nach="." /> Das Schaubild <Formel tex="K_f" /> und die Koordinatenachsen schließen im ersten Quadranten eine Fläche ein. Bestimme die Nullstelle <Formel tex="u" /> von <Formel tex="f" /> und berechne den Flächeninhalt <Formel tex="A" nach="." /> Runde auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE4} unter={<>Das Schaubild von <Formel tex="f" /> mit der Fläche im ersten Quadranten.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Eine Grenze bei gegebenem Flächeninhalt"
      felder={[
        { id: 'gesamt', name: 'Flächeninhalt der ganzen Fläche', beschriftung: <>Flächeninhalt der ganzen Fläche</>, erwartet: AUFGABE5.gesamt },
        { id: 'u', name: 'Grenze u', beschriftung: <>Grenze <Formel tex="u" /></>, erwartet: AUFGABE5.u },
      ]}
      hilfen={[
        <>Die Fläche liegt unterhalb der x-Achse. Ihr Flächeninhalt ist deshalb das Integral mit umgekehrtem Vorzeichen: <Formel tex={t`A(u)=-${integral('0', 'u')}`} nach="." /></>,
        <>Berechne <Formel tex="A(u)" /> mit der Stammfunktion <Formel tex={t`F(x)=\frac{1}{3}x^3-3x^2`} /> und setze <Formel tex={t`A(u)=\frac{28}{3}`} nach="." /> Multipliziere die Gleichung mit 3, dann hast du eine Gleichung dritten Grades.</>,
        <>Rate eine Lösung: Sie ist ein Teiler von 28. Probiere 1, 2, 4 und 7. Danach hilft die Polynomdivision, die anderen Lösungen zu finden.</>,
      ]}
      loesung={[
        <>
          Nullstellen: <Formel tex={t`x^2-6x=x(x-6)=0`} nach="," /> also <Formel tex="x=0" /> und <Formel tex="x=6" nach="." /> Dazwischen liegt <Formel tex="K_f" /> unterhalb der x-Achse. Mit <Formel tex={t`F(x)=\frac{1}{3}x^3-3x^2`} /> ist <Formel tex={t`A=-\left(F(6)-F(0)\right)=-(72-108)=36`} nach="." />
        </>,
        <>
          Für die Fläche bis <Formel tex="u" /> gilt <Formel tex={t`A(u)=-\left(\frac{1}{3}u^3-3u^2\right)=3u^2-\frac{1}{3}u^3`} nach="." /> Aus <Formel tex={t`A(u)=\frac{28}{3}`} /> folgt nach Multiplikation mit 3
          <Formel anzeige tex={t`9u^2-u^3=28`} />
          <Formel anzeige tex={t`u^3-9u^2`} />
          <Formel anzeige tex={t`{}+28=0`} nach="." />
        </>,
        <>
          Probieren: <Formel tex={t`u=1`} /> ergibt <Formel tex={t`1-9+28=20`} nach="," /> <Formel tex="u=2" /> ergibt <Formel tex={t`8-36+28=0`} nach="." /> Also ist <Formel tex="u=2" /> eine Lösung.
        </>,
        <>
          Polynomdivision: <Formel tex={t`u^3-9u^2+28=(u-2)\left(u^2-7u-14\right)`} nach="." /> Die Gleichung <Formel tex={t`u^2-7u-14=0`} /> hat die Lösungen <Formel tex={t`u=\frac{7\pm\sqrt{105}}{2}`} nach="," /> das sind etwa <Formel tex="8{,}62" /> und <Formel tex="-1{,}62" nach="." /> Beide liegen nicht im Intervall <Formel tex="]0;\,6[" nach="." /> Es gibt genau eine Lösung, <Formel tex="u=2" nach="." />
          <FlaechenFigur daten={BILD_AUFGABE5} unter={<>Die Fläche von <Formel tex="x=0" /> bis <Formel tex="u=2" /> hat den Inhalt <Formel tex={t`\frac{28}{3}\approx 9{,}33`} nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=x^2-6x`} nach="." /> Das Schaubild <Formel tex="K_f" /> schließt mit der x-Achse eine Fläche ein. Bestimme ihren Flächeninhalt. Außerdem begrenzen <Formel tex="K_f" nach="," /> die x-Achse, die y-Achse und die Gerade <Formel tex="x=u" /> mit <Formel tex="0<u<6" /> eine Fläche mit dem Inhalt <Formel tex={t`\frac{28}{3}`} nach="." /> Bestimme <Formel tex="u" nach="." />
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE5} unter={<>Das Schaubild von <Formel tex="f" /> mit der Fläche von 0 bis <Formel tex="u=2" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Eine Grenze bei gegebenem Integralwert"
      felder={[
        { id: 'klein', name: 'kleinere Lösung für b', beschriftung: <>kleinere Lösung</>, erwartet: AUFGABE6.loesungen[0]! },
        { id: 'gross', name: 'größere Lösung für b', beschriftung: <>größere Lösung</>, erwartet: AUFGABE6.loesungen[1]! },
      ]}
      hilfen={[
        <>Berechne das Integral mit der Stammfunktion <Formel tex={t`F(x)=x^2+x`} /> und lasse <Formel tex="b" /> stehen.</>,
        <>Aus <Formel tex={t`F(b)-F(1)=10`} /> folgt eine quadratische Gleichung für <Formel tex="b" nach="." /> Das Integral ist orientiert, <Formel tex="b" /> darf auch links von 1 liegen.</>,
      ]}
      loesung={[
        <>
          <Formel tex={t`${integral('1', 'b', '(2x+1)')}=F(b)-F(1)=b^2+b-2`} nach="." />
        </>,
        <>
          Aus <Formel tex={t`b^2+b-2=10`} /> folgt <Formel tex={t`b^2+b-12=0`} nach="." /> Die Lösungsformel gibt <Formel tex={t`b=\frac{-1\pm\sqrt{49}}{2}`} nach="," /> also <Formel tex="b=3" /> oder <Formel tex="b=-4" nach="." />
        </>,
        <>
          Beide Werte sind richtig. Bei <Formel tex="b=3" /> liegt die Fläche oberhalb der x-Achse, bei <Formel tex="b=-4" /> sind die Grenzen vertauscht, das Integral von 1 bis <Formel tex="-4" /> ist das Negative des Integrals von <Formel tex="-4" /> bis 1. Es zählt dort die Fläche links von 1 mit umgekehrtem Vorzeichen. Der Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse von <Formel tex="-4" /> bis 1 ist dagegen <Formel tex="14{,}5" nach="," /> nicht 10.
          <FlaechenFigur daten={BILD_AUFGABE6A} unter={<>Für <Formel tex="b=3" nach=":" /> Das Integral von 1 bis 3 ist <Formel tex="10" nach="." /></>} />
          <FlaechenFigur daten={BILD_AUFGABE6B} unter={<>Für <Formel tex="b=-4" nach=":" /> Das Integral von <Formel tex="-4" /> bis 1 ist <Formel tex="-10" nach="," /> mit vertauschten Grenzen also <Formel tex="10" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Bestimme alle Zahlen <Formel tex="b" nach="," /> für die <Formel tex={t`${integral('1', 'b', '(2x+1)')}=10`} /> gilt.
      </p>
    </Aufgabe>
  );
}

function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Ein Lastenaufzug"
      felder={[
        { id: 't1', name: 'erster Zeitpunkt des Richtungswechsels', beschriftung: <>erster Wechsel bei <Formel tex="t" /> in min</>, erwartet: AUFGABE7.nullstellen[0]! },
        { id: 't2', name: 'zweiter Zeitpunkt des Richtungswechsels', beschriftung: <>zweiter Wechsel bei <Formel tex="t" /> in min</>, erwartet: AUFGABE7.nullstellen[1]! },
        { id: 'hoehe', name: 'Änderung der Höhe in Metern', beschriftung: <>Höhenänderung in m</>, erwartet: AUFGABE7.aenderung },
        { id: 'weg', name: 'zurückgelegter Weg in Metern', beschriftung: <>Weg in m</>, erwartet: AUFGABE7.weg },
      ]}
      hilfen={[
        <>Der Aufzug ändert seine Fahrtrichtung dort, wo die Geschwindigkeit das Vorzeichen wechselt. Klammere 3 aus und löse <Formel tex="v(t)=0" nach="." /></>,
        <>Eine Stammfunktion von <Formel tex="v" /> ist <Formel tex={t`V(t)=t^3-9t^2+24t`} nach="." /> Die Höhenänderung ist das Integral von 0 bis 5. Der Weg ist die Summe der Beträge der Teile zwischen den Richtungswechseln.</>,
      ]}
      loesung={[
        <>
          <Formel tex={t`v(t)=3\left(t^2-6t+8\right)=3(t-2)(t-4)`} nach="." /> Die Richtung wechselt bei <Formel tex="t=2" /> und <Formel tex="t=4" nach="." />
        </>,
        <>
          Mit <Formel tex={t`V(t)=t^3-9t^2+24t`} /> gilt <Formel tex="V(0)=0" nach="," /> <Formel tex="V(2)=8-36+48=20" nach="," /> <Formel tex="V(4)=64-144+96=16" /> und <Formel tex="V(5)=125-225+120=20" nach="." />
        </>,
        <>
          Die Teile sind <Formel tex="V(2)-V(0)=20" /> (aufwärts), <Formel tex="V(4)-V(2)=-4" /> (abwärts) und <Formel tex="V(5)-V(4)=4" /> (aufwärts). Die Höhenänderung ist <Formel tex="20-4+4=20" /> Meter.
        </>,
        <>
          Der Weg ist <Formel tex="20+4+4=28" /> Meter, denn der Aufzug fährt auch beim Abwärtsfahren eine Strecke.
          <FlaechenFigur daten={BILD_AUFGABE7} unter={<>Die Flächen <Formel tex="+20" nach="," /> <Formel tex="-4" /> und <Formel tex="+4" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Ein Lastenaufzug fährt in einem Schacht. Seine Geschwindigkeit ist <Formel tex={t`v(t)=3t^2-18t+24`} /> für <Formel tex="0\le t\le 5" nach="." /> Dabei ist <Formel tex="t" /> die Zeit in Minuten und <Formel tex="v(t)" /> die Geschwindigkeit in Metern pro Minute, positiv heißt aufwärts. Zur Zeit 0 steht der Aufzug unten. Bestimme die Zeitpunkte, zu denen er seine Fahrtrichtung wechselt, berechne um wie viele Meter sich seine Höhe in den fünf Minuten ändert und bestimme den Weg, den er insgesamt zurücklegt.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_AUFGABE7} unter={<>Die Geschwindigkeit mit den Flächen zwischen den Richtungswechseln.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage8() {
  return (
    <Auswahlfrage
      nummer="8"
      titel="Fehler finden"
      optionen={platziere(
        [
          opt('a', <>Das Integral ist falsch berechnet, sein Wert ist nicht 0.</>, false, <>Das Integral stimmt. <Formel tex={t`x^3-4x`} /> ist punktsymmetrisch zum Ursprung, deshalb ist das Integral über ein Intervall, das symmetrisch zu 0 liegt, gleich 0.</>),
          opt('b', <>Nichts. Der Flächeninhalt ist wirklich 0, weil sich die Flächen aufheben.</>, false, <>Flächen heben sich nur im Integral auf, nicht im Flächeninhalt. Ein Flächeninhalt ist 0 nur, wenn gar keine Fläche eingeschlossen wird. Hier sind es vier Stücke.</>),
          opt('c', <>Das Integral zählt Flächen unterhalb der x-Achse negativ. Man muss an den Nullstellen <Formel tex="-2" nach="," /> <Formel tex="0" /> und <Formel tex="2" /> teilen und die Beträge der vier Teile addieren.</>, true, <>Richtig. Die vier Teile haben die Integrale <Formel tex={t`-\frac{25}{4}`} nach="," /> <Formel tex="4" nach="," /> <Formel tex="-4" /> und <Formel tex={t`\frac{25}{4}`} nach="," /> der Flächeninhalt ist <Formel tex={t`\frac{25}{4}+4+4+\frac{25}{4}=\frac{41}{2}`} nach="." /></>),
          opt('d', <>Man rechnet von 0 bis 3 und verdoppelt das Ergebnis, dann ist <Formel tex="A" /> richtig.</>, false, <>Das Integral von 0 bis 3 enthält ebenfalls einen Vorzeichenwechsel bei 2 (es ist <Formel tex={t`\frac{9}{4}`} nach=")" />. Verdoppeln führt zu <Formel tex={t`\frac{9}{2}`} nach="," /> weit unter dem Flächeninhalt.</>),
        ],
        1,
      )}
      erklaerung={
        <>
          Die Nullstellen von <Formel tex={t`f(x)=x^3-4x=x(x-2)(x+2)`} /> sind <Formel tex="-2" nach="," /> <Formel tex="0" /> und <Formel tex="2" nach="." /> Zwischen den Nullstellen hat <Formel tex="f" /> ein festes Vorzeichen, deshalb rechnet man jedes Stück für sich und addiert die Beträge.
          <FlaechenFigur daten={BILD_F8} unter={<>Vier Teilflächen mit den Integralen <Formel tex="-6{,}25" nach="," /> <Formel tex="+4" nach="," /> <Formel tex="-4" /> und <Formel tex="+6{,}25" nach="." /></>} />
        </>
      }
    >
      <p>
        Lena soll den Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse über <Formel tex="[-3;\,3]" /> für <Formel tex={t`f(x)=x^3-4x`} /> bestimmen. Sie rechnet <Formel tex={t`\int_{-3}^{3}\left(x^3-4x\right)\mathrm{d}x=0`} /> und schreibt: „Der Flächeninhalt ist 0.“ Was ist falsch?
      </p>
    </Auswahlfrage>
  );
}

function Frage9() {
  return (
    <Auswahlfrage
      nummer="9"
      titel="Berührstelle"
      optionen={platziere(
        [
          opt('a', <>Ja, an jeder Nullstelle muss man teilen, sonst ist das Ergebnis falsch.</>, false, <>Nötig ist das nur, wenn die Funktion dort ihr Vorzeichen wechselt. Hier tut sie das nicht, ohne Teilen stimmt das Ergebnis auch.</>),
          opt('b', <>Nein. Die Funktion wechselt bei 2 das Vorzeichen nicht, sie ist auf <Formel tex="[0;\,3]" /> nirgends negativ. Der Flächeninhalt ist das Integral von 0 bis 3.</>, true, <>Richtig. Teilen wäre erlaubt, ändert aber nichts, beide Teile sind positiv: <Formel tex={t`\frac{4}{3}+\frac{11}{12}=\frac{9}{4}`} nach="." /></>),
          opt('c', <>Ja, weil <Formel tex="K_f" /> die x-Achse bei 2 schneidet.</>, false, <>Bei 2 schneidet <Formel tex="K_f" /> die Achse nicht, es berührt sie nur. Wo das Schaubild die Achse überquert, wechselt das Vorzeichen, hier nicht.</>),
          opt('d', <>Nein, weil bei einer Nullstelle der Funktionswert 0 ist und dort keine Fläche entsteht.</>, false, <>Die Fläche ist links und rechts der Nullstelle vorhanden. Dass der Funktionswert in einem einzigen Punkt 0 ist, ändert den Flächeninhalt nicht. Entscheidend ist das Vorzeichen auf beiden Seiten.</>),
        ],
        0,
      )}
      erklaerung={
        <>
          Bei <Formel tex={t`h(x)=x(x-2)^2`} /> ist der Faktor <Formel tex={t`(x-2)^2`} /> nie negativ, für <Formel tex="x\ge 0" /> ist also <Formel tex="h(x)\ge 0" nach="." /> Die Fläche liegt ganz oberhalb der x-Achse, <Formel tex={t`A=\int_0^3 h(x)\,\mathrm{d}x=\frac{9}{4}`} nach="." />
        </>
      }
    >
      <p>
        Der Flächeninhalt zwischen dem Schaubild von <Formel tex={t`h(x)=x(x-2)^2`} /> und der x-Achse von <Formel tex="x=0" /> bis <Formel tex="x=3" /> soll bestimmt werden. Die Nullstelle <Formel tex="x=2" /> liegt im Inneren des Intervalls. Muss man dort teilen?
      </p>
    </Auswahlfrage>
  );
}

function Frage10() {
  return (
    <Auswahlfrage
      nummer="10"
      titel="Wachsen die Werte immer?"
      optionen={platziere(
        [
          opt('a', <>Die Fläche <Formel tex="A(u)" /> zwischen <Formel tex="K_f" /> und der x-Achse von 0 bis <Formel tex="u" /> wächst mit <Formel tex="u" /> immer.</>, true, <>Richtig. Zu jedem weiteren Stück kommt ein Flächeninhalt dazu, und der ist nie negativ. Weil <Formel tex="f" /> nicht überall 0 ist, wird <Formel tex="A(u)" /> sogar streng größer.</>),
          opt('b', <>Das Integral <Formel tex={t`I(u)=\int_0^u f(x)\,\mathrm{d}x`} /> wächst mit <Formel tex="u" /> immer.</>, false, <>Das gilt nur, solange <Formel tex="f" /> nicht negativ ist. Sobald <Formel tex="K_f" /> unter die x-Achse verläuft, sinkt das Integral.</>),
          opt('c', <><Formel tex="A(u)" /> und <Formel tex="I(u)" /> unterscheiden sich nie.</>, false, <>Sie sind nur gleich, solange <Formel tex="K_f" /> oberhalb der x-Achse liegt. Danach ist <Formel tex="A(u)" /> größer als <Formel tex="I(u)" nach="." /></>),
          opt('d', <><Formel tex="A(u)" /> kann sinken, wenn <Formel tex="f" /> negativ wird.</>, false, <>Ein Stück unterhalb der x-Achse hat auch einen positiven Flächeninhalt. Er wird dazuaddiert. Sinken kann nur das Integral.</>),
        ],
        3,
      )}
      erklaerung={
        <>
          Das Integral zählt Stücke unterhalb der x-Achse negativ, der Flächeninhalt nicht. Deshalb wächst <Formel tex="A(u)" /> immer, <Formel tex="I(u)" /> nicht. Zu einem gegebenen Flächeninhalt gehört darum höchstens ein <Formel tex="u" nach="," /> zu einem gegebenen Integralwert können mehrere gehören (Aufgabe 6).
        </>
      }
    >
      <p>
        <Formel tex="f" /> sei eine Polynomfunktion, die nicht überall 0 ist. Für <Formel tex="u>0" /> sei <Formel tex="A(u)" /> der Flächeninhalt zwischen <Formel tex="K_f" /> und der x-Achse von 0 bis <Formel tex="u" /> und <Formel tex="I(u)" /> das Integral von 0 bis <Formel tex="u" nach="." /> Welche Aussage stimmt?
      </p>
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Die Aufgaben 2, 5 und 6 rechnest du ohne Hilfsmittel, in Aufgabe 4 darfst du den Taschenrechner benutzen. Zu jeder Aufgabe gibt es Hilfen in Stufen und einen Lösungsweg. Ein Schaubild zur Kontrolle blendest du erst nach deiner Rechnung ein.
      </p>
      <Eingabehinweis />
      <Frage1 />
      <Aufgabe2 />
      <Aufgabe3 />
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
      <Aufgabe7 />
      <Frage8 />
      <Frage9 />
      <Frage10 />
    </Abschnitt>
  );
}
