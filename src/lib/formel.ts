import katex from 'katex';

export type FormelErgebnis = { ok: true; html: string } | { ok: false; fehler: string };

const ZAHL = /^-?\d+(\{,\}\d+)?$/;
const SPALTE = /\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g;

/**
 * Richtet Spaltenvektoren aus: Steht ein Minuszeichen vor einer Koordinate, rücken die Ziffern sonst nach rechts, weil KaTeX die Einträge mittig setzt.
 * Besteht eine einspaltige `pmatrix` nur aus Zahlen, steht sie rechtsbündig (Ziffer unter Ziffer, das Minuszeichen ragt nach links). Bei Termen als Einträgen
 * (zum Beispiel `2+2\cdot 1`) bleibt es bei mittiger Ausrichtung, Einträge ohne Minuszeichen erhalten dann ein unsichtbares Minus (`\phantom{-}`), wenn andere eines haben.
 * Matrizen mit mehreren Spalten (mit `&`) bleiben unverändert.
 */
export function richteSpaltenAus(tex: string): string {
  return tex.replace(SPALTE, (ganz, inhalt: string) => {
    if (inhalt.includes('&')) return ganz;
    const eintraege = inhalt.split('\\\\').map((e) => e.trim());
    if (eintraege.every((e) => ZAHL.test(e))) return `\\begin{pmatrix*}[r]${eintraege.join('\\\\')}\\end{pmatrix*}`;
    const mitMinus = eintraege.filter((e) => e.startsWith('-')).length;
    if (mitMinus === 0 || mitMinus === eintraege.length) return ganz;
    return `\\begin{pmatrix}${eintraege.map((e) => (e.startsWith('-') ? e : `\\phantom{-}${e}`)).join('\\\\')}\\end{pmatrix}`;
  });
}

const maskiere = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

/** Rendert TeX mit KaTeX (lokal, ohne externe Anfragen). Fehlerhafte Formeln werden gemeldet statt still dargestellt. */
export function rendereFormel(tex: string, anzeige = false): FormelErgebnis {
  try {
    const ausgerichtet = richteSpaltenAus(tex);
    let html = katex.renderToString(ausgerichtet, {
      displayMode: anzeige,
      throwOnError: true,
      strict: 'error',
      trust: false,
      output: 'htmlAndMathml',
    });
    // Die Textalternative (MathML-Annotation) behält den ursprünglichen Quelltext, die Ausrichtung betrifft nur die Darstellung.
    if (ausgerichtet !== tex) html = html.replace(/(<annotation encoding="application\/x-tex">)[\s\S]*?(<\/annotation>)/, (_m, a: string, b: string) => `${a}${maskiere(tex)}${b}`);
    return { ok: true, html };
  } catch (e) {
    return { ok: false, fehler: e instanceof Error ? e.message : String(e) };
  }
}
