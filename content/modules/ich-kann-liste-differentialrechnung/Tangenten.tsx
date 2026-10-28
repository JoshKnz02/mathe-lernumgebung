import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';
import { BILD_K12, BILD_K13, BILD_K14A, BILD_K14B } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Punkt } from './Punkt';
import { K12, K13, K14, TOL2 } from './werte';

/** Bereich Tangenten: Aussagen 12 bis 14. */
export function Tangenten() {
  return (
    <Abschnitt id="tangenten" titel="Tangenten">
      <p>Hier geht es um Tangente und Normale, um den Nachweis einer Tangente und um die gegenseitige Lage zweier Schaubilder.</p>
      <Eingabehinweis />

      <Punkt id="tangente-normale">
        <Kontrolle
          aussage="tangente-normale"
          nummer="K12"
          titel="Tangente und Normale"
          felder={[
            { id: 'mt', name: 'Steigung der Tangente', beschriftung: <>Tangente: <Formel tex="m" /></>, erwartet: K12.mt },
            { id: 'nt', name: 'y-Achsenabschnitt der Tangente', beschriftung: <>Tangente: <Formel tex="n" /></>, erwartet: K12.nt },
            { id: 'mn', name: 'Steigung der Normalen', beschriftung: <>Normale: <Formel tex="m" /></>, erwartet: K12.mn, toleranz: 1e-9 },
            { id: 'nn', name: 'y-Achsenabschnitt der Normalen', beschriftung: <>Normale: <Formel tex="n" /></>, erwartet: K12.nn, toleranz: 1e-9 },
          ]}
          hilfen={[
            <>Berechne <Formel tex="f(3)" /> und <Formel tex="f'(3)" nach="." /> Die Tangente ist <Formel tex={t`y=f'(3)\,(x-3)+f(3)`} nach="." /> (Modul <Modulverweis modul="tangenten">Tangenten</Modulverweis>).</>,
            <>Die Normale steht senkrecht auf der Tangente. Für die Steigungen gilt <Formel tex={t`m_t\cdot m_n=-1`} /> (siehe Modul <Modulverweis modul="funktionsterme-aufstellen">Aufstellen von Funktionstermen</Modulverweis>, Übersetzung von „senkrecht“). Sie geht durch denselben Punkt.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f(3)=27-27+3+4=7`} /> und <Formel tex={t`f'(x)=3x^2-6x+1`} nach="," /> also <Formel tex={t`f'(3)=27-18+1=10`} nach="." />
            </>,
            <>
              Tangente: <Formel tex={t`y=10\,(x-3)+7=10x-23`} nach="," /> also <Formel tex="m=10" /> und <Formel tex="n=-23" nach="." />
            </>,
            <>
              Normale: <Formel tex={t`m_n=-\frac{1}{10}=-0{,}1`} /> und <Formel tex={t`y=-0{,}1\,(x-3)+7=-0{,}1x+7{,}3`} nach="." /> Also <Formel tex="m=-0{,}1" /> und <Formel tex="n=7{,}3" nach="." />
              <Bild daten={BILD_K12} unter={<>Die Tangente (blau gestrichelt) und die Normale (schwarz gestrichelt) in <Formel tex="P" /> stehen senkrecht aufeinander. Die Achsen haben verschiedene Maßstäbe, deshalb sieht der Winkel nicht rechtwinklig aus.</>} />
            </>,
          ]}
        >
          <p>
            Bestimme die Funktionsterme von Tangente und Normale im Punkt <Formel tex="P(3\,|\,f(3))" /> an <Formel tex="K_f" /> mit <Formel tex={t`f(x)=x^3-3x^2+x+4`} nach="." /> Gib jeweils Steigung <Formel tex="m" /> und y-Achsenabschnitt <Formel tex="n" /> von <Formel tex="y=mx+n" /> an.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K12} unter={<>Das Schaubild <Formel tex="K_f" /> mit Tangente und Normale in <Formel tex="P" nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="tangente-nachweisen">
        <Kontrolle
          aussage="tangente-nachweisen"
          nummer="K13"
          titel="Eine Gerade als Tangente nachweisen"
          felder={[
            { id: 'x', name: 'x-Koordinate des Berührpunkts', beschriftung: <><Formel tex="x" />-Koordinate von <Formel tex="B" /></>, erwartet: K13.x },
            { id: 'y', name: 'y-Koordinate des Berührpunkts, auf zwei Nachkommastellen', beschriftung: <><Formel tex="y" />-Koordinate von <Formel tex="B" /></>, erwartet: K13.y, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Eine Gerade ist Tangente, wenn es eine Stelle gibt, an der beide Schaubilder dieselbe Steigung und denselben Funktionswert haben (Modul <Modulverweis modul="tangenten">Tangenten</Modulverweis>).</>,
            <>Suche zuerst die Stelle mit <Formel tex={t`f'(x)=g'(x)`} nach="." /> Prüfe danach, ob dort auch <Formel tex={t`f(x)=g(x)`} /> gilt.</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`f'(x)=2e^{2x}`} /> und <Formel tex={t`g'(x)=2e`} nach="." /> Aus <Formel tex={t`2e^{2x}=2e`} /> folgt <Formel tex={t`e^{2x}=e^1`} nach="," /> also <Formel tex={t`2x=1`} /> und <Formel tex="x=0{,}5" nach="." />
            </>,
            <>
              <Formel tex={t`f(0{,}5)=e^1=e`} /> und <Formel tex={t`g(0{,}5)=2e\cdot 0{,}5=e`} nach="." /> Die Funktionswerte stimmen überein, also ist <Formel tex="g" /> Tangente an <Formel tex="K_f" nach="." /> Der Berührpunkt ist <Formel tex={t`B(0{,}5\,|\,e)`} /> mit <Formel tex={t`e\approx 2{,}72`} nach="." />
              <Bild daten={BILD_K13} unter={<>Die Gerade <Formel tex="g" /> (blau gestrichelt) berührt <Formel tex="K_f" /> in <Formel tex="B" nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex={t`f(x)=e^{2x}`} /> und <Formel tex={t`g(x)=2e\cdot x`} nach="." /> Weise nach, dass die Gerade <Formel tex="g" /> Tangente an das Schaubild von <Formel tex="f" /> ist, und gib den Berührpunkt an.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K13} unter={<>Das Schaubild <Formel tex="K_f" /> mit der Geraden <Formel tex="g" nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="gegenseitige-lage">
        <Kontrolle
          aussage="gegenseitige-lage"
          nummer="K14"
          titel="Gegenseitige Lage zweier Schaubilder"
          felder={[
            { id: 'a', name: 'Schnittwinkel im ersten Fall in Grad, auf zwei Nachkommastellen', beschriftung: <>1. Fall: Schnittwinkel in Grad</>, erwartet: K14.winkel1, toleranz: TOL2 },
            { id: 'b', name: 'Schnittwinkel im zweiten Fall in Grad', beschriftung: <>2. Fall: Schnittwinkel in Grad</>, erwartet: K14.winkel2, toleranz: 1e-6 },
          ]}
          hilfen={[
            <>Berechne an der Stelle <Formel tex="x_0" /> die Funktionswerte und die Steigungen beider Schaubilder. Sind die Funktionswerte gleich, haben sie dort einen gemeinsamen Punkt.</>,
            <>Sind auch die Steigungen gleich, berühren sich die Schaubilder. Ist das Produkt der Steigungen <Formel tex="-1" nach="," /> schneiden sie sich senkrecht. Sonst schneiden sie sich unter dem Winkel zwischen den Tangenten, <Formel tex={t`\alpha=|\tan^{-1}(m_1)-\tan^{-1}(m_2)|`} nach="." /></>,
          ]}
          loesung={[
            <>
              1. Fall: <Formel tex={t`f(2)=8-4+2=6`} /> und <Formel tex={t`g(2)=4+2=6`} nach="." /> Die Steigungen sind <Formel tex={t`f'(2)=3\cdot 4-2\cdot 2=8`} /> und <Formel tex={t`g'(2)=2\cdot 2=4`} nach="." /> Sie sind verschieden, die Schaubilder schneiden sich in <Formel tex={t`S(2\,|\,6)`} nach="," /> nicht senkrecht, denn <Formel tex={t`8\cdot 4\ne -1`} nach="." /> Schnittwinkel: <Formel tex={t`\tan^{-1}(8)-\tan^{-1}(4)\approx 82{,}87^\circ-75{,}96^\circ\approx 6{,}91^\circ`} nach="." />
              <Bild daten={BILD_K14A} unter={<>Die beiden Schaubilder schneiden sich in <Formel tex="S" /> unter einem sehr kleinen Winkel.</>} />
            </>,
            <>
              2. Fall: <Formel tex="f(1)=1" /> und <Formel tex="g(1)=1" nach="." /> Die Steigungen sind <Formel tex={t`f'(1)=2`} /> und <Formel tex={t`g'(1)=-\tfrac12`} nach="." /> Das Produkt ist <Formel tex={t`2\cdot\left(-\tfrac12\right)=-1`} nach="," /> die Schaubilder schneiden sich im Punkt <Formel tex={t`S(1\,|\,1)`} /> senkrecht, der Schnittwinkel beträgt 90°.
              <Bild daten={BILD_K14B} unter={<>Parabel und Gerade schneiden sich in <Formel tex="S" /> senkrecht (die Achsen haben verschiedene Maßstäbe).</>} />
            </>,
          ]}
        >
          <p>
            Untersuche die gegenseitige Lage von <Formel tex="K_f" /> und <Formel tex="K_g" /> an der Stelle <Formel tex="x_0" nach=":" /> 1. Fall: <Formel tex={t`f(x)=x^3-x^2+2`} nach="," /> <Formel tex={t`g(x)=x^2+2`} nach="," /> <Formel tex="x_0=2" nach="." /> 2. Fall: <Formel tex={t`f(x)=x^2`} nach="," /> <Formel tex={t`g(x)=-\tfrac12x+\tfrac32`} nach="," /> <Formel tex="x_0=1" nach="." /> Gib jeweils den Schnittwinkel an.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K14A} unter={<>1. Fall: Die Schaubilder schneiden sich in <Formel tex="S" nach="." /></>} />
          <Bild daten={BILD_K14B} unter={<>2. Fall: Parabel und Gerade schneiden sich senkrecht (verschiedene Maßstäbe der Achsen).</>} />
        </Kontrollschaubild>
      </Punkt>
    </Abschnitt>
  );
}
