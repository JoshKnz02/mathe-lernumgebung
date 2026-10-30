import { useId, useState, type ReactNode } from 'react';
import { Flaechenbild } from '@/components/Flaechenbild';
import { Formel } from '@/components/Formel';
import { ORANGE, SCHWARZ } from '@/components/Messbild';
import { VennDiagramm, type VennMenge } from '@/components/VennDiagramm';
import { orientierteFlaechen } from '@/lib/flaechenbild';
import { regionVon, type Region } from '@/lib/venn';
import { fenster, type Beispiel } from './daten';

export type Begruendungen = Record<string, [ReactNode, ReactNode, ReactNode]>;

interface Props {
  beispiele: Beispiel[];
  mengen: [VennMenge, VennMenge, VennMenge];
  namen: [string, string, string];
  leer: Region[];
  begruendungen: Begruendungen;
  /** Zuerst gewähltes Beispiel. */
  start: string;
}

const ja = (x: boolean) => (x ? 'ja' : 'nein');

/** Zeigt zu einer gewählten Funktion das Schaubild, die drei Eigenschaften mit Begründung und die Region im Venn-Diagramm. */
export function Pruefer({ beispiele, mengen, namen, leer, begruendungen, start }: Props) {
  const basis = useId();
  const [gewaehlt, setGewaehlt] = useState(start);
  const b = beispiele.find((x) => x.id === gewaehlt)!;
  const m = b.mitglied;
  const region = regionVon(m);
  const fen = fenster(b.f, b.von, b.bis);
  const texte = begruendungen[b.id]!;
  return (
    <div className="venn-pruefer">
      <fieldset className="venn-auswahl">
        <legend className="nur-lesegeraet">Funktion wählen</legend>
        {beispiele.map((x) => (
          <label key={x.id}>
            <input type="radio" name={`${basis}-f`} value={x.id} checked={gewaehlt === x.id} onChange={() => setGewaehlt(x.id)} />
            <Formel tex={`f(x)=${x.tex}`} />
          </label>
        ))}
      </fieldset>
      <figure className="bild">
        <Flaechenbild
          key={b.id}
          bereich={fen.bereich}
          teilung={fen.teilung}
          yTeilung={fen.yTeilung}
          xTitel="x"
          yTitel="y"
          kurven={[{ f: b.f, farbe: ORANGE }]}
          flaechen={orientierteFlaechen(b.f, b.von, b.bis)}
          linien={[
            { punkte: [[b.von, fen.bereich[2]], [b.von, fen.bereich[3]]], farbe: SCHWARZ, breite: 1.5, gestrichelt: true },
            { punkte: [[b.bis, fen.bereich[2]], [b.bis, fen.bereich[3]]], farbe: SCHWARZ, breite: 1.5, gestrichelt: true },
          ]}
          beschreibung={`Schaubild der Funktion f mit der Fläche zwischen Schaubild und x-Achse über dem Intervall von ${String(b.von).replace('-', 'minus ')} bis ${b.bis}. Die Grenzen des Intervalls sind gestrichelt.`}
        />
        <figcaption>
          Orange: <Formel tex="K_f" nach="." /> Die Fläche über dem Intervall <Formel tex={`[${b.von};\\,${b.bis}]`} /> ist blau, wo <Formel tex="f" /> positiv ist, und rosa, wo <Formel tex="f" /> negativ ist.
        </figcaption>
      </figure>
      <section aria-label="Eigenschaften der gewählten Funktion">
        <h4>
          Eigenschaften von <Formel tex={`f(x)=${b.tex}`} />
        </h4>
        <dl className="eigenschaften">
          {mengen.map((mg, i) => (
            <div key={mg.kurz}>
              <dt>
                {namen[i]} ({mg.kurz}): {ja(m[i]!)}
              </dt>
              <dd>{texte[i]}</dd>
            </div>
          ))}
        </dl>
      </section>
      <figure className="bild">
        <VennDiagramm mengen={mengen} markiert={region} leer={leer} />
        <figcaption>Die Funktion gehört in die Region {region}.</figcaption>
      </figure>
      <p aria-live="polite" className="nur-lesegeraet">Region {region} ist markiert.</p>
    </div>
  );
}
