import { describe, expect, it } from 'vitest';
import { rendereFormel, richteSpaltenAus } from '../src/lib/formel';

describe('Ausrichtung von Spaltenvektoren', () => {
  it('Spalten aus Zahlen stehen rechtsbündig (Ziffer unter Ziffer)', () => {
    expect(richteSpaltenAus(String.raw`\vec{a}=\begin{pmatrix}-1\\2\\-3\end{pmatrix}`)).toBe(String.raw`\vec{a}=\begin{pmatrix*}[r]-1\\2\\-3\end{pmatrix*}`);
    expect(richteSpaltenAus(String.raw`\begin{pmatrix}0{,}5\\-1{,}5\end{pmatrix}`)).toContain('pmatrix*');
  });
  it('Matrizen mit mehreren Spalten und Spalten ohne Minus bleiben unverändert', () => {
    const matrix = String.raw`\begin{pmatrix}1&2\\-3&4\end{pmatrix}`;
    expect(richteSpaltenAus(matrix)).toBe(matrix);
    const ohneMinus = String.raw`\begin{pmatrix}a_1\\a_2\end{pmatrix}`;
    expect(richteSpaltenAus(ohneMinus)).toBe(ohneMinus);
  });
  it('Spalten mit Termen: Einträge ohne Minus erhalten ein unsichtbares Minus, wenn andere eines haben', () => {
    expect(richteSpaltenAus(String.raw`\begin{pmatrix}-\frac{1}{2}\\3\end{pmatrix}`)).toBe(String.raw`\begin{pmatrix}-\frac{1}{2}\\\phantom{-}3\end{pmatrix}`);
    const alleMinus = String.raw`\begin{pmatrix}-a\\-b\end{pmatrix}`;
    expect(richteSpaltenAus(alleMinus)).toBe(alleMinus);
  });
  it('mehrere Vektoren in einer Formel werden einzeln behandelt', () => {
    const r = richteSpaltenAus(String.raw`\begin{pmatrix}1\\-2\end{pmatrix}+t\begin{pmatrix}3\\4\end{pmatrix}`);
    expect(r.match(/pmatrix\*/g)).toHaveLength(4);
  });
  it('die Formel rendert ohne Fehler, die Textalternative behält den ursprünglichen Quelltext', () => {
    const tex = String.raw`\vec{a}=\begin{pmatrix}-1\\2\\-3\end{pmatrix}`;
    const r = rendereFormel(tex);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.html).toContain(`<annotation encoding="application/x-tex">${tex}</annotation>`);
    expect(r.html).toContain('col-align-r');
    for (const t of [String.raw`\begin{pmatrix}-1\\2\end{pmatrix}`, String.raw`\begin{pmatrix}-\frac{1}{2}\\3\end{pmatrix}`, String.raw`\begin{pmatrix}2+(-1)\cdot 3\\-4+2\cdot 1\end{pmatrix}`, String.raw`\begin{pmatrix}0{,}5\\-12\\7\end{pmatrix}`]) {
      expect(rendereFormel(t).ok, t).toBe(true);
    }
  });
});
