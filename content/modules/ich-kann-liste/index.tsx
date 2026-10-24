import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { AufKlick } from '@/components/AufKlick';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage, type Option } from '@/components/Auswahlfrage';
import { Einheitskreis } from '@/components/Einheitskreis';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { zahlText, zahlTex } from '@/lib/zahlen';
import { termSinus } from '@/lib/sinus';
import {
  AUSSAGEN, GRUPPEN, K1, K10A, K10B, K10_E, K11, K11_E, K12, K12_TABELLE, K13, K15, K16, K17, K17_E, K2, K3, K4, K5A, K5B, K6, K7, K8, K9,
  MODULE, MONATE, TOL2, cosF, sinF, type Aussage, type Gruppe,
} from './daten';
import { WAHL_TEXT, WAHL_ZEICHEN, kontrollStatus, nachDringlichkeit, zaehle, type Empfehlung, type KontrollStatus } from './auswertung';
import { FARBEN, Kontrollbild, ORANGE } from './Kontrollbild';
import { Punkt, Verweise } from './Punkt';
import { ZustandAnbieter, useIchKann } from './Zustand';

const PI = Math.PI;
const t = String.raw;
const opt = (id: string, text: ReactNode, richtig: boolean, rueckmeldung: ReactNode): Option => ({ id, text, richtig, rueckmeldung });
/** Dezimalzahl mit drei Nachkommastellen in TeX, damit Zwischenschritte im Lösungsweg stimmig rechnen. */
const d3 = (v: number) => String(Math.round(v * 1000) / 1000).replace('.', '{,}');
const z2 = zahlTex;
const text2 = zahlText;

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

const aussagenDerGruppe = (g: Gruppe) => AUSSAGEN.filter((a) => a.gruppe === g);

/** Eingabehinweis, der in jedem Bereich mit Kontrollaufgaben steht. */
function Eingabehinweis({ rechner = false }: { rechner?: boolean }) {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als Dezimalzahl (<code>0,87</code>), als Bruch (<code>1/3</code>) oder als Vielfaches von <Formel tex="\pi" /> (<code>pi/6</code>) ein, ohne Einheit. Dezimalzahlen werden bei den Rechenaufgaben auf zwei Nachkommastellen genau akzeptiert.
      {rechner && <> Achte auf die Einstellung des Taschenrechners: Gradmaß (DEG) oder Bogenmaß (RAD).</>}
    </Hinweis>
  );
}

/* ---------- Abschnitt Anleitung ---------- */

function Anleitung() {
  return (
    <Abschnitt id="anleitung" titel="Anleitung">
      <h3>Wozu diese Liste?</h3>
      <p>
        Die Liste fasst zusammen, was du zu den trigonometrischen Funktionen können sollst (Bildungsplan 2021, Berufliches Gymnasium, erhöhtes Anforderungsniveau, BPE 10.1 bis 10.6). Du schätzt dich bei jeder Aussage selbst ein und prüfst deine Einschätzung mit einer kurzen Kontrollaufgabe. Am Ende zeigt dir die Auswertung, womit du anfangen solltest und welches Modul dir dabei hilft.
      </p>

      <h3>So gehst du vor</h3>
      <ol className="liste">
        <li>Öffne nacheinander die vier Bereiche in der Leiste oben: Einheitskreis, Schaubild und Term, Gleichungen, Anwendungen.</li>
        <li>Lies jede Aussage „Ich kann …“ und wähle deine Einschätzung.</li>
        <li>
          Wenn du das Gefühl hast, dass du es schon kannst, bearbeite die Kontrollaufgabe. Das Ergebnis hilft dir bei der Entscheidung, bei welchen Themen du noch intensiv lernen musst. Die Kontrollaufgaben sind klein. Hilfen und Lösungsweg kannst du schrittweise aufdecken.
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
        Die Aussagen 1 bis 13 und die Aussage mit dem Ausrufezeichen entsprechen der Ich-Kann-Liste aus dem Unterricht. Die Aussagen 14 bis 17 sind nach dem Bildungsplan ergänzt, weil dort ausdrücklich steht, dass du sie können sollst. Sie sind mit einem Abzeichen gekennzeichnet.
      </p>
    </Abschnitt>
  );
}

/* ---------- Abschnitt Einheitskreis ---------- */

function EinheitskreisBereich() {
  const { melde } = useIchKann();
  const m = (id: string, teil = '1') => (r: boolean) => melde(id, teil, r);
  return (
    <Abschnitt id="einheitskreis" titel="Einheitskreis">
      <p>Hier geht es um Sinus und Kosinus am Einheitskreis, um das Bogenmaß und um die Grundkurven.</p>
      <Eingabehinweis rechner />

      <Punkt id="wert-einheitskreis">
        <Aufgabe
          nummer="K1"
          titel="Sinus und Kosinus ablesen"
          beiErgebnis={m('wert-einheitskreis')}
          felder={[
            { id: 'a', name: 'Sinus von 50 Grad', beschriftung: <Formel tex={t`\sin(50^\circ)`} />, erwartet: K1.sinGrad, toleranz: TOL2 },
            { id: 'b', name: 'Kosinus von 50 Grad', beschriftung: <Formel tex={t`\cos(50^\circ)`} />, erwartet: K1.cosGrad, toleranz: TOL2 },
            { id: 'c', name: 'Sinus von 5 pi durch 6', beschriftung: <Formel tex={t`\sin\!\left(\tfrac{5\pi}{6}\right)`} />, erwartet: K1.sinX, toleranz: TOL2 },
            { id: 'd', name: 'Kosinus von 5 pi durch 6', beschriftung: <Formel tex={t`\cos\!\left(\tfrac{5\pi}{6}\right)`} />, erwartet: K1.cosX, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Am Einheitskreis ist <Formel tex={t`\cos\alpha`} /> die x-Koordinate und <Formel tex={t`\sin\alpha`} /> die y-Koordinate des Punkts <Formel tex="P" /> zum Winkel <Formel tex={t`\alpha`} nach="." /> Bei a und b ist der Winkel im Gradmaß gegeben, bei c und d im Bogenmaß.</>,
            <><Formel tex={t`\tfrac{5\pi}{6}`} /> entspricht <Formel tex={t`150^\circ`} nach="." /> Der Punkt liegt im zweiten Feld: Die x-Koordinate ist negativ, die y-Koordinate positiv. Er liegt symmetrisch zum Punkt für <Formel tex={t`30^\circ`} /> (also <Formel tex={t`\tfrac{\pi}{6}`} nach=")" /> zur y-Achse.</>,
          ]}
          loesung={[
            <>Der Taschenrechner steht im Gradmaß: <Formel tex={`\\sin(50^\\circ)\\approx ${d3(K1.sinGrad)}`} nach="," /> <Formel tex={`\\cos(50^\\circ)\\approx ${d3(K1.cosGrad)}`} nach="." /> Probe: <Formel tex={t`\sin^2\alpha+\cos^2\alpha=1`} nach="," /> denn <Formel tex={`${d3(K1.sinGrad)}^2+${d3(K1.cosGrad)}^2\\approx 1`} nach="." /></>,
            <><Formel tex={t`\tfrac{5\pi}{6}=150^\circ`} nach="." /> Zu <Formel tex={t`150^\circ`} /> gehört der an der y-Achse gespiegelte Punkt zu <Formel tex={t`30^\circ`} nach="." /> Also <Formel tex={t`\sin\!\left(\tfrac{5\pi}{6}\right)=\sin\!\left(\tfrac{\pi}{6}\right)=\tfrac{1}{2}=${z2(K1.sinX)}`} nach="," /> <Formel tex={t`\cos\!\left(\tfrac{5\pi}{6}\right)=-\cos\!\left(\tfrac{\pi}{6}\right)=-\tfrac{\sqrt{3}}{2}\approx ${d3(K1.cosX)}`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme die vier Werte mithilfe des Einheitskreises oder des Taschenrechners. Dezimalzahlen auf zwei Nachkommastellen.
          </p>
        </Aufgabe>
        <Kontrollschaubild>
          <figure className="bild bild-schmal">
            <Kontrollbild
              bereich={[-1.5, 1.5, -1.5, 1.5]}
              xTeilung={1}
              yTeilung={1}
              kreis
              className="brett-quadrat"
              punkte={[
                { x: K1.cosGrad, y: K1.sinGrad, text: 'P1', lot: true, lage: 'rechts' },
                { x: K1.cosX, y: K1.sinX, text: 'P2', lot: true, lage: 'links' },
              ]}
              beschreibung={`Einheitskreis mit zwei Punkten. Zu 50 Grad gehört der Punkt P1 mit der x-Koordinate ${text2(K1.cosGrad)} und der y-Koordinate ${text2(K1.sinGrad)}. Zu 5π/6, das sind 150 Grad, gehört der Punkt P2 mit der x-Koordinate ${text2(K1.cosX)} und der y-Koordinate ${text2(K1.sinX)}.`}
            />
            <figcaption>
              <Formel tex={`P_1(${z2(K1.cosGrad)}\\,|\\,${z2(K1.sinGrad)})`} /> gehört zu <Formel tex={t`50^\circ`} nach="," /> <Formel tex={`P_2(${z2(K1.cosX)}\\,|\\,${z2(K1.sinX)})`} /> gehört zu <Formel tex={t`\tfrac{5\pi}{6}`} nach="." /> Die x-Koordinate ist der Kosinus, die y-Koordinate der Sinus.
            </figcaption>
          </figure>
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="winkel-einheitskreis">
        <Aufgabe
          nummer="K2"
          titel="Zwei Winkel zu einem Wert"
          beiErgebnis={m('winkel-einheitskreis')}
          felder={[
            { id: 'a1', name: 'Kleinerer Winkel mit sin alpha gleich 0,6', beschriftung: <><Formel tex={t`\alpha_1`} /> bei <Formel tex={t`\sin\alpha=0{,}6`} /> in Grad</>, erwartet: K2.sin[0], toleranz: K2.toleranz },
            { id: 'a2', name: 'Größerer Winkel mit sin alpha gleich 0,6', beschriftung: <><Formel tex={t`\alpha_2`} /> bei <Formel tex={t`\sin\alpha=0{,}6`} /> in Grad</>, erwartet: K2.sin[1], toleranz: K2.toleranz },
            { id: 'b1', name: 'Kleinerer Winkel mit cos alpha gleich minus 0,3', beschriftung: <><Formel tex={t`\beta_1`} /> bei <Formel tex={t`\cos\beta=-0{,}3`} /> in Grad</>, erwartet: K2.cos[0], toleranz: K2.toleranz },
            { id: 'b2', name: 'Größerer Winkel mit cos alpha gleich minus 0,3', beschriftung: <><Formel tex={t`\beta_2`} /> bei <Formel tex={t`\cos\beta=-0{,}3`} /> in Grad</>, erwartet: K2.cos[1], toleranz: K2.toleranz },
          ]}
          hilfen={[
            <>Zu <Formel tex={t`\sin\alpha=0{,}6`} /> gehört am Einheitskreis die waagerechte Gerade auf der Höhe <Formel tex="0{,}6" nach="." /> Sie schneidet den Kreis in zwei Punkten, die symmetrisch zur y-Achse liegen. Zu <Formel tex={t`\cos\beta=-0{,}3`} /> gehört die senkrechte Gerade bei <Formel tex={t`x=-0{,}3`} nach="." /> Die beiden Schnittpunkte liegen symmetrisch zur x-Achse.</>,
            <>Der Taschenrechner (Gradmaß) liefert den ersten Winkel mit <Formel tex={t`\sin^{-1}(0{,}6)`} /> bzw. <Formel tex={t`\cos^{-1}(-0{,}3)`} nach="." /> Den zweiten Winkel findest du über die Symmetrie: beim Sinus <Formel tex={t`180^\circ-\alpha_1`} nach="," /> beim Kosinus <Formel tex={t`360^\circ-\beta_1`} nach="." /></>,
          ]}
          loesung={[
            <>Sinus: <Formel tex={`\\alpha_1=\\sin^{-1}(0{,}6)\\approx ${d3(K2.sin[0])}^\\circ`} nach="." /> Der zweite Schnittpunkt liegt symmetrisch zur y-Achse: <Formel tex={`\\alpha_2=180^\\circ-${d3(K2.sin[0])}^\\circ=${d3(K2.sin[1])}^\\circ`} nach="." /></>,
            <>Kosinus: <Formel tex={`\\beta_1=\\cos^{-1}(-0{,}3)\\approx ${d3(K2.cos[0])}^\\circ`} nach="." /> Der zweite Schnittpunkt liegt symmetrisch zur x-Achse: <Formel tex={`\\beta_2=360^\\circ-${d3(K2.cos[0])}^\\circ=${d3(K2.cos[1])}^\\circ`} nach="." /></>,
            <>Probe mit dem Taschenrechner: <Formel tex={`\\sin(${d3(K2.sin[1])}^\\circ)\\approx 0{,}6`} /> und <Formel tex={`\\cos(${d3(K2.cos[1])}^\\circ)\\approx -0{,}3`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme jeweils zwei Winkel zwischen <Formel tex={t`0^\circ`} /> und <Formel tex={t`360^\circ`} /> im Gradmaß, auf eine Nachkommastelle genau. Gib bei jedem Paar den kleineren Winkel zuerst ein.
          </p>
          <ul className="liste">
            <li><Formel tex={t`\sin\alpha=0{,}6`} /></li>
            <li><Formel tex={t`\cos\beta=-0{,}3`} /></li>
          </ul>
        </Aufgabe>
        <Kontrollschaubild>
          <figure className="bild bild-schmal">
            <Kontrollbild
              bereich={[-1.5, 1.5, -1.5, 1.5]}
              xTeilung={1}
              yTeilung={1}
              kreis
              className="brett-quadrat"
              linien={[{ art: 'waagerecht', wert: 0.6, gestrichelt: true }]}
              punkte={[
                { x: Math.cos((K2.sin[0] * PI) / 180), y: 0.6, text: 'α1', lage: 'rechts' },
                { x: Math.cos((K2.sin[1] * PI) / 180), y: 0.6, text: 'α2', lage: 'links' },
              ]}
              beschreibung={`Einheitskreis mit der waagerechten Geraden y gleich 0,6. Sie schneidet den Kreis bei den Winkeln α1 gleich ${text2(K2.sin[0])} Grad und α2 gleich ${text2(K2.sin[1])} Grad, symmetrisch zur y-Achse.`}
            />
            <figcaption>
              Die Gerade <Formel tex="y=0{,}6" /> schneidet den Kreis bei <Formel tex={`\\alpha_1\\approx ${d3(K2.sin[0])}^\\circ`} /> und <Formel tex={`\\alpha_2\\approx ${d3(K2.sin[1])}^\\circ`} nach="," /> symmetrisch zur y-Achse.
            </figcaption>
          </figure>
          <figure className="bild bild-schmal">
            <Kontrollbild
              bereich={[-1.5, 1.5, -1.5, 1.5]}
              xTeilung={1}
              yTeilung={1}
              kreis
              className="brett-quadrat"
              linien={[{ art: 'senkrecht', wert: -0.3, gestrichelt: true }]}
              punkte={[
                { x: -0.3, y: Math.sin((K2.cos[0] * PI) / 180), text: 'β1', lage: 'rechts' },
                { x: -0.3, y: Math.sin((K2.cos[1] * PI) / 180), text: 'β2', lage: 'rechts' },
              ]}
              beschreibung={`Einheitskreis mit der senkrechten Geraden x gleich minus 0,3. Sie schneidet den Kreis bei den Winkeln β1 gleich ${text2(K2.cos[0])} Grad und β2 gleich ${text2(K2.cos[1])} Grad, symmetrisch zur x-Achse.`}
            />
            <figcaption>
              Die Gerade <Formel tex="x=-0{,}3" /> schneidet den Kreis bei <Formel tex={`\\beta_1\\approx ${d3(K2.cos[0])}^\\circ`} /> und <Formel tex={`\\beta_2\\approx ${d3(K2.cos[1])}^\\circ`} nach="," /> symmetrisch zur x-Achse.
            </figcaption>
          </figure>
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="bogenmass">
        <Aufgabe
          nummer="K3"
          titel="Gradmaß und Bogenmaß"
          beiErgebnis={m('bogenmass')}
          felder={[
            { id: 'a', name: 'Bogenmaß von 105 Grad', beschriftung: <>Bogenmaß von <Formel tex={t`105^\circ`} /></>, erwartet: K3.bogen, toleranz: 0.005 },
            { id: 'b', name: 'Gradmaß von 5 pi durch 9', beschriftung: <>Gradmaß von <Formel tex={t`\tfrac{5\pi}{9}`} /></>, erwartet: K3.gradVonX, toleranz: 0.01 },
          ]}
          hilfen={[
            <>Ein voller Umlauf hat <Formel tex={t`360^\circ`} /> und im Bogenmaß <Formel tex={t`2\pi`} nach="." /> Es gilt die Verhältnisgleichung <Formel tex={t`\dfrac{\alpha}{360^\circ}=\dfrac{x}{2\pi}`} nach="." /></>,
            <>Bei a stellst du nach <Formel tex="x" /> um: <Formel tex={t`x=\dfrac{\alpha}{360^\circ}\cdot 2\pi`} nach="." /> Bei b nach <Formel tex={t`\alpha`} nach=":" /> <Formel tex={t`\alpha=\dfrac{x}{2\pi}\cdot 360^\circ`} nach="." /> Gib a als Bruch mit <Formel tex="\pi" /> ein, zum Beispiel <code>pi/6</code>.</>,
          ]}
          loesung={[
            <><Formel tex={t`x=\dfrac{105^\circ}{360^\circ}\cdot 2\pi=\dfrac{105}{180}\,\pi=\dfrac{7}{12}\,\pi\approx ${d3(K3.bogen)}`} nach="." /></>,
            <><Formel tex={t`\alpha=\dfrac{5\pi/9}{2\pi}\cdot 360^\circ=\dfrac{5}{18}\cdot 360^\circ=${K3.gradVonX}^\circ`} nach="." /></>,
          ]}
        >
          <ul className="liste">
            <li>Rechne <Formel tex={t`105^\circ`} /> ins Bogenmaß um.</li>
            <li>Rechne <Formel tex={t`x=\tfrac{5\pi}{9}`} /> ins Gradmaß um.</li>
          </ul>
        </Aufgabe>
        <Kontrollschaubild>
          <div className="bild-schmal">
            <Einheitskreis
              zustand={{ x: K3.bogen, zeigeBogen: true, zeigeSinus: false, zeigeKosinus: false }}
              beschreibung={`Einheitskreis mit dem Punkt zum Winkel 105 Grad. Der Bogen vom Punkt (1 | 0) bis zu diesem Punkt hat die Länge 7π/12, das sind etwa ${text2(K3.bogen)}.`}
            />
          </div>
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="grundkurven">
        <Aufgabe
          nummer="K4"
          titel="Sinuskurve rechts der y-Achse"
          beiErgebnis={m('grundkurven')}
          felder={[
            { id: 'x', name: 'x-Koordinate des zweiten Tiefpunkts', beschriftung: <><Formel tex={t`x`} />-Koordinate des zweiten Tiefpunkts</>, erwartet: K4.tiefpunkt.x, toleranz: 0.005 },
            { id: 'y', name: 'y-Koordinate des zweiten Tiefpunkts', beschriftung: <><Formel tex={t`y`} />-Koordinate des zweiten Tiefpunkts</>, erwartet: K4.tiefpunkt.y },
            { id: 'n', name: 'Anzahl der Nullstellen im offenen Intervall von 0 bis 3 pi', beschriftung: <>Anzahl der Nullstellen</>, erwartet: K4.nullstellen.length },
          ]}
          hilfen={[
            <>Skizziere zwei Perioden der Sinuskurve rechts der y-Achse. Der erste Tiefpunkt liegt bei <Formel tex={t`x=\tfrac{3\pi}{2}`} nach="." /> Die Periode ist <Formel tex={t`2\pi`} nach="." /></>,
            <>Die Nullstellen der Sinuskurve liegen bei <Formel tex={t`0,\ \pi,\ 2\pi,\ 3\pi,\ \dots`} /> Das Intervall <Formel tex={t`]0;\,3\pi[`} /> ist offen, die Randwerte gehören nicht dazu.</>,
          ]}
          loesung={[
            <>Tiefpunkte der Sinuskurve: <Formel tex={t`\left(\tfrac{3\pi}{2}\,\middle|\,-1\right)`} nach="," /> dann eine Periode weiter <Formel tex={t`\left(\tfrac{3\pi}{2}+2\pi\,\middle|\,-1\right)=\left(\tfrac{7\pi}{2}\,\middle|\,-1\right)`} nach="." /></>,
            <>Nullstellen im Intervall <Formel tex={t`]0;\,3\pi[`} nach=":" /> <Formel tex={t`\pi`} /> und <Formel tex={t`2\pi`} nach="." /> Die Stellen <Formel tex="0" /> und <Formel tex={t`3\pi`} /> sind Randwerte und zählen nicht. Es sind also 2 Nullstellen.</>,
          ]}
        >
          <ul className="liste">
            <li>Skizziere zwei Perioden des Schaubilds von <Formel tex={t`f(x)=\sin x`} /> rechts der y-Achse und gib die exakten Koordinaten des zweiten Tiefpunkts an.</li>
            <li>Wie viele Nullstellen hat <Formel tex="f" /> im offenen Intervall <Formel tex={t`]0;\,3\pi[`} nach="?" /></li>
          </ul>
        </Aufgabe>
        <Kontrollschaubild>
          <Kontrollbild
            bereich={[-0.5, 4 * PI + 0.5, -1.6, 1.6]}
            xTeilung={PI / 2}
            yTeilung={1}
            xBeschriftung="pi"
            kurven={[{ f: Math.sin, farbe: FARBEN.sinus }]}
            linien={[{ art: 'senkrecht', wert: 3 * PI, gestrichelt: true, farbe: FARBEN.neutral, text: '3π' }]}
            punkte={[
              { x: (3 * PI) / 2, y: -1, farbe: FARBEN.neutral, lage: 'unten', text: 'TP1' },
              { x: K4.tiefpunkt.x, y: K4.tiefpunkt.y, lage: 'unten', text: 'TP2' },
              { x: PI, y: 0, farbe: ORANGE },
              { x: 2 * PI, y: 0, farbe: ORANGE },
            ]}
            beschreibung="Schaubild der Sinusfunktion von 0 bis 4π. Die ersten beiden Tiefpunkte liegen bei 3π/2 und 7π/2 mit dem Funktionswert minus 1. Orange markiert sind die Nullstellen π und 2π im offenen Intervall von 0 bis 3π. Die senkrechte gestrichelte Gerade bei 3π zeigt das offene Intervallende."
          />
        </Kontrollschaubild>
      </Punkt>
    </Abschnitt>
  );
}

/* ---------- Abschnitt Schaubild und Term ---------- */

const termK6 = termSinus(K6.p, 'f', { klammer: 'eckig' });
const termK7 = termSinus(K7.p, 'f', { funktion: 'cos', klammer: 'eckig' });
const termK8 = termSinus(K8.p, 'f', { klammer: 'eckig' });
const termK5B = termSinus(K5B, 'g', { klammer: 'eckig' });
const K14: typeof K5B = { a: -2, b: 3, c: 1, d: 4 };
const termK14 = termSinus(K14, 'g', { klammer: 'eckig' });

function SchaubildBereich() {
  const { melde } = useIchKann();
  const m = (id: string, teil = '1') => (r: boolean) => melde(id, teil, r);
  const fa = cosF(K5A);
  return (
    <Abschnitt id="schaubild" titel="Schaubild und Term">
      <p>Hier geht es um die Parameter <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" nach="," /> um Amplitude, Periode, markante Punkte und Symmetrie.</p>
      <Eingabehinweis />

      <Punkt id="lage-ablesen">
        <Aufgabe
          nummer="K5a"
          titel="Funktionsterm aus dem Schaubild"
          beiErgebnis={m('lage-ablesen', 'a')}
          felder={[
            { id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: K5A.a },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: K5A.b, toleranz: 0.005 },
            { id: 'c', name: 'Parameter c', beschriftung: <Formel tex="c" />, erwartet: K5A.c },
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: K5A.d },
          ]}
          hilfen={[
            <>Die Ruhelage liegt in der Mitte zwischen Hochpunkt und Tiefpunkt: das ist <Formel tex="d" nach="." /> Der Abstand von der Ruhelage zum Hochpunkt ist <Formel tex="a" nach="." /></>,
            <>Lies die Periode <Formel tex="p" /> zwischen zwei Hochpunkten ab und rechne <Formel tex={t`b=\tfrac{2\pi}{p}`} nach="." /> Bei der Kosinusfunktion mit <Formel tex="a>0" /> liegt bei <Formel tex="x=c" /> ein Hochpunkt.</>,
          ]}
          loesung={[
            <>Der Hochpunkt liegt bei <Formel tex="y=3" nach="," /> der Tiefpunkt bei <Formel tex="y=-1" nach="." /> Daraus folgen <Formel tex={t`d=\tfrac{3+(-1)}{2}=1`} /> und <Formel tex={t`a=\tfrac{3-(-1)}{2}=2`} nach="." /></>,
            <>Die Hochpunkte liegen bei <Formel tex="x=1" /> und <Formel tex="x=5" nach="," /> also ist <Formel tex={t`p=4`} /> und <Formel tex={t`b=\tfrac{2\pi}{4}=\tfrac{\pi}{2}`} nach="." /> Der erste Hochpunkt rechts von <Formel tex="x=0" /> liegt bei <Formel tex="x=1" nach="," /> also <Formel tex="c=1" nach="." /></>,
            <>Ergebnis: <Formel tex={termSinus(K5A, 'f', { funktion: 'cos', klammer: 'eckig' })} nach="." /></>,
          ]}
        >
          <p>
            Das Schaubild gehört zu einer Funktion <Formel tex={t`f(x)=a\cdot\cos\!\left[b\,(x-c)\right]+d`} /> mit <Formel tex="a>0" nach="," /> <Formel tex="b>0" /> und <Formel tex={t`0\le c<p`} nach="." /> Bestimme <Formel tex="a" nach="," /> <Formel tex="b" nach="," /> <Formel tex="c" /> und <Formel tex="d" nach="." />
          </p>
          <Kontrollbild
            bereich={[-2, 7, -2, 4]}
            xTeilung={1}
            yTeilung={1}
            kurven={[{ f: fa }]}
            beschreibung="Schaubild K_f einer Kosinusfunktion im Bereich von minus 2 bis 7. Die Kurve verläuft zwischen den y-Werten minus 1 und 3. Es gibt Hochpunkte bei x gleich 1 und x gleich 5, Tiefpunkte bei x gleich minus 1 und x gleich 3."
          />
        </Aufgabe>
        <Kontrollschaubild>
          <Kontrollbild
            bereich={[-2, 7, -2, 4]}
            xTeilung={1}
            yTeilung={1}
            kurven={[{ f: fa }]}
            linien={[{ art: 'waagerecht', wert: K5A.d, gestrichelt: true, farbe: FARBEN.neutral, text: 'Ruhelage y = 1' }]}
            punkte={[
              { x: 1, y: 3, text: 'HP(1 | 3)', lage: 'rechts' },
              { x: 5, y: 3, text: 'HP(5 | 3)', lage: 'oben' },
              { x: 3, y: -1, text: 'TP(3 | −1)', lage: 'unten' },
            ]}
            beschreibung="Das Schaubild mit eingezeichneter Ruhelage y gleich 1 und den Punkten HP(1 | 3), HP(5 | 3) und TP(3 | minus 1). Zwischen den Hochpunkten liegt die Periode 4."
          />
        </Kontrollschaubild>

        <Auswahlfrage
          nummer="K5b"
          titel="Vom Term zur Beschreibung"
          beiErgebnis={m('lage-ablesen', 'b')}
          optionen={platziere(
            [
              opt('a', <>Streckung in y-Richtung mit dem Faktor 3 und Spiegelung an der x-Achse, Streckung in x-Richtung mit dem Faktor <Formel tex={t`\tfrac{1}{2}`} nach="," /> Verschiebung um 1 nach rechts und um 4 nach oben.</>, true, <>Richtig. <Formel tex="a=-3" /> streckt mit 3 und spiegelt an der x-Achse, <Formel tex="b=2" /> staucht in x-Richtung auf den Faktor <Formel tex={t`\tfrac{1}{2}`} nach="," /> <Formel tex="x-1" /> verschiebt um 1 nach rechts und <Formel tex="d=4" /> um 4 nach oben.</>),
              opt('b', <>Streckung in y-Richtung mit dem Faktor 3 und Spiegelung an der x-Achse, Streckung in x-Richtung mit dem Faktor 2, Verschiebung um 1 nach rechts und um 4 nach oben.</>, false, <>Die Streckung in x-Richtung geschieht genau umgekehrt zu <Formel tex="b" nach=":" /> <Formel tex="b=2" /> staucht auf den Faktor <Formel tex={t`\tfrac{1}{2}`} nach="." /> Die Periode halbiert sich von <Formel tex={t`2\pi`} /> auf <Formel tex={t`\pi`} nach="." /></>),
              opt('c', <>Streckung in y-Richtung mit dem Faktor 3 und Spiegelung an der x-Achse, Streckung in x-Richtung mit dem Faktor <Formel tex={t`\tfrac{1}{2}`} nach="," /> Verschiebung um 1 nach links und um 4 nach oben.</>, false, <>Die Klammer enthält <Formel tex="x-1" nach="." /> Das bedeutet eine Verschiebung nach rechts. Nach links würde <Formel tex="x+1" /> verschieben.</>),
              opt('d', <>Streckung in y-Richtung mit dem Faktor 3 und Spiegelung an der x-Achse, Streckung in x-Richtung mit dem Faktor <Formel tex={t`\tfrac{1}{2}`} nach="," /> Verschiebung um 2 nach rechts und um 4 nach oben.</>, false, <>Der Faktor 2 gehört zur Streckung in x-Richtung. Die Verschiebung liest du an <Formel tex={t`c`} /> in der Form <Formel tex={t`b\,(x-c)`} /> ab, hier <Formel tex="c=1" nach="." /> Würdest du ausmultiplizieren, stünde <Formel tex="2x-2" nach="," /> aber das ist nicht die Verschiebung.</>),
            ],
            1,
          )}
          erklaerung={
            <>
              Du liest <Formel tex={t`g(x)=a\sin\!\left[b\,(x-c)\right]+d`} /> Parameter für Parameter ab: <Formel tex="a=-3" nach="," /> <Formel tex="b=2" nach="," /> <Formel tex="c=1" nach="," /> <Formel tex="d=4" nach="." /> Das Bild zeigt, wie <Formel tex="K_g" /> aus <Formel tex="K_f" /> mit <Formel tex={t`f(x)=\sin x`} /> entsteht. Der Referenzpunkt <Formel tex={t`(c\,|\,d)=(1\,|\,4)`} /> ist ein absteigender Wendepunkt, weil <Formel tex="a<0" /> gilt.
              <Kontrollbild
                bereich={[-1.5, 6.5, -2, 8]}
                xTeilung={1}
                yTeilung={1}
                kurven={[
                  { f: Math.sin, farbe: FARBEN.vergleich, gestrichelt: true },
                  { f: sinF(K5B), farbe: FARBEN.akzent },
                ]}
                punkte={[{ x: 1, y: 4, text: 'W(1 | 4)', lage: 'rechts' }]}
                beschreibung="Die Schaubilder von f mit f(x) gleich sin x, gestrichelt, und von g mit g(x) gleich minus 3 sin von 2 mal Klammer x minus 1 plus 4, durchgezogen. K_g hat die Ruhelage 4, die Amplitude 3 und die Periode π. Bei x gleich 1 liegt ein absteigender Wendepunkt W(1 | 4)."
              />
            </>
          }
        >
          <p>
            Das Schaubild von <Formel tex={termK5B} /> entsteht aus der Sinuskurve <Formel tex="K_f" /> mit <Formel tex={t`f(x)=\sin x`} nach="." /> Welche Beschreibung stimmt?
          </p>
        </Auswahlfrage>
      </Punkt>

      <Punkt id="amplitude-periode">
        <Aufgabe
          nummer="K6"
          titel="Amplitude, Periode und Wertebereich"
          beiErgebnis={m('amplitude-periode')}
          felder={[
            { id: 'a', name: 'Amplitude', beschriftung: <>Amplitude</>, erwartet: K6.amplitude },
            { id: 'p', name: 'Periode', beschriftung: <>Periode <Formel tex="p" /></>, erwartet: K6.periode, toleranz: 1e-9 },
            { id: 'min', name: 'Kleinster Funktionswert', beschriftung: <>kleinster Funktionswert</>, erwartet: K6.minimum },
            { id: 'max', name: 'Größter Funktionswert', beschriftung: <>größter Funktionswert</>, erwartet: K6.maximum },
          ]}
          hilfen={[
            <>Die Amplitude ist <Formel tex="|a|" nach="." /> Die Periode berechnest du mit <Formel tex={t`p=\tfrac{2\pi}{b}`} nach="." /></>,
            <>Der größte Wert ist die Ruhelage plus die Amplitude, der kleinste die Ruhelage minus die Amplitude. Die Ruhelage ist <Formel tex="d" nach="." /></>,
          ]}
          loesung={[
            <>Aus <Formel tex={termK6} /> liest du ab: <Formel tex="a=2{,}5" nach="," /> <Formel tex={t`b=\tfrac{\pi}{3}`} nach="," /> <Formel tex="c=-2" nach="," /> <Formel tex="d=-1" nach="." /></>,
            <>Amplitude: <Formel tex="|a|=2{,}5" nach="." /> Periode: <Formel tex={t`p=\dfrac{2\pi}{\pi/3}=6`} nach="." /></>,
            <>Ruhelage <Formel tex="-1" nach="." /> Größter Wert: <Formel tex="-1+2{,}5=1{,}5" nach="." /> Kleinster Wert: <Formel tex="-1-2{,}5=-3{,}5" nach="." /> Der Wertebereich ist <Formel tex={t`[-3{,}5;\,1{,}5]`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme zu <Formel tex={termK6} /> die Amplitude, die Periode und den kleinsten und größten Funktionswert.
          </p>
        </Aufgabe>
        <Kontrollschaubild>
          <Kontrollbild
            bereich={[-3, 7, -4.5, 2.5]}
            xTeilung={1}
            yTeilung={1}
            kurven={[{ f: sinF(K6.p) }]}
            linien={[
              { art: 'waagerecht', wert: K6.maximum, gestrichelt: true, farbe: FARBEN.neutral, text: 'größter Wert 1,5' },
              { art: 'waagerecht', wert: K6.p.d, gestrichelt: true, farbe: FARBEN.neutral, text: 'Ruhelage −1' },
              { art: 'waagerecht', wert: K6.minimum, gestrichelt: true, farbe: FARBEN.neutral, text: 'kleinster Wert −3,5' },
            ]}
            punkte={[
              { x: -0.5, y: K6.maximum, text: 'HP', lage: 'oben' },
              { x: 5.5, y: K6.maximum, text: 'HP', lage: 'oben' },
            ]}
            beschreibung="Schaubild von f mit Ruhelage minus 1, größtem Wert 1,5 und kleinstem Wert minus 3,5. Die Hochpunkte bei x gleich minus 0,5 und x gleich 5,5 liegen eine Periode, also 6 Einheiten, auseinander."
          />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="markante-punkte">
        <Aufgabe
          nummer="K7"
          titel="Markante Punkte rechts der y-Achse"
          beiErgebnis={m('markante-punkte')}
          felder={[
            { id: 'hx', name: 'x-Koordinate des ersten Hochpunkts', beschriftung: <><Formel tex="x" />-Koordinate des Hochpunkts</>, erwartet: K7.hp.x },
            { id: 'hy', name: 'y-Koordinate des ersten Hochpunkts', beschriftung: <><Formel tex="y" />-Koordinate des Hochpunkts</>, erwartet: K7.hp.y },
            { id: 'tx', name: 'x-Koordinate des ersten Tiefpunkts', beschriftung: <><Formel tex="x" />-Koordinate des Tiefpunkts</>, erwartet: K7.tp.x },
            { id: 'ty', name: 'y-Koordinate des ersten Tiefpunkts', beschriftung: <><Formel tex="y" />-Koordinate des Tiefpunkts</>, erwartet: K7.tp.y },
            { id: 'wx', name: 'x-Koordinate des ersten Wendepunkts', beschriftung: <><Formel tex="x" />-Koordinate des Wendepunkts</>, erwartet: K7.wp.x },
            { id: 'wy', name: 'y-Koordinate des ersten Wendepunkts', beschriftung: <><Formel tex="y" />-Koordinate des Wendepunkts</>, erwartet: K7.wp.y },
          ]}
          hilfen={[
            <>Bei einer Kosinusfunktion mit <Formel tex="a<0" /> liegt bei <Formel tex="x=c" /> ein Tiefpunkt (der Referenzpunkt). Bestimme zuerst die Periode <Formel tex="p" nach="." /></>,
            <>Zwischen zwei aufeinanderfolgenden markanten Punkten liegt eine Viertelperiode <Formel tex={t`\tfrac{p}{4}`} nach="." /> Gehe vom Referenzpunkt aus in diesen Schritten nach rechts und nach links und achte darauf, dass die Punkte rechts der y-Achse liegen sollen (<Formel tex="x>0" nach=")." /></>,
          ]}
          loesung={[
            <><Formel tex={t`p=\dfrac{2\pi}{\pi/2}=4`} nach="." /> Eine Viertelperiode ist <Formel tex={t`\tfrac{p}{4}=1`} nach="." /> Ruhelage <Formel tex="d=1" nach="," /> Amplitude <Formel tex="|a|=2" nach="." /></>,
            <>Referenzpunkt: Tiefpunkt <Formel tex={`\\mathrm{TP}(${z2(K7.tp.x)}\\,|\\,${z2(K7.tp.y)})`} nach="." /> Eine Viertelperiode weiter rechts liegt der Wendepunkt <Formel tex={`\\mathrm{W}(${z2(K7.wp.x)}\\,|\\,${z2(K7.wp.y)})`} nach="," /> noch eine weiter der Hochpunkt <Formel tex={`\\mathrm{HP}(${z2(K7.hp.x)}\\,|\\,${z2(K7.hp.y)})`} nach="." /></>,
            <>Links vom Tiefpunkt liegt der Wendepunkt bei <Formel tex="x=-0{,}5" /> und davor der Hochpunkt bei <Formel tex="x=-1{,}5" nach="." /> Beide liegen links der y-Achse und zählen nicht.</>,
          ]}
        >
          <p>
            Bestimme zu <Formel tex={termK7} /> die Koordinaten des ersten Hochpunkts, des ersten Tiefpunkts und des ersten Wendepunkts rechts der y-Achse.
          </p>
        </Aufgabe>
        <Kontrollschaubild>
          <Kontrollbild
            bereich={[-2, 5, -2, 4]}
            xTeilung={1}
            yTeilung={1}
            kurven={[{ f: cosF(K7.p) }]}
            punkte={[
              { x: K7.tp.x, y: K7.tp.y, text: 'TP(0,5 | −1)', lage: 'unten' },
              { x: K7.wp.x, y: K7.wp.y, text: 'W(1,5 | 1)', lage: 'rechts' },
              { x: K7.hp.x, y: K7.hp.y, text: 'HP(2,5 | 3)', lage: 'oben' },
            ]}
            beschreibung="Schaubild von f mit Tiefpunkt TP(0,5 | minus 1), Wendepunkt W(1,5 | 1) und Hochpunkt HP(2,5 | 3). Es sind die ersten markanten Punkte rechts der y-Achse. Der Abstand zwischen zwei aufeinanderfolgenden Punkten ist eine Viertelperiode, also 1."
          />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="symmetrie">
        <Aufgabe
          nummer="K8"
          titel="Symmetrieachse und Symmetriezentrum"
          beiErgebnis={m('symmetrie')}
          felder={[
            { id: 'achse', name: 'Kleinste positive x-Stelle einer Symmetrieachse', beschriftung: <>Symmetrieachse <Formel tex="x=" /></>, erwartet: K8.achse },
            { id: 'zx', name: 'x-Koordinate des Symmetriezentrums', beschriftung: <><Formel tex="x" />-Koordinate des Zentrums</>, erwartet: K8.zentrumX },
            { id: 'zy', name: 'y-Koordinate des Symmetriezentrums', beschriftung: <><Formel tex="y" />-Koordinate des Zentrums</>, erwartet: K8.zentrumY },
          ]}
          hilfen={[
            <>Die Schaubilder von Sinus- und Kosinusfunktionen sind symmetrisch: Durch jeden Hochpunkt und jeden Tiefpunkt geht eine senkrechte Symmetrieachse. Jeder Wendepunkt ist ein Symmetriezentrum (Punktsymmetrie).</>,
            <>Bestimme mit der Regel der Viertelperiode die markanten Punkte rechts der y-Achse. Die Periode ist <Formel tex={t`p=\tfrac{2\pi}{b}`} nach="." /></>,
          ]}
          loesung={[
            <><Formel tex={t`p=\dfrac{2\pi}{\pi/2}=4`} nach="." /> Referenzpunkt ist der Wendepunkt <Formel tex={t`\mathrm{W}(-0{,}5\,|\,3)`} /> (absteigend wegen <Formel tex="a<0" nach=")." /> Eine Viertelperiode weiter rechts bei <Formel tex="x=0{,}5" /> liegt ein Tiefpunkt <Formel tex={t`\mathrm{TP}(0{,}5\,|\,1)`} nach="." /></>,
            <>Eine senkrechte Symmetrieachse ist <Formel tex={`x=${z2(K8.achse)}`} nach="." /> Der nächste Wendepunkt rechts der y-Achse liegt bei <Formel tex={`\\mathrm{W}(${z2(K8.zentrumX)}\\,|\\,${z2(K8.zentrumY)})`} /> und ist ein Symmetriezentrum.</>,
          ]}
        >
          <p>
            Gib zu <Formel tex={termK8} /> die Gleichung der Symmetrieachse mit der kleinsten positiven <Formel tex="x" />-Stelle und die Koordinaten des Symmetriezentrums mit der kleinsten positiven <Formel tex="x" />-Koordinate an. Die Sinuskurve hat unendlich viele Symmetrieachsen und -zentren, du suchst jeweils das erste rechts der y-Achse.
          </p>
        </Aufgabe>
        <Kontrollschaubild>
          <Kontrollbild
            bereich={[-2.5, 5.5, -1, 6]}
            xTeilung={1}
            yTeilung={1}
            kurven={[{ f: sinF(K8.p) }]}
            linien={[
              { art: 'senkrecht', wert: K8.achse, gestrichelt: true, farbe: FARBEN.neutral, text: 'x = 0,5' },
              { art: 'waagerecht', wert: K8.p.d, gestrichelt: true, farbe: FARBEN.vergleich },
            ]}
            punkte={[
              { x: K8.achse, y: K8.p.d - 2, text: 'TP', lage: 'unten' },
              { x: K8.zentrumX, y: K8.zentrumY, farbe: ORANGE, text: 'Z(1,5 | 3)', lage: 'oben' },
            ]}
            beschreibung="Schaubild von f. Die gestrichelte senkrechte Gerade x gleich 0,5 geht durch den Tiefpunkt TP(0,5 | 1) und ist Symmetrieachse. Der orange Punkt Z(1,5 | 3) ist ein Wendepunkt auf der Ruhelage y gleich 3 und Symmetriezentrum."
          />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="reihenfolge">
        <Auswahlfrage
          nummer="K14"
          titel="Reihenfolge der Transformationen"
          beiErgebnis={m('reihenfolge')}
          optionen={platziere(
            [
              opt('a', <>Erst in x-Richtung mit dem Faktor <Formel tex={t`\tfrac{1}{3}`} /> und in y-Richtung mit dem Faktor 2 strecken und an der x-Achse spiegeln, danach um 1 nach rechts und um 4 nach oben verschieben.</>, true, <>Richtig. Erst wirken <Formel tex="a" /> und <Formel tex="b" /> (Streckungen und Spiegelung), dann die Verschiebungen <Formel tex="c" /> und <Formel tex="d" nach="." /></>),
              opt('b', <>Erst um 1 nach rechts und um 4 nach oben verschieben, danach in x-Richtung mit dem Faktor <Formel tex={t`\tfrac{1}{3}`} /> und in y-Richtung mit dem Faktor 2 strecken und an der x-Achse spiegeln.</>, false, <>Dann würden die Verschiebungen mitgestreckt. Aus <Formel tex={t`\sin(x-1)`} /> wird nach der Streckung <Formel tex={t`\sin(3x-1)=\sin\!\left(3\left(x-\tfrac{1}{3}\right)\right)`} nach="," /> die Verschiebung nach rechts betrüge nur <Formel tex={t`\tfrac{1}{3}`} nach="." /> Ebenso würde die Verschiebung um 4 nach oben mit dem Faktor 2 zu 8.</>),
              opt('c', <>Erst in x-Richtung mit dem Faktor <Formel tex={t`\tfrac{1}{3}`} /> und in y-Richtung mit dem Faktor 2 strecken und an der y-Achse spiegeln, danach um 1 nach rechts und um 4 nach oben verschieben.</>, false, <>Die Reihenfolge stimmt, aber das Minuszeichen steht vor dem ganzen Sinusterm. Das ist <Formel tex="a<0" /> und bedeutet eine Spiegelung an der <strong>x-Achse</strong> (die y-Werte wechseln das Vorzeichen).</>),
              opt('d', <>Die Reihenfolge ist egal, es kommt immer dasselbe Schaubild heraus.</>, false, <>Die Reihenfolge ist nicht egal. Streckungen und Verschiebungen in derselben Richtung lassen sich nicht vertauschen, wie das Beispiel der Verschiebung um 1 nach rechts zeigt: Vor der Streckung um <Formel tex={t`\tfrac{1}{3}`} /> wird sie auf <Formel tex={t`\tfrac{1}{3}`} /> gekürzt.</>),
            ],
            2,
          )}
          erklaerung={
            <>
              Du liest <Formel tex={termK14} /> mit <Formel tex="a=-2" nach="," /> <Formel tex="b=3" nach="," /> <Formel tex="c=1" nach="," /> <Formel tex="d=4" /> ab. Erst werden <Formel tex="a" /> und <Formel tex="b" /> auf die Grundkurve angewendet, danach die Verschiebungen <Formel tex="c" /> und <Formel tex="d" nach="." /> Das Bild zeigt das Ergebnis: Die Ruhelage ist <Formel tex="y=4" nach="," /> die Amplitude 2, die Periode <Formel tex={t`\tfrac{2\pi}{3}`} /> und der Wendepunkt <Formel tex={t`\mathrm{W}(1\,|\,4)`} /> ist absteigend.
              <Kontrollbild
                bereich={[-0.5, 3.5, -1, 7]}
                xTeilung={0.5}
                yTeilung={1}
                kurven={[
                  { f: Math.sin, farbe: FARBEN.vergleich, gestrichelt: true },
                  { f: sinF(K14), farbe: FARBEN.akzent },
                ]}
                punkte={[{ x: 1, y: 4, text: 'W(1 | 4)', lage: 'rechts' }]}
                beschreibung="Die Schaubilder von f mit f(x) gleich sin x, gestrichelt, und von g mit g(x) gleich minus 2 sin von 3 mal Klammer x minus 1 plus 4. K_g hat die Ruhelage 4, die Amplitude 2 und einen absteigenden Wendepunkt bei W(1 | 4)."
              />
            </>
          }
        >
          <p>
            Das Schaubild von <Formel tex={termK14} /> soll aus <Formel tex="K_f" /> mit <Formel tex={t`f(x)=\sin x`} /> entstehen. Welche Beschreibung ist richtig?
          </p>
        </Auswahlfrage>
      </Punkt>
    </Abschnitt>
  );
}

/* ---------- Abschnitt Gleichungen ---------- */

function GleichungenBereich() {
  const { melde } = useIchKann();
  const m = (id: string, teil = '1') => (r: boolean) => melde(id, teil, r);
  const [a1, a2, a3] = K10_E.a;
  const [b1, b2, b3] = K10_E.b;
  const [k1, k2, k3] = K11_E.x;
  const f10a = (x: number) => 5 * Math.cos(x) + 1;
  const f10b = (x: number) => 8 * Math.sin(x) + 1;
  const f11 = (x: number) => 4 * Math.sin(3 * (x - 0.5)) + 1;
  return (
    <Abschnitt id="gleichungen" titel="Gleichungen">
      <p>Hier geht es um trigonometrische Gleichungen: exakt, mit dem Taschenrechner, mit Substitution, mit allen Lösungen und mit einem Parameter.</p>
      <Eingabehinweis rechner />

      <Punkt id="gleichung-exakt">
        <Aufgabe
          nummer="K9"
          titel="Exakte Lösung ohne Taschenrechner"
          beiErgebnis={m('gleichung-exakt')}
          felder={[
            { id: 'a', name: 'Lösung der Gleichung a', beschriftung: <>Lösung bei a</>, erwartet: K9.a },
            { id: 'b', name: 'Lösung der Gleichung b', beschriftung: <>Lösung bei b</>, erwartet: K9.b },
          ]}
          hilfen={[
            <>Forme die Gleichung zuerst um, bis <Formel tex={t`\sin x=\dots`} /> bzw. <Formel tex={t`\cos x=\dots`} /> allein steht.</>,
            <>Suche den Wert in der Tabelle der exakten Werte und lies die Stelle <Formel tex="x" /> ab.
              <table className="tabelle tabelle-kompakt">
                <thead>
                  <tr>
                    <th scope="col"><Formel tex="x" /></th>
                    <th scope="col"><Formel tex="0" /></th>
                    <th scope="col"><Formel tex={t`\tfrac{\pi}{6}`} /></th>
                    <th scope="col"><Formel tex={t`\tfrac{\pi}{4}`} /></th>
                    <th scope="col"><Formel tex={t`\tfrac{\pi}{3}`} /></th>
                    <th scope="col"><Formel tex={t`\tfrac{\pi}{2}`} /></th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row"><Formel tex={t`\sin x`} /></th><td><Formel tex="0" /></td><td><Formel tex={t`\tfrac{1}{2}`} /></td><td><Formel tex={t`\tfrac{\sqrt{2}}{2}`} /></td><td><Formel tex={t`\tfrac{\sqrt{3}}{2}`} /></td><td><Formel tex="1" /></td></tr>
                  <tr><th scope="row"><Formel tex={t`\cos x`} /></th><td><Formel tex="1" /></td><td><Formel tex={t`\tfrac{\sqrt{3}}{2}`} /></td><td><Formel tex={t`\tfrac{\sqrt{2}}{2}`} /></td><td><Formel tex={t`\tfrac{1}{2}`} /></td><td><Formel tex="0" /></td></tr>
                </tbody>
              </table>
            </>,
          ]}
          loesung={[
            <>a) <Formel tex={t`2\sin x-\sqrt{3}=0\ \Rightarrow\ \sin x=\tfrac{\sqrt{3}}{2}`} nach="." /> Aus der Tabelle: <Formel tex={t`x_1=\tfrac{\pi}{3}`} nach="." /></>,
            <>b) <Formel tex={t`6\cos x-3\sqrt{2}=0\ \Rightarrow\ \cos x=\tfrac{3\sqrt{2}}{6}=\tfrac{\sqrt{2}}{2}`} nach="." /> Aus der Tabelle: <Formel tex={t`x_1=\tfrac{\pi}{4}`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme die Lösung im Intervall <Formel tex={t`\left[0;\,\tfrac{\pi}{2}\right]`} nach="." /> Gib sie exakt als Vielfaches von <Formel tex="\pi" /> an, zum Beispiel <code>pi/6</code>.
          </p>
          <ul className="liste">
            <li>a) <Formel tex={t`2\sin x-\sqrt{3}=0`} /></li>
            <li>b) <Formel tex={t`6\cos x-3\sqrt{2}=0`} /></li>
          </ul>
        </Aufgabe>
        <Kontrollschaubild>
          <div className="bilder-paar">
            <Kontrollbild
              bereich={[-0.2, 1.9, -0.2, 1.3]}
              xTeilung={PI / 6}
              yTeilung={0.5}
              xBeschriftung="pi"
              kurven={[{ f: Math.sin, farbe: FARBEN.sinus }]}
              linien={[{ art: 'waagerecht', wert: Math.sqrt(3) / 2, gestrichelt: true, farbe: FARBEN.neutral, text: '√3/2' }]}
              punkte={[{ x: K9.a, y: Math.sqrt(3) / 2, text: 'π/3', lot: true, lage: 'rechts' }]}
              beschreibung="Schaubild der Sinusfunktion zwischen 0 und etwa 1,9. Die Gerade y gleich Wurzel 3 durch 2 schneidet die Kurve bei x gleich π/3."
            />
            <Kontrollbild
              bereich={[-0.2, 1.9, -0.2, 1.3]}
              xTeilung={PI / 6}
              yTeilung={0.5}
              xBeschriftung="pi"
              kurven={[{ f: Math.cos, farbe: FARBEN.kosinus }]}
              linien={[{ art: 'waagerecht', wert: Math.sqrt(2) / 2, gestrichelt: true, farbe: FARBEN.neutral, text: '√2/2' }]}
              punkte={[{ x: K9.b, y: Math.sqrt(2) / 2, text: 'π/4', lot: true, lage: 'rechts' }]}
              beschreibung="Schaubild der Kosinusfunktion zwischen 0 und etwa 1,9. Die Gerade y gleich Wurzel 2 durch 2 schneidet die Kurve bei x gleich π/4."
            />
          </div>
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="gleichung-wtr">
        <Aufgabe
          nummer="K10"
          titel="Mit dem Taschenrechner im Intervall"
          beiErgebnis={m('gleichung-wtr')}
          felder={[
            { id: 'a1', name: 'Erste Lösung bei a', beschriftung: <><Formel tex={t`x_1`} /> bei a</>, erwartet: a1!, toleranz: TOL2 },
            { id: 'a2', name: 'Zweite Lösung bei a', beschriftung: <><Formel tex={t`x_2`} /> bei a</>, erwartet: a2!, toleranz: TOL2 },
            { id: 'a3', name: 'Dritte Lösung bei a', beschriftung: <><Formel tex={t`x_3`} /> bei a</>, erwartet: a3!, toleranz: TOL2 },
            { id: 'b1', name: 'Erste Lösung bei b', beschriftung: <><Formel tex={t`x_1`} /> bei b</>, erwartet: b1!, toleranz: TOL2 },
            { id: 'b2', name: 'Zweite Lösung bei b', beschriftung: <><Formel tex={t`x_2`} /> bei b</>, erwartet: b2!, toleranz: TOL2 },
            { id: 'b3', name: 'Dritte Lösung bei b', beschriftung: <><Formel tex={t`x_3`} /> bei b</>, erwartet: b3!, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Forme um zu <Formel tex={t`\cos x=s`} /> bzw. <Formel tex={t`\sin x=s`} nach="." /> Der Taschenrechner (Bogenmaß) liefert nur eine Lösung <Formel tex={t`x_1`} nach="." /></>,
            <>Die zweite Lösung in einer Periode: beim Kosinus <Formel tex={t`x_2=-x_1`} nach="," /> beim Sinus <Formel tex={t`x_2=\pi-x_1`} nach="." /> Weitere Lösungen entstehen durch Addieren oder Subtrahieren von <Formel tex={t`2\pi`} nach="." /> Behalte nur die Lösungen im Intervall.</>,
          ]}
          loesung={[
            <>a) <Formel tex={t`5\cos x+1=4\ \Rightarrow\ \cos x=0{,}6`} nach="." /> <Formel tex={`x_1=\\cos^{-1}(0{,}6)\\approx ${d3(a2!)}`} nach="," /> <Formel tex={`x_2=-x_1\\approx ${d3(a1!)}`} nach="." /> Beide liegen in <Formel tex={t`[-1;\,6]`} nach="." /></>,
            <>a) Weitere Lösungen: <Formel tex={`x_2+2\\pi\\approx ${d3(a3!)}`} /> liegt im Intervall, <Formel tex={`x_1+2\\pi\\approx ${d3(a2! + 2 * PI)}`} /> nicht (größer als 6), und <Formel tex={`x_1-2\\pi`} /> liegt links von <Formel tex="-1" nach="." /> Lösungen: <Formel tex={`${d3(a1!)};\\ ${d3(a2!)};\\ ${d3(a3!)}`} nach="." /></>,
            <>b) <Formel tex={t`8\sin x+1=6\ \Rightarrow\ \sin x=0{,}625`} nach="." /> <Formel tex={`x_1=\\sin^{-1}(0{,}625)\\approx ${d3(b1!)}`} nach="," /> <Formel tex={`x_2=\\pi-x_1\\approx ${d3(b2!)}`} nach="." /></>,
            <>b) Weitere Lösungen: <Formel tex={`x_1+2\\pi\\approx ${d3(b3!)}`} /> liegt im Intervall <Formel tex={t`[0;\,7]`} nach="," /> <Formel tex={`x_2+2\\pi\\approx ${d3(b2! + 2 * PI)}`} /> nicht. Lösungen: <Formel tex={`${d3(b1!)};\\ ${d3(b2!)};\\ ${d3(b3!)}`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme alle Lösungen im angegebenen Intervall. Der Taschenrechner steht im Bogenmaß. Gib die Lösungen in aufsteigender Reihenfolge ein, auf mindestens zwei Nachkommastellen.
          </p>
          <ul className="liste">
            <li>a) <Formel tex={t`5\cos x+1=4`} /> mit <Formel tex={t`x\in[-1;\,6]`} /></li>
            <li>b) <Formel tex={t`8\sin x+1=6`} /> mit <Formel tex={t`x\in[0;\,7]`} /></li>
          </ul>
        </Aufgabe>
        <Kontrollschaubild>
          <div className="bilder-paar">
            <Kontrollbild
              bereich={[-1.5, 6.5, -5, 7]}
              xTeilung={1}
              yTeilung={2}
              kurven={[{ f: f10a }]}
              linien={[
                { art: 'waagerecht', wert: 4, gestrichelt: true, farbe: FARBEN.neutral, text: 'y = 4' },
                { art: 'senkrecht', wert: 6, gestrichelt: true, farbe: FARBEN.vergleich },
                { art: 'senkrecht', wert: -1, gestrichelt: true, farbe: FARBEN.vergleich },
              ]}
              punkte={[a1!, a2!, a3!].map((x) => ({ x, y: 4, lot: true, lage: 'oben' as const }))}
              beschreibung={`Schaubild von 5 cos x plus 1 im Intervall von minus 1 bis 6, begrenzt durch zwei gestrichelte senkrechte Geraden. Die Gerade y gleich 4 schneidet die Kurve bei x gleich ${text2(a1!)}, ${text2(a2!)} und ${text2(a3!)}.`}
            />
            <Kontrollbild
              bereich={[-0.5, 7.5, -8, 11]}
              xTeilung={1}
              yTeilung={2}
              kurven={[{ f: f10b }]}
              linien={[
                { art: 'waagerecht', wert: 6, gestrichelt: true, farbe: FARBEN.neutral, text: 'y = 6' },
                { art: 'senkrecht', wert: 7, gestrichelt: true, farbe: FARBEN.vergleich },
              ]}
              punkte={[b1!, b2!, b3!].map((x) => ({ x, y: 6, lot: true, lage: 'oben' as const }))}
              beschreibung={`Schaubild von 8 sin x plus 1 im Intervall von 0 bis 7, begrenzt durch eine gestrichelte senkrechte Gerade bei 7. Die Gerade y gleich 6 schneidet die Kurve bei x gleich ${text2(b1!)}, ${text2(b2!)} und ${text2(b3!)}.`}
            />
          </div>
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="substitution">
        <Aufgabe
          nummer="K11"
          titel="Mit Substitution"
          beiErgebnis={m('substitution')}
          felder={[
            { id: 'x1', name: 'Erste Lösung', beschriftung: <><Formel tex={t`x_1`} /></>, erwartet: k1!, toleranz: TOL2 },
            { id: 'x2', name: 'Zweite Lösung', beschriftung: <><Formel tex={t`x_2`} /></>, erwartet: k2!, toleranz: TOL2 },
            { id: 'x3', name: 'Dritte Lösung', beschriftung: <><Formel tex={t`x_3`} /></>, erwartet: k3!, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Forme zuerst zu <Formel tex={t`\sin\!\left(3(x-0{,}5)\right)=s`} /> um. Substituiere dann <Formel tex={t`z=3(x-0{,}5)`} /> und löse <Formel tex={t`\sin z=s`} nach="." /></>,
            <>Rechne das Intervall für <Formel tex="z" /> aus: <Formel tex={t`x=0`} /> ergibt <Formel tex="z=-1{,}5" nach="," /> <Formel tex="x=3" /> ergibt <Formel tex="z=7{,}5" nach="." /> Finde alle Lösungen für <Formel tex="z" /> in diesem Intervall (<Formel tex={t`z_1`} nach="," /> <Formel tex={t`z_2=\pi-z_1`} /> und je mit Vielfachen von <Formel tex={t`2\pi`} nach=")," /> dann rechne mit <Formel tex={t`x=\tfrac{z}{3}+0{,}5`} /> zurück.</>,
          ]}
          loesung={[
            <><Formel tex={t`4\sin\!\left(3(x-0{,}5)\right)+1=3\ \Rightarrow\ \sin\!\left(3(x-0{,}5)\right)=0{,}5`} nach="." /> Substitution <Formel tex={t`z=3(x-0{,}5)`} nach=":" /> <Formel tex={t`\sin z=0{,}5`} nach="." /></>,
            <>Intervall für <Formel tex="z" nach=":" /> <Formel tex={t`z\in[-1{,}5;\,7{,}5]`} nach="." /> <Formel tex={`z_1=\\sin^{-1}(0{,}5)\\approx ${d3(K11_E.z1)}`} nach="," /> <Formel tex={`z_2=\\pi-z_1\\approx ${d3(K11_E.z2)}`} nach="." /> Weiter: <Formel tex={`z_1+2\\pi\\approx ${d3(K11_E.z1 + 2 * PI)}`} /> liegt im Intervall, <Formel tex={`z_2+2\\pi\\approx ${d3(K11_E.z2 + 2 * PI)}`} /> nicht (größer als 7,5), nach unten liegen <Formel tex={`z_1-2\\pi`} /> und <Formel tex={`z_2-2\\pi`} /> links von <Formel tex="-1{,}5" nach="." /></>,
            <>Rücksubstitution <Formel tex={t`x=\tfrac{z}{3}+0{,}5`} nach=":" /> <Formel tex={`x_1\\approx ${d3(k1!)}`} nach="," /> <Formel tex={`x_2\\approx ${d3(k2!)}`} nach="," /> <Formel tex={`x_3\\approx ${d3(k3!)}`} nach="." /> Probe über die Periode <Formel tex={t`p=\tfrac{2\pi}{3}\approx ${d3(K11_E.periode)}`} nach=":" /> <Formel tex={`x_1+p\\approx ${d3(k1! + K11_E.periode)}=x_3`} nach="." /> Lösungsmenge <Formel tex={`L=\\{${d3(k1!)};\\ ${d3(k2!)};\\ ${d3(k3!)}\\}`} nach="." /></>,
          ]}
        >
          <p>
            Bestimme die Lösungen von <Formel tex={t`4\sin\!\left(3(x-0{,}5)\right)+1=3`} /> im Intervall <Formel tex={t`[0;\,3]`} nach="." /> Gib die Lösungen in aufsteigender Reihenfolge ein, auf mindestens zwei Nachkommastellen.
          </p>
        </Aufgabe>
        <Kontrollschaubild>
          <Kontrollbild
            bereich={[-0.4, 3.4, -4, 6]}
            xTeilung={0.5}
            yTeilung={2}
            kurven={[{ f: f11 }]}
            linien={[
              { art: 'waagerecht', wert: 3, gestrichelt: true, farbe: FARBEN.neutral, text: 'y = 3' },
              { art: 'senkrecht', wert: 3, gestrichelt: true, farbe: FARBEN.vergleich },
            ]}
            punkte={[k1!, k2!, k3!].map((x) => ({ x, y: 3, lot: true, lage: 'oben' as const }))}
            beschreibung={`Schaubild von 4 sin von 3 mal Klammer x minus 0,5 plus 1 im Intervall von 0 bis 3. Die Gerade y gleich 3 schneidet die Kurve bei x gleich ${text2(k1!)}, ${text2(k2!)} und ${text2(k3!)}.`}
          />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="alle-loesungen">
        <Auswahlfrage
          nummer="K15"
          titel="Alle Lösungen angeben"
          beiErgebnis={m('alle-loesungen')}
          optionen={platziere(
            [
              opt('a', <><Formel tex={t`x=\tfrac{2\pi}{3}+k\cdot 2\pi`} /> oder <Formel tex={t`x=-\tfrac{2\pi}{3}+k\cdot 2\pi`} /> mit <Formel tex={t`k\in\mathbb{Z}`} /></>, true, <>Richtig. Der Taschenrechner liefert <Formel tex={t`z_1=\cos^{-1}(-0{,}5)=\tfrac{2\pi}{3}`} nach="," /> beim Kosinus ist die zweite Lösung <Formel tex={t`-z_1`} nach="." /> Beide wiederholen sich im Abstand der Periode <Formel tex={t`2\pi`} nach="." /></>),
              opt('b', <><Formel tex={t`x=\tfrac{2\pi}{3}+k\cdot 2\pi`} /> oder <Formel tex={t`x=\tfrac{\pi}{3}+k\cdot 2\pi`} /> mit <Formel tex={t`k\in\mathbb{Z}`} /></>, false, <>Die zweite Lösung <Formel tex={t`\pi-z_1`} /> gilt für den <strong>Sinus</strong>. Beim Kosinus ist sie <Formel tex={t`-z_1`} nach="." /> Probe: <Formel tex={t`\cos\tfrac{\pi}{3}=0{,}5\neq-0{,}5`} nach="." /></>),
              opt('c', <><Formel tex={t`x=\tfrac{2\pi}{3}+k\cdot\pi`} /> mit <Formel tex={t`k\in\mathbb{Z}`} /></>, false, <>Die Periode des Kosinus ist <Formel tex={t`2\pi`} nach="," /> nicht <Formel tex={t`\pi`} nach="." /> Mit <Formel tex={t`+\pi`} /> käme zum Beispiel <Formel tex={t`\tfrac{5\pi}{3}`} /> dazu, und dort ist <Formel tex={t`\cos\tfrac{5\pi}{3}=0{,}5`} nach="." /></>),
              opt('d', <><Formel tex={t`x=\tfrac{2\pi}{3}+k\cdot 2\pi`} /> mit <Formel tex={t`k\in\mathbb{Z}`} /></>, false, <>Das sind nur die Lösungen der ersten Sorte. Zu jeder Periode gehört eine zweite Lösung: beim Kosinus <Formel tex={t`-\tfrac{2\pi}{3}`} nach="." /></>),
            ],
            3,
          )}
          erklaerung={
            <>
              Löse zuerst eine Periode: <Formel tex={t`z_1=\cos^{-1}(-0{,}5)=\tfrac{2\pi}{3}`} /> und <Formel tex={t`z_2=-z_1=-\tfrac{2\pi}{3}`} nach="." /> Weil die Kosinusfunktion die Periode <Formel tex={t`2\pi`} /> hat, kommen alle Lösungen durch Addieren von <Formel tex={t`k\cdot 2\pi`} /> mit <Formel tex={t`k\in\mathbb{Z}`} /> hinzu. Im Bild siehst du vier der unendlich vielen Lösungen.
              <Kontrollbild
                bereich={[-2 * PI - 0.4, 2 * PI + 0.4, -1.6, 1.6]}
                xTeilung={PI / 2}
                yTeilung={0.5}
                xBeschriftung="pi"
                kurven={[{ f: Math.cos, farbe: FARBEN.kosinus }]}
                linien={[{ art: 'waagerecht', wert: -0.5, gestrichelt: true, farbe: FARBEN.neutral, text: 'y = −0,5' }]}
                punkte={[-4 * PI / 3, -2 * PI / 3, (2 * PI) / 3, (4 * PI) / 3].map((x) => ({ x, y: -0.5, lot: true, lage: 'oben' as const }))}
                beschreibung="Schaubild der Kosinusfunktion von minus 2π bis 2π mit der Geraden y gleich minus 0,5. Sie schneidet die Kurve bei den Stellen minus 4π/3, minus 2π/3, 2π/3 und 4π/3. Diese Stellen sind die Lösungen mit k gleich minus 1, minus 1, 0 und 0."
              />
            </>
          }
        >
          <p>
            Welche Angabe beschreibt <strong>alle</strong> Lösungen der Gleichung <Formel tex={t`\cos x=-0{,}5`} /> in <Formel tex={t`\mathbb{R}`} nach="?" />
          </p>
        </Auswahlfrage>
      </Punkt>

      <Punkt id="parameter">
        <Aufgabe
          nummer="K16"
          titel="Anzahl der Lösungen mit Parameter"
          beiErgebnis={m('parameter')}
          felder={[
            { id: 't2', name: 'Anzahl der Lösungen für t gleich 2', beschriftung: <>Anzahl für <Formel tex="t=2" /></>, erwartet: K16.anzahl[0]! },
            { id: 't3', name: 'Anzahl der Lösungen für t gleich 3', beschriftung: <>Anzahl für <Formel tex="t=3" /></>, erwartet: K16.anzahl[1]! },
            { id: 't5', name: 'Anzahl der Lösungen für t gleich 5', beschriftung: <>Anzahl für <Formel tex="t=5" /></>, erwartet: K16.anzahl[2]! },
          ]}
          hilfen={[
            <>Stelle die Gleichung um zu <Formel tex={t`\sin x=-\tfrac{3}{t}`} nach="." /> Die Lösungen sind die Schnittstellen der Sinuskurve mit der waagerechten Geraden <Formel tex={t`y=-\tfrac{3}{t}`} nach="." /></>,
            <>Die Sinuskurve nimmt nur Werte zwischen <Formel tex="-1" /> und <Formel tex="1" /> an. Liegt die Gerade außerhalb, gibt es keine Lösung. Berührt sie die Kurve genau im Tiefpunkt, gibt es eine, sonst im Intervall <Formel tex={t`[0;\,2\pi]`} /> zwei.</>,
          ]}
          loesung={[
            <><Formel tex="t=2" nach=":" /> <Formel tex={t`\sin x=-1{,}5`} nach="." /> Das ist kleiner als <Formel tex="-1" nach="," /> also gibt es <strong>0</strong> Lösungen.</>,
            <><Formel tex="t=3" nach=":" /> <Formel tex={t`\sin x=-1`} nach="." /> Die Gerade berührt die Kurve im Tiefpunkt, also gibt es <strong>1</strong> Lösung, nämlich <Formel tex={t`x=\tfrac{3\pi}{2}`} nach="." /></>,
            <><Formel tex="t=5" nach=":" /> <Formel tex={t`\sin x=-0{,}6`} nach="." /> Die Gerade schneidet die Kurve zwischen <Formel tex={t`\pi`} /> und <Formel tex={t`2\pi`} /> zweimal, also gibt es <strong>2</strong> Lösungen.</>,
          ]}
        >
          <p>
            Bestimme für jeden Wert von <Formel tex="t" /> die Anzahl der Lösungen der Gleichung <Formel tex={t`0=t\cdot\sin x+3`} /> im Intervall <Formel tex={t`[0;\,2\pi]`} nach="." /> Gib die Anzahl als Zahl ein.
          </p>
        </Aufgabe>
        <Kontrollschaubild>
          <Kontrollbild
            bereich={[-0.4, 2 * PI + 0.4, -2, 1.5]}
            xTeilung={PI / 2}
            yTeilung={0.5}
            xBeschriftung="pi"
            kurven={[{ f: Math.sin, farbe: FARBEN.sinus }]}
            linien={[
              { art: 'waagerecht', wert: -1.5, gestrichelt: true, farbe: FARBEN.neutral, text: 't = 2' },
              { art: 'waagerecht', wert: -1, gestrichelt: true, farbe: FARBEN.neutral, text: 't = 3' },
              { art: 'waagerecht', wert: -0.6, gestrichelt: true, farbe: FARBEN.neutral, text: 't = 5' },
            ]}
            punkte={[
              { x: (3 * PI) / 2, y: -1 },
              { x: PI + Math.asin(0.6), y: -0.6 },
              { x: 2 * PI - Math.asin(0.6), y: -0.6 },
            ]}
            beschreibung="Schaubild der Sinusfunktion von 0 bis 2π mit drei waagerechten Geraden bei y gleich minus 1,5, minus 1 und minus 0,6, das sind minus 3 durch t für t gleich 2, 3 und 5. Die Gerade bei minus 1,5 verläuft unterhalb der Kurve und hat keinen Schnittpunkt. Die Gerade bei minus 1 berührt die Kurve im Tiefpunkt. Die Gerade bei minus 0,6 schneidet die Kurve zweimal."
          />
        </Kontrollschaubild>
      </Punkt>
    </Abschnitt>
  );
}

/* ---------- Abschnitt Anwendungen ---------- */

function AnwendungenBereich() {
  const { melde } = useIchKann();
  const m = (id: string, teil = '1') => (r: boolean) => melde(id, teil, r);
  const f = cosF(K12);
  return (
    <Abschnitt id="anwendungen" titel="Anwendungen">
      <p>Hier geht es um periodische Vorgänge: ein Modell aufstellen, damit rechnen und die Ergebnisse im Zusammenhang deuten.</p>
      <Eingabehinweis rechner />

      <Punkt id="modell-aufstellen">
        <Aufgabe
          nummer="K12"
          titel="Modell für den Wasserstand"
          beiErgebnis={m('modell-aufstellen')}
          felder={[
            { id: 'a', name: 'Parameter a', beschriftung: <Formel tex="a" />, erwartet: K12.a },
            { id: 'b', name: 'Parameter b', beschriftung: <Formel tex="b" />, erwartet: K12.b, toleranz: 0.005 },
            { id: 'c', name: 'Parameter c', beschriftung: <Formel tex="c" />, erwartet: K12.c },
            { id: 'd', name: 'Parameter d', beschriftung: <Formel tex="d" />, erwartet: K12.d },
          ]}
          hilfen={[
            <>Lies den größten und den kleinsten Wert und die Monate ab, in denen sie auftreten. Die Ruhelage <Formel tex="d" /> liegt in der Mitte, <Formel tex="a" /> ist der Abstand zwischen Ruhelage und größtem Wert.</>,
            <>Der Vorgang wiederholt sich jedes Jahr, die Periode ist <Formel tex={t`p=12`} nach="." /> Daraus folgt <Formel tex={t`b=\tfrac{2\pi}{p}`} nach="." /> Eine Kosinusfunktion mit <Formel tex="a>0" /> hat bei <Formel tex="x=c" /> ihren Hochpunkt.</>,
          ]}
          loesung={[
            <>Größter Wert: <Formel tex="4{,}6" /> im August (<Formel tex="x=8" nach=")." /> Kleinster Wert: <Formel tex="1{,}8" /> im Februar (<Formel tex="x=2" nach=")." /></>,
            <><Formel tex={t`d=\dfrac{4{,}6+1{,}8}{2}=3{,}2`} nach="," /> <Formel tex={t`a=\dfrac{4{,}6-1{,}8}{2}=1{,}4`} nach="," /> <Formel tex={t`b=\dfrac{2\pi}{12}=\dfrac{\pi}{6}`} nach="." /></>,
            <>Der Hochpunkt liegt bei <Formel tex="x=8" nach="," /> also <Formel tex="c=8" nach="." /> Ergebnis: <Formel tex={termSinus(K12, 'f', { funktion: 'cos', klammer: 'eckig' })} nach="." /> Probe: <Formel tex={`f(2)=1{,}4\\cos(-\\pi)+3{,}2=1{,}8`} nach="." /></>,
          ]}
        >
          <p>
            Die Tabelle zeigt den mittleren Wasserstand (in Metern) eines Flusses in den zwölf Monaten eines Jahres. Dabei steht <Formel tex="x=1" /> für Januar und <Formel tex="x=12" /> für Dezember. Beschreibe den Verlauf durch eine Funktion <Formel tex={t`f(x)=a\cdot\cos\!\left[b\,(x-c)\right]+d`} /> mit <Formel tex="a>0" /> und <Formel tex={t`0\le c<12`} nach="." />
          </p>
          <table className="tabelle tabelle-kompakt tabelle-breit">
            <caption>Mittlerer Wasserstand in Metern</caption>
            <thead>
              <tr>{MONATE.map((mo) => <th key={mo} scope="col">{mo}</th>)}</tr>
            </thead>
            <tbody>
              <tr>{K12_TABELLE.map((w, i) => <td key={i}>{text2(w)}</td>)}</tr>
            </tbody>
          </table>
          <Kontrollbild
            bereich={[0, 13, 0, 5.5]}
            xTeilung={1}
            yTeilung={1}
            punkte={K12_TABELLE.map((y, i) => ({ x: i + 1, y, farbe: FARBEN.akzent }))}
            beschreibung={`Punktwolke der zwölf Monatsmittel des Wasserstands. Der kleinste Wert ${text2(Math.min(...K12_TABELLE))} liegt bei x gleich 2, der größte Wert ${text2(Math.max(...K12_TABELLE))} bei x gleich 8.`}
          />
        </Aufgabe>
        <Kontrollschaubild>
          <Kontrollbild
            bereich={[0, 13, 0, 5.5]}
            xTeilung={1}
            yTeilung={1}
            kurven={[{ f }]}
            linien={[{ art: 'waagerecht', wert: K12.d, gestrichelt: true, farbe: FARBEN.neutral, text: 'Ruhelage 3,2' }]}
            punkte={[
              ...K12_TABELLE.map((y, i) => ({ x: i + 1, y, farbe: FARBEN.vergleich })),
              { x: 8, y: 4.6, text: 'HP(8 | 4,6)', lage: 'oben' as const },
              { x: 2, y: 1.8, text: 'TP(2 | 1,8)', lage: 'unten' as const },
            ]}
            beschreibung="Die Punktwolke der Monatsmittel und die Kurve von f mit f(x) gleich 1,4 cos von π/6 mal Klammer x minus 8 plus 3,2. Die Kurve verläuft um die Ruhelage 3,2 mit dem Hochpunkt HP(8 | 4,6) und dem Tiefpunkt TP(2 | 1,8)."
          />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="modell-anwenden">
        <Aufgabe
          nummer="K13"
          titel="Mit dem Modell rechnen"
          beiErgebnis={m('modell-anwenden')}
          felder={[
            { id: 'w', name: 'Wasserstand bei x gleich 4,5', beschriftung: <>Wasserstand bei <Formel tex="x=4{,}5" /> (in m)</>, erwartet: K13.x45, toleranz: TOL2 },
            { id: 'x1', name: 'Beginn des Zeitraums über 4 Meter', beschriftung: <><Formel tex={t`x_1`} /> (Beginn)</>, erwartet: K13.von, toleranz: TOL2 },
            { id: 'x2', name: 'Ende des Zeitraums über 4 Meter', beschriftung: <><Formel tex={t`x_2`} /> (Ende)</>, erwartet: K13.bis, toleranz: TOL2 },
          ]}
          hilfen={[
            <>Für a) setzt du <Formel tex="x=4{,}5" /> in den Funktionsterm ein. Der Taschenrechner steht im Bogenmaß.</>,
            <>Für b) löst du zuerst die Gleichung <Formel tex={t`f(x)=4`} nach="." /> Substituiere <Formel tex={t`z=\tfrac{\pi}{6}(x-8)`} nach="." /> Die zweite Lösung beim Kosinus ist <Formel tex={t`z_2=-z_1`} nach="." /> Der Wasserstand liegt zwischen den beiden Lösungen über 4 m, weil der Hochpunkt bei <Formel tex="x=8" /> dazwischen liegt.</>,
          ]}
          loesung={[
            <><Formel tex={`f(4{,}5)=1{,}4\\cos\\!\\left(\\tfrac{\\pi}{6}\\cdot(-3{,}5)\\right)+3{,}2\\approx ${d3(K13.x45)}`} nach="." /> Der Wasserstand beträgt etwa <Formel tex={`${z2(K13.x45)}`} /> m.</>,
            <><Formel tex={t`1{,}4\cos\!\left(\tfrac{\pi}{6}(x-8)\right)+3{,}2=4\ \Rightarrow\ \cos z=\tfrac{0{,}8}{1{,}4}\approx ${d3(K13.s)}`} nach="." /> Mit <Formel tex={t`z=\tfrac{\pi}{6}(x-8)`} nach="." /></>,
            <><Formel tex={`z_1=\\cos^{-1}(${d3(K13.s)})\\approx ${d3(Math.acos(K13.s))}`} nach="," /> <Formel tex={`z_2=-z_1\\approx ${d3(-Math.acos(K13.s))}`} nach="." /> Rücksubstitution <Formel tex={t`x=\tfrac{6}{\pi}z+8`} nach=":" /> <Formel tex={`x_1\\approx ${d3(K13.von)}`} nach="," /> <Formel tex={`x_2\\approx ${d3(K13.bis)}`} nach="." /></>,
            <>Antwort: Der Wasserstand liegt etwa von <Formel tex={`x=${z2(K13.von)}`} /> bis <Formel tex={`x=${z2(K13.bis)}`} /> über 4 m, also etwa {text2(K13.dauer)} Monate lang. Für <Formel tex={t`x=8`} /> gilt <Formel tex={t`f(8)=4{,}6>4`} nach="," /> das passt zum Hochpunkt in der Mitte.</>,
          ]}
        >
          <p>
            Ein Modell für den Wasserstand eines Flusses (in m) ist <Formel tex={termSinus(K12, 'f', { funktion: 'cos', klammer: 'eckig' })} /> für <Formel tex={t`x\in[0;\,12]`} nach="." /> Dabei steht <Formel tex="x" /> für die Zeit in Monaten.
          </p>
          <ul className="liste">
            <li>a) Berechne den Wasserstand bei <Formel tex="x=4{,}5" nach="." /></li>
            <li>b) Bestimme den Zeitraum, in dem der Wasserstand über 4 m liegt, mit den Grenzen <Formel tex={t`x_1<x_2`} nach="." /></li>
          </ul>
        </Aufgabe>
        <Kontrollschaubild>
          <Kontrollbild
            bereich={[0, 13, 0, 5.5]}
            xTeilung={1}
            yTeilung={1}
            kurven={[{ f }]}
            linien={[{ art: 'waagerecht', wert: 4, gestrichelt: true, farbe: FARBEN.neutral, text: '4 m' }]}
            punkte={[
              { x: 4.5, y: K13.x45, farbe: ORANGE, lot: true, text: `f(4,5) ≈ ${text2(K13.x45)}`, lage: 'unten' },
              { x: K13.von, y: 4, lot: true, lage: 'oben', text: `x1 ≈ ${text2(K13.von)}` },
              { x: K13.bis, y: 4, lot: true, lage: 'oben', text: `x2 ≈ ${text2(K13.bis)}` },
            ]}
            beschreibung={`Schaubild des Modells mit der Geraden y gleich 4. Sie schneidet die Kurve bei x gleich ${text2(K13.von)} und x gleich ${text2(K13.bis)}. Zwischen diesen Stellen liegt die Kurve über 4. Orange markiert ist der Wert bei x gleich 4,5, etwa ${text2(K13.x45)}.`}
          />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="modell-deuten">
        <Auswahlfrage
          nummer="K17"
          titel="Kennwerte im Sachzusammenhang deuten"
          beiErgebnis={m('modell-deuten')}
          optionen={platziere(
            [
              opt('a', <>Eine Umdrehung dauert 8 Minuten. Die höchste Gondelhöhe beträgt 45 m.</>, true, <>Richtig. Die Periode ist <Formel tex={t`p=\tfrac{2\pi}{\pi/4}=8`} /> (Minuten). Der größte Wert ist die Ruhelage plus die Amplitude: <Formel tex="25+20=45" /> (Meter).</>),
              opt('b', <>Eine Umdrehung dauert 4 Minuten. Die höchste Gondelhöhe beträgt 45 m.</>, false, <>Bei <Formel tex="t=4" /> liegt der erste Hochpunkt. Das ist erst die halbe Periode. Eine Umdrehung dauert <Formel tex={t`p=\tfrac{2\pi}{b}=8`} nach="." /></>),
              opt('c', <>Eine Umdrehung dauert 8 Minuten. Die Gondel startet in 25 m Höhe.</>, false, <>25 m ist die Ruhelage <Formel tex="d" nach="," /> also die Höhe der Achse. Gestartet wird bei <Formel tex="t=0" nach="," /> und dort ist <Formel tex={t`h(0)=-20+25=5`} /> (Meter), der tiefste Punkt.</>),
              opt('d', <>Eine Umdrehung dauert 8 Minuten. Der Durchmesser des Rades beträgt 20 m.</>, false, <>20 m ist die Amplitude, also der <strong>Radius</strong>. Der Durchmesser ist der Abstand zwischen höchstem und tiefstem Punkt: <Formel tex="45-5=40" /> (Meter).</>),
            ],
            0,
          )}
          erklaerung={
            <>
              Du deutest die Parameter im Zusammenhang: <Formel tex="d=25" /> ist die Höhe der Achse, <Formel tex="|a|=20" /> der Radius, <Formel tex={t`p=\tfrac{2\pi}{b}=8`} /> die Dauer einer Umdrehung. Das Minuszeichen bei <Formel tex={t`a`} /> bedeutet, dass die Gondel bei <Formel tex="t=0" /> im tiefsten Punkt startet. Höchster Punkt: <Formel tex={`${K17_E.mitte}+20=${K17_E.hoechste}`} nach="," /> tiefster Punkt: <Formel tex={`${K17_E.mitte}-20=${K17_E.tiefste}`} nach="." />
              <Kontrollbild
                bereich={[-1, 17, -5, 50]}
                xTeilung={2}
                yTeilung={10}
                kurven={[{ f: cosF(K17) }]}
                linien={[{ art: 'waagerecht', wert: K17.d, gestrichelt: true, farbe: FARBEN.neutral, text: 'd = 25' }]}
                punkte={[
                  { x: 0, y: K17_E.tiefste, text: 'Start 5 m', lage: 'rechts' },
                  { x: 4, y: K17_E.hoechste, text: 'HP(4 | 45)', lage: 'oben' },
                  { x: 8, y: K17_E.tiefste, text: 'TP(8 | 5)', lage: 'unten' },
                ]}
                beschreibung="Schaubild der Gondelhöhe über der Zeit in Minuten. Die Kurve startet bei 5 m im tiefsten Punkt, erreicht bei t gleich 4 den Hochpunkt 45 m und ist bei t gleich 8 wieder im Tiefpunkt. Die Ruhelage liegt bei 25 m, die Periode beträgt 8 Minuten."
              />
            </>
          }
        >
          <p>
            Die Höhe einer Gondel eines Riesenrads über dem Boden wird beschrieben durch <Formel tex={termSinus(K17, 'h', { funktion: 'cos', klammer: 'eckig' }).replace('h(x)', 'h(t)').replace('x', 't')} /> mit <Formel tex="t" /> in Minuten und <Formel tex="h(t)" /> in Metern. Welche Aussage ist richtig?
          </p>
        </Auswahlfrage>
      </Punkt>

      <Punkt id="komplex">
        <p>
          Hier gibt es keine Kontrollaufgabe. Die gemischten Aufgaben und Abituraufgaben im Modul „Modellierungs- und Anwendungsaufgaben“ verbinden alle Bereiche. Schätze dich nach der Bearbeitung ein, nicht davor.
        </p>
      </Punkt>
    </Abschnitt>
  );
}

/* ---------- Abschnitt Auswertung ---------- */

const KONTROLLE_TEXT: Record<KontrollStatus, string> = {
  keine: 'Keine Kontrollaufgabe.',
  offen: 'Kontrollaufgabe noch nicht bearbeitet.',
  teilweise: 'Kontrollaufgabe teilweise bearbeitet.',
  richtig: 'Kontrollaufgabe richtig gelöst.',
  falsch: 'Kontrollaufgabe noch nicht richtig gelöst.',
};

function empfehlungsText(e: Empfehlung, status: KontrollStatus): ReactNode {
  const kontrolleRichtig = status === 'richtig';
  switch (e) {
    case 'zuerst':
      return kontrolleRichtig ? 'Du hast „−−“ gewählt, die Kontrollaufgabe war aber richtig. Vielleicht kannst du dir mehr zutrauen. Arbeite sonst die verlinkten Abschnitte durch.' : 'Hier solltest du anfangen. Arbeite die verlinkten Abschnitte durch und löse danach die Kontrollaufgabe.';
    case 'ueben':
      return kontrolleRichtig ? 'Du hast „00“ gewählt, die Kontrollaufgabe war richtig. Übe noch einige Aufgaben in den verlinkten Abschnitten.' : 'Übe diese Aussage in den verlinkten Abschnitten, bis du dir sicher bist.';
    case 'pruefen':
      return 'Du hast „++“ gewählt, aber die Kontrollaufgabe war noch nicht richtig. Schau dir die Lösung an und wiederhole in den verlinkten Abschnitten.';
    case 'einschaetzen':
      return 'Du hast diese Aussage noch nicht eingeschätzt.';
    case 'gut':
      return status === 'offen' ? 'Prüfe deine Einschätzung noch mit der Kontrollaufgabe.' : 'Das sieht gut aus. Wiederhole sie kurz vor der Klassenarbeit.';
  }
}

function AuswertungBereich() {
  const { wahl, ergebnisse, zuruecksetzen } = useIchKann();
  const z = zaehle(AUSSAGEN, wahl);
  const liste = nachDringlichkeit(AUSSAGEN, wahl, ergebnisse);
  const bearbeitet = AUSSAGEN.filter((a) => kontrollStatus(a, ergebnisse) !== 'keine' && kontrollStatus(a, ergebnisse) !== 'offen');
  const richtig = bearbeitet.filter((a) => kontrollStatus(a, ergebnisse) === 'richtig');
  const eingeschaetzt = AUSSAGEN.length - z.offen;
  return (
    <Abschnitt id="auswertung" titel="Auswertung">
      <p>
        Die Auswertung ordnet alle Aussagen nach Dringlichkeit: zuerst „−−“, dann „00“, dann „++“ mit nicht richtiger Kontrollaufgabe, dann noch nicht eingeschätzte Aussagen, zuletzt Aussagen, die gut aussehen. Sie ändert sich mit deinen Einschätzungen und deinen Kontrollaufgaben.
      </p>
      <ul className="ik-fortschritt" aria-label="Zusammenfassung deiner Einschätzung">
        <li>
          Eingeschätzt: <strong>{eingeschaetzt}</strong> von {AUSSAGEN.length}
        </li>
        <li>
          {WAHL_ZEICHEN.sicher}: <strong>{z.sicher}</strong>
        </li>
        <li>
          {WAHL_ZEICHEN.ueben}: <strong>{z.ueben}</strong>
        </li>
        <li>
          {WAHL_ZEICHEN['noch-nicht']}: <strong>{z['noch-nicht']}</strong>
        </li>
        <li>
          Kontrollaufgaben richtig: <strong>{richtig.length}</strong> von {bearbeitet.length} bearbeiteten
        </li>
      </ul>
      {eingeschaetzt === 0 && (
        <Hinweis titel="Noch nichts eingeschätzt">
          Du hast noch keine Aussage eingeschätzt. Gehe zuerst die vier Bereiche durch. Danach zeigt dir diese Seite, was du zuerst üben solltest.
        </Hinweis>
      )}
      <ol className="ik-liste" aria-label="Aussagen nach Dringlichkeit">
        {liste.map(({ aussage: a, wahl: w, status, empfehlung: e }) => (
          <li key={a.id} data-empfehlung={e}>
            <p>
              <strong>
                {a.nr}. Ich kann {a.text}
              </strong>
            </p>
            <p>
              Einschätzung: <strong>{w ? WAHL_ZEICHEN[w] : 'keine'}</strong>. {KONTROLLE_TEXT[status]}
            </p>
            <p>{empfehlungsText(e, status)}</p>
            {e !== 'gut' && <Verweise id={a.id} />}
          </li>
        ))}
      </ol>
      <div className="aufgabe-knoepfe">
        <button type="button" className="knopf-zweit" onClick={zuruecksetzen}>
          Alle Einschätzungen und Ergebnisse zurücksetzen
        </button>
      </div>
      <Hinweis titel="Zum Weiterarbeiten">
        Die Module im Überblick: {Object.entries(MODULE).map(([id, titel], i) => (
          <span key={id}>
            {i > 0 && ', '}
            <Modulverweis modul={id}>{titel}</Modulverweis>
          </span>
        ))}
        .
      </Hinweis>
    </Abschnitt>
  );
}

export default function Modul() {
  return (
    <ZustandAnbieter>
      <Anleitung />
      <EinheitskreisBereich />
      <SchaubildBereich />
      <GleichungenBereich />
      <AnwendungenBereich />
      <AuswertungBereich />
    </ZustandAnbieter>
  );
}
