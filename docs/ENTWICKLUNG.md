# Entwicklungsdokumentation

Stand: Grundgerüst (Schritt 1 und 2), Beispielmodul `sinusfunktion-allgemein` (Phase 4, Entwurf, Branch `entwurf/sinusfunktion-allgemein`) und erstes Unterrichtsmodul `einheitskreis-sinus-kosinus` (Entwurf, Branch `entwurf/einheitskreis-sinus-kosinus`, aufbauend auf dem Sinus-Branch). Die übrigen Module sind Platzhalter.

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

## Daten

### Themenbereiche: `content/themen.json`

Liste von `{ id, titel, beschreibung? }`. Die Reihenfolge in der Datei ist die Standardreihenfolge. Die Liste folgt der Themenstruktur für Klasse 12 und 13.

### Module: `content/modules/<modul-id>/`

`meta.json`:

```json
{
  "id": "demo-sinus-platzhalter",
  "titel": "Allgemeine Sinusfunktion (Platzhalter)",
  "thema": "trigonometrische-funktionen",
  "status": "freigegeben",
  "beschreibung": "Kurzbeschreibung für die Kartenansicht.",
  "prinzipien": ["erklaeren", "entdecken", "ueberpruefen"],
  "bpe": []
}
```

- `id` entspricht dem Ordnernamen und wird nie umbenannt.
- `status` ist `entwurf` oder `freigegeben`.
- `thema` verweist auf eine Themen-ID. Ein Modul gehört genau einem Thema. Ein anderes Thema wird hier geändert, nicht im Kurs.
- `prinzipien` und `bpe` sind optional (Bildungsplanbezug nur als Metadatum).

Optional teilt `"abschnitte": [{ "id": "erklaeren", "titel": "Erklären" }, ...]` ein Modul in Abschnitte. Die Modulseite zeigt dann eine Abschnittsleiste, in der Kursnavigation erscheint unter dem geöffneten Modul ein Untermenü, und am Ende eines Abschnitts steht ein „Weiter"-Knopf. Jeder Abschnitt hat eine eigene Adresse (`/kurs/<kurs>/modul/<modul>/<abschnitt>/`). Ohne Angabe wird der erste Abschnitt gezeigt, eine unbekannte Abschnitts-ID führt zur Fehlerseite. Module ohne `abschnitte` werden als Ganzes gezeigt.

`index.tsx` exportiert die Modulkomponente als `default`. Bei Modulen mit Abschnitten steht jeder Abschnitt in einem `<Abschnitt id="..." titel="...">` aus `src/components/Abschnitt`. Die IDs entsprechen denen in `meta.json` (ein Test prüft das). Bausteine aus `src/components`: `Formel`, `Hinweis`, `Karte`, `Abzeichen`, `Zeichenbrett` (JSXGraph-Grundlage mit Achsen und Gitter, dynamische Zeichnungen), `Funktionsgraph` und `Einheitskreis` (beide darauf aufgebaut), `Regler` (Schieberegler), `Aufgabe` (Zahleneingaben mit automatischer Rückmeldung, gestuften Hilfen und schrittweiser Lösung), `Auswahlfrage` (genau eine richtige Antwort, Rückmeldung zur gewählten Antwort, Erklärung auf Klick). Formeln werden als TeX geschrieben: `<Formel anzeige tex={String.raw`f(x)=\sin x`} />`.

### Kurse: `courses/<kurs-id>.json`

```json
{
  "id": "demo-a",
  "titel": "Demokurs A",
  "themen": ["trigonometrische-funktionen", "differentialrechnung"],
  "module": ["demo-sinus-platzhalter", "demo-ableitung-platzhalter"],
  "aktuellesModul": "demo-sinus-platzhalter"
}
```

- `themen`: sichtbare Themenbereiche, in Anzeigereihenfolge.
- `module`: freigegebene Module, in Anzeigereihenfolge. Die Gruppierung nach Thema ergibt sich aus `meta.json`.
- `aktuellesModul`: aktuelles Unterrichtsthema oder `null`. Muss in `module` stehen.
- Nicht aufgeführte Themen und Module erscheinen für den Kurs nirgends, auch nicht ausgegraut.

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

- `npm run build` (Modus `production`): Entwürfe fehlen vollständig, weder Metadaten noch Code noch Seiten tauchen im Ergebnis auf. Die Startseite listet keine Kurse. Die Modulbibliothek ist nicht erreichbar.
- `npm run build:preview` und `npm run dev`: Entwürfe sind enthalten, die Startseite listet die Kurse und den automatisch erzeugten Kurs „Vorschau: alle Module“ (alle Module inkl. Entwürfen, nicht als Datei, nie im öffentlichen Build), das Band nennt Branch, Commit und Bauzeit, es gibt eine Modulbibliothek (`/bibliothek`) mit allen Modulen samt Status. Ein Band kennzeichnet die Ansicht als Vorschau.

Entwurfsablauf: Entwurf auf einem Branch `entwurf/<modul-id>` anlegen (Status `entwurf`), Vorschau bauen, nach Freigabe Status auf `freigegeben` setzen, den Kurs auf das Modul verweisen lassen und in `main` zusammenführen. Solange ein Kurs ein Modul mit Status `entwurf` nennt, lässt sich der öffentliche Build nicht erzeugen.

## Aufgaben und Eingaben

Der Baustein `Aufgabe` wertet Zahleneingaben mit `src/lib/eingabe.ts` aus. Erlaubt sind Dezimalzahlen mit Komma oder Punkt, Brüche und Vielfache von π (`1,5`, `1/2`, `pi/4`, `3π/4`). Für gerundete Dezimalwerte kann je Feld eine absolute Toleranz angegeben werden. Eingaben und Ergebnisse bleiben im Browser, nichts wird gespeichert oder gesendet.

Rechenlogik der allgemeinen Sinusfunktion (Funktionsterm, Kennwerte) liegt in `src/lib/sinus.ts`. Die erwarteten Werte der Aufgaben stehen in `content/modules/sinusfunktion-allgemein/daten.ts` und werden in `tests/sinus-modul.test.tsx` numerisch gegen die Funktion geprüft.

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
- `startseite.test.tsx`: Startseite ohne Kurse in der Produktion, Sperre der Bibliothek
- `formel.test.tsx`: KaTeX-Darstellung, Fehlererkennung, alle Module rendern ohne Formelfehler
- `zahlen.test.ts`: Zahlformatierung, Eingabeauswertung, Funktionsterme und Kennwerte der Sinusfunktion
- `sinus-modul.test.tsx`: Aufgabenwerte gegen die Funktion, typische Schülereingaben, Darstellung des Moduls
- `einheitskreis-modul.test.tsx`: Winkelrechnung, Aufgabenwerte gegen unabhängige Referenzwerte, numerische Prüfung der Eigenschaftstabelle (Nullstellen, Extrema, Wendepunkte, Symmetrie, Periode), Darstellung
- `build.test.ts`: echter Produktions-Build (auch Seiten je Abschnitt) ohne Entwürfe, Seiten je Kurs, `404.html`, `noindex`, keine Drittanbieter-Adressen, Abbruch bei Verweis auf einen Entwurf

Die Tests ersetzen nicht die fachliche Prüfung der Mathematik durch die Lehrkraft.

## Veröffentlichung (noch nicht eingerichtet)

Vorgesehen ist ein GitHub-Actions-Workflow, der ausschließlich von `main` den Build `npm run build` ausführt und `dist/` über die Umgebung `github-pages` bereitstellt (Genehmigung durch die Lehrkraft). Der Workflow wird erst nach ausdrücklicher Freigabe angelegt.

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
