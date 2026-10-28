import { useId, useState } from 'react';
import { Funktionsgraph } from '@/components/Funktionsgraph';

const grad = (a: number) => (a * Math.PI) / 180;
/** Wurfparabel bei v = 10 m/s ohne Abwurfhöhe: f(x) = tan(α)·x − 5/(v²·cos²(α))·x² */
const bahn = (a: number) => (x: number) => Math.tan(grad(a)) * x - (5 / (100 * Math.cos(grad(a)) ** 2)) * x * x;
const weite = (a: number) => 20 * Math.tan(grad(a)) * Math.cos(grad(a)) ** 2;

export function Wurferkundung() {
  const id = useId();
  const [a, setA] = useState(30);
  const w = weite(a);
  return (
    <div className="erkundung">
      <div className="erkundung-regler">
        <label htmlFor={id}>
          Abwurfwinkel α = <strong>{a}°</strong>
        </label>
        <input id={id} type="range" min={5} max={85} step={1} value={a} onChange={(e) => setA(Number(e.target.value))} />
      </div>
      <Funktionsgraph
        f={bahn(a)}
        von={0}
        bis={w}
        xMin={0}
        xMax={11}
        yMin={0}
        yMax={3}
        xSchritt={1}
        ySchritt={0.5}
        xName="Weite in m"
        yName="Höhe in m"
        punkte={[{ x: w, y: 0, hervorgehoben: true, beschriftung: `W ≈ ${w.toFixed(2).replace('.', ',')} m` }]}
        beschreibung={`Wurfbahn bei einem Abwurfwinkel von ${a} Grad und einer Abwurfgeschwindigkeit von 10 Metern pro Sekunde. Die Wurfweite beträgt etwa ${w.toFixed(1)} Meter.`}
      />
    </div>
  );
}
