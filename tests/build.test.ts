import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { build } from 'vite';
import { ladeInhalte } from '../build/inhalte.ts';
import { lernumgebung } from '../build/plugin.ts';
import { InhaltsFehler } from '../src/lib/validierung.ts';

function alleDateien(ordner: string): string[] {
  return readdirSync(ordner).flatMap((n) => {
    const p = join(ordner, n);
    return statSync(p).isDirectory() ? alleDateien(p) : [p];
  });
}

const arbeit = mkdtempSync(join(tmpdir(), 'lernumgebung-test-'));
afterAll(() => rmSync(arbeit, { recursive: true, force: true }));

describe('öffentlicher Build (Produktion)', () => {
  const ziel = join(arbeit, 'dist');
  let dateien: string[] = [];

  beforeAll(async () => {
    await build({ root: process.cwd(), mode: 'production', logLevel: 'silent', build: { outDir: ziel, emptyOutDir: true } });
    dateien = alleDateien(ziel).map((d) => relative(ziel, d));
  }, 120_000);

  const text = (d: string) => readFileSync(join(ziel, d), 'utf8');
  const textdateien = () => dateien.filter((d) => /\.(html|js|css|json)$/.test(d));

  it('enthält keinen Entwurf, weder als Modul noch in Metadaten, Text oder Seitenliste', () => {
    for (const d of textdateien()) {
      expect(text(d), d).not.toContain('demo-integral-entwurf');
      expect(text(d), d).not.toContain('ENTWURFS-MARKE-7f3a9c');
      expect(text(d), d).not.toContain('Stammfunktionen (Entwurf)');
      expect(text(d), d).not.toContain('sinusfunktion-allgemein');
      expect(text(d), d).not.toContain('einheitskreis-sinus-kosinus');
      expect(text(d), d).not.toContain('Zusammenfassung zum Nachschlagen');
      expect(text(d), d).not.toContain('Untersuchungsaufträge');
    }
    // JSXGraph wird nur von Entwurfsmodulen verwendet und gehört deshalb nicht in den öffentlichen Build.
    expect(textdateien().some((d) => /JSXGraph/.test(text(d)))).toBe(false);
    expect(dateien.filter((d) => d.includes('integral'))).toEqual([]);
  });

  it('enthält die freigegebenen Module als eigene Teile', () => {
    for (const id of ['demo-sinus-platzhalter', 'demo-ableitung-platzhalter']) {
      expect(dateien.some((d) => d.startsWith('assets/') && d.includes(id) && d.endsWith('.js')), id).toBe(true);
    }
  });

  it('erzeugt Startseite, 404.html und eigene Startseiten je Kurs', () => {
    for (const d of ['index.html', '404.html', 'kurs/demo-a/index.html', 'kurs/demo-b/index.html', 'kurs/demo-a/wiederholen/index.html', 'kurs/demo-b/modul/demo-sinus-platzhalter/index.html']) {
      expect(dateien, d).toContain(d);
    }
    expect(dateien).not.toContain('kurs/demo-b/modul/demo-verkettung-platzhalter/index.html');
  });

  it('setzt auf jeder HTML-Seite noindex', () => {
    const seiten = dateien.filter((d) => d.endsWith('.html'));
    expect(seiten.length).toBeGreaterThan(5);
    for (const d of seiten) expect(text(d), d).toMatch(/<meta name="robots" content="noindex, nofollow"/);
  });

  it('verweist auf Dateien unter dem Pages-Basispfad und lädt nichts von Drittanbietern', () => {
    for (const d of dateien.filter((x) => x.endsWith('.html'))) {
      const html = text(d);
      expect(html, d).toContain('/mathe-lernumgebung/assets/');
      expect(html, d).not.toMatch(/(?:src|href)="https?:\/\//);
    }
    for (const d of dateien.filter((x) => x.endsWith('.css'))) expect(text(d), d).not.toMatch(/url\(\s*["']?https?:/);
  });

  it('liefert die KaTeX-Schriften lokal aus', () => {
    expect(dateien.some((d) => /KaTeX_Main-Regular.*\.woff2$/.test(d))).toBe(true);
  });
});

describe('Abbruch bei Verweis auf einen Entwurf', () => {
  const projekt = (kursModule: string[]) => {
    const root = mkdtempSync(join(arbeit, 'projekt-'));
    const schreibe = (p: string, inhalt: string) => {
      mkdirSync(join(root, p, '..'), { recursive: true });
      writeFileSync(join(root, p), inhalt);
    };
    schreibe('content/themen.json', JSON.stringify({ themen: [{ id: 't', titel: 'T' }] }));
    for (const [id, status] of [['frei', 'freigegeben'], ['skizze', 'entwurf']] as const) {
      schreibe(`content/modules/${id}/meta.json`, JSON.stringify({ id, titel: id, thema: 't', status, beschreibung: 'x' }));
      schreibe(`content/modules/${id}/index.tsx`, 'export default function M() { return null; }');
    }
    schreibe('courses/k.json', JSON.stringify({ id: 'k', titel: 'K', themen: ['t'], module: kursModule, aktuellesModul: null }));
    schreibe('index.html', '<!doctype html><title>t</title><script type="module" src="/main.ts"></script>');
    schreibe('main.ts', "import { inhalt } from 'virtual:lernumgebung'; console.log(inhalt);");
    return root;
  };
  const baue = (root: string, produktion: boolean) =>
    build({
      root,
      configFile: false,
      logLevel: 'silent',
      plugins: [lernumgebung({ produktion, einzelDatei: false })],
      build: { outDir: join(root, 'aus'), write: false },
    });

  it('ladeInhalte wirft im Produktionsmodus', () => {
    expect(() => ladeInhalte(projekt(['frei', 'skizze']), { produktion: true })).toThrow(InhaltsFehler);
    expect(() => ladeInhalte(projekt(['frei']), { produktion: true })).not.toThrow();
  });

  it('der Vite-Build schlägt fehl, wenn ein Kurs einen Entwurf nennt', async () => {
    await expect(baue(projekt(['frei', 'skizze']), true)).rejects.toThrow(/Entwurf/);
  }, 60_000);

  it('derselbe Kurs baut in der Vorschau, der Entwurf bleibt aber im Produktionsbuild draußen, wenn kein Kurs ihn nennt', async () => {
    await expect(baue(projekt(['frei', 'skizze']), false)).resolves.toBeDefined();
    const ergebnis = (await baue(projekt(['frei']), true)) as { output: { fileName: string; code?: string }[] }[] | { output: { fileName: string; code?: string }[] };
    const ausgabe = Array.isArray(ergebnis) ? ergebnis.flatMap((e) => e.output) : ergebnis.output;
    expect(ausgabe.map((a) => a.code ?? '').join('')).not.toContain('skizze');
  }, 60_000);
});
