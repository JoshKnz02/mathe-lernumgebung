import { Hinweise } from './Hinweise';
import { MitHilfsmittel } from './MitHilfsmittel';
import { OhneHilfsmittel } from './OhneHilfsmittel';

export default function Modul() {
  return (
    <>
      <Hinweise />
      <OhneHilfsmittel />
      <MitHilfsmittel />
    </>
  );
}
