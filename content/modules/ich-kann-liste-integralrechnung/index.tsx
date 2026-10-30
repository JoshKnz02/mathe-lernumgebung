import { IchKannAuswertung, ZustandAnbieter } from '@/components/IchKann';
import { Anleitung } from './Anleitung';
import { ABSCHNITT_TITEL, AUSSAGEN, MODULE } from './daten';
import { Flaechen } from './Flaechen';
import { Gesamtaenderung } from './Gesamtaenderung';
import { Integral } from './Integral';
import { Integralfunktion } from './Integralfunktion';
import { Mittelwert } from './Mittelwert';
import { Stammfunktionen } from './Stammfunktionen';

function AuswertungBereich() {
  return <IchKannAuswertung aussagen={AUSSAGEN} bereiche="die sechs Bereiche" modulTitel={MODULE} abschnittTitel={ABSCHNITT_TITEL} />;
}

export default function Modul() {
  return (
    <ZustandAnbieter>
      <Anleitung />
      <Stammfunktionen />
      <Gesamtaenderung />
      <Integral />
      <Integralfunktion />
      <Flaechen />
      <Mittelwert />
      <AuswertungBereich />
    </ZustandAnbieter>
  );
}
