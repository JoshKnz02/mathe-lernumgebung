# Vektorgeometrie: Übersicht, Unterbereiche, Regeln für alle Module

Modulhistorie, Entscheidungen und gemeldete Unstimmigkeiten (aus `docs/ENTWICKLUNG.md` ausgelagert, Wortlaut unverändert, nur der Zusatz „Live-Prüfung steht aus“ in den Überschriften entfällt, er steht gesammelt in `docs/STAND.md`).

## Themenbereich Vektorgeometrie (BPE 7 und 16), in Arbeit (Unterbereich Vektoren: Modul 1 bis 6 freigegeben, 01.11.2026)

Gliederung (Vorgabe der Lehrkraft, 30.10.2026): **ein** Themenbereich „Vektorgeometrie“ mit **drei Unterbereichen** (`vektoren`, `geraden`, `ebenen`) und **einer** Ich-Kann-Liste für alle drei am Ende. Die Grundstruktur bleibt, die Gliederung der Module innerhalb der Unterbereiche kann sich beim Bau ändern. Module werden klein geschnitten. Übungsaufgaben im Abiturstil stehen je Unterbereich am Ende (nicht erst gebündelt am Schluss des Themenbereichs).

Geplante Module (Stand: Vorschlag, nach Arbeitsblättern der Lehrkraft anzupassen; `rechnen-mit-vektoren` ist freigegeben, siehe unten):

- Vektoren (BPE 7 und das Vektorprodukt aus 16.3): Punkte und Vektoren in der Ebene (`punkte-vektoren-ebene`), Koordinatensystem im Raum, Punkte und Vektoren im Raum (mit Nullvektor und Ortsvektor), Rechnen mit Vektoren, Betrag, Abstand und Teilung von Strecken, Skalarprodukt, Orthogonalität und Winkel (mit Anwendung bei Dreieck und Vierecken), Vektorprodukt, Übungsaufgaben.
- Geraden im Raum (BPE 16.1, 16.2, 16.6 teils, 16.7): Geradengleichung, besondere Lage und Spurpunkte, gegenseitige Lage, Schnittwinkel, Abstand Punkt und Gerade und paralleler Geraden, Modellieren mit Geraden (Bewegung, Schatten, Projektion), Übungsaufgaben.
- Ebenen im Raum (BPE 16.3 bis 16.6): Einführung und Parameterform, Normalenvektor und Koordinatenform, besondere Lage und Spurgeraden, Gerade und Ebene, zwei Ebenen, Abstand Punkt–Ebene, Flächen und Volumen, Übungsaufgaben.
- Abschluss: eine Ich-Kann-Liste Vektorgeometrie, Abschnitte nach den drei Unterbereichen.

Bildungsplan-Lücken, die nicht gefüllt werden: Der Schnittwinkel zwischen zwei Ebenen und zwischen Gerade und beliebiger Ebene steht nicht im Bildungsplan (gefordert ist nur der Winkel zu den Koordinatenebenen, BPE 16.1). Die Hesse'sche Normalform kommt nicht vor, der Abstand Punkt–Ebene läuft über den Lotfußpunkt. Beides nur als gekennzeichnete Vertiefung auf Wunsch der Lehrkraft. BPE 15.1 nennt Abstand Punkt und Gerade und den minimalen Abstand bewegter Objekte als Optimierung (Verweis auf das Modul `optimierung` möglich).


### Unterbereiche (technische Gliederung)

Ein Themenbereich kann in Unterbereiche gegliedert sein. Die Unterbereiche stehen in `content/themen.json` am Thema (`unterbereiche`: `id`, `titel`, optional `beschreibung`, Reihenfolge der Datei = Reihenfolge der Anzeige). Ein Modul nennt seinen Unterbereich in `meta.json` (`unterbereich`). Module ohne Unterbereich in einem gegliederten Thema sind der **Abschluss** des Themenbereichs (zum Beispiel die Ich-Kann-Liste, immer zuletzt). Themen ohne Unterbereiche verhalten sich wie bisher.

- Navigation (`src/lib/navigation.ts`): `ThemaMitModulen` hat zusätzlich `unterbereiche` (nur mit sichtbaren Modulen) und `abschluss`. `module` ist bei gegliederten Themen nach Unterbereichen geordnet (Kursdatei-Reihenfolge innerhalb der Gruppe), damit Weiter und Zurück der angezeigten Reihenfolge folgen. Die Kursdatei muss deshalb nicht nach Unterbereichen sortiert sein. Der Vorschau-Kurs verhält sich ebenso.
- Nummerierung: je Unterbereich (1., 2., …). Der Abschluss hat keine Nummer.
- Seiten: Themenseite mit Kacheln der Unterbereiche und dem Abschluss darunter, eigene Unterbereichsseite (`/kurs/<kurs>/thema/<thema>/<unterbereich>/`, auch als statische Seite im öffentlichen Build, aber nur für Unterbereiche mit Modulen im Kurs), Pfad Kurs / Thema / Unterbereich auf der Modulseite, Wiederholen und Üben gliedert nach Unterbereichen.
- Seitenleiste: Jeder Unterbereich ist ein eigener Umschalter (`aria-expanded`, `aria-controls`, auch per Tastatur), aufgeklappt ist nur der Unterbereich der aktuellen Seite bzw. des aktuellen Unterrichtsmoduls. Nichts wird gespeichert.
- Validierung: unbekannter Unterbereich, Unterbereich in einem Thema ohne Gliederung, doppelte oder ungültige IDs.
- Test: `tests/unterbereiche.test.tsx` mit eigenem Testdatensatz (Validierung, Navigation, Adressen, Seiten, Seitenleiste, echte Inhalte).
- Unterbereiche ohne Module erscheinen nirgends (weder Navigation noch Seite). Solange nur `vektoren` Module hat, zeigt die Vektorgeometrie nur diesen Unterbereich. `geraden` und `ebenen` stehen in `themen.json` und erscheinen mit dem ersten Modul. Die Platzhaltermodule der Vorschau sind entfernt.
- Der Formeltest (`tests/formel.test.tsx`) rendert alle Module und hat deshalb ein Zeitlimit von 60 Sekunden.


### Abgrenzung der Unterbereiche Vektoren, Geraden und Ebenen (Vorgabe der Lehrkraft, 01.11.2026)

Im Unterbereich Vektoren steht nur, was mit Vektoren selbst zu tun hat. Geraden und Ebenen bauen darauf auf und verweisen per `Modulverweis`, nichts wird doppelt gebaut. Restplan des Unterbereichs Vektoren (Nummern nach der Kursreihenfolge):

| Nr. | Modul-ID (Vorschlag) | BPE | Inhalt |
|---|---|---|---|
| 4 | `betrag-abstand-teilung` | 7.2 | Betrag, Einheitsvektor, Abstand zweier Punkte, Länge einer Strecke, Mittelpunkt, Teilung im Verhältnis |
| 5 | `skalarprodukt-orthogonalitaet` | 7.3 | Skalarprodukt, Orthogonalität, Winkel zwischen zwei Vektoren |
| 6 | `dreieck-vierecke-skalarprodukt` | 7.3 | Anwendung bei Dreieck und Vierecken (Nachweis, Innenwinkel, einfache Flächen) |
| 7 | `vektorprodukt` | 16.3 (Teil) | Vektorprodukt als Rechenvorschrift, Orthogonalität zu beiden Vektoren, Zusammenhang mit Kollinearität |
| 8 | `uebungsaufgaben-vektoren` | | Aufgaben im Abiturstil zum ganzen Unterbereich |

Was bewusst **nicht** in Vektoren steht und was die späteren Unterbereiche übernehmen oder per Verweis nutzen:
- Abstand Punkt und Punkt (BPE 16.6) ist Modul 4. Die Geraden und Ebenen verweisen darauf.
- Abstand Punkt und Gerade, paralleler Geraden, Punkt und Ebene, Gerade und Ebene, paralleler Ebenen, Lotfußpunkt und Spiegelung an einer Ebene (BPE 16.6) gehören zu Geraden bzw. Ebenen.
- Winkel zwischen Geraden und Winkel zu den Koordinatenebenen (BPE 16.1, 16.2) rechnen mit dem Skalarprodukt aus Modul 5, die Module der Geraden verweisen darauf und erklären nur die Anwendung auf Richtungsvektoren.
- Die Deutung des Normalenvektors und alle Ebenengleichungen (BPE 16.3 bis 16.5) gehören zu den Ebenen. Das Vektorprodukt als Rechenvorschrift steht in Modul 7, die Ebenen nutzen es.
- Volumen von Quader und Pyramide (BPE 16.6) gehören zu den Ebenen bzw. zu Flächen und Volumen.
- Der Flächeninhalt von Parallelogramm und Dreieck über den Betrag des Vektorprodukts steht nicht im Bildungsplan. Er kommt nur als gekennzeichnete Vertiefung in Modul 7, wenn die Lehrkraft das will.


### Regeln für alle Module, Land-Link und LGS-Verweis (Entwurf `entwurf/regeln-alle-module`, 13.11.2026)

Auf Wunsch der Lehrkraft gelten drei Regeln jetzt auch für die älteren Module. Alle sind sichtbare Änderungen freigegebener Module und brauchen die Freigabe nach der Vorschau.
- **Kreuzprodukt:** 122 Stellen in `vektorprodukt`, `abstaende-geraden`, `uebungsaufgaben-vektoren`, `uebungsaufgaben-geraden`, im Modultitel „Das Vektorprodukt (Kreuzprodukt)“ und in `content/themen.json`.
- **Umbruchregel:** Geometrie: `punktRechnung` und `schnittpunktRechnung`, Gleichungssystem in `gegenseitige-lage-geraden`, Rechnungen in `geradengleichung`, `skalarprodukt-orthogonalitaet`, `uebungsaufgaben-vektoren`, `zwei-ebenen`. Integralrechnung: Ketten mit `{}+`, `{}-` in `bestimmtes-integral`, `flaeche-kurve-x-achse`, `flaeche-zwischen-kurven`, `rotationsvolumen`, `integral-hinfuehrung`, `uebungsaufgaben-integralrechnung` sind zusammengezogen, in einzeln ausgerechnete Teilgleichungen zerlegt oder in der schmalen Form kleiner gesetzt. Dabei ändern sich einzelne Rechenzeilen sichtbar (zum Beispiel die Untersumme im Beispiel mit drei Streifen jetzt als vier kurze Gleichungen).
- **Feine Raumdarstellung:** zentral in `Raumbild` (Standard an), keine Änderung an den einzelnen Modulen.
- **Land-Link:** Baustein `Landesaufgaben` in den fünf Übungsmodulen, Seite: https://www.schule-bw.de/faecher-und-schularten/berufliche-schularten/berufliches-gymnasium-oberstufe/allgemeine-faecher/mathematik/musterpruefungen (Musterprüfungen des Landes mit Lösungen, Fund über die Suche, die Seite war aus der Entwicklungsumgebung nicht abrufbar, die Lehrkraft bestätigt den Link). Echte Abituraufgaben früherer Jahre stehen dort nach der Suche nicht.
- **LGS-Verweis:** `funktionsterme-aufstellen` verweist im Erklären (Gleichungssysteme lösen) auf `gauss-algorithmus`, `loesbarkeit-lgs` und `uebungsaufgaben-lgs`, im Entdecken (Labor 2) auf `gauss-algorithmus`.
- **Test:** `tests/regeln-alle-module.test.tsx` (Kreuzprodukt, Umbruch, Land-Link, LGS-Verweis).

Offen: Bei 320 px laufen die Vektorzeilen der Lösungsschritte in den Modulen `geradengleichung`, `zwei-ebenen`, `uebungsaufgaben-vektoren` und `gegenseitige-lage-geraden` innen über (bekannte Ausnahme der Vektorzeilen, vorher gab es dort Fortsetzungszeilen mit `{}+`). Die Befunde von `uebungsaufgaben-abiturstil`, `uebungsaufgaben-geraden`, `funktionsterme-aufstellen` und `abstaende-geraden` bestanden schon auf `main`.
