import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { AufKlick } from '@/components/AufKlick';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage, type Option } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { zahlTex } from '@/lib/zahlen';
import { E1, E10, E2, E3, E5, E6, E7, E8, E9, F4A, F4B, G3, G5, G7, G8, G9 } from './daten';
import { Gleichungslabor } from './Gleichungslabor';
import { Loesungsschaubild } from './Loesungsschaubild';

const PI = Math.PI;
const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });
const x = (liste: { x: number }[]) => liste.map((l) => l.x);
/** Dezimalzahl mit drei Nachkommastellen, damit Zwischenschritte im Lösungsweg stimmig addieren. */
const d3 = (v: number) => String(Math.round(v * 1000) / 1000).replace('.', '{,}');

function Beobachtung({ children }: { children: ReactNode }) {
  return (
    <details className="beobachtung">
      <summary>Beobachtung vergleichen</summary>
      <div>{children}</div>
    </details>
  );
}

export default function Modul() {
  return (
    <>
      <Abschnitt id="erklaeren" titel="Erklären">
        <h3>Worum es geht</h3>
        <p>
          Bisher hast du zu einem x-Wert den Funktionswert berechnet. Jetzt ist es umgekehrt: Der Funktionswert ist vorgegeben und du suchst die passenden x-Werte. Das führt auf Gleichungen wie <Formel tex="\sin(x)=0{,}5" /> oder <Formel tex="5\cos(4x)+10=12{,}5" />. Man nennt sie <strong>trigonometrische Gleichungen</strong>. Im Schaubild <Formel tex="K_f" /> sind die gesuchten x-Werte die x-Koordinaten der Schnittpunkte von <Formel tex="K_f" /> mit einer waagerechten Geraden.
        </p>

        <h3>Begriffe und Schreibweise</h3>
        <ul className="liste">
          <li>
            Eine <strong>Lösung</strong> der Gleichung ist ein x-Wert, für den die Gleichung wahr wird. Mit der <strong>Probe</strong> prüfst du das: Du setzt den x-Wert ein und vergleichst beide Seiten.
          </li>
          <li>
            Das <strong>Intervall</strong> gibt an, in welchem Bereich du suchst, zum Beispiel <Formel tex={String.raw`[0;\,2\pi]`} />. Die Randwerte gehören dazu. Nur Lösungen im Intervall gehören zur Lösung der Aufgabe.
          </li>
          <li>
            Die <strong>Lösungsmenge</strong> <Formel tex="L" /> enthält alle Lösungen im Intervall, aufsteigend sortiert, in geschweiften Klammern und durch Semikolon getrennt, zum Beispiel <Formel tex={String.raw`L=\{1{,}2;\,5{,}6\}`} />. Gibt es keine Lösung, schreibst du <Formel tex={String.raw`L=\{\ \}`} />.
          </li>
        </ul>

        <h3>Der Taschenrechner</h3>
        <ul className="liste">
          <li>
            Stelle ihn auf <strong>Bogenmaß</strong> (RAD) ein, nicht auf Gradmaß (DEG). Du suchst x-Werte im Bogenmaß, passend zu Intervallen wie <Formel tex={String.raw`[0;\,2\pi]`} />.
          </li>
          <li>
            Die Tasten <Formel tex={String.raw`\sin^{-1}`} /> und <Formel tex={String.raw`\cos^{-1}`} /> (meist über <em>Shift</em> oder <em>2nd</em>) liefern zu einem Wert <Formel tex="s" /> eine Zahl <Formel tex="x_1" /> mit <Formel tex={String.raw`\sin(x_1)=s`} /> bzw. <Formel tex={String.raw`\cos(x_1)=s`} />. Dabei bedeutet <Formel tex={String.raw`\sin^{-1}`} /> die Umkehrung und nicht <Formel tex={String.raw`\frac{1}{\sin}`} />.
          </li>
          <li>
            Der Taschenrechner liefert <strong>immer nur eine</strong> Lösung. Der Wert von <Formel tex={String.raw`\sin^{-1}(s)`} /> liegt zwischen <Formel tex={String.raw`-\frac{\pi}{2}`} /> und <Formel tex={String.raw`\frac{\pi}{2}`} />, der Wert von <Formel tex={String.raw`\cos^{-1}(s)`} /> zwischen <Formel tex="0" /> und <Formel tex="\pi" />.
          </li>
          <li>
            Ist <Formel tex="s" /> größer als 1 oder kleiner als −1, gibt der Taschenrechner eine Fehlermeldung aus.
          </li>
        </ul>

        <h3>Exakte Werte</h3>
        <p>
          Kommt der Wert <Formel tex="s" /> in dieser Tabelle vor, gibst du <Formel tex="x_1" /> exakt als Vielfaches von <Formel tex="\pi" /> an. Sonst nimmst du den Taschenrechner und rundest.
        </p>
        <table className="tabelle">
          <caption>Die wichtigsten Sinus- und Kosinuswerte</caption>
          <thead>
            <tr>
              <th scope="col"><Formel tex={String.raw`\alpha`} /></th>
              <th scope="col">0°</th>
              <th scope="col">30°</th>
              <th scope="col">45°</th>
              <th scope="col">60°</th>
              <th scope="col">90°</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><Formel tex="x" /></th>
              <td><Formel tex="0" /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{6}`} /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{4}`} /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{3}`} /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{2}`} /></td>
            </tr>
            <tr>
              <th scope="row"><Formel tex={String.raw`\sin(x)`} /></th>
              <td><Formel tex="0" /></td>
              <td><Formel tex={String.raw`\tfrac{1}{2}`} /></td>
              <td><Formel tex={String.raw`\tfrac{1}{2}\sqrt{2}`} /></td>
              <td><Formel tex={String.raw`\tfrac{1}{2}\sqrt{3}`} /></td>
              <td><Formel tex="1" /></td>
            </tr>
            <tr>
              <th scope="row"><Formel tex={String.raw`\cos(x)`} /></th>
              <td><Formel tex="1" /></td>
              <td><Formel tex={String.raw`\tfrac{1}{2}\sqrt{3}`} /></td>
              <td><Formel tex={String.raw`\tfrac{1}{2}\sqrt{2}`} /></td>
              <td><Formel tex={String.raw`\tfrac{1}{2}`} /></td>
              <td><Formel tex="0" /></td>
            </tr>
          </tbody>
        </table>

        <h3>Umformen</h3>
        <p>
          Zuerst formst du die Gleichung mit Äquivalenzumformungen so um, dass <Formel tex="\sin(x)" /> bzw. <Formel tex="\cos(x)" /> allein auf einer Seite steht. Dabei behandelst du <Formel tex="\sin(x)" /> wie eine gewöhnliche Unbekannte. Ein Beispiel:
        </p>
        <Formel
          anzeige
          tex={String.raw`\begin{aligned}4\cos(x)+1&=3 &&|\ -1\\ 4\cos(x)&=2 &&|\ :4\\ \cos(x)&=\tfrac{1}{2}\end{aligned}`}
        />
      </Abschnitt>

      <Abschnitt id="entdecken" titel="Entdecken">
        <h3>Vermutung: nur x in der Klammer</h3>
        <p>
          Du kennst das Schaubild <Formel tex="K_f" /> von <Formel tex="f(x)=\sin(x)" />. Betrachte die Gleichung <Formel tex="\sin(x)=0{,}5" /> im Intervall <Formel tex={String.raw`[0;\,2\pi]`} />. Der Taschenrechner liefert dafür nur eine Lösung. Überlege, bevor du das Labor benutzt, und skizziere <Formel tex="K_f" /> und die Gerade <Formel tex="y=0{,}5" />:
        </p>
        <ul className="liste">
          <li>Wie viele Lösungen erwartest du im Intervall <Formel tex={String.raw`[0;\,2\pi]`} />? Wo liegen sie ungefähr?</li>
          <li>Wie viele Lösungen erwartest du im Intervall <Formel tex={String.raw`[0;\,4\pi]`} />?</li>
          <li>Was erwartest du bei <Formel tex="\sin(x)=1" /> und bei <Formel tex="\sin(x)=1{,}5" />?</li>
        </ul>
        <Beobachtung>
          Die Gerade <Formel tex="y=0{,}5" /> schneidet <Formel tex="K_f" /> in jeder Periode zweimal. Es gibt also 2 Lösungen in <Formel tex={String.raw`[0;\,2\pi]`} /> und 4 Lösungen in <Formel tex={String.raw`[0;\,4\pi]`} />. Die Gerade <Formel tex="y=1" /> berührt <Formel tex="K_f" /> nur in den Hochpunkten, das ist genau eine Lösung je Periode. Die Gerade <Formel tex="y=1{,}5" /> liegt oberhalb von <Formel tex="K_f" />, es gibt keine Lösung.
        </Beobachtung>

        <h3>Labor: nur x in der Klammer</h3>
        <p>
          Wähle die Funktion, die rechte Seite <Formel tex="s" /> und das Intervall. Das Labor zeigt <Formel tex="K_f" />, die Gerade <Formel tex="y=s" /> und alle Lösungen. Die Tabelle nennt die Lösungen im gewählten Intervall.
        </p>
        <Gleichungslabor mitParametern={false} />

        <h3>Untersuchungsaufträge</h3>
        <p>Beantworte die Fragen zuerst mit dem Labor. Danach kannst du deine Beobachtung vergleichen.</p>
        <ol className="auftraege">
          <li>
            <p>
              Wähle Sinus und das Intervall <Formel tex={String.raw`[0;\,2\pi]`} />. Stelle <Formel tex={String.raw`s=\tfrac{1}{2}`} /> ein, notiere beide Lösungen und bilde ihre Summe. Wiederhole das für <Formel tex={String.raw`s=\tfrac{1}{2}\sqrt{2}`} /> und <Formel tex={String.raw`s=\tfrac{1}{2}\sqrt{3}`} />. Was fällt dir auf? Warum passt das zum Verlauf von <Formel tex="K_f" />?
            </p>
            <Beobachtung>
              Die Lösungen sind <Formel tex={String.raw`\tfrac{\pi}{6}`} /> und <Formel tex={String.raw`\tfrac{5\pi}{6}`} />, dann <Formel tex={String.raw`\tfrac{\pi}{4}`} /> und <Formel tex={String.raw`\tfrac{3\pi}{4}`} />, dann <Formel tex={String.raw`\tfrac{\pi}{3}`} /> und <Formel tex={String.raw`\tfrac{2\pi}{3}`} />. Die Summe ist jedes Mal <Formel tex="\pi" />, also gilt <Formel tex={String.raw`x_2=\pi-x_1`} />. Der Hochpunkt von <Formel tex="K_f" /> liegt bei <Formel tex={String.raw`\tfrac{\pi}{2}`} />. Die beiden Lösungen liegen links und rechts davon gleich weit entfernt: <Formel tex="K_f" /> ist symmetrisch zur Geraden <Formel tex={String.raw`x=\tfrac{\pi}{2}`} />.
            </Beobachtung>
          </li>
          <li>
            <p>
              Stelle bei Sinus und <Formel tex={String.raw`[0;\,2\pi]`} /> nun <Formel tex={String.raw`s=-\tfrac{1}{2}`} /> ein. Welchen Wert <Formel tex="x_1" /> liefert der Taschenrechner? Liegt er im Intervall? Welche Lösungen liegen im Intervall und wie hängen sie mit <Formel tex="x_1" /> zusammen?
            </p>
            <Beobachtung>
              Der Taschenrechner liefert <Formel tex={String.raw`x_1=-\tfrac{\pi}{6}`} />. Das liegt links von 0 und damit nicht im Intervall. Die Lösungen im Intervall sind <Formel tex={String.raw`\tfrac{7\pi}{6}`} /> und <Formel tex={String.raw`\tfrac{11\pi}{6}`} />. Es gilt <Formel tex={String.raw`\tfrac{7\pi}{6}=\pi-x_1`} /> (Typ 2) und <Formel tex={String.raw`\tfrac{11\pi}{6}=x_1+2\pi`} /> (Typ 1). Der Taschenrechnerwert ist also nicht immer selbst eine Lösung im Intervall. Du musst immer prüfen, ob die Lösungen im Intervall liegen.
            </Beobachtung>
          </li>
          <li>
            <p>
              Wähle Sinus, <Formel tex={String.raw`s=\tfrac{1}{2}`} /> und das Intervall <Formel tex={String.raw`[0;\,4\pi]`} />. Wie weit liegen aufeinanderfolgende Lösungen vom gleichen Typ auseinander? Wie bekommst du aus den Lösungen in <Formel tex={String.raw`[0;\,2\pi]`} /> die weiteren?
            </p>
            <Beobachtung>
              Die Lösungen sind <Formel tex={String.raw`\tfrac{\pi}{6},\ \tfrac{5\pi}{6},\ \tfrac{13\pi}{6},\ \tfrac{17\pi}{6}`} />. Gleiche Typen liegen im Abstand <Formel tex="2\pi" />, also einer Periode: <Formel tex={String.raw`\tfrac{13\pi}{6}=\tfrac{\pi}{6}+2\pi`} /> und <Formel tex={String.raw`\tfrac{17\pi}{6}=\tfrac{5\pi}{6}+2\pi`} />. Weitere Lösungen erhältst du, indem du ganzzahlige Vielfache von <Formel tex="2\pi" /> addierst oder subtrahierst.
            </Beobachtung>
          </li>
          <li>
            <p>
              Wechsle zu Kosinus, <Formel tex={String.raw`s=\tfrac{1}{2}`} /> und dem Intervall <Formel tex={String.raw`[-2\pi;\,2\pi]`} />. Wie hängen die beiden Lösungen nahe bei 0 zusammen? Welche Lösungen liegen in <Formel tex={String.raw`[0;\,2\pi]`} />?
            </p>
            <Beobachtung>
              Die Lösungen sind <Formel tex={String.raw`-\tfrac{5\pi}{3},\ -\tfrac{\pi}{3},\ \tfrac{\pi}{3},\ \tfrac{5\pi}{3}`} />. Nahe bei 0 liegen <Formel tex={String.raw`x_1=\tfrac{\pi}{3}`} /> und <Formel tex={String.raw`x_2=-\tfrac{\pi}{3}`} />, also gilt <Formel tex={String.raw`x_2=-x_1`} />. Der Hochpunkt von <Formel tex="K_f" /> liegt bei <Formel tex="x=0" />, <Formel tex="K_f" /> ist symmetrisch zur y-Achse. In <Formel tex={String.raw`[0;\,2\pi]`} /> liegen <Formel tex={String.raw`\tfrac{\pi}{3}`} /> und <Formel tex={String.raw`\tfrac{5\pi}{3}=-\tfrac{\pi}{3}+2\pi`} />.
            </Beobachtung>
          </li>
          <li>
            <p>
              Stelle bei Sinus und <Formel tex={String.raw`[0;\,2\pi]`} /> die rechte Seite <Formel tex="s" /> langsam von 0,5 bis über 1 hinaus ein, danach auch unter −1. Wie verändern sich die beiden Lösungen? Wie viele Lösungen gibt es bei <Formel tex="s=1" />, bei <Formel tex="s=-1" /> und bei <Formel tex="s=1{,}2" />? Was meldet der Taschenrechner?
            </p>
            <Beobachtung>
              Für <Formel tex="s" /> nahe bei 1 rücken die beiden Lösungen zusammen. Bei <Formel tex="s=1" /> gibt es nur eine Lösung, den Hochpunkt bei <Formel tex={String.raw`x=\tfrac{\pi}{2}`} />. Bei <Formel tex="s=-1" /> gibt es nur eine Lösung, den Tiefpunkt bei <Formel tex={String.raw`x=\tfrac{3\pi}{2}`} />. Für <Formel tex="s>1" /> oder <Formel tex="s<-1" /> gibt es keine Lösung, der Taschenrechner meldet einen Fehler. Das gilt auch für den Kosinus.
            </Beobachtung>
          </li>
        </ol>

        <h3>Vermutung: nicht nur x in der Klammer</h3>
        <p>
          Betrachte jetzt <Formel tex="\sin(2x)=0{,}5" /> im Intervall <Formel tex={String.raw`[0;\,2\pi]`} />. Die Funktion <Formel tex="\sin(2x)" /> hat die Periode <Formel tex="\pi" />. Überlege:
        </p>
        <ul className="liste">
          <li>Wie viele Lösungen erwartest du im Intervall?</li>
          <li>Die Lösungen von <Formel tex="\sin(x)=0{,}5" /> kennst du aus dem ersten Teil. Wie könntest du daraus die Lösungen von <Formel tex="\sin(2x)=0{,}5" /> berechnen?</li>
        </ul>
        <Beobachtung>
          <Formel tex="\sin(2x)" /> durchläuft in <Formel tex={String.raw`[0;\,2\pi]`} /> zwei Perioden und die Gerade <Formel tex="y=0{,}5" /> schneidet <Formel tex="K_f" /> in jeder Periode zweimal. Es gibt also 4 Lösungen. Die Idee: Für <Formel tex="z=2x" /> musst du <Formel tex="\sin(z)=0{,}5" /> lösen. Du suchst also zuerst <Formel tex="z" /> und teilst dann durch 2. Das prüfst du im Labor.
        </Beobachtung>

        <h3>Labor: mit b und c</h3>
        <p>
          Jetzt kannst du zusätzlich die Streckung <Formel tex="b" /> und die Verschiebung <Formel tex="c" /> in x-Richtung einstellen. Die Zahl <Formel tex="z=b\,(x-c)" /> ist das Argument von Sinus bzw. Kosinus. Die Tabelle nennt zu jeder Lösung <Formel tex="x" /> auch den Wert von <Formel tex="z" />. Der Taschenrechner löst die Gleichung <Formel tex="\sin(z)=s" /> und liefert <Formel tex="z_1" />.
        </p>
        <p className="klein">
          Denke daran: <Formel tex="b" /> wirkt in x-Richtung genau umgekehrt. Bei <Formel tex="b=3" /> wird das Schaubild auf ein Drittel gestaucht.
        </p>
        <Gleichungslabor mitParametern />

        <h3>Untersuchungsaufträge</h3>
        <ol className="auftraege">
          <li>
            <p>
              Stelle Sinus, <Formel tex="b=2" />, <Formel tex="c=0" />, <Formel tex={String.raw`s=\tfrac{1}{2}`} /> und das Intervall <Formel tex={String.raw`[0;\,2\pi]`} /> ein. Wie viele Lösungen gibt es? Vergleiche die z-Werte der Tabelle mit den Lösungen aus dem ersten Labor für <Formel tex={String.raw`[0;\,4\pi]`} />.
            </p>
            <Beobachtung>
              Es gibt 4 Lösungen. Die z-Werte sind <Formel tex={String.raw`\tfrac{\pi}{6},\ \tfrac{5\pi}{6},\ \tfrac{13\pi}{6},\ \tfrac{17\pi}{6}`} />, also genau die Lösungen von <Formel tex="\sin(z)=0{,}5" /> im Intervall <Formel tex={String.raw`[0;\,4\pi]`} />. Das passt: Läuft <Formel tex="x" /> von 0 bis <Formel tex="2\pi" />, läuft <Formel tex="z=2x" /> von 0 bis <Formel tex="4\pi" />. Aus <Formel tex="z" /> erhältst du <Formel tex="x" /> durch Teilen durch 2.
            </Beobachtung>
          </li>
          <li>
            <p>
              Wie weit liegen aufeinanderfolgende Lösungen vom gleichen Typ auseinander, wenn <Formel tex="b=2" />, <Formel tex="b=4" /> bzw. <Formel tex="b=0{,}5" /> ist (Sinus, <Formel tex={String.raw`s=\tfrac{1}{2}`} />, <Formel tex="c=0" />)? Vergleiche mit der Periode <Formel tex="p" /> in den Kennwerten.
            </p>
            <Beobachtung>
              Der Abstand ist <Formel tex={String.raw`\pi`} /> für <Formel tex="b=2" />, <Formel tex={String.raw`\tfrac{\pi}{2}`} /> für <Formel tex="b=4" /> und <Formel tex="4\pi" /> für <Formel tex="b=0{,}5" />. Er ist jedes Mal die Periode <Formel tex={String.raw`p=\tfrac{2\pi}{b}`} />. Weitere Lösungen erhältst du hier durch Addieren oder Subtrahieren ganzzahliger Vielfacher von <Formel tex="p" /> statt von <Formel tex="2\pi" />.
            </Beobachtung>
          </li>
          <li>
            <p>
              Stelle <Formel tex="b=2" /> und <Formel tex={String.raw`s=\tfrac{1}{2}`} /> ein und ändere <Formel tex="c" /> von 0 auf <Formel tex={String.raw`\tfrac{\pi}{2}`} />. Was passiert mit den Lösungen <Formel tex="x" /> und mit den z-Werten? Wie berechnest du <Formel tex="x" /> aus <Formel tex="z" />?
            </p>
            <Beobachtung>
              Alle Lösungen <Formel tex="x" /> verschieben sich um <Formel tex="c" /> nach rechts: aus <Formel tex={String.raw`\tfrac{\pi}{12}`} /> wird <Formel tex={String.raw`\tfrac{\pi}{12}+\tfrac{\pi}{2}=\tfrac{7\pi}{12}`} />. Die z-Werte sind die Lösungen von <Formel tex="\sin(z)=0{,}5" /> und bleiben gleich. Du löst <Formel tex="z=b\,(x-c)" /> nach <Formel tex="x" /> auf: <Formel tex={String.raw`x=\frac{z}{b}+c`} />.
            </Beobachtung>
          </li>
          <li>
            <p>
              Stelle Kosinus mit <Formel tex={String.raw`s=\tfrac{1}{2}`} /> und <Formel tex="b=2" />, <Formel tex="c=0" /> ein. Prüfe, ob die Beziehungen aus dem ersten Teil für die z-Werte gelten.
            </p>
            <Beobachtung>
              Die z-Werte sind die Lösungen von <Formel tex="\cos(z)=0{,}5" /> in <Formel tex={String.raw`[0;\,4\pi]`} />: <Formel tex={String.raw`\tfrac{\pi}{3},\ \tfrac{5\pi}{3},\ \tfrac{7\pi}{3},\ \tfrac{11\pi}{3}`} />. Daraus folgen <Formel tex={String.raw`x=\tfrac{z}{2}`} />: <Formel tex={String.raw`\tfrac{\pi}{6},\ \tfrac{5\pi}{6},\ \tfrac{7\pi}{6},\ \tfrac{11\pi}{6}`} />. Für <Formel tex="z" /> gelten die Beziehungen wie im ersten Teil: <Formel tex={String.raw`z_2=-z_1`} />, im Intervall also <Formel tex={String.raw`2\pi-z_1`} />. Erst nach dem Zurückrechnen erhältst du die Lösungen <Formel tex="x" />.
            </Beobachtung>
          </li>
        </ol>
      </Abschnitt>

      <Abschnitt id="ueberpruefen" titel="Überprüfen">
        <p>
          Gib Zahlen als Dezimalzahl (<code>0,87</code>), als Bruch (<code>1/3</code>) oder als Vielfaches von <Formel tex="\pi" /> (<code>pi/6</code> oder <code>π/6</code>) ein. Wo die Aufgabe <strong>exakt</strong> verlangt, gilt nur die Angabe als Vielfaches von <Formel tex="\pi" />. Wo du den <strong>Taschenrechner</strong> benutzt, werden Dezimalzahlen auf zwei Nachkommastellen genau akzeptiert. Trage Lösungen immer von links nach rechts ein.
        </p>

        <h3>Nur x in der Klammer</h3>
        <Aufgabe
          nummer={1}
          titel="Sinus exakt"
          felder={[
            { id: 'x1', name: 'Lösung 1', beschriftung: <Formel tex="x_1" />, erwartet: x(E1.loesungen)[0]! },
            { id: 'x2', name: 'Lösung 2', beschriftung: <Formel tex="x_2" />, erwartet: x(E1.loesungen)[1]! },
          ]}
          hilfen={[
            <>Suche in der Tabelle den Wert <Formel tex={String.raw`\tfrac{1}{2}`} /> in der Zeile von <Formel tex="\sin(x)" />. Der zugehörige x-Wert ist <Formel tex="x_1" />.</>,
            <>Für die Sinusgleichung gilt: <Formel tex={String.raw`x_2=\pi-x_1`} />.</>,
          ]}
          loesung={[
            <>Die Gleichung hat schon die Form <Formel tex={String.raw`\sin(x)=\tfrac{1}{2}`} />. In der Tabelle steht <Formel tex={String.raw`\sin\!\left(\tfrac{\pi}{6}\right)=\tfrac{1}{2}`} />, also <Formel tex={String.raw`x_1=\tfrac{\pi}{6}`} />.</>,
            <><Formel tex={String.raw`x_2=\pi-\tfrac{\pi}{6}=\tfrac{5\pi}{6}`} />. Beide Lösungen liegen in <Formel tex={String.raw`[0;\,2\pi]`} />, weitere gibt es dort nicht. <Formel tex={String.raw`L=\left\{\tfrac{\pi}{6};\,\tfrac{5\pi}{6}\right\}`} />.</>,
          ]}
        >
          <p>
            Löse <Formel tex={String.raw`\sin(x)=\tfrac{1}{2}`} /> im Intervall <Formel tex={String.raw`[0;\,2\pi]`} /> exakt.
          </p>
        </Aufgabe>

        <Aufgabe
          nummer={2}
          titel="Kosinus mit negativem Wert exakt"
          felder={[
            { id: 'x1', name: 'Lösung 1', beschriftung: <Formel tex="x_1" />, erwartet: x(E2.loesungen)[0]! },
            { id: 'x2', name: 'Lösung 2', beschriftung: <Formel tex="x_2" />, erwartet: x(E2.loesungen)[1]! },
          ]}
          hilfen={[
            <>Die Tabelle enthält nur Werte von 0 bis 1. Rechne mit dem Taschenrechner <Formel tex={String.raw`\cos^{-1}\!\left(-\tfrac{1}{2}\right)`} /> aus und vergleiche mit den Werten <Formel tex={String.raw`\tfrac{\pi}{6}=0{,}52`} />, <Formel tex={String.raw`\tfrac{\pi}{4}=0{,}79`} />, <Formel tex={String.raw`\tfrac{\pi}{3}=1{,}05`} /> und <Formel tex={String.raw`\tfrac{\pi}{2}=1{,}57`} />. Welches Vielfache von <Formel tex="\pi" /> ist der Wert?</>,
            <>Der Taschenrechner liefert 2,09. Das ist <Formel tex={String.raw`\pi-\tfrac{\pi}{3}`} />. Für die Kosinusgleichung gilt <Formel tex={String.raw`x_2=-x_1`} />. Liegt das im Intervall?</>,
          ]}
          loesung={[
            <><Formel tex={String.raw`\cos^{-1}\!\left(-\tfrac{1}{2}\right)=2{,}09\ldots=\tfrac{2\pi}{3}`} />, denn <Formel tex={String.raw`\pi-\tfrac{\pi}{3}=\tfrac{2\pi}{3}`} />. Also <Formel tex={String.raw`x_1=\tfrac{2\pi}{3}`} />.</>,
            <><Formel tex={String.raw`x_2=-x_1=-\tfrac{2\pi}{3}`} /> liegt links von 0, also außerhalb des Intervalls. Du addierst <Formel tex="2\pi" />: <Formel tex={String.raw`x_2=-\tfrac{2\pi}{3}+2\pi=\tfrac{4\pi}{3}`} />. <Formel tex={String.raw`L=\left\{\tfrac{2\pi}{3};\,\tfrac{4\pi}{3}\right\}`} />.</>,
          ]}
        >
          <p>
            Löse <Formel tex={String.raw`\cos(x)=-\tfrac{1}{2}`} /> im Intervall <Formel tex={String.raw`[0;\,2\pi]`} /> exakt.
          </p>
        </Aufgabe>

        <Aufgabe
          nummer={3}
          titel="Sinus mit dem Taschenrechner"
          felder={[
            { id: 'x1', name: 'Taschenrechnerwert x1', beschriftung: <>Taschenrechner <Formel tex="x_1" /></>, erwartet: E3.x1, toleranz: 0.01 },
            { id: 'l1', name: 'Lösung 1 im Intervall', beschriftung: <>Lösung 1</>, erwartet: E3.links, toleranz: 0.01 },
            { id: 'l2', name: 'Lösung 2 im Intervall', beschriftung: <>Lösung 2</>, erwartet: E3.rechts, toleranz: 0.01 },
          ]}
          hilfen={[
            <>Berechne <Formel tex={String.raw`x_1=\sin^{-1}(-0{,}8)`} /> im Bogenmaß. Liegt der Wert im Intervall <Formel tex={String.raw`[0;\,2\pi]`} />?</>,
            <>Der Wert ist negativ, also nicht im Intervall. Mit <Formel tex={String.raw`x_2=\pi-x_1`} /> und mit <Formel tex={String.raw`x_1+2\pi`} /> erhältst du zwei Zahlen. Prüfe, ob sie im Intervall liegen.</>,
          ]}
          loesung={[
            <><Formel tex={`x_1=\\sin^{-1}(-0{,}8)=${zahlTex(E3.x1)}`} /> liegt links von 0, also nicht im Intervall.</>,
            <>Zweite Lösung: <Formel tex={`x_2=\\pi-x_1=${d3(PI)}+${d3(-E3.x1)}=${d3(E3.links)}`} />. Sie liegt im Intervall.</>,
            <>Weitere Lösung durch Addieren einer Periode: <Formel tex={`x_1+2\\pi=-${d3(-E3.x1)}+${d3(2 * PI)}=${d3(E3.rechts)}`} />. Gerundet: <Formel tex={`L=\\{${zahlTex(E3.links)};\\,${zahlTex(E3.rechts)}\\}`} />.</>,
          ]}
        >
          <p>
            Löse <Formel tex="\sin(x)=-0{,}8" /> im Intervall <Formel tex={String.raw`[0;\,2\pi]`} /> mit dem Taschenrechner. Gib zuerst den Wert <Formel tex="x_1" /> des Taschenrechners an, danach die beiden Lösungen im Intervall.
          </p>
          <AufKlick einblenden="Schaubild mit Lösungen einblenden" ausblenden="Schaubild ausblenden">
            <Loesungsschaubild
              g={G3}
              bereich={[-1.5, 2 * PI + 0.5, -1.4, 1.4]}
              xTeilung={PI / 2}
              yTeilung={0.5}
              beschreibung="Schaubild von sinus x mit der Geraden y gleich minus 0,8 im Intervall von 0 bis 2π. Die beiden Schnittstellen im Intervall liegen bei etwa 4,07 und 5,36."
            />
          </AufKlick>
        </Aufgabe>

        <h3>Die Regeln verstehen</h3>
        <Auswahlfrage
          nummer="4a"
          titel="Zweite Lösung beim Sinus"
          optionen={[
            opt('a', zahlTex(PI - F4A.x1).replace('{,}', ','), true, <>Richtig. Beim Sinus gilt <Formel tex={String.raw`x_2=\pi-x_1`} />.</>),
            opt('b', '−0,30', false, <>Die Beziehung <Formel tex={String.raw`x_2=-x_1`} /> gilt für den Kosinus. Außerdem liegt −0,30 nicht im Intervall.</>),
            opt('c', zahlTex(PI + F4A.x1).replace('{,}', ','), false, <>Das ist <Formel tex={String.raw`\pi+x_1`} />. Dort ist <Formel tex="\sin(x)" /> negativ, nämlich −0,3.</>),
            opt('d', zahlTex(2 * PI - F4A.x1).replace('{,}', ','), false, <>Das ist <Formel tex={String.raw`2\pi-x_1`} />. Dort ist <Formel tex="\sin(x)" /> negativ, nämlich −0,3.</>),
          ]}
          erklaerung={<>Beim Sinus sind die beiden Lösungen einer Periode symmetrisch zur Geraden <Formel tex={String.raw`x=\tfrac{\pi}{2}`} />. Daraus folgt <Formel tex={String.raw`x_2=\pi-x_1=${zahlTex(PI - F4A.x1)}`} />. Dieser Wert liegt im Intervall <Formel tex={String.raw`[0;\,2\pi]`} />.</>}
        >
          <p>
            Der Taschenrechner liefert für <Formel tex="\sin(x)=0{,}3" /> den Wert <Formel tex="x_1=0{,}30" />. Welche weitere Lösung liegt im Intervall <Formel tex={String.raw`[0;\,2\pi]`} />?
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="4b"
          titel="Zweite Lösung beim Kosinus"
          optionen={[
            opt('a', zahlTex(PI - F4B.x1).replace('{,}', ','), false, <>Das ist <Formel tex={String.raw`\pi-x_1`} />, die Regel für den Sinus. Dort ist <Formel tex="\cos(x)" /> gleich −0,2.</>),
            opt('b', '−1,37', true, <>Richtig. Beim Kosinus gilt <Formel tex={String.raw`x_2=-x_1`} />, und −1,37 liegt im Intervall <Formel tex={String.raw`[-\pi;\,\pi]`} />.</>),
            opt('c', zahlTex(2 * PI - F4B.x1).replace('{,}', ','), false, <>Das ist zwar auch eine Lösung (<Formel tex={String.raw`-x_1+2\pi`} />), sie liegt aber rechts von <Formel tex="\pi" />, also nicht im Intervall <Formel tex={String.raw`[-\pi;\,\pi]`} />.</>),
            opt('d', '−1,77', false, <>Das ist <Formel tex={String.raw`x_1-\pi`} />. Dort ist <Formel tex="\cos(x)" /> gleich −0,2.</>),
          ]}
          erklaerung={<>Das Schaubild des Kosinus ist symmetrisch zur y-Achse. Deshalb gilt <Formel tex={String.raw`x_2=-x_1=-1{,}37`} />. Beide Lösungen <Formel tex="\pm 1{,}37" /> liegen in <Formel tex={String.raw`[-\pi;\,\pi]`} />.</>}
        >
          <p>
            Der Taschenrechner liefert für <Formel tex="\cos(x)=0{,}2" /> den Wert <Formel tex="x_1=1{,}37" />. Welche weitere Lösung liegt im Intervall <Formel tex={String.raw`[-\pi;\,\pi]`} />?
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="4c"
          titel="Anzahl der Lösungen"
          optionen={[
            opt('a', '0', false, <>Die Gerade <Formel tex="y=-1" /> berührt <Formel tex="K_f" /> in den Tiefpunkten. Es gibt also Lösungen.</>),
            opt('b', '1', false, <>Im Intervall <Formel tex={String.raw`[0;\,4\pi]`} /> liegen zwei Perioden und in jeder Periode gibt es einen Tiefpunkt.</>),
            opt('c', '2', true, <>Richtig. Bei <Formel tex="s=-1" /> fallen die beiden Lösungen zusammen, das ist genau eine Lösung je Periode. Zwei Perioden ergeben zwei Lösungen.</>),
            opt('d', '4', false, <>Zwei Lösungen je Periode gibt es nur für <Formel tex={String.raw`-1<s<1`} />. Bei <Formel tex="s=-1" /> fallen sie zusammen.</>),
          ]}
          erklaerung={<>Die Lösungen von <Formel tex="\sin(x)=-1" /> sind die Stellen der Tiefpunkte: <Formel tex={String.raw`x=\tfrac{3\pi}{2}`} /> und <Formel tex={String.raw`x=\tfrac{7\pi}{2}`} />. Mehr liegen nicht in <Formel tex={String.raw`[0;\,4\pi]`} />.</>}
        >
          <p>
            Wie viele Lösungen hat <Formel tex="\sin(x)=-1" /> im Intervall <Formel tex={String.raw`[0;\,4\pi]`} />?
          </p>
        </Auswahlfrage>

        <Auswahlfrage
          nummer="4d"
          titel="Gleichung ohne Lösung"
          optionen={[
            opt('a', <Formel tex="2\sin(x)=1{,}5" />, false, <>Umgeformt: <Formel tex="\sin(x)=0{,}75" />. Der Wert liegt zwischen −1 und 1, es gibt Lösungen.</>),
            opt('b', <Formel tex="3\cos(x)+1=5" />, true, <>Richtig. Umgeformt: <Formel tex={String.raw`\cos(x)=\tfrac{4}{3}`} />. Dieser Wert ist größer als 1, es gibt keine Lösung.</>),
            opt('c', <Formel tex="4\sin(x)-1=3" />, false, <>Umgeformt: <Formel tex="\sin(x)=1" />. Das ist lösbar, nämlich in den Hochpunkten.</>),
            opt('d', <Formel tex="-2\cos(x)=1{,}8" />, false, <>Umgeformt: <Formel tex="\cos(x)=-0{,}9" />. Der Wert liegt zwischen −1 und 1, es gibt Lösungen.</>),
          ]}
          erklaerung={<>Forme zuerst auf <Formel tex="\sin(x)=s" /> bzw. <Formel tex="\cos(x)=s" /> um. Es gibt nur dann Lösungen, wenn <Formel tex="s" /> zwischen −1 und 1 liegt (beide Werte eingeschlossen). Das ist der Wertebereich von Sinus und Kosinus.</>}
        >
          <p>Welche dieser Gleichungen hat keine Lösung?</p>
        </Auswahlfrage>

        <h3>Mit Umformen</h3>
        <Aufgabe
          nummer={5}
          titel="Beispiel mit mehreren Perioden"
          felder={[
            { id: 's', name: 'Rechte Seite s, gerundet', beschriftung: <><Formel tex="s" /> (gerundet)</>, erwartet: E5.s, toleranz: 0.01 },
            { id: 'x1', name: 'Lösung 1', beschriftung: <Formel tex="x_1" />, erwartet: x(E5.loesungen)[0]! },
            { id: 'x2', name: 'Lösung 2', beschriftung: <Formel tex="x_2" />, erwartet: x(E5.loesungen)[1]! },
            { id: 'x3', name: 'Lösung 3', beschriftung: <Formel tex="x_3" />, erwartet: x(E5.loesungen)[2]! },
            { id: 'x4', name: 'Lösung 4', beschriftung: <Formel tex="x_4" />, erwartet: x(E5.loesungen)[3]! },
          ]}
          hilfen={[
            <>Forme so um, dass <Formel tex="\sin(x)" /> allein steht: erst <Formel tex={String.raw`+\sqrt{3}`} />, dann <Formel tex=":2" />. Die Tabelle nennt den Wert <Formel tex="s" /> in der Zeile von <Formel tex="\sin(x)" />.</>,
            <><Formel tex="x_1" /> und <Formel tex="x_2" /> liegen in <Formel tex={String.raw`[0;\,2\pi]`} />, mit <Formel tex={String.raw`x_2=\pi-x_1`} />. Die beiden anderen liegen in <Formel tex={String.raw`[2\pi;\,4\pi]`} />.</>,
          ]}
          loesung={[
            <><Formel tex={String.raw`-\sqrt{3}+2\sin(x)=0\ \Rightarrow\ \sin(x)=\tfrac{1}{2}\sqrt{3}\approx 0{,}87`} />.</>,
            <>Aus der Tabelle: <Formel tex={String.raw`x_1=\tfrac{\pi}{3}`} />. Zweite Lösung: <Formel tex={String.raw`x_2=\pi-\tfrac{\pi}{3}=\tfrac{2\pi}{3}`} />.</>,
            <>Eine Periode weiter: <Formel tex={String.raw`x_3=\tfrac{\pi}{3}+2\pi=\tfrac{7\pi}{3}`} /> und <Formel tex={String.raw`x_4=\tfrac{2\pi}{3}+2\pi=\tfrac{8\pi}{3}`} />. Die nächsten, <Formel tex={String.raw`\tfrac{13\pi}{3}`} /> und <Formel tex={String.raw`\tfrac{14\pi}{3}`} />, liegen hinter <Formel tex="4\pi" />. <Formel tex={String.raw`L=\left\{\tfrac{\pi}{3};\,\tfrac{2\pi}{3};\,\tfrac{7\pi}{3};\,\tfrac{8\pi}{3}\right\}`} />.</>,
          ]}
        >
          <p>
            Löse <Formel tex={String.raw`-\sqrt{3}+2\sin(x)=0`} /> im Intervall <Formel tex={String.raw`[0;\,4\pi]`} /> exakt. Gib zuerst die rechte Seite <Formel tex="s" /> der umgeformten Gleichung <Formel tex="\sin(x)=s" /> auf zwei Nachkommastellen gerundet an.
          </p>
          <AufKlick einblenden="Schaubild mit Lösungen einblenden" ausblenden="Schaubild ausblenden">
            <Loesungsschaubild
              g={G5}
              bereich={[-0.5, 4 * PI + 0.5, -4.2, 1]}
              xTeilung={PI / 3}
              yTeilung={1}
              beschreibung="Schaubild von g mit g von x gleich 2 mal sinus x minus Wurzel 3 und der x-Achse als Gerade y gleich 0, im Intervall von 0 bis 4π. Die vier Schnittstellen liegen bei π drittel, 2π drittel, 7π drittel und 8π drittel."
            />
          </AufKlick>
        </Aufgabe>

        <Aufgabe
          nummer={6}
          titel="Kosinus mit Taschenrechner"
          felder={[
            { id: 's', name: 'Rechte Seite s, gerundet', beschriftung: <><Formel tex="s" /> (gerundet)</>, erwartet: E6.s, toleranz: 0.01 },
            { id: 'l1', name: 'Lösung 1', beschriftung: <>Lösung 1</>, erwartet: E6.links, toleranz: 0.01 },
            { id: 'l2', name: 'Lösung 2', beschriftung: <>Lösung 2</>, erwartet: E6.rechts, toleranz: 0.01 },
          ]}
          hilfen={[
            <>Forme um: <Formel tex="3\cos(x)+2=1" /> ergibt erst <Formel tex="3\cos(x)=-1" />, dann <Formel tex="\cos(x)=s" />.</>,
            <>Der Taschenrechner liefert <Formel tex={String.raw`x_1=\cos^{-1}(s)`} /> zwischen 0 und <Formel tex="\pi" />. Für den Kosinus gilt <Formel tex={String.raw`x_2=-x_1`} />. Liegen beide im Intervall <Formel tex={String.raw`[-\pi;\,\pi]`} />?</>,
          ]}
          loesung={[
            <><Formel tex={String.raw`3\cos(x)+2=1\ \Rightarrow\ \cos(x)=-\tfrac{1}{3}\approx -0{,}33`} />.</>,
            <><Formel tex={`x_1=\\cos^{-1}\\left(-\\tfrac{1}{3}\\right)=${zahlTex(E6.x1)}`} /> liegt in <Formel tex={String.raw`[-\pi;\,\pi]`} />.</>,
            <><Formel tex={`x_2=-x_1=-${zahlTex(E6.x1)}`} /> liegt ebenfalls im Intervall. <Formel tex={`L=\\{-${zahlTex(E6.x1)};\\,${zahlTex(E6.x1)}\\}`} />.</>,
          ]}
        >
          <p>
            Löse <Formel tex="3\cos(x)+2=1" /> im Intervall <Formel tex={String.raw`[-\pi;\,\pi]`} /> mit dem Taschenrechner. Gib zuerst die rechte Seite <Formel tex="s" /> der umgeformten Gleichung <Formel tex="\cos(x)=s" /> auf zwei Nachkommastellen gerundet an.
          </p>
        </Aufgabe>

        <h3>Mit Substitution</h3>
        <Aufgabe
          nummer={7}
          titel="Kosinus mit 4x"
          felder={[
            { id: 's', name: 'Rechte Seite s', beschriftung: <><Formel tex="s" /></>, erwartet: E7.s },
            { id: 'z1', name: 'Wert z1', beschriftung: <Formel tex="z_1" />, erwartet: E7.z1 },
            { id: 'p', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: E7.p },
            { id: 'x1', name: 'Lösung 1', beschriftung: <Formel tex="x_1" />, erwartet: x(E7.loesungen)[0]! },
            { id: 'x2', name: 'Lösung 2', beschriftung: <Formel tex="x_2" />, erwartet: x(E7.loesungen)[1]! },
            { id: 'x3', name: 'Lösung 3', beschriftung: <Formel tex="x_3" />, erwartet: x(E7.loesungen)[2]! },
            { id: 'x4', name: 'Lösung 4', beschriftung: <Formel tex="x_4" />, erwartet: x(E7.loesungen)[3]! },
          ]}
          hilfen={[
            <>Setze <Formel tex="z=4x" /> und forme um, bis <Formel tex="\cos(z)=s" /> dasteht. Die Tabelle nennt <Formel tex="z_1" />.</>,
            <>Für den Kosinus gilt <Formel tex={String.raw`z_2=-z_1`} />. Die Rücksubstitution ist <Formel tex={String.raw`x=\tfrac{z}{4}`} />. Die Periode ist <Formel tex={String.raw`p=\tfrac{2\pi}{4}`} />.</>,
            <>Du hast zwei Lösungen <Formel tex="x" /> in einer Periode. Addiere die Periode <Formel tex="p" />, bis du aus dem Intervall <Formel tex={String.raw`[0;\,\pi]`} /> herausfällst. Lösungen mit negativem <Formel tex="x" /> musst du ebenfalls um <Formel tex="p" /> verschieben.</>,
          ]}
          loesung={[
            <>Substitution <Formel tex="z=4x" />: <Formel tex="5\cos(z)+10=12{,}5" />, also <Formel tex={String.raw`\cos(z)=\tfrac{12{,}5-10}{5}=\tfrac{1}{2}`} />.</>,
            <>Aus der Tabelle: <Formel tex={String.raw`z_1=\tfrac{\pi}{3}`} />. Kosinus: <Formel tex={String.raw`z_2=-\tfrac{\pi}{3}`} />.</>,
            <>Rücksubstitution mit <Formel tex={String.raw`x=\tfrac{z}{4}`} />: <Formel tex={String.raw`x_1=\tfrac{\pi}{12}`} /> und <Formel tex={String.raw`x_2=-\tfrac{\pi}{12}`} />. Die Periode ist <Formel tex={String.raw`p=\tfrac{2\pi}{4}=\tfrac{\pi}{2}`} />.</>,
            <>Weitere Lösungen mit <Formel tex={String.raw`\pm p`} />: <Formel tex={String.raw`\tfrac{\pi}{12}+\tfrac{\pi}{2}=\tfrac{7\pi}{12}`} />, <Formel tex={String.raw`-\tfrac{\pi}{12}+\tfrac{\pi}{2}=\tfrac{5\pi}{12}`} /> und <Formel tex={String.raw`-\tfrac{\pi}{12}+\pi=\tfrac{11\pi}{12}`} />. Die Lösung <Formel tex={String.raw`-\tfrac{\pi}{12}`} /> liegt links vom Intervall. <Formel tex={String.raw`L=\left\{\tfrac{\pi}{12};\,\tfrac{5\pi}{12};\,\tfrac{7\pi}{12};\,\tfrac{11\pi}{12}\right\}`} />.</>,
          ]}
        >
          <p>
            Löse <Formel tex="5\cos(4x)+10=12{,}5" /> im Intervall <Formel tex={String.raw`[0;\,\pi]`} /> exakt. Gib zuerst die Zahlen <Formel tex="s" />, <Formel tex="z_1" /> und die Periode <Formel tex="p" /> an, danach die vier Lösungen.
          </p>
          <AufKlick einblenden="Schaubild mit Lösungen einblenden" ausblenden="Schaubild ausblenden">
            <Loesungsschaubild
              g={G7}
              bereich={[-0.3, PI + 0.3, 4.5, 15.5]}
              xTeilung={PI / 12}
              yTeilung={2}
              beschreibung="Schaubild von g mit g von x gleich 5 mal kosinus von 4 x plus 10 und die Gerade y gleich 12,5, im Intervall von 0 bis π. Die vier Schnittstellen liegen bei π zwölftel, 5π zwölftel, 7π zwölftel und 11π zwölftel."
            />
          </AufKlick>
        </Aufgabe>

        <Aufgabe
          nummer={8}
          titel="Sinus mit Verschiebung"
          felder={[
            { id: 's', name: 'Rechte Seite s', beschriftung: <Formel tex="s" />, erwartet: E8.s },
            { id: 'z1', name: 'Wert z1', beschriftung: <Formel tex="z_1" />, erwartet: E8.z1 },
            { id: 'x1', name: 'Lösung 1', beschriftung: <Formel tex="x_1" />, erwartet: x(E8.loesungen)[0]! },
            { id: 'x2', name: 'Lösung 2', beschriftung: <Formel tex="x_2" />, erwartet: x(E8.loesungen)[1]! },
            { id: 'x3', name: 'Lösung 3', beschriftung: <Formel tex="x_3" />, erwartet: x(E8.loesungen)[2]! },
            { id: 'x4', name: 'Lösung 4', beschriftung: <Formel tex="x_4" />, erwartet: x(E8.loesungen)[3]! },
          ]}
          hilfen={[
            <>Setze <Formel tex={String.raw`z=2\left(x-\tfrac{\pi}{4}\right)`} />. Forme dann um, bis <Formel tex="\sin(z)=s" /> dasteht.</>,
            <>Für den Sinus gilt <Formel tex={String.raw`z_2=\pi-z_1`} />. Die Rücksubstitution ist <Formel tex={String.raw`x=\tfrac{z}{2}+\tfrac{\pi}{4}`} />. Die Periode ist <Formel tex={String.raw`p=\tfrac{2\pi}{2}=\pi`} />.</>,
          ]}
          loesung={[
            <><Formel tex={String.raw`2\sin(z)+1=2\ \Rightarrow\ \sin(z)=\tfrac{1}{2}`} />, also <Formel tex={String.raw`z_1=\tfrac{\pi}{6}`} /> und <Formel tex={String.raw`z_2=\pi-\tfrac{\pi}{6}=\tfrac{5\pi}{6}`} />.</>,
            <>Rücksubstitution: <Formel tex={String.raw`x_1=\tfrac{\pi}{12}+\tfrac{\pi}{4}=\tfrac{\pi}{3}`} /> und <Formel tex={String.raw`x_2=\tfrac{5\pi}{12}+\tfrac{\pi}{4}=\tfrac{2\pi}{3}`} />.</>,
            <>Die Periode ist <Formel tex="p=\pi" />: <Formel tex={String.raw`x_3=\tfrac{\pi}{3}+\pi=\tfrac{4\pi}{3}`} /> und <Formel tex={String.raw`x_4=\tfrac{2\pi}{3}+\pi=\tfrac{5\pi}{3}`} />. Die nächsten Lösungen liegen hinter <Formel tex="2\pi" />. <Formel tex={String.raw`L=\left\{\tfrac{\pi}{3};\,\tfrac{2\pi}{3};\,\tfrac{4\pi}{3};\,\tfrac{5\pi}{3}\right\}`} />.</>,
          ]}
        >
          <p>
            Löse <Formel tex={String.raw`2\sin\!\left(2\left(x-\tfrac{\pi}{4}\right)\right)+1=2`} /> im Intervall <Formel tex={String.raw`[0;\,2\pi]`} /> exakt. Gib zuerst <Formel tex="s" /> und <Formel tex="z_1" /> der Hilfsgleichung <Formel tex="\sin(z)=s" /> an, danach die vier Lösungen.
          </p>
          <AufKlick einblenden="Schaubild mit Lösungen einblenden" ausblenden="Schaubild ausblenden">
            <Loesungsschaubild
              g={G8}
              bereich={[-0.5, 2 * PI + 0.5, -1.4, 3.4]}
              xTeilung={PI / 6}
              yTeilung={1}
              beschreibung="Schaubild von g mit g von x gleich 2 mal sinus von 2 mal Klammer x minus π viertel plus 1 und die Gerade y gleich 2, im Intervall von 0 bis 2π. Die vier Schnittstellen liegen bei π drittel, 2π drittel, 4π drittel und 5π drittel."
            />
          </AufKlick>
        </Aufgabe>

        <Aufgabe
          nummer={9}
          titel="Kosinus mit Taschenrechner und Substitution"
          felder={[
            { id: 's', name: 'Rechte Seite s, gerundet', beschriftung: <><Formel tex="s" /> (gerundet)</>, erwartet: E9.s, toleranz: 0.01 },
            { id: 'p', name: 'Periode, gerundet', beschriftung: <>Periode <Formel tex="p" /> (gerundet)</>, erwartet: E9.p, toleranz: 0.01 },
            { id: 'l1', name: 'Lösung 1', beschriftung: <>Lösung 1</>, erwartet: E9.links, toleranz: 0.01 },
            { id: 'l2', name: 'Lösung 2', beschriftung: <>Lösung 2</>, erwartet: E9.rechts, toleranz: 0.01 },
          ]}
          hilfen={[
            <>Setze <Formel tex="z=0{,}5\,(x-1)" /> und forme um, bis <Formel tex="\cos(z)=s" /> dasteht. Rechne mit dem Taschenrechner <Formel tex={String.raw`z_1=\cos^{-1}(s)`} /> aus.</>,
            <>Die Rücksubstitution ist <Formel tex="x=\tfrac{z}{0{,}5}+1=2z+1" />. Beachte: <Formel tex="z_2=-z_1" /> liefert ein <Formel tex="x" /> links von 0. Addiere die Periode <Formel tex={String.raw`p=\tfrac{2\pi}{0{,}5}=4\pi`} />.</>,
          ]}
          loesung={[
            <><Formel tex={String.raw`1{,}5\cos(z)+2=3\ \Rightarrow\ \cos(z)=\tfrac{2}{3}\approx 0{,}67`} />.</>,
            <><Formel tex={`z_1=\\cos^{-1}\\left(\\tfrac{2}{3}\\right)=${zahlTex(Math.acos(2 / 3))}`} />, <Formel tex={`z_2=-${zahlTex(Math.acos(2 / 3))}`} />.</>,
            <>Rücksubstitution mit <Formel tex="x=2z+1" />: <Formel tex={`x_1=${zahlTex(E9.links)}`} /> liegt im Intervall <Formel tex={String.raw`[0;\,4\pi]`} />. Der zweite Wert <Formel tex={`${d3(1 - 2 * Math.acos(2 / 3))}`} /> liegt links von 0.</>,
            <>Die Periode ist <Formel tex={String.raw`p=4\pi\approx 12{,}566`} />. Addiere sie zur zweiten Lösung: <Formel tex={`${d3(1 - 2 * Math.acos(2 / 3))}+${d3(4 * PI)}=${d3(E9.rechts)}`} />. Das liegt in <Formel tex={String.raw`[0;\,4\pi]`} />. Gerundet: <Formel tex={`L=\\{${zahlTex(E9.links)};\\,${zahlTex(E9.rechts)}\\}`} />.</>,
          ]}
        >
          <p>
            Löse <Formel tex="1{,}5\cos(0{,}5\,(x-1))+2=3" /> im Intervall <Formel tex={String.raw`[0;\,4\pi]`} /> mit dem Taschenrechner. Gib zuerst <Formel tex="s" /> der Hilfsgleichung <Formel tex="\cos(z)=s" /> und die Periode <Formel tex="p" /> an, danach die Lösungen im Intervall.
          </p>
          <AufKlick einblenden="Schaubild mit Lösungen einblenden" ausblenden="Schaubild ausblenden">
            <Loesungsschaubild
              g={G9}
              bereich={[-0.5, 4 * PI + 0.5, 0, 4]}
              xTeilung={PI}
              yTeilung={1}
              beschreibung="Schaubild von g mit g von x gleich 1,5 mal kosinus von 0,5 mal Klammer x minus 1 plus 2 und die Gerade y gleich 3, im Intervall von 0 bis 4π. Die beiden Schnittstellen liegen bei etwa 2,68 und 11,88."
            />
          </AufKlick>
        </Aufgabe>

        <h3>Anwenden</h3>
        <Aufgabe
          nummer={10}
          titel="Wasserstand"
          felder={[
            { id: 's', name: 'Rechte Seite s', beschriftung: <Formel tex="s" />, erwartet: E10.s },
            { id: 't1', name: 'Zeitpunkt 1', beschriftung: <><Formel tex="t_1" /> in Stunden</>, erwartet: x(E10.loesungen)[0]!, toleranz: 0.01 },
            { id: 't2', name: 'Zeitpunkt 2', beschriftung: <><Formel tex="t_2" /> in Stunden</>, erwartet: x(E10.loesungen)[1]!, toleranz: 0.01 },
            { id: 't3', name: 'Zeitpunkt 3', beschriftung: <><Formel tex="t_3" /> in Stunden</>, erwartet: x(E10.loesungen)[2]!, toleranz: 0.01 },
            { id: 't4', name: 'Zeitpunkt 4', beschriftung: <><Formel tex="t_4" /> in Stunden</>, erwartet: x(E10.loesungen)[3]!, toleranz: 0.01 },
          ]}
          hilfen={[
            <>Setze <Formel tex={String.raw`z=\tfrac{\pi}{6}\,(t-2)`} /> und forme <Formel tex="h(t)=4{,}75" /> um zu <Formel tex="\sin(z)=s" />.</>,
            <>Die Periode ist <Formel tex={String.raw`p=\tfrac{2\pi}{\pi/6}=12`} /> Stunden. Die Rücksubstitution ist <Formel tex={String.raw`t=\tfrac{6}{\pi}\,z+2`} />.</>,
          ]}
          loesung={[
            <><Formel tex={String.raw`1{,}5\sin(z)+4=4{,}75\ \Rightarrow\ \sin(z)=\tfrac{0{,}75}{1{,}5}=\tfrac{1}{2}`} />, also <Formel tex={String.raw`z_1=\tfrac{\pi}{6}`} /> und <Formel tex={String.raw`z_2=\tfrac{5\pi}{6}`} />.</>,
            <>Rücksubstitution: <Formel tex={String.raw`t_1=\tfrac{6}{\pi}\cdot\tfrac{\pi}{6}+2=3`} /> und <Formel tex={String.raw`t_2=\tfrac{6}{\pi}\cdot\tfrac{5\pi}{6}+2=7`} />.</>,
            <>Eine Periode (12 Stunden) später: <Formel tex="t_3=15" /> und <Formel tex="t_4=19" />. Die nächsten Lösungen, 27 und 31, liegen nach Mitternacht. Der Wasserstand beträgt also um 3 Uhr, 7 Uhr, 15 Uhr und 19 Uhr genau 4,75 m.</>,
          ]}
        >
          <p>
            Der Wasserstand an einem Pegel wird in einem vereinfachten Modell beschrieben durch <Formel tex={String.raw`h(t)=1{,}5\sin\!\left(\tfrac{\pi}{6}\,(t-2)\right)+4`} />. Dabei ist <Formel tex="t" /> die Zeit in Stunden seit Mitternacht (<Formel tex="0\le t\le 24" />) und <Formel tex="h(t)" /> der Wasserstand in Metern. Zu welchen Zeitpunkten <Formel tex="t" /> beträgt der Wasserstand 4,75 m? Gib zuerst die rechte Seite <Formel tex="s" /> der Hilfsgleichung <Formel tex="\sin(z)=s" /> an, danach die Zeitpunkte.
          </p>
        </Aufgabe>
      </Abschnitt>

      <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
        <h3>
          Gleichungen mit nur <Formel tex="x" /> in der Klammer
        </h3>
        <Hinweis art="merksatz" titel="Lösen von a·sin(x) + d = e bzw. a·cos(x) + d = e">
          <ol className="liste">
            <li>
              <strong>Umformen</strong> zu <Formel tex="\sin(x)=s" /> bzw. <Formel tex="\cos(x)=s" /> mit <Formel tex={String.raw`s=\dfrac{e-d}{a}`} />.
            </li>
            <li>
              <strong>Prüfen:</strong> Ist <Formel tex="s>1" /> oder <Formel tex="s<-1" />, gibt es keine Lösung. Ist <Formel tex="s=1" /> oder <Formel tex="s=-1" />, gibt es nur eine Lösung je Periode (Hoch- bzw. Tiefpunkt).
            </li>
            <li>
              <strong>Eine Lösung <Formel tex="x_1" /></strong> bestimmen: mit der Tabelle exakt oder mit dem Taschenrechner im Bogenmaß.
            </li>
            <li>
              <strong>Zweite Lösung in der Periode:</strong> Sinus <Formel tex={String.raw`x_2=\pi-x_1`} />, Kosinus <Formel tex={String.raw`x_2=-x_1`} />.
            </li>
            <li>
              <strong>Weitere Lösungen:</strong> <Formel tex={String.raw`x_1+k\cdot 2\pi`} /> und <Formel tex={String.raw`x_2+k\cdot 2\pi`} /> mit ganzer Zahl <Formel tex="k" /> (Typ 1 und Typ 2), bis du aus dem Intervall herausfällst.
            </li>
            <li>
              <strong>Intervall beachten:</strong> Nur Lösungen im Intervall gehören zu <Formel tex="L" />. Sortiere sie aufsteigend. Mit der Probe kontrollierst du das Ergebnis.
            </li>
          </ol>
        </Hinweis>
        <p>
          Die Beziehungen in Schritt 4 folgen aus der Symmetrie der Schaubilder: Das Schaubild des Sinus ist symmetrisch zur Geraden <Formel tex={String.raw`x=\tfrac{\pi}{2}`} />, das Schaubild des Kosinus ist symmetrisch zur y-Achse. Beim Kosinus liegt <Formel tex="-x_1" /> links von 0. Im Intervall <Formel tex={String.raw`[0;\,2\pi]`} /> ist <Formel tex={String.raw`x_2=2\pi-x_1`} /> die passende Lösung.
        </p>

        <h3>Negative Werte exakt bestimmen</h3>
        <p>
          Die Tabelle enthält nur Werte von 0 bis 1. Für negative Werte <Formel tex="-s" /> mit <Formel tex="s" /> aus der Tabelle gilt:
        </p>
        <ul className="liste">
          <li><Formel tex={String.raw`\sin^{-1}(-s)=-\sin^{-1}(s)`} />, zum Beispiel <Formel tex={String.raw`\sin(x)=-\tfrac{1}{2}\sqrt{2}`} /> mit <Formel tex={String.raw`x_1=-\tfrac{\pi}{4}`} />.</li>
          <li><Formel tex={String.raw`\cos^{-1}(-s)=\pi-\cos^{-1}(s)`} />, zum Beispiel <Formel tex={String.raw`\cos(x)=-\tfrac{1}{2}\sqrt{2}`} /> mit <Formel tex={String.raw`x_1=\pi-\tfrac{\pi}{4}=\tfrac{3\pi}{4}`} />.</li>
        </ul>

        <h3>Gleichungen mit b und c im Argument</h3>
        <Hinweis art="merksatz" titel="Lösen von a·sin(b(x − c)) + d = e bzw. a·cos(b(x − c)) + d = e (b > 0)">
          <ol className="liste">
            <li>
              <strong>Substituieren:</strong> <Formel tex="z=b\,(x-c)" />.
            </li>
            <li>
              <strong>Umformen</strong> zu <Formel tex="\sin(z)=s" /> bzw. <Formel tex="\cos(z)=s" /> mit <Formel tex={String.raw`s=\dfrac{e-d}{a}`} />.
            </li>
            <li>
              <strong>Lösen:</strong> <Formel tex="z_1" /> mit Tabelle oder Taschenrechner, <Formel tex="z_2" /> mit <Formel tex={String.raw`z_2=\pi-z_1`} /> (Sinus) bzw. <Formel tex={String.raw`z_2=-z_1`} /> (Kosinus).
            </li>
            <li>
              <strong>Rücksubstituieren:</strong> <Formel tex={String.raw`x=\dfrac{z}{b}+c`} /> für <Formel tex="z_1" /> und <Formel tex="z_2" />.
            </li>
            <li>
              <strong>Weitere Lösungen:</strong> Zu <Formel tex="x_1" /> und <Formel tex="x_2" /> ganzzahlige Vielfache der Periode <Formel tex={String.raw`p=\dfrac{2\pi}{b}`} /> addieren oder subtrahieren, bis du aus dem Intervall herausfällst.
            </li>
            <li>
              <strong>Intervall beachten</strong> und aufsteigend sortieren.
            </li>
          </ol>
        </Hinweis>

        <h3>Wichtige Werte</h3>
        <table className="tabelle tabelle-kompakt">
          <caption>Eine Lösung <Formel tex="x_1" /> für Werte aus der Tabelle</caption>
          <thead>
            <tr>
              <th scope="col"><Formel tex="s" /></th>
              <th scope="col"><Formel tex="0" /></th>
              <th scope="col"><Formel tex={String.raw`\tfrac{1}{2}`} /></th>
              <th scope="col"><Formel tex={String.raw`\tfrac{1}{2}\sqrt{2}`} /></th>
              <th scope="col"><Formel tex={String.raw`\tfrac{1}{2}\sqrt{3}`} /></th>
              <th scope="col"><Formel tex="1" /></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><Formel tex={String.raw`\sin(x)=s`} /></th>
              <td><Formel tex="0" /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{6}`} /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{4}`} /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{3}`} /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{2}`} /></td>
            </tr>
            <tr>
              <th scope="row"><Formel tex={String.raw`\cos(x)=s`} /></th>
              <td><Formel tex={String.raw`\tfrac{\pi}{2}`} /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{3}`} /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{4}`} /></td>
              <td><Formel tex={String.raw`\tfrac{\pi}{6}`} /></td>
              <td><Formel tex="0" /></td>
            </tr>
          </tbody>
        </table>

        <h3>Typische Fehler</h3>
        <ul className="liste">
          <li>Der Taschenrechner steht auf Gradmaß (DEG) statt auf Bogenmaß (RAD).</li>
          <li>Nur <Formel tex="x_1" /> angegeben und die zweite Lösung vergessen.</li>
          <li>Die Regel des Sinus (<Formel tex={String.raw`\pi-x_1`} />) beim Kosinus oder umgekehrt verwendet.</li>
          <li>Lösungen außerhalb des Intervalls nicht aussortiert oder den Taschenrechnerwert ungeprüft übernommen.</li>
          <li>Bei Gleichungen mit <Formel tex="b" />: Die Periode <Formel tex="2\pi" /> statt <Formel tex={String.raw`\tfrac{2\pi}{b}`} /> addiert oder bei der Rücksubstitution nicht durch <Formel tex="b" /> geteilt.</li>
        </ul>
      </Abschnitt>
    </>
  );
}
