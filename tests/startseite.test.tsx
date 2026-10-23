import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AppInhalt } from '../src/app/AppInhalt';
import { inhalt } from 'virtual:lernumgebung';

const lader = () => Promise.reject(new Error('nicht benötigt'));
const seite = (route: Parameters<typeof AppInhalt>[0]['route'], entwuerfe: boolean) =>
  renderToStaticMarkup(<AppInhalt inhalt={inhalt} route={route} entwuerfe={entwuerfe} lader={lader} />);

describe('Startseite', () => {
  it('listet in der Produktion keine Kurse und keine Bibliothek', () => {
    const html = seite({ art: 'start' }, false);
    expect(html).not.toContain('Demokurs');
    expect(html).not.toContain('href="/kurs/');
    expect(html).not.toContain('Bibliothek');
    expect(html).not.toContain('Vorschau');
  });

  it('listet in der Vorschau die Kurse und kennzeichnet sie als Vorschau', () => {
    const html = seite({ art: 'start' }, true);
    expect(html).toContain('Demokurs A');
    expect(html).toContain('Demokurs B');
    expect(html).toContain('enthält Entwürfe');
  });

  it('sperrt die Modulbibliothek (Entwürfe) in der Produktion', () => {
    expect(seite({ art: 'bibliothek' }, false)).toContain('Seite nicht gefunden');
    expect(seite({ art: 'bibliothek' }, true)).toContain('Stammfunktionen');
  });

  it('zeigt für unbekannte Kurse eine Fehlerseite statt abzustürzen', () => {
    expect(seite({ art: 'kurs', kurs: 'gibt-es-nicht' }, false)).toContain('Seite nicht gefunden');
  });
});
