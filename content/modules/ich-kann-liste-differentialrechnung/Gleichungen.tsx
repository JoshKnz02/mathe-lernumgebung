import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_K3A } from './Bilder';
import { Kontrolle, Punkt } from './Punkt';
import { K1, K2, K3, K4, TOL2 } from './werte';
import { Eingabehinweis } from './Eingabehinweis';

/** Bereich Gleichungen: Aussagen 1 bis 4. */
export function Gleichungen() {
  return (
    <Abschnitt id="gleichungen" titel="Gleichungen">
      <p>Gleichungen kommen in der Differentialrechnung bei jeder Nullstellen- und Extremstellenbestimmung vor. Die Aussagen 1 bis 4 sind das Handwerkszeug dafür.</p>
      <Eingabehinweis />

      <Punkt id="polynomgleichungen">
        <Kontrolle
          aussage="polynomgleichungen"
          nummer="K1"
          titel="Polynomgleichungen"
          felder={[
            { id: 'a1', name: 'kleinere Lösung der ersten Gleichung', beschriftung: <>1. Gleichung: <Formel tex="x_1" /></>, erwartet: K1.a1 },
            { id: 'a2', name: 'größere Lösung der ersten Gleichung', beschriftung: <>1. Gleichung: <Formel tex="x_2" /></>, erwartet: K1.a2 },
            { id: 'b', name: 'Lösung der zweiten Gleichung', beschriftung: <>2. Gleichung: <Formel tex="x" /></>, erwartet: K1.b },
            { id: 'c', name: 'Anzahl der Lösungen der dritten Gleichung', beschriftung: <>3. Gleichung: Anzahl der Lösungen</>, erwartet: K1.cAnzahl },
          ]}
          hilfen={[
            <>Bei <Formel tex={t`ax^n=c`} /> stellst du zuerst nach <Formel tex="x^n" /> um und ziehst dann die <Formel tex="n" />-te Wurzel. Bei geradem <Formel tex="n" /> gibt es zwei Lösungen mit entgegengesetztem Vorzeichen.</>,
            <>Bei der dritten Gleichung klammerst du <Formel tex="x" /> aus. Der Rest enthält nur <Formel tex="x^4" /> und <Formel tex="x^2" nach="." /></>,
            <>Setze <Formel tex={t`z=x^2`} nach="," /> löse die quadratische Gleichung für <Formel tex="z" /> mit der pq-Formel und ziehe danach die Wurzel aus beiden Lösungen für <Formel tex="z" nach="." /></>,
          ]}
          loesung={[
            <>
              <Formel tex={t`3x^4-48=0`} /> liefert <Formel tex={t`x^4=16`} nach="," /> also <Formel tex="x_1=-2" /> und <Formel tex="x_2=2" nach="." />
            </>,
            <>
              <Formel tex={t`0{,}5x^5=-16`} /> liefert <Formel tex={t`x^5=-32`} nach="," /> also <Formel tex="x=-2" nach="." /> Bei ungeradem Exponenten gibt es nur eine Lösung.
            </>,
            <>
              <Formel tex={t`x^5-10x^3+9x=x\,(x^4-10x^2+9)=0`} nach="." /> Aus dem Faktor <Formel tex="x" /> folgt <Formel tex="x=0" nach="." /> Mit <Formel tex={t`z=x^2`} /> ist <Formel tex={t`z^2-10z+9=0`} /> und <Formel tex={t`z_{1/2}=5\pm\sqrt{25-9}=5\pm 4`} nach="," /> also <Formel tex="z=1" /> oder <Formel tex="z=9" nach="." />
            </>,
            <>
              Resubstitution: <Formel tex={t`x^2=1`} /> liefert <Formel tex="x=\pm 1" nach="," /> <Formel tex={t`x^2=9`} /> liefert <Formel tex="x=\pm 3" nach="." /> Die Lösungsmenge ist <Formel tex="L=\{-3;\,-1;\,0;\,1;\,3\}" nach="," /> es sind 5 Lösungen.
            </>,
          ]}
        >
          <p>
            Löse die Gleichungen: <Formel tex={t`3x^4-48=0`} nach="," /> <Formel tex={t`0{,}5x^5=-16`} /> und <Formel tex={t`x^5-10x^3+9x=0`} nach="." /> Gib bei der ersten Gleichung beide Lösungen an und bei der dritten die Anzahl der Lösungen.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="exponentialgleichungen">
        <Kontrolle
          aussage="exponentialgleichungen"
          nummer="K2"
          titel="Exponentialgleichungen"
          felder={[
            { id: 'a', name: 'Lösung der ersten Gleichung, auf zwei Nachkommastellen', beschriftung: <>1. Gleichung: <Formel tex="x" /></>, erwartet: K2.a, toleranz: TOL2 },
            { id: 'b1', name: 'kleinere Lösung der zweiten Gleichung', beschriftung: <>2. Gleichung: <Formel tex="x_1" /></>, erwartet: K2.b1, toleranz: TOL2 },
            { id: 'b2', name: 'größere Lösung der zweiten Gleichung, auf zwei Nachkommastellen', beschriftung: <>2. Gleichung: <Formel tex="x_2" /></>, erwartet: K2.b2, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Forme bei der ersten Gleichung so um, dass <Formel tex={t`e^{2x}`} /> allein steht. Dann wendest du auf beiden Seiten den natürlichen Logarithmus an (Modul <Modulverweis modul="umkehrfunktion">Umkehrfunktion</Modulverweis>).</>,
            <>Bei der zweiten Gleichung ist <Formel tex={t`e^{2x}=(e^x)^2`} nach="." /> Setze <Formel tex={t`z=e^x`} nach="," /> dann entsteht eine quadratische Gleichung.</>,
            <>Nach der Resubstitution <Formel tex={t`e^x=z`} /> gibt es nur für positive <Formel tex="z" /> eine Lösung, denn <Formel tex="e^x" /> ist immer positiv.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`3e^{2x}-7=11`} /> liefert <Formel tex={t`3e^{2x}=18`} nach="," /> also <Formel tex={t`e^{2x}=6`} nach="." /> Logarithmieren: <Formel tex={t`2x=\ln 6`} nach="," /> also <Formel tex={t`x=\tfrac12\ln 6\approx 0{,}90`} nach="." />
            </>,
            <>
              Mit <Formel tex={t`z=e^x`} /> ist <Formel tex={t`z^2-5z+4=0`} nach="." /> Die pq-Formel liefert <Formel tex={t`z_{1/2}=\tfrac52\pm\sqrt{\tfrac{25}{4}-4}=\tfrac52\pm\tfrac32`} nach="," /> also <Formel tex="z=1" /> oder <Formel tex="z=4" nach="." />
            </>,
            <>
              Resubstitution: <Formel tex={t`e^x=1`} /> liefert <Formel tex="x_1=0" nach="," /> <Formel tex={t`e^x=4`} /> liefert <Formel tex={t`x_2=\ln 4\approx 1{,}39`} nach="." />
            </>,
          ]}
        >
          <p>
            Löse <Formel tex={t`3e^{2x}-7=11`} /> und <Formel tex={t`e^{2x}-5e^x+4=0`} nach="." /> Gib die Lösungen auf zwei Nachkommastellen an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="trig-gleichungen">
        <Kontrolle
          aussage="trig-gleichungen"
          nummer="K3"
          titel="Trigonometrische Gleichungen"
          felder={[
            { id: 'a1', name: 'kleinere Lösung der ersten Gleichung als Vielfaches von Pi', beschriftung: <>1. Gleichung: <Formel tex="x_1" /></>, erwartet: K3.a1 },
            { id: 'a2', name: 'größere Lösung der ersten Gleichung als Vielfaches von Pi', beschriftung: <>1. Gleichung: <Formel tex="x_2" /></>, erwartet: K3.a2 },
            { id: 'b1', name: 'kleinere Lösung der zweiten Gleichung, auf zwei Nachkommastellen', beschriftung: <>2. Gleichung: <Formel tex="x_1" /></>, erwartet: K3.b1, toleranz: TOL2 },
            { id: 'b2', name: 'größere Lösung der zweiten Gleichung, auf zwei Nachkommastellen', beschriftung: <>2. Gleichung: <Formel tex="x_2" /></>, erwartet: K3.b2, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Isoliere zuerst die Winkelfunktion, bei der ersten Gleichung <Formel tex={t`\cos x`} nach="." /> Den Taschenrechner stellst du auf Bogenmaß. Die zweite Lösung in der Periode findest du über die Symmetrie des Kosinus (Modul <Modulverweis modul="trigonometrische-gleichungen">Trigonometrische Gleichungen</Modulverweis>).</>,
            <>Bei der zweiten Gleichung substituierst du <Formel tex={t`z=0{,}5\,(x-1)`} nach="." /> Dann ist <Formel tex={t`\sin z=0{,}5`} nach="." /></>,
            <>Die Periode der zweiten Funktion ist <Formel tex={t`\frac{2\pi}{0{,}5}=4\pi\approx 12{,}57`} nach="." /> Prüfe, welche Lösungen im Intervall <Formel tex={t`[0;\,12]`} /> liegen.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`4\cos x-1=1`} /> liefert <Formel tex={t`\cos x=\tfrac12`} nach="." /> Die erste Lösung ist <Formel tex={t`x_1=\cos^{-1}\left(\tfrac12\right)=\tfrac{\pi}{3}`} nach="." /> Wegen der Symmetrie liegt die zweite Lösung bei <Formel tex={t`x_2=2\pi-\tfrac{\pi}{3}=\tfrac{5\pi}{3}`} nach="." />
              <Bild daten={BILD_K3A} unter={<>Die Gerade <Formel tex="y=1" /> (blau gestrichelt) schneidet <Formel tex="K_f" /> in <Formel tex="P" /> und <Formel tex="Q" nach="." /></>} />
            </>,
            <>
              <Formel tex={t`2\sin(0{,}5\,(x-1))+3=4`} /> liefert <Formel tex={t`\sin z=0{,}5`} /> mit <Formel tex={t`z=0{,}5\,(x-1)`} nach="." /> Es ist <Formel tex={t`z_1=\sin^{-1}(0{,}5)=\tfrac{\pi}{6}`} /> und <Formel tex={t`z_2=\pi-\tfrac{\pi}{6}=\tfrac{5\pi}{6}`} nach="." />
            </>,
            <>
              Resubstitution <Formel tex={t`x=2z+1`} nach=":" /> <Formel tex={t`x_1=\tfrac{\pi}{3}+1\approx 2{,}05`} /> und <Formel tex={t`x_2=\tfrac{5\pi}{3}+1\approx 6{,}24`} nach="." /> Die nächste Lösung <Formel tex={t`x_1+4\pi\approx 14{,}61`} /> liegt nicht mehr im Intervall <Formel tex={t`[0;\,12]`} nach="." />
            </>,
          ]}
        >
          <p>
            Löse <Formel tex={t`4\cos x-1=1`} /> für <Formel tex={t`x\in[0;\,2\pi]`} /> exakt als Vielfache von <Formel tex="\pi" nach="," /> und <Formel tex={t`2\sin(0{,}5\,(x-1))+3=4`} /> für <Formel tex={t`x\in[0;\,12]`} /> auf zwei Nachkommastellen.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K3A} unter={<>Das Schaubild von <Formel tex={t`f(x)=4\cos x-1`} /> mit der Geraden <Formel tex="y=1" nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="nullprodukt">
        <Kontrolle
          aussage="nullprodukt"
          nummer="K4"
          titel="Satz vom Nullprodukt"
          felder={[
            { id: 'x1', name: 'kleinste Lösung', beschriftung: <>kleinste Lösung</>, erwartet: K4.loesungen[0]! },
            { id: 'x2', name: 'zweitkleinste Lösung', beschriftung: <>zweitkleinste Lösung</>, erwartet: K4.loesungen[1]! },
            { id: 'x3', name: 'zweitgrößte Lösung', beschriftung: <>zweitgrößte Lösung</>, erwartet: K4.loesungen[2]! },
            { id: 'x4', name: 'größte Lösung', beschriftung: <>größte Lösung</>, erwartet: K4.loesungen[3]! },
          ]}
          hilfen={[
            <>Ein Produkt ist null, wenn mindestens ein Faktor null ist. Setze jeden Faktor einzeln gleich null.</>,
            <>Den ersten Faktor löst du durch Wurzelziehen, den zweiten mit der pq-Formel.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`x^2-16=0`} /> liefert <Formel tex={t`x=\pm 4`} nach="." />
            </>,
            <>
              <Formel tex={t`x^2+3x-10=0`} /> liefert mit der pq-Formel <Formel tex={t`x=-\tfrac32\pm\sqrt{\tfrac94+10}=-\tfrac32\pm\tfrac72`} nach="," /> also <Formel tex="x=2" /> oder <Formel tex="x=-5" nach="." />
            </>,
            <>
              Die Lösungsmenge ist <Formel tex="L=\{-5;\,-4;\,2;\,4\}" nach="." />
            </>,
          ]}
        >
          <p>
            Löse <Formel tex={t`(x^2-16)(x^2+3x-10)=0`} nach="." /> Gib die vier Lösungen der Größe nach an.
          </p>
        </Kontrolle>
      </Punkt>
    </Abschnitt>
  );
}
