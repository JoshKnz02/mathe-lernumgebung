import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { Paarbild } from '@/components/Paarbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_A4, BILD_A5, BILD_A6, BILD_A7, BILD_A8, BILD_F1, BILD_F2, BILD_F3, PAAR_G5, scharBild } from './Bilder';
import { G1, G2, G3, G4, SCHAR_AUFGABE } from './daten';

const KF = <Formel tex="K_f" />;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl oder als Dezimalzahl mit Komma ein, zum Beispiel <code>2</code> oder <code>-1,5</code>, ohne Einheit. Negative Zahlen schreibst du mit Minuszeichen. Wo die Aufgabe es verlangt, rundest du auf zwei Nachkommastellen. Bei den Auswahlfragen wählst du genau eine Antwort aus.
    </Hinweis>
  );
}

/** Frage 1: Globales Verhalten einer ganzrationalen Funktion fünften Grades. */
function Frage1() {
  const optionen = [
    opt('richtig', <>{KF} verläuft vom II. in den IV. Quadranten.</>, true, <>Richtig.</>),
    opt(
      'iii-i',
      <>{KF} verläuft vom III. in den I. Quadranten.</>,
      false,
      <>Dieser Verlauf gehört zu einem ungeraden Grad mit <strong>positivem</strong> Leitkoeffizienten. Hier ist der Leitkoeffizient <Formel tex="-2" nach="," /> also negativ: Für <Formel tex={String.raw`x\to\infty`} /> geht <Formel tex="f(x)" /> nach unten.</>,
    ),
    opt(
      'ii-i',
      <>{KF} verläuft vom II. in den I. Quadranten.</>,
      false,
      <>So verläuft ein Schaubild bei geradem Grad und positivem Leitkoeffizienten. Der Grad ist hier aber 5, also ungerade. Bei ungeradem Grad enden die beiden Seiten in entgegengesetzten Richtungen.</>,
    ),
    opt(
      'kubisch',
      <>Der Summand <Formel tex="x^3" /> bestimmt das Verhalten, deshalb verläuft {KF} vom III. in den I. Quadranten.</>,
      false,
      <>Für sehr große <Formel tex="|x|" /> bestimmt nicht <Formel tex="x^3" nach="," /> sondern der Summand mit der höchsten Hochzahl das Verhalten. Das ist <Formel tex="-2x^5" nach="." /></>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="1"
      titel="Globales Verhalten einer ganzrationalen Funktion"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            Der Summand mit der höchsten Hochzahl ist <Formel tex="-2x^5" nach="." /> Die Hochzahl 5 ist ungerade und der Leitkoeffizient <Formel tex="-2" /> ist negativ. Deshalb gilt <Formel tex={String.raw`f(x)\to-\infty`} /> für <Formel tex={String.raw`x\to\infty`} /> und <Formel tex={String.raw`f(x)\to\infty`} /> für <Formel tex={String.raw`x\to-\infty`} nach="." /> Das Schaubild verläuft vom II. in den IV. Quadranten.
          </p>
          <Bild daten={BILD_F1} unter={<>Das Schaubild von <Formel tex={t`f(x)=-2x^5+x^3-4x`} nach="." /> Es kommt von links oben und fällt nach rechts unten.</>} />
        </>
      }
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=-2x^5+x^3-4x`} nach="." /> Welche Aussage über den Verlauf von {KF} ist richtig?
      </p>
    </Auswahlfrage>
  );
}

/** Frage 2: Asymptote einer Exponentialfunktion. */
function Frage2() {
  const optionen = [
    opt(
      'rechts',
      <>Für <Formel tex={String.raw`x\to\infty`} /> nähert sich <Formel tex="f(x)" /> der Zahl 4, die Gerade <Formel tex="y=4" /> ist waagerechte Asymptote. Für <Formel tex={String.raw`x\to-\infty`} /> gilt <Formel tex={String.raw`f(x)\to-\infty`} nach="." /></>,
      true,
      <>Richtig.</>,
    ),
    opt(
      'links',
      <>Für <Formel tex={String.raw`x\to-\infty`} /> nähert sich <Formel tex="f(x)" /> der Zahl 4, die Gerade <Formel tex="y=4" /> ist waagerechte Asymptote nach links.</>,
      false,
      <>Für <Formel tex={String.raw`x\to-\infty`} /> wird <Formel tex="-x" /> positiv und groß, also wird <Formel tex="e^{-x}" /> riesig. Wegen des Faktors <Formel tex="-3" /> geht <Formel tex={String.raw`f(x)\to-\infty`} nach="." /> Die Asymptote gilt nach rechts, wo <Formel tex="e^{-x}" /> gegen 0 geht.</>,
    ),
    opt(
      'minus3',
      <>Die Gerade <Formel tex="y=-3" /> ist waagerechte Asymptote, denn <Formel tex="-3" /> ist der Faktor vor <Formel tex="e^{-x}" nach="." /></>,
      false,
      <>Der Faktor vor <Formel tex="e^{-x}" /> ist nicht der Grenzwert. Für <Formel tex={String.raw`x\to\infty`} /> geht <Formel tex="-3e^{-x}" /> gegen 0, übrig bleibt die Zahl 4: <Formel tex={String.raw`f(x)\to 4`} nach="." /></>,
    ),
    opt(
      'keine',
      <>{KF} hat keine Asymptote, denn <Formel tex="e^{-x}" /> wird nie null.</>,
      false,
      <><Formel tex="e^{-x}" /> wird tatsächlich nie genau null, aber für große <Formel tex="x" /> beliebig klein. Für eine Asymptote genügt es, dass sich <Formel tex="f(x)" /> der Zahl 4 beliebig nähert. Das Schaubild erreicht die Gerade <Formel tex="y=4" /> nie, nähert sich ihr aber an.</>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="2"
      titel="Asymptote einer Exponentialfunktion"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Für <Formel tex={String.raw`x\to\infty`} /> geht <Formel tex="e^{-x}" /> gegen 0, also <Formel tex={String.raw`f(x)=4-3e^{-x}\to 4`} nach="." /> Nach rechts ist <Formel tex="y=4" /> waagerechte Asymptote. Für <Formel tex={String.raw`x\to-\infty`} /> wächst <Formel tex="e^{-x}" /> über alle Grenzen, und wegen <Formel tex="-3" /> geht <Formel tex={String.raw`f(x)\to-\infty`} nach="." />
          </p>
          <Bild daten={BILD_F2} unter={<>Das Schaubild von <Formel tex={t`f(x)=4-3e^{-x}`} /> mit der waagerechten Asymptote <Formel tex="y=4" /> (blau gestrichelt).</>} />
        </>
      }
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=4-3e^{-x}`} nach="." /> Welche Aussage über das Verhalten von {KF} ist richtig?
      </p>
    </Auswahlfrage>
  );
}

/** Frage 3: Symmetrie zum Ursprung erkennen. */
function Frage3() {
  const optionen = [
    opt('a', <><Formel tex={t`f(x)=x^5-3x^3+x`} /></>, true, <>Richtig.</>),
    opt(
      'b',
      <><Formel tex={t`f(x)=x^4-2x^2+1`} /></>,
      false,
      <>Hier kommen nur gerade Hochzahlen vor (4, 2 und 0). Dann gilt <Formel tex="f(-x)=f(x)" nach="." /> Das Schaubild ist symmetrisch zur y-Achse, nicht zum Ursprung.</>,
    ),
    opt(
      'c',
      <><Formel tex={t`f(x)=x^3+x^2`} /></>,
      false,
      <>Die Hochzahlen 3 und 2 sind gemischt. Es ist zum Beispiel <Formel tex="f(1)=2" /> und <Formel tex="f(-1)=0" nach="." /> Das ist weder <Formel tex="f(1)" /> noch <Formel tex="-f(1)" nach="." /> Keine Symmetrie.</>,
    ),
    opt(
      'd',
      <><Formel tex={t`f(x)=x^3+2`} /></>,
      false,
      <><Formel tex="x^3" /> hat nur eine ungerade Hochzahl, aber die Zahl 2 hat die gerade Hochzahl 0. Es ist <Formel tex="f(1)=3" /> und <Formel tex="f(-1)=1" nach="," /> das ist weder 3 noch <Formel tex="-3" nach="." /> Keine Symmetrie zum Ursprung.</>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="3"
      titel="Symmetrie zum Ursprung erkennen"
      optionen={platziere(optionen, 3)}
      erklaerung={
        <>
          <p>
            <Formel tex={t`f(-x)=(-x)^5-3(-x)^3+(-x)=-x^5+3x^3-x=-f(x)`} nach="." /> Alle Hochzahlen (5, 3 und 1) sind ungerade, und es gibt keine Zahl ohne <Formel tex="x" nach="." /> Deshalb ist das Schaubild symmetrisch zum Ursprung.
          </p>
          <Bild daten={BILD_F3} unter={<>Das Schaubild von <Formel tex={t`f(x)=x^5-3x^3+x`} nach="." /> <Formel tex="P" /> und <Formel tex="Q" /> liegen auf einer Geraden durch den Ursprung.</>} />
        </>
      }
    >
      <p>Welche der Funktionen hat ein Schaubild, das symmetrisch zum Ursprung ist?</p>
    </Auswahlfrage>
  );
}

/** Aufgabe 4: Nullstellen mit Substitution. */
function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Verhalten, Symmetrie und Nullstellen"
      felder={[
        { id: 'n', name: 'Anzahl der Nullstellen', beschriftung: <>Anzahl der Nullstellen</>, erwartet: G1.nullen.length },
        { id: 'x1', name: 'kleinste positive Nullstelle', beschriftung: <>kleinste positive Nullstelle</>, erwartet: 1 },
        { id: 'x2', name: 'größte Nullstelle', beschriftung: <>größte Nullstelle</>, erwartet: 2 },
        { id: 'sy', name: 'y-Achsenabschnitt', beschriftung: <><Formel tex="y" />-Achsenabschnitt</>, erwartet: G1.yAchse },
      ]}
      hilfen={[
        <>Im Term kommen nur gerade Hochzahlen vor (4, 2 und 0). Substituiere <Formel tex="u=x^2" nach="." /></>,
        <>Löse <Formel tex={t`u^2-5u+4=0`} nach="." /> Du kannst die Lösungsformel verwenden oder in Faktoren zerlegen.</>,
        <>Aus jedem positiven <Formel tex="u" /> bekommst du zwei Lösungen für <Formel tex="x" nach="," /> nämlich <Formel tex="x=\sqrt{u}" /> und <Formel tex="x=-\sqrt{u}" nach="." /> Der y-Achsenabschnitt ist <Formel tex="f(0)" nach="." /></>,
      ]}
      loesung={[
        <>Globales Verhalten: Der Grad 4 ist gerade, der Leitkoeffizient 1 positiv. Also gilt <Formel tex={String.raw`f(x)\to\infty`} /> für <Formel tex={String.raw`x\to\infty`} /> und für <Formel tex={String.raw`x\to-\infty`} nach="." /> Symmetrie: <Formel tex={t`f(-x)=(-x)^4-5(-x)^2+4=x^4-5x^2+4=f(x)`} nach="." /> Das Schaubild ist symmetrisch zur y-Achse.</>,
        <>Nullstellen: <Formel tex={t`x^4-5x^2+4=0`} /> wird mit <Formel tex="u=x^2" /> zu <Formel tex={t`u^2-5u+4=0`} nach="." /> Es ist <Formel tex={t`u^2-5u+4=(u-1)(u-4)`} nach="," /> also <Formel tex="u=1" /> oder <Formel tex="u=4" nach="." /></>,
        <>Rücksubstitution: <Formel tex="x^2=1" /> liefert <Formel tex="x=\pm 1" nach="," /> <Formel tex="x^2=4" /> liefert <Formel tex="x=\pm 2" nach="." /> Es gibt vier Nullstellen <Formel tex={t`N_1(-2\,|\,0)`} nach="," /> <Formel tex={t`N_2(-1\,|\,0)`} nach="," /> <Formel tex={t`N_3(1\,|\,0)`} /> und <Formel tex={t`N_4(2\,|\,0)`} nach="." /></>,
        <>
          y-Achsenabschnitt: <Formel tex="f(0)=4" nach="," /> also <Formel tex={t`S_y(0\,|\,4)`} nach="." />
          <Bild daten={BILD_A4} unter={<>Das Schaubild von <Formel tex={t`f(x)=x^4-5x^2+4`} /> mit den vier Nullstellen <Formel tex="N" /> und dem Schnittpunkt <Formel tex="S_y" /> mit der y-Achse.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=x^4-5x^2+4`} nach="." /> Bestimme das globale Verhalten und die Symmetrie. Berechne dann die Nullstellen und den y-Achsenabschnitt. Gib die Anzahl der Nullstellen, die kleinste positive und die größte Nullstelle und den y-Achsenabschnitt an.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A4} unter={<>Das Schaubild {KF} mit den Nullstellen <Formel tex="N" /> und dem y-Achsenabschnitt <Formel tex="S_y" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 5: Extrem- und Wendepunkte derselben Funktion. */
function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Extrem- und Wendepunkte"
      felder={[
        { id: 'hy', name: 'y-Koordinate des Hochpunkts', beschriftung: <>Hochpunkt: <Formel tex="y" /></>, erwartet: G1.hochY },
        { id: 'tx', name: 'positive x-Koordinate der Tiefpunkte auf zwei Nachkommastellen', beschriftung: <>Tiefpunkte: <Formel tex="x" /> (positiv)</>, erwartet: G1.tiefX, toleranz: 0.005 },
        { id: 'ty', name: 'y-Koordinate der Tiefpunkte', beschriftung: <>Tiefpunkte: <Formel tex="y" /></>, erwartet: G1.tiefY },
        { id: 'wx', name: 'positive x-Koordinate der Wendepunkte auf zwei Nachkommastellen', beschriftung: <>Wendepunkte: <Formel tex="x" /> (positiv)</>, erwartet: G1.wendeX, toleranz: 0.005 },
        { id: 'wy', name: 'y-Koordinate der Wendepunkte auf zwei Nachkommastellen', beschriftung: <>Wendepunkte: <Formel tex="y" /></>, erwartet: G1.wendeY, toleranz: 0.005 },
      ]}
      hilfen={[
        <>Bilde <Formel tex="f'" nach="," /> <Formel tex="f''" /> und <Formel tex="f'''" nach="." /> Klammere in <Formel tex="f'" /> den Faktor <Formel tex="x" /> aus.</>,
        <>Für die Extremstellen löst du <Formel tex="f'(x)=0" nach="." /> Die Klammer führt auf <Formel tex="x^2=\frac{5}{2}" nach="." /> Weise jeden Kandidaten mit <Formel tex="f''" /> nach.</>,
        <>Für die Wendestellen löst du <Formel tex="f''(x)=0" /> und weist sie mit <Formel tex="f'''" /> nach. Die y-Koordinaten berechnest du mit <Formel tex="f" nach="." /> Runde erst am Ende.</>,
      ]}
      loesung={[
        <>Ableitungen: <Formel tex={t`f'(x)=4x^3-10x=2x(2x^2-5)`} nach="," /> <Formel tex={t`f''(x)=12x^2-10`} /> und <Formel tex={t`f'''(x)=24x`} nach="." /></>,
        <>Extrempunkte: <Formel tex="f'(x)=0" /> liefert <Formel tex="x=0" /> oder <Formel tex={t`x^2=\frac{5}{2}`} nach="." /> Es ist <Formel tex="f''(0)=-10<0" nach="," /> also ein Hochpunkt <Formel tex={t`H(0\,|\,4)`} nach="." /> Es ist <Formel tex={t`f''\!\left(\pm\sqrt{\frac{5}{2}}\right)=30-10=20>0`} nach="," /> also Tiefpunkte. Mit <Formel tex={t`f\!\left(\pm\sqrt{\frac{5}{2}}\right)=\frac{25}{4}-\frac{25}{2}+4=-\frac{9}{4}`} /> ist <Formel tex={t`T_{1,2}\!\left(\pm\sqrt{\frac{5}{2}}\,\middle|\,-\frac{9}{4}\right)`} nach="." /></>,
        <>Wendepunkte: <Formel tex="f''(x)=0" /> liefert <Formel tex={t`x^2=\frac{5}{6}`} nach="," /> also <Formel tex={t`x=\pm\sqrt{\frac{5}{6}}\approx\pm 0{,}91`} nach="." /> Es ist <Formel tex={t`f'''(x)=24x\ne 0`} /> dort, <Formel tex="f''" /> wechselt also das Vorzeichen. Mit <Formel tex={t`f\!\left(\pm\sqrt{\frac{5}{6}}\right)=\frac{25}{36}-\frac{25}{6}+4=\frac{19}{36}\approx 0{,}53`} /> ist <Formel tex={t`W_{1,2}\!\left(\pm\sqrt{\frac{5}{6}}\,\middle|\,\frac{19}{36}\right)`} nach="." /></>,
        <>
          Monotonie und Krümmung: <Formel tex="f'" /> ist negativ für <Formel tex={t`x<-\sqrt{\frac{5}{2}}`} nach="," /> positiv bis <Formel tex="0" nach="," /> negativ bis <Formel tex={t`\sqrt{\frac{5}{2}}`} /> und danach positiv. {KF} fällt also auf <Formel tex={t`]-\infty;\,-\sqrt{\tfrac{5}{2}}[`} /> und auf <Formel tex={t`]0;\,\sqrt{\tfrac{5}{2}}[`} nach="," /> es steigt auf den übrigen Bereichen. Wegen <Formel tex={t`f''(x)=12x^2-10`} /> ist {KF} auf <Formel tex={t`]-\infty;\,-\sqrt{\tfrac{5}{6}}[`} /> und auf <Formel tex={t`]\sqrt{\tfrac{5}{6}};\,\infty[`} /> linksgekrümmt und dazwischen rechtsgekrümmt.
          <Bild daten={BILD_A5} unter={<>Das Schaubild mit Hochpunkt <Formel tex="H" nach="," /> zwei Tiefpunkten <Formel tex="T" /> und zwei Wendepunkten <Formel tex="W" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Untersuche dieselbe Funktion <Formel tex={t`f(x)=x^4-5x^2+4`} /> weiter. Bestimme die Extrem- und Wendepunkte und weise sie nach. Gib die y-Koordinate des Hochpunkts, die positive x-Koordinate und die y-Koordinate der Tiefpunkte und der Wendepunkte an, die Werte mit Wurzeln auf zwei Nachkommastellen gerundet.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A5} unter={<>Das Schaubild {KF} mit Hochpunkt <Formel tex="H" nach="," /> Tiefpunkten <Formel tex="T" /> und Wendepunkten <Formel tex="W" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 6: Produkt aus x und e^(-x) mit Wendetangente. */
function Aufgabe6() {
  return (
    <Aufgabe
      nummer="6"
      titel="Exponentialfunktion mit Wendetangente"
      felder={[
        { id: 'asy', name: 'Gleichung der waagerechten Asymptote, Wert von y', beschriftung: <>Asymptote nach rechts: <Formel tex="y" /></>, erwartet: G2.asymptote },
        { id: 'hx', name: 'x-Koordinate des Hochpunkts', beschriftung: <>Hochpunkt: <Formel tex="x" /></>, erwartet: G2.hochX },
        { id: 'hy', name: 'y-Koordinate des Hochpunkts auf zwei Nachkommastellen', beschriftung: <>Hochpunkt: <Formel tex="y" /></>, erwartet: G2.hochY, toleranz: 0.005 },
        { id: 'wx', name: 'x-Koordinate des Wendepunkts', beschriftung: <>Wendepunkt: <Formel tex="x" /></>, erwartet: G2.wendeX },
        { id: 'wy', name: 'y-Koordinate des Wendepunkts auf zwei Nachkommastellen', beschriftung: <>Wendepunkt: <Formel tex="y" /></>, erwartet: G2.wendeY, toleranz: 0.005 },
        { id: 'm', name: 'Steigung der Wendetangente auf zwei Nachkommastellen', beschriftung: <>Steigung der Wendetangente</>, erwartet: G2.steigungWende, toleranz: 0.005 },
        { id: 'nt', name: 'Schnittstelle der Wendetangente mit der x-Achse', beschriftung: <>Wendetangente schneidet die x-Achse bei <Formel tex="x" /></>, erwartet: G2.tangenteNull },
      ]}
      hilfen={[
        <>Die Ableitungen bildest du mit der Produktregel und der Kettenregel, wie im Modul <Modulverweis modul="produkt-kettenregel">Produkt- und Kettenregel</Modulverweis>. Klammere <Formel tex="e^{-x}" /> aus.</>,
        <>Für <Formel tex={String.raw`x\to\infty`} /> wird <Formel tex="e^{-x}" /> viel schneller klein, als <Formel tex="x" /> wächst. Der Faktor <Formel tex="e^{-x}" /> ist nie null, bei Nullstellen von <Formel tex="f'" /> und <Formel tex="f''" /> zählt nur der andere Faktor.</>,
        <>Die Wendetangente ist die Tangente im Wendepunkt <Formel tex="W" nach=":" /> <Formel tex={t`t(x)=f'(x_W)\cdot(x-x_W)+f(x_W)`} nach="." /> Ihre Nullstelle findest du mit <Formel tex="t(x)=0" nach="." /></>,
      ]}
      loesung={[
        <>Ableitungen: <Formel tex={t`f'(x)=e^{-x}-x\,e^{-x}=(1-x)e^{-x}`} nach="," /> <Formel tex={t`f''(x)=(x-2)e^{-x}`} /> und <Formel tex={t`f'''(x)=(3-x)e^{-x}`} nach="." /></>,
        <>Globales Verhalten: Für <Formel tex={String.raw`x\to\infty`} /> geht <Formel tex={String.raw`f(x)\to 0`} nach="," /> die Gerade <Formel tex="y=0" /> ist waagerechte Asymptote. Für <Formel tex={String.raw`x\to-\infty`} /> geht <Formel tex={String.raw`f(x)\to-\infty`} nach="." /> Nullstelle: <Formel tex={t`x\,e^{-x}=0`} /> hat nur die Lösung <Formel tex="x=0" nach="," /> denn <Formel tex="e^{-x}" /> ist nie null.</>,
        <>Extrempunkt: <Formel tex="f'(x)=0" /> liefert <Formel tex="x=1" nach="." /> Wegen <Formel tex={t`f''(1)=-e^{-1}<0`} /> ist es ein Hochpunkt, <Formel tex={t`H\!\left(1\,\middle|\,\frac{1}{e}\right)`} /> mit <Formel tex={t`\frac{1}{e}\approx 0{,}37`} nach="." /></>,
        <>Wendepunkt: <Formel tex="f''(x)=0" /> liefert <Formel tex="x=2" nach="." /> Wegen <Formel tex={t`f'''(2)=e^{-2}\ne 0`} /> ist es ein Wendepunkt, <Formel tex={t`W\!\left(2\,\middle|\,\frac{2}{e^2}\right)`} /> mit <Formel tex={t`\frac{2}{e^2}\approx 0{,}27`} nach="." /></>,
        <>
          Wendetangente: Die Steigung ist <Formel tex={t`f'(2)=-e^{-2}\approx -0{,}14`} nach="." /> Damit ist <Formel tex={t`t(x)=-e^{-2}(x-2)+2e^{-2}=e^{-2}(4-x)`} nach="." /> Sie wird null bei <Formel tex="x=4" nach="." />
          <Bild daten={BILD_A6} unter={<>Das Schaubild von <Formel tex={t`f(x)=x\,e^{-x}`} /> mit Nullstelle <Formel tex="N" nach="," /> Hochpunkt <Formel tex="H" nach="," /> Wendepunkt <Formel tex="W" /> und der Wendetangente (blau gestrichelt), die die x-Achse bei <Formel tex="x=4" /> schneidet.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=x\,e^{-x}`} nach="." /> Untersuche das globale Verhalten, die Nullstellen, die Extrempunkte, den Wendepunkt und die Wendetangente. Gib die Asymptote nach rechts, den Hochpunkt, den Wendepunkt, die Steigung der Wendetangente und die Stelle an, an der die Wendetangente die x-Achse schneidet. Runde Werte mit <Formel tex="e" /> auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A6} unter={<>Das Schaubild {KF} mit <Formel tex="N" nach="," /> <Formel tex="H" nach="," /> <Formel tex="W" /> und der Wendetangente.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 7: schiefe Asymptote, Tiefpunkt über der x-Achse, keine Nullstelle. */
function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Schiefe Asymptote und keine Nullstelle"
      felder={[
        { id: 'm', name: 'Steigung der schiefen Asymptote', beschriftung: <>Asymptote <Formel tex="y=mx+n" nach=":" /> <Formel tex="m" /></>, erwartet: G3.asyM },
        { id: 'n', name: 'y-Achsenabschnitt der schiefen Asymptote', beschriftung: <>Asymptote: <Formel tex="n" /></>, erwartet: G3.asyN },
        { id: 'tx', name: 'x-Koordinate des Tiefpunkts auf zwei Nachkommastellen', beschriftung: <>Tiefpunkt: <Formel tex="x" /></>, erwartet: G3.tiefX, toleranz: 0.005 },
        { id: 'ty', name: 'y-Koordinate des Tiefpunkts auf zwei Nachkommastellen', beschriftung: <>Tiefpunkt: <Formel tex="y" /></>, erwartet: G3.tiefY, toleranz: 0.005 },
        { id: 'nn', name: 'Anzahl der Nullstellen', beschriftung: <>Anzahl der Nullstellen</>, erwartet: G3.nullstellen },
        { id: 'nw', name: 'Anzahl der Wendepunkte', beschriftung: <>Anzahl der Wendepunkte</>, erwartet: G3.wendepunkte },
      ]}
      hilfen={[
        <>Für <Formel tex={String.raw`x\to\infty`} /> geht <Formel tex="3e^{-x}" /> gegen 0. Was bleibt vom Funktionsterm übrig?</>,
        <>Löse <Formel tex="f'(x)=0" /> mit <Formel tex="e^{-x}=\frac{1}{3}" nach="." /> Die Lösung der Gleichung <Formel tex="e^{-x}=c" /> findest du mit dem Logarithmus. Weise den Tiefpunkt mit <Formel tex="f''" /> nach.</>,
        <>Vergleiche den Tiefpunkt mit der x-Achse. Liegt er oberhalb, und hat <Formel tex="f'" /> nur diese eine Nullstelle, kann {KF} die x-Achse nicht erreichen. Für die Wendepunkte prüfst du, ob <Formel tex="f''" /> eine Nullstelle hat.</>,
      ]}
      loesung={[
        <>Ableitungen: <Formel tex={t`f'(x)=1-3e^{-x}`} nach="," /> <Formel tex={t`f''(x)=3e^{-x}`} /> und <Formel tex={t`f'''(x)=-3e^{-x}`} nach="." /></>,
        <>Globales Verhalten: Für <Formel tex={String.raw`x\to\infty`} /> verschwindet <Formel tex="3e^{-x}" nach="," /> es bleibt <Formel tex="x-2" nach="." /> Die Gerade <Formel tex="y=x-2" /> ist schiefe Asymptote. Für <Formel tex={String.raw`x\to-\infty`} /> gewinnt <Formel tex="3e^{-x}" /> gegen <Formel tex="x-2" nach="," /> also <Formel tex={String.raw`f(x)\to\infty`} nach="." /></>,
        <>Tiefpunkt: <Formel tex="f'(x)=0" /> liefert <Formel tex={t`e^{-x}=\frac{1}{3}`} nach="," /> also <Formel tex={t`x=\ln 3\approx 1{,}10`} nach="." /> Wegen <Formel tex={t`f''(\ln 3)=1>0`} /> ist es ein Tiefpunkt. Mit <Formel tex={t`f(\ln 3)=3\cdot\frac{1}{3}+\ln 3-2=\ln 3-1\approx 0{,}10`} /> ist <Formel tex={t`T(\ln 3\,|\,\ln 3-1)`} nach="." /></>,
        <>Nullstellen: <Formel tex="f'" /> ist links von <Formel tex="\ln 3" /> negativ und rechts davon positiv. Der Tiefpunkt ist also der tiefste Punkt von {KF} und liegt mit <Formel tex="y\approx 0{,}10" /> oberhalb der x-Achse. Deshalb gilt <Formel tex="f(x)>0" /> für alle <Formel tex="x" nach="," /> es gibt keine Nullstelle. Wendepunkte: <Formel tex="f''(x)=3e^{-x}" /> ist nie null, es gibt keine.</>,
        <>
          Das Schaubild verläuft immer oberhalb der x-Achse und nähert sich rechts der Geraden <Formel tex="y=x-2" nach="." />
          <Bild daten={BILD_A7} unter={<>Das Schaubild von <Formel tex={t`f(x)=3e^{-x}+x-2`} /> mit dem Tiefpunkt <Formel tex="T" /> und der schiefen Asymptote (blau gestrichelt).</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=3e^{-x}+x-2`} nach="." /> Untersuche das globale Verhalten, bestimme den Tiefpunkt und begründe, dass {KF} keine Nullstelle hat. Gib die Gleichung der schiefen Asymptote nach rechts, den Tiefpunkt und die Anzahl der Nullstellen und Wendepunkte an. Runde auf zwei Nachkommastellen.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A7} unter={<>Das Schaubild {KF} mit dem Tiefpunkt <Formel tex="T" /> und der schiefen Asymptote.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 8: Kosinus mit Verschiebung auf einem Intervall. */
function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Trigonometrische Funktion auf einem Intervall"
      felder={[
        { id: 'n', name: 'Anzahl der Nullstellen im Intervall', beschriftung: <>Anzahl der Nullstellen</>, erwartet: G4.nullen.length },
        { id: 'x1', name: 'kleinste positive Nullstelle auf zwei Nachkommastellen', beschriftung: <>kleinste positive Nullstelle</>, erwartet: G4.nullen[2]!, toleranz: 0.005 },
        { id: 'tp', name: 'y-Koordinate der Tiefpunkte', beschriftung: <>Tiefpunkte: <Formel tex="y" /></>, erwartet: G4.tiefY },
        { id: 'nw', name: 'Anzahl der Wendestellen im Intervall', beschriftung: <>Anzahl der Wendestellen</>, erwartet: G4.wenden.length },
        { id: 'xw', name: 'kleinste positive Wendestelle auf zwei Nachkommastellen', beschriftung: <>kleinste positive Wendestelle</>, erwartet: G4.wenden[2]!, toleranz: 0.005 },
      ]}
      hilfen={[
        <>Das Schaubild ist eine Kosinuskurve, in y-Richtung mit 2 gestreckt und um 1 nach oben verschoben. Das kennst du aus dem Modul <Modulverweis modul="lage-im-koordinatensystem">Lage im Koordinatensystem</Modulverweis>: Hochpunkt bei <Formel tex={t`(0\,|\,d+|a|)`} nach="." /></>,
        <>Für die Nullstellen löst du <Formel tex={t`\cos x=-\frac{1}{2}`} nach="." /> Eine Lösung im ersten Umlauf ist <Formel tex={t`\frac{2\pi}{3}`} nach="." /> Die weiteren folgen aus der Symmetrie des Kosinus und der Periode <Formel tex="2\pi" nach="." /></>,
        <>Extremstellen liefert <Formel tex="f'(x)=-2\sin x=0" nach="," /> Wendestellen <Formel tex="f''(x)=-2\cos x=0" nach="." /> Zähle die Lösungen im Intervall <Formel tex={t`[-2\pi;\,2\pi]`} nach="." /></>,
      ]}
      loesung={[
        <>Ableitungen: <Formel tex={t`f'(x)=-2\sin x`} nach="," /> <Formel tex={t`f''(x)=-2\cos x`} /> und <Formel tex={t`f'''(x)=2\sin x`} nach="." /> Die Funktion ist periodisch mit der Periode <Formel tex="2\pi" /> und symmetrisch zur y-Achse, denn <Formel tex="\cos(-x)=\cos x" nach="." /></>,
        <>Nullstellen: <Formel tex={t`1+2\cos x=0`} /> bedeutet <Formel tex={t`\cos x=-\frac{1}{2}`} nach="." /> Die Lösungen sind <Formel tex={t`x=\pm\frac{2\pi}{3}`} /> und <Formel tex={t`x=\pm\frac{4\pi}{3}`} nach="." /> Mit <Formel tex="x=\pm\frac{8\pi}{3}" /> läge schon außerhalb des Intervalls. Es sind vier Nullstellen, <Formel tex={t`\frac{2\pi}{3}\approx 2{,}09`} nach="." /></>,
        <>Extrempunkte: <Formel tex="f'(x)=0" /> bei <Formel tex="x=k\pi" nach="." /> Bei <Formel tex="x=\pm\pi" /> ist <Formel tex="f''=2>0" nach="," /> also Tiefpunkte <Formel tex={t`T(\pm\pi\,|\,-1)`} nach="." /> Bei <Formel tex="x=0" /> ist <Formel tex="f''=-2<0" nach="," /> also der Hochpunkt <Formel tex={t`H(0\,|\,3)`} nach="." /> An den Rändern <Formel tex="x=\pm 2\pi" /> hat <Formel tex="f" /> ebenfalls den Wert 3, das sind Randpunkte des Intervalls.</>,
        <>
          Wendepunkte: <Formel tex="f''(x)=0" /> liefert <Formel tex={t`x=\frac{\pi}{2}+k\pi`} nach="." /> Im Intervall sind das <Formel tex={t`x=\pm\frac{\pi}{2}`} /> und <Formel tex={t`x=\pm\frac{3\pi}{2}`} nach="," /> also vier Wendestellen. Dort wechselt <Formel tex="f''" /> das Vorzeichen, und es ist <Formel tex={t`f'''=\pm 2\ne 0`} nach="." /> Die Wendepunkte haben die Höhe <Formel tex="1" nach="," /> die kleinste positive Wendestelle ist <Formel tex={t`\frac{\pi}{2}\approx 1{,}57`} nach="."  />
          <Bild daten={BILD_A8} unter={<>Das Schaubild auf <Formel tex={t`[-2\pi;\,2\pi]`} /> mit vier Nullstellen <Formel tex="N" nach="," /> zwei Tiefpunkten <Formel tex="T" nach="," /> vier Wendepunkten <Formel tex="W" nach="," /> dem Hochpunkt <Formel tex="H" /> und den Randpunkten <Formel tex="R" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=1+2\cos x`} /> mit <Formel tex={t`x\in[-2\pi;\,2\pi]`} nach="." /> Untersuche das Schaubild auf Symmetrie, Nullstellen, Extrempunkte und Wendepunkte. Gib an: die Anzahl der Nullstellen im Intervall, die kleinste positive Nullstelle, die y-Koordinate der Tiefpunkte, die Anzahl der Wendestellen und die kleinste positive Wendestelle. Vielfache von <Formel tex="\pi" /> kannst du als Dezimalzahl auf zwei Nachkommastellen angeben.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_A8} unter={<>Das Schaubild {KF} auf <Formel tex={t`[-2\pi;\,2\pi]`} /> mit allen besonderen Punkten.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Frage 9: Begründen, dass 2x + cos x keine Extrempunkte hat. */
function Frage9() {
  const optionen = [
    opt(
      'richtig',
      <><Formel tex={t`f'(x)=2-\sin x`} /> ist wegen <Formel tex={t`\sin x\le 1`} /> immer mindestens 1. Also hat <Formel tex="f'" /> keine Nullstelle und {KF} keine Extrempunkte.</>,
      true,
      <>Richtig.</>,
    ),
    opt(
      'periodisch',
      <><Formel tex="\cos x" /> ist periodisch, deshalb hat {KF} unendlich viele Extrempunkte.</>,
      false,
      <>Ein periodischer Summand macht die Funktion nicht periodisch. Ob es Extrempunkte gibt, entscheidet <Formel tex="f'" nach="." /> Hier ist <Formel tex="f'(x)=2-\sin x" /> nie null, es gibt keine Extrempunkte. Bei <Formel tex={t`x+2\sin x`} /> aus dem Labor dagegen wechselt <Formel tex="f'" /> das Vorzeichen.</>,
    ),
    opt(
      'vorzeichen',
      <><Formel tex={t`f'(x)=2+\sin x`} /> ist immer mindestens 1. Also hat <Formel tex="f'" /> keine Nullstelle und {KF} keine Extrempunkte.</>,
      false,
      <>Die Ableitung von <Formel tex="\cos x" /> ist <Formel tex="-\sin x" nach="," /> nicht <Formel tex="+\sin x" nach="." /> Richtig ist <Formel tex="f'(x)=2-\sin x" nach="." /> Die Folgerung bliebe hier zwar gleich, die Rechnung ist aber falsch und bei anderen Funktionen führt der Fehler zu falschen Ergebnissen.</>,
    ),
    opt(
      'unendlich',
      <>Für <Formel tex={String.raw`x\to\infty`} /> gilt <Formel tex={String.raw`f(x)\to\infty`} /> und für <Formel tex={String.raw`x\to-\infty`} /> gilt <Formel tex={String.raw`f(x)\to-\infty`} nach="." /> Also hat {KF} keine Extrempunkte.</>,
      false,
      <>Das Verhalten im Unendlichen sagt nichts über Extrempunkte. Die Funktion <Formel tex={t`x+2\sin x`} /> hat dasselbe Verhalten und trotzdem unendlich viele Extrempunkte. Entscheidend ist, ob <Formel tex="f'" /> Nullstellen hat.</>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="9"
      titel="Begründen: keine Extrempunkte"
      optionen={platziere(optionen, 0)}
      erklaerung={
        <>
          <p>
            Wegen <Formel tex={t`\sin x\le 1`} /> gilt <Formel tex={t`f'(x)=2-\sin x\ge 1>0`} nach="." /> <Formel tex="f'" /> hat keine Nullstelle, also gibt es keine Extrempunkte. Außerdem ist {KF} auf ganz <Formel tex="\mathbb{R}" /> streng monoton steigend. Wendepunkte gibt es trotzdem: <Formel tex="f''(x)=-\cos x" /> hat bei <Formel tex={t`x=\frac{\pi}{2}+k\pi`} /> Nullstellen mit Vorzeichenwechsel.
          </p>
          <Paarbild daten={PAAR_G5} unter={<>Oben {KF} von <Formel tex={t`f(x)=2x+\cos x`} nach="," /> darunter <Formel tex="K_{f'}" nach="." /> Das Schaubild von <Formel tex="f'" /> bleibt oberhalb der x-Achse, auf der x-Achse ist alles blau (<Formel tex="f" /> steigt).</>} />
        </>
      }
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=2x+\cos x`} nach="." /> Welche Begründung zeigt vollständig und richtig, dass {KF} keine Extrempunkte hat?
      </p>
    </Auswahlfrage>
  );
}

/** Aufgabe 10: Schar mit a = 3. */
function Aufgabe10() {
  const A = SCHAR_AUFGABE;
  return (
    <Aufgabe
      nummer="10"
      titel="Die Schar für a = 3"
      felder={[
        { id: 'n', name: 'positive Nullstelle auf zwei Nachkommastellen', beschriftung: <>positive Nullstelle</>, erwartet: A.nullX, toleranz: 0.005 },
        { id: 'tx', name: 'positive x-Koordinate der Tiefpunkte auf zwei Nachkommastellen', beschriftung: <>Tiefpunkte: <Formel tex="x" /> (positiv)</>, erwartet: A.tiefX, toleranz: 0.005 },
        { id: 'ty', name: 'y-Koordinate der Tiefpunkte', beschriftung: <>Tiefpunkte: <Formel tex="y" /></>, erwartet: A.tiefY },
        { id: 'wx', name: 'positive x-Koordinate der Wendepunkte', beschriftung: <>Wendepunkte: <Formel tex="x" /> (positiv)</>, erwartet: A.wendeX },
        { id: 'wy', name: 'y-Koordinate der Wendepunkte', beschriftung: <>Wendepunkte: <Formel tex="y" /></>, erwartet: A.wendeY },
      ]}
      hilfen={[
        <>Setze <Formel tex="a=3" /> ein: <Formel tex={t`f_3(x)=x^4-6x^2`} nach="." /> Klammere <Formel tex="x^2" /> aus.</>,
        <>Die Ableitungen sind <Formel tex={t`f_3'(x)=4x^3-12x=4x(x^2-3)`} /> und <Formel tex={t`f_3''(x)=12x^2-12`} nach="." /> Löse <Formel tex="f_3'(x)=0" /> und <Formel tex="f_3''(x)=0" nach="." /></>,
        <>Die y-Koordinaten berechnest du mit <Formel tex="f_3" nach="." /> Bei <Formel tex="x=1" /> ist <Formel tex={t`f_3(1)=1-6`} nach="." /></>,
      ]}
      loesung={[
        <>Nullstellen: <Formel tex={t`x^2(x^2-6)=0`} /> liefert <Formel tex="x=0" /> und <Formel tex={t`x=\pm\sqrt{6}\approx\pm 2{,}45`} nach="." /></>,
        <>Extrempunkte: <Formel tex={t`f_3'(x)=4x(x^2-3)=0`} /> liefert <Formel tex="x=0" /> und <Formel tex={t`x=\pm\sqrt{3}\approx\pm 1{,}73`} nach="." /> Es ist <Formel tex="f_3''(0)=-12<0" nach="," /> also <Formel tex={t`H(0\,|\,0)`} nach="." /> Es ist <Formel tex="f_3''(\pm\sqrt{3})=24>0" nach="," /> also Tiefpunkte. Mit <Formel tex={t`f_3(\sqrt{3})=9-18=-9`} /> ist <Formel tex={t`T_{1,2}(\pm\sqrt{3}\,|\,-9)`} nach="." /></>,
        <>Wendepunkte: <Formel tex="f_3''(x)=0" /> liefert <Formel tex="x^2=1" nach="," /> also <Formel tex="x=\pm 1" nach="." /> Es ist <Formel tex={t`f_3'''(\pm 1)=\pm 24\ne 0`} nach="." /> Mit <Formel tex={t`f_3(\pm 1)=1-6=-5`} /> ist <Formel tex={t`W_{1,2}(\pm 1\,|\,-5)`} nach="." /></>,
        <>
          Die allgemeine Formel aus dem Entdecken liefert dasselbe: Tiefpunkte <Formel tex={t`(\pm\sqrt{a}\,|\,-a^2)=(\pm\sqrt{3}\,|\,-9)`} /> und Wendepunkte <Formel tex={t`\left(\pm\sqrt{\tfrac{a}{3}}\,\middle|\,-\tfrac{5}{9}a^2\right)=(\pm 1\,|\,-5)`} nach="."  />
          <Bild daten={scharBild(3)} unter={<>Das Schaubild für <Formel tex="a=3" /> mit den Nullstellen <Formel tex="N" nach="," /> dem Hochpunkt <Formel tex="H" nach="," /> den Tiefpunkten <Formel tex="T" /> und den Wendepunkten <Formel tex="W" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist die Schar <Formel tex={t`f_a(x)=x^4-2ax^2`} /> aus dem Abschnitt Entdecken. Untersuche <Formel tex="K_{f_3}" /> für <Formel tex="a=3" nach="." /> Gib die positive Nullstelle, die positive x-Koordinate und die y-Koordinate der Tiefpunkte und die Koordinaten der Wendepunkte an, Werte mit Wurzeln auf zwei Nachkommastellen gerundet.
      </p>
      <Kontrollschaubild>
        <Bild daten={scharBild(3)} unter={<>Das Schaubild für <Formel tex="a=3" /> mit allen besonderen Punkten.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Frage 11: Fallunterscheidung bei der Schar. */
function Frage11() {
  const optionen = [
    opt('positiv', <>Nur für <Formel tex="a>0" nach="." /></>, true, <>Richtig.</>),
    opt(
      'nichtnegativ',
      <>Für <Formel tex={t`a\ge 0`} nach="." /></>,
      false,
      <>Für <Formel tex="a=0" /> ist <Formel tex="f_0(x)=x^4" nach="." /> Es ist <Formel tex="f_0''(x)=12x^2" /> bei <Formel tex="x=0" /> null, aber links und rechts positiv. Der Ursprung ist ein Tiefpunkt und kein Wendepunkt. Die Nullstelle von <Formel tex="f''" /> allein genügt nicht.</>,
    ),
    opt(
      'negativ',
      <>Nur für <Formel tex="a<0" nach="." /></>,
      false,
      <>Für <Formel tex="a<0" /> ist <Formel tex={t`f_a''(x)=12x^2-4a`} /> immer positiv, denn <Formel tex="-4a" /> ist positiv. <Formel tex="f''" /> hat keine Nullstelle, {KF} ist überall linksgekrümmt.</>,
    ),
    opt(
      'alle',
      <>Für jedes <Formel tex="a" nach="," /> denn <Formel tex="f_a''" /> ist eine Parabel und hat immer eine Nullstelle.</>,
      false,
      <>Die Parabel <Formel tex={t`f_a''(x)=12x^2-4a`} /> ist nach oben geöffnet, ihr Scheitel liegt bei <Formel tex="-4a" nach="." /> Nur wenn <Formel tex="-4a" /> negativ ist, also für <Formel tex="a>0" nach="," /> schneidet sie die x-Achse.</>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="11"
      titel="Fallunterscheidung bei der Schar"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            <Formel tex="f_a''(x)=12x^2-4a=0" /> hat die Lösungen <Formel tex={t`x=\pm\sqrt{\frac{a}{3}}`} nach="," /> wenn <Formel tex="a>0" /> ist. Dort wechselt <Formel tex="f_a''" /> das Vorzeichen, es sind Wendestellen. Für <Formel tex="a=0" /> gibt es die Nullstelle <Formel tex="x=0" /> ohne Vorzeichenwechsel, für <Formel tex="a<0" /> gar keine Nullstelle.
          </p>
          <div className="bilder-paar">
            <Bild daten={scharBild(-1)} unter={<>Für <Formel tex="a=-1" nach=":" /> nur ein Tiefpunkt, überall linksgekrümmt.</>} />
            <Bild daten={scharBild(0)} unter={<>Für <Formel tex="a=0" nach=":" /> nur ein Tiefpunkt, kein Wendepunkt.</>} />
            <Bild daten={scharBild(1)} unter={<>Für <Formel tex="a=1" nach=":" /> zwei Wendepunkte <Formel tex="W" nach="." /></>} />
          </div>
        </>
      }
    >
      <p>
        Für welche Werte von <Formel tex="a" /> hat das Schaubild der Schar <Formel tex={t`f_a(x)=x^4-2ax^2`} /> Wendepunkte?
      </p>
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Die Aufgaben folgen dem Ablauf der ausführlichen Kurvendiskussion. Hilfen und Lösungsweg kannst du schrittweise aufdecken, bei den Aufgaben gibt es ein Schaubild zur Kontrolle. Die Punkte im Schaubild sind mit N (Nullstelle), <Formel tex="S_y" /> (y-Achsenabschnitt), H (Hochpunkt), T (Tiefpunkt), W (Wendepunkt) und R (Randpunkt) beschriftet.
      </p>
      <Eingabehinweis />

      <h3>Grundlagen: Verhalten und Symmetrie</h3>
      <Frage1 />
      <Frage2 />
      <Frage3 />

      <h3>Ausführliche Kurvendiskussionen</h3>
      <Aufgabe4 />
      <Aufgabe5 />
      <Aufgabe6 />
      <Aufgabe7 />
      <Aufgabe8 />
      <Frage9 />

      <h3>Forschungsaufgabe: eine Funktionenschar</h3>
      <Aufgabe10 />
      <Frage11 />
    </Abschnitt>
  );
}
