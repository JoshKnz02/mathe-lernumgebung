# Projektregeln

Dieses Dokument gilt für jede Entwicklungssitzung in diesem Repository.

## Zweck

Langfristig wachsende, interaktive Mathematik-Lernumgebung für die gymnasiale Oberstufe (Klassen 12 und 13, Baden-Württemberg). Sie ergänzt das Kursnotizbuch der Lehrkraft und ersetzt es nicht. Fachliche Orientierung gibt der Bildungsplan 2021 (Berufliches Gymnasium, erhöhtes Anforderungsniveau). BPE-Nummern stehen als Metadaten an den Modulen.

## Zusammenarbeit

- Die Lehrkraft hat keine Programmierkenntnisse. Alle Änderungen erfolgen über Anweisungen in natürlicher Sprache. Technische Entscheidungen werden verständlich erklärt, technische Arbeiten übernimmt Claude.
- Sprache der Kommunikation und der Inhalte: Deutsch, Anrede mit "du", sachlicher Ton.
- Nichts als erledigt melden, was nicht tatsächlich geprüft wurde. Das gilt besonders für Veröffentlichungen: erst melden, nachdem die Live-Seite abgerufen und geprüft wurde.
- Ton in allen Texten (Chat und Modulinhalte): sachlich, ohne Emojis, ohne Gedankenstriche, ohne Floskeln. Duzen.
- Unterlagen (Arbeitsblätter, Bildungsplan) hängt die Lehrkraft im Chat an. Ordner auf ihrem Rechner sind in Cloud-Sitzungen nicht sichtbar. Fehler und Unstimmigkeiten in den Unterlagen werden gemeldet und im Modul korrekt umgesetzt.
- Nach jeder Änderung an einem Entwurf bzw. vor einer Freigabe wird die aktuelle Vorschau als ZIP mit der einen HTML-Datei geschickt (`npm run build:preview`, Datei in `vorschau/`).
- Rückfragen nur bei wesentlich fehlenden Angaben. Untergeordnete Gestaltungsentscheidungen selbst treffen.
- Auch Änderungen ohne neues Modul (Design, Navigation, neuer Kurs) laufen über einen Entwurfsbranch `entwurf/<thema>` von `main` aus, mit Tests, Browserprüfung, Vorschau als ZIP und ausdrücklicher Freigabe im Chat. Nur reine Änderungen an Regeln und Dokumentation dürfen direkt nach `main`.
- Wenn die Lehrkraft nach der Veröffentlichung meldet, dass sie Änderungen nicht sieht: zuerst den Lauf prüfen (grün?), dann hart neu laden (Mac Cmd+Shift+R, Windows Strg+Shift+R) oder ein privates Fenster nutzen. Genehmigungen in der Umgebung `github-pages` waren zuletzt nicht mehr nötig, der Lauf ging von selbst durch. Der Lauf wird trotzdem abgefragt und verlinkt.

## Didaktik

- Prinzipien: Erklären, Entdecken, Überprüfen. Nicht jedes Modul braucht alle drei.
- Interaktive Elemente nur mit erkennbarem didaktischem Mehrwert. Keine unnötigen Erklärungen, Visualisierungen oder Aufgaben.
- Mathematische Korrektheit, klare Fachsprache, Niveau der Oberstufe. Unsicherheiten offen benennen. Automatische Tests ersetzen die fachliche Prüfung durch die Lehrkraft nicht.
- Schreibweise von Funktionsgleichungen und Fachbegriffen folgt dem Bildungsplan. Bei konkreten Argumenten stehen Klammern: sin(30°), sin(π/6), cos(2π). Bei der Variablen genügt sin x.
- Durchgehend dieselbe Fachsprache wie auf den Arbeitsblättern der Lehrkraft, zum Beispiel Ruhelage (nicht Mittellinie), Schaubild, Lageveränderung, Referenzpunkt.
- Bei Funktionstermen heißen die Parameter a, b, c, d (Streckung in y-Richtung, Streckung in x-Richtung, Verschiebung in x-Richtung, Verschiebung in y-Richtung). In Erklärungen werden keine Streckfaktoren k verwendet. Bei der Streckung in x-Richtung steht ein Denkhinweis, dass die Wirkung genau umgekehrt zu b ist (b = 3 staucht auf den Faktor ein Drittel).
- Schaubilder werden als K_f, K_g usw. benannt.
- Bei den markanten Punkten gilt in den Modulen b > 0. Zwischen zwei aufeinanderfolgenden markanten Punkten liegt immer eine Viertelperiode p/4. Diese Regel steht im Entdecken bzw. in der Zusammenfassung, nicht im Erklären.
- Bei Arbeitsblättern der Lehrkraft werden Fehler und Unstimmigkeiten gemeldet und im Modul korrekt umgesetzt, nicht stillschweigend übernommen.
- Anschauliche Darstellung (Schaubild mit eingezeichneten Strecken, Punkten und Beschriftungen, Farben, Skizze, wo sinnvoll interaktiv) wird bei Erklärungen und Lösungen immer zusätzlich zum Text gewählt, wenn sie möglich und sinnvoll ist. Der Text allein genügt dann nicht. Das gilt ausdrücklich auch für die klappbaren Beobachtungen im Entdecken, die Erklärungen zu Auswahlfragen und die Lösungswege von Aufgaben. Ob eine anschauliche Lösung dazukommt, entscheidest du aus Schülersicht: Würde das Bild dem Lernenden helfen, die Lösung zu verstehen? Wenn ja, wird es immer ergänzt. Wo es keinen Mehrwert hat (zum Beispiel reine Termumformung), entfällt es. Die Zeichnung muss mit der Rechnung übereinstimmen und wird im Test geprüft.
- Brüche werden in Texten, Aufgaben und Lösungen immer in Bruchschreibweise gesetzt (Formel mit \frac, zum Beispiel ein Drittel), nie als 1/3 oder „1 durch 3“. Nur bei der Eingabe durch die Lernenden steht der Hinweis, wie der Bruch getippt wird (1/3), zusammen mit der Bruchschreibweise.
- Zeilenumbrüche: Formeln und Funktionsgleichungen stehen, wenn möglich, in einer Zeile und brechen nur um, wenn sie breiter sind als die Zeile. Ein Satzzeichen direkt hinter einer Inline-Formel gehört zur Formel und steht nie allein am Zeilenanfang. Dafür wird es als `<Formel tex="..." nach="," />` geschrieben, nicht als Text hinter der Formel. Das gilt besonders für Aufzählungen wie a, b, c und d. Ein Test prüft das in allen Modulen, die Browserprüfung kontrolliert Umbrüche bei 320 px Breite.
- Bezeichnungen in den Modulen zu Gleichungen und Modellierung: Lösungen heißen x₁, x₂, die rechte Seite von sin(x) = r heißt r, die Substitutionsvariable heißt immer z (z = b(x − c), nie u), alle Lösungen werden mit k ∈ ℤ geschrieben, die Lösungsmenge als L = {…; …} mit Semikolon. Der Taschenrechner steht auf Bogenmaß, die Umkehrungen heißen Arkussinus und Arkuskosinus (Tasten sin⁻¹ und cos⁻¹).
- Module ohne neuen Stoff (zum Beispiel Anwendungsaufgaben) dürfen eigene Abschnitte statt Erklären, Entdecken, Überprüfen haben (IDs in `meta.json`). Gestufte Hilfen und ein schrittweiser Lösungsweg sind der Standard bei Aufgaben (Baustein `Aufgabe`).
- Aufgaben: Bei „exakt“ zählt nur die Eingabe als Vielfaches von π (zum Beispiel `pi/6`), bei Taschenrechneraufgaben sind Dezimalzahlen auf zwei Nachkommastellen genau erlaubt. Bei Ungleichungen gehören die Lösungsstellen selbst nicht dazu, Randtage prüfen („an allen Tagen“). Zeiträume auf die Minute: Beginn aufrunden, Ende abrunden. Fehlende Angaben (zum Beispiel eine Periode) als Annahme in den Aufgabentext schreiben.
- Auswahlfragen: Die richtige Antwort steht nicht immer an derselben Stelle. Falsche Antworten sind typische Fehler, die Rückmeldung begründet kurz.
- Bei Aufgaben mit Schaubild wird ein aufklappbares Kontrollschaubild angeboten (`AufKlick`).
- Jeder Themenbereich schließt mit einer Ich-Kann-Liste als Modul ab (Vorbild `ich-kann-liste`): Aussagen „Ich kann …“ aus der Liste der Lehrkraft, nach dem Bildungsplan ergänzte Aussagen sind gekennzeichnet, Selbsteinschätzung ++, 00, −−, je eine Kontrollaufgabe mit **eigenen** Zahlen (nicht die der Arbeitsblätter, weil das Repository öffentlich ist), Verweise auf die Module, Auswertung nach Dringlichkeit. Einschätzung und Ergebnisse bleiben nur im Arbeitsspeicher, nichts wird gespeichert.
- Schaubilder mit Beschriftungen: Texte im Bild kurz halten (zum Beispiel α1, P1), weil lange Texte am Rand umbrechen. Zahlenwerte stehen in der Bildunterschrift. Einheitskreise sind quadratisch (`brett-quadrat`) und stehen untereinander, nicht nebeneinander, damit sie am Handy lesbar bleiben.
- Offene Lücken in den Unterlagen der Lehrkraft (zum Beispiel Stoff, der in keinem Modul vorkommt) werden gemeldet und im Entwicklungsdokument festgehalten, nicht stillschweigend gefüllt.
- Formulierungen sind schülernah. Fachzeichen wie der Betrag |x| nur verwenden, wenn sie nötig sind und die Lernenden sie kennen, sonst in Worten erklären.
- Umfangreiche Module werden in Abschnitte (z. B. Erklären, Entdecken, Überprüfen, Zusammenfassung) gegliedert, die über ein Untermenü einzeln gewählt werden.
- Reihenfolge der Abschnitte (Standard, mit Begründung änderbar): Zuerst wird kurz erklärt, was auf Vereinbarung beruht und nicht entdeckt werden kann, also Begriffe, Definitionen, Schreibweisen und Verfahren. Danach entdecken die Lernenden Zusammenhänge und Eigenschaften, beginnend mit einer Vermutungsfrage vor dem interaktiven Element. Es folgen Überprüfen und die Zusammenfassung. Die Zusammenfassung sichert das Entdeckte und benennt es, zum Beispiel Namen von Funktionen und Eigenschaftentabellen. Was die Lernenden erst entdecken sollen, steht nicht schon im Erklären. Die Module sind auch zum Selbstlernen zu Hause gedacht, daher steht eine kurze Erklärung vor dem Entdecken. Die Reihenfolge wird je Modul in `meta.json` unter `abschnitte` festgelegt.

## Technik

- React, TypeScript, Vite. KaTeX und JSXGraph werden über npm eingebunden, nicht über ein CDN. GeoGebra nur optional und erst nach Klick.
- Möglichst wenige, gut dokumentierte Abhängigkeiten. Jede neue Abhängigkeit begründen.
- Lernmodule, Kurskonfiguration und Darstellung bleiben getrennt.
- Jedes Modul existiert genau einmal und hat eine feste ID. Kurse verweisen per ID. Module werden nie dupliziert und IDs nie umbenannt.
- Bestehende Komponenten und Gestaltungsstandards wiederverwenden. Bestehende Funktionen nur ändern, wenn nötig oder beauftragt.
- Responsive, touchbedienbar, ausreichende Kontraste, Tastaturbedienung wo sinnvoll.

- Formeln: Ein Satzzeichen direkt hinter einer Inline-Formel wird als `nach="..."` an die Formel gebunden (Test `formel-satzzeichen`). JSXGraph überschreibt beim Start `role` und `aria-label` des Zeichenbretts. Der Baustein `Zeichenbrett` setzt sie danach wieder und muss das beibehalten.
- Vorschau-Kurs „alle Module“: Reihenfolge wie in den echten Kursen, Entwürfe ohne Kurs danach.

## Design

Heller Inhaltsbereich, dunkler Navigationsbereich, dezente blaue Akzente, einheitliche Karten und Bedienelemente, großzügige Abstände, keine spielerischen Elemente, keine unnötigen Animationen.

- Farben in Darstellungen: Werden mehrere Farben verwendet (Kurven, Strecken, Punkte), müssen sie sich gut unterscheiden lassen, bei drei Farben ebenso wie bei fünf. Keine ähnlichen Farbtöne wie Blau und Violett oder Braun und Orange nebeneinander. Verwendet wird die farbenblindsichere Palette nach Okabe und Ito (zum Beispiel Orange #D55E00, Blau #0072B2, Grün #009E73, Schwarz (gestrichelt), Gelborange #E69F00, Rosa #CC79A7), dazu Strichart und Linienstärke als zweites Merkmal. Bestehende Farbzuordnungen (Sinus rot, Kosinus blau) bleiben. In Texten wird die Farbe einfach „orange“ genannt (nicht „rotorange“).

- Startseite, Themen- und Modulübersicht nutzen den Baustein `Kachel` (`src/components/Kachel.tsx`): Symbol in hellblauem Quadrat, Titel, kurzer Text, Fußzeile mit Pfeil, die ganze Fläche klickbar, beim Überfahren nur Rand und Schatten (keine Bewegung). Symbole liegen in `src/components/Symbole.tsx` (schlichte Linien-Symbole, dekorativ). Neue Themenbereiche erhalten ein Symbol über `themaSymbol`, sonst das Buch-Symbol, und eine Beschreibung in `content/themen.json`, damit die Kachel nicht leer wirkt.
- Seitenköpfe (Label in Großbuchstaben, großer Titel, Trennlinie) über die Klasse `seitenkopf`, Abschnittsüberschriften auf Übersichtsseiten über `bereichstitel`.
- Seitenleiste: Der Themenbereich ist die größte und fetteste Zeile (weiß, 1,15 rem, Trennlinie darunter), die Module stehen kleiner, normal gewichtet und eingerückt an einer dünnen Linie. „Kursstart“ und „Wiederholen und Üben“ sind Hauptpunkte und ebenfalls fett.
- Dieses Erscheinungsbild gilt als abgenommen (Oktober 2026). Änderungen daran nur auf Wunsch der Lehrkraft.
- Die Themenbereiche der Seitenleiste lassen sich auf- und zuklappen (Knopf mit `aria-expanded`, Pfeil, auch per Tastatur). Aufgeklappt sind das Thema der aktuellen Seite, das Thema des aktuellen Unterrichtsmoduls und ein einzelner Themenbereich. In jeder Gruppe steht als erster Punkt „Übersicht“ mit dem Link zur Themenseite. Nichts davon wird gespeichert.

## Entwürfe und Veröffentlichung

- Jedes Modul hat einen Status in `meta.json`: `entwurf` oder `freigegeben`.
- Der öffentliche Build enthält nur freigegebene Module. Verweist eine Kursdatei auf einen Entwurf, muss der Build fehlschlagen.
- Veröffentlicht wird nur, was ein veröffentlichter Kurs nennt: Kurse mit `"nurVorschau": true` (z. B. Testkurse) und freigegebene Module, die in keinem veröffentlichten Kurs stehen, fehlen im öffentlichen Build. Ein Kurs mit `nurVorschau` darf Entwürfe nennen.
- Module werden im Kurs je Themenbereich automatisch nummeriert (1., 2., ...), in der Reihenfolge der Kursdatei.
- Der Kurs `abitur-2027` ist der **Basiskurs**: Er enthält alle freigegebenen Module und ist die Grundlage für weitere Kurse. Ein neues Modul wird nach der Freigabe zuerst hier eingetragen. Andere Kurse verweisen nur per ID auf die Module, die sie brauchen, und legen ihre eigene Reihenfolge fest. Module werden nie in einen Kurs kopiert.
- Entwürfe liegen auf Branches nach dem Muster `entwurf/<modul-id>`. Deployments laufen ausschließlich von `main`.
- Ablauf: Entwurf erstellen, Tests, Vorschau an die Lehrkraft, Änderungen, ausdrückliche Freigabe im Chat, Status setzen und in `main` zusammenführen, Genehmigung des Deployments durch die Lehrkraft in GitHub (Umgebung `github-pages`), Live-Prüfung.
- Ohne ausdrückliche Freigabe der Lehrkraft nie nach `main` pushen, wenn dadurch Lerninhalte veröffentlicht würden.
- Dieses Repository ist öffentlich. Branches sind öffentlich lesbar. Nichts Vertrauliches committen.

## Prüfung vor der Vorschau

- Alle erwarteten Werte von Aufgaben werden in Tests numerisch gegen die Funktionen geprüft (auch über Ableitungen, wo sinnvoll). Tests nutzen eigene Testdaten statt echter Modulinhalte, wo möglich.
- Browserprüfung in der Vorschau: alle Abschnitte, Labor, mindestens eine Aufgabe mit richtigen Werten, Desktop und Handy, keine Formel- oder Konsolenfehler.
- Zusätzlich in der Browserprüfung: Breiten 320, 360, 390, 768 und 1100 px ohne waagerechtes Scrollen der Seite, kein Satzzeichen allein am Zeilenanfang, keine Formel mitten im Umbruch, wenn sie in die Zeile passt, jedes Schaubild hat Textalternative (`role="img"`, `aria-label`), alle Aufgaben mit richtigen und falschen Werten, alle Auswahlfragen durchprobiert, Labore bedient. Die Messskripte (Playwright, vorinstalliert) liegen nicht im Repository und werden bei Bedarf neu geschrieben.
- Erwartete Werte werden zusätzlich mit einer unabhängigen Nullstellensuche (Raster mit Bisektion) geprüft, nicht nur mit der Funktion, die die Werte erzeugt. Zahlen in Lösungswegen werden so gerundet, dass die Zwischenschritte stimmig rechnen (Dreistellen in Zwischenschritten).
- Die Vorschau wird als ZIP mit der einen HTML-Datei an die Lehrkraft geschickt.

## Veröffentlichung, Besonderheiten

- Die Live-Seite kann aus der Entwicklungsumgebung nicht abgerufen werden (github.io ist gesperrt). Die Lehrkraft genehmigt das Deployment in GitHub und prüft die Live-Seite selbst. Erst danach gilt die Veröffentlichung als geprüft.
- Nach einer Veröffentlichung werden die Entwurfsbranches des Moduls von der Lehrkraft in GitHub gelöscht. Bestehen bleiben `main` und `entwicklung/grundgeruest`.
- Nach dem Push nach `main` wird der Veröffentlichungslauf mit dem GitHub-Werkzeug abgefragt und der Link zum Lauf genannt. Die Lehrkraft genehmigt in GitHub (Actions, Lauf „Veröffentlichen“, „Review deployments“, Umgebung `github-pages`). Eine Veröffentlichung wird erst nach ihrer Live-Prüfung als erledigt gemeldet.
- Gibt es mehrere wartende Läufe, enthält der neueste alle früheren Änderungen.
- Jeder Push nach `main` startet den Veröffentlichungslauf, der auf die Genehmigung der Lehrkraft wartet. Reine Änderungen an Regeln oder Doku müssen nicht genehmigt werden.

## Datenschutz und Urheberrecht

- Keine personenbezogenen Schülerdaten verarbeiten oder speichern. Keine Trackingdienste, keine unnötigen Anfragen an Drittanbieter.
- Kursfreigaben sind keine Zugangskontrolle. Das nie als Schutz darstellen.
- Keine Verlagsmaterialien und keine fremden Arbeitsblätter ohne Nutzungsrechte hochladen.
- Links zu Notizbuch-Material nur setzen, wenn die Freigabe des Links geklärt ist, da diese Seite öffentlich ist.
- Datenschutzrelevante technische Entscheidungen der Lehrkraft gegenüber benennen. Das Gesamtkonzept ist vor dem Schuleinsatz gesondert zu prüfen.

## Arbeitsablauf bei neuen Modulen

1. Lernziel mit der Lehrkraft klären.
2. Didaktisch geeignete Lösung entwerfen.
3. Vorhandene Architektur und Komponenten verwenden.
4. Modul als Entwurf anlegen.
5. Mathematik und Technik prüfen.
6. Vorschau bereitstellen.
7. Erst nach Freigabe veröffentlichen.

## Struktur

```
content/themen.json                 Themenbereiche (zentral, kursunabhängig)
content/modules/<modul-id>/         meta.json (Status, Thema, Titel), index.tsx (Komponente)
courses/<kurs-id>.json              Kurskonfiguration (Themen, Module, aktuelles Modul)
build/                              Vite-Plugin: Modulregister, Entwurfsfilter, Seiten je Kurs, Vorschau-Datei
src/lib/                            Datenmodell, Validierung, Navigation, Formeldarstellung
src/components/                     wiederverwendbare Bausteine (Formel, Karte, Kachel, Symbole, Hinweis, Abzeichen, Modulverweis)
src/app/                            Router, Rahmen, Seiten
src/styles/app.css                  Gestaltungsstandards (Farben, Abstände)
tests/                              automatische Tests
docs/ENTWICKLUNG.md                 Entwicklungsdokumentation
.github/workflows/                  Veröffentlichung über GitHub Pages (nur von main, Genehmigung durch die Lehrkraft)
```

Befehle: `npm run check` (Typen und Tests), `npm run build` (öffentlicher Build in `dist/`, ohne Entwürfe), `npm run build:preview` (Vorschau als eine HTML-Datei in `vorschau/`, mit Entwürfen, nie veröffentlichen).
