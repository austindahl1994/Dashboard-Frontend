import Toasts from './Toasts'
import { ToastProvider } from './ToastContext'
import CharacterGeneration from "./widgets/CharGen/CharacterGeneration";

function App() {
  return (
    <ToastProvider>
      <Toasts />
      <CharacterGeneration />
    </ToastProvider>
  );
}

export default App;
