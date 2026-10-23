import type { Inhalt, Kurs } from './typen.ts';

export const VORSCHAU_KURS_ID = 'vorschau-alle';

/**
 * Kurs für die Vorschau: enthält alle Module, auch Entwürfe, nach Themen geordnet. Wird nur in Vorschau und Entwicklung
 * erzeugt (nie im öffentlichen Build) und ersetzt keine Kursdatei. So lassen sich Entwürfe im Kurs-Layout ansehen,
 * ohne dass ein echter Kurs auf einen Entwurf verweisen muss.
 */
export function erzeugeVorschauKurs(inhalt: Pick<Inhalt, 'themen' | 'module'>): Kurs {
  const themen = inhalt.themen.filter((t) => inhalt.module.some((m) => m.thema === t.id));
  const module = themen.flatMap((t) => inhalt.module.filter((m) => m.thema === t.id).map((m) => m.id));
  return {
    id: VORSCHAU_KURS_ID,
    titel: 'Vorschau: alle Module',
    beschreibung: 'Nur in der Vorschau. Enthält alle Module, auch Entwürfe, nach Themenbereichen geordnet.',
    themen: themen.map((t) => t.id),
    module,
    aktuellesModul: null,
  };
}
