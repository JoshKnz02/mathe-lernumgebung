import type { ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { SKIZZE_1, SKIZZE_2 } from '@/lib/grafisch';
import {
  BILD_A1_F,
  BILD_A1_G,
  BILD_A1_H,
  BILD_A7,
  BILD_A7_KONTROLLE,
  BILD_A8,
  BILD_F9,
  BILD_ZUORD,
  PAAR_A1,
  PAAR_A7,
  PAAR_A8,
  PAAR_MONOTONIE,
  PAAR_SKIZZE_1,
  PAAR_SKIZZE_2,
  PAAR_ZUORD_F,
  PAAR_ZUORD_G,
  PAAR_ZUORD_H,
} from './Bilder';
import { A7, A8, ZUORDNUNG } from './daten';
import { Paarbild } from './Paarbild';
import { Skizzenaufgabe } from './Skizzenaufgabe';

const KF = <Formel tex="K_f" />;
const KDF = <Formel tex="K_{f'}" />;

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl oder als Dezimalzahl mit Komma ein, zum Beispiel <code>2</code> oder <code>-1,5</code>, ohne Einheit. Negative Zahlen schreibst du mit Minuszeichen. Bei den Auswahlfragen wählst du genau eine Antwort aus. Das Zeichenfeld in den Aufgaben 5 und 6 bedienst du durch Tippen.
    </Hinweis>
  );
}

function Frage1() {
  const optionen = [
    opt(
      'h',
      <>Ja, <Formel tex="H" nach="." /> Bei <Formel tex="x=-2" /> hat {KF} einen Tiefpunkt, bei <Formel tex="x=0" /> eine aufsteigende Sattelstelle.</>,
      true,
      <>Richtig.</>,
    ),
    opt(
      'g',
      <>Ja, <Formel tex="G" nach="." /> Das Schaubild <Formel tex="G" /> hat bei <Formel tex="x=-2" /> eine Nullstelle, genau dort liegt der Tiefpunkt von <Formel tex="K_f" nach="." /></>,
      false,
      <>Eine Nullstelle allein genügt nicht. Bei einem Tiefpunkt muss das Schaubild der Ableitungsfunktion von minus nach plus wechseln. <Formel tex="G" /> berührt bei <Formel tex="x=-2" /> die x-Achse nur und bleibt negativ. Außerdem hätte {KF} dann bei <Formel tex="x=0" /> einen Extrempunkt, es hat aber nur eine Sattelstelle.</>,
    ),
    opt(
      'beide',
      <>Beide Schaubilder passen, denn sie haben bei <Formel tex="x=-2" /> und bei <Formel tex="x=0" /> Nullstellen wie die waagerechten Tangenten von <Formel tex="K_f" nach="." /></>,
      false,
      <>Bei den Nullstellen kommt es auf das Vorzeichen davor und danach an. {KF} hat bei <Formel tex="x=-2" /> einen Tiefpunkt (Wechsel von minus nach plus) und bei <Formel tex="x=0" /> eine aufsteigende Sattelstelle (kein Wechsel). Nur ein Schaubild erfüllt beides.</>,
    ),
    opt(
      'keines',
      <>Keines, denn das Schaubild einer Ableitungsfunktion kann nie unter der x-Achse liegen.</>,
      false,
      <>Das Schaubild einer Ableitungsfunktion liegt unter der x-Achse, wo {KF} fällt. Links von <Formel tex="x=-2" /> fällt <Formel tex="K_f" nach="," /> dort ist die Ableitung negativ.</>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="1"
      titel="Welches Schaubild gehört zur Ableitungsfunktion?"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Bei <Formel tex="x=-2" /> hat {KF} einen Tiefpunkt: <Formel tex="f'" /> hat dort eine Nullstelle mit Vorzeichenwechsel von minus nach plus. Bei <Formel tex="x=0" /> hat {KF} eine aufsteigende Sattelstelle: <Formel tex="f'" /> hat dort eine Nullstelle ohne Vorzeichenwechsel und bleibt positiv, das Schaubild berührt die x-Achse von oben. Beides erfüllt <Formel tex="H" nach="." />
          </p>
          <Paarbild daten={PAAR_A1} unter={<>Oben <Formel tex="K_f" nach="," /> darunter das Schaubild <Formel tex="H" /> der Ableitungsfunktion mit den zusammengehörigen Punkten <Formel tex="T" /> und <Formel tex="S" nach="." /></>} />
        </>
      }
    >
      <p>
        {KF} ist das Schaubild der Funktion <Formel tex="f" nach="." /> Ist eines der beiden Schaubilder <Formel tex="G" /> und <Formel tex="H" /> das Schaubild der Ableitungsfunktion von <Formel tex="f" nach="?" />
      </p>
      <div className="bilder-paar">
        <Bild daten={BILD_A1_F} unter={<>Das Schaubild <Formel tex="K_f" nach="." /></>} />
        <Bild daten={BILD_A1_G} unter={<>Das Schaubild <Formel tex="G" nach="." /></>} />
        <Bild daten={BILD_A1_H} unter={<>Das Schaubild <Formel tex="H" nach="." /></>} />
      </div>
    </Auswahlfrage>
  );
}

/** Antwortmöglichkeiten A bis D, immer in dieser Reihenfolge. Die richtige steht deshalb nicht immer an derselben Stelle. */
function zuordnung(richtig: 'A' | 'B' | 'C' | 'D', rueckmeldungen: Record<'A' | 'B' | 'C' | 'D', ReactNode>) {
  return (['A', 'B', 'C', 'D'] as const).map((b) => opt(b, <>Schaubild {b}</>, b === richtig, rueckmeldungen[b]));
}

function Frage2() {
  return (
    <Auswahlfrage
      nummer="2"
      titel="Zuordnen: Ableitungsfunktion von f"
      optionen={zuordnung('D', {
        A: <>Das Schaubild <Formel tex="A" /> hat wie gesucht Nullstellen bei <Formel tex="x=-1" /> und <Formel tex="x=1" nach="," /> aber die Vorzeichen stimmen nicht. Bei <Formel tex="x=-1" /> wechselt <Formel tex="A" /> von plus nach minus. Das gehört zu einem Hochpunkt, {KF} hat dort aber einen Tiefpunkt.</>,
        B: <><Formel tex="B" /> hat nur eine Nullstelle. {KF} hat aber zwei Stellen mit waagerechter Tangente.</>,
        C: <><Formel tex="C" /> berührt die x-Achse nur in einem Punkt. {KF} hat aber zwei Extrempunkte, die zwei Nullstellen mit Vorzeichenwechsel verlangen.</>,
        D: <>Richtig.</>,
      })}
      erklaerung={
        <>
          <p>
            {KF} hat bei <Formel tex="x=-1" /> einen Tiefpunkt und bei <Formel tex="x=1" /> einen Hochpunkt. Das Schaubild der Ableitungsfunktion hat dort Nullstellen, bei <Formel tex="x=-1" /> mit Vorzeichenwechsel von minus nach plus, bei <Formel tex="x=1" /> von plus nach minus. Das ist <Formel tex="D" nach="." /> Passend dazu hat {KF} bei <Formel tex="x=0" /> eine Wendestelle und <Formel tex="D" /> dort seinen Hochpunkt.
          </p>
          <Paarbild daten={PAAR_ZUORD_F} unter={<>Oben <Formel tex="K_f" nach="," /> darunter das Schaubild <Formel tex="D" nach="." /></>} />
        </>
      }
    >
      <p>
        Welches der Schaubilder <Formel tex="A" /> bis <Formel tex="D" /> ist das Schaubild der Ableitungsfunktion von <Formel tex="f" nach="?" /> Die Schaubilder stehen oben bei der Abbildung zu den Aufgaben 2 bis 4.
      </p>
    </Auswahlfrage>
  );
}

function Frage3() {
  return (
    <Auswahlfrage
      nummer="3"
      titel="Zuordnen: Ableitungsfunktion von g"
      optionen={zuordnung('B', {
        A: <><Formel tex="A" /> hat zwei Nullstellen mit Vorzeichenwechsel. <Formel tex="K_g" /> hat aber nur einen Extrempunkt, also nur eine Nullstelle mit Vorzeichenwechsel.</>,
        B: <>Richtig.</>,
        C: <><Formel tex="C" /> ist nie negativ. Dann dürfte <Formel tex="K_g" /> nirgends fallen, links von <Formel tex="x=1" /> fällt es aber.</>,
        D: <><Formel tex="D" /> hat zwei Nullstellen mit Vorzeichenwechsel und ist links von <Formel tex="x=-1" /> negativ. <Formel tex="K_g" /> hat nur einen Tiefpunkt bei <Formel tex="x=1" nach="." /></>,
      })}
      erklaerung={
        <>
          <p>
            <Formel tex="K_g" /> fällt bis <Formel tex="x=1" nach="," /> hat dort den Tiefpunkt und steigt danach. Das Schaubild der Ableitungsfunktion ist links von <Formel tex="x=1" /> negativ, hat bei <Formel tex="x=1" /> eine Nullstelle mit Vorzeichenwechsel von minus nach plus und ist danach positiv. Das ist die Gerade <Formel tex="B" nach="." />
          </p>
          <Paarbild daten={PAAR_ZUORD_G} unter={<>Oben <Formel tex="K_g" nach="," /> darunter das Schaubild <Formel tex="B" nach="." /></>} />
        </>
      }
    >
      <p>
        Welches der Schaubilder <Formel tex="A" /> bis <Formel tex="D" /> ist das Schaubild der Ableitungsfunktion von <Formel tex="g" nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Frage4() {
  return (
    <Auswahlfrage
      nummer="4"
      titel="Zuordnen: Ableitungsfunktion von h"
      optionen={zuordnung('C', {
        A: <><Formel tex="A" /> hat zwei Nullstellen mit Vorzeichenwechsel, also müsste <Formel tex="K_h" /> zwei Extrempunkte haben. Es hat keinen.</>,
        B: <><Formel tex="B" /> ist links von <Formel tex="x=1" /> negativ. <Formel tex="K_h" /> steigt aber im ganzen Bereich.</>,
        C: <>Richtig.</>,
        D: <><Formel tex="D" /> wird für große <Formel tex="x" /> negativ. <Formel tex="K_h" /> fällt aber nirgends.</>,
      })}
      erklaerung={
        <>
          <p>
            <Formel tex="K_h" /> steigt überall und hat bei <Formel tex="x=0" /> eine waagerechte Tangente. Das ist eine aufsteigende Sattelstelle. Das Schaubild der Ableitungsfunktion ist nie negativ und berührt die x-Achse bei <Formel tex="x=0" /> ohne Vorzeichenwechsel: ein Tiefpunkt auf der x-Achse. Das ist <Formel tex="C" nach="." />
          </p>
          <Paarbild daten={PAAR_ZUORD_H} unter={<>Oben <Formel tex="K_h" nach="," /> darunter das Schaubild <Formel tex="C" nach="." /></>} />
        </>
      }
    >
      <p>
        Welches der Schaubilder <Formel tex="A" /> bis <Formel tex="D" /> ist das Schaubild der Ableitungsfunktion von <Formel tex="h" nach="?" />
      </p>
    </Auswahlfrage>
  );
}

function Abbildung24() {
  return (
    <>
      <h3>Abbildung zu den Aufgaben 2 bis 4</h3>
      <p>
        Oben stehen die Schaubilder <Formel tex="K_f" nach="," /> <Formel tex="K_g" /> und <Formel tex="K_h" nach="," /> darunter die Schaubilder <Formel tex="A" /> bis <Formel tex="D" nach="." /> Drei von ihnen gehören zu den Ableitungsfunktionen von <Formel tex="f" nach="," /> <Formel tex="g" /> und <Formel tex="h" nach="." /> Eines gehört zu keiner der drei Funktionen.
      </p>
      <div className="bilder-paar">
        <Bild daten={BILD_ZUORD.f!} unter={<>Das Schaubild <Formel tex="K_f" nach="." /></>} />
        <Bild daten={BILD_ZUORD.g!} unter={<>Das Schaubild <Formel tex="K_g" nach="." /></>} />
        <Bild daten={BILD_ZUORD.h!} unter={<>Das Schaubild <Formel tex="K_h" nach="." /></>} />
        <Bild daten={BILD_ZUORD.A!} unter={<>Das Schaubild <Formel tex="A" nach="." /></>} />
        <Bild daten={BILD_ZUORD.B!} unter={<>Das Schaubild <Formel tex="B" nach="." /></>} />
        <Bild daten={BILD_ZUORD.C!} unter={<>Das Schaubild <Formel tex="C" nach="." /></>} />
        <Bild daten={BILD_ZUORD.D!} unter={<>Das Schaubild <Formel tex="D" nach="." /></>} />
      </div>
    </>
  );
}

function Aufgabe5() {
  return (
    <Skizzenaufgabe
      nummer="5"
      titel="Ableitungsfunktion skizzieren, Fall 1"
      skizze={SKIZZE_1}
      bildBeschreibung="Schaubild K f: steigt von links mit abflachender Steigung bis zu einer waagerechten Tangente bei x gleich minus 2 und steigt dort weiter. Es erreicht einen Hochpunkt bei x gleich 1, fällt bis zu einem Tiefpunkt bei x gleich 3 und steigt danach wieder, zunehmend steil."
      hilfen={[
        <>Suche zuerst die Stellen, an denen die Tangente waagerecht ist. Dort liegt {KDF} auf der x-Achse. Unterscheide Hochpunkt, Tiefpunkt und Sattelstelle.</>,
        <>Bestimme zwischen diesen Stellen, ob {KF} steigt ({KDF} oberhalb der x-Achse) oder fällt ({KDF} unterhalb). Bei einer Sattelstelle ändert sich das Vorzeichen nicht.</>,
        <>Wo {KF} besonders steil ist, hat {KDF} große Beträge. An den Wendestellen von {KF} hat {KDF} Extrempunkte.</>,
      ]}
      loesung={[
        <>{KF} hat bei <Formel tex="x=-2" /> eine aufsteigende Sattelstelle, bei <Formel tex="x=1" /> einen Hochpunkt und bei <Formel tex="x=3" /> einen Tiefpunkt. {KDF} hat dort Nullstellen: bei <Formel tex="x=-2" /> ohne Vorzeichenwechsel (Tiefpunkt auf der x-Achse), bei <Formel tex="x=1" /> mit Vorzeichenwechsel von plus nach minus, bei <Formel tex="x=3" /> von minus nach plus.</>,
        <>{KF} steigt links von <Formel tex="x=1" nach="," /> fällt zwischen <Formel tex="x=1" /> und <Formel tex="x=3" /> und steigt rechts von <Formel tex="x=3" nach="." /> Also liegt {KDF} zuerst oberhalb der x-Achse (mit Berührpunkt bei <Formel tex="x=-2" nach=")," /> dann unterhalb, dann wieder oberhalb.</>,
        <>
          Zwischen der Sattelstelle und dem Hochpunkt hat {KF} eine Wendestelle bei etwa <Formel tex={t`x=-0{,}2`} nach=":" /> {KDF} hat dort einen Hochpunkt. Zwischen dem Hochpunkt und dem Tiefpunkt liegt die Wendestelle bei etwa <Formel tex="x=2{,}2" nach=":" /> {KDF} hat dort einen Tiefpunkt. Rechts von <Formel tex="x=3" /> wird {KF} immer steiler, {KDF} steigt immer weiter.
          <Paarbild daten={PAAR_SKIZZE_1} unter={<>Oben <Formel tex="K_f" nach="," /> darunter <Formel tex="K_{f'}" nach="." /> <Formel tex="S" nach="," /> <Formel tex="H" nach="," /> <Formel tex="T" /> und <Formel tex="W" /> zeigen die zusammengehörigen Stellen.</>} />
        </>,
      ]}
    >
      <p>
        Leite grafisch ab: Skizziere das Schaubild {KDF} der Ableitungsfunktion von <Formel tex="f" nach="." />
      </p>
    </Skizzenaufgabe>
  );
}

function Aufgabe6() {
  return (
    <Skizzenaufgabe
      nummer="6"
      titel="Ableitungsfunktion skizzieren, Fall 2"
      skizze={SKIZZE_2}
      bildBeschreibung="Schaubild K f: kommt von links oben, steigt bis zu einem Hochpunkt bei x gleich minus 2, fällt danach, hat bei x gleich 1 eine waagerechte Tangente und fällt dort weiter, erreicht einen Tiefpunkt bei x gleich 3 und steigt danach wieder."
      hilfen={[
        <>Gehe vor wie bei Aufgabe 5: Stellen mit waagerechter Tangente suchen und zwischen ihnen das Vorzeichen von <Formel tex="f'" /> bestimmen.</>,
        <>Bei <Formel tex="x=1" /> fällt {KF} vor und nach der waagerechten Tangente. Was bedeutet das für das Vorzeichen von <Formel tex="f'" nach="?" /></>,
        <>Zeichne links von <Formel tex="x=-2" /> positive und rechts von <Formel tex="x=3" /> positive Werte. Dazwischen liegt {KDF} unterhalb der x-Achse.</>,
      ]}
      loesung={[
        <>{KF} hat bei <Formel tex="x=-2" /> einen Hochpunkt, bei <Formel tex="x=1" /> eine absteigende Sattelstelle und bei <Formel tex="x=3" /> einen Tiefpunkt. {KDF} hat Nullstellen: bei <Formel tex="x=-2" /> mit Vorzeichenwechsel von plus nach minus, bei <Formel tex="x=1" /> ohne Vorzeichenwechsel (Hochpunkt auf der x-Achse), bei <Formel tex="x=3" /> von minus nach plus.</>,
        <>{KF} steigt links von <Formel tex="x=-2" nach="," /> fällt zwischen <Formel tex="x=-2" /> und <Formel tex="x=3" /> (auch bei der Sattelstelle) und steigt rechts von <Formel tex="x=3" nach="." /> {KDF} liegt also oberhalb, dann unterhalb und berührt dabei bei <Formel tex="x=1" /> die x-Achse von unten, dann wieder oberhalb.</>,
        <>
          Die Wendestellen von {KF} liegen bei etwa <Formel tex={t`x=-1{,}1`} /> und <Formel tex="x=2{,}4" nach=":" /> {KDF} hat dort Tiefpunkte, bei <Formel tex="x=-1{,}1" /> den tieferen. Bei der Sattelstelle <Formel tex="x=1" /> liegt ein Hochpunkt auf der x-Achse.
          <Paarbild daten={PAAR_SKIZZE_2} unter={<>Oben <Formel tex="K_f" nach="," /> darunter <Formel tex="K_{f'}" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Skizziere das Schaubild {KDF} der Ableitungsfunktion von <Formel tex="f" nach="." />
      </p>
    </Skizzenaufgabe>
  );
}

function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Eigenschaften am Schaubild ablesen"
      felder={[
        { id: 'h', name: 'Stelle des Hochpunkts', beschriftung: <>Stelle des Hochpunkts</>, erwartet: A7.hoch },
        { id: 't', name: 'Stelle des Tiefpunkts', beschriftung: <>Stelle des Tiefpunkts</>, erwartet: A7.tief },
        { id: 'w', name: 'Stelle der Wendestelle', beschriftung: <>Stelle der Wendestelle</>, erwartet: A7.wende },
        { id: 'm', name: 'Steigung der Tangente an der Wendestelle', beschriftung: <>Steigung der Wendetangente</>, erwartet: A7.steigungWende },
      ]}
      hilfen={[
        <>Hochpunkt und Tiefpunkt erkennst du an der waagerechten Tangente, die Wendestelle an dem Punkt, an dem die Kurve von einer Rechts- in eine Linkskurve wechselt.</>,
        <>Für die Steigung der Wendetangente legst du ein Steigungsdreieck an die gestrichelte Gerade. Lies zwei Punkte der Geraden am Gitter ab.</>,
      ]}
      loesung={[
        <>Der Hochpunkt liegt bei <Formel tex="x=1" nach="," /> der Tiefpunkt bei <Formel tex="x=3" nach="." /> Dort ist die Tangente waagerecht, {KDF} hat dort Nullstellen mit Vorzeichenwechsel von plus nach minus bzw. von minus nach plus.</>,
        <>Die Wendestelle liegt bei <Formel tex="x=2" nach="." /> Die Tangente geht durch <Formel tex={t`(0\,|\,4)`} /> und <Formel tex={t`(4\,|\,0)`} nach="," /> ihre Steigung ist <Formel tex={t`\frac{0-4}{4-0}=-1`} nach="." /></>,
        <>
          Zwischen Hochpunkt und Tiefpunkt fällt <Formel tex="K_f" nach="," /> am steilsten an der Wendestelle. Dort hat {KDF} seinen tiefsten Punkt mit dem Wert <Formel tex="-1" nach="." />
          <Paarbild daten={PAAR_A7} unter={<>Oben {KF} mit <Formel tex="H" nach="," /> <Formel tex="W" /> und <Formel tex="T" nach="," /> darunter {KDF} mit zwei Nullstellen und dem Tiefpunkt bei <Formel tex={t`(2\,|\,-1)`} nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Die Abbildung zeigt {KF} mit einem Hochpunkt, einem Tiefpunkt, einer Wendestelle und der Tangente in der Wendestelle. Lies die Stellen und die Steigung der Wendetangente ab. Was folgt daraus für <Formel tex="K_{f'}" nach="?" />
      </p>
      <Bild daten={BILD_A7} unter={<>Das Schaubild {KF} und die gestrichelte Tangente an der Wendestelle.</>} />
      <Kontrollschaubild>
        <Bild daten={BILD_A7_KONTROLLE} unter={<>Hochpunkt <Formel tex="H" nach="," /> Tiefpunkt <Formel tex="T" nach="," /> Wendestelle <Formel tex="W" /> und das Steigungsdreieck der Wendetangente.</>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Von der Ableitung auf die Funktion schließen"
      felder={[
        { id: 'h', name: 'Stelle des Hochpunkts von K f', beschriftung: <>Hochpunkt von {KF} bei <Formel tex="x" /></>, erwartet: A8.hoch },
        { id: 't', name: 'Stelle des Tiefpunkts von K f', beschriftung: <>Tiefpunkt von {KF} bei <Formel tex="x" /></>, erwartet: A8.tief },
        { id: 's', name: 'Stelle der Sattelstelle von K f', beschriftung: <>Sattelstelle von {KF} bei <Formel tex="x" /></>, erwartet: A8.sattel },
      ]}
      hilfen={[
        <>Markiere alle Nullstellen von <Formel tex="K_{f'}" nach="." /> Dort hat {KF} eine waagerechte Tangente.</>,
        <>Prüfe an jeder Nullstelle, ob <Formel tex="f'" /> das Vorzeichen wechselt. Plus nach minus bedeutet Hochpunkt, minus nach plus Tiefpunkt. Ohne Vorzeichenwechsel liegt eine Sattelstelle vor.</>,
      ]}
      loesung={[
        <>Die Nullstellen von {KDF} liegen bei <Formel tex="x=-2" nach="," /> <Formel tex="x=1" /> und <Formel tex="x=3" nach="." /></>,
        <>Bei <Formel tex="x=-2" /> wechselt <Formel tex="f'" /> von plus nach minus: Hochpunkt von <Formel tex="K_f" nach="." /> Bei <Formel tex="x=1" /> wechselt <Formel tex="f'" /> von minus nach plus: Tiefpunkt. Bei <Formel tex="x=3" /> berührt {KDF} die x-Achse von oben, ohne das Vorzeichen zu wechseln: aufsteigende Sattelstelle.</>,
        <>
          {KF} steigt bis <Formel tex="x=-2" nach="," /> fällt bis <Formel tex="x=1" /> und steigt danach weiter, mit einer waagerechten Tangente bei <Formel tex="x=3" nach="." />
          <Paarbild daten={PAAR_A8} unter={<>Unten das gegebene <Formel tex="K_{f'}" nach="," /> oben ein dazu passendes <Formel tex="K_f" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Die Abbildung zeigt das Schaubild {KDF} der Ableitungsfunktion einer Funktion <Formel tex="f" nach="." /> Bestimme die Stellen, an denen {KF} einen Hochpunkt, einen Tiefpunkt und eine Sattelstelle hat.
      </p>
      <Bild daten={BILD_A8} unter={<>Das Schaubild <Formel tex="K_{f'}" nach="." /></>} />
      <Kontrollschaubild>
        <Paarbild daten={PAAR_A8} unter={<>Unten das gegebene <Formel tex="K_{f'}" nach="," /> oben ein passendes <Formel tex="K_f" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

function Frage9() {
  const optionen = [
    opt('sattel', <>{KF} hat bei <Formel tex="x=0" /> eine waagerechte Tangente, aber keinen Extrempunkt: eine aufsteigende Sattelstelle.</>, true, <>Richtig.</>),
    opt('hoch', <>{KF} hat bei <Formel tex="x=0" /> einen Hochpunkt.</>, false, <>Ein Hochpunkt braucht einen Vorzeichenwechsel von plus nach minus. <Formel tex="f'" /> ist hier links und rechts von <Formel tex="x=0" /> positiv.</>),
    opt('tief', <>{KF} hat bei <Formel tex="x=0" /> einen Tiefpunkt, denn {KDF} hat dort einen Tiefpunkt.</>, false, <>Das ist eine Verwechslung: Der Tiefpunkt von {KDF} liegt auf der x-Achse. Für einen Tiefpunkt von {KF} müsste <Formel tex="f'" /> von minus nach plus wechseln, hier bleibt es positiv.</>),
    opt('keine', <>{KF} hat bei <Formel tex="x=0" /> keine waagerechte Tangente.</>, false, <>Doch: <Formel tex="f'(0)=0" /> bedeutet, dass die Tangente die Steigung null hat, also waagerecht verläuft.</>),
  ];
  return (
    <Auswahlfrage
      nummer="9"
      titel="Nullstelle von f′ und Extrempunkt"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            Eine Nullstelle von <Formel tex="f'" /> allein beweist noch keinen Extrempunkt von <Formel tex="K_f" nach="." /> Entscheidend ist der Vorzeichenwechsel. Hier ist <Formel tex="f'(x)=x^2" /> nie negativ, die Nullstelle hat keinen Vorzeichenwechsel. {KF} steigt davor und danach.
          </p>
          <Paarbild daten={PAAR_ZUORD_H} unter={<>Unten <Formel tex="K_{f'}" nach="," /> oben ein passendes {KF} mit der aufsteigenden Sattelstelle <Formel tex="S" nach="." /></>} />
        </>
      }
    >
      <p>
        Das Schaubild {KDF} berührt bei <Formel tex="x=0" /> die x-Achse (es gehört zu <Formel tex="f'(x)=x^2" nach=")." /> Welche Aussage über {KF} ist richtig?
      </p>
      <Bild daten={BILD_F9} unter={<>Das Schaubild <Formel tex="K_{f'}" nach="." /></>} />
    </Auswahlfrage>
  );
}

function Frage10() {
  const optionen = [
    opt('ge', <><Formel tex={t`f'(x)\ge 0`} /> für alle <Formel tex="x" /> aus <Formel tex="[a;\,b]" nach="." /></>, true, <>Richtig.</>),
    opt('gt', <><Formel tex={t`f'(x)>0`} /> für alle <Formel tex="x" /> aus <Formel tex="[a;\,b]" nach="." /></>, false, <>Das stimmt nicht immer. <Formel tex="f(x)=x^3" /> steigt streng monoton, hat aber bei <Formel tex="x=0" /> die Ableitung 0. Dort liegt eine Sattelstelle.</>),
    opt('null', <><Formel tex="f'" /> hat in <Formel tex="[a;\,b]" /> mindestens eine Nullstelle.</>, false, <>Nein. Bei <Formel tex="f(x)=2x" /> ist <Formel tex="f'(x)=2" /> und es gibt nie eine Nullstelle, obwohl die Funktion überall streng monoton steigt.</>),
    opt('steigt', <><Formel tex="f'" /> ist selbst monoton steigend, das Schaubild <Formel tex="K_{f'}" /> steigt also auch.</>, false, <>Das ist eine häufige Verwechslung. Die Funktion <Formel tex="f(x)=\sqrt{x}" /> steigt auf <Formel tex="[1;\,4]" nach="," /> ihre Ableitung <Formel tex={t`f'(x)=\frac{1}{2\sqrt{x}}`} /> fällt dort aber. Steigt <Formel tex="K_f" nach="," /> dann liegt {KDF} über der x-Achse, es muss nicht selbst steigen.</>),
  ];
  return (
    <Auswahlfrage
      nummer="10"
      titel="Streng monoton steigend"
      optionen={platziere(optionen, 3)}
      erklaerung={
        <>
          <p>
            Steigt {KF} auf dem Intervall, sind alle Tangentensteigungen nicht negativ: <Formel tex={t`f'(x)\ge 0`} nach="." /> Einzelne Stellen mit <Formel tex="f'(x)=0" /> sind möglich, zum Beispiel bei einer aufsteigenden Sattelstelle. Dort bleibt {KF} streng monoton steigend.
          </p>
          <Paarbild daten={PAAR_MONOTONIE} unter={<>Bei <Formel tex="S" /> ist <Formel tex="f'(x)=0" nach="," /> {KF} steigt davor und danach.</>} />
        </>
      }
    >
      <p>
        {KF} ist auf dem Intervall <Formel tex="[a;\,b]" /> streng monoton steigend. Welche Aussage über <Formel tex="f'" /> ist auf dem Intervall sicher richtig?
      </p>
    </Auswahlfrage>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>Hilfen und Lösungsweg kannst du schrittweise aufdecken. Zuerst ordnest du Schaubilder zu, dann skizzierst du {KDF} selbst und liest Eigenschaften ab.</p>
      <Eingabehinweis />
      <Frage1 />
      <Abbildung24 />
      <Frage2 />
      <Frage3 />
      <Frage4 />
      <Aufgabe5 />
      <Aufgabe6 />
      <Aufgabe7 />
      <Aufgabe8 />
      <Frage9 />
      <Frage10 />
    </Abschnitt>
  );
}
