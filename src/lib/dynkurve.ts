import type { Board, GeometryElement } from 'jsxgraph';

export type DynKurve = GeometryElement & { dataX: number[]; dataY: number[]; updateDataArray: () => void; needsRegularUpdate: boolean };

/**
 * Kurve (auch gefüllt), deren Punkte bei jeder Aktualisierung neu aus dem aktuellen Zustand berechnet werden.
 * Unterbrechungen im Linienzug durch NaN. Gebraucht für Treppenzüge und Flächen, deren Form vom Regler abhängt.
 */
export function dynamischeKurve(b: Board, optionen: Record<string, unknown>, daten: () => [number[], number[]]): DynKurve {
  const c = b.create('curve', [[0], [0]], { highlight: false, fixed: true, ...optionen }) as unknown as DynKurve;
  c.needsRegularUpdate = true;
  c.updateDataArray = function () {
    const [x, y] = daten();
    this.dataX = x;
    this.dataY = y;
  };
  return c;
}
