import { describe, expect, it } from 'vitest';
import { alleModule, baueNavigation } from '../src/lib/navigation';
import { pruefeInhalte } from '../src/lib/validierung';
import { basisRoh } from './hilfen';

/** Kurse, die von einem Modul nur ausgewählte Abschnitte zeigen. */
describe('Kurs mit ausgewählten Abschnitten', () => {
  const roh = (abschnitte: unknown) => {
    const r = basisRoh();
    (r.module[0]!.daten as Record<string, unknown>).abschnitte = ['erklaeren', 'ueben', 'fazit'].map((id) => ({ id, titel: id }));
    (r.kurse[0]!.daten as Record<string, unknown>).abschnitte = abschnitte;
    return r;
  };
  const fehler = (abschnitte: unknown) => pruefeInhalte(roh(abschnitte), { produktion: true }).fehler.join('\n');

  it('zeigt nur die ausgewählten Abschnitte in der Reihenfolge des Moduls und lässt das Original unverändert', () => {
    const { inhalt, fehler: f } = pruefeInhalte(roh({ 'm-frei': ['fazit', 'ueben'] }), { produktion: true });
    expect(f).toEqual([]);
    const nav = baueNavigation(inhalt, 'k1', { entwuerfe: false })!;
    expect(alleModule(nav)[0]!.abschnitte!.map((a) => a.id)).toEqual(['ueben', 'fazit']);
    expect(inhalt.module.find((m) => m.id === 'm-frei')!.abschnitte).toHaveLength(3);
  });
  it('meldet fehlerhafte Angaben', () => {
    expect(fehler({ 'm-frei': ['gibt-es-nicht'] })).toMatch(/keinen Abschnitt "gibt-es-nicht"/);
    expect(fehler({ 'm-entwurf': ['ueben'] })).toMatch(/nicht in der Modulliste/);
    expect(fehler({ 'm-frei': [] })).toMatch(/nicht leere Liste/);
    expect(fehler({ 'm-frei': ['ueben', 'ueben'] })).toMatch(/mehrfach/);
    expect(fehler(['ueben'])).toMatch(/je Modul-ID/);
  });
});
