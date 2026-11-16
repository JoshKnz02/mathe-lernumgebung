import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { fb, t } from '@/lib/modulhilfen';
import { BILD_K5_G, BILD_K5_SEKANTE, BILD_K6 } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Punkt } from './Punkt';
import { K10, K11, K38, K5, K6, K7, K8, K9, TOL2 } from './werte';

/** Bereich Änderungsrate und Ableitung: Aussagen 5 bis 11 und die ergänzte Aussage 38. */
export function Aenderung() {
  return (
    <Abschnitt id="aenderung" titel="Änderungsrate und Ableitung">
      <p>Hier geht es von der mittleren Änderungsrate über die momentane Änderungsrate bis zur Ableitung mit den ersten Regeln.</p>
      <Eingabehinweis />

      <Punkt id="durchschnittliche-rate">
        <Kontrolle
          aussage="durchschnittliche-rate"
          nummer="K5"
          titel="Durchschnittliche Änderungsrate"
          felder={[
            { id: 'f', name: 'durchschnittliche Änderungsrate von f auf dem Intervall von minus 2 bis 4', beschriftung: <>für <Formel tex="f" /> (rechnerisch)</>, erwartet: K5.rateF },
            { id: 'g', name: 'durchschnittliche Änderungsrate von g auf dem Intervall von minus 2 bis 2', beschriftung: <>für <Formel tex="g" /> (zeichnerisch)</>, erwartet: K5.rateG },
          ]}
          hilfen={[
            <>Die durchschnittliche Änderungsrate ist die Steigung der Sekante durch die beiden Randpunkte des Intervalls (Modul <Modulverweis modul="aenderungsraten">Von der mittleren zur momentanen Änderungsrate</Modulverweis>).</>,
            <>Für <Formel tex="f" /> rechnest du <Formel tex={t`\frac{f(4)-f(-2)}{4-(-2)}`} nach="." /> Für <Formel tex="g" /> zeichnest du die Sekante durch <Formel tex="A" /> und <Formel tex="B" /> und liest ein Steigungsdreieck ab.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f(-2)=1+2+2=5`} /> und <Formel tex={t`f(4)=4-4+2=2`} nach="." /> Der Differenzenquotient ist
              <Formel anzeige tex={t`\frac{f(4)-f(-2)}{4-(-2)}=\frac{2-5}{6}=-\frac12`} />
            </>,
            <>
              Die Sekante durch <Formel tex={t`A(-2\,|\,0)`} /> und <Formel tex={t`B(2\,|\,2)`} /> hat das Steigungsdreieck 4 nach rechts und 2 nach oben, also die Steigung <Formel tex={t`\tfrac24=\tfrac12`} nach="." />
              <Bild daten={BILD_K5_SEKANTE} unter={<>Die Sekante (blau gestrichelt) durch <Formel tex="A" /> und <Formel tex="B" /> hat die Steigung <Formel tex={t`\tfrac12`} nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex={t`f(x)=\tfrac14x^2-x+2`} /> und die Funktion <Formel tex="g" /> mit dem Schaubild in der Abbildung. Bestimme die durchschnittliche Änderungsrate von <Formel tex="f" /> auf <Formel tex={t`[-2;\,4]`} /> rechnerisch und von <Formel tex="g" /> auf <Formel tex={t`[-2;\,2]`} /> zeichnerisch.
          </p>
          <Bild daten={BILD_K5_G} unter={<>Das Schaubild <Formel tex="K_g" /> mit den Punkten <Formel tex="A" /> und <Formel tex="B" nach="." /></>} />
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K5_SEKANTE} unter={<>Das Schaubild <Formel tex="K_g" /> mit der Sekante durch <Formel tex="A" /> und <Formel tex="B" nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="momentane-rate-zeichnerisch">
        <Kontrolle
          aussage="momentane-rate-zeichnerisch"
          nummer="K6"
          titel="Momentane Änderungsrate zeichnerisch"
          felder={[{ id: 'm', name: 'momentane Änderungsrate von g an der Stelle 0, auf ein Zehntel genau', beschriftung: <>momentane Änderungsrate</>, erwartet: K6.rate, toleranz: K6.toleranz }]}
          hilfen={[
            <>Zeichne die Tangente an <Formel tex="K_g" /> im Punkt <Formel tex={t`P(0\,|\,1)`} nach="." /> Sie berührt das Schaubild nur in <Formel tex="P" nach="." /></>,
            <>Die momentane Änderungsrate ist die Steigung der Tangente. Lies sie mit einem Steigungsdreieck ab. Nach Augenmaß sind kleine Abweichungen erlaubt.</>,
          ]}
          loesung={[
            <>
              Die Tangente in <Formel tex="P" /> läuft nach rechts leicht abwärts und geht durch <Formel tex={t`(2\,|\,0)`} nach="." /> Das Steigungsdreieck hat 2 nach rechts und 1 nach unten.
            </>,
            <>
              Die Steigung ist <Formel tex={t`m=\frac{-1}{2}=-0{,}5`} nach="." /> Die momentane Änderungsrate von <Formel tex="g" /> an der Stelle 0 beträgt etwa <Formel tex="-0{,}5" nach="." />
              <Bild daten={BILD_K6} unter={<>Die Tangente (blau gestrichelt) in <Formel tex="P" /> hat die Steigung <Formel tex={t`-\tfrac12`} nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Bestimme zeichnerisch (näherungsweise) die momentane Änderungsrate von <Formel tex="g" /> aus K5 an der Stelle <Formel tex="x=0" nach="." />
          </p>
          <Bild daten={BILD_K5_G} unter={<>Das Schaubild <Formel tex="K_g" nach="." /></>} />
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K6} unter={<>Das Schaubild <Formel tex="K_g" /> mit der Tangente in <Formel tex="P" nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="h-methode">
        <Kontrolle
          aussage="h-methode"
          nummer="K7"
          titel="Ableitung mit der h-Methode"
          felder={[
            { id: 'dq', name: 'Differenzenquotient mit h gleich 0,5', beschriftung: <>Differenzenquotient für <Formel tex="h=0{,}5" /></>, erwartet: K7.dq },
            { id: 'f', name: 'momentane Änderungsrate von f an der Stelle 2', beschriftung: <><Formel tex="f'(2)" /></>, erwartet: K7.grenzwert },
          ]}
          hilfen={[
            <>Der Differenzenquotient an der Stelle 2 ist <Formel tex={t`\frac{f(2+h)-f(2)}{h}`} nach="." /> Für <Formel tex="h=0{,}5" /> setzt du direkt ein.</>,
            <>Für den Grenzwert multiplizierst du <Formel tex="f(2+h)" /> aus, kürzt <Formel tex="h" /> und lässt dann <Formel tex={t`h\to 0`} /> gehen (Modul <Modulverweis modul="aenderungsraten">Von der mittleren zur momentanen Änderungsrate</Modulverweis>).</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f(2)=4-6=-2`} /> und <Formel tex={t`f(2{,}5)=6{,}25-7{,}5=-1{,}25`} nach="." /> Der Differenzenquotient ist <Formel tex={t`\frac{-1{,}25-(-2)}{0{,}5}=1{,}5`} nach="." />
            </>,
            <>
              Allgemein: <Formel tex={t`f(2+h)=(2+h)^2-3(2+h)=h^2+h-2`} nach="," /> also
              <Formel anzeige tex={t`\frac{f(2+h)-f(2)}{h}=\frac{h^2+h-2-(-2)}{h}=\frac{h^2+h}{h}=h+1`} />
              Für <Formel tex="h=0{,}5" /> ist das 1,5. Für <Formel tex={t`h\to 0`} /> geht <Formel tex="h+1" /> gegen 1, also <Formel tex="f'(2)=1" nach="." />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex={t`f(x)=x^2-3x`} nach="." /> Berechne den Differenzenquotienten an der Stelle <Formel tex="x=2" /> für <Formel tex="h=0{,}5" /> und bestimme dann die momentane Änderungsrate <Formel tex="f'(2)" /> mit der h-Methode (Grenzwert des Differenzenquotienten).
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="potenzregel">
        <Kontrolle
          aussage="potenzregel"
          nummer="K8"
          titel="Potenzregel"
          felder={[
            { id: 'a', name: 'momentane Änderungsrate an der Stelle minus 1', beschriftung: <><Formel tex="f'(-1)" /></>, erwartet: K8.dm1 },
            { id: 'b', name: 'momentane Änderungsrate an der Stelle 2', beschriftung: <><Formel tex="f'(2)" /></>, erwartet: K8.d2 },
          ]}
          hilfen={[
            <>Die Potenzregel lautet: <Formel tex={t`f(x)=x^n`} /> hat die Ableitung <Formel tex={t`f'(x)=n\cdot x^{n-1}`} /> (Modul <Modulverweis modul="ableitungsregeln">Ableitungsregeln</Modulverweis>).</>,
            <>Leite <Formel tex={t`\tfrac14x^4`} /> und <Formel tex="-2x" /> einzeln ab und setze dann ein.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f'(x)=\tfrac14\cdot 4x^3-2=x^3-2`} nach="." />
            </>,
            <>
              <Formel tex={t`f'(-1)=(-1)^3-2=-3`} /> und <Formel tex={t`f'(2)=2^3-2=6`} nach="." />
            </>,
          ]}
        >
          <p>
            Bestimme für <Formel tex={t`f(x)=\tfrac14x^4-2x`} /> mit der Potenzregel die momentane Änderungsrate an den Stellen <Formel tex="x=-1" /> und <Formel tex="x=2" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="summenregel">
        <Kontrolle
          aussage="summenregel"
          nummer="K9"
          titel="Summen- und Faktorregel"
          felder={[
            { id: 'a', name: 'Koeffizient von x Quadrat in der Ableitung', beschriftung: <>Ableitung von <Formel tex="f" nach=":" /> Koeffizient von <Formel tex="x^2" /></>, erwartet: K9.a },
            { id: 'b', name: 'Koeffizient von x in der Ableitung', beschriftung: <>Koeffizient von <Formel tex="x" /></>, erwartet: K9.b },
            { id: 'c', name: 'Konstante in der Ableitung', beschriftung: <>Konstante</>, erwartet: K9.c },
            { id: 'h', name: 'Ableitung von h an der Stelle 4', beschriftung: <><Formel tex="h'(4)" /></>, erwartet: K9.h4 },
          ]}
          hilfen={[
            <>Die Summenregel erlaubt, jeden Summanden einzeln abzuleiten. Die Faktorregel lässt einen konstanten Faktor stehen. Eine Konstante hat die Ableitung 0.</>,
            <>Schreibe bei <Formel tex="h" /> zuerst um: <Formel tex={t`\sqrt x=x^{\frac12}`} /> und <Formel tex={t`\frac2x=2x^{-1}`} nach="." /></>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f(x)=-2x^3+4x^2-5x+7`} /> hat die Ableitung <Formel tex={t`f'(x)=-6x^2+8x-5`} nach="." /> Die Koeffizienten sind <Formel tex="-6" nach="," /> <Formel tex="8" /> und <Formel tex="-5" nach="." />
            </>,
            <>
              <Formel tex={t`h(x)=3x^{\frac12}-2x^{-1}`} /> hat die Ableitung <Formel tex={t`h'(x)=\tfrac32x^{-\frac12}+2x^{-2}=\frac{3}{2\sqrt x}+\frac{2}{x^2}`} nach="." /> Für <Formel tex="x=4" /> ist <Formel tex={t`h'(4)=\tfrac34+\tfrac18=\tfrac78`} nach="." />
            </>,
          ]}
        >
          <p>
            Bilde die Ableitung von <Formel tex={t`f(x)=-2x^3+4x^2-5x+7`} /> und gib die drei Koeffizienten an. Berechne außerdem <Formel tex="h'(4)" /> für <Formel tex={t`h(x)=3\sqrt x-\frac2x`} nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="steigung-im-punkt">
        <Kontrolle
          aussage="steigung-im-punkt"
          nummer="K10"
          titel="Steigung in einem Punkt"
          felder={[
            { id: 'y', name: 'y-Koordinate des Punkts A', beschriftung: <><Formel tex="f(-1)" /></>, erwartet: K10.y },
            { id: 'm', name: 'Steigung im Punkt A', beschriftung: <>Steigung in <Formel tex="A" /></>, erwartet: K10.m },
          ]}
          hilfen={[
            <>Die Steigung des Schaubilds in einem Punkt ist der Wert der Ableitung an dieser Stelle, hier <Formel tex="f'(-1)" nach="." /></>,
            <>Berechne zuerst <Formel tex="f'(x)" /> mit der Potenzregel und setze dann <Formel tex="x=-1" /> ein.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f(-1)=2\cdot(-1)^3-3\cdot(-1)=-2+3=1`} nach="," /> also <Formel tex={t`A(-1\,|\,1)`} nach="." />
            </>,
            <>
              <Formel tex={t`f'(x)=6x^2-3`} nach="," /> also <Formel tex={t`f'(-1)=6-3=3`} nach="." /> Die Steigung des Schaubilds in <Formel tex="A" /> beträgt 3.
            </>,
          ]}
        >
          <p>
            Bestimme die Steigung des Schaubilds der Funktion <Formel tex="f" /> mit <Formel tex={t`f(x)=2x^3-3x`} /> im Punkt <Formel tex="A(-1\,|\,f(-1))" nach="." /> Gib auch den Funktionswert <Formel tex="f(-1)" /> an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="stelle-mit-steigung">
        <Kontrolle
          aussage="stelle-mit-steigung"
          nummer="K11"
          titel="Stellen mit vorgegebener Steigung"
          felder={[
            { id: 'a1', name: 'kleinere Stelle mit waagerechter Tangente', beschriftung: <>waagerecht: <Formel tex="x_1" /></>, erwartet: K11.waagerecht[0]! },
            { id: 'a2', name: 'größere Stelle mit waagerechter Tangente', beschriftung: <>waagerecht: <Formel tex="x_2" /></>, erwartet: K11.waagerecht[1]! },
            { id: 'b1', name: 'kleinere Stelle mit Steigung 15', beschriftung: <>Steigung 15: <Formel tex="x_1" /></>, erwartet: K11.steigung15[0]! },
            { id: 'b2', name: 'größere Stelle mit Steigung 15', beschriftung: <>Steigung 15: <Formel tex="x_2" /></>, erwartet: K11.steigung15[1]! },
          ]}
          hilfen={[
            <>Du suchst Stellen, an denen die Ableitung einen bestimmten Wert hat. Bei einer waagerechten Tangente ist die Steigung 0.</>,
            <>Setze <Formel tex="f'(x)=0" /> und danach <Formel tex="f'(x)=15" nach="." /> Beide Gleichungen sind quadratisch.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f'(x)=3x^2-6x-9`} nach="." /> Aus <Formel tex={t`3x^2-6x-9=0`} /> folgt <Formel tex={t`x^2-2x-3=0`} /> und <Formel tex={t`x=1\pm\sqrt{1+3}=1\pm 2`} nach="," /> also <Formel tex="x=-1" /> oder <Formel tex="x=3" nach="." />
            </>,
            <>
              Aus <Formel tex={t`3x^2-6x-9=15`} /> folgt <Formel tex={t`x^2-2x-8=0`} /> und <Formel tex={t`x=1\pm\sqrt{1+8}=1\pm 3`} nach="," /> also <Formel tex="x=-2" /> oder <Formel tex="x=4" nach="." />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex={t`f(x)=x^3-3x^2-9x+2`} nach="." /> An welchen Stellen hat das Schaubild eine waagerechte Tangente, an welchen die Steigung 15? Gib jeweils beide Stellen an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="nicht-differenzierbar">
        <Kontrolle
          aussage="nicht-differenzierbar"
          nummer="K38"
          titel="Differenzierbar oder nicht?"
          felder={[
            { id: 'links', name: 'Grenzwert der Sekantensteigungen von links', beschriftung: <>von links</>, erwartet: K38.links, fehlerbilder: [fb(K38.rechts, <>Du hast die beiden Seiten vertauscht. Links von der Stelle 1 gilt der Term mit <Formel tex="x^2" nach="." /></>)] },
            { id: 'rechts', name: 'Grenzwert der Sekantensteigungen von rechts', beschriftung: <>von rechts</>, erwartet: K38.rechts, fehlerbilder: [fb(K38.links, <>Du hast die beiden Seiten vertauscht. Rechts von der Stelle 1 gilt der Term der Geraden.</>)] },
          ]}
          hilfen={[
            <>Der Differenzenquotient an der Stelle 1 ist <Formel tex={t`\frac{p(x)-p(1)}{x-1}`} /> mit <Formel tex="p(1)=2" nach="." /> Setze für <Formel tex="p(x)" /> links und rechts den passenden Term ein (Modul <Modulverweis modul="aenderungsraten">Von der mittleren zur momentanen Änderungsrate</Modulverweis>).</>,
            <>Von links kürzt du mit der dritten binomischen Formel, von rechts klammerst du im Zähler <Formel tex="-2" /> aus.</>,
          ]}
          loesung={[
            <>
              Von links (<Formel tex="x<1" nach="):" />
              <Formel anzeige tex={t`\frac{x^2+1-2}{x-1}`} />
              <Formel anzeige tex={t`{}=\frac{(x-1)(x+1)}{x-1}`} />
              <Formel anzeige tex={t`{}=x+1`} />
              Für <Formel tex={t`x\to 1`} /> ergibt sich <Formel tex="2" nach="." />
            </>,
            <>
              Von rechts (<Formel tex="x>1" nach="):" />
              <Formel anzeige tex={t`\frac{4-2x-2}{x-1}`} />
              <Formel anzeige tex={t`{}=\frac{-2(x-1)}{x-1}`} />
              <Formel anzeige tex={t`{}=-2`} />
            </>,
            <>
              Die Werte <Formel tex="2" /> und <Formel tex="-2" /> sind verschieden. An der Stelle 1 hat das Schaubild einen Knick und keine Tangente, <Formel tex="p" /> ist dort nicht differenzierbar.
            </>,
          ]}
        >
          <p>
            Für <Formel tex={t`x\le 1`} /> gilt <Formel tex="p(x)=x^2+1" nach="," /> für <Formel tex="x>1" /> gilt <Formel tex="p(x)=4-2x" nach="." /> Bestimme, auf welchen Wert die Sekantensteigungen an der Stelle <Formel tex="x=1" /> von links und von rechts zulaufen. Entscheide damit, ob <Formel tex="p" /> an dieser Stelle differenzierbar ist.
          </p>
        </Kontrolle>
      </Punkt>
    </Abschnitt>
  );
}
