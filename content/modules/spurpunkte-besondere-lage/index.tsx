import { DarstellungAnbieter } from '@/components/Raumbild';
import { Entdecken } from './Entdecken';
import { Erklaeren } from './Erklaeren';
import { Ueberpruefen } from './Ueberpruefen';
import { Venn } from './Venn';
import { Zusammenfassung } from './Zusammenfassung';

export default function Modul() {
  return (
    <DarstellungAnbieter>
      <Erklaeren />
      <Entdecken />
      <Ueberpruefen />
      <Venn />
      <Zusammenfassung />
    </DarstellungAnbieter>
  );
}
