import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { seitenPfade } from '../build/plugin';
import { AppInhalt } from '../src/app/AppInhalt';
import { erzeugePfad, parsePfad, type Route } from '../src/app/router';
import { alleModule, baueNavigation, findeNachbarn, modulNummer, nummerierterTitel, unterbereichVonModul } from '../src/lib/navigation';
import type { Inhalt } from '../src/lib/typen';
import { inhaltFuerVeroeffentlichung } from '../src/lib/veroeffentlichung';
import { pruefeInhalte } from '../src/lib/validierung';
import { erzeugeVorschauKurs } from '../src/lib/vorschau';
import { ladeInhalte } from '../build/inhalte';
import { basisRoh } from './hilfen';

const lader = () => Promise.reject(new Error('nicht benötigt'));

/** Eigener Testdatensatz: Thema "tv" mit zwei Unterbereichen und einem Abschluss, dazu ein Thema ohne Gliederung. */
function gegliedert(): Inhalt {
  const modul = (id: string, titel: string, thema: string, unterbereich?: string, status: 'freigegeben' | 'entwurf' = 'freigegeben') => ({
    id, titel, thema, status, beschreibung: `Beschreibung ${titel}`, ...(unterbereich ? { unterbereich } : {}),
  });
  return {
    themen: [
      { id: 'flach', titel: 'Flaches Thema' },
      { id: 'tv', titel: 'Gegliedertes Thema', beschreibung: 'Text zum Thema', unterbereiche: [{ id: 'u1', titel: 'Erster Teil', beschreibung: 'Text erster Teil' }, { id: 'u2', titel: 'Zweiter Teil' }, { id: 'u3', titel: 'Leerer Teil' }] },
    ],
    module: [
      modul('f1', 'Flach Eins', 'flach'),
      modul('a1', 'A Eins', 'tv', 'u1'),
      modul('b1', 'B Eins', 'tv', 'u2'),
      modul('a2', 'A Zwei', 'tv', 'u1'),
      modul('ik', 'Ich-Kann', 'tv'),
      modul('b2', 'B Zwei', 'tv', 'u2'),
      modul('x1', 'Entwurf in U3', 'tv', 'u3', 'entwurf'),
    ],
    // Kursreihenfolge bewusst durchmischt: die Navigation ordnet nach Unterbereichen
    kurse: [{ id: 'k', titel: 'Kurs', themen: ['flach', 'tv'], module: ['f1', 'a1', 'b1', 'a2', 'ik', 'b2', 'x1'], aktuellesModul: 'b1' }],
  };
}
const inhalt = gegliedert();
const nav = (entwuerfe = false) => baueNavigation(inhalt, 'k', { entwuerfe })!;
const seite = (route: Route, entwuerfe = false) => renderToStaticMarkup(<AppInhalt inhalt={inhalt} route={route} entwuerfe={entwuerfe} lader={lader} />);
const hauptteil = (html: string) => html.slice(html.indexOf('<main'), html.indexOf('</main>'));
const leiste = (route: Route) => {
  const html = seite(route);
  return html.slice(html.indexOf('<nav id="kursnavigation"'), html.indexOf('</nav>', html.indexOf('<nav id="kursnavigation"')));
};

describe('Validierung der Unterbereiche', () => {
  const roh = () => {
    const r = basisRoh();
    (r.themen.daten as { themen: Record<string, unknown>[] }).themen[0]!.unterbereiche = [{ id: 'u1', titel: 'U1' }, { id: 'u2', titel: 'U2', beschreibung: 'Text' }];
    return r;
  };
  const fehler = (r = roh()) => pruefeInhalte(r, { produktion: false }).fehler.join('\n');
  it('akzeptiert Unterbereiche am Thema und ein Modul mit gültigem Unterbereich', () => {
    const r = roh();
    (r.module[0]!.daten as Record<string, unknown>).unterbereich = 'u2';
    expect(fehler(r)).toBe('');
    const inhalt = pruefeInhalte(r, { produktion: false }).inhalt;
    expect(inhalt.themen[0]!.unterbereiche).toEqual([{ id: 'u1', titel: 'U1' }, { id: 'u2', titel: 'U2', beschreibung: 'Text' }]);
    expect(inhalt.module[0]!.unterbereich).toBe('u2');
  });
  it('ein Modul ohne Unterbereich bleibt in einem gegliederten Thema erlaubt (Abschluss)', () => {
    expect(fehler()).toBe('');
  });
  it('meldet einen unbekannten Unterbereich und einen Unterbereich in einem Thema ohne Gliederung', () => {
    const r = roh();
    (r.module[0]!.daten as Record<string, unknown>).unterbereich = 'gibt-es-nicht';
    expect(fehler(r)).toMatch(/Unterbereich "gibt-es-nicht" existiert im Thema "trig" nicht/);
    const r2 = roh();
    (r2.module[1]!.daten as Record<string, unknown>).unterbereich = 'u1';
    expect(fehler(r2)).toMatch(/Das Thema "diff" hat keine Unterbereiche/);
  });
  it('meldet doppelte IDs, ungültige Einträge und leere Listen', () => {
    const r = roh();
    (r.themen.daten as { themen: Record<string, unknown>[] }).themen[0]!.unterbereiche = [{ id: 'u1', titel: 'A' }, { id: 'u1', titel: 'B' }, { id: 'Gross', titel: 'C' }, { id: 'u3' }];
    const f = fehler(r);
    expect(f).toMatch(/Unterbereichs-ID "u1" kommt mehrfach vor/);
    expect(f).toMatch(/Unterbereich 3 braucht/);
    expect(f).toMatch(/Unterbereich 4 braucht/);
    const r2 = roh();
    (r2.themen.daten as { themen: Record<string, unknown>[] }).themen[0]!.unterbereiche = [];
    expect(fehler(r2)).toMatch(/"unterbereiche" muss eine nicht leere Liste sein/);
  });
});

describe('Navigation mit Unterbereichen', () => {
  it('gliedert nach Unterbereichen in der Reihenfolge der themen.json, der Abschluss folgt, Unterbereiche ohne sichtbare Module entfallen', () => {
    const t = nav().themen.find((x) => x.thema.id === 'tv')!;
    expect(t.unterbereiche.map((u) => [u.unterbereich.id, u.module.map((m) => m.id)])).toEqual([['u1', ['a1', 'a2']], ['u2', ['b1', 'b2']]]);
    expect(t.abschluss.map((m) => m.id)).toEqual(['ik']);
    expect(t.module.map((m) => m.id)).toEqual(['a1', 'a2', 'b1', 'b2', 'ik']);
  });
  it('zeigt einen Entwurf nur in der Vorschau, dann erscheint auch der dritte Unterbereich', () => {
    const t = nav(true).themen.find((x) => x.thema.id === 'tv')!;
    expect(t.unterbereiche.map((u) => u.unterbereich.id)).toEqual(['u1', 'u2', 'u3']);
  });
  it('Themen ohne Gliederung bleiben unverändert', () => {
    const t = nav().themen.find((x) => x.thema.id === 'flach')!;
    expect(t.unterbereiche).toEqual([]);
    expect(t.abschluss).toEqual([]);
    expect(t.module.map((m) => m.id)).toEqual(['f1']);
  });
  it('zählt die Module je Unterbereich, der Abschluss hat keine Nummer, der Titel entsprechend', () => {
    const n = nav();
    expect(['a1', 'a2', 'b1', 'b2'].map((id) => modulNummer(n, id))).toEqual([1, 2, 1, 2]);
    expect(modulNummer(n, 'ik')).toBeNull();
    expect(modulNummer(n, 'f1')).toBe(1);
    const titel = (id: string) => nummerierterTitel(n, inhalt.module.find((m) => m.id === id)!);
    expect(titel('b2')).toBe('2. B Zwei');
    expect(titel('ik')).toBe('Ich-Kann');
  });
  it('findet den Unterbereich eines Moduls und gibt für den Abschluss null zurück', () => {
    const n = nav();
    expect(unterbereichVonModul(n, 'b2')?.id).toBe('u2');
    expect(unterbereichVonModul(n, 'ik')).toBeNull();
    expect(unterbereichVonModul(n, 'f1')).toBeNull();
  });
  it('vorheriges und nächstes Modul folgen der angezeigten Reihenfolge, nicht der Kursdatei', () => {
    const n = nav();
    expect(alleModule(n).map((m) => m.id)).toEqual(['f1', 'a1', 'a2', 'b1', 'b2', 'ik']);
    expect(findeNachbarn(n, 'a2')).toMatchObject({ zurueck: { id: 'a1' }, weiter: { id: 'b1' } });
    expect(findeNachbarn(n, 'b2').weiter?.id).toBe('ik');
  });
  it('der Vorschau-Kurs ordnet die Module eines gegliederten Themas ebenfalls nach Unterbereichen', () => {
    const k = erzeugeVorschauKurs(inhalt);
    const n = baueNavigation({ ...inhalt, kurse: [k] }, k.id, { entwuerfe: true })!;
    expect(n.themen.find((t) => t.thema.id === 'tv')!.module.map((m) => m.id)).toEqual(['a1', 'a2', 'b1', 'b2', 'x1', 'ik']);
  });
});

describe('Adressen', () => {
  it('Unterbereichsseite: Pfad erzeugen und wieder lesen', () => {
    const r: Route = { art: 'unterbereich', kurs: 'k', thema: 'tv', unterbereich: 'u1' };
    expect(erzeugePfad(r)).toBe('/kurs/k/thema/tv/u1/');
    expect(parsePfad('/kurs/k/thema/tv/u1/')).toEqual(r);
    expect(parsePfad('/kurs/k/thema/tv/')).toEqual({ art: 'thema', kurs: 'k', thema: 'tv' });
    expect(parsePfad('/kurs/k/modul/a1/erklaeren/')).toEqual({ art: 'modul', kurs: 'k', modul: 'a1', abschnitt: 'erklaeren' });
  });
  it('erzeugt statische Seiten für Unterbereiche, die im Kurs Module haben', () => {
    const pfade = seitenPfade({ ...inhalt, module: inhalt.module.filter((m) => m.status === 'freigegeben') }).map((s) => s.pfad);
    expect(pfade).toContain('kurs/k/thema/tv/u1');
    expect(pfade).toContain('kurs/k/thema/tv/u2');
    expect(pfade).not.toContain('kurs/k/thema/tv/u3');
    expect(pfade).not.toContain('kurs/k/thema/flach/u1');
  });
});

describe('Seiten', () => {
  it('Themenseite: Kacheln der Unterbereiche mit Beschreibung und Modulzahl, darunter der Abschluss', () => {
    const h = hauptteil(seite({ art: 'thema', kurs: 'k', thema: 'tv' }));
    expect(h).toContain('Text zum Thema');
    expect(h).toContain('Erster Teil');
    expect(h).toContain('Text erster Teil');
    expect(h).toContain('2 Module');
    expect(h).toContain('href="/kurs/k/thema/tv/u2/"');
    expect(h).not.toContain('Leerer Teil');
    expect(h).toContain('Abschluss des Themenbereichs');
    expect(h).toContain('Ich-Kann');
    expect(h).not.toContain('A Eins');
  });
  it('Themenseite eines Themas ohne Gliederung zeigt wie bisher die Module', () => {
    const h = hauptteil(seite({ art: 'thema', kurs: 'k', thema: 'flach' }));
    expect(h).toContain('1. Flach Eins');
    expect(h).not.toContain('Unterbereiche');
  });
  it('Unterbereichsseite: Titel, Beschreibung, nummerierte Module und Pfad', () => {
    const h = hauptteil(seite({ art: 'unterbereich', kurs: 'k', thema: 'tv', unterbereich: 'u2' }));
    expect(h).toContain('<h1>Zweiter Teil</h1>');
    expect(h).toContain('1. B Eins');
    expect(h).toContain('2. B Zwei');
    expect(h).not.toContain('A Eins');
    expect(h).toContain('Gegliedertes Thema');
    expect(h).toContain('Aktuell im Unterricht');
  });
  it('unbekannte oder leere Unterbereiche liefern die Fehlerseite', () => {
    for (const unterbereich of ['gibt-es-nicht', 'u3']) expect(seite({ art: 'unterbereich', kurs: 'k', thema: 'tv', unterbereich })).toContain('Seite nicht gefunden');
    expect(seite({ art: 'unterbereich', kurs: 'k', thema: 'flach', unterbereich: 'u1' })).toContain('Seite nicht gefunden');
  });
  it('Modulseite: Pfad mit Unterbereich, im Abschluss ohne', () => {
    const h = hauptteil(seite({ art: 'modul', kurs: 'k', modul: 'b2' }));
    expect(h).toMatch(/Gegliedertes Thema<\/a>.*Zweiter Teil<\/a>/);
    expect(h).toContain('<h1>2. B Zwei</h1>');
    const ik = hauptteil(seite({ art: 'modul', kurs: 'k', modul: 'ik' }));
    expect(ik).toContain('<h1>Ich-Kann</h1>');
    expect(ik).not.toContain('Zweiter Teil');
  });
  it('Wiederholen und Üben gliedert ein gegliedertes Thema nach Unterbereichen', () => {
    const h = hauptteil(seite({ art: 'wiederholen', kurs: 'k' }));
    expect(h).toMatch(/<h3[^>]*>Erster Teil<\/h3>/);
    expect(h).toMatch(/<h3[^>]*>Zweiter Teil<\/h3>/);
    expect(h.indexOf('Ich-Kann')).toBeGreaterThan(h.indexOf('2. B Zwei'));
  });
  it('der Seitentitel der Unterbereichsseite nennt Unterbereich und Thema', () => {
    // Die Titelsetzung läuft im Effekt, hier nur die Darstellung ohne Fehler
    expect(seite({ art: 'unterbereich', kurs: 'k', thema: 'tv', unterbereich: 'u1' })).toContain('Erster Teil');
  });
});

describe('Seitenleiste mit Unterbereichen', () => {
  const unterGruppen = (nav: string) =>
    [...nav.matchAll(/<button[^>]*class="nav-umschalter nav-umschalter-unter"[^>]*aria-expanded="(true|false)"[^>]*aria-controls="([^"]+)"[^>]*><span>([^<]+)<\/span>/g)].map((m) => ({
      titel: m[3]!,
      offen: m[1] === 'true',
      versteckt: new RegExp(`<ul id="${m[2]!.replace(/[:]/g, '\\:')}"[^>]*hidden`).test(nav),
    }));
  it('jeder Unterbereich ist ein eigener Umschalter mit aria-expanded und aria-controls', () => {
    const n = leiste({ art: 'thema', kurs: 'k', thema: 'tv' });
    expect(unterGruppen(n).map((g) => g.titel)).toEqual(['Erster Teil', 'Zweiter Teil']);
    expect(n.match(/class="nav-umschalter nav-umschalter-unter"/g)).toHaveLength(2);
  });
  it('auf einer Modulseite ist nur der Unterbereich dieses Moduls offen', () => {
    const g = unterGruppen(leiste({ art: 'modul', kurs: 'k', modul: 'a2' }));
    expect(g.map((x) => [x.titel, x.offen, x.versteckt])).toEqual([['Erster Teil', true, false], ['Zweiter Teil', false, true]]);
  });
  it('auf einer Unterbereichsseite ist dieser Unterbereich offen und seine Übersicht markiert', () => {
    const n = leiste({ art: 'unterbereich', kurs: 'k', thema: 'tv', unterbereich: 'u2' });
    expect(unterGruppen(n).map((x) => [x.titel, x.offen])).toEqual([['Erster Teil', false], ['Zweiter Teil', true]]);
    expect(n).toMatch(/aria-current="page"[^>]*>Übersicht</);
    expect(n).toContain('href="/kurs/k/thema/tv/u2/"');
  });
  it('auf der Themenseite sind die Unterbereiche zu, die Seite des Unterrichtsmoduls ausgenommen, und der Abschluss steht auf Themenebene', () => {
    const n = leiste({ art: 'thema', kurs: 'k', thema: 'tv' });
    // aktuelles Unterrichtsmodul ist b1 in Zweiter Teil
    expect(unterGruppen(n).map((x) => [x.titel, x.offen])).toEqual([['Erster Teil', false], ['Zweiter Teil', true]]);
    expect(n.indexOf('>Ich-Kann<')).toBeGreaterThan(n.indexOf('2. B Zwei'));
  });
  it('Themen ohne Gliederung haben keine Unterbereichs-Umschalter', () => {
    const n = leiste({ art: 'thema', kurs: 'k', thema: 'flach' });
    expect(n.match(/nav-umschalter-unter/g)).toHaveLength(2);
    expect(n).toContain('1. Flach Eins');
  });
});

describe('Echte Inhalte', () => {
  const echt = ladeInhalte(process.cwd(), { produktion: false });
  it('die Vektorgeometrie ist in Vektoren, Geraden und Ebenen gegliedert', () => {
    const t = echt.themen.find((x) => x.id === 'vektorgeometrie')!;
    expect(t.unterbereiche!.map((u) => u.id)).toEqual(['vektoren', 'geraden', 'ebenen']);
    for (const u of t.unterbereiche!) expect(u.beschreibung, u.id).toBeTruthy();
    expect(t.beschreibung).toBeTruthy();
  });
  it('es gibt keine Platzhaltermodule mehr, und Module der Vektorgeometrie nennen einen vorhandenen Unterbereich', () => {
    expect(echt.module.filter((m) => m.id.startsWith('demo-'))).toEqual([]);
    const t = echt.themen.find((x) => x.id === 'vektorgeometrie')!;
    for (const m of echt.module.filter((x) => x.thema === 'vektorgeometrie')) if (m.unterbereich) expect(t.unterbereiche!.map((u) => u.id), m.id).toContain(m.unterbereich);
  });
  it('Unterbereiche ohne Module erscheinen weder in der Navigation noch als Seite', () => {
    const nav = baueNavigation(inhaltFuerVeroeffentlichung(echt), 'abitur-2027', { entwuerfe: false })!;
    const v = nav.themen.find((x) => x.thema.id === 'vektorgeometrie')!;
    const leer = v.thema.unterbereiche!.filter((u) => !v.module.some((m) => m.unterbereich === u.id)).map((u) => u.id);
    expect(v.unterbereiche.map((u) => u.unterbereich.id)).not.toEqual(expect.arrayContaining(leer.length ? leer : ['__keiner__']));
    expect(v.unterbereiche.map((u) => u.unterbereich.id)).toContain('vektoren');
  });
});
