import { useState } from 'react';
import { Formel } from '@/components/Formel';
import { Regler } from '@/components/Regler';
import { piTex, zahlTex } from '@/lib/zahlen';
import { UMKEHR_FUNKTIONEN, findeUmkehr, schnittstellenWaagerechte, wertU } from '@/lib/umkehr';
import { FARBE_F, FARBE_GERADE, FARBE_INV } from './daten';
import { UMKEHR_BEREICH, UmkehrZeichnung, spiegelpaar } from './UmkehrZeichnung';
import { FARBEN } from '@/components/Zeichenbrett';

const ZAHLWORT = ['keinem', 'einem', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn'];

/**
 * Labor zur Umkehrfunktion: Funktion wählen, Spiegelbild an y = x ansehen, Punkt und Spiegelpunkt verfolgen,
 * mit einer waagerechten Geraden prüfen, ob jeder Funktionswert nur einmal vorkommt. Die Tabelle nennt Bereiche und Umkehrterm.
 */
export function Umkehrlabor() {
  const [fId, setFId] = useState('par-rechts');
  const [x0, setX0] = useState(4);
  const [c, setC] = useState(3);
  const [zeigeSpiegel, setZeigeSpiegel] = useState(true);
  const [zeigePunkt, setZeigePunkt] = useState(true);
  const [zeigeGerade, setZeigeGerade] = useState(false);

  const u = findeUmkehr(fId);
  const paar = zeigePunkt ? spiegelpaar(u, x0) : null;
  const schnitt = zeigeGerade ? schnittstellenWaagerechte(u, c, UMKEHR_BEREICH[0], UMKEHR_BEREICH[1]) : [];
  const gegen = u.gegenbeispiel;
  const beschreibung = `Schaubild von f(x) = ${u.sprech}, die Spiegelachse y gleich x und das Spiegelbild von K_f an dieser Achse.${paar ? ` Der Punkt P mit den Koordinaten ${zahlTex(paar.p.x)} und ${zahlTex(paar.p.y)} wird zum Punkt P Strich mit den vertauschten Koordinaten.` : ''}${zeigeGerade ? ` Die waagerechte Gerade y gleich ${zahlTex(c)} schneidet K_f in ${schnitt.length} Punkten.` : ''} ${u.umkehrbar ? 'Die Funktion ist umkehrbar.' : 'Die Funktion ist nicht umkehrbar.'}`;

  return (
    <div className="labor">
      <UmkehrZeichnung f={fId} x0={zeigePunkt ? x0 : null} c={zeigeGerade ? c : null} spiegel={zeigeSpiegel} beschreibung={beschreibung} />

      <ul className="legende" aria-label="Legende">
        <li><span className="legende-farbe" style={{ background: FARBE_F }} aria-hidden="true" /> <Formel tex="K_f" /></li>
        <li><span className="legende-farbe" style={{ background: FARBE_INV }} aria-hidden="true" /> Spiegelbild von <Formel tex="K_f" /> an <Formel tex="y=x" /></li>
        <li><span className="legende-farbe" style={{ background: FARBEN.vergleich }} aria-hidden="true" /> Spiegelachse <Formel tex="y=x" /> (gestrichelt)</li>
        {zeigeGerade && <li><span className="legende-farbe" style={{ background: FARBE_GERADE }} aria-hidden="true" /> Gerade <Formel tex={`y=${zahlTex(c)}`} /> mit ihren Schnittpunkten</li>}
      </ul>

      <div className="labor-gleichung" aria-live="polite">
        <Formel anzeige tex={`f(x)=${u.tex}\\qquad D_f=${u.dTex}`} />
        {zeigePunkt && (paar ? (
          <p>
            <Formel tex={`P(${zahlTex(paar.p.x)}\\,|\\,${zahlTex(paar.p.y)})`} /> auf <Formel tex="K_f" /> wird zu <Formel tex={`P'(${zahlTex(paar.q.x)}\\,|\\,${zahlTex(paar.q.y)})`} nach="." />
            {[paar.p.x, paar.p.y].some((v) => Math.abs(v) > UMKEHR_BEREICH[1]) ? ' Ein Punkt liegt außerhalb des sichtbaren Ausschnitts.' : ''}
          </p>
        ) : (
          <p className="klein">Die Stelle <Formel tex="x_0" /> gehört nicht zum Definitionsbereich von <Formel tex="f" nach="." /></p>
        ))}
        {zeigeGerade && (
          <p>
            Die Gerade <Formel tex={`y=${zahlTex(c)}`} /> schneidet <Formel tex="K_f" /> in {schnitt.length === 0 ? 'keinem Punkt' : schnitt.length === 1 ? 'einem Punkt' : `${ZAHLWORT[schnitt.length] ?? schnitt.length} Punkten`}.
          </p>
        )}
      </div>

      <div className="labor-bedienung">
        <fieldset className="schalter-gruppe">
          <legend>Funktion <Formel tex="f" /></legend>
          <div className="schnellwahl">
            {UMKEHR_FUNKTIONEN.map((fn) => (
              <button key={fn.id} type="button" className="chip" aria-pressed={fId === fn.id} aria-label={fn.sprech} onClick={() => setFId(fn.id)}>
                <Formel tex={fn.einschr ? `${fn.tex}\\ (${fn.einschr})` : fn.tex} />
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <div className="regler-gruppe">
            <Regler name="Stelle x0" beschriftung={<Formel tex="x_0" />} wert={x0} min={-5} max={5} step={0.5} onChange={setX0} anzeige={<Formel tex={zahlTex(x0)} />} />
            <Regler name="Höhe c der Geraden" beschriftung={<Formel tex="c" />} wert={c} min={-5} max={5} step={0.5} onChange={setC} anzeige={<Formel tex={zahlTex(c)} />} />
          </div>
          <fieldset className="schalter-gruppe">
            <legend className="nur-lesegeraet">Anzeige</legend>
            <label className="schalter"><input type="checkbox" checked={zeigeSpiegel} onChange={(e) => setZeigeSpiegel(e.target.checked)} /> Spiegelbild von <Formel tex="K_f" /> anzeigen</label>
            <label className="schalter"><input type="checkbox" checked={zeigePunkt} onChange={(e) => setZeigePunkt(e.target.checked)} /> Punkt <Formel tex="P" /> und Spiegelpunkt <Formel tex="P'" /> anzeigen</label>
            <label className="schalter"><input type="checkbox" checked={zeigeGerade} onChange={(e) => setZeigeGerade(e.target.checked)} /> waagerechte Gerade <Formel tex="y=c" /> anzeigen</label>
          </fieldset>
        </div>
      </div>

      <table className="tabelle tabelle-kompakt">
        <caption>Eigenschaften von <Formel tex="f" /> und, falls vorhanden, ihrer Umkehrfunktion</caption>
        <tbody>
          <tr><th scope="row">Definitionsbereich <Formel tex="D_f" /></th><td><Formel tex={u.dTex} /></td></tr>
          <tr><th scope="row">Wertebereich <Formel tex="W_f" /></th><td><Formel tex={u.wTex} /></td></tr>
          <tr>
            <th scope="row">umkehrbar?</th>
            <td>
              {u.umkehrbar ? (
                'ja'
              ) : gegen ? (
                <>
                  nein, zum Beispiel <Formel tex={`f(${piTex(gegen.x1)})=f(${piTex(gegen.x2)})=${zahlTex(wertU(u, gegen.x1))}`} />
                </>
              ) : (
                'nein'
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">Umkehrfunktion</th>
            <td>{u.umkehrbar ? <><Formel tex={`f^{-1}(x)=${u.invTex}`} />{u.invName ? <> ({u.invName})</> : null}</> : '–'}</td>
          </tr>
          <tr><th scope="row"><Formel tex={String.raw`D_{f^{-1}}`} /></th><td>{u.umkehrbar ? <Formel tex={u.wTex} /> : '–'}</td></tr>
          <tr><th scope="row"><Formel tex={String.raw`W_{f^{-1}}`} /></th><td>{u.umkehrbar ? <Formel tex={u.dTex} /> : '–'}</td></tr>
        </tbody>
      </table>

      <div className="labor-knoepfe">
        <span className="klein">Die Angaben der Tabelle sind von Hand bestimmt und im Test gegen die Rechnung geprüft.</span>
        <button type="button" className="knopf-zweit" onClick={() => { setFId('par-rechts'); setX0(4); setC(3); setZeigeSpiegel(true); setZeigePunkt(true); setZeigeGerade(false); }}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
