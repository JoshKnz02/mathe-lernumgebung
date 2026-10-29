import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ausdehnung, projiziere, zeichenstuecke, type Ansicht, type Flaeche3 } from '@/lib/koerper3d';
import { Regler } from './Regler';

const BREITE = 720;
const HOEHE = 480;
/** Farbton des Körpers: dasselbe Blau wie die Flächen (#0072B2), nur die Helligkeit wechselt je nach Lage zum Licht. */
const FARBTON = 201;

interface Props {
  netz: Flaeche3[];
  /** Textalternative für Screenreader. */
  beschreibung: string;
  /** Länge der gestrichelt gezeichneten Drehachse (x-Werte von bis). */
  achse: [number, number];
  /** Schieberegler für Drehung und Neigung anzeigen. Ziehen mit der Maus oder den Pfeiltasten geht immer. */
  regler?: boolean;
  start?: Ansicht;
}

const klemme = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/**
 * Dreidimensionale Ansicht eines Rotationskörpers auf einer Zeichenfläche (canvas). Drehen: Ziehen (Maus und Touch waagerecht),
 * Pfeiltasten oder Regler. Das Netz kommt aus `src/lib/koerper3d.ts`.
 */
export function Koerper3D({ netz, beschreibung, achse, regler = false, start = { az: 28, el: 22 } }: Props) {
  const zeichnung = useRef<HTMLCanvasElement>(null);
  const [ansicht, setAnsicht] = useState<Ansicht>(start);
  const zeiger = useRef<{ x: number; y: number } | null>(null);
  const mass = useMemo(() => ausdehnung(netz, ansicht.el), [netz, ansicht.el]);

  useEffect(() => {
    const c = zeichnung.current;
    const g = c?.getContext('2d');
    if (!c || !g) return;
    const faktor = Math.min(2, window.devicePixelRatio || 1);
    c.width = BREITE * faktor;
    c.height = HOEHE * faktor;
    g.setTransform(faktor, 0, 0, faktor, 0, 0);
    g.clearRect(0, 0, BREITE, HOEHE);
    const [achseVon, achseBis] = achse;
    const ex = Math.max(mass.ex, Math.abs(achseVon - mass.mitte[0]), Math.abs(achseBis - mass.mitte[0]));
    const massstab = 0.9 * Math.min(BREITE / 2 / ex, HOEHE / 2 / mass.ey);
    const mitte = projiziere([mass.mitte[0], 0, 0], ansicht);
    const bild = (p: [number, number]): [number, number] => [BREITE / 2 + (p[0] - mitte[0]) * massstab, HOEHE / 2 - (p[1] - mitte[1]) * massstab];
    g.lineJoin = 'round';
    for (const s of zeichenstuecke(netz, ansicht)) {
      g.beginPath();
      s.punkte.forEach((p, i) => {
        const [px, py] = bild(p);
        if (i === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      });
      g.closePath();
      g.fillStyle = `hsl(${FARBTON} 100% ${26 + 46 * s.hell}%)`;
      g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.28)';
      g.lineWidth = 0.6;
      g.stroke();
    }
    // Drehachse gestrichelt über dem Körper
    const a0 = bild(projiziere([achseVon, 0, 0], ansicht).slice(0, 2) as [number, number]);
    const a1 = bild(projiziere([achseBis, 0, 0], ansicht).slice(0, 2) as [number, number]);
    g.setLineDash([6, 4]);
    g.strokeStyle = '#000';
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(a0[0], a0[1]);
    g.lineTo(a1[0], a1[1]);
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = '#000';
    g.font = '16px system-ui, sans-serif';
    const rechts = a1[0] >= a0[0];
    g.textAlign = rechts ? 'left' : 'right';
    g.fillText('x', a1[0] + (rechts ? 6 : -6), a1[1] + 5);
  }, [netz, ansicht, mass, achse]);

  const dreh = (da: number, de: number) => setAnsicht((v) => ({ az: ((v.az + da + 540) % 360) - 180, el: klemme(v.el + de, 0, 85) }));

  return (
    <div className="koerper3d">
      <canvas
        ref={zeichnung}
        className="koerper3d-flaeche"
        width={BREITE}
        height={HOEHE}
        role="img"
        aria-label={`${beschreibung} Drehen mit den Pfeiltasten oder den Reglern.`}
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
      {regler && (
        <div className="regler-gruppe">
          <Regler name="Drehung des Körpers" beschriftung="Drehung" wert={ansicht.az} min={-180} max={180} step={5} onChange={(az) => setAnsicht((v) => ({ ...v, az }))} anzeige={<>{ansicht.az}°</>} />
          <Regler name="Neigung der Blickrichtung" beschriftung="Neigung" wert={ansicht.el} min={0} max={85} step={5} onChange={(el) => setAnsicht((v) => ({ ...v, el }))} anzeige={<>{ansicht.el}°</>} />
        </div>
      )}
    </div>
  );
}

/** Dreidimensionale Ansicht mit Bildunterschrift. */
export function Koerper3DFigur({ unter, ...p }: Props & { unter: ReactNode }) {
  return (
    <figure className="bild">
      <Koerper3D {...p} />
      <figcaption>{unter}</figcaption>
    </figure>
  );
}

