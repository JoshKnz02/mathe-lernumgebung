import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_K15, BILD_K16, BILD_K17, BILD_K18A, BILD_K18B } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Punkt } from './Punkt';
import { K15, K16, K17, K18, TOL2 } from './werte';

/** Bereich Flächen und Volumen: Aussagen 15 bis 18. */
export function Flaechen() {
  return (
    <Abschnitt id="flaechen" titel="Flächen und Volumen">
      <p>Hier geht es um Flächeninhalte zwischen Schaubild und x-Achse und zwischen zwei Schaubildern, um Rotationsvolumen und um gesuchte Integrationsgrenzen.</p>
      <Eingabehinweis />

      <Punkt id="flaeche-x-achse">
        <Kontrolle
          aussage="flaeche-x-achse"
          nummer="K15"
          titel="Fläche zwischen Kurve und x-Achse"
          felder={[
            { id: 'n', name: 'Nullstelle im Inneren des Intervalls', beschriftung: <>Nullstelle im Inneren</>, erwartet: K15.nullstelle },
            { id: 'i', name: 'Wert des Integrals von minus 1 bis 4, auf zwei Nachkommastellen', beschriftung: <>Wert des Integrals</>, erwartet: K15.integral, toleranz: TOL2 },
            { id: 'a', name: 'Flächeninhalt zwischen Schaubild und x-Achse von minus 1 bis 4', beschriftung: <>Flächeninhalt</>, erwartet: K15.inhalt },
          ]}
          hilfen={[
            <>Der Flächeninhalt ist nicht das Integral, wenn das Schaubild die x-Achse schneidet. Zerlege das Intervall an den Nullstellen und addiere die Beträge der Teilintegrale (Modul <Modulverweis modul="flaeche-kurve-x-achse">Flächeninhalt zwischen Kurve und x-Achse</Modulverweis>).</>,
            <>Die Nullstellen von <Formel tex={t`x^2-2x-3`} /> findest du mit <Formel tex={t`(x+1)(x-3)=0`} nach="." /> Die Stammfunktion ist <Formel tex={t`F(x)=\frac{1}{3}x^3-x^2-3x`} nach="." /></>,
          ]}
          loesung={[
            <>
              Die Nullstellen sind <Formel tex="-1" /> und <Formel tex="3" nach="." /> Im Inneren von <Formel tex={t`[-1;\,4]`} /> liegt nur <Formel tex="3" nach="." />
            </>,
            <>
              Mit <Formel tex={t`F(4)=-\frac{20}{3}`} /> und <Formel tex={t`F(-1)=\frac{5}{3}`} /> ist das Integral <Formel tex={t`F(4)-F(-1)=-\frac{25}{3}`} nach="." />
            </>,
            <>
              Teilintegrale: <Formel tex={t`\int_{-1}^{3}f(x)\,\mathrm{d}x=-\frac{32}{3}`} /> (unterhalb) und <Formel tex={t`\int_{3}^{4}f(x)\,\mathrm{d}x=\frac{7}{3}`} /> (oberhalb).
              <Formel tex={t`A=\frac{32}{3}+\frac{7}{3}=\frac{39}{3}=13`} nach="." />
              <FlaechenFigur daten={BILD_K15} unter={<>Die Fläche unterhalb (rosa) hat den Inhalt <Formel tex={t`\frac{32}{3}`} nach="," /> die oberhalb (blau) den Inhalt <Formel tex={t`\frac{7}{3}`} nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex={t`f(x)=x^2-2x-3`} /> auf dem Intervall <Formel tex={t`[-1;\,4]`} nach="." /> Bestimme die Nullstelle im Inneren des Intervalls, den Wert des Integrals von <Formel tex="-1" /> bis <Formel tex="4" /> und den Inhalt der Fläche, die <Formel tex="K_f" /> mit der x-Achse einschließt.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K15} unter={<>Das Schaubild <Formel tex="K_f" /> mit den beiden Teilflächen.</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="flaeche-zwischen-kurven">
        <Kontrolle
          aussage="flaeche-zwischen-kurven"
          nummer="K16"
          titel="Fläche zwischen zwei Schaubildern"
          felder={[
            { id: 'x1', name: 'kleinste Schnittstelle', beschriftung: <>kleinste Schnittstelle</>, erwartet: K16.schnitt[0]! },
            { id: 'x3', name: 'größte Schnittstelle', beschriftung: <>größte Schnittstelle</>, erwartet: K16.schnitt[2]! },
            { id: 'a', name: 'Flächeninhalt der eingeschlossenen Fläche, auf zwei Nachkommastellen', beschriftung: <>Flächeninhalt</>, erwartet: K16.inhalt, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Die Schnittstellen sind die Lösungen von <Formel tex={t`f(x)=g(x)`} nach="." /> Zwischen zwei Schnittstellen liegt dasselbe Schaubild oben (Modul <Modulverweis modul="flaeche-zwischen-kurven">Flächeninhalt zwischen zwei Kurven</Modulverweis>).</>,
            <>Es gibt drei Schnittstellen und damit zwei Teilflächen. Prüfe für jede Teilfläche, welches Schaubild oben liegt, und integriere die Differenz.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`x^3=x^2+2x`} /> führt auf <Formel tex={t`x\,(x+1)(x-2)=0`} nach="." /> Die Schnittstellen sind <Formel tex="-1" nach="," /> <Formel tex="0" /> und <Formel tex="2" nach="." />
            </>,
            <>
              Differenz <Formel tex={t`d(x)=x^3-x^2-2x`} /> mit <Formel tex={t`D(x)=\frac{1}{4}x^4-\frac{1}{3}x^3-x^2`} nach="." /> Von <Formel tex="-1" /> bis <Formel tex="0" /> gilt <Formel tex={t`d(-0{,}5)>0`} nach="," /> also liegt <Formel tex="K_f" /> oben: <Formel tex={t`D(0)-D(-1)=\frac{5}{12}`} nach="." />
            </>,
            <>
              Von <Formel tex="0" /> bis <Formel tex="2" /> liegt <Formel tex="K_g" /> oben: <Formel tex={t`D(2)-D(0)=-\frac{8}{3}`} nach="," /> der Flächeninhalt ist <Formel tex={t`\frac{8}{3}`} nach="." />
              <Formel tex={t`A=\frac{5}{12}+\frac{8}{3}=\frac{37}{12}\approx 3{,}08`} nach="." />
              <FlaechenFigur daten={BILD_K16} unter={<>Zwischen <Formel tex="-1" /> und <Formel tex="0" /> liegt <Formel tex="K_f" /> oben, zwischen <Formel tex="0" /> und <Formel tex="2" /> liegt <Formel tex="K_g" /> oben.</>} />
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex={t`f(x)=x^3`} /> und <Formel tex={t`g(x)=x^2+2x`} nach="." /> Bestimme die kleinste und die größte Schnittstelle von <Formel tex="K_f" /> und <Formel tex="K_g" /> und den Inhalt der Fläche, die beide Schaubilder einschließen.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K16} unter={<>Die Schaubilder <Formel tex="K_f" /> (orange) und <Formel tex="K_g" /> (schwarz gestrichelt) mit den eingeschlossenen Flächen.</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="rotationsvolumen">
        <Kontrolle
          aussage="rotationsvolumen"
          nummer="K17"
          titel="Volumen eines Hohlkörpers"
          felder={[
            { id: 'v1', name: 'Volumen des äußeren Körpers, auf zwei Nachkommastellen', beschriftung: <>äußerer Körper</>, erwartet: K17.v1, toleranz: TOL2 },
            { id: 'v2', name: 'Volumen des inneren Körpers, auf zwei Nachkommastellen', beschriftung: <>innerer Körper</>, erwartet: K17.v2, toleranz: TOL2 },
            { id: 'v', name: 'Volumen des Hohlkörpers, auf zwei Nachkommastellen', beschriftung: <>Hohlkörper</>, erwartet: K17.v, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Das Volumen eines Rotationskörpers ist <Formel tex={t`V=\pi\int_a^b \left(f(x)\right)^2\mathrm{d}x`} nach="." /> Bei einem Hohlkörper rechnest du das Volumen des äußeren Körpers und ziehst das des inneren ab (Modul <Modulverweis modul="rotationsvolumen">Rotationsvolumen</Modulverweis>).</>,
            <>Quadriere zuerst die Funktionen: <Formel tex={t`\left(\frac{x}{2}+2\right)^2=\frac{x^2}{4}+2x+4`} /> und <Formel tex={t`(\sqrt{x})^2=x`} nach="." /></>,
          ]}
          loesung={[
            <>
              Äußerer Körper: <Formel tex={t`V_1=\pi\int_0^4\left(\frac{x^2}{4}+2x+4\right)\mathrm{d}x`} nach="." /> Eine Stammfunktion des Integranden ist <Formel tex={t`\frac{x^3}{12}+x^2+4x`} nach="." />
              Damit ist <Formel tex={t`V_1=\pi\left(\frac{16}{3}+16+16\right)`} /> und das ergibt <Formel tex={t`\frac{112\pi}{3}\approx 117{,}28`} nach="." />
            </>,
            <>
              Innerer Körper: <Formel tex={t`V_2=\pi\int_0^4 x\,\mathrm{d}x`} /> ergibt <Formel tex={t`8\pi\approx 25{,}13`} nach="." />
            </>,
            <>
              Hohlkörper: <Formel tex={t`V=V_1-V_2`} nach="," /> also <Formel tex={t`\frac{112\pi}{3}-8\pi=\frac{88\pi}{3}\approx 92{,}15`} nach="." /> Die Radien werden vor dem Quadrieren nicht voneinander abgezogen, sondern die Quadrate.
              <FlaechenFigur daten={BILD_K17} unter={<>Der Querschnitt: Das Material liegt zwischen innerem und äußerem Rand (blau), oben und gespiegelt unten.</>} />
            </>,
          ]}
        >
          <p>
            Die Fläche zwischen <Formel tex={t`f(x)=\frac{x}{2}+2`} /> und <Formel tex={t`g(x)=\sqrt{x}`} /> über <Formel tex={t`[0;\,4]`} /> rotiert um die x-Achse. Dabei entsteht ein Hohlkörper. Gib das Volumen des äußeren Körpers, des inneren Körpers und des Hohlkörpers an, jeweils in Volumeneinheiten.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K17} unter={<>Der Querschnitt des Hohlkörpers.</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="grenze-gesucht">
        <Kontrolle
          aussage="grenze-gesucht"
          nummer="K18"
          titel="Integrationsgrenze gesucht"
          felder={[
            { id: 'b', name: 'obere Grenze b größer als 0, für die das Integral den Wert 12 hat', beschriftung: <><Formel tex="b" /></>, erwartet: K18.b },
            { id: 'c', name: 'obere Grenze c größer als 0, für die der Flächeninhalt 64 beträgt', beschriftung: <><Formel tex="c" /></>, erwartet: K18.c },
          ]}
          hilfen={[
            <>Berechne das Integral mit der unbekannten Grenze. Du erhältst eine Gleichung für diese Grenze, die du löst. Die Grenze muss zur Aufgabe passen (Modul <Modulverweis modul="flaeche-kurve-x-achse">Flächeninhalt zwischen Kurve und x-Achse</Modulverweis>).</>,
            <>Bei einer Gleichung mit zwei Lösungen prüfst du, welche die Bedingung <Formel tex={t`b>0`} /> erfüllt.</>,
          ]}
          loesung={[
            <>
              Eine Stammfunktion ist <Formel tex={t`x^2+x`} nach="," /> also ist das Integral <Formel tex={t`b^2+b`} nach="." /> Aus <Formel tex={t`b^2+b=12`} /> folgt <Formel tex={t`b^2+b-12=0`} /> mit den Lösungen <Formel tex="b=3" /> und <Formel tex="b=-4" nach="." /> Wegen <Formel tex="b>0" /> gilt <Formel tex="b=3" nach="." />
              <FlaechenFigur daten={BILD_K18A} unter={<>Das Trapez unter <Formel tex="K_f" /> von 0 bis 3 hat den Inhalt <Formel tex={t`\frac{1+7}{2}\cdot 3=12`} nach="." /></>} />
            </>,
            <>
              Für <Formel tex={t`g(x)=3x^2`} /> gilt: Eine Stammfunktion ist <Formel tex={t`x^3`} nach="," /> also ist der Flächeninhalt <Formel tex={t`c^3`} nach="." /> Aus <Formel tex={t`c^3=64`} /> folgt <Formel tex="c=4" nach="." />
              <FlaechenFigur daten={BILD_K18B} unter={<>Die Fläche unter <Formel tex="K_g" /> von 0 bis 4 hat den Inhalt 64.</>} />
            </>,
          ]}
        >
          <p>
            a) Für welche obere Grenze <Formel tex="b>0" /> hat <Formel tex={t`\int_{0}^{b}(2x+1)\,\mathrm{d}x`} /> den Wert 12? b) Für welche Zahl <Formel tex="c>0" /> schließt das Schaubild von <Formel tex={t`g(x)=3x^2`} /> mit der x-Achse über <Formel tex={t`[0;\,c]`} /> den Flächeninhalt 64 ein?
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K18A} unter={<>Teil a): Die Fläche unter der Geraden von 0 bis 3.</>} />
          <FlaechenFigur daten={BILD_K18B} unter={<>Teil b): Die Fläche unter dem Schaubild von <Formel tex="g" /> von 0 bis 4.</>} />
        </Kontrollschaubild>
      </Punkt>
    </Abschnitt>
  );
}
