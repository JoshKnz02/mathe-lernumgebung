# Projektregeln

Dieses Dokument gilt für jede Entwicklungssitzung in diesem Repository.

## Zweck

Langfristig wachsende, interaktive Mathematik-Lernumgebung für die gymnasiale Oberstufe (Klassen 12 und 13, Baden-Württemberg). Sie ergänzt das Kursnotizbuch der Lehrkraft und ersetzt es nicht. Fachliche Orientierung gibt der Bildungsplan 2021 (Berufliches Gymnasium, erhöhtes Anforderungsniveau). BPE-Nummern stehen als Metadaten an den Modulen.

## Zusammenarbeit

- Die Lehrkraft hat keine Programmierkenntnisse. Alle Änderungen erfolgen über Anweisungen in natürlicher Sprache. Technische Entscheidungen werden verständlich erklärt, technische Arbeiten übernimmt Claude.
- Sprache der Kommunikation und der Inhalte: Deutsch, Anrede mit "du", sachlicher Ton.
- Nichts als erledigt melden, was nicht tatsächlich geprüft wurde. Das gilt besonders für Veröffentlichungen: erst melden, nachdem die Live-Seite abgerufen und geprüft wurde.
- Rückfragen nur bei wesentlich fehlenden Angaben. Untergeordnete Gestaltungsentscheidungen selbst treffen.

## Didaktik

- Prinzipien: Erklären, Entdecken, Überprüfen. Nicht jedes Modul braucht alle drei.
- Interaktive Elemente nur mit erkennbarem didaktischem Mehrwert. Keine unnötigen Erklärungen, Visualisierungen oder Aufgaben.
- Mathematische Korrektheit, klare Fachsprache, Niveau der Oberstufe. Unsicherheiten offen benennen. Automatische Tests ersetzen die fachliche Prüfung durch die Lehrkraft nicht.
- Schreibweise von Funktionsgleichungen und Fachbegriffen folgt dem Bildungsplan. Bei konkreten Argumenten stehen Klammern: sin(30°), sin(π/6), cos(2π). Bei der Variablen genügt sin x.
- Formulierungen sind schülernah. Fachzeichen wie der Betrag |x| nur verwenden, wenn sie nötig sind und die Lernenden sie kennen, sonst in Worten erklären.
- Umfangreiche Module werden in Abschnitte (z. B. Erklären, Entdecken, Überprüfen, Zusammenfassung) gegliedert, die über ein Untermenü einzeln gewählt werden.

## Technik

- React, TypeScript, Vite. KaTeX und JSXGraph werden über npm eingebunden, nicht über ein CDN. GeoGebra nur optional und erst nach Klick.
- Möglichst wenige, gut dokumentierte Abhängigkeiten. Jede neue Abhängigkeit begründen.
- Lernmodule, Kurskonfiguration und Darstellung bleiben getrennt.
- Jedes Modul existiert genau einmal und hat eine feste ID. Kurse verweisen per ID. Module werden nie dupliziert und IDs nie umbenannt.
- Bestehende Komponenten und Gestaltungsstandards wiederverwenden. Bestehende Funktionen nur ändern, wenn nötig oder beauftragt.
- Responsive, touchbedienbar, ausreichende Kontraste, Tastaturbedienung wo sinnvoll.

## Design

Heller Inhaltsbereich, dunkler Navigationsbereich, dezente blaue Akzente, einheitliche Karten und Bedienelemente, großzügige Abstände, keine spielerischen Elemente, keine unnötigen Animationen.

## Entwürfe und Veröffentlichung

- Jedes Modul hat einen Status in `meta.json`: `entwurf` oder `freigegeben`.
- Der öffentliche Build enthält nur freigegebene Module. Verweist eine Kursdatei auf einen Entwurf, muss der Build fehlschlagen.
- Entwürfe liegen auf Branches nach dem Muster `entwurf/<modul-id>`. Deployments laufen ausschließlich von `main`.
- Ablauf: Entwurf erstellen, Tests, Vorschau an die Lehrkraft, Änderungen, ausdrückliche Freigabe im Chat, Status setzen und in `main` zusammenführen, Genehmigung des Deployments durch die Lehrkraft in GitHub (Umgebung `github-pages`), Live-Prüfung.
- Ohne ausdrückliche Freigabe der Lehrkraft nie nach `main` pushen, wenn dadurch Lerninhalte veröffentlicht würden.
- Dieses Repository ist öffentlich. Branches sind öffentlich lesbar. Nichts Vertrauliches committen.

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
src/components/                     wiederverwendbare Bausteine (Formel, Karte, Hinweis, Abzeichen)
src/app/                            Router, Rahmen, Seiten
src/styles/app.css                  Gestaltungsstandards (Farben, Abstände)
tests/                              automatische Tests
docs/ENTWICKLUNG.md                 Entwicklungsdokumentation
```

Befehle: `npm run check` (Typen und Tests), `npm run build` (öffentlicher Build in `dist/`, ohne Entwürfe), `npm run build:preview` (Vorschau als eine HTML-Datei in `vorschau/`, mit Entwürfen, nie veröffentlichen).
