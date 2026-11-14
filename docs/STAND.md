# Stand und offene Punkte

Zu Sitzungsbeginn lesen. Wird bei jeder Freigabe aktualisiert (Datum, Modulzahl, nächster Schritt, offene Punkte).

## Stand (14.11.2026)

- Kurs `abitur-2027` (Basiskurs) hat 61 Module, `abitur-2028` sechs. Letzter Lauf „Veröffentlichen“: 92 (Modul `flaechen-volumen`), grün. Danach freigegeben: `uebungsaufgaben-ebenen` (14.11.2026, Lauf noch abzufragen).
- Vektorgeometrie: Unterbereich Vektoren 8, Geraden 7, Ebenen 9 Module freigegeben (zuletzt `flaechen-volumen`, Lauf 92, und `uebungsaufgaben-ebenen`). Plan und Zuschnitt: `docs/themen/vektorgeometrie.md`, `geraden.md`, `ebenen.md`.
- Dokumentation seit 14.11.2026 gegliedert: `CLAUDE.md` (allgemeine Regeln, wird immer geladen), `docs/FACHREGELN.md` (Regeln je Themenbereich), `docs/ARBEITSWEISE.md` (Prüfung, Skripte), `docs/ENTWICKLUNG.md` (Technik, Tests, Daten), `docs/themen/*.md` (Modulhistorie), `docs/archiv.md` (überholt).
- Hinweis zu „Live-Prüfung steht aus“: Es gilt für alle zuletzt freigegebenen Module, bis die Lehrkraft sie bestätigt (früher in jeder Überschrift vermerkt).

## Nächste Schritte

1. **Gemeinsame Ich-Kann-Liste Vektorgeometrie** (immer zuletzt, ohne Unterbereich, Abschnitte nach den drei Unterbereichen). Nach dem Bildungsplan ergänzte Aussagen kennzeichnen: Orthogonalität von Gerade und Ebene, Angeben von Geraden und Ebenen mit gegebener Lage, Achsenabschnittsform, Spurpunkte und Spurgeraden einer Ebene, Spiegelung an einer Ebene, Abstand paralleler Ebenen, Flächeninhalt über das Kreuzprodukt und Spatprodukt (Vertiefung).

## Offen bei der Lehrkraft

- Live-Prüfung der Läufe 89 bis 92 und des Moduls `uebungsaufgaben-ebenen` (Link zur Seite mathe-aufgaben.com, Vektorzeilen bei 320 px), besonders der Link zur Musterprüfungsseite des Landes (nur über die Suche gefunden), die Vektorzeilen der Lösungsschritte bei 320 px und das Pyramidenlabor. Außerdem der älteren Module (LGS, Vektoren, Geraden, Ebenen).
- Entwurfsbranches in GitHub löschen: alle `entwurf/…` der freigegebenen Module (zuletzt `entwurf/uebungsaufgaben-ebenen`, `entwurf/flaechen-volumen`, `entwurf/abstaende-ebenen`, `entwurf/regeln-alle-module`, `entwurf/bildtexte-oben`, `entwurf/gerade-und-ebene`, `entwurf/zwei-ebenen`). Der alte Entwurf Extremwertaufgaben auf `entwicklung/grundgeruest` (`89c983f`, nicht in `main`): kann er weg?
- Entscheidung: eigenes Modul zu Aussage 2 der LGS-Liste (nichtlineare Systeme)?
- Entscheidung: Raumbilder der älteren Module in der räumlichen Ansicht auf überlappende Beschriftungen nachsehen (in `abstaende-ebenen` überlappen vereinzelt Beschriftungen und Linien, nicht automatisch geprüft).
- Befunde der Übungsmodule im Abiturstil bei 320 px (7 Befunde, schon vor dem 13.11.2026 auf `main`), Zeitpunkt für die Browserprüfung am echten Handy.
- Ältere Entscheidungen (Stand 25.10.2026, `docs/themen/funktionen.md`): Ergänzungen Nr. 14 bis 17 der Ich-Kann-Liste Trigonometrie behalten oder streichen, Kurs `abitur-2028` weiter öffentlich oder `"nurVorschau": true`, Nutzungsrechte der GeoGebra-Links (`uzuzct74`, `q4tb33k6`), kurzer Abschnitt zur Symmetrie allgemeiner Schaubilder (Nr. 8) in Modul 3, nicht nachgebaut aus Arbeitsblatt 6: Aufgabe 5 und die Abbildungen der Abituraufgaben.

## Offen von Claude

- Ungenutzter Code `ersterTreffer` in `src/lib/projektion.ts`; `src/lib/ebenenbild.ts` wird von `einfuehrung-ebenen` noch nicht genutzt (eigene Kopien in dessen `Bilder.tsx`).
- Nicht nachgerechnet: Dreiecksmatrizen und Tabelle der Blätter 13 und 14, Abituraufgabe 2005/06 (nur Bild). In `gerade-und-ebene` und `zwei-ebenen` sind die Aufgaben nicht mit Werten im Browser bedient, die räumliche Ansicht der Ebenenmodule ist nicht angesehen.
- Pyramidenlabor in `flaechen-volumen`: Die Spitze liegt bei manchen Reglerstellungen außerhalb von −4 bis 4 und wird dann nicht gezeichnet (mit Hinweis).
