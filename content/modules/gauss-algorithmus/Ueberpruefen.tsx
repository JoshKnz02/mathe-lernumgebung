import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Matrixfolge } from '@/components/Matrixfolge';
import { bruch, bruchTeX, folge, gaussSchritte, gleichungenTeX, linkeSeite, loeseStufenform, matrixTeX, tupelTeX, type Matrix } from '@/lib/lgs';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { AUFGABE1, AUFGABE2, AUFGABE3, AUFGABE4, AUFGABE5, AUFGABE6, AUFGABE7, AUFGABE8, AUFGABE9 } from './daten';

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl, Dezimalzahl (<code>2,5</code>) oder als Bruch (zum Beispiel <Formel tex={t`\frac{5}{2}`} nach=")" /> ein, ohne Einheit. Die Aufgaben 1 bis 4 sind Stufe 1 (Verfahren sicher anwenden), die Aufgaben 5 bis 7 Stufe 2 (mehr Überlegung), die Aufgaben 8 und 9 Stufe 3 (Parameter und Anwendung).
    </Hinweis>
  );
}

const paren = (v: number) => (v < 0 ? `(${v})` : String(v));

/** Probe einer Zeile mit eingesetzten Zahlen als TeX, zum Beispiel 2\cdot 2+1\cdot 1+(-1)\cdot 3=2. */
const probeTeX = (zeile: number[], x: number[]) => `${zeile.slice(0, -1).map((k, c) => `${paren(k)}\\cdot ${paren(x[c]!)}`).join('+')}=${zeile[zeile.length - 1]}`;

/** Schritte der Musterlösung: Umformen mit dem Gauß-Algorithmus, Rückwärtseinsetzen, Probe im Ausgangssystem. */
function loesungsSchritte(m: Matrix, vorweg: ReactNode[] = []): ReactNode[] {
  const schritte = gaussSchritte(m);
  const stufe = schritte[schritte.length - 1]?.danach ?? m;
  const r = loeseStufenform(stufe);
  if (r.art !== 'eindeutig') throw new Error('Aufgabe ist nicht eindeutig lösbar');
  const [x1, x2, x3] = r.x as [ReturnType<typeof bruch>, ReturnType<typeof bruch>, ReturnType<typeof bruch>];
  const wert = r.x.map((b) => b.z / b.n);
  return [
    ...vorweg,
    <>
      Die Matrix wird mit dem Gauß-Algorithmus in Stufenform gebracht. Die Rechenvermerke stehen über den Matrizen.
      <Matrixfolge
        zeilen={folge(m, schritte.map((s) => s.umformung))}
        beschreibung="Ausgangsmatrix und die Matrizen nach jeder Umformung bis zur Stufenform"
        unter={<>Blau: Pivot, orange: erzeugte Null.</>}
      />
    </>,
    <>
      Rückwärtseinsetzen: Die letzte Zeile liefert <Formel tex={`x_3=${bruchTeX(x3)}`} nach="." /> Eingesetzt in die zweite Zeile folgt <Formel tex={`x_2=${bruchTeX(x2)}`} nach="." /> Eingesetzt in die erste Zeile folgt <Formel tex={`x_1=${bruchTeX(x1)}`} nach="." /> Die Lösungsmenge ist <Formel tex={`L=\\{${tupelTeX(r.x)}\\}`} nach="." />
    </>,
    <>
      Probe im Ausgangssystem:
      {m.map((z, i) => (
        <Formel key={i} anzeige tex={probeTeX(z, wert)} nach={i === m.length - 1 ? '.' : undefined} />
      ))}
    </>,
  ];
}

const AUS1 = AUFGABE1.matrix;
const ausNamen: Record<string, string> = { a: 'a', b: 'b', c: 'c', d: 'd' };

function Frage1() {
  const optionen = AUFGABE1.optionen.map((o) => {
    const x = o.x.map((v) => bruch(v));
    const k = o.verletzt[0];
    const rueck =
      k === undefined ? (
        <>Richtig. Das Tripel erfüllt alle drei Gleichungen: <Formel tex={probeTeX(AUS1[0]!, o.x)} nach="," /> <Formel tex={probeTeX(AUS1[1]!, o.x)} /> und <Formel tex={probeTeX(AUS1[2]!, o.x)} nach="." /></>
      ) : (
        <>
          Das Tripel <Formel tex={tupelTeX(x)} /> erfüllt Gleichung {k} nicht: <Formel tex={probeTeX(AUS1[k - 1]!, o.x)} /> ergibt links <Formel tex={bruchTeX(linkeSeite(AUS1[k - 1]!, x))} /> statt <Formel tex={String(AUS1[k - 1]![3])} nach="." />{' '}
          {o.verletzt.length === 1 ? 'Es erfüllt nur die beiden anderen Gleichungen. Eine Lösung muss aber alle drei erfüllen.' : 'Eine Lösung muss alle drei Gleichungen erfüllen. Hier stimmt höchstens eine.'}
        </>
      );
    return opt(ausNamen[o.id]!, <Formel tex={tupelTeX(x)} />, o.verletzt.length === 0, rueck);
  });
  return (
    <Auswahlfrage
      nummer="1"
      titel="Lösung überprüfen"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          Du setzt das Tripel in jede Gleichung des Ausgangssystems ein. Nur wenn alle drei Gleichungen stimmen, ist es eine Lösung. Ein Tripel, das zwei Gleichungen erfüllt, aber nicht die dritte, ist keine Lösung. Für <Formel tex={tupelTeX(AUFGABE1.optionen[1]!.x.map((v) => bruch(v)))} /> gilt:
          {AUS1.map((z, i) => (
            <Formel key={i} anzeige tex={probeTeX(z, AUFGABE1.optionen[1]!.x)} nach={i === 2 ? '.' : undefined} />
          ))}
        </>
      }
    >
      <p>Gegeben ist das Gleichungssystem</p>
      <Formel anzeige tex={gleichungenTeX(AUS1)} nach="." />
      <p>Welches Tripel <Formel tex="(x_1;\,x_2;\,x_3)" /> ist eine Lösung?</p>
    </Auswahlfrage>
  );
}

function Frage2() {
  const a = AUFGABE2;
  const probe = a.loesung;
  const optionen = [
    opt('s1', <>Schritt 1</>, false, <>Schritt 1 ist richtig. <Formel tex={t`Z_2-3\cdot Z_1`} /> ergibt in der ersten Spalte <Formel tex="3-3=0" nach="," /> dann <Formel tex="1-6=-5" nach="," /> <Formel tex="2+3=5" /> und <Formel tex="11-6=5" nach="." /></>),
    opt('s2', <>Schritt 2</>, true, <>Richtig. In Schritt 2 stimmt die rechte Seite von <Formel tex="Z_3" /> nicht: <Formel tex={t`-1-2\cdot 2=-5`} /> und nicht <Formel tex="-3" nach="." /></>),
    opt('s3', <>Schritt 3</>, false, <>Schritt 3 ist mit den Zahlen aus Schritt 2 richtig gerechnet: <Formel tex={t`5\cdot(-7)-7\cdot(-5)=0`} nach="," /> <Formel tex={t`5\cdot 3-7\cdot 5=-20`} /> und <Formel tex={t`5\cdot(-3)-7\cdot 5=-50`} nach="." /> Der Fehler liegt eine Zeile früher, nur wirkt er sich hier aus.</>),
    opt('s4', <>Alle Umformungen stimmen, nur beim Rückwärtseinsetzen steckt der Fehler.</>, false, <>Rückwärtseinsetzen ist nicht das Problem. Aus <Formel tex={t`-20x_3=-50`} /> folgt <Formel tex={t`x_3=\frac{5}{2}`} nach="," /> das ist richtig gerechnet. Aber <Formel tex="x_3" /> sollte hier 3 sein, also steckt der Fehler in den Umformungen.</>),
  ];
  return (
    <Auswahlfrage
      nummer="2"
      titel="Fehler in der Lösung finden"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          Mit einer Probe mit der bekannten Lösung <Formel tex={tupelTeX(probe.map((v) => bruch(v)))} /> findest du die Stelle: Nach Schritt 1 stimmt jede Zeile. Nach Schritt 2 stimmt <Formel tex="Z_3" /> nicht mehr, denn <Formel tex={t`-7\cdot 2+3\cdot 3=-5\neq -3`} nach="." /> Die richtige Matrix nach Schritt 2 hat in der dritten Zeile die rechte Seite <Formel tex="-5" nach="." />
          <Formel anzeige tex={matrixTeX(a.richtigNachSchritt2)} nach="." />
        </>
      }
    >
      <p>
        Ein Lernender löst ein LGS mit dem Gauß-Algorithmus. Er will die Matrix in Stufenform bringen und rechnet so:
      </p>
      <Matrixfolge
        zeilen={[{ matrix: a.start }, ...a.schueler]}
        beschreibung="Ausgangsmatrix und drei Umformungen eines Lernenden, eine davon enthält einen Rechenfehler"
        unter={<>Lösung des Lernenden. Eine Umformung ist falsch gerechnet.</>}
      />
      <p>Bei welchem Schritt tritt der erste Fehler auf?</p>
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  const a3 = AUFGABE3;
  const a4 = AUFGABE4;
  const a5 = AUFGABE5;
  const a6 = AUFGABE6;
  const a7 = AUFGABE7;
  const a8 = AUFGABE8;
  const a9 = AUFGABE9;
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <Eingabehinweis />

      <Frage1 />
      <Frage2 />

      <Aufgabe
        nummer={3}
        titel="Umformung bestimmen"
        felder={[
          { id: 'a', name: 'Faktor a der ersetzten Zeile', beschriftung: <>Faktor <Formel tex="a" /></>, erwartet: a3.a },
          { id: 'b', name: 'Faktor b der ersten Zeile', beschriftung: <>Faktor <Formel tex="b" /></>, erwartet: a3.b },
        ]}
        hilfen={[
          <>Die erste Zeile bleibt unverändert und die zweite Zeile wird ersetzt durch <Formel tex={t`a\cdot Z_2+b\cdot Z_1`} nach="." /> Schau auf die erste Spalte: Dort entsteht die 0.</>,
          <>Für die erste Spalte gilt <Formel tex={t`a\cdot 2+b\cdot 3=0`} nach="." /> Für die zweite Spalte gilt <Formel tex={t`a\cdot(-1)+b\cdot 1=-5`} nach="." /> Löse die beiden Gleichungen.</>,
        ]}
        loesung={[
          <>
            Erste Spalte: <Formel tex={t`2a+3b=0`} nach="." /> Zweite Spalte: <Formel tex={t`-a+b=-5`} nach="." />
          </>,
          <>
            Aus der zweiten Gleichung folgt <Formel tex={t`b=a-5`} nach="." /> Eingesetzt in die erste: <Formel tex={t`2a+3(a-5)=0`} nach="," /> also <Formel tex={t`5a=15`} /> und <Formel tex="a=3" nach="." /> Damit ist <Formel tex={t`b=-2`} nach="." />
          </>,
          <>
            Probe mit der dritten Spalte: <Formel tex={t`3\cdot 4+(-2)\cdot(-2)=16`} /> und mit der rechten Seite: <Formel tex={t`3\cdot 3+(-2)\cdot 5=-1`} nach="." /> Beides passt zur neuen Zeile. Die Umformung ist <Formel tex={t`Z_2\to 3\cdot Z_2-2\cdot Z_1`} nach="." />
          </>,
        ]}
      >
        <p>Die zweite Zeile einer Matrix wurde ersetzt. Gesucht sind die Faktoren der Umformung <Formel tex={t`Z_2\to a\cdot Z_2+b\cdot Z_1`} nach="." /></p>
        <p>
          Vorher: <Formel tex={matrixTeX(a3.vorher)} nach="," /> nachher: <Formel tex={matrixTeX(a3.nachher)} nach="." />
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={4}
        titel="Gleichungssystem lösen"
        felder={[
          { id: 'x1', name: 'Lösung x1', beschriftung: <Formel tex="x_1" />, erwartet: a4.loesung[0]! },
          { id: 'x2', name: 'Lösung x2', beschriftung: <Formel tex="x_2" />, erwartet: a4.loesung[1]! },
          { id: 'x3', name: 'Lösung x3', beschriftung: <Formel tex="x_3" />, erwartet: a4.loesung[2]! },
        ]}
        hilfen={[
          <>Schreibe die erweiterte Koeffizientenmatrix auf. Das Pivot in der ersten Spalte ist die 1. Erzeuge mit <Formel tex={t`Z_2\to Z_2-2\cdot Z_1`} /> und <Formel tex={t`Z_3\to Z_3-Z_1`} /> Nullen darunter.</>,
          <>Danach steht in <Formel tex="Z_2" /> das Pivot der zweiten Spalte. Erzeuge darunter eine Null und löse von unten nach oben.</>,
        ]}
        loesung={loesungsSchritte(a4.matrix)}
      >
        <p>Löse das Gleichungssystem mit dem Gauß-Algorithmus.</p>
        <Formel anzeige tex={gleichungenTeX(a4.matrix)} nach="." />
      </Aufgabe>

      <Aufgabe
        nummer={5}
        titel="Gleichungssystem mit einer Null im ersten Eintrag"
        felder={[
          { id: 'x1', name: 'Lösung x1', beschriftung: <Formel tex="x_1" />, erwartet: a5.loesung[0]! },
          { id: 'x2', name: 'Lösung x2', beschriftung: <Formel tex="x_2" />, erwartet: a5.loesung[1]! },
          { id: 'x3', name: 'Lösung x3', beschriftung: <Formel tex="x_3" />, erwartet: a5.loesung[2]! },
        ]}
        hilfen={[
          <>In der ersten Gleichung fehlt <Formel tex="x_1" nach="." /> Der erste Eintrag in der Matrix ist 0 und kann kein Pivot sein.</>,
          <>Vertausche zuerst zwei Zeilen, sodass oben links keine 0 mehr steht, und rechne dann wie gewohnt.</>,
        ]}
        loesung={loesungsSchritte(a5.matrix, [
          <>
            In der ersten Gleichung kommt <Formel tex="x_1" /> nicht vor, der Koeffizient ist 0. Die Matrix lautet <Formel tex={matrixTeX(a5.matrix)} nach="." /> Der Algorithmus tauscht zuerst Zeilen, damit das Pivot ungleich 0 ist.
          </>,
        ])}
      >
        <p>Löse das Gleichungssystem.</p>
        <Formel anzeige tex={gleichungenTeX(a5.matrix)} nach="." />
      </Aufgabe>

      <Aufgabe
        nummer={6}
        titel="Sportartikel bestellen"
        felder={[
          { id: 'p1', name: 'Preis eines Trikots in Euro', beschriftung: <>Trikot in €</>, erwartet: a6.preise[0]! },
          { id: 'p2', name: 'Preis einer Hose in Euro', beschriftung: <>Hose in €</>, erwartet: a6.preise[1]! },
          { id: 'p3', name: 'Preis eines Paars Stutzen in Euro', beschriftung: <>Stutzen in €</>, erwartet: a6.preise[2]! },
        ]}
        hilfen={[
          <>Wähle Unbekannte: <Formel tex="x_1" /> ist der Preis eines Trikots, <Formel tex="x_2" /> der einer Hose, <Formel tex="x_3" /> der eines Paars Stutzen. Jede Bestellung ergibt eine Gleichung.</>,
          <>In der dritten Bestellung kommen keine Hosen vor. Dort hat <Formel tex="x_2" /> den Koeffizienten 0. Die erste Gleichung kannst du vor dem Rechnen durch 10 teilen, das ist Multiplikation mit <Formel tex={t`\frac{1}{10}`} nach="." /></>,
        ]}
        loesung={loesungsSchritte(a6.matrix, [
          <>
            Gleichungen aus den drei Bestellungen:
            <Formel anzeige tex={gleichungenTeX(a6.matrix)} nach="." />
            Die Zahl in der dritten Gleichung bei <Formel tex="x_2" /> ist 0, weil in dieser Bestellung keine Hosen sind.
          </>,
        ])}
      >
        <p>
          Ein Verein gibt drei Bestellungen bei einem Sportgeschäft auf. Trikots, Hosen und Stutzen haben je Stück einen festen Preis.
        </p>
        <ul>
          <li>Bestellung 1: 10 Trikots, 10 Hosen und 20 Paar Stutzen kosten zusammen 540 €.</li>
          <li>Bestellung 2: 5 Trikots, 12 Hosen und 10 Paar Stutzen kosten zusammen 396 €.</li>
          <li>Bestellung 3: 8 Trikots und 15 Paar Stutzen kosten zusammen 282 €.</li>
        </ul>
        <p>Stelle ein Gleichungssystem auf und bestimme die Preise.</p>
      </Aufgabe>

      <Aufgabe
        nummer={7}
        titel="Gleichungssystem zu einer Lösung erstellen"
        felder={[
          { id: 'b1', name: 'rechte Seite der ersten Gleichung', beschriftung: <><Formel tex="b_1" /></>, erwartet: a7.rechts[0]! },
          { id: 'b2', name: 'rechte Seite der zweiten Gleichung', beschriftung: <><Formel tex="b_2" /></>, erwartet: a7.rechts[1]! },
          { id: 'b3', name: 'rechte Seite der dritten Gleichung', beschriftung: <><Formel tex="b_3" /></>, erwartet: a7.rechts[2]! },
        ]}
        hilfen={[
          <>Wenn <Formel tex={t`(2;\,-1;\,4)`} /> eine Lösung sein soll, muss das Tripel jede Gleichung erfüllen. Die rechte Seite ist dann der Wert der linken Seite.</>,
          <>Setze in jede linke Seite <Formel tex={t`x_1=2`} nach="," /> <Formel tex={t`x_2=-1`} /> und <Formel tex={t`x_3=4`} /> ein und rechne aus.</>,
        ]}
        loesung={[
          <>
            Erste Gleichung: <Formel tex={probeTeX([...a7.koeff[0]!, 0], a7.loesung)} /> ergibt <Formel tex={`b_1=${a7.rechts[0]}`} nach="." />
          </>,
          <>
            Zweite Gleichung: <Formel tex={probeTeX([...a7.koeff[1]!, 0], a7.loesung)} /> ergibt <Formel tex={`b_2=${a7.rechts[1]}`} nach="." /> Dritte Gleichung: <Formel tex={probeTeX([...a7.koeff[2]!, 0], a7.loesung)} /> ergibt <Formel tex={`b_3=${a7.rechts[2]}`} nach="." />
          </>,
        ]}
      >
        <p>Gegeben ist die linke Seite eines Gleichungssystems. Bestimme die rechten Seiten so, dass <Formel tex={t`(2;\,-1;\,4)`} /> die Lösung des Systems ist.</p>
        <Formel anzeige tex={t`\begin{aligned}3x_1+2x_2+x_3&=b_1\\x_1-4x_2+2x_3&=b_2\\2x_1+x_2+3x_3&=b_3\end{aligned}`} nach="." />
      </Aufgabe>

      <Aufgabe
        nummer={8}
        titel="Parameter bei gegebener Lösung"
        felder={[
          { id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: a8.a },
          { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: a8.b },
        ]}
        hilfen={[
          <>Setze die Lösung <Formel tex={t`(2;\,1;\,-1)`} /> in die Gleichungen ein. Eine Gleichung enthält <Formel tex="a" nach="," /> eine andere <Formel tex="b" nach="." /></>,
          <>In der ersten Gleichung bleibt <Formel tex="a" /> als einzige Unbekannte übrig, in der zweiten <Formel tex="b" nach="." /> Die dritte Gleichung ist eine Kontrolle.</>,
        ]}
        loesung={[
          <>
            Erste Gleichung: <Formel tex={t`a\cdot 2+1+2\cdot(-1)=5`} nach="," /> also <Formel tex={t`2a-1=5`} /> und damit <Formel tex="a=3" nach="." />
          </>,
          <>
            Zweite Gleichung: <Formel tex={t`2+b\cdot 1-(-1)=7`} nach="," /> also <Formel tex={t`b+3=7`} /> und damit <Formel tex="b=4" nach="." />
          </>,
          <>
            Kontrolle mit der dritten Gleichung: <Formel tex={t`2\cdot 2-1+(-1)=2`} nach="." /> Sie stimmt, ohne dass ein Parameter vorkommt. Gleichungssystem und Lösung passen also zusammen.
          </>,
        ]}
      >
        <p>
          Das Gleichungssystem hat die Lösung <Formel tex={t`(x_1;\,x_2;\,x_3)=(2;\,1;\,-1)`} nach="." /> Bestimme die Parameter <Formel tex="a" /> und <Formel tex="b" nach="." />
        </p>
        <Formel anzeige tex={t`\begin{aligned}ax_1+x_2+2x_3&=5\\x_1+bx_2-x_3&=7\\2x_1-x_2+x_3&=2\end{aligned}`} nach="." />
      </Aufgabe>

      <Aufgabe
        nummer={9}
        titel="Becken füllen"
        felder={[
          { id: 'ra', name: 'Förderleistung der Pumpe A in Kubikmeter pro Stunde', beschriftung: <>Pumpe A</>, erwartet: a9.raten[0]! },
          { id: 'rb', name: 'Förderleistung der Pumpe B in Kubikmeter pro Stunde', beschriftung: <>Pumpe B</>, erwartet: a9.raten[1]! },
          { id: 'rc', name: 'Förderleistung der Pumpe C in Kubikmeter pro Stunde', beschriftung: <>Pumpe C</>, erwartet: a9.raten[2]! },
        ]}
        hilfen={[
          <>Die Unbekannten sind die Förderleistungen <Formel tex="x_1" nach="," /> <Formel tex="x_2" /> und <Formel tex="x_3" /> der Pumpen in Kubikmeter pro Stunde. In jedem Versuch gilt: Laufzeit mal Förderleistung, aufsummiert über die Pumpen, ergibt die gefüllte Menge.</>,
          <>Stelle drei Gleichungen auf, schreibe die Matrix auf und löse mit dem Gauß-Algorithmus.</>,
        ]}
        loesung={loesungsSchritte(a9.matrix, [
          <>
            Aus den drei Versuchen folgt:
            <Formel anzeige tex={gleichungenTeX(a9.matrix)} nach="." />
          </>,
        ])}
      >
        <p>
          Ein Becken wird von drei Pumpen A, B und C gefüllt. Jede Pumpe fördert gleichmäßig. In drei Versuchen laufen die Pumpen verschieden lange:
        </p>
        <ul>
          <li>Versuch 1: A läuft 2 Stunden, B 1 Stunde, C 4 Stunden. Es werden 30 Kubikmeter gefüllt.</li>
          <li>Versuch 2: A läuft 3 Stunden, B 2 Stunden, C 1 Stunde. Es werden 34 Kubikmeter gefüllt.</li>
          <li>Versuch 3: A läuft 1 Stunde, B 4 Stunden, C 2 Stunden. Es werden 43 Kubikmeter gefüllt.</li>
        </ul>
        <p>Bestimme die Förderleistung jeder Pumpe in Kubikmeter pro Stunde.</p>
      </Aufgabe>
    </Abschnitt>
  );
}
