import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_K16, BILD_K16_ABLEITUNG, BILD_K17, BILD_K20, BILD_K21 } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K15, K16, K18, K19, K20, K21, K22, K23, TOL2 } from './werte';

/** Bereich Ableitung und Schaubild: Aussagen 15 bis 23. */
export function Schaubild() {
  return (
    <Abschnitt id="schaubild" titel="Ableitung und Schaubild">
      <p>Hier geht es um die Ableitungsregeln für Exponential- und trigonometrische Funktionen, um das Schaubild der Ableitung, um Monotonie, Krümmung, Extrem- und Wendepunkte und um Produkt- und Kettenregel.</p>
      <Eingabehinweis />

      <Punkt id="regeln-exp-trig">
        <Kontrolle
          aussage="regeln-exp-trig"
          nummer="K15"
          titel="Ableitungen von Exponential- und trigonometrischen Funktionen"
          felder={[
            { id: 'a', name: 'Ableitung von f an der Stelle 0', beschriftung: <><Formel tex="f'(0)" /></>, erwartet: K15.f0 },
            { id: 'b', name: 'Ableitung von f an der Stelle Pi halbe, auf zwei Nachkommastellen', beschriftung: <><Formel tex={t`f'\left(\tfrac{\pi}{2}\right)`} /></>, erwartet: K15.fPi2, toleranz: TOL2 },
            { id: 'c', name: 'Ableitung von g an der Stelle 0', beschriftung: <><Formel tex="g'(0)" /></>, erwartet: K15.g0 },
          ]}
          hilfen={[
            <>Die Ableitungen sind <Formel tex={t`(\sin x)'=\cos x`} nach="," /> <Formel tex={t`(\cos x)'=-\sin x`} /> und <Formel tex={t`(e^x)'=e^x`} nach="." /> (Modul <Modulverweis modul="ableitungsregeln">Ableitungsregeln</Modulverweis>).</>,
            <>Bei <Formel tex={t`e^{0{,}5x}`} /> kommt der Faktor 0,5 von der inneren Funktion dazu. Der Taschenrechner steht auf Bogenmaß.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f'(x)=3x^2-2\sin x-5\cos x`} nach="." /> Es ist <Formel tex={t`f'(0)=0-0-5=-5`} nach="." />
            </>,
            <>
              <Formel tex={t`f'\left(\tfrac{\pi}{2}\right)=3\cdot\tfrac{\pi^2}{4}-2\cdot 1-5\cdot 0\approx 7{,}40-2=5{,}40`} nach="." />
            </>,
            <>
              <Formel tex={t`g'(x)=4\cdot 0{,}5\,e^{0{,}5x}=2e^{0{,}5x}`} nach="," /> also <Formel tex="g'(0)=2" nach="." />
            </>,
          ]}
        >
          <p>
            Bilde die Ableitungen von <Formel tex={t`f(x)=x^3+2\cos x-5\sin x+7`} /> und <Formel tex={t`g(x)=4e^{0{,}5x}`} nach="." /> Berechne <Formel tex="f'(0)" nach="," /> <Formel tex={t`f'\left(\tfrac{\pi}{2}\right)`} /> und <Formel tex="g'(0)" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="grafisch-ableiten">
        <Kontrolle
          aussage="grafisch-ableiten"
          nummer="K16"
          titel="Grafisch ableiten"
          felder={[
            { id: 'a', name: 'Steigung von K f an der Stelle 0, auf eine Nachkommastelle', beschriftung: <><Formel tex="f'(0)" /></>, erwartet: K16.d0, toleranz: 0.3 },
            { id: 'b', name: 'positive Nullstelle der Ableitung', beschriftung: <>positive Nullstelle von <Formel tex="f'" /></>, erwartet: K16.nst, toleranz: 0.2 },
            { id: 'c', name: 'Steigung von K f an der Stelle 2, auf eine Nachkommastelle', beschriftung: <><Formel tex="f'(2)" /></>, erwartet: K16.d2, toleranz: 0.4 },
          ]}
          hilfen={[
            <>Beim grafischen Ableiten liest du die Steigung der Tangente an <Formel tex="K_f" /> an einzelnen Stellen ab und trägst sie als y-Wert von <Formel tex="K_{f'}" /> ein (Modul <Modulverweis modul="grafisches-differenzieren">Grafisches Differenzieren</Modulverweis>).</>,
            <>Wo <Formel tex="K_f" /> einen Hoch- oder Tiefpunkt hat, ist die Tangente waagerecht und <Formel tex="f'" /> hat eine Nullstelle. Die Werte nach Augenmaß dürfen etwas abweichen.</>,
          ]}
          loesung={[
            <>
              Bei <Formel tex="x=0" /> läuft <Formel tex="K_f" /> mit der Tangente <Formel tex="y=-x" /> durch den Ursprung. Das Steigungsdreieck ist 1 nach rechts, 1 nach unten, also <Formel tex="f'(0)\approx-1" nach="." />
            </>,
            <>
              Waagerechte Tangenten haben <Formel tex="H" /> bei <Formel tex="x=-1" /> und <Formel tex="T" /> bei <Formel tex="x=1" nach="." /> Die positive Nullstelle von <Formel tex="f'" /> ist also 1. Bei <Formel tex="x=2" /> steigt <Formel tex="K_f" /> steil, die Steigung ist etwa 3.
            </>,
            <>
              Das Schaubild von <Formel tex="f'" /> ist eine nach oben geöffnete Parabel mit den Nullstellen bei <Formel tex="-1" /> und <Formel tex="1" /> und dem Tiefpunkt bei <Formel tex={t`(0\,|\,-1)`} nach="." />
              <Bild daten={BILD_K16_ABLEITUNG} unter={<>Das Schaubild von <Formel tex="f'" /> (grün) mit den Nullstellen <Formel tex="N" nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Die Abbildung zeigt das Schaubild <Formel tex="K_f" nach="." /> Bestimme grafisch die Steigung an der Stelle <Formel tex="x=0" nach="," /> die positive Nullstelle von <Formel tex="f'" /> und die Steigung an der Stelle <Formel tex="x=2" nach="." /> Damit kannst du das Schaubild der Ableitung zeichnen.
          </p>
          <Bild daten={BILD_K16} unter={<>Das Schaubild <Formel tex="K_f" /> mit Hochpunkt <Formel tex="H" /> und Tiefpunkt <Formel tex="T" nach="." /></>} />
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K16_ABLEITUNG} unter={<>Das Schaubild der Ableitungsfunktion <Formel tex="f'" nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="aussagen-ableitungsschaubild">
        <Kontrollfrage
          aussage="aussagen-ableitungsschaubild"
          nummer="K17"
          titel="Aussagen anhand des Schaubilds der Ableitung"
          optionen={platziere(
            [
              opt('a', <>Die Funktion <Formel tex="f" /> hat bei <Formel tex="x=-2" /> einen Tiefpunkt.</>, true, <>Richtig.</>),
              opt('b', <>Die Funktion <Formel tex="f" /> hat bei <Formel tex="x=1" /> einen Tiefpunkt.</>, false, <><Formel tex="K_{f'}" /> berührt die x-Achse bei <Formel tex="x=1" /> nur. Links und rechts davon verläuft es oberhalb der x-Achse, es gibt keinen Vorzeichenwechsel. Bei <Formel tex="x=1" /> hat <Formel tex="K_f" /> einen Sattelpunkt.</>),
              opt('c', <>Die Funktion <Formel tex="f" /> ist für <Formel tex="x>1" /> monoton fallend.</>, false, <>Für <Formel tex="x>1" /> verläuft <Formel tex="K_{f'}" /> oberhalb der x-Achse, es ist <Formel tex="f'>0" nach="." /> Also ist <Formel tex="f" /> dort monoton wachsend.</>),
              opt('d', <>Die Funktion <Formel tex="f" /> hat bei <Formel tex="x=-2" /> einen Hochpunkt.</>, false, <>Bei einem Hochpunkt wechselt <Formel tex="f'" /> von plus nach minus. <Formel tex="K_{f'}" /> wechselt bei <Formel tex="x=-2" /> aber von minus nach plus, also ist es ein Tiefpunkt.</>),
            ],
            2,
          )}
          erklaerung={
            <>
              <p>
                Bei <Formel tex="x=-2" /> hat <Formel tex="K_{f'}" /> eine Nullstelle mit Vorzeichenwechsel von minus nach plus: <Formel tex="f" /> fällt zuerst und steigt danach, also Tiefpunkt. Bei <Formel tex="x=1" /> berührt <Formel tex="K_{f'}" /> die x-Achse, ohne sie zu schneiden. Die Steigung ist links und rechts positiv, <Formel tex="f" /> steigt durchgehend und hat einen waagerechten Wendepunkt, einen Sattelpunkt.
              </p>
              <Bild daten={BILD_K17} unter={<>Das Schaubild von <Formel tex="f'" /> (grün) mit den Nullstellen <Formel tex="N" nach="." /> Bei <Formel tex="x=-2" /> wechselt es das Vorzeichen, bei <Formel tex="x=1" /> nicht.</>} />
            </>
          }
        >
          <p>
            Die Abbildung zeigt das Schaubild von <Formel tex="f'" nach="," /> der ersten Ableitung einer Funktion <Formel tex="f" nach="." /> Welche Aussage über <Formel tex="K_f" /> ist richtig?
          </p>
          <Bild daten={BILD_K17} unter={<>Das Schaubild <Formel tex="K_{f'}" /> der ersten Ableitung.</>} />
        </Kontrollfrage>
      </Punkt>

      <Punkt id="monotonie">
        <Kontrolle
          aussage="monotonie"
          nummer="K18"
          titel="Monotonie anhand der ersten Ableitung"
          felder={[
            { id: 'a1', name: 'linke Grenze des Bereichs, in dem f monoton fällt', beschriftung: <><Formel tex="f" /> fällt ab <Formel tex="x=" /></>, erwartet: K18.grenze1 },
            { id: 'a2', name: 'rechte Grenze des Bereichs, in dem f monoton fällt', beschriftung: <><Formel tex="f" /> fällt bis <Formel tex="x=" /></>, erwartet: K18.grenze2 },
            { id: 'b', name: 'Stelle, bis zu der g monoton wächst, auf zwei Nachkommastellen', beschriftung: <><Formel tex="g" /> wächst bis <Formel tex="x=" /></>, erwartet: K18.xg, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Eine Funktion ist monoton wachsend, wo <Formel tex="f'>0" /> gilt, und monoton fallend, wo <Formel tex="f'<0" /> gilt. Die Grenzen liegen bei den Nullstellen von <Formel tex="f'" nach="." /> (Modul <Modulverweis modul="kurvendiskussion">Kurvendiskussion</Modulverweis>).</>,
            <>Bestimme die Nullstellen von <Formel tex="f'" /> und prüfe das Vorzeichen von <Formel tex="f'" /> zwischen ihnen mit einem Testwert.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f'(x)=3x^2-12x+9=3\,(x-1)(x-3)`} nach="." /> Das Schaubild von <Formel tex="f'" /> ist eine nach oben geöffnete Parabel mit den Nullstellen 1 und 3.
            </>,
            <>
              Zwischen 1 und 3 ist <Formel tex="f'<0" nach="," /> zum Beispiel <Formel tex={t`f'(2)=-3`} nach="." /> Dort fällt <Formel tex="f" nach="." /> Für <Formel tex="x<1" /> und <Formel tex="x>3" /> ist <Formel tex="f'>0" nach="," /> dort steigt <Formel tex="f" nach="." />
            </>,
            <>
              <Formel tex={t`g'(x)=3-e^x=0`} /> liefert <Formel tex={t`e^x=3`} nach="," /> also <Formel tex={t`x=\ln 3\approx 1{,}10`} nach="." /> Für <Formel tex="x<\ln 3" /> ist <Formel tex="g'(0)=2>0" nach="," /> <Formel tex="g" /> wächst. Für <Formel tex="x>\ln 3" /> ist <Formel tex={t`g'(2)=3-e^2<0`} nach="," /> <Formel tex="g" /> fällt.
            </>,
          ]}
        >
          <p>
            Erläutere das Monotonieverhalten von <Formel tex={t`f(x)=x^3-6x^2+9x+1`} /> und <Formel tex={t`g(x)=3x-e^x`} /> mit der ersten Ableitung. Gib an, zwischen welchen Stellen <Formel tex="f" /> monoton fällt, und bis zu welcher Stelle <Formel tex="g" /> monoton wächst.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="kruemmung">
        <Kontrolle
          aussage="kruemmung"
          nummer="K19"
          titel="Krümmung anhand der zweiten Ableitung"
          felder={[
            { id: 'a', name: 'Stelle, an der sich die Krümmung ändert', beschriftung: <>Krümmungswechsel bei <Formel tex="x=" /></>, erwartet: K19.xw },
            { id: 'b', name: 'Wert der zweiten Ableitung an der Stelle 0', beschriftung: <><Formel tex="f''(0)" /></>, erwartet: K19.ddf0 },
            { id: 'c', name: 'Wert der zweiten Ableitung an der Stelle 4', beschriftung: <><Formel tex="f''(4)" /></>, erwartet: K19.ddf4 },
          ]}
          hilfen={[
            <>Ist <Formel tex="f''>0" nach="," /> ist das Schaubild linksgekrümmt, ist <Formel tex="f''<0" nach="," /> ist es rechtsgekrümmt (Modul <Modulverweis modul="kurvendiskussion">Kurvendiskussion</Modulverweis>).</>,
            <>Bilde <Formel tex="f''" nach="," /> bestimme die Nullstelle und setze links und rechts davon ein.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f'(x)=3x^2-12x+9`} /> und <Formel tex={t`f''(x)=6x-12`} nach="." /> Das Schaubild von <Formel tex="f''" /> ist eine steigende Gerade mit der Nullstelle <Formel tex="x=2" nach="." />
            </>,
            <>
              Links davon: <Formel tex={t`f''(0)=-12<0`} nach="," /> also ist <Formel tex="K_f" /> für <Formel tex="x<2" /> rechtsgekrümmt. Rechts davon: <Formel tex={t`f''(4)=12>0`} nach="," /> also ist <Formel tex="K_f" /> für <Formel tex="x>2" /> linksgekrümmt. Bei <Formel tex="x=2" /> wechselt die Krümmung.
            </>,
          ]}
        >
          <p>
            Erläutere das Krümmungsverhalten von <Formel tex={t`f(x)=x^3-6x^2+9x+1`} /> mit der zweiten Ableitung. Gib die Stelle des Krümmungswechsels sowie <Formel tex="f''(0)" /> und <Formel tex="f''(4)" /> an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="extrempunkte-vzw">
        <Kontrolle
          aussage="extrempunkte-vzw"
          nummer="K20"
          titel="Extrempunkte mit dem Vorzeichenwechsel von f′"
          felder={[
            { id: 'a', name: 'y-Koordinate des Hochpunkts von f', beschriftung: <><Formel tex="f" nach=":" /> y des Hochpunkts</>, erwartet: K20.yH },
            { id: 'b', name: 'y-Koordinate des Tiefpunkts von f', beschriftung: <><Formel tex="f" nach=":" /> y des Tiefpunkts</>, erwartet: K20.yT },
            { id: 'c', name: 'x-Koordinate des Tiefpunkts von h', beschriftung: <><Formel tex="h" nach=":" /> <Formel tex="x" /> des Tiefpunkts</>, erwartet: K20.xTh },
            { id: 'd', name: 'y-Koordinate des Tiefpunkts von h', beschriftung: <><Formel tex="h" nach=":" /> <Formel tex="y" /> des Tiefpunkts</>, erwartet: K20.yTh },
            { id: 'e', name: 'Anzahl der Extrempunkte von h', beschriftung: <><Formel tex="h" nach=":" /> Anzahl der Extrempunkte</>, erwartet: K20.anzahlH },
          ]}
          hilfen={[
            <>Setze <Formel tex="f'(x)=0" nach="." /> Eine Nullstelle ist nur dann eine Extremstelle, wenn <Formel tex="f'" /> dort das Vorzeichen wechselt. Von plus nach minus ist es ein Hochpunkt, von minus nach plus ein Tiefpunkt.</>,
            <>Bei <Formel tex="h" /> klammerst du in <Formel tex="h'(x)" /> den Faktor <Formel tex="x^2" /> aus. Eine doppelte Nullstelle bedeutet keinen Vorzeichenwechsel.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f'(x)=3\,(x-1)(x-3)`} /> hat die Nullstellen 1 und 3. Bei <Formel tex="x=1" /> wechselt <Formel tex="f'" /> von plus nach minus: Hochpunkt, <Formel tex={t`f(1)=1-6+9+1=5`} nach="," /> also <Formel tex={t`H(1\,|\,5)`} nach="." /> Bei <Formel tex="x=3" /> wechselt <Formel tex="f'" /> von minus nach plus: Tiefpunkt, <Formel tex={t`f(3)=27-54+27+1=1`} nach="," /> also <Formel tex={t`T(3\,|\,1)`} nach="." />
              <Bild daten={BILD_K20} unter={<>Das Schaubild von <Formel tex="f" /> mit <Formel tex="H" nach="," /> <Formel tex="T" /> und dem Wendepunkt <Formel tex="W" nach="." /></>} />
            </>,
            <>
              <Formel tex={t`h'(x)=12x^3-12x^2=12x^2\,(x-1)`} /> hat die Nullstellen 0 (doppelt) und 1. Bei <Formel tex="x=0" /> wechselt <Formel tex="h'" /> das Vorzeichen nicht, dort ist kein Extrempunkt (sondern ein Sattelpunkt). Bei <Formel tex="x=1" /> wechselt <Formel tex="h'" /> von minus nach plus: Tiefpunkt <Formel tex={t`T(1\,|\,-1)`} nach="." /> Es gibt genau einen Extrempunkt.
            </>,
          ]}
        >
          <p>
            Bestimme die Koordinaten und die Art der Extrempunkte von <Formel tex={t`f(x)=x^3-6x^2+9x+1`} /> und von <Formel tex={t`h(x)=3x^4-4x^3`} nach="." /> Gib bei <Formel tex="f" /> die y-Koordinaten von Hoch- und Tiefpunkt an, bei <Formel tex="h" /> den Tiefpunkt und die Anzahl der Extrempunkte.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K20} unter={<>Das Schaubild von <Formel tex="f" /> mit Hochpunkt und Tiefpunkt.</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="wendepunkte-vzw">
        <Kontrolle
          aussage="wendepunkte-vzw"
          nummer="K21"
          titel="Wendepunkte mit dem Vorzeichenwechsel von f″"
          felder={[
            { id: 'a', name: 'y-Koordinate des Wendepunkts von f', beschriftung: <><Formel tex="f" nach=":" /> y des Wendepunkts</>, erwartet: K21.yW },
            { id: 'b', name: 'kleinere Wendestelle von h', beschriftung: <><Formel tex="h" nach=":" /> kleinere Wendestelle</>, erwartet: K21.xW1 },
            { id: 'c', name: 'größere Wendestelle von h, auf zwei Nachkommastellen', beschriftung: <><Formel tex="h" nach=":" /> größere Wendestelle</>, erwartet: K21.xW2, toleranz: TOL2 },
            { id: 'd', name: 'y-Koordinate des zweiten Wendepunkts von h, auf zwei Nachkommastellen', beschriftung: <><Formel tex="h" nach=":" /> y des zweiten Wendepunkts</>, erwartet: K21.yW2, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Setze <Formel tex="f''(x)=0" nach="." /> Eine Nullstelle von <Formel tex="f''" /> ist nur dann eine Wendestelle, wenn <Formel tex="f''" /> dort das Vorzeichen wechselt, also eine einfache Nullstelle ist.</>,
            <>Bei <Formel tex="h" /> ist <Formel tex={t`h''(x)=36x^2-24x`} nach="." /> Klammere aus und prüfe beide Nullstellen.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f''(x)=6x-12`} /> hat die einfache Nullstelle 2, <Formel tex="f''" /> wechselt von minus nach plus. Es ist <Formel tex={t`f(2)=8-24+18+1=3`} nach="," /> also <Formel tex={t`W(2\,|\,3)`} nach="." />
            </>,
            <>
              <Formel tex={t`h''(x)=36x^2-24x=12x\,(3x-2)`} /> hat die einfachen Nullstellen <Formel tex="x_1=0" /> und <Formel tex={t`x_2=\tfrac23`} nach="." /> An beiden wechselt <Formel tex="h''" /> das Vorzeichen, beide sind Wendestellen.
            </>,
            <>
              <Formel tex={t`h(0)=0`} /> und <Formel tex={t`h\left(\tfrac23\right)=3\cdot\tfrac{16}{81}-4\cdot\tfrac{8}{27}=\tfrac{16}{27}-\tfrac{32}{27}=-\tfrac{16}{27}\approx -0{,}59`} nach="." /> Also <Formel tex={t`W_1(0\,|\,0)`} /> und <Formel tex={t`W_2\left(\tfrac23\,|\,-\tfrac{16}{27}\right)`} nach="." /> Der Ursprung ist zugleich ein Sattelpunkt.
              <Bild daten={BILD_K21} unter={<>Das Schaubild von <Formel tex="h" /> mit den Wendepunkten <Formel tex="W" /> und dem Tiefpunkt <Formel tex="T" nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Bestimme die Wendepunkte von <Formel tex={t`f(x)=x^3-6x^2+9x+1`} /> und von <Formel tex={t`h(x)=3x^4-4x^3`} nach="." /> Gib bei <Formel tex="f" /> die y-Koordinate an, bei <Formel tex="h" /> beide Wendestellen und die y-Koordinate der zweiten.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K21} unter={<>Das Schaubild von <Formel tex="h" /> mit den beiden Wendepunkten.</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="produkt-kette">
        <Kontrolle
          aussage="produkt-kette"
          nummer="K22"
          titel="Kettenregel und Produktregel"
          felder={[
            { id: 'a', name: 'Ableitung von f an der Stelle 1', beschriftung: <><Formel tex="f'(1)" /></>, erwartet: K22.f1 },
            { id: 'b', name: 'Ableitung von g an der Stelle 1, auf zwei Nachkommastellen', beschriftung: <><Formel tex="g'(1)" /></>, erwartet: K22.g1, toleranz: TOL2 },
            { id: 'c', name: 'Ableitung von h an der Stelle Pi halbe, auf zwei Nachkommastellen', beschriftung: <><Formel tex={t`h'\left(\tfrac{\pi}{2}\right)`} /></>, erwartet: K22.hPi2, toleranz: TOL2 },
            { id: 'd', name: 'Ableitung von m an der Stelle 1, auf zwei Nachkommastellen', beschriftung: <><Formel tex="m'(1)" /></>, erwartet: K22.m1, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Bei einer Verkettung leitest du die äußere Funktion ab und multiplizierst mit der Ableitung der inneren Funktion (Kettenregel). Bei einem Produkt gilt <Formel tex={t`(u\cdot v)'=u'v+uv'`} nach="." /> (Modul <Modulverweis modul="produkt-kettenregel">Produktregel und Kettenregel</Modulverweis>).</>,
            <>Bei <Formel tex="g" nach="," /> <Formel tex="h" /> und <Formel tex="m" /> brauchst du die Produktregel, bei <Formel tex="m" /> zusätzlich die Kettenregel für <Formel tex={t`e^{-2x}`} nach="." /></>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f(x)=(2x-1)^4`} nach="," /> Kettenregel: <Formel tex={t`f'(x)=4\,(2x-1)^3\cdot 2=8\,(2x-1)^3`} nach="." /> Also <Formel tex="f'(1)=8" nach="." />
            </>,
            <>
              <Formel tex={t`g(x)=x^2e^{-x}`} nach="," /> Produktregel: <Formel tex={t`g'(x)=2xe^{-x}-x^2e^{-x}=(2x-x^2)\,e^{-x}`} nach="." /> Also <Formel tex={t`g'(1)=e^{-1}\approx 0{,}37`} nach="." />
            </>,
            <>
              <Formel tex={t`h(x)=(x^3-1)\cos x`} nach="," /> Produktregel: <Formel tex={t`h'(x)=3x^2\cos x-(x^3-1)\sin x`} nach="." /> Für <Formel tex={t`x=\tfrac{\pi}{2}`} /> ist <Formel tex={t`h'\left(\tfrac{\pi}{2}\right)=0-\left(\tfrac{\pi^3}{8}-1\right)\approx -2{,}88`} nach="." />
            </>,
            <>
              <Formel tex={t`m(x)=x\,e^{-2x}`} nach="," /> Produktregel und Kettenregel: <Formel tex={t`m'(x)=e^{-2x}+x\cdot(-2)e^{-2x}=(1-2x)\,e^{-2x}`} nach="." /> Also <Formel tex={t`m'(1)=-e^{-2}\approx -0{,}14`} nach="." />
            </>,
          ]}
        >
          <p>
            Leite ab und berechne den Wert an der angegebenen Stelle: <Formel tex={t`f(x)=(2x-1)^4`} /> bei <Formel tex="x=1" nach="," /> <Formel tex={t`g(x)=x^2e^{-x}`} /> bei <Formel tex="x=1" nach="," /> <Formel tex={t`h(x)=(x^3-1)\cos x`} /> bei <Formel tex={t`x=\tfrac{\pi}{2}`} /> und <Formel tex={t`m(x)=x\,e^{-2x}`} /> bei <Formel tex="x=1" nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="parameter-ableiten">
        <Kontrolle
          aussage="parameter-ableiten"
          nummer="K23"
          titel="Ableitungen mit Parameter"
          felder={[
            { id: 'a', name: 'Ableitung von f mit a gleich 2 an der Stelle 1', beschriftung: <><Formel tex="f_2'(1)" /></>, erwartet: K23.f1 },
            { id: 'b', name: 'Ableitung von g mit a gleich 2 an der Stelle Pi achtel', beschriftung: <><Formel tex={t`g_2'\left(\tfrac{\pi}{8}\right)`} /></>, erwartet: K23.gPi8 },
          ]}
          hilfen={[
            <>Ein Parameter wird beim Ableiten nach <Formel tex="x" /> wie eine feste Zahl behandelt. Leite zuerst allgemein mit <Formel tex="a" /> ab und setze danach ein.</>,
            <>Bei <Formel tex={t`g_a(x)=(\cos(ax))^2`} /> ist die Funktion doppelt verkettet: äußere Funktion Quadrat, mittlere Funktion Kosinus, innere Funktion <Formel tex="ax" nach="." /></>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f_a(x)=(ax^2+x)^3`} /> hat die Ableitung <Formel tex={t`f_a'(x)=3\,(ax^2+x)^2\,(2ax+1)`} nach="." /> Für <Formel tex="a=2" /> und <Formel tex="x=1" /> ist <Formel tex={t`f_2'(1)=3\cdot 3^2\cdot 5=135`} nach="." />
            </>,
            <>
              <Formel tex={t`g_a'(x)=2\cos(ax)\cdot(-\sin(ax))\cdot a=-2a\cos(ax)\sin(ax)`} nach="." /> Für <Formel tex="a=2" /> und <Formel tex={t`x=\tfrac{\pi}{8}`} /> ist <Formel tex={t`ax=\tfrac{\pi}{4}`} /> und <Formel tex={t`\cos\tfrac{\pi}{4}=\sin\tfrac{\pi}{4}=\tfrac{\sqrt2}{2}`} nach="," /> also <Formel tex={t`g_2'\left(\tfrac{\pi}{8}\right)=-4\cdot\tfrac12=-2`} nach="." />
            </>,
          ]}
        >
          <p>
            Bilde die Ableitung nach <Formel tex="x" nach=":" /> <Formel tex={t`f_a(x)=(ax^2+x)^3`} /> und <Formel tex={t`g_a(x)=(\cos(ax))^2`} nach="." /> Berechne <Formel tex="f_2'(1)" /> und <Formel tex={t`g_2'\left(\tfrac{\pi}{8}\right)`} nach="." />
          </p>
        </Kontrolle>
      </Punkt>
    </Abschnitt>
  );
}
