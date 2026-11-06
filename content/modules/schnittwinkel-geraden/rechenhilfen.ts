/**
 * Rechenhilfen für Winkel: Skalarprodukt, Beträge, Winkelformeln und Projektionen als TeX, einzeilig und in kurzen Zeilen für schmale Fenster.
 * Zeilenumbrüche stehen nur vor einem Gleichheitszeichen (Vorgabe der Lehrkraft, 07.11.2026). Alle Rechnungen im Text entstehen aus den Zahlen in `daten.ts`.
 */
import { NULL_KOORDINATE, projektionVektor, schnittwinkel, type Koordinatenebene } from '@/lib/gerade';
import { betragZeilen, bruch, quadratzahl, rund2, rundN, wurzelTeX, zeilenFormel, type Zeilen } from '@/lib/geradenhilfen';
import { klammer, spalte } from '@/lib/laborhilfen';
import { zt } from '@/lib/modulhilfen';
import { betrag, skalarprodukt, winkel } from '@/lib/vektor';

export { betragZeilen, gl, glSchmal, quadratzahl, rund2, rundN, wurzelTeX, zeilenFormel, type Zeilen } from '@/lib/geradenhilfen';

/** Winkel in Grad als TeX, zwei Nachkommastellen. */
export const gradTeX = (w: number): string => {
  const r = Math.round(w * 100) / 100;
  // Ein gerundeter Winkel wie 59,0° bekommt die Nachkommastelle, damit er nicht wie eine ganze Zahl wirkt (ein exakter Wert wie 90° bleibt ohne)
  return `${Number.isInteger(r) && Math.abs(w - r) > 1e-9 ? `${r}{,}0` : zt(r)}^{\\circ}`;
};
/** Name der Koordinatenebene in TeX und in Text. */
export const EBENE_TEX: Record<Koordinatenebene, string> = { e12: 'x_1x_2', e13: 'x_1x_3', e23: 'x_2x_3' };
export const EBENE_TEXT: Record<Koordinatenebene, string> = { e12: 'x₁x₂', e13: 'x₁x₃', e23: 'x₂x₃' };
/** Index der Koordinate, die in der Ebene 0 ist, 1-basiert für die Anzeige (e12: 3). */
export const SENKRECHT_NR = (e: Koordinatenebene): number => NULL_KOORDINATE[e] + 1;

/** Skalarprodukt u · v mit den einzelnen Produkten (schmal: jedes Produkt eine eigene Gleichung). */
export function skalarZeilen(u: number[], v: number[], nu = '\\vec{u}', nv = '\\vec{v}'): Zeilen {
  const produkte = u.map((ui, i) => `${klammer(ui)}\\cdot${klammer(v[i]!)}`);
  const einzeln = u.map((ui, i) => zt(ui * v[i]!));
  const summe = einzeln.map((e, i) => (i === 0 || e.startsWith('-') ? e : `+${e}`)).join('');
  const sk = skalarprodukt(u, v);
  return {
    tex: `${nu}\\cdot${nv}=${produkte.join('+')}=${summe}=${zt(sk)}`,
    schmal: `\\begin{gathered}${[...produkte.flatMap((p, i) => [p, `{}=${einzeln[i]}`]), `${nu}\\cdot${nv}`, `{}=${summe}`, `{}=${zt(sk)}`].join('\\\\')}\\end{gathered}`,
  };
}

/** Bruch als TeX aus ganzen Zahlen, gekürzt (Vorzeichen im Zähler). */
function kuerzen(z: number, n: number): string {
  const g = (a: number, b: number): number => (b === 0 ? Math.abs(a) : g(b, a % b));
  const d = g(z, n) || 1;
  const zz = z / d;
  const nn = n / d;
  return nn === 1 ? String(zz) : `${zz < 0 ? '-' : ''}\\frac{${Math.abs(zz)}}{${nn}}`;
}

/**
 * Winkel zwischen zwei Vektoren φ (0° bis 180°): cos φ = u · v / (|u| |v|). Sind beide Beträge ganze Zahlen, steht der gekürzte Bruch dort, sonst die Wurzeln.
 */
export function phiZeilen(u: number[], v: number[]): Zeilen {
  const sk = skalarprodukt(u, v);
  const uu = skalarprodukt(u, u);
  const vv = skalarprodukt(v, v);
  const phi = winkel(u, v)!;
  const ganz = quadratzahl(uu) && quadratzahl(vv);
  const nenner = `${wurzelTeX(uu)}\\cdot${wurzelTeX(vv)}`;
  const wert = ganz ? kuerzen(sk, Math.sqrt(uu) * Math.sqrt(vv)) : `\\frac{${sk}}{${nenner}}`;
  const bruchStufe = `\\frac{${zt(sk)}}{${nenner}}`;
  const cosZeile = ganz ? `\\cos\\varphi=${bruchStufe}=${wert}` : `\\cos\\varphi=${bruchStufe}`;
  const phiZeile = `\\varphi=\\cos^{-1}\\left(${wert}\\right)\\approx ${gradTeX(phi)}`;
  return {
    tex: `${cosZeile},\\ \\ ${phiZeile}`,
    schmal: `\\begin{gathered}${['\\cos\\varphi', `{}=${bruchStufe}`, ...(ganz ? [`{}=${wert}`] : []), '\\varphi', `{}=\\cos^{-1}\\left(${wert}\\right)`, `{}\\approx ${gradTeX(phi)}`].join('\\\\')}\\end{gathered}`,
  };
}

/** Schnittwinkel α der Richtungsvektoren: cos α = |u · v| / (|u| |v|), α = cos⁻¹ davon. */
export function alphaZeilen(u: number[], v: number[]): Zeilen {
  const sk = Math.abs(skalarprodukt(u, v));
  const uu = skalarprodukt(u, u);
  const vv = skalarprodukt(v, v);
  const a = schnittwinkel(u, v);
  const ganz = quadratzahl(uu) && quadratzahl(vv);
  const nenner = `${wurzelTeX(uu)}\\cdot${wurzelTeX(vv)}`;
  const wert = ganz ? kuerzen(sk, Math.sqrt(uu) * Math.sqrt(vv)) : `\\frac{${sk}}{${nenner}}`;
  const mitBetrag = `\\frac{|${zt(skalarprodukt(u, v))}|}{${nenner}}`;
  return {
    tex: `\\cos\\alpha=${mitBetrag}=${ganz ? wert : `\\frac{${sk}}{${nenner}}`},\\ \\ \\alpha=\\cos^{-1}\\left(${wert}\\right)\\approx ${gradTeX(a)}`,
    schmal: `\\begin{gathered}${['\\cos\\alpha', `{}=${mitBetrag}`, ...(ganz ? [`{}=${wert}`] : []), '\\alpha', `{}=\\cos^{-1}\\left(${wert}\\right)`, `{}\\approx ${gradTeX(a)}`].join('\\\\')}\\end{gathered}`,
  };
}

/** Projektionsvektor u₁₂ usw. als Gleichung, zum Beispiel u₁₂ = (3 | −2 | 0). */
export const projektionGleichung = (u: number[], e: Koordinatenebene): string => `\\vec{u}_{${e.slice(1)}}=${spalte(projektionVektor(u, e))}`;

/**
 * Winkel einer Geraden mit einer Koordinatenebene über die Projektion (Weg 1): u · u′, |u′| und cos α. Der Zähler ist positiv (u · u′ = |u′|²).
 * schmal: kurze Zeilen mit einzeln ausgerechneten Produkten.
 */
export function projektionsRechnung(u: number[], e: Koordinatenebene): { vektor: Zeilen; produkt: Zeilen; betrag: Zeilen; winkel: Zeilen; alpha: number } {
  const p = projektionVektor(u, e);
  const nm = `\\vec{u}_{${e.slice(1)}}`;
  const sk = skalarprodukt(u, p);
  const uu = skalarprodukt(u, u);
  const pp = skalarprodukt(p, p);
  const alpha = schnittwinkel(u, p);
  const nenner = `${wurzelTeX(uu)}\\cdot${wurzelTeX(pp)}`;
  const gekuerzt = quadratzahl(uu) && quadratzahl(pp);
  const wert = gekuerzt ? kuerzen(sk, Math.sqrt(uu) * Math.sqrt(pp)) : `\\frac{${sk}}{${nenner}}`;
  const wZeile = `\\cos\\alpha=\\frac{${sk}}{${nenner}}`;
  return {
    vektor: zeilenFormel([`${nm}=${spalte(p)}`]),
    produkt: skalarZeilen(u, p, '\\vec{u}', nm),
    betrag: betragZeilen(p, nm),
    winkel: {
      tex: `${wZeile}${gekuerzt ? `=${wert}` : `\\approx ${rundN(sk / Math.sqrt(uu * pp), 4)}`},\\ \\ \\alpha=\\cos^{-1}\\left(${gekuerzt ? wert : rundN(sk / Math.sqrt(uu * pp), 4)}\\right)\\approx ${gradTeX(alpha)}`,
      schmal: `\\begin{gathered}${['\\cos\\alpha', `{}=\\frac{${sk}}{${nenner}}`, `{}\\approx ${rundN(sk / Math.sqrt(uu * pp), 4)}`, '\\alpha', `{}=\\cos^{-1}(${rundN(sk / Math.sqrt(uu * pp), 4)})`, `{}\\approx ${gradTeX(alpha)}`].join('\\\\')}\\end{gathered}`,
    },
    alpha,
  };
}

/** Winkel über den senkrechten Vektor (Weg 2): sin α = |u_i| / |u|. */
export function sinusRechnung(u: number[], e: Koordinatenebene): { zeilen: Zeilen; alpha: number } {
  const i = NULL_KOORDINATE[e];
  const uu = skalarprodukt(u, u);
  const wert = Math.abs(u[i]!) / Math.sqrt(uu);
  const gek = quadratzahl(uu) ? kuerzen(Math.abs(u[i]!), Math.sqrt(uu)) : `\\frac{${Math.abs(u[i]!)}}{${wurzelTeX(uu)}}`;
  const alpha = Math.round((Math.asin(wert) * 18000) / Math.PI) / 100;
  const sinZeile = `\\sin\\alpha=\\frac{|${zt(u[i]!)}|}{|\\vec{u}|}=\\frac{${Math.abs(u[i]!)}}{${wurzelTeX(uu)}}`;
  const wertTex = quadratzahl(uu) ? gek : rundN(wert, 4);
  return {
    zeilen: {
      tex: `${sinZeile}${quadratzahl(uu) ? (gek === `\\frac{${Math.abs(u[i]!)}}{${Math.sqrt(uu)}}` ? '' : `=${gek}`) : `\\approx ${rundN(wert, 4)}`},\\ \\ \\alpha=\\sin^{-1}\\left(${wertTex}\\right)\\approx ${gradTeX(alpha)}`,
      schmal: `\\begin{gathered}${['\\sin\\alpha', `{}=\\frac{|${zt(u[i]!)}|}{|\\vec{u}|}`, `{}=\\frac{${Math.abs(u[i]!)}}{${wurzelTeX(uu)}}`, ...(quadratzahl(uu) ? [] : [`{}\\approx ${rundN(wert, 4)}`]), '\\alpha', `{}=\\sin^{-1}(${wertTex})`, `{}\\approx ${gradTeX(alpha)}`].join('\\\\')}\\end{gathered}`,
    },
    alpha,
  };
}

/** Betrag eines Vektors als Zahl für Anzeigen. */
export const laenge = (v: number[]): number => betrag(v);
export { bruch };
