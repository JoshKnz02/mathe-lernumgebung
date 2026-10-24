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

  it('enthält keine Vorschau und keine früheren Beispielinhalte', () => {
    const verboten = [
      'vorschau-alle', 'Vorschau: alle Module', 'Stand: entwurf', // Vorschau
      'Platzhalter', 'Demokurs', 'demo-a', 'demo-b', // frühere Vorschaubeispiele dürfen nie auftauchen
    ];
    for (const d of textdateien()) for (const v of verboten) expect(text(d), `${d}: ${v}`).not.toContain(v);
    expect(dateien.filter((d) => /demo/.test(d))).toEqual([]);
  });

  it('enthält die vier freigegebenen Module als eigene Teile und den Kurs Abitur 2028', () => {
    for (const id of ['einheitskreis-sinus-kosinus', 'lage-im-koordinatensystem', 'markante-punkte', 'trigonometrische-gleichungen']) {
      expect(dateien.some((d) => d.startsWith('assets/') && d.includes(id) && d.endsWith('.js')), id).toBe(true);
    }
    const js = dateien.filter((d) => d.endsWith('.js')).map(text).join('\n');
    expect(js).toContain('Abitur 2028');
    expect(js).toContain('Vom Einheitskreis zu Sinus- und Kosinusfunktion');
    expect(js).toContain('Lage im Koordinatensystem');
    expect(js).toContain('Markante Punkte');
    expect(js).toContain('Trigonometrische Gleichungen');
    expect(js).not.toContain('Zusammengesetzte Funktionen');
  });

  it('erzeugt Startseite, 404.html und eigene Seiten für den Kurs, das Thema, die Module und jeden Abschnitt', () => {
    const abschnitte = ['erklaeren', 'entdecken', 'ueberpruefen', 'zusammenfassung'];
    const erwartet = [
      'index.html', '404.html', 'kurs/abitur-2028/index.html', 'kurs/abitur-2028/wiederholen/index.html',
      'kurs/abitur-2028/thema/trigonometrische-funktionen/index.html',
      ...['einheitskreis-sinus-kosinus', 'lage-im-koordinatensystem', 'markante-punkte', 'trigonometrische-gleichungen'].flatMap((m) => [
        `kurs/abitur-2028/modul/${m}/index.html`,
        ...abschnitte.map((a) => `kurs/abitur-2028/modul/${m}/${a}/index.html`),
      ]),
    ];
    for (const d of erwartet) expect(dateien, d).toContain(d);
    expect(dateien.filter((d) => d.endsWith('.html')).length).toBe(erwartet.length);
    expect(dateien.filter((d) => d.startsWith('kurs/') && !d.startsWith('kurs/abitur-2028/'))).toEqual([]);
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
      const abschnitte = id === 'frei' ? { abschnitte: [{ id: 'erklaeren', titel: 'Erklären' }, { id: 'ueben', titel: 'Üben' }] } : {};
      schreibe(`content/modules/${id}/meta.json`, JSON.stringify({ id, titel: id, thema: 't', status, beschreibung: 'x', ...abschnitte }));
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

  it('erzeugt je Abschnitt eines freigegebenen Moduls eine eigene Seite', async () => {
    const ergebnis = (await baue(projekt(['frei']), true)) as { output: { fileName: string }[] }[] | { output: { fileName: string }[] };
    const namen = (Array.isArray(ergebnis) ? ergebnis.flatMap((e) => e.output) : ergebnis.output).map((a) => a.fileName);
    for (const n of ['kurs/k/modul/frei/index.html', 'kurs/k/modul/frei/erklaeren/index.html', 'kurs/k/modul/frei/ueben/index.html']) expect(namen).toContain(n);
  }, 60_000);

  it('derselbe Kurs baut in der Vorschau, der Entwurf bleibt aber im Produktionsbuild draußen, wenn kein Kurs ihn nennt', async () => {
    await expect(baue(projekt(['frei', 'skizze']), false)).resolves.toBeDefined();
    const ergebnis = (await baue(projekt(['frei']), true)) as { output: { fileName: string; code?: string }[] }[] | { output: { fileName: string; code?: string }[] };
    const ausgabe = Array.isArray(ergebnis) ? ergebnis.flatMap((e) => e.output) : ergebnis.output;
    expect(ausgabe.map((a) => a.code ?? '').join('')).not.toContain('skizze');
  }, 60_000);
});
