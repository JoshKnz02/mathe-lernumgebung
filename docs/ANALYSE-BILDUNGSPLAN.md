# Analyse der Lernumgebung gegen den Bildungsplan 2021

Stand 16.11.2026, Grundlage `origin/main` (Commit 6395764, 63 freigegebene Module im Basiskurs `abitur-2027`). Dieses Dokument hält Befunde und Änderungsvorschläge fest. Es ändert nichts an den Modulen. Jede Maßnahme, die ein freigegebenes Modul oder einen gemeinsamen Baustein sichtbar ändert, läuft nach `CLAUDE.md` über einen Entwurfsbranch mit Vorschau und Freigabe.

## 1. Grundlage und Grenzen

Geprüft wurde gegen den Bildungsplan Mathematik, Berufliches Gymnasium, erhöhtes Anforderungsniveau (2021): Vorbemerkungen (Kompetenzen K1 bis K6, Merkmale kompetenzorientierten Unterrichts, digitale Werkzeuge), BPE 6 bis 22 und die Operatorenliste.

Vorgehen:

- Alle Inhalte der Inhaltsspalte von BPE 6, 7 und 8 bis 18 wurden per Stichwortsuche in allen 63 Modulen gesucht und die Treffer an den Stellen im Modultext nachgelesen.
- Die BPE-Angaben aller `meta.json` wurden mit den Inhalten verglichen.
- Zusammenfassungen und Erklärteile ausgewählter Module wurden vollständig gelesen (Änderungsraten, Kurvendiskussion, Integralfunktion, Operatorenseite der Übungsaufgaben).
- Die Bausteine `Aufgabe`, `Beobachtung` und die Seite „Wiederholen und Üben“ wurden im Quelltext angesehen.
- Die in `docs/themen/*.md` schon festgehaltenen Lücken wurden einbezogen.

Nicht geleistet:

- Nicht jede der rund 700 Aufgaben wurde einzeln gelesen oder nachgerechnet. Die Rechenwerte sind durch die vorhandenen Tests abgesichert, das wurde hier nicht wiederholt.
- Keine Browserprüfung. Aussagen zur Wirkung auf Lernende sind didaktische Einschätzungen, keine Erprobung.
- Befunde mit dem Vermerk „Stichwortsuche“ beruhen darauf, dass ein Begriff nicht gefunden wurde. Vor einer Änderung wird die Stelle im Modul noch einmal gelesen.

## 2. Gesamturteil

Der gebaute Teil (Analysis ab BPE 10, Vektorgeometrie, LGS) ist fachlich sorgfältig und deckt die Inhaltsspalte des Bildungsplans fast vollständig ab, an vielen Stellen genauer als übliche Schulbücher (notwendige und hinreichende Bedingungen mit Gegenbeispielen, orientierter Flächeninhalt gegen Flächeninhalt, Stetigkeit gegen Differenzierbarkeit beim Hauptsatz). In den gelesenen Teilen habe ich keinen fachlichen Fehler gefunden.

Die Schwächen liegen woanders:

1. **Die größte Einheit des Bildungsplans fehlt ganz.** Stochastik (BPE 17) hat 45 Stunden und ist prüfungsrelevant. Dazu fehlt die Matrizeneinheit (BPE 19, 20 oder 21, 25 Stunden). Zusammen sind das 70 der 225 Stunden der Jahrgangsstufen.
2. **Das Kompetenzprofil ist einseitig.** Die Umgebung trainiert vor allem K5 (Rechnen, Verfahren) und K4 (Darstellungen). Begründen, Erläutern und Beurteilen (K1, K6) kommen fast nur als Auswahlfrage vor. Der Bildungsplan formuliert seine Ziele aber überwiegend mit genau diesen Operatoren.
3. **Die Rückmeldung auf Zahleneingaben ist nur richtig oder falsch.** Die Auswahlfragen diagnostizieren typische Fehler, die Rechenaufgaben nicht. Das ist der größte didaktische Hebel bei kleinem Aufwand.
4. **Einige verbindliche Einzelinhalte fehlen oder stehen am falschen Ort** (Abschnitt 4).

## 3. Abdeckung nach Bildungsplaneinheiten

| BPE | Thema | Stand | Befund |
|---|---|---|---|
| 6 | Änderungsrate, grafisches Differenzieren | abgedeckt | `aenderungsraten`, `grafisches-differenzieren`, `ableitungsregeln` |
| 7 | Vektoren, Grundlagen | abgedeckt | acht Module im Unterbereich Vektoren |
| 8 | Problemlösen | teilweise | nur in der Vektorgeometrie ausdrücklich (F7) |
| 9 | Modellieren | teilweise | kein Modul trägt 9.1, Kreislauf und Modellkritik nicht ausdrücklich (F6) |
| 10 | Trigonometrische Funktionen | abgedeckt | numerische Lösung von Gleichungen nicht gefunden (F8) |
| 11 | Verknüpfung, Verkettung, Umkehrung | abgedeckt | |
| 12 | Differenzialrechnung | weitgehend | 12.1 nicht differenzierbare Funktionen fehlen (F3), 12.8 ohne eigenes Modul (F4), 12.4 und 12.7 mit Lücken (F5) |
| 13 | Integralrechnung | abgedeckt | einschließlich Summenschreibweise, Eigenschaften, Grenze bei gegebenem Integralwert, Volumenformeln |
| 14 | Aufstellen von Funktionstermen | abgedeckt | Inhalt vorhanden, aber kein Modul trägt 14.1 (F9) |
| 15 | Optimieren | teilweise | Analysis und Abstand Punkt und Gerade vorhanden, Stochastik und Vernetzung fehlen (F2) |
| 16 | Vektorgeometrie, Vertiefung | abgedeckt | einschließlich Achsenabschnittsform, Spurgeraden, Parameteraufgaben, Angeben von Objekten mit gegebener Lage |
| 17 | Stochastik | **fehlt** | F1 |
| 18 | LGS | abgedeckt | einschließlich Parameter und Vektorschreibweise der Lösungsmenge |
| 19 bis 21 | Matrizen (eine Einheit je Richtung) | **fehlt** | F1, Richtung der Schule ist ungeklärt |
| 22 | Wahlgebiete | teilweise | Mittelwert vorhanden, Rest ist Wahl |

Gut gelöst und ausdrücklich nicht zu ändern: Die Winkel zwischen Gerade und Ebene sowie zwischen zwei Ebenen fehlen zu Recht, der Bildungsplan verlangt nur Gerade und Gerade sowie Gerade und Koordinatenebene. Der Abstand windschiefer Geraden fehlt ebenfalls zu Recht.

## 4. Fachliche Befunde

### F1. Stochastik und Matrizen fehlen (Priorität hoch)

Beleg: `content/themen.json` nennt „Stochastik“ und „Rechnen mit Matrizen“ ohne Module, der Kurs `abitur-2027` führt beide Themen nicht.

Vorschlag Stochastik, Zuschnitt entlang der Teilziele (Entscheidung über ein oder zwei Module je Punkt liegt bei dir):

1. Zufallsexperimente, relative Häufigkeit, Simulation (17.1). Labor: Würfelsimulation mit wachsender Versuchszahl, empirisches Gesetz der großen Zahlen.
2. Ergebnis, Ereignis, Mengenschreibweise (17.2).
3. Baumdiagramm, Vierfeldertafel, bedingte Wahrscheinlichkeit, Unabhängigkeit (17.3). Labor: Wechsel zwischen Baum und Vierfeldertafel mit denselben Zahlen.
4. Kombinatorik (17.4).
5. Zufallsgröße und Erwartungswert (17.5).
6. Bernoulli-Kette und Binomialverteilung (17.6, 17.7). Labor: Histogramm mit Reglern für n und p, kumulierte Wahrscheinlichkeit als markierte Säulen.
7. Erwartungswert, Standardabweichung, Glockenkurve (17.8).
8. Normalverteilung (17.9). Verbindung zur Integralrechnung: Wahrscheinlichkeit als Fläche, Verweis auf `bestimmtes-integral`.
9. Sigma-Regeln und Prognoseintervall (17.10).
10. Konfidenzintervall (17.11). Labor: viele simulierte Stichproben, Anteil der Intervalle, die p überdecken. Das ist der Inhalt mit den hartnäckigsten Fehlvorstellungen und der, bei dem eine Simulation am meisten bringt.
11. Übungsaufgaben im Abiturstil mit `Landesaufgaben`, danach die Ich-Kann-Liste.

Die Stochastik eignet sich für das Konzept der Umgebung besser als jedes bisherige Thema, weil der Bildungsplan Simulationen ausdrücklich verlangt (17.1, Hinweis zu 17.10).

Matrizen: Die Beschreibung „Kleineres abschließendes Thema“ in `themen.json` passt nicht zu 25 Stunden. Welche der drei Einheiten gilt, hängt von der Richtung des Gymnasiums ab (WG: BPE 19, TG: BPE 20, AG, BTG, EG, SGG: BPE 21). Das ist ungeklärt und vor jeder Planung zu nennen.

### F2. BPE 15 Optimieren ist nur zur Hälfte umgesetzt (Priorität mittel)

Beleg: `optimierung` (Analysis und Anwendungen, mit Randwerten und Gültigkeitsbereich) und `abstaende-geraden` tragen 15.1. Der Bildungsplan verlangt zusätzlich Optimierung in der Stochastik (Beispiel: optimales p bei einer Binomialverteilung, Überbuchung) und nennt als Ziel, dass die Lernenden das Gemeinsame der Optimierungsprobleme erkennen.

Vorschlag: Nach der Stochastik ein kurzes vernetzendes Modul ohne neuen Stoff, das je eine Aufgabe aus Analysis, Vektorgeometrie (minimaler Abstand zweier bewegter Objekte, steht schon in `modellieren-geraden`) und Stochastik unter dieselben sechs Schritte der Strategie stellt. Das leere Thema „Optimieren und Modellieren“ in `themen.json` wäre der Ort dafür. Wenn du das nicht willst, sollte das leere Thema entfernt werden.

### F3. BPE 12.1: nicht differenzierbare Funktionen fehlen in der Differentialrechnung (Priorität hoch)

Beleg: „differenzierbar“ und „Knick“ kommen in keinem Modul der Differentialrechnung vor, nur nachträglich in `integralfunktion`. Die Zielformulierung 12.1 ist verbindlich: Existenz des Grenzwerts erläutern, Graphen von nicht durchgängig differenzierbaren Funktionen beschreiben.

Fachlich ist das mehr als eine Formalie. Ohne ein Gegenbeispiel bleibt „der Grenzwert der Sekantensteigungen“ für Lernende eine Selbstverständlichkeit, und der Begriff Ableitung wird nicht geschärft.

Vorschlag: Ergänzung in `aenderungsraten`. Im Sekantenlabor eine Funktion mit Knick anbieten (stückweise definiert oder Betragsfunktion in Worten erklärt, das Betragszeichen ist laut Projektregel zu vermeiden). Auftrag: von links und von rechts annähern, die Sekantensteigungen laufen auf zwei verschiedene Werte, also gibt es keine Tangente und keine Ableitung an dieser Stelle. Dazu eine Auswahlfrage mit Schaubildern (wo ist die Funktion nicht differenzierbar) und eine Aussage in der Ich-Kann-Liste. Der Hinweis in `integralfunktion` kann dann auf diesen Abschnitt verweisen.

### F4. BPE 12.8: Deuten im Sachzusammenhang hat kein Modul (Priorität hoch)

Beleg: Kein `meta.json` nennt 12.8. Sachzusammenhänge gibt es in `aenderungsraten` und in den Übungsaufgaben, aber das Deuten von Krümmung und Wendepunkt im Kontext („die Zunahme ist am größten“, „der Bestand wächst weiter, aber langsamer“) wird nirgends eingeführt und geübt (Stichwortsuche).

Das ist der Aufgabentyp, an dem in Prüfungen die meisten Punkte verloren gehen, weil richtig gerechnet und falsch gedeutet wird (Vorzeichen von f′ gegen Vorzeichen von f″, Einheit der Änderungsrate, Verwechslung von Bestand und Änderungsrate).

Vorschlag: Ein Anwendungsmodul nach dem Vorbild `modellierungsaufgaben`, Arbeitstitel „Ableitungen im Sachzusammenhang“, nach `ausfuehrliche-kurvendiskussion`. Inhalt: Übersetzungstabelle zwischen Alltagssprache und Bedingung (wie die Übersetzungstabelle in `funktionsterme-aufstellen`, nur in der Gegenrichtung), dazu Deutungsaufgaben als Auswahlfragen mit typischen Fehldeutungen und zwei bis drei durchgehende Kontexte mit eigenen Zahlen. Es bereitet zugleich die Bestandsdeutung in `integral-hinfuehrung` vor.

### F5. Kleinere Lücken in BPE 12 (Priorität mittel)

- **12.4, Skizzieren von K_f aus K_f′:** In `docs/themen/differentialrechnung.md` als Lücke vermerkt. `stammfunktionen` enthält das grafische Zuordnen, das Skizzieren selbst fehlt (Stichprobe). Der Baustein `Skizzenaufgabe` ist auf K_f′ festgelegt. Vorschlag: Baustein um Farben, Texte und Prüfregel als Parameter erweitern (abwärtskompatibel) und in `stammfunktionen` eine Skizzenaufgabe in der Gegenrichtung ergänzen. Dabei wird die Nicht-Eindeutigkeit sichtbar: Jede richtige Skizze ist bis auf eine Verschiebung in y-Richtung richtig, die Prüfung muss das zulassen.
- **12.7, Wertemenge und globale Extrema:** Globale Extrema stehen in `optimierung`, die Wertemenge kommt nur in der Ich-Kann-Liste und den Übungsaufgaben vor. Ein erklärender Abschnitt fehlt, das ist in der Themendatei schon vermerkt. Vorschlag: kurzer Abschnitt in `ausfuehrliche-kurvendiskussion` (Wertemenge aus Extrempunkten, Randwerten und globalem Verhalten).
- **12.7, strenge Monotonie:** Die Definition steht in `grafisches-differenzieren`. Zu prüfen ist, ob der Unterschied zwischen „f′ größer 0 genügt“ und „f′ größer 0 ist nötig“ ausdrücklich gemacht wird. In `kurvendiskussion` ist er an einem Beispiel sichtbar, als Merksatz habe ich ihn nicht gefunden.

### F6. BPE 9 Modellieren: Kreislauf und Modellkritik sind nicht ausdrücklich (Priorität mittel)

Beleg: Kein Modul trägt 9.1. „Modellierungskreislauf“ kommt nicht vor. Modellkritik steht vereinzelt (Dose in `optimierung`, Güte der Anpassung im Anpassungslabor von `modellierungsaufgaben`). Regression mit digitalen Werkzeugen ist nur ein Hinweis in `funktionsterme-aufstellen`.

Der Bildungsplan verlangt, dass die Lernenden die Phasen nutzen und die Güte des Modells reflektieren. Die Module führen meist bis zum Rechenergebnis und zur Deutung, die Rückfrage an das Modell fehlt als feste Gewohnheit.

Vorschlag:

1. Ein kleiner gemeinsamer Baustein mit dem Kreislauf als Schaubild (Realsituation, reales Modell, mathematisches Modell, Lösung, Deutung und Prüfung), der in `modellierungsaufgaben`, `modellieren-geraden` und `optimierung` im Abschnitt „Vorgehen“ steht und die aktuelle Phase markiert.
2. Jede Modellierungsaufgabe endet mit einer Frage zur Gültigkeit („Für welche Zeiten ist das Modell sinnvoll?“, „Was vernachlässigt es?“) als Auswahlfrage mit Begründung.
3. Regression: ein Labor in `funktionsterme-aufstellen` oder `modellierungsaufgaben`, in dem Messpunkte und eine Ausgleichskurve mit Abweichungen gezeigt werden. Ob die Regression selbst mit dem Taschenrechner der Schule geübt wird, musst du entscheiden.
4. BPE 9.1 in den `meta.json` der drei Module ergänzen.

### F7. BPE 8 Problemlösen: nur in der Vektorgeometrie (Priorität mittel)

Beleg: `problemloesen-vektorgeometrie` und die Abschnitte „Problemlösen“ in `uebungsaufgaben-geraden` und `uebungsaufgaben-ebenen`. In den Übungsmodulen der Analysis und der LGS gibt es keinen solchen Abschnitt.

Der Bildungsplan will Problemlösen integrativ über alle Themen. Vorschlag: In `uebungsaufgaben-abiturstil` und `uebungsaufgaben-integralrechnung` je einen Abschnitt „Problemlösen“ mit zwei offenen Aufgaben ergänzen, bei denen das Verfahren nicht genannt ist, und die Strategien beim Namen nennen (rückwärts arbeiten, Sonderfall, auf Bekanntes zurückführen, Skizze). Die Strategieseite aus `problemloesen-vektorgeometrie` sollte dafür ein gemeinsamer Baustein werden.

### F8. BPE 10.5: numerische Lösung trigonometrischer Gleichungen (Priorität niedrig)

Beleg: In der Inhaltsspalte steht „Numerische Lösung“ (Hinweis: Wertetabelle). In `trigonometrische-gleichungen` nicht gefunden (Stichwortsuche).

Vorschlag: ein Auftrag mit einer Gleichung, die sich nicht umkehren lässt, zum Beispiel sin(x) gleich einer Geraden. Die Lösung wird mit Wertetabelle und Vorzeichenwechsel eingegrenzt. Das verbindet sich mit `summe-produkt-funktionen` und zeigt, warum ein Verfahren ohne Umkehrung nötig ist.

### F9. BPE-Angaben in den Metadaten (Priorität niedrig, reiner Datenabgleich)

- `funktionsterme-aufstellen` trägt 3.3 und 4.4, behandelt aber auch trigonometrische und exponentielle Ansätze. 14.1 fehlt und ist die eigentliche Einheit der Jahrgangsstufe.
- 12.8 und 9.1 trägt kein Modul (siehe F4, F6). `uebungsaufgaben-abiturstil` und `aenderungsraten` enthalten Sachzusammenhänge und könnten 12.8 tragen.
- `tangenten` enthält eine Aufgabe zur lokalen Linearität (Aufgabe 12). Die Grundvorstellung steht in der Einleitung von BPE 12 und ist sonst nicht sichtbar. Sie verdient einen Satz in der Zusammenfassung.

Falls die BPE-Nummern nur intern genutzt werden, ist das eine Änderung ohne sichtbare Wirkung.

### F10. Schreibweise und Begriffe (Priorität niedrig)

- „Differentialrechnung“ (27 Stellen) steht neben „Differenzialquotient“ (8 Stellen). Der Bildungsplan schreibt durchgehend mit z. Beides ist zulässig, einheitlich wäre besser. Die Modul-ID bleibt unverändert.
- Der Bildungsplan sagt „Mittellinie“ und „Graph“, die Module sagen nach deiner Vorgabe „Ruhelage“ (90 Stellen) und „Schaubild“. „Mittellinie“ kommt nicht vor. Vorschlag: den Begriff des Bildungsplans einmal in `lage-im-koordinatensystem` in Klammern nennen, weil er in fremden Aufgaben vorkommen kann.

### F11. Vorwissen aus der Eingangsklasse (Priorität mittel, Entscheidung bei dir)

Beleg: `docs/themen/differentialrechnung.md` vermerkt, dass es zu Polynomgleichungen und Exponentialgleichungen kein Modul gibt. Die Ich-Kann-Liste verweist dafür auf Teile anderer Module.

Für eine Umgebung zum Selbstlernen ist das die praktisch wichtigste Lücke außerhalb des Bildungsplans der Jahrgangsstufen: Kurvendiskussionen scheitern selten an der Ableitung und oft am Lösen von f′(x) = 0. Vorschlag: ein Wiederholungsmodul „Gleichungen lösen“ (Ausklammern, Satz vom Nullprodukt, Substitution, Exponentialgleichungen mit ln) mit einer Entscheidungshilfe, welches Verfahren zu welcher Gleichung passt.

## 5. Didaktische Befunde

### Was trägt

- Die feste Folge Erklären, Entdecken, Überprüfen, Zusammenfassung mit Vermutung vor dem Labor passt zu dem, was der Bildungsplan vom Einsatz digitaler Werkzeuge erwartet (Entdecken von Zusammenhängen, Darstellungswechsel, Kontrolle eigener Rechnungen).
- Falsche Antworten der Auswahlfragen sind typische Fehler mit Begründung. Die Zusammenfassungen nennen typische Fehler ausdrücklich.
- Gestufte Hilfen und schrittweise Lösungen sind konstruktive Unterstützung im Sinn der Tiefenstrukturen, die der Bildungsplan nennt.
- Die Ich-Kann-Listen mit Kontrollaufgabe prüfen die Selbsteinschätzung an einer Leistung. Das ist besser als eine reine Ankreuzliste.

### D1. Rückmeldung bei Zahleneingaben nur richtig oder falsch (Priorität hoch)

Beleg: `src/components/Aufgabe.tsx` kennt nur die Urteile „richtig“, „noch nicht richtig“, „keine gültige Zahl“.

Wer −3 statt 3 eingibt, erfährt nicht, dass nur das Vorzeichen falsch ist. Lernende zu Hause greifen dann zur Lösung, und der Lernanlass ist weg.

Vorschlag: Der Baustein `Aufgabe` bekommt je Feld eine optionale Liste von Fehlerbildern (erwarteter falscher Wert, kurze Rückmeldung). Beispiele: Vorzeichenfehler, Wert im Gradmaß statt im Bogenmaß, f(x₀) statt f′(x₀), Integral statt Flächeninhalt, Grenzen vertauscht, Richtungsvektor statt Punkt. Ohne Liste bleibt das Verhalten wie bisher, die Option ist also abwärtskompatibel. Der Test prüft, dass kein Fehlerbild mit dem richtigen Wert zusammenfällt. Nachgerüstet wird zuerst dort, wo die Fehler bekannt sind (die „typischen Fehler“ der Zusammenfassungen liefern die Liste).

Das ist eine Änderung an einem gemeinsamen Baustein und braucht nach `CLAUDE.md` einen eigenen Entwurfsbranch und deine Zustimmung.

### D2. Begründen, Erläutern, Beurteilen kommen zu kurz (Priorität hoch)

Beleg: „Erläutere“ in einem Modul, „Beurteile“ in drei, „Begründe“ in 24 Modulen, dort aber fast immer als Auswahlfrage oder als Hinweis, man solle begründen können. Die Themendateien vermerken mehrfach: „das freie Begründen entfällt, weil es nicht automatisch prüfbar ist“.

Das Argument stimmt technisch, didaktisch ist es eine Schieflage: Die Umgebung übt, was sich prüfen lässt, und nicht, was der Bildungsplan verlangt. Auswählen einer Begründung ist Wiedererkennen und kein Formulieren.

Vorschläge, nach Aufwand geordnet:

1. **Selbsterklärung mit Kriterien.** Neuer Baustein: Freitextfeld (bleibt nur im Arbeitsspeicher), danach erscheint eine Musterbegründung mit drei bis vier Kriterien zum Abhaken („Ich habe den Vorzeichenwechsel genannt“, „Ich habe die Stelle angegeben“). Keine automatische Bewertung, aber eine echte Formulierung und ein Abgleich. Die Forschung zu Selbsterklärungen stützt das.
2. **Begründung ordnen.** Schritte einer Begründung oder eines Nachweises in die richtige Reihenfolge bringen, mit einem überflüssigen oder falschen Schritt. Automatisch prüfbar.
3. **Fehler finden.** Eine ausgeführte Schülerlösung mit einem Fehler, gesucht sind die Zeile und die Art des Fehlers. Der Bildungsplan nennt Fehler ausdrücklich als Lernanlass. Ansätze gibt es in einigen Modulen, ein durchgehendes Format fehlt.
4. **Aufträge für das Heft.** Bei „Zeigen“ und „Begründen“ ausdrücklich: „Schreibe die Begründung in dein Heft, vergleiche dann.“ Das kostet nichts und macht die Erwartung klar.

### D3. Vermutungen ohne Festlegung (Priorität mittel)

Beleg: Die Vermutungsfrage steht als Text, die Beobachtung lässt sich sofort aufklappen (`Beobachtung.tsx`).

Eine Vermutung wirkt nur, wenn man sich festlegt. Ohne Festlegung wird aufgeklappt und gelesen. Vorschlag: Vor dem Aufklappen eine kurze Festlegung verlangen, entweder eine Auswahl aus zwei bis drei Vermutungen oder ein Textfeld. Danach zeigt die Beobachtung, was erwartet war. Optional als Parameter des Bausteins, damit bestehende Module unverändert bleiben, bis sie umgestellt sind.

### D4. Umfang ohne Wegweiser (Priorität mittel)

Beleg: `produkt-kettenregel` hat 32 Aufgaben, `funktionsterme-aufstellen` 26, `ableitungsregeln` und `tangenten` je 24, `optimierung` 22. Eine Kennzeichnung nach Niveau oder Pflicht gibt es nicht durchgehend.

Für leistungsschwächere Lernende ist ein Abschnitt mit über 20 gleich aussehenden Aufgaben eine Hürde, leistungsstarke rechnen zu lange im Anforderungsbereich I. Vorschlag: Jede Aufgabe erhält ein Kennzeichen für den Anforderungsbereich (I, II, III, die Begriffe stehen schon auf der Operatorenseite). Am Anfang von „Überprüfen“ steht ein Mindestpfad („Wenn dir die Aufgaben 2, 5 und 9 gelingen, hast du das Modul sicher“) und eine grobe Zeitangabe. Das ist zugleich Binnendifferenzierung, die der Bildungsplan im VIP-Bereich nennt.

### D5. Kein vermischtes und verteiltes Üben (Priorität mittel)

Beleg: „Wiederholen und Üben“ ist eine Liste aller Module (`src/app/seiten/seiten.tsx`). Geübt wird nur innerhalb eines Moduls, also immer mit bekanntem Verfahren. Nur die Übungsaufgaben im Abiturstil mischen.

Vorschläge:

1. **Startklar-Prüfung** am Anfang jedes Moduls: drei kurze Fragen zum vorausgesetzten Stoff mit Verweis auf das passende Modul. Das verbindet die Module und ersetzt stillschweigende Voraussetzungen.
2. **Gemischte Wiederholung** auf der Seite „Wiederholen und Üben“: je Themenbereich einige Kontrollaufgaben aus den Ich-Kann-Listen in zufälliger Reihenfolge, ohne dass das Verfahren genannt wird. Die Aufgaben gibt es schon, der Aufwand liegt in der Auswahl.

### D6. Einstieg über eine Frage statt über die Definition (Priorität niedrig)

Die Reihenfolge „erst kurz erklären, dann entdecken“ ist für das Selbstlernen begründet und bleibt. Der Bildungsplan betont aber die Lebenswirklichkeit und das Problem als Ausgangspunkt. Vorschlag: Jedes Modul beginnt mit einer Leitfrage in ein bis zwei Sätzen mit Bild (wie der Rennwagen in `aenderungsraten`), die in der Zusammenfassung ausdrücklich beantwortet wird. Bei welchen Modulen das schon so ist, habe ich nicht durchgehend geprüft.

### D7. Einschätzung geht beim Schließen verloren (Priorität niedrig, Entscheidung bei dir)

Die Ich-Kann-Listen speichern bewusst nichts. Die Folge: Wer die Liste über mehrere Tage bearbeitet, fängt jedes Mal neu an. Vorschlag ohne Datenspeicherung: ein Knopf „Auswertung drucken“ mit einer sauberen Druckansicht. Eine Speicherung im Browser wäre eine datenschutzrelevante Entscheidung (gemeinsam genutzte Schulgeräte) und nur mit deiner ausdrücklichen Zustimmung denkbar.

### D8. Einbettung in den Unterricht (Priorität niedrig)

Der Bildungsplan sieht digitale Medien als Ergänzung und nennt Kooperationsphasen und das Vergleichen von Lösungswegen. Die Umgebung ist für Einzelarbeit gebaut. Vorschlag: je Modul ein kurzer Abschnitt in `docs/` (nicht auf der Seite) mit Einsatzszenario, Zeitbedarf, einem Partnerauftrag und dem, was im Heft gesichert wird. Für dein Praktikum ist das unmittelbar nutzbar, für die Lernenden ändert sich nichts.

## 6. Maßnahmen in empfohlener Reihenfolge

| Nr. | Maßnahme | Befund | Art | Aufwand |
|---|---|---|---|---|
| 1 | Fehlerbilder im Baustein `Aufgabe`, zuerst in zwei Modulen erproben | D1 | gemeinsamer Baustein, Entwurfsbranch | mittel |
| 2 | Abschnitt zu nicht differenzierbaren Funktionen in `aenderungsraten` | F3 | Änderung an freigegebenem Modul | klein |
| 3 | Modul „Ableitungen im Sachzusammenhang“ | F4 | neues Modul | mittel |
| 4 | Stochastik, beginnend mit Modul 1 bis 3 | F1 | neue Module, Arbeitsblätter nötig | groß |
| 5 | Baustein Selbsterklärung mit Kriterien, dazu Aufträge für das Heft | D2 | neuer Baustein | mittel |
| 6 | BPE-Angaben in `meta.json` berichtigen | F9 | Metadaten | sehr klein |
| 7 | Kennzeichnung der Anforderungsbereiche und Mindestpfad | D4 | alle Module, schrittweise | mittel |
| 8 | Festlegung vor der Beobachtung | D3 | gemeinsamer Baustein | klein bis mittel |
| 9 | Modellierungskreislauf und Gültigkeitsfrage | F6 | Baustein und drei Module | mittel |
| 10 | Problemlösen in den Übungsmodulen der Analysis | F7 | Änderung an zwei Modulen | mittel |
| 11 | Skizzieren von K_f aus K_f′, Wertemenge | F5 | Baustein und zwei Module | mittel |
| 12 | Startklar-Prüfung und gemischte Wiederholung | D5 | Seite und Module | mittel |
| 13 | Wiederholungsmodul „Gleichungen lösen“ | F11 | neues Modul | mittel |
| 14 | Numerische Lösung, Schreibweise, Mittellinie | F8, F10 | kleine Änderungen | klein |
| 15 | Matrizen | F1 | neue Module, Richtung klären | groß |
| 16 | Vernetzendes Modul Optimieren | F2 | neues Modul, nach der Stochastik | klein |

Begründung der Reihenfolge: 1 und 2 sind klein und wirken sofort in vorhandenen Modulen. 3 schließt die prüfungsnächste Lücke der Analysis. 4 ist die größte Lücke, braucht aber deine Unterlagen und die meiste Zeit und sollte deshalb früh beginnen und nicht auf die übrigen Punkte warten.

## 7. Entscheidungen, die bei dir liegen

1. Welche Richtung hat das Gymnasium, also welche Matrizeneinheit (BPE 19, 20 oder 21) gilt?
2. Stochastik: Zuschnitt der Module und Reihenfolge, liegen Arbeitsblätter vor?
3. Fehlerbilder im Baustein `Aufgabe` (D1): gewünscht, und auch für bestehende Module?
4. Freitext zur Selbsterklärung (D2): gewünscht? Der Text bleibt im Arbeitsspeicher, es wird nichts gespeichert oder übertragen.
5. Festlegung vor der Beobachtung (D3): verpflichtend oder nur angeboten?
6. Leeres Thema „Optimieren und Modellieren“: füllen (F2) oder entfernen?
7. Eingangsklassenstoff (F11): gehört ein Wiederholungsmodul in diese Umgebung?
8. Druckansicht der Ich-Kann-Auswertung (D7)?
9. Welche Hilfsmittel sind in deinem Kurs zugelassen (Taschenrechner, Merkhilfe)? Davon hängt ab, wie die Aufgaben „mit Hilfsmittel“ und eine mögliche Regression gestaltet werden. Ich habe das nicht geprüft.

## 8. Kritische Gegenprobe

Drei Punkte, an denen meine Einschätzung angreifbar ist:

- **Stochastik zuerst oder nicht:** Wenn der Kurs Abitur 2027 die Stochastik im Unterricht schon hinter sich hat, bringt sie diesem Jahrgang wenig, und die Maßnahmen 1 bis 3 und 5 sind wichtiger. Der Stand im Unterricht ist mir nicht bekannt.
- **Freies Begründen ohne Prüfung:** Ein Freitextfeld ohne Bewertung kann ignoriert werden. Ob Lernende es ernsthaft nutzen, zeigt nur die Erprobung im Unterricht. Der Aufwand ist aber gering, und die Alternative ist, dass K1 und K6 in der Umgebung gar nicht vorkommen.
- **Mehr Module gegen mehr Tiefe:** Die Umgebung ist mit 63 Modulen schon groß. Jede Ergänzung in bestehenden Modulen (F3, F5, F8) vergrößert Module, die zum Teil bereits zu lang sind (D4). Ergänzungen sollten deshalb mit der Kennzeichnung der Anforderungsbereiche verbunden werden und nicht davor kommen.
