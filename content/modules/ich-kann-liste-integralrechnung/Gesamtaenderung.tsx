import { Abschnitt } from '@/components/Abschnitt';
import { FlaechenFigur } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_K7 } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K7 } from './werte';

/** Bereich Gesamtänderung: Aussagen 6 und 7. */
export function Gesamtaenderung() {
  return (
    <Abschnitt id="gesamtaenderung" titel="Gesamtänderung">
      <p>Hier geht es um die Gesamtänderung einer Größe, wenn nur ihre Änderungsrate bekannt ist, einmal in Worten und einmal am Schaubild.</p>
      <Eingabehinweis />

      <Punkt id="gesamtaenderung">
        <Kontrollfrage
          aussage="gesamtaenderung"
          nummer="K6"
          titel="Was das Integral einer Rate bedeutet"
          optionen={platziere(
            [
              opt('a', <>Die Menge in Litern, die in diesen 8 Minuten insgesamt zugeflossen ist.</>, true, <>Richtig.</>),
              opt('b', <>Die mittlere Zuflussrate in Litern pro Minute.</>, false, <>Die mittlere Rate erhältst du erst, wenn du das Integral durch die Länge des Zeitraums teilst. Das Integral selbst hat die Einheit Liter, nicht Liter pro Minute.</>),
              opt('c', <>Die Zuflussrate zum Zeitpunkt <Formel tex="t=8" nach="." /></>, false, <>Die Rate zu einem Zeitpunkt liest du direkt am Schaubild oder im Term ab, ohne zu integrieren.</>),
              opt('d', <>Wie stark sich die Zuflussrate in diesen 8 Minuten geändert hat.</>, false, <>Die Änderung der Rate bekommst du durch die Ableitung der Rate. Das Integral der Rate sammelt dagegen die Zuflüsse auf.</>),
            ],
            1,
          )}
          erklaerung={
            <>
              <p>
                Die Rate sagt, wie viele Liter pro Minute zufließen. Ein kleiner Zeitabschnitt liefert die Menge Rate mal Dauer. Das Integral addiert alle diese Mengen und gibt die Gesamtänderung des Bestands an (Modul <Modulverweis modul="integral-hinfuehrung">Hinführung zur Integralrechnung</Modulverweis>).
              </p>
            </>
          }
        >
          <p>
            Ein Tank wird mit der Zuflussrate <Formel tex="r(t)" /> in Litern pro Minute gefüllt, <Formel tex="t" /> ist die Zeit in Minuten. Was gibt <Formel tex={t`\int_{2}^{10} r(t)\,\mathrm{d}t`} /> an?
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="gesamtaenderung-grafisch">
        <Kontrolle
          aussage="gesamtaenderung-grafisch"
          nummer="K7"
          titel="Gesamtänderung am Schaubild"
          felder={[{ id: 'm', name: 'zugeflossene Menge in Litern, auf vier Liter genau', beschriftung: <>zugeflossene Menge in <Formel tex="\ell" /></>, erwartet: K7.gesamt, toleranz: K7.toleranz }]}
          hilfen={[
            <>Die Gesamtänderung ist die Fläche zwischen dem Schaubild der Rate und der Zeitachse (Modul <Modulverweis modul="integral-hinfuehrung">Hinführung zur Integralrechnung</Modulverweis>). Zerlege sie in Teile, die du kennst.</>,
            <>Von 0 bis 4 und von 4 bis 10 sind es ein Dreieck und ein Rechteck. Den gekrümmten Teil von 10 bis 14 schätzt du, zum Beispiel über die Kästchen oder als Teil eines Rechtecks mit der Breite 4 und der Höhe 8.</>,
          ]}
          loesung={[
            <>
              Dreieck von 0 bis 4: <Formel tex={t`\frac{1}{2}\cdot 4\cdot 8=16`} nach="." /> Rechteck von 4 bis 10: <Formel tex={t`6\cdot 8=48`} nach="." />
            </>,
            <>
              Der gekrümmte Teil füllt etwa zwei Drittel des Rechtecks <Formel tex={t`4\cdot 8=32`} nach="," /> das sind etwa <Formel tex="21" nach="." /> Zusammen: <Formel tex={t`16+48+21=85`} /> Liter, genauer ergibt die Rechnung etwa <Formel tex="85{,}3" /> Liter.
              <FlaechenFigur daten={BILD_K7} unter={<>Dreieck (blau), Rechteck (gelb) und gekrümmte Fläche (blau) unter dem Schaubild der Zuflussrate.</>} />
            </>,
          ]}
        >
          <p>
            Die Abbildung zeigt die Zuflussrate eines Tanks. Bestimme näherungsweise, wie viele Liter von <Formel tex="t=0" /> bis <Formel tex="t=14" /> insgesamt zugeflossen sind. Eine Abweichung von bis zu 4 Litern ist erlaubt.
          </p>
          <FlaechenFigur daten={{ ...BILD_K7, flaechen: [] }} unter={<>Die Zuflussrate in Litern pro Minute.</>} />
        </Kontrolle>
        <Kontrollschaubild>
          <FlaechenFigur daten={BILD_K7} unter={<>Die Flächen unter dem Schaubild der Zuflussrate.</>} />
        </Kontrollschaubild>
      </Punkt>
    </Abschnitt>
  );
}
