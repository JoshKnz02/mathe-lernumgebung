import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseAst } from 'rolldown/parseAst';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Formel } from '../src/components/Formel';

const alleTsx = (ordner: string): string[] =>
  readdirSync(ordner).flatMap((n) => {
    const p = join(ordner, n);
    return statSync(p).isDirectory() ? alleTsx(p) : p.endsWith('.tsx') ? [p] : [];
  });

interface Knoten {
  type: string;
  start: number;
  end: number;
  children?: Knoten[];
  openingElement?: { name: { name: string }; selfClosing: boolean; attributes: { name?: { name: string } }[] };
  [k: string]: unknown;
}

/** Findet Inline-Formeln, auf die im JSX-Text direkt ein Satzzeichen folgt, ohne dass es über das Attribut nach an die Formel gebunden ist. */
function ungebunden(datei: string): string[] {
  const quelle = readFileSync(datei, 'utf8');
  const funde: string[] = [];
  const besuche = (n: unknown) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(besuche);
    const k = n as Knoten;
    if ((k.type === 'JSXElement' || k.type === 'JSXFragment') && Array.isArray(k.children)) {
      for (let i = 0; i + 1 < k.children.length; i++) {
        const f = k.children[i]!;
        const t = k.children[i + 1]!;
        if (f.type !== 'JSXElement' || f.openingElement?.name.name !== 'Formel') continue;
        const attribute = f.openingElement.attributes.map((a) => a.name?.name);
        if (attribute.includes('anzeige') || attribute.includes('nach')) continue;
        if (t.type === 'JSXText' && /^[,.;:?!)]/.test(quelle.slice(t.start, t.end))) funde.push(`${datei}: ${quelle.slice(f.start, f.end).slice(0, 60)} ${quelle.slice(t.start, t.end).slice(0, 15)}`);
      }
    }
    for (const key of Object.keys(k)) if (key !== 'type') besuche(k[key]);
  };
  besuche(parseAst(quelle, { lang: 'tsx' }));
  return funde;
}

describe('Satzzeichen hinter Formeln', () => {
  it('stehen in allen Modulen nie ungebunden direkt hinter einer Inline-Formel (sonst können sie allein am Zeilenanfang stehen)', () => {
    const dateien = alleTsx('content');
    expect(dateien.length).toBeGreaterThan(5);
    const funde = dateien.flatMap(ungebunden);
    expect(funde).toEqual([]);
  });

  it('der Baustein Formel bindet das Satzzeichen in eine unteilbare Einheit mit der Formel', () => {
    const html = renderToStaticMarkup(<Formel tex="a" nach="," />);
    expect(html).toMatch(/^<span class="formel-mit-zeichen"><span class="formel">.*<\/span>,<\/span>$/);
    expect(renderToStaticMarkup(<Formel tex="a" />)).not.toContain('formel-mit-zeichen');
    // abgesetzte Formeln brauchen es nicht
    expect(renderToStaticMarkup(<Formel tex="a" anzeige nach="." />)).not.toContain('formel-mit-zeichen');
  });

  it('der Prüfer erkennt einen ungebundenen Fall', () => {
    const quelle = 'const x = <p>Die Werte <Formel tex="a" />, <Formel tex="b" nach="," /> und mehr.</p>;';
    const ast = parseAst(quelle, { lang: 'tsx' }) as unknown as { body: { declarations: { init: Knoten }[] }[] };
    const kinder = ast.body[0]!.declarations[0]!.init.children!;
    const text = kinder[2]!;
    expect(kinder[1]!.type).toBe('JSXElement');
    expect(/^[,.;:?!)]/.test(quelle.slice(text.start, text.end))).toBe(true);
  });
});
