import type { ReactNode } from 'react';

/** Schlichte Linien-Symbole für Kacheln. Rein dekorativ (aria-hidden), die Bedeutung steht im Text der Kachel. */
function Symbol({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

export const Sinuswelle = () => (
  <Symbol>
    <path d="M3 16h26" strokeWidth="1.25" opacity="0.5" />
    <path d="M3 16c3.5-11 7-11 10.5 0s7 11 10.5 0c1.2-3.8 2.6-6 5-6" />
  </Symbol>
);

export const Wiederholen = () => (
  <Symbol>
    <path d="M26 12a10 10 0 0 0-18.5-3M6 4v5h5" />
    <path d="M6 20a10 10 0 0 0 18.5 3M26 28v-5h-5" />
  </Symbol>
);

export const Buch = () => (
  <Symbol>
    <path d="M5 6.5C8.5 5 12.5 5 16 7c3.5-2 7.5-2 11-.5V25c-3.5-1.5-7.5-1.5-11 .5-3.5-2-7.5-2-11-.5z" />
    <path d="M16 7v18" />
  </Symbol>
);

/** Symbol zu einem Themenbereich. Unbekannte Themen erhalten das allgemeine Buch-Symbol. */
export function themaSymbol(themaId: string): ReactNode {
  return themaId === 'trigonometrische-funktionen' ? <Sinuswelle /> : <Buch />;
}
