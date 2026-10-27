import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { t } from '@/lib/modulhilfen';

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Zwei Arten, Funktionen zusammenzusetzen</h3>
      <p>
        Mit der Potenz-, Faktor- und Summenregel kannst du Summen und Vielfache der Grundfunktionen ableiten. Viele Terme sind aber anders aufgebaut. Du kennst zwei Arten, aus Funktionen eine neue zu bilden (siehe <Modulverweis modul="summe-produkt-funktionen">Summe, Differenz und Produkt von Funktionen</Modulverweis> und <Modulverweis modul="verkettung">Verkettung von Funktionen</Modulverweis>):
      </p>
      <ul className="liste">
        <li>
          Das <strong>Produkt</strong> zweier Funktionen: <Formel tex={t`f(x)=u(x)\cdot v(x)`} nach="." /> Beide Funktionen werden mit demselben <Formel tex="x" /> berechnet und miteinander multipliziert.
        </li>
        <li>
          Die <strong>Verkettung</strong>: <Formel tex="f(x)=u(v(x))" nach="." /> Zuerst wird die <strong>innere Funktion</strong> <Formel tex="v" /> berechnet, ihr Ergebnis wird in die <strong>äußere Funktion</strong> <Formel tex="u" /> eingesetzt.
        </li>
      </ul>
      <table className="tabelle tabelle-kompakt">
        <caption>Produkt oder Verkettung?</caption>
        <thead>
          <tr>
            <th scope="col">Term</th>
            <th scope="col">Aufbau</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><Formel tex="x^2\cdot e^x" /></td><td>Produkt aus <Formel tex="u(x)=x^2" /> und <Formel tex="v(x)=e^x" /></td></tr>
          <tr><td><Formel tex={t`\sin(2x)`} /></td><td>Verkettung mit <Formel tex="v(x)=2x" /> innen und <Formel tex={t`u(v)=\sin v`} /> außen</td></tr>
          <tr><td><Formel tex={t`\sqrt{5-2x}`} /></td><td>Verkettung mit <Formel tex="v(x)=5-2x" /> innen und <Formel tex={t`u(v)=\sqrt{v}`} /> außen</td></tr>
          <tr><td><Formel tex="(2x+1)^4" /></td><td>Verkettung mit <Formel tex="v(x)=2x+1" /> innen und <Formel tex="u(v)=v^4" /> außen</td></tr>
          <tr><td><Formel tex={t`x\cdot\sin(x^2)`} /></td><td>Produkt aus <Formel tex="x" /> und <Formel tex={t`\sin(x^2)`} nach="," /> der zweite Faktor ist selbst eine Verkettung</td></tr>
        </tbody>
      </table>
      <Hinweis titel="Innere und äußere Funktion finden">
        Frage dich, was du zuletzt rechnest. Bei <Formel tex={t`\sin(2x)`} /> rechnest du zuerst <Formel tex="2x" /> und dann den Sinus davon. Der Sinus ist die äußere Funktion, <Formel tex="2x" /> die innere. Bei <Formel tex="x^2\cdot e^x" /> rechnest du zuletzt ein Produkt, es ist also kein Fall für die Verkettung.
      </Hinweis>

      <h3>Schreibweisen</h3>
      <ul className="liste">
        <li><Formel tex="u'" /> und <Formel tex="v'" /> sind die Ableitungen von <Formel tex="u" /> und <Formel tex="v" nach="." /></li>
        <li>
          <Formel tex="u'(v(x))" /> bedeutet: Leite die äußere Funktion <Formel tex="u" /> ab und setze danach für ihre Variable <Formel tex="v(x)" /> ein. Bei <Formel tex={t`u(v)=\sin v`} /> ist <Formel tex={t`u'(v)=\cos v`} /> und damit <Formel tex={t`u'(v(x))=\cos(v(x))`} nach="." />
        </li>
      </ul>
      <p>
        Wie man Produkte und Verkettungen ableitet, findest du im nächsten Abschnitt heraus. Dafür brauchst du nur die Ableitungen der Grundfunktionen aus dem Modul <Modulverweis modul="ableitungsregeln">Ableitungsregeln</Modulverweis>.
      </p>
    </Abschnitt>
  );
}
