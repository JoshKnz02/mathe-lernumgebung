import { useId, useState } from 'react';
import { Funktionsgraph } from '@/components/Funktionsgraph';
import { BREITE, LAENGE, X_MAX, breite, deutsch, laenge, volumen } from './rechnung';

const ECKEN = [{ i: 0, j: 0 }, { i: 1, j: 0 }, { i: 0, j: 1 }, { i: 1, j: 1 }];

/** Schieberegler für x: Netz der Schachtel, Maße, Volumen und Punkt im Graphen von V. */
export function Schachtelerkundung() {
  const id = useId();
  const [x, setX] = useState(2);
  const [spur, setSpur] = useState<number[]>([]);
  const [graph, setGraph] = useState(false);

  const aendere = (neu: number) => {
    setX(neu);
    setSpur((s) => (s.includes(neu) ? s : [...s, neu].slice(-60)));
  };

  // Netz maßstabsgetreu: 30 × 21 in ein 300 × 210 Feld
  const m = 10;
  return (
    <div className="erkundung">
      <div className="erkundung-regler">
        <label htmlFor={id}>
          Höhe x = <strong>{deutsch(x, 1)} cm</strong>
        </label>
        <input id={id} type="range" min={0} max={X_MAX} step={0.1} value={x} onChange={(e) => aendere(Number(e.target.value))} />
      </div>
      <div className="erkundung-zeile">
        <svg className="graph" viewBox="0 0 320 230" role="img" aria-label={`Schachtelnetz mit Eckquadraten der Seitenlänge ${deutsch(x, 1)} cm`}>
          <rect className="netz-blatt" x={10} y={10} width={LAENGE * m} height={BREITE * m} />
          {ECKEN.map(({ i, j }) => (
            <rect key={`${i}${j}`} className="netz-ecke" x={10 + i * (LAENGE * m - x * m)} y={10 + j * (BREITE * m - x * m)} width={x * m} height={x * m} />
          ))}
          <rect className="netz-boden" x={10 + x * m} y={10 + x * m} width={Math.max(laenge(x), 0) * m} height={Math.max(breite(x), 0) * m} />
        </svg>
        <dl className="masse">
          <dt>Länge</dt><dd>{deutsch(laenge(x), 1)} cm</dd>
          <dt>Breite</dt><dd>{deutsch(breite(x), 1)} cm</dd>
          <dt>Höhe</dt><dd>{deutsch(x, 1)} cm</dd>
          <dt>Volumen</dt><dd><strong>{deutsch(volumen(x), 1)} cm³</strong></dd>
        </dl>
      </div>
      <p className="klein">
        Tipp: Verschiebe den Regler und beobachte, wo das Volumen am größten ist. Mit den Pfeiltasten gelingt das auch ohne Maus.
      </p>
      <label className="auswahl">
        <input type="checkbox" checked={graph} onChange={(e) => setGraph(e.target.checked)} /> Volumen in Abhängigkeit von x als Graph zeigen
      </label>
      {graph && (
        <Funktionsgraph
          f={volumen}
          von={0}
          bis={X_MAX}
          xMin={0}
          xMax={11}
          yMin={0}
          yMax={1300}
          xSchritt={1}
          ySchritt={200}
          xName="x in cm"
          yName="V in cm³"
          punkte={[...spur.map((s) => ({ x: s, y: volumen(s) })), { x, y: volumen(x), hervorgehoben: true, beschriftung: `(${deutsch(x, 1)} | ${deutsch(volumen(x), 0)})` }]}
          beschreibung="Graph des Schachtelvolumens in Abhängigkeit von der Höhe x mit dem aktuell eingestellten Punkt. Das Volumen steigt zunächst, erreicht bei etwa 4 cm sein Maximum und fällt dann auf null bei 10,5 cm."
        />
      )}
    </div>
  );
}
