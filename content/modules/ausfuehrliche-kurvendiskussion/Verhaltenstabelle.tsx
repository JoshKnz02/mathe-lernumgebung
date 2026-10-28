import { Formel } from '@/components/Formel';
import { VIER_FAELLE } from './daten';

/** Tabelle zum globalen Verhalten ganzrationaler Funktionen: zwei Spalten, damit sie auch auf schmalen Bildschirmen lesbar bleibt. */
export function Verhaltenstabelle() {
  return (
    <table className="tabelle tabelle-kompakt">
      <caption>Globales Verhalten ganzrationaler Funktionen</caption>
      <thead>
        <tr>
          <th scope="col">Grad und Leitkoeffizient</th>
          <th scope="col">Verhalten und Verlauf</th>
        </tr>
      </thead>
      <tbody>
        {VIER_FAELLE.map((z) => (
          <tr key={z.tex}>
            <th scope="row">Grad {z.grad}, Leitkoeffizient {z.lk}</th>
            <td>
              <div><Formel tex={String.raw`x\to-\infty:\ ${z.links}`} /></div>
              <div><Formel tex={String.raw`x\to\infty:\ ${z.rechts}`} /></div>
              <div>Das Schaubild verläuft {z.verlauf}.</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
