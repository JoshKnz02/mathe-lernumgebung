import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_K9, BILD_K10 } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K8, K9, K10, TOL2 } from './werte';

/** Bereich Bestimmtes Integral: Aussagen 8 bis 10. */
export function Integral() {
  return (
    <Abschnitt id="integral" titel="Bestimmtes Integral">
      <p>Hier geht es um die Berechnung des bestimmten Integrals mit einer Stammfunktion, um die Deutung als Flächenbilanz und um das Vorzeichen eines Integrals.</p>
      <Eingabehinweis />

      <Punkt id="integral-berechnen">
        <Kontrolle
          aussage="integral-berechnen"
          nummer="K8"
          titel="Bestimmtes Integral berechnen"
          felder={[{ id: 'w', name: 'Wert des Integrals von minus 1 bis 2', beschriftung: <>Wert des Integrals</>, erwartet: K8.wert, toleranz: TOL2 }]}
          hilfen={[
            <>Bilde eine Stammfunktion <Formel tex="F" /> und berechne <Formel tex={t`F(b)-F(a)`} /> (Modul <Modulverweis modul="bestimmtes-integral">Das bestimmte Integral</Modulverweis>).</>,
            <>Achte bei der unteren Grenze <Formel tex="-1" /> auf die Vorzeichen: <Formel tex={t`(-1)^4=1`} nach="," /> aber <Formel tex={t`(-1)^3=-1`} nach="." /></>,
          ]}
          loesung={[
            <>
              Eine Stammfunktion ist <Formel tex={t`F(x)=\frac{1}{4}x^4-x^3+x`} nach="." />
            </>,
            <>
              Es ist <Formel tex={t`F(2)=4-8+2=-2`} /> und <Formel tex={t`F(-1)=\frac{1}{4}+1-1=\frac{1}{4}`} nach="." /> Also ist das Integral <Formel tex={t`F(2)-F(-1)=-2-\frac{1}{4}=-\frac{9}{4}`} nach="." />
            </>,
          ]}
        >
          <p>
            Berechne <Formel tex={t`\int_{-1}^{2}\left(x^3-3x^2+1\right)\mathrm{d}x`} nach="." />
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="flaechenbilanz">
        <Kontrolle
          aussage="flaechenbilanz"
          nummer="K9"
          titel="Integral als Flächenbilanz"
          felder={[
            { id: 'oben', name: 'Inhalt der Fläche oberhalb der x-Achse', beschriftung: <>Fläche oberhalb</>, erwartet: K9.oben },
            { id: 'unten', name: 'Inhalt der Fläche unterhalb der x-Achse', beschriftung: <>Fläche unterhalb</>, erwartet: K9.unten },
            { id: 'int', name: 'Wert des Integrals von 0 bis drei Pi halbe', beschriftung: <>Wert des Integrals</>, erwartet: K9.integral },
          ]}
          hilfen={[
            <>Das Integral ist die Bilanz der Flächen: Flächen oberhalb der x-Achse zählen positiv, Flächen unterhalb negativ. Der Flächeninhalt ist dagegen immer positiv (Modul <Modulverweis modul="bestimmtes-integral">Das bestimmte Integral</Modulverweis>).</>,
            <>Die Nullstelle liegt bei <Formel tex="\pi" nach="." /> Berechne die Teilintegrale von <Formel tex="0" /> bis <Formel tex="\pi" /> und von <Formel tex="\pi" /> bis <Formel tex={t`\frac{3\pi}{2}`} nach="." /> Eine Stammfunktion von <Formel tex={t`2\sin x`} /> ist <Formel tex={t`-2\cos x`} nach="." /></>,
          ]}
          loesung={[
            <>
              Von <Formel tex="0" /> bis <Formel tex="\pi" /> liegt <Formel tex="K_f" /> oberhalb: <Formel tex={t`\int_0^{\pi}2\sin x\,\mathrm{d}x=-2\cos\pi+2\cos 0=2+2=4`} nach="." />
            </>,
            <>
              Von <Formel tex="\pi" /> bis <Formel tex={t`\frac{3\pi}{2}`} /> liegt <Formel tex="K_f" /> unterhalb: <Formel tex={t`-2\cos\frac{3\pi}{2}+2\cos\pi=0-2=-2`} nach="." /> Der Flächeninhalt ist <Formel tex="2" nach="." />
              <FlaechenFigur daten={BILD_K9} unter={<>Oberhalb der x-Achse ein Flächeninhalt von 4 (blau), unterhalb von 2 (rosa).</>} />
            </>,
            <>
              Das Integral ist die Bilanz: <Formel tex={t`4-2=2`} nach="." /> Der gesamte Flächeninhalt wäre dagegen <Formel tex={t`4+2=6`} nach="." />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex={t`f(x)=2\sin x`} /> auf dem Intervall <Formel tex={t`\left[0;\,\frac{3\pi}{2}\right]`} nach="." /> Bestimme den Inhalt der Fläche, die <Formel tex="K_f" /> oberhalb der x-Achse mit ihr einschließt, den Inhalt der Fläche unterhalb der x-Achse und den Wert des Integrals von <Formel tex="f" /> über das ganze Intervall.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K9} unter={<>Das Schaubild <Formel tex="K_f" /> mit den Flächen über und unter der x-Achse.</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="vorzeichen-integral">
        <Kontrollfrage
          aussage="vorzeichen-integral"
          teil="a"
          nummer="K10a"
          titel="Vorzeichen eines Integrals"
          optionen={platziere(
            [
              opt('a', <>Das Integral ist größer als null.</>, true, <>Richtig.</>),
              opt('b', <>Das Integral ist kleiner als null.</>, false, <>Die Fläche unterhalb der x-Achse zählt negativ, aber sie ist nicht größer als die beiden Flächen oberhalb zusammen. Die Teilflächen sind <Formel tex={t`+\frac{4}{3}`} nach="," /> <Formel tex={t`-\frac{4}{3}`} /> und <Formel tex={t`+\frac{4}{3}`} nach="." /></>),
              opt('c', <>Das Integral ist gleich null.</>, false, <>Gleich null wäre es, wenn sich nur die ersten beiden Flächen aufheben würden, also über <Formel tex={t`[0;\,3]`} nach="." /> Auf <Formel tex={t`[0;\,4]`} /> kommt noch die dritte Fläche oberhalb dazu.</>),
              opt('d', <>Das Vorzeichen lässt sich ohne Rechnung nicht entscheiden.</>, false, <>Mit der Skizze lässt es sich entscheiden: Die zwei Flächen oberhalb sind zusammen größer als die Fläche unterhalb.</>),
            ],
            0,
          )}
          erklaerung={
            <>
              <p>
                Das Schaubild ist eine nach oben geöffnete Parabel mit den Nullstellen 1 und 3. Die beiden Flächen oberhalb der x-Achse links und rechts sind gleich groß wie die Fläche unterhalb. Die Bilanz ist <Formel tex={t`\frac{4}{3}-\frac{4}{3}+\frac{4}{3}=\frac{4}{3}`} nach="." /> Das Integral ist also größer als null.
              </p>
              <FlaechenFigur daten={BILD_K10} unter={<>Zwei Flächen oberhalb der x-Achse (blau und gelb), eine unterhalb (rosa).</>} />
            </>
          }
        >
          <p>
            Das Schaubild von <Formel tex={t`f(x)=(x-1)(x-3)`} /> ist eine nach oben geöffnete Parabel mit den Nullstellen 1 und 3. Wie lässt sich ohne Taschenrechner entscheiden, ob <Formel tex={t`\int_{0}^{4}f(x)\,\mathrm{d}x`} /> größer, kleiner oder gleich null ist? Skizziere das Schaubild und vergleiche die Flächen.
          </p>
        </Kontrollfrage>
        <Kontrolle
          aussage="vorzeichen-integral"
          teil="b"
          nummer="K10b"
          titel="Obere Grenze für den Wert null"
          felder={[{ id: 'b', name: 'obere Grenze b größer als 0', beschriftung: <><Formel tex="b" /></>, erwartet: K10.obereGrenze }]}
          hilfen={[
            <>Das Integral von 0 bis <Formel tex="b" /> ist null, wenn sich die Flächen oberhalb und unterhalb der x-Achse aufheben.</>,
            <>Die erste Fläche oberhalb hat den Inhalt <Formel tex={t`\frac{4}{3}`} nach="." /> Bis wohin muss die Fläche unterhalb reichen, damit sie genauso groß wird?</>,
          ]}
          loesung={[
            <>
              Von <Formel tex="0" /> bis <Formel tex="1" /> liegt die Fläche <Formel tex={t`+\frac{4}{3}`} /> oberhalb, von <Formel tex="1" /> bis <Formel tex="3" /> die Fläche <Formel tex={t`-\frac{4}{3}`} /> unterhalb.
            </>,
            <>
              Rechnung: Mit <Formel tex={t`F(x)=\frac{1}{3}x^3-2x^2+3x`} /> ist <Formel tex={t`F(3)=9-18+9=0`} nach="." /> Also <Formel tex={t`\int_0^3f(x)\,\mathrm{d}x=0`} /> und <Formel tex="b=3" nach="." />
            </>,
          ]}
        >
          <p>
            Für welche obere Grenze <Formel tex={t`b>0`} /> ist <Formel tex={t`\int_{0}^{b}(x-1)(x-3)\,\mathrm{d}x=0`} nach="?" />
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K10} unter={<>Das Schaubild <Formel tex="K_f" /> mit den drei Teilflächen.</>} />
        </Kontrollschaubild>
      </Punkt>
    </Abschnitt>
  );
}
