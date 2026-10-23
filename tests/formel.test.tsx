import type { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Formel } from '../src/components/Formel';
import { rendereFormel } from '../src/lib/formel';

describe('Formeldarstellung', () => {
  it('rendert TeX mit KaTeX samt MathML für Screenreader', () => {
    const r = rendereFormel(String.raw`f(x)=a\sin\bigl(b\,(x-c)\bigr)+d`);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.html).toContain('class="katex"');
      expect(r.html).toContain('<math');
      expect(r.html).toContain('application/x-tex');
    }
  });

  it('unterscheidet Fließtext- und abgesetzte Darstellung', () => {
    expect(renderToStaticMarkup(<Formel tex="x^2" />)).not.toContain('katex-display');
    expect(renderToStaticMarkup(<Formel tex="x^2" anzeige />)).toContain('katex-display');
  });

  it('meldet fehlerhaftes TeX, statt es still falsch darzustellen', () => {
    expect(rendereFormel(String.raw`\frac{1}{`).ok).toBe(false);
    expect(rendereFormel(String.raw`\unbekannterbefehl`).ok).toBe(false);
    const html = renderToStaticMarkup(<Formel tex={String.raw`\frac{1}{`} />);
    expect(html).toContain('formel-fehler');
  });

  it('erzeugt aus \\href keinen Link (trust ist aus)', () => {
    const r = rendereFormel(String.raw`\href{https://example.org}{x}`);
    expect(r.ok ? r.html : '').not.toContain('<a ');
  });

  it('stellt Formeln in allen Modulen ohne Formelfehler dar', async () => {
    const module = import.meta.glob<{ default: ComponentType }>('../content/modules/*/index.tsx', { eager: true });
    expect(Object.keys(module).length).toBeGreaterThanOrEqual(5);
    for (const [pfad, m] of Object.entries(module)) {
      const Modul = m.default;
      const html = renderToStaticMarkup(<Modul />);
      expect(html, pfad).toContain('class="katex"');
      expect(html, pfad).not.toContain('formel-fehler');
    }
  });
});
