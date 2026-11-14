# Trigonometrische Funktionen und Zusammengesetzte Funktionen

Modulhistorie, Entscheidungen und gemeldete Unstimmigkeiten (aus `docs/ENTWICKLUNG.md` ausgelagert, Wortlaut unverändert, nur der Zusatz „Live-Prüfung steht aus“ in den Überschriften entfällt, er steht gesammelt in `docs/STAND.md`).

## Stand, Zuordnung zum Bildungsplan und offene Punkte (Stand 25.10.2026, Differentialrechnung siehe eigenen Abschnitt, Stand 28.10.2026: Modul 1 bis 5 freigegeben)

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

## Themenbereich Zusammengesetzte Funktionen (BPE 11), in Arbeit (Modul 1 bis 3 und Ich-Kann-Liste freigegeben, Gemischte Aufgaben freigegeben)

Der Themenbereich steht in `content/themen.json` (`zusammengesetzte-funktionen`, mit Beschreibung und Symbol `Verknuepfung`). Abgestimmte Aufteilung (Sitzung vom 25.10.2026), alle Module zuerst im Basiskurs `abitur-2027`:

| Modul-ID | BPE | Stand |
| --- | --- | --- |
| `summe-produkt-funktionen` | 11.1 | freigegeben (25.10.2026), im Basiskurs `abitur-2027`, nicht in `abitur-2028` |
| `verkettung` | 11.2 | freigegeben (25.10.2026), im Basiskurs `abitur-2027` |
| `gemischte-aufgaben-zusammengesetzte-funktionen` | 11.1 bis 11.3 | freigegeben (25.10.2026), im Basiskurs `abitur-2027` als 4. Modul vor der Ich-Kann-Liste, die auf das Modul verweist (Aussage 5 und 9) |
| `umkehrfunktion` | 11.3 | freigegeben (25.10.2026), im Basiskurs `abitur-2027` |
| `ich-kann-liste-zusammengesetzte-funktionen` | 11.1 bis 11.3 | freigegeben (25.10.2026), im Basiskurs `abitur-2027` |

Vorausgesetzt sind (mit der Lehrkraft geklärt): Potenz- und Polynomfunktionen, Exponentialfunktionen mit Basis a (3^x, 0,5^x), Sinus und Kosinus sowie die Wurzelfunktion. e^x und ln werden nicht vorausgesetzt, weil die Zahl e im Bildungsplan erst in BPE 12 steht und ln erst in 11.3 kommt. Die Beispiele des Bildungsplans zu 11.1 nennen e^x trotzdem. Sobald e eingeführt ist, gelten die Regeln unverändert.

### Modul `summe-produkt-funktionen`

Abschnitte: Erklären (Summe, Differenz, Produkt, Klammern, Definitionsbereich, Ordinatenaddition mit `Ordinatenbild`), Entdecken (drei Vermutungen, `Verknuepfungslabor`, sechs Untersuchungsaufträge, GeoGebra-Link als gewöhnlicher Verweis), Überprüfen (zehn Aufgaben), Zusammenfassung.

Rechenlogik in `src/lib/verknuepfung.ts`: Katalog der neun Funktionen (0,5x, x², x³, x⁴ + x, 3^x, 0,5^x, sin x, cos x, √x), `verknuepfe`, Termbildung mit Klammern und numerische Analyse (Nullstellen mit Vorzeichenwechsel und Berührstellen, Symmetrie, Gerade als Asymptote, Periode). Bewusste Wahl des Katalogs: 0,5^x ist nicht die Spiegelung von 3^x, und x⁴ + x lässt sich nicht aus Katalogfunktionen zu einer symmetrischen Funktion ergänzen. Sonst wären 2^x + 0,5^x (achsensymmetrisch) oder (x³ + x²) − x³ (achsensymmetrisch) Ausnahmen von der Regel „ohne Symmetrie bleibt keine Symmetrie“. Diese Regel gilt allgemein nur meistens. Die Tabelle im Labor ist numerisch und ersetzt keine Rechnung.

Tests: `tests/verknuepfung.test.ts` (alle Paare aus dem Katalog gegen die Regeln für Symmetrie, Nullstellen von Produkten gegen von Hand bekannte Nullstellen, alle Paare gegen ein unabhängiges feines Raster, Asymptoten und Perioden), `tests/summe-produkt-modul.test.tsx` (Aufgabenwerte, Aussagen der Beobachtungen, Abschnitte, keine Vorwegnahme im Erklären).

Nachträglich ergänzt (Entdecken, Auftrag Asymptote): Hinweis „Wie du eine Asymptote bestimmst“ mit Wertetabelle von 3^x für x → −∞. Offen in diesem Modul: Lehrkraft löscht nach der Live-Prüfung den Branch `entwurf/summe-produkt-funktionen`. Nutzungsrechte des GeoGebra-Links `tc2uqagd` klären (öffentliche Seite). Nicht umgesetzt, weil es nicht im Bildungsplan steht: Grenzverhalten allgemein, Wertebereich der Verknüpfungen.

Gemeldete Unstimmigkeiten in den Unterlagen der Lehrkraft (im Modul korrekt umgesetzt): Wertebereich von 1,1^x ist ]0; ∞[ (nicht [0; ∞[). Der Definitionsbereich von √x + 1 ist [0; ∞[ (die Lehrkraft schreibt ℝ⁺). „Die Periode bleibt“ bei sin(x) + √x + 1 und „Periode = 2π“ bei x · sin(x) stimmen nicht, beide Funktionen sind nicht periodisch. x · sin(x) hat unendlich viele Extrempunkte (nicht „kein HP/TP“). „Nullstellen kombinieren sich aus den zwei Funktionen“ gilt nur für das Produkt. Bei den Symmetrieregeln fehlen punktsymmetrisch · achsensymmetrisch = punktsymmetrisch und die Regeln für Summen. Die Skizze zu f(x) + g(x) = 5^x + x⁶ + 2x³ fällt links und rechts nach unten, die Summe geht aber gegen +∞ (sieht nach der Differenz aus).

### Modul `verkettung`

Abschnitte: Erklären (Ölfleck mit Regler als zweistufige Rechnung, Schreibweise u ∘ v, innere und äußere Funktion, Funktionsterm bilden, Definitionsbereich), Entdecken (drei Vermutungen mit Symmetriehinweis, `Verkettungslabor`, sieben Untersuchungsaufträge mit Schaubildern in den Beobachtungen, GeoGebra-Link `yharbbas` als gewöhnlicher Verweis), Überprüfen (zehn Aufgaben mit eigenen Zahlen), Zusammenfassung.

Technik: `src/lib/verkettung.ts` (Katalog 2x − 1, x², x³, sin, cos, e^x, √x, `verkette`, Definitionsbereich von Hand, Symmetrie, Periode, Nullstellen einschließlich Nullstellen am Rand des Definitionsbereichs wie bei √(sin x)). Neue Bausteine: `Rechenkette` (Eingabe, Funktion, Zwischenergebnis, Funktion, Ergebnis), `Beobachtung` (klappbar, Schaubild erst beim Aufklappen). Modul 1 hat noch eine eigene Kopie von `Beobachtung` und kann später auf den gemeinsamen Baustein umgestellt werden. Die Nullstellensuche in `src/lib/verknuepfung.ts` wurde verbessert: Nullstellen mit Vorzeichenwechsel werden nicht mehr zusammengefasst, wenn sie dicht liegen (sin(x³) für große x), und sehr kleine Werte zählen nur als Nullstelle, wenn sie ein Minimum von |h| sind (Schwanz von e^(x³) für x → −∞). Farben: K_u rotorange, K_v schwarz gestrichelt, K_{u∘v} blau, K_{v∘u} rosa (alle mit Abstand über 150 im RGB-Raum, im Test geprüft).

Tests: `tests/verkettung.test.ts` (alle 49 Paare: Definitionsbereich gegen die Rechnung, Symmetrie gegen die Regel, Periode gegen die Regel, Nullstellen gegen ein unabhängiges feines Raster samt Randnullstellen), `tests/verkettung-modul.test.tsx` (Aufgabenwerte, Aussagen der Beobachtungen, Abschnitte, keine Vorwegnahme im Erklären, Farben).

Entscheidung zu e^x: Die Unterlagen der Lehrkraft verwenden e^x (Aufschrieb, Aufgaben 2d und 4d), der Bildungsplan führt die Zahl e erst in BPE 12 ein. Das Modul setzt e^x deshalb als bekannt voraus (e^x tritt nur als Beispiel für eine äußere oder innere Funktion auf). Von der Lehrkraft zu bestätigen. ln wird nicht vorausgesetzt.

Offen in diesem Modul: Nutzungsrechte des GeoGebra-Links `yharbbas`. Nicht nachgebaut, weil nicht im Modul benötigt: Betragsfunktion (Aufgabe 2i), das Beispiel Tennisschläger (ersetzt durch Ölfleck und Spritkosten), die Umrechnung Kelvin, Celsius und Fahrenheit (kommt mit dem Modul zur Umkehrfunktion in Frage).

Gemeldete Unstimmigkeiten in den Unterlagen der Lehrkraft (im Modul korrekt umgesetzt): Im Beispiel zu Aufgabe 3 steht u(v(0)) = 1 − 3(1 − 0), richtig ist 1 − 3(1 + 0) (Ergebnis −2 stimmt). In der Lösung zu 3a fehlt eine Klammer („v(u(x) = …“). In der Schüler-Doku steht „NS x = 0 4. Grades“ (gemeint ist eine vierfache Nullstelle), „AS, wat x⁴“ ist unleserlich, „g[f(x)]“ wird mit eckigen Klammern geschrieben, und der Wertebereich wird als ℝ⁺ und [0; ∞[ geschrieben (ℝ⁺ meint hier nicht negative Zahlen, im Modul steht das Intervall [0; ∞[). „Verschiebung bleibt“ wurde als „die Verschiebung um 2 in y-Richtung bleibt erhalten“ gelesen. Die Definition auf dem Blatt benutzt v zugleich als Name der inneren Funktion und als Variable von u („u: v ↦ u(v)“), im Modul steht dafür u(z) oder u(v) mit dem Hinweis, dass v hier die Variable ist. Der Kopf des Lösungsblatts nennt „Ableiten mit der Kettenregel“ (Arbeitsblatt 8), das passt nicht zum Thema Verkettung.

### Modul `umkehrfunktion`

Abschnitte: Erklären (Umkehren als Rückwärtsrechnen am Beispiel Celsius und Fahrenheit mit `Rechenkette`, Schreibweise f⁻¹ mit Hinweis „nicht der Kehrwert“, Verfahren zum Term der Umkehrfunktion, natürlicher Logarithmus als Umkehrfunktion von e^x), Entdecken (drei Vermutungen, `Umkehrlabor`, fünf Untersuchungsaufträge mit Schaubildern in den Beobachtungen, GeoGebra-Link `srjsn2n5` als gewöhnlicher Verweis), Überprüfen (zehn Aufgaben), Zusammenfassung. Die Unterlagen der Lehrkraft (Arbeitsauftrag, Beispiele Parabel und Exponentialfunktion) stehen als Vorbild hinter den vier Fragen des Arbeitsauftrags: graphisch (Spiegelung an y = x), rechnerisch (Term), Definitions- und Wertebereich, Voraussetzung (jeder Wert nur einmal, streng monoton). Alle Zahlen und Funktionen sind eigene.

Technik: `src/lib/umkehr.ts` (Katalog mit 13 Funktionen samt Einschränkungen: 0,5x + 1, x² auf ℝ, auf x ≥ 0 und auf x ≤ 0, (x − 2)² − 1 rechts und links vom Scheitel, x³, e^x, e^x − 1, sin x auf ℝ und auf [−π/2; π/2], √x, ln x; Definitions- und Wertebereich, Umkehrbarkeit und Umkehrfunktion von Hand bestimmt und im Test gegen die Rechnung geprüft). Das Spiegelbild wird als Kurve (f(t) | t) gezeichnet und ist deshalb auch bei nicht umkehrbaren Funktionen zu sehen (dann kein Schaubild einer Funktion). Die waagerechte Gerade y = c mit ihren Schnittpunkten macht die Voraussetzung „jeder Wert nur einmal“ sichtbar. Neue Datei `UmkehrZeichnung.tsx` und `Bilder.tsx` im Modulordner. Farben: K_f rotorange, Spiegelbild blau, waagerechte Gerade schwarz gepunktet, Spiegelachse hellgrau gestrichelt (Abstand über 150 im RGB-Raum, im Test geprüft).

Tests: `tests/umkehr.test.ts` (Wertebereich, Umkehrbarkeit gegen strenge Monotonie, f⁻¹(f(x)) = x, Vertauschen der Bereiche, Spiegelkurve, Schnittstellen waagerechter Geraden), `tests/umkehr-modul.test.tsx` (Aufgabenwerte gegen unabhängige Bisektion, Aussagen der Beobachtungen, Abschnitte, keine Vorwegnahme im Erklären, Farben).

Vorausgesetzt wie in Modul 2: e^x. ln wird hier als Umkehrfunktion eingeführt, der Arkussinus aus dem Modul „Trigonometrische Gleichungen“ wird wieder aufgegriffen (Taste sin⁻¹). Offen: Nutzungsrechte des GeoGebra-Links `srjsn2n5`. Nicht umgesetzt: Währungsumrechnung (Kontext aus dem Bildungsplan, ersetzt durch Temperatur und Bremsweg), allgemeine Wurzelfunktionen höheren Grades (nur die dritte Wurzel taucht als Umkehrung von x³ auf).

Gemeldete Unstimmigkeiten in den Unterlagen der Lehrkraft (im Modul korrekt umgesetzt): Die Intervalle stehen mit runden Klammern ((−∞; 4], [4; ∞), (2; ∞)), im Modul steht wie im Bildungsplan ]−∞; 4], [4; ∞[ und ]2; ∞[. In der Abbildung zu Beispiel 1 haben Funktion und Umkehrfunktion dieselbe Farbe („Rechter Ast und Umkehrfunktion“), sodass man sie nicht trennen kann. Im Modul haben Funktion und Spiegelbild verschiedene Farben. Beispiel 1 schreibt D(f₊), das Modul schreibt D_f wie in den anderen Modulen. Der Satz „Eine Funktion ist genau dann auf ihrem Wertebereich umkehrbar, wenn jeder Funktionswert nur einmal angenommen wird“ stimmt (Injektivität), „strenge Monotonie ist hinreichend“ ebenfalls, aber nicht notwendig für beliebige Funktionen. Im Modul steht deshalb „streng monoton, also umkehrbar“ als hinreichende Bedingung.
