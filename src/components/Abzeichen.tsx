import type { ReactNode } from 'react';

export function Abzeichen({ children, art = 'neutral' }: { children: ReactNode; art?: 'neutral' | 'akzent' | 'warnung' }) {
  return <span className={`abzeichen abzeichen-${art}`}>{children}</span>;
}
