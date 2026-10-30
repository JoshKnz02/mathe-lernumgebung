/**
 * Regeln für Venn-Diagramme mit drei Mengen. Die Regionen heißen A bis H: A nur Menge 1, B nur Menge 2, C nur Menge 3, D Menge 1 und 2,
 * E Menge 2 und 3, F Menge 1 und 3, G alle drei, H keine der drei.
 */

export type Region = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export const REGIONEN: Region[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/** Mitgliedschaft in den drei Mengen, in der Reihenfolge der Kreise. */
export type Mitglied = [boolean, boolean, boolean];

export function regionVon([m1, m2, m3]: Mitglied): Region {
  if (m1 && m2 && m3) return 'G';
  if (m1 && m2) return 'D';
  if (m2 && m3) return 'E';
  if (m1 && m3) return 'F';
  if (m1) return 'A';
  if (m2) return 'B';
  if (m3) return 'C';
  return 'H';
}

/** Umkehrung von regionVon. */
export function mitgliedVon(r: Region): Mitglied {
  return ['ADFG'.includes(r), 'BDEG'.includes(r), 'CEFG'.includes(r)];
}

/** Beschreibung einer Region in Worten, aus den Namen der drei Mengen. */
export function regionText(r: Region, namen: [string, string, string]): string {
  const m = mitgliedVon(r);
  const in_ = namen.filter((_, i) => m[i]);
  if (in_.length === 0) return 'keine der drei Eigenschaften';
  if (in_.length === 3) return `alle drei Eigenschaften: ${in_.join(', ')}`;
  return in_.length === 1 ? `nur ${in_[0]}` : `${in_[0]} und ${in_[1]}`;
}
