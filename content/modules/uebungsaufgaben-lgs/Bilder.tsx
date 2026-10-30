import { Formel } from '@/components/Formel';
import { Bild, BLAU, gerade, ORANGE, type MessbildDaten } from '@/components/Messbild';
import { A6, A8 } from './daten';

/** Aufgabe 6: die Gerade, die beide Gleichungen beschreiben, mit dem Punkt für x = −2. */
export const BILD_A6: MessbildDaten = {
  kurven: [gerade(0, A6.gerade.c, A6.gerade.m, BLAU)],
  punkte: [{ x: A6.punkt[0]!, y: A6.punkt[1]!, farbe: ORANGE, text: 'P', lage: 'oben-rechts' }],
  bereich: [-5, 7, -2, 5],
  teilung: 1,
  xTitel: 'x',
  yTitel: 'y',
  beschreibung: 'Eine fallende Gerade durch den Punkt P mit den Koordinaten minus 2 und 3 und durch den Punkt mit den Koordinaten 0 und 2. Beide Gleichungen beschreiben diese Gerade, alle ihre Punkte sind Lösungen.',
};

export function BildA6() {
  return (
    <Bild
      daten={BILD_A6}
      unter={
        <>
          Beide Gleichungen beschreiben dieselbe Gerade <Formel tex={String.raw`y=2-\frac{1}{2}x`} nach="." /> Jeder Punkt der Geraden ist eine Lösung, zum Beispiel <Formel tex={String.raw`P(-2\,|\,3)`} nach="." />
        </>
      }
    />
  );
}

/** Aufgabe 8: Skizze des Verkehrsknotens. Linien und Pfeile in der Textfarbe, damit sie in beiden Darstellungen gut lesbar sind. */
export function Verkehrsknoten() {
  const beschreibung = `Skizze zweier Knoten. In den Knoten K1 fließen ${A8.ein1} Fahrzeuge pro Stunde ein, aus K1 fließen x Fahrzeuge nach rechts und y Fahrzeuge nach unten zum Knoten K2. In K2 fließen zusätzlich ${A8.ein2} Fahrzeuge pro Stunde ein, aus K2 fließen z Fahrzeuge nach rechts.`;
  return (
    <figure className="bild">
      <svg viewBox="0 0 320 170" role="img" aria-label={beschreibung} className="verkehrsknoten" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <marker id="spitze" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="currentColor" stroke="none" />
          </marker>
        </defs>
        <path d="M12 45 H104" markerEnd="url(#spitze)" />
        <path d="M116 45 H298" markerEnd="url(#spitze)" />
        <path d="M110 51 V124" markerEnd="url(#spitze)" />
        <path d="M12 130 H104" markerEnd="url(#spitze)" />
        <path d="M116 130 H298" markerEnd="url(#spitze)" />
        <circle cx="110" cy="45" r="6" fill="currentColor" />
        <circle cx="110" cy="130" r="6" fill="currentColor" />
        <g fill="currentColor" stroke="none" fontSize="24" fontFamily="inherit">
          <text x="20" y="33">{A8.ein1}</text>
          <text x="20" y="118">{A8.ein2}</text>
          <text x="200" y="33">x</text>
          <text x="124" y="94">y</text>
          <text x="200" y="118">z</text>
          <text x="116" y="26">K₁</text>
          <text x="116" y="160">K₂</text>
        </g>
      </svg>
      <figcaption>Zwei Knoten. Die Pfeile zeigen die Fahrtrichtung, die Zahlen sind die Fahrzeuge pro Stunde.</figcaption>
    </figure>
  );
}
