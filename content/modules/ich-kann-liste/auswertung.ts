import type { Aussage } from './daten';

/** Selbsteinschätzung wie auf der Ich-Kann-Liste: ++, 00, −−. */
export type Wahl = 'sicher' | 'ueben' | 'noch-nicht';

export const WAHL_ZEICHEN: Record<Wahl, string> = { sicher: '++', ueben: '00', 'noch-nicht': '−−' };
export const WAHL_TEXT: Record<Wahl, string> = {
  sicher: 'Das kann ich schon, da bin ich mir sicher.',
  ueben: 'Ich habe es verstanden, muss aber noch üben.',
  'noch-nicht': 'Das kann ich noch nicht, ich muss es erst erarbeiten und üben.',
};
export const WAHL_REIHENFOLGE: Wahl[] = ['sicher', 'ueben', 'noch-nicht'];

/** Schlüssel eines Teils der Kontrollaufgabe im Ergebnisspeicher. */
export const kontrollSchluessel = (aussageId: string, teil: string) => `${aussageId}:${teil}`;

/**
 * keine: Die Aussage hat keine Kontrollaufgabe. offen: noch nichts geprüft. teilweise: ein Teil richtig geprüft, ein anderer noch offen.
 * richtig: alle Teile richtig. falsch: mindestens ein Teil wurde zuletzt als nicht richtig gewertet.
 */
export type KontrollStatus = 'keine' | 'offen' | 'teilweise' | 'richtig' | 'falsch';

/** Ergebnisse der Kontrollaufgaben: Schlüssel, true = beim letzten Prüfen richtig. */
export type Ergebnisse = Record<string, boolean>;

export function kontrollStatus(a: Pick<Aussage, 'id' | 'teile'>, ergebnisse: Ergebnisse): KontrollStatus {
  if (a.teile.length === 0) return 'keine';
  const werte = a.teile.map((t) => ergebnisse[kontrollSchluessel(a.id, t)]);
  if (werte.every((w) => w === undefined)) return 'offen';
  if (werte.some((w) => w === false)) return 'falsch';
  if (werte.some((w) => w === undefined)) return 'teilweise';
  return 'richtig';
}

/**
 * zuerst: −− gewählt. ueben: 00 gewählt. pruefen: ++ gewählt, aber die Kontrollaufgabe war nicht richtig.
 * einschaetzen: noch keine Auswahl. gut: ++ gewählt und die Kontrollaufgabe nicht widersprechend.
 */
export type Empfehlung = 'zuerst' | 'ueben' | 'pruefen' | 'einschaetzen' | 'gut';

export function empfehlung(wahl: Wahl | undefined, status: KontrollStatus): Empfehlung {
  if (wahl === undefined) return 'einschaetzen';
  if (wahl === 'noch-nicht') return 'zuerst';
  if (wahl === 'ueben') return 'ueben';
  return status === 'falsch' ? 'pruefen' : 'gut';
}

const RANG: Record<Empfehlung, number> = { zuerst: 0, ueben: 1, pruefen: 2, einschaetzen: 3, gut: 4 };

/** Sortiert die Aussagen nach Dringlichkeit, bei gleichem Rang bleibt die Reihenfolge der Liste. */
export function nachDringlichkeit(aussagen: Aussage[], wahl: Record<string, Wahl>, ergebnisse: Ergebnisse): { aussage: Aussage; wahl: Wahl | undefined; status: KontrollStatus; empfehlung: Empfehlung }[] {
  return aussagen
    .map((aussage, i) => {
      const w = wahl[aussage.id];
      const status = kontrollStatus(aussage, ergebnisse);
      return { aussage, wahl: w, status, empfehlung: empfehlung(w, status), i };
    })
    .sort((p, q) => RANG[p.empfehlung] - RANG[q.empfehlung] || p.i - q.i)
    .map(({ i: _i, ...rest }) => rest);
}

/** Anzahl der Aussagen je Wahl und ohne Wahl. */
export function zaehle(aussagen: Aussage[], wahl: Record<string, Wahl>): Record<Wahl | 'offen', number> {
  const z: Record<Wahl | 'offen', number> = { sicher: 0, ueben: 0, 'noch-nicht': 0, offen: 0 };
  for (const a of aussagen) z[wahl[a.id] ?? 'offen']++;
  return z;
}
