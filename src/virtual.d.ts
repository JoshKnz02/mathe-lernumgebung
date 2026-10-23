declare module 'virtual:lernumgebung' {
  import type { ComponentType } from 'react';
  import type { Inhalt } from '@/lib/typen';
  export const inhalt: Inhalt;
  export function ladeModul(id: string): Promise<{ default: ComponentType }>;
}

/** Vom Build gesetzt: Entwürfe sichtbar (Vorschau und Entwicklung), nie im öffentlichen Build. */
declare const __ENTWUERFE__: boolean;
/** Vom Build gesetzt: Stand der Vorschau (Branch, Commit, Bauzeit). Leer im öffentlichen Build. */
declare const __BAU_INFO__: string;
/** Vom Build gesetzt: Routing über #-Adressen (Vorschau als Einzeldatei). */
declare const __HASH_ROUTING__: boolean;

/** Stylesheet von JSXGraph, über einen Alias in vite.config.ts eingebunden. */
declare module 'jsxgraph-stile';
