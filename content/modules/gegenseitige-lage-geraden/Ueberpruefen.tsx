import { Abschnitt } from '@/components/Abschnitt';
import { Aufgabe, type Feld } from '@/components/Aufgabe';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { KontrollFigur, Zeichenaufgabe } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { geradenpunkt, lageZweier, type Gerade } from '@/lib/gerade';
import { bruch, punktTeX } from '@/lib/geradenhilfen';
import { klammer, spalte } from '@/lib/laborhilfen';
import { opt, platziere, t, zt } from '@/lib/modulhilfen';
import { faktor } from '@/lib/vektor';
import { aufgAchse, aufgAngeben, aufgSchnitt, aufgWindschief } from './Bilder';
import { A_ACHSE, A_ANGEBEN, A_IDENTISCH, A_PARALLEL, A_PARAM_IDENTISCH, A_PARAM_PARALLEL, A_PARAM_SCHNITT, A_PUNKT, A_RICHTUNG, A_SCHNITT, A_SYSTEM, A_VIER, A_WINDSCHIEF } from './daten';
import { ORDNUNG, ROEM, gl, glSchmal, gleichsetzZeile, loesungsFormel, loesungsweg, punktprobe, schnittpunktRechnung, zeileTeX } from './rechenhilfen';
import { gleichsetzSystem } from '@/lib/gerade';
import type { Loesungsweg } from './rechenhilfen';

const sp = (v: number[]) => spalte(v);
/** Mehrere kurze Zeilen: auf breiten Fenstern in einer Zeile, schmal untereinander. */
const Zeilen = ({ z }: { z: string[] }) => <Umbruchformel tex={z.join(',\\ \\ ')} schmal={`\\begin{gathered}${z.join('\\\\')}\\end{gathered}`} />;
/** Nur die eingesetzte Gleichung und ihr Ergebnis (ohne die Umstellung), einzeilig und in kurzen Zeilen. */
const loesungsFormelKurz = (w: Loesungsweg) => ({
  tex: [w.eingesetzt.eingesetzt, w.eingesetzt.zusammen, w.eingesetzt.ergebnis].join(',\\ \\ '),
  schmal: `\\begin{gathered}${[...w.eingesetzt.eingesetztZeilen, w.eingesetzt.zusammen, w.eingesetzt.ergebnis].join('\\\\')}\\end{gathered}`,
});
/** Gleichung einer Geraden als Umbruchformel. */
const G = ({ g, name = 'g', par = 't' }: { g: Gerade; name?: string; par?: string }) => <Umbruchformel tex={gl(g, name, par)} schmal={glSchmal(g, name, par)} />;
const feldZahl = (id: string, name: string, beschriftung: string, erwartet: number): Feld => ({ id, name, beschriftung: <Formel tex={beschriftung} />, erwartet });
const rom = (i: number) => ROEM[i]!;
/** Punkt mit Name, zum Beispiel S(1 | −3 | 1). */
const PK = (name: string, p: number[]) => punktTeX(name, p);
/** Rechnung t in g einsetzen als Umbruchformel. */
const Schnittpunkt = ({ g, par, S, name = 'S' }: { g: Gerade; par: number; S: number[]; name?: string }) => {
  const r = schnittpunktRechnung(g, par, name, PK(name, S));
  return <Umbruchformel tex={`${r.tex},\\ \\ ${PK(name, S)}`} schmal={r.schmal} />;
};
/** Schritt eines Lösungswegs: Gleichungssystem lösen (Einsetzen und Probe), als Liste von Lösungsschritten. */
function schritteSystem(g: Gerade, h: Gerade) {
  const w = loesungsweg(g, h);
  const sch = [
    <>
      Gleichsetzen und nach <Formel tex="t" /> und <Formel tex="s" /> sortieren (die Gleichungen <Formel tex={rom(0)} nach="," /> <Formel tex={rom(1)} /> und <Formel tex={rom(2)} /> stehen von oben nach unten):
      <Zeilen z={w.zeilen} />
    </>,
    <>
      Gleichung <Formel tex={rom(w.gewaehlt.zeile)} /> nach <Formel tex={w.gewaehlt.var} /> umstellen und in <Formel tex={rom(w.eingesetzt.gleichung)} /> einsetzen:
      <Umbruchformel {...loesungsFormel(w)} />
    </>,
    <>
      Probe mit der dritten Gleichung (links <Formel tex={t`p_3+t\cdot u_3`} nach="," /> rechts <Formel tex={t`q_3+s\cdot v_3`} nach=")" />:
      <Zeilen z={[w.probe.links, w.probe.rechts]} />
    </>,
  ];
  return { w, sch };
}

export function Ueberpruefen() {
  const ri = A_RICHTUNG;
  const id = A_IDENTISCH;
  const pa = A_PARALLEL;
  const sy = A_SYSTEM;
  const sc = A_SCHNITT;
  const wi = A_WINDSCHIEF;
  const vi = A_VIER;
  const pu = A_PUNKT;
  const ap = A_PARAM_PARALLEL;
  const ai = A_PARAM_IDENTISCH;
  const as = A_PARAM_SCHNITT;
  const an = A_ANGEBEN;
  const ac = A_ACHSE;

  /* Aufgabe 2 */
  const k2 = faktor(id.paar.g.u, id.paar.h.u)!;
  const probe2 = punktprobe(id.paar.g, id.paar.h.p);
  /* Aufgabe 3 */
  const probe3 = punktprobe(pa.g, pa.h.p);
  /* Aufgabe 4 */
  const z4 = gleichsetzSystem(sy.paar.g, sy.paar.h);
  /* Aufgabe 5 */
  const s5 = schritteSystem(sc.paar.g, sc.paar.h);
  /* Aufgabe 6 */
  const s6 = loesungsweg(wi.g, wi.h);
  const g6 = geradenpunkt(wi.g, s6.t);
  const h6 = geradenpunkt(wi.h, s6.s);
  /* Aufgabe 8 */
  const l8 = lageZweier(pu.paar.g, pu.paar.h);
  /* Aufgabe 9 */
  const v9 = ap.h.u;
  const k9 = 6 / v9[1]!;
  const u9: Gerade = { p: ap.g.p, u: [ap.a, 6, -2] };
  const q9 = punktprobe(u9, ap.h.p);
  /* Aufgabe 11 */
  const h11: Gerade = { p: as.h.p, u: [as.hv[0]!, as.hv[1]!, as.a] };
  const w11 = loesungsweg(as.g, h11);
  /* Aufgabe 13 */
  const h13: Gerade = { p: an.X, u: an.w };
  const w13 = loesungsweg(an.g, h13);
  /* Aufgabe 14 */
  const w14 = loesungsweg(ac.g, ac.achse);

  return (
    <Abschnitt id="ueberpruefen" titel="Überprüfen">
      <p>
        Bearbeite die Aufgaben zuerst im Heft und prüfe dann deine Ergebnisse. Bleibst du stecken, deckst du die Hilfen nacheinander auf. Bei Aufgaben mit Bild kannst du dir das Bild zur Kontrolle einblenden, nachdem du selbst gerechnet hast. Die Bilder im Raum lassen sich zwischen Schrägbild und räumlicher Ansicht umschalten. Das Aufstellen von Geradengleichungen und die Punktprobe stehen im Modul <Modulverweis modul="geradengleichung">Die Geradengleichung</Modulverweis>.
      </p>
      <Hinweis titel="Eingabe">Jede Zahl trägst du in ein eigenes Feld ein. Negative Zahlen schreibst du mit Minuszeichen, Dezimalzahlen mit Komma.</Hinweis>

      <Auswahlfrage
        nummer="1"
        titel="Was folgt aus den Richtungsvektoren?"
        optionen={platziere(
          [
            opt('a', <>Die Geraden sind parallel oder identisch.</>, true, <>Richtig. Es ist <Formel tex={t`\vec{v}=-\frac{1}{2}\cdot\vec{u}`} nach="," /> die Richtungsvektoren sind Vielfache. Die Geraden haben dieselbe Richtung. Ob sie identisch oder parallel sind, entscheidet die Punktprobe mit einem Stützpunkt.</>),
            opt('b', <>Die Geraden schneiden sich in genau einem Punkt.</>, false, <>Bei gleicher Richtung gibt es keinen einzelnen Schnittpunkt: Haben die Geraden einen gemeinsamen Punkt, haben sie alle Punkte gemeinsam, sie sind dann identisch.</>),
            opt('c', <>Die Geraden sind windschief.</>, false, <>Windschiefe Geraden sind nicht parallel, ihre Richtungsvektoren sind keine Vielfachen. Hier sind sie aber Vielfache.</>),
            opt('d', <>Die Geraden sind parallel, aber nicht identisch.</>, false, <>Dass sie nicht identisch sind, lässt sich aus den Richtungsvektoren nicht schließen. Es hängt von den Stützpunkten ab: Liegt der Stützpunkt von <Formel tex="h" /> auf <Formel tex="g" nach="," /> sind sie identisch.</>),
          ],
          1,
        )}
        erklaerung={<>Sind die Richtungsvektoren Vielfache, haben die Geraden dieselbe Richtung: parallel oder identisch. Die Punktprobe mit dem Stützpunkt trennt die beiden Fälle.</>}
      >
        <p>
          Zwei Geraden <Formel tex="g" /> und <Formel tex="h" /> haben die Richtungsvektoren <Formel tex={t`\vec{u}=${sp(ri.u)}`} /> und <Formel tex={t`\vec{v}=${sp(ri.v)}`} nach="." /> Die Stützvektoren sind nicht bekannt. Was folgt für die Lage der Geraden?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={2}
        titel="Parallel oder identisch"
        felder={[feldZahl('k', 'Faktor k', 'k', k2), feldZahl('t', 'Parameter t', 't', probe2.t)]}
        hilfen={[
          <>Für die Richtungsvektoren suchst du eine Zahl <Formel tex="k" /> mit <Formel tex={t`\vec{v}=k\cdot\vec{u}`} nach="." /> Bestimme <Formel tex="k" /> aus der ersten Koordinate und prüfe die anderen beiden.</>,
          <>Für die Punktprobe suchst du <Formel tex="t" /> mit <Formel tex={t`\vec{p}+t\cdot\vec{u}=\vec{q}`} nach="." /> Bestimme <Formel tex="t" /> aus der ersten Koordinate und prüfe die anderen beiden.</>,
        ]}
        loesung={[
          <>
            Richtungsvektoren, <Formel tex={t`\vec{v}=k\cdot\vec{u}`} nach=":" />
            <Zeilen z={[`${zt(id.paar.h.u[0]!)}=k\\cdot ${klammer(id.paar.g.u[0]!)}`, `k=${k2}`]} />
            Probe mit den anderen Koordinaten:
            <Zeilen z={[1, 2].map((i) => `${zt(id.paar.h.u[i]!)}=${klammer(k2)}\\cdot ${klammer(id.paar.g.u[i]!)}`)} />
            Die Richtungsvektoren sind Vielfache.
          </>,
          <>
            Punktprobe mit <Formel tex={PK('Q', id.paar.h.p)} nach=":" />
            <Zeilen z={[`${zt(id.paar.g.p[0]!)}+${klammer(id.paar.g.u[0]!)}\\cdot t=${zt(id.paar.h.p[0]!)}`, `t=${probe2.t}`]} />
            Probe mit den anderen Koordinaten:
            <Zeilen z={[1, 2].map((i) => `${zt(id.paar.g.p[i]!)}+${klammer(id.paar.g.u[i]!)}\\cdot ${klammer(probe2.t)}=${zt(id.paar.h.p[i]!)}`)} />
          </>,
          <>Die Richtungsvektoren sind Vielfache und <Formel tex="Q" /> liegt auf <Formel tex="g" nach="." /> Die Geraden sind <strong>identisch</strong>.</>,
        ]}
      >
        <p>Gegeben sind</p>
        <G g={id.paar.g} />
        <G g={id.paar.h} name="h" par="s" />
        <p>
          Bestimme <Formel tex="k" /> mit <Formel tex={t`\vec{v}=k\cdot\vec{u}`} /> und den Parameter <Formel tex="t" /> mit <Formel tex={t`g(t)=Q`} nach="," /> wobei <Formel tex={PK('Q', id.paar.h.p)} /> der Stützpunkt von <Formel tex="h" /> ist. Welche Lage haben die Geraden?
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="3"
        titel="Zwei von drei Koordinaten genügen nicht"
        optionen={platziere(
          [
            opt('a', <>Parallel.</>, true, <>Richtig. Die Richtungsvektoren sind Vielfache (<Formel tex={t`\vec{v}=-2\cdot\vec{u}`} nach=")." /> Für <Formel tex={`t=${probe3.t}`} /> passen die ersten beiden Koordinaten von <Formel tex="Q" nach="," /> aber <Formel tex={`g(${probe3.t})=${spalte(probe3.punkt)}`} /> hat als dritte Koordinate <Formel tex={`${probe3.punkt[2]}`} /> und <Formel tex="Q" /> hat <Formel tex={`${pa.h.p[2]}`} nach="." /> <Formel tex="Q" /> liegt nicht auf <Formel tex="g" nach="." /></>),
            opt('b', <>Identisch.</>, false, <>Es genügt nicht, dass zwei Koordinaten passen. Der Punkt <Formel tex="Q" /> muss in <strong>allen drei</strong> Koordinaten zu demselben <Formel tex="t" /> gehören. Hier gehört <Formel tex={`t=${probe3.t}`} /> zu den ersten beiden, die dritte Koordinate passt nicht.</>),
            opt('c', <>Sie schneiden sich in einem Punkt.</>, false, <>Die Richtungsvektoren sind Vielfache, die Geraden haben also dieselbe Richtung. Dann kann es keinen einzelnen Schnittpunkt geben.</>),
            opt('d', <>Windschief.</>, false, <>Windschiefe Geraden haben Richtungsvektoren, die keine Vielfachen sind. Hier ist <Formel tex={t`\vec{v}=-2\cdot\vec{u}`} nach="." /></>),
          ],
          2,
        )}
        erklaerung={<>Bei Vielfachen als Richtungsvektoren prüft die Punktprobe, ob <Formel tex="Q" /> auf <Formel tex="g" /> liegt: ein einziges <Formel tex="t" /> muss alle drei Koordinaten erfüllen.</>}
      >
        <p>Gegeben sind</p>
        <G g={pa.g} />
        <G g={pa.h} name="h" par="s" />
        <p>Welche Lage haben die Geraden?</p>
      </Auswahlfrage>

      <Aufgabe
        nummer={4}
        titel="Gleichsetzen und sortieren"
        felder={[
          feldZahl('a2', 'Zahl vor t in Gleichung II', `\\mathrm{II}:\\ a`, z4[1]!.a),
          feldZahl('b2', 'Zahl vor s in Gleichung II', `\\mathrm{II}:\\ b`, z4[1]!.b),
          feldZahl('c2', 'Zahl rechts in Gleichung II', `\\mathrm{II}:\\ c`, z4[1]!.c),
          feldZahl('a3', 'Zahl vor t in Gleichung III', `\\mathrm{III}:\\ a`, z4[2]!.a),
          feldZahl('b3', 'Zahl vor s in Gleichung III', `\\mathrm{III}:\\ b`, z4[2]!.b),
          feldZahl('c3', 'Zahl rechts in Gleichung III', `\\mathrm{III}:\\ c`, z4[2]!.c),
        ]}
        hilfen={[
          <>Die zweite Gleichung gehört zur zweiten Koordinate: <Formel tex={t`p_2+t\cdot u_2=q_2+s\cdot v_2`} nach="." /> Setze die Zahlen ein.</>,
          <>Bringe das <Formel tex="s" />-Glied auf die linke Seite (dabei wechselt es das Vorzeichen) und die Zahl ohne <Formel tex="t" /> und <Formel tex="s" /> auf die rechte Seite. Steht vor <Formel tex="s" /> kein Zahlenfaktor, ist er 1 oder −1.</>,
        ]}
        loesung={[1, 2].map((i) => (
          <>
            Gleichung <Formel tex={rom(i)} nach=":" />
            <Zeilen z={[gleichsetzZeile(sy.paar.g, sy.paar.h, i), zeileTeX(z4[i]!)]} />
            Also <Formel tex={`a=${z4[i]!.a}`} nach="," /> <Formel tex={`b=${z4[i]!.b}`} /> und <Formel tex={`c=${z4[i]!.c}`} nach="." />
          </>
        ))}
      >
        <p>Gegeben sind</p>
        <G g={sy.paar.g} />
        <G g={sy.paar.h} name="h" par="s" />
        <p>
          Setze koordinatenweise gleich und schreibe die Gleichungen <Formel tex={rom(1)} /> und <Formel tex={rom(2)} /> in der Form <Formel tex={t`a\cdot t+b\cdot s=c`} nach="." /> Gib <Formel tex="a" nach="," /> <Formel tex="b" /> und <Formel tex="c" /> an.
        </p>
      </Aufgabe>

      <Aufgabe
        nummer={5}
        titel="Den Schnittpunkt berechnen"
        felder={[
          feldZahl('t', 'Parameter t', 't', sc.t),
          feldZahl('s', 'Parameter s', 's', sc.s),
          feldZahl('x1', '1. Koordinate von S', 'S:\\ x_1', sc.S[0]),
          feldZahl('x2', '2. Koordinate von S', 'S:\\ x_2', sc.S[1]),
          feldZahl('x3', '3. Koordinate von S', 'S:\\ x_3', sc.S[2]),
        ]}
        hilfen={[
          <>Setze gleich und schreibe drei Gleichungen für <Formel tex="t" /> und <Formel tex="s" /> auf. Löse zwei davon, zum Beispiel durch Einsetzen.</>,
          <>Prüfe das Ergebnis mit der dritten Gleichung. Setze dann <Formel tex="t" /> in <Formel tex="g" /> ein und kontrolliere mit <Formel tex="s" /> in <Formel tex="h" nach="." /></>,
        ]}
        loesung={[
          ...s5.sch,
          <>
            Der Schnittpunkt mit <Formel tex={`t=${s5.w.t}`} /> in <Formel tex="g" nach=":" />
            <Schnittpunkt g={sc.paar.g} par={s5.w.t} S={sc.S} />
            Kontrolle mit <Formel tex={`s=${s5.w.s}`} /> in <Formel tex="h" nach=":" /> <Formel tex={`${sp(geradenpunkt(sc.paar.h, s5.w.s))}`} nach="." />
          </>,
        ]}
      >
        <p>Gegeben sind</p>
        <G g={sc.paar.g} />
        <G g={sc.paar.h} name="h" par="s" />
        <p>Die Geraden schneiden sich. Bestimme <Formel tex="t" nach="," /> <Formel tex="s" /> und die Koordinaten des Schnittpunkts <Formel tex="S" nach="." /></p>
        <KontrollFigur spec={aufgSchnitt} unter={<>Die Geraden <Formel tex="g" /> und <Formel tex="h" /> schneiden sich im Punkt <Formel tex={PK('S', sc.S)} nach="." /></>} />
      </Aufgabe>

      <Auswahlfrage
        nummer="6"
        titel="Windschief begründen"
        optionen={platziere(
          [
            opt('a', <>Die Geraden sind windschief: Die Richtungsvektoren sind keine Vielfachen, und die dritte Gleichung ist nicht erfüllt (links <Formel tex={`${s6.probe.lw}`} nach="," /> rechts <Formel tex={`${s6.probe.rw}`} nach=")." /></>, true, <>Richtig. Das System hat keine Lösung, es gibt keinen gemeinsamen Punkt. Weil die Richtungsvektoren keine Vielfachen sind, sind die Geraden auch nicht parallel.</>),
            opt('b', <>Die Geraden schneiden sich im Punkt <Formel tex={PK('S', g6)} nach="," /> denn die ersten beiden Gleichungen haben die Lösung <Formel tex={`t=${s6.t}`} /> und <Formel tex={`s=${s6.s}`} nach="." /></>, false, <>Die Lösung der ersten beiden Gleichungen genügt nicht. Die dritte Gleichung muss auch stimmen. Hier ist <Formel tex={`g(${s6.t})=${sp(g6)}`} /> und <Formel tex={`h(${s6.s})=${sp(h6)}`} nach="." /> Die Punkte sind verschieden, es gibt keinen gemeinsamen Punkt.</>),
            opt('c', <>Die Geraden sind parallel, weil das Gleichungssystem keine Lösung hat.</>, false, <>Keine Lösung heißt nur: kein gemeinsamer Punkt. Das gilt für parallele und für windschiefe Geraden. Parallel wären sie, wenn die Richtungsvektoren Vielfache wären. Das sind sie hier nicht.</>),
            opt('d', <>Die Geraden sind windschief, weil die Richtungsvektoren keine Vielfachen sind.</>, false, <>Keine Vielfachen heißt nur: nicht parallel. Dann können sich die Geraden noch schneiden. Das entscheidet das Gleichungssystem, und es ist auch zu begründen, dass es keine Lösung hat.</>),
          ],
          0,
        )}
        erklaerung={<>Für windschief brauchst du zwei Aussagen: Die Richtungsvektoren sind keine Vielfachen, und das Gleichungssystem hat keine Lösung (zwei Gleichungen liefern Werte, die dritte ist nicht erfüllt).</>}
      >
        <p>Gegeben sind</p>
        <G g={wi.g} />
        <G g={wi.h} name="h" par="s" />
        <p>
          Gleichsetzen und das Lösen der Gleichungen <Formel tex={rom(0)} /> und <Formel tex={rom(1)} /> liefert <Formel tex={`t=${s6.t}`} /> und <Formel tex={`s=${s6.s}`} nach="." /> Welche Aussage über die Lage ist mit richtiger Begründung formuliert?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={7}
        titel="Vier Paare, vier Lagen"
        felder={vi.paare.map((_, i) => ({ id: `p${i + 1}`, name: `Nummer der Lage für Paar ${i + 1}`, beschriftung: <>Paar <Formel tex={`${i + 1}`} /></>, erwartet: vi.loesung[i]! }))}
        hilfen={[
          <>Vergleiche zuerst die Richtungsvektoren. Sind sie Vielfache, entscheidet die Punktprobe mit dem Stützpunkt von <Formel tex="h" nach="." /></>,
          <>Sind die Richtungsvektoren keine Vielfachen, löse das Gleichungssystem aus zwei Gleichungen und prüfe die dritte. Jede Lage kommt genau einmal vor.</>,
        ]}
        loesung={vi.paare.map((p, i) => {
          const l = lageZweier(p.g, p.h);
          const k = faktor(p.g.u, p.h.u);
          const pp = punktprobe(p.g, p.h.p);
          if (k !== null)
            return (
              <>
                Paar {i + 1}: <Formel tex={t`\vec{v}=${k}\cdot\vec{u}`} nach="," /> die Richtungsvektoren sind Vielfache. Punktprobe mit <Formel tex="Q" nach=":" /> {pp.ok ? <>Für <Formel tex={`t=${pp.t}`} /> ergibt sich genau <Formel tex={PK('Q', p.h.p)} nach="." /> Die Geraden sind <strong>identisch</strong> (Nummer 1).</> : <>Für <Formel tex={`t=${pp.t}`} /> ist die {ORDNUNG[pp.abweichung]} Koordinate <Formel tex={`${pp.punkt[pp.abweichung]}`} /> statt <Formel tex={`${p.h.p[pp.abweichung]}`} nach="." /> <Formel tex="Q" /> liegt nicht auf <Formel tex="g" nach="." /> Die Geraden sind <strong>parallel</strong> (Nummer 2).</>}
              </>
            );
          const w = loesungsweg(p.g, p.h);
          return l.art === 'schneidend' ? (
            <>
              Paar {i + 1}: keine Vielfachen. Das System liefert <Formel tex={`t=${w.t}`} /> und <Formel tex={`s=${w.s}`} nach="," /> die dritte Gleichung ist erfüllt (beide Seiten <Formel tex={`${w.probe.lw}`} nach=")." /> Die Geraden <strong>schneiden sich</strong> in <Formel tex={PK('S', l.schnittpunkt!)} nach="" /> (Nummer 3).
            </>
          ) : (
            <>
              Paar {i + 1}: keine Vielfachen. Die ersten beiden Gleichungen liefern <Formel tex={`t=${w.t}`} /> und <Formel tex={`s=${w.s}`} nach="," /> in der dritten steht links <Formel tex={`${w.probe.lw}`} /> und rechts <Formel tex={`${w.probe.rw}`} nach="." /> Das System hat keine Lösung, die Geraden sind <strong>windschief</strong> (Nummer 4).
            </>
          );
        })}
      >
        <p>
          Ordne jedem Paar von Geraden die Lage zu: 1 identisch, 2 parallel, 3 sie schneiden sich in einem Punkt, 4 windschief. Jede Lage kommt genau einmal vor. Trage in jedes Feld die Nummer der Lage ein.
        </p>
        <ol className="auftraege" aria-label="Vier Paare von Geraden">
          {vi.paare.map((p, i) => (
            <li key={i}>
              <p>Paar {i + 1}</p>
              <G g={p.g} />
              <G g={p.h} name="h" par="s" />
            </li>
          ))}
        </ol>
      </Aufgabe>

      <Auswahlfrage
        nummer="8"
        titel="Welcher Punkt ist der Schnittpunkt?"
        optionen={platziere(
          [
            opt('a', <Formel tex={PK('S', pu.S)} />, true, <>Richtig. Die Gleichungen liefern <Formel tex={`t=${l8.t}`} /> und <Formel tex={`s=${l8.s}`} nach="." /> Mit <Formel tex="t" /> in <Formel tex="g" /> und mit <Formel tex="s" /> in <Formel tex="h" /> entsteht derselbe Punkt.</>),
            opt('b', <Formel tex={PK('', pu.gS)} />, false, <>Hier wurde <Formel tex={`s=${l8.s}`} /> in <Formel tex="g" /> eingesetzt. Der Parameter <Formel tex="s" /> gehört zu <Formel tex="h" nach="," /> der Parameter <Formel tex="t" /> zu <Formel tex="g" nach="." /> Der Punkt <Formel tex={PK('', pu.gS)} /> liegt auf <Formel tex="g" nach="," /> aber nicht auf <Formel tex="h" nach="." /></>),
            opt('c', <Formel tex={PK('', pu.hT)} />, false, <>Hier wurde <Formel tex={`t=${l8.t}`} /> in <Formel tex="h" /> eingesetzt. Der Parameter <Formel tex="t" /> gehört zu <Formel tex="g" nach="." /> Der Punkt <Formel tex={PK('', pu.hT)} /> liegt auf <Formel tex="h" nach="," /> aber nicht auf <Formel tex="g" nach="." /></>),
            opt('d', <Formel tex={PK('Q', pu.paar.h.p)} />, false, <><Formel tex="Q" /> ist der Stützpunkt von <Formel tex="h" nach="," /> also <Formel tex={t`h(0)`} nach="." /> Er liegt nicht auf <Formel tex="g" nach="." /></>),
          ],
          3,
        )}
        erklaerung={<>Der Schnittpunkt muss auf beiden Geraden liegen. Setze <Formel tex="t" /> in <Formel tex="g" /> ein und <Formel tex="s" /> in <Formel tex="h" nach="." /> Beide Rechnungen müssen denselben Punkt liefern.</>}
      >
        <p>Gegeben sind</p>
        <G g={pu.paar.g} />
        <G g={pu.paar.h} name="h" par="s" />
        <p>Die Geraden schneiden sich. Welcher der Punkte ist der Schnittpunkt?</p>
      </Auswahlfrage>

      <Aufgabe
        nummer={9}
        titel="Parallel mit einem Parameter"
        felder={[{ id: 'a', name: 'Wert a', beschriftung: <>Wert <Formel tex="a" /></>, erwartet: ap.a }]}
        hilfen={[
          <>Parallele Geraden haben Richtungsvektoren, die Vielfache sind: <Formel tex={t`\vec{u}=k\cdot\vec{v}`} nach="." /> Bestimme <Formel tex="k" /> aus einer Koordinate ohne <Formel tex="a" nach="." /></>,
          <>Prüfe an der dritten Koordinate, dass <Formel tex="k" /> stimmt, und berechne dann <Formel tex="a" nach="." /> Zeige zuletzt mit der Punktprobe, dass die Geraden nicht identisch sind.</>,
        ]}
        loesung={[
          <>
            Zweite Koordinate, <Formel tex={t`\vec{u}=k\cdot\vec{v}`} nach=":" />
            <Zeilen z={[`6=k\\cdot ${klammer(v9[1]!)}`, `k=${k9}`]} />
            Dritte Koordinate:
            <Zeilen z={[`-2=${klammer(k9)}\\cdot ${klammer(v9[2]!)}`]} />
          </>,
          <>
            Erste Koordinate:
            <Zeilen z={[`a=${klammer(k9)}\\cdot ${klammer(v9[0]!)}`, `a=${ap.a}`]} />
          </>,
          <>
            Punktprobe mit <Formel tex={PK('Q', ap.h.p)} /> für <Formel tex={`a=${ap.a}`} nach=":" />
            <Zeilen z={[`1${ap.a < 0 ? '-' : '+'}${Math.abs(ap.a)}t=0`, `t=${bruch(q9.t)}`, `${zt(6)}\\cdot ${bruch(q9.t)}=${bruch(6 * q9.t)}\\ne ${ap.h.p[1]}`]} />
            <Formel tex="Q" /> liegt nicht auf <Formel tex="g" nach="." /> Die Geraden sind parallel.
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={t`g:\ \vec{x}=${sp(ap.g.p)}+t\cdot\begin{pmatrix}a\\6\\-2\end{pmatrix}`} /> und <Formel tex={gl({ p: ap.h.p, u: ap.h.u }, 'h', 's')} nach="." /> Für welchen Wert von <Formel tex="a" /> sind <Formel tex="g" /> und <Formel tex="h" /> parallel (ohne gemeinsamen Punkt)?
        </p>
      </Aufgabe>

      <Auswahlfrage
        nummer="10"
        titel="Parallel, identisch oder schneidend"
        optionen={platziere(
          [
            opt('a', <>Für kein <Formel tex="a" nach="." /></>, true, <>Richtig. Die Richtungsvektoren sind nur für <Formel tex={`a=${ai.a}`} /> Vielfache (dann ist <Formel tex={t`\vec{u}=\vec{v}`} nach=")." /> Für <Formel tex={`a=${ai.a}`} /> liegt aber <Formel tex={PK('Q', ai.h.p)} /> auf <Formel tex="g" nach="," /> die Geraden sind identisch. Für alle anderen <Formel tex="a" /> sind die Richtungsvektoren keine Vielfachen, es gibt keine Parallelität.</>),
            opt('b', <>Für <Formel tex={`a=${ai.a}`} nach="." /></>, false, <>Für <Formel tex={`a=${ai.a}`} /> sind die Richtungsvektoren gleich. Der Stützpunkt <Formel tex="Q" /> liegt auf <Formel tex="g" /> (für <Formel tex="t=1" nach=")," /> die Geraden sind also identisch, nicht parallel.</>),
            opt('c', <>Für <Formel tex={`a=${-ai.a}`} nach="." /></>, false, <>Für <Formel tex={`a=${-ai.a}`} /> ist <Formel tex={t`\vec{u}=${sp([-ai.a, 3, -1])}`} /> und <Formel tex={t`\vec{v}=${sp(ai.h.u)}`} nach="." /> Das sind keine Vielfachen.</>),
            opt('d', <>Für jedes <Formel tex="a" nach="." /></>, false, <>Für <Formel tex={`a\\ne ${ai.a}`} /> ist die erste Koordinate von <Formel tex={t`\vec{u}`} /> verschieden von der von <Formel tex={t`\vec{v}`} nach="," /> die zweite und dritte Koordinate sind gleich. Dann sind es keine Vielfachen.</>),
          ],
          1,
        )}
        erklaerung={<>Parallel heißt: Richtungsvektoren Vielfache und der Stützpunkt von <Formel tex="h" /> nicht auf <Formel tex="g" nach="." /> Hier gibt es nur einen Wert, für den die Richtungsvektoren Vielfache sind, und genau dann liegt <Formel tex="Q" /> auf <Formel tex="g" nach="." /></>}
      >
        <p>
          Gegeben sind <Formel tex={t`g:\ \vec{x}=${sp(ai.g.p)}+t\cdot\begin{pmatrix}a\\3\\-1\end{pmatrix}`} /> und <Formel tex={gl({ p: ai.h.p, u: ai.h.u }, 'h', 's')} nach="." /> Für welche Werte von <Formel tex="a" /> sind <Formel tex="g" /> und <Formel tex="h" /> parallel (ohne gemeinsamen Punkt)?
        </p>
      </Auswahlfrage>

      <Aufgabe
        nummer={11}
        titel="Schnittpunkt mit einem Parameter"
        felder={[{ id: 'a', name: 'Wert a', beschriftung: <>Wert <Formel tex="a" /></>, erwartet: as.a }]}
        hilfen={[
          <>Die Gleichungen <Formel tex={rom(0)} /> und <Formel tex={rom(1)} /> enthalten <Formel tex="a" /> nicht. Löse sie zuerst nach <Formel tex="t" /> und <Formel tex="s" nach="." /></>,
          <>Setze <Formel tex="t" /> und <Formel tex="s" /> in die dritte Gleichung ein. Sie enthält <Formel tex="a" /> und muss erfüllt sein, damit sich die Geraden schneiden.</>,
        ]}
        loesung={[
          <>
            Gleichsetzen, die ersten beiden Gleichungen (<Formel tex={rom(0)} /> und <Formel tex={rom(1)} nach="," /> von oben nach unten):
            <Zeilen z={[w11.zeilen[0]!, w11.zeilen[1]!]} />
          </>,
          <>
            Lösen durch Einsetzen:
            <Umbruchformel {...loesungsFormel(w11)} />
          </>,
          <>
            Dritte Gleichung, <Formel tex={t`p_3+t\cdot u_3=q_3+s\cdot a`} nach=":" />
            <Umbruchformel
              tex={`${zt(as.g.p[2]!)}+${klammer(as.g.u[2]!)}\\cdot ${klammer(w11.t)}=${zt(as.h.p[2]!)}+${klammer(w11.s)}\\cdot a,\\ \\ ${zt(as.g.p[2]! + as.g.u[2]! * w11.t)}=${zt(as.h.p[2]!)}+${klammer(w11.s)}a,\\ \\ a=${as.a}`}
              schmal={`\\begin{gathered}${zt(as.g.p[2]!)}+${klammer(as.g.u[2]!)}\\cdot ${klammer(w11.t)}\\\\{}=${zt(as.h.p[2]!)}+${klammer(w11.s)}\\cdot a\\\\${zt(as.g.p[2]! + as.g.u[2]! * w11.t)}=${zt(as.h.p[2]!)}+${klammer(w11.s)}a\\\\a=${as.a}\\end{gathered}`}
            />
            Die Richtungsvektoren sind für jedes <Formel tex="a" /> keine Vielfachen (schon die ersten beiden Koordinaten passen nicht). Nur für <Formel tex={`a=${as.a}`} /> schneiden sich die Geraden, sonst sind sie windschief.
          </>,
        ]}
      >
        <p>
          Gegeben sind <Formel tex={gl(as.g)} /> und <Formel tex={t`h:\ \vec{x}=${sp(as.h.p)}+s\cdot\begin{pmatrix}1\\1\\a\end{pmatrix}`} nach="." /> Für welchen Wert von <Formel tex="a" /> schneiden sich <Formel tex="g" /> und <Formel tex="h" nach="?" />
        </p>
      </Aufgabe>

      <Zeichenaufgabe
        nummer="12"
        titel="Geraden mit vorgegebener Lage angeben"
        hilfe={
          <>
            <p>
              a) Parallel zu <Formel tex="g" nach=":" /> Eine Gerade durch <Formel tex={PK('R', an.R)} /> mit dem Richtungsvektor von <Formel tex="g" nach=":" /> <Formel tex={gl({ p: an.R, u: an.g.u }, 'h_1', 's')} nach="." /> Ein Vielfaches von <Formel tex={t`\vec{u}`} /> als Richtungsvektor ist auch richtig. Probe: Die Richtungsvektoren sind gleich, und <Formel tex="R" /> liegt nicht auf <Formel tex="g" nach="," /> denn für die erste Koordinate wäre <Formel tex={`t=${punktprobe(an.g, an.R).t}`} nach="," /> und die {ORDNUNG[punktprobe(an.g, an.R).abweichung]} Koordinate passt nicht.
            </p>
            <p>
              b) Schneidet <Formel tex="g" /> in <Formel tex="S" nach=":" /> <Formel tex="S" /> ist ein Punkt von <Formel tex="g" nach="," /> also nimm <Formel tex="S" /> als Stützpunkt. Der Richtungsvektor darf kein Vielfaches von <Formel tex={t`\vec{u}`} /> sein, zum Beispiel <Formel tex={t`${sp(an.w)}`} nach=":" /> <Formel tex={gl({ p: an.S, u: an.w }, 'h_2', 's')} nach="." /> Probe: <Formel tex="S" /> liegt auf <Formel tex="g" /> (für <Formel tex="t=-2" nach=")" /> und auf <Formel tex="h_2" /> (für <Formel tex="s=0" nach="),"/> die Richtungsvektoren sind keine Vielfachen, also schneiden sich die Geraden genau in <Formel tex="S" nach="." />
            </p>
            <p>Es gibt viele richtige Lösungen. Entscheidend ist die Probe.</p>
          </>
        }
        kontrolle={<KontrollFigur spec={aufgAngeben} unter={<>Eine mögliche Lösung: <Formel tex="g" /> (schwarz), die parallele Gerade durch <Formel tex="R" /> (orange) und die Gerade durch <Formel tex="S" /> mit anderer Richtung (rosa).</>} />}
      >
        <p>
          Gegeben ist <Formel tex={gl(an.g)} nach="." /> Der Punkt <Formel tex={PK('R', an.R)} /> liegt nicht auf <Formel tex="g" nach="," /> der Punkt <Formel tex={PK('S', an.S)} /> liegt auf <Formel tex="g" nach="." />
        </p>
        <p>a) Gib eine Gleichung einer Geraden <Formel tex={t`h_1`} /> an, die parallel zu <Formel tex="g" /> ist und durch <Formel tex="R" /> geht.</p>
        <p>b) Gib eine Gleichung einer Geraden <Formel tex={t`h_2`} /> an, die <Formel tex="g" /> im Punkt <Formel tex="S" /> schneidet.</p>
        <p>Prüfe deine Gleichungen mit der Punktprobe und dem Vergleich der Richtungsvektoren.</p>
      </Zeichenaufgabe>

      <Zeichenaufgabe
        nummer="13"
        titel="Eine windschiefe Gerade angeben"
        hilfe={
          <>
            <p>
              Wähle zuerst einen Richtungsvektor, der kein Vielfaches von <Formel tex={t`\vec{u}`} /> ist, zum Beispiel <Formel tex={t`${sp(an.w)}`} nach="." /> Wähle dann einen Stützpunkt, für den das Gleichungssystem keine Lösung hat, zum Beispiel <Formel tex={PK('X', an.X)} nach=":" /> <Formel tex={gl(h13, 'h_3', 's')} nach="." />
            </p>
            <p>Probe: Die Richtungsvektoren sind keine Vielfachen (die erste Koordinate von <Formel tex={t`\vec{w}`} /> ist 0, die von <Formel tex={t`\vec{u}`} /> nicht, und die zweite Koordinate von <Formel tex={t`\vec{w}`} /> ist nicht 0). Gleichsetzen (die Gleichungen <Formel tex={rom(0)} nach="," /> <Formel tex={rom(1)} /> und <Formel tex={rom(2)} /> stehen von oben nach unten):</p>
            <Zeilen z={w13.zeilen} />
            <p>
              Aus <Formel tex={rom(0)} /> folgt <Formel tex={w13.umgestellt} nach="." /> Eingesetzt in <Formel tex={rom(1)} nach=":" />
            </p>
            <Umbruchformel {...loesungsFormelKurz(w13)} />
            <p>
              Probe mit <Formel tex={rom(2)} nach=":" /> links <Formel tex={`${w13.probe.lw}`} nach="," /> rechts <Formel tex={`${w13.probe.rw}`} nach="." /> Die Gleichungen widersprechen sich, das System hat keine Lösung. Die Geraden haben keinen gemeinsamen Punkt und sind nicht parallel: windschief.
            </p>
          </>
        }
        kontrolle={<KontrollFigur spec={aufgWindschief} unter={<>Die Gerade <Formel tex="g" /> (schwarz) und eine mögliche Lösung <Formel tex={t`h_3`} /> (orange) durch <Formel tex={PK('Q', an.X)} nach="." /> Dreh die räumliche Ansicht, dann siehst du, dass die Geraden aneinander vorbeigehen.</>} />}
      >
        <p>
          Gegeben ist die Gerade <Formel tex="g" /> aus Aufgabe 12. Gib eine Gleichung einer Geraden <Formel tex={t`h_3`} /> an, die windschief zu <Formel tex="g" /> ist, und begründe, dass sie windschief ist.
        </p>
      </Zeichenaufgabe>

      <Aufgabe
        nummer={14}
        titel="Eine Gerade und die x₂-Achse"
        felder={[feldZahl('y', '2. Koordinate von S', 'S:\\ x_2', ac.S[1])]}
        hilfen={[
          <>Die <Formel tex="x_2" />-Achse ist eine Gerade durch den Ursprung mit dem Richtungsvektor <Formel tex={t`${sp([0, 1, 0])}`} nach="." /> Sie hat die Gleichung <Formel tex={gl(ac.achse, 'a', 's')} nach="." /> Setze gleich.</>,
          <>Die erste und die dritte Koordinate liefern schon den Parameter <Formel tex="t" nach="." /> Die zweite Koordinate liefert dann <Formel tex="s" nach="," /> das ist die <Formel tex="x_2" />-Koordinate des Schnittpunkts.</>,
        ]}
        loesung={[
          <>
            Gleichsetzen mit der <Formel tex="x_2" />-Achse (die Gleichungen <Formel tex={rom(0)} nach="," /> <Formel tex={rom(1)} /> und <Formel tex={rom(2)} /> stehen von oben nach unten):
            <Zeilen z={w14.zeilen} />
          </>,
          <>
            <Formel tex={rom(0)} /> liefert <Formel tex={w14.umgestellt} nach="." /> Eingesetzt in <Formel tex={rom(1)} nach=":" />
            <Umbruchformel {...loesungsFormelKurz(w14)} />
          </>,
          <>
            Probe mit <Formel tex={rom(2)} nach=":" />
            <Zeilen z={[w14.probe.links, w14.probe.rechts]} />
            Der Schnittpunkt ist <Formel tex={PK('S', ac.S)} nach="." />
          </>,
        ]}
      >
        <p>
          Die Gerade <Formel tex={gl(ac.g)} /> schneidet die <Formel tex="x_2" />-Achse in einem Punkt <Formel tex="S" nach="." /> Bestimme die <Formel tex="x_2" />-Koordinate von <Formel tex="S" nach="." />
        </p>
        <KontrollFigur spec={aufgAchse} unter={<>Die Gerade <Formel tex="g" /> trifft die <Formel tex="x_2" />-Achse im markierten Punkt <Formel tex={PK('S', ac.S)} nach="." /> Er liegt auf einer Achse und hat deshalb im Bild keinen Buchstaben.</>} />
      </Aufgabe>
    </Abschnitt>
  );
}
