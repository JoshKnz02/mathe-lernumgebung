import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { inhalt as echterInhalt } from 'virtual:lernumgebung';
import { AppInhalt } from '../src/app/AppInhalt';
import { erzeugePfad, parsePfad, type Route } from '../src/app/router';
import { aktiverAbschnitt, alleModule, baueNavigation, findeNachbarn } from '../src/lib/navigation';
import type { Inhalt } from '../src/lib/typen';
import { beispielInhalt } from './hilfen';

const lader = () => Promise.reject(new Error('nicht benötigt'));
const inhalt = beispielInhalt();
const seite = (i: Inhalt, route: Route, entwuerfe = false) => renderToStaticMarkup(<AppInhalt inhalt={i} route={route} entwuerfe={entwuerfe} lader={lader} />);
const aufbau = (kurs: string, entwuerfe = false) =>
  baueNavigation(inhalt, kurs, { entwuerfe })!.themen.map((t) => [t.thema.id, t.module.map((m) => m.id)]);

describe('kursabhängige Navigation', () => {
  it('zeigt je Kurs nur die freigegebenen Themen und Module in Kursreihenfolge', () => {
    expect(aufbau('k1')).toEqual([['ta', ['m1', 'm2']], ['tb', ['m3']]]);
    expect(aufbau('k2')).toEqual([['tb', ['m3']], ['ta', ['m1']]]);
  });

  it('verwendet ein Modul in mehreren Kursen, ohne es zu duplizieren', () => {
    const ids = inhalt.module.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    const k1 = alleModule(baueNavigation(inhalt, 'k1', { entwuerfe: false })!).map((m) => m.id);
    const k2 = alleModule(baueNavigation(inhalt, 'k2', { entwuerfe: false })!).map((m) => m.id);
    expect(k1.filter((id) => k2.includes(id))).toEqual(['m1', 'm3']);
  });

  it('bestimmt das aktuelle Unterrichtsthema je Kurs', () => {
    expect(baueNavigation(inhalt, 'k1', { entwuerfe: false })!.aktuell?.id).toBe('m3');
    expect(baueNavigation(inhalt, 'k2', { entwuerfe: false })!.aktuell?.id).toBe('m1');
  });

  it('liefert für unbekannte Kurse null', () => {
    expect(baueNavigation(inhalt, 'gibt-es-nicht', { entwuerfe: false })).toBeNull();
  });

  it('blendet Entwürfe ohne Vorschau auch dann aus, wenn ein Kurs sie nennt', () => {
    const mitEntwurf: Inhalt = { ...inhalt, kurse: [{ id: 'x', titel: 'X', themen: ['tc'], module: ['m4'], aktuellesModul: null }] };
    expect(baueNavigation(mitEntwurf, 'x', { entwuerfe: false })!.themen).toEqual([]);
    expect(baueNavigation(mitEntwurf, 'x', { entwuerfe: true })!.themen).toHaveLength(1);
  });

  it('findet vorheriges und nächstes Modul über Themengrenzen hinweg', () => {
    const nav = baueNavigation(inhalt, 'k1', { entwuerfe: false })!;
    expect(findeNachbarn(nav, 'm2')).toMatchObject({ zurueck: { id: 'm1' }, weiter: { id: 'm3' } });
    expect(findeNachbarn(nav, 'm1').zurueck).toBeNull();
    expect(findeNachbarn(nav, 'm3').weiter).toBeNull();
  });
});

describe('Adressen', () => {
  const routen: Route[] = [
    { art: 'start' },
    { art: 'kurs', kurs: 'abitur-2028' },
    { art: 'thema', kurs: 'abitur-2028', thema: 'trigonometrische-funktionen' },
    { art: 'modul', kurs: 'abitur-2028', modul: 'einheitskreis-sinus-kosinus' },
    { art: 'modul', kurs: 'abitur-2028', modul: 'einheitskreis-sinus-kosinus', abschnitt: 'entdecken' },
    { art: 'wiederholen', kurs: 'abitur-2028' },
    { art: 'bibliothek' },
    { art: 'bibliothekModul', modul: 'lage-im-koordinatensystem' },
    { art: 'bibliothekModul', modul: 'lage-im-koordinatensystem', abschnitt: 'ueberpruefen' },
  ];
  it.each(routen)('wandelt %o verlustfrei um', (r) => {
    expect(parsePfad(erzeugePfad(r))).toEqual(r);
  });
  it('akzeptiert Adressen ohne Schlussschrägstrich und erkennt Unbekanntes', () => {
    expect(parsePfad('/kurs/abitur-2028')).toEqual({ art: 'kurs', kurs: 'abitur-2028' });
    expect(parsePfad('/irgendwas/anderes')).toEqual({ art: 'unbekannt' });
    expect(parsePfad('/kurs/abitur-2028/modul')).toEqual({ art: 'unbekannt' });
  });
});

describe('interne Links', () => {
  const hrefs = (i: Inhalt, route: Route, entwuerfe: boolean) =>
    [...seite(i, route, entwuerfe).matchAll(/href="([^"]*)"/g)].map((m) => m[1]!).filter((h) => !h.startsWith('#'));

  /** Alle Links aller Kursseiten führen auf existierende, im Kurs freigegebene Seiten desselben Kurses. */
  const pruefeLinks = (i: Inhalt) => {
    for (const kurs of i.kurse) {
      const nav = baueNavigation(i, kurs.id, { entwuerfe: false })!;
      const seiten: Route[] = [
        { art: 'kurs', kurs: kurs.id },
        { art: 'wiederholen', kurs: kurs.id },
        ...nav.themen.map<Route>((t) => ({ art: 'thema', kurs: kurs.id, thema: t.thema.id })),
        ...alleModule(nav).map<Route>((m) => ({ art: 'modul', kurs: kurs.id, modul: m.id })),
      ];
      for (const s of seiten) {
        const links = hrefs(i, s, false);
        expect(links.length).toBeGreaterThan(0);
        for (const h of links) {
          const r = parsePfad(h);
          expect(r.art, `${h} von ${erzeugePfad(s)}`).not.toBe('unbekannt');
          if ('kurs' in r) expect(r.kurs).toBe(kurs.id);
          if (r.art === 'thema') expect(nav.themen.some((t) => t.thema.id === r.thema)).toBe(true);
          if (r.art === 'modul') expect(alleModule(nav).some((m) => m.id === r.modul)).toBe(true);
        }
      }
    }
  };

  it('führen im Testdatensatz auf jeder Kursseite zu existierenden, im Kurs freigegebenen Seiten', () => pruefeLinks(inhalt));
  it('führen bei den echten Inhalten auf jeder Kursseite zu existierenden, im Kurs freigegebenen Seiten', () => pruefeLinks(echterInhalt));

  it('enthalten keine Hinweise auf Inhalte anderer Kurse', () => {
    const html = seite(inhalt, { art: 'kurs', kurs: 'k2' });
    expect(html).not.toContain('Modul Zwei');
    expect(html).not.toContain('Kurs Eins');
  });

  it('nennen in der Navigation keine Entwürfe, zeigen Wiederholen und Üben und das aktuelle Thema', () => {
    const mitEntwurf: Inhalt = { ...inhalt, kurse: [{ id: 'x', titel: 'X', themen: ['ta', 'tc'], module: ['m1', 'm4'], aktuellesModul: 'm1' }] };
    const html = seite(mitEntwurf, { art: 'kurs', kurs: 'x' });
    expect(html).not.toContain('Modul Vier');
    expect(html).not.toContain('Thema C');
    expect(html).toContain('Wiederholen und Üben');
    expect(html).toContain('Aktuell im Unterricht');
  });
});

describe('Abschnitte eines Moduls', () => {
  const modul = echterInhalt.module.find((m) => m.id === 'einheitskreis-sinus-kosinus')!;
  const abschnittSeite = (abschnitt?: string) =>
    seite(echterInhalt, { art: 'modul', kurs: 'vorschau-alle', modul: 'einheitskreis-sinus-kosinus', ...(abschnitt ? { abschnitt } : {}) }, true);

  it('bestimmt den aktiven Abschnitt: Standard ist der erste, Unbekanntes ist ungültig, Module ohne Abschnitte liefern null', () => {
    expect(aktiverAbschnitt(modul)).toBe('erklaeren');
    expect(aktiverAbschnitt(modul, 'entdecken')).toBe('entdecken');
    expect(aktiverAbschnitt(modul, 'gibt-es-nicht')).toBeNull();
    expect(aktiverAbschnitt(inhalt.module.find((m) => m.id === 'm1')!, 'x')).toBeNull();
  });

  it('zeigt Abschnittsleiste, Untermenü in der Navigation und Weiter-Knopf', () => {
    const html = abschnittSeite('entdecken');
    expect(html).toContain('aria-label="Abschnitte des Moduls"');
    expect(html).toMatch(/aria-label="Abschnitte von \d+\. Vom Einheitskreis zu Sinus- und Kosinusfunktion"/);
    for (const a of ['Erklären', 'Entdecken', 'Überprüfen', 'Zusammenfassung']) expect(html).toContain(`>${a}</a>`);
    expect(html.match(/aria-current="page"/g)).toHaveLength(2); // je einmal in Leiste und Untermenü
    expect(html).toContain('Weiter: Überprüfen →');
    expect(html).toContain('← Erklären');
  });

  it('beginnt ohne Angabe beim ersten Abschnitt und hat dort keinen Zurück-Knopf', () => {
    const html = abschnittSeite();
    expect(html).toContain('Weiter: Entdecken →');
    expect(html).not.toContain('← Erklären');
  });

  it('zeigt bei unbekanntem Abschnitt nur die Fehlerseite, ohne Modulüberschrift', () => {
    const html = abschnittSeite('gibt-es-nicht');
    expect(html).toContain('Seite nicht gefunden');
    expect(html.match(/<h1>/g)).toHaveLength(1);
    expect(html).not.toContain('Vom Einheitskreis zu Sinus- und Kosinusfunktion</h1>');
  });

  it('lehnt bei Modulen ohne Abschnitte jede Abschnittsadresse ab', () => {
    const html = seite(inhalt, { art: 'modul', kurs: 'k1', modul: 'm1', abschnitt: 'irgendwas' });
    expect(html).toContain('Seite nicht gefunden');
    expect(html.match(/<h1>/g)).toHaveLength(1);
  });

  it('zeigt das Untermenü nur beim geöffneten Modul', () => {
    expect(seite(echterInhalt, { art: 'kurs', kurs: 'vorschau-alle' }, true)).not.toContain('aria-label="Abschnitte von');
  });
});
