import type { Inhalt, Kurs } from './typen.ts';

export const VORSCHAU_KURS_ID = 'vorschau-alle';

/**
 * Kurs für die Vorschau: enthält alle Module, auch Entwürfe, nach Themen geordnet. Wird nur in Vorschau und Entwicklung
 * erzeugt (nie im öffentlichen Build) und ersetzt keine Kursdatei. So lassen sich Entwürfe im Kurs-Layout ansehen,
 * ohne dass ein echter Kurs auf einen Entwurf verweisen muss.
 */
export function erzeugeVorschauKurs(inhalt: Pick<Inhalt, 'themen' | 'module'> & Partial<Pick<Inhalt, 'kurse'>>): Kurs {
  const themen = inhalt.themen.filter((t) => inhalt.module.some((m) => m.thema === t.id));
  // Reihenfolge wie in den echten Kursen (Kurse mit nurVorschau zählen nicht). Module, die in keinem Kurs stehen, zum Beispiel Entwürfe, folgen danach.
  const kursReihenfolge = (inhalt.kurse ?? []).filter((k) => !k.nurVorschau).flatMap((k) => k.module);
  const rang = (id: string) => {
    const i = kursReihenfolge.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  const module = themen.flatMap((t) =>
    inhalt.module
      .map((m, nr) => ({ m, nr }))
      .filter(({ m }) => m.thema === t.id)
      .sort((x, y) => rang(x.m.id) - rang(y.m.id) || x.nr - y.nr)
      .map(({ m }) => m.id),
  );
  return {
    id: VORSCHAU_KURS_ID,
    titel: 'Vorschau: alle Module',
    beschreibung: 'Nur in der Vorschau. Enthält alle Module, auch Entwürfe, nach Themenbereichen geordnet.',
    themen: themen.map((t) => t.id),
    module,
    aktuellesModul: null,
  };
}
