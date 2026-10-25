# Entwicklungsdokumentation

Stand: Grundgerüst und sechs Unterrichtsmodule zu den trigonometrischen Funktionen, freigegeben und in den Kursen `abitur-2027` (Basiskurs, alle Module) und `abitur-2028`: `einheitskreis-sinus-kosinus`, `lage-im-koordinatensystem`, `markante-punkte`, `trigonometrische-gleichungen`, `modellierungsaufgaben` und `ich-kann-liste`. Es gibt keine Beispiel- oder Platzhalterinhalte mehr. Weitere Module entstehen Schritt für Schritt.

## Stand, Zuordnung zum Bildungsplan und offene Punkte (Stand 25.10.2026)

| Nr. im Kurs | Modul-ID | BPE | Abschnitte |
| --- | --- | --- | --- |
| 1 | `einheitskreis-sinus-kosinus` | 10.1 | Erklären, Entdecken, Überprüfen, Zusammenfassung |
| 2 | `lage-im-koordinatensystem` | 10.2, 10.3, 10.4 | wie 1 |
| 3 | `markante-punkte` | 10.3, 10.4 | wie 1 |
| 4 | `trigonometrische-gleichungen` | 10.5, 10.6 | wie 1 |
| 5 | `modellierungsaufgaben` | 10.4, 10.5, 10.6 | Vorgehen, Modellieren, Gemischte Aufgaben, Zusammenfassung |
| 6 | `ich-kann-liste` (freigegeben) | 10.1 bis 10.6 | Anleitung, Einheitskreis, Schaubild und Term, Gleichungen, Anwendungen, Auswertung |

Veröffentlicht sind alle sechs Module in den Kursen `abitur-2027` (Basiskurs) und `abitur-2028`, dazu das Design der Übersichtsseiten und die aufklappbare Seitenleiste. Die Läufe 1 bis 12 des Workflows waren erfolgreich. Die Lehrkraft prüft die Live-Seite selbst.

Offen:

1. **Aufräumen durch die Lehrkraft** in GitHub: Entwurfsbranches `entwurf/ich-kann-liste`, `entwurf/design-startseite`, `entwurf/seitenleiste-einklappen`, `entwurf/kurs-abitur-2027` (und die alten `entwurf/trigonometrische-gleichungen`, `entwurf/modellierungsaufgaben`, falls noch vorhanden) löschen, sobald die Live-Prüfung passt.
2. **Entscheidungen der Lehrkraft zur Ich-Kann-Liste:** Die Ergänzungen Nr. 14 bis 17 (nach dem Bildungsplan, mit Abzeichen gekennzeichnet) behalten oder streichen. Eine Druckfassung gibt es nicht (Auswertung nur am Bildschirm, nichts wird gespeichert). Die Symmetrie allgemeiner Schaubilder (Nr. 8) wird in keinem Modul ausdrücklich behandelt, nur in Hilfe und Lösung der Kontrollaufgabe. Ein kurzer Abschnitt in Modul 3 wäre sinnvoll.
3. **Kurs Abitur 2028:** Er ist weiter öffentlich erreichbar. Soll nur noch Abitur 2027 öffentlich sein, bekommt `abitur-2028` das Feld `"nurVorschau": true` (dann sind bereits verteilte Links tot). Die Beschreibung von `abitur-2027` nennt keine Jahrgangsstufe, die der Lehrkraft nachzufragen ist.
4. **Fachliche Prüfung** der Module 4 bis 6 durch die Lehrkraft, besonders die Annahme einer Periode von 12 Stunden beim Hafen, die ergänzte Frage zur Sonnenscheindauer und alle Kontrollaufgaben der Ich-Kann-Liste. Die Nutzungsrechte der beiden GeoGebra-Links (`uzuzct74`, `q4tb33k6`) sind zu klären, weil die Seite öffentlich ist.
5. **Nicht nachgebaut** aus Arbeitsblatt 6 (Gemischte Übungsaufgaben): Aufgabe 5 (Koordinatensystem passend einzeichnen) und die Abbildungen der Abituraufgaben.

## Themenbereich Zusammengesetzte Funktionen (BPE 11), in Arbeit (Modul 1 von 4 veröffentlicht)

Der Themenbereich steht in `content/themen.json` (`zusammengesetzte-funktionen`, mit Beschreibung und Symbol `Verknuepfung`). Abgestimmte Aufteilung (Sitzung vom 25.10.2026), alle Module zuerst im Basiskurs `abitur-2027`:

| Modul-ID | BPE | Stand |
| --- | --- | --- |
| `summe-produkt-funktionen` | 11.1 | freigegeben (25.10.2026), im Basiskurs `abitur-2027`, nicht in `abitur-2028` |
| `verkettung` | 11.2 | offen |
| `umkehrfunktion` | 11.3 | offen (Wurzel und natürlicher Logarithmus als Umkehrfunktionen, Kontexte Celsius und Fahrenheit, Währung, Bremsweg) |
| `ich-kann-liste-zusammengesetzte-funktionen` | 11.1 bis 11.3 | offen, die Ich-Kann-Liste der Lehrkraft fehlt noch |

Vorausgesetzt sind (mit der Lehrkraft geklärt): Potenz- und Polynomfunktionen, Exponentialfunktionen mit Basis a (3^x, 0,5^x), Sinus und Kosinus sowie die Wurzelfunktion. e^x und ln werden nicht vorausgesetzt, weil die Zahl e im Bildungsplan erst in BPE 12 steht und ln erst in 11.3 kommt. Die Beispiele des Bildungsplans zu 11.1 nennen e^x trotzdem. Sobald e eingeführt ist, gelten die Regeln unverändert.

### Modul `summe-produkt-funktionen`

Abschnitte: Erklären (Summe, Differenz, Produkt, Klammern, Definitionsbereich, Ordinatenaddition mit `Ordinatenbild`), Entdecken (drei Vermutungen, `Verknuepfungslabor`, sechs Untersuchungsaufträge, GeoGebra-Link als gewöhnlicher Verweis), Überprüfen (zehn Aufgaben), Zusammenfassung.

Rechenlogik in `src/lib/verknuepfung.ts`: Katalog der neun Funktionen (0,5x, x², x³, x⁴ + x, 3^x, 0,5^x, sin x, cos x, √x), `verknuepfe`, Termbildung mit Klammern und numerische Analyse (Nullstellen mit Vorzeichenwechsel und Berührstellen, Symmetrie, Gerade als Asymptote, Periode). Bewusste Wahl des Katalogs: 0,5^x ist nicht die Spiegelung von 3^x, und x⁴ + x lässt sich nicht aus Katalogfunktionen zu einer symmetrischen Funktion ergänzen. Sonst wären 2^x + 0,5^x (achsensymmetrisch) oder (x³ + x²) − x³ (achsensymmetrisch) Ausnahmen von der Regel „ohne Symmetrie bleibt keine Symmetrie“. Diese Regel gilt allgemein nur meistens. Die Tabelle im Labor ist numerisch und ersetzt keine Rechnung.

Tests: `tests/verknuepfung.test.ts` (alle Paare aus dem Katalog gegen die Regeln für Symmetrie, Nullstellen von Produkten gegen von Hand bekannte Nullstellen, alle Paare gegen ein unabhängiges feines Raster, Asymptoten und Perioden), `tests/summe-produkt-modul.test.tsx` (Aufgabenwerte, Aussagen der Beobachtungen, Abschnitte, keine Vorwegnahme im Erklären).

Offen in diesem Modul: Lehrkraft löscht nach der Live-Prüfung den Branch `entwurf/summe-produkt-funktionen`. Nutzungsrechte des GeoGebra-Links `tc2uqagd` klären (öffentliche Seite). Nicht umgesetzt, weil es nicht im Bildungsplan steht: Grenzverhalten allgemein, Wertebereich der Verknüpfungen.

Gemeldete Unstimmigkeiten in den Unterlagen der Lehrkraft (im Modul korrekt umgesetzt): Wertebereich von 1,1^x ist ]0; ∞[ (nicht [0; ∞[). Der Definitionsbereich von √x + 1 ist [0; ∞[ (die Lehrkraft schreibt ℝ⁺). „Die Periode bleibt“ bei sin(x) + √x + 1 und „Periode = 2π“ bei x · sin(x) stimmen nicht, beide Funktionen sind nicht periodisch. x · sin(x) hat unendlich viele Extrempunkte (nicht „kein HP/TP“). „Nullstellen kombinieren sich aus den zwei Funktionen“ gilt nur für das Produkt. Bei den Symmetrieregeln fehlen punktsymmetrisch · achsensymmetrisch = punktsymmetrisch und die Regeln für Summen. Die Skizze zu f(x) + g(x) = 5^x + x⁶ + 2x³ fällt links und rechts nach unten, die Summe geht aber gegen +∞ (sieht nach der Differenz aus).

## Sitzungsstart

1. `CLAUDE.md` und diese Datei lesen, insbesondere „Stand“ und „Arbeitsweise in Sitzungen“.
2. `git fetch origin main`, Entwurfsbranch von `origin/main` anlegen (`entwurf/<modul-id>` bzw. `entwurf/<thema>`), `npm ci`, `npm run check` als Ausgangspunkt (alle Tests müssen grün sein).
3. Unterlagen der Lehrkraft aus dem Chat lesen: Word-Dateien mit `pandoc <datei>.docx -t plain --wrap=none` (Tabellen und Formeln sind unordentlich, Bilder liegen unter `word/media` und müssen einzeln angesehen werden), PDFs mit `pdftotext -layout` und, wo Bilder wichtig sind, seitenweise ansehen. Entpackt wird nur in eigene Ordner im Scratchpad, nie ins Repository.
4. Nach jeder Änderung `npm run check`, `npm run build:preview`, Browserprüfung (siehe CLAUDE.md), Vorschau als ZIP an die Lehrkraft schicken, auf ausdrückliche Freigabe warten.

Gemeldete Unstimmigkeiten in der Ich-Kann-Liste: Bei Nr. 5 steht „Streckung in x-Richtung mit dem Faktor b = 1/π“, obwohl der Term b = π hat (der Faktor ist 1/b). Bei Nr. 11 sind die Lösungen mit dem gerundeten z₁ ≈ 0,59 gerechnet (0,705; 1,295; 3,85; 4,44), genauer sind 0,707; 1,293; 3,849; 4,434. Bei Nr. 12/13 hängt „15.4. = x = 4,5“ von der Konvention ab, ob x = k den Monatsanfang oder die Monatsmitte meint. Bei Nr. 13 c ist x₁ genauer 5,149 (ab dem 5., nicht 6. Mai) und x₂ 8,851 (bis 26. August) statt 5,2 und 8,86. Bei Nr. 13 fehlt bei „12,28°“ das C. Die Symmetrie allgemeiner Schaubilder (Nr. 8) wird in keinem der fünf Module ausdrücklich behandelt.

Gemeldete Unstimmigkeiten in den Arbeitsblättern (im Modul korrekt umgesetzt): Teil 2 von Arbeitsblatt „Exakte Berechnungen“ hat die Schrittnummern 1 bis 5 und dann 4 statt 6. Beim Kosinus liegt −x₁ links von 0, im Intervall [0; 2π] ist 2π − x₁ die passende Lösung. Die Wertetabelle nennt nur 0° bis 90°, für negative Werte gelten sin⁻¹(−s) = −sin⁻¹(s) und cos⁻¹(−s) = π − cos⁻¹(s). Sonderfälle s = ±1 und |s| > 1 fehlen. Bei der Preisentwicklung ist die Lösung „Mai bis August“ falsch, richtig ist Mai bis Juli, weil der Preis am 30. August genau 175 € beträgt. Beim Hafen steht die Periode von 12 Stunden nur in der Lösung, nicht im Aufgabentext. Bei der Lunge ist x₃ gerundet 4,17, nicht 4,16.

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

`index.tsx` exportiert die Modulkomponente als `default`. Bei Modulen mit Abschnitten steht jeder Abschnitt in einem `<Abschnitt id="..." titel="...">` aus `src/components/Abschnitt`. Die IDs entsprechen denen in `meta.json` (ein Test prüft das). Bausteine aus `src/components`: `Formel`, `Hinweis`, `Karte`, `Abzeichen`, `Zeichenbrett` (JSXGraph-Grundlage mit Achsen und Gitter, dynamische Zeichnungen), `Funktionsgraph` und `Einheitskreis` (beide darauf aufgebaut), `Regler` (Schieberegler), `Aufgabe` (Zahleneingaben mit automatischer Rückmeldung, gestuften Hilfen und schrittweiser Lösung), `Auswahlfrage` (genau eine richtige Antwort, Rückmeldung zur gewählten Antwort, Erklärung auf Klick), `AufKlick` (zeigt Inhalt erst nach Klick, z. B. ein Schaubild als Kontrolle). Formeln werden als TeX geschrieben: `<Formel anzeige tex={String.raw`f(x)=\sin x`} />`.

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

Das Modul `modellierungsaufgaben` enthält keinen neuen Stoff, sondern Anwendungs- und Abituraufgaben. Es hat deshalb eigene Abschnitte (`vorgehen`, `modellieren`, `gemischt`, `zusammenfassung`) statt Erklären, Entdecken und Überprüfen. Die gestuften Hilfen der Arbeitsblätter entsprechen den Hilfen und dem schrittweisen Lösungsweg des Bausteins `Aufgabe` (dessen Nummer jetzt auch Text wie `4b` sein darf). `src/lib/modell.ts` bestimmt Funktionsterme aus Extremdaten (`kosinusModell`, `sinusModell`), die Bereiche, in denen ein Term über oder unter einem Wert liegt (`bereiche`), sowie Uhrzeit und Datum (`uhrzeit`, `minuten`, `datum30`). Die Aufgabenwerte stehen in `content/modules/modellierungsaufgaben/daten.ts` und werden in `tests/modellierung-modul.test.tsx` gegen unabhängige Nullstellensuchen geprüft, die Bibliothek in `tests/modell.test.ts`. Die Bausteine des Moduls: `Zeitschaubild` (Kurve, Schwelle, markierte Zeiträume), `Modellbild` (a, d und p am Schaubild), `Anpassungslabor` (Funktion an zwölf Messwerte anpassen) und `Parameterlabor` (f_a mit Regler).

## Ich-Kann-Liste

Zustand (Einschätzung, Kontrollergebnisse) liegt in `content/modules/ich-kann-liste/Zustand.tsx` im Arbeitsspeicher und bleibt beim Wechsel der Abschnitte erhalten, nicht beim Neuladen. Die Bausteine `Aufgabe` und `Auswahlfrage` haben dafür das optionale `beiErgebnis`. Verweise auf andere Module setzt der Baustein `Modulverweis` (Kontext in `ModulMitAbschnitten`): Er verlinkt nur Module des aktuellen Kurses, sonst steht der Text ohne Link. Aussagen und Verweise stehen in `daten.ts`, die Sortierung in `auswertung.ts`. `tests/ich-kann-liste-modul.test.tsx` fängt die Felder aller Aufgaben des echten Moduls ab und prüft sie gegen unabhängige Nullstellensuche und Ableitungen.

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
- `build.test.ts`: echter Produktions-Build (auch Seiten je Abschnitt) ohne Entwürfe, Seiten je Kurs, `404.html`, `noindex`, keine Drittanbieter-Adressen, Abbruch bei Verweis auf einen Entwurf

Die Tests ersetzen nicht die fachliche Prüfung der Mathematik durch die Lehrkraft.

## Arbeitsweise in Sitzungen

- Ein neues Modul entsteht als Entwurf auf `entwurf/<modul-id>` von `main` aus. Nach der ausdrücklichen Freigabe im Chat wird der Status gesetzt, das Modul im Kurs eingetragen (die Reihenfolge in `courses/abitur-2028.json` bestimmt die Nummer), die Tests für den veröffentlichten Stand angepasst (`build.test.ts`, `veroeffentlichung.test.tsx`, Modultest) und per Fast-Forward nach `main` zusammengeführt.
- Werkzeuge: Playwright und Chromium sind vorinstalliert (Browserprüfung der Vorschau-Datei per `file://` mit `#/kurs/...`-Adressen), der Status der Veröffentlichungsläufe wird mit dem GitHub-Werkzeug abgefragt, github.io ist nicht erreichbar.
- Der öffentliche Build lässt sich lokal mit `BASE_PATH=/ npx vite build --outDir <ordner>` bauen und über einen einfachen Webserver aufrufen.
- Formeln, Umbrüche und Überlauf: siehe die Abschnitte „Zeilenumbrüche bei Formeln“ und „Merkregel“ oben.

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
