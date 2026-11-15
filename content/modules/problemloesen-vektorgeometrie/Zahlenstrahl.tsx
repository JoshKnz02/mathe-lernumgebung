import { ORANGE, SCHWARZ } from './daten';

const X0 = 24;
const SCHRITT = 26;
const VON = -2;
const BIS = 9;
const zeile = 78;

const komma = (x: number) => String(x).replace('.', ',').replace('-', '−');
const xPos = (v: number) => X0 + (v - VON) * SCHRITT;

/** Lage der Punkte und Abstandsangaben der drei Zahlenstrahlen (berechnet aus a, b und den drei Werten von z). */
export function zahlenstrahlZeilen(a: number, b: number, zWerte: readonly number[]) {
  return zWerte.map((z) => {
    const [lo, mid, hi] = [a, b, z].sort((x, y) => x - y) as [number, number, number];
    return { z, lo, mid, hi, luecke1: mid - lo, luecke2: hi - mid };
  });
}

/** Drei Zahlenstrahlen: Je ein Fall, in dem die drei Zahlen a, b und z gleiche Abstände haben (a und b schwarz, z orange). */
export function Zahlenstrahl({ a, b, z, text }: { a: number; b: number; z: readonly number[]; text: string }) {
  const zeilen = zahlenstrahlZeilen(a, b, z);
  const hoehe = zeilen.length * zeile + 8;
  return (
    <svg className="zahlenstrahl" viewBox={`0 0 ${X0 * 2 + (BIS - VON) * SCHRITT} ${hoehe}`} role="img" aria-label={text} style={{ width: '100%', maxWidth: '24rem', display: 'block', margin: '0.5rem auto' }}>
      {zeilen.map((zl, i) => {
        const y = 36 + i * zeile;
        return (
          <g key={i}>
            <line x1={X0 - 8} y1={y} x2={xPos(BIS) + 8} y2={y} stroke="#8A8A8A" strokeWidth="1.2" />
            {[a, b, zl.z].map((v, k) => (
              <g key={k}>
                <circle cx={xPos(v)} cy={y} r="4.5" fill={k === 2 ? ORANGE : SCHWARZ} />
                <text x={xPos(v)} y={y - 14} fontSize="14" textAnchor="middle" fill={k === 2 ? '#8a3a00' : '#111'}>{k === 2 ? `z = ${komma(v)}` : komma(v)}</text>
              </g>
            ))}
            {[[zl.lo, zl.mid, zl.luecke1], [zl.mid, zl.hi, zl.luecke2]].map(([von, bis, l], k) => (
              <g key={`l${k}`}>
                <line x1={xPos(von!)} y1={y + 14} x2={xPos(bis!)} y2={y + 14} stroke="#555" strokeWidth="1.2" />
                <line x1={xPos(von!)} y1={y + 10} x2={xPos(von!)} y2={y + 18} stroke="#555" strokeWidth="1.2" />
                <line x1={xPos(bis!)} y1={y + 10} x2={xPos(bis!)} y2={y + 18} stroke="#555" strokeWidth="1.2" />
                <text x={(xPos(von!) + xPos(bis!)) / 2} y={y + 31} fontSize="13" textAnchor="middle" fill="#333">{komma(l!)}</text>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
