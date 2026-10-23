import type { ReactNode } from 'react';

type Art = 'info' | 'merksatz';

interface HinweisProps {
  children: ReactNode;
  art?: Art;
  titel?: string;
}

const STANDARDTITEL: Record<Art, string> = { info: 'Hinweis', merksatz: 'Merksatz' };

export function Hinweis({ children, art = 'info', titel }: HinweisProps) {
  return (
    <aside className={`hinweis hinweis-${art}`}>
      <p className="hinweis-titel">{titel ?? STANDARDTITEL[art]}</p>
      <div>{children}</div>
    </aside>
  );
}
