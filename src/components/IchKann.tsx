import { createContext, useCallback, useContext, useId, useMemo, useState, type ReactNode } from 'react';
import { Abschnitt } from './Abschnitt';
import { Abzeichen } from './Abzeichen';
import { Hinweis } from './Hinweis';
import { Modulverweis } from './Modulverweis';
import {
  WAHL_REIHENFOLGE,
  WAHL_TEXT,
  WAHL_ZEICHEN,
  kontrollSchluessel,
  kontrollStatus,
  nachDringlichkeit,
  zaehle,
  type Aussage,
  type Empfehlung,
  type Ergebnisse,
  type KontrollStatus,
  type Verweis,
  type Wahl,
} from '@/lib/ichkann';

/* ---------- Zustand: Selbsteinschätzung und Kontrollergebnisse ---------- */

interface ZustandWerte {
  wahl: Record<string, Wahl>;
  ergebnisse: Ergebnisse;
  setzeWahl: (aussageId: string, wahl: Wahl) => void;
  /** Meldet das Ergebnis eines Teils der Kontrollaufgabe. */
  melde: (aussageId: string, teil: string, richtig: boolean) => void;
  zuruecksetzen: () => void;
}

const ZustandKontext = createContext<ZustandWerte | null>(null);

/**
 * Hält Selbsteinschätzung und Kontrollergebnisse, solange die Seite geöffnet ist. Sie bleiben beim Wechsel zwischen den Abschnitten
 * erhalten. Nichts wird gespeichert oder gesendet, nach dem Neuladen der Seite ist alles leer.
 */
export function ZustandAnbieter({ children }: { children: ReactNode }) {
  const [wahl, setWahl] = useState<Record<string, Wahl>>({});
  const [ergebnisse, setErgebnisse] = useState<Ergebnisse>({});
  const setzeWahl = useCallback((id: string, w: Wahl) => setWahl((alt) => ({ ...alt, [id]: w })), []);
  const melde = useCallback((id: string, teil: string, richtig: boolean) => setErgebnisse((alt) => ({ ...alt, [kontrollSchluessel(id, teil)]: richtig })), []);
  const zuruecksetzen = useCallback(() => {
    setWahl({});
    setErgebnisse({});
  }, []);
  const wert = useMemo(() => ({ wahl, ergebnisse, setzeWahl, melde, zuruecksetzen }), [wahl, ergebnisse, setzeWahl, melde, zuruecksetzen]);
  return <ZustandKontext.Provider value={wert}>{children}</ZustandKontext.Provider>;
}

export function useIchKann(): ZustandWerte {
  const z = useContext(ZustandKontext);
  if (!z) throw new Error('useIchKann braucht den ZustandAnbieter');
  return z;
}

/* ---------- Verweise und Aussage ---------- */

/** Titel der Module und der Abschnitte, auf die die Aussagen verweisen. */
export interface Titel {
  modulTitel: Record<string, string>;
  abschnittTitel: Record<string, string>;
}

/** Verweise auf die passenden Abschnitte der Module, als Link, wenn der Kurs das Modul enthält. */
export function VerweiseListe({ verweise, modulTitel, abschnittTitel }: { verweise: Verweis[] } & Titel) {
  return (
    <ul className="ik-verweise">
      {verweise.map((v) => (
        <li key={`${v.modul}/${v.abschnitt}`}>
          <Modulverweis modul={v.modul} abschnitt={v.abschnitt}>
            {modulTitel[v.modul]}, {abschnittTitel[v.abschnitt]}
          </Modulverweis>
        </li>
      ))}
    </ul>
  );
}

/** Nur für Tests: Wenn true, sind alle Kontrollaufgaben von Anfang an geöffnet. */
export const KontrollenOffenKontext = createContext(false);

interface PunktProps extends Titel {
  aussage: Aussage;
  /** Kontrollaufgabe(n). Ohne Kinder gibt es keine Kontrollaufgabe. */
  children?: ReactNode;
}

/**
 * Eine Aussage der Ich-Kann-Liste: Nummer, Aussage, Selbsteinschätzung (++, 00, −−), Verweise auf die Module
 * und die Kontrollaufgabe, die erst nach Klick erscheint.
 */
export function IchKannPunkt({ aussage: a, modulTitel, abschnittTitel, children }: PunktProps) {
  const basis = useId();
  const { wahl, setzeWahl } = useIchKann();
  const [offen, setOffen] = useState(useContext(KontrollenOffenKontext));
  const aktuell = wahl[a.id];
  return (
    <section className="ik-punkt" data-wahl={aktuell ?? 'offen'} aria-labelledby={`${basis}-titel`}>
      <h3 id={`${basis}-titel`}>
        <span className="ik-nr">{a.nr}</span> Ich kann {a.text}
      </h3>
      <div className="abzeichen-zeile">
        <Abzeichen>Bildungsplan {a.bpe.join(', ')}</Abzeichen>
        {a.ergaenzt && <Abzeichen art="akzent">Ergänzt nach dem Bildungsplan</Abzeichen>}
      </div>
      <fieldset className="auswahl auswahl-reihe">
        <legend>Meine Einschätzung</legend>
        {WAHL_REIHENFOLGE.map((w) => (
          <label key={w} className="auswahl-option">
            <input type="radio" name={`${basis}-wahl`} value={w} checked={aktuell === w} onChange={() => setzeWahl(a.id, w)} />
            <span>
              <strong>{WAHL_ZEICHEN[w]}</strong> {WAHL_TEXT[w]}
            </span>
          </label>
        ))}
      </fieldset>
      <p className="ik-verweis-zeile">
        <strong>Dazu passt:</strong>
      </p>
      <VerweiseListe verweise={a.verweise} modulTitel={modulTitel} abschnittTitel={abschnittTitel} />
      {children && (
        <>
          <div className="aufgabe-knoepfe">
            <button type="button" className="knopf-zweit" aria-expanded={offen} aria-controls={`${basis}-kontrolle`} onClick={() => setOffen((o) => !o)}>
              {offen ? 'Kontrollaufgabe ausblenden' : 'Kontrollaufgabe anzeigen'}
            </button>
          </div>
          <div id={`${basis}-kontrolle`}>{offen && children}</div>
        </>
      )}
    </section>
  );
}

/* ---------- Auswertung ---------- */

const KONTROLLE_TEXT: Record<KontrollStatus, string> = {
  keine: 'Keine Kontrollaufgabe.',
  offen: 'Kontrollaufgabe noch nicht bearbeitet.',
  teilweise: 'Kontrollaufgabe teilweise bearbeitet.',
  richtig: 'Kontrollaufgabe richtig gelöst.',
  falsch: 'Kontrollaufgabe noch nicht richtig gelöst.',
};

function empfehlungsText(e: Empfehlung, status: KontrollStatus): ReactNode {
  const kontrolleRichtig = status === 'richtig';
  switch (e) {
    case 'zuerst':
      return kontrolleRichtig ? 'Du hast „−−“ gewählt, die Kontrollaufgabe war aber richtig. Vielleicht kannst du dir mehr zutrauen. Arbeite sonst die verlinkten Abschnitte durch.' : 'Hier solltest du anfangen. Arbeite die verlinkten Abschnitte durch und löse danach die Kontrollaufgabe.';
    case 'ueben':
      return kontrolleRichtig ? 'Du hast „00“ gewählt, die Kontrollaufgabe war richtig. Übe noch einige Aufgaben in den verlinkten Abschnitten.' : 'Übe diese Aussage in den verlinkten Abschnitten, bis du dir sicher bist.';
    case 'pruefen':
      return 'Du hast „++“ gewählt, aber die Kontrollaufgabe war noch nicht richtig. Schau dir die Lösung an und wiederhole in den verlinkten Abschnitten.';
    case 'einschaetzen':
      return 'Du hast diese Aussage noch nicht eingeschätzt.';
    case 'gut':
      return status === 'offen' ? 'Prüfe deine Einschätzung noch mit der Kontrollaufgabe.' : 'Das sieht gut aus. Wiederhole sie kurz vor der Klassenarbeit.';
  }
}

interface AuswertungProps extends Titel {
  aussagen: Aussage[];
  /** Wörter für „die vier Bereiche“ im Hinweis, wenn noch nichts eingeschätzt ist. */
  bereiche: string;
}

/** Abschnitt Auswertung: Aussagen nach Dringlichkeit mit Empfehlung und Verweisen auf die Module. */
export function IchKannAuswertung({ aussagen, bereiche, modulTitel, abschnittTitel }: AuswertungProps) {
  const { wahl, ergebnisse, zuruecksetzen } = useIchKann();
  const z = zaehle(aussagen, wahl);
  const liste = nachDringlichkeit(aussagen, wahl, ergebnisse);
  const bearbeitet = aussagen.filter((a) => kontrollStatus(a, ergebnisse) !== 'keine' && kontrollStatus(a, ergebnisse) !== 'offen');
  const richtig = bearbeitet.filter((a) => kontrollStatus(a, ergebnisse) === 'richtig');
  const eingeschaetzt = aussagen.length - z.offen;
  return (
    <Abschnitt id="auswertung" titel="Auswertung">
      <p>
        Die Auswertung ordnet alle Aussagen nach Dringlichkeit: zuerst „−−“, dann „00“, dann „++“ mit nicht richtiger Kontrollaufgabe, dann noch nicht eingeschätzte Aussagen, zuletzt Aussagen, die gut aussehen. Sie ändert sich mit deinen Einschätzungen und deinen Kontrollaufgaben.
      </p>
      <ul className="ik-fortschritt" aria-label="Zusammenfassung deiner Einschätzung">
        <li>
          Eingeschätzt: <strong>{eingeschaetzt}</strong> von {aussagen.length}
        </li>
        <li>
          {WAHL_ZEICHEN.sicher}: <strong>{z.sicher}</strong>
        </li>
        <li>
          {WAHL_ZEICHEN.ueben}: <strong>{z.ueben}</strong>
        </li>
        <li>
          {WAHL_ZEICHEN['noch-nicht']}: <strong>{z['noch-nicht']}</strong>
        </li>
        <li>
          Kontrollaufgaben richtig: <strong>{richtig.length}</strong> von {bearbeitet.length} bearbeiteten
        </li>
      </ul>
      {eingeschaetzt === 0 && (
        <Hinweis titel="Noch nichts eingeschätzt">
          Du hast noch keine Aussage eingeschätzt. Gehe zuerst {bereiche} durch. Danach zeigt dir diese Seite, was du zuerst üben solltest.
        </Hinweis>
      )}
      <ol className="ik-liste" aria-label="Aussagen nach Dringlichkeit">
        {liste.map(({ aussage: a, wahl: w, status, empfehlung: e }) => (
          <li key={a.id} data-empfehlung={e}>
            <p>
              <strong>
                {a.nr}. Ich kann {a.text}
              </strong>
            </p>
            <p>
              Einschätzung: <strong>{w ? WAHL_ZEICHEN[w] : 'keine'}</strong>. {KONTROLLE_TEXT[status]}
            </p>
            <p>{empfehlungsText(e, status)}</p>
            {e !== 'gut' && <VerweiseListe verweise={a.verweise} modulTitel={modulTitel} abschnittTitel={abschnittTitel} />}
          </li>
        ))}
      </ol>
      <div className="aufgabe-knoepfe">
        <button type="button" className="knopf-zweit" onClick={zuruecksetzen}>
          Alle Einschätzungen und Ergebnisse zurücksetzen
        </button>
      </div>
      <Hinweis titel="Zum Weiterarbeiten">
        Die Module im Überblick: {Object.entries(modulTitel).map(([id, titel], i) => (
          <span key={id}>
            {i > 0 && ', '}
            <Modulverweis modul={id}>{titel}</Modulverweis>
          </span>
        ))}
        .
      </Hinweis>
    </Abschnitt>
  );
}
