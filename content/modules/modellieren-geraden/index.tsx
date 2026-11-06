import { DarstellungAnbieter } from '@/components/Raumbild';
import { BewegungAbschnitt } from './Bewegung';
import { Erklaeren } from './Erklaeren';
import { SchattenAbschnitt } from './Schatten';
import { Ueberpruefen } from './Ueberpruefen';
import { Zusammenfassung } from './Zusammenfassung';

export default function Modul() {
  return (
    <DarstellungAnbieter>
      <Erklaeren />
      <BewegungAbschnitt />
      <SchattenAbschnitt />
      <Ueberpruefen />
      <Zusammenfassung />
    </DarstellungAnbieter>
  );
}
