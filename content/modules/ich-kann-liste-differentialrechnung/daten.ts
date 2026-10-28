import type { Aussage } from '@/lib/ichkann';

/* ---------- Bereiche, Module und Aussagen der Ich-Kann-Liste ---------- */

export const GRUPPEN = [
  { id: 'gleichungen', titel: 'Gleichungen' },
  { id: 'aenderung', titel: 'Änderungsrate und Ableitung' },
  { id: 'tangenten', titel: 'Tangenten' },
  { id: 'schaubild', titel: 'Ableitung und Schaubild' },
  { id: 'kurve', titel: 'Kurvendiskussion' },
  { id: 'anwendung', titel: 'Funktionsterme und Optimierung' },
] as const;
export type Gruppe = (typeof GRUPPEN)[number]['id'];

/** Kurzbezeichnung der Module, auf die verwiesen wird. Die IDs entsprechen den Ordnern in content/modules. */
export const MODULE: Record<string, string> = {
  'trigonometrische-gleichungen': 'Trigonometrische Gleichungen',
  umkehrfunktion: 'Umkehrfunktion',
  'summe-produkt-funktionen': 'Summe, Differenz und Produkt von Funktionen',
  aenderungsraten: 'Von der mittleren zur momentanen Änderungsrate',
  ableitungsregeln: 'Ableitungsregeln',
  'produkt-kettenregel': 'Produktregel und Kettenregel',
  tangenten: 'Tangenten',
  'grafisches-differenzieren': 'Grafisches Differenzieren',
  kurvendiskussion: 'Kurvendiskussion',
  'ausfuehrliche-kurvendiskussion': 'Ausführliche Kurvendiskussion',
  'markante-punkte': 'Markante Punkte',
  optimierung: 'Optimierung',
  'funktionsterme-aufstellen': 'Aufstellen von Funktionstermen',
  'uebungsaufgaben-abiturstil': 'Übungsaufgaben im Abiturstil',
};

/** Titel der Abschnitte, auf die verwiesen wird (wie in den meta.json der Module). */
export const ABSCHNITT_TITEL: Record<string, string> = {
  erklaeren: 'Erklären',
  entdecken: 'Entdecken',
  ueberpruefen: 'Überprüfen',
  zusammenfassung: 'Zusammenfassung',
  hinweise: 'Aufbau und Operatoren',
  'ohne-hilfsmittel': 'Ohne Hilfsmittel',
  'mit-hilfsmittel': 'Mit Hilfsmittel',
};

const TG = 'trigonometrische-gleichungen';
const UK = 'umkehrfunktion';
const SP = 'summe-produkt-funktionen';
const AR = 'aenderungsraten';
const AB = 'ableitungsregeln';
const PK = 'produkt-kettenregel';
const TA = 'tangenten';
const GD = 'grafisches-differenzieren';
const KD = 'kurvendiskussion';
const AK = 'ausfuehrliche-kurvendiskussion';
const MP = 'markante-punkte';
const OP = 'optimierung';
const FT = 'funktionsterme-aufstellen';
const UA = 'uebungsaufgaben-abiturstil';

const v = (modul: string, ...abschnitte: string[]) => abschnitte.map((abschnitt) => ({ modul, abschnitt }));

/**
 * Die Aussagen der Ich-Kann-Liste der Lehrkraft (Nr. 1 bis 35 und die Aussage „!“), Wortlaut leicht gekürzt, ohne Formeln.
 * Die h-Methode heißt auf der Liste „x-Methode“, in den Modulen h-Methode.
 */
export const AUSSAGEN: Aussage[] = [
  { id: 'polynomgleichungen', nr: '1', gruppe: 'gleichungen', text: 'Polynomgleichungen lösen (durch Wurzelziehen, pq-Formel, Ausklammern, Substituieren).', bpe: ['3.2'], verweise: [...v(AK, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'exponentialgleichungen', nr: '2', gruppe: 'gleichungen', text: 'Exponentialgleichungen lösen (durch Logarithmieren, eventuell Ausklammern, Substituieren).', bpe: ['3.2'], verweise: [...v(UK, 'erklaeren', 'entdecken'), ...v(AK, 'erklaeren')], teile: ['1'] },
  { id: 'trig-gleichungen', nr: '3', gruppe: 'gleichungen', text: 'trigonometrische Gleichungen lösen (durch sin⁻¹ und cos⁻¹ am Taschenrechner, weitere Lösungen innerhalb und außerhalb der Periode bestimmen, eventuell substituieren).', bpe: ['10.5'], verweise: [...v(TG, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'nullprodukt', nr: '4', gruppe: 'gleichungen', text: 'den Satz vom Nullprodukt anwenden.', bpe: ['3.2'], verweise: [...v(SP, 'zusammenfassung'), ...v(AK, 'erklaeren')], teile: ['1'] },

  { id: 'durchschnittliche-rate', nr: '5', gruppe: 'aenderung', text: 'die durchschnittliche Änderungsrate einer Funktion auf einem gegebenen Bereich zeichnerisch und rechnerisch bestimmen.', bpe: ['6.1', '12.1'], verweise: [...v(AR, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'momentane-rate-zeichnerisch', nr: '6', gruppe: 'aenderung', text: 'die momentane Änderungsrate einer Funktion an einer bestimmten Stelle zeichnerisch (näherungsweise) bestimmen.', bpe: ['6.2', '12.1'], verweise: [...v(AR, 'entdecken', 'ueberpruefen')], teile: ['1'] },
  { id: 'h-methode', nr: '7', gruppe: 'aenderung', text: 'die momentane Änderungsrate einer Funktion an einer bestimmten Stelle mithilfe der h-Methode (Grenzwert des Differenzenquotienten) exakt berechnen.', bpe: ['6.2', '12.1'], verweise: [...v(AR, 'erklaeren', 'zusammenfassung'), ...v(AB, 'entdecken')], teile: ['1'] },
  { id: 'potenzregel', nr: '8', gruppe: 'aenderung', text: 'die momentane Änderungsrate einer Funktion an einer bestimmten Stelle mithilfe der Potenzregel der Ableitung exakt berechnen.', bpe: ['6.3', '12.2'], verweise: [...v(AB, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'summenregel', nr: '9', gruppe: 'aenderung', text: 'mithilfe der Summen- und Faktorregel die Ableitung von Summen von Potenzfunktionen und Polynomfunktionen bilden.', bpe: ['6.3', '12.2'], verweise: [...v(AB, 'erklaeren', 'zusammenfassung')], teile: ['1'] },
  { id: 'steigung-im-punkt', nr: '10', gruppe: 'aenderung', text: 'die Steigung des Schaubilds einer Funktion in einem bestimmten Punkt berechnen.', bpe: ['12.2', '12.5'], verweise: [...v(TA, 'erklaeren'), ...v(AB, 'ueberpruefen')], teile: ['1'] },
  { id: 'stelle-mit-steigung', nr: '11', gruppe: 'aenderung', text: 'rechnerisch bestimmen, an welcher Stelle das Schaubild einer Funktion eine bestimmte Steigung besitzt.', bpe: ['12.2', '12.5'], verweise: [...v(TA, 'ueberpruefen'), ...v(KD, 'erklaeren')], teile: ['1'] },

  { id: 'tangente-normale', nr: '12', gruppe: 'tangenten', text: 'den Funktionsterm von Tangente und Normale (Senkrechte auf die Tangente) einer Kurve in einem gegebenen Kurvenpunkt aufstellen.', bpe: ['12.5'], verweise: [...v(TA, 'erklaeren', 'ueberpruefen'), ...v(FT, 'erklaeren')], teile: ['1'] },
  { id: 'tangente-nachweisen', nr: '13', gruppe: 'tangenten', text: 'nachweisen, dass eine Gerade eine Tangente ist.', bpe: ['12.5'], verweise: [...v(TA, 'entdecken', 'ueberpruefen')], teile: ['1'] },
  { id: 'gegenseitige-lage', nr: '14', gruppe: 'tangenten', text: 'prüfen, ob sich zwei Schaubilder in einer gegebenen Stelle berühren, schneiden oder senkrecht schneiden.', bpe: ['12.5'], verweise: [...v(TA, 'entdecken', 'zusammenfassung'), ...v(FT, 'entdecken')], teile: ['1'] },

  { id: 'regeln-exp-trig', nr: '15', gruppe: 'schaubild', text: 'die Ableitungsregeln für die natürliche Exponentialfunktion und die trigonometrischen Funktionen anwenden.', bpe: ['6.3', '12.2', '12.3'], verweise: [...v(AB, 'erklaeren', 'zusammenfassung')], teile: ['1'] },
  { id: 'grafisch-ableiten', nr: '16', gruppe: 'schaubild', text: 'grafisch ableiten.', bpe: ['6.3', '12.4'], verweise: [...v(GD, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'aussagen-ableitungsschaubild', nr: '17', gruppe: 'schaubild', text: 'anhand des Schaubilds der ersten Ableitung Aussagen über das Schaubild der Ausgangsfunktion treffen, überprüfen und bewerten.', bpe: ['12.4', '12.6'], verweise: [...v(GD, 'entdecken', 'zusammenfassung')], teile: ['1'] },
  { id: 'monotonie', nr: '18', gruppe: 'schaubild', text: 'das Monotonieverhalten einer Funktion anhand ihrer ersten Ableitung erläutern.', bpe: ['12.6'], verweise: [...v(KD, 'erklaeren'), ...v(GD, 'zusammenfassung')], teile: ['1'] },
  { id: 'kruemmung', nr: '19', gruppe: 'schaubild', text: 'das Krümmungsverhalten einer Funktion anhand ihrer zweiten Ableitung erläutern.', bpe: ['12.6'], verweise: [...v(KD, 'erklaeren', 'zusammenfassung')], teile: ['1'] },
  { id: 'extrempunkte-vzw', nr: '20', gruppe: 'schaubild', text: 'mithilfe der Nullstellen und dem Vorzeichenwechsel der ersten Ableitung rechnerisch die Koordinaten und die Art der Extrempunkte bestimmen.', bpe: ['12.6'], verweise: [...v(KD, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'wendepunkte-vzw', nr: '21', gruppe: 'schaubild', text: 'mithilfe der Nullstellen und dem Vorzeichenwechsel der zweiten Ableitung rechnerisch die Koordinaten der Wendepunkte bestimmen.', bpe: ['12.6'], verweise: [...v(KD, 'entdecken', 'zusammenfassung')], teile: ['1'] },
  { id: 'produkt-kette', nr: '22', gruppe: 'schaubild', text: 'mithilfe der Ketten- und Produktregel ableiten.', bpe: ['12.2', '12.3'], verweise: [...v(PK, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'parameter-ableiten', nr: '23', gruppe: 'schaubild', text: 'die Ableitungen von Funktionen mit Parameter bestimmen.', bpe: ['12.2', '12.3'], verweise: [...v(PK, 'entdecken', 'zusammenfassung'), ...v(AK, 'ueberpruefen')], teile: ['1'] },

  { id: 'extrempunkte-alle', nr: '24', gruppe: 'kurve', text: 'bei allen Funktionstypen die exakten Koordinaten der Extrempunkte rechnerisch bestimmen.', bpe: ['12.6', '12.7'], verweise: [...v(KD, 'ueberpruefen'), ...v(AK, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'wendepunkte-alle', nr: '25', gruppe: 'kurve', text: 'bei allen Funktionstypen Wendepunkte rechnerisch bestimmen.', bpe: ['12.6'], verweise: [...v(KD, 'ueberpruefen'), ...v(AK, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'wertebereich', nr: '26', gruppe: 'kurve', text: 'den Wertebereich einer Funktion (gegebenenfalls innerhalb eines eingeschränkten Definitionsbereichs) angeben.', bpe: ['12.7'], verweise: [...v(UK, 'erklaeren', 'ueberpruefen'), ...v(MP, 'zusammenfassung')], teile: ['1'] },
  { id: 'symmetrie', nr: '27', gruppe: 'kurve', text: 'eine Funktion auf ihre Symmetrieeigenschaften untersuchen.', bpe: ['4.3', '12.6'], verweise: [...v(AK, 'erklaeren', 'entdecken'), ...v(SP, 'entdecken')], teile: ['1'] },
  { id: 'globales-verhalten', nr: '28', gruppe: 'kurve', text: 'das globale Verhalten (im „Unendlichen“, für x → ±∞) von Funktionen bestimmen.', bpe: ['3.2', '12.6'], verweise: [...v(AK, 'erklaeren', 'entdecken', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'trig-eigenschaften', nr: '29', gruppe: 'kurve', text: 'Extrempunkte und Wendepunkte bei trigonometrischen Funktionen „nur“ anhand der Abbildungseigenschaften (Verschiebung, Streckung) untersuchen.', bpe: ['10.3', '10.4'], verweise: [...v(MP, 'erklaeren', 'zusammenfassung')], teile: ['1'] },

  { id: 'bedingungen', nr: '30', gruppe: 'anwendung', text: 'anhand von Eigenschaften von Funktionen Bedingungen für f, f′ und f″ aufstellen.', bpe: ['3.3', '4.4'], verweise: [...v(FT, 'erklaeren', 'entdecken', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'funktionsterm', nr: '31', gruppe: 'anwendung', text: 'mithilfe von Bedingungen für f, f′ und f″ den Funktionsterm einer Funktion bestimmen.', bpe: ['3.3', '4.4'], verweise: [...v(FT, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'optimierungsschema', nr: '32', gruppe: 'anwendung', text: 'das Schema von Optimierungsaufgaben erläutern.', bpe: ['3.5', '15.1'], verweise: [...v(OP, 'erklaeren', 'zusammenfassung')], teile: ['1'] },
  { id: 'zielfunktion', nr: '33', gruppe: 'anwendung', text: 'bei Optimierungsaufgaben mithilfe von Nebenbedingungen eine Zielfunktion erstellen.', bpe: ['3.5', '15.1'], verweise: [...v(OP, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'definitionsbereich', nr: '34', gruppe: 'anwendung', text: 'bei der Optimierung den Definitionsbereich der Zielfunktion festlegen.', bpe: ['3.5', '12.7'], verweise: [...v(OP, 'erklaeren', 'entdecken')], teile: ['1'] },
  { id: 'globales-extremum', nr: '35', gruppe: 'anwendung', text: 'bei der Optimierung das globale Extremum der Zielfunktion herausfinden (durch Vergleich von lokalem Extremum mit den Randwerten).', bpe: ['12.7', '15.1'], verweise: [...v(OP, 'entdecken', 'ueberpruefen')], teile: ['1'] },
  { id: 'kleinste-steigung', nr: '36', gruppe: 'kurve', text: 'Punkte mit der größten und kleinsten Steigung eines Schaubilds bestimmen.', bpe: ['12.6'], ergaenzt: true, verweise: [...v(KD, 'entdecken', 'zusammenfassung')], teile: ['1'] },
  { id: 'globale-extrema', nr: '37', gruppe: 'kurve', text: 'die globalen Extrema einer Funktion auf einem abgeschlossenen Intervall durch Vergleich mit den Randwerten bestimmen.', bpe: ['12.7'], ergaenzt: true, verweise: [...v(OP, 'erklaeren', 'entdecken'), ...v(KD, 'ueberpruefen')], teile: ['1'] },
  { id: 'transfer', nr: '!', gruppe: 'anwendung', text: 'die obigen mathematischen Fähigkeiten auf komplexere und anwendungsbezogene Aufgaben anwenden.', bpe: ['3.5', '12.5', '12.6', '12.7'], verweise: [...v(UA, 'ohne-hilfsmittel', 'mit-hilfsmittel')], teile: [] },
];

export const aussage = (id: string): Aussage => {
  const a = AUSSAGEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Aussage: ${id}`);
  return a;
};
