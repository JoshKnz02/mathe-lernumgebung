import { useMemo, useState, type ReactNode } from 'react';
import type { GeometryElement } from 'jsxgraph';
import { Formel } from '@/components/Formel';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { piTex, zahlText } from '@/lib/zahlen';
import {
  KETTENFUNKTIONEN,
  analysiereEinzel,
  analysiereKette,
  findeKette,
  nullstellenKette,
  verkette,
  verkettungTerm,
  wertKette,
  type AnalyseKette,
  type KettenFunktion,
} from '@/lib/verkettung';
import type { SymmetrieArt } from '@/lib/verknuepfung';
import { FARBE_U, FARBE_UV, FARBE_V, FARBE_VU } from './daten';

const BEREICH: [number, number, number, number] = [-5, 5, -5, 5];
const MAX_NULLSTELLEN = 90;
const MAX_ANGEZEIGT = 8;
const ZAHLWORT = ['keine', 'eine', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'];

const SYMMETRIE_TEXT: Record<SymmetrieArt, string> = {
  punkt: 'punktsymmetrisch zum Ursprung',
  achse: 'achsensymmetrisch zur y-Achse',
  keine: 'keine Symmetrie',
};

const nullstellenText = (zs: number[]) =>
  zs.length === 0
    ? 'keine'
    : `${ZAHLWORT[zs.length] ?? zs.length} ${zs.length === 1 ? 'Nullstelle' : 'Nullstellen'}: ${zs.slice(0, MAX_ANGEZEIGT).map((x) => zahlText(x)).join('; ')}${zs.length > MAX_ANGEZEIGT ? '; …' : ''}`;

interface Zustand {
  u: KettenFunktion;
  v: KettenFunktion;
  zeigeU: boolean;
  zeigeV: boolean;
  zeigeVU: boolean;
  zeigeNullstellen: boolean;
  nullUV: number[];
  nullVU: number[];
}

/**
 * Labor zur Verkettung: Zwei Funktionen u (äußere) und v (innere) werden ausgewählt. Das Schaubild von u ∘ v ist dick blau,
 * auf Wunsch zusätzlich das von v ∘ u rosa. Die Tabelle nennt Definitionsbereich, Symmetrie, Nullstellen und Periode.
 */
export function Verkettungslabor() {
  const [uId, setUId] = useState('exp');
  const [vId, setVId] = useState('cos');
  const [zeigeU, setZeigeU] = useState(true);
  const [zeigeV, setZeigeV] = useState(true);
  const [zeigeVU, setZeigeVU] = useState(false);
  const [zeigeNullstellen, setZeigeNullstellen] = useState(true);

  const u = findeKette(uId);
  const v = findeKette(vId);
  const [von, bis] = [BEREICH[0], BEREICH[1]];
  const analyseU = useMemo(() => analysiereEinzel(u, von, bis), [u, von, bis]);
  const analyseV = useMemo(() => analysiereEinzel(v, von, bis), [v, von, bis]);
  const analyseUV = useMemo(() => analysiereKette(u, v, von, bis), [u, v, von, bis]);
  const analyseVU = useMemo(() => analysiereKette(v, u, von, bis), [u, v, von, bis]);
  const nullUV = analyseUV.nullstellen;
  const nullVU = useMemo(() => (zeigeVU ? nullstellenKette(verkette(v, u), von, bis) : []), [zeigeVU, u, v, von, bis]);
  const zustand: Zustand = { u, v, zeigeU, zeigeV, zeigeVU, zeigeNullstellen, nullUV, nullVU };

  const beschreibung = `Schaubilder von u(x) = ${u.sprech}, v(x) = ${v.sprech} und der Verkettung u nach v${zeigeVU ? ' sowie v nach u' : ''}. Die Tabelle unter dem Schaubild nennt Definitionsbereich, Symmetrie, Nullstellen und Periode. u nach v hat ${nullUV.length} Nullstellen im sichtbaren Ausschnitt.`;

  const wahl = (titel: ReactNode, aktuell: string, setze: (id: string) => void) => (
    <fieldset className="schalter-gruppe">
      <legend>{titel}</legend>
      <div className="schnellwahl">
        {KETTENFUNKTIONEN.map((fn) => (
          <button key={fn.id} type="button" className="chip" aria-pressed={aktuell === fn.id} aria-label={fn.sprech} onClick={() => setze(fn.id)}>
            <Formel tex={fn.tex} />
          </button>
        ))}
      </div>
    </fieldset>
  );

  const spalten: { kopf: ReactNode; a: AnalyseKette; sichtbar: boolean }[] = [
    { kopf: <Formel tex="u" />, a: analyseU, sichtbar: true },
    { kopf: <Formel tex="v" />, a: analyseV, sichtbar: true },
    { kopf: <Formel tex={String.raw`u\circ v`} />, a: analyseUV, sichtbar: true },
    { kopf: <Formel tex={String.raw`v\circ u`} />, a: analyseVU, sichtbar: zeigeVU },
  ];
  const sichtbar = spalten.filter((s) => s.sichtbar);

  return (
    <div className="labor">
      <Zeichenbrett
        bereich={BEREICH}
        xTeilung={1}
        yTeilung={1}
        xBeschriftung="zahl"
        className="brett-3zu2"
        beschreibung={beschreibung}
        zustand={zustand}
        aufbau={(brett, lies) => {
          const stil = { highlight: false, fixed: true };
          const kurve = (fn: (z: Zustand) => (x: number) => number, farbe: string, breite: number, strich: number) =>
            brett.create('functiongraph', [(x: number) => fn(lies())(x)], { ...stil, strokeColor: farbe, strokeWidth: breite, dash: strich }) as GeometryElement;
          const ku = kurve((z) => (x) => wertKette(z.u, x), FARBE_U, 2.5, 0);
          const kv = kurve((z) => (x) => wertKette(z.v, x), FARBE_V, 2.5, 2);
          const kvu = kurve((z) => verkette(z.v, z.u), FARBE_VU, 3.5, 0);
          kurve((z) => verkette(z.u, z.v), FARBE_UV, 3.5, 0);
          const punkte = (liste: (z: Zustand) => number[], farbe: string) =>
            Array.from({ length: MAX_NULLSTELLEN }, (_, i) =>
              brett.create('point', [() => liste(lies())[i] ?? 0, 0], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: '#fff', fillColor: farbe, visible: false }) as GeometryElement,
            );
          const pUV = punkte((z) => z.nullUV, FARBE_UV);
          const pVU = punkte((z) => z.nullVU, FARBE_VU);
          return (z: Zustand) => {
            ku.setAttribute({ visible: z.zeigeU });
            kv.setAttribute({ visible: z.zeigeV });
            kvu.setAttribute({ visible: z.zeigeVU });
            pUV.forEach((p, i) => p.setAttribute({ visible: z.zeigeNullstellen && i < z.nullUV.length }));
            pVU.forEach((p, i) => p.setAttribute({ visible: z.zeigeNullstellen && z.zeigeVU && i < z.nullVU.length }));
          };
        }}
      />

      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: FARBE_U }} aria-hidden="true" /> <Formel tex="K_u" /></li>
        <li><span className="legende-farbe" style={{ background: FARBE_V }} aria-hidden="true" /> <Formel tex="K_v" /> (gestrichelt)</li>
        <li><span className="legende-farbe" style={{ background: FARBE_UV }} aria-hidden="true" /> <Formel tex={String.raw`K_{u\circ v}`} /> (dick), Nullstellen als Punkte</li>
        {zeigeVU && <li><span className="legende-farbe" style={{ background: FARBE_VU }} aria-hidden="true" /> <Formel tex={String.raw`K_{v\circ u}`} /> (dick)</li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={String.raw`(u\circ v)(x)=u(v(x))=${verkettungTerm(u, v)}`} />
        {zeigeVU && <Formel anzeige tex={String.raw`(v\circ u)(x)=v(u(x))=${verkettungTerm(v, u)}`} />}
      </div>

      <div className="labor-bedienung">
        <div>
          {wahl(<>Äußere Funktion <Formel tex="u" /></>, uId, setUId)}
          {wahl(<>Innere Funktion <Formel tex="v" /></>, vId, setVId)}
        </div>
        <div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={zeigeU} onChange={(e) => setZeigeU(e.target.checked)} /> <Formel tex="K_u" /> anzeigen</label>
            <label className="schalter"><input type="checkbox" checked={zeigeV} onChange={(e) => setZeigeV(e.target.checked)} /> <Formel tex="K_v" /> anzeigen</label>
            <label className="schalter"><input type="checkbox" checked={zeigeVU} onChange={(e) => setZeigeVU(e.target.checked)} /> Verkettung in umgekehrter Reihenfolge <Formel tex={String.raw`v\circ u`} /> anzeigen</label>
            <label className="schalter"><input type="checkbox" checked={zeigeNullstellen} onChange={(e) => setZeigeNullstellen(e.target.checked)} /> Nullstellen der Verkettungen markieren</label>
          </fieldset>
        </div>
      </div>

      <table className="tabelle tabelle-kompakt">
        <caption>Eigenschaften im sichtbaren Ausschnitt (Nullstellen auf zwei Stellen gerundet)</caption>
        <thead>
          <tr>
            <th scope="col">Eigenschaft</th>
            {sichtbar.map((s, i) => (
              <th key={i} scope="col">{s.kopf}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Definitionsbereich</th>
            {sichtbar.map((s, i) => (
              <td key={i}><Formel tex={s.a.definitionsbereich} /></td>
            ))}
          </tr>
          <tr>
            <th scope="row">Symmetrie</th>
            {sichtbar.map((s, i) => (
              <td key={i}>{SYMMETRIE_TEXT[s.a.symmetrie]}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Nullstellen</th>
            {sichtbar.map((s, i) => (
              <td key={i}>{nullstellenText(s.a.nullstellen)}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Periode</th>
            {sichtbar.map((s, i) => (
              <td key={i}>{s.a.periode === null ? 'nicht periodisch' : <Formel tex={`p=${piTex(s.a.periode)}`} />}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="labor-knoepfe">
        <span className="klein">Die Tabelle wertet das Schaubild numerisch aus, sie ersetzt keine Rechnung.</span>
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => {
            setUId('exp');
            setVId('cos');
            setZeigeU(true);
            setZeigeV(true);
            setZeigeVU(false);
            setZeigeNullstellen(true);
          }}
        >
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
