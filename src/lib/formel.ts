import katex from 'katex';

export type FormelErgebnis = { ok: true; html: string } | { ok: false; fehler: string };

/** Rendert TeX mit KaTeX (lokal, ohne externe Anfragen). Fehlerhafte Formeln werden gemeldet statt still dargestellt. */
export function rendereFormel(tex: string, anzeige = false): FormelErgebnis {
  try {
    const html = katex.renderToString(tex, {
      displayMode: anzeige,
      throwOnError: true,
      strict: 'error',
      trust: false,
      output: 'htmlAndMathml',
    });
    return { ok: true, html };
  } catch (e) {
    return { ok: false, fehler: e instanceof Error ? e.message : String(e) };
  }
}
