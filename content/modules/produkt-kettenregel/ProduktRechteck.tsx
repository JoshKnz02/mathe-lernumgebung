import { BLAU, GRUEN, ORANGE } from '@/components/Messbild';

/**
 * Rechteck mit den Seiten u und v: Wächst x ein wenig, wächst u um einen kleinen Streifen und v um einen kleinen Streifen.
 * Der Flächenzuwachs besteht aus zwei langen Streifen und einem winzigen Eckstück.
 */
export function ProduktRechteck() {
  const w = 170;
  const h = 110;
  const du = 28;
  const dv = 22;
  const x0 = 40;
  const y0 = 30 + dv;
  return (
    <svg className="venn" viewBox="0 0 300 200" role="img" aria-label="Rechteck mit den Seiten u und v. An der rechten Seite hängt ein Streifen der Breite Delta u, die Fläche ist Delta u mal v, blau. An der oberen Seite hängt ein Streifen der Höhe Delta v, die Fläche ist u mal Delta v, grün. In der Ecke bleibt ein sehr kleines graues Rechteck Delta u mal Delta v.">
      <rect x={x0} y={y0} width={w} height={h} fill="#f5d5bd" stroke={ORANGE} strokeWidth="2" />
      <rect x={x0 + w} y={y0} width={du} height={h} fill="#bcd9ee" stroke={BLAU} strokeWidth="2" />
      <rect x={x0} y={y0 - dv} width={w} height={dv} fill="#bfe6d8" stroke={GRUEN} strokeWidth="2" />
      <rect x={x0 + w} y={y0 - dv} width={du} height={dv} fill="#d9d9d9" stroke="#555" strokeWidth="1.5" />
      <text className="bild-text" x={x0 + w / 2} y={y0 + h / 2} textAnchor="middle" dominantBaseline="central" fontSize="15" fill="#111">u · v</text>
      <text className="bild-text" x={x0 + w / 2} y={y0 + h + 22} textAnchor="middle" fontSize="15" fill={ORANGE}>u</text>
      <text className="bild-text" x={x0 - 14} y={y0 + h / 2} textAnchor="middle" dominantBaseline="central" fontSize="15" fill={ORANGE}>v</text>
      <text className="bild-text" x={x0 + w + du / 2} y={y0 + h / 2} textAnchor="middle" dominantBaseline="central" fontSize="13" fill={BLAU}>Δu · v</text>
      <text className="bild-text" x={x0 + w / 2} y={y0 - dv / 2} textAnchor="middle" dominantBaseline="central" fontSize="13" fill={GRUEN}>u · Δv</text>
      <text className="bild-text" x={x0 + w + du / 2} y={y0 + h + 22} textAnchor="middle" fontSize="13" fill={BLAU}>Δu</text>
      <text className="bild-text" x={x0 - 14} y={y0 - dv / 2} textAnchor="middle" dominantBaseline="central" fontSize="13" fill={GRUEN}>Δv</text>
      <text className="bild-text" x={x0 + w + du + 10} y={y0 - dv / 2} dominantBaseline="central" fontSize="11" fill="#444">Δu·Δv</text>
    </svg>
  );
}

