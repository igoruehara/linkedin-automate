import { createRoot } from 'react-dom/client';
import { App } from '../../interfaces/sidepanel/App';

// Entrypoint fino: o WXT registra o side panel; a UI vive na camada interfaces/.
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}
