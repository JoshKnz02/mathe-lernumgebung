import { inhalt, ladeModul } from 'virtual:lernumgebung';
import { AppInhalt } from './AppInhalt';
import { useRoute } from './router';

export function App() {
  const route = useRoute();
  return <AppInhalt inhalt={inhalt} route={route} entwuerfe={__ENTWUERFE__} lader={ladeModul} bauInfo={__BAU_INFO__} />;
}
