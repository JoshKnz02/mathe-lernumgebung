import { DarstellungAnbieter } from '@/components/Raumbild';
import { Entdecken } from './Entdecken';
import { Erklaeren } from './Erklaeren';
import { Ueberpruefen } from './Ueberpruefen';
import { Wege } from './Wege';
import { Zusammenfassung } from './Zusammenfassung';

export default function Modul() {
  return (
    <DarstellungAnbieter>
      <Erklaeren />
      <Entdecken />
      <Wege />
      <Ueberpruefen />
      <Zusammenfassung />
    </DarstellungAnbieter>
  );
}
