import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { ladeInhalte } from './inhalte.ts';
import type { Inhalt } from '../src/lib/typen.ts';
import { erzeugeVorschauKurs } from '../src/lib/vorschau.ts';
import { inhaltFuerVeroeffentlichung } from '../src/lib/veroeffentlichung.ts';

const VIRTUELL = 'virtual:lernumgebung';
const AUFGELOEST = '\0' + VIRTUELL;

export interface PluginOptionen {
  /** true: Entwürfe werden aus dem Build ausgeschlossen, Verweise auf Entwürfe lassen den Build fehlschlagen. */
  produktion: boolean;
  /** true: Ergebnis wird als eine einzige HTML-Datei ausgegeben (Vorschau). */
  einzelDatei: boolean;
}

/** Pfade aller Seiten, die im Produktions-Build eine eigene HTML-Datei bekommen. */
export function seitenPfade(inhalt: Inhalt): { pfad: string; titel: string }[] {
  const seiten: { pfad: string; titel: string }[] = [];
  for (const kurs of inhalt.kurse) {
    const basis = `kurs/${kurs.id}`;
    seiten.push({ pfad: basis, titel: kurs.titel });
    seiten.push({ pfad: `${basis}/wiederholen`, titel: `Wiederholen und Üben – ${kurs.titel}` });
    for (const t of kurs.themen) seiten.push({ pfad: `${basis}/thema/${t}`, titel: kurs.titel });
    for (const id of kurs.module) {
      seiten.push({ pfad: `${basis}/modul/${id}`, titel: kurs.titel });
      for (const a of inhalt.module.find((m) => m.id === id)?.abschnitte ?? []) seiten.push({ pfad: `${basis}/modul/${id}/${a.id}`, titel: kurs.titel });
    }
  }
  return seiten;
}

const maskiereHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/**
 * Stellt das Modulregister bereit (virtuelles Modul "virtual:lernumgebung"), lässt im Produktions-Build
 * alle Entwürfe weg, erzeugt je Kurs eigene Startseiten samt 404.html und kann eine Einzeldatei-Vorschau ausgeben.
 */
export function lernumgebung(optionen: PluginOptionen): Plugin {
  let root = process.cwd();
  let inhalt: Inhalt | undefined;

  const lade = () => (inhalt = ladeInhalte(root, { produktion: optionen.produktion }));

  return {
    name: 'lernumgebung',
    enforce: 'pre',
    configResolved(config) {
      root = config.root;
    },
    buildStart() {
      lade();
    },
    resolveId(id) {
      return id === VIRTUELL ? AUFGELOEST : undefined;
    },
    load(id) {
      if (id !== AUFGELOEST) return undefined;
      const daten = lade();
      // Im öffentlichen Build erscheinen nur Kurse ohne nurVorschau und nur deren freigegebene Module (weder Metadaten noch Code anderer Module).
      // In Vorschau und Entwicklung kommt ein Kurs mit allen Modulen hinzu.
      const ausgabe: Inhalt = optionen.produktion
        ? inhaltFuerVeroeffentlichung(daten)
        : { ...daten, kurse: [erzeugeVorschauKurs({ themen: daten.themen, module: daten.module }), ...daten.kurse] };
      const module = ausgabe.module;
      const lader = module
        .map((m) => `  ${JSON.stringify(m.id)}: () => import(${JSON.stringify(`/content/modules/${m.id}/index.tsx`)}),`)
        .join('\n');
      return [
        `export const inhalt = ${JSON.stringify(ausgabe)};`,
        `const lader = {\n${lader}\n};`,
        `export function ladeModul(id) {`,
        `  const l = Object.hasOwn(lader, id) ? lader[id] : undefined;`,
        `  return l ? l() : Promise.reject(new Error('Unbekanntes Modul: ' + id));`,
        `}`,
      ].join('\n');
    },
    configureServer(server) {
      const neuLaden = (datei: string) => {
        if (!/[\\/](content|courses)[\\/]/.test(datei) || !/\.(json|tsx)$/.test(datei)) return;
        const mod = server.moduleGraph.getModuleById(AUFGELOEST);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('change', neuLaden).on('add', neuLaden).on('unlink', neuLaden);
    },
    // Läuft nach Vites eigener HTML-Erzeugung, damit index.html im Bundle vorliegt.
    transform(code, id) {
      // KaTeX liefert jede Schrift als woff2, woff und ttf. Alle unterstützten Browser laden woff2, die übrigen Formate entfallen.
      if (!/katex\.min\.css(\?|$)/.test(id)) return undefined;
      return { code: code.replace(/,url\([^)]*\.(?:woff|ttf)\) format\("[^"]*"\)/g, ''), map: null };
    },
    generateBundle: { order: 'post', handler(_, bundle) {
      const html = bundle['index.html'];
      if (!html || html.type !== 'asset') return;
      let quelle = String(html.source);
      const daten = optionen.produktion ? inhaltFuerVeroeffentlichung(inhalt ?? lade()) : (inhalt ?? lade());

      if (optionen.einzelDatei) {
        // Alle JS- und CSS-Dateien in die HTML-Datei einbetten.
        for (const [name, datei] of Object.entries(bundle)) {
          if (name === 'index.html') continue;
          if (datei.type === 'chunk' && name.endsWith('.js')) {
            const muster = new RegExp(`<script[^>]*src="[^"]*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*></script>`);
            if (muster.test(quelle)) {
              quelle = quelle.replace(muster, () => `<script type="module">${datei.code.replace(/<\/script/gi, '<\\/script')}</script>`);
              delete bundle[name];
            }
          } else if (datei.type === 'asset' && name.endsWith('.css')) {
            const muster = new RegExp(`<link[^>]*href="[^"]*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`);
            if (muster.test(quelle)) {
              quelle = quelle.replace(muster, () => `<style>${String(datei.source)}</style>`);
              delete bundle[name];
            }
          }
        }
        this.emitFile({ type: 'asset', fileName: 'mathe-lernumgebung-vorschau.html', source: quelle });
        delete bundle['index.html'];
        return;
      }

      // Pages-Build: eigene Startseite je Kurs und Unterseite, dazu 404.html (gleiche App, Weiterleitung innerhalb der App).
      const mitTitel = (titel: string) =>
        quelle.replace(/<title>.*?<\/title>/, `<title>${maskiereHtml(titel)} – Mathe-Lernumgebung</title>`);
      for (const seite of seitenPfade(daten)) {
        this.emitFile({ type: 'asset', fileName: `${seite.pfad}/index.html`, source: mitTitel(seite.titel) });
      }
      this.emitFile({ type: 'asset', fileName: '404.html', source: mitTitel('Seite nicht gefunden') });
    } },
  };
}
