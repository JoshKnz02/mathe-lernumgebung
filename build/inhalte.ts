import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { InhaltsFehler, pruefeOderWirf } from '../src/lib/validierung.ts';
import type { Inhalt, RohInhalt } from '../src/lib/typen.ts';

function leseJson(pfad: string, relativ: string, fehler: string[]): unknown {
  try {
    return JSON.parse(readFileSync(pfad, 'utf8'));
  } catch (e) {
    fehler.push(`${relativ}: Datei nicht lesbar oder kein gültiges JSON (${e instanceof Error ? e.message : String(e)}).`);
    return undefined;
  }
}

/** Liest content/themen.json, content/modules/<id>/meta.json und courses/<id>.json. */
export function leseRohInhalt(root: string): { roh: RohInhalt; fehler: string[] } {
  const fehler: string[] = [];
  const themenDatei = 'content/themen.json';
  const modulWurzel = join(root, 'content/modules');
  const kursWurzel = join(root, 'courses');

  const roh: RohInhalt = {
    themen: { datei: themenDatei, daten: leseJson(join(root, themenDatei), themenDatei, fehler) },
    module: [],
    kurse: [],
  };
  if (existsSync(modulWurzel)) {
    for (const ordner of readdirSync(modulWurzel).sort()) {
      if (!statSync(join(modulWurzel, ordner)).isDirectory()) continue;
      const datei = `content/modules/${ordner}/meta.json`;
      roh.module.push({
        ordner,
        datei,
        daten: leseJson(join(modulWurzel, ordner, 'meta.json'), datei, fehler),
        hatIndex: existsSync(join(modulWurzel, ordner, 'index.tsx')),
      });
    }
  }
  if (existsSync(kursWurzel)) {
    for (const name of readdirSync(kursWurzel).filter((n) => n.endsWith('.json')).sort()) {
      const datei = `courses/${name}`;
      roh.kurse.push({ datei, daten: leseJson(join(kursWurzel, name), datei, fehler) });
    }
  }
  return { roh, fehler };
}

/**
 * Lädt und validiert alle Inhalte. Wirft InhaltsFehler bei Problemen.
 * produktion = true: Verweist ein Kurs auf einen Entwurf, schlägt das fehl.
 */
export function ladeInhalte(root: string, optionen: { produktion: boolean }): Inhalt {
  const { roh, fehler } = leseRohInhalt(root);
  if (fehler.length > 0) throw new InhaltsFehler(fehler);
  return pruefeOderWirf(roh, optionen);
}
