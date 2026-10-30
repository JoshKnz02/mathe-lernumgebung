import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_K19, BILD_K20 } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Punkt } from './Punkt';
import { K19, K20, TOL2 } from './werte';

/** Bereich Mittelwert und Anwendung: Aussagen 19, 20 und „!“. */
export function Mittelwert() {
  return (
    <Abschnitt id="mittelwert" titel="Mittelwert und Anwendung">
      <p>Hier geht es um den Mittelwert einer Funktion, der im Bildungsplan zu den Wahlgebieten gehört, und um die Anwendung des Gelernten auf größere Aufgaben.</p>
      <Eingabehinweis />

      <Punkt id="mittelwert-berechnen">
        <Kontrolle
          aussage="mittelwert-berechnen"
          nummer="K19"
          titel="Mittelwert berechnen und deuten"
          felder={[
            { id: 'm', name: 'Mittelwert von f auf dem Intervall von 0 bis 3', beschriftung: <>Mittelwert <Formel tex="m" /></>, erwartet: K19.mittelwert },
            { id: 'x', name: 'Stelle im Intervall, an der f den Mittelwert annimmt, auf zwei Nachkommastellen', beschriftung: <>Stelle mit <Formel tex={t`f(x)=m`} /></>, erwartet: K19.stelle, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Der Mittelwert ist das Integral geteilt durch die Länge des Intervalls (Modul <Modulverweis modul="mittelwert">Mittelwert einer Funktion</Modulverweis>).</>,
            <>Für die Stelle löst du die Gleichung <Formel tex={t`\frac{1}{2}x^2+1=m`} nach="." /> Nur eine Lösung liegt im Intervall.</>,
          ]}
          loesung={[
            <>
              Eine Stammfunktion ist <Formel tex={t`F(x)=\frac{1}{6}x^3+x`} nach="." /> Es ist <Formel tex={t`F(3)=\frac{27}{6}+3=7{,}5`} /> und <Formel tex="F(0)=0" nach="." />
            </>,
            <>
              Das Integral ist 7,5, die Länge ist 3, also <Formel tex={t`m=\frac{7{,}5}{3}=2{,}5`} nach="." /> Das Rechteck mit der Höhe 2,5 und der Breite 3 hat denselben Inhalt wie die Fläche unter <Formel tex="K_f" nach="." />
            </>,
            <>
              <Formel tex={t`\frac{1}{2}x^2+1=2{,}5`} /> führt auf <Formel tex={t`x^2=3`} nach="." /> Im Intervall liegt <Formel tex={t`x=\sqrt{3}\approx 1{,}73`} nach="," /> die Lösung <Formel tex={t`-\sqrt{3}`} /> liegt außerhalb.
              <FlaechenFigur daten={BILD_K19} unter={<>Fläche unter <Formel tex="K_f" /> und Rechteck der Höhe <Formel tex={t`m=2{,}5`} nach="." /> Das Schaubild erreicht diese Höhe bei <Formel tex={t`x\approx 1{,}73`} nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex={t`f(x)=\frac{1}{2}x^2+1`} nach="." /> Bestimme den Mittelwert von <Formel tex="f" /> auf <Formel tex="[0;\,3]" /> und die Stelle in diesem Intervall, an der <Formel tex="f" /> den Mittelwert annimmt.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K19} unter={<>Das Schaubild <Formel tex="K_f" /> mit der Fläche und dem Rechteck der Höhe <Formel tex="m" nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="mittelwert-anwenden">
        <Kontrolle
          aussage="mittelwert-anwenden"
          nummer="K20"
          titel="Mittelwert in einer Sachaufgabe"
          felder={[
            { id: 'g', name: 'Gesamtmenge in Litern', beschriftung: <>Gesamtmenge in <Formel tex="\ell" /></>, erwartet: K20.gesamt },
            { id: 'm', name: 'Mittelwert der Zuflussrate in Litern pro Stunde, auf zwei Nachkommastellen', beschriftung: <>Mittelwert in <Formel tex={t`\ell/\text{h}`} /></>, erwartet: K20.mittelwert, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Die Gesamtmenge ist die Fläche unter dem Schaubild der Rate. Zerlege sie in zwei Rechtecke.</>,
            <>Der Mittelwert ist die Gesamtmenge geteilt durch die Dauer. Der Mittelwert der beiden Zahlen 8 und 2 wäre falsch, weil die beiden Raten verschieden lange andauern.</>,
          ]}
          loesung={[
            <>
              Von 0 bis 3 Stunden: <Formel tex={t`3\cdot 8=24`} nach="." /> Von 3 bis 8 Stunden: <Formel tex={t`5\cdot 2=10`} nach="." /> Zusammen <Formel tex="34" /> Liter.
            </>,
            <>
              Die Dauer ist 8 Stunden: <Formel tex={t`m=\frac{34}{8}=4{,}25`} nach="." /> Der Mittelwert der Zahlen 8 und 2 wäre <Formel tex={t`\frac{8+2}{2}=5`} nach="," /> aber die Rate 2 gilt 5 Stunden lang und die Rate 8 nur 3 Stunden. Der Mittelwert der Funktion gewichtet nach der Dauer.
              <FlaechenFigur daten={BILD_K20} unter={<>Die Rate in Litern pro Stunde. Die gestrichelte Höhe 4,25 ist der Mittelwert, nicht 5.</>} />
            </>,
          ]}
        >
          <p>
            Ein Tank wird 3 Stunden lang mit 8 Litern pro Stunde und danach 5 Stunden lang mit 2 Litern pro Stunde gefüllt. Bestimme die Gesamtmenge und den Mittelwert der Zuflussrate über die 8 Stunden.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K20} unter={<>Das Schaubild der Zuflussrate.</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="transfer" />
    </Abschnitt>
  );
}
