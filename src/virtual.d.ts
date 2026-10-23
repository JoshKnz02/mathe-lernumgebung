declare module 'virtual:lernumgebung' {
  import type { ComponentType } from 'react';
  import type { Inhalt } from '@/lib/typen';
  export const inhalt: Inhalt;
  export function ladeModul(id: string): Promise<{ default: ComponentType }>;
}

/** Vom Build gesetzt: Entwürfe sichtbar (Vorschau und Entwicklung), nie im öffentlichen Build. */
declare const __ENTWUERFE__: boolean;
/** Vom Build gesetzt: Routing über #-Adressen (Vorschau als Einzeldatei). */
declare const __HASH_ROUTING__: boolean;
