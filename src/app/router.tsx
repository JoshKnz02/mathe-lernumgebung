import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';

/** Alle Seiten der Anwendung. Adressen: siehe erzeugePfad. */
export type Route =
  | { art: 'start' }
  | { art: 'kurs'; kurs: string }
  | { art: 'thema'; kurs: string; thema: string }
  | { art: 'unterbereich'; kurs: string; thema: string; unterbereich: string }
  | { art: 'modul'; kurs: string; modul: string; abschnitt?: string }
  | { art: 'wiederholen'; kurs: string }
  | { art: 'bibliothek' }
  | { art: 'bibliothekModul'; modul: string; abschnitt?: string }
  | { art: 'unbekannt' };

export function parsePfad(pfad: string): Route {
  const teile = pfad.split('/').filter(Boolean).map((t) => {
    try {
      return decodeURIComponent(t);
    } catch {
      return t;
    }
  });
  const [a, b, c, d] = teile;
  if (teile.length === 0) return { art: 'start' };
  if (a === 'kurs' && b) {
    if (teile.length === 2) return { art: 'kurs', kurs: b };
    if (teile.length === 3 && c === 'wiederholen') return { art: 'wiederholen', kurs: b };
    if (teile.length === 4 && c === 'thema' && d) return { art: 'thema', kurs: b, thema: d };
    if (teile.length === 5 && c === 'thema' && d && teile[4]) return { art: 'unterbereich', kurs: b, thema: d, unterbereich: teile[4] };
    if (teile.length === 4 && c === 'modul' && d) return { art: 'modul', kurs: b, modul: d };
    if (teile.length === 5 && c === 'modul' && d && teile[4]) return { art: 'modul', kurs: b, modul: d, abschnitt: teile[4] };
  }
  if (a === 'bibliothek') {
    if (teile.length === 1) return { art: 'bibliothek' };
    if (teile.length === 2 && b) return { art: 'bibliothekModul', modul: b };
    if (teile.length === 3 && b && c) return { art: 'bibliothekModul', modul: b, abschnitt: c };
  }
  return { art: 'unbekannt' };
}

export function erzeugePfad(r: Route): string {
  switch (r.art) {
    case 'start':
      return '/';
    case 'kurs':
      return `/kurs/${r.kurs}/`;
    case 'thema':
      return `/kurs/${r.kurs}/thema/${r.thema}/`;
    case 'unterbereich':
      return `/kurs/${r.kurs}/thema/${r.thema}/${r.unterbereich}/`;
    case 'modul':
      return `/kurs/${r.kurs}/modul/${r.modul}/${r.abschnitt ? `${r.abschnitt}/` : ''}`;
    case 'wiederholen':
      return `/kurs/${r.kurs}/wiederholen/`;
    case 'bibliothek':
      return '/bibliothek/';
    case 'bibliothekModul':
      return `/bibliothek/${r.modul}/${r.abschnitt ? `${r.abschnitt}/` : ''}`;
    case 'unbekannt':
      return '/';
  }
}

const basis = () => import.meta.env.BASE_URL;

/** Adresse für href: im öffentlichen Build mit Basispfad, in der Einzeldatei-Vorschau als #-Adresse. */
export function hrefFuer(r: Route): string {
  const pfad = erzeugePfad(r);
  return __HASH_ROUTING__ ? `#${pfad}` : basis() + pfad.slice(1);
}

/** Aktueller Pfad ab der Anwendungswurzel, z. B. "/kurs/abitur-2028/". */
export function aktuellerPfad(): string {
  if (typeof window === 'undefined') return '/';
  if (__HASH_ROUTING__) return window.location.hash.slice(1) || '/';
  const pfad = window.location.pathname;
  const b = basis();
  return pfad.startsWith(b) ? '/' + pfad.slice(b.length) : pfad;
}

const ABO = 'lernumgebung:navigation';

function abonnieren(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('hashchange', callback);
  window.addEventListener(ABO, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('hashchange', callback);
    window.removeEventListener(ABO, callback);
  };
}

export function useRoute(): Route {
  const pfad = useSyncExternalStore(abonnieren, aktuellerPfad, () => '/');
  return parsePfad(pfad);
}

export function navigiere(r: Route) {
  if (__HASH_ROUTING__) {
    window.location.hash = hrefFuer(r);
  } else {
    window.history.pushState(null, '', hrefFuer(r));
    window.dispatchEvent(new Event(ABO));
  }
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  zu: Route;
}

export function Link({ zu, onClick, ...rest }: LinkProps) {
  const klick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || __HASH_ROUTING__) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigiere(zu);
  };
  return <a {...rest} href={hrefFuer(zu)} onClick={klick} />;
}
