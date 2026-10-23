import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { lernumgebung } from './build/plugin.ts';

/** Stand der Vorschau: Branch, Commit und Bauzeit, damit sich erkennen lässt, welche Datei man vor sich hat. */
function bauInfo(): string {
  const git = (befehl: string) => {
    try {
      return execSync(`git ${befehl}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
      return '';
    }
  };
  const branch = git('rev-parse --abbrev-ref HEAD') || 'unbekannt';
  const commit = git('rev-parse --short HEAD');
  const geaendert = git('status --porcelain') !== '';
  const zeit = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short' });
  return `Stand: ${branch}${commit ? ` (${commit}${geaendert ? ', mit ungespeicherten Änderungen' : ''})` : ''}, gebaut am ${zeit}`;
}

/**
 * Modi:
 *  - production (npm run build): öffentlicher Build für GitHub Pages, ohne Entwürfe, Ausgabe in dist/
 *  - preview (npm run build:preview): Vorschau als eine HTML-Datei inkl. Entwürfen, Ausgabe in vorschau/ (nicht veröffentlichen)
 *  - development (npm run dev): lokale Entwicklung inkl. Entwürfen
 */
export default defineConfig(({ mode, command }) => {
  const produktion = mode === 'production';
  const vorschau = mode === 'preview';
  return {
    base: vorschau ? './' : command === 'build' ? (process.env.BASE_PATH ?? '/mathe-lernumgebung/') : '/',
    plugins: [react(), lernumgebung({ produktion, einzelDatei: vorschau })],
    define: {
      __ENTWUERFE__: JSON.stringify(!produktion),
      __HASH_ROUTING__: JSON.stringify(vorschau),
      __BAU_INFO__: JSON.stringify(produktion ? '' : bauInfo()),
    },
    resolve: {
      alias: [
        { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        // Das Paket schränkt seine Exporte ein, die Stylesheet-Datei wird deshalb direkt verlinkt.
        { find: 'jsxgraph-stile', replacement: fileURLToPath(new URL('./node_modules/jsxgraph/distrib/jsxgraph.css', import.meta.url)) },
      ],
    },
    build: {
      outDir: vorschau ? 'vorschau' : 'dist',
      emptyOutDir: true,
      ...(vorschau
        ? {
            assetsInlineLimit: Number.MAX_SAFE_INTEGER,
            cssCodeSplit: false,
            rollupOptions: { output: { inlineDynamicImports: true } },
          }
        : {}),
    },
    test: {
      include: ['tests/**/*.test.{ts,tsx}'],
      environment: 'node',
    },
  };
});
