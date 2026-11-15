import { IchKannAuswertung, ZustandAnbieter } from '@/components/IchKann';
import { Anleitung } from './Anleitung';
import { ABSCHNITT_TITEL, AUSSAGEN, MODULE } from './daten';
import { Ebenen } from './Ebenen';
import { Geraden } from './Geraden';
import { Vektoren } from './Vektoren';

function AuswertungBereich() {
  return <IchKannAuswertung aussagen={AUSSAGEN} bereiche="die drei Bereiche" modulTitel={MODULE} abschnittTitel={ABSCHNITT_TITEL} />;
}

export default function Modul() {
  return (
    <ZustandAnbieter>
      <div className="vektorgeometrie-ichkann-modul">
        <Anleitung />
        <Vektoren />
        <Geraden />
        <Ebenen />
        <AuswertungBereich />
      </div>
    </ZustandAnbieter>
  );
}
