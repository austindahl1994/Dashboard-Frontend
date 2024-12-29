import Toasts from './Toasts'
import { ToastProvider } from './ToastContext'
import CharacterGeneration from "./widgets/CharGen/CharacterGeneration";

function App() {
  return (
    <ToastProvider>
      <div>
        <Toasts />
      </div>
      <CharacterGeneration />
    </ToastProvider>
  );
}

export default App;
