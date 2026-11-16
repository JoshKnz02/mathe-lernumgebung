# Analyse der Lernumgebung gegen den Bildungsplan 2021

Stand 16.11.2026 (überarbeitet), Grundlage `origin/main` (Commit 6395764, 63 freigegebene Module im Basiskurs `abitur-2027`). Dieses Dokument hält fest, was gut ist und was verbessert werden sollte. Es ändert nichts an den Modulen. Jede Maßnahme, die ein freigegebenes Modul oder einen gemeinsamen Baustein sichtbar ändert, läuft nach `CLAUDE.md` über einen Entwurfsbranch mit Vorschau und Freigabe.

## 1. Rahmen

Angaben der Lehrkraft (16.11.2026):

- Die Schule ist ein **Wirtschaftsgymnasium**. Als Matrizeneinheit gilt damit BPE 19 (Beschreibung von Produktionsprozessen durch Matrizen), BPE 20 und 21 entfallen.
- **Stochastik (BPE 17) und Matrizen (BPE 19) sind geplant.** Der Kurs behandelt sie in den kommenden Wochen, die Module werden danach ergänzt. Dass sie fehlen, ist deshalb kein Mangel der Umgebung. Abschnitt 5 enthält dazu nur Hinweise für die Planung.

Bewertet wird also der gebaute Teil: Trigonometrische Funktionen (BPE 10), zusammengesetzte Funktionen (BPE 11), Differenzialrechnung (BPE 6, 12, 14, 15), Integralrechnung (BPE 13), LGS (BPE 18), Vektorgeometrie (BPE 7, 16), dazu die übergreifenden Einheiten Problemlösen (BPE 8) und Modellieren (BPE 9).

Vorgehen und Grenzen:

- Alle Inhalte der Inhaltsspalte dieser Einheiten wurden per Stichwortsuche in allen 63 Modulen gesucht, die Treffer wurden an der Stelle im Modultext nachgelesen. Die BPE-Angaben aller `meta.json` wurden mit den Inhalten verglichen.
- Vollständig gelesen wurden Zusammenfassungen und Erklärteile ausgewählter Module (Änderungsraten, Kurvendiskussion, Integralfunktion, Operatorenseite der Übungsaufgaben) sowie die Bausteine `Aufgabe`, `Beobachtung` und die Seite „Wiederholen und Üben“.
- Nicht jede der knapp 700 Aufgaben wurde einzeln gelesen oder nachgerechnet. Die Rechenwerte sind durch die vorhandenen Tests abgesichert, das wurde hier nicht wiederholt.
- Es gab keine Browserprüfung und keine Erprobung mit Lernenden. Didaktische Urteile sind Einschätzungen.
- Befunde mit dem Vermerk „Stichwortsuche“ bedeuten, dass ein Begriff nicht gefunden wurde. Vor einer Änderung wird die Stelle noch einmal gelesen.

## 2. Kurzfassung

**Gut:** Der gebaute Teil deckt die Inhaltsspalte des Bildungsplans fast vollständig ab und ist fachlich genauer als übliche Schulbücher. In den gelesenen Teilen habe ich keinen fachlichen Fehler gefunden. Aufbau, Labore, gestufte Hilfen und Ich-Kann-Listen passen zu dem, was der Bildungsplan vom Einsatz digitaler Werkzeuge erwartet.

**Zu verbessern**, nach Gewicht:

1. Zahleneingaben werden nur als richtig oder falsch bewertet (V1).
2. Begründen, Erläutern und Beurteilen kommen fast nur als Auswahlfrage vor (V2).
3. Zwei verbindliche Inhalte der Differenzialrechnung fehlen: nicht differenzierbare Funktionen (V3) und das Deuten im Sachzusammenhang (V4).
4. Modellieren und Problemlösen sind nicht durchgehend ausdrücklich (V5, V6).
5. Umfang ohne Wegweiser, kein vermischtes Üben, Vermutungen ohne Festlegung (V7 bis V9).
6. Kleinere fachliche Lücken und Metadaten (V10 bis V13).

## 3. Was gut ist

### Fachlich

- **Abdeckung.** Auch Inhalte, die oft fehlen, sind da: Summenschreibweise von Ober- und Untersumme, Eigenschaften des bestimmten Integrals, Integrationsgrenze bei gegebenem Integralwert, Nachweis der Volumenformeln für Kegel und Kugel (BPE 13), Ableitung von Potenzen mit nicht natürlichen Exponenten und von ln (BPE 12.2), Prüfen, ob eine Gerade Tangente ist (BPE 12.5), Wendepunkt als Punkt größter Steigung (BPE 12.6), Achsenabschnittsform, Spurpunkte und Spurgeraden (BPE 16.3, 16.4), Parameter in Lageaufgaben und das Angeben von Geraden und Ebenen mit gegebener Lage (BPE 16.2, 16.5), LGS mit Parameter und Vektorschreibweise der Lösungsmenge (BPE 18.1), Spiegelung an der y-Achse bei negativem b und Lösungen mit ganzzahligem Parameter (BPE 10.2, 10.5).
- **Begriffliche Genauigkeit.** Notwendige und hinreichende Bedingungen sind getrennt und mit Gegenbeispielen belegt (x⁴ und x⁵). Integral und Flächeninhalt werden unterschieden, ebenso Verschiebung und zurückgelegte Strecke. Der Hauptsatz nennt die Voraussetzung Stetigkeit und grenzt sie von der Differenzierbarkeit ab. Monotonie und Krümmung werden ausdrücklich auseinandergehalten.
- **Richtige Grenzen.** Winkel zwischen Gerade und Ebene, Winkel zwischen zwei Ebenen und der Abstand windschiefer Geraden fehlen zu Recht, der Bildungsplan verlangt sie nicht. Was über den Plan hinausgeht (Spatprodukt, Quotientenregel, Mittelwert), ist als Vertiefung gekennzeichnet.
- **Absicherung.** Erwartete Werte sind in Tests unabhängig geprüft, Unstimmigkeiten der Arbeitsblätter sind gemeldet und in `docs/themen/` festgehalten. Das ist für Material zum Selbstlernen entscheidend, weil dort niemand einen Fehler auffängt.

### Didaktisch

- **Feste Abfolge.** Erklären, Entdecken, Überprüfen, Zusammenfassung mit einer Vermutungsfrage vor jedem Labor. Erklärt wird nur, was auf Vereinbarung beruht, Zusammenhänge werden entdeckt. Das entspricht den Punkten des Bildungsplans zu digitalen Werkzeugen (Entdecken von Zusammenhängen, Darstellungswechsel, Kontrolle eigener Rechnungen).
- **Darstellungswechsel (K4).** Term, Schaubild, Tabelle und Sachsituation stehen durchgehend nebeneinander, Lösungen haben Kontrollschaubilder, die Raumbilder stützen die Vorstellung in der Vektorgeometrie.
- **Umgang mit Fehlern.** Die falschen Antworten der Auswahlfragen sind typische Fehler mit kurzer Begründung, die Zusammenfassungen nennen typische Fehler ausdrücklich.
- **Konstruktive Unterstützung.** Gestufte Hilfen und schrittweise Lösungen statt einer Musterlösung auf einen Klick.
- **Selbstdiagnose.** Die Ich-Kann-Listen prüfen die Selbsteinschätzung an einer Kontrollaufgabe und verweisen auf das passende Modul. Das ist mehr als eine Ankreuzliste.
- **Prüfungsnähe.** Übungsmodule im Abiturstil mit Operatoren, Anforderungsbereichen und Bewertungseinheiten, getrennt nach ohne und mit Hilfsmittel.
- **Vernetzung im Kleinen.** Vorwissen wird mit `Modulverweis` verlinkt und nicht wiederholt.
- **Sprache.** Fachwörter werden erklärt, die Begriffe entsprechen denen deines Unterrichts.

## 4. Was verbessert werden sollte

### V1. Rückmeldung bei Zahleneingaben (Priorität hoch, Aufwand mittel)

Beleg: `src/components/Aufgabe.tsx` kennt nur „richtig“, „noch nicht richtig“ und „keine gültige Zahl“.

Wer −3 statt 3 eingibt, erfährt nicht, dass nur das Vorzeichen falsch ist. Zu Hause folgt dann der Griff zur Lösung, und der Lernanlass ist weg. Die Auswahlfragen leisten diese Diagnose schon, die Rechenaufgaben nicht.

Vorschlag: Der Baustein bekommt je Feld eine optionale Liste von Fehlerbildern (erwarteter falscher Wert, kurze Rückmeldung). Beispiele: Vorzeichenfehler, Gradmaß statt Bogenmaß, f(x₀) statt f′(x₀), Integral statt Flächeninhalt, vertauschte Grenzen, Richtungsvektor statt Punkt. Ohne Liste bleibt alles wie bisher. Ein Test prüft, dass kein Fehlerbild mit dem richtigen Wert zusammenfällt. Die Listen ergeben sich aus den „typischen Fehlern“ der Zusammenfassungen. Erprobung zuerst in zwei Modulen.

### V2. Begründen, Erläutern, Beurteilen (Priorität hoch, Aufwand mittel)

Beleg: „Erläutere“ steht in einem Modul, „Beurteile“ in drei. „Begründe“ steht in 24 Modulen, fast immer als Auswahlfrage oder als Hinweis, man solle begründen können. Die Themendateien vermerken mehrfach, das freie Begründen entfalle, weil es nicht automatisch prüfbar sei.

Technisch stimmt das, didaktisch ist es eine Schieflage: Geübt wird, was sich prüfen lässt, und nicht, was der Bildungsplan mit seinen Operatoren verlangt (K1 Argumentieren, K6 Kommunizieren). Eine Begründung auszuwählen ist Wiedererkennen und kein Formulieren.

Vorschläge, nach Aufwand geordnet:

1. **Aufträge für das Heft.** Bei „Zeigen“ und „Begründen“ ausdrücklich: „Schreibe die Begründung in dein Heft, vergleiche dann.“ Kostet fast nichts.
2. **Selbsterklärung mit Kriterien.** Neuer Baustein: Freitextfeld (nur im Arbeitsspeicher), danach eine Musterbegründung mit drei bis vier Kriterien zum Abhaken („Ich habe den Vorzeichenwechsel genannt“). Keine automatische Bewertung, aber eine eigene Formulierung und ein Abgleich.
3. **Begründung ordnen.** Schritte eines Nachweises in die richtige Reihenfolge bringen, mit einem falschen Schritt darunter. Automatisch prüfbar.
4. **Fehler finden.** Eine ausgeführte Lösung mit einem Fehler, gesucht sind Zeile und Art des Fehlers. Ansätze gibt es, ein durchgehendes Format fehlt.

### V3. BPE 12.1: nicht differenzierbare Funktionen (Priorität hoch, Aufwand klein)

Beleg: „differenzierbar“ und „Knick“ kommen in keinem Modul der Differenzialrechnung vor, nur nachträglich in `integralfunktion`. Die Zielformulierung ist verbindlich: Existenz des Grenzwerts erläutern, Graphen nicht durchgängig differenzierbarer Funktionen beschreiben.

Ohne Gegenbeispiel bleibt der Grenzwert der Sekantensteigungen eine Selbstverständlichkeit, der Begriff Ableitung wird nicht geschärft.

Vorschlag: Ergänzung in `aenderungsraten`. Das Sekantenlabor bietet eine Funktion mit Knick an (stückweise definiert, der Betrag in Worten). Auftrag: von links und von rechts annähern, die Steigungen laufen auf zwei verschiedene Werte, also gibt es dort keine Tangente und keine Ableitung. Dazu eine Auswahlfrage mit Schaubildern und eine Aussage in der Ich-Kann-Liste. `integralfunktion` verweist dann auf diesen Abschnitt.

### V4. BPE 12.8: Deuten im Sachzusammenhang (Priorität hoch, Aufwand mittel)

Beleg: Kein `meta.json` nennt 12.8. Sachzusammenhänge gibt es in `aenderungsraten` und in den Übungsaufgaben. Das Deuten von Krümmung und Wendepunkt im Kontext („die Zunahme ist am größten“, „der Bestand wächst weiter, aber langsamer“) wird nirgends eingeführt und geübt (Stichwortsuche).

An diesem Aufgabentyp gehen in Prüfungen viele Punkte verloren, weil richtig gerechnet und falsch gedeutet wird: Vorzeichen von f′ gegen Vorzeichen von f″, Einheit der Änderungsrate, Bestand gegen Änderungsrate. Am Wirtschaftsgymnasium kommt die Sprache der Wirtschaftsfächer dazu (Grenzkosten, Gewinnschwelle, abnehmender Zuwachs), der Bildungsplan nennt Kosten und Grenzkosten in BPE 6.1 und Produktionsprozesse in BPE 12.8.

Vorschlag: Ein Anwendungsmodul nach dem Vorbild `modellierungsaufgaben`, Arbeitstitel „Ableitungen im Sachzusammenhang“, nach `ausfuehrliche-kurvendiskussion`. Inhalt: Übersetzungstabelle zwischen Alltagssprache und Bedingung, Deutungsaufgaben als Auswahlfragen mit typischen Fehldeutungen, zwei bis drei durchgehende Kontexte mit eigenen Zahlen, davon einer aus der Wirtschaft. Das Modul bereitet zugleich die Bestandsdeutung in `integral-hinfuehrung` vor.

### V5. BPE 9: Modellierungskreislauf und Modellkritik (Priorität mittel)

Beleg: Kein Modul trägt 9.1, „Modellierungskreislauf“ kommt nicht vor. Modellkritik steht vereinzelt (Dose in `optimierung`, Güte der Anpassung in `modellierungsaufgaben`). Regression mit digitalen Werkzeugen ist nur ein Hinweis in `funktionsterme-aufstellen`.

Die Module führen bis zum Ergebnis und zur Deutung, die Rückfrage an das Modell fehlt als feste Gewohnheit.

Vorschlag:

1. Kleiner gemeinsamer Baustein mit dem Kreislauf als Schaubild, in `modellierungsaufgaben`, `modellieren-geraden` und `optimierung` im Abschnitt zum Vorgehen.
2. Jede Modellierungsaufgabe endet mit einer Frage zur Gültigkeit („Für welche Zeiten ist das Modell sinnvoll?“, „Was vernachlässigt es?“).
3. Ein Labor mit Messpunkten, Ausgleichskurve und Abweichungen. Ob die Regression mit dem Taschenrechner geübt wird, entscheidest du.
4. BPE 9.1 in den `meta.json` der drei Module ergänzen.

### V6. BPE 8: Problemlösen nur in der Vektorgeometrie (Priorität mittel)

Beleg: `problemloesen-vektorgeometrie` und die Abschnitte „Problemlösen“ in `uebungsaufgaben-geraden` und `uebungsaufgaben-ebenen`. In den Übungsmodulen der Analysis und der LGS gibt es keinen solchen Abschnitt.

Der Bildungsplan will Problemlösen über alle Themen hinweg. Vorschlag: In `uebungsaufgaben-abiturstil` und `uebungsaufgaben-integralrechnung` je ein Abschnitt mit zwei offenen Aufgaben, bei denen das Verfahren nicht genannt ist. Die Strategien werden beim Namen genannt (rückwärts arbeiten, Sonderfall, auf Bekanntes zurückführen, Skizze). Die Strategieseite aus `problemloesen-vektorgeometrie` wird dafür ein gemeinsamer Baustein.

### V7. Umfang ohne Wegweiser (Priorität mittel)

Beleg: `produkt-kettenregel` hat 32 Aufgaben, `funktionsterme-aufstellen` 26, `ableitungsregeln` und `tangenten` je 24, `optimierung` 22. Eine durchgehende Kennzeichnung nach Niveau gibt es nicht.

Für schwächere Lernende ist ein Abschnitt mit über 20 gleich aussehenden Aufgaben eine Hürde, stärkere rechnen zu lange im Anforderungsbereich I. Vorschlag: Jede Aufgabe trägt ihren Anforderungsbereich (I, II, III, die Begriffe stehen schon auf der Operatorenseite). Am Anfang von „Überprüfen“ steht ein Mindestpfad („Wenn dir die Aufgaben 2, 5 und 9 gelingen, beherrschst du das Modul“) und eine grobe Zeitangabe.

### V8. Kein vermischtes Üben (Priorität mittel)

Beleg: „Wiederholen und Üben“ ist eine Liste aller Module (`src/app/seiten/seiten.tsx`). Geübt wird innerhalb eines Moduls, also immer mit bekanntem Verfahren. Nur die Übungsaufgaben im Abiturstil mischen.

Vorschläge:

1. **Startklar-Prüfung** am Anfang jedes Moduls: drei kurze Fragen zum vorausgesetzten Stoff mit Verweis auf das passende Modul.
2. **Gemischte Wiederholung** auf der Seite „Wiederholen und Üben“: je Themenbereich einige Kontrollaufgaben der Ich-Kann-Listen in zufälliger Reihenfolge, ohne Nennung des Verfahrens. Die Aufgaben gibt es schon.

### V9. Vermutungen ohne Festlegung (Priorität mittel, Aufwand klein bis mittel)

Beleg: Die Vermutungsfrage steht als Text, die Beobachtung lässt sich sofort aufklappen (`Beobachtung.tsx`).

Eine Vermutung wirkt nur, wenn man sich festlegt. Vorschlag: Vor dem Aufklappen eine kurze Festlegung, entweder eine Auswahl aus zwei bis drei Vermutungen oder ein Textfeld. Als optionaler Parameter des Bausteins, bestehende Module bleiben unverändert, bis sie umgestellt sind.

### V10. Kleinere Lücken in BPE 12 (Priorität mittel)

- **12.4, Skizzieren von K_f aus K_f′:** In `docs/themen/differentialrechnung.md` als Lücke vermerkt. `stammfunktionen` enthält das grafische Zuordnen, das Skizzieren selbst fehlt (Stichprobe). Vorschlag: Baustein `Skizzenaufgabe` um Farben, Texte und Prüfregel als Parameter erweitern (abwärtskompatibel) und in `stammfunktionen` eine Skizzenaufgabe in der Gegenrichtung ergänzen. Die Prüfung muss jede Verschiebung in y-Richtung zulassen, so wird die Nicht-Eindeutigkeit sichtbar.
- **12.7, Wertemenge:** Sie kommt nur in der Ich-Kann-Liste und den Übungsaufgaben vor, ein erklärender Abschnitt fehlt (in der Themendatei vermerkt). Vorschlag: kurzer Abschnitt in `ausfuehrliche-kurvendiskussion` (Wertemenge aus Extrempunkten, Randwerten und globalem Verhalten).
- **12.7, strenge Monotonie:** Zu prüfen ist, ob als Merksatz steht, dass f′ größer 0 genügt, aber nicht nötig ist. In `kurvendiskussion` ist das an einem Beispiel sichtbar, als Merksatz habe ich es nicht gefunden.

### V11. BPE 10.5: numerische Lösung (Priorität niedrig)

Beleg: In der Inhaltsspalte steht „Numerische Lösung“ (Hinweis: Wertetabelle), in `trigonometrische-gleichungen` nicht gefunden (Stichwortsuche). Vorschlag: ein Auftrag mit einer Gleichung, die sich nicht umkehren lässt (Sinus gleich einer Geraden), eingegrenzt mit Wertetabelle und Vorzeichenwechsel.

### V12. Metadaten und Schreibweise (Priorität niedrig, Aufwand sehr klein)

- `funktionsterme-aufstellen` trägt 3.3 und 4.4, aber nicht 14.1, obwohl es die Ansätze dieser Einheit behandelt.
- 12.8 und 9.1 trägt kein Modul (siehe V4, V5).
- Die Grundvorstellung lokale Linearität (Einleitung von BPE 12) steht nur in Aufgabe 12 von `tangenten`. Ein Satz in der Zusammenfassung würde sie sichern.
- „Differentialrechnung“ (27 Stellen) steht neben „Differenzialquotient“ (8 Stellen). Der Bildungsplan schreibt mit z. Einheitlich wäre besser, die Modul-ID bleibt.
- Der Bildungsplan sagt „Mittellinie“, die Module sagen nach deiner Vorgabe „Ruhelage“. Vorschlag: „Mittellinie“ einmal in `lage-im-koordinatensystem` in Klammern nennen, weil der Begriff in fremden Aufgaben vorkommt.
- Das Thema „Optimieren und Modellieren“ in `content/themen.json` ist leer. Entweder füllen (Abschnitt 5) oder entfernen.

### V13. Vorwissen aus der Eingangsklasse (Priorität mittel, Entscheidung bei dir)

Beleg: Zu Polynom- und Exponentialgleichungen gibt es kein Modul (in der Themendatei vermerkt), die Ich-Kann-Liste verweist auf Teile anderer Module.

Kurvendiskussionen scheitern selten an der Ableitung und oft am Lösen von f′(x) = 0. Vorschlag: ein Wiederholungsmodul „Gleichungen lösen“ (Ausklammern, Satz vom Nullprodukt, Substitution, Exponentialgleichungen mit ln) mit einer Entscheidungshilfe, welches Verfahren zu welcher Gleichung passt.

### Weitere Punkte mit niedriger Priorität

- **Leitfrage zum Einstieg.** Jedes Modul beginnt mit einer Frage in ein bis zwei Sätzen mit Bild (wie der Rennwagen in `aenderungsraten`), die die Zusammenfassung ausdrücklich beantwortet. Bei welchen Modulen das schon so ist, habe ich nicht durchgehend geprüft.
- **Auswertung der Ich-Kann-Listen.** Sie geht beim Schließen verloren. Ohne Datenspeicherung hilft ein Knopf „Auswertung drucken“. Eine Speicherung im Browser wäre eine Datenschutzentscheidung und nur mit deiner Zustimmung denkbar.
- **Einbettung in den Unterricht.** Je Modul ein kurzer Abschnitt in `docs/` mit Einsatzszenario, Zeitbedarf, Partnerauftrag und Sicherung im Heft. Die Umgebung ist für Einzelarbeit gebaut, der Bildungsplan nennt Kooperationsphasen und das Vergleichen von Lösungswegen.

## 5. Hinweise für die geplanten Themen

Keine Befunde, nur Vorschläge für den Bau. Zuschnitt und Benennung der Module entscheidest du anhand deiner Arbeitsblätter.

### Stochastik (BPE 17, 45 Stunden)

Die Stochastik eignet sich für das Konzept der Umgebung besonders, weil der Bildungsplan Simulationen ausdrücklich verlangt. Labore mit erkennbarem Mehrwert:

- 17.1: Simulation mit wachsender Versuchszahl (empirisches Gesetz der großen Zahlen).
- 17.3: Wechsel zwischen Baumdiagramm und Vierfeldertafel mit denselben Zahlen. Die Verwechslung der beiden bedingten Wahrscheinlichkeiten ist der typische Fehler und gehört in die Auswahlfragen.
- 17.6, 17.7: Histogramm der Binomialverteilung mit Reglern für n und p, kumulierte Wahrscheinlichkeit als markierte Säulen. Typische Fehler bei „mindestens“, „höchstens“, „mehr als“ als Fehlerbilder (V1).
- 17.9: Wahrscheinlichkeit als Fläche unter der Dichtefunktion mit Verweis auf `bestimmtes-integral`.
- 17.11: viele simulierte Stichproben und der Anteil der Konfidenzintervalle, die p überdecken. Das ist der Inhalt mit den hartnäckigsten Fehlvorstellungen, hier bringt eine Simulation am meisten.

Die Vorschläge V1, V2 und V9 sollten vor dem Bau der Stochastikmodule entschieden sein, damit die neuen Module sie von Anfang an nutzen und nicht nachgerüstet werden müssen.

### Matrizen am Wirtschaftsgymnasium (BPE 19, 25 Stunden)

- Inhalte: Matrix und Sonderformen, Rechenoperationen einschließlich Inverse und Matrizengleichungen (19.1), ein- und zweistufige Produktionsprozesse als Text, Diagramm, Tabelle und Matrix (19.2), Verflechtungsmatrizen, Produktions- und Rohstoffvektor, Erlös, Kosten, Gewinn (19.3).
- Der Bildungsplan stellt Modellieren und Lösungsstrategien in den Mittelpunkt und ausdrücklich keine aufwändigen Rechnungen. Der Schwerpunkt der Module sollte deshalb auf dem Wechsel der Darstellungen und der Deutung der Zahlen liegen. Ein Labor, das Verflechtungsdiagramm, Tabelle und Matrix koppelt, hätte hier den größten Mehrwert.
- Die Inverse baut auf `gauss-algorithmus` auf, Verweis statt Wiederholung.
- `content/themen.json` beschreibt „Rechnen mit Matrizen“ als „Kleineres abschließendes Thema“. Bei 25 Stunden passt das nicht und sollte beim Bau angepasst werden.
- Das Leontief-Modell steht bei den Wahlgebieten (BPE 22) und ist nicht Teil von BPE 19.

### Optimieren (BPE 15) nach der Stochastik

BPE 15.1 verlangt Optimierung auch in der Stochastik (Beispiele: optimales p bei einer Binomialverteilung, Überbuchung) und nennt als Ziel, dass die Lernenden das Gemeinsame der Optimierungsprobleme erkennen. Vorschlag: ein kurzes vernetzendes Modul ohne neuen Stoff, das je eine Aufgabe aus Analysis, Vektorgeometrie und Stochastik unter die sechs Schritte der Strategie aus `optimierung` stellt. Am Wirtschaftsgymnasium bietet sich die Gewinnmaximierung als vierter Kontext an. Das leere Thema „Optimieren und Modellieren“ wäre der Ort dafür.

## 6. Maßnahmen in empfohlener Reihenfolge

| Nr. | Maßnahme | Befund | Art | Aufwand |
|---|---|---|---|---|
| 1 | Fehlerbilder im Baustein `Aufgabe`, Erprobung in zwei Modulen | V1 | gemeinsamer Baustein, Entwurfsbranch | mittel |
| 2 | Abschnitt zu nicht differenzierbaren Funktionen in `aenderungsraten` | V3 | Änderung an freigegebenem Modul | klein |
| 3 | Aufträge für das Heft, Baustein Selbsterklärung mit Kriterien | V2 | neuer Baustein | mittel |
| 4 | Festlegung vor der Beobachtung | V9 | gemeinsamer Baustein | klein bis mittel |
| 5 | BPE-Angaben und Schreibweise berichtigen | V12 | Metadaten, kleine Texte | sehr klein |
| 6 | Modul „Ableitungen im Sachzusammenhang“ | V4 | neues Modul | mittel |
| 7 | Stochastik und Matrizen bauen | Abschnitt 5 | neue Module, nach dem Unterricht | groß |
| 8 | Kennzeichnung der Anforderungsbereiche und Mindestpfad | V7 | alle Module, schrittweise | mittel |
| 9 | Modellierungskreislauf und Gültigkeitsfrage | V5 | Baustein und drei Module | mittel |
| 10 | Problemlösen in den Übungsmodulen der Analysis | V6 | Änderung an zwei Modulen | mittel |
| 11 | Skizzieren von K_f aus K_f′, Wertemenge | V10 | Baustein und zwei Module | mittel |
| 12 | Startklar-Prüfung und gemischte Wiederholung | V8 | Seite und Module | mittel |
| 13 | Wiederholungsmodul „Gleichungen lösen“ | V13 | neues Modul | mittel |
| 14 | Numerische Lösung trigonometrischer Gleichungen | V11 | kleine Änderung | klein |
| 15 | Vernetzendes Modul Optimieren | Abschnitt 5 | neues Modul, nach der Stochastik | klein |

Begründung: Die Punkte 1, 3 und 4 betreffen gemeinsame Bausteine. Sind sie vor der Stochastik entschieden, entstehen die neuen Module gleich in der besseren Form. Punkt 2 und 5 sind klein und schließen verbindliche Lücken. Punkt 6 ist die prüfungsnächste Lücke der Analysis und lässt sich in den Wochen bauen, in denen die Stochastik noch unterrichtet wird.

## 7. Entscheidungen, die bei dir liegen

1. Fehlerbilder im Baustein `Aufgabe` (V1): gewünscht, und auch für bestehende Module?
2. Freitext zur Selbsterklärung (V2): gewünscht? Der Text bleibt im Arbeitsspeicher, nichts wird gespeichert oder übertragen.
3. Festlegung vor der Beobachtung (V9): verpflichtend oder nur angeboten?
4. Leeres Thema „Optimieren und Modellieren“: füllen oder entfernen?
5. Eingangsklassenstoff (V13): gehört ein Wiederholungsmodul in diese Umgebung?
6. Druckansicht der Ich-Kann-Auswertung?
7. Welche Hilfsmittel sind zugelassen (Taschenrechner, Merkhilfe)? Davon hängen die Aufgaben „mit Hilfsmittel“, die Regression (V5) und in der Stochastik die kumulierten Wahrscheinlichkeiten ab. Ich habe das nicht geprüft.

## 8. Kritische Gegenprobe

- **Freies Begründen ohne Prüfung:** Ein Freitextfeld ohne Bewertung kann ignoriert werden. Ob Lernende es ernsthaft nutzen, zeigt nur die Erprobung. Der Aufwand ist gering, und ohne dieses Angebot kommen K1 und K6 in der Umgebung kaum vor.
- **Mehr Stoff in schon langen Modulen:** Die Ergänzungen V3, V10 und V11 vergrößern Module, die zum Teil bereits zu lang sind (V7). Sie sollten mit der Kennzeichnung der Anforderungsbereiche verbunden werden.
- **Fehlerbilder kosten Pflege:** Bei knapp 700 Aufgaben ist eine vollständige Nachrüstung nicht realistisch. Sinnvoll ist eine Auswahl der Aufgaben, bei denen ein Fehler bekannt und häufig ist. Ob die Rückmeldungen wirklich treffen, zeigt erst der Einsatz im Kurs.

## 9. Umsetzbarkeit im bestehenden Format (geprüft am Quelltext, 16.11.2026)

Geprüft wurden die betroffenen Bausteine und Bibliotheken: `Aufgabe.tsx`, `eingabe.ts`, `Beobachtung.tsx`, `Auswahlfrage.tsx`, `IchKann.tsx`, `ichkann.ts`, `Skizzenaufgabe.tsx` und `grafisch.ts`, `Sekantenlabor.tsx` und `aenderung.ts`, die Seite „Wiederholen und Üben“ und die Tests. Nichts davon wurde gebaut, die Aufwände sind Schätzungen.

Maßeinheit: Eine „Sitzung“ ist die Größenordnung eines bisherigen Modulbaus mit Tests, Browserprüfung und Vorschau. „Klein“ ist ein Teil einer Sitzung.

Alle Vorschläge sind ohne neue Abhängigkeit und ohne Datenspeicherung umsetzbar. Nur die gemischte Wiederholung (V8, zweiter Teil) passt nicht ohne Umbau in das Format.

| Vorschlag | Umsetzbar | Wie | Aufwand |
|---|---|---|---|
| V1 Fehlerbilder | ja | `Feld` bekommt optional `fehlerbilder` (falscher Wert, Rückmeldung). `bewerte` in `eingabe.ts` erkennt sie, die Rückmeldung steht in der vorhandenen Rückmeldezeile des Felds. Ohne Angabe unverändert. Der zentrale Test-Mock rendert die neuen Texte mit. | Baustein und zwei Pilotmodule: eine Sitzung. Danach je Modul klein. Alle rund 1360 Felder nachzurüsten ist nicht sinnvoll. |
| V1, Variante | ja | Vorzeichenfehler lassen sich ohne Daten je Aufgabe erkennen (Betrag stimmt, Vorzeichen nicht). Das wirkte sofort in allen Modulen und ist deshalb eine sichtbare Änderung aller freigegebenen Module. | klein, braucht deine Entscheidung |
| V2 Heftaufträge | ja | reiner Text bei „Zeigen“ und „Begründen“ | klein je Modul |
| V2 Selbsterklärung | ja | neuer Baustein nach dem Muster von `Aufgabe`: Textfeld (nur im Arbeitsspeicher), Knopf „Vergleichen“, Musterbegründung, Kriterien zum Abhaken | Baustein klein, je Einsatz klein |
| V2 Begründung ordnen | ja | neuer Baustein mit Knöpfen „nach oben“ und „nach unten“ statt Ziehen (Touch und Tastatur). Formelzeilen müssen bei 320 px passen. | eine halbe bis eine Sitzung |
| V2 Fehler finden | ja | ohne neuen Baustein: `Auswahlfrage`, die Antworten sind die Zeilen der Rechnung | klein je Aufgabe |
| V3 Knickfunktion | ja | `AenderungsFunktion` verlangt eine Ableitung `df`, die Tangente wird daraus gezeichnet. Nötig ist ein optionales Feld für die Knickstelle, dort wird die Tangente ausgeblendet und ein Hinweis gezeigt. Aufträge „von links“ und „von rechts“ gibt es schon. Dazu der Nachtrag in der Ich-Kann-Liste. | eine halbe bis eine Sitzung |
| V4 Modul Sachzusammenhang | ja | Standardformat mit eigenen Abschnitten wie `modellierungsaufgaben`, vorhandene Bausteine, Übersetzungstabelle nach dem Muster von `funktionsterme-aufstellen`. Ohne Arbeitsblatt frei nach dem Bildungsplan geschrieben. | eine Sitzung |
| V5 Kreislauf und Gültigkeit | ja | Kreislauf als kleiner Baustein (am Handy als senkrechte Liste), Gültigkeitsfragen als `Auswahlfrage` in drei freigegebenen Modulen. Ausgleichskurve: Das Anpassungslabor zeigt schon Abweichungen, eine berechnete beste Anpassung lässt sich ergänzen. | eine Sitzung |
| V6 Problemlösen Analysis | ja | Abschnitt „Problemlösen“ wie in `uebungsaufgaben-geraden` (neuer Eintrag in `meta.json`, neue Datei), Strategieseite als gemeinsamer Baustein. Vier eigene Aufgaben. | eine Sitzung |
| V7 Anforderungsbereich | ja | optionales Kennzeichen an `Aufgabe` und `Auswahlfrage`, angezeigt mit dem vorhandenen `Abzeichen`. Mindestpfad als Text. | Baustein klein. Einordnen von knapp 700 Aufgaben: je Themenbereich eine Sitzung, die Einordnung prüfst du. |
| V7 Zeitangabe | ja | neues optionales Feld in `meta.json`. Die Anzeige auf der Kachel ändert das abgenommene Erscheinungsbild. | klein, braucht deine Entscheidung |
| V8 Startklar-Prüfung | ja | ohne neue Technik: drei `Auswahlfrage` mit `Modulverweis` am Modulanfang | je Modul klein, für alle Module groß, also schrittweise |
| V8 gemischte Wiederholung | **nicht ohne Umbau** | Die Kontrollaufgaben stehen als fester Text in den Dateien der Ich-Kann-Listen und lassen sich nicht einzeln auf eine andere Seite holen. Passend zum Format wäre je Themenbereich ein eigenes Modul „Gemischte Wiederholung“ mit eigenen Aufgaben. | je Themenbereich eine Sitzung, oder zurückstellen |
| V9 Festlegung | ja | `Beobachtung` bekommt eine Option. Mit Auswahl aus Vermutungen braucht jede der 415 Stellen eigene Texte. Mit einem kurzen Textfeld braucht es keine Inhalte je Stelle und ließe sich für alle Module auf einmal einschalten. | Baustein klein. Auswahl-Variante je Modul klein, Textfeld-Variante gesamt klein, aber sichtbare Änderung aller Module. |
| V10 Skizzieren K_f | ja | `Skizzenaufgabe` liegt im Modul `grafisches-differenzieren`, Texte, Farben und Vergleich mit `df` sind fest. Nötig: Baustein nach `src/components`, Zielfunktion und Texte als Parameter, Prüfung bis auf eine Verschiebung in y-Richtung. | eine Sitzung mit der Aufgabe in `stammfunktionen` |
| V10 Wertemenge, Monotonie | ja | kurzer Abschnitt und zwei Aufgaben in `ausfuehrliche-kurvendiskussion`, ein Merksatz in `kurvendiskussion` | klein |
| V11 numerische Lösung | ja | ein Auftrag und eine Aufgabe mit Wertetabelle in `trigonometrische-gleichungen` | klein |
| V12 Metadaten | ja | `bpe` in `meta.json` wird in der Oberfläche nicht angezeigt (nur die BPE der Aussagen in den Ich-Kann-Listen). Keine sichtbare Änderung. | sehr klein |
| V12 Schreibweise | ja | „Differenzialrechnung“ betrifft den Titel des Themenbereichs in der Navigation, also sichtbar. Tests mit Titelvergleich werden angepasst. | klein, braucht deine Entscheidung |
| V13 Gleichungen lösen | ja | Standardmodul. Offen ist, in welchem Themenbereich es steht. | eine Sitzung |
| Druckansicht Ich-Kann | ja | Druckstile gibt es noch nicht. Die Einschätzung liegt im Arbeitsspeicher und kann in derselben Sitzung gedruckt werden. | eine halbe Sitzung |
| Hinweise für die Lehrkraft | ja | reine Dokumentation in `docs/`, keine Änderung der Seite | je Themenbereich klein |

Gesamtaufwand ohne flächendeckendes Nachrüsten: etwa zehn bis zwölf Sitzungen. Dazu kommt je Entwurfsbranch deine Prüfung der Vorschau.

Sinnvolle Bündelung:

1. **Bausteinpaket** (V1, V2 Selbsterklärung, V7 Kennzeichen, V9): vier kleine Erweiterungen, alle optional und standardmäßig aus. Nach der Regel für gemeinsame Bausteine mit Breitenprüfung aller betroffenen Module gegen `main`. Etwa zwei Sitzungen.
2. **Kleine fachliche Ergänzungen** (V3, V10 Wertemenge, V11, V12): eine bis zwei Sitzungen.
3. **Neue Module und Abschnitte** (V4, V5, V6, V10 Skizzieren, V13): je eine Sitzung.
4. **Laufend beim Überarbeiten eines Themenbereichs** (V1 Inhalte, V7 Einordnung, V8 Startklar, Heftaufträge).
