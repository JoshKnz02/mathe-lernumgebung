import type { ReactNode } from 'react';

/** Zusatzinhalt auf Klick, z. B. Lösungen oder Hilfen. Nativ per <details>, daher auch per Tastatur bedienbar. */
export function Aufklappen({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <details className="aufklappen">
      <summary>{titel}</summary>
      <div className="aufklappen-inhalt">{children}</div>
    </details>
  );
}
