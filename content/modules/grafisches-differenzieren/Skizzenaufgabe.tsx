import { useId, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { BLAU, GRUEN, ORANGE, Messbild } from '@/components/Messbild';
import { Zeichenbrett } from '@/components/Zeichenbrett';
import { MERKMAL_NAME, interpoliere, naechsteSpalte, pruefeSkizze, rundeAufRaster, spalten, type Skizze, type Skizzenurteil } from '@/lib/grafisch';
import { zahlTex, zahlText } from '@/lib/zahlen';

const stil = { highlight: false, fixed: true };
const RAND = 0.5;

interface Zustand {
  werte: (number | null)[];
  auswahl: number;
  urteile: Skizzenurteil['urteile'] | null;
  loesung: boolean;
  kurve: (x: number) => number;
}

interface Props {
  nummer: string;
  titel: string;
  skizze: Skizze;
  /** Aufgabentext. */
  children: ReactNode;
  /** Textalternative für K_f. */
  bildBeschreibung: string;
  hilfen: ReactNode[];
  loesung: ReactNode[];
}

/**
 * Aufgabe zum Skizzieren von K_f′: Oben steht K_f, unten setzen die Lernenden durch Tippen oder mit den Pfeiltasten in jeder Spalte einen Punkt.
 * Die Punkte werden glatt verbunden. „Prüfen“ vergleicht mit K_f′ und nennt die Spalten, die zu hoch oder zu tief liegen.
 * Eingaben bleiben im Browser und werden nicht gespeichert.
 */
export function Skizzenaufgabe({ nummer, titel, skizze: s, children, bildBeschreibung, hilfen, loesung }: Props) {
  const basis = useId();
  const xs = spalten(s);
  const [werte, setWerte] = useState<(number | null)[]>(() => xs.map(() => null));
  const [auswahl, setAuswahl] = useState(0);
  const [urteil, setUrteil] = useState<Skizzenurteil | null>(null);
  const [loesungAn, setLoesungAn] = useState(false);
  const [hilfeAnzahl, setHilfeAnzahl] = useState(0);
  const [schritte, setSchritte] = useState(0);

  const begrenze = (y: number) => Math.min(s.yMax, Math.max(s.yMin, rundeAufRaster(y)));
  const setze = (i: number, y: number | null) => {
    setWerte((w) => w.map((v, j) => (j === i ? (y === null ? null : begrenze(y)) : v)));
    setAuswahl(i);
    setUrteil(null);
  };
  const gesetzt = xs.map((x, i) => [x, werte[i]] as const).filter((p): p is readonly [number, number] => p[1] !== null && p[1] !== undefined);
  const kurve = interpoliere(gesetzt.map((p) => p[0]), gesetzt.map((p) => p[1]));
  const z: Zustand = { werte, auswahl, urteile: urteil?.urteile ?? null, loesung: loesungAn, kurve };

  /** JSXGraph hält das Ereignis click zurück, deshalb wird das Loslassen (pointerup) ausgewertet. Beim Scrollen mit dem Finger kommt pointercancel, dann wird nichts gesetzt. */
  const klick = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const brett = e.currentTarget.querySelector('.funktionsgraph');
    if (!brett) return;
    const r = brett.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const x = s.xMin - RAND + ((e.clientX - r.left) / r.width) * (s.xMax - s.xMin + 2 * RAND);
    const y = s.yMax - ((e.clientY - r.top) / r.height) * (s.yMax - s.yMin);
    setze(naechsteSpalte(s, x), y);
  };
  const taste = (e: KeyboardEvent<HTMLDivElement>) => {
    const schritt = { ArrowLeft: -1, ArrowRight: 1 }[e.key as 'ArrowLeft' | 'ArrowRight'];
    if (schritt) {
      e.preventDefault();
      setAuswahl((a) => Math.min(xs.length - 1, Math.max(0, a + schritt)));
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      setze(auswahl, (werte[auswahl] ?? 0) + (e.key === 'ArrowUp' ? 0.5 : -0.5));
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      setze(auswahl, null);
    }
  };
  const pruefen = () => setUrteil(pruefeSkizze(s, werte));
  const fehlend = werte.filter((v) => v === null).length;
  const xText = (x: number) => `x=${zahlTex(x)}`;

  return (
    <section className="aufgabe" aria-labelledby={`${basis}-titel`}>
      <h3 id={`${basis}-titel`}>
        Aufgabe {nummer}: {titel}
      </h3>
      <div className="aufgabe-text">{children}</div>
      <figure className="bild">
        <Messbild kurven={[{ f: s.f, farbe: ORANGE }]} bereich={[s.xMin - RAND, s.xMax + RAND, s.yFMin, s.yFMax]} teilung={1} yTeilung={1} beschreibung={bildBeschreibung} />
        <figcaption>
          Das Schaubild <Formel tex="K_f" nach="." />
        </figcaption>
      </figure>
      <p className="klein">
        Tippe oder klicke in das untere Schaubild. Der Punkt in der Spalte neben deiner Stelle springt auf die getippte Höhe (auf Viertel gerundet). Mit der Tabulatortaste erreichst du das Feld, dann wählen die Pfeiltasten links und rechts die Spalte und hoch und runter die Höhe. Die Entfernen-Taste löscht den Punkt.
      </p>
      <div
        className="skizzenfeld"
        tabIndex={0}
        role="group"
        aria-label={`Zeichenfeld für das Schaubild der Ableitungsfunktion mit ${xs.length} Spalten von x gleich ${zahlText(xs[0]!)} bis x gleich ${zahlText(xs[xs.length - 1]!)}`}
        onPointerUp={klick}
        onKeyDown={taste}
      >
        <Zeichenbrett
          bereich={[s.xMin - RAND, s.xMax + RAND, s.yMin, s.yMax]}
          xTeilung={1}
          yTeilung={1}
          xBeschriftung="zahl"
          className="brett-3zu2"
          beschreibung={`Zeichenfeld für K f Strich. ${gesetzt.length} von ${xs.length} Punkten gesetzt.${loesungAn ? ' Die richtige Kurve ist grün gestrichelt eingeblendet.' : ''}`}
          zustand={z}
          aufbau={(b, lies) => {
            xs.forEach((x) => b.create('segment', [[x, s.yMin], [x, s.yMax]], { ...stil, strokeColor: '#c3cddb', strokeWidth: 1, dash: 2 }));
            b.create('segment', [[() => xs[lies().auswahl]!, s.yMin], [() => xs[lies().auswahl]!, s.yMax]], { ...stil, strokeColor: BLAU, strokeWidth: 1.5, dash: 3 });
            const richtig = b.create('functiongraph', [(t: number) => s.df(t), s.xMin, s.xMax], { ...stil, strokeColor: GRUEN, strokeWidth: 3, dash: 3, visible: false });
            b.create('functiongraph', [(t: number) => lies().kurve(t)], { ...stil, strokeColor: BLAU, strokeWidth: 3 });
            const punkte = xs.map((x, i) => b.create('point', [x, () => lies().werte[i] ?? NaN], { ...stil, withLabel: false, face: 'o', size: 5, strokeColor: '#fff', fillColor: BLAU, visible: false }));
            return (zz: Zustand) => {
              richtig.setAttribute({ visible: zz.loesung });
              punkte.forEach((p, i) => {
                const u = zz.urteile?.[i];
                p.setAttribute({ visible: zz.werte[i] !== null && zz.werte[i] !== undefined, fillColor: u === 'ok' ? GRUEN : u === 'zuHoch' || u === 'zuTief' ? ORANGE : BLAU });
              });
            };
          }}
        />
      </div>
      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: BLAU }} aria-hidden="true" /> deine Skizze</li>
        <li><span className="legende-farbe" style={{ background: GRUEN }} aria-hidden="true" /> nach „Prüfen“ richtige Punkte, auf Wunsch die richtige Kurve (gestrichelt)</li>
        <li><span className="legende-farbe" style={{ background: ORANGE }} aria-hidden="true" /> nach „Prüfen“ Punkte, die nicht stimmen</li>
      </ul>
      <p className="klein" aria-live="polite">
        Gewählte Spalte: <Formel tex={xText(xs[auswahl]!)} nach="," /> {werte[auswahl] === null || werte[auswahl] === undefined ? 'noch kein Punkt.' : <>Höhe <Formel tex={zahlTex(werte[auswahl]!)} nach="." /></>}
      </p>
      <div className="aufgabe-knoepfe">
        <button type="button" className="knopf" onClick={pruefen}>Prüfen</button>
        <button type="button" className="knopf-zweit" aria-pressed={loesungAn} onClick={() => setLoesungAn((a) => !a)}>{loesungAn ? 'Richtige Kurve ausblenden' : 'Richtige Kurve einblenden'}</button>
        <button type="button" className="knopf-zweit" onClick={() => { setWerte(xs.map(() => null)); setUrteil(null); }}>Alle Punkte löschen</button>
      </div>
      <div role="status" className="aufgabe-ergebnis" style={{ display: 'block', marginTop: '0.5rem' }}>
        {urteil && !urteil.alleGesetzt && <p>Es fehlen noch {fehlend} Punkte. Setze in jeder Spalte einen Punkt, dann prüfe erneut.</p>}
        {urteil && urteil.alleGesetzt && (
          <>
            <p>
              {urteil.alleRichtig ? 'Alle Punkte liegen richtig. Deine Skizze stimmt mit dem Schaubild der Ableitungsfunktion überein.' : `${urteil.richtig} von ${xs.length} Punkten liegen richtig.`}
            </p>
            <ul className="liste">
              {s.stellen.map((st, i) => (
                <li key={i}>
                  Bei <Formel tex={xText(st.x)} /> ({MERKMAL_NAME[st.typ]}) muss <Formel tex="K_{f'}" /> die x-Achse treffen: {urteil.stellenGetroffen[i] ? 'getroffen.' : 'nicht getroffen.'}
                </li>
              ))}
              {urteil.urteile.map((u, i) =>
                u === 'zuHoch' || u === 'zuTief' ? (
                  <li key={`f${i}`}>
                    Bei <Formel tex={xText(xs[i]!)} /> liegt der Punkt zu {u === 'zuHoch' ? 'hoch' : 'tief'}.
                  </li>
                ) : null,
              )}
            </ul>
          </>
        )}
      </div>

      {hilfen.slice(0, hilfeAnzahl).map((h, i) => (
        <Hinweis key={i} titel={`Hilfe ${i + 1} von ${hilfen.length}`}>{h}</Hinweis>
      ))}
      {loesung.slice(0, schritte).map((l, i) => (
        <Hinweis key={i} art="merksatz" titel={`Lösungsschritt ${i + 1} von ${loesung.length}`}>{l}</Hinweis>
      ))}
      <div className="aufgabe-knoepfe">
        {hilfeAnzahl < hilfen.length && (
          <button type="button" className="knopf-zweit" onClick={() => setHilfeAnzahl((n) => n + 1)}>{hilfeAnzahl === 0 ? 'Hilfe anzeigen' : 'Weitere Hilfe anzeigen'}</button>
        )}
        {schritte < loesung.length && (
          <button type="button" className="knopf-zweit" onClick={() => setSchritte((n) => n + 1)}>{schritte === 0 ? 'Lösungsweg anzeigen' : 'Nächsten Lösungsschritt anzeigen'}</button>
        )}
      </div>
    </section>
  );
}
