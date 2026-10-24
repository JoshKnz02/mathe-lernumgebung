import { describe, expect, it } from 'vitest';
import { ladeInhalte } from '../build/inhalte.ts';
import { VORSCHAU_KURS_ID, erzeugeVorschauKurs } from '../src/lib/vorschau.ts';
import { baueNavigation } from '../src/lib/navigation.ts';
import { beispielInhalt } from './hilfen.ts';

describe('Vorschaukurs', () => {
  const inhalt = ladeInhalte(process.cwd(), { produktion: false });
  const kurs = erzeugeVorschauKurs(inhalt);

  it('enthält alle Module genau einmal, auch Entwürfe', () => {
    expect([...kurs.module].sort()).toEqual(inhalt.module.map((m) => m.id).sort());
    const test = beispielInhalt();
    const testKurs = erzeugeVorschauKurs(test);
    expect([...testKurs.module].sort()).toEqual(['m1', 'm2', 'm3', 'm4']);
    expect(test.module.some((m) => m.status === 'entwurf')).toBe(true);
  });

  it('ordnet die Module wie die echten Kurse, Entwürfe ohne Kurs folgen danach', () => {
    const test = beispielInhalt();
    // Ein neuer Entwurf, der alphabetisch vor allen anderen steht und in keinem Kurs vorkommt
    const mitEntwurf = { ...test, module: [{ id: 'a-entwurf', titel: 'A', thema: 'ta', status: 'entwurf' as const, beschreibung: 'x' }, ...test.module] };
    const k = erzeugeVorschauKurs(mitEntwurf);
    const kursTa = test.kurse[0]!.module.filter((id) => test.module.find((m) => m.id === id)!.thema === 'ta');
    const ta = k.module.filter((id) => mitEntwurf.module.find((m) => m.id === id)!.thema === 'ta');
    expect(ta).toEqual([...kursTa, 'a-entwurf']);
    // Ein Kurs mit nurVorschau bestimmt die Reihenfolge nicht
    const mitVorschauKurs = { ...mitEntwurf, kurse: [{ id: 'v', titel: 'V', themen: ['ta'], module: ['a-entwurf', 'm2', 'm1'], aktuellesModul: null, nurVorschau: true }, ...mitEntwurf.kurse] };
    expect(erzeugeVorschauKurs(mitVorschauKurs).module).toEqual(k.module);
  });

  it('listet nur Themenbereiche mit Modulen, in der Reihenfolge der Themendatei', () => {
    const erwartet = inhalt.themen.filter((t) => inhalt.module.some((m) => m.thema === t.id)).map((t) => t.id);
    expect(kurs.themen).toEqual(erwartet);
    for (const t of kurs.themen) expect(kurs.module.some((id) => inhalt.module.find((m) => m.id === id)?.thema === t)).toBe(true);
  });

  it('ergibt in der Vorschau-Navigation alle Module, ohne Entwürfe nur die freigegebenen', () => {
    const test = beispielInhalt();
    const voll = { ...test, kurse: [erzeugeVorschauKurs(test)] };
    const mit = baueNavigation(voll, VORSCHAU_KURS_ID, { entwuerfe: true })!;
    const ohne = baueNavigation(voll, VORSCHAU_KURS_ID, { entwuerfe: false })!;
    expect(mit.themen.flatMap((t) => t.module)).toHaveLength(test.module.length);
    expect(ohne.themen.flatMap((t) => t.module).map((m) => m.id)).toEqual(['m1', 'm2', 'm3']);
  });

  it('wird nur in der Vorschau erzeugt, nicht im öffentlichen Build', async () => {
    const { build } = await import('vite');
    const { mkdtempSync, readdirSync, readFileSync, statSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const ziel = mkdtempSync(join(tmpdir(), 'vorschaukurs-'));
    await build({ root: process.cwd(), mode: 'production', logLevel: 'silent', build: { outDir: ziel, emptyOutDir: true } });
    const alle = (d: string): string[] => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? alle(join(d, n)) : [join(d, n)]));
    for (const f of alle(ziel).filter((x) => /\.(html|js)$/.test(x))) expect(readFileSync(f, 'utf8'), f).not.toContain(VORSCHAU_KURS_ID);
  }, 120_000);
});
