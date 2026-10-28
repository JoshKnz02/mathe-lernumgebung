import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_K24, BILD_K26, BILD_K28A, BILD_K28B, BILD_K29, BILD_K36, BILD_K37 } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K24, K25, K26, K27, K28, K29, K36, K37, TOL2 } from './werte';

/** Bereich Kurvendiskussion: Aussagen 24 bis 29. */
export function Kurve() {
  return (
    <Abschnitt id="kurve" titel="Kurvendiskussion">
      <p>Hier geht es um Extrem- und Wendepunkte bei allen Funktionstypen, um Wertebereich, Symmetrie, das Verhalten im Unendlichen und um trigonometrische Funktionen.</p>
      <Eingabehinweis />

      <Punkt id="extrempunkte-alle">
        <Kontrolle
          aussage="extrempunkte-alle"
          nummer="K24"
          titel="Extrempunkte bei verschiedenen Funktionstypen"
          felder={[
            { id: 'a', name: 'y-Koordinate des Hochpunkts von f', beschriftung: <><Formel tex="f" nach=":" /> Hochpunkt <Formel tex="y" /></>, erwartet: K24.yH },
            { id: 'b', name: 'y-Koordinate des Tiefpunkts von f', beschriftung: <><Formel tex="f" nach=":" /> Tiefpunkt <Formel tex="y" /></>, erwartet: K24.yT },
            { id: 'c', name: 'x-Koordinate des Tiefpunkts von g', beschriftung: <><Formel tex="g" nach=":" /> Tiefpunkt <Formel tex="x" /></>, erwartet: K24.xg },
            { id: 'd', name: 'y-Koordinate des Tiefpunkts von g, auf zwei Nachkommastellen', beschriftung: <><Formel tex="g" nach=":" /> Tiefpunkt <Formel tex="y" /></>, erwartet: K24.yg, toleranz: TOL2 },
            { id: 'e', name: 'x-Koordinate des Hochpunkts von h als Vielfaches von Pi', beschriftung: <><Formel tex="h" nach=":" /> Hochpunkt <Formel tex="x" /></>, erwartet: K24.xh },
            { id: 'f', name: 'y-Koordinate des Hochpunkts von h', beschriftung: <><Formel tex="h" nach=":" /> Hochpunkt <Formel tex="y" /></>, erwartet: K24.yh },
          ]}
          hilfen={[
            <>Bei jedem Funktionstyp gilt: <Formel tex="f'(x_E)=0" /> und <Formel tex="f''(x_E)\ne 0" nach="." /> Ist <Formel tex="f''(x_E)<0" nach="," /> liegt ein Hochpunkt vor, ist <Formel tex="f''(x_E)>0" nach="," /> ein Tiefpunkt (Modul <Modulverweis modul="ausfuehrliche-kurvendiskussion">Ausführliche Kurvendiskussion</Modulverweis>).</>,
            <>Bei <Formel tex="g" /> kannst du <Formel tex={t`e^x`} /> in <Formel tex="g'(x)=0" /> ausklammern, denn <Formel tex={t`e^x\ne 0`} nach="." /> Bei <Formel tex="h" /> löst du <Formel tex={t`\cos(2x)=0`} /> im Intervall <Formel tex={t`[0;\,\pi]`} nach="." /></>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f(x)=x^3-12x`} nach="." /> <Formel tex={t`f'(x)=3x^2-12=0`} /> liefert <Formel tex="x=\pm 2" nach="." /> Mit <Formel tex={t`f''(x)=6x`} /> ist <Formel tex={t`f''(-2)=-12<0`} /> (Hochpunkt) und <Formel tex={t`f''(2)=12>0`} /> (Tiefpunkt). <Formel tex={t`f(-2)=-8+24=16`} /> und <Formel tex={t`f(2)=8-24=-16`} nach="." /> Also <Formel tex={t`H(-2\,|\,16)`} /> und <Formel tex={t`T(2\,|\,-16)`} nach="." />
              <Bild daten={BILD_K24} unter={<>Das Schaubild von <Formel tex="f" /> mit Hochpunkt <Formel tex="H" /> und Tiefpunkt <Formel tex="T" /> und ihren waagerechten Tangenten.</>} />
            </>,
            <>
              <Formel tex={t`g(x)=(x-2)\,e^x`} nach="," /> Produktregel: <Formel tex={t`g'(x)=e^x+(x-2)\,e^x=(x-1)\,e^x`} nach="." /> Aus <Formel tex="g'(x)=0" /> folgt <Formel tex="x=1" nach="." /> Es ist <Formel tex={t`g''(x)=x\,e^x`} /> und <Formel tex={t`g''(1)=e>0`} nach="," /> also ein Tiefpunkt mit <Formel tex={t`g(1)=-e\approx -2{,}72`} nach="." />
            </>,
            <>
              <Formel tex={t`h(x)=3\sin(2x)+1`} /> auf <Formel tex={t`[0;\,\pi]`} nach="," /> <Formel tex={t`h'(x)=6\cos(2x)=0`} /> liefert <Formel tex={t`2x=\tfrac{\pi}{2}`} /> oder <Formel tex={t`2x=\tfrac{3\pi}{2}`} nach="," /> also <Formel tex={t`x=\tfrac{\pi}{4}`} /> oder <Formel tex={t`x=\tfrac{3\pi}{4}`} nach="." /> Mit <Formel tex={t`h''(x)=-12\sin(2x)`} /> ist <Formel tex={t`h''\left(\tfrac{\pi}{4}\right)=-12<0`} nach="," /> also ein Hochpunkt <Formel tex={t`H\left(\tfrac{\pi}{4}\,|\,4\right)`} nach="." /> Bei <Formel tex={t`\tfrac{3\pi}{4}`} /> liegt der Tiefpunkt <Formel tex={t`T\left(\tfrac{3\pi}{4}\,|\,-2\right)`} nach="." />
            </>,
          ]}
        >
          <p>
            Bestimme die exakten Koordinaten der Extrempunkte und unterscheide Hoch- und Tiefpunkte. Gegeben sind <Formel tex={t`f(x)=x^3-12x`} nach="," /> <Formel tex={t`g(x)=(x-2)\,e^x`} /> und <Formel tex={t`h(x)=3\sin(2x)+1`} /> im Intervall <Formel tex={t`[0;\,\pi]`} nach="." /> Gib bei <Formel tex="f" /> beide y-Koordinaten an, bei <Formel tex="g" /> den Tiefpunkt (y auf zwei Nachkommastellen) und bei <Formel tex="h" /> den Hochpunkt.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K24} unter={<>Das Schaubild von <Formel tex="f" /> mit Hochpunkt und Tiefpunkt.</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="wendepunkte-alle">
        <Kontrolle
          aussage="wendepunkte-alle"
          nummer="K25"
          titel="Wendepunkte bei verschiedenen Funktionstypen"
          felder={[
            { id: 'a', name: 'Wendestelle von f', beschriftung: <><Formel tex="f" nach=":" /> Wendestelle <Formel tex="x" /></>, erwartet: K25.xwf },
            { id: 'b', name: 'y-Koordinate des Wendepunkts von g', beschriftung: <><Formel tex="g" nach=":" /> Wendepunkt <Formel tex="y" /></>, erwartet: K25.ywg },
            { id: 'c', name: 'Wendestelle von h im Intervall von 0 bis Pi als Vielfaches von Pi', beschriftung: <><Formel tex="h" nach=":" /> Wendestelle <Formel tex="x" /></>, erwartet: K25.xwh },
          ]}
          hilfen={[
            <>Eine Wendestelle erfüllt <Formel tex="f''(x_W)=0" /> und <Formel tex="f'''(x_W)\ne 0" /> (oder <Formel tex="f''" /> wechselt das Vorzeichen).</>,
            <>Verwende die zweiten Ableitungen aus K24: <Formel tex={t`f''(x)=6x`} nach="," /> <Formel tex={t`g''(x)=x\,e^x`} /> und <Formel tex={t`h''(x)=-12\sin(2x)`} nach="." /></>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f''(x)=6x=0`} /> liefert <Formel tex="x=0" /> mit <Formel tex={t`f'''(0)=6\ne 0`} nach="," /> also <Formel tex={t`W(0\,|\,0)`} nach="." />
            </>,
            <>
              <Formel tex={t`g''(x)=x\,e^x=0`} /> liefert <Formel tex="x=0" /> (der Faktor <Formel tex="e^x" /> ist nie null). <Formel tex="g''" /> wechselt von minus nach plus. <Formel tex={t`g(0)=-2`} nach="," /> also <Formel tex={t`W(0\,|\,-2)`} nach="." />
            </>,
            <>
              <Formel tex={t`h''(x)=-12\sin(2x)=0`} /> liefert <Formel tex={t`2x=0`} nach="," /> <Formel tex={t`2x=\pi`} /> oder <Formel tex={t`2x=2\pi`} nach="." /> Im Inneren des Intervalls liegt <Formel tex={t`x=\tfrac{\pi}{2}`} /> mit <Formel tex={t`h\left(\tfrac{\pi}{2}\right)=1`} nach="," /> also <Formel tex={t`W\left(\tfrac{\pi}{2}\,|\,1\right)`} nach="." />
            </>,
          ]}
        >
          <p>
            Bestimme die Wendepunkte der Funktionen aus K24: <Formel tex={t`f(x)=x^3-12x`} nach="," /> <Formel tex={t`g(x)=(x-2)\,e^x`} /> und <Formel tex={t`h(x)=3\sin(2x)+1`} /> im Intervall <Formel tex={t`]0;\,\pi[`} nach="." /> Gib bei <Formel tex="f" /> die Wendestelle an, bei <Formel tex="g" /> die y-Koordinate und bei <Formel tex="h" /> die Wendestelle.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="wertebereich">
        <Kontrolle
          aussage="wertebereich"
          nummer="K26"
          titel="Wertebereich"
          felder={[
            { id: 'a', name: 'kleinster Funktionswert von f auf dem Intervall', beschriftung: <><Formel tex="f" nach=":" /> kleinster Wert</>, erwartet: K26.min },
            { id: 'b', name: 'größter Funktionswert von f auf dem Intervall', beschriftung: <><Formel tex="f" nach=":" /> größter Wert</>, erwartet: K26.max },
            { id: 'c', name: 'kleinster Funktionswert von g', beschriftung: <><Formel tex="g" nach=":" /> kleinster Wert</>, erwartet: K26.gMin },
            { id: 'd', name: 'größter Funktionswert von g', beschriftung: <><Formel tex="g" nach=":" /> größter Wert</>, erwartet: K26.gMax },
          ]}
          hilfen={[
            <>Der Wertebereich besteht aus allen Funktionswerten. Bei eingeschränktem Definitionsbereich vergleichst du den Extremwert mit den Randwerten (Modul <Modulverweis modul="umkehrfunktion">Umkehrfunktion</Modulverweis>).</>,
            <>Bei <Formel tex="g" /> liegt die Sinusfunktion zwischen <Formel tex="-1" /> und <Formel tex="1" nach="." /> Strecke, verschiebe und lies den Wertebereich ab.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f(x)=-x^2+9`} /> ist eine nach unten geöffnete Parabel mit dem Hochpunkt <Formel tex={t`H(0\,|\,9)`} nach="." /> Die Randwerte sind <Formel tex={t`f(-4)=-7`} /> und <Formel tex={t`f(2)=5`} nach="." /> Der größte Wert ist 9, der kleinste −7. Der Wertebereich ist <Formel tex={t`W_f=[-7;\,9]`} nach="." />
              <Bild daten={BILD_K26} unter={<>Das Schaubild von <Formel tex="f" /> auf <Formel tex={t`[-4;\,2]`} /> mit dem Hochpunkt <Formel tex="H" /> und den Randpunkten <Formel tex="R" nach="." /></>} />
            </>,
            <>
              <Formel tex={t`g(x)=2\sin(x-3)+5`} /> schwankt um die Ruhelage 5 mit der Amplitude 2. Der Wertebereich ist <Formel tex={t`W_g=[3;\,7]`} nach="." />
            </>,
          ]}
        >
          <p>
            Bestimme den Wertebereich von <Formel tex={t`f(x)=-x^2+9`} /> für <Formel tex={t`x\in[-4;\,2]`} /> und von <Formel tex={t`g(x)=2\sin(x-3)+5`} nach="." /> Gib jeweils den kleinsten und den größten Funktionswert an.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K26} unter={<>Das Schaubild von <Formel tex="f" /> auf <Formel tex={t`[-4;\,2]`} nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="symmetrie">
        <Kontrolle
          aussage="symmetrie"
          nummer="K27"
          titel="Symmetrieeigenschaften"
          felder={[
            { id: 'f', name: 'Symmetrie von f', beschriftung: <><Formel tex={t`f(x)=x^4-3x^2+2`} /></>, erwartet: K27.code.f },
            { id: 'g', name: 'Symmetrie von g', beschriftung: <><Formel tex={t`g(x)=2x^3+x`} /></>, erwartet: K27.code.g },
            { id: 'h', name: 'Symmetrie von h', beschriftung: <><Formel tex={t`h(x)=x^3-x^2+1`} /></>, erwartet: K27.code.h },
            { id: 'v', name: 'Symmetrie von v', beschriftung: <><Formel tex={t`v(x)=3\cos(0{,}5x)`} /></>, erwartet: K27.code.v },
            { id: 'w', name: 'Symmetrie von w', beschriftung: <><Formel tex={t`w(x)=2\sin(3x)`} /></>, erwartet: K27.code.w },
          ]}
          hilfen={[
            <>Prüfe <Formel tex="f(-x)" nach=":" /> Ist <Formel tex="f(-x)=f(x)" nach="," /> ist das Schaubild symmetrisch zur y-Achse. Ist <Formel tex="f(-x)=-f(x)" nach="," /> ist es symmetrisch zum Ursprung (Modul <Modulverweis modul="ausfuehrliche-kurvendiskussion">Ausführliche Kurvendiskussion</Modulverweis>).</>,
            <>Bei Sinus und Kosinus nutzt du <Formel tex={t`\sin(-x)=-\sin x`} /> und <Formel tex={t`\cos(-x)=\cos x`} nach="." /> Trage die Zahl 1 für Symmetrie zur y-Achse ein, 2 für Symmetrie zum Ursprung und 3, wenn keines von beiden gilt.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f(-x)=(-x)^4-3(-x)^2+2=x^4-3x^2+2=f(x)`} nach="." /> Nur gerade Hochzahlen: Symmetrie zur y-Achse, Eingabe 1.
            </>,
            <>
              <Formel tex={t`g(-x)=-2x^3-x=-g(x)`} nach="." /> Nur ungerade Hochzahlen: Symmetrie zum Ursprung, Eingabe 2.
            </>,
            <>
              <Formel tex={t`h(-x)=-x^3-x^2+1`} /> ist weder <Formel tex="h(x)" /> noch <Formel tex="-h(x)" nach="." /> Gerade und ungerade Hochzahlen sind gemischt: keine dieser Symmetrien, Eingabe 3.
            </>,
            <>
              <Formel tex={t`v(-x)=3\cos(-0{,}5x)=3\cos(0{,}5x)=v(x)`} nach="." /> Der Kosinus ist symmetrisch zur y-Achse, die Streckung ändert daran nichts: Eingabe 1.
            </>,
            <>
              <Formel tex={t`w(-x)=2\sin(-3x)=-2\sin(3x)=-w(x)`} nach="." /> Der Sinus ist symmetrisch zum Ursprung: Eingabe 2.
            </>,
          ]}
        >
          <p>
            Untersuche rechnerisch, welche Symmetrie das Schaubild jeder Funktion hat. Trage 1 ein für Symmetrie zur y-Achse, 2 für Symmetrie zum Ursprung und 3 für keine von beiden.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="globales-verhalten">
        <Kontrollfrage
          aussage="globales-verhalten"
          teil="a"
          nummer="K28a"
          titel="Globales Verhalten einer Polynomfunktion"
          optionen={platziere(
            [
              opt('a', <>Für <Formel tex={t`x\to-\infty`} /> geht <Formel tex="g(x)" /> gegen <Formel tex={t`\infty`} nach="," /> für <Formel tex={t`x\to\infty`} /> gegen <Formel tex={t`-\infty`} nach="." /></>, true, <>Richtig.</>),
              opt('b', <>Für <Formel tex={t`x\to-\infty`} /> geht <Formel tex="g(x)" /> gegen <Formel tex={t`-\infty`} nach="," /> für <Formel tex={t`x\to\infty`} /> gegen <Formel tex={t`\infty`} nach="." /></>, false, <>Der höchste Summand ist <Formel tex="-2x^5" nach="," /> der Koeffizient ist negativ. Für große positive <Formel tex="x" /> geht er gegen <Formel tex={t`-\infty`} nach="," /> nicht gegen <Formel tex={t`\infty`} nach="." /></>),
              opt('c', <>Für <Formel tex={t`x\to\pm\infty`} /> geht <Formel tex="g(x)" /> gegen <Formel tex={t`-\infty`} nach="." /></>, false, <>Das gilt für eine gerade Hochzahl mit negativem Koeffizienten. Bei einer ungeraden Hochzahl wie 5 hat <Formel tex="g(x)" /> für positive und negative <Formel tex="x" /> verschiedene Vorzeichen.</>),
              opt('d', <>Für <Formel tex={t`x\to\pm\infty`} /> geht <Formel tex="g(x)" /> gegen 0.</>, false, <>Gegen 0 geht <Formel tex="g(x)" /> nur, wenn alle Summanden gegen 0 gehen. Hier wächst <Formel tex="-2x^5" /> über alle Grenzen.</>),
            ],
            1,
          )}
          erklaerung={
            <>
              <p>
                Für große <Formel tex="|x|" /> entscheidet der Summand mit der höchsten Hochzahl, hier <Formel tex="-2x^5" nach="." /> Die Hochzahl 5 ist ungerade und der Koeffizient negativ: Das Schaubild kommt aus dem zweiten Quadranten und läuft in den vierten Quadranten.
              </p>
              <Bild daten={BILD_K28A} unter={<>Das Schaubild von <Formel tex="g" /> verläuft vom zweiten in den vierten Quadranten.</>} />
            </>
          }
        >
          <p>
            Beschreibe das globale Verhalten von <Formel tex={t`g(x)=-2x^5+x^3`} nach="." />
          </p>
        </Kontrollfrage>
        <Kontrolle
          aussage="globales-verhalten"
          teil="b"
          nummer="K28b"
          titel="Asymptote und Grenzwert"
          felder={[
            { id: 'm', name: 'Steigung der Asymptote von i', beschriftung: <>Asymptote von <Formel tex="i" nach=":" /> <Formel tex="m" /></>, erwartet: K28.m },
            { id: 'n', name: 'y-Achsenabschnitt der Asymptote von i', beschriftung: <><Formel tex="n" /></>, erwartet: K28.n },
            { id: 'g', name: 'Grenzwert von j für x gegen unendlich', beschriftung: <>Grenzwert von <Formel tex="j" /> für <Formel tex={t`x\to\infty`} /></>, erwartet: K28.grenzwert },
          ]}
          hilfen={[
            <>Für <Formel tex={t`x\to\infty`} /> geht <Formel tex={t`e^{-x}`} /> gegen 0. Der Rest des Terms ist dann die Asymptote (Modul <Modulverweis modul="ausfuehrliche-kurvendiskussion">Ausführliche Kurvendiskussion</Modulverweis>).</>,
            <>Bei <Formel tex="j" /> steht ein Produkt aus einer Potenz und <Formel tex={t`e^{-x}`} nach="." /> Die Exponentialfunktion mit negativem Exponenten geht schneller gegen 0, als die Potenz wächst.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`i(x)=3x-1+e^{-x}`} nach="." /> Für <Formel tex={t`x\to\infty`} /> geht <Formel tex={t`e^{-x}`} /> gegen 0, der Abstand von <Formel tex="K_i" /> zur Geraden <Formel tex="y=3x-1" /> geht gegen 0. Das ist eine schräge Asymptote, <Formel tex="m=3" /> und <Formel tex="n=-1" nach="." />
              <Bild daten={BILD_K28B} unter={<>Das Schaubild von <Formel tex="i" /> nähert sich nach rechts der Geraden <Formel tex="y=3x-1" /> (blau gestrichelt) an.</>} />
            </>,
            <>
              <Formel tex={t`j(x)=2x^2e^{-x}`} nach="." /> Für <Formel tex={t`x\to\infty`} /> geht <Formel tex="2x^2" /> gegen <Formel tex={t`\infty`} /> und <Formel tex={t`e^{-x}`} /> gegen 0. Der Faktor <Formel tex={t`e^{-x}`} /> setzt sich durch: <Formel tex={t`\lim_{x\to\infty}j(x)=0`} nach="." /> Die x-Achse ist waagerechte Asymptote nach rechts.
            </>,
          ]}
        >
          <p>
            Bestimme die schräge Asymptote von <Formel tex={t`i(x)=3x-1+e^{-x}`} /> für <Formel tex={t`x\to\infty`} /> und den Grenzwert von <Formel tex={t`j(x)=2x^2e^{-x}`} /> für <Formel tex={t`x\to\infty`} nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="trig-eigenschaften">
        <Kontrolle
          aussage="trig-eigenschaften"
          nummer="K29"
          titel="Trigonometrische Funktion aus den Abbildungseigenschaften"
          felder={[
            { id: 'p', name: 'Periode', beschriftung: <>Periode</>, erwartet: K29.periode },
            { id: 'xt', name: 'x-Koordinate des Tiefpunkts', beschriftung: <>Tiefpunkt: <Formel tex="x" /></>, erwartet: K29.xT },
            { id: 'yt', name: 'y-Koordinate des Tiefpunkts', beschriftung: <>Tiefpunkt: <Formel tex="y" /></>, erwartet: K29.yT },
            { id: 'yh', name: 'y-Koordinate der Hochpunkte', beschriftung: <>Hochpunkt: <Formel tex="y" /></>, erwartet: K29.yH },
            { id: 'yw', name: 'y-Koordinate der Wendepunkte', beschriftung: <>Wendepunkte: <Formel tex="y" /></>, erwartet: K29.yW },
          ]}
          hilfen={[
            <>Lies die Parameter ab: <Formel tex="a" /> ist die Streckung in y-Richtung, <Formel tex="b" /> die Streckung in x-Richtung (die Periode ist <Formel tex={t`\frac{2\pi}{b}`} nach=")," /> <Formel tex="c" /> die Verschiebung in x-Richtung, <Formel tex="d" /> die Verschiebung in y-Richtung (Modul <Modulverweis modul="markante-punkte">Markante Punkte</Modulverweis>).</>,
            <>Der Kosinus mit <Formel tex="a<0" /> hat dort einen Tiefpunkt, wo das Argument 0 ist. Zwischen zwei aufeinanderfolgenden markanten Punkten liegt immer eine Viertelperiode.</>,
          ]}
          loesung={[
            <>
              Parameter: <Formel tex="a=-3" nach="," /> <Formel tex={t`b=\tfrac{\pi}{2}`} nach="," /> <Formel tex="c=1" nach="," /> <Formel tex="d=-1" nach="." /> Die Periode ist <Formel tex={t`p=\frac{2\pi}{\pi/2}=4`} nach="." />
            </>,
            <>
              Wegen <Formel tex="a<0" /> liegt bei <Formel tex="x=c=1" /> ein Tiefpunkt, <Formel tex={t`y=-3-1=-4`} nach="," /> also <Formel tex={t`T(1\,|\,-4)`} nach="." /> Eine halbe Periode weiter, bei <Formel tex="x=3" nach="," /> liegt ein Hochpunkt mit <Formel tex={t`y=3-1=2`} nach="." />
            </>,
            <>
              Die Wendepunkte liegen mittig zwischen den Extrempunkten, eine Viertelperiode von ihnen entfernt, bei <Formel tex="x=0" nach="," /> <Formel tex="x=2" /> und <Formel tex="x=4" nach="." /> Sie liegen auf der Ruhelage <Formel tex="y=d=-1" nach="." /> Der Wertebereich ist <Formel tex={t`[-4;\,2]`} nach="." />
              <Bild daten={BILD_K29} unter={<>Das Schaubild mit dem Tiefpunkt <Formel tex="T" nach="," /> dem Hochpunkt <Formel tex="H" /> und den Wendepunkten <Formel tex="W" /> auf der Ruhelage (blau gestrichelt).</>} />
            </>,
          ]}
        >
          <p>
            Bestimme die Extrem- und Wendepunkte von <Formel tex={t`f(x)=-3\cos\left(\tfrac{\pi}{2}\,(x-1)\right)-1`} /> allein aus den Abbildungseigenschaften. Gib die Periode, den Tiefpunkt, die y-Koordinate der Hochpunkte und die y-Koordinate der Wendepunkte an.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K29} unter={<>Das Schaubild von <Formel tex="f" /> mit den markanten Punkten.</>} />
        </Kontrollschaubild>
      </Punkt>
      <Punkt id="kleinste-steigung">
        <Kontrolle
          aussage="kleinste-steigung"
          nummer="K36"
          titel="Kleinste Steigung"
          felder={[
            { id: 'x', name: 'Stelle mit der kleinsten Steigung', beschriftung: <>Stelle <Formel tex="x" /></>, erwartet: K36.xw },
            { id: 'm', name: 'kleinste Steigung', beschriftung: <>kleinste Steigung</>, erwartet: K36.minSteigung },
          ]}
          hilfen={[
            <>Die Steigung von <Formel tex="K_f" /> ist <Formel tex="f'(x)" nach="." /> Gesucht ist der kleinste Wert von <Formel tex="f'" /> (Modul <Modulverweis modul="kurvendiskussion">Kurvendiskussion</Modulverweis>).</>,
            <>Der kleinste Wert von <Formel tex="f'" /> liegt an einer Stelle mit <Formel tex="f''(x)=0" nach="." /> Hier ist <Formel tex="f'" /> eine nach oben geöffnete Parabel, ihr Scheitel ist der tiefste Punkt.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f'(x)=3x^2-12x+9`} /> und <Formel tex={t`f''(x)=6x-12=0`} /> liefert <Formel tex="x=2" nach="." /> Dort wechselt <Formel tex="f''" /> von minus nach plus, <Formel tex="f'" /> hat ein Minimum.
            </>,
            <>
              <Formel tex={t`f'(2)=12-24+9=-3`} nach="." /> Die kleinste Steigung von <Formel tex="K_f" /> beträgt <Formel tex="-3" /> an der Wendestelle <Formel tex="x=2" nach="." /> Eine Parabel nach oben geöffnet hat keinen größten Wert, es gibt also keine größte Steigung.
              <Bild daten={BILD_K36} unter={<>Das Schaubild von <Formel tex="f'" /> (grün) hat im Tiefpunkt <Formel tex="T" /> bei <Formel tex="x=2" /> den kleinsten Wert.</>} />
            </>,
          ]}
        >
          <p>
            Bestimme die Stelle, an der das Schaubild von <Formel tex={t`f(x)=x^3-6x^2+9x+1`} /> die kleinste Steigung hat, und gib diese Steigung an.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K36} unter={<>Das Schaubild der Ableitungsfunktion <Formel tex="f'" nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="globale-extrema">
        <Kontrolle
          aussage="globale-extrema"
          nummer="K37"
          titel="Globale Extrema auf einem Intervall"
          felder={[
            { id: 'max', name: 'größter Funktionswert auf dem Intervall', beschriftung: <>größter Wert</>, erwartet: K37.max },
            { id: 'min', name: 'kleinster Funktionswert auf dem Intervall', beschriftung: <>kleinster Wert</>, erwartet: K37.min },
            { id: 'n', name: 'Anzahl der Stellen, an denen der größte Wert angenommen wird', beschriftung: <>Stellen mit dem größten Wert</>, erwartet: K37.anzahl },
          ]}
          hilfen={[
            <>Auf einem abgeschlossenen Intervall liegt das globale Maximum an einer Extremstelle im Inneren oder an einem Rand. Vergleiche alle Kandidaten (Modul <Modulverweis modul="optimierung">Optimierung</Modulverweis>).</>,
            <>Die Extremstellen von <Formel tex="f" /> sind <Formel tex="x=1" /> und <Formel tex="x=3" nach="." /> Berechne dazu <Formel tex="f(0)" /> und <Formel tex="f(4)" nach="." /></>,
          ]}
          loesung={[
            <>
              Kandidaten: die Ränder <Formel tex="x=0" /> und <Formel tex="x=4" /> sowie die Extremstellen im Inneren <Formel tex="x=1" /> und <Formel tex="x=3" nach="." />
            </>,
            <>
              <Formel tex={t`f(0)=1`} nach="," /> <Formel tex={t`f(1)=5`} nach="," /> <Formel tex={t`f(3)=1`} nach="," /> <Formel tex={t`f(4)=64-96+36+1=5`} nach="." /> Das globale Maximum ist 5, es wird an zwei Stellen angenommen, bei <Formel tex="x=1" /> und am Rand <Formel tex="x=4" nach="." /> Das globale Minimum ist 1 bei <Formel tex="x=0" /> und <Formel tex="x=3" nach="." />
              <Bild daten={BILD_K37} unter={<>Auf <Formel tex={t`[0;\,4]`} /> hat <Formel tex="K_f" /> den größten Wert 5 in <Formel tex="H" /> und <Formel tex="R" nach="," /> den kleinsten Wert 1 in <Formel tex="R" /> und <Formel tex="T" nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Bestimme die globalen Extrema von <Formel tex={t`f(x)=x^3-6x^2+9x+1`} /> auf dem Intervall <Formel tex={t`[0;\,4]`} nach="." /> Gib den größten und den kleinsten Funktionswert an und die Anzahl der Stellen, an denen der größte Wert angenommen wird.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K37} unter={<>Das Schaubild von <Formel tex="f" /> auf <Formel tex={t`[0;\,4]`} nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>
    </Abschnitt>
  );
}
