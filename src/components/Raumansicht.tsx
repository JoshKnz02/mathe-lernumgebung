import { useEffect, useMemo, useRef, useState } from 'react';
import type { Ansicht } from '@/lib/koerper3d';
import { START_ANSICHT, raumAnsichtHinweis, raumZeichnung, type RZeichnung } from '@/lib/raumansicht';
import { raumBeschreibung, type RaumBildSpec } from '@/lib/schraegbild';
import { Regler } from './Regler';

const GROESSE = 560;
const klemme = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const FARBE_ACHSE = '#475569';

function pfeilspitze(g: CanvasRenderingContext2D, von: [number, number], bis: [number, number], laenge = 11) {
  const w = Math.atan2(bis[1] - von[1], bis[0] - von[0]);
  g.beginPath();
  g.moveTo(bis[0], bis[1]);
  g.lineTo(bis[0] - laenge * Math.cos(w - 0.38), bis[1] - laenge * Math.sin(w - 0.38));
  g.lineTo(bis[0] - laenge * Math.cos(w + 0.38), bis[1] - laenge * Math.sin(w + 0.38));
  g.closePath();
  g.fill();
}

/** Zeichnet die Berechnung aus `raumZeichnung` auf eine Zeichenfläche. */
function zeichne(g: CanvasRenderingContext2D, z: RZeichnung) {
  g.clearRect(0, 0, z.groesse, z.groesse);
  g.lineJoin = 'round';
  g.lineCap = 'round';
  // Koordinatenebenen (durchsichtig), die hinteren zuerst
  for (const e of z.ebenen) {
    g.beginPath();
    e.ecken.forEach((p, i) => (i === 0 ? g.moveTo(p[0], p[1]) : g.lineTo(p[0], p[1])));
    g.closePath();
    g.globalAlpha = 0.17;
    g.fillStyle = e.farbe;
    g.fill();
    g.globalAlpha = 1;
    g.setLineDash([5, 4]);
    g.strokeStyle = e.farbe;
    g.lineWidth = 1.4;
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = e.textFarbe;
    g.font = '600 13px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(e.name, e.namePos[0], e.namePos[1]);
  }
  // Achsen mit Pfeil, Teilstrichen, Zahlen und Namen
  g.strokeStyle = FARBE_ACHSE;
  g.fillStyle = FARBE_ACHSE;
  g.lineWidth = 1.8;
  for (const a of z.achsen) {
    g.beginPath();
    g.moveTo(a.von[0], a.von[1]);
    g.lineTo(a.bis[0], a.bis[1]);
    g.stroke();
    pfeilspitze(g, a.von, a.bis);
    g.lineWidth = 1.2;
    g.font = '11px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (const t of a.ticks) {
      g.beginPath();
      g.moveTo(t.pos[0] - t.richtung[0] * 3.5, t.pos[1] - t.richtung[1] * 3.5);
      g.lineTo(t.pos[0] + t.richtung[0] * 3.5, t.pos[1] + t.richtung[1] * 3.5);
      g.stroke();
      g.fillText(t.zahl, t.zahlPos[0], t.zahlPos[1]);
    }
    g.lineWidth = 1.8;
    g.font = '600 15px system-ui, sans-serif';
    g.fillText(a.name, a.namePos[0], a.namePos[1]);
  }
  // Linien, die hinteren zuerst
  for (const l of z.linien) {
    g.strokeStyle = l.farbe;
    g.fillStyle = l.farbe;
    g.lineWidth = l.breite;
    g.setLineDash(l.gestrichelt ? [6, 4] : []);
    g.beginPath();
    g.moveTo(l.von[0], l.von[1]);
    g.lineTo(l.bis[0], l.bis[1]);
    g.stroke();
    g.setLineDash([]);
    if (l.pfeil) pfeilspitze(g, l.von, l.bis, 12);
  }
  // Punkte und Beschriftungen
  for (const p of z.punkte) {
    if (!p.nurText) {
      g.beginPath();
      g.arc(p.pos[0], p.pos[1], p.offen ? 5 : 5.5, 0, 2 * Math.PI);
      g.fillStyle = p.offen ? '#ffffff' : p.farbe;
      g.fill();
      g.lineWidth = p.offen ? 2 : 1;
      g.strokeStyle = p.farbe;
      g.stroke();
    }
    if (p.text) {
      g.fillStyle = p.farbe;
      g.font = p.nurText ? '600 20px system-ui, sans-serif' : '600 15px system-ui, sans-serif';
      g.textAlign = p.text.anker;
      g.textBaseline = 'middle';
      g.fillText(p.name, p.text.pos[0], p.text.pos[1]);
    }
  }
}

/**
 * Räumliche Ansicht des Koordinatensystems mit Punkten, Linien und Koordinatenebenen (gleiche Daten wie das Schrägbild).
 * Drehen: Ziehen (Maus, mit dem Finger waagerecht), Pfeiltasten oder die Regler.
 */
export function Raumansicht({ spec }: { spec: RaumBildSpec }) {
  const flaeche = useRef<HTMLCanvasElement>(null);
  const [ansicht, setAnsicht] = useState<Ansicht>(START_ANSICHT);
  const zeiger = useRef<{ x: number; y: number } | null>(null);
  const zeichnung = useMemo(() => raumZeichnung(spec, ansicht, GROESSE), [spec, ansicht]);

  useEffect(() => {
    const c = flaeche.current;
    const g = c?.getContext('2d');
    if (!c || !g) return;
    const faktor = Math.min(2, window.devicePixelRatio || 1);
    c.width = GROESSE * faktor;
    c.height = GROESSE * faktor;
    g.setTransform(faktor, 0, 0, faktor, 0, 0);
    zeichne(g, zeichnung);
  }, [zeichnung]);

  const dreh = (da: number, de: number) => setAnsicht((v) => ({ az: ((v.az + da + 540) % 360) - 180, el: klemme(v.el + de, -20, 80) }));

  return (
    <div className="raumansicht">
      <canvas
        ref={flaeche}
        className="raumansicht-flaeche"
        width={GROESSE}
        height={GROESSE}
        role="img"
        aria-label={`${raumBeschreibung(spec)} ${raumAnsichtHinweis}`}
        tabIndex={0}
        onKeyDown={(e) => {
          const schritt = { ArrowLeft: [-6, 0], ArrowRight: [6, 0], ArrowUp: [0, 5], ArrowDown: [0, -5] }[e.key];
          if (!schritt) return;
          e.preventDefault();
          dreh(schritt[0]!, schritt[1]!);
        }}
        onPointerDown={(e) => {
          zeiger.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const z = zeiger.current;
          if (!z) return;
          dreh((e.clientX - z.x) * 0.6, e.pointerType === 'mouse' ? (e.clientY - z.y) * 0.4 : 0);
          zeiger.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => {
          zeiger.current = null;
        }}
        onPointerCancel={() => {
          zeiger.current = null;
        }}
      />
      <div className="regler-gruppe">
        <Regler name="Drehung der Ansicht" beschriftung="Drehung" wert={ansicht.az} min={-180} max={180} step={5} onChange={(az) => setAnsicht((v) => ({ ...v, az }))} anzeige={<>{ansicht.az}°</>} />
        <Regler name="Neigung der Blickrichtung" beschriftung="Neigung" wert={ansicht.el} min={-20} max={80} step={5} onChange={(el) => setAnsicht((v) => ({ ...v, el }))} anzeige={<>{ansicht.el}°</>} />
      </div>
      <p className="klein">
        <button type="button" className="knopf-zweit" onClick={() => setAnsicht(START_ANSICHT)}>Ansicht zurücksetzen</button>
      </p>
    </div>
  );
}
