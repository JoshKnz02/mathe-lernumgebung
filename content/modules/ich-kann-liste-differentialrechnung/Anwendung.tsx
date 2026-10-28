import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { BILD_K30A, BILD_K30B, BILD_K31A, BILD_K31B, BILD_K33, BILD_K34 } from './Bilder';
import { Eingabehinweis } from './Eingabehinweis';
import { Kontrolle, Kontrollfrage, Punkt } from './Punkt';
import { K31, K33 } from './werte';

/** Bereich Funktionsterme und Optimierung: Aussagen 30 bis 35 und die Transferaussage. */
export function Anwendung() {
  return (
    <Abschnitt id="anwendung" titel="Funktionsterme und Optimierung">
      <p>Hier geht es um Bedingungen und Funktionsterme, um das Schema von Optimierungsaufgaben und um die Anwendung auf komplexere Aufgaben.</p>
      <Eingabehinweis />

      <Punkt id="bedingungen">
        <Kontrollfrage
          aussage="bedingungen"
          teil="a"
          nummer="K30a"
          titel="Tangente mit vorgegebener Steigung übersetzen"
          optionen={platziere(
            [
              opt('a', <><Formel tex="f(-3)=2" /> und <Formel tex="f'(-3)=4" nach="." /></>, true, <>Richtig.</>),
              opt('b', <><Formel tex="f(-3)=2" /> und <Formel tex="f''(-3)=4" nach="." /></>, false, <>Die zweite Ableitung gibt die Krümmung an. Die Steigung der Tangente ist die erste Ableitung, also <Formel tex="f'(-3)=4" nach="." /></>),
              opt('c', <><Formel tex="f(2)=-3" /> und <Formel tex="f'(2)=4" nach="." /></>, false, <>Hier sind <Formel tex="x" /> und <Formel tex="y" /> vertauscht. Der Punkt <Formel tex={t`P(-3\,|\,2)`} /> heißt: Stelle <Formel tex="x=-3" nach="," /> Funktionswert 2.</>),
              opt('d', <><Formel tex="f'(-3)=2" /> und <Formel tex="f(-3)=4" nach="." /></>, false, <>Die Zahlen 2 und 4 sind vertauscht. Die 2 ist die y-Koordinate des Punkts, die 4 die Steigung der Tangente.</>),
            ],
            0,
          )}
          erklaerung={
            <>
              <p>
                Der Punkt <Formel tex={t`P(-3\,|\,2)`} /> liegt auf dem Schaubild: <Formel tex="f(-3)=2" nach="." /> Die Tangente in <Formel tex="P" /> hat die Steigung 4, das ist die erste Ableitung an dieser Stelle: <Formel tex="f'(-3)=4" nach="." />
              </p>
              <Bild daten={BILD_K30A} unter={<>Eine Funktion mit diesen Eigenschaften, mit der Tangente (blau gestrichelt) im Punkt <Formel tex="P" nach="." /></>} />
            </>
          }
        >
          <p>
            <Formel tex="K" /> ist das Schaubild von <Formel tex="f" nach="." /> Es hat im Punkt <Formel tex={t`P(-3\,|\,2)`} /> eine Tangente mit der Steigung 4. Welche Bedingungen folgen daraus?
          </p>
        </Kontrollfrage>
        <Kontrollfrage
          aussage="bedingungen"
          teil="b"
          nummer="K30b"
          titel="Sattelpunkt übersetzen"
          optionen={platziere(
            [
              opt('a', <><Formel tex="f(3)=-4" nach="," /> <Formel tex="f'(3)=0" /> und <Formel tex="f''(3)=0" nach="." /></>, true, <>Richtig.</>),
              opt('b', <><Formel tex="f(3)=-4" /> und <Formel tex="f'(3)=0" nach="." /></>, false, <>Das beschreibt eine waagerechte Tangente im Punkt. Es kann auch ein Hoch- oder Tiefpunkt sein. Ein Sattelpunkt braucht zusätzlich <Formel tex="f''(3)=0" nach="." /></>),
              opt('c', <><Formel tex="f(3)=-4" /> und <Formel tex="f''(3)=0" nach="." /></>, false, <>Das beschreibt einen Wendepunkt. Beim Sattelpunkt ist die Tangente zusätzlich waagerecht, also <Formel tex="f'(3)=0" nach="." /></>),
              opt('d', <><Formel tex="f(-4)=3" nach="," /> <Formel tex="f'(-4)=0" /> und <Formel tex="f''(-4)=0" nach="." /></>, false, <><Formel tex="x" /> und <Formel tex="y" /> sind vertauscht. Der Punkt <Formel tex={t`S(3\,|\,-4)`} /> heißt: Stelle <Formel tex="x=3" nach="," /> Funktionswert <Formel tex="-4" nach="." /></>),
            ],
            2,
          )}
          erklaerung={
            <>
              <p>
                Ein Sattelpunkt ist ein Wendepunkt mit waagerechter Tangente. Das ergibt drei Bedingungen: <Formel tex="f(3)=-4" nach="," /> <Formel tex="f'(3)=0" /> und <Formel tex="f''(3)=0" nach="." />
              </p>
              <Bild daten={BILD_K30B} unter={<>Eine Funktion mit dem Sattelpunkt <Formel tex="S" /> und der waagerechten Tangente (blau gestrichelt).</>} />
            </>
          }
        >
          <p>
            <Formel tex={t`S(3\,|\,-4)`} /> ist ein Sattelpunkt von <Formel tex="K" nach="." /> Welche Bedingungen folgen daraus?
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="funktionsterm">
        <Kontrolle
          aussage="funktionsterm"
          nummer="K31"
          titel="Funktionsterm aus Bedingungen bestimmen"
          felder={[
            { id: 'a', name: 'Koeffizient von x hoch drei', beschriftung: <>Koeffizient von <Formel tex="x^3" /></>, erwartet: K31.a },
            { id: 'b', name: 'Koeffizient von x Quadrat', beschriftung: <>Koeffizient von <Formel tex="x^2" /></>, erwartet: K31.b },
            { id: 'c', name: 'Koeffizient von x', beschriftung: <>Koeffizient von <Formel tex="x" /></>, erwartet: K31.c },
            { id: 'ga', name: 'Parameter a der Exponentialfunktion', beschriftung: <><Formel tex="a" /> (zweite Funktion)</>, erwartet: K31.ga },
            { id: 'gb', name: 'Parameter b der Exponentialfunktion', beschriftung: <><Formel tex="b" /> (zweite Funktion)</>, erwartet: K31.gb },
          ]}
          hilfen={[
            <>Wähle einen geeigneten Ansatz. Mit einer Nullstelle im Ursprung und einem Tiefpunkt auf der x-Achse bietet sich die Produktform an (Modul <Modulverweis modul="funktionsterme-aufstellen">Aufstellen von Funktionstermen</Modulverweis>).</>,
            <>Bei einem Tiefpunkt auf der x-Achse ist die Nullstelle doppelt. Übersetze die übrigen Eigenschaften in Gleichungen für <Formel tex="a" /> und <Formel tex="b" nach="." /></>,
            <>Bei der zweiten Funktion liefert <Formel tex="f(0)=4" /> den Parameter <Formel tex="b" nach="." /> Die waagerechte Tangente bei <Formel tex="x=2" /> liefert <Formel tex="f'(2)=0" nach="." /> Klammere dort <Formel tex={t`e^{-x}`} /> aus.</>,
          ]}
          loesung={[
            <>
              Dritter Grad mit der einfachen Nullstelle 0 und dem Tiefpunkt <Formel tex={t`T(3\,|\,0)`} nach="," /> also doppelter Nullstelle 3: Ansatz <Formel tex={t`f(x)=a\,x\,(x-3)^2=a\,(x^3-6x^2+9x)`} nach="." /> Die Ableitung ist <Formel tex={t`f'(x)=a\,(3x^2-12x+9)`} nach="," /> also <Formel tex={t`f'(0)=9a=9`} /> und <Formel tex="a=1" nach="." /> Der Term ist <Formel tex={t`f(x)=x^3-6x^2+9x`} nach="." />
              <Bild daten={BILD_K31A} unter={<>Das Schaubild von <Formel tex="f" /> mit dem Ursprung <Formel tex="O" /> und dem Tiefpunkt <Formel tex="T" nach="." /> Die Tangente im Ursprung (blau gestrichelt) hat die Steigung 9.</>} />
            </>,
            <>
              Zweite Funktion: <Formel tex={t`g(x)=(ax+b)\,e^{-x}`} nach="." /> Aus <Formel tex="g(0)=4" /> folgt <Formel tex="b=4" nach="." /> Es ist <Formel tex={t`g'(x)=(a-ax-b)\,e^{-x}`} nach="," /> und <Formel tex="g'(2)=0" /> liefert <Formel tex={t`a-2a-b=0`} nach="," /> also <Formel tex="a=-b=-4" nach="." /> Der Term ist <Formel tex={t`g(x)=(-4x+4)\,e^{-x}`} nach="." />
              <Bild daten={BILD_K31B} unter={<>Das Schaubild von <Formel tex="g" /> mit dem Schnittpunkt <Formel tex="S" /> und dem Tiefpunkt <Formel tex="T" nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Bestimme die Funktionsterme. Eine ganzrationale Funktion dritten Grades schneidet die x-Achse im Ursprung mit der Steigung 9 und hat im Punkt <Formel tex={t`T(3\,|\,0)`} /> einen Tiefpunkt. Gib die Koeffizienten von <Formel tex={t`f(x)=ax^3+bx^2+cx`} /> an. Das Schaubild von <Formel tex={t`g(x)=(ax+b)\,e^{-x}`} /> schneidet die y-Achse bei 4 und hat bei <Formel tex="x=2" /> eine waagerechte Tangente. Gib <Formel tex="a" /> und <Formel tex="b" /> an.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K31A} unter={<>Das Schaubild der ganzrationalen Funktion.</>} />
          <Bild daten={BILD_K31B} unter={<>Das Schaubild der Funktion mit der Exponentialfunktion.</>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="optimierungsschema">
        <Kontrollfrage
          aussage="optimierungsschema"
          nummer="K32"
          titel="Schema einer Optimierungsaufgabe"
          optionen={platziere(
            [
              opt('a', <>Zielgröße bestimmen, Nebenbedingung aufstellen, Zielfunktion aufstellen, Definitionsbereich festlegen, lokale Extremwerte berechnen, mit den Randwerten vergleichen, Antwortsatz schreiben.</>, true, <>Richtig.</>),
              opt('b', <>Zielfunktion ableiten, Ableitung null setzen, Nebenbedingung aufstellen, Definitionsbereich festlegen, Antwortsatz schreiben.</>, false, <>Die Ableitung kann erst gebildet werden, wenn die Zielfunktion in nur einer Variablen steht. Dafür braucht es vorher die Zielgröße und die Nebenbedingung. Außerdem fehlt der Vergleich mit den Randwerten.</>),
              opt('c', <>Definitionsbereich festlegen, Zielgröße bestimmen, Extremwerte berechnen, Nebenbedingung aufstellen, Antwortsatz schreiben.</>, false, <>Der Definitionsbereich gehört zur Zielfunktion und kann erst festgelegt werden, wenn sie in einer Variablen aufgestellt ist. Die Nebenbedingung muss vor der Berechnung der Extremwerte kommen.</>),
              opt('d', <>Zielgröße bestimmen, Nebenbedingung aufstellen, Zielfunktion aufstellen, lokale Extremwerte berechnen, Antwortsatz schreiben.</>, false, <>Es fehlen der Definitionsbereich und der Vergleich mit den Randwerten. Ohne sie weißt du nicht, ob das lokale Extremum auch das globale ist.</>),
            ],
            3,
          )}
          erklaerung={
            <>
              Das Schema gliedert sich in sieben Schritte: Die Zielgröße hängt oft von mehreren Größen ab. Mit der Nebenbedingung stellst du sie durch nur eine Größe dar und erhältst die Zielfunktion. Für diese legst du den Definitionsbereich fest. Dann bestimmst du die lokalen Extremwerte und vergleichst sie mit den Randwerten, denn nur so findest du das globale Extremum. Am Ende steht ein Antwortsatz mit Einheit (Modul <Modulverweis modul="optimierung">Optimierung</Modulverweis>).
            </>
          }
        >
          <p>
            Welche Reihenfolge beschreibt das Vorgehen beim Optimieren richtig?
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="zielfunktion">
        <Kontrolle
          aussage="zielfunktion"
          nummer="K33"
          titel="Zielfunktion aufstellen"
          felder={[
            { id: 'h', name: 'Höhe des Kartons für a gleich 4 in Dezimeter', beschriftung: <>Höhe für <Formel tex="a=4" /></>, erwartet: K33.h4 },
            { id: 'O', name: 'Materialverbrauch für a gleich 2 in Quadratdezimeter', beschriftung: <><Formel tex="O(2)" /></>, erwartet: K33.O2 },
            { id: 'k', name: 'Zahl k in der Zielfunktion O gleich a Quadrat plus k durch a', beschriftung: <>Zahl <Formel tex="k" /> in <Formel tex={t`O(a)=a^2+\frac{k}{a}`} /></>, erwartet: K33.k },
          ]}
          hilfen={[
            <>Die Zielgröße ist der Materialverbrauch, also die Oberfläche des Kartons ohne Deckel: Grundfläche plus vier Seitenflächen. Sie hängt von <Formel tex="a" /> und <Formel tex="h" /> ab.</>,
            <>Die Nebenbedingung ist das Volumen <Formel tex={t`a^2\cdot h=32`} nach="." /> Löse sie nach <Formel tex="h" /> auf und setze in die Oberfläche ein (Modul <Modulverweis modul="optimierung">Optimierung</Modulverweis>).</>,
          ]}
          loesung={[
            <>
              Zielgröße: <Formel tex={t`O=a^2+4ah`} /> (Grundfläche und vier Seitenflächen, der Karton hat keinen Deckel). Nebenbedingung: <Formel tex={t`a^2h=32`} /> liefert <Formel tex={t`h=\frac{32}{a^2}`} nach="." /> Für <Formel tex="a=4" /> ist <Formel tex={t`h=\frac{32}{16}=2`} nach="." />
            </>,
            <>
              Zielfunktion: <Formel tex={t`O(a)=a^2+4a\cdot\frac{32}{a^2}=a^2+\frac{128}{a}`} nach="," /> also <Formel tex="k=128" nach="." /> Es ist <Formel tex={t`O(2)=4+64=68`} nach="." />
            </>,
          ]}
        >
          <p>
            Ein oben offener Karton mit quadratischer Grundfläche (Seitenlänge <Formel tex="a" /> in dm, Höhe <Formel tex="h" /> in dm) soll ein Volumen von 32 dm³ haben. Der Materialverbrauch soll möglichst gering sein. Beschreibe die Zielgröße in Abhängigkeit von <Formel tex="a" /> allein. Gib die Höhe für <Formel tex="a=4" nach="," /> den Materialverbrauch für <Formel tex="a=2" /> und die Zahl <Formel tex="k" /> in der Zielfunktion an.
          </p>
        </Kontrolle>
      </Punkt>

      <Punkt id="definitionsbereich">
        <Kontrollfrage
          aussage="definitionsbereich"
          nummer="K34"
          titel="Definitionsbereich der Zielfunktion"
          optionen={platziere(
            [
              opt('a', <><Formel tex={t`D=]0;\,10[`} /></>, true, <>Richtig.</>),
              opt('b', <><Formel tex={t`D=[0;\,10]`} /></>, false, <>Für <Formel tex="x=0" /> und <Formel tex="x=10" /> entsteht kein Rechteck mehr, die Fläche wäre 0. Die Randwerte gehören nicht zu einer möglichen Figur, der Rand ist offen.</>),
              opt('c', <><Formel tex={t`D=\mathbb{R}`} /></>, false, <>Der Term <Formel tex={t`x(10-x)`} /> lässt sich für alle <Formel tex="x" /> berechnen. Der Definitionsbereich kommt aber aus der Aufgabe, nicht aus dem Term: Seitenlängen müssen positiv sein.</>),
              opt('d', <><Formel tex={t`D=]0;\,5[`} /></>, false, <>Die Seite <Formel tex="x" /> kann auch größer als 5 sein, dann ist die andere Seite <Formel tex="10-x" /> kleiner. Möglich ist alles, solange beide Seiten positiv sind, also <Formel tex={t`0<x<10`} nach="." /></>),
            ],
            1,
          )}
          erklaerung={
            <>
              <p>
                Der Umfang ist 20, also ist die andere Seite <Formel tex="10-x" nach="." /> Beide Seiten müssen positiv sein: <Formel tex="x>0" /> und <Formel tex="10-x>0" nach="." /> Die Randwerte gehören nicht dazu, denn dort gibt es kein Rechteck. Der Rand ist offen (Modul <Modulverweis modul="optimierung">Optimierung</Modulverweis>).
              </p>
              <Bild daten={BILD_K34} unter={<>Die Zielfunktion <Formel tex="A" /> auf <Formel tex="]0;\,10[" /> mit offenen Randpunkten und dem Hochpunkt <Formel tex="H" nach="." /></>} />
            </>
          }
        >
          <p>
            Ein Rechteck hat den Umfang 20. Eine Seite ist <Formel tex="x" /> lang. Die Fläche <Formel tex={t`A(x)=x\,(10-x)`} /> soll maximal werden. Wie ist der Definitionsbereich der Zielfunktion zu wählen?
          </p>
        </Kontrollfrage>
      </Punkt>

      <Punkt id="globales-extremum">
        <Kontrolle
          aussage="globales-extremum"
          nummer="K35"
          titel="Globales Extremum der Zielfunktion"
          felder={[
            { id: 'a', name: 'Seitenlänge a mit dem kleinsten Materialverbrauch in Dezimeter', beschriftung: <><Formel tex="a" /> in dm</>, erwartet: K33.aOpt },
            { id: 'h', name: 'zugehörige Höhe in Dezimeter', beschriftung: <><Formel tex="h" /> in dm</>, erwartet: K33.hOpt },
            { id: 'O', name: 'kleinster Materialverbrauch in Quadratdezimeter', beschriftung: <>kleinster Materialverbrauch</>, erwartet: K33.OOpt },
          ]}
          hilfen={[
            <>Bilde die Ableitung der Zielfunktion <Formel tex={t`O(a)=a^2+\frac{128}{a}`} /> und setze sie null. Prüfe, ob es ein Minimum ist.</>,
            <>Der Definitionsbereich ist <Formel tex={t`]0;\,\infty[`} nach="." /> Untersuche das Verhalten am Rand mit Grenzwerten, bevor du dich für das globale Minimum entscheidest (Modul <Modulverweis modul="optimierung">Optimierung</Modulverweis>).</>,
          ]}
          loesung={[
            <>
              <Formel tex={t`O'(a)=2a-\frac{128}{a^2}=0`} /> liefert <Formel tex={t`a^3=64`} nach="," /> also <Formel tex="a=4" nach="." /> Es ist <Formel tex={t`O''(a)=2+\frac{256}{a^3}`} nach="," /> also <Formel tex={t`O''(4)=6>0`} nach="," /> ein lokales Minimum.
            </>,
            <>
              Randverhalten: Für <Formel tex={t`a\to 0^+`} /> geht <Formel tex={t`\frac{128}{a}`} /> gegen <Formel tex={t`\infty`} nach="," /> für <Formel tex={t`a\to\infty`} /> geht <Formel tex="a^2" /> gegen <Formel tex={t`\infty`} nach="." /> An beiden Rändern wächst <Formel tex="O" /> über alle Grenzen. Das lokale Minimum ist deshalb das globale Minimum.
            </>,
            <>
              <Formel tex={t`O(4)=16+\frac{128}{4}=48`} /> und <Formel tex={t`h=\frac{32}{16}=2`} nach="." /> Antwortsatz: Der Karton braucht am wenigsten Material, nämlich 48 dm², wenn die quadratische Grundfläche 4 dm lang und breit ist und der Karton 2 dm hoch ist.
              <Bild daten={BILD_K33} unter={<>Die Zielfunktion <Formel tex="O" /> mit dem Tiefpunkt <Formel tex="T" nach="." /></>} />
            </>,
          ]}
        >
          <p>
            Für den Karton aus K33 gilt <Formel tex={t`O(a)=a^2+\frac{128}{a}`} /> für <Formel tex="a>0" nach="." /> Bestimme die Abmessungen, bei denen der Materialverbrauch minimal ist, und den kleinsten Materialverbrauch. Vergleiche dazu mit dem Verhalten am Rand.
          </p>
        </Kontrolle>
        <Kontrollschaubild>
          <Bild daten={BILD_K33} unter={<>Die Zielfunktion <Formel tex="O" nach="." /></>} />
        </Kontrollschaubild>
      </Punkt>

      <Punkt id="transfer" />
      <p>
        Für die letzte Aussage gibt es keine Kontrollaufgabe. Wenn du die Aussagen oben beherrschst, zeigen dir die Übungsaufgaben im Abiturstil, ob du sie auch in neuen, mehrteiligen Aufgaben mit Anwendungsbezug einsetzen kannst.
      </p>
    </Abschnitt>
  );
}
