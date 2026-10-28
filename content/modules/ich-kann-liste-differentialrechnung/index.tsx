import { IchKannAuswertung, ZustandAnbieter } from '@/components/IchKann';
import { Aenderung } from './Aenderung';
import { Anleitung } from './Anleitung';
import { Anwendung } from './Anwendung';
import { ABSCHNITT_TITEL, AUSSAGEN, MODULE } from './daten';
import { Gleichungen } from './Gleichungen';
import { Kurve } from './Kurve';
import { Schaubild } from './Schaubild';
import { Tangenten } from './Tangenten';

function AuswertungBereich() {
  return <IchKannAuswertung aussagen={AUSSAGEN} bereiche="die sechs Bereiche" modulTitel={MODULE} abschnittTitel={ABSCHNITT_TITEL} />;
}

export default function Modul() {
  return (
    <ZustandAnbieter>
      <Anleitung />
      <Gleichungen />
      <Aenderung />
      <Tangenten />
      <Schaubild />
      <Kurve />
      <Anwendung />
      <AuswertungBereich />
    </ZustandAnbieter>
  );
}
