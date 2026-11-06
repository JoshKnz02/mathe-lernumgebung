import { useId, useState, type ReactNode } from 'react';
import { Abschnitt } from '@/components/Abschnitt';
import { Auswahlfrage } from '@/components/Auswahlfrage';
import { Beobachtung } from '@/components/Beobachtung';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Raumbild } from '@/components/Raumbild';
import { VennDiagramm } from '@/components/VennDiagramm';
import { NULL_KOORDINATE, koordinatenParameter, spurpunkte, verschiedeneSpurpunkte, vennMitglied, lage, type Gerade } from '@/lib/gerade';
import { bruch, punktBruchTeX, punktTeX } from '@/lib/geradenhilfen';
import { wortKoordinaten } from '@/lib/laborhilfen';
import { opt, platziere, t } from '@/lib/modulhilfen';
import { EBENEN_NAME, type Punkt3, type RaumBildSpec } from '@/lib/schraegbild';
import { mitgliedVon, regionText, regionVon, type Region } from '@/lib/venn';
import { spalte } from '@/lib/laborhilfen';
import { spurBild } from './Bilder';
import { SPUR_TEX, VENN_AUFGABEN, VENN_BEISPIELE, VENN_LEER, VENN_MENGEN, VENN_NAMEN, VENN_P } from './daten';

const P = VENN_P;
const ja = (b: boolean) => (b ? 'ja' : 'nein');
const gl = (g: Gerade, name = 'g') => t`${name}:\ \vec{x}=${spalte(g.p)}+t\cdot${spalte(g.u)}`;
const ordnung = ['1.', '2.', '3.'];

/** Begründung zur ersten Eigenschaft: parallel zu mindestens einer Koordinatenebene (echt parallel). */
export function begruendungParallel(g: Gerade): ReactNode {
  const l = lage(g);
  if (l.parallelEbenen.length === 0) return <>Keine Koordinate des Richtungsvektors ist 0. Die Gerade durchstößt alle drei Koordinatenebenen und ist zu keiner parallel.</>;
  return (
    <>
      {l.parallelEbenen.map((e) => {
        const i = NULL_KOORDINATE[e];
        return (
          <span key={e}>
            Die {ordnung[i]} Koordinate des Richtungsvektors ist 0, die des Stützvektors ist <Formel tex={`${g.p[i]}`} /> und nicht 0: parallel zur <Formel tex={`x_${[1, 2, 3].filter((k) => k !== i + 1).join('x_')}`} />-Ebene.{' '}
          </span>
        );
      })}
    </>
  );
}

/** Begründung zur zweiten Eigenschaft: genau ein Spurpunkt (verschiedene Punkte gezählt). */
export function begruendungSpur(g: Gerade): ReactNode {
  const alle = spurpunkte(g);
  const verschieden = verschiedeneSpurpunkte(g);
  return (
    <>
      Spurpunkte:{' '}
      {alle.map((s, k) => (
        <span key={s.ebene}>
          <Formel tex={punktBruchTeX(SPUR_TEX[s.ebene], s.punkt)} nach={k < alle.length - 1 ? ',' : '.'} />{' '}
        </span>
      ))}
      {verschieden.length < alle.length
        ? `Sie fallen zusammen, es sind ${verschieden.length === 1 ? 'nur ein verschiedener Punkt' : `${verschieden.length} verschiedene Punkte`}.`
        : alle.length === 1
          ? 'Bei den anderen beiden Koordinatenebenen ist die entsprechende Koordinate des Richtungsvektors 0, die Gerade erreicht sie nie. Es gibt nur diesen einen Spurpunkt.'
          : `Es sind ${alle.length} verschiedene Punkte.`}
    </>
  );
}

/** Begründung zur dritten Eigenschaft: Punktprobe mit P. */
export function begruendungPunkt(g: Gerade): ReactNode {
  const par = koordinatenParameter(g, P);
  const werte = par.filter((v): v is number => v !== null);
  const verschieden = new Set(werte.map((v) => v.toFixed(9))).size;
  const festOk = par.every((v, i) => v !== null || g.p[i] === P[i]);
  if (verschieden <= 1 && festOk) return <>Punktprobe: Für <Formel tex={`t=${bruch(werte[0] ?? 0)}`} /> ergibt jede Gleichung die Koordinate von <Formel tex="P" nach="." /> P liegt auf g.</>;
  const fehler = par.findIndex((v, i) => v === null && g.p[i] !== P[i]);
  if (fehler >= 0) return <>Die {ordnung[fehler]} Koordinate des Richtungsvektors ist 0, also ist <Formel tex={`x_${fehler + 1}=${g.p[fehler]}`} /> auf der ganzen Geraden. P hat dort <Formel tex={`${P[fehler]}`} nach="." /> P liegt nicht auf g.</>;
  return (
    <>
      Die Gleichungen verlangen verschiedene Werte von <Formel tex="t" nach=":" />{' '}
      {par.map((v, i) => (v === null ? null : <span key={i}><Formel tex={`x_${i + 1}\\colon t=${bruch(v)}`} nach={i < 2 ? ',' : '.'} />{' '}</span>))}P liegt nicht auf g.
    </>
  );
}

const BEGRUENDUNGEN = [begruendungParallel, begruendungSpur, begruendungPunkt];

/** Die drei Eigenschaften einer Geraden mit Ja oder Nein und einer Begründung. */
export function Eigenschaften({ g }: { g: Gerade }) {
  const m = vennMitglied(g, P);
  return (
    <dl className="eigenschaften">
      {BEGRUENDUNGEN.map((b, i) => (
        <div key={VENN_MENGEN[i]!.kurz}>
          <dt>
            {VENN_NAMEN[i]} ({VENN_MENGEN[i]!.kurz}): {ja(m[i]!)}
          </dt>
          <dd>{b(g)}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Bild der Venn-Aufgabe: die Gerade, die Koordinatenebenen, der Punkt P und die Spurpunkte. */
export function vennBild(g: Gerade): RaumBildSpec {
  return spurBild(g, {
    punkte: [{ name: 'P', p: P as Punkt3 }],
    sprech: `Schrägbild mit den drei Koordinatenebenen. Die schwarz gestrichelte Gerade und der Punkt P bei ${wortKoordinaten(P)} sind eingezeichnet, dazu die Spurpunkte der Geraden mit den Koordinatenebenen.`,
  }).spec;
}

/** Prüfer: Zu einer gewählten Gerade zeigt er das Bild, die drei Eigenschaften mit Begründung und die Region im Venn-Diagramm. */
export function Pruefer() {
  const basis = useId();
  const [gewaehlt, setGewaehlt] = useState(VENN_BEISPIELE[0]!.id);
  const b = VENN_BEISPIELE.find((x) => x.id === gewaehlt)!;
  const region = regionVon(vennMitglied(b.g, P));
  return (
    <div className="venn-pruefer">
      <fieldset className="venn-auswahl">
        <legend className="nur-lesegeraet">Gerade wählen</legend>
        {VENN_BEISPIELE.map((x) => (
          <label key={x.id}>
            <input type="radio" name={`${basis}-g`} value={x.id} checked={gewaehlt === x.id} onChange={() => setGewaehlt(x.id)} />
            <Formel tex={gl(x.g, `g_${x.id.slice(1)}`)} />
          </label>
        ))}
      </fieldset>
      <figure className="bild">
        <Raumbild spec={vennBild(b.g)} />
        <figcaption>
          Die Gerade (gestrichelt), der Punkt <Formel tex={punktTeX('P', P)} /> und die Spurpunkte. Koordinatenebenen (durchsichtig): <Formel tex="x_1x_2" /> hellblau, <Formel tex="x_1x_3" /> grün, <Formel tex="x_2x_3" /> gelborange. Liegt ein Spurpunkt im Ursprung, steht dort kein Buchstabe.
        </figcaption>
      </figure>
      <section aria-label="Eigenschaften der gewählten Geraden">
        <h4>
          Eigenschaften von <Formel tex={gl(b.g, `g_${b.id.slice(1)}`)} />
        </h4>
        <Eigenschaften g={b.g} />
      </section>
      <figure className="bild">
        <VennDiagramm mengen={VENN_MENGEN} markiert={region} leer={VENN_LEER} />
        <figcaption>Die Gerade gehört in die Region {region}.</figcaption>
      </figure>
      <p aria-live="polite" className="nur-lesegeraet">Region {region} ist markiert.</p>
    </div>
  );
}

/** Unterschiede zwischen einer gewählten Region und der Geraden in Worten. */
function unterschiede(g: Gerade, r: Region): string {
  const soll = mitgliedVon(r);
  const ist = vennMitglied(g, P);
  const text = [
    (b: boolean) => (b ? 'ist parallel zu einer Koordinatenebene' : 'ist zu keiner Koordinatenebene parallel'),
    (b: boolean) => (b ? 'hat genau einen Spurpunkt' : 'hat nicht genau einen Spurpunkt'),
    (b: boolean) => (b ? 'geht durch P' : 'geht nicht durch P'),
  ];
  return [0, 1, 2].filter((i) => soll[i] !== ist[i]).map((i) => text[i]!(ist[i]!)).join(' und ');
}

export function Venn() {
  return (
    <Abschnitt id="venn" titel="Venn-Aufgabe">
      <h3>Drei Eigenschaften einer Geraden</h3>
      <p>
        Alle Geraden werden im Raum betrachtet und liegen in keiner Koordinatenebene. Die drei Eigenschaften:
      </p>
      <dl className="eigenschaften">
        <div>
          <dt>K: parallel zu einer Koordinatenebene</dt>
          <dd>Die Gerade hat mit mindestens einer der drei Koordinatenebenen keinen gemeinsamen Punkt.</dd>
        </div>
        <div>
          <dt>S: genau ein Spurpunkt</dt>
          <dd>Die Gerade hat genau einen Spurpunkt. Es zählen verschiedene Punkte: Fallen Spurpunkte zusammen (zum Beispiel im Ursprung), zählt der Punkt einmal.</dd>
        </div>
        <div>
          <dt>P: durch den Punkt P</dt>
          <dd>
            Die Gerade verläuft durch <Formel tex={punktTeX('P', P)} nach="." />
          </dd>
        </div>
      </dl>
      <figure className="bild">
        <VennDiagramm mengen={VENN_MENGEN} leer={VENN_LEER} />
        <figcaption>Blau durchgezogen: K, orange gestrichelt: S, grün gepunktet: P. Die Regionen A bis H sind beschriftet.</figcaption>
      </figure>
      <p>
        <strong>Aufgabe:</strong> Finde für jede Region A bis H eine Gerade in Parameterform. Wenn du für eine Region keine findest, begründe, warum es keine geben kann.
      </p>

      <h3>Vermutung</h3>
      <p>Überlege zuerst, bevor du weiterliest. Notiere deine Vermutung.</p>
      <ol className="auftraege">
        <li>
          <p>Gibt es zu jeder der acht Regionen eine Gerade? Welche Regionen sind schwer zu besetzen?</p>
          <Beobachtung>
            Zu allen acht Regionen gibt es Geraden, du siehst Beispiele im Prüfer. Schwierig sind die Regionen B und E: Eine Gerade, die zu keiner Koordinatenebene parallel ist, hat in jeder Koordinatenebene einen Spurpunkt. Genau ein verschiedener Spurpunkt bedeutet, dass alle drei Spurpunkte zusammenfallen. Das geschieht nur im Ursprung, also bei Geraden durch den Ursprung. Zählte man die drei Spurpunkte getrennt, auch wenn sie im selben Punkt liegen, wären B und E leer. Deshalb zählen verschiedene Punkte.
          </Beobachtung>
        </li>
      </ol>

      <h3>Der Prüfer</h3>
      <p>
        Wähle eine Gerade. Der Prüfer zeigt das Bild, die drei Eigenschaften mit Begründung und die Region im Venn-Diagramm. Die Geraden sind durchgemischt, nicht nach Regionen geordnet. Jede Region kommt genau einmal vor.
      </p>
      <Pruefer />

      <h3>Aufgaben</h3>
      <p>Bestimme jeweils die Region der Geraden. Prüfe dazu die drei Eigenschaften nacheinander.</p>
      {VENN_AUFGABEN.map((a, k) => (
        <Auswahlfrage
          key={k}
          nummer={`V${k + 1}`}
          titel="In welche Region gehört die Gerade?"
          optionen={platziere(
            [
              opt(
                a.region,
                <>Region {a.region}: {regionText(a.region, VENN_NAMEN)}</>,
                true,
                <>Richtig. Die Gerade ist in Region {a.region}, denn sie hat genau diese Eigenschaften: {regionText(a.region, VENN_NAMEN)}.</>,
              ),
              ...a.falsch.map((r) =>
                opt(r, <>Region {r}: {regionText(r, VENN_NAMEN)}</>, false, <>Region {r} passt nicht. Die Gerade {unterschiede(a.g, r)}.</>),
              ),
            ],
            [1, 3, 0, 2][k]!,
          )}
          erklaerung={<><Eigenschaften g={a.g} /></>}
        >
          <p>
            Gegeben ist <Formel tex={gl(a.g)} nach="." /> Der Punkt ist <Formel tex={punktTeX('P', P)} nach="." />
          </p>
        </Auswahlfrage>
      ))}
      <Hinweis titel="Zählweise der Spurpunkte">
        In dieser Aufgabe zählen verschiedene Punkte. Geht eine Gerade durch den Ursprung, durchstößt sie alle drei Koordinatenebenen in demselben Punkt, dem Ursprung, und hat genau einen Spurpunkt. Würde man die Spurpunkte je Ebene getrennt zählen, hätte jede Gerade ohne Parallelität drei Spurpunkte.
      </Hinweis>
    </Abschnitt>
  );
}
