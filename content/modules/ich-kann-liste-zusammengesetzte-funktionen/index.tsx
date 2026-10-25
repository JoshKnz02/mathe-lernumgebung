import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { AufKlick } from '@/components/AufKlick';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage, type Option } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Funktionsgraph, type Kurve } from '@/components/Funktionsgraph';
import { Hinweis } from '@/components/Hinweis';
import { IchKannAuswertung, ZustandAnbieter, useIchKann } from '@/components/IchKann';
import { WAHL_TEXT, WAHL_ZEICHEN } from '@/lib/ichkann';
import { ABSCHNITT_TITEL, AUSSAGEN, BLAU, GRUPPEN, K1, K10A, K10B, K2, K3, K4, K5, K6, K7, K9, MODULE, ORANGE, ROSA, SCHWARZ, TOL2, type Gruppe } from './daten';
import { Punkt } from './Punkt';

const t = String.raw;
const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });
const nan = (bedingung: boolean, wert: number) => (bedingung ? wert : NaN);
const d3 = (v: number) => String(Math.round(v * 1000) / 1000).replace('.', '{,}');

/** Setzt die richtige Antwort an die Stelle k (0 = erste), damit sie nicht immer oben steht. Die Reihenfolge der übrigen bleibt. */
function platziere(optionen: Option[], k: number): Option[] {
  const i = optionen.findIndex((o) => o.richtig);
  const rest = optionen.filter((_, j) => j !== i);
  return [...rest.slice(0, k), optionen[i]!, ...rest.slice(k)];
}

const Kontrollschaubild = ({ children }: { children: ReactNode }) => (
  <AufKlick einblenden="Schaubild zur Kontrolle einblenden" ausblenden="Schaubild ausblenden">
    {children}
  </AufKlick>
);

/** Schaubild mit Unterschrift. Die Textalternative beschreibt, was zu sehen ist, und passt zur Rechnung. */
function Abbildung({ kurven, bereich, teilung = 1, yTeilung, beschreibung, unter, klasse = 'brett-3zu2' }: { kurven: Kurve[]; bereich: [number, number, number, number]; teilung?: number; yTeilung?: number; beschreibung: string; unter: ReactNode; klasse?: string }) {
  return (
    <figure className="bild">
      <Funktionsgraph kurven={kurven} bereich={bereich} xTeilung={teilung} yTeilung={yTeilung ?? teilung} xBeschriftung="zahl" className={klasse} beschreibung={beschreibung} />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

const aussagenDerGruppe = (g: Gruppe) => AUSSAGEN.filter((a) => a.gruppe === g);

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>0,87</code>), als Bruch (zum Beispiel <Formel tex="\frac{1}{3}" nach=")" /> oder als Vielfaches von <Formel tex="\pi" /> (zum Beispiel <Formel tex="\frac{\pi}{6}" nach=")" /> ein, ohne Einheit. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert.
    </Hinweis>
  );
}

/* ---------- Abschnitt Anleitung ---------- */

function Anleitung() {
  return (
    <Abschnitt id="anleitung" titel="Anleitung">
      <h3>Wozu diese Liste?</h3>
      <p>
        Die Liste fasst zusammen, was du zu den zusammengesetzten Funktionen können sollst (Bildungsplan 2021, Berufliches Gymnasium, erhöhtes Anforderungsniveau, BPE 11.1 bis 11.3): Verknüpfung durch Summe, Differenz und Produkt, Verkettung und Umkehrfunktion. Du schätzt dich bei jeder Aussage selbst ein und prüfst deine Einschätzung mit einer kurzen Kontrollaufgabe. Am Ende zeigt dir die Auswertung, womit du anfangen solltest und welches Modul dir dabei hilft.
      </p>

      <h3>So gehst du vor</h3>
      <ol className="liste">
        <li>Öffne nacheinander die drei Bereiche in der Leiste oben: Verknüpfung, Verkettung, Umkehrfunktion.</li>
        <li>Lies jede Aussage „Ich kann …“ und wähle deine Einschätzung.</li>
        <li>
          Wenn du das Gefühl hast, dass du es schon kannst, bearbeite die Kontrollaufgabe. Das Ergebnis hilft dir bei der Entscheidung, bei welchen Themen du noch intensiv lernen musst. Hilfen und Lösungsweg kannst du schrittweise aufdecken.
        </li>
        <li>Öffne zum Schluss die Auswertung. Sie ordnet die Aussagen nach Dringlichkeit und verweist auf die passenden Abschnitte der Module.</li>
      </ol>

      <h3>Deine Einschätzung</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Die drei Stufen der Selbsteinschätzung</caption>
        <tbody>
          <tr><th scope="row">{WAHL_ZEICHEN.sicher}</th><td>{WAHL_TEXT.sicher}</td></tr>
          <tr><th scope="row">{WAHL_ZEICHEN.ueben}</th><td>{WAHL_TEXT.ueben}</td></tr>
          <tr><th scope="row">{WAHL_ZEICHEN['noch-nicht']}</th><td>{WAHL_TEXT['noch-nicht']}</td></tr>
        </tbody>
      </table>
      <p>Bleibe ehrlich zu dir selbst. Die Einschätzung ist nur für dich da. Wer sich bei „++“ überschätzt, merkt es an der Kontrollaufgabe. Wer sich bei „−−“ unterschätzt, merkt es auch.</p>

      <Hinweis titel="Nichts wird gespeichert">
        Deine Einschätzungen und die Ergebnisse der Kontrollaufgaben bleiben nur im Browser, solange diese Seite geöffnet ist. Sie werden weder gespeichert noch versendet. Wenn du die Seite neu lädst oder schließt, sind sie weg. Mache vor dem Schließen einen Screenshot der Auswertung, wenn du sie behalten möchtest.
      </Hinweis>

      <h3>Übersicht</h3>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Bereiche, Aussagen und Bildungsplan</caption>
        <thead>
          <tr>
            <th scope="col">Bereich</th>
            <th scope="col">Aussagen</th>
            <th scope="col">Bildungsplan</th>
          </tr>
        </thead>
        <tbody>
          {GRUPPEN.map((g) => {
            const liste = aussagenDerGruppe(g.id);
            const bpe = [...new Set(liste.flatMap((a) => a.bpe))].sort((p, q) => Number(p.slice(3)) - Number(q.slice(3)));
            return (
              <tr key={g.id}>
                <th scope="row">{g.titel}</th>
                <td>Nr. {liste.map((a) => a.nr).join(', ')}</td>
                <td>BPE {bpe.join(', ')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        Die Aussagen 1 bis 10 entsprechen der Ich-Kann-Liste aus dem Unterricht. Aussage 11 ist nach dem Bildungsplan ergänzt, weil dort ausdrücklich steht, dass du die Wurzelfunktion und den natürlichen Logarithmus als Umkehrfunktionen deuten sollst. Sie ist mit einem Abzeichen gekennzeichnet.
      </p>
    </Abschnitt>
  );
}

/* ---------- Abschnitt Verknüpfung ---------- */

function VerknuepfungBereich() {
  const { melde } = useIchKann();
  const m = (id: string, teil = '1') => (r: boolean) => melde(id, teil, r);
  return (
    <Abschnitt id="verknuepfung" titel="Verknüpfung">
      <p>Hier geht es um Summe, Differenz und Produkt von Funktionen und um ihre Eigenschaften.</p>
      <Eingabehinweis />

      <Punkt id="ordinatenaddition">
        <Aufgabe
          nummer="K1"
          titel="Summe und Differenz an einzelnen Stellen"
          beiErgebnis={m('ordinatenaddition')}
          felder={[
            { id: 'a', name: 'Wert der Summe an der Stelle 2', beschriftung: <Formel tex="(f+g)(2)" />, erwartet: K1.summe2 },
            { id: 'b', name: 'Wert der Summe an der Stelle minus 2', beschriftung: <Formel tex="(f+g)(-2)" />, erwartet: K1.summeMinus2 },
            { id: 'c', name: 'Wert der Differenz an der Stelle 2', beschriftung: <Formel tex="(f-g)(2)" />, erwartet: K1.differenz2 },
          ]}
          hilfen={[
            <>Für das Schaubild der Summe addierst du an jeder Stelle die y-Werte von <Formel tex="K_f" /> und <Formel tex="K_g" nach="." /> Bei der Differenz subtrahierst du sie.</>,
            <>Berechne zuerst <Formel tex="f(2)" nach="," /> <Formel tex="g(2)" /> und <Formel tex="f(-2)" nach="," /> <Formel tex="g(-2)" nach="." /></>,
          ]}
          loesung={[
            <>
              <Formel tex="f(2)=2" /> und <Formel tex="g(2)=1" nach="." /> Also <Formel tex="(f+g)(2)=2+1=3" /> und <Formel tex="(f-g)(2)=2-1=1" nach="." />
            </>,
            <>
              <Formel tex="f(-2)=2" /> und <Formel tex="g(-2)=-3" nach="." /> Also <Formel tex="(f+g)(-2)=2+(-3)=-1" nach="." /> Am Schaubild: Die Strecke für <Formel tex="g(-2)" /> zeigt nach unten und verkürzt die Strecke für <Formel tex="f(-2)" nach="." />
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex="f(x)=0{,}5x^2" /> und <Formel tex="g(x)=x-1" nach="." /> Berechne die Funktionswerte der Summe <Formel tex="f+g" /> und der Differenz <Formel tex="f-g" /> an den angegebenen Stellen. Damit kannst du Punkte der beiden Schaubilder zeichnen.
          </p>
        </Aufgabe>
        <Kontrollschaubild>
          <Abbildung
            kurven={[
              { f: K1.f, farbe: ORANGE },
              { f: K1.g, farbe: SCHWARZ, gestrichelt: true },
              { f: (x) => K1.f(x) + K1.g(x), farbe: BLAU },
              { f: (x) => K1.f(x) - K1.g(x), farbe: ROSA },
            ]}
            bereich={[-4, 4, -3, 8]}
            beschreibung="Schaubilder von f(x) = 0,5 x², g(x) = x − 1, der Summe und der Differenz. Bei x gleich 2 hat die Summe den Wert 3 und die Differenz den Wert 1, bei x gleich minus 2 hat die Summe den Wert minus 1."
            unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="K_g" nach="," /> blau: <Formel tex="K_{f+g}" nach="," /> rosa: <Formel tex="K_{f-g}" nach="." /></>}
          />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="zuordnen">
        <Aufgabe
          nummer="K2"
          titel="Schaubilder zuordnen"
          beiErgebnis={m('zuordnen')}
          felder={[
            { id: 'a', name: 'Nummer des Schaubilds der Summe', beschriftung: <>Schaubild von <Formel tex="f+g" /></>, erwartet: K2.nummer.summe },
            { id: 'b', name: 'Nummer des Schaubilds der Differenz', beschriftung: <>Schaubild von <Formel tex="f-g" /></>, erwartet: K2.nummer.differenz },
            { id: 'c', name: 'Nummer des Schaubilds des Produkts', beschriftung: <>Schaubild von <Formel tex={t`f\cdot g`} /></>, erwartet: K2.nummer.produkt },
          ]}
          hilfen={[
            <>Berechne für jede Verknüpfung den y-Achsenabschnitt, also den Wert an der Stelle <Formel tex="x=0" nach="." /> Lies ihn an den drei Schaubildern ab.</>,
            <>Es ist <Formel tex="f(0)=1" /> und <Formel tex="g(0)=2" nach="." /> Für die Summe gilt <Formel tex="1+2" nach="," /> für die Differenz <Formel tex="1-2" nach="," /> für das Produkt <Formel tex={t`1\cdot 2`} nach="." /></>,
          ]}
          loesung={[
            <>
              Bei <Formel tex="x=0" /> ist <Formel tex="f(0)=1" /> und <Formel tex="g(0)=2" nach="." /> Summe: <Formel tex="S_y(0\,|\,3)" nach="." /> Differenz: <Formel tex="S_y(0\,|\,-1)" nach="." /> Produkt: <Formel tex="S_y(0\,|\,2)" nach="." />
            </>,
            <>
              Die Schaubilder schneiden die y-Achse bei 3 (blau, Nummer 2), bei <Formel tex="-1" /> (orange, Nummer 1) und bei 2 (schwarz gestrichelt, Nummer 3). Zur Kontrolle: <Formel tex="f-g=x^2+x-1" /> ist eine nach oben geöffnete Parabel, <Formel tex="f+g=-x^2+x+3" /> eine nach unten geöffnete, <Formel tex={t`f\cdot g`} /> hat den Grad 3.
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex="f(x)=x+1" /> und <Formel tex="g(x)=2-x^2" nach="." /> Die Schaubilder 1, 2 und 3 gehören zu <Formel tex="f+g" nach="," /> <Formel tex="f-g" /> und <Formel tex={t`f\cdot g`} nach="." /> Gib an, welche Nummer zu welcher Verknüpfung gehört, und begründe mit dem y-Achsenabschnitt.
          </p>
          <Abbildung
            kurven={[
              { f: K2.s1, farbe: ORANGE },
              { f: K2.s2, farbe: BLAU },
              { f: K2.s3, farbe: SCHWARZ, gestrichelt: true },
            ]}
            bereich={[-3, 3, -5, 5]}
            beschreibung="Drei Schaubilder. Schaubild 1, orange, ist eine nach oben geöffnete Parabel mit y-Achsenabschnitt minus 1. Schaubild 2, blau, ist eine nach unten geöffnete Parabel mit y-Achsenabschnitt 3. Schaubild 3, schwarz gestrichelt, ist eine Kurve dritten Grades mit y-Achsenabschnitt 2."
            unter={<>Schaubild 1: orange. Schaubild 2: blau. Schaubild 3: schwarz gestrichelt.</>}
          />
        </Aufgabe>
      </Punkt>

      <Punkt id="globales-verhalten">
        <Auswahlfrage
          nummer="K3a"
          titel="Globales Verhalten eines Produkts"
          beiErgebnis={m('globales-verhalten', 'a')}
          optionen={platziere(
            [
              opt('a', <>Für <Formel tex={t`x\to-\infty`} /> geht <Formel tex="h(x)" /> gegen 0 (die x-Achse ist Asymptote), für <Formel tex={t`x\to\infty`} /> geht <Formel tex="h(x)" /> gegen <Formel tex={t`\infty`} nach="." /></>, true, <>Richtig.</>),
              opt('b', <>Für <Formel tex={t`x\to-\infty`} /> geht <Formel tex="h(x)" /> gegen <Formel tex={t`-\infty`} nach="," /> für <Formel tex={t`x\to\infty`} /> gegen <Formel tex={t`\infty`} nach="." /></>, false, <>Der Faktor <Formel tex="x" /> geht links gegen <Formel tex={t`-\infty`} nach="," /> aber <Formel tex="e^x" /> geht dort schneller gegen 0, als <Formel tex="x" /> wächst. Das Produkt geht gegen 0.</>),
              opt('c', <>Für <Formel tex={t`x\to\pm\infty`} /> geht <Formel tex="h(x)" /> gegen <Formel tex={t`\infty`} nach="." /></>, false, <>Rechts stimmt das, links nicht: Für <Formel tex="x<0" /> ist <Formel tex="h(x)" /> negativ, also kann es nicht gegen <Formel tex={t`\infty`} /> gehen.</>),
              opt('d', <>Für <Formel tex={t`x\to\infty`} /> geht <Formel tex="h(x)" /> gegen 0.</>, false, <>Rechts wachsen beide Faktoren, <Formel tex="x" /> und <Formel tex="e^x" nach="." /> Das Produkt wächst über alle Grenzen.</>),
            ],
            1,
          )}
          erklaerung={
            <>
              Links wird <Formel tex="e^x" /> schneller klein, als <Formel tex="|x|" /> groß wird, zum Beispiel <Formel tex="h(-10)\approx -0{,}0005" nach="." /> Rechts wachsen beide Faktoren. Die x-Achse ist waagerechte Asymptote nach links.
              <Abbildung
                kurven={[{ f: K3.h, farbe: BLAU }]}
                bereich={[-8, 3, -1, 6]}
                beschreibung="Schaubild von h(x) = x mal e hoch x. Links nähert es sich der x-Achse von unten, hat bei x gleich minus 1 einen Tiefpunkt bei etwa minus 0,37 und steigt rechts stark an."
                unter={<>Blau: <Formel tex="K_h" nach="." /> Links nähert sich das Schaubild der x-Achse.</>}
              />
            </>
          }
        >
          <p>
            Beschreibe das globale Verhalten von <Formel tex="h(x)=x\cdot e^x" nach="." />
          </p>
        </Auswahlfrage>
        <Aufgabe
          nummer="K3b"
          titel="Schräge Asymptote"
          beiErgebnis={m('globales-verhalten', 'b')}
          felder={[
            { id: 'm', name: 'Steigung m der Asymptote', beschriftung: <Formel tex="m" />, erwartet: K3.m },
            { id: 'n', name: 'y-Achsenabschnitt n der Asymptote', beschriftung: <Formel tex="n" />, erwartet: K3.n },
          ]}
          hilfen={[
            <>Wie verhält sich <Formel tex="e^{-x}" /> für <Formel tex={t`x\to\infty`} nach="?" /></>,
            <>Für große <Formel tex="x" /> ist <Formel tex="e^{-x}" /> fast 0, also ist <Formel tex="g(x)" /> fast gleich <Formel tex="3x-2" nach="." /></>,
          ]}
          loesung={[
            <>
              Für <Formel tex={t`x\to\infty`} /> geht <Formel tex="e^{-x}" /> gegen 0, zum Beispiel <Formel tex="e^{-10}\approx 0{,}00005" nach="." />
            </>,
            <>
              Also nähert sich <Formel tex="K_g" /> der Geraden <Formel tex="y=3x-2" /> (schräge Asymptote nach rechts), <Formel tex="m=3" /> und <Formel tex="n=-2" nach="." />
              <Abbildung
                kurven={[{ f: (x) => 3 * x - 2, farbe: SCHWARZ, gestrichelt: true }, { f: K3.g, farbe: BLAU }]}
                bereich={[-3, 5, -8, 12]}
                teilung={1}
                yTeilung={2}
                beschreibung="Schaubild von g(x) = 3x − 2 + e hoch minus x, blau, und die gestrichelte Gerade y gleich 3x minus 2. Rechts nähert sich das Schaubild der Geraden, links steigt es stark an."
                unter={<>Blau: <Formel tex="K_g" nach="," /> schwarz gestrichelt: <Formel tex="y=3x-2" nach="." /></>}
              />
            </>,
          ]}
        >
          <p>
            Das Schaubild von <Formel tex="g(x)=3x-2+e^{-x}" /> hat für <Formel tex={t`x\to\infty`} /> eine schräge Asymptote <Formel tex="y=mx+n" nach="." /> Gib <Formel tex="m" /> und <Formel tex="n" /> an.
          </p>
        </Aufgabe>
      </Punkt>

      <Punkt id="definitionsbereich">
        <Aufgabe
          nummer="K4"
          titel="Maximaler Definitionsbereich"
          beiErgebnis={m('definitionsbereich')}
          felder={[
            { id: 'a', name: 'kleinster erlaubter x-Wert bei p', beschriftung: <>kleinster erlaubter Wert von <Formel tex="x" /> bei <Formel tex="p" /></>, erwartet: K4.grenze },
            { id: 'b', name: 'ausgeschlossene Zahl bei q', beschriftung: <>ausgeschlossene Zahl bei <Formel tex="q" /></>, erwartet: K4.luecke },
          ]}
          hilfen={[
            <>Unter der Wurzel darf keine negative Zahl stehen. Durch 0 darf nicht geteilt werden.</>,
            <>Bei <Formel tex="p" /> muss <Formel tex="2x-6\ge 0" /> gelten. Bei <Formel tex="q" /> darf der Nenner <Formel tex="x+1" /> nicht 0 sein.</>,
          ]}
          loesung={[
            <>
              <Formel tex="p" nach=":" /> <Formel tex="2x-6\ge 0" /> ergibt <Formel tex="x\ge 3" nach="." /> Der Kosinus ist überall definiert. <Formel tex="D_p=[3;\,\infty[" nach="." />
            </>,
            <>
              <Formel tex="q" nach=":" /> <Formel tex="x+1\neq 0" /> ergibt <Formel tex="x\neq -1" nach="." /> Die Summe und <Formel tex="x^2" /> sind sonst überall definiert. <Formel tex={t`D_q=\mathbb{R}\setminus\{-1\}`} nach="." />
              <div className="bilder-paar">
                <Abbildung
                  kurven={[{ f: K4.p, farbe: BLAU }]}
                  bereich={[0, 10, -4, 4]}
                  teilung={2}
                  beschreibung="Schaubild von p(x) = Wurzel aus 2x minus 6 mal Kosinus von x. Es beginnt bei x gleich 3 und schwingt mit wachsender Amplitude."
                  unter={<>Blau: <Formel tex="K_p" nach="." /> Das Schaubild beginnt bei <Formel tex="x=3" nach="." /></>}
                />
                <Abbildung
                  kurven={[{ f: (x) => (Math.abs(x + 1) < 0.03 ? NaN : K4.q(x)), farbe: BLAU }]}
                  bereich={[-4, 3, -3, 10]}
                  teilung={1}
                  yTeilung={2}
                  beschreibung="Schaubild von q(x) = 1 durch x plus 1 plus x². Bei x gleich minus 1 ist es nicht definiert, dort steigt und fällt es steil."
                  unter={<>Blau: <Formel tex="K_q" nach="." /> Bei <Formel tex="x=-1" /> gibt es eine Lücke im Definitionsbereich.</>}
                />
              </div>
            </>,
          ]}
        >
          <p>
            Gib den maximalen Definitionsbereich von <Formel tex={t`p(x)=\sqrt{2x-6}\cdot\cos x`} /> und von <Formel tex={t`q(x)=\dfrac{1}{x+1}+x^2`} /> an. Trage den kleinsten erlaubten Wert von <Formel tex="x" /> bei <Formel tex="p" /> und die ausgeschlossene Zahl bei <Formel tex="q" /> ein.
          </p>
        </Aufgabe>
      </Punkt>

      <Punkt id="symmetrie">
        <Auswahlfrage
          nummer="K5a"
          titel="Symmetrie einer Summe"
          beiErgebnis={m('symmetrie', 'a')}
          optionen={platziere(
            [
              opt('a', <>weder achsensymmetrisch zur y-Achse noch punktsymmetrisch zum Ursprung</>, true, <>Richtig.</>),
              opt('b', <>achsensymmetrisch zur y-Achse</>, false, <>Die Summe aus einer punktsymmetrischen und einer achsensymmetrischen Funktion hat keine dieser Symmetrien. Rechne zur Probe <Formel tex="h(2)" /> und <Formel tex="h(-2)" nach="." /></>),
              opt('c', <>punktsymmetrisch zum Ursprung</>, false, <>Das gilt nur, wenn beide Summanden punktsymmetrisch sind. Hier ist <Formel tex="g" /> achsensymmetrisch.</>),
              opt('d', <>sowohl achsen- als auch punktsymmetrisch</>, false, <>Außer der Nullfunktion hat keine Funktion beide Symmetrien.</>),
            ],
            0,
          )}
          erklaerung={
            <>
              <Formel tex="f(-x)=-f(x)" /> (punktsymmetrisch) und <Formel tex="g(-x)=g(x)" /> (achsensymmetrisch). Also <Formel tex="h(-x)=-f(x)+g(x)" nach="," /> das ist weder <Formel tex="h(x)" /> noch <Formel tex="-h(x)" nach="." /> Zum Beispiel <Formel tex={`h(2)=${K5.f(2) + K5.g(2)}`} /> und <Formel tex={`h(-2)=${K5.f(-2) + K5.g(-2)}`} nach="," /> weder gleich noch entgegengesetzt.
              <Abbildung
                kurven={[{ f: (x) => K5.f(x) + K5.g(x), farbe: BLAU }]}
                bereich={[-3, 3, -10, 30]}
                teilung={1}
                yTeilung={10}
                beschreibung="Schaubild von h(x) = x⁴ + x³ + 2x − 1. Es ist weder achsensymmetrisch noch punktsymmetrisch: Bei x gleich 2 ist der Wert 27, bei x gleich minus 2 ist der Wert 3."
                unter={<>Blau: <Formel tex="K_h" nach="." /> Die beiden Seiten sind verschieden.</>}
              />
            </>
          }
        >
          <p>
            Gegeben sind <Formel tex="f(x)=x^3+2x" /> (punktsymmetrisch) und <Formel tex="g(x)=x^4-1" /> (achsensymmetrisch). Welche Symmetrie hat <Formel tex="h=f+g" nach="?" />
          </p>
        </Auswahlfrage>
        <Auswahlfrage
          nummer="K5b"
          titel="Symmetrie eines Produkts"
          beiErgebnis={m('symmetrie', 'b')}
          optionen={platziere(
            [
              opt('a', <>achsensymmetrisch zur y-Achse</>, true, <>Richtig.</>),
              opt('b', <>punktsymmetrisch zum Ursprung</>, false, <>Zwei punktsymmetrische Faktoren ergeben ein achsensymmetrisches Produkt, denn <Formel tex={t`(-a)\cdot(-b)=a\cdot b`} nach="." /></>),
              opt('c', <>weder noch</>, false, <>Beide Faktoren sind punktsymmetrisch, dann hat das Produkt eine Symmetrie.</>),
            ],
            2,
          )}
          erklaerung={
            <>
              <Formel tex="f(-x)=-f(x)" /> und <Formel tex={t`\sin(-x)=-\sin x`} nach="." /> Also <Formel tex={t`h(-x)=(-f(x))\cdot(-\sin x)=f(x)\cdot\sin x=h(x)`} nach="." />
              <Abbildung
                kurven={[{ f: (x) => K5.f(x) * K5.k(x), farbe: BLAU }]}
                bereich={[-3, 3, -12, 12]}
                teilung={1}
                yTeilung={4}
                beschreibung="Schaubild von h(x) = (x³ + 2x) mal Sinus von x. Es ist achsensymmetrisch zur y-Achse."
                unter={<>Blau: <Formel tex="K_h" nach="." /> Es ist achsensymmetrisch zur y-Achse.</>}
              />
            </>
          }
        >
          <p>
            Es sei <Formel tex="f(x)=x^3+2x" /> und <Formel tex={t`k(x)=\sin x`} nach="." /> Beide sind punktsymmetrisch. Welche Symmetrie hat <Formel tex={t`h=f\cdot k`} nach="?" />
          </p>
        </Auswahlfrage>
      </Punkt>

      <Punkt id="nullstellen-produkt">
        <Aufgabe
          nummer="K6"
          titel="Nullstellen eines Produkts"
          beiErgebnis={m('nullstellen-produkt')}
          felder={[
            { id: 'a', name: 'kleinste Nullstelle', beschriftung: <Formel tex="x_1" />, erwartet: K6.nullstellen[0] },
            { id: 'b', name: 'mittlere Nullstelle, auf zwei Stellen gerundet', beschriftung: <><Formel tex="x_2" /> (auf zwei Stellen gerundet)</>, erwartet: K6.nullstellen[1], toleranz: TOL2 },
            { id: 'c', name: 'größte Nullstelle', beschriftung: <Formel tex="x_3" />, erwartet: K6.nullstellen[2] },
          ]}
          hilfen={[
            <>Ein Produkt ist null, wenn mindestens ein Faktor null ist. Setze jeden Faktor gleich 0.</>,
            <>
              <Formel tex="x^2-4x=x(x-4)" nach="." /> Für den zweiten Faktor brauchst du den natürlichen Logarithmus: <Formel tex="e^x=5" nach="." />
            </>,
          ]}
          loesung={[
            <>
              Satz vom Nullprodukt: <Formel tex="x^2-4x=0" /> oder <Formel tex="e^x-5=0" nach="." />
            </>,
            <>
              <Formel tex="x(x-4)=0" /> ergibt <Formel tex="x=0" /> und <Formel tex="x=4" nach="." /> <Formel tex="e^x=5" /> ergibt <Formel tex={t`x=\ln 5\approx ${d3(Math.log(5))}`} nach="." />
              <Abbildung
                kurven={[{ f: K6.f, farbe: BLAU }]}
                bereich={[-1, 5, -12, 12]}
                teilung={1}
                yTeilung={4}
                beschreibung="Schaubild von f(x) = (x² − 4x) mal (e hoch x minus 5). Es schneidet die x-Achse bei x gleich 0, bei x gleich ln 5, etwa 1,61, und bei x gleich 4."
                unter={<>Blau: <Formel tex="K_f" nach="." /> Die Nullstellen liegen bei <Formel tex="0" nach="," /> <Formel tex={t`\ln 5\approx ${d3(Math.log(5))}`} /> und <Formel tex="4" nach="." /></>}
              />
            </>,
          ]}
        >
          <p>
            Bestimme die Nullstellen von <Formel tex="f(x)=(x^2-4x)(e^x-5)" /> und gib sie der Größe nach an.
          </p>
        </Aufgabe>
      </Punkt>
    </Abschnitt>
  );
}

/* ---------- Abschnitt Verkettung ---------- */

function VerkettungBereich() {
  const { melde } = useIchKann();
  const m = (id: string, teil = '1') => (r: boolean) => melde(id, teil, r);
  return (
    <Abschnitt id="verkettung" titel="Verkettung">
      <p>Hier geht es um das Verketten von Funktionen und um das Zerlegen in innere und äußere Funktion.</p>
      <Eingabehinweis />

      <Punkt id="verketten">
        <Aufgabe
          nummer="K7a"
          titel="Verkettung auswerten"
          beiErgebnis={m('verketten', 'a')}
          felder={[
            { id: 'a', name: 'u von v von 1', beschriftung: <Formel tex="u(v(1))" />, erwartet: K7.uvon1 },
            { id: 'b', name: 'v von u von 1', beschriftung: <Formel tex="v(u(1))" />, erwartet: K7.vuvon1 },
            { id: 'c', name: 'u nach v an der Stelle 0', beschriftung: <Formel tex={t`(u\circ v)(0)`} />, erwartet: K7.uv0 },
          ]}
          hilfen={[
            <>Rechne von innen nach außen. Bei <Formel tex="u(v(1))" /> berechnest du zuerst <Formel tex="v(1)" nach="." /></>,
            <>Bei <Formel tex="v(u(1))" /> ist <Formel tex="u" /> die innere Funktion: zuerst <Formel tex="u(1)" nach="." /></>,
          ]}
          loesung={[
            <>
              <Formel tex="v(1)=2" /> und <Formel tex="u(2)=2\cdot 4-1=7" nach="," /> also <Formel tex="u(v(1))=7" nach="." />
            </>,
            <>
              <Formel tex="u(1)=1" /> und <Formel tex="v(1)=2" nach="," /> also <Formel tex="v(u(1))=2" nach="." /> Die Reihenfolge ändert das Ergebnis.
            </>,
            <>
              <Formel tex="v(0)=3" /> und <Formel tex="u(3)=2\cdot 9-1=17" nach="," /> also <Formel tex={t`(u\circ v)(0)=17`} nach="." />
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex="u(x)=2x^2-1" /> und <Formel tex="v(x)=3-x" nach="." /> Berechne die drei Werte.
          </p>
        </Aufgabe>
        <Auswahlfrage
          nummer="K7b"
          titel="Term der Verkettung"
          beiErgebnis={m('verketten', 'b')}
          optionen={platziere(
            [
              opt('a', <Formel tex={t`\cos\bigl(e^x\bigr)`} />, true, <>Richtig.</>),
              opt('b', <Formel tex={t`e^{\cos x}`} />, false, <>Das ist <Formel tex={t`u(v(x))`} nach="." /> Gefragt ist <Formel tex={t`v(u(x))`} nach="," /> dabei steht <Formel tex="u" /> innen.</>),
              opt('c', <Formel tex={t`e^x\cdot\cos x`} />, false, <>Das ist das Produkt <Formel tex={t`u\cdot v`} nach="," /> keine Verkettung.</>),
              opt('d', <Formel tex={t`e^x+\cos x`} />, false, <>Das ist die Summe <Formel tex="u+v" nach="," /> keine Verkettung.</>),
            ],
            2,
          )}
          erklaerung={
            <>
              <Formel tex={t`(v\circ u)(x)=v\bigl(u(x)\bigr)=\cos\bigl(e^x\bigr)`} nach="." /> Zuerst wird <Formel tex="e^x" /> berechnet, dann davon der Kosinus.
              <Abbildung
                kurven={[
                  { f: (x) => Math.cos(Math.exp(x)), farbe: ROSA },
                  { f: (x) => Math.exp(Math.cos(x)), farbe: BLAU },
                ]}
                bereich={[-4, 4, -2, 4]}
                beschreibung="Schaubild von Kosinus von e hoch x, rosa, und zum Vergleich von e hoch Kosinus von x, blau. Das rosa Schaubild schwingt rechts immer schneller und nähert sich links dem Wert 1."
                unter={<>Rosa: <Formel tex={t`v\circ u`} nach="," /> blau zum Vergleich: <Formel tex={t`u\circ v`} nach="." /></>}
              />
            </>
          }
        >
          <p>
            Gegeben sind <Formel tex="u(x)=e^x" /> und <Formel tex={t`v(x)=\cos x`} nach="." /> Wie lautet der Term von <Formel tex={t`v\circ u`} nach="?" />
          </p>
        </Auswahlfrage>
      </Punkt>

      <Punkt id="zerlegen">
        <Auswahlfrage
          nummer="K8a"
          titel="Zerlegen mit Parametern"
          beiErgebnis={m('zerlegen', 'a')}
          optionen={platziere(
            [
              opt('a', <>innere Funktion <Formel tex="v(x)=2x+1" nach="," /> äußere Funktion <Formel tex={t`u(x)=3\sin x-1`} /></>, true, <>Richtig.</>),
              opt('b', <>innere Funktion <Formel tex="v(x)=3x-1" nach="," /> äußere Funktion <Formel tex={t`u(x)=\sin(2x+1)`} /></>, false, <>Dann wäre <Formel tex={t`u(v(x))=\sin(2(3x-1)+1)`} nach="," /> das ist eine andere Funktion.</>),
              opt('c', <>innere Funktion <Formel tex={t`v(x)=\sin x`} nach="," /> äußere Funktion <Formel tex="u(x)=3(2x+1)-1" /></>, false, <>Dann wäre <Formel tex={t`u(v(x))=3(2\sin x+1)-1=6\sin x+2`} nach="." /> Das ist nicht <Formel tex={t`3\sin(2x+1)-1`} nach="." /></>),
              opt('d', <>innere Funktion <Formel tex="v(x)=2x+1" nach="," /> äußere Funktion <Formel tex={t`u(x)=3\sin x`} /></>, false, <>Dann fehlt das <Formel tex="-1" nach=":" /> <Formel tex={t`u(v(x))=3\sin(2x+1)`} nach="." /></>),
            ],
            1,
          )}
          erklaerung={
            <>
              Von innen nach außen: Zuerst <Formel tex="2x+1" nach="," /> dann der Sinus, dann mal 3 und minus 1. Die äußere Funktion darf also eigene Faktoren und Verschiebungen enthalten.
              <Abbildung
                kurven={[
                  { f: (x) => 2 * x + 1, farbe: SCHWARZ, gestrichelt: true },
                  { f: K8a, farbe: BLAU },
                ]}
                bereich={[-3, 3, -5, 5]}
                beschreibung="Schaubild von f(x) = 3 Sinus von 2x plus 1 minus 1, blau, und die gestrichelte Gerade 2x plus 1 für die innere Funktion. Die Kurve schwingt zwischen minus 4 und 2 mit der Periode π."
                unter={<>Blau: <Formel tex="K_f" nach="," /> schwarz gestrichelt: die innere Funktion <Formel tex="v" nach="." /> Die Kurve schwingt zwischen <Formel tex="-4" /> und <Formel tex="2" nach="." /></>}
              />
            </>
          }
        >
          <p>
            Welche Zerlegung ergibt <Formel tex={t`f(x)=3\sin(2x+1)-1`} /> als <Formel tex="u(v(x))" nach="?" />
          </p>
        </Auswahlfrage>
        <Auswahlfrage
          nummer="K8b"
          titel="Zerlegen mit Wurzel"
          beiErgebnis={m('zerlegen', 'b')}
          optionen={platziere(
            [
              opt('a', <>innere Funktion <Formel tex="v(x)=9-2x" nach="," /> äußere Funktion <Formel tex={t`u(x)=\sqrt{x}`} /></>, true, <>Richtig.</>),
              opt('b', <>innere Funktion <Formel tex={t`v(x)=\sqrt{x}`} nach="," /> äußere Funktion <Formel tex="u(x)=9-2x" /></>, false, <>Das wäre <Formel tex={t`9-2\sqrt{x}`} nach="." /> Bei <Formel tex={t`\sqrt{9-2x}`} /> wird die Wurzel zuletzt gezogen.</>),
              opt('c', <>innere Funktion <Formel tex="v(x)=9-2x" nach="," /> äußere Funktion <Formel tex="u(x)=x^2" /></>, false, <>Das wäre <Formel tex="(9-2x)^2" nach="." /> Die äußere Funktion ist die Wurzel, nicht das Quadrat.</>),
            ],
            2,
          )}
          erklaerung={
            <>
              Zuerst wird <Formel tex="9-2x" /> berechnet, davon wird die Wurzel gezogen. Die Wurzel verlangt <Formel tex="9-2x\ge 0" nach="," /> also <Formel tex="x\le 4{,}5" nach="." />
              <Abbildung
                kurven={[
                  { f: (x) => 9 - 2 * x, farbe: SCHWARZ, gestrichelt: true },
                  { f: K8b, farbe: BLAU },
                ]}
                bereich={[-3, 6, -3, 6]}
                beschreibung="Schaubild von f(x) = Wurzel aus 9 minus 2x, blau, und die gestrichelte Gerade 9 minus 2x. Das blaue Schaubild endet bei x gleich 4,5, dort ist die Gerade null."
                unter={<>Blau: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="v(x)=9-2x" nach="." /> Das Schaubild endet bei <Formel tex="x=4{,}5" nach="," /> dort ist <Formel tex="v(x)=0" nach="." /></>}
              />
            </>
          }
        >
          <p>
            Welche Zerlegung ergibt <Formel tex={t`f(x)=\sqrt{9-2x}`} /> als <Formel tex="u(v(x))" nach="?" />
          </p>
        </Auswahlfrage>
      </Punkt>
    </Abschnitt>
  );
}

const K8a = (x: number) => 3 * Math.sin(2 * x + 1) - 1;
const K8b = (x: number) => (9 - 2 * x >= 0 ? Math.sqrt(9 - 2 * x) : NaN);

/* ---------- Abschnitt Umkehrfunktion ---------- */

function UmkehrungBereich() {
  const { melde } = useIchKann();
  const m = (id: string, teil = '1') => (r: boolean) => melde(id, teil, r);
  return (
    <Abschnitt id="umkehrung" titel="Umkehrfunktion">
      <p>Hier geht es um die Umkehrbarkeit, den Term der Umkehrfunktion und ihre Bereiche.</p>
      <Eingabehinweis />

      <Punkt id="monotonie">
        <Aufgabe
          nummer="K9"
          titel="Bereiche für die Umkehrbarkeit"
          beiErgebnis={m('monotonie')}
          felder={[
            { id: 'a', name: 'Stelle, die die beiden Monotoniebereiche trennt', beschriftung: <>trennende Stelle bei <Formel tex="f" /></>, erwartet: K9.scheitel },
            { id: 'b', name: 'größte Zahl b, sodass der Kosinus auf null bis b umkehrbar ist', beschriftung: <>größtes <Formel tex="b" /> bei <Formel tex={t`\cos x`} /></>, erwartet: K9.cosBis },
          ]}
          hilfen={[
            <>Eine Funktion ist umkehrbar, wo sie streng monoton ist. Bei einer Parabel trennt der Scheitel die beiden Äste.</>,
            <>Der Kosinus fällt vom Hochpunkt bei <Formel tex="x=0" /> bis zum nächsten Tiefpunkt.</>,
          ]}
          loesung={[
            <>
              <Formel tex="f(x)=-(x+1)^2+4" /> hat den Scheitel <Formel tex="S(-1\,|\,4)" nach="." /> Links davon steigt <Formel tex="f" nach="," /> rechts davon fällt <Formel tex="f" nach="." /> Die trennende Stelle ist <Formel tex="-1" nach="." /> Zum Beispiel ist <Formel tex="f" /> auf <Formel tex="[-1;\,\infty[" /> umkehrbar.
            </>,
            <>
              Der Kosinus hat bei <Formel tex="x=0" /> einen Hochpunkt und bei <Formel tex={t`x=\pi`} /> den nächsten Tiefpunkt. Dazwischen fällt er streng monoton, also ist er auf <Formel tex={t`[0;\,\pi]`} /> umkehrbar. Danach steigt er wieder, deshalb ist <Formel tex={t`b=\pi`} /> das größte.
              <div className="bilder-paar">
                <Abbildung
                  kurven={[{ f: K9.f, farbe: BLAU }]}
                  bereich={[-5, 3, -4, 5]}
                  beschreibung="Schaubild von f(x) = −(x + 1)² + 4, eine nach unten geöffnete Parabel mit dem Scheitel S(−1 | 4). Links vom Scheitel steigt sie, rechts fällt sie."
                  unter={<>Blau: <Formel tex="K_f" nach="." /> Scheitel <Formel tex="S(-1\,|\,4)" nach="." /></>}
                />
                <Abbildung
                  kurven={[{ f: Math.cos, farbe: BLAU }]}
                  bereich={[-1, 7, -2, 2]}
                  beschreibung="Schaubild des Kosinus von minus 1 bis 7. Von x gleich 0 bis x gleich π fällt es von 1 auf minus 1, danach steigt es wieder."
                  unter={<>Blau: <Formel tex={t`K_{\cos}`} nach="." /> Von <Formel tex="0" /> bis <Formel tex={t`\pi`} /> fällt der Kosinus streng monoton.</>}
                />
              </div>
            </>,
          ]}
        >
          <p>
            Gegeben sind <Formel tex="f(x)=-(x+1)^2+4" /> und <Formel tex={t`g(x)=\cos x`} nach="." /> Gib bei <Formel tex="f" /> die Stelle an, die die beiden Monotoniebereiche trennt. Gib bei <Formel tex="g" /> die größte Zahl <Formel tex="b" /> an, sodass <Formel tex="g" /> auf <Formel tex="[0;\,b]" /> umkehrbar ist.
          </p>
        </Aufgabe>
      </Punkt>

      <Punkt id="umkehrfunktion">
        <Aufgabe
          nummer="K10a"
          titel="Umkehrfunktion mit Exponentialfunktion"
          beiErgebnis={m('umkehrfunktion', 'a')}
          felder={[
            { id: 'a', name: 'f hoch minus 1 von minus 1', beschriftung: <Formel tex={t`f^{-1}(-1)`} />, erwartet: K10A.vonMinus1 },
            { id: 'b', name: 'f hoch minus 1 von 1, auf zwei Stellen gerundet', beschriftung: <><Formel tex={t`f^{-1}(1)`} /> (auf zwei Stellen gerundet)</>, erwartet: K10A.von1, toleranz: TOL2 },
            { id: 'c', name: 'untere Grenze des Definitionsbereichs der Umkehrfunktion', beschriftung: <>untere Grenze von <Formel tex={t`D_{f^{-1}}`} /></>, erwartet: K10A.grenze },
          ]}
          hilfen={[
            <>Löse <Formel tex="y=2e^{x+1}-3" /> nach <Formel tex="x" /> auf und vertausche dann <Formel tex="x" /> und <Formel tex="y" nach="." /></>,
            <>Der Definitionsbereich von <Formel tex={t`f^{-1}`} /> ist der Wertebereich von <Formel tex="f" nach="." /> Es gilt <Formel tex="e^{x+1}>0" nach="." /></>,
          ]}
          loesung={[
            <>
              <Formel tex="y=2e^{x+1}-3\;\Rightarrow\;\tfrac{y+3}{2}=e^{x+1}\;\Rightarrow\;x+1=\ln\tfrac{y+3}{2}" nach="." /> Vertauschen: <Formel tex={t`f^{-1}(x)=\ln\tfrac{x+3}{2}-1`} nach="." />
            </>,
            <>
              Wegen <Formel tex="e^{x+1}>0" /> ist <Formel tex="W_f=]-3;\,\infty[" nach="," /> also <Formel tex={t`D_{f^{-1}}=]-3;\,\infty[`} nach="." /> Die untere Grenze ist <Formel tex="-3" nach="," /> sie gehört nicht dazu. Dort hat <Formel tex={t`K_{f^{-1}}`} /> eine senkrechte Asymptote.
            </>,
            <>
              <Formel tex={t`f^{-1}(-1)=\ln 1-1=-1`} nach="," /> <Formel tex={t`f^{-1}(1)=\ln 2-1\approx ${d3(K10A.von1)}`} nach="." />
              <Abbildung
                kurven={[
                  { f: (x) => x, farbe: '#94a3b8', gestrichelt: true },
                  { f: (x) => nan(x > -3, K10A.finv(x)), farbe: BLAU },
                  { f: K10A.f, farbe: ORANGE },
                ]}
                bereich={[-5, 5, -5, 5]}
                teilung={1}
                klasse="brett-quadrat bild-schmal"
                beschreibung="Schaubild von f(x) = 2 e hoch x plus 1 minus 3 mit der waagerechten Asymptote y gleich minus 3, sein Spiegelbild, die Umkehrfunktion, mit der senkrechten Asymptote x gleich minus 3, und die Spiegelachse y gleich x."
                unter={<>Orange: <Formel tex="K_f" nach="," /> blau: <Formel tex={t`K_{f^{-1}}`} nach="," /> hellgrau gestrichelt: <Formel tex="y=x" nach="." /></>}
              />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex="f(x)=2e^{x+1}-3" nach="." /> Bestimme die Umkehrfunktion und ihren Definitionsbereich. Berechne <Formel tex={t`f^{-1}(-1)`} /> und <Formel tex={t`f^{-1}(1)`} nach="," /> und gib die untere Grenze von <Formel tex={t`D_{f^{-1}}`} /> an.
          </p>
        </Aufgabe>
        <Aufgabe
          nummer="K10b"
          titel="Umkehrfunktion bei eingeschränktem Definitionsbereich"
          beiErgebnis={m('umkehrfunktion', 'b')}
          felder={[
            { id: 'a', name: 'g hoch minus 1 von 1', beschriftung: <Formel tex={t`g^{-1}(1)`} />, erwartet: K10B.von1 },
            { id: 'b', name: 'g hoch minus 1 von 5', beschriftung: <Formel tex={t`g^{-1}(5)`} />, erwartet: K10B.von5 },
            { id: 'c', name: 'obere Grenze des Definitionsbereichs der Umkehrfunktion', beschriftung: <>obere Grenze von <Formel tex={t`D_{g^{-1}}`} /></>, erwartet: K10B.grenze },
          ]}
          hilfen={[
            <>Löse <Formel tex="y=-(x-3)^2+5" /> nach <Formel tex="x" /> auf. Wegen <Formel tex="x\ge 3" /> gilt <Formel tex="x-3\ge 0" nach="," /> du brauchst die positive Wurzel.</>,
            <>Der Scheitel von <Formel tex="K_g" /> ist <Formel tex="S(3\,|\,5)" nach="." /> Der Wertebereich von <Formel tex="g" /> ist <Formel tex="]-\infty;\,5]" nach="." /></>,
          ]}
          loesung={[
            <>
              <Formel tex="y=-(x-3)^2+5\;\Rightarrow\;(x-3)^2=5-y\;\Rightarrow\;x-3=\sqrt{5-y}" /> wegen <Formel tex="x-3\ge 0" nach="." /> Vertauschen: <Formel tex={t`g^{-1}(x)=3+\sqrt{5-x}`} nach="." />
            </>,
            <>
              <Formel tex={t`D_{g^{-1}}=W_g=]-\infty;\,5]`} nach="," /> die obere Grenze ist <Formel tex="5" nach="." /> Es gilt <Formel tex={t`g^{-1}(1)=3+\sqrt{4}=5`} /> und <Formel tex={t`g^{-1}(5)=3+0=3`} nach="." />
              <Abbildung
                kurven={[
                  { f: (x) => x, farbe: '#94a3b8', gestrichelt: true },
                  { f: K10B.ginv, farbe: BLAU },
                  { f: K10B.g, farbe: ORANGE },
                ]}
                bereich={[-3, 7, -3, 7]}
                teilung={1}
                klasse="brett-quadrat bild-schmal"
                beschreibung="Schaubild von g(x) = −(x − 3)² + 5 für x größer oder gleich 3, der fallende Ast ab dem Scheitel (3 | 5), sein Spiegelbild, die Umkehrfunktion 3 plus Wurzel aus 5 minus x bis x gleich 5, und die Spiegelachse y gleich x."
                unter={<>Orange: <Formel tex="K_g" nach="," /> blau: <Formel tex={t`K_{g^{-1}}`} nach="," /> hellgrau gestrichelt: <Formel tex="y=x" nach="." /></>}
              />
            </>,
          ]}
        >
          <p>
            Gegeben ist <Formel tex="g(x)=-(x-3)^2+5" /> mit <Formel tex="D_g=[3;\,\infty[" nach="." /> Bestimme die Umkehrfunktion. Berechne <Formel tex={t`g^{-1}(1)`} /> und <Formel tex={t`g^{-1}(5)`} nach="," /> und gib die obere Grenze von <Formel tex={t`D_{g^{-1}}`} /> an.
          </p>
        </Aufgabe>
      </Punkt>

      <Punkt id="wurzel-ln">
        <Auswahlfrage
          nummer="K11"
          titel="Logarithmus als Umkehrfunktion"
          beiErgebnis={m('wurzel-ln')}
          optionen={platziere(
            [
              opt('a', <Formel tex="e^x" />, true, <>Richtig.</>),
              opt('b', <Formel tex={t`\dfrac{1}{\ln x}`} />, false, <>Das ist der Kehrwert von <Formel tex={t`\ln x`} nach="," /> nicht die Umkehrfunktion.</>),
              opt('c', <Formel tex={t`-\ln x`} />, false, <>Das ist die Spiegelung an der x-Achse. Die Umkehrfunktion entsteht durch Spiegelung an der Geraden <Formel tex="y=x" nach="." /></>),
              opt('d', <Formel tex="x^2" />, false, <>Das ist die Umkehrfunktion der Wurzelfunktion (für <Formel tex="x\ge 0" nach=")," /> nicht des Logarithmus.</>),
            ],
            3,
          )}
          erklaerung={
            <>
              Es gilt <Formel tex={t`\ln(e^x)=x`} /> und <Formel tex={t`e^{\ln x}=x`} nach="." /> Der Definitionsbereich <Formel tex="]0;\,\infty[" /> von <Formel tex={t`\ln`} /> ist der Wertebereich von <Formel tex="e^x" nach="." />
              <Abbildung
                kurven={[
                  { f: (x) => x, farbe: '#94a3b8', gestrichelt: true },
                  { f: Math.exp, farbe: ORANGE },
                  { f: (x) => nan(x > 0, Math.log(x)), farbe: BLAU },
                ]}
                bereich={[-4, 4, -4, 4]}
                teilung={1}
                klasse="brett-quadrat bild-schmal"
                beschreibung="Schaubild von e hoch x, orange, und des natürlichen Logarithmus, blau. Sie liegen spiegelbildlich zur gestrichelten Geraden y gleich x."
                unter={<>Orange: <Formel tex="e^x" nach="," /> blau: <Formel tex={t`\ln x`} nach="," /> hellgrau gestrichelt: <Formel tex="y=x" nach="." /></>}
              />
            </>
          }
        >
          <p>
            Welche Funktion ist die Umkehrfunktion von <Formel tex={t`f(x)=\ln x`} nach="?" />
          </p>
        </Auswahlfrage>
      </Punkt>
    </Abschnitt>
  );
}

/* ---------- Abschnitt Auswertung ---------- */

function AuswertungBereich() {
  return <IchKannAuswertung aussagen={AUSSAGEN} bereiche="die drei Bereiche" modulTitel={MODULE} abschnittTitel={ABSCHNITT_TITEL} />;
}

export default function Modul() {
  return (
    <ZustandAnbieter>
      <Anleitung />
      <VerknuepfungBereich />
      <VerkettungBereich />
      <UmkehrungBereich />
      <AuswertungBereich />
    </ZustandAnbieter>
  );
}

