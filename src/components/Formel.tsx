import { rendereFormel } from '@/lib/formel';
import 'katex/dist/katex.min.css';

interface FormelProps {
  /** TeX-Quelltext. In JSX als String schreiben, z. B. tex={String.raw`f(x)=\sin x`}. */
  tex: string;
  /** true: abgesetzte, zentrierte Darstellung. */
  anzeige?: boolean;
  /**
   * Satzzeichen, das direkt auf die Formel folgt (zum Beispiel "," oder "."). Es wird mit der Formel zu einer Einheit verbunden,
   * damit es beim Zeilenumbruch nicht allein am Anfang der nächsten Zeile steht.
   */
  nach?: string;
}

export function Formel({ tex, anzeige = false, nach }: FormelProps) {
  const r = rendereFormel(tex, anzeige);
  if (!r.ok)
    return (
      <span className="formel-fehler" role="alert">
        Formel konnte nicht dargestellt werden: <code>{tex}</code>
        {nach}
      </span>
    );
  const formel = <span className={anzeige ? 'formel formel-anzeige' : 'formel'} dangerouslySetInnerHTML={{ __html: r.html }} />;
  if (!nach || anzeige) return formel;
  return (
    <span className="formel-mit-zeichen">
      {formel}
      {nach}
    </span>
  );
}
