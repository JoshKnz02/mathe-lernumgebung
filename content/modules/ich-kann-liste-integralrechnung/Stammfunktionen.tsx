import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Punkt } from './Punkt';
import { K1, K2, K3, K4, K5, TOL2 } from './werte';

/** Bereich Stammfunktionen: Aussagen 1 bis 5. */
export function Stammfunktionen() {
  return (
    <Abschnitt id="stammfunktionen" titel="Stammfunktionen">
      <p>Hier geht es um Stammfunktionen von Potenz-, Exponential- und trigonometrischen Funktionen, um die Schreibweise des unbestimmten Integrals und um die Stammfunktion durch einen gegebenen Punkt. Die Probe durch Ableiten gehört zu jeder Aufgabe.</p>
      <Eingabehinweis />

      <Punkt id="stammfunktion-potenz">
        <Kontrolle
          aussage="stammfunktion-potenz"
          nummer="K1"
          titel="Stammfunktion einer Potenzfunktion"
          felder={[
            { id: 'a', name: 'Koeffizient a vor x hoch 4', beschriftung: <><Formel tex="a" /></>, erwartet: K1.a },
            { id: 'b', name: 'Koeffizient b vor x hoch 3', beschriftung: <><Formel tex="b" /></>, erwartet: K1.b },
            { id: 'c', name: 'Koeffizient c vor x Quadrat', beschriftung: <><Formel tex="c" /></>, erwartet: K1.c },
            { id: 'd', name: 'Koeffizient d vor x', beschriftung: <><Formel tex="d" /></>, erwartet: K1.d },
            { id: 'k', name: 'Faktor k vor der Klammer hoch 4', beschriftung: <><Formel tex="k" /></>, erwartet: K1.k, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Bei jedem Summanden <Formel tex={t`x^n`} /> erhöhst du die Hochzahl um 1 und teilst durch die neue Hochzahl (Modul <Modulverweis modul="stammfunktionen">Stammfunktionen bestimmen</Modulverweis>).</>,
            <>Bei <Formel tex={t`(2x-1)^3`} /> gehört der Faktor <Formel tex={t`\frac{1}{2}`} /> der inneren Funktion dazu, weil die Kettenregel beim Ableiten den Faktor 2 liefert.</>,
            <>Mache die Probe: Leite deine Stammfunktion ab. Es muss wieder die gegebene Funktion herauskommen.</>,
          ]}
          loesung={[
            <>
              Summandenweise: <Formel tex={t`\int 2x^3=\frac{2}{4}x^4`} nach="," /> <Formel tex={t`\int -3x^2=-x^3`} nach="," /> <Formel tex={t`\int 4x=2x^2`} /> und <Formel tex={t`\int -5=-5x`} nach="." />
              <Formel tex={t`F(x)=\frac{1}{2}x^4-x^3+2x^2-5x`} nach="." />
              Also <Formel tex={t`a=\frac{1}{2}`} nach="," /> <Formel tex="b=-1" nach="," /> <Formel tex="c=2" /> und <Formel tex="d=-5" nach="." />
            </>,
            <>
              Für <Formel tex={t`g(x)=(2x-1)^3`} /> ist <Formel tex={t`G(x)=\frac{1}{2}\cdot\frac{1}{4}(2x-1)^4=\frac{1}{8}(2x-1)^4`} nach="." /> Also <Formel tex={t`k=\frac{1}{8}`} nach="." />
            </>,
            <>
              Probe: <Formel tex={t`F'(x)=2x^3-3x^2+4x-5=f(x)`} /> und <Formel tex={t`G'(x)=\frac{1}{8}\cdot 4\cdot 2\,(2x-1)^3=(2x-1)^3=g(x)`} nach="." />
            </>,
          ]}
        >
          <p>
            Bestimme jeweils eine Stammfunktion. Für <Formel tex={t`f(x)=2x^3-3x^2+4x-5`} /> ist <Formel tex={t`F(x)=a\,x^4+b\,x^3+c\,x^2+d\,x`} /> gesucht. Für <Formel tex={t`g(x)=(2x-1)^3`} /> ist <Formel tex={t`G(x)=k\,(2x-1)^4`} /> gesucht. Gib <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" nach="," /> <Formel tex="d" /> und <Formel tex="k" /> an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="stammfunktion-exp">
        <Kontrolle
          aussage="stammfunktion-exp"
          nummer="K2"
          titel="Stammfunktion einer Exponentialfunktion"
          felder={[
            { id: 'p', name: 'Faktor p vor e hoch 3 x minus 1', beschriftung: <><Formel tex="p" /></>, erwartet: K2.p, toleranz: TOL2 },
            { id: 'q', name: 'Faktor q vor e hoch x', beschriftung: <><Formel tex="q" /></>, erwartet: K2.q },
          ]}
          hilfen={[
            <>Die Funktion <Formel tex={t`e^x`} /> ändert sich beim Integrieren nicht. Bei <Formel tex={t`e^{ax+b}`} /> kommt der Faktor <Formel tex={t`\frac{1}{a}`} /> dazu.</>,
            <>Mache die Probe: <Formel tex={t`\left(e^{3x-1}\right)'=3\,e^{3x-1}`} nach="." /> Dieser Faktor 3 muss wieder ausgeglichen werden.</>,
          ]}
          loesung={[
            <>
              Der erste Summand hat die innere Funktion <Formel tex="3x-1" nach="," /> also den Faktor <Formel tex={t`\frac{1}{3}`} nach="." /> Der zweite Summand bleibt bis auf den Faktor 4 unverändert.
              <Formel tex={t`F(x)=\frac{1}{3}e^{3x-1}+4e^x`} nach="." />
              Also <Formel tex={t`p=\frac{1}{3}`} /> und <Formel tex="q=4" nach="." />
            </>,
            <>
              Probe: <Formel tex={t`F'(x)=\frac{1}{3}\cdot 3\,e^{3x-1}+4e^x=e^{3x-1}+4e^x=f(x)`} nach="." />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex={t`f(x)=e^{3x-1}+4e^x`} nach="." /> Gesucht ist die Stammfunktion <Formel tex={t`F(x)=p\,e^{3x-1}+q\,e^x`} nach="." /> Gib <Formel tex="p" /> und <Formel tex="q" /> an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="stammfunktion-trig">
        <Kontrolle
          aussage="stammfunktion-trig"
          nummer="K3"
          titel="Stammfunktion einer trigonometrischen Funktion"
          felder={[
            { id: 'p', name: 'Faktor p vor cos von 2 x plus 1', beschriftung: <><Formel tex="p" /></>, erwartet: K3.p },
            { id: 'q', name: 'Faktor q vor sin von 3 x', beschriftung: <><Formel tex="q" /></>, erwartet: K3.q, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Es gilt <Formel tex={t`\int\sin x=-\cos x`} /> und <Formel tex={t`\int\cos x=\sin x`} nach="." /> Bei der inneren Funktion <Formel tex="ax+b" /> kommt wieder der Faktor <Formel tex={t`\frac{1}{a}`} /> dazu.</>,
            <>Achte auf das Vorzeichen bei der Stammfunktion des Sinus. Die Probe zeigt, ob es stimmt: <Formel tex={t`(\cos x)'=-\sin x`} nach="." /></>,
          ]}
          loesung={[
            <>
              Für <Formel tex={t`\sin(2x+1)`} /> ist <Formel tex={t`F(x)=-\frac{1}{2}\cos(2x+1)`} nach="." /> Also <Formel tex="p=-0{,}5" nach="." /> Probe: <Formel tex={t`F'(x)=-\frac{1}{2}\cdot\left(-\sin(2x+1)\right)\cdot 2=\sin(2x+1)`} nach="." />
            </>,
            <>
              Für <Formel tex={t`4\cos(3x)`} /> ist <Formel tex={t`G(x)=\frac{4}{3}\sin(3x)`} nach="." /> Also <Formel tex={t`q=\frac{4}{3}\approx 1{,}33`} nach="." /> Probe: <Formel tex={t`G'(x)=\frac{4}{3}\cos(3x)\cdot 3=4\cos(3x)`} nach="." />
            </>,
          ]}
        >
          <p>
            Bestimme Stammfunktionen von <Formel tex={t`f(x)=\sin(2x+1)`} /> in der Form <Formel tex={t`F(x)=p\,\cos(2x+1)`} /> und von <Formel tex={t`g(x)=4\cos(3x)`} /> in der Form <Formel tex={t`G(x)=q\,\sin(3x)`} nach="." /> Gib <Formel tex="p" /> und <Formel tex="q" /> an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="unbestimmtes-integral">
        <Kontrolle
          aussage="unbestimmtes-integral"
          nummer="K4"
          titel="Unbestimmtes Integral"
          felder={[
            { id: 'a', name: 'Koeffizient a vor x hoch 4', beschriftung: <><Formel tex="a" /></>, erwartet: K4.a },
            { id: 'b', name: 'Koeffizient b vor x Quadrat', beschriftung: <><Formel tex="b" /></>, erwartet: K4.b },
            { id: 'c', name: 'Koeffizient c vor x', beschriftung: <><Formel tex="c" /></>, erwartet: K4.c },
          ]}
          hilfen={[
            <>Das unbestimmte Integral nennt alle Stammfunktionen auf einmal, deshalb steht am Ende die Konstante <Formel tex="C" nach="." /></>,
            <>Gehe summandenweise vor wie beim Bilden einer Stammfunktion und prüfe durch Ableiten.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`\int\left(4x^3-6x+1\right)\mathrm{d}x=x^4-3x^2+x+C`} nach="." />
              Also <Formel tex="a=1" nach="," /> <Formel tex="b=-3" /> und <Formel tex="c=1" nach="." />
            </>,
            <>
              Probe: <Formel tex={t`\left(x^4-3x^2+x+C\right)'=4x^3-6x+1`} nach="." />
            </>,
          ]}
        >
          <Hinweis titel="Schreibweise in Büchern">
            Das unbestimmte Integral kommt in vielen Schulbüchern vor. Der Bildungsplan verwendet es nicht, denn dort genügt die Angabe einer Stammfunktion. Das Zeichen <Formel tex="\int" /> ist hier nur eine andere Art, <Formel tex="F(x)+C" /> zu schreiben (Modul <Modulverweis modul="stammfunktionen">Stammfunktionen bestimmen</Modulverweis>).
          </Hinweis>
          <p>
            Bestimme <Formel tex={t`\int\left(4x^3-6x+1\right)\mathrm{d}x=a\,x^4+b\,x^2+c\,x+C`} nach="." /> Gib <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="stammfunktion-durch-punkt">
        <Kontrolle
          aussage="stammfunktion-durch-punkt"
          nummer="K5"
          titel="Stammfunktion durch einen Punkt"
          felder={[
            { id: 'c', name: 'Konstante c der Stammfunktion', beschriftung: <><Formel tex="c" /></>, erwartet: K5.c },
            { id: 'F1', name: 'Funktionswert der Stammfunktion an der Stelle 1, auf zwei Nachkommastellen', beschriftung: <><Formel tex="F(1)" /></>, erwartet: K5.F1, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Bilde zuerst eine Stammfunktion mit der Konstanten <Formel tex="c" nach="." /> Setze dann die Koordinaten des Punkts ein: <Formel tex="F(0)=5" nach="." /></>,
            <>Löse die Gleichung nach <Formel tex="c" /> auf. Setze danach <Formel tex="x=1" /> in deine Stammfunktion ein.</>,
          ]}
          loesung={[
            <>
              Alle Stammfunktionen sind <Formel tex={t`F(x)=2e^{2x}-x^3+c`} nach="." /> Aus <Formel tex={t`F(0)=2e^0-0+c=2+c=5`} /> folgt <Formel tex="c=3" nach="." />
            </>,
            <>
              Also <Formel tex={t`F(x)=2e^{2x}-x^3+3`} /> und
              <Formel tex={t`F(1)=2e^2-1+3=2e^2+2\approx 16{,}78`} nach="." />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex={t`f(x)=4e^{2x}-3x^2`} nach="." /> Die Stammfunktion <Formel tex={t`F(x)=2e^{2x}-x^3+c`} /> verläuft durch den Punkt <Formel tex={t`P(0\,|\,5)`} nach="." /> Bestimme <Formel tex="c" /> und den Funktionswert <Formel tex="F(1)" nach="." />
          </p>
        </Kontrolle>
      </Punkt>
    </Abschnitt>
  );
}
