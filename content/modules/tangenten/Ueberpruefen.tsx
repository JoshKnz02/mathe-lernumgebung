import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import {
  BILD_A1,
  BILD_A10_F,
  BILD_A10_G,
  BILD_A11,
  BILD_A12,
  BILD_A13,
  BILD_A14,
  BILD_A3,
  BILD_A4,
  BILD_A5,
  BILD_A6,
  BILD_A7,
  BILD_A9,
  BILD_A9_KONTROLLE,
  BILD_F2,
  BILD_F8,
} from './Bilder';
import { A1, A10, A11, A12, A13, A14, A3, A4, A5, A6, A7, A9, TOL2, TOL_ABW } from './daten';

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>0,87</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{5}{3}`} nach=")" /> ein, ohne Einheit. Negative Zahlen schreibst du mit Minuszeichen. Dezimalzahlen werden nur dort auf zwei Nachkommastellen genau akzeptiert, wo es in der Aufgabe steht. Sonst gib den exakten Wert ein, zum Beispiel einen Bruch.
    </Hinweis>
  );
}

function Aufgabe1() {
  return (
    <Aufgabe
      nummer="1"
      titel="Tangente in einem Kurvenpunkt"
      felder={[
        { id: 'y', name: 'Höhe des Berührpunkts f von 3', beschriftung: <><Formel tex="f(3)" /></>, erwartet: A1.y },
        { id: 'm', name: 'Steigung der Tangente f Strich von 3', beschriftung: <><Formel tex="f'(3)" /></>, erwartet: A1.m },
        { id: 'n', name: 'y-Achsenabschnitt der Tangente', beschriftung: <>y-Achsenabschnitt <Formel tex="n" /></>, erwartet: A1.n },
      ]}
      hilfen={[
        <>Der Berührpunkt ist <Formel tex={t`P(3\,|\,f(3))`} nach="." /> Berechne <Formel tex="f(3)" /> und <Formel tex="f'(3)" nach="." /></>,
        <>Setze <Formel tex="x_0=3" nach="," /> <Formel tex="f(3)" /> und <Formel tex="f'(3)" /> in <Formel tex={t`y=f'(x_0)\cdot(x-x_0)+f(x_0)`} /> ein und multipliziere aus.</>,
      ]}
      loesung={[
        <><Formel tex="f(3)=-9+12-1=2" nach="," /> der Berührpunkt ist <Formel tex={t`P(3\,|\,2)`} nach="." /></>,
        <><Formel tex="f'(x)=-2x+4" /> und damit <Formel tex="f'(3)=-2" nach="." /></>,
        <>
          <Formel tex={t`y=-2\cdot(x-3)+2=-2x+6+2=-2x+8`} nach="." /> Der y-Achsenabschnitt ist <Formel tex="n=8" nach="." />
          <Bild daten={BILD_A1} unter={<>Orange: <Formel tex="K_f" nach="," /> blau gestrichelt: die Tangente, grün: das Steigungsdreieck zu <Formel tex="f'(3)=-2" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex="f(x)=-x^2+4x-1" nach="." /> Bestimme die Gleichung der Tangente <Formel tex="t" /> an <Formel tex="K_f" /> im Punkt <Formel tex={t`P(3\,|\,f(3))`} nach="." /> Trage <Formel tex="f(3)" nach="," /> <Formel tex="f'(3)" /> und den y-Achsenabschnitt <Formel tex="n" /> von <Formel tex="t:\ y=mx+n" /> ein.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A1} unter={<>Orange: <Formel tex="K_f" nach="," /> blau gestrichelt: die Tangente in <Formel tex="P" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage2() {
  const optionen = [
    opt('richtig', <><Formel tex="y=4x-3" /></>, true, <>Richtig.</>),
    opt('vergessen', <><Formel tex="y=4x-8" /></>, false, <>Hier fehlt am Ende der Funktionswert <Formel tex="f(2)=5" nach="." /> Die Gerade <Formel tex="y=4\cdot(x-2)" /> hat zwar die richtige Steigung, geht aber durch <Formel tex={t`(2\,|\,0)`} /> und nicht durch den Berührpunkt <Formel tex={t`P(2\,|\,5)`} nach="." /></>),
    opt('achsenabschnitt', <><Formel tex="y=4x+5" /></>, false, <>Die Zahl 5 ist der Funktionswert an der Stelle 2, nicht der y-Achsenabschnitt. Die Gerade <Formel tex="y=4x+5" /> hat bei <Formel tex="x=2" /> den Wert 13 und geht deshalb nicht durch <Formel tex="P" nach="." /></>),
    opt('vertauscht', <><Formel tex="y=5x-6" /></>, false, <>Hier sind Steigung und Funktionswert vertauscht: Gerechnet wurde <Formel tex="y=5\cdot(x-2)+4" nach="." /> Die Steigung ist aber <Formel tex="f'(2)=4" /> und der Funktionswert <Formel tex="f(2)=5" nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="2"
      titel="Tangentengleichung wählen"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Mit <Formel tex="f'(x)=2x" /> ist <Formel tex="f'(2)=4" /> und <Formel tex="f(2)=2^2+1=5" nach="." /> Also gilt <Formel tex={t`y=4\cdot(x-2)+5=4x-8+5=4x-3`} nach="." />
          </p>
          <Bild daten={BILD_F2} unter={<>Blau gestrichelt: die Tangente <Formel tex="y=4x-3" /> durch <Formel tex="P" nach="." /> Schwarz: <Formel tex="y=4x-8" nach="," /> parallel dazu, aber ohne Berührpunkt.</>} />
        </>
      }
    >
      <p>
        Gegeben ist <Formel tex="f(x)=x^2+1" nach="." /> Welche Gleichung hat die Tangente an <Formel tex="K_f" /> im Punkt <Formel tex={t`P(2\,|\,f(2))`} nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Stellen mit vorgegebener Steigung"
      felder={[
        { id: 'x1', name: 'kleinere Stelle', beschriftung: <>kleinere Stelle <Formel tex="x_1" /></>, erwartet: A3.x1 },
        { id: 'y1', name: 'Funktionswert an der kleineren Stelle, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f(x_1)" /> auf zwei Stellen gerundet</>, erwartet: A3.y1, toleranz: TOL2 },
        { id: 'x2', name: 'größere Stelle', beschriftung: <>größere Stelle <Formel tex="x_2" /></>, erwartet: A3.x2 },
        { id: 'y2', name: 'Funktionswert an der größeren Stelle', beschriftung: <><Formel tex="f(x_2)" /></>, erwartet: A3.y2 },
      ]}
      hilfen={[
        <>Gesucht sind die Stellen, an denen die Ableitung den Wert 3 hat. Löse <Formel tex="f'(x)=3" nach="." /></>,
        <>Es ist <Formel tex="f'(x)=x^2-2x" nach="." /> Bringe <Formel tex="x^2-2x=3" /> auf die Form <Formel tex="x^2-2x-3=0" /> und löse die quadratische Gleichung.</>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=x^2-2x" nach="." /> Ansatz: <Formel tex="f'(x)=3" nach="." /></>,
        <><Formel tex="x^2-2x-3=0" /> hat die Lösungen <Formel tex="x_1=-1" /> und <Formel tex="x_2=3" nach="." /> Probe: <Formel tex="f'(-1)=1+2=3" /> und <Formel tex="f'(3)=9-6=3" nach="." /></>,
        <>
          <Formel tex={t`f(-1)=-\frac{1}{3}-1=-\frac{4}{3}`} /> und <Formel tex={t`f(3)=9-9=0`} nach="." /> Die Berührpunkte sind <Formel tex={t`P_1\left(-1\,\middle|\,-\frac{4}{3}\right)`} /> und <Formel tex={t`P_2(3\,|\,0)`} nach="." /> Die beiden Tangenten sind parallel.
          <Bild daten={BILD_A3} unter={<>Orange: <Formel tex="K_f" nach="," /> gestrichelt: die beiden Tangenten mit der Steigung 3.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=\frac{1}{3}x^3-x^2`} nach="." /> An welchen Stellen hat <Formel tex="K_f" /> die Steigung 3? Gib auch die y-Koordinaten der zugehörigen Berührpunkte an, die kleinere Stelle zuerst. Rundungen bei <Formel tex="f(x_1)" /> auf zwei Nachkommastellen sind erlaubt.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A3} unter={<>Orange: <Formel tex="K_f" nach="," /> gestrichelt: die beiden Tangenten mit der Steigung 3.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Tangente parallel zu einer Geraden"
      felder={[
        { id: 'x', name: 'Stelle des Berührpunkts', beschriftung: <>Stelle <Formel tex="x_0" /> des Berührpunkts</>, erwartet: A4.u },
        { id: 'y', name: 'Funktionswert an der Stelle des Berührpunkts', beschriftung: <><Formel tex="f(x_0)" /></>, erwartet: A4.y },
        { id: 'n', name: 'y-Achsenabschnitt der Tangente', beschriftung: <>y-Achsenabschnitt <Formel tex="n" /></>, erwartet: A4.n },
      ]}
      hilfen={[
        <>Parallele Geraden haben dieselbe Steigung. Die Gerade <Formel tex="g" /> hat die Steigung 1, also muss <Formel tex="f'(x_0)=1" /> gelten.</>,
        <>Es ist <Formel tex={t`f'(x)=\frac{1}{2}x-2`} nach="." /> Löse <Formel tex={t`\frac{1}{2}x-2=1`} nach="." /></>,
        <>Berechne danach <Formel tex="f(x_0)" /> und setze in <Formel tex={t`y=f'(x_0)\cdot(x-x_0)+f(x_0)`} /> ein.</>,
      ]}
      loesung={[
        <>Die Steigung von <Formel tex="g" /> ist 1. Ansatz: <Formel tex="f'(x_0)=1" nach="." /></>,
        <><Formel tex={t`f'(x)=\frac{1}{2}x-2`} /> liefert <Formel tex={t`\frac{1}{2}x_0-2=1`} /> und damit <Formel tex="x_0=6" nach="." /></>,
        <>
          <Formel tex={t`f(6)=\frac{1}{4}\cdot 36-12=-3`} nach="," /> der Berührpunkt ist <Formel tex={t`P(6\,|\,-3)`} nach="." /> Tangente: <Formel tex="y=1\cdot(x-6)-3=x-9" nach="." />
          <Bild daten={BILD_A4} unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz: die Gerade <Formel tex="g" nach="," /> blau gestrichelt: die parallele Tangente in <Formel tex="P" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex={t`f(x)=\frac{1}{4}x^2-2x`} /> und die Gerade <Formel tex="g:\ y=x+3" nach="." /> Bestimme die Gleichung einer Tangente an <Formel tex="K_f" nach="," /> die parallel zu <Formel tex="g" /> verläuft, und gib den Berührpunkt an. Trage die Stelle <Formel tex="x_0" /> des Berührpunkts, <Formel tex="f(x_0)" /> und den y-Achsenabschnitt <Formel tex="n" /> der Tangente ein.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A4} unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz: die Gerade <Formel tex="g" nach="," /> blau gestrichelt: die parallele Tangente.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Senkrechte Tangenten"
      felder={[
        { id: 'm1', name: 'Steigung der Tangente an der Stelle 2', beschriftung: <>Steigung <Formel tex="m_1" /> von <Formel tex="t_1" /></>, erwartet: A5.m1 },
        { id: 'm2', name: 'Steigung der senkrechten Tangente', beschriftung: <>Steigung <Formel tex="m_2" /> von <Formel tex="t_2" /></>, erwartet: A5.m2 },
        { id: 'x2', name: 'Stelle des Berührpunkts der senkrechten Tangente', beschriftung: <>Stelle <Formel tex="x_2" /> von <Formel tex="t_2" /></>, erwartet: A5.u2 },
      ]}
      hilfen={[
        <>Berechne <Formel tex="m_1=f'(2)" nach="." /></>,
        <>Zwei Geraden stehen senkrecht aufeinander, wenn das Produkt ihrer Steigungen <Formel tex="-1" /> ist: <Formel tex={t`m_1\cdot m_2=-1`} nach="." /></>,
        <>Die Stelle <Formel tex="x_2" /> erhältst du aus <Formel tex="f'(x_2)=m_2" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=2x-2" /> und damit <Formel tex="m_1=f'(2)=2" nach="." /></>,
        <><Formel tex={t`2\cdot m_2=-1`} /> liefert <Formel tex={t`m_2=-\frac{1}{2}`} nach="." /></>,
        <>
          <Formel tex={t`f'(x_2)=2x_2-2=-\frac{1}{2}`} /> liefert <Formel tex={t`x_2=\frac{3}{4}`} nach="." /> Der Berührpunkt ist <Formel tex={t`P_2\left(\frac{3}{4}\,\middle|\,-\frac{15}{16}\right)`} nach="." />
          <Bild daten={BILD_A5} unter={<>Blau gestrichelt: <Formel tex="t_1" /> in <Formel tex="P_1" nach="," /> schwarz gestrichelt: <Formel tex="t_2" /> in <Formel tex="P_2" nach="." /> Beide Achsen haben dieselbe Einteilung.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex="f(x)=x^2-2x" nach="." /> Die Tangente <Formel tex="t_1" /> berührt <Formel tex="K_f" /> an der Stelle <Formel tex="x_1=2" nach="." /> Bestimme ihre Steigung <Formel tex="m_1" nach="," /> die Steigung <Formel tex="m_2" /> einer dazu senkrechten Tangente <Formel tex="t_2" /> und die Stelle <Formel tex="x_2" nach="," /> an der <Formel tex="t_2" /> die Kurve berührt.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A5} unter={<>Blau gestrichelt: <Formel tex="t_1" nach="," /> schwarz gestrichelt: <Formel tex="t_2" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Bereich mit vorgegebener Steigung"
      felder={[
        { id: 'a', name: 'linke Grenze des Bereichs', beschriftung: <>linke Grenze <Formel tex="a" /></>, erwartet: A6.links },
        { id: 'b', name: 'rechte Grenze des Bereichs', beschriftung: <>rechte Grenze <Formel tex="b" /></>, erwartet: A6.rechts },
      ]}
      hilfen={[
        <>Die Steigung der Tangente an der Stelle <Formel tex="x" /> ist <Formel tex="f'(x)" nach="." /> Gesucht ist der Bereich mit <Formel tex="f'(x)<5" nach="." /></>,
        <>Es ist <Formel tex="f'(x)=x^2-2x-3" nach="." /> Bestimme zuerst die Stellen mit <Formel tex="f'(x)=5" nach="." /> Das Schaubild von <Formel tex="f'" /> ist eine nach oben geöffnete Parabel.</>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=x^2-2x-3" nach="." /> Ansatz: <Formel tex="f'(x)<5" nach="." /></>,
        <><Formel tex="x^2-2x-3=5" /> führt auf <Formel tex="x^2-2x-8=0" /> mit <Formel tex="x_1=-2" /> und <Formel tex="x_2=4" nach="." /></>,
        <>
          Die Parabel <Formel tex="K_{f'}" /> ist nach oben geöffnet, also liegt sie zwischen den Schnittstellen unter der Geraden <Formel tex="y=5" nach="." /> Die Tangenten haben im Bereich <Formel tex="]-2;\,4[" /> eine Steigung kleiner als 5, also <Formel tex="a=-2" /> und <Formel tex="b=4" nach="." />
          <Bild daten={BILD_A6} unter={<>Orange: das Schaubild der Ableitungsfunktion <Formel tex="K_{f'}" nach="," /> schwarz: die Gerade <Formel tex="y=5" nach="," /> blau: der gesuchte Bereich auf der x-Achse.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=\frac{1}{3}x^3-x^2-3x`} nach="." /> In welchem Bereich haben die Tangenten an <Formel tex="K_f" /> eine Steigung kleiner als 5? Der Bereich ist ein Intervall <Formel tex="]a;\,b[" nach="." /> Trage <Formel tex="a" /> und <Formel tex="b" /> ein.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A6} unter={<>Orange: das Schaubild der Ableitungsfunktion <Formel tex="K_{f'}" nach="," /> schwarz: die Gerade <Formel tex="y=5" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Ist die Gerade eine Tangente?"
      felder={[
        { id: 'x', name: 'Stelle mit der Steigung 2', beschriftung: <>Stelle <Formel tex="x_0" /> mit <Formel tex="f'(x_0)=2" /></>, erwartet: A7.u },
        { id: 'f', name: 'Funktionswert f von x null', beschriftung: <><Formel tex="f(x_0)" /></>, erwartet: A7.y },
        { id: 'g1', name: 'Wert der ersten Geraden an der Stelle x null', beschriftung: <><Formel tex="g_1(x_0)" /></>, erwartet: A7.g1u },
        { id: 'g2', name: 'Wert der zweiten Geraden an der Stelle x null', beschriftung: <><Formel tex="g_2(x_0)" /></>, erwartet: A7.g2u },
        { id: 'nr', name: 'Nummer der Geraden, die Tangente ist', beschriftung: <>Nummer der Tangente (1 oder 2)</>, erwartet: A7.tangente },
      ]}
      hilfen={[
        <>Beide Geraden haben die Steigung 2. Eine Tangente muss dort berühren, wo <Formel tex="K_f" /> die Steigung 2 hat. Bestimme diese Stelle aus <Formel tex="f'(x_0)=2" nach="." /></>,
        <>Mache dann die Punktprobe: Berechne <Formel tex="f(x_0)" /> und die Werte der beiden Geraden an der Stelle <Formel tex="x_0" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=x" /> und <Formel tex="f'(x_0)=2" /> liefert <Formel tex="x_0=2" nach="." /></>,
        <><Formel tex="f(2)=\frac{1}{2}\cdot 4+1=3" nach="," /> also liegt der mögliche Berührpunkt bei <Formel tex={t`P(2\,|\,3)`} nach="." /></>,
        <>
          <Formel tex="g_1(2)=4-1=3" /> stimmt mit <Formel tex="f(2)" /> überein, <Formel tex="g_2(2)=4+1=5" /> nicht. Also ist <Formel tex="g_1" /> die Tangente, <Formel tex="g_2" /> ist nur parallel zu ihr und schneidet <Formel tex="K_f" /> bei <Formel tex="x=0" /> und <Formel tex="x=4" nach="." />
          <Bild daten={BILD_A7} unter={<>Blau gestrichelt: <Formel tex="g_1" /> berührt <Formel tex="K_f" /> in <Formel tex="P" nach="." /> Schwarz: <Formel tex="g_2" /> schneidet <Formel tex="K_f" /> zweimal.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex={t`f(x)=\frac{1}{2}x^2+1`} /> und die Geraden <Formel tex="g_1:\ y=2x-1" /> und <Formel tex="g_2:\ y=2x+1" nach="." /> Genau eine der beiden Geraden ist Tangente an <Formel tex="K_f" nach="." /> Bestimme die Stelle <Formel tex="x_0" /> mit <Formel tex="f'(x_0)=2" nach="," /> die Werte <Formel tex="f(x_0)" nach="," /> <Formel tex="g_1(x_0)" /> und <Formel tex="g_2(x_0)" /> und die Nummer der Tangente.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A7} unter={<>Orange: <Formel tex="K_f" nach="," /> blau gestrichelt: <Formel tex="g_1" nach="," /> schwarz: <Formel tex="g_2" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage8() {
  const optionen = [
    opt('doppelt', <>Ja. <Formel tex="t" /> berührt <Formel tex="K_f" /> in <Formel tex={t`P_1(-1\,|\,-1)`} /> und in <Formel tex={t`P_2(1\,|\,-1)`} nach="." /> In beiden Punkten ist <Formel tex="t" /> die Tangente.</>, true, <>Richtig.</>),
    opt('einmal', <>Nein. Eine Tangente hat mit <Formel tex="K_f" /> höchstens einen Punkt gemeinsam.</>, false, <>Das gilt nur für Kreise. Bei Schaubildern von Funktionen kann eine Tangente weitere Punkte mit <Formel tex="K_f" /> gemeinsam haben, hier sogar zwei Berührpunkte.</>),
    opt('sekante', <>Ja, aber nur in einem der beiden Punkte. Im anderen ist <Formel tex="t" /> eine Sekante.</>, false, <>Berechne <Formel tex="f'(-1)" /> und <Formel tex="f'(1)" nach=":" /> Beide Werte sind 0, in beiden Punkten stimmen also Punkt und Steigung mit <Formel tex="t" /> überein.</>),
    opt('schnitt', <>Nein. <Formel tex="t" /> schneidet <Formel tex="K_f" /> nicht, also kann sie keine Tangente sein.</>, false, <>Eine Tangente muss <Formel tex="K_f" /> nicht schneiden. Sie berührt <Formel tex="K_f" /> und hat dort dieselbe Steigung. Hier liegt <Formel tex="K_f" /> in der Nähe der Berührpunkte oberhalb von <Formel tex="t" nach="." /></>),
  ];
  return (
    <Auswahlfrage
      nummer="8"
      titel="Eine Tangente, zwei Berührpunkte"
      optionen={platziere(optionen, 3)}
      erklaerung={
        <>
          <p>
            Es ist <Formel tex="f(-1)=f(1)=1-2=-1" /> und <Formel tex="f'(x)=4x^3-4x" /> mit <Formel tex="f'(-1)=f'(1)=0" nach="." /> Die waagerechte Gerade <Formel tex="y=-1" /> hat die Steigung 0 und geht durch beide Punkte. Sie ist deshalb in beiden Punkten die Tangente. Man nennt sie eine Doppeltangente.
          </p>
          <Bild daten={BILD_F8} unter={<>Blau gestrichelt: <Formel tex="t" /> berührt <Formel tex="K_f" /> in <Formel tex="P_1" /> und <Formel tex="P_2" nach="." /></>} />
        </>
      }
    >
      <p>
        Gegeben ist <Formel tex="f(x)=x^4-2x^2" /> mit <Formel tex="f'(x)=4x^3-4x" nach="." /> Die Gerade <Formel tex="t:\ y=-1" /> verläuft waagerecht. Welche Aussage ist richtig?
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Tangenten aus der Abbildung"
      felder={[
        { id: 'mA', name: 'Steigung der Tangente in A', beschriftung: <>Steigung <Formel tex="m_A" /></>, erwartet: A9.mA },
        { id: 'nA', name: 'y-Achsenabschnitt der Tangente in A', beschriftung: <>y-Achsenabschnitt <Formel tex="n_A" /></>, erwartet: A9.nA },
        { id: 'mB', name: 'Steigung der Tangente in B', beschriftung: <>Steigung <Formel tex="m_B" /></>, erwartet: A9.mB },
        { id: 'nB', name: 'y-Achsenabschnitt der Tangente in B', beschriftung: <>y-Achsenabschnitt <Formel tex="n_B" /></>, erwartet: A9.nB },
      ]}
      hilfen={[
        <>Lies die Koordinaten von <Formel tex="A" /> und <Formel tex="B" /> am Gitter ab. Die Steigung jeder Tangente findest du mit einem Steigungsdreieck.</>,
        <>Setze Punkt und Steigung in die Punkt-Steigungs-Form ein und multipliziere aus. Der y-Achsenabschnitt von <Formel tex="t_B" /> liegt außerhalb der Abbildung, hier musst du rechnen.</>,
        <>Prüfe dein Ergebnis mit der Funktionsgleichung: Berechne <Formel tex="f(x_0)" /> und <Formel tex="f'(x_0)" /> an den beiden Stellen.</>,
      ]}
      loesung={[
        <>Aus der Abbildung: <Formel tex={t`A(4\,|\,0)`} /> und <Formel tex={t`B(6\,|\,3)`} nach="." /> Die Tangente in <Formel tex="A" /> steigt um 1 pro Schritt nach rechts, die Tangente in <Formel tex="B" /> um 2. Also ist <Formel tex="m_A=1" /> und <Formel tex="m_B=2" nach="." /></>,
        <><Formel tex={t`t_A:\ y=1\cdot(x-4)+0=x-4`} nach="," /> also <Formel tex="n_A=-4" nach="." /> <Formel tex={t`t_B:\ y=2\cdot(x-6)+3=2x-9`} nach="," /> also <Formel tex="n_B=-9" nach="." /></>,
        <>
          Probe mit <Formel tex={t`f(x)=\frac{1}{4}x^2-x`} /> und <Formel tex={t`f'(x)=\frac{1}{2}x-1`} nach=":" /> <Formel tex="f(4)=4-4=0" nach="," /> <Formel tex="f'(4)=1" nach="," /> <Formel tex="f(6)=9-6=3" nach="," /> <Formel tex="f'(6)=2" nach="." /> Das passt zu den abgelesenen Werten.
          <Bild daten={BILD_A9_KONTROLLE} unter={<>Die Steigungsdreiecke: in <Formel tex="A" /> 1 nach rechts und 1 nach oben (blau), in <Formel tex="B" /> 1 nach rechts und 2 nach oben (schwarz).</>} />
        </>,
      ]}
    >
      <p>
        Die Abbildung zeigt das Schaubild <Formel tex="K_f" /> der Funktion <Formel tex={t`f(x)=\frac{1}{4}x^2-x`} /> mit den Berührpunkten <Formel tex="A" /> und <Formel tex="B" /> und den zugehörigen Tangenten. Lies Berührpunkte und Steigungen ab, bestimme die Gleichungen der beiden Tangenten <Formel tex="t_A" /> und <Formel tex="t_B" /> in der Form <Formel tex="y=mx+n" /> und prüfe sie durch Rechnung.
      </p>
      <Bild daten={BILD_A9} unter={<>Orange: <Formel tex="K_f" nach="," /> gestrichelt: die Tangenten in <Formel tex="A" /> und <Formel tex="B" nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_A9_KONTROLLE} unter={<>Die Steigungsdreiecke der beiden Tangenten.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe10() {
  return (
    <Aufgabe
      nummer="10"
      titel="Steigung und Symmetrie"
      felder={[
        { id: 'f', name: 'Steigung von K f an der Stelle minus 2', beschriftung: <>Steigung von <Formel tex="K_f" /> bei <Formel tex="x=-2" /></>, erwartet: A10.fMinus },
        { id: 'g', name: 'Steigung von K g an der Stelle minus 2', beschriftung: <>Steigung von <Formel tex="K_g" /> bei <Formel tex="x=-2" /></>, erwartet: A10.gMinus },
      ]}
      hilfen={[
        <>Überlege, was das Spiegeln an der y-Achse mit der Richtung der Tangente macht: Aus „steigt“ wird „fällt“.</>,
        <>Bei der Punktsymmetrie zum Ursprung wird das Schaubild um 180° gedreht. Was passiert dabei mit der Richtung einer Geraden?</>,
      ]}
      loesung={[
        <><Formel tex="K_f" /> ist symmetrisch zur y-Achse. Die Spiegelung vertauscht links und rechts. Die Tangente in <Formel tex={t`P(2\,|\,0)`} /> steigt mit der Steigung 4, ihr Spiegelbild in <Formel tex={t`Q(-2\,|\,0)`} /> fällt mit der Steigung <Formel tex="-4" nach="." />
          <Bild daten={BILD_A10_F} unter={<>Die Tangenten in <Formel tex="P" /> und <Formel tex="Q" /> sind Spiegelbilder an der y-Achse, ihre Steigungen sind <Formel tex="4" /> und <Formel tex="-4" nach="." /></>} /></>,
        <>
          <Formel tex="K_g" /> ist symmetrisch zum Ursprung. Die Drehung um 180° ändert die Richtung einer Geraden nicht, die Tangente in <Formel tex={t`Q(-2\,|\,2)`} /> ist parallel zur Tangente in <Formel tex={t`P(2\,|\,-2)`} nach="." /> Die Steigung bei <Formel tex="x=-2" /> ist wieder 1.
          <Bild daten={BILD_A10_G} unter={<>Die Tangenten in <Formel tex="P" /> und <Formel tex="Q" /> sind parallel, beide haben die Steigung 1.</>} />
        </>,
        <>Probe: <Formel tex="f'(x)=x^3-2x" /> erfüllt <Formel tex="f'(-x)=-f'(x)" nach="," /> und <Formel tex={t`g'(x)=\frac{3}{4}x^2-2`} /> erfüllt <Formel tex="g'(-x)=g'(x)" nach="." /></>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex={t`f(x)=\frac{1}{4}x^4-x^2`} /> und <Formel tex={t`g(x)=\frac{1}{4}x^3-2x`} nach="." /> Das Schaubild <Formel tex="K_f" /> ist symmetrisch zur y-Achse, <Formel tex="K_g" /> ist symmetrisch zum Ursprung. Bei <Formel tex="x=2" /> hat <Formel tex="K_f" /> die Steigung 4 und <Formel tex="K_g" /> die Steigung 1. Gib ohne Ableitung die Steigungen von <Formel tex="K_f" /> und <Formel tex="K_g" /> bei <Formel tex="x=-2" /> an und überlege, wie du das mit der Symmetrie begründest.
      </p>
      <Kontrollschaubild>
        <div className="bilder-paar">
          <Bild daten={BILD_A10_F} unter={<><Formel tex="K_f" nach="." /></>} />
          <Bild daten={BILD_A10_G} unter={<><Formel tex="K_g" nach="." /></>} />
        </div>
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe11() {
  return (
    <Aufgabe
      nummer="11"
      titel="Senkrechte Tangenten mit Parameter"
      felder={[
        { id: 'a1', name: 'positiver Wert von a', beschriftung: <>positiver Wert <Formel tex="a_1" /></>, erwartet: A11.a1 },
        { id: 'a2', name: 'negativer Wert von a', beschriftung: <>negativer Wert <Formel tex="a_2" /></>, erwartet: A11.a2 },
      ]}
      hilfen={[
        <>Bestimme die Nullstellen von <Formel tex="g_a" nach="." /> Sie sind dieselben wie bei <Formel tex="f" nach="," /> weil <Formel tex="a" /> nur ein Faktor ist.</>,
        <>Es ist <Formel tex="g_a'(x)=a\cdot f'(x)" nach="." /> Berechne die Steigungen <Formel tex="m_1=g_a'(0)" /> und <Formel tex="m_2=g_a'(6)" /> in Abhängigkeit von <Formel tex="a" nach="." /></>,
        <>Die Tangenten stehen senkrecht aufeinander, wenn <Formel tex={t`m_1\cdot m_2=-1`} /> gilt. Löse diese Gleichung nach <Formel tex="a" nach="." /> Gib die Werte als Brüche ein.</>,
      ]}
      loesung={[
        <><Formel tex="f(x)=0" /> liefert <Formel tex="x(-x+6)=0" /> mit <Formel tex="x_1=0" /> und <Formel tex="x_2=6" nach="," /> also <Formel tex={t`N_1(0\,|\,0)`} /> und <Formel tex={t`N_2(6\,|\,0)`} nach="." /></>,
        <><Formel tex="g_a'(x)=a\cdot(-2x+6)" nach="." /> Damit ist <Formel tex="m_1=g_a'(0)=6a" /> und <Formel tex="m_2=g_a'(6)=-6a" nach="." /></>,
        <>
          <Formel tex={t`6a\cdot(-6a)=-1`} /> führt auf <Formel tex="-36a^2=-1" /> und <Formel tex={t`a^2=\frac{1}{36}`} nach="." /> Also ist <Formel tex={t`a_1=\frac{1}{6}`} /> und <Formel tex={t`a_2=-\frac{1}{6}`} nach="." />
          <Bild daten={BILD_A11} unter={<>Für <Formel tex={t`a=\frac{1}{6}`} nach=":" /> Die Tangenten in <Formel tex="N_1" /> (blau) und <Formel tex="N_2" /> (schwarz) haben die Steigungen 1 und <Formel tex="-1" nach="." /> Beide Achsen haben dieselbe Einteilung.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex="f(x)=-x^2+6x" /> und die Funktionen <Formel tex="g_a" /> mit <Formel tex={t`g_a(x)=a\cdot f(x)`} /> und <Formel tex={t`a\in\mathbb{R}\setminus\{0\}`} nach="." /> Das Schaubild <Formel tex="K_{g_a}" /> schneidet die x-Achse in <Formel tex="N_1" /> und <Formel tex="N_2" nach="." /> Für welche Werte von <Formel tex="a" /> stehen die Tangenten in <Formel tex="N_1" /> und <Formel tex="N_2" /> senkrecht aufeinander? Trage die positive und die negative Lösung ein.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A11} unter={<>Für <Formel tex={t`a=\frac{1}{6}`} nach=":" /> das Schaubild <Formel tex="K_{g_a}" /> mit den Tangenten in <Formel tex="N_1" /> und <Formel tex="N_2" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe12() {
  return (
    <Aufgabe
      nummer="12"
      titel="Tangente als Näherung"
      felder={[
        { id: 'n42', name: 'Näherungswert für Wurzel aus 4,2', beschriftung: <>Näherung für <Formel tex={t`\sqrt{4{,}2}`} /></>, erwartet: A12.t42 },
        { id: 'n39', name: 'Näherungswert für Wurzel aus 3,9', beschriftung: <>Näherung für <Formel tex={t`\sqrt{3{,}9}`} /></>, erwartet: A12.t39 },
        { id: 'abw', name: 'Abweichung der Näherung für Wurzel aus 4,2 vom Taschenrechnerwert, auf vier Stellen gerundet', beschriftung: <>Abweichung bei <Formel tex={t`\sqrt{4{,}2}`} /> auf vier Stellen gerundet</>, erwartet: A12.abweichung42, toleranz: TOL_ABW },
      ]}
      hilfen={[
        <>Es ist <Formel tex={t`f'(x)=\frac{1}{2\sqrt{x}}`} nach="." /> Berechne <Formel tex="f'(4)" /> und stelle die Tangente in <Formel tex={t`P(4\,|\,2)`} /> auf.</>,
        <>In der Nähe von <Formel tex="x_0=4" /> liegt die Tangente fast auf <Formel tex="K_f" nach="." /> Setze deshalb <Formel tex="4{,}2" /> und <Formel tex="3{,}9" /> in die Tangentengleichung ein.</>,
      ]}
      loesung={[
        <><Formel tex={t`f'(4)=\frac{1}{2\cdot 2}=\frac{1}{4}`} nach="." /> Tangente: <Formel tex={t`t(x)=\frac{1}{4}(x-4)+2`} nach="." /></>,
        <><Formel tex={t`t(4{,}2)=\frac{1}{4}\cdot 0{,}2+2=2{,}05`} /> und <Formel tex={t`t(3{,}9)=\frac{1}{4}\cdot(-0{,}1)+2=1{,}975`} nach="." /></>,
        <>
          Der Taschenrechner liefert <Formel tex={t`\sqrt{4{,}2}\approx 2{,}0494`} nach="." /> Die Abweichung ist <Formel tex={t`2{,}05-2{,}0494=0{,}0006`} nach="." /> Die Tangente liegt hier oberhalb von <Formel tex="K_f" nach="," /> der Näherungswert ist etwas zu groß.
          <Bild daten={BILD_A12} unter={<>Blau gestrichelt: die Tangente in <Formel tex="P" nach="," /> darauf die Näherungswerte bei <Formel tex="3{,}9" /> und <Formel tex="4{,}2" nach="." /> Nahe bei <Formel tex="x=4" /> sind Tangente und <Formel tex="K_f" /> kaum zu unterscheiden.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=\sqrt{x}`} nach="." /> Die Tangente an <Formel tex="K_f" /> im Punkt <Formel tex={t`P(4\,|\,2)`} /> liegt in der Nähe von <Formel tex="P" /> fast auf <Formel tex="K_f" nach="." /> Bestimme ihre Gleichung und berechne damit Näherungswerte für <Formel tex={t`\sqrt{4{,}2}`} /> und <Formel tex={t`\sqrt{3{,}9}`} nach="." /> Vergleiche den Näherungswert für <Formel tex={t`\sqrt{4{,}2}`} /> mit dem Wert deines Taschenrechners und trage die Abweichung (Näherungswert minus Taschenrechnerwert) auf vier Nachkommastellen genau ein.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A12} unter={<>Orange: <Formel tex="K_f" nach="," /> blau gestrichelt: die Tangente in <Formel tex="P" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe13() {
  return (
    <Aufgabe
      nummer="13"
      titel="Zwei Parabeln berühren sich"
      felder={[
        { id: 'x', name: 'Berührstelle', beschriftung: <>Berührstelle <Formel tex="x_0" /></>, erwartet: A13.u },
        { id: 'c', name: 'Wert von c', beschriftung: <><Formel tex="c" /></>, erwartet: A13.c },
      ]}
      hilfen={[
        <>Zwei Schaubilder berühren sich an der Stelle <Formel tex="x_0" nach="," /> wenn <Formel tex="f(x_0)=g(x_0)" /> und <Formel tex="f'(x_0)=g'(x_0)" /> gilt.</>,
        <>Die zweite Bedingung enthält <Formel tex="c" /> nicht. Bestimme daraus zuerst <Formel tex="x_0" nach="," /> setze dann in die erste Bedingung ein.</>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=2x" /> und <Formel tex="g'(x)=-2x+4" nach="." /> Aus <Formel tex="f'(x_0)=g'(x_0)" /> folgt <Formel tex="2x_0=-2x_0+4" /> und damit <Formel tex="x_0=1" nach="." /></>,
        <><Formel tex="f(1)=1" /> und <Formel tex="g(1)=-1+4+c=3+c" nach="." /> Aus <Formel tex="f(1)=g(1)" /> folgt <Formel tex="1=3+c" /> und damit <Formel tex="c=-2" nach="." /></>,
        <>
          Die Schaubilder berühren sich in <Formel tex={t`P(1\,|\,1)`} /> und haben dort die gemeinsame Tangente <Formel tex="y=2x-1" nach="." />
          <Bild daten={BILD_A13} unter={<>Orange: <Formel tex="K_f" nach="," /> blau: <Formel tex="K_g" /> für <Formel tex="c=-2" nach="," /> schwarz gestrichelt: die gemeinsame Tangente.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex="f(x)=x^2" /> und <Formel tex="g(x)=-x^2+4x+c" /> mit <Formel tex={t`c\in\mathbb{R}`} nach="." /> Für welchen Wert von <Formel tex="c" /> berühren sich <Formel tex="K_f" /> und <Formel tex="K_g" nach="?" /> Trage die Berührstelle <Formel tex="x_0" /> und den Wert von <Formel tex="c" /> ein.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A13} unter={<>Orange: <Formel tex="K_f" nach="," /> blau: <Formel tex="K_g" /> für <Formel tex="c=-2" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe14() {
  return (
    <Aufgabe
      nummer="14"
      titel="Orthogonaler Schnitt"
      felder={[
        { id: 'x', name: 'Schnittstelle, an der die Schaubilder senkrecht aufeinander stehen', beschriftung: <>Stelle <Formel tex="x_0" /></>, erwartet: A14.u },
        { id: 'c', name: 'Wert von c', beschriftung: <><Formel tex="c" /></>, erwartet: A14.c },
      ]}
      hilfen={[
        <>Die Schaubilder schneiden sich bei <Formel tex="x_0" /> orthogonal, wenn <Formel tex="f(x_0)=g(x_0)" /> und <Formel tex={t`f'(x_0)\cdot g'(x_0)=-1`} /> gilt.</>,
        <>Die Gerade <Formel tex="g" /> hat die Steigung <Formel tex={t`-\frac{1}{2}`} nach="." /> Bestimme daraus <Formel tex="x_0" nach="," /> dann <Formel tex="c" nach="." /> Gib <Formel tex="c" /> als Bruch oder Dezimalzahl ein.</>,
      ]}
      loesung={[
        <><Formel tex="f'(x)=2x" /> und <Formel tex={t`g'(x)=-\frac{1}{2}`} nach="." /> Aus <Formel tex={t`2x_0\cdot\left(-\frac{1}{2}\right)=-1`} /> folgt <Formel tex="-x_0=-1" /> und damit <Formel tex="x_0=1" nach="." /></>,
        <><Formel tex="f(1)=1" /> und <Formel tex={t`g(1)=c-\frac{1}{2}`} nach="." /> Aus <Formel tex="f(1)=g(1)" /> folgt <Formel tex={t`c=\frac{3}{2}`} nach="." /></>,
        <>
          Die Gerade <Formel tex={t`g(x)=\frac{3}{2}-\frac{1}{2}x`} /> schneidet <Formel tex="K_f" /> auch bei <Formel tex={t`x=-\frac{3}{2}`} nach="." /> Dort ist <Formel tex="f'(x)=-3" /> und das Produkt der Steigungen <Formel tex={t`-3\cdot\left(-\frac{1}{2}\right)=\frac{3}{2}`} nach="," /> der Schnitt ist dort nicht orthogonal.
          <Bild daten={BILD_A14} unter={<>Bei <Formel tex="P" /> steht die Gerade senkrecht auf der schwarz gestrichelten Tangente an <Formel tex="K_f" nach="," /> bei <Formel tex="Q" /> nicht.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex="f(x)=x^2" /> und die Gerade <Formel tex={t`g(x)=c-\frac{1}{2}x`} /> mit <Formel tex={t`c\in\mathbb{R}`} nach="." /> Für welchen Wert von <Formel tex="c" /> schneiden sich <Formel tex="K_f" /> und <Formel tex="K_g" /> an einer Stelle <Formel tex="x_0" /> orthogonal? Trage <Formel tex="x_0" /> und <Formel tex="c" /> ein.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A14} unter={<>Orange: <Formel tex="K_f" nach="," /> blau: die Gerade für <Formel tex={t`c=\frac{3}{2}`} nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>Hilfen und Lösungsweg kannst du schrittweise aufdecken. Zuerst geht es um die Tangentengleichung, dann um Stellen mit vorgegebener Steigung, parallele und senkrechte Tangenten, um das Prüfen einer Geraden und am Ende um die gegenseitige Lage von Schaubildern.</p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Frage2 />
      <Aufgabe3 />
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
      <Aufgabe7 />
      <Frage8 />
      <Aufgabe9 />
      <Aufgabe10 />
      <Aufgabe11 />
      <Aufgabe12 />
      <Aufgabe13 />
      <Aufgabe14 />
    </Abschnitt>
  );
}
