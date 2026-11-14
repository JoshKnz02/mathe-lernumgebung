# Entwicklungsdokumentation

Technik, Tests, Daten und Arbeitsweise. Den aktuellen Stand und die offenen Punkte nennt `docs/STAND.md`. Die Modulhistorie (Aufbau, Entscheidungen, gemeldete Unstimmigkeiten je Modul) steht in `docs/themen/`: `funktionen.md` (Trigonometrie, Zusammengesetzte Funktionen), `differentialrechnung.md`, `integralrechnung.md`, `lgs.md`, `vektorgeometrie.md` (Übersicht, Unterbereiche, Regeln für alle Module), `vektoren.md`, `geraden.md`, `ebenen.md`. Dauerhafte Regeln stehen in `CLAUDE.md`, `docs/FACHREGELN.md` und `docs/ARBEITSWEISE.md`, Überholtes in `docs/archiv.md`.

## Sitzungsstart

1. `CLAUDE.md` und diese Datei lesen, insbesondere „Stand“ und „Arbeitsweise in Sitzungen“.
2. `git fetch origin main`, Entwurfsbranch von `origin/main` anlegen (`entwurf/<modul-id>` bzw. `entwurf/<thema>`), `npm ci`, `npm run check` als Ausgangspunkt (alle Tests müssen grün sein).
3. Unterlagen der Lehrkraft aus dem Chat lesen: Word-Dateien mit `pandoc <datei>.docx -t plain --wrap=none` (Tabellen und Formeln sind unordentlich, Bilder liegen unter `word/media` und müssen einzeln angesehen werden), PDFs mit `pdftotext -layout` und, wo Bilder wichtig sind, seitenweise ansehen. Entpackt wird nur in eigene Ordner im Scratchpad, nie ins Repository.
3a. Der Sitzungsbranch kann veraltet sein (zum Beispiel `entwicklung/grundgeruest` mit nur dem Grundgerüst): nie dem Stand in der Sitzungsnachricht oder dem Branch glauben, sondern `git fetch origin` und `origin/main` prüfen (Module, Kurse, Doku). Platzhalter wie „[noch nicht / bestätigt]“ in der Nachricht werden nicht geraten: Soweit prüfbar (Branches mit `git ls-remote --heads origin`) wird der Stand belegt gemeldet, sonst als ungeklärt geführt.
4. Nach jeder Änderung `npm run check`, `npm run build:preview`, Browserprüfung (siehe CLAUDE.md), Vorschau als ZIP an die Lehrkraft schicken, auf ausdrückliche Freigabe warten.

## Design der Übersichtsseiten

Die Startseite, die Kursstartseite, die Themenseiten und die Modulübersicht verwenden den Baustein `Kachel` (Symbol, Titel mit Link über die ganze Fläche, Text, Fußzeile mit Pfeil). Das Fokusfeld liegt um die ganze Kachel (`:has(.kachel-link:focus-visible)`), der Hover ändert nur Rand und Schatten. Die Symbole stehen in `src/components/Symbole.tsx` und werden über `themaSymbol(themaId)` zugeordnet. Die Kachel zu einem Modul zeigt die Zahl der Abschnitte, die zu einem Themenbereich die Zahl der Module. Der Kursstart zeigt das aktuelle Unterrichtsthema als helle blaue Karte (`aktuell-karte`).

Die Seitenleiste (`KursNavigationsleiste` in `src/app/AppInhalt.tsx`) trennt zwei Ebenen: Themenbereich als Überschrift (`nav-ueberschrift`, 1,15 rem, fett, weiß), Module darunter eingerückt (`nav-gruppe > .nav-liste`, 0,93 rem). „Kursstart“ und „Wiederholen und Üben“ tragen die Klasse `nav-haupt`. Die Themenbereiche der Seitenleiste klappen auf und zu (`nav-umschalter`, Zustand im Arbeitsspeicher der Komponente `KursNavigationsleiste`, keine Speicherung). Anfangs offen sind das Thema der aktuellen Seite, das Thema des aktuellen Unterrichtsmoduls und ein einzelner Themenbereich. Beim Wechsel zu einer Seite eines Themas öffnet sich dessen Gruppe wieder, von Hand zugeklappte Gruppen bleiben sonst zu. Der erste Punkt jeder Gruppe, „Übersicht“, führt zur Themenseite. `tests/seitenleiste.test.tsx` prüft das mit dem Testdatensatz (zwei Themenbereiche). Das gesamte Styling steht am Ende von `src/styles/app.css` im Abschnitt „Startseite und Kacheln“.

## Zeilenumbrüche bei Formeln

Formeln im Fließtext sind unteilbare Einheiten (`display: inline-block; max-width: 100%`): Sie stehen in einer Zeile, wenn sie hineinpassen, und brechen nur um, wenn sie breiter sind als die Zeile. Ein Satzzeichen direkt hinter einer Inline-Formel wird mit dem Attribut `nach` an die Formel gebunden, zum Beispiel `<Formel tex="a" nach="," />`. Der Baustein erzeugt dann eine Einheit ohne Umbruchstelle (`.formel-mit-zeichen`), sodass das Komma nie allein am Zeilenanfang steht. `tests/formel-satzzeichen.test.tsx` liest alle Modulquelltexte und schlägt fehl, wenn hinter einer Inline-Formel im Text ein ungebundenes Satzzeichen steht. Bei der Browserprüfung werden Umbrüche bei 320 px Breite kontrolliert.

## Merkregel: anschaulich zusätzlich zum Text

Immer wenn eine anschauliche Lösungsmöglichkeit möglich und sinnvoll ist (Schaubild mit eingezeichneten Strecken, Punkten und Beschriftungen, Farben, Skizze, bei Bedarf umschaltbar oder mit Reglern), wird sie zusätzlich zum erklärenden Text eingebaut. Das gilt für Erklärungen, Beobachtungen im Entdecken, Lösungswege und die Zusammenfassung. Die Zeichnung muss zur Rechnung passen und wird im Test geprüft. In klappbaren Beobachtungen wird ein Bild erst beim Aufklappen erzeugt. Die Regel steht auch in `CLAUDE.md` (Abschnitt Didaktik).

## Überblick

Die Lernumgebung ist eine statische Website (React, TypeScript, Vite). Es gibt keinen Server und keine Datenbank. Alle Inhalte liegen als Dateien im Repository. Formeln werden mit KaTeX lokal dargestellt, es werden keine Schriften oder Skripte von Drittanbietern geladen.

Drei Dinge sind getrennt:

| Was | Wo |
| --- | --- |
| Lerninhalt eines Moduls | `content/modules/<modul-id>/` |
| Welcher Kurs was sieht | `courses/<kurs-id>.json` |
| Darstellung und Bedienung | `src/` |

## Befehle

| Befehl | Wirkung |
| --- | --- |
| `npm install` | Abhängigkeiten installieren |
| `npm run dev` | lokale Entwicklung mit Entwürfen |
| `npm run check` | Typprüfung und alle Tests |
| `npm run build` | öffentlicher Build nach `dist/` (ohne Entwürfe) |
| `npm run build:preview` | Vorschau als eine Datei: `vorschau/mathe-lernumgebung-vorschau.html` (mit Entwürfen) |

Die Vorschau-Datei lässt sich per Doppelklick im Browser öffnen. Sie enthält Entwürfe und darf nicht veröffentlicht werden. Der Ordner `vorschau/` ist deshalb von Git ausgeschlossen.

Die Tests verwenden einen eigenen Testdatensatz (`tests/hilfen.ts`), nicht die echten Inhalte. Echte Inhalte werden nur geprüft, wo es um deren Veröffentlichung oder Schreibweise geht.

## Daten

### Themenbereiche: `content/themen.json`

Liste von `{ id, titel, beschreibung? }`. Die Reihenfolge in der Datei ist die Standardreihenfolge. Die Liste folgt der Themenstruktur für Klasse 12 und 13.

### Module: `content/modules/<modul-id>/`

`meta.json`:

```json
{
  "id": "einheitskreis-sinus-kosinus",
  "titel": "Vom Einheitskreis zu Sinus- und Kosinusfunktion",
  "thema": "trigonometrische-funktionen",
  "status": "freigegeben",
  "beschreibung": "Kurzbeschreibung für die Kartenansicht.",
  "prinzipien": ["erklaeren", "entdecken", "ueberpruefen"],
  "bpe": ["10.1"]
}
```

- `id` entspricht dem Ordnernamen und wird nie umbenannt.
- `status` ist `entwurf` oder `freigegeben`.
- `thema` verweist auf eine Themen-ID. Ein Modul gehört genau einem Thema. Ein anderes Thema wird hier geändert, nicht im Kurs.
- `prinzipien` und `bpe` sind optional (Bildungsplanbezug nur als Metadatum).

Optional teilt `"abschnitte": [{ "id": "erklaeren", "titel": "Erklären" }, ...]` ein Modul in Abschnitte. Die Modulseite zeigt dann eine Abschnittsleiste, in der Kursnavigation erscheint unter dem geöffneten Modul ein Untermenü, und am Ende eines Abschnitts steht ein „Weiter"-Knopf. Jeder Abschnitt hat eine eigene Adresse (`/kurs/<kurs>/modul/<modul>/<abschnitt>/`). Ohne Angabe wird der erste Abschnitt gezeigt, eine unbekannte Abschnitts-ID führt zur Fehlerseite. Module ohne `abschnitte` werden als Ganzes gezeigt.

`index.tsx` exportiert die Modulkomponente als `default`. Bei Modulen mit Abschnitten steht jeder Abschnitt in einem `<Abschnitt id="..." titel="...">` aus `src/components/Abschnitt`. Die IDs entsprechen denen in `meta.json` (ein Test prüft das). Bausteine aus `src/components` (Auswahl, siehe das Verzeichnis für alle): `Formel`, `Hinweis`, `Karte`, `Abzeichen`, `Messbild` mit `Bild` und `Kontrollschaubild` (statische Schaubilder), `Paarbild` und `Dreierbild` (K_f, K_f′, K_f″ übereinander), `Beobachtung`, `Rechenkette`, `Modulverweis`, `IchKann`, `Zeichenbrett` (JSXGraph-Grundlage mit Achsen und Gitter, dynamische Zeichnungen), `Funktionsgraph` und `Einheitskreis` (beide darauf aufgebaut), `Regler` (Schieberegler), `Aufgabe` (Zahleneingaben mit automatischer Rückmeldung, gestuften Hilfen und schrittweiser Lösung), `Auswahlfrage` (genau eine richtige Antwort, Rückmeldung zur gewählten Antwort, Erklärung auf Klick), `AufKlick` (zeigt Inhalt erst nach Klick, z. B. ein Schaubild als Kontrolle). Formeln werden als TeX geschrieben: `<Formel anzeige tex={String.raw`f(x)=\sin x`} />`.

### Kurse: `courses/<kurs-id>.json`

```json
{
  "id": "abitur-2028",
  "titel": "Abitur 2028",
  "themen": ["trigonometrische-funktionen"],
  "module": ["einheitskreis-sinus-kosinus"],
  "aktuellesModul": null
}
```

- `themen`: sichtbare Themenbereiche, in Anzeigereihenfolge.
- `module`: freigegebene Module, in Anzeigereihenfolge. Die Gruppierung nach Thema ergibt sich aus `meta.json`.
- `aktuellesModul`: aktuelles Unterrichtsthema oder `null`. Muss in `module` stehen.
- `nurVorschau` (optional): `true` für Kurse, die es nur in Vorschau und Entwicklung gibt (z. B. Testkurse). Solche Kurse dürfen Entwürfe nennen und fehlen im öffentlichen Build.
- Die Module werden im Kurs je Themenbereich automatisch nummeriert (1., 2., ...), in der Reihenfolge von `module`.
- Nicht aufgeführte Themen und Module erscheinen für den Kurs nirgends, auch nicht ausgegraut.

Basiskurs: `courses/abitur-2027.json` enthält alle freigegebenen Module in der Grundreihenfolge. Weitere Kurse entstehen, indem man diese Datei als Vorlage nimmt (Modul- und Themenliste übernehmen, ID und Titel ändern, Reihenfolge und Auswahl anpassen). Jedes Modul existiert weiterhin nur einmal.

Beispiele für typische Anweisungen:

- Modul für einen Kurs freigeben: Modul-ID in `module` des Kurses eintragen (und sein Thema in `themen`).
- Aktuelles Thema wechseln: `aktuellesModul` ändern.
- Neuen Kurs anlegen: neue Datei in `courses/`, Modul- und Themenlisten übernehmen.


## Validierung

Beim Start jedes Builds werden alle Dateien geprüft (`src/lib/validierung.ts`). Der Build bricht mit einer verständlichen Fehlermeldung ab bei:

- unbekannten Themen oder Modulen in Kursen, doppelten IDs, ID passt nicht zu Ordner- oder Dateiname
- fehlender `index.tsx`, ungültigem Status
- einem Modul, dessen Thema im Kurs nicht sichtbar ist, oder einem sichtbaren Thema ohne Modul
- `aktuellesModul` außerhalb der Modulliste
- einem Unterbereich in `meta.json`, den das Thema in `content/themen.json` nicht kennt, doppelten oder ungültigen Unterbereichs-IDs
- **im öffentlichen Build zusätzlich:** Verweis eines Kurses auf ein Modul mit Status `entwurf`

## Build-Modi und Entwürfe

Das Vite-Plugin (`build/plugin.ts`) stellt das Modulregister als virtuelles Modul `virtual:lernumgebung` bereit.

- `npm run build` (Modus `production`): Es gibt nur die Kurse ohne `nurVorschau` und nur deren freigegebene Module. Entwürfe, nicht verwendete Module und Kurse mit `nurVorschau` fehlen vollständig, weder Metadaten noch Code noch Seiten tauchen im Ergebnis auf. Die Startseite listet keine Kurse. Die Modulbibliothek ist nicht erreichbar.
- `npm run build:preview` und `npm run dev`: Entwürfe sind enthalten, die Startseite listet die Kurse und den automatisch erzeugten Kurs „Vorschau: alle Module“ (alle Module inkl. Entwürfen, in der Reihenfolge der echten Kurse, Entwürfe ohne Kurs danach, nicht als Datei, nie im öffentlichen Build), das Band nennt Branch, Commit und Bauzeit, es gibt eine Modulbibliothek (`/bibliothek`) mit allen Modulen samt Status. Ein Band kennzeichnet die Ansicht als Vorschau.

Entwurfsablauf: Entwurf auf einem Branch `entwurf/<modul-id>` anlegen (Status `entwurf`), Vorschau bauen, nach Freigabe Status auf `freigegeben` setzen, den Kurs auf das Modul verweisen lassen und in `main` zusammenführen. Solange ein Kurs ein Modul mit Status `entwurf` nennt, lässt sich der öffentliche Build nicht erzeugen.

## Aufgaben und Eingaben

Der Baustein `Aufgabe` wertet Zahleneingaben mit `src/lib/eingabe.ts` aus. Erlaubt sind Dezimalzahlen mit Komma oder Punkt, Brüche und Vielfache von π (`1,5`, `1/2`, `pi/4`, `3π/4`). Für gerundete Dezimalwerte kann je Feld eine absolute Toleranz angegeben werden. Eingaben und Ergebnisse bleiben im Browser, nichts wird gespeichert oder gesendet.

Rechenlogik der allgemeinen Sinus- und Kosinusfunktion (Funktionsterm in TeX mit runden oder eckigen Klammern, Kennwerte, Referenzpunkt der Skizzierregel) liegt in `src/lib/sinus.ts`. Die erwarteten Werte der Aufgaben stehen in `content/modules/lage-im-koordinatensystem/daten.ts` und werden in `tests/lage-modul.test.tsx` numerisch gegen die Funktionen geprüft.

Die markanten Punkte (Hoch-, Tief-, Wendepunkte im Viertelperioden-Raster, für b > 0 und beliebiges Vorzeichen von a) berechnet `src/lib/markante.ts`. Die erwarteten Werte des Moduls `markante-punkte` stehen in dessen `daten.ts` und werden in `tests/markante-modul.test.tsx` geprüft, die Logik selbst in `tests/markante.test.ts` (unter anderem gegen die Ableitung).

Die Lösungen trigonometrischer Gleichungen a · sin(b(x − c)) + d = e (und Kosinus, b > 0) in einem Intervall berechnet `src/lib/gleichungen.ts` nach dem Unterrichtsverfahren (Hilfsgröße z = b(x − c), z1 vom Taschenrechner, z2 = π − z1 bzw. −z1, Vielfache von 2π, Rücksubstitution). Die Aufgabenwerte des Moduls `trigonometrische-gleichungen` stehen in dessen `daten.ts`. `tests/gleichungen.test.ts` prüft die Logik gegen ein unabhängiges Nullstellenverfahren (Raster mit Bisektion, 300 Zufallsgleichungen), `tests/gleichungen-modul.test.tsx` die Aufgabenwerte, die Auswahlfragen und die Darstellung.

Beschriftete Schaubilder zur anschaulichen Erklärung (Strecken, Punkte, Texte) zeichnet der Baustein `Abstandsbild` im Modul `trigonometrische-gleichungen`. Seine Daten liegen in `bilder.ts` und werden in `tests/gleichungen-modul.test.tsx` gegen die Rechnung geprüft (gleich lange Strecken, Punkte auf der Kurve). In klappbaren Beobachtungen wird ein Bild erst beim Aufklappen erzeugt, weil ein verstecktes Schaubild keine Größe hat. `Parameterlabor` untersucht die Anzahl der Lösungen von 0 = t · sin(x) + 3.

### Modul `modellieren-geraden` (BPE 16.7), freigegeben (07.11.2026)

Ein Modul mit zwei Teilen (Entscheidung der Lehrkraft): Bewegung und Schatten. Abschnitte: Erklären, Entdecken: Bewegung, Entdecken: Schatten, Überprüfen (12 Aufgaben, Überschriften „Teil Bewegung“ und „Teil Schatten“), Zusammenfassung. Vorlagen waren zwei Blätter der Lehrkraft (Flugbahnen und Abstände, Schattenwurf). Alle Szenarien, Zahlen und Aufgaben sind frei geschrieben, ein Test prüft, dass die Zahlen der Blätter nicht vorkommen (`VERBOTEN_SPALTEN`).

Entscheidungen der Lehrkraft: kein Flächeninhalt im Modul; statt der Pyramide ein Tetraeder (Eckenvergleich, kein Allgemeinbeweis); Kontrollbilder bei Aufgaben mit Bild.

Technik: `src/lib/bewegung.ts` (Geschwindigkeit, Ort, Kollision, kleinster Abstand über d(t)² = a t² + b t + c, bei Scheitel vor 0 Minimum am Rand), `src/lib/projektion.ts` (Parallel- und Zentralprojektion auf eine Ebene, begrenzte Wand, `ersterTreffer`), Rechenhilfen aus `content/modules/modellieren-geraden/rechenhilfen.ts`. In `src/lib/geradenhilfen.ts` liegen jetzt gemeinsam `Zeilen`, `zeilenFormel`, `rund2`, `rundN`, `quadratzahl`, `wurzelTeX`, `betragZeilen` und `polyTeX` (aus `schnittwinkel-geraden` und `abstaende-geraden` hierhin verschoben, deren Module re-exportieren, Tests unverändert grün).

Gemeldete Unstimmigkeit im Blatt: ein Zeitwert lautet richtig 31/3 statt 53/3.

Überarbeitung nach der ersten Vorschau (Wunsch der Lehrkraft): Der Schatten fällt jetzt immer auf den **Boden** (x₃ = 0), nicht mehr auf eine Wand. Der Gegenstand ist eine über dem Boden schwebende Platte (Ecken in Höhe 1 bis 3) bzw. ein Tetraeder auf dem Boden, der Schatten steht **rosa gestrichelt** im Bild (Strahlen orange, Gegenstand schwarz, durchgezogen), beide Lichtarten (Parallelprojektion mit t = x₃ durch minus v₃, Zentralprojektion mit s = L₃ durch (L₃ minus X₃)) mit je einem Beispiel. Die begrenzte Wand und der Vergleich Wand und Boden entfallen, im Labor ersetzt die Untersuchung „v₃ = 0 und v₃ > 0“ (kein Schatten, negatives t) die begrenzte Wand. Aufgabe 11 (Tetraeder) fragt jetzt nach t, S′ und der Zahl der Ecken des Schattenumrisses (Hülle von A, B, C, S′, `konvexeHuelle` in `src/lib/projektion.ts`, im Test unabhängig über Flächeninhalte geprüft). `ersterTreffer` und `Flaeche` bleiben in `projektion.ts` (getestet, vom Modul nicht mehr benutzt). Schattenpunkte im Bild liegen im Schrägbild nie auf einer Achse (p₂ ≠ 0, p₁ ≠ 0, p₂ ≠ p₁/2), die Zahlen wurden mit einer Suche und den Bildtests ausgewählt.

Zweite Überarbeitung (Wunsch der Lehrkraft, die zwei GeoGebra-Seiten waren von hier nicht abrufbar, `geogebra.org` ist gesperrt, das Haus ist frei nachgebaut): Das durchgehende Beispiel in Erklären, Entdecken, Labor und Zusammenfassung ist ein **Haus mit Satteldach** (Quader mit Traufhöhe 1 und Firsthöhe 2, eine Längeneinheit sind 3 Meter, `HAUS` und `hausPunkte` in `daten.ts`, 17 Kanten, `hausBild` in `Bilder.tsx`). Sonne (v = (1 | 0 | −1)) und Straßenlaterne (L(−3 | 0 | 4)) zeigen Parallel- und Zentralprojektion im Alltag. Verfolgt werden die Dachspitzen P und Q (Enden des Firsts) und die Traufecke R. Der Schatten ist der gestrichelte Umriss (Hülle der Schattenpunkte aller zehn Ecken) und der gestrichelte Schatten des Firsts, er wird nur gezeichnet, wenn alle Schattenpunkte im Koordinatensystem liegen. Neue Beobachtung: Der First liegt parallel zum Boden, sein Schatten ist bei der Sonne genauso lang wie der First, bei der Laterne s-mal so lang. Die Aufgaben 8 bis 12 bleiben bei Dreieck, Tetraeder und Mast (Abwechslung). Zahlen per Suche mit den Bildtests gewählt (Beschriftungsabstand mindestens 0,016, nichts auf einer Achse, Schatten deutlich neben dem Haus).

Dritte Überarbeitung (Wunsch der Lehrkraft: „exakt so nachbauen wie in der GeoGebra-Datei“): Die zwei GeoGebra-Beispiele (`geogebra.org/m/wdvjhuxg` Parallelprojektion, `geogebra.org/m/bkum4vsn` Zentralprojektion) wurden über die Material-Schnittstelle gelesen (dafür wurden `www.geogebra.org`, `api.geogebra.org`, `geogebra.org` in der Umgebung freigegeben) und die Konstruktion aus `geogebra.xml` ausgewertet: Quader mit Pyramidendach (Grundfläche 2 × 4, Wandhöhe 2, Spitze bei 3,417), senkrechte Wand x = −4, Lichtpunkt J, Strahlen durch E, F, G, H, I, Schatten als zwei graue Flächen (Wand: Hülle der fünf Schnittpunkte, Boden: Hülle der Grundfläche und der Fußpunkte der Wandpunkte von E bis H). Das Modul bildet das nach, mit eigenen Zahlen im Gitter von −4 bis 4: Haus mit Grundecken A(−1 | −3 | 0), B(1 | −3 | 0), C(1 | −1 | 0), D(−1 | −1 | 0), Traufecken E bis H in Höhe 2, Dachspitze I(0 | −2 | 3), Wand x₂ = −4, Sonne v = (1 | −2 | −1), Lampe J(−1 | 2 | 4). Neue gemeinsame Bausteine, abwärtskompatibel und standardmäßig aus: `RaumBildSpec.flaechen` (gefüllte, durchsichtige Flächen im Schrägbild und in der räumlichen Ansicht), `schnittMitEbene`, `parallelSchatten` und `zentralSchatten` mit Ebene x_k = c (Parameter `c`, Standard 0). Die GeoGebra-Konstruktion zeichnet den Wandschatten auch unter dem Boden, wenn Strahlen vorher den Boden treffen (z < 0): Im Modul wird der Schatten nur gezeichnet, wenn alle fünf Schattenpunkte im Bild über dem Boden liegen, sonst steht ein Hinweis. Die Aufgaben 8 bis 12 bleiben bei Dreieck, Tetraeder und Mast auf dem Boden. Ältere Fassungen mit Platte und Wand bzw. Haus mit Satteldach sind ersetzt, die Entscheidungen davor (Boden, gestrichelter Schatten) gelten für die Aufgaben weiter.

Vierte Überarbeitung (Wunsch der Lehrkraft): Die Wand steht bei x₂ = −6, die x₂-Achse und die Ebenen x₁x₂ und x₂x₃ reichen in diesem Bild bis −7 (neue Option `RaumBildSpec.x2Min`, `raumBereichFuer` vergrößert den Bildbereich und hält ihn quadratisch, in Schrägbild und räumlicher Ansicht, abwärtskompatibel, die Bilder der freigegebenen Module bleiben unverändert). Damit kommen Sonnenstrahlen und Lampenstrahlen auf dem Boden an: Der Schatten wird physikalisch genau berechnet (`erstesZiel`, `schattenFlaechen`, `schneideHalbebene` in `src/lib/projektion.ts`): Ein Strahl trifft zuerst die Fläche mit dem kleineren Parameter. Wandschatten = Hülle der Wandpunkte aller Ecken, bei x₃ = 0 abgeschnitten, er reicht bis zum Boden. Bodenschatten = Hülle der Bodenpunkte aller Ecken, bei x₂ = −6 abgeschnitten. Beispielzahlen: Sonne v = (0 | −2 | −1), Lampe J(0 | 2 | 4), E und I werfen auf die Wand, G auf den Boden (der rechnerische Wandpunkt läge unter dem Boden, das steht im Entdecken). Der Wandschatten wird nur gezeichnet, wenn alle Ecken die Wand erreichen und der Schatten im Bild liegt, sonst steht ein Hinweis (die GeoGebra-Konstruktion zeichnet den Wandschatten auch unter dem Boden). Das Labor erlaubt v₂ von −4 bis 1, v₃ von −2 bis 0 und die Lampe J₁ −3 bis 3, J₂ 0 bis 4, J₃ 3 bis 4.

Offene Punkte für die Übergabe: Vektorzeilen in der schmalen Box der Lösungsschritte (320 und 360 px) scrollen innen (bekannte Ausnahme der Umbruchregel), dieselben Zeilen auch in Entdecken und Zusammenfassung; Geradengleichungen brechen vor „+ t · v“; die Tempi und Szenarien (Hubschrauber, Ballon) sind frei erfunden und nicht realistisch kalibriert; am echten Handy nicht geprüft, nur Emulation bei 320 bis 1100 px.

Browserprüfung (Stand der Vorschau): alle fünf Abschnitte bei 320, 360, 390, 768 und 1100 px ohne Formel- oder Konsolenfehler, jedes Bild mit Textalternative; beide Labore mit allen Reglern, Schaltern und Lichtarten bedient; alle Aufgaben mit richtigen und falschen Werten, alle Auswahlfragen durchprobiert (richtige Antwort wechselt die Stelle); Bilder als Montage angesehen.


### Modul `uebungsaufgaben-geraden` (BPE 16.1, 16.2, 16.6 Teil, 16.7), freigegeben (07.11.2026)

Siebtes und letztes Modul des Unterbereichs Geraden, nach der Anweisung „baue das Modul“ (07.11.2026) mit drei Beispieldokumenten der Lehrkraft gebaut: `2024_Abituraufgaben_gAN.docx` (Abitur 2024, Aufgaben nur als Bilder), `IQB_Aufgaben_einschlie_lich_Geraden.docx` (zwölf Aufgaben der IQB-Sammlung, Bilder) und `IQB_Geraden_Musterloesungen.docx` (Text). Alles ist Original und dient nur als Vorlage für Aufgabentypen und Niveau, kein Szenario, keine Zahl und keine Abwandlung mit anderen Zahlen ist im Repository (Test: Punkte und Spalten der Sammlung, Stichwörter Zylinder, Theaterkulisse, Pyramide, Regenwald, Prisma, Schacht, Raute). Das Blatt „Problemlöseaufgabe Schwerpunkt im Dreieck“ lag diesmal nicht bei, der Problemlöse-Abschnitt ist frei geschrieben (eigenes Dreieck, eigene Zahlen, eigenes Bild).

Aufbau (vier Abschnitte, Vorbild `uebungsaufgaben-vektoren`): Aufbau und Operatoren (Stoff-Tabelle mit Modulverweisen), Ohne Hilfsmittel (sechs Aufgaben zu je 5 BE, nur ganze Zahlen als Ergebnisse: 1 Punktprobe und Punkte mit Abstand 6 auf einer Geraden, 2 besondere Lage und Spurpunkt, 3 Geradenschar mit Punkt auf allen Geraden und orthogonalen Richtungen, 4 Schnittpunkt mit Parameter a, 5 Lotfußpunkt, Abstand und Spiegelpunkt, 6 Winkel 45° zur x₁x₂-Ebene), Mit Hilfsmittel (drei Aufgaben mit Bild und aufklappbarem Kontrollbild: 7 zwei Drohnen mit Geschwindigkeitsvektor, Schnittpunkt der Bahnen, Zeiten bis S, kleinstem Abstand, 12 BE; 8 Fahnenmast mit Sonnenstrahl, Gartenmauer und Boden, Schattenpunkt über der Mauerkante, Winkel zum Boden, Länge des Bodenschattens, 10 BE; 9 Seilbahn mit Länge, Steigungswinkel, Stützenhöhe und Abstand eines Aussichtspunkts auf beiden Wegen, 12 BE), Problemlösen (Aufgabe 10 Schwerpunkt im Dreieck in fünf Schritten, 10 BE: Seitenhalbierende als Geraden, Schnittpunkt, Verhältnis 2 : 1, dritte Seitenhalbierende, allgemeiner Beweis mit Ortsvektoren). Aufgaben ohne Eingabefeld (Zeigen, Erläutern, Untersuchen) stehen als Teilaufgaben in `Aufgabe` mit Lösungsweg, die Felder prüfen nur die Zahlen.

Aufgabentypen der Sammlung, die nicht in diesem Modul stehen: Zylinder, Parallelogramm, Prisma, Quadrat, Raute und Projektion gehören zu den Vektoren (dort bereits in `uebungsaufgaben-vektoren`), die Gleichungssysteme mit Parameter (IQB 11 und 12) zu den LGS-Modulen, und Ebene E, Spurpunkt der Ebene, Pyramide mit Schacht und Gerade und Ebene sind für den Unterbereich Ebenen vorgemerkt. Die Musterlösungen der IQB-Aufgaben (Text) wurden durchgesehen und nachgerechnet, es sind keine Fehler aufgefallen (Aufgaben 1 bis 12, auch die Zahlen in 3b, 5b, 6a, 9, 11 und 12). Die Lösungen der Abituraufgaben 2024 liegen nur als Bilder vor und wurden nicht Zeile für Zeile nachgerechnet.

Technik: `Bilder.tsx` hat vier Raumbilder mit Kontrollversion (`raumDrohnen`, `raumMast`, `raumSeilbahn`, `raumDreieck`), alle in der feinen Darstellung, mit Daten aus `daten.ts`. Die Zahlen wurden mit einer Suche und dem Beschriftungstest gewählt. Wichtig: Geraden im Schrägbild dürfen nicht parallel zu einem Achsenbild erscheinen (Bildrichtung (u₂ − u₁/2 | u₃ − u₁/2) mindestens 1,5 lang, Winkel zu den Achsenbildern mindestens 11°), der Modultest prüft das jetzt auch (die erste Fassung hatte senkrechte und waagerechte Bahnen). Der Test rechnet jede Aufgabe unabhängig nach (Suchen über Parameter, Raster für den kleinsten Abstand, Vektorprodukt als zweiter Weg) und prüft, dass die Lösungswege dieselben Zahlen nennen wie die Felder. Lösungsschritte stehen in kurzen Zeilen (höchstens 44 Zeichen, Umbruch nur vor dem Gleichheitszeichen), Vektorzeilen scrollen bei 320 und 360 px innen (bekannte Ausnahme). Drohnen und Seilbahn nutzen Einheiten km bzw. 100 m, Tempo und Szenarien sind frei gewählt.

### Modul `ich-kann-liste-zusammengesetzte-funktionen`

Abschnitte: Anleitung, Verknüpfung, Verkettung, Umkehrfunktion, Auswertung. Grundlage ist die Liste der Lehrkraft (2023, zehn Aussagen). Aussage 11 (Wurzelfunktion und natürlicher Logarithmus als Umkehrfunktionen deuten) ist nach dem Bildungsplan ergänzt und gekennzeichnet. Jede Aussage hat Selbsteinschätzung (++, 00, −−), Kontrollaufgabe mit eigenen Zahlen (nicht die der Arbeitsblätter), Hilfen, Lösungsweg mit Schaubild und Verweise auf die Module. Die Auswertung ordnet nach Dringlichkeit. Nichts wird gespeichert.

Technik: Die Logik der Liste der Trigonometrie wurde allgemein gemacht und liegt jetzt in `src/lib/ichkann.ts` (Aussage, Wahl, Sortierung nach Dringlichkeit, Zählung) und `src/components/IchKann.tsx` (Zustand, Punkt, Auswertung). Das Modul `ich-kann-liste` verwendet sie über schmale Hüllen (`auswertung.ts`, `Zustand.tsx`, `Punkt.tsx`), sein Verhalten und seine Tests sind unverändert. Werte und Aussagen des neuen Moduls stehen in `daten.ts`. Test: `tests/ich-kann-liste-zusammengesetzte-modul.test.tsx` (Aussagen, Verweise auf vorhandene Abschnitte, Abschnitte, Auswahlfragen, Aufgabenwerte gegen unabhängige Nullstellensuche, Ableitungen und Symmetrieproben).

Gemeldete Lücken und Unstimmigkeiten in der Liste der Lehrkraft: Aussage 3 („globales Verhalten“) und 6 (Nullstellen eines Produkts mit e^x − c, also ln) setzen e^x und ln voraus, die in Modul 1 nicht eingeführt werden. Aussage 8 („Zerlegen“) kommt im Modul 2 nur mit einfachen äußeren Funktionen vor, das Modul fragt hier Terme mit Parametern ab (3 sin(2x + 1) − 1). Aussage 2 und 9 haben im Bildungsplan keine eigene Entsprechung, sie sind dem Entdecken der Module 1 und 3 zugeordnet. Das Modul „Gemischte Aufgaben“ (Venn-Diagramm) ist noch nicht gebaut. Offen: Bestätigung der Lehrkraft, dass e^x als bekannt gilt.

### Modul `gemischte-aufgaben-zusammengesetzte-funktionen`

Abschnitte: Vorgehen, Venn-Diagramm, Weitere Aufgaben, Zusammenfassung (Modul ohne neuen Stoff, eigene Abschnitte). Vorbild ist ein Problemlöse-Arbeitsblatt zu einem Venn-Diagramm mit drei Eigenschaften (Hinweis der Lehrkraft: Material eines Verlags, daher kein Text, kein Logo, keine Formulierung und kein Diagramm übernommen). Aufgabenidee, Mengen und Beispiele sind eigen: Die drei Mengen sind umkehrbar (U), achsensymmetrisch zur y-Achse (S) und verkettet mit nichtlinearer innerer Funktion (V). Dadurch sind die Regionen D (U und S) und G (alle drei) leer, weil eine achsensymmetrische Funktion jeden Wert zweimal annimmt. Das ist der Kern der Begründungsaufgabe. Grundfunktionen, lineare innere Funktionen sowie Summen und Produkte zählen nicht als Verkettung (steht im Abschnitt Vorgehen).

Technik: `VennBild.tsx` zeichnet das Diagramm als SVG (Farben blau durchgezogen, orange gestrichelt, grün gepunktet), hebt eine Region per Maske hervor und setzt die Buchstaben automatisch an den Ort mit größtem Randabstand. `Pruefer.tsx` zeigt für sieben Funktionen K_f mit waagerechter Geraden, die drei Eigenschaften mit Begründung und die Region. `daten.ts` enthält Funktionen, Merkmale, Regionen und die Zahlen der Aufgaben W1 bis W3. Test: `tests/gemischte-aufgaben-modul.test.tsx` (Merkmale gegen Monotonie und Symmetrie auf dem Raster, Schnittzahl der Geraden, Lage der Buchstaben, Aufgabenwerte, Textalternativen).

Offen: Nutzungsrechte sind nicht betroffen, solange das Material des Verlags nicht übernommen wird. Ob die Eigenschaften (Mengen) der Lehrkraft so passen, ist mit ihr abzustimmen.

### Modul `ableitungsregeln`

Abschnitte: Erklären (Ableitung an einer Stelle und Ableitungsfunktion, Schreibweisen f′, f″, Parameter, Wurzeln und Brüche als Potenzen, Tabelle der Größen und ihrer Änderungsraten), Entdecken (zwei Vermutungsfragen, Tabelle mit zehn Funktionen und ihren Ableitungen, Aufträge zu Potenz-, Konstanten-, Summen- und Faktorregel, Wurzeln und Brüche mit Ableitungslabor, Exponentialfunktionen mit Exponentiallabor, Sinus und Kosinus mit Ableitungslabor, Kreislauf der Ableitungen), Überprüfen (17 Aufgaben und Fragen), Zusammenfassung (Regeltabelle, Vorgehen, typische Fehler, Ausblick auf Produkt- und Kettenregel). Produkt- und Kettenregel (BPE 12.3) sind bewusst ein eigenes Modul, die Lehrkraft hat die Trennung ausdrücklich begrüßt. Die Regeln stehen nicht im Erklären, sie werden im Entdecken gefunden und in der Zusammenfassung benannt (der Test prüft das).

Technik: `src/lib/ableitung.ts` (Katalog der Laborfunktionen mit Ableitung, Exponentialfunktionen, gemessene Steigung), `Ableitungslabor.tsx` (Tangente verschieben, Steigungen merken, Punkt für Punkt entsteht das Schaubild der Ableitungsfunktion, grafisches Ableiten), `Exponentiallabor.tsx` (Schaubild von a^x und der gemessenen Steigungen, Quotient f′/f für fünf Stellen und fünf Basen), `Bilder.tsx`, `daten.ts`. `Messbild` und `Bild` liegen jetzt in `src/components/Messbild.tsx`, `opt`, `platziere`, `t` und `zt` in `src/lib/modulhilfen.ts`, damit mehrere Module sie nutzen. Tests: `tests/ableitung.test.ts` und `tests/ableitungsregeln-modul.test.tsx` (jede erwartete Zahl und jede Ableitung gegen eine unabhängige Richardson-Ableitung, Koeffizienten, Tangenten in den Bildern, Regeln erscheinen nicht im Erklären).

Alle Funktionen und Zahlen sind eigen. Die GeoGebra-Verweise der Arbeitsblätter (Ableitungsrechner `t1p.de/wvoa`, Exponentialfunktionen `r6zgcsna`) und die Lehrbuchaufgaben (Seite 79 und 80) sind nicht übernommen. Die Wertetabelle zu Sinus und Kosinus stammt aus dem Arbeitsblatt (Werte −2π bis 2π), ist aber im Labor selbst zu erzeugen.

Gemeldete Unstimmigkeiten und Lücken in den Unterlagen der Lehrkraft (im Modul korrekt umgesetzt): Das Arbeitsblatt spricht in der Schülerversion von der „x-Methode“, die Lösung von der „h-Methode“, im Modul steht h-Methode wie im Modul Änderungsraten. In den Beispielen der Schülerversion fehlen die Hochzahlen (Formelobjekte werden nicht angezeigt), sie lassen sich aus den Ableitungen rekonstruieren. Die Lösung zu 1.2 verlangt die Steigung bei x = 1 und x = 2, rechnet aber nur x = 1, und die Schülerversion fragt bei 1.3 nach der Steigung, die Lösung gibt die Tangentengleichung (die Tangente gehört in ein eigenes Modul). Der Term der Zusatzaufgabe 2.1 ist „5 t²+3t+8“ (nicht 5 (t²+3t+8)), im Arbeitsblatt steht der Faktor 5 unklar. Beim Arbeitsblatt Exponentialfunktionen steht „(a ≠ 1)“, die Regel gilt für alle a > 0 (für a = 1 ist ln 1 = 0). Die Zeile „Faktorregel: f(x) = k * g(x)“ steht mit Stern, im Modul mit Malpunkt. Nicht in den Unterlagen und deshalb nicht im Modul: Produktregel, Kettenregel, Quotientenregel, Ableitung von ln x, Ableitung von x^n für beliebige reelle n über die Potenzregel hinaus (wird als gültig verwendet, aber nicht begründet) und Tangentengleichung (BPE 12.5, später). Offen: Hinweis auf den Definitionsbereich (x > 0 bei √x und 1/x) kommt nur im Labor vor.

### Modul `produkt-kettenregel`

Abschnitte: Erklären (Produkt oder Verkettung, innere und äußere Funktion, Schreibweise u′(v(x))), Entdecken (zwei Vermutungsfragen, Tabelle mit vier ausmultiplizierten Produkten und ihren Ableitungen, Produktregel mit Rechteckbild und Produktlabor, Tabelle mit sechs Verkettungen, Kettenregel mit Rechenkette und Kettenlabor, Kette in der Kette, Ableitung des natürlichen Logarithmus, Bruch als Produkt), Überprüfen (19 Aufgaben und Fragen), Zusammenfassung (beide Regeln, Vorgehen, Folgerungen wie a·e^(kx), ln(v), Potenz einer Klammer und Quotientenregel, Tabelle aller Grundableitungen, typische Fehler, verkettete Änderungsraten). Die Regeln stehen nicht im Erklären (der Test prüft das).

Technik: `src/lib/regeln.ts` (Beispiele für Produkt- und Kettenlabor mit u, u′, v, v′, f, f′), `Produktlabor.tsx` und `Kettenlabor.tsx` (vergleichen die gemessene Tangentensteigung mit der richtigen und mit falschen Rechnungen: faktorweises Ableiten, nur äußere oder nur innere Ableitung), `ProduktRechteck.tsx` (Rechteckbild zur Produktregel), `Bilder.tsx`, `daten.ts`. Tests: `tests/regeln.test.ts` und `tests/produkt-kettenregel-modul.test.tsx` (alle Aufgabenwerte und Nullstellen der Ableitungen gegen eine unabhängige Richardson-Ableitung und Bisektion, Tangenten in den Bildern, Regeln erscheinen nicht im Erklären).

Alle Beispiele und Zahlen sind eigen (x²·e^x, (x²+1)(x³−2x), x·sin x, √x·√(x+8), e^(−2x), (2x−5)⁴, √(4x+1), 2cos(π/3 (x−1)), (2−e^(−x))², ln(3x+2), x·e^(−x²), e^(−x)·sin x, x²/(x+1), 3e^(−0,4x), Ölfleck, Ballon). Nicht übernommen: GeoGebra-Verweise der Arbeitsblätter, Lehrbuchaufgaben (Seite 89, 93 bis 95).

Gemeldete Unstimmigkeiten und Lücken in den Unterlagen der Lehrkraft (im Modul korrekt umgesetzt): Zur Produktregel liegt nur das Lösungsblatt (Arbeitsblatt 11) vor, nicht das Arbeitsblatt selbst. Das Lösungsblatt verweist für weitere Beispiele auf das Lehrbuch (Seite 93 bis 95), das nicht vorlag. Beim Kettenregel-Blatt sind Merkregel und Formel in der Schülerversion Lücken, im Modul steht „äußere Ableitung mal innere Ableitung“ und f′(x) = u′(v(x)) · v′(x). Das Lösungsblatt der Kettenregel führt die Ableitung von (3 − e^(−x))² ohne Zwischenschritt (die innere Ableitung e^(−x) braucht selbst die Kettenregel), im Modul ist das ein eigener Untersuchungsauftrag. Bei den Anwendungen fehlen im Lösungsblatt Hinweise zum Definitionsbereich, im Modul steht bei Wurzel und Logarithmus die Bedingung. Die Quotientenregel ist in keinem Blatt, der Bildungsplan nennt sie als Kombination aus Produkt- und Kettenregel (BPE 12.3), sie steht deshalb als Entdecken-Auftrag und in der Zusammenfassung (nach dem Bildungsplan ergänzt). Die Ableitung von ln x wird wie im Arbeitsblatt über e^(ln x) = x und die Kettenregel hergeleitet. Offen: Ob die Begründung der Produktregel über das Rechteckbild ausreicht oder die Lehrkraft eine Herleitung über den Differenzenquotienten wünscht.

Das Modul `modellierungsaufgaben` enthält keinen neuen Stoff, sondern Anwendungs- und Abituraufgaben. Es hat deshalb eigene Abschnitte (`vorgehen`, `modellieren`, `gemischt`, `zusammenfassung`) statt Erklären, Entdecken und Überprüfen. Die gestuften Hilfen der Arbeitsblätter entsprechen den Hilfen und dem schrittweisen Lösungsweg des Bausteins `Aufgabe` (dessen Nummer jetzt auch Text wie `4b` sein darf). `src/lib/modell.ts` bestimmt Funktionsterme aus Extremdaten (`kosinusModell`, `sinusModell`), die Bereiche, in denen ein Term über oder unter einem Wert liegt (`bereiche`), sowie Uhrzeit und Datum (`uhrzeit`, `minuten`, `datum30`). Die Aufgabenwerte stehen in `content/modules/modellierungsaufgaben/daten.ts` und werden in `tests/modellierung-modul.test.tsx` gegen unabhängige Nullstellensuchen geprüft, die Bibliothek in `tests/modell.test.ts`. Die Bausteine des Moduls: `Zeitschaubild` (Kurve, Schwelle, markierte Zeiträume), `Modellbild` (a, d und p am Schaubild), `Anpassungslabor` (Funktion an zwölf Messwerte anpassen) und `Parameterlabor` (f_a mit Regler).

## Ich-Kann-Liste

Zustand (Einschätzung, Kontrollergebnisse) liegt in `content/modules/ich-kann-liste/Zustand.tsx` im Arbeitsspeicher und bleibt beim Wechsel der Abschnitte erhalten, nicht beim Neuladen. Die Bausteine `Aufgabe` und `Auswahlfrage` haben dafür das optionale `beiErgebnis`. Verweise auf andere Module setzt der Baustein `Modulverweis` (Kontext in `ModulMitAbschnitten`): Er verlinkt nur Module des aktuellen Kurses, sonst steht der Text ohne Link. Aussagen und Verweise stehen in `daten.ts`, die Sortierung in `auswertung.ts`. `tests/ich-kann-liste-modul.test.tsx` fängt die Felder aller Aufgaben des echten Moduls ab und prüft sie gegen unabhängige Nullstellensuche und Ableitungen.

Gemeldete Unstimmigkeiten in der Ich-Kann-Liste: Bei Nr. 5 steht „Streckung in x-Richtung mit dem Faktor b = 1/π“, obwohl der Term b = π hat (der Faktor ist 1/b). Bei Nr. 11 sind die Lösungen mit dem gerundeten z₁ ≈ 0,59 gerechnet (0,705; 1,295; 3,85; 4,44), genauer sind 0,707; 1,293; 3,849; 4,434. Bei Nr. 12/13 hängt „15.4. = x = 4,5“ von der Konvention ab, ob x = k den Monatsanfang oder die Monatsmitte meint. Bei Nr. 13 c ist x₁ genauer 5,149 (ab dem 5., nicht 6. Mai) und x₂ 8,851 (bis 26. August) statt 5,2 und 8,86. Bei Nr. 13 fehlt bei „12,28°“ das C. Die Symmetrie allgemeiner Schaubilder (Nr. 8) wird in keinem der fünf Module ausdrücklich behandelt.

Gemeldete Unstimmigkeiten in den Arbeitsblättern (im Modul korrekt umgesetzt): Teil 2 von Arbeitsblatt „Exakte Berechnungen“ hat die Schrittnummern 1 bis 5 und dann 4 statt 6. Beim Kosinus liegt −x₁ links von 0, im Intervall [0; 2π] ist 2π − x₁ die passende Lösung. Die Wertetabelle nennt nur 0° bis 90°, für negative Werte gelten sin⁻¹(−s) = −sin⁻¹(s) und cos⁻¹(−s) = π − cos⁻¹(s). Sonderfälle s = ±1 und |s| > 1 fehlen. Bei der Preisentwicklung ist die Lösung „Mai bis August“ falsch, richtig ist Mai bis Juli, weil der Preis am 30. August genau 175 € beträgt. Beim Hafen steht die Periode von 12 Stunden nur in der Lösung, nicht im Aufgabentext. Bei der Lunge ist x₃ gerundet 4,17, nicht 4,16.

## Technik für Modultests

Wenn ein Modul seine Aufgaben nur in der Komponente definiert, fängt der Modultest die Aufrufe von `Aufgabe` und `Auswahlfrage` mit `vi.mock` ab und prüft die erwarteten Werte (`felder[].erwartet`) des echten Moduls gegen eine unabhängige Rechnung (`tests/ich-kann-liste-modul.test.tsx`). Die unabhängige Nullstellensuche (Raster mit Bisektion) muss Rasterpunkte mit dem Funktionswert genau 0 mitzählen und findet Berührstellen (zum Beispiel `0 = 3 · sin x + 3`) nicht, die dann über das Minimum zu prüfen sind. Kontrollschaubilder werden nur geöffnet gerendert, im Test über `KontrollenOffenKontext` (nur für Tests).

## Umgang mit Arbeitsblättern

Arbeitsblätter der Lehrkraft werden nicht ins Repository übernommen (das Repository ist öffentlich). Ein Modul orientiert sich an Aufbau und Begriffen des Arbeitsblatts und enthält eigene Texte, Abbildungen und Aufgaben. Verweise auf externe Lernaktivitäten (z. B. GeoGebra) sind gewöhnliche Links mit `rel="noopener noreferrer"`. Es wird nichts eingebettet, sodass vor dem Klick keine Anfrage an den Anbieter erfolgt.

## Seiten und Adressen

Öffentlicher Build, jeweils mit eigener `index.html`:

- `/` Startseite (ohne Kursliste)
- `/kurs/<kurs>/` Kursstartseite mit aktuellem Unterrichtsthema
- `/kurs/<kurs>/thema/<thema>/`, `/kurs/<kurs>/modul/<modul>/`, bei Modulen mit Abschnitten zusätzlich `/kurs/<kurs>/modul/<modul>/<abschnitt>/`, `/kurs/<kurs>/wiederholen/`
- `404.html` enthält dieselbe Anwendung und zeigt eine Fehlerseite für unbekannte oder nicht freigegebene Adressen.

Der Basispfad ist `/mathe-lernumgebung/` und über die Umgebungsvariable `BASE_PATH` änderbar (z. B. bei eigener Domain `BASE_PATH=/`). Die Vorschau-Datei verwendet `#`-Adressen, damit sie ohne Server funktioniert. Alle HTML-Seiten enthalten `noindex, nofollow`.

## Tests

`npm run check` führt aus:

- `validierung.test.ts`: Struktur- und Verweisprüfung, Entwurfsregel
- `navigation.test.tsx`: kursabhängige Navigation, aktuelles Thema, Adressen, Linkprüfung aller Kursseiten
- `vorschau.test.ts`: Kurs „Vorschau: alle Module“ (nur in der Vorschau, nie im öffentlichen Build)
- `veroeffentlichung.test.tsx`: was der öffentliche Build enthält (nur die Kurse Abitur 2027 und 2028, nur freigegebene Module), Nummerierung der Module, Kurse mit `nurVorschau`
- `startseite.test.tsx`: Startseite ohne Kurse in der Produktion, Sperre der Bibliothek
- `formel.test.tsx`: KaTeX-Darstellung, Fehlererkennung, alle Module rendern ohne Formelfehler
- `zahlen.test.ts`: Zahlformatierung, Eingabeauswertung, Funktionsterme und Kennwerte der Sinusfunktion
- `lage-modul.test.tsx`: Arbeitsblattaufgaben numerisch gegen die Funktionen geprüft (Lageveränderung, Periode, Amplitude, Referenzpunkt, Funktionsterm aus Schaubild und Beschreibung), Schreibweise, Darstellung
- `markante.test.ts`: markante Punkte gegen die Ableitung, Arbeitsblattlösungen, negatives a und b, Randfälle
- `markante-modul.test.tsx`: Beispielwerte der Aufgaben, Abschnitte, Fachsprache, Entwurfsstatus
- `gleichungen.test.ts`: Grundlösungen, Lösungen im Intervall gegen ein unabhängiges Nullstellenverfahren, Randwerte, Sonderfälle (s = ±1, |s| > 1)
- `gleichungen-modul.test.tsx`: Aufgabenwerte (Probe, Parameteraufgabe, Anzahl, Arbeitsblattbeispiele), Auswahlfragen, Labor, Abschnitte, Fachsprache, Entwurfsstatus
- `modell.test.ts`: Funktionsterm aus Extremdaten, Bereiche über und unter einem Wert gegen Abtastung, Uhrzeit und Datum
- `modellierung-modul.test.tsx`: Aufgabenwerte gegen unabhängige Nullstellensuche (Hafen, Lunge, Preis, Temperatur, Sonnenscheindauer, Julian, exakte Werte, g_a, f_a), Abschnitte, Fachsprache, Entwurfsstatus
- `formel-satzzeichen.test.tsx`: Satzzeichen hinter Inline-Formeln sind in allen Modulen an die Formel gebunden (Attribut `nach`)
- `einheitskreis-modul.test.tsx`: Winkelrechnung, Aufgabenwerte gegen unabhängige Referenzwerte, numerische Prüfung der Eigenschaftstabelle (Nullstellen, Extrema, Wendepunkte, Symmetrie, Periode), Darstellung
- `seitenleiste.test.tsx`: Themenbereiche der Seitenleiste auf- und zuklappen (Anfangszustand, aria-Attribute, Übersicht)
- `ich-kann-liste-modul.test.tsx`: Aussagen, Verweise auf vorhandene Abschnitte, alle Kontrollaufgaben (Werte gegen unabhängige Prüfung), Auswertungslogik, Darstellung
- `tangente.test.ts` und `tangenten-modul.test.tsx`: siehe Modul `tangenten`
- `grafisch.test.ts` und `grafisches-differenzieren-modul.test.tsx`: siehe Modul `grafisches-differenzieren`
- `kurve.test.ts` und `kurvendiskussion-modul.test.tsx`: siehe Modul `kurvendiskussion`; `numerik.ts` (kein Test) liefert die unabhängigen Hilfen
- `diskussion.test.ts` und `ausfuehrliche-kurvendiskussion-modul.test.tsx`: siehe Modul `ausfuehrliche-kurvendiskussion`
- `optimierung.test.ts` und `optimierung-modul.test.tsx`: siehe Modul `optimierung`
- `ansatz.test.ts` und `funktionsterme-aufstellen-modul.test.tsx`: siehe Modul `funktionsterme-aufstellen`
- `uebungsaufgaben-abiturstil-modul.test.tsx`: siehe Modul `uebungsaufgaben-abiturstil`
- `ich-kann-liste-differentialrechnung-modul.test.tsx`: siehe Modul `ich-kann-liste-differentialrechnung`
- Ohne eigene Zeile in dieser Liste, aber vorhanden: `ableitung`, `aenderung`, `regeln`, `umkehr`, `verkettung`, `verknuepfung`, `beschriftung`, `modell` und die Modultests `ableitungsregeln`, `aenderungsraten`, `produkt-kettenregel`, `summe-produkt`, `verkettung`, `umkehr`, `gemischte-aufgaben`, `ich-kann-liste-zusammengesetzte` (jeweils im Abschnitt des Moduls beschrieben)
- `build.test.ts`: echter Produktions-Build (auch Seiten je Abschnitt) ohne Entwürfe, Seiten je Kurs, `404.html`, `noindex`, keine Drittanbieter-Adressen, Abbruch bei Verweis auf einen Entwurf

Die Tests ersetzen nicht die fachliche Prüfung der Mathematik durch die Lehrkraft.

## Arbeitsweise in Sitzungen

- Ein neues Modul entsteht als Entwurf auf `entwurf/<modul-id>` von `main` aus. Nach der ausdrücklichen Freigabe im Chat wird der Status gesetzt, das Modul zuerst im Basiskurs eingetragen (die Reihenfolge in `courses/abitur-2027.json` bestimmt die Nummer; `abitur-2028` bekommt ein Modul nur auf ausdrücklichen Wunsch), die Tests für den veröffentlichten Stand angepasst (`build.test.ts`, `veroeffentlichung.test.tsx`, Modultest) und per Fast-Forward nach `main` zusammengeführt.
- Werkzeuge: Playwright und Chromium sind vorinstalliert (Browserprüfung der Vorschau-Datei per `file://` mit `#/kurs/...`-Adressen), der Status der Veröffentlichungsläufe wird mit dem GitHub-Werkzeug abgefragt, github.io ist nicht erreichbar.
- Weitere praktische Hinweise: JSXGraph hält das Ereignis `click` zurück (es erreicht React nicht), für Eingaben im Schaubild deshalb `onPointerUp` am umgebenden Element verwenden (Beispiel `Skizzenaufgabe.tsx`), beim Scrollen mit dem Finger kommt `pointercancel`. Bei der Adresse mit `#` lädt Playwright die Seite bei einem Wechsel nicht neu, Zustände bleiben erhalten (zum Beispiel aufgeklappte Kontrollschaubilder): zwischen den Durchläufen `about:blank` aufrufen. Mausklicks mit `page.mouse` brauchen ein sichtbares Ziel, vorher `scrollIntoViewIfNeeded` und die Position neu lesen. Die Konsolenmeldung von JSXGraph „reading 'resize'“ nach einer Größenänderung und sofortigem Seitenwechsel tritt auch in älteren Modulen auf (Ursache: Resize-Zeitgeber nach `freeBoard` im Baustein `Zeichenbrett`), sie ist folgenlos und vom Modul unabhängig. Skripte für die Browserprüfung werden im Scratchpad angelegt, nie im Repository.
- Praktische Hinweise aus der Browserprüfung: Schieberegler (`input[type=range]`) setzt man in Playwright über den nativen Setter und ein `input`-Ereignis. Meldet Playwright einen Klick als verdeckt, per Bounding Boxes prüfen, ob wirklich etwas überlappt, und erst dann `evaluate(el => el.click())` nutzen. Beim Abfragen der Veröffentlichungsläufe nach `head_sha` filtern, die Liste kann veraltet sein.
- Der öffentliche Build lässt sich lokal mit `BASE_PATH=/ npx vite build --outDir <ordner>` bauen und über einen einfachen Webserver aufrufen.
- Vorschau als ZIP: `npm run build:preview`, dann `cd vorschau && zip ../vorschau-<modul-id>.zip mathe-lernumgebung-vorschau.html` und die ZIP-Datei mit dem Werkzeug zum Senden von Dateien schicken (der Ordner `vorschau/` und die ZIP-Datei bleiben außerhalb von Git, die ZIP-Datei liegt im Scratchpad).
- Unabhängige Tests mit mehrfachen Nullstellen (zum Beispiel f′ = x⁴/4 bei x⁵/20): Die Richardson-Ableitung rauscht dort um 1e-12 und erzeugt scheinbare Vorzeichenwechsel. `tests/numerik.ts` stellt dafür `vorzeichenwechsel` (überspringt Werte unter einer Schwelle), `kleineWerte` (Berührstellen) und `alleNullstellen` (fasst Rauschen zusammen) bereit. Die zweite Differenz ist um h²/12 · f⁗ verschoben, Vergleiche mit gerundeten Werten dürfen dort nur auf vier Nachkommastellen genau sein.
- JSXGraph zeichnet Beschriftungen als HTML-Elemente der Klasse `bild-text`, nicht als SVG-`text`. Browserskripte suchen sie deshalb mit `.bild-text`. Streckendicke und Farbe der Balken auf der x-Achse stehen im Attribut `stroke-width` bzw. `stroke` der `path`-Elemente.
- Formeln, Umbrüche und Überlauf: siehe die Abschnitte „Zeilenumbrüche bei Formeln“ und „Merkregel“ oben.
- Praktische Hinweise aus der Prüfung von `ausfuehrliche-kurvendiskussion` (28.10.2026): Die Prüfung auf Elemente, die rechts über das Fenster hinausragen, meldet falsch positive Treffer für die MathML-Schicht von KaTeX (`.katex-mathml`) und für Wurzelzeichen (`svg path` in `.hide-tail`, abgeschnitten, kein Überstand) und für Kurven in den Schaubildern (der Behälter schneidet sie ab). Maßgeblich ist, dass `document.documentElement.scrollWidth` nicht größer als `innerWidth` ist. Tabellen mit mehr als zwei Spalten mit Text oder Formeln werden am Handy nur innen scrollbar und sind dort abgeschnitten (Klasse `tabelle` wird unter 40 rem zu einem Block mit `overflow-x: auto`, `tabelle-breit` setzt zusätzlich `white-space: nowrap`): Solche Inhalte stehen als Liste oder als zweispaltige Tabelle (Vorbild `Verhaltenstabelle.tsx`), `tabelle-breit` nur für kurze Zahlentabellen. Schalter (Kontrollkästchen) im Labor brauchen kurze Beschriftungen (bis etwa 26 Zeichen), sonst steht der Text unter dem Kästchen. Ein Playwright-Lauf mit allen Labors und Aufgaben dauert mit fünf Breiten mehrere Minuten, deshalb in Teilen (Struktur, Labore, Aufgaben) und im Hintergrund starten (Befehle über zwei Minuten laufen sonst in die Zeitgrenze).
- Zeilenköpfe von Tabellen: Klasse `kopfspalte` (nur ab 40 rem `white-space: nowrap`, Regel in `CLAUDE.md`), Beispiel `Zusammenfassung.tsx` im Modul `optimierung`. Zu lange Wörter werden von Hand mit Bindestrich getrennt (`Neben-<br />bedingung`). Bei 320 px scrollen Tabellen mit langen Wörtern wie „Definitionsbereich“ in der zweiten Spalte weiter innen (auch „Typische Situationen“), das ist offen und könnte als Liste gelöst werden.
- Praktische Hinweise aus der Prüfung von `optimierung` (28.10.2026): Schaubilder brauchen links der y-Achse Platz für die Zahlen (mindestens etwa 12 Prozent der Breite, bei vierstelligen Zahlen mehr) und unter der x-Achse Platz für die Zahlen, sonst sind sie abgeschnitten (am Fenster `[0, …]` zu erkennen, die Achse liegt dann am Rand). Lange Formeln in Lösungswegen bricht der Browser nicht um, sie verbreitern bei 320 und 360 px die Seite: als mehrere abgesetzte Formeln (`anzeige`) mit je einem Rechenschritt schreiben und bei 320 px prüfen. Playwright: Ein Knopf wie „Schaubild zur Kontrolle einblenden“ ändert nach dem Klick seinen Text, deshalb nie eine vorab gelesene Liste (`.all()`) abarbeiten, sondern immer wieder den ersten Knopf mit dem alten Text anklicken, bis keiner mehr da ist. Für ein Bild mit Beschriftungen aller Randpunkte genügt der Test der Abstände nicht immer: Punkte direkt auf einer Achse neben einer steilen Kurve oder einer senkrechten Strecke haben auf keiner Seite genug Platz und bleiben dann ohne Buchstaben (`randOhne`), und senkrechte Strecken zählen in `kurvenBild` nur mit `senkrechteMeiden` als Hindernis.

## Veröffentlichung

Der Workflow `.github/workflows/veroeffentlichen.yml` läuft bei jedem Push auf `main` (und manuell). Er installiert die Abhängigkeiten, führt `npm run check` aus (Typprüfung und alle Tests, darunter der Test des öffentlichen Builds), baut mit `npm run build` und stellt `dist/` über GitHub Pages bereit. Das eigentliche Deployment wartet in der Umgebung `github-pages` auf die Genehmigung durch die Lehrkraft. Schlägt die Typprüfung oder ein Test fehl, wird nichts veröffentlicht.

Ablauf einer Veröffentlichung: Freigabe im Chat, Status des Moduls auf `freigegeben`, Modul im Kurs eintragen, Zusammenführen in `main`, Genehmigung in GitHub (Actions, Lauf „Veröffentlichen", „Review deployments"), Prüfung der Live-Seite.

Adresse eines Kurses: `https://<benutzer>.github.io/mathe-lernumgebung/kurs/<kurs-id>/`. Die Startseite listet keine Kurse. Das ist keine Zugangskontrolle: Wer die Adresse kennt oder errät, sieht den Kurs.

## Abhängigkeiten

| Paket | Zweck |
| --- | --- |
| react, react-dom | Oberfläche |
| katex | Formeldarstellung, lokal eingebunden, nur woff2-Schriften |
| jsxgraph | Funktionsgraphen. Lizenz MIT oder LGPL. Wird erst im Browser nachgeladen, nur im Funktionsgraph-Baustein |
| vite, @vitejs/plugin-react | Build und Entwicklungsserver |
| typescript, @types/* | Typprüfung |
| vitest | Tests |

Es gibt bewusst keine Routing-Bibliothek (kleiner eigener Router in `src/app/router.tsx`), keine Validierungsbibliothek und keine Testbibliothek für den Browser. 

## Technische Grenzen

- Alle Kursdaten stecken im ausgelieferten Code. Wer will, kann die Kurskonfigurationen anderer Kurse lesen. Kursfreigaben sind keine Zugangskontrolle.
- Direktaufrufe nicht freigegebener Adressen liefern auf GitHub Pages den HTTP-Status 404 mit der App-Fehlerseite.
- Entwurfs-Branches sind in einem öffentlichen Repository öffentlich lesbar.

- Eingabehinweise (28.10.2026): Brüche und Vielfache von π stehen als Formel mit dem Zeichen π (`\frac{3\pi}{2}`), nie als `pi/3` oder `3/4` in Schreibmaschinenschrift. Geändert in `optimierung`, `funktionsterme-aufstellen`, `uebungsaufgaben-abiturstil` und `ich-kann-liste-differentialrechnung`. Die Eingabe selbst bleibt unverändert (`pi/3`, `π/3`, `3/4` werden gelesen).
