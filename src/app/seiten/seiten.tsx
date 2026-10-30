import { Suspense, lazy, type ComponentType, type ReactNode } from 'react';
import { AbschnittAnbieter } from '@/components/Abschnitt';
import { Abzeichen } from '@/components/Abzeichen';
import { Hinweis } from '@/components/Hinweis';
import { Kachel } from '@/components/Kachel';
import { Karte } from '@/components/Karte';
import { Buch, Wiederholen, themaSymbol } from '@/components/Symbole';
import { ModulverweisAnbieter, type ModulAufloeser } from '@/components/Modulverweis';
import { aktiverAbschnitt, findeNachbarn, nummerierterTitel, themaVonModul, unterbereichVonModul, type KursNavigation } from '@/lib/navigation';
import type { Inhalt, Kurs, ModulMeta, Prinzip } from '@/lib/typen';
import { Link, type Route } from '../router';

export type ModulLader = (id: string) => Promise<{ default: ComponentType }>;

const PRINZIP_TEXT: Record<Prinzip, string> = { erklaeren: 'Erklären', entdecken: 'Entdecken', ueberpruefen: 'Überprüfen' };

function Prinzipien({ modul }: { modul: ModulMeta }) {
  if (!modul.prinzipien?.length) return null;
  return (
    <ul className="abzeichen-liste" aria-label="Didaktische Prinzipien">
      {modul.prinzipien.map((p) => (
        <li key={p}>
          <Abzeichen>{PRINZIP_TEXT[p]}</Abzeichen>
        </li>
      ))}
    </ul>
  );
}

function EntwurfMarke({ modul }: { modul: ModulMeta }) {
  return modul.status === 'entwurf' ? <Abzeichen art="warnung">Entwurf</Abzeichen> : null;
}

function Brotkrumen({ children }: { children: ReactNode }) {
  return (
    <nav aria-label="Pfad" className="brotkrumen">
      {children}
    </nav>
  );
}

export function Startseite({ kurse, zeigeKurse }: { kurse: Kurs[]; zeigeKurse: boolean }) {
  return (
    <>
      <header className="seitenkopf">
        <p className="seitenkopf-oben">Mathematik, Oberstufe</p>
        <h1>Mathe-Lernumgebung</h1>
        <p className="einleitung">Interaktive Ergänzung zum Mathematikunterricht der gymnasialen Oberstufe.</p>
      </header>
      {zeigeKurse ? (
        <>
          <h2 className="bereichstitel">Kurse (nur in der Vorschau sichtbar)</h2>
          <div className="kachelraster">
            {kurse.map((k) => (
              <Kachel key={k.id} zu={{ art: 'kurs', kurs: k.id }} titel={k.titel} text={k.beschreibung} symbol={<Buch />} meta="Kurs öffnen" />
            ))}
            <Kachel zu={{ art: 'bibliothek' }} titel="Modulbibliothek" text="Alle Module mit Status, auch Entwürfe." symbol={<Buch />} meta="Bibliothek öffnen" />
          </div>
        </>
      ) : (
        <Hinweis titel="Zugang">Die Inhalte erreichst du über den Link deines Kurses.</Hinweis>
      )}
    </>
  );
}

export function KursStart({ nav }: { nav: KursNavigation }) {
  const { kurs, themen, aktuell } = nav;
  return (
    <>
      <header className="seitenkopf">
        <p className="seitenkopf-oben">Kurs</p>
        <h1>{kurs.titel}</h1>
        {kurs.beschreibung && <p className="einleitung">{kurs.beschreibung}</p>}
      </header>
      {aktuell && (
        <section className="aktuell-karte" aria-labelledby="aktuell-titel">
          <p className="karten-kopf">Aktuell im Unterricht</p>
          <h2 id="aktuell-titel">{nummerierterTitel(nav, aktuell)}</h2>
          <p>{aktuell.beschreibung}</p>
          <Link className="knopf" zu={{ art: 'modul', kurs: kurs.id, modul: aktuell.id }}>
            Modul öffnen
          </Link>
        </section>
      )}
      <h2 className="bereichstitel">Themenbereiche</h2>
      <div className="kachelraster">
        {themen.map(({ thema, module }) => (
          <Kachel
            key={thema.id}
            zu={{ art: 'thema', kurs: kurs.id, thema: thema.id }}
            titel={thema.titel}
            text={thema.beschreibung}
            symbol={themaSymbol(thema.id)}
            meta={module.length === 1 ? '1 Modul' : `${module.length} Module`}
          />
        ))}
        <Kachel
          zu={{ art: 'wiederholen', kurs: kurs.id }}
          titel="Wiederholen und Üben"
          text="Die freigegebenen Module deines Kurses zum selbstständigen Wiederholen."
          symbol={<Wiederholen />}
          meta="Alle Module"
        />
      </div>
    </>
  );
}

function ModulKarte({ kursId, modul, titel, aktuell }: { kursId: string; modul: ModulMeta; titel: string; aktuell: boolean }) {
  return (
    <Kachel zu={{ art: 'modul', kurs: kursId, modul: modul.id }} titel={titel} text={modul.beschreibung} hervorgehoben={aktuell} meta={modul.abschnitte ? `${modul.abschnitte.length} Abschnitte` : 'Modul öffnen'}>
      <div className="abzeichen-zeile">
        {aktuell && <Abzeichen art="akzent">Aktuell im Unterricht</Abzeichen>}
        <EntwurfMarke modul={modul} />
        <Prinzipien modul={modul} />
      </div>
    </Kachel>
  );
}

const modulZahl = (n: number) => (n === 1 ? '1 Modul' : `${n} Module`);

export function ThemaSeite({ nav, themaId }: { nav: KursNavigation; themaId: string }) {
  const eintrag = nav.themen.find((t) => t.thema.id === themaId);
  if (!eintrag) return <NichtGefunden kursId={nav.kurs.id} />;
  const modulKarten = (liste: ModulMeta[]) =>
    liste.map((m) => <ModulKarte key={m.id} kursId={nav.kurs.id} modul={m} titel={nummerierterTitel(nav, m)} aktuell={nav.aktuell?.id === m.id} />);
  return (
    <>
      <Brotkrumen>
        <Link zu={{ art: 'kurs', kurs: nav.kurs.id }}>{nav.kurs.titel}</Link>
      </Brotkrumen>
      <h1>{eintrag.thema.titel}</h1>
      {eintrag.thema.beschreibung && <p className="einleitung">{eintrag.thema.beschreibung}</p>}
      {eintrag.unterbereiche.length === 0 ? (
        <div className="kachelraster">{modulKarten(eintrag.module)}</div>
      ) : (
        <>
          <h2 className="bereichstitel">Unterbereiche</h2>
          <div className="kachelraster">
            {eintrag.unterbereiche.map(({ unterbereich, module }) => (
              <Kachel
                key={unterbereich.id}
                zu={{ art: 'unterbereich', kurs: nav.kurs.id, thema: themaId, unterbereich: unterbereich.id }}
                titel={unterbereich.titel}
                text={unterbereich.beschreibung}
                symbol={themaSymbol(themaId)}
                meta={modulZahl(module.length)}
              />
            ))}
          </div>
          {eintrag.abschluss.length > 0 && (
            <>
              <h2 className="bereichstitel">Abschluss des Themenbereichs</h2>
              <div className="kachelraster">{modulKarten(eintrag.abschluss)}</div>
            </>
          )}
        </>
      )}
    </>
  );
}

export function UnterbereichSeite({ nav, themaId, unterbereichId }: { nav: KursNavigation; themaId: string; unterbereichId: string }) {
  const eintrag = nav.themen.find((t) => t.thema.id === themaId);
  const gruppe = eintrag?.unterbereiche.find((u) => u.unterbereich.id === unterbereichId);
  if (!eintrag || !gruppe) return <NichtGefunden kursId={nav.kurs.id} />;
  return (
    <>
      <Brotkrumen>
        <Link zu={{ art: 'kurs', kurs: nav.kurs.id }}>{nav.kurs.titel}</Link>
        <span aria-hidden="true"> / </span>
        <Link zu={{ art: 'thema', kurs: nav.kurs.id, thema: themaId }}>{eintrag.thema.titel}</Link>
      </Brotkrumen>
      <h1>{gruppe.unterbereich.titel}</h1>
      {gruppe.unterbereich.beschreibung && <p className="einleitung">{gruppe.unterbereich.beschreibung}</p>}
      <div className="kachelraster">
        {gruppe.module.map((m) => (
          <ModulKarte key={m.id} kursId={nav.kurs.id} modul={m} titel={nummerierterTitel(nav, m)} aktuell={nav.aktuell?.id === m.id} />
        ))}
      </div>
    </>
  );
}

const lazyCache = new Map<string, ComponentType>();

function modulKomponente(id: string, lader: ModulLader): ComponentType {
  let k = lazyCache.get(id);
  if (!k) {
    k = lazy(() => lader(id));
    lazyCache.set(id, k);
  }
  return k;
}

export function ModulInhalt({ id, lader, abschnitt }: { id: string; lader: ModulLader; abschnitt: string | null }) {
  const Modul = modulKomponente(id, lader);
  return (
    <AbschnittAnbieter value={abschnitt}>
      <Suspense fallback={<p role="status">Modul wird geladen …</p>}>
        <Modul />
      </Suspense>
    </AbschnittAnbieter>
  );
}

/** Abschnittsleiste: wählt den angezeigten Abschnitt (Erklären, Entdecken, ...). Nur bei Modulen mit Abschnitten. */
function Abschnittsleiste({ modul, aktiv, zu }: { modul: ModulMeta; aktiv: string; zu: (abschnitt: string) => Route }) {
  if (!modul.abschnitte) return null;
  return (
    <nav aria-label="Abschnitte des Moduls" className="abschnittsleiste">
      <ul>
        {modul.abschnitte.map((a) => (
          <li key={a.id}>
            <Link zu={zu(a.id)} aria-current={a.id === aktiv ? 'page' : undefined}>
              {a.titel}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Zurück und weiter zwischen den Abschnitten eines Moduls. */
function Abschnittsfolge({ modul, aktiv, zu }: { modul: ModulMeta; aktiv: string; zu: (abschnitt: string) => Route }) {
  const liste = modul.abschnitte;
  if (!liste) return null;
  const i = liste.findIndex((a) => a.id === aktiv);
  const zurueck = liste[i - 1];
  const weiter = liste[i + 1];
  if (!zurueck && !weiter) return null;
  return (
    <nav className="modul-folge abschnittsfolge" aria-label="Weitere Abschnitte">
      {zurueck ? <Link zu={zu(zurueck.id)}>← {zurueck.titel}</Link> : <span />}
      {weiter ? <Link className="knopf" zu={zu(weiter.id)}>Weiter: {weiter.titel} →</Link> : <span />}
    </nav>
  );
}

/** Modul mit Abschnittsleiste, gewähltem Abschnitt und Abschnittsfolge. abschnittId ist die Angabe aus der Adresse. */
function ModulMitAbschnitten({ modul, abschnittId, lader, zu, aufloeser }: { modul: ModulMeta; abschnittId?: string; lader: ModulLader; zu: (abschnitt: string | undefined) => Route; aufloeser: ModulAufloeser }) {
  const aktiv = aktiverAbschnitt(modul, abschnittId);
  const zuAbschnitt = (a: string) => zu(a);
  return (
    <>
      {aktiv !== null && <Abschnittsleiste modul={modul} aktiv={aktiv} zu={zuAbschnitt} />}
      <div className="modul-inhalt">
        <ModulverweisAnbieter value={aufloeser}>
          <ModulInhalt id={modul.id} lader={lader} abschnitt={aktiv} />
        </ModulverweisAnbieter>
      </div>
      {aktiv !== null && <Abschnittsfolge modul={modul} aktiv={aktiv} zu={zuAbschnitt} />}
    </>
  );
}

export function ModulSeite({ inhalt, nav, modulId, abschnittId, lader }: { inhalt: Inhalt; nav: KursNavigation; modulId: string; abschnittId?: string; lader: ModulLader }) {
  const modul = nav.themen.flatMap((t) => t.module).find((m) => m.id === modulId);
  if (!modul || (abschnittId !== undefined && aktiverAbschnitt(modul, abschnittId) === null)) return <NichtGefunden kursId={nav.kurs.id} />;
  const thema = themaVonModul(inhalt, modul);
  const unterbereich = unterbereichVonModul(nav, modul.id);
  const { zurueck, weiter } = findeNachbarn(nav, modul.id);
  return (
    <>
      <Brotkrumen>
        <Link zu={{ art: 'kurs', kurs: nav.kurs.id }}>{nav.kurs.titel}</Link>
        {thema && (
          <>
            <span aria-hidden="true"> / </span>
            <Link zu={{ art: 'thema', kurs: nav.kurs.id, thema: thema.id }}>{thema.titel}</Link>
          </>
        )}
        {thema && unterbereich && (
          <>
            <span aria-hidden="true"> / </span>
            <Link zu={{ art: 'unterbereich', kurs: nav.kurs.id, thema: thema.id, unterbereich: unterbereich.id }}>{unterbereich.titel}</Link>
          </>
        )}
      </Brotkrumen>
      <h1>{nummerierterTitel(nav, modul)}</h1>
      <div className="abzeichen-zeile">
        {nav.aktuell?.id === modul.id && <Abzeichen art="akzent">Aktuell im Unterricht</Abzeichen>}
        <EntwurfMarke modul={modul} />
      </div>
      <ModulMitAbschnitten
        modul={modul}
        abschnittId={abschnittId}
        lader={lader}
        zu={(a) => ({ art: 'modul', kurs: nav.kurs.id, modul: modul.id, ...(a ? { abschnitt: a } : {}) })}
        aufloeser={(id, abschnitt) => (nav.themen.some((t) => t.module.some((m) => m.id === id)) ? { art: 'modul', kurs: nav.kurs.id, modul: id, ...(abschnitt ? { abschnitt } : {}) } : null)}
      />
      <nav className="modul-folge" aria-label="Weitere Module">
        {zurueck ? <Link zu={{ art: 'modul', kurs: nav.kurs.id, modul: zurueck.id }}>← {nummerierterTitel(nav, zurueck)}</Link> : <span />}
        {weiter ? <Link zu={{ art: 'modul', kurs: nav.kurs.id, modul: weiter.id }}>{nummerierterTitel(nav, weiter)} →</Link> : <span />}
      </nav>
    </>
  );
}

export function WiederholenSeite({ nav }: { nav: KursNavigation }) {
  return (
    <>
      <Brotkrumen>
        <Link zu={{ art: 'kurs', kurs: nav.kurs.id }}>{nav.kurs.titel}</Link>
      </Brotkrumen>
      <h1>Wiederholen und Üben</h1>
      <p className="einleitung">
        Hier findest du alle für deinen Kurs freigegebenen Module nach Themenbereichen geordnet. Es sind dieselben Module wie im Unterricht.
      </p>
      {nav.themen.map(({ thema, module, unterbereiche, abschluss }) => {
        const liste = (ms: ModulMeta[]) => (
          <ul className="liste">
            {ms.map((m) => (
              <li key={m.id}>
                <Link zu={{ art: 'modul', kurs: nav.kurs.id, modul: m.id }}>{nummerierterTitel(nav, m)}</Link> <EntwurfMarke modul={m} />
              </li>
            ))}
          </ul>
        );
        return (
          <section key={thema.id} aria-labelledby={`wh-${thema.id}`}>
            <h2 id={`wh-${thema.id}`}>{thema.titel}</h2>
            {unterbereiche.length === 0 ? (
              liste(module)
            ) : (
              <>
                {unterbereiche.map((u) => (
                  <section key={u.unterbereich.id} aria-labelledby={`wh-${thema.id}-${u.unterbereich.id}`}>
                    <h3 id={`wh-${thema.id}-${u.unterbereich.id}`}>{u.unterbereich.titel}</h3>
                    {liste(u.module)}
                  </section>
                ))}
                {abschluss.length > 0 && liste(abschluss)}
              </>
            )}
          </section>
        );
      })}
      <Hinweis titel="In Vorbereitung">Kompetenzübersichten, Selbsttests und abiturorientierte Aufgaben folgen in späteren Ausbaustufen.</Hinweis>
    </>
  );
}

export function Bibliothek({ inhalt }: { inhalt: Inhalt }) {
  return (
    <>
      <h1>Modulbibliothek</h1>
      <p className="einleitung">Nur in der Vorschau. Zeigt alle Module unabhängig von Kursen, auch Entwürfe.</p>
      {inhalt.themen.map((t) => {
        const module = inhalt.module.filter((m) => m.thema === t.id);
        if (module.length === 0) return null;
        return (
          <section key={t.id}>
            <h2>{t.titel}</h2>
            <ul className="liste">
              {module.map((m) => (
                <li key={m.id}>
                  <Link zu={{ art: 'bibliothekModul', modul: m.id }}>{m.titel}</Link> <code>{m.id}</code>{' '}
                  <Abzeichen art={m.status === 'entwurf' ? 'warnung' : 'neutral'}>{m.status === 'entwurf' ? 'Entwurf' : 'Freigegeben'}</Abzeichen>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

export function BibliothekModul({ inhalt, modulId, abschnittId, lader }: { inhalt: Inhalt; modulId: string; abschnittId?: string; lader: ModulLader }) {
  const modul = inhalt.module.find((m) => m.id === modulId);
  if (!modul || (abschnittId !== undefined && aktiverAbschnitt(modul, abschnittId) === null)) return <NichtGefunden />;
  return (
    <>
      <Brotkrumen>
        <Link zu={{ art: 'bibliothek' }}>Modulbibliothek</Link>
      </Brotkrumen>
      <h1>{modul.titel}</h1>
      <div className="abzeichen-zeile">
        <EntwurfMarke modul={modul} />
      </div>
      <ModulMitAbschnitten
        modul={modul}
        abschnittId={abschnittId}
        lader={lader}
        zu={(a) => ({ art: 'bibliothekModul', modul: modul.id, ...(a ? { abschnitt: a } : {}) })}
        aufloeser={(id, abschnitt) => (inhalt.module.some((m) => m.id === id) ? { art: 'bibliothekModul', modul: id, ...(abschnitt ? { abschnitt } : {}) } : null)}
      />
    </>
  );
}

export function NichtGefunden({ kursId }: { kursId?: string }) {
  return (
    <>
      <h1>Seite nicht gefunden</h1>
      <p>Diese Seite gibt es nicht oder sie ist für deinen Kurs nicht freigegeben.</p>
      {kursId && (
        <p>
          <Link zu={{ art: 'kurs', kurs: kursId }}>Zur Kursstartseite</Link>
        </p>
      )}
    </>
  );
}
