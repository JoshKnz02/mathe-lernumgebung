import { Entdecken } from './Entdecken';
import { Erklaeren } from './Erklaeren';
import { Ueberpruefen } from './Ueberpruefen';
import { Zusammenfassung } from './Zusammenfassung';

export default function Modul() {
  return (
    <div className="lgs-modul lgs-lb">
      <Erklaeren />
      <Entdecken />
      <Ueberpruefen />
      <Zusammenfassung />
    </div>
  );
}
