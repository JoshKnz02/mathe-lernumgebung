import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Beobachtung } from '@/components/Beobachtung';
import { FlaechenFigur, type FlaechenbildDaten } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Kontrollschaubild, ORANGE } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { VennDiagramm } from '@/components/VennDiagramm';
import { orientierteFlaechen } from '@/lib/flaechenbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { REGIONEN, regionText } from '@/lib/venn';
import {
  A2, A4, BEISPIELE1, BEISPIELE2, FRAGE1, FRAGE3, LEER1, LEER2, MENGEN1, MENGEN2, NAMEN1, NAMEN2, fenster, kubik,
} from './daten';
import { Labor1, Labor2 } from './Labor';
import { Pruefer, type Begruendungen } from './Pruefer';

const TOL = 0.01;

/** Schaubild einer Funktion mit der Fläche über [von; bis] (positiv blau, negativ rosa). */
function bild(f: (x: number) => number, von: number, bis: number, beschreibung: string, texte: string[] = []): FlaechenbildDaten {
  const fen = fenster(f, von, bis);
  return { ...fen, xTitel: 'x', yTitel: 'y', kurven: [{ f, farbe: ORANGE }], flaechen: orientierteFlaechen(f, von, bis, texte), beschreibung };
}

const BILD_ZP = bild(kubik({ p: 1, q: 0, r: -3, s: 0 }), -2, 2, 'Schaubild von x hoch 3 minus 3 x im Bereich von minus 2 bis 2. Links von 0 liegt ein Flächenstück oberhalb der x-Achse, rechts von 0 ein gleich großes unterhalb.', ['+2', '−2']);
const BILD_A2 = bild(A2.f(-4 / 3), -2, 2, 'Schaubild einer nach oben geöffneten Parabel mit dem Tiefpunkt links von der y-Achse. Über dem Intervall von minus 2 bis 2 liegt die Fläche zum größeren Teil oberhalb der x-Achse, zum kleineren darunter, die Integralwerte heben sich auf.');
const BILD_B1 = bild(FRAGE1.f, -2, 2, 'Schaubild von x plus 1 hoch 3 im Bereich von minus 2 bis 2. Es steigt überall und hat bei minus 1 seine Nullstelle mit waagerechter Tangente.');
const BILD_B3 = bild(FRAGE3.f, 0, 2, 'Schaubild einer Parabel mit den Nullstellen 0 und 2. Zwischen den Nullstellen liegt das Schaubild unterhalb der x-Achse, der Tiefpunkt liegt bei x gleich 1.', ['−1,33']);
const BILD_A4 = bild(A4.f(2), 0, 2, 'Schaubild einer fallenden Geraden mit der Nullstelle bei 1,5. Die Fläche über dem Intervall von 0 bis 2 ist zum größeren Teil oberhalb der x-Achse.', ['+2,25', '−0,25']);

/** Begründungen der drei Eigenschaften je Beispiel in Diagramm 1. Reihenfolge: Z, P, M. */
export const TEXTE1: Begruendungen = {
  'z-gerade': [
    <>Eine Stammfunktion ist <Formel tex={t`\frac{1}{3}x^3-\frac{4}{3}x`} nach="." /> Eingesetzt gibt das <Formel tex={t`\left(\frac{8}{3}-\frac{8}{3}\right)-\left(-\frac{8}{3}+\frac{8}{3}\right)=0`} nach="." /></>,
    <>Es ist <Formel tex={t`f(-1)=f(1)=-\frac{1}{3}`} nach="." /> Bei Punktsymmetrie müsste <Formel tex="f(-1)" /> den entgegengesetzten Wert haben.</>,
    <>Die Ableitung <Formel tex={t`f'(x)=2x`} /> ist für <Formel tex="x<0" /> negativ, <Formel tex="f" /> fällt dort.</>,
  ],
  'm-linear': [
    <>Eine Stammfunktion ist <Formel tex={t`\frac{1}{2}x^2+x`} nach="." /> Es ist <Formel tex={t`F(2)-F(-2)=4-0=4`} nach="." /></>,
    <>Es ist <Formel tex="f(1)=2" /> und <Formel tex="f(-1)=0" nach="." /> Für Punktsymmetrie müsste <Formel tex="f(-1)=-2" /> gelten.</>,
    <>Die Ableitung <Formel tex="f'(x)=1" /> ist überall positiv.</>,
  ],
  'zp-kubik': [
    <>Eine Stammfunktion ist <Formel tex={t`\frac{1}{4}x^4-\frac{3}{2}x^2`} nach="." /> Es ist <Formel tex={t`F(2)=-2`} /> und <Formel tex={t`F(-2)=-2`} nach="," /> die Differenz ist 0.</>,
    <>Für jedes <Formel tex="x" /> gilt <Formel tex={t`f(-x)=-x^3+3x=-f(x)`} nach="." /></>,
    <>Die Ableitung <Formel tex={t`f'(x)=3x^2-3`} /> ist zum Beispiel bei <Formel tex="x=0" /> gleich <Formel tex="-3" nach="." /> Dort fällt <Formel tex="f" nach="." /></>,
  ],
  'zm-parabel': [
    <>Eine Stammfunktion ist <Formel tex={t`\frac{1}{3}x^3+2x^2-\frac{4}{3}x`} nach="." /> Es ist <Formel tex={t`F(2)=\frac{8}{3}+8-\frac{8}{3}=8`} /> und <Formel tex={t`F(-2)=-\frac{8}{3}+8+\frac{8}{3}=8`} nach="," /> die Differenz ist 0.</>,
    <>Es ist <Formel tex={t`f(1)=\frac{11}{3}`} /> und <Formel tex={t`f(-1)=-\frac{13}{3}`} nach="." /> Die Beträge sind verschieden, es liegt keine Punktsymmetrie vor.</>,
    <>Die Ableitung <Formel tex={t`f'(x)=2x+4`} /> ist auf <Formel tex="[-2;\,2]" /> nicht negativ, sie wird nur bei <Formel tex="x=-2" /> gleich 0.</>,
  ],
  'alle-kubik': [
    <>Eine Stammfunktion ist <Formel tex={t`\frac{1}{4}x^4`} nach="." /> Es ist <Formel tex="F(2)=F(-2)=4" nach="," /> die Differenz ist 0.</>,
    <>Für jedes <Formel tex="x" /> gilt <Formel tex={t`(-x)^3=-x^3`} nach="." /></>,
    <>Die Ableitung <Formel tex={t`f'(x)=3x^2`} /> ist nie negativ.</>,
  ],
  keine: [
    <>Eine Stammfunktion ist <Formel tex={t`\frac{1}{3}x^3+x`} nach="." /> Es ist <Formel tex={t`F(2)-F(-2)=\frac{8}{3}+2-\left(-\frac{8}{3}-2\right)=\frac{28}{3}`} nach="." /></>,
    <>Es ist <Formel tex="f(-1)=f(1)=2" nach="." /> Bei Punktsymmetrie müssten die Werte entgegengesetzt sein.</>,
    <>Die Ableitung <Formel tex="f'(x)=2x" /> ist für <Formel tex="x<0" /> negativ.</>,
  ],
};

/** Begründungen in Diagramm 2. Reihenfolge: P, W, M. */
export const TEXTE2: Begruendungen = {
  p: [
    <>Es ist <Formel tex={t`\int_{0}^{2}(x+1)\,\mathrm{d}x=\left[\frac{1}{2}x^2+x\right]_0^2=4`} nach="." /> Das ist positiv.</>,
    <>Die Funktion ist auf dem ganzen Intervall positiv, es gibt keine Nullstelle.</>,
    <>Die Ableitung <Formel tex="f'(x)=1" /> ist positiv, <Formel tex="f" /> steigt.</>,
  ],
  w: [
    <>Es ist <Formel tex={t`\int_{0}^{2}\left(x^2-\frac{3}{2}x\right)\mathrm{d}x=\frac{8}{3}-3=-\frac{1}{3}`} nach="." /> Das ist nicht positiv.</>,
    <>Die Nullstellen sind 0 und 1,5. Bei 1,5 wechselt das Vorzeichen von <Formel tex="-" /> nach <Formel tex="+" nach="." /></>,
    <>Die Ableitung <Formel tex={t`f'(x)=2x-\frac{3}{2}`} /> ist bei <Formel tex="x=2" /> gleich <Formel tex="2{,}5" nach="." /> Die Funktion fällt dort nicht.</>,
  ],
  m: [
    <>Es ist <Formel tex={t`\int_{0}^{2}(-x-1)\,\mathrm{d}x=-4`} nach="." /> Das ist negativ.</>,
    <>Die Funktion ist auf dem ganzen Intervall negativ, es gibt keinen Vorzeichenwechsel.</>,
    <>Die Ableitung <Formel tex="f'(x)=-1" /> ist überall negativ, <Formel tex="f" /> fällt streng.</>,
  ],
  pw: [
    <>Es ist <Formel tex={t`\int_{0}^{2}\left(x^2-\frac{1}{2}\right)\mathrm{d}x=\frac{8}{3}-1=\frac{5}{3}`} nach="." /> Das ist positiv.</>,
    <>Die Nullstelle <Formel tex={t`x=\frac{1}{\sqrt{2}}\approx 0{,}71`} /> liegt in <Formel tex="]0;\,2[" nach="." /> Dort wechselt das Vorzeichen von <Formel tex="-" /> nach <Formel tex="+" nach="." /></>,
    <>Die Ableitung <Formel tex="f'(x)=2x" /> ist bei <Formel tex="x=1" /> positiv, die Funktion steigt.</>,
  ],
  wm: [
    <>Es ist <Formel tex={t`\int_{0}^{2}(1-2x)\,\mathrm{d}x=2-4=-2`} nach="." /> Das ist nicht positiv.</>,
    <>Die Nullstelle <Formel tex="x=0{,}5" /> liegt in <Formel tex="]0;\,2[" nach="." /> Dort wechselt das Vorzeichen von <Formel tex="+" /> nach <Formel tex="-" nach="." /></>,
    <>Die Ableitung <Formel tex="f'(x)=-2" /> ist negativ, <Formel tex="f" /> fällt streng.</>,
  ],
  pm: [
    <>Es ist <Formel tex={t`\int_{0}^{2}(3-x)\,\mathrm{d}x=6-2=4`} nach="." /> Das ist positiv.</>,
    <>Es ist <Formel tex="f(2)=1" nach="." /> Die Funktion bleibt auf dem Intervall positiv, die Nullstelle 3 liegt außerhalb.</>,
    <>Die Ableitung <Formel tex="f'(x)=-1" /> ist negativ, <Formel tex="f" /> fällt streng.</>,
  ],
  pwm: [
    <>Es ist <Formel tex={t`\int_{0}^{2}(3-2x)\,\mathrm{d}x=6-4=2`} nach="." /> Das ist positiv.</>,
    <>Die Nullstelle <Formel tex="x=1{,}5" /> liegt in <Formel tex="]0;\,2[" nach="." /> Dort wechselt das Vorzeichen von <Formel tex="+" /> nach <Formel tex="-" nach="." /></>,
    <>Die Ableitung <Formel tex="f'(x)=-2" /> ist negativ, <Formel tex="f" /> fällt streng.</>,
  ],
  keine: [
    <>Es ist <Formel tex={t`\int_{0}^{2}\left(-x^2+2x-2\right)\mathrm{d}x=-\frac{8}{3}+4-4=-\frac{8}{3}`} nach="." /> Das ist negativ.</>,
    <>Es ist <Formel tex={t`f(x)=-(x-1)^2-1<0`} /> für alle <Formel tex="x" nach="." /> Es gibt keine Nullstelle.</>,
    <>Die Ableitung <Formel tex={t`f'(x)=-2x+2`} /> ist bei <Formel tex="x=0" /> gleich 2. Dort steigt <Formel tex="f" nach="." /></>,
  ],
};

const Eigenschaft = ({ kopf, children }: { kopf: string; children: React.ReactNode }) => (
  <div>
    <dt>{kopf}</dt>
    <dd>{children}</dd>
  </div>
);

function Vorgehen() {
  return (
    <Abschnitt id="vorgehen" titel="Vorgehen">
      <h3>Problemlösen statt Rechenschema</h3>
      <p>
        Dieses Modul bringt keinen neuen Stoff. Du suchst Funktionen mit vorgegebenen Eigenschaften, ordnest Funktionen ein und begründest, wenn es keine passende Funktion gibt. Dafür brauchst du das Integral als Flächenbilanz (<Modulverweis modul="bestimmtes-integral">Das bestimmte Integral</Modulverweis>), das Verhalten der Integralfunktion (<Modulverweis modul="integralfunktion">Die Integralfunktion und der Hauptsatz</Modulverweis>), den Unterschied zwischen Integral und Flächeninhalt (<Modulverweis modul="flaeche-kurve-x-achse">Flächeninhalt zwischen Kurve und x-Achse</Modulverweis>) und die Monotonie aus der Ableitung (<Modulverweis modul="kurvendiskussion">Kurvendiskussion</Modulverweis>).
      </p>

      <h3>So gehst du vor</h3>
      <ol className="liste">
        <li><strong>Analysieren.</strong> Lies, welche drei Eigenschaften das Diagramm zeigt, und was es bedeutet, in einer Menge oder außerhalb zu liegen. Außerhalb einer Menge heißt, dass die Eigenschaft nicht gilt.</li>
        <li><strong>Durchführen.</strong> Schreibe für jede Region auf, welche Eigenschaften gelten müssen und welche nicht gelten dürfen, und suche dazu eine Funktion.</li>
        <li><strong>Umgekehrt probieren.</strong> Wähle eine einfache Funktion und prüfe, zu welcher Region sie gehört. Jede Funktion liegt in genau einer Region.</li>
        <li><strong>Prüfen.</strong> Rechne das Integral nach, begründe die Symmetrie und die Monotonie, skizziere, wenn es hilft.</li>
        <li><strong>Reflektieren.</strong> Eine Region kann leer sein. Dann musst du begründen, warum es dort keine Funktion geben kann.</li>
      </ol>

      <h3>Die Regionen</h3>
      <p>
        Jedes Diagramm hat drei Kreise. Jeder Kreis steht für eine Eigenschaft. Eine Funktion gehört zu den Kreisen, deren Eigenschaft sie hat, und liegt damit in genau einer der acht Regionen A bis H: Region A liegt nur im ersten Kreis, B nur im zweiten, C nur im dritten, D im ersten und zweiten, E im zweiten und dritten, F im ersten und dritten, G in allen drei Kreisen und H außerhalb aller Kreise.
      </p>
      <Hinweis titel="Eigenschaften genau lesen">
        „Das Integral ist positiv“ ist etwas anderes als „die Funktion ist positiv“. Das Integral ist eine Zahl für ein ganzes Intervall, die Funktion hat an jeder Stelle einen Wert. Achte bei jeder Eigenschaft darauf, auf welchem Intervall sie gemeint ist.
      </Hinweis>

      <h3>Die Eigenschaften, die hier vorkommen</h3>
      <dl className="eigenschaften">
        <Eigenschaft kopf="Integral 0 oder positiv">
          Das <strong>Integral</strong> von <Formel tex="a" /> bis <Formel tex="b" /> ist eine Flächenbilanz: Stücke oberhalb der x-Achse zählen positiv, Stücke darunter negativ. Es kann deshalb 0 sein, obwohl die Fläche nicht 0 ist.
        </Eigenschaft>
        <Eigenschaft kopf="punktsymmetrisch">
          <Formel tex="K_f" /> ist <strong>punktsymmetrisch zum Ursprung</strong>, wenn für jedes <Formel tex="x" /> gilt <Formel tex={t`f(-x)=-f(x)`} nach="." /> Test: Es genügt ein Wert, bei dem das nicht stimmt, um die Eigenschaft zu widerlegen.
        </Eigenschaft>
        <Eigenschaft kopf="monoton steigend, streng monoton fallend">
          <Formel tex="f" /> ist <strong>monoton steigend</strong>, wenn aus <Formel tex={t`x_1<x_2`} /> folgt <Formel tex={t`f(x_1)\le f(x_2)`} nach="." /> Bei <strong>streng monoton fallend</strong> gilt <Formel tex={t`f(x_1)>f(x_2)`} nach="." /> Test mit der Ableitung: <Formel tex="f" /> ist monoton steigend, wenn <Formel tex={t`f'\ge 0`} /> auf dem Intervall gilt. Streng monoton fallend ist <Formel tex="f" nach="," /> wenn <Formel tex={t`f'\le 0`} /> gilt und <Formel tex="f'" /> nur an einzelnen Stellen gleich 0 ist, zum Beispiel bei <Formel tex={t`f(x)=-x^2`} /> auf <Formel tex="[0;\,2]" nach="." />
        </Eigenschaft>
        <Eigenschaft kopf="Vorzeichenwechsel">
          <Formel tex="f" /> <strong>wechselt das Vorzeichen</strong>, wenn <Formel tex="K_f" /> eine Nullstelle im Inneren des Intervalls hat und dort die x-Achse schneidet. Berührt <Formel tex="K_f" /> die x-Achse nur, oder liegt die Nullstelle am Rand des Intervalls, ist das kein Vorzeichenwechsel im Inneren.
        </Eigenschaft>
      </dl>
    </Abschnitt>
  );
}

function Diagramm1() {
  return (
    <Abschnitt id="diagramm-1" titel="Diagramm 1">
      <h3>Integral, Symmetrie und Monotonie</h3>
      <p>
        Alle Funktionen sind auf dem Intervall <Formel tex="[-2;\,2]" /> betrachtet. Die drei Eigenschaften:
      </p>
      <dl className="eigenschaften">
        <Eigenschaft kopf="Z: Integral 0"><Formel tex={t`\int_{-2}^{2}f(x)\,\mathrm{d}x=0`} nach="." /></Eigenschaft>
        <Eigenschaft kopf="P: punktsymmetrisch">Für alle <Formel tex="x" /> gilt <Formel tex={t`f(-x)=-f(x)`} nach="." /></Eigenschaft>
        <Eigenschaft kopf="M: monoton steigend">Auf <Formel tex="[-2;\,2]" /> gilt <Formel tex={t`f'(x)\ge 0`} nach="." /></Eigenschaft>
      </dl>
      <figure className="bild">
        <VennDiagramm mengen={MENGEN1} leer={LEER1} />
        <figcaption>Blau: Z, orange gestrichelt: P, grün gepunktet: M. Die Regionen A bis H sind beschriftet.</figcaption>
      </figure>
      <p>
        <strong>Aufgabe:</strong> Finde für jede Region A bis H eine Funktion. Wenn du für eine Region keine findest, begründe, warum es keine geben kann.
      </p>

      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutung.</p>
      <ol className="auftraege">
        <li>
          <p>
            Eine Funktion ist punktsymmetrisch zum Ursprung. Was kannst du dann über ihr Integral von <Formel tex="-2" /> bis <Formel tex="2" /> sagen? Welche Regionen bleiben deshalb leer?
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={BILD_ZP}
                unter={
                  <>
                    Zwei gleich große Flächenstücke, links oberhalb, rechts unterhalb der x-Achse. Ihre Werte <Formel tex="+2" /> und <Formel tex="-2" /> heben sich auf.
                  </>
                }
              />
            }
          >
            Das Integral ist 0. Das Stück links von 0 ist das am Ursprung gespiegelte Stück rechts von 0, es hat denselben Betrag und das entgegengesetzte Vorzeichen. Also liegt jede punktsymmetrische Funktion in Z. Leer bleiben die Regionen, die P ohne Z verlangen, das sind B (nur P) und E (P und M, aber nicht Z). Im Labor kannst du das nachprüfen.
          </Beobachtung>
        </li>
      </ol>

      <h3>Beispiele prüfen</h3>
      <p>Wähle eine Funktion. Der Prüfer zeigt, welche der drei Eigenschaften sie hat, begründet jede und markiert die Region.</p>
      <Pruefer beispiele={BEISPIELE1} mengen={MENGEN1} namen={NAMEN1} leer={LEER1} begruendungen={TEXTE1} start="zp-kubik" />

      <h3>Labor: Funktionen suchen</h3>
      <p>
        Hier legst du die Funktion selbst fest: <Formel tex={t`f(x)=p\,x^3+q\,x^2+r\,x+s`} nach="." /> Stelle mit den Reglern vier Zahlen ein. Das Labor zeigt, welche Eigenschaften gelten und in welcher Region die Funktion liegt. Versuche, jede Region zu erreichen, und halte fest, bei welchen es nicht geht.
      </p>
      <Labor1 />

      <h3>Aufgaben</h3>
      <Frage1 />
      <Aufgabe2 />
      <Frage3 />
    </Abschnitt>
  );
}

function Frage1() {
  return (
    <Auswahlfrage
      nummer="1"
      titel="In welche Region gehört die Funktion?"
      optionen={platziere(
        [
          opt('a', <>Region G: Integral 0, punktsymmetrisch und monoton steigend</>, false, <>Für G müsste das Integral 0 sein. Hier ist es <Formel tex="20" nach="." /> Außerdem ist <Formel tex="K_f" /> nicht punktsymmetrisch, denn <Formel tex="f(-1)=0" /> und <Formel tex="f(1)=8" nach="." /></>),
          opt('b', <>Region C: nur monoton steigend</>, true, <>Richtig. Das Integral ist <Formel tex="20" />, die Funktion ist nicht punktsymmetrisch und wegen <Formel tex={t`f'(x)=3(x+1)^2\ge 0`} /> monoton steigend.</>),
          opt('c', <>Region A: nur Integral 0</>, false, <>Das Integral ist nicht 0. Es ist <Formel tex={t`\frac{1}{4}\left(3^4-(-1)^4\right)=20`} nach="." /></>),
          opt('d', <>Region F: Integral 0 und monoton steigend</>, false, <>Die Funktion ist monoton steigend, das Integral ist aber <Formel tex="20" /> und nicht 0.</>),
        ],
        1,
      )}
      erklaerung={
        <>
          Eine Stammfunktion von <Formel tex={t`f(x)=(x+1)^3`} /> ist <Formel tex={t`F(x)=\frac{1}{4}(x+1)^4`} nach="." /> Damit ist
          <Formel anzeige tex={t`\int_{-2}^{2}f(x)\,\mathrm{d}x=F(2)-F(-2)`} />
          <Formel anzeige tex={t`{}=\frac{81}{4}-\frac{1}{4}=20`} nach="." />
          Z gilt nicht. Es ist <Formel tex="f(1)=8" /> und <Formel tex="f(-1)=0" nach="," /> also gilt <Formel tex={t`f(-x)=-f(x)`} /> nicht, P gilt nicht. Die Ableitung <Formel tex={t`f'(x)=3(x+1)^2`} /> ist nie negativ, M gilt. Nur M trifft zu, das ist Region C.
          <FlaechenFigur daten={BILD_B1} unter={<>Das Schaubild steigt überall. Die Fläche über dem Intervall ist ganz oberhalb der x-Achse bis auf das kleine Stück links der Nullstelle.</>} />
        </>
      }
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=(x+1)^3`} nach="." /> In welche Region von Diagramm 1 gehört <Formel tex="f" nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe2() {
  return (
    <Aufgabe
      nummer="2"
      titel="Eine Funktion für Region F"
      felder={[
        { id: 'i0', name: 'Wert des Integrals für c gleich 0', beschriftung: <>Integral für <Formel tex="c=0" /></>, erwartet: A2.integral0, toleranz: TOL },
        { id: 'c', name: 'Wert von c', beschriftung: <><Formel tex="c" /></>, erwartet: A2.c, toleranz: TOL },
      ]}
      hilfen={[
        <>Das Integral von <Formel tex="-2" /> bis <Formel tex="2" /> von <Formel tex="4x" /> ist 0. Die Fläche links und rechts von 0 hebt sich auf.</>,
        <>Eine Stammfunktion von <Formel tex={t`x^2+4x+c`} /> ist <Formel tex={t`\frac{1}{3}x^3+2x^2+cx`} nach="." /></>,
        <>Für Region F muss auch die Monotonie gelten. Prüfe sie mit der Ableitung <Formel tex={t`f_c'(x)=2x+4`} nach="." /></>,
      ]}
      loesung={[
        <>
          Mit <Formel tex={t`F(x)=\frac{1}{3}x^3+2x^2+cx`} /> ist
          <Formel anzeige tex={t`\int_{-2}^{2}f_c(x)\,\mathrm{d}x=F(2)-F(-2)`} />
          <Formel anzeige tex={t`{}=\frac{16}{3}+4c`} nach="." />
        </>,
        <>
          Für <Formel tex="c=0" /> ist das Integral <Formel tex={t`\frac{16}{3}\approx 5{,}33`} nach="." /> Es ist 0 für <Formel tex={t`\frac{16}{3}+4c=0`} nach="," /> also <Formel tex={t`c=-\frac{4}{3}\approx -1{,}33`} nach="." />
        </>,
        <>
          Die Ableitung <Formel tex={t`f_c'(x)=2x+4`} /> ist auf <Formel tex="[-2;\,2]" /> nicht negativ, sie ist nur bei <Formel tex="x=-2" /> gleich 0. Also gilt M. Die Funktion ist nicht punktsymmetrisch, denn <Formel tex="f_c(0)=c\ne 0" nach="." /> Damit liegt <Formel tex={t`f(x)=x^2+4x-\frac{4}{3}`} /> in Region F.
          <FlaechenFigur daten={BILD_A2} unter={<>Das Schaubild für <Formel tex={t`c=-\frac{4}{3}`} nach=":" /> Die Fläche oberhalb und unterhalb der x-Achse ist gleich groß, das Integral ist 0.</>} />
        </>,
      ]}
    >
      <p>
        Für jede reelle Zahl <Formel tex="c" /> ist <Formel tex={t`f_c(x)=x^2+4x+c`} /> gegeben. Berechnen Sie das Integral von <Formel tex="-2" /> bis <Formel tex="2" /> für <Formel tex="c=0" nach="." /> Bestimmen Sie dann <Formel tex="c" nach="," /> sodass <Formel tex="f_c" /> in Region F von Diagramm 1 liegt.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A2} unter={<>Das Schaubild von <Formel tex={t`f_c`} /> für <Formel tex={t`c=-\frac{4}{3}`} nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage3() {
  return (
    <Auswahlfrage
      nummer="3"
      titel="Warum sind die Regionen B und E leer?"
      optionen={platziere(
        [
          opt('a', <>Es gibt keine punktsymmetrische Funktion, die auf <Formel tex="[-2;\,2]" /> monoton steigt.</>, false, <>Doch, zum Beispiel <Formel tex="f(x)=x" /> oder <Formel tex={t`f(x)=x^3`} nach="." /> Beide liegen in Region G.</>),
          opt('b', <>Jede monoton steigende Funktion hat ein Integral ungleich 0.</>, false, <>Das stimmt nicht: <Formel tex="f(x)=x" /> ist monoton steigend und hat das Integral 0.</>),
          opt('c', <>Jede punktsymmetrische Funktion hat über <Formel tex="[-2;\,2]" /> das Integral 0, die Regionen B und E verlangen aber ein Integral ungleich 0.</>, true, <>Richtig. Wer in P liegt, liegt automatisch in Z. B (nur P) und E (P und M ohne Z) widersprechen dem.</>),
          opt('d', <>Eine Funktion mit Integral 0 kann nicht punktsymmetrisch sein.</>, false, <>Das Gegenteil gilt: Punktsymmetrie führt zum Integral 0, zum Beispiel bei <Formel tex={t`x^3-3x`} nach="." /></>),
        ],
        2,
      )}
      erklaerung={
        <>
          Ist <Formel tex="f" /> punktsymmetrisch zum Ursprung, so ist das Flächenstück von <Formel tex="-2" /> bis <Formel tex="0" /> das Spiegelbild des Stücks von 0 bis 2, nur mit entgegengesetztem Vorzeichen. Deshalb gilt
          <Formel anzeige tex={t`\int_{-2}^{0}f(x)\,\mathrm{d}x=-\int_{0}^{2}f(x)\,\mathrm{d}x`} />
          und damit <Formel tex={t`\int_{-2}^{2}f(x)\,\mathrm{d}x=0`} nach="." /> Jede Funktion in P liegt also auch in Z. Die Regionen B und E liegen in P, aber außerhalb von Z. Dort kann es keine Funktion geben.
          <FlaechenFigur daten={BILD_ZP} unter={<>Beispiel <Formel tex={t`f(x)=x^3-3x`} nach=":" /> Die beiden Stücke haben die Werte <Formel tex="+2" /> und <Formel tex="-2" nach="." /></>} />
        </>
      }
    >
      <p>
        In Diagramm 1 findest du für die Regionen A, C, D, F, G und H Funktionen, für B und E nicht. Welche Begründung ist richtig?
      </p>
    </Auswahlfrage>
  );
}

function Diagramm2() {
  return (
    <Abschnitt id="diagramm-2" titel="Diagramm 2">
      <h3>Integral, Vorzeichenwechsel und Monotonie</h3>
      <p>
        Alle Funktionen sind jetzt auf dem Intervall <Formel tex="[0;\,2]" /> betrachtet. Die drei Eigenschaften:
      </p>
      <dl className="eigenschaften">
        <Eigenschaft kopf="P: Integral positiv"><Formel tex={t`\int_{0}^{2}f(x)\,\mathrm{d}x>0`} nach="." /></Eigenschaft>
        <Eigenschaft kopf="W: Vorzeichenwechsel">Es gibt eine Stelle in <Formel tex="]0;\,2[" nach="," /> an der <Formel tex="f" /> das Vorzeichen wechselt.</Eigenschaft>
        <Eigenschaft kopf="M: streng monoton fallend">Auf <Formel tex="[0;\,2]" /> gilt <Formel tex={t`f'(x)\le 0`} nach="," /> und <Formel tex="f'" /> ist nur an einzelnen Stellen 0.</Eigenschaft>
      </dl>
      <figure className="bild">
        <VennDiagramm mengen={MENGEN2} leer={LEER2} />
        <figcaption>Blau: P, orange gestrichelt: W, grün gepunktet: M.</figcaption>
      </figure>
      <p>
        <strong>Aufgabe:</strong> Finde für jede Region A bis H eine Funktion. Wenn du für eine Region keine findest, begründe, warum.
      </p>

      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutung.</p>
      <ol className="auftraege">
        <li>
          <p>
            Gibt es in diesem Diagramm eine Region, in der keine Funktion liegen kann, so wie bei Diagramm 1? Überlege, ob die drei Eigenschaften einander ausschließen.
          </p>
          <Beobachtung
            bild={
              <FlaechenFigur
                daten={bild(quadrat3(), 0, 2, 'Schaubild einer fallenden Geraden mit der Nullstelle bei 1,5. Die Fläche über dem Intervall von 0 bis 2 ist zum größeren Teil oberhalb der x-Achse.', ['+2,25', '−0,25'])}
                unter={<>Die Funktion <Formel tex={t`f(x)=3-2x`} /> liegt in Region G: Das Integral ist <Formel tex="2" nach="," /> sie wechselt bei 1,5 das Vorzeichen und fällt streng.</>}
              />
            }
          >
            Nein. Keine Eigenschaft folgt aus einer anderen. Deshalb gibt es für alle acht Regionen eine Funktion. Das Beispiel rechts liegt sogar in Region G, also in allen drei Mengen. Die Beispiele im Prüfer zeigen die übrigen Regionen.
          </Beobachtung>
        </li>
      </ol>

      <h3>Beispiele prüfen</h3>
      <Pruefer beispiele={BEISPIELE2} mengen={MENGEN2} namen={NAMEN2} leer={LEER2} begruendungen={TEXTE2} start="pwm" />

      <h3>Labor: Funktionen suchen</h3>
      <p>
        Hier ist <Formel tex={t`f(x)=a\,x^2+b\,x+c`} nach="." /> Stelle die drei Zahlen so ein, dass du jede der acht Regionen erreichst. Achte darauf, dass auch Geraden dabei sind: Mit <Formel tex="a=0" /> ist <Formel tex="f" /> linear.
      </p>
      <Labor2 />

      <h3>Aufgaben</h3>
      <Frage4 />
      <Aufgabe5 />
    </Abschnitt>
  );
}

function Frage4() {
  return (
    <Auswahlfrage
      nummer="4"
      titel="In welche Region gehört die Funktion?"
      optionen={platziere(
        [
          opt('a', <>Region B: nur Vorzeichenwechsel</>, false, <>Die Nullstellen 0 und 2 sind die Ränder des Intervalls. Im Inneren von <Formel tex="]0;\,2[" /> ist <Formel tex="f" /> negativ, es gibt keinen Vorzeichenwechsel.</>),
          opt('b', <>Region C: nur streng monoton fallend</>, false, <>Die Ableitung <Formel tex={t`f'(x)=2x-2`} /> ist für <Formel tex="x>1" /> positiv. Die Funktion fällt nur bis <Formel tex="x=1" nach="." /></>),
          opt('c', <>Region A: nur Integral positiv</>, false, <>Das Integral ist <Formel tex={t`-\frac{4}{3}`} nach="," /> also negativ.</>),
          opt('d', <>Region H: keine der drei Eigenschaften</>, true, <>Richtig. Das Integral ist negativ, es gibt keinen Vorzeichenwechsel im Inneren und die Funktion fällt nicht auf dem ganzen Intervall.</>),
        ],
        3,
      )}
      erklaerung={
        <>
          Mit <Formel tex={t`F(x)=\frac{1}{3}x^3-x^2`} /> ist <Formel tex={t`\int_{0}^{2}f(x)\,\mathrm{d}x=\frac{8}{3}-4=-\frac{4}{3}`} nach="." /> Das ist nicht positiv. Die Nullstellen sind <Formel tex="0" /> und <Formel tex="2" nach="," /> beide liegen am Rand. Zwischen ihnen ist <Formel tex="f" /> negativ, es gibt keinen Vorzeichenwechsel im Inneren. Die Ableitung <Formel tex={t`f'(x)=2x-2`} /> ist nur für <Formel tex="x<1" /> negativ. Keine der drei Eigenschaften gilt, das ist Region H.
          <FlaechenFigur daten={BILD_B3} unter={<>Das Schaubild liegt zwischen den Nullstellen unterhalb der x-Achse, die Fläche hat den Wert <Formel tex={t`-\frac{4}{3}`} nach="." /></>} />
        </>
      }
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=x^2-2x`} /> auf <Formel tex="[0;\,2]" nach="." /> In welche Region von Diagramm 2 gehört <Formel tex="f" nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Region G mit einem Parameter"
      felder={[
        { id: 'kmin', name: 'untere Grenze von k', beschriftung: <>untere Grenze für <Formel tex="k" /></>, erwartet: A4.kMin, toleranz: TOL },
        { id: 'kmax', name: 'obere Grenze von k', beschriftung: <>obere Grenze für <Formel tex="k" /></>, erwartet: A4.kMax, toleranz: TOL },
      ]}
      hilfen={[
        <>Für Region G müssen alle drei Eigenschaften gelten. Untersuche jede einzeln in Abhängigkeit von <Formel tex="k" nach="." /></>,
        <>Das Integral ist <Formel tex={t`\int_{0}^{2}(3-kx)\,\mathrm{d}x=6-2k`} nach="." /> Die Nullstelle ist <Formel tex={t`x=\frac{3}{k}`} nach="." /></>,
        <>Die Nullstelle muss in <Formel tex="]0;\,2[" /> liegen. Die Ableitung ist <Formel tex={t`f_k'(x)=-k`} nach="." /></>,
      ]}
      loesung={[
        <>
          P: Das Integral <Formel tex={t`6-2k`} /> ist positiv für <Formel tex="k<3" nach="." />
        </>,
        <>
          W: Die Nullstelle <Formel tex={t`x=\frac{3}{k}`} /> liegt für <Formel tex="k>0" /> rechts von 0. Sie liegt in <Formel tex="]0;\,2[" nach="," /> wenn <Formel tex={t`\frac{3}{k}<2`} /> gilt, also für <Formel tex={t`k>\frac{3}{2}`} nach="." />
        </>,
        <>
          M: Die Ableitung <Formel tex={t`f_k'(x)=-k`} /> ist negativ für <Formel tex="k>0" nach="," /> was durch <Formel tex={t`k>\frac{3}{2}`} /> schon gilt.
          <Formel anzeige tex={t`\frac{3}{2}<k<3`} nach="." />
          Für Werte in diesem Bereich liegt <Formel tex="f_k" /> in Region G, zum Beispiel für <Formel tex="k=2" nach="." />
          <FlaechenFigur daten={BILD_A4} unter={<>Das Schaubild für <Formel tex="k=2" nach=":" /> Die Nullstelle bei 1,5 liegt im Inneren, das Integral ist 2.</>} />
        </>,
      ]}
    >
      <p>
        Für <Formel tex="k>0" /> ist <Formel tex={t`f_k(x)=3-kx`} /> auf <Formel tex="[0;\,2]" /> gegeben. Bestimmen Sie die Zahlen, zwischen denen <Formel tex="k" /> liegen muss, damit <Formel tex={t`f_k`} /> in Region G von Diagramm 2 liegt.
      </p>
      <Kontrollschaubild>
        <FlaechenFigur daten={BILD_A4} unter={<>Das Schaubild von <Formel tex={t`f_k`} /> für <Formel tex="k=2" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

const quadrat3 = () => A4.f(2);

function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <Hinweis art="merksatz">
        <p>
          Ein <strong>Integral</strong> ist eine Flächenbilanz: Stücke oberhalb der x-Achse zählen positiv, Stücke darunter negativ. Der <strong>Flächeninhalt</strong> zählt alle Stücke positiv. Deshalb sagt ein Integralwert über die Funktion nur wenig aus:
        </p>
        <ul>
          <li>Das Integral 0 heißt nicht, dass die Funktion 0 ist oder dass keine Fläche da ist. Es heißt, dass sich die Stücke aufheben.</li>
          <li>Ein positives Integral heißt nicht, dass die Funktion positiv ist oder steigt. Es heißt nur, dass die positiven Stücke überwiegen.</li>
          <li>Eine Funktion kann streng steigen und das Integral 0 haben, zum Beispiel <Formel tex="f(x)=x" /> auf <Formel tex="[-2;\,2]" nach="." /></li>
        </ul>
      </Hinweis>

      <h3>Ungerade Funktionen und symmetrische Intervalle</h3>
      <p>
        Eine Funktion mit <Formel tex={t`f(-x)=-f(x)`} /> heißt <strong>ungerade</strong>, ihr Schaubild ist punktsymmetrisch zum Ursprung. Über ein Intervall <Formel tex="[-a;\,a]" /> heben sich die beiden Hälften auf, das Integral ist 0. Das erklärt, warum in Diagramm 1 die Regionen B und E leer bleiben.
      </p>
      <p>Beispiel <Formel tex={t`f(x)=x^3-3x`} /> auf <Formel tex="[-2;\,2]" nach=":" /></p>
      <ol>
        <li>
          <strong>Stammfunktion.</strong> <Formel tex={t`F(x)=\frac{1}{4}x^4-\frac{3}{2}x^2`} nach="." /> Es ist <Formel tex={t`F(2)=4-6=-2`} /> und <Formel tex={t`F(-2)=4-6=-2`} nach="." />
        </li>
        <li>
          <strong>Integral.</strong> <Formel tex={t`F(2)-F(-2)=-2-(-2)=0`} nach="." />
        </li>
        <li>
          <strong>Teilintegrale.</strong> Von 0 bis 2 ist <Formel tex={t`F(2)-F(0)=-2`} nach="," /> von <Formel tex="-2" /> bis 0 ist <Formel tex={t`F(0)-F(-2)=0-(-2)=2`} nach="." /> Die Summe ist 0, der Flächeninhalt ist <Formel tex={t`|2|+|-2|=4`} nach="." />
        </li>
      </ol>
      <FlaechenFigur daten={BILD_ZP} unter={<>Die Stücke haben die Werte <Formel tex="+2" /> und <Formel tex="-2" nach="." /> Das Integral ist 0, der Flächeninhalt 4.</>} />

      <h3>Wie du bei einer Aufgabe mit Venn-Diagramm vorgehst</h3>
      <ul>
        <li>Prüfe jede Eigenschaft einzeln und schreibe das Ergebnis mit Begründung auf. Eine Eigenschaft gilt nur, wenn sie für das ganze Intervall gilt.</li>
        <li>Frage bei einer leeren Region, ob eine Eigenschaft eine andere erzwingt (hier: Punktsymmetrie erzwingt das Integral 0).</li>
        <li>Prüfe Beispiele bei jeder Eigenschaft mit Zahlen: ein Gegenbeispiel genügt, um eine Eigenschaft zu widerlegen.</li>
        <li>Beachte die Ränder: Eine Nullstelle am Rand des Intervalls ist kein Vorzeichenwechsel im Inneren.</li>
      </ul>

      <h3>Typische Fehler</h3>
      <ul>
        <li>Integral 0 und Flächeninhalt 0 verwechseln.</li>
        <li>Aus einem positiven Integral auf eine steigende oder positive Funktion schließen.</li>
        <li>Eine Eigenschaft nur an einer Stelle prüfen, obwohl sie auf dem ganzen Intervall gelten muss.</li>
        <li>Die Monotonie nur an einer Stelle prüfen. Das Vorzeichen der Ableitung muss auf dem ganzen Intervall passen. Eine einzelne Stelle mit <Formel tex={t`f'(x)=0`} /> stört nicht, ein ganzes Stück mit <Formel tex={t`f'(x)=0`} /> schon.</li>
      </ul>
      <p>
        Die Regionen und ihre Eigenschaften der beiden Diagramme zum Nachschlagen:
      </p>
      <dl className="eigenschaften">
        {REGIONEN.map((r) => (
          <div key={r}>
            <dt>Region {r}</dt>
            <dd>
              Diagramm 1: {regionText(r, NAMEN1)}. Diagramm 2: {regionText(r, NAMEN2)}.
            </dd>
          </div>
        ))}
      </dl>
    </Abschnitt>
  );
}

export default function Modul() {
  return (
    <>
      <Vorgehen />
      <Diagramm1 />
      <Diagramm2 />
      <Zusammenfassung />
    </>
  );
}
