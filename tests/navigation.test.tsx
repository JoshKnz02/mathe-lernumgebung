import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AppInhalt } from '../src/app/AppInhalt';
import { erzeugePfad, parsePfad, type Route } from '../src/app/router';
import { aktiverAbschnitt, alleModule, baueNavigation, findeNachbarn } from '../src/lib/navigation';
import { inhalt } from 'virtual:lernumgebung';

const titel = (kurs: string, entwuerfe = false) =>
  baueNavigation(inhalt, kurs, { entwuerfe })!.themen.map((t) => [t.thema.id, t.module.map((m) => m.id)]);

describe('kursabhängige Navigation', () => {
  it('zeigt je Kurs nur die freigegebenen Themen und Module in Kursreihenfolge', () => {
    expect(titel('demo-a')).toEqual([
      ['trigonometrische-funktionen', ['demo-sinus-platzhalter', 'demo-trig-gleichungen-platzhalter']],
      ['zusammengesetzte-funktionen', ['demo-verkettung-platzhalter']],
      ['differentialrechnung', ['demo-ableitung-platzhalter']],
    ]);
    expect(titel('demo-b')).toEqual([
      ['differentialrechnung', ['demo-ableitung-platzhalter']],
      ['trigonometrische-funktionen', ['demo-sinus-platzhalter']],
    ]);
  });

  it('verwendet ein Modul in mehreren Kursen, ohne es zu duplizieren', () => {
    const ids = inhalt.module.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    const a = alleModule(baueNavigation(inhalt, 'demo-a', { entwuerfe: false })!).map((m) => m.id);
    const b = alleModule(baueNavigation(inhalt, 'demo-b', { entwuerfe: false })!).map((m) => m.id);
    expect(a.filter((id) => b.includes(id))).toContain('demo-sinus-platzhalter');
  });

  it('bestimmt das aktuelle Unterrichtsthema je Kurs', () => {
    expect(baueNavigation(inhalt, 'demo-a', { entwuerfe: false })!.aktuell?.id).toBe('demo-verkettung-platzhalter');
    expect(baueNavigation(inhalt, 'demo-b', { entwuerfe: false })!.aktuell?.id).toBe('demo-sinus-platzhalter');
  });

  it('liefert für unbekannte Kurse null', () => {
    expect(baueNavigation(inhalt, 'gibt-es-nicht', { entwuerfe: false })).toBeNull();
  });

  it('blendet Entwürfe ohne Vorschau auch dann aus, wenn ein Kurs sie nennt', () => {
    const mitEntwurf = {
      ...inhalt,
      kurse: [{ ...inhalt.kurse[0]!, id: 'x', themen: ['integralrechnung'], module: ['demo-integral-entwurf'], aktuellesModul: null }],
    };
    expect(baueNavigation(mitEntwurf, 'x', { entwuerfe: false })!.themen).toEqual([]);
    expect(baueNavigation(mitEntwurf, 'x', { entwuerfe: true })!.themen).toHaveLength(1);
  });

  it('findet vorheriges und nächstes Modul über Themengrenzen hinweg', () => {
    const nav = baueNavigation(inhalt, 'demo-a', { entwuerfe: false })!;
    expect(findeNachbarn(nav, 'demo-trig-gleichungen-platzhalter')).toMatchObject({
      zurueck: { id: 'demo-sinus-platzhalter' },
      weiter: { id: 'demo-verkettung-platzhalter' },
    });
    expect(findeNachbarn(nav, 'demo-sinus-platzhalter').zurueck).toBeNull();
  });
});

describe('Adressen', () => {
  const routen: Route[] = [
    { art: 'start' },
    { art: 'kurs', kurs: 'demo-a' },
    { art: 'thema', kurs: 'demo-a', thema: 'differentialrechnung' },
    { art: 'modul', kurs: 'demo-a', modul: 'demo-sinus-platzhalter' },
    { art: 'modul', kurs: 'demo-a', modul: 'einheitskreis-sinus-kosinus', abschnitt: 'entdecken' },
    { art: 'bibliothekModul', modul: 'einheitskreis-sinus-kosinus', abschnitt: 'ueberpruefen' },
    { art: 'wiederholen', kurs: 'demo-b' },
    { art: 'bibliothek' },
    { art: 'bibliothekModul', modul: 'demo-integral-entwurf' },
  ];
  it.each(routen)('wandelt %o verlustfrei um', (r) => {
    expect(parsePfad(erzeugePfad(r))).toEqual(r);
  });
  it('akzeptiert Adressen ohne Schlussschrägstrich und erkennt Unbekanntes', () => {
    expect(parsePfad('/kurs/demo-a')).toEqual({ art: 'kurs', kurs: 'demo-a' });
    expect(parsePfad('/irgendwas/anderes')).toEqual({ art: 'unbekannt' });
    expect(parsePfad('/kurs/demo-a/modul')).toEqual({ art: 'unbekannt' });
  });
});

describe('interne Links', () => {
  const lader = () => Promise.reject(new Error('nicht benötigt'));
  const hrefs = (route: Route, entwuerfe: boolean) =>
    [...renderToStaticMarkup(<AppInhalt inhalt={inhalt} route={route} entwuerfe={entwuerfe} lader={lader} />).matchAll(/href="([^"]*)"/g)]
      .map((m) => m[1]!)
      .filter((h) => !h.startsWith('#'));

  it('führen auf jeder Kursseite zu existierenden, im Kurs freigegebenen Seiten', () => {
    for (const kurs of inhalt.kurse) {
      const nav = baueNavigation(inhalt, kurs.id, { entwuerfe: false })!;
      const seiten: Route[] = [
        { art: 'kurs', kurs: kurs.id },
        { art: 'wiederholen', kurs: kurs.id },
        ...nav.themen.map<Route>((t) => ({ art: 'thema', kurs: kurs.id, thema: t.thema.id })),
        ...alleModule(nav).map<Route>((m) => ({ art: 'modul', kurs: kurs.id, modul: m.id })),
      ];
      for (const seite of seiten) {
        const links = hrefs(seite, false);
        expect(links.length).toBeGreaterThan(0);
        for (const h of links) {
          const r = parsePfad(h);
          expect(r.art, `${h} von ${erzeugePfad(seite)}`).not.toBe('unbekannt');
          if ('kurs' in r) expect(r.kurs).toBe(kurs.id);
          if (r.art === 'thema') expect(nav.themen.some((t) => t.thema.id === r.thema)).toBe(true);
          if (r.art === 'modul') expect(alleModule(nav).some((m) => m.id === r.modul)).toBe(true);
        }
      }
    }
  });

  it('enthalten keine Hinweise auf Inhalte anderer Kurse', () => {
    const html = renderToStaticMarkup(<AppInhalt inhalt={inhalt} route={{ art: 'kurs', kurs: 'demo-b' }} entwuerfe={false} lader={lader} />);
    expect(html).not.toContain('Verkettung');
    expect(html).not.toContain('Demokurs A');
  });

  it('nennen in der Navigation keine Entwürfe und zeigen Wiederholen und Üben', () => {
    const html = renderToStaticMarkup(<AppInhalt inhalt={inhalt} route={{ art: 'kurs', kurs: 'demo-a' }} entwuerfe={false} lader={lader} />);
    expect(html).not.toContain('Entwurf');
    expect(html).toContain('Wiederholen und Üben');
    expect(html).toContain('Aktuell im Unterricht');
  });
});

describe('Abschnitte eines Moduls', () => {
  const lader = () => Promise.reject(new Error('nicht benötigt'));
  const seite = (abschnitt?: string) =>
    renderToStaticMarkup(
      <AppInhalt
        inhalt={inhalt}
        route={{ art: 'modul', kurs: 'vorschau-alle', modul: 'einheitskreis-sinus-kosinus', ...(abschnitt ? { abschnitt } : {}) }}
        entwuerfe
        lader={lader}
      />,
    );
  const modul = inhalt.module.find((m) => m.id === 'einheitskreis-sinus-kosinus')!;

  it('bestimmt den aktiven Abschnitt: Standard ist der erste, Unbekanntes ist ungültig, Module ohne Abschnitte liefern null', () => {
    expect(aktiverAbschnitt(modul)).toBe('erklaeren');
    expect(aktiverAbschnitt(modul, 'entdecken')).toBe('entdecken');
    expect(aktiverAbschnitt(modul, 'gibt-es-nicht')).toBeNull();
    expect(aktiverAbschnitt(inhalt.module.find((m) => m.id === 'demo-sinus-platzhalter')!, 'x')).toBeNull();
  });

  it('zeigt Abschnittsleiste, Untermenü in der Navigation und Weiter-Knopf', () => {
    const html = seite('entdecken');
    expect(html).toContain('aria-label="Abschnitte des Moduls"');
    expect(html).toMatch(/aria-label="Abschnitte von \d+\. Vom Einheitskreis zu Sinus- und Kosinusfunktion"/);
    for (const a of ['Erklären', 'Entdecken', 'Überprüfen', 'Zusammenfassung']) expect(html).toContain(`>${a}</a>`);
    expect(html.match(/aria-current="page"/g)).toHaveLength(2); // je einmal in Leiste und Untermenü
    expect(html).toContain('Weiter: Überprüfen →');
    expect(html).toContain('← Erklären');
  });

  it('beginnt ohne Angabe beim ersten Abschnitt und hat dort keinen Zurück-Knopf', () => {
    const html = seite();
    expect(html).toContain('Weiter: Entdecken →');
    expect(html).not.toContain('← Erklären');
  });

  it('zeigt bei unbekanntem Abschnitt nur die Fehlerseite, ohne Modulüberschrift', () => {
    const html = seite('gibt-es-nicht');
    expect(html).toContain('Seite nicht gefunden');
    expect(html.match(/<h1>/g)).toHaveLength(1);
    expect(html).not.toContain('Vom Einheitskreis zu Sinus- und Kosinusfunktion</h1>');
  });

  it('lehnt bei Modulen ohne Abschnitte jede Abschnittsadresse ab', () => {
    const html = renderToStaticMarkup(
      <AppInhalt inhalt={inhalt} route={{ art: 'modul', kurs: 'demo-a', modul: 'demo-sinus-platzhalter', abschnitt: 'irgendwas' }} entwuerfe={false} lader={lader} />,
    );
    expect(html).toContain('Seite nicht gefunden');
    expect(html.match(/<h1>/g)).toHaveLength(1);
  });

  it('zeigt das Untermenü nur beim geöffneten Modul', () => {
    const html = renderToStaticMarkup(<AppInhalt inhalt={inhalt} route={{ art: 'kurs', kurs: 'vorschau-alle' }} entwuerfe lader={lader} />);
    expect(html).not.toContain('aria-label="Abschnitte von');
  });
});
