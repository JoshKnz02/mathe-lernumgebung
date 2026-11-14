import { DarstellungAnbieter } from '@/components/Raumbild';
import { Hinweise } from './Hinweise';
import { MitHilfsmittel } from './MitHilfsmittel';
import { OhneHilfsmittel } from './OhneHilfsmittel';
import { Problemloesen } from './Problemloesen';

export default function Modul() {
  return (
    <DarstellungAnbieter>
      <Hinweise />
      <OhneHilfsmittel />
      <MitHilfsmittel />
      <Problemloesen />
    </DarstellungAnbieter>
  );
}
