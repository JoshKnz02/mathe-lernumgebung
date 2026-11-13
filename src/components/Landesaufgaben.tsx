import { Hinweis } from './Hinweis';

/** Offizielle Seite des Landes Baden-Württemberg mit den Musterprüfungen Mathematik am Beruflichen Gymnasium (Landesbildungsserver). */
export const LANDESAUFGABEN_URL = 'https://www.schule-bw.de/faecher-und-schularten/berufliche-schularten/berufliches-gymnasium-oberstufe/allgemeine-faecher/mathematik/musterpruefungen';

/**
 * Hinweis auf die Prüfungsaufgaben des Landes am Ende der Übungsmodule im Abiturstil. Die Aufgaben der Module sind frei geschrieben,
 * die Seite des Landes hat die Aufgaben im Originalformat. Der Link öffnet in einem neuen Tab, beim Laden der Modulseite wird nichts angefragt.
 */
export function Landesaufgaben() {
  return (
    <Hinweis titel="Aufgaben des Landes Baden-Württemberg">
      Die Aufgaben in diesem Modul sind frei geschrieben und üben das Prüfungsformat. Die offiziellen Musterprüfungen des Landes für das Berufliche Gymnasium, mit Lösungen, findest du auf dem Landesbildungsserver:{' '}
      <a href={LANDESAUFGABEN_URL} target="_blank" rel="noopener noreferrer">
        Musterprüfungen Mathematik im Beruflichen Gymnasium (öffnet in einem neuen Tab)
      </a>
      .
    </Hinweis>
  );
}
