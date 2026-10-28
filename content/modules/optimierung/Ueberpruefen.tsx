import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild, Kontrollschaubild } from '@/components/Messbild';
import { opt, platziere, t } from '@/lib/modulhilfen';
import {
  BILD_ABSTAND_LOESUNG,
  BILD_ABSTAND_SKIZZE,
  BILD_ABSTAND_ZIEL,
  BILD_BLATT20,
  BILD_DREIECK_LOESUNG,
  BILD_DREIECK_SKIZZE,
  BILD_DREIECK_ZIEL,
  BILD_EINTRITT,
  BILD_FEHLER,
  BILD_GLAS_LOESUNG,
  BILD_GLAS_SKIZZE,
  BILD_GLAS_ZIEL,
  BILD_KABEL_LOESUNG,
  BILD_KABEL_SKIZZE,
  BILD_KABEL_ZIEL,
  BILD_KEGEL,
  BILD_KISTE,
  BILD_PARABEL_A,
  BILD_PARABEL_FLAECHE,
  BILD_PARABEL_SKIZZE,
  BILD_PARABEL_U,
  BILD_PARABEL_UMFANG,
  BILD_PUNKT_LOESUNG,
  BILD_PUNKT_SKIZZE,
  BILD_PUNKT_ZIEL,
  BILD_RANDRECHTECK_LOESUNG,
  BILD_RANDRECHTECK_SKIZZE,
  BILD_RANDRECHTECK_ZIEL,
  BILD_UMFANG,
  BILD_WURF,
  BILD_ZYLINDER,
  BILD_ZYLINDER_VOLUMEN,
} from './Bilder';
import { ABSTAND, DREIECK, EINTRITT, GLAS, KABEL, KEGEL, KISTE, PARABEL, PUNKTABSTAND, RANDRECHTECK, WURF } from './daten';

function Eingabehinweis() {
  return (
    <Hinweis titel="Eingabe">
      Gib Zahlen als ganze Zahl, als Dezimalzahl mit Komma oder als Bruch ein, zum Beispiel <code>2</code>, <code>-1,5</code> oder <code>250/3</code>, ohne Einheit. Wo die Aufgabe es verlangt, rundest du auf die genannte Zahl von Nachkommastellen. Bei den Auswahlfragen wählst du genau eine Antwort aus.
    </Hinweis>
  );
}

/** Frage 1: richtige Zielfunktion zu Umfang 40. */
function Frage1() {
  const optionen = [
    opt('richtig', <><Formel tex={t`A(a)=a\cdot(20-a)`} nach="," /> mit <Formel tex={t`D=]0;\,20[`} nach="." /></>, true, <>Richtig.</>),
    opt(
      'vierzig',
      <><Formel tex={t`A(a)=a\cdot(40-a)`} nach="," /> mit <Formel tex={t`D=]0;\,40[`} nach="." /></>,
      false,
      <>Der Umfang ist <Formel tex="2a+2b=40" nach="," /> nicht <Formel tex="a+b=40" nach="." /> Daraus folgt <Formel tex="a+b=20" /> und <Formel tex="b=20-a" nach="." /></>,
    ),
    opt(
      'mal-vierzig',
      <><Formel tex={t`A(a)=a\cdot 40`} nach="," /> mit <Formel tex={t`D=]0;\,\infty[`} nach="." /></>,
      false,
      <>Die Zahl 40 ist der Umfang, nicht die zweite Seite. Die Seite <Formel tex="b" /> ergibt sich aus der Nebenbedingung <Formel tex="2a+2b=40" nach="." /></>,
    ),
    opt(
      'umfang',
      <><Formel tex={t`A(a)=2a+2(20-a)`} nach=":" /> Das ergibt für jedes <Formel tex="a" /> dasselbe.</>,
      false,
      <>Das ist der Umfang und kein Flächeninhalt. Der Umfang ist festgelegt, er gehört zur Nebenbedingung. Die Zielgröße ist der Flächeninhalt <Formel tex={t`A=a\cdot b`} nach="." /></>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="1"
      titel="Zielfunktion aufstellen"
      optionen={platziere(optionen, 2)}
      erklaerung={
        <>
          <p>
            Zielgröße ist der Flächeninhalt <Formel tex={t`A=a\cdot b`} nach="." /> Die Nebenbedingung <Formel tex="2a+2b=40" /> liefert <Formel tex="b=20-a" nach="." /> Einsetzen ergibt <Formel tex={t`A(a)=a\cdot(20-a)`} nach="." /> Beide Seiten sind positiv, also <Formel tex="a>0" /> und <Formel tex="20-a>0" nach="." /> Der Definitionsbereich ist <Formel tex={t`]0;\,20[`} nach="." />
          </p>
          <Bild daten={BILD_UMFANG} unter={<>Die Zielfunktion <Formel tex="A" nach="." /> Der größte Flächeninhalt liegt bei <Formel tex="a=10" nach="," /> das Rechteck ist dann ein Quadrat.</>} />
        </>
      }
    >
      <p>
        Ein Rechteck mit den Seitenlängen <Formel tex="a" /> und <Formel tex="b" /> hat den Umfang 40. Sein Flächeninhalt soll möglichst groß werden. Welche Zielfunktion und welcher Definitionsbereich sind richtig?
      </p>
    </Auswahlfrage>
  );
}

/** Frage 2: Definitionsbereich der Schachtel aus einem Blatt 20 × 12. */
function Frage2() {
  const optionen = [
    opt('richtig', <><Formel tex={t`D=]0;\,6[`} /></>, true, <>Richtig.</>),
    opt(
      'zehn',
      <><Formel tex={t`D=]0;\,10[`} /></>,
      false,
      <>Für die Länge gilt <Formel tex="20-2x>0" nach="," /> also <Formel tex="x<10" nach="." /> Die Breite ist aber nur 12 cm, aus <Formel tex="12-2x>0" /> folgt <Formel tex="x<6" nach="." /> Die kürzere Seite entscheidet.</>,
    ),
    opt(
      'abgeschlossen',
      <><Formel tex={t`D=[0;\,6]`} /></>,
      false,
      <>Für <Formel tex="x=0" /> wird nichts ausgeschnitten und die Höhe ist 0, für <Formel tex="x=6" /> wird die Breite 0. In beiden Fällen entsteht keine Schachtel, die Randwerte gehören nicht zum Definitionsbereich.</>,
    ),
    opt(
      'zwoelf',
      <><Formel tex={t`D=]0;\,12[`} /></>,
      false,
      <>Ab <Formel tex="x=6" /> wäre die Breite <Formel tex="12-2x" /> null oder negativ. Eine Schachtel gibt es nur für <Formel tex="x<6" nach="." /></>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="2"
      titel="Definitionsbereich bestimmen"
      optionen={platziere(optionen, 0)}
      erklaerung={
        <>
          <p>
            Alle Maße müssen positiv sein: Höhe <Formel tex="x>0" nach="," /> Länge <Formel tex="20-2x>0" /> und Breite <Formel tex="12-2x>0" nach="." /> Die dritte Bedingung ist die strengste: <Formel tex="x<6" nach="." /> Die Randwerte <Formel tex="x=0" /> und <Formel tex="x=6" /> ergeben keine Schachtel.
          </p>
          <Bild daten={BILD_BLATT20} unter={<>Das Schaubild von <Formel tex={t`V(x)=x(20-2x)(12-2x)`} /> für <Formel tex="0<x<6" nach="." /> Die Randpunkte <Formel tex="R" /> sind offen.</>} />
        </>
      }
    >
      <p>
        Aus einem Blatt (20 cm lang, 12 cm breit) werden an allen Ecken Quadrate der Seitenlänge <Formel tex="x" /> ausgeschnitten, die Seiten werden hochgeklappt. Welcher Definitionsbereich ist für das Volumen <Formel tex="V(x)" /> sinnvoll?
      </p>
    </Auswahlfrage>
  );
}

/** Aufgabe 3: offene Kiste. */
function Aufgabe3() {
  return (
    <Aufgabe
      nummer="3"
      titel="Offene Kiste mit kleinster Oberfläche"
      felder={[
        { id: 'x', name: 'Kantenlänge x des Bodens in dm', beschriftung: <>Kantenlänge <Formel tex="x" /></>, erwartet: KISTE.x },
        { id: 'h', name: 'Höhe h in dm', beschriftung: <>Höhe <Formel tex="h" /></>, erwartet: KISTE.h },
        { id: 'o', name: 'kleinste Oberfläche in Quadratdezimetern', beschriftung: <>kleinste Oberfläche</>, erwartet: KISTE.o },
      ]}
      hilfen={[
        <>Die Zielgröße ist die Oberfläche. Die Kiste hat keinen Deckel: Sie besteht aus dem Boden <Formel tex="x^2" /> und vier Seitenflächen <Formel tex={t`x\cdot h`} nach="." /> Die Nebenbedingung ist das Volumen <Formel tex={t`x^2\cdot h=108`} nach="." /></>,
        <>Löse die Nebenbedingung nach <Formel tex="h" /> auf und setze in die Oberfläche ein. Du erhältst <Formel tex={t`O(x)=x^2+\dfrac{432}{x}`} nach="." /> Es ist <Formel tex="x>0" nach="." /></>,
        <>Es ist <Formel tex={t`O'(x)=2x-\dfrac{432}{x^2}`} nach="." /> Aus <Formel tex="O'(x)=0" /> folgt <Formel tex="x^3=216" nach="." /></>,
      ]}
      loesung={[
        <>Zielgröße: <Formel tex={t`O=x^2+4xh`} nach="." /> Nebenbedingung: <Formel tex={t`V=x^2h=108`} nach="," /> also <Formel tex={t`h=\dfrac{108}{x^2}`} nach="." /></>,
        <>Zielfunktion: <Formel tex={t`O(x)=x^2+4x\cdot\dfrac{108}{x^2}=x^2+\dfrac{432}{x}`} nach="," /> Definitionsbereich <Formel tex={t`D=]0;\,\infty[`} nach="." /></>,
        <>Ableitung: <Formel tex={t`O'(x)=2x-\dfrac{432}{x^2}=0`} /> liefert <Formel tex="2x^3=432" nach="," /> also <Formel tex="x^3=216" /> und <Formel tex="x=6" nach="." /></>,
        <>Nachweis: <Formel tex={t`O''(x)=2+\dfrac{864}{x^3}`} /> ist für <Formel tex="x>0" /> positiv, also liegt bei <Formel tex="x=6" /> ein Tiefpunkt vor. Für <Formel tex={String.raw`x\to 0`} /> und für <Formel tex={String.raw`x\to\infty`} /> wächst <Formel tex="O" /> über alle Grenzen. Der Tiefpunkt ist deshalb der kleinste Wert im ganzen Definitionsbereich.</>,
        <>
          Ergebnis: <Formel tex={t`h=\dfrac{108}{36}=3`} /> und <Formel tex={t`O(6)=36+72=108`} nach="." /> Die Kiste hat den Boden 6 dm mal 6 dm und die Höhe 3 dm, die Oberfläche ist 108 dm².
          <Bild daten={BILD_KISTE} unter={<>Die Zielfunktion <Formel tex="O" /> mit dem Tiefpunkt <Formel tex="T" /> bei <Formel tex="x=6" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Eine Kiste ohne Deckel hat einen quadratischen Boden mit der Kantenlänge <Formel tex="x" /> und die Höhe <Formel tex="h" nach="." /> Sie soll 108 dm³ fassen und möglichst wenig Material brauchen. Bestimme <Formel tex="x" nach="," /> <Formel tex="h" /> und die kleinste Oberfläche in dm².
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_KISTE} unter={<>Die Zielfunktion <Formel tex="O" /> mit dem Tiefpunkt <Formel tex="T" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 4: Glasplatte mit abgebrochener Ecke. */
function Aufgabe4() {
  return (
    <Aufgabe
      nummer="4"
      titel="Glasplatte mit abgebrochener Ecke"
      felder={[
        { id: 'u', name: 'Breite u des Rechtecks in cm, auf zwei Nachkommastellen', beschriftung: <>Breite <Formel tex="u" /></>, erwartet: GLAS.u, toleranz: 0.01 },
        { id: 'h', name: 'Höhe des Rechtecks in cm', beschriftung: <>Höhe</>, erwartet: GLAS.h, toleranz: 0.01 },
        { id: 'a', name: 'größter Flächeninhalt in Quadratzentimetern, auf zwei Nachkommastellen', beschriftung: <>größter Flächeninhalt</>, erwartet: GLAS.a, toleranz: 0.01 },
      ]}
      hilfen={[
        <>Bestimme die Gleichung der Bruchkante: Sie ist eine Gerade durch <Formel tex={t`(60\,|\,80)`} /> und <Formel tex={t`(100\,|\,50)`} nach="." /> Die Steigung ist <Formel tex={t`\dfrac{50-80}{100-60}=-0{,}75`} nach="." /></>,
        <>Die Bruchkante ist <Formel tex={t`y=125-0{,}75u`} nach="." /> Das Rechteck hat die Breite <Formel tex="u" /> und die Höhe <Formel tex={t`125-0{,}75u`} nach="," /> es ist <Formel tex={t`60\le u\le 100`} nach="." /></>,
        <>Die Zielfunktion ist <Formel tex={t`A(u)=u\cdot(125-0{,}75u)`} nach="." /> Berechne <Formel tex="A'" nach="," /> setze null und vergleiche mit <Formel tex="A(60)" /> und <Formel tex="A(100)" nach="." /></>,
      ]}
      loesung={[
        <>Nebenbedingung: Die Ecke <Formel tex="P" /> liegt auf der Bruchkante <Formel tex={t`y=125-0{,}75u`} nach="." /> Die Gerade geht durch <Formel tex={t`(60\,|\,80)`} nach="," /> denn <Formel tex={t`125-0{,}75\cdot 60=80`} nach="." /></>,
        <>Zielfunktion: <Formel tex={t`A(u)=u\,(125-0{,}75u)=125u-0{,}75u^2`} /> mit <Formel tex={t`D=[60;\,100]`} nach="." /> Ist <Formel tex="u<60" nach="," /> kann das Rechteck höchstens 80 cm hoch sein, bei <Formel tex="u=60" /> beginnt die Bruchkante.</>,
        <>Ableitung: <Formel tex={t`A'(u)=125-1{,}5u=0`} /> liefert <Formel tex={t`u=\dfrac{250}{3}\approx 83{,}33`} nach="." /> Wegen <Formel tex="A''(u)=-1{,}5<0" /> ist es ein Hochpunkt. Die Stelle liegt im Definitionsbereich.</>,
        <>Randwerte: <Formel tex={t`A(60)=60\cdot 80=4800`} /> und <Formel tex={t`A(100)=100\cdot 50=5000`} nach="." /> Beide sind kleiner als <Formel tex={t`A\!\left(\tfrac{250}{3}\right)\approx 5208{,}33`} nach="." /></>,
        <>
          Ergebnis: Das Rechteck ist etwa 83,33 cm breit und <Formel tex={t`125-0{,}75\cdot\tfrac{250}{3}=62{,}5`} /> cm hoch. Der Flächeninhalt ist etwa 5208,33 cm².
          <Bild daten={BILD_GLAS_LOESUNG} unter={<>Das größte Rechteck. Die Ecke <Formel tex="P" /> liegt auf der Bruchkante.</>} />
        </>,
      ]}
    >
      <p>
        Eine Glasplatte ist 100 cm breit und 80 cm hoch. Die obere rechte Ecke ist abgebrochen: Die Bruchkante verläuft geradlinig von <Formel tex={t`(60\,|\,80)`} /> nach <Formel tex={t`(100\,|\,50)`} nach="." /> Aus der Platte soll ein möglichst großes Rechteck geschnitten werden. Eine Ecke liegt im Ursprung, die gegenüberliegende Ecke <Formel tex="P" /> auf der Bruchkante. Bestimme die Breite <Formel tex="u" /> und die Höhe des Rechtecks sowie den größten Flächeninhalt. Runde auf zwei Nachkommastellen.
      </p>
      <Bild daten={BILD_GLAS_SKIZZE} unter={<>Die Platte mit der Bruchkante (schwarz gestrichelt) und einem Beispielrechteck.</>} />
      <Kontrollschaubild>
        <Bild daten={BILD_GLAS_ZIEL} unter={<>Die Zielfunktion <Formel tex="A" /> mit dem Hochpunkt <Formel tex="H" /> und den Randpunkten <Formel tex="R" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 5: Rechteck unter K_f mit f(x) = 12 − x², Fläche und Umfang. */
function Aufgabe5() {
  return (
    <Aufgabe
      nummer="5"
      titel="Rechteck unter einer Parabel"
      felder={[
        { id: 'ua', name: 'Stelle u für den größten Flächeninhalt', beschriftung: <>größter Flächeninhalt bei <Formel tex="u" /></>, erwartet: PARABEL.uFlaeche },
        { id: 'am', name: 'größter Flächeninhalt', beschriftung: <>größter Flächeninhalt</>, erwartet: PARABEL.aMax },
        { id: 'uu', name: 'Stelle u für den größten Umfang', beschriftung: <>größter Umfang bei <Formel tex="u" /></>, erwartet: PARABEL.uUmfang },
        { id: 'um', name: 'größter Umfang', beschriftung: <>größter Umfang</>, erwartet: PARABEL.uMax },
      ]}
      hilfen={[
        <>Das Rechteck ist <Formel tex="2u" /> breit und <Formel tex="f(u)=12-u^2" /> hoch. Flächeninhalt: <Formel tex={t`A=2u\cdot(12-u^2)`} nach="." /> Umfang: <Formel tex={t`U=2\cdot(2u+12-u^2)`} nach="." /></>,
        <>Der Definitionsbereich ist <Formel tex={t`]0;\,\sqrt{12}[`} nach="," /> weil die Höhe positiv sein muss. Multipliziere die Klammern aus, bevor du ableitest.</>,
        <>Es ist <Formel tex={t`A'(u)=24-6u^2`} /> und <Formel tex={t`U'(u)=4-4u`} nach="." /> Es entstehen zwei verschiedene Stellen, die Rechtecke sind nicht dieselben.</>,
      ]}
      loesung={[
        <>Zielfunktionen: <Formel tex={t`A(u)=2u(12-u^2)=24u-2u^3`} /> und <Formel tex={t`U(u)=4u+24-2u^2`} nach="." /> Definitionsbereich <Formel tex={t`D=]0;\,\sqrt{12}[`} nach="," /> es ist <Formel tex={t`\sqrt{12}\approx 3{,}46`} nach="." /></>,
        <>Flächeninhalt: <Formel tex={t`A'(u)=24-6u^2=0`} /> liefert <Formel tex="u=2" /> (die Lösung <Formel tex="u=-2" /> liegt nicht im Definitionsbereich). <Formel tex="A''(u)=-12u" /> ist bei <Formel tex="u=2" /> negativ, also ein Hochpunkt mit <Formel tex={t`A(2)=2\cdot 2\cdot 8=32`} nach="." /></>,
        <>Umfang: <Formel tex={t`U'(u)=4-4u=0`} /> liefert <Formel tex="u=1" nach="." /> Wegen <Formel tex="U''(u)=-4<0" /> ist es ein Hochpunkt mit <Formel tex={t`U(1)=4+24-2=26`} nach="." /></>,
        <>Randwerte: Für <Formel tex={String.raw`u\to 0`} /> geht <Formel tex="A" /> gegen 0 und <Formel tex="U" /> gegen 24, für <Formel tex={String.raw`u\to\sqrt{12}`} /> geht <Formel tex="A" /> gegen 0 und <Formel tex="U" /> gegen etwa 13,86. Alle Randwerte sind kleiner als die Hochpunkte.</>,
        <>
          Ergebnis: Der Flächeninhalt ist bei <Formel tex="u=2" /> mit 32 FE am größten, der Umfang bei <Formel tex="u=1" /> mit 26 LE. Das sind zwei verschiedene Rechtecke.
          <div className="bilder-paar">
            <Bild daten={BILD_PARABEL_A} unter={<>Größter Flächeninhalt: <Formel tex="u=2" nach="." /></>} />
            <Bild daten={BILD_PARABEL_U} unter={<>Größter Umfang: <Formel tex="u=1" nach="." /></>} />
          </div>
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=12-x^2`} nach="." /> Die Punkte <Formel tex={t`A(-u\,|\,0)`} nach="," /> <Formel tex={t`B(u\,|\,0)`} nach="," /> <Formel tex={t`C(u\,|\,f(u))`} /> und <Formel tex={t`D(-u\,|\,f(u))`} /> mit <Formel tex="u>0" /> bilden ein Rechteck. Für welches <Formel tex="u" /> wird der Flächeninhalt am größten, für welches der Umfang? Gib die Werte an.
      </p>
      <Bild daten={BILD_PARABEL_SKIZZE} unter={<>Das Schaubild von <Formel tex="f" /> mit einem Beispielrechteck.</>} />
      <Kontrollschaubild>
        <div className="bilder-paar">
          <Bild daten={BILD_PARABEL_FLAECHE} unter={<>Die Zielfunktion <Formel tex="A" nach="." /></>} />
          <Bild daten={BILD_PARABEL_UMFANG} unter={<>Die Zielfunktion <Formel tex="U" nach="." /></>} />
        </div>
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Frage 6: Fehlersuche, der Randwert wurde nicht verglichen. */
function Frage6() {
  const optionen = [
    opt('richtig', <>Der Vergleich mit den Randwerten fehlt: <Formel tex="Z(4)=18" /> ist größer als <Formel tex="Z(0)=2" nach="." /> Der größte Wert liegt am Rand bei <Formel tex="x=4" nach="." /></>, true, <>Richtig.</>),
    opt(
      'tief',
      <>Es muss der Tiefpunkt <Formel tex="x=2" /> verwendet werden, denn der größte Wert liegt beim zweiten Kandidaten.</>,
      false,
      <>Bei <Formel tex="x=2" /> ist <Formel tex="Z''(2)=6>0" nach="," /> dort liegt ein Tiefpunkt mit <Formel tex="Z(2)=-2" nach="." /> Das ist der kleinste lokale Wert, nicht der größte.</>,
    ),
    opt(
      'zweite',
      <>Die zweite Ableitung hätte nicht verwendet werden dürfen, es genügt <Formel tex="Z'(x)=0" nach="." /></>,
      false,
      <>Die zweite Ableitung ist richtig eingesetzt: <Formel tex="Z''(0)=-6<0" /> zeigt, dass bei <Formel tex="x=0" /> ein Hochpunkt liegt. Der Fehler liegt woanders: Auch mit richtiger Klassifizierung ist ein Hochpunkt nur ein lokaler Hochpunkt.</>,
    ),
    opt(
      'immer',
      <>Nichts ist falsch: Ein Hochpunkt ist immer der größte Wert der Funktion.</>,
      false,
      <>Ein Hochpunkt ist nur höher als seine Umgebung. Auf einem Intervall kann ein Randwert größer sein, hier <Formel tex="Z(4)=18" nach="." /></>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="6"
      titel="Fehler in der Lösung finden"
      optionen={platziere(optionen, 3)}
      erklaerung={
        <>
          <p>
            Zu einer vollständigen Lösung gehört Schritt 5 der Strategie: Alle Stellen mit <Formel tex="Z'=0" /> und alle Randwerte nebeneinanderstellen. Hier sind das <Formel tex="Z(-1)=-2" nach="," /> <Formel tex="Z(0)=2" nach="," /> <Formel tex="Z(2)=-2" /> und <Formel tex="Z(4)=18" nach="." /> Der größte Wert ist <Formel tex="Z(4)=18" nach="," /> er liegt am Rand. Dort ist <Formel tex="Z'(4)=24" nach="," /> nicht null.
          </p>
          <Bild daten={BILD_FEHLER} unter={<>Der Hochpunkt <Formel tex="H" /> bei <Formel tex="x=0" /> ist nur lokal, der Randpunkt <Formel tex="R" /> bei <Formel tex="x=4" /> liegt am höchsten.</>} />
        </>
      }
    >
      <p>
        Die Zielfunktion <Formel tex={t`Z(x)=x^3-3x^2+2`} /> ist auf <Formel tex={t`[-1;\,4]`} /> definiert, der größte Wert wird gesucht. Eine Schülerin rechnet: <Formel tex={t`Z'(x)=3x^2-6x=3x(x-2)=0`} /> liefert <Formel tex="x=0" /> und <Formel tex="x=2" nach="." /> Wegen <Formel tex={t`Z''(x)=6x-6`} /> ist <Formel tex="Z''(0)=-6<0" nach="," /> also ein Hochpunkt mit <Formel tex="Z(0)=2" nach="." /> Antwort: „Der größte Wert ist 2 bei <Formel tex="x=0" nach="." />“ Was ist falsch?
      </p>
    </Auswahlfrage>
  );
}

/** Aufgabe 7: Dreieck unter K_f, exakt. */
function Aufgabe7() {
  return (
    <Aufgabe
      nummer="7"
      titel="Dreieck unter einem Schaubild"
      felder={[
        { id: 'u', name: 'Stelle u des größten Flächeninhalts', beschriftung: <>Stelle <Formel tex="u" /></>, erwartet: DREIECK.u },
        { id: 'a', name: 'größter Flächeninhalt auf drei Nachkommastellen', beschriftung: <>größter Flächeninhalt</>, erwartet: DREIECK.a, toleranz: 0.001 },
      ]}
      hilfen={[
        <>Das Dreieck hat die Grundseite <Formel tex="OQ" /> der Länge <Formel tex="u" /> und die Höhe <Formel tex="f(u)" nach="." /> Sein Flächeninhalt ist <Formel tex={t`A(u)=\tfrac12\,u\,f(u)`} nach="." /></>,
        <>Setze <Formel tex={t`f(u)=u^3-6u^2+9u`} /> ein und multipliziere aus: <Formel tex={t`A(u)=\tfrac12u^4-3u^3+\tfrac92u^2`} nach="." /></>,
        <>Es ist <Formel tex={t`A'(u)=2u^3-9u^2+9u=u(2u^2-9u+9)`} nach="." /> Die Klammer ist null für <Formel tex={t`u=\tfrac32`} /> und <Formel tex="u=3" nach="." /></>,
      ]}
      loesung={[
        <>Zielfunktion: <Formel tex={t`A(u)=\tfrac12u\cdot f(u)=\tfrac12u^4-3u^3+\tfrac92u^2`} /> mit <Formel tex={t`D=[0;\,3]`} nach="," /> denn <Formel tex="f" /> ist nur für <Formel tex={t`0\le u\le 3`} /> nicht negativ.</>,
        <>Ableitung: <Formel tex={t`A'(u)=2u^3-9u^2+9u=u(2u-3)(u-3)`} nach="." /> Nullstellen sind <Formel tex="u=0" nach="," /> <Formel tex={t`u=\tfrac32`} /> und <Formel tex="u=3" nach="." /></>,
        <>Nachweis: <Formel tex={t`A''(u)=6u^2-18u+9`} nach="," /> also <Formel tex={t`A''\!\left(\tfrac32\right)=13{,}5-27+9=-4{,}5<0`} nach="." /> Bei <Formel tex={t`u=\tfrac32`} /> liegt ein Hochpunkt.</>,
        <>Randwerte: <Formel tex="A(0)=0" /> und <Formel tex="A(3)=0" nach="." /> Die Stellen <Formel tex="u=0" /> und <Formel tex="u=3" /> sind die Randstellen des Definitionsbereichs, an ihnen entartet das Dreieck zu einer Strecke.</>,
        <>
          Ergebnis: Mit <Formel tex={t`f\!\left(\tfrac32\right)=\tfrac{27}{8}`} /> ist <Formel tex={t`A\!\left(\tfrac32\right)=\tfrac12\cdot\tfrac32\cdot\tfrac{27}{8}=\tfrac{81}{32}\approx 2{,}531`} nach="." /> Das größte Dreieck liegt bei <Formel tex={t`u=\tfrac32`} nach="." />
          <Bild daten={BILD_DREIECK_LOESUNG} unter={<>Das größte Dreieck mit <Formel tex={t`u=1{,}5`} nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=x^3-6x^2+9x`} nach="." /> Für <Formel tex={t`0\le u\le 3`} /> bilden der Ursprung <Formel tex="O" nach="," /> der Punkt <Formel tex={t`Q(u\,|\,0)`} /> und der Punkt <Formel tex={t`P(u\,|\,f(u))`} /> auf <Formel tex="K_f" /> ein Dreieck. Für welches <Formel tex="u" /> wird sein Flächeninhalt am größten? Bestimme <Formel tex="u" /> und den größten Flächeninhalt auf drei Nachkommastellen.
      </p>
      <Bild daten={BILD_DREIECK_SKIZZE} unter={<>Das Schaubild von <Formel tex="f" /> mit einem Beispieldreieck.</>} />
      <Kontrollschaubild>
        <Bild daten={BILD_DREIECK_ZIEL} unter={<>Die Zielfunktion <Formel tex="A" /> mit dem Hochpunkt <Formel tex="H" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 8: vertikaler Abstand zweier Schaubilder. */
function Aufgabe8() {
  return (
    <Aufgabe
      nummer="8"
      titel="Größter Abstand zweier Schaubilder"
      felder={[
        { id: 'u', name: 'Stelle u des größten Abstands', beschriftung: <>Stelle <Formel tex="u" /></>, erwartet: ABSTAND.u },
        { id: 'd', name: 'größter Abstand auf drei Nachkommastellen', beschriftung: <>größter Abstand</>, erwartet: ABSTAND.d, toleranz: 0.0006 },
      ]}
      hilfen={[
        <>Für <Formel tex="u>0" /> liegt <Formel tex="K_f" /> über <Formel tex="K_g" nach="." /> Der Abstand ist der größere Funktionswert minus der kleinere: <Formel tex="d(u)=f(u)-g(u)" nach="." /></>,
        <>Vereinfache: <Formel tex={t`d(u)=(u+2)e^{-u}-2e^{-u}=u\,e^{-u}`} nach="." /></>,
        <>Leite mit der Produktregel ab: <Formel tex={t`d'(u)=e^{-u}-u\,e^{-u}=(1-u)\,e^{-u}`} nach="." /> Der Faktor <Formel tex="e^{-u}" /> ist nie null.</>,
      ]}
      loesung={[
        <>Zielfunktion: <Formel tex={t`d(u)=f(u)-g(u)=(u+2)e^{-u}-2e^{-u}=u\,e^{-u}`} /> mit <Formel tex={t`D=[0;\,\infty[`} nach="." /></>,
        <>Ableitung: <Formel tex={t`d'(u)=(1-u)\,e^{-u}=0`} /> liefert <Formel tex="u=1" nach="," /> denn <Formel tex="e^{-u}" /> ist nie null.</>,
        <>Nachweis: <Formel tex={t`d''(u)=(u-2)\,e^{-u}`} nach="," /> also <Formel tex={t`d''(1)=-e^{-1}<0`} nach="." /> Bei <Formel tex="u=1" /> liegt ein Hochpunkt.</>,
        <>Randwerte: <Formel tex="d(0)=0" nach="," /> und für <Formel tex={String.raw`u\to\infty`} /> geht <Formel tex={t`u\,e^{-u}`} /> gegen 0, weil <Formel tex="e^{-u}" /> schneller gegen 0 geht, als <Formel tex="u" /> wächst. Beide Randwerte sind kleiner als <Formel tex="d(1)" nach="." /></>,
        <>
          Ergebnis: Der größte Abstand liegt bei <Formel tex="u=1" /> und beträgt <Formel tex={t`d(1)=e^{-1}=\dfrac1e\approx 0{,}368`} nach="." />
          <Bild daten={BILD_ABSTAND_LOESUNG} unter={<>Die senkrechte Strecke <Formel tex="PQ" /> bei <Formel tex="u=1" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Gegeben sind <Formel tex={t`f(x)=(x+2)\,e^{-x}`} /> und <Formel tex={t`g(x)=2\,e^{-x}`} nach="." /> Für <Formel tex="u\ge 0" /> liegt der Punkt <Formel tex={t`P(u\,|\,f(u))`} /> auf <Formel tex="K_f" /> und der Punkt <Formel tex={t`Q(u\,|\,g(u))`} /> auf <Formel tex="K_g" nach="." /> Für welches <Formel tex="u" /> ist der Abstand der Punkte <Formel tex="P" /> und <Formel tex="Q" /> am größten? Bestimme <Formel tex="u" /> und den größten Abstand auf drei Nachkommastellen.
      </p>
      <Bild daten={BILD_ABSTAND_SKIZZE} unter={<><Formel tex="K_f" /> (orange) und <Formel tex="K_g" /> (blau gestrichelt) mit der Strecke <Formel tex="PQ" nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_ABSTAND_ZIEL} unter={<>Die Zielfunktion <Formel tex="d" /> mit dem Hochpunkt <Formel tex="H" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 9: Abstand Punkt und Schaubild. */
function Aufgabe9() {
  return (
    <Aufgabe
      nummer="9"
      titel="Abstand eines Punkts vom Schaubild"
      felder={[
        { id: 'u2', name: 'Quadrat u hoch zwei der Stelle mit kleinstem Abstand', beschriftung: <><Formel tex="u^2" /> der Stelle</>, erwartet: PUNKTABSTAND.u2 },
        { id: 'd2', name: 'kleinster Wert von d Quadrat', beschriftung: <>kleinster Wert von <Formel tex="d^2" /></>, erwartet: PUNKTABSTAND.d2Min },
        { id: 'd', name: 'kleinster Abstand auf zwei Nachkommastellen', beschriftung: <>kleinster Abstand <Formel tex="d" /></>, erwartet: PUNKTABSTAND.d, toleranz: 0.005 },
      ]}
      hilfen={[
        <>Der Abstand von <Formel tex={t`P(0\,|\,3)`} /> und <Formel tex={t`Q(u\,|\,u^2)`} /> ist <Formel tex={t`d(u)=\sqrt{u^2+(u^2-3)^2}`} nach="." /> Die Wurzel macht das Ableiten umständlich.</>,
        <>Der Abstand <Formel tex="d" /> ist am kleinsten, wo <Formel tex="d^2" /> am kleinsten ist, denn <Formel tex="d\ge 0" nach="." /> Untersuche deshalb <Formel tex={t`d^2(u)=u^2+(u^2-3)^2=u^4-5u^2+9`} nach="." /></>,
        <>Es ist <Formel tex={t`(d^2)'(u)=4u^3-10u=2u(2u^2-5)`} nach="." /> Setze nur <Formel tex="u^2" /> in den Term ein, die Stelle selbst brauchst du nicht.</>,
      ]}
      loesung={[
        <>Zielgröße: <Formel tex={t`d=\sqrt{u^2+(u^2-3)^2}`} nach="." /> Weil <Formel tex="d" /> und <Formel tex="d^2" /> an derselben Stelle am kleinsten sind, genügt <Formel tex={t`d^2(u)=u^4-5u^2+9`} /> mit <Formel tex="u\in\mathbb{R}" nach="." /></>,
        <>Ableitung: <Formel tex={t`(d^2)'(u)=4u^3-10u=2u(2u^2-5)=0`} /> liefert <Formel tex="u=0" /> und <Formel tex={t`u^2=\tfrac52`} nach="," /> also <Formel tex={t`u=\pm\sqrt{2{,}5}\approx\pm 1{,}58`} nach="." /></>,
        <>Nachweis: <Formel tex={t`(d^2)''(u)=12u^2-10`} nach="." /> Bei <Formel tex={t`u^2=\tfrac52`} /> ist sie <Formel tex="30-10=20>0" nach="," /> also Tiefpunkte. Bei <Formel tex="u=0" /> ist sie <Formel tex="-10<0" nach="," /> dort liegt ein Hochpunkt mit <Formel tex="d^2(0)=9" nach="." /></>,
        <>Randverhalten: Für <Formel tex={String.raw`u\to\pm\infty`} /> geht <Formel tex="d^2" /> gegen unendlich. Der Wert an den Tiefpunkten ist deshalb der kleinste.</>,
        <>
          Ergebnis: <Formel tex={t`d^2=\tfrac{25}{4}-\tfrac{25}{2}+9=\tfrac{11}{4}`} nach="," /> also <Formel tex={t`d=\dfrac{\sqrt{11}}{2}\approx 1{,}66`} nach="." /> Es gibt zwei Punkte mit diesem Abstand, <Formel tex={t`Q_1\left(\sqrt{2{,}5}\,|\,2{,}5\right)`} /> und den gespiegelten.
          <Bild daten={BILD_PUNKT_LOESUNG} unter={<>Die Strecke <Formel tex="PQ" /> mit dem kleinsten Abstand.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=x^2`} /> und der Punkt <Formel tex={t`P(0\,|\,3)`} nach="." /> Ein Punkt <Formel tex={t`Q(u\,|\,u^2)`} /> läuft auf <Formel tex="K_f" nach="." /> Für welche Stellen ist der Abstand <Formel tex="d" /> von <Formel tex="P" /> und <Formel tex="Q" /> am kleinsten? Gib <Formel tex="u^2" /> an der Stelle des kleinsten Abstands, den kleinsten Wert von <Formel tex="d^2" /> und den kleinsten Abstand <Formel tex="d" /> auf zwei Nachkommastellen an.
      </p>
      <Bild daten={BILD_PUNKT_SKIZZE} unter={<>Das Schaubild von <Formel tex="f" /> mit <Formel tex="P" /> und einem Beispielpunkt <Formel tex="Q" nach="." /></>} />
      <Kontrollschaubild>
        <Bild daten={BILD_PUNKT_ZIEL} unter={<>Die Zielfunktion <Formel tex="d^2" /> mit dem Tiefpunkt <Formel tex="T" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 10: Rechteck mit größtem Wert am Rand. */
function Aufgabe10() {
  return (
    <Aufgabe
      nummer="10"
      titel="Rechteck mit festem Eckpunkt"
      felder={[
        { id: 'lu', name: 'Stelle des Hochpunkts der Zielfunktion', beschriftung: <>Hochpunkt bei <Formel tex="u" /></>, erwartet: RANDRECHTECK.lokalU },
        { id: 'la', name: 'Flächeninhalt im Hochpunkt', beschriftung: <>Flächeninhalt im Hochpunkt</>, erwartet: RANDRECHTECK.lokalA },
        { id: 'gu', name: 'Stelle des größten Flächeninhalts', beschriftung: <>größter Flächeninhalt bei <Formel tex="u" /></>, erwartet: RANDRECHTECK.globalU },
        { id: 'ga', name: 'größter Flächeninhalt', beschriftung: <>größter Flächeninhalt</>, erwartet: RANDRECHTECK.globalA },
      ]}
      hilfen={[
        <>Das Rechteck <Formel tex="RBPQ" /> hat die Breite <Formel tex="5-u" /> und die Höhe <Formel tex={t`f(u)=\tfrac12u^2+4`} nach="." /> Die Zielfunktion ist <Formel tex={t`A(u)=(5-u)\left(\tfrac12u^2+4\right)`} /> mit <Formel tex={t`0\le u\le 5`} nach="." /></>,
        <>Multipliziere aus: <Formel tex={t`A(u)=-\tfrac12u^3+\tfrac52u^2-4u+20`} nach="." /> Die Ableitung ist <Formel tex={t`A'(u)=-\tfrac32u^2+5u-4=-\tfrac32\left(u-\tfrac43\right)(u-2)`} nach="." /></>,
        <>Es gibt zwei Stellen mit <Formel tex="A'=0" nach="." /> Berechne den Funktionswert an beiden und an den Rändern <Formel tex="u=0" /> und <Formel tex="u=5" nach="." /> Der größte dieser Werte entscheidet.</>,
      ]}
      loesung={[
        <>Zielfunktion: <Formel tex={t`A(u)=(5-u)\left(\tfrac12u^2+4\right)=-\tfrac12u^3+\tfrac52u^2-4u+20`} /> mit <Formel tex={t`D=[0;\,5]`} nach="." /> Der Rand gehört dazu: Bei <Formel tex="u=0" /> liegt <Formel tex="Q" /> auf der y-Achse, bei <Formel tex="u=5" /> hat das Rechteck die Breite 0.</>,
        <>Ableitung: <Formel tex={t`A'(u)=-\tfrac32u^2+5u-4=0`} /> liefert <Formel tex={t`u=\tfrac43`} /> und <Formel tex="u=2" nach="." /> Mit <Formel tex="A''(u)=-3u+5" /> ist <Formel tex={t`A''\!\left(\tfrac43\right)=1>0`} /> (Tiefpunkt) und <Formel tex="A''(2)=-1<0" /> (Hochpunkt).</>,
        <>Der Hochpunkt liegt bei <Formel tex="u=2" /> mit <Formel tex={t`A(2)=3\cdot 6=18`} nach="." /></>,
        <>Vergleich: <Formel tex={t`A(0)=5\cdot 4=20`} nach="," /> <Formel tex={t`A\!\left(\tfrac43\right)\approx 17{,}93`} nach="," /> <Formel tex="A(2)=18" /> und <Formel tex="A(5)=0" nach="." /> Der größte Wert ist <Formel tex="A(0)=20" nach="." /> Er liegt am Rand, dort ist <Formel tex="A'(0)=-4\ne 0" nach="." /></>,
        <>
          Ergebnis: Der größte Flächeninhalt ist 20 FE bei <Formel tex="u=0" /> (<Formel tex="Q" /> auf der y-Achse), der Hochpunkt bei <Formel tex="u=2" /> mit 18 FE ist nur lokal.
          <Bild daten={BILD_RANDRECHTECK_LOESUNG} unter={<>Das größte Rechteck: <Formel tex="Q" /> liegt auf der y-Achse.</>} />
        </>,
      ]}
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=\tfrac12x^2+4`} /> für <Formel tex={t`0\le x\le 5`} nach="." /> Der Punkt <Formel tex={t`Q(u\,|\,f(u))`} /> liegt auf <Formel tex="K_f" nach="," /> der Punkt <Formel tex={t`R(u\,|\,0)`} /> darunter auf der x-Achse. Mit <Formel tex={t`B(5\,|\,0)`} /> und <Formel tex={t`P(5\,|\,f(u))`} /> entsteht das Rechteck <Formel tex="RBPQ" nach="." /> Bestimme die Stelle und den Wert des Hochpunkts der Zielfunktion <Formel tex="A" nach="." /> Gib dann an, für welches <Formel tex="u" /> der Flächeninhalt am größten ist und wie groß er dort ist.
      </p>
      <Bild daten={BILD_RANDRECHTECK_SKIZZE} unter={<>Das Schaubild von <Formel tex="f" /> mit einem Beispielrechteck.</>} />
      <Kontrollschaubild>
        <Bild daten={BILD_RANDRECHTECK_ZIEL} unter={<>Die Zielfunktion <Formel tex="A" /> mit <Formel tex="H" nach="," /> <Formel tex="T" /> und den Randpunkten <Formel tex="R" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Frage 11: Gibt es einen größten Zylinder? */
function Frage11() {
  const optionen = [
    opt(
      'richtig',
      <>Der Flächeninhalt der Rechtecke ist bei <Formel tex="u=2" /> am größten, einen größten Zylinder gibt es nicht: Das Volumen steigt mit <Formel tex="u" /> immer weiter und nähert sich <Formel tex="8\pi" nach="." /></>,
      true,
      <>Richtig.</>,
    ),
    opt(
      'beide',
      <>Beide Größen sind bei <Formel tex="u=2" /> am größten.</>,
      false,
      <>Beim Flächeninhalt stimmt das. Das Volumen ist aber <Formel tex={t`V(u)=\pi u^2\cdot f(u)`} nach="," /> und seine Ableitung <Formel tex={t`V'(u)=\dfrac{64\pi u}{(u^2+4)^2}`} /> ist für <Formel tex="u>0" /> positiv, nie null. Es gibt keine Stelle mit <Formel tex="V'=0" nach="." /></>,
    ),
    opt(
      'keines',
      <>Weder für den Flächeninhalt noch für das Volumen gibt es einen größten Wert, weil <Formel tex={String.raw`u\to\infty`} /> möglich ist.</>,
      false,
      <>Der Flächeninhalt <Formel tex={t`A(u)=\dfrac{16u}{u^2+4}`} /> hat bei <Formel tex="u=2" /> einen Hochpunkt mit <Formel tex="A(2)=4" nach="," /> und für große <Formel tex="u" /> geht <Formel tex="A" /> gegen 0. Der Flächeninhalt ist also nach oben begrenzt und hat sein Maximum.</>,
    ),
    opt(
      'acht-pi',
      <>Das größte Volumen ist <Formel tex="8\pi" nach="," /> der Grenzwert für <Formel tex={String.raw`u\to\infty`} nach="." /></>,
      false,
      <>Das Volumen kommt <Formel tex="8\pi" /> beliebig nahe, erreicht es aber für keine Stelle <Formel tex="u" nach="." /> Ein größter Wert muss angenommen werden. Es gibt hier nur eine obere Schranke, aber keinen größten Zylinder.</>,
    ),
  ];
  return (
    <Auswahlfrage
      nummer="11"
      titel="Gibt es immer ein Maximum?"
      optionen={platziere(optionen, 1)}
      erklaerung={
        <>
          <p>
            Flächeninhalt: <Formel tex={t`A(u)=2u\cdot f(u)=\dfrac{16u}{u^2+4}`} nach="," /> <Formel tex={t`A'(u)=\dfrac{16(4-u^2)}{(u^2+4)^2}`} nach="," /> also ein Hochpunkt bei <Formel tex="u=2" /> mit <Formel tex="A(2)=4" nach="." /> Volumen: Der Zylinder hat den Radius <Formel tex="u" /> und die Höhe <Formel tex="f(u)" nach="," /> also <Formel tex={t`V(u)=\pi u^2\cdot\dfrac{8}{u^2+4}=\dfrac{8\pi u^2}{u^2+4}`} nach="." /> Es ist <Formel tex={t`V'(u)=\dfrac{64\pi u}{(u^2+4)^2}>0`} /> für <Formel tex="u>0" nach="." /> Die Funktion steigt streng monoton, ein Maximum gibt es nicht. Wer <Formel tex="V'=0" /> sucht, findet nur <Formel tex="u=0" nach="," /> das ist der Rand.
          </p>
          <Bild daten={BILD_ZYLINDER_VOLUMEN} unter={<>Das Volumen <Formel tex="V" /> steigt immer weiter und nähert sich der Geraden <Formel tex={t`y=8\pi`} /> (blau gestrichelt).</>} />
        </>
      }
    >
      <p>
        Gegeben ist <Formel tex={t`f(x)=\dfrac{8}{x^2+4}`} nach="." /> Zwischen den Geraden <Formel tex="x=-u" nach="," /> <Formel tex="x=u" /> (mit <Formel tex="u>0" nach=")" />, der x-Achse und <Formel tex="K_f" /> liegen Rechtecke. Drehst du ein Rechteck um die y-Achse, entsteht ein Zylinder mit dem Radius <Formel tex="u" /> und der Höhe <Formel tex="f(u)" nach="." /> Welche Aussage ist richtig?
      </p>
      <Bild daten={BILD_ZYLINDER} unter={<>Das Schaubild von <Formel tex="f" /> mit einem Beispielrechteck.</>} />
    </Auswahlfrage>
  );
}

/** Aufgabe 12: Eintrittspreis. */
function Aufgabe12() {
  return (
    <Aufgabe
      nummer="12"
      titel="Gewinn bei einem Turnier"
      felder={[
        { id: 'p', name: 'Eintrittspreis in Euro', beschriftung: <>Eintrittspreis <Formel tex="p" /></>, erwartet: EINTRITT.p },
        { id: 'n', name: 'Zahl der Besucher', beschriftung: <>Zahl der Besucher</>, erwartet: EINTRITT.besucher },
        { id: 'g', name: 'größter Gewinn in Euro', beschriftung: <>größter Gewinn</>, erwartet: EINTRITT.g },
      ]}
      hilfen={[
        <>Der Gewinn je Besucher ist der Preis minus 2 Euro Kosten, also <Formel tex="p-2" nach="." /> Multipliziere mit der Zahl der Besucher <Formel tex="n(p)=600-40p" nach="." /></>,
        <>Zielfunktion: <Formel tex={t`G(p)=(p-2)(600-40p)=-40p^2+680p-1200`} nach="." /> Definitionsbereich: <Formel tex={t`2\le p\le 15`} nach="." /></>,
        <>Es ist <Formel tex={t`G'(p)=-80p+680`} nach="." /> Berechne <Formel tex="G" /> an der Nullstelle und an den Rändern 2 und 15.</>,
      ]}
      loesung={[
        <>Zielgröße: der Gewinn <Formel tex={t`G=(p-2)\cdot n`} nach="." /> Nebenbedingung: <Formel tex="n(p)=600-40p" nach="." /></>,
        <>Zielfunktion: <Formel tex={t`G(p)=(p-2)(600-40p)=-40p^2+680p-1200`} /> mit <Formel tex={t`D=[2;\,15]`} nach="." /> Unter 2 Euro machen die Besucher Verlust, bei 15 Euro kommt niemand mehr: <Formel tex="n(15)=0" nach="." /></>,
        <>Ableitung: <Formel tex={t`G'(p)=-80p+680=0`} /> liefert <Formel tex={t`p=8{,}5`} nach="." /> Wegen <Formel tex="G''(p)=-80<0" /> ist es ein Hochpunkt.</>,
        <>Randwerte: <Formel tex="G(2)=0" /> und <Formel tex="G(15)=0" nach="." /> Beide sind kleiner als <Formel tex="G(8{,}5)" nach="." /></>,
        <>
          Ergebnis: Bei einem Preis von 8,50 Euro kommen <Formel tex={t`n(8{,}5)=600-340=260`} /> Besucher, der Gewinn ist <Formel tex={t`G(8{,}5)=6{,}5\cdot 260=1690`} /> Euro.
          <Bild daten={BILD_EINTRITT} unter={<>Die Zielfunktion <Formel tex="G" /> mit dem Hochpunkt <Formel tex="H" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Für ein Turnier wird ein Eintrittspreis von <Formel tex="p" /> Euro festgelegt. Bei diesem Preis kommen <Formel tex="n(p)=600-40p" /> Besucher. Jeder Besucher verursacht 2 Euro Kosten (Reinigung, Programmheft). Der Preis liegt zwischen 2 und 15 Euro. Bei welchem Preis ist der Gewinn am größten? Gib den Preis, die Zahl der Besucher und den Gewinn an.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_EINTRITT} unter={<>Die Zielfunktion <Formel tex="G" /> mit dem Hochpunkt <Formel tex="H" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 13: kostengünstigstes Kabel. */
function Aufgabe13() {
  return (
    <Aufgabe
      nummer="13"
      titel="Kostengünstigstes Kabel"
      felder={[
        { id: 'x', name: 'Stelle x des Uferpunkts', beschriftung: <>Uferpunkt bei <Formel tex="x" /></>, erwartet: KABEL.x },
        { id: 'k', name: 'kleinste Kosten', beschriftung: <>kleinste Kosten</>, erwartet: KABEL.k },
      ]}
      hilfen={[
        <>Der Weg im Wasser von <Formel tex={t`A(0\,|\,3)`} /> zu <Formel tex={t`P(x\,|\,0)`} /> hat nach dem Satz des Pythagoras die Länge <Formel tex={t`\sqrt{9+x^2}`} nach="." /> Der Weg am Ufer von <Formel tex="P" /> zu <Formel tex={t`B(8\,|\,0)`} /> ist <Formel tex="8-x" /> lang.</>,
        <>Die Zielfunktion ist <Formel tex={t`K(x)=5\sqrt{9+x^2}+3(8-x)`} /> mit <Formel tex={t`0\le x\le 8`} nach="." /> Leite mit der Kettenregel ab.</>,
        <>Es ist <Formel tex={t`K'(x)=\dfrac{5x}{\sqrt{9+x^2}}-3`} nach="." /> Aus <Formel tex="K'(x)=0" /> folgt <Formel tex={t`5x=3\sqrt{9+x^2}`} nach="." /> Quadriere beide Seiten, es ist <Formel tex="x>0" nach="." /></>,
      ]}
      loesung={[
        <>Zielgröße: die Kosten <Formel tex={t`K=5\cdot\overline{AP}+3\cdot\overline{PB}`} nach="." /> Es ist <Formel tex={t`\overline{AP}=\sqrt{9+x^2}`} /> und <Formel tex={t`\overline{PB}=8-x`} nach="." /></>,
        <>Zielfunktion: <Formel tex={t`K(x)=5\sqrt{9+x^2}+3(8-x)`} /> mit <Formel tex={t`D=[0;\,8]`} nach="." /> Der Uferpunkt kann auch direkt unter <Formel tex="A" /> oder bei <Formel tex="B" /> liegen.</>,
        <>Ableitung: <Formel tex={t`K'(x)=\dfrac{5x}{\sqrt{9+x^2}}-3=0`} /> bedeutet <Formel tex={t`5x=3\sqrt{9+x^2}`} nach="." /> Quadrieren: <Formel tex={t`25x^2=81+9x^2`} nach="," /> also <Formel tex={t`16x^2=81`} /> und <Formel tex={t`x=\tfrac94`} nach="." /> Die negative Lösung liegt nicht im Definitionsbereich.</>,
        <>Nachweis: <Formel tex={t`K''(x)=\dfrac{45}{(9+x^2)^{3/2}}>0`} nach="," /> also ein Tiefpunkt.</>,
        <>
          Ergebnis: Für <Formel tex={t`x=\tfrac94`} /> ist <Formel tex={t`\sqrt{9+2{,}25^2}=3{,}75`} nach="," /> also <Formel tex={t`K=5\cdot 3{,}75+3\cdot 5{,}75=18{,}75+17{,}25=36`} nach="." /> Die Randwerte <Formel tex="K(0)=39" /> und <Formel tex={t`K(8)=5\sqrt{73}\approx 42{,}72`} /> sind größer. Das Kabel ist am günstigsten, wenn es 2,25 km von der Stelle unter <Formel tex="A" /> an Land geht. Die Kosten sind dann 36.
          <Bild daten={BILD_KABEL_LOESUNG} unter={<>Das günstigste Kabel trifft das Ufer bei <Formel tex="x=2{,}25" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Ein Kabel soll von einer Insel zu einem Ort am Ufer verlegt werden. Das Ufer ist die x-Achse (Längen in km), die Insel liegt in <Formel tex={t`A(0\,|\,3)`} nach="," /> der Ort in <Formel tex={t`B(8\,|\,0)`} nach="." /> Das Kabel verläuft im Wasser geradlinig von <Formel tex="A" /> zu einem Uferpunkt <Formel tex={t`P(x\,|\,0)`} /> und dann am Ufer weiter nach <Formel tex="B" nach="." /> Im Wasser kostet jeder Kilometer 5 Geldeinheiten, am Ufer 3. Wo muss <Formel tex="P" /> liegen, damit die Kosten am kleinsten sind? Gib <Formel tex="x" /> und die kleinsten Kosten an.
      </p>
      <Bild daten={BILD_KABEL_SKIZZE} unter={<>Das Kabel im Wasser (blau) und am Ufer (schwarz), <Formel tex="P" /> ist hier beispielhaft gewählt.</>} />
      <Kontrollschaubild>
        <Bild daten={BILD_KABEL_ZIEL} unter={<>Die Zielfunktion <Formel tex="K" /> mit dem Tiefpunkt <Formel tex="T" /> und den Randpunkten <Formel tex="R" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 14: Abwurfwinkel. */
function Aufgabe14() {
  return (
    <Aufgabe
      nummer="14"
      titel="Der optimale Abwurfwinkel"
      felder={[
        { id: 'a', name: 'Abwurfwinkel in Grad', beschriftung: <>Winkel <Formel tex="\alpha" /> in Grad</>, erwartet: WURF.grad },
        { id: 'w', name: 'größte Wurfweite in Metern', beschriftung: <>größte Wurfweite in m</>, erwartet: WURF.w },
      ]}
      hilfen={[
        <>Die Zielfunktion ist gegeben, <Formel tex={t`W(\alpha)=14{,}4\cdot\sin(2\alpha)`} nach="," /> mit <Formel tex={t`0<\alpha<\dfrac{\pi}{2}`} nach="." /> Die Ableitung braucht die Kettenregel.</>,
        <>Es ist <Formel tex={t`W'(\alpha)=14{,}4\cdot 2\cos(2\alpha)=28{,}8\cos(2\alpha)`} nach="." /> Der Kosinus ist null bei <Formel tex={t`\dfrac{\pi}{2}`} nach="." /></>,
        <>Aus <Formel tex={t`2\alpha=\dfrac{\pi}{2}`} /> folgt <Formel tex={t`\alpha=\dfrac{\pi}{4}`} nach="." /> Rechne in Grad um: <Formel tex="\pi" /> entspricht <Formel tex={t`180^\circ`} nach="." /></>,
      ]}
      loesung={[
        <>Zielfunktion: <Formel tex={t`W(\alpha)=14{,}4\sin(2\alpha)`} /> mit <Formel tex={t`D=]0;\,\tfrac{\pi}{2}[`} nach="." /> Die Winkel sind im Bogenmaß.</>,
        <>Ableitung: <Formel tex={t`W'(\alpha)=28{,}8\cos(2\alpha)=0`} /> liefert <Formel tex={t`2\alpha=\tfrac{\pi}{2}`} /> (eine weitere Lösung <Formel tex={t`2\alpha=\tfrac{3\pi}{2}`} /> liegt außerhalb des Definitionsbereichs), also <Formel tex={t`\alpha=\tfrac{\pi}{4}`} nach="." /></>,
        <>Nachweis: <Formel tex={t`W''(\alpha)=-57{,}6\sin(2\alpha)`} /> ist bei <Formel tex={t`\alpha=\tfrac{\pi}{4}`} /> gleich <Formel tex="-57{,}6<0" nach="," /> ein Hochpunkt. Die Randwerte <Formel tex="W(0)=0" /> und <Formel tex={t`W\!\left(\tfrac{\pi}{2}\right)=0`} /> sind kleiner.</>,
        <>
          Ergebnis: Der günstigste Winkel ist <Formel tex={t`\alpha=\tfrac{\pi}{4}=45^\circ`} nach="." /> Die größte Wurfweite ist <Formel tex={t`W=14{,}4\cdot\sin\tfrac{\pi}{2}=14{,}4`} /> m. Dieses Modell vernachlässigt die Abwurfhöhe. Wirft man aus der Höhe der Hand, ist der beste Winkel etwas kleiner als 45°.
          <Bild daten={BILD_WURF} unter={<>Die Zielfunktion <Formel tex="W" /> mit dem Hochpunkt <Formel tex="H" /> bei <Formel tex="\tfrac{\pi}{4}" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Ein Ball wird mit der Geschwindigkeit 12 m/s unter dem Winkel <Formel tex="\alpha" /> abgeworfen. Ohne Luftwiderstand und ohne Abwurfhöhe ist die Wurfweite <Formel tex={t`W(\alpha)=14{,}4\cdot\sin(2\alpha)`} /> in Metern (<Formel tex="\alpha" /> im Bogenmaß, <Formel tex={t`0<\alpha<\dfrac{\pi}{2}`} nach=")." /> Bei welchem Winkel in Grad ist die Wurfweite am größten, und wie groß ist sie?
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_WURF} unter={<>Die Zielfunktion <Formel tex="W" /> mit dem Hochpunkt <Formel tex="H" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

/** Aufgabe 15: Kegel mit festgelegter Mantellinie. */
function Aufgabe15() {
  return (
    <Aufgabe
      nummer="15"
      titel="Kegel mit größtem Volumen"
      felder={[
        { id: 'r', name: 'Radius in cm, auf zwei Nachkommastellen', beschriftung: <>Radius <Formel tex="r" /></>, erwartet: KEGEL.r, toleranz: 0.01 },
        { id: 'h', name: 'Höhe in cm, auf zwei Nachkommastellen', beschriftung: <>Höhe <Formel tex="h" /></>, erwartet: KEGEL.h, toleranz: 0.01 },
        { id: 'v', name: 'größtes Volumen in Kubikzentimetern, auf eine Nachkommastelle', beschriftung: <>größtes Volumen</>, erwartet: KEGEL.v, toleranz: 0.1 },
      ]}
      hilfen={[
        <>Das Volumen eines Kegels ist <Formel tex={t`V=\tfrac13\pi r^2h`} nach="." /> Die Mantellinie <Formel tex="s=12" /> bildet mit <Formel tex="r" /> und <Formel tex="h" /> ein rechtwinkliges Dreieck: <Formel tex="r^2+h^2=144" nach="." /></>,
        <>Löse nach <Formel tex="h" /> auf und setze ein: <Formel tex={t`V(r)=\tfrac{\pi}{3}\,r^2\sqrt{144-r^2}`} /> mit <Formel tex={t`0<r<12`} nach="." /></>,
        <>Leite mit Produkt- und Kettenregel ab und bringe auf einen Bruch: <Formel tex={t`V'(r)=\tfrac{\pi}{3}\cdot\dfrac{r\,(288-3r^2)}{\sqrt{144-r^2}}`} nach="." /> Ein Bruch ist null, wenn der Zähler null ist.</>,
      ]}
      loesung={[
        <>Nebenbedingung: <Formel tex="r^2+h^2=12^2" nach="," /> also <Formel tex={t`h=\sqrt{144-r^2}`} nach="." /></>,
        <>Zielfunktion: <Formel tex={t`V(r)=\tfrac{\pi}{3}\,r^2\sqrt{144-r^2}`} /> mit <Formel tex={t`D=]0;\,12[`} nach="." /></>,
        <>
          Ableitung mit der Produktregel, <Formel tex={t`u=r^2`} /> und <Formel tex={t`v=\sqrt{144-r^2}`} nach=":" />
          <Formel anzeige tex={t`u'=2r\,,\quad v'=-\dfrac{r}{\sqrt{144-r^2}}`} />
          <Formel anzeige tex={t`V'(r)=\tfrac{\pi}{3}\,(u'v+uv')`} />
          <Formel anzeige tex={t`=\tfrac{\pi}{3}\cdot\dfrac{2r(144-r^2)-r^3}{\sqrt{144-r^2}}`} />
          <Formel anzeige tex={t`=\tfrac{\pi}{3}\cdot\dfrac{r\,(288-3r^2)}{\sqrt{144-r^2}}`} />
        </>,
        <>Nullstelle im Definitionsbereich: <Formel tex="288-3r^2=0" /> liefert <Formel tex="r^2=96" nach="," /> also <Formel tex={t`r=4\sqrt6\approx 9{,}80`} nach="." /> Links davon ist <Formel tex="V'>0" nach="," /> rechts davon <Formel tex="V'<0" nach="," /> der Vorzeichenwechsel von <Formel tex="+" /> nach <Formel tex="-" /> zeigt den Hochpunkt.</>,
        <>Randverhalten: Für <Formel tex={String.raw`r\to 0`} /> und für <Formel tex={String.raw`r\to 12`} /> geht <Formel tex="V" /> gegen 0. Der Hochpunkt ist das globale Maximum.</>,
        <>
          Ergebnis: <Formel tex={t`h=\sqrt{144-96}=\sqrt{48}=4\sqrt3\approx 6{,}93`} nach="," /> <Formel tex={t`V=\tfrac{\pi}{3}\cdot 96\cdot 4\sqrt3=128\sqrt3\,\pi\approx 696{,}5`} nach="." /> Der Kegel hat den Radius 9,80 cm, die Höhe 6,93 cm und das Volumen 696,5 cm³.
          <Bild daten={BILD_KEGEL} unter={<>Die Zielfunktion <Formel tex="V" /> mit dem Hochpunkt <Formel tex="H" nach="." /></>} />
        </>,
      ]}
    >
      <p>
        Ein Kegel hat die Mantellinie <Formel tex="s=12" /> cm, Radius und Höhe sind veränderlich. Für welchen Radius ist sein Volumen am größten? Bestimme <Formel tex="r" /> und <Formel tex="h" /> auf zwei Nachkommastellen sowie das größte Volumen auf eine Nachkommastelle.
      </p>
      <Kontrollschaubild>
        <Bild daten={BILD_KEGEL} unter={<>Die Zielfunktion <Formel tex="V" /> mit dem Hochpunkt <Formel tex="H" nach="." /></>} />
      </Kontrollschaubild>
    </Aufgabe>
  );
}

export function Ueberpruefen() {
  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Die Aufgaben folgen den sechs Schritten der Strategie. Hilfen und Lösungsweg kannst du schrittweise aufdecken, bei den Aufgaben gibt es ein Schaubild zur Kontrolle. Im Bild bedeuten H Hochpunkt, T Tiefpunkt und R Randpunkt. Ein offener Randpunkt (weiß gefüllt) gehört nicht zum Definitionsbereich.
      </p>
      <Eingabehinweis />

      <h3>Zielfunktion und Definitionsbereich</h3>
      <Frage1 />
      <Frage2 />
      <Aufgabe3 />
      <Aufgabe4 />

      <h3>Extremwerte an Schaubildern</h3>
      <Aufgabe5 />
      <Frage6 />
      <Aufgabe7 />
      <Aufgabe8 />
      <Aufgabe9 />

      <h3>Randwerte und Existenz</h3>
      <Aufgabe10 />
      <Frage11 />

      <h3>Anwendungen</h3>
      <Aufgabe12 />
      <Aufgabe13 />
      <Aufgabe14 />
      <Aufgabe15 />
    </Abschnitt>
  );
}
