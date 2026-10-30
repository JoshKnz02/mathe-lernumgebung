import type { ReactNode } from 'react';

/** Bewertungseinheiten hinter einer Teilaufgabe, als Anhaltspunkt für den Umfang. */
export const BE = ({ n }: { n: number }) => <span className="be">({n} BE)</span>;

/** Teilaufgaben a), b), c) …; `ab` ist der Buchstabe, mit dem die Zählung beginnt (1 = a, 2 = b). */
export const Teile = ({ children, ab = 1 }: { children: ReactNode; ab?: number }) => (
  <ol className="teilaufgaben" start={ab}>
    {children}
  </ol>
);
