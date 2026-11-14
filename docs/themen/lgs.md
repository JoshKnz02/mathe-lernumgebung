# Lineare Gleichungssysteme

Modulhistorie, Entscheidungen und gemeldete Unstimmigkeiten (aus `docs/ENTWICKLUNG.md` ausgelagert, Wortlaut unverändert, nur der Zusatz „Live-Prüfung steht aus“ in den Überschriften entfällt, er steht gesammelt in `docs/STAND.md`).

## Themenbereich Lineare Gleichungssysteme (BPE 18), abgeschlossen (Modul 1 bis 4 freigegeben, 30.10.2026)

Bildungsplan (PDF der Lehrkraft, 10 Stunden): BPE 18.1 verlangt Lösen linearer Gleichungssysteme mit höchstens drei Unbekannten, in einfachen Fällen mit einem Parameter, den Gauß-Algorithmus neben den bekannten Verfahren, Matrixschreibweise, Lösungsvielfalt (eindeutig lösbar, unlösbar, mehrdeutig lösbar) und die Vektorschreibweise der Lösungsmenge. Die geometrische Deutung folgt in BPE 16 (Vektorgeometrie). Der Themenbereich `lineare-gleichungssysteme` hat Beschreibung und Symbol (`Gleichungssystem` in `Symbole.tsx`), er steht im Basiskurs `abitur-2027` nach der Integralrechnung, nicht in `abitur-2028` (das Thema kommt erst Ende Klasse 12).

Vereinbarte Reihenfolge der Module (Lehrkraft, 30.10.2026): 1. `gauss-algorithmus`, 2. `loesbarkeit-lgs` (Lösbarkeit und Lösungsvielfalt, Parameter, Vektorschreibweise), 3. ein Modul mit abiturähnlichen Aufgaben, 4. Ich-Kann-Liste (immer zuletzt, spätere Module werden davor eingetragen).

### Modul `gauss-algorithmus` (BPE 18.1)

Abschnitte: Erklären, Entdecken, Überprüfen, Zusammenfassung. Rechenlogik in `src/lib/lgs.ts` (ganzzahlige erweiterte Koeffizientenmatrix, Brüche für Lösungen, Umformungen `tausch`, `mal`, `teile`, `ersetze`, `gaussSchritte`, `loeseStufenform`, TeX-Hilfen, `folge` für Matrixfolgen), Baustein `Matrixfolge` (`src/components/Matrixfolge.tsx`, Pivot blau, erzeugte Null orange), Labor `Zeilenlabor.tsx` (drei Systeme, Umformungen von Hand, Probe mit bekannter Lösung nach jedem Schritt, Tipp, Verlauf). Tests: `tests/lgs.test.ts` (Zufallssysteme gegen die Cramersche Regel, jeder Schritt erhält die Lösung) und `tests/gauss-algorithmus-modul.test.tsx` (Beispiele, Aufgabenwerte, Darstellung).

Schreibweise: Zeilen Z₁, Z₂, Z₃, Rechenvermerk Z₂ → 3·Z₁ − 2·Z₂, Trennstrich vor der rechten Seite, Lösungsmenge L = {(…; …; …)}, Unbekannte x₁, x₂, x₃, Koeffizient a_ij mit Zeilen- und Spaltenindex. Die Matrix ist nur Kurzschreibweise, Matrizenrechnung kommt nicht vor.

Gemeldete Unstimmigkeiten im Arbeitsblatt (30.10.2026, im Modul korrekt umgesetzt): Umformung 2 ohne „Vielfaches“ (Lösungsblatt zusätzlich „Additioneiner“), keine Rechenvermerke im Beispiel, rechte Seite nicht abgesetzt, keine Lösungsmenge angegeben, verdrehter Satz zur erweiterten Koeffizientenmatrix, Spaltentausch nicht unter den Umformungen, „Gauss“ statt „Gauß“, Seitenangabe 294/17 vermutlich Tippfehler, GeoGebra `Treppennormalform` liefert die reduzierte Form. Das Arbeitsblatt behandelt nur den eindeutig lösbaren Fall.

Entscheidungen: Spaltentausch weggelassen, GeoGebra-Link nicht übernommen (das Zeilenlabor ersetzt die Kontrolle), Aufgaben, Zahlen und Systeme eigen (Repository öffentlich). Offen: Soll `funktionsterme-aufstellen` (BPE 14, freigegeben) auf das neue Modul verweisen? Das ändert ein freigegebenes Modul sichtbar und braucht die Entscheidung der Lehrkraft.

Praktisch: Bei 320 px sind Matrizen in Aufgabenboxen nur etwa 140 px breit. Das Modul verkleinert dort Matrizen über die Klasse `lgs-modul` (CSS am Ende von `app.css`) und bricht Gleichungen und Proben in zwei Zeilen um (`gleichungenTeX(m, true)`, `probeTeX`).

Offen bei der Lehrkraft: Live-Prüfung von `gauss-algorithmus`, danach Löschen des Entwurfsbranches `entwurf/gauss-algorithmus`.

### Modul `loesbarkeit-lgs` (BPE 18.1)

Abschnitte: Erklären, Entdecken, Überprüfen, Zusammenfassung. Im Basiskurs `abitur-2027` als 2. Modul des Themenbereichs, nicht in `abitur-2028`. Rechenlogik in `src/lib/lgs.ts` (neu: `auswerte`, `stufenMarke`, `loesungsmenge` und `loeseAllgemein` mit Parametern, `affinTeX`, `loesungsmengeTeX` in den Formen tupel, vektor und summe, auch mehrzeilig), Bausteine `Matrixfolge` (jetzt mit `beschriftung`, Zeilenmarken: Pivot blau, Nullzeile grün, Widerspruchszeile rosa) und `Umbruchformel`/`Loesungsformel` (`src/components/Umbruchformel.tsx`: einzeilig ab 48 rem, darunter mehrzeilig, CSS `formel-breit` und `formel-schmal`). Labore: `Loesbarkeitslabor` (Gauß Schritt für Schritt an sechs Systemen, Auswertung erst nach Klick) und `Parameterlabor` (Regler p, drei Systeme, Stufenform mit p von Hand, im Test gegen die Rechnung für ganzzahlige p von −10 bis 10). Tests: `tests/loesbarkeit.test.ts` (800 Zufallssysteme gegen den Rang über Unterdeterminanten) und `tests/loesbarkeit-lgs-modul.test.tsx`.

Schreibweise: Fälle „nicht lösbar“, „eindeutig lösbar“, „mehrdeutig lösbar“, Widerspruchszeile, Nullzeile, freie Unbekannte, Parameter t (bei zwei s und t, bei drei r, s, t), Lösungsmenge L = {(…; …; …) | t ∈ ℝ} und Vektorschreibweise als Stützvektor plus Parameter mal Richtungsvektor. Die Diagonalregel steht nur als Sonderfall (gleich viele Gleichungen wie Unbekannte, obere Dreiecksform).

Gemeldete Unstimmigkeiten in den Arbeitsblättern 2a und 2b (30.10.2026): zwei verschiedene Dreiecksformen (2a Nullen unten rechts, 2b unten links), die Diagonalregel auf Vorschlag 2 ergäbe fälschlich „nicht eindeutig“; handschriftliche Lösung 1d („eindeutig, da nur zwei Unbekannte“) falsch, richtig mehrdeutig (x₁ frei); „0 = 0 bedeutet mehrdeutig“ zu pauschal (mehr Gleichungen als Unbekannten); Diagonalregel nur für quadratische Systeme; Lehrbuchverweise uneinheitlich (207/5, 9, 208/18 gegen 175/5, 175/9, 208/13) und „2. Zeile minus 2 mal 1. Zeile“ muss „3. Zeile“ heißen; uneinheitliche Schreibweise der Lösungsmengen, Vektorschreibweise des Bildungsplans nur einmal handschriftlich.

Entscheidungen: Die Aufgabe zu den ganzzahligen, nicht negativen Paketmöglichkeiten (Sachbezug aus Blatt 2a) kommt in das Modul mit abiturähnlichen Aufgaben. Aufgaben, Zahlen und der Sachzusammenhang (Sportgeschäft) sind eigen, Lehrbuchaufgaben und der GeoGebra-Hinweis sind nicht übernommen.

### Modul `uebungsaufgaben-lgs` (BPE 18.1)

Abschnitte: Aufbau und Operatoren, Ohne Hilfsmittel (Aufgaben 1 bis 6), Mit Hilfsmittel (Aufgaben 7 und 8). Modul ohne neuen Stoff, im Basiskurs `abitur-2027` als 3. Modul des Themenbereichs, nicht in `abitur-2028`. Vorlage: Aufgabensammlung der Lehrkraft zu linearen Gleichungssystemen (Abitur und abiturähnliche Aufgaben, sechs Typen). Die Sammlung ist Original (Repository öffentlich, siehe `CLAUDE.md`): Alle Aufgaben sind frei geschrieben mit eigenen Systemen, Zahlen und Zusammenhängen, nur Typen, Niveau, Operatoren und BE folgen der Vorlage. Die Lehrkraft hatte „ein wenig abwandeln“ gesagt, das Modul geht bewusst weiter (Test: keines der Originalsysteme kommt vor). Typen: Schar mit Parameter in Koeffizient und rechter Seite (1), Lösungen in nichtnegativen ganzen Zahlen (2), Parameter mit Begründung der Fälle (3), Anzahl der Lösungen in Abhängigkeit von c, nie unendlich viele (4), zusätzliche Gleichung zu zwei Gleichungen (5), grafische Darstellung und ersetzte Gleichung (6), Düngemischung (7), Verkehrsknoten mit Skizze (8).

Technik: `daten.ts` (Systeme und Ergebnisse von Hand), `Bilder.tsx` (Gerade als `Messbild`, Skizze `Verkehrsknoten` als SVG), `Mengen.tsx` (Lösungsmenge mehrzeilig bei schmalen Breiten über `Umbruchformel`), `Hinweise.tsx`, `OhneHilfsmittel.tsx`, `MitHilfsmittel.tsx`. Test: `tests/uebungsaufgaben-lgs-modul.test.tsx` (jede Aufgabe gegen `loeseAllgemein`, Cramersche Regel und Abzählen, Parameter für ganzzahlige Werte von −60 bis 60, Operator und BE in jeder Teilaufgabe, keine Originalsysteme).

### Modul `ich-kann-liste-lgs` (BPE 18.1, 3.3, 4.4)

Ich-Kann-Liste des Themenbereichs (Nr. 1 bis 10 der Lehrkraft, ergänzt nach dem Bildungsplan: Nr. 11 Parameter und „!“ Transfer). Abschnitte: Anleitung, Grundlagen, Gauß-Algorithmus, Lösbarkeit und Lösungsmenge, Anwendungen, Auswertung. 12 Kontrollaufgaben mit eigenen Zahlen (Originale der Lehrkraft nicht übernommen). Technik: `daten.ts`, `werte.ts`, `Punkt.tsx`, Abschnittsdateien; in `app.css` verkleinerter Innenabstand der verschachtelten Kontrollaufgaben (nur `.lgs-modul`). Test: `tests/ich-kann-liste-lgs-modul.test.tsx` (Werte unabhängig über Einsetzen, Cramersche Regel, Bibliothek, Abzählen).

Offene Lücke: Zu Aussage 2 (einfache nichtlineare Gleichungssysteme) gibt es kein Modul, die Anleitung sagt das offen, die Kontrollaufgabe prüft das Einsetzungsverfahren (xy = 12, x − y = 1). Ob ein eigenes Modul entsteht, entscheidet die Lehrkraft.

Offen: Live-Prüfung aller vier Module, Löschen der Entwurfsbranches `entwurf/gauss-algorithmus`, `entwurf/loesbarkeit-lgs`, `entwurf/uebungsaufgaben-lgs`, Verweis aus `funktionsterme-aufstellen` auf die neuen Module (Entscheidung der Lehrkraft).

Nächste Module laut Lehrkraft: Übungsaufgaben im Abiturstil zum Thema, danach die Ich-Kann-Liste (immer zuletzt, spätere Module werden davor eingetragen). Offen: Verweis aus `funktionsterme-aufstellen` auf die neuen Module (ändert ein freigegebenes Modul sichtbar), Live-Prüfung beider Module, Löschen der Entwurfsbranches `entwurf/gauss-algorithmus` und `entwurf/loesbarkeit-lgs`.
