import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Modulverweis } from '@/components/Modulverweis';
import { Figur } from '@/components/Raumfigur';
import { Umbruchformel } from '@/components/Umbruchformel';
import { t } from '@/lib/modulhilfen';
import { RAUM_SCHNEIDEN } from './Bilder';
import { E, E_PARAM, F, SCHNITT } from './daten';
import { ebenenprobeZeilen, gl, koordinatenformTeX, spalte } from './rechenhilfen';

export function Zusammenfassung() {
  const z = ebenenprobeZeilen(E_PARAM, F);
  return (
    <Abschnitt id="zusammenfassung" titel="Zusammenfassung">
      <h3>Die drei Fälle und ihre Erkennung</h3>
      <Hinweis art="merksatz" titel="Lage zweier Ebenen">
        Zwei Ebenen schneiden sich in einer <strong>Schnittgeraden</strong> (unendlich viele gemeinsame Punkte auf einer Geraden), sind <strong>echt parallel</strong> (kein gemeinsamer Punkt) oder <strong>identisch</strong> (alle Punkte gemeinsam). Einen einzelnen gemeinsamen Punkt gibt es nie.
      </Hinweis>
      <Hinweis art="merksatz" titel="Ebenenprobe (Parameterform und Koordinatenform)">
        Setze die Koordinaten <Formel tex={t`x_i=p_i+r\,u_i+s\,v_i`} /> der Parameterform in die Koordinatenform der anderen Ebene ein, multipliziere aus und fasse zusammen. Es entsteht <Formel tex={t`(\vec{n}\cdot\vec{u})\,r+(\vec{n}\cdot\vec{v})\,s=d-\vec{n}\cdot\vec{p}`} nach=":" />
        <ul>
          <li>Kommen <Formel tex="r" /> oder <Formel tex="s" /> vor: Die Ebenen schneiden sich. Löse nach einer Unbekannten auf und setze in die Parameterform ein, das ergibt die Schnittgerade.</li>
          <li>Beide fallen weg und die Aussage ist falsch (zum Beispiel <Formel tex={t`0=-6`} nach=")" />: Die Ebenen sind echt parallel.</li>
          <li>Beide fallen weg und die Aussage ist wahr (<Formel tex={t`0=0`} nach=")" />: Die Ebenen sind identisch.</li>
        </ul>
      </Hinweis>
      <Hinweis art="merksatz" titel="Zwei Koordinatenformen: Gauß-Verfahren">
        Die erweiterte Koeffizientenmatrix mit zwei Zeilen und drei Unbekannten auf Zeilenstufenform bringen. Zwei Pivots: eine freie Unbekannte, Schnittgerade (setze sie gleich <Formel tex="t" /> und löse die übrigen Unbekannten). Ein Widerspruch (<Formel tex={t`0=c`} /> mit <Formel tex={t`c\ne 0`} nach=")" />: echt parallel. Eine Nullzeile: identisch.
      </Hinweis>
      <Hinweis art="merksatz" titel="Schnelltest mit den Normalenvektoren">
        Normalenvektoren keine Vielfachen: Die Ebenen schneiden sich. Normalenvektoren Vielfache: Die Ebenen sind parallel oder identisch. Wird auch <Formel tex="d" /> mit demselben Faktor vervielfacht, sind sie identisch, sonst echt parallel.
      </Hinweis>
      <Hinweis art="merksatz" titel="Gleichsetzen und Angeben">
        Setzt du zwei Parameterformen gleich, entsteht ein Gleichungssystem mit drei Gleichungen und vier Unbekannten: eine freie Unbekannte heißt Schnittgerade, ein Widerspruch echt parallel, zwei freie Unbekannte identisch. Das ist aufwendiger als die Ebenenprobe. Für eine Ebene mit gegebener Lage wählst du denselben Normalenvektor (oder ein Vielfaches) für „parallel“ und „identisch“ und bestimmst <Formel tex="d" /> passend, für „schneiden“ einen Normalenvektor, der kein Vielfaches ist. Steckt ein Parameter in der Gleichung, bestimmst du ihn aus der Bedingung, dass die Normalenvektoren Vielfache sind, und prüfst dann <Formel tex="d" nach="." />
      </Hinweis>

      <h3>Übersicht: Lagebeziehungen im Raum</h3>
      <ul>
        <li>
          <strong>Zwei Geraden</strong> (<Modulverweis modul="gegenseitige-lage-geraden">Gegenseitige Lage von Geraden</Modulverweis>): identisch, echt parallel, schneiden sich in einem Punkt oder windschief. Verfahren: Richtungsvektoren vergleichen, Gleichsetzen.
        </li>
        <li>
          <strong>Gerade und Ebene</strong> (<Modulverweis modul="gerade-und-ebene">Gerade und Ebene</Modulverweis>): schneidet im Durchstoßpunkt, echt parallel oder liegt in der Ebene. Verfahren: Geradenprobe, Schnelltest <Formel tex={t`\vec{n}\cdot\vec{u}`} nach="." />
        </li>
        <li>
          <strong>Zwei Ebenen</strong> (dieses Modul): schneiden sich in einer Geraden, echt parallel oder identisch. Verfahren: Ebenenprobe, Gauß-Verfahren, Normalenvektoren.
        </li>
      </ul>

      <h3>Ein Beispiel mit vollständigem Rechenweg</h3>
      <p>
        Gegeben sind <Formel tex={t`E:\ \vec{x}=${spalte(E_PARAM.p)}+r\cdot${spalte(E_PARAM.u)}+s\cdot${spalte(E_PARAM.v)}`} /> und <Formel tex={koordinatenformTeX(F.n, F.d, 'F')} nach="." /> Ebenenprobe:
      </p>
      <Umbruchformel tex={z.tex} schmal={z.schmal} />
      <p>
        Es bleibt <Formel tex={z.gleichung} /> und daraus <Formel tex="r=-s" nach="." /> Eingesetzt in die Parameterform von <Formel tex="E" nach=":" />
      </p>
      <Umbruchformel
        tex={t`\vec{x}=${spalte(E_PARAM.p)}-s\cdot${spalte(E_PARAM.u)}+s\cdot${spalte(E_PARAM.v)}=${spalte(SCHNITT.p)}+s\cdot${spalte(SCHNITT.u)}`}
        schmal={t`\begin{gathered}\vec{x}=${spalte(E_PARAM.p)}-s\cdot${spalte(E_PARAM.u)}\\{}+s\cdot${spalte(E_PARAM.v)}\\{}=${spalte(SCHNITT.p)}+s\cdot${spalte(SCHNITT.u)}\end{gathered}`}
      />
      <p>
        Die Ebenen schneiden sich in <Formel tex={gl(SCHNITT, 's', 's')} nach="." /> Mit der Koordinatenform von <Formel tex="E" nach="," /> <Formel tex={koordinatenformTeX(E.n, E.d)} nach="," /> bestätigt der Schnelltest das Ergebnis: <Formel tex={t`\vec{n}_E=${spalte(E.n)}`} /> und <Formel tex={t`\vec{n}_F=${spalte(F.n)}`} /> sind keine Vielfachen.
      </p>
      <Figur oben spec={RAUM_SCHNEIDEN} unter={<><Formel tex="E" /> und <Formel tex="F" /> schneiden sich in der Geraden <Formel tex="s" nach="." /></>} />
      <Hinweis titel="Häufige Fehler">
        Aus vielfachen Normalenvektoren auf „echt parallel“ schließen, ohne <Formel tex="d" /> zu prüfen. Bei der Ebenenprobe die Klammern beim Einsetzen vergessen. Aus dem Wegfall von <Formel tex="r" /> und <Formel tex="s" /> auf „identisch“ schließen, ohne zu prüfen, ob die Aussage wahr oder falsch ist. Beim Gauß-Verfahren die freie Unbekannte nicht gleich <Formel tex="t" /> setzen und dadurch keine Geradengleichung bekommen. Den einzelnen Schnittpunkt von zwei Ebenen suchen, den es nie gibt.
      </Hinweis>
    </Abschnitt>
  );
}
