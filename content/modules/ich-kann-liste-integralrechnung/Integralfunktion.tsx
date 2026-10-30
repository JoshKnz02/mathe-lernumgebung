import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_K11, BILD_K13_INTEGRAL, BILD_K13_RATE, BILD_K14 } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K11, K13, TOL2 } from './werte';

/** Bereich Integralfunktion: Aussagen 11 bis 14. */
export function Integralfunktion() {
  return (
    <Abschnitt id="integralfunktion" titel="Integralfunktion">
      <p>Hier geht es um die Integralfunktion zu einer unteren Grenze, um ihren Zusammenhang mit der Stammfunktion und um die Schaubilder von Funktion und Integralfunktion.</p>
      <Eingabehinweis />

      <Punkt id="integralfunktion-bilden">
        <Kontrolle
          aussage="integralfunktion-bilden"
          nummer="K11"
          titel="Integralfunktion bestimmen"
          felder={[
            { id: 'c', name: 'Konstante c in x hoch 3 durch 3 minus x Quadrat plus c', beschriftung: <><Formel tex="c" /></>, erwartet: K11.c, toleranz: TOL2 },
            { id: 'I4', name: 'Funktionswert der Integralfunktion an der Stelle 4, auf zwei Nachkommastellen', beschriftung: <><Formel tex={t`I_2(4)`} /></>, erwartet: K11.I4, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Die Integralfunktion <Formel tex={t`I_2(x)=\int_{2}^{x}f(t)\,\mathrm{d}t`} /> ist <Formel tex={t`F(x)-F(2)`} /> mit einer Stammfunktion <Formel tex="F" /> (Modul <Modulverweis modul="integralfunktion">Die Integralfunktion und der Hauptsatz</Modulverweis>).</>,
            <>An der unteren Grenze ist der Wert der Integralfunktion null. Mit dieser Bedingung kannst du die Konstante bestimmen.</>,
          ]}
          loesung={[
            <>
              Eine Stammfunktion ist <Formel tex={t`F(t)=\frac{1}{3}t^3-t^2`} nach="." /> Es ist <Formel tex={t`F(2)=\frac{8}{3}-4=-\frac{4}{3}`} nach="." />
            </>,
            <>
              <Formel tex={t`I_2(x)=F(x)-F(2)=\frac{1}{3}x^3-x^2+\frac{4}{3}`} nach="." />
              Also <Formel tex={t`c=\frac{4}{3}`} nach="." />
            </>,
            <>
              <Formel tex={t`I_2(4)=\frac{64}{3}-16+\frac{4}{3}=\frac{20}{3}\approx 6{,}67`} nach="." />
              <FlaechenFigur daten={BILD_K11} unter={<>Der Wert <Formel tex={t`I_2(4)`} /> ist der Inhalt der gefüllten Fläche zwischen <Formel tex="K_f" /> und der Achse von 2 bis 4.</>} />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex={t`f(t)=t^2-2t`} nach="." /> Bestimme die Integralfunktion <Formel tex={t`I_2(x)=\int_{2}^{x}f(t)\,\mathrm{d}t=\frac{1}{3}x^3-x^2+c`} /> mit der unteren Grenze 2 und gib <Formel tex="c" /> sowie <Formel tex={t`I_2(4)`} /> an.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K11} unter={<>Das Schaubild <Formel tex="K_f" /> mit der Fläche von 2 bis 4.</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="stammfunktion-integralfunktion">
        <Kontrollfrage
          aussage="stammfunktion-integralfunktion"
          nummer="K12"
          titel="Stammfunktion und Integralfunktion"
          optionen={platziere(
            [
              opt('a', <><Formel tex={t`x^2-4`} nach="." /></>, true, <>Richtig.</>),
              opt('b', <><Formel tex={t`x^2+5`} nach="." /></>, false, <>Die Ableitung stimmt, aber eine Integralfunktion muss an ihrer unteren Grenze null sein. Die Gleichung <Formel tex={t`x^2+5=0`} /> hat keine Lösung, es gibt also keine untere Grenze.</>),
              opt('c', <><Formel tex={t`2x^2-4`} nach="." /></>, false, <>Die Ableitung ist <Formel tex="4x" nach="," /> nicht <Formel tex="2x" nach="." /> Eine Integralfunktion von <Formel tex="f" /> ist immer eine Stammfunktion von <Formel tex="f" nach="." /></>),
              opt('d', <><Formel tex={t`x^2+2x`} nach="." /></>, false, <>Die Ableitung ist <Formel tex="2x+2" nach="," /> nicht <Formel tex="2x" nach="." /> Der Summand <Formel tex="2x" /> gehört nicht zu einer konstanten Verschiebung.</>),
            ],
            2,
          )}
          erklaerung={
            <>
              <p>
                Jede Integralfunktion ist eine Stammfunktion, aber nicht jede Stammfunktion ist eine Integralfunktion: Sie muss an der unteren Grenze den Wert 0 haben. Alle Stammfunktionen von <Formel tex="f" /> unterscheiden sich nur um eine Konstante, sie sind in y-Richtung verschoben. Die Funktion <Formel tex={t`x^2-4`} /> hat die Ableitung <Formel tex="2x" /> und die Nullstellen <Formel tex="2" /> und <Formel tex="-2" nach="." /> Sie ist deshalb die Integralfunktion zur unteren Grenze 2 (und zur unteren Grenze <Formel tex="-2" nach=")." />
              </p>
            </>
          }
        >
          <p>
            Gegeben ist <Formel tex={t`f(x)=2x`} nach="." /> Welche der Funktionen ist eine Integralfunktion <Formel tex={t`I_a(x)=\int_{a}^{x}f(t)\,\mathrm{d}t`} /> von <Formel tex="f" /> für eine untere Grenze <Formel tex="a" nach="?" />
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="integralfunktion-skizzieren">
        <Kontrolle
          aussage="integralfunktion-skizzieren"
          nummer="K13"
          titel="Schaubild der Integralfunktion"
          felder={[
            { id: 'x', name: 'Stelle, an der die Integralfunktion ihren größten Wert hat', beschriftung: <>Hochpunkt bei <Formel tex="x=" /></>, erwartet: K13.xH },
            { id: 'y', name: 'größter Wert der Integralfunktion, auf zwei Nachkommastellen', beschriftung: <>Wert dort</>, erwartet: K13.yH, toleranz: TOL2 },
            { id: 'e', name: 'Wert der Integralfunktion an der Stelle 10', beschriftung: <><Formel tex="I_0(10)" /></>, erwartet: K13.I10 },
            { id: 'v', name: 'Wert der Integralfunktion mit unterer Grenze 4 an der Stelle 10', beschriftung: <><Formel tex="I_4(10)" /></>, erwartet: K13.I4bei10 },
          ]}
          hilfen={[
            <>Die Integralfunktion <Formel tex={t`I_0(x)=\int_0^xf(t)\,\mathrm{d}t`} /> wächst, wo <Formel tex={t`f>0`} /> ist, und fällt, wo <Formel tex={t`f<0`} /> ist. Bei einer Nullstelle von <Formel tex="f" /> mit Vorzeichenwechsel von plus nach minus liegt ein Hochpunkt (Modul <Modulverweis modul="integralfunktion">Die Integralfunktion und der Hauptsatz</Modulverweis>).</>,
            <>Die Werte erhältst du aus den Flächen: Zähle Dreiecke und Rechtecke zusammen, positive Flächen mit plus, negative mit minus.</>,
            <>Eine andere untere Grenze verschiebt das Schaubild nur in y-Richtung: <Formel tex={t`I_4(x)=I_0(x)-I_0(4)`} nach="." /></>,
          ]}
          loesung={[
            <>
              Von <Formel tex="0" /> bis <Formel tex="2" /> ist es ein Dreieck: <Formel tex={t`\frac{1}{2}\cdot 2\cdot 3=3`} nach="." /> Von <Formel tex="2" /> bis <Formel tex="5" /> ein Rechteck: <Formel tex={t`3\cdot 3=9`} nach="." /> Also <Formel tex={t`I_0(5)=12`} nach="." />
            </>,
            <>
              <Formel tex="K_f" /> hat die Nullstelle <Formel tex="6{,}5" /> mit Vorzeichenwechsel von plus nach minus. Von 5 bis 6,5 kommt ein Dreieck dazu: <Formel tex={t`\frac{1}{2}\cdot 1{,}5\cdot 3=2{,}25`} nach="." /> Also <Formel tex={t`I_0(6{,}5)=14{,}25`} nach="." /> Das ist der Hochpunkt.
            </>,
            <>
              Von 6,5 bis 8 kommt ein Dreieck unterhalb dazu: <Formel tex={t`-\frac{1}{2}\cdot 1{,}5\cdot 3=-2{,}25`} nach="." /> Von 8 bis 10 ein Rechteck unterhalb: <Formel tex={t`-2\cdot 3=-6`} nach="." /> Also <Formel tex={t`I_0(10)=14{,}25-2{,}25-6=6`} nach="." />
            </>,
            <>
              Für die untere Grenze 4 ist <Formel tex={t`I_0(4)=3+2\cdot 3=9`} nach="," /> also <Formel tex={t`I_4(10)=6-9=-3`} nach="." /> Das Schaubild von <Formel tex="I_4" /> ist das von <Formel tex="I_0" /> um 9 nach unten verschoben.
              <FlaechenFigur daten={BILD_K13_INTEGRAL} unter={<>Die Integralfunktion <Formel tex="I_0" /> (orange) mit dem Hochpunkt bei 6,5. Die schwarz gestrichelte Kurve gehört zur unteren Grenze 4 und ist um 9 nach unten verschoben.</>} />
            </>,
          ]}
        >
          <p>
            Die Abbildung zeigt das Schaubild einer Funktion <Formel tex="f" /> aus Strecken. Skizziere das Schaubild der Integralfunktion <Formel tex="I_0" /> mit der unteren Grenze 0 und gib an, an welcher Stelle sie ihren größten Wert hat, wie groß dieser Wert ist und welchen Wert sie an der Stelle 10 hat. Gib außerdem den Wert der Integralfunktion <Formel tex="I_4" /> mit der unteren Grenze 4 an der Stelle 10 an.
          </p>
          <FlaechenFigur daten={{ ...BILD_K13_RATE, flaechen: [] }} unter={<>Das Schaubild <Formel tex="K_f" nach="." /></>} />
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K13_RATE} unter={<>Das Schaubild <Formel tex="K_f" /> mit den Flächen.</>} />
          <FlaechenFigur daten={BILD_K13_INTEGRAL} unter={<>Die Integralfunktionen <Formel tex="I_0" /> (orange) und <Formel tex="I_4" /> (schwarz gestrichelt).</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="schaubilder-zusammenhang">
        <Kontrollfrage
          aussage="schaubilder-zusammenhang"
          nummer="K14"
          titel="Schaubilder von Funktion und Integralfunktion"
          optionen={platziere(
            [
              opt('a', <>Es gilt <Formel tex={t`I_{-1}(3)=0`} nach="." /></>, true, <>Richtig.</>),
              opt('b', <><Formel tex={t`I_{-1}`} /> fällt auf dem Intervall <Formel tex={t`[-1;\,1]`} nach="." /></>, false, <>Auf <Formel tex={t`]-1;\,1[`} /> ist <Formel tex={t`f>0`} nach="," /> denn beide Faktoren <Formel tex="x^2-1" /> und <Formel tex="x-3" /> sind negativ. Also steigt <Formel tex={t`I_{-1}`} /> dort.</>),
              opt('c', <><Formel tex={t`I_{-1}`} /> ist auf dem Intervall <Formel tex={t`[0;\,2]`} /> linksgekrümmt.</>, false, <>Die Krümmung von <Formel tex={t`I_{-1}`} /> richtet sich nach dem Vorzeichen von <Formel tex="f'" nach="." /> Auf <Formel tex={t`[0;\,2]`} /> fällt <Formel tex="K_f" nach="," /> also ist <Formel tex="f'<0" /> und <Formel tex={t`I_{-1}`} /> ist rechtsgekrümmt.</>),
              opt('d', <>Es gilt <Formel tex={t`\int_{-1}^{1}f(x)\,\mathrm{d}x=0`} nach="." /></>, false, <>Über <Formel tex={t`[-1;\,1]`} /> liegt <Formel tex="K_f" /> ganz oberhalb der x-Achse, das Integral ist positiv (es hat den Wert 2). Null ist das Integral erst über <Formel tex={t`[-1;\,3]`} nach="." /></>),
            ],
            0,
          )}
          erklaerung={
            <>
              <p>
                Das Schaubild <Formel tex="K_f" /> hat die Nullstellen <Formel tex="-1" nach="," /> <Formel tex="1" /> und <Formel tex="3" nach="." /> Über <Formel tex={t`[-1;\,1]`} /> liegt eine Fläche oberhalb der x-Achse mit dem Inhalt 2, über <Formel tex={t`[1;\,3]`} /> eine gleich große Fläche unterhalb. Die Bilanz über <Formel tex={t`[-1;\,3]`} /> ist deshalb <Formel tex={t`2-2=0`} nach="." /> Das ist genau <Formel tex={t`I_{-1}(3)=0`} nach="." />
              </p>
              <FlaechenFigur daten={BILD_K14} unter={<>Zwei gleich große Flächen: oberhalb (blau) und unterhalb (rosa) der x-Achse.</>} />
            </>
          }
        >
          <p>
            Gegeben ist <Formel tex={t`f(x)=\frac{1}{2}(x^2-1)(x-3)`} /> mit dem Schaubild in der Abbildung und die Integralfunktion <Formel tex={t`I_{-1}(x)=\int_{-1}^{x}f(t)\,\mathrm{d}t`} nach="." /> Welche Aussage ist richtig?
          </p>
          <FlaechenFigur daten={{ ...BILD_K14, flaechen: [] }} unter={<>Das Schaubild <Formel tex="K_f" nach="." /></>} />
        </Kontrollfrage>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K14} unter={<>Das Schaubild <Formel tex="K_f" /> mit den Flächen von minus 1 bis 1 und von 1 bis 3.</>} />
        </Kontrollschaubild>
      </Punkt>
    </Abschnitt>
  );
}
