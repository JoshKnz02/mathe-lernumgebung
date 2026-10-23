import type { ReactNode } from 'react';

interface KarteProps {
  children: ReactNode;
  /** Hebt die Karte dezent hervor, z. B. für das aktuelle Unterrichtsthema. */
  hervorgehoben?: boolean;
  className?: string;
}

export function Karte({ children, hervorgehoben = false, className = '' }: KarteProps) {
  return <div className={`karte${hervorgehoben ? ' karte-hervorgehoben' : ''} ${className}`.trim()}>{children}</div>;
}
