import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Figur, KontrollFigur } from '../src/components/Raumfigur';
import type { RaumBildSpec } from '../src/lib/schraegbild';

const spec: RaumBildSpec = { sprech: 'Schrägbild des Koordinatensystems für den Test, ohne Punkte und ohne Linien.', fein: true };

describe('Bildtext bei Raumbildern', () => {
  it('steht standardmäßig direkt unter dem Schalter und vor dem Bild, nicht als Bildunterschrift darunter', () => {
    const h = renderToStaticMarkup(<Figur spec={spec} unter={<>Text zum Bild</>} />);
    const schalter = h.indexOf('aria-label="Darstellung wählen"');
    const text = h.indexOf('bild-text-oben');
    const bild = h.indexOf('role="img"');
    expect(schalter).toBeGreaterThan(-1);
    expect(text).toBeGreaterThan(schalter);
    expect(bild).toBeGreaterThan(text);
    expect(h).not.toContain('<figcaption');
  });
  it('mit oben={false} steht der Text wie früher unter dem Bild', () => {
    const h = renderToStaticMarkup(<Figur spec={spec} unter={<>Text zum Bild</>} oben={false} />);
    expect(h).toContain('<figcaption');
    expect(h).not.toContain('bild-text-oben');
    expect(h.indexOf('<figcaption')).toBeGreaterThan(h.indexOf('role="img"'));
  });
  it('das Kontrollbild wird erst nach dem Einblenden erzeugt', () => {
    expect(renderToStaticMarkup(<KontrollFigur spec={spec} unter={<>Text</>} />)).not.toContain('bild-text-oben');
  });
});
