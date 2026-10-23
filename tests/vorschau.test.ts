import { describe, expect, it } from 'vitest';
import { ladeInhalte } from '../build/inhalte.ts';
import { VORSCHAU_KURS_ID, erzeugeVorschauKurs } from '../src/lib/vorschau.ts';
import { baueNavigation } from '../src/lib/navigation.ts';

describe('Vorschaukurs', () => {
  const inhalt = ladeInhalte(process.cwd(), { produktion: false });
  const kurs = erzeugeVorschauKurs(inhalt);

  it('enthält alle Module genau einmal, auch Entwürfe', () => {
    expect([...kurs.module].sort()).toEqual(inhalt.module.map((m) => m.id).sort());
    expect(inhalt.module.some((m) => m.status === 'entwurf')).toBe(true);
  });

  it('listet nur Themenbereiche mit Modulen, in der Reihenfolge der Themendatei', () => {
    const erwartet = inhalt.themen.filter((t) => inhalt.module.some((m) => m.thema === t.id)).map((t) => t.id);
    expect(kurs.themen).toEqual(erwartet);
    for (const t of kurs.themen) expect(kurs.module.some((id) => inhalt.module.find((m) => m.id === id)?.thema === t)).toBe(true);
  });

  it('ergibt in der Vorschau-Navigation alle Module, ohne Entwürfe nur die freigegebenen', () => {
    const voll = { ...inhalt, kurse: [kurs] };
    const mit = baueNavigation(voll, VORSCHAU_KURS_ID, { entwuerfe: true })!;
    const ohne = baueNavigation(voll, VORSCHAU_KURS_ID, { entwuerfe: false })!;
    expect(mit.themen.flatMap((t) => t.module)).toHaveLength(inhalt.module.length);
    expect(ohne.themen.flatMap((t) => t.module).every((m) => m.status === 'freigegeben')).toBe(true);
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
