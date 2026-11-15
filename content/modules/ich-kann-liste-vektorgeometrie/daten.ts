import type { Aussage } from '@/lib/ichkann';

/* ---------- Bereiche, Module und Aussagen der Ich-Kann-Liste Vektorgeometrie ---------- */

/** Die drei Bereiche entsprechen den Unterbereichen des Themenbereichs (und den Abschnitten des Moduls mit derselben ID). */
export const GRUPPEN = [
  { id: 'vektoren', titel: 'Vektoren' },
  { id: 'geraden', titel: 'Geraden im Raum' },
  { id: 'ebenen', titel: 'Ebenen im Raum' },
] as const;
export type Gruppe = (typeof GRUPPEN)[number]['id'];

/** Titel der Module, auf die verwiesen wird. Die IDs entsprechen den Ordnern in content/modules, die Titel den meta.json. */
export const MODULE: Record<string, string> = {
  'punkte-vektoren-ebene': 'Punkte und Vektoren in der Ebene',
  'punkte-vektoren-raum': 'Punkte und Vektoren im Raum',
  'rechnen-mit-vektoren': 'Rechnen mit Vektoren',
  'betrag-abstand-teilung': 'Betrag, Abstand und Teilung von Strecken',
  'skalarprodukt-orthogonalitaet': 'Skalarprodukt, Orthogonalität und Winkel',
  'dreieck-vierecke-skalarprodukt': 'Dreieck und Vierecke mit Vektoren',
  vektorprodukt: 'Das Vektorprodukt (Kreuzprodukt)',
  'uebungsaufgaben-vektoren': 'Übungsaufgaben Vektoren im Abiturstil',
  geradengleichung: 'Die Geradengleichung',
  'spurpunkte-besondere-lage': 'Spurpunkte und besondere Lage',
  'gegenseitige-lage-geraden': 'Gegenseitige Lage von Geraden',
  'abstaende-geraden': 'Abstand Punkt und Gerade, paralleler Geraden',
  'schnittwinkel-geraden': 'Schnittwinkel von Geraden',
  'uebungsaufgaben-geraden': 'Übungsaufgaben Geraden im Abiturstil',
  'einfuehrung-ebenen': 'Einführung in Ebenen im Raum',
  'ebenengleichungen-aufstellen': 'Ebenengleichungen aufstellen',
  'normalenform-koordinatenform': 'Normalenform und Koordinatenform',
  'zeichnerische-darstellung-ebenen': 'Zeichnerische Darstellung von Ebenen',
  'gerade-und-ebene': 'Gerade und Ebene: gegenseitige Lage',
  'zwei-ebenen': 'Zwei Ebenen: gegenseitige Lage',
  'abstaende-ebenen': 'Abstände zu Ebenen: Punkt, Gerade, parallele Ebenen, Spiegelung',
  'flaechen-volumen': 'Flächen und Volumen: Quader und Pyramide',
  'uebungsaufgaben-ebenen': 'Übungsaufgaben Ebenen im Abiturstil',
  'problemloesen-vektorgeometrie': 'Problemlösen in der Vektorgeometrie',
};

/**
 * Titel der Abschnitte, auf die verwiesen wird (wie in den meta.json der Module). Zwei Abschnitts-IDs haben je nach Modul verschiedene Titel
 * und stehen deshalb mit dem Schlüssel `<Modul-ID>/<Abschnitts-ID>` (siehe `Titel` in IchKann.tsx).
 */
export const ABSCHNITT_TITEL: Record<string, string> = {
  erklaeren: 'Erklären',
  entdecken: 'Entdecken',
  ueberpruefen: 'Überprüfen',
  zusammenfassung: 'Zusammenfassung',
  hinweise: 'Aufbau und Operatoren',
  'ohne-hilfsmittel': 'Ohne Hilfsmittel',
  'mit-hilfsmittel': 'Mit Hilfsmittel',
  vorgehen: 'Vorgehen',
  'punkte-vertauschen': 'Punkte vertauschen',
  bildpunkt: 'Ein Bildpunkt, viele Punkte',
  problemloesen: 'Problemlösen',
  'vektorprodukt/vertiefung': 'Vertiefung: Flächeninhalt',
  'flaechen-volumen/vertiefung': 'Vertiefung: Spatprodukt',
  'abstaende-geraden/wege': 'Drei Wege',
  'abstaende-ebenen/wege': 'Zwei Wege',
  'uebungsaufgaben-ebenen/problemloesen': 'Pyramide mit Schacht',
};

const PE = 'punkte-vektoren-ebene';
const PR = 'punkte-vektoren-raum';
const RV = 'rechnen-mit-vektoren';
const BA = 'betrag-abstand-teilung';
const SO = 'skalarprodukt-orthogonalitaet';
const DV = 'dreieck-vierecke-skalarprodukt';
const VP = 'vektorprodukt';
const UV = 'uebungsaufgaben-vektoren';
const GG = 'geradengleichung';
const SB = 'spurpunkte-besondere-lage';
const GL = 'gegenseitige-lage-geraden';
const AG = 'abstaende-geraden';
const SG = 'schnittwinkel-geraden';
const UG = 'uebungsaufgaben-geraden';
const EE = 'einfuehrung-ebenen';
const EA = 'ebenengleichungen-aufstellen';
const NK = 'normalenform-koordinatenform';
const ZD = 'zeichnerische-darstellung-ebenen';
const GE = 'gerade-und-ebene';
const ZE = 'zwei-ebenen';
const AE = 'abstaende-ebenen';
const FV = 'flaechen-volumen';
const UE = 'uebungsaufgaben-ebenen';
const PL = 'problemloesen-vektorgeometrie';

const v = (modul: string, ...abschnitte: string[]) => abschnitte.map((abschnitt) => ({ modul, abschnitt }));

/**
 * Die Aussagen der Ich-Kann-Liste der Lehrkraft (Nr. 1 bis 39 und „!“), Wortlaut leicht gekürzt, ohne Formeln.
 * Die Aussagen 40 bis 47 sind nach dem Bildungsplan ergänzt. Nr. 17 und Nr. 46 sind Vertiefungen (nicht im Bildungsplan).
 * Die Nummern der ergänzten Aussagen stehen hinter 39, die Aussagen stehen aber bei den verwandten Aussagen ihres Bereichs.
 */
export const AUSSAGEN: Aussage[] = [
  /* ----- Vektoren ----- */
  { id: 'raumpunkte', nr: '1', gruppe: 'vektoren', text: 'Punkte und Vektoren im räumlichen Koordinatensystem angeben und darstellen.', bpe: ['7.1'], verweise: [...v(PR, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'spiegeln-achsen', nr: '2', gruppe: 'vektoren', text: 'Punkte am Ursprung, an den Koordinatenachsen und an den Koordinatenebenen spiegeln.', bpe: ['7.1'], verweise: [...v(PR, 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'linearkombination', nr: '3', gruppe: 'vektoren', text: 'die Addition, die Multiplikation mit einer Zahl (s-Multiplikation) und die Linearkombination von Vektoren veranschaulichen.', bpe: ['7.2'], verweise: [...v(PE, 'erklaeren', 'ueberpruefen'), ...v(RV, 'erklaeren', 'entdecken', 'ueberpruefen')], teile: ['1'] },
  { id: 'mittelpunkt', nr: '4', gruppe: 'vektoren', text: 'die Koordinaten des Mittelpunkts einer Strecke berechnen.', bpe: ['7.2'], verweise: [...v(BA, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'teilung', nr: '5', gruppe: 'vektoren', text: 'eine Strecke in einem bestimmten Verhältnis teilen.', bpe: ['7.2'], verweise: [...v(BA, 'erklaeren', 'entdecken', 'ueberpruefen')], teile: ['1'] },
  { id: 'punktspiegelung', nr: '6', gruppe: 'vektoren', text: 'einen Punkt an einem anderen Punkt spiegeln.', bpe: ['7.2'], verweise: [...v(RV, 'ueberpruefen'), ...v(BA, 'ueberpruefen')], teile: ['1'] },
  { id: 'betrag', nr: '7', gruppe: 'vektoren', text: 'die Länge (den Betrag) eines Vektors berechnen.', bpe: ['7.2'], verweise: [...v(BA, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'einheitsvektor', nr: '8', gruppe: 'vektoren', text: 'den Einheitsvektor eines gegebenen Vektors berechnen.', bpe: ['7.2'], verweise: [...v(BA, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'punkt-auf-strecke', nr: '9', gruppe: 'vektoren', text: 'auf einer gegebenen Strecke einen Punkt bestimmen, der von einem anderen Punkt einen bestimmten Abstand hat.', bpe: ['7.2'], verweise: [...v(BA, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'skalarprodukt', nr: '10', gruppe: 'vektoren', text: 'das Skalarprodukt zweier Vektoren berechnen.', bpe: ['7.3'], verweise: [...v(SO, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'winkel', nr: '11', gruppe: 'vektoren', text: 'die Größe des Winkels zwischen zwei Vektoren berechnen.', bpe: ['7.3'], verweise: [...v(SO, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'kollinear-orthogonal', nr: '12', gruppe: 'vektoren', text: 'Vektoren auf Kollinearität und Orthogonalität prüfen.', bpe: ['7.2', '7.3'], verweise: [...v(RV, 'entdecken', 'zusammenfassung'), ...v(SO, 'entdecken', 'ueberpruefen')], teile: ['a', 'b'] },
  { id: 'orthogonaler-vektor', nr: '13', gruppe: 'vektoren', text: 'zu einem gegebenen Vektor einen orthogonalen Vektor bestimmen.', bpe: ['7.3'], verweise: [...v(SO, 'erklaeren', 'ueberpruefen')], teile: ['1'] },
  { id: 'senkrechter-vektor', nr: '14', gruppe: 'vektoren', text: 'zu zwei gegebenen Vektoren einen Vektor bestimmen, der zu beiden orthogonal ist.', bpe: ['16.3'], verweise: [...v(VP, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'vielecke', nr: '15', gruppe: 'vektoren', text: 'bestimmte Eigenschaften von Vielecken rechnerisch überprüfen und nachweisen.', bpe: ['7.3'], verweise: [...v(DV, 'erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'eckpunkt', nr: '16', gruppe: 'vektoren', text: 'den fehlenden Eckpunkt eines bestimmten Vielecks bestimmen.', bpe: ['7.3'], verweise: [...v(DV, 'ueberpruefen'), ...v(RV, 'ueberpruefen')], teile: ['1'] },
  { id: 'flaeche-kreuzprodukt', nr: '17', gruppe: 'vektoren', text: 'mithilfe des Vektorprodukts (Kreuzprodukt) den Flächeninhalt von Dreiecken und Parallelogrammen berechnen.', bpe: ['16.3'], vertiefung: true, verweise: [...v(VP, 'vertiefung', 'zusammenfassung'), ...v(UV, 'ohne-hilfsmittel')], teile: ['1'] },

  /* ----- Geraden ----- */
  { id: 'geradengleichung', nr: '18', gruppe: 'geraden', text: 'eine Geradengleichung bestimmen.', bpe: ['16.1'], verweise: [...v(GG, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'punktprobe-gerade', nr: '19', gruppe: 'geraden', text: 'überprüfen, ob ein Punkt auf einer gegebenen Geraden liegt.', bpe: ['16.1'], verweise: [...v(GG, 'entdecken', 'ueberpruefen')], teile: ['a', 'b'] },
  { id: 'besondere-lage-gerade', nr: '20', gruppe: 'geraden', text: 'die besondere Lage gegebener Geraden im Koordinatensystem erkennen und beschreiben.', bpe: ['16.1'], verweise: [...v(SB, 'erklaeren', 'entdecken', 'zusammenfassung')], teile: ['1'] },
  { id: 'spurpunkte-gerade', nr: '21', gruppe: 'geraden', text: 'die Spurpunkte von Geraden mit den Koordinatenebenen berechnen.', bpe: ['16.1'], verweise: [...v(SB, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'lage-geraden', nr: '22', gruppe: 'geraden', text: 'die gegenseitige Lage von Geraden untersuchen und gegebenenfalls den Schnittpunkt bestimmen.', bpe: ['16.2'], verweise: [...v(GL, 'erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'gerade-gegebene-lage', nr: '40', gruppe: 'geraden', text: 'Geraden angeben, die zu einer gegebenen Geraden eine bestimmte Lage haben (zum Beispiel parallel), auch mit einem Parameter.', bpe: ['16.2'], ergaenzt: true, verweise: [...v(GL, 'entdecken', 'zusammenfassung'), ...v(UG, 'ohne-hilfsmittel')], teile: ['1'] },
  { id: 'abstand-punkt-gerade', nr: '23', gruppe: 'geraden', text: 'den Abstand eines Punktes zu einer Geraden berechnen.', bpe: ['16.6'], verweise: [...v(AG, 'erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'schnittwinkel-geraden', nr: '24', gruppe: 'geraden', text: 'den Schnittwinkel zweier Geraden berechnen.', bpe: ['16.2'], verweise: [...v(SG, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'winkel-koordinatenebene', nr: '25', gruppe: 'geraden', text: 'den Winkel berechnen, unter dem eine Gerade eine Koordinatenebene schneidet.', bpe: ['16.1'], verweise: [...v(SG, 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },

  /* ----- Ebenen ----- */
  { id: 'parameterform', nr: '26', gruppe: 'ebenen', text: 'eine Ebenengleichung in Parameterform aufstellen.', bpe: ['16.3'], verweise: [...v(EE, 'erklaeren', 'zusammenfassung'), ...v(EA, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'koordinatenform', nr: '27', gruppe: 'ebenen', text: 'eine Ebenengleichung in Koordinatenform aufstellen.', bpe: ['16.3'], verweise: [...v(NK, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'achsenabschnitte', nr: '41', gruppe: 'ebenen', text: 'eine Ebenengleichung aus den Achsenabschnitten (Achsenabschnittsform) aufstellen.', bpe: ['16.3'], ergaenzt: true, verweise: [...v(ZD, 'erklaeren', 'ueberpruefen', 'zusammenfassung'), ...v(NK, 'zusammenfassung')], teile: ['1'] },
  { id: 'formwechsel', nr: '28', gruppe: 'ebenen', text: 'zwischen Parameterform und Koordinatenform hin und her wechseln.', bpe: ['16.3'], verweise: [...v(NK, 'erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'punktprobe-ebene', nr: '29', gruppe: 'ebenen', text: 'überprüfen, ob ein Punkt in einer Ebene liegt.', bpe: ['16.4'], verweise: [...v(EE, 'entdecken', 'ueberpruefen'), ...v(NK, 'ueberpruefen')], teile: ['1'] },
  { id: 'punkt-im-vieleck', nr: '30', gruppe: 'ebenen', text: 'überprüfen, ob ein Punkt innerhalb eines Parallelogramms oder Dreiecks liegt.', bpe: ['16.4'], verweise: [...v(EE, 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'spurpunkte-ebene', nr: '31', gruppe: 'ebenen', text: 'die Spurpunkte einer Ebene bestimmen.', bpe: ['16.4'], verweise: [...v(ZD, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'ebene-zeichnen', nr: '32', gruppe: 'ebenen', text: 'eine Ebene mithilfe ihrer Spurpunkte und Spurgeraden zeichnen.', bpe: ['16.4'], verweise: [...v(ZD, 'erklaeren', 'entdecken', 'ueberpruefen')], teile: ['1'] },
  { id: 'spurgeraden', nr: '42', gruppe: 'ebenen', text: 'die Gleichungen der Spurgeraden einer Ebene angeben.', bpe: ['16.4'], ergaenzt: true, verweise: [...v(ZD, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'besondere-lage-ebene', nr: '33', gruppe: 'ebenen', text: 'anhand der Parameterform oder der Koordinatenform die besondere Lage einer Ebene im Koordinatensystem beschreiben.', bpe: ['16.4'], verweise: [...v(ZD, 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'gerade-ebene', nr: '34', gruppe: 'ebenen', text: 'die gegenseitige Lage von Gerade und Ebene untersuchen und gegebenenfalls den Durchstoßpunkt bestimmen.', bpe: ['16.5'], verweise: [...v(GE, 'erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'orthogonal-gerade-ebene', nr: '43', gruppe: 'ebenen', text: 'die Orthogonalität von Gerade und Ebene untersuchen und nutzen.', bpe: ['16.5'], ergaenzt: true, verweise: [...v(GE, 'erklaeren', 'zusammenfassung'), ...v(AE, 'erklaeren')], teile: ['1'] },
  { id: 'gegebene-lage-ebene', nr: '44', gruppe: 'ebenen', text: 'Geraden und Ebenen angeben, die eine gegebene Lagebeziehung zu einer Ebene erfüllen (auch mit einem Parameter).', bpe: ['16.5'], ergaenzt: true, verweise: [...v(GE, 'ueberpruefen', 'zusammenfassung'), ...v(ZE, 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'zwei-ebenen', nr: '35', gruppe: 'ebenen', text: 'die gegenseitige Lage zweier Ebenen bestimmen.', bpe: ['16.5'], verweise: [...v(ZE, 'erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'abstand-punkt-ebene', nr: '36', gruppe: 'ebenen', text: 'den Abstand eines Punktes zu einer Ebene berechnen.', bpe: ['16.6'], verweise: [...v(AE, 'erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'punkt-mit-abstand', nr: '37', gruppe: 'ebenen', text: 'einen Punkt mit einem bestimmten Abstand zu einer Ebene bestimmen.', bpe: ['16.6'], verweise: [...v(AE, 'entdecken', 'ueberpruefen')], teile: ['1'] },
  { id: 'spiegelung-ebene', nr: '38', gruppe: 'ebenen', text: 'einen Punkt an einer Ebene spiegeln.', bpe: ['16.6'], verweise: [...v(AE, 'erklaeren', 'ueberpruefen', 'zusammenfassung')], teile: ['1'] },
  { id: 'abstand-parallel', nr: '45', gruppe: 'ebenen', text: 'den Abstand einer Geraden zu einer parallelen Ebene und den Abstand paralleler Ebenen berechnen.', bpe: ['16.6'], ergaenzt: true, verweise: [...v(AE, 'erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'volumen', nr: '39', gruppe: 'ebenen', text: 'das Volumen von Quader und Pyramide berechnen.', bpe: ['16.6'], verweise: [...v(FV, 'erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'spatprodukt', nr: '46', gruppe: 'ebenen', text: 'das Volumen von Spat und Pyramide mit dem Spatprodukt berechnen.', bpe: ['16.6'], ergaenzt: true, vertiefung: true, verweise: [...v(FV, 'vertiefung', 'zusammenfassung')], teile: ['1'] },
  { id: 'problemloesen', nr: '47', gruppe: 'ebenen', text: 'bei einer neuen Problemstellung das Problemlöseschema nutzen: das Problem verstehen, Vermutungen aufstellen und überprüfen, Sonderfälle untersuchen und die Lösung verallgemeinern.', bpe: ['8.1'], ergaenzt: true, verweise: [...v(PL, 'vorgehen', 'punkte-vertauschen', 'bildpunkt', 'zusammenfassung')], teile: ['a', 'b'] },
  { id: 'transfer', nr: '!', gruppe: 'ebenen', text: 'die obigen mathematischen Fähigkeiten auf komplexere und anwendungsbezogene Aufgaben anwenden.', bpe: ['16.7'], verweise: [...v(UV, 'ohne-hilfsmittel', 'mit-hilfsmittel'), ...v(UG, 'ohne-hilfsmittel', 'mit-hilfsmittel', 'problemloesen'), ...v(UE, 'ohne-hilfsmittel', 'mit-hilfsmittel', 'problemloesen')], teile: [] },
];

export const aussage = (id: string): Aussage => {
  const a = AUSSAGEN.find((x) => x.id === id);
  if (!a) throw new Error(`Unbekannte Aussage: ${id}`);
  return a;
};
