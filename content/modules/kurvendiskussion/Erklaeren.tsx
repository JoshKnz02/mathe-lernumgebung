import { Abschnitt } from '@/components/Abschnitt';
import { Formel } from '@/components/Formel';
import { Hinweis } from '@/components/Hinweis';
import { Bild } from '@/components/Messbild';
import { Modulverweis } from '@/components/Modulverweis';
import { Paarbild } from '@/components/Paarbild';
import { t } from '@/lib/modulhilfen';
import { BILD_LINKS, BILD_RECHTS, PAAR_ERKLAEREN } from './Bilder';

const KF = <Formel tex="K_f" />;
const KDF = <Formel tex="K_{f'}" />;

export function Erklaeren() {
  return (
    <Abschnitt id="erklaeren" titel="Erklären">
      <h3>Die zweite Ableitung und zwei Blickwinkel</h3>
      <p>
        Die Ableitung <Formel tex="f'" /> gibt für jede Stelle die Steigung der Tangente an {KF} an. Das kennst du aus dem Modul <Modulverweis modul="aenderungsraten">Von der mittleren zur momentanen Änderungsrate</Modulverweis>. Leitest du <Formel tex="f'" /> noch einmal ab, erhältst du die <strong>zweite Ableitung</strong> <Formel tex="f''" nach="." /> Die Schreibweisen <Formel tex="f''" /> und <Formel tex="f'''" /> stehen im Modul <Modulverweis modul="ableitungsregeln">Ableitungsregeln</Modulverweis>.
      </p>
      <p>
        Die zweite Ableitung <Formel tex="f''" /> ist die Änderungsrate der Steigung. Sie sagt, wie schnell sich die Steigung der Tangente ändert, wenn du {KF} von links nach rechts durchläufst. Zwei Blickwinkel helfen dabei:
      </p>
      <ul className="liste">
        <li>
          <strong>Der Bergsteiger</strong> geht auf {KF} von links nach rechts und achtet darauf, ob es bergauf oder bergab geht. Das ist die Steigung <Formel tex="f'" nach="," /> also die Monotonie. Sie hast du im Modul <Modulverweis modul="grafisches-differenzieren" abschnitt="zusammenfassung">Grafisches Differenzieren</Modulverweis> untersucht.
        </li>
        <li>
          <strong>Der Rennfahrer</strong> fährt dieselbe Strecke und achtet auf sein Lenkrad: Lenkt er nach links oder nach rechts? Seine Lenkrichtung zeigt, wie sich die Richtung der Tangente ändert. Das ist <Formel tex="f''" nach="." />
        </li>
      </ul>

      <h3>Linksgekrümmt und rechtsgekrümmt</h3>
      <p>
        Linkskurve und Rechtskurve kennst du aus dem Modul <Modulverweis modul="grafisches-differenzieren">Grafisches Differenzieren</Modulverweis>. Die Fachbegriffe lauten: {KF} ist auf einem Intervall <strong>linksgekrümmt</strong>, wenn die Steigung der Tangenten dort zunimmt, wenn also <Formel tex="f'" /> dort streng monoton steigt. {KF} ist <strong>rechtsgekrümmt</strong>, wenn die Steigung der Tangenten dort abnimmt, wenn also <Formel tex="f'" /> dort streng monoton fällt.
      </p>
      <div className="bilder-paar">
        <Bild daten={BILD_LINKS} unter={<>Linksgekrümmt: Die Steigungen der drei Tangenten nehmen von links nach rechts zu (<Formel tex="-1" nach="," /> <Formel tex="0" nach="," /> <Formel tex="1" nach=")." /></>} />
        <Bild daten={BILD_RECHTS} unter={<>Rechtsgekrümmt: Die Steigungen der drei Tangenten nehmen von links nach rechts ab (<Formel tex="1" nach="," /> <Formel tex="0" nach="," /> <Formel tex="-1" nach=")." /></>} />
      </div>
      <p>
        Eine <strong>Wendestelle</strong> ist eine Stelle, an der sich die Krümmung ändert. Der zugehörige Punkt <Formel tex={t`W(x_W\,|\,f(x_W))`} /> heißt <strong>Wendepunkt</strong>. Ebenso gehören zu einer Extremstelle ein <strong>Extrempunkt</strong> (Hochpunkt oder Tiefpunkt) und zu einer Sattelstelle ein <strong>Sattelpunkt</strong>. Ein Sattelpunkt ist ein Wendepunkt mit waagerechter Tangente.
      </p>

      <h3>Monotonie rechnerisch bestimmen</h3>
      <p>
        Du weißt: Wo <Formel tex="f'" /> positiv ist, ist {KF} streng monoton steigend, wo <Formel tex="f'" /> negativ ist, streng monoton fallend. Ohne Schaubild gehst du so vor:
      </p>
      <ol className="liste">
        <li>Die Ableitung <Formel tex="f'" /> bilden.</li>
        <li>Die Nullstellen von <Formel tex="f'" /> bestimmen.</li>
        <li>In jedem Bereich zwischen zwei benachbarten Nullstellen einen Testwert in <Formel tex="f'" /> einsetzen und das Vorzeichen bestimmen.</li>
        <li>Die Monotoniebereiche notieren.</li>
      </ol>
      <p>
        Ein Testwert genügt je Bereich, weil <Formel tex="f'" /> zwischen zwei benachbarten Nullstellen das Vorzeichen nicht wechseln kann: Dafür müsste <Formel tex="f'" /> dazwischen null sein. Die Ableitungen in diesem Modul haben keine Sprünge.
      </p>
      <h4>Beispiel</h4>
      <p>
        Gegeben ist <Formel tex={t`f(x)=\frac{1}{3}x^3-x^2-3x`} nach="." /> Die Ableitung ist <Formel tex={t`f'(x)=x^2-2x-3=(x+1)(x-3)`} nach="." /> Ihre Nullstellen sind <Formel tex="x=-1" /> und <Formel tex="x=3" nach="." />
      </p>
      <table className="tabelle tabelle-kompakt tabelle-breit">
        <caption>Vorzeichen von <Formel tex="f'" /> in den drei Bereichen</caption>
        <thead>
          <tr>
            <th scope="col">Bereich</th>
            <th scope="col">Testwert</th>
            <th scope="col">Vorzeichen von <Formel tex="f'" /></th>
            <th scope="col">Verhalten von {KF}</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><Formel tex={t`]-\infty;\,-1[`} /></td><td><Formel tex="f'(-2)=5" /></td><td>plus</td><td>streng monoton steigend</td></tr>
          <tr><td><Formel tex={t`]-1;\,3[`} /></td><td><Formel tex="f'(0)=-3" /></td><td>minus</td><td>streng monoton fallend</td></tr>
          <tr><td><Formel tex={t`]3;\,\infty[`} /></td><td><Formel tex="f'(4)=5" /></td><td>plus</td><td>streng monoton steigend</td></tr>
        </tbody>
      </table>
      <Paarbild
        daten={PAAR_ERKLAEREN}
        unter={
          <>
            Oben <Formel tex="K_f" nach="," /> darunter <Formel tex="K_{f'}" nach="." /> Auf der x-Achse sind die Bereiche blau markiert, in denen <Formel tex="f'" /> positiv ist ({KF} steigt), und schwarz, in denen <Formel tex="f'" /> negativ ist ({KF} fällt).
          </>
        }
      />
      <Hinweis titel="Schreibweise von Intervallen">
        Intervalle schreibst du wie im Bildungsplan mit nach außen geöffneten Klammern: <Formel tex={t`]a;\,b[`} /> ohne die Randstellen, <Formel tex={t`[a;\,b]`} /> mit den Randstellen, <Formel tex={t`]-\infty;\,-1[`} nach="." /> Unendlich gehört nie zum Intervall. Bei der Monotonie dürfen die Randstellen dazugehören: {KF} ist im Beispiel auch auf <Formel tex={t`]-\infty;\,-1]`} /> streng monoton steigend und auf <Formel tex={t`[-1;\,3]`} /> streng monoton fallend.
      </Hinweis>

      <h3>Notwendig und hinreichend</h3>
      <p>
        Für Extrem- und Wendepunkte brauchst du zwei Arten von Bedingungen. Zuerst die Wörter an einem Beispiel aus den Zahlen: Ist eine Zahl durch 4 teilbar, dann ist sie gerade. Die Teilbarkeit durch 4 ist <strong>hinreichend</strong> dafür, dass die Zahl gerade ist, denn sie genügt. Sie ist aber nicht <strong>notwendig</strong>, denn 6 ist gerade und nicht durch 4 teilbar. Umgekehrt ist „gerade“ notwendig dafür, durch 4 teilbar zu sein, aber nicht hinreichend, wieder wegen der 6.
      </p>
      <ul className="liste">
        <li>Eine <strong>notwendige Bedingung</strong> muss jede gesuchte Stelle erfüllen. Sie liefert Kandidaten, also Stellen, die in Frage kommen. Eine Stelle, die sie nicht erfüllt, scheidet aus.</li>
        <li>Eine <strong>hinreichende Bedingung</strong> genügt als Nachweis. Erfüllt ein Kandidat sie, ist die Stelle sicher eine gesuchte.</li>
      </ul>
      <p>
        Bei der Kurvendiskussion gehst du deshalb in zwei Schritten vor: erst die notwendige Bedingung, dann der Nachweis mit einer hinreichenden Bedingung. Welche Bedingungen das für Extrem- und Wendepunkte sind, findest du im Abschnitt Entdecken heraus.
      </p>
    </Abschnitt>
  );
}
