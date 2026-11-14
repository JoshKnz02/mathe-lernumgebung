import { writeFileSync } from 'node:fs';
import type { ComponentType, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import themen from '../content/themen.json';

vi.setConfig({ testTimeout: 120000 });

/* Aufgaben, Auswahlfragen und aufklappbare Teile zeigen im Test alles, damit auch Hilfen, Lösungsschritte, Rückmeldungen und Kontrollbilder geprüft werden. */
vi.mock('../src/components/Aufgabe', () => ({
  Aufgabe: (p: { children: ReactNode; hilfen: ReactNode[]; loesung: ReactNode[]; felder: { beschriftung: ReactNode }[] }) => (
    <div>{p.children}{p.felder.map((f, i) => <div key={`f${i}`}>{f.beschriftung}</div>)}{p.hilfen.map((h, i) => <div key={`h${i}`}>{h}</div>)}{p.loesung.map((h, i) => <div key={`l${i}`}>{h}</div>)}</div>
  ),
}));
vi.mock('../src/components/Auswahlfrage', () => ({
  Auswahlfrage: (p: { children: ReactNode; optionen: { text: ReactNode; rueckmeldung: ReactNode }[]; erklaerung: ReactNode }) => (
    <div>{p.children}{p.optionen.map((o, i) => <div key={`o${i}`}>{o.text}{o.rueckmeldung}</div>)}{p.erklaerung}</div>
  ),
}));
vi.mock('../src/components/AufKlick', () => ({ AufKlick: (p: { children: ReactNode }) => <div>{p.children}</div> }));

const module = import.meta.glob<{ default: ComponentType }>('../content/modules/*/index.tsx', { eager: true });
const texteAusHtml = (html: string): string[] => [...html.matchAll(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/g)].map((m) => m[1]!.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&#x27;/g, "'"));
const rendern = (): [string, string][] => Object.entries(module).map(([pfad, m]) => [pfad.split('/')[3]!, renderToStaticMarkup(<m.default />)]);

describe('Regeln für alle Module (Vorgabe der Lehrkraft, 13.11.2026)', () => {
  it('Kreuzprodukt: Überall, wo vom Vektorprodukt die Rede ist, steht (Kreuzprodukt)', () => {
    const fehler: string[] = [];
    for (const [id, html] of rendern()) {
      const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
      for (const m of text.matchAll(/.{0,40}Vektorprodukts?(?![a-zäöüß])(?! \(Kreuzprodukt\)).{0,30}/g)) fehler.push(`${id}: ${m[0]}`);
    }
    // Titel und Beschreibungen der Module und Themenbereiche
    const meta = import.meta.glob<{ default: unknown }>('../content/modules/*/meta.json', { eager: true });
    for (const [pfad, m] of Object.entries({ ...meta, '../content/themen.json': themen })) for (const x of JSON.stringify((m as { default?: unknown }).default ?? m).matchAll(/.{0,40}Vektorprodukts?(?![a-zäöüß])(?! \(Kreuzprodukt\)).{0,30}/g)) fehler.push(`${pfad}: ${x[0]}`);
    if (process.env.REGELN_LOG) writeFileSync(process.env.REGELN_LOG + '.kreuz', fehler.join('\n'));
    expect(fehler).toEqual([]);
  });
  it('Umbruch: Fortsetzungszeilen beginnen nie mit {}+, {}- oder {}\\cdot (Ausnahme: Gleichung einer Geraden oder Ebene vor + t · u, + r · u, + s · v)', () => {
    const fehler: string[] = [];
    for (const [id, html] of rendern()) {
      for (const tex of texteAusHtml(html)) {
        for (const m of tex.matchAll(/(?:^|\\\\|\\begin\{gathered\})\s*\{\}(\+|-|\\cdot)(.{0,30})/g)) {
          const erlaubt = /^(?:[rstk]|[rs]_\d|\\lambda|\\mu|\\nu)\\cdot ?(?:\\begin\{pmatrix\}|\\vec|\\overrightarrow)/.test(m[2]!) && /^(\\begin\{gathered\})?[A-Za-z_0-9{}']*:\\ \\vec\{x\}=/.test(tex);
          if (!erlaubt) fehler.push(`${id}: ${process.env.REGELN_VOLL ? tex : tex.slice(Math.max(0, m.index! - 30), m.index! + 50)}`);
        }
      }
    }
    if (process.env.REGELN_LOG) writeFileSync(process.env.REGELN_LOG + '.umbruch', fehler.join('\n'));
    expect(fehler).toEqual([]);
  });
  it('Die Übungsmodule im Abiturstil verlinken die Seite des Landes (neuer Tab, noopener), Weitere Module nicht', () => {
    const mit = ['uebungsaufgaben-abiturstil', 'uebungsaufgaben-integralrechnung', 'uebungsaufgaben-vektoren', 'uebungsaufgaben-geraden', 'uebungsaufgaben-ebenen', 'uebungsaufgaben-lgs'];
    for (const [id, html] of rendern()) {
      const hat = html.includes('schule-bw.de/faecher-und-schularten/berufliche-schularten/berufliches-gymnasium-oberstufe');
      expect(hat, id).toBe(mit.includes(id));
      if (hat) expect(html, id).toMatch(/<a href="https:\/\/www\.schule-bw\.de[^"]*musterpruefungen" target="_blank" rel="noopener noreferrer">/);
    }
  });
  it('funktionsterme-aufstellen verweist auf die LGS-Module', () => {
    const quellen = Object.values(import.meta.glob('../content/modules/funktionsterme-aufstellen/*.tsx', { eager: true, query: '?raw', import: 'default' })).join('\n');
    for (const m of ['gauss-algorithmus', 'loesbarkeit-lgs', 'uebungsaufgaben-lgs']) expect(quellen, m).toContain(`modul="${m}"`);
  });
});
