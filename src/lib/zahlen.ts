const EPS = 1e-9;
const MAX_NENNER = 24;

const rundeAuf = (x: number, stellen: number) => Math.round((x + Number.EPSILON) * 10 ** stellen) / 10 ** stellen;

/** Dezimalzahl mit deutschem Komma, höchstens 2 Nachkommastellen, ohne überflüssige Nullen. Für Fließtext. */
export function zahlText(x: number): string {
  const r = rundeAuf(x, 2);
  return String(Object.is(r, -0) ? 0 : r).replace('.', ',').replace('-', '−');
}

/** Dezimalzahl als TeX mit Komma in geschweiften Klammern (richtiger Abstand), z. B. 1{,}5. */
export function zahlTex(x: number): string {
  const r = rundeAuf(x, 2);
  return String(Object.is(r, -0) ? 0 : r).replace('.', '{,}');
}

function bruch(x: number): { zaehler: number; nenner: number } | null {
  const q = x / Math.PI;
  for (let n = 1; n <= MAX_NENNER; n++) {
    const z = Math.round(q * n);
    if (Math.abs(q * n - z) < EPS * n) return { zaehler: z, nenner: n };
  }
  return null;
}

/** x als rationales Vielfaches von π in TeX (z. B. \frac{3\pi}{4}); sonst als Dezimalzahl. */
export function piTex(x: number): string {
  if (Math.abs(x) < EPS) return '0';
  const b = bruch(x);
  if (!b) return zahlTex(x);
  const vorzeichen = b.zaehler < 0 ? '-' : '';
  const z = Math.abs(b.zaehler);
  const pi = z === 1 ? '\\pi' : `${z}\\pi`;
  return b.nenner === 1 ? `${vorzeichen}${pi}` : `${vorzeichen}\\frac{${pi}}{${b.nenner}}`;
}

/** x als rationales Vielfaches von π als einfacher Text (z. B. 3π/4, −π/2); sonst als Dezimalzahl. Für Achsenbeschriftungen. */
export function piText(x: number): string {
  if (Math.abs(x) < EPS) return '0';
  const b = bruch(x);
  if (!b) return zahlText(x);
  const vorzeichen = b.zaehler < 0 ? '−' : '';
  const z = Math.abs(b.zaehler);
  const pi = z === 1 ? 'π' : `${z}π`;
  return b.nenner === 1 ? `${vorzeichen}${pi}` : `${vorzeichen}${pi}/${b.nenner}`;
}
