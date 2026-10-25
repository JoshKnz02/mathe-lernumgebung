import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AppInhalt } from '../src/app/AppInhalt';
import type { Route } from '../src/app/router';
import { beispielInhalt } from './hilfen';

const lader = () => Promise.reject(new Error('nicht benötigt'));
const inhalt = beispielInhalt();
const leiste = (route: Route) => {
  const html = renderToStaticMarkup(<AppInhalt inhalt={inhalt} route={route} entwuerfe={false} lader={lader} />);
  return html.slice(html.indexOf('<nav'), html.indexOf('</nav>'));
};
/** Gruppen der Seitenleiste: Themenbereich, aufgeklappt oder nicht, und ob die Liste versteckt ist. */
const gruppen = (nav: string) =>
  [...nav.matchAll(/<button[^>]*class="nav-umschalter"[^>]*aria-expanded="(true|false)"[^>]*aria-controls="([^"]+)"[^>]*><span>([^<]+)<\/span>/g)].map((m) => ({
    titel: m[3]!,
    offen: m[1] === 'true',
    versteckt: new RegExp(`<ul id="${m[2]!.replace(/[:]/g, '\\:')}"[^>]*hidden`).test(nav),
  }));

describe('Seitenleiste: Themenbereiche auf- und zuklappen', () => {
  it('jeder Themenbereich ist ein Knopf mit aria-expanded und aria-controls', () => {
    const nav = leiste({ art: 'kurs', kurs: 'k1' });
    expect(nav.match(/class="nav-umschalter"/g)).toHaveLength(2);
    expect(nav).toContain('aria-expanded=');
    expect(nav).toContain('aria-controls=');
  });
  it('geöffnet ist das Thema des aktuellen Unterrichtsmoduls, die übrigen sind zu und ihre Liste ist versteckt', () => {
    // Kurs k1: aktuelles Modul m3 liegt in Thema B
    const g = gruppen(leiste({ art: 'kurs', kurs: 'k1' }));
    expect(g.map((x) => [x.titel, x.offen, x.versteckt])).toEqual([['Thema A', false, true], ['Thema B', true, false]]);
  });
  it('auf einer Modulseite ist das Thema des Moduls offen', () => {
    const g = gruppen(leiste({ art: 'modul', kurs: 'k1', modul: 'm1' }));
    expect(g.map((x) => [x.titel, x.offen])).toEqual([['Thema A', true], ['Thema B', true]]);
    const g2 = gruppen(leiste({ art: 'modul', kurs: 'k2', modul: 'm3' }));
    expect(g2.find((x) => x.titel === 'Thema B')?.offen).toBe(true);
  });
  it('auf einer Themenseite ist dieses Thema offen und die Übersicht als aktuelle Seite markiert', () => {
    const nav = leiste({ art: 'thema', kurs: 'k1', thema: 'ta' });
    expect(gruppen(nav).find((x) => x.titel === 'Thema A')?.offen).toBe(true);
    expect(nav).toMatch(/aria-current="page"[^>]*>Übersicht</);
  });
  it('jede Gruppe enthält den Verweis auf die Themenübersicht und alle Module des Themas', () => {
    const nav = leiste({ art: 'kurs', kurs: 'k1' });
    expect(nav.match(/>Übersicht</g)).toHaveLength(2);
    for (const titel of ['Modul Eins', 'Modul Zwei', 'Modul Drei']) expect(nav).toContain(titel);
  });
  it('mit nur einem Themenbereich ist er von Anfang an offen', () => {
    const einThema = { ...inhalt, kurse: [{ id: 'k3', titel: 'K3', themen: ['ta'], module: ['m1', 'm2'], aktuellesModul: null }] };
    const html = renderToStaticMarkup(<AppInhalt inhalt={einThema} route={{ art: 'kurs', kurs: 'k3' }} entwuerfe={false} lader={lader} />);
    const nav = html.slice(html.indexOf('<nav'), html.indexOf('</nav>'));
    expect(gruppen(nav).map((x) => x.offen)).toEqual([true]);
  });
});
