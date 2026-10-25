import { useEffect, useId, useRef, useState } from 'react';
import { Abzeichen } from '@/components/Abzeichen';
import { aktiverAbschnitt, baueNavigation, nummerierterTitel, type KursNavigation } from '@/lib/navigation';
import type { Inhalt } from '@/lib/typen';
import { Link, erzeugePfad, useRoute, type Route } from './router';
import {
  Bibliothek,
  BibliothekModul,
  KursStart,
  ModulSeite,
  NichtGefunden,
  Startseite,
  ThemaSeite,
  WiederholenSeite,
  type ModulLader,
} from './seiten/seiten';

interface AppProps {
  inhalt: Inhalt;
  route: Route;
  /** Vorschau und Entwicklung: Entwürfe und Kursliste sichtbar. Im öffentlichen Build false. */
  entwuerfe: boolean;
  lader: ModulLader;
  /** Stand der Vorschau (Branch, Commit, Bauzeit), wird im Vorschau-Band angezeigt. */
  bauInfo?: string;
}

function seitenTitel(route: Route, nav: KursNavigation | null, inhalt: Inhalt): string {
  const kurs = nav?.kurs.titel;
  switch (route.art) {
    case 'thema':
      return `${inhalt.themen.find((t) => t.id === route.thema)?.titel ?? 'Thema'} – ${kurs ?? ''}`;
    case 'modul': {
      const modul = inhalt.module.find((m) => m.id === route.modul);
      const abschnitt = modul?.abschnitte?.find((a) => a.id === aktiverAbschnitt(modul, route.abschnitt))?.titel;
      const titel = modul && nav ? nummerierterTitel(nav, modul) : (modul?.titel ?? 'Modul');
      return `${titel}${abschnitt ? `: ${abschnitt}` : ''} – ${kurs ?? ''}`;
    }
    case 'wiederholen':
      return `Wiederholen und Üben – ${kurs ?? ''}`;
    case 'kurs':
      return kurs ?? 'Mathe-Lernumgebung';
    default:
      return 'Mathe-Lernumgebung';
  }
}

/** Pfeil für aufklappbare Gruppen, zeigt nach unten (offen) bzw. nach rechts (geschlossen) per CSS. */
const Pfeil = () => (
  <svg className="nav-pfeil" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

function KursNavigationsleiste({ nav, route }: { nav: KursNavigation; route: Route }) {
  const basis = useId();
  const aktuellesModul = route.art === 'modul' ? route.modul : null;
  const aktivesMeta = nav.themen.flatMap((t) => t.module).find((m) => m.id === aktuellesModul);
  const aktiverAbschnittId = aktivesMeta && route.art === 'modul' ? aktiverAbschnitt(aktivesMeta, route.abschnitt) : null;
  /** Thema, in dem die aktuelle Seite liegt (Themenseite oder Modul), sonst das Thema des aktuellen Unterrichtsmoduls. */
  const themaDerSeite = route.art === 'thema' ? route.thema : (nav.themen.find((t) => t.module.some((m) => m.id === aktuellesModul))?.thema.id ?? null);
  const startOffen = (id: string) => id === themaDerSeite || nav.themen.length === 1 || nav.themen.find((t) => t.thema.id === id)?.module.some((m) => m.id === nav.aktuell?.id) === true;
  const [offen, setOffen] = useState<Record<string, boolean>>(() => Object.fromEntries(nav.themen.map((t) => [t.thema.id, startOffen(t.thema.id)])));
  // Wer zu einer Seite eines Themas navigiert, sieht dort immer die Module. Von Hand zugeklappte Gruppen bleiben sonst zu.
  useEffect(() => {
    if (themaDerSeite) setOffen((o) => (o[themaDerSeite] ? o : { ...o, [themaDerSeite]: true }));
  }, [themaDerSeite]);
  return (
    <>
      <ul className="nav-liste nav-haupt">
        <li>
          <Link zu={{ art: 'kurs', kurs: nav.kurs.id }} aria-current={route.art === 'kurs' ? 'page' : undefined}>
            Kursstart
          </Link>
        </li>
      </ul>
      {nav.themen.map(({ thema, module }) => {
        const istOffen = offen[thema.id] ?? false;
        const listeId = `${basis}-${thema.id}`;
        return (
          <div key={thema.id} className="nav-gruppe">
            <p className="nav-ueberschrift">
              <button type="button" className="nav-umschalter" aria-expanded={istOffen} aria-controls={listeId} onClick={() => setOffen((o) => ({ ...o, [thema.id]: !istOffen }))}>
                <span>{thema.titel}</span>
                <Pfeil />
              </button>
            </p>
            <ul id={listeId} className="nav-liste" hidden={!istOffen}>
              <li>
                <Link zu={{ art: 'thema', kurs: nav.kurs.id, thema: thema.id }} aria-current={route.art === 'thema' && route.thema === thema.id ? 'page' : undefined}>
                  Übersicht
                </Link>
              </li>
              {module.map((m) => (
                <li key={m.id}>
                  <Link zu={{ art: 'modul', kurs: nav.kurs.id, modul: m.id }} aria-current={aktuellesModul === m.id && !aktiverAbschnittId ? 'page' : undefined}>
                    {nummerierterTitel(nav, m)}
                  </Link>
                  {nav.aktuell?.id === m.id && <span className="nav-marke">aktuell</span>}
                  {aktuellesModul === m.id && m.abschnitte && (
                    <ul className="nav-unterliste" aria-label={`Abschnitte von ${nummerierterTitel(nav, m)}`}>
                      {m.abschnitte.map((a) => (
                        <li key={a.id}>
                          <Link
                            zu={{ art: 'modul', kurs: nav.kurs.id, modul: m.id, abschnitt: a.id }}
                            aria-current={aktiverAbschnittId === a.id ? 'page' : undefined}
                          >
                            {a.titel}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <ul className="nav-liste nav-haupt nav-gruppe">
        <li>
          <Link zu={{ art: 'wiederholen', kurs: nav.kurs.id }} aria-current={route.art === 'wiederholen' ? 'page' : undefined}>
            Wiederholen und Üben
          </Link>
        </li>
      </ul>
    </>
  );
}

/** Reine Darstellung ohne Zugriff auf Browser oder Build-Konstanten, daher direkt testbar. */
export function AppInhalt({ inhalt, route, entwuerfe, lader, bauInfo }: AppProps) {
  const kursId = 'kurs' in route ? route.kurs : null;
  const nav = kursId ? baueNavigation(inhalt, kursId, { entwuerfe }) : null;
  const pfad = erzeugePfad(route);

  const [menueOffen, setMenueOffen] = useState(false);
  const hauptRef = useRef<HTMLElement>(null);
  const erster = useRef(true);
  useEffect(() => {
    setMenueOffen(false);
    document.title = `${seitenTitel(route, nav, inhalt)} – Mathe-Lernumgebung`.replace(/^ – /, '');
    if (erster.current) erster.current = false;
    else {
      hauptRef.current?.focus();
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pfad]);

  let seite;
  switch (route.art) {
    case 'start':
      seite = <Startseite kurse={inhalt.kurse} zeigeKurse={entwuerfe} />;
      break;
    case 'kurs':
      seite = nav ? <KursStart nav={nav} /> : <NichtGefunden />;
      break;
    case 'thema':
      seite = nav ? <ThemaSeite nav={nav} themaId={route.thema} /> : <NichtGefunden />;
      break;
    case 'modul':
      seite = nav ? <ModulSeite inhalt={inhalt} nav={nav} modulId={route.modul} abschnittId={route.abschnitt} lader={lader} /> : <NichtGefunden />;
      break;
    case 'wiederholen':
      seite = nav ? <WiederholenSeite nav={nav} /> : <NichtGefunden />;
      break;
    case 'bibliothek':
      seite = entwuerfe ? <Bibliothek inhalt={inhalt} /> : <NichtGefunden />;
      break;
    case 'bibliothekModul':
      seite = entwuerfe ? <BibliothekModul inhalt={inhalt} modulId={route.modul} abschnittId={route.abschnitt} lader={lader} /> : <NichtGefunden />;
      break;
    default:
      seite = <NichtGefunden />;
  }

  return (
    <div className="app">
      <a
        className="sprunglink"
        href="#inhalt"
        onClick={(e) => {
          e.preventDefault();
          hauptRef.current?.focus();
        }}
      >
        Zum Inhalt springen
      </a>
      <header className="kopf">
        <Link className="marke" zu={nav ? { art: 'kurs', kurs: nav.kurs.id } : { art: 'start' }}>
          Mathe-Lernumgebung
        </Link>
        <div className="kopf-rechts">
          {nav && <span className="kopf-kurs">{nav.kurs.titel}</span>}
          {nav && (
            <button type="button" className="menue-knopf" aria-expanded={menueOffen} aria-controls="kursnavigation" onClick={() => setMenueOffen((o) => !o)}>
              Menü
            </button>
          )}
        </div>
      </header>
      {entwuerfe && (
        <div className="vorschau-band" role="note">
          <Abzeichen art="warnung">Vorschau</Abzeichen> Diese Ansicht enthält Entwürfe und ist nicht veröffentlicht.
          {bauInfo && <span className="bau-info"> {bauInfo}</span>}
        </div>
      )}
      <div className={`rahmen${nav ? ' rahmen-mit-navigation' : ''}`}>
        {nav && (
          <nav id="kursnavigation" className={`navigation${menueOffen ? ' navigation-offen' : ''}`} aria-label="Kursnavigation">
            <KursNavigationsleiste nav={nav} route={route} />
          </nav>
        )}
        <main id="inhalt" ref={hauptRef} tabIndex={-1} className="inhalt">
          {seite}
        </main>
      </div>
    </div>
  );
}
