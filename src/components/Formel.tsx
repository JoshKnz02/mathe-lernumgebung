import { rendereFormel } from '@/lib/formel';
import 'katex/dist/katex.min.css';

interface FormelProps {
  /** TeX-Quelltext. In JSX als String schreiben, z. B. tex={String.raw`f(x)=\sin x`}. */
  tex: string;
  /** true: abgesetzte, zentrierte Darstellung. */
  anzeige?: boolean;
}

export function Formel({ tex, anzeige = false }: FormelProps) {
  const r = rendereFormel(tex, anzeige);
  if (!r.ok)
    return (
      <span className="formel-fehler" role="alert">
        Formel konnte nicht dargestellt werden: <code>{tex}</code>
      </span>
    );
  return <span className={anzeige ? 'formel formel-anzeige' : 'formel'} dangerouslySetInnerHTML={{ __html: r.html }} />;
}
