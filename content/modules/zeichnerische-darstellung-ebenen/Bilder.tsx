import { ebeneImWuerfel, type Koordinatenform } from '@/lib/ebene';
import { vieleckBild } from '@/lib/ebenenhilfen';
import { FARBE } from '@/lib/ebenenbild';
import { geradeImWuerfel, KOORDINATENEBENEN, type Koordinatenebene } from '@/lib/gerade';
import { linienNamen, punkt, type BenannteLinie } from '@/lib/geradenbild';
import { wortKoordinaten } from '@/lib/laborhilfen';
import { EBENEN_TEXTFARBE, type EbenenArt, type Punkt3, type RaumBildSpec, type RaumFlaeche, type RaumLinie, type RaumPunkt } from '@/lib/schraegbild';
import { ausschnitt, SPURGERADE_NAME, spurgerade, spurpunkteEbene } from '@/lib/spur';
import { ebeneAusKoordinatenform, formWort } from '@/lib/spurhilfen';
import { ABSCHNITT, BEISPIEL, PARALLEL, URSPRUNG, ZEICHEN, type ZeichenBeispiel } from './daten';

export { punkt };
const imBild = (p: number[]) => p.every((c) => Math.abs(c) <= 4 + 1e-9);

export interface Zeige {
  /** 'ausschnitt': der Ausschnitt zum Zeichnen (Spurdreieck usw.), 'wuerfel': der Teil der Ebene im Koordinatensystem, null: keine Fläche. */
  flaeche?: 'ausschnitt' | 'wuerfel' | null;
  /** Spurpunkte S₁, S₂, S₃ beschriften. */
  spurpunkte?: boolean;
  /** Spurgeraden (Standard keine): alle oder nur die genannten Koordinatenebenen. */
  spurgeraden?: boolean | Koordinatenebene[];
  /** Zeichnen: Strecken aus dem Ausschnitt (zwischen den Spurpunkten). Labor: ganze Spurgeraden im Koordinatensystem. */
  modus?: 'zeichnen' | 'labor';
  /** Koordinatenebenen als durchsichtige Flächen. */
  koordinatenebenen?: EbenenArt[];
  /** Weitere beschriftete Punkte (zum Beispiel die Ecken des Ausschnitts). */
  extra?: RaumPunkt[];
}


/**
 * Raumbild einer Ebene in Koordinatenform: graue Fläche (Ausschnitt), die Spurpunkte als Punkte mit Namen auf den Achsen, die Spurgeraden als farbige Linien in der Farbe ihrer Koordinatenebene
 * (x₁x₂ blau, x₁x₃ grün, x₂x₃ gelborange) mit ihrem Namen dicht an der Linie. Feine Darstellung.
 */
export function ebenenBild(k: Koordinatenform, z: Zeige): { spec: RaumBildSpec; hatFlaeche: boolean } {
  const modus = z.modus ?? 'zeichnen';
  const a = ausschnitt(k);
  const waehle = (e: Koordinatenebene) => z.spurgeraden === true || (Array.isArray(z.spurgeraden) && z.spurgeraden.includes(e));
  const alleDrei = KOORDINATENEBENEN.every(waehle);

  // Fläche
  let flaechen: RaumFlaeche[] = [];
  let linien: RaumLinie[] = [];
  if (z.flaeche === 'ausschnitt' && a) {
    const v = vieleckBild(a.ecken, FARBE.grau, FARBE.grauRand, 0.3);
    flaechen = v.flaechen;
    linien = alleDrei && a.art === 'spurdreieck' ? [] : v.linien;
  } else if (z.flaeche === 'wuerfel') {
    const v = vieleckBild(ebeneImWuerfel(ebeneAusKoordinatenform(k)), FARBE.grau, FARBE.grauRand, 0.3);
    flaechen = v.flaechen;
    linien = v.linien;
  }

  // Spurpunkte
  const punkte: RaumPunkt[] = [];
  if (z.spurpunkte) {
    for (const s of spurpunkteEbene(k)) {
      if (!imBild(s.punkt)) continue;
      if (s.punkt.every((c) => c === 0)) {
        if (!punkte.some((p) => p.p.every((c) => c === 0))) punkte.push(punkt('O', [0, 0, 0]));
      } else punkte.push(punkt(s.name, s.punkt));
    }
  }

  punkte.push(...(z.extra ?? []));

  // Spurgeraden
  const benannt: BenannteLinie[] = [];
  for (const e of KOORDINATENEBENEN) {
    if (!waehle(e)) continue;
    let von: Punkt3 | null = null;
    let bis: Punkt3 | null = null;
    if (modus === 'zeichnen') {
      const s = a?.spur.find((x) => x.ebene === e);
      if (s) [von, bis] = [s.von, s.bis];
    } else {
      const g = spurgerade(k, e);
      const t = g.art === 'gerade' ? geradeImWuerfel(g.g) : null;
      if (t) [von, bis] = t;
    }
    if (!von || !bis) continue;
    linien.push({ von, bis, farbe: EBENEN_TEXTFARBE[e], breite: 3 });
    benannt.push({ strecke: [von, bis], name: SPURGERADE_NAME[e], farbe: EBENEN_TEXTFARBE[e] });
  }
  const texte = linienNamen(benannt, punkte);

  const teile = [`Schrägbild. Die graue Fläche ist ${z.flaeche === 'wuerfel' ? 'der Teil der Ebene im Koordinatensystem' : 'ein Ausschnitt der Ebene'} ${formWort(k)}.`];
  if (!flaechen.length) teile[0] = `Schrägbild des Koordinatensystems zur Ebene ${formWort(k)}.`;
  if (z.spurpunkte && punkte.length) teile.push('Die Spurpunkte liegen auf den Koordinatenachsen.');
  if (benannt.length) teile.push(`Farbige Linien sind die Spurgeraden ${benannt.map((b) => b.name).join(', ')} in den Koordinatenebenen.`);
  return {
    hatFlaeche: flaechen.length > 0,
    spec: {
      sprech: teile.join(' '),
      punkte: [...punkte, ...texte],
      linien,
      flaechen,
      ...(z.koordinatenebenen?.length ? { ebenen: z.koordinatenebenen } : {}),
      ebenenNamen: false,
      fein: true,
    },
  };
}

/* ---------- Zeichenlabor: die Schritte nacheinander ---------- */

/** Bild des Zeichenlabors nach `schritt` Schritten (0 bis 4): 3 Spurpunkte einzeichnen, 4 Spurgeraden zeichnen und das Spurdreieck schraffieren. Bis Schritt 2 wird nur gerechnet. */
export function zeichenBild(b: ZeichenBeispiel, schritt: number): RaumBildSpec {
  const { spec } = ebenenBild(b.k, { modus: 'zeichnen', spurpunkte: schritt >= 3, spurgeraden: schritt >= 4, flaeche: schritt >= 4 ? 'ausschnitt' : null });
  if (schritt < 3) return { ...spec, sprech: `Schrägbild des Koordinatensystems mit den drei Achsen, bisher ist nichts eingezeichnet. Gesucht ist die Ebene ${formWort(b.k)}.` };
  return spec;
}
export const ZEICHEN_START = ZEICHEN[0]!;

/** Das Bild zu einer Koordinatenform als Kontrollbild für Aufgaben (Ausschnitt, Spurpunkte, Spurgeraden). */
export const kontrollBild = (k: Koordinatenform): RaumBildSpec => ebenenBild(k, { modus: 'zeichnen', flaeche: 'ausschnitt', spurpunkte: true, spurgeraden: true }).spec;
/** Bild ohne Spurpunkte und Spurgeraden (nur der Ausschnitt), zum Beispiel für Aufgaben, in denen sie gesucht sind. */
export const nurFlaeche = (k: Koordinatenform): RaumBildSpec => ebenenBild(k, { modus: 'zeichnen', flaeche: 'ausschnitt' }).spec;
export const koordinaten = wortKoordinaten;

/* ---------- Bilder der Abschnitte ---------- */

/** Erklären: die Ebene des Beispiels mit Spurpunkten, Spurgeraden und Spurdreieck. */
export const RAUM_ERKLAEREN: RaumBildSpec = kontrollBild(BEISPIEL.k);
/** Vermutung 2: die Spurgerade s₁₂ in der x₁x₂-Ebene (hellblau), die übrigen Kanten des Spurdreiecks grau. */
export const RAUM_SPURGERADE: RaumBildSpec = ebenenBild(BEISPIEL.k, { flaeche: 'ausschnitt', spurpunkte: true, spurgeraden: ['e12'], koordinatenebenen: ['e12'] }).spec;
/** Vermutung 4: Ebene parallel zu einer Achse (Streifen) und parallel zu einer Koordinatenebene (Quadrat). */
export const RAUM_STREIFEN: RaumBildSpec = kontrollBild(PARALLEL.achse.k);
export const RAUM_QUADRAT: RaumBildSpec = kontrollBild(PARALLEL.ebene.k);
/** Vermutung 5: Ebene durch den Ursprung mit je einem Punkt auf den drei Spurgeraden. */
export const RAUM_URSPRUNG: RaumBildSpec = ebenenBild(URSPRUNG.k, {
  flaeche: 'ausschnitt',
  spurgeraden: true,
  extra: [punkt('A', URSPRUNG.punkte.s12), punkt('B', URSPRUNG.punkte.s13), punkt('C', URSPRUNG.punkte.s23)],
}).spec;
/** Vermutung 6: Ebene mit den Spurpunkten (3|0|0), (0|2|0), (0|0|4). */
export const RAUM_ABSCHNITT: RaumBildSpec = kontrollBild(ABSCHNITT.k);
