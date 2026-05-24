import { ScoresComponent } from './App';
import './index.css';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('scores_spot');
const root = createRoot(container);
root.render(<ScoresComponent />);

