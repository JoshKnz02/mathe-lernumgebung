import { useMemo, useState } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { Formel } from '@/components/Formel';
import { FARBEN, Zeichenbrett } from '@/components/Zeichenbrett';
import { piTex, zahlText } from '@/lib/zahlen';
import {
  GRUNDFUNKTIONEN,
  analysiere,
  definitionsbereich,
  finde,
  istNullfunktion,
  verknuepfe,
  verknuepfungTerm,
  wert,
  type Analyse,
  type Grundfunktion,
  type SymmetrieArt,
  type Verknuepfung,
} from '@/lib/verknuepfung';
import { FARBE_F, FARBE_G, FARBE_H } from './daten';

type Ausschnitt = 'normal' | 'gross';
const AUSSCHNITT: Record<Ausschnitt, { bereich: [number, number, number, number]; teilung: number; name: string }> = {
  normal: { bereich: [-6, 6, -6, 6], teilung: 2, name: 'normal' },
  gross: { bereich: [-12, 12, -12, 12], teilung: 4, name: 'groß' },
};
const ARTEN: { art: Verknuepfung; name: string; tex: string }[] = [
  { art: 'summe', name: 'Summe f + g', tex: '+' },
  { art: 'differenz', name: 'Differenz f − g', tex: '-' },
  { art: 'produkt', name: 'Produkt f · g', tex: String.raw`\cdot` },
];
const MAX_NULLSTELLEN = 40;
const MAX_ANGEZEIGT = 8;

const SYMMETRIE_TEXT: Record<SymmetrieArt, string> = {
  punkt: 'punktsymmetrisch zum Ursprung',
  achse: 'achsensymmetrisch zur y-Achse',
  keine: 'keine Symmetrie',
};

interface Zustand {
  f: Grundfunktion;
  g: Grundfunktion;
  art: Verknuepfung;
  zeigeF: boolean;
  zeigeG: boolean;
  zeigeSpiegel: boolean;
  zeigeNullstellen: boolean;
  nullstellen: number[];
}

const nullstellenText = (zs: number[]) =>
  zs.length === 0 ? 'keine' : `${zs.length}: ${zs.slice(0, MAX_ANGEZEIGT).map((x) => zahlText(x)).join('; ')}${zs.length > MAX_ANGEZEIGT ? '; …' : ''}`;

export function Verknuepfungslabor() {
  const [fId, setFId] = useState('quad');
  const [gId, setGId] = useState('exp3');
  const [art, setArt] = useState<Verknuepfung>('summe');
  const [ausschnitt, setAusschnitt] = useState<Ausschnitt>('normal');
  const [zeigeF, setZeigeF] = useState(true);
  const [zeigeG, setZeigeG] = useState(true);
  const [zeigeSpiegel, setZeigeSpiegel] = useState(false);
  const [zeigeNullstellen, setZeigeNullstellen] = useState(true);

  const f = finde(fId);
  const g = finde(gId);
  const [xmin, xmax] = AUSSCHNITT[ausschnitt].bereich;
  const nullfunktion = istNullfunktion(f, g, art);
  const h = useMemo(() => verknuepfe(f, g, art), [f, g, art]);
  const analyseF = useMemo(() => analysiere((x) => wert(f, x), f.ab0 ? 'ab0' : 'alle', xmin, xmax), [f, xmin, xmax]);
  const analyseG = useMemo(() => analysiere((x) => wert(g, x), g.ab0 ? 'ab0' : 'alle', xmin, xmax), [g, xmin, xmax]);
  const analyseH = useMemo(() => (nullfunktion ? null : analysiere(h, definitionsbereich(f, g), xmin, xmax)), [h, f, g, nullfunktion, xmin, xmax]);

  const term = verknuepfungTerm(f, g, art);
  const zustand: Zustand = { f, g, art, zeigeF, zeigeG, zeigeSpiegel, zeigeNullstellen, nullstellen: analyseH?.nullstellen ?? [] };
  const gewaehlt = ARTEN.find((a) => a.art === art)!;
  const beschreibung = `Schaubilder von f(x) = ${f.sprech}, g(x) = ${g.sprech} und h (${gewaehlt.name}). ${
    nullfunktion ? 'Die Differenz ist die Nullfunktion, ihr Schaubild ist die x-Achse.' : `Die Tabelle unter dem Schaubild nennt die Nullstellen und weitere Eigenschaften von h. h hat ${analyseH!.nullstellen.length} Nullstellen im sichtbaren Ausschnitt.`
  }`;

  const wahl = (titel: string, aktuell: string, setze: (id: string) => void) => (
    <fieldset className="schalter-gruppe">
      <legend>{titel}</legend>
      <div className="schnellwahl">
        {GRUNDFUNKTIONEN.map((fn) => (
          <button key={fn.id} type="button" className="chip" aria-pressed={aktuell === fn.id} aria-label={fn.sprech} onClick={() => setze(fn.id)}>
            <Formel tex={fn.tex} />
          </button>
        ))}
      </div>
    </fieldset>
  );

  const zelle = (a: Analyse | null, fn: (a: Analyse) => React.ReactNode) => (a ? fn(a) : '–');
  const asymptoteZelle = (a: Analyse) => (
    <>
      links: {a.asymptoteLinks ? <Formel tex={a.asymptoteLinks} /> : 'keine'}
      <br />
      rechts: {a.asymptoteRechts ? <Formel tex={a.asymptoteRechts} /> : 'keine'}
    </>
  );
  const spalten: { kopf: React.ReactNode; a: Analyse | null }[] = [
    { kopf: <Formel tex="f" />, a: analyseF },
    { kopf: <Formel tex="g" />, a: analyseG },
    { kopf: <Formel tex="h" />, a: analyseH },
  ];

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={AUSSCHNITT[ausschnitt].bereich}
        xTeilung={AUSSCHNITT[ausschnitt].teilung}
        yTeilung={AUSSCHNITT[ausschnitt].teilung}
        xBeschriftung="zahl"
        className="brett-3zu2"
        beschreibung={beschreibung}
        zustand={zustand}
        aufbau={(brett, lies) => {
          const stil = { highlight: false, fixed: true };
          const kurve = (fn: (z: Zustand) => (x: number) => number, farbe: string, breite: number, strich: number) =>
            brett.create('functiongraph', [(x: number) => fn(lies())(x)], { ...stil, strokeColor: farbe, strokeWidth: breite, dash: strich }) as GeometryElement;
          const kf = kurve((z) => (x) => wert(z.f, x), FARBE_F, 2.5, 0);
          const kg = kurve((z) => (x) => wert(z.g, x), FARBE_G, 2.5, 2);
          const spiegel = kurve((z) => (x) => -wert(z.g, x), FARBEN.vergleich, 2, 3);
          kurve((z) => (x) => (istNullfunktion(z.f, z.g, z.art) ? 0 : verknuepfe(z.f, z.g, z.art)(x)), FARBE_H, 3.5, 0);
          const punkte = Array.from({ length: MAX_NULLSTELLEN }, (_, i) =>
            brett.create('point', [() => lies().nullstellen[i] ?? 0, 0], {
              ...stil,
              withLabel: false,
              face: 'o',
              size: 5,
              strokeColor: '#fff',
              fillColor: FARBE_H,
              visible: false,
            }) as GeometryElement,
          );
          return (z: Zustand) => {
            kf.setAttribute({ visible: z.zeigeF });
            kg.setAttribute({ visible: z.zeigeG });
            spiegel.setAttribute({ visible: z.zeigeSpiegel });
            punkte.forEach((p, i) => p.setAttribute({ visible: z.zeigeNullstellen && i < z.nullstellen.length }));
          };
        }}
      />

      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: FARBE_F }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: FARBE_G }} aria-hidden="true" /> <Formel tex="K_g" /> (gestrichelt)</li>
        <li><span className="legende-farbe" style={{ background: FARBE_H }} aria-hidden="true" /> <Formel tex="K_h" /> (dick), Nullstellen als Punkte</li>
        {zeigeSpiegel && <li><span className="legende-farbe" style={{ background: FARBEN.vergleich }} aria-hidden="true" /> Spiegelbild von <Formel tex="K_g" /> an der x-Achse</li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`h(x)=f(x)\\,${gewaehlt.tex}\\,g(x)=${nullfunktion ? '0' : term}`} />
        {nullfunktion && <p className="klein">Die Differenz einer Funktion mit sich selbst ist die Nullfunktion, ihr Schaubild ist die x-Achse. Wähle für <Formel tex="g" /> eine andere Funktion.</p>}
      </div>

      <div className="labor-bedienung">
        <div>
          {wahl('Funktion f', fId, setFId)}
          {wahl('Funktion g', gId, setGId)}
        </div>
        <div>
          <fieldset className="funktionswahl">
            <legend>Verknüpfung</legend>
            {ARTEN.map((o) => (
              <label key={o.art}>
                <input type="radio" name="verknuepfung-art" checked={art === o.art} onChange={() => setArt(o.art)} /> {o.name}
              </label>
            ))}
          </fieldset>
          <fieldset className="funktionswahl">
            <legend>Ausschnitt</legend>
            {(Object.keys(AUSSCHNITT) as Ausschnitt[]).map((k) => (
              <label key={k}>
                <input type="radio" name="verknuepfung-ausschnitt" checked={ausschnitt === k} onChange={() => setAusschnitt(k)} /> {AUSSCHNITT[k].name}
              </label>
            ))}
          </fieldset>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={zeigeF} onChange={(e) => setZeigeF(e.target.checked)} /> <Formel tex="K_f" /> anzeigen</label>
            <label className="schalter"><input type="checkbox" checked={zeigeG} onChange={(e) => setZeigeG(e.target.checked)} /> <Formel tex="K_g" /> anzeigen</label>
            <label className="schalter"><input type="checkbox" checked={zeigeNullstellen} onChange={(e) => setZeigeNullstellen(e.target.checked)} /> Nullstellen von <Formel tex="h" /> markieren</label>
            <label className="schalter"><input type="checkbox" checked={zeigeSpiegel} onChange={(e) => setZeigeSpiegel(e.target.checked)} /> Spiegelbild von <Formel tex="K_g" /> an der x-Achse</label>
          </fieldset>
        </div>
      </div>

      <table className="tabelle tabelle-kompakt">
        <caption>Eigenschaften von <Formel tex="f" nach="," /> <Formel tex="g" /> und <Formel tex="h" /> (Nullstellen im sichtbaren Ausschnitt, auf zwei Stellen gerundet)</caption>
        <thead>
          <tr>
            <th scope="col">Eigenschaft</th>
            {spalten.map((s, i) => (
              <th key={i} scope="col">{s.kopf}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Definitionsbereich</th>
            {spalten.map((s, i) => (
              <td key={i}>{zelle(s.a, (a) => <Formel tex={a.definitionsbereich === 'alle' ? String.raw`\mathbb{R}` : String.raw`[0;\,\infty[`} />)}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Symmetrie</th>
            {spalten.map((s, i) => (
              <td key={i}>{zelle(s.a, (a) => SYMMETRIE_TEXT[a.symmetrie])}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Nullstellen</th>
            {spalten.map((s, i) => (
              <td key={i}>{s.a ? nullstellenText(s.a.nullstellen) : nullfunktion && i === 2 ? 'alle x' : '–'}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Asymptote (Gerade)</th>
            {spalten.map((s, i) => (
              <td key={i}>{zelle(s.a, asymptoteZelle)}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Periode</th>
            {spalten.map((s, i) => (
              <td key={i}>{zelle(s.a, (a) => (a.periode === null ? 'nicht periodisch' : <Formel tex={`p=${piTex(a.periode)}`} />))}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="labor-knoepfe">
        <span className="klein">Die Tabelle wertet das Schaubild von <Formel tex="h" /> numerisch aus, sie ersetzt keine Rechnung.</span>
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => {
            setFId('quad');
            setGId('exp3');
            setArt('summe');
            setAusschnitt('normal');
            setZeigeF(true);
            setZeigeG(true);
            setZeigeSpiegel(false);
            setZeigeNullstellen(true);
          }}
        >
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
