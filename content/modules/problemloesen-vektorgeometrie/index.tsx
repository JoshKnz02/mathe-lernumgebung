import { DarstellungAnbieter } from '@/components/Raumbild';
import { Bildpunkt } from './Bildpunkt';
import { PunkteVertauschen } from './PunkteVertauschen';
import { Vorgehen } from './Vorgehen';
import { Zusammenfassung } from './Zusammenfassung';

export default function Modul() {
  return (
    <DarstellungAnbieter>
      <Vorgehen />
      <PunkteVertauschen />
      <Bildpunkt />
      <Zusammenfassung />
    </DarstellungAnbieter>
  );
}
