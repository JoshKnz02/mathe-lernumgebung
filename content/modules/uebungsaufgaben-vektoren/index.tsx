import { DarstellungAnbieter } from '@/components/Raumbild';
import { Hinweise } from './Hinweise';
import { MitHilfsmittel } from './MitHilfsmittel';
import { OhneHilfsmittel } from './OhneHilfsmittel';

export default function Modul() {
  return (
    <DarstellungAnbieter>
      <Hinweise />
      <OhneHilfsmittel />
      <MitHilfsmittel />
    </DarstellungAnbieter>
  );
}
