import { IchKannAuswertung, ZustandAnbieter } from '@/components/IchKann';
import { Anleitung } from './Anleitung';
import { Anwendung } from './Anwendung';
import { ABSCHNITT_TITEL, AUSSAGEN, MODULE } from './daten';
import { Gauss } from './Gauss';
import { Grundlagen } from './Grundlagen';
import { Loesbarkeit } from './Loesbarkeit';

function AuswertungBereich() {
  return <IchKannAuswertung aussagen={AUSSAGEN} bereiche="die vier Bereiche" modulTitel={MODULE} abschnittTitel={ABSCHNITT_TITEL} />;
}

export default function Modul() {
  return (
    <ZustandAnbieter>
      <div className="lgs-modul">
        <Anleitung />
        <Grundlagen />
        <Gauss />
        <Loesbarkeit />
        <Anwendung />
        <AuswertungBereich />
      </div>
    </ZustandAnbieter>
  );
}
