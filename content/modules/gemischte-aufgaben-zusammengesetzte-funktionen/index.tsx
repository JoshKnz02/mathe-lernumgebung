import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { AufKlick } from '@/components/AufKlick';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage, type Option } from '@/components/Auswahlfrage';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Funktionsgraph, type Kurve } from '@/components/Funktionsgraph';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { BEISPIELE, BLAU, ORANGE, REGIONEN, SCHWARZ, TOL2, W1, W2, W3, ZUORDNUNGEN, type Region } from './daten';
import { Pruefer } from './Pruefer';
import { VennBild } from './VennBild';

const t = String.raw;
const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });
const dez = (v: number) => String(v).replace('.', '{,}');

/** Beschreibung der Regionen für Antworten und Tabellen. */
const REGION_TEXT: Record<Region, string> = {
  A: 'nur umkehrbar',
  B: 'nur achsensymmetrisch',
  C: 'nur verkettet',
  D: 'umkehrbar und achsensymmetrisch',
  E: 'achsensymmetrisch und verkettet',
  F: 'umkehrbar und verkettet',
  G: 'umkehrbar, achsensymmetrisch und verkettet',
  H: 'keine der drei Eigenschaften',
};

/** Setzt die richtige Antwort an die Stelle k (0 = erste), damit sie nicht immer oben steht. */
function platziere(optionen: Option[], k: number): Option[] {
  const i = optionen.findIndex((o) => o.richtig);
  const rest = optionen.filter((_, j) => j !== i);
  return [...rest.slice(0, k), optionen[i]!, ...rest.slice(k)];
}

/** Umkehrfunktion einer streng steigenden Funktion durch Bisektion, für das Schaubild. */
function umkehrung(f: (x: number) => number): (y: number) => number {
  return (y) => {
    let lo = -20;
    let hi = 20;
    for (let i = 0; i < 80; i++) {
      const m = (lo + hi) / 2;
      if (f(m) < y) lo = m;
      else hi = m;
    }
    return (lo + hi) / 2;
  };
}

function Bild({ kurven, bereich, teilung = 1, yTeilung, beschreibung, unter, klasse = 'brett-3zu2' }: { kurven: Kurve[]; bereich: [number, number, number, number]; teilung?: number; yTeilung?: number; beschreibung: string; unter: ReactNode; klasse?: string }) {
  return (
    <figure className="bild">
      <Funktionsgraph kurven={kurven} bereich={bereich} xTeilung={teilung} yTeilung={yTeilung ?? teilung} xBeschriftung="zahl" className={klasse} beschreibung={beschreibung} />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

const Kontrollschaubild = ({ children }: { children: ReactNode }) => (
  <AufKlick einblenden="Schaubild zur Kontrolle einblenden" ausblenden="Schaubild ausblenden">
    {children}
  </AufKlick>
);

const beispiel = (id: string) => BEISPIELE.find((b) => b.id === id)!;

/** Schaubild eines Beispiels mit der waagerechten Geraden. */
function BeispielBild({ id, unter }: { id: string; unter: ReactNode }) {
  const b = beispiel(id);
  return (
    <Bild
      kurven={[{ f: b.f, farbe: ORANGE }, { f: () => b.c, farbe: SCHWARZ, gestrichelt: true }]}
      bereich={b.bereich}
      teilung={b.teilung}
      yTeilung={b.yTeilung}
      beschreibung={b.beschreibung}
      unter={unter}
    />
  );
}

const LEGENDE = 'Blau: umkehrbar (U), orange gestrichelt: achsensymmetrisch (S), grün gepunktet: verkettet (V).';

/* ---------- Abschnitt Vorgehen ---------- */

function Vorgehen() {
  return (
    <Abschnitt id="vorgehen" titel="Vorgehen">
      <h3>Problemlösen statt Rechenschema</h3>
      <p>
        Bei den Aufgaben in diesem Modul gibt es keinen festen Rechenweg. Du suchst Funktionen mit vorgegebenen Eigenschaften, ordnest Funktionen ein und begründest deine Entscheidung. Dabei brauchst du alles aus den drei Modulen zu den zusammengesetzten Funktionen: <Modulverweis modul="summe-produkt-funktionen">Summe, Differenz und Produkt</Modulverweis>, <Modulverweis modul="verkettung">Verkettung</Modulverweis> und <Modulverweis modul="umkehrfunktion">Umkehrfunktion</Modulverweis>.
      </p>

      <h3>So gehst du vor</h3>
      <ol className="liste">
        <li><strong>Eigenschaften klären.</strong> Schreibe auf, was für die gesuchte Funktion gelten muss und was nicht gelten darf.</li>
        <li><strong>Beispiel suchen.</strong> Probiere Funktionen, die du kennst, und prüfe jede Eigenschaft einzeln.</li>
        <li><strong>Umgekehrt probieren.</strong> Wenn dir nichts einfällt, wähle irgendeine Funktion und überlege, zu welcher Region sie gehört. Irgendwo passt jede Funktion hin.</li>
        <li><strong>Skizzieren.</strong> Ein Schaubild zeigt oft sofort, ob eine Eigenschaft gilt.</li>
        <li><strong>Begründen.</strong> Eine Region kann auch leer bleiben. Dann musst du begründen, warum es keine solche Funktion gibt.</li>
      </ol>

      <h3>Die drei Eigenschaften</h3>
      <p>In der Aufgabe im nächsten Abschnitt geht es um diese drei Eigenschaften. Die Bedeutung ist hier festgelegt, damit die Einteilung eindeutig ist.</p>
      <dl className="eigenschaften">
        <div>
          <dt>umkehrbar (U)</dt>
          <dd><Formel tex="f" /> ist auf dem gesamten Definitionsbereich umkehrbar. Test: Jede waagerechte Gerade schneidet <Formel tex="K_f" /> höchstens einmal. Eine streng monotone Funktion ist umkehrbar.</dd>
        </div>
        <div>
          <dt>achsensymmetrisch (S)</dt>
          <dd><Formel tex="K_f" /> ist symmetrisch zur y-Achse. Test: Für jedes <Formel tex="x" /> im Definitionsbereich gilt <Formel tex="f(-x)=f(x)" nach="." /></dd>
        </div>
        <div>
          <dt>verkettet (V)</dt>
          <dd>Der Term ist als Verkettung <Formel tex="u(v(x))" /> gegeben, die innere Funktion <Formel tex="v" /> ist nicht linear. Test: Es gibt eine innere und eine äußere Funktion, zum Beispiel <Formel tex="e^{x^3}" /> mit <Formel tex="v(x)=x^3" /> und <Formel tex="u(z)=e^z" nach="." /></dd>
        </div>
      </dl>
      <Hinweis titel="Was nicht als Verkettung zählt">
        Grundfunktionen wie <Formel tex="x^2" nach="," /> <Formel tex="e^x" /> oder <Formel tex={t`\sin x`} /> werden auf <Formel tex="x" /> selbst angewendet und zählen hier nicht als Verkettung. Auch eine lineare innere Funktion wie bei <Formel tex="e^{2x+1}" /> zählt nicht. Summen und Produkte wie <Formel tex="x^3-x" /> sind keine Verkettung.
      </Hinweis>
    </Abschnitt>
  );
}

/* ---------- Abschnitt Venn-Diagramm ---------- */

function Zuordnung({ nr }: { nr: number }) {
  const z = ZUORDNUNGEN[nr]!;
  const falsch = {
    V1: ['B', 'D', 'F'],
    V2: ['B', 'C', 'F'],
    V3: ['A', 'B', 'C'],
    V4: ['A', 'C', 'E'],
  }[z.nummer as 'V1']!;
  const rueck: Record<string, Record<string, ReactNode>> = {
    V1: {
      B: <>Achsensymmetrisch wäre <Formel tex="K_f" /> nur, wenn <Formel tex="f(-x)=f(x)" /> gilt. Hier ist <Formel tex="f(-1)=-2" /> und <Formel tex="f(1)=2" nach="." /></>,
      D: <>Diese Region ist leer: Eine achsensymmetrische Funktion nimmt jeden Wert zweimal an und ist nicht umkehrbar.</>,
      F: <>Dafür müsste der Term eine Verkettung mit nichtlinearer innerer Funktion sein. Hier ist es eine Summe von Potenzfunktionen.</>,
    },
    V2: {
      B: <>Die Funktion ist achsensymmetrisch, aber auch verkettet: Die Wurzelfunktion wird auf <Formel tex="x^2+1" /> angewendet.</>,
      C: <>Die Funktion ist verkettet, aber auch achsensymmetrisch: <Formel tex="f(-x)=f(x)" nach="." /></>,
      F: <>Umkehrbar ist sie nicht: <Formel tex={t`f(-1)=f(1)=\sqrt{2}`} nach="." /></>,
    },
    V3: {
      A: <>Umkehrbar ist die Funktion nicht: <Formel tex="f(0)=f(4)=0" nach="." /></>,
      B: <>Die Parabel ist symmetrisch zur Geraden <Formel tex="x=2" nach="," /> nicht zur y-Achse. Es ist <Formel tex="f(-1)=5" /> und <Formel tex="f(1)=-3" nach="." /></>,
      C: <>Der Term ist eine Differenz von Potenzfunktionen und keine Verkettung.</>,
    },
    V4: {
      A: <>Der Term ist eine Verkettung: <Formel tex="v(x)=x^3+x" nach="," /> <Formel tex="u(z)=e^z" nach="." /> Die Region A enthält nur Funktionen ohne Verkettung.</>,
      C: <>Die Funktion ist verkettet, aber auch umkehrbar: Die innere Funktion steigt streng und die äußere ebenfalls.</>,
      E: <>Achsensymmetrisch ist sie nicht: <Formel tex={t`f(-1)=e^{-2}`} /> und <Formel tex={t`f(1)=e^{2}`} nach="." /></>,
    },
  };
  const optionen = [
    opt(z.region, <>Region {z.region} ({REGION_TEXT[z.region]})</>, true, <>Richtig.</>),
    ...falsch.map((r) => opt(r, <>Region {r} ({REGION_TEXT[r as Region]})</>, false, rueck[z.nummer]![r])),
  ];
  const stellen = [2, 0, 3, 1];
  const erklaerung: Record<string, ReactNode> = {
    V1: <>Die Funktion steigt überall streng und ist deshalb umkehrbar. Sie ist punktsymmetrisch, aber nicht achsensymmetrisch. Der Term ist keine Verkettung.</>,
    V2: <>Es gilt <Formel tex={t`f(-x)=\sqrt{(-x)^2+1}=f(x)`} nach="." /> Damit ist <Formel tex="K_f" /> achsensymmetrisch und <Formel tex="f" /> nicht umkehrbar. Innere Funktion <Formel tex="v(x)=x^2+1" nach="," /> äußere Funktion <Formel tex={t`u(z)=\sqrt{z}`} nach="." /></>,
    V3: <>Die Parabel nimmt Werte zweimal an, ist also nicht umkehrbar. Sie ist symmetrisch zur Geraden <Formel tex="x=2" nach="," /> nicht zur y-Achse, und der Term ist keine Verkettung.</>,
    V4: <>Die innere Funktion <Formel tex="x^3+x" /> und die äußere <Formel tex="e^z" /> steigen streng, damit steigt auch die Verkettung streng. Sie ist nicht achsensymmetrisch.</>,
  };
  const bild: Record<string, ReactNode> = {
    V1: <Bild kurven={[{ f: z.f, farbe: ORANGE }, { f: () => 2, farbe: SCHWARZ, gestrichelt: true }]} bereich={[-2, 2, -6, 6]} yTeilung={2} beschreibung="Schaubild von x hoch 5 plus x. Es steigt überall. Die waagerechte Gerade y gleich 2 schneidet es genau einmal bei x gleich 1." unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="y=2" nach="." /> Die Gerade schneidet einmal.</>} />,
    V2: <Bild kurven={[{ f: z.f, farbe: ORANGE }, { f: () => 2, farbe: SCHWARZ, gestrichelt: true }]} bereich={[-3, 3, -1, 5]} beschreibung="Schaubild von Wurzel aus x² plus 1. Es ist symmetrisch zur y-Achse und hat bei x gleich 0 den tiefsten Punkt mit dem Wert 1. Die Gerade y gleich 2 schneidet es bei etwa x gleich minus 1,73 und x gleich 1,73." unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="y=2" nach="." /> Die Gerade schneidet zweimal.</>} />,
    V3: <Bild kurven={[{ f: z.f, farbe: ORANGE }, { f: () => 0, farbe: SCHWARZ, gestrichelt: true }]} bereich={[-2, 6, -5, 8]} beschreibung="Schaubild von x² minus 4x. Es ist eine nach oben geöffnete Parabel mit dem Tiefpunkt bei x gleich 2 und dem Wert minus 4. Sie schneidet die x-Achse bei x gleich 0 und x gleich 4." unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="y=0" nach="." /> Zwei Schnittpunkte, die Symmetrieachse ist <Formel tex="x=2" nach="." /></>} />,
    V4: <Bild kurven={[{ f: z.f, farbe: ORANGE }, { f: () => 2, farbe: SCHWARZ, gestrichelt: true }]} bereich={[-3, 2, -1, 8]} beschreibung="Schaubild von e hoch (x³ plus x). Links liegt es nahe an der x-Achse, rechts steigt es sehr steil. Die waagerechte Gerade y gleich 2 schneidet es genau einmal." unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="y=2" nach="." /> Die Gerade schneidet einmal.</>} />,
  };
  return (
    <Auswahlfrage
      nummer={z.nummer}
      titel="Funktion einordnen"
      optionen={platziere(optionen, stellen[nr]!)}
      erklaerung={
        <>
          <p>{erklaerung[z.nummer]}</p>
          {bild[z.nummer]}
          <figure className="bild">
            <VennBild markiert={z.region} />
            <figcaption>Region {z.region}. {LEGENDE}</figcaption>
          </figure>
        </>
      }
    >
      <p>
        In welche Region des Venn-Diagramms gehört <Formel tex={`f(x)=${z.tex}`} nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function LeereRegionen() {
  const optionen = [
    opt('dg', <>Die Regionen D und G bleiben leer. Eine achsensymmetrische Funktion nimmt jeden Wert zweimal an und ist deshalb nicht umkehrbar.</>, true, <>Richtig.</>),
    opt('g', <>Nur die Region G bleibt leer, weil es keine Funktion gibt, die alle drei Eigenschaften hat.</>, false, <>Auch D ist leer: Der Grund liegt schon bei den beiden Eigenschaften umkehrbar und achsensymmetrisch. Die Verkettung spielt keine Rolle.</>),
    opt('keine', <>Keine Region bleibt leer, man muss nur lange genug suchen.</>, false, <>Suchen hilft hier nicht. Für D und G lässt sich zeigen, dass es keine Funktion gibt.</>),
    opt('h', <>Die Region H bleibt leer, weil jede Funktion mindestens eine der drei Eigenschaften hat.</>, false, <>Die Funktion <Formel tex="x^3-x" /> hat keine der drei Eigenschaften und gehört in Region H.</>),
  ];
  return (
    <Auswahlfrage
      nummer="V5"
      titel="Leere Regionen begründen"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            Ist <Formel tex="K_f" /> achsensymmetrisch, dann gilt <Formel tex="f(-a)=f(a)" /> für jede Zahl <Formel tex="a" nach="." /> Für <Formel tex={t`a\ne 0`} /> sind <Formel tex="-a" /> und <Formel tex="a" /> zwei verschiedene Stellen mit demselben Funktionswert. Eine waagerechte Gerade schneidet <Formel tex="K_f" /> dann zweimal, und <Formel tex="f" /> ist nicht umkehrbar. Ob <Formel tex="f" /> verkettet ist, ändert daran nichts, also sind D und G beide leer.
          </p>
          <BeispielBild id="quadrat" unter={<>Beispiel <Formel tex="f(x)=x^2" nach=":" /> Die Gerade <Formel tex="y=4" /> schneidet <Formel tex="K_f" /> bei <Formel tex="-2" /> und <Formel tex="2" nach="." /></>} />
        </>
      }
    >
      <p>Welche Aussage über die Regionen des Venn-Diagramms stimmt?</p>
    </Auswahlfrage>
  );
}

function VennBereich() {
  return (
    <Abschnitt id="venn" titel="Venn-Diagramm">
      <h3>Aufgabe</h3>
      <p>
        Das Venn-Diagramm unterscheidet drei Eigenschaften einer Funktion <Formel tex="f" nach=":" /> umkehrbar (U), achsensymmetrisch (S) und verkettet (V). Gib für jede der acht Regionen A bis H eine Funktion an, die genau die Eigenschaften dieser Region hat. Ist eine Region nicht zu füllen, begründe, warum es dort keine Funktion gibt.
      </p>
      <figure className="bild">
        <VennBild />
        <figcaption>{LEGENDE} Region H liegt außerhalb aller Kreise.</figcaption>
      </figure>
      <table className="tabelle tabelle-kompakt">
        <caption>Eigenschaften der acht Regionen</caption>
        <tbody>
          {REGIONEN.map((r) => (
            <tr key={r}>
              <th scope="row">{r}</th>
              <td>{REGION_TEXT[r]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du den Prüfer benutzt. Notiere deine Vermutungen.</p>
      <ol className="auftraege">
        <li>
          <p>
            Die Funktion <Formel tex="f(x)=x^2" /> ist achsensymmetrisch, aber auf ganz <Formel tex="\mathbb{R}" /> nicht umkehrbar. Gilt das für jede achsensymmetrische Funktion? Was bedeutet das für die Regionen D und G?
          </p>
          <Beobachtung bild={<BeispielBild id="quadrat" unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="y=4" nach="." /> Die Stellen <Formel tex="-2" /> und <Formel tex="2" /> haben denselben Funktionswert.</>} />}>
            Bei Achsensymmetrie gilt <Formel tex="f(-a)=f(a)" nach="." /> Jeder Wert tritt also an zwei Stellen auf, außer bei <Formel tex="a=0" nach="." /> Eine waagerechte Gerade schneidet <Formel tex="K_f" /> dann zweimal. Das gilt für jede achsensymmetrische Funktion, deren Definitionsbereich mehr als die Zahl 0 enthält. Es gibt also keine umkehrbare achsensymmetrische Funktion. Die Regionen D und G bleiben leer.
          </Beobachtung>
        </li>
        <li>
          <p>
            Für Region F suchst du eine umkehrbare, verkettete, nicht achsensymmetrische Funktion. Wie kannst du aus einer umkehrbaren Funktion wie <Formel tex="e^z" /> eine verkettete machen, die umkehrbar bleibt?
          </p>
          <Beobachtung bild={<BeispielBild id="exp-kubik" unter={<>Orange: <Formel tex="K_f" /> von <Formel tex="e^{x^3}" nach="," /> schwarz gestrichelt: <Formel tex="y=2" nach="." /> Die Gerade schneidet einmal.</>} />}>
            Setze eine streng steigende innere Funktion ein, zum Beispiel <Formel tex="v(x)=x^3" nach="." /> Dann steigt <Formel tex="e^{x^3}" /> streng und ist umkehrbar. Eine innere Funktion wie <Formel tex="x^2" /> würde dagegen die Umkehrbarkeit zerstören.
          </Beobachtung>
        </li>
      </ol>

      <h3>Prüfer</h3>
      <p>
        Wähle eine Funktion. Der Prüfer zeigt <Formel tex="K_f" /> mit einer waagerechten Geraden, prüft die drei Eigenschaften und markiert die Region im Venn-Diagramm.
      </p>
      <Pruefer />

      <h3>Funktionen einordnen</h3>
      <p>Ordne die Funktionen einer Region zu. Prüfe die drei Eigenschaften nacheinander.</p>
      <Zuordnung nr={0} />
      <Zuordnung nr={1} />
      <Zuordnung nr={2} />
      <Zuordnung nr={3} />

      <h3>Leere Regionen</h3>
      <LeereRegionen />

      <h3>Zum Weiterdenken</h3>
      <ol className="auftraege">
        <li>
          <p>Finde für Region A ein möglichst einfaches Beispiel und ein überraschendes Beispiel, bei dem das Schaubild auf den ersten Blick nicht umkehrbar aussieht.</p>
          <Beobachtung
            bild={
              <Bild
                kurven={[{ f: (x) => x + Math.sin(x), farbe: ORANGE }, { f: () => 3, farbe: SCHWARZ, gestrichelt: true }]}
                bereich={[-6, 6, -6, 6]}
                teilung={2}
                beschreibung="Schaubild von x plus Sinus von x. Es steigt insgesamt und hat Stellen, an denen es waagerecht verläuft, fällt aber nie. Die waagerechte Gerade y gleich 3 schneidet es genau einmal."
                unter={<>Orange: <Formel tex="K_f" /> von <Formel tex={t`x+\sin x`} nach="," /> schwarz gestrichelt: <Formel tex="y=3" nach="." /> Die Gerade schneidet einmal.</>}
              />
            }
          >
            Einfach ist <Formel tex="f(x)=2x" /> oder <Formel tex="f(x)=x^3" nach="." /> Überraschend ist <Formel tex={t`f(x)=x+\sin x`} nach=":" /> Das Schaubild wellt sich, fällt aber nie, denn die Steigung <Formel tex={t`1+\cos x`} /> ist nie negativ. Jede waagerechte Gerade schneidet einmal.
          </Beobachtung>
        </li>
        <li>
          <p>Die Funktion <Formel tex="x^3-x" /> hat ein punktsymmetrisches Schaubild und gehört trotzdem in Region H. Warum hilft Punktsymmetrie nicht bei der Umkehrbarkeit?</p>
          <Beobachtung bild={<BeispielBild id="kubik-minus-x" unter={<>Orange: <Formel tex="K_f" /> von <Formel tex="x^3-x" nach="," /> schwarz gestrichelt: <Formel tex="y=0" nach="." /> Die Gerade schneidet dreimal.</>} />}>
            Punktsymmetrie sagt nur <Formel tex="f(-x)=-f(x)" nach="." /> Sie schließt nicht aus, dass ein Wert mehrfach vorkommt. Bei <Formel tex="x^3-x" /> ist <Formel tex="f(-1)=f(0)=f(1)=0" nach="." /> Anders als die Achsensymmetrie verbietet die Punktsymmetrie die Umkehrbarkeit also nicht, sie garantiert sie aber auch nicht.
          </Beobachtung>
        </li>
      </ol>
    </Abschnitt>
  );
}

/* ---------- Abschnitt Weitere Aufgaben ---------- */

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>0,87</code>), als Bruch (zum Beispiel <Formel tex={t`\frac{1}{3}`} nach="," /> getippt als <code>1/3</code>) oder als Vielfaches von <Formel tex="\pi" /> (<code>pi/6</code>) ein, ohne Einheit. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert.
    </Hinweis>
  );
}

function Aufgabe1() {
  const hinv = W1.hinv;
  return (
    <Aufgabe
      nummer="W1"
      titel="Verkettung und Umkehrfunktion"
      felder={[
        { id: 'a', name: 'untere Grenze des Wertebereichs von h', beschriftung: <>untere Grenze von <Formel tex="W_h" /></>, erwartet: W1.untereGrenze },
        { id: 'b', name: 'h hoch minus 1 von 1', beschriftung: <Formel tex={t`h^{-1}(1)`} />, erwartet: W1.von1 },
        { id: 'c', name: 'h hoch minus 1 von 0', beschriftung: <Formel tex={t`h^{-1}(0)`} />, erwartet: W1.von0 },
      ]}
      hilfen={[
        <>Die Funktion ist die Verkettung der Wurzelfunktion mit <Formel tex="x+3" nach="," /> danach wird 1 abgezogen. Die Wurzel ist nie negativ.</>,
        <>Zum Term der Umkehrfunktion: <Formel tex={t`y=\sqrt{x+3}-1`} /> nach <Formel tex="x" /> auflösen, dann <Formel tex="x" /> und <Formel tex="y" /> vertauschen.</>,
        <>Aus <Formel tex={t`y+1=\sqrt{x+3}`} /> folgt durch Quadrieren <Formel tex="(y+1)^2=x+3" nach="." /></>,
      ]}
      loesung={[
        <>Die Wurzel ist mindestens 0, also ist <Formel tex={t`h(x)\ge -1`} nach="." /> Der Wertebereich ist <Formel tex="W_h=[-1;\,\infty[" nach="." /> Die untere Grenze ist <Formel tex="-1" nach="." /></>,
        <>Auflösen: <Formel tex={t`y=\sqrt{x+3}-1`} /> ergibt <Formel tex="x=(y+1)^2-3" nach="." /> Vertauschen von <Formel tex="x" /> und <Formel tex="y" /> gibt <Formel tex={t`h^{-1}(x)=(x+1)^2-3`} nach="." /> Der Definitionsbereich ist <Formel tex="D_{h^{-1}}=W_h=[-1;\,\infty[" nach="." /></>,
        <>Einsetzen: <Formel tex={t`h^{-1}(1)=(1+1)^2-3=1`} nach="," /> <Formel tex={t`h^{-1}(0)=(0+1)^2-3=-2`} nach="." /> Probe: <Formel tex={t`h(1)=\sqrt{4}-1=1`} /> und <Formel tex={t`h(-2)=\sqrt{1}-1=0`} nach="." />
          <Bild
            kurven={[{ f: W1.h, farbe: ORANGE }, { f: hinv, farbe: BLAU }, { f: (x) => x, farbe: SCHWARZ, gestrichelt: true }]}
            bereich={[-4, 6, -4, 6]}
            beschreibung="Schaubild von h(x) gleich Wurzel aus x plus 3 minus 1 ab x gleich minus 3, sein Spiegelbild, die Umkehrfunktion (x plus 1)² minus 3 ab x gleich minus 1, und die Gerade y gleich x. Die Punkte (1 | 1) und (0 | minus 2) liegen auf dem Spiegelbild, die Punkte (1 | 1) und (minus 2 | 0) auf dem Schaubild von h."
            klasse="brett-quadrat"
            unter={<>Orange: <Formel tex="K_h" nach="," /> blau: <Formel tex={t`K_{h^{-1}}`} nach="," /> schwarz gestrichelt: <Formel tex="y=x" nach="." /> Aus <Formel tex="h(-2)=0" /> wird <Formel tex={t`h^{-1}(0)=-2`} nach="." /></>}
          />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`h(x)=\sqrt{x+3}-1`} /> mit <Formel tex="D_h=[-3;\,\infty[" nach="." /> Bestimme die untere Grenze des Wertebereichs, den Term der Umkehrfunktion <Formel tex={t`h^{-1}`} /> und die Werte <Formel tex={t`h^{-1}(1)`} /> und <Formel tex={t`h^{-1}(0)`} nach="." />
      </p>
      <Kontrollschaubild>
        <Bild
          kurven={[{ f: W1.h, farbe: ORANGE }]}
          bereich={[-4, 6, -4, 6]}
          beschreibung="Schaubild von h(x) gleich Wurzel aus x plus 3 minus 1. Es beginnt bei x gleich minus 3 mit dem Wert minus 1 und steigt langsam an."
          klasse="brett-quadrat"
          unter={<>Orange: <Formel tex="K_h" nach="." /> Es beginnt bei <Formel tex="x=-3" nach="." /></>}
        />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe2() {
  return (
    <Aufgabe
      nummer="W2"
      titel="Produkt, Symmetrie und Asymptote"
      felder={[
        { id: 'a', name: 'f von minus 1, auf zwei Stellen gerundet', beschriftung: <><Formel tex="f(-1)" /> (auf zwei Stellen gerundet)</>, erwartet: W2.vonMinus1, toleranz: TOL2 },
        { id: 'b', name: 'Gleichung der Asymptote y gleich c, Wert von c', beschriftung: <><Formel tex="c" /> in <Formel tex="y=c" /></>, erwartet: W2.asymptote },
        { id: 'c', name: 'Anzahl der Nullstellen', beschriftung: <>Anzahl der Nullstellen</>, erwartet: W2.nullstellen },
      ]}
      hilfen={[
        <>Der Term ist ein Produkt aus <Formel tex="x" /> und <Formel tex="e^{-x^2}" nach="." /> Setze <Formel tex="x=-1" /> ein und runde auf zwei Stellen.</>,
        <>Für große <Formel tex={t`|x|`} /> wird <Formel tex="e^{-x^2}" /> sehr klein und zieht das Produkt gegen 0, obwohl <Formel tex="x" /> wächst.</>,
        <>Ein Produkt ist 0, wenn ein Faktor 0 ist. Kann <Formel tex="e^{-x^2}" /> gleich 0 sein?</>,
      ]}
      loesung={[
        <><Formel tex={t`f(-1)=-1\cdot e^{-1}\approx -0{,}37`} nach="." /> Wegen <Formel tex="f(-x)=-f(x)" /> ist <Formel tex="K_f" /> punktsymmetrisch zum Ursprung, denn <Formel tex="x" /> ist punktsymmetrisch und <Formel tex="e^{-x^2}" /> achsensymmetrisch.</>,
        <>Für <Formel tex={t`x\to\pm\infty`} /> geht <Formel tex="e^{-x^2}" /> gegen 0 und dominiert den Faktor <Formel tex="x" nach="." /> Das Produkt geht gegen 0, die Asymptote ist die x-Achse <Formel tex="y=0" nach="." /></>,
        <>Weil <Formel tex="e^{-x^2}>0" /> für alle <Formel tex="x" nach="," /> ist das Produkt nur 0, wenn <Formel tex="x=0" nach="." /> Es gibt genau eine Nullstelle.
          <Bild
            kurven={[{ f: W2.f, farbe: ORANGE }]}
            bereich={[-3, 3, -1, 1]}
            yTeilung={0.5}
            beschreibung="Schaubild von x mal e hoch minus x². Es ist punktsymmetrisch zum Ursprung, hat einen Tiefpunkt bei etwa x gleich minus 0,71 und einen Hochpunkt bei etwa x gleich 0,71. Links und rechts nähert es sich der x-Achse. Die einzige Nullstelle ist x gleich 0."
            unter={<>Orange: <Formel tex="K_f" nach="." /> Die x-Achse ist die Asymptote, die einzige Nullstelle ist <Formel tex="x=0" nach="." /></>}
          />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex="f(x)=x\cdot e^{-x^2}" /> mit <Formel tex="D_f=\mathbb{R}" nach="." /> Bestimme <Formel tex="f(-1)" nach="," /> die Gleichung der waagerechten Asymptote <Formel tex="y=c" /> und die Anzahl der Nullstellen.
      </p>
      <Kontrollschaubild>
        <Bild
          kurven={[{ f: W2.f, farbe: ORANGE }]}
          bereich={[-3, 3, -1, 1]}
          yTeilung={0.5}
          beschreibung="Schaubild von x mal e hoch minus x². Es ist punktsymmetrisch zum Ursprung und nähert sich links und rechts der x-Achse."
          unter={<>Orange: <Formel tex="K_f" nach="." /></>}
        />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe3() {
  const inv = umkehrung(W3.f);
  const bild = (mitUmkehrung: boolean) => (
    <Bild
      kurven={[{ f: W3.f, farbe: ORANGE }, ...(mitUmkehrung ? [{ f: inv, farbe: BLAU }, { f: (x: number) => x, farbe: SCHWARZ, gestrichelt: true }] : [])]}
      bereich={[-3, 3, -3, 3]}
      klasse="brett-quadrat"
      beschreibung={
        mitUmkehrung
          ? 'Schaubild von x³ plus x, sein Spiegelbild an der Geraden y gleich x und die Gerade y gleich x. Der Punkt (1 | 2) liegt auf dem Schaubild, der Punkt (2 | 1) auf dem Spiegelbild.'
          : 'Schaubild von x³ plus x. Es steigt überall und geht durch den Ursprung und den Punkt (1 | 2).'
      }
      unter={
        mitUmkehrung ? (
          <>Orange: <Formel tex="K_f" nach="," /> blau: <Formel tex={t`K_{f^{-1}}`} nach="," /> schwarz gestrichelt: <Formel tex="y=x" nach="." /> Aus <Formel tex="f(1)=2" /> wird <Formel tex={t`f^{-1}(2)=1`} nach="." /></>
        ) : (
          <>Orange: <Formel tex="K_f" nach="." /></>
        )
      }
    />
  );
  return (
    <Aufgabe
      nummer="W3"
      titel="Umkehrwerte ohne Term"
      felder={[
        { id: 'a', name: 'f hoch minus 1 von 2', beschriftung: <Formel tex={t`f^{-1}(2)`} />, erwartet: W3.von2 },
        { id: 'b', name: 'f hoch minus 1 von 10', beschriftung: <Formel tex={t`f^{-1}(10)`} />, erwartet: W3.von10 },
        { id: 'c', name: 'f hoch minus 1 von minus 10', beschriftung: <Formel tex={t`f^{-1}(-10)`} />, erwartet: W3.vonMinus10 },
      ]}
      hilfen={[
        <>Der Term von <Formel tex={t`f^{-1}`} /> ist nicht nötig. <Formel tex={t`f^{-1}(2)=a`} /> bedeutet <Formel tex="f(a)=2" nach="." /></>,
        <>Probiere kleine ganze Zahlen für <Formel tex="a" /> aus und rechne <Formel tex="a^3+a" /> aus.</>,
        <>Für negative Werte: Das Schaubild ist punktsymmetrisch zum Ursprung, also gilt <Formel tex="f(-a)=-f(a)" nach="." /></>,
      ]}
      loesung={[
        <><Formel tex={t`f^{-1}(2)=a`} /> heißt <Formel tex="a^3+a=2" nach="." /> Für <Formel tex="a=1" /> ist <Formel tex="1+1=2" nach="." /> Also ist <Formel tex={t`f^{-1}(2)=1`} nach="." /></>,
        <>Für <Formel tex="a=2" /> ist <Formel tex="8+2=10" nach="." /> Also ist <Formel tex={t`f^{-1}(10)=2`} nach="." /></>,
        <>Wegen <Formel tex="f(-2)=-8-2=-10" /> ist <Formel tex={t`f^{-1}(-10)=-2`} nach="." /> Das passt zur Punktsymmetrie. {bild(true)}</>,
      ]}
    >
      <p>
        Die Funktion <Formel tex="f(x)=x^3+x" /> ist auf <Formel tex="\mathbb{R}" /> umkehrbar. Ihre Umkehrfunktion lässt sich nicht einfach als Term angeben. Bestimme trotzdem die Werte <Formel tex={t`f^{-1}(2)`} nach="," /> <Formel tex={t`f^{-1}(10)`} /> und <Formel tex={t`f^{-1}(-10)`} nach="." />
      </p>
      <Kontrollschaubild>{bild(false)}</Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage3b() {
  const optionen = [
    opt('monoton', <>Beide Summanden <Formel tex="x^3" /> und <Formel tex="x" /> steigen streng, also steigt auch die Summe streng und nimmt jeden Wert nur einmal an.</>, true, <>Richtig.</>),
    opt('aufloesen', <>Man kann <Formel tex="y=x^3+x" /> nach <Formel tex="x" /> auflösen.</>, false, <>Das Auflösen gelingt hier nicht mit einfachen Mitteln, und umkehrbar ist die Funktion trotzdem. Entscheidend ist, dass jeder Wert nur einmal vorkommt.</>),
    opt('punkt', <>Das Schaubild ist punktsymmetrisch zum Ursprung.</>, false, <>Punktsymmetrie reicht nicht. <Formel tex="x^3-x" /> ist auch punktsymmetrisch und nimmt den Wert 0 dreimal an.</>),
    opt('summe', <>Eine Summe mit <Formel tex="x^3" /> ist immer umkehrbar, weil <Formel tex="x^3" /> umkehrbar ist.</>, false, <>Das gilt nicht allgemein. Bei <Formel tex="x^3-x" /> fällt der zweite Summand und zerstört die Umkehrbarkeit.</>),
  ];
  return (
    <Auswahlfrage
      nummer="W3b"
      titel="Umkehrbarkeit begründen"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Sind beide Summanden streng steigend, so gilt für <Formel tex="a<b" /> sowohl <Formel tex="a^3<b^3" /> als auch <Formel tex="a<b" nach="," /> also <Formel tex="f(a)<f(b)" nach="." /> Eine streng monotone Funktion nimmt jeden Wert nur einmal an und ist umkehrbar.
          </p>
          <Bild
            kurven={[{ f: W3.f, farbe: ORANGE }, { f: () => 2, farbe: SCHWARZ, gestrichelt: true }]}
            bereich={[-3, 3, -4, 6]}
            beschreibung="Schaubild von x³ plus x. Es steigt überall. Die waagerechte Gerade y gleich 2 schneidet es genau einmal bei x gleich 1."
            unter={<>Orange: <Formel tex="K_f" nach="," /> schwarz gestrichelt: <Formel tex="y=2" nach="." /> Die Gerade schneidet einmal.</>}
          />
        </>
      }
    >
      <p>
        Warum ist <Formel tex="f(x)=x^3+x" /> auf <Formel tex="\mathbb{R}" /> umkehrbar?
      </p>
    </Auswahlfrage>
  );
}

function WeitereBereich() {
  return (
    <Abschnitt id="weitere" titel="Weitere Aufgaben">
      <p>Diese Aufgaben mischen Verknüpfung, Verkettung und Umkehrfunktion. Hilfen und Lösungsweg kannst du schrittweise aufdecken.</p>
      <Eingabehinweis />
      <Aufgabe1 />
      <Aufgabe2 />
      <Aufgabe3 />
      <Frage3b />
    </Abschnitt>
  );
}

/* ---------- Abschnitt Zusammenfassung ---------- */

const BEISPIEL_REGION: Record<Region, ReactNode> = {
  A: <Formel tex="x^3" />,
  B: <Formel tex="x^2" />,
  C: <Formel tex="e^{x^2-x}" />,
  D: <>leer</>,
  E: <Formel tex="e^{-x^2}" />,
  F: <Formel tex="e^{x^3}" />,
  G: <>leer</>,
  H: <Formel tex="x^3-x" />,
};

function Zusammenfassung() {
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Das Wichtigste</h3>
      <Hinweis art="merksatz" titel="Problemlösen mit Funktionseigenschaften">
        <ul className="liste">
          <li><strong>Vorgehen:</strong> Eigenschaften klären, Beispiel suchen, notfalls umgekehrt probieren, skizzieren, begründen.</li>
          <li>
            <strong>Achsensymmetrisch heißt nicht umkehrbar.</strong> Aus <Formel tex="f(-a)=f(a)" /> folgt, dass ein Wert zweimal vorkommt. Keine achsensymmetrische Funktion ist umkehrbar.
          </li>
          <li>
            <strong>Punktsymmetrisch sagt nichts über die Umkehrbarkeit.</strong> <Formel tex="x^3" /> ist umkehrbar, <Formel tex="x^3-x" /> nicht.
          </li>
          <li>
            <strong>Umkehrbarkeit begründen:</strong> Zeige, dass die Funktion streng monoton ist. Summen und Verkettungen streng steigender Funktionen steigen wieder streng.
          </li>
          <li>
            <strong>Verkettung erkennen:</strong> Suche die innere und die äußere Funktion, zum Beispiel <Formel tex="e^{x^3}" /> mit <Formel tex="v(x)=x^3" /> und <Formel tex="u(z)=e^z" nach="." />
          </li>
        </ul>
      </Hinweis>

      <h3>Beispiele für alle Regionen</h3>
      <table className="tabelle tabelle-kompakt">
        <caption>Je ein Beispiel pro Region</caption>
        <thead>
          <tr>
            <th scope="col">Region</th>
            <th scope="col">Eigenschaften</th>
            <th scope="col">Beispiel</th>
          </tr>
        </thead>
        <tbody>
          {REGIONEN.map((r) => (
            <tr key={r}>
              <th scope="row">{r}</th>
              <td>{REGION_TEXT[r]}</td>
              <td>{BEISPIEL_REGION[r]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Die Regionen D und G sind leer, weil eine achsensymmetrische Funktion nicht umkehrbar ist.</p>
      <figure className="bild">
        <VennBild />
        <figcaption>{LEGENDE}</figcaption>
      </figure>

      <h3>Weiterlernen</h3>
      <p>
        Zu den Grundlagen: <Modulverweis modul="summe-produkt-funktionen" abschnitt="zusammenfassung">Summe, Differenz und Produkt</Modulverweis>, <Modulverweis modul="verkettung" abschnitt="zusammenfassung">Verkettung</Modulverweis> und <Modulverweis modul="umkehrfunktion" abschnitt="zusammenfassung">Umkehrfunktion</Modulverweis>.
      </p>
    </Abschnitt>
  );
}

export default function Modul() {
  return (
    <>
      <Vorgehen />
      <VennBereich />
      <WeitereBereich />
      <Zusammenfassung />
    </>
  );
}
